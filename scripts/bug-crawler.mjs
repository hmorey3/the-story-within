import Anthropic from '@anthropic-ai/sdk';
import { spawn } from 'child_process';
import { createInterface } from 'readline';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const TARGET_URL = process.env.TARGET_URL || 'https://selfenergycircle.kayos.ai/join';
const MAX_ITERATIONS = 30;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpBin = path.resolve(__dirname, 'node_modules/.bin/mcp-server-playwright');
const AUTH_STATE_PATH = path.resolve(__dirname, '.auth-state.json');

const SYSTEM_PROMPT = `You are a QA engineer doing automated browser testing. Your job is to find real, meaningful bugs — not to nitpick.

## Safety rules — follow these without exception
- READ ONLY: browse and observe, never submit forms that create or modify real data
- Do NOT send any messages, chats, posts, or comments to other users or groups
- Do NOT delete, archive, or modify any content you did not create in this session
- Do NOT make purchases, trigger payments, or initiate any transactions
- Do NOT sign up for anything or create accounts
- Do NOT click "invite", "share", or "notify" controls that would contact other people
- If you accidentally land on a destructive or social action, navigate away immediately without confirming

## What to test
- Navigate to pages and follow links
- Take screenshots to check for visual/layout issues
- Monitor JavaScript console errors
- Verify that links and resources load correctly (check for 404s, failed requests)
- Test interactive elements (buttons, forms, navigation) by observing their behavior, not by submitting real data

## Severity definitions — only report bugs that meet these bars
- critical: core functionality is completely broken (e.g. can't sign up, can't log in, page crashes)
- high: a primary user action fails or produces wrong results
- medium: a secondary feature is broken or behaves incorrectly in a confusing way
- low: a noticeable UX problem that affects usability but has a workaround

## Do NOT report
- Minor copy/wording preferences or stylistic opinions
- Cosmetic font or spacing inconsistencies that don't impair usability
- Expected redirect behavior (e.g. / → /login when unauthenticated)
- Missing features or enhancements — only actual broken behavior

For each real bug, provide numbered steps to reproduce so a developer can confirm it.

When you have finished crawling, output a fenced JSON block as the LAST thing in your response (no text after it). Sort bugs: critical first, then high, medium, low.

\`\`\`json
{"bugs": [{"title": "...", "severity": "critical|high|medium|low", "description": "...", "url": "...", "steps_to_reproduce": "1. Go to ... 2. Click ... 3. Observe ..."}]}
\`\`\`

If no bugs are found, output:
\`\`\`json
{"bugs": []}
\`\`\``;

// Minimal JSON-RPC stdio client that bypasses MCP SDK schema validation
class RawMcpClient {
  constructor(command, args) {
    this.proc = spawn(command, args, { env: process.env, stdio: ['pipe', 'pipe', 'inherit'] });
    this.rl = createInterface({ input: this.proc.stdout });
    this.pending = new Map();
    this.nextId = 1;

    this.rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
        if (msg.id != null && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      } catch { /* ignore non-JSON lines */ }
    });

    this.proc.on('error', (err) => console.error('MCP process error:', err));
  }

  request(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
      this.proc.stdin.write(msg);
    });
  }

  async initialize() {
    return this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'bug-crawler', version: '1.0.0' },
    });
  }

  async listTools() {
    const result = await this.request('tools/list');
    return result.tools ?? [];
  }

  async callTool(name, args) {
    const result = await this.request('tools/call', { name, arguments: args });
    return result.content ?? [];
  }

  close() {
    this.proc.kill();
  }
}

// Convert MCP tool result content to Anthropic tool_result content format
function normalizeMcpContent(content) {
  return (content ?? []).map((block) => {
    if (block.type === 'image') {
      return {
        type: 'image',
        source: {
          type: 'base64',
          media_type: block.mimeType ?? 'image/png',
          data: block.data,
        },
      };
    }
    return block;
  });
}

async function main() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const mcpArgs = ['--headless'];

  const sessionCookie = process.env.SESSION_COOKIE;
  if (sessionCookie) {
    const domain = new URL(TARGET_URL).hostname;
    const storageState = {
      cookies: [{
        name: 'connect.sid',
        value: sessionCookie,
        domain,
        path: '/',
        expires: -1,
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      }],
      origins: [],
    };
    writeFileSync(AUTH_STATE_PATH, JSON.stringify(storageState, null, 2));
    mcpArgs.push('--storage-state', AUTH_STATE_PATH);
    console.log('Using authenticated session cookie.');
  }

  const mcpClient = new RawMcpClient(mcpBin, mcpArgs);
  await mcpClient.initialize();

  const mcpTools = await mcpClient.listTools();
  const tools = mcpTools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: { type: 'object', ...(t.inputSchema ?? {}) },
  }));

  console.log(`Connected to Playwright MCP. ${tools.length} tools available.`);
  console.log(`Crawling: ${TARGET_URL}`);

  const messages = [
    {
      role: 'user',
      content: `Crawl ${TARGET_URL} for bugs. Check for: visual/layout issues, broken links (404s), and JavaScript console errors. Be thorough — follow links, check images, and test interactive elements.`,
    },
  ];

  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    console.log(`[${iterations}/${MAX_ITERATIONS}] Calling model...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      tools,
      messages,
      system: SYSTEM_PROMPT,
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') {
      console.log('Agent finished.');
      break;
    }

    if (response.stop_reason === 'tool_use') {
      const toolResults = [];
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;
        console.log(`  -> ${block.name}`);
        let result;
        try {
          const raw = await mcpClient.callTool(block.name, block.input);
          result = normalizeMcpContent(raw);
        } catch (err) {
          result = [{ type: 'text', text: `Error: ${err.message}` }];
        }
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }
      messages.push({ role: 'user', content: toolResults });
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    console.warn('Hit max iterations — forcing final report.');
    const finalResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        ...messages,
        { role: 'user', content: 'Summarize all bugs found so far and output the JSON report now.' },
      ],
      system: SYSTEM_PROMPT,
    });
    messages.push({ role: 'assistant', content: finalResponse.content });
  }

  mcpClient.close();
  if (existsSync(AUTH_STATE_PATH)) unlinkSync(AUTH_STATE_PATH);

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  const text = (lastAssistant?.content ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  let bugs = [];
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match) {
    try {
      bugs = JSON.parse(match[1]).bugs ?? [];
    } catch {
      console.error('Failed to parse bug JSON from agent output. Raw text:\n', text);
    }
  } else {
    console.warn('No JSON block found in agent output.');
  }

  console.log(`Found ${bugs.length} bug(s).`);

  const report = { url: TARGET_URL, date: new Date().toISOString(), total: bugs.length, bugs };
  const jsonReport = JSON.stringify(report, null, 2);
  const mdReport = buildMarkdown(report);

  writeFileSync('bug-report.json', jsonReport);
  writeFileSync('bug-report.md', mdReport);
  console.log('Reports written: bug-report.json, bug-report.md');

  await sendEmail(mdReport, jsonReport);
}

async function sendEmail(markdownReport, jsonReport) {
  const { SMTP_USER, SMTP_PASS, RECIPIENT_EMAIL } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !RECIPIENT_EMAIL) {
    console.log('SMTP not configured — skipping email.');
    return;
  }
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transport.sendMail({
    from: SMTP_USER,
    to: RECIPIENT_EMAIL,
    subject: `Bug Report: ${TARGET_URL} — ${new Date().toDateString()}`,
    text: markdownReport,
    attachments: [{ filename: 'bug-report.json', content: jsonReport }],
  });
  console.log(`Email sent to ${RECIPIENT_EMAIL}`);
}

function buildMarkdown({ url, date, bugs }) {
  const severityOrder = ['critical', 'high', 'medium', 'low'];
  const grouped = Object.fromEntries(severityOrder.map((s) => [s, []]));
  for (const bug of bugs) {
    (grouped[bug.severity] ?? grouped.low).push(bug);
  }

  const lines = [
    `# Bug Report`,
    `**URL:** ${url}`,
    `**Date:** ${new Date(date).toUTCString()}`,
    `**Total bugs found:** ${bugs.length}`,
    '',
  ];

  for (const severity of severityOrder) {
    const list = grouped[severity];
    if (!list.length) continue;
    lines.push(`## ${severity.toUpperCase()} (${list.length})`);
    lines.push('');
    for (const bug of list) {
      lines.push(`### ${bug.title}`);
      if (bug.url) lines.push(`**URL:** ${bug.url}`);
      lines.push(`**Description:** ${bug.description}`);
      if (bug.steps_to_reproduce) lines.push(`**Steps to reproduce:** ${bug.steps_to_reproduce}`);
      lines.push('');
    }
  }

  if (bugs.length === 0) lines.push('No bugs found.');
  return lines.join('\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import Anthropic from '@anthropic-ai/sdk';
import { spawn } from 'child_process';
import { createInterface } from 'readline';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const TARGET_URL = process.env.TARGET_URL || 'https://selfenergycircle.kayos.ai/join';
const MAX_ITERATIONS = 30;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpBin = path.resolve(__dirname, 'node_modules/.bin/mcp-server-playwright');
const USER_FLOWS_PATH = path.resolve(__dirname, 'user-flows.md');

const SYSTEM_PROMPT = `You are a QA engineer doing automated browser testing. Your job is to find real, meaningful bugs — not to nitpick.

## Safety rules — follow these without exception
- READ ONLY: browse and observe, never submit forms that create or modify real data
- Do NOT send any messages, chats, posts, or comments to other users or groups
- Do NOT delete, archive, or modify any content you did not create in this session
- Do NOT make purchases, trigger payments, or initiate any transactions
- Do NOT sign up for anything or create accounts
- Do NOT click "invite", "share", or "notify" controls that would contact other people
- If you accidentally land on a destructive or social action, navigate away immediately without confirming

## User flows knowledge base
You have access to two tools for maintaining a persistent record of how the site works:
- \`read_user_flows\`: call this at the start of every session to load the known flows
- \`update_user_flows\`: call this to save your updated knowledge after exploring a section

Use the flows file to:
- Understand what behavior is expected before deciding if something is a bug
- Record newly discovered flows and pages as you explore
- Update a flow if behavior has changed and it looks intentional (new feature), rather than reporting it as a bug
- Note which flows you verified as working in this session

The file must contain two sections:
1. **Site Map** — an ASCII tree of all discovered pages and their relationships, e.g.:
   / (root)
   ├── /home
   ├── /inbox
   │   └── /inbox/:id  (message thread)
   ├── /resources
   │   └── /resources/:slug
   └── /members
2. **User Flows** — for each key flow: name, steps, and expected outcome

## What to test
- Start each session by calling read_user_flows to load context
- Navigate to pages, open messages, follow links, click interactive elements
- Take screenshots to check for visual/layout issues
- Monitor JavaScript console errors
- Verify that links and resources load correctly (check for 404s, failed requests)
- Actually open messages, threads, and modals — don't just check the list view
- Call update_user_flows periodically as you learn new things about the site

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
- Anything already documented in user-flows.md as known/expected behavior

For each real bug, provide numbered steps to reproduce so a developer can confirm it.

When you have finished crawling, call update_user_flows one final time, then output a fenced JSON block as the LAST thing in your response (no text after it). Sort bugs: critical first, then high, medium, low.

\`\`\`json
{"bugs": [{"title": "...", "severity": "critical|high|medium|low", "description": "...", "url": "...", "steps_to_reproduce": "1. Go to ... 2. Click ... 3. Observe ..."}]}
\`\`\`

If no bugs are found, output:
\`\`\`json
{"bugs": []}
\`\`\``;

// Custom tools the agent can call directly (not through MCP)
const CUSTOM_TOOLS = [
  {
    name: 'read_user_flows',
    description: 'Read the persistent user-flows.md file to load known site behavior and flows from previous sessions.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'update_user_flows',
    description: 'Overwrite user-flows.md with updated content. Call this after discovering new flows, verifying existing ones, or noting behavior changes. Pass the full file content — this replaces the file entirely.',
    input_schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Full markdown content to write to user-flows.md' },
      },
      required: ['content'],
    },
  },
];

function handleCustomTool(name, input) {
  if (name === 'read_user_flows') {
    if (existsSync(USER_FLOWS_PATH)) {
      const content = readFileSync(USER_FLOWS_PATH, 'utf8');
      return [{ type: 'text', text: content }];
    }
    return [{ type: 'text', text: '(No user-flows.md exists yet — this is the first session. Create one as you explore.)' }];
  }
  if (name === 'update_user_flows') {
    writeFileSync(USER_FLOWS_PATH, input.content);
    console.log('  [user-flows.md updated]');
    return [{ type: 'text', text: 'user-flows.md saved.' }];
  }
  return null;
}

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

  const mcpClient = new RawMcpClient(mcpBin, ['--headless']);
  await mcpClient.initialize();

  const mcpTools = await mcpClient.listTools();
  const tools = [
    ...CUSTOM_TOOLS,
    ...mcpTools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: { type: 'object', ...(t.inputSchema ?? {}) },
    })),
  ];

  console.log(`Connected to Playwright MCP. ${mcpTools.length} browser tools + ${CUSTOM_TOOLS.length} custom tools available.`);

  // Authenticate via magic link before crawling
  const magicLink = process.env.MAGIC_LINK;
  if (magicLink) {
    console.log('Authenticating via magic link...');
    await mcpClient.callTool('browser_navigate', { url: magicLink });
    await new Promise(r => setTimeout(r, 3000));
    console.log('Magic link auth complete.');
  }

  console.log(`Crawling: ${TARGET_URL}`);

  const messages = [
    {
      role: 'user',
      content: `Start by calling read_user_flows to load any known flows from previous sessions. Then crawl ${TARGET_URL} thoroughly: navigate all sections, open individual messages and threads in the inbox, check all interactive elements. As you explore, maintain user-flows.md with (1) an ASCII site map showing all pages and their relationships, and (2) documented user flows with steps and expected outcomes. Update the file as you discover new pages or flows. Report real bugs at the end.`,
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
        const customResult = handleCustomTool(block.name, block.input);
        if (customResult !== null) {
          result = customResult;
        } else {
          try {
            const raw = await mcpClient.callTool(block.name, block.input);
            result = normalizeMcpContent(raw);
          } catch (err) {
            result = [{ type: 'text', text: `Error: ${err.message}` }];
          }
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
        { role: 'user', content: 'Call update_user_flows with everything you learned, then output the final bug JSON.' },
      ],
      system: SYSTEM_PROMPT,
    });
    messages.push({ role: 'assistant', content: finalResponse.content });
    // handle any tool calls in the forced final response
    for (const block of finalResponse.content) {
      if (block.type !== 'tool_use') continue;
      const customResult = handleCustomTool(block.name, block.input);
      if (customResult !== null) console.log(`  -> ${block.name} (cleanup)`);
    }
  }

  mcpClient.close();

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

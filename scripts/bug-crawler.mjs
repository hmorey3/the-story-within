import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const TARGET_URL = process.env.TARGET_URL || 'https://selfenergycircle.kayos.ai/join';
const MAX_ITERATIONS = 30;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpBin = path.resolve(__dirname, 'node_modules/.bin/playwright-mcp');

const SYSTEM_PROMPT = `You are a QA engineer doing automated browser testing. Your job is to crawl a website and find bugs.

Use the Playwright tools to:
- Navigate to pages and follow links
- Take screenshots to check for visual/layout issues
- Monitor JavaScript console errors
- Verify that links and resources load correctly (check for 404s, failed requests)

Be thorough: check the main page, follow any visible links, test interactive elements (buttons, forms, navigation), and look for missing images or broken layouts.

When you have finished crawling, output a fenced JSON block as the LAST thing in your response (no text after it):

\`\`\`json
{"bugs": [{"title": "...", "severity": "critical|high|medium|low", "description": "...", "url": "...", "steps_to_reproduce": "..."}]}
\`\`\`

If no bugs are found, output:
\`\`\`json
{"bugs": []}
\`\`\``;

async function main() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const transport = new StdioClientTransport({
    command: mcpBin,
    args: ['--headless'],
    env: { ...process.env },
  });

  const mcpClient = new Client(
    { name: 'bug-crawler', version: '1.0.0' },
    { capabilities: {} }
  );

  await mcpClient.connect(transport);

  const { tools: mcpTools } = await mcpClient.listTools();
  const tools = mcpTools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema,
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
          const mcpResult = await mcpClient.callTool({
            name: block.name,
            arguments: block.input,
          });
          result = mcpResult.content;
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

  await mcpClient.close();

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

  const report = {
    url: TARGET_URL,
    date: new Date().toISOString(),
    total: bugs.length,
    bugs,
  };

  writeFileSync('bug-report.json', JSON.stringify(report, null, 2));
  writeFileSync('bug-report.md', buildMarkdown(report));

  console.log('Reports written: bug-report.json, bug-report.md');
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

  if (bugs.length === 0) {
    lines.push('No bugs found.');
  }

  return lines.join('\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

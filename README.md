# The Story Within

A lightweight React + Vite prototype for capturing personal stories through mythic beats. Data is stored locally in the browser (localStorage) for fast iteration.

## Getting started

```bash
npm install
npm run dev
```

Optional (for the chatbot): copy `.env.example` to `.env` and set `VITE_OPENAI_API_KEY`.

## E2E tests (Playwright)

First time only:

```bash
npx playwright install chromium
```

Then:

```bash
npm run test:e2e
```

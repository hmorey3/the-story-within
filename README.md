# The Story Within

A lightweight single-page React prototype that lets people capture personal stories through cinematic beats. Everything is stored in the browser so you can experiment quickly without a backend.

## Features
- **Library view** – browse your stories, spin up a new one with a curated cover, or remove drafts.
- **Story view** – review beats for a story, skim your notes, and add new beats from the hero's journey library.
- **Story editor** – focus on a single beat, swap its imagery from the Departure/Descent/Return categories, and write rich reflections.
- **Local persistence** – stories live in `localStorage`, so refreshing keeps your progress during prototyping.

## Getting started
```bash
npm install
npm run dev
```
Then visit http://localhost:5173.

To create a production build run:
```bash
npm run build
```

## Tech stack
- [Vite](https://vitejs.dev/) + React + TypeScript
- Plain CSS modules scoped per component for clarity
- Minimal context + custom hook for local storage persistence

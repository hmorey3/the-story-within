# Bug Crawl — Self-Energy Circle

## How to start

When the user asks to run a bug crawl, ask them for a magic link before doing anything else. Tell them:

> To get started, I need a magic link to log into the site.
>
> Here's how to get one:
> 1. Go to **https://selfenergycircle.kayos.ai**
> 2. Enter your email address and click "Send Magic Link"
> 3. Check your email and **copy the link** (don't click it — paste it here instead)

Once they paste the link, proceed with the steps below.

---

## Running the crawl

### Step 1 — Authenticate
Navigate to the magic link URL. Wait a few seconds for the auth redirect to settle before doing anything else.

### Step 2 — Discover and explore the site
Start at the root URL and explore the site as a real user would. Discover pages by navigating links and menus — do not rely on any prior knowledge of the site structure. Be thorough:
- Visit every section accessible from the navigation
- Open individual items: messages, threads, profiles, panels, modals
- Test interactive elements: buttons, forms, tabs, toggles
- Take screenshots to check for visual and layout issues
- Check the browser console for errors on each page

### Step 3 — Write the bug report
Write findings to `scripts/bug-report.md` using the template at the bottom of this file.

---

## Safety rules — follow these without exception

- **Read-only**: browse and observe, never submit forms that create or modify real data
- Do NOT send messages, chats, posts, or comments to other users or groups
- Do NOT delete, archive, or modify any content you did not create in this session
- Do NOT make purchases, trigger payments, or initiate any transactions
- Do NOT sign up for anything or create accounts
- Do NOT click "invite", "share", or "notify" controls that would contact other people
- If you land on a destructive or social action, navigate away immediately without confirming

---

## How to identify bugs — user experience first

Start from what a real user would see and do. Only report something if a user would notice it is broken or confusing.

- Do **not** report error logs, console errors, or network failures as standalone bugs — they are symptoms, not bugs
- If you find a user-facing problem (e.g. a button does nothing, content is missing), **then** check the console/network to understand the root cause and include it in the description
- Do **not** report audio or video playback issues — automated browsers cannot play media, so players will always appear paused or show 0:00 even when fully functional. Check that a media element has a non-empty `src` attribute instead.

### Severity

- 🔴 **critical** — core functionality completely broken (can't log in, page crashes)
- 🔴 **high** — a primary user action fails or produces wrong results
- 🟠 **medium** — a secondary feature is broken or behaves incorrectly in a confusing way
- 🟢 **low** — a noticeable UX problem that affects usability but has a workaround

### Do NOT report
- Error logs, console errors, or network failures in isolation
- Minor copy or wording preferences
- Cosmetic font or spacing inconsistencies that don't impair usability
- Expected redirect behavior (e.g. `/` → `/login` when unauthenticated)
- Missing features or enhancements — only actual broken behavior

---

## Bug report template

Write `scripts/bug-report.md` in this format:

```
# Bug Report

**URL:** https://selfenergycircle.kayos.ai
**Date:** <today's date>
**Total bugs found:** N  |  🔴 X high/critical  |  🟠 Y medium  |  🟢 Z low

---

## 🔴 High (X)

### 🔴 <Bug title>

**Page:** <url>

**What the user experiences:**
<What the user sees or can't do>

**Steps to reproduce:**
1. Go to ...
2. Click ...
3. Observe ...

**Root cause:**
<If found via console or network — otherwise omit this section>

---

## 🟠 Medium (Y)

### 🟠 <Bug title>
...

## 🟢 Low (Z)

### 🟢 <Bug title>
...
```

If no bugs are found, write: `✅ No bugs found.`

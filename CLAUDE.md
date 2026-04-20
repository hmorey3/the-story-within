# Bug Crawl — Self-Energy Circle

## How to run a bug crawl

1. Get a magic link by going to https://selfenergycircle.kayos.ai and requesting one for your email
2. Say: **"Run the bug crawl"** and paste the magic link when asked

That's it. Claude will handle the rest and write the results to `scripts/bug-report.md`.

---

## When asked to run the bug crawl

### Step 1 — Authenticate
Navigate to the magic link URL the user provides. Wait 3 seconds for the auth redirect to settle before proceeding.

### Step 2 — Load context
Read `scripts/user-flows.md` if it exists. Use it as a reference for how the site is supposed to work — it is **not** a skip list. Test every flow every run regardless of what's documented there.

### Step 3 — Crawl https://selfenergycircle.kayos.ai
Navigate all sections of the site. Be thorough:
- Visit every page in the nav: Home, Updates, Sessions, Inbox, Members, Resources, Daily Practice, Peer Practice, Settings
- Open individual inbox messages and threads — don't just check the list view
- Click into member profiles, meditation panels, resource items, session details
- Test interactive elements (buttons, forms, navigation)
- Take screenshots to check for visual/layout issues
- Check the browser console for errors on each page

### Step 4 — Update user-flows.md
As you explore, update `scripts/user-flows.md` with:
1. An ASCII site map of all pages and their relationships
2. Documented user flows with steps and expected outcomes

The site may have changed since the last run. If something works differently from what's documented but seems intentional and functional, update the flow description rather than filing a bug.

### Step 5 — Write the bug report
Write findings to `scripts/bug-report.md` using the template below.

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

- Do **not** report error logs, console errors, or network failures as bugs on their own — they are symptoms, not bugs
- If you find a user-facing problem (e.g. a button does nothing, content is missing), **then** check the console/network to understand the root cause and include it in the description
- **Do not report audio or video playback issues** — headless and automated browsers cannot play media. Audio/video that appears paused or shows 0:00 may be fully functional in a real browser. Instead, verify the element has a non-empty `src` attribute as a proxy for whether it's wired up.

### Severity

- 🔴 **critical** — core functionality completely broken (can't sign up, can't log in, page crashes)
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
<Description of what the user sees or can't do>

**Steps to reproduce:**
1. Go to ...
2. Click ...
3. Observe ...

**Root cause:**
<If found — e.g. from console or network tab>

---

## 🟠 Medium (Y)

### 🟠 <Bug title>
...

## 🟢 Low (Z)

### 🟢 <Bug title>
...
```

If no bugs are found, write: `✅ No bugs found.`

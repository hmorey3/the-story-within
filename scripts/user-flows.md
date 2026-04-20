# Self-Energy Circle — User Flows Knowledge Base
# Site: https://selfenergycircle.kayos.ai
# Last crawled: 2026-04-20

---

## Site Map

```
/ (root)
└── /home                          Home / landing page
    ├── /updates                   Community Updates (WhatsApp group feed + welcome post)
    ├── /events                    Sessions (upcoming circles & workshops)
    │   └── (modal)                Session detail opens inline (no URL change)
    ├── /inbox                     Inbox (dark-themed, report items only)
    ├── /members                   Members directory
    │   ├── (modal)                Member profile detail (overlay panel)
    │   └── /profile               My Profile / edit own profile
    ├── /resources                 Resource library
    │   ├── /resources/ifs-101     IFS 101 article (full-page)
    │   └── (modal)                Other resources open inline panels (no URL change)
    ├── /practice                  Daily Practice (meditations & core practices)
    │   └── (modal)                Practice item detail opens in overlay panel
    ├── /peer-practice             Peer Practice (current cycle exercise + partner assignment)
    │   └── /peer-practice/print   Printable practice guide
    ├── /settings                  Member Settings (profile, billing, personal files)
    └── /workspace                 Full Workspace (not fully explored)
```

---

## User Flows

### 1. Home Page
- **URL:** `/home`
- **Steps:** Navigate to root → redirects to `/home`
- **Content:** Community logo, tagline, nav cards for all sections, welcome text, Lumi AI chat teaser
- **Navbar:** SEC logo (→ /home), Inbox icon (→ /inbox), search, Lumi toggle, dark-mode toggle
- **Sidebar (desktop):** Home, Updates, Sessions, Daily Practice, Members, Resources, Peer Practice, Ask Lumi, Workspace, Member Profile & Settings
- **Expected outcome:** Page loads; nav links are all clickable ✅

---

### 2. Updates
- **URL:** `/updates`
- **Steps:** Click "Updates" nav link
- **Content:** Welcome post by Justin Wilford + WhatsApp group message feed (14 messages synced from WhatsApp)
- **WhatsApp panel:** Shows date-grouped messages from April 15, 17, and "Yesterday"
- **Note:** Some WhatsApp message rows show only author + timestamp but no message text (images/media that cannot be displayed as text?)
- **Expected outcome:** Updates page loads with community post and WhatsApp feed ✅

---

### 3. Sessions (Events)
- **URL:** `/events`
- **Steps:** Click "Sessions" nav link
- **Tabs:** Upcoming / Past / All
  - Upcoming: shows 4 events (Apr 21, May 5, May 19, May 24)
  - Past: "No past sessions yet."
  - All: same as Upcoming
- **Each event card:** date badge, type tag, title, time, facilitators, description, attendee count, + Cal button, RSVP button
- **Note:** A "Close" button (with an image child) is always present in the DOM but not visible on screen — orphaned UI element
- **Expected outcome:** Sessions list loads and tab filters work ✅

---

### 4. Inbox
- **URL:** `/inbox`
- **Theme:** Dark (does not match the rest of the site's light theme)
- **Tabs:** All, Unread, Messages, Downloads, Alerts, Proposals
  - All / Unread: show same 20 items (all tagged "report", titled "Gardener Run — YYYY-MM-DD" or "Untitled")
  - Messages: "No matching items"
  - Downloads / Alerts / Proposals: not verified
- **Compose button:** present but not tested (read-only policy)
- **Known bug:** Clicking any inbox item does nothing — no navigation, no expansion, no modal
- **Known bug:** `GET /api/inbox/contacts` returns 404
- **Expected outcome:** Clicking an inbox item should open its content ❌ (broken)

---

### 5. Members
- **URL:** `/members`
- **Content:** Search bar, Facilitators section (Justin Wilford, Audra DiPadova), Circle Members section (4 members)
- **Member card click:** Opens a right-panel/modal with full profile: photo, name, pronouns, location, IFS level, About, What brings them here, Professional world, Growth practices, Human Design, Links
- **My Profile button:** Links to `/profile`
- **Close button on member panel:** Does not close the panel (bug observed)
- **Note:** A dialog element with "IFS Connection" label is always present in the DOM but not visually rendered with content
- **Expected outcome:** Member profile panel opens on click ✅; Close button should dismiss it ❌

---

### 6. Resources
- **URL:** `/resources`
- **Sections:** IFS Foundations, Session Recordings, Our Favorite IFS Books, Our Favorite IFS Podcasts, Self-Energy Articles, Community Documents
- **IFS 101 link:** Full-page article at `/resources/ifs-101` — loads correctly ✅
- **Other resource items:** Open inline panels (no URL change); "Link" badge items open external URLs
- **Expected outcome:** Resource list and article page load ✅

---

### 7. Daily Practice
- **URL:** `/practice`
- **Sections:** Meditations (7 items), Core Practices (6 items)
- **Meditation click:** Opens overlay panel with:
  - Title, subtitle, audio player (HTML `<audio>` element)
  - Description text
- **Audio player:** Works correctly in real browsers (verified by user). Headless browsers cannot play media so the player will always appear paused/empty — do NOT report audio playback as a bug. Verify only that the `<audio>` element exists and has a non-empty src.
- **Close button on panel:** Does not close the panel (bug observed — same as Members)
- **Expected outcome:** Meditation panel opens ✅; audio plays in real browser ✅

---

### 8. Peer Practice
- **URL:** `/peer-practice`
- **Content:** "This Cycle's Peer Practice" card (Self as Mediator — April 21 follow-up) with full guided exercise text
- **Download Practice Guide button:** Links to `/peer-practice/print`
- **Your Practice Partner section:** "No partner assigned yet" (may be correct for this user/cycle)
- **Expected outcome:** Page loads with practice content ✅

---

### 9. Settings
- **URL:** `/settings`
- **Content:**
  - Edit Profile link → `/profile` (shows current user: Heidi A Morey, initials HA)
  - Personal Files: "Coming soon — personal file uploads to customize your Lumi AI experience."
  - Membership & Billing: "Manage Billing" button (links to billing portal)
- **Expected outcome:** Settings page loads ✅

---

### 10. AI Companion — Lumi
- **Trigger:** Top-nav "Lumi" button or sidebar "Ask Lumi" button or home page chat prompt
- **Modes:** "Lumi" (chat) and "Switch to Agent" toggle in nav
- **Not tested** (read-only; would require sending messages)

---

## Known Issues (Session 2026-04-20)

| # | Page | Issue | Severity |
|---|------|--------|----------|
| 1 | /inbox | Clicking any inbox item does nothing — no thread/detail view opens | high |
| 2 | /inbox | `GET /api/inbox/contacts` returns 404 | high |
| 3 | /practice | ~~Meditation audio player broken~~ — FALSE POSITIVE: headless browser cannot play media; confirmed working in real browser ✅ | resolved |
| 4 | /practice, /members | Panel "Close" button does not dismiss the open panel | medium |
| 5 | /events, /practice | Orphaned "Close" button element always present in DOM (no associated open panel) | low |
| 6 | /inbox | Inbox uses dark theme while rest of site uses light theme (theme inconsistency) | low |

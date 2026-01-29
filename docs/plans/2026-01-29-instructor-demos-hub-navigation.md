# Instructor Demos Hub + Cross-Linking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the `demos/_instructor/` Quarto pages easy to navigate (hub page + consistent cross-links) **without adding any links to instructor pages in the student-facing navigation**.

**Architecture:** Keep a **single-site** Quarto build. Improve `demos/_instructor/index.qmd` into a “public-page-like” hub (sections + cards/tables). Add a small, consistent “Navigation” block to each instructor page (hub ↔ demo guide ↔ model/activities/assessment/backlog ↔ student demo).

**Tech Stack:** Quarto (`.qmd`), Markdown, minimal inline HTML/CSS (like `demos/index.qmd`), `make render` verification.

---

## Hard Invariants (do not violate)

- **Single-site build:** Do not introduce or require profile builds.
- **No student-facing links:** Do not add `demos/_instructor/*` links to `_quarto.yml` navigation (sidebar/navbar).
- **Scope:** Limit changes to `demos/_instructor/` pages only.
- **Search:** Preserve `search: false` for `demos/_instructor/*` so these pages do not appear in site search results.

---

## Phase A — Understanding (no solutions)

**What is known**

- Instructor pages exist under `demos/_instructor/` and are currently **not linked** from the student sidebar/nav. (`_quarto.yml` sidebar contents do not include `demos/_instructor/*`.)
- The instructor pages already use Quarto page styling (`page-layout: article`, `toc: true`) and have some “Where to go next” link blocks (varies by page).
- `demos/_instructor/*` pages set `search: false`, so they don’t appear in the site search index (verify gate below).

**What is requested**

- “Easy to navigate” instructor docs: a hub with “nice formatting like the public pages” and cross-links between resources.
- Do this entirely within `demos/_instructor/` (no profile builds / no `_quarto-instructor.yml` usage).

**What is unknown / VERIFY**

- Whether you want *only* the demos instructor pages improved, or also other instructor-only pages (e.g., `activities/_instructor/` currently appears in `_site/search.json` and may be discoverable via search).
- Preferred visual style: match `demos/index.qmd` card gallery exactly, or a simpler Quarto table/grid.

---

## Phase B — Assumption Audit

- **Assumption (inferred):** “Single site” means we keep one Quarto render command (`conda run -n astro make render`) and do not introduce a second output directory or deployment target.
- **Assumption (explicit):** We must not add instructor URLs to student navigation (sidebar/navbar).
- **Assumption (inferred):** It’s acceptable that instructor pages remain publicly accessible by direct URL; the goal is “unlinked”, not “access-controlled”.

If any of these are wrong, stop and adjust before implementation.

---

## Phase C — Exploration (2 approaches; no code)

### Approach 1: Hub page + per-page “Navigation” callout (recommended)

- **Preserves invariants:** single build; no nav exposure; minimal risk.
- **Risk:** touches many `.qmd` files (tedious); potential for inconsistent links if not careful.
- **Failure mode:** broken relative links; hub misses some resources.

### Approach 2: Minimal hub only (lowest risk, less helpful)

- Only improve `demos/_instructor/index.qmd` (cards/sections) and leave individual pages as-is.
- **Risk:** user still feels “lost” after landing in a subpage.
- **Failure mode:** still hard to jump between model/activities/assessment/backlog from deep pages.

Choose Approach 1 unless we’re trying to minimize churn.

---

## Phase C.5 — Sanity Checks (before implementation)

- **Search leakage check:** After render, confirm `demos/_instructor/` does **not** appear in `_site/search.json`.
- **Link integrity:** Use absolute URLs for hub links where helpful (e.g., `/demos/_instructor/`) to avoid relative-link mistakes; use local relative links (e.g., `model.qmd`) within a demo folder.

---

## Implementation Tasks (bite-sized, verification-first)

### Task 1: Inventory the instructor demo pages + confirm current nav exposure

**Files:**
- Read: `demos/_instructor/index.qmd`
- Read: `_quarto.yml` (sidebar/nav)

**Step 1: Verify current state**

Run:

```bash
find demos/_instructor -type f -name "*.qmd" | sort
rg -n "demos/_instructor" _quarto.yml || true
```

Expected:
- Instructor pages exist for: `seasons`, `moon-phases`, `angular-size`, `eclipse-geometry`, `keplers-laws`, `binary-orbits`, `conservation-laws`, `cosmic-playground`.
- `_quarto.yml` does not include `demos/_instructor/*` in `website.sidebar.contents`.

**Step 2: Rollback**
- No changes yet; nothing to rollback.

---

### Task 2: Redesign `demos/_instructor/index.qmd` into a “hub” page

**What**
- Replace the current “Quick Links” tables with a structured hub (sections + cards), similar in feel to `demos/index.qmd`.
- Each demo card should include direct links to:
  - Student demo (public): `/demos/<demo>/`
  - Instructor guide (hub): `/demos/_instructor/<demo>/`
  - Model, activities, assessment, backlog pages (where they exist)
  - Embed shortcode snippet (optional)

**Why**
- Hub becomes the “home base” you can bookmark and quickly jump to any instructor resource.

**Files:**
- Modify: `demos/_instructor/index.qmd`

**Step 1: Make the change**
- Edit `demos/_instructor/index.qmd` to use the same “section + card gallery” feel as `demos/index.qmd`.
- Include direct links per demo card (student demo + instructor guide + model/activities/assessment/backlog when available).

**Step 2: Render and verify**

Run:

```bash
conda run -n astro make render
open _site/demos/_instructor/index.html
```

Expected:
- Page renders with clean sections and consistent link styling.
- Links resolve to the correct instructor pages and student demos.

**Step 3: Commit**

```bash
git add demos/_instructor/index.qmd
git commit -m "docs(instructor): redesign demos instructor hub"
```

**Rollback**
- `git restore demos/_instructor/index.qmd`

---

### Task 3: Add a consistent “Navigation” callout to each instructor demo guide `index.qmd`

**What**
- Add a callout block near the top of each:
  - `demos/_instructor/<demo>/index.qmd`

Include:
- Link back to hub: `/demos/_instructor/`
- Links to sibling pages: `model.qmd`, `activities.qmd`, `assessment.qmd`, `backlog.qmd`
- Link to student demo: `/demos/<demo>/`

**Why**
- When you land deep in a demo guide, you can always hop back to hub and across resources.

**Files (example; repeat for each demo):**
- Modify: `demos/_instructor/seasons/index.qmd`
- Modify: `demos/_instructor/moon-phases/index.qmd`
- Modify: `demos/_instructor/angular-size/index.qmd`
- Modify: `demos/_instructor/eclipse-geometry/index.qmd`
- Modify: `demos/_instructor/keplers-laws/index.qmd`
- Modify: `demos/_instructor/binary-orbits/index.qmd`
- Modify: `demos/_instructor/conservation-laws/index.qmd`
- Modify: `demos/_instructor/cosmic-playground/index.qmd`

**Step 1: Make the change**
- Add a small “Navigation” callout near the top of each demo guide `index.qmd`.
- Use absolute hub link (`/demos/_instructor/`) + relative sibling links (`model.qmd`, etc.).

**Step 2: Render and verify**

Run:

```bash
conda run -n astro make render
```

Then spot-check:
- `_site/demos/_instructor/seasons/index.html`
- `_site/demos/_instructor/conservation-laws/index.html`

Expected:
- The nav callout appears and links work.

**Step 3: Commit**

```bash
git add demos/_instructor/*/index.qmd
git commit -m "docs(instructor): add hub cross-links to demo guide pages"
```

**Rollback**
- `git restore demos/_instructor/*/index.qmd`

---

### Task 4: Add the same “Navigation” callout to each instructor subpage (model/activities/assessment/backlog)

**What**
- Add the callout to:
  - `model.qmd`, `activities.qmd`, `assessment.qmd`, `backlog.qmd` under each demo folder.
- Include hub link + “Back to this demo guide” link (`index.qmd`) + sibling links.

**Why**
- This makes deep pages (especially assessments/backlog) navigable without scrolling or browser back.

**Files (repeat per demo folder):**
- Modify: `demos/_instructor/seasons/model.qmd`
- Modify: `demos/_instructor/seasons/activities.qmd`
- Modify: `demos/_instructor/seasons/assessment.qmd`
- Modify: `demos/_instructor/seasons/backlog.qmd`
- …repeat for each instructor demo folder.

**Step 1: Make the change**
- Add the same “Navigation” callout to every instructor subpage so you can always jump:
  - hub ↔ this demo ↔ sibling pages ↔ student demo.

**Step 2: Render and verify**

Run:

```bash
conda run -n astro make render
```

Spot-check a few deep pages:
- `_site/demos/_instructor/seasons/model.html`
- `_site/demos/_instructor/binary-orbits/assessment.html`

**Step 3: Commit**

```bash
git add demos/_instructor
git commit -m "docs(instructor): add consistent navigation blocks to subpages"
```

**Rollback**
- `git restore demos/_instructor`

---

### Task 5: Ensure instructor demos remain undiscoverable via site search

**What**
- Confirm `search: false` is preserved for `demos/_instructor/*` pages and the hub.

**Why**
- Even without nav links, search results can create “clickable links students can find”.

**Files:**
- Verify: `demos/_instructor/**/*.qmd` front matter includes `search: false`

**Test/Verification**

Run:

```bash
conda run -n astro make render
rg -n \"demos/_instructor\" _site/search.json || true
```

Expected:
- No matches for `demos/_instructor` in `_site/search.json`.

**Rollback**
- N/A (verification only)

---

## Acceptance Gates (whole batch)

- `conda run -n astro make render`
- `rg -n "demos/_instructor" _site/search.json || true` (expect no hits)
- Manual navigation check: open `_site/demos/_instructor/index.html` and click through 3–5 representative links.

---

## Risks / Side Effects

- More internal links increases the chance a student sees an instructor URL *if* a student is given one instructor-page link; still not reachable from nav.
- Any typo in a `.qmd` link can silently produce a broken link until render-time.
- **Related but out-of-scope:** `activities/_instructor/index.qmd` currently appears in `_site/search.json` (students could discover via search). Consider setting `search: false` there too in a separate change.

---

## Rollback Strategy

- Revert the whole change set:

```bash
git restore demos/_instructor
conda run -n astro make render
```

---

## Execution Handoff

Plan saved to `docs/plans/2026-01-29-instructor-demos-hub-navigation.md`.

If you want me to execute it task-by-task, tell me to switch to `superpowers:executing-plans` and I’ll start with Task 1 (inventory + preflight).

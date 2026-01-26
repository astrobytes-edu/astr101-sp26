# ASTR 101 Homework Template + Includes + Index Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Standardize ASTR 101 homework pages with a reusable template + `_includes/` blocks, and add a `homework/` index page so students can find all assignments in one place.

**Architecture:** Keep homework-specific reusable blocks in `_includes/` (optionally grouped under `_includes/homework/`). Each assignment page uses the same include blocks for workflow, grading/reflection expectations, and submission requirements, while keeping per-assignment content (problem list, links, topic notes) local to the assignment file.

**Tech Stack:** Quarto website (`_quarto.yml`), Quarto includes (`{{< include ... >}}`), existing `_includes/*.qmd` policy blocks.

---

## Invariants (must not change)

- No invented dates: homework pages should not hardcode calendar dates unless explicitly provided; default to day-of-week/time + “see Canvas”.
- No new dependencies.
- Existing course policy includes remain truthful and consistent (`_includes/ai-policy.qmd`, `_includes/course-policies.qmd`).
- Homework pages remain renderable to both HTML and PDF (where configured).

---

### Task 1: Add homework reusable include blocks

**Files:**
- Create: `_includes/homework/hw-grading-and-workflow.qmd`
- Modify: `_includes/hw-submission-instructions.qmd`

**Step 1: Write the failing check**

Run: `rg -n "Feb|January|2026-" homework/*.qmd`

Expected: Finds hardcoded dates in homework (to remove).

**Step 2: Implement minimal includes**

- Add `_includes/homework/hw-grading-and-workflow.qmd` containing:
  - “Weekly Homework + Grade Memos (15%)” motivation blurb
  - Two-stage submission workflow summary
  - Instructor 0–5 scoring description (completion/professionalism/learning behaviors)
- Update `_includes/hw-submission-instructions.qmd` to match the two-stage workflow details:
  - single readable PDF
  - no late submissions (solutions posted Tuesday morning)
  - lowest homework dropped
  - grade memo requirements: what got right/broke/learned/next habit; per-problem 1–5; AI/collab disclosure

**Step 3: Verify rendering**

Run: `quarto render homework/astr101-hw-01.qmd --to html`

Expected: Succeeds with no errors.

**Step 4: Commit (optional)**

Run:
`git add _includes/hw-submission-instructions.qmd _includes/homework/hw-grading-and-workflow.qmd`
`git commit -m "docs(homework): add shared workflow/grading includes"`

---

### Task 2: Create a homework template file

**Files:**
- Create: `homework/_template-homework.qmd`

**Step 1: Implement template**

Template should include:
- Standard YAML keys (`title`, `author`, `draft`, `format.html`, `format.pdf`, plus listing metadata like `order`/`description`)
- Standard top-of-page includes:
  - `{{< include _includes/submission-reminder.qmd >}}` (optional)
  - `{{< include _includes/homework/hw-grading-and-workflow.qmd >}}`
  - `{{< include _includes/hw-submission-instructions.qmd >}}`
  - `{{< include _includes/ai-policy.qmd >}}` (optional, if you want it on every HW)
- Stub sections for:
  - Topics + estimated time
  - “What to do” (links to lecture practice problems)
  - “Problems to complete” (organized by lecture)

**Step 2: Verify rendering**

Run: `quarto render homework/_template-homework.qmd --to html`

Expected: Succeeds; outputs `_site/homework/_template-homework.html` (can remain non-linked).

**Step 3: Commit (optional)**

Run:
`git add homework/_template-homework.qmd`
`git commit -m "docs(homework): add assignment template"`

---

### Task 3: Refactor HW01 to use includes and remove hardcoded dates

**Files:**
- Modify: `homework/astr101-hw-01.qmd`

**Step 1: Remove hardcoded due date**

- Replace any calendar-date due line with day-of-week/time + “see Canvas”.
- Add metadata used by the homework index listing (e.g., `order`, `description`).

**Step 2: Use includes**

- Replace repeated policy sections with:
  - `{{< include _includes/homework/hw-grading-and-workflow.qmd >}}`
  - `{{< include _includes/hw-submission-instructions.qmd >}}`
  - (optional) `{{< include _includes/ai-policy.qmd >}}`

**Step 3: Verify HTML + PDF**

Run:
- `quarto render homework/astr101-hw-01.qmd --to html`
- `quarto render homework/astr101-hw-01.qmd --to pdf`

Expected:
- `_site/homework/astr101-hw-01.html` exists
- `_site/homework/astr101-hw-01.pdf` exists

**Step 4: Commit (optional)**

Run:
`git add homework/astr101-hw-01.qmd`
`git commit -m "docs(homework): refactor HW01 to shared blocks"`

---

### Task 4: Add a Homework index page (listing)

**Files:**
- Create: `homework/index.qmd`
- Modify: `_quarto.yml`

**Step 1: Create homework index**

- Add a short intro and include the homework workflow block.
- Add a Quarto `listing:` similar to `handouts/index.qmd`:
  - `contents: "."`
  - `type: table`
  - `fields: [order, title, description, solutions_due, memo_due]` (string fields)
  - `sort: "order asc"`
  - Disable filter/sort UI for simplicity.

**Step 2: Add sidebar nav**

- Add a “Homework” section pointing to `homework/index.qmd` (and optionally individual HW pages later).

**Step 3: Verify rendering**

Run:
- `quarto render homework/index.qmd --to html`
- Confirm `_site/homework/index.html` exists.

**Step 4: Commit (optional)**

Run:
`git add homework/index.qmd _quarto.yml`
`git commit -m "feat(homework): add homework index page"`

---

### Task 5: Full-site verification render

**Files:** (no new changes)

**Step 1: Render**

Run: `conda run -n astro make render`

Expected: Site render completes successfully (no Quarto errors).

**Step 2: Spot-check**

- Open `_site/homework/index.html` and confirm HW01 appears in the list.
- Open `_site/homework/astr101-hw-01.html` and confirm submission/workflow callouts appear.
- Confirm `_site/homework/astr101-hw-01.pdf` exists.


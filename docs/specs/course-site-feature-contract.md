---
title: "ASTR 201 Course Site Feature Contract"
version: "1.0.0"
date: "2026-01-14"
status: "LOCKED (Implementation Contract)"
owner: "Dr. Anna Rosen"
---

# ASTR 201 Course Site Feature Contract (LOCKED)

This document defines the **functional capabilities** and **non-goals** of the ASTR 201 Quarto site.

**If implementation deviates from this contract, it is a bug.**  
Changes require an ADR.

---

## 0. Scope

Applies to:

- Quarto website project (`_quarto.yml`)
- Module landing pages (`modules/*.qmd`)
- Slides (`slides/*.qmd`)
- Assignments/handouts (`assignments/*`, `handouts/*`)
- CSS/JS assets that modify navigation behavior

---

## 1. Core Information Architecture (Modules-first)

### 1.1 Modules as Primary Unit (MUST)

- The course site MUST be organized around **modules** as the primary container.
- Lectures MUST appear under their module both in navigation and on module landing pages.
- Modules MUST have dedicated landing pages.

This contract is aligned with the approved spec:  
“ASTR 201 Modules UI/UX Design Specification v1.0”.

### 1.2 Navigation Behavior (MUST)

| User action | Behavior |
|---|---|
| Click module name | Open module landing page (same tab) |
| Click lecture in sidebar | Open lecture slides in **new tab** |
| Click lecture card on module page | Open lecture slides in **new tab** |
| Expand/collapse module section | Toggle lecture list visibility |

---

## 2. Output Matrix (MUST)

The system MUST support these outputs:

| Artifact | HTML | PDF | RevealJS |
|---|---:|---:|---:|
| Home / Syllabus / Schedule | ✅ | ✅ (syllabus/schedule optional but supported) | — |
| Module landing pages | ✅ | (optional) | — |
| Assignments | ✅ | ✅ | — |
| Handouts | ✅ | ✅ | — |
| Slides | ✅ | — | ✅ |

### 2.1 “One Source, Many Outputs” Rule (SHOULD)

- Prefer a single `.qmd` source that can render to multiple outputs when feasible.
- If separate sources exist (e.g., notes vs slides), they MUST share naming conventions and linking rules.

---

## 3. Slides: New Tab Behavior (MUST)

### 3.1 Requirement

All slide links MUST open in a new tab:

- Sidebar lecture links
- Module lecture card links
- Any inline “View Slides” links

### 3.2 Implementation Constraint

Quarto sidebar YAML does not natively support `target="_blank"`.

Therefore implementation MUST use one of:

- **Option A (Preferred): JS injection** that sets target/rel on sidebar lecture links matching `/slides/`.
- **Option B (Fallback):** Sidebar links same-tab, but module cards MUST be new-tab (NOT preferred).

If Option B is used, it MUST be logged as an ADR and the UX inconsistency MUST be noted.

---

## 4. Prohibited Features (Explicit Non-Goals)

These features are explicitly forbidden for this course site v1:

- Time estimates (“this lecture will take 30 minutes”)
- Progress tracking / completion indicators
- Difficulty ratings
- Student authentication/login system
- Gamification (“badges”, “streaks”, etc.)
- Mandatory interactive widgets (interactivity is optional and additive)

---

## 5. Required UI Features (MUST)

### 5.1 Module Landing Pages (MUST)

Each module page MUST include:

1. Narrative introduction (2–3 short paragraphs)
2. Learning objectives (3–6 bullets)
3. Lecture card grid
4. Readings list (can be embedded or linked, but must exist)

Lecture cards MUST include:
- Lecture number + title
- Date (if available)
- One-line summary
- “View Slides →” link that opens new tab

### 5.2 Sidebar (MUST)

Sidebar MUST:
- Be docked style (or otherwise consistent with approved spec)
- Support expandable module sections
- Provide quick access to Course pages (syllabus/schedule)
- Include Handouts section

### 5.3 Search (SHOULD)

- Site search SHOULD be enabled for student discoverability.

---

## 6. Code + Computation Features (Python-first)

### 6.1 Executed Code (MUST support)

Site MUST support Python execution in `.qmd` via Jupyter kernel:
- embedded plots (matplotlib at minimum)
- tables (DataFrame rendering)

### 6.2 Code UX (MUST)

- HTML outputs MUST include:
  - code copy buttons
  - code folding (at least globally enabled; per-page override allowed)

### 6.3 Interactivity Tiers (MAY)

Interactivity is allowed in tiers:

- Tier 0 (MUST): static figures + executed outputs
- Tier 1 (MAY): lightbox images
- Tier 2 (MAY): Plotly/Altair interactivity (HTML only)
- Tier 3 (MAY): Pyodide-based in-browser Python demos (only for small snippets; never required)

If Tier 2–3 are implemented, they MUST degrade gracefully in PDF.

---

## 7. Build + CI Requirements (MUST)

### 7.1 Local Build Contract

These commands MUST succeed on the instructor machine:

- `quarto render`
- `quarto preview`
- Render of:
  - at least one assignment to PDF
  - at least one handout to PDF
  - at least one RevealJS deck

### 7.2 CI Build Contract (MUST)

CI MUST build:

1) Website HTML  
2) Representative PDFs:
   - syllabus OR one assignment OR one handout (choose at least 2)
3) One RevealJS deck render

CI MUST fail on:
- broken links in navigation
- Quarto render failure
- missing assets required for pages

Optional (SHOULD):
- link checker
- HTML validation (lightweight)

---

## 8. File + Naming Conventions (MUST)

### 8.1 Locations (MUST)

- Module pages: `modules/module-XX.qmd`
- Slides: `slides/lecture-XX-*.qmd`
- Handouts: `handouts/*`
- Assignments: `assignments/*`
- Shared assets: `assets/*` (scripts, css, images)

### 8.2 Naming (MUST)

- No spaces in filenames
- Use lowercase + dashes
- IDs for crossrefs use dashes (avoid underscores)

---

## 9. Acceptance Criteria (MUST)

A release is valid only if:

1. Navigation: any lecture is reachable in ≤2 clicks
2. All slide links open in new tab
3. No broken links
4. Light and dark themes remain readable and consistent
5. PDFs render without LaTeX errors
6. Responsive layout works on mobile/tablet/desktop (see acceptance screenshots doc)

---
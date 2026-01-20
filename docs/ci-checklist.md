---
title: "ASTR 101 Course Site Acceptance Screenshots (Golden Views)"
version: "1.0.1"
date: "2026-01-14"
status: "LOCKED (Release Gate)"
owner: "Dr. Anna Rosen"
---

# Acceptance Screenshots (Golden Views)

This document defines the **required screenshot set** that must be produced and reviewed for any release that touches:

- palette/tokens
- module layouts
- navigation/sidebar
- callouts
- slides theme/layout
- PDF rendering
- link behavior (new-tab rules)

**If any golden view looks wrong, fix tokens/layout once and re-check. No churn.**

---

## 0. Rules

1. Capture **Light + Dark** for all HTML views.
2. Capture at **3 breakpoints** (desktop/tablet/mobile) for key HTML pages.
3. Capture **PDF** pages as rendered output (not browser print).
4. Capture **RevealJS** at 3 slide archetypes.
5. Naming MUST follow the convention below.

---

## 1. Naming Convention (MUST)

Store in: `docs/acceptance/screenshots/`

Format:
- `YYYY-MM-DD__<view>__<mode>__<breakpoint>.png`
- Example: `2026-01-14__module-01__light__desktop.png`

Breakpoints:
- desktop: 1440×900
- tablet: 1024×768
- mobile: 390×844

---

## 2. Required HTML Golden Views (MUST)

### 2.1 Home
- `home__light__desktop`
- `home__dark__desktop`
- `home__light__mobile`
- `home__dark__mobile`

**Must verify:**
- nav/sidebar consistency
- link styling (Teal = interactive)
- headings (Indigo = structure)
- no accidental Gold/Rose spam

### 2.2 Module Landing Page (Module 01)
- `module-01__light__desktop`
- `module-01__dark__desktop`
- `module-01__light__mobile`
- `module-01__dark__mobile`

**Must verify:**
- narrative intro readable
- lecture card grid: 2 columns desktop, 1 column mobile
- “View Slides →” links visually Teal and open new tab
- callouts consistent with mapping

### 2.3 Assignment Page (one representative)
- `assignment-01__light__desktop`
- `assignment-01__dark__desktop`

**Must verify:**
- code blocks have copy + folding
- math readable
- callout styles correct
- no layout overflow

### 2.4 Handout Page (one representative)
- `handout-01__light__desktop`
- `handout-01__dark__desktop`

**Must verify:**
- print-friendly spacing
- figure captions legible
- crossrefs render correctly

---

## 3. Sidebar Behavior Checks (MUST)

Capture a screenshot showing sidebar expanded state:

- `sidebar-expanded__light__desktop`
- `sidebar-expanded__dark__desktop`

**Must verify:**
- module sections expandable/collapsible
- lecture links nested under modules
- EXAM markers are visible but NOT links (per spec)
- lecture links open in new tab (manual test — see §6.1)

---

## 4. Required PDF Golden Views (MUST)

### 4.1 Syllabus PDF
- `pdf-syllabus__page1.png`
- `pdf-syllabus__page2.png`

### 4.2 Assignment PDF
- `pdf-assignment-01__page1.png`
- `pdf-assignment-01__page2.png`

**Must verify:**
- no LaTeX overflow
- headings and body readable
- page breaks where expected
- figures/tables not clipped
- crossrefs resolved (no “??”)

---

## 5. Required RevealJS Golden Views (MUST)

Capture from rendered slides (HTML):

### 5.1 Title Slide
- `slides-title__canonical.png`

### 5.2 Content Slide (bullets + equation)
- `slides-content__canonical.png`

### 5.3 Figure-Heavy Slide
- `slides-figure__canonical.png`

**Must verify:**
- typography and spacing
- code blocks not neon
- figure caption readable
- incremental lists behave as expected

---

## 6. Functional Acceptance Tests (MUST)

In addition to screenshots, the following MUST be manually verified each release:

### 6.1 New-tab behavior (STRICT)
**Goal:** Slides never steal your current page context.

Verify:
1. In the sidebar, click any lecture under `/slides/`  
   ✅ MUST open in a new tab  
   ✅ current tab remains on the module page
2. On a module landing page, click a lecture card “View Slides →” link  
   ✅ MUST open in a new tab
3. Confirm new tabs use `rel="noopener"` (security best practice)

Fail condition:
- Any lecture link opens in the same tab.

### 6.2 Markers are non-interactive (STRICT)
Verify:
1. EXAM marker items do not navigate anywhere
2. EXAM markers are not focusable via keyboard tabbing
3. SPRING BREAK marker does not navigate anywhere

### 6.3 Build sanity
Verify:
1. `quarto render` succeeds at project root
2. At least 2 PDFs render successfully
3. At least 1 RevealJS deck renders successfully
4. Dark mode remains readable (no low-contrast gold text on light backgrounds)

Record results as a short checklist at bottom of the release PR.

---

## 7. Tiny CI Checklist (Copy into CI / PR description)

This is the minimal command set that must run in CI (or locally before merge).

```bash
# 1) Site build
quarto render

# 2) Representative PDF builds (pick at least two real files)
quarto render course-info/syllabus.qmd --to pdf
quarto render assignments/hw-01.qmd --to pdf

# 3) Representative slides build (RevealJS)
quarto render slides/lecture-01-course-overview.qmd --to revealjs
```

**Notes:**

- CI environment must include a TeX distribution for PDF builds.
- If file paths change, update this checklist + the CI workflow in the same PR.

---

## 8. Release Gate

A release is blocked if:

- any required screenshot is missing

- any screenshot shows semantic role drift (e.g. Teal headings, Gold links)

- any PDF has unresolved refs or layout overflow

- slide new-tab behavior regresses

- EXAM markers become clickable/focusable

_End of Document_
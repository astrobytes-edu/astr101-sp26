
---

## `docs/acceptance/course-site-acceptance-screenshots.md`

```markdown
---
title: "ASTR 101 Course Site Acceptance Screenshots (Golden Views)"
version: "1.0.0"
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
- link styling (Teal)
- headings (Indigo)
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
- lecture links open in new tab (functional test; note below)

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
- `slides-title__light.png`
(or if slides are dark-themed, capture the canonical theme)

### 5.2 Content Slide (bullets + equation)
- `slides-content__light.png`

### 5.3 Figure-Heavy Slide
- `slides-figure__light.png`

**Must verify:**
- typography and spacing
- code blocks not neon
- figure caption readable
- incremental lists behave as expected

---

## 6. Functional Acceptance Tests (MUST)

In addition to screenshots, the following MUST be manually verified each release:

1. From sidebar, lecture link opens in new tab
2. From module card, lecture link opens in new tab
3. `quarto render` succeeds at project root
4. At least 2 PDFs render successfully
5. At least 1 RevealJS deck renders successfully
6. Dark mode remains readable (no low-contrast gold text on light backgrounds)

Record results as a short checklist at bottom of the release PR.

---

## 7. Release Gate

A release is blocked if:
- any required screenshot is missing
- any screenshot shows semantic role drift (e.g. Teal headings, Gold links)
- any PDF has unresolved refs or layout overflow
- slide new-tab behavior regresses

---



# ASTR 201 Modules UI/UX Design Specification

**Version:** 1.0
**Date:** 2026-01-14
**Author:** Dr. Anna Rosen + Claude
**Status:** Approved for Implementation

---

## 1. Executive Summary

This document specifies the UI/UX design for restructuring the ASTR 201 course website around **modules as the primary organizational unit**. The goal is to unify navigation, provide cognitive scaffolding, and enable progressive disclosure of course content.

### Design Principles

1. **Modules first** — All content flows through module containers
2. **Two-mode navigation** — Quick access (sidebar dropdowns) + contextual learning (landing pages)
3. **No time estimates** — Equity: students learn at different paces
4. **New-tab slides** — Presentation mode is separate from reference mode
5. **Consistent cosmic theming** — Leverage existing color palette

---

## 2. Information Architecture

### 2.1 Sidebar Structure

```
Home
Course
  ├── Syllabus
  └── Schedule
Module 1: Foundations (Wks 1–3)              [expandable section]
  ├── Lecture 1: Course Overview
  ├── Lecture 2: Scaling & Units
  ├── Lecture 3: Kepler to Newton
  ├── Lecture 4: Gravity & Orbits
  ├── Lecture 5: Light as Information
  └── Lecture 6: Blackbodies I
Module 2: Inferring Star Properties (Wks 4–7)  [expandable section]
  ├── Lecture 7: Distance & Parallax
  ├── ...
  └── [EXAM 1 marker - not a link]
Module 3: Stellar Structure & Evolution (Wks 8–12)  [expandable section]
  ├── ...
  └── [EXAM 2 marker - not a link]
Module 4: Galaxies & Cosmology (Wks 13–15)    [expandable section]
  └── ...
Handouts
```

### 2.2 Navigation Behavior

| User Action | Result |
|-------------|--------|
| Click module name | Navigate to module landing page (same tab) |
| Click lecture name in sidebar | Open slides in **new tab** |
| Click lecture card on module page | Open slides in **new tab** |
| Expand/collapse module section | Toggle visibility of nested lectures |

### 2.3 File Structure

```
modules/
  ├── index.qmd              # Optional: overview of all modules
  ├── module-01.qmd          # Foundations landing page
  ├── module-02.qmd          # Inferring Star Properties landing page
  ├── module-03.qmd          # Stellar Structure & Evolution landing page
  └── module-04.qmd          # Galaxies & Cosmology landing page

slides/
  ├── lecture-01-course-overview.qmd
  ├── lecture-02-foundations.qmd
  └── ... (unchanged location, new naming may apply)
```

**Note:** Slides remain in `slides/` directory. Only the sidebar routing changes.

---

## 3. Module Landing Page Design

Each module landing page follows a **Narrative + Dashboard hybrid** structure.

### 3.1 Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Module Title                                               │
│  Subtitle: Weeks X–Y                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NARRATIVE INTRODUCTION (2–3 paragraphs)                    │
│  - The "big question" this module answers                   │
│  - Why it matters in the cosmic story                       │
│  - How it connects to previous/next modules                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LEARNING OBJECTIVES                                        │
│  • Objective 1                                              │
│  • Objective 2                                              │
│  • Objective 3                                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LECTURES                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Lecture 1        │  │ Lecture 2        │                │
│  │ Jan 20           │  │ Jan 22           │                │
│  │ One-line summary │  │ One-line summary │                │
│  │ [View Slides →]  │  │ [View Slides →]  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  READINGS (sidebar or below)                                │
│  • Chapter X (pp. Y–Z)                                      │
│  • Chapter A (pp. B–C)                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Section Specifications

#### 3.2.1 Narrative Introduction

- **Length:** 2–3 paragraphs (150–250 words)
- **Tone:** Engaging, connects to "cosmic story" theme
- **Content:**
  - Central question the module addresses
  - Real-world or research relevance
  - Connection to course arc: "Measure → Infer → Balance → Evolve"

#### 3.2.2 Learning Objectives

- **Format:** Bulleted list, 3–6 items
- **Style:** Action verbs (Calculate, Explain, Derive, Compare)
- **Scope:** What students will be able to do after completing the module

#### 3.2.3 Lecture Cards

Each lecture is displayed as a card with:

| Element | Specification |
|---------|---------------|
| **Title** | Lecture number + descriptive name |
| **Date** | Day of week + Month Day, Year |
| **Summary** | One sentence describing the topic |
| **Link** | Opens slides in new tab (`target="_blank"`) |

**Excluded (by design):**
- Time estimates (inequitable)
- Progress indicators (not tracking completion)
- Difficulty ratings (subjective, discouraging)

#### 3.2.4 Readings Section

- **Source:** Pulled from schedule.qmd data
- **Format:** Chapter + page range
- **Location:** Either in right margin or below lectures

---

## 4. Lecture Card Styling

### 4.1 Visual Design

Cards use the existing cosmic color palette:

```scss
// Card styling (add to site-light.scss / site-dark.scss)
.lecture-card {
  border-left: 4px solid $stellar-blue;
  background-color: rgba($stellar-blue, 0.05);
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
    background-color: rgba($stellar-blue, 0.1);
  }
}

.lecture-card-title {
  font-weight: 600;
  color: $cosmic-blue;
  margin-bottom: 0.25rem;
}

.lecture-card-date {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.5rem;
}

.lecture-card-summary {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.lecture-card-link {
  color: $stellar-blue;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: $aurora-teal;
  }
}
```

### 4.2 Grid Layout

- **Desktop:** 2 columns of cards
- **Tablet:** 2 columns
- **Mobile:** 1 column (stacked)

```scss
.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

---

## 5. Sidebar Configuration

### 5.1 _quarto.yml Changes

```yaml
website:
  sidebar:
    style: "docked"
    search: true
    contents:
      - href: index.qmd
        text: Home

      - section: "Course"
        contents:
          - course-info/syllabus.qmd
          - course-info/schedule.qmd

      - section: "Module 1: Foundations (Wks 1–3)"
        href: modules/module-01.qmd
        contents:
          - text: "Lecture 1: Course Overview"
            href: slides/lecture-01-course-overview.qmd
          - text: "Lecture 2: Scaling & Units"
            href: slides/lecture-02-foundations.qmd
          # ... additional lectures

      - section: "Module 2: Inferring Star Properties (Wks 4–7)"
        href: modules/module-02.qmd
        contents:
          - text: "Lecture 7: Distance & Parallax"
            href: slides/lecture-07-distance.qmd
          # ... additional lectures

      - section: "Module 3: Stellar Structure & Evolution (Wks 8–12)"
        href: modules/module-03.qmd
        contents:
          # ... lectures

      - section: "Module 4: Galaxies & Cosmology (Wks 13–15)"
        href: modules/module-04.qmd
        contents:
          # ... lectures

      - section: "Handouts"
        contents:
          - handouts/index.qmd
```

### 5.2 New-Tab Behavior for Slides

Quarto does not natively support `target="_blank"` in sidebar links. Options:

**Option A: JavaScript injection (recommended)**
Add to `assets/scripts.js`:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#quarto-sidebar a[href*="/slides/"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
});
```

**Option B: CSS + manual links on module pages**
Keep sidebar links as same-tab (fallback), but ensure module page cards use explicit `target="_blank"`.

**Recommendation:** Implement Option A for consistency.

---

## 6. Module Content Mapping

Based on schedule.qmd, the module-to-lecture mapping is:

### Module 1: Foundations (Weeks 1–3)
| Lecture | Date | Topics |
|---------|------|--------|
| 1 | Jan 20 | Spoiler Alerts: overview + how we know |
| 2 | Jan 22 | Scaling, units, dimensional analysis |
| 3 | Jan 27 | Kepler → Newton (empirical vs physical laws) |
| 4 | Jan 29 | Gravity/orbits; energy & angular momentum |
| 5 | Feb 3 | Light as information (preview) |
| 6 | Feb 5 | Blackbodies: spectrum + peak wavelength |

### Module 2: Inferring Star Properties (Weeks 4–7)
| Lecture | Date | Topics |
|---------|------|--------|
| 7 | Feb 10 | Distance: angular size + parallax + solid angle |
| 8 | Feb 12 | Luminosity/flux; magnitudes & distance modulus |
| 9 | Feb 17 | Blackbodies II: color → temperature; Stefan–Boltzmann |
| 10 | Feb 19 | Spectra: composition + ionization; H–R diagram |
| 11 | Feb 24 | Motions: proper motion + Doppler |
| 12 | Feb 26 | Binaries: measuring stellar masses |
| 13 | Mar 3 | Intensity vs flux; mean free path; optical depth |
| — | Mar 5 | **EXAM 1** |

### Module 3: Stellar Structure & Evolution (Weeks 8–12)
| Lecture | Date | Topics |
|---------|------|--------|
| 14 | Mar 10 | Ages & lifetimes; timescale reasoning |
| 15 | Mar 12 | Hydrostatic equilibrium + virial temperature |
| 16 | Mar 17 | Radiation transport: diffusion, radiation pressure |
| 17 | Mar 19 | Radiative vs convective envelopes |
| 18 | Mar 24 | Fusion ignition + main-sequence scalings |
| 19 | Mar 26 | Min/max masses: brown dwarfs & Eddington limit |
| — | Mar 31–Apr 2 | **SPRING BREAK** |
| 20 | Apr 7 | Low-mass evolution → white dwarfs |
| 21 | Apr 9 | Degeneracy pressure + Chandrasekhar limit |
| 22 | Apr 14 | High-mass evolution → core-collapse supernovae |
| — | Apr 16 | **EXAM 2** |

### Module 4: Galaxies & Cosmology (Weeks 13–15)
| Lecture | Date | Topics |
|---------|------|--------|
| 23 | Apr 21 | ISM phases; heating vs cooling |
| 24 | Apr 23 | Star formation: Jeans criterion; IMF |
| 25 | Apr 28 | Milky Way: rotation curve → dark matter |
| 26 | Apr 30 | External galaxies + Hubble law |
| 27 | May 5 | Cosmology capstone + synthesis |

---

## 7. Accessibility & Responsive Design

### 7.1 Accessibility Requirements

- All links must have descriptive text (no "click here")
- Color contrast must meet WCAG AA (already verified in previous work)
- Keyboard navigation must work for expandable sections
- Screen readers must announce section expansion state

### 7.2 Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| ≥1200px | Full sidebar + 2-column lecture cards |
| 768–1199px | Collapsible sidebar + 2-column cards |
| <768px | Hidden sidebar (hamburger) + 1-column cards |

---

## 8. Implementation Checklist

### Phase 1: File Creation
- [ ] Create `modules/module-01.qmd`
- [ ] Create `modules/module-02.qmd`
- [ ] Create `modules/module-03.qmd`
- [ ] Create `modules/module-04.qmd`
- [ ] Update `modules/index.qmd` (optional overview)

### Phase 2: Sidebar Reconfiguration
- [ ] Update `_quarto.yml` sidebar with module sections
- [ ] Remove standalone "Slides" section
- [ ] Nest lectures under modules

### Phase 3: Styling
- [ ] Add `.lecture-card` styles to `site-light.scss`
- [ ] Add `.lecture-card` styles to `site-dark.scss`
- [ ] Add `.lecture-grid` layout styles

### Phase 4: Slide Behavior
- [ ] Create `assets/scripts.js` with new-tab logic
- [ ] Reference script in `_quarto.yml`
- [ ] Test slide links from sidebar and module pages

### Phase 5: Verification
- [ ] Run `quarto render` — no errors
- [ ] Test all sidebar links
- [ ] Test all module page links
- [ ] Verify new-tab behavior
- [ ] Test on mobile viewport
- [ ] Verify dark mode styling

---

## 9. Constraints & Non-Goals

### In Scope
- Module landing pages with narrative + cards
- Expandable sidebar navigation
- New-tab slide behavior
- Consistent cosmic theming

### Out of Scope (explicitly excluded)
- Progress tracking / completion indicators
- Time estimates for lectures
- Interactive quizzes on module pages
- Video embeds (slides are primary medium)
- Student authentication / login

---

## 10. Success Criteria

1. **Navigation clarity:** Students can find any lecture in ≤2 clicks
2. **Cognitive scaffolding:** Each module page answers "why does this matter?"
3. **Zero broken links:** All sidebar and card links resolve correctly
4. **Theme consistency:** Cards match existing callout/cosmic styling
5. **Responsive behavior:** Works on phone, tablet, desktop

---

## Appendix A: Color Palette — "Observatory Slate"

A modern minimalist palette inspired by observatory control rooms at 2am: calm, intentional, muted.

**Design philosophy:**
- **Slate base** = instrument panel / night-adapted UI
- **Teal** = measurement / "data is alive" (primary interactive)
- **Indigo** = deep sky / theory-space (structure/navigation)
- **Gold** = photons / "important result" (use sparingly — warmest element)
- **Rose** = pitfalls / warnings / common errors

### A.1 Neutrals (Surface Layers)

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `bg` | `#f7f8fa` | `#0f1115` | Page background |
| `surface` | `#ffffff` | `#16181d` | Cards, nav, blocks |
| `surface-2` | `#eef1f5` | `#1d2026` | Subtle panels |
| `border` | `#d6dbe3` | `#2a2f38` | Lines, dividers |
| `text` | `#16181d` | `#e8ecf2` | Body text |
| `muted` | `#5c6470` | `#a8b0bf` | Secondary text |

### A.2 Semantic Accents

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| **Primary (Teal)** | `#2f6f6f` | `#5dbfbf` | Links, buttons, interactive elements |
| **Secondary (Indigo)** | `#5a5a8a` | `#9fa1d4` | Headings, tags, module labels, nav state |
| **Tertiary (Gold)** | `#7f6d44` | `#d8c08b` | Key callouts, badges, "this matters" (RARE) |
| **Warning (Rose)** | `#9a7b7f` | `#c9a5a8` | Misconceptions, warnings, common errors |

### A.3 Color Roles (Semantic Language)

Colors are **roles**, not decoration. Use consistently everywhere:

| Color | Semantic Role | Examples |
|-------|--------------|----------|
| **Teal** | Interactive | Links, buttons, toggles, hover states |
| **Indigo** | Structure | Section headers, module labels, active nav |
| **Gold** | Emphasis | Key results, exam-level ideas, important callouts |
| **Rose** | Danger | Misconceptions, common errors, pitfalls |

### A.4 Usage Ratio: 90/9/1

- **90% neutrals** — slate, white, grays
- **9% teal/indigo** — primary navigation and structure
- **1% gold/rose** — rare emphasis (gold becomes magical when scarce)

### A.5 SCSS Variables

```scss
// === NEUTRALS ===
// Light mode
$bg-light: #f7f8fa;
$surface-light: #ffffff;
$surface-2-light: #eef1f5;
$border-light: #d6dbe3;
$text-light: #16181d;
$muted-light: #5c6470;

// Dark mode
$bg-dark: #0f1115;
$surface-dark: #16181d;
$surface-2-dark: #1d2026;
$border-dark: #2a2f38;
$text-dark: #e8ecf2;
$muted-dark: #a8b0bf;

// === SEMANTIC ACCENTS ===
// Light mode
$teal-light: #2f6f6f;
$indigo-light: #5a5a8a;
$gold-light: #7f6d44;
$rose-light: #9a7b7f;

// Dark mode
$teal-dark: #5dbfbf;
$indigo-dark: #9fa1d4;
$gold-dark: #d8c08b;
$rose-dark: #c9a5a8;
```

### A.6 Accessibility Notes

- **Gold caveat:** Low contrast on light backgrounds — use as trim/highlight only, never for body links
- **Links:** Always underlined or have hover underline (never rely on color alone)
- **Callouts:** Use icon + title, not just tinted border
- All accent colors meet WCAG AA contrast on their respective backgrounds

---

## Appendix B: Example Module Page (module-01.qmd)

```yaml
---
title: "Module 1: Foundations"
subtitle: "Weeks 1–3 | The tools we'll use all semester"
---

## Why Foundations Matter

Before we can understand stars, galaxies, or the universe itself, we need a
shared language. This module builds that language: how to handle astronomical
scales, how gravity shapes orbits, and how light carries information across
cosmic distances.

Everything in this course—every calculation, every inference—rests on the
tools you'll master here. The equations may seem abstract now, but by Week 4,
you'll use them to measure the distances to stars.

## Learning Objectives

By the end of this module, you will be able to:

- Perform dimensional analysis to check equations
- Apply Kepler's laws and derive Newton's law of gravitation
- Explain how blackbody radiation encodes temperature information
- Calculate energy and angular momentum for orbiting bodies

## Lectures

::: {.lecture-grid}

::: {.lecture-card}
### Lecture 1: Course Overview
**Tue, Jan 20**

Spoiler alerts: what we'll discover this semester and how we know it.

[View Slides →](../slides/lecture-01-course-overview.qmd){target="_blank"}
:::

::: {.lecture-card}
### Lecture 2: Scaling & Units
**Thu, Jan 22**

Dimensional analysis as a physicist's superpower.

[View Slides →](../slides/lecture-02-foundations.qmd){target="_blank"}
:::

<!-- Additional lecture cards -->

:::

## Required Reading

- Chapter 1 (pp. 3–7): Introduction
- Chapter 7 (pp. 43–46): Gravity and Orbits
- Chapter 4.1–4.3 (pp. 25–27): Light and Spectra
```

---

*End of specification.*

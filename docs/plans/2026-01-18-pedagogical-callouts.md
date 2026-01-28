# Pedagogical Callouts System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace emoji-based callout workarounds with a semantic, icon-based callout system for ASTR 101 pedagogical elements.

**Architecture:** Extend `assets/theme/callouts.scss` with new custom callout classes using Bootstrap Icons. Each callout type has a semantic name, consistent styling, and appropriate icon. Create a contract document specifying when to use each type.

**Tech Stack:** SCSS, Bootstrap Icons (already loaded), Quarto callout system

---

## Task 1: Add Core Pedagogical Callouts to SCSS

**Files:**
- Modify: `assets/theme/callouts.scss` (append after line 223)

**Step 1: Add check-yourself callout**

Append to `assets/theme/callouts.scss`:

```scss
// ==============================================================
// PEDAGOGICAL CALLOUTS - ASTR 101
// ==============================================================

// Check Yourself - retrieval practice prompt
.callout-check-yourself {
  border-left: 4px solid $teal-light;
  background-color: rgba($teal-light, 0.06);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-check-yourself::before {
  font-family: "bootstrap-icons";
  content: "\F3FE  Check Yourself";  // bi-hand-index
  font-weight: 600;
  color: $teal-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-check-yourself {
  border-left-color: $teal-dark;
  background-color: rgba($teal-dark, 0.08);
}

[data-bs-theme="dark"] .callout-check-yourself::before {
  color: $teal-dark;
}
```

**Step 2: Add deep-dive callout**

Append to `assets/theme/callouts.scss`:

```scss
// Deep Dive - optional advanced content (collapsed by default)
.callout-deep-dive {
  border-left: 4px solid $indigo-light;
  background-color: rgba($indigo-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-deep-dive::before {
  font-family: "bootstrap-icons";
  content: "\F5AB  Deep Dive";  // bi-telescope
  font-weight: 600;
  color: $indigo-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-deep-dive {
  border-left-color: $indigo-dark;
  background-color: rgba($indigo-dark, 0.08);
}

[data-bs-theme="dark"] .callout-deep-dive::before {
  color: $indigo-dark;
}
```

**Step 3: Add worked-example callout**

Append to `assets/theme/callouts.scss`:

```scss
// Worked Example - step-by-step calculation
.callout-worked-example {
  border-left: 4px solid $indigo-light;
  background-color: rgba($indigo-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-worked-example::before {
  font-family: "bootstrap-icons";
  content: "\F4C9  Worked Example";  // bi-pencil-square
  font-weight: 600;
  color: $indigo-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-worked-example {
  border-left-color: $indigo-dark;
  background-color: rgba($indigo-dark, 0.08);
}

[data-bs-theme="dark"] .callout-worked-example::before {
  color: $indigo-dark;
}
```

**Step 4: Add key-insight callout**

Append to `assets/theme/callouts.scss`:

```scss
// Key Insight - core conceptual takeaway
.callout-key-insight {
  border-left: 4px solid $gold-light;
  background-color: rgba($gold-light, 0.06);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-key-insight::before {
  font-family: "bootstrap-icons";
  content: "\F47C  Key Insight";  // bi-lightbulb-fill
  font-weight: 600;
  color: $gold-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-key-insight {
  border-left-color: $gold-dark;
  background-color: rgba($gold-dark, 0.08);
}

[data-bs-theme="dark"] .callout-key-insight::before {
  color: $gold-dark;
}
```

**Step 5: Add misconception callout**

Append to `assets/theme/callouts.scss`:

```scss
// Misconception Alert - common error to surface and correct
.callout-misconception {
  border-left: 4px solid $rose-light;
  background-color: rgba($rose-light, 0.06);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-misconception::before {
  font-family: "bootstrap-icons";
  content: "\F32A  Misconception Alert";  // bi-exclamation-diamond
  font-weight: 600;
  color: $rose-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-misconception {
  border-left-color: $rose-dark;
  background-color: rgba($rose-dark, 0.08);
}

[data-bs-theme="dark"] .callout-misconception::before {
  color: $rose-dark;
}
```

**Step 6: Run quarto render to verify SCSS compiles**

Run: `quarto render modules/module-01/readings/lecture-01-spoiler-alerts-reading.qmd 2>&1 | head -20`

Expected: No SCSS compilation errors

**Step 7: Commit core callouts**

```bash
git add assets/theme/callouts.scss
git commit -m "feat(callouts): Add core pedagogical callouts (check-yourself, deep-dive, worked-example, key-insight, misconception)"
```

---

## Task 2: Add Content & Navigation Callouts

**Files:**
- Modify: `assets/theme/callouts.scss` (append)

**Step 1: Add the-more-you-know callout**

Append to `assets/theme/callouts.scss`:

```scss
// The More You Know - optional interesting info (collapsed by default)
.callout-the-more-you-know {
  border-left: 4px solid $purple-light;
  background-color: rgba($purple-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-the-more-you-know::before {
  font-family: "bootstrap-icons";
  content: "\F431  The More You Know";  // bi-info-circle
  font-weight: 600;
  color: $purple-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-the-more-you-know {
  border-left-color: $purple-dark;
  background-color: rgba($purple-dark, 0.08);
}

[data-bs-theme="dark"] .callout-the-more-you-know::before {
  color: $purple-dark;
}
```

**Step 2: Add why-this-matters callout**

Append to `assets/theme/callouts.scss`:

```scss
// Why This Matters - motivation and relevance
.callout-why-this-matters {
  border-left: 4px solid $mauve-light;
  background-color: rgba($mauve-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-why-this-matters::before {
  font-family: "bootstrap-icons";
  content: "\F1DB  Why This Matters";  // bi-bullseye
  font-weight: 600;
  color: $mauve-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-why-this-matters {
  border-left-color: $mauve-dark;
  background-color: rgba($mauve-dark, 0.06);
}

[data-bs-theme="dark"] .callout-why-this-matters::before {
  color: $mauve-dark;
}
```

**Step 3: Add roadmap callout**

Append to `assets/theme/callouts.scss`:

```scss
// Roadmap - navigation and orientation
.callout-roadmap {
  border-left: 4px solid $slate-light;
  background-color: rgba($slate-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-roadmap::before {
  font-family: "bootstrap-icons";
  content: "\F5D6  Roadmap";  // bi-signpost-2
  font-weight: 600;
  color: $slate-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-roadmap {
  border-left-color: $slate-dark;
  background-color: rgba($slate-dark, 0.06);
}

[data-bs-theme="dark"] .callout-roadmap::before {
  color: $slate-dark;
}
```

**Step 4: Add prediction callout**

Append to `assets/theme/callouts.scss`:

```scss
// Prediction - pre-reading prediction prompt
.callout-prediction {
  border-left: 4px solid $indigo-light;
  background-color: rgba($indigo-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-prediction::before {
  font-family: "bootstrap-icons";
  content: "\F504  Prediction";  // bi-question-circle
  font-weight: 600;
  color: $indigo-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-prediction {
  border-left-color: $indigo-dark;
  background-color: rgba($indigo-dark, 0.08);
}

[data-bs-theme="dark"] .callout-prediction::before {
  color: $indigo-dark;
}
```

**Step 5: Add summary callout**

Append to `assets/theme/callouts.scss`:

```scss
// Summary - section wrap-up
.callout-summary {
  border-left: 4px solid $slate-light;
  background-color: rgba($slate-light, 0.04);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  font-size: $callout-font-size !important;
}

.callout-summary::before {
  font-family: "bootstrap-icons";
  content: "\F233  Summary";  // bi-card-checklist
  font-weight: 600;
  color: $slate-light;
  display: block;
  margin-bottom: 0.5rem;
  font-size: $callout-label-size;
}

[data-bs-theme="dark"] .callout-summary {
  border-left-color: $slate-dark;
  background-color: rgba($slate-dark, 0.06);
}

[data-bs-theme="dark"] .callout-summary::before {
  color: $slate-dark;
}
```

**Step 6: Verify SCSS compiles**

Run: `quarto render modules/module-01/readings/lecture-01-spoiler-alerts-reading.qmd 2>&1 | head -20`

Expected: No SCSS compilation errors

**Step 7: Commit content & navigation callouts**

```bash
git add assets/theme/callouts.scss
git commit -m "feat(callouts): Add content and navigation callouts (the-more-you-know, why-this-matters, roadmap, prediction, summary)"
```

---

## Task 3: Add Slate Color Tokens (if missing)

**Files:**
- Modify: `assets/theme/design_tokens.scss` (check if slate exists)

**Step 1: Check if slate color exists**

Run: `grep -n "slate" assets/theme/design_tokens.scss assets/theme/tokens_generated.scss`

If slate is missing, add to `design_tokens.scss`:

```scss
// Slate - neutral gray for structural elements
$slate-light: #64748b;
$slate-dark: #94a3b8;
```

**Step 2: Commit if changes made**

```bash
git add assets/theme/design_tokens.scss
git commit -m "feat(tokens): Add slate color for structural callouts"
```

---

## Task 4: Create Test Page for Callouts

**Files:**
- Create: `handouts/callout-showcase.qmd`

**Step 1: Create showcase page**

Create `handouts/callout-showcase.qmd`:

```markdown
---
title: "Pedagogical Callout Showcase"
subtitle: "Visual reference for ASTR 101 callout types"
format: html
---

## Active Learning Callouts

::: {.callout-check-yourself}
**Sample prompt:** A star appears to wobble periodically. Which observable is this?
:::

::: {.callout-prediction}
Before reading further, predict: what color will a 10,000 K star appear?
:::

::: {.callout-tps}
**Think:** What determines a star's color?
**Pair:** Compare your answer with a neighbor.
**Share:** One insight from your discussion.
:::

## Content Callouts

::: {.callout-key-insight}
**Physics tells you what relationships are allowed.** The inverse-square law isn't arbitrary — it's geometry.
:::

::: {.callout-worked-example}
**Problem:** Calculate the frequency of red light (λ = 700 nm).

**Solution:**
$\nu = c/\lambda = (3 \times 10^{10}\ \text{cm/s}) / (7 \times 10^{-5}\ \text{cm}) = 4.3 \times 10^{14}\ \text{Hz}$
:::

::: {.callout-deep-dive collapse="true"}
The inverse-square law follows from geometry: a sphere's surface area is $4\pi r^2$. As light spreads over larger spheres, the energy per unit area drops as $1/r^2$.
:::

::: {.callout-the-more-you-know collapse="true"}
Henrietta Leavitt discovered the period-luminosity relation for Cepheids in 1912 while cataloging variable stars in the Magellanic Clouds. She was paid 30 cents per hour.
:::

## Structural Callouts

::: {.callout-roadmap}
| Section | Topic | Time |
|---------|-------|------|
| 1.1 | The Four Observables | 10 min |
| 1.2 | The Spoiler Reel | 20 min |
:::

::: {.callout-summary}
**Key points from this section:**

- We measure four things directly: flux, position, wavelength, timing
- Everything else is inferred through models
- The gap between measurement and knowledge is where physics lives
:::

::: {.callout-why-this-matters}
Distance measurements aren't just bookkeeping — they give us the age of the universe. Without Cepheids and supernovae, we wouldn't know we live in a 13.8-billion-year-old cosmos.
:::

## Metacognitive Callouts

::: {.callout-misconception}
**"Astronomers measure the temperature of stars directly."**

Wrong. We measure the spectrum (wavelength distribution). Temperature is *inferred* from Wien's Law.
:::

::: {.callout-problem}
A star at 10 pc has apparent magnitude m = 5. What is its absolute magnitude M?
:::

::: {.callout-solution}
M = m - 5 log(d/10) = 5 - 5 log(1) = 5
:::

::: {.callout-sanity-check}
**Units check:** Does $L = 4\pi r^2 \sigma T^4$ give watts?

$[\text{m}^2][\text{W/m}^2\text{K}^4][\text{K}^4] = [\text{W}]$ ✓
:::

::: {.callout-frontier}
**Hubble Tension:** Different methods give different values for $H_0$. Is this measurement error or new physics?
:::
```

**Step 2: Render the showcase**

Run: `quarto render handouts/callout-showcase.qmd`

Expected: Clean render, all icons display correctly

**Step 3: Commit showcase**

```bash
git add handouts/callout-showcase.qmd
git commit -m "docs(callouts): Add callout showcase page for visual reference"
```

---

## Task 5: Create Pedagogical Elements Contract

**Files:**
- Create: `docs/contracts/astr201-pedagogical-elements.md`

**Step 1: Write the contract**

Create `docs/contracts/astr201-pedagogical-elements.md`:

```markdown
# ASTR 101 Pedagogical Elements Contract

*Semantic callout types for consistent pedagogy across all course materials.*

Version: v1.0 • Status: Active • Owner: Instructor

---

## Overview

This contract defines the callout types available in ASTR 101 and when to use each. All callouts use Bootstrap Icons (no emojis) for a clean, professional appearance.

---

## Callout Inventory

### Active Learning (Engagement)

| Type | Syntax | Purpose | Collapse? |
|------|--------|---------|-----------|
| **Check Yourself** | `.callout-check-yourself` | Retrieval practice prompt | No |
| **Prediction** | `.callout-prediction` | Pre-reading prediction | No |
| **Think-Pair-Share** | `.callout-tps` | Collaborative discussion | No |

**Usage rules:**
- At least one retrieval prompt every 300-500 words of reading
- Prediction prompts go *before* the content they preview
- TPS includes all three components: Think, Pair, Share

---

### Content (Information Delivery)

| Type | Syntax | Purpose | Collapse? |
|------|--------|---------|-----------|
| **Key Insight** | `.callout-key-insight` | Core conceptual takeaway | No |
| **Worked Example** | `.callout-worked-example` | Step-by-step calculation | No |
| **Deep Dive** | `.callout-deep-dive` | Optional advanced content | Yes |
| **The More You Know** | `.callout-the-more-you-know` | Interesting optional info | Yes |

**Usage rules:**
- Key Insights are rare (max 2-3 per reading) — they mark the "one thing to remember"
- Worked Examples show full solution with units and sanity checks
- Deep Dives and More You Know are always collapsible (`collapse="true"`)
- Deep Dives = physics/math detail; More You Know = history/context/fun facts

---

### Structural (Navigation)

| Type | Syntax | Purpose | Collapse? |
|------|--------|---------|-----------|
| **Roadmap** | `.callout-roadmap` | Section overview/orientation | No |
| **Summary** | `.callout-summary` | Section wrap-up | No |
| **Why This Matters** | `.callout-why-this-matters` | Motivation and relevance | No |

**Usage rules:**
- Roadmaps appear at section starts, often with tables
- Summaries appear at section ends with bullet points
- "Why This Matters" connects content to big questions or real applications

---

### Metacognitive (Learning Awareness)

| Type | Syntax | Purpose | Collapse? |
|------|--------|---------|-----------|
| **Misconception** | `.callout-misconception` | Common error to surface | No |
| **Sanity Check** | `.callout-sanity-check` | Verification prompt | No |

**Usage rules:**
- Misconception callouts state the wrong belief, then correct it
- Sanity checks include the check (units, limits, order of magnitude)

---

### Problem-Solving (from existing system)

| Type | Syntax | Purpose | Collapse? |
|------|--------|---------|-----------|
| **Problem** | `.callout-problem` | Structured problem statement | No |
| **Solution** | `.callout-solution` | Key result (use sparingly) | No |
| **Frontier** | `.callout-frontier` | Unsolved mysteries | No |

---

## Color Palette Reference

| Color | Light Mode | Dark Mode | Used By |
|-------|------------|-----------|---------|
| Teal | `$teal-light` | `$teal-dark` | check-yourself, sanity-check, tip |
| Indigo | `$indigo-light` | `$indigo-dark` | deep-dive, worked-example, prediction, problem, tps |
| Gold | `$gold-light` | `$gold-dark` | key-insight, solution |
| Purple | `$purple-light` | `$purple-dark` | the-more-you-know, frontier |
| Mauve | `$mauve-light` | `$mauve-dark` | why-this-matters, hero |
| Rose | `$rose-light` | `$rose-dark` | misconception, warning, caution |
| Slate | `$slate-light` | `$slate-dark` | roadmap, summary |

---

## Syntax Examples

### Basic usage

```markdown
::: {.callout-check-yourself}
What is the relationship between wavelength and frequency?
:::
```

### With custom title

```markdown
::: {.callout-deep-dive title="The Inverse-Square Law" collapse="true"}
Content here...
:::
```

### Collapsible (default closed)

```markdown
::: {.callout-the-more-you-know title="Henrietta Leavitt" collapse="true"}
Historical context...
:::
```

---

## Migration Guide

Replace old patterns with new semantic callouts:

| Old Pattern | New Callout |
|-------------|-------------|
| `callout-tip` with "Check Yourself" title | `.callout-check-yourself` |
| `callout-note` with "Deep Dive" title | `.callout-deep-dive` |
| `callout-note` with "Worked Example" title | `.callout-worked-example` |
| `callout-important` with "Key Insight" title | `.callout-key-insight` |
| `callout-warning` with "Misconception" title | `.callout-misconception` |
| `callout-note` with "Roadmap" title | `.callout-roadmap` |
| `callout-note` with "Summary" title | `.callout-summary` |

---

## Icon Reference (Bootstrap Icons)

| Callout | Icon | Unicode |
|---------|------|---------|
| check-yourself | bi-hand-index | `\F3FE` |
| deep-dive | bi-telescope | `\F5AB` |
| worked-example | bi-pencil-square | `\F4C9` |
| key-insight | bi-lightbulb-fill | `\F47C` |
| misconception | bi-exclamation-diamond | `\F32A` |
| the-more-you-know | bi-info-circle | `\F431` |
| why-this-matters | bi-bullseye | `\F1DB` |
| roadmap | bi-signpost-2 | `\F5D6` |
| prediction | bi-question-circle | `\F504` |
| summary | bi-card-checklist | `\F233` |
| problem | bi-puzzle | `\F4EF` |
| solution | bi-check-circle | `\F26A` |
| sanity-check | bi-calculator | `\F1C1` |
| tps | bi-chat-dots | `\F249` |
| frontier | bi-question-diamond | `\F505` |

---

## Maintenance

- Add new callout types to this contract before implementing in SCSS
- Update color tokens in `design_tokens.scss` if adding new colors
- Test all callouts in both light and dark modes before release
```

**Step 2: Commit the contract**

```bash
git add docs/contracts/astr201-pedagogical-elements.md
git commit -m "docs(contracts): Add pedagogical elements contract for callout system"
```

---

## Task 6: Verify All Icons Display Correctly

**Step 1: Preview the showcase page**

Run: `quarto preview handouts/callout-showcase.qmd`

Check in browser:
- [ ] All icons render (not boxes or question marks)
- [ ] Colors match specification
- [ ] Collapsible callouts work
- [ ] Dark mode toggle works

**Step 2: Fix any icon issues**

If icons don't render, verify Bootstrap Icons font is loaded. Check `_quarto.yml` for:

```yaml
format:
  html:
    include-in-header:
      - text: |
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
```

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(callouts): Complete pedagogical callout system implementation"
```

---

## Summary

| Task | Files | Purpose |
|------|-------|---------|
| 1 | `callouts.scss` | Core callouts (check-yourself, deep-dive, worked-example, key-insight, misconception) |
| 2 | `callouts.scss` | Content/nav callouts (the-more-you-know, why-this-matters, roadmap, prediction, summary) |
| 3 | `design_tokens.scss` | Add slate color if missing |
| 4 | `callout-showcase.qmd` | Visual test page |
| 5 | `astr201-pedagogical-elements.md` | Contract documentation |
| 6 | Browser | Verify icons display |

---

## Post-Implementation

After completing this plan:
1. Migrate Lecture 1 reading to use new semantic callouts
2. Update `astr201-pedagogical-contract.md` to reference this elements contract
3. Add callout usage to slide template and reading template

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

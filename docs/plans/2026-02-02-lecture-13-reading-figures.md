# Lecture 13 Reading Figures Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Register the new `assets/images/module-01/lec13/*` figures in `assets/figures.yml` and integrate them into `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd` via `{{< fig ... >}}`.

**Architecture:** Keep `assets/figures.yml` as the single source of truth (path + caption + alt). Reference figures in the reading by id (no raw paths). Insert figures at section boundaries where they clarify or summarize, and avoid editing prose unless it materially improves clarity.

**Tech Stack:** Quarto `.qmd`, course shortcodes (`{{< fig ... >}}`), YAML registry (`assets/figures.yml`).

## Task 1: Inventory the new Lecture 13 images

**Files:**
- Verify: `assets/images/module-01/lec13/`

**Step 1: List files**

Run: `ls -la assets/images/module-01/lec13`

Expected: seven PNGs for Drake Equation, Fermi paradox, nucleosynthesis, and the Module 1 concept map.

**Step 2: Sanity-check images**

Open each image and confirm:
- The title matches the intended section (Drake framework/terms/scenarios, expected value, Fermi paradox, stars make elements, concept map).
- There is no text that contradicts the reading’s statements (if present, fix captions to frame as “illustrative” rather than “measured fact”).

## Task 2: Add figure registry entries

**Files:**
- Modify: `assets/figures.yml`

**Step 1: Add new figure ids (kebab-case)**

Add entries under the Module 1 section:
- `drake-equation-framework`
- `drake-terms-measured-vs-unknown`
- `drake-equation-scenarios`
- `drake-expected-value`
- `fermi-paradox`
- `stars-make-elements`
- `module-1-concept-map` (must exist because the reading already references it)

**Step 2: Fill required fields**

Each entry needs:
- `path`: `/assets/images/module-01/lec13/<filename>.png`
- `caption`: pedagogical (“What to notice …”)
- `alt`: 1–2 sentences capturing the key information (not decorative)
- `module: 1`

**Step 3: Quick registry validation**

Run: `rg -n \"^(\\s{2})?[a-z0-9-]+:$\" assets/figures.yml | head`

Expected: ids are consistently kebab-case and nested under `figures:`.

## Task 3: Integrate figures into the reading

**Files:**
- Modify: `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd`

**Step 1: Insert Drake framework overview**

Add immediately after the Drake Equation callout:

```markdown
{{< fig drake-equation-framework >}}
```

**Step 2: Add “measured vs unknown” organizer**

Add near the start of `## What We Know (Terms 1-3)` (before `### $R_*$`):

```markdown
{{< fig drake-terms-measured-vs-unknown >}}
```

**Step 3: Add visual for “Three Drake Scenarios”**

Add after the `::: {.callout-note title="Three Drake Scenarios"}` block closes:

```markdown
{{< fig drake-equation-scenarios >}}
```

**Step 4: Add expected-value intuition**

Inside the “Perspective: Zooming Out to the Observable Universe” callout (after the probability argument), add:

```markdown
{{< fig drake-expected-value >}}
```

**Step 5: Add Fermi paradox map**

Inside the “The Fermi Paradox” callout (after the bullet list of possible answers), add:

```markdown
{{< fig fermi-paradox >}}
```

**Step 6: Add stars-make-elements synthesis figure**

In `## Stars as Element Factories`, add after the paragraph about supernovae enriching later generations:

```markdown
{{< fig stars-make-elements >}}
```

**Step 7: Ensure the concept map resolves**

Confirm the reading’s existing line:

```markdown
{{< fig module-1-concept-map >}}
```

…has a matching registry entry pointing at `assets/images/module-01/lec13/module-01-concept-map-gemini.png`.

## Task 4: Verify render

**Files:**
- Verify build output: `_site/` (generated)

**Step 1: Full render**

Run: `conda run -n astro make render`

Expected: render completes with no errors (especially no missing figure id errors).

**Step 2: Spot-check the reading**

Open `_site/modules/module-01/readings/lecture-13-are-we-alone-reading.html` and confirm:
- Captions read well and don’t overclaim.
- Images are legible at page width (no tiny text).
- No duplicated “same idea twice in a row” fatigue; if it feels redundant, remove the less useful figure or move it later.


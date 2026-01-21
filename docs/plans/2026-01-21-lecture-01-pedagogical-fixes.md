# Lecture 01 Pedagogical Fixes Implementation Plan
> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Remove confusing “blank” slides, tighten scientific claims to match the ASTR 101 pedagogical contract, and improve slide-to-slide conceptual alignment and attribution for Lecture 01.

**Architecture:** Keep content changes localized to `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`, with supporting updates in registries (`assets/figures.yml`, optional new figure IDs) and site navigation (`_quarto.yml`). Verify by rendering the lecture deck and ensuring no stray empty slides or broken links remain.

**Tech Stack:** Quarto + RevealJS, course Lua shortcodes (`_extensions/course/shortcodes.lua`), figure/media registries (`assets/figures.yml`, `assets/media.yml`).

---

## Task 1: Verify “blank slide” root causes are gone

**Files:**
- Verify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Confirm no PART-divider comment blocks remain**

Run: `rg -n "PART [0-9]+:" modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
Expected: no matches.

**Step 2: Confirm no standalone empty-slide separators exist**

Run: `rg -n "^\\s*---\\s*$" modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd | head`
Expected: separators exist, but each should be between real slides (no `---` blocks that isolate only comments).

**Step 3: Render and confirm there are no empty `<section class="slide level2">` blocks**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: render completes; open `_site/modules/module-01/slides/lecture-01-spoiler-alerts-slides.html` and search for an empty slide:

Run: `rg -n "<section class=\\\"slide level2\\\">\\s*$" _site/modules/module-01/slides/lecture-01-spoiler-alerts-slides.html`
Expected: no matches.

---

## Task 2: Add two “Dark Universe” spoilers (Dynamics + Cosmic Web)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
- Verify: `assets/figures.yml` (existing figure IDs)

**Step 1: Add Spoiler 6 (Dark matter from dynamics) BEFORE the DESI slide**

Create a slide with:
- Title: `Spoiler 6: Hidden Mass — The Dark Matter Problem`
- Visual: `{{< img lsst-cosmic-treasure-chest class="img-center" >}}` (Rubin “Cosmic Treasure Chest” zoom image)
- Bullets (keep short, one idea):
  - **We measure:** how galaxies and stars move (from spectra over time)
  - **We infer:** extra unseen mass (“dark matter”)
  - **The physics:** gravity links motion to mass; if objects move too fast, there must be more mass than we can see

**Step 2: Add short speaker notes that define the inference**

In speaker notes, add 2 short lines:
- “Dark matter is an inference from motion: we measure how things move (using Doppler shifts), and gravity tells us how much mass must be there.”
- “When the required mass is bigger than the stars + gas we can see, we’ve discovered missing mass: dark matter.”

**Step 3: Make the DESI slide Spoiler 7 (Cosmic web / expansion history)**

Keep `{{< img desi-3d-map class="img-center" >}}`, but change the text to match the visual:
- **We measure:** redshifts (wavelength shifts) → distances → 3D positions
- **We infer:** large-scale structure (filaments/voids) and expansion history constraints
- **The physics:** gravity + expansion shape the cosmic web; mapping structure tests cosmological models

**Step 4: Keep the “5/27/68” fractions, but put them in notes**

Use the NASA pie-chart figure for the on-slide visual (it already has the numbers), and put a single line in speaker notes:
- “Universe contents (today): ~5% normal matter, ~27% dark matter, ~68% dark energy (as shown in the NASA graphic).”

**Step 5: Render-check Spoiler 6 + Spoiler 7**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: Spoiler 6 (dark matter from motion) appears immediately before Spoiler 7 (DESI cosmic web), and both visuals match their claims; no new warnings.

---

## Task 3: Add scope conditions to “Wavelength Is Energy” (avoid overgeneralization)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Tighten the on-slide claim**

On the “Wavelength Is Energy” slide, change:
- `Shorter wavelength = Higher energy = Hotter source`
to:
- `For thermal light: shorter wavelength → higher photon energy → hotter source`

**Step 2: Add one “don’t overgeneralize” note**

Add a short speaker-note line like:
- “Note: some radio/X-ray emission is non-thermal (not a thermometer); we’ll learn those cases later.”

**Step 3: Render-check**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: no layout regressions; wording is visible and concise.

---

## Task 4: Soften or verify high-precision numeric claims

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Targets (from current audit):**
- Rubin “20 billion” and “0.05%” (`modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd` near the Rubin zoom-out notes)
- Any “cosmic recipe” splits (same slide as Spoiler 6 notes)

**Step 1: Replace exact numbers with order-of-magnitude language (default)**

Examples:
- “over 1,000 images” instead of “1,100 images”
- “tens of billions” instead of “20 billion”
- “a tiny fraction” instead of “0.05%”

**Step 2: If you want to keep exact numbers, add a `VERIFY` pointer in notes**

Add a speaker-notes line like:
- `VERIFY: Rubin projection for total galaxies detected + fraction in this visualization; update these numbers with a source link.`

**Step 3: Render-check**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: slides remain clean; notes contain explicit `VERIFY` markers if needed.

---

## Task 5: Background image attributions (no fabrication)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
- Optional: `assets/figures.yml` (if you decide to register background assets)

**Step 1: Inventory backgrounds used in this deck**

Run: `rg -n "background-image=\\\"/assets/images" modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
Expected: list of background images (JWST cosmic cliffs, NOIRLab mosaic, ESO panoramic, etc.).

**Step 2: For each background, add an attribution block**

Pattern (right under the slide heading):
```markdown
::: {data-attribution="TBD" data-attribution-position="bottom right"}
:::
```

Do not guess credits. Use `TBD` until you verify the correct attribution.

**Step 3: (Optional but cleaner) Register background images in `assets/figures.yml`**

If you want a single source of truth, add entries like:
- `cosmic-cliffs-jwst-bg: { path: ..., credit: "TBD", alt: ... }`

Then switch slide backgrounds to reference those entries only after you have a reliable mechanism (otherwise keep direct `background-image=...` and just use `data-attribution`).

**Step 4: Render-check**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: attribution overlay appears on slides with backgrounds; no missing-file errors.

---

## Task 6: Split “What’s a Light-Year?” into two slides (reduce cognitive load)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Create Slide A (definition + misconception)**

Keep only:
- “distance, not time”
- “distance light travels in one year”

**Step 2: Create Slide B (optional quick calculation / sci notation preview)**

Move the calculation bullets to a new slide titled e.g. “How big is a light-year?” and keep it short.

**Step 3: Render-check**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: neither slide exceeds the word budget; pacing feels smoother.

---

## Task 7: Tighten one phrasing for scale intuition

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Replace “trillions of kilometers away” with a scale students will reuse**

Change the question slide text to use “light-years away” (or “many light-years away”) to align with later lookback-time content.

**Step 2: Render-check**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: no change in layout, only improved scale framing.

---

## Task 8: Fix the Lecture 2 sidebar warning (student-facing polish)

**Files:**
- Modify: `_quarto.yml:107-114`
- Either create: `modules/module-01/slides/lecture-02-foundations.qmd` (stub) **or** update link target to the correct file.

**Step 1: Decide whether Lecture 2 slides exist yet**

Run: `ls -la modules/module-01/slides`
Expected: currently Lecture 2 file may not exist.

**Step 2A (preferred): Create a stub Lecture 2 file if you want the nav live**

Create `modules/module-01/slides/lecture-02-foundations.qmd` with minimal frontmatter and a placeholder slide indicating “Coming soon”.

**Step 2B: If you don’t want the nav live yet, remove or comment the link**

In `_quarto.yml`, remove the Lecture 2 “Slides” entry (or point it to an existing file).

**Step 3: Render-check**

Run: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected: no “Unable to resolve link target” warnings.

---

## Final verification checklist (after all tasks)

Run:
- `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`

Expected:
- No empty/blank slides.
- Spoiler 6 image and text match.
- “Wavelength is energy” includes scope condition.
- No unverified precise numeric claims unless labeled `VERIFY` in notes.
- No Quarto warnings about missing link targets.

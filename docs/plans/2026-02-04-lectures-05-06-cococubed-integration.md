# Lecture 05–06 Cococubed Figure Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate cococubed figures strategically into Lecture 5 and 6 slides/readings, replacing weaker visuals and breaking up text-only slide runs while preserving ASTR 101 pedagogical and registry conventions.

**Architecture:** Update lecture `.qmd` files to use cococubed figure IDs from `assets/figures.yml` via `{{< img ... >}}` (slides) and `{{< fig ... >}}` (readings). Do not delete or move assets; only swap references. Ensure no long runs of text-only slides by inserting image slides at key transitions.

**Tech Stack:** Quarto + RevealJS, ASTR 101 pedagogical contract, figure registry shortcodes in `assets/figures.yml`.

---

### Task 1: Inventory Current Figure Usage and Text-Only Runs

**Files:**
- Modify: none (analysis only)

**Step 1: List current figures in Lecture 5 and 6 slides/readings**

Run:
```bash
rg -n "< fig|< img" modules/module-01/slides/lecture-05-keplers-laws-slides.qmd modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd modules/module-01/readings/lecture-05-keplers-laws-reading.qmd modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd
```
Expected: existing figure IDs for L05/L06.

**Step 2: Scan for text-only slide sequences**

Run:
```bash
rg -n "^## " modules/module-01/slides/lecture-05-keplers-laws-slides.qmd
rg -n "^## " modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd
```
Expected: headings list for quick visual inspection to plan image insertions.

---

### Task 2: Insert Early Visuals in Lecture 5 Slides (Break Text Runs)

**Files:**
- Modify: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd`

**Step 1: Insert a visual slide after “The planets wander” (around line 68)**

Add new slide after that section:
```markdown
---

## {.center}

{{< img cococubed-planet-orbits width="90%" >}}

::: {.notes}
Quick visual grounding: the Solar System layout before the retrograde puzzle.
:::
```

**Step 2: Replace the retrograde image in “The Wanderers” (line ~108)**

Change:
```markdown
{{< img retrograde-motion-mars width="100%" >}}
```
To:
```markdown
{{< img cococubed-retrograde-heliocentric width="100%" >}}
```

**Step 3: Add a heliocentric retrograde diagram after “The Highway Analogy”**

Insert a new slide after the analogy to show the geometry:
```markdown
---

## {.center}

{{< img cococubed-retrograde-heliocentric width="95%" >}}

::: {.notes}
Use this to trace Earth overtaking Mars and the apparent backward loop.
:::
```

---

### Task 3: Replace Kepler Law Visuals in Lecture 5 Slides

**Files:**
- Modify: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd`

**Step 1: Replace Kepler First Law image (line ~420)**

Change:
```markdown
{{< img kepler-1st-law-ellipse width="100%" >}}
```
To:
```markdown
{{< img cococubed-kepler-first-law width="100%" >}}
```

**Step 2: Keep eccentricity variants if still best, otherwise swap**

If replacing:
```markdown
{{< img kepler-1st-law-eccentricity-variants width="100%" >}}
```
To:
```markdown
{{< img cococubed-orbit-types-simple width="100%" >}}
```
If keeping, leave as-is.

**Step 3: Replace Kepler Second Law image (line ~525)**

Change:
```markdown
{{< img kepler-2nd-law-equal-areas width="100%" >}}
```
To:
```markdown
{{< img cococubed-kepler-second-law width="100%" >}}
```

**Step 4: Add a conservation/area visual after “What Equal Areas Means”**

Insert a new image slide:
```markdown
---

## {.center}

{{< img cococubed-angular-momentum-orbit width="90%" >}}

::: {.notes}
Reinforce why closer = faster through angular momentum conservation.
:::
```

---

### Task 4: Integrate Cococubed Figures in Lecture 5 Reading

**Files:**
- Modify: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`

**Step 1: Replace retrograde motion figure**

Change:
```markdown
{{< fig retrograde-motion-mars >}}
```
To:
```markdown
{{< fig cococubed-retrograde-heliocentric >}}
```

**Step 2: Replace Kepler First Law figure**

Change:
```markdown
{{< fig kepler-1st-law-ellipse >}}
```
To:
```markdown
{{< fig cococubed-kepler-first-law >}}
```

**Step 3: Replace Kepler Second Law figure**

Change:
```markdown
{{< fig kepler-2nd-law-equal-areas >}}
```
To:
```markdown
{{< fig cococubed-kepler-second-law >}}
```

**Step 4: Add a planet-orbits visual near Kepler III**

Insert before the Kepler III discussion section:
```markdown
{{< fig cococubed-planet-orbits >}}
```

---

### Task 5: Integrate Cococubed Figures in Lecture 6 Slides (Core Concepts)

**Files:**
- Modify: `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd`

**Step 1: Add a Moon‑falling visual after “The Moon Is Falling” (line ~72)**

Insert a new slide:
```markdown
---

## {.center}

{{< img cococubed-moon-falling width="85%" >}}

::: {.notes}
Use the force/velocity arrows to explain why the Moon keeps missing Earth.
:::
```

**Step 2: Replace Newton’s cannon image with cococubed trajectory diagram**

Change:
```markdown
{{< fig newtons-cannon >}}
```
To:
```markdown
{{< fig cococubed-falling-to-orbit-trajectories >}}
```

**Step 3: Add a ball‑on‑string visual near centripetal force**

Insert after “What Provides the Centripetal Force?” or “Centripetal Acceleration”:
```markdown
---

## {.center}

{{< img cococubed-ball-on-string width="80%" >}}

::: {.notes}
Shows why inward force is required for circular motion.
:::
```

**Step 4: Replace gravity equation visual**

Change:
```markdown
{{< fig gravity-equation-visual >}}
```
To:
```markdown
{{< fig cococubed-gravity-law >}}
```

**Step 5: Add center‑of‑mass visual at the “Astronomical Payoff” slide**

Insert a new slide immediately after the “Astronomical Payoff” text:
```markdown
---

## {.center}

{{< img cococubed-center-of-mass-orbits width="85%" >}}

::: {.notes}
Tie directly to stellar wobble and exoplanet detection.
:::
```

---

### Task 6: Integrate Cococubed Figures in Lecture 6 Slides (Kepler + Deep Dives)

**Files:**
- Modify: `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd`

**Step 1: Replace the conic sections visual**

Change:
```markdown
{{< fig conic-sections-orbits >}}
```
To:
```markdown
{{< img cococubed-conic-sections width="90%" >}}
```

**Step 2: Add a Kepler II visual in the “Equal Areas” section**

Insert after “Explaining Kepler II: Equal Areas”:
```markdown
---

## {.center}

{{< img cococubed-kepler-second-law width="85%" >}}

::: {.notes}
Visually reinforce equal areas before the angular momentum link.
:::
```

**Step 3: Add escape velocity visual in the Deep Dive**

Insert after the “Escape Velocity” slide:
```markdown
---

## {.center}

{{< img cococubed-escape-velocity-rocket width="85%" >}}

::: {.notes}
Shows orbit raising and escape trajectory visually.
:::
```

---

### Task 7: Integrate Cococubed Figures in Lecture 6 Reading

**Files:**
- Modify: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`

**Step 1: Add Moon‑falling visual after “The Apple and the Moon”**

Insert:
```markdown
{{< fig cococubed-moon-falling >}}
```

**Step 2: Replace Newton’s cannon figure**

Change:
```markdown
{{< fig newtons-cannon >}}
```
To:
```markdown
{{< fig cococubed-falling-to-orbit-trajectories >}}
```

**Step 3: Replace gravity‑law visual**

Change:
```markdown
{{< fig gravity-equation-visual >}}
```
To:
```markdown
{{< fig cococubed-gravity-law >}}
```

**Step 4: Add center‑of‑mass visual in the wobble section**

Insert near the exoplanet wobble explanation:
```markdown
{{< fig cococubed-center-of-mass-orbits >}}
```

**Step 5: Add conic‑sections visual in Kepler I explanation**

Insert near the “conic section” paragraph:
```markdown
{{< fig cococubed-conic-sections >}}
```

**Step 6: Add equal‑areas visual in Kepler II explanation**

Insert near the angular‑momentum explanation:
```markdown
{{< fig cococubed-kepler-second-law >}}
```

**Step 7: Add escape‑velocity visual in the Deep Dive**

Insert:
```markdown
{{< fig cococubed-escape-velocity-rocket >}}
```

---

### Task 8: Verify and Commit

**Files:**
- Modify: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd`
- Modify: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`
- Modify: `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd`
- Modify: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`

**Step 1: Render to catch missing figure IDs**

Run:
```bash
conda run -n astro make render
```
Expected: no errors; figure IDs resolve.

**Step 2: Commit**

Run:
```bash
git add modules/module-01/slides/lecture-05-keplers-laws-slides.qmd \
  modules/module-01/readings/lecture-05-keplers-laws-reading.qmd \
  modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd \
  modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd

git commit -m "content: integrate cococubed figures in lectures 5–6"
```


# Week 04 JWST Figures (Lectures 7–10) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Place the existing “week-04/ JWST” figure set into Lectures 7–10 where it best supports the narrative, and replace the few remaining “rough” SVGs where a week-04 figure already covers the concept.

**Architecture:** Treat `assets/figures.yml` as the source of truth (the week-04 images are already registered). Implement by editing the lecture reading `.qmd` files to add/swap `{{< fig ... >}}` embeds, then validate with `quarto`/`make render`.

**Tech Stack:** Quarto (`.qmd`), course figure registry (`assets/figures.yml`), shortcodes (`{{< fig id >}}`), `conda run -n astro ...` for render checks.

---

## Preflight (inventory + constraints)

### Confirm week-04 figures are already registered

**Files:**
- Inspect: `assets/figures.yml`
- Inspect: `assets/images/module-01/week-04/`

**Step 1: Sanity check IDs exist**

Run:
- `rg -n "week-04/" assets/figures.yml`

Expected:
- Entries exist for: `mechanical-vs-em-wave`, `em-spectrum-jwst`, `wavelength-energy`, `prism-spectrum-jwst`, `light-matter-interactions`, `absorption-emission-spectra-jwst`, `altair-spectrum-jwst`, `doppler-shift-star-jwst`, `reflectance-spectra-earth-jwst`.

**Step 2: Confirm lectures 7–10 do not already embed these**

Run:
- `rg -n "(mechanical-vs-em-wave|em-spectrum-jwst|wavelength-energy|prism-spectrum-jwst|light-matter-interactions|absorption-emission-spectra-jwst|altair-spectrum-jwst|doppler-shift-star-jwst|reflectance-spectra-earth-jwst)" modules/module-01/readings/lecture-0[7-9]-*.qmd modules/module-01/readings/lecture-10-*.qmd`

Expected:
- No matches (fresh placements).

---

## Task 1: Lecture 7 — Add week-04 visuals where the prose already calls for them

**Files:**
- Modify: `modules/module-01/readings/lecture-07-light-information-reading.qmd`

**Step 1: Add a “mechanical vs EM waves” visual**
- Insert `{{< fig mechanical-vs-em-wave >}}` immediately after the paragraph that explains EM waves “need no medium” and “travel through the vacuum of space”.

**Step 2: Add a “visible is tiny” spectrum visual**
- Insert `{{< fig em-spectrum-jwst >}}` near the start of “The Electromagnetic Spectrum” section (best placement: after the “More Than Meets the Eye” paragraph and before the table).
- Keep the existing `{{< fig em-spectrum-full >}}` later in the section as the “full infographic with examples” (do not remove unless it feels redundant on re-read).

**Step 3: Add a wavelength–energy visual**
- Insert `{{< fig wavelength-energy >}}` in the “Bonus: Why ‘High-Energy’ Light?” callout, right after the sentence that introduces photon energy increasing with frequency (`E = hf`).

**Step 4: Add a prism spectrum visual**
- Insert `{{< fig prism-spectrum-jwst >}}` in the “Sunlight Is All Colors” subsection of the Rayleigh scattering section, right after the sentence about a prism spreading sunlight into a rainbow.

**Step 5: Render-check just this reading**

Run:
- `conda run -n astro quarto render modules/module-01/readings/lecture-07-light-information-reading.qmd`

Expected:
- Render succeeds and the inserted figures appear with captions (no `[ERROR: Figure ... not found]`).

**Step 6: Commit**

Run:
- `git add modules/module-01/readings/lecture-07-light-information-reading.qmd`
- `git commit -m "chore(l07): place week-04 JWST wave/spectrum figures"`

---

## Task 2: Lecture 9 — Replace the Fraunhofer schematic and deepen the “spectra are data” story

**Files:**
- Modify: `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`

**Step 1: Replace the Fraunhofer-lines SVG with the week-04 “spectrum as strip + graph”**
- Replace `{{< fig fraunhofer-lines >}}` with `{{< fig altair-spectrum-jwst >}}` in the “The Missing Colors” section, immediately after the Fraunhofer story.
- Keep `fraunhofer-lines` registered (do not delete/rename files); this just swaps the embed used in the reading.

**Step 2: Add a “how spectra get made” interactions visual**
- Insert `{{< fig light-matter-interactions >}}` right before the “Visual Summary” / Kirchhoff setup where you enumerate continuous vs emission vs absorption situations.

**Step 3: Add an “absorption vs emission at the same wavelengths” visual**
- Insert `{{< fig absorption-emission-spectra-jwst >}}` in “Each Element Has a Unique Pattern”, immediately after the bullet list of example elements (Hydrogen/Sodium/Calcium/Iron).

**Step 4 (optional): Add reflectance spectra as a “preview”**
- Add a short collapsed callout (e.g., “Deep Dive: Spectra also work for planets”) near the end of Part 1, then insert `{{< fig reflectance-spectra-earth-jwst >}}`.
- Keep this optional because it adds a new idea; only do it if it supports your L11/L12 direction.

**Step 5: Render-check just this reading**

Run:
- `conda run -n astro quarto render modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`

Expected:
- Render succeeds; the Fraunhofer section now shows a “spectrum as data” figure and Kirchhoff’s section has clearer visuals.

**Step 6: Commit**

Run:
- `git add modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`
- `git commit -m "chore(l09): use week-04 JWST spectra figures"`

---

## Task 3: Lecture 10 — Add a Doppler “line shifts” visual (JWST week-04)

**Files:**
- Modify: `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`

**Step 1: Place a Doppler shift visual early**
- Insert `{{< fig doppler-shift-star-jwst >}}` in “The Fingerprints Move”, right after the paragraph that says the “pattern was shifted” and introduces Doppler as the culprit.

**Step 2: Render-check just this reading**

Run:
- `conda run -n astro quarto render modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`

Expected:
- Render succeeds; the Doppler intro has a clear “line moves red/blue” picture.

**Step 3: Commit**

Run:
- `git add modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`
- `git commit -m "chore(l10): place week-04 JWST Doppler figure"`

---

## Task 4: Full validation (site-wide)

**Step 1: Render the full student site**

Run:
- `conda run -n astro make render`

Expected:
- Full render succeeds.

**Step 2: (Optional) grep for shortcode figure errors**

Run:
- `rg -n \"\\[ERROR: Figure\" _site || true`

Expected:
- No matches.

---

## Remaining “bad SVG” replacements (figure briefs for Gemini)

Week-04 does not cover these concepts directly; keep current SVGs for now, but here are concrete replacement briefs if you want Gemini to generate new art (PNG) or if you want a redesigned SVG in the repo style:

1) `proxima-centauri-info` (Lecture 7)
   - Visual: a star icon + “light to us” arrow; 4–5 callout bubbles labeled **Temperature**, **Composition**, **Motion (Doppler)**, **Distance (brightness)**, **Planets (wobble/transit)**.
   - Constraint: do not assert time-sensitive facts; make it explicitly “example”.

2) `rayleigh-scattering-sky` + `sunset-scattering` (Lecture 7)
   - Visual A (daytime): Sun rays entering atmosphere; blue scattered toward observer; red mostly forward.
   - Visual B (sunset): long path length; blue scattered out; remaining direct beam red/orange at observer.
   - Must include the idea “shorter λ scatters more” without claiming “blue travels slower” (avoid that misconception).

3) `infrared-thermal-image` (Lecture 8)
   - Preferred: a real, licensed thermal-camera photo pair (visible vs thermal) with a simple caption; if staying schematic, use a clean, non-cartoon two-panel with a single temperature color bar.

4) `radial-vs-transverse` + `radial-velocity-method` (Lecture 10)
   - Visual A: two-panel showing the same velocity magnitude with different line-of-sight components; only LOS produces wavelength shift.
   - Visual B: star–planet barycenter wobble + corresponding sinusoidal RV curve; clearly label “approaching = blueshift” and “receding = redshift”.

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-02-02-week04-jwst-figures-lectures-07-10.md`.

If you want me to execute it next, I’ll switch to `superpowers:executing-plans` and apply it task-by-task with frequent commits.

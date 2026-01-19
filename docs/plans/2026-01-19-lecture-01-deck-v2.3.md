# Lecture 01 (Spoiler Alerts) v2.3 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Convert `modules/module-01/_prep/lecture-01/lecture-01-slide-outline-v2.3.md` into a teachable, registry-based Quarto RevealJS deck in `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`, keeping existing working media slides inline and enforcing a consistent spoiler triad panel: **Measure / Infer / Physics / Why it matters later**.

**Architecture:** Keep the current deck as the base, then (1) insert missing “Sun temperature” prediction+reveal, (2) correct the “six quantities” content, (3) refactor Spoiler 1–10 slides to the required triad panel pattern, and (4) bring the synthesis/tools/closing sequence into alignment with the outline while keeping existing working media (video) slides inline.

**Tech Stack:** Quarto `.qmd` + RevealJS; registry shortcodes `{{< img ... >}}` from `assets/figures.yml` and `{{< media ... >}}` from `assets/media.yml`; patterns from `modules/module-01/_prep/slide-patterns.md`.

## Preconditions / Invariants

- No invented facts/numbers/credits. If something is unknown, put `VERIFY` / `[TBD]` in `::: notes`.
- No raw RevealJS `<section>`; use Quarto headings/blocks (`##`, `::: notes`, `::: {.quiz}`, `:::: {.columns}`).
- No `r-fit-text`.
- Default on-slide text ≤ ~35 words (tables excluded); move detail into `::: notes`.
- Keep the throughline visible: **Measure → Infer → Balance → Evolve** and course thesis **pretty pictures → measurements → models → inferences**.
- Spoiler slides (titles `Spoiler X: ...`) must all include the same 4-line panel: **Measure / Infer / Physics / Why it matters later**.
- Keep existing working media slides inline (Rubin/HR/RR Lyrae/Trifid), even if total slide count exceeds 40.

## Target Files

- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
- Verify registries (no expected edits): `assets/figures.yml`, `assets/media.yml`
- Reference patterns: `modules/module-01/_prep/slide-patterns.md`

## Render/Verification Command (required)

Run:
- `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`

Expected:
- Clean render (no errors), and slide layouts remain readable (no obvious overflow in common patterns: columns, tables, quizzes).

---

### Task 1: Insert Sun-temperature prediction + reveal (Outline Slides 11–12)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Add “Prediction: How do we know the Sun’s temperature?” slide**

- Place immediately after `## Models Are the Bridge (“Decoder Ring”)`.
- Use a question/prediction pattern (no giant blocks).
- On-slide choices (do not add new claims):
  - A) Sent a thermometer on a spacecraft
  - B) Measured wavelength/spectrum of sunlight (correct)
  - C) Calculated from Sun’s size and distance
  - D) Estimate based on “how hot it looks”

**Step 2: Add “Prediction reveal” slide**

- One-sentence reveal: temperature is inferred from the measured spectrum + a model (Wien/blackbody).
- No new visual assets required; use an existing subtle background (or plain black).
- Notes must include the “temperature is never directly measured” punchline.

---

### Task 2: Replace “Six quantities” Part 1/2 with the correct six (Outline Slide 13) + add the six-quantities quiz (Outline Slide 15)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Remove current two-slide table**

- Delete:
  - `## Six Core Quantities (Inferred) — Part 1`
  - `## Six Core Quantities (Inferred) — Part 2`

**Step 2: Add one corrected six-quantities slide**

- Use `.table-scroll .text-sm`.
- Table rows must be exactly (per outline v2.3):
  - distance, time, speed, mass, energy/luminosity, temperature
- Include a one-line note (on slide or in notes) that none are direct observables.
- Do not add “composition” as one of the six (ok to mention as an application in notes only).

**Step 3: Add “Quick Check: The Six Quantities” quiz slide**

- Place after the existing “Quick Check: What can we measure directly?”
- Quiz choices per outline v2.3, with B correct:
  - B) distance, time, speed, mass, luminosity, temperature

---

### Task 3: Enforce the required 4-line spoiler panel (Spoilers 1–10)

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Update Spoiler reel orientation slide**

- Convert from 3-item triad to a 4-card preview (Measure/Infer/Physics/Why it matters later).
- Keep on-slide text minimal; put teaching script in notes.

**Step 2: Refactor each spoiler slide to the same panel structure**

For each `## Spoiler X: ...` slide:
- Use `:::: {.columns}` with image left and panel right.
- Panel must be exactly:
  - **Measure:**
  - **Infer:**
  - **Physics:**
  - **Why it matters later:**
- Keep the panel terse; move details into notes.

**Spoiler-specific “Why it matters later” anchors (from outline):**
- Spoiler 1: spectral fingerprints map composition.
- Spoiler 2: distance chain underpins most astronomy.
- Spoiler 3: “starstuff” claim comes from spectra + nucleosynthesis models.
- Spoiler 4: spectroscopy appears everywhere (temperature/composition/velocity).
- Spoiler 5: wavelength is a temperature/energy ladder.
- Spoiler 6: same object, different components visible at different λ.
- Spoiler 7: IR reveals embedded star formation.
- Spoiler 8: complex systems require multi-λ synthesis.
- Spoiler 9: most mass is invisible (dark matter) and we infer it from motions.
- Spoiler 10: cosmology revised models when observations surprised us.

---

### Task 4: Align synthesis/tools/closing to outline while keeping existing working slides

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`

**Step 1: Add/rename synthesis slide: “Which observable appeared most often?”**

- Use a short prompt + hint: “It starts with W”.
- Ensure notes explicitly connect back to spoilers.

**Step 2: Doppler bridge**

- Keep the existing “Where Doppler Appears” content but ensure it’s readable (≤ ~35 words).
- Notes: include the “recognize it matters” framing (no derivation).

**Step 3: Light equations slides**

- Keep two equation slides (`c = λν` and `E = hν = hc/λ`) as “orientation” slides.
- Optional improvement: add `{{< img energy-wavelength-connection >}}` to the photon-energy slide to reduce text load.
- Notes must include: symbol meanings, units check, and one limiting-case statement (per outline).

**Step 4: Lookback time + quiz**

- Replace the current “image-only” lookback slide with a titled slide that includes a small table (Moon/Sun/Andromeda/distant galaxies), plus the punchline “Distance is a time dial.”
- Add the lookback-time quick check quiz after it.

**Step 5: Closing**

- Ensure there is an explicit “What you can do now” summary slide (learning objectives recap).
- Keep “Math Boot Camp” next + Questions.
- Keep existing motivational image slides (NASA “Three Big Questions” and `answering-big-questions`) inline, but keep their on-slide text minimal and move framing to notes.

---

### Task 5: Full render check (required)

**Step 1: Render**

Run:
- `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`

**Step 2: Fix any errors**

- Resolve missing ids, broken shortcodes, invalid block nesting, or syntax issues.
- Do not do drive-by refactors unrelated to this lecture.


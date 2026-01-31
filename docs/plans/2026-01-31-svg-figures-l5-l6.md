# Kepler/Newton SVG Figure Pack (L5–L6) Implementation Plan

> **For Claude/Codex:** REQUIRED SUB-SKILLS: `astro-svg-figures`, `astr201-figures`, and `superpowers:executing-plans` (if executing task-by-task).

**Goal:** Create a consistent, scientifically correct, pedagogical SVG “figure pack” for Lectures 5–6 (Kepler’s Laws + Newton’s Gravity), using the Jewel Aurora / Deep Jewel palettes, and register every figure in `assets/figures.yml`.

**Architecture:** SVG-first assets in `assets/images/module-01/lec05/` and `assets/images/module-01/lec06/` with a shared styling approach (CSS variables inside each SVG). Validation is lightweight and repeatable: XML parse checks, YAML parse checks, and a small helper script for any “equal area” constructions.

**Tech Stack:** Plain SVG, Quarto figure registry (`assets/figures.yml`), simple validation with `python3` and `ruby -ryaml`.

---

## Conventions (apply to every figure)

- Artboard: `960×540` with `viewBox="0 0 960 540"` unless there’s a strong reason otherwise.
- Include accessibility metadata: `<title>`, `<desc>`, `role="img"`, `aria-labelledby`.
- Use **one** of the two palettes (or both) via CSS variables inside the SVG:
  - **Jewel Aurora:** Teal `#028391`, Pink `#BE5A83`, Violet `#7077A1`
  - **Deep Jewel:** Teal `#257180`, Pink `#A35C7A`, Violet `#655D8A`
- Use neutrals: background `#0b0b0f`, foreground text `#eef0ff`, muted `#c9cbe5`.
- Captions: start with “What to notice: …” and make the student task explicit.
- Alt text: 1–2 sentences describing the diagram’s structure and key message.

---

## Task 1: Add/confirm directories for SVGs

**Files:**
- Create (if missing): `assets/images/module-01/lec06/`

**Steps:**
1. Create directory if missing: `mkdir -p assets/images/module-01/lec06`
2. Confirm SVGs for L5 exist: `ls assets/images/module-01/lec05/*.svg`

---

## Task 2: Add a reusable SVG scaffold (optional but recommended)

**Files:**
- Create: `assets/images/module-01/_svg-template.svg`

**Step 1: Create template**
- Include palettes as CSS variables and accessibility boilerplate.

**Step 2: Verify XML parses**
Run: `python3 -c "import xml.etree.ElementTree as ET; ET.parse('assets/images/module-01/_svg-template.svg')"`
Expected: exit code `0`.

---

## Task 3: Helper script for Kepler II “equal areas” construction

**Why:** Any figure that visually asserts “equal area” must be equal by construction.

**Files:**
- Create: `scripts/kepler_equal_areas.py`

**Step 1: Write the helper**
- Inputs: eccentricity `e`, ellipse radii `a`/`b`, a chosen perihelion-sector half-width `alpha` (in radians).
- Output: matching aphelion-sector half-width `beta` such that swept areas match (numerical solve).
- Also print the four key points needed to construct SVG wedge paths.

**Step 2: Run sanity check**
Run: `python3 scripts/kepler_equal_areas.py --e 0.4 --a 320 --b 180 --alpha 0.9`
Expected: prints `beta≈0.423` and point coordinates.

---

# Lecture 5 Figure Tasks (Kepler)

## Task 4: Kepler I — “same ellipse, different e” (variants)

**Figure intent:** Make “Sun at a focus” and “eccentricity controls shape” visually obvious.

**Files:**
- Create: `assets/images/module-01/lec05/kepler-1st-law-eccentricity-variants.svg`
- Modify: `assets/figures.yml`

**Step 1: Design**
- Three side-by-side panels:
  - `e = 0` (circle; foci coincide at center)
  - `e ≈ 0.3` (mild ellipse; focus offset visible)
  - `e ≈ 0.6` (strong ellipse; focus offset very visible)
- In each panel: mark Sun focus, center, and label `e` value.

**Step 2: Implement SVG**
- Use consistent label placement; avoid clutter.

**Step 3: Validate**
- XML parse (same command as above).
- Manual: open SVG in browser; verify each panel is readable at 50% zoom.

**Step 4: Register**
- Add ID: `kepler-1st-law-eccentricity-variants`

---

## Task 5: Kepler II — “equal areas everywhere” (4 wedges)

**Figure intent:** Prevent “equal areas is a one-off trick”; show it’s global.

**Files:**
- Create: `assets/images/module-01/lec05/kepler-2nd-law-equal-areas-4wedges.svg`
- Modify: `assets/figures.yml`
- Use: `scripts/kepler_equal_areas.py`

**Step 1: Choose geometry**
- Moderate eccentricity (`e ≈ 0.3–0.4`) so speed change is visible but not extreme.

**Step 2: Compute wedge parameters**
- Use helper to compute multiple equal-area sectors at different true-anomaly regions (or choose 4 regions and solve for matching arc extents).

**Step 3: Implement SVG**
- Shade 4 equal-area regions with alternating (Pink/Violet) at low opacity.
- Label each with “same Δt”.
- Add a short note: “Equal area ⇒ variable speed”.

**Step 4: Validate**
- Re-run helper with recorded parameters; confirm equal areas numerically.
- XML parse + manual open.

**Step 5: Register**
- Add ID: `kepler-2nd-law-equal-areas-4wedges`

---

## Task 6: Kepler II — speed vectors overlay (tangential)

**Figure intent:** Connect “equal areas” to “faster near perihelion”.

**Files:**
- Create: `assets/images/module-01/lec05/kepler-2nd-law-speed-vectors.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Draw ellipse + Sun at focus.
2. At 4–6 points around orbit, draw tangential velocity arrows:
   - longer near perihelion (Pink)
   - shorter near aphelion (Violet)
3. Label: “Speed is not constant; areal speed is.”
4. Validate XML parse + manual open.
5. Register ID: `kepler-2nd-law-speed-vectors`

---

## Task 7: Kepler III — ratio method infographic (student-safe)

**Figure intent:** Teach the *right* operational form:
\[(P_2/P_1)^2 = (a_2/a_1)^3\]

**Files:**
- Create: `assets/images/module-01/lec05/kepler-3rd-law-ratio-method.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Layout: equation at top, then a “plug-and-chug template” box with blanks.
2. Include a mini worked example using abstract symbols (avoid new numerical claims).
3. Add a “units cancel” callout: “Use consistent units on both sides.”
4. Validate XML parse + manual open.
5. Register ID: `kepler-3rd-law-ratio-method`

---

## Task 8: Kepler III — misuse warning (AU/years and Sun-only)

**Figure intent:** Preempt misuse of `P^2 = a^3`.

**Files:**
- Create: `assets/images/module-01/lec05/kepler-3rd-law-warning-au-years-sun.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Big “WARNING” header.
2. Show:
   - ✅ `P^2 ∝ a^3` (always for Keplerian, two-body)
   - ✅ ratio method (recommended)
   - ⚠️ `P^2 = a^3` only if (years, AU, orbiting the Sun; Sun-dominated mass)
3. Add a “don’t do this” example block with crossed-out mixed units.
4. Validate + register ID: `kepler-3rd-law-warning-au-years-sun`

---

# Lecture 6 Figure Tasks (Newton)

## Task 9: Newton’s gravity as a central force (vectors)

**Figure intent:** Show force/acceleration always points toward the central mass (explains ellipse + areal law).

**Files:**
- Create: `assets/images/module-01/lec06/newton-central-force-vectors.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Draw ellipse + Sun focus.
2. Place planet at 5–7 points; draw inward-pointing arrows (Teal) from planet to Sun labeled “F” or “a”.
3. Add a note: “Direction changes; always toward Sun.”
4. Validate + register ID: `newton-central-force-vectors`

---

## Task 10: Why equal areas? (angular momentum deep dive)

**Figure intent:** Make the areal law’s *mechanism* visible (optional deep dive).

**Files:**
- Create: `assets/images/module-01/lec06/areal-velocity-angular-momentum.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Minimal algebra: `dA/dt = constant` (areal speed) and `L = m r v⊥` constant (conceptual).
2. Diagram: radius vector `r`, perpendicular velocity component `v⊥`, and “same swept area” cue.
3. Validate + register ID: `areal-velocity-angular-momentum`

---

## Task 11: Kepler’s “constant” isn’t constant (Newton version)

**Figure intent:** Preview that “Kepler’s constant” depends on the central mass:
\[P^2 = \\frac{4\\pi^2}{G(M+m)} a^3 \\approx \\frac{4\\pi^2}{GM} a^3\]

**Files:**
- Create: `assets/images/module-01/lec06/kepler-3rd-law-newton-mass-dependence.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Start with “Kepler: `P^2 ∝ a^3`” then “Newton: the proportionality constant contains `M`”.
2. Add a conceptual caption: “Bigger central mass ⇒ shorter period at same `a`.”
3. Validate + register ID: `kepler-3rd-law-newton-mass-dependence`

---

## Task 12: Orbit weighs mass (inference pipeline)

**Figure intent:** “Measure orbit ⇒ infer mass” pipeline.

**Files:**
- Create: `assets/images/module-01/lec06/orbit-weighs-central-mass.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Left: measured quantities (`P`, `a`) as “observables”.
2. Middle: equation box `M ≈ 4π² a³/(G P²)` (or qualitative “M from orbit” if you want to avoid formula density).
3. Right: inferred “mass”.
4. Validate + register ID: `orbit-weighs-central-mass`

---

## Task 13: Binary/exoplanet wobble cartoon (mass inference use case)

**Figure intent:** Connect L6 to real measurements (barycenter/wobble).

**Files:**
- Create: `assets/images/module-01/lec06/binary-orbit-barycenter.svg`
- Create (optional): `assets/images/module-01/lec06/radial-velocity-cartoon.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Binary: show two masses orbiting a barycenter; label “barycenter” and relative orbit sizes.
2. Optional RV: spectrum lines shifting left/right; label blueshift/redshift.
3. Validate + register IDs:
   - `binary-orbit-barycenter`
   - (optional) `radial-velocity-cartoon`

---

## Task 14: Weight vs apparent weight (free-body diagram set)

**Figure intent:** Fix the “weightlessness = no gravity” misconception.

**Files:**
- Create: `assets/images/module-01/lec06/apparent-weight-freebody-panels.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. 3–4 panels:
   - Standing on floor: `N` up, `mg` down (no acceleration).
   - Elevator accelerating up: `N > mg`.
   - Elevator accelerating down: `N < mg`.
   - Orbit/free-fall: `N ≈ 0` but `mg` still acts (gravity provides centripetal acceleration).
2. Use consistent arrow colors and label conventions.
3. Validate + register ID: `apparent-weight-freebody-panels`

---

## Task 15: Orbit vs escape trajectories (optional)

**Figure intent:** Build intuition for bound vs unbound motion.

**Files:**
- Create: `assets/images/module-01/lec06/orbit-energy-trajectories.svg`
- Modify: `assets/figures.yml`

**Steps:**
1. Central mass at focus; from same starting point show:
   - circular/elliptical bound path
   - parabolic escape (boundary)
   - hyperbolic escape (unbound)
2. Keep labels conceptual (avoid unnecessary equation load).
3. Validate + register ID: `orbit-energy-trajectories`

---

# Integration Tasks

## Task 16: Register all figures in `assets/figures.yml`

**Files:**
- Modify: `assets/figures.yml`

**Steps:**
1. Add every new SVG with `path`, `caption`, `alt`, `credit`, `module: 1`.
2. Validate YAML:
   - Run: `ruby -ryaml -e 'YAML.load_file(\"assets/figures.yml\"); puts \"YAML ok\"'`
   - Expected: `YAML ok`

---

## Task 17: Wire figure IDs into L5 and L6 materials

**Files:**
- Modify: `modules/module-01/readings/OUTLINE-WEEK3-L5.md`
- Modify: `modules/module-01/readings/OUTLINE-WEEK3-L6.md`
- Modify (as readings are written): `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd` and `modules/module-01/readings/lecture-06-[TBD].qmd`

**Steps:**
1. Add `{{< fig ... >}}` placeholders where appropriate.
2. Update each outline’s “Figure Checklist” with the new IDs.

---

## Task 18: Final verification checklist (definition of done)

**Commands:**
- XML parse all SVGs:
  ```bash
  python3 - <<'PY'
  import glob
  import xml.etree.ElementTree as ET

  paths = glob.glob('assets/images/module-01/lec05/*.svg') + glob.glob('assets/images/module-01/lec06/*.svg')
  for p in paths:
    ET.parse(p)
  print('SVG XML ok:', len(paths))
  PY
  ```
- YAML parse:
  ```bash
  ruby -ryaml -e 'YAML.load_file("assets/figures.yml"); puts "YAML ok"'
  ```

**Manual checks (quick):**
- Open each SVG in a browser at 50% zoom and confirm:
  - labels not clipped
  - contrast acceptable
  - arrows/areas unambiguous
  - any “equal areas” constructions are documented (script params noted in the SVG or in a short note near the figure)

**Done means:**
- All target figures exist as SVGs, parse cleanly, are registered in `assets/figures.yml`, and are referenced (or placeholder-referenced) in L5/L6 outlines/readings.

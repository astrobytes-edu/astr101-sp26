# Cosmic Playground (4 core demos) Production-Ready Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make the 4 core Cosmic Playground geometry demos (**Seasons**, **Angular Size**, **Moon Phases**, **Eclipse Geometry**) production-ready and versatile for ASTR 101/201: correct modeling knobs, explicit assumptions/units, consistent UX controls, accessibility baselines, and verification gates.

**Architecture:** Keep “physics” as **pure functions** in `demos/_assets/*-model.js` (testable in Node via `node:test`). Keep demo behavior/UI in `demos/<demo>/*.js` + `demos/<demo>/index.html`. Prefer adding/expanding **model functions + unit tests** over embedding math directly in UI code. For UI-only requirements (labels, thinko guards), use lightweight **HTML smoke tests** that read the `index.html` files and assert required copy/structure.

**Tech Stack:** Vanilla JS + SVG; Node built-in tests (`node --test`); Python demo checks in conda env `astro`; Quarto render (`conda run -n astro make render`).

---

## Should we add P2 / P3?

**Recommendation:**
- **Yes to P2**, but only the P2 items that reduce student friction and accessibility risk (reduced motion + keyboardability + station-mode scaffolds). These are “production quality” even if not strictly “new physics.”
- **Defer P3** to after 1–2 classroom pilots. P3 items are higher risk (more moving parts, more chance of subtle bugs/confusion) and should be guided by observed student misconceptions and your Friday lab pacing.

This plan implements **P0 + selected P1 + selected P2**. It records **P3** as explicit follow-on work.

---

## Quality gates (must be green before any “done” claim)

Run (from repo root):

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.

---

## Task 0 (Optional but recommended): Create an isolated worktree for execution

**Files:** none (worktree only)

**Step 1: Create worktree**

```bash
git worktree add ../astr101-sp26-cosmic-playground-hardening main
```

**Step 2: Enter worktree**

```bash
cd ../astr101-sp26-cosmic-playground-hardening
```

**Step 3: Verify baseline gates**

Run the commands in “Quality gates”.

---

## Task 1: Add HTML smoke tests for “must not regress” UI copy/structure

**Files:**
- Create: `tests/demo-html-smoke.test.js`

**Step 1: Write the failing tests**

Create a test file that asserts:
- Seasons contains a “not to scale” disclaimer.
- Angular Size contains an “internal units = km” note.
- Moon Phases loads `../_assets/moon-phases-model.js`.

Sketch:
```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('Seasons has an explicit not-to-scale disclaimer', () => {
  const html = read('demos/seasons/index.html');
  assert.match(html, /not to scale/i);
});

test('Angular Size notes internal units are km', () => {
  const html = read('demos/angular-size/index.html');
  assert.match(html, /internal units\\s*=\\s*km/i);
});

test('Moon Phases loads the shared MoonPhasesModel', () => {
  const html = read('demos/moon-phases/index.html');
  assert.match(html, /_assets\\/moon-phases-model\\.js/);
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
node --test tests/demo-html-smoke.test.js
```

Expected: FAIL (the required strings/script tag are not yet present).

**Step 3: Commit the failing test (optional but recommended for true TDD)**

```bash
git add tests/demo-html-smoke.test.js
git commit -m "test(demos): add html smoke tests for key UX disclaimers"
```

---

## Task 2 (P0): Seasons — add explicit “not to scale” label (orbit exaggeration)

**Files:**
- Modify: `demos/seasons/index.html`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Implement minimal UI copy**

Add visible copy near the orbital view and/or in the existing model note that includes the phrase **“Not to scale”** (exact casing not required) and clearly states that the orbit eccentricity is exaggerated for visibility.

**Step 2: Run smoke test**

Run:
```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS for the Seasons disclaimer test.

**Step 3: Defer full quality gates**

Note: `tests/demo-html-smoke.test.js` is designed to fail until we complete **Tasks 5 and 7**. We will run the full “Quality gates” suite after Task 7 (when smoke tests are green) and again at the end.

**Step 4: Commit**

```bash
git add demos/seasons/index.html
git commit -m "docs(demos): seasons add not-to-scale disclaimer"
```

---

## Task 3 (P0): Seasons — make year-length usage consistent (model-first refactor)

**Files:**
- Modify: `demos/_assets/seasons-model.js`
- Modify: `tests/seasons-model.test.js`
- Modify: `demos/seasons/seasons.js`

**Step 1: Write failing unit tests for new model exports**

Add tests that require new helpers (names are suggestions; choose final names and keep them stable):
- `earthSunDistanceAu({ dayOfYear, yearDays })` returns ~`1±0.017`
- `orbitAngleRadFromDay({ dayOfYear, yearDays, perihelionDay })` is periodic and returns a finite number

Sketch:
```js
test('earthSunDistanceAu stays within 1±e (toy model)', () => {
  assert.ok(typeof SeasonsModel.earthSunDistanceAu === 'function');
  const r1 = SeasonsModel.earthSunDistanceAu({ dayOfYear: 3 });
  const r2 = SeasonsModel.earthSunDistanceAu({ dayOfYear: 3 + 365.2422/2 });
  assert.ok(r1 < 1);
  assert.ok(r2 > 1);
  assert.ok(r1 > 0.97 && r1 < 1.01);
  assert.ok(r2 > 0.99 && r2 < 1.03);
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
node --test tests/seasons-model.test.js
```

Expected: FAIL (new exports missing).

**Step 3: Implement minimal model functions**

In `demos/_assets/seasons-model.js`:
- Add constants/defaults for:
  - `tropicalYearDays = 365.2422`
  - `eccentricity = 0.0167` (VERIFY value if you want to change from existing `0.017`)
  - `perihelionDay = 3` (keep consistent with existing demo behavior)
- Add:
  - `earthSunDistanceAu({ dayOfYear, yearDays, eccentricity, perihelionDay })`
  - `orbitAngleRadFromDay({ dayOfYear, yearDays, perihelionDay })`
- Export them alongside the existing declination/day-length functions.

**Step 4: Rewire `demos/seasons/seasons.js` to use the model**

Replace the local implementations:
- `getEarthSunDistance(...)` → `Model.earthSunDistanceAu(...)`
- `getOrbitAngleFromDay(...)` → `Model.orbitAngleRadFromDay(...)`
- Replace the hard-coded `YEAR_DAYS = 365` with a single `YEAR_DAYS` constant equal to the model’s year (or explicitly pass `yearDays` everywhere).

**Step 5: Run unit tests**

Run:
```bash
node --test
```

Expected: PASS.

**Step 6: Defer full quality gates**

Run `node --test` after Task 7 (once smoke tests are green). Until then, verify this task via `node --test tests/seasons-model.test.js`.

**Step 7: Commit**

```bash
git add demos/_assets/seasons-model.js tests/seasons-model.test.js demos/seasons/seasons.js
git commit -m "refactor(demos): seasons use model utilities for year + distance"
```

---

## Task 4 (Selected P2): Seasons — reduced-motion friendly “step mode” for animations

**Files:**
- Modify: `demos/seasons/seasons.js`
- (Optional) Modify: `demos/seasons/index.html`

**Step 1: Decide the behavior**

Target behavior:
- If `prefers-reduced-motion: reduce`, the demo should **not auto-animate** large sweeps; instead it should step in chunks (or require explicit clicks).

**Step 2: Implement minimal reduced-motion detection**

In `seasons.js`, add a helper:
- `const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;`

Then:
- Default animation speed lower or default to stepping when reduced motion is enabled.

**Step 3: Manual verification**

Browser devtools → emulate reduced motion → confirm the demo doesn’t run long continuous animations.

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js demos/seasons/index.html
git commit -m "feat(demos): seasons reduced-motion friendly animation behavior"
```

---

## Task 5 (P0): Moon Phases — use shared model + ensure it is loaded

**Files:**
- Modify: `demos/moon-phases/index.html`
- Modify: `demos/moon-phases/moon-phases.js`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Make the smoke test pass**

Add `<script src="../_assets/moon-phases-model.js"></script>` before `moon-phases.js`.

**Step 2: Rewire the illumination computation**

Replace the local `getIllumination(angle)` math with:
- `Model.illuminationFractionFromMoonAngleDeg(angle)`

If `window.MoonPhasesModel` is missing, fail loudly with a clear console error.

**Step 3: Run tests**

Run:
```bash
node --test
```

Expected: PASS.

**Step 4: Defer full quality gates**

Run `node --test` after Task 7 (once smoke tests are green). Until then, verify this task via `node --test tests/demo-html-smoke.test.js` and (if needed) `node --test tests/moon-phases-model.test.js`.

**Step 5: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "refactor(demos): moon phases uses shared MoonPhasesModel"
```

---

## Task 6 (Selected P2): Moon Phases — reduced-motion friendly animation defaults

**Files:**
- Modify: `demos/moon-phases/moon-phases.js`

**Step 1: Implement reduced-motion detection + behavior**

Same approach as Seasons:
- When reduced motion is enabled, default `animationSpeed` lower and/or switch to “step” behavior.

**Step 2: Manual verification**

Emulate reduced motion in browser and confirm behavior.

**Step 3: Commit**

```bash
git add demos/moon-phases/moon-phases.js
git commit -m "feat(demos): moon phases reduced-motion friendly defaults"
```

---

## Task 7 (P0): Angular Size — add explicit “internal units = km” label (avoid unit confusion)

**Files:**
- Modify: `demos/angular-size/index.html`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Update UI copy**

Add visible copy near the sliders/control panel that includes the exact phrase:
- `Internal units = km`

This is intentionally blunt to prevent silent unit errors when students reason from slider values.

**Step 2: Run smoke tests**

Run:
```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS for the Angular Size disclaimer test.

**Step 3: Defer full quality gates**

Run `node --test` after Task 7 (once smoke tests are green). Until then, verify this task via `node --test tests/demo-html-smoke.test.js`.

**Step 4: Commit**

```bash
git add demos/angular-size/index.html
git commit -m "docs(demos): angular size clarify internal units are km"
```

---

## Task 8 (Selected P1): Angular Size — explicit “total vs annular” connection (Moon vs Sun angular-size comparison)

**Files:**
- Modify: `demos/_assets/angular-size-model.js`
- Modify: `tests/angular-size-model.test.js`
- Modify: `demos/angular-size/angular-size.js`
- (Optional) Modify: `demos/angular-size/index.html`

**Step 1: Write failing unit tests for an inverse helper**

Add an inverse helper:
- `distanceForAngularDiameterDeg({ diameterKm, angularDiameterDeg })`

Test sketch:
```js
test('distanceForAngularDiameterDeg inverts angularDiameterDeg (approx)', () => {
  assert.ok(typeof AngularSizeModel.distanceForAngularDiameterDeg === 'function');
  const diameterKm = 3474;
  const distKm = AngularSizeModel.distanceForAngularDiameterDeg({ diameterKm, angularDiameterDeg: 0.53 });
  const back = AngularSizeModel.angularDiameterDeg({ diameterKm, distanceKm: distKm });
  assert.ok(Math.abs(back - 0.53) < 1e-3);
});
```

**Step 2: Implement the helper in the model**

Use the exact inverse of `2*atan(d/2D)`:
- `D = d / (2 * tan(theta/2))`

**Step 3: Add a “Moon vs Sun” comparator in the demo**

When `activePreset === 'moon'`:
- Compute Sun angular size using Sun preset (at 1 AU).
- Compute Moon angular size at the current Moon distance (orbit or recession mode).
- Add a readout:
  - “Moon vs Sun: Moon larger → total possible; Moon smaller → annular possible.”

**Step 4: Run tests + gates**

Run:
```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/_assets/angular-size-model.js tests/angular-size-model.test.js demos/angular-size/angular-size.js demos/angular-size/index.html
git commit -m "feat(demos): angular size add Moon vs Sun total/annular connection"
```

---

## Task 9 (P0): Eclipse Geometry — variable Earth–Moon distance + total vs annular classification

**Files:**
- Modify: `demos/_assets/eclipse-geometry-model.js`
- Modify: `tests/eclipse-geometry-model.test.js`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/eclipse-geometry/index.html`
- (Optional) Modify: `demos/eclipse-geometry/README.md`

**Step 1: Write failing unit tests for solar eclipse classification**

Add a new model export (suggested):
- `solarEclipseTypeFromBetaDeg({ betaDeg, earthMoonDistanceKm, earthRadiusKm, moonRadiusKm, sunRadiusKm, auKm })`

Target types:
- `none`
- `partial-solar`
- `annular-solar`
- `total-solar`

Test strategy (do not hardcode real-world perigee/apogee values):
- Compute the Moon’s umbra radius at Earth and test sign behavior:
  - If `umbraRadiusKmAtEarth > 0` and `beta≈0` → `total-solar`
  - If `umbraRadiusKmAtEarth < 0` and `beta≈0` → `annular-solar`

Sketch:
```js
test('solarEclipseTypeFromBetaDeg: beta≈0 distinguishes total vs annular by umbra sign', () => {
  assert.ok(typeof M.solarEclipseTypeFromBetaDeg === 'function');

  // Pick distances around the umbral apex distance so we force sign changes.
  const moonRadiusKm = 1737.4;
  const sunRadiusKm = 696000;
  const auKm = 149597870.7;
  const dCrit = (moonRadiusKm * auKm) / (sunRadiusKm - moonRadiusKm);

  const totalish = M.solarEclipseTypeFromBetaDeg({ betaDeg: 0, earthMoonDistanceKm: 0.9 * dCrit });
  const annularish = M.solarEclipseTypeFromBetaDeg({ betaDeg: 0, earthMoonDistanceKm: 1.1 * dCrit });

  assert.equal(totalish.type, 'total-solar');
  assert.equal(annularish.type, 'annular-solar');
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
node --test tests/eclipse-geometry-model.test.js
```

Expected: FAIL (new export. missing).

**Step 3: Implement the model export**

In `eclipse-geometry-model.js`:
- Add a solar classifier that:
  - Uses `shadowRadiiKmAtDistance(...)` for Moon’s shadow at Earth.
  - Computes eclipse thresholds using Earth radius + penumbra/umbra sizes.
  - Returns:
    - `total-solar` when central AND `umbraRadiusKmAtEarth > 0`
    - `annular-solar` when central AND `umbraRadiusKmAtEarth <= 0`
    - `partial-solar` when inside penumbral threshold but not central
    - `none` otherwise

**Step 4: Update the demo to use a variable Earth–Moon distance**

In `eclipse-geometry.js`:
- Replace `EARTH_MOON_DISTANCE_KM` constant with `state.earthMoonDistanceKm`.
- Recompute `ECLIPSE_THRESHOLDS` whenever distance changes.
- Use the new `Model.solarEclipseTypeFromBetaDeg(...)` for New Moon classification.
- Continue to use `Model.lunarEclipseTypeFromBetaDeg(...)` for Full Moon classification (already distance-aware).

**Step 5: Add a student-friendly UI control**

In `demos/eclipse-geometry/index.html`:
- Add a “Moon distance” control with 3 radio presets:
  - Perigee / Mean / Apogee (values can be derived from the Angular Size demo’s Moon angular range, or use a clearly-labeled typical range with `VERIFY` if hardcoding).
- Show the current Earth–Moon distance in km in the status panel.

**Step 6: Run tests + quality gates**

Run:
```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: PASS.

**Step 7: Commit**

```bash
git add demos/_assets/eclipse-geometry-model.js tests/eclipse-geometry-model.test.js demos/eclipse-geometry/eclipse-geometry.js demos/eclipse-geometry/index.html demos/eclipse-geometry/README.md
git commit -m "feat(demos): eclipse geometry add moon-distance control + total/annular classification"
```

---

## Task 10 (Selected P2): Eclipse Geometry — persist speed + surface speed state clearly

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/eclipse-geometry/index.html`

**Step 1: Implement persistence**

Use `localStorage` to persist:
- sim speed (`sim-speed-select`)
- sim years slider value (`sim-years-slider`)

Behavior target:
- Reloading the page preserves the settings.
- If storage is unavailable, demo still works (no crash).

**Step 2: Surface speed state**

Add a small readout near the simulation controls:
- “Speed: Slow/Normal/Fast/Instant”

**Step 3: Manual verification**

Open the demo, change speed + years, reload the page, confirm settings persist.

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js demos/eclipse-geometry/index.html
git commit -m "feat(demos): eclipse geometry persist simulation settings"
```

---

## Task 11: Update instructor docs to match the new modeling (keep the “truth” centralized)

**Files:**
- Modify: `demos/_instructor/seasons/model.qmd`
- Modify: `demos/_instructor/angular-size/model.qmd`
- Modify: `demos/_instructor/moon-phases/model.qmd`
- Modify: `demos/_instructor/eclipse-geometry/model.qmd`
- (Optional) Modify: `demos/_instructor/*/backlog.qmd` (mark completed items)

**Step 1: Update model writeups**

Ensure each `model.qmd` explicitly states:
- What is physically modeled vs exaggerated/schematic
- Units used internally
- Any thresholds and how they’re computed (with references to model functions)

**Step 2: Render**

Run:
```bash
conda run -n astro make render
```

Expected: PASS, and `_site/demos/_instructor/...` includes updated pages.

**Step 3: Commit**

```bash
git add demos/_instructor
git commit -m "docs(demos): update instructor model notes for production changes"
```

---

## Task 12: Final verification + push

**Step 1: Run quality gates**

Run the commands in “Quality gates”.

**Step 2: Push**

```bash
git push origin main
```

---

## P3 (defer until after classroom pilots)

Only do these after you’ve observed student misconceptions with the current suite:

- Seasons: Kepler-solver distance model (mean anomaly → eccentric anomaly → true anomaly) and/or explicit “calendar day vs solar longitude” toggle.
- Moon Phases: add rise/set time overlay; add optional 3D inclination handoff to eclipses.
- Angular Size: geology-informed Moon recession (nonlinear; data-driven) vs toy model toggle.
- Eclipse Geometry: include Earth–Sun distance variation (perihelion/aphelion) as a second-order effect; add “shadow cones overlay” with scale disclaimer; add station-mode export tooling.

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-01-28-cosmic-playground-demos-production-ready.md`.

Two execution options:
1. **This session:** use `superpowers:subagent-driven-development` and implement task-by-task with checkpoints.
2. **Separate session:** open a new session in a worktree and use `superpowers:executing-plans`.

Which approach do you want?

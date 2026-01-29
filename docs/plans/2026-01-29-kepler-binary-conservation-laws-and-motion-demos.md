# Kepler + Binary + Conservation Laws (Motion) Demos Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finalize the Kepler’s Laws and Binary Orbits demos so they explicitly teach **conservation of energy and angular momentum**, and add a first standalone **mechanics/motion** demo that connects orbit shapes to conservation laws (no numerical integrators yet).

**Architecture:** Keep physics in pure, unit-tested model modules; keep UI code in per-demo controllers. Centralize constants/units in `AstroConstants` (single source of truth) so every demo uses consistent AU/year/M☉ conversions and time-scale definitions.

**Tech Stack:** Vanilla JS (UMD-style browser globals), Node’s built-in test runner (`node --test`), Quarto site resources for hosting.

---

## Invariants (do not break)

**Physics**
- Two-body (Keplerian) motion is analytic and deterministic.
- Conservation (Newtonian, two-body): specific energy `ε` and specific angular momentum `h` are constant for a given orbit.
- Kepler 3: `P² (yr²) = a³ (AU³) / M_tot (M☉)` under the solar-unit normalization.

**Units**
- AU and year conversions come from one place (`AstroConstants`).
- “Year” for mechanics defaults to **Julian year**: `JULIAN_YEAR_S = 31557600` (exact).
- Field names carry units at boundaries (`aAu`, `tYr`, `vKms`, `muCgs`, etc.).

**Software**
- Models: no DOM, no global demo state, deterministic, testable in Node.
- UI controllers: may read/write DOM; must fail fast if required globals are missing.

---

## Prerequisite: AstroConstants + shared physics library

This plan assumes we implement (or already implemented) the shared physics library per:
- `docs/plans/2026-01-29-astroconstants-physics-library-implementation.md`

If it is not implemented yet, execute Tasks 1–7 from that plan first.

---

## Task 1: Add “invariants” helpers to TwoBodyAnalytic

**Files:**
- Modify: `demos/_assets/physics/two-body-analytic.js`
- Test: `tests/two-body-analytic.test.js`

**Step 1: Write failing tests**

Add tests for:
- `specificEnergyFromState(...)` matches `-mu/(2a)` (ellipse)
- `specificAngularMomentumFromState(...)` matches `sqrt(mu a (1-e²))`

Example test sketch:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const AstroConstants = require('../demos/_assets/physics/astro-constants.js');

test('specific energy matches -mu/(2a) for ellipse (AU/yr units wrapper)', () => {
  const aAu = 2;
  const ecc = 0.3;
  const mTotSolar = 1;
  const mu = TwoBody.muFromTotalMassSolarAuYr({ mTotSolar });
  const thetaRad = 1.0;
  const { rAu, vRelAuYr } = TwoBody.orbitStateAuYr({ aAu, ecc, muAu3Yr2: mu, thetaRad });
  const eps = TwoBody.specificEnergyAu2Yr2({ rAu, vRelAuYr, muAu3Yr2: mu });
  const expected = -mu / (2 * aAu);
  assert.ok(Math.abs(eps - expected) < 1e-10);
});
```

**Step 2: Run tests to confirm failure**

Run: `node --test tests/two-body-analytic.test.js`  
Expected: FAIL (missing exports).

**Step 3: Implement minimal functions**

Implement the wrappers in `TwoBodyAnalytic`:
- `muFromTotalMassSolarAuYr({ mTotSolar })`
- `orbitStateAuYr({ aAu, ecc, muAu3Yr2, thetaRad })` (returns `rAu`, `vRelAuYr`)
- `specificEnergyAu2Yr2({ rAu, vRelAuYr, muAu3Yr2 })`
- `specificAngularMomentumAu2Yr({ aAu, ecc, muAu3Yr2 })`

**Step 4: Re-run tests**

Run: `node --test tests/two-body-analytic.test.js`  
Expected: PASS.

**Step 5: Commit**

```bash
git add demos/_assets/physics/two-body-analytic.js tests/two-body-analytic.test.js
git commit -m "feat(physics): add two-body invariants helpers"
```

---

## Task 2: Kepler’s Laws demo — add conservation readouts (ε, h, areal velocity)

**Files:**
- Modify: `demos/keplers-laws/index.html`
- Modify: `demos/keplers-laws/keplers-laws.js`
- Modify: `demos/_assets/keplers-laws-model.js` (only if the controller needs a new pure helper)
- Test: `tests/demo-html-smoke.test.js` (if new ids are required)

**Step 1: Add UI placeholders (failing smoke expectation if needed)**

In `demos/keplers-laws/index.html`, add a collapsible panel (preferred) under the existing readouts:
- `energy-value` + unit label
- `angmom-value` + unit label
- `areal-value` + unit label

**Step 2: (Optional) Add a small smoke test**

If we add new required DOM IDs, extend `tests/demo-html-smoke.test.js` with:

```js
test('Kepler’s Laws includes conservation readouts', () => {
  const html = fs.readFileSync('demos/keplers-laws/index.html', 'utf8');
  assert.ok(html.includes('id=\"energy-value\"'));
  assert.ok(html.includes('id=\"angmom-value\"'));
});
```

Run: `node --test tests/demo-html-smoke.test.js`  
Expected: FAIL until UI is updated.

**Step 3: Wire readouts in controller**

In `demos/keplers-laws/keplers-laws.js`:
- Compute `muAu3Yr2` from `M` (use shared helpers; avoid SI constants).
- Compute relative speed `vRelAuYr` from vis-viva.
- Compute:
  - `ε` (specific energy) in `AU²/yr²`
  - `h` (specific angular momentum) in `AU²/yr`
  - `dA/dt = h/2` (areal velocity) in `AU²/yr`
- Populate the new DOM readouts.

**Step 4: Run demo model tests + smoke**

Run: `node --test`  
Expected: PASS.

**Step 5: Commit**

```bash
git add demos/keplers-laws/index.html demos/keplers-laws/keplers-laws.js tests/demo-html-smoke.test.js
git commit -m "feat(keplers-laws): add conservation-law readouts"
```

---

## Task 3: Binary Orbits demo — add conservation readouts (relative ε, h; optional totals)

**Files:**
- Modify: `demos/binary-orbits/index.html`
- Modify: `demos/binary-orbits/binary-orbits.js`
- Modify: `demos/_assets/binary-orbits-model.js` (pure helpers)
- Test: `tests/binary-orbits-physics.test.js` (extend with invariant checks)

**Step 1: Add UI placeholders**

Add a collapsible “Conservation laws” panel under the existing readout grid:
- relative specific energy `ε` (for the relative orbit)
- specific angular momentum `h`
- optional: total orbital energy `E = μ_red ε` (clearly labeled; advanced)

**Step 2: Write failing invariant tests**

In `tests/binary-orbits-physics.test.js`, add a small section that asserts:

- For fixed `(a,e,M1,M2)`, `ε` computed from state equals `-mu/(2a)`.
- `h` matches `sqrt(mu a (1-e²))`.

(Use a generous tolerance like `1e-10` in AU/yr units; the model is analytic.)

**Step 3: Implement model helpers**

In `demos/_assets/binary-orbits-model.js`, add pure functions:
- `muAu3Yr2({ M1, M2 })`
- `specificEnergyAu2Yr2({ rAu, vRelAuYr, muAu3Yr2 })`
- `specificAngularMomentumAu2Yr({ aAu, e, muAu3Yr2 })`

and (optionally) `reducedMassSolar({ M1, M2 })`, `totalOrbitalEnergyAu2Yr2SolarMass(...)`.

**Step 4: Wire controller readouts**

In `demos/binary-orbits/binary-orbits.js`, compute:
- `rAu` (relative separation)
- `vRelAuYr` (relative speed in AU/yr, derived from existing `orbitalVelocityKms` or directly from vis-viva)
- then compute `ε` and `h` using model helpers.

**Step 5: Run tests**

Run: `node --test`  
Expected: PASS.

**Step 6: Commit**

```bash
git add demos/_assets/binary-orbits-model.js demos/binary-orbits/index.html demos/binary-orbits/binary-orbits.js tests/binary-orbits-physics.test.js
git commit -m "feat(binary-orbits): add conservation-law readouts"
```

---

## Task 4: New demo — “Conservation Laws: Orbit Shapes” (analytic; no integrator)

**Idea:** Students choose an initial condition (radius + speed + direction) and the demo shows the orbit type (circle/ellipse/parabola/hyperbola) and invariants. This teaches that **orbit shape is determined by energy + angular momentum**.

**Files:**
- Create: `demos/conservation-laws/index.html`
- Create: `demos/conservation-laws/conservation-laws.js`
- Create: `demos/conservation-laws/conservation-laws.css`
- Create: `demos/_assets/conservation-laws-model.js`
- Test: `tests/conservation-laws-model.test.js`
- Create: `demos/_instructor/conservation-laws/index.qmd`
- Create: `demos/_instructor/conservation-laws/model.qmd`
- Create: `demos/_instructor/conservation-laws/activities.qmd`
- Create: `demos/_instructor/conservation-laws/assessment.qmd`
- Create: `demos/_instructor/conservation-laws/backlog.qmd`

**Step 1: Write failing model tests**

In `tests/conservation-laws-model.test.js`, cover:
- circular-orbit preset yields `e≈0`, `ε<0`
- escape-speed preset yields `ε≈0`
- high-speed preset yields `ε>0` and `e>1`

**Step 2: Implement `conservation-laws-model.js`**

Provide pure helpers:
- `circularSpeedAuYr({ muAu3Yr2, rAu })`
- `escapeSpeedAuYr({ muAu3Yr2, rAu })`
- `orbitElementsFromStateAuYr({ rVecAu, vVecAuYr, muAu3Yr2 })`
  - returns `epsAu2Yr2`, `hAu2Yr`, `ecc`, `aAu` (signed), `orbitType`

**Step 3: Build the UI demo**

Keep UI minimal but production-ready:
- mass preset (M☉), initial radius (AU), speed factor vs circular, direction slider (tangential ↔ radial)
- orbit plot in 2D (SVG)
- readouts: `ε`, `h`, `e`, and orbit type label
- model note disclosure (`toy` vs `analytic` clearly)

**Step 4: Add instructor docs**

Follow the same structure as existing demos under `demos/_instructor/*`:
- MW quick + MW short + Friday lab
- assessment bank (clickers + short response)
- backlog table with P1/P2/P3

**Step 5: Optional navigation**

If desired, add the demo link to:
- `demos/index.qmd`
- `_quarto.yml` sidebar “Demos”

Keep it out of the main sidebar until it is polished and tested.

**Step 6: Commit**

```bash
git add demos/conservation-laws demos/_assets/conservation-laws-model.js tests/conservation-laws-model.test.js demos/_instructor/conservation-laws
git commit -m "feat: add conservation-laws orbit-shapes demo + instructor docs"
```

---

## Task 5: Verification gates (do not skip)

Run the full suite before claiming “done”:

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.


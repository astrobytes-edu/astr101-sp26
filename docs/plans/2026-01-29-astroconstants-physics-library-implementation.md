# AstroConstants + Shared Physics Library Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Create a shared, testable physics library for `demos/` with a single source of truth for **CGS-canonical** units/time scales (`AstroConstants`) plus first-class AU/yr/M☉ convenience wrappers, then migrate the mechanics demos (Kepler’s Laws + Binary Orbits) to use it without behavior regressions.

**Architecture:** Add UMD modules under `demos/_assets/physics/`:
- `astro-constants.js` exports `window.AstroConstants` (and `module.exports`) as the canonical conversions + explicit time scales.
- `units.js` provides conversion helpers built only on `AstroConstants`.
- `two-body-analytic.js` provides pure analytic two-body relations (dimensionless geometry + CGS core + AU/yr/M☉ wrappers).
Then update `demos/_assets/keplers-laws-model.js` and `demos/_assets/binary-orbits-model.js` to **delegate** to these shared modules (no duplicated constants), and update demo HTML to load the shared modules before the demo’s model module.

**Tech Stack:** Vanilla JS (UMD), Node built-in tests (`node --test`), existing demo polish checks (`conda run -n astro python scripts/*`), Quarto render (`conda run -n astro make render`).

---

## Required references (read before coding)

- Spec: `docs/specs/demos-physics-library-spec.md`
- Contract/invariants: `docs/contracts/demos-physics-library-contract.md`
- Design notes: `docs/plans/2026-01-29-demos-physics-library-design.md`

---

## Quality gates (must be green before claiming “done”)

Run from repo root:

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.

---

## Task 0 (Recommended): Worktree + baseline verification

> If you intentionally want to stay on `main`, skip the worktree commands but still run the baseline gates.

**Step 1: Create a worktree**

```bash
git worktree add ../astr101-sp26-physics-lib main
cd ../astr101-sp26-physics-lib
```

**Step 2: Run baseline gates**

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: PASS.

---

## Task 1: Add `AstroConstants` (UMD) with explicit time scales + core conversions (TDD)

**Files:**
- Create: `demos/_assets/physics/astro-constants.js`
- Create: `tests/astro-constants.test.js`

**Step 1: Create the failing test**

Create `tests/astro-constants.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const AstroConstants = require('../demos/_assets/physics/astro-constants.js');

test('AstroConstants exposes TIME/LENGTH/GRAV groups', () => {
  assert.ok(AstroConstants);
  assert.ok(AstroConstants.TIME);
  assert.ok(AstroConstants.LENGTH);
  assert.ok(AstroConstants.GRAV);
});

test('AstroConstants: exact day + Julian year seconds', () => {
  assert.equal(AstroConstants.TIME.DAY_S, 86400);
  assert.equal(AstroConstants.TIME.JULIAN_YEAR_S, 31557600);
  assert.equal(AstroConstants.TIME.YEAR_S, AstroConstants.TIME.JULIAN_YEAR_S);
});

test('AstroConstants: lunar + seasonal time scales are explicit (from existing demos)', () => {
  // From demos/_assets/seasons-model.js
  assert.equal(AstroConstants.TIME.MEAN_TROPICAL_YEAR_DAYS, 365.2422);

  // From demos/eclipse-geometry/eclipse-geometry.js (already in-repo)
  assert.equal(AstroConstants.TIME.MEAN_SIDEREAL_MONTH_DAYS, 27.321661);
  assert.equal(AstroConstants.TIME.MEAN_SYNODIC_MONTH_DAYS, 29.530588);

  // Derived (must be finite and physically sensible).
  assert.ok(Number.isFinite(AstroConstants.TIME.MEAN_DRACONIC_MONTH_DAYS));
  assert.ok(AstroConstants.TIME.MEAN_DRACONIC_MONTH_DAYS < AstroConstants.TIME.MEAN_SIDEREAL_MONTH_DAYS);
});

test('AstroConstants: AU conversions are consistent', () => {
  // Use the AU value already in demos/_assets/eclipse-geometry-model.js default.
  assert.equal(AstroConstants.LENGTH.KM_PER_AU, 149597870.7);
  assert.equal(AstroConstants.LENGTH.M_PER_AU, 149597870700);
  assert.equal(AstroConstants.LENGTH.CM_PER_AU, 14959787070000);
});
```

**Step 2: Run the test to confirm it fails**

```bash
node --test tests/astro-constants.test.js
```

Expected: FAIL (module missing).

**Step 3: Implement `demos/_assets/physics/astro-constants.js`**

Create `demos/_assets/physics/astro-constants.js`:

```js
/**
 * demos/_assets/physics/astro-constants.js
 *
 * AstroConstants: single source of truth for time scales and unit conversions.
 *
 * Canonical policy:
 * - Time is defined in seconds (s) with explicit named scales.
 * - “Mechanics year” default is Julian year: 31,557,600 s (exact).
 * - Additional lunar/seasonal scales are provided as *mean* values where appropriate.
 *
 * UMD export:
 * - Browser: window.AstroConstants
 * - Node: module.exports
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.AstroConstants = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ============================================
  // Time scales
  // ============================================

  const TIME = {
    // Exact definitions
    DAY_S: 86400,
    JULIAN_YEAR_S: 31557600,

    // Default “mechanics year” used widely by dynamics demos.
    YEAR_S: 31557600,

    // Mean/teaching values (explicitly named)
    // Source (in-repo): demos/_assets/seasons-model.js
    MEAN_TROPICAL_YEAR_DAYS: 365.2422,

    // Source (in-repo): demos/eclipse-geometry/eclipse-geometry.js
    MEAN_SIDEREAL_MONTH_DAYS: 27.321661,
    MEAN_SYNODIC_MONTH_DAYS: 29.530588,

    // Source (in-repo): demos/eclipse-geometry/eclipse-geometry.js (comment notes VERIFY)
    // Interpret “years” here as Julian years for an exact seconds definition.
    MEAN_NODE_REGRESSION_JULIAN_YEARS: 18.61,
  };

  // Derived seconds
  TIME.MEAN_TROPICAL_YEAR_S = TIME.MEAN_TROPICAL_YEAR_DAYS * TIME.DAY_S;
  TIME.MEAN_SIDEREAL_MONTH_S = TIME.MEAN_SIDEREAL_MONTH_DAYS * TIME.DAY_S;
  TIME.MEAN_SYNODIC_MONTH_S = TIME.MEAN_SYNODIC_MONTH_DAYS * TIME.DAY_S;
  TIME.MEAN_NODE_REGRESSION_S = TIME.MEAN_NODE_REGRESSION_JULIAN_YEARS * TIME.JULIAN_YEAR_S;
  TIME.MEAN_NODE_REGRESSION_DAYS = TIME.MEAN_NODE_REGRESSION_S / TIME.DAY_S;

  // Eclipse-relevant: draconic month (node-to-node) derived from sidereal month + nodal regression.
  // If Moon advances +360/P_sid per day and the node regresses −360/P_node per day,
  // the relative rate is (1/P_sid + 1/P_node) cycles/day.
  // So: P_drac = 1 / (1/P_sid + 1/P_node)
  TIME.MEAN_DRACONIC_MONTH_DAYS =
    1 / (1 / TIME.MEAN_SIDEREAL_MONTH_DAYS + 1 / TIME.MEAN_NODE_REGRESSION_DAYS);
  TIME.MEAN_DRACONIC_MONTH_S = TIME.MEAN_DRACONIC_MONTH_DAYS * TIME.DAY_S;

  // ============================================
  // Length conversions (CGS canonical)
  // ============================================

  const LENGTH = {
    CM_PER_M: 100,
    M_PER_KM: 1000,
    CM_PER_KM: 100000,

    // IAU-defined AU value already used elsewhere in this repo (km).
    KM_PER_AU: 149597870.7,
  };

  LENGTH.M_PER_AU = LENGTH.KM_PER_AU * LENGTH.M_PER_KM;
  LENGTH.CM_PER_AU = LENGTH.M_PER_AU * LENGTH.CM_PER_M;

  // ============================================
  // Gravity normalization for teaching wrappers
  // ============================================
  //
  // In AU/yr/M☉ teaching units, it is conventional to take:
  //   G = 4π² AU³ / yr² / M☉
  // so that for a 1 M☉ star: P² = a³ with P in years, a in AU.
  //
  // This is a unit-system normalization used throughout the Kepler/binary demos in this repo.

  const GRAV = {
    G_AU3_YR2_PER_SOLAR_MASS: 4 * Math.PI * Math.PI,
  };

  return { TIME, LENGTH, GRAV };
});
```

**Step 4: Re-run the test**

```bash
node --test tests/astro-constants.test.js
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/_assets/physics/astro-constants.js tests/astro-constants.test.js
git commit -m "feat(physics): add AstroConstants (time scales + conversions)"
```

---

## Task 2: Add shared unit conversion helpers (`units.js`) built on `AstroConstants` (TDD)

**Files:**
- Create: `demos/_assets/physics/units.js`
- Create: `tests/physics-units.test.js`

**Step 1: Create failing tests**

Create `tests/physics-units.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const AstroConstants = require('../demos/_assets/physics/astro-constants.js');
const Units = require('../demos/_assets/physics/units.js');

test('Units converts days ↔ seconds using the exact day', () => {
  assert.equal(Units.daysToSeconds(1), AstroConstants.TIME.DAY_S);
  assert.equal(Units.secondsToDays(AstroConstants.TIME.DAY_S), 1);
});

test('Units converts AU ↔ cm exactly (from AstroConstants)', () => {
  assert.equal(Units.auToCm(1), AstroConstants.LENGTH.CM_PER_AU);
  assert.equal(Units.cmToAu(AstroConstants.LENGTH.CM_PER_AU), 1);
});

test('Units converts AU/yr speed to km/s and is consistent with definitions', () => {
  // 1 AU/yr = AU_km / year_s  km/s
  const expected = AstroConstants.LENGTH.KM_PER_AU / AstroConstants.TIME.YEAR_S;
  assert.ok(Math.abs(Units.auPerYrToKmPerS(1) - expected) < 1e-15);
});

test('Units converts AU^3/yr^2 to cm^3/s^2 (for mu)', () => {
  const one = Units.au3PerYr2ToCm3PerS2(1);
  const expected = Math.pow(AstroConstants.LENGTH.CM_PER_AU, 3) / Math.pow(AstroConstants.TIME.YEAR_S, 2);
  assert.ok(Math.abs(one - expected) / expected < 1e-15);
});
```

**Step 2: Run tests (expect FAIL)**

```bash
node --test tests/physics-units.test.js
```

Expected: FAIL (module missing).

**Step 3: Implement `demos/_assets/physics/units.js`**

Create `demos/_assets/physics/units.js`:

```js
/**
 * demos/_assets/physics/units.js
 *
 * Pure unit conversion helpers built on AstroConstants.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./astro-constants.js'));
  } else {
    root.AstroUnits = factory(root.AstroConstants);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants) {
  'use strict';

  if (!AstroConstants) {
    throw new Error('AstroUnits: missing AstroConstants (load physics/astro-constants.js first)');
  }

  function daysToSeconds(days) {
    return days * AstroConstants.TIME.DAY_S;
  }

  function secondsToDays(seconds) {
    return seconds / AstroConstants.TIME.DAY_S;
  }

  function auToCm(au) {
    return au * AstroConstants.LENGTH.CM_PER_AU;
  }

  function cmToAu(cm) {
    return cm / AstroConstants.LENGTH.CM_PER_AU;
  }

  function auPerYrToKmPerS(vAuPerYr) {
    return (vAuPerYr * AstroConstants.LENGTH.KM_PER_AU) / AstroConstants.TIME.YEAR_S;
  }

  function au3PerYr2ToCm3PerS2(xAu3PerYr2) {
    return (
      xAu3PerYr2 *
      Math.pow(AstroConstants.LENGTH.CM_PER_AU, 3) /
      Math.pow(AstroConstants.TIME.YEAR_S, 2)
    );
  }

  return {
    daysToSeconds,
    secondsToDays,
    auToCm,
    cmToAu,
    auPerYrToKmPerS,
    au3PerYr2ToCm3PerS2,
  };
});
```

**Step 4: Re-run tests (expect PASS)**

```bash
node --test tests/physics-units.test.js
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/_assets/physics/units.js tests/physics-units.test.js
git commit -m "feat(physics): add shared unit conversions (AstroUnits)"
```

---

## Task 3: Add shared analytic two-body mechanics (`two-body-analytic.js`) (TDD)

**Files:**
- Create: `demos/_assets/physics/two-body-analytic.js`
- Create: `tests/two-body-analytic.test.js`

**Step 1: Create failing tests**

Create `tests/two-body-analytic.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const AstroConstants = require('../demos/_assets/physics/astro-constants.js');
const Units = require('../demos/_assets/physics/units.js');
const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');

function wrapPi(rad) {
  const twoPi = 2 * Math.PI;
  let x = ((rad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  if (x <= -Math.PI) x += twoPi;
  return x;
}

test('orbitalRadius(): returns expected perihelion/aphelion values', () => {
  const a = 2;
  const e = 0.25;
  assert.ok(Math.abs(TwoBody.orbitalRadius({ a, e, thetaRad: 0 }) - a * (1 - e)) < 1e-12);
  assert.ok(Math.abs(TwoBody.orbitalRadius({ a, e, thetaRad: Math.PI }) - a * (1 + e)) < 1e-12);
});

test('anomaly conversions invert (moderate e)', () => {
  const e = 0.6;
  for (const deg of [0, 20, 60, 120, 179, 240, 300]) {
    const theta = (deg * Math.PI) / 180;
    const M = TwoBody.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrapPi(theta2 - theta)) < 1e-8);
  }
});

test('teaching-unit wrapper: P_yr = sqrt(a^3/M) (Kepler normalization)', () => {
  assert.ok(Math.abs(TwoBody.orbitalPeriodYrFromAuSolar({ aAu: 1, massSolar: 1 }) - 1) < 1e-12);
  assert.ok(Math.abs(TwoBody.orbitalPeriodYrFromAuSolar({ aAu: 8, massSolar: 1 }) - Math.pow(8, 1.5)) < 1e-12);
  assert.ok(Math.abs(TwoBody.orbitalPeriodYrFromAuSolar({ aAu: 1, massSolar: 4 }) - 0.5) < 1e-12);
});

test('teaching-unit wrapper: circular orbit speed at 1 AU, 1 yr is 2π AU/yr', () => {
  const vAuYr = TwoBody.visVivaSpeedAuPerYrFromAuSolar({ rAu: 1, aAu: 1, massSolar: 1 });
  assert.ok(Math.abs(vAuYr - 2 * Math.PI) < 1e-12);
});

test('mu conversion: mu_solar in AU^3/yr^2 converts to cm^3/s^2', () => {
  const muAu3Yr2 = AstroConstants.GRAV.G_AU3_YR2_PER_SOLAR_MASS * 1; // 1 M_sun
  const muCgs = TwoBody.muCgsFromMuAu3Yr2(muAu3Yr2);
  const expected = Units.au3PerYr2ToCm3PerS2(muAu3Yr2);
  assert.ok(Math.abs(muCgs - expected) / expected < 1e-15);
});
```

**Step 2: Run tests (expect FAIL)**

```bash
node --test tests/two-body-analytic.test.js
```

Expected: FAIL (module missing).

**Step 3: Implement `demos/_assets/physics/two-body-analytic.js`**

Create `demos/_assets/physics/two-body-analytic.js`:

```js
/**
 * demos/_assets/physics/two-body-analytic.js
 *
 * Pure, testable analytic two-body relations.
 * - Dimensionless geometry helpers (r/a vs anomaly).
 * - CGS helpers accept mu in cm^3/s^2 and lengths in cm.
 * - Teaching wrappers in AU/yr/M_sun (via Kepler normalization) are conversion-only.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(
      require('./astro-constants.js'),
      require('./units.js')
    );
  } else {
    root.TwoBodyAnalytic = factory(root.AstroConstants, root.AstroUnits);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants, AstroUnits) {
  'use strict';

  if (!AstroConstants) {
    throw new Error('TwoBodyAnalytic: missing AstroConstants (load physics/astro-constants.js first)');
  }
  if (!AstroUnits) {
    throw new Error('TwoBodyAnalytic: missing AstroUnits (load physics/units.js first)');
  }

  function orbitalRadius({ a, e, thetaRad }) {
    if (!Number.isFinite(a) || a <= 0) return NaN;
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const denom = 1 + e * Math.cos(thetaRad);
    return (a * (1 - e * e)) / denom;
  }

  function trueToEccentricAnomalyRad({ thetaRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const cosT = Math.cos(thetaRad);
    const sinT = Math.sin(thetaRad);
    const denom = 1 + e * cosT;
    const cosE = (e + cosT) / denom;
    const sinE = (Math.sqrt(1 - e * e) * sinT) / denom;
    return Math.atan2(sinE, cosE);
  }

  function trueToMeanAnomalyRad({ thetaRad, e }) {
    const E = trueToEccentricAnomalyRad({ thetaRad, e });
    return E - e * Math.sin(E);
  }

  function meanToTrueAnomalyRad({ meanAnomalyRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;

    // NOTE: we intentionally do NOT normalize mean anomaly here so that callers
    // can create “time windows” without discontinuities (demo use-case).
    const M = meanAnomalyRad;

    // Solve Kepler’s equation: M = E - e sin E using Newton iterations.
    let E = M;
    for (let i = 0; i < 25; i++) {
      const f = E - e * Math.sin(E) - M;
      const fp = 1 - e * Math.cos(E);
      const dE = -f / fp;
      E += dE;
      if (Math.abs(dE) < 1e-12) break;
    }

    const denom = 1 - e * Math.cos(E);
    const cosT = (Math.cos(E) - e) / denom;
    const sinT = (Math.sqrt(1 - e * e) * Math.sin(E)) / denom;
    return Math.atan2(sinT, cosT);
  }

  // ----------------------------
  // CGS core helpers
  // ----------------------------

  function orbitalPeriodSFromSemimajorAxisCmMu({ aCm, muCgs }) {
    if (!Number.isFinite(aCm) || aCm <= 0) return NaN;
    if (!Number.isFinite(muCgs) || muCgs <= 0) return NaN;
    return 2 * Math.PI * Math.sqrt((aCm * aCm * aCm) / muCgs);
  }

  function visVivaSpeedCms({ rCm, aCm, muCgs }) {
    if (!Number.isFinite(rCm) || rCm <= 0) return NaN;
    if (!Number.isFinite(aCm) || aCm <= 0) return NaN;
    if (!Number.isFinite(muCgs) || muCgs <= 0) return NaN;
    const v2 = muCgs * (2 / rCm - 1 / aCm);
    return v2 <= 0 ? 0 : Math.sqrt(v2);
  }

  // ----------------------------
  // Teaching wrappers (AU/yr/M_sun)
  // ----------------------------

  function muAu3Yr2FromSolarMass(massSolar) {
    if (!Number.isFinite(massSolar) || massSolar <= 0) return NaN;
    return AstroConstants.GRAV.G_AU3_YR2_PER_SOLAR_MASS * massSolar;
  }

  function muCgsFromMuAu3Yr2(muAu3Yr2) {
    return AstroUnits.au3PerYr2ToCm3PerS2(muAu3Yr2);
  }

  function orbitalPeriodYrFromAuSolar({ aAu, massSolar }) {
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(massSolar) || massSolar <= 0) return NaN;
    // Under the Kepler normalization: P^2 = a^3 / M
    return Math.sqrt((aAu * aAu * aAu) / massSolar);
  }

  function visVivaSpeedAuPerYrFromAuSolar({ rAu, aAu, massSolar }) {
    if (!Number.isFinite(rAu) || rAu <= 0) return NaN;
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(massSolar) || massSolar <= 0) return NaN;
    const mu = muAu3Yr2FromSolarMass(massSolar);
    const v2 = mu * (2 / rAu - 1 / aAu); // AU^2/yr^2
    return v2 <= 0 ? 0 : Math.sqrt(v2);
  }

  return {
    orbitalRadius,
    trueToMeanAnomalyRad,
    meanToTrueAnomalyRad,
    orbitalPeriodSFromSemimajorAxisCmMu,
    visVivaSpeedCms,
    muAu3Yr2FromSolarMass,
    muCgsFromMuAu3Yr2,
    orbitalPeriodYrFromAuSolar,
    visVivaSpeedAuPerYrFromAuSolar,
  };
});
```

**Step 4: Re-run tests (expect PASS)**

```bash
node --test tests/two-body-analytic.test.js
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/_assets/physics/two-body-analytic.js tests/two-body-analytic.test.js
git commit -m "feat(physics): add analytic two-body utilities"
```

---

## Task 4: Load shared physics modules in Kepler’s Laws demo HTML (no behavior change)

**Files:**
- Modify: `demos/keplers-laws/index.html`
- (Optional) Test: `tests/demo-html-smoke.test.js`

**Step 1: Add a failing HTML smoke test (optional but recommended)**

In `tests/demo-html-smoke.test.js`, add:

```js
test('Kepler’s Laws loads AstroConstants + TwoBodyAnalytic', () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /_assets\\/physics\\/astro-constants\\.js/);
  assert.match(html, /_assets\\/physics\\/units\\.js/);
  assert.match(html, /_assets\\/physics\\/two-body-analytic\\.js/);
});
```

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: FAIL until scripts are added.

**Step 2: Add script tags**

In `demos/keplers-laws/index.html`, insert before `../_assets/keplers-laws-model.js`:

```html
  <script src="../_assets/physics/astro-constants.js"></script>
  <script src="../_assets/physics/units.js"></script>
  <script src="../_assets/physics/two-body-analytic.js"></script>
```

**Step 3: Re-run the smoke test**

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS.

**Step 4: Commit**

```bash
git add demos/keplers-laws/index.html tests/demo-html-smoke.test.js
git commit -m "refactor(keplers-laws): load shared physics modules"
```

---

## Task 5: Refactor `keplers-laws-model.js` to delegate shared math (no API changes)

**Files:**
- Modify: `demos/_assets/keplers-laws-model.js`
- Test: `tests/keplers-laws-model.test.js`

**Step 1: Add a failing test asserting the shared modules exist in browser**

In `tests/demo-html-smoke.test.js` (or a new targeted smoke test), assert that Kepler loads the physics scripts (Task 4) and that `keplers-laws-model.js` is still loaded after them.

**Step 2: Update `keplers-laws-model.js` to use `TwoBodyAnalytic`**

In `demos/_assets/keplers-laws-model.js`:

- At factory init, resolve:
  - `const TwoBody = root.TwoBodyAnalytic` (browser) or `require('./physics/two-body-analytic.js')` (node)
- Replace internal implementations with delegation:
  - `orbitalRadiusAu(...)` calls `TwoBody.orbitalRadius({ a: aAu, e, thetaRad })`
  - `trueToMeanAnomalyRad(...)` delegates to `TwoBody.trueToMeanAnomalyRad(...)`
  - `meanToTrueAnomalyRad(...)` delegates to `TwoBody.meanToTrueAnomalyRad(...)`

Keep demo-specific coordinate convention functions (position/tangent) local if needed; they can call the shared `orbitalRadiusAu` for `r`.

**Step 3: Run Kepler model unit tests**

```bash
node --test tests/keplers-laws-model.test.js
```

Expected: PASS.

**Step 4: Commit**

```bash
git add demos/_assets/keplers-laws-model.js
git commit -m "refactor(keplers-laws): delegate shared orbital math to TwoBodyAnalytic"
```

---

## Task 6: Load shared physics modules in Binary Orbits demo HTML (no behavior change)

**Files:**
- Modify: `demos/binary-orbits/index.html`
- (Optional) Test: `tests/demo-html-smoke.test.js`

**Step 1: Add optional smoke test**

Add:

```js
test('Binary Orbits loads AstroConstants + TwoBodyAnalytic', () => {
  const html = readText('demos', 'binary-orbits', 'index.html');
  assert.match(html, /_assets\\/physics\\/astro-constants\\.js/);
  assert.match(html, /_assets\\/physics\\/units\\.js/);
  assert.match(html, /_assets\\/physics\\/two-body-analytic\\.js/);
});
```

**Step 2: Add script tags to `demos/binary-orbits/index.html`**

Insert before `../_assets/binary-orbits-model.js`:

```html
  <script src="../_assets/physics/astro-constants.js"></script>
  <script src="../_assets/physics/units.js"></script>
  <script src="../_assets/physics/two-body-analytic.js"></script>
```

**Step 3: Run smoke tests**

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS.

**Step 4: Commit**

```bash
git add demos/binary-orbits/index.html tests/demo-html-smoke.test.js
git commit -m "refactor(binary-orbits): load shared physics modules"
```

---

## Task 7: Refactor `binary-orbits-model.js` to delegate shared math (no API changes)

**Files:**
- Modify: `demos/_assets/binary-orbits-model.js`
- Test: `tests/binary-orbits-physics.test.js` (existing) + add focused model tests if needed

**Step 1: Add a small focused unit test for delegated functions (if none exist)**

Create `tests/binary-orbits-model.test.js` that imports the model file directly and checks:
- `orbitalRadiusAu` matches `TwoBodyAnalytic.orbitalRadius` for the same `(a,e,theta)`.

**Step 2: Refactor**

In `demos/_assets/binary-orbits-model.js`:
- Resolve `TwoBodyAnalytic` similarly to Task 5 (browser global vs require).
- Replace duplicated `orbitalRadiusAu` and anomaly conversion code with delegation.
- Replace local AU/year seconds conversions with `AstroUnits` where appropriate.

**Step 3: Run tests**

```bash
node --test tests/binary-orbits-physics.test.js
node --test tests/binary-orbits-model.test.js
```

Expected: PASS.

**Step 4: Commit**

```bash
git add demos/_assets/binary-orbits-model.js tests/binary-orbits-model.test.js
git commit -m "refactor(binary-orbits): delegate shared orbital math to TwoBodyAnalytic"
```

---

## Task 8: Repo-wide verification gates

**Step 1: Run unit tests**

```bash
node --test
```

Expected: PASS.

**Step 2: Run demo polish checks**

```bash
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
```

Expected: PASS.

**Step 3: Render site**

```bash
conda run -n astro make render
```

Expected: PASS.

---

## Task 9: Document adoption + next steps (optional but recommended)

**Files:**
- Modify: `demos/README.md`

**Step 1: Add a short “Shared physics” section**

Add a brief note that:
- shared physics lives in `demos/_assets/physics/`
- `AstroConstants` is CGS-canonical and provides explicit time scales
- demos should avoid hardcoding AU/year/month constants

**Step 2: Commit**

```bash
git add demos/README.md
git commit -m "docs(demos): document shared physics library usage"
```

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-01-29-astroconstants-physics-library-implementation.md`.

Two execution options:
1. **This session:** use `superpowers:executing-plans` and implement task-by-task with checkpoints.
2. **Parallel session:** open a new session (preferably in a worktree) and run `superpowers:executing-plans` there.

Which approach do you want?

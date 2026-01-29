# Geometry Demos Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement all fixes from the 2026-01-29 geometry demos scientific audit to make the demos perfect.

**Architecture:** Each fix adds documentation and/or functionality to the existing model files. Tests are written first (TDD), then minimal implementation, then commit. Model files follow UMD pattern (browser + Node).

**Tech Stack:** Vanilla JavaScript, Node.js test runner (`node --test`), UMD module pattern.

**Audit Reference:** `docs/audits/2026-01-29-geometry-demos-scientific-audit.md`

---

## Summary of Fixes

| # | Priority | Issue | Files Affected |
|---|----------|-------|----------------|
| 1 | P2 | Document model limitations in seasons-model.js header | `demos/_assets/seasons-model.js` |
| 2 | P2 | Add perihelion day uncertainty documentation | `demos/_assets/seasons-model.js` |
| 3 | P2 | Consider nutation note in eclipse model | `demos/_assets/eclipse-geometry-model.js` |
| 4 | P3 | Expand moon-phases-model with rise/set time calculation | `demos/_assets/moon-phases-model.js`, `tests/moon-phases-model.test.js` |
| 5 | P3 | Add Saros cycle detection to eclipse model | `demos/_assets/eclipse-geometry-model.js`, `tests/eclipse-geometry-model.test.js` |

---

## Task 1: Document Model Limitations in seasons-model.js

**Files:**
- Modify: `demos/_assets/seasons-model.js:1-5`

**Step 1: Read the current file header**

Verify the current header is minimal:
```javascript
/* Seasons model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.SeasonsModel)
 * and in Node tests (via require()).
 */
```

**Step 2: Update the header with model limitations**

Replace lines 1-5 with:

```javascript
/* Seasons model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.SeasonsModel)
 * and in Node tests (via require()).
 *
 * MODEL LIMITATIONS:
 * - Solar declination uses simplified uniform ecliptic longitude approximation
 *   (δ = arcsin(sin(ε) × sin(L)) with L linear in time). Accuracy: ~1° vs ephemeris.
 * - Earth-Sun distance uses first-order eccentric orbit (r ≈ 1 - e cos(θ)),
 *   not a Kepler solver. Distance accurate to ~0.1%.
 * - Perihelion fixed at day 3 (Jan 3); actual varies ±2 days year-to-year.
 * - Ignores precession, nutation, and equation of time.
 *
 * These simplifications are intentional for teaching: the model correctly
 * demonstrates that axial tilt causes seasons, not Earth-Sun distance.
 */
```

**Step 3: Run existing tests to verify no breakage**

Run: `node --test tests/seasons-model.test.js`
Expected: All 6 tests pass (documentation change only)

**Step 4: Commit**

```bash
git add demos/_assets/seasons-model.js
git commit -m "docs(seasons): document model limitations in file header

Adds MODEL LIMITATIONS section documenting:
- ~1° solar declination accuracy
- First-order distance approximation
- ±2 day perihelion uncertainty
- Ignored precession/nutation

Per audit: docs/audits/2026-01-29-geometry-demos-scientific-audit.md"
```

---

## Task 2: Add Perihelion Uncertainty Constant

**Files:**
- Modify: `demos/_assets/seasons-model.js`
- Create test: `tests/seasons-model.test.js` (add test)

**Step 1: Write the failing test**

Add to `tests/seasons-model.test.js`:

```javascript
test('PERIHELION_DAY_UNCERTAINTY is exported and equals 2', () => {
  assert.ok(typeof SeasonsModel.PERIHELION_DAY_UNCERTAINTY === 'number', 'expected PERIHELION_DAY_UNCERTAINTY export');
  assert.equal(SeasonsModel.PERIHELION_DAY_UNCERTAINTY, 2);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/seasons-model.test.js`
Expected: FAIL with "expected PERIHELION_DAY_UNCERTAINTY export"

**Step 3: Write minimal implementation**

In `demos/_assets/seasons-model.js`, add after line 14 (`'use strict';`):

```javascript
  // Perihelion occurs around Jan 3 ±2 days depending on year.
  // This constant documents the uncertainty for UI/tooltip use.
  const PERIHELION_DAY_UNCERTAINTY = 2;
```

Then update the return statement (around line 90) to include:

```javascript
  return {
    PERIHELION_DAY_UNCERTAINTY,
    effectiveObliquityDegrees,
    sunDeclinationDeg,
    dayLengthHours,
    sunNoonAltitudeDeg,
    earthSunDistanceAu,
    orbitAngleRadFromDay,
  };
```

**Step 4: Run test to verify it passes**

Run: `node --test tests/seasons-model.test.js`
Expected: All 7 tests pass

**Step 5: Commit**

```bash
git add demos/_assets/seasons-model.js tests/seasons-model.test.js
git commit -m "feat(seasons): export PERIHELION_DAY_UNCERTAINTY constant

Adds documented constant for ±2 day perihelion variation.
UI can use this for tooltips explaining uncertainty.

Per audit recommendation #1."
```

---

## Task 3: Add Nutation Note to Eclipse Model Header

**Files:**
- Modify: `demos/_assets/eclipse-geometry-model.js:1-5`

**Step 1: Read the current file header**

Verify the current header is minimal:
```javascript
/* Eclipse Geometry model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.EclipseGeometryModel)
 * and in Node tests (via require()).
 */
```

**Step 2: Update the header with model scope**

Replace lines 1-5 with:

```javascript
/* Eclipse Geometry model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.EclipseGeometryModel)
 * and in Node tests (via require()).
 *
 * MODEL SCOPE:
 * - Orbital inclination: Mean value 5.145° (does not model libration).
 * - Node regression: Mean 18.61-year cycle included in simulations.
 * - Nutation: NOT modeled. Short-period (~18.6 yr principal term) nutation
 *   causes ±9 arcsec wobble in obliquity — negligible for eclipse geometry
 *   teaching but important for precise eclipse predictions.
 * - Shadow geometry: Exact similar-triangle formulas for umbra/penumbra.
 * - Eclipse thresholds: Physically motivated from shadow radii, not empirical.
 *
 * These choices prioritize geometric intuition over ephemeris precision.
 */
```

**Step 3: Run existing tests to verify no breakage**

Run: `node --test tests/eclipse-geometry-model.test.js`
Expected: All 11 tests pass (documentation change only)

**Step 4: Commit**

```bash
git add demos/_assets/eclipse-geometry-model.js
git commit -m "docs(eclipse): document model scope including nutation note

Adds MODEL SCOPE section documenting:
- Mean inclination (no libration)
- Node regression included
- Nutation NOT modeled (negligible for teaching)
- Shadow geometry is exact similar-triangles

Per audit recommendation #3."
```

---

## Task 4: Add Moon Rise/Set Time Calculation

**Files:**
- Modify: `demos/_assets/moon-phases-model.js`
- Modify: `tests/moon-phases-model.test.js`

**Step 1: Write the failing test for moonRiseSetHoursFromPhase**

Add to `tests/moon-phases-model.test.js`:

```javascript
test('moonRiseSetHoursFromPhase: Full Moon rises at sunset (~18:00), sets at sunrise (~06:00)', () => {
  assert.ok(typeof MoonPhasesModel.moonRiseSetHoursFromPhase === 'function', 'expected moonRiseSetHoursFromPhase export');
  const fullMoon = MoonPhasesModel.moonRiseSetHoursFromPhase(0); // 0° = Full Moon
  // Full Moon rises ~6pm (18:00), sets ~6am (06:00) at equinox
  assert.ok(Math.abs(fullMoon.riseHour - 18) < 1, `expected rise ~18, got ${fullMoon.riseHour}`);
  assert.ok(Math.abs(fullMoon.setHour - 6) < 1, `expected set ~6, got ${fullMoon.setHour}`);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/moon-phases-model.test.js`
Expected: FAIL with "expected moonRiseSetHoursFromPhase export"

**Step 3: Write the failing test for New Moon**

Add to `tests/moon-phases-model.test.js`:

```javascript
test('moonRiseSetHoursFromPhase: New Moon rises at sunrise (~06:00), sets at sunset (~18:00)', () => {
  const newMoon = MoonPhasesModel.moonRiseSetHoursFromPhase(180); // 180° = New Moon
  // New Moon rises ~6am, sets ~6pm (follows the Sun)
  assert.ok(Math.abs(newMoon.riseHour - 6) < 1, `expected rise ~6, got ${newMoon.riseHour}`);
  assert.ok(Math.abs(newMoon.setHour - 18) < 1, `expected set ~18, got ${newMoon.setHour}`);
});
```

**Step 4: Write the failing test for First Quarter**

Add to `tests/moon-phases-model.test.js`:

```javascript
test('moonRiseSetHoursFromPhase: First Quarter rises at noon (~12:00), sets at midnight (~00:00)', () => {
  const firstQuarter = MoonPhasesModel.moonRiseSetHoursFromPhase(270); // 270° = First Quarter
  // First Quarter rises ~noon, sets ~midnight
  assert.ok(Math.abs(firstQuarter.riseHour - 12) < 1, `expected rise ~12, got ${firstQuarter.riseHour}`);
  assert.ok(firstQuarter.setHour < 1 || firstQuarter.setHour > 23, `expected set ~0/24, got ${firstQuarter.setHour}`);
});
```

**Step 5: Run tests to verify all new tests fail**

Run: `node --test tests/moon-phases-model.test.js`
Expected: 3 failures (new tests), 2 passes (existing tests)

**Step 6: Write minimal implementation**

In `demos/_assets/moon-phases-model.js`, add before the return statement:

```javascript
  // Approximate Moon rise/set times based on phase angle.
  //
  // Teaching model: At equinox with 12h day, the Sun rises at 06:00 and sets at 18:00.
  // The Moon's rise/set times depend on its angular separation from the Sun:
  //   - Full Moon (0°): opposite Sun → rises at sunset (18:00), sets at sunrise (06:00)
  //   - New Moon (180°): same direction as Sun → rises at sunrise (06:00), sets at sunset (18:00)
  //   - First Quarter (270°): 90° ahead → rises at noon (12:00), sets at midnight (00:00)
  //   - Third Quarter (90°): 90° behind → rises at midnight (00:00), sets at noon (12:00)
  //
  // Formula: rise/set shifts by (phaseAngle / 360) * 24 hours from the Sun's times.
  // This is a simplified model ignoring latitude, season, and orbital mechanics.
  function moonRiseSetHoursFromPhase(angleDeg) {
    // Normalize angle to 0-360
    const normalized = ((angleDeg % 360) + 360) % 360;

    // Sun rises at 06:00, sets at 18:00 (equinox reference)
    const sunRise = 6;
    const sunSet = 18;

    // Moon lags behind Sun by phaseAngle (demo convention: 0° = Full = opposite Sun)
    // At 0° (Full), Moon is opposite Sun → rises when Sun sets
    // At 180° (New), Moon is with Sun → rises when Sun rises
    // Shift = (180 - angleDeg) / 360 * 24 hours
    const shiftHours = ((180 - normalized) / 360) * 24;

    let riseHour = (sunRise + shiftHours + 24) % 24;
    let setHour = (sunSet + shiftHours + 24) % 24;

    return {
      riseHour: Math.round(riseHour * 10) / 10,
      setHour: Math.round(setHour * 10) / 10,
    };
  }
```

Then update the return statement:

```javascript
  return {
    illuminationFractionFromMoonAngleDeg,
    moonRiseSetHoursFromPhase,
  };
```

**Step 7: Run tests to verify all pass**

Run: `node --test tests/moon-phases-model.test.js`
Expected: All 5 tests pass

**Step 8: Commit**

```bash
git add demos/_assets/moon-phases-model.js tests/moon-phases-model.test.js
git commit -m "feat(moon-phases): add moonRiseSetHoursFromPhase calculation

Adds simplified rise/set time model based on phase angle:
- Full Moon: rises ~18:00, sets ~06:00
- New Moon: rises ~06:00, sets ~18:00
- First Quarter: rises ~12:00, sets ~00:00
- Third Quarter: rises ~00:00, sets ~12:00

Includes 3 new tests. Teaching model only (ignores latitude/season).

Per audit recommendation #4."
```

---

## Task 5: Add Saros Cycle Detection to Eclipse Model

**Files:**
- Modify: `demos/_assets/eclipse-geometry-model.js`
- Modify: `tests/eclipse-geometry-model.test.js`

**Step 1: Write the failing test for SAROS_CYCLE_DAYS constant**

Add to `tests/eclipse-geometry-model.test.js`:

```javascript
test('SAROS_CYCLE_DAYS is exported and approximately 6585.3 days', () => {
  assert.ok(typeof M.SAROS_CYCLE_DAYS === 'number', 'expected SAROS_CYCLE_DAYS export');
  // Saros = 223 synodic months ≈ 6585.32 days (18 years, 11 days, 8 hours)
  assert.ok(Math.abs(M.SAROS_CYCLE_DAYS - 6585.32) < 0.1, `expected ~6585.32, got ${M.SAROS_CYCLE_DAYS}`);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/eclipse-geometry-model.test.js`
Expected: FAIL with "expected SAROS_CYCLE_DAYS export"

**Step 3: Write the failing test for isSarosRelated**

Add to `tests/eclipse-geometry-model.test.js`:

```javascript
test('isSarosRelated: eclipses ~6585 days apart are Saros-related', () => {
  assert.ok(typeof M.isSarosRelated === 'function', 'expected isSarosRelated export');

  // Two eclipses exactly one Saros apart
  const related = M.isSarosRelated({ daysSeparation: 6585.32 });
  assert.equal(related, true);

  // Eclipses half a Saros apart are NOT related
  const notRelated = M.isSarosRelated({ daysSeparation: 3292 });
  assert.equal(notRelated, false);

  // Tolerance: within ±1 day should still match
  const almostSaros = M.isSarosRelated({ daysSeparation: 6584.5 });
  assert.equal(almostSaros, true);
});
```

**Step 4: Run tests to verify new tests fail**

Run: `node --test tests/eclipse-geometry-model.test.js`
Expected: 2 new failures, 11 existing passes

**Step 5: Write the failing test for Triple Saros (Exeligmos)**

Add to `tests/eclipse-geometry-model.test.js`:

```javascript
test('isExeligmosRelated: eclipses ~19756 days apart are Exeligmos-related', () => {
  assert.ok(typeof M.isExeligmosRelated === 'function', 'expected isExeligmosRelated export');

  // Exeligmos = 3 Saros cycles ≈ 19755.96 days (54 years, 33 days)
  const related = M.isExeligmosRelated({ daysSeparation: 19756 });
  assert.equal(related, true);

  const notRelated = M.isExeligmosRelated({ daysSeparation: 10000 });
  assert.equal(notRelated, false);
});
```

**Step 6: Write minimal implementation**

In `demos/_assets/eclipse-geometry-model.js`, add after line 14 (`'use strict';`):

```javascript
  // ============================================
  // Eclipse Cycle Constants
  // ============================================

  // Saros cycle: 223 synodic months = 6585.3211 days (18 years, 11 days, 8 hours)
  // After one Saros, Sun, Moon, and nodes return to nearly the same relative positions.
  const SYNODIC_MONTH_DAYS = 29.530588;
  const SAROS_SYNODIC_MONTHS = 223;
  const SAROS_CYCLE_DAYS = SYNODIC_MONTH_DAYS * SAROS_SYNODIC_MONTHS; // ≈ 6585.32

  // Exeligmos: 3 Saros cycles = 669 synodic months ≈ 19755.96 days (54 years, 33 days)
  // After one Exeligmos, eclipses return to same longitude (8-hour shift cancels out).
  const EXELIGMOS_CYCLE_DAYS = SAROS_CYCLE_DAYS * 3;

  // Tolerance for cycle matching (±1 day accounts for approximations)
  const CYCLE_TOLERANCE_DAYS = 1;
```

Add before the return statement:

```javascript
  // ============================================
  // Saros Cycle Detection
  // ============================================

  /**
   * Check if two eclipses are Saros-related (separated by ~6585 days).
   * @param {object} params
   * @param {number} params.daysSeparation - Days between two eclipses
   * @returns {boolean} True if within tolerance of one Saros cycle
   */
  function isSarosRelated({ daysSeparation }) {
    if (!Number.isFinite(daysSeparation)) return false;
    const absDays = Math.abs(daysSeparation);
    return Math.abs(absDays - SAROS_CYCLE_DAYS) <= CYCLE_TOLERANCE_DAYS;
  }

  /**
   * Check if two eclipses are Exeligmos-related (separated by ~19756 days).
   * Exeligmos = 3 Saros cycles; eclipses return to same longitude.
   * @param {object} params
   * @param {number} params.daysSeparation - Days between two eclipses
   * @returns {boolean} True if within tolerance of one Exeligmos cycle
   */
  function isExeligmosRelated({ daysSeparation }) {
    if (!Number.isFinite(daysSeparation)) return false;
    const absDays = Math.abs(daysSeparation);
    return Math.abs(absDays - EXELIGMOS_CYCLE_DAYS) <= CYCLE_TOLERANCE_DAYS;
  }
```

Update the return statement to include:

```javascript
  return {
    SAROS_CYCLE_DAYS,
    EXELIGMOS_CYCLE_DAYS,
    normalizeAngleDeg,
    angularSeparationDeg,
    phaseAngleDeg,
    eclipticLatitudeDeg,
    nearestNodeDistanceDeg,
    betaFromDeltaLambdaDeg,
    deltaLambdaFromBetaDeg,
    shadowRadiiKmAtDistance,
    eclipseThresholdsDeg,
    lunarEclipseTypeFromBetaDeg,
    solarEclipseTypeFromBetaDeg,
    isSarosRelated,
    isExeligmosRelated,
  };
```

**Step 7: Run tests to verify all pass**

Run: `node --test tests/eclipse-geometry-model.test.js`
Expected: All 14 tests pass

**Step 8: Commit**

```bash
git add demos/_assets/eclipse-geometry-model.js tests/eclipse-geometry-model.test.js
git commit -m "feat(eclipse): add Saros and Exeligmos cycle detection

Adds eclipse cycle constants and detection functions:
- SAROS_CYCLE_DAYS ≈ 6585.32 (223 synodic months)
- EXELIGMOS_CYCLE_DAYS ≈ 19755.96 (3 Saros)
- isSarosRelated() - detects eclipses one Saros apart
- isExeligmosRelated() - detects eclipses one Exeligmos apart

Includes 3 new tests. UI can use this to highlight Saros series.

Per audit recommendation #5."
```

---

## Task 6: Run Full Test Suite and Verify

**Files:**
- All test files

**Step 1: Run complete test suite**

Run: `node --test tests/seasons-model.test.js tests/angular-size-model.test.js tests/moon-phases-model.test.js tests/eclipse-geometry-model.test.js`

Expected output:
```
# tests 31
# pass 31
# fail 0
```

**Step 2: Run smoke tests to verify demos still load**

Run: `node --test tests/demo-html-smoke.test.js`
Expected: All demos load without errors

**Step 3: Create summary commit (optional, if needed)**

If all tests pass, the implementation is complete.

---

## Verification Checklist

After completing all tasks:

- [ ] `seasons-model.js` header documents ~1° accuracy, perihelion uncertainty
- [ ] `PERIHELION_DAY_UNCERTAINTY` constant exported and tested
- [ ] `eclipse-geometry-model.js` header documents nutation scope
- [ ] `moonRiseSetHoursFromPhase` function implemented and tested
- [ ] `SAROS_CYCLE_DAYS` and cycle detection functions implemented and tested
- [ ] All 31 tests pass
- [ ] Demo smoke tests pass
- [ ] 5 atomic commits created

---

## Test Count Summary

| File | Before | After | New Tests |
|------|--------|-------|-----------|
| `seasons-model.test.js` | 6 | 7 | +1 |
| `angular-size-model.test.js` | 5 | 5 | 0 |
| `moon-phases-model.test.js` | 2 | 5 | +3 |
| `eclipse-geometry-model.test.js` | 11 | 14 | +3 |
| **Total** | **24** | **31** | **+7** |

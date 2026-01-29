# Demos Architecture DRY Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix DRY violations and architecture inconsistencies in the demos/ suite identified by code review.

**Architecture:** Extract telescope-resolution physics into a testable model file following the established UMD pattern. Centralize angle conversion utilities in physics/units.js. All physics functions become pure, testable, and shared.

**Tech Stack:** JavaScript (UMD pattern), Node.js test runner, CGS units

---

## Task 1: Add degToRad/radToDeg to physics/units.js

**Files:**
- Modify: `demos/_assets/physics/units.js`
- Modify: `tests/physics-units.test.js`

**Step 1: Write the failing tests**

Add to `tests/physics-units.test.js`:

```javascript
test('degToRad converts 180° to π radians', () => {
  const result = AstroUnits.degToRad(180);
  assert.ok(Math.abs(result - Math.PI) < 1e-12, `expected π, got ${result}`);
});

test('radToDeg converts π radians to 180°', () => {
  const result = AstroUnits.radToDeg(Math.PI);
  assert.ok(Math.abs(result - 180) < 1e-12, `expected 180, got ${result}`);
});

test('degToRad and radToDeg are inverses', () => {
  const original = 45;
  const result = AstroUnits.radToDeg(AstroUnits.degToRad(original));
  assert.ok(Math.abs(result - original) < 1e-12, `expected ${original}, got ${result}`);
});
```

**Step 2: Run tests to verify they fail**

```bash
node --test tests/physics-units.test.js
```

Expected: FAIL with "AstroUnits.degToRad is not a function"

**Step 3: Add the functions to units.js**

Add before the `return` statement in `demos/_assets/physics/units.js`:

```javascript
  // Angle conversions
  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }
```

Add to the return object:

```javascript
    degToRad,
    radToDeg,
```

**Step 4: Run tests to verify they pass**

```bash
node --test tests/physics-units.test.js
```

Expected: PASS

**Step 5: Commit**

```bash
git add demos/_assets/physics/units.js tests/physics-units.test.js
git commit -m "feat(physics): add degToRad/radToDeg to AstroUnits

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create telescope-resolution-model.js with constants

**Files:**
- Create: `demos/_assets/telescope-resolution-model.js`
- Create: `tests/telescope-resolution-model.test.js`

**Step 1: Write the failing test for constants**

Create `tests/telescope-resolution-model.test.js`:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');

const TelescopeResolutionModel = require('../demos/_assets/telescope-resolution-model.js');

test('CONSTANTS.RAD_TO_ARCSEC is 206265 (within 0.01%)', () => {
  const expected = 206265;
  const actual = TelescopeResolutionModel.CONSTANTS.RAD_TO_ARCSEC;
  const error = Math.abs(actual - expected) / expected;
  assert.ok(error < 0.0001, `expected ~${expected}, got ${actual}`);
});

test('CONSTANTS.DIFF_COEFF is 1.22 * RAD_TO_ARCSEC (within 0.01%)', () => {
  const expected = 1.22 * 206264.806;
  const actual = TelescopeResolutionModel.CONSTANTS.DIFF_COEFF;
  const error = Math.abs(actual - expected) / expected;
  assert.ok(error < 0.0001, `expected ~${expected}, got ${actual}`);
});
```

**Step 2: Run test to verify it fails**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: FAIL with "Cannot find module"

**Step 3: Create minimal model file with constants**

Create `demos/_assets/telescope-resolution-model.js`:

```javascript
/**
 * demos/_assets/telescope-resolution-model.js
 *
 * Telescope resolution physics model (diffraction, Rayleigh criterion, Airy disk).
 *
 * Physics (CGS units):
 * - Diffraction limit: theta = 1.22 * lambda / D (radians)
 * - theta (arcsec) = 251643 * lambda(cm) / D(cm)
 * - Rayleigh criterion: resolved if separation > theta_diffraction
 * - Airy disk intensity: I(x) = (2*J1(x)/x)^2 where x = pi*D*sin(theta)/lambda
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.TelescopeResolutionModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CONSTANTS = {
    // Conversion factors
    RAD_TO_ARCSEC: 206265,     // radians to arcseconds (exact: 648000/π)
    ARCSEC_TO_RAD: 4.848e-6,   // arcseconds to radians
    M_TO_CM: 100,              // meters to cm
    NM_TO_CM: 1e-7,            // nanometers to cm

    // Diffraction coefficient (in convenient units)
    // theta(arcsec) = 1.22 * 206264.806 * lambda(cm) / D(cm)
    // Exact: 1.22 * 206264.806 = 251643.1
    DIFF_COEFF: 251643.1,

    // Typical Strehl ratio for good adaptive optics
    AO_STREHL: 0.6
  };

  return {
    CONSTANTS,
  };
});
```

**Step 4: Run test to verify it passes**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: PASS

**Step 5: Commit**

```bash
git add demos/_assets/telescope-resolution-model.js tests/telescope-resolution-model.test.js
git commit -m "feat(telescope): create telescope-resolution-model.js with constants

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Add diffractionLimitArcsec with tests

**Files:**
- Modify: `demos/_assets/telescope-resolution-model.js`
- Modify: `tests/telescope-resolution-model.test.js`

**Step 1: Write the failing tests**

Add to `tests/telescope-resolution-model.test.js`:

```javascript
test('diffractionLimitArcsec: HST (D=2.4m, lambda=550nm) gives ~0.058 arcsec', () => {
  const D_cm = 2.4 * 100;          // 2.4 m in cm
  const lambda_cm = 5.5e-5;         // 550 nm in cm
  const result = TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, D_cm);
  // NASA quotes HST resolution as ~0.05" at 500nm
  assert.ok(result > 0.05 && result < 0.07, `expected ~0.058, got ${result}`);
});

test('diffractionLimitArcsec: human eye (D=7mm, lambda=550nm) gives ~20 arcsec', () => {
  const D_cm = 0.7;                 // 7 mm in cm
  const lambda_cm = 5.5e-5;         // 550 nm in cm
  const result = TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, D_cm);
  // Human eye diffraction limit ~20" (practical limit is worse due to aberrations)
  assert.ok(result > 15 && result < 25, `expected ~20, got ${result}`);
});

test('diffractionLimitArcsec: Keck (D=10m, lambda=550nm) gives ~0.014 arcsec', () => {
  const D_cm = 10 * 100;            // 10 m in cm
  const lambda_cm = 5.5e-5;         // 550 nm in cm
  const result = TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, D_cm);
  assert.ok(result > 0.01 && result < 0.02, `expected ~0.014, got ${result}`);
});
```

**Step 2: Run tests to verify they fail**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: FAIL with "diffractionLimitArcsec is not a function"

**Step 3: Add the function**

Add to `demos/_assets/telescope-resolution-model.js` before `return`:

```javascript
  /**
   * Calculate diffraction limit in arcseconds
   * theta = 1.22 * lambda / D (radians)
   * theta(arcsec) = 2.52e5 * lambda(cm) / D(cm)
   *
   * @param {number} lambda_cm - Wavelength in cm
   * @param {number} D_cm - Aperture diameter in cm
   * @returns {number} Angular resolution in arcseconds
   */
  function diffractionLimitArcsec(lambda_cm, D_cm) {
    if (!Number.isFinite(lambda_cm) || lambda_cm <= 0) return NaN;
    if (!Number.isFinite(D_cm) || D_cm <= 0) return NaN;
    return CONSTANTS.DIFF_COEFF * lambda_cm / D_cm;
  }
```

Add to return object:

```javascript
    diffractionLimitArcsec,
```

**Step 4: Run tests to verify they pass**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: PASS

**Step 5: Commit**

```bash
git add demos/_assets/telescope-resolution-model.js tests/telescope-resolution-model.test.js
git commit -m "feat(telescope): add diffractionLimitArcsec function

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Add effectiveResolution and resolutionStatus with tests

**Files:**
- Modify: `demos/_assets/telescope-resolution-model.js`
- Modify: `tests/telescope-resolution-model.test.js`

**Step 1: Write the failing tests**

Add to `tests/telescope-resolution-model.test.js`:

```javascript
test('effectiveResolution: space telescope (seeing=0) returns diffraction limit', () => {
  const theta_diff = 0.05;
  const result = TelescopeResolutionModel.effectiveResolution(theta_diff, 0, false);
  assert.strictEqual(result, theta_diff);
});

test('effectiveResolution: ground without AO is seeing-limited', () => {
  const theta_diff = 0.05;
  const seeing = 1.0;
  const result = TelescopeResolutionModel.effectiveResolution(theta_diff, seeing, false);
  assert.strictEqual(result, seeing);
});

test('effectiveResolution: ground with AO improves on seeing', () => {
  const theta_diff = 0.05;
  const seeing = 1.0;
  const withoutAO = TelescopeResolutionModel.effectiveResolution(theta_diff, seeing, false);
  const withAO = TelescopeResolutionModel.effectiveResolution(theta_diff, seeing, true);
  assert.ok(withAO < withoutAO, `AO should improve: ${withAO} < ${withoutAO}`);
});

test('resolutionStatus: well-separated binary is resolved', () => {
  const result = TelescopeResolutionModel.resolutionStatus(1.0, 0.5);
  assert.strictEqual(result, 'resolved');
});

test('resolutionStatus: equal separation/resolution is marginal', () => {
  const result = TelescopeResolutionModel.resolutionStatus(0.5, 0.5);
  assert.strictEqual(result, 'marginal');
});

test('resolutionStatus: close binary is unresolved', () => {
  const result = TelescopeResolutionModel.resolutionStatus(0.1, 0.5);
  assert.strictEqual(result, 'unresolved');
});
```

**Step 2: Run tests to verify they fail**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: FAIL with "effectiveResolution is not a function"

**Step 3: Add the functions**

Add to `demos/_assets/telescope-resolution-model.js` before `return`:

```javascript
  /**
   * Calculate effective resolution including atmospheric seeing
   *
   * For space telescopes (seeing = 0): resolution = diffraction limit
   * For ground without AO: resolution = max(diffraction_limit, seeing)
   * For ground with AO: resolution combines both quadratically with Strehl improvement
   *
   * @param {number} theta_diff - Diffraction limit in arcsec
   * @param {number} seeing - Atmospheric seeing in arcsec (0 for space)
   * @param {boolean} aoEnabled - Whether adaptive optics is enabled
   * @returns {number} Effective resolution in arcseconds
   */
  function effectiveResolution(theta_diff, seeing, aoEnabled) {
    if (seeing === 0) {
      // Space telescope - diffraction limited
      return theta_diff;
    }

    if (!aoEnabled) {
      // Ground without AO - seeing limited unless telescope is small
      return Math.max(theta_diff, seeing);
    }

    // Ground with AO - partial correction
    // AO reduces the seeing contribution by (1 - Strehl)
    const correctedSeeing = seeing * (1 - CONSTANTS.AO_STREHL);
    // Combine in quadrature
    return Math.sqrt(theta_diff * theta_diff + correctedSeeing * correctedSeeing);
  }

  /**
   * Determine if a binary pair is resolved according to Rayleigh criterion
   * @param {number} separation - Binary separation in arcsec
   * @param {number} resolution - Effective resolution in arcsec
   * @returns {string} 'resolved', 'marginal', or 'unresolved'
   */
  function resolutionStatus(separation, resolution) {
    const ratio = separation / resolution;
    if (ratio > 1.5) return 'resolved';
    if (ratio > 0.8) return 'marginal';
    return 'unresolved';
  }
```

Add to return object:

```javascript
    effectiveResolution,
    resolutionStatus,
```

**Step 4: Run tests to verify they pass**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: PASS

**Step 5: Commit**

```bash
git add demos/_assets/telescope-resolution-model.js tests/telescope-resolution-model.test.js
git commit -m "feat(telescope): add effectiveResolution and resolutionStatus

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Add besselJ1 and airyIntensity with tests

**Files:**
- Modify: `demos/_assets/telescope-resolution-model.js`
- Modify: `tests/telescope-resolution-model.test.js`

**Step 1: Write the failing tests**

Add to `tests/telescope-resolution-model.test.js`:

```javascript
test('besselJ1: J1(0) = 0', () => {
  const result = TelescopeResolutionModel.besselJ1(0);
  assert.ok(Math.abs(result) < 1e-10, `expected 0, got ${result}`);
});

test('besselJ1: J1(3.83) ≈ 0 (first zero)', () => {
  const result = TelescopeResolutionModel.besselJ1(3.8317);
  assert.ok(Math.abs(result) < 0.01, `expected ~0, got ${result}`);
});

test('besselJ1: J1(1.84) ≈ 0.58 (maximum)', () => {
  const result = TelescopeResolutionModel.besselJ1(1.8412);
  assert.ok(Math.abs(result - 0.5819) < 0.01, `expected ~0.58, got ${result}`);
});

test('airyIntensity: I(0) = 1 (central maximum)', () => {
  const result = TelescopeResolutionModel.airyIntensity(0);
  assert.ok(Math.abs(result - 1.0) < 1e-10, `expected 1, got ${result}`);
});

test('airyIntensity: I(3.83) ≈ 0 (first null)', () => {
  const result = TelescopeResolutionModel.airyIntensity(3.8317);
  assert.ok(result < 0.001, `expected ~0, got ${result}`);
});

test('airyIntensity: always returns value between 0 and 1', () => {
  for (const x of [0, 0.5, 1, 2, 3, 5, 10, 20]) {
    const result = TelescopeResolutionModel.airyIntensity(x);
    assert.ok(result >= 0 && result <= 1, `I(${x}) = ${result} not in [0,1]`);
  }
});
```

**Step 2: Run tests to verify they fail**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: FAIL with "besselJ1 is not a function"

**Step 3: Add the functions**

Add to `demos/_assets/telescope-resolution-model.js` before `return`:

```javascript
  /**
   * Bessel function J1(x) approximation
   * Used for Airy disk pattern
   * @param {number} x - Input value
   * @returns {number} J1(x)
   */
  function besselJ1(x) {
    if (Math.abs(x) < 1e-10) return 0;

    if (Math.abs(x) < 8) {
      // Polynomial approximation for small x
      const y = x * x;
      const ans1 = x * (72362614232.0 + y * (-7895059235.0 +
        y * (242396853.1 + y * (-2972611.439 +
        y * (15704.48260 + y * (-30.16036606))))));
      const ans2 = 144725228442.0 + y * (2300535178.0 +
        y * (18583304.74 + y * (99447.43394 +
        y * (376.9991397 + y * 1.0))));
      return ans1 / ans2;
    } else {
      // Asymptotic approximation for large x
      const ax = Math.abs(x);
      const z = 8.0 / ax;
      const y = z * z;
      const xx = ax - 2.356194491;  // 3*pi/4

      const ans1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 +
        y * (0.2457520174e-5 + y * (-0.240337019e-6))));
      const ans2 = 0.04687499995 + y * (-0.2002690873e-3 +
        y * (0.8449199096e-5 + y * (-0.88228987e-6 +
        y * 0.105787412e-6)));

      const ans = Math.sqrt(0.636619772 / ax) *
        (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
      return x < 0 ? -ans : ans;
    }
  }

  /**
   * Calculate Airy disk intensity pattern
   * I(x) = (2*J1(x)/x)^2
   * @param {number} x - Normalized radial coordinate (pi*D*sin(theta)/lambda)
   * @returns {number} Normalized intensity (0 to 1)
   */
  function airyIntensity(x) {
    if (Math.abs(x) < 1e-10) return 1.0;  // Central maximum
    const j1 = besselJ1(x);
    const term = 2 * j1 / x;
    return term * term;
  }
```

Add to return object:

```javascript
    besselJ1,
    airyIntensity,
```

**Step 4: Run tests to verify they pass**

```bash
node --test tests/telescope-resolution-model.test.js
```

Expected: PASS

**Step 5: Commit**

```bash
git add demos/_assets/telescope-resolution-model.js tests/telescope-resolution-model.test.js
git commit -m "feat(telescope): add besselJ1 and airyIntensity functions

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Refactor resolution.js to use the model

**Files:**
- Modify: `demos/telescope-resolution/index.html`
- Modify: `demos/telescope-resolution/resolution.js`

**Step 1: Add script tag to load model**

In `demos/telescope-resolution/index.html`, find the script tags section and add before `resolution.js`:

```html
<script src="../_assets/telescope-resolution-model.js"></script>
```

**Step 2: Refactor resolution.js to use model**

Replace the CONSTANTS and physics functions section (lines 19-144) with:

```javascript
  // ============================================
  // Physics from shared TelescopeResolutionModel
  // ============================================

  const CONSTANTS = window.TelescopeResolutionModel.CONSTANTS;
  const diffractionLimitArcsec = window.TelescopeResolutionModel.diffractionLimitArcsec;
  const effectiveResolution = window.TelescopeResolutionModel.effectiveResolution;
  const resolutionStatus = window.TelescopeResolutionModel.resolutionStatus;
  const besselJ1 = window.TelescopeResolutionModel.besselJ1;
  const airyIntensity = window.TelescopeResolutionModel.airyIntensity;
```

**Step 3: Run all tests to verify nothing broke**

```bash
node --test tests/*.test.js
```

Expected: All tests PASS

**Step 4: Test in browser**

Open `http://127.0.0.1:8000/demos/telescope-resolution/` and verify:
- Presets work (Hubble, Keck, etc.)
- Aperture slider updates diffraction limit
- Binary separation slider updates visualization
- Atmosphere toggle affects resolution

**Step 5: Commit**

```bash
git add demos/telescope-resolution/index.html demos/telescope-resolution/resolution.js
git commit -m "refactor(telescope): use extracted physics model

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Add smoke test for telescope-resolution model loading

**Files:**
- Modify: `tests/demo-html-smoke.test.js`

**Step 1: Add the smoke test**

Add to `tests/demo-html-smoke.test.js`:

```javascript
test('Telescope Resolution loads the shared TelescopeResolutionModel', () => {
  const html = fs.readFileSync('demos/telescope-resolution/index.html', 'utf8');
  assert.ok(html.includes('telescope-resolution-model.js'), 'should load shared model');
});
```

**Step 2: Run smoke tests**

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS

**Step 3: Commit**

```bash
git add tests/demo-html-smoke.test.js
git commit -m "test(telescope): add smoke test for model loading

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Run full test suite verification

**Step 1: Run all tests**

```bash
node --test tests/*.test.js
```

Expected: All tests PASS (should be ~115+ tests now)

**Step 2: Verify git status is clean**

```bash
git status
```

Expected: Clean working tree

---

## Summary

| Task | Description | Tests Added |
|------|-------------|-------------|
| 1 | Add degToRad/radToDeg to units.js | 3 |
| 2 | Create telescope-resolution-model.js | 2 |
| 3 | Add diffractionLimitArcsec | 3 |
| 4 | Add effectiveResolution/resolutionStatus | 6 |
| 5 | Add besselJ1/airyIntensity | 6 |
| 6 | Refactor resolution.js | 0 |
| 7 | Add smoke test | 1 |
| 8 | Full verification | 0 |

**Total new tests:** 21
**Commits:** 8 atomic commits

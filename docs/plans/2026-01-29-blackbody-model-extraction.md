# Blackbody Model Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract physics functions from blackbody.js into a testable model file with full test coverage.

**Architecture:** Create `blackbody-model.js` following the UMD pattern used by other demo models (seasons-model.js, angular-size-model.js). Physics functions will be pure and testable. UI code in `blackbody.js` will import from the model. Consolidate duplicated `temperatureToColor()` into `stellar-utils.js`.

**Tech Stack:** Vanilla JavaScript, Node.js test runner (`node --test`), UMD module pattern.

**Reference Files:**
- Pattern to follow: `demos/_assets/angular-size-model.js`
- Source code: `demos/blackbody-radiation/blackbody.js:18-94`
- Duplicate to remove: `demos/_assets/stellar-utils.js:43-73`

---

## Summary of Tasks

| # | Task | Files | New Tests |
|---|------|-------|-----------|
| 1 | Create blackbody-model.js with constants | `demos/_assets/blackbody-model.js` | 0 |
| 2 | Add Wien's Law functions + tests | model + tests | 2 |
| 3 | Add Planck function + tests | model + tests | 3 |
| 4 | Add Stefan-Boltzmann + tests | model + tests | 2 |
| 5 | Add temperatureToColor (consolidated) + tests | model + tests | 3 |
| 6 | Update blackbody.js to use model | `blackbody.js` | 0 |
| 7 | Remove duplicate from stellar-utils.js | `stellar-utils.js` | 0 |
| 8 | Run full test suite | - | 0 |

**Total new tests: 10**

---

## Task 1: Create blackbody-model.js with Physical Constants

**Files:**
- Create: `demos/_assets/blackbody-model.js`

**Step 1: Create the model file with UMD wrapper and constants**

```javascript
/* Blackbody Radiation model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.BlackbodyModel)
 * and in Node tests (via require()).
 *
 * PHYSICS (CGS units):
 * - Wien's Law: λ_peak = b / T, where b = 0.2898 cm·K
 * - Planck Function: B_λ(T) = (2hc²/λ⁵) × 1/(exp(hc/λkT) - 1)
 * - Stefan-Boltzmann: F = σT⁴
 *
 * MODEL LIMITATIONS:
 * - Temperature-to-color is a perceptual approximation, not CIE colorimetry
 * - Planck function overflow protection kicks in at exp(700)
 * - All wavelengths in cm internally; conversion helpers provided
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.BlackbodyModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ============================================
  // Physical Constants (CGS)
  // ============================================

  const CONSTANTS = {
    c: 2.998e10,           // Speed of light (cm/s)
    h: 6.626e-27,          // Planck constant (erg·s)
    k: 1.381e-16,          // Boltzmann constant (erg/K)
    sigma: 5.670e-5,       // Stefan-Boltzmann (erg/cm²/s/K⁴)
    wien_b: 0.2898,        // Wien displacement constant (cm·K)

    // Unit conversions
    cm_to_nm: 1e7,         // cm to nm
    nm_to_cm: 1e-7,        // nm to cm

    // Solar reference values
    T_sun: 5772,           // K (IAU 2015 nominal)
    R_sun: 6.957e10,       // cm (IAU 2015 nominal)
    L_sun: 3.828e33        // erg/s (IAU 2015 nominal)
  };

  return {
    CONSTANTS,
  };
});
```

**Step 2: Verify file loads in Node**

Run: `node -e "const M = require('./demos/_assets/blackbody-model.js'); console.log(M.CONSTANTS.wien_b)"`
Expected: `0.2898`

**Step 3: Commit**

```bash
git add demos/_assets/blackbody-model.js
git commit -m "feat(blackbody): create blackbody-model.js with physical constants

Adds CGS physical constants:
- c, h, k, σ for radiation physics
- Wien displacement constant b = 0.2898 cm·K
- IAU 2015 nominal solar values

UMD pattern for browser + Node compatibility."
```

---

## Task 2: Add Wien's Law Functions with Tests

**Files:**
- Modify: `demos/_assets/blackbody-model.js`
- Create: `tests/blackbody-model.test.js`

**Step 1: Write the failing tests**

Create `tests/blackbody-model.test.js`:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');

const BlackbodyModel = require('../demos/_assets/blackbody-model.js');

test('wienPeakCm: Sun (5772 K) peaks at ~502 nm = 5.02e-5 cm', () => {
  const peakCm = BlackbodyModel.wienPeakCm(5772);
  // b/T = 0.2898 / 5772 = 5.02e-5 cm = 502 nm
  assert.ok(Math.abs(peakCm - 5.02e-5) < 1e-7, `expected ~5.02e-5, got ${peakCm}`);
});

test('wienPeakNm: Sun (5772 K) peaks at ~502 nm', () => {
  const peakNm = BlackbodyModel.wienPeakNm(5772);
  // Allow 1 nm tolerance
  assert.ok(Math.abs(peakNm - 502) < 1, `expected ~502 nm, got ${peakNm}`);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/blackbody-model.test.js`
Expected: FAIL with "wienPeakCm is not a function"

**Step 3: Write minimal implementation**

Add to `blackbody-model.js` before the return statement:

```javascript
  // ============================================
  // Wien's Displacement Law
  // ============================================

  /**
   * Wien's peak wavelength in cm
   * λ_peak = b / T
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (cm)
   */
  function wienPeakCm(T) {
    if (!Number.isFinite(T) || T <= 0) return NaN;
    return CONSTANTS.wien_b / T;
  }

  /**
   * Wien's peak wavelength in nm (for display)
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (nm)
   */
  function wienPeakNm(T) {
    const cm = wienPeakCm(T);
    return Number.isNaN(cm) ? NaN : cm * CONSTANTS.cm_to_nm;
  }
```

Update return statement:

```javascript
  return {
    CONSTANTS,
    wienPeakCm,
    wienPeakNm,
  };
```

**Step 4: Run tests to verify they pass**

Run: `node --test tests/blackbody-model.test.js`
Expected: 2 tests pass

**Step 5: Commit**

```bash
git add demos/_assets/blackbody-model.js tests/blackbody-model.test.js
git commit -m "feat(blackbody): add Wien's Law functions with tests

wienPeakCm(T) - peak wavelength in cm
wienPeakNm(T) - peak wavelength in nm

Verified: Sun at 5772 K peaks at 502 nm."
```

---

## Task 3: Add Planck Function with Tests

**Files:**
- Modify: `demos/_assets/blackbody-model.js`
- Modify: `tests/blackbody-model.test.js`

**Step 1: Write the failing tests**

Add to `tests/blackbody-model.test.js`:

```javascript
test('planckFunction: returns positive value at Wien peak', () => {
  const T = 5772;
  const lambda = BlackbodyModel.wienPeakCm(T);
  const B = BlackbodyModel.planckFunction(lambda, T);
  assert.ok(B > 0, `expected B > 0, got ${B}`);
});

test('planckFunction: intensity increases with temperature at fixed wavelength', () => {
  const lambda = 5e-5; // 500 nm
  const B_cool = BlackbodyModel.planckFunction(lambda, 4000);
  const B_hot = BlackbodyModel.planckFunction(lambda, 6000);
  assert.ok(B_hot > B_cool, `expected B(6000K) > B(4000K)`);
});

test('planckFunction: handles extreme temperature gracefully (no overflow)', () => {
  // Very cold: CMB at 2.725 K
  const B_cmb = BlackbodyModel.planckFunction(1e-1, 2.725); // 1 mm
  assert.ok(Number.isFinite(B_cmb), `expected finite value for CMB, got ${B_cmb}`);

  // Very hot: 1 million K neutron star
  const B_hot = BlackbodyModel.planckFunction(1e-7, 1e6); // 1 nm
  assert.ok(Number.isFinite(B_hot), `expected finite value for hot star, got ${B_hot}`);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/blackbody-model.test.js`
Expected: 3 new failures

**Step 3: Write minimal implementation**

Add to `blackbody-model.js`:

```javascript
  // ============================================
  // Planck Function
  // ============================================

  /**
   * Planck function B_λ(T) - spectral radiance
   * B_λ = (2hc²/λ⁵) × 1/(exp(hc/λkT) - 1)
   *
   * @param {number} lambda - Wavelength (cm)
   * @param {number} T - Temperature (K)
   * @returns {number} Spectral radiance (erg/s/cm²/sr/cm)
   */
  function planckFunction(lambda, T) {
    if (!Number.isFinite(lambda) || lambda <= 0) return 0;
    if (!Number.isFinite(T) || T <= 0) return 0;

    const c = CONSTANTS.c;
    const h = CONSTANTS.h;
    const k = CONSTANTS.k;

    const factor1 = (2 * h * c * c) / Math.pow(lambda, 5);
    const exponent = (h * c) / (lambda * k * T);

    // Prevent overflow for very small wavelengths or low temperatures
    if (exponent > 700) return 0;

    return factor1 / (Math.exp(exponent) - 1);
  }
```

Update return statement:

```javascript
  return {
    CONSTANTS,
    wienPeakCm,
    wienPeakNm,
    planckFunction,
  };
```

**Step 4: Run tests to verify they pass**

Run: `node --test tests/blackbody-model.test.js`
Expected: 5 tests pass

**Step 5: Commit**

```bash
git add demos/_assets/blackbody-model.js tests/blackbody-model.test.js
git commit -m "feat(blackbody): add Planck function with overflow protection

planckFunction(lambda, T) returns spectral radiance in CGS.
Overflow protection at exp(700) for extreme conditions.

Verified: positive at Wien peak, increases with T, handles CMB to neutron stars."
```

---

## Task 4: Add Stefan-Boltzmann Functions with Tests

**Files:**
- Modify: `demos/_assets/blackbody-model.js`
- Modify: `tests/blackbody-model.test.js`

**Step 1: Write the failing tests**

Add to `tests/blackbody-model.test.js`:

```javascript
test('stefanBoltzmannFlux: Sun flux matches L☉/(4πR☉²)', () => {
  const flux = BlackbodyModel.stefanBoltzmannFlux(5772);
  // σT⁴ should equal L/(4πR²) for Sun
  // L☉ = 3.828e33 erg/s, R☉ = 6.957e10 cm
  // F = L/(4πR²) = 3.828e33 / (4π × (6.957e10)²) ≈ 6.29e10 erg/s/cm²
  const expected = 3.828e33 / (4 * Math.PI * Math.pow(6.957e10, 2));
  const relError = Math.abs(flux - expected) / expected;
  assert.ok(relError < 0.01, `expected ~${expected.toExponential(2)}, got ${flux.toExponential(2)}, error ${(relError*100).toFixed(1)}%`);
});

test('luminosityRatio: Sun at 5772 K has L/L☉ = 1', () => {
  const ratio = BlackbodyModel.luminosityRatio(5772);
  // (T/T☉)⁴ = 1 when T = T☉
  assert.ok(Math.abs(ratio - 1) < 0.001, `expected ~1, got ${ratio}`);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/blackbody-model.test.js`
Expected: 2 new failures

**Step 3: Write minimal implementation**

Add to `blackbody-model.js`:

```javascript
  // ============================================
  // Stefan-Boltzmann Law
  // ============================================

  /**
   * Stefan-Boltzmann flux: F = σT⁴
   * @param {number} T - Temperature (K)
   * @returns {number} Flux (erg/s/cm²)
   */
  function stefanBoltzmannFlux(T) {
    if (!Number.isFinite(T) || T <= 0) return 0;
    return CONSTANTS.sigma * Math.pow(T, 4);
  }

  /**
   * Luminosity relative to Sun (assuming same radius)
   * L/L☉ = (T/T☉)⁴
   * @param {number} T - Temperature (K)
   * @returns {number} Luminosity ratio
   */
  function luminosityRatio(T) {
    if (!Number.isFinite(T) || T <= 0) return 0;
    return Math.pow(T / CONSTANTS.T_sun, 4);
  }
```

Update return statement:

```javascript
  return {
    CONSTANTS,
    wienPeakCm,
    wienPeakNm,
    planckFunction,
    stefanBoltzmannFlux,
    luminosityRatio,
  };
```

**Step 4: Run tests to verify they pass**

Run: `node --test tests/blackbody-model.test.js`
Expected: 7 tests pass

**Step 5: Commit**

```bash
git add demos/_assets/blackbody-model.js tests/blackbody-model.test.js
git commit -m "feat(blackbody): add Stefan-Boltzmann functions

stefanBoltzmannFlux(T) - surface flux in CGS
luminosityRatio(T) - L/L☉ at same radius

Verified: Sun flux matches L☉/(4πR☉²), ratio=1 at T☉."
```

---

## Task 5: Add Temperature-to-Color with Tests (Consolidated)

**Files:**
- Modify: `demos/_assets/blackbody-model.js`
- Modify: `tests/blackbody-model.test.js`

**Step 1: Write the failing tests**

Add to `tests/blackbody-model.test.js`:

```javascript
test('temperatureToColor: hot stars are blue (high T → r < b)', () => {
  const color = BlackbodyModel.temperatureToColor(30000);
  assert.ok(color.b > color.r, `expected blue > red for 30000 K, got r=${color.r}, b=${color.b}`);
});

test('temperatureToColor: cool stars are red (low T → r > b)', () => {
  const color = BlackbodyModel.temperatureToColor(3000);
  assert.ok(color.r > color.b, `expected red > blue for 3000 K, got r=${color.r}, b=${color.b}`);
});

test('temperatureToColor: Sun is white-ish (all channels similar)', () => {
  const color = BlackbodyModel.temperatureToColor(5772);
  // Sun should be roughly white (all channels > 200)
  assert.ok(color.r > 200 && color.g > 200 && color.b > 200,
    `expected white-ish for Sun, got r=${color.r}, g=${color.g}, b=${color.b}`);
});
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/blackbody-model.test.js`
Expected: 3 new failures

**Step 3: Write minimal implementation**

Add to `blackbody-model.js`:

```javascript
  // ============================================
  // Temperature to Color (Perceptual Approximation)
  // ============================================

  /**
   * Convert temperature to approximate blackbody RGB color.
   * This is a perceptual approximation, not CIE colorimetry.
   *
   * @param {number} T - Temperature (K)
   * @returns {object} {r, g, b} values 0-255
   */
  function temperatureToColor(T) {
    if (!Number.isFinite(T) || T <= 0) {
      return { r: 0, g: 0, b: 0 };
    }

    let r, g, b;

    if (T < 1000) {
      // Very cold - dark red to invisible
      r = Math.min(255, T / 4);
      g = 0;
      b = 0;
    } else if (T < 4000) {
      // Red to orange
      r = 255;
      g = Math.min(255, (T - 1000) / 12);
      b = 0;
    } else if (T < 6500) {
      // Orange to white
      r = 255;
      g = Math.min(255, 180 + (T - 4000) / 35);
      b = Math.min(255, (T - 4000) / 10);
    } else if (T < 10000) {
      // White to blue-white
      r = Math.max(200, 255 - (T - 6500) / 30);
      g = Math.max(200, 255 - (T - 6500) / 50);
      b = 255;
    } else {
      // Blue-white to blue
      r = Math.max(150, 200 - (T - 10000) / 200);
      g = Math.max(180, 200 - (T - 10000) / 300);
      b = 255;
    }

    return {
      r: Math.round(Math.max(0, Math.min(255, r))),
      g: Math.round(Math.max(0, Math.min(255, g))),
      b: Math.round(Math.max(0, Math.min(255, b)))
    };
  }

  /**
   * Get descriptive color name from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Color name
   */
  function colorName(T) {
    if (!Number.isFinite(T) || T <= 0) return 'Unknown';
    if (T < 2000) return 'Infrared (invisible)';
    if (T < 3500) return 'Deep Red';
    if (T < 4500) return 'Orange-Red';
    if (T < 5500) return 'Yellow-Orange';
    if (T < 6500) return 'Yellow-White';
    if (T < 8000) return 'White';
    if (T < 12000) return 'Blue-White';
    return 'Blue';
  }

  /**
   * Get spectral class from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Spectral class (O, B, A, F, G, K, M, L+)
   */
  function spectralClass(T) {
    if (!Number.isFinite(T) || T <= 0) return 'Unknown';
    if (T >= 30000) return 'O';
    if (T >= 10000) return 'B';
    if (T >= 7500) return 'A';
    if (T >= 6000) return 'F';
    if (T >= 5200) return 'G';
    if (T >= 3700) return 'K';
    if (T >= 2400) return 'M';
    return 'L+';
  }
```

Update return statement:

```javascript
  return {
    CONSTANTS,
    wienPeakCm,
    wienPeakNm,
    planckFunction,
    stefanBoltzmannFlux,
    luminosityRatio,
    temperatureToColor,
    colorName,
    spectralClass,
  };
```

**Step 4: Run tests to verify they pass**

Run: `node --test tests/blackbody-model.test.js`
Expected: 10 tests pass

**Step 5: Commit**

```bash
git add demos/_assets/blackbody-model.js tests/blackbody-model.test.js
git commit -m "feat(blackbody): add temperature-to-color and spectral classification

temperatureToColor(T) - perceptual RGB approximation
colorName(T) - descriptive color name
spectralClass(T) - O/B/A/F/G/K/M/L+ classification

Verified: hot=blue, cool=red, Sun=white-ish."
```

---

## Task 6: Update blackbody.js to Use Model

**Files:**
- Modify: `demos/blackbody-radiation/blackbody.js`
- Modify: `demos/blackbody-radiation/index.html`

**Step 1: Add script tag to load model**

In `demos/blackbody-radiation/index.html`, add before `blackbody.js`:

```html
  <script src="../_assets/blackbody-model.js"></script>
  <script src="blackbody.js"></script>
```

**Step 2: Update blackbody.js to use BlackbodyModel**

Replace the CONSTANTS block (lines 18-33) with:

```javascript
  // Use shared model for physics
  const CONSTANTS = window.BlackbodyModel.CONSTANTS;
```

Replace the physics functions (lines 39-94) with:

```javascript
  // Physics functions from shared model
  const wienPeak = window.BlackbodyModel.wienPeakCm;
  const wienPeakNm = window.BlackbodyModel.wienPeakNm;
  const planckFunction = window.BlackbodyModel.planckFunction;
  const stefanBoltzmannFlux = window.BlackbodyModel.stefanBoltzmannFlux;
  const luminosityRatio = window.BlackbodyModel.luminosityRatio;
  const temperatureToColor = window.BlackbodyModel.temperatureToColor;
  const colorName = window.BlackbodyModel.colorName;
  const spectralClass = window.BlackbodyModel.spectralClass;
```

**Step 3: Test in browser**

Run: `conda run -n astro python -m http.server 8000 --bind 127.0.0.1`
Open: `http://127.0.0.1:8000/demos/blackbody-radiation/`
Expected: Demo works identically (manual verification)

**Step 4: Commit**

```bash
git add demos/blackbody-radiation/blackbody.js demos/blackbody-radiation/index.html
git commit -m "refactor(blackbody): use shared BlackbodyModel for physics

Removes embedded physics functions.
Loads blackbody-model.js for all radiation calculations.
UI code now focuses on rendering and interaction."
```

---

## Task 7: Remove Duplicate from stellar-utils.js

**Files:**
- Modify: `demos/_assets/stellar-utils.js`

**Step 1: Update stellar-utils.js to use BlackbodyModel**

The `temperatureToColor` function at lines 43-73 is now duplicated. Update `stellar-utils.js` to import from `BlackbodyModel` instead:

At the top of the IIFE (after 'use strict'), add:

```javascript
  // Use BlackbodyModel for temperature-to-color if available
  const getTemperatureToColor = () => {
    if (typeof BlackbodyModel !== 'undefined') {
      return BlackbodyModel.temperatureToColor;
    }
    // Fallback for standalone use (no blackbody-model.js loaded)
    return function(T) {
      // ... keep existing implementation as fallback
    };
  };
```

Actually, for simplicity, we'll document that `stellar-utils.js` requires `blackbody-model.js` to be loaded first, and just delegate:

```javascript
  // Temperature to RGB color - delegates to BlackbodyModel
  function temperatureToColor(T) {
    if (typeof BlackbodyModel !== 'undefined') {
      return BlackbodyModel.temperatureToColor(T);
    }
    // Fallback implementation for standalone use
    let r, g, b;
    // ... (keep existing implementation)
  }
```

**Step 2: Verify stellar-utils still works**

Run: `node -e "const S = require('./demos/_assets/stellar-utils.js'); console.log(S.temperatureToColor(5772))"`
Expected: Prints color object (uses fallback since BlackbodyModel not loaded in Node)

**Step 3: Commit**

```bash
git add demos/_assets/stellar-utils.js
git commit -m "refactor(stellar-utils): delegate temperatureToColor to BlackbodyModel

Avoids code duplication. Falls back to embedded implementation
if BlackbodyModel is not loaded (for standalone use)."
```

---

## Task 8: Run Full Test Suite and Verify

**Files:**
- All test files

**Step 1: Run complete model test suite**

Run: `node --test tests/blackbody-model.test.js tests/seasons-model.test.js tests/angular-size-model.test.js tests/moon-phases-model.test.js tests/eclipse-geometry-model.test.js`

Expected:
```
# tests 42
# pass 42
# fail 0
```

**Step 2: Run demo smoke tests**

Run: `node --test tests/demo-html-smoke.test.js`
Expected: All demos load

**Step 3: Manual browser verification**

Open blackbody demo and verify:
- Temperature slider works
- Spectrum updates
- Star color preview updates
- Presets work
- CMB mode works

**Step 4: Summary commit (optional)**

If all tests pass, the implementation is complete.

---

## Verification Checklist

After completing all tasks:

- [ ] `blackbody-model.js` created with UMD pattern
- [ ] Physical constants match IAU 2015 nominal values
- [ ] `wienPeakCm` and `wienPeakNm` tested (Sun peaks at 502 nm)
- [ ] `planckFunction` tested (positive at peak, handles extremes)
- [ ] `stefanBoltzmannFlux` tested (matches L☉/4πR☉²)
- [ ] `temperatureToColor` tested (hot=blue, cool=red, Sun=white)
- [ ] `blackbody.js` refactored to use model
- [ ] `stellar-utils.js` delegates to model (no duplication)
- [ ] All 42 model tests pass
- [ ] Demo smoke tests pass
- [ ] Browser verification complete
- [ ] 7 atomic commits created

---

## Test Count Summary

| File | Tests |
|------|-------|
| `blackbody-model.test.js` | 10 (new) |
| `seasons-model.test.js` | 7 |
| `angular-size-model.test.js` | 5 |
| `moon-phases-model.test.js` | 6 |
| `eclipse-geometry-model.test.js` | 14 |
| **Total** | **42** |

---

## Physical Constants Reference

| Constant | Symbol | Value | Unit | Source |
|----------|--------|-------|------|--------|
| Speed of light | c | 2.998e10 | cm/s | CODATA |
| Planck constant | h | 6.626e-27 | erg·s | CODATA |
| Boltzmann constant | k | 1.381e-16 | erg/K | CODATA |
| Stefan-Boltzmann | σ | 5.670e-5 | erg/cm²/s/K⁴ | CODATA |
| Wien constant | b | 0.2898 | cm·K | Derived |
| Solar temperature | T☉ | 5772 | K | IAU 2015 |
| Solar radius | R☉ | 6.957e10 | cm | IAU 2015 |
| Solar luminosity | L☉ | 3.828e33 | erg/s | IAU 2015 |

# Demos DRY Consolidation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate DRY violations in the demos suite by consolidating duplicated constants and functions to single sources of truth.

**Architecture:** Extend `astro-constants.js` to include distance presets (AU, LY, PC in km) and celestial body data. Update all demos to import from the single source. Remove duplicate formatting functions from `angular-size.js`.

**Tech Stack:** JavaScript (ES5 UMD modules), Node.js `node:test` for testing

---

## Prerequisites

- All tests currently pass: `for f in tests/*.test.js; do node "$f"; done`
- Working directory: `/Users/anna/Teaching/astr101-sp26`

---

## Phase 1: Extend AstroConstants with Distance Presets

### Task 1: Add Distance Constants to astro-constants.js

**Files:**
- Modify: `demos/_assets/physics/astro-constants.js:62-77`
- Test: `tests/astro-constants.test.js`

**Step 1: Write the failing test**

Add to `tests/astro-constants.test.js`:

```javascript
test('AstroConstants exposes distance presets (AU, LY, PC in km)', () => {
  assert.equal(AstroConstants.LENGTH.KM_PER_AU, 149597870.7);
  assert.ok(Math.abs(AstroConstants.LENGTH.KM_PER_LY - 9.461e12) / 9.461e12 < 0.001);
  assert.ok(Math.abs(AstroConstants.LENGTH.KM_PER_PC - 3.086e13) / 3.086e13 < 0.001);
});
```

**Step 2: Run test to verify it fails**

Run: `node tests/astro-constants.test.js`
Expected: FAIL with `Cannot read properties of undefined (reading 'KM_PER_LY')`

**Step 3: Write minimal implementation**

In `demos/_assets/physics/astro-constants.js`, modify the LENGTH object (around line 66-77):

```javascript
  const LENGTH = {
    CM_PER_M: 100,
    M_PER_KM: 1000,
    CM_PER_KM: 100000,

    // IAU-defined AU value (km)
    KM_PER_AU: 149597870.7,

    // Derived distance scales (km)
    // Light-year: c * Julian year
    KM_PER_LY: 9.4607304725808e12,
    // Parsec: 1 AU / tan(1 arcsec)
    KM_PER_PC: 3.0856775814914e13,
  };
```

**Step 4: Run test to verify it passes**

Run: `node tests/astro-constants.test.js`
Expected: PASS (5 tests)

**Step 5: Commit**

```bash
git add demos/_assets/physics/astro-constants.js tests/astro-constants.test.js
git commit -m "feat(constants): add KM_PER_LY and KM_PER_PC distance presets

Extends single source of truth for distance conversions.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Add formatDistance to AstroUtils using constants

**Files:**
- Modify: `demos/_assets/astro-utils.js:65-83`
- Test: `tests/astro-utils-formatting.test.js` (new file)

**Step 1: Write the failing test**

Create `tests/astro-utils-formatting.test.js`:

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');

// Note: astro-utils.js loads AstroConstants as a dependency
// We need to load constants first for the browser-style global
global.AstroConstants = require('../demos/_assets/physics/astro-constants.js');
const AstroUtils = require('../demos/_assets/astro-utils.js');

test('formatDistance uses AstroConstants.LENGTH.KM_PER_AU', () => {
  // 1 AU should format as "1.00 AU"
  const result = AstroUtils.formatDistance(149597870.7);
  assert.equal(result.unit, 'AU');
  assert.ok(result.value.includes('1'));
});

test('formatDistance uses AstroConstants.LENGTH.KM_PER_LY', () => {
  // 1 light-year should format as "1.00 ly"
  const result = AstroUtils.formatDistance(9.4607304725808e12);
  assert.equal(result.unit, 'ly');
  assert.ok(result.value.includes('1'));
});

test('formatDistance uses AstroConstants.LENGTH.KM_PER_PC', () => {
  // 1 parsec should format as "1.00 pc"
  const result = AstroUtils.formatDistance(3.0856775814914e13);
  assert.equal(result.unit, 'pc');
  assert.ok(result.value.includes('1'));
});
```

**Step 2: Run test to verify behavior**

Run: `node tests/astro-utils-formatting.test.js`
Expected: Tests may pass or fail depending on current implementation; we need to verify the constants match.

**Step 3: Update formatDistance to use AstroConstants**

In `demos/_assets/astro-utils.js`, modify `formatDistance` (lines 65-83):

```javascript
/**
 * Format distance with appropriate units (km input)
 * Uses AstroConstants for single source of truth.
 */
function formatDistance(km) {
  // Use AstroConstants if available, otherwise fallback to hardcoded values
  const constants = (typeof AstroConstants !== 'undefined') ? AstroConstants.LENGTH : null;
  const AU = constants ? constants.KM_PER_AU : 149597870.7;
  const LY = constants ? constants.KM_PER_LY : 9.4607304725808e12;
  const PC = constants ? constants.KM_PER_PC : 3.0856775814914e13;

  if (km >= PC) {
    return { value: (km / PC).toPrecision(3), unit: 'pc' };
  } else if (km >= LY) {
    return { value: (km / LY).toPrecision(3), unit: 'ly' };
  } else if (km >= AU * 0.1) {
    return { value: (km / AU).toPrecision(3), unit: 'AU' };
  } else if (km >= 1e6) {
    return { value: formatScientific(km, 3), unit: 'km' };
  } else if (km >= 1) {
    return { value: km.toLocaleString(undefined, { maximumFractionDigits: 1 }), unit: 'km' };
  } else {
    return { value: (km * 1000).toFixed(1), unit: 'm' };
  }
}
```

**Step 4: Run test to verify it passes**

Run: `node tests/astro-utils-formatting.test.js`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add demos/_assets/astro-utils.js tests/astro-utils-formatting.test.js
git commit -m "refactor(astro-utils): use AstroConstants for distance formatting

formatDistance now uses single source of truth for AU/LY/PC.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: Remove Duplicate Functions from angular-size.js

### Task 3: Remove duplicate formatDistance from angular-size.js

**Files:**
- Modify: `demos/angular-size/angular-size.js:205-232`
- Modify: `demos/angular-size/index.html` (ensure astro-utils.js is loaded)
- Test: Manual browser test

**Step 1: Verify astro-utils.js is loaded in index.html**

Read `demos/angular-size/index.html` and confirm this script tag exists:
```html
<script src="../_assets/astro-utils.js"></script>
```

If missing, add it before the demo's own script.

**Step 2: Remove duplicate formatDistance function**

In `demos/angular-size/angular-size.js`, delete lines 205-232 (the local `formatDistance` function).

The function currently looks like:
```javascript
  function formatDistance(km) {
    const AU = 1.496e8;
    const LY = 9.461e12;
    // ... rest of duplicate implementation
  }
```

Delete this entire function.

**Step 3: Update calls to use global AstroUtils.formatDistance**

Search for calls to `formatDistance(` in the file and prefix with `AstroUtils.`:

```javascript
// Before:
const formatted = formatDistance(distanceKm);

// After:
const formatted = AstroUtils.formatDistance(distanceKm);
```

**Step 4: Test in browser**

Open `demos/angular-size/index.html` in browser.
Verify: Distance formatting still works correctly for all presets.

**Step 5: Commit**

```bash
git add demos/angular-size/angular-size.js demos/angular-size/index.html
git commit -m "refactor(angular-size): use shared formatDistance from AstroUtils

Removes duplicate function, uses single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Remove duplicate formatAngle from angular-size.js

**Files:**
- Modify: `demos/angular-size/angular-size.js:234-242`

**Step 1: Remove duplicate formatAngle function**

In `demos/angular-size/angular-size.js`, delete lines 234-242 (the local `formatAngle` function).

The function currently looks like:
```javascript
  function formatAngle(degrees) {
    if (degrees >= 1) {
      return { value: degrees.toFixed(2), unit: 'degrees' };
    }
    // ... rest of duplicate
  }
```

Delete this entire function.

**Step 2: Update calls to use global AstroUtils.formatAngle**

Search for calls to `formatAngle(` in the file and prefix with `AstroUtils.`:

```javascript
// Before:
const formatted = formatAngle(angleDeg);

// After:
const formatted = AstroUtils.formatAngle(angleDeg);
```

Note: The units returned by AstroUtils.formatAngle are `°`, `'`, `"` (symbols) rather than `degrees`, `arcminutes`, `arcseconds` (words). If the demo relies on the word-form units, you may need to keep the local version or create a wrapper.

**Step 3: Test in browser**

Open `demos/angular-size/index.html` in browser.
Verify: Angle formatting still displays correctly.

**Step 4: Commit**

```bash
git add demos/angular-size/angular-size.js
git commit -m "refactor(angular-size): use shared formatAngle from AstroUtils

Removes duplicate function, uses single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: Consolidate Tropical Year Constants

### Task 5: Update seasons-model.js to use AstroConstants

**Files:**
- Modify: `demos/_assets/seasons-model.js:53, 85, 98`
- Test: `tests/seasons-model.test.js`

**Step 1: Write the failing test**

Add to `tests/seasons-model.test.js`:

```javascript
test('SeasonsModel uses MEAN_TROPICAL_YEAR_DAYS from AstroConstants', () => {
  // Verify the model produces consistent results with the constant
  const AstroConstants = require('../demos/_assets/physics/astro-constants.js');
  const result = SeasonsModel.solarDeclination({ dayOfYear: 172 }); // ~summer solstice
  assert.ok(Math.abs(result) > 20, 'Declination at solstice should be > 20°');
});
```

**Step 2: Run test to verify current behavior**

Run: `node tests/seasons-model.test.js`
Expected: PASS (test verifies current behavior works)

**Step 3: Update seasons-model.js to import AstroConstants**

At the top of `demos/_assets/seasons-model.js`, the UMD factory should accept AstroConstants:

```javascript
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./physics/astro-constants.js'));
  } else {
    root.SeasonsModel = factory(root.AstroConstants);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants) {
  'use strict';

  const TROPICAL_YEAR_DAYS = AstroConstants
    ? AstroConstants.TIME.MEAN_TROPICAL_YEAR_DAYS
    : 365.2422;
```

**Step 4: Replace hardcoded 365.2422 with TROPICAL_YEAR_DAYS**

In the file, find all instances of `tropicalYearDays = 365.2422` and `yearDays = 365.2422` in default parameters and replace with `TROPICAL_YEAR_DAYS`:

```javascript
// Line ~53: change default parameter
function solarDeclination({
  dayOfYear,
  axialTiltDeg = 23.44,
  tropicalYearDays = TROPICAL_YEAR_DAYS,  // was 365.2422
})

// Line ~85: change default parameter
function earthSunDistanceAu({
  dayOfYear,
  eccentricity = 0.0167,
  perihelionDay = 3,
  yearDays = TROPICAL_YEAR_DAYS,  // was 365.2422
})

// Line ~98: change default parameter
function eclipticLongitudeDeg({
  dayOfYear,
  perihelionDay = 3,
  yearDays = TROPICAL_YEAR_DAYS,  // was 365.2422
})
```

**Step 5: Run test to verify it still passes**

Run: `node tests/seasons-model.test.js`
Expected: PASS

**Step 6: Commit**

```bash
git add demos/_assets/seasons-model.js tests/seasons-model.test.js
git commit -m "refactor(seasons-model): use AstroConstants.MEAN_TROPICAL_YEAR_DAYS

Consolidates tropical year to single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Update seasons.js to use AstroConstants

**Files:**
- Modify: `demos/seasons/seasons.js:22`
- Modify: `demos/seasons/index.html` (ensure astro-constants.js is loaded)

**Step 1: Verify astro-constants.js is loaded in index.html**

Read `demos/seasons/index.html` and confirm this script tag exists before seasons.js:
```html
<script src="../_assets/physics/astro-constants.js"></script>
```

If missing, add it.

**Step 2: Update seasons.js to use AstroConstants**

In `demos/seasons/seasons.js`, change line 22:

```javascript
// Before:
const TROPICAL_YEAR_DAYS = 365.2422;

// After:
const TROPICAL_YEAR_DAYS = AstroConstants.TIME.MEAN_TROPICAL_YEAR_DAYS;
```

**Step 3: Test in browser**

Open `demos/seasons/index.html` in browser.
Verify: Animation and calculations work correctly.

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js demos/seasons/index.html
git commit -m "refactor(seasons): use AstroConstants.MEAN_TROPICAL_YEAR_DAYS

Consolidates tropical year to single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: Consolidate Synodic Month Constants

### Task 7: Update eclipse-geometry-model.js to use AstroConstants

**Files:**
- Modify: `demos/_assets/eclipse-geometry-model.js:33`
- Test: `tests/eclipse-geometry-model.test.js`

**Step 1: Verify current test passes**

Run: `node tests/eclipse-geometry-model.test.js`
Expected: PASS

**Step 2: Update eclipse-geometry-model.js**

At line 33, change:

```javascript
// Before:
const SYNODIC_MONTH_DAYS = 29.530588;

// After (inside factory function):
const SYNODIC_MONTH_DAYS = AstroConstants
  ? AstroConstants.TIME.MEAN_SYNODIC_MONTH_DAYS
  : 29.530588;
```

Also update the UMD wrapper to accept AstroConstants:

```javascript
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./physics/astro-constants.js'));
  } else {
    root.EclipseGeometryModel = factory(root.AstroConstants);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants) {
```

**Step 3: Run test to verify it still passes**

Run: `node tests/eclipse-geometry-model.test.js`
Expected: PASS

**Step 4: Commit**

```bash
git add demos/_assets/eclipse-geometry-model.js
git commit -m "refactor(eclipse-geometry-model): use AstroConstants.MEAN_SYNODIC_MONTH_DAYS

Consolidates synodic month to single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Update eclipse-geometry.js to use AstroConstants

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js:21-25`
- Modify: `demos/eclipse-geometry/index.html`

**Step 1: Verify astro-constants.js is loaded in index.html**

Ensure this script tag exists:
```html
<script src="../_assets/physics/astro-constants.js"></script>
```

**Step 2: Update eclipse-geometry.js**

Change lines 21-25:

```javascript
// Before:
const DAYS_PER_TROPICAL_YEAR = 365.2422;
const JULIAN_YEAR_DAYS = 365.25;
const SIDEREAL_MONTH_DAYS = 27.321661;
const SYNODIC_MONTH_DAYS = 29.530588;
const NODE_REGRESSION_YEARS = 18.61;

// After:
const DAYS_PER_TROPICAL_YEAR = AstroConstants.TIME.MEAN_TROPICAL_YEAR_DAYS;
const JULIAN_YEAR_DAYS = AstroConstants.TIME.JULIAN_YEAR_S / AstroConstants.TIME.DAY_S;
const SIDEREAL_MONTH_DAYS = AstroConstants.TIME.MEAN_SIDEREAL_MONTH_DAYS;
const SYNODIC_MONTH_DAYS = AstroConstants.TIME.MEAN_SYNODIC_MONTH_DAYS;
const NODE_REGRESSION_YEARS = AstroConstants.TIME.MEAN_NODE_REGRESSION_JULIAN_YEARS;
```

**Step 3: Test in browser**

Open `demos/eclipse-geometry/index.html` in browser.
Verify: All eclipse calculations work correctly.

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js demos/eclipse-geometry/index.html
git commit -m "refactor(eclipse-geometry): use AstroConstants for all time scales

Consolidates tropical year, synodic/sidereal months, node regression.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: Consolidate AU Constants in Remaining Files

### Task 9: Update stellar-utils.js to use AstroConstants

**Files:**
- Modify: `demos/_assets/stellar-utils.js:111`

**Step 1: Update stellar-utils.js UMD wrapper**

Ensure the factory accepts AstroConstants:

```javascript
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(
      require('./physics/astro-constants.js'),
      require('./blackbody-model.js')
    );
  } else {
    root.StellarUtils = factory(root.AstroConstants, root.BlackbodyModel);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants, BlackbodyModel) {
```

**Step 2: Replace hardcoded AU value**

In the UNIT_CONVERSIONS object (around line 111):

```javascript
// Before:
'km': { factor: 1.496e8, label: 'km' },

// After:
'km': { factor: AstroConstants ? AstroConstants.LENGTH.KM_PER_AU : 1.496e8, label: 'km' },
```

**Step 3: Test existing tests**

Run: `for f in tests/*.test.js; do node "$f"; done`
Expected: All tests PASS

**Step 4: Commit**

```bash
git add demos/_assets/stellar-utils.js
git commit -m "refactor(stellar-utils): use AstroConstants.KM_PER_AU

Consolidates AU to single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Update angular-size-model.js preset to use AstroConstants

**Files:**
- Modify: `demos/_assets/angular-size-model.js:49`
- Test: `tests/angular-size-model.test.js`

**Step 1: Verify current test passes**

Run: `node tests/angular-size-model.test.js`
Expected: PASS

**Step 2: Update angular-size-model.js**

Update the UMD wrapper to accept AstroConstants, then change line 49:

```javascript
// In presets object:
// Before:
distance: 1.496e8,  // km (1 AU)

// After:
distance: AstroConstants ? AstroConstants.LENGTH.KM_PER_AU : 149597870.7,
```

**Step 3: Run test to verify it still passes**

Run: `node tests/angular-size-model.test.js`
Expected: PASS

**Step 4: Commit**

```bash
git add demos/_assets/angular-size-model.js
git commit -m "refactor(angular-size-model): use AstroConstants.KM_PER_AU for Sun preset

Consolidates AU to single source of truth.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 6: Add degToRad/radToDeg Usage Guidance

### Task 11: Document angle conversion best practice

**Files:**
- Create: `demos/_assets/physics/README.md`

**Step 1: Create documentation file**

Create `demos/_assets/physics/README.md`:

```markdown
# Physics Module

Single source of truth for astronomical constants and unit conversions.

## Files

- `astro-constants.js` - Definitional constants (time scales, lengths, gravity)
- `units.js` - Unit conversion helpers
- `two-body-analytic.js` - Orbital mechanics functions

## Usage

### Loading Order (Browser)

```html
<script src="_assets/physics/astro-constants.js"></script>
<script src="_assets/physics/units.js"></script>
<script src="_assets/physics/two-body-analytic.js"></script>
```

### Angle Conversions

**Always use `AstroUnits.degToRad()` and `AstroUnits.radToDeg()`** instead of inline `* Math.PI / 180`:

```javascript
// Good:
const radians = AstroUnits.degToRad(angleDeg);
const degrees = AstroUnits.radToDeg(angleRad);

// Avoid:
const radians = angleDeg * Math.PI / 180;  // Duplicates conversion logic
```

### Distance Constants

Use `AstroConstants.LENGTH` for all astronomical distances:

```javascript
const AU = AstroConstants.LENGTH.KM_PER_AU;   // 149597870.7 km
const LY = AstroConstants.LENGTH.KM_PER_LY;   // 9.461e12 km
const PC = AstroConstants.LENGTH.KM_PER_PC;   // 3.086e13 km
```

### Time Scales

Use `AstroConstants.TIME` for all astronomical time scales:

```javascript
const tropicalYear = AstroConstants.TIME.MEAN_TROPICAL_YEAR_DAYS;  // 365.2422
const synodicMonth = AstroConstants.TIME.MEAN_SYNODIC_MONTH_DAYS;  // 29.530588
const siderealMonth = AstroConstants.TIME.MEAN_SIDEREAL_MONTH_DAYS; // 27.321661
```
```

**Step 2: Commit**

```bash
git add demos/_assets/physics/README.md
git commit -m "docs(physics): add README with usage guidelines

Documents single source of truth pattern for constants and conversions.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 7: Final Verification

### Task 12: Run all tests and verify demos

**Step 1: Run all tests**

```bash
for f in tests/*.test.js; do echo "=== $f ==="; node "$f"; done
```

Expected: All tests PASS

**Step 2: Spot-check demos in browser**

Open each demo and verify functionality:
- `demos/angular-size/index.html` - Distance and angle formatting work
- `demos/seasons/index.html` - Animation runs correctly
- `demos/eclipse-geometry/index.html` - Eclipse calculations work
- `demos/binary-orbits/index.html` - Orbital mechanics work

**Step 3: Final commit (if any fixes needed)**

```bash
git status
# If clean, no commit needed
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `_assets/physics/astro-constants.js` | Add KM_PER_LY, KM_PER_PC |
| `_assets/astro-utils.js` | Use AstroConstants in formatDistance |
| `angular-size/angular-size.js` | Remove duplicate formatDistance, formatAngle |
| `_assets/seasons-model.js` | Use AstroConstants.MEAN_TROPICAL_YEAR_DAYS |
| `seasons/seasons.js` | Use AstroConstants.MEAN_TROPICAL_YEAR_DAYS |
| `_assets/eclipse-geometry-model.js` | Use AstroConstants.MEAN_SYNODIC_MONTH_DAYS |
| `eclipse-geometry/eclipse-geometry.js` | Use AstroConstants for all time scales |
| `_assets/stellar-utils.js` | Use AstroConstants.KM_PER_AU |
| `_assets/angular-size-model.js` | Use AstroConstants.KM_PER_AU |
| `_assets/physics/README.md` | New documentation |
| `tests/astro-constants.test.js` | New test for distance presets |
| `tests/astro-utils-formatting.test.js` | New test for formatDistance |

---

## Estimated Commits

12 commits total (one per task)

## DRY Violations Fixed

- [x] AU constant (1.496e8 / 149597870.7) - consolidated to AstroConstants
- [x] Tropical year (365.2422) - consolidated to AstroConstants
- [x] Synodic month (29.530588) - consolidated to AstroConstants
- [x] formatDistance() duplicate - removed from angular-size.js
- [x] formatAngle() duplicate - removed from angular-size.js
- [ ] Math.PI/180 patterns - documented best practice (full refactor deferred)

# Kepler's Laws Demo Audit

**Date:** 2026-01-28
**Status:** Critical bugs identified
**Demo:** `demos/keplers-laws/`

---

## Executive Summary

The Kepler's Laws demo has a **critical geometry bug** that causes planet position and overlays to become misaligned when eccentricity or semi-major axis parameters change. Additionally, mathematical formulas use Unicode characters instead of proper KaTeX rendering, and the UI needs modernization to match other demos.

---

## Critical Issues

### 1. Geometry Bug: Wrong Theta Direction Convention

**Severity:** Critical
**File:** `keplers-laws.js` lines 307-322
**Symptom:** Planet position doesn't match orbit when e or a change

**Root Cause:** In `orbitalToSvg()`, the planet is placed at:
```javascript
x: SVG_CENTER.x + r * Math.cos(theta) * scale
```

But θ=0 (perihelion) should place the planet at the **left** side of the orbit (closest to star), not the right. The coordinate system assumes θ=0 points right (+x), but in orbital mechanics with the star at the left focus, perihelion is in the −x direction.

**Evidence:**
- At θ=0 for Earth (a=1, e=0.017): planet placed at x≈447, but perihelion marker at x≈153
- Planet and perihelion marker are on opposite sides of the star (x=300)

**Fix:**
```javascript
const x_orb = -r * Math.cos(theta);  // Negate to match perihelion direction
```

### 2. Focus Offset Calculated But Not Used

**Severity:** Medium
**File:** `keplers-laws.js` line 309

```javascript
function orbitalToSvg(r, theta) {
  const c = focusOffset(state.a, state.e);  // CALCULATED BUT NEVER USED
  // ...
}
```

This dead code is confusing. Either use it or remove it.

---

## Math Rendering Issues

### 3. No KaTeX Integration

**Severity:** Medium
**Files:** `index.html`, `keplers-laws.js`

The demo uses Unicode approximations instead of proper LaTeX:
- `P² = a³` instead of `$P^2 = a^3$`
- `F = GMm/r²` instead of `$F = \frac{GMm}{r^2}$`
- `v = √(GM(2/r - 1/a))` instead of `$v = \sqrt{GM\left(\frac{2}{r} - \frac{1}{a}\right)}$`

**Other demos include KaTeX:**
- `blackbody-radiation/index.html` line 8: `<link rel="stylesheet" href="../_assets/katex/katex.min.css">`
- Uses `katex.render()` or `data-math` attributes with `renderAllMath()`

**Missing from keplers-laws:**
1. KaTeX CSS link
2. KaTeX JS script
3. Proper LaTeX markup in HTML
4. `renderAllMath()` call or direct `katex.render()` calls

### 4. Formula Display Uses Plain Text

**Severity:** Low
**File:** `index.html` lines 419, 428-433

```html
<p class="formula">Law 3: P² = a³ (years, AU)</p>
<p class="formula">F = GMm/r²</p>
```

The `.formula` class just applies monospace font. Should use KaTeX spans.

---

## UI/UX Issues

### 5. Insight Box Equations Need KaTeX

**Location:** Kepler mode (Law 3) and Newton mode (vis-viva, acceleration)

Current:
```html
<p class="formula">Law 3: P² = a³ (years, AU)</p>
```

Should be:
```html
<p class="formula">Law 3: <span data-math="P^2 = a^3" data-math-display></span> (years, AU)</p>
```

### 6. Dynamic Newton Values Are Plain Text

**File:** `keplers-laws.js` lines 528-531

```javascript
elements.newtonValues.innerHTML =
  `v = √(GM(2/r - 1/a)) = ${v.toPrecision(3)} km/s<br>` +
  `a = GM/r² = ${acc.toPrecision(3)} m/s²`;
```

Should use `katex.render()` for the equation parts.

### 7. Missing Loading State

When switching between extreme orbits (e.g., Earth → Pluto), there's no visual feedback during the transition.

### 8. Slider Value Display Precision

Semi-major axis shows fixed 2 decimals (`1.00 AU`) even for large values where this is excessive precision (e.g., `39.48 AU` for Pluto is fine, but intermediate values show spurious precision).

---

## Recommended Fixes

### Phase 1: Critical Bug Fix

1. Fix `orbitalToSvg()` theta direction:
   ```javascript
   function orbitalToSvg(r, theta) {
     const scale = SVG_SCALE / Math.max(state.a, 1);
     // theta=0 is perihelion, which points in -x direction (toward left)
     const x_orb = -r * Math.cos(theta);
     const y_orb = r * Math.sin(theta);
     return {
       x: SVG_CENTER.x + x_orb * scale,
       y: SVG_CENTER.y - y_orb * scale
     };
   }
   ```

2. Remove unused `c` calculation or add comment explaining why it's not needed

### Phase 2: KaTeX Integration

1. Add to `<head>`:
   ```html
   <link rel="stylesheet" href="../_assets/katex/katex.min.css">
   ```

2. Add before closing `</body>`:
   ```html
   <script src="../_assets/katex/katex.min.js"></script>
   ```

3. Convert formulas to KaTeX spans with `data-math` attributes

4. Call `AstroUtils.renderAllMath()` or use individual `katex.render()` calls

5. Update dynamic Newton values to use KaTeX

### Phase 3: UI Polish

1. Add transition animations for orbit changes
2. Improve slider value formatting (adaptive precision)
3. Add visual pulse/highlight when parameters change significantly

---

## Test Plan

After fixes, verify:

1. **Geometry correctness:**
   - [ ] Planet at θ=0 overlaps perihelion marker
   - [ ] Planet at θ=π overlaps aphelion marker
   - [ ] Equal areas wedge draws correctly
   - [ ] Changing e from 0 to 0.9 keeps planet on orbit path
   - [ ] Changing a from 1 to 40 AU scales correctly

2. **KaTeX rendering:**
   - [ ] All formulas render as proper math (fractions, exponents, roots)
   - [ ] Dynamic Newton values update with proper formatting
   - [ ] No Unicode fallback characters visible

3. **Cross-browser:**
   - [ ] Chrome, Firefox, Safari render identically
   - [ ] Touch interactions work on mobile

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add KaTeX CSS/JS, convert formulas to data-math |
| `keplers-laws.js` | Fix `orbitalToSvg()`, add KaTeX rendering for dynamic values |
| `keplers-laws.css` | (minor) adjust formula styling if needed |

---

## Priority

1. **P0 (Critical):** Fix geometry bug - demo is currently broken
2. **P1 (High):** Add KaTeX rendering - consistency with other demos
3. **P2 (Medium):** UI polish - nice to have

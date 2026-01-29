# Kepler's Laws Demo Production-Ready Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical geometry bugs, add proper KaTeX math rendering, and polish UI to make the Kepler's Laws demo production-ready for students.

**Architecture:** Fix the orbital coordinate system bug, integrate KaTeX following the established pattern (CSS in head, JS before demo script, use `data-math` attributes + `AstroUtils.renderAllMath()`), and improve dynamic value displays.

**Tech Stack:** Vanilla JS, SVG, KaTeX, existing `astro-utils.js` helpers

---

## Pre-Flight Checklist

Before starting, verify:
```bash
# Confirm KaTeX assets exist
ls demos/_assets/katex/katex.min.{css,js}

# Confirm demo loads without JS errors
python -m http.server 8000 --bind 127.0.0.1 &
# Open http://127.0.0.1:8000/demos/keplers-laws/
```

---

## Task 1: Fix Critical Geometry Bug in orbitalToSvg()

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js:307-322`

**Problem:** Planet at θ=0 (perihelion) renders on the wrong side of the star. The x-coordinate should be negative at perihelion, not positive.

**Step 1: Locate the bug**

Open `demos/keplers-laws/keplers-laws.js` and find the `orbitalToSvg` function (around line 307).

Current code:
```javascript
function orbitalToSvg(r, theta) {
  // Calculate focus offset for star position
  const c = focusOffset(state.a, state.e);
  // Scale factor: shrink large orbits, expand small ones
  const scale = SVG_SCALE / Math.max(state.a, 1);

  // Orbital position relative to ellipse center
  const x_orb = r * Math.cos(theta);
  const y_orb = r * Math.sin(theta);

  // SVG coordinates (star at focus, which is offset from center)
  return {
    x: SVG_CENTER.x + (x_orb) * scale,
    y: SVG_CENTER.y - (y_orb) * scale  // Flip y for SVG
  };
}
```

**Step 2: Apply the fix**

Replace the function with:
```javascript
/**
 * Convert orbital coordinates to SVG coordinates
 * Origin at star (focus), theta=0 points toward perihelion (left/-x)
 * @param {number} r - Orbital radius (AU)
 * @param {number} theta - True anomaly (radians), 0 = perihelion
 * @returns {{x: number, y: number}} SVG coordinates
 */
function orbitalToSvg(r, theta) {
  // Scale factor: shrink large orbits, expand small ones
  const scale = SVG_SCALE / Math.max(state.a, 1);

  // Orbital position from focus (star)
  // theta=0 is perihelion, which points in -x direction (left of star)
  // theta=π is aphelion, which points in +x direction (right of star)
  const x_orb = -r * Math.cos(theta);
  const y_orb = r * Math.sin(theta);

  return {
    x: SVG_CENTER.x + x_orb * scale,
    y: SVG_CENTER.y - y_orb * scale  // Flip y for SVG (y increases downward)
  };
}
```

**Step 3: Test the fix manually**

```bash
# Serve the demo
cd /Users/anna/Teaching/astr101-sp26
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/demos/keplers-laws/` and verify:
- [ ] Planet at θ=0 overlaps the perihelion marker (left side)
- [ ] Planet at θ=π overlaps the aphelion marker (right side)
- [ ] Change eccentricity to 0.9 — planet stays on orbit path
- [ ] Change semi-major axis — planet, orbit, and markers scale together
- [ ] Equal areas wedge draws correctly when enabled

**Step 4: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "fix(keplers-laws): correct theta direction in orbitalToSvg

Planet at theta=0 (perihelion) was placed on wrong side of star.
The -x direction corresponds to perihelion, +x to aphelion."
```

---

## Task 2: Add KaTeX CSS to HTML Head

**Files:**
- Modify: `demos/keplers-laws/index.html:8` (after astro-theme.css)

**Step 1: Add the KaTeX stylesheet**

Open `demos/keplers-laws/index.html` and find line 8 (after `<link rel="stylesheet" href="../_assets/astro-theme.css">`).

Add immediately after:
```html
  <link rel="stylesheet" href="../_assets/katex/katex.min.css">
```

The head section should now look like:
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kepler's Laws Sandbox | AstroEd</title>
  <link rel="stylesheet" href="../_assets/astro-theme.css">
  <link rel="stylesheet" href="../_assets/katex/katex.min.css">
  <style>
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/index.html
git commit -m "chore(keplers-laws): add KaTeX CSS"
```

---

## Task 3: Add KaTeX JS Before Demo Script

**Files:**
- Modify: `demos/keplers-laws/index.html` (before line 446, the keplers-laws.js script)

**Step 1: Add the KaTeX script**

Find the script section near the end of the file (around line 443-447):
```html
  <script src="../_assets/astro-utils.js"></script>
  <script src="../_assets/demo-polish.js"></script>
  <script src="../_assets/starfield.js"></script>
  <script src="keplers-laws.js"></script>
</body>
```

Insert the KaTeX script **before** `keplers-laws.js`:
```html
  <script src="../_assets/astro-utils.js"></script>
  <script src="../_assets/demo-polish.js"></script>
  <script src="../_assets/starfield.js"></script>
  <script src="../_assets/katex/katex.min.js"></script>
  <script src="keplers-laws.js"></script>
</body>
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/index.html
git commit -m "chore(keplers-laws): add KaTeX JS"
```

---

## Task 4: Convert Kepler Mode Formulas to KaTeX

**Files:**
- Modify: `demos/keplers-laws/index.html:413-436` (insight box)

**Step 1: Update Kepler content formulas**

Find the insight box (around line 413):
```html
<div class="insight-box kepler-mode" id="insight-box">
  <div class="kepler-content">
    <h4>Kepler's Laws (1609–1619)</h4>
    <p>Empirical patterns discovered from Tycho Brahe's observations:</p>
    <p><strong>Law 1:</strong> Planets orbit in <em>ellipses</em> with the Sun at one focus.</p>
    <p><strong>Law 2:</strong> A line from Sun to planet sweeps <em>equal areas in equal times</em>.</p>
    <p class="formula">Law 3: P² = a³ (years, AU)</p>
```

Replace with:
```html
      <div class="insight-box kepler-mode" id="insight-box">
        <div class="kepler-content">
          <h4>Kepler's Laws (1609–1619)</h4>
          <p>Empirical patterns discovered from Tycho Brahe's observations:</p>
          <p><strong>Law 1:</strong> Planets orbit in <em>ellipses</em> with the Sun at one focus.</p>
          <p><strong>Law 2:</strong> A line from Sun to planet sweeps <em>equal areas in equal times</em>.</p>
          <p class="formula">Law 3: <span data-math="P^2 = a^3"></span> (years, AU)</p>
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/index.html
git commit -m "feat(keplers-laws): convert Kepler Law 3 to KaTeX"
```

---

## Task 5: Convert Newton Mode Static Formulas to KaTeX

**Files:**
- Modify: `demos/keplers-laws/index.html:425-435` (Newton content in insight box)

**Step 1: Update Newton content formulas**

Find the Newton content section:
```html
        <div class="newton-content" style="display: none;">
          <h4>Newton's Insight (1687)</h4>
          <p>One law explains all three of Kepler's patterns:</p>
          <p class="formula">F = GMm/r²</p>
```

Replace with:
```html
        <div class="newton-content" style="display: none;">
          <h4>Newton's Insight (1687)</h4>
          <p>One law explains all three of Kepler's patterns:</p>
          <p class="formula"><span data-math="F = \frac{GMm}{r^2}" data-math-display></span></p>
          <p>Gravity weakens with distance squared. This single force law <em>mathematically implies</em> all of Kepler's empirical laws!</p>
          <p style="margin-top: 0.75rem;"><strong>Current values:</strong></p>
          <div class="formula" id="newton-values">
            <div id="newton-velocity-formula"></div>
            <div id="newton-accel-formula"></div>
          </div>
        </div>
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/index.html
git commit -m "feat(keplers-laws): convert Newton formulas to KaTeX containers"
```

---

## Task 6: Add KaTeX Initialization to JS

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js` (init function, around line 1063)

**Step 1: Add renderAllMath call to init()**

Find the `init()` function (around line 1063):
```javascript
  function init() {
    initElements();
    setupSliders();
    setupPresets();
    ...
    update();
    console.log('Kepler\'s Laws Sandbox initialized');
  }
```

Add the KaTeX initialization after `initElements()`:
```javascript
  function init() {
    initElements();

    // Initialize KaTeX for static formulas
    if (window.AstroUtils && window.AstroUtils.renderAllMath) {
      AstroUtils.renderAllMath();
    }

    setupSliders();
    setupPresets();
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "feat(keplers-laws): initialize KaTeX on page load"
```

---

## Task 7: Update Dynamic Newton Values with KaTeX

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js:527-532` (updateReadouts function)

**Step 1: Add element references for new formula containers**

Find the `initElements()` function and add to the elements object (after `newtonValues`):
```javascript
      newtonValues: document.getElementById('newton-values'),
      newtonVelocityFormula: document.getElementById('newton-velocity-formula'),
      newtonAccelFormula: document.getElementById('newton-accel-formula'),
```

**Step 2: Update the Newton values rendering**

Find the Newton mode update section in `updateReadouts()` (around line 527):
```javascript
    // Update Newton mode values in insight box
    if (state.mode === 'newton') {
      elements.newtonValues.innerHTML =
        `v = √(GM(2/r - 1/a)) = ${v.toPrecision(3)} km/s<br>` +
        `a = GM/r² = ${acc.toPrecision(3)} m/s²`;
    }
```

Replace with:
```javascript
    // Update Newton mode values in insight box with KaTeX
    if (state.mode === 'newton' && window.katex) {
      katex.render(
        `v = \\sqrt{GM\\left(\\frac{2}{r} - \\frac{1}{a}\\right)} = ${v.toPrecision(3)}\\text{ km/s}`,
        elements.newtonVelocityFormula,
        { displayMode: false, throwOnError: false }
      );
      katex.render(
        `a = \\frac{GM}{r^2} = ${acc.toPrecision(3)}\\text{ m/s}^2`,
        elements.newtonAccelFormula,
        { displayMode: false, throwOnError: false }
      );
    }
```

**Step 3: Test Newton mode**

Open demo, switch to Newton Mode:
- [ ] Main formula shows as proper fraction
- [ ] Dynamic velocity formula updates with values
- [ ] Dynamic acceleration formula updates with values
- [ ] Dragging planet updates formulas smoothly

**Step 4: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js demos/keplers-laws/index.html
git commit -m "feat(keplers-laws): render dynamic Newton values with KaTeX"
```

---

## Task 8: Style Formula Containers for KaTeX

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.css` (formula styling)

**Step 1: Update formula styling for KaTeX**

Find the `.formula` class in the CSS (around line 162-166) or in the inline styles.

Add/update:
```css
/* Formula styling for KaTeX */
.insight-box .formula {
  margin: var(--space-sm) 0;
  padding: var(--space-sm) 0;
}

.insight-box .formula .katex {
  font-size: 1.1em;
  color: var(--cosmic-teal);
}

#newton-values {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

#newton-velocity-formula,
#newton-accel-formula {
  color: var(--cosmic-teal);
}
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/keplers-laws.css
git commit -m "style(keplers-laws): add KaTeX formula styling"
```

---

## Task 9: Add Orbit Change Transition Animation

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.css`

**Step 1: Add transition to orbit path**

Add to CSS:
```css
/* Smooth transitions for orbit changes */
#orbit-path {
  transition: all 0.3s ease-out;
}

#planet {
  transition: r 0.2s ease-out;
}

.control-card {
  transition: opacity 0.2s ease;
}
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/keplers-laws.css
git commit -m "style(keplers-laws): add smooth transitions for orbit changes"
```

---

## Task 10: Improve Slider Value Display Precision

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js:549-553` (updateSliderDisplays)

**Step 1: Use adaptive precision for semi-major axis**

Find `updateSliderDisplays()`:
```javascript
  function updateSliderDisplays() {
    elements.aDisplay.textContent = `${state.a.toFixed(2)} AU`;
    elements.eDisplay.textContent = state.e.toFixed(3);
    elements.massDisplay.textContent = `${state.M.toFixed(1)} M☉`;
  }
```

Replace with:
```javascript
  /**
   * Update slider value displays with adaptive precision
   */
  function updateSliderDisplays() {
    // Semi-major axis: more precision for small values
    let aText;
    if (state.a < 1) {
      aText = `${state.a.toFixed(3)} AU`;
    } else if (state.a < 10) {
      aText = `${state.a.toFixed(2)} AU`;
    } else {
      aText = `${state.a.toFixed(1)} AU`;
    }
    elements.aDisplay.textContent = aText;

    elements.eDisplay.textContent = state.e.toFixed(3);
    elements.massDisplay.textContent = `${state.M.toFixed(1)} M☉`;
  }
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "fix(keplers-laws): use adaptive precision for semi-major axis display"
```

---

## Task 11: Final Integration Test

**Step 1: Full manual test**

```bash
cd /Users/anna/Teaching/astr101-sp26
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/demos/keplers-laws/` and verify:

**Geometry:**
- [ ] Planet at perihelion (Home key) is on LEFT side of star
- [ ] Planet at aphelion (End key) is on RIGHT side of star
- [ ] Changing e from 0 to 0.9: planet stays on orbit
- [ ] Changing a from 1 to 40: everything scales correctly
- [ ] Equal Areas wedge draws from star through correct sector
- [ ] Preset buttons (Mercury, Pluto, Halley) all work correctly

**KaTeX Formulas:**
- [ ] Kepler Law 3 shows P² = a³ with proper superscripts
- [ ] Newton mode: F = GMm/r² shows as proper fraction
- [ ] Dynamic velocity formula updates with real values
- [ ] Dynamic acceleration formula updates with real values
- [ ] No Unicode fallback characters (², ³, √) visible

**Animation:**
- [ ] Play/Pause works
- [ ] Speed control works
- [ ] Planet drag works
- [ ] Timeline scrubbing works
- [ ] Keyboard controls (arrows, Home, End, Space) work

**UI:**
- [ ] Mode toggle (Kepler/Newton) works
- [ ] Unit toggle (101/201) works
- [ ] Overlay toggles work
- [ ] No console errors

**Step 2: Final commit**

```bash
git add .
git commit -m "test(keplers-laws): verify all fixes working"
```

---

## Task 12: Update README

**Files:**
- Modify: `demos/keplers-laws/README.md`

**Step 1: Add math rendering note**

Add to the README after the "Key Formulas" section:
```markdown
## Math Rendering

All formulas use KaTeX for proper mathematical typesetting. The demo uses:
- `data-math` attributes for static formulas
- Direct `katex.render()` for dynamic values
- `AstroUtils.renderAllMath()` for initialization

LaTeX source for key formulas:
- Kepler's 3rd Law: `P^2 = a^3`
- Newton's Law: `F = \frac{GMm}{r^2}`
- Vis-viva: `v = \sqrt{GM\left(\frac{2}{r} - \frac{1}{a}\right)}`
- Acceleration: `a = \frac{GM}{r^2}`
```

**Step 2: Commit**

```bash
git add demos/keplers-laws/README.md
git commit -m "docs(keplers-laws): add math rendering documentation"
```

---

## Task 13: Final Push

```bash
git push origin main
```

---

## Verification Checklist

After all tasks complete:

| Check | Status |
|-------|--------|
| Planet at θ=0 matches perihelion marker | ⬜ |
| Planet at θ=π matches aphelion marker | ⬜ |
| Eccentricity slider updates correctly | ⬜ |
| Semi-major axis slider updates correctly | ⬜ |
| All formulas render with KaTeX | ⬜ |
| No Unicode math symbols (², ³, √) | ⬜ |
| Dynamic Newton values update | ⬜ |
| Animation plays correctly | ⬜ |
| Keyboard navigation works | ⬜ |
| No console errors | ⬜ |

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `demos/keplers-laws/index.html` | Add KaTeX CSS/JS, convert formulas to data-math |
| `demos/keplers-laws/keplers-laws.js` | Fix orbitalToSvg, add KaTeX rendering |
| `demos/keplers-laws/keplers-laws.css` | Add formula styling, transitions |
| `demos/keplers-laws/README.md` | Document math rendering |

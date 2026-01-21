# ASTR 101 Interactive Demos Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 4 interactive astronomy demos (Blackbody Radiation, EM Spectrum, Telescope Resolution, Parallax) following the Kepler's Laws Sandbox architecture.

**Architecture:** Standalone vanilla HTML/CSS/JS with no build tools. IIFE pattern for encapsulation, centralized state object, KaTeX for math rendering. Each demo is self-contained with shared assets (CSS theme, utilities, starfield).

**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), SVG, Canvas, KaTeX

**Reference:** `demos/keplers-laws/` is the gold standard implementation.

---

## Phase 0: Shared Infrastructure

### Task 0.1: Download KaTeX Library

**Files:**
- Create: `demos/_assets/katex/katex.min.css`
- Create: `demos/_assets/katex/katex.min.js`
- Create: `demos/_assets/katex/fonts/` (directory)

**Step 1: Create katex directory**

```bash
mkdir -p demos/_assets/katex/fonts
```

**Step 2: Download KaTeX files**

```bash
# Download from CDN (version 0.16.9)
curl -o demos/_assets/katex/katex.min.css https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
curl -o demos/_assets/katex/katex.min.js https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
```

**Step 3: Download required fonts**

```bash
cd demos/_assets/katex/fonts
curl -O https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Main-Regular.woff2
curl -O https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Math-Italic.woff2
curl -O https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Size1-Regular.woff2
curl -O https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/KaTeX_Size2-Regular.woff2
cd ../../../..
```

**Step 4: Fix font paths in CSS**

Edit `demos/_assets/katex/katex.min.css` to change font URLs from CDN to local:
- Replace `url(https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/` with `url(fonts/`

**Step 5: Commit**

```bash
git add demos/_assets/katex/
git commit -m "chore: add local KaTeX library for portable math rendering"
```

---

### Task 0.2: Add KaTeX Helper to astro-utils.js

**Files:**
- Modify: `demos/_assets/astro-utils.js`

**Step 1: Read current file**

Read `demos/_assets/astro-utils.js` to understand current utilities.

**Step 2: Add KaTeX render helper**

Append to `demos/_assets/astro-utils.js`:

```javascript
/**
 * Render KaTeX math to an element
 * @param {string} selector - CSS selector for target element
 * @param {string} latex - LaTeX string to render
 * @param {boolean} displayMode - true for display style, false for inline
 */
function renderMath(selector, latex, displayMode = false) {
  const element = document.querySelector(selector);
  if (element && window.katex) {
    katex.render(latex, element, {
      throwOnError: false,
      displayMode: displayMode
    });
  }
}

/**
 * Render all elements with data-math attribute
 */
function renderAllMath() {
  document.querySelectorAll('[data-math]').forEach(el => {
    const latex = el.getAttribute('data-math');
    const displayMode = el.hasAttribute('data-math-display');
    if (window.katex) {
      katex.render(latex, el, {
        throwOnError: false,
        displayMode: displayMode
      });
    }
  });
}

// Export for use
window.AstroUtils = window.AstroUtils || {};
window.AstroUtils.renderMath = renderMath;
window.AstroUtils.renderAllMath = renderAllMath;
```

**Step 3: Verify no syntax errors**

Open browser console, load a demo, check for errors.

**Step 4: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat: add KaTeX math rendering helpers to astro-utils"
```

---

## Phase 1: Blackbody Radiation Sandbox

### Task 1.1: Create Directory Structure

**Files:**
- Create: `demos/blackbody-radiation/` (directory)

**Step 1: Create directory**

```bash
mkdir -p demos/blackbody-radiation
```

**Step 2: Commit**

```bash
git add demos/blackbody-radiation/.gitkeep 2>/dev/null || echo "Directory created"
```

---

### Task 1.2: Create HTML Shell

**Files:**
- Create: `demos/blackbody-radiation/index.html`

**Step 1: Create HTML file with complete structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blackbody Radiation Sandbox | AstroEd</title>
  <link rel="stylesheet" href="../_assets/astro-theme.css">
  <link rel="stylesheet" href="../_assets/katex/katex.min.css">
  <style>
    /* Demo-specific styles */
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    body {
      font-family: var(--font-main);
      background: var(--space-black);
      color: var(--text-primary);
    }

    .demo-wrapper {
      min-height: 100vh;
      position: relative;
    }

    #starfield {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .demo-content {
      position: relative;
      z-index: 1;
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 1rem;
    }

    .demo-title {
      font-size: 1.75rem;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .demo-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
    }

    /* Mode Toggle (101/201) */
    .mode-toggle {
      display: flex;
      justify-content: center;
      gap: 0;
      margin-bottom: 1rem;
    }

    .mode-btn {
      padding: 0.5rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: 2px solid var(--border-color);
      background: var(--space-light);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mode-btn:first-child {
      border-radius: 6px 0 0 6px;
      border-right: 1px solid var(--border-color);
    }

    .mode-btn:last-child {
      border-radius: 0 6px 6px 0;
      border-left: 1px solid var(--border-color);
    }

    .mode-btn.active {
      background: var(--accent-gold);
      color: var(--space-black);
      border-color: var(--accent-gold);
    }

    .mode-btn:hover:not(.active) {
      background: var(--space-medium);
      color: var(--text-primary);
    }

    /* Main layout: spectrum + star preview side by side */
    .main-viz {
      display: grid;
      grid-template-columns: 1fr 200px;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .spectrum-panel {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem;
    }

    .star-preview {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #spectrum-canvas {
      width: 100%;
      height: 300px;
      display: block;
    }

    #star-circle {
      border-radius: 50%;
      box-shadow: 0 0 30px currentColor;
      transition: all 0.3s ease;
    }

    .star-label {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      text-align: center;
    }

    /* EM band bar */
    .em-band-bar {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
    }

    .em-band-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .em-band-gradient {
      height: 24px;
      border-radius: 4px;
      position: relative;
      background: linear-gradient(to right,
        #8b00ff 0%,      /* UV */
        #4b0082 8%,
        #0000ff 16%,     /* Blue */
        #00ff00 33%,     /* Green */
        #ffff00 50%,     /* Yellow */
        #ff7f00 66%,     /* Orange */
        #ff0000 75%,     /* Red */
        #8b0000 85%,     /* IR */
        #2d0000 100%     /* Far IR */
      );
    }

    .em-peak-marker {
      position: absolute;
      top: -5px;
      width: 2px;
      height: calc(100% + 10px);
      background: var(--accent-gold);
      transform: translateX(-50%);
    }

    .em-peak-marker::after {
      content: attr(data-label);
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.65rem;
      color: var(--accent-gold);
      white-space: nowrap;
    }

    /* Readout panel */
    .readout-panel {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .readout-item {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.75rem;
      text-align: center;
    }

    .readout-label {
      font-size: 0.7rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.25rem;
    }

    .readout-value {
      font-family: var(--font-mono);
      font-size: 1.25rem;
      color: var(--accent-gold);
    }

    .readout-unit {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Temperature slider */
    .temp-control {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .temp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .temp-value {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      color: var(--accent-gold);
    }

    .temp-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .scale-toggle {
      display: flex;
      gap: 0.25rem;
    }

    .scale-btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      background: var(--space-light);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-muted);
      cursor: pointer;
    }

    .scale-btn.active {
      background: var(--accent-blue);
      color: var(--space-black);
      border-color: var(--accent-blue);
    }

    /* Presets */
    .presets-panel {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .presets-section {
      margin-bottom: 0.75rem;
    }

    .presets-section:last-child {
      margin-bottom: 0;
    }

    .presets-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .presets-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .preset-btn {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: var(--space-light);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .preset-btn:hover {
      background: var(--space-medium);
      color: var(--text-primary);
      border-color: var(--accent-blue);
    }

    .preset-btn.active {
      background: var(--accent-blue);
      color: var(--space-black);
      border-color: var(--accent-blue);
    }

    /* CMB redshift slider (hidden by default) */
    .cmb-controls {
      display: none;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }

    .cmb-controls.visible {
      display: block;
    }

    /* Animation controls */
    .animation-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .anim-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: var(--space-light);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.15s ease;
    }

    .anim-btn:hover:not(:disabled) {
      background: var(--space-medium);
      color: var(--text-primary);
      border-color: var(--accent-blue);
    }

    .anim-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .anim-btn.primary {
      background: var(--accent-blue);
      color: var(--space-black);
      border-color: var(--accent-blue);
    }

    .speed-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .speed-control select {
      padding: 0.25rem 0.5rem;
      background: var(--space-light);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-primary);
      cursor: pointer;
    }

    /* Overlays row */
    .overlays-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }

    .overlay-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .overlay-toggle input {
      accent-color: var(--accent-blue);
    }

    /* Insight box */
    .insight-box {
      background: rgba(18, 18, 31, 0.9);
      border-left: 3px solid var(--accent-gold);
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .insight-box h4 {
      margin: 0 0 0.5rem 0;
      color: var(--accent-gold);
      font-size: 0.875rem;
    }

    .insight-box .formula {
      font-family: var(--font-mono);
      color: var(--accent-blue);
      margin: 0.5rem 0;
    }

    /* Math mode only elements */
    .math-mode-only {
      display: none;
    }

    body.math-mode .math-mode-only {
      display: block;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-viz {
        grid-template-columns: 1fr;
      }

      .star-preview {
        order: -1;
      }

      .readout-panel {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Screen reader only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  </style>
</head>
<body>
  <div class="demo-wrapper">
    <canvas id="starfield"></canvas>

    <div class="demo-content">
      <header class="demo-header">
        <h1 class="demo-title">Blackbody Radiation Sandbox</h1>
        <p class="demo-subtitle">Explore how temperature determines a star's spectrum and color</p>
      </header>

      <!-- Mode Toggle (101/201) -->
      <div class="mode-toggle">
        <button class="mode-btn active" id="btn-101-mode">101 MODE</button>
        <button class="mode-btn" id="btn-201-mode">MATH MODE</button>
      </div>

      <!-- Main Visualization -->
      <div class="main-viz">
        <div class="spectrum-panel">
          <canvas id="spectrum-canvas"></canvas>
        </div>
        <div class="star-preview">
          <div id="star-circle" style="width: 80px; height: 80px; background: #fff5cc;"
               role="img" aria-label="Star preview showing color at current temperature"></div>
          <div class="star-label" id="star-type-label">Sun-like (G2V)</div>
        </div>
      </div>

      <!-- EM Band Bar -->
      <div class="em-band-bar">
        <div class="em-band-labels">
          <span>UV</span>
          <span>Violet</span>
          <span>Blue</span>
          <span>Green</span>
          <span>Yellow</span>
          <span>Orange</span>
          <span>Red</span>
          <span>IR</span>
        </div>
        <div class="em-band-gradient">
          <div class="em-peak-marker" id="peak-marker" style="left: 50%;" data-label="502 nm"></div>
        </div>
      </div>

      <!-- Readouts -->
      <div class="readout-panel">
        <div class="readout-item">
          <div class="readout-label">Temperature</div>
          <div class="readout-value" id="temp-readout">5,778</div>
          <div class="readout-unit">K</div>
        </div>
        <div class="readout-item">
          <div class="readout-label">Peak Wavelength</div>
          <div class="readout-value" id="lambda-readout">502</div>
          <div class="readout-unit">nm</div>
        </div>
        <div class="readout-item">
          <div class="readout-label">Luminosity</div>
          <div class="readout-value" id="lum-readout">1.00</div>
          <div class="readout-unit" id="lum-unit">L<sub>☉</sub></div>
        </div>
        <div class="readout-item">
          <div class="readout-label">Color</div>
          <div class="readout-value" id="color-readout" style="background: #fff5cc; width: 40px; height: 20px; border-radius: 4px; margin: 0 auto;"></div>
          <div class="readout-unit" id="color-label">White</div>
        </div>
      </div>

      <!-- Temperature Control -->
      <div class="temp-control">
        <div class="temp-header">
          <span>Temperature</span>
          <span class="temp-value" id="temp-display">5,778 K</span>
          <div class="scale-toggle">
            <button class="scale-btn active" id="btn-log-scale">Log</button>
            <button class="scale-btn" id="btn-linear-scale">Linear</button>
          </div>
        </div>
        <input type="range" id="temp-slider" class="astro-slider" min="0" max="1000" value="500"
               aria-label="Temperature slider" aria-valuemin="2.7" aria-valuemax="1000000" aria-valuenow="5778">
        <div class="temp-labels">
          <span>2.7 K (CMB)</span>
          <span>10⁶ K (Neutron Star)</span>
        </div>
      </div>

      <!-- Presets -->
      <div class="presets-panel">
        <div class="presets-section">
          <div class="presets-label">Stars</div>
          <div class="presets-row">
            <button class="preset-btn" data-t="34000" data-name="O star (ζ Oph)">O</button>
            <button class="preset-btn" data-t="12000" data-name="B star (Rigel)">B</button>
            <button class="preset-btn" data-t="9600" data-name="A star (Vega)">A</button>
            <button class="preset-btn active" data-t="5778" data-name="Sun (G2V)">Sun</button>
            <button class="preset-btn" data-t="5200" data-name="K star (α Cen B)">K</button>
            <button class="preset-btn" data-t="3000" data-name="M dwarf (Proxima)">M</button>
            <button class="preset-btn" data-t="3500" data-name="Red Giant (Betelgeuse)">Red Giant</button>
          </div>
        </div>

        <div class="presets-section">
          <div class="presets-label">Compact Objects</div>
          <div class="presets-row">
            <button class="preset-btn" data-t="25000" data-name="White Dwarf (Sirius B)">White Dwarf</button>
            <button class="preset-btn" data-t="1000000" data-name="Neutron Star">Neutron Star</button>
          </div>
        </div>

        <div class="presets-section">
          <div class="presets-label">Cold Objects</div>
          <div class="presets-row">
            <button class="preset-btn" data-t="250" data-name="Brown Dwarf">Brown Dwarf</button>
            <button class="preset-btn" data-t="300" data-name="Warm Dust">Dust</button>
            <button class="preset-btn" data-t="125" data-name="Jupiter">Jupiter</button>
            <button class="preset-btn" data-t="288" data-name="Earth">Earth</button>
          </div>
        </div>

        <div class="presets-section">
          <div class="presets-label">Cosmic Microwave Background</div>
          <div class="presets-row">
            <button class="preset-btn" data-t="2.725" data-name="CMB Today (z=0)" data-cmb="0">Today</button>
            <button class="preset-btn" data-t="30" data-name="CMB at z=10" data-cmb="10">z=10</button>
            <button class="preset-btn" data-t="3000" data-name="Recombination (z≈1100)" data-cmb="1100">Recombination</button>
          </div>
          <div class="cmb-controls" id="cmb-controls">
            <div class="temp-header">
              <span>Redshift (z)</span>
              <span class="temp-value" id="z-display">0</span>
            </div>
            <input type="range" id="z-slider" class="astro-slider" min="0" max="1100" value="0">
          </div>
        </div>

        <div class="overlays-row">
          <label class="overlay-toggle">
            <input type="checkbox" id="toggle-peak" checked> Peak marker
          </label>
          <label class="overlay-toggle">
            <input type="checkbox" id="toggle-em-bands" checked> EM bands
          </label>
          <label class="overlay-toggle">
            <input type="checkbox" id="toggle-luminosity"> Show luminosity as size
          </label>
          <label class="overlay-toggle math-mode-only">
            <input type="checkbox" id="toggle-planck-terms"> Planck term breakdown
          </label>
        </div>
      </div>

      <!-- Animation Controls -->
      <div class="animation-controls">
        <button class="anim-btn primary" id="btn-play">▶ Play</button>
        <button class="anim-btn" id="btn-pause" disabled>⏸ Pause</button>
        <button class="anim-btn" id="btn-cycle">↻ Cycle Presets</button>
        <div class="speed-control">
          <label>Speed:</label>
          <select id="speed-select">
            <option value="0.5">0.5×</option>
            <option value="1" selected>1×</option>
            <option value="2">2×</option>
            <option value="5">5×</option>
          </select>
        </div>
      </div>

      <!-- Insight Box -->
      <div class="insight-box" id="insight-box">
        <h4>Wien's Displacement Law</h4>
        <p>Hotter objects peak at shorter wavelengths (bluer). Cooler objects peak at longer wavelengths (redder).</p>
        <p>The Sun peaks in green-yellow but appears white because it emits across all visible colors.</p>
        <div class="formula math-mode-only" id="formula-wien"></div>
        <div class="formula math-mode-only" id="formula-planck"></div>
      </div>

      <!-- Screen reader announcements -->
      <div id="status-announce" aria-live="polite" aria-atomic="true" class="sr-only"></div>
    </div>
  </div>

  <script src="../_assets/katex/katex.min.js"></script>
  <script src="../_assets/astro-utils.js"></script>
  <script src="../_assets/starfield.js"></script>
  <script src="blackbody.js"></script>
</body>
</html>
```

**Step 2: Verify HTML structure**

Open in browser, check for layout errors.

**Step 3: Commit**

```bash
git add demos/blackbody-radiation/index.html
git commit -m "feat(blackbody): add HTML shell with complete layout"
```

---

### Task 1.3: Implement Physics Module

**Files:**
- Create: `demos/blackbody-radiation/blackbody.js`

**Step 1: Create JavaScript file with physics core**

```javascript
/**
 * Blackbody Radiation Sandbox
 * Interactive demonstration of thermal radiation physics
 *
 * Physics (CGS units):
 * - Wien's Law: λ_peak = 0.2898 cm·K / T
 * - Stefan-Boltzmann: F = σT⁴, L = 4πR²σT⁴
 * - Planck Function: B_λ(T) = (2hc²/λ⁵) × 1/(e^(hc/λkT) - 1)
 */

(function() {
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

    // Solar values for reference
    T_sun: 5778,           // K
    R_sun: 6.96e10,        // cm
    L_sun: 3.828e33        // erg/s
  };

  // ============================================
  // Physics Functions
  // ============================================

  /**
   * Wien's Displacement Law: λ_peak = b / T
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (cm)
   */
  function wienPeak(T) {
    return CONSTANTS.wien_b / T;
  }

  /**
   * Wien's Law in nm for display
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (nm)
   */
  function wienPeakNm(T) {
    return wienPeak(T) * CONSTANTS.cm_to_nm;
  }

  /**
   * Planck function B_λ(T)
   * @param {number} lambda - Wavelength (cm)
   * @param {number} T - Temperature (K)
   * @returns {number} Spectral radiance (erg/s/cm²/sr/cm)
   */
  function planckFunction(lambda, T) {
    const c = CONSTANTS.c;
    const h = CONSTANTS.h;
    const k = CONSTANTS.k;

    const factor1 = (2 * h * c * c) / Math.pow(lambda, 5);
    const exponent = (h * c) / (lambda * k * T);

    // Prevent overflow for very small wavelengths
    if (exponent > 700) return 0;

    return factor1 / (Math.exp(exponent) - 1);
  }

  /**
   * Stefan-Boltzmann flux: F = σT⁴
   * @param {number} T - Temperature (K)
   * @returns {number} Flux (erg/s/cm²)
   */
  function stefanBoltzmannFlux(T) {
    return CONSTANTS.sigma * Math.pow(T, 4);
  }

  /**
   * Luminosity relative to Sun (assuming same radius)
   * L/L_sun = (T/T_sun)⁴
   * @param {number} T - Temperature (K)
   * @returns {number} Luminosity ratio
   */
  function luminosityRatio(T) {
    return Math.pow(T / CONSTANTS.T_sun, 4);
  }

  /**
   * Convert temperature to approximate star color (RGB)
   * Uses blackbody color approximation
   * @param {number} T - Temperature (K)
   * @returns {object} {r, g, b} values 0-255
   */
  function temperatureToColor(T) {
    // Approximation for blackbody colors
    // Based on CIE color matching functions
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
   * Get color name from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Color name
   */
  function colorName(T) {
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
   * @returns {string} Spectral class description
   */
  function spectralClass(T) {
    if (T >= 30000) return 'O-type';
    if (T >= 10000) return 'B-type';
    if (T >= 7500) return 'A-type';
    if (T >= 6000) return 'F-type';
    if (T >= 5200) return 'G-type (Sun-like)';
    if (T >= 3700) return 'K-type';
    if (T >= 2400) return 'M-type (Red Dwarf)';
    if (T >= 1300) return 'L-type (Brown Dwarf)';
    if (T >= 500) return 'T-type (Cool Brown Dwarf)';
    if (T >= 100) return 'Planetary';
    return 'CMB/Cold';
  }

  // ============================================
  // State
  // ============================================

  const state = {
    temperature: 5778,     // K (Sun default)
    mode: '101',           // '101' | '201'
    scale: 'log',          // 'log' | 'linear'
    redshift: 0,           // For CMB mode
    playing: false,
    cyclingPresets: false,
    speed: 1.0,
    animationId: null,
    currentPreset: null,

    // Display ranges
    lambda_min: 1e-6,      // 10 nm in cm
    lambda_max: 1e-2,      // 0.1 mm in cm

    // Overlay visibility
    overlays: {
      peak: true,
      emBands: true,
      luminosity: false,
      planckTerms: false
    }
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // Canvas
      spectrumCanvas: document.getElementById('spectrum-canvas'),

      // Star preview
      starCircle: document.getElementById('star-circle'),
      starTypeLabel: document.getElementById('star-type-label'),

      // Peak marker
      peakMarker: document.getElementById('peak-marker'),

      // Readouts
      tempReadout: document.getElementById('temp-readout'),
      lambdaReadout: document.getElementById('lambda-readout'),
      lumReadout: document.getElementById('lum-readout'),
      colorReadout: document.getElementById('color-readout'),
      colorLabel: document.getElementById('color-label'),

      // Temperature control
      tempSlider: document.getElementById('temp-slider'),
      tempDisplay: document.getElementById('temp-display'),

      // Scale buttons
      btnLogScale: document.getElementById('btn-log-scale'),
      btnLinearScale: document.getElementById('btn-linear-scale'),

      // Mode buttons
      btn101Mode: document.getElementById('btn-101-mode'),
      btn201Mode: document.getElementById('btn-201-mode'),

      // CMB controls
      cmbControls: document.getElementById('cmb-controls'),
      zSlider: document.getElementById('z-slider'),
      zDisplay: document.getElementById('z-display'),

      // Animation controls
      btnPlay: document.getElementById('btn-play'),
      btnPause: document.getElementById('btn-pause'),
      btnCycle: document.getElementById('btn-cycle'),
      speedSelect: document.getElementById('speed-select'),

      // Overlay toggles
      togglePeak: document.getElementById('toggle-peak'),
      toggleEmBands: document.getElementById('toggle-em-bands'),
      toggleLuminosity: document.getElementById('toggle-luminosity'),
      togglePlanckTerms: document.getElementById('toggle-planck-terms'),

      // Preset buttons
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Insight box
      insightBox: document.getElementById('insight-box'),
      formulaWien: document.getElementById('formula-wien'),
      formulaPlanck: document.getElementById('formula-planck'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }

  // ============================================
  // Rendering
  // ============================================

  /**
   * Draw the Planck spectrum on canvas
   */
  function drawSpectrum() {
    const canvas = elements.spectrumCanvas;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical grid lines (wavelength)
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Calculate spectrum
    const numPoints = 500;
    const lambda_min_log = Math.log10(state.lambda_min);
    const lambda_max_log = Math.log10(state.lambda_max);

    // Find max value for normalization
    let maxB = 0;
    const lambdas = [];
    const values = [];

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const lambda_log = lambda_min_log + t * (lambda_max_log - lambda_min_log);
      const lambda = Math.pow(10, lambda_log);
      const B = planckFunction(lambda, state.temperature);

      lambdas.push(lambda);
      values.push(B);
      if (B > maxB) maxB = B;
    }

    // Draw spectrum curve
    ctx.beginPath();
    ctx.strokeStyle = '#5dade2';
    ctx.lineWidth = 2;

    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * width;
      const y = height - (values[i] / maxB) * height * 0.9 - height * 0.05;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Fill under curve with gradient
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');    // UV
    gradient.addColorStop(0.2, 'rgba(0, 0, 255, 0.3)');     // Blue
    gradient.addColorStop(0.35, 'rgba(0, 255, 0, 0.3)');    // Green
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)');   // Yellow
    gradient.addColorStop(0.65, 'rgba(255, 127, 0, 0.3)');  // Orange
    gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.3)');     // Red
    gradient.addColorStop(1, 'rgba(139, 0, 0, 0.2)');       // IR

    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw peak marker if enabled
    if (state.overlays.peak) {
      const lambda_peak = wienPeak(state.temperature);
      const peak_log = Math.log10(lambda_peak);

      if (peak_log >= lambda_min_log && peak_log <= lambda_max_log) {
        const peak_x = ((peak_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width;

        ctx.beginPath();
        ctx.strokeStyle = '#f4d03f';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(peak_x, 0);
        ctx.lineTo(peak_x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Peak label
        ctx.fillStyle = '#f4d03f';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const peakNm = wienPeakNm(state.temperature);
        let peakLabel;
        if (peakNm < 1000) {
          peakLabel = `λ_peak = ${peakNm.toFixed(0)} nm`;
        } else if (peakNm < 1e6) {
          peakLabel = `λ_peak = ${(peakNm / 1000).toFixed(1)} μm`;
        } else {
          peakLabel = `λ_peak = ${(peakNm / 1e6).toFixed(2)} mm`;
        }
        ctx.fillText(peakLabel, peak_x, 20);
      }
    }

    // Draw visible band region
    if (state.overlays.emBands) {
      const vis_min = 380e-7;  // 380 nm in cm
      const vis_max = 700e-7;  // 700 nm in cm

      const vis_min_log = Math.log10(vis_min);
      const vis_max_log = Math.log10(vis_max);

      if (vis_max_log >= lambda_min_log && vis_min_log <= lambda_max_log) {
        const x1 = Math.max(0, ((vis_min_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width);
        const x2 = Math.min(width, ((vis_max_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x1, 0, x2 - x1, height);

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VISIBLE', (x1 + x2) / 2, height - 10);
      }
    }

    // Draw axis labels
    ctx.fillStyle = '#a0a0b0';
    ctx.font = '11px sans-serif';

    // X-axis labels (wavelength)
    const wavelengthLabels = [
      { lambda: 1e-6, label: '10 nm' },
      { lambda: 1e-5, label: '100 nm' },
      { lambda: 1e-4, label: '1 μm' },
      { lambda: 1e-3, label: '10 μm' },
      { lambda: 1e-2, label: '100 μm' }
    ];

    wavelengthLabels.forEach(({ lambda, label }) => {
      const log = Math.log10(lambda);
      if (log >= lambda_min_log && log <= lambda_max_log) {
        const x = ((log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - 25);
      }
    });

    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Intensity', 0, 0);
    ctx.restore();
  }

  /**
   * Update star preview circle
   */
  function updateStarPreview() {
    const color = temperatureToColor(state.temperature);
    const colorHex = `rgb(${color.r}, ${color.g}, ${color.b})`;

    elements.starCircle.style.background = colorHex;
    elements.starCircle.style.color = colorHex;

    // Update size if luminosity overlay enabled
    if (state.overlays.luminosity) {
      const lum = luminosityRatio(state.temperature);
      // Map luminosity to size (logarithmic scale)
      const baseSize = 60;
      const logLum = Math.log10(Math.max(lum, 0.01));
      const size = Math.max(30, Math.min(150, baseSize + logLum * 15));
      elements.starCircle.style.width = `${size}px`;
      elements.starCircle.style.height = `${size}px`;
    } else {
      elements.starCircle.style.width = '80px';
      elements.starCircle.style.height = '80px';
    }

    elements.starTypeLabel.textContent = spectralClass(state.temperature);
  }

  /**
   * Update EM band peak marker position
   */
  function updatePeakMarker() {
    const peakNm = wienPeakNm(state.temperature);

    // Map peak wavelength to position (log scale, 10nm to 10mm)
    const minLog = Math.log10(10);      // 10 nm
    const maxLog = Math.log10(10000000); // 10 mm in nm
    const peakLog = Math.log10(Math.max(10, Math.min(10000000, peakNm)));

    const position = ((peakLog - minLog) / (maxLog - minLog)) * 100;
    elements.peakMarker.style.left = `${Math.max(0, Math.min(100, position))}%`;

    // Update label
    let label;
    if (peakNm < 1000) {
      label = `${peakNm.toFixed(0)} nm`;
    } else if (peakNm < 1000000) {
      label = `${(peakNm / 1000).toFixed(1)} μm`;
    } else {
      label = `${(peakNm / 1000000).toFixed(2)} mm`;
    }
    elements.peakMarker.setAttribute('data-label', label);

    elements.peakMarker.style.display = state.overlays.peak ? 'block' : 'none';
  }

  /**
   * Update all readout displays
   */
  function updateReadouts() {
    // Temperature
    const tempStr = state.temperature >= 1000
      ? state.temperature.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : state.temperature.toFixed(state.temperature < 10 ? 3 : 1);
    elements.tempReadout.textContent = tempStr;
    elements.tempDisplay.textContent = `${tempStr} K`;

    // Peak wavelength
    const peakNm = wienPeakNm(state.temperature);
    let lambdaStr, lambdaUnit;
    if (peakNm < 1000) {
      lambdaStr = peakNm.toFixed(0);
      lambdaUnit = 'nm';
    } else if (peakNm < 1000000) {
      lambdaStr = (peakNm / 1000).toFixed(1);
      lambdaUnit = 'μm';
    } else {
      lambdaStr = (peakNm / 1000000).toFixed(2);
      lambdaUnit = 'mm';
    }
    elements.lambdaReadout.textContent = lambdaStr;
    elements.lambdaReadout.nextElementSibling.textContent = lambdaUnit;

    // Luminosity (relative to Sun, same radius)
    const lum = luminosityRatio(state.temperature);
    if (lum >= 1000) {
      elements.lumReadout.textContent = lum.toExponential(2);
    } else if (lum >= 1) {
      elements.lumReadout.textContent = lum.toFixed(1);
    } else {
      elements.lumReadout.textContent = lum.toExponential(2);
    }

    // Color
    const color = temperatureToColor(state.temperature);
    const colorHex = `rgb(${color.r}, ${color.g}, ${color.b})`;
    elements.colorReadout.style.background = colorHex;
    elements.colorLabel.textContent = colorName(state.temperature);
  }

  /**
   * Update slider position from temperature
   */
  function updateSliderFromTemperature() {
    // Log scale: 2.7 K to 10⁶ K maps to 0-1000
    const minLog = Math.log10(2.7);
    const maxLog = Math.log10(1000000);
    const tempLog = Math.log10(state.temperature);
    const sliderVal = ((tempLog - minLog) / (maxLog - minLog)) * 1000;
    elements.tempSlider.value = Math.round(sliderVal);
  }

  /**
   * Render KaTeX formulas (Math Mode only)
   */
  function renderFormulas() {
    if (state.mode === '201' && window.katex) {
      katex.render(
        "\\lambda_{\\text{peak}} = \\frac{0.2898 \\text{ cm}\\cdot\\text{K}}{T}",
        elements.formulaWien,
        { displayMode: true, throwOnError: false }
      );

      katex.render(
        "B_\\lambda(T) = \\frac{2hc^2}{\\lambda^5} \\cdot \\frac{1}{e^{hc/\\lambda k_B T} - 1}",
        elements.formulaPlanck,
        { displayMode: true, throwOnError: false }
      );
    }
  }

  /**
   * Update insight box content based on context
   */
  function updateInsightBox() {
    let title, content;

    if (state.temperature < 10) {
      title = "Cosmic Microwave Background";
      content = "The CMB is the most perfect blackbody ever measured. It's the afterglow of the Big Bang, now cooled to 2.725 K.";
    } else if (state.temperature < 500) {
      title = "Cold Object Emission";
      content = "Cool objects like dust clouds and planets emit in infrared — invisible to our eyes but revealed by telescopes like JWST and Spitzer.";
    } else if (state.temperature > 20000) {
      title = "Hot Star Emission";
      content = "O and B stars are so hot they emit mostly ultraviolet light — invisible to our eyes but detected by UV telescopes like GALEX.";
    } else {
      title = "Wien's Displacement Law";
      content = "Hotter objects peak at shorter wavelengths (bluer). Cooler objects peak at longer wavelengths (redder). The Sun peaks in green-yellow but appears white because it emits across all visible colors.";
    }

    elements.insightBox.querySelector('h4').textContent = title;
    elements.insightBox.querySelector('p').textContent = content;
  }

  /**
   * Main update function
   */
  function update() {
    drawSpectrum();
    updateStarPreview();
    updatePeakMarker();
    updateReadouts();
    updateInsightBox();
  }

  // ============================================
  // Controls
  // ============================================

  /**
   * Set temperature and update all displays
   */
  function setTemperature(T) {
    state.temperature = Math.max(2.7, Math.min(1000000, T));
    updateSliderFromTemperature();
    update();
  }

  /**
   * Setup temperature slider
   */
  function setupTempSlider() {
    elements.tempSlider.addEventListener('input', () => {
      const sliderVal = parseFloat(elements.tempSlider.value);

      if (state.scale === 'log') {
        // Log scale: slider 0-1000 maps to 2.7-10⁶ K
        const minLog = Math.log10(2.7);
        const maxLog = Math.log10(1000000);
        const tempLog = minLog + (sliderVal / 1000) * (maxLog - minLog);
        state.temperature = Math.pow(10, tempLog);
      } else {
        // Linear scale: slider 0-1000 maps to 100-50000 K
        state.temperature = 100 + (sliderVal / 1000) * 49900;
      }

      clearPresetHighlight();
      update();
    });
  }

  /**
   * Setup scale toggle (log/linear)
   */
  function setupScaleToggle() {
    elements.btnLogScale.addEventListener('click', () => {
      state.scale = 'log';
      elements.btnLogScale.classList.add('active');
      elements.btnLinearScale.classList.remove('active');
      updateSliderFromTemperature();
    });

    elements.btnLinearScale.addEventListener('click', () => {
      state.scale = 'linear';
      elements.btnLinearScale.classList.add('active');
      elements.btnLogScale.classList.remove('active');
      // Update slider for linear range
      const sliderVal = ((state.temperature - 100) / 49900) * 1000;
      elements.tempSlider.value = Math.max(0, Math.min(1000, sliderVal));
    });
  }

  /**
   * Setup mode toggle (101/201)
   */
  function setupModeToggle() {
    elements.btn101Mode.addEventListener('click', () => {
      state.mode = '101';
      elements.btn101Mode.classList.add('active');
      elements.btn201Mode.classList.remove('active');
      document.body.classList.remove('math-mode');
    });

    elements.btn201Mode.addEventListener('click', () => {
      state.mode = '201';
      elements.btn201Mode.classList.add('active');
      elements.btn101Mode.classList.remove('active');
      document.body.classList.add('math-mode');
      renderFormulas();
    });
  }

  /**
   * Clear preset button highlighting
   */
  function clearPresetHighlight() {
    elements.presetButtons.forEach(btn => btn.classList.remove('active'));
    state.currentPreset = null;
    elements.cmbControls.classList.remove('visible');
  }

  /**
   * Setup preset buttons
   */
  function setupPresets() {
    elements.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const T = parseFloat(btn.dataset.t);
        const name = btn.dataset.name;
        const cmb = btn.dataset.cmb;

        state.temperature = T;
        state.currentPreset = name;

        // Update slider
        updateSliderFromTemperature();

        // Highlight active preset
        clearPresetHighlight();
        btn.classList.add('active');

        // Show CMB controls if applicable
        if (cmb !== undefined) {
          elements.cmbControls.classList.add('visible');
          state.redshift = parseFloat(cmb);
          elements.zSlider.value = state.redshift;
          elements.zDisplay.textContent = state.redshift;
        }

        update();
        announceChange();
      });
    });
  }

  /**
   * Setup CMB redshift slider
   */
  function setupCMBControls() {
    elements.zSlider.addEventListener('input', () => {
      state.redshift = parseFloat(elements.zSlider.value);
      elements.zDisplay.textContent = state.redshift.toFixed(0);

      // T(z) = T₀ × (1 + z)
      state.temperature = 2.725 * (1 + state.redshift);
      updateSliderFromTemperature();
      update();
    });
  }

  /**
   * Setup overlay toggles
   */
  function setupOverlays() {
    elements.togglePeak.addEventListener('change', () => {
      state.overlays.peak = elements.togglePeak.checked;
      update();
    });

    elements.toggleEmBands.addEventListener('change', () => {
      state.overlays.emBands = elements.toggleEmBands.checked;
      update();
    });

    elements.toggleLuminosity.addEventListener('change', () => {
      state.overlays.luminosity = elements.toggleLuminosity.checked;
      update();
    });

    if (elements.togglePlanckTerms) {
      elements.togglePlanckTerms.addEventListener('change', () => {
        state.overlays.planckTerms = elements.togglePlanckTerms.checked;
        update();
      });
    }
  }

  /**
   * Setup animation controls
   */
  function setupAnimation() {
    elements.btnPlay.addEventListener('click', startAnimation);
    elements.btnPause.addEventListener('click', stopAnimation);
    elements.btnCycle.addEventListener('click', cyclePresets);

    elements.speedSelect.addEventListener('change', () => {
      state.speed = parseFloat(elements.speedSelect.value);
    });
  }

  /**
   * Start temperature sweep animation
   */
  function startAnimation() {
    if (state.playing) return;

    state.playing = true;
    state.cyclingPresets = false;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    let lastTime = performance.now();
    let direction = 1;

    function animate(currentTime) {
      if (!state.playing) return;

      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Sweep through log temperature
      const minLog = Math.log10(2.7);
      const maxLog = Math.log10(1000000);
      let tempLog = Math.log10(state.temperature);

      tempLog += direction * dt * state.speed * 0.5;

      if (tempLog >= maxLog) {
        tempLog = maxLog;
        direction = -1;
      } else if (tempLog <= minLog) {
        tempLog = minLog;
        direction = 1;
      }

      state.temperature = Math.pow(10, tempLog);
      updateSliderFromTemperature();
      clearPresetHighlight();
      update();

      state.animationId = requestAnimationFrame(animate);
    }

    state.animationId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation
   */
  function stopAnimation() {
    state.playing = false;
    state.cyclingPresets = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    elements.btnPlay.disabled = false;
    elements.btnPause.disabled = true;
  }

  /**
   * Cycle through presets for lecture demos
   */
  function cyclePresets() {
    if (state.cyclingPresets) {
      stopAnimation();
      return;
    }

    state.cyclingPresets = true;
    state.playing = true;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    const presets = Array.from(elements.presetButtons);
    let currentIndex = 0;

    function nextPreset() {
      if (!state.cyclingPresets) return;

      presets[currentIndex].click();
      currentIndex = (currentIndex + 1) % presets.length;

      state.animationId = setTimeout(nextPreset, 2000 / state.speed);
    }

    nextPreset();
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

      switch (event.key) {
        case 'ArrowLeft':
          // Decrease temperature
          setTemperature(state.temperature * (event.shiftKey ? 0.99 : 0.9));
          clearPresetHighlight();
          break;
        case 'ArrowRight':
          // Increase temperature
          setTemperature(state.temperature * (event.shiftKey ? 1.01 : 1.1));
          clearPresetHighlight();
          break;
        case 'Home':
          // Jump to coldest (CMB)
          setTemperature(2.725);
          break;
        case 'End':
          // Jump to hottest (Neutron star)
          setTemperature(1000000);
          break;
        case ' ':
          event.preventDefault();
          if (state.playing) {
            stopAnimation();
          } else {
            startAnimation();
          }
          break;
        case 'm':
        case 'M':
          // Toggle math mode
          if (state.mode === '101') {
            elements.btn201Mode.click();
          } else {
            elements.btn101Mode.click();
          }
          break;
        case 'p':
        case 'P':
          // Cycle presets
          cyclePresets();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          selectPresetByIndex(parseInt(event.key) - 1);
          break;
      }
    });
  }

  function selectPresetByIndex(index) {
    const presets = Array.from(elements.presetButtons);
    if (index < presets.length) {
      presets[index].click();
    }
  }

  function announceChange() {
    const peakNm = wienPeakNm(state.temperature);
    let lambdaStr;
    if (peakNm < 1000) {
      lambdaStr = `${peakNm.toFixed(0)} nanometers`;
    } else if (peakNm < 1000000) {
      lambdaStr = `${(peakNm / 1000).toFixed(1)} micrometers`;
    } else {
      lambdaStr = `${(peakNm / 1000000).toFixed(2)} millimeters`;
    }

    elements.statusAnnounce.textContent =
      `Temperature ${state.temperature.toFixed(0)} Kelvin, ${spectralClass(state.temperature)}, peak wavelength ${lambdaStr}`;
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupTempSlider();
    setupScaleToggle();
    setupModeToggle();
    setupPresets();
    setupCMBControls();
    setupOverlays();
    setupAnimation();
    setupKeyboard();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    // Handle canvas resize
    window.addEventListener('resize', () => {
      drawSpectrum();
    });

    update();
    console.log('Blackbody Radiation Sandbox initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
```

**Step 2: Verify physics calculations**

Open browser console, test:
```javascript
// Wien's Law: Sun (5778K) should peak at ~502nm
console.log(wienPeakNm(5778));  // Should be ~501
```

**Step 3: Commit**

```bash
git add demos/blackbody-radiation/blackbody.js
git commit -m "feat(blackbody): implement physics engine and interactive controls"
```

---

### Task 1.4: Test and Verify Blackbody Demo

**Step 1: Open in browser**

```bash
open demos/blackbody-radiation/index.html
```

**Step 2: Verify physics**

- Sun preset (5778K): λ_peak ≈ 502nm
- CMB (2.725K): λ_peak ≈ 1.06mm
- Check Wien's Law: λ_peak × T = 0.2898 cm·K

**Step 3: Verify interactions**

- [ ] Temperature slider works (log scale)
- [ ] All presets load correctly
- [ ] Star color changes appropriately
- [ ] Peak marker moves with temperature
- [ ] Animation plays/pauses
- [ ] Math mode shows formulas
- [ ] Keyboard shortcuts work

**Step 4: Commit verification**

```bash
git add -A
git commit -m "test(blackbody): verify physics and interactions"
```

---

## Phase 2: EM Spectrum Explorer

### Task 2.1: Create Directory and HTML

**Files:**
- Create: `demos/em-spectrum/index.html`

**Step 1: Create directory**

```bash
mkdir -p demos/em-spectrum
```

**Step 2: Create HTML file**

Create `demos/em-spectrum/index.html` with layout for:
- Central spectrum bar (logarithmic, Radio to Gamma)
- Wavelength scale with SI prefixes
- Size comparison objects
- Mode switcher (Explore, Convert, Telescopes, Objects)
- Mode-specific content panels
- Readouts
- Insight box

Follow Kepler's Laws pattern: complete HTML structure with embedded styles.

**Step 3: Commit**

```bash
git add demos/em-spectrum/index.html
git commit -m "feat(em-spectrum): add HTML shell with layout"
```

---

### Task 2.2: Create EM Spectrum JavaScript

**Files:**
- Create: `demos/em-spectrum/em-spectrum.js`
- Create: `demos/em-spectrum/telescope-data.js`
- Create: `demos/em-spectrum/object-data.js`

**Step 1: Create main JavaScript with physics**

Physics functions:
- c = λν → ν = c/λ
- E = hν = hc/λ
- Unit conversions (fm, pm, nm, μm, mm, m, km)
- Band definitions (Radio, Microwave, IR, Visible, UV, X-ray, Gamma)

**Step 2: Create telescope data module**

```javascript
const TELESCOPES = [
  {
    name: 'Fermi',
    band: 'Gamma',
    lambda_min: 1e-14,  // meters
    lambda_max: 1e-11,
    location: 'Space',
    science: 'Pulsars, GRBs, blazars',
    icon: '🛰️'
  },
  // ... (all telescopes from design)
];
```

**Step 3: Create object data module**

```javascript
const OBJECTS = [
  {
    name: 'O/B stars',
    bands: ['UV', 'Optical'],
    why: 'Peak emission in UV; hot surfaces',
    telescope: 'Hubble, Keck',
    icon: '⭐'
  },
  // ... (all objects from design)
];
```

**Step 4: Commit**

```bash
git add demos/em-spectrum/
git commit -m "feat(em-spectrum): implement converter, telescope, and object modes"
```

---

### Task 2.3: Test EM Spectrum Demo

**Step 1: Verify physics**

- c = λν for all calculator inputs
- E = hν = hc/λ consistent

**Step 2: Verify modes**

- [ ] Explore mode shows band descriptions
- [ ] Convert mode calculates correctly
- [ ] Telescopes mode highlights bands
- [ ] Objects mode shows emission bands

**Step 3: Commit**

```bash
git add -A
git commit -m "test(em-spectrum): verify all modes and calculations"
```

---

## Phase 3: Telescope Resolution Sandbox

### Task 3.1: Create Resolution Demo Structure

**Files:**
- Create: `demos/telescope-resolution/index.html`
- Create: `demos/telescope-resolution/resolution.js`
- Create: `demos/telescope-resolution/telescope-data.js`

**Step 1: Create directory**

```bash
mkdir -p demos/telescope-resolution
```

**Step 2: Create HTML with layout for:**

- Central simulated image (Airy disk / binary stars)
- Resolved/Unresolved indicator
- Aperture slider
- Wavelength selector
- Atmosphere toggle (seeing + AO)
- Telescope presets
- Compare mode
- Insight box

**Step 3: Create JavaScript with physics:**

```javascript
// Diffraction limit
function diffractionLimit(lambda, D) {
  // θ = 1.22 × λ / D (radians)
  return 1.22 * lambda / D;
}

// θ (arcsec) = 2.52 × 10⁵ × λ(cm) / D(cm)
function diffractionLimitArcsec(lambda_cm, D_cm) {
  return 2.52e5 * lambda_cm / D_cm;
}

// Airy disk rendering
function drawAiryDisk(ctx, x, y, radius, intensity) {
  // Bessel function approximation for Airy pattern
  // ...
}
```

**Step 4: Commit**

```bash
git add demos/telescope-resolution/
git commit -m "feat(resolution): implement diffraction physics and Airy disk rendering"
```

---

### Task 3.2: Implement Seeing and AO

**Step 1: Add seeing model**

```javascript
// Effective resolution = max(θ_diffraction, seeing)
function effectiveResolution(theta_diff, seeing, aoEnabled) {
  if (aoEnabled) {
    // AO improves seeing by Strehl ratio
    const strehl = 0.6;  // Typical good AO
    const ao_seeing = seeing * (1 - strehl) + theta_diff * strehl;
    return Math.max(theta_diff, ao_seeing);
  }
  return Math.max(theta_diff, seeing);
}
```

**Step 2: Add seeing slider and AO toggle**

**Step 3: Commit**

```bash
git add demos/telescope-resolution/
git commit -m "feat(resolution): add seeing model and AO simulation"
```

---

## Phase 4: Stellar Parallax Sandbox

### Task 4.1: Create Parallax Demo Structure

**Files:**
- Create: `demos/parallax-distance/index.html`
- Create: `demos/parallax-distance/parallax.js`
- Create: `demos/parallax-distance/star-data.js`

**Step 1: Create directory**

```bash
mkdir -p demos/parallax-distance
```

**Step 2: Create HTML with dual-view layout**

- Left panel: Observer's star field (nearby star shifts)
- Right panel: Top-down solar system (Earth's orbit, star, parallax triangle)
- Animation controls (Play Year, Jan/July freeze)
- Distance slider with star presets
- Precision toggle (Hipparcos/Gaia)
- Angular unit reference
- Insight box

**Step 3: Per your feedback - show full orbit with projected baseline**

The right panel should show:
- Complete Earth orbit (full ellipse)
- Sun at center
- Earth position animated around orbit
- Line from Earth to Star
- Parallax angle marked
- 1 AU baseline highlighted when at Jan/July

**Step 4: Commit**

```bash
git add demos/parallax-distance/
git commit -m "feat(parallax): create dual-view layout with orbital animation"
```

---

### Task 4.2: Implement Parallax Physics and Animation

**Step 1: Physics functions**

```javascript
// Parallax formula: d = 1/p (parsecs when p in arcsec)
function distanceFromParallax(p_arcsec) {
  return 1 / p_arcsec;  // parsecs
}

function parallaxFromDistance(d_pc) {
  return 1 / d_pc;  // arcsec
}

// 1 parsec = 3.26 light-years = 206,265 AU
const PC_TO_LY = 3.26;
const PC_TO_AU = 206265;
```

**Step 2: Synchronized animation**

```javascript
function animate(time) {
  // Earth position (circular orbit approximation)
  const yearFraction = (time / animationDuration) % 1;
  const earthAngle = yearFraction * 2 * Math.PI;

  // Update Earth position in right panel
  const earthX = orbitRadius * Math.cos(earthAngle);
  const earthY = orbitRadius * Math.sin(earthAngle);

  // Calculate parallax shift in left panel
  // Star appears to shift OPPOSITE to Earth's motion
  const parallaxShift = calculateParallaxShift(state.distance, earthAngle);

  // Draw both panels
  drawObserverView(parallaxShift);
  drawTopDownView(earthX, earthY);
}
```

**Step 3: Star presets with Gaia data**

```javascript
const STARS = [
  { name: 'Proxima Centauri', d_ly: 4.2, d_pc: 1.30, p: 0.768, gaia: 'easy' },
  { name: 'Sirius', d_ly: 8.6, d_pc: 2.64, p: 0.379, gaia: 'easy' },
  { name: 'Vega', d_ly: 25, d_pc: 7.7, p: 0.130, gaia: 'easy' },
  { name: 'Polaris', d_ly: 430, d_pc: 132, p: 0.0076, gaia: 'yes' },
  { name: 'Betelgeuse', d_ly: 700, d_pc: 215, p: 0.0047, gaia: 'yes' },
  { name: 'Galactic Center', d_ly: 26000, d_pc: 8000, p: 0.00012, gaia: 'limit' },
  { name: 'Andromeda', d_ly: 2500000, d_pc: null, p: null, gaia: 'no' }
];
```

**Step 4: Commit**

```bash
git add demos/parallax-distance/
git commit -m "feat(parallax): implement synchronized dual-view animation"
```

---

### Task 4.3: Add Gaia Icon and Precision Comparison

**Step 1: Add Gaia spacecraft icon to precision toggle**

```html
<button class="precision-btn" data-precision="gaia">
  <span class="gaia-icon">🛰️</span> Gaia (~0.02 mas)
</button>
```

**Step 2: Show which stars are measurable at each precision**

**Step 3: Commit**

```bash
git add demos/parallax-distance/
git commit -m "feat(parallax): add Gaia icon and precision comparison"
```

---

## Phase 5: Integration and Testing

### Task 5.1: Update Demos Index

**Files:**
- Modify: `demos/index.qmd`

**Step 1: Add new demos to index**

Add links to:
- Blackbody Radiation Sandbox
- EM Spectrum Explorer
- Telescope Resolution Sandbox
- Stellar Parallax Sandbox

**Step 2: Commit**

```bash
git add demos/index.qmd
git commit -m "docs: add new demos to index page"
```

---

### Task 5.2: Cross-Browser Testing

**Step 1: Test in Chrome, Firefox, Safari**

For each demo:
- [ ] Layout renders correctly
- [ ] Animations smooth
- [ ] Sliders responsive
- [ ] Canvas/SVG renders properly

**Step 2: Test mobile responsiveness**

- [ ] Layout adapts to narrow screens
- [ ] Touch interactions work
- [ ] No horizontal scroll

**Step 3: Document any issues**

---

### Task 5.3: Accessibility Testing

**Step 1: Keyboard navigation**

For each demo:
- [ ] All controls reachable via Tab
- [ ] Arrow keys work for sliders
- [ ] Shortcuts documented and working

**Step 2: Screen reader testing**

- [ ] Live regions announce changes
- [ ] All controls have labels
- [ ] Images have alt text

**Step 3: Commit**

```bash
git add -A
git commit -m "test: verify accessibility across all demos"
```

---

### Task 5.4: Final Commit and Tag

**Step 1: Final commit**

```bash
git add -A
git commit -m "feat: complete 4 new ASTR 101 interactive demos

- Blackbody Radiation Sandbox (Wien's Law, Planck function)
- EM Spectrum Explorer (wavelength/frequency converter, telescopes)
- Telescope Resolution Sandbox (diffraction limit, seeing, AO)
- Stellar Parallax Sandbox (d=1/p, animated dual-view)

All demos follow Kepler's Laws architecture:
- Standalone vanilla HTML/CSS/JS
- KaTeX for math rendering
- Full keyboard accessibility
- Real astronomical data"
```

**Step 2: Optional tag**

```bash
git tag -a v1.0-demos -m "Initial release of ASTR 101 interactive demos"
```

---

## Verification Checklist

### Physics Accuracy

| Demo | Verification |
|------|--------------|
| Blackbody | Wien's Law: λ_peak × T = 0.2898 cm·K for all presets |
| EM Spectrum | c = λν verified for all calculator inputs |
| Resolution | θ = 1.22λ/D matches published telescope specs |
| Parallax | d = 1/p matches Gaia catalog values |

### Functionality

| Feature | Blackbody | EM | Resolution | Parallax |
|---------|-----------|-----|------------|----------|
| Presets work | ☐ | ☐ | ☐ | ☐ |
| Sliders responsive | ☐ | ☐ | ☐ | ☐ |
| Animation smooth | ☐ | ☐ | ☐ | ☐ |
| Keyboard works | ☐ | ☐ | ☐ | ☐ |
| Mobile responsive | ☐ | ☐ | ☐ | ☐ |

### Accessibility

| Feature | All Demos |
|---------|-----------|
| Tab navigation | ☐ |
| Screen reader | ☐ |
| Focus indicators | ☐ |
| Reduced motion | ☐ |
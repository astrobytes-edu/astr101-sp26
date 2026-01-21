# Kepler's Laws Sandbox — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build an interactive orbital mechanics demo with Kepler/Newton mode toggle, teaching empirical patterns and underlying physics.

**Architecture:** Standalone HTML/CSS/JavaScript demo following existing patterns in `demos/`. Single SVG canvas for orbit visualization, readout panel, sliders, presets, and insight box. State object manages all parameters.

**Tech Stack:** Vanilla JS, SVG, CSS custom properties from astro-theme.css, shared utilities from astro-utils.js

---

## Task 1: Create File Structure and HTML Shell

**Files:**
- Create: `demos/keplers-laws/index.html`
- Create: `demos/keplers-laws/keplers-laws.js`
- Create: `demos/keplers-laws/README.md`

**Step 1: Create directory**

```bash
mkdir -p demos/keplers-laws
```

**Step 2: Create HTML shell**

Create `demos/keplers-laws/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kepler's Laws Sandbox | AstroEd</title>
  <link rel="stylesheet" href="../_assets/astro-theme.css">
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
      max-width: 1000px;
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

    /* Mode Toggle */
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

    /* Main visualization */
    .viz-panel {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    #orbit-svg {
      width: 100%;
      height: auto;
      display: block;
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

    /* Unit toggle */
    .unit-toggle {
      display: flex;
      justify-content: flex-end;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .unit-btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      background: var(--space-light);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-muted);
      cursor: pointer;
    }

    .unit-btn.active {
      background: var(--accent-blue);
      color: var(--space-black);
      border-color: var(--accent-blue);
    }

    /* Timeline */
    .timeline-panel {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .timeline-track {
      position: relative;
      height: 24px;
      background: var(--space-medium);
      border-radius: 4px;
      cursor: pointer;
    }

    .timeline-progress {
      position: absolute;
      height: 100%;
      background: var(--accent-blue);
      border-radius: 4px 0 0 4px;
      opacity: 0.3;
    }

    .timeline-handle {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background: var(--accent-gold);
      border-radius: 50%;
      cursor: grab;
    }

    .timeline-markers {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* Controls */
    .controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .control-card {
      background: rgba(18, 18, 31, 0.9);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
    }

    .control-card.full-width {
      grid-column: 1 / -1;
    }

    .control-title {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .control-value {
      font-family: var(--font-mono);
      color: var(--accent-blue);
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
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

    /* Presets */
    .presets-section {
      margin-top: 0.75rem;
    }

    .presets-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .presets-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
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

    /* Overlays */
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

    .insight-box.kepler-mode .newton-content,
    .insight-box.newton-mode .kepler-content {
      display: none;
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

    /* Newton-mode specific */
    .newton-only {
      display: none;
    }

    body.newton-mode .newton-only {
      display: block;
    }

    body.newton-mode .kepler-only {
      opacity: 0.5;
    }

    /* Responsive */
    @media (max-width: 700px) {
      .readout-panel {
        grid-template-columns: repeat(2, 1fr);
      }

      .controls-grid {
        grid-template-columns: 1fr;
      }

      .demo-content {
        padding: 1rem;
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
        <h1 class="demo-title">Kepler's Laws Sandbox</h1>
        <p class="demo-subtitle">Explore orbital mechanics: empirical patterns and physical laws</p>
      </header>

      <!-- Mode Toggle -->
      <div class="mode-toggle">
        <button class="mode-btn active" id="btn-kepler-mode">KEPLER MODE</button>
        <button class="mode-btn" id="btn-newton-mode">NEWTON MODE</button>
      </div>

      <!-- Main Visualization -->
      <div class="viz-panel">
        <svg id="orbit-svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <!-- Star (Sun) gradient -->
            <radialGradient id="starGradient">
              <stop offset="0%" stop-color="#fff5cc"/>
              <stop offset="70%" stop-color="#ffcc00"/>
              <stop offset="100%" stop-color="#ff8c00"/>
            </radialGradient>

            <!-- Planet gradient -->
            <radialGradient id="planetGradient" cx="30%" cy="30%">
              <stop offset="0%" stop-color="#7ec8e3"/>
              <stop offset="100%" stop-color="#4a90d9"/>
            </radialGradient>

            <!-- Glow filter -->
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <!-- Arrow marker for vectors -->
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
            </marker>
          </defs>

          <!-- Orbit ellipse -->
          <ellipse id="orbit-path" cx="300" cy="200" rx="200" ry="150"
                   fill="none" stroke="var(--text-muted)" stroke-width="1"
                   stroke-dasharray="4 4" opacity="0.5"/>

          <!-- Equal areas wedge (toggleable) -->
          <g id="equal-areas-group" style="display: none;">
            <path id="equal-areas-wedge" fill="rgba(93, 173, 226, 0.2)"
                  stroke="var(--accent-blue)" stroke-width="1"/>
          </g>

          <!-- Foci markers -->
          <g id="foci-group">
            <circle id="focus-1" cx="300" cy="200" r="4" fill="var(--accent-gold)"/>
            <circle id="focus-2" cx="300" cy="200" r="3" fill="var(--text-muted)" opacity="0.5"/>
            <text id="focus-1-label" x="300" y="215" text-anchor="middle"
                  fill="var(--text-muted)" font-size="10">Focus (Star)</text>
          </g>

          <!-- Apsides markers -->
          <g id="apsides-group">
            <circle id="perihelion-marker" cx="100" cy="200" r="4" fill="var(--accent-gold)"/>
            <text id="perihelion-label" x="100" y="220" text-anchor="middle"
                  fill="var(--accent-gold)" font-size="9">Perihelion</text>
            <circle id="aphelion-marker" cx="500" cy="200" r="4" fill="var(--accent-blue)"/>
            <text id="aphelion-label" x="500" y="220" text-anchor="middle"
                  fill="var(--accent-blue)" font-size="9">Aphelion</text>
          </g>

          <!-- Star at focus -->
          <circle id="star" cx="300" cy="200" r="20" fill="url(#starGradient)" filter="url(#glow)"/>

          <!-- Distance line (r) -->
          <line id="distance-line" x1="300" y1="200" x2="400" y2="200"
                stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 3"/>

          <!-- Velocity vector (Newton mode) -->
          <g id="velocity-vector" class="newton-only" style="display: none;">
            <line id="velocity-line" x1="400" y1="200" x2="400" y2="150"
                  stroke="#2ecc71" stroke-width="2" marker-end="url(#arrowhead)"/>
            <text id="velocity-label" x="410" y="145" fill="#2ecc71" font-size="10">v</text>
          </g>

          <!-- Force vector (Newton mode) -->
          <g id="force-vector" class="newton-only" style="display: none;">
            <line id="force-line" x1="400" y1="200" x2="350" y2="200"
                  stroke="#e74c3c" stroke-width="2" marker-end="url(#arrowhead)"/>
            <text id="force-label" x="360" y="190" fill="#e74c3c" font-size="10">F</text>
          </g>

          <!-- Planet (draggable) -->
          <g id="planet-group" class="planet-draggable"
             role="slider" aria-label="Planet position on orbit"
             aria-valuemin="0" aria-valuemax="360" aria-valuenow="0"
             tabindex="0">
            <circle id="planet" cx="400" cy="200" r="12" fill="url(#planetGradient)"/>
          </g>

          <!-- Distance label -->
          <text id="distance-text" x="350" y="195" text-anchor="middle"
                fill="var(--text-muted)" font-size="10">r = 1.00 AU</text>
        </svg>
      </div>

      <!-- Unit toggle -->
      <div class="unit-toggle">
        <button class="unit-btn active" id="btn-unit-101">101</button>
        <button class="unit-btn" id="btn-unit-201">201</button>
      </div>

      <!-- Readout Panel -->
      <div class="readout-panel">
        <div class="readout-item">
          <div class="readout-label">Distance (r)</div>
          <div class="readout-value" id="distance-value">1.00</div>
          <div class="readout-unit">AU</div>
        </div>
        <div class="readout-item">
          <div class="readout-label">Velocity (v)</div>
          <div class="readout-value" id="velocity-value">29.8</div>
          <div class="readout-unit" id="velocity-unit">km/s</div>
        </div>
        <div class="readout-item">
          <div class="readout-label">Acceleration</div>
          <div class="readout-value" id="accel-value">5.93</div>
          <div class="readout-unit" id="accel-unit">mm/s²</div>
        </div>
        <div class="readout-item">
          <div class="readout-label">Period (P)</div>
          <div class="readout-value" id="period-value">1.00</div>
          <div class="readout-unit">years</div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="timeline-panel">
        <div class="timeline-header">
          <span>Orbital Phase</span>
          <span id="phase-display">0.00 / 1.00 yr</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress" style="width: 0%"></div>
          <div class="timeline-handle" id="timeline-handle" style="left: 0%"></div>
        </div>
        <div class="timeline-markers">
          <span>Perihelion</span>
          <span>Aphelion</span>
          <span>Perihelion</span>
        </div>
      </div>

      <!-- Animation Controls -->
      <div class="animation-controls">
        <button class="anim-btn primary" id="btn-play">▶ Play</button>
        <button class="anim-btn" id="btn-pause" disabled>⏸ Pause</button>
        <button class="anim-btn" id="btn-reset">⟲ Reset</button>
        <div class="speed-control">
          <label>Speed:</label>
          <select id="speed-select">
            <option value="0.1">0.1×</option>
            <option value="0.5">0.5×</option>
            <option value="1" selected>1×</option>
            <option value="2">2×</option>
            <option value="5">5×</option>
            <option value="10">10×</option>
          </select>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-grid">
        <div class="control-card">
          <div class="control-title">
            Semi-major Axis (a)
            <span class="control-value" id="a-display">1.00 AU</span>
          </div>
          <input type="range" id="a-slider" class="astro-slider" min="0" max="1000" value="250">
          <div class="slider-labels">
            <span>0.3 AU</span>
            <span>40 AU</span>
          </div>
        </div>

        <div class="control-card">
          <div class="control-title">
            Eccentricity (e)
            <span class="control-value" id="e-display">0.017</span>
          </div>
          <input type="range" id="e-slider" class="astro-slider" min="0" max="990" value="17">
          <div class="slider-labels">
            <span>0 (circle)</span>
            <span>0.99</span>
          </div>
        </div>

        <div class="control-card newton-only" id="mass-control" style="display: none;">
          <div class="control-title">
            Star Mass (M★)
            <span class="control-value" id="mass-display">1.0 M☉</span>
          </div>
          <input type="range" id="mass-slider" class="astro-slider" min="10" max="1000" value="100">
          <div class="slider-labels">
            <span>0.1 M☉</span>
            <span>10 M☉</span>
          </div>
        </div>

        <div class="control-card full-width">
          <div class="control-title">Presets</div>

          <div class="presets-section">
            <div class="presets-label">Solar System</div>
            <div class="presets-row">
              <button class="preset-btn" data-a="0.387" data-e="0.206">Mercury</button>
              <button class="preset-btn" data-a="0.723" data-e="0.007">Venus</button>
              <button class="preset-btn active" data-a="1.000" data-e="0.017">Earth</button>
              <button class="preset-btn" data-a="1.524" data-e="0.093">Mars</button>
              <button class="preset-btn" data-a="5.203" data-e="0.049">Jupiter</button>
              <button class="preset-btn" data-a="39.48" data-e="0.249">Pluto</button>
            </div>
          </div>

          <div class="presets-section">
            <div class="presets-label">Extreme Orbits</div>
            <div class="presets-row">
              <button class="preset-btn" data-a="17.8" data-e="0.967">Halley's Comet</button>
              <button class="preset-btn" data-a="1.0" data-e="0.0">Circular</button>
              <button class="preset-btn" data-a="5.0" data-e="0.9">High Eccentricity</button>
            </div>
          </div>

          <div class="overlays-row">
            <label class="overlay-toggle">
              <input type="checkbox" id="toggle-foci" checked> Foci
            </label>
            <label class="overlay-toggle">
              <input type="checkbox" id="toggle-apsides" checked> Apsides
            </label>
            <label class="overlay-toggle">
              <input type="checkbox" id="toggle-equal-areas"> Equal Areas
            </label>
            <label class="overlay-toggle newton-only" style="display: none;">
              <input type="checkbox" id="toggle-vectors"> Vectors
            </label>
          </div>
        </div>
      </div>

      <!-- Insight Box -->
      <div class="insight-box kepler-mode" id="insight-box">
        <div class="kepler-content">
          <h4>Kepler's Laws (1609–1619)</h4>
          <p>Empirical patterns discovered from Tycho Brahe's observations:</p>
          <p><strong>Law 1:</strong> Planets orbit in <em>ellipses</em> with the Sun at one focus.</p>
          <p><strong>Law 2:</strong> A line from Sun to planet sweeps <em>equal areas in equal times</em>.</p>
          <p class="formula">Law 3: P² = a³ (years, AU)</p>
          <p style="color: var(--text-muted); margin-top: 0.75rem;">
            These are <em>descriptions</em> of what we observe. But <em>why</em>?
            Toggle to Newton Mode to find out →
          </p>
        </div>
        <div class="newton-content" style="display: none;">
          <h4>Newton's Insight (1687)</h4>
          <p>One law explains all three of Kepler's patterns:</p>
          <p class="formula">F = GMm/r²</p>
          <p>Gravity weakens with distance squared. This single force law <em>mathematically implies</em> all of Kepler's empirical laws!</p>
          <p style="margin-top: 0.75rem;"><strong>Current values:</strong></p>
          <p class="formula" id="newton-values">
            v = √(GM(2/r - 1/a)) = 29.8 km/s<br>
            a = GM/r² = 5.93 mm/s²
          </p>
        </div>
      </div>

      <!-- Screen reader announcements -->
      <div id="status-announce" aria-live="polite" aria-atomic="true" class="sr-only"></div>
    </div>
  </div>

  <script src="../_assets/astro-utils.js"></script>
  <script src="../_assets/starfield.js"></script>
  <script src="keplers-laws.js"></script>
</body>
</html>
```

**Step 3: Create empty JS file**

Create `demos/keplers-laws/keplers-laws.js`:

```javascript
/**
 * Kepler's Laws Sandbox
 * Interactive orbital mechanics demonstration
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  // Physical constants
  const G = 6.674e-11;                    // N⋅m²/kg² (SI)
  const M_SUN = 1.989e30;                 // kg
  const AU_KM = 1.496e8;                  // km per AU
  const AU_M = 1.496e11;                  // m per AU
  const YEAR_S = 3.156e7;                 // seconds per year

  // SVG layout
  const SVG_CENTER = { x: 300, y: 200 };
  const SVG_SCALE = 150;                  // pixels per AU at a=1

  // Slider ranges
  const A_MIN = 0.3;                      // AU
  const A_MAX = 40;                       // AU
  const E_MIN = 0;
  const E_MAX = 0.99;
  const M_MIN = 0.1;                      // M☉
  const M_MAX = 10;                       // M☉

  // ============================================
  // State
  // ============================================

  const state = {
    mode: 'kepler',          // 'kepler' | 'newton'
    units: '101',            // '101' | '201'
    a: 1.0,                  // semi-major axis (AU)
    e: 0.017,                // eccentricity
    M: 1.0,                  // star mass (M☉)
    theta: 0,                // true anomaly (radians)
    t: 0,                    // time (years)
    playing: false,
    speed: 1.0,
    animationId: null,

    // Overlay visibility
    overlays: {
      foci: true,
      apsides: true,
      equalAreas: false,
      vectors: false
    }
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // TODO: populate in Task 2
    };
  }

  // ============================================
  // Physics Calculations
  // ============================================

  // TODO: implement in Task 2

  // ============================================
  // Rendering
  // ============================================

  // TODO: implement in Task 3

  // ============================================
  // Controls
  // ============================================

  // TODO: implement in Task 4

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    console.log('Kepler\'s Laws Sandbox initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
```

**Step 4: Create README**

Create `demos/keplers-laws/README.md`:

```markdown
# Kepler's Laws Sandbox

Interactive orbital mechanics demonstration teaching both empirical patterns (Kepler) and underlying physics (Newton).

## Concept

**Kepler Mode:** Empirical patterns - what we observe
- Law 1: Elliptical orbits with Sun at one focus
- Law 2: Equal areas swept in equal times
- Law 3: P² = a³

**Newton Mode:** Physical explanation - why it happens
- Reveals that all three laws are consequences of F = GMm/r²
- Shows force and velocity vectors
- Enables star mass adjustment

## Features

- Draggable planet on orbital path
- Play/Pause animation with adjustable speed
- Parameter sliders (semi-major axis, eccentricity, star mass)
- Solar system presets (Mercury through Pluto)
- Extreme orbit presets (Halley's Comet, circular, high-e)
- Toggleable overlays (foci, apsides, equal areas, vectors)
- Unit toggle for 101 (km/s, m/s²) vs 201 (CGS)

## Key Formulas

```
Orbital radius: r = a(1 - e²) / (1 + e⋅cos(θ))
Orbital velocity: v = √(GM(2/r - 1/a))  [vis-viva equation]
Orbital period: P = 2π√(a³/GM)
Gravitational acceleration: a = GM/r²
```

## Files

- `index.html` - Demo page with all UI elements
- `keplers-laws.js` - Physics, rendering, and interaction logic
- `README.md` - This documentation

## Usage

```html
{{< demo keplers-laws height="700px" >}}
```
```

**Step 5: Verify and commit**

```bash
ls -la demos/keplers-laws/
# Should show: index.html, keplers-laws.js, README.md

git add demos/keplers-laws/
git commit -m "feat(demos): add Kepler's Laws Sandbox file structure

- HTML shell with all UI elements
- JS skeleton with state and constants
- README with concept and formulas

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Implement Physics Calculations

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

**Step 1: Add physics functions**

Add after the State section in `keplers-laws.js`:

```javascript
  // ============================================
  // Physics Calculations
  // ============================================

  /**
   * Calculate orbital radius from true anomaly
   * r = a(1 - e²) / (1 + e⋅cos(θ))
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity
   * @param {number} theta - True anomaly (radians)
   * @returns {number} Orbital radius (AU)
   */
  function orbitalRadius(a, e, theta) {
    if (e === 0) return a;
    return a * (1 - e * e) / (1 + e * Math.cos(theta));
  }

  /**
   * Calculate orbital velocity using vis-viva equation
   * v = √(GM(2/r - 1/a))
   * @param {number} a - Semi-major axis (AU)
   * @param {number} r - Current radius (AU)
   * @param {number} M - Star mass (M☉)
   * @returns {number} Velocity (km/s)
   */
  function orbitalVelocity(a, r, M) {
    // GM in km³/s² for M☉ at 1 AU
    const GM_km3_s2 = 1.327e11 * M;  // GM_sun = 1.327e11 km³/s²
    const a_km = a * AU_KM;
    const r_km = r * AU_KM;
    const v_kms = Math.sqrt(GM_km3_s2 * (2 / r_km - 1 / a_km));
    return v_kms;
  }

  /**
   * Calculate orbital period
   * P = 2π√(a³/GM) — simplifies to P² = a³ for M = 1 M☉
   * @param {number} a - Semi-major axis (AU)
   * @param {number} M - Star mass (M☉)
   * @returns {number} Period (years)
   */
  function orbitalPeriod(a, M) {
    // P² = a³/M for M in solar masses, a in AU, P in years
    return Math.sqrt(a * a * a / M);
  }

  /**
   * Calculate gravitational acceleration
   * a = GM/r²
   * @param {number} r - Distance (AU)
   * @param {number} M - Star mass (M☉)
   * @returns {number} Acceleration (m/s²)
   */
  function gravitationalAccel(r, M) {
    // GM in m³/s² for calculations
    const GM_m3_s2 = 1.327e20 * M;  // GM_sun in m³/s²
    const r_m = r * AU_M;
    return GM_m3_s2 / (r_m * r_m);
  }

  /**
   * Calculate focus offset (c = ae)
   * @param {number} a - Semi-major axis
   * @param {number} e - Eccentricity
   * @returns {number} Distance from center to focus
   */
  function focusOffset(a, e) {
    return a * e;
  }

  /**
   * Calculate semi-minor axis
   * b = a√(1 - e²)
   * @param {number} a - Semi-major axis
   * @param {number} e - Eccentricity
   * @returns {number} Semi-minor axis
   */
  function semiMinorAxis(a, e) {
    return a * Math.sqrt(1 - e * e);
  }

  /**
   * Calculate perihelion distance
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity
   * @returns {number} Perihelion distance (AU)
   */
  function perihelion(a, e) {
    return a * (1 - e);
  }

  /**
   * Calculate aphelion distance
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity
   * @returns {number} Aphelion distance (AU)
   */
  function aphelion(a, e) {
    return a * (1 + e);
  }

  /**
   * Convert true anomaly to mean anomaly (for time calculations)
   * @param {number} theta - True anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} Mean anomaly (radians)
   */
  function trueToMeanAnomaly(theta, e) {
    // Eccentric anomaly: tan(E/2) = √((1-e)/(1+e)) × tan(θ/2)
    const tanHalfTheta = Math.tan(theta / 2);
    const factor = Math.sqrt((1 - e) / (1 + e));
    const E = 2 * Math.atan(factor * tanHalfTheta);
    // Mean anomaly: M = E - e⋅sin(E)
    return E - e * Math.sin(E);
  }

  /**
   * Convert mean anomaly to true anomaly (Kepler's equation)
   * Uses Newton-Raphson iteration
   * @param {number} M - Mean anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} True anomaly (radians)
   */
  function meanToTrueAnomaly(M, e) {
    // Solve Kepler's equation: M = E - e⋅sin(E)
    let E = M;  // Initial guess
    for (let i = 0; i < 10; i++) {
      const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
      E += dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    // True anomaly: tan(θ/2) = √((1+e)/(1-e)) × tan(E/2)
    const factor = Math.sqrt((1 + e) / (1 - e));
    return 2 * Math.atan(factor * Math.tan(E / 2));
  }

  /**
   * Calculate velocity direction angle (perpendicular to radius + flight path angle)
   * @param {number} theta - True anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} Velocity direction angle (radians)
   */
  function velocityAngle(theta, e) {
    // Flight path angle: γ = atan(e⋅sin(θ) / (1 + e⋅cos(θ)))
    const gamma = Math.atan2(e * Math.sin(theta), 1 + e * Math.cos(theta));
    // Velocity is perpendicular to radius + flight path angle
    return theta + Math.PI / 2 + gamma;
  }
```

**Step 2: Verify calculations in browser console**

Open `demos/keplers-laws/index.html` in browser, open console, run:

```javascript
// Test orbital period (should be 1.0 for Earth)
console.log('Earth period:', orbitalPeriod(1.0, 1.0));  // Should be ~1.0

// Test orbital velocity at 1 AU (should be ~29.8 km/s)
console.log('Earth velocity:', orbitalVelocity(1.0, 1.0, 1.0));  // Should be ~29.78

// Test gravitational acceleration at 1 AU (should be ~0.00593 m/s²)
console.log('Earth accel:', gravitationalAccel(1.0, 1.0));  // Should be ~0.00593
```

Note: Functions are in IIFE scope, so expose temporarily for testing:
```javascript
// Add at end of IIFE for testing:
window._test = { orbitalPeriod, orbitalVelocity, gravitationalAccel };
```

**Step 3: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "feat(keplers-laws): implement orbital physics calculations

- orbitalRadius: r from true anomaly using conic section
- orbitalVelocity: vis-viva equation
- orbitalPeriod: P² = a³/M
- gravitationalAccel: GM/r²
- Kepler's equation solver (Newton-Raphson)
- Velocity direction with flight path angle

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Implement DOM Element References and Rendering

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

**Step 1: Add element references**

Replace the `initElements` function:

```javascript
  function initElements() {
    elements = {
      // SVG elements
      orbitSvg: document.getElementById('orbit-svg'),
      orbitPath: document.getElementById('orbit-path'),
      planetGroup: document.getElementById('planet-group'),
      planet: document.getElementById('planet'),
      star: document.getElementById('star'),

      // Foci and apsides
      fociGroup: document.getElementById('foci-group'),
      focus1: document.getElementById('focus-1'),
      focus2: document.getElementById('focus-2'),
      focus1Label: document.getElementById('focus-1-label'),
      apsidesGroup: document.getElementById('apsides-group'),
      perihelionMarker: document.getElementById('perihelion-marker'),
      perihelionLabel: document.getElementById('perihelion-label'),
      aphelionMarker: document.getElementById('aphelion-marker'),
      aphelionLabel: document.getElementById('aphelion-label'),

      // Overlays
      equalAreasGroup: document.getElementById('equal-areas-group'),
      equalAreasWedge: document.getElementById('equal-areas-wedge'),
      velocityVector: document.getElementById('velocity-vector'),
      velocityLine: document.getElementById('velocity-line'),
      forceVector: document.getElementById('force-vector'),
      forceLine: document.getElementById('force-line'),

      // Distance line
      distanceLine: document.getElementById('distance-line'),
      distanceText: document.getElementById('distance-text'),

      // Mode buttons
      btnKeplerMode: document.getElementById('btn-kepler-mode'),
      btnNewtonMode: document.getElementById('btn-newton-mode'),

      // Unit buttons
      btnUnit101: document.getElementById('btn-unit-101'),
      btnUnit201: document.getElementById('btn-unit-201'),

      // Readouts
      distanceValue: document.getElementById('distance-value'),
      velocityValue: document.getElementById('velocity-value'),
      velocityUnit: document.getElementById('velocity-unit'),
      accelValue: document.getElementById('accel-value'),
      accelUnit: document.getElementById('accel-unit'),
      periodValue: document.getElementById('period-value'),

      // Timeline
      timelineTrack: document.getElementById('timeline-track'),
      timelineProgress: document.getElementById('timeline-progress'),
      timelineHandle: document.getElementById('timeline-handle'),
      phaseDisplay: document.getElementById('phase-display'),

      // Animation controls
      btnPlay: document.getElementById('btn-play'),
      btnPause: document.getElementById('btn-pause'),
      btnReset: document.getElementById('btn-reset'),
      speedSelect: document.getElementById('speed-select'),

      // Sliders
      aSlider: document.getElementById('a-slider'),
      aDisplay: document.getElementById('a-display'),
      eSlider: document.getElementById('e-slider'),
      eDisplay: document.getElementById('e-display'),
      massSlider: document.getElementById('mass-slider'),
      massDisplay: document.getElementById('mass-display'),
      massControl: document.getElementById('mass-control'),

      // Presets
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Overlay toggles
      toggleFoci: document.getElementById('toggle-foci'),
      toggleApsides: document.getElementById('toggle-apsides'),
      toggleEqualAreas: document.getElementById('toggle-equal-areas'),
      toggleVectors: document.getElementById('toggle-vectors'),

      // Insight box
      insightBox: document.getElementById('insight-box'),
      newtonValues: document.getElementById('newton-values'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }
```

**Step 2: Add rendering functions**

```javascript
  // ============================================
  // Rendering
  // ============================================

  /**
   * Convert orbital coordinates to SVG coordinates
   * Origin at star, x points right, y points up in orbital plane
   */
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

  /**
   * Update the orbit ellipse path
   */
  function updateOrbitPath() {
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const rx = state.a * scale;
    const ry = semiMinorAxis(state.a, state.e) * scale;
    const c = focusOffset(state.a, state.e) * scale;

    // Ellipse centered so star is at left focus
    elements.orbitPath.setAttribute('cx', SVG_CENTER.x + c);
    elements.orbitPath.setAttribute('cy', SVG_CENTER.y);
    elements.orbitPath.setAttribute('rx', rx);
    elements.orbitPath.setAttribute('ry', ry);
  }

  /**
   * Update planet position
   */
  function updatePlanetPosition() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const pos = orbitalToSvg(r, state.theta);

    elements.planet.setAttribute('cx', pos.x);
    elements.planet.setAttribute('cy', pos.y);
  }

  /**
   * Update foci markers
   */
  function updateFociMarkers() {
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const c = focusOffset(state.a, state.e) * scale;

    // Star at focus 1 (left focus for our orientation)
    elements.star.setAttribute('cx', SVG_CENTER.x);
    elements.star.setAttribute('cy', SVG_CENTER.y);
    elements.focus1.setAttribute('cx', SVG_CENTER.x);
    elements.focus1.setAttribute('cy', SVG_CENTER.y);
    elements.focus1Label.setAttribute('x', SVG_CENTER.x);
    elements.focus1Label.setAttribute('y', SVG_CENTER.y + 35);

    // Focus 2 (empty focus, right side)
    elements.focus2.setAttribute('cx', SVG_CENTER.x + 2 * c);
    elements.focus2.setAttribute('cy', SVG_CENTER.y);

    elements.fociGroup.style.display = state.overlays.foci ? 'block' : 'none';
  }

  /**
   * Update apsides markers
   */
  function updateApsidesMarkers() {
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const c = focusOffset(state.a, state.e) * scale;
    const rx = state.a * scale;

    // Perihelion (closest, left side of ellipse, θ = 0)
    const periX = SVG_CENTER.x - (rx - c);
    elements.perihelionMarker.setAttribute('cx', periX);
    elements.perihelionMarker.setAttribute('cy', SVG_CENTER.y);
    elements.perihelionLabel.setAttribute('x', periX);
    elements.perihelionLabel.setAttribute('y', SVG_CENTER.y + 15);

    const periDist = perihelion(state.a, state.e);
    elements.perihelionLabel.textContent = `Perihelion (${periDist.toFixed(2)} AU)`;

    // Aphelion (farthest, right side, θ = π)
    const aphX = SVG_CENTER.x + (rx + c);
    elements.aphelionMarker.setAttribute('cx', aphX);
    elements.aphelionMarker.setAttribute('cy', SVG_CENTER.y);
    elements.aphelionLabel.setAttribute('x', aphX);
    elements.aphelionLabel.setAttribute('y', SVG_CENTER.y + 15);

    const aphDist = aphelion(state.a, state.e);
    elements.aphelionLabel.textContent = `Aphelion (${aphDist.toFixed(2)} AU)`;

    elements.apsidesGroup.style.display = state.overlays.apsides ? 'block' : 'none';
  }

  /**
   * Update distance line from star to planet
   */
  function updateDistanceLine() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const pos = orbitalToSvg(r, state.theta);

    elements.distanceLine.setAttribute('x1', SVG_CENTER.x);
    elements.distanceLine.setAttribute('y1', SVG_CENTER.y);
    elements.distanceLine.setAttribute('x2', pos.x);
    elements.distanceLine.setAttribute('y2', pos.y);

    // Position label at midpoint
    const midX = (SVG_CENTER.x + pos.x) / 2;
    const midY = (SVG_CENTER.y + pos.y) / 2 - 10;
    elements.distanceText.setAttribute('x', midX);
    elements.distanceText.setAttribute('y', midY);
    elements.distanceText.textContent = `r = ${r.toFixed(2)} AU`;
  }

  /**
   * Update velocity and force vectors (Newton mode)
   */
  function updateVectors() {
    if (state.mode !== 'newton' || !state.overlays.vectors) {
      elements.velocityVector.style.display = 'none';
      elements.forceVector.style.display = 'none';
      return;
    }

    const r = orbitalRadius(state.a, state.e, state.theta);
    const pos = orbitalToSvg(r, state.theta);
    const v = orbitalVelocity(state.a, r, state.M);
    const vAngle = velocityAngle(state.theta, state.e);

    // Scale vectors for visibility
    const vScale = 2;  // pixels per km/s
    const vLen = v * vScale;

    // Velocity vector (tangent to orbit)
    elements.velocityVector.style.display = 'block';
    elements.velocityLine.setAttribute('x1', pos.x);
    elements.velocityLine.setAttribute('y1', pos.y);
    elements.velocityLine.setAttribute('x2', pos.x + vLen * Math.cos(vAngle));
    elements.velocityLine.setAttribute('y2', pos.y - vLen * Math.sin(vAngle));

    // Force vector (toward star)
    const forceAngle = Math.atan2(SVG_CENTER.y - pos.y, SVG_CENTER.x - pos.x);
    const fLen = 40;  // Fixed length for visibility
    elements.forceVector.style.display = 'block';
    elements.forceLine.setAttribute('x1', pos.x);
    elements.forceLine.setAttribute('y1', pos.y);
    elements.forceLine.setAttribute('x2', pos.x + fLen * Math.cos(forceAngle));
    elements.forceLine.setAttribute('y2', pos.y + fLen * Math.sin(forceAngle));
  }

  /**
   * Update readout displays
   */
  function updateReadouts() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const v = orbitalVelocity(state.a, r, state.M);
    const acc = gravitationalAccel(r, state.M);
    const P = orbitalPeriod(state.a, state.M);

    elements.distanceValue.textContent = r.toFixed(2);
    elements.periodValue.textContent = P.toFixed(2);

    // Velocity and acceleration depend on unit mode
    if (state.units === '101') {
      elements.velocityValue.textContent = v.toFixed(1);
      elements.velocityUnit.textContent = 'km/s';

      // Convert m/s² to mm/s² for readability
      elements.accelValue.textContent = (acc * 1000).toFixed(2);
      elements.accelUnit.textContent = 'mm/s²';
    } else {
      // 201 mode: CGS
      elements.velocityValue.textContent = (v * 1e5).toExponential(2);
      elements.velocityUnit.textContent = 'cm/s';

      elements.accelValue.textContent = (acc * 100).toExponential(2);
      elements.accelUnit.textContent = 'cm/s²';
    }

    // Update Newton mode values in insight box
    if (state.mode === 'newton') {
      elements.newtonValues.innerHTML =
        `v = √(GM(2/r - 1/a)) = ${v.toFixed(1)} km/s<br>` +
        `a = GM/r² = ${(acc * 1000).toFixed(2)} mm/s²`;
    }
  }

  /**
   * Update timeline display
   */
  function updateTimeline() {
    const P = orbitalPeriod(state.a, state.M);
    const fraction = (state.t % P) / P;

    elements.timelineProgress.style.width = `${fraction * 100}%`;
    elements.timelineHandle.style.left = `${fraction * 100}%`;
    elements.phaseDisplay.textContent = `${state.t.toFixed(2)} / ${P.toFixed(2)} yr`;
  }

  /**
   * Update slider displays
   */
  function updateSliderDisplays() {
    elements.aDisplay.textContent = `${state.a.toFixed(2)} AU`;
    elements.eDisplay.textContent = state.e.toFixed(3);
    elements.massDisplay.textContent = `${state.M.toFixed(1)} M☉`;
  }

  /**
   * Main update function
   */
  function update() {
    updateOrbitPath();
    updatePlanetPosition();
    updateFociMarkers();
    updateApsidesMarkers();
    updateDistanceLine();
    updateVectors();
    updateReadouts();
    updateTimeline();
    updateSliderDisplays();
  }
```

**Step 3: Call update() in init**

Modify init function:

```javascript
  function init() {
    initElements();
    update();
    console.log('Kepler\'s Laws Sandbox initialized');
  }
```

**Step 4: Verify in browser**

Open demo in browser, should see:
- Elliptical orbit with Sun at focus
- Planet at θ = 0 (perihelion position)
- Distance line from star to planet
- Readouts showing values for Earth orbit

**Step 5: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "feat(keplers-laws): add DOM references and rendering

- initElements populates all UI element references
- orbitalToSvg converts orbital coords to SVG
- updateOrbitPath draws scaled ellipse
- updatePlanetPosition places planet on orbit
- updateFociMarkers, updateApsidesMarkers for overlays
- updateDistanceLine, updateVectors for visual aids
- updateReadouts shows physics values
- update() orchestrates all rendering

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Implement Controls and Interactions

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

**Step 1: Add slider control functions**

```javascript
  // ============================================
  // Controls
  // ============================================

  /**
   * Convert slider value (0-1000) to logarithmic actual value
   */
  function logSliderToValue(sliderVal, min, max) {
    const minLog = Math.log10(min);
    const maxLog = Math.log10(max);
    const fraction = sliderVal / 1000;
    return Math.pow(10, minLog + fraction * (maxLog - minLog));
  }

  /**
   * Convert actual value to slider position (0-1000)
   */
  function valueToLogSlider(value, min, max) {
    const minLog = Math.log10(min);
    const maxLog = Math.log10(max);
    const logVal = Math.log10(value);
    return Math.round(((logVal - minLog) / (maxLog - minLog)) * 1000);
  }

  /**
   * Setup orbital parameter sliders
   */
  function setupSliders() {
    // Semi-major axis (logarithmic)
    elements.aSlider.addEventListener('input', () => {
      state.a = logSliderToValue(parseFloat(elements.aSlider.value), A_MIN, A_MAX);
      clearPresetHighlight();
      update();
    });

    // Eccentricity (linear, 0-990 maps to 0-0.99)
    elements.eSlider.addEventListener('input', () => {
      state.e = parseFloat(elements.eSlider.value) / 1000;
      clearPresetHighlight();
      update();
    });

    // Star mass (linear in Newton mode)
    elements.massSlider.addEventListener('input', () => {
      state.M = parseFloat(elements.massSlider.value) / 100;
      update();
    });
  }

  /**
   * Clear preset button highlighting
   */
  function clearPresetHighlight() {
    elements.presetButtons.forEach(btn => btn.classList.remove('active'));
  }

  /**
   * Setup preset buttons
   */
  function setupPresets() {
    elements.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const a = parseFloat(btn.dataset.a);
        const e = parseFloat(btn.dataset.e);

        state.a = a;
        state.e = e;
        state.theta = 0;  // Reset to perihelion
        state.t = 0;

        // Update sliders to match
        elements.aSlider.value = valueToLogSlider(a, A_MIN, A_MAX);
        elements.eSlider.value = Math.round(e * 1000);

        // Highlight active preset
        clearPresetHighlight();
        btn.classList.add('active');

        update();
      });
    });
  }

  /**
   * Setup overlay toggles
   */
  function setupOverlays() {
    elements.toggleFoci.addEventListener('change', () => {
      state.overlays.foci = elements.toggleFoci.checked;
      update();
    });

    elements.toggleApsides.addEventListener('change', () => {
      state.overlays.apsides = elements.toggleApsides.checked;
      update();
    });

    elements.toggleEqualAreas.addEventListener('change', () => {
      state.overlays.equalAreas = elements.toggleEqualAreas.checked;
      elements.equalAreasGroup.style.display = state.overlays.equalAreas ? 'block' : 'none';
      update();
    });

    elements.toggleVectors.addEventListener('change', () => {
      state.overlays.vectors = elements.toggleVectors.checked;
      update();
    });
  }

  /**
   * Setup mode toggle (Kepler/Newton)
   */
  function setupModeToggle() {
    elements.btnKeplerMode.addEventListener('click', () => {
      state.mode = 'kepler';
      elements.btnKeplerMode.classList.add('active');
      elements.btnNewtonMode.classList.remove('active');

      // Hide Newton-only elements
      elements.massControl.style.display = 'none';
      elements.toggleVectors.parentElement.style.display = 'none';
      document.body.classList.remove('newton-mode');

      // Update insight box
      elements.insightBox.classList.add('kepler-mode');
      elements.insightBox.classList.remove('newton-mode');
      elements.insightBox.querySelector('.kepler-content').style.display = 'block';
      elements.insightBox.querySelector('.newton-content').style.display = 'none';

      update();
    });

    elements.btnNewtonMode.addEventListener('click', () => {
      state.mode = 'newton';
      elements.btnNewtonMode.classList.add('active');
      elements.btnKeplerMode.classList.remove('active');

      // Show Newton-only elements
      elements.massControl.style.display = 'block';
      elements.toggleVectors.parentElement.style.display = 'flex';
      document.body.classList.add('newton-mode');

      // Update insight box
      elements.insightBox.classList.remove('kepler-mode');
      elements.insightBox.classList.add('newton-mode');
      elements.insightBox.querySelector('.kepler-content').style.display = 'none';
      elements.insightBox.querySelector('.newton-content').style.display = 'block';

      update();
    });
  }

  /**
   * Setup unit toggle (101/201)
   */
  function setupUnitToggle() {
    elements.btnUnit101.addEventListener('click', () => {
      state.units = '101';
      elements.btnUnit101.classList.add('active');
      elements.btnUnit201.classList.remove('active');
      update();
    });

    elements.btnUnit201.addEventListener('click', () => {
      state.units = '201';
      elements.btnUnit201.classList.add('active');
      elements.btnUnit101.classList.remove('active');
      update();
    });
  }
```

**Step 2: Add animation controls**

```javascript
  /**
   * Setup animation controls
   */
  function setupAnimation() {
    elements.btnPlay.addEventListener('click', startAnimation);
    elements.btnPause.addEventListener('click', stopAnimation);
    elements.btnReset.addEventListener('click', resetAnimation);

    elements.speedSelect.addEventListener('change', () => {
      state.speed = parseFloat(elements.speedSelect.value);
    });
  }

  /**
   * Start orbital animation
   */
  function startAnimation() {
    if (state.playing) return;

    state.playing = true;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    let lastTime = performance.now();

    function animate(currentTime) {
      if (!state.playing) return;

      const dt = (currentTime - lastTime) / 1000;  // seconds
      lastTime = currentTime;

      // Advance time
      const P = orbitalPeriod(state.a, state.M);
      state.t += dt * state.speed;

      // Convert time to mean anomaly, then to true anomaly
      const meanAnomaly = (2 * Math.PI * state.t / P) % (2 * Math.PI);
      state.theta = meanToTrueAnomaly(meanAnomaly, state.e);

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
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    elements.btnPlay.disabled = false;
    elements.btnPause.disabled = true;
  }

  /**
   * Reset to perihelion
   */
  function resetAnimation() {
    stopAnimation();
    state.theta = 0;
    state.t = 0;
    update();
  }
```

**Step 3: Add planet dragging**

```javascript
  /**
   * Setup planet drag interaction
   */
  function setupPlanetDrag() {
    let isDragging = false;

    function getAngleFromEvent(event) {
      const svg = elements.orbitSvg;
      const pt = svg.createSVGPoint();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      pt.x = clientX;
      pt.y = clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

      // Angle from star to cursor
      return Math.atan2(SVG_CENTER.y - svgP.y, svgP.x - SVG_CENTER.x);
    }

    elements.planetGroup.addEventListener('mousedown', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    });

    elements.planetGroup.addEventListener('touchstart', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      state.theta = getAngleFromEvent(e);
      // Update time to match position
      const P = orbitalPeriod(state.a, state.M);
      const M = trueToMeanAnomaly(state.theta, state.e);
      state.t = (M / (2 * Math.PI)) * P;
      if (state.t < 0) state.t += P;
      update();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      state.theta = getAngleFromEvent(e);
      const P = orbitalPeriod(state.a, state.M);
      const M = trueToMeanAnomaly(state.theta, state.e);
      state.t = (M / (2 * Math.PI)) * P;
      if (state.t < 0) state.t += P;
      update();
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  /**
   * Setup timeline scrubbing
   */
  function setupTimeline() {
    let isDragging = false;

    function updateFromPosition(clientX) {
      const rect = elements.timelineTrack.getBoundingClientRect();
      let fraction = (clientX - rect.left) / rect.width;
      fraction = Math.max(0, Math.min(1, fraction));

      const P = orbitalPeriod(state.a, state.M);
      state.t = fraction * P;
      const meanAnomaly = 2 * Math.PI * fraction;
      state.theta = meanToTrueAnomaly(meanAnomaly, state.e);
      update();
    }

    elements.timelineTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      stopAnimation();
      updateFromPosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateFromPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
  }
```

**Step 4: Wire up init**

Update init function:

```javascript
  function init() {
    initElements();
    setupSliders();
    setupPresets();
    setupOverlays();
    setupModeToggle();
    setupUnitToggle();
    setupAnimation();
    setupPlanetDrag();
    setupTimeline();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    update();
    console.log('Kepler\'s Laws Sandbox initialized');
  }
```

**Step 5: Test in browser**

- Drag planet around orbit
- Adjust sliders (a, e)
- Click presets (Mercury, Halley's)
- Toggle Kepler/Newton modes
- Play/Pause animation
- Scrub timeline

**Step 6: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "feat(keplers-laws): add all controls and interactions

- Logarithmic slider for semi-major axis
- Linear slider for eccentricity
- Star mass slider (Newton mode only)
- Preset buttons for solar system objects
- Mode toggle (Kepler/Newton)
- Unit toggle (101/201)
- Animation play/pause/reset with speed control
- Planet drag interaction
- Timeline scrubbing

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Add Keyboard Navigation and Accessibility

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

**Step 1: Add keyboard navigation**

```javascript
  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    // Planet group keyboard controls
    elements.planetGroup.addEventListener('keydown', (event) => {
      const P = orbitalPeriod(state.a, state.M);
      let delta = 0;
      let jumpAngle = null;

      switch (event.key) {
        case 'ArrowLeft':
          delta = event.shiftKey ? -0.01 : -0.05;
          break;
        case 'ArrowRight':
          delta = event.shiftKey ? 0.01 : 0.05;
          break;
        case 'Home':
          jumpAngle = 0;  // Perihelion
          break;
        case 'End':
          jumpAngle = Math.PI;  // Aphelion
          break;
        case ' ':
          event.preventDefault();
          if (state.playing) {
            stopAnimation();
          } else {
            startAnimation();
          }
          return;
        default:
          return;
      }

      event.preventDefault();
      stopAnimation();

      if (jumpAngle !== null) {
        state.theta = jumpAngle;
        const M = trueToMeanAnomaly(state.theta, state.e);
        state.t = ((M + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * P;
      } else if (delta !== 0) {
        // Convert current position to mean anomaly, adjust, convert back
        const M = trueToMeanAnomaly(state.theta, state.e);
        const newM = (M + delta * 2 * Math.PI + 2 * Math.PI) % (2 * Math.PI);
        state.theta = meanToTrueAnomaly(newM, state.e);
        state.t = newM / (2 * Math.PI) * P;
      }

      update();
      announcePosition();
    });

    // Focus styling
    elements.planetGroup.addEventListener('focus', () => {
      elements.planet.setAttribute('stroke', 'var(--accent-gold)');
      elements.planet.setAttribute('stroke-width', '3');
    });

    elements.planetGroup.addEventListener('blur', () => {
      elements.planet.removeAttribute('stroke');
      elements.planet.removeAttribute('stroke-width');
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

      switch (event.key) {
        case 'k':
        case 'K':
          elements.btnKeplerMode.click();
          break;
        case 'n':
        case 'N':
          elements.btnNewtonMode.click();
          break;
        case '1':
          selectPresetByIndex(0);
          break;
        case '2':
          selectPresetByIndex(1);
          break;
        case '3':
          selectPresetByIndex(2);
          break;
        case '4':
          selectPresetByIndex(3);
          break;
        case '5':
          selectPresetByIndex(4);
          break;
        case '6':
          selectPresetByIndex(5);
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

  function announcePosition() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const v = orbitalVelocity(state.a, r, state.M);
    const phasePct = ((state.theta / (2 * Math.PI)) * 100).toFixed(0);

    let position = 'orbit';
    if (Math.abs(state.theta) < 0.1) position = 'perihelion';
    else if (Math.abs(state.theta - Math.PI) < 0.1) position = 'aphelion';

    elements.statusAnnounce.textContent =
      `${position}, distance ${r.toFixed(2)} AU, velocity ${v.toFixed(1)} km/s, ${phasePct}% through orbit`;

    // Update ARIA attributes
    elements.planetGroup.setAttribute('aria-valuenow', Math.round(state.theta * 180 / Math.PI));
    elements.planetGroup.setAttribute('aria-valuetext',
      `${position}, ${r.toFixed(2)} AU from star`);
  }
```

**Step 2: Wire up in init**

Add to init function before update():

```javascript
    setupKeyboard();
```

**Step 3: Test accessibility**

- Tab to planet, use arrow keys
- Press Home/End for perihelion/aphelion
- Press Space to play/pause
- Press K/N for mode toggle
- Press 1-6 for presets

**Step 4: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "feat(keplers-laws): add keyboard navigation and accessibility

- Arrow keys to move planet along orbit
- Home/End for perihelion/aphelion
- Space to play/pause
- K/N for Kepler/Newton mode
- Number keys for presets
- ARIA live region announcements
- Focus styling for planet

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Add Equal Areas Visualization

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

**Step 1: Add equal areas rendering**

Add this function after updateVectors():

```javascript
  /**
   * Update equal areas wedge visualization (Kepler's 2nd Law)
   * Shows that equal areas are swept in equal times
   */
  function updateEqualAreas() {
    if (!state.overlays.equalAreas) {
      elements.equalAreasGroup.style.display = 'none';
      return;
    }

    elements.equalAreasGroup.style.display = 'block';

    // Draw a wedge from a fixed time ago to current position
    const P = orbitalPeriod(state.a, state.M);
    const sweepTime = P * 0.1;  // 10% of orbit

    const currentM = trueToMeanAnomaly(state.theta, state.e);
    const startM = currentM - (sweepTime / P) * 2 * Math.PI;
    const startTheta = meanToTrueAnomaly(startM, state.e);

    // Build SVG path for wedge
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const numPoints = 30;
    let pathD = `M ${SVG_CENTER.x} ${SVG_CENTER.y}`;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const theta = startTheta + t * (state.theta - startTheta);
      const r = orbitalRadius(state.a, state.e, theta);
      const pos = orbitalToSvg(r, theta);
      pathD += ` L ${pos.x} ${pos.y}`;
    }

    pathD += ' Z';
    elements.equalAreasWedge.setAttribute('d', pathD);
  }
```

**Step 2: Add to update function**

In the update() function, add:

```javascript
    updateEqualAreas();
```

**Step 3: Test**

- Toggle "Equal Areas" checkbox
- Animate the orbit
- Verify wedge sweeps equal areas (wider when closer to star)

**Step 4: Commit**

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "feat(keplers-laws): add equal areas wedge visualization

Kepler's 2nd Law: the wedge from star to planet sweeps
equal areas in equal times - wider at perihelion, narrower
at aphelion, demonstrating the relationship between
orbital speed and distance.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Final Polish and Testing

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`
- Modify: `demos/keplers-laws/README.md`

**Step 1: Add console validation for key formulas**

Add a validation function (can be removed after testing):

```javascript
  /**
   * Validate physics calculations against known values
   */
  function validatePhysics() {
    console.log('=== Physics Validation ===');

    // Earth: P = 1 year, v = 29.78 km/s, a = 5.93 mm/s²
    const earthP = orbitalPeriod(1.0, 1.0);
    const earthV = orbitalVelocity(1.0, 1.0, 1.0);
    const earthA = gravitationalAccel(1.0, 1.0);
    console.log(`Earth (a=1AU, M=1M☉):`);
    console.log(`  Period: ${earthP.toFixed(4)} yr (expected: 1.0000)`);
    console.log(`  Velocity: ${earthV.toFixed(2)} km/s (expected: 29.78)`);
    console.log(`  Accel: ${(earthA*1000).toFixed(2)} mm/s² (expected: 5.93)`);

    // Jupiter: P = 11.86 years
    const jupP = orbitalPeriod(5.203, 1.0);
    console.log(`Jupiter (a=5.203AU): Period = ${jupP.toFixed(2)} yr (expected: 11.86)`);

    // Kepler's 3rd Law: P² = a³
    const p2 = earthP * earthP;
    const a3 = 1.0 * 1.0 * 1.0;
    console.log(`Kepler 3rd Law: P²=${p2.toFixed(4)}, a³=${a3.toFixed(4)} (should match)`);

    console.log('=========================');
  }
```

Call in init: `validatePhysics();`

**Step 2: Run validation in browser console**

Expected output:
```
=== Physics Validation ===
Earth (a=1AU, M=1M☉):
  Period: 1.0000 yr (expected: 1.0000)
  Velocity: 29.78 km/s (expected: 29.78)
  Accel: 5.93 mm/s² (expected: 5.93)
Jupiter (a=5.203AU): Period = 11.86 yr (expected: 11.86)
Kepler 3rd Law: P²=1.0000, a³=1.0000 (should match)
=========================
```

**Step 3: Remove validation call, keep function**

Comment out `validatePhysics();` in init but keep the function for future debugging.

**Step 4: Update README with usage instructions**

Add to README.md:

```markdown
## Controls

### Mouse/Touch
- **Drag planet** around orbit to change position
- **Click timeline** to jump to orbital phase
- **Adjust sliders** for orbital parameters

### Keyboard
- **Arrow Left/Right**: Move planet along orbit (Shift for fine control)
- **Home**: Jump to perihelion
- **End**: Jump to aphelion
- **Space**: Play/Pause animation
- **K**: Kepler Mode
- **N**: Newton Mode
- **1-6**: Quick preset selection

### Accessibility
- Full keyboard navigation
- Screen reader announcements for position changes
- ARIA attributes on interactive elements
```

**Step 5: Final commit**

```bash
git add demos/keplers-laws/
git commit -m "feat(keplers-laws): complete Kepler's Laws Sandbox demo

Interactive orbital mechanics demonstration with:
- Kepler/Newton mode toggle
- Real solar system presets
- Equal areas visualization (Kepler's 2nd Law)
- Velocity and force vectors (Newton mode)
- Full keyboard navigation and accessibility
- Physics validated against known values

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

| Task | Description | Commit |
|------|-------------|--------|
| 1 | File structure and HTML shell | `feat: add file structure` |
| 2 | Physics calculations | `feat: implement orbital physics` |
| 3 | DOM references and rendering | `feat: add rendering` |
| 4 | Controls and interactions | `feat: add controls` |
| 5 | Keyboard and accessibility | `feat: add keyboard navigation` |
| 6 | Equal areas visualization | `feat: add equal areas wedge` |
| 7 | Polish and validation | `feat: complete demo` |

**Total: 7 commits, one complete demo**

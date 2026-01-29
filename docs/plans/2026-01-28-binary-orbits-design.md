# Binary Orbits Demo Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an interactive two-body orbital mechanics demo with proper center-of-mass physics, supporting both star+planet and binary star systems.

**Architecture:** New standalone demo at `demos/binary-orbits/` using shared stellar utilities. Both bodies orbit the barycenter with correct physics—even planets cause measurable stellar wobble.

**Tech Stack:** Vanilla JS, SVG rendering, KaTeX for formulas, shared `stellar-utils.js`

---

## 1. Architecture Overview

### File Structure

```
demos/
├── _assets/
│   └── stellar-utils.js    # NEW: shared stellar property utilities
├── binary-orbits/
│   ├── index.html
│   ├── binary-orbits.js
│   ├── binary-orbits.css
│   └── README.md
└── blackbody-radiation/
    └── blackbody.js         # Refactor to use stellar-utils.js
```

### Design Principles

- **Two-body physics as default**: Center of mass correctly modeled, nothing held fixed
- **Separate from keplers-laws**: Keep intro demo simple and stable for class use
- **Shared utilities**: Extract stellar properties to reusable module

---

## 2. Shared Stellar Utilities

Create `demos/_assets/stellar-utils.js`:

```javascript
// demos/_assets/stellar-utils.js
// Shared stellar property utilities for ASTR 101 demos

const StellarUtils = (function() {
  'use strict';

  // === Mass → Physical Properties (Main Sequence) ===

  // Mass-luminosity relation: L/L☉
  function massToLuminosity(M) {
    if (M < 0.43) return 0.23 * Math.pow(M, 2.3);
    if (M < 2)    return Math.pow(M, 4);
    if (M < 55)   return 1.4 * Math.pow(M, 3.5);
    return 32000 * M;
  }

  // Mass-radius relation: R/R☉ ∝ M^0.8
  function massToRadius(M) {
    return Math.pow(M, 0.8);
  }

  // Effective temperature from L = 4πR²σT⁴
  // T/T☉ = (L/R²)^0.25
  function massToTemperature(M) {
    const L = massToLuminosity(M);
    const R = massToRadius(M);
    return 5778 * Math.pow(L / (R * R), 0.25);  // K
  }

  // Spectral type from temperature
  function temperatureToSpectralType(T) {
    if (T >= 30000) return 'O';
    if (T >= 10000) return 'B';
    if (T >= 7500)  return 'A';
    if (T >= 6000)  return 'F';
    if (T >= 5200)  return 'G';
    if (T >= 3700)  return 'K';
    if (T >= 2400)  return 'M';
    return 'L+';
  }

  // Temperature to RGB color (blackbody approximation)
  function temperatureToColor(T) {
    let r, g, b;

    if (T < 1000) {
      r = Math.min(255, T / 4);
      g = 0;
      b = 0;
    } else if (T < 4000) {
      r = 255;
      g = Math.min(255, (T - 1000) / 12);
      b = 0;
    } else if (T < 6500) {
      r = 255;
      g = Math.min(255, 180 + (T - 4000) / 35);
      b = Math.min(255, (T - 4000) / 10);
    } else if (T < 10000) {
      r = Math.max(200, 255 - (T - 6500) / 30);
      g = Math.max(200, 255 - (T - 6500) / 50);
      b = 255;
    } else {
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

  // Convenience: mass → color (via temperature)
  function massToColor(M) {
    const T = massToTemperature(M);
    return temperatureToColor(T);
  }

  function massToSpectralType(M) {
    const T = massToTemperature(M);
    return temperatureToSpectralType(T);
  }

  // === Unit Conversion ===

  const UNITS = {
    velocity: {
      'km/s':  { factor: 1,        label: 'km/s' },
      'AU/yr': { factor: 4.74047,  label: 'AU/yr' },
      'm/s':   { factor: 0.001,    label: 'm/s' },
      'cm/s':  { factor: 0.00001,  label: 'cm/s' }
    },
    period: {
      'yr':   { factor: 1,         label: 'yr' },
      'days': { factor: 365.25,    label: 'days' },
      'hr':   { factor: 8766,      label: 'hr' }
    },
    distance: {
      'AU':   { factor: 1,         label: 'AU' },
      'km':   { factor: 1.496e8,   label: 'km' },
      'R☉':   { factor: 215.03,    label: 'R☉' }
    }
  };

  function convertVelocity(v_kms, targetUnit) {
    return v_kms / UNITS.velocity[targetUnit].factor;
  }

  function formatVelocity(v_kms, targetUnit) {
    const converted = convertVelocity(v_kms, targetUnit);
    const label = UNITS.velocity[targetUnit].label;

    if (Math.abs(converted) >= 1000) {
      return `${converted.toExponential(2)} ${label}`;
    } else if (Math.abs(converted) >= 1) {
      return `${converted.toPrecision(3)} ${label}`;
    } else {
      return `${converted.toExponential(2)} ${label}`;
    }
  }

  return {
    massToLuminosity,
    massToRadius,
    massToTemperature,
    massToColor,
    massToSpectralType,
    temperatureToColor,
    temperatureToSpectralType,
    convertVelocity,
    formatVelocity,
    UNITS
  };
})();

if (typeof module !== 'undefined') module.exports = StellarUtils;
```

---

## 3. Two-Body Physics

### Core Equations

```javascript
// Barycenter position: x_cm = M2 / (M1 + M2) × separation
function barycenterFraction(M1, M2) {
  return M2 / (M1 + M2);
}

// Individual semi-major axes (each body's orbit around barycenter)
function individualSemiMajor(a_rel, M1, M2) {
  const M_tot = M1 + M2;
  return {
    a1: a_rel * M2 / M_tot,  // Body 1's orbit size
    a2: a_rel * M1 / M_tot   // Body 2's orbit size
  };
}

// Orbital period (Kepler's 3rd with total mass)
// P² = a³ / (M1 + M2)  [solar units: yr, AU, M☉]
function orbitalPeriod(a_rel, M1, M2) {
  return Math.sqrt(Math.pow(a_rel, 3) / (M1 + M2));
}

// Orbital velocity at distance r (vis-viva equation)
// v = √(G(M1+M2)(2/r - 1/a))
function orbitalVelocity(r, a, M1, M2) {
  const G_solar = 4 * Math.PI * Math.PI;  // AU³/yr²/M☉
  return Math.sqrt(G_solar * (M1 + M2) * (2/r - 1/a));
}

// Gravitational acceleration
function gravAcceleration(r, M_other) {
  const G_solar = 4 * Math.PI * Math.PI;
  return G_solar * M_other / (r * r);
}
```

### Key Physics Points

- Both bodies orbit the barycenter with the **same period**
- Bodies are always on **opposite sides** of barycenter (θ₁ = θ₂ + π)
- Orbit sizes inversely proportional to masses: a₁/a₂ = M₂/M₁
- Even Earth causes Sun to wobble by ~450 km (detectable!)

---

## 4. UI Layout

### SVG Visualization

```html
<svg id="orbit-svg" viewBox="0 0 600 600">
  <!-- Barycenter marker -->
  <circle id="barycenter" cx="300" cy="300" r="4" fill="#888"/>

  <!-- Orbit paths -->
  <ellipse id="orbit-1" class="orbit-path" stroke="#5dade2"/>
  <ellipse id="orbit-2" class="orbit-path" stroke="#e74c3c"/>

  <!-- Bodies (colored by temperature) -->
  <circle id="body-1" class="body"/>
  <circle id="body-2" class="body"/>

  <!-- Vector overlays (optional) -->
  <g id="velocity-vectors" class="vector-group"/>
  <g id="accel-vectors" class="vector-group"/>
  <g id="force-vectors" class="vector-group"/>
</svg>
```

### Control Panel

```html
<!-- System Type Selector -->
<div class="system-selector">
  <label>System:</label>
  <select id="system-type">
    <option value="star-planet">Star + Planet</option>
    <option value="binary-star">Binary Star</option>
  </select>
</div>

<!-- Mass Sliders -->
<div class="mass-controls">
  <div class="slider-group">
    <label>M₁: <span id="m1-display">1.0 M☉</span></label>
    <input type="range" id="m1-slider" min="-1" max="2" step="0.01" value="0">
    <!-- Log scale: 0.1 to 100 M☉ -->
  </div>
  <div class="slider-group">
    <label>M₂: <span id="m2-display">1.0 M☉</span></label>
    <input type="range" id="m2-slider" min="-1" max="2" step="0.01" value="0">
  </div>
</div>

<!-- Orbital Parameters -->
<div class="orbital-controls">
  <div class="slider-group">
    <label>Separation: <span id="a-display">1.0 AU</span></label>
    <input type="range" id="a-slider" min="-2" max="2" step="0.01" value="0">
  </div>
  <div class="slider-group">
    <label>Eccentricity: <span id="e-display">0.0</span></label>
    <input type="range" id="e-slider" min="0" max="0.95" step="0.01" value="0">
  </div>
</div>

<!-- Unit Selectors -->
<div class="unit-selectors">
  <div class="unit-select">
    <label for="velocity-unit">Velocity:</label>
    <select id="velocity-unit">
      <option value="AU/yr">AU/yr</option>
      <option value="km/s">km/s</option>
      <option value="m/s">m/s</option>
      <option value="cm/s">cm/s (CGS)</option>
    </select>
  </div>
  <div class="unit-select">
    <label for="period-unit">Period:</label>
    <select id="period-unit">
      <option value="yr">years</option>
      <option value="days">days</option>
    </select>
  </div>
</div>
```

### Readout Panel

| Quantity | Description |
|----------|-------------|
| Period | Orbital period in selected units |
| v₁, v₂ | Current velocities in selected units |
| a₁, a₂ | Individual orbit sizes |
| r | Current separation |
| T₁, T₂ | Effective temperatures |
| Type₁, Type₂ | Spectral types |

---

## 5. Vector Overlays

```javascript
state.overlays = {
  velocity: true,      // v₁, v₂ tangent to orbits (cyan)
  acceleration: false, // a₁, a₂ toward barycenter (amber)
  force: false,        // F₁₂, F₂₁ Newton's 3rd law pair (red)
};
```

### Pedagogical Value

- **Velocity:** Always tangent, faster at periapsis
- **Acceleration:** Always toward barycenter, ∝ 1/r²
- **Force:** Equal and opposite (F₁₂ = -F₂₁), Newton's 3rd law

---

## 6. Presets

### Star + Planet

| Preset | M₁ (M☉) | M₂ (M☉) | a (AU) | e | Notes |
|--------|---------|---------|--------|---|-------|
| Sun + Earth | 1.0 | 3×10⁻⁶ | 1.0 | 0.017 | Reference |
| Sun + Jupiter | 1.0 | 9.5×10⁻⁴ | 5.2 | 0.049 | Giant planet |
| Hot Jupiter | 1.0 | 10⁻³ | 0.05 | 0.02 | ~5-day orbit |
| Proxima b | 0.12 | 4×10⁻⁶ | 0.049 | 0.11 | Red dwarf system |

### Binary Star

| Preset | M₁ (M☉) | M₂ (M☉) | a (AU) | e | Notes |
|--------|---------|---------|--------|---|-------|
| α Centauri AB | 1.1 | 0.91 | 23.4 | 0.52 | Nearby binary |
| Sirius AB | 2.06 | 1.02 | 19.8 | 0.59 | With white dwarf |
| Equal Mass | 1.0 | 1.0 | 1.0 | 0.0 | Symmetric |
| Massive O+O | 50 | 40 | 0.5 | 0.3 | High-mass binary |

---

## 7. Interactions

| Input | Action |
|-------|--------|
| Drag body | Move along orbit (change θ) |
| Space | Play/Pause animation |
| Arrow Left/Right | Step through orbit |
| Shift + Arrow | Fine control |
| 1-8 | Quick preset selection |
| K/N | Kepler/Newton mode |

---

## 8. Context-Aware Defaults

```javascript
function setDefaultUnits(systemType) {
  if (systemType === 'star-planet') {
    state.units.velocity = 'AU/yr';
    state.units.period = 'yr';
  } else {  // binary-star
    state.units.velocity = 'km/s';
    state.units.period = 'days';
  }
  updateUnitSelectors();
}
```

---

## 9. Future Extensions

| Extension | Description | Priority |
|-----------|-------------|----------|
| **Doppler RV curve** | Show radial velocity vs time plot | High |
| **Tidal forces** | Differential gravity visualization | Medium |
| **Roche lobes** | Mass transfer in close binaries | Medium |
| **Light curve** | Eclipse timing for transits | Medium |
| **GR precession** | Post-Newtonian apsidal advance | Low |

### Tidal Force Extension (Future)

```javascript
// Tidal acceleration = differential gravity across body diameter
// a_tidal ≈ 2GM × d / r³
function tidalAcceleration(M_other, r, d_body) {
  return 2 * G * M_other * d_body / Math.pow(r, 3);
}
```

---

## Implementation Notes

1. **Keep keplers-laws stable**: This is a new demo, not a modification
2. **Refactor blackbody**: Extract `temperatureToColor()` to shared utils
3. **Test physics**: Verify period, velocities match known systems
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader announcements

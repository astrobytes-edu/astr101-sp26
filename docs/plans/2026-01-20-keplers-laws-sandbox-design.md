# Kepler's Laws Sandbox — Design Document

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create implementation plan after this design is approved.

**Goal:** Interactive orbital mechanics demo teaching both empirical patterns (Kepler) and underlying physics (Newton), suitable for Astro 101 (qualitative) and 201 (quantitative).

**Core Pedagogical Insight:** Kepler's three empirical laws are *consequences* of Newton's single gravitational force law.

---

## 1. Core Concept

### Two Modes

| Mode | Default | Purpose |
|------|---------|---------|
| **Kepler Mode** | ✓ | Empirical patterns — what we observe |
| **Newton Mode** | | Physical explanation — why it happens |

**Toggle:** Prominent switch at top of demo: `[KEPLER MODE] ↔ [NEWTON MODE]`

### Kepler Mode Shows:
- Elliptical orbit with Sun at focus (Law 1)
- Equal-areas wedge visualization (Law 2, toggleable)
- Period readout satisfying P² = a³ (Law 3)
- No force vectors, no equations

### Newton Mode Reveals:
- Everything from Kepler mode, PLUS:
- Force vector (always pointing at star)
- Velocity vector (tangent to orbit)
- Acceleration vector (toward star)
- Full equations in insight box
- Star mass slider becomes active (affects period)

---

## 2. Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Kepler's Laws Sandbox                    [KEPLER ↔ NEWTON] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         ☀                                   │
│                        /   \                                │
│                       /     ● ← Planet (draggable)          │
│                      /       \                              │
│                     (  orbit  )                             │
│                      \       /                              │
│                       \     /                               │
│                        \   /                                │
│                                                             │
│  ──────────────────────────────────────────────────────     │
│  Timeline: [●────────────────────────] 0.5 / 1.0 yr         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  READOUTS                                      [101] [201]  │
│  Distance: 1.00 AU │ Velocity: 29.8 km/s │ Period: 1.00 yr  │
│  Accel: 5.93 mm/s² │ a = 1.00 AU │ e = 0.017 │ M★ = 1.0 M☉  │
├─────────────────────────────────────────────────────────────┤
│  CONTROLS                                                   │
│                                                             │
│  Semi-major axis (a): [─────●─────] 1.00 AU                 │
│  Eccentricity (e):    [●──────────] 0.017                   │
│  Star mass (M★):      [─────●─────] 1.0 M☉  (Newton only)   │
│                                                             │
│  [▶ Play] [⟲ Reset] Speed: [───●───] 1.0×                   │
│                                                             │
│  PRESETS                                                    │
│  Solar System: [Mercury] [Venus] [Earth] [Mars] [Jupiter]   │
│  Extreme:      [Halley's] [Circular] [High-e] [Pluto]       │
├─────────────────────────────────────────────────────────────┤
│  OVERLAYS  ☑ Foci  ☑ Apsides  ☐ Equal Areas  ☐ Vectors      │
├─────────────────────────────────────────────────────────────┤
│  INSIGHT BOX (toggleable)                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Law 1: Orbits are ellipses with Sun at one focus   │    │
│  │ Law 2: Equal areas in equal times (faster near ☉)  │    │
│  │ Law 3: P² = a³  →  Period = 1.00 years ✓           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Overlays (Toggleable)

| Overlay | Default | Description |
|---------|---------|-------------|
| **Foci markers** | ON | Both foci marked; Sun at one focus |
| **Apsides labels** | ON | Perihelion/Aphelion with AU labels |
| **Equal areas** | OFF | Animated wedge sweeping equal areas |
| **Velocity vectors** | OFF | v⃗ tangent to orbit, scaled by speed |
| **Force/Accel** | OFF (Newton only) | F⃗ and a⃗ pointing toward star |

---

## 4. Readout Panel

### 101 Mode (default)
| Quantity | Units | Example |
|----------|-------|---------|
| Distance (r) | AU | 1.00 AU |
| Velocity (v) | km/s | 29.8 km/s |
| Acceleration | m/s² | 0.00593 m/s² |
| Period (P) | years | 1.00 yr |
| Semi-major axis (a) | AU | 1.00 AU |
| Eccentricity (e) | — | 0.017 |
| Star mass (M★) | M☉ | 1.0 M☉ |

### 201 Mode
| Quantity | Units | Notes |
|----------|-------|-------|
| Distance (r) | AU or cm | Scientific notation for cm |
| Velocity (v) | km/s or cm/s | Toggle available |
| Acceleration | cm/s² | CGS standard |
| Period (P) | years or seconds | |
| Force (F) | dynes | Newton mode only |

---

## 5. Parameter Controls

### Sliders

| Parameter | Range | Default | Scale | Notes |
|-----------|-------|---------|-------|-------|
| Semi-major axis (a) | 0.3–40 AU | 1.0 AU | Logarithmic | |
| Eccentricity (e) | 0.00–0.99 | 0.017 | Linear | |
| Star mass (M★) | 0.1–10 M☉ | 1.0 M☉ | Linear | Grayed in Kepler mode |

### Presets

**Solar System:**
| Preset | a (AU) | e | Notes |
|--------|--------|---|-------|
| Mercury | 0.387 | 0.206 | High eccentricity inner planet |
| Venus | 0.723 | 0.007 | Nearly circular |
| Earth | 1.000 | 0.017 | Reference orbit |
| Mars | 1.524 | 0.093 | Moderate eccentricity |
| Jupiter | 5.203 | 0.049 | Giant planet |
| Pluto | 39.48 | 0.249 | Dwarf planet, high e |

**Extreme Orbits:**
| Preset | a (AU) | e | Notes |
|--------|--------|---|-------|
| Halley's Comet | 17.8 | 0.967 | Extreme eccentricity |
| Circular | 1.0 | 0.000 | Perfect circle |
| High Eccentricity | 5.0 | 0.900 | Comet-like |

---

## 6. Animation Controls

| Control | Function |
|---------|----------|
| **Play/Pause** | Toggle orbital motion |
| **Reset** | Return to perihelion, t = 0 |
| **Speed slider** | 0.1× to 10× real time |
| **Timeline strip** | Clickable progress bar, jump to any phase |

### Timeline Strip
- Shows orbital phase from 0 to P
- Current position marked with handle
- Tick marks at: perihelion (0), aphelion (P/2)
- Draggable to scrub through orbit

---

## 7. Interaction Modes

All three active simultaneously:

1. **Drag planet** — Click and drag planet along orbit path; phase updates instantly
2. **Animation** — Play button advances planet; equal-areas wedge animates
3. **Sliders** — Adjust parameters; orbit reshapes in real-time

---

## 8. Key Formulas

### Always Available (Kepler Mode)
```
Law 3: P² = a³  (P in years, a in AU)
```

### Newton Mode Reveals
```
Gravitational Force:
F = GMm/r²

Orbital Velocity (vis-viva equation):
v = √(GM(2/r - 1/a))

Centripetal Acceleration:
a = GM/r² = v²/r

Period from Newton:
P = 2π√(a³/GM)
```

### Insight Box Content

**Kepler Mode:**
> **Kepler's Laws** (1609–1619) — Empirical patterns discovered from Tycho Brahe's observations:
>
> 1. Planets orbit in **ellipses** with the Sun at one focus
> 2. A line from Sun to planet sweeps **equal areas in equal times**
> 3. **P² = a³** — orbital period squared equals semi-major axis cubed
>
> These are *descriptions* of what we observe. But *why* do planets behave this way?

**Newton Mode:**
> **Newton's Insight** (1687) — One law explains all three patterns:
>
> **F = GMm/r²**
>
> Gravity weakens with distance squared. This single force law *mathematically implies* all of Kepler's empirical laws!
>
> Current values:
> - Force on planet: F = [value] N
> - Velocity: v = [value] km/s
> - Acceleration toward Sun: a = [value] m/s²

---

## 9. Accessibility

| Feature | Implementation |
|---------|----------------|
| Keyboard navigation | Tab through controls, arrow keys adjust sliders |
| Screen reader | ARIA labels on all controls, live region for readouts |
| Reduced motion | Respect `prefers-reduced-motion`, disable auto-animation |
| Color independence | Overlays use icons + text, not just color |

---

## 10. Technical Architecture

### Files
```
demos/keplers-laws/
├── index.html          # Standalone demo page
├── keplers-laws.js     # Main logic
├── keplers-laws.css    # Demo-specific styles (if needed)
└── README.md           # Documentation
```

### Shared Assets
- `demos/_assets/astro-theme.css` — Dark space theme
- `demos/_assets/astro-utils.js` — Animation utilities
- `demos/_assets/starfield.js` — Background stars

### Key Classes/Functions
```javascript
// State
const state = {
  mode: 'kepler',        // 'kepler' | 'newton'
  units: '101',          // '101' | '201'
  a: 1.0,                // semi-major axis (AU)
  e: 0.017,              // eccentricity
  M: 1.0,                // star mass (M☉)
  theta: 0,              // true anomaly (radians)
  playing: false,
  speed: 1.0
};

// Physics
function orbitalRadius(a, e, theta) { ... }
function orbitalVelocity(a, e, r, M) { ... }
function orbitalPeriod(a, M) { ... }
function gravitationalAccel(r, M) { ... }

// Rendering
function drawOrbit(ctx, a, e) { ... }
function drawPlanet(ctx, x, y) { ... }
function drawVectors(ctx, state) { ... }
function updateReadouts(state) { ... }
```

---

## 11. Future Enhancements (Not in V1)

- Multiple planets (show resonances)
- 3D view toggle
- Retrograde motion visualization
- Binary star systems
- Hohmann transfer orbits
- Export orbital parameters

---

## Design Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Kepler mode default | ✓ | Empirical before physical (historical order) |
| Unit toggle 101/201 | ✓ | Supports both courses without clutter |
| Star mass grayed in Kepler | ✓ | Reinforces "mass doesn't appear in Kepler's laws" |
| Three interaction modes | ✓ | Flexibility for different learning styles |
| Equal areas OFF by default | ✓ | Avoid visual clutter; reveal on demand |

---

*Design completed: 2026-01-20*
*Ready for implementation planning*

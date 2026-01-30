# AstroEd Demos

**Interactive astronomy visualizations for undergraduate education.**

Created and designed by **Anna Rosen**, Assistant Professor of Astronomy at San Diego State University, with AI assistance.

---

## Overview

AstroEd Demos is a collection of interactive, browser-based visualizations designed to help students build intuition for fundamental astronomical concepts. Each demo is:

- **Standalone** — Pure HTML/CSS/JavaScript, no frameworks or build tools
- **Portable** — Works offline, embeds anywhere, easy to share
- **Pedagogically designed** — Addresses common misconceptions, includes instructor notes
- **Scientifically accurate** — Real values, proper units, validated calculations

These demos are designed for use in introductory astronomy courses (ASTR 101/201) but scale from general education through upper-division coursework.

---

## Available Demos

### 1. Angular Size

**Concept:** Angular size depends on both physical size and distance.

Demonstrates why the Sun and Moon appear nearly the same size in our sky despite vastly different physical sizes — the cosmic coincidence that makes total solar eclipses possible.

**Features:**
- Interactive distance and size sliders
- Real astronomical object presets (Sun, Moon, Jupiter, Venus)
- Easter egg everyday objects (basketball, coins, thumb)
- Moon recession over geological time
- Small angle formula visualization

**Key formula:** $\theta = \frac{d}{D}$ (angular size = diameter / distance)

📁 [`angular-size/`](angular-size/)

---

### 2. Moon Phases

**Concept:** Phases arise from geometry, not Earth's shadow.

Addresses the #1 misconception about lunar phases by showing how our viewing angle of the always-half-lit Moon changes throughout its orbit.

**Features:**
- Top-down orbital view with draggable Moon
- Real-time "as seen from Earth" rendering
- Phase name, illumination percentage, days since New Moon
- Preset buttons for cardinal phases
- Earthshine visualization on dark limb

**Key formula:** $f = \frac{1 + \cos(\phi)}{2}$ (illumination fraction)

📁 [`moon-phases/`](moon-phases/)

---

### 3. Eclipse Geometry

**Concept:** Eclipses require both the right phase AND the Moon near a node.

Explains why eclipses don't happen every month despite favorable phases occurring monthly — the Moon's 5° orbital tilt is the key.

**Features:**
- Top-down and side views showing orbital tilt
- Adjustable tilt slider (0°–10°)
- Eclipse condition detection with status indicator
- Month and year animations
- Long-term simulation (1–1000 years) with eclipse log
- Separate tracking for total vs. partial eclipses

**Key formula:** $\beta = i \cdot \sin(\Delta\lambda)$ (Moon's height above ecliptic)

📁 [`eclipse-geometry/`](eclipse-geometry/)

---

### 4. Seasons

**Concept:** Axial tilt causes seasons, NOT distance from the Sun.

Addresses the classic misconception that many adults still hold — demonstrating through full mechanism and embedded misconception-busters why the ~23.5° tilt of Earth's axis is the true cause of seasons.

**Features:**

- Two-panel layout: orbital view + globe view
- Planet presets (Earth, Mars, Uranus, Venus, Jupiter, Saturn, Neptune)
- Season presets (equinoxes and solstices)
- Day length and sun altitude calculations
- Toggleable overlays (celestial equator, ecliptic, latitude bands, terminator)
- Observer latitude selection
- Animate Year functionality

**Key formulas:**

- Sun declination: $\delta = 23.5° \times \sin\left(\frac{2\pi(d-80)}{365}\right)$
- Day length: $\cos H = -\tan(\phi) \times \tan(\delta)$
- Sun altitude: $90° - |\text{latitude} - \delta|$

📁 [`seasons/`](seasons/)

---

### 5. Kepler's Laws

**Concept:** Kepler’s empirical rules (especially the “equal areas” idea and the $P^2\propto a^3$ scaling) and how they connect to Newtonian gravity.

📁 [`keplers-laws/`](keplers-laws/)

---

### 6. Conservation Laws (Orbit Shapes)

**Concept:** Conic sections as a consequence of conserved **specific energy** and **specific angular momentum**; connects circular vs. escape speed.

📁 [`conservation-laws/`](conservation-laws/)

---

### 7. Binary Orbits

**Concept:** Two-body motion around the **barycenter**; connects directly to binary stars and exoplanet “stellar wobble.”

📁 [`binary-orbits/`](binary-orbits/)

---

### 8. Blackbody Radiation

**Concept:** Temperature sets a thermal spectrum’s shape, peak, and total power (Wien + Stefan–Boltzmann).

📁 [`blackbody-radiation/`](blackbody-radiation/)

---

### 9. Electromagnetic Spectrum

**Concept:** Connect wavelength, frequency, and photon energy; map bands to what astronomers can observe.

📁 [`em-spectrum/`](em-spectrum/)

---

### 10. Telescope Resolution

**Concept:** Diffraction limit (plus seeing / AO context) and what it means for “resolved vs. unresolved.”

📁 [`telescope-resolution/`](telescope-resolution/)

---

### 11. Parallax Distance

**Concept:** Distance from angle; parsecs, baselines, and precision limits.

📁 [`parallax-distance/`](parallax-distance/)

---

## Embedding in Quarto

Use the `{{< demo >}}` shortcode to embed demos in Quarto documents:

```markdown
{{< demo angular-size >}}
{{< demo moon-phases height="450px" >}}
{{< demo eclipse-geometry height="600px" >}}
{{< demo seasons height="600px" >}}
{{< demo keplers-laws >}}
```

Or link directly to standalone pages:

- `demos/angular-size/index.html`
- `demos/moon-phases/index.html`
- `demos/eclipse-geometry/index.html`
- `demos/seasons/index.html`
- `demos/keplers-laws/index.html`
- `demos/conservation-laws/index.html`
- `demos/binary-orbits/index.html`
- `demos/blackbody-radiation/index.html`
- `demos/em-spectrum/index.html`
- `demos/telescope-resolution/index.html`
- `demos/parallax-distance/index.html`

---

## Shared Assets

All demos share common styling and utilities:

| File | Purpose |
|------|---------|
| `_assets/astro-theme.css` | Theme tokens + controls + accessibility defaults |
| `_assets/demo-shell.css` | Standard layout shell shared across demos |
| `_assets/demo-legacy.css` | Legacy class bridge (keeps older selectors working) |
| `_assets/demo-polish.js` | Micro-interactions (ripples, slider progress, opt-in tooltips) |
| `_assets/astro-utils.js` | Formatting, animation helpers, KaTeX helpers, shared UI utilities |
| `_assets/starfield.js` | Animated starfield background |
| `_assets/physics/astro-constants.js` | Single source of truth for constants + time scales |
| `_assets/physics/units.js` | Unit conversions (built on `AstroConstants`) |
| `_assets/physics/two-body-analytic.js` | Shared orbital mechanics core (used by multiple demos) |

---

## Course Alignment (ASTR 101 Spring 2026)

Demos prioritized by course schedule alignment. First class: Jan 21, 2026.

**Legend:** ✅ Verified | ☐ Not started

### Implemented (Verified)

| Status | Demo | Course Week | Topic |
|--------|------|-------------|-------|
| ✅ | **Angular Size** | Week 1–2 | Scale of the universe |
| ✅ | **Moon Phases** | Week 2 | Lunar cycle, geometry vs shadows |
| ✅ | **Eclipse Geometry** | Week 2 | Why eclipses don't happen monthly |
| ✅ | **Seasons** | Week 2 | Axial tilt, NOT distance |

### Immediate (Week 3)

| Status | Demo | Course Week | Topic |
|--------|------|-------------|-------|
| ✅ | **Kepler's Laws** | Week 3 (Feb 2–6) | Gravity & orbits, Kepler's laws |
| ✅ | **Conservation Laws** | Week 3 (Feb 2–6) | Energy & angular momentum (orbit shapes) |

### High Priority (Weeks 4–5)

| Status | Demo | Course Week | Topic |
|--------|------|-------------|-------|
| ✅ | **Blackbody Radiation** | Week 4 (Feb 9–13) | Light & radiation, EM spectrum |
| ✅ | **Electromagnetic Spectrum** | Week 4 (Feb 9–13) | Light & radiation |
| ✅ | **Telescope Resolution** | Week 5 (Feb 17–20) | Telescopes |

### Medium Priority (Weeks 8–10)

| Status | Demo | Course Week | Topic |
|--------|------|-------------|-------|
| ✅ | **Parallax Distance** | Week 8 (Mar 9–13) | Measuring stars |
| ☐ | **Inverse Square Law** | Week 8 (Mar 9–13) | Luminosity |
| ☐ | **HR Diagram Explorer** | Week 8 (Mar 9–13) | H-R diagram |
| ✅ | **Binary Orbits** | Week 9 (Mar 16–20) | Binary stars, stellar masses |

### Later (Weeks 14–16)

| Status | Demo | Course Week | Topic |
|--------|------|-------------|-------|
| ☐ | **Galaxy Rotation Curves** | Week 14 (Apr 20–24) | Dark matter |
| ☐ | **Hubble's Law Explorer** | Week 15 (Apr 27–May 1) | Cosmology, Big Bang |
| ☐ | **Redshift & Expansion** | Week 15 (Apr 27–May 1) | Cosmology |
| ☐ | **Cosmic Microwave Background** | Week 16 (May 4–6) | Early universe |

---

## Future Demo Roadmap

Full catalog of planned demos **not yet implemented**, organized by topic area:

### Foundational Concepts

| Demo | Concept | Key Formula | Course Level |
|------|---------|-------------|--------------|
| **Inverse Square Law** | Brightness falls off with distance squared | $F = L / 4\pi d^2$ | 101 |
| **Tides** | Differential gravity from Moon and Sun | $F_{\text{tidal}} \propto M/d^3$ | 101 |
| **Light Travel Time** | Looking far = looking back in time | $t = d/c$ | 101 |
| **Cosmic Distance Ladder** | Chain of methods: parallax → Cepheids → Type Ia → Hubble | Multi-step | 201 |

### Stellar Astrophysics

| Demo | Concept | Course Level |
|------|---------|--------------|
| **HR Diagram Explorer** | Plot stars, identify regions, watch evolution tracks | 101/201 |
| **Stellar Spectrum Lab** | Temperature → color → spectral type → composition | 101/201 |
| **Stellar Evolution Sandbox** | Watch stars evolve using pre-computed MESA/PARSEC tracks | 201 |
| **Stellar Nucleosynthesis** | Fusion chains: pp, CNO, triple-alpha | 201 |

### Galaxies & Cosmology

| Demo | Concept | Course Level |
|------|---------|--------------|
| **Hubble's Law Explorer** | Velocity-distance relation, universe age from $H_0$ | 101 |
| **Redshift & Expansion** | Stretching wavelengths, expanding universe | 101 |
| **Galaxy Rotation Curves** | Dark matter evidence from flat rotation curves | 201 |
| **Galaxy Classification** | Hubble tuning fork, morphology | 101 |
| **Cosmic Microwave Background** | Blackbody spectrum of the early universe | 201 |

### Planetary Science & Exoplanets

| Demo | Concept | Course Level |
|------|---------|--------------|
| **Transit Light Curve Lab** | Exoplanet detection via transits | 101/201 |
| **Habitable Zone Calculator** | HZ boundaries, stellar luminosity effects | 101 |
| **Radial Velocity Method** | Wobble detection, $m \sin i$ degeneracy | 201 |
| **Planetary Atmospheres** | Greenhouse effect, equilibrium temperature | 101/201 |

### Instrumentation & Observation

| Demo | Concept | Course Level |
|------|---------|--------------|
| **Doppler Shift Spectrometer** | Radial velocity from spectral line shifts | 201 |
| **CCD & Photon Counting** | How detectors convert light to data | 201 |

---

## Design Philosophy

### Technical Principles

1. **No build tools** — Open `index.html` in any browser
2. **No dependencies** — Everything self-contained
3. **Progressive enhancement** — Works without JavaScript (degrades gracefully)
4. **Mobile-friendly** — Responsive layouts, touch-compatible controls

### Pedagogical Principles

1. **Address misconceptions directly** — Don't just teach the truth, confront the false
2. **Interactive before lecture** — Let students discover, then formalize
3. **Real values** — Use actual astronomical data, not simplified numbers
4. **Multiple representations** — Diagrams, math, text reinforce each other

### Accessibility Goals

- Keyboard navigation for all controls
- Screen reader labels
- Color not sole indicator (icons + text)
- Reduced motion support

---

## Contributing

Each demo includes a detailed README with:
- Science background
- Usage instructions
- Pedagogical notes (learning objectives, misconceptions, activities)
- Technical details
- Future feature ideas

See individual demo folders for contribution opportunities.

---

## License

Educational use encouraged. Attribution appreciated.

---

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition
- NASA educational resources
- MESA, PARSEC, and BoOST stellar evolution codes (for future demos)

---

*Part of the AstroEd project at San Diego State University*

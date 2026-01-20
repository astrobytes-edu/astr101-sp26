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

## Embedding in Quarto

Use the `{{< demo >}}` shortcode to embed demos in Quarto documents:

```markdown
{{< demo angular-size >}}
{{< demo moon-phases height="450px" >}}
{{< demo eclipse-geometry height="600px" >}}
{{< demo seasons height="600px" >}}
```

Or link directly to standalone pages:

- `demos/angular-size/index.html`
- `demos/moon-phases/index.html`
- `demos/eclipse-geometry/index.html`
- `demos/seasons/index.html`

---

## Shared Assets

All demos share common styling and utilities:

| File | Purpose |
|------|---------|
| `_assets/astro-theme.css` | Dark space theme, control styling |
| `_assets/astro-utils.js` | Animation loops, formatting helpers |
| `_assets/starfield.js` | Animated starfield background |

---

## Demo Roadmap

Future demos under consideration, organized by topic area:

### Foundational Concepts

| Demo | Concept | Key Formula | Course Level |
|------|---------|-------------|--------------|
| **Parallax & Distance** | Stellar parallax as distance measurement | $d = 1/p$ (parsecs) | 101 |
| **Inverse Square Law** | Brightness falls off with distance squared | $F = L / 4\pi d^2$ | 101 |
| **Blackbody Radiation** | Temperature determines color and total power | Wien: $\lambda_{\max} = b/T$; Stefan-Boltzmann: $L \propto R^2 T^4$ | 101/201 |
| **Tides** | Differential gravity from Moon and Sun | $F_{\text{tidal}} \propto M/d^3$ | 101 |
| **Light Travel Time** | Looking far = looking back in time | $t = d/c$ | 101 |
| **Cosmic Distance Ladder** | Chain of methods: parallax → Cepheids → Type Ia → Hubble | Multi-step | 201 |

### Stellar Astrophysics

| Demo | Concept | Course Level |
|------|---------|--------------|
| **HR Diagram Explorer** | Plot stars, identify regions, watch evolution tracks | 101/201 |
| **Stellar Spectrum Lab** | Temperature → color → spectral type → composition | 101/201 |
| **Stellar Evolution Sandbox** | Watch stars evolve using pre-computed MESA/PARSEC tracks | 201 |
| **Binary Star Orbits** | Mass determination from orbital motion | 201 |
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
| **Kepler's Laws Sandbox** | Orbital mechanics, equal areas, $P^2 \propto a^3$ | 101 |
| **Transit Light Curve Lab** | Exoplanet detection via transits | 101/201 |
| **Habitable Zone Calculator** | HZ boundaries, stellar luminosity effects | 101 |
| **Radial Velocity Method** | Wobble detection, $m \sin i$ degeneracy | 201 |
| **Planetary Atmospheres** | Greenhouse effect, equilibrium temperature | 101/201 |

### Instrumentation & Observation

| Demo | Concept | Course Level |
|------|---------|--------------|
| **Telescope Resolution** | Diffraction limit $\theta = 1.22\lambda/D$ | 101/201 |
| **Doppler Shift Spectrometer** | Radial velocity from spectral line shifts | 201 |
| **Electromagnetic Spectrum** | Different wavelengths reveal different phenomena | 101 |
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

# Binary Orbits Sandbox

Interactive two-body orbital mechanics demonstration showing that both bodies orbit their common center of mass (barycenter). This demo teaches the correct physics for both star+planet systems (where the star wobbles slightly) and binary star systems (where both stars trace visible orbits). Students discover that Newton's laws predict Kepler's empirical rules while revealing the underlying gravitational physics.

The key insight: neither body is truly stationary. Even our Sun wobbles due to Jupiter's gravitational pull, and this wobble is how astronomers detect exoplanets using the radial velocity method.

## Concept

- **Both bodies orbit the barycenter** - The center of mass stays fixed while both bodies move
- **Correct physics for all mass ratios** - From star+planet (extreme mass ratio) to equal-mass binaries
- **Inverse relationship** - The more massive body has the smaller orbit: a1/a2 = M2/M1
- **System type selector** - Star+Planet vs Binary Star modes with appropriate unit defaults

## Features

- Draggable bodies on orbital paths
- Real-time SVG visualization with dynamic scaling
- Mass sliders (log scale: 0.1 - 100 M_sun)
- Separation and eccentricity controls
- Solar system and binary star presets
- Toggleable vector overlays (velocity, acceleration, force)
- Unit dropdowns for velocity (AU/yr, km/s, m/s, cm/s) and period (years, days)
- Temperature-based stellar colors via StellarUtils
- Spectral type classification for stars
- Play/Pause animation with adjustable speed (0.1x - 10x)
- Live readouts: period, velocities, separation, orbit sizes, temperatures

## Key Formulas

```
Barycenter position: x_cm = M2/(M1+M2) * separation

Individual orbit sizes:
  a1 = a * M2/M_tot  (body 1's orbit around barycenter)
  a2 = a * M1/M_tot  (body 2's orbit around barycenter)

Orbital period (generalized Kepler's 3rd Law):
  P^2 = a^3 / (M1 + M2)  [years, AU, solar masses]

Vis-viva equation (orbital velocity):
  v = sqrt(G * M_tot * (2/r - 1/a))

Orbital radius from true anomaly:
  r = a(1 - e^2) / (1 + e*cos(theta))
```

## Math Rendering

All formulas use KaTeX for proper mathematical typesetting. The demo uses:

- `data-math` attributes for static formulas in the insight box
- `AstroUtils.renderAllMath()` for initialization

LaTeX source for key formulas:

- Orbit ratio: `a_1 / a_2 = M_2 / M_1`
- Period: `P^2 = \frac{a^3}{M_1 + M_2}`

## Files

- `index.html` - Demo page with all UI elements
- `binary-orbits.js` - State, rendering, and interaction logic
- `binary-orbits.css` - Demo-specific styles
- `../_assets/binary-orbits-model.js` - Shared physics model (testable, UMD)
- `../../tests/binary-orbits-physics.test.js` - Unit tests for physics
- `README.md` - This documentation

## Controls

### Mouse/Touch

- **Drag either body** around its orbit to change orbital phase
- **Adjust sliders** for mass, separation, and eccentricity parameters
- **Click presets** for real astronomical systems

### Keyboard

- **Space**: Play/Pause animation
- **Arrow Left/Right**: Step body along orbit
- **Shift + Arrow**: Fine step control
- **Tab**: Navigate between focusable elements

### Accessibility

- ARIA slider roles on draggable bodies
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` attributes
- Screen reader announcements via `aria-live` region
- Full keyboard navigation for all interactive elements
- Focus indicators on bodies when selected

## Presets

### Star + Planet

| Preset | M1 (M_sun) | M2 (M_sun) | Separation | Eccentricity |
|--------|------------|------------|------------|--------------|
| Sun + Earth | 1.0 | 3e-6 | 1.0 AU | 0.017 |
| Sun + Jupiter | 1.0 | 9.5e-4 | 5.2 AU | 0.049 |
| Hot Jupiter | 1.0 | 1e-3 | 0.05 AU | 0.02 |
| Proxima b | 0.12 | 4e-6 | 0.049 AU | 0.11 |

### Binary Star

| Preset | M1 (M_sun) | M2 (M_sun) | Separation | Eccentricity |
|--------|------------|------------|------------|--------------|
| Alpha Centauri AB | 1.1 | 0.91 | 23.4 AU | 0.52 |
| Sirius AB | 2.06 | 1.02 | 19.8 AU | 0.59 |
| Equal Mass | 1.0 | 1.0 | 1.0 AU | 0.0 |
| Massive O+O | 50 | 40 | 0.5 AU | 0.3 |

## Pedagogical Notes

### Learning Objectives

- Understand that **both bodies orbit the common center of mass** (barycenter), not one around the other
- Connect stellar wobble to **exoplanet detection** via the radial velocity method
- See that **Kepler's laws emerge from Newton's gravitational physics** in two-body systems
- Recognize the **inverse mass-orbit relationship**: heavier body has smaller orbit (a₁/a₂ = M₂/M₁)
- Distinguish between **star+planet systems** (extreme mass ratio) and **binary stars** (comparable masses)

### Common Misconceptions

| Misconception | Reality | Demo Feature |
|---------------|---------|--------------|
| "The star stays still, only the planet moves" | Star wobbles; larger planets cause larger wobble | Visible M₁ orbit path around barycenter |
| "Barycenter is always inside the star" | For massive companions, barycenter can be outside the star | Alpha Cen preset shows external barycenter |
| "Binary stars are rare" | ~50% of stars are in multiple systems | Multiple binary star presets |
| "Heavier objects orbit faster" | Both bodies share the same period; heavier body has smaller orbit | Equal Mass preset demonstrates this |
| "Planets orbit the center of the star" | Planets orbit the system barycenter (Sun wobbles too) | Sun+Jupiter preset shows solar wobble |

### Discussion Questions

1. **Exoplanet detection**: Why does Jupiter cause more stellar wobble than Earth? How would you detect a planet around a distant star using only the star's spectrum?
2. **Barycenter position**: What happens to the barycenter position as M₂ → 0? Where is the Sun-Jupiter barycenter relative to the Sun's surface?
3. **Orbital synchronization**: Why do both bodies reach perihelion simultaneously? Why must they have the same orbital period?
4. **Mass determination**: If you can measure both stellar orbits in a binary system, how can you determine the individual masses?
5. **Equal mass case**: In the Equal Mass preset, why are both orbits identical? What would happen if you slightly increased one mass?

## Future Features

| Extension | Description | Priority |
|-----------|-------------|----------|
| Doppler RV curve | Radial velocity vs time plot showing stellar wobble signal | High |
| Light curve | Brightness dip during eclipses/transits for edge-on systems | High |
| 3D inclination | Add orbital plane tilt to show projection effects | Medium |
| Tidal forces | Differential gravity visualization near close companions | Medium |
| Roche lobes | Mass transfer regions in close binary systems | Low |
| GR precession | Post-Newtonian apsidal advance for close orbits | Low |

## References

- Freedman, *Universe*, 11th Ed., Ch. 17 (Binary Stars and Stellar Masses)
- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu)
- [Radial Velocity Method](https://exoplanets.nasa.gov/alien-worlds/ways-to-find-a-planet/#/2) (NASA Exoplanets)

## Usage

```html
{{< demo binary-orbits height="800px" >}}
```

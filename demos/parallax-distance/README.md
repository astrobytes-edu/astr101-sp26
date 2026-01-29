# Parallax & Distance Demo

Interactive visualization demonstrating stellar parallax — the geometric method for measuring distances to nearby stars.

## Science Background

### What is Parallax?

**Parallax** is the apparent shift in position of a nearby object against a distant background when viewed from different locations. Hold your thumb at arm's length, close one eye, then the other — your thumb appears to jump against the background. The same principle works for stars.

### Stellar Parallax

As Earth orbits the Sun, nearby stars appear to shift against the background of distant stars. The **parallax angle** ($p$) is half the total angular shift over 6 months (the angle subtended by 1 AU at the star's distance).

$$d = \frac{1}{p}$$

where:
- $d$ = distance in **parsecs** (pc)
- $p$ = parallax angle in **arcseconds** (")

**One parsec** is the distance at which a star has a parallax of exactly 1 arcsecond:
$$1 \text{ pc} = 3.086 \times 10^{18} \text{ cm} = 3.26 \text{ light-years}$$

### The Parsec Definition

The parsec is defined geometrically:
- If $p = 1"$, then $d = 1$ pc
- If $p = 0.1"$, then $d = 10$ pc
- If $p = 0.01"$, then $d = 100$ pc

**Smaller parallax = greater distance** (inverse relationship).

### Historical Significance

Stellar parallax was the first direct method for measuring cosmic distances:

| Year | Observer | Star | Parallax | Distance |
|------|----------|------|----------|----------|
| 1838 | Bessel | 61 Cygni | 0.314" | 3.18 pc |
| 1838 | Henderson | Alpha Centauri | 0.742" | 1.35 pc |
| 1839 | Struve | Vega | 0.125" | 8.0 pc |

These measurements finally proved that stars are incredibly distant suns.

### Modern Parallax Measurements

| Mission | Era | Precision | Stars Measured |
|---------|-----|-----------|----------------|
| Ground-based | Pre-1990 | ~0.01" | ~10,000 |
| Hipparcos | 1989–1993 | 0.001" | 118,000 |
| Gaia | 2013–present | 0.00001" | 1.8 billion |

Gaia can measure parallaxes accurate to 10 microarcseconds, reaching stars across the entire Milky Way.

## How to Use

### Distance Slider

- Drag to change the target distance (**log scale** from 1 pc to 10,000 pc)
- Watch the parallax angle update (displayed in arcsec / mas / µas as appropriate)
- Notice how the apparent shift shrinks rapidly with distance

### Two Views

- **Observer’s View (Star Field):** the target star shifts against a fixed background
- **Top-Down View (Solar System):** Earth’s orbit and an exaggerated parallax-angle visualization

### Time Controls

- **Orbit Year:** animate one full orbit of Earth
- **Pause:** pause the animation
- **Jan / July:** jump to opposite sides of the orbit (the 2 AU baseline)
- **Reset:** return to January

### Measurement Precision

- Toggle between **Hipparcos** (~1 mas) and **Gaia** (~0.02 mas) to see what’s measurable

### Presets

- Use the **Nearby Stars** and **Distant Objects** preset buttons (with Gaia measurability indicators)

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Parallax is a geometric distance measurement (no assumptions about star properties)
2. The parallax-distance relationship: $d = 1/p$
3. Smaller parallax = greater distance
4. The parsec is defined by the parallax formula
5. Earth's orbit provides the baseline for stellar parallax

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Parallax is a property of the star" | Parallax is purely geometric |
| "Closer stars have smaller parallax" | Closer stars have LARGER parallax |
| "We can measure parallax to any star" | Limited by angular resolution |
| "Light-years are more 'natural' than parsecs" | Parsecs are defined by the measurement |

### Discussion Questions

1. Why did it take until 1838 to measure stellar parallax?
2. How far could Hipparcos measure distances? How far can Gaia reach?
3. If we could observe from Jupiter's orbit, how would our parallax measurements improve?
4. Why do astronomers use parsecs instead of light-years?

### In-Class Activities

**Parallax demonstration:**
- Have students extend their thumb and observe parallax by alternating eyes
- Measure the "baseline" (eye separation) and estimate thumb distance

**Calculation practice:**
- Given parallax, calculate distance
- Given distance, calculate expected parallax
- "Could Hipparcos measure the parallax of Polaris?"

## Technical Details

### Files

```
parallax-distance/
├── index.html      # Standalone demo page
├── parallax-distance.css # Demo-specific layout styling
├── parallax.js     # UI/controller + canvas rendering
├── star-data.js    # Star catalog + display helpers
└── README.md       # This file

_assets/
└── ../_assets/parallax-distance-model.js  # Pure geometry helpers (Node-testable)
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation, constants)
- `../_assets/parallax-distance-model.js` — Shared, pure parallax model helpers
- `../_assets/demo-polish.js` — Shared demo UI polish
- `../_assets/starfield.js` — Animated background

### Key Formula Implementation

```javascript
// Parallax-distance relationship
const parallax_arcsec = 1.0 / distance_pc;
const parallax_mas = parallax_arcsec * 1000;  // milliarcseconds
```

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo parallax-distance >}}
{{< demo parallax-distance height="600px" >}}
```

## Future Features

### Version 2 Ideas

**Enhanced visualization:**
- [ ] 3D view with depth perception
- [ ] Parallax ellipse orientation (shows star's position angle)
- [ ] Proper motion combined with parallax
- [ ] Error ellipses showing measurement uncertainty

**Extended star catalog:**
- [ ] More Gaia stars with precise parallaxes
- [ ] Historical parallax measurements for comparison
- [ ] Binary stars showing orbital parallax
- [ ] Star clusters at known distances

**Educational features:**
- [ ] Quiz mode: "Estimate the parallax for this distance"
- [ ] Interactive proof of the parsec definition
- [ ] Baseline comparison (Earth vs. Jupiter vs. spacecraft)
- [ ] Distance ladder preview (parallax as first rung)

**Measurement simulation:**
- [ ] Add noise to simulate real observations
- [ ] Multiple measurements to reduce error
- [ ] Systematic effects (atmospheric refraction)
- [ ] Proper motion separation

### Accessibility Improvements

- [ ] Screen reader descriptions of parallax geometry
- [ ] Keyboard controls for animation
- [ ] High-contrast star markers
- [ ] Numeric readouts for all visual elements

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 17
- [Stellar Parallax - Wikipedia](https://en.wikipedia.org/wiki/Stellar_parallax)
- [Gaia Mission - ESA](https://www.esa.int/Science_Exploration/Space_Science/Gaia)
- [SIMBAD Astronomical Database](http://simbad.u-strasbg.fr/) (star data)

---

*Part of the AstroEd Demos collection for ASTR 101*

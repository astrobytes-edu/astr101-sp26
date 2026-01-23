# Telescope Resolution Demo

Interactive visualization demonstrating the diffraction limit of telescopes and the Rayleigh criterion for angular resolution.

## Science Background

### The Diffraction Limit

Light waves bend (diffract) when passing through an aperture. Even a perfect telescope cannot produce infinitely sharp images—there is a fundamental **diffraction limit** determined by the wave nature of light.

A point source (like a star) produces an **Airy disk** pattern:
- Bright central spot containing ~84% of the light
- Surrounded by concentric rings of decreasing brightness

### The Rayleigh Criterion

Two point sources are **just resolved** when the center of one Airy disk falls on the first dark ring of the other:

$$\theta = 1.22 \frac{\lambda}{D}$$

where:
- $\theta$ = angular resolution in radians
- $\lambda$ = wavelength of light
- $D$ = telescope diameter (aperture)

In arcseconds:
$$\theta_{\text{arcsec}} = \frac{252,000 \times \lambda}{D}$$

(when $\lambda$ and $D$ are in the same units)

### The Airy Pattern

The intensity distribution of the Airy disk is given by:

$$I(\theta) = I_0 \left[ \frac{2 J_1(x)}{x} \right]^2$$

where $x = \pi D \theta / \lambda$ and $J_1$ is the Bessel function of the first kind.

The first dark ring occurs at $x = 3.83$, which gives the Rayleigh criterion.

### Why Aperture Matters

| Telescope | Aperture | Resolution (550 nm) |
|-----------|----------|---------------------|
| Human eye | 7 mm | 20" |
| Binoculars | 50 mm | 2.8" |
| Small telescope | 20 cm | 0.7" |
| Hubble | 2.4 m | 0.05" |
| Keck | 10 m | 0.014" |
| ELT (future) | 39 m | 0.003" |

**Larger aperture = better resolution** (can see finer details).

### Wavelength Dependence

Resolution degrades at longer wavelengths:
- Optical (550 nm): Best ground-based resolution ~0.5" (seeing-limited)
- Infrared (10 μm): 18× worse than optical for same aperture
- Radio (21 cm): ~400,000× worse—need huge dishes or interferometers

This is why radio telescopes are enormous and often combined into arrays (interferometry).

## How to Use

### Aperture Slider

- Drag to change telescope diameter (1 cm – 40 m)
- Watch the Airy disk shrink (better resolution)
- Resolution value updates in arcseconds

### Wavelength Slider

- Select observing wavelength (100 nm – 1 mm)
- Presets: UV, visible colors, near-IR, thermal IR, radio
- See how longer wavelengths degrade resolution

### Binary Star Test

Toggle to show two point sources:
- **Separation slider**: Adjust angular separation
- **Status indicator**: Resolved / Just Resolved / Unresolved
- Visual demonstration of the Rayleigh criterion

### Telescope Presets

Click to load real telescopes:
- **Human Eye**: 7 mm aperture
- **Hubble Space Telescope**: 2.4 m
- **Keck Observatory**: 10 m
- **James Webb Space Telescope**: 6.5 m (IR optimized)
- **ALMA**: 12 m dishes (radio/mm)
- **ELT (future)**: 39 m

### Airy Pattern Display

- Central view shows the Airy disk
- Radial profile shows intensity vs. angle
- First dark ring marked (Rayleigh criterion)

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Diffraction limits telescope resolution, not magnification
2. Larger apertures give better (smaller) angular resolution
3. Longer wavelengths give worse resolution for the same aperture
4. The Rayleigh criterion defines when two sources are "just resolved"
5. This is why we build big telescopes and use interferometry

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "More magnification = see more detail" | Resolution is limited by aperture, not magnification |
| "Small telescopes can see planets around other stars" | Need extreme resolution (milliarcseconds) |
| "Radio telescopes can't see details" | They use interferometry to achieve high resolution |
| "Hubble is powerful because it's in space" | Space helps (no atmosphere), but aperture matters most |

### Discussion Questions

1. Why can't you see more detail by increasing magnification beyond a certain point?
2. Why are radio telescopes so much larger than optical telescopes?
3. How does interferometry (combining telescopes) improve resolution?
4. Why does James Webb observe in infrared if IR has worse resolution?

### In-Class Activities

**Resolution calculation:**
- Calculate resolution for various telescope/wavelength combinations
- "Can Hubble resolve the Apollo landing sites on the Moon?" (No! Need ~2 m resolution at 384,000 km)

**Rayleigh criterion demonstration:**
- Two flashlights at varying distances
- Pinhole aperture to simulate different telescope sizes

## Technical Details

### Files

```
telescope-resolution/
├── index.html      # Standalone demo page
├── resolution.js   # Core visualization logic
└── README.md       # This file
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation, constants)
- `../_assets/starfield.js` — Animated background

### Numerical Implementation

The Bessel function $J_1(x)$ is computed using a polynomial approximation:

```javascript
// Bessel J1 approximation (Abramowitz & Stegun)
function besselJ1(x) {
    if (Math.abs(x) < 3) {
        // Small argument expansion
        const x2 = x * x;
        return x * (0.5 - x2 * (0.0625 - x2 * 0.00260417));
    } else {
        // Asymptotic expansion for large x
        // ...
    }
}
```

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo telescope-resolution >}}
{{< demo telescope-resolution height="600px" >}}
```

## Future Features

### Version 2 Ideas

**Enhanced visualization:**
- [ ] Animated comparison: same scene at different resolutions
- [ ] Seeing simulation (atmospheric turbulence)
- [ ] Adaptive optics demonstration
- [ ] Interferometry baseline visualization

**Real-world examples:**
- [ ] Famous resolved images (Betelgeuse surface, Pluto)
- [ ] "What Hubble/JWST/ELT could resolve" comparisons
- [ ] Angular sizes of Solar System objects vs. resolution
- [ ] Exoplanet direct imaging challenges

**Educational features:**
- [ ] Quiz mode: "Can this telescope resolve these two stars?"
- [ ] Resolution matching game
- [ ] Build-your-own telescope array (interferometry)
- [ ] Resolution vs. aperture cost discussion

**Advanced topics:**
- [ ] Point spread function (PSF) fitting
- [ ] Deconvolution basics
- [ ] Strehl ratio (adaptive optics quality)
- [ ] Sparse aperture masking

### Accessibility Improvements

- [ ] Screen reader descriptions of Airy pattern
- [ ] Keyboard controls for all sliders
- [ ] Numeric resolution comparison mode
- [ ] High-contrast pattern display

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 6
- [Angular Resolution - Wikipedia](https://en.wikipedia.org/wiki/Angular_resolution)
- [Airy Disk - Wikipedia](https://en.wikipedia.org/wiki/Airy_disk)
- Born & Wolf, *Principles of Optics*, 7th Edition (advanced reference)

---

*Part of the AstroEd Demos collection for ASTR 101*

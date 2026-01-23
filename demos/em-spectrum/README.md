# Electromagnetic Spectrum Demo

Interactive visualization exploring the relationship between wavelength, frequency, and energy across the electromagnetic spectrum.

## Science Background

### The Electromagnetic Spectrum

Light is an electromagnetic wave characterized by:
- **Wavelength** ($\lambda$): Distance between wave crests
- **Frequency** ($\nu$): Number of wave cycles per second
- **Energy** ($E$): Energy carried by individual photons

These are related by fundamental equations:

### Wave Equation

All electromagnetic radiation travels at the speed of light:

$$c = \lambda \nu$$

where $c = 2.998 \times 10^{10}$ cm/s.

**Consequence:** Longer wavelength = lower frequency, and vice versa.

### Photon Energy

Light behaves as both waves and particles (photons). Each photon carries energy:

$$E = h\nu = \frac{hc}{\lambda}$$

where $h = 6.626 \times 10^{-34}$ J·s (Planck's constant).

**Consequence:** Shorter wavelength = higher energy photons.

### Spectral Bands

| Band | Wavelength Range | Frequency Range | Photon Energy |
|------|------------------|-----------------|---------------|
| Radio | > 1 mm | < 300 GHz | < 1.2 meV |
| Microwave | 1 mm – 1 cm | 30–300 GHz | 0.12–1.2 meV |
| Infrared | 700 nm – 1 mm | 300 GHz – 430 THz | 1.2 meV – 1.8 eV |
| Visible | 380–700 nm | 430–790 THz | 1.8–3.3 eV |
| Ultraviolet | 10–380 nm | 790 THz – 30 PHz | 3.3–124 eV |
| X-ray | 0.01–10 nm | 30 PHz – 30 EHz | 124 eV – 124 keV |
| Gamma-ray | < 0.01 nm | > 30 EHz | > 124 keV |

### Astronomical Applications

Different wavelengths reveal different phenomena:

| Band | What We See | Example Objects |
|------|-------------|-----------------|
| Radio | Cold gas, pulsars, cosmic rays | Milky Way in 21-cm, Crab pulsar |
| Infrared | Dust, cool stars, forming stars | Orion Nebula, brown dwarfs |
| Visible | Stars, galaxies, planets | Everything our eyes see |
| Ultraviolet | Hot stars, active galaxies | O/B stars, quasars |
| X-ray | Hot gas, black hole accretion | Corona, Cygnus X-1 |
| Gamma-ray | Most violent events | Gamma-ray bursts, AGN jets |

## How to Use

### Wavelength Slider

- Drag across the full electromagnetic spectrum
- Watch frequency and energy update in real-time
- Color indicator shows visible colors (gray outside visible range)

### Band Selection

Click spectral band buttons to jump to that region:
- **Radio** → 1 m (FM radio wavelength)
- **Microwave** → 1 cm (microwave oven)
- **Infrared** → 10 μm (thermal emission)
- **Visible** → 550 nm (green, peak human sensitivity)
- **Ultraviolet** → 100 nm (far-UV)
- **X-ray** → 1 nm (soft X-rays)
- **Gamma** → 0.001 nm (nuclear)

### Unit Toggles

Switch between unit systems:
- Wavelength: nm, μm, mm, m
- Frequency: Hz, kHz, MHz, GHz, THz
- Energy: eV, keV, MeV, J

### Real-World Examples

Toggle to show common sources at each wavelength:
- 21 cm: Hydrogen line (radio astronomy)
- 2.7 K CMB: Cosmic microwave background peak
- 550 nm: Peak human eye sensitivity
- 10.6 μm: CO₂ laser
- 121.6 nm: Lyman-alpha (hydrogen UV line)

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Wavelength, frequency, and energy are related ($c = \lambda\nu$, $E = h\nu$)
2. The visible spectrum is a tiny fraction of the EM spectrum
3. Different wavelengths require different detectors/telescopes
4. Short wavelength = high frequency = high energy
5. Multi-wavelength astronomy reveals the complete picture

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Radio waves are sound" | Radio is light, just longer wavelength |
| "Infrared is heat" | All EM radiation carries energy |
| "X-rays and gamma rays are different things" | Same physics, just energy threshold |
| "We see 'all' the light" | We see < 0.0035% of the EM spectrum |

### Discussion Questions

1. Why can radio waves pass through walls but visible light cannot?
2. Why do we need space telescopes for UV, X-ray, and gamma-ray astronomy?
3. How does a microwave oven use the same physics as a radio telescope?
4. Why is the CMB in the microwave band today, when it started as visible light?

### In-Class Activities

**Energy calculation:**
- Calculate photon energy for red vs. blue light
- How many radio photons equal one gamma-ray photon?

**Multi-wavelength astronomy:**
- Show same object (e.g., Crab Nebula) in different bands
- Discuss what each wavelength reveals

## Technical Details

### Files

```
em-spectrum/
├── index.html      # Standalone demo page
├── em-spectrum.js  # Core visualization logic
└── README.md       # This file
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation, constants)
- `../_assets/starfield.js` — Animated background

### Physical Constants (CODATA 2018)

```javascript
const c = 2.99792458e10;  // cm/s
const h = 6.62607015e-27; // erg·s
const eV = 1.602176634e-12; // erg
```

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo em-spectrum >}}
{{< demo em-spectrum height="550px" >}}
```

## Future Features

### Version 2 Ideas

**Enhanced visualization:**
- [ ] Wave animation showing wavelength/frequency relationship
- [ ] Logarithmic vs. linear scale toggle
- [ ] Atmospheric transmission overlay (what reaches ground)
- [ ] Photon rain visualization (energy per photon)

**Astronomical connection:**
- [ ] Famous spectral lines marked (H-alpha, 21-cm, etc.)
- [ ] Telescope sensitivity curves overlay
- [ ] Redshift slider showing how spectrum shifts
- [ ] Multi-wavelength image gallery

**Educational features:**
- [ ] Quiz mode: "What band is this wavelength?"
- [ ] Unit conversion practice
- [ ] Blackbody spectrum overlay at various temperatures
- [ ] Interactive derivation of $E = h\nu$

### Accessibility Improvements

- [ ] Screen reader descriptions of spectrum position
- [ ] Keyboard navigation across bands
- [ ] Non-color indicators for spectral regions
- [ ] Data table alternative

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 5
- [Electromagnetic Spectrum - Wikipedia](https://en.wikipedia.org/wiki/Electromagnetic_spectrum)
- [CODATA 2018 Fundamental Constants](https://physics.nist.gov/cuu/Constants/)

---

*Part of the AstroEd Demos collection for ASTR 101*

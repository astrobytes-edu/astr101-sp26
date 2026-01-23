# Blackbody Radiation Demo

Interactive visualization demonstrating how temperature determines the color and intensity of thermal radiation.

## Science Background

### The Planck Function

A **blackbody** is an idealized object that absorbs all incident radiation and re-emits it in a characteristic spectrum that depends only on temperature. The spectral radiance is given by the **Planck function**:

$$B_\lambda(T) = \frac{2hc^2}{\lambda^5} \cdot \frac{1}{e^{hc/\lambda k_B T} - 1}$$

where:
- $h = 6.626 \times 10^{-34}$ J·s (Planck's constant)
- $c = 2.998 \times 10^{10}$ cm/s (speed of light)
- $k_B = 1.381 \times 10^{-16}$ erg/K (Boltzmann constant)
- $\lambda$ = wavelength
- $T$ = temperature in Kelvin

### Wien's Displacement Law

The wavelength at which a blackbody emits most intensely shifts with temperature:

$$\lambda_{\text{peak}} = \frac{b}{T}$$

where $b = 2.898 \times 10^{-3}$ m·K (Wien's displacement constant).

**Examples:**
| Object | Temperature | Peak Wavelength | Color |
|--------|-------------|-----------------|-------|
| Sun | 5,778 K | 502 nm | Yellow-white |
| Betelgeuse | 3,500 K | 828 nm | Red |
| Sirius | 9,940 K | 292 nm | Blue-white |
| Human body | 310 K | 9.3 μm | Infrared |

### Stefan-Boltzmann Law

The total power radiated per unit area increases dramatically with temperature:

$$F = \sigma T^4$$

where $\sigma = 5.67 \times 10^{-5}$ erg/(cm²·s·K⁴).

A star twice as hot radiates $2^4 = 16\times$ more energy per unit area.

### Stellar Classification Connection

Stars are approximately blackbodies. Their surface temperature determines:
- **Color**: Wien's law → cooler = red, hotter = blue
- **Luminosity**: Stefan-Boltzmann → $L = 4\pi R^2 \sigma T^4$
- **Spectral type**: O-B-A-F-G-K-M sequence (hot → cool)

## How to Use

### Temperature Slider

- Drag to change the blackbody temperature (1,000 K – 40,000 K)
- Watch the spectrum curve shift and the color indicator change
- Peak wavelength marker shows Wien's law in action

### Preset Stars

Click preset buttons to load real stellar temperatures:
- **Sun (G2V)**: 5,778 K — yellow-white, peak in visible
- **Betelgeuse (M2Iab)**: 3,500 K — red supergiant, peak in infrared
- **Rigel (B8Ia)**: 12,100 K — blue supergiant, peak in UV
- **Sirius (A1V)**: 9,940 K — brightest star, blue-white

### Spectrum Display

- **X-axis**: Wavelength (nm or μm)
- **Y-axis**: Spectral radiance (relative units)
- **Visible band**: Highlighted region (380–700 nm)
- **Peak marker**: Shows $\lambda_{\text{peak}}$ from Wien's law

### Comparison Mode

Toggle to compare two temperatures simultaneously:
- See how doubling temperature shifts the peak to half the wavelength
- Observe the dramatic increase in total area (Stefan-Boltzmann)

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Hotter objects emit more radiation AND at shorter wavelengths
2. Color reveals temperature (red = cool, blue = hot)
3. Stars are approximately blackbodies
4. The spectral peak shifts predictably with temperature (Wien's law)
5. Total power scales as $T^4$ (Stefan-Boltzmann law)

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Red means hot" (fire analogy) | In astronomy, red = cool, blue = hot |
| "Blue stars are young" | Blue = hot, not necessarily young |
| "The Sun is yellow" | Sun peaks in green; appears white from space |
| "Infrared means 'heat'" | All thermal radiation carries energy |

### Discussion Questions

1. Why do we see heated metal glow red before white?
2. If a star is twice as hot as the Sun, how much more luminous is it (same radius)?
3. Why can't we see stars cooler than ~2,500 K with our eyes?
4. How do infrared telescopes help us see cool objects like brown dwarfs?

### In-Class Activities

**Temperature estimation:**
- Show images of stars, have students rank by temperature from color
- Reveal actual temperatures, discuss the "red = cool" reversal from everyday experience

**Wien's law calculation:**
- Given peak wavelength, calculate temperature
- Given temperature, predict color (which part of spectrum dominates)

## Technical Details

### Files

```
blackbody-radiation/
├── index.html      # Standalone demo page
├── blackbody.js    # Core visualization logic
└── README.md       # This file
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation, constants)
- `../_assets/starfield.js` — Animated background

### Numerical Implementation

The Planck function is computed with overflow protection:
- Uses logarithmic form for extreme temperatures
- Avoids underflow at long wavelengths
- Properly handles UV cutoff at high temperatures

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo blackbody-radiation >}}
{{< demo blackbody-radiation height="600px" >}}
```

## Future Features

### Version 2 Ideas

**Enhanced visualization:**
- [ ] Animated temperature sweep showing color transition
- [ ] Area-under-curve visualization for Stefan-Boltzmann
- [ ] Multi-star comparison (plot 3+ stars simultaneously)
- [ ] Rayleigh-Jeans and Wien approximations overlay

**Stellar connection:**
- [ ] HR diagram link (click star → show its blackbody)
- [ ] Spectral type labels on temperature axis
- [ ] Real stellar spectra comparison (absorption lines)
- [ ] Binary star combined spectrum

**Educational features:**
- [ ] Quiz mode: "What temperature produces this color?"
- [ ] Interactive Wien's law derivation
- [ ] Stefan-Boltzmann calculator
- [ ] Luminosity comparison tool

### Accessibility Improvements

- [ ] Screen reader descriptions of spectral curves
- [ ] Keyboard navigation for temperature slider
- [ ] High-contrast mode
- [ ] Data table alternative to visual spectrum

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 5
- [Planck's Law - Wikipedia](https://en.wikipedia.org/wiki/Planck%27s_law)
- [CODATA 2018 Fundamental Constants](https://physics.nist.gov/cuu/Constants/)

---

*Part of the AstroEd Demos collection for ASTR 101*

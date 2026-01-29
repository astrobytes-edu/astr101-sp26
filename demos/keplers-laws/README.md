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

## Math Rendering

All formulas use KaTeX for proper mathematical typesetting. The demo uses:

- `data-math` attributes for static formulas
- Direct `katex.render()` for dynamic values
- `AstroUtils.renderAllMath()` for initialization

LaTeX source for key formulas:

- Kepler's 3rd Law: `P^2 = a^3`
- Newton's Law: `F = \frac{GMm}{r^2}`
- Vis-viva: `v = \sqrt{GM\left(\frac{2}{r} - \frac{1}{a}\right)}`
- Acceleration: `a = \frac{GM}{r^2}`

## Files

- `index.html` - Demo page with all UI elements
- `keplers-laws.js` - Physics, rendering, and interaction logic
- `README.md` - This documentation

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

## Usage

```html
{{< demo keplers-laws height="700px" >}}
```

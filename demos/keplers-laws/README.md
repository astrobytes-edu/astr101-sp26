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

## Files

- `index.html` - Demo page with all UI elements
- `keplers-laws.js` - Physics, rendering, and interaction logic
- `README.md` - This documentation

## Usage

```html
{{< demo keplers-laws height="700px" >}}
```

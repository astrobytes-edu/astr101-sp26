# Physics Module

Single source of truth for astronomical constants and unit conversions.

## Files

- `astro-constants.js` - Definitional constants (time scales, lengths, gravity)
- `units.js` - Unit conversion helpers
- `two-body-analytic.js` - Orbital mechanics functions

## Usage

### Loading Order (Browser)

```html
<script src="_assets/physics/astro-constants.js"></script>
<script src="_assets/physics/units.js"></script>
<script src="_assets/physics/two-body-analytic.js"></script>
```

### Angle Conversions

**Always use `AstroUnits.degToRad()` and `AstroUnits.radToDeg()`** instead of inline `* Math.PI / 180`:

```javascript
// Good:
const radians = AstroUnits.degToRad(angleDeg);
const degrees = AstroUnits.radToDeg(angleRad);

// Avoid:
const radians = angleDeg * Math.PI / 180;  // Duplicates conversion logic
```

### Distance Constants

Use `AstroConstants.LENGTH` for all astronomical distances:

```javascript
const AU = AstroConstants.LENGTH.KM_PER_AU;   // 149597870.7 km
const LY = AstroConstants.LENGTH.KM_PER_LY;   // 9.461e12 km
const PC = AstroConstants.LENGTH.KM_PER_PC;   // 3.086e13 km
```

### Time Scales

Use `AstroConstants.TIME` for all astronomical time scales:

```javascript
const tropicalYear = AstroConstants.TIME.MEAN_TROPICAL_YEAR_DAYS;  // 365.2422
const synodicMonth = AstroConstants.TIME.MEAN_SYNODIC_MONTH_DAYS;  // 29.530588
const siderealMonth = AstroConstants.TIME.MEAN_SIDEREAL_MONTH_DAYS; // 27.321661
```

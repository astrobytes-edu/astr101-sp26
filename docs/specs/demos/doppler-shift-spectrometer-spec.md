# Doppler Shift Spectrometer (L10) — Demo Spec

## One-sentence goal

Students manipulate a radial velocity and directly observe spectral lines shift, practicing $\Delta\lambda/\lambda_0 = v/c$ with the correct sign and the “radial vs transverse” distinction.

## Lecture alignment

- Primary: Lecture 10 (Doppler, radial velocity, exoplanet RV method)
- Bridge: Lecture 9 (spectral lines as stable features you can track)

## Teach-first → museum later

Build and harden here first (fast iteration with the L10 reading). Migrate later into Cosmic Playground with the same Doppler model and shared spectra dataset.

## Learning goals (students can…)

1. Use $\Delta\lambda/\lambda_0 = v/c$ with the correct sign.
2. Explain why only **radial** motion causes Doppler shifts.
3. Recognize Doppler shift as a **fractional** change that applies across the spectrum.

## Hard sign convention (must match the course reading)

Use exactly:

- $\Delta\lambda = \lambda_{\text{obs}} - \lambda_0$
- $\Delta\lambda > 0$ → redshift → **receding** ($v_r > 0$)
- $\Delta\lambda < 0$ → blueshift → **approaching** ($v_r < 0$)

## UX / structure (shared demo principles)

- Predict → Play → Explain loop.
- Single stage; compact readouts below.
- Include an “instrument resolution/broadening” control.

## Core interactions (must-have)

1. **Radial velocity slider**
   - Default range: −300 to +300 km/s (optionally a “fast” mode later).

2. **Rest vs observed overlay**
   - Rest spectrum is fixed.
   - Observed spectrum is shifted by the current $v_r$.

3. **Line selection cursor**
   - Student selects a specific line and the demo displays $\lambda_0$, $\lambda_{\text{obs}}$, and $\Delta\lambda$ for that line.

4. **Δλ readout + “check your sign” prompt**
   - Student answers:
     - “Approaching or receding?”
     - (Optionally) enters the computed $v$ value.

5. **Radial vs transverse toggle**
   - Radial mode: shifts applied.
   - Transverse mode: no wavelength shift (optionally show a proper-motion arrow).

## Stage + readouts

### Stage

- Two spectra overlaid:
  - Rest (neutral/gray)
  - Observed (accent color)
- A draggable marker/cursor to select a line and read its values.

### Readouts (below stage)

- $v_r$ (km/s)
- Selected line: $\lambda_0$, $\lambda_{\text{obs}}$, $\Delta\lambda$
- Computed $v = c\,\Delta\lambda/\lambda_0$ (same sign convention)
- Approaching/receding indicator
- Instrument broadening value (R or Δλ)

## Physics model

### ASTR 101 mode (default)

$$\lambda_{\text{obs}} = \lambda_0(1 + v_r/c)$$

### Optional: Relativistic toggle (future)

$$1+z=\sqrt{\\frac{1+\\beta}{1-\\beta}}, \\quad \\beta=v/c$$

Do not block v1 on this.

## Data dependencies

- Reuse the shared spectra datasets and contract:
  - `docs/contracts/spectra-data-contract.md`
  - Minimal v1 selection: Hα, Hβ, Na D (and optionally Ca H/K).

## Built-in assessment prompts

- Prompt 1 (sign): “If Δλ is negative, is the star approaching or receding?”
- Prompt 2 (compute): “Hα observed at 656.50 nm, rest 656.28 nm → what’s v?”
- Prompt 3 (radial vs transverse): “Star moving sideways at 200 km/s → what Doppler shift?”

## Accessibility notes

- Keyboard reachable controls; labels announced.
- Readouts are not color-only; include text verdict.

## Acceptance tests (demo done-definition)

- At $v_r = 0$, spectra coincide.
- At $v_r > 0$ (receding), wavelengths increase; at $v_r < 0$, decrease.
- In transverse mode, wavelengths do not change.


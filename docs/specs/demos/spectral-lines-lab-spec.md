# Spectral Lines Lab (L9) — Demo Spec

## One-sentence goal

Students practice Kirchhoff’s laws (continuous/emission/absorption) and use **line pattern fingerprints** to identify elements in an unknown spectrum.

## Lecture alignment

- Primary: Lecture 9 (Kirchhoff’s laws + line fingerprints)
- Optional bridge: Lecture 7–8 (continuum / blackbody as the background “smooth glow”)
- Soft setup: Lecture 10 (lines as features you can track over time for Doppler and RV)

## Teach-first → museum later

This demo is built and validated in the ASTR 101 demo suite first (tight iteration with readings and station cards). After it’s teaching-stable, it can be migrated into the Cosmic Playground “demo museum” later with minimal translation (same datasets, same contract, same conceptual UI).

## Learning goals (students can…)

1. Predict which spectrum type appears for a physical setup (continuous / emission / absorption).
2. Recognize that each element has a **pattern** of lines (not a single “signature line”).
3. Match an unknown spectrum to element “cards” using pattern recognition.

## Misconceptions targeted

- “Elements have one signature line.” → Reality: patterns and multiplets matter.
- “Absorption lines and emission lines happen at different wavelengths.” → Reality: **same wavelengths**, inverted contrast.
- “A spectrum is a picture of the object.” → Reality: it’s data versus wavelength.

## UX / structure (shared demo principles)

- Predict → Play → Explain loop (mission prompt first, then interaction, then commit-to-answer).
- Single stage with compact readouts below; avoid wordy side panels.
- “Instrument resolution/broadening” is a core control (spectra aren’t razor-thin).

## Core interactions (must-have)

1. **Setup selector (Kirchhoff mode)**
   - `HotDense` → continuous spectrum
   - `HotThinGas` → emission lines
   - `CoolGasInFront` → absorption lines on a continuum

2. **Element cards (multi-select)**
   - Choose 1–3 elements; spectrum updates live.

3. **Unknown overlay + match check**
   - “Show Unknown Spectrum” toggles an unlabeled overlay.
   - Student selects elements they think are present; clicks **Check Match**.
   - Returns a **match score (0–100%)** plus a short text verdict.

4. **Emission vs absorption toggle (optional if setup implies it)**
   - Reinforces “same line positions; inverted.”

## Stage + readouts

### Stage (main visual)

- Wavelength axis:
  - Default: **380–700 nm** (visible mode).
- Spectrum display modes:
  - continuous: smooth blackbody-like curve (stylized OK)
  - emission: vertical lines on dark background
  - absorption: continuum with dips at line positions

### Readouts (below stage)

- Current setup label (e.g., “Hot thin gas → emission spectrum”)
- Selected elements
- Match score (0–100%)
- Instrument resolution readout (either **R** or **Δλ**)

## Missions (student-facing tasks)

- Mission A (Kirchhoff): “Which setup produces absorption lines?”
- Mission B (Fingerprint): “Unknown spectrum contains 2 elements — find both.”
- Mission C (Mixtures): “Why does the Sun have a continuous spectrum and absorption lines?”

## Data contract

All spectral data must follow `docs/contracts/spectra-data-contract.md`.

### Atomic line dataset (v1)

Use a small verified seed set (no physically accurate intensities yet; `relative_strength` is illustrative).

Suggested v1 “cards”:

- Hydrogen Balmer (air): Hδ 4101.74 Å, Hγ 4340.462 Å, Hβ ~4861.28 Å, Hα ~6562.7–6562.9 Å
- Sodium D doublet (air): 5889.950 Å and 5895.924 Å
- Calcium (air): Ca II K 3933.6614 Å and Ca II H 3968.4673 Å; optional Ca I 4226.727 Å

Implementation note: store wavelengths in nm (Å / 10).

## VERIFY workflow (UI + scoring)

- Any feature with `verified: false` must show a “VERIFY” badge.
- Any `verified: false` feature is excluded from graded “Check Match” scoring unless the instructor enables “include unverified.”

## Optional extensions (layered; keep default simple)

### A) Molecules in IR mode (fingerprint mode)

- Add an IR toggle that displays **broad absorption dips** at sourced band centers (no HITRAN line-by-line in v1).
- UI banner: “Band centers are sourced; shapes are illustrative (not HITRAN line-by-line).”

Required v1 molecules:
- CO₂ near ~4.3 µm and ~15 µm
- H₂O near ~6.2–6.3 µm
- CH₄ near ~3.3 µm
- CO near ~4.67 µm

### B) Mechanism mode (deep dive)

This is a “why does this happen” toggle, not the default experience.

1. **Atom mechanism (Bohr-like)**
   - Show a simple energy-level ladder (Hydrogen-first).
   - Clicking a transition highlights the corresponding line on the spectrum.
   - Keep labels interpretive; do not require full derivations to use the mode.

2. **Molecule mechanism (vib/rot)**
   - Show vibrational levels (v) with rotational sublevels (J) to justify why a “band” exists.
   - A temperature slider widens the envelope (toy model; explicitly labeled).

## Accessibility notes

- Controls are keyboard reachable and labeled.
- Match feedback is not color-only (include text, icons, or patterns).
- Avoid tiny text; keep readouts legible at projector scale.

## Acceptance tests (demo done-definition)

- Switching setups correctly flips between continuous/emission/absorption.
- Absorption dips occur at the same wavelengths as emission peaks for the same selected species.
- Unknown matches are correct for:
  - Hydrogen-only (Balmer set)
  - Sodium-only (D doublet)
  - Hydrogen + Sodium mixture


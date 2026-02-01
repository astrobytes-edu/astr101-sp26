# Spectra Data Contract (ASTR 101 demos)

**Status:** Active (Phase 1: ASTR 101 demo suite in this repo)  
**Migration intent:** This contract is designed to migrate cleanly into the Cosmic Playground “demo museum” later.

## Purpose

Provide a single, enforceable data contract for spectral **atomic lines** and **molecular IR bands** used across:

- Spectral Lines Lab (L9)
- Doppler Shift Spectrometer (L10)
- Binary Orbits RV overlay + spectral inset (L10)

This contract prevents “silent drift” in wavelengths, units, and provenance.

## Hard invariants

1. **No unsourced truth:** if `verified: true`, then `sources[]` must be non-empty.
2. **Explicit units:** every spectral coordinate includes an explicit unit (`nm`, `um`, or `cm-1`) and (where relevant) a medium (`air` vs `vacuum`).
3. **Unique IDs:** every feature `id` must be unique within a dataset.
4. **VERIFY rule (UI + scoring):**
   - If `verified: false`, the demo must display a visible “VERIFY” badge.
   - If `verified: false`, the feature is excluded from graded “Check Match” scoring unless the instructor enables “include unverified.”

## Data locations (Phase 1: this repo)

- Atomic lines dataset: `demos/_assets/spectra/atomic-lines.v1.json`
- Molecular bands dataset: `demos/_assets/spectra/molecular-bands.v1.json`
- Browser bundle (UMD, committed): `demos/_assets/spectra/spectra-data.v1.js`

> In this repo, validation is enforced via Node tests (no bundler, no runtime deps). In Cosmic Playground, the same schema should be implemented with Zod at build time.

## Dataset envelope: `SpectraLibrary`

Each JSON file is a `SpectraLibrary` object:

```json
{
  "schema_version": "1.0.0",
  "dataset_id": "atomic-lines.v1",
  "description": "Verified atomic lines used in ASTR 101 spectra demos (v1).",
  "generated_at": "2026-02-01",
  "features": [ /* SpectralFeature[] */ ]
}
```

### Required fields

- `schema_version`: semver string, e.g. `1.0.0`
- `dataset_id`: short identifier, e.g. `atomic-lines.v1`
- `features`: non-empty array of spectral features

## Provenance: `sources[]` and verification

Every feature must include:

```json
{
  "verified": true,
  "sources": [
    {
      "name": "NIST Strong Lines of Sodium (Na)",
      "url": "https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm",
      "accessed": "2026-02-01",
      "notes": "air wavelengths; seed dataset"
    }
  ]
}
```

Rules:

- If `verified: true` → `sources.length >= 1` is required.
- If `verified: false` → `sources` may be empty (preferred until sourced), but UI must show “VERIFY”.

## Spectral coordinate

```json
{
  "value": 656.281,
  "unit": "nm",
  "medium": "air"
}
```

- `unit` is one of: `nm`, `um`, `cm-1`
- `medium` is optional and only meaningful for wavelength values; if `unit: "nm"` for atomic lines, `medium` is required (`air` or `vacuum`).

## Feature kinds

All features are a discriminated union on `kind`.

### 1) Atomic lines: `kind = "atomic_line"`

```json
{
  "kind": "atomic_line",
  "id": "H_I_Ha",
  "label": "Hydrogen Hα",
  "species": "H I",
  "line_name": "Hα",
  "wavelength": { "value": 656.281, "unit": "nm", "medium": "air" },
  "relative_strength": 1.0,
  "verified": true,
  "sources": [ /* ... */ ],
  "notes": "Multiplet/components simplified for teaching."
}
```

Constraints:

- `wavelength.unit` must be `nm`.
- `wavelength.medium` must be `air` or `vacuum`.
- `relative_strength` is **illustrative only** unless a future dataset adds sourced transition probabilities.

### 2) Molecular IR bands: `kind = "molecular_band"`

```json
{
  "kind": "molecular_band",
  "id": "CO2_15um",
  "label": "CO₂ ~15 µm band",
  "molecule": "CO2",
  "band_type": "rovibrational",
  "center": { "value": 15.0, "unit": "um" },
  "range": { "min": 13.0, "max": 17.0, "unit": "um" },
  "profile": "gaussian",
  "verified": true,
  "sources": [ /* ... */ ],
  "notes": "Band center sourced; shape is illustrative (not HITRAN line-by-line)."
}
```

Constraints:

- `center.unit` must be `um` or `cm-1` (not `nm`).
- If `range` is present: `min < max` and `unit` matches the intended axis for the demo.

## Validation approach

### Phase 1 (this repo)

- Enforce contract via Node tests that load the JSON and assert:
  - unique IDs
  - required fields
  - provenance rule for `verified: true`
  - sensible units for each `kind`

### Phase 2 (Cosmic Playground)

- Implement the contract as a Zod schema (`docs/specs/demos/*` should reference this contract as the source of truth).
- Validate datasets at build time in CI; optionally validate in dev mode after fetching.


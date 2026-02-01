/* SpectraDataV1
 *
 * Browser-friendly UMD bundle for spectral seed datasets used across demos.
 *
 * Canonical sources (Phase 1):
 * - demos/_assets/spectra/atomic-lines.v1.json
 * - demos/_assets/spectra/molecular-bands.v1.json
 *
 * This JS file is intentionally committed so `demos/<demo>/index.html` works without fetch()
 * (including when opened as a local file).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.SpectraDataV1 = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const atomicLibrary = {
    schema_version: '1.0.0',
    dataset_id: 'atomic-lines.v1',
    description:
      'Verified atomic lines used in ASTR 101 spectra demos (v1). Wavelengths are given in nm with medium specified.',
    generated_at: '2026-02-01',
    features: [
      {
        kind: 'atomic_line',
        id: 'H_I_Hd',
        label: 'Hydrogen Hδ (Balmer)',
        species: 'H I',
        line_name: 'Hδ',
        wavelength: { value: 410.174, unit: 'nm', medium: 'air' },
        relative_strength: 0.4,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Hydrogen (H)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/hydrogentable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
      },
      {
        kind: 'atomic_line',
        id: 'H_I_Hg',
        label: 'Hydrogen Hγ (Balmer)',
        species: 'H I',
        line_name: 'Hγ',
        wavelength: { value: 434.0462, unit: 'nm', medium: 'air' },
        relative_strength: 0.5,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Hydrogen (H)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/hydrogentable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
      },
      {
        kind: 'atomic_line',
        id: 'H_I_Hb',
        label: 'Hydrogen Hβ (Balmer)',
        species: 'H I',
        line_name: 'Hβ',
        wavelength: { value: 486.128, unit: 'nm', medium: 'air' },
        relative_strength: 0.8,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Hydrogen (H)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/hydrogentable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
        notes:
          "Balmer Hβ has multiple components in detailed tables; represented here as a single teaching line.",
      },
      {
        kind: 'atomic_line',
        id: 'H_I_Ha',
        label: 'Hydrogen Hα (Balmer)',
        species: 'H I',
        line_name: 'Hα',
        wavelength: { value: 656.281, unit: 'nm', medium: 'air' },
        relative_strength: 1.0,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Hydrogen (H)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/hydrogentable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
        notes:
          "Balmer Hα has multiple components in detailed tables; represented here as a single teaching line.",
      },
      {
        kind: 'atomic_line',
        id: 'Na_I_D2',
        label: 'Sodium D2',
        species: 'Na I',
        line_name: 'D2',
        wavelength: { value: 588.995, unit: 'nm', medium: 'air' },
        relative_strength: 1.0,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Sodium (Na)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
      },
      {
        kind: 'atomic_line',
        id: 'Na_I_D1',
        label: 'Sodium D1',
        species: 'Na I',
        line_name: 'D1',
        wavelength: { value: 589.5924, unit: 'nm', medium: 'air' },
        relative_strength: 0.9,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Sodium (Na)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
      },
      {
        kind: 'atomic_line',
        id: 'Ca_II_K',
        label: 'Calcium II K',
        species: 'Ca II',
        line_name: 'K',
        wavelength: { value: 393.36614, unit: 'nm', medium: 'air' },
        relative_strength: 1.0,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Calcium (Ca)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/calciumtable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
      },
      {
        kind: 'atomic_line',
        id: 'Ca_II_H',
        label: 'Calcium II H',
        species: 'Ca II',
        line_name: 'H',
        wavelength: { value: 396.84673, unit: 'nm', medium: 'air' },
        relative_strength: 0.9,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Calcium (Ca)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/calciumtable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
      },
      {
        kind: 'atomic_line',
        id: 'Ca_I_422_7',
        label: 'Calcium I 422.67 nm',
        species: 'Ca I',
        line_name: '422.67 nm',
        wavelength: { value: 422.6727, unit: 'nm', medium: 'air' },
        relative_strength: 0.6,
        verified: true,
        sources: [
          {
            name: 'NIST Strong Lines of Calcium (Ca)',
            url: 'https://physics.nist.gov/PhysRefData/Handbook/Tables/calciumtable2.htm',
            accessed: '2026-02-01',
            notes: 'air wavelengths; seed dataset',
          },
        ],
        notes: 'Optional third calcium line for pattern matching.',
      },
    ],
  };

  const molecularLibrary = {
    schema_version: '1.0.0',
    dataset_id: 'molecular-bands.v1',
    description:
      'Verified IR molecular band centers used in ASTR 101 spectra demos (v1). Band centers are sourced; shapes are illustrative.',
    generated_at: '2026-02-01',
    features: [
      {
        kind: 'molecular_band',
        id: 'CH4_3p3um',
        label: 'CH₄ ~3.3 µm band',
        molecule: 'CH4',
        band_type: 'rovibrational',
        center: { value: 3.3, unit: 'um' },
        profile: 'gaussian',
        verified: true,
        sources: [
          {
            name: 'NASA Technical Reports Server — Optical Parametric Technology for Methane Measurements',
            url: 'https://ntrs.nasa.gov/api/citations/20150021063/downloads/20150021063.pdf?utm_source=chatgpt.com',
            accessed: '2026-02-01',
            notes: 'band center anchor; seed dataset',
          },
        ],
        notes: 'Band center sourced; shape is illustrative (not HITRAN line-by-line).',
      },
      {
        kind: 'molecular_band',
        id: 'CO2_4p3um',
        label: 'CO₂ ~4.3 µm band',
        molecule: 'CO2',
        band_type: 'rovibrational',
        center: { value: 4.3, unit: 'um' },
        profile: 'gaussian',
        verified: true,
        sources: [
          {
            name: 'NASA Technical Reports Server — Synthetic atmospheric transmittance spectra near 15 and ...',
            url: 'https://ntrs.nasa.gov/citations/19780040862?utm_source=chatgpt.com',
            accessed: '2026-02-01',
            notes: 'band center anchor; seed dataset',
          },
        ],
        notes: 'Band center sourced; shape is illustrative (not HITRAN line-by-line).',
      },
      {
        kind: 'molecular_band',
        id: 'CO_4p67um',
        label: 'CO ~4.67 µm band',
        molecule: 'CO',
        band_type: 'rovibrational',
        center: { value: 4.67, unit: 'um' },
        profile: 'gaussian',
        verified: true,
        sources: [
          {
            name: 'NASA Technical Reports Server — Imaging spectroscopy of the solar CO lines at 4.67 microns',
            url: 'https://ntrs.nasa.gov/citations/19950038198?utm_source=chatgpt.com',
            accessed: '2026-02-01',
            notes: 'band center anchor; seed dataset',
          },
        ],
        notes: 'Band center sourced; shape is illustrative (not HITRAN line-by-line).',
      },
      {
        kind: 'molecular_band',
        id: 'H2O_6p3um',
        label: 'H₂O ~6.3 µm band',
        molecule: 'H2O',
        band_type: 'rovibrational',
        center: { value: 6.3, unit: 'um' },
        profile: 'gaussian',
        verified: true,
        sources: [
          {
            name: 'NOAA / NESDIS / STAR — Quick Guide ABI Band 8 (6.2 μm)',
            url: 'https://www.star.nesdis.noaa.gov/GOES/documents/ABIQuickGuide_Band08.pdf?utm_source=chatgpt.com',
            accessed: '2026-02-01',
            notes: 'water vapor band anchor; seed dataset',
          },
        ],
        notes: 'Band center sourced; shape is illustrative (not HITRAN line-by-line).',
      },
      {
        kind: 'molecular_band',
        id: 'CO2_15um',
        label: 'CO₂ ~15 µm band',
        molecule: 'CO2',
        band_type: 'rovibrational',
        center: { value: 15.0, unit: 'um' },
        profile: 'gaussian',
        verified: true,
        sources: [
          {
            name: 'NASA Technical Reports Server — Synthetic atmospheric transmittance spectra near 15 and ...',
            url: 'https://ntrs.nasa.gov/citations/19780040862?utm_source=chatgpt.com',
            accessed: '2026-02-01',
            notes: 'band center anchor; seed dataset',
          },
        ],
        notes: 'Band center sourced; shape is illustrative (not HITRAN line-by-line).',
      },
    ],
  };

  return {
    atomicLibrary,
    molecularLibrary,
    atomicLines: atomicLibrary.features.slice(),
    molecularBands: molecularLibrary.features.slice(),
  };
});

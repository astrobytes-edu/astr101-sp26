const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readJson(...segments) {
  const filePath = path.join(__dirname, '..', ...segments);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.length > 0, `${label} must be non-empty`);
}

function assertSourcesContract(feature) {
  assert.equal(typeof feature.verified, 'boolean', 'verified must be boolean');
  assert.ok(Array.isArray(feature.sources), 'sources must be an array');

  if (feature.verified) {
    assert.ok(feature.sources.length > 0, 'verified=true requires sources[] to be non-empty');
  }

  for (const [i, s] of feature.sources.entries()) {
    assertNonEmptyString(s?.name, `sources[${i}].name`);
    if (s.url !== undefined) {
      assertNonEmptyString(s.url, `sources[${i}].url`);
    }
    if (s.citation !== undefined) {
      assertNonEmptyString(s.citation, `sources[${i}].citation`);
    }
  }
}

function assertUniqueIds(features) {
  const seen = new Set();
  for (const f of features) {
    assertNonEmptyString(f.id, 'feature.id');
    assert.ok(!seen.has(f.id), `Duplicate feature id: ${f.id}`);
    seen.add(f.id);
  }
}

function assertSpectraLibraryContract(lib) {
  assertNonEmptyString(lib.schema_version, 'schema_version');
  assertNonEmptyString(lib.dataset_id, 'dataset_id');
  assert.ok(Array.isArray(lib.features) && lib.features.length > 0, 'features must be a non-empty array');
  assertUniqueIds(lib.features);
}

test('spectra data contract: atomic-lines.v1.json', () => {
  const lib = readJson('demos', '_assets', 'spectra', 'atomic-lines.v1.json');
  assertSpectraLibraryContract(lib);

  for (const f of lib.features) {
    assertNonEmptyString(f.label, 'feature.label');
    assertSourcesContract(f);
    assert.equal(f.kind, 'atomic_line');
    assertNonEmptyString(f.species, 'atomic_line.species');
    assertNonEmptyString(f.line_name, 'atomic_line.line_name');

    assert.equal(f.wavelength?.unit, 'nm');
    assert.ok(f.wavelength?.value > 0);
    assert.ok(f.wavelength?.medium === 'air' || f.wavelength?.medium === 'vacuum');

    if (f.relative_strength !== undefined) {
      assert.ok(f.relative_strength >= 0 && f.relative_strength <= 1);
    }
  }
});

test('spectra data contract: molecular-bands.v1.json', () => {
  const lib = readJson('demos', '_assets', 'spectra', 'molecular-bands.v1.json');
  assertSpectraLibraryContract(lib);

  for (const f of lib.features) {
    assertNonEmptyString(f.label, 'feature.label');
    assertSourcesContract(f);
    assert.equal(f.kind, 'molecular_band');
    assertNonEmptyString(f.molecule, 'molecular_band.molecule');

    assert.ok(f.center?.unit === 'um' || f.center?.unit === 'cm-1');
    assert.ok(f.center?.value > 0);

    if (f.range !== undefined) {
      assert.ok(f.range.unit === 'um' || f.range.unit === 'cm-1');
      assert.ok(f.range.min > 0 && f.range.max > 0);
      assert.ok(f.range.min < f.range.max);
    }
  }
});

test('spectra data bundle: exports atomicLines and molecularBands for demos', () => {
  // Browser-facing UMD bundle used by demos. In Node tests, it should be require()able.
  const SpectraDataV1 = require('../demos/_assets/spectra/spectra-data.v1.js');
  assert.ok(Array.isArray(SpectraDataV1.atomicLines));
  assert.ok(Array.isArray(SpectraDataV1.molecularBands));
});


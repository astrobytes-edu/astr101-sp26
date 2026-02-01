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

function assertSourcesContract(record) {
  assert.equal(typeof record.verified, 'boolean', 'verified must be boolean');
  assert.ok(Array.isArray(record.sources), 'sources must be an array');

  if (record.verified) {
    assert.ok(record.sources.length > 0, 'verified=true requires sources[] to be non-empty');
  }

  for (const [i, s] of record.sources.entries()) {
    assertNonEmptyString(s?.name, `sources[${i}].name`);
    if (s.citation !== undefined) {
      assertNonEmptyString(s.citation, `sources[${i}].citation`);
    }
    if (s.url !== undefined) {
      assertNonEmptyString(s.url, `sources[${i}].url`);
    }
  }
}

function assertPresetContract(p) {
  assertNonEmptyString(p.id, 'preset.id');
  assertNonEmptyString(p.label, 'preset.label');
  assert.ok(p.kind === 'solar_system' || p.kind === 'exoplanet', 'preset.kind must be solar_system|exoplanet');
  assertSourcesContract(p);

  assert.ok(Number.isFinite(p.lstar_lsun), 'preset.lstar_lsun must be a number');
  assert.ok(Number.isFinite(p.d_au), 'preset.d_au must be a number');
  assert.ok(Number.isFinite(p.bond_albedo), 'preset.bond_albedo must be a number');

  if (p.bond_albedo_assumed !== undefined) {
    assert.equal(typeof p.bond_albedo_assumed, 'boolean');
  }
  if (p.tau_ir !== undefined) {
    assert.ok(Number.isFinite(p.tau_ir));
  }
  if (p.tau_ir_assumed !== undefined) {
    assert.equal(typeof p.tau_ir_assumed, 'boolean');
  }
  if (p.t_eq_k !== undefined) {
    assert.ok(Number.isFinite(p.t_eq_k));
  }
  if (p.t_surf_k !== undefined) {
    assert.ok(Number.isFinite(p.t_surf_k));
  }
}

test('climate presets contract: planet-presets.v1.json', () => {
  const data = readJson('demos', '_assets', 'climate', 'planet-presets.v1.json');
  assertNonEmptyString(data.schema_version, 'schema_version');
  assertNonEmptyString(data.dataset_id, 'dataset_id');
  assert.ok(Array.isArray(data.presets) && data.presets.length > 0, 'presets must be a non-empty array');

  const ids = new Set();
  for (const p of data.presets) {
    assertPresetContract(p);
    assert.ok(!ids.has(p.id), `Duplicate preset id: ${p.id}`);
    ids.add(p.id);
  }

  const byId = Object.fromEntries(data.presets.map((p) => [p.id, p]));
  for (const id of ['venus', 'earth', 'mars']) {
    assert.ok(byId[id], `Missing Solar System preset: ${id}`);
    assert.ok(Number.isFinite(byId[id].d_au));
    assert.ok(Number.isFinite(byId[id].bond_albedo));
    assert.ok(Number.isFinite(byId[id].tau_ir) || Number.isFinite(byId[id].t_surf_k));
  }
});

test('climate presets bundle: planet-presets.v1.js matches JSON (no derived math)', () => {
  const json = readJson('demos', '_assets', 'climate', 'planet-presets.v1.json');
  const js = require('../demos/_assets/climate/planet-presets.v1.js');
  assert.deepEqual(js, json);
});


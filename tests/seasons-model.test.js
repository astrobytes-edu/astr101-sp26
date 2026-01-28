const test = require('node:test');
const assert = require('node:assert/strict');

const SeasonsModel = require('../demos/_assets/seasons-model.js');

test('sunDeclinationDeg: day ~80 is ~0° in the simplified model', () => {
  const deg = SeasonsModel.sunDeclinationDeg({ dayOfYear: 80, axialTiltDeg: 23.5 });
  assert.ok(Math.abs(deg) < 1e-9, `expected 0, got ${deg}`);
});

test('sunDeclinationDeg: solstices reach ~±axialTilt in the geometry model', () => {
  const eps = 23.5;
  const june = 80 + 365.2422 / 4;
  const dec = 80 + (3 * 365.2422) / 4;
  const dJune = SeasonsModel.sunDeclinationDeg({ dayOfYear: june, axialTiltDeg: eps });
  const dDec = SeasonsModel.sunDeclinationDeg({ dayOfYear: dec, axialTiltDeg: eps });
  assert.ok(Math.abs(dJune - eps) < 1e-6, `expected ~${eps}, got ${dJune}`);
  assert.ok(Math.abs(dDec + eps) < 1e-6, `expected ~-${eps}, got ${dDec}`);
});

test('dayLengthHours: equator is ~12h regardless of declination', () => {
  const h1 = SeasonsModel.dayLengthHours({ latitudeDeg: 0, sunDeclinationDeg: 23.5 });
  const h2 = SeasonsModel.dayLengthHours({ latitudeDeg: 0, sunDeclinationDeg: -23.5 });
  assert.ok(Math.abs(h1 - 12) < 1e-9, `expected 12, got ${h1}`);
  assert.ok(Math.abs(h2 - 12) < 1e-9, `expected 12, got ${h2}`);
});

test('dayLengthHours: polar day/night behavior', () => {
  const midSummer = SeasonsModel.dayLengthHours({ latitudeDeg: 80, sunDeclinationDeg: 23.5 });
  const midWinter = SeasonsModel.dayLengthHours({ latitudeDeg: 80, sunDeclinationDeg: -23.5 });
  assert.equal(midSummer, 24);
  assert.equal(midWinter, 0);
});

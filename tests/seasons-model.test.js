const test = require('node:test');
const assert = require('node:assert/strict');

const SeasonsModel = require('../demos/_assets/seasons-model.js');

test('sunDeclinationDeg: day ~80 is ~0° in the simplified model', () => {
  const deg = SeasonsModel.sunDeclinationDeg({ dayOfYear: 80, axialTiltDeg: 23.5 });
  assert.ok(Math.abs(deg) < 1e-9, `expected 0, got ${deg}`);
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


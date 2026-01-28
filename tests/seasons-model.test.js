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

test('earthSunDistanceAu: perihelion/aphelion bracket 1 AU (toy model)', () => {
  assert.ok(typeof SeasonsModel.earthSunDistanceAu === 'function', 'expected earthSunDistanceAu export');

  const yearDays = 365.2422;
  const perihelionDay = 3;
  const rPeri = SeasonsModel.earthSunDistanceAu({ dayOfYear: perihelionDay, yearDays, perihelionDay });
  const rAp = SeasonsModel.earthSunDistanceAu({ dayOfYear: perihelionDay + yearDays / 2, yearDays, perihelionDay });

  assert.ok(rPeri < 1, `expected perihelion < 1 AU, got ${rPeri}`);
  assert.ok(rAp > 1, `expected aphelion > 1 AU, got ${rAp}`);
  assert.ok(rPeri > 0.97 && rPeri < 1.0, `expected perihelion near 1 AU, got ${rPeri}`);
  assert.ok(rAp > 1.0 && rAp < 1.03, `expected aphelion near 1 AU, got ${rAp}`);
});

test('orbitAngleRadFromDay: wraps every year', () => {
  assert.ok(typeof SeasonsModel.orbitAngleRadFromDay === 'function', 'expected orbitAngleRadFromDay export');

  const yearDays = 365.2422;
  const perihelionDay = 3;
  const a1 = SeasonsModel.orbitAngleRadFromDay({ dayOfYear: perihelionDay, yearDays, perihelionDay });
  const a2 = SeasonsModel.orbitAngleRadFromDay({ dayOfYear: perihelionDay + yearDays, yearDays, perihelionDay });

  const tau = 2 * Math.PI;
  const wrap = (rad) => ((rad % tau) + tau) % tau;
  const diff = wrap(a2 - a1);

  assert.ok(Number.isFinite(a1));
  assert.ok(Number.isFinite(a2));
  assert.ok(Math.abs(diff) < 1e-9, `expected wrap-around (Δ≈0), got ${diff}`);
});

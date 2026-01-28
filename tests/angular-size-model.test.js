const test = require('node:test');
const assert = require('node:assert/strict');

const AngularSizeModel = require('../demos/_assets/angular-size-model.js');

test('angularDiameterDeg: Sun at 1 AU is ~0.53°', () => {
  const deg = AngularSizeModel.angularDiameterDeg({
    diameterKm: 1.392e6,
    distanceKm: 1.496e8,
  });

  assert.ok(deg > 0.50 && deg < 0.60, `expected ~0.53°, got ${deg}`);
});

test('distanceForAngularDiameterDeg inverts angularDiameterDeg (approx)', () => {
  assert.ok(
    typeof AngularSizeModel.distanceForAngularDiameterDeg === 'function',
    'expected distanceForAngularDiameterDeg export'
  );

  const diameterKm = 3474;
  const angularDiameterDeg = 0.53;
  const distanceKm = AngularSizeModel.distanceForAngularDiameterDeg({ diameterKm, angularDiameterDeg });
  const back = AngularSizeModel.angularDiameterDeg({ diameterKm, distanceKm });
  assert.ok(Math.abs(back - angularDiameterDeg) < 1e-6, `expected ${angularDiameterDeg}, got ${back}`);
});

test('moonDistanceKmFromRecession: uses linear recession in km', () => {
  const todayKm = 384400;
  const recessionCmPerYr = 3.8;

  const futureKm = AngularSizeModel.moonDistanceKmFromRecession({
    distanceTodayKm: todayKm,
    recessionCmPerYr,
    timeMyr: 1000,
  });

  // 3.8 cm/yr = 38 km/Myr → +38,000 km over 1000 Myr.
  assert.equal(futureKm, todayKm + 38000);
});

test('ISS preset diameter is 109 m (0.109 km)', () => {
  assert.equal(AngularSizeModel.presets.iss.diameter, 0.109);
});

test('ISS overhead is on the order of ~1 arcmin at 420 km', () => {
  const deg = AngularSizeModel.angularDiameterDeg({
    diameterKm: 0.109,
    distanceKm: 420,
  });
  const arcmin = deg * 60;
  assert.ok(arcmin > 0.5 && arcmin < 1.5, `expected ~1 arcmin, got ${arcmin} arcmin`);
});

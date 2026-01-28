const test = require('node:test');
const assert = require('node:assert/strict');

const M = require('../demos/_assets/eclipse-geometry-model.js');

test('eclipticLatitudeDeg is 0 at the ascending node', () => {
  const beta = M.eclipticLatitudeDeg({ tiltDeg: 5.145, moonLonDeg: 10, nodeLonDeg: 10 });
  assert.ok(Math.abs(beta) < 1e-9);
});

test('eclipticLatitudeDeg is 0 at the descending node', () => {
  const beta = M.eclipticLatitudeDeg({ tiltDeg: 5.145, moonLonDeg: 190, nodeLonDeg: 10 });
  assert.ok(Math.abs(beta) < 1e-9);
});

test('eclipticLatitudeDeg max magnitude is ~tilt (small i)', () => {
  const tilt = 5.145;
  const beta = M.eclipticLatitudeDeg({ tiltDeg: tilt, moonLonDeg: 100, nodeLonDeg: 10 }); // 90° from node
  assert.ok(Math.abs(Math.abs(beta) - tilt) < 0.02);
});

test('phaseAngleDeg returns 0 at conjunction (New)', () => {
  assert.equal(M.phaseAngleDeg({ moonLonDeg: 123, sunLonDeg: 123 }), 0);
});

test('phaseAngleDeg returns 180 at opposition (Full)', () => {
  assert.equal(M.phaseAngleDeg({ moonLonDeg: 303, sunLonDeg: 123 }), 180);
});

test('nearestNodeDistanceDeg uses ascending/descending nodes', () => {
  const d1 = M.nearestNodeDistanceDeg({ moonLonDeg: 12, nodeLonDeg: 10 });
  const d2 = M.nearestNodeDistanceDeg({ moonLonDeg: 192, nodeLonDeg: 10 });
  assert.ok(d1 < 5);
  assert.ok(d2 < 5);
});

test('betaFromDeltaLambdaDeg matches published eclipse thresholds (approx)', () => {
  const tilt = 5.145;
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 10.5 }) - 0.94) < 0.05);
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 18.5 }) - 1.63) < 0.05);
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 4.6 }) - 0.41) < 0.05);
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 12.2 }) - 1.09) < 0.05);
});

test('deltaLambdaFromBetaDeg inverts betaFromDeltaLambdaDeg (approx)', () => {
  const tilt = 5.145;
  const betas = [0.41, 0.94, 1.09, 1.63];
  for (const beta of betas) {
    const d = M.deltaLambdaFromBetaDeg({ tiltDeg: tilt, betaDeg: beta });
    const beta2 = Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: d }));
    assert.ok(Math.abs(beta2 - beta) < 0.03);
  }
});

test('eclipseThresholdsDeg: lunar thresholds are ordered (total < umbral < penumbral)', () => {
  assert.ok(typeof M.eclipseThresholdsDeg === 'function', 'expected eclipseThresholdsDeg export');
  const thr = M.eclipseThresholdsDeg({ earthMoonDistanceKm: 384400 });
  assert.ok(thr.lunarTotalDeg > 0);
  assert.ok(thr.lunarUmbralDeg > thr.lunarTotalDeg);
  assert.ok(thr.lunarPenumbralDeg > thr.lunarUmbralDeg);
  assert.ok(thr.lunarPenumbralDeg < 10);
});

test('lunarEclipseTypeFromBetaDeg classifies penumbral vs umbral vs total', () => {
  assert.ok(typeof M.lunarEclipseTypeFromBetaDeg === 'function', 'expected lunarEclipseTypeFromBetaDeg export');
  const thr = M.eclipseThresholdsDeg({ earthMoonDistanceKm: 384400 });

  assert.equal(M.lunarEclipseTypeFromBetaDeg({ betaDeg: 0, earthMoonDistanceKm: 384400 }).type, 'total-lunar');

  const betaPartial = (thr.lunarTotalDeg + thr.lunarUmbralDeg) / 2;
  assert.equal(M.lunarEclipseTypeFromBetaDeg({ betaDeg: betaPartial, earthMoonDistanceKm: 384400 }).type, 'partial-lunar');

  const betaPenumbral = (thr.lunarUmbralDeg + thr.lunarPenumbralDeg) / 2;
  assert.equal(M.lunarEclipseTypeFromBetaDeg({ betaDeg: betaPenumbral, earthMoonDistanceKm: 384400 }).type, 'penumbral-lunar');

  const betaNone = thr.lunarPenumbralDeg + 1;
  assert.equal(M.lunarEclipseTypeFromBetaDeg({ betaDeg: betaNone, earthMoonDistanceKm: 384400 }).type, 'none');
});

test('solarEclipseTypeFromBetaDeg: beta≈0 distinguishes total vs annular by umbra sign', () => {
  assert.ok(typeof M.solarEclipseTypeFromBetaDeg === 'function', 'expected solarEclipseTypeFromBetaDeg export');

  // Umbra radius at distance x is:
  //   r_umbra(x) = R_moon - x*(R_sun - R_moon)/AU.
  // The umbra tip (r_umbra=0) is at x = R_moon * AU / (R_sun - R_moon).
  const moonRadiusKm = 1737.4;
  const sunRadiusKm = 696000;
  const auKm = 149597870.7;
  const dCrit = (moonRadiusKm * auKm) / (sunRadiusKm - moonRadiusKm);

  const totalish = M.solarEclipseTypeFromBetaDeg({ betaDeg: 0, earthMoonDistanceKm: 0.9 * dCrit });
  const annularish = M.solarEclipseTypeFromBetaDeg({ betaDeg: 0, earthMoonDistanceKm: 1.1 * dCrit });

  assert.equal(totalish.type, 'total-solar');
  assert.equal(annularish.type, 'annular-solar');
});

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

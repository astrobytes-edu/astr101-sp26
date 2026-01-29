const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/keplers-laws-model.js');

function wrapPi(rad) {
  // Wrap to (-pi, pi]
  const twoPi = 2 * Math.PI;
  let x = ((rad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  if (x <= -Math.PI) x += twoPi;
  return x;
}

test('orbitTangentAngleRad: circular orbit gives tangent angle = pi/2 - theta (demo coords)', () => {
  const a = 1;
  const e = 0;
  for (const deg of [0, 30, 90, 135, 180, 270, 359]) {
    const theta = (deg * Math.PI) / 180;
    const tangent = Model.orbitTangentAngleRad({ aAu: a, e, thetaRad: theta });
    const expected = Math.PI / 2 - theta;
    assert.ok(Math.abs(wrapPi(tangent - expected)) < 1e-10);
  }
});

test('orbitTangentAngleRad: matches numeric derivative direction (elliptical case)', () => {
  const aAu = 1;
  const e = 0.5;
  const theta = Math.PI / 4;
  const eps = 1e-6;

  const p1 = Model.positionFromFocusAu({ aAu, e, thetaRad: theta - eps });
  const p2 = Model.positionFromFocusAu({ aAu, e, thetaRad: theta + eps });
  const dx = p2.xAu - p1.xAu;
  const dy = p2.yAu - p1.yAu;

  const numericAngle = Math.atan2(dy, dx);
  const tangentAngle = Model.orbitTangentAngleRad({ aAu, e, thetaRad: theta });
  assert.ok(Math.abs(wrapPi(tangentAngle - numericAngle)) < 1e-6);
});

test('trueToMeanAnomalyRad + meanToTrueAnomalyRad approximately invert (moderate e)', () => {
  const e = 0.6;
  for (const deg of [0, 20, 60, 120, 179, 240, 300]) {
    const theta = (deg * Math.PI) / 180;
    const M = Model.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = Model.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrapPi(theta2 - theta)) < 1e-8);
  }
});

test('formatNewtonReadouts matches 101 vs 201 units', () => {
  assert.ok(typeof Model.formatNewtonReadouts === 'function');

  const r101 = Model.formatNewtonReadouts({ vKms: 1, aMs2: 2, units: '101' });
  assert.equal(r101.vValue, 1);
  assert.equal(r101.vUnit, 'km/s');
  assert.equal(r101.aValue, 2);
  assert.equal(r101.aUnit, 'm/s²');

  const r201 = Model.formatNewtonReadouts({ vKms: 1, aMs2: 2, units: '201' });
  assert.equal(r201.vValue, 1e5);
  assert.equal(r201.vUnit, 'cm/s');
  assert.equal(r201.aValue, 200);
  assert.equal(r201.aUnit, 'cm/s²');
});

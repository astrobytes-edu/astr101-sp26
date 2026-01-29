const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/binary-orbits-model.js');

function wrap2Pi(rad) {
  const twoPi = 2 * Math.PI;
  return ((rad % twoPi) + twoPi) % twoPi;
}

test('BinaryOrbitsModel anomaly conversions invert (mod 2π) for typical e', () => {
  const e = 0.5;
  for (const deg of [0, 30, 90, 179, 240, 300, 359]) {
    const theta = (deg * Math.PI) / 180;
    const M = Model.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = Model.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrap2Pi(theta2) - wrap2Pi(theta)) < 1e-8);
  }
});

test('BinaryOrbitsModel meanToTrueAnomalyRad returns a [0, 2π) angle for normalized inputs', () => {
  const e = 0.5;
  for (const deg of [0, 90, 180, 270, 359]) {
    const M = (deg * Math.PI) / 180;
    const theta = Model.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(theta >= 0 && theta < 2 * Math.PI);
  }
});


const test = require('node:test');
const assert = require('node:assert/strict');

const ParallaxDistanceModel = require('../demos/_assets/parallax-distance-model.js');

function approxEqual(actual, expected, { relTol = 1e-12, absTol = 0 } = {}) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) {
    assert.fail(`Expected finite numbers, got ${actual} vs ${expected}`);
  }
  const diff = Math.abs(actual - expected);
  if (diff <= absTol) return;
  const scale = Math.max(Math.abs(actual), Math.abs(expected), 1);
  assert.ok(diff / scale <= relTol, `|${actual} - ${expected}| / ${scale} = ${diff / scale} > ${relTol}`);
}

test('parallaxFromDistance: p(") = 1 / d(pc)', () => {
  for (const dPc of [1, 1.3, 10, 100, 8000]) {
    const p = ParallaxDistanceModel.parallaxFromDistance(dPc);
    approxEqual(p, 1 / dPc);
  }
});

test('distanceFromParallax: d(pc) = 1 / p(")', () => {
  for (const pArcsec of [1, 0.7685, 0.1, 0.00758, 0.000122]) {
    const d = ParallaxDistanceModel.distanceFromParallax(pArcsec);
    approxEqual(d, 1 / pArcsec);
  }
});

test('earthPosition: January vs July x-sign convention', () => {
  const jan = ParallaxDistanceModel.earthPosition(0);
  const july = ParallaxDistanceModel.earthPosition(0.5);
  approxEqual(jan.x, 1, { relTol: 1e-12 });
  approxEqual(july.x, -1, { relTol: 1e-12 });
});

test('apparentShift: shift is opposite Earth x-position', () => {
  const pArcsec = 0.5;
  const shiftJan = ParallaxDistanceModel.apparentShift(0, pArcsec);
  const shiftJuly = ParallaxDistanceModel.apparentShift(0.5, pArcsec);
  approxEqual(shiftJan, -pArcsec, { relTol: 1e-12 });
  approxEqual(shiftJuly, pArcsec, { relTol: 1e-12 });
});


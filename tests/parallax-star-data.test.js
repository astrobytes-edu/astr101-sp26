const test = require('node:test');
const assert = require('node:assert/strict');

const StarData = require('../demos/parallax-distance/star-data.js');

test('STAR_DATA exports expected shape in Node', () => {
  assert.ok(StarData);
  assert.equal(typeof StarData, 'object');
  assert.ok(Array.isArray(StarData.STARS));
  assert.ok(StarData.STARS.length > 0);
  assert.equal(typeof StarData.getMeasurability, 'function');
});

test('star catalog entries are self-consistent: d_pc ≈ 1/p when p is present', () => {
  for (const star of StarData.STARS) {
    if (!Number.isFinite(star.p) || !Number.isFinite(star.d_pc)) continue;
    const dp = star.d_pc * star.p;
    assert.ok(Math.abs(dp - 1) < 5e-3, `${star.name}: d*p=${dp} (expected ~1)`);
  }
});

test('getMeasurability returns stable classes at representative thresholds', () => {
  assert.equal(StarData.getMeasurability(0.02, 'gaia').measurable, true);
  assert.equal(StarData.getMeasurability(0.0002, 'gaia').measurable, true);
  assert.equal(StarData.getMeasurability(0.0000005, 'gaia').measurable, false);

  assert.equal(StarData.getMeasurability(0.02, 'hipparcos').measurable, true);
  assert.equal(StarData.getMeasurability(0.0005, 'hipparcos').measurable, false);
});


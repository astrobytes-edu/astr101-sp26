const test = require('node:test');
const assert = require('node:assert/strict');

// Note: astro-utils.js checks for AstroConstants at runtime
// We need to load constants first so it's available globally
global.AstroConstants = require('../demos/_assets/physics/astro-constants.js');
const AstroUtils = require('../demos/_assets/astro-utils.js');

test('formatDistance uses AstroConstants.LENGTH.KM_PER_AU', () => {
  // 1 AU should format as "1.00 AU"
  const result = AstroUtils.formatDistance(149597870.7);
  assert.equal(result.unit, 'AU');
  assert.ok(result.value.includes('1'));
});

test('formatDistance uses AstroConstants.LENGTH.KM_PER_LY', () => {
  // 1 light-year should format as "1.00 ly"
  const result = AstroUtils.formatDistance(9.4607304725808e12);
  assert.equal(result.unit, 'ly');
  assert.ok(result.value.includes('1'));
});

test('formatDistance uses AstroConstants.LENGTH.KM_PER_PC', () => {
  // 1 parsec should format as "1.00 pc"
  const result = AstroUtils.formatDistance(3.0856775814914e13);
  assert.equal(result.unit, 'pc');
  assert.ok(result.value.includes('1'));
});

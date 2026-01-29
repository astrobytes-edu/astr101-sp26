const test = require('node:test');
const assert = require('node:assert/strict');

const TelescopeResolutionModel = require('../demos/_assets/telescope-resolution-model.js');

test('CONSTANTS.RAD_TO_ARCSEC is 206265 (within 0.01%)', () => {
  const expected = 206265;
  const actual = TelescopeResolutionModel.CONSTANTS.RAD_TO_ARCSEC;
  const error = Math.abs(actual - expected) / expected;
  assert.ok(error < 0.0001, `expected ~${expected}, got ${actual}`);
});

test('CONSTANTS.DIFF_COEFF is 1.22 * RAD_TO_ARCSEC (within 0.01%)', () => {
  const expected = 1.22 * 206264.806;
  const actual = TelescopeResolutionModel.CONSTANTS.DIFF_COEFF;
  const error = Math.abs(actual - expected) / expected;
  assert.ok(error < 0.0001, `expected ~${expected}, got ${actual}`);
});

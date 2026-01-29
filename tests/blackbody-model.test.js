const test = require('node:test');
const assert = require('node:assert/strict');

const BlackbodyModel = require('../demos/_assets/blackbody-model.js');

test('wienPeakCm: Sun (5772 K) peaks at ~502 nm = 5.02e-5 cm', () => {
  const peakCm = BlackbodyModel.wienPeakCm(5772);
  // b/T = 0.2898 / 5772 = 5.02e-5 cm = 502 nm
  assert.ok(Math.abs(peakCm - 5.02e-5) < 1e-7, `expected ~5.02e-5, got ${peakCm}`);
});

test('wienPeakNm: Sun (5772 K) peaks at ~502 nm', () => {
  const peakNm = BlackbodyModel.wienPeakNm(5772);
  // Allow 1 nm tolerance
  assert.ok(Math.abs(peakNm - 502) < 1, `expected ~502 nm, got ${peakNm}`);
});

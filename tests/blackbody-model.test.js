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

test('planckFunction: returns positive value at Wien peak', () => {
  const T = 5772;
  const lambda = BlackbodyModel.wienPeakCm(T);
  const B = BlackbodyModel.planckFunction(lambda, T);
  assert.ok(B > 0, `expected B > 0, got ${B}`);
});

test('planckFunction: intensity increases with temperature at fixed wavelength', () => {
  const lambda = 5e-5; // 500 nm
  const B_cool = BlackbodyModel.planckFunction(lambda, 4000);
  const B_hot = BlackbodyModel.planckFunction(lambda, 6000);
  assert.ok(B_hot > B_cool, `expected B(6000K) > B(4000K)`);
});

test('planckFunction: handles extreme temperature gracefully (no overflow)', () => {
  // Very cold: CMB at 2.725 K
  const B_cmb = BlackbodyModel.planckFunction(1e-1, 2.725); // 1 mm
  assert.ok(Number.isFinite(B_cmb), `expected finite value for CMB, got ${B_cmb}`);

  // Very hot: 1 million K neutron star
  const B_hot = BlackbodyModel.planckFunction(1e-7, 1e6); // 1 nm
  assert.ok(Number.isFinite(B_hot), `expected finite value for hot star, got ${B_hot}`);
});

test('stefanBoltzmannFlux: Sun flux matches L☉/(4πR☉²)', () => {
  const flux = BlackbodyModel.stefanBoltzmannFlux(5772);
  // σT⁴ should equal L/(4πR²) for Sun
  // L☉ = 3.828e33 erg/s, R☉ = 6.957e10 cm
  // F = L/(4πR²) = 3.828e33 / (4π × (6.957e10)²) ≈ 6.29e10 erg/s/cm²
  const expected = 3.828e33 / (4 * Math.PI * Math.pow(6.957e10, 2));
  const relError = Math.abs(flux - expected) / expected;
  assert.ok(relError < 0.01, `expected ~${expected.toExponential(2)}, got ${flux.toExponential(2)}, error ${(relError*100).toFixed(1)}%`);
});

test('luminosityRatio: Sun at 5772 K has L/L☉ = 1', () => {
  const ratio = BlackbodyModel.luminosityRatio(5772);
  // (T/T☉)⁴ = 1 when T = T☉
  assert.ok(Math.abs(ratio - 1) < 0.001, `expected ~1, got ${ratio}`);
});

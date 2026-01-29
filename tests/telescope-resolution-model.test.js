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

// diffractionLimitArcsec tests
test('diffractionLimitArcsec: HST (D=2.4m, lambda=550nm) gives ~0.058 arcsec', () => {
  const D_cm = 2.4 * 100;          // 2.4 m in cm
  const lambda_cm = 5.5e-5;         // 550 nm in cm
  const result = TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, D_cm);
  // NASA quotes HST resolution as ~0.05" at 500nm
  assert.ok(result > 0.05 && result < 0.07, `expected ~0.058, got ${result}`);
});

test('diffractionLimitArcsec: human eye (D=7mm, lambda=550nm) gives ~20 arcsec', () => {
  const D_cm = 0.7;                 // 7 mm in cm
  const lambda_cm = 5.5e-5;         // 550 nm in cm
  const result = TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, D_cm);
  // Human eye diffraction limit ~20" (practical limit is worse due to aberrations)
  assert.ok(result > 15 && result < 25, `expected ~20, got ${result}`);
});

test('diffractionLimitArcsec: Keck (D=10m, lambda=550nm) gives ~0.014 arcsec', () => {
  const D_cm = 10 * 100;            // 10 m in cm
  const lambda_cm = 5.5e-5;         // 550 nm in cm
  const result = TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, D_cm);
  assert.ok(result > 0.01 && result < 0.02, `expected ~0.014, got ${result}`);
});

test('diffractionLimitArcsec: returns NaN for invalid lambda', () => {
  const D_cm = 240;
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(0, D_cm)), 'lambda=0 should return NaN');
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(-1, D_cm)), 'lambda<0 should return NaN');
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(NaN, D_cm)), 'lambda=NaN should return NaN');
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(Infinity, D_cm)), 'lambda=Infinity should return NaN');
});

test('diffractionLimitArcsec: returns NaN for invalid D', () => {
  const lambda_cm = 5.5e-5;
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, 0)), 'D=0 should return NaN');
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, -1)), 'D<0 should return NaN');
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, NaN)), 'D=NaN should return NaN');
  assert.ok(Number.isNaN(TelescopeResolutionModel.diffractionLimitArcsec(lambda_cm, Infinity)), 'D=Infinity should return NaN');
});

// effectiveResolution tests
test('effectiveResolution: space telescope (seeing=0) returns diffraction limit', () => {
  const theta_diff = 0.05;
  const result = TelescopeResolutionModel.effectiveResolution(theta_diff, 0, false);
  assert.strictEqual(result, theta_diff);
});

test('effectiveResolution: ground without AO is seeing-limited', () => {
  const theta_diff = 0.05;
  const seeing = 1.0;
  const result = TelescopeResolutionModel.effectiveResolution(theta_diff, seeing, false);
  assert.strictEqual(result, seeing);
});

test('effectiveResolution: ground with AO improves on seeing', () => {
  const theta_diff = 0.05;
  const seeing = 1.0;
  const withoutAO = TelescopeResolutionModel.effectiveResolution(theta_diff, seeing, false);
  const withAO = TelescopeResolutionModel.effectiveResolution(theta_diff, seeing, true);
  assert.ok(withAO < withoutAO, `AO should improve: ${withAO} < ${withoutAO}`);
});

// resolutionStatus tests
test('resolutionStatus: well-separated binary is resolved', () => {
  const result = TelescopeResolutionModel.resolutionStatus(1.0, 0.5);
  assert.strictEqual(result, 'resolved');
});

test('resolutionStatus: equal separation/resolution is marginal', () => {
  const result = TelescopeResolutionModel.resolutionStatus(0.5, 0.5);
  assert.strictEqual(result, 'marginal');
});

test('resolutionStatus: close binary is unresolved', () => {
  const result = TelescopeResolutionModel.resolutionStatus(0.1, 0.5);
  assert.strictEqual(result, 'unresolved');
});

// besselJ1 tests
test('besselJ1: J1(0) = 0', () => {
  const result = TelescopeResolutionModel.besselJ1(0);
  assert.ok(Math.abs(result) < 1e-10, `expected 0, got ${result}`);
});

test('besselJ1: J1(3.83) ≈ 0 (first zero)', () => {
  const result = TelescopeResolutionModel.besselJ1(3.8317);
  assert.ok(Math.abs(result) < 0.01, `expected ~0, got ${result}`);
});

test('besselJ1: J1(1.84) ≈ 0.58 (maximum)', () => {
  const result = TelescopeResolutionModel.besselJ1(1.8412);
  assert.ok(Math.abs(result - 0.5819) < 0.01, `expected ~0.58, got ${result}`);
});

// airyIntensity tests
test('airyIntensity: I(0) = 1 (central maximum)', () => {
  const result = TelescopeResolutionModel.airyIntensity(0);
  assert.ok(Math.abs(result - 1.0) < 1e-10, `expected 1, got ${result}`);
});

test('airyIntensity: I(3.83) ≈ 0 (first null)', () => {
  const result = TelescopeResolutionModel.airyIntensity(3.8317);
  assert.ok(result < 0.001, `expected ~0, got ${result}`);
});

test('airyIntensity: always returns value between 0 and 1', () => {
  for (const x of [0, 0.5, 1, 2, 3, 5, 10, 20]) {
    const result = TelescopeResolutionModel.airyIntensity(x);
    assert.ok(result >= 0 && result <= 1, `I(${x}) = ${result} not in [0,1]`);
  }
});

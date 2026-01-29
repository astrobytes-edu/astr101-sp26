const test = require('node:test');
const assert = require('node:assert/strict');

const EMSpectrumModel = require('../demos/_assets/em-spectrum-model.js');

function approxEqual(actual, expected, { relTol = 1e-12, absTol = 0 } = {}) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) {
    assert.fail(`Expected finite numbers, got ${actual} vs ${expected}`);
  }
  const diff = Math.abs(actual - expected);
  if (diff <= absTol) return;
  const scale = Math.max(Math.abs(actual), Math.abs(expected), 1);
  assert.ok(diff / scale <= relTol, `|${actual} - ${expected}| / ${scale} = ${diff / scale} > ${relTol}`);
}

test('wave equation: c ≈ λν (CGS with Hz)', () => {
  const { c } = EMSpectrumModel.CONSTANTS;
  for (const lambdaCm of [5e-5, 1e-1, 1, 1e3]) {
    const nuHz = EMSpectrumModel.wavelengthToFrequency(lambdaCm);
    approxEqual(lambdaCm * nuHz, c, { relTol: 1e-12 });
  }
});

test('photon energy: E = hc/λ', () => {
  const { c, h } = EMSpectrumModel.CONSTANTS;
  for (const lambdaCm of [5e-5, 1e-1, 1, 1e-7]) {
    const Eerg = EMSpectrumModel.wavelengthToEnergy(lambdaCm);
    approxEqual(Eerg, (h * c) / lambdaCm, { relTol: 1e-12 });
  }
});

test('unit conversions are (approximately) invertible', () => {
  const lambda = 3.2e-5; // cm
  for (const unit of ['km', 'm', 'mm', 'um', 'nm', 'pm', 'fm']) {
    const value = EMSpectrumModel.cmToWavelength(lambda, unit);
    const back = EMSpectrumModel.wavelengthToCm(value, unit);
    approxEqual(back, lambda, { relTol: 1e-12 });
  }

  const nu = 6.0e14; // Hz
  for (const unit of ['Hz', 'kHz', 'MHz', 'GHz', 'THz', 'PHz', 'EHz']) {
    const value = EMSpectrumModel.hzToFrequency(nu, unit);
    const back = EMSpectrumModel.frequencyToHz(value, unit);
    approxEqual(back, nu, { relTol: 1e-12 });
  }

  const Eerg = 3.97e-12;
  for (const unit of ['erg', 'J', 'eV', 'keV', 'MeV']) {
    const value = EMSpectrumModel.ergToEnergy(Eerg, unit);
    const back = EMSpectrumModel.energyToErg(value, unit);
    approxEqual(back, Eerg, { relTol: 1e-9 });
  }
});

test('spectrum bar mapping round-trips (in-range)', () => {
  for (const lambdaCm of [1e-12, 1e-9, 1e-5, 1e-1, 1, 1e3, 1e6]) {
    const pos = EMSpectrumModel.wavelengthToPosition(lambdaCm);
    const back = EMSpectrumModel.positionToWavelength(pos);
    approxEqual(back, lambdaCm, { relTol: 1e-10 });
  }
});

test('spectrum bar mapping clamps to the visible bar range', () => {
  const posLong = EMSpectrumModel.wavelengthToPosition(1e9);
  const posShort = EMSpectrumModel.wavelengthToPosition(1e-20);
  assert.ok(posLong >= 0 && posLong <= 100);
  assert.ok(posShort >= 0 && posShort <= 100);

  // Out-of-range position inputs should clamp to the bar endpoints too.
  approxEqual(EMSpectrumModel.positionToWavelength(-10), EMSpectrumModel.positionToWavelength(0), {
    relTol: 1e-12,
  });
  approxEqual(EMSpectrumModel.positionToWavelength(1000), EMSpectrumModel.positionToWavelength(100), {
    relTol: 1e-12,
  });
});

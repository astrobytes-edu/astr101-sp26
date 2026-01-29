const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const Binary = require('../demos/_assets/binary-orbits-model.js');

test('vis-viva speed clamps negative v^2 to 0 (TwoBodyAnalytic)', () => {
  const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(1);
  // Choose r > 2a so (2/r - 1/a) < 0.
  const v = TwoBody.visVivaSpeedAuPerYr({ rAu: 3, aAu: 1, muAu3Yr2 });
  assert.equal(v, 0);
});

test('orbitalVelocityKms clamps negative v^2 to 0 (BinaryOrbitsModel)', () => {
  const v = Binary.orbitalVelocityKms({ rAu: 3, aAu: 1, M1: 1, M2: 0 });
  assert.equal(v, 0);
});


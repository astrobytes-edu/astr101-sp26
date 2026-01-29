const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/conservation-laws-model.js');

test('velocityFromSpeedAndDirectionAuYr: 0° is tangential (+y), +90° is radial (+x)', () => {
  const v = 2;
  const t = Model.velocityFromSpeedAndDirectionAuYr({ speedAuYr: v, directionDeg: 0 });
  assert.ok(Math.abs(t.vxAuYr) < 1e-12);
  assert.ok(Math.abs(t.vyAuYr - v) < 1e-12);

  const r = Model.velocityFromSpeedAndDirectionAuYr({ speedAuYr: v, directionDeg: 90 });
  assert.ok(Math.abs(r.vxAuYr - v) < 1e-12);
  assert.ok(Math.abs(r.vyAuYr) < 1e-12);
});

test('sampleConicOrbitAu: circle (e=0) stays at constant radius', () => {
  const ecc = 0;
  const pAu = 2; // for e=0, r = p everywhere
  const omega = 0;
  const pts = Model.sampleConicOrbitAu({ ecc, pAu, omegaRad: omega, numPoints: 25 });
  assert.ok(pts.length >= 10);
  for (const pt of pts) {
    const r = Math.sqrt(pt.xAu * pt.xAu + pt.yAu * pt.yAu);
    assert.ok(Math.abs(r - pAu) < 1e-10);
  }
});

test('conicTrueAnomalyDomainRad: hyperbolic domain is finite and symmetric', () => {
  const { nuMin, nuMax } = Model.conicTrueAnomalyDomainRad({ ecc: 2 });
  assert.ok(nuMax > 0);
  assert.ok(Math.abs(nuMin + nuMax) < 1e-12);
  assert.ok(nuMax < Math.PI);
});


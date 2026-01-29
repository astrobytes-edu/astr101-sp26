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

function maxRadiusAu(points) {
  let maxR = 0;
  for (const p of points) {
    const r = Math.hypot(p.xAu, p.yAu);
    if (Number.isFinite(r) && r > maxR) maxR = r;
  }
  return maxR;
}

test('sampleConicOrbitAu: parabolic orbit can be clipped by rMaxAu', () => {
  const rMaxAu = 10;
  const pts = Model.sampleConicOrbitAu({ ecc: 1, pAu: 2, omegaRad: 0, numPoints: 720, rMaxAu });
  assert.ok(pts.length >= 10);
  assert.ok(maxRadiusAu(pts) <= rMaxAu * (1 + 1e-9));
});

test('sampleConicOrbitAu: hyperbolic orbit can be clipped by rMaxAu', () => {
  const rMaxAu = 10;
  const pts = Model.sampleConicOrbitAu({ ecc: 2.24, pAu: 3.24, omegaRad: 0, numPoints: 720, rMaxAu });
  assert.ok(pts.length >= 10);
  assert.ok(maxRadiusAu(pts) <= rMaxAu * (1 + 1e-9));
});

test('conicTrueAnomalyDomainRadForPlot: rMaxAu limits open-orbit domain', () => {
  const ecc = 1;
  const pAu = 2;
  const rMaxAu = 10;
  assert.equal(typeof Model.conicTrueAnomalyDomainRadForPlot, 'function');

  const { nuMin, nuMax } = Model.conicTrueAnomalyDomainRadForPlot({ ecc, pAu, rMaxAu });
  assert.ok(nuMax > 0);
  assert.ok(Math.abs(nuMin + nuMax) < 1e-12);
  assert.ok(nuMax < Math.PI);

  const rAtEdge = pAu / (1 + ecc * Math.cos(nuMax));
  assert.ok(rAtEdge <= rMaxAu * (1 + 1e-9));
});

test('advanceTrueAnomalyRad: open orbits stop at plot boundary', () => {
  assert.equal(typeof Model.advanceTrueAnomalyRad, 'function');

  const res = Model.advanceTrueAnomalyRad({
    nuRad: 1.9,
    ecc: 1,
    nuMin: -2,
    nuMax: 2,
    dir: 1,
    dtSec: 1,
    nuSpeedRadPerSec: 0.2,
  });
  assert.equal(res.nuRad, 2);
  assert.equal(res.stopped, true);
  assert.equal(res.dir, 1);
});

test('advanceTrueAnomalyRad: elliptical orbits wrap 2π', () => {
  const res = Model.advanceTrueAnomalyRad({
    nuRad: 6.2,
    ecc: 0.5,
    nuMin: 0,
    nuMax: 2 * Math.PI,
    dir: 1,
    dtSec: 1,
    nuSpeedRadPerSec: 0.2,
  });
  assert.ok(res.nuRad >= 0 && res.nuRad < 2 * Math.PI);
  assert.equal(res.stopped, false);
});

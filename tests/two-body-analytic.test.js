const test = require('node:test');
const assert = require('node:assert/strict');

const AstroConstants = require('../demos/_assets/physics/astro-constants.js');
const Units = require('../demos/_assets/physics/units.js');
const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');

function wrapPi(rad) {
  const twoPi = 2 * Math.PI;
  let x = ((rad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  if (x <= -Math.PI) x += twoPi;
  return x;
}

test('orbitalRadius(): returns expected perihelion/aphelion values', () => {
  const a = 2;
  const e = 0.25;
  assert.ok(Math.abs(TwoBody.orbitalRadius({ a, e, thetaRad: 0 }) - a * (1 - e)) < 1e-12);
  assert.ok(Math.abs(TwoBody.orbitalRadius({ a, e, thetaRad: Math.PI }) - a * (1 + e)) < 1e-12);
});

test('anomaly conversions invert (moderate e)', () => {
  const e = 0.6;
  for (const deg of [0, 20, 60, 120, 179, 240, 300]) {
    const theta = (deg * Math.PI) / 180;
    const M = TwoBody.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrapPi(theta2 - theta)) < 1e-8);
  }
});

test('Kepler solver converges for high e (regression)', () => {
  const e = 0.999;
  for (const deg of [0, 20, 60, 120, 179, 240, 300]) {
    const theta = (deg * Math.PI) / 180;
    const M = TwoBody.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrapPi(theta2 - theta)) < 1e-8);
  }
});

test('TwoBodyAnalytic exports trueToEccentricAnomalyRad', () => {
  assert.equal(typeof TwoBody.trueToEccentricAnomalyRad, 'function');
});

test('trueToEccentricAnomalyRad is consistent with trueToMeanAnomalyRad', () => {
  const e = 0.6;
  const thetaRad = 1.0;
  const E = TwoBody.trueToEccentricAnomalyRad({ thetaRad, e });
  const M1 = TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
  const M2 = E - e * Math.sin(E);
  assert.ok(Math.abs(M1 - M2) < 1e-12);
});

test('teaching-unit wrapper: P_yr = sqrt(a^3/M) (Kepler normalization)', () => {
  assert.ok(Math.abs(TwoBody.orbitalPeriodYrFromAuSolar({ aAu: 1, massSolar: 1 }) - 1) < 1e-12);
  assert.ok(Math.abs(TwoBody.orbitalPeriodYrFromAuSolar({ aAu: 8, massSolar: 1 }) - Math.pow(8, 1.5)) < 1e-12);
  assert.ok(Math.abs(TwoBody.orbitalPeriodYrFromAuSolar({ aAu: 1, massSolar: 4 }) - 0.5) < 1e-12);
});

test('teaching-unit wrapper: circular orbit speed at 1 AU, 1 yr is 2π AU/yr', () => {
  const vAuYr = TwoBody.visVivaSpeedAuPerYrFromAuSolar({ rAu: 1, aAu: 1, massSolar: 1 });
  assert.ok(Math.abs(vAuYr - 2 * Math.PI) < 1e-12);
});

test('mu conversion: mu_solar in AU^3/yr^2 converts to cm^3/s^2', () => {
  const muAu3Yr2 = AstroConstants.GRAV.G_AU3_YR2_PER_SOLAR_MASS * 1; // 1 M_sun
  const muCgs = TwoBody.muCgsFromMuAu3Yr2(muAu3Yr2);
  const expected = Units.au3PerYr2ToCm3PerS2(muAu3Yr2);
  assert.ok(Math.abs(muCgs - expected) / expected < 1e-15);
});

test('specific energy matches -mu/(2a) for ellipse (AU/yr units)', () => {
  const aAu = 2;
  const e = 0.3;
  const massSolar = 1;
  const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(massSolar);
  const thetaRad = 1.0;

  const rAu = TwoBody.orbitalRadius({ a: aAu, e, thetaRad });
  const vRelAuYr = TwoBody.visVivaSpeedAuPerYr({ rAu, aAu, muAu3Yr2 });

  const eps = TwoBody.specificEnergyAu2Yr2({ rAu, vRelAuYr, muAu3Yr2 });
  const expected = -muAu3Yr2 / (2 * aAu);
  assert.ok(Math.abs(eps - expected) < 1e-10);
});

test('specific angular momentum matches sqrt(mu a (1-e^2)) (AU/yr units)', () => {
  const aAu = 2;
  const e = 0.3;
  const massSolar = 1;
  const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(massSolar);

  const h = TwoBody.specificAngularMomentumAu2YrFromOrbit({ aAu, e, muAu3Yr2 });
  const expected = Math.sqrt(muAu3Yr2 * aAu * (1 - e * e));
  assert.ok(Math.abs(h - expected) < 1e-12);
});

test('orbitElementsFromStateAuYr: circular and escape-speed cases classify correctly', () => {
  const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(1);
  const r0Au = 1;

  const vCirc = TwoBody.circularSpeedAuPerYr({ muAu3Yr2, rAu: r0Au });
  const circ = TwoBody.orbitElementsFromStateAuYr({
    rVecAu: { xAu: r0Au, yAu: 0 },
    vVecAuYr: { vxAuYr: 0, vyAuYr: vCirc },
    muAu3Yr2,
  });
  assert.ok(circ.ecc < 1e-12);
  assert.equal(circ.orbitType, 'circular');
  assert.ok(circ.epsAu2Yr2 < 0);

  const vEsc = TwoBody.escapeSpeedAuPerYr({ muAu3Yr2, rAu: r0Au });
  const esc = TwoBody.orbitElementsFromStateAuYr({
    rVecAu: { xAu: r0Au, yAu: 0 },
    vVecAuYr: { vxAuYr: 0, vyAuYr: vEsc },
    muAu3Yr2,
  });
  assert.ok(Math.abs(esc.ecc - 1) < 1e-10);
  assert.equal(esc.orbitType, 'parabolic');
  assert.ok(Math.abs(esc.epsAu2Yr2) < 1e-10);
});

test('orbitElementsFromStateAuYr: hyperbolic case has ecc > 1 and eps > 0', () => {
  const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(1);
  const r0Au = 1;
  const vEsc = TwoBody.escapeSpeedAuPerYr({ muAu3Yr2, rAu: r0Au });

  const hyp = TwoBody.orbitElementsFromStateAuYr({
    rVecAu: { xAu: r0Au, yAu: 0 },
    vVecAuYr: { vxAuYr: 0, vyAuYr: 1.5 * vEsc },
    muAu3Yr2,
  });

  assert.ok(hyp.ecc > 1);
  assert.equal(hyp.orbitType, 'hyperbolic');
  assert.ok(hyp.epsAu2Yr2 > 0);
});

const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/planetary-climate-model.js');

function assertNear(actual, expected, tol, label) {
  assert.ok(Number.isFinite(actual), `${label}: expected finite, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: expected ${expected} ± ${tol}, got ${actual}`);
}

test('stellarFluxWm2 scales as 1/d^2', () => {
  const L = Model.CONST.L_SUN_W;
  const d1 = Model.CONST.AU_M;
  const d2 = 2 * Model.CONST.AU_M;

  const f1 = Model.stellarFluxWm2({ LStarW: L, dM: d1 });
  const f2 = Model.stellarFluxWm2({ LStarW: L, dM: d2 });

  // Doubling distance quarters the flux.
  assertNear(f1 / f2, 4, 1e-12, 'flux ratio');
});

test('absorbedFluxWm2 uses redistribution: global=÷4, dayside=÷2', () => {
  const fluxWm2 = 1000;
  const albedo = 0.3;
  const global = Model.absorbedFluxWm2({ fluxWm2, albedo, redistribution: 'global' });
  const dayside = Model.absorbedFluxWm2({ fluxWm2, albedo, redistribution: 'dayside' });

  assertNear(global, (1 - albedo) * fluxWm2 / 4, 1e-12, 'global absorbed');
  assertNear(dayside, (1 - albedo) * fluxWm2 / 2, 1e-12, 'dayside absorbed');
});

test('equilibriumTempK matches Earth baseline (~255 K) with L=Lsun, d=1 AU, A=0.30', () => {
  const T = Model.equilibriumTempK({ LStarW: Model.CONST.L_SUN_W, dM: Model.CONST.AU_M, albedo: 0.30 });
  assertNear(T, 255, 1, 'Teq Earth');
});

test('redistribution sanity: Teq_dayside / Teq_global ≈ 2^(1/4)', () => {
  const inputs = { LStarW: Model.CONST.L_SUN_W, dM: Model.CONST.AU_M, albedo: 0.3 };
  const global = Model.equilibriumTempK({ ...inputs, redistribution: 'global' });
  const dayside = Model.equilibriumTempK({ ...inputs, redistribution: 'dayside' });
  const expectedRatio = Math.pow(2, 1 / 4);
  assertNear(dayside / global, expectedRatio, 1e-4, 'Teq ratio');
});

test('epsilonOutFromTauIR equals exp(-tauIR)', () => {
  assertNear(Model.epsilonOutFromTauIR({ tauIR: 0 }), 1, 1e-12, 'tau=0');
  assertNear(Model.epsilonOutFromTauIR({ tauIR: 1 }), Math.exp(-1), 1e-12, 'tau=1');
});

test('surfaceTempK equals TeqK * exp(tauIR/4)', () => {
  const TeqK = 255;
  const tauIR = 0.49;
  const Tsurf = Model.surfaceTempK({ TeqK, tauIR });
  assertNear(Tsurf, TeqK * Math.exp(tauIR / 4), 1e-10, 'Tsurf');
});

test('tauIRFromTemps equals 4*ln(Tsurf/Teq)', () => {
  const TeqK = 255;
  const TsurfK = 288;
  const tauIR = Model.tauIRFromTemps({ TeqK, TsurfK });
  assertNear(tauIR, 4 * Math.log(TsurfK / TeqK), 1e-12, 'tauIR');
});

test('spectralOpacityFromTauIR is monotonic increasing', () => {
  const taus = [0, 0.1, 0.5, 1, 2, 4, 8];
  let prev = -Infinity;
  for (const t of taus) {
    const o = Model.spectralOpacityFromTauIR({ tauIR: t });
    assert.ok(Number.isFinite(o), `opacity must be finite for tau=${t}`);
    assert.ok(o >= prev - 1e-12, `opacity must not decrease: tau=${t}, opacity=${o}, prev=${prev}`);
    prev = o;
  }
});

test('Solar System preset regressions: Venus/Earth/Mars (Teq, Tsurf, tauIR)', () => {
  const cases = [
    { id: 'Venus', dAU: 0.72, A: 0.76, TeqK: 230, TsurfK: 735, tauIR: 4.65 },
    { id: 'Earth', dAU: 1.0, A: 0.30, TeqK: 255, TsurfK: 288, tauIR: 0.49 },
    { id: 'Mars', dAU: 1.52, A: 0.25, TeqK: 210, TsurfK: 218, tauIR: 0.15 },
  ];

  for (const c of cases) {
    const Teq = Model.equilibriumTempK({
      LStarW: Model.CONST.L_SUN_W,
      dM: c.dAU * Model.CONST.AU_M,
      albedo: c.A,
      redistribution: 'global',
    });
    assertNear(Teq, c.TeqK, 1, `${c.id} Teq`);

    const Tsurf = Model.surfaceTempK({ TeqK: Teq, tauIR: c.tauIR });
    assertNear(Tsurf, c.TsurfK, 1, `${c.id} Tsurf`);

    const tau = Model.tauIRFromTemps({ TeqK: Teq, TsurfK: c.TsurfK });
    assertNear(tau, c.tauIR, 0.02, `${c.id} tau`);
  }
});

/**
 * Conservation Laws: Orbit Shapes
 *
 * UI/controller code only. Physics + sampling is delegated to:
 * - TwoBodyAnalytic (shared physics)
 * - ConservationLawsModel (plot sampling helpers)
 */

(function () {
  'use strict';

  const TwoBody = typeof window !== 'undefined' ? window.TwoBodyAnalytic : null;
  const Model = typeof window !== 'undefined' ? window.ConservationLawsModel : null;
  const AstroConstants = typeof window !== 'undefined' ? window.AstroConstants : null;

  if (!TwoBody || !Model || !AstroConstants) {
    console.error(
      'Conservation Laws demo: missing required modules (TwoBodyAnalytic, ConservationLawsModel, AstroConstants).'
    );
    return;
  }

  const CENTER = { x: 300, y: 300 };
  const VIEW_RADIUS_PX = 250;
  const PATH_SAMPLES = 720;

  // Teaching time scale: simulation time in years per real second.
  // Calibrated so that a circular orbit at 1 AU around 1 M☉ completes in ~6.3 s.
  const SIM_YEARS_PER_SEC = 1 / (2 * Math.PI);

  const state = {
    massSolar: 1,
    r0Au: 1,
    speedFactor: 1,
    directionDeg: 0,

    playing: false,
    animationId: null,
  };

  const anim = {
    nuRad: 0,
    startNuRad: 0,
    nuMin: 0,
    nuMax: 0,
    dir: 1,

    ecc: NaN,
    pAu: NaN,
    omegaRad: NaN,
    orbitType: 'invalid',
    hAbsAu2Yr: NaN,
    muAu3Yr2: NaN,

    scalePxPerAu: 1,
    vLenPx: 60,
    lastTimeMs: 0,
  };

  let elements = {};

  function initElements() {
    elements = {
      orbitPath: document.getElementById('orbit-path'),
      particle: document.getElementById('particle'),
      velocityLine: document.getElementById('velocity-line'),

      btnPlay: document.getElementById('btn-play'),
      btnPause: document.getElementById('btn-pause'),
      btnReset: document.getElementById('btn-reset'),

      massSlider: document.getElementById('mass-slider'),
      massDisplay: document.getElementById('mass-display'),
      r0Slider: document.getElementById('r0-slider'),
      r0Display: document.getElementById('r0-display'),
      speedSlider: document.getElementById('speed-slider'),
      speedDisplay: document.getElementById('speed-display'),
      directionSlider: document.getElementById('direction-slider'),
      directionDisplay: document.getElementById('direction-display'),

      orbitType: document.getElementById('orbit-type'),
      eccValue: document.getElementById('ecc-value'),
      epsValue: document.getElementById('eps-value'),
      hValue: document.getElementById('h-value'),
      vValue: document.getElementById('v-value'),
      rpValue: document.getElementById('rp-value'),
      aValue: document.getElementById('a-value'),

      presetButtons: document.querySelectorAll('.preset-btn'),

      statusAnnounce: document.getElementById('status-announce'),
    };
  }

  function logSliderToValue(sliderValue) {
    return Math.pow(10, parseFloat(sliderValue));
  }

  function valueToLogSlider(value) {
    return Math.log10(value);
  }

  function formatOrbitType(type) {
    switch (type) {
      case 'circular':
        return 'circular';
      case 'elliptical':
        return 'elliptical';
      case 'parabolic':
        return 'parabolic (escape)';
      case 'hyperbolic':
        return 'hyperbolic';
      default:
        return 'invalid';
    }
  }

  function toSvg({ xAu, yAu }, scalePxPerAu) {
    return {
      x: CENTER.x + xAu * scalePxPerAu,
      y: CENTER.y - yAu * scalePxPerAu,
    };
  }

  function wrap2Pi(rad) {
    const twoPi = 2 * Math.PI;
    return ((rad % twoPi) + twoPi) % twoPi;
  }

  function conicPositionAndTangentAu({ ecc, pAu, omegaRad, nuRad }) {
    if (!Number.isFinite(ecc) || ecc < 0) return null;
    if (!Number.isFinite(pAu) || !(pAu > 0)) return null;
    if (!Number.isFinite(omegaRad)) return null;
    if (!Number.isFinite(nuRad)) return null;

    const cosNu = Math.cos(nuRad);
    const sinNu = Math.sin(nuRad);
    const denom = 1 + ecc * cosNu;
    if (!(denom > 0)) return null;

    const r = pAu / denom;
    const drdNu = (pAu * ecc * sinNu) / (denom * denom);

    const xOrb = r * cosNu;
    const yOrb = r * sinNu;
    const dxOrb = drdNu * cosNu - r * sinNu;
    const dyOrb = drdNu * sinNu + r * cosNu;

    const cosO = Math.cos(omegaRad);
    const sinO = Math.sin(omegaRad);

    const xAu = xOrb * cosO - yOrb * sinO;
    const yAu = xOrb * sinO + yOrb * cosO;
    const dxAu = dxOrb * cosO - dyOrb * sinO;
    const dyAu = dxOrb * sinO + dyOrb * cosO;

    return { xAu, yAu, dxAu, dyAu };
  }

  function orbitalRadiusAu({ xAu, yAu, ecc, pAu, nuRad }) {
    if (Number.isFinite(xAu) && Number.isFinite(yAu)) {
      const r = Math.hypot(xAu, yAu);
      if (Number.isFinite(r) && r > 0) return r;
    }
    if (!Number.isFinite(ecc) || ecc < 0) return NaN;
    if (!Number.isFinite(pAu) || !(pAu > 0)) return NaN;
    if (!Number.isFinite(nuRad)) return NaN;
    const denom = 1 + ecc * Math.cos(nuRad);
    return denom > 0 ? pAu / denom : NaN;
  }

  function instantaneousSpeedAuPerYr({ muAu3Yr2, hAbsAu2Yr, ecc, nuRad }) {
    if (!Number.isFinite(muAu3Yr2) || !(muAu3Yr2 > 0)) return NaN;
    if (!Number.isFinite(hAbsAu2Yr) || !(hAbsAu2Yr > 0)) return NaN;
    if (!Number.isFinite(ecc) || ecc < 0) return NaN;
    if (!Number.isFinite(nuRad)) return NaN;

    // v = (μ / h) * sqrt(1 + 2e cosν + e^2)
    const q = 1 + 2 * ecc * Math.cos(nuRad) + ecc * ecc;
    if (!(q >= 0)) return NaN;
    return (muAu3Yr2 / hAbsAu2Yr) * Math.sqrt(Math.max(0, q));
  }

  function renderParticleAndVelocity() {
    if (!elements.particle || !elements.velocityLine) return;

    const pos = conicPositionAndTangentAu({
      ecc: anim.ecc,
      pAu: anim.pAu,
      omegaRad: anim.omegaRad,
      nuRad: anim.nuRad,
    });
    if (!pos) return;

    const pSvg = toSvg({ xAu: pos.xAu, yAu: pos.yAu }, anim.scalePxPerAu);
    elements.particle.setAttribute('cx', pSvg.x.toFixed(2));
    elements.particle.setAttribute('cy', pSvg.y.toFixed(2));

    if (elements.vValue) {
      const vAuYr = instantaneousSpeedAuPerYr({
        muAu3Yr2: anim.muAu3Yr2,
        hAbsAu2Yr: anim.hAbsAu2Yr,
        ecc: anim.ecc,
        nuRad: anim.nuRad,
      });
      const vKmS = Number.isFinite(vAuYr) ? TwoBody.speedKmPerSFromAuPerYr(vAuYr) : NaN;
      elements.vValue.textContent = Number.isFinite(vKmS) ? vKmS.toPrecision(4) : '—';
    }

    // Tangent direction in SVG coordinates (note y flip).
    const dxSvg = pos.dxAu * anim.scalePxPerAu;
    const dySvg = -pos.dyAu * anim.scalePxPerAu;
    const mag = Math.sqrt(dxSvg * dxSvg + dySvg * dySvg);
    const ux = mag > 0 ? (dxSvg / mag) * anim.dir : 0;
    const uy = mag > 0 ? (dySvg / mag) * anim.dir : 0;

    elements.velocityLine.setAttribute('x1', pSvg.x.toFixed(2));
    elements.velocityLine.setAttribute('y1', pSvg.y.toFixed(2));
    elements.velocityLine.setAttribute('x2', (pSvg.x + ux * anim.vLenPx).toFixed(2));
    elements.velocityLine.setAttribute('y2', (pSvg.y + uy * anim.vLenPx).toFixed(2));
  }

  function stopAnimation() {
    state.playing = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    if (elements.btnPlay) elements.btnPlay.disabled = false;
    if (elements.btnPause) elements.btnPause.disabled = true;
  }

  function resetAnimation() {
    stopAnimation();
    anim.dir = 1;
    anim.nuRad = anim.startNuRad;
    renderParticleAndVelocity();
  }

  function startAnimation() {
    if (state.playing) return;
    if (!Number.isFinite(anim.ecc) || !Number.isFinite(anim.pAu) || !Number.isFinite(anim.omegaRad)) return;
    if (!Number.isFinite(anim.nuMin) || !Number.isFinite(anim.nuMax)) return;
    if (anim.orbitType === 'invalid') return;

    state.playing = true;
    if (elements.btnPlay) elements.btnPlay.disabled = true;
    if (elements.btnPause) elements.btnPause.disabled = false;

    anim.lastTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();

    function tick(nowMs) {
      if (!state.playing) return;
      const dt = (nowMs - anim.lastTimeMs) / 1000;
      anim.lastTimeMs = nowMs;

      // Advance using Kepler’s 2nd law (constant areal velocity):
      // h = r^2 dν/dt  ⇒  dν/dt = h/r^2.
      // We use a teaching time scale (SIM_YEARS_PER_SEC) so motion is visible.
      let dtRemain = Math.min(dt, 0.1);
      let stopped = false;
      while (dtRemain > 1e-9 && !stopped) {
        const dtStep = Math.min(dtRemain, 0.02);
        const rAu = orbitalRadiusAu({ ecc: anim.ecc, pAu: anim.pAu, nuRad: anim.nuRad });
        const nuSpeedRadPerYr =
          Number.isFinite(anim.hAbsAu2Yr) && Number.isFinite(rAu) && rAu > 0 ? anim.hAbsAu2Yr / (rAu * rAu) : 0;
        const step = Model.advanceTrueAnomalyRad({
          nuRad: anim.nuRad,
          ecc: anim.ecc,
          nuMin: anim.nuMin,
          nuMax: anim.nuMax,
          dir: anim.dir,
          dtSec: dtStep,
          nuSpeedRadPerSec: nuSpeedRadPerYr * SIM_YEARS_PER_SEC,
        });
        anim.nuRad = step.nuRad;
        anim.dir = step.dir;
        stopped = step.stopped;
        dtRemain -= dtStep;
      }

      renderParticleAndVelocity();
      if (stopped) {
        stopAnimation();
        return;
      }
      state.animationId = requestAnimationFrame(tick);
    }

    state.animationId = requestAnimationFrame(tick);
  }

  function buildPathD(points, scalePxPerAu) {
    if (!points.length) return '';
    const start = toSvg(points[0], scalePxPerAu);
    let d = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
      const p = toSvg(points[i], scalePxPerAu);
      d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }
    return d;
  }

  function maxRadiusAu(points) {
    let maxR = 0;
    for (const p of points) {
      const r = Math.sqrt(p.xAu * p.xAu + p.yAu * p.yAu);
      if (Number.isFinite(r) && r > maxR) maxR = r;
    }
    return maxR;
  }

  function setPreset(name) {
    switch (name) {
      case 'circular':
        state.speedFactor = 1;
        state.directionDeg = 0;
        break;
      case 'elliptical':
        state.speedFactor = 0.75;
        state.directionDeg = 0;
        break;
      case 'escape':
        state.speedFactor = Math.SQRT2;
        state.directionDeg = 0;
        break;
      case 'hyperbolic':
        state.speedFactor = 1.8;
        state.directionDeg = 0;
        break;
    }
    elements.speedSlider.value = String(state.speedFactor);
    elements.directionSlider.value = String(state.directionDeg);
    updateSliderDisplays();
    update();
  }

  function updateSliderDisplays() {
    elements.massDisplay.textContent = `${state.massSolar.toPrecision(3)} M\u2609`;
    elements.r0Display.textContent = `${state.r0Au.toPrecision(3)} AU`;
    elements.speedDisplay.textContent = `${state.speedFactor.toPrecision(3)}×`;
    elements.directionDisplay.textContent = `${Math.round(state.directionDeg)}°`;
  }

  function update() {
    stopAnimation();

    const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(state.massSolar);
    const vCirc = TwoBody.circularSpeedAuPerYr({ muAu3Yr2, rAu: state.r0Au });
    const speedAuYr = state.speedFactor * vCirc;

    const { rVecAu, vVecAuYr } = Model.initialStateAuYr({
      r0Au: state.r0Au,
      speedAuYr,
      directionDeg: state.directionDeg,
    });

    const els = TwoBody.orbitElementsFromStateAuYr({ rVecAu, vVecAuYr, muAu3Yr2 });
    const orbitType = formatOrbitType(els.orbitType);

    // For open orbits (escape/hyperbolic), clip the plotted curve to a finite window.
    // Otherwise, sampling near asymptotes makes max radius enormous and the orbit collapses visually.
    const rMaxPlotAu = Number.isFinite(els.ecc) && els.ecc >= 1 ? 10 * state.r0Au : undefined;

    // Plot conic from (e, p, omega); for near-circular, omega is arbitrary but harmless.
    const points =
      els.orbitType === 'invalid' || !(els.pAu > 0)
        ? []
        : Model.sampleConicOrbitAu({
            ecc: els.ecc,
            pAu: els.pAu,
            omegaRad: els.omegaRad,
            numPoints: PATH_SAMPLES,
            rMaxAu: rMaxPlotAu,
          });

    const maxR = Math.max(maxRadiusAu(points), state.r0Au);
    const scalePxPerAu = maxR > 0 ? VIEW_RADIUS_PX / maxR : 1;

    elements.orbitPath.setAttribute('d', buildPathD(points, scalePxPerAu));

    // Animation parameters (reuse the conic definition used for plotting).
    const domain = Model.conicTrueAnomalyDomainRadForPlot({ ecc: els.ecc, pAu: els.pAu, rMaxAu: rMaxPlotAu });
    anim.orbitType = els.orbitType;
    anim.ecc = Number.isFinite(els.ecc) ? els.ecc : NaN;
    anim.pAu = Number.isFinite(els.pAu) ? els.pAu : NaN;
    anim.omegaRad = Number.isFinite(els.omegaRad) ? els.omegaRad : NaN;
    anim.hAbsAu2Yr = Number.isFinite(els.hAbsAu2Yr) ? els.hAbsAu2Yr : NaN;
    anim.muAu3Yr2 = muAu3Yr2;
    anim.scalePxPerAu = scalePxPerAu;
    anim.vLenPx = Math.max(0, Math.min(110, 50 * state.speedFactor));
    anim.nuMin = domain.nuMin;
    anim.nuMax = domain.nuMax;

    // Initial position is r0 on +x axis; map to conic true anomaly (ν) in the orbit frame.
    if (rVecAu && Number.isFinite(anim.omegaRad)) {
      const cosO = Math.cos(anim.omegaRad);
      const sinO = Math.sin(anim.omegaRad);
      const xOrb0 = rVecAu.xAu * cosO + rVecAu.yAu * sinO;
      const yOrb0 = -rVecAu.xAu * sinO + rVecAu.yAu * cosO;
      let nu0 = Math.atan2(yOrb0, xOrb0);
      if (Number.isFinite(anim.ecc) && anim.ecc < 1) nu0 = wrap2Pi(nu0);
      anim.startNuRad = nu0;
      anim.nuRad = nu0;
      anim.dir = 1;
    }

    // Render particle + velocity direction at the initial state.
    renderParticleAndVelocity();

    // Disable animation if the orbit is not drawable.
    if (elements.btnPlay) {
      elements.btnPlay.disabled = orbitType === 'invalid' || !Number.isFinite(anim.nuMin) || !Number.isFinite(anim.nuMax);
    }

    // Readouts
    elements.orbitType.textContent = orbitType;
    elements.eccValue.textContent = Number.isFinite(els.ecc) ? els.ecc.toPrecision(4) : '—';
    elements.epsValue.textContent = Number.isFinite(els.epsAu2Yr2) ? els.epsAu2Yr2.toPrecision(4) : '—';
    elements.hValue.textContent = Number.isFinite(els.hAbsAu2Yr) ? els.hAbsAu2Yr.toPrecision(4) : '—';

    // Periapsis distance r_p = p/(1+e)
    const rp = Number.isFinite(els.pAu) && Number.isFinite(els.ecc) ? els.pAu / (1 + els.ecc) : NaN;
    elements.rpValue.textContent = Number.isFinite(rp) ? rp.toPrecision(4) : '—';

    // Semi-major axis a (infinite for parabolic)
    if (els.orbitType === 'parabolic' || !Number.isFinite(els.aAu)) {
      elements.aValue.textContent = '∞';
    } else {
      elements.aValue.textContent = els.aAu.toPrecision(4);
    }

    // A11y: announce key outcomes
    if (elements.statusAnnounce) {
      elements.statusAnnounce.textContent =
        `Orbit is ${orbitType}. e=${Number.isFinite(els.ecc) ? els.ecc.toFixed(3) : 'unknown'}.`;
    }
  }

  function setupControls() {
    // Mass: log slider -1..1 → 0.1..10
    state.massSolar = logSliderToValue(elements.massSlider.value);
    elements.massSlider.addEventListener('input', () => {
      state.massSolar = logSliderToValue(elements.massSlider.value);
      updateSliderDisplays();
      update();
    });

    // r0: log slider -1..1 → 0.1..10
    state.r0Au = logSliderToValue(elements.r0Slider.value);
    elements.r0Slider.addEventListener('input', () => {
      state.r0Au = logSliderToValue(elements.r0Slider.value);
      updateSliderDisplays();
      update();
    });

    // Speed factor
    state.speedFactor = parseFloat(elements.speedSlider.value);
    elements.speedSlider.addEventListener('input', () => {
      state.speedFactor = parseFloat(elements.speedSlider.value);
      updateSliderDisplays();
      update();
    });

    // Direction
    state.directionDeg = parseFloat(elements.directionSlider.value);
    elements.directionSlider.addEventListener('input', () => {
      state.directionDeg = parseFloat(elements.directionSlider.value);
      updateSliderDisplays();
      update();
    });

    // Presets
    for (const btn of elements.presetButtons) {
      btn.addEventListener('click', () => setPreset(btn.dataset.preset));
    }
  }

  function init() {
    initElements();
    setupControls();
    if (elements.btnPlay && elements.btnPause && elements.btnReset) {
      elements.btnPlay.addEventListener('click', startAnimation);
      elements.btnPause.addEventListener('click', stopAnimation);
      elements.btnReset.addEventListener('click', resetAnimation);
    }
    updateSliderDisplays();
    update();

    // Starfield (nice-to-have)
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, { starCount: 150, twinkleSpeed: 0.01 });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

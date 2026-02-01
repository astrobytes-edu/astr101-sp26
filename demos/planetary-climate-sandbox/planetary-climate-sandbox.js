(function () {
  'use strict';

  if (!window.PlanetaryClimateModel) throw new Error('Planetary Climate Sandbox: missing PlanetaryClimateModel');
  if (!window.BlackbodyModel) throw new Error('Planetary Climate Sandbox: missing BlackbodyModel');
  if (!window.SpectraDataV1) throw new Error('Planetary Climate Sandbox: missing SpectraDataV1');
  if (!window.ClimatePresetsV1) throw new Error('Planetary Climate Sandbox: missing ClimatePresetsV1');

  const Model = window.PlanetaryClimateModel;
  const Blackbody = window.BlackbodyModel;
  const Spectra = window.SpectraDataV1;
  const Presets = window.ClimatePresetsV1;

  const state = {
    presetId: 'earth',
    view: 'budget',
    missionId: 'albedo',
    lstarLsun: 1.0,
    dAU: 1.0,
    albedo: 0.3,
    tauIR: 0.49,
    redistribution: 'global',
  };

  const el = {
    btnViewBudget: document.getElementById('btn-view-budget'),
    btnViewSpectral: document.getElementById('btn-view-spectral'),
    panelBudget: document.getElementById('panel-budget'),
    panelSpectral: document.getElementById('panel-spectral'),
    spectralCanvas: document.getElementById('spectral-canvas'),

    readoutLstar: document.getElementById('readout-lstar'),
    readoutDistance: document.getElementById('readout-distance'),
    readoutAlbedo: document.getElementById('readout-albedo'),
    readoutAbsorbed: document.getElementById('readout-absorbed'),
    readoutTeq: document.getElementById('readout-teq'),
    readoutTau: document.getElementById('readout-tau'),
    readoutEpsilon: document.getElementById('readout-epsilon'),
    readoutEpsilonInline: document.getElementById('readout-epsilon-inline'),
    readoutTsurf: document.getElementById('readout-tsurf'),
    readoutDeltaT: document.getElementById('readout-deltaT'),

    arrowIn: document.getElementById('arrow-in'),
    arrowReflect: document.getElementById('arrow-reflect'),
    arrowIR: document.getElementById('arrow-ir'),

    presetSelect: document.getElementById('preset-select'),
    presetBadges: document.getElementById('preset-badges'),

    lstarSlider: document.getElementById('lstar-slider'),
    distanceSlider: document.getElementById('distance-slider'),
    albedoSlider: document.getElementById('albedo-slider'),
    tauSlider: document.getElementById('tau-slider'),

    lstarDisplay: document.getElementById('lstar-display'),
    distanceDisplay: document.getElementById('distance-display'),
    albedoDisplay: document.getElementById('albedo-display'),
    tauDisplay: document.getElementById('tau-display'),

    missionSelect: document.getElementById('mission-select'),
    missionPrompt: document.getElementById('mission-prompt'),
    btnCheck: document.getElementById('btn-check'),
    checkResult: document.getElementById('check-result'),
    statusAnnounce: document.getElementById('status-announce'),
  };

  function clamp(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
  }

  function fmt(x, digits) {
    if (!Number.isFinite(x)) return '—';
    return x.toFixed(digits);
  }

  function fmtInt(x) {
    if (!Number.isFinite(x)) return '—';
    return String(Math.round(x));
  }

  function getSelectedRedistribution() {
    const checked = document.querySelector('input[name="redistribution"]:checked');
    return checked?.value === 'dayside' ? 'dayside' : 'global';
  }

  function getSelectedPrediction() {
    const checked = document.querySelector('input[name="prediction"]:checked');
    return checked?.value ?? null;
  }

  function missionSpec(id) {
    switch (id) {
      case 'albedo':
        return {
          prompt:
            'Prediction: If Bond albedo A increases (the planet reflects more incoming energy), what happens to equilibrium temperature Teq?',
          correct: 'down',
        };
      case 'greenhouse':
        return {
          prompt:
            'Prediction: If greenhouse strength τIR increases (infrared escape is less efficient), what happens to surface temperature Tsurf?',
          correct: 'up',
        };
      case 'redistribution':
        return {
          prompt:
            'Prediction: If you switch from full redistribution to dayside emission (less emitting area), what happens to Teq?',
          correct: 'up',
        };
      default:
        return { prompt: 'Prediction mission not found.', correct: 'same' };
    }
  }

  function setView(view) {
    state.view = view === 'spectral' ? 'spectral' : 'budget';

    const isBudget = state.view === 'budget';
    el.panelBudget.classList.toggle('hidden', !isBudget);
    el.panelSpectral.classList.toggle('hidden', isBudget);

    el.btnViewBudget.classList.toggle('active', isBudget);
    el.btnViewSpectral.classList.toggle('active', !isBudget);

    el.btnViewBudget.setAttribute('aria-selected', isBudget ? 'true' : 'false');
    el.btnViewSpectral.setAttribute('aria-selected', !isBudget ? 'true' : 'false');
  }

  function setBadgesForPreset(preset) {
    el.presetBadges.innerHTML = '';
    if (!preset) return;

    const assumedKeys = [];
    if (preset.lstar_lsun_assumed) assumedKeys.push('L★');
    if (preset.bond_albedo_assumed) assumedKeys.push('A');
    if (preset.tau_ir_assumed) assumedKeys.push('τIR');

    if (assumedKeys.length === 0) return;

    const badge = document.createElement('span');
    badge.className = 'badge warn';
    badge.textContent = `ASSUMPTION: ${assumedKeys.join(', ')}`;
    el.presetBadges.appendChild(badge);
  }

  function loadPreset(presetId) {
    const preset = Presets.presets.find((p) => p.id === presetId);
    if (!preset) return;

    state.presetId = preset.id;

    state.lstarLsun = Number(preset.lstar_lsun);
    state.dAU = Number(preset.d_au);
    state.albedo = Number(preset.bond_albedo);
    state.tauIR = Number(preset.tau_ir ?? state.tauIR);

    el.lstarSlider.value = String(state.lstarLsun);
    el.distanceSlider.value = String(state.dAU);
    el.albedoSlider.value = String(state.albedo);
    el.tauSlider.value = String(state.tauIR);

    setBadgesForPreset(preset);
  }

  function fillPresetSelect() {
    el.presetSelect.innerHTML = '';
    for (const p of Presets.presets) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.label}${p.kind === 'exoplanet' ? ' (exo)' : ''}`;
      el.presetSelect.appendChild(opt);
    }
    el.presetSelect.value = state.presetId;
  }

  function compute() {
    const LStarW = state.lstarLsun * Model.CONST.L_SUN_W;
    const dM = state.dAU * Model.CONST.AU_M;
    const fluxWm2 = Model.stellarFluxWm2({ LStarW, dM });
    const absorbedWm2 = Model.absorbedFluxWm2({ fluxWm2, albedo: state.albedo, redistribution: state.redistribution });
    const TeqK = Model.equilibriumTempK({ LStarW, dM, albedo: state.albedo, redistribution: state.redistribution });
    const epsilonOut = Model.epsilonOutFromTauIR({ tauIR: state.tauIR });
    const TsurfK = Model.surfaceTempK({ TeqK, tauIR: state.tauIR });

    return {
      LStarW,
      dM,
      fluxWm2,
      absorbedWm2,
      TeqK,
      epsilonOut,
      TsurfK,
      deltaT: TsurfK - TeqK,
    };
  }

  function updateReadouts(r) {
    el.readoutLstar.textContent = fmt(state.lstarLsun, 2);
    el.readoutDistance.textContent = fmt(state.dAU, 2);
    el.readoutAlbedo.textContent = fmt(state.albedo, 2);

    el.readoutAbsorbed.textContent = Number.isFinite(r.absorbedWm2) ? fmtInt(r.absorbedWm2) : '—';
    el.readoutTeq.textContent = Number.isFinite(r.TeqK) ? fmtInt(r.TeqK) : '—';
    el.readoutTau.textContent = fmt(state.tauIR, 2);
    el.readoutEpsilon.textContent = fmt(r.epsilonOut, 2);
    el.readoutEpsilonInline.textContent = fmt(r.epsilonOut, 2);
    el.readoutTsurf.textContent = Number.isFinite(r.TsurfK) ? fmtInt(r.TsurfK) : '—';
    el.readoutDeltaT.textContent = Number.isFinite(r.deltaT) ? fmtInt(r.deltaT) : '—';

    el.lstarDisplay.textContent = `${fmt(state.lstarLsun, 2)} L☉`;
    el.distanceDisplay.textContent = `${fmt(state.dAU, 3)} AU`;
    el.albedoDisplay.textContent = fmt(state.albedo, 2);
    el.tauDisplay.textContent = fmt(state.tauIR, 2);
  }

  function updateBudgetDiagram(r) {
    // Arrow widths are purely illustrative (not a quantitative plot).
    const A = clamp(state.albedo, 0, 1);
    const div = state.redistribution === 'dayside' ? 2 : 4;
    const absorbedFrac = (1 - A) / div; // proportional to absorbed average per unit incoming flux

    const inW = 10;
    const reflW = clamp(2 + 10 * A, 2, 14);
    const irW = clamp(2 + 18 * absorbedFrac, 2.5, 16);

    el.arrowIn.setAttribute('stroke-width', String(inW));
    el.arrowReflect.setAttribute('stroke-width', String(reflW));
    el.arrowIR.setAttribute('stroke-width', String(irW));
  }

  function visualOpacityFromTauIR(tauIR) {
    if (typeof Model.spectralOpacityFromTauIR === 'function') {
      return Model.spectralOpacityFromTauIR({ tauIR });
    }
    if (!Number.isFinite(tauIR) || tauIR < 0) return 0;
    return 1 - Math.exp(-0.7 * tauIR);
  }

  function drawSpectral(r) {
    if (!el.spectralCanvas) return;
    const ctx = el.spectralCanvas.getContext('2d');
    if (!ctx) return;

    const W = el.spectralCanvas.width;
    const H = el.spectralCanvas.height;

    ctx.clearRect(0, 0, W, H);

    // Frame
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    const padL = 60;
    const padR = 20;
    const padT = 26;
    const padB = 44;

    // Axes labels
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    ctx.fillText('Relative intensity', 14, 18);
    ctx.fillText('Wavelength (µm)', W - 160, H - 14);

    const minUm = 2.0;
    const maxUm = 30.0;
    const N = 220;

    const T = Number.isFinite(r.TsurfK) ? r.TsurfK : 288;
    const tauVis = visualOpacityFromTauIR(state.tauIR);

    const bands = (Spectra.molecularBands || []).filter((b) => b?.center?.unit === 'um' && Number.isFinite(b.center.value));
    const bandCenters = bands.map((b) => ({ um: b.center.value, label: b.label, molecule: b.molecule }));

    function umToX(um) {
      const t = (um - minUm) / (maxUm - minUm);
      return padL + t * (W - padL - padR);
    }

    function intensityAtUm(um) {
      const cm = um * 1e-4; // 1 µm = 1e-4 cm
      return Blackbody.planckFunction(cm, T);
    }

    const raw = [];
    let rawMax = 0;
    for (let i = 0; i < N; i++) {
      const um = minUm + (i / (N - 1)) * (maxUm - minUm);
      const y = intensityAtUm(um);
      raw.push({ um, y });
      if (y > rawMax) rawMax = y;
    }
    if (!(rawMax > 0)) rawMax = 1;

    function transmissionAtUm(um) {
      // Broad, illustrative absorption "dips" centered on sourced band centers.
      // Depth/width scale monotonically with tauIR.
      let t = 1.0;
      for (const b of bandCenters) {
        const center = b.um;
        const baseWidth = center < 5 ? 0.35 : center < 10 ? 0.6 : 1.2;
        const width = baseWidth * (0.7 + 0.9 * tauVis);
        const depth = 0.15 + 0.75 * tauVis;
        const g = Math.exp(-0.5 * Math.pow((um - center) / width, 2));
        t *= 1 - depth * g;
      }
      return clamp(t, 0.05, 1);
    }

    // Axes lines
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, H - padB);
    ctx.lineTo(W - padR, H - padB);
    ctx.stroke();

    // Band markers
    for (const b of bandCenters) {
      if (b.um < minUm || b.um > maxUm) continue;
      const x = umToX(b.um);
      ctx.strokeStyle = 'rgba(244, 208, 63, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, H - padB);
      ctx.stroke();
    }

    // Draw blackbody curve (no absorption) faintly
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < raw.length; i++) {
      const { um, y } = raw[i];
      const x = umToX(um);
      const yn = y / rawMax;
      const yy = (H - padB) - yn * (H - padT - padB);
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();

    // Draw absorbed curve
    ctx.strokeStyle = 'rgba(93, 173, 226, 0.95)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < raw.length; i++) {
      const { um, y } = raw[i];
      const x = umToX(um);
      const yn = (y / rawMax) * transmissionAtUm(um);
      const yy = (H - padB) - yn * (H - padT - padB);
      if (i === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();

    // Band labels (top)
    ctx.fillStyle = 'rgba(244, 208, 63, 0.85)';
    ctx.font = '12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    const labeled = bandCenters
      .filter((b) => b.um >= minUm && b.um <= maxUm)
      .sort((a, b) => a.um - b.um);
    for (const b of labeled) {
      const x = umToX(b.um);
      ctx.fillText(b.molecule, x + 4, padT + 14);
    }

    // Footer annotation
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = '13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    ctx.fillText(`Tsurf = ${fmtInt(r.TsurfK)} K`, padL, H - 16);
    ctx.fillText(`visual opacity ~ ${fmt(tauVis, 2)}`, padL + 160, H - 16);
  }

  function renderMission() {
    const m = missionSpec(state.missionId);
    el.missionPrompt.textContent = m.prompt;
  }

  function runCheck() {
    const m = missionSpec(state.missionId);
    const pred = getSelectedPrediction();
    if (!pred) {
      el.checkResult.className = 'check-result bad';
      el.checkResult.textContent = 'Choose a prediction first.';
      return;
    }

    const ok = pred === m.correct;
    el.checkResult.className = `check-result ${ok ? 'good' : 'bad'}`;
    el.checkResult.textContent = ok ? 'Nice: direction matches the model.' : `Not quite: the model says it goes ${m.correct}.`;

    if (el.statusAnnounce) el.statusAnnounce.textContent = el.checkResult.textContent;
  }

  function render() {
    state.redistribution = getSelectedRedistribution();
    const r = compute();
    updateReadouts(r);
    updateBudgetDiagram(r);
    if (state.view === 'spectral') drawSpectral(r);
  }

  function wireControls() {
    el.btnViewBudget.addEventListener('click', () => {
      setView('budget');
      render();
    });
    el.btnViewSpectral.addEventListener('click', () => {
      setView('spectral');
      render();
    });

    el.presetSelect.addEventListener('change', () => {
      loadPreset(el.presetSelect.value);
      render();
    });

    el.lstarSlider.addEventListener('input', () => {
      state.lstarLsun = Number(el.lstarSlider.value);
      setBadgesForPreset(Presets.presets.find((p) => p.id === state.presetId));
      render();
    });
    el.distanceSlider.addEventListener('input', () => {
      state.dAU = Number(el.distanceSlider.value);
      render();
    });
    el.albedoSlider.addEventListener('input', () => {
      state.albedo = Number(el.albedoSlider.value);
      render();
    });
    el.tauSlider.addEventListener('input', () => {
      state.tauIR = Number(el.tauSlider.value);
      render();
    });

    document.querySelectorAll('input[name="redistribution"]').forEach((input) => {
      input.addEventListener('change', () => render());
    });

    el.missionSelect.addEventListener('change', () => {
      state.missionId = el.missionSelect.value;
      renderMission();
      el.checkResult.textContent = '';
      el.checkResult.className = 'check-result';
    });

    el.btnCheck.addEventListener('click', () => runCheck());
  }

  function init() {
    fillPresetSelect();
    loadPreset(state.presetId);
    setView(state.view);
    renderMission();
    wireControls();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

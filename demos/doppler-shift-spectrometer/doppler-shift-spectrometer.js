(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  if (!window.SpectraDataV1) throw new Error('Doppler Shift Spectrometer: missing SpectraDataV1');
  if (!window.DopplerShiftModel) throw new Error('Doppler Shift Spectrometer: missing DopplerShiftModel');

  const state = {
    motion: 'radial',
    vKms: 0,
    resolutionNm: 0.2,
    selectedLineId: 'H_I_Ha',
  };

  const atomicLines = (window.SpectraDataV1.atomicLines ?? [])
    .filter((f) => f?.kind === 'atomic_line' && f?.verified)
    .map((f) => ({
      id: f.id,
      label: f.line_name,
      species: f.species,
      lambda0Nm: f.wavelength.value,
    }))
    .filter((x) => Number.isFinite(x.lambda0Nm));

  const visibleLines = atomicLines.filter((l) => l.lambda0Nm >= 380 && l.lambda0Nm <= 700);
  const lineById = Object.fromEntries(visibleLines.map((l) => [l.id, l]));
  if (!lineById[state.selectedLineId] && visibleLines[0]) state.selectedLineId = visibleLines[0].id;

  const el = {
    spectrumSvg: document.getElementById('spectrum-svg'),
    stageMeta: document.getElementById('stage-meta'),

    readoutVr: document.getElementById('readout-vr'),
    readoutL0: document.getElementById('readout-l0'),
    readoutLobs: document.getElementById('readout-lobs'),
    readoutDl: document.getElementById('readout-dl'),
    readoutVcalc: document.getElementById('readout-vcalc'),

    motionDisplay: document.getElementById('motion-display'),
    vrDisplay: document.getElementById('vr-display'),
    vrSlider: document.getElementById('vr-slider'),

    lineDisplay: document.getElementById('line-display'),
    lineSelect: document.getElementById('line-select'),

    resolutionDisplay: document.getElementById('resolution-display'),
    resolutionSlider: document.getElementById('resolution-slider'),

    signResult: document.getElementById('sign-result'),
    btnCheckSign: document.getElementById('btn-check-sign'),
  };

  function svgEl(name, attrs = {}) {
    const n = document.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
  }

  function clearSvg() {
    while (el.spectrumSvg.firstChild) el.spectrumSvg.removeChild(el.spectrumSvg.firstChild);
  }

  function nmToX(nm, minNm, maxNm) {
    const t = (nm - minNm) / (maxNm - minNm);
    return 80 + t * (1000 - 160);
  }

  function drawAxes({ minNm, maxNm }) {
    el.spectrumSvg.appendChild(svgEl('line', { x1: 80, y1: 190, x2: 920, y2: 190, stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 2 }));
    for (const t of [400, 450, 500, 550, 600, 650, 700]) {
      if (t < minNm || t > maxNm) continue;
      const x = nmToX(t, minNm, maxNm);
      el.spectrumSvg.appendChild(svgEl('line', { x1: x, y1: 190, x2: x, y2: 198, stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 2 }));
      const label = svgEl('text', {
        x,
        y: 214,
        fill: 'rgba(255,255,255,0.7)',
        'font-size': 16,
        'text-anchor': 'middle',
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      });
      label.textContent = `${t} nm`;
      el.spectrumSvg.appendChild(label);
    }
  }

  function computeLambdaObs(lambda0Nm) {
    if (state.motion !== 'radial') return lambda0Nm;
    return DopplerShiftModel.dopplerShiftNm({ lambda0Nm, vKms: state.vKms });
  }

  function renderSpectrum() {
    const minNm = 380;
    const maxNm = 700;
    el.stageMeta.textContent = `${minNm}–${maxNm} nm`;

    clearSvg();
    drawAxes({ minNm, maxNm });

    const widthPx = Math.max(2, Math.min(18, 3 + state.resolutionNm * 18));
    const yTop = 60;
    const yBot = 190;

    for (const line of visibleLines) {
      const x0 = nmToX(line.lambda0Nm, minNm, maxNm);
      const xObs = nmToX(computeLambdaObs(line.lambda0Nm), minNm, maxNm);

      const isSelected = line.id === state.selectedLineId;
      const w = isSelected ? widthPx + 3 : widthPx;

      // Rest (gray)
      el.spectrumSvg.appendChild(svgEl('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, stroke: 'rgba(255,255,255,0.55)', 'stroke-width': w }));
      // Observed (blue)
      el.spectrumSvg.appendChild(svgEl('line', { x1: xObs, y1: yTop, x2: xObs, y2: yBot, stroke: 'rgba(93,173,226,0.95)', 'stroke-width': w }));
    }

    const legend = svgEl('text', { x: 920, y: 30, fill: 'rgba(255,255,255,0.7)', 'font-size': 14, 'text-anchor': 'end' });
    legend.textContent = 'rest (gray) vs observed (blue)';
    el.spectrumSvg.appendChild(legend);
  }

  function renderReadouts() {
    const selected = lineById[state.selectedLineId];
    const lambda0 = selected?.lambda0Nm ?? 656.281;
    const lambdaObs = computeLambdaObs(lambda0);
    const dLambda = DopplerShiftModel.deltaLambdaNm({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs });
    const vCalc = DopplerShiftModel.velocityFromShiftKms({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs });

    el.readoutVr.textContent = String(Math.round(state.vKms));
    el.readoutL0.textContent = lambda0.toFixed(3);
    el.readoutLobs.textContent = lambdaObs.toFixed(3);
    el.readoutDl.textContent = dLambda.toFixed(3);
    el.readoutVcalc.textContent = vCalc.toFixed(0);

    el.motionDisplay.textContent = state.motion;
    el.vrDisplay.textContent = `${Math.round(state.vKms)} km/s`;

    el.resolutionDisplay.textContent = `${state.resolutionNm.toFixed(2)} nm`;

    el.lineDisplay.textContent = selected?.line_name ?? selected?.label ?? 'line';
  }

  function render() {
    renderReadouts();
    renderSpectrum();
  }

  function wireControls() {
    document.querySelectorAll('.motion-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const motion = btn.getAttribute('data-motion');
        if (!motion) return;
        state.motion = motion;
        document.querySelectorAll('.motion-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        el.signResult.textContent = '—';
        render();
      });
    });

    el.vrSlider.addEventListener('input', () => {
      state.vKms = Number(el.vrSlider.value);
      el.signResult.textContent = '—';
      render();
    });

    el.resolutionSlider.addEventListener('input', () => {
      state.resolutionNm = Number(el.resolutionSlider.value) / 100;
      render();
    });

    for (const line of visibleLines) {
      const opt = document.createElement('option');
      opt.value = line.id;
      opt.textContent = `${line.species} ${line.label} (${line.lambda0Nm.toFixed(3)} nm)`;
      el.lineSelect.appendChild(opt);
    }
    el.lineSelect.value = state.selectedLineId;
    el.lineSelect.addEventListener('change', () => {
      state.selectedLineId = el.lineSelect.value;
      el.signResult.textContent = '—';
      render();
    });

    el.btnCheckSign.addEventListener('click', () => {
      const selected = lineById[state.selectedLineId];
      const lambda0 = selected?.lambda0Nm ?? 656.281;
      const lambdaObs = computeLambdaObs(lambda0);
      const dLambda = DopplerShiftModel.deltaLambdaNm({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs });

      const correct = dLambda > 0 ? 'receding' : dLambda < 0 ? 'approaching' : 'neither';
      const chosen = document.querySelector('input[name=\"sign\"]:checked')?.value ?? '';

      if (correct === 'neither') {
        el.signResult.textContent = 'Δλ = 0';
        return;
      }

      if (chosen === correct) {
        el.signResult.textContent = '✓';
      } else if (!chosen) {
        el.signResult.textContent = 'pick one';
      } else {
        el.signResult.textContent = '✗';
      }
    });
  }

  wireControls();
  render();
})();


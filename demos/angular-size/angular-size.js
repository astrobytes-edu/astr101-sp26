/**
 * Angular Size Demo
 * Interactive demonstration of angular size = physical size / distance
 */

(function() {
  'use strict';

  const Model = typeof window !== 'undefined' ? window.AngularSizeModel : null;
  if (!Model) {
    console.error('Angular Size: missing window.AngularSizeModel (did you load demos/_assets/angular-size-model.js?)');
    return;
  }

  // ============================================
  // Preset Data
  // ============================================

  const PRESETS = Model.presets;

  // ============================================
  // State
  // ============================================

  const state = {
    diameter: PRESETS.sun.diameter,
    distance: PRESETS.sun.distance,
    activePreset: 'sun',
    moonOrbitAngle: 0, // Degrees (for Moon orbit distance variation)
    moonTimeMode: 'orbit', // 'orbit' | 'recession'
    moonRecessionTimeMyr: 0 // Myr from today (toy linear model)
  };

  const MOON_DISTANCE_TODAY_KM = PRESETS.moon.distance;
  const MOON_RECESSION_CM_PER_YEAR = 3.8; // mean present-day value; varies with time

  // Slider ranges (logarithmic)
  const DISTANCE_MIN = 0.0001;    // 0.1 m in km
  const DISTANCE_MAX = 1e20;      // ~10 million ly in km
  const SIZE_MIN = 0.00001;       // 1 cm in km
  const SIZE_MAX = 1e19;          // Large galaxy

  // Lecture contract (module-01 lecture reading excerpt):
  // Moon's angular size varies roughly from ~0.49° to ~0.56° over its orbit.
  const MOON_ORBIT_MIN_ANGULAR_SIZE_DEG = 0.49;
  const MOON_ORBIT_MAX_ANGULAR_SIZE_DEG = 0.56;
  const MOON_ORBIT = (() => {
    const d = PRESETS.moon.diameter;
    const degToRad = (deg) => deg * Math.PI / 180;
    const distanceForAngularDiameterDeg = (angularDeg) => {
      const angleRad = degToRad(angularDeg);
      if (angleRad <= 0) return Infinity;
      return d / (2 * Math.tan(angleRad / 2));
    };

    const perigeeKm = distanceForAngularDiameterDeg(MOON_ORBIT_MAX_ANGULAR_SIZE_DEG);
    const apogeeKm = distanceForAngularDiameterDeg(MOON_ORBIT_MIN_ANGULAR_SIZE_DEG);
    return { perigeeKm, apogeeKm };
  })();

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {};

  function initElements() {
    elements.svg = document.getElementById('angular-size-svg');
    elements.objectCircle = document.getElementById('object-circle');
    elements.angleArc = document.getElementById('angle-arc');
    elements.angleLineTop = document.getElementById('angle-line-top');
    elements.angleLineBottom = document.getElementById('angle-line-bottom');
    elements.angleText = document.getElementById('angle-text');
    elements.distanceLabel = document.getElementById('distance-label');
    elements.sizeLine = document.getElementById('size-line');
    elements.sizeLabel = document.getElementById('size-label');

    elements.angularSizeValue = document.getElementById('angular-size-value');
    elements.angularSizeUnit = document.getElementById('angular-size-unit');
    elements.sizeValue = document.getElementById('size-value');
    elements.sizeUnit = document.getElementById('size-unit');
    elements.distanceValue = document.getElementById('distance-value');
    elements.distanceUnit = document.getElementById('distance-unit');

    elements.distanceSlider = document.getElementById('distance-slider');
    elements.distanceDisplay = document.getElementById('distance-display');
    elements.sizeSlider = document.getElementById('size-slider');
    elements.sizeDisplay = document.getElementById('size-display');

    elements.astroPresets = document.getElementById('astro-presets');
    elements.easterPresets = document.getElementById('easter-presets');
    elements.astroPresetsSection = document.getElementById('astro-presets-section');
    elements.everydayPresetsSection = document.getElementById('everyday-presets-section');
    elements.presetCategory = document.getElementById('preset-category');

    elements.timeControl = document.getElementById('time-control');
    elements.timeSlider = document.getElementById('time-slider');
    elements.timeDisplay = document.getElementById('time-display');
    elements.recessionSlider = document.getElementById('recession-slider');
    elements.moonTimeModeOrbit = document.getElementById('moon-time-mode-orbit');
    elements.moonTimeModeRecession = document.getElementById('moon-time-mode-recession');
    elements.moonTimeOrbitControls = document.getElementById('moon-time-orbit-controls');
    elements.moonTimeRecessionControls = document.getElementById('moon-time-recession-controls');
    elements.moonAngularRange = document.getElementById('moon-angular-range');

    elements.angleWarning = document.getElementById('angle-warning');
    elements.btnResetDefaults = document.getElementById('btn-reset-defaults');
  }

  // ============================================
  // Calculations
  // ============================================

  function calculateAngularSize(diameter, distance) {
    return Model.angularDiameterDeg({ diameterKm: diameter, distanceKm: distance });
  }

  // ============================================
  // Display helpers (units + readable labels)
  // ============================================

  function formatAngleForUi(degrees) {
    const abs = Math.abs(degrees);

    // Prefer readable prime symbols over ASCII ' and ".
    const PRIME = '′';
    const DOUBLE_PRIME = '″';

    if (abs >= 1) {
      return {
        value: degrees.toFixed(2),
        symbol: '°',
        label: 'degrees',
        readoutUnit: '° (degrees)',
        ariaUnit: 'degrees'
      };
    }
    if (abs >= 1 / 60) {
      return {
        value: (degrees * 60).toFixed(1),
        symbol: PRIME,
        label: 'arcmin',
        readoutUnit: `${PRIME} (arcmin)`,
        ariaUnit: 'arcminutes'
      };
    }
    return {
      value: (degrees * 3600).toFixed(1),
      symbol: DOUBLE_PRIME,
      label: 'arcsec',
      readoutUnit: `${DOUBLE_PRIME} (arcsec)`,
      ariaUnit: 'arcseconds'
    };
  }

  function getMoonDistanceAtOrbitAngle(orbitAngleDeg) {
    const phaseRad = orbitAngleDeg * Math.PI / 180;
    const w = (Math.cos(phaseRad) + 1) / 2; // 1 at 0° (perigee), 0 at 180° (apogee)
    return MOON_ORBIT.apogeeKm + w * (MOON_ORBIT.perigeeKm - MOON_ORBIT.apogeeKm);
  }

  function moonTimeMyrFromDistance(distanceKm) {
    const kmPerMyr = MOON_RECESSION_CM_PER_YEAR * 10;
    if (kmPerMyr === 0) return 0;
    return (distanceKm - MOON_DISTANCE_TODAY_KM) / kmPerMyr;
  }

  function setMoonTimeMode(mode) {
    state.moonTimeMode = mode === 'recession' ? 'recession' : 'orbit';

    if (elements.moonTimeOrbitControls) {
      elements.moonTimeOrbitControls.style.display = state.moonTimeMode === 'orbit' ? '' : 'none';
    }
    if (elements.moonTimeRecessionControls) {
      elements.moonTimeRecessionControls.style.display = state.moonTimeMode === 'recession' ? '' : 'none';
    }

    // Keep sliders consistent with current distance.
    if (state.activePreset === 'moon') {
      if (state.moonTimeMode === 'orbit') {
        state.moonOrbitAngle = orbitAngleFromMoonDistance(state.distance);
        if (elements.timeSlider) elements.timeSlider.value = state.moonOrbitAngle;
      } else {
        state.moonRecessionTimeMyr = moonTimeMyrFromDistance(state.distance);
        if (elements.recessionSlider) elements.recessionSlider.value = Math.round(state.moonRecessionTimeMyr / 10) * 10;
      }
      updateMoonTimeDisplay();
    }
  }

  function orbitAngleFromMoonDistance(distanceKm) {
    const denom = (MOON_ORBIT.perigeeKm - MOON_ORBIT.apogeeKm);
    if (denom === 0) return 0;
    const w = (distanceKm - MOON_ORBIT.apogeeKm) / denom;
    const clamped = Math.max(0, Math.min(1, w));
    const cos = 2 * clamped - 1;
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cos))); // 0..π
    return angleRad * 180 / Math.PI; // 0..180 (symmetry is fine for our display)
  }

  // ============================================
  // Formatting
  // ============================================

  function formatDistance(km) {
    const AU = 1.496e8;
    const LY = 9.461e12;

    if (km >= LY * 0.1) {
      const ly = km / LY;
      if (ly >= 1e6) {
        return { value: (ly / 1e6).toPrecision(3), unit: 'million ly' };
      }
      return { value: ly.toPrecision(3), unit: 'light-years' };
    }
    if (km >= AU * 0.1) {
      return { value: (km / AU).toPrecision(3), unit: 'AU' };
    }
    if (km >= 1e6) {
      return { value: (km / 1e6).toPrecision(3), unit: 'million km' };
    }
    if (km >= 1000) {
      return { value: (km / 1000).toPrecision(3), unit: 'thousand km' };
    }
    if (km >= 1) {
      return { value: km.toPrecision(3), unit: 'km' };
    }
    if (km >= 0.001) {
      return { value: (km * 1000).toPrecision(3), unit: 'm' };
    }
    return { value: (km * 100000).toPrecision(3), unit: 'cm' };
  }

  function formatAngle(degrees) {
    if (degrees >= 1) {
      return { value: degrees.toFixed(2), unit: 'degrees' };
    }
    if (degrees >= 1/60) {
      return { value: (degrees * 60).toFixed(1), unit: 'arcminutes' };
    }
    return { value: (degrees * 3600).toFixed(1), unit: 'arcseconds' };
  }

  function formatAngleDisplay(degrees) {
    // Keep a legacy-compatible wrapper (value + unit string) for code paths that
    // still expect this shape.
    const ui = formatAngleForUi(degrees);
    return { value: ui.value, unit: ui.symbol };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function announceStatus(message) {
    const region = document.getElementById('status-announce');
    if (!region) return;
    region.textContent = message;
  }

  function formatShort(km) {
    const f = formatDistance(km);
    // Abbreviate units
    const abbrev = {
      'million km': 'Mkm',
      'thousand km': 'kkm',
      'million ly': 'Mly',
      'light-years': 'ly',
      'AU': 'AU',
      'km': 'km',
      'm': 'm',
      'cm': 'cm'
    };
    return `${f.value} ${abbrev[f.unit] || f.unit}`;
  }

  // ============================================
  // Visualization
  // ============================================

  function updateVisualization() {
    const angularDeg = calculateAngularSize(state.diameter, state.distance);

    // SVG coordinates
    const eyeX = 80;
    const eyeY = 150;
    const maxObjectX = 720;
    const minObjectX = 200;

    // Map distance to visual position (logarithmic)
    const logDist = Math.log10(state.distance);
    const logMin = Math.log10(DISTANCE_MIN);
    const logMax = Math.log10(DISTANCE_MAX);
    const distFraction = (logDist - logMin) / (logMax - logMin);
    const objectX = minObjectX + distFraction * (maxObjectX - minObjectX);

    // Visual angle is intentionally magnified for readability, while the numeric
    // readout remains exact.
    const VISUAL_ANGLE_MAGNIFICATION = 8;

    // Update object position
    elements.objectCircle.setAttribute('cx', objectX);

    // Update angle lines
    const angleRad = angularDeg * (Math.PI / 180);
    const lineLength = objectX - eyeX;
    const halfAngle = angleRad / 2;
    const halfAngleCapped = Math.min(halfAngle, Math.PI / 2 - 0.01);
    const displayHalfAngle = Math.atan(Math.tan(halfAngleCapped) * VISUAL_ANGLE_MAGNIFICATION);
    const displayHalfAngleCapped = Math.min(displayHalfAngle, Math.PI / 2 - 0.01);

    elements.angleLineTop.setAttribute('x2', objectX);
    const rawOffset = lineLength * Math.tan(displayHalfAngleCapped);
    const maxOffset = Math.min(130, eyeY - 8, 300 - eyeY - 8);
    const offset = Math.max(0, Math.min(maxOffset, rawOffset));
    const rawTopY = eyeY - offset;
    const rawBottomY = eyeY + offset;

    elements.angleLineTop.setAttribute('y1', eyeY);
    elements.angleLineTop.setAttribute('y2', clamp(rawTopY, 0, 300));

    elements.angleLineBottom.setAttribute('x2', objectX);
    elements.angleLineBottom.setAttribute('y1', eyeY);
    elements.angleLineBottom.setAttribute('y2', clamp(rawBottomY, 0, 300));

    // Update angle arc
    const arcRadius = 40;
    const arcAngle = Math.min(Math.atan(offset / Math.max(1, lineLength)), Math.PI / 4); // Cap arc size
    const arcTopY = eyeY - arcRadius * Math.sin(arcAngle);
    const arcTopX = eyeX + arcRadius * Math.cos(arcAngle);
    const arcBottomY = eyeY + arcRadius * Math.sin(arcAngle);
    const arcBottomX = eyeX + arcRadius * Math.cos(arcAngle);

    const largeArc = arcAngle > Math.PI / 2 ? 1 : 0;
    const arcPath = `M ${arcTopX} ${arcTopY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${arcBottomX} ${arcBottomY}`;
    elements.angleArc.setAttribute('d', arcPath);

    // Update angle text
    const angUi = formatAngleForUi(angularDeg);
    elements.angleText.textContent = `${angUi.value}${angUi.symbol}`;
    elements.angleText.setAttribute('x', eyeX + arcRadius + 10);
    elements.angleText.setAttribute('y', eyeY + 5);

    // Update distance indicator
    const distFormatted = formatDistance(state.distance);
    elements.distanceLabel.textContent = `${distFormatted.value} ${distFormatted.unit}`;

    // Update size indicator
    // Use the same offset so the object and rays stay aligned visually.
    const visualRadius = Math.max(1, offset);
    elements.objectCircle.setAttribute('r', visualRadius);
    elements.sizeLine.setAttribute('x1', objectX);
    elements.sizeLine.setAttribute('x2', objectX);
    elements.sizeLine.setAttribute('y1', eyeY - visualRadius);
    elements.sizeLine.setAttribute('y2', eyeY + visualRadius);

    const sizeFormatted = formatDistance(state.diameter);
    elements.sizeLabel.setAttribute('x', objectX + 10);
    elements.sizeLabel.textContent = `${sizeFormatted.value} ${sizeFormatted.unit}`;

    // Update distance indicator line endpoints
    const distLine = document.querySelector('#distance-indicator line');
    const distTicks = document.querySelectorAll('#distance-indicator line');
    distTicks[0].setAttribute('x2', objectX);
    distTicks[1].setAttribute('x1', eyeX + 20);
    distTicks[1].setAttribute('x2', eyeX + 20);
    distTicks[2].setAttribute('x1', objectX);
    distTicks[2].setAttribute('x2', objectX);
  }

  function updateReadouts() {
    const angularDeg = calculateAngularSize(state.diameter, state.distance);

    // Angular size
    const angUi = formatAngleForUi(angularDeg);
    elements.angularSizeValue.textContent = angUi.value;
    elements.angularSizeUnit.textContent = angUi.readoutUnit;

    if (elements.angleWarning) {
      if (state.diameter >= state.distance) {
        elements.angleWarning.textContent =
          'You are "inside" the object (D ≥ d). Angular size saturates near 180°.';
        elements.angleWarning.style.display = 'block';
      } else {
        elements.angleWarning.textContent = '';
        elements.angleWarning.style.display = 'none';
      }
    }

    // Physical size
    const sizeF = formatDistance(state.diameter);
    elements.sizeValue.textContent = sizeF.value;
    elements.sizeUnit.textContent = sizeF.unit;

    // Distance
    const distF = formatDistance(state.distance);
    elements.distanceValue.textContent = distF.value;
    elements.distanceUnit.textContent = distF.unit;

    // Slider displays
    elements.distanceDisplay.textContent = formatShort(state.distance);
    elements.sizeDisplay.textContent = formatShort(state.diameter);

    // Update ARIA for celestial object
    const objectCircle = document.getElementById('object-circle');
    if (objectCircle) {
      const preset = PRESETS[state.activePreset];
      const name = preset ? preset.name : 'Object';
      const distF = formatDistance(state.distance);
      objectCircle.setAttribute('aria-label',
        `${name} at ${distF.value} ${distF.unit}, angular size ${angUi.value} ${angUi.ariaUnit}`);
    }
  }

  function updateObjectAppearance() {
    const preset = PRESETS[state.activePreset];
    const color = preset ? preset.color : 'object';

    // Update gradient/color based on object type
    switch (color) {
      case 'sun':
        elements.objectCircle.setAttribute('fill', 'url(#sunGradient)');
        break;
      case 'moon':
        elements.objectCircle.setAttribute('fill', 'url(#moonGradient)');
        break;
      case 'mars':
        elements.objectCircle.setAttribute('fill', 'var(--mars-red)');
        break;
      case 'planet':
        elements.objectCircle.setAttribute('fill', 'var(--jupiter-tan)');
        break;
      case 'galaxy':
        elements.objectCircle.setAttribute('fill', 'var(--ice-blue)');
        break;
      default:
        elements.objectCircle.setAttribute('fill', 'var(--text-secondary)');
    }
  }

  // ============================================
  // Slider Logic
  // ============================================

  function logSliderToValue(sliderVal, minVal, maxVal) {
    const minLog = Math.log10(minVal);
    const maxLog = Math.log10(maxVal);
    const fraction = sliderVal / 1000;
    return Math.pow(10, minLog + fraction * (maxLog - minLog));
  }

  function valueToLogSlider(value, minVal, maxVal) {
    const minLog = Math.log10(minVal);
    const maxLog = Math.log10(maxVal);
    const logVal = Math.log10(value);
    return Math.round(((logVal - minLog) / (maxLog - minLog)) * 1000);
  }

  function setupSliders() {
    // Distance slider
    elements.distanceSlider.addEventListener('input', () => {
      state.distance = logSliderToValue(
        parseFloat(elements.distanceSlider.value),
        DISTANCE_MIN,
        DISTANCE_MAX
      );
      if (state.activePreset === 'moon') {
        if (state.moonTimeMode === 'orbit') {
          state.moonOrbitAngle = orbitAngleFromMoonDistance(state.distance);
          if (elements.timeSlider) elements.timeSlider.value = state.moonOrbitAngle;
        } else {
          state.moonRecessionTimeMyr = moonTimeMyrFromDistance(state.distance);
          if (elements.recessionSlider) elements.recessionSlider.value = Math.round(state.moonRecessionTimeMyr / 10) * 10;
        }
        updateMoonTimeDisplay();
        update();
        return;
      }

      state.activePreset = null;
      clearPresetSelection();
      update();
    });

    // Size slider
    elements.sizeSlider.addEventListener('input', () => {
      state.diameter = logSliderToValue(
        parseFloat(elements.sizeSlider.value),
        SIZE_MIN,
        SIZE_MAX
      );
      state.activePreset = null;
      clearPresetSelection();
      update();
    });

    // Time slider (Moon orbit distance variation)
    if (elements.timeSlider) elements.timeSlider.addEventListener('input', () => {
      if (state.activePreset !== 'moon') return;
      if (state.moonTimeMode !== 'orbit') return;
      state.moonOrbitAngle = parseFloat(elements.timeSlider.value);
      state.distance = getMoonDistanceAtOrbitAngle(state.moonOrbitAngle);
      updateMoonTimeDisplay();

      // Update distance slider to match
      elements.distanceSlider.value = valueToLogSlider(state.distance, DISTANCE_MIN, DISTANCE_MAX);

      update();
    });

    // Recession slider (Moon only; toy linear model)
    if (elements.recessionSlider) elements.recessionSlider.addEventListener('input', () => {
      if (state.activePreset !== 'moon') return;
      if (state.moonTimeMode !== 'recession') return;
      state.moonRecessionTimeMyr = parseFloat(elements.recessionSlider.value);
      state.distance = Model.moonDistanceKmFromRecession({
        distanceTodayKm: MOON_DISTANCE_TODAY_KM,
        recessionCmPerYr: MOON_RECESSION_CM_PER_YEAR,
        timeMyr: state.moonRecessionTimeMyr,
      });

      // Update distance slider to match
      elements.distanceSlider.value = valueToLogSlider(state.distance, DISTANCE_MIN, DISTANCE_MAX);

      updateMoonTimeDisplay();
      update();
    });
  }

  function updateMoonTimeDisplay() {
    if (!elements.timeDisplay) return;

    if (state.moonTimeMode === 'recession') {
      const t = Math.round(state.moonRecessionTimeMyr);
      if (Math.abs(t) < 1) {
        elements.timeDisplay.textContent = 'Today';
      } else if (t < 0) {
        elements.timeDisplay.textContent = `${Math.abs(t)} Myr ago`;
      } else {
        elements.timeDisplay.textContent = `+${t} Myr`;
      }
      return;
    }

    const angle = state.moonOrbitAngle;
    const delta = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180);
    if (delta(angle, 0) <= 10) elements.timeDisplay.textContent = 'Perigee';
    else if (delta(angle, 180) <= 10) elements.timeDisplay.textContent = 'Apogee';
    else elements.timeDisplay.textContent = `${Math.round(angle)}°`;
  }

  function syncSlidersToState() {
    elements.distanceSlider.value = valueToLogSlider(state.distance, DISTANCE_MIN, DISTANCE_MAX);
    elements.sizeSlider.value = valueToLogSlider(state.diameter, SIZE_MIN, SIZE_MAX);
  }

  // ============================================
  // Presets
  // ============================================

  function setupPresets() {
    const astroContainer = elements.astroPresets;
    const easterContainer = elements.easterPresets;

    for (const [key, preset] of Object.entries(PRESETS)) {
      const btn = document.createElement('button');
      btn.className = `preset-btn ${preset.category === 'everyday' ? 'easter-egg' : ''}`;
      btn.textContent = preset.name;
      btn.dataset.preset = key;
      btn.title = preset.description;

      btn.addEventListener('click', () => selectPreset(key));

      if (preset.category === 'everyday') {
        easterContainer.appendChild(btn);
      } else {
        astroContainer.appendChild(btn);
      }
    }

    // Mark initial preset as active
    updatePresetSelection();
  }

  function selectPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;

    state.activePreset = key;
    state.diameter = preset.diameter;
    state.distance = preset.distance;
    state.moonOrbitAngle = 0;
    state.moonRecessionTimeMyr = 0;

    if (elements.presetCategory) {
      elements.presetCategory.value = preset.category === 'everyday' ? 'everyday' : 'astronomical';
      updatePresetCategoryVisibility();
    }

    // Show/hide time control for Moon
    if (elements.timeControl) elements.timeControl.style.display = preset.timeEvolution ? 'block' : 'none';
    if (preset.timeEvolution) {
      // Default to orbit mode on selection (students usually think in perigee/apogee first).
      if (elements.moonTimeModeOrbit) elements.moonTimeModeOrbit.checked = true;
      if (elements.moonTimeModeRecession) elements.moonTimeModeRecession.checked = false;
      setMoonTimeMode('orbit');

      if (elements.moonAngularRange) {
        elements.moonAngularRange.textContent =
          `Range: ${MOON_ORBIT_MIN_ANGULAR_SIZE_DEG.toFixed(2)}°–${MOON_ORBIT_MAX_ANGULAR_SIZE_DEG.toFixed(2)}°`;
      }
    }

    syncSlidersToState();
    updatePresetSelection();
    updateObjectAppearance();
    update();

    const angularDeg = calculateAngularSize(state.diameter, state.distance);
    const angUi = formatAngleForUi(angularDeg);
    announceStatus(`${preset.name}: angular size ${angUi.value} ${angUi.ariaUnit}`);
  }

  function updatePresetSelection() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === state.activePreset);
    });
  }

  function clearPresetSelection() {
    state.activePreset = null;
    if (elements.timeControl) elements.timeControl.style.display = 'none';
    updatePresetSelection();
    updateObjectAppearance();
  }

  function updatePresetCategoryVisibility() {
    if (!elements.presetCategory || !elements.astroPresetsSection || !elements.everydayPresetsSection) return;
    const mode = elements.presetCategory.value;
    elements.astroPresetsSection.style.display = mode === 'astronomical' ? '' : 'none';
    elements.everydayPresetsSection.style.display = mode === 'everyday' ? '' : 'none';
  }

  function setupPresetCategory() {
    if (!elements.presetCategory) return;
    elements.presetCategory.addEventListener('change', updatePresetCategoryVisibility);
    updatePresetCategoryVisibility();
  }

  function setupMoonTimeMode() {
    if (elements.moonTimeModeOrbit) {
      elements.moonTimeModeOrbit.addEventListener('change', () => {
        if (elements.moonTimeModeOrbit.checked) {
          setMoonTimeMode('orbit');
          update();
        }
      });
    }

    if (elements.moonTimeModeRecession) {
      elements.moonTimeModeRecession.addEventListener('change', () => {
        if (elements.moonTimeModeRecession.checked) {
          // When switching to recession mode, treat the current distance as the selected time.
          state.moonRecessionTimeMyr = moonTimeMyrFromDistance(state.distance);
          if (elements.recessionSlider) {
            elements.recessionSlider.value = Math.round(state.moonRecessionTimeMyr / 10) * 10;
            state.moonRecessionTimeMyr = parseFloat(elements.recessionSlider.value);
          }
          setMoonTimeMode('recession');
          update();
        }
      });
    }
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      // Only handle if not focused on a slider
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'TEXTAREA' || tag === 'A') return;
        if (event.target.isContentEditable) return;
      }

      const logStep = event.shiftKey ? 0.02 : 0.1;  // Finer control with Shift
      let distanceMultiplier = 1;
      let sizeMultiplier = 1;
      let presetKey = null;

      switch (event.key) {
        case 'ArrowLeft':
          distanceMultiplier = Math.pow(10, -logStep);
          break;
        case 'ArrowRight':
          distanceMultiplier = Math.pow(10, logStep);
          break;
        case 'ArrowUp':
          sizeMultiplier = Math.pow(10, logStep);
          break;
        case 'ArrowDown':
          sizeMultiplier = Math.pow(10, -logStep);
          break;
        case '1':
          presetKey = 'sun';
          break;
        case '2':
          presetKey = 'moon';
          break;
        case '3':
          presetKey = 'jupiter';
          break;
        case '4':
          presetKey = 'venus';
          break;
        case '5':
          presetKey = 'mars';
          break;
        case '6':
          presetKey = 'andromeda';
          break;
        default:
          return;
      }

      event.preventDefault();

      if (presetKey) {
        selectPreset(presetKey);
      } else {
        if (distanceMultiplier !== 1) {
          state.distance = Math.max(DISTANCE_MIN, Math.min(DISTANCE_MAX,
            state.distance * distanceMultiplier));
          elements.distanceSlider.value = valueToLogSlider(state.distance, DISTANCE_MIN, DISTANCE_MAX);
          clearPresetSelection();
        }
        if (sizeMultiplier !== 1) {
          state.diameter = Math.max(SIZE_MIN, Math.min(SIZE_MAX,
            state.diameter * sizeMultiplier));
          elements.sizeSlider.value = valueToLogSlider(state.diameter, SIZE_MIN, SIZE_MAX);
          clearPresetSelection();
        }
        update();
      }
    });
  }

  // ============================================
  // Main Update
  // ============================================

  function update() {
    updateVisualization();
    updateReadouts();
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupSliders();
    setupPresets();
    setupPresetCategory();
    setupMoonTimeMode();
    setupKeyboard();

    if (elements.btnResetDefaults) {
      elements.btnResetDefaults.addEventListener('click', () => {
        selectPreset('sun');
      });
    }

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      const starfield = Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
      starfield.start();
    }

    // Set initial state
    selectPreset('sun');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

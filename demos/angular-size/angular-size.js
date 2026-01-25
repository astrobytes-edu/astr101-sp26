/**
 * Angular Size Demo
 * Interactive demonstration of angular size = physical size / distance
 */

(function() {
  'use strict';

  // ============================================
  // Preset Data
  // ============================================

  const PRESETS = {
    // Astronomical objects
    sun: {
      name: 'Sun',
      diameter: 1.392e6,  // km
      distance: 1.496e8,  // km (1 AU)
      category: 'astronomical',
      color: 'sun',
      description: 'Our star'
    },
    moon: {
      name: 'Moon (Today)',
      diameter: 3474,     // km
      distance: 384400,   // km
      category: 'astronomical',
      color: 'moon',
      description: 'Earth\'s satellite',
      timeEvolution: true  // Enable time slider
    },
    jupiter: {
      name: 'Jupiter',
      diameter: 139820,   // km
      distance: 6.287e8,  // km (opposition)
      category: 'astronomical',
      color: 'planet',
      description: 'At opposition'
    },
    venus: {
      name: 'Venus',
      diameter: 12104,    // km
      distance: 4.14e7,   // km (closest approach)
      category: 'astronomical',
      color: 'planet',
      description: 'At closest approach'
    },
    mars: {
      name: 'Mars',
      diameter: 6779,     // km
      distance: 5.46e7,   // km (opposition)
      category: 'astronomical',
      color: 'mars',
      description: 'At opposition'
    },
    andromeda: {
      name: 'Andromeda',
      diameter: 2.2e18,   // km (~220,000 ly)
      distance: 2.4e19,   // km (~2.5 million ly)
      category: 'astronomical',
      color: 'galaxy',
      description: 'Nearest large galaxy'
    },

    // Everyday objects
    basketball: {
      name: 'Basketball @ 10m',
      diameter: 0.000239, // 23.9 cm in km
      distance: 0.01,     // 10m in km
      category: 'everyday',
      color: 'object',
      description: 'Standard basketball'
    },
    soccerball: {
      name: 'Soccer ball @ 20m',
      diameter: 0.00022,  // 22 cm in km
      distance: 0.02,     // 20m in km
      category: 'everyday',
      color: 'object',
      description: 'Regulation soccer ball'
    },
    quarter: {
      name: 'Quarter @ arm\'s length',
      diameter: 0.0000243, // 24.3 mm in km
      distance: 0.0007,    // 70cm arm's length
      category: 'everyday',
      color: 'object',
      description: 'US quarter coin'
    },
    thumb: {
      name: 'Your thumb',
      diameter: 0.00002,   // ~2cm thumb width
      distance: 0.0007,    // ~70cm arm's length
      category: 'everyday',
      color: 'object',
      description: 'Thumb at arm\'s length ≈ 2°'
    },
    airplane: {
      name: 'Jet @ 10km',
      diameter: 0.06,      // ~60m wingspan
      distance: 10,        // 10 km altitude
      category: 'everyday',
      color: 'object',
      description: 'Commercial jet overhead'
    },
    iss: {
      name: 'ISS overhead',
      diameter: 0.000109,  // 109m in km
      distance: 420,       // 420 km altitude
      category: 'everyday',
      color: 'object',
      description: 'International Space Station'
    }
  };

  // ============================================
  // State
  // ============================================

  const state = {
    diameter: PRESETS.sun.diameter,
    distance: PRESETS.sun.distance,
    activePreset: 'sun',
    moonOrbitAngle: 0 // Degrees (for Moon orbit distance variation)
  };

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
    elements.moonAngularRange = document.getElementById('moon-angular-range');

    elements.angleWarning = document.getElementById('angle-warning');
  }

  // ============================================
  // Calculations
  // ============================================

  function calculateAngularSize(diameter, distance) {
    if (distance <= 0) return 180;
    if (diameter <= 0) return 0;
    // Exact angular diameter in radians, robust for all regimes.
    const radians = 2 * Math.atan(diameter / (2 * distance));
    return Math.min(180, radians * (180 / Math.PI));
  }

  function getMoonDistanceAtOrbitAngle(orbitAngleDeg) {
    const phaseRad = orbitAngleDeg * Math.PI / 180;
    const w = (Math.cos(phaseRad) + 1) / 2; // 1 at 0° (perigee), 0 at 180° (apogee)
    return MOON_ORBIT.apogeeKm + w * (MOON_ORBIT.perigeeKm - MOON_ORBIT.apogeeKm);
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

    // Map size to visual radius (logarithmic)
    const logSize = Math.log10(state.diameter);
    const logSizeMin = Math.log10(SIZE_MIN);
    const logSizeMax = Math.log10(SIZE_MAX);
    const sizeFraction = (logSize - logSizeMin) / (logSizeMax - logSizeMin);
    const visualRadius = 5 + sizeFraction * 60; // 5px to 65px

    // Update object position and size
    elements.objectCircle.setAttribute('cx', objectX);
    elements.objectCircle.setAttribute('r', visualRadius);

    // Update angle lines
    const angleRad = angularDeg * (Math.PI / 180);
    const lineLength = objectX - eyeX;
    const halfAngle = angleRad / 2;
    const halfAngleCapped = Math.min(halfAngle, Math.PI / 2 - 0.01);

    elements.angleLineTop.setAttribute('x2', objectX);
    elements.angleLineTop.setAttribute('y1', eyeY);
    elements.angleLineTop.setAttribute('y2', eyeY - lineLength * Math.tan(halfAngleCapped));

    elements.angleLineBottom.setAttribute('x2', objectX);
    elements.angleLineBottom.setAttribute('y1', eyeY);
    elements.angleLineBottom.setAttribute('y2', eyeY + lineLength * Math.tan(halfAngleCapped));

    // Update angle arc
    const arcRadius = 40;
    const arcAngle = Math.min(halfAngle, Math.PI / 4); // Cap arc size
    const arcTopY = eyeY - arcRadius * Math.sin(arcAngle);
    const arcTopX = eyeX + arcRadius * Math.cos(arcAngle);
    const arcBottomY = eyeY + arcRadius * Math.sin(arcAngle);
    const arcBottomX = eyeX + arcRadius * Math.cos(arcAngle);

    const largeArc = arcAngle > Math.PI / 2 ? 1 : 0;
    const arcPath = `M ${arcTopX} ${arcTopY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${arcBottomX} ${arcBottomY}`;
    elements.angleArc.setAttribute('d', arcPath);

    // Update angle text
    elements.angleText.textContent = `${angularDeg.toFixed(2)}°`;
    elements.angleText.setAttribute('x', eyeX + arcRadius + 10);
    elements.angleText.setAttribute('y', eyeY + 5);

    // Update distance indicator
    const distFormatted = formatDistance(state.distance);
    elements.distanceLabel.textContent = `${distFormatted.value} ${distFormatted.unit}`;

    // Update size indicator
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
    elements.angularSizeValue.textContent = angularDeg.toFixed(2);
    elements.angularSizeUnit.textContent = 'degrees';

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
        `${name} at ${distF.value} ${distF.unit}, angular size ${angularDeg.toFixed(2)} degrees`);
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
        elements.objectCircle.setAttribute('fill', '#d9534f');
        break;
      case 'planet':
        elements.objectCircle.setAttribute('fill', '#d4a574');
        break;
      case 'galaxy':
        elements.objectCircle.setAttribute('fill', '#8899bb');
        break;
      default:
        elements.objectCircle.setAttribute('fill', '#a0a0b0');
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
        state.moonOrbitAngle = orbitAngleFromMoonDistance(state.distance);
        elements.timeSlider.value = state.moonOrbitAngle;
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
    elements.timeSlider.addEventListener('input', () => {
      state.moonOrbitAngle = parseFloat(elements.timeSlider.value);
      state.distance = getMoonDistanceAtOrbitAngle(state.moonOrbitAngle);
      updateMoonTimeDisplay();

      // Update distance slider to match
      elements.distanceSlider.value = valueToLogSlider(state.distance, DISTANCE_MIN, DISTANCE_MAX);

      update();
    });
  }

  function updateMoonTimeDisplay() {
    if (!elements.timeDisplay) return;
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

    if (elements.presetCategory) {
      elements.presetCategory.value = preset.category === 'everyday' ? 'everyday' : 'astronomical';
      updatePresetCategoryVisibility();
    }

    // Show/hide time control for Moon
    elements.timeControl.style.display = preset.timeEvolution ? 'block' : 'none';
    if (preset.timeEvolution) {
      state.moonOrbitAngle = orbitAngleFromMoonDistance(state.distance);
      elements.timeSlider.value = state.moonOrbitAngle;
      updateMoonTimeDisplay();
      if (elements.moonAngularRange) {
        elements.moonAngularRange.textContent =
          `Range: ${MOON_ORBIT_MIN_ANGULAR_SIZE_DEG.toFixed(2)}°–${MOON_ORBIT_MAX_ANGULAR_SIZE_DEG.toFixed(2)}°`;
      }
    }

    syncSlidersToState();
    updatePresetSelection();
    updateObjectAppearance();
    update();
  }

  function updatePresetSelection() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === state.activePreset);
    });
  }

  function clearPresetSelection() {
    state.activePreset = null;
    elements.timeControl.style.display = 'none';
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

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      // Only handle if not focused on a slider
      if (event.target.tagName === 'INPUT') return;

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
    setupKeyboard();

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

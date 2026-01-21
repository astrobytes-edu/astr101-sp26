/**
 * Telescope Resolution Sandbox
 * Interactive demonstration of diffraction limits and angular resolution
 *
 * Physics (CGS units):
 * - Diffraction limit: theta = 1.22 * lambda / D (radians)
 * - theta (arcsec) = 251643 * lambda(cm) / D(cm)
 * - Rayleigh criterion: resolved if separation > theta_diffraction
 * - Airy disk intensity: I(x) = (2*J1(x)/x)^2 where x = pi*D*sin(theta)/lambda
 */

(function() {
  'use strict';

  // ============================================
  // Physical Constants (CGS)
  // ============================================

  const CONSTANTS = {
    // Conversion factors
    RAD_TO_ARCSEC: 206265,     // radians to arcseconds
    ARCSEC_TO_RAD: 4.848e-6,   // arcseconds to radians
    M_TO_CM: 100,              // meters to cm
    NM_TO_CM: 1e-7,            // nanometers to cm

    // Diffraction coefficient (in convenient units)
    // theta(arcsec) = 1.22 * 206264.806 * lambda(cm) / D(cm)
    // Exact: 1.22 * 206264.806 = 251643.1
    DIFF_COEFF: 251643.1,

    // Typical Strehl ratio for good adaptive optics
    AO_STREHL: 0.6
  };

  // ============================================
  // Physics Functions
  // ============================================

  /**
   * Calculate diffraction limit in arcseconds
   * theta = 1.22 * lambda / D (radians)
   * theta(arcsec) = 2.52e5 * lambda(cm) / D(cm)
   *
   * @param {number} lambda_cm - Wavelength in cm
   * @param {number} D_cm - Aperture diameter in cm
   * @returns {number} Angular resolution in arcseconds
   */
  function diffractionLimitArcsec(lambda_cm, D_cm) {
    return CONSTANTS.DIFF_COEFF * lambda_cm / D_cm;
  }

  /**
   * Calculate effective resolution including atmospheric seeing
   *
   * For space telescopes (seeing = 0): resolution = diffraction limit
   * For ground without AO: resolution = max(diffraction_limit, seeing)
   * For ground with AO: resolution combines both quadratically with Strehl improvement
   *
   * @param {number} theta_diff - Diffraction limit in arcsec
   * @param {number} seeing - Atmospheric seeing in arcsec (0 for space)
   * @param {boolean} aoEnabled - Whether adaptive optics is enabled
   * @returns {number} Effective resolution in arcseconds
   */
  function effectiveResolution(theta_diff, seeing, aoEnabled) {
    if (seeing === 0) {
      // Space telescope - diffraction limited
      return theta_diff;
    }

    if (!aoEnabled) {
      // Ground without AO - seeing limited unless telescope is small
      return Math.max(theta_diff, seeing);
    }

    // Ground with AO - partial correction
    // AO reduces the seeing contribution by (1 - Strehl)
    const correctedSeeing = seeing * (1 - CONSTANTS.AO_STREHL);
    // Combine in quadrature
    return Math.sqrt(theta_diff * theta_diff + correctedSeeing * correctedSeeing);
  }

  /**
   * Determine if a binary pair is resolved according to Rayleigh criterion
   * @param {number} separation - Binary separation in arcsec
   * @param {number} resolution - Effective resolution in arcsec
   * @returns {string} 'resolved', 'marginal', or 'unresolved'
   */
  function resolutionStatus(separation, resolution) {
    const ratio = separation / resolution;
    if (ratio > 1.5) return 'resolved';
    if (ratio > 0.8) return 'marginal';
    return 'unresolved';
  }

  /**
   * Bessel function J1(x) approximation
   * Used for Airy disk pattern
   * @param {number} x - Input value
   * @returns {number} J1(x)
   */
  function besselJ1(x) {
    if (Math.abs(x) < 1e-10) return 0;

    if (Math.abs(x) < 8) {
      // Polynomial approximation for small x
      const y = x * x;
      const ans1 = x * (72362614232.0 + y * (-7895059235.0 +
        y * (242396853.1 + y * (-2972611.439 +
        y * (15704.48260 + y * (-30.16036606))))));
      const ans2 = 144725228442.0 + y * (2300535178.0 +
        y * (18583304.74 + y * (99447.43394 +
        y * (376.9991397 + y * 1.0))));
      return ans1 / ans2;
    } else {
      // Asymptotic approximation for large x
      const ax = Math.abs(x);
      const z = 8.0 / ax;
      const y = z * z;
      const xx = ax - 2.356194491;  // 3*pi/4

      const ans1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 +
        y * (0.2457520174e-5 + y * (-0.240337019e-6))));
      const ans2 = 0.04687499995 + y * (-0.2002690873e-3 +
        y * (0.8449199096e-5 + y * (-0.88228987e-6 +
        y * 0.105787412e-6)));

      const ans = Math.sqrt(0.636619772 / ax) *
        (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
      return x < 0 ? -ans : ans;
    }
  }

  /**
   * Calculate Airy disk intensity pattern
   * I(x) = (2*J1(x)/x)^2
   * @param {number} x - Normalized radial coordinate (pi*D*sin(theta)/lambda)
   * @returns {number} Normalized intensity (0 to 1)
   */
  function airyIntensity(x) {
    if (Math.abs(x) < 1e-10) return 1.0;  // Central maximum
    const j1 = besselJ1(x);
    const term = 2 * j1 / x;
    return term * term;
  }

  // ============================================
  // State
  // ============================================

  const state = {
    mode: '101',              // '101' | '201'
    aperture: 2.4,            // meters (Hubble default)
    lambda_cm: 5.5e-5,        // cm (550 nm visible)
    binarySeparation: 0.1,    // arcseconds
    seeing: 0,                // arcseconds (0 = space)
    aoEnabled: false,
    atmosphereEnabled: false,
    compareEnabled: false,
    compareAperture: 10,      // meters (Keck for comparison)

    // Computed values (cached)
    diffLimit: 0,
    effectiveRes: 0,
    status: 'resolved',

    // Display
    currentPreset: 'Hubble Space Telescope'
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // Canvases
      resolutionCanvas: document.getElementById('resolution-canvas'),
      compareCanvas: document.getElementById('compare-canvas'),

      // Panels
      mainViz: document.getElementById('main-viz'),
      primaryPanel: document.getElementById('primary-panel'),
      comparePanel: document.getElementById('compare-panel'),

      // Status displays
      resolutionStatus: document.getElementById('resolution-status'),
      compareStatus: document.getElementById('compare-status'),
      telescopeNameDisplay: document.getElementById('telescope-name-display'),
      compareNameDisplay: document.getElementById('compare-name-display'),

      // Readouts
      diffLimitReadout: document.getElementById('diff-limit-readout'),
      effResReadout: document.getElementById('eff-res-readout'),
      separationReadout: document.getElementById('separation-readout'),
      apertureReadout: document.getElementById('aperture-readout'),

      // Mode buttons
      btn101Mode: document.getElementById('btn-101-mode'),
      btn201Mode: document.getElementById('btn-201-mode'),

      // Sliders
      apertureSlider: document.getElementById('aperture-slider'),
      apertureDisplay: document.getElementById('aperture-display'),
      binarySlider: document.getElementById('binary-slider'),
      binaryDisplay: document.getElementById('binary-display'),
      seeingSlider: document.getElementById('seeing-slider'),
      seeingDisplay: document.getElementById('seeing-display'),
      seeingControl: document.getElementById('seeing-control'),

      // Wavelength buttons
      wavelengthBtns: document.querySelectorAll('.wavelength-btn'),
      wavelengthDisplay: document.getElementById('wavelength-display'),

      // Toggles
      toggleAtmosphere: document.getElementById('toggle-atmosphere'),
      toggleAo: document.getElementById('toggle-ao'),
      toggleCompare: document.getElementById('toggle-compare'),
      compareTelescope: document.getElementById('compare-telescope'),

      // Presets
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Insight box formulas
      formulaRayleigh: document.getElementById('formula-rayleigh'),
      formulaAiry: document.getElementById('formula-airy'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }

  // ============================================
  // Rendering - Airy Disk Visualization
  // ============================================

  /**
   * Draw simulated telescope view with Airy disk pattern
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {number} resolution - Angular resolution in arcsec
   * @param {number} separation - Binary separation in arcsec
   * @param {string} label - Telescope label
   */
  function drawTelescopeView(ctx, width, height, resolution, separation, label) {
    // Clear canvas
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, width, height);

    // Draw faint stars in background
    drawBackgroundStars(ctx, width, height);

    // Scale: map resolution to pixel size
    // Use 30 pixels per resolution element as base scale
    const pixelsPerArcsec = 30 / Math.max(resolution, 0.01);
    const centerX = width / 2;
    const centerY = height / 2;

    // Binary star positions (offset from center)
    const offsetPixels = (separation / 2) * pixelsPerArcsec;
    const star1X = centerX - offsetPixels;
    const star2X = centerX + offsetPixels;

    // Airy disk radius (first null is at x = 3.83)
    // In pixels: R = 3.83 * lambda / (pi * D) scaled appropriately
    // Simplified: radius proportional to resolution
    const airyRadius = resolution * pixelsPerArcsec * 1.22;

    // Draw Airy patterns for both stars
    drawAiryDisk(ctx, star1X, centerY, airyRadius, '#ffffff');
    drawAiryDisk(ctx, star2X, centerY, airyRadius, '#ffffff');

    // Draw scale bar
    drawScaleBar(ctx, width, height, pixelsPerArcsec, resolution);

    // Draw separation indicator
    if (separation > 0.001) {
      drawSeparationIndicator(ctx, star1X, star2X, centerY, separation);
    }
  }

  /**
   * Draw faint background stars
   */
  function drawBackgroundStars(ctx, width, height) {
    ctx.save();
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const brightness = Math.random() * 0.3 + 0.1;
      const size = Math.random() * 1.5 + 0.5;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 255, ${brightness})`;
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Draw an Airy disk diffraction pattern
   */
  function drawAiryDisk(ctx, x, y, radius, color) {
    // Parse color to get RGB values
    const r = 255, g = 255, b = 255;

    // Draw the Airy pattern using radial sampling
    const maxRadius = radius * 4;  // Extend to show rings
    const numRings = 60;

    for (let i = numRings; i >= 0; i--) {
      const currentRadius = (i / numRings) * maxRadius;
      // x value for Airy function: normalized to first null at x=3.83
      const airyX = (currentRadius / radius) * 3.83;
      const intensity = airyIntensity(airyX);

      // Boost central brightness
      const displayIntensity = Math.pow(intensity, 0.5);

      ctx.beginPath();
      ctx.arc(x, y, currentRadius, 0, Math.PI * 2);

      if (i === numRings) {
        // Outer edge - blend to background
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${displayIntensity * 0.3})`;
      } else {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${displayIntensity * 0.9})`;
      }
      ctx.fill();
    }

    // Add glow effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(100, 100, 200, 0)');

    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  /**
   * Draw scale bar showing angular scale
   */
  function drawScaleBar(ctx, width, height, pixelsPerArcsec, resolution) {
    const barY = height - 30;

    // Choose appropriate scale bar length
    let scaleArcsec = resolution;  // Start with resolution element
    if (scaleArcsec < 0.1) scaleArcsec = 0.1;
    else if (scaleArcsec < 0.5) scaleArcsec = Math.ceil(scaleArcsec * 10) / 10;
    else scaleArcsec = Math.ceil(scaleArcsec);

    // Cap to reasonable display
    if (scaleArcsec > 10) scaleArcsec = 10;

    const barLength = scaleArcsec * pixelsPerArcsec;
    const barX = width - barLength - 20;

    // Draw bar
    ctx.strokeStyle = '#5dade2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barX, barY);
    ctx.lineTo(barX + barLength, barY);
    ctx.stroke();

    // End caps
    ctx.beginPath();
    ctx.moveTo(barX, barY - 5);
    ctx.lineTo(barX, barY + 5);
    ctx.moveTo(barX + barLength, barY - 5);
    ctx.lineTo(barX + barLength, barY + 5);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#5dade2';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    let label;
    if (scaleArcsec >= 60) {
      label = `${(scaleArcsec / 60).toFixed(1)}'`;  // arcminutes
    } else if (scaleArcsec >= 1) {
      label = `${scaleArcsec.toFixed(0)}"`;
    } else {
      label = `${(scaleArcsec * 1000).toFixed(0)} mas`;
    }
    ctx.fillText(label, barX + barLength / 2, barY - 10);
  }

  /**
   * Draw separation indicator between binary stars
   */
  function drawSeparationIndicator(ctx, x1, x2, y, separation) {
    const indicatorY = y + 60;

    ctx.strokeStyle = '#f4d03f';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Vertical lines from stars
    ctx.beginPath();
    ctx.moveTo(x1, y + 30);
    ctx.lineTo(x1, indicatorY);
    ctx.moveTo(x2, y + 30);
    ctx.lineTo(x2, indicatorY);
    ctx.stroke();

    // Horizontal line
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1, indicatorY);
    ctx.lineTo(x2, indicatorY);
    ctx.stroke();

    // Arrows
    ctx.beginPath();
    ctx.moveTo(x1, indicatorY);
    ctx.lineTo(x1 + 5, indicatorY - 3);
    ctx.lineTo(x1 + 5, indicatorY + 3);
    ctx.closePath();
    ctx.fillStyle = '#f4d03f';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x2, indicatorY);
    ctx.lineTo(x2 - 5, indicatorY - 3);
    ctx.lineTo(x2 - 5, indicatorY + 3);
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatArcsec(separation), (x1 + x2) / 2, indicatorY + 15);
  }

  /**
   * Format arcseconds for display
   */
  function formatArcsec(arcsec) {
    if (arcsec >= 60) {
      return `${(arcsec / 60).toFixed(1)}'`;
    } else if (arcsec >= 1) {
      return `${arcsec.toFixed(2)}"`;
    } else if (arcsec >= 0.001) {
      return `${(arcsec * 1000).toFixed(1)} mas`;
    } else {
      return `${(arcsec * 1e6).toFixed(1)} uas`;
    }
  }

  // ============================================
  // Update Functions
  // ============================================

  /**
   * Recalculate physics values and update display
   */
  function updatePhysics() {
    // Convert aperture to cm
    const D_cm = state.aperture * CONSTANTS.M_TO_CM;

    // Calculate diffraction limit
    state.diffLimit = diffractionLimitArcsec(state.lambda_cm, D_cm);

    // Calculate effective resolution
    const seeing = state.atmosphereEnabled ? state.seeing : 0;
    state.effectiveRes = effectiveResolution(state.diffLimit, seeing, state.aoEnabled);

    // Determine resolution status
    state.status = resolutionStatus(state.binarySeparation, state.effectiveRes);
  }

  /**
   * Update all display elements
   */
  function updateDisplay() {
    // Readouts
    elements.diffLimitReadout.textContent = formatReadoutValue(state.diffLimit);
    elements.effResReadout.textContent = formatReadoutValue(state.effectiveRes);
    elements.separationReadout.textContent = state.binarySeparation.toFixed(2);
    elements.apertureReadout.textContent = formatAperture(state.aperture);

    // Status indicator
    updateStatusIndicator(elements.resolutionStatus, state.status, state.binarySeparation, state.effectiveRes);

    // Telescope name
    elements.telescopeNameDisplay.textContent = `(${state.currentPreset})`;
  }

  /**
   * Format readout value with appropriate precision
   */
  function formatReadoutValue(value) {
    if (value >= 100) {
      return value.toFixed(0);
    } else if (value >= 10) {
      return value.toFixed(1);
    } else if (value >= 1) {
      return value.toFixed(2);
    } else if (value >= 0.01) {
      return value.toFixed(3);
    } else {
      return value.toExponential(2);
    }
  }

  /**
   * Format aperture for display
   */
  function formatAperture(aperture) {
    if (aperture >= 1000) {
      return `${(aperture / 1000).toFixed(0)} km`;
    } else if (aperture >= 1) {
      return aperture.toFixed(1);
    } else {
      return `${(aperture * 1000).toFixed(0)} mm`;
    }
  }

  /**
   * Update resolution status indicator
   */
  function updateStatusIndicator(element, status, separation, resolution) {
    element.className = 'resolution-status ' + status;

    const ratio = separation / resolution;
    if (status === 'resolved') {
      element.textContent = `RESOLVED - Stars clearly separated (${ratio.toFixed(1)}x Rayleigh limit)`;
    } else if (status === 'marginal') {
      element.textContent = `MARGINALLY RESOLVED - At Rayleigh limit`;
    } else {
      element.textContent = `UNRESOLVED - Stars appear as single blob`;
    }
  }

  /**
   * Draw both canvases
   */
  function drawCanvases() {
    // Primary canvas
    const canvas1 = elements.resolutionCanvas;
    const ctx1 = canvas1.getContext('2d');
    const rect1 = canvas1.getBoundingClientRect();
    canvas1.width = rect1.width * window.devicePixelRatio;
    canvas1.height = rect1.height * window.devicePixelRatio;
    ctx1.scale(window.devicePixelRatio, window.devicePixelRatio);

    drawTelescopeView(ctx1, rect1.width, rect1.height, state.effectiveRes, state.binarySeparation, state.currentPreset);

    // Compare canvas (if enabled)
    if (state.compareEnabled) {
      const canvas2 = elements.compareCanvas;
      const ctx2 = canvas2.getContext('2d');
      const rect2 = canvas2.getBoundingClientRect();
      canvas2.width = rect2.width * window.devicePixelRatio;
      canvas2.height = rect2.height * window.devicePixelRatio;
      ctx2.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Calculate resolution for comparison telescope
      const D_cm_compare = state.compareAperture * CONSTANTS.M_TO_CM;
      const diffLimit_compare = diffractionLimitArcsec(state.lambda_cm, D_cm_compare);
      const seeing = state.atmosphereEnabled ? state.seeing : 0;
      const effectiveRes_compare = effectiveResolution(diffLimit_compare, seeing, state.aoEnabled);
      const status_compare = resolutionStatus(state.binarySeparation, effectiveRes_compare);

      drawTelescopeView(ctx2, rect2.width, rect2.height, effectiveRes_compare, state.binarySeparation, '');
      updateStatusIndicator(elements.compareStatus, status_compare, state.binarySeparation, effectiveRes_compare);
    }
  }

  /**
   * Main update function
   */
  function update() {
    updatePhysics();
    updateDisplay();
    drawCanvases();
  }

  // ============================================
  // Control Setup
  // ============================================

  /**
   * Setup aperture slider (logarithmic scale)
   */
  function setupApertureSlider() {
    elements.apertureSlider.addEventListener('input', () => {
      const sliderVal = parseFloat(elements.apertureSlider.value);
      // Map 0-1000 to 0.007m (7mm) to 1e7m (10000km) logarithmically
      const minLog = Math.log10(0.007);
      const maxLog = Math.log10(1e7);
      const logVal = minLog + (sliderVal / 1000) * (maxLog - minLog);
      state.aperture = Math.pow(10, logVal);

      // Update display
      if (state.aperture >= 1000) {
        elements.apertureDisplay.textContent = `${(state.aperture / 1000).toFixed(0)} km`;
      } else if (state.aperture >= 1) {
        elements.apertureDisplay.textContent = `${state.aperture.toFixed(1)} m`;
      } else if (state.aperture >= 0.01) {
        elements.apertureDisplay.textContent = `${(state.aperture * 100).toFixed(0)} cm`;
      } else {
        elements.apertureDisplay.textContent = `${(state.aperture * 1000).toFixed(0)} mm`;
      }

      clearPresetHighlight();
      state.currentPreset = 'Custom';
      update();
    });
  }

  /**
   * Update slider position to match aperture value
   */
  function updateApertureSlider() {
    const minLog = Math.log10(0.007);
    const maxLog = Math.log10(1e7);
    const logVal = Math.log10(state.aperture);
    const sliderVal = ((logVal - minLog) / (maxLog - minLog)) * 1000;
    elements.apertureSlider.value = Math.round(sliderVal);

    // Update display
    if (state.aperture >= 1000) {
      elements.apertureDisplay.textContent = `${(state.aperture / 1000).toFixed(0)} km`;
    } else if (state.aperture >= 1) {
      elements.apertureDisplay.textContent = `${state.aperture.toFixed(1)} m`;
    } else if (state.aperture >= 0.01) {
      elements.apertureDisplay.textContent = `${(state.aperture * 100).toFixed(0)} cm`;
    } else {
      elements.apertureDisplay.textContent = `${(state.aperture * 1000).toFixed(0)} mm`;
    }
  }

  /**
   * Setup binary separation slider (logarithmic)
   */
  function setupBinarySlider() {
    elements.binarySlider.addEventListener('input', () => {
      const sliderVal = parseFloat(elements.binarySlider.value);
      // Map 0-1000 to 0.01" to 10" logarithmically
      const minLog = Math.log10(0.01);
      const maxLog = Math.log10(10);
      const logVal = minLog + (sliderVal / 1000) * (maxLog - minLog);
      state.binarySeparation = Math.pow(10, logVal);

      elements.binaryDisplay.textContent = `${state.binarySeparation.toFixed(2)} arcsec`;
      update();
    });
  }

  /**
   * Setup seeing slider
   */
  function setupSeeingSlider() {
    elements.seeingSlider.addEventListener('input', () => {
      state.seeing = parseFloat(elements.seeingSlider.value) / 100;
      elements.seeingDisplay.textContent = `${state.seeing.toFixed(1)}"`;
      update();
    });
  }

  /**
   * Setup wavelength selector buttons
   */
  function setupWavelengthSelector() {
    elements.wavelengthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lambda = parseFloat(btn.dataset.lambda);
        const name = btn.dataset.name;

        state.lambda_cm = lambda;

        // Update button states
        elements.wavelengthBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        elements.wavelengthDisplay.textContent = name;
        update();
      });
    });
  }

  /**
   * Setup atmosphere toggle
   */
  function setupAtmosphereToggle() {
    elements.toggleAtmosphere.addEventListener('change', () => {
      state.atmosphereEnabled = elements.toggleAtmosphere.checked;
      elements.seeingControl.classList.toggle('visible', state.atmosphereEnabled);

      if (state.atmosphereEnabled) {
        state.seeing = parseFloat(elements.seeingSlider.value) / 100;
      } else {
        state.aoEnabled = false;
        elements.toggleAo.checked = false;
      }

      update();
    });
  }

  /**
   * Setup AO toggle
   */
  function setupAoToggle() {
    elements.toggleAo.addEventListener('change', () => {
      state.aoEnabled = elements.toggleAo.checked;
      update();
    });
  }

  /**
   * Setup compare mode toggle
   */
  function setupCompareToggle() {
    elements.toggleCompare.addEventListener('change', () => {
      state.compareEnabled = elements.toggleCompare.checked;
      elements.compareTelescope.disabled = !state.compareEnabled;

      if (state.compareEnabled) {
        elements.primaryPanel.classList.remove('single-view');
        elements.comparePanel.style.display = 'flex';
        state.compareAperture = parseFloat(elements.compareTelescope.value);
        elements.compareNameDisplay.textContent = elements.compareTelescope.options[elements.compareTelescope.selectedIndex].text;
      } else {
        elements.primaryPanel.classList.add('single-view');
        elements.comparePanel.style.display = 'none';
      }

      update();
    });

    elements.compareTelescope.addEventListener('change', () => {
      state.compareAperture = parseFloat(elements.compareTelescope.value);
      elements.compareNameDisplay.textContent = elements.compareTelescope.options[elements.compareTelescope.selectedIndex].text;
      update();
    });
  }

  /**
   * Clear preset button highlighting
   */
  function clearPresetHighlight() {
    elements.presetButtons.forEach(btn => btn.classList.remove('active'));
  }

  /**
   * Setup preset buttons
   */
  function setupPresets() {
    elements.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const aperture = parseFloat(btn.dataset.d);
        const name = btn.dataset.name;
        const lambda = btn.dataset.lambda;

        state.aperture = aperture;
        state.currentPreset = name;

        // Update wavelength if specified
        if (lambda) {
          state.lambda_cm = parseFloat(lambda);
          elements.wavelengthBtns.forEach(b => {
            if (Math.abs(parseFloat(b.dataset.lambda) - state.lambda_cm) < 0.01) {
              elements.wavelengthBtns.forEach(bb => bb.classList.remove('active'));
              b.classList.add('active');
              elements.wavelengthDisplay.textContent = b.dataset.name;
            }
          });
        }

        // Update slider
        updateApertureSlider();

        // Highlight active preset
        clearPresetHighlight();
        btn.classList.add('active');

        update();
        announceChange();
      });
    });
  }

  /**
   * Setup mode toggle (101/201)
   */
  function setupModeToggle() {
    elements.btn101Mode.addEventListener('click', () => {
      state.mode = '101';
      elements.btn101Mode.classList.add('active');
      elements.btn201Mode.classList.remove('active');
      document.body.classList.remove('math-mode');
    });

    elements.btn201Mode.addEventListener('click', () => {
      state.mode = '201';
      elements.btn201Mode.classList.add('active');
      elements.btn101Mode.classList.remove('active');
      document.body.classList.add('math-mode');
      renderFormulas();
    });
  }

  /**
   * Render KaTeX formulas (Math Mode only)
   */
  function renderFormulas() {
    if (window.katex) {
      katex.render(
        "\\theta = 1.22 \\frac{\\lambda}{D} \\quad \\text{(Rayleigh criterion)}",
        elements.formulaRayleigh,
        { displayMode: true, throwOnError: false }
      );

      katex.render(
        "I(x) = \\left( \\frac{2 J_1(x)}{x} \\right)^2 \\quad \\text{(Airy disk)}",
        elements.formulaAiry,
        { displayMode: true, throwOnError: false }
      );
    }
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

      switch (event.key) {
        case 'ArrowLeft':
          // Decrease aperture
          state.aperture *= event.shiftKey ? 0.99 : 0.9;
          state.aperture = Math.max(0.007, state.aperture);
          updateApertureSlider();
          clearPresetHighlight();
          state.currentPreset = 'Custom';
          update();
          break;
        case 'ArrowRight':
          // Increase aperture
          state.aperture *= event.shiftKey ? 1.01 : 1.1;
          state.aperture = Math.min(1e7, state.aperture);
          updateApertureSlider();
          clearPresetHighlight();
          state.currentPreset = 'Custom';
          update();
          break;
        case 'ArrowUp':
          // Increase binary separation
          state.binarySeparation *= 1.1;
          state.binarySeparation = Math.min(10, state.binarySeparation);
          update();
          break;
        case 'ArrowDown':
          // Decrease binary separation
          state.binarySeparation *= 0.9;
          state.binarySeparation = Math.max(0.01, state.binarySeparation);
          update();
          break;
        case 'm':
        case 'M':
          // Toggle math mode
          if (state.mode === '101') {
            elements.btn201Mode.click();
          } else {
            elements.btn101Mode.click();
          }
          break;
        case 'a':
        case 'A':
          // Toggle atmosphere
          elements.toggleAtmosphere.checked = !elements.toggleAtmosphere.checked;
          elements.toggleAtmosphere.dispatchEvent(new Event('change'));
          break;
        case 'o':
        case 'O':
          // Toggle AO (if atmosphere enabled)
          if (state.atmosphereEnabled) {
            elements.toggleAo.checked = !elements.toggleAo.checked;
            elements.toggleAo.dispatchEvent(new Event('change'));
          }
          break;
        case 'c':
        case 'C':
          // Toggle compare mode
          elements.toggleCompare.checked = !elements.toggleCompare.checked;
          elements.toggleCompare.dispatchEvent(new Event('change'));
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
          selectPresetByIndex(parseInt(event.key) - 1);
          break;
      }
    });
  }

  function selectPresetByIndex(index) {
    const presets = Array.from(elements.presetButtons);
    if (index < presets.length) {
      presets[index].click();
    }
  }

  function announceChange() {
    elements.statusAnnounce.textContent =
      `${state.currentPreset}, aperture ${formatAperture(state.aperture)}, ` +
      `diffraction limit ${formatArcsec(state.diffLimit)}, ${state.status}`;
  }

  // ============================================
  // Physics Validation
  // ============================================

  /**
   * Validate physics calculations against known values
   * Using Rayleigh criterion: theta = 1.22 * lambda / D
   */
  function validatePhysics() {
    console.log('=== Physics Validation (Rayleigh criterion) ===');

    // HST (D=2.4m, lambda=550nm): theta = 0.058"
    const hst_D_cm = 2.4 * 100;
    const vis_lambda_cm = 5.5e-5;
    const hst_res = diffractionLimitArcsec(vis_lambda_cm, hst_D_cm);
    console.log(`HST (D=2.4m, lambda=550nm): theta = ${hst_res.toFixed(4)} arcsec (expected: 0.058)`);

    // HST at 500nm (commonly quoted): theta = 0.052"
    const hst_500nm = diffractionLimitArcsec(5e-5, hst_D_cm);
    console.log(`HST (D=2.4m, lambda=500nm): theta = ${hst_500nm.toFixed(4)} arcsec (NASA quotes ~0.05)`);

    // Keck (D=10m, lambda=550nm): theta = 0.014"
    const keck_D_cm = 10 * 100;
    const keck_res = diffractionLimitArcsec(vis_lambda_cm, keck_D_cm);
    console.log(`Keck (D=10m, lambda=550nm): theta = ${keck_res.toFixed(4)} arcsec (expected: 0.014)`);

    // Human eye (D=7mm, lambda=550nm): theta = 20" (about 1/3 arcmin)
    const eye_D_cm = 0.7;
    const eye_res = diffractionLimitArcsec(vis_lambda_cm, eye_D_cm);
    console.log(`Human eye (D=7mm, lambda=550nm): theta = ${eye_res.toFixed(1)} arcsec (expected: ~20)`);

    // ELT (D=39m, lambda=550nm): theta = 0.0035"
    const elt_D_cm = 39 * 100;
    const elt_res = diffractionLimitArcsec(vis_lambda_cm, elt_D_cm);
    console.log(`ELT (D=39m, lambda=550nm): theta = ${elt_res.toFixed(4)} arcsec (expected: 0.0035)`);

    // Radio: VLA at 21cm with 36km baseline
    const vla_D_cm = 36e5;  // 36 km in cm
    const radio_lambda_cm = 21;
    const vla_res = diffractionLimitArcsec(radio_lambda_cm, vla_D_cm);
    console.log(`VLA (D=36km, lambda=21cm): theta = ${vla_res.toFixed(2)} arcsec (expected: ~1.5)`);

    console.log('=========================');
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();

    setupApertureSlider();
    setupBinarySlider();
    setupSeeingSlider();
    setupWavelengthSelector();
    setupAtmosphereToggle();
    setupAoToggle();
    setupCompareToggle();
    setupPresets();
    setupModeToggle();
    setupKeyboard();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    // Handle canvas resize
    window.addEventListener('resize', () => {
      drawCanvases();
    });

    // Set initial slider positions
    updateApertureSlider();

    // Initial update
    update();

    // Validate physics in console
    validatePhysics();

    console.log('Telescope Resolution Sandbox initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

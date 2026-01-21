/**
 * Blackbody Radiation Sandbox
 * Interactive demonstration of thermal radiation physics
 *
 * Physics (CGS units):
 * - Wien's Law: lambda_peak = 0.2898 cm*K / T
 * - Stefan-Boltzmann: F = sigma*T^4, L = 4*pi*R^2*sigma*T^4
 * - Planck Function: B_lambda(T) = (2hc^2/lambda^5) * 1/(e^(hc/lambda*k*T) - 1)
 */

(function() {
  'use strict';

  // ============================================
  // Physical Constants (CGS)
  // ============================================

  const CONSTANTS = {
    c: 2.998e10,           // Speed of light (cm/s)
    h: 6.626e-27,          // Planck constant (erg*s)
    k: 1.381e-16,          // Boltzmann constant (erg/K)
    sigma: 5.670e-5,       // Stefan-Boltzmann (erg/cm^2/s/K^4)
    wien_b: 0.2898,        // Wien displacement constant (cm*K)

    // Unit conversions
    cm_to_nm: 1e7,         // cm to nm
    nm_to_cm: 1e-7,        // nm to cm

    // Solar values for reference
    T_sun: 5778,           // K
    R_sun: 6.96e10,        // cm
    L_sun: 3.828e33        // erg/s
  };

  // ============================================
  // Physics Functions
  // ============================================

  /**
   * Wien's Displacement Law: lambda_peak = b / T
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (cm)
   */
  function wienPeak(T) {
    return CONSTANTS.wien_b / T;
  }

  /**
   * Wien's Law in nm for display
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (nm)
   */
  function wienPeakNm(T) {
    return wienPeak(T) * CONSTANTS.cm_to_nm;
  }

  /**
   * Planck function B_lambda(T)
   * @param {number} lambda - Wavelength (cm)
   * @param {number} T - Temperature (K)
   * @returns {number} Spectral radiance (erg/s/cm^2/sr/cm)
   */
  function planckFunction(lambda, T) {
    const c = CONSTANTS.c;
    const h = CONSTANTS.h;
    const k = CONSTANTS.k;

    const factor1 = (2 * h * c * c) / Math.pow(lambda, 5);
    const exponent = (h * c) / (lambda * k * T);

    // Prevent overflow for very small wavelengths
    if (exponent > 700) return 0;

    return factor1 / (Math.exp(exponent) - 1);
  }

  /**
   * Stefan-Boltzmann flux: F = sigma*T^4
   * @param {number} T - Temperature (K)
   * @returns {number} Flux (erg/s/cm^2)
   */
  function stefanBoltzmannFlux(T) {
    return CONSTANTS.sigma * Math.pow(T, 4);
  }

  /**
   * Luminosity relative to Sun (assuming same radius)
   * L/L_sun = (T/T_sun)^4
   * @param {number} T - Temperature (K)
   * @returns {number} Luminosity ratio
   */
  function luminosityRatio(T) {
    return Math.pow(T / CONSTANTS.T_sun, 4);
  }

  /**
   * Convert temperature to approximate star color (RGB)
   * Uses blackbody color approximation
   * @param {number} T - Temperature (K)
   * @returns {object} {r, g, b} values 0-255
   */
  function temperatureToColor(T) {
    // Approximation for blackbody colors
    // Based on CIE color matching functions
    let r, g, b;

    if (T < 1000) {
      // Very cold - dark red to invisible
      r = Math.min(255, T / 4);
      g = 0;
      b = 0;
    } else if (T < 4000) {
      // Red to orange
      r = 255;
      g = Math.min(255, (T - 1000) / 12);
      b = 0;
    } else if (T < 6500) {
      // Orange to white
      r = 255;
      g = Math.min(255, 180 + (T - 4000) / 35);
      b = Math.min(255, (T - 4000) / 10);
    } else if (T < 10000) {
      // White to blue-white
      r = Math.max(200, 255 - (T - 6500) / 30);
      g = Math.max(200, 255 - (T - 6500) / 50);
      b = 255;
    } else {
      // Blue-white to blue
      r = Math.max(150, 200 - (T - 10000) / 200);
      g = Math.max(180, 200 - (T - 10000) / 300);
      b = 255;
    }

    return {
      r: Math.round(Math.max(0, Math.min(255, r))),
      g: Math.round(Math.max(0, Math.min(255, g))),
      b: Math.round(Math.max(0, Math.min(255, b)))
    };
  }

  /**
   * Get color name from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Color name
   */
  function colorName(T) {
    if (T < 2000) return 'Infrared (invisible)';
    if (T < 3500) return 'Deep Red';
    if (T < 4500) return 'Orange-Red';
    if (T < 5500) return 'Yellow-Orange';
    if (T < 6500) return 'Yellow-White';
    if (T < 8000) return 'White';
    if (T < 12000) return 'Blue-White';
    return 'Blue';
  }

  /**
   * Get spectral class from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Spectral class description
   */
  function spectralClass(T) {
    if (T >= 30000) return 'O-type';
    if (T >= 10000) return 'B-type';
    if (T >= 7500) return 'A-type';
    if (T >= 6000) return 'F-type';
    if (T >= 5200) return 'G-type (Sun-like)';
    if (T >= 3700) return 'K-type';
    if (T >= 2400) return 'M-type (Red Dwarf)';
    if (T >= 1300) return 'L-type (Brown Dwarf)';
    if (T >= 500) return 'T-type (Cool Brown Dwarf)';
    if (T >= 100) return 'Planetary';
    return 'CMB/Cold';
  }

  // ============================================
  // State
  // ============================================

  const state = {
    temperature: 5778,     // K (Sun default)
    mode: '101',           // '101' | '201'
    scale: 'log',          // 'log' | 'linear'
    redshift: 0,           // For CMB mode
    playing: false,
    cyclingPresets: false,
    speed: 1.0,
    animationId: null,
    cycleTimeoutId: null,  // Separate ID for preset cycling to prevent memory leak
    currentPreset: null,

    // Display ranges
    lambda_min: 1e-6,      // 10 nm in cm
    lambda_max: 1e-2,      // 0.1 mm in cm

    // Overlay visibility
    overlays: {
      peak: true,
      emBands: true,
      luminosity: false,
      planckTerms: false
    }
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // Canvas
      spectrumCanvas: document.getElementById('spectrum-canvas'),

      // Star preview
      starCircle: document.getElementById('star-circle'),
      starTypeLabel: document.getElementById('star-type-label'),

      // Peak marker
      peakMarker: document.getElementById('peak-marker'),

      // Readouts
      tempReadout: document.getElementById('temp-readout'),
      lambdaReadout: document.getElementById('lambda-readout'),
      lumReadout: document.getElementById('lum-readout'),
      colorReadout: document.getElementById('color-readout'),
      colorLabel: document.getElementById('color-label'),

      // Temperature control
      tempSlider: document.getElementById('temp-slider'),
      tempDisplay: document.getElementById('temp-display'),

      // Scale buttons
      btnLogScale: document.getElementById('btn-log-scale'),
      btnLinearScale: document.getElementById('btn-linear-scale'),

      // Mode buttons
      btn101Mode: document.getElementById('btn-101-mode'),
      btn201Mode: document.getElementById('btn-201-mode'),

      // CMB controls
      cmbControls: document.getElementById('cmb-controls'),
      zSlider: document.getElementById('z-slider'),
      zDisplay: document.getElementById('z-display'),

      // Animation controls
      btnPlay: document.getElementById('btn-play'),
      btnPause: document.getElementById('btn-pause'),
      btnCycle: document.getElementById('btn-cycle'),
      speedSelect: document.getElementById('speed-select'),

      // Overlay toggles
      togglePeak: document.getElementById('toggle-peak'),
      toggleEmBands: document.getElementById('toggle-em-bands'),
      toggleLuminosity: document.getElementById('toggle-luminosity'),
      togglePlanckTerms: document.getElementById('toggle-planck-terms'),

      // Preset buttons
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Insight box
      insightBox: document.getElementById('insight-box'),
      formulaWien: document.getElementById('formula-wien'),
      formulaPlanck: document.getElementById('formula-planck'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }

  // ============================================
  // Rendering
  // ============================================

  /**
   * Draw the Planck spectrum on canvas
   */
  function drawSpectrum() {
    const canvas = elements.spectrumCanvas;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical grid lines (wavelength)
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Calculate spectrum
    const numPoints = 500;
    const lambda_min_log = Math.log10(state.lambda_min);
    const lambda_max_log = Math.log10(state.lambda_max);

    // Find max value for normalization
    let maxB = 0;
    const lambdas = [];
    const values = [];

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const lambda_log = lambda_min_log + t * (lambda_max_log - lambda_min_log);
      const lambda = Math.pow(10, lambda_log);
      const B = planckFunction(lambda, state.temperature);

      lambdas.push(lambda);
      values.push(B);
      if (B > maxB) maxB = B;
    }

    // Draw spectrum curve
    ctx.beginPath();
    ctx.strokeStyle = '#5dade2';
    ctx.lineWidth = 2;

    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * width;
      const y = height - (values[i] / maxB) * height * 0.9 - height * 0.05;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Fill under curve with gradient
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');    // UV
    gradient.addColorStop(0.2, 'rgba(0, 0, 255, 0.3)');     // Blue
    gradient.addColorStop(0.35, 'rgba(0, 255, 0, 0.3)');    // Green
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)');   // Yellow
    gradient.addColorStop(0.65, 'rgba(255, 127, 0, 0.3)');  // Orange
    gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.3)');     // Red
    gradient.addColorStop(1, 'rgba(139, 0, 0, 0.2)');       // IR

    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw peak marker if enabled
    if (state.overlays.peak) {
      const lambda_peak = wienPeak(state.temperature);
      const peak_log = Math.log10(lambda_peak);

      if (peak_log >= lambda_min_log && peak_log <= lambda_max_log) {
        const peak_x = ((peak_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width;

        ctx.beginPath();
        ctx.strokeStyle = '#f4d03f';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(peak_x, 0);
        ctx.lineTo(peak_x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Peak label
        ctx.fillStyle = '#f4d03f';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const peakNm = wienPeakNm(state.temperature);
        let peakLabel;
        if (peakNm < 1000) {
          peakLabel = '\u03BB_peak = ' + peakNm.toFixed(0) + ' nm';
        } else if (peakNm < 1e6) {
          peakLabel = '\u03BB_peak = ' + (peakNm / 1000).toFixed(1) + ' \u03BCm';
        } else {
          peakLabel = '\u03BB_peak = ' + (peakNm / 1e6).toFixed(2) + ' mm';
        }
        ctx.fillText(peakLabel, peak_x, 20);
      }
    }

    // Draw visible band region
    if (state.overlays.emBands) {
      const vis_min = 380e-7;  // 380 nm in cm
      const vis_max = 700e-7;  // 700 nm in cm

      const vis_min_log = Math.log10(vis_min);
      const vis_max_log = Math.log10(vis_max);

      if (vis_max_log >= lambda_min_log && vis_min_log <= lambda_max_log) {
        const x1 = Math.max(0, ((vis_min_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width);
        const x2 = Math.min(width, ((vis_max_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x1, 0, x2 - x1, height);

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VISIBLE', (x1 + x2) / 2, height - 10);
      }
    }

    // Draw axis labels
    ctx.fillStyle = '#a0a0b0';
    ctx.font = '11px sans-serif';

    // X-axis labels (wavelength)
    const wavelengthLabels = [
      { lambda: 1e-6, label: '10 nm' },
      { lambda: 1e-5, label: '100 nm' },
      { lambda: 1e-4, label: '1 \u03BCm' },
      { lambda: 1e-3, label: '10 \u03BCm' },
      { lambda: 1e-2, label: '100 \u03BCm' }
    ];

    wavelengthLabels.forEach(function(item) {
      var lambda = item.lambda;
      var label = item.label;
      const log = Math.log10(lambda);
      if (log >= lambda_min_log && log <= lambda_max_log) {
        const x = ((log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * width;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - 25);
      }
    });

    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Intensity', 0, 0);
    ctx.restore();
  }

  /**
   * Update star preview circle
   */
  function updateStarPreview() {
    const color = temperatureToColor(state.temperature);
    const colorHex = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';

    elements.starCircle.style.background = colorHex;
    elements.starCircle.style.color = colorHex;

    // Update size if luminosity overlay enabled
    if (state.overlays.luminosity) {
      const lum = luminosityRatio(state.temperature);
      // Map luminosity to size (logarithmic scale)
      const baseSize = 60;
      const logLum = Math.log10(Math.max(lum, 0.01));
      const size = Math.max(30, Math.min(150, baseSize + logLum * 15));
      elements.starCircle.style.width = size + 'px';
      elements.starCircle.style.height = size + 'px';
    } else {
      elements.starCircle.style.width = '80px';
      elements.starCircle.style.height = '80px';
    }

    elements.starTypeLabel.textContent = spectralClass(state.temperature);
  }

  /**
   * Update EM band peak marker position
   */
  function updatePeakMarker() {
    const peakNm = wienPeakNm(state.temperature);

    // Map peak wavelength to position (log scale, 10nm to 10mm)
    const minLog = Math.log10(10);      // 10 nm
    const maxLog = Math.log10(10000000); // 10 mm in nm
    const peakLog = Math.log10(Math.max(10, Math.min(10000000, peakNm)));

    const position = ((peakLog - minLog) / (maxLog - minLog)) * 100;
    elements.peakMarker.style.left = Math.max(0, Math.min(100, position)) + '%';

    // Update label
    var label;
    if (peakNm < 1000) {
      label = peakNm.toFixed(0) + ' nm';
    } else if (peakNm < 1000000) {
      label = (peakNm / 1000).toFixed(1) + ' \u03BCm';
    } else {
      label = (peakNm / 1000000).toFixed(2) + ' mm';
    }
    elements.peakMarker.setAttribute('data-label', label);

    elements.peakMarker.style.display = state.overlays.peak ? 'block' : 'none';
  }

  /**
   * Update all readout displays
   */
  function updateReadouts() {
    // Temperature
    var tempStr;
    if (state.temperature >= 1000) {
      tempStr = state.temperature.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else {
      tempStr = state.temperature.toFixed(state.temperature < 10 ? 3 : 1);
    }
    elements.tempReadout.textContent = tempStr;
    elements.tempDisplay.textContent = tempStr + ' K';

    // Peak wavelength
    const peakNm = wienPeakNm(state.temperature);
    var lambdaStr, lambdaUnit;
    if (peakNm < 1000) {
      lambdaStr = peakNm.toFixed(0);
      lambdaUnit = 'nm';
    } else if (peakNm < 1000000) {
      lambdaStr = (peakNm / 1000).toFixed(1);
      lambdaUnit = '\u03BCm';
    } else {
      lambdaStr = (peakNm / 1000000).toFixed(2);
      lambdaUnit = 'mm';
    }
    elements.lambdaReadout.textContent = lambdaStr;
    elements.lambdaReadout.nextElementSibling.textContent = lambdaUnit;

    // Luminosity (relative to Sun, same radius)
    const lum = luminosityRatio(state.temperature);
    if (lum >= 1000) {
      elements.lumReadout.textContent = lum.toExponential(2);
    } else if (lum >= 1) {
      elements.lumReadout.textContent = lum.toFixed(1);
    } else {
      elements.lumReadout.textContent = lum.toExponential(2);
    }

    // Color
    const color = temperatureToColor(state.temperature);
    const colorHex = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
    elements.colorReadout.style.background = colorHex;
    elements.colorLabel.textContent = colorName(state.temperature);
  }

  /**
   * Update slider position from temperature
   */
  function updateSliderFromTemperature() {
    // Log scale: 2.7 K to 10^6 K maps to 0-1000
    const minLog = Math.log10(2.7);
    const maxLog = Math.log10(1000000);
    const tempLog = Math.log10(state.temperature);
    const sliderVal = ((tempLog - minLog) / (maxLog - minLog)) * 1000;
    elements.tempSlider.value = Math.round(sliderVal);
  }

  /**
   * Render KaTeX formulas (Math Mode only)
   */
  function renderFormulas() {
    if (state.mode === '201' && window.katex) {
      katex.render(
        "\\lambda_{\\text{peak}} = \\frac{0.2898 \\text{ cm}\\cdot\\text{K}}{T}",
        elements.formulaWien,
        { displayMode: true, throwOnError: false }
      );

      katex.render(
        "B_\\lambda(T) = \\frac{2hc^2}{\\lambda^5} \\cdot \\frac{1}{e^{hc/\\lambda k_B T} - 1}",
        elements.formulaPlanck,
        { displayMode: true, throwOnError: false }
      );
    }
  }

  /**
   * Update insight box content based on context
   */
  function updateInsightBox() {
    var title, content;

    if (state.temperature < 10) {
      title = "Cosmic Microwave Background";
      content = "The CMB is the most perfect blackbody ever measured. It's the afterglow of the Big Bang, now cooled to 2.725 K.";
    } else if (state.temperature < 500) {
      title = "Cold Object Emission";
      content = "Cool objects like dust clouds and planets emit in infrared \u2014 invisible to our eyes but revealed by telescopes like JWST and Spitzer.";
    } else if (state.temperature > 20000) {
      title = "Hot Star Emission";
      content = "O and B stars are so hot they emit mostly ultraviolet light \u2014 invisible to our eyes but detected by UV telescopes like GALEX.";
    } else {
      title = "Wien's Displacement Law";
      content = "Hotter objects peak at shorter wavelengths (bluer). Cooler objects peak at longer wavelengths (redder). The Sun peaks in green-yellow but appears white because it emits across all visible colors.";
    }

    elements.insightBox.querySelector('h4').textContent = title;
    elements.insightBox.querySelector('p').textContent = content;
  }

  /**
   * Main update function
   */
  function update() {
    drawSpectrum();
    updateStarPreview();
    updatePeakMarker();
    updateReadouts();
    updateInsightBox();
  }

  // ============================================
  // Controls
  // ============================================

  /**
   * Set temperature and update all displays
   */
  function setTemperature(T) {
    state.temperature = Math.max(2.7, Math.min(1000000, T));
    updateSliderFromTemperature();
    update();
  }

  /**
   * Setup temperature slider
   */
  function setupTempSlider() {
    elements.tempSlider.addEventListener('input', function() {
      const sliderVal = parseFloat(elements.tempSlider.value);

      if (state.scale === 'log') {
        // Log scale: slider 0-1000 maps to 2.7-10^6 K
        const minLog = Math.log10(2.7);
        const maxLog = Math.log10(1000000);
        const tempLog = minLog + (sliderVal / 1000) * (maxLog - minLog);
        state.temperature = Math.pow(10, tempLog);
      } else {
        // Linear scale: slider 0-1000 maps to 100-50000 K
        state.temperature = 100 + (sliderVal / 1000) * 49900;
      }

      clearPresetHighlight();
      update();
    });
  }

  /**
   * Setup scale toggle (log/linear)
   */
  function setupScaleToggle() {
    elements.btnLogScale.addEventListener('click', function() {
      state.scale = 'log';
      elements.btnLogScale.classList.add('active');
      elements.btnLinearScale.classList.remove('active');
      updateSliderFromTemperature();
    });

    elements.btnLinearScale.addEventListener('click', function() {
      state.scale = 'linear';
      elements.btnLinearScale.classList.add('active');
      elements.btnLogScale.classList.remove('active');
      // Update slider for linear range
      const sliderVal = ((state.temperature - 100) / 49900) * 1000;
      elements.tempSlider.value = Math.max(0, Math.min(1000, sliderVal));
    });
  }

  /**
   * Setup mode toggle (101/201)
   */
  function setupModeToggle() {
    elements.btn101Mode.addEventListener('click', function() {
      state.mode = '101';
      elements.btn101Mode.classList.add('active');
      elements.btn201Mode.classList.remove('active');
      document.body.classList.remove('math-mode');
    });

    elements.btn201Mode.addEventListener('click', function() {
      state.mode = '201';
      elements.btn201Mode.classList.add('active');
      elements.btn101Mode.classList.remove('active');
      document.body.classList.add('math-mode');
      renderFormulas();
    });
  }

  /**
   * Clear preset button highlighting
   */
  function clearPresetHighlight() {
    elements.presetButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    state.currentPreset = null;
    elements.cmbControls.classList.remove('visible');
  }

  /**
   * Setup preset buttons
   */
  function setupPresets() {
    elements.presetButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const T = parseFloat(btn.dataset.t);
        const name = btn.dataset.name;
        const cmb = btn.dataset.cmb;

        state.temperature = T;
        state.currentPreset = name;

        // Update slider
        updateSliderFromTemperature();

        // Highlight active preset
        clearPresetHighlight();
        btn.classList.add('active');

        // Show CMB controls if applicable
        if (cmb !== undefined) {
          elements.cmbControls.classList.add('visible');
          state.redshift = parseFloat(cmb);
          elements.zSlider.value = state.redshift;
          elements.zDisplay.textContent = state.redshift;
        }

        update();
        announceChange();
      });
    });
  }

  /**
   * Setup CMB redshift slider
   */
  function setupCMBControls() {
    elements.zSlider.addEventListener('input', function() {
      state.redshift = parseFloat(elements.zSlider.value);
      elements.zDisplay.textContent = state.redshift.toFixed(0);

      // T(z) = T_0 * (1 + z)
      state.temperature = 2.725 * (1 + state.redshift);
      updateSliderFromTemperature();
      update();
    });
  }

  /**
   * Setup overlay toggles
   */
  function setupOverlays() {
    elements.togglePeak.addEventListener('change', function() {
      state.overlays.peak = elements.togglePeak.checked;
      update();
    });

    elements.toggleEmBands.addEventListener('change', function() {
      state.overlays.emBands = elements.toggleEmBands.checked;
      update();
    });

    elements.toggleLuminosity.addEventListener('change', function() {
      state.overlays.luminosity = elements.toggleLuminosity.checked;
      update();
    });

    if (elements.togglePlanckTerms) {
      elements.togglePlanckTerms.addEventListener('change', function() {
        state.overlays.planckTerms = elements.togglePlanckTerms.checked;
        update();
      });
    }
  }

  /**
   * Setup animation controls
   */
  function setupAnimation() {
    elements.btnPlay.addEventListener('click', startAnimation);
    elements.btnPause.addEventListener('click', stopAnimation);
    elements.btnCycle.addEventListener('click', cyclePresets);

    elements.speedSelect.addEventListener('change', function() {
      state.speed = parseFloat(elements.speedSelect.value);
    });
  }

  /**
   * Start temperature sweep animation
   */
  function startAnimation() {
    if (state.playing) return;

    state.playing = true;
    state.cyclingPresets = false;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    var lastTime = performance.now();
    var direction = 1;

    function animate(currentTime) {
      if (!state.playing) return;

      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Sweep through log temperature
      const minLog = Math.log10(2.7);
      const maxLog = Math.log10(1000000);
      var tempLog = Math.log10(state.temperature);

      tempLog += direction * dt * state.speed * 0.5;

      if (tempLog >= maxLog) {
        tempLog = maxLog;
        direction = -1;
      } else if (tempLog <= minLog) {
        tempLog = minLog;
        direction = 1;
      }

      state.temperature = Math.pow(10, tempLog);
      updateSliderFromTemperature();
      clearPresetHighlight();
      update();

      state.animationId = requestAnimationFrame(animate);
    }

    state.animationId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation
   */
  function stopAnimation() {
    state.playing = false;
    state.cyclingPresets = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    if (state.cycleTimeoutId) {
      clearTimeout(state.cycleTimeoutId);
      state.cycleTimeoutId = null;
    }
    elements.btnPlay.disabled = false;
    elements.btnPause.disabled = true;
  }

  /**
   * Cycle through presets for lecture demos
   */
  function cyclePresets() {
    if (state.cyclingPresets) {
      stopAnimation();
      return;
    }

    state.cyclingPresets = true;
    state.playing = true;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    const presets = Array.from(elements.presetButtons);
    var currentIndex = 0;

    function nextPreset() {
      if (!state.cyclingPresets) return;

      presets[currentIndex].click();
      currentIndex = (currentIndex + 1) % presets.length;

      state.cycleTimeoutId = setTimeout(nextPreset, 2000 / state.speed);
    }

    nextPreset();
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', function(event) {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

      switch (event.key) {
        case 'ArrowLeft':
          // Decrease temperature
          setTemperature(state.temperature * (event.shiftKey ? 0.99 : 0.9));
          clearPresetHighlight();
          break;
        case 'ArrowRight':
          // Increase temperature
          setTemperature(state.temperature * (event.shiftKey ? 1.01 : 1.1));
          clearPresetHighlight();
          break;
        case 'Home':
          // Jump to coldest (CMB)
          setTemperature(2.725);
          break;
        case 'End':
          // Jump to hottest (Neutron star)
          setTemperature(1000000);
          break;
        case ' ':
          event.preventDefault();
          if (state.playing) {
            stopAnimation();
          } else {
            startAnimation();
          }
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
        case 'p':
        case 'P':
          // Cycle presets
          cyclePresets();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
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
    const peakNm = wienPeakNm(state.temperature);
    var lambdaStr;
    if (peakNm < 1000) {
      lambdaStr = peakNm.toFixed(0) + ' nanometers';
    } else if (peakNm < 1000000) {
      lambdaStr = (peakNm / 1000).toFixed(1) + ' micrometers';
    } else {
      lambdaStr = (peakNm / 1000000).toFixed(2) + ' millimeters';
    }

    elements.statusAnnounce.textContent =
      'Temperature ' + state.temperature.toFixed(0) + ' Kelvin, ' + spectralClass(state.temperature) + ', peak wavelength ' + lambdaStr;
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupTempSlider();
    setupScaleToggle();
    setupModeToggle();
    setupPresets();
    setupCMBControls();
    setupOverlays();
    setupAnimation();
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
    window.addEventListener('resize', function() {
      drawSpectrum();
    });

    update();
    console.log('Blackbody Radiation Sandbox initialized');

    // Expose physics functions for verification
    window.BlackbodyPhysics = {
      wienPeak: wienPeak,
      wienPeakNm: wienPeakNm,
      planckFunction: planckFunction,
      stefanBoltzmannFlux: stefanBoltzmannFlux,
      luminosityRatio: luminosityRatio,
      CONSTANTS: CONSTANTS
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

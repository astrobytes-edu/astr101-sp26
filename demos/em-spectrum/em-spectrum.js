/**
 * EM Spectrum Explorer
 * Interactive demonstration of the electromagnetic spectrum
 *
 * Physics (CGS units):
 * - Speed of light: c = 2.998e10 cm/s
 * - Planck constant: h = 6.626e-27 erg*s
 * - c = lambda * nu (wavelength * frequency)
 * - E = h * nu = h * c / lambda (photon energy)
 */

(function() {
  'use strict';

  // ============================================
  // Physical Constants (CGS)
  // ============================================

  const CONSTANTS = {
    c: 2.998e10,           // Speed of light (cm/s)
    h: 6.626e-27,          // Planck constant (erg*s)

    // Conversion factors to cm (base unit for wavelength)
    km_to_cm: 1e5,
    m_to_cm: 1e2,
    mm_to_cm: 1e-1,
    um_to_cm: 1e-4,
    nm_to_cm: 1e-7,
    pm_to_cm: 1e-10,
    fm_to_cm: 1e-13,

    // Conversion factors for frequency to Hz
    kHz_to_Hz: 1e3,
    MHz_to_Hz: 1e6,
    GHz_to_Hz: 1e9,
    THz_to_Hz: 1e12,
    PHz_to_Hz: 1e15,
    EHz_to_Hz: 1e18,

    // Energy conversions
    erg_to_eV: 6.242e11,   // 1 erg = 6.242e11 eV
    eV_to_erg: 1.602e-12,  // 1 eV = 1.602e-12 erg
    J_to_erg: 1e7,         // 1 J = 1e7 erg
    keV_to_eV: 1e3,
    MeV_to_eV: 1e6
  };

  // ============================================
  // EM Spectrum Bands (wavelength ranges in cm)
  // ============================================

  const BANDS = {
    radio: {
      name: 'Radio',
      lambda_min: 1e-1,     // 1 mm
      lambda_max: 1e6,      // 10 km
      color: '#800000',
      description: 'The longest wavelengths in the EM spectrum. Radio waves pass through clouds, dust, and even buildings.',
      examples: 'AM/FM radio, TV signals, WiFi, pulsars, cosmic microwave background, radio galaxies',
      detection: 'Radio telescopes with large dish antennas (VLA, ALMA, FAST)'
    },
    microwave: {
      name: 'Microwave',
      lambda_min: 1e-2,     // 0.1 mm
      lambda_max: 1e-1,     // 1 mm
      color: '#cc3300',
      description: 'Between radio and infrared. Microwaves reveal the Cosmic Microwave Background and cold molecular gas.',
      examples: 'Microwave ovens, cosmic microwave background (CMB), molecular clouds, radar',
      detection: 'Microwave receivers, bolometers (Planck, WMAP)'
    },
    infrared: {
      name: 'Infrared',
      lambda_min: 7e-5,     // 700 nm
      lambda_max: 1e-2,     // 0.1 mm
      color: '#ff0000',
      description: 'Emitted by warm objects. Infrared can penetrate dust clouds to reveal star-forming regions.',
      examples: 'Heat lamps, thermal imaging, star-forming regions, protoplanetary disks, brown dwarfs',
      detection: 'Cooled detectors, often in space (JWST, Spitzer, Herschel)'
    },
    visible: {
      name: 'Visible',
      lambda_min: 3.8e-5,   // 380 nm
      lambda_max: 7e-5,     // 700 nm
      color: '#ffffff',
      description: 'The narrow band our eyes can see! Stars, galaxies, and nebulae shine brightly in visible light.',
      examples: 'Sunlight, starlight, nebulae, galaxies as seen by Hubble',
      detection: 'Human eyes, CCDs, photographic film (Hubble, Keck, VLT)'
    },
    ultraviolet: {
      name: 'Ultraviolet',
      lambda_min: 1e-6,     // 10 nm
      lambda_max: 3.8e-5,   // 380 nm
      color: '#8b00ff',
      description: 'Higher energy than visible light. UV reveals hot young stars and active galactic nuclei.',
      examples: 'Sunburns, hot O/B stars, black holes, active galactic nuclei',
      detection: 'Special UV-sensitive detectors, space-based (GALEX, HST)'
    },
    xray: {
      name: 'X-ray',
      lambda_min: 1e-9,     // 0.01 nm
      lambda_max: 1e-6,     // 10 nm
      color: '#9932cc',
      description: 'Very high energy photons from extremely hot gas and violent events.',
      examples: 'X-ray machines, neutron stars, black hole accretion disks, supernova remnants, galaxy clusters',
      detection: 'Grazing-incidence mirrors in space (Chandra, XMM-Newton)'
    },
    gamma: {
      name: 'Gamma-ray',
      lambda_min: 1e-13,    // 1 fm (approx)
      lambda_max: 1e-9,     // 0.01 nm
      color: '#1a0033',
      description: 'The highest energy photons! Gamma rays come from the most extreme events in the universe.',
      examples: 'Nuclear reactions, gamma-ray bursts (GRBs), pulsars, active galactic nuclei',
      detection: 'Scintillators, pair production detectors (Fermi, VERITAS)'
    }
  };

  // ============================================
  // Physics Functions
  // ============================================

  /**
   * Convert wavelength to frequency using c = lambda * nu
   * @param {number} lambda_cm - Wavelength in cm
   * @returns {number} Frequency in Hz
   */
  function wavelengthToFrequency(lambda_cm) {
    return CONSTANTS.c / lambda_cm;
  }

  /**
   * Convert frequency to wavelength using c = lambda * nu
   * @param {number} nu_Hz - Frequency in Hz
   * @returns {number} Wavelength in cm
   */
  function frequencyToWavelength(nu_Hz) {
    return CONSTANTS.c / nu_Hz;
  }

  /**
   * Convert wavelength to photon energy using E = hc/lambda
   * @param {number} lambda_cm - Wavelength in cm
   * @returns {number} Energy in erg
   */
  function wavelengthToEnergy(lambda_cm) {
    return (CONSTANTS.h * CONSTANTS.c) / lambda_cm;
  }

  /**
   * Convert photon energy to wavelength using lambda = hc/E
   * @param {number} E_erg - Energy in erg
   * @returns {number} Wavelength in cm
   */
  function energyToWavelength(E_erg) {
    return (CONSTANTS.h * CONSTANTS.c) / E_erg;
  }

  /**
   * Convert frequency to energy using E = h*nu
   * @param {number} nu_Hz - Frequency in Hz
   * @returns {number} Energy in erg
   */
  function frequencyToEnergy(nu_Hz) {
    return CONSTANTS.h * nu_Hz;
  }

  /**
   * Convert wavelength from given unit to cm
   * @param {number} value - Wavelength value
   * @param {string} unit - Unit (km, m, mm, um, nm, pm, fm)
   * @returns {number} Wavelength in cm
   */
  function wavelengthToCm(value, unit) {
    switch (unit) {
      case 'km': return value * CONSTANTS.km_to_cm;
      case 'm': return value * CONSTANTS.m_to_cm;
      case 'mm': return value * CONSTANTS.mm_to_cm;
      case 'um': return value * CONSTANTS.um_to_cm;
      case 'nm': return value * CONSTANTS.nm_to_cm;
      case 'pm': return value * CONSTANTS.pm_to_cm;
      case 'fm': return value * CONSTANTS.fm_to_cm;
      default: return value;
    }
  }

  /**
   * Convert wavelength from cm to given unit
   * @param {number} cm - Wavelength in cm
   * @param {string} unit - Target unit
   * @returns {number} Wavelength in target unit
   */
  function cmToWavelength(cm, unit) {
    switch (unit) {
      case 'km': return cm / CONSTANTS.km_to_cm;
      case 'm': return cm / CONSTANTS.m_to_cm;
      case 'mm': return cm / CONSTANTS.mm_to_cm;
      case 'um': return cm / CONSTANTS.um_to_cm;
      case 'nm': return cm / CONSTANTS.nm_to_cm;
      case 'pm': return cm / CONSTANTS.pm_to_cm;
      case 'fm': return cm / CONSTANTS.fm_to_cm;
      default: return cm;
    }
  }

  /**
   * Convert frequency from given unit to Hz
   * @param {number} value - Frequency value
   * @param {string} unit - Unit
   * @returns {number} Frequency in Hz
   */
  function frequencyToHz(value, unit) {
    switch (unit) {
      case 'Hz': return value;
      case 'kHz': return value * CONSTANTS.kHz_to_Hz;
      case 'MHz': return value * CONSTANTS.MHz_to_Hz;
      case 'GHz': return value * CONSTANTS.GHz_to_Hz;
      case 'THz': return value * CONSTANTS.THz_to_Hz;
      case 'PHz': return value * CONSTANTS.PHz_to_Hz;
      case 'EHz': return value * CONSTANTS.EHz_to_Hz;
      default: return value;
    }
  }

  /**
   * Convert frequency from Hz to given unit
   * @param {number} hz - Frequency in Hz
   * @param {string} unit - Target unit
   * @returns {number} Frequency in target unit
   */
  function hzToFrequency(hz, unit) {
    switch (unit) {
      case 'Hz': return hz;
      case 'kHz': return hz / CONSTANTS.kHz_to_Hz;
      case 'MHz': return hz / CONSTANTS.MHz_to_Hz;
      case 'GHz': return hz / CONSTANTS.GHz_to_Hz;
      case 'THz': return hz / CONSTANTS.THz_to_Hz;
      case 'PHz': return hz / CONSTANTS.PHz_to_Hz;
      case 'EHz': return hz / CONSTANTS.EHz_to_Hz;
      default: return hz;
    }
  }

  /**
   * Convert energy from given unit to erg
   * @param {number} value - Energy value
   * @param {string} unit - Unit
   * @returns {number} Energy in erg
   */
  function energyToErg(value, unit) {
    switch (unit) {
      case 'erg': return value;
      case 'J': return value * CONSTANTS.J_to_erg;
      case 'eV': return value * CONSTANTS.eV_to_erg;
      case 'keV': return value * CONSTANTS.keV_to_eV * CONSTANTS.eV_to_erg;
      case 'MeV': return value * CONSTANTS.MeV_to_eV * CONSTANTS.eV_to_erg;
      default: return value;
    }
  }

  /**
   * Convert energy from erg to given unit
   * @param {number} erg - Energy in erg
   * @param {string} unit - Target unit
   * @returns {number} Energy in target unit
   */
  function ergToEnergy(erg, unit) {
    switch (unit) {
      case 'erg': return erg;
      case 'J': return erg / CONSTANTS.J_to_erg;
      case 'eV': return erg * CONSTANTS.erg_to_eV;
      case 'keV': return erg * CONSTANTS.erg_to_eV / CONSTANTS.keV_to_eV;
      case 'MeV': return erg * CONSTANTS.erg_to_eV / CONSTANTS.MeV_to_eV;
      default: return erg;
    }
  }

  /**
   * Determine which EM band a wavelength falls into
   * @param {number} lambda_cm - Wavelength in cm
   * @returns {string} Band name (radio, microwave, etc.)
   */
  function getBandForWavelength(lambda_cm) {
    for (var bandId in BANDS) {
      var band = BANDS[bandId];
      if (lambda_cm >= band.lambda_min && lambda_cm <= band.lambda_max) {
        return bandId;
      }
    }
    // Edge cases
    if (lambda_cm > BANDS.radio.lambda_max) return 'radio';
    if (lambda_cm < BANDS.gamma.lambda_min) return 'gamma';
    return 'visible'; // Default
  }

  /**
   * Map wavelength (in cm) to position on spectrum bar (0-100%)
   * Using logarithmic scale from 10 km to 10 fm
   */
  function wavelengthToPosition(lambda_cm) {
    var lambda_min_log = Math.log10(1e-12);  // 10 fm
    var lambda_max_log = Math.log10(1e6);    // 10 km
    var lambda_log = Math.log10(Math.max(1e-13, Math.min(1e7, lambda_cm)));
    // Inverted: long wavelengths on left
    return 100 - ((lambda_log - lambda_min_log) / (lambda_max_log - lambda_min_log)) * 100;
  }

  /**
   * Map position (0-100%) to wavelength in cm
   */
  function positionToWavelength(position) {
    var lambda_min_log = Math.log10(1e-12);
    var lambda_max_log = Math.log10(1e6);
    // Inverted: position 0 = long wavelength (left)
    var lambda_log = lambda_max_log - (position / 100) * (lambda_max_log - lambda_min_log);
    return Math.pow(10, lambda_log);
  }

  /**
   * Format wavelength for display with appropriate units
   * @param {number} lambda_cm - Wavelength in cm
   * @returns {object} {value: string, unit: string}
   */
  function formatWavelength(lambda_cm) {
    if (lambda_cm >= 1e5) {
      return { value: (lambda_cm / 1e5).toPrecision(3), unit: 'km' };
    } else if (lambda_cm >= 100) {
      return { value: (lambda_cm / 100).toPrecision(3), unit: 'm' };
    } else if (lambda_cm >= 0.1) {
      return { value: (lambda_cm * 10).toPrecision(3), unit: 'mm' };
    } else if (lambda_cm >= 1e-4) {
      return { value: (lambda_cm / 1e-4).toPrecision(3), unit: 'um' };
    } else if (lambda_cm >= 1e-7) {
      return { value: (lambda_cm / 1e-7).toPrecision(3), unit: 'nm' };
    } else if (lambda_cm >= 1e-10) {
      return { value: (lambda_cm / 1e-10).toPrecision(3), unit: 'pm' };
    } else {
      return { value: (lambda_cm / 1e-13).toPrecision(3), unit: 'fm' };
    }
  }

  /**
   * Format frequency for display
   * @param {number} nu_Hz - Frequency in Hz
   * @returns {object} {value: string, unit: string}
   */
  function formatFrequency(nu_Hz) {
    if (nu_Hz >= 1e18) {
      return { value: (nu_Hz / 1e18).toPrecision(3), unit: 'EHz' };
    } else if (nu_Hz >= 1e15) {
      return { value: (nu_Hz / 1e15).toPrecision(3), unit: 'PHz' };
    } else if (nu_Hz >= 1e12) {
      return { value: (nu_Hz / 1e12).toPrecision(3), unit: 'THz' };
    } else if (nu_Hz >= 1e9) {
      return { value: (nu_Hz / 1e9).toPrecision(3), unit: 'GHz' };
    } else if (nu_Hz >= 1e6) {
      return { value: (nu_Hz / 1e6).toPrecision(3), unit: 'MHz' };
    } else if (nu_Hz >= 1e3) {
      return { value: (nu_Hz / 1e3).toPrecision(3), unit: 'kHz' };
    } else {
      return { value: nu_Hz.toPrecision(3), unit: 'Hz' };
    }
  }

  /**
   * Format energy for display
   * @param {number} E_erg - Energy in erg
   * @returns {object} {value: string, unit: string}
   */
  function formatEnergy(E_erg) {
    var E_eV = E_erg * CONSTANTS.erg_to_eV;
    if (E_eV >= 1e6) {
      return { value: (E_eV / 1e6).toPrecision(3), unit: 'MeV' };
    } else if (E_eV >= 1e3) {
      return { value: (E_eV / 1e3).toPrecision(3), unit: 'keV' };
    } else if (E_eV >= 0.001) {
      return { value: E_eV.toPrecision(3), unit: 'eV' };
    } else {
      return { value: E_erg.toPrecision(3), unit: 'erg' };
    }
  }

  // ============================================
  // State
  // ============================================

  var state = {
    mode: 'explore',           // 'explore' | 'convert' | 'telescopes' | 'objects'
    wavelength_cm: 5e-5,       // Current wavelength (500 nm in cm)
    selectedBand: null,        // Currently selected band
    selectedTelescope: null,   // Currently selected telescope
    selectedObject: null,      // Currently selected object
    convertSource: 'wavelength' // Which input triggered conversion
  };

  // ============================================
  // DOM Elements
  // ============================================

  var elements = {};

  function initElements() {
    elements = {
      // Mode tabs
      tabExplore: document.getElementById('tab-explore'),
      tabConvert: document.getElementById('tab-convert'),
      tabTelescopes: document.getElementById('tab-telescopes'),
      tabObjects: document.getElementById('tab-objects'),

      // Mode panels
      panelExplore: document.getElementById('panel-explore'),
      panelConvert: document.getElementById('panel-convert'),
      panelTelescopes: document.getElementById('panel-telescopes'),
      panelObjects: document.getElementById('panel-objects'),

      // Spectrum bar
      spectrumBar: document.getElementById('spectrum-bar'),
      selectionMarker: document.getElementById('selection-marker'),
      bandHighlight: document.getElementById('band-highlight'),
      bandLabels: document.getElementById('band-labels'),

      // Explore mode
      bandInfo: document.getElementById('band-info'),
      bandTitle: document.getElementById('band-title'),
      bandWavelength: document.getElementById('band-wavelength'),
      bandDescription: document.getElementById('band-description'),
      bandExamples: document.getElementById('band-examples'),

      // Convert mode
      inputWavelength: document.getElementById('input-wavelength'),
      unitWavelength: document.getElementById('unit-wavelength'),
      inputFrequency: document.getElementById('input-frequency'),
      unitFrequency: document.getElementById('unit-frequency'),
      inputEnergy: document.getElementById('input-energy'),
      unitEnergy: document.getElementById('unit-energy'),
      formulaDisplay: document.getElementById('formula-display'),

      // Telescopes mode
      telescopesGrid: document.getElementById('telescopes-grid'),
      telescopeInfo: document.getElementById('telescope-info'),
      telescopeInfoName: document.getElementById('telescope-info-name'),
      telescopeInfoRange: document.getElementById('telescope-info-range'),
      telescopeInfoLocation: document.getElementById('telescope-info-location'),
      telescopeInfoScience: document.getElementById('telescope-info-science'),

      // Objects mode
      objectsGrid: document.getElementById('objects-grid'),
      objectInfo: document.getElementById('object-info'),
      objectInfoName: document.getElementById('object-info-name'),
      objectInfoBands: document.getElementById('object-info-bands'),
      objectInfoWhy: document.getElementById('object-info-why'),
      objectInfoTelescope: document.getElementById('object-info-telescope'),

      // Readouts
      readoutWavelength: document.getElementById('readout-wavelength'),
      readoutFrequency: document.getElementById('readout-frequency'),
      readoutEnergy: document.getElementById('readout-energy'),
      readoutBand: document.getElementById('readout-band'),

      // Insight
      insightBox: document.getElementById('insight-box'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }

  // ============================================
  // Rendering
  // ============================================

  /**
   * Update all displays based on current state
   */
  function update() {
    updateReadouts();
    updateSelectionMarker();
    updateInsightBox();
  }

  /**
   * Update readout panel
   */
  function updateReadouts() {
    var nu_Hz = wavelengthToFrequency(state.wavelength_cm);
    var E_erg = wavelengthToEnergy(state.wavelength_cm);

    var lambda = formatWavelength(state.wavelength_cm);
    var nu = formatFrequency(nu_Hz);
    var E = formatEnergy(E_erg);
    var band = getBandForWavelength(state.wavelength_cm);

    elements.readoutWavelength.innerHTML = lambda.value + '<span class="readout-unit">' + lambda.unit + '</span>';
    elements.readoutFrequency.innerHTML = nu.value + '<span class="readout-unit">' + nu.unit + '</span>';
    elements.readoutEnergy.innerHTML = E.value + '<span class="readout-unit">' + E.unit + '</span>';
    elements.readoutBand.textContent = BANDS[band].name;
  }

  /**
   * Update selection marker position
   */
  function updateSelectionMarker() {
    var position = wavelengthToPosition(state.wavelength_cm);
    elements.selectionMarker.style.left = position + '%';
    elements.selectionMarker.style.display = 'block';

    var lambda = formatWavelength(state.wavelength_cm);
    elements.selectionMarker.setAttribute('data-label', lambda.value + ' ' + lambda.unit);
  }

  /**
   * Update insight box based on context
   */
  function updateInsightBox() {
    var band = getBandForWavelength(state.wavelength_cm);
    var title, content;

    switch (state.mode) {
      case 'explore':
        title = 'Light as a Cosmic Messenger';
        content = 'Every part of the electromagnetic spectrum reveals different information about the universe. ' +
                  'Click on any band above to learn what it reveals.';
        break;
      case 'convert':
        title = 'The Wave-Particle Connection';
        content = 'Light behaves as both a wave (with wavelength and frequency) and a particle (photon with energy). ' +
                  'The relationships c = \u03BB\u03BD and E = h\u03BD connect these properties.';
        break;
      case 'telescopes':
        title = 'Multiwavelength Astronomy';
        content = 'No single telescope can see the whole universe. Different telescopes detect different wavelengths, ' +
                  'each revealing unique cosmic phenomena.';
        break;
      case 'objects':
        title = 'Cosmic Fingerprints';
        content = 'Astronomical objects emit light across multiple bands depending on their temperature, ' +
                  'composition, and physical processes.';
        break;
    }

    elements.insightBox.querySelector('h4').textContent = title;
    elements.insightBox.querySelector('p').textContent = content;
  }

  /**
   * Show band information in explore mode
   */
  function showBandInfo(bandId) {
    var band = BANDS[bandId];
    if (!band) return;

    state.selectedBand = bandId;

    // Update band info panel
    elements.bandTitle.textContent = band.name;

    var minLambda = formatWavelength(band.lambda_min);
    var maxLambda = formatWavelength(band.lambda_max);
    elements.bandWavelength.textContent = maxLambda.value + ' ' + maxLambda.unit + ' \u2013 ' +
                                          minLambda.value + ' ' + minLambda.unit;

    elements.bandDescription.textContent = band.description;
    elements.bandExamples.innerHTML = '<strong>Examples:</strong> ' + band.examples +
                                      '<br><strong>Detection:</strong> ' + band.detection;

    // Highlight band labels
    var labels = elements.bandLabels.querySelectorAll('.band-label');
    labels.forEach(function(label) {
      label.classList.remove('active');
      if (label.dataset.band === bandId) {
        label.classList.add('active');
      }
    });

    // Show band highlight on spectrum bar
    var minPos = wavelengthToPosition(band.lambda_max); // Inverted
    var maxPos = wavelengthToPosition(band.lambda_min);
    elements.bandHighlight.style.left = minPos + '%';
    elements.bandHighlight.style.width = (maxPos - minPos) + '%';
    elements.bandHighlight.style.display = 'block';

    // Set wavelength to middle of band
    var midLambda = Math.sqrt(band.lambda_min * band.lambda_max); // Geometric mean
    state.wavelength_cm = midLambda;
    update();

    // Announce for screen readers
    announceChange(band.name + ' band selected');
  }

  /**
   * Update converter values based on source input
   */
  function updateConverter(source) {
    var lambda_cm, nu_Hz, E_erg;

    if (source === 'wavelength') {
      var lambdaVal = parseFloat(elements.inputWavelength.value);
      var lambdaUnit = elements.unitWavelength.value;
      if (isNaN(lambdaVal) || lambdaVal <= 0) return;

      lambda_cm = wavelengthToCm(lambdaVal, lambdaUnit);
      nu_Hz = wavelengthToFrequency(lambda_cm);
      E_erg = wavelengthToEnergy(lambda_cm);

    } else if (source === 'frequency') {
      var nuVal = parseFloat(elements.inputFrequency.value);
      var nuUnit = elements.unitFrequency.value;
      if (isNaN(nuVal) || nuVal <= 0) return;

      nu_Hz = frequencyToHz(nuVal, nuUnit);
      lambda_cm = frequencyToWavelength(nu_Hz);
      E_erg = frequencyToEnergy(nu_Hz);

    } else if (source === 'energy') {
      var eVal = parseFloat(elements.inputEnergy.value);
      var eUnit = elements.unitEnergy.value;
      if (isNaN(eVal) || eVal <= 0) return;

      E_erg = energyToErg(eVal, eUnit);
      lambda_cm = energyToWavelength(E_erg);
      nu_Hz = wavelengthToFrequency(lambda_cm);
    }

    // Update state
    state.wavelength_cm = lambda_cm;

    // Update other fields (not the source)
    if (source !== 'wavelength') {
      var nuUnitW = elements.unitWavelength.value;
      elements.inputWavelength.value = cmToWavelength(lambda_cm, nuUnitW).toPrecision(4);
    }
    if (source !== 'frequency') {
      var nuUnitF = elements.unitFrequency.value;
      elements.inputFrequency.value = hzToFrequency(nu_Hz, nuUnitF).toPrecision(4);
    }
    if (source !== 'energy') {
      var eUnitE = elements.unitEnergy.value;
      elements.inputEnergy.value = ergToEnergy(E_erg, eUnitE).toPrecision(4);
    }

    // Update formula display
    var lambdaF = formatWavelength(lambda_cm);
    var nuF = formatFrequency(nu_Hz);
    var eF = formatEnergy(E_erg);
    elements.formulaDisplay.innerHTML =
      '\u03BB = ' + lambdaF.value + ' ' + lambdaF.unit +
      ' &nbsp;\u2194&nbsp; \u03BD = ' + nuF.value + ' ' + nuF.unit +
      ' &nbsp;\u2194&nbsp; E = ' + eF.value + ' ' + eF.unit;

    update();
  }

  /**
   * Populate telescope cards
   */
  function populateTelescopes() {
    if (!window.TELESCOPES) return;

    var html = '';
    window.TELESCOPES.forEach(function(telescope, index) {
      html += '<button class="telescope-card" data-index="' + index + '" tabindex="0">' +
              '<div class="telescope-icon">' + telescope.icon + '</div>' +
              '<div class="telescope-name">' + telescope.name + '</div>' +
              '<div class="telescope-band">' + telescope.band + '</div>' +
              '</button>';
    });
    elements.telescopesGrid.innerHTML = html;

    // Add click handlers
    elements.telescopesGrid.querySelectorAll('.telescope-card').forEach(function(card) {
      card.addEventListener('click', function() {
        selectTelescope(parseInt(card.dataset.index));
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTelescope(parseInt(card.dataset.index));
        }
      });
    });
  }

  /**
   * Select a telescope and show its info
   */
  function selectTelescope(index) {
    if (!window.TELESCOPES || index >= window.TELESCOPES.length) return;

    var telescope = window.TELESCOPES[index];
    state.selectedTelescope = index;

    // Update card highlighting
    elements.telescopesGrid.querySelectorAll('.telescope-card').forEach(function(card, i) {
      card.classList.toggle('active', i === index);
    });

    // Show info panel
    elements.telescopeInfoName.textContent = telescope.icon + ' ' + telescope.name;

    var minLambda = formatWavelength(telescope.lambda_min);
    var maxLambda = formatWavelength(telescope.lambda_max);
    elements.telescopeInfoRange.textContent =
      'Wavelength range: ' + maxLambda.value + ' ' + maxLambda.unit + ' \u2013 ' +
      minLambda.value + ' ' + minLambda.unit;

    elements.telescopeInfoLocation.textContent = 'Location: ' + telescope.location;
    elements.telescopeInfoScience.textContent = 'Science: ' + telescope.science;
    elements.telescopeInfo.classList.add('visible');

    // Highlight band on spectrum
    var minPos = wavelengthToPosition(telescope.lambda_max);
    var maxPos = wavelengthToPosition(telescope.lambda_min);
    elements.bandHighlight.style.left = minPos + '%';
    elements.bandHighlight.style.width = (maxPos - minPos) + '%';
    elements.bandHighlight.style.display = 'block';

    // Set wavelength to middle of range
    var midLambda = Math.sqrt(telescope.lambda_min * telescope.lambda_max);
    state.wavelength_cm = midLambda;
    update();

    announceChange(telescope.name + ' selected');
  }

  /**
   * Populate object cards
   */
  function populateObjects() {
    if (!window.ASTRO_OBJECTS) return;

    var html = '';
    window.ASTRO_OBJECTS.forEach(function(obj, index) {
      html += '<button class="object-card" data-index="' + index + '" tabindex="0">' +
              '<div class="object-icon">' + obj.icon + '</div>' +
              '<div class="object-name">' + obj.name + '</div>' +
              '</button>';
    });
    elements.objectsGrid.innerHTML = html;

    // Add click handlers
    elements.objectsGrid.querySelectorAll('.object-card').forEach(function(card) {
      card.addEventListener('click', function() {
        selectObject(parseInt(card.dataset.index));
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectObject(parseInt(card.dataset.index));
        }
      });
    });
  }

  /**
   * Select an object and show its info
   */
  function selectObject(index) {
    if (!window.ASTRO_OBJECTS || index >= window.ASTRO_OBJECTS.length) return;

    var obj = window.ASTRO_OBJECTS[index];
    state.selectedObject = index;

    // Update card highlighting
    elements.objectsGrid.querySelectorAll('.object-card').forEach(function(card, i) {
      card.classList.toggle('active', i === index);
    });

    // Show info panel
    elements.objectInfoName.textContent = obj.icon + ' ' + obj.name;
    elements.objectInfoBands.textContent = 'Observed in: ' + obj.bands.join(', ');
    elements.objectInfoWhy.textContent = obj.why;
    elements.objectInfoTelescope.textContent = 'Telescopes: ' + obj.telescope;
    elements.objectInfo.classList.add('visible');

    // Highlight bands on spectrum (use primary emission band)
    var primaryBand = obj.bands[0].toLowerCase().replace('-', '').replace(' ', '');

    // Map band names to BANDS keys
    var bandMap = {
      'radio': 'radio',
      'microwave': 'microwave',
      'infrared': 'infrared',
      'farir': 'infrared',
      'nearir': 'infrared',
      'ir': 'infrared',
      'visible': 'visible',
      'optical': 'visible',
      'uv': 'ultraviolet',
      'ultraviolet': 'ultraviolet',
      'xray': 'xray',
      'gamma': 'gamma',
      'gammaray': 'gamma'
    };

    var bandKey = bandMap[primaryBand] || 'visible';
    var band = BANDS[bandKey];

    if (band) {
      var minPos = wavelengthToPosition(band.lambda_max);
      var maxPos = wavelengthToPosition(band.lambda_min);
      elements.bandHighlight.style.left = minPos + '%';
      elements.bandHighlight.style.width = (maxPos - minPos) + '%';
      elements.bandHighlight.style.display = 'block';

      state.wavelength_cm = Math.sqrt(band.lambda_min * band.lambda_max);
      update();
    }

    announceChange(obj.name + ' selected');
  }

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Set up mode tab switching
   */
  function setupModeTabs() {
    var tabs = [elements.tabExplore, elements.tabConvert, elements.tabTelescopes, elements.tabObjects];
    var panels = [elements.panelExplore, elements.panelConvert, elements.panelTelescopes, elements.panelObjects];
    var modes = ['explore', 'convert', 'telescopes', 'objects'];

    tabs.forEach(function(tab, index) {
      tab.addEventListener('click', function() {
        // Update tab states
        tabs.forEach(function(t, i) {
          t.classList.toggle('active', i === index);
          t.setAttribute('aria-selected', i === index ? 'true' : 'false');
          t.setAttribute('tabindex', i === index ? '0' : '-1');
        });

        // Update panel states
        panels.forEach(function(p, i) {
          p.classList.toggle('active', i === index);
        });

        // Update mode
        state.mode = modes[index];
        elements.bandHighlight.style.display = 'none';
        update();
      });

      // Keyboard navigation
      tab.addEventListener('keydown', function(e) {
        var currentIndex = modes.indexOf(state.mode);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          var nextIndex = (currentIndex + 1) % tabs.length;
          tabs[nextIndex].click();
          tabs[nextIndex].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          var prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          tabs[prevIndex].click();
          tabs[prevIndex].focus();
        }
      });
    });
  }

  /**
   * Set up spectrum bar interaction
   */
  function setupSpectrumBar() {
    function handleSpectrumClick(e) {
      var rect = elements.spectrumBar.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var position = (x / rect.width) * 100;
      state.wavelength_cm = positionToWavelength(position);
      update();

      // In explore mode, also select the band
      if (state.mode === 'explore') {
        var band = getBandForWavelength(state.wavelength_cm);
        showBandInfo(band);
      }
    }

    elements.spectrumBar.addEventListener('click', handleSpectrumClick);

    // Keyboard navigation
    elements.spectrumBar.addEventListener('keydown', function(e) {
      var step = e.shiftKey ? 0.5 : 0.1; // Larger steps with shift
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        state.wavelength_cm *= Math.pow(10, -step);
        update();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        state.wavelength_cm *= Math.pow(10, step);
        update();
      }
    });
  }

  /**
   * Set up band label clicks
   */
  function setupBandLabels() {
    elements.bandLabels.querySelectorAll('.band-label').forEach(function(label) {
      label.addEventListener('click', function() {
        showBandInfo(label.dataset.band);
      });
      label.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showBandInfo(label.dataset.band);
        }
      });
    });
  }

  /**
   * Set up converter inputs
   */
  function setupConverter() {
    // Wavelength input
    elements.inputWavelength.addEventListener('input', function() {
      updateConverter('wavelength');
    });
    elements.unitWavelength.addEventListener('change', function() {
      updateConverter('wavelength');
    });

    // Frequency input
    elements.inputFrequency.addEventListener('input', function() {
      updateConverter('frequency');
    });
    elements.unitFrequency.addEventListener('change', function() {
      updateConverter('frequency');
    });

    // Energy input
    elements.inputEnergy.addEventListener('input', function() {
      updateConverter('energy');
    });
    elements.unitEnergy.addEventListener('change', function() {
      updateConverter('energy');
    });

    // Initialize with default value
    updateConverter('wavelength');
  }

  /**
   * Set up keyboard shortcuts
   */
  function setupKeyboard() {
    document.addEventListener('keydown', function(e) {
      // Don't capture when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case '1':
          elements.tabExplore.click();
          break;
        case '2':
          elements.tabConvert.click();
          break;
        case '3':
          elements.tabTelescopes.click();
          break;
        case '4':
          elements.tabObjects.click();
          break;
        case 'r':
        case 'R':
          showBandInfo('radio');
          break;
        case 'm':
        case 'M':
          showBandInfo('microwave');
          break;
        case 'i':
        case 'I':
          showBandInfo('infrared');
          break;
        case 'v':
        case 'V':
          showBandInfo('visible');
          break;
        case 'u':
        case 'U':
          showBandInfo('ultraviolet');
          break;
        case 'x':
        case 'X':
          showBandInfo('xray');
          break;
        case 'g':
        case 'G':
          showBandInfo('gamma');
          break;
      }
    });
  }

  /**
   * Announce change for screen readers
   */
  function announceChange(message) {
    elements.statusAnnounce.textContent = message;
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupModeTabs();
    setupSpectrumBar();
    setupBandLabels();
    setupConverter();
    setupKeyboard();
    populateTelescopes();
    populateObjects();

    // Initialize starfield
    var starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    // Set initial wavelength to visible green (500 nm)
    state.wavelength_cm = 5e-5;
    update();

    console.log('EM Spectrum Explorer initialized');

    // Expose physics functions for verification
    window.EMSpectrumPhysics = {
      wavelengthToFrequency: wavelengthToFrequency,
      frequencyToWavelength: frequencyToWavelength,
      wavelengthToEnergy: wavelengthToEnergy,
      energyToWavelength: energyToWavelength,
      frequencyToEnergy: frequencyToEnergy,
      wavelengthToCm: wavelengthToCm,
      cmToWavelength: cmToWavelength,
      frequencyToHz: frequencyToHz,
      hzToFrequency: hzToFrequency,
      energyToErg: energyToErg,
      ergToEnergy: ergToEnergy,
      CONSTANTS: CONSTANTS,
      BANDS: BANDS
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

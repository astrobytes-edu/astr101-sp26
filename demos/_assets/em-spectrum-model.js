/* EM Spectrum model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.EMSpectrumModel)
 * and in Node tests (via require()).
 *
 * Notes:
 * - Uses CGS for base wavelength/energy (cm, erg) but reports frequency in Hz.
 * - Band boundaries are approximate conventions for teaching; keep README in sync.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.EMSpectrumModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CONSTANTS = {
    c: 2.99792458e10, // Speed of light (cm/s), exact
    h: 6.62607015e-27, // Planck constant (erg*s), exact

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
    eV_to_erg: 1.602176634e-12, // 1 eV in erg, exact (SI definition)
    J_to_erg: 1e7, // 1 J = 1e7 erg
    keV_to_eV: 1e3,
    MeV_to_eV: 1e6,
  };

  // Derived (kept as a number for speed + consistent inversion with eV_to_erg).
  CONSTANTS.erg_to_eV = 1 / CONSTANTS.eV_to_erg;

  // Wavelength ranges in cm.
  const BANDS = {
    radio: {
      name: 'Radio',
      lambda_min: 1e-1, // 1 mm
      lambda_max: 1e6, // 10 km
      color: '#800000',
      description:
        'The longest wavelengths in the EM spectrum. Radio waves pass through clouds, dust, and even buildings.',
      examples: 'AM/FM radio, TV signals, WiFi, pulsars, cosmic microwave background, radio galaxies',
      detection: 'Radio telescopes with large dish antennas (VLA, ALMA, FAST)',
    },
    microwave: {
      name: 'Microwave',
      lambda_min: 1e-2, // 0.1 mm
      lambda_max: 1e-1, // 1 mm
      color: '#cc3300',
      description:
        'Between radio and infrared. Microwaves reveal the Cosmic Microwave Background and cold molecular gas.',
      examples: 'Microwave ovens, cosmic microwave background (CMB), molecular clouds, radar',
      detection: 'Microwave receivers, bolometers (Planck, WMAP)',
    },
    infrared: {
      name: 'Infrared',
      lambda_min: 7e-5, // 700 nm
      lambda_max: 1e-2, // 0.1 mm
      color: '#ff0000',
      description:
        'Emitted by warm objects. Infrared can penetrate dust clouds to reveal star-forming regions.',
      examples: 'Heat lamps, thermal imaging, star-forming regions, protoplanetary disks, brown dwarfs',
      detection: 'Cooled detectors, often in space (JWST, Spitzer, Herschel)',
    },
    visible: {
      name: 'Visible',
      lambda_min: 3.8e-5, // 380 nm
      lambda_max: 7e-5, // 700 nm
      color: '#ffffff',
      description:
        'The narrow band our eyes can see! Stars, galaxies, and nebulae shine brightly in visible light.',
      examples: 'Sunlight, starlight, nebulae, galaxies as seen by Hubble',
      detection: 'Human eyes, CCDs, photographic film (Hubble, Keck, VLT)',
    },
    ultraviolet: {
      name: 'Ultraviolet',
      lambda_min: 1e-6, // 10 nm
      lambda_max: 3.8e-5, // 380 nm
      color: '#8b00ff',
      description: 'Higher energy than visible light. UV reveals hot young stars and active galactic nuclei.',
      examples: 'Sunburns, hot O/B stars, black holes, active galactic nuclei',
      detection: 'Special UV-sensitive detectors, space-based (GALEX, HST)',
    },
    xray: {
      name: 'X-ray',
      lambda_min: 1e-9, // 0.01 nm
      lambda_max: 1e-6, // 10 nm
      color: '#9932cc',
      description: 'Very high energy photons from extremely hot gas and violent events.',
      examples:
        'X-ray machines, neutron stars, black hole accretion disks, supernova remnants, galaxy clusters',
      detection: 'Grazing-incidence mirrors in space (Chandra, XMM-Newton)',
    },
    gamma: {
      name: 'Gamma-ray',
      lambda_min: 1e-13, // 1 fm (approx)
      lambda_max: 1e-9, // 0.01 nm
      color: '#1a0033',
      description: 'The highest energy photons! Gamma rays come from the most extreme events in the universe.',
      examples: 'Nuclear reactions, gamma-ray bursts (GRBs), pulsars, active galactic nuclei',
      detection: 'Scintillators, pair production detectors (Fermi, VERITAS)',
    },
  };

  function wavelengthToFrequency(lambdaCm) {
    return CONSTANTS.c / lambdaCm;
  }

  function frequencyToWavelength(nuHz) {
    return CONSTANTS.c / nuHz;
  }

  function wavelengthToEnergy(lambdaCm) {
    return (CONSTANTS.h * CONSTANTS.c) / lambdaCm;
  }

  function energyToWavelength(Eerg) {
    return (CONSTANTS.h * CONSTANTS.c) / Eerg;
  }

  function frequencyToEnergy(nuHz) {
    return CONSTANTS.h * nuHz;
  }

  function wavelengthToCm(value, unit) {
    switch (unit) {
      case 'km':
        return value * CONSTANTS.km_to_cm;
      case 'm':
        return value * CONSTANTS.m_to_cm;
      case 'mm':
        return value * CONSTANTS.mm_to_cm;
      case 'um':
        return value * CONSTANTS.um_to_cm;
      case 'nm':
        return value * CONSTANTS.nm_to_cm;
      case 'pm':
        return value * CONSTANTS.pm_to_cm;
      case 'fm':
        return value * CONSTANTS.fm_to_cm;
      default:
        return value;
    }
  }

  function cmToWavelength(cm, unit) {
    switch (unit) {
      case 'km':
        return cm / CONSTANTS.km_to_cm;
      case 'm':
        return cm / CONSTANTS.m_to_cm;
      case 'mm':
        return cm / CONSTANTS.mm_to_cm;
      case 'um':
        return cm / CONSTANTS.um_to_cm;
      case 'nm':
        return cm / CONSTANTS.nm_to_cm;
      case 'pm':
        return cm / CONSTANTS.pm_to_cm;
      case 'fm':
        return cm / CONSTANTS.fm_to_cm;
      default:
        return cm;
    }
  }

  function frequencyToHz(value, unit) {
    switch (unit) {
      case 'Hz':
        return value;
      case 'kHz':
        return value * CONSTANTS.kHz_to_Hz;
      case 'MHz':
        return value * CONSTANTS.MHz_to_Hz;
      case 'GHz':
        return value * CONSTANTS.GHz_to_Hz;
      case 'THz':
        return value * CONSTANTS.THz_to_Hz;
      case 'PHz':
        return value * CONSTANTS.PHz_to_Hz;
      case 'EHz':
        return value * CONSTANTS.EHz_to_Hz;
      default:
        return value;
    }
  }

  function hzToFrequency(hz, unit) {
    switch (unit) {
      case 'Hz':
        return hz;
      case 'kHz':
        return hz / CONSTANTS.kHz_to_Hz;
      case 'MHz':
        return hz / CONSTANTS.MHz_to_Hz;
      case 'GHz':
        return hz / CONSTANTS.GHz_to_Hz;
      case 'THz':
        return hz / CONSTANTS.THz_to_Hz;
      case 'PHz':
        return hz / CONSTANTS.PHz_to_Hz;
      case 'EHz':
        return hz / CONSTANTS.EHz_to_Hz;
      default:
        return hz;
    }
  }

  function energyToErg(value, unit) {
    switch (unit) {
      case 'erg':
        return value;
      case 'J':
        return value * CONSTANTS.J_to_erg;
      case 'eV':
        return value * CONSTANTS.eV_to_erg;
      case 'keV':
        return value * CONSTANTS.keV_to_eV * CONSTANTS.eV_to_erg;
      case 'MeV':
        return value * CONSTANTS.MeV_to_eV * CONSTANTS.eV_to_erg;
      default:
        return value;
    }
  }

  function ergToEnergy(erg, unit) {
    switch (unit) {
      case 'erg':
        return erg;
      case 'J':
        return erg / CONSTANTS.J_to_erg;
      case 'eV':
        return erg * CONSTANTS.erg_to_eV;
      case 'keV':
        return (erg * CONSTANTS.erg_to_eV) / CONSTANTS.keV_to_eV;
      case 'MeV':
        return (erg * CONSTANTS.erg_to_eV) / CONSTANTS.MeV_to_eV;
      default:
        return erg;
    }
  }

  function getBandForWavelength(lambdaCm) {
    for (const bandId in BANDS) {
      const band = BANDS[bandId];
      if (lambdaCm >= band.lambda_min && lambdaCm <= band.lambda_max) {
        return bandId;
      }
    }

    if (lambdaCm > BANDS.radio.lambda_max) return 'radio';
    if (lambdaCm < BANDS.gamma.lambda_min) return 'gamma';
    return 'visible';
  }

  const SPECTRUM_BAR = {
    lambdaMinCm: 1e-12, // 10 fm (right edge)
    lambdaMaxCm: 1e6, // 10 km (left edge)
  };

  // Logarithmic mapping from 10 km to 10 fm (teaching scale).
  function wavelengthToPosition(lambdaCm) {
    const lambdaClamped = Math.max(SPECTRUM_BAR.lambdaMinCm, Math.min(SPECTRUM_BAR.lambdaMaxCm, lambdaCm));
    const lambdaMinLog = Math.log10(SPECTRUM_BAR.lambdaMinCm);
    const lambdaMaxLog = Math.log10(SPECTRUM_BAR.lambdaMaxCm);
    const lambdaLog = Math.log10(lambdaClamped);
    return 100 - ((lambdaLog - lambdaMinLog) / (lambdaMaxLog - lambdaMinLog)) * 100;
  }

  function positionToWavelength(position) {
    const posClamped = Math.max(0, Math.min(100, position));
    const lambdaMinLog = Math.log10(SPECTRUM_BAR.lambdaMinCm);
    const lambdaMaxLog = Math.log10(SPECTRUM_BAR.lambdaMaxCm);
    const lambdaLog = lambdaMaxLog - (posClamped / 100) * (lambdaMaxLog - lambdaMinLog);
    return Math.pow(10, lambdaLog);
  }

  function formatWavelength(lambdaCm) {
    if (lambdaCm >= 1e5) {
      return { value: (lambdaCm / 1e5).toPrecision(3), unit: 'km' };
    } else if (lambdaCm >= 100) {
      return { value: (lambdaCm / 100).toPrecision(3), unit: 'm' };
    } else if (lambdaCm >= 0.1) {
      return { value: (lambdaCm * 10).toPrecision(3), unit: 'mm' };
    } else if (lambdaCm >= 1e-4) {
      return { value: (lambdaCm / 1e-4).toPrecision(3), unit: 'um' };
    } else if (lambdaCm >= 1e-7) {
      return { value: (lambdaCm / 1e-7).toPrecision(3), unit: 'nm' };
    } else if (lambdaCm >= 1e-10) {
      return { value: (lambdaCm / 1e-10).toPrecision(3), unit: 'pm' };
    }
    return { value: (lambdaCm / 1e-13).toPrecision(3), unit: 'fm' };
  }

  function formatFrequency(nuHz) {
    if (nuHz >= 1e18) return { value: (nuHz / 1e18).toPrecision(3), unit: 'EHz' };
    if (nuHz >= 1e15) return { value: (nuHz / 1e15).toPrecision(3), unit: 'PHz' };
    if (nuHz >= 1e12) return { value: (nuHz / 1e12).toPrecision(3), unit: 'THz' };
    if (nuHz >= 1e9) return { value: (nuHz / 1e9).toPrecision(3), unit: 'GHz' };
    if (nuHz >= 1e6) return { value: (nuHz / 1e6).toPrecision(3), unit: 'MHz' };
    if (nuHz >= 1e3) return { value: (nuHz / 1e3).toPrecision(3), unit: 'kHz' };
    return { value: nuHz.toPrecision(3), unit: 'Hz' };
  }

  function formatEnergy(Eerg) {
    const EeV = Eerg * CONSTANTS.erg_to_eV;
    if (EeV >= 1e6) return { value: (EeV / 1e6).toPrecision(3), unit: 'MeV' };
    if (EeV >= 1e3) return { value: (EeV / 1e3).toPrecision(3), unit: 'keV' };
    if (EeV >= 0.001) return { value: EeV.toPrecision(3), unit: 'eV' };
    return { value: Eerg.toPrecision(3), unit: 'erg' };
  }

  return {
    CONSTANTS,
    BANDS,
    SPECTRUM_BAR,
    wavelengthToFrequency,
    frequencyToWavelength,
    wavelengthToEnergy,
    energyToWavelength,
    frequencyToEnergy,
    wavelengthToCm,
    cmToWavelength,
    frequencyToHz,
    hzToFrequency,
    energyToErg,
    ergToEnergy,
    getBandForWavelength,
    wavelengthToPosition,
    positionToWavelength,
    formatWavelength,
    formatFrequency,
    formatEnergy,
  };
});

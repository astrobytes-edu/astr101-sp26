// demos/_assets/stellar-utils.js
// Shared stellar property utilities for ASTR 101 demos

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(
      require('./physics/astro-constants.js'),
      require('./blackbody-model.js')
    );
  } else {
    root.StellarUtils = factory(root.AstroConstants, root.BlackbodyModel);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants, BlackbodyModel) {
  'use strict';

  // === Mass → Physical Properties (Main Sequence) ===

  // Mass-luminosity relation: L/L☉
  function massToLuminosity(M) {
    if (M < 0.43) return 0.23 * Math.pow(M, 2.3);
    if (M < 2)    return Math.pow(M, 4);
    if (M < 55)   return 1.4 * Math.pow(M, 3.5);
    return 32000 * M;
  }

  // Mass-radius relation: R/R☉ ∝ M^0.8
  function massToRadius(M) {
    return Math.pow(M, 0.8);
  }

  // Effective temperature from L = 4πR²σT⁴
  // T/T☉ = (L/R²)^0.25
  function massToTemperature(M) {
    const L = massToLuminosity(M);
    const R = massToRadius(M);
    return 5778 * Math.pow(L / (R * R), 0.25);  // K
  }

  // Spectral type from temperature
  function temperatureToSpectralType(T) {
    if (T >= 30000) return 'O';
    if (T >= 10000) return 'B';
    if (T >= 7500)  return 'A';
    if (T >= 6000)  return 'F';
    if (T >= 5200)  return 'G';
    if (T >= 3700)  return 'K';
    if (T >= 2400)  return 'M';
    return 'L+';
  }

  // Temperature to RGB color - delegates to BlackbodyModel when available
  function temperatureToColor(T) {
    // Use BlackbodyModel if available (preferred - avoids code duplication)
    if (typeof BlackbodyModel !== 'undefined' && BlackbodyModel.temperatureToColor) {
      return BlackbodyModel.temperatureToColor(T);
    }

    // Fallback implementation for standalone use (when BlackbodyModel not loaded)
    if (!Number.isFinite(T) || T <= 0) {
      return { r: 0, g: 0, b: 0 };
    }
    let r, g, b;

    if (T < 1000) {
      r = Math.min(255, T / 4);
      g = 0;
      b = 0;
    } else if (T < 4000) {
      r = 255;
      g = Math.min(255, (T - 1000) / 12);
      b = 0;
    } else if (T < 6500) {
      r = 255;
      g = Math.min(255, 180 + (T - 4000) / 35);
      b = Math.min(255, (T - 4000) / 8);  // Faster blue increase for white-ish Sun
    } else if (T < 10000) {
      r = Math.max(200, 255 - (T - 6500) / 30);
      g = Math.max(200, 255 - (T - 6500) / 50);
      b = 255;
    } else {
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

  // Convenience: mass → color (via temperature)
  function massToColor(M) {
    const T = massToTemperature(M);
    return temperatureToColor(T);
  }

  function massToSpectralType(M) {
    const T = massToTemperature(M);
    return temperatureToSpectralType(T);
  }

  // === Unit Conversion ===

  const UNITS = {
    velocity: {
      'km/s':  { factor: 1,        label: 'km/s' },
      'AU/yr': { factor: 4.74047,  label: 'AU/yr' },
      'm/s':   { factor: 0.001,    label: 'm/s' },
      'cm/s':  { factor: 0.00001,  label: 'cm/s' }
    },
    period: {
      'yr':   { factor: 1,         label: 'yr' },
      'days': { factor: 365.25,    label: 'days' },
      'hr':   { factor: 8766,      label: 'hr' }
    },
    distance: {
      'AU':   { factor: 1,         label: 'AU' },
      'km':   { factor: AstroConstants ? AstroConstants.LENGTH.KM_PER_AU : 1.496e8, label: 'km' },
      'R☉':   { factor: 215.03,    label: 'R☉' }
    }
  };

  function convertVelocity(v_kms, targetUnit) {
    return v_kms / UNITS.velocity[targetUnit].factor;
  }

  function formatVelocity(v_kms, targetUnit) {
    const converted = convertVelocity(v_kms, targetUnit);
    const label = UNITS.velocity[targetUnit].label;

    if (Math.abs(converted) >= 1000) {
      return `${converted.toExponential(2)} ${label}`;
    } else if (Math.abs(converted) >= 1) {
      return `${converted.toPrecision(3)} ${label}`;
    } else {
      return `${converted.toExponential(2)} ${label}`;
    }
  }

  return {
    massToLuminosity,
    massToRadius,
    massToTemperature,
    massToColor,
    massToSpectralType,
    temperatureToColor,
    temperatureToSpectralType,
    convertVelocity,
    formatVelocity,
    UNITS
  };
});

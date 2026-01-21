/**
 * Stellar Parallax Sandbox - Star Data
 * Real stellar parallax data from Gaia DR3 and Hipparcos catalogs
 *
 * Physics:
 * - d (pc) = 1 / p (arcsec)
 * - 1 pc = 3.26156 light-years
 * - 1 pc = 206265 AU
 *
 * Gaia precision classes:
 * - 'easy': p > 10 mas (nearby stars, trivial for Gaia)
 * - 'yes': p > 0.1 mas (most Milky Way stars)
 * - 'limit': p ~ 0.01-0.1 mas (Gaia's precision limit)
 * - 'no': p < 0.01 mas (beyond Gaia's reach)
 */

const STAR_DATA = {
  // Physical constants
  PC_TO_LY: 3.26156,      // 1 parsec = 3.26156 light-years
  PC_TO_AU: 206265,       // 1 parsec = 206,265 AU
  MAS_TO_ARCSEC: 0.001,   // 1 milliarcsecond = 0.001 arcsecond

  // Measurement precision (in arcseconds)
  PRECISION: {
    hipparcos: 0.001,     // ~1 milliarcsecond (Hipparcos satellite, 1989-1993)
    gaia: 0.00002         // ~0.02 milliarcseconds (Gaia satellite, 2013-present)
  },

  /**
   * Star presets with real Gaia/Hipparcos parallax data
   * All parallax values (p) are in arcseconds
   * Distances verified: d_pc = 1/p
   */
  STARS: [
    // ========================================
    // NEARBY STARS (Gaia: easy)
    // ========================================
    {
      name: 'Proxima Centauri',
      d_pc: 1.3012,
      p: 0.7685,           // Gaia DR3: 768.5 mas
      d_ly: 4.2441,
      gaia: 'easy',
      category: 'nearby',
      description: 'Closest star to the Sun'
    },
    {
      name: 'Alpha Centauri A',
      d_pc: 1.3385,
      p: 0.7473,           // Gaia DR3: 747.3 mas
      d_ly: 4.365,
      gaia: 'easy',
      category: 'nearby',
      description: 'Closest Sun-like star'
    },
    {
      name: "Barnard's Star",
      d_pc: 1.8282,
      p: 0.5470,           // Gaia DR3: 547.0 mas
      d_ly: 5.963,
      gaia: 'easy',
      category: 'nearby',
      description: 'Fastest-moving star in sky'
    },
    {
      name: 'Sirius',
      d_pc: 2.6371,
      p: 0.3792,           // Gaia DR3: 379.2 mas
      d_ly: 8.601,
      gaia: 'easy',
      category: 'nearby',
      description: 'Brightest star in night sky'
    },
    {
      name: 'Vega',
      d_pc: 7.6784,
      p: 0.1302,           // Gaia DR3: 130.2 mas
      d_ly: 25.04,
      gaia: 'easy',
      category: 'nearby',
      description: 'Fifth brightest star'
    },
    {
      name: 'Arcturus',
      d_pc: 11.26,
      p: 0.0888,           // Gaia DR3: 88.8 mas
      d_ly: 36.7,
      gaia: 'easy',
      category: 'nearby',
      description: 'Brightest star in northern hemisphere'
    },

    // ========================================
    // INTERMEDIATE STARS (Gaia: yes)
    // ========================================
    {
      name: 'Polaris',
      d_pc: 132,
      p: 0.00758,          // Gaia DR3: 7.58 mas
      d_ly: 431,
      gaia: 'yes',
      category: 'distant',
      description: 'North Star (Cepheid variable)'
    },
    {
      name: 'Betelgeuse',
      d_pc: 168,
      p: 0.00595,          // Gaia DR3: 5.95 mas (uncertain due to size)
      d_ly: 548,
      gaia: 'yes',
      category: 'distant',
      description: 'Red supergiant in Orion'
    },
    {
      name: 'Rigel',
      d_pc: 265,
      p: 0.00377,          // Gaia DR3: 3.77 mas
      d_ly: 864,
      gaia: 'yes',
      category: 'distant',
      description: 'Blue supergiant in Orion'
    },
    {
      name: 'Deneb',
      d_pc: 802,
      p: 0.00125,          // Gaia DR3: 1.25 mas
      d_ly: 2615,
      gaia: 'yes',
      category: 'distant',
      description: 'Blue supergiant in Cygnus'
    },

    // ========================================
    // DISTANT OBJECTS (Gaia: limit or no)
    // ========================================
    {
      name: 'Galactic Center',
      d_pc: 8178,
      p: 0.000122,         // ~0.12 mas (at Gaia precision limit)
      d_ly: 26673,
      gaia: 'limit',
      category: 'distant',
      description: 'Center of Milky Way (Sgr A*)'
    },
    {
      name: 'Large Magellanic Cloud',
      d_pc: 49970,
      p: 0.00002,          // ~0.02 mas (at Gaia limit)
      d_ly: 163000,
      gaia: 'limit',
      category: 'distant',
      description: 'Satellite galaxy of Milky Way'
    },
    {
      name: 'Andromeda Galaxy (M31)',
      d_pc: 778000,
      p: null,             // 0.0000013 arcsec - unmeasurable
      d_ly: 2537000,
      gaia: 'no',
      category: 'distant',
      description: 'Nearest large galaxy'
    }
  ],

  /**
   * Get star by name
   */
  getByName(name) {
    return this.STARS.find(s => s.name === name);
  },

  /**
   * Get stars by category
   */
  getByCategory(category) {
    return this.STARS.filter(s => s.category === category);
  },

  /**
   * Get stars by Gaia measurability
   */
  getByGaia(gaiaClass) {
    return this.STARS.filter(s => s.gaia === gaiaClass);
  },

  /**
   * Calculate parallax from distance
   * @param {number} d_pc - Distance in parsecs
   * @returns {number} Parallax in arcseconds
   */
  parallaxFromDistance(d_pc) {
    if (d_pc <= 0) return null;
    return 1 / d_pc;
  },

  /**
   * Calculate distance from parallax
   * @param {number} p_arcsec - Parallax in arcseconds
   * @returns {number} Distance in parsecs
   */
  distanceFromParallax(p_arcsec) {
    if (p_arcsec <= 0) return null;
    return 1 / p_arcsec;
  },

  /**
   * Convert parsecs to light-years
   */
  pcToLy(d_pc) {
    return d_pc * this.PC_TO_LY;
  },

  /**
   * Convert light-years to parsecs
   */
  lyToPc(d_ly) {
    return d_ly / this.PC_TO_LY;
  },

  /**
   * Determine Gaia measurability class for a given parallax
   * @param {number} p_arcsec - Parallax in arcseconds
   * @param {string} precision - 'hipparcos' or 'gaia'
   * @returns {object} { class: string, measurable: boolean, status: string }
   */
  getMeasurability(p_arcsec, precision = 'gaia') {
    const threshold = this.PRECISION[precision];

    if (p_arcsec === null || p_arcsec <= 0) {
      return {
        class: 'no',
        measurable: false,
        status: 'Too distant to measure'
      };
    }

    if (precision === 'gaia') {
      if (p_arcsec > 0.01) {
        return { class: 'easy', measurable: true, status: 'Gaia: easy' };
      } else if (p_arcsec > 0.0001) {
        return { class: 'yes', measurable: true, status: 'Gaia: measurable' };
      } else if (p_arcsec > threshold) {
        return { class: 'limit', measurable: true, status: 'Gaia: at limit' };
      } else {
        return { class: 'no', measurable: false, status: 'Beyond Gaia' };
      }
    } else {
      // Hipparcos
      if (p_arcsec > 0.01) {
        return { class: 'easy', measurable: true, status: 'Hipparcos: easy' };
      } else if (p_arcsec > threshold) {
        return { class: 'limit', measurable: true, status: 'Hipparcos: at limit' };
      } else {
        return { class: 'no', measurable: false, status: 'Beyond Hipparcos' };
      }
    }
  },

  /**
   * Format parallax for display
   * @param {number} p_arcsec - Parallax in arcseconds
   * @returns {object} { value: string, unit: string }
   */
  formatParallax(p_arcsec) {
    if (p_arcsec === null) {
      return { value: '~0', unit: '' };
    }

    if (p_arcsec >= 0.1) {
      return { value: p_arcsec.toFixed(3), unit: 'arcsec' };
    } else if (p_arcsec >= 0.001) {
      return { value: (p_arcsec * 1000).toFixed(2), unit: 'mas' };
    } else if (p_arcsec >= 0.000001) {
      return { value: (p_arcsec * 1000000).toFixed(1), unit: 'uas' };
    } else {
      return { value: '< 1', unit: 'uas' };
    }
  },

  /**
   * Format distance for display
   * @param {number} d_pc - Distance in parsecs
   * @returns {object} { value: string, unit: string }
   */
  formatDistance(d_pc) {
    if (d_pc < 1000) {
      return { value: d_pc.toPrecision(3), unit: 'pc' };
    } else if (d_pc < 1000000) {
      return { value: (d_pc / 1000).toPrecision(3), unit: 'kpc' };
    } else {
      return { value: (d_pc / 1000000).toPrecision(3), unit: 'Mpc' };
    }
  }
};

// Export for use in parallax.js
if (typeof window !== 'undefined') {
  window.STAR_DATA = STAR_DATA;
}

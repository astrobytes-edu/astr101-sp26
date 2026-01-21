/**
 * Telescope Resolution Sandbox - Telescope Data
 * Real telescope apertures and characteristics
 *
 * All apertures in meters, wavelengths in cm (CGS)
 */

const TELESCOPES = [
  // Human eye and binoculars
  {
    name: 'Human Eye',
    aperture: 0.007,      // 7mm dark-adapted pupil
    location: 'Ground',
    type: 'optical',
    notes: 'Dark-adapted pupil diameter ~7mm'
  },
  {
    name: 'Binoculars (7x50)',
    aperture: 0.05,       // 50mm
    location: 'Ground',
    type: 'optical',
    notes: 'Standard astronomical binoculars'
  },

  // Amateur telescopes
  {
    name: 'Small Refractor',
    aperture: 0.08,       // 80mm
    location: 'Ground',
    type: 'optical',
    notes: 'Typical beginner telescope'
  },
  {
    name: 'Amateur Telescope',
    aperture: 0.2,        // 200mm (8")
    location: 'Ground',
    type: 'optical',
    notes: 'Popular Dobsonian size'
  },

  // Professional optical telescopes
  {
    name: 'Hubble Space Telescope',
    aperture: 2.4,
    location: 'Space',
    type: 'optical',
    notes: 'No atmospheric distortion',
    wavelengths: ['UV', 'Visible', 'Near-IR']
  },
  {
    name: 'James Webb Space Telescope',
    aperture: 6.5,
    location: 'Space',
    type: 'infrared',
    notes: 'Optimized for infrared',
    wavelengths: ['Near-IR', 'Mid-IR']
  },
  {
    name: 'Keck Telescope',
    aperture: 10,
    location: 'Ground (Mauna Kea)',
    type: 'optical',
    notes: 'Segmented mirror, adaptive optics',
    wavelengths: ['Visible', 'Near-IR']
  },
  {
    name: 'Very Large Telescope (VLT)',
    aperture: 8.2,
    location: 'Ground (Paranal)',
    type: 'optical',
    notes: '4 unit telescopes, interferometry capable',
    wavelengths: ['Visible', 'Near-IR']
  },
  {
    name: 'Gemini',
    aperture: 8.1,
    location: 'Ground (Hawaii/Chile)',
    type: 'optical',
    notes: 'Twin 8.1m telescopes',
    wavelengths: ['Visible', 'Near-IR']
  },
  {
    name: 'Subaru',
    aperture: 8.2,
    location: 'Ground (Mauna Kea)',
    type: 'optical',
    notes: 'Single monolithic mirror'
  },

  // Extremely Large Telescopes (future)
  {
    name: 'Thirty Meter Telescope (TMT)',
    aperture: 30,
    location: 'Ground (planned)',
    type: 'optical',
    notes: 'Under construction',
    wavelengths: ['Visible', 'Near-IR']
  },
  {
    name: 'Extremely Large Telescope (ELT)',
    aperture: 39,
    location: 'Ground (Cerro Armazones)',
    type: 'optical',
    notes: 'Under construction, 39.3m primary',
    wavelengths: ['Visible', 'Near-IR']
  },
  {
    name: 'Giant Magellan Telescope (GMT)',
    aperture: 24.5,
    location: 'Ground (Las Campanas)',
    type: 'optical',
    notes: '7 x 8.4m mirrors',
    wavelengths: ['Visible', 'Near-IR']
  },

  // Radio telescopes
  {
    name: 'Green Bank Telescope (GBT)',
    aperture: 100,
    location: 'Ground (West Virginia)',
    type: 'radio',
    notes: 'Largest fully steerable',
    defaultWavelength: 21  // 21 cm HI line
  },
  {
    name: 'Arecibo',
    aperture: 305,
    location: 'Ground (Puerto Rico)',
    type: 'radio',
    notes: 'Collapsed 2020, historic reference',
    defaultWavelength: 21
  },
  {
    name: 'FAST',
    aperture: 500,
    location: 'Ground (China)',
    type: 'radio',
    notes: 'Largest filled-aperture radio telescope',
    defaultWavelength: 21
  },

  // Interferometers (effective baseline)
  {
    name: 'Very Large Array (VLA)',
    aperture: 36000,      // 36 km maximum baseline
    location: 'Ground (New Mexico)',
    type: 'radio-interferometer',
    notes: '27 antennas, Y-configuration',
    defaultWavelength: 21
  },
  {
    name: 'ALMA',
    aperture: 16000,      // 16 km maximum baseline
    location: 'Ground (Atacama)',
    type: 'mm-interferometer',
    notes: 'Millimeter/submillimeter',
    defaultWavelength: 0.13  // 1.3mm
  },
  {
    name: 'Event Horizon Telescope',
    aperture: 10000000,   // ~10,000 km (Earth diameter)
    location: 'VLBI Network',
    type: 'mm-interferometer',
    notes: 'First black hole image',
    defaultWavelength: 0.13  // 1.3mm
  }
];

/**
 * Wavelength band definitions
 * Wavelengths in cm (CGS)
 */
const WAVELENGTH_BANDS = {
  'UV': {
    name: 'Ultraviolet',
    lambda_cm: 3e-5,        // 300 nm
    lambda_nm: 300,
    color: '#8b00ff',
    notes: 'Blocked by atmosphere, space-only'
  },
  'Visible': {
    name: 'Visible Light',
    lambda_cm: 5.5e-5,      // 550 nm (green-yellow)
    lambda_nm: 550,
    color: '#00ff00',
    notes: 'Human-visible wavelengths'
  },
  'Near-IR': {
    name: 'Near-Infrared',
    lambda_cm: 2.2e-4,      // 2.2 um (K-band)
    lambda_nm: 2200,
    color: '#ff4500',
    notes: 'Penetrates dust'
  },
  'Mid-IR': {
    name: 'Mid-Infrared',
    lambda_cm: 1e-3,        // 10 um
    lambda_nm: 10000,
    color: '#8b0000',
    notes: 'Thermal emission, JWST specialty'
  },
  'Radio-21cm': {
    name: 'Radio (21 cm)',
    lambda_cm: 21,          // 21 cm HI hyperfine
    lambda_nm: 2.1e8,
    color: '#ff6600',
    notes: 'Hydrogen 21-cm line'
  },
  'mm': {
    name: 'Millimeter',
    lambda_cm: 0.13,        // 1.3 mm
    lambda_nm: 1.3e6,
    color: '#cc3300',
    notes: 'EHT observing wavelength'
  }
};

/**
 * Atmospheric seeing conditions
 * Values in arcseconds
 */
const SEEING_CONDITIONS = {
  excellent: {
    value: 0.5,
    label: 'Excellent',
    notes: 'Best high-altitude sites'
  },
  good: {
    value: 0.8,
    label: 'Good',
    notes: 'Typical good night'
  },
  average: {
    value: 1.0,
    label: 'Average',
    notes: 'Typical conditions'
  },
  fair: {
    value: 1.5,
    label: 'Fair',
    notes: 'Somewhat turbulent'
  },
  poor: {
    value: 2.5,
    label: 'Poor',
    notes: 'High turbulence'
  }
};

/**
 * Example binary star systems for resolution tests
 * Separations in arcseconds
 */
const BINARY_EXAMPLES = [
  {
    name: 'Mizar A-B',
    separation: 14.4,
    notes: 'Easily split by binoculars'
  },
  {
    name: 'Albireo',
    separation: 34.3,
    notes: 'Beautiful color contrast'
  },
  {
    name: 'Castor AB',
    separation: 5.0,
    notes: 'Needs small telescope'
  },
  {
    name: 'Sirius A-B',
    separation: 10.0,      // varies 3-11"
    notes: 'White dwarf companion (variable sep)'
  },
  {
    name: 'Alpha Centauri',
    separation: 4.0,       // varies 2-22"
    notes: 'Nearest star system'
  },
  {
    name: 'Capella spectroscopic',
    separation: 0.056,
    notes: 'Needs interferometry'
  }
];

// Export for use in main script
window.TELESCOPES = TELESCOPES;
window.WAVELENGTH_BANDS = WAVELENGTH_BANDS;
window.SEEING_CONDITIONS = SEEING_CONDITIONS;
window.BINARY_EXAMPLES = BINARY_EXAMPLES;

/**
 * Astronomical Object Data for EM Spectrum Explorer
 *
 * What objects emit in which bands and why
 */

window.ASTRO_OBJECTS = [
  // Stars by type
  {
    name: 'O/B Stars',
    bands: ['UV', 'Visible'],
    why: 'Surface temperatures of 10,000-50,000 K make them peak in ultraviolet. Their intense UV radiation ionizes surrounding gas.',
    telescope: 'Hubble, GALEX, Keck',
    icon: '\u2B50'  // Star
  },
  {
    name: 'Sun (G Star)',
    bands: ['Visible', 'UV', 'X-ray'],
    why: 'At 5,778 K, the Sun peaks in visible green-yellow. The corona emits X-rays at millions of degrees.',
    telescope: 'Ground optical, SDO, Hinode',
    icon: '\u2600\uFE0F'  // Sun
  },
  {
    name: 'Red Dwarfs (M Stars)',
    bands: ['Infrared', 'Visible'],
    why: 'Cool surfaces (2,500-3,900 K) emit mostly in red and infrared. Most common stars in the galaxy.',
    telescope: 'JWST, Spitzer, ground IR',
    icon: '\uD83D\uDD34'  // Red circle
  },
  {
    name: 'Brown Dwarfs',
    bands: ['Infrared'],
    why: 'Too cool to sustain hydrogen fusion (500-2,500 K). Emit almost entirely in infrared.',
    telescope: 'JWST, Spitzer, WISE',
    icon: '\uD83D\uDFE4'  // Brown circle
  },

  // Stellar remnants
  {
    name: 'White Dwarfs',
    bands: ['UV', 'Visible'],
    why: 'Hot stellar cores (8,000-40,000 K) exposed after red giant phase. Emit strongly in UV.',
    telescope: 'Hubble, GALEX, Chandra',
    icon: '\u26AA'  // White circle
  },
  {
    name: 'Neutron Stars',
    bands: ['X-ray', 'Gamma-ray', 'Radio'],
    why: 'Extreme surface temperatures (millions K) and magnetic fields. Pulsars emit radio beams from magnetic poles.',
    telescope: 'Chandra, Fermi, VLA, FAST',
    icon: '\uD83C\uDF00'  // Cyclone/pulsar
  },
  {
    name: 'Black Holes (Accreting)',
    bands: ['X-ray', 'Radio', 'Gamma-ray'],
    why: 'Accretion disks heated to millions of degrees emit X-rays. Jets produce radio and gamma-ray emission.',
    telescope: 'Chandra, Event Horizon Telescope, Fermi',
    icon: '\u26AB'  // Black circle
  },

  // Interstellar medium
  {
    name: 'Dust Clouds',
    bands: ['Far-IR', 'Submillimeter'],
    why: 'Cold dust (10-100 K) absorbs visible light and re-emits in far-infrared. Obscures optical observations.',
    telescope: 'Herschel, ALMA, JWST',
    icon: '\u2601\uFE0F'  // Cloud
  },
  {
    name: 'Emission Nebulae',
    bands: ['Visible', 'Infrared', 'Radio'],
    why: 'Hot gas ionized by nearby O/B stars. Hydrogen-alpha (656 nm) gives them their red glow.',
    telescope: 'Hubble, ground optical, VLA',
    icon: '\uD83C\uDF0C'  // Milky Way / nebula
  },
  {
    name: 'Molecular Clouds',
    bands: ['Radio', 'Submillimeter'],
    why: 'Cold molecular gas (10-50 K) emits at radio frequencies. CO and other molecules have characteristic lines.',
    telescope: 'ALMA, VLA, NOEMA',
    icon: '\u2601\uFE0F'
  },

  // Galaxies
  {
    name: 'Spiral Galaxies',
    bands: ['Visible', 'UV', 'Infrared', 'Radio'],
    why: 'Mix of old (red) and young (blue) stars, dust lanes (IR), and neutral hydrogen (21 cm radio).',
    telescope: 'Hubble, JWST, VLA, GALEX',
    icon: '\uD83C\uDF00'  // Spiral
  },
  {
    name: 'Elliptical Galaxies',
    bands: ['Visible', 'X-ray'],
    why: 'Dominated by old red stars. Hot gas between galaxies in clusters emits X-rays.',
    telescope: 'Hubble, Chandra, ground optical',
    icon: '\uD83D\uDFE0'  // Orange circle
  },
  {
    name: 'Starburst Galaxies',
    bands: ['Infrared', 'UV', 'Radio'],
    why: 'Intense star formation heats dust (IR). Young stars emit UV. Supernovae produce radio emission.',
    telescope: 'JWST, Herschel, VLA, GALEX',
    icon: '\uD83D\uDCA5'  // Explosion
  },

  // Active galactic nuclei
  {
    name: 'Quasars/AGN',
    bands: ['All bands'],
    why: 'Supermassive black holes accreting matter emit across entire spectrum. The most luminous objects in the universe.',
    telescope: 'All major observatories',
    icon: '\uD83D\uDCA0'  // Diamond with dot
  },
  {
    name: 'Blazars',
    bands: ['Gamma-ray', 'Radio', 'X-ray'],
    why: 'AGN with jets pointed toward Earth. Relativistic beaming boosts gamma-ray and radio emission.',
    telescope: 'Fermi, VLA, VERITAS',
    icon: '\u26A1'  // Lightning
  },

  // Cosmic backgrounds
  {
    name: 'CMB',
    bands: ['Microwave'],
    why: 'Remnant radiation from 380,000 years after Big Bang. Cooled from 3000 K to 2.725 K by cosmic expansion.',
    telescope: 'Planck, WMAP, ground CMB experiments',
    icon: '\uD83C\uDF0D'  // Globe
  },
  {
    name: 'Cosmic Infrared Background',
    bands: ['Far-IR'],
    why: 'Accumulated infrared light from all galaxies across cosmic history. Dominated by dusty star-forming galaxies.',
    telescope: 'Herschel, Spitzer, JWST',
    icon: '\uD83C\uDF03'  // Night sky
  },

  // Solar system
  {
    name: 'Planets (thermal)',
    bands: ['Infrared'],
    why: 'Planets emit thermal radiation based on their temperature. Jupiter at 125 K peaks in mid-infrared.',
    telescope: 'JWST, Spitzer, ground IR',
    icon: '\uD83E\uDE90'  // Ringed planet
  },
  {
    name: 'Comets',
    bands: ['Visible', 'UV', 'Radio'],
    why: 'Dust tail reflects sunlight (visible). Gas tail fluoresces in UV. Water and CO emit at radio frequencies.',
    telescope: 'Hubble, ground optical, ALMA',
    icon: '\u2604\uFE0F'  // Comet
  }
];

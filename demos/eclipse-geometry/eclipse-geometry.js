/**
 * Eclipse Geometry Demo
 * Interactive demonstration of why eclipses don't happen every month
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  const CENTER = { x: 200, y: 200 };
  const ORBIT_RADIUS = 100;
  const SYNODIC_MONTH = 29.53; // days

  // Eclipse thresholds (degrees from ecliptic plane)
  // Based on actual eclipse limits from node (converted to height above ecliptic)
  //
  // TOTAL eclipses require very close alignment:
  // - Total solar: Moon within ~10.5° of node → height = 5.145° × sin(10.5°) ≈ 0.94°
  // - Total lunar: Moon within ~4.6° of node → height = 5.145° × sin(4.6°) ≈ 0.41°
  //
  // PARTIAL eclipses have larger windows:
  // - Partial solar: Moon within ~18.5° of node → height = 5.145° × sin(18.5°) ≈ 1.63°
  // - Partial lunar: Moon within ~12.2° of node → height = 5.145° × sin(12.2°) ≈ 1.09°

  const TOTAL_SOLAR_THRESHOLD = 0.94;    // Total/annular solar eclipse
  const PARTIAL_SOLAR_THRESHOLD = 1.63;  // Any solar eclipse (including partial)
  const TOTAL_LUNAR_THRESHOLD = 0.41;    // Total lunar eclipse (umbral)
  const PARTIAL_LUNAR_THRESHOLD = 1.09;  // Any lunar eclipse (including penumbral)

  // ============================================
  // State
  // ============================================

  const state = {
    moonAngle: 0,           // Angle around orbit (0 = right/full moon position)
    orbitalTilt: 5.145,     // Degrees of orbital tilt
    nodeAngle: 0,           // Angle of ascending node (rotates slowly)
    animationId: null,
    isAnimating: false,

    // Simulation stats (track total and partial separately)
    totalSolarEclipses: 0,
    partialSolarEclipses: 0,
    totalLunarEclipses: 0,
    partialLunarEclipses: 0,
    yearsSimulated: 0,

    // Eclipse log for table display
    eclipseLog: [],
    showLog: false
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // SVG elements
      moonTopCircle: document.getElementById('moon-top-circle'),
      moonSide: document.getElementById('moon-side'),
      moonOrbit: document.getElementById('moon-orbit'),
      moonPathSide: document.getElementById('moon-path-side'),
      heightLine: document.getElementById('height-line'),
      heightLabel: document.getElementById('height-label'),
      ascendingNode: document.getElementById('ascending-node'),
      descendingNode: document.getElementById('descending-node'),
      nodeSide1: document.getElementById('node-side-1'),
      nodeSide2: document.getElementById('node-side-2'),

      // Status
      eclipseStatus: document.getElementById('eclipse-status'),
      statusDetail: document.getElementById('status-detail'),

      // Controls
      tiltSlider: document.getElementById('tilt-slider'),
      tiltDisplay: document.getElementById('tilt-display'),
      phaseDisplay: document.getElementById('phase-display'),

      // Buttons
      btnNewMoon: document.getElementById('btn-new-moon'),
      btnFullMoon: document.getElementById('btn-full-moon'),
      btnAnimateMonth: document.getElementById('btn-animate-month'),
      btnAnimateYear: document.getElementById('btn-animate-year'),
      btnRunSim: document.getElementById('btn-run-sim'),
      btnStop: document.getElementById('btn-stop'),
      btnToggleLog: document.getElementById('btn-toggle-log'),
      btnReset: document.getElementById('btn-reset'),

      // Simulation slider
      simYearsSlider: document.getElementById('sim-years-slider'),
      simYearsDisplay: document.getElementById('sim-years-display'),

      // Stats
      statsPanel: document.getElementById('stats-panel'),
      statSolar: document.getElementById('stat-solar'),
      statLunar: document.getElementById('stat-lunar'),
      statYears: document.getElementById('stat-years'),

      // Eclipse log
      logPanel: document.getElementById('eclipse-log-panel'),
      logTable: document.getElementById('eclipse-log-table')
    };
  }

  // ============================================
  // Calculations
  // ============================================

  /**
   * Calculate Moon's height above/below ecliptic
   * @param {number} moonAngle - Moon's position in orbit (degrees)
   * @param {number} tilt - Orbital tilt (degrees)
   * @param {number} nodeAngle - Position of ascending node (degrees)
   * @returns {number} Height in degrees above ecliptic
   */
  function getMoonEclipticHeight(moonAngle, tilt, nodeAngle) {
    // Moon's height follows a sine wave as it orbits
    // Maximum height is at 90° from the nodes
    const angleFromNode = (moonAngle - nodeAngle) * Math.PI / 180;
    return tilt * Math.sin(angleFromNode);
  }

  /**
   * Get phase name from moon angle
   * 0 = Full Moon (opposite Sun), 180 = New Moon (toward Sun)
   */
  function getPhase(moonAngle) {
    const normalized = ((moonAngle % 360) + 360) % 360;

    if (normalized < 22.5 || normalized >= 337.5) return 'Full Moon';
    if (normalized < 67.5) return 'Waning Gibbous';
    if (normalized < 112.5) return 'Third Quarter';
    if (normalized < 157.5) return 'Waning Crescent';
    if (normalized < 202.5) return 'New Moon';
    if (normalized < 247.5) return 'Waxing Crescent';
    if (normalized < 292.5) return 'First Quarter';
    return 'Waxing Gibbous';
  }

  /**
   * Check if eclipse is possible
   * @returns {object} { type: 'none'|'solar'|'lunar', detail: string }
   */
  function checkEclipse() {
    const height = getMoonEclipticHeight(state.moonAngle, state.orbitalTilt, state.nodeAngle);
    const absHeight = Math.abs(height);
    const phase = getPhase(state.moonAngle);

    // Check for solar eclipse (New Moon)
    if (phase === 'New Moon') {
      if (absHeight < TOTAL_SOLAR_THRESHOLD) {
        return {
          type: 'total-solar',
          detail: `TOTAL solar eclipse! Moon is only ${absHeight.toFixed(2)}° from ecliptic`
        };
      }
      if (absHeight < PARTIAL_SOLAR_THRESHOLD) {
        return {
          type: 'partial-solar',
          detail: `Partial solar eclipse — Moon is ${absHeight.toFixed(1)}° from ecliptic`
        };
      }
    }

    // Check for lunar eclipse (Full Moon)
    if (phase === 'Full Moon') {
      if (absHeight < TOTAL_LUNAR_THRESHOLD) {
        return {
          type: 'total-lunar',
          detail: `TOTAL lunar eclipse! Moon is only ${absHeight.toFixed(2)}° from ecliptic`
        };
      }
      if (absHeight < PARTIAL_LUNAR_THRESHOLD) {
        return {
          type: 'partial-lunar',
          detail: `Partial lunar eclipse — Moon is ${absHeight.toFixed(1)}° from ecliptic`
        };
      }
    }

    const direction = height > 0 ? 'above' : 'below';
    if (phase === 'New Moon' || phase === 'Full Moon') {
      return {
        type: 'none',
        detail: `Moon is ${absHeight.toFixed(1)}° ${direction} the ecliptic — no eclipse`
      };
    }

    return {
      type: 'none',
      detail: `${phase} — eclipses only occur at new/full moon`
    };
  }

  // ============================================
  // Visualization Updates
  // ============================================

  function updateVisualization() {
    const angleRad = state.moonAngle * Math.PI / 180;
    const nodeRad = state.nodeAngle * Math.PI / 180;

    // Top view: Moon position on tilted orbit
    // The orbit appears as an ellipse when tilted (but we keep it circular for simplicity)
    const moonX = CENTER.x + ORBIT_RADIUS * Math.cos(angleRad);
    const moonY = CENTER.y - ORBIT_RADIUS * Math.sin(angleRad);

    elements.moonTopCircle.setAttribute('cx', moonX);
    elements.moonTopCircle.setAttribute('cy', moonY);

    // Node positions (on the line of nodes)
    const ascX = CENTER.x + ORBIT_RADIUS * Math.cos(nodeRad);
    const ascY = CENTER.y - ORBIT_RADIUS * Math.sin(nodeRad);
    const descX = CENTER.x + ORBIT_RADIUS * Math.cos(nodeRad + Math.PI);
    const descY = CENTER.y - ORBIT_RADIUS * Math.sin(nodeRad + Math.PI);

    elements.ascendingNode.setAttribute('cx', ascX);
    elements.ascendingNode.setAttribute('cy', ascY);
    elements.descendingNode.setAttribute('cx', descX);
    elements.descendingNode.setAttribute('cy', descY);

    // Side view: Moon's vertical position
    const height = getMoonEclipticHeight(state.moonAngle, state.orbitalTilt, state.nodeAngle);

    // Map angle to horizontal position in side view
    // New moon (180) on left near Sun, Full moon (0) on right
    const sideX = 350 - (state.moonAngle / 360) * 250;
    const sideY = 100 - height * 8; // Scale height for visibility

    elements.moonSide.setAttribute('cx', sideX);
    elements.moonSide.setAttribute('cy', sideY);

    // Height indicator
    elements.heightLine.setAttribute('x1', sideX);
    elements.heightLine.setAttribute('x2', sideX);
    elements.heightLine.setAttribute('y1', 100);
    elements.heightLine.setAttribute('y2', sideY);

    elements.heightLabel.setAttribute('x', sideX + 10);
    elements.heightLabel.setAttribute('y', (100 + sideY) / 2);
    elements.heightLabel.textContent = `${height >= 0 ? '+' : ''}${height.toFixed(1)}°`;

    // Update sinusoidal path for side view
    updateMoonPath();

    // Update nodes on side view
    // Nodes are where the path crosses the ecliptic (y=100)
    const nodeProgress1 = state.nodeAngle / 360;
    const nodeProgress2 = ((state.nodeAngle + 180) % 360) / 360;
    elements.nodeSide1.setAttribute('cx', 350 - nodeProgress1 * 250);
    elements.nodeSide2.setAttribute('cx', 350 - nodeProgress2 * 250);
  }

  function updateMoonPath() {
    // Draw sinusoidal path showing Moon's trajectory
    let pathD = '';
    for (let i = 0; i <= 360; i += 5) {
      const x = 350 - (i / 360) * 250;
      const h = getMoonEclipticHeight(i, state.orbitalTilt, state.nodeAngle);
      const y = 100 - h * 8;

      if (i === 0) {
        pathD = `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    }
    elements.moonPathSide.setAttribute('d', pathD);
  }

  function updateStatus() {
    const eclipse = checkEclipse();

    // Map type to CSS class (total vs partial styling)
    let cssClass = 'miss';
    if (eclipse.type.includes('solar')) cssClass = 'solar';
    if (eclipse.type.includes('lunar')) cssClass = 'lunar';
    if (eclipse.type.includes('total')) cssClass += ' total';

    elements.eclipseStatus.className = 'eclipse-status ' + cssClass;

    switch (eclipse.type) {
      case 'total-solar':
        elements.eclipseStatus.textContent = '☀️ TOTAL SOLAR ECLIPSE!';
        break;
      case 'partial-solar':
        elements.eclipseStatus.textContent = '🌤️ Partial Solar Eclipse';
        break;
      case 'total-lunar':
        elements.eclipseStatus.textContent = '🌕 TOTAL LUNAR ECLIPSE!';
        break;
      case 'partial-lunar':
        elements.eclipseStatus.textContent = '🌔 Partial Lunar Eclipse';
        break;
      default:
        elements.eclipseStatus.textContent = 'NO ECLIPSE';
    }

    elements.statusDetail.textContent = eclipse.detail;
    elements.phaseDisplay.textContent = getPhase(state.moonAngle);
  }

  function updateStats() {
    // Show total eclipses prominently, partial in parentheses
    const totalSolar = state.totalSolarEclipses;
    const allSolar = state.totalSolarEclipses + state.partialSolarEclipses;
    const totalLunar = state.totalLunarEclipses;
    const allLunar = state.totalLunarEclipses + state.partialLunarEclipses;

    elements.statSolar.innerHTML = `${totalSolar} <small style="opacity:0.6">(${allSolar} total)</small>`;
    elements.statLunar.innerHTML = `${totalLunar} <small style="opacity:0.6">(${allLunar} total)</small>`;
    elements.statYears.textContent = state.yearsSimulated.toFixed(1);
  }

  function update() {
    updateVisualization();
    updateStatus();
  }

  // ============================================
  // Drag Handling
  // ============================================

  function setupDrag() {
    const moonTop = document.getElementById('moon-top');
    const svg = document.getElementById('top-view-svg');
    let isDragging = false;

    function getAngle(event) {
      const rect = svg.getBoundingClientRect();
      const svgX = (event.clientX - rect.left) / rect.width * 400;
      const svgY = (event.clientY - rect.top) / rect.height * 400;

      const dx = svgX - CENTER.x;
      const dy = CENTER.y - svgY;

      return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    moonTop.addEventListener('mousedown', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    });

    moonTop.addEventListener('touchstart', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      state.moonAngle = getAngle(e);
      update();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches.length) return;
      const touch = e.touches[0];
      state.moonAngle = getAngle(touch);
      update();
    }, { passive: false });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  // ============================================
  // Controls
  // ============================================

  function setupControls() {
    // Tilt slider
    elements.tiltSlider.addEventListener('input', () => {
      state.orbitalTilt = parseFloat(elements.tiltSlider.value) / 10;
      elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';
      update();
    });

    // Phase buttons
    elements.btnNewMoon.addEventListener('click', () => {
      stopAnimation();
      animateToAngle(180);
    });

    elements.btnFullMoon.addEventListener('click', () => {
      stopAnimation();
      animateToAngle(0);
    });

    // Animation buttons
    elements.btnAnimateMonth.addEventListener('click', () => {
      animateMonth();
    });

    elements.btnAnimateYear.addEventListener('click', () => {
      animateYear();
    });

    // Simulation years slider (logarithmic: 0-100 maps to 1-1000 years)
    elements.simYearsSlider.addEventListener('input', () => {
      const years = sliderToYears(parseFloat(elements.simYearsSlider.value));
      elements.simYearsDisplay.textContent = formatYears(years);
    });

    elements.btnRunSim.addEventListener('click', () => {
      const years = sliderToYears(parseFloat(elements.simYearsSlider.value));
      simulateYears(years);
    });

    elements.btnStop.addEventListener('click', () => {
      stopAnimation();
    });

    elements.btnToggleLog.addEventListener('click', () => {
      toggleLog();
    });

    // Reset button
    if (elements.btnReset) {
      elements.btnReset.addEventListener('click', () => {
        stopAnimation();

        // Reset state to defaults
        state.moonAngle = 0;
        state.nodeAngle = 0;
        state.orbitalTilt = 5.145;

        // Reset UI
        elements.tiltSlider.value = state.orbitalTilt * 10;
        elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';

        // Reset stats
        state.totalSolarEclipses = 0;
        state.partialSolarEclipses = 0;
        state.totalLunarEclipses = 0;
        state.partialLunarEclipses = 0;
        state.yearsSimulated = 0;
        state.eclipseLog = [];

        // Hide stats panel and log panel
        elements.statsPanel.style.display = 'none';
        elements.logPanel.style.display = 'none';
        state.showLog = false;
        elements.btnToggleLog.textContent = 'Show Log';

        update();
      });
    }
  }

  // Logarithmic slider conversion (slider 0-100 → years 1-1000)
  function sliderToYears(sliderVal) {
    // 0 → 1, 50 → ~32, 100 → 1000
    return Math.round(Math.pow(10, sliderVal / 100 * 3));
  }

  function yearsToSlider(years) {
    // Inverse: 1 → 0, 32 → 50, 1000 → 100
    return Math.log10(years) / 3 * 100;
  }

  function formatYears(years) {
    if (years >= 1000) return (years / 1000).toFixed(1) + 'k';
    return years.toString();
  }

  function animateToAngle(targetAngle) {
    const startAngle = state.moonAngle;
    let diff = targetAngle - startAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    AstroUtils.animateValue(startAngle, startAngle + diff, 500, (val) => {
      state.moonAngle = val;
      update();
    });
  }

  // ============================================
  // Animations
  // ============================================

  function stopAnimation() {
    state.isAnimating = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
  }

  function animateMonth() {
    stopAnimation();
    state.isAnimating = true;

    const duration = 3000; // 3 seconds for one month
    const startAngle = state.moonAngle;
    const startTime = performance.now();

    function frame(currentTime) {
      if (!state.isAnimating) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      state.moonAngle = startAngle + progress * 360;
      // Nodes precess slowly (about 18.6 years for full cycle)
      state.nodeAngle += 0.02;

      update();

      if (progress < 1) {
        state.animationId = requestAnimationFrame(frame);
      } else {
        state.isAnimating = false;
      }
    }

    state.animationId = requestAnimationFrame(frame);
  }

  function animateYear() {
    stopAnimation();
    state.isAnimating = true;

    const duration = 10000; // 10 seconds for one year
    const startAngle = state.moonAngle;
    const startNode = state.nodeAngle;
    const startTime = performance.now();

    function frame(currentTime) {
      if (!state.isAnimating) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ~12.4 lunar months per year
      state.moonAngle = startAngle + progress * 360 * 12.4;
      // Nodes regress about 19.3° per year
      state.nodeAngle = startNode - progress * 19.3;

      update();

      if (progress < 1) {
        state.animationId = requestAnimationFrame(frame);
      } else {
        state.isAnimating = false;
      }
    }

    state.animationId = requestAnimationFrame(frame);
  }

  function toggleLog() {
    state.showLog = !state.showLog;
    elements.logPanel.style.display = state.showLog ? 'block' : 'none';
    elements.btnToggleLog.textContent = state.showLog ? 'Hide Log' : 'Show Log';
  }

  function updateLogTable() {
    if (!elements.logTable) return;

    // Build table HTML
    let html = '<tr><th>Year</th><th>Type</th><th>Details</th></tr>';

    // Show most recent first, limit to last 100 for performance
    const recentLog = state.eclipseLog.slice(-100).reverse();
    for (const entry of recentLog) {
      const typeClass = entry.type.includes('solar') ? 'solar' : 'lunar';
      const typeLabel = entry.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
      html += `<tr class="${typeClass}">
        <td>${entry.year.toFixed(2)}</td>
        <td>${typeLabel}</td>
        <td>${entry.height.toFixed(2)}° from ecliptic</td>
      </tr>`;
    }

    if (state.eclipseLog.length > 100) {
      html += `<tr><td colspan="3" style="opacity:0.6">... and ${state.eclipseLog.length - 100} more</td></tr>`;
    }

    elements.logTable.innerHTML = html;
  }

  function simulateYears(yearsToSimulate) {
    stopAnimation();
    state.isAnimating = true;

    // Reset stats
    state.totalSolarEclipses = 0;
    state.partialSolarEclipses = 0;
    state.totalLunarEclipses = 0;
    state.partialLunarEclipses = 0;
    state.yearsSimulated = 0;
    state.eclipseLog = [];

    elements.statsPanel.style.display = 'grid';

    const startNode = state.nodeAngle;
    const monthsPerYear = 12.37;
    const totalMonths = yearsToSimulate * monthsPerYear;

    // Adjust batch size based on simulation length
    let batchSize = yearsToSimulate <= 100 ? 5 : 50;
    let currentMonth = 0;

    function simulateBatch() {
      if (!state.isAnimating || currentMonth >= totalMonths) {
        state.isAnimating = false;
        updateStats();
        updateLogTable();
        return;
      }

      for (let i = 0; i < batchSize && currentMonth < totalMonths; i++, currentMonth++) {
        const yearProgress = currentMonth / monthsPerYear;

        // Node regression: about 19.3° per year
        const nodeAngle = startNode - yearProgress * 19.3;

        // Check new moon (angle 180) for solar eclipses
        const newMoonHeight = Math.abs(getMoonEclipticHeight(180, state.orbitalTilt, nodeAngle));
        if (newMoonHeight < TOTAL_SOLAR_THRESHOLD) {
          state.totalSolarEclipses++;
          state.eclipseLog.push({ year: yearProgress, type: 'total-solar', height: newMoonHeight });
        } else if (newMoonHeight < PARTIAL_SOLAR_THRESHOLD) {
          state.partialSolarEclipses++;
          state.eclipseLog.push({ year: yearProgress, type: 'partial-solar', height: newMoonHeight });
        }

        // Check full moon (angle 0) for lunar eclipses
        const fullMoonHeight = Math.abs(getMoonEclipticHeight(0, state.orbitalTilt, nodeAngle));
        if (fullMoonHeight < TOTAL_LUNAR_THRESHOLD) {
          state.totalLunarEclipses++;
          state.eclipseLog.push({ year: yearProgress, type: 'total-lunar', height: fullMoonHeight });
        } else if (fullMoonHeight < PARTIAL_LUNAR_THRESHOLD) {
          state.partialLunarEclipses++;
          state.eclipseLog.push({ year: yearProgress, type: 'partial-lunar', height: fullMoonHeight });
        }

        state.yearsSimulated = yearProgress;
        state.nodeAngle = nodeAngle;
        state.moonAngle = (currentMonth * 360) % 360;
      }

      updateStats();
      update();

      // Update log periodically for shorter simulations
      if (yearsToSimulate <= 100 && currentMonth % 50 === 0) {
        updateLogTable();
      }

      state.animationId = requestAnimationFrame(simulateBatch);
    }

    state.animationId = requestAnimationFrame(simulateBatch);
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupDrag();
    setupControls();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      const starfield = Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
      starfield.start();
    }

    // Set initial tilt slider value
    elements.tiltSlider.value = state.orbitalTilt * 10;
    elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';

    // Set initial simulation years slider (default 10 years)
    const defaultYears = 10;
    elements.simYearsSlider.value = yearsToSlider(defaultYears);
    elements.simYearsDisplay.textContent = formatYears(defaultYears);

    // Initial update
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

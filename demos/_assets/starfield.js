/**
 * AstroEd Demos - Starfield Background
 * Animated starfield canvas for astronomy visualizations
 */

/**
 * Create a starfield background on a canvas element
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {object} options - Configuration options
 * @returns {object} Controller with start(), stop(), resize()
 */
function createStarfield(canvas, options = {}) {
  const ctx = canvas.getContext('2d');

  // Default options
  const config = {
    starCount: options.starCount || 200,
    minSize: options.minSize || 0.5,
    maxSize: options.maxSize || 2,
    twinkleSpeed: options.twinkleSpeed || 0.02,
    twinkleAmount: options.twinkleAmount || 0.3,
    colors: options.colors || [
      '#ffffff',  // White
      '#ffe4c4',  // Warm white (like Betelgeuse)
      '#cae1ff',  // Cool blue-white (like Rigel)
      '#fff5ee',  // Slightly warm
    ],
    backgroundColor: options.backgroundColor || '#0a0a14',
    ...options
  };

  let stars = [];
  let animationId = null;
  let running = false;

  /**
   * Initialize stars with depth layers
   */
  function initStars() {
    stars = [];
    const { width, height } = canvas;

    // Create 3 depth layers
    const layers = [
      { count: Math.floor(config.starCount * 0.5), minSize: 0.3, maxSize: 0.8, baseOpacity: 0.3, speed: 0.5 },  // Far
      { count: Math.floor(config.starCount * 0.35), minSize: 0.5, maxSize: 1.2, baseOpacity: 0.5, speed: 1.0 }, // Mid
      { count: Math.floor(config.starCount * 0.15), minSize: 1.0, maxSize: 2.5, baseOpacity: 0.7, speed: 1.5 }  // Near
    ];

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: layer.minSize + Math.random() * (layer.maxSize - layer.minSize),
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: config.twinkleSpeed * layer.speed * (0.5 + Math.random()),
          baseOpacity: layer.baseOpacity + Math.random() * 0.2,
          layer: layerIndex
        });
      }
    });

    // Sort by layer (far stars render first)
    stars.sort((a, b) => a.layer - b.layer);
  }

  /**
   * Draw a single star with glow effect
   */
  function drawStar(star, opacity) {
    const finalOpacity = Math.max(0.1, Math.min(1, opacity));

    // Outer glow
    if (star.size > 1) {
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 3
      );
      gradient.addColorStop(0, `${star.color}${Math.floor(finalOpacity * 80).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Core
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.globalAlpha = finalOpacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /**
   * Render one frame
   */
  function render(time) {
    const { width, height } = canvas;

    // Clear with background color
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw each star
    stars.forEach(star => {
      // Calculate twinkle effect
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const opacity = star.baseOpacity + twinkle * config.twinkleAmount;

      drawStar(star, opacity);
    });
  }

  /**
   * Animation loop
   */
  function animate(timestamp) {
    render(timestamp / 1000);
    if (running) {
      animationId = requestAnimationFrame(animate);
    }
  }

  /**
   * Resize canvas to fill container
   */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Reinitialize stars for new size
    initStars();

    // Redraw if not animating
    if (!running) {
      render(0);
    }
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    resize();
  }

  // Initialize
  resize();

  return {
    /**
     * Start the animation
     */
    start() {
      if (!running) {
        running = true;
        window.addEventListener('resize', handleResize);
        animationId = requestAnimationFrame(animate);
      }
    },

    /**
     * Stop the animation
     */
    stop() {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },

    /**
     * Manually trigger resize
     */
    resize,

    /**
     * Render a single static frame
     */
    renderStatic() {
      render(0);
    },

    /**
     * Check if running
     */
    get isRunning() {
      return running;
    },

    /**
     * Update configuration
     */
    setConfig(newOptions) {
      Object.assign(config, newOptions);
      initStars();
    }
  };
}


/**
 * Create a starfield as a background layer (position: fixed)
 * Automatically sizes to viewport
 * @param {HTMLElement} container - Element to append canvas to
 * @param {object} options - Starfield options
 * @returns {object} Starfield controller
 */
function createBackgroundStarfield(container, options = {}) {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.className = 'starfield-background';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  `;

  container.insertBefore(canvas, container.firstChild);

  const starfield = createStarfield(canvas, options);
  starfield.start();

  return {
    ...starfield,
    destroy() {
      starfield.stop();
      canvas.remove();
    }
  };
}


/**
 * Create an SVG starfield (for use within SVG visualizations)
 * Static, no animation - use CSS for any twinkle effects
 * @param {SVGElement} svg - Parent SVG element
 * @param {object} options - Configuration
 * @returns {SVGGElement} Group containing stars
 */
function createSVGStarfield(svg, options = {}) {
  const config = {
    starCount: options.starCount || 100,
    minSize: options.minSize || 0.5,
    maxSize: options.maxSize || 1.5,
    ...options
  };

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', 'starfield-layer');

  const viewBox = svg.viewBox.baseVal;
  const width = viewBox.width || 800;
  const height = viewBox.height || 600;

  for (let i = 0; i < config.starCount; i++) {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', Math.random() * width);
    star.setAttribute('cy', Math.random() * height);
    star.setAttribute('r', config.minSize + Math.random() * (config.maxSize - config.minSize));
    star.setAttribute('fill', '#ffffff');
    star.setAttribute('opacity', 0.3 + Math.random() * 0.7);
    star.setAttribute('class', 'star');

    group.appendChild(star);
  }

  return group;
}


// ============================================
// Export for use in demos
// ============================================

if (typeof window !== 'undefined') {
  window.Starfield = {
    create: createStarfield,
    createBackground: createBackgroundStarfield,
    createSVG: createSVGStarfield
  };
}

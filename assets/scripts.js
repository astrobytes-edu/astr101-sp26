// assets/scripts.js
// ASTR 201 Course Site — Navigation Behavior Contract
//
// Responsibilities:
// 1) Force ALL lecture slide links in sidebar to open in a new tab.
// 2) Convert EXAM and BREAK markers into non-interactive items.
// 3) Preserve accessibility attributes.
//
// If this file changes, update ADR + acceptance screenshots.

(function () {
  "use strict";

  const SLIDES_PATH_TOKEN = "/slides/";
  const MARKER_HREF = "#";

  function isSidebarLink(a) {
    // Quarto sidebar nav links typically live inside #quarto-sidebar
    return !!a.closest("#quarto-sidebar");
  }

  function isSlideLink(a) {
    const href = a.getAttribute("href") || "";
    return href.includes(SLIDES_PATH_TOKEN);
  }

  function isMarkerText(text) {
    const t = (text || "").trim().toUpperCase();
    return (
      t.startsWith("EXAM") ||
      t.includes("SPRING BREAK") ||
      t === "SPRING BREAK"
    );
  }

  function markAsNewTab(a) {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  }

  function disableLink(a, kind) {
    // Make it visually + functionally non-interactive while keeping DOM stable.
    a.classList.add("nav-marker");
    a.classList.add(kind); // "nav-marker--exam" or "nav-marker--break"
    a.setAttribute("aria-disabled", "true");
    a.setAttribute("tabindex", "-1");
    a.setAttribute("role", "link");

    // Remove target/rel if any
    a.removeAttribute("target");
    a.removeAttribute("rel");

    // Prevent navigation
    a.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    // Prevent keyboard activation
    a.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  function applySidebarRules() {
    const sidebar = document.querySelector("#quarto-sidebar");
    if (!sidebar) return;

    const links = sidebar.querySelectorAll("a[href]");
    links.forEach((a) => {
      if (!isSidebarLink(a)) return;

      const href = a.getAttribute("href") || "";
      const text = a.textContent || "";

      // 1) Slides open in new tab
      if (isSlideLink(a)) {
        markAsNewTab(a);
        return;
      }

      // 2) Markers: href "#" AND text indicates exam/break
      if (href === MARKER_HREF && isMarkerText(text)) {
        const upper = text.trim().toUpperCase();
        const kind = upper.startsWith("EXAM") ? "nav-marker--exam" : "nav-marker--break";
        disableLink(a, kind);
        return;
      }
    });
  }

  // 3) Inject sidebar title (Quarto 1.8 doesn't render sidebar title config)
  function injectSidebarTitle() {
    const sidebar = document.querySelector("#quarto-sidebar");
    if (!sidebar) return;

    // Check if title already exists (avoid duplicate injection)
    if (sidebar.querySelector(".sidebar-title-injected")) return;

    // Find the menu container
    const menuContainer = sidebar.querySelector(".sidebar-menu-container");
    if (!menuContainer) return;

    // Create title element
    const titleEl = document.createElement("a");
    titleEl.href = "/";
    titleEl.className = "sidebar-title-injected";
    titleEl.textContent = "ASTR 201";

    // Insert before menu container
    menuContainer.parentNode.insertBefore(titleEl, menuContainer);
  }

  // 4) Force multi-line module titles
  // CSS display:block handles line breaks, no <br> needed
  function applyModuleTitleBreaks() {
    const sidebar = document.querySelector("#quarto-sidebar");
    if (!sidebar) return;

    // Find all sidebar section headers that start with "Module"
    const sectionTexts = sidebar.querySelectorAll(".sidebar-item-text, .menu-text");
    sectionTexts.forEach((el) => {
      const text = el.textContent || "";
      // Match "Module X: Title" pattern
      const match = text.match(/^(Module\s+\d+:)\s*(.+)$/i);
      if (match) {
        const prefix = match[1]; // "Module 1:"
        const title = match[2];  // "Foundations"
        // No <br> - CSS display:block handles line break
        el.innerHTML = `<span class="module-prefix">${prefix}</span><span class="module-title">${title}</span>`;
      }
    });
  }

  // 5) Make custom callouts collapsible
  // Quarto's built-in callouts support collapse="true" natively, but custom
  // callout types (e.g., .callout-deep-dive) don't. This transforms them
  // into <details>/<summary> structure.
  function makeCustomCalloutsCollapsible() {
    // Custom callout types that should support collapse
    const customCalloutTypes = [
      'callout-deep-dive',
      'callout-the-more-you-know',
      'callout-worked-example'
    ];

    customCalloutTypes.forEach(function(calloutClass) {
      const callouts = document.querySelectorAll('.' + calloutClass + '[data-collapse="true"]');

      callouts.forEach(function(callout) {
        // Skip if already transformed
        if (callout.querySelector('details')) return;

        // Get the title from title attribute (Quarto renders title="" as standard HTML attr)
        const customTitle = callout.getAttribute('title');

        // Default titles by callout type
        const defaultTitles = {
          'callout-deep-dive': 'Deep Dive',
          'callout-the-more-you-know': 'The More You Know',
          'callout-worked-example': 'Worked Example'
        };

        const baseTitle = defaultTitles[calloutClass] || 'Details';
        // If custom title is supplied:
        // - If it already starts with base title, use it as-is
        // - Otherwise, format as "Base Title: Custom Title"
        let title = baseTitle;
        if (customTitle) {
          if (customTitle.toLowerCase().startsWith(baseTitle.toLowerCase())) {
            title = customTitle; // Already includes base title
          } else {
            title = baseTitle + ': ' + customTitle;
          }
        }

        // Get icons by callout type (Bootstrap Icons Unicode)
        const icons = {
          'callout-deep-dive': '\uF5AB',      // bi-telescope
          'callout-the-more-you-know': '\uF431', // bi-info-circle
          'callout-worked-example': '\uF4C9'  // bi-pencil-square
        };
        const icon = icons[calloutClass] || '';

        // Capture current content
        const content = callout.innerHTML;

        // Check if should start open
        const startOpen = callout.getAttribute('data-collapse') === 'false';

        // Build new structure
        const details = document.createElement('details');
        if (startOpen) {
          details.setAttribute('open', '');
        }

        const summary = document.createElement('summary');
        summary.className = 'callout-header-custom';

        // Add icon span if we have one
        if (icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'callout-icon-custom';
          iconSpan.textContent = icon + ' ';
          summary.appendChild(iconSpan);
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'callout-title-custom';
        titleSpan.textContent = title;
        summary.appendChild(titleSpan);

        const body = document.createElement('div');
        body.className = 'callout-body-custom';
        body.innerHTML = content;

        details.appendChild(summary);
        details.appendChild(body);

        // Replace callout content
        callout.innerHTML = '';
        callout.appendChild(details);

        // Mark as transformed
        callout.classList.add('callout-collapsible-transformed');
      });
    });
  }

  // Re-apply on DOM ready
  document.addEventListener("DOMContentLoaded", function() {
    injectSidebarTitle();
    applySidebarRules();
    applyModuleTitleBreaks();
    makeCustomCalloutsCollapsible();
  });
})();

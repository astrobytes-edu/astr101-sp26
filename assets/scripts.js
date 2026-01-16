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

  // Re-apply on DOM ready
  document.addEventListener("DOMContentLoaded", function() {
    injectSidebarTitle();
    applySidebarRules();
    applyModuleTitleBreaks();
  });
})();

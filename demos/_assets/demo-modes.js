/**
 * DemoModes (shared)
 * - Help / keyboard shortcuts modal
 * - Station mode modal with data table + CSV copy + print-friendly view
 *
 * Design goals:
 * - No framework, no build step.
 * - Small surface area: demos provide content + a snapshot-row function.
 * - Accessible: focus trap, Escape to close, restore focus.
 * - Safe in non-secure contexts: clipboard fallback via execCommand.
 */

(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DemoModes = factory(root);
  }
})(typeof self !== 'undefined' ? self : this, function(root) {
  'use strict';

  const DEFAULT_KEYS = {
    help: '?',
    station: 'g',
  };

  function isBrowser() {
    return typeof document !== 'undefined' && typeof window !== 'undefined';
  }

  function isEditableTarget(target) {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return Boolean(target.isContentEditable);
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function csvEscape(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    const needsQuotes = /[",\n\r]/.test(str);
    const escaped = str.replaceAll('"', '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  }

  function toCsv({ columns, rows }) {
    if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error('DemoModes.toCsv: columns must be a non-empty array');
    }
    const header = columns.map((c) => csvEscape(c.label ?? c.key)).join(',');
    const lines = [header];
    for (const row of rows ?? []) {
      const line = columns.map((c) => csvEscape(row?.[c.key])).join(',');
      lines.push(line);
    }
    return lines.join('\n') + '\n';
  }

  async function copyTextToClipboard(text) {
    if (!isBrowser()) return false;
    const str = String(text ?? '');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(str);
        return true;
      }
    } catch {
      // Fall through to execCommand fallback.
    }

    const textarea = document.createElement('textarea');
    textarea.value = str;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      // eslint-disable-next-line deprecation/deprecation
      const ok = document.execCommand('copy');
      return ok;
    } finally {
      textarea.remove();
    }
  }

  function getFocusableElements(container) {
    if (!isBrowser()) return [];
    const nodes = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.hasAttribute('disabled')) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    return nodes;
  }

  function createDialog({ title, subtitle, ariaLabel, bodyEl }) {
    if (!isBrowser()) {
      return {
        isOpen: () => false,
        open: () => {},
        close: () => {},
        elements: {},
      };
    }

    const previous = { active: null };

    const backdrop = document.createElement('div');
    backdrop.className = 'demo-modal-backdrop';

    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', ariaLabel || title || 'Dialog');
    modal.tabIndex = -1;

    const header = document.createElement('div');
    header.className = 'demo-modal-header';
    header.innerHTML = `
      <div>
        <h2 class="demo-modal-title">${escapeHtml(title ?? '')}</h2>
        ${subtitle ? `<div class="demo-modal-subtitle">${escapeHtml(subtitle)}</div>` : ''}
      </div>
      <button class="demo-modal-close" type="button" aria-label="Close">&times;</button>
    `;

    const body = document.createElement('div');
    body.className = 'demo-modal-body';
    if (bodyEl) {
      body.appendChild(bodyEl);
    }

    modal.appendChild(header);
    modal.appendChild(body);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const closeBtn = header.querySelector('.demo-modal-close');

    function close() {
      backdrop.classList.remove('open');
      document.body.classList.remove('demo-printing');

      if (previous.active && document.contains(previous.active)) {
        previous.active.focus();
      }
      previous.active = null;
    }

    function open() {
      previous.active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      backdrop.classList.add('open');
      if (closeBtn) {
        closeBtn.focus();
      } else {
        modal.focus();
      }
    }

    function isOpen() {
      return backdrop.classList.contains('open');
    }

    // Close on backdrop click (but not inside modal).
    backdrop.addEventListener('mousedown', (event) => {
      if (event.target === backdrop) {
        close();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    // Focus trap + Escape.
    backdrop.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements(modal);
      if (focusables.length === 0) {
        event.preventDefault();
        modal.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === modal) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    return {
      isOpen,
      open,
      close,
      elements: { backdrop, modal, body, closeBtn },
    };
  }

  function renderShortcutTable(shortcuts) {
    const table = document.createElement('table');
    table.className = 'demo-shortcuts';
    table.innerHTML = `
      <thead>
        <tr><th style="width: 36%">Key</th><th>Action</th></tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    for (const item of shortcuts ?? []) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><kbd class="demo-kbd">${escapeHtml(item.key ?? '')}</kbd></td>
        <td>${escapeHtml(item.action ?? '')}</td>
      `;
      tbody.appendChild(tr);
    }
    return table;
  }

  function renderBulletList(items) {
    const ul = document.createElement('ul');
    ul.style.margin = '0';
    ul.style.paddingLeft = '1.2rem';
    for (const item of items ?? []) {
      const li = document.createElement('li');
      li.textContent = String(item);
      ul.appendChild(li);
    }
    return ul;
  }

  function createHelpDialog(helpConfig) {
    const rootEl = document.createElement('div');

    for (const section of helpConfig.sections ?? []) {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'demo-modal-section';

      const h = document.createElement('h3');
      h.textContent = section.heading ?? '';
      sectionEl.appendChild(h);

      if (section.type === 'shortcuts') {
        sectionEl.appendChild(renderShortcutTable(section.items ?? []));
      } else if (section.type === 'bullets') {
        sectionEl.appendChild(renderBulletList(section.items ?? []));
      } else if (section.type === 'html') {
        const div = document.createElement('div');
        div.innerHTML = section.html ?? '';
        sectionEl.appendChild(div);
      } else {
        sectionEl.appendChild(renderBulletList(section.items ?? []));
      }

      rootEl.appendChild(sectionEl);
    }

    return createDialog({
      title: helpConfig.title ?? 'Help',
      subtitle: helpConfig.subtitle ?? '',
      ariaLabel: helpConfig.ariaLabel ?? helpConfig.title ?? 'Help',
      bodyEl: rootEl,
    });
  }

  function createStationDialog(stationConfig) {
    const state = { rows: [] };

    const rootEl = document.createElement('div');

    // Steps
    if (Array.isArray(stationConfig.steps) && stationConfig.steps.length > 0) {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'demo-modal-section';
      const h = document.createElement('h3');
      h.textContent = 'Steps';
      sectionEl.appendChild(h);

      const ol = document.createElement('ol');
      ol.style.margin = '0';
      ol.style.paddingLeft = '1.2rem';
      for (const step of stationConfig.steps) {
        const li = document.createElement('li');
        li.innerHTML = String(step);
        ol.appendChild(li);
      }
      sectionEl.appendChild(ol);
      rootEl.appendChild(sectionEl);
    }

    // Table + actions
    const columns = stationConfig.columns ?? [];
    const hasTable = Array.isArray(columns) && columns.length > 0;

    const tableSection = document.createElement('div');
    tableSection.className = 'demo-modal-section';
    tableSection.innerHTML = `<h3>Data Table</h3>`;

    const actions = document.createElement('div');
    actions.className = 'demo-station-actions';

    const btnSnapshot = document.createElement('button');
    btnSnapshot.className = 'astro-btn';
    btnSnapshot.type = 'button';
    btnSnapshot.textContent = stationConfig.snapshotLabel ?? 'Add row (snapshot)';

    const btnClear = document.createElement('button');
    btnClear.className = 'astro-btn secondary';
    btnClear.type = 'button';
    btnClear.textContent = 'Clear table';

    const btnCopyCsv = document.createElement('button');
    btnCopyCsv.className = 'astro-btn';
    btnCopyCsv.type = 'button';
    btnCopyCsv.textContent = 'Copy CSV';

    const btnPrint = document.createElement('button');
    btnPrint.className = 'astro-btn secondary';
    btnPrint.type = 'button';
    btnPrint.textContent = 'Print';

    actions.appendChild(btnSnapshot);
    if (stationConfig.rowSets?.length) {
      for (const rowSet of stationConfig.rowSets) {
        const btn = document.createElement('button');
        btn.className = 'astro-btn secondary';
        btn.type = 'button';
        btn.textContent = rowSet.label ?? 'Add rows';
        btn.addEventListener('click', () => {
          const rows = typeof rowSet.getRows === 'function' ? rowSet.getRows() : [];
          addRows(rows);
        });
        actions.appendChild(btn);
      }
    }
    actions.appendChild(btnClear);
    actions.appendChild(btnCopyCsv);
    actions.appendChild(btnPrint);

    const tableWrap = document.createElement('div');
    tableWrap.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'demo-station-table';

    const status = document.createElement('div');
    status.className = 'demo-modal-status';
    status.setAttribute('aria-live', 'polite');

    tableSection.appendChild(actions);
    tableWrap.appendChild(table);
    tableSection.appendChild(tableWrap);
    tableSection.appendChild(status);
    rootEl.appendChild(tableSection);

    // Synthesis prompt
    if (stationConfig.synthesisPrompt) {
      const sectionEl = document.createElement('div');
      sectionEl.className = 'demo-modal-section';
      const h = document.createElement('h3');
      h.textContent = 'Synthesis';
      sectionEl.appendChild(h);

      const p = document.createElement('div');
      p.innerHTML = stationConfig.synthesisPrompt;
      sectionEl.appendChild(p);

      rootEl.appendChild(sectionEl);
    }

    const dialog = createDialog({
      title: stationConfig.title ?? 'Station Mode',
      subtitle: stationConfig.subtitle ?? '',
      ariaLabel: stationConfig.ariaLabel ?? stationConfig.title ?? 'Station Mode',
      bodyEl: rootEl,
    });

    function setStatus(message) {
      status.textContent = message;
      if (root?.AstroUtils?.showSuccessIndicator) {
        try {
          root.AstroUtils.showSuccessIndicator(status, message, { duration: 1200 });
        } catch {
          // ignore
        }
      }
    }

    function renderTable() {
      if (!hasTable) {
        table.innerHTML = `<tbody><tr><td>No table configured.</td></tr></tbody>`;
        return;
      }

      const thead = `<thead><tr>${columns.map((c) => `<th>${escapeHtml(c.label ?? c.key)}</th>`).join('')}</tr></thead>`;
      const tbodyRows = (state.rows ?? []).map((row) => {
        const cells = columns.map((c) => `<td>${escapeHtml(row?.[c.key] ?? '')}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');

      table.innerHTML = `${thead}<tbody>${tbodyRows || `<tr><td colspan="${columns.length}">No rows yet. Use “${escapeHtml(btnSnapshot.textContent)}”.</td></tr>`}</tbody>`;
    }

    function addRows(rows) {
      for (const row of rows ?? []) {
        if (row && typeof row === 'object') {
          state.rows.push(row);
        }
      }
      renderTable();
      if (rows?.length) setStatus(`Added ${rows.length} row(s).`);
    }

    function addSnapshotRow() {
      if (typeof stationConfig.getSnapshotRow !== 'function') {
        setStatus('No snapshot function configured for this demo.');
        return;
      }
      const row = stationConfig.getSnapshotRow();
      if (!row) {
        setStatus('Could not add row (no snapshot available).');
        return;
      }
      addRows([row]);
    }

    btnSnapshot.addEventListener('click', addSnapshotRow);
    btnClear.addEventListener('click', () => {
      state.rows = [];
      renderTable();
      setStatus('Cleared table.');
    });

    btnCopyCsv.addEventListener('click', async () => {
      if (!hasTable) {
        setStatus('No table configured.');
        return;
      }
      const csv = toCsv({ columns, rows: state.rows });
      const ok = await copyTextToClipboard(csv);
      setStatus(ok ? 'Copied CSV to clipboard.' : 'Copy failed (clipboard not available).');
    });

    btnPrint.addEventListener('click', async () => {
      // Print only the dialog content.
      document.body.classList.add('demo-printing');
      dialog.open();
      await new Promise((r) => setTimeout(r, 50));
      window.print();
      document.body.classList.remove('demo-printing');
    });

    renderTable();

    return {
      dialog,
      setRows: (rows) => {
        state.rows = Array.isArray(rows) ? rows.slice() : [];
        renderTable();
      },
      addRows,
      addSnapshotRow,
      getRows: () => state.rows.slice(),
    };
  }

  function create(config) {
    const keys = { ...DEFAULT_KEYS, ...(config.keys ?? {}) };

    const helpDialog = config.help ? createHelpDialog(config.help) : null;
    const station = config.station ? createStationDialog(config.station) : null;

    function toggleHelp() {
      if (!helpDialog) return;
      if (helpDialog.isOpen()) helpDialog.close();
      else helpDialog.open();
    }

    function toggleStation() {
      if (!station) return;
      if (station.dialog.isOpen()) station.dialog.close();
      else station.dialog.open();
    }

    function bindButtons({ helpButton, stationButton }) {
      if (helpDialog && helpButton) {
        helpButton.addEventListener('click', () => helpDialog.open());
      }
      if (station && stationButton) {
        stationButton.addEventListener('click', () => station.dialog.open());
      }
    }

    function bindKeys() {
      if (!isBrowser()) return;
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (isEditableTarget(event.target)) return;

        if (helpDialog && event.key === keys.help) {
          event.preventDefault();
          toggleHelp();
          return;
        }
        if (station && event.key === keys.station) {
          event.preventDefault();
          toggleStation();
        }
      });
    }

    if (config.bindKeys !== false) {
      bindKeys();
    }

    return {
      bindButtons,
      help: helpDialog,
      station,
      toCsv,
      copyTextToClipboard,
      keys,
    };
  }

  return {
    create,
    toCsv,
    copyTextToClipboard,
  };
});


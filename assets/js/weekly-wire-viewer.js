/**
 * Weekly Wire PDF Viewer
 * Renders current issue as a flipbook-style viewer with page controls.
 * Loads issue data from issues.json for easy weekly updates.
 */
(function () {
  'use strict';

  const BASE = 'assets/docs/weekly-wire/';
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 0;
  let rendering = false;
  let pendingPage = null;
  let scale = 1;

  const canvas = document.getElementById('ww-canvas');
  const ctx = canvas.getContext('2d');

  /* ── Render a page ─────────────────────────────────── */
  function renderPage(num) {
    rendering = true;
    pdfDoc.getPage(num).then(function (page) {
      // Fit width to container
      const container = document.getElementById('ww-viewer');
      const desiredWidth = container.clientWidth;
      const unscaledViewport = page.getViewport({ scale: 1 });
      scale = desiredWidth / unscaledViewport.width;

      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderCtx = { canvasContext: ctx, viewport: viewport };
      page.render(renderCtx).promise.then(function () {
        rendering = false;
        if (pendingPage !== null) {
          renderPage(pendingPage);
          pendingPage = null;
        }
      });
    });

    document.getElementById('ww-page-num').textContent = num;
    document.getElementById('ww-page-count').textContent = totalPages;

    // Enable/disable buttons
    document.getElementById('ww-prev').disabled = (num <= 1);
    document.getElementById('ww-next').disabled = (num >= totalPages);
  }

  function queueRender(num) {
    if (rendering) { pendingPage = num; }
    else { renderPage(num); }
  }

  /* ── Controls ──────────────────────────────────────── */
  document.getElementById('ww-prev').addEventListener('click', function () {
    if (currentPage <= 1) return;
    currentPage--;
    queueRender(currentPage);
  });

  document.getElementById('ww-next').addEventListener('click', function () {
    if (currentPage >= totalPages) return;
    currentPage++;
    queueRender(currentPage);
  });

  /* ── Load issues.json then PDF ─────────────────────── */
  fetch(BASE + 'issues.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var currentPdf = BASE + data.current.file;

      // Set heading & download link
      document.getElementById('ww-title').textContent = data.current.label;
      var dlBtn = document.getElementById('ww-download');
      dlBtn.href = currentPdf;
      dlBtn.download = data.current.file;

      // Archive buttons
      var archiveRow = document.getElementById('ww-archive');
      data.archive.forEach(function (issue) {
        var a = document.createElement('a');
        a.href = BASE + issue.file;
        a.download = issue.file;
        a.className = 'ww-archive-btn';
        a.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
          '<span>' + issue.label + '</span>';
        archiveRow.appendChild(a);
      });

      // Load PDF
      pdfjsLib.getDocument(currentPdf).promise.then(function (pdf) {
        pdfDoc = pdf;
        totalPages = pdf.numPages;
        document.getElementById('ww-page-count').textContent = totalPages;
        renderPage(1);
        document.getElementById('ww-loading').style.display = 'none';
        document.getElementById('ww-controls').style.display = 'flex';
      });
    })
    .catch(function (err) {
      console.error('Weekly Wire viewer error:', err);
      document.getElementById('ww-loading').textContent =
        'Unable to load the Weekly Wire. Please try the download link below.';
    });

  /* ── Resize handler ────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (pdfDoc) queueRender(currentPage);
    }, 250);
  });
})();

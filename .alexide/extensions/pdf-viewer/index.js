(function (alexide) {
  alexide.registerFileViewer(
    { extensions: ['.pdf'] },
    function (filePath, containerEl, showCodeView) {
      containerEl.innerHTML = '<div style="padding:12px;color:#999;">Loading PDF…</div>';
      Promise.resolve(alexide.getFileUrl(filePath)).then(function (url) {
        if (!url) {
          containerEl.innerHTML = '<div style="padding:12px;color:#c00;">Could not load PDF</div>';
          return;
        }
        var base = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174';
        if (typeof pdfjsLib !== 'undefined') {
          renderPdf(url, containerEl, pdfjsLib);
          return;
        }
        var script = document.createElement('script');
        script.src = base + '/pdf.min.js';
        script.onload = function () {
          if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = base + '/pdf.worker.min.js';
            renderPdf(url, containerEl, pdfjsLib);
          } else {
            containerEl.innerHTML = '<div style="padding:12px;color:#c00;">PDF.js failed to load</div>';
          }
        };
        script.onerror = function () {
          containerEl.innerHTML = '<div style="padding:12px;color:#c00;">Could not load PDF viewer</div>';
        };
        document.head.appendChild(script);
      });
    }
  );

  function renderPdf(url, containerEl, pdfjsLib) {
    containerEl.innerHTML = '<div style="padding:12px;color:#999;">Rendering PDF…</div>';
    pdfjsLib.getDocument(url).promise.then(function (pdf) {
      containerEl.innerHTML = '';
      var scale = 1.5;
      var numPages = pdf.numPages;
      function renderPage(pageNum) {
        pdf.getPage(pageNum).then(function (page) {
          var viewport = page.getViewport({ scale: scale });
          var canvas = document.createElement('canvas');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.display = 'block';
          canvas.style.marginBottom = '8px';
          containerEl.appendChild(canvas);
          page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
        }).catch(function () {});
      }
      for (var i = 1; i <= numPages; i++) renderPage(i);
    }).catch(function (err) {
      containerEl.innerHTML = '<div style="padding:12px;color:#c00;">PDF error: ' + (err && err.message ? err.message : 'Unknown') + '</div>';
    });
  }
});

(function () {
  "use strict";

  var frame = document.getElementById("demo-frame");
  var title = document.getElementById("preview-title");
  var pathLabel = document.getElementById("browser-path");
  var openLink = document.getElementById("open-demo");
  var previewSection = document.getElementById("preview");

  function showPreview(path, label) {
    frame.src = path;
    title.textContent = label;
    pathLabel.textContent = "/" + path;
    openLink.href = path;
    previewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-preview]").forEach(function (control) {
    control.addEventListener("click", function () {
      showPreview(control.dataset.preview, control.dataset.title);
    });
  });

  document.getElementById("reload-demo").addEventListener("click", function () {
    frame.src = frame.src;
  });

  var search = document.getElementById("lab-search");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".lab-card"));
  var resultCount = document.getElementById("result-count");
  var emptyState = document.getElementById("empty-state");

  search.addEventListener("input", function () {
    var query = search.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var matches = !query || card.textContent.toLowerCase().includes(query) || card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    resultCount.textContent = visible + (visible === 1 ? " lab" : " labs");
    emptyState.hidden = visible !== 0;
  });
}());

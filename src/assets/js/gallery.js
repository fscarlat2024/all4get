// Galerie produs: thumbnail -> poza mare + lightbox pe tot ecranul
(function () {
  var g = document.querySelector("[data-gallery]");
  if (!g) return;
  var main = g.querySelector(".main-img");
  var thumbs = Array.prototype.slice.call(g.querySelectorAll(".thumb"));
  var srcs = thumbs.length
    ? thumbs.map(function (t) { return t.src; })
    : main ? [main.src] : [];
  if (!srcs.length) return;
  var current = 0;

  function setMain(i) {
    current = ((i % srcs.length) + srcs.length) % srcs.length;
    if (main) main.src = srcs[current];
    thumbs.forEach(function (t, idx) {
      t.classList.toggle("is-active", idx === current);
    });
  }

  thumbs.forEach(function (t, idx) {
    t.addEventListener("click", function () { setMain(idx); });
  });

  // Lightbox
  var box = null, boxImg = null;
  function build() {
    box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Inchide">×</button>' +
      '<button type="button" class="lb-prev" aria-label="Anterior">‹</button>' +
      '<img class="lb-img" alt="">' +
      '<button type="button" class="lb-next" aria-label="Urmator">›</button>';
    document.body.appendChild(box);
    boxImg = box.querySelector(".lb-img");
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function (e) {
      e.stopPropagation(); setMain(current - 1); boxImg.src = srcs[current];
    });
    box.querySelector(".lb-next").addEventListener("click", function (e) {
      e.stopPropagation(); setMain(current + 1); boxImg.src = srcs[current];
    });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box || !box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") { setMain(current - 1); boxImg.src = srcs[current]; }
      else if (e.key === "ArrowRight") { setMain(current + 1); boxImg.src = srcs[current]; }
    });
  }
  function open() {
    if (!box) build();
    boxImg.src = srcs[current];
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    if (box) { box.classList.remove("open"); document.body.style.overflow = ""; }
  }
  if (main) {
    main.style.cursor = "zoom-in";
    main.addEventListener("click", open);
  }
})();

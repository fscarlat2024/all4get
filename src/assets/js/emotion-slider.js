// All4Get - slider mesaje emotionale pe homepage
(function () {
  var slider = document.getElementById("emotionSlider");
  if (!slider) return;
  var slides = [].slice.call(slider.querySelectorAll(".emotion"));
  var dots = [].slice.call(slider.querySelectorAll(".em-dot"));
  if (slides.length < 2) return;

  var i = 0, timer = null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
  }
  function next() { go(i + 1); }
  function start() { if (reduce) return; stop(); timer = setInterval(next, 6000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach(function (d, k) {
    d.addEventListener("click", function () { go(k); start(); });
  });
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  start();
})();

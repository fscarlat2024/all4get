(function () {
  var root = document.documentElement;
  var KEY = "all4get-theme";
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);

  function current() {
    if (root.getAttribute("data-theme")) return root.getAttribute("data-theme");
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".theme-toggle");
    if (!btn) return;
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    btn.textContent = next === "dark" ? "☀" : "☾";
  });

  window.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = current() === "dark" ? "☀" : "☾";
  });
})();

// All4Get - formular comanda /oferta/ (ramburs; card in curand)
(function () {
  var form = document.getElementById("order-form");
  if (!form) return;

  var d = form.dataset;
  var LASER = { sku: d.laserSku, unit: num(d.laserUnit), bundle: num(d.laserBundle) };
  var MINGE = d.mingeSku ? { sku: d.mingeSku, unit: num(d.mingeUnit) } : null;
  var FREE_SHIP = num(d.freeShip) || 300;
  var FLAT_SHIP = num(d.flatShip) || 19.99;
  var ENDPOINT = d.endpoint;

  var elSub = document.getElementById("sum-sub");
  var elShip = document.getElementById("sum-ship");
  var elTotal = document.getElementById("sum-total");
  var elErr = document.getElementById("of-error");
  var mingeChk = document.getElementById("add-minge");
  var mingeColorWrap = document.getElementById("minge-color-wrap");

  function num(v) { var n = parseFloat(String(v || "").replace(",", ".")); return isFinite(n) ? n : 0; }
  function lei(v) { return (Number(v) || 0).toFixed(2).replace(".", ",") + " lei"; }
  function qty() { var r = form.querySelector('input[name="qty"]:checked'); return r ? parseInt(r.value, 10) : 1; }

  function laserLine() {
    var q = qty();
    if (q >= 2 && LASER.bundle) return LASER.bundle + (q - 2) * LASER.unit;
    return LASER.unit * q;
  }

  function compute() {
    var sub = laserLine();
    if (MINGE && mingeChk && mingeChk.checked) sub += MINGE.unit;
    sub = Math.round(sub * 100) / 100;
    var ship = sub >= FREE_SHIP ? 0 : FLAT_SHIP;
    var total = Math.round((sub + ship) * 100) / 100;
    if (elSub) elSub.textContent = lei(sub);
    if (elShip) elShip.textContent = ship ? lei(ship) : "GRATUIT";
    if (elTotal) elTotal.textContent = lei(total);
    return { sub: sub, ship: ship, total: total };
  }

  form.addEventListener("change", function (e) {
    if (e.target === mingeChk && mingeColorWrap) mingeColorWrap.hidden = !mingeChk.checked;
    compute();
  });
  compute();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (elErr) elErr.hidden = true;

    var items = [{ sku: LASER.sku, qty: qty(), color: val("laserColor") }];
    if (MINGE && mingeChk && mingeChk.checked) items.push({ sku: MINGE.sku, qty: 1, color: val("mingeColor") });

    var payload = {
      items: items,
      plata: "ramburs",
      website: val("website"),
      client: {
        nume: val("nume"), telefon: val("telefon"), oras: val("oras"),
        judet: val("judet"), adresa: val("adresa"), email: val("email"),
      },
    };

    var totals = compute();
    var btn = form.querySelector(".of-submit");
    if (btn) { btn.disabled = true; btn.textContent = "Se trimite…"; }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j && res.j.ok) {
          try {
            if (window.fbq) fbq("track", "Purchase", { value: totals.total, currency: "RON", content_type: "product" });
          } catch (x) {}
          showThanks(res.j.id);
        } else {
          fail((res.j && res.j.error) || "A apărut o eroare. Încearcă din nou sau sună-ne.");
          if (btn) { btn.disabled = false; btn.textContent = "Trimite comanda"; }
        }
      })
      .catch(function () {
        fail("Conexiune întreruptă. Verifică internetul și încearcă din nou.");
        if (btn) { btn.disabled = false; btn.textContent = "Trimite comanda"; }
      });
  });

  function val(name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ""; }
  function fail(msg) { if (elErr) { elErr.textContent = msg; elErr.hidden = false; elErr.scrollIntoView({ behavior: "smooth", block: "center" }); } }

  function showThanks(id) {
    var main = document.querySelector(".lp-main");
    var hero = document.querySelector(".lp-hero");
    var thanks = document.getElementById("of-thanks");
    if (main) main.hidden = true;
    if (hero) hero.hidden = true;
    if (thanks) {
      var idEl = document.getElementById("of-thanks-id");
      if (idEl && id) idEl.textContent = "Cod comandă: " + id;
      thanks.hidden = false;
      thanks.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
})();

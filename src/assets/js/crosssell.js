// Cross-sell: dupa ce clientul adauga un produs in cos, propune celalalt produs (fara discount).
(function () {
  function init() {
    var pop = document.getElementById('xsellPop');
    if (!pop || !window.Snipcart) return;

    var currentSku = String(pop.getAttribute('data-current-sku') || '');
    var dismissed = false;

    var otherSkus = Array.prototype.map.call(
      pop.querySelectorAll('.snipcart-add-item'),
      function (b) { return String(b.getAttribute('data-item-id')); }
    );

    function show() { if (dismissed) return; pop.hidden = false; pop.setAttribute('aria-hidden', 'false'); pop.classList.add('is-open'); }
    function hide() { pop.hidden = true; pop.setAttribute('aria-hidden', 'true'); pop.classList.remove('is-open'); }

    function otherInCart() {
      try {
        var items = Snipcart.store.getState().cart.items.items || [];
        return items.some(function (it) { return otherSkus.indexOf(String(it.id)) !== -1; });
      } catch (e) { return false; }
    }

    var closeBtn = pop.querySelector('.xsell-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { hide(); dismissed = true; });

    try {
      Snipcart.events.on('item.added', function (item) {
        if (!item) return;
        if (String(item.id) === currentSku) {
          if (!otherInCart()) show();
        } else if (otherSkus.indexOf(String(item.id)) !== -1) {
          hide();
        }
      });
    } catch (e) { /* no-op */ }
  }

  document.addEventListener('snipcart.ready', init);
})();

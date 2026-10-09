// Meta Pixel - evenimente e-commerce legate de Snipcart
(function () {
  var CUR = "RON";

  // ViewContent pe pagina de produs (datele vin din window.__fbProduct__)
  function fireViewContent() {
    if (!window.fbq || !window.__fbProduct__) return;
    var p = window.__fbProduct__;
    try {
      fbq("track", "ViewContent", {
        content_ids: [p.id],
        content_type: "product",
        content_name: p.name,
        content_category: p.category,
        value: Number(p.price) || 0,
        currency: CUR,
      });
    } catch (e) {}
  }
  if (document.readyState === "complete") fireViewContent();
  else window.addEventListener("load", fireViewContent);

  // AddToCart + Purchase din evenimentele Snipcart
  document.addEventListener("snipcart.ready", function () {
    if (!window.Snipcart || !window.fbq) return;
    try {
      Snipcart.events.on("item.adding", function (item) {
        var qty = item.quantity || 1;
        fbq("track", "AddToCart", {
          content_ids: [item.id],
          content_type: "product",
          content_name: item.name,
          value: (Number(item.price) || 0) * qty,
          currency: CUR,
        });
      });

      Snipcart.events.on("order.completed", function (order) {
        var ids = [];
        var numItems = 0;
        try {
          (order.items || []).forEach(function (i) {
            ids.push(i.id);
            numItems += i.quantity || 1;
          });
        } catch (e) {}
        fbq("track", "Purchase", {
          value: Number(order.grandTotal || order.total || 0),
          currency: order.currency || CUR,
          content_ids: ids,
          content_type: "product",
          num_items: numItems,
        });
      });
    } catch (e) {}
  });
})();

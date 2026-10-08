/* Preview-only browser adapter. It never authenticates against the live CMS. */
(function () {
  var originalFetch = window.fetch.bind(window);
  var prefix = 'dr-siddique-preview:';
  function read(page) {
    try { return JSON.parse(sessionStorage.getItem(prefix + page) || '[]'); }
    catch (e) { return []; }
  }
  window.fetch = function (input, options) {
    var url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin !== location.origin || url.pathname.indexOf('/api/public/cms/') !== 0) {
      return originalFetch(input, options);
    }
    var method = (options && options.method) || 'GET';
    var data = {};
    if (url.pathname.endsWith('/login')) {
      data = { authenticated: true };
    } else if (url.pathname.endsWith('/content')) {
      data = { items: read(url.searchParams.get('page') || 'index') };
    } else if (url.pathname.endsWith('/save') && method === 'POST') {
      var payload = JSON.parse(options.body);
      var items = read(payload.page);
      payload.items.forEach(function (item) {
        items = items.filter(function (old) { return old.cms_id !== item.cms_id; });
        items.push(item);
      });
      sessionStorage.setItem(prefix + payload.page, JSON.stringify(items));
      data = { ok: true };
    } else if (url.pathname.endsWith('/logout')) {
      data = { ok: true };
    } else {
      return Promise.resolve(new Response(JSON.stringify({ error: 'Preview only' }), { status: 400 }));
    }
    return Promise.resolve(new Response(JSON.stringify(data), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    }));
  };
})();
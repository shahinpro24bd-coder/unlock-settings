/* Preview-only content storage; admin credentials are verified on the server. */
(function () {
  var originalFetch = window.fetch.bind(window);
  var prefix = 'dr-siddique-preview:';
  function read(page) {
    try { return JSON.parse(sessionStorage.getItem(prefix + page) || '[]'); }
    catch (e) { return []; }
  }
  window.fetch = async function (input, options) {
    var url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin !== location.origin || url.pathname.indexOf('/api/public/cms/') !== 0) {
      return originalFetch(input, options);
    }
    var method = (options && options.method) || 'GET';
    var data = {};
    if (url.pathname.endsWith('/login')) {
      return originalFetch(input, options);
    } else if (url.pathname.endsWith('/content')) {
      data = { items: read(url.searchParams.get('page') || 'index') };
    } else if (url.pathname.endsWith('/save') && method === 'POST') {
      var response = await originalFetch('/api/public/cms/login', { cache: 'no-store' });
      var session = await response.json();
      if (!session.authenticated || !/2\.html$/.test(location.pathname)) {
        return new Response(JSON.stringify({ error: 'লগইন করুন' }), { status: 401 });
      }
      var payload = JSON.parse(options.body);
      var items = read(payload.page);
      payload.items.forEach(function (item) {
        items = items.filter(function (old) { return old.cms_id !== item.cms_id; });
        items.push(item);
      });
      sessionStorage.setItem(prefix + payload.page, JSON.stringify(items));
      data = { ok: true };
    } else if (url.pathname.endsWith('/logout')) {
      return originalFetch(input, options);
    } else {
      return Promise.resolve(new Response(JSON.stringify({ error: 'Preview only' }), { status: 400 }));
    }
    return Promise.resolve(new Response(JSON.stringify(data), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    }));
  };
})();
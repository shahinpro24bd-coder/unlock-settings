/* CMS content loader — applies saved content to the static page.
   Loaded on every page (live and edit copy).

   No flash of stale content:
   - the requests are started in <head> by cms-boot.js,
   - a device with a local cache paints the cached content immediately,
   - a device with no cache is held back by cms-boot.js until the fresh
     content, font and colour from the database have been applied. */
(function () {
  var page = window.CMS_PAGE || "index";
  var CACHE_KEY = "cms-cache:" + page;
  var SETTINGS_KEY = "cms-settings";
  var boot = window.__CMS_BOOT;
  var gate = window.__CMS_GATE || { release: function () {} };

  function depth(el) {
    var d = 0;
    while (el && el.parentElement) {
      d++;
      el = el.parentElement;
    }
    return d;
  }

  function apply(items) {
    if (!items || !items.length) return;
    /* resolve targets first, then apply parents before children so a saved
       parent never wipes an already-applied child edit */
    var jobs = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var domId = String(it.cms_id).replace(/::(fs|color|bgcolor)$/, "");
      var nodes = [];
      try {
        nodes =
          domId.indexOf("path:") === 0
            ? document.querySelectorAll(domId.slice(5))
            : document.querySelectorAll('[data-cms-id="' + domId + '"]');
      } catch (e) {
        nodes = [];
      }
      for (var j = 0; j < nodes.length; j++) {
        jobs.push({ el: nodes[j], it: it, d: depth(nodes[j]) });
      }
    }

    jobs.sort(function (a, b) {
      return a.d - b.d;
    });
    for (var k = 0; k < jobs.length; k++) {
      var el = jobs[k].el;
      var item = jobs[k].it;
      try {
        if (item.kind === "image") el.setAttribute("src", item.value);
        else if (item.kind === "placeholder") el.setAttribute("placeholder", item.value);
        else if (item.kind === "bg") el.style.backgroundImage = "url('" + item.value + "')";
        else if (item.kind === "fontsize") el.style.fontSize = item.value;
        /* per-element colour overrides were removed from the editor:
           old saved values are ignored so the theme colour always wins */
        else if (item.kind === "color" || item.kind === "bgcolor") {
          /* no-op */
        }


        else if (!el.hasAttribute("data-cms-editing") && el.innerHTML !== item.value)
          el.innerHTML = item.value;
      } catch (e) {
        /* ignore a single bad item */
      }
    }
  }

  function toSettings(items) {
    var s = {};
    for (var i = 0; i < (items || []).length; i++) {
      if (items[i].cms_id === "font") s.font = items[i].value;
      if (items[i].cms_id === "color") s.color = items[i].value;
    }
    return s;
  }

  function applySettings(s) {
    window.CMS_SETTINGS = s;
    if (window.CMS_THEME) window.CMS_THEME.apply(s);
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function read(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* 1) instant paint from cache (returning devices only) */
  var cached = read(CACHE_KEY);
  if (cached) apply(cached);
  var cachedSettings = read(SETTINGS_KEY);
  if (cachedSettings) applySettings(cachedSettings);

  /* 2) fresh copy from the database (started in <head> by cms-boot.js) */
  function fetchFresh(url) {
    return fetch(url + "&t=" + Date.now(), {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        return (d && d.items) || [];
      })
      .catch(function () {
        return null;
      });
  }

  var contentP =
    (boot && boot.page === page && boot.content) ||
    fetchFresh("/api/public/cms/content?page=" + encodeURIComponent(page));
  var settingsP =
    (boot && boot.settings) || fetchFresh("/api/public/cms/content?page=site-settings");

  var settingsDone = settingsP.then(function (items) {
    if (!items) return;
    var s = toSettings(items);
    applySettings(s);
    save(SETTINGS_KEY, s);
    document.dispatchEvent(new CustomEvent("cms:settings", { detail: s }));
  });

  var contentDone = contentP.then(function (items) {
    if (items) {
      apply(items);
      save(CACHE_KEY, items);
    }
    window.CMS_LOADED = true;
    document.dispatchEvent(new CustomEvent("cms:loaded", { detail: items || [] }));
  });

  /* 3) reveal the page once the saved version is on screen */
  Promise.all([contentDone, settingsDone])
    .then(function () {
      // one frame so the applied styles/text are painted together
      requestAnimationFrame(function () {
        requestAnimationFrame(gate.release);
      });
    })
    .catch(function () {
      gate.release();
    });
})();

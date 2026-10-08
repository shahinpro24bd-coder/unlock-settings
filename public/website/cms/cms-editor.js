/* CMS visual editor — only loaded on the *2.html edit copies. */
(function () {
  if (!/2\.html$/.test(location.pathname)) return;
  var page = window.CMS_PAGE || "index";
  var changes = {}; // cms_id -> {cms_id, kind, value}
  var authed = false;

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".cms-bar{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:10px 14px;box-shadow:0 8px 30px rgba(0,0,0,.18);font-family:system-ui,'Hind Siliguri',sans-serif;font-size:14px}",
    ".cms-btn{border:0;border-radius:8px;padding:8px 14px;font-size:14px;cursor:pointer;font-family:inherit}",
    ".cms-btn-save{background:#16a34a;color:#fff}",
    ".cms-btn-out{background:#111827;color:#fff}",
    ".cms-btn-login{position:fixed;left:16px;bottom:16px;z-index:2147483000;background:#111827;color:#fff;border:0;border-radius:10px;padding:10px 16px;font-size:14px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:system-ui,'Hind Siliguri',sans-serif}",
    ".cms-on [data-cms-id]{outline:1px dashed rgba(220,38,70,.55);outline-offset:2px;position:relative}",
    ".cms-on [data-cms-id]:hover{outline:2px solid #dc2646;background:rgba(220,38,70,.05)}",
    ".cms-pencil{position:absolute;z-index:2147482000;width:26px;height:26px;border-radius:50%;background:#dc2646;color:#fff;border:0;cursor:pointer;font-size:13px;line-height:26px;text-align:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.3)}",
    "[data-cms-editing]{outline:2px solid #16a34a !important;background:#fff !important;color:#111 !important;-webkit-text-fill-color:#111 !important;caret-color:#dc2646 !important;text-shadow:none !important;min-width:40px;cursor:text;user-select:text !important;-webkit-user-select:text !important;animation:none !important;transition:none !important}",
    "[data-cms-editing] *{-webkit-text-fill-color:inherit !important;caret-color:#dc2646 !important;user-select:text !important;-webkit-user-select:text !important;animation:none !important}",
    "@keyframes cms-caret{0%,45%{opacity:1}50%,100%{opacity:0}}",
    ".cms-caret{position:fixed;width:2px;background:#dc2646;z-index:2147483400;pointer-events:none;animation:cms-caret 1s steps(1) infinite;box-shadow:0 0 0 1px rgba(255,255,255,.6)}",


    ".cms-modal{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:system-ui,'Hind Siliguri',sans-serif}",
    ".cms-card{background:#fff;border-radius:14px;padding:24px;width:320px;box-shadow:0 20px 60px rgba(0,0,0,.35)}",
    ".cms-card h3{margin:0 0 14px;font-size:18px;color:#111}",
    ".cms-card input{width:100%;box-sizing:border-box;margin-bottom:10px;padding:10px;border:1px solid #d4d4d4;border-radius:8px;font-size:14px}",
    ".cms-err{color:#dc2646;font-size:13px;margin-bottom:8px;display:none}",
    ".cms-btn-set{background:#2563eb;color:#fff}",
    ".cms-panel{position:fixed;right:16px;bottom:74px;z-index:2147483500;width:340px;max-width:calc(100vw - 32px);box-sizing:border-box;max-height:70vh;overflow:auto;background:#fff;border:1px solid #e5e5e5;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.25);padding:16px;font-family:system-ui,sans-serif;color:#111}",
    ".cms-panel h4{margin:0 0 8px;font-size:15px}",
    ".cms-panel input[type=search]{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #d4d4d4;border-radius:8px;margin-bottom:8px;font-size:13px}",
    ".cms-fontlist{max-height:210px;overflow:auto;border:1px solid #eee;border-radius:8px;margin-bottom:14px}",
    ".cms-fontitem{display:block;width:100%;text-align:left;background:inherit;color:inherit;border:0;padding:7px 10px;font-size:15px;cursor:pointer;border-bottom:1px solid #f3f3f3}",
    ".cms-fontitem:hover{background:#f3f4f6}",
    ".cms-fontitem.sel{background:#111827;color:#fff}",
    ".cms-swatches{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}",
    ".cms-sw{width:100%;padding-top:100%;border-radius:6px;cursor:pointer;border:2px solid transparent}",
    ".cms-sw.sel{border-color:#111827;box-shadow:0 0 0 2px #fff inset}",
    ".cms-toast{position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:2147483600;background:#111827;color:#fff;padding:10px 18px;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px}",
    /* video manager */
    ".cms-on [data-cms-videos]{outline:2px dashed #2563eb !important;outline-offset:6px}",
    ".cms-on [data-cms-videos] iframe{pointer-events:none}",
    ".cms-vpanel{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:system-ui,'Hind Siliguri',sans-serif}",
    ".cms-vcard{background:#fff;border-radius:14px;padding:20px;width:420px;max-width:92vw;max-height:84vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.35);color:#111}",
    ".cms-vcard h3{margin:0 0 12px;font-size:17px}",
    ".cms-vrow{display:flex;gap:8px;margin-bottom:12px}",
    ".cms-vrow input{flex:1;padding:10px;border:1px solid #d4d4d4;border-radius:8px;font-size:14px}",
    ".cms-vlist{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}",
    ".cms-vitem{display:flex;align-items:center;gap:10px;border:1px solid #eee;border-radius:10px;padding:6px}",
    ".cms-vitem img{width:80px;height:45px;object-fit:cover;border-radius:6px;background:#000}",
    ".cms-vitem span{flex:1;font-size:12px;color:#555;word-break:break-all}",
    ".cms-vdel{background:#dc2646;color:#fff;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:13px}",
    ".cms-vempty{font-size:13px;color:#888;margin-bottom:12px}",

  ].join("\n");
  document.head.appendChild(css);

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "cms-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 2600);
  }

  /* ---------- login ---------- */
  var loginBtn = document.createElement("button");
  loginBtn.className = "cms-btn-login";
  loginBtn.id = "cms-login-btn";
  loginBtn.textContent = "\u2699 \u09b8\u09c7\u099f\u09bf\u0982\u09b8";
  document.body.appendChild(loginBtn);
  loginBtn.addEventListener("click", openLogin);

  function openLogin() {
    var wrap = document.createElement("div");
    wrap.className = "cms-modal";
    wrap.innerHTML =
      '<div class="cms-card"><h3>\u098f\u09a1\u09bf\u099f\u09b0 \u09b2\u0997\u0987\u09a8</h3>' +
      '<div class="cms-err" id="cms-err"></div>' +
      '<input id="cms-user" placeholder="Username" autocomplete="username">' +
      '<input id="cms-pass" type="password" placeholder="Password" autocomplete="current-password">' +
      '<button class="cms-btn cms-btn-save" id="cms-do-login" style="width:100%">\u09b2\u0997\u0987\u09a8</button>' +
      '<button class="cms-btn" id="cms-cancel" style="width:100%;margin-top:8px;background:#f3f4f6;color:#111">\u09ac\u09be\u09a4\u09bf\u09b2</button></div>';
    document.body.appendChild(wrap);
    wrap.querySelector("#cms-cancel").onclick = function () {
      wrap.remove();
    };
    wrap.querySelector("#cms-do-login").onclick = function () {
      var u = wrap.querySelector("#cms-user").value;
      var p = wrap.querySelector("#cms-pass").value;
      fetch("/api/public/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      })
        .then(function (r) {
          return r.json().then(function (d) {
            return { ok: r.ok, d: d };
          });
        })
        .then(function (res) {
          if (!res.ok) {
            var err = wrap.querySelector("#cms-err");
            err.style.display = "block";
            err.textContent = res.d.error || "login failed";
            return;
          }
          wrap.remove();
          enableEditing();
        });
    };
  }

  /* ---------- editing (click directly on any element) ---------- */
  function placePencils() {
    /* no pencils: direct click editing */
  }

  var editing = null; // element currently being edited

  /* put the caret exactly where the user clicked instead of selecting all */
  function caretFromPoint(x, y) {
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(x, y);
    if (document.caretPositionFromPoint) {
      var p = document.caretPositionFromPoint(x, y);
      if (!p) return null;
      var r = document.createRange();
      r.setStart(p.offsetNode, p.offset);
      r.collapse(true);
      return r;
    }
    return null;
  }

  /* element identity helpers */
  var lastTargetEl = null;

  /* stable selector for elements that have no data-cms-id of their own */
  function pathFor(el) {
    var parts = [];
    var node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      var tag = node.tagName.toLowerCase();
      var parent = node.parentElement;
      if (!parent) break;
      var idx = 1;
      for (var i = 0; i < parent.children.length; i++) {
        var c = parent.children[i];
        if (c === node) break;
        if (c.tagName === node.tagName) idx++;
      }
      parts.unshift(tag + ":nth-of-type(" + idx + ")");
      node = parent;
    }
    return "body>" + parts.join(">");
  }

  function idFor(el) {
    return el.getAttribute("data-cms-id") || "path:" + pathFor(el);
  }





  function bindClickEditing() {
    document.addEventListener(
      "click",
      function (e) {
        if (!authed) return;
        if (e.target.closest(".cms-bar,.cms-modal,.cms-btn-login,.cms-toast,.cms-panel"))
          return;




        /* already typing inside this element: let the browser handle the
           click normally (caret placement, text selection, etc.) */
        if (e.target.closest("[data-cms-editing]")) return;

        /* video grid: open the YouTube manager instead of text editing */
        var vbox = e.target.closest("[data-cms-videos]");
        if (vbox) {
          e.preventDefault();
          e.stopPropagation();
          if (editing) editing.blur();
          openVideos(vbox);
          return;
        }

        if (e.target.closest(".navbar a[href]")) return;
        var el = e.target.closest("[data-cms-id]");
        if (!el) {
          /* clicking outside finishes the current edit */
          if (editing) editing.blur();
          /* while in edit mode, never navigate away by accident */
          if (e.target.closest("button")) e.preventDefault();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        lastTargetEl = el;
        startEdit(el, el.getAttribute("data-cms-kind") || "text", e.clientX, e.clientY);


      },
      true,
    );
  }

  /* ---------- A+ / A- size controls (selection based) ---------- */
  var lastActiveBox = null;

  function isTextBox(el) {
    var kind = el.getAttribute("data-cms-kind") || "text";
    return kind !== "image" && kind !== "bg" && kind !== "placeholder";
  }

  function activeTextBox() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      var node = sel.getRangeAt(0).commonAncestorContainer;
      if (node && node.nodeType === 3) node = node.parentElement;
      if (node) {
        var box = node.closest("[data-cms-id]");
        if (box && isTextBox(box)) return box;
      }
    }
    if (editing && isTextBox(editing)) return editing;
    return lastActiveBox;
  }

  document.addEventListener("selectionchange", function () {
    var box = activeTextBox();
    if (box) lastActiveBox = box;
  });

  function changeFontSize(delta) {
    var el = activeTextBox();
    if (!el) {
      toast("প্রথমে টেক্সট বক্সটি সিলেক্ট করুন");
      return;
    }
    var cur = parseFloat(window.getComputedStyle(el).fontSize) || 16;
    var next = Math.max(8, Math.min(120, cur + delta));
    el.style.fontSize = next + "px";
    record(el, "fontsize", next + "px");
  }

  /* ---------- mobile: drag selected text to resize ---------- */
  var fontDrag = null;
  var fontDragThreshold = 12;

  function onTouchStart(e) {
    if (!authed) return;
    var t = e.touches[0];
    fontDrag = null;
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var box = activeTextBox();
    if (!box) return;
    var rect = box.getBoundingClientRect();
    if (
      t.clientX < rect.left ||
      t.clientX > rect.right ||
      t.clientY < rect.top ||
      t.clientY > rect.bottom
    )
      return;
    fontDrag = {
      el: box,
      startY: t.clientY,
      startSize: parseFloat(window.getComputedStyle(box).fontSize) || 16,
    };
  }

  function onTouchMove(e) {
    if (!fontDrag) return;
    var t = e.touches[0];
    var dy = fontDrag.startY - t.clientY; // drag up = bigger
    if (Math.abs(dy) < fontDragThreshold) return;
    e.preventDefault();
    var steps = Math.round(dy / fontDragThreshold);
    var next = Math.max(8, Math.min(120, fontDrag.startSize + steps));
    fontDrag.el.style.fontSize = next + "px";
    record(fontDrag.el, "fontsize", next + "px");
  }

  function onTouchEnd() {
    fontDrag = null;
  }

  function bindFontDrag() {
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  /* legacy hooks kept as no-ops */
  function showFs() {}
  function hideFs() {}

  /* ---------- visible caret (some template CSS hides the native one) ----- */
  var caretEl = null;
  var caretTimer = null;

  function caretRect() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    var r = sel.getRangeAt(0).cloneRange();
    var rect = r.getClientRects()[0];
    if (!rect) {
      var span = document.createElement("span");
      span.textContent = "\u200b";
      r.insertNode(span);
      rect = span.getBoundingClientRect();
      var p = span.parentNode;
      span.remove();
      if (p) p.normalize();
    }
    return rect && rect.height ? rect : null;
  }

  function drawCaret() {
    if (!editing) return hideCaret();
    var rect = caretRect();
    if (!rect) return;
    if (!caretEl) {
      caretEl = document.createElement("div");
      caretEl.className = "cms-caret";
      document.body.appendChild(caretEl);
    }
    caretEl.style.left = rect.left + "px";
    caretEl.style.top = rect.top + "px";
    caretEl.style.height = rect.height + "px";
  }

  function showCaret() {
    hideCaret();
    drawCaret();
    caretTimer = setInterval(drawCaret, 200);
    window.addEventListener("scroll", drawCaret, true);
    window.addEventListener("resize", drawCaret);
  }

  function hideCaret() {
    if (caretTimer) clearInterval(caretTimer);
    caretTimer = null;
    if (caretEl) caretEl.remove();
    caretEl = null;
    window.removeEventListener("scroll", drawCaret, true);
    window.removeEventListener("resize", drawCaret);
  }

  function record(el, kind, value) {
    var id = idFor(el);
    /* style edits live under their own row id so they never overwrite the
       text of the same element (one DB row per page + cms_id) */
    var suffix = kind === "fontsize" ? "::fs" : "";
    changes[id + "::" + kind] = { cms_id: id + suffix, kind: kind, value: value };
    updateBar();
  }


  /* innerHTML without any editor UI that may have slipped inside */
  function cleanHtml(el) {
    var clone = el.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll(".cms-pencil,.cms-caret"), function (n) {
      n.remove();
    });
    clone.removeAttribute("contenteditable");
    clone.removeAttribute("data-cms-editing");
    return clone.innerHTML.trim();
  }


  function startEdit(el, kind, x, y) {
    if (kind === "image" || kind === "bg") return pickImage(el, kind);
    if (kind === "placeholder") {
      var next = window.prompt("Placeholder", el.getAttribute("placeholder") || "");
      if (next !== null) {
        el.setAttribute("placeholder", next);
        record(el, kind, next);
      }
      return;
    }

    /* finish any previous edit first so two boxes are never editable at once */
    if (editing && editing !== el) editing.blur();

    var original = el.innerHTML;
    editing = el;
    el.setAttribute("contenteditable", "true");
    el.setAttribute("data-cms-editing", "1");
    el.setAttribute("spellcheck", "false");
    el.focus({ preventScroll: true });

    /* caret where the user clicked (fallback: end of the text) */
    var sel = window.getSelection();
    var range = typeof x === "number" ? caretFromPoint(x, y) : null;
    if (!range || !el.contains(range.startContainer)) {
      range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(range);

    showFs(el);
    showCaret();


    function onKey(ev) {
      ev.stopPropagation();
      if (ev.key === "Escape") {
        ev.preventDefault();
        el.innerHTML = original;
        cancelled = true;
        el.blur();
      }
    }
    /* paste as plain text so foreign markup never breaks the layout */
    function onPaste(ev) {
      ev.preventDefault();
      var text = (ev.clipboardData || window.clipboardData).getData("text");
      document.execCommand("insertText", false, text);
    }
    var cancelled = false;

    function finish() {
      el.removeEventListener("blur", finish);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("paste", onPaste);
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-cms-editing");
      el.removeAttribute("spellcheck");
      if (editing === el) editing = null;
      if (!cancelled) {
        var html = cleanHtml(el);
        if (html !== original.trim()) record(el, "text", html);
      }
      hideFs();
      hideCaret();

      placePencils();
    }

    el.addEventListener("blur", finish);
    el.addEventListener("keydown", onKey);
    el.addEventListener("paste", onPaste);
  }


  function pickImage(el, kind) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var dataUrl = String(reader.result);
        toast("\u0986\u09aa\u09b2\u09cb\u09a1 \u09b9\u099a\u09cd\u099b\u09c7...");
        fetch("/api/public/cms/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mime: file.type, data: dataUrl }),
        })
          .then(function (r) {
            return r.json();
          })
          .then(function (d) {
            if (!d.url) return toast("\u0986\u09aa\u09b2\u09cb\u09a1 \u09ac\u09cd\u09af\u09b0\u09cd\u09a5");
            if (kind === "image") el.setAttribute("src", d.url);
            else el.style.backgroundImage = "url('" + d.url + "')";
            record(el, kind, d.url);
            toast("\u099b\u09ac\u09bf \u09af\u09c1\u0995\u09cd\u09a4 \u09b9\u09df\u09c7\u099b\u09c7");
            placePencils();
          });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }


  /* ---------- settings (font + theme colour) ---------- */
  var settings = {};            // pending settings changes
  var current = window.CMS_SETTINGS || {}; // currently applied settings
  var panel = null;

  document.addEventListener("cms:settings", function (e) {
    current = e.detail || {};
    // A fresh settings response must not replace unsaved editor previews.
    if (window.CMS_THEME) window.CMS_THEME.apply(settings);
  });

  function previewFont(f) {
    if (window.CMS_THEME) window.CMS_THEME.applyFont(f);
  }
  function previewColor(c) {
    if (window.CMS_THEME) window.CMS_THEME.applyTheme(c);
  }

  function toggleSettings() {
    if (panel) {
      panel.remove();
      panel = null;
      return;
    }

    panel = document.createElement("div");
    panel.className = "cms-panel";
    panel.innerHTML =
      '<h4>ফন্ট</h4>' +
      '<input type="search" id="cms-font-search" placeholder="ফন্ট খুঁজুন" aria-label="ফন্ট খুঁজুন">' +
      '<div class="cms-fontlist" id="cms-font-list"></div>' +
      '<h4>থিম কালার</h4>' +
      '<div class="cms-swatches" id="cms-color-list"></div>' +
      '<label for="cms-custom-color">কাস্টম কালার</label> ' +
      '<input type="color" id="cms-custom-color" aria-label="কাস্টম কালার">';
    document.body.appendChild(panel);

    var fonts = window.CMS_FONTS || ["Hind Siliguri", "Noto Sans Bengali", "Roboto"];
    var colors = window.CMS_COLORS || ["#bf9456", "#2980b9", "#27ae60", "#dc2646"];
    var fontList = panel.querySelector("#cms-font-list");
    var colorList = panel.querySelector("#cms-color-list");
    var customColor = panel.querySelector("#cms-custom-color");

    function selectedFont() {
      return settings.font || current.font || "Hind Siliguri";
    }
    function selectedColor() {
      return settings.color || current.color || (window.CMS_THEME && window.CMS_THEME.baseColor) || "#bf9456";
    }
    function renderFonts(query) {
      fontList.innerHTML = "";
      fonts.forEach(function (font) {
        if (font.toLowerCase().indexOf(query.toLowerCase()) < 0) return;
        var item = document.createElement("button");
        item.type = "button";
        item.className = "cms-fontitem" + (selectedFont() === font ? " sel" : "");
        item.textContent = font;
        item.setAttribute("aria-pressed", String(selectedFont() === font));
        item.onclick = function () {
          settings.font = font;
          previewFont(font);
          updateBar();
          renderFonts(panel.querySelector("#cms-font-search").value);
        };
        fontList.appendChild(item);
      });
    }
    function renderColors() {
      colorList.innerHTML = "";
      colors.forEach(function (color) {
        var swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "cms-sw" + (selectedColor().toLowerCase() === color.toLowerCase() ? " sel" : "");
        swatch.style.backgroundColor = color;
        swatch.title = color;
        swatch.setAttribute("aria-label", color);
        swatch.setAttribute("aria-pressed", String(selectedColor().toLowerCase() === color.toLowerCase()));
        swatch.onclick = function () { selectColor(color); };
        colorList.appendChild(swatch);
      });
      customColor.value = selectedColor();
    }
    function selectColor(color) {
      settings.color = color;
      previewColor(color);
      updateBar();
      renderColors();
    }
    panel.querySelector("#cms-font-search").oninput = function (e) {
      renderFonts(e.target.value);
    };
    customColor.oninput = function (e) { selectColor(e.target.value); };
    renderFonts("");
    renderColors();
  }

  /* ---------- YouTube video manager (only on the 2.html edit copies) ----- */
  function ytId(url) {
    var s = String(url || "").trim();
    var m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    return null;
  }

  function readVideos(box) {
    var out = [];
    Array.prototype.forEach.call(box.querySelectorAll("iframe"), function (f) {
      var id = ytId(f.getAttribute("src") || "");
      if (id && out.indexOf(id) < 0) out.push(id);
    });
    return out;
  }

  function videosHtml(ids) {
    if (!ids.length)
      return '<p class="cms-video-empty text-center w-100">\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u09ad\u09bf\u09a1\u09bf\u0993 \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be \u09b9\u09df\u09a8\u09bf\u0964</p>';
    return ids
      .map(function (id) {
        return (
          '<div class="video-card"><iframe src="https://www.youtube.com/embed/' +
          id +
          '?rel=0&modestbranding=1&iv_load_policy=3" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
        );
      })
      .join("");
  }

  function openVideos(box) {
    var ids = readVideos(box);

    var wrap = document.createElement("div");
    wrap.className = "cms-vpanel";
    wrap.innerHTML =
      '<div class="cms-vcard">' +
      "<h3>\u09ad\u09bf\u09a1\u09bf\u0993 \u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09be\u09b0 (YouTube)</h3>" +
      '<div class="cms-vrow"><input id="cms-vurl" placeholder="YouTube \u09b2\u09bf\u0982\u0995 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8">' +
      '<button class="cms-btn cms-btn-save" id="cms-vadd">\u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09c1\u09a8</button></div>' +
      '<div class="cms-vlist" id="cms-vlist"></div>' +
      '<button class="cms-btn cms-btn-out" id="cms-vclose" style="width:100%">\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8</button>' +
      "</div>";
    document.body.appendChild(wrap);

    var list = wrap.querySelector("#cms-vlist");
    var input = wrap.querySelector("#cms-vurl");

    function commit() {
      box.innerHTML = videosHtml(ids);
      record(box, "text", videosHtml(ids));
    }

    function render() {
      list.innerHTML = "";
      if (!ids.length) {
        var e = document.createElement("div");
        e.className = "cms-vempty";
        e.textContent = "\u0995\u09cb\u09a8\u09cb \u09ad\u09bf\u09a1\u09bf\u0993 \u09a8\u09c7\u0987\u0964";
        list.appendChild(e);
        return;
      }
      ids.forEach(function (id, i) {
        var row = document.createElement("div");
        row.className = "cms-vitem";
        row.innerHTML =
          '<img src="https://img.youtube.com/vi/' +
          id +
          '/mqdefault.jpg" alt=""><span>' +
          id +
          "</span>";
        var del = document.createElement("button");
        del.className = "cms-vdel";
        del.textContent = "\u09ae\u09c1\u099b\u09c1\u09a8";
        del.onclick = function () {
          ids.splice(i, 1);
          commit();
          render();
        };
        row.appendChild(del);
        list.appendChild(row);
      });
    }
    render();

    wrap.querySelector("#cms-vadd").onclick = function () {
      var id = ytId(input.value);
      if (!id) return toast("\u09b8\u09a0\u09bf\u0995 YouTube \u09b2\u09bf\u0982\u0995 \u09a6\u09bf\u09a8");
      if (ids.indexOf(id) >= 0) return toast("\u098f\u0987 \u09ad\u09bf\u09a1\u09bf\u0993\u099f\u09bf \u0986\u0997\u09c7\u0987 \u0986\u099b\u09c7");
      ids.push(id);
      input.value = "";
      commit();
      render();
      toast("\u09ad\u09bf\u09a1\u09bf\u0993 \u09af\u09c1\u0995\u09cd\u09a4 \u09b9\u09df\u09c7\u099b\u09c7 \u2014 \u09b8\u09c7\u09ad \u0995\u09b0\u09c1\u09a8");
    };
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") wrap.querySelector("#cms-vadd").click();
    });
    wrap.querySelector("#cms-vclose").onclick = function () {
      wrap.remove();
    };
    wrap.addEventListener("click", function (ev) {
      if (ev.target === wrap) wrap.remove();
    });
  }

  /* ---------- save bar ---------- */
  var bar;
  function updateBar() {
    if (!bar) return;
    var n = Object.keys(changes).length + Object.keys(settings).length;
    bar.querySelector("#cms-count").textContent = n + " \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8";
  }

  function enableEditing() {
    authed = true;
    document.documentElement.classList.add("cms-on");
    loginBtn.style.display = "none";
    bar = document.createElement("div");
    bar.className = "cms-bar";
    bar.innerHTML =
      '<span id="cms-count">0 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8</span>' +
      '<button class="cms-btn" id="cms-fs-minus" title="\u099b\u09cb\u099f\u09cb \u0995\u09b0\u09c1\u09a8">A\u2212</button>' +
      '<button class="cms-btn" id="cms-fs-plus" title="\u09ac\u09dc\u09cb \u0995\u09b0\u09c1\u09a8">A+</button>' +
      '<button class="cms-btn cms-btn-set" id="cms-settings">\u2699 \u09b8\u09c7\u099f\u09bf\u0982\u09b8</button>' +
      '<button class="cms-btn cms-btn-save" id="cms-save">\u09b8\u09c7\u09ad \u0995\u09b0\u09c1\u09a8</button>' +
      '<button class="cms-btn cms-btn-out" id="cms-logout">\u09b2\u0997 \u0986\u0989\u099f</button>';
    document.body.appendChild(bar);
    bar.querySelector("#cms-save").onclick = save;
    bar.querySelector("#cms-settings").onclick = toggleSettings;
    bar.querySelector("#cms-logout").onclick = logout;
    bar.querySelector("#cms-fs-minus").onclick = function (e) {
      e.preventDefault();
      changeFontSize(-1);
    };
    bar.querySelector("#cms-fs-plus").onclick = function (e) {
      e.preventDefault();
      changeFontSize(1);
    };
    bindClickEditing();
    bindFontDrag();

    toast("\u098f\u09a1\u09bf\u099f \u09ae\u09cb\u09a1 \u099a\u09be\u09b2\u09c1");
  }

  function save() {
    var items = Object.keys(changes).map(function (k) {
      return changes[k];
    });
    var settingItems = Object.keys(settings).map(function (k) {
      return { cms_id: k, kind: "setting", value: settings[k] };
    });
    if (settingItems.length) {
      fetch("/api/public/cms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "site-settings", items: settingItems }),
      })
        .then(function (r) {
          return r.json().then(function (d) {
            return { ok: r.ok, d: d };
          });
        })
        .then(function (res) {
          if (!res.ok) return toast("\u09b8\u09c7\u099f\u09bf\u0982\u09b8 \u09b8\u09c7\u09ad \u09ac\u09cd\u09af\u09b0\u09cd\u09a5");
          for (var k in settings) current[k] = settings[k];
          settings = {};
          try {
            localStorage.setItem("cms-settings", JSON.stringify(current));
          } catch (e) {}
          updateBar();
          toast("\u09b8\u09c7\u099f\u09bf\u0982\u09b8 \u09b8\u09c7\u09ad \u09b9\u09df\u09c7\u099b\u09c7 \u2713");
        });
    }
    if (!items.length) return settingItems.length ? undefined : toast("\u0995\u09cb\u09a8\u09cb \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09a8\u09c7\u0987");
    fetch("/api/public/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: page, items: items }),
    })
      .then(function (r) {
        return r.json().then(function (d) {
          return { ok: r.ok, d: d };
        });
      })
      .then(function (res) {
        if (!res.ok) return toast("\u09b8\u09c7\u09ad \u09ac\u09cd\u09af\u09b0\u09cd\u09a5: " + (res.d.error || ""));
        changes = {};
        updateBar();
        toast("\u09b8\u09c7\u09ad \u09b9\u09df\u09c7\u099b\u09c7 \u2713");
      });
  }

  function logout() {
    fetch("/api/public/cms/logout", { method: "POST" }).then(function () {
      location.reload();
    });
  }

  // resume an existing session
  fetch("/api/public/cms/login", { cache: "no-store" })
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      if (d && d.authenticated && !authed) enableEditing();
    })
    .catch(function () {});
})();

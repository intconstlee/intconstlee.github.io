/* core.js — 工具、主题、存储、图标 */
(function () {
  'use strict';

  var GI = window.GI = window.GI || {};

  /* ------------------------------ 图标 ------------------------------ */
  var ICON_PATHS = {
    home: '<path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4.6v-6H9.6v6H5a1 1 0 0 1-1-1v-9.4Z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    book: '<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v18H7.5A2.5 2.5 0 0 0 5 22V4.5Z"/><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H20"/>',
    search: '<circle cx="11" cy="11" r="6.6"/><path d="m16 16 4.4 4.4"/>',
    moon: '<path d="M20.5 14.2A8.6 8.6 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/>',
    arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    check: '<path d="m4.5 12.5 5 5L20 6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.4 5.7"/><path d="M20 4v7h-7"/>',
    play: '<path d="M8 5.5 18 12 8 18.5v-13Z"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a6.5 6.5 0 0 0-3.8 11.8c.7.5 1.1 1.3 1.1 2.2h5.4c0-.9.4-1.7 1.1-2.2A6.5 6.5 0 0 0 12 2Z"/>',
    code: '<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/><path d="m13.5 4-3 16"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
    clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7v5.4l3.4 2"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6.5 7 7.5 21h9L17.5 7"/><path d="M10 11v6M14 11v6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    flame: '<path d="M12 22c4 0 6.5-2.7 6.5-6.2 0-4.3-3.8-6-4.7-10.3-2.2 1.3-3.5 3-3.5 5 0 1.1.4 2 .4 2S9.2 11 8 9c-1.3 1.7-2.5 3.6-2.5 6.3C5.5 19 8 22 12 22Z"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.2l2.8 1.6"/><path d="M9 2h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.4"/>',
    warn: '<path d="M12 3.5 21.5 20h-19L12 3.5Z"/><path d="M12 9.5v4.5M12 17.2v.3"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.4"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M8 16.5h8"/>',
    grip: '<circle cx="9" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1.2" fill="currentColor" stroke="none"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    spark: '<path d="m12 3 2.2 6.3L21 11l-6.8 1.7L12 19l-2.2-6.3L3 11l6.8-1.7L12 3Z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6.5"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 20h16"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 20h16"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    external: '<path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    command: '<path d="M9 6a3 3 0 1 0-3 3h3V6Zm0 9H6a3 3 0 1 0 3 3v-3Zm6-9a3 3 0 1 1 3 3h-3V6Zm0 9h3a3 3 0 1 1-3 3v-3Z"/><rect x="9" y="9" width="6" height="6"/>',
    wifi: '<path d="M2.5 8.5a15 15 0 0 1 19 0"/><path d="M6 12a10 10 0 0 1 12 0"/><path d="M9.5 15.5a5 5 0 0 1 5 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>',
    database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/><path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'
  };

  GI.icon = function (name, size) {
    var p = ICON_PATHS[name] || ICON_PATHS.info;
    var s = size || 20;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  };

  GI.hydrateIcons = function (root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (n) {
      if (n.dataset.iconDone) return;
      n.innerHTML = GI.icon(n.dataset.icon);
      n.dataset.iconDone = '1';
      n.removeAttribute('data-icon');
    });
  };

  /* ------------------------------ 基础工具 ------------------------------ */
  var U = GI.util = {
    $: function (s, r) { return (r || document).querySelector(s); },
    $$: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    strip: function (s) { return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); },
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    pad: function (n, w) { return String(n).padStart(w || 2, '0'); },
    uid: function (p) { return (p || 'id') + '-' + Math.random().toString(36).slice(2, 9); },
    debounce: function (fn, ms) {
      var t;
      return function () { var a = arguments, ctx = this; clearTimeout(t); t = setTimeout(function () { fn.apply(ctx, a); }, ms); };
    },
    throttle: function (fn, ms) {
      var last = 0, timer;
      return function () {
        var ctx = this, a = arguments, now = Date.now();
        if (now - last >= ms) { last = now; fn.apply(ctx, a); }
        else { clearTimeout(timer); timer = setTimeout(function () { last = Date.now(); fn.apply(ctx, a); }, ms - (now - last)); }
      };
    },
    shuffle: function (arr, rnd) {
      var a = arr.slice(), r = rnd || Math.random;
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    rng: function (seed) {
      var s = seed >>> 0 || 1;
      return function () {
        s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
        return s / 4294967296;
      };
    },
    today: function (d) {
      d = d || new Date();
      return d.getFullYear() + '-' + U.pad(d.getMonth() + 1) + '-' + U.pad(d.getDate());
    },
    dayLabel: function (offset) {
      var names = ['日', '一', '二', '三', '四', '五', '六'];
      var d = new Date(); d.setDate(d.getDate() + offset);
      return '周' + names[d.getDay()];
    },
    timeAgo: function (ts) {
      var s = Math.floor((Date.now() - ts) / 1000);
      if (s < 60) return '刚刚';
      if (s < 3600) return Math.floor(s / 60) + ' 分钟前';
      if (s < 86400) return Math.floor(s / 3600) + ' 小时前';
      if (s < 86400 * 7) return Math.floor(s / 86400) + ' 天前';
      var d = new Date(ts); return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
    },
    duration: function (sec) {
      sec = Math.max(0, Math.round(sec || 0));
      if (sec < 60) return sec + ' 秒';
      var m = Math.floor(sec / 60), s = sec % 60;
      if (m < 60) return m + ' 分' + (s ? ' ' + s + ' 秒' : '');
      return Math.floor(m / 60) + ' 时 ' + (m % 60) + ' 分';
    },
    norm: function (s) {
      return String(s == null ? '' : s)
        .replace(/[\uFF01-\uFF5E]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
        .replace(/[\u3000\s]/g, '')
        .replace(/[，,、;；。]/g, '')
        .replace(/[“”"'‘’′]/g, '')
        .replace(/[（）]/g, function (c) { return c === '（' ? '(' : ')'; })
        .toLowerCase();
    },
    // 保留“非”的单引号/撇号：C'、C′、C’ 都归一为 c'
    normPrime: function (s) {
      return String(s == null ? '' : s)
        .replace(/[\uFF01-\uFF5E]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
        .replace(/[\u3000\s]/g, '')
        .replace(/[，,、;；。]/g, '')
        .replace(/[“”"‘’′]/g, "'")
        .replace(/[（）]/g, function (c) { return c === '（' ? '(' : ')'; })
        .toLowerCase();
    },
    answerMatches: function (input, accept) {
      if (!String(input || '').trim()) return false;
      var v1 = U.norm(input);
      var v2 = U.normPrime(input);
      var list = Array.isArray(accept) ? accept : [accept];
      return list.some(function (a) { return U.norm(a) === v1 || U.normPrime(a) === v2; });
    },
    parseNum: function (s) {
      var t = String(s).trim().replace(/[，,]/g, '');
      if (!t) return NaN;
      var m = /^(-?)(0x[0-9a-f]+|\d+(?:\.\d+)?)$/i.exec(t);
      if (!m) return NaN;
      var val = /^0x/i.test(m[2]) ? parseInt(m[2], 16) : parseFloat(m[2]);
      return m[1] === '-' ? -val : val;
    },
    param: function (name) {
      var q = location.hash.split('?')[1] || '';
      var m = new RegExp('(?:^|&)' + name + '=([^&]*)').exec(q);
      return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
    },
    setQuery: function (obj) {
      var parts = Object.keys(obj).filter(function (k) { return obj[k] != null && obj[k] !== ''; })
        .map(function (k) { return k + '=' + encodeURIComponent(obj[k]); });
      return parts.length ? '?' + parts.join('&') : '';
    },
    go: function (hash, opts) {
      if (location.hash === hash) { GI.router && GI.router.render(); return; }
      location.hash = hash;
    },
    toast: function (msg, ms) {
      var t = document.getElementById('toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('is-on');
      clearTimeout(t._timer);
      t._timer = setTimeout(function () { t.classList.remove('is-on'); }, ms || 2200);
    },
    focusMain: function () {
      var m = document.getElementById('app');
      if (m) { m.focus({ preventScroll: true }); }
    },
    reveal: function (root) {
      var items = (root || document).querySelectorAll('.reveal:not(.is-in)');
      if (!('IntersectionObserver' in window)) {
        items.forEach(function (n) { n.classList.add('is-in'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      items.forEach(function (n) { io.observe(n); });
    },
    countUp: function (el, to, ms) {
      var start = performance.now(), from = 0;
      function tick(now) {
        var p = Math.min(1, (now - start) / (ms || 700));
        el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  };

  /* ------------------------------ 颜色与主题 ------------------------------ */
  function hexToHsl(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(h.slice(0, 2), 16) / 255;
    var g = parseInt(h.slice(2, 4), 16) / 255;
    var b = parseInt(h.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2, d = max - min, hue = 0, s = 0;
    if (d) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60;
    }
    return { h: hue, s: s * 100, l: l * 100 };
  }
  function hstr(h, s, l, a) {
    h = ((h % 360) + 360) % 360;
    s = U.clamp(s, 0, 100); l = U.clamp(l, 0, 100);
    if (a != null) return 'hsl(' + h.toFixed(1) + ' ' + s.toFixed(1) + '% ' + l.toFixed(1) + '% / ' + a + ')';
    return 'hsl(' + h.toFixed(1) + ' ' + s.toFixed(1) + '% ' + l.toFixed(1) + '%)';
  }

  var Theme = GI.theme = {
    seed: '#4A3F8C',
    hue: 248,
    key: 'home',
    dark: false,
    palette: function (seed) {
      var c = hexToHsl(seed);
      var h = c.h, s = U.clamp(c.s, 18, 82);
      var sv = U.clamp(s * 1.2 + 8, 28, 82);
      var dark = Theme.dark;
      var onBg = dark ? hstr(h, 10, 93) : hstr(h, 12, 11);
      var onBgVar = dark ? hstr(h, 7, 70) : hstr(h, 6, 34);
      // 同一色相下的 6 级明度（0 最浅 → 5 最深），全站统一用这套层级
      var s0 = dark ? hstr(h, 9, 7.5) : hstr(h, sv * 0.18, 98.8);
      var s1 = dark ? hstr(h, 10, 12) : hstr(h, sv * 0.28, 96.2);
      var s2 = dark ? hstr(h, 12, 18) : hstr(h, sv * 0.44, 90);
      var s3 = dark ? hstr(h, 14, 26) : hstr(h, sv * 0.58, 82);
      var s4 = dark ? hstr(h, sv * 0.78, 78) : hstr(h, sv * 0.85, 40);
      var s5 = dark ? hstr(h, 12, 4) : hstr(h, sv * 0.4, 12);
      var onS0 = onBg;
      var onS1 = onBg;
      var onS2 = dark ? hstr(h, sv * 0.5, 91) : hstr(h, sv * 0.7, 15);
      var onS3 = dark ? hstr(h, sv * 0.5, 94) : hstr(h, sv * 0.75, 12);
      var onS4 = dark ? hstr(h, sv * 0.7, 14) : hstr(h, sv * 0.35, 99);
      var onS5 = hstr(h, sv * 0.12, 96);
      var P = {
        s0: s0, s1: s1, s2: s2, s3: s3, s4: s4, s5: s5,
        onS0: onS0, onS1: onS1, onS2: onS2, onS3: onS3, onS4: onS4, onS5: onS5,
        p: s4,
        onP: onS4,
        pC: s2,
        onPC: onS2,
        sec: s4,
        onSec: onS4,
        secC: s3,
        onSecC: onS3,
        ter: s4,
        onTer: onS4,
        terC: s1,
        onTerC: onS1,
        bg: s0,
        bg1: s1,
        bg2: dark ? hstr(h, 9, 15) : hstr(h, sv * 0.24, 94.5),
        bg3: dark ? hstr(h, 8, 19) : hstr(h, sv * 0.3, 92),
        bg4: dark ? hstr(h, 8, 23) : hstr(h, sv * 0.34, 89.5),
        bg5: dark ? hstr(h, 8, 27) : hstr(h, sv * 0.34, 86.5),
        onBg: onBg,
        onBgVar: onBgVar,
        line: dark ? hstr(h, 6, 46) : hstr(h, 6, 55),
        lineVar: dark ? hstr(h, 7, 29) : hstr(h, sv * 0.25, 86),
        lineSoft: dark ? hstr(h, 7, 23) : hstr(h, sv * 0.2, 91),
        ink: s5,
        ink2: dark ? hstr(h, 12, 12) : hstr(h, sv * 0.45, 20),
        onInk: onS5,
        onInkSoft: hstr(h, sv * 0.15, 70),
        inkLine: dark ? hstr(h, 60, 78, 0.13) : hstr(h, 60, 82, 0.16),
        success: dark ? hstr(152, 42, 64) : hstr(152, 52, 31),
        successC: dark ? hstr(152, 35, 21) : hstr(152, 52, 91),
        onSuccessC: dark ? hstr(152, 45, 87) : hstr(152, 55, 14),
        danger: dark ? hstr(4, 65, 72) : hstr(4, 62, 45),
        dangerC: dark ? hstr(4, 38, 24) : hstr(4, 72, 94.5),
        onDangerC: dark ? hstr(4, 60, 90) : hstr(4, 62, 22),
        warn: dark ? hstr(34, 75, 66) : hstr(32, 80, 36),
        warnC: dark ? hstr(34, 40, 23) : hstr(36, 85, 90),
        onWarnC: dark ? hstr(34, 70, 88) : hstr(30, 75, 18),
        hi: dark ? hstr(h, 30, 17) : hstr(h, 50, 92)
      };
      return P;
    },
    apply: function (seed, opts) {
      opts = opts || {};
      if (seed) { Theme.seed = seed; Theme.hue = hexToHsl(seed).h; }
      if (opts.dark != null) Theme.dark = !!opts.dark;
      if (opts.key) Theme.key = opts.key;
      var P = Theme.palette(Theme.seed);
      var root = document.documentElement;
      var map = {
        s0: '--s0', s1: '--s1', s2: '--s2', s3: '--s3', s4: '--s4', s5: '--s5',
        onS0: '--on-s0', onS1: '--on-s1', onS2: '--on-s2', onS3: '--on-s3', onS4: '--on-s4', onS5: '--on-s5',
        p: '--p', onP: '--on-p', pC: '--p-c', onPC: '--on-p-c',
        sec: '--sec', onSec: '--on-sec', secC: '--sec-c', onSecC: '--on-sec-c',
        ter: '--ter', onTer: '--on-ter', terC: '--ter-c', onTerC: '--on-ter-c',
        bg: '--bg', bg1: '--bg-1', bg2: '--bg-2', bg3: '--bg-3', bg4: '--bg-4', bg5: '--bg-5',
        onBg: '--on-bg', onBgVar: '--on-bg-var', line: '--line', lineVar: '--line-var', lineSoft: '--line-soft',
        ink: '--ink', ink2: '--ink-2', onInk: '--on-ink', onInkSoft: '--on-ink-soft', inkLine: '--ink-line',
        success: '--success', successC: '--success-c', onSuccessC: '--on-success-c',
        danger: '--danger', dangerC: '--danger-c', onDangerC: '--on-danger-c',
        warn: '--warn', warnC: '--warn-c', onWarnC: '--on-warn-c', hi: '--hi'
      };
      Object.keys(map).forEach(function (k) { root.style.setProperty(map[k], P[k]); });
      root.style.setProperty('--hue', Theme.hue.toFixed(1));
      root.style.setProperty('--seed', Theme.seed);
      root.dataset.theme = Theme.dark ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]') || (function () {
        var m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m);
      })();
      document.querySelector('meta[name="theme-color"]').setAttribute('content', P.bg);
      var btn = document.getElementById('btnTheme');
      if (btn) {
        btn.innerHTML = GI.icon(Theme.dark ? 'sun' : 'moon');
        btn.setAttribute('aria-label', Theme.dark ? '切换到浅色模式' : '切换到深色模式');
      }
    },
    setDark: function (dark) {
      Theme.dark = !!dark;
      GI.store.state.dark = Theme.dark;
      GI.store.save();
      Theme.apply(null);
    }
  };

  /* ------------------------------ 本地存储 ------------------------------ */
  var KEY = 'gates-instructions.v1';
  var Store = GI.store = {
    state: null,
    load: function () {
      var d;
      try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
      if (!d || typeof d !== 'object') d = {};
      d.v = 1;
      d.read = d.read || {};
      d.answers = d.answers || {};
      d.wrong = d.wrong || {};
      d.daily = d.daily || {};
      d.sessions = Array.isArray(d.sessions) ? d.sessions : [];
      d.dark = typeof d.dark === 'boolean' ? d.dark : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      Store.state = d;
      return d;
    },
    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(Store.state)); } catch (e) { /* 隐私模式 */ }
    },
    markRead: function (sectionId) {
      if (!sectionId || Store.state.read[sectionId]) return false;
      Store.state.read[sectionId] = Date.now();
      Store.save();
      return true;
    },
    record: function (q, correct) {
      var S = Store.state;
      var prev = S.answers[q.id] || { n: 0, ok: 0 };
      S.answers[q.id] = { n: prev.n + 1, ok: correct ? 1 : 0, ts: Date.now(), ch: q.ch };
      var day = U.today();
      var d = S.daily[day] || { n: 0, ok: 0 };
      d.n++; if (correct) d.ok++;
      S.daily[day] = d;
      if (correct) delete S.wrong[q.id];
      else S.wrong[q.id] = { ts: Date.now(), ch: q.ch };
      Store.save();
    },
    addSession: function (rec) {
      var S = Store.state;
      S.sessions.unshift(rec);
      S.sessions = S.sessions.slice(0, 60);
      Store.save();
    },
    wrongIds: function () { return Object.keys(Store.state.wrong); },
    reset: function () {
      Store.state = { v: 1, read: {}, answers: {}, wrong: {}, daily: {}, sessions: [], dark: Theme.dark };
      Store.save();
    },
    days: function (n) {
      var out = [], S = Store.state;
      for (var i = n - 1; i >= 0; i--) {
        var d = new Date(); d.setDate(d.getDate() - i);
        var key = U.today(d);
        var rec = S.daily[key] || { n: 0, ok: 0 };
        out.push({ key: key, label: U.dayLabel(-i), n: rec.n, ok: rec.ok });
      }
      return out;
    },
    streak: function () {
      var S = Store.state, d = new Date(), streak = 0;
      for (var i = 0; i < 400; i++) {
        var key = U.today(d);
        var rec = S.daily[key];
        if (rec && rec.n > 0) streak++;
        else if (i > 0) break;
        else if (!rec) { /* 今天还没做，允许从昨天开始 */ }
        d.setDate(d.getDate() - 1);
      }
      return streak;
    },
    total: function () {
      var S = Store.state, n = 0, ok = 0;
      Object.keys(S.answers).forEach(function (k) { var a = S.answers[k]; n += a.n; ok += a.ok; });
      return { n: n, ok: ok };
    }
  };

  Store.load();
  if (GI.theme) {
    GI.theme.dark = Store.state.dark;
  }

  GI.observeReveals = U.reveal;
})();

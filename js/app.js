/* app.js — 路由、主题切换、搜索面板、启动 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util, M = GI.model;
  var defaultSeed = (window.DATA.meta && window.DATA.meta.site.defaultSeed) || '#4A3F8C';

  var routes = [
    { re: /^\/?$/, view: 'home', name: 'home' },
    { re: /^\/atlas\/?$/, view: 'atlas', name: 'atlas' },
    { re: /^\/ch\/(\d+)\/?$/, view: 'chapter', name: 'chapter' },
    { re: /^\/practice\/?$/, view: 'practice', name: 'practice' },
    { re: /^\/quiz\/?$/, view: 'quiz', name: 'quiz' },
    { re: /^\/result\/?$/, view: 'result', name: 'result' },
    { re: /^\/wrong\/?$/, view: 'wrong', name: 'wrong' },
    { re: /^\/stats\/?$/, view: 'stats', name: 'stats' },
    { re: /^\/ref\/?$/, view: 'ref', name: 'ref' }
  ];

  function parseHash() {
    var raw = location.hash.replace(/^#/, '') || '/';
    var qi = raw.indexOf('?');
    var path = qi >= 0 ? raw.slice(0, qi) : raw;
    var query = qi >= 0 ? raw.slice(qi + 1) : '';
    var params = query ? new URLSearchParams(query) : null;
    return { path: path, query: query, params: params };
  }

  var current = { name: '', params: [] };

  function resolve(path) {
    for (var i = 0; i < routes.length; i++) {
      var r = routes[i], m = r.re.exec(path);
      if (m) return { name: r.name, view: GI.views[r.view], params: m.slice(1) };
    }
    if (/^\/search\/?$/.test(path)) return { name: 'home', view: GI.views.home, params: [], search: true };
    return null;
  }

  function updateDock(nav) {
    U.$$('.dock__item').forEach(function (a) {
      var on = a.dataset.nav === nav;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function seedFor(view, params) {
    if (!view || !view.seed) return defaultSeed;
    try { return view.seed.apply(null, params || []); } catch (e) { return defaultSeed; }
  }

  var firstRender = true;
  function render() {
    var h = parseHash();
    var r = resolve(h.path);
    if (!r) {
      document.getElementById('app').innerHTML = '<div class="page"><div class="empty" style="min-height:60vh;justify-content:center"><div class="empty__art">' + GI.icon('info', 70) + '</div><h3>没有这个页面</h3><p>链接可能过期了。回首页重新出发。</p><a class="btn btn--filled" href="#/">回到首页</a></div></div>';
      GI.hydrateIcons(document.getElementById('app'));
      return;
    }
    var view = r.view, params = (r.params || []).slice();
    if (r.name === 'chapter' && params.length) params[0] = Number(params[0]);
    if (!view) {
      document.getElementById('app').innerHTML = '<div class="page"><div class="empty"><h3>页面模块未加载</h3></div></div>';
      return;
    }
    if (GI.currentView && GI.currentView.view && GI.currentView.view.destroy) {
      try { GI.currentView.view.destroy(); } catch (e) { }
    }
    current = { name: r.name, params: params };

    function paint() {
      M.refreshStats();
      var seed = seedFor(view, params);
      GI.theme.apply(seed, { key: r.name });
      var html;
      try { html = view.render.apply(null, params); }
      catch (e) {
        console.error(e);
        html = '<div class="page"><div class="empty"><h3>页面渲染出错</h3><p>' + U.esc(e.message) + '</p><a class="btn btn--filled" href="#/">回首页</a></div></div>';
      }
      var main = document.getElementById('app');
      main.innerHTML = html;
      var pageEl = main.querySelector('.page');
      if (pageEl && r.name) pageEl.classList.add('view--' + r.name);
      main.classList.remove('view-enter');
      void main.offsetWidth;
      main.classList.add('view-enter');
      GI.hydrateIcons(main);
      var title = typeof view.title === 'function' ? view.title.apply(null, params) : view.title;
      document.title = (title ? title + ' · ' : '') + '门与指令';
      if (view.mount) {
        try { view.mount(main, null, params[0]); } catch (e) { console.error('mount failed', e); }
      }
      updateDock(view.nav);
      U.reveal(main);
      window.scrollTo({ top: 0, behavior: 'auto' });
      GI.currentView = { name: r.name, view: view, params: params };
      if (r.search) setTimeout(function () { openSearch(U.param('q') || ''); }, 60);
    }

    paint();
    firstRender = false;
  }

  /* ---------------- 搜索面板 ---------------- */
  var searchEl = null, searchInput = null, searchBody = null, searchIndex = -1;

  function buildSearch() {
    searchEl = document.createElement('div');
    searchEl.className = 'cmdk';
    searchEl.id = 'cmdk';
    searchEl.setAttribute('role', 'dialog');
    searchEl.setAttribute('aria-modal', 'true');
    searchEl.setAttribute('aria-label', '搜索知识点与题目');
    searchEl.innerHTML =
      '<div class="cmdk__panel" role="document">' +
        '<div class="cmdk__search">' + GI.icon('search', 21) +
          '<input id="cmdkInput" type="search" placeholder="搜索知识点、题目、章节…" autocomplete="off" aria-label="搜索">' +
          '<kbd>ESC</kbd></div>' +
        '<div class="cmdk__body" id="cmdkBody"></div>' +
        '<div class="cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 移动</span><span><kbd>Enter</kbd> 打开</span><span style="margin-left:auto">题库 ' + M.totals.questions + ' 题 · 知识点 ' + M.totals.sections + ' 节</span></div>' +
      '</div>';
    document.body.appendChild(searchEl);
    searchInput = U.$('#cmdkInput', searchEl);
    searchBody = U.$('#cmdkBody', searchEl);
    searchEl.addEventListener('click', function (e) {
      if (e.target === searchEl) closeSearch();
    });
    searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeSearch(); return; }
      var items = U.$$('.cmdk__item', searchBody);
      if (e.key === 'ArrowDown') { e.preventDefault(); searchIndex = Math.min(items.length - 1, searchIndex + 1); markActive(items); }
      if (e.key === 'ArrowUp') { e.preventDefault(); searchIndex = Math.max(0, searchIndex - 1); markActive(items); }
      if (e.key === 'Enter') {
        e.preventDefault();
        var active = items[searchIndex] || items[0];
        if (active) active.click();
      }
    });
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.cmdk__item');
      if (!item || !searchEl.classList.contains('is-open')) return;
      var href = item.getAttribute('data-href');
      var qid = item.getAttribute('data-qid');
      closeSearch();
      if (qid) {
        GI.quiz.start({ mode: 'quick', ids: [qid], count: 1, types: [] });
      } else if (href) {
        U.go(href);
      }
    });
  }

  function highlight(text, query) {
    var safe = U.esc(text || '');
    if (!query) return safe;
    try {
      var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return safe.replace(re, '<mark style="background:color-mix(in oklab,var(--p) 22%,transparent);color:inherit;border-radius:3px">$1</mark>');
    } catch (e) { return safe; }
  }

  function renderSearch(query) {
    searchIndex = 0;
    query = String(query || '').trim();
    var html = '';
    if (!query) {
      html += '<div class="cmdk__group"><h5>按章节进入</h5>' + M.chapters.map(function (c) {
        return '<div class="cmdk__item" data-href="#/ch/' + c.num + '"><span class="cmdk__item__icon">' + GI.icon(c.num === 0 ? 'book' : 'layers', 16) + '</span>' +
          '<span class="cmdk__item__main"><b>' + U.esc(c.title) + '</b><span>' + c.counts.sections + ' 节 · ' + c.counts.questions + ' 题</span></span>' +
          '<span class="cmdk__item__tag">CH ' + (c.num === 0 ? 'A' : U.pad(c.num)) + '</span></div>';
      }).join('') + '</div>' +
        '<div class="cmdk__group"><h5>试试这些</h5><div class="cmdk__hint" style="text-align:left;padding:8px 10px;display:flex;gap:8px;flex-wrap:wrap">' +
          ['卡诺图', '补码', '流水线冒险', 'MIPS 编码', 'cache 地址', '建立时间', '有限状态机', 'SystemVerilog'].map(function (t) {
            return '<button class="chip chip--sm" data-try="' + t + '">' + t + '</button>';
          }).join('') + '</div></div>';
      searchBody.innerHTML = html;
      U.$$('[data-try]', searchBody).forEach(function (b) {
        b.addEventListener('click', function () { searchInput.value = b.dataset.try; renderSearch(b.dataset.try); searchInput.focus(); });
      });
      return;
    }
    var chapHits = M.chapters.filter(function (c) {
      return (c.title + ' ' + c.en + ' ' + c.tagline + ' ' + (c.topics || []).join(' ')).toLowerCase().indexOf(query.toLowerCase()) >= 0;
    }).slice(0, 4);
    var hits = M.search(query);
    var secs = hits.filter(function (x) { return x.type === 'section'; }).slice(0, 5);
    var qs = hits.filter(function (x) { return x.type === 'question'; }).slice(0, 6);
    var chapHtml = '';
    if (chapHits.length) {
      chapHtml = '<div class="cmdk__group"><h5>章节</h5>' + chapHits.map(function (c) {
        return '<div class="cmdk__item" data-href="#/ch/' + c.num + '"><span class="cmdk__item__icon">' + GI.icon('layers', 16) + '</span>' +
          '<span class="cmdk__item__main"><b>' + highlight(c.title, query) + '</b><span>' + highlight(c.tagline, query) + '</span></span><span class="cmdk__item__tag">CH ' + (c.num === 0 ? 'A' : U.pad(c.num)) + '</span></div>';
      }).join('') + '</div>';
    }
    if (secs.length) {
      html += '<div class="cmdk__group"><h5>知识点 · ' + secs.length + '</h5>' + secs.map(function (it) {
        return '<div class="cmdk__item" data-href="' + it.href + '"><span class="cmdk__item__icon">' + GI.icon('book', 16) + '</span>' +
          '<span class="cmdk__item__main"><b>' + highlight(it.title, query) + '</b><span>' + highlight(it.sub, query) + '</span></span><span class="cmdk__item__tag">讲义</span></div>';
      }).join('') + '</div>';
    }
    if (qs.length) {
      html += '<div class="cmdk__group"><h5>题目 · ' + qs.length + '</h5>' + qs.map(function (it) {
        return '<div class="cmdk__item" data-qid="' + it.id + '"><span class="cmdk__item__icon">' + GI.icon(M.TYPES[it.q.type] && M.TYPES[it.q.type].interactive ? 'cpu' : 'target', 16) + '</span>' +
          '<span class="cmdk__item__main"><b>' + highlight(it.title, query) + '</b><span>' + highlight(it.sub, query) + '</span></span><span class="cmdk__item__tag">' + U.esc(M.typeMeta(it.q.type).short) + '</span></div>';
      }).join('') + '</div>';
    }
    html += chapHtml;
    if (!html) html = '<div class="cmdk__hint">没有找到「' + U.esc(query) + '」相关内容。<br>试试更短的关键词，比如“补码”“流水线”“cache”。</div>';
    searchBody.innerHTML = html;
  }

  function markActive(items) {
    items.forEach(function (it, i) { it.classList.toggle('is-active', i === searchIndex); });
    var active = items[searchIndex];
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function openSearch(initial) {
    if (!searchEl) return;
    searchEl.classList.add('is-open');
    searchIndex = 0;
    searchInput.value = initial || '';
    renderSearch(searchInput.value);
    setTimeout(function () { searchInput.focus(); }, 30);
    document.body.style.overflow = 'hidden';
  }
  function closeSearch() {
    if (!searchEl) return;
    searchEl.classList.remove('is-open');
    document.body.style.overflow = '';
    document.getElementById('btnSearch') && document.getElementById('btnSearch').focus();
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    M.build();
    GI.theme.dark = GI.store.state.dark;
    GI.theme.apply(defaultSeed, { key: 'home' });
    GI.hydrateIcons(document);
    buildSearch();
    U.reveal(document);

    document.getElementById('btnTheme').addEventListener('click', function () {
      GI.theme.setDark(!GI.theme.dark);
    });
    document.getElementById('btnSearch').addEventListener('click', function () { openSearch(''); });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchEl.classList.contains('is-open')) closeSearch(); else openSearch('');
        return;
      }
      if (e.key === 'Escape' && searchEl.classList.contains('is-open')) { closeSearch(); return; }
      if (searchEl.classList.contains('is-open')) return;
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if (current.name !== 'quiz') return;
      if (/^[1-9]$/.test(e.key)) {
        var opts = U.$$('.qcard .opt:not([disabled])');
        var idx = Number(e.key) - 1;
        if (opts[idx]) { opts[idx].click(); e.preventDefault(); }
      } else if (e.key === 'Enter') {
        var next = U.$('.feedback [data-act="next"]');
        if (next) { next.click(); e.preventDefault(); return; }
        var submit = U.$('.qcard [data-act="submit"]');
        if (submit && !submit.disabled) { submit.click(); e.preventDefault(); }
      }
    });

    window.addEventListener('hashchange', render);
    if (!location.hash) location.replace('#/');
    render();
    // 预热一帧，避免字体切换抖动
    requestAnimationFrame(function () { document.documentElement.classList.add('is-ready'); });
  }

  GI.router = {
    render: render,
    go: U.go,
    openSearch: openSearch
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

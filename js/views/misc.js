/* views/misc.js — 统计、错题本、速查台 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util, M = GI.model;

  /* ============================ 学习统计 ============================ */
  GI.views = GI.views || {};
  GI.views.stats = {
    seed: function () { return window.DATA.meta.site.statsSeed; },
    nav: 'stats',
    title: '学习统计',
    render: function () {
      var g = M.globalStats();
      var days = GI.store.days(7);
      var max = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.n; })));
      var today = days[days.length - 1];
      var totalTime = GI.store.state.sessions.reduce(function (a, s) { return a + (s.secs || 0); }, 0);
      var weak = weakSections();
      var sessions = GI.store.state.sessions.slice(0, 6);
      var ringCirc = 2 * Math.PI * 50;
      var hasAny = g.attempted > 0 || g.readSections > 0;
      return '<div class="page">' +
        '<div class="page-head"><div><p class="eyebrow">PROGRESS · 学习进度</p><h1>把走过的路，<br>量出来。</h1>' +
          '<p>这里只看本机数据：读过多少节、做过多少题、错在哪里。数字不用漂亮，能指出下一步就够了。</p></div>' +
          '<div class="page-head__aside"><div class="page-head__meta">' +
            '<div><b>' + g.readSections + ' / ' + g.totalSections + '</b><span>已读知识点</span></div>' +
            '<div><b>' + g.attempted + '</b><span>累计作答</span></div>' +
            '<div><b>' + g.streak + '</b><span>连续天数</span></div>' +
          '</div></div></div>' +
        (!hasAny ? '<div class="card card--p" style="margin-bottom:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap"><div class="grow"><b>还没有学习记录</b><div style="font-size:12.5px;opacity:.75;margin-top:4px">读一节讲义或做一组题，这里就会开始生长。</div></div><a class="btn btn--filled btn--sm" href="#/ch/1">从第 1 章开始</a></div>' : '') +
        '<div class="stats-bento">' +
          '<div class="stat-card stat-card--total reveal">' +
            '<div class="stat-card__label">' + GI.icon('target', 15) + '总答题量</div>' +
            '<div class="stat-card__big">' + g.attempted + '<small>题</small></div>' +
            '<div class="stat-card__sub">覆盖题库 ' + g.coverage + '% · 正确 ' + g.correct + ' 题</div>' +
          '</div>' +
          '<div class="stat-card stat-card--streak reveal" style="--delay:40ms">' +
            '<div class="stat-card__label">' + GI.icon('flame', 15) + '连续学习</div>' +
            '<div class="flame">' + GI.icon('flame', 32) + '</div>' +
            '<div class="stat-card__big">' + g.streak + '<small>天</small></div>' +
            '<div class="stat-card__sub">今天已做 ' + today.n + ' 题</div>' +
          '</div>' +
          '<div class="stat-card stat-card--week reveal" style="--delay:80ms">' +
            '<h3>最近 7 天</h3><div class="stat-card__sub">每日答题数 / 正确数</div>' +
            (g.attempted ? '<div class="mini-bars">' + days.map(function (d, i) {
              var h = Math.max(3, Math.round((d.n / max) * 76));
              return '<div class="b' + (i === days.length - 1 ? ' is-today' : '') + '"><em>' + (d.n || '') + '</em><i data-h="' + h + '" style="height:0"></i><span>' + d.label + '</span></div>';
            }).join('') + '</div>' : '<div class="week-empty">' + GI.icon('chart', 16) + '最近 7 天还没有答题记录</div>') +
          '</div>' +
          '<div class="stat-card stat-card--accuracy reveal">' +
            '<div class="stat-card__label">' + GI.icon('check', 15) + '总正确率</div>' +
            '<div class="stat-card__big">' + g.accuracy + '<small>%</small></div>' +
            '<div class="stat-card__sub">' + g.correct + ' 对 / ' + g.wrong + ' 错</div>' +
          '</div>' +
          '<div class="stat-card stat-card--today reveal" style="--delay:40ms">' +
            '<div class="stat-card__label">' + GI.icon('spark', 15) + '今日</div>' +
            '<div class="stat-card__big">' + today.n + '<small>题</small></div>' +
            '<div class="stat-card__sub">' + (today.n ? '正确 ' + today.ok + ' 题 · ' + Math.round((today.ok / today.n) * 100) + '%' : '今天还没开始') + '</div>' +
          '</div>' +
          '<div class="stat-card stat-card--time reveal" style="--delay:80ms">' +
            '<div class="stat-card__label">' + GI.icon('timer', 15) + '练习用时</div>' +
            '<div class="stat-card__big">' + Math.round(totalTime / 60) + '<small>分钟</small></div>' +
            '<div class="stat-card__sub">共 ' + GI.store.state.sessions.length + ' 次练习</div>' +
          '</div>' +
          '<div class="stat-card mastery-card reveal">' +
            '<h3>各章掌握度</h3><div class="stat-card__sub">按已做题目的最近一次结果计算，未答章节显示 0%</div>' +
            '<div class="wafer">' + M.chapters.filter(function (c) { return c.num !== 0; }).map(function (c) {
              var pct = c.counts.mastery || 0;
              return '<a class="wafer-item" href="#/ch/' + c.num + '">' +
                '<span class="wafer-ring" data-pct="' + pct + '"><b>' + pct + '</b><i class="wafer-bar"><span style="width:' + pct + '%"></span></i></span>' +
                '<span class="wafer-item__name"><b>' + U.esc(c.title) + '</b><span>' + c.counts.attempted + ' / ' + c.counts.questions + ' 题</span></span></a>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="stat-card weak-card reveal">' +
            '<h3>薄弱知识点</h3><div class="stat-card__sub">错题最多的几个小节</div>' +
            (weak.length ? '<div class="weak-list">' + weak.map(function (w) {
              return '<a class="weak-item" href="#/ch/' + w.ch + '?sec=' + encodeURIComponent(w.id) + '"><b>' + U.esc(w.title) + '</b><span>' + w.wrong + ' 错</span><span class="bar"><i style="width:' + Math.round((w.wrong / Math.max(1, w.n)) * 100) + '%"></i></span></a>';
            }).join('') + '</div>' : '<div class="weak-empty">' + GI.icon('check', 16) + '还没有明显漏洞，继续刷题再看。</div>') +
          '</div>' +
          '<div class="stat-card recent-card reveal">' +
            '<h3>最近练习</h3><div class="stat-card__sub">最近 6 次完成的练习</div>' +
            (sessions.length ? '<div class="recent-list">' + sessions.map(function (s) {
              var c = M.chapter(s.ch) || {};
              var pct = s.n ? Math.round((s.ok / s.n) * 100) : 0;
              return '<div class="recent-row"><span class="recent-row__time">' + U.timeAgo(s.ts) + '</span>' +
                '<span class="recent-row__name">' + (s.ch === 0 ? '速查台' : '第 ' + (s.ch || '?') + ' 章 · ' + U.esc(c.title || '')) + '<span style="color:var(--on-bg-var);font-weight:400"> · ' + (s.mode === 'lab' ? '实验专项' : s.mode === 'wrong' ? '错题重练' : '常规练习') + '</span></span>' +
                '<span class="recent-row__score">' + s.ok + ' / ' + s.n + ' 题</span>' +
                '<span class="recent-row__bar"><i style="width:' + pct + '%"></i></span></div>';
            }).join('') + '</div>' : '<div class="week-empty">' + GI.icon('timer', 16) + '完成练习后会出现在这里</div>') +
          '</div>' +
        '</div>' +
        '<div class="stats-foot"><span class="muted" style="font-size:11.5px">所有数据仅保存在本机浏览器。清除浏览器数据会一并清除。</span>' +
          '<button type="button" class="btn btn--ghost btn--sm" data-act="reset">' + GI.icon('trash', 15) + '清空学习记录</button></div>' +
        '<footer class="site-foot"><div><b>门与指令</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div><nav><a href="#/">首页</a><a href="#/practice">练习</a><a href="#/wrong">错题本</a></nav></footer>' +
        '</div>';
    },
    mount: function (root) {
      U.$$('.mini-bars .b i', root).forEach(function (bar, i) {
        var h = Number(bar.dataset.h) || 0;
        setTimeout(function () { bar.style.height = h + 'px'; }, 40 + i * 30);
      });
      U.$$('.wafer-ring .fg', root).forEach(function (fg) {
        var pct = Number(fg.dataset.pct) || 0;
        var circ = 2 * Math.PI * 16;
        fg.style.strokeDasharray = String(circ);
        fg.style.strokeDashoffset = String(circ);
        setTimeout(function () { fg.style.transition = 'stroke-dashoffset 1s var(--ease)'; fg.style.strokeDashoffset = String(circ * (1 - pct / 100)); }, 100);
      });
      var reset = U.$('[data-act="reset"]', root);
      if (reset) reset.addEventListener('click', function () {
        if (confirm('确定清空全部学习记录？包括阅读进度、答题记录与错题本。此操作不可恢复。')) {
          GI.store.reset();
          U.toast('学习记录已清空');
          GI.router.render();
        }
      });
    }
  };

  function weakSections() {
    var map = {};
    var answers = GI.store.state.answers;
    M.questions.forEach(function (q) {
      var a = answers[q.id];
      if (!a || !q.sec) return;
      var m = map[q.sec] = map[q.sec] || { id: q.sec, ch: q.ch, wrong: 0, n: 0, title: q._section ? q._section.title : q.sec };
      m.n++;
      if (!a.ok) m.wrong++;
    });
    return Object.keys(map).map(function (k) { return map[k]; }).filter(function (x) { return x.wrong > 0; })
      .sort(function (a, b) { return b.wrong - a.wrong || (b.wrong / b.n) - (a.wrong / a.n); })
      .slice(0, 5);
  }

  /* ============================ 错题本 ============================ */
  GI.views.wrong = {
    seed: function () { return '#7A4058'; },
    nav: 'practice',
    title: '错题本',
    render: function () {
      var wrong = GI.store.state.wrong;
      var ids = Object.keys(wrong).map(function (id) { return M.question(id); }).filter(Boolean)
        .sort(function (a, b) { return (wrong[b.id] || {}).ts - (wrong[a.id] || {}).ts; });
      var chapters = {};
      ids.forEach(function (q) { chapters[q.ch] = (chapters[q.ch] || 0) + 1; });
      return '<div class="page">' +
        '<div class="page-head"><div><p class="eyebrow">REVIEW · 错题本</p><h1>错过的题，<br>再看一眼。</h1>' +
          '<p>做错时会自动收进来；重新做对，它就会消失。按章节筛选，或者直接重练全部。</p></div>' +
          '<div class="page-head__aside"><div class="page-head__meta"><div><b>' + ids.length + '</b><span>待复习</span></div>' +
            '<div><b>' + Object.keys(chapters).length + '</b><span>涉及章节</span></div></div></div></div>' +
        (ids.length ? '<div class="wrong-toolbar"><button class="chip" data-filter="all" aria-pressed="true">全部 ' + ids.length + '</button>' +
          Object.keys(chapters).sort().map(function (ch) {
            return '<button class="chip" data-filter="' + ch + '" aria-pressed="false">' + (ch === '0' ? '速查' : '第 ' + ch + ' 章') + ' ' + chapters[ch] + '</button>';
          }).join('') +
          '<span class="grow"></span><button type="button" class="btn btn--filled btn--sm" data-act="retry-all">' + GI.icon('refresh', 16) + '重练全部</button></div>' +
          '<div class="wrong-list">' + ids.map(function (q) {
            var ch = M.chapter(q.ch) || {};
            return '<div class="wrong-card" data-ch="' + q.ch + '" data-qid="' + q.id + '">' +
              '<div class="wrong-card__ch">' + (q.ch === 0 ? '速' : U.pad(q.ch)) + '</div>' +
              '<div><div class="wrong-card__stem">' + q.stem + '</div>' +
                '<div class="wrong-card__meta"><span class="tag tag--p">' + M.typeMeta(q.type).label + '</span>' +
                  (q._section ? '<span>' + U.esc(q._section.title) + '</span>' : '') +
                  '<span>上次 ' + U.timeAgo((wrong[q.id] || {}).ts || Date.now()) + '</span></div></div>' +
              '<div class="wrong-card__actions"><button type="button" class="btn btn--tonal btn--sm" data-retry="' + q.id + '">重练</button>' +
                '<button type="button" class="btn btn--ghost btn--sm" data-explain="' + q.id + '">解析</button></div>' +
              '<div class="wrong-explain">' + (q.explain || '') + '</div></div>';
          }).join('') + '</div>' +
          '<footer class="site-foot"><div><b>门与指令</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div><nav><a href="#/practice">去练习</a><a href="#/stats">学习统计</a></nav></footer>' :
          '<div class="empty"><div class="empty__art">' + GI.icon('spark', 80) + '</div><h3>错题本是空的</h3><p>要么你还没做题，要么全都做对了。保持住。</p><a class="btn btn--filled" href="#/practice">去做一组题</a></div>') +
        '</div>';
    },
    mount: function (root) {
      var filter = 'all';
      function applyFilter() {
        U.$$('.wrong-card', root).forEach(function (card) {
          card.style.display = (filter === 'all' || card.dataset.ch === filter) ? '' : 'none';
        });
        U.$$('[data-filter]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === filter)); });
      }
      U.$$('[data-filter]', root).forEach(function (b) {
        b.addEventListener('click', function () { filter = b.dataset.filter; applyFilter(); });
      });
      U.$$('[data-retry]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          GI.quiz.start({ mode: 'quick', ids: [b.dataset.retry], count: 1, types: [] });
        });
      });
      U.$$('[data-explain]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var card = b.closest('.wrong-card');
          card.classList.toggle('is-open');
          b.textContent = card.classList.contains('is-open') ? '收起' : '解析';
        });
      });
      var retryAll = U.$('[data-act="retry-all"]', root);
      if (retryAll) retryAll.addEventListener('click', function () {
        var ids = GI.store.wrongIds();
        if (!ids.length) return;
        GI.quiz.start({ mode: 'quick', ids: ids, count: ids.length, types: [] });
      });
    }
  };

  /* ============================ 速查台 ============================ */
  GI.views.ref = {
    seed: function () { return M.chapterSeed(0); },
    nav: 'ref',
    title: '速查台',
    render: function () {
      var ch = M.chapter(0);
      if (!ch || !ch.sections.length) return '<div class="page"><div class="empty"><h3>速查内容正在整理</h3><a class="btn btn--filled" href="#/">回首页</a></div></div>';
      return '<div class="page">' +
        '<div class="ref-head"><div><p class="eyebrow">QUICK REFERENCE · 速查台</p><h1>公式、数据、指令，<br>一页翻到。</h1>' +
          '<p>全书最常用的公式、MIPS 指令编码、性能与存储方程、术语表。考前翻这里，比翻八章讲义快。</p></div>' +
          '<div class="ref-search">' + GI.icon('search', 17) + '<input type="search" placeholder="在速查内容中过滤…" data-ref-search aria-label="过滤速查内容"></div>' +
        '</div>' +
        '<div class="ref-tabs"><button class="chip" data-tab="all" aria-pressed="true">全部</button>' +
          ch.sections.map(function (s, i) { return '<button class="chip" data-tab="' + s.id + '" aria-pressed="false">' + U.esc(s.title) + '</button>'; }).join('') +
        '</div>' +
        '<div class="ref-grid">' + ch.sections.map(function (s) {
          var wide = (s.blocks || []).some(function (b) { return (b.t === 'table' && b.head && b.head.length >= 5) || (b.t === 'code'); });
          return '<article class="ref-card' + (wide ? ' ref-card--wide' : '') + '" data-section="' + s.id + '" data-text="' + U.esc(U.strip(s.title + ' ' + (s.lead || '') + ' ' + (s.blocks || []).map(function (b) { return (b.html || '') + ' ' + (b.title || '') + ' ' + (b.items ? b.items.map(function (x) { return x.html || x.k || x; }).join(' ') : ''); }).join(' '))).toLowerCase() + '">' +
            '<div class="ref-card__num">' + U.esc(s.num || '速查') + '</div>' +
            '<h2 class="ref-card__title">' + U.esc(s.title) + '</h2>' +
            (s.lead ? '<p class="ref-card__lead">' + s.lead + '</p>' : '') +
            (s.blocks || []).map(GI.knowledge.block).join('') +
            '</article>';
        }).join('') + '<div class="ref-empty" data-ref-empty style="display:none">没有匹配的速查内容</div></div>' +
        '<div class="ref-tip">' + GI.icon('bulb', 15) + '速查台也是练习范围：这套内容配有 ' + ch.counts.questions + ' 道跨章综合题，可以去 <a href="#/practice?ch=0" style="color:var(--p)">练习页</a> 选择「速查台」。</div>' +
        '<footer class="site-foot"><div><b>门与指令</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div><nav><a href="#/">首页</a><a href="#/practice?ch=0">练速查题</a></nav></footer>' +
        '</div>';
    },
    mount: function (root) {
      var tab = 'all', query = '';
      var input = U.$('[data-ref-search]', root);
      function apply() {
        var any = false;
        U.$$('.ref-card', root).forEach(function (card) {
          var okTab = tab === 'all' || card.dataset.section === tab;
          var okText = !query || card.dataset.text.indexOf(query.toLowerCase()) >= 0;
          var show = okTab && okText;
          card.style.display = show ? '' : 'none';
          if (show) any = true;
        });
        var empty = U.$('[data-ref-empty]', root);
        if (empty) empty.style.display = any ? 'none' : '';
        U.$$('[data-tab]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tab === tab)); });
      }
      U.$$('[data-tab]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          tab = b.dataset.tab;
          apply();
          var grid = U.$('.ref-grid', root);
          if (grid) window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 160, behavior: 'smooth' });
        });
      });
      if (input) input.addEventListener('input', function () { query = input.value.trim(); apply(); });
    }
  };
})();

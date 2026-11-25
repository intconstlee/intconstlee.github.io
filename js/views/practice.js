/* views/practice.js — 练习设置 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util, M = GI.model;

  var MODES = [
    { id: 'quick', name: '快速组卷', desc: '从选定范围抽一组，适合每天十分钟', icon: 'spark' },
    { id: 'full', name: '整套通关', desc: '把范围内所有题目一次做完', icon: 'layers' },
    { id: 'lab', name: '实验专项', desc: '只做拖拽、编码、HDL 与汇编', icon: 'cpu' },
    { id: 'wrong', name: '错题重练', desc: '只做错题本里还没掌握的题', icon: 'refresh' }
  ];

  GI.views = GI.views || {};
  GI.views.practice = {
    seed: function () { return window.DATA.meta.site.practiceSeed; },
    nav: 'practice',
    title: '开始练习',
    render: function () {
      var g = M.globalStats();
      var saved = GI.quiz.hasSession();
      var pCh = U.param('ch');
      var pMode = U.param('mode');
      var pType = U.param('type');
      var ch = (pCh != null && (pCh === 'all' || M.chapter(Number(pCh)))) ? String(pCh) : 'all';
      var mode = MODES.some(function (m) { return m.id === pMode; }) ? pMode : 'quick';
      var types = (pType && M.TYPES[pType]) ? [pType] : [];
      if (mode === 'lab' && types.length && !M.TYPES[types[0]].interactive) types = [];
      var count = mode === 'full' || mode === 'lab' || mode === 'wrong' ? 'all' : 10;

      return '<div class="page view--practice">' +
        '<div class="page-head"><div><p class="eyebrow">PRACTICE STUDIO · 练习台</p><h1>挑一组题，<br>开始动手。</h1>' +
          '<p>按章节划范围，按题型定配方。常规题练记忆，交互实验练手感——拖门、写 RTL、跑汇编，都由判题器现场验证。</p></div>' +
          '<div class="page-head__aside"><div class="page-head__meta">' +
            '<div><b>' + g.totalQuestions + '</b><span>题库总量</span></div>' +
            '<div><b>' + M.totals.interactive + '</b><span>交互实验</span></div>' +
            '<div><b>' + g.wrongBook + '</b><span>待复习错题</span></div>' +
          '</div></div></div>' +
        (saved ? resumeCard(saved) : '') +
        '<div class="setup-layout">' +
          '<div>' +
            '<div class="setup-block"><div class="setup-block__head"><span>1</span><h2>选择知识范围</h2><small>' + (ch === 'all' ? '全书' : '第 ' + ch + ' 章') + '</small></div>' +
              '<div class="pick-grid">' +
                '<button type="button" class="pick pick--all" data-ch="all" aria-pressed="' + (ch === 'all') + '"><span class="pick__num">ALL</span><span class="pick__body"><b>全书混合</b><span>' + M.totals.questions + ' 题 · 跨章节综合</span></span></button>' +
                M.chapters.map(function (c) {
                  return '<button type="button" class="pick" data-ch="' + c.num + '" aria-pressed="' + (String(ch) === String(c.num)) + '">' +
                    '<span class="pick__num">' + (c.num === 0 ? '速' : U.pad(c.num)) + '</span>' +
                    '<span class="pick__body"><b>' + U.esc(c.title) + '</b><span>' + c.counts.questions + ' 题' + (c.counts.interactive ? ' · ' + c.counts.interactive + ' 实验' : '') + '</span></span></button>';
                }).join('') +
              '</div>' +
              '<div class="setup-tip">' + GI.icon('info', 16) + '<span>建议第一次按章节做，把某一种题型刷顺手后，再用“全书混合”查漏。</span></div>' +
            '</div>' +
            '<div class="setup-block"><div class="setup-block__head"><span>2</span><h2>练习方式</h2></div>' +
              '<div class="mode-grid">' + MODES.map(function (m) {
                return '<button type="button" class="mode" data-mode="' + m.id + '" aria-pressed="' + (mode === m.id) + '">' +
                  '<span class="mode__icon">' + GI.icon(m.icon, 17) + '</span><b>' + m.name + '</b><span>' + m.desc + '</span></button>';
              }).join('') + '</div>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="setup-block"><div class="setup-block__head"><span>3</span><h2>题量与题型</h2></div>' +
              '<div class="count-row" style="margin-bottom:18px">' +
                [5, 10, 20, 'all'].map(function (c) {
                  return '<button type="button" class="chip" data-count="' + c + '" aria-pressed="' + (String(count) === String(c)) + '">' + (c === 'all' ? '全部' : c + ' 题') + '</button>';
                }).join('') +
              '</div>' +
              '<div class="setup-block__head" style="margin-bottom:10px"><h2 style="font-size:12px">题型筛选 <small style="font-weight:400;color:var(--on-bg-var)">（不选 = 全部）</small></h2></div>' +
              '<div class="type-grid">' +
                '<button type="button" class="type-chip" data-type="" aria-pressed="' + (!types.length) + '"><i></i>全部题型</button>' +
                Object.keys(M.TYPES).map(function (t) {
                  var meta = M.TYPES[t];
                  return '<button type="button" class="type-chip" data-type="' + t + '" aria-pressed="' + (types.indexOf(t) >= 0) + '"' + (!meta.interactive ? ' data-conv="1"' : '') + '><i></i>' + meta.label + '</button>';
                }).join('') +
              '</div>' +
              '<div class="setup-tip">' + GI.icon('cpu', 16) + '<span>交互实验包含：拖门搭电路、写 SystemVerilog、写 MIPS 汇编、圈卡诺图、画波形、排序配对、位开关与位域编码。</span></div>' +
            '</div>' +
            '<div class="setup-summary">' +
              '<div class="setup-summary__count"><b data-avail>—</b><span>题可练</span></div>' +
              '<div class="setup-summary__hint" data-hint>加载中…</div>' +
              '<button type="button" class="btn btn--filled" data-act="start">开始练习' + GI.icon('arrowRight', 17) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<footer class="site-foot"><div><b>门与指令</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div><nav><a href="#/atlas">章节地图</a><a href="#/wrong">错题本</a><a href="#/stats">学习统计</a></nav></footer>' +
        '</div>';
    },
    mount: function (root) {
      var state = { ch: 'all', mode: 'quick', count: 10, types: [] };
      var pCh = U.param('ch');
      if (pCh != null && (pCh === 'all' || M.chapter(Number(pCh)))) state.ch = String(pCh);
      var pMode = U.param('mode');
      if (MODES.some(function (m) { return m.id === pMode; })) state.mode = pMode;
      var pType = U.param('type');
      if (pType && M.TYPES[pType]) state.types = [pType];
      if (state.mode === 'lab' || state.mode === 'full' || state.mode === 'wrong') state.count = 'all';

      var availEl = U.$('[data-avail]', root), hintEl = U.$('[data-hint]', root);
      var startBtn = U.$('[data-act="start"]', root);

      function effectiveTypes() {
        if (state.mode === 'lab') {
          var chosen = state.types.filter(function (t) { return M.TYPES[t] && M.TYPES[t].interactive; });
          return chosen.length ? chosen : [];
        }
        return state.types;
      }
      function refresh() {
        if ((state.mode === 'full' || state.mode === 'lab' || state.mode === 'wrong') && state.count !== 'all') state.count = 'all';
        var conf = { mode: state.mode, ch: state.ch, types: effectiveTypes() };
        var n = M.countAvailable(conf);
        if (availEl) availEl.textContent = n;
        if (hintEl) {
          var chName = state.ch === 'all' ? '全书' : '第 ' + state.ch + ' 章 · ' + ((M.chapter(Number(state.ch)) || {}).title || '');
          var modeName = (MODES.filter(function (m) { return m.id === state.mode; })[0] || {}).name;
          hintEl.textContent = n ? (chName + ' · ' + modeName + ' · ' + (state.count === 'all' ? '全部题目' : state.count + ' 题')) :
            (state.mode === 'wrong' ? '错题本还是空的，先去做几组题' : '当前筛选下没有题目，换个范围试试');
        }
        if (startBtn) startBtn.disabled = !n;
        U.$$('[data-ch]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.ch === state.ch)); });
        U.$$('[data-mode]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)); });
        U.$$('[data-count]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(String(b.dataset.count) === String(state.count))); });
        U.$$('[data-type]', root).forEach(function (b) {
          var t = b.dataset.type;
          var disabled = state.mode === 'lab' && t && !M.TYPES[t].interactive;
          b.disabled = !!disabled;
          b.style.opacity = disabled ? .35 : '';
          var on = t === '' ? !state.types.length : state.types.indexOf(t) >= 0;
          b.setAttribute('aria-pressed', String(on));
        });
        var countRow = U.$('.count-row', root);
        if (countRow) countRow.style.opacity = (state.mode === 'full' || state.mode === 'lab' || state.mode === 'wrong') ? .35 : '';
        U.$$('[data-count]', root).forEach(function (b) {
          b.disabled = (state.mode === 'full' || state.mode === 'lab' || state.mode === 'wrong');
        });
      }
      U.$$('[data-ch]', root).forEach(function (b) {
        b.addEventListener('click', function () { state.ch = b.dataset.ch; refresh(); });
      });
      U.$$('[data-mode]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          state.mode = b.dataset.mode;
          if (state.mode === 'lab') state.types = state.types.filter(function (t) { return M.TYPES[t].interactive; });
          if (state.mode === 'lab' || state.mode === 'full' || state.mode === 'wrong') state.count = 'all';
          else if (state.count === 'all') state.count = 10;
          refresh();
        });
      });
      U.$$('[data-count]', root).forEach(function (b) {
        b.addEventListener('click', function () { if (b.disabled) return; state.count = b.dataset.count === 'all' ? 'all' : Number(b.dataset.count); refresh(); });
      });
      U.$$('[data-type]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.disabled) return;
          var t = b.dataset.type;
          if (!t) state.types = [];
          else {
            var i = state.types.indexOf(t);
            if (i >= 0) state.types.splice(i, 1); else state.types.push(t);
          }
          refresh();
        });
      });
      refresh();
      if (startBtn) startBtn.addEventListener('click', function () {
        var conf = { mode: state.mode, ch: state.ch, types: effectiveTypes(), count: state.count };
        GI.quiz.start(conf);
      });
      var resumeBtn = U.$('[data-act="resume"]', root);
      if (resumeBtn) resumeBtn.addEventListener('click', function () { GI.quiz.resume(); });
      var discard = U.$('[data-act="discard"]', root);
      if (discard) discard.addEventListener('click', function () {
        GI.quiz.clearSession();
        U.toast('已放弃上次练习');
        GI.router.render();
      });
    }
  };

  function resumeCard(saved) {
    var done = (saved.records || []).length;
    var total = (saved.qids || []).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    return '<div class="hp-card" style="margin-bottom:24px;display:flex;align-items:center;gap:18px;flex-wrap:wrap">' +
      '<span class="mode__icon" style="width:38px;height:38px;border-radius:11px;background:var(--p-c);color:var(--on-p-c);display:grid;place-items:center">' + GI.icon('play', 18) + '</span>' +
      '<div class="grow"><b style="font-size:14px">上次练习没有做完</b><div class="sub">已完成 ' + done + ' / ' + total + ' 题 · ' + pct + '%</div></div>' +
      '<div class="row" style="gap:8px"><button type="button" class="btn btn--tonal btn--sm" data-act="resume">继续</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-act="discard">放弃</button></div></div>';
  }
})();

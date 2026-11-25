/* views/home.js — 首页、章节索引页 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util, M = GI.model;

  function motif(kind) {
    var s = '<svg viewBox="0 0 180 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
    switch (kind) {
      case 'bits':
        s += '<rect x="6" y="30" width="26" height="34" rx="5"/><rect x="38" y="30" width="26" height="34" rx="5"/><rect x="70" y="30" width="26" height="34" rx="5"/><rect x="102" y="30" width="26" height="34" rx="5"/>' +
          '<text x="19" y="52" text-anchor="middle" font-size="14" stroke="none" fill="currentColor" font-family="monospace">1</text>' +
          '<text x="51" y="52" text-anchor="middle" font-size="14" stroke="none" fill="currentColor" font-family="monospace">0</text>' +
          '<text x="83" y="52" text-anchor="middle" font-size="14" stroke="none" fill="currentColor" font-family="monospace">1</text>' +
          '<text x="115" y="52" text-anchor="middle" font-size="14" stroke="none" fill="currentColor" font-family="monospace">1</text>' +
          '<path d="M6 82h26v-12h26v12h26V70h26" stroke-opacity=".5"/>';
        break;
      case 'gates':
        s += '<path d="M16 36h18a18 18 0 0 1 0 36H16V36Z"/><path d="M86 30c16 6 16 44 0 50-11-8-14-25-14-25s3-17 14-25Z"/>' +
          '<path d="M34 48h18M34 60h18M72 42h14M72 58h14" stroke-opacity=".55"/>' +
          '<path d="M52 54h20"/><circle cx="106" cy="55" r="4"/>' +
          '<path d="M86 55h-8M106 55h10" stroke-opacity=".55"/>';
        break;
      case 'wave':
        s += '<path d="M8 42h22V22h22v20h22V22h22v20h22V22h22" />' +
          '<path d="M8 84h22V64h22v20h22V64h22v20h22V64h22" stroke-opacity=".45" stroke-dasharray="4 4"/>' +
          '<path d="M8 22v70M170 22v70" stroke-opacity=".2"/>';
        break;
      case 'code':
        s += '<path d="M34 32 18 55l16 23M76 32l16 23-16 23" stroke-opacity=".8"/>' +
          '<path d="M44 78 62 30" stroke-opacity=".5"/>' +
          '<path d="M102 40h62M102 55h46M102 70h58" stroke-opacity=".55"/>';
        break;
      case 'chip':
        s += '<rect x="48" y="22" width="84" height="66" rx="8"/><rect x="66" y="40" width="48" height="30" rx="4" stroke-opacity=".5"/>' +
          '<path d="M62 22V10M80 22V10M98 22V10M116 22V10M62 100V88M80 100V88M98 100V88M116 100V88M48 38H36M48 55H36M48 72H36M144 38h-12M144 55h-12M144 72h-12" stroke-opacity=".6"/>';
        break;
      case 'isa':
        s += '<rect x="8" y="40" width="52" height="30" rx="4"/><rect x="64" y="40" width="34" height="30" rx="4"/><rect x="102" y="40" width="34" height="30" rx="4"/><rect x="140" y="40" width="30" height="30" rx="4"/>' +
          '<text x="34" y="60" text-anchor="middle" font-size="8" stroke="none" fill="currentColor" font-family="monospace">opcode</text>' +
          '<text x="81" y="60" text-anchor="middle" font-size="8" stroke="none" fill="currentColor" font-family="monospace">rs</text>' +
          '<text x="119" y="60" text-anchor="middle" font-size="8" stroke="none" fill="currentColor" font-family="monospace">rt</text>' +
          '<text x="155" y="60" text-anchor="middle" font-size="8" stroke="none" fill="currentColor" font-family="monospace">rd</text>' +
          '<path d="M8 82h162" stroke-opacity=".4" stroke-dasharray="3 4"/>';
        break;
      case 'pipeline':
        s += '<rect x="6" y="44" width="26" height="24" rx="3"/><rect x="38" y="44" width="26" height="24" rx="3"/><rect x="70" y="44" width="26" height="24" rx="3"/><rect x="102" y="44" width="26" height="24" rx="3"/><rect x="134" y="44" width="26" height="24" rx="3"/>' +
          '<path d="M32 56h6M64 56h6M96 56h6M128 56h6" stroke-opacity=".6"/>' +
          '<path d="M6 78h154" stroke-opacity=".35"/><circle cx="70" cy="78" r="3" fill="currentColor" stroke="none"/><circle cx="102" cy="78" r="3" fill="currentColor" stroke="none" stroke-opacity=".4"/>';
        break;
      case 'cache':
        s += '<rect x="16" y="20" width="120" height="70" rx="5"/><path d="M16 38h120M16 56h120M16 74h120" stroke-opacity=".4"/>' +
          '<rect x="24" y="43" width="46" height="10" rx="2" fill="currentColor" stroke="none" opacity=".6"/>' +
          '<rect x="24" y="61" width="30" height="10" rx="2" fill="currentColor" stroke="none" opacity=".22"/>' +
          '<path d="M148 32v46M156 32v46" stroke-opacity=".5"/>' +
          '<path d="M136 55h12" />';
        break;
      default:
        s += '<path d="M20 30h140M20 50h116M20 70h140M20 90h88" stroke-opacity=".5"/>' +
          '<circle cx="156" cy="30" r="3" fill="currentColor" stroke="none"/><circle cx="142" cy="50" r="3" fill="currentColor" stroke="none"/>';
    }
    return s + '</svg>';
  }

  function orbit(chapters) {
    var main = chapters.filter(function (c) { return c.num !== 0; });
    var ref = chapters.filter(function (c) { return c.num === 0; })[0];
    var NS = 280;
    var html = '<svg class="orbit" viewBox="0 0 560 560" role="group" aria-label="章节轨道">' +
      '<circle class="orbit__disc" cx="280" cy="280" r="238"/>' +
      '<circle class="orbit__disc orbit__disc--inner" cx="280" cy="280" r="150"/>' +
      '<circle class="orbit__center" cx="280" cy="280" r="92"/>' +
      '<text class="orbit__center-text" x="280" y="276" text-anchor="middle" font-size="42">8</text>' +
      '<text class="orbit__center-sub" x="280" y="300" text-anchor="middle">CHAPTERS</text>' +
      '<text class="orbit__center-sub" x="280" y="318" text-anchor="middle" font-size="8">+ QUICK REFERENCE</text>';
    main.forEach(function (c, i) {
      var ang = (-90 + i * (360 / main.length)) * Math.PI / 180;
      var r = 208;
      var x = 280 + Math.cos(ang) * r, y = 280 + Math.sin(ang) * r;
      var lx = 280 + Math.cos(ang) * (r + 34), ly = 280 + Math.sin(ang) * (r + 34);
      var anchor = Math.cos(ang) > 0.3 ? 'start' : (Math.cos(ang) < -0.3 ? 'end' : 'middle');
      html += '<a href="#/ch/' + c.num + '" class="orbit__node" aria-label="第 ' + c.num + ' 章 ' + c.title + '">' +
        '<circle class="orbit__dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="25" stroke="rgba(255,255,255,.18)" stroke-width="1"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="middle" font-size="15">' + U.pad(c.num) + '</text>' +
        '<text class="orbit__label" x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1) + '" text-anchor="' + anchor + '" font-size="11">' + U.esc(c.title) + '</text></a>';
    });
    if (ref) {
      html += '<a href="#/ch/0" class="orbit__node" aria-label="速查台">' +
        '<circle class="orbit__dot" cx="280" cy="438" r="18" stroke="rgba(255,255,255,.18)"/>' +
        '<text x="280" y="443" text-anchor="middle" font-size="11">速</text></a>';
    }
    return html + '</svg>';
  }

  function statCard(label, value, suffix) {
    return '<div class="hero__stat"><b>' + value + '</b><span>' + label + '</span></div>';
  }

  GI.views = GI.views || {};
  GI.views.home = {
    seed: function () { return window.DATA.meta.site.defaultSeed; },
    nav: 'home',
    title: '首页',
    render: function () {
      var chapters = M.chapters;
      var g = M.globalStats();
      var qTotal = g.totalQuestions, interactive = M.totals.interactive;
      var hasProgress = g.attempted > 0 || g.readSections > 0;
      var html =
        '<div class="page view--home">' +
        '<section class="hero">' +
          '<div class="hero__badge"><i></i>HARRIS &amp; HARRIS · 2ND EDITION</div>' +
          '<div class="hero__grid">' +
            '<div class="hero__copy">' +
              '<p class="eyebrow eyebrow--light">DIGITAL DESIGN &amp; COMPUTER ARCHITECTURE</p>' +
              '<h1 class="hero__title"><span>从 0 和 1</span><span class="hero__accent">搭出一台</span><span>会跑程序的</span><span>处理器</span></h1>' +
              '<p class="hero__lead">八章讲义、' + qTotal + ' 道题，其中 ' + interactive + ' 道是要动手的实验：拖逻辑门、写 SystemVerilog、写 MIPS 汇编。看懂了不算，做出来才算。</p>' +
              '<div class="hero__actions">' +
                '<button type="button" class="btn btn--light btn--lg" data-act="quick">' + GI.icon('play', 18) + '开始 10 题随机练习</button>' +
                '<a class="btn btn--outlined btn--lg" href="#/ch/1">' + GI.icon('book', 18) + '从第 1 章读起</a>' +
              '</div>' +
              '<div class="hero__stats">' +
                statCard('CHAPTERS · 章节', '08') +
                statCard('KNOWLEDGE · 知识点', M.totals.sections) +
                statCard('EXERCISES · 习题', qTotal) +
                statCard('LABS · 交互实验', interactive) +
              '</div>' +
            '</div>' +
            '<div class="hero__visual">' + orbit(chapters) + '</div>' +
          '</div>' +
          '<div class="hero__foot"><div class="marquee">' +
            ['BINARY', 'COMBINATIONAL LOGIC', 'SEQUENTIAL LOGIC', 'SYSTEMVERILOG', 'DIGITAL BUILDING BLOCKS', 'MIPS ISA', 'PIPELINING', 'CACHE & VIRTUAL MEMORY', 'FROM NAND TO PROCESSOR']
              .map(function (t) { return '<span>' + t + '</span>'; }).join('') +
            ['BINARY', 'COMBINATIONAL LOGIC', 'SEQUENTIAL LOGIC', 'SYSTEMVERILOG', 'DIGITAL BUILDING BLOCKS', 'MIPS ISA', 'PIPELINING', 'CACHE & VIRTUAL MEMORY', 'FROM NAND TO PROCESSOR']
              .map(function (t) { return '<span>' + t + '</span>'; }).join('') +
          '</div></div>' +
        '</section>' +

        '<section class="section" id="chapters">' +
          '<div class="sec-head"><div><p class="eyebrow">CHAPTERS · 八个站点</p>' +
            '<h2>沿着一条主线，<br>从门走到机器</h2>' +
            '<p>每一章有自己的颜色与节奏。点开读讲义，或直接进入练习。</p></div>' +
            '<div class="sec-head__side"><a class="btn btn--ghost btn--sm" href="#/atlas">全部章节' + GI.icon('arrowRight', 15) + '</a><div class="rail-nav">' +
              '<button type="button" class="rail-btn" data-rail="-1" aria-label="向左">' + GI.icon('arrowLeft', 18) + '</button>' +
              '<button type="button" class="rail-btn" data-rail="1" aria-label="向右">' + GI.icon('arrowRight', 18) + '</button>' +
            '</div></div></div>' +
          '<div class="rail-wrap"><div class="chapter-rail" id="chapterRail">' +
            chapters.map(function (c) {
              return '<a class="ch-card reveal' + (c.num === 0 ? ' ch-card--ref' : '') + '" style="--ch:' + c.seed + '" href="#/ch/' + c.num + '">' +
                '<div class="ch-card__top"><span class="ch-card__num">' + (c.num === 0 ? '速查' : 'CH ' + U.pad(c.num)) + '</span><span class="ch-card__en">' + U.esc(c.en) + '</span></div>' +
                '<div class="ch-card__motif">' + motif(c.motif) + '</div>' +
                '<h3>' + U.esc(c.title) + '</h3><p>' + U.esc(c.tagline) + '</p>' +
                '<div class="ch-card__meta"><span>' + c.counts.sections + ' 节</span><i class="dot"></i><span>' + c.counts.questions + ' 题</span>' +
                  (c.counts.readPct ? '<i class="dot"></i><span>' + c.counts.readPct + '% 已读</span>' : '') +
                  '<span class="ch-card__arrow">' + GI.icon('arrowUpRight', 16) + '</span></div></a>';
            }).join('') +
          '</div></div>' +
        '</section>' +

        '<section class="section">' +
          '<div class="sec-head"><div><p class="eyebrow">LAB BENCH · 动手的地方</p><h2>三种实验，三种手感</h2>' +
            '<p>不是所有题都该用选项回答。电路要接出来，RTL 要跑测试，程序要执行过才算数。</p></div></div>' +
          '<div class="labs-flex">' +
            '<a class="lab-teaser lab-teaser--a reveal" href="#/practice?mode=lab&type=gate">' +
              '<div class="lab-teaser__screen"><div class="gate-sketch">' +
                '<svg viewBox="0 0 320 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
                  '<path d="M18 34h26M18 74h26" stroke-opacity=".5"/><path d="M44 34c22 0 30 8 30 20s-8 20-30 20" />' +
                  '<path d="M74 54h16"/><circle cx="96" cy="54" r="5"/>' +
                  '<path d="M101 54h22M101 54v24h22" stroke-opacity=".55"/>' +
                  '<path d="M123 78c20 0 28-8 28-24s-8-24-28-24" fill="none"/>' +
                  '<path d="M151 54h22"/><circle cx="179" cy="54" r="5"/>' +
                  '<path d="M184 54h44" stroke-dasharray="4 5" stroke-opacity=".6"/>' +
                  '<text x="248" y="59" font-size="13" fill="currentColor" stroke="none" font-family="monospace">Y</text>' +
                  '<text x="16" y="30" font-size="9" fill="currentColor" stroke="none" font-family="monospace">A</text>' +
                  '<text x="16" y="90" font-size="9" fill="currentColor" stroke="none" font-family="monospace">B</text>' +
                '</svg></div></div>' +
              '<div class="lab-teaser__body"><div><h3>逻辑门搭建</h3><p>拖动 AND / OR / XOR，把真值表变成电路</p></div><span class="tag">GATE LAB</span></div></a>' +
            '<a class="lab-teaser lab-teaser--b reveal" href="#/practice?mode=lab&type=hdl">' +
              '<div class="lab-teaser__screen"><div class="teaser-code"><span class="cm">// 4 选 1 复用器</span><br>' +
                '<span class="kw">always_comb</span> <span class="kw">case</span> (s)<br>' +
                '&nbsp;&nbsp;2\'b00: y = d[0];<br>&nbsp;&nbsp;2\'b01: y = d[1];<br>' +
                '<span class="kw">default</span>: y = <span class="num">1\'b0</span>;<br><span class="kw">endcase</span></div></div>' +
              '<div class="lab-teaser__body"><div><h3>HDL 设计</h3><p>写 SystemVerilog，对着测试向量仿真</p></div><span class="tag">HDL LAB</span></div></a>' +
            '<a class="lab-teaser lab-teaser--c reveal" href="#/practice?mode=lab&type=mips">' +
              '<div class="lab-teaser__screen"><div class="reg-sketch">' +
                ['$t0 0', '$t1 1', '$a0 5', '$v0 15', '$sp 7fff', '$ra 0000', '$s0 4096', '$s1 0'].map(function (x) {
                  var p = x.split(' '); return '<span>' + p[0] + '<br><b>' + p[1] + '</b></span>';
                }).join('') + '</div></div>' +
              '<div class="lab-teaser__body"><div><h3>MIPS 汇编</h3><p>写指令、跑解释器、看寄存器与内存</p></div><span class="tag">MIPS LAB</span></div></a>' +
          '</div>' +
        '</section>' +

        '<section class="section">' +
          '<div class="sec-head"><div><p class="eyebrow">YOUR TRAIL · 你的轨迹</p><h2>' + (hasProgress ? '继续上次的思路' : '今天从哪一章开始？') + '</h2>' +
            '<p>' + (hasProgress ? '进度保存在本机浏览器里，不需要登录。' : '读过的节、做过的题、错过的知识点，都会记录在这里。') + '</p></div>' +
            '<div class="sec-head__side"><a class="btn btn--tonal btn--sm" href="#/stats">完整统计' + GI.icon('arrowRight', 15) + '</a></div></div>' +
          (hasProgress ? progressPanel(g) : emptyProgress()) +
        '</section>' +

        '<footer class="site-foot"><div><b>门与指令 · GATES &amp; INSTRUCTIONS</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div>' +
          '<nav><a href="#/atlas">章节地图</a><a href="#/practice">开始练习</a><a href="#/ref">速查台</a><a href="#/stats">学习统计</a></nav></footer>' +
        '</div>';
      return html;
    },
    mount: function (root) {
      var quick = U.$('[data-act="quick"]', root);
      if (quick) quick.addEventListener('click', function () {
        GI.quiz.start({ mode: 'quick', ch: 'all', count: 10, types: [] });
      });
      var rail = U.$('#chapterRail', root);
      U.$$('[data-rail]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          rail.scrollBy({ left: Number(b.dataset.rail) * Math.min(600, rail.clientWidth * 0.8), behavior: 'smooth' });
        });
      });
      U.$$('.ch-card', root).forEach(function (card, i) {
        card.style.setProperty('--delay', (i * 40) + 'ms');
      });
      U.$$('.mini-bars .b i', root).forEach(function (bar) {
        var h = bar.dataset.h;
        if (h) requestAnimationFrame(function () { bar.style.height = h + 'px'; });
      });
    }
  };

  function progressPanel(g) {
    var days = GI.store.days(7);
    var max = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.n; })));
    var today = days[days.length - 1];
    var next = M.chapters.filter(function (c) {
      return c.counts.readPct < 100 && c.num !== 0;
    })[0] || M.chapters[0];
    return '<div class="home-progress">' +
      '<div class="hp-card reveal"><h3>累计答题</h3><div class="sub">所有章节的尝试次数</div>' +
        '<div class="hp-total" style="margin-top:18px"><b>' + g.attempted + '</b><div><small>题作答 · 正确率 ' + g.accuracy + '%</small><small>覆盖全书 ' + g.coverage + '% 的题目</small></div></div>' +
        '<div class="hp-continue"><span class="ripple-dot"></span><div><b>继续读：第 ' + next.num + ' 章 ' + U.esc(next.title) + '</b><span>' + (next.counts.sections ? next.counts.readPct + '% 已读' : '开始新的章节') + '</span></div>' +
          '<a class="btn btn--outlined btn--sm" style="margin-left:auto" href="#/ch/' + next.num + '">继续</a></div>' +
      '</div>' +
      '<div class="hp-card reveal" style="--delay:60ms"><h3>最近 7 天</h3><div class="sub">今天 ' + today.n + ' 题</div>' +
        '<div class="hp-days">' + days.map(function (d) {
          var h = Math.max(4, Math.round((d.n / max) * 74));
          return '<div class="hp-day"><em>' + (d.n || '') + '</em><i style="height:' + h + 'px;opacity:' + (d.n ? 1 : .18) + '"></i><span>' + d.label + '</span></div>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="hp-card reveal" style="--delay:120ms"><h3>下一步</h3><div class="sub">按当前节奏推荐</div>' +
        '<div class="stack" style="margin-top:16px;gap:9px">' +
          '<a class="btn btn--tonal btn--sm" href="#/practice?mode=quick&ch=' + next.num + '">' + GI.icon('target', 15) + '练第 ' + next.num + ' 章 10 题</a>' +
          '<a class="btn btn--outlined btn--sm" href="#/practice?mode=wrong">' + GI.icon('refresh', 15) + '重练错题（' + g.wrongBook + '）</a>' +
          '<a class="btn btn--ghost btn--sm" href="#/ref">' + GI.icon('book', 15) + '打开速查台</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function emptyProgress() {
    return '<div class="home-progress">' +
      '<div class="hp-card reveal"><h3>还没有记录</h3><div class="sub">从任何一章开始，进度会自动保存</div>' +
        '<div class="hp-empty"><div class="row" style="gap:8px"><a class="btn btn--filled btn--sm" href="#/ch/1">读第 1 章</a><a class="btn btn--tonal btn--sm" href="#/practice?mode=quick">做 10 题</a></div></div></div>' +
      '<div class="hp-card reveal" style="--delay:60ms"><h3>三种练习方式</h3><div class="sub">按章节 / 按题型 / 只做实验</div>' +
        '<div class="stack" style="margin-top:16px;gap:8px;font-size:12.5px;color:var(--on-bg-var)">' +
          '<span>· 快速组卷：从全书抽 10 题</span><span>· 整章练习：覆盖本章所有知识点</span><span>· 实验专项：只做拖拽 / 编码 / 汇编</span></div></div>' +
      '<div class="hp-card reveal" style="--delay:120ms"><h3>本机保存</h3><div class="sub">不登录，不上传</div>' +
        '<p style="margin-top:16px;font-size:12.5px;color:var(--on-bg-var);line-height:1.7">阅读记录、答题与错题都写在你自己的浏览器 localStorage 里，换设备不会同步。</p></div>' +
    '</div>';
  }

  /* 章节索引页 */
  GI.views.atlas = {
    seed: function () { return '#8A4B2A'; },
    nav: 'atlas',
    title: '章节地图',
    render: function () {
      var totalQ = M.totals.questions, totalS = M.totals.sections;
      return '<div class="page">' +
        '<div class="atlas-head"><div class="atlas-grid">' +
          '<div class="atlas-side"><p class="eyebrow">ATLAS · 全书结构</p><h1>八个章节，<br>一条上升的线</h1>' +
            '<p>数字逻辑 → 体系结构 → 微体系结构。每一层都只暴露接口，把下面的复杂度藏起来。' +
            '建议按顺序读，卡住时回速查台。</p>' +
            '<div class="atlas-note"><h4>阅读路线</h4><ol>' +
              '<li>第 1–2 章：先把门与组合逻辑弄扎实。</li>' +
              '<li>第 3–5 章：锁存器、FSM、HDL 与标准模块。</li>' +
              '<li>第 6 章：MIPS 指令集与机器码，亲手编码。</li>' +
              '<li>第 7–8 章：把模块拼成处理器，再加缓存。</li>' +
            '</ol></div>' +
            '<div class="row" style="margin-top:22px;gap:8px;flex-wrap:wrap"><span class="tag">' + totalS + ' 个知识点</span><span class="tag">' + totalQ + ' 道习题</span><span class="tag tag--ter">' + M.totals.interactive + ' 个实验</span></div>' +
          '</div>' +
          '<div class="atlas-list">' + M.chapters.map(function (c) {
            return '<a class="atlas-item" style="--ch:' + c.seed + '" href="#/ch/' + c.num + '">' +
              '<span class="atlas-item__num">' + (c.num === 0 ? '速' : U.pad(c.num)) + '</span>' +
              '<span class="atlas-item__main"><h3>' + U.esc(c.title) + '<span>' + U.esc(c.en) + '</span></h3>' +
                '<p>' + U.esc(c.tagline) + ' · ' + c.counts.sections + ' 节 / ' + c.counts.questions + ' 题</p>' +
                '<span class="atlas-item__bar"><i style="width:' + (c.counts.readPct || 0) + '%"></i></span></span>' +
              '<span class="atlas-item__stats"><b>' + (c.counts.readPct || 0) + '%</b><span>已读</span></span>' +
              '<span class="atlas-item__arrow">' + GI.icon('arrowRight', 16) + '</span></a>';
          }).join('') + '</div>' +
        '</div></div>' +
        '<footer class="site-foot"><div><b>门与指令</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div><nav><a href="#/">首页</a><a href="#/practice">练习</a><a href="#/ref">速查台</a></nav></footer>' +
        '</div>';
    }
  };
})();

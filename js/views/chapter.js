/* views/chapter.js — 章节讲义页 + 知识块渲染 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util, M = GI.model;
  var K = GI.knowledge = {};

  function blkTitle(b, icon) {
    return '<div class="blk__title">' + (icon ? GI.icon(icon, 16) : '') + U.esc(b.title || '') + '</div>';
  }
  function table(b) {
    var head = (b.head || []).map(function (h) { return '<th>' + h + '</th>'; }).join('');
    var rows = (b.rows || []).map(function (r) {
      return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="blk blk--table">' +
      (b.title ? '<div class="table-title">' + b.title + '</div>' : '') +
      '<div class="table-scroll"><table class="data"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      (b.caption ? '<div class="blk__caption">' + b.caption + '</div>' : '') + '</div>';
  }
  K.block = function (b) {
    if (!b) return '';
    switch (b.t) {
      case 'p': return '<div class="blk blk--p">' + b.html + '</div>';
      case 'def': return '<div class="blk blk--def">' + blkTitle(b, 'info') + '<div>' + b.html + '</div></div>';
      case 'key':
        return '<div class="blk blk--key">' + blkTitle(b, 'spark') +
          (b.items && b.items.length ? '<ol>' + b.items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' : '<div>' + (b.html || '') + '</div>') + '</div>';
      case 'formula':
        return '<div class="blk blk--formula"><div>' + b.html + '</div>' + (b.note ? '<div class="blk__note">' + b.note + '</div>' : '') + '</div>';
      case 'table': return table(b);
      case 'code':
        return '<div class="blk blk--code"><div class="code__bar"><span class="code__dots"><i></i><i></i><i></i></span>' +
          '<span class="code__lang">' + U.esc(b.lang || 'text') + '</span>' +
          (b.title ? '<span class="code__title">' + b.title + '</span>' : '') + '</div>' +
          '<pre>' + U.esc(b.code || '') + '</pre>' + (b.caption ? '<div class="code__cap">' + b.caption + '</div>' : '') + '</div>';
      case 'list':
        return '<div class="blk blk--list">' + (b.style === 'ol' ? '<ol>' : '<ul>') +
          (b.items || []).map(function (x) { return '<li>' + x + '</li>'; }).join('') +
          (b.style === 'ol' ? '</ol>' : '</ul>') + '</div>';
      case 'kv':
        return '<div class="blk blk--kv">' + (b.title ? '<div class="table-title">' + b.title + '</div>' : '') +
          (b.items || []).map(function (x) {
            return '<div class="kv-row"><div class="kv-k">' + x.k + '</div><div class="kv-v">' + x.v + '</div></div>';
          }).join('') + '</div>';
      case 'steps':
        return '<div class="blk blk--steps">' + (b.title ? '<div class="blk__title" style="font-weight:700;margin-bottom:14px">' + b.title + '</div>' : '') +
          (b.items || []).map(function (x) {
            return '<div class="step"><b>' + x.title + '</b><p>' + (x.html || '') + '</p></div>';
          }).join('') + '</div>';
      case 'example': return '<div class="blk blk--example">' + blkTitle(b, 'bulb') + '<div>' + b.html + '</div></div>';
      case 'warn': return '<div class="blk blk--warn">' + blkTitle(b, 'warn') + '<div>' + b.html + '</div></div>';
      case 'note': return '<div class="blk blk--note">' + blkTitle(b, 'info') + '<div>' + b.html + '</div></div>';
      case 'exam': return '<div class="blk blk--exam">' + blkTitle(b, 'target') + '<div>' + b.html + '</div></div>';
      case 'quote': return '<blockquote class="blk blk--quote">' + b.html + (b.cite ? '<cite>' + b.cite + '</cite>' : '') + '</blockquote>';
      default: return '';
    }
  };
  K.section = function (s, ch, opts) {
    opts = opts || {};
    var qn = M.questionsOfSection(s.id).length;
    return '<article class="ksec" id="sec-' + s.id + '" data-sid="' + s.id + '">' +
      '<header class="ksec__head"><span class="ksec__num">' + (s.num || '') + '</span><div class="grow">' +
        '<h2>' + U.esc(s.title) + (s.tag ? '<span class="tag ' + (s.tag === '考点' ? 'tag--danger' : s.tag === '进阶' ? 'tag--warn' : s.tag === '核心' ? 'tag--p' : '') + '">' + U.esc(s.tag) + '</span>' : '') + '</h2>' +
        (s.lead ? '<p class="ksec__lead">' + s.lead + '</p>' : '') +
      '</div>' +
      (qn && !opts.noActions ? '<div class="ksec__actions"><button type="button" class="chip chip--sm" data-sec-practice="' + s.id + '">' + GI.icon('target', 14) + '练这节 ' + qn + '</button></div>' : '') +
      '</header>' +
      (GI.figures ? GI.figures.forSection(s) : '') +
      (s.blocks || []).map(K.block).join('') +
      '</article>';
  };

  GI.views = GI.views || {};
  GI.views.chapter = {
    seed: function (num) {
      var c = M.chapter(num);
      return c ? c.seed : window.DATA.meta.site.defaultSeed;
    },
    nav: 'atlas',
    title: function (num) { var c = M.chapter(num); return c ? c.title : '章节'; },
    render: function (num) {
      var ch = M.chapter(num);
      if (!ch) return '<div class="page"><div class="empty"><h3>没有这一章</h3><a class="btn btn--filled" href="#/atlas">回到章节地图</a></div></div>';
      var readPct = ch.counts.readPct || 0;
      var circ = 2 * Math.PI * 52;
      var mins = Math.max(5, Math.round(ch.counts.sections * 1.6 + ch.counts.questions * 0.5));
      var next = M.chapters.filter(function (x) { return x.num !== 0 && x.num > num; })[0];
      if (num === 0) next = null;
      var refBottom = num === 8 ? M.chapter(0) : null;
      var nextAny = next || refBottom;
      var hasQs = ch.counts.questions > 0;
      var html =
        '<div class="page view--chapter" style="--ch:' + ch.seed + '">' +
        '<div class="reading-bar"><i data-readbar style="width:0%"></i></div>' +
        '<header class="ch-hero">' +
          '<div class="ch-hero__ghost" aria-hidden="true">' + (num === 0 ? 'A' : U.pad(num)) + '</div>' +
          '<div class="ch-hero__grid"><div>' +
            '<nav class="crumbs"><a href="#/">首页</a><span>/</span><a href="#/atlas">章节地图</a><span>/</span><span>' + (num === 0 ? '速查台' : '第 ' + num + ' 章') + '</span></nav>' +
            '<p class="eyebrow" style="margin-top:14px">CHAPTER ' + (num === 0 ? 'A' : U.pad(num)) + ' · ' + U.esc(ch.en) + '</p>' +
            '<h1>' + U.esc(ch.title) + '</h1>' +
            '<p class="ch-hero__tagline">' + U.esc(ch.tagline) + '</p>' +
            '<p class="ch-hero__blurb">' + U.esc(ch.blurb) + '</p>' +
            '<div class="ch-hero__meta">' +
              '<span class="chip chip--sm">' + ch.counts.sections + ' 节</span>' +
              '<span class="chip chip--sm">' + ch.counts.questions + ' 题</span>' +
              (ch.counts.interactive ? '<span class="chip chip--sm">' + ch.counts.interactive + ' 个实验</span>' : '') +
              '<span class="chip chip--sm">' + GI.icon('clock', 14) + '约 ' + mins + ' 分钟</span>' +
            '</div>' +
            '<div class="ch-hero__actions">' +
              (hasQs ? '<button type="button" class="btn btn--filled" data-act="practice">' + GI.icon('play', 17) + '开始本章练习</button>' : '') +
              (ch.counts.interactive ? '<button type="button" class="btn btn--tonal" data-act="labs">' + GI.icon('cpu', 17) + '只做交互实验</button>' : '') +
              '<a class="btn btn--outlined" href="#/practice?ch=' + num + '">自定义题组</a>' +
            '</div>' +
          '</div><aside class="ch-hero__aside">' +
            '<div class="ch-ring"><svg width="118" height="118" viewBox="0 0 118 118"><circle class="ch-ring__bg" cx="59" cy="59" r="52"/>' +
              '<circle class="ch-ring__fg" cx="59" cy="59" r="52" stroke-dasharray="' + circ + '" stroke-dashoffset="' + (circ * (1 - readPct / 100)) + '"/></svg>' +
              '<div class="ch-ring__label"><b data-readpct>' + readPct + '%</b><span>已读进度</span></div></div>' +
            '<div class="ch-hero__topics">' + (ch.topics || []).slice(0, 6).map(function (t) { return '<span class="tag">' + U.esc(t) + '</span>'; }).join('') + '</div>' +
          '</aside></div>' +
        '</header>' +
        '<div class="ch-layout">' +
          '<aside class="ch-toc"><div class="ch-toc__title">本章目录</div><nav class="ch-toc__list">' +
            ch.sections.map(function (s) {
              var isRead = !!GI.store.state.read[s.id];
              return '<button type="button" class="ch-toc__item' + (isRead ? ' is-read' : '') + '" data-sec="' + s.id + '">' +
                '<span class="ch-toc__num">' + U.esc(s.num || '') + '</span><span>' + U.esc(s.title) + '</span></button>';
            }).join('') +
            '</nav><div class="ch-toc__end"><button type="button" class="chip" data-sec="' + (ch.sections[ch.sections.length - 1] || {}).id + '">跳到本章末尾</button></div></aside>' +
          '<div class="ch-content">' +
            '<div class="ch-mobile-toc">' + ch.sections.map(function (s) {
              return '<button type="button" class="chip chip--sm" data-sec="' + s.id + '">' + U.esc(s.num || '') + ' ' + U.esc(s.title) + '</button>';
            }).join('') + '</div>' +
            (ch.sections.length ? ch.sections.map(function (s) { return K.section(s, ch); }).join('') :
              '<div class="empty"><div class="empty__art">' + GI.icon('book', 70) + '</div><h3>这一章的内容正在整理</h3><p>可以先做本章练习，或去速查台看看。</p></div>') +
            '<div class="ch-end">' +
              (hasQs ? '<div class="ch-cta"><div><h3>读完了，来验证一下。</h3><p>' + ch.counts.questions + ' 道题，含 ' + ch.counts.interactive + ' 个交互实验</p></div>' +
                '<button type="button" class="btn btn--lg" data-act="practice">开始本章练习' + GI.icon('arrowRight', 17) + '</button></div>' : '') +
              (nextAny ? '<a class="ch-next" style="--nx:' + nextAny.seed + '" href="#/ch/' + nextAny.num + '">' +
                '<span class="ch-next__num">' + (nextAny.num === 0 ? '附' : U.pad(nextAny.num)) + '</span>' +
                '<div class="grow"><small>下一站</small><b>' + U.esc(nextAny.title) + '</b></div>' + GI.icon('arrowRight', 18) + '</a>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<footer class="site-foot"><div><b>门与指令</b><div style="margin-top:5px">' + window.DATA.meta.site.footer + '</div></div><nav><a href="#/atlas">章节地图</a><a href="#/practice">练习</a><a href="#/ref">速查台</a></nav></footer>' +
        '</div>';
      return html;
    },
    mount: function (root, params, num) {
      var ch = M.chapter(num);
      if (!ch) return;
      var readBar = U.$('[data-readbar]', root);
      var ring = U.$('.ch-ring__fg', root);
      var pctEl = U.$('[data-readpct]', root);
      var tocItems = U.$$('.ch-toc__item', root);
      var secEls = U.$$('.ksec', root);
      var readCount = ch.sections.filter(function (s) { return !!GI.store.state.read[s.id]; }).length;
      var total = ch.sections.length || 1;
      var circ = 2 * Math.PI * 52;

      function updateRead() {
        var pct = Math.round((readCount / total) * 100);
        if (pctEl) pctEl.textContent = pct + '%';
        if (ring) ring.setAttribute('stroke-dashoffset', String(circ * (1 - pct / 100)));
      }
      function mark(sid) {
        if (!sid) return;
        var item = tocItems.filter(function (t) { return t.dataset.sec === sid; })[0];
        if (GI.store.markRead(sid)) {
          readCount++;
          updateRead();
          if (item) item.classList.add('is-read');
        }
      }
      U.$$('[data-act="practice"]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          GI.quiz.start({ mode: 'chapter', ch: num, count: Math.min(12, ch.counts.questions), types: [] });
        });
      });
      var labsBtn = U.$('[data-act="labs"]', root);
      if (labsBtn) labsBtn.addEventListener('click', function () {
        GI.quiz.start({ mode: 'lab', ch: num, count: 'all', types: [] });
      });
      U.$$('[data-sec-practice]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var sid = b.dataset.secPractice;
          var qs = M.questionsOfSection(sid);
          GI.quiz.start({ mode: 'section', ch: num, section: sid, count: Math.min(10, qs.length), types: [] });
        });
      });
      U.$$('[data-sec]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var el = document.getElementById('sec-' + b.dataset.sec);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      // 目录高亮 + 已读记录
      if ('IntersectionObserver' in window && secEls.length) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var sid = e.target.dataset.sid;
            tocItems.forEach(function (t) { t.classList.toggle('is-active', t.dataset.sec === sid); });
            mark(sid);
          });
        }, { rootMargin: '-18% 0px -55% 0px', threshold: 0.01 });
        secEls.forEach(function (el) { io.observe(el); });
      }
      // 阅读进度条
      function onScroll() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var top = window.scrollY || document.documentElement.scrollTop;
        if (readBar) readBar.style.width = (h > 0 ? Math.min(100, (top / h) * 100) : 0) + '%';
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      // 深链接定位
      var secParam = U.param('sec');
      if (secParam) {
        setTimeout(function () {
          var el = document.getElementById('sec-' + secParam);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
      // 更新章节统计缓存（只影响当前页面显示）
      ch.counts.read = readCount;
      ch.counts.readPct = Math.round((readCount / total) * 100);
    }
  };
})();

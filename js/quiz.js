/* quiz.js — 题目渲染、判分、练习会话 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util, M = GI.model;
  var Q = GI.quiz = {};
  var SESSION_KEY = 'gates-instructions.session.v1';
  var RESULT_KEY = 'gates-instructions.result.v1';
  var LETTERS = ['A', 'B', 'C', 'D', 'E'];

  Q.typeChip = function (q) {
    var t = M.typeMeta(q.type);
    var cls = t.interactive ? 'tag--ter' : 'tag--p';
    return '<span class="tag ' + cls + '">' + (t.interactive ? '◇ ' : '') + t.label + '</span>';
  };

  Q.diffDots = function (q) {
    return '<span class="qcard__diff" title="难度 ' + q.diff + '/3">' +
      [1, 2, 3].map(function (i) { return '<i class="' + (i <= q.diff ? 'on' : '') + '"></i>'; }).join('') + '</span>';
  };

  Q.stemTable = function (q) {
    var t = q.stemTable;
    if (!t) return '';
    return '<div class="qcard__stemtable"><div class="blk blk--table"><div class="table-scroll"><table class="data">' +
      '<thead><tr>' + t.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></div></div>';
  };

  Q.card = function (q) {
    var lab = M.typeMeta(q.type).lab;
    var sec = q._section;
    var html = '<article class="qcard' + (lab ? ' qcard--wide' : '') + '" data-qid="' + q.id + '">' +
      '<div class="qcard__top">' + Q.typeChip(q) + Q.diffDots(q) +
        '<span class="qcard__topic">' + (sec ? U.esc(sec.title) : '第 ' + q.ch + ' 章') + '</span></div>' +
      '<h1 class="qcard__stem">' + q.stem + '</h1>' +
      Q.stemTable(q) +
      '<div class="qcard__body"></div>' +
      '<div class="q-actions">' +
        (q.hint ? '<button type="button" class="btn btn--ghost btn--sm" data-act="hint">' + GI.icon('bulb', 16) + '提示</button>' : '') +
        '<span class="spacer"></span>' +
        '<button type="button" class="btn btn--filled" data-act="submit" disabled>检查答案</button>' +
      '</div>' +
      '<div class="q-hint-slot"></div><div class="feedback-slot"></div></article>';
    return html;
  };

  Q.body = function (q) {
    if (M.typeMeta(q.type).lab) return '<div class="lab-host"></div>';
    if (q.type === 'single' || q.type === 'multi') {
      return '<div class="q-options' + (q.type === 'multi' ? ' q-options--multi' : '') + '">' +
        (q.options || []).map(function (o, i) {
          return '<button type="button" class="opt" data-opt="' + i + '"><span class="opt__key">' + LETTERS[i] + '</span><span class="opt__text">' + o + '</span></button>';
        }).join('') + '</div>';
    }
    if (q.type === 'tf') {
      return '<div class="q-tf">' +
        '<button type="button" class="opt" data-opt="1"><span class="opt__key">✓</span><span class="opt__text">正确</span></button>' +
        '<button type="button" class="opt" data-opt="0"><span class="opt__key">×</span><span class="opt__text">错误</span></button>' +
        '</div>';
    }
    if (q.type === 'fill' || q.type === 'num') {
      return '<div class="q-fill"><div class="q-fill__row">' +
        '<input class="input" data-act="input" autocomplete="off" spellcheck="false" placeholder="' + U.esc(q.placeholder || (q.type === 'num' ? '输入数值' : '输入答案')) + '">' +
        (q.unit ? '<span class="q-fill__unit">' + U.esc(q.unit) + '</span>' : '') +
        '</div>' + (q.type === 'fill' && q.accept ? '<div class="q-fill__hint">填写关键答案即可，大小写与空格不敏感。</div>' : '') + '</div>';
    }
    return '';
  };

  /* 挂载一道题，返回控制器 */
  Q.mount = function (stage, q, onState) {
    stage.innerHTML = Q.card(q);
    var card = U.$('.qcard', stage);
    var body = U.$('.qcard__body', card);
    var submit = U.$('[data-act="submit"]', card);
    var feedbackSlot = U.$('.feedback-slot', card);
    var hintSlot = U.$('.q-hint-slot', card);
    var state = { value: null, submitted: false, ok: false, detail: '', lab: null };
    var isLab = !!M.typeMeta(q.type).lab;

    if (isLab) {
      body.innerHTML = '<div class="lab-host"></div>';
      var labHost = U.$('.lab-host', body);
      state.lab = GI.labs.mount(labHost, q);
      submit.disabled = !state.lab;
      submit.textContent = '提交实验';
    } else {
      body.innerHTML = Q.body(q);
      if (q.type === 'single' || q.type === 'tf') {
        U.$$('.opt', body).forEach(function (b) {
          b.addEventListener('click', function () {
            if (state.submitted) return;
            var v = Number(b.dataset.opt);
            state.value = v;
            U.$$('.opt', body).forEach(function (x) { x.classList.toggle('is-selected', x === b); });
            submit.disabled = false;
          });
        });
      } else if (q.type === 'multi') {
        var picked = {};
        U.$$('.opt', body).forEach(function (b) {
          b.addEventListener('click', function () {
            if (state.submitted) return;
            var v = Number(b.dataset.opt);
            picked[v] = !picked[v];
            b.classList.toggle('is-selected', !!picked[v]);
            state.value = Object.keys(picked).filter(function (k) { return picked[k]; }).map(Number).sort(function (a, b) { return a - b; });
            submit.disabled = !state.value.length;
          });
        });
      } else {
        var input = U.$('[data-act="input"]', body);
        input.addEventListener('input', function () {
          state.value = input.value;
          submit.disabled = !String(input.value || '').trim();
        });
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !submit.disabled) { e.preventDefault(); doSubmit(); }
        });
        setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { } }, 80);
      }
    }

    var hintBtn = U.$('[data-act="hint"]', card);
    if (hintBtn) {
      hintBtn.addEventListener('click', function () {
        hintSlot.innerHTML = '<div class="q-hint">' + GI.icon('bulb', 15) + '<span>' + (q.hint || '') + '</span></div>';
        hintBtn.disabled = true;
      });
    }

    function markOptions(correctVal) {
      U.$$('.opt', body).forEach(function (b) {
        var v = Number(b.dataset.opt);
        b.disabled = true;
        if (q.type === 'multi') {
          var isAns = Array.isArray(q.answer) && q.answer.indexOf(v) >= 0;
          var isPick = Array.isArray(correctVal) && correctVal.indexOf(v) >= 0;
          if (isAns) b.classList.add('is-correct');
          else if (isPick) b.classList.add('is-wrong');
          else b.classList.add('is-dim');
        } else {
          var isCorrect = (q.type === 'fill' || q.type === 'num') ? false : Number(q.answer) === v;
          if (isCorrect) b.classList.add('is-correct');
          else if (v === correctVal && !isCorrect) b.classList.add('is-wrong');
        }
      });
    }

    function feedback(ok, detail) {
      feedbackSlot.innerHTML = '<div class="feedback feedback--' + (ok ? 'ok' : 'bad') + '">' +
        '<div class="feedback__head"><span>' + GI.icon(ok ? 'check' : 'x', 15) + '</span>' + (ok ? '回答正确' : '回答错误') + '</div>' +
        (detail ? '<div class="feedback__body">' + detail + '</div>' : '') +
        '<div class="feedback__body">' + (q.explain || '') + '</div>' +
        (ok ? '' : '<div class="feedback__answer">正确答案：<b>' + M.correctText(q) + '</b></div>') +
        '<div class="feedback__actions">' +
          '<button type="button" class="feedback__next" data-act="next">' + (onState && onState.last ? '完成并查看结果' : '下一题') + GI.icon('arrowRight', 17) + '</button>' +
          (q._section ? '<a class="btn btn--ghost btn--sm" href="#/ch/' + q.ch + '?sec=' + encodeURIComponent(q._section.id) + '">回看知识点</a>' : '') +
        '</div></div>';
      U.$('[data-act="next"]', feedbackSlot).addEventListener('click', function () {
        if (onState && onState.onNext) onState.onNext();
      });
      setTimeout(function () { feedbackSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    }

    function doSubmit() {
      if (state.submitted) return;
      var ok = false, detail = '';
      if (isLab) {
        if (!state.lab) return;
        var r = state.lab.check();
        ok = !!(r && r.ok);
        detail = r ? r.detail : '';
        if (state.lab.lock) state.lab.lock();
      } else if (q.type === 'single' || q.type === 'tf') {
        if (state.value == null) return;
        ok = Number(state.value) === Number(q.answer);
        markOptions(state.value);
      } else if (q.type === 'multi') {
        if (!Array.isArray(state.value) || !state.value.length) return;
        var want = (q.answer || []).slice().sort().join(',');
        ok = state.value.join(',') === want;
        markOptions(state.value);
      } else if (q.type === 'fill') {
        ok = U.answerMatches(state.value, q.accept);
        var inp = U.$('[data-act="input"]', body);
        if (inp) { inp.disabled = true; inp.classList.add(ok ? 'is-ok' : 'is-error'); }
      } else if (q.type === 'num') {
        var v = U.parseNum(state.value);
        ok = !isNaN(v) && Math.abs(v - q.answer) <= (q.tol || 0) + 1e-9;
        var inp2 = U.$('[data-act="input"]', body);
        if (inp2) { inp2.disabled = true; inp2.classList.add(ok ? 'is-ok' : 'is-error'); }
        detail = ok ? '' : '你输入的是 ' + U.esc(String(state.value)) + '。';
      }
      state.submitted = true;
      state.ok = ok;
      state.detail = detail;
      submit.disabled = true;
      submit.textContent = '已提交';
      feedback(ok, detail);
      if (onState && onState.onAnswered) {
        var answer = isLab ? { ok: ok, detail: detail } : state.value;
        onState.onAnswered({ ok: ok, answer: answer, detail: detail });
      }
    }
    submit.addEventListener('click', doSubmit);

    return {
      state: state,
      submit: doSubmit,
      isLab: isLab,
      lab: state.lab
    };
  };

  /* 会话存储 */
  function saveSession() {
    var s = GI.session;
    if (!s) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        config: s.config, qids: s.questions.map(function (x) { return x.id; }),
        index: s.index, records: s.records, startedAt: s.startedAt
      }));
    } catch (e) { }
  }
  Q.hasSession = function () {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  };
  Q.clearSession = function () { try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { } };
  Q.lastResult = function () {
    try { return JSON.parse(sessionStorage.getItem(RESULT_KEY) || 'null'); } catch (e) { return null; }
  };
  Q.start = function (config) {
    var qs = M.pick(config);
    if (!qs.length) {
      U.toast('当前条件下没有可练习的题目');
      return false;
    }
    if (GI.session && GI.session.timerId) clearInterval(GI.session.timerId);
    GI.session = {
      config: config, questions: qs, index: 0, records: [],
      startedAt: Date.now(), mounted: null, timerId: null
    };
    Q.clearSession();
    saveSession();
    U.go('#/quiz');
    return true;
  };
  Q.resume = function () {
    var saved = Q.hasSession();
    if (!saved) return false;
    var qs = (saved.qids || []).map(function (id) { return M.question(id); }).filter(Boolean);
    if (!qs.length) return false;
    GI.session = {
      config: saved.config || {}, questions: qs, index: saved.index || 0,
      records: saved.records || [], startedAt: saved.startedAt || Date.now(), mounted: null, timerId: null
    };
    U.go('#/quiz');
    return true;
  };

  GI.views = GI.views || {};
  GI.views.quiz = {
    seed: function () {
      var s = GI.session;
      if (s && s.config && s.config.ch != null && s.config.ch !== 'all' && s.config.ch !== '') return M.chapterSeed(Number(s.config.ch));
      return window.DATA.meta.site.practiceSeed;
    },
    nav: 'practice',
    title: '练习中',
    render: function () {
      var s = GI.session;
      if (!s) {
        var saved = Q.hasSession();
        if (saved) {
          setTimeout(function () { Q.resume(); }, 0);
          return '<div class="page"><div class="empty"><h3>正在载入练习…</h3></div></div>';
        }
        return '<div class="page"><div class="empty"><div class="empty__art">' + GI.icon('target', 70) + '</div><h3>还没有开始的练习</h3><p>先挑一组题，再回来。</p><a class="btn btn--filled" href="#/practice">去选择题目</a></div></div>';
      }
      var idx = Math.min(s.index, s.questions.length - 1);
      var qq = s.questions[idx];
      var ch = M.chapter(qq.ch) || {};
      return '<div class="page quiz-page">' +
        '<div class="quiz-top">' +
          '<button type="button" class="icon-btn" data-act="exit" aria-label="退出练习">' + GI.icon('x') + '</button>' +
          '<div class="quiz-top__mid"><span class="quiz-top__chip"><i></i>第 ' + (qq.ch || '附') + ' 章 · ' + U.esc(ch.title || '综合') + '</span>' +
            (s.config && s.config.mode === 'lab' ? '<span class="tag tag--ter">实验专项</span>' : '') +
            (s.config && s.config.mode === 'wrong' ? '<span class="tag tag--danger">错题重练</span>' : '') +
          '</div>' +
          '<span class="quiz-top__count"><b>' + U.pad(idx + 1) + '</b> / ' + U.pad(s.questions.length) + '</span>' +
          '<span class="quiz-top__time" data-timer>00:00</span>' +
        '</div>' +
        '<div class="quiz-shell"><div class="quiz-main">' +
          '<div class="quiz-progress"><div class="quiz-segs">' +
            s.questions.map(function (x, i) {
              var rec = s.records.filter(function (r) { return r.id === x.id; })[0];
              var cls = i === idx ? 'is-current' : (rec ? (rec.ok ? 'is-correct' : 'is-wrong') : '');
              return '<span class="quiz-seg ' + cls + '"></span>';
            }).join('') +
          '</div><span class="quiz-progress__pct">' + Math.round(((idx + 1) / s.questions.length) * 100) + '%</span></div>' +
          '<div id="qstage"></div>' +
        '</div>' +
        '<aside class="quiz-rail"><div class="quiz-rail__title">本次进度</div><div class="quiz-rail__dots">' +
          s.questions.map(function (x, i) {
            var rec = s.records.filter(function (r) { return r.id === x.id; })[0];
            var cls = i === idx ? 'is-current' : (rec ? (rec.ok ? 'is-correct' : 'is-wrong') : '');
            return '<span class="qdot ' + cls + '">' + (i + 1) + '</span>';
          }).join('') +
        '</div><div class="quiz-rail__legend">' +
          '<span><i style="background:var(--p)"></i>当前</span>' +
          '<span><i style="background:var(--success)"></i>正确</span>' +
          '<span><i style="background:var(--danger)"></i>错误</span>' +
        '</div><div class="quiz-rail__tip"><kbd>1</kbd>–<kbd>4</kbd> 选择 · <kbd>Enter</kbd> 检查 / 下一题</div></aside>' +
        '</div></div>';
    },
    mount: function (root) {
      var s = GI.session;
      if (!s) return;
      var stage = U.$('#qstage', root);
      var idx = s.index;
      var qq = s.questions[idx];
      var last = idx === s.questions.length - 1;
      s.mounted = Q.mount(stage, qq, {
        last: last,
        onAnswered: function (rec) {
          var existing = s.records.filter(function (r) { return r.id === qq.id; })[0];
          if (existing) { existing.ok = rec.ok; existing.answer = rec.answer; existing.detail = rec.detail; }
          else s.records.push({ id: qq.id, ok: rec.ok, answer: rec.answer, detail: rec.detail });
          GI.store.record(qq, rec.ok);
          saveSession();
          var rec2 = U.$('.quiz-progress .quiz-progress__pct', root);
          var segs = U.$$('.quiz-seg', root);
          if (segs[idx]) { segs[idx].classList.remove('is-current'); segs[idx].classList.add(rec.ok ? 'is-correct' : 'is-wrong'); }
          var dots = U.$$('.qdot', root);
          if (dots[idx]) { dots[idx].classList.remove('is-current'); dots[idx].classList.add(rec.ok ? 'is-correct' : 'is-wrong'); }
          if (rec2) rec2.textContent = Math.round(((idx + 1) / s.questions.length) * 100) + '%';
        },
        onNext: function () {
          if (last) { finish(); return; }
          s.index++;
          s.mounted = null;
          saveSession();
          GI.router.render();
          U.$('#app').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      // 退出
      var exitBtn = U.$('[data-act="exit"]', root);
      if (exitBtn) exitBtn.addEventListener('click', function () {
        saveSession();
        if (confirm('退出本次练习？已答题目会保存在错题本，进度可在练习页继续。')) U.go('#/practice');
      });
      // 计时
      clearInterval(s.timerId);
      var timerEl = U.$('[data-timer]', root);
      function tick() {
        if (!timerEl) return;
        var sec = Math.floor((Date.now() - s.startedAt) / 1000);
        timerEl.textContent = U.pad(Math.floor(sec / 60)) + ':' + U.pad(sec % 60);
      }
      tick();
      s.timerId = setInterval(tick, 1000);
    },
    destroy: function () {
      if (GI.session) { clearInterval(GI.session.timerId); GI.session.timerId = null; }
    }
  };

  function finish() {
    var s = GI.session;
    if (!s) { U.go('#/practice'); return; }
    var records = s.questions.map(function (q) {
      var r = s.records.filter(function (x) { return x.id === q.id; })[0] || { ok: false, answer: null, detail: '未作答' };
      return { id: q.id, ok: !!r.ok, answer: r.answer, detail: r.detail };
    });
    var result = {
      config: s.config,
      qids: s.questions.map(function (q) { return q.id; }),
      records: records,
      startedAt: s.startedAt,
      finishedAt: Date.now(),
      secs: Math.round((Date.now() - s.startedAt) / 1000)
    };
    try { sessionStorage.setItem(RESULT_KEY, JSON.stringify(result)); } catch (e) { }
    var ch = s.questions[0] ? s.questions[0].ch : null;
    GI.store.addSession({
      ts: Date.now(), ch: ch, n: records.length,
      ok: records.filter(function (r) { return r.ok; }).length,
      secs: result.secs, mode: (s.config && s.config.mode) || 'quick'
    });
    clearInterval(s.timerId);
    GI.session = null;
    Q.clearSession();
    U.go('#/result');
  }

  /* 结果页 */
  GI.views.result = {
    seed: function () {
      var r = Q.lastResult();
      if (r) {
        var qs = r.qids.map(function (id) { return M.question(id); }).filter(Boolean);
        if (qs.length && qs.every(function (q) { return q.ch === qs[0].ch; })) return M.chapterSeed(qs[0].ch);
      }
      return window.DATA.meta.site.practiceSeed;
    },
    nav: 'practice',
    title: '练习结果',
    render: function () {
      var r = Q.lastResult();
      if (!r) return '<div class="page"><div class="empty"><div class="empty__art">' + GI.icon('target', 70) + '</div><h3>还没有结果</h3><p>完成一组练习后，这里会出现成绩单。</p><a class="btn btn--filled" href="#/practice">去练习</a></div></div>';
      var qs = r.qids.map(function (id) { return M.question(id); }).filter(Boolean);
      var okCount = r.records.filter(function (x) { return x.ok; }).length;
      var pct = qs.length ? Math.round((okCount / qs.length) * 100) : 0;
      var chSet = {};
      qs.forEach(function (x) { chSet[x.ch] = 1; });
      var chKeys = Object.keys(chSet);
      var mixed = chKeys.length > 1;
      var chName = mixed ? '综合练习' : (qs[0] ? (M.chapter(qs[0].ch) || {}).title : '综合');
      var greet = pct >= 90 ? '漂亮，这一组几乎全中。' : pct >= 70 ? '稳住了，再把错的几题收尾。' : pct >= 50 ? '一半以上拿下，错题值得回看。' : '别急，先回讲义把相关知识点过一遍。';
      var circle = 2 * Math.PI * 46;
      return '<div class="page">' +
        '<div class="result-hero">' +
          '<div class="result-ring"><svg viewBox="0 0 100 100"><circle class="result-ring__bg" cx="50" cy="50" r="46"/>' +
            '<circle class="result-ring__fg" cx="50" cy="50" r="46" stroke-dasharray="' + circle + '" stroke-dashoffset="' + circle + '" data-pct="' + pct + '"/></svg>' +
            '<div class="result-ring__center"><b>' + pct + '<small style="font-size:.45em">%</small></b><span>正确率</span></div></div>' +
          '<div class="result-copy"><div class="eyebrow">SESSION COMPLETE · ' + U.esc(chName) + '</div>' +
            '<h1>' + okCount + ' / ' + qs.length + ' 题正确</h1><p>' + greet + '</p>' +
            '<div class="result-stats">' +
              '<div><b>' + okCount + '</b><span>正确</span></div>' +
              '<div><b>' + (qs.length - okCount) + '</b><span>错误</span></div>' +
              '<div><b>' + U.duration(r.secs) + '</b><span>用时</span></div>' +
              '<div><b>' + (r.config && r.config.mode === 'lab' ? '实验' : '练习') + '</b><span>模式</span></div>' +
            '</div>' +
            '<div class="result-actions">' +
              '<button type="button" class="btn btn--filled" data-act="again">再来一组' + GI.icon('refresh', 17) + '</button>' +
              (qs.length - okCount ? '<button type="button" class="btn btn--outlined" data-act="wrong">只练错题</button>' : '') +
              '<a class="btn btn--ghost" href="#/stats">看进度</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="review-wrap"><div class="review-head"><h2>逐题回顾</h2><span>点开每一题看解析</span></div><div class="review-list">' +
          r.records.map(function (rec, i) {
            var qq = M.question(rec.id);
            if (!qq) return '';
            return '<div class="review-item" data-rid="' + i + '">' +
              '<div class="review-item__idx">' + U.pad(i + 1) + '<i style="background:' + (rec.ok ? 'var(--success)' : 'var(--danger)') + '"></i></div>' +
              '<div><div class="review-item__stem">' + qq.stem + '</div>' +
                '<div class="review-item__meta"><span>' + M.typeMeta(qq.type).label + '</span>' + (mixed ? '<span>第 ' + (qq.ch === 0 ? '速查' : qq.ch) + ' 章</span>' : '') +
                  '<span>你的答案：<b>' + M.givenText(qq, rec.answer) + '</b></span>' +
                  (rec.ok ? '' : '<span>正确答案：<b>' + M.correctText(qq) + '</b></span>') +
                '</div></div>' +
              '<div class="review-item__actions"><button type="button" class="review-item__toggle" data-toggle="' + i + '" aria-label="展开解析" aria-expanded="false">' + GI.icon('chevronDown', 16) + '</button></div>' +
              '<div class="review-explain">' + (qq.explain || '') + (rec.detail ? '<div style="margin-top:6px">判定：' + U.esc(rec.detail) + '</div>' : '') +
                (qq._section ? '<div style="margin-top:8px"><a class="btn btn--ghost btn--sm" href="#/ch/' + qq.ch + '?sec=' + encodeURIComponent(qq._section.id) + '">回看「' + U.esc(qq._section.title) + '」</a></div>' : '') +
              '</div></div>';
          }).join('') +
        '</div></div></div>';
    },
    mount: function (root) {
      var r = Q.lastResult();
      if (!r) return;
      var fg = U.$('.result-ring__fg', root);
      if (fg) {
        var pct = Number(fg.dataset.pct) || 0;
        var circle = 2 * Math.PI * 46;
        setTimeout(function () { fg.style.strokeDashoffset = String(circle * (1 - pct / 100)); }, 120);
      }
      U.$$('[data-toggle]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          var item = b.closest('.review-item');
          var open = item.classList.toggle('is-open');
          b.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
      var again = U.$('[data-act="again"]', root);
      if (again) again.addEventListener('click', function () {
        var cfg = Object.assign({}, r.config || { mode: 'quick', count: 10 });
        Q.start(cfg);
      });
      var wrongBtn = U.$('[data-act="wrong"]', root);
      if (wrongBtn) wrongBtn.addEventListener('click', function () {
        var ids = r.records.filter(function (x) { return !x.ok; }).map(function (x) { return x.id; });
        Q.start({ mode: 'quick', ids: ids, count: ids.length, types: [] });
      });
    }
  };
})();

/* model.js — 数据模型、统计、检索、组卷 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util;
  var TYPES = {
    single: { label: '单选题', short: '单选', interactive: false },
    multi: { label: '多选题', short: '多选', interactive: false },
    tf: { label: '判断题', short: '判断', interactive: false },
    fill: { label: '填空题', short: '填空', interactive: false },
    num: { label: '计算题', short: '计算', interactive: false },
    gate: { label: '电路实验', short: '门电路', interactive: true, lab: true, desc: '拖动逻辑门搭建电路' },
    hdl: { label: 'HDL 实验', short: 'HDL', interactive: true, lab: true, desc: '编写 SystemVerilog' },
    mips: { label: 'MIPS 实验', short: 'MIPS', interactive: true, lab: true, desc: '编写 MIPS 汇编' },
    kmap: { label: '卡诺图', short: '卡诺图', interactive: true, lab: true, desc: '圈出最简与或式' },
    wave: { label: '波形题', short: '波形', interactive: true, lab: true, desc: '画出时序波形' },
    order: { label: '排序题', short: '排序', interactive: true, lab: true, desc: '拖动排出正确顺序' },
    match: { label: '配对题', short: '配对', interactive: true, lab: true, desc: '拖动配对概念' },
    bin: { label: '位开关', short: '位开关', interactive: true, lab: true, desc: '拨动二进制位' },
    fields: { label: '位域编码', short: '位域', interactive: true, lab: true, desc: '填写指令 / 地址字段' }
  };
  GI.TYPES = TYPES;
  GI.INTERACTIVE = Object.keys(TYPES).filter(function (t) { return TYPES[t].interactive; });

  var Model = GI.model = {
    TYPES: TYPES,
    chapters: [],
    byNum: {},
    sectionsById: {},
    questions: [],
    questionsById: {},
    byChapter: {},
    totals: { sections: 0, questions: 0, interactive: 0 },
    searchItems: [],
    build: function () {
      var meta = (window.DATA && window.DATA.meta) || { chapters: [], site: {} };
      var secData = (window.DATA && window.DATA.sections) || {};
      var qs = (window.DATA && window.DATA.questions) || [];
      Model.chapters = [];
      Model.byNum = {};
      Model.sectionsById = {};
      Model.questionsById = {};
      Model.byChapter = {};
      Model.searchItems = [];
      var seen = {};
      (meta.chapters || []).forEach(function (m) {
        var ch = Object.assign({}, m);
        var pack = secData[m.num] || {};
        ch.intro = pack.intro || '';
        ch.sections = (pack.sections || []).slice();
        ch.questions = [];
        ch.counts = { sections: ch.sections.length, questions: 0, interactive: 0, read: 0, attempted: 0, correct: 0 };
        Model.chapters.push(ch);
        Model.byNum[m.num] = ch;
        Model.byChapter[m.num] = [];
        ch.sections.forEach(function (s, i) {
          s.ch = m.num;
          s._index = i;
          s._anchors = [];
          Model.sectionsById[s.id] = s;
          Model.totals.sections++;
          ch.counts.sections = ch.sections.length;
          Model.searchItems.push({
            type: 'section', id: s.id, ch: m.num,
            title: s.title, sub: (m.num === 0 ? '速查台' : '第 ' + m.num + ' 章') + ' · ' + (s.num || ''),
            text: U.strip([s.lead || ''].concat((s.blocks || []).map(function (b) {
              return b.html || b.title || (b.items ? b.items.map(function (x) { return x.html || x.k || x; }).join(' ') : '') || (b.rows ? b.rows.map(function (r) { return r.join(' '); }).join(' ') : '') || b.code || '';
            })).join(' ')),
            href: '#/ch/' + m.num + '?sec=' + encodeURIComponent(s.id)
          });
        });
      });
      qs.forEach(function (q) {
        if (!q || !q.id || seen[q.id]) return;
        seen[q.id] = 1;
        var ch = Model.byNum[q.ch];
        if (!ch) return;
        q._chapter = ch;
        var sec = Model.sectionsById[q.sec];
        q._section = sec || null;
        if (!q.type || !TYPES[q.type]) q.type = 'single';
        Model.questions.push(q);
        Model.questionsById[q.id] = q;
        Model.byChapter[q.ch].push(q);
        ch.questions.push(q);
        ch.counts.questions++;
        if (TYPES[q.type].interactive) {
          ch.counts.interactive++;
          Model.totals.interactive++;
        }
        Model.totals.questions++;
        Model.searchItems.push({
          type: 'question', id: q.id, ch: q.ch,
          title: U.strip(q.stem).slice(0, 96),
          sub: (q.ch === 0 ? '速查台' : '第 ' + q.ch + ' 章') + ' · ' + TYPES[q.type].label + (sec ? ' · ' + sec.title : ''),
          text: U.strip(q.stem) + ' ' + U.strip(q.explain || ''),
          href: null,
          q: q
        });
      });
      Model.questions.sort(function (a, b) { return a.id < b.id ? -1 : 1; });
      Model.byChapter[0] = Model.byChapter[0] || [];
      Model.chapters.forEach(function (ch) {
        ch.counts.read = ch.sections.filter(function (s) { return !!GI.store.state.read[s.id]; }).length;
        var att = 0, ok = 0;
        ch.questions.forEach(function (q) {
          var a = GI.store.state.answers[q.id];
          if (a) { att++; if (a.ok) ok++; }
        });
        ch.counts.attempted = att;
        ch.counts.correct = ok;
        ch.counts.mastery = att ? Math.round((ok / att) * 100) : 0;
        ch.counts.readPct = ch.sections.length ? Math.round((ch.counts.read / ch.sections.length) * 100) : 0;
      });
      return Model;
    },
    refreshStats: function () {
      Model.chapters.forEach(function (ch) {
        ch.counts.read = ch.sections.filter(function (s) { return !!GI.store.state.read[s.id]; }).length;
        var att = 0, ok = 0;
        ch.questions.forEach(function (q) {
          var a = GI.store.state.answers[q.id];
          if (a) { att++; if (a.ok) ok++; }
        });
        ch.counts.attempted = att;
        ch.counts.correct = ok;
        ch.counts.mastery = att ? Math.round((ok / att) * 100) : 0;
        ch.counts.readPct = ch.sections.length ? Math.round((ch.counts.read / ch.sections.length) * 100) : 0;
      });
    },
    chapter: function (num) { return Model.byNum[num]; },
    section: function (id) { return Model.sectionsById[id]; },
    question: function (id) { return Model.questionsById[id]; },
    typeMeta: function (t) { return TYPES[t] || TYPES.single; },
    chapterSeed: function (num) {
      var ch = Model.byNum[num];
      return ch ? ch.seed : ((window.DATA.meta.site.defaultSeed) || '#4A3F8C');
    },
    globalStats: function () {
      var S = GI.store.state;
      var total = Model.totals;
      var attempted = 0, correct = 0, wrong = 0;
      Object.keys(S.answers).forEach(function (k) {
        attempted++;
        if (S.answers[k].ok) correct++; else wrong++;
      });
      var read = 0;
      Model.chapters.forEach(function (c) { read += c.counts.read; });
      var t = Model.totals.questions ? Math.round((attempted / Model.totals.questions) * 100) : 0;
      var acc = attempted ? Math.round((correct / attempted) * 100) : 0;
      return {
        attempted: attempted, correct: correct, wrong: wrong,
        totalQuestions: Model.totals.questions,
        totalSections: Model.totals.sections,
        readSections: read,
        coverage: t, accuracy: acc,
        streak: GI.store.streak(),
        wrongBook: Object.keys(S.wrong).length
      };
    },
    /* 知识点关联题目 */
    questionsOfSection: function (sectionId) {
      return Model.questions.filter(function (q) { return q.sec === sectionId; });
    },
    /* 组卷 */
    pick: function (config) {
      config = config || {};
      var mode = config.mode || 'quick';
      var chFilter = config.ch;
      var pool = Model.questions.slice();
      if (chFilter != null && chFilter !== 'all' && chFilter !== '') {
        pool = pool.filter(function (q) { return String(q.ch) === String(chFilter); });
      }
      if (config.section) pool = pool.filter(function (q) { return q.sec === config.section; });
      if (mode === 'lab') pool = pool.filter(function (q) { return TYPES[q.type].interactive; });
      if (mode === 'wrong') {
        var wrong = GI.store.state.wrong;
        pool = pool.filter(function (q) { return !!wrong[q.id]; });
        pool.sort(function (a, b) { return (wrong[b.id] || {}).ts - (wrong[a.id] || {}).ts; });
        var wcount = config.count && config.count !== 'all' ? Math.min(config.count, pool.length) : pool.length;
        return pool.slice(0, wcount);
      }
      if (Array.isArray(config.types) && config.types.length) {
        pool = pool.filter(function (q) { return config.types.indexOf(q.type) >= 0; });
      }
      if (config.ids && config.ids.length) {
        pool = pool.filter(function (q) { return config.ids.indexOf(q.id) >= 0; });
      }
      var shuffled = U.shuffle(pool);
      // 优先未做过、其次做错过
      var answers = GI.store.state.answers, wrongSet = GI.store.state.wrong;
      shuffled.sort(function (a, b) {
        function rank(q) { return answers[q.id] ? (wrongSet[q.id] ? 1 : 2) : 0; }
        return rank(a) - rank(b);
      });
      var count = config.count;
      if (count === 'all' || count == null) count = Math.min(pool.length, mode === 'full' ? pool.length : 9999);
      count = Math.min(Number(count) || 10, shuffled.length);
      return shuffled.slice(0, count);
    },
    countAvailable: function (config) {
      config = config || {};
      var mode = config.mode || 'quick';
      var pool = Model.questions.slice();
      if (config.ch != null && config.ch !== 'all' && config.ch !== '') {
        pool = pool.filter(function (q) { return String(q.ch) === String(config.ch); });
      }
      if (config.section) pool = pool.filter(function (q) { return q.sec === config.section; });
      if (mode === 'lab') pool = pool.filter(function (q) { return TYPES[q.type].interactive; });
      if (mode === 'wrong') {
        var wrong = GI.store.state.wrong;
        pool = pool.filter(function (q) { return !!wrong[q.id]; });
      }
      if (Array.isArray(config.types) && config.types.length) {
        pool = pool.filter(function (q) { return config.types.indexOf(q.type) >= 0; });
      }
      return pool.length;
    },
    /* 搜索 */
    search: function (query) {
      var q = String(query || '').trim().toLowerCase();
      if (q.length < 1) return [];
      var terms = q.split(/\s+/).filter(Boolean);
      var scored = [];
      Model.searchItems.forEach(function (it) {
        var hay = (it.title + ' ' + it.sub + ' ' + it.text).toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          if (!terms[i]) continue;
          if (hay.indexOf(terms[i]) < 0) return;
          score += 1;
          if (it.title.toLowerCase().indexOf(terms[i]) >= 0) score += 4;
          if (it.sub.toLowerCase().indexOf(terms[i]) >= 0) score += 1;
        }
        scored.push({ item: it, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, 100).map(function (s) { return s.item; });
    },
    /* 展示文本 */
    givenText: function (q, ans) {
      if (ans == null || ans === '') return '未作答';
      if (q.type === 'single' || q.type === 'tf') {
        var letters = ['A', 'B', 'C', 'D', 'E'];
        if (q.type === 'tf') return ans === 1 ? '正确' : '错误';
        var i = Number(ans);
        return letters[i] + '. ' + U.strip((q.options || [])[i] || '');
      }
      if (q.type === 'multi') {
        if (!Array.isArray(ans)) return String(ans);
        var letters2 = ['A', 'B', 'C', 'D', 'E'];
        return ans.map(function (i) { return letters2[i]; }).join('、');
      }
      if (q.type === 'num') return ans + (q.unit ? ' ' + q.unit : '');
      if (TYPES[q.type].interactive) return ans && ans.ok ? '实验通过' : '实验未通过';
      return U.esc(String(ans));
    },
    correctText: function (q) {
      if (q.type === 'single') return modelLetters(q)[q.answer];
      if (q.type === 'multi') return (q.answer || []).map(function (i) { return modelLetters(q)[i]; }).join('、');
      if (q.type === 'tf') return q.answer === 1 ? '正确' : '错误';
      if (q.type === 'fill') return (q.accept || []).join(' / ');
      if (q.type === 'num') return q.answer + (q.unit ? ' ' + q.unit : '');
      if (q.type === 'gate') return q.lab ? ('参考式 ' + q.lab.expr) : '—';
      if (q.type === 'mips') return q.lab ? (q.lab.expect && q.lab.expect.regs ? Object.keys(q.lab.expect.regs).map(function (k) { return '$' + k + '=' + q.lab.expect.regs[k]; }).join(', ') : '—') : '—';
      if (q.type === 'hdl' || q.type === 'kmap' || q.type === 'wave') return '见解析';
      return '见解析';
    }
  };
  function modelLetters(q) { return ['A', 'B', 'C', 'D', 'E'].slice(0, (q.options || []).length); }
  GI.modelLetters = modelLetters;
})();

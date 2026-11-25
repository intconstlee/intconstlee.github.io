/* labs.js — 9 类交互实验题 */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util;
  var L = GI.labs = {};

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return U.esc(s); }
  function seedOf(id) {
    var h = 0, s = String(id);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }
  function seeded(id, arr) { return U.shuffle(arr, U.rng(seedOf(id))); }
  function statusEl(el, text, kind) {
    el.className = 'lab-status' + (kind ? ' is-' + kind : '');
    el.innerHTML = '<i></i>' + esc(text);
  }
  function lockButtons(root) {
    qa('button, input, select, textarea', root).forEach(function (b) { b.disabled = true; });
  }

  /* ================================================================
     1. 逻辑门电路实验
     ================================================================ */
  L.gate = function (host, qq) {
    var lab = qq.lab;
    var inputs = lab.inputs || ['A', 'B'];
    var rows = lab.rows || [];
    var allowed = lab.allowed || ['AND', 'OR', 'NOT'];
    var maxGates = lab.maxGates || 5;
    var W = 760, H = 400;
    var state = { nodes: [], wires: {}, out: null, serial: 0, row: 0, pending: null, drag: null, locked: false, simError: '' };
    var hostEl = document.createElement('div');
    hostEl.className = 'lab gate-lab-wrap';
    hostEl.innerHTML =
      '<div class="lab__bar">' +
        '<div class="lab__title">' + GI.icon('cpu', 15) + '电路工作台 <em>拖入逻辑门，拖动端口连线</em></div>' +
        '<div class="lab__actions">' +
          '<button type="button" class="lab-btn" data-a="clear">' + GI.icon('trash', 13) + '清空</button>' +
          '<button type="button" class="lab-btn" data-a="ref">' + GI.icon('bulb', 13) + '示例解</button>' +
        '</div>' +
      '</div>' +
      '<div class="lab__body">' +
        '<div class="gate-target">' +
          '<span class="gate-target__label">真值表 · 点击选择模拟行</span>' +
          '<div class="gate-truth" role="group" aria-label="真值表行">' +
            rows.map(function (r, i) {
              return '<button type="button" data-row="' + i + '" class="' + (i === 0 ? 'is-on' : '') + '" title="' + inputs.join(' ') + ' → ' + esc((lab.outs && lab.outs[0]) || 'Y') + '">' +
                r.slice(0, inputs.length).join('') + ' → ' + r[inputs.length] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="lab-status"><i></i>等待连线</span>' +
        '</div>' +
        '<div class="gate-lab">' +
          '<div class="gate-palette"><div class="gate-palette__label">门电路</div>' +
            allowed.map(function (g) {
              return '<button type="button" class="g-tool" draggable="true" data-gate="' + g + '">' +
                gateSymbol(g) + '<span>' + g + '</span></button>';
            }).join('') +
          '</div>' +
          '<div class="gate-board-wrap"><svg class="gate-board" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="电路画布"></svg></div>' +
        '</div>' +
        '<div class="gate-legend"><span><i style="background:var(--s4)"></i>逻辑门</span><span><i style="background:var(--on-s5)"></i>高电平 1</span><span>拖动节点可移动</span><span>点击端口两次可连线</span></div>' +
      '</div>' +
      '<div class="lab__foot">' + GI.icon('info', 14) + '提示：从左侧信号或门的输出端口按下并拖到目标输入端口即可接线；双击门可删除。</div>';
    host.appendChild(hostEl);

    var svg = q('.gate-board', hostEl);
    var status = q('.lab-status', hostEl);
    var NS = 'http://www.w3.org/2000/svg';

    function inputY(i) { return 200 + (i - (inputs.length - 1) / 2) * 74; }
    function sourcePos(id) {
      if (!id) return null;
      var ii = inputs.indexOf(id);
      if (ii >= 0) return [80, inputY(ii)];
      var n = state.nodes.filter(function (x) { return x.id === id; })[0];
      return n ? [n.x + 38, n.y] : null;
    }
    function inPos(node, port) {
      if (node === 'OUT') return [686, 200];
      var n = state.nodes.filter(function (x) { return x.id === node; })[0];
      if (!n) return null;
      var nInputs = n.type === 'NOT' ? 1 : 2;
      return [n.x - 38, n.y + (nInputs === 1 ? 0 : (port === 0 ? -13 : 13))];
    }
    function ports() {
      var arr = [];
      inputs.forEach(function (nm, i) { arr.push({ x: 80, y: inputY(i), src: nm, kind: 'src' }); });
      state.nodes.forEach(function (n) {
        arr.push({ x: n.x + 38, y: n.y, src: n.id, kind: 'src' });
        var cnt = n.type === 'NOT' ? 1 : 2;
        for (var p = 0; p < cnt; p++) {
          var pt = inPos(n.id, p);
          arr.push({ x: pt[0], y: pt[1], node: n.id, port: p, kind: 'in' });
        }
      });
      arr.push({ x: 686, y: 200, node: 'OUT', kind: 'in' });
      return arr;
    }
    function readSource(src, rowIdx, memo, visiting) {
      if (!src) throw new Error('还有输入端口悬空');
      var ii = inputs.indexOf(src);
      if (ii >= 0) return rows[rowIdx][ii];
      var n = state.nodes.filter(function (x) { return x.id === src; })[0];
      if (!n) throw new Error('存在无效连线');
      if (visiting[src]) throw new Error('组合逻辑出现反馈环');
      if (memo[src] != null) return memo[src];
      visiting[src] = 1;
      var argCount = n.type === 'NOT' ? 1 : 2;
      var args = n.args.slice(0, argCount).map(function (s) { return readSource(s, rowIdx, memo, visiting); });
      var v;
      switch (n.type) {
        case 'AND': v = args[0] & args[1]; break;
        case 'OR': v = args[0] | args[1]; break;
        case 'XOR': v = args[0] ^ args[1]; break;
        case 'NAND': v = 1 - (args[0] & args[1]); break;
        case 'NOR': v = 1 - (args[0] | args[1]); break;
        case 'XNOR': v = 1 - (args[0] ^ args[1]); break;
        case 'NOT': v = 1 - args[0]; break;
        default: v = 0;
      }
      delete visiting[src];
      memo[src] = v;
      return v;
    }
    function evaluate(rowIdx) {
      var memo = {};
      var out = state.out ? readSource(state.out, rowIdx, memo, {}) : null;
      return { out: out, memo: memo };
    }
    function nicePath(a, b) {
      var dx = Math.max(24, Math.abs(b[0] - a[0]) * 0.45);
      return 'M' + a[0] + ' ' + a[1] + ' C' + (a[0] + dx) + ' ' + a[1] + ', ' + (b[0] - dx) + ' ' + b[1] + ', ' + b[0] + ' ' + b[1];
    }
    function valueAt(src, ev) {
      if (!ev) return null;
      if (inputs.indexOf(src) >= 0) return rows[state.row][inputs.indexOf(src)];
      if (ev.memo[src] != null) return ev.memo[src];
      return null;
    }
    function draw() {
      var ev = null, err = '';
      try { ev = evaluate(state.row); } catch (e) { err = e.message; }
      var html = '<defs><pattern id="gateDots" width="20" height="20" patternUnits="userSpaceOnUse"><circle class="grid-dot" cx="1.4" cy="1.4" r="1.1"/></pattern></defs>' +
        '<rect width="' + W + '" height="' + H + '" fill="url(#gateDots)"/>';
      // 输入端子
      inputs.forEach(function (nm, i) {
        var y = inputY(i);
        html += '<g class="g-io"><rect x="14" y="' + (y - 20) + '" width="58" height="40" rx="9"/>' +
          '<text x="43" y="' + (y + 4) + '">' + esc(nm) + '</text>' +
          '<text class="gval" x="43" y="' + (y + 15) + '">' + rows[state.row][i] + '</text></g>' +
          '<circle class="g-port' + (state.pending === nm ? ' is-source-armed' : '') + '" cx="80" cy="' + y + '" r="6" data-src="' + nm + '"/>';
      });
      // 输出端子
      html += '<g class="g-io"><rect x="688" y="180" width="58" height="40" rx="9"/><text x="717" y="204">' + esc((lab.outs && lab.outs[0]) || 'Y') + '</text>' +
        '<text class="gval" x="717" y="215">' + (ev && ev.out != null ? ev.out : '?') + '</text></g>' +
        '<circle class="g-port' + (state.pending ? '' : '') + '" cx="686" cy="200" r="6" data-in-node="OUT"/>';
      // 连线
      state.nodes.forEach(function (n) {
        n.args.forEach(function (src, p) {
          if (!src) return;
          var a = sourcePos(src), b = inPos(n.id, p);
          if (!a || !b) return;
          var live = ev && valueAt(src, ev) === 1 ? ' is-live' : '';
          html += '<path class="g-wire' + live + '" d="' + nicePath(a, b) + '"/>';
        });
      });
      if (state.out) {
        var oa = sourcePos(state.out), ob = [686, 200];
        var live2 = ev && ev.out === 1 ? ' is-live' : '';
        if (oa) html += '<path class="g-wire' + live2 + '" d="' + nicePath(oa, ob) + '"/>';
      }
      if (state.pending && state.dragPoint) {
        var pp = sourcePos(state.pending);
        if (pp) html += '<path class="g-wire is-preview" d="' + nicePath(pp, state.dragPoint) + '"/>';
      }
      // 逻辑门
      state.nodes.forEach(function (n) {
        var cnt = n.type === 'NOT' ? 1 : 2;
        html += '<g class="g-node" data-node="' + n.id + '" transform="translate(' + n.x + ',' + n.y + ')">' +
          '<rect x="-38" y="-23" width="76" height="46" rx="10"/>' +
          '<text class="g-gate-sym" y="-2">' + n.type + '</text>' +
          '<text class="g-id" y="11">' + n.id + '</text>' +
          '<circle class="g-del" cx="32" cy="-17" r="6.5" data-del="' + n.id + '"/>' +
          '<text class="g-del-x" x="32" y="-14.6" text-anchor="middle" style="font-size:8px;fill:#fff;pointer-events:none">×</text>';
        for (var p = 0; p < cnt; p++) {
          var pt = inPos(n.id, p);
          html += '<circle class="g-port' + (state.hoverPort && state.hoverPort.node === n.id && state.hoverPort.port === p ? ' is-target' : '') + '" cx="' + (pt[0] - n.x) + '" cy="' + (pt[1] - n.y) + '" r="6" data-in-node="' + n.id + '" data-in-port="' + p + '"/>';
        }
        html += '<circle class="g-port' + (state.pending === n.id ? ' is-source-armed' : '') + '" cx="38" cy="0" r="6" data-src="' + n.id + '"/>';
        var ov = ev && ev.memo[n.id] != null ? ev.memo[n.id] : null;
        if (ov != null) html += '<text x="0" y="21" text-anchor="middle" style="font-size:8px;fill:' + (ov ? 'var(--ter)' : 'var(--on-ink)') + ';opacity:.8">' + ov + '</text>';
        html += '</g>';
      });
      if (err) {
        html += '<text class="g-empty" x="' + (W / 2) + '" y="' + (H - 14) + '">' + esc(err) + '</text>';
      } else if (!state.nodes.length) {
        html += '<text class="g-empty" x="' + (W / 2) + '" y="' + (H / 2) + '">从左侧拖入逻辑门开始搭建</text>';
      } else if (!state.out) {
        html += '<text class="g-empty" x="' + (W / 2) + '" y="' + (H - 14) + '">把最后一个门的输出连到右侧 ' + esc((lab.outs && lab.outs[0]) || 'Y') + '</text>';
      }
      svg.innerHTML = html;
      var targetVal = rows[state.row][inputs.length];
      if (err) statusEl(status, err, 'bad');
      else if (!state.out) statusEl(status, '尚未连接输出', '');
      else statusEl(status, '当前行输出 ' + ev.out + '（目标 ' + targetVal + '）', ev.out === targetVal ? 'ok' : '');
    }

    function addNode(type, x, y) {
      if (state.locked) return;
      if (state.nodes.length >= maxGates) {
        U.toast('本题最多使用 ' + maxGates + ' 个门');
        return;
      }
      if (allowed.indexOf(type) < 0) return;
      var n = { id: 'G' + (++state.serial), type: type, x: Math.max(140, Math.min(590, x || 280)), y: Math.max(45, Math.min(355, y || 160)), args: type === 'NOT' ? [''] : ['', ''] };
      state.nodes.push(n);
      draw();
    }
    function deleteNode(id) {
      if (state.locked) return;
      state.nodes = state.nodes.filter(function (n) { return n.id !== id; });
      state.nodes.forEach(function (n) { n.args = n.args.map(function (s) { return s === id ? '' : s; }); });
      if (state.out === id) state.out = null;
      draw();
    }
    function clearAll() {
      if (state.locked) return;
      state.nodes = []; state.wires = {}; state.out = null; state.serial = 0; state.pending = null;
      draw();
    }
    function connect(node, port, src) {
      if (state.locked || !src) return;
      if (src === node) return;
      // 防止成环：检查 node 是否在 src 的上游
      function upstream(id, seen) {
        if (!id || inputs.indexOf(id) >= 0) return false;
        if (id === node) return true;
        if (seen[id]) return false;
        seen[id] = 1;
        var n = state.nodes.filter(function (x) { return x.id === id; })[0];
        return n ? n.args.some(function (s) { return upstream(s, seen); }) : false;
      }
      if (node === 'OUT') {
        if (upstream(src, {})) { U.toast('输出不能反馈到自身'); return; }
        state.out = src;
      } else {
        var n = state.nodes.filter(function (x) { return x.id === node; })[0];
        if (!n) return;
        if (upstream(src, {})) { U.toast('不能形成反馈环'); return; }
        if (n.args[port] === src) { n.args[port] = ''; state.pending = null; draw(); return; }
        n.args[port] = src;
      }
      state.pending = null;
      state.hoverPort = null;
      draw();
    }
    function svgPoint(e) {
      var r = svg.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
    }
    function nearestPort(pt) {
      var best = null, bd = 26;
      ports().forEach(function (p) {
        var d = Math.hypot(p.x - pt[0], p.y - pt[1]);
        if (d < bd) { bd = d; best = p; }
      });
      return best;
    }
    svg.addEventListener('dragstart', function (e) { e.preventDefault(); });
    qa('.g-tool', hostEl).forEach(function (btn) {
      btn.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', btn.dataset.gate);
        e.dataTransfer.effectAllowed = 'copy';
      });
      btn.addEventListener('click', function () {
        addNode(btn.dataset.gate, 240 + (state.nodes.length % 3) * 130, 100 + Math.floor(state.nodes.length / 3) * 90);
      });
    });
    var wrap = q('.gate-board-wrap', hostEl);
    wrap.addEventListener('dragover', function (e) { e.preventDefault(); });
    wrap.addEventListener('drop', function (e) {
      e.preventDefault();
      var type = e.dataTransfer.getData('text/plain');
      if (!type) return;
      var pt = svgPoint(e);
      addNode(type, pt[0], pt[1]);
    });
    var moving = null;
    svg.addEventListener('pointerdown', function (e) {
      if (state.locked) return;
      var t = e.target;
      var del = t.closest('[data-del]');
      if (del) { deleteNode(del.getAttribute('data-del')); return; }
      var src = t.closest('[data-src]');
      if (src) {
        state.pending = src.getAttribute('data-src');
        state.dragPoint = svgPoint(e);
        draw();
        e.preventDefault();
        return;
      }
      var inEl = t.closest('[data-in-node]');
      if (inEl) {
        if (state.pending) {
          connect(inEl.getAttribute('data-in-node'), Number(inEl.getAttribute('data-in-port') || 0), state.pending);
          e.preventDefault();
          return;
        }
      }
      var g = t.closest('[data-node]');
      if (g && !state.pending) {
        var n = state.nodes.filter(function (x) { return x.id === g.getAttribute('data-node'); })[0];
        if (!n) return;
        var pt = svgPoint(e);
        moving = { n: n, dx: n.x - pt[0], dy: n.y - pt[1] };
        g.classList.add('is-dragging');
        svg.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    });
    svg.addEventListener('pointermove', function (e) {
      if (state.locked) return;
      var pt = svgPoint(e);
      if (moving) {
        moving.n.x = U.clamp(pt[0] + moving.dx, 130, 600);
        moving.n.y = U.clamp(pt[1] + moving.dy, 40, 360);
        draw();
        return;
      }
      if (state.pending) {
        state.dragPoint = pt;
        var np = nearestPort(pt);
        state.hoverPort = np && np.kind === 'in' ? np : null;
        draw();
      }
    });
    function endPointer(e) {
      if (state.locked) return;
      if (moving) { moving = null; draw(); return; }
      if (state.pending) {
        var pt = svgPoint(e);
        var np = nearestPort(pt);
        if (np && np.kind === 'in') connect(np.node, np.port, state.pending);
        else { draw(); }
      }
    }
    svg.addEventListener('pointerup', endPointer);
    svg.addEventListener('pointercancel', function () { moving = null; state.pending = null; state.hoverPort = null; draw(); });
    svg.addEventListener('dblclick', function (e) {
      var g = e.target.closest('[data-node]');
      if (g) deleteNode(g.getAttribute('data-node'));
    });
    qa('[data-row]', hostEl).forEach(function (b) {
      b.addEventListener('click', function () {
        if (state.locked) return;
        state.row = Number(b.dataset.row);
        qa('[data-row]', hostEl).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        draw();
      });
    });
    q('[data-a="clear"]', hostEl).addEventListener('click', clearAll);

    function buildRef() {
      var expr = lab.expr;
      if (!expr) { U.toast('本题未提供参考解'); return; }
      try {
        var pos = 0;
        function peek() { while (/\s/.test(expr[pos] || '')) pos++; return expr[pos]; }
        function prim() {
          var c = peek();
          if (c === '(') { pos++; var v = orExpr(); if (peek() !== ')') throw new Error('括号不匹配'); pos++; return v; }
          if (c === '~' || c === '!') { pos++; return { op: '~', a: prim() }; }
          var m = /^[A-Za-z_]\w*/.exec(expr.slice(pos));
          if (m) { pos += m[0].length; return { v: m[0] }; }
          if (c === '0' || c === '1') { pos++; return { c: Number(c) }; }
          throw new Error('无法解析参考解');
        }
        function andExpr() { var a = prim(); for (;;) { peek(); if (expr[pos] === '&') { pos++; a = { op: '&', a: a, b: prim() }; } else break; } return a; }
        function xorExpr() { var a = andExpr(); for (;;) { peek(); if (expr[pos] === '^') { pos++; a = { op: '^', a: a, b: andExpr() }; } else break; } return a; }
        function orExpr() { var a = xorExpr(); for (;;) { peek(); if (expr[pos] === '|') { pos++; a = { op: '|', a: a, b: xorExpr() }; } else break; } return a; }
        var ast = orExpr();
        peek(); if (pos !== expr.length) throw new Error('参考解表达式有多余内容');
        var GATE_OF = { '&': 'AND', '|': 'OR', '^': 'XOR', '~': 'NOT' };
        var needed = {};
        (function scan(node) {
          if (!node || node.v != null || node.c != null) return;
          needed[GATE_OF[node.op]] = 1;
          scan(node.a); scan(node.b);
        })(ast);
        var canBasic = Object.keys(needed).every(function (g) { return allowed.indexOf(g) >= 0; });
        var universal = !canBasic && (allowed.indexOf('NAND') >= 0 || allowed.indexOf('NOR') >= 0);
        if (!canBasic && !universal) {
          statusEl(status, '本题限定门型，可参考表达式 ' + expr, 'bad');
          throw new Error('本题未开放 ' + Object.keys(needed).join('/') + '，请用限定门型自行搭建；参考式：' + expr);
        }
        var nodes = [], serial = 0, gateMemo = {}, astMemo = {};
        function keyOf(node) {
          if (node.v != null) return node.v;
          if (node.c != null) return '#' + node.c;
          return node.op + '(' + keyOf(node.a) + (node.b ? ',' + keyOf(node.b) : '') + ')';
        }
        function mk(type, args) {
          var k = type + ':' + args.join('|');
          if (gateMemo[k]) return gateMemo[k];
          var id = 'G' + (++serial);
          nodes.push({ id: id, type: type, args: args.slice() });
          gateMemo[k] = id;
          return id;
        }
        var rootSrc = null;
        if (canBasic) {
          (function basic(node) {
            if (node.v != null) { rootSrc = node.v; return; }
            if (node.c != null) throw new Error('参考解包含常量，无法自动搭建');
            var k = 'b' + keyOf(node);
            if (astMemo[k]) { rootSrc = astMemo[k]; return; }
            basic(node.a);
            var a = rootSrc;
            var b = null;
            if (node.b) { basic(node.b); b = rootSrc; }
            rootSrc = mk(GATE_OF[node.op], node.b ? [a, b] : [a]);
            astMemo[k] = rootSrc;
          })(ast);
        } else {
          var kind = allowed.indexOf('NAND') >= 0 ? 'NAND' : 'NOR';
          var notGate = function (x) { return mk(kind, [x, x]); };
          var bin = function (a, b) { return mk(kind, [a, b]); };
          var gen = function (node) {
            if (node.v != null) return node.v;
            if (node.c != null) throw new Error('参考解包含常量，无法自动搭建');
            var k = 'u' + keyOf(node);
            if (astMemo[k]) return astMemo[k];
            var res;
            if (kind === 'NAND') {
              if (node.op === '~') {
                if (node.a.op === '&') res = bin(gen(node.a.a), gen(node.a.b));
                else res = notGate(gen(node.a));
              } else if (node.op === '&') {
                var na = gen(node.a), nb = gen(node.b);
                res = notGate(bin(na, nb));
              } else if (node.op === '|') {
                if (node.a.op === '~') res = bin(gen(node.a.a), notGate(gen(node.b)));
                else if (node.b.op === '~') res = bin(notGate(gen(node.a)), gen(node.b.a));
                else res = bin(notGate(gen(node.a)), notGate(gen(node.b)));
              } else if (node.op === '^') {
                var x = gen(node.a), y = gen(node.b);
                var t1 = bin(x, y), t2 = bin(x, t1), t3 = bin(y, t1);
                res = bin(t2, t3);
              } else throw new Error('参考解含不支持的门');
            } else {
              if (node.op === '~') {
                if (node.a.op === '|') res = bin(gen(node.a.a), gen(node.a.b));
                else res = notGate(gen(node.a));
              } else if (node.op === '|') {
                var oa = gen(node.a), ob = gen(node.b);
                res = notGate(bin(oa, ob));
              } else if (node.op === '&') {
                if (node.a.op === '~') res = bin(gen(node.a.a), notGate(gen(node.b)));
                else if (node.b.op === '~') res = bin(notGate(gen(node.a)), gen(node.b.a));
                else res = bin(notGate(gen(node.a)), notGate(gen(node.b)));
              } else if (node.op === '^') {
                var p = gen(node.a), q = gen(node.b);
                var n1 = bin(p, q), n2 = bin(p, n1), n3 = bin(q, n1);
                res = bin(n2, n3);
              } else throw new Error('参考解含不支持的门');
            }
            astMemo[k] = res;
            return res;
          };
          rootSrc = gen(ast);
        }
        if (!rootSrc || inputs.indexOf(rootSrc) >= 0) throw new Error('参考表达式无需逻辑门');
        if (nodes.length > maxGates) throw new Error('参考电路需要 ' + nodes.length + ' 个门，超过上限 ' + maxGates + '；请尝试自行优化');
        // 计算每个门到输入的级数，再从输出端向左排布
        var lvlMemo = {};
        function lvl(id) {
          if (inputs.indexOf(id) >= 0) return 0;
          if (lvlMemo[id] != null) return lvlMemo[id];
          var n = nodes.filter(function (x) { return x.id === id; })[0];
          var v = 1;
          if (n) v = 1 + Math.max.apply(null, n.args.map(lvl));
          lvlMemo[id] = v;
          return v;
        }
        var maxLevel = 1;
        nodes.forEach(function (n) { n.level = lvl(n.id); if (n.level > maxLevel) maxLevel = n.level; });
        var byLevel = {};
        nodes.forEach(function (n) { (byLevel[n.level] = byLevel[n.level] || []).push(n); });
        var step = maxLevel > 3 ? Math.max(72, 380 / maxLevel) : 132;
        var rightX = 548;
        Object.keys(byLevel).forEach(function (lv) {
          var arr = byLevel[lv];
          arr.forEach(function (n, i) {
            n.x = Math.max(160, rightX - (maxLevel - Number(lv)) * step);
            n.y = arr.length === 1 ? 200 : 84 + i * (232 / Math.max(1, arr.length - 1));
          });
        });
        state.nodes = nodes;
        state.serial = serial;
        state.out = rootSrc;
        state.pending = null;
        draw();
        U.toast('已载入参考电路（' + nodes.length + ' 个门），可对照学习');
      } catch (e) {
        U.toast(e.message || '参考解载入失败');
      }
    }
    q('[data-a="ref"]', hostEl).addEventListener('click', buildRef);

    draw();
    return {
      check: function () {
        if (!state.out) return { ok: false, detail: '还没有连接输出端口' };
        if (state.nodes.length > maxGates) return { ok: false, detail: '使用 ' + state.nodes.length + ' 个门，超过上限 ' + maxGates };
        var fails = [], total = rows.length;
        for (var i = 0; i < rows.length; i++) {
          try {
            var ev = evaluate(i);
            if (ev.out !== rows[i][inputs.length]) {
              fails.push({ row: i, expected: rows[i][inputs.length], got: ev.out });
            }
          } catch (e) {
            return { ok: false, detail: e.message };
          }
        }
        if (fails.length) {
          var f = fails[0];
          return {
            ok: false,
            detail: (total - fails.length) + '/' + total + ' 行正确；例如 ' + inputs.map(function (_, k) { return inputs[k] + '=' + rows[f.row][k]; }).join(', ') + ' 时应为 ' + f.expected + '，实得 ' + f.got,
            fails: fails
          };
        }
        return { ok: true, detail: total + '/' + total + ' 行全部匹配，使用 ' + state.nodes.length + ' 个门' };
      },
      lock: function () { state.locked = true; lockButtons(hostEl); },
      reset: clearAll,
      reveal: buildRef
    };
  };

  function gateSymbol(type) {
    var bub = (type === 'NAND' || type === 'NOR' || type === 'XNOR' || type === 'NOT') ? '<circle cx="24" cy="10" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/>' : '';
    var shape;
    if (type === 'AND' || type === 'NAND') shape = '<path d="M3 3h8a7 7 0 0 1 0 14H3V3Z" fill="none" stroke="currentColor" stroke-width="1.4"/>';
    else if (type === 'OR' || type === 'NOR' || type === 'XOR' || type === 'XNOR') {
      shape = '<path d="M3 3c5 0 10 2.5 10 7s-5 7-10 7c3.4-2.2 5-7 5-7s-1.6-4.8-5-7Z" fill="none" stroke="currentColor" stroke-width="1.4"/>';
      if (type === 'XOR' || type === 'XNOR') shape += '<path d="M1 3c3.4 2.2 5 7 5 7s-1.6 4.8-5 7" fill="none" stroke="currentColor" stroke-width="1.2"/>';
    } else shape = '<path d="M3 2.5v15L18 10 3 2.5Z" fill="none" stroke="currentColor" stroke-width="1.4"/>';
    return '<svg viewBox="0 0 30 20" aria-hidden="true">' + shape + bub + '</svg>';
  }

  /* ================================================================
     2. HDL 实验
     ================================================================ */
  L.hdl = function (host, qq) {
    var lab = qq.lab;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab code-lab';
    var starter = lab.template || ('module mod_name(input logic ' + (lab.inputs || []).map(function (p) { return p.name; }).join(', ') + ',\n              output logic ' + (lab.outputs || []).map(function (p) { return p.name; }).join(', ') + ');\n  // 在这里编写\nendmodule');
    hostEl.innerHTML =
      '<div class="lab__bar">' +
        '<div class="lab__title">' + GI.icon('code', 15) + 'SystemVerilog 工作台 <em>' + (lab.tests || []).length + ' 组测试</em></div>' +
        '<div class="lab__actions">' +
          '<button type="button" class="lab-btn" data-a="template">' + GI.icon('refresh', 13) + '重置模板</button>' +
          '<button type="button" class="lab-btn" data-a="ref">' + GI.icon('bulb', 13) + '参考解</button>' +
          '<button type="button" class="lab-btn lab-btn--primary" data-a="run">' + GI.icon('play', 13) + '运行测试</button>' +
        '</div>' +
      '</div>' +
      '<div class="lab__body">' +
        '<div class="spec-chips">' +
          (lab.inputs || []).map(function (p) { return '<span class="spec-chip">in <b>' + esc(p.name) + '</b>[' + p.width + ']</span>'; }).join('') +
          (lab.outputs || []).map(function (p) { return '<span class="spec-chip">out <b>' + esc(p.name) + '</b>[' + p.width + ']</span>'; }).join('') +
        '</div>' +
        '<div class="editor"><div class="editor__gutter"></div><div class="editor__area"><textarea spellcheck="false" aria-label="SystemVerilog 代码"></textarea></div></div>' +
        '<div class="code-hintbar"><span>支持 assign / always_comb / if / case</span><span style="margin-left:auto">⌘ / Ctrl + Enter 运行</span></div>' +
        '<div class="lab-out"></div>' +
      '</div>';
    host.appendChild(hostEl);
    var ta = q('textarea', hostEl);
    var gutter = q('.editor__gutter', hostEl);
    var out = q('.lab-out', hostEl);
    var locked = false;
    ta.value = starter;
    function refreshGutter() {
      var n = ta.value.split('\n').length;
      var s = '';
      for (var i = 1; i <= n; i++) s += i + '\n';
      gutter.textContent = s;
      gutter.style.transform = 'translateY(' + (-ta.scrollTop) + 'px)';
      var h = Math.min(340, Math.max(150, n * 21 + 30));
      ta.style.height = h + 'px';
    }
    ta.addEventListener('input', refreshGutter);
    ta.addEventListener('scroll', refreshGutter);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
        refreshGutter();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });
    refreshGutter();

    function showResult(res) {
      if (res.error) {
        out.innerHTML = '<div class="lab-result lab-result--bad"><b>编译 / 运行错误</b><br>' + esc(res.error) + '</div>';
        return;
      }
      if (res.ok) {
        out.innerHTML = '<div class="lab-result lab-result--ok"><b>通过全部 ' + res.total + ' 组测试</b> · 模块 ' + esc(res.moduleName || 'module') + '</div>';
        return;
      }
      var fails = res.failures || [];
      var rowsHtml = fails.map(function (f) {
        var ins = Object.keys(f.in || {}).map(function (k) { return k + '=' + f.in[k]; }).join(' ');
        var exp = Object.keys(f.expected || {}).map(function (k) { return f.expected[k]; }).join(',');
        var got = Object.keys(f.got || {}).map(function (k) { return f.got[k]; }).join(',');
        return '<tr><td>' + esc(ins) + '</td><td class="good">' + esc(exp) + '</td><td class="bad">' + esc(got) + '</td></tr>';
      }).join('');
      out.innerHTML = '<div class="lab-result lab-result--bad"><b>通过 ' + (res.passed || 0) + ' / ' + res.total + ' 组</b>' +
        (rowsHtml ? '<table class="lab-table"><tr><th>输入</th><th>期望</th><th>实际</th></tr>' + rowsHtml + '</table>' : '') + '</div>';
    }
    function run() {
      if (locked) return { ok: false, detail: '已提交' };
      if (!window.HDL || typeof window.HDL.check !== 'function') {
        out.innerHTML = '<div class="lab-result lab-result--bad">判题引擎尚未加载</div>';
        return { ok: false, detail: '判题引擎尚未加载' };
      }
      var spec = { inputs: lab.inputs || [], outputs: lab.outputs || [], tests: lab.tests || [], moduleName: lab.moduleName };
      var res;
      try { res = window.HDL.check(ta.value, spec); }
      catch (e) { res = { ok: false, error: e.message, failures: [] }; }
      showResult(res || { ok: false, error: '未知错误' });
      return {
        ok: !!(res && res.ok),
        detail: res ? (res.error ? res.error : (res.ok ? '通过全部 ' + res.total + ' 组测试' : '通过 ' + (res.passed || 0) + '/' + res.total + ' 组')) : '运行失败'
      };
    }
    q('[data-a="run"]', hostEl).addEventListener('click', function () {
      var r = run();
      if (r.ok) U.toast('测试通过');
    });
    q('[data-a="template"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      ta.value = starter;
      refreshGutter();
      out.innerHTML = '';
    });
    q('[data-a="ref"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      if (!lab.solution) { U.toast('本题未提供参考解'); return; }
      ta.value = lab.solution;
      refreshGutter();
      out.innerHTML = '<div class="lab-result" style="border:1px solid var(--lab-line)">已填入参考解，运行测试看看。</div>';
    });
    return {
      check: run,
      lock: function () { locked = true; ta.readOnly = true; lockButtons(hostEl); },
      reset: function () { if (!locked) { ta.value = starter; refreshGutter(); out.innerHTML = ''; } },
      reveal: function () { if (!locked && lab.solution) { ta.value = lab.solution; refreshGutter(); } }
    };
  };

  /* ================================================================
     3. MIPS 实验
     ================================================================ */
  var REG_NAMES = ['zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'];
  L.mips = function (host, qq) {
    var lab = qq.lab;
    var init = lab.init || {};
    var expect = lab.expect || { regs: {}, memory: {} };
    var hostEl = document.createElement('div');
    hostEl.className = 'lab code-lab';
    var starter = lab.starter || '# 在这里写 MIPS 汇编（结果写入约定寄存器）\n';
    var initRegs = Object.keys(init.regs || {}).map(function (k) { return '<span>$' + esc(k) + ' = <b>' + esc(init.regs[k]) + '</b></span>'; }).join('');
    var initMem = Object.keys(init.memory || {}).map(function (k) { return '<span>@' + esc(k) + ' → <b>[' + (init.memory[k] || []).join(', ') + ']</b></span>'; }).join('');
    hostEl.innerHTML =
      '<div class="lab__bar">' +
        '<div class="lab__title">' + GI.icon('command', 15) + 'MIPS 汇编工作台 <em>解释执行</em></div>' +
        '<div class="lab__actions">' +
          '<button type="button" class="lab-btn" data-a="ref">' + GI.icon('bulb', 13) + '参考解</button>' +
          '<button type="button" class="lab-btn" data-a="run">' + GI.icon('play', 13) + '运行程序</button>' +
          '<button type="button" class="lab-btn lab-btn--primary" data-a="check">' + GI.icon('check', 13) + '检查结果</button>' +
        '</div>' +
      '</div>' +
      '<div class="lab__body">' +
        '<div class="mips-init">' + (initRegs || '<span>所有寄存器初值为 0</span>') + initMem + '</div>' +
        '<div class="editor"><div class="editor__gutter"></div><div class="editor__area"><textarea spellcheck="false" aria-label="MIPS 汇编代码"></textarea></div></div>' +
        '<div class="code-hintbar"><span>支持 add / lw / sw / beq / j / jal / li 等指令</span><span style="margin-left:auto">⌘ / Ctrl + Enter 运行</span></div>' +
        '<div class="lab-out"></div>' +
      '</div>';
    host.appendChild(hostEl);
    var ta = q('textarea', hostEl);
    var gutter = q('.editor__gutter', hostEl);
    var out = q('.lab-out', hostEl);
    var locked = false;
    ta.value = starter;
    function refreshGutter() {
      var n = ta.value.split('\n').length, s = '';
      for (var i = 1; i <= n; i++) s += i + '\n';
      gutter.textContent = s;
      gutter.style.transform = 'translateY(' + (-ta.scrollTop) + 'px)';
      var h = Math.min(340, Math.max(150, n * 21 + 30));
      ta.style.height = h + 'px';
    }
    ta.addEventListener('input', refreshGutter);
    ta.addEventListener('scroll', refreshGutter);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
        refreshGutter();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });
    refreshGutter();

    function execute() {
      if (!window.MIPS || typeof window.MIPS.run !== 'function') return { ok: false, error: '判题引擎尚未加载' };
      try {
        var cfg = JSON.parse(JSON.stringify(init));
        if (lab.maxSteps) cfg.maxSteps = lab.maxSteps;
        return window.MIPS.run(ta.value, cfg);
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }
    function readMem(res, addr) {
      var m = res.mem || {};
      return Number(m[String(addr)] || 0);
    }
    function showRun(res, checked) {
      if (!res || !res.ok) {
        out.innerHTML = '<div class="lab-result lab-result--bad"><b>运行失败</b><br>' + esc((res && res.error) || '未知错误') + '</div>';
        return;
      }
      var names = Object.keys(expect.regs || {});
      if (!names.length) names = ['v0', 't0', 'a0', 'a1'];
      var chips = names.map(function (k) {
        return '<span class="is-target">$' + esc(k) + ' <b>' + esc(res.regs ? res.regs[k] : 0) + '</b></span>';
      }).join('');
      var extra = ['t0', 't1', 't2', 's0', 's1'].filter(function (k) { return names.indexOf(k) < 0; }).map(function (k) {
        return '<span>$' + k + ' <b>' + (res.regs ? res.regs[k] : 0) + '</b></span>';
      }).join('');
      var mems = Object.keys(expect.memory || {}).map(function (a) {
        return '<span>@' + esc(a) + ' <b>' + readMem(res, Number(a)) + '</b></span>';
      }).join('');
      out.innerHTML = '<div class="lab-result ' + (checked ? 'lab-result--ok' : '') + '" style="border:1px solid var(--lab-line)"><b>' +
        (checked ? '结果与预期一致' : '程序执行完成') + '</b> · ' + (res.steps || 0) + ' 步' +
        '<div class="mips-regs" style="padding:10px 0 0;grid-template-columns:repeat(auto-fill,minmax(96px,1fr))">' + chips + extra + mems + '</div>' +
        (res.output ? '<div style="margin-top:8px">输出：' + esc(res.output) + '</div>' : '') + '</div>';
    }
    function run() {
      if (locked) return { ok: false, detail: '已提交' };
      var res = execute();
      showRun(res, false);
      return res;
    }
    function check() {
      if (locked) return { ok: false, detail: '已提交' };
      var res = execute();
      if (!res || !res.ok) {
        showRun(res, false);
        return { ok: false, detail: (res && res.error) || '程序运行失败' };
      }
      var fails = [];
      Object.keys(expect.regs || {}).forEach(function (k) {
        var want = expect.regs[k];
        var got = res.regs ? res.regs[k] : undefined;
        if (Number(got) !== Number(want)) fails.push('$' + k + ' 期望 ' + want + '，实得 ' + got);
      });
      Object.keys(expect.memory || {}).forEach(function (a) {
        (expect.memory[a] || []).forEach(function (v, i) {
          var got = readMem(res, Number(a) + 4 * i);
          if (got !== v) fails.push('内存 ' + (Number(a) + 4 * i) + ' 期望 ' + v + '，实得 ' + got);
        });
      });
      showRun(res, fails.length === 0);
      if (fails.length) return { ok: false, detail: fails.slice(0, 2).join('；') };
      return { ok: true, detail: '寄存器与内存均与预期一致（' + (res.steps || 0) + ' 步）' };
    }
    q('[data-a="run"]', hostEl).addEventListener('click', run);
    q('[data-a="check"]', hostEl).addEventListener('click', check);
    q('[data-a="ref"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      if (!lab.solution) { U.toast('本题未提供参考解'); return; }
      ta.value = lab.solution;
      refreshGutter();
      out.innerHTML = '<div class="lab-result" style="border:1px solid var(--lab-line)">已填入参考解，运行看看。</div>';
    });
    return {
      check: check,
      lock: function () { locked = true; ta.readOnly = true; lockButtons(hostEl); },
      reset: function () { if (!locked) { ta.value = starter; refreshGutter(); out.innerHTML = ''; } },
      reveal: function () { if (!locked && lab.solution) { ta.value = lab.solution; refreshGutter(); } }
    };
  };

  /* ================================================================
     4. 卡诺图
     ================================================================ */
  var GROUP_COLORS = ['#3E63DD', '#D1495B', '#7B61D9', '#0E9384', '#C07A00', '#C13B87', '#5F7D00', '#2E8B57'];
  function kmapCellPos(m, n) {
    if (n === 3) return [((m >> 2) & 1), (m & 3)];
    return [((m >> 2) & 3), (m & 3)];
  }
  function kmapLegal(cells, n) {
    if (!cells.length || (cells.length & (cells.length - 1))) return false;
    var GRAY = [0, 1, 3, 2];
    var positions = cells.map(function (m) { return kmapCellPos(m, n); });
    var rows = Array.from(new Set(positions.map(function (p) { return p[0]; })));
    var cols = Array.from(new Set(positions.map(function (p) { return p[1]; })));
    if (rows.length * cols.length !== cells.length) return false;
    function cyclic(arr) {
      if (arr.length === 1 || arr.length === GRAY.length) return true;
      if (!arr.length) return false;
      var pos = arr.map(function (v) { return GRAY.indexOf(v); }).sort(function (a, b) { return a - b; });
      var gaps = 0;
      for (var i = 0; i < pos.length; i++) {
        var gap = (pos[(i + 1) % pos.length] - pos[i] + GRAY.length) % GRAY.length;
        if (gap <= 0) return false;
        if (gap > 1) gaps++;
      }
      return gaps === 1;
    }
    return cyclic(rows) && cyclic(cols);
  }
  L.kmap = function (host, qq) {
    var lab = qq.lab;
    var n = (lab.vars || []).length;
    var vars = lab.vars || ['A', 'B', 'C'];
    var GRAY_LABEL = [0, 1, 3, 2];
    var ones = lab.ones || [], xs = lab.dontcares || [];
    var GRID = [0, 1, 3, 2];
    var rowsCount = n === 3 ? 2 : 4;
    var colsCount = 4;
    var selected = [], groups = [], locked = false;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab lab--paper';
    hostEl.innerHTML =
      '<div class="lab__bar">' +
        '<div class="lab__title">' + GI.icon('grid', 15) + '卡诺图工作台 <em>点击格点选择，再「成组」</em></div>' +
        '<div class="lab__actions">' +
          '<button type="button" class="lab-btn" data-a="clear">清除选择</button>' +
          '<button type="button" class="lab-btn lab-btn--primary" data-a="group">成组</button>' +
        '</div>' +
      '</div>' +
      '<div class="lab__body"><div class="kmap">' +
        '<div class="kmap-grid-wrap"><div class="kmap-grid" style="--cols:' + colsCount + '"></div><div class="kmap-actions" style="margin-top:12px">' +
          '<button type="button" class="lab-btn" data-a="check">' + GI.icon('check', 13) + '检查圈组</button>' +
          '<button type="button" class="lab-btn" data-a="ref">' + GI.icon('bulb', 13) + '参考圈法</button>' +
          '<span class="lab-status"><i></i>已选 0 格</span>' +
        '</div></div>' +
        '<div class="kmap-side">' +
          '<div class="kmap-side__block"><h5>已圈组</h5><div class="group-chips"></div></div>' +
          '<div class="kmap-side__block"><h5>化简结果</h5><div class="kmap-expression">—</div></div>' +
          '<div class="kmap-side__block"><h5>图例</h5><div class="kmap-legend">' +
            '<span><i style="background:color-mix(in oklab,var(--p) 22%,transparent);border:1px solid var(--p)"></i>1（必要覆盖）</span>' +
            '<span><i style="background:var(--bg);border:1px dashed var(--line)"></i>X（无关项）</span>' +
            '<span><i style="background:var(--p)"></i>当前选择</span>' +
          '</div></div>' +
        '</div>' +
      '</div></div>' +
      '<div class="lab__foot">' + GI.icon('info', 14) + '组必须是 2 的幂大小的矩形，可跨越边界；必须覆盖所有 1，且不能覆盖 0。</div>';
    host.appendChild(hostEl);
    var grid = q('.kmap-grid', hostEl), status = q('.lab-status', hostEl);
    function rowBits(r) { return n === 3 ? [(r >> 1) & 1, r & 1] : [(r >> 1) & 1, r & 1]; }
    function labelOf(bits) { return bits.join(''); }
    function minterm(r, c) {
      if (n === 3) return (GRID[r] << 2) | GRID[c];
      return (GRID[r] << 2) | GRID[c];
    }
    function cellValue(m) {
      if (ones.indexOf(m) >= 0) return '1';
      if (xs.indexOf(m) >= 0) return 'X';
      return '0';
    }
    function render() {
      function bitsOfPos(p) {
        var g = GRAY_LABEL[p];
        return g.toString(2).padStart(2, '0').split('');
      }
      var html = '<div class="kmap-corner">' + (n === 3 ? 'A\\BC' : 'AB\\CD') + '</div>';
      for (var c = 0; c < colsCount; c++) html += '<div class="kmap-head"><b>' + bitsOfPos(c).join('') + '</b></div>';
      for (var r = 0; r < rowsCount; r++) {
        var rl = n === 3 ? String(GRAY_LABEL[r]) : bitsOfPos(r).join('');
        html += '<div class="kmap-head"><b>' + rl + '</b></div>';
        for (var cc = 0; cc < colsCount; cc++) {
          var m = minterm(r, cc), v = cellValue(m);
          var cls = 'kmap-cell' + (v === '1' ? ' kmap-cell--one' : v === 'X' ? ' kmap-cell--x' : ' kmap-cell--zero') + (selected.indexOf(m) >= 0 ? ' is-selected' : '');
          var dots = '';
          groups.forEach(function (g, gi) {
            if (g.cells.indexOf(m) >= 0) dots += '<i style="background:' + GROUP_COLORS[gi % GROUP_COLORS.length] + '"></i>';
          });
          html += '<button type="button" class="' + cls + '" data-m="' + m + '"><span class="kmap-cell__idx">m' + m + '</span>' + v +
            '<span class="kmap-cell__groups">' + dots + '</span></button>';
        }
      }
      grid.innerHTML = html;
      qa('.kmap-cell', grid).forEach(function (cell) {
        cell.addEventListener('click', function () {
          if (locked) return;
          var m = Number(cell.dataset.m);
          var i = selected.indexOf(m);
          if (i >= 0) selected.splice(i, 1); else selected.push(m);
          render();
          updateStatus();
        });
      });
      var chips = q('.group-chips', hostEl);
      chips.innerHTML = groups.length ? groups.map(function (g, gi) {
        return '<span class="group-chip"><i style="background:' + GROUP_COLORS[gi % GROUP_COLORS.length] + '"></i>' + g.cells.map(function (x) { return 'm' + x; }).join(',') +
          '<button type="button" data-del-group="' + gi + '" aria-label="删除组">×</button></span>';
      }).join('') : '<span style="font-size:10px;color:var(--on-bg-var)">还没有圈组</span>';
      qa('[data-del-group]', chips).forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked) return;
          groups.splice(Number(b.dataset.delGroup), 1);
          render(); updateExpr();
        });
      });
      updateExpr();
    }
    function updateStatus() {
      statusEl(status, '已选 ' + selected.length + ' 格' + (selected.length ? '（' + selected.map(function (m) { return 'm' + m; }).join(' ') + '）' : ''), '');
    }
    function termOf(cells) {
      var bitsList = cells.map(function (m) {
        if (n === 3) return [(m >> 2) & 1, (m >> 1) & 1, m & 1];
        return [(m >> 3) & 1, (m >> 2) & 1, (m >> 1) & 1, m & 1];
      });
      var term = [];
      for (var v = 0; v < n; v++) {
        var val = bitsList[0][v], same = bitsList.every(function (b) { return b[v] === val; });
        if (same) term.push(val ? esc(vars[v]) : '<span class="ovl">' + esc(vars[v]) + '</span>');
      }
      return term.length ? term.join('·') : '1';
    }
    function updateExpr() {
      var exp = q('.kmap-expression', hostEl);
      exp.innerHTML = groups.length ? groups.map(function (g) { return termOf(g.cells); }).join(' + ') : '—';
    }
    q('[data-a="clear"]', hostEl).addEventListener('click', function () { if (locked) return; selected = []; render(); updateStatus(); });
    q('[data-a="group"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      if (!selected.length) { U.toast('先点击格子选择一组'); return; }
      if (!kmapLegal(selected, n)) { U.toast('这组格子不是合法矩形，检查是否成 2 的幂且相邻'); return; }
      groups.push({ cells: selected.slice() });
      selected = [];
      render(); updateStatus();
    });
    q('[data-a="ref"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      if (!lab.groups) return;
      groups = lab.groups.map(function (g) { return { cells: g.slice() }; });
      selected = [];
      render(); updateStatus();
      U.toast('已载入参考圈法');
    });
    function check() {
      if (!groups.length) return { ok: false, detail: '还没有圈出任何组' };
      var covered = {}, bad = null;
      groups.forEach(function (g) {
        if (!kmapLegal(g.cells, n)) bad = '存在非法矩形';
        g.cells.forEach(function (m) {
          if (ones.indexOf(m) < 0 && xs.indexOf(m) < 0 && bad == null) bad = 'm' + m + ' 是 0，不能被覆盖';
          covered[m] = 1;
        });
      });
      if (bad) return { ok: false, detail: bad };
      var miss = ones.filter(function (m) { return !covered[m]; });
      if (miss.length) return { ok: false, detail: '还有 1 未覆盖：' + miss.map(function (m) { return 'm' + m; }).join('、') };
      var refCount = (lab.groups || []).length;
      if (refCount && groups.length > refCount) return { ok: false, detail: '覆盖正确，但不是最简：用了 ' + groups.length + ' 组，最少 ' + refCount + ' 组' };
      return { ok: true, detail: '覆盖完整，' + groups.length + ' 组，化简式：' + groups.map(function (g) { return termOf(g.cells); }).join(' + ').replace(/<[^>]+>/g, '') };
    }
    q('[data-a="check"]', hostEl).addEventListener('click', function () {
      var r = check();
      statusEl(status, r.ok ? '✓ ' + r.detail : '✗ ' + r.detail, r.ok ? 'ok' : 'bad');
      if (!r.ok) U.toast(r.detail);
    });
    render();
    return {
      check: check,
      lock: function () { locked = true; lockButtons(hostEl); },
      reset: function () { if (!locked) { selected = []; groups = []; render(); updateStatus(); } },
      reveal: function () {
        if (locked || !lab.groups) return;
        groups = lab.groups.map(function (g) { return { cells: g.slice() }; });
        selected = []; render(); updateStatus();
      }
    };
  };

  /* ================================================================
     5. 时序波形
     ================================================================ */
  L.wave = function (host, qq) {
    var lab = qq.lab;
    var rows = (lab.rows || []).map(function (r) { return { name: r.name, cells: r.cells.slice(), fixed: !!r.fixed }; });
    var solution = lab.solution || {};
    var n = rows[0] ? rows[0].cells.length : 8;
    var locked = false;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab';
    hostEl.innerHTML =
      '<div class="lab__bar">' +
        '<div class="lab__title">' + GI.icon('chart', 15) + '时序波形工作台 <em>点击 / 拖动编辑高亮行</em></div>' +
        '<div class="lab__actions">' +
          '<button type="button" class="lab-btn" data-a="clear">清零</button>' +
          '<button type="button" class="lab-btn" data-a="ref">' + GI.icon('bulb', 13) + '参考答案</button>' +
        '</div>' +
      '</div>' +
      '<div class="lab__body"><div class="wave"><div class="wave-rows"></div></div>' +
        '<div class="wave-actions"><button type="button" class="lab-btn lab-btn--primary" data-a="check">' + GI.icon('check', 13) + '检查波形</button>' +
        '<span class="lab-status"><i></i>可编辑：' + rows.filter(function (r) { return !r.fixed; }).map(function (r) { return r.name; }).join('、') + '</span></div>' +
      '</div>' +
      '<div class="lab__foot">' + GI.icon('info', 14) + (lab.note || '在时间片内切换电平，画出正确的时序。') + '</div>';
    host.appendChild(hostEl);
    var wrap = q('.wave-rows', hostEl), status = q('.lab-status', hostEl);
    var painting = false, paintVal = null;
    function pathFor(cells) {
      var hi = 1.7, lo = 8.3;
      var y = function (v) { return v ? hi : lo; };
      var d = 'M0 ' + y(cells[0]);
      for (var i = 1; i < cells.length; i++) d += ' H' + i + ' V' + y(cells[i]);
      d += ' H' + cells.length;
      return d;
    }
    function render() {
      wrap.innerHTML = rows.map(function (r, ri) {
        var cls = 'wave-row' + (r.fixed ? '' : ' is-editable');
        var cells = r.cells.map(function (v, i) {
          return '<div class="wave-cell" data-ri="' + ri + '" data-i="' + i + '" data-val="' + v + '"></div>';
        }).join('');
        return '<div class="' + cls + '" data-row="' + ri + '">' +
          '<div class="wave-row__name">' + esc(r.name) + '<small>' + (r.fixed ? '输入' : '编辑') + '</small></div>' +
          '<div class="wave-row__cells" style="--n:' + n + '">' +
            '<svg class="wave-svg" viewBox="0 0 ' + n + ' 10" preserveAspectRatio="none" aria-hidden="true">' +
              '<path vector-effect="non-scaling-stroke" class="sig ' + (r.fixed ? 'sig--fixed' : 'sig--user') + '" d="' + pathFor(r.cells) + '"/></svg>' +
            '<div class="wave-cells-overlay" style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(' + n + ',1fr)">' + cells + '</div>' +
          '</div></div>';
      }).join('');
    }
    wrap.addEventListener('pointerdown', function (e) {
      if (locked) return;
      var cell = e.target.closest('.wave-cell');
      if (!cell) return;
      var r = rows[Number(cell.dataset.ri)];
      if (!r || r.fixed) return;
      e.preventDefault();
      painting = true;
      paintVal = r.cells[Number(cell.dataset.i)] ? 0 : 1;
      r.cells[Number(cell.dataset.i)] = paintVal;
      render();
    });
    wrap.addEventListener('pointerover', function (e) {
      if (!painting || locked) return;
      var cell = e.target.closest('.wave-cell');
      if (!cell) return;
      var r = rows[Number(cell.dataset.ri)];
      if (!r || r.fixed) return;
      r.cells[Number(cell.dataset.i)] = paintVal;
      render();
    });
    document.addEventListener('pointerup', function () { painting = false; }, { once: false });
    q('[data-a="clear"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      rows.forEach(function (r) { if (!r.fixed) r.cells = r.cells.map(function () { return 0; }); });
      render();
    });
    q('[data-a="ref"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      rows.forEach(function (r) { if (!r.fixed && solution[r.name]) r.cells = solution[r.name].slice(); });
      render();
      U.toast('已填入参考答案波形');
    });
    function check() {
      var fails = [];
      rows.forEach(function (r) {
        if (r.fixed || !solution[r.name]) return;
        if (r.cells.join('') !== solution[r.name].join('')) fails.push(r.name);
      });
      if (fails.length) return { ok: false, detail: fails.length + ' 行波形不正确：' + fails.join('、') };
      return { ok: true, detail: '所有输出波形正确' };
    }
    q('[data-a="check"]', hostEl).addEventListener('click', function () {
      var r = check();
      statusEl(status, r.ok ? '✓ ' + r.detail : '✗ ' + r.detail, r.ok ? 'ok' : 'bad');
    });
    render();
    return {
      check: check,
      lock: function () { locked = true; painting = false; lockButtons(hostEl); },
      reset: function () { if (!locked) { rows.forEach(function (r) { if (!r.fixed) r.cells = r.cells.map(function () { return 0; }); }); render(); } },
      reveal: function () { if (!locked) { rows.forEach(function (r) { if (!r.fixed && solution[r.name]) r.cells = solution[r.name].slice(); }); render(); } }
    };
  };

  /* ================================================================
     6. 排序
     ================================================================ */
  L.order = function (host, qq) {
    var items = (qq.lab.items || []).slice();
    var order = seeded(qq.id, items.map(function (_, i) { return i; }));
    // 保证初始顺序不等于正确顺序（长度 > 1）
    if (order.every(function (v, i) { return v === i; })) order = order.slice().reverse();
    var locked = false;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab lab--paper';
    hostEl.innerHTML =
      '<div class="lab__bar"><div class="lab__title">' + GI.icon('route', 15) + '顺序工作台 <em>拖动条目调整顺序</em></div>' +
        '<div class="lab__actions"><button type="button" class="lab-btn" data-a="check">' + GI.icon('check', 13) + '检查顺序</button></div></div>' +
      '<div class="lab__body"><div class="order-list"></div>' +
        '<div class="order-note">' + GI.icon('info', 13) + (qq.lab.prompt || '按正确顺序排列。也可用右侧箭头按钮微调。') + '</div></div>';
    host.appendChild(hostEl);
    var list = q('.order-list', hostEl);
    var dragFrom = null;
    function render() {
      list.innerHTML = order.map(function (idx, pos) {
        return '<div class="order-item" draggable="' + (!locked) + '" data-pos="' + pos + '">' +
          '<span class="order-item__handle">' + GI.icon('grip', 15) + '</span>' +
          '<span class="order-item__idx">' + (pos + 1) + '</span>' +
          '<span class="order-item__text">' + items[idx] + '</span>' +
          '<span class="order-item__move">' +
            '<button type="button" data-up="' + pos + '" aria-label="上移"' + (pos === 0 ? ' disabled' : '') + '>' + GI.icon('chevronDown', 13) + '</button>' +
            '<button type="button" data-down="' + pos + '" aria-label="下移"' + (pos === order.length - 1 ? ' disabled' : '') + '>' + GI.icon('chevronRight', 13) + '</button>' +
          '</span></div>';
      }).join('');
      qa('.order-item', list).forEach(function (el) {
        el.addEventListener('dragstart', function (e) {
          if (locked) { e.preventDefault(); return; }
          dragFrom = Number(el.dataset.pos);
          el.classList.add('is-dragging');
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', String(dragFrom)); } catch (err) { }
        });
        el.addEventListener('dragend', function () { el.classList.remove('is-dragging'); });
        el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('is-over'); });
        el.addEventListener('dragleave', function () { el.classList.remove('is-over'); });
        el.addEventListener('drop', function (e) {
          e.preventDefault();
          el.classList.remove('is-over');
          if (locked || dragFrom == null) return;
          var to = Number(el.dataset.pos);
          var moved = order.splice(dragFrom, 1)[0];
          order.splice(to, 0, moved);
          dragFrom = null;
          render();
        });
      });
      qa('[data-up]', list).forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked) return;
          var p = Number(b.dataset.up);
          if (p > 0) { var t = order[p - 1]; order[p - 1] = order[p]; order[p] = t; render(); }
        });
      });
      qa('[data-down]', list).forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked) return;
          var p = Number(b.dataset.down);
          if (p < order.length - 1) { var t = order[p + 1]; order[p + 1] = order[p]; order[p] = t; render(); }
        });
      });
    }
    function check() {
      var wrong = [];
      order.forEach(function (v, i) { if (v !== i) wrong.push(i + 1); });
      if (!wrong.length) return { ok: true, detail: '顺序完全正确' };
      return { ok: false, detail: '第 ' + wrong.join('、') + ' 位顺序不对' };
    }
    q('[data-a="check"]', hostEl).addEventListener('click', function () {
      var r = check();
      U.toast(r.ok ? '✓ ' + r.detail : '✗ ' + r.detail);
    });
    render();
    return {
      check: check,
      lock: function () { locked = true; qa('.order-item', list).forEach(function (el) { el.draggable = false; }); lockButtons(hostEl); },
      reset: function () { if (!locked) { order = seeded(qq.id + '-reset', items.map(function (_, i) { return i; })); render(); } },
      reveal: function () {
        if (locked) return;
        order = items.map(function (_, i) { return i; });
        render();
      }
    };
  };

  /* ================================================================
     7. 配对
     ================================================================ */
  L.match = function (host, qq) {
    var pairs = qq.lab.pairs || [];
    var terms = pairs.map(function (p) { return p[0]; });
    var defs = pairs.map(function (p) { return p[1]; });
    var shuffled = seeded(qq.id, defs.map(function (_, i) { return i; }));
    var map = {}; // left idx -> right original idx
    var selected = null, locked = false;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab lab--paper';
    hostEl.innerHTML =
      '<div class="lab__bar"><div class="lab__title">' + GI.icon('layers', 15) + '配对工作台 <em>拖动右侧定义到左侧术语</em></div>' +
        '<div class="lab__actions"><button type="button" class="lab-btn" data-a="clear">清空</button>' +
        '<button type="button" class="lab-btn" data-a="check">' + GI.icon('check', 13) + '检查配对</button></div></div>' +
      '<div class="lab__body"><div class="match-grid">' +
        '<div class="match-col"><h5>术语</h5><div class="match-slots"></div></div>' +
        '<div class="match-col"><h5>定义</h5><div class="match-pool"></div></div>' +
      '</div><div class="order-note">' + GI.icon('info', 13) + '也可以先点选定义，再点击术语槽位完成配对。</div></div>';
    host.appendChild(hostEl);
    var slots = q('.match-slots', hostEl), pool = q('.match-pool', hostEl);
    function definitionOf(ri) { return defs[ri]; }
    function render() {
      var used = Object.keys(map).map(function (k) { return map[k]; });
      slots.innerHTML = terms.map(function (t, li) {
        var ri = map[li];
        return '<div class="match-slot" data-li="' + li + '">' +
          '<div class="match-slot__term">' + t + '</div>' +
          '<div class="match-slot__drop">' + (ri == null ? '<span>拖到这里</span>' :
            '<span class="match-slot__chip">' + definitionOf(ri) + '<button type="button" data-unpair="' + li + '" aria-label="取消配对">' + GI.icon('x', 11) + '</button></span>') +
          '</div></div>';
      }).join('');
      pool.innerHTML = shuffled.filter(function (ri) { return used.indexOf(ri) < 0; }).map(function (ri) {
        return '<button type="button" class="match-chip' + (selected === ri ? ' is-selected' : '') + '" draggable="' + (!locked) + '" data-ri="' + ri + '">' + definitionOf(ri) + '</button>';
      }).join('') || '<div class="match-empty">所有定义都已放置</div>';
      qa('.match-slot', slots).forEach(function (el) {
        el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('is-over'); });
        el.addEventListener('dragleave', function () { el.classList.remove('is-over'); });
        el.addEventListener('drop', function (e) {
          e.preventDefault(); el.classList.remove('is-over');
          if (locked) return;
          var ri = Number(e.dataTransfer.getData('text/plain'));
          if (isNaN(ri)) return;
          assign(Number(el.dataset.li), ri);
        });
        el.addEventListener('click', function (e) {
          if (locked || e.target.closest('[data-unpair]')) return;
          if (selected != null) assign(Number(el.dataset.li), selected);
        });
      });
      qa('[data-unpair]', slots).forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (locked) return;
          delete map[Number(b.dataset.unpair)];
          selected = null;
          render();
        });
      });
      qa('.match-chip', pool).forEach(function (el) {
        el.addEventListener('dragstart', function (e) {
          if (locked) { e.preventDefault(); return; }
          e.dataTransfer.setData('text/plain', el.dataset.ri);
          selected = Number(el.dataset.ri);
        });
        el.addEventListener('click', function () {
          if (locked) return;
          var ri = Number(el.dataset.ri);
          selected = selected === ri ? null : ri;
          render();
        });
      });
    }
    function assign(li, ri) {
      Object.keys(map).forEach(function (k) { if (map[k] === ri) delete map[k]; });
      map[li] = ri;
      selected = null;
      render();
    }
    function check() {
      var missing = terms.filter(function (_, i) { return map[i] == null; });
      if (missing.length) return { ok: false, detail: '还有 ' + missing.length + ' 个术语未配对' };
      var wrong = [];
      Object.keys(map).forEach(function (k) { if (Number(map[k]) !== Number(k)) wrong.push(terms[k]); });
      if (wrong.length) return { ok: false, detail: wrong.length + ' 组配对错误：' + wrong.slice(0, 2).join('、') };
      return { ok: true, detail: '全部配对正确' };
    }
    q('[data-a="clear"]', hostEl).addEventListener('click', function () { if (locked) return; map = {}; selected = null; render(); });
    q('[data-a="check"]', hostEl).addEventListener('click', function () {
      var r = check(); U.toast(r.ok ? '✓ ' + r.detail : '✗ ' + r.detail);
      qa('.match-slot', slots).forEach(function (el, i) {
        el.classList.remove('is-correct', 'is-wrong');
        if (map[i] == null) return;
        el.classList.add(Number(map[i]) === i ? 'is-correct' : 'is-wrong');
      });
    });
    render();
    return {
      check: check,
      lock: function () { locked = true; render(); lockButtons(hostEl); },
      reset: function () { if (!locked) { map = {}; selected = null; render(); } },
      reveal: function () {
        if (locked) return;
        map = {}; terms.forEach(function (_, i) { map[i] = i; }); selected = null; render();
      }
    };
  };

  /* ================================================================
     8. 位开关
     ================================================================ */
  L.bin = function (host, qq) {
    var lab = qq.lab;
    var n = lab.bits;
    var bits = new Array(n).fill(0);
    var locked = false;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab lab--paper';
    hostEl.innerHTML =
      '<div class="lab__bar"><div class="lab__title">' + GI.icon('grid', 15) + '位开关 <em>点击翻转，凑出目标值</em></div>' +
        '<div class="lab__actions"><button type="button" class="lab-btn" data-a="clear">清零</button>' +
        '<button type="button" class="lab-btn" data-a="check">' + GI.icon('check', 13) + '检查</button></div></div>' +
      '<div class="lab__body"><div class="bin-lab"><div class="bin-target">目标：<b>' + esc(String(lab.value)) + '</b>（' + (lab.signed ? n + ' 位补码' : n + ' 位无符号数') + '）</div>' +
        '<div class="bin-bits"></div>' +
        '<div class="bin-readout"></div>' +
        '<div class="bin-actions"><span class="lab-status"><i></i>点击位按钮切换</span></div></div></div>';
    host.appendChild(hostEl);
    var bitsEl = q('.bin-bits', hostEl), readEl = q('.bin-readout', hostEl), status = q('.lab-status', hostEl);
    function unsignedVal() {
      return bits.reduce(function (a, b) { return (a << 1) | b; }, 0);
    }
    function signedVal() {
      var v = unsignedVal();
      return bits[0] ? v - Math.pow(2, n) : v;
    }
    function render() {
      bitsEl.innerHTML = bits.map(function (b, i) {
        var w = n - 1 - i;
        return '<button type="button" class="bit' + (b ? ' is-on' : '') + '" data-i="' + i + '" aria-label="第 ' + w + ' 位">' +
          '<b>' + b + '</b><span>2^' + w + '</span></button>';
      }).join('');
      var v = lab.signed ? signedVal() : unsignedVal();
      readEl.innerHTML = '<div><span>解释值</span><b>' + v + '</b></div>' +
        '<div><span>无符号</span><b>' + unsignedVal() + '</b></div>' +
        '<div><span>十六进制</span><b>0x' + unsignedVal().toString(16).toUpperCase().padStart(Math.ceil(n / 4), '0') + '</b></div>';
      qa('.bit', bitsEl).forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked) return;
          bits[Number(b.dataset.i)] ^= 1;
          render();
        });
      });
    }
    q('[data-a="clear"]', hostEl).addEventListener('click', function () { if (!locked) { bits = new Array(n).fill(0); render(); } });
    function check() {
      var v = lab.signed ? signedVal() : unsignedVal();
      if (v !== lab.value) return { ok: false, detail: '当前解释值为 ' + v + '，目标是 ' + lab.value };
      return { ok: true, detail: '位模式正确：' + (lab.signed ? signedVal() : unsignedVal()) };
    }
    q('[data-a="check"]', hostEl).addEventListener('click', function () {
      var r = check(); statusEl(status, r.ok ? '✓ ' + r.detail : '✗ ' + r.detail, r.ok ? 'ok' : 'bad');
    });
    render();
    return {
      check: check,
      lock: function () { locked = true; lockButtons(hostEl); },
      reset: function () { if (!locked) { bits = new Array(n).fill(0); render(); } },
      reveal: function () {
        if (locked) return;
        var u = lab.signed && lab.value < 0 ? lab.value + Math.pow(2, n) : lab.value;
        bits = u.toString(2).padStart(n, '0').split('').map(Number);
        render();
      }
    };
  };

  /* ================================================================
     9. 位域编码
     ================================================================ */
  var REG_OPTS = REG_NAMES.map(function (r) { return '$' + r; });
  function parseField(raw, field) {
    var s = String(raw == null ? '' : raw).trim();
    if (field.type === 'reg') {
      var name = s.replace(/^\$/, '').toLowerCase();
      if (REG_NAMES.indexOf(name) < 0) throw new Error('未知寄存器 ' + s);
      return REG_NAMES.indexOf(name);
    }
    if (/^0x[0-9a-f]+$/i.test(s)) return parseInt(s.slice(2), 16);
    if (/^0b[01]+$/i.test(s)) return parseInt(s.slice(2), 2);
    if (/^[01]+$/.test(s) && s.length === field.width) return parseInt(s, 2);
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    throw new Error('字段 ' + field.name + ' 的值无法识别');
  }
  L.fields = function (host, qq) {
    var lab = qq.lab;
    var fields = lab.fields || [];
    var values = fields.map(function () { return ''; });
    var locked = false;
    var hostEl = document.createElement('div');
    hostEl.className = 'lab lab--paper';
    hostEl.innerHTML =
      '<div class="lab__bar"><div class="lab__title">' + GI.icon('cpu', 15) + '位域编码台' +
        (lab.instruction ? ' <em>' + esc(lab.instruction) + '</em>' : '') + '</div>' +
        '<div class="lab__actions"><button type="button" class="lab-btn" data-a="ref">' + GI.icon('bulb', 13) + '填入参考值</button>' +
        '<button type="button" class="lab-btn" data-a="check">' + GI.icon('check', 13) + '检查编码</button></div></div>' +
      '<div class="lab__body"><div class="fields-lab"><div class="bitbar"></div><div class="field-rows"></div>' +
        '<div class="fields-out"><div><span>编码结果</span><br><b class="hexout">—</b></div><div style="text-align:right"><span>二进制</span><br><small class="binout">—</small></div></div>' +
        '<div><span class="lab-status"><i></i>按字段宽度填写</span></div></div></div>';
    host.appendChild(hostEl);
    var bar = q('.bitbar', hostEl), rowsEl = q('.field-rows', hostEl), hexEl = q('.hexout', hostEl), binEl = q('.binout', hostEl), status = q('.lab-status', hostEl);
    function totalWidth() { return fields.reduce(function (a, f) { return a + f.width; }, 0); }
    function build() {
      bar.innerHTML = fields.map(function (f) {
        return '<div class="bitbar__seg" style="flex:' + f.width + '"><span>' + esc(f.name) + '</span></div>';
      }).join('');
      rowsEl.innerHTML = fields.map(function (f, i) {
        var input;
        if (f.type === 'reg') {
          input = '<select class="input" data-fi="' + i + '"><option value=""' + (values[i] === '' ? ' selected' : '') + '>选择寄存器</option>' + REG_OPTS.map(function (r) {
            return '<option value="' + r + '"' + (r === values[i] ? ' selected' : '') + '>' + r + '</option>';
          }).join('') + '</select>';
        } else {
          input = '<input class="input" data-fi="' + i + '" value="' + esc(values[i]) + '" placeholder="' + (f.width > 8 ? '十进制或 0x' : '二进制 / 十进制') + '" spellcheck="false" autocomplete="off">';
        }
        return '<div class="field-row"><label>' + esc(f.name) + '</label>' + input + '<span class="field-row__w">' + f.width + 'b</span></div>';
      }).join('');
      qa('[data-fi]', rowsEl).forEach(function (el) {
        el.addEventListener('input', update);
        el.addEventListener('change', update);
      });
      update();
    }
    function encode() {
      var bin = '', errs = [];
      fields.forEach(function (f, i) {
        try {
          var v = parseField(values[i], f);
          if (v >= Math.pow(2, f.width)) throw new Error(f.name + ' 超出 ' + f.width + ' 位');
          bin += v.toString(2).padStart(f.width, '0');
        } catch (e) { errs.push(e.message); bin += '?'.repeat(f.width); }
      });
      var hex = '';
      if (!errs.length) {
        var pad = totalWidth();
        hex = '0x' + parseInt(bin || '0', 2).toString(16).toUpperCase().padStart(Math.ceil(pad / 4), '0');
      }
      return { bin: bin, hex: hex, errs: errs };
    }
    function update() {
      qa('[data-fi]', rowsEl).forEach(function (el) { values[Number(el.dataset.fi)] = el.value; });
      var r = encode();
      var empty = values.some(function (v) { return String(v).trim() === ''; });
      hexEl.textContent = r.hex || '—';
      binEl.textContent = empty ? '—' : r.bin;
      if (empty) statusEl(status, '共 ' + totalWidth() + ' 位，等待填写各字段', '');
      else if (r.errs.length) statusEl(status, r.errs[0], 'bad');
      else statusEl(status, totalWidth() + ' 位字段，' + r.hex, '');
    }
    function check() {
      var fails = [];
      fields.forEach(function (f, i) {
        try {
          var got = parseField(values[i], f);
          var want = parseField(f.value, f);
          if (got !== want) fails.push(f.name);
        } catch (e) { fails.push(f.name); }
      });
      if (fails.length) return { ok: false, detail: '字段不正确：' + fails.join('、') };
      var r = encode();
      if (lab.expected) {
        var want = String(lab.expected).toLowerCase().replace(/^0x/, '').padStart(8, '0');
        var gotHex = String(r.hex).toLowerCase().replace(/^0x/, '').padStart(8, '0');
        if (want !== gotHex) return { ok: false, detail: '字段正确但拼出的编码为 ' + r.hex + '，应为 0x' + want };
      }
      return { ok: true, detail: '编码 ' + r.hex + ' 正确' };
    }
    q('[data-a="check"]', hostEl).addEventListener('click', function () {
      var r = check(); statusEl(status, r.ok ? '✓ ' + r.detail : '✗ ' + r.detail, r.ok ? 'ok' : 'bad');
    });
    q('[data-a="ref"]', hostEl).addEventListener('click', function () {
      if (locked) return;
      values = fields.map(function (f) { return String(f.value); });
      build();
      U.toast('已填入参考值，对照学习');
    });
    build();
    return {
      check: check,
      lock: function () { locked = true; lockButtons(hostEl); },
      reset: function () { if (!locked) { values = fields.map(function () { return ''; }); build(); } },
      reveal: function () {
        if (locked) return;
        values = fields.map(function (f) { return String(f.value); });
        build();
      }
    };
  };

  /* ================================================================
     分发
     ================================================================ */
  L.instances = {};
  L.mount = function (host, qq) {
    var fn = L[qq.type];
    if (!fn) {
      host.innerHTML = '<div class="lab lab--paper"><div class="lab__body">暂不支持该实验类型</div></div>';
      return null;
    }
    try {
      var inst = fn(host, qq);
      if (inst) L.instances[qq.id] = inst;
      return inst;
    } catch (e) {
      host.innerHTML = '<div class="lab lab--paper"><div class="lab__body">实验加载失败：' + esc(e.message) + '</div></div>';
      return null;
    }
  };
})();

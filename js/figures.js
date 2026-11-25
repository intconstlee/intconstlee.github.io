/* figures.js — 知识点示意图（第一部分：数制、逻辑、组合、时序） */
(function () {
  'use strict';
  var GI = window.GI, U = GI.util;
  var e = U.esc;
  var FIGS = {};
  GI.figures = { figs: FIGS, map: {} };

  /* ---------- SVG 原语 ---------- */
  function T(x, y, s, cls, anchor, size) {
    return '<text x="' + x + '" y="' + y + '"' +
      (cls ? ' class="' + cls + '"' : '') +
      (anchor ? ' text-anchor="' + anchor + '"' : '') +
      (size ? ' font-size="' + size + '"' : '') + '>' + e(s) + '</text>';
  }
  function TS(x, y, s, cls, anchor, size) { return T(x, y, s, cls, anchor, size); }
  function R(x, y, w, h, r, cls) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r == null ? 8 : r) + '" class="' + (cls || 'f-box') + '"/>';
  }
  function L(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || 'f-line') + '"/>';
  }
  function P(d, cls) { return '<path d="' + d + '" class="' + (cls || 'f-line') + '"/>'; }
  function C(cx, cy, r, cls) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="' + (cls || 'f-box') + '"/>'; }
  function AR(x1, y1, x2, y2, cls) {
    var ang = Math.atan2(y2 - y1, x2 - x1), a = 8;
    var p1x = x2 - a * Math.cos(ang - 0.42), p1y = y2 - a * Math.sin(ang - 0.42);
    var p2x = x2 - a * Math.cos(ang + 0.42), p2y = y2 - a * Math.sin(ang + 0.42);
    return L(x1, y1, x2, y2, cls || 'f-wire') +
      '<polygon class="f-arrow" points="' + x2 + ',' + y2 + ' ' + p1x.toFixed(1) + ',' + p1y.toFixed(1) + ' ' + p2x.toFixed(1) + ',' + p2y.toFixed(1) + '"/>';
  }
  function ARROW(x, y, dir) {
    // 小箭头：尖端落在 (x,y)，底边在来向一侧，保证与线端贴合
    var p = {
      r: [x, y, x - 8, y - 4, x - 8, y + 4],
      l: [x, y, x + 8, y - 4, x + 8, y + 4],
      u: [x, y, x - 4, y + 8, x + 4, y + 8],
      d: [x, y, x - 4, y - 8, x + 4, y - 8]
    }[dir];
    return '<polygon class="f-arrow" points="' + p[0] + ',' + p[1] + ' ' + p[2] + ',' + p[3] + ' ' + p[4] + ',' + p[5] + '"/>';
  }
  function BOX(x, y, w, h, label, sub, cls, textCls) {
    var s = R(x, y, w, h, 10, cls || 'f-box');
    if (label) s += T(x + w / 2, y + (sub ? h / 2 - 4 : h / 2 + 4), label, 'n' + (textCls ? ' ' + textCls : ''), 'middle', 12);
    if (sub) s += T(x + w / 2, y + h / 2 + 12, sub, 'tiny ' + (textCls || ''), 'middle');
    return s;
  }
  function wrap(key, title, caption, w, h, bodyFn, label) {
    FIGS[key] = {
      title: title, caption: caption, w: w, h: h,
      body: function (s) { return bodyFn(s); },
      label: label || title
    };
  }

  /* ================= 1. 基本逻辑门 ================= */
  function gateShape(type, x, y) {
    var s = '';
    var isNot = type === 'NOT' || type === 'BUF';
    var isOr = type === 'OR' || type === 'NOR' || type === 'XOR' || type === 'XNOR';
    var bub = type === 'NAND' || type === 'NOR' || type === 'XNOR' || type === 'NOT';
    var shapeEnd;
    if (isNot) {
      s += '<path class="f-box" d="M' + x + ' ' + (y - 26) + ' L' + x + ' ' + (y + 26) + ' L' + (x + 36) + ' ' + y + ' Z"/>';
      s += L(x - 24, y, x, y);
      shapeEnd = x + 36;
    } else if (isOr) {
      var d = 'M' + x + ' ' + (y - 26) +
        ' C' + (x + 22) + ' ' + (y - 20) + ' ' + (x + 38) + ' ' + (y - 10) + ' ' + (x + 38) + ' ' + y +
        ' C' + (x + 38) + ' ' + (y + 10) + ' ' + (x + 22) + ' ' + (y + 20) + ' ' + x + ' ' + (y + 26) +
        ' C' + (x + 13) + ' ' + (y + 14) + ' ' + (x + 13) + ' ' + (y - 14) + ' ' + x + ' ' + (y - 26) + ' Z';
      s += '<path class="f-box" d="' + d + '"/>';
      if (type === 'XOR' || type === 'XNOR') s += P('M' + (x - 8) + ' ' + (y - 26) + ' C' + (x + 7) + ' ' + (y - 15) + ' ' + (x + 7) + ' ' + (y + 15) + ' ' + (x - 8) + ' ' + (y + 26), 'f-line');
      s += L(x - 24, y - 13, x + 2, y - 13) + L(x - 24, y + 13, x + 2, y + 13);
      shapeEnd = x + 38;
    } else {
      s += '<path class="f-box" d="M' + x + ' ' + (y - 26) + ' h22 a26 26 0 0 1 0 52 h-22 Z"/>';
      s += L(x - 24, y - 13, x, y - 13) + L(x - 24, y + 13, x, y + 13);
      shapeEnd = x + 48;
    }
    if (bub) {
      var bx = shapeEnd + 6;
      s += C(bx, y, 5, 'f-bubble');
      s += L(bx + 5, y, x + 82, y);
    } else {
      s += L(shapeEnd, y, x + 82, y);
    }
    return s;
  }
  wrap('gates', '八种基本逻辑门', '门的形状就是它的真值函数：与门像 D，或门像弓，异或门多一道弧线；小圆圈表示取反。', 760, 330, function () {
    var types = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR', 'XNOR', 'BUF'];
    var expr = ['Y = A·B', 'Y = A+B', 'Y = A⊕B', 'Y = A′', 'Y = (A·B)′', 'Y = (A+B)′', 'Y = (A⊕B)′', 'Y = A'];
    var b = '';
    types.forEach(function (t, i) {
      var col = i % 4, row = Math.floor(i / 4);
      var x = 46 + col * 180, y = 72 + row * 132;
      b += '<g>' + gateShape(t, x, y) + '</g>';
      b += T(x + 36, y + 60, t === 'BUF' ? 'BUFFER' : t, 'n', 'middle', 12);
      b += T(x + 36, y + 77, expr[i], 'tiny', 'middle');
    });
    b += T(380, 312, '输入 A、B 在左侧，输出 Y 在右侧；所有门都是单输出。', 'muted', 'middle');
    return b;
  });

  /* ================= 2. CMOS 反相器 ================= */
  wrap('cmos', 'CMOS 反相器：上拉与下拉', 'pMOS 在 A=0 时导通、把 Y 拉向 VDD；nMOS 在 A=1 时导通、把 Y 拉向地。两者不会同时完全导通，这就是静态 CMOS 低功耗的来源。', 760, 330, function () {
    var b = '';
    b += L(70, 44, 460, 44, 'f-line');
    b += T(70, 32, 'VDD', 'tiny');
    b += L(70, 300, 460, 300, 'f-line');
    b += T(70, 318, 'GND', 'tiny');
    // pMOS / nMOS blocks
    b += R(240, 74, 100, 44, 10, 'f-box');
    b += T(290, 101, 'pMOS', 'n', 'middle', 12);
    b += R(240, 222, 100, 44, 10, 'f-box');
    b += T(290, 249, 'nMOS', 'n', 'middle', 12);
    // input A
    b += L(150, 50, 150, 270, 'f-wire');
    b += L(150, 96, 240, 96, 'f-wire');
    b += L(150, 244, 240, 244, 'f-wire');
    b += C(150, 55, 4, 'f-accent');
    b += T(120, 145, 'A', 'n', 'middle', 16);
    // output node
    b += L(340, 96, 400, 96, 'f-wire');
    b += L(400, 96, 400, 244, 'f-wire');
    b += L(340, 244, 400, 244, 'f-wire');
    b += L(290, 44, 290, 74, 'f-wire');
    b += L(290, 266, 290, 300, 'f-wire');
    b += L(400, 170, 470, 170, 'f-wire');
    b += C(470, 170, 5, 'f-accent');
    b += T(490, 175, 'Y', 'n', 'start', 17);
    b += T(175, 88, 'A=0 → 导通', 'tiny', 'start');
    b += T(175, 236, 'A=1 → 导通', 'tiny', 'start');
    b += T(290, 130, '上拉', 'tiny', 'middle');
    b += T(290, 214, '下拉', 'tiny', 'middle');
    // truth table
    var tx = 560, ty = 70;
    b += T(tx, ty, 'A   Y', 'n', 'start', 12);
    b += L(tx, ty + 12, tx + 120, ty + 12, 'f-line');
    b += T(tx, ty + 40, '0   1', 'v', 'start', 14);
    b += T(tx, ty + 70, '1   0', 'v', 'start', 14);
    b += T(tx, ty + 110, '静态时总有一只', 'tiny');
    b += T(tx, ty + 126, '晶体管截止', 'tiny');
    return b;
  });

  /* ================= 3. 逻辑电平与噪声容限 ================= */
  wrap('levels', '逻辑电平与噪声容限', '发送端保证 VOH/VOL，接收端只承认 VIH/VIL。两条“保证”之间的空隙就是噪声容限：NMH = VOH − VIH，NML = VIL − VOL。', 760, 310, function () {
    var x = 90, w = 420;
    var ys = { vdd: 45, voh: 80, vih: 120, vil: 190, vol: 230, gnd: 275 };
    var b = '';
    // 区域底色
    b += '<rect x="' + x + '" y="' + ys.voh + '" width="' + w + '" height="' + (ys.vih - ys.voh) + '" class="f-box"/>';
    b += '<rect x="' + x + '" y="' + ys.vih + '" width="' + w + '" height="' + (ys.vil - ys.vih) + '" class="f-box-2" opacity=".55"/>';
    b += '<rect x="' + x + '" y="' + ys.vil + '" width="' + w + '" height="' + (ys.vol - ys.vil) + '" class="f-box"/>';
    Object.keys(ys).forEach(function (k) {
      b += L(x - 16, ys[k], x + w + 20, ys[k], 'f-line');
      b += T(x - 24, ys[k] + 4, ({ vdd: 'VDD', voh: 'VOH', vih: 'VIH', vil: 'VIL', vol: 'VOL', gnd: 'GND' })[k], 'n', 'end', 10);
    });
    b += L(x - 16, ys.vdd, x - 16, ys.gnd, 'f-thin');
    b += T(x + 30, (ys.voh + ys.vih) / 2 + 4, '逻辑 1', 'v', 'start', 14);
    b += T(x + 30, (ys.vil + ys.vol) / 2 + 4, '逻辑 0', 'v', 'start', 14);
    b += T(x + 210, (ys.vih + ys.vil) / 2 + 4, '不确定区', 'v', 'middle', 12);
    // 噪声容限箭头
    b += AR(x + w + 54, ys.voh, x + w + 54, ys.vih);
    b += T(x + w + 68, (ys.voh + ys.vih) / 2 + 4, 'NMH', 'n', 'start', 12);
    b += T(x + w + 68, (ys.voh + ys.vih) / 2 + 20, 'VOH − VIH', 'tiny', 'start');
    b += AR(x + w + 154, ys.vil, x + w + 154, ys.vol);
    b += T(x + w + 168, (ys.vil + ys.vol) / 2 + 4, 'NML', 'n', 'start', 12);
    b += T(x + w + 168, (ys.vil + ys.vol) / 2 + 20, 'VIL − VOL', 'tiny', 'start');
    b += T(380, 302, '电压落在 VIH 与 VIL 之间时，接收端不保证把它认成 0 还是 1。', 'muted', 'middle');
    return b;
  });

  /* ================= 4. 补码数环 ================= */
  wrap('twos', '4 位补码数环', '16 个状态排成一圈：0…7 为正，−8…−1 为负。跨过 7 与 −8 的分界时，符号位翻转。', 760, 380, function () {
    var cx = 248, cy = 186, r = 134;
    var b = '';
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 48) + '" class="f-box-2" opacity=".35"/>';
    b += T(cx, cy - 6, '4-bit', 'n', 'middle', 14);
    b += T(cx, cy + 18, '补码', 'n', 'middle', 14);
    for (var i = 0; i < 16; i++) {
      var ang = (-90 + i * 22.5) * Math.PI / 180;
      var x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
      var signed = i > 7 ? i - 16 : i;
      var pos = i > 0 && i < 8;
      var hot = i === 0 || i === 8;
      var cls = hot ? 'f-accent' : (pos ? 'f-box' : 'f-box-2');
      b += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="23" class="' + cls + '"/>';
      b += T(x.toFixed(1), y + 5, signed, 'v' + (hot ? ' on-a' : ''), 'middle', 13);
    }
    b += T(cx, cy + r + 42, '7 → −8：0111 之后跳到 1000', 'v', 'middle', 11);
    // 右侧解释
    var rx = 452;
    b += T(rx, 66, '最高位权 = −8', 'n', 'start', 13);
    b += T(rx, 88, '−b₃·8 + b₂·4 + b₁·2 + b₀·1', 'tiny', 'start');
    var ex = [['0111', '7'], ['1000', '−8'], ['1111', '−1'], ['0000', '0']];
    ex.forEach(function (p, k) {
      var y = 128 + k * 42;
      b += T(rx, y, p[0], 'v', 'start', 13);
      b += T(rx + 86, y, '=', 'muted', 'start', 12);
      b += T(rx + 108, y, p[1], 'v', 'start', 13);
      b += L(rx, y + 14, rx + 200, y + 14, 'f-thin');
  
    });
    b += T(rx, 328, '范围：−8 … +7', 'v', 'start', 12);
    return b;
  });

  /* ================= 5/6. 卡诺图 ================= */
  function kmapGrid(x0, y0, cw, ch, rows, cols, vals, opts) {
    var b = '';
    opts = opts || {};
    var mt = opts.mt || null;
    // column headers
    b += T(x0 - 12, y0 - 4, 'A\\BC', 'tiny', 'end');
    cols.forEach(function (c, j) {
      b += T(x0 + j * cw + cw / 2, y0 - 14, c, 'v', 'middle', 11);
    });
    rows.forEach(function (r, i) {
      b += T(x0 - 14, y0 + i * ch + ch / 2 + 4, r, 'v', 'middle', 11);
      cols.forEach(function (c, j) {
        var v = vals[i][j];
        var x = x0 + j * cw, y = y0 + i * ch;
        b += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 4) + '" height="' + (ch - 4) + '" rx="7" class="' + (v === '1' ? 'f-box' : 'f-box-0') + '"/>';
        b += T(x + cw / 2 - 2, y + ch / 2 + 5, v, 'v', 'middle', 14);
        b += T(x + 7, y + 12, 'm' + (mt ? mt[i][j] : (i * cols.length + j)), 'tiny', 'start');
      });
    });
    return b;
  }
  wrap('kmap3', '三变量卡诺图：圈出 A′ + C', '行只放 A、列放 BC，列按 00、01、11、10 排列。整行 A=0 合并成 A′，中间两列 BC=01/11 合并成 C。', 760, 340, function () {
    var x0 = 96, y0 = 92, cw = 84, ch = 60;
    var vals = [['1', '1', '1', '1'], ['0', '1', '1', '0']];
    var b = '';
    b += R(x0 - 4, y0 - 4, cw * 4, ch * 2, 12, 'f-box-0');
    b += kmapGrid(x0, y0, cw, ch, ['A=0', 'A=1'], ['00', '01', '11', '10'], vals, { mt: [[0, 1, 3, 2], [4, 5, 7, 6]] });
    // G1 row bracket
    b += L(x0, y0 - 34, x0 + cw * 4 - 4, y0 - 34, 'f-wire');
    b += L(x0, y0 - 40, x0, y0 - 28, 'f-wire');
    b += L(x0 + cw * 4 - 4, y0 - 40, x0 + cw * 4 - 4, y0 - 28, 'f-wire');
    b += T(x0 + 4, y0 - 42, 'G1：A=0 整行 → A′', 'n', 'start', 11);
    // G2 columns bracket
    b += L(x0 + cw - 2, y0 + ch * 2 + 18, x0 + cw * 3 - 6, y0 + ch * 2 + 18, 'f-wire');
    b += L(x0 + cw - 2, y0 + ch * 2 + 12, x0 + cw - 2, y0 + ch * 2 + 24, 'f-wire');
    b += L(x0 + cw * 3 - 6, y0 + ch * 2 + 12, x0 + cw * 3 - 6, y0 + ch * 2 + 24, 'f-wire');
    b += T(x0 + cw * 2 - 4, y0 + ch * 2 + 38, 'G2：BC=01,11 → C', 'n', 'middle', 11);
    // right expression
    var rx = 500;
    b += T(rx, 110, 'Y = A′ + C', 'n', 'start', 22);
    b += T(rx, 146, '覆盖检查', 'tiny', 'start');
    b += T(rx, 168, '• 所有 1 都被圈到', 'tiny', 'start');
    b += T(rx, 188, '• 没有圈进 0', 'tiny', 'start');
    b += T(rx, 208, '• 两个圈都是最大圈', 'tiny', 'start');
    b += R(rx, 232, 190, 50, 10, 'f-box-0');
    b += T(rx + 12, 252, 'A=0 行 → A′', 'v', 'start', 11);
    b += T(rx + 12, 270, 'C=1 列 → C', 'v', 'start', 11);
    return b;
  });

  wrap('kmap4', '四变量卡诺图：四角与无关项', '行是 AB、列是 CD，两边都按格雷码。四角 m0/m2/m8/m10 合并成 B′D′；m13/m15 合并成 ABD。', 760, 430, function () {
    var x0 = 96, y0 = 96, cw = 62, ch = 54;
    var rows = ['AB=00', 'AB=01', 'AB=11', 'AB=10'];
    var cols = ['00', '01', '11', '10'];
    var vals = [
      ['1', '0', '0', '1'],
      ['0', '0', '0', '0'],
      ['0', '1', '1', '0'],
      ['1', '0', '0', '1']
    ];
    var b = '';
    b += R(x0 - 6, y0 - 4, cw * 4, ch * 4, 12, 'f-box-0');
    // headers
    b += T(x0 - 16, y0 - 4, 'AB\\CD', 'tiny', 'end');
    cols.forEach(function (c, j) { b += T(x0 + j * cw + cw / 2, y0 - 14, c, 'v', 'middle', 11); });
    rows.forEach(function (r, i) {
      b += T(x0 - 16, y0 + i * ch + ch / 2 + 4, r, 'v', 'middle', 10);
      cols.forEach(function (c, j) {
        var v = vals[i][j];
        var x = x0 + j * cw + 1, y = y0 + i * ch + 1;
        var g1 = (i === 0 || i === 3) && (j === 0 || j === 3);
        var g2 = i === 2 && (j === 1 || j === 2);
        var cls = v !== '1' ? 'f-box-0' : (g2 ? 'f-accent' : (g1 ? 'f-box-2' : 'f-box'));
        b += '<rect x="' + x + '" y="' + y + '" width="' + (cw - 8) + '" height="' + (ch - 8) + '" rx="7" class="' + cls + '"/>';
        b += T(x + (cw - 8) / 2, y + (ch - 8) / 2 + 6, v, 'v' + (g2 ? ' on-a' : ''), 'middle', 13);
      });
    });
    // group labels
    b += T(x0, y0 + ch * 4 + 24, 'G1：四个角 → B′D′', 'n', 'start', 11);
    b += T(x0 + cw * 2, y0 + ch * 4 + 46, 'G2：m13/m15 → ABD', 'n', 'middle', 11);
    var rx = 500;
    b += T(rx, 110, 'Y = B′D′ + ABD', 'n', 'start', 17);
    b += T(rx, 144, '无关项 X 可以当 1 圈进大圈，', 'tiny', 'start');
    b += T(rx, 162, '也可以当 0 放着。', 'tiny', 'start');
    b += R(rx, 196, 200, 82, 10, 'f-box-0');
    b += T(rx + 12, 218, '四角相邻：左右边界相接，', 'tiny', 'start');
    b += T(rx + 12, 236, '上下边界相接，四个角同时', 'tiny', 'start');
    b += T(rx + 12, 254, '相邻。', 'tiny', 'start');
    return b;
  });

  /* ================= 7. 4:1 MUX ================= */
  wrap('mux4', '4 选 1 复用器', '选择端 S1S0 决定哪一个数据端接到输出。4 选 1 可以先做两个 2 选 1，再做一级 2 选 1。', 760, 306, function () {
    var b = '';
    b += '<path class="f-box" d="M250 52 L430 90 L430 210 L250 248 Z"/>';
    b += T(340, 145, '4:1', 'n', 'middle', 20);
    b += T(340, 165, 'MUX', 'n', 'middle', 20);
    var ins = [['D0', 78], ['D1', 126], ['D2', 174], ['D3', 222]];
    ins.forEach(function (d) {
      b += L(150, d[1], 250, d[1], 'f-wire');
      b += T(140, d[1] + 4, d[0], 'n', 'end', 12);
    });
    b += L(315, 250, 315, 286, 'f-wire');
    b += L(355, 250, 355, 286, 'f-wire');
    b += T(315, 300, 'S0', 'n', 'middle', 10);
    b += T(355, 300, 'S1', 'n', 'middle', 10);
    b += L(430, 150, 510, 150, 'f-wire');
    b += T(520, 155, 'Y', 'n', 'start', 15);
    var rx = 560, ry = 76;
    b += T(rx, ry, 'S1   S0     Y', 'n', 'start', 11);
    b += L(rx, ry + 12, rx + 130, ry + 12, 'f-line');
    [['0 0', 'D0'], ['0 1', 'D1'], ['1 0', 'D2'], ['1 1', 'D3']].forEach(function (p, i) {
      b += T(rx, ry + 34 + i * 28, p[0], 'n', 'start', 11);
      b += T(rx + 88, ry + 34 + i * 28, p[1], 'n', 'start', 11);
    });
    return b;
  });

  /* ================= 8. 2:4 译码器 ================= */
  wrap('decoder', '2 输入译码器：每个地址点亮一根线', '译码器把 n 位地址变成 2ⁿ 根“独热”输出线；第 i 根线恰好对应输入编号 i。', 760, 300, function () {
    var b = '';
    b += R(150, 54, 170, 190, 12, 'f-box-2');
    b += T(235, 144, '2:4', 'n', 'middle', 18);
    b += T(235, 166, '译码器', 'n', 'middle', 14);
    b += L(90, 96, 150, 96, 'f-wire');
    b += L(90, 166, 150, 166, 'f-wire');
    b += T(80, 101, 'A1', 'n', 'end', 12);
    b += T(80, 171, 'A0', 'n', 'end', 12);
    var outs = ['Y0', 'Y1', 'Y2', 'Y3'];
    outs.forEach(function (o, i) {
      var y = 78 + i * 48;
      b += L(320, y, 400, y, 'f-wire');
      b += C(406, y, 4, 'f-accent');
      b += T(420, y + 4, o, 'n', 'start', 12);
    });
    b += T(235, 270, '每根输出线对应一个最小项', 'muted', 'middle');
    // state table
    var rx = 580;
    b += T(rx, 84, 'A1 A0 → 有效输出', 'tiny', 'start');
    [['0 0', 'Y0'], ['0 1', 'Y1'], ['1 0', 'Y2'], ['1 1', 'Y3']].forEach(function (p, i) {
      b += T(rx, 116 + i * 30, p[0], 'n', 'start', 11);
      b += T(rx + 74, 116 + i * 30, '→ ' + p[1], 'n', 'start', 11);
    });
    return b;
  });

  /* ================= 9. 传播延迟 / 毛刺 ================= */
  function waveform(rows, x0, w, y0, rowH, n, opts) {
    opts = opts || {};
    var b = '', step = w / n;
    for (var i = 0; i <= n; i++) b += L(x0 + i * step, y0 - 20, x0 + i * step, y0 + rows.length * rowH, 'f-thin');
    rows.forEach(function (row, ri) {
      var cy = y0 + ri * rowH;
      var hi = cy + 10, lo = cy + rowH - 10;
      b += L(x0 - 12, lo, x0, lo, 'f-thin');
      b += T(x0 - 18, cy + rowH / 2 + 4, row.name, 'n', 'end', 11);
      if (row.ideal) {
        // 用细线画理想波形
        var dI = 'M' + x0 + ' ' + (row.cells[0] ? hi : lo);
        for (var k = 1; k <= n; k++) {
          dI += ' H' + (x0 + k * step);
          if (k < n) dI += ' V' + (row.cells[k] ? hi : lo);
        }
        b += P(dI, 'f-thin');
      }
      var d = 'M' + x0 + ' ' + (row.cells[0] ? hi : lo);
      for (var j = 1; j <= n; j++) {
        d += ' H' + (x0 + j * step);
        if (j < n) d += ' V' + (row.cells[j] ? hi : lo);
      }
      b += P(d, row.soft ? 'f-line' : 'f-wire');
      // 电平文字
      b += T(x0 + 4, cy + (row.cells[0] ? 10 : rowH - 10) - 4, row.cells[0] ? '1' : '0', 'tiny', 'start');
    });
    if (opts.labels) {
      opts.labels.forEach(function (l) { b += T(l.x, l.y, l.s, l.cls || 'tiny', l.anchor || 'middle'); });
    }
    return b;
  }
  wrap('delay', '传播延迟与最小延迟', '输入变化后，输出要经过一段门延迟才响应。两级路径上的 tpd 相加决定关键路径；最短路径给出 tcd。', 760, 300, function () {
    var n = 8;
    var rows = [
      { name: 'A', cells: [0, 0, 1, 1, 1, 1, 0, 0] },
      { name: 'Y', cells: [0, 0, 0, 1, 1, 1, 1, 0] }
    ];
    var b = waveform(rows, 100, 560, 72, 86, n);
    b += AR(240, 60, 310, 60);
    b += T(275, 48, 'tpd', 'n', 'middle', 11);
    b += T(380, 268, '延迟由门和连线造成；关键路径 = 各门延迟之和。', 'muted', 'middle');
    return b;
  });
  wrap('glitch', '毛刺：不同路径的延迟不一致', '同一个信号经不同路径到达同一扇入，延迟差会在输出端产生一个窄脉冲。它是组合逻辑的“瞬态”，不是稳态错误。', 760, 300, function () {
    var n = 8;
    var rows = [
      { name: 'A', cells: [1, 1, 1, 0, 0, 0, 0, 0] },
      { name: 'B', cells: [0, 1, 1, 1, 1, 1, 1, 1] },
      { name: 'Y理想', cells: [0, 1, 1, 0, 0, 0, 0, 0], ideal: true, soft: true },
      { name: 'Y实际', cells: [0, 1, 1, 1, 0, 0, 0, 0] }
    ];
    var b = waveform(rows, 100, 560, 72, 50, n);
    b += T(380, 288, '台阶处出现窄脉冲；稳态值由最终输入决定。', 'muted', 'middle');
    return b;
  });

  /* ================= 10. SR 锁存器 ================= */
  wrap('sr_latch', '交叉耦合 NOR：SR 锁存器', '两个 NOR 门的输出互为对方的输入，于是“记住”上一次的状态。S=1 置位，R=1 复位，S=R=0 保持。', 760, 320, function () {
    var b = '';
    b += R(230, 60, 110, 76, 12, 'f-box-2');
    b += R(420, 190, 110, 76, 12, 'f-box-2');
    b += T(285, 102, 'NOR₁', 'n', 'middle', 14);
    b += T(475, 232, 'NOR₂', 'n', 'middle', 14);
    // inputs
    b += L(90, 92, 230, 92, 'f-wire');
    b += T(80, 97, 'S', 'n', 'end', 15);
    b += L(90, 232, 420, 232, 'f-wire');
    b += T(80, 237, 'R', 'n', 'end', 15);
    // outputs
    b += L(340, 92, 620, 92, 'f-wire');
    b += T(630, 97, 'Q', 'n', 'start', 15);
    b += L(530, 232, 620, 232, 'f-wire');
    b += T(630, 237, 'Q′', 'n', 'start', 15);
    // feedback: Q -> NOR2 second input, routed above
    b += P('M350 92 V40 H400 V212 H420', 'f-wire');
    b += ARROW(420, 212, 'r');
    // feedback: Q' -> NOR1 second input, routed left/below
    b += P('M530 232 V300 H180 V116 H230', 'f-wire');
    b += ARROW(230, 116, 'r');
    b += T(404, 64, 'Q → NOR₂', 'tiny', 'start');
    b += T(186, 282, 'Q′ → NOR₁', 'tiny', 'start');
    return b;
  });

  /* ================= 11. D 触发器 + 时序 ================= */
  wrap('dff', 'D 触发器：符号与时序', '上升沿到来时，Q 采样 D 的值；沿前必须稳定（setup），沿后还要保持一段时间（hold）。', 760, 340, function () {
    var b = '';
    b += R(96, 86, 166, 156, 12, 'f-box-2');
    b += T(179, 144, 'D', 'n', 'middle', 18);
    b += T(179, 166, 'FF', 'n', 'middle', 13);
    b += L(48, 110, 96, 110, 'f-wire');
    b += T(38, 115, 'D', 'n', 'end', 14);
    b += L(48, 200, 96, 200, 'f-wire');
    b += T(38, 205, 'CLK', 'n', 'end', 12);
    b += P('M96 190 L108 200 L96 210', 'f-wire');
    b += L(262, 118, 310, 118, 'f-wire');
    b += T(320, 123, 'Q', 'n', 'start', 15);
    b += L(262, 210, 310, 210, 'f-wire');
    b += T(320, 215, 'Q′', 'n', 'start', 15);
    // timing
    var rows = [
      { name: 'CLK', cells: [0, 1, 0, 1, 0, 1, 0, 1] },
      { name: 'D', cells: [1, 0, 0, 1, 1, 0, 0, 1] },
      { name: 'Q', cells: [0, 1, 0, 0, 0, 1, 1, 0] }
    ];
    b += waveform(rows, 390, 330, 82, 62, 8);
    return b;
  });
  wrap('setup_hold', '建立时间与保持时间', '时钟沿不是一个“点”，触发器要求 D 在沿前 t_setup、沿后 t_hold 都稳定。违反任一条都可能进入亚稳态。', 760, 360, function () {
    var rows = [
      { name: 'CLK', cells: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
      { name: 'D', cells: [0, 0, 1, 1, 1, 0, 0, 0, 1, 1] },
      { name: 'Q', cells: [0, 0, 0, 1, 1, 1, 1, 0, 0, 1] }
    ];
    var b = '<rect x="286" y="54" width="104" height="244" rx="8" fill="var(--s4)" opacity=".1"/>';
    b += waveform(rows, 100, 560, 74, 78, 10);
    b += L(338, 40, 338, 298, 'f-wire');
    b += T(338, 18, '时钟沿', 'n', 'middle', 10);
    b += AR(286, 48, 338, 48);
    b += T(312, 36, 't_setup', 'tiny', 'middle');
    b += AR(338, 48, 390, 48);
    b += T(364, 36, 't_hold', 'tiny', 'middle');
    b += AR(338, 314, 400, 314);
    b += T(369, 332, 't_pcq', 'tiny', 'middle');
    b += T(380, 348, 'D 在时钟沿附近稳定，Q 才会可靠更新。', 'muted', 'middle');
    return b;
  });

  /* ================= 12. 交通灯 FSM ================= */
  wrap('traffic', '交通灯状态机', '四个状态按 TA/TB 的条件循环。Moore 输出由当前状态直接决定；状态转移由输入决定。', 760, 360, function () {
    var b = '';
    var states = [
      { id: 'S0', x: 220, y: 100, out: 'LA=G, LB=R', hot: true },
      { id: 'S1', x: 540, y: 100, out: 'LA=Y, LB=R' },
      { id: 'S2', x: 540, y: 260, out: 'LA=R, LB=G' },
      { id: 'S3', x: 220, y: 260, out: 'LA=R, LB=Y' }
    ];
    states.forEach(function (s) {
      b += C(s.x, s.y, 54, s.hot ? 'f-accent' : 'f-box-2');
      b += T(s.x, s.y - 5, s.id, 'v' + (s.hot ? ' on-a' : ''), 'middle', 19);
      b += T(s.x, s.y + 18, s.out, 'tiny' + (s.hot ? ' on-a' : ''), 'middle', 8.5);
    });
    b += AR(278, 88, 480, 88);
    b += T(379, 72, 'TA·TB', 'n', 'middle', 11);
    b += AR(540, 156, 540, 204);
    b += T(566, 184, 'TB·TA′', 'n', 'middle', 11);
    b += AR(480, 272, 280, 272);
    b += T(380, 294, 'TB′', 'v', 'middle', 11);
    b += AR(220, 208, 220, 156);
    b += T(194, 184, 'TA′', 'n', 'middle', 11);
    b += T(380, 340, 'Moore 型：输出写在状态里；每条边标注转移条件。', 'muted', 'middle');
    return b;
  });
  wrap('fsm_types', 'Moore 与 Mealy 的区别', 'Moore 机的输出只取决于状态；Mealy 机的输出同时取决于状态和当前输入，因此可以在转移边上直接写输出。', 760, 300, function () {
    var b = '';
    // Moore
    b += T(190, 52, 'Moore', 'n', 'middle', 16);
    b += C(110, 140, 40, 'f-box-2');
    b += T(110, 134, 'S0', 'n', 'middle', 14);
    b += T(110, 152, 'Y=0', 'tiny', 'middle');
    b += C(270, 140, 40, 'f-box-2');
    b += T(270, 134, 'S1', 'n', 'middle', 14);
    b += T(270, 152, 'Y=1', 'tiny', 'middle');
    b += AR(150, 130, 230, 130);
    b += T(190, 118, 'x=1', 'tiny', 'middle');
    b += AR(230, 150, 150, 150);
    b += T(190, 168, 'x=0', 'tiny', 'middle');
    // Mealy
    b += T(570, 52, 'Mealy', 'n', 'middle', 16);
    b += C(490, 140, 40, 'f-box-2');
    b += T(490, 144, 'S0', 'n', 'middle', 14);
    b += C(650, 140, 40, 'f-box-2');
    b += T(650, 144, 'S1', 'n', 'middle', 14);
    b += AR(530, 130, 610, 130);
    b += T(570, 118, 'x=1 / z=1', 'tiny', 'middle');
    b += AR(610, 150, 530, 150);
    b += T(570, 168, 'x=0 / z=0', 'tiny', 'middle');
    b += T(380, 276, '同一个功能可以有多种实现，选择要看输出是否需要与输入组合。', 'muted', 'middle');
    return b;
  });

  /* ================= 13. 寄存器 ================= */
  wrap('register', 'N 位寄存器与使能', 'N 个 D 触发器并联，共享时钟。EN=1 时在时钟沿装载 D，EN=0 时保持；复位可以把所有位清零。', 760, 300, function () {
    var b = '';
    b += R(210, 76, 320, 150, 14, 'f-box-2');
    var bits = [3, 2, 1, 0];
    bits.forEach(function (bit, i) {
      var x = 230 + i * 76;
      b += R(x, 96, 56, 96, 8, 'f-box-0');
      b += T(x + 28, 124, 'D' + bit, 'tiny', 'middle');
      b += T(x + 28, 162, 'FF', 'n', 'middle', 11);
      b += T(x + 28, 180, 'Q' + bit, 'tiny', 'middle');
      b += L(x + 18, 92, x + 18, 76, 'f-wire');
      b += L(x + 38, 192, x + 38, 226, 'f-wire');
    });
    b += T(370, 56, 'D3…D0', 'n', 'middle', 12);
    b += T(382, 246, 'Q3…Q0', 'n', 'start', 12);
    b += L(370, 226, 370, 258, 'f-wire');
    b += L(120, 210, 210, 210, 'f-wire');
    b += T(108, 215, 'CLK', 'n', 'end', 12);
    b += L(120, 170, 210, 170, 'f-wire');
    b += T(108, 175, 'EN', 'n', 'end', 12);
    b += T(370, 214, '共享 CLK / EN', 'tiny', 'middle');
    b += T(380, 286, '所有触发器共享同一个时钟与使能', 'muted', 'middle');
    return b;
  });

  /* ---------- 映射 ---------- */
  GI.figures.map = {
    'ch1-gates': 'gates',
    'ch1-cmos': 'cmos',
    'ch1-levels': 'levels',
    'ch1-twos': 'twos',
    'ch1-signed': 'twos',
    'ch2-kmap': 'kmap3',
    'ch2-kmap-dc': 'kmap4',
    'ch2-mux': 'mux4',
    'ch2-decoder': 'decoder',
    'ch2-timing': 'delay',
    'ch2-glitch': 'glitch',
    'ch3-sr-latch': 'sr_latch',
    'ch3-dff': 'dff',
    'ch3-timing': 'setup_hold',
    'ch3-traffic': 'traffic',
    'ch3-fsm': 'fsm_types',
    'ch3-register': 'register',
    'ref-gate': 'gates',
    'ref-kmap': 'kmap4',
    'ref-seq': 'setup_hold'
  };
  GI.figures.add = function (obj) {
    Object.keys(obj).forEach(function (k) { GI.figures.figs[k] = obj[k]; });
  };
  GI.figures.forSection = function (s) {
    var key = GI.figures.map[s.id];
    if (!key) return '';
    var f = GI.figures.figs[key];
    if (!f) return '';
    var body;
    try { body = f.body(s); } catch (err) { return ''; }
    return '<figure class="fig">' +
      '<div class="fig__head"><span class="fig__kicker">FIG. ' + e(s.num || '') + '</span><span class="fig__title">' + e(f.title) + '</span><span class="fig__hint">左右滑动 ›</span></div>' +
      '<div class="fig__canvas"><svg viewBox="0 0 ' + f.w + ' ' + f.h + '" role="img" aria-label="' + e(f.label || f.title) + '">' + body + '</svg></div>' +
      '<figcaption>' + f.caption + '</figcaption></figure>';
  };
  // 供 figures-extra.js 复用
  GI.figures._h = { T: T, TS: TS, R: R, L: L, P: P, C: C, AR: AR, ARROW: ARROW, BOX: BOX, wrap: wrap, waveform: waveform, kmapGrid: kmapGrid };
})();

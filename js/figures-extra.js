/* figures-extra.js — 知识点示意图（第二部分：模块、算术、ISA、微体系结构、存储） */
(function () {
  'use strict';
  var F = window.GI.figures, H = F._h;
  var T = H.T, R = H.R, L = H.L, P = H.P, C = H.C, AR = H.AR, ARROW = H.ARROW, BOX = H.BOX, wrap = H.wrap;

  /* ================= 1. Verilog 模块 ================= */
  wrap('module', '一个模块就是一块有端口的芯片', '端口列表声明方向与位宽，模块体描述内部逻辑。外部只看得到端口，看不到里面的 assign 或 always。', 760, 300, function () {
    var b = '';
    b += R(190, 70, 300, 160, 16, 'f-box-2');
    b += T(340, 104, 'module mux2', 'n', 'middle', 16);
    b += T(340, 124, '(input logic a, b, s;', 'tiny', 'middle');
    b += T(340, 140, ' output logic y);', 'tiny', 'middle');
    b += L(300, 170, 380, 170, 'f-thin');
    b += T(340, 196, 'assign y = s ? b : a;', 'sym', 'middle', 11);
    var ports = [['a', 105], ['b', 145], ['s', 185]];
    ports.forEach(function (p) {
      b += L(110, p[1], 190, p[1], 'f-wire');
      b += T(100, p[1] + 4, p[0], 'n', 'end', 14);
    });
    b += L(490, 145, 570, 145, 'f-wire');
    b += T(582, 150, 'y', 'n', 'start', 14);
    b += T(340, 56, '黑盒：端口是唯一的接口', 'tiny', 'middle');
    b += T(340, 266, '模块可以嵌套：一个模块内部可以实例化其他模块。', 'muted', 'middle');
    return b;
  });

  /* ================= 2. FSM 三段式结构 ================= */
  wrap('fsm_struct', 'FSM 的三段式写法', '状态寄存器只负责“记住状态”；次态逻辑决定下一状态；输出逻辑决定输出。三段分开，综合器才能稳定地推断出触发器。', 760, 300, function () {
    var b = '';
    b += R(250, 54, 180, 56, 10, 'f-box');
    b += T(340, 86, '次态逻辑', 'n', 'middle', 13);
    b += R(250, 170, 180, 56, 10, 'f-box-2');
    b += T(340, 202, '状态寄存器', 'n', 'middle', 13);
    b += R(540, 112, 150, 56, 10, 'f-box');
    b += T(615, 144, '输出逻辑', 'n', 'middle', 13);
    b += AR(340, 110, 340, 170);
    b += T(354, 144, 'next', 'tiny', 'start');
    b += AR(430, 198, 540, 140);
    b += T(482, 156, 'state', 'tiny', 'middle');
    b += AR(160, 198, 250, 198);
    b += T(150, 203, 'clk', 'n', 'end', 12);
    b += AR(160, 82, 250, 82);
    b += T(150, 87, 'in', 'n', 'end', 12);
    b += AR(690, 140, 730, 140);
    b += T(740, 144, 'out', 'n', 'start', 12);
    b += T(380, 270, '状态寄存器在时钟沿更新；组合逻辑只算“下一拍”。', 'muted', 'middle');
    return b;
  });

  /* ================= 3. 全加器 ================= */
  wrap('full_adder', '全加器：三个输入，两个输出', 'S = A⊕B⊕Cin，Cout = AB + ACin + BCin。把 n 个全加器串起来就是行波进位加法器。', 760, 350, function () {
    var b = '';
    b += R(70, 76, 250, 170, 14, 'f-box-2');
    b += T(195, 128, '全加器', 'n', 'middle', 18);
    b += T(195, 152, 'FA', 'n', 'middle', 12);
    var ins = [['A', 112, 24], ['B', 150, 24], ['Cin', 188, 18]];
    ins.forEach(function (p) {
      b += L(26, p[1], 70, p[1], 'f-wire');
      b += T(22, p[1] + 4, p[0], 'n', 'end', 12);
    });
    b += L(320, 142, 390, 142, 'f-wire');
    b += T(402, 147, 'S', 'n', 'start', 14);
    b += L(320, 212, 390, 212, 'f-wire');
    b += T(402, 217, 'Cout', 'n', 'start', 14);
    b += T(195, 282, 'S = A⊕B⊕Cin', 'sym', 'middle', 12);
    b += T(195, 304, 'Cout = AB + ACin + BCin', 'sym', 'middle', 11);
    // truth table as a real 5-column table
    var cols = [480, 522, 564, 608, 668];
    var head = ['A', 'B', 'Cin', 'S', 'Cout'];
    var ty = 92;
    head.forEach(function (h, i) { b += T(cols[i], ty, h, 'n', 'middle', 10); });
    b += L(464, ty + 12, 706, ty + 12, 'f-line');
    var rows = [
      ['0', '0', '0', '0', '0'], ['0', '0', '1', '1', '0'],
      ['0', '1', '0', '1', '0'], ['0', '1', '1', '0', '1'],
      ['1', '0', '0', '1', '0'], ['1', '0', '1', '0', '1'],
      ['1', '1', '0', '0', '1'], ['1', '1', '1', '1', '1']
    ];
    rows.forEach(function (r, i) {
      var y = 132 + i * 26;
      b += '<rect x="462" y="' + (y - 17) + '" width="248" height="24" rx="4" class="' + (i % 2 ? 'f-box-0' : 'f-box') + '"/>';
      r.forEach(function (v, j) { b += T(cols[j], y, v, 'v', 'middle', 10); });
    });
    b += T(380, 336, 'Cout 也可以写成多数表决：三个输入里至少两个为 1。', 'muted', 'middle');
    return b;
  });

  /* ================= 4. 行波进位加法器 ================= */
  wrap('ripple', '4 位行波进位加法器', '每一级把本位和进位交给下一级；进位要穿过所有级，因此最坏延迟随位数线性增长。', 770, 260, function () {
    var b = '';
    b += T(380, 32, 'C0 → C1 → C2 → C3 → C4', 'n', 'middle', 12);
    for (var i = 0; i < 4; i++) {
      var x = 66 + i * 170;
      b += R(x, 84, 120, 84, 10, 'f-box-2');
      b += T(x + 60, 116, 'FA' + (3 - i), 'n', 'middle', 13);
      b += L(x + 60, 56, x + 60, 84, 'f-wire');
      b += T(x + 60, 48, 'A' + (3 - i) + ', B' + (3 - i), 'tiny', 'middle');
      b += L(x + 60, 168, x + 60, 196, 'f-wire');
      b += T(x + 60, 212, 'S' + (3 - i), 'n', 'middle', 11);
      if (i < 3) b += AR(x + 120, 126, x + 170, 126);
    }
    b += L(36, 126, 66, 126, 'f-wire');
    b += T(28, 131, 'C0', 'n', 'end', 11);
    b += AR(696, 126, 736, 126);
    b += T(744, 131, 'C4', 'n', 'start', 11);
    b += T(380, 246, '位数越多，进位链越长；超前进位就是把这个链打断。', 'muted', 'middle');
    return b;
  });

  /* ================= 5. ALU ================= */
  wrap('alu', 'ALU：算术与逻辑的共用通路', 'A、B 进入运算单元，ALUop 选择运算；结果与 Zero、Carry、Overflow 等标志一起送出。', 760, 300, function () {
    var b = '';
    b += '<path class="f-box" d="M240 62 L450 96 L450 204 L240 238 Z"/>';
    b += T(345, 140, 'ALU', 'n', 'middle', 24);
    b += T(345, 164, 'n 位', 'n', 'middle', 12);
    b += L(170, 104, 240, 104, 'f-wire');
    b += T(160, 109, 'A', 'n', 'end', 14);
    b += L(170, 196, 240, 196, 'f-wire');
    b += T(160, 201, 'B', 'n', 'end', 14);
    b += L(345, 238, 345, 276, 'f-wire');
    b += T(345, 292, 'ALUop', 'n', 'middle', 11);
    b += L(450, 150, 540, 150, 'f-wire');
    b += T(540, 136, 'Y', 'n', 'middle', 15);
    b += C(540, 104, 4, 'f-accent');
    b += L(450, 104, 540, 104, 'f-thin');
    b += T(552, 108, 'Zero', 'tiny', 'start');
    b += C(540, 196, 4, 'f-accent');
    b += L(450, 196, 540, 196, 'f-thin');
    b += T(552, 200, 'Carry / V', 'tiny', 'start');
    var ops = [['000', 'AND'], ['001', 'OR'], ['010', 'ADD'], ['110', 'SUB'], ['111', 'SLT']];
    b += T(620, 64, 'ALUop → 运算', 'tiny', 'start');
    ops.forEach(function (o, i) {
      b += T(620, 90 + i * 24, o[0], 'n', 'start', 10);
      b += T(680, 90 + i * 24, o[1], 'n', 'start', 10);
    });
    return b;
  });

  /* ================= 6. IEEE 754 ================= */
  wrap('ieee', 'IEEE 754 单精度：1 + 8 + 23', '符号位决定正负；阶码用偏置 127 的移码；尾数存储去掉隐含的 1.0，所以实际有效位是 24 位。', 760, 260, function () {
    var x = 70, y = 92, w = 620, h = 48;
    var sw = w * 1 / 32, ew = w * 8 / 32, fw = w * 23 / 32;
    var b = '';
    b += R(x, y, sw - 2, h, 6, 'f-accent');
    b += R(x + sw, y, ew - 2, h, 6, 'f-box-2');
    b += R(x + sw + ew, y, fw - 2, h, 6, 'f-box');
    b += T(x + sw / 2, y + 29, 'S', 'n on-a', 'middle', 14);
    b += T(x + sw + ew / 2, y + 29, '阶码 8 位', 'n', 'middle', 12);
    b += T(x + sw + ew + fw / 2, y + 29, '尾数 23 位', 'n', 'middle', 12);
    b += T(x, y - 18, '31', 'tiny', 'middle');
    b += T(x + sw, y - 18, '30', 'tiny', 'middle');
    b += T(x + sw + ew, y - 18, '23', 'tiny', 'middle');
    b += T(x + w, y - 18, '0', 'tiny', 'middle');
    b += T(x + sw / 2, y + h + 24, '1 位', 'tiny', 'middle');
    b += T(x + sw + ew / 2, y + h + 24, '8 位', 'tiny', 'middle');
    b += T(x + sw + ew + fw / 2, y + h + 24, '23 位', 'tiny', 'middle');
    b += T(380, 216, '值 = (−1)^S × 1.F × 2^(E−127)', 'n', 'middle', 15);
    b += T(380, 242, '例：0x42C80000 → S=0，E=133，F=0.5625 → +100.0', 'tiny', 'middle');
    return b;
  });

  /* ================= 7. 计数器 ================= */
  wrap('counter', '带使能与并行装载的计数器', 'EN=1 时才计数，LOAD=1 时在下一个时钟沿装载 D；否则保持当前值。', 760, 260, function () {
    var b = '';
    b += R(250, 64, 240, 132, 12, 'f-box-2');
    b += T(370, 104, '计数器', 'n', 'middle', 18);
    b += T(370, 126, 'N 位', 'tiny', 'middle');
    b += L(160, 92, 250, 92, 'f-wire');
    b += T(150, 97, 'CLK', 'n', 'end', 11);
    b += L(160, 126, 250, 126, 'f-wire');
    b += T(150, 131, 'EN', 'n', 'end', 11);
    b += L(160, 160, 250, 160, 'f-wire');
    b += T(150, 165, 'LOAD', 'n', 'end', 11);
    b += L(160, 180, 250, 180, 'f-wire');
    b += T(150, 185, 'D', 'n', 'end', 11);
    b += L(490, 126, 580, 126, 'f-wire');
    b += T(592, 131, 'Q', 'n', 'start', 14);
    var seq = ['000', '001', '010', '011', '100', '101', '110', '111'];
    b += T(70, 216, '计数序列', 'tiny', 'start');
    seq.forEach(function (s, i) {
      var x = 70 + i * 82;
      b += R(x, 226, 62, 24, 6, i % 2 ? 'f-box-2' : 'f-box');
      b += T(x + 31, 242, s, 'v', 'middle', 9);
    });
    b += T(380, 54, '时钟沿到来时按控制信号更新', 'tiny', 'middle');
    return b;
  });

  /* ================= 8. SRAM 阵列 ================= */
  wrap('sram', '存储器阵列：行译码 + 列选择', '地址的高位送行译码器选中一行，低位送列多路器选中一列；位线把被选中的单元读到输出。', 760, 360, function () {
    var b = '';
    // row decoder + wordlines
    b += T(120, 42, '行地址', 'tiny', 'middle');
    b += L(120, 50, 120, 84, 'f-wire');
    b += R(70, 84, 90, 186, 10, 'f-box-2');
    b += T(115, 166, '行译码', 'n', 'middle', 11);
    b += T(115, 184, '2:4', 'tiny', 'middle');
    for (var r = 0; r < 4; r++) {
      b += L(160, 115 + r * 48, 260, 115 + r * 48, 'f-wire');
      b += T(250, 111 + r * 48, 'WL' + r, 'tiny', 'end');
      for (var c = 0; c < 4; c++) {
        b += R(260 + c * 66, 96 + r * 48, 58, 38, 6, (r + c) % 3 === 0 ? 'f-box-2' : 'f-box');
      }
    }
    b += T(430, 64, '4 × 4 存储单元', 'tiny', 'start');
    // bitlines down to column mux
    for (var c = 0; c < 4; c++) {
      b += L(289 + c * 66, 278, 289 + c * 66, 306, 'f-thin');
    }
    b += R(250, 306, 270, 28, 8, 'f-box-2');
    b += T(385, 325, '列多路器', 'n', 'middle', 11);
    // column address into mux
    b += L(385, 334, 385, 348, 'f-wire');
    b += T(400, 346, '列地址', 'tiny', 'start');
    // data out of mux
    b += L(520, 320, 620, 320, 'f-wire');
    b += T(632, 325, '数据', 'n', 'start', 12);
    return b;
  });

  /* ================= 9. 指令格式 ================= */
  function segBar(x, y, w, h, fields) {
    var b = '', total = 32, cur = x;
    fields.forEach(function (f, i) {
      var sw = w * f.bits / total;
      b += R(cur, y, sw - 2, h, 5, i % 2 ? 'f-box-2' : 'f-box');
      if (sw > 43) b += T(cur + sw / 2, y + h / 2 + 4, f.label, 'n', 'middle', 10);
      else b += T(cur + sw / 2, y - 6, f.label, 'n', 'middle', 8);
      cur += sw;
    });
    cur = x;
    fields.forEach(function (f) {
      var sw = w * f.bits / total;
      b += T(cur + sw / 2, y + h + 17, f.bits + ' 位', 'tiny', 'middle');
      cur += sw;
    });
    b += T(x, y - 20, '31', 'tiny', 'middle');
    b += T(x + w, y - 20, '0', 'tiny', 'middle');
    return b;
  }
  wrap('instr_r', 'R 型指令：寄存器—寄存器', 'opcode=0，靠 funct 区分运算；rs、rt 是源，rd 是目的，shamt 是移位量。', 760, 250, function () {
    var b = '';
    var fields = [
      { label: 'opcode', bits: 6 }, { label: 'rs', bits: 5 }, { label: 'rt', bits: 5 },
      { label: 'rd', bits: 5 }, { label: 'shamt', bits: 5 }, { label: 'funct', bits: 6 }
    ];
    b += segBar(60, 86, 640, 48, fields);
    b += T(380, 170, '例：add $t0, $s3, $s4  →  000000 10011 10100 01000 00000 100000', 'sym', 'middle', 10);
    b += T(380, 204, 'R 型没有立即数；所有操作数都在寄存器里。', 'muted', 'middle');
    return b;
  });
  wrap('instr_ij', 'I 型与 J 型：立即数与跳转', 'I 型把 16 位立即数塞进指令；J 型用 26 位目标地址，与 PC+4 的高 4 位拼接。', 760, 320, function () {
    var b = '';
    b += T(60, 42, 'I 型（addi / lw / sw / beq）', 'n', 'start', 11);
    b += segBar(60, 76, 640, 44, [
      { label: 'opcode', bits: 6 }, { label: 'rs', bits: 5 }, { label: 'rt', bits: 5 }, { label: 'imm / offset', bits: 16 }
    ]);
    b += T(60, 174, 'J 型（j / jal）', 'n', 'start', 11);
    b += segBar(60, 208, 640, 44, [
      { label: 'opcode', bits: 6 }, { label: 'target address', bits: 26 }
    ]);
    b += T(380, 298, 'I 型立即数符号扩展；分支偏移以字为单位，相对 PC+4。', 'muted', 'middle');
    return b;
  });
  wrap('instr_all', '三种 MIPS 指令格式', '所有指令都是 32 位：R 型靠 funct，I 型含 16 位立即数，J 型含 26 位目标地址。', 760, 340, function () {
    var b = '';
    b += T(50, 34, 'R', 'n', 'start', 12);
    b += segBar(50, 52, 660, 38, [
      { label: 'opcode', bits: 6 }, { label: 'rs', bits: 5 }, { label: 'rt', bits: 5 },
      { label: 'rd', bits: 5 }, { label: 'shamt', bits: 5 }, { label: 'funct', bits: 6 }
    ]);
    b += T(50, 134, 'I', 'n', 'start', 12);
    b += segBar(50, 152, 660, 38, [
      { label: 'opcode', bits: 6 }, { label: 'rs', bits: 5 }, { label: 'rt', bits: 5 }, { label: 'immediate', bits: 16 }
    ]);
    b += T(50, 234, 'J', 'n', 'start', 12);
    b += segBar(50, 252, 660, 38, [
      { label: 'opcode', bits: 6 }, { label: 'target', bits: 26 }
    ]);
    return b;
  });

  /* ================= 10. 栈帧 ================= */
  wrap('stack', '函数调用与栈帧', '调用者把参数放到栈上，callee 保存返回地址和寄存器；$sp 指向栈顶，栈向低地址增长。', 760, 330, function () {
    var x = 250, w = 250;
    var rows = [
      ['高地址', '调用者的栈帧', 'f-box-2'],
      ['', '参数 5…', 'f-box-2'],
      ['', '返回地址 $ra', 'f-accent'],
      ['', '保存的 $s0–$s7', 'f-box-2'],
      ['', '局部变量', 'f-box-2'],
      ['低地址', '空闲区', 'f-box']
    ];
    var b = '';
    rows.forEach(function (r, i) {
      var y = 46 + i * 42;
      b += R(x, y, w, 38, 6, r[2]);
      b += T(x + 12, y + 24, r[1], 'n' + (r[2] === 'f-accent' ? ' on-a' : ''), 'start', 11);
      b += T(x - 12, y + 24, r[0], 'tiny', 'end');
    });
    // $sp 指向已分配栈帧的底部（低地址一侧），不是空闲区内部
    b += AR(560, 252, 500, 252);
    b += T(572, 256, '$sp', 'n', 'start', 12);
    b += T(380, 318, '进入函数：addi $sp, $sp, −frame；返回：恢复现场并 jr $ra。', 'muted', 'middle');
    return b;
  });

  /* ================= 11. 寻址方式 ================= */
  wrap('addressing', '五种寻址方式', '同一个“取操作数”的动作，地址可以来自寄存器、指令字段、基址加偏移或 PC。', 760, 320, function () {
    var b = '';
    var rows = [
      ['寄存器', '操作数 = R[rs]', 'add $t0,$s1,$s2'],
      ['立即数', '操作数 = imm', 'addi $t0,$s1,5'],
      ['基址 + 偏移', '地址 = R[rs] + imm', 'lw $t0,8($sp)'],
      ['PC 相对', '地址 = PC+4 + imm×4', 'beq $s0,$s1,L'],
      ['伪直接', '地址 = PC高4位 ‖ target×4', 'j target']
    ];
    rows.forEach(function (r, i) {
      var y = 54 + i * 52;
      b += R(50, y, 120, 38, 6, 'f-box-2');
      b += T(110, y + 24, r[0], 'n', 'middle', 10);
      b += T(196, y + 24, r[1], 'sym', 'start', 10);
      b += T(560, y + 24, r[2], 'sym', 'start', 10);
    });
    b += T(380, 312, '寻址方式决定了指令里哪些字段参与地址计算。', 'muted', 'middle');
    return b;
  });

  /* ================= 12. 单周期数据通路 ================= */
  wrap('datapath', '单周期数据通路', '每条指令在一个周期内走完整条通路：取指、读寄存器、ALU、访存、写回。最长的一条路径决定时钟周期。', 760, 340, function () {
    var b = '';
    var boxes = [
      ['PC', 36, 120, 70, 50, 'f-box-2'],
      ['指令存储器', 140, 110, 110, 70, 'f-box'],
      ['寄存器文件', 300, 100, 120, 90, 'f-box-2'],
      ['ALU', 470, 120, 80, 70, 'f-box'],
      ['数据存储器', 600, 110, 110, 70, 'f-box']
    ];
    boxes.forEach(function (x) {
      b += R(x[1], x[2], x[3], x[4], 10, x[5]);
      b += T(x[1] + x[3] / 2, x[2] + x[4] / 2 + 5, x[0], 'n', 'middle', x[0].length > 4 ? 9 : 12);
    });
    b += AR(106, 145, 140, 145);
    b += AR(250, 145, 300, 145);
    b += AR(420, 145, 470, 145);
    b += AR(550, 145, 600, 145);
    b += P('M655 110 V70 H340 V100', 'f-wire');
    b += ARROW(340, 100, 'd');
    b += T(470, 62, '写回', 'tiny', 'middle');
    b += T(380, 300, '控制单元根据 opcode 产生 RegWrite、MemRead、ALUSrc 等信号。', 'muted', 'middle');
    return b;
  });

  /* ================= 13. 流水线 ================= */
  wrap('pipeline', '五级流水线', '把一条指令拆成 IF、ID、EX、MEM、WB 五段，每个周期同时有 5 条指令在不同阶段推进。', 760, 360, function () {
    var b = '';
    var st = ['IF', 'ID', 'EX', 'MEM', 'WB'];
    st.forEach(function (s, i) {
      var x = 34 + i * 146;
      b += R(x, 48, 120, 44, 8, 'f-box' + (i === 2 ? '-2' : ''));
      b += T(x + 60, 76, s, 'n', 'middle', 14);
    });
    for (var i = 0; i < 4; i++) b += AR(154 + i * 146, 70, 180 + i * 146, 70);
    // timing grid
    var gx = 72, gy = 130, cw = 100, rh = 34;
    for (var c = 0; c < 6; c++) {
      b += T(gx + c * cw + 40, gy - 10, 'C' + (c + 1), 'n', 'middle', 9);
    }
    ['I1', 'I2', 'I3', 'I4'].forEach(function (ins, r) {
      b += T(40, gy + r * rh + 22, ins, 'n', 'middle', 10);
      for (var c = 0; c < 6; c++) {
        var stage = c - r;
        if (stage >= 0 && stage < 5) {
          b += R(gx + c * cw, gy + r * rh, cw - 4, rh - 4, 4, (c + r) % 2 ? 'f-box' : 'f-box-2');
          b += T(gx + c * cw + (cw - 4) / 2, gy + r * rh + 22, st[stage], 'n', 'middle', 8);
        }
      }
    });
    b += T(380, 332, '理想情况下，流水线填满后每个周期完成一条指令（CPI≈1）。', 'muted', 'middle');
    return b;
  });

  /* ================= 14. 数据冒险 ================= */
  wrap('hazard', 'load-use 冒险：停顿一拍', '上一条 lw 的结果要到 MEM 后才可用；下一条指令若立即使用，就必须停顿一拍。转发可以消除大部分 ALU 冒险，但无法消除 load-use 的这一拍。', 760, 300, function () {
    var b = '';
    var gx = 120, gy = 70, cw = 96, rh = 42;
    for (var c = 0; c < 6; c++) b += T(gx + c * cw + 40, gy - 12, 'C' + (c + 1), 'n', 'middle', 9);
    var rows = [
      ['lw', ['IF', 'ID', 'EX', 'MEM', 'WB']],
      ['add', ['', 'IF', 'ID', 'STALL', 'EX', 'MEM']],
      ['sub', ['', '', 'IF', 'STALL', 'ID', 'EX']]
    ];
    rows.forEach(function (row, r) {
      b += T(56, gy + r * rh + 26, row[0], 'n', 'middle', 11);
      row[1].forEach(function (s, c) {
        if (!s) return;
        var cls = s === 'STALL' ? 'f-accent' : 'f-box' + ((c + r) % 2 ? '-2' : '');
        b += R(gx + c * cw, gy + r * rh, cw - 4, rh - 6, 4, cls);
        b += T(gx + c * cw + (cw - 4) / 2, gy + r * rh + 24, s, 'n' + (s === 'STALL' ? ' on-a' : ''), 'middle', 9);
      });
    });
    b += AR(430, 240, 430, 198);
    b += T(430, 258, '停顿', 'tiny', 'middle');
    b += T(380, 284, '转发可消除大部分 ALU 冒险；load-use 仍需停顿一拍。', 'muted', 'middle');
    return b;
  });

  /* ================= 15. 存储层次 ================= */
  wrap('hierarchy', '存储层次：容量、速度与价格', '越靠近 CPU 越快越小越贵；越远越大越慢越便宜。Cache 用局部性把“大而慢”伪装成“小而快”。', 760, 330, function () {
    var b = '';
    var tiers = [
      ['寄存器', '几十个 / 1 周期', 220, 'f-accent'],
      ['L1 Cache', '32–64 KB / 2–4 周期', 300, 'f-box-2'],
      ['L2 Cache', '256 KB–1 MB / ~10 周期', 380, 'f-box'],
      ['主存 DRAM', 'GB 级 / ~100 周期', 460, 'f-box-2'],
      ['磁盘 / SSD', 'TB 级 / 10⁵–10⁶ 周期', 560, 'f-box']
    ];
    tiers.forEach(function (t, i) {
      var y = 44 + i * 54;
      var left = (760 - t[2]) / 2;
      b += R(left, y, t[2], 40, 6, t[3]);
      b += T(380, y + 25, t[0], 'n' + (i === 0 ? ' on-a' : ''), 'middle', 11);
      b += T(left + t[2] - 14, y + 25, t[1], 'tiny' + (i === 0 ? ' on-a' : ''), 'end', 8.5);
    });
    b += T(380, 320, '局部性：时间局部性 + 空间局部性。', 'muted', 'middle');
    return b;
  });

  /* ================= 16. Cache 地址拆分 ================= */
  wrap('cache_addr', 'Cache 地址：tag / index / offset', 'offset 选块内字节，index 选 cache 行，tag 与行内存的 tag 比较判断命中。', 760, 330, function () {
    var x = 60, y = 70, w = 640, h = 44;
    var b = '';
    var tw = w * 20 / 32, iw = w * 8 / 32, ow = w * 4 / 32;
    b += R(x, y, tw - 2, h, 5, 'f-box-2');
    b += R(x + tw, y, iw - 2, h, 5, 'f-box');
    b += R(x + tw + iw, y, ow - 2, h, 5, 'f-accent');
    b += T(x + tw / 2, y + 28, 'Tag（20 位）', 'n', 'middle', 11);
    b += T(x + tw + iw / 2, y + 28, 'Index（8 位）', 'n', 'middle', 10);
    b += T(x + tw + iw + ow / 2, y + 28, '偏移（4 位）', 'n on-a', 'middle', 9);
    b += T(x, y - 14, '31', 'tiny', 'middle');
    b += T(x + w, y - 14, '0', 'tiny', 'middle');
    // cache rows
    var cy = 156;
    b += T(60, cy - 12, 'Cache（4 行示例）', 'tiny', 'start');
    b += T(240, cy - 12, 'Valid', 'tiny', 'middle');
    b += T(370, cy - 12, 'Tag', 'tiny', 'middle');
    b += T(500, cy - 12, 'Data', 'tiny', 'middle');
    for (var i = 0; i < 4; i++) {
      var yy = cy + i * 34;
      b += R(60, yy, 620, 26, 4, i === 1 ? 'f-box-2' : 'f-box-0');
      b += T(180, yy + 18, '行 ' + i, 'v', 'middle', 9);
      b += T(240, yy + 18, i === 1 ? '1' : '0', 'v', 'middle', 10);
      b += T(370, yy + 18, i === 1 ? '0x1A2' : '—', 'v', 'middle', 9);
      b += T(500, yy + 18, i === 1 ? '块数据…' : '', 'tiny', 'middle');
    }
    b += T(380, 310, '命中：Valid=1 且 Tag 相等；否则缺失，从下一级取整个块。', 'muted', 'middle');
    return b;
  });

  /* ================= 17. 页表与地址转换 ================= */
  wrap('page_table', '虚拟地址 → 页表 → 物理地址', '虚拟页号 VPN 查页表得到物理页帧号 PPN，页内偏移不变。TLB 只是页表的高速缓存。', 760, 330, function () {
    var b = '';
    // virtual address
    b += T(50, 58, '虚拟地址', 'n', 'start', 11);
    b += R(50, 72, 156, 38, 6, 'f-box-2');
    b += T(128, 96, 'VPN', 'n', 'middle', 11);
    b += R(212, 72, 80, 38, 6, 'f-box');
    b += T(252, 96, 'offset', 'n', 'middle', 10);
    // physical address
    b += T(470, 58, '物理地址', 'n', 'start', 11);
    b += R(470, 72, 120, 38, 6, 'f-box-2');
    b += T(530, 96, 'PPN', 'n', 'middle', 11);
    b += R(596, 72, 80, 38, 6, 'f-box');
    b += T(636, 96, 'offset', 'n', 'middle', 10);
    // VPN -> page table
    b += AR(128, 112, 128, 168);
    b += T(140, 148, '查页表', 'tiny', 'start');
    b += R(48, 168, 164, 76, 8, 'f-box');
    b += T(130, 196, '页表项 PTE', 'n', 'middle', 10);
    b += T(130, 216, 'PPN + 权限位', 'tiny', 'middle');
    // PTE -> physical PPN
    b += P('M212 206 H404 V93 H470', 'f-wire');
    b += ARROW(470, 93, 'r');
    b += T(318, 190, 'PPN', 'n', 'middle', 9);
    // offset unchanged: route above the bars, no crossing
    b += P('M292 72 V34 H636 V72', 'f-wire');
    b += ARROW(636, 72, 'd');
    b += T(464, 26, 'offset 原样复制', 'tiny', 'middle');
    // TLB
    b += R(300, 248, 220, 34, 7, 'f-box-0');
    b += T(410, 270, 'TLB：页表的高速缓存', 'n', 'middle', 10);
    b += T(380, 310, 'TLB 命中时跳过页表；缺失时才访问内存中的页表。', 'muted', 'middle');
    return b;
  });

  /* ================= 18. I/O 三种方式 ================= */
  wrap('io', '轮询、中断与 DMA', '轮询让 CPU 反复问设备；中断让设备主动通知；DMA 让设备直接搬内存，CPU 只在结束时介入。', 760, 300, function () {
    var b = '';
    var rows = [
      ['轮询', ['CPU 查询', 'CPU 查询', 'CPU 查询', '传输'], 'f-box'],
      ['中断', ['CPU 忙', '设备准备', '中断', '传输'], 'f-box-2'],
      ['DMA', ['CPU 配置', '设备直接读写内存', '完成中断'], 'f-box']
    ];
    rows.forEach(function (r, i) {
      var y = 60 + i * 76;
      b += T(54, y + 28, r[0], 'n', 'middle', 10);
      var x = 120;
      r[1].forEach(function (cell, j) {
        var w = j === 2 && i === 2 ? 300 : 150;
        b += R(x, y, w, 42, 6, r[2]);
        b += T(x + w / 2, y + 26, cell, 'n', 'middle', 10);
        x += w + 8;
      });
    });
    b += T(380, 284, 'DMA 把“搬数据”从 CPU 手里拿走，适合大块传输。', 'muted', 'middle');
    return b;
  });

  /* ---------- 补映射 ---------- */
  var addMap = {
    'ch4-intro': 'module',
    'ch4-fsm': 'fsm_struct',
    'ch5-adder-basics': 'full_adder',
    'ch5-carry': 'ripple',
    'ch5-alu': 'alu',
    'ch5-float': 'ieee',
    'ch5-counter': 'counter',
    'ch5-memory': 'sram',
    'ch6-rtype': 'instr_r',
    'ch6-itype': 'instr_ij',
    'ch6-call': 'stack',
    'ch6-addr': 'addressing',
    'ch7-single-dp': 'datapath',
    'ch7-pipe-dp': 'pipeline',
    'ch7-data-hazard': 'hazard',
    'ch8-hierarchy': 'hierarchy',
    'ch8-cache-line': 'cache_addr',
    'ch8-mapping': 'cache_addr',
    'ch8-pagetable': 'page_table',
    'ch8-tlb': 'page_table',
    'ch8-io': 'io',
    'ref-mips': 'instr_r',
    'ref-machine': 'instr_all',
    'ref-mem': 'hierarchy'
  };
  Object.keys(addMap).forEach(function (k) { F.map[k] = addMap[k]; });
})();

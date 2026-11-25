window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q0-001',
    ch: 0,
    sec: 'ref-num',
    topic: '补码范围',
    diff: 1,
    type: 'single',
    stem: '8 位补码 <code>10000000</code> 表示的十进制数是？',
    hint: '先看最高位的权。',
    options: ['−128', '−0', '128', '−127'],
    answer: 0,
    explain: '最高位权为 −2<sup>7</sup> = −128，其余七位全 0，所以值是 −128。它是 8 位补码的最小负数，取反加一仍得到 <code>10000000</code>，即 −128 的相反数在 8 位内不存在（+128 溢出）。<code>−0</code> 只出现在符号-幅值与反码中；−127 是 <code>10000001</code>。见「数制与补码速查」的补码公式与范围。'
  },
  {
    id: 'q0-002',
    ch: 0,
    sec: 'ref-num',
    topic: '十六进制转十进制',
    diff: 1,
    type: 'fill',
    stem: '十六进制 <code>0x2ED</code> 等于十进制多少？只填十进制数字。',
    placeholder: '如 123',
    accept: ['749'],
    explain: '按权展开：0x2ED = 2×16<sup>2</sup> + 14×16 + 13 = 512 + 224 + 13 = 749。也可以先分组转成二进制 <code>0010 1110 1101</code>，再按 2 的幂相加。速查位置：「数制与补码速查」的十六进制数字对照表与 2 的幂表。'
  },
  {
    id: 'q0-003',
    ch: 0,
    sec: 'ref-num',
    topic: '补码表示',
    diff: 2,
    type: 'bin',
    stem: '用下面 8 个位开关拼出补码 −37。',
    hint: '先写 +37 的二进制，再取反加一。',
    lab: { bits: 8, signed: true, value: -37, showHex: true },
    explain: '+37 = <code>00100101</code>；各位取反得 <code>11011010</code>，再加 1 得 <code>11011011</code>（0xDB）。验证：−128 + 64 + 16 + 8 + 2 + 1 = −37。注意这里的加 1 没有产生进位（最低位是 0），若最低位是 1，进位会一路传到第一个 0 为止。见「数制与补码速查」的“取反加一”规则。'
  },
  {
    id: 'q0-004',
    ch: 0,
    sec: 'ref-gate',
    topic: 'NAND 的通用性',
    diff: 1,
    type: 'single',
    stem: '只允许使用二输入 NAND 门，实现非门（Y = <span class="ovl">A</span>）的正确接法是？',
    options: [
      '把 NAND 的两个输入都接到 A',
      '把一个输入接 A、另一个输入接 0',
      '把两个 NAND 串联，输入都接 A',
      '把一个输入接 A、另一个输入接 <span class="ovl">A</span>'
    ],
    answer: 0,
    explain: 'NAND 的定义是“先与再非”：两个输入都接 A 时，A·A = A，再取反得 <span class="ovl">A</span>。另外两种接法都让输出恒为 1：接 0 时 A·0 = 0，取反得 1；接 <span class="ovl">A</span> 时 A·<span class="ovl">A</span> = 0，取反同样得 1。两个 NAND 串联等于取反两次，得到的是 A 而不是 <span class="ovl">A</span>。见「逻辑门速查」的“只用 NAND 实现”表。'
  },
  {
    id: 'q0-005',
    ch: 0,
    sec: 'ref-gate',
    topic: '门的布尔式',
    diff: 1,
    type: 'match',
    stem: '把每个门与它的布尔表达式配对。',
    lab: {
      pairs: [
        ['AND', 'Y = A·B'],
        ['NAND', 'Y = <span class="ovl">A·B</span>'],
        ['XOR', 'Y = A⊕B'],
        ['XNOR', 'Y = <span class="ovl">A⊕B</span>']
      ]
    },
    explain: 'AND 全 1 才为 1，NAND 是它的整体取反；XOR 相异为 1，XNOR 是 XOR 的整体取反（相同为 1）。注意 NAND 是“先与再非”，不是“两个输入各自取反再与”——后者按德摩根等于 NOR 的形式。见「逻辑门速查」的八个基本门表。'
  },
  {
    id: 'q0-006',
    ch: 0,
    sec: 'ref-cmos',
    topic: '噪声容限',
    diff: 2,
    type: 'single',
    stem: '某 5 V 逻辑的 V<sub>IL</sub>=1.2 V、V<sub>IH</sub>=3.0 V、V<sub>OL</sub>=0.4 V、V<sub>OH</sub>=3.6 V。高电平噪声容限 NM<sub>H</sub> 为？',
    options: ['0.6 V', '0.8 V', '2.4 V', '3.2 V'],
    answer: 0,
    explain: 'NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub> = 3.6 − 3.0 = 0.6 V。0.8 V 是低电平噪声容限 NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub> = 1.2 − 0.4；2.4 V 与 3.2 V 是把输出电平与错误的门限相减得到的。见「CMOS 与电气参数」的噪声容限公式。'
  },
  {
    id: 'q0-007',
    ch: 0,
    sec: 'ref-cmos',
    topic: '动态功耗',
    diff: 2,
    type: 'fill',
    stem: '某节点电容 C = 5 fF，V<sub>DD</sub> = 3 V，每周期翻转一次、频率 f = 2 GHz。动态功耗是多少 μW？只填数字。',
    placeholder: '如 12.5',
    accept: ['45', '45.0'],
    unit: 'μW',
    explain: 'P = ½CV<sub>DD</sub><sup>2</sup>f = ½ × 5×10<sup>−15</sup> F × (3 V)<sup>2</sup> × 2×10<sup>9</sup> Hz = 45×10<sup>−6</sup> W = 45 μW。两个易错点：V<sub>DD</sub> 要平方（不是乘 2），并且只有当节点每周期完成一次 0→1→0 时系数才是 ½。见「CMOS 与电气参数」的功耗公式。'
  },
  {
    id: 'q0-008',
    ch: 0,
    sec: 'ref-bool',
    topic: '消去定理',
    diff: 1,
    type: 'single',
    stem: '化简 Y = A + <span class="ovl">A</span>B 的结果是？',
    options: ['A + B', 'A', 'AB', 'B'],
    answer: 0,
    explain: '用消去定理：A + <span class="ovl">A</span>B = A + B。验算：A=1 时两边都是 1；A=0 时左边是 B，右边也是 B。错答 A 是把“吸收律 A + AB = A”与消去定理混了——吸收律里那一项必须是 A 本身，不带反。见「布尔代数定理」的多变量定理表。'
  },
  {
    id: 'q0-009',
    ch: 0,
    sec: 'ref-bool',
    topic: '对偶原理',
    diff: 2,
    type: 'fill',
    stem: '按对偶原理，把 B + CD 中的“与/或”互换（0 与 1 也互换），得到的对偶式是什么？用括号表示，如 A(B+C)。',
    placeholder: '如 A(B+C)',
    accept: ['B(C+D)', '(C+D)B'],
    explain: 'B + CD 的对偶式是 B(C + D)：最外层的或变与，里面的与变或，变量与层次都不动。它其实是分配律的另一半 B + CD = (B + C)(B + D)，所以“对偶”不是造新公式，而是同一条定理换了个说法。见「布尔代数定理」的公理与对偶说明。'
  },
  {
    id: 'q0-010',
    ch: 0,
    sec: 'ref-kmap',
    topic: '卡诺图边界相邻',
    diff: 3,
    type: 'single',
    stem: '四变量卡诺图中，最小项 0、2、8、10 恰好位于四个角。它们合并后得到？',
    options: [
      '<span class="ovl">B</span><span class="ovl">D</span>',
      '<span class="ovl">A</span><span class="ovl">C</span>',
      'BD',
      'AC'
    ],
    answer: 0,
    explain: 'm0=0000、m2=0010、m8=1000、m10=1010。四个最小项里 B 恒为 0、D 恒为 0，A 与 C 取遍四种组合，故合并为 <span class="ovl">B</span><span class="ovl">D</span>。四角相邻是卡诺图的边界规则；若只按“同行同列”找圈，就会漏掉这个最大的圈。见「卡诺图规则」的圈法五条。'
  },
  {
    id: 'q0-011',
    ch: 0,
    sec: 'ref-kmap',
    topic: '圈的合法性',
    diff: 3,
    type: 'tf',
    stem: '卡诺图的圈允许互相重叠；在最简圈法中，每个圈至少要含一个不被其他圈覆盖的 1。',
    answer: 1,
    explain: '正确。圈可以重叠（同一个 1 被几个圈共用很常见），但如果某个圈里的所有 1 都已被别的圈覆盖，这个圈就是多余的：删掉它不影响覆盖，表达式反而更短。所以“每圈至少有一个专属的 1”是判断圈是否必要的实用标准。见「卡诺图规则」第 3 条。'
  },
  {
    id: 'q0-012',
    ch: 0,
    sec: 'ref-seq',
    topic: '建立时间约束',
    diff: 2,
    type: 'single',
    stem: '某同步电路 t<sub>pcq</sub>=0.08 ns、t<sub>setup</sub>=0.05 ns、触发器之间的组合逻辑 t<sub>pd</sub>=1.20 ns。最小时钟周期 T<sub>c</sub> 为？',
    options: ['1.33 ns', '1.28 ns', '1.25 ns', '1.20 ns'],
    answer: 0,
    explain: 'T<sub>c</sub> ≥ t<sub>pcq</sub> + t<sub>pd</sub> + t<sub>setup</sub> = 0.08 + 1.20 + 0.05 = 1.33 ns，对应 f<sub>max</sub> ≈ 752 MHz。漏掉 t<sub>setup</sub> 得 1.28 ns，漏掉 t<sub>pcq</sub> 得 1.25 ns，只算组合逻辑得 1.20 ns——三个干扰项正对应三种典型漏项。见「时序与触发器参数」的建立时间方程。'
  },
  {
    id: 'q0-013',
    ch: 0,
    sec: 'ref-seq',
    topic: '保持时间约束',
    diff: 3,
    type: 'tf',
    stem: '保持时间约束 t<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub> 与时钟周期无关，因此把时钟周期加长并不能修复保持时间违例。',
    answer: 1,
    explain: '正确。保持检查的是“同一个时钟沿之后，新数据会不会来得太快冲掉旧数据”，观察窗口只有 t<sub>hold</sub> 那么长，与周期长短无关。修复办法是增大该路径的最小延迟 t<sub>cd</sub>（插缓冲器或延时单元），或调整时钟偏移；降频只对建立时间违例有效。见「时序与触发器参数」的两条方程。'
  },
  {
    id: 'q0-014',
    ch: 0,
    sec: 'ref-verilog',
    topic: '锁存器推断',
    diff: 2,
    type: 'single',
    stem: '下面哪种写法会（意外地）综合出锁存器？',
    options: [
      '在 always_comb 中写 if (en) y = d; 而没有 else',
      'assign y = s ? d1 : d0;',
      'always_ff @(posedge clk) q &lt;= d;',
      'always_comb 中 case 的每个分支都赋值并写了 default'
    ],
    answer: 0,
    explain: '组合 always 块里只要有某条路径没给输出赋值，综合器就必须“保持”原值，于是推断出锁存器——这里 en=0 时 y 没有赋值。修法是在块首给所有输出默认值，或补全 if/else。三目赋值是纯 MUX，always_ff 是触发器，带 default 的 case 覆盖了全部分支，都不会产生锁存器。见「Verilog 语法模板」的写法与综合结果表。'
  },
  {
    id: 'q0-015',
    ch: 0,
    sec: 'ref-verilog',
    topic: '阻塞赋值',
    diff: 1,
    type: 'fill',
    stem: '按本书规范，组合逻辑写在 always_comb 中，应使用哪种赋值？填“阻塞”或“非阻塞”。',
    placeholder: '阻塞 / 非阻塞',
    accept: ['阻塞', '阻塞赋值', 'blocking'],
    explain: '组合逻辑用阻塞赋值 <code>=</code>：语句按顺序立即生效，建模的是信号一路传过去的组合路径。时序逻辑才用非阻塞赋值 <code>&lt;=</code>，让块内所有触发器在时间步末同时更新。两者混用是“仿真对、综合错”的经典来源。见「Verilog 语法模板」的两种赋值表。'
  }
]);

window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q4-001',
    ch: 4,
    sec: 'ch4-intro',
    topic: '模块与端口',
    diff: 1,
    type: 'single',
    stem: '关于 Verilog 的 <code>module</code>，下列说法正确的是？',
    options: [
      '模块只能有一个输出端口',
      '模块通过端口与外界连接，内部可包含信号和子模块实例',
      '模块必须包含 <code>always</code> 块才能综合',
      '模块名必须与文件名不同'
    ],
    answer: 1,
    explain: '模块是黑盒：端口负责进出，内部可以声明信号、写 <code>assign</code>/<code>always</code>，也可以实例化子模块。端口数量不限，纯 <code>assign</code> 的模块同样能综合；模块名与文件名可以相同，通常也建议相同。'
  },
  {
    id: 'q4-002',
    ch: 4,
    sec: 'ch4-intro',
    topic: 'HDL 语义',
    diff: 2,
    type: 'tf',
    stem: '因为 <code>always</code> 块像 C 函数一样顺序执行，所以可以把 C 循环直接搬进 Verilog 综合。',
    answer: 0,
    explain: '<code>always</code> 描述的是硬件结构，不是软件函数。<code>if</code> 对应多路选择器，<code>case</code> 对应译码器，<code>for</code> 在综合时被展开成多份硬件。C 循环里的“迭代”在硬件里往往意味着复制电路，不能直接照搬。'
  },
  {
    id: 'q4-003',
    ch: 4,
    sec: 'ch4-intro',
    topic: '设计流程',
    diff: 2,
    type: 'order',
    stem: '把从文本描述到可制造网表的主要步骤排序。',
    explain: '先用 RTL 描述电路，再通过功能仿真确认行为；逻辑综合把 RTL 映射成门级网表，随后布局布线确定物理位置，最后做门级/时序验证。综合之后就不能再随意改 RTL 语义了。',
    lab: {
      items: ['编写 RTL 代码', '功能仿真', '逻辑综合', '布局布线', '门级/时序验证'],
      prompt: '按 HDL 设计流程从先到后排列'
    }
  },
  {
    id: 'q4-004',
    ch: 4,
    sec: 'ch4-intro',
    topic: '模块与端口',
    diff: 1,
    type: 'hdl',
    stem: '实现 1 位与非门：输入 <code>a</code>、<code>b</code>，输出 <code>y = ~(a &amp; b)</code>。只需组合逻辑。',
    explain: '与非门是先与再取反，写成 <code>assign y = ~(a &amp; b);</code>。常见错误是漏掉括号写成 <code>~a &amp; b</code>，那只对 <code>a</code> 取反；也不能写成逻辑与 <code>a &amp;&amp; b</code>。',
    lab: {
      inputs: [{ name: 'a', width: 1 }, { name: 'b', width: 1 }],
      outputs: [{ name: 'y', width: 1 }],
      tests: [
        { in: { a: 0, b: 0 }, out: { y: 1 } },
        { in: { a: 0, b: 1 }, out: { y: 1 } },
        { in: { a: 1, b: 0 }, out: { y: 1 } },
        { in: { a: 1, b: 1 }, out: { y: 0 } }
      ],
      template: 'module nand2(input logic a, b,\n             output logic y);\n  // 在这里编写\nendmodule',
      solution: 'module nand2(input logic a, b,\n             output logic y);\n  assign y = ~(a & b);\nendmodule',
      moduleName: 'nand2'
    }
  },
  {
    id: 'q4-005',
    ch: 4,
    sec: 'ch4-ops',
    topic: '缩位与',
    diff: 1,
    type: 'single',
    stem: '<code>a = 4\'b1011</code>，则 <code>assign y = &amp;a;</code> 得到的 <code>y</code> 是？',
    options: ['<code>1\'b0</code>', '<code>1\'b1</code>', '<code>4\'b1011</code>', '<code>4\'b0100</code>'],
    answer: 0,
    explain: '缩位与把所有位相与：1 &amp; 0 &amp; 1 &amp; 1 = 0，结果为 1 位。它不是按位与，所以不会得到 4 位结果；只有全 1 时 <code>&amp;a</code> 才为 1。'
  },
  {
    id: 'q4-006',
    ch: 4,
    sec: 'ch4-ops',
    topic: '缩位异或',
    diff: 1,
    type: 'fill',
    stem: '<code>assign y = ^8\'b1011_0110;</code>，<code>y</code> 是 1 位。填 0 或 1。',
    accept: ['1', "1'b1", "1'b00000001"],
    placeholder: '0 或 1',
    explain: '缩位异或看 1 的个数：1011_0110 中有 5 个 1，是奇数，所以 <code>^</code> 的结果为 1。它等价于奇校验位。'
  },
  {
    id: 'q4-007',
    ch: 4,
    sec: 'ch4-ops',
    topic: '缩位运算',
    diff: 2,
    type: 'multi',
    stem: '关于缩位运算，下列说法正确的有？',
    options: [
      '<code>&amp;4\'b1111</code> 的值为 <code>1\'b1</code>',
      '<code>|4\'b0000</code> 的值为 <code>1\'b0</code>',
      '<code>^4\'b1010</code> 的值为 <code>1\'b1</code>',
      '<code>~|a</code> 在 <code>a</code> 全 0 时为 1',
      '<code>&amp;a</code> 会把 <code>a</code> 的最高位直接取出'
    ],
    answer: [0, 1, 3],
    explain: 'A、B 分别验证“全 1 才为 1”“全 0 才为 0”；D 是零检测的常用写法。C 错在 1010 有两个 1，<code>^</code> 应为 0；E 错在缩位与是把所有位相与，不是取最高位。'
  },
  {
    id: 'q4-008',
    ch: 4,
    sec: 'ch4-ops',
    topic: '按位异或',
    diff: 2,
    type: 'hdl',
    stem: '实现 4 位按位异或：输入 <code>a</code>、<code>b</code>（各 4 位），输出 <code>y = a ^ b</code>（4 位）。',
    explain: '按位异或直接写 <code>assign y = a ^ b;</code>。它逐位比较，结果仍是 4 位；不要写成逻辑异或或缩位异或，后者会把 4 位压成 1 位。',
    lab: {
      inputs: [{ name: 'a', width: 4 }, { name: 'b', width: 4 }],
      outputs: [{ name: 'y', width: 4 }],
      tests: [
        { in: { a: 0, b: 0 }, out: { y: 0 } },
        { in: { a: 5, b: 3 }, out: { y: 6 } },
        { in: { a: 10, b: 10 }, out: { y: 0 } },
        { in: { a: 15, b: 0 }, out: { y: 15 } },
        { in: { a: 12, b: 5 }, out: { y: 9 } }
      ],
      template: 'module xor4(input logic [3:0] a, b,\n            output logic [3:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module xor4(input logic [3:0] a, b,\n            output logic [3:0] y);\n  assign y = a ^ b;\nendmodule',
      moduleName: 'xor4'
    }
  },
  {
    id: 'q4-009',
    ch: 4,
    sec: 'ch4-assign',
    topic: '条件赋值',
    diff: 1,
    type: 'single',
    stem: '要用条件赋值实现 2:1 MUX：<code>s=1</code> 时选 <code>d1</code>，<code>s=0</code> 时选 <code>d0</code>。正确的是？',
    options: [
      '<code>assign y = s ? d1 : d0;</code>',
      '<code>assign y = s ? d0 : d1;</code>',
      '<code>assign y = s &amp; d1;</code>',
      '<code>assign y = s | d0;</code>'
    ],
    answer: 0,
    explain: '三目运算符先判断 <code>s</code>：为 1 取冒号前的 <code>d1</code>，为 0 取冒号后的 <code>d0</code>。B 把两路写反；C、D 只做了与/或，<code>s=0</code> 时不能保证选中 <code>d0</code>。'
  },
  {
    id: 'q4-010',
    ch: 4,
    sec: 'ch4-assign',
    topic: '嵌套条件赋值',
    diff: 2,
    type: 'fill',
    stem: '<code>d0..d3</code> 依次为 1、2、4、8（4 位二进制），<code>s1=1, s0=0</code>。求 <code>y = s1 ? (s0 ? d3 : d2) : (s0 ? d1 : d0)</code> 的十进制值。',
    accept: ['4', "4'b0100", '0100'],
    placeholder: '十进制数',
    explain: '<code>s1=1</code> 选外层冒号前的分支；<code>s0=0</code> 在内层选冒号后的 <code>d2</code>，即 4。常见错误是把内外层看反，或把 <code>s0=0</code> 误选成 <code>d3</code>（8）；先定外层，再进入对应分支看内层，就不容易错。'
  },
  {
    id: 'q4-011',
    ch: 4,
    sec: 'ch4-assign',
    topic: '运算符优先级',
    diff: 2,
    type: 'single',
    stem: '表达式 <code>a &amp; b | c</code> 等价于？',
    options: [
      '<code>(a &amp; b) | c</code>',
      '<code>a &amp; (b | c)</code>',
      '<code>(a | b) &amp; c</code>',
      '语法错误，必须加括号'
    ],
    answer: 0,
    explain: '<code>&amp;</code> 的优先级高于 <code>|</code>，所以先算 <code>a &amp; b</code>，再与 <code>c</code> 相或。虽然语法合法，但工程上仍建议写成带括号的形式，避免读者误判。'
  },
  {
    id: 'q4-012',
    ch: 4,
    sec: 'ch4-assign',
    topic: '门级实现 MUX',
    diff: 2,
    type: 'gate',
    stem: '用逻辑门实现 2:1 MUX：<code>s=1</code> 选 <code>b</code>，<code>s=0</code> 选 <code>a</code>。',
    explain: 'MUX 的与或式是 <code>(s &amp; b) | (~s &amp; a)</code>：两个二输入与门分别产生两条通路，非门得到 <code>~s</code>，或门把结果合并。共 2 个与门、1 个非门、1 个或门。',
    lab: {
      inputs: ['s', 'a', 'b'],
      outs: ['y'],
      rows: [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 1, 1]
      ],
      allowed: ['AND', 'OR', 'NOT'],
      maxGates: 4,
      expr: '(s & b) | (~s & a)',
      note: '先算 s&amp;b 和 ~s&amp;a，再用或门合并'
    }
  },
  {
    id: 'q4-013',
    ch: 4,
    sec: 'ch4-assign',
    topic: '多路选择器',
    diff: 2,
    type: 'hdl',
    stem: '实现 4 位 2:1 多路选择器：<code>s=1</code> 时 <code>y=d1</code>，否则 <code>y=d0</code>。',
    explain: '条件赋值直接对应 2:1 MUX：<code>assign y = s ? d1 : d0;</code>。注意操作数是 4 位，不要写成只比较最低位，也不要漏掉 <code>s</code> 的控制作用。',
    lab: {
      inputs: [{ name: 'd0', width: 4 }, { name: 'd1', width: 4 }, { name: 's', width: 1 }],
      outputs: [{ name: 'y', width: 4 }],
      tests: [
        { in: { d0: 3, d1: 12, s: 0 }, out: { y: 3 } },
        { in: { d0: 3, d1: 12, s: 1 }, out: { y: 12 } },
        { in: { d0: 15, d1: 0, s: 0 }, out: { y: 15 } },
        { in: { d0: 5, d1: 10, s: 1 }, out: { y: 10 } },
        { in: { d0: 9, d1: 9, s: 0 }, out: { y: 9 } }
      ],
      template: 'module mux2_4(input logic [3:0] d0, d1,\n              input logic s,\n              output logic [3:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module mux2_4(input logic [3:0] d0, d1,\n              input logic s,\n              output logic [3:0] y);\n  assign y = s ? d1 : d0;\nendmodule',
      moduleName: 'mux2_4'
    }
  },
  {
    id: 'q4-014',
    ch: 4,
    sec: 'ch4-numbers',
    topic: '进制转换',
    diff: 1,
    type: 'single',
    stem: '<code>8\'hA5</code> 的十进制值是？',
    options: ['165', '105', '181', '149'],
    answer: 0,
    explain: '十六进制 A 是 10，所以 <code>8\'hA5</code> = 10×16 + 5 = 165。常见错误是把 A 当成 11，得到 181；或把十六进制当十进制直接拼成 105。'
  },
  {
    id: 'q4-015',
    ch: 4,
    sec: 'ch4-numbers',
    topic: '进制转换',
    diff: 1,
    type: 'fill',
    stem: '<code>6\'b101101</code> 的十进制值是？',
    accept: ['45', "6'd45"],
    placeholder: '十进制数',
    explain: '按权展开：32 + 8 + 4 + 1 = 45。也可以每 3 位分组看成八进制 55，再转十进制。'
  },
  {
    id: 'q4-016',
    ch: 4,
    sec: 'ch4-numbers',
    topic: '符号扩展',
    diff: 2,
    type: 'fill',
    stem: '<code>a = 4\'b1010</code>，<code>y = {{4{a[3]}}, a}</code> 的 8 位结果，用 <code>0x</code> 前缀写十六进制。',
    accept: ['0xFA', 'FA', "8'hFA"],
    placeholder: '0x??',
    explain: '<code>a[3]=1</code>，复制 4 次得到高 4 位 1111，与低 4 位 1010 拼接为 1111_1010，即 <code>0xFA</code>。若写成零扩展 <code>{4\'b0, a}</code> 会得到 <code>0x0A</code>，数值从 −6 变成 +10。'
  },
  {
    id: 'q4-017',
    ch: 4,
    sec: 'ch4-numbers',
    topic: '符号扩展',
    diff: 2,
    type: 'hdl',
    stem: '把 4 位有符号数 <code>a</code> 符号扩展到 8 位输出 <code>y</code>：高 4 位复制 <code>a[3]</code>。',
    explain: '符号扩展复制最高位：<code>assign y = {a[3], a[3], a[3], a[3], a};</code>。也可写 <code>{{4{a[3]}}, a}</code>。常见错误是补 0（零扩展），那只适用于无符号数。',
    lab: {
      inputs: [{ name: 'a', width: 4 }],
      outputs: [{ name: 'y', width: 8 }],
      tests: [
        { in: { a: 0 }, out: { y: 0 } },
        { in: { a: 7 }, out: { y: 7 } },
        { in: { a: 8 }, out: { y: 248 } },
        { in: { a: 15 }, out: { y: 255 } }
      ],
      template: 'module sext4(input logic [3:0] a,\n             output logic [7:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module sext4(input logic [3:0] a,\n             output logic [7:0] y);\n  assign y = {a[3], a[3], a[3], a[3], a};\nendmodule',
      moduleName: 'sext4'
    }
  },
  {
    id: 'q4-018',
    ch: 4,
    sec: 'ch4-structural',
    topic: '命名端口',
    diff: 1,
    type: 'single',
    stem: '实例化子模块时，<code>.a(a[0])</code> 这种端口写法的主要好处是？',
    options: [
      '按端口名连接，位置改变也不易接错',
      '比位置连接综合得更快',
      '自动把位宽补齐',
      '可以省略实例名'
    ],
    answer: 0,
    explain: '命名连接把“端口名”和“信号名”显式对应，模块端口顺序调整时不用改实例；它不会自动补齐位宽，也不能省略实例名。位宽不匹配仍会被截断或补零。'
  },
  {
    id: 'q4-019',
    ch: 4,
    sec: 'ch4-structural',
    topic: '端口连接',
    diff: 2,
    type: 'tf',
    stem: '结构化建模中，子模块实例的端口必须按定义顺序书写，不能用名字连接。',
    answer: 0,
    explain: '恰好相反：既可以用位置连接（按声明顺序），也可以用命名连接（<code>.a(sig)</code>）。端口较多时命名连接更可靠，因为增删端口不会悄悄改变对应关系。'
  },
  {
    id: 'q4-020',
    ch: 4,
    sec: 'ch4-structural',
    topic: '门级实现表决器',
    diff: 2,
    type: 'gate',
    stem: '用逻辑门实现三输入多数表决：三个输入中至少两个为 1 时输出 1。',
    explain: '多数表决的与或式是 <code>(a &amp; b) | (a &amp; c) | (b &amp; c)</code>：任意两票为 1 就通过。需要 3 个二输入与门和 2 个或门；只用异或无法表达“至少两个”。',
    lab: {
      inputs: ['a', 'b', 'c'],
      outs: ['y'],
      rows: [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 1, 1]
      ],
      allowed: ['AND', 'OR'],
      maxGates: 5,
      expr: '(a & b) | (a & c) | (b & c)',
      note: '三个二输入与门，再用两个或门合并'
    }
  },
  {
    id: 'q4-021',
    ch: 4,
    sec: 'ch4-structural',
    topic: '位置连接',
    diff: 2,
    type: 'single',
    stem: '位置连接 <code>and2 g1(a[0], a[1], y01);</code> 中，端口对应关系由什么决定？',
    options: [
      '端口在模块声明中的顺序',
      '端口名的字母顺序',
      '信号的位宽',
      '实例名 g1'
    ],
    answer: 0,
    explain: '位置连接严格按模块声明时端口的先后顺序对应，所以第一个实参接第一个端口。<code>and2</code> 声明为 <code>(a, b, y)</code>，于是 <code>a[0]</code> 接 <code>a</code>、<code>a[1]</code> 接 <code>b</code>、<code>y01</code> 接 <code>y</code>。'
  },
  {
    id: 'q4-022',
    ch: 4,
    sec: 'ch4-seq',
    topic: '寄存器与锁存器',
    diff: 1,
    type: 'single',
    stem: '寄存器与锁存器的主要区别是？',
    options: [
      '寄存器在时钟沿采样，锁存器在使能电平期间透明',
      '寄存器只能存 1 位',
      '锁存器一定比寄存器快',
      '寄存器不需要复位'
    ],
    answer: 0,
    explain: '触发器（寄存器）是边沿触发，只在时钟沿更新；锁存器是电平敏感，使能有效期间输入直接传到输出。寄存器可以存多位，也需要复位来进入确定状态。'
  },
  {
    id: 'q4-023',
    ch: 4,
    sec: 'ch4-seq',
    topic: '复位方式',
    diff: 2,
    type: 'fill',
    stem: '<code>always_ff @(posedge clk or posedge reset)</code> 描述的复位属于哪种？填“同步”或“异步”。',
    accept: ['异步', '异步复位'],
    placeholder: '同步 / 异步',
    explain: '<code>reset</code> 出现在敏感表里，复位一有效就立即清零，不等待时钟沿，所以是异步复位。若敏感表只有 <code>posedge clk</code>，复位只在时钟沿检查，才是同步复位。'
  },
  {
    id: 'q4-024',
    ch: 4,
    sec: 'ch4-seq',
    topic: '使能寄存器',
    diff: 3,
    type: 'tf',
    stem: '带使能的寄存器 <code>always_ff @(posedge clk) if (en) q &lt;= d;</code> 因为没有 <code>else</code>，会综合出锁存器。',
    answer: 0,
    explain: '在 <code>always_ff</code> 中，<code>en=0</code> 时没有新赋值意味着“保持原值”，综合出的是带使能的触发器，不是锁存器。锁存器问题出在组合 <code>always_comb</code> 中缺少赋值路径；时序块里的“保持”本来就是触发器语义。'
  }
);

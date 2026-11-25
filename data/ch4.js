window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.sections[4] = {
  num: 4,
  intro: '从门到代码：用 HDL 描述、仿真并综合出硬件。',
  sections: [
    {
      id: 'ch4-intro',
      num: '4.1',
      title: '模块与设计流程',
      lead: 'HDL 描述的是电路，不是程序。',
      tag: '基础',
      blocks: [
        { t: 'p', html: '第 2、3 章我们用手画门和触发器。电路一大，图就画不动了，于是改用<b>硬件描述语言</b>（HDL）把电路写成文本，再交给工具去仿真与综合。关键认知只有一句：HDL 描述的是硬件，不是程序。' },
        { t: 'def', title: '模块（module）', html: '模块是 HDL 的基本单位，相当于一个黑盒。它用<b>端口</b>列出输入输出，在内部声明信号与子模块，并用 <code>assign</code> 或 <code>always</code> 描述行为。顶层模块就是整块芯片的边界。' },
        { t: 'p', html: '端口方向有三种：<code>input</code> 只读，<code>output</code> 只写，<code>inout</code> 用于三态双向总线。位宽写在名字前，如 <code>output logic [3:0] y</code>；位宽写错会被截断或补零。描述行为有两种基本写法：连续赋值 <code>assign</code> 适合一行能写出的组合表达式；过程块 <code>always_comb</code>/<code>always_ff</code> 适合需要 <code>if</code>、<code>case</code> 或多条语句的场合。两者不是风格偏好，而是对应不同的硬件描述方式。' },
        { t: 'code', lang: 'verilog', title: '最简单的模块：反相器', code: 'module inv(input  logic a,\n           output logic y);\n  assign y = ~a;\nendmodule' },
        { t: 'p', html: 'Verilog 在 1984 年出现，1995 年成为 IEEE 1364 标准；SystemVerilog（IEEE 1800）是它的超集，补上了 <code>logic</code>、<code>enum</code>、<code>always_comb</code>/<code>always_ff</code> 等类型与写法。VHDL 源自美国国防部的 VHSIC 计划，标准号为 IEEE 1076，类型检查更严格。本书例子以 SystemVerilog 为主，VHDL 对照理解即可。' },
        { t: 'table', title: '两种主流 HDL', head: ['语言', '标准', '特点'], rows: [
          ['Verilog', 'IEEE 1364', '语法接近 C，工业界使用广泛'],
          ['SystemVerilog', 'IEEE 1800', 'Verilog 超集，增加类型、接口、断言'],
          ['VHDL', 'IEEE 1076', '类型严格，航空航天领域常用']
        ] },
        { t: 'table', title: '仿真与综合的分工', head: ['环节', '仿真 simulation', '综合 synthesis'], rows: [
          ['做什么', '按时间步进计算电路行为', '把 RTL 翻译成门级网表'],
          ['关心', '功能是否正确、时序是否满足', '面积、延迟、功耗'],
          ['可用写法', '几乎任意，可加延时、<code>$display</code>', '仅可综合子集，无延时、无 <code>initial</code> 硬件语义']
        ] },
        { t: 'warn', title: '最常见的误解', html: '把 <code>always</code> 块当成 C 函数，以为语句从上到下立刻改变变量。实际上 <code>always</code> 描述硬件结构：<code>if</code> 综合成多路选择器，<code>case</code> 综合成译码器，<code>for</code> 循环在综合时被展开成多份硬件。写每一行都要问：这对应哪些门、哪些连线？' },
        { t: 'quote', html: '先想电路，再写代码；写完再问一遍：这会综合出什么？', cite: '本章主线' }
      ]
    },
    {
      id: 'ch4-ops',
      num: '4.2.1',
      title: '位运算与缩位运算',
      lead: '按位运算逐位算，缩位运算把多位压成一位。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '位运算是逐位进行的：两个 4 位信号相与，得到的是 4 个独立的与门输出。<code>~</code>、<code>&amp;</code>、<code>|</code>、<code>^</code> 分别对应非、与、或、异或，与非写成 <code>~(a &amp; b)</code>。' },
        { t: 'table', title: '常用位运算符', head: ['运算', 'Verilog', '说明'], rows: [
          ['非', '<code>~a</code>', '按位取反'],
          ['与', '<code>a &amp; b</code>', '按位与'],
          ['或', '<code>a | b</code>', '按位或'],
          ['异或', '<code>a ^ b</code>', '按位异或'],
          ['与非', '<code>~(a &amp; b)</code>', '先与再取反']
        ] },
        { t: 'p', html: '注意 <code>&amp;</code> 与 <code>&amp;&amp;</code> 的区别：<code>&amp;</code> 是按位与，结果与操作数等宽；<code>&amp;&amp;</code> 是逻辑与，只关心“是否非零”，结果恒为 1 位。<code>4\'b1010 &amp; 4\'b1100</code> 得 <code>4\'b1000</code>，而 <code>4\'b1010 &amp;&amp; 4\'b1100</code> 得 <code>1\'b1</code>。多位信号上混用两者，是仿真能过、波形全错的常见原因。' },
        { t: 'def', title: '缩位运算符（reduction）', html: '缩位运算符是一元运算符，把多位信号压成 1 位：<code>&amp;a</code> 表示所有位相与（全 1 才为 1）；<code>|a</code> 表示所有位相或（有 1 就为 1）；<code>^a</code> 表示所有位异或（1 的个数为奇数时结果为 1，即奇校验）。' },
        { t: 'p', html: '位运算最常见的用途是<b>掩码</b>（mask）：想保留某些位就与 1 相与，想清零就与 0 相与，想翻转就与 1 异或。例如 <code>y = a &amp; 4\'b1111_0000;</code> 只保留高 4 位，低 4 位清零。缩位运算符与位运算符共用符号，靠“有没有左操作数”区分：<code>a &amp; b</code> 是位与，<code>&amp;a</code> 是缩位与；读代码时先看运算符左边有没有东西。' },
        { t: 'code', lang: 'verilog', title: '缩位运算的典型用法', code: 'assign all_ones = &a;       // 全 1 检测\nassign zero     = ~|a;      // 全 0 检测\nassign any      = |a;       // 非零检测\nassign parity   = ^data;    // 奇校验：1 的个数为奇数时输出 1' },
        { t: 'formula', html: '<code>~|a = 1</code> 当且仅当 <code>a</code> 的每一位都为 0；<code>|a = 0</code> 同样说明 <code>a</code> 全 0。', note: '零检测写成 <code>~|a</code> 最简洁，也最不容易被综合器误解。' },
        { t: 'example', title: '例：手算缩位', html: '取 <code>a = 4\'b1010</code>。<code>&amp;a = 0</code>（并非全 1），<code>|a = 1</code>（存在 1），<code>^a = 0</code>（两个 1，偶数）。若取 <code>a = 4\'b1011</code>，则 <code>^a = 1</code>（三个 1，奇数）。手算时先数 1 的个数，比逐位展开快。' },
        { t: 'warn', title: '别把位运算写成逻辑运算', html: '不要把缩位与写成 <code>a &amp;&amp; b</code>，也不要把 <code>^</code> 当成幂运算。C 里 <code>^</code> 是异或，Verilog 相同；但 Verilog 的 <code>~</code> 是按位非，<code>!</code> 才是逻辑非。对多位信号写 <code>!a</code> 只得到 1 位结果。' },
        { t: 'exam', title: '考试高频', html: '常直接给一个 4 位或 8 位常量，问 <code>&amp;a</code>、<code>|a</code>、<code>^a</code> 的值；也可能问 <code>~|a</code> 的含义。记住：缩位看全体，逻辑看真假。' }
      ]
    },
    {
      id: 'ch4-assign',
      num: '4.2.4',
      title: '条件赋值与内部信号',
      lead: '三目运算符就是一个 2:1 多路选择器。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '条件赋值 <code>assign y = s ? d1 : d0;</code> 就是二选一：<code>s</code> 为 1 时 <code>y</code> 取 <code>d1</code>，否则取 <code>d0</code>。它综合出的正是一个 2:1 多路选择器（MUX），不是“if 语句”。' },
        { t: 'code', lang: 'verilog', title: '用嵌套条件赋值写 4:1 MUX', code: 'assign y = sel[1] ? (sel[0] ? d3 : d2)\n                  : (sel[0] ? d1 : d0);' },
        { t: 'p', html: '嵌套三目可以描述更多路选择，但 <code>?:</code> 是右结合的，且优先级很低，复杂表达式必须加括号。上面 4:1 的写法按 <code>sel[1]</code> 分成两组，再在组内按 <code>sel[0]</code> 选择，读起来就是一棵选择树。' },
        { t: 'def', title: '内部信号', html: '内部信号用 <code>logic</code> 声明，写在模块内、端口之外，用来保存子表达式或连接子模块。SystemVerilog 的 <code>logic</code> 是四值类型（0/1/X/Z），既可以由 <code>assign</code> 连续赋值驱动，也可以在 <code>always</code> 块中赋值；VHDL 中对应 <code>signal</code>。' },
        { t: 'p', html: '条件赋值与 <code>always_comb</code> 可以互相改写：<code>assign y = s ? d1 : d0;</code> 等价于 <code>always_comb if (s) y = d1; else y = d0;</code>。前者适合一行能写完的选择，后者适合多分支或需要中间变量的场合。优先级在硬件里就是“谁离输出更近”：<code>if/else</code> 链中越靠前的条件优先级越高，嵌套三目中越外层的选择越先决定。' },
        { t: 'table', title: '运算符优先级（节选）', head: ['优先级（高→低）', '运算符'], rows: [
          ['1', '<code>~</code> 位非'],
          ['2', '算术 <code>+ - * /</code>'],
          ['3', '移位 <code>&lt;&lt; &gt;&gt;</code>'],
          ['4', '关系与相等 <code>&lt; &lt;= == !=</code>'],
          ['5', '<code>&amp;</code>'],
          ['6', '<code>^</code>'],
          ['7', '<code>|</code>'],
          ['8', '<code>&amp;&amp;</code> 与 <code>||</code>'],
          ['9', '<code>?:</code>']
        ] },
        { t: 'p', html: '优先级表只用于查错，不用于炫技。综合工具与仿真器对个别边界的结合方式可能不同，团队规范通常要求：一个表达式里出现三种以上运算符，就加括号分组。' },
        { t: 'warn', title: '两个经典优先级错误', html: '把 <code>a &amp; b | c</code> 读成 <code>a &amp; (b | c)</code> 是典型错误：<code>&amp;</code> 的优先级高于 <code>|</code>，实际是 <code>(a &amp; b) | c</code>。条件赋值也常被写错：<code>s1 ? s0 ? d3 : d2 : d1</code> 虽然能按右结合解析，但可读性差，应写成 <code>s1 ? (s0 ? d3 : d2) : d1</code>。' },
        { t: 'example', title: '例：4:1 MUX 的两种写法', html: '数据输入 <code>d0</code>–<code>d3</code>，选择 <code>sel[1:0]</code>，输出 <code>y</code>。用 <code>case</code> 最直观；用条件赋值则写 <code>assign y = sel[1] ? (sel[0] ? d3 : d2) : (sel[0] ? d1 : d0);</code>。两种写法综合结果等价，区别在可读性与优先级表达。' }
      ]
    },
    {
      id: 'ch4-numbers',
      num: '4.2.7',
      title: '数字常量、X 与 Z',
      lead: '位宽写全，未知值要查清来源。',
      tag: '基础',
      blocks: [
        { t: 'p', html: 'Verilog 常量格式为“位宽 + 单引号 + 进制 + 数字”，例如 <code>4\'b1010</code>、<code>8\'hA5</code>、<code>32\'d42</code>。位宽省略时默认 32 位，进制省略时默认十进制。写 RTL 时建议总把位宽写全，让截断与拼接的结果可预测。' },
        { t: 'table', title: '常见常量', head: ['写法', '含义', '十进制值'], rows: [
          ['<code>4\'b1010</code>', '4 位二进制', '10'],
          ['<code>8\'hA5</code>', '8 位十六进制', '165'],
          ['<code>32\'d42</code>', '32 位十进制', '42'],
          ['<code>4\'b1x01</code>', '含未知位', '不确定'],
          ['<code>1\'bz</code>', '高阻', '不是 0']
        ] },
        { t: 'p', html: '同一个数值在不同位宽下含义不同。<code>4\'b1010</code> 是 10；把它赋给 8 位信号会零扩展成 <code>00001010</code>；把 <code>8\'hA5</code> 赋给 4 位信号则只保留低 4 位 <code>0101</code>（即 5）。综合工具通常给出位宽警告，但不会替你修正设计。' },
        { t: 'def', title: 'X 与 Z', html: '<code>1\'bx</code> 表示未知或无关：仿真中任何与 X 的普通运算大多得到 X，综合时它可被当作 don\'t care。<code>1\'bz</code> 表示高阻，用于三态总线：输出使能关闭时，驱动器让出总线。两者都不是“0”，不能混用。' },
        { t: 'key', title: '仿真出现 X 的常见原因', items: [
          '缺少复位或未初始化，寄存器上电后为 X；',
          '同一信号被两个 <code>always</code> 块或 <code>assign</code> 驱动，产生冲突；',
          '数组/存储器读地址越界，或读从未写入的位置；',
          '组合逻辑存在环路，或敏感表不完整。'
        ] },
        { t: 'code', lang: 'verilog', title: '拼接、复制与扩展', code: 'assign y  = {a[3:0], b[7:4]};  // 拼接：高 4 位来自 a，低 4 位来自 b\nassign z  = {4{a[0]}};         // 复制：a[0] 重复 4 次\nassign s  = {{4{a[3]}}, a};    // 符号扩展：把 4 位 a 扩成 8 位\nassign z2 = {4\'b0, a};         // 零扩展：高 4 位补 0' },
        { t: 'p', html: '<b>位混合</b>（bit swizzling）就是把位段重新拼接。花括号 <code>{…}</code> 是拼接，<code>{n{…}}</code> 是复制。符号扩展用最高位复制，零扩展用常量 0 填充；对补码负数，两者结果完全不同。' },
        { t: 'p', html: '十六进制与二进制的关系是每 4 位一组：<code>8\'hA5</code> 展开为 <code>1010_0101</code>。写大的位串时用下划线分组，既不影响数值，也能让位段对齐。仿真里 <code>if (x)</code> 把 X 当作假，<code>if (!x)</code> 也把 X 当作假，两个分支都不走；调试时发现“信号既不是 0 也不是 1”，先查 X 的来源，而不是加默认值掩盖。' },
        { t: 'warn', title: '拼接里的常量也要写位宽', html: '<code>{4\'b0, a}</code> 是零扩展；<code>{0, a}</code> 中的 0 是 32 位常量，会把结果撑成 32 位，再赋给 8 位信号就被截断。另一个常见错误是把复制写成 <code>{a[0], a[0], a[0], a[0]}</code>——虽然结果相同，但位宽一变就要手改。' },
        { t: 'exam', title: '考试高频', html: '<code>8\'hA5</code> 的十进制是 10×16+5=165；<code>4\'b1010</code> 是 10；<code>6\'b101101</code> 是 45。考试常把进制转换与符号扩展放在一起考。' }
      ]
    },
    {
      id: 'ch4-structural',
      num: '4.3',
      title: '结构化建模',
      lead: '把模块当元件，用实例和连线搭电路。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '<b>结构化建模</b>（structural modeling）不写逻辑表达式，而是把已经定义好的模块当成元件，用实例（instance）和连线搭出更大的电路。每个实例都是一份独立的硬件副本，不是函数调用。' },
        { t: 'code', lang: 'verilog', title: '用 and2 搭出 and4', code: 'module and2(input logic a, b, output logic y);\n  assign y = a & b;\nendmodule\n\nmodule and4(input logic [3:0] a, output logic y);\n  logic y01, y23;\n  and2 g1(.a(a[0]), .b(a[1]), .y(y01));   // 命名端口连接\n  and2 g2(.a(a[2]), .b(a[3]), .y(y23));\n  and2 g3(.a(y01),  .b(y23),  .y(y));\nendmodule' },
        { t: 'def', title: '命名连接与位置连接', html: '命名端口连接写成 <code>.端口名(信号)</code>，如 <code>.a(a[0])</code>；位置连接按模块声明时的端口顺序依次对应，如 <code>and2 g1(a[0], a[1], y01)</code>。端口多、位宽复杂时，命名连接更可靠。' },
        { t: 'steps', title: '实例化四步', items: [
          { title: '选模块', html: '确定要复用的模块名与端口列表。' },
          { title: '起名字', html: '每个实例必须有唯一名字，如 <code>g1</code>、<code>u_mux</code>。' },
          { title: '连端口', html: '推荐 <code>.port(signal)</code>；输出端口接 <code>logic</code> 信号或 <code>output</code>。' },
          { title: '查位宽', html: '逐端口核对位宽与方向，尤其是拼接后的信号。' }
        ] },
        { t: 'p', html: '一个完整设计通常有三层以上：顶层连处理器、存储器与 I/O；处理器内部连数据通路与控制器；数据通路内部再连 ALU、寄存器堆。未连接的输入端口会悬空（Z），综合后可能被优化成任意值；未连接的输出端口可以留空，写成 <code>.y()</code>，但输入绝不要留空，宁可直接接 0 或 1。' },
        { t: 'warn', title: '语法正确不等于接对线', html: '位置连接把 <code>a[2]</code> 接到本该接 <code>a[0]</code> 的端口，语法完全合法，综合也不报错，但功能错了。另一个常见问题是把输出端口接到常量或表达式，或者两个实例重名。结构化代码要像检查电路图一样逐根线核对。' },
        { t: 'note', title: '层次化的意义', html: '层次化让大电路变成一棵树：顶层只负责连子系统，子系统内部再连更小的模块。第 1 章的三 Y 原则（层次化、规整化、模块化）在 HDL 里就是模块与实例。' },
        { t: 'example', title: '例：and4 的门数', html: '<code>and4</code> 用 3 个 <code>and2</code> 搭成：<code>g1</code>、<code>g2</code> 先算低两位与高两位，<code>g3</code> 再把两个中间结果相与。总门数 3 个二输入与门；若直接写 <code>assign y = &amp;a;</code>，综合器可能给出同样的树，但结构化写法把“怎么搭”明确写在了代码里。' }
      ]
    },
    {
      id: 'ch4-seq',
      num: '4.4',
      title: '时序逻辑与寄存器',
      lead: '边沿触发用 always_ff，赋值用非阻塞。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '时序逻辑的输出不仅取决于当前输入，还取决于保存的状态。最基本的元件是 D 触发器：在每个时钟上升沿采样 <code>d</code>，把值送到 <code>q</code>。SystemVerilog 用 <code>always_ff</code> 描述这类边沿触发的寄存器。' },
        { t: 'code', lang: 'verilog', title: '一个 D 触发器', code: 'always_ff @(posedge clk)\n  q <= d;          // 非阻塞赋值：综合出 D 触发器' },
        { t: 'p', html: '<code>always_ff</code> 的敏感表只应包含时钟沿（异步复位时再加复位沿）。块内给寄存器赋值要用非阻塞 <code>&lt;=</code>，这样所有寄存器都在同一个时间步末尾一起更新，正确模拟“同时触发”。' },
        { t: 'code', lang: 'verilog', title: '异步复位与同步复位', code: 'always_ff @(posedge clk or posedge reset)   // 异步复位\n  if (reset) q <= 1\'b0;\n  else       q <= d;\n\nalways_ff @(posedge clk)                    // 同步复位\n  if (reset) q <= 1\'b0;\n  else       q <= d;' },
        { t: 'table', title: '同步复位与异步复位', head: ['项目', '同步复位', '异步复位'], rows: [
          ['敏感表', '只有 <code>clk</code>', '<code>clk</code> 与 <code>reset</code>'],
          ['生效时机', '时钟沿', '复位一有效立即生效'],
          ['优点', '抗毛刺、时序分析简单', '不依赖时钟，可强制复位'],
          ['缺点', '需要时钟', '释放时刻需同步，易受毛刺影响']
        ] },
        { t: 'p', html: '寄存器不需要在声明时赋初值；复位逻辑负责把它带到确定状态。FPGA 上电时触发器初值通常为 0，ASIC 则不一定，所以不能依赖“上电默认值”做设计。触发器能正确采样的前提是：数据在时钟沿前足够早稳定（建立时间），并在沿后保持足够久（保持时间）；RTL 阶段能做的是少用异步逻辑、少造组合环路。' },
        { t: 'code', lang: 'verilog', title: '带使能的寄存器与多寄存器', code: 'always_ff @(posedge clk)\n  if (en) q <= d;        // 无 else：en=0 时保持 -> 使能触发器\n\nalways_ff @(posedge clk)\n  if (reset) begin\n    pc    <= 32\'b0;\n    instr <= 32\'b0;\n  end else begin\n    pc    <= pcnext;\n    instr <= imem[pc[9:2]];\n  end' },
        { t: 'warn', title: '三类“能编译、难调试”的错误', html: '在 <code>always_ff</code> 里写 <code>q = d</code> 用的是阻塞赋值，多个寄存器相互依赖时会出现仿真竞争；敏感表写成 <code>@(clk)</code> 只在 <code>clk</code> 变化时触发，可能综合出电平敏感电路；把组合信号放进敏感表，则可能推断出锁存器或意外触发器。' },
        { t: 'key', title: '时序逻辑三条规则', items: [
          '用 <code>always_ff @(posedge clk)</code>，异步复位再加 <code>or posedge reset</code>。',
          '块内一律用非阻塞 <code>&lt;=</code>。',
          '同一寄存器只在一个 <code>always_ff</code> 中赋值。'
        ] },
        { t: 'p', html: '同步复位在时钟沿才生效，抗毛刺好、时序分析简单；异步复位一有效就清零，不依赖时钟，但释放时刻要同步，否则可能进入亚稳态。实际芯片常用“异步复位、同步释放”。' }
      ]
    },
    {
      id: 'ch4-case',
      num: '4.5',
      title: 'case、if 与无关项',
      lead: 'case 像查表，if 像优先级链。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '<code>case</code> 把选择信号与一组常量逐一比较，命中哪个分支就执行哪个。综合工具把它翻译成译码器加多路选择器；分支互斥且覆盖全部取值时，就是纯组合逻辑。' },
        { t: 'code', lang: 'verilog', title: '用 case 写 4:1 MUX', code: 'always_comb\n  case (sel)\n    2\'b00: y = d0;\n    2\'b01: y = d1;\n    2\'b10: y = d2;\n    default: y = d3;      // 必须写 default，否则可能推锁存器\n  endcase' },
        { t: 'p', html: '<code>if/else</code> 综合出的是<b>优先级选择链</b>：第一个为真的条件优先，后面的条件被它屏蔽。条件本身有优先级（例如中断嵌套）时用 <code>if</code> 很自然；若条件互斥，用 <code>case</code> 更清晰，综合结果也更短。' },
        { t: 'table', title: 'if/else 与 case 的分工', head: ['项目', 'if/else', 'case'], rows: [
          ['综合结构', '优先级级联的 MUX', '译码 / 多路选择'],
          ['适用', '条件有优先级', '选择码互斥'],
          ['遗漏后果', '缺 <code>else</code> 可能推锁存器', '缺 <code>default</code> 可能推锁存器']
        ] },
        { t: 'code', lang: 'verilog', title: '带无关项的真值表', code: 'always_comb\n  case ({a, b, c})\n    3\'b000: y = 1\'b0;\n    3\'b001: y = 1\'b1;\n    3\'b010: y = 1\'b0;\n    3\'b01x, 3\'b1xx: y = 1\'bx;   // x 作为无关项，便于综合化简\n    default: y = 1\'b0;\n  endcase' },
        { t: 'p', html: '带无关项的真值表可以把某些输入组合标成 <code>x</code>，让综合器自由选择 0 或 1，以换取更简的逻辑。教材例子中 <code>3\'b01x</code>、<code>3\'b1xx</code> 表示这些组合不关心输出；注意仿真时 <code>x</code> 仍是未知值，不能拿它当“随便”的 0 使用。' },
        { t: 'p', html: '把 <code>case</code> 的每个分支看成真值表的一行：选择码互斥、每行都有输出，综合出来就是干净的组合逻辑。若分支里再嵌套 <code>if</code>，优先级会叠加，读代码时要特别小心。<code>casez</code>/<code>casex</code> 用 <code>?</code> 表示无关位，能让综合器化简，但也容易把 X 当成匹配，初学阶段先用普通 <code>case</code> 加 <code>default</code>。' },
        { t: 'warn', title: '锁存器：意外的硬件', html: '组合 <code>always</code> 块中，只要存在某条路径没有给输出赋值，综合工具就必须“记住”旧值，于是推断出<b>锁存器</b>。典型写法是 <code>always_comb if (en) y = d;</code> 缺 <code>else</code>，或 <code>case</code> 缺 <code>default</code>。锁存器不是语法错误，而是意外硬件：它让时序分析变难，还可能在使能期间把毛刺传到输出。' },
        { t: 'key', title: '避免意外锁存器', items: [
          '在 <code>always_comb</code> 开头给所有输出赋默认值。',
          '写全 <code>if/else</code>，或给 <code>case</code> 加 <code>default</code>。',
          '检查每个输出在每条分支上都被赋值。'
        ] }
      ]
    },
    {
      id: 'ch4-block',
      num: '4.5.4',
      title: '阻塞与非阻塞',
      lead: '一个立即生效，一个在时间步末统一更新。',
      tag: '考点',
      blocks: [
        { t: 'p', html: '<b>阻塞赋值</b> <code>=</code> 立即生效：执行完这一句，右边的值就写进左边，后续语句立刻能看到新值。<b>非阻塞赋值</b> <code>&lt;=</code> 则是“先算右边、稍后统一更新”：块内所有 <code>&lt;=</code> 的右边都用进入时间步时的旧值计算，更新统一发生在时间步末尾。' },
        { t: 'code', lang: 'verilog', title: '两种赋值的语义对照', code: 'always_comb begin\n  t = a & b;   // 阻塞：下一句立即看到新 t\n  y = t | c;\nend\n\nalways_ff @(posedge clk) begin\n  a <= b;      // 非阻塞：右侧用旧值，块末一起更新\n  b <= a;\nend' },
        { t: 'table', title: '场合对照', head: ['电路类型', '块', '赋值'], rows: [
          ['组合逻辑', '<code>always_comb</code>', '<code>=</code> 阻塞'],
          ['时序逻辑', '<code>always_ff</code>', '<code>&lt;=</code> 非阻塞'],
          ['连续赋值', '<code>assign</code>', '<code>=</code>（连续驱动）']
        ] },
        { t: 'p', html: '为什么时序要用非阻塞？因为真实的触发器在同一时钟沿同时采样。若用阻塞写 <code>a = b; b = a;</code>，第一条先把 <code>a</code> 改成 <code>b</code> 的新值，第二条再把 <code>b</code> 改成这个新 <code>a</code>，结果两个寄存器都等于原来的 <code>b</code>，交换失败。用 <code>&lt;=</code> 时两条右边都取旧值，才真正交换。' },
        { t: 'p', html: '以三级移位寄存器 <code>q1 &lt;= d; q2 &lt;= q1; q3 &lt;= q2;</code> 为例，非阻塞让 <code>q2</code> 拿到的是本拍开始时的 <code>q1</code>，而不是刚更新的 <code>q1</code>。若改成阻塞，三行会把同一个 <code>d</code> 在一拍内穿透到 <code>q3</code>，综合出的电路完全不同。同一个 <code>always</code> 块里，非阻塞的右边在块开始时求值，左边在块末更新，因此“先读后写”的顺序不影响结果。' },
        { t: 'warn', title: '三条铁律', html: '组合逻辑用 <code>always_comb</code> + 阻塞；时序逻辑用 <code>always_ff</code> + 非阻塞；同一信号不要在两个 <code>always</code> 块中赋值。违反前两条，典型后果是“仿真通过、综合后功能变了”；违反第三条则产生多驱动，仿真出现 X。' },
        { t: 'note', title: '合法不等于正确', html: '在 <code>always_comb</code> 里写 <code>&lt;=</code> 语法上合法，仿真有时也能得到看似正确的结果，但语义与综合意图不一致，应视为错误风格。反过来，在 <code>always_ff</code> 里写 <code>=</code> 也可能综合出触发器，但多个赋值之间的顺序会让仿真与硬件不一致。' },
        { t: 'exam', title: '考试高频', html: '考题常给一个移位寄存器或交换电路，问用 <code>=</code> 还是 <code>&lt;=</code>。判断标准不是“哪个能出结果”，而是“是否让所有寄存器同时采样旧值”。' }
      ]
    },
    {
      id: 'ch4-fsm',
      num: '4.6',
      title: '有限状态机的 HDL 写法',
      lead: '状态寄存器、次态、输出三块分开写。',
      tag: '考点',
      blocks: [
        { t: 'p', html: '<b>有限状态机</b>（FSM）由三部分组成：保存当前状态的寄存器、根据输入与当前状态算次态的组合逻辑、根据状态（和输入）算输出的组合逻辑。HDL 的写法按这三部分拆成几个 <code>always</code> 块，就有了“一段式/两段式/三段式”之分。' },
        { t: 'table', title: '三种 FSM 写法', head: ['风格', '写法', '评价'], rows: [
          ['一段式', '状态、次态、输出在同一个 <code>always</code>', '简单但难读，易推锁存器'],
          ['两段式', '状态寄存器 + 次态/输出', '较清晰'],
          ['三段式', '状态寄存器 / 次态 / 输出分开', '推荐，综合结果可预测']
        ] },
        { t: 'code', lang: 'verilog', title: '三段式 FSM 骨架', code: 'typedef enum logic [1:0] {S0, S1, S2, S3} statetype;\nstatetype state, nextstate;\n\nalways_ff @(posedge clk or posedge reset)\n  if (reset) state <= S0;\n  else       state <= nextstate;\n\nalways_comb\n  case (state)\n    S0: nextstate = ta ? S0 : (tb ? S1 : S0);\n    S1: nextstate = S2;\n    S2: nextstate = tb ? S2 : (ta ? S3 : S2);\n    S3: nextstate = S0;\n    default: nextstate = S0;      // 未用状态回到确定状态\n  endcase\n\nassign la = (state == S0) ? GREEN : (state == S1) ? YELLOW : RED;' },
        { t: 'p', html: '状态编码可以用二进制、格雷码或独热码。二进制省触发器但译码逻辑多；独热码每位一个状态，译码简单、速度快，FPGA 上常用。<code>enum</code> 只负责起名字，具体编码由综合工具决定。写次态逻辑前先列状态转换表：每行是“当前状态 + 输入 → 次态 + 输出”；表格列全了，<code>case</code> 只是把表格翻译成代码，列不全就一定会出现遗漏分支。' },
        { t: 'key', title: '三段式的三个好处', items: [
          '状态寄存器与组合逻辑分离，综合结果可预测；',
          '输出可以单独寄存，减少毛刺；',
          '便于加 <code>default</code> 处理未用状态，提高可靠性。'
        ] },
        { t: 'p', html: '三段式把状态寄存器单独放在 <code>always_ff</code> 中，次态逻辑放在 <code>always_comb</code> 中，输出再用 <code>assign</code> 或 <code>always_comb</code> 计算。这样状态更新与组合计算互不干扰，综合结果可预测；输出还可以选择再打一拍，减少毛刺。' },
        { t: 'warn', title: 'FSM 的三个坑', html: '次态 <code>case</code> 漏 <code>default</code> 会推断锁存器，而且未使用的状态编码可能让 FSM 卡死；正确做法是 <code>default</code> 回到复位状态。另一个常见错误是在两个 <code>always</code> 块中都给 <code>state</code> 赋值，形成多驱动。输出若直接由 <code>state</code> 组合译码，状态位同时翻转时可能出现毛刺，必要时寄存输出。' },
        { t: 'example', title: '例：交通灯', html: '状态 <code>S0</code>–<code>S3</code> 分别表示主干道绿灯、黄灯、支路绿灯、黄灯。次态由 <code>ta</code>、<code>tb</code> 两个定时信号决定，输出 <code>la</code> 由当前状态译码。把“状态怎么变”和“灯怎么亮”分开写，调试时可以先看状态波形，再看输出波形。' }
      ]
    },
    {
      id: 'ch4-param',
      num: '4.7–4.8',
      title: '数据类型与参数化',
      lead: '用 parameter 让位宽可配置。',
      tag: '进阶',
      blocks: [
        { t: 'p', html: 'SystemVerilog 在 Verilog 基础上补了类型系统。最常用的是 <code>logic</code>（四值，可被 <code>assign</code>/<code>always</code> 驱动）、<code>bit</code>（二值，验证环境常用）、<code>int</code>/<code>integer</code>（32 位有符号，适合循环变量）、<code>enum</code>（状态名）、<code>struct</code>/<code>union</code>（打包字段）以及数组（存储器建模）。' },
        { t: 'table', title: '常用数据类型', head: ['类型', '位宽/取值', '用途'], rows: [
          ['<code>logic</code>', '4 态 0/1/X/Z', '通用信号，可综合'],
          ['<code>bit</code>', '2 态', '验证环境、性能更好'],
          ['<code>int</code>', '32 位有符号', '循环变量、常量'],
          ['<code>enum</code>', '按定义', '状态机状态名'],
          ['<code>struct</code>', '按成员打包', '打包指令字段'],
          ['<code>logic [7:0] mem [0:255]</code>', '256×8', '存储器建模']
        ] },
        { t: 'p', html: 'VHDL 用 <code>entity</code> 描述黑盒端口，用 <code>architecture</code> 描述实现；<code>std_logic</code> 与 <code>std_logic_vector</code> 来自 IEEE 1164，有 9 种取值；<code>signal</code> 对应硬件连线，<code>variable</code> 是进程内变量。两种语言概念一一对应，掌握一种后迁移很快。' },
        { t: 'code', lang: 'verilog', title: '参数化 2:1 MUX', code: 'module mux2 #(parameter WIDTH = 8) (\n  input  logic [WIDTH-1:0] d0, d1,\n  input  logic             s,\n  output logic [WIDTH-1:0] y);\n  assign y = s ? d1 : d0;\nendmodule' },
        { t: 'code', lang: 'verilog', title: '实例化时覆盖参数', code: 'mux2 #(.WIDTH(32)) mux32 (.d0(a), .d1(b), .s(sel), .y(out));' },
        { t: 'code', lang: 'verilog', title: '用 generate 批量生成结构', code: 'genvar i;\ngenerate\n  for (i = 0; i < 32; i = i + 1) begin : gen_adder\n    fulladder fa(.a(a[i]), .b(b[i]), .cin(c[i]),\n                 .s(sum[i]), .cout(c[i+1]));\n  end\nendgenerate' },
        { t: 'p', html: '<code>parameter</code> 是编译/综合前可覆盖的常量，实例化时用 <code>#(.WIDTH(32))</code> 覆盖；<code>localparam</code> 只能在模块内部使用，适合派生常量。<code>generate</code> 在展开阶段把循环展开成多份硬件，因此 <code>for</code> 循环体里写的是“每个 <code>i</code> 对应的一份电路”，不是运行时迭代。' },
        { t: 'p', html: '参数还能派生局部常量，例如 <code>localparam LAST = DEPTH-1;</code>。这样改动 <code>DEPTH</code> 时，所有依赖它的位宽和边界一起更新。参数化的收益在复用：同一个 <code>mux2</code> 用默认参数得到 8 位版本，覆盖 <code>WIDTH=32</code> 就得到 32 位版本，不必复制两份代码；复制代码看似快，改 bug 时却要改两处。' },
        { t: 'p', html: '写参数化代码时，先把“会变的量”提出来：位宽、深度、抽头数。把它们放进 <code>parameter</code> 列表，模块内部只引用参数名，不再出现魔法数字。这样同一份代码可以覆盖多个配置，验证也只需改参数。' },
        { t: 'warn', title: '参数化的常见错误', html: '参数化最常见的错误是位宽表达式写错：<code>WIDTH</code> 为 0 时 <code>[WIDTH-1:0]</code> 非法；覆盖参数时类型不匹配会报错；<code>generate</code> 循环变量要用 <code>genvar</code>，且循环边界必须是常量。另一个坑是忘记在实例化时覆盖参数，综合出来的位宽仍是默认值。' }
      ]
    },
    {
      id: 'ch4-tb',
      num: '4.9',
      title: '测试程序 testbench',
      lead: '给激励、看输出、自动判 PASS/FAIL。',
      tag: '进阶',
      blocks: [
        { t: 'p', html: '<b>测试程序</b>（testbench）不是要综合的硬件，而是仿真时的“实验台”：它实例化被测模块（DUT），产生时钟、复位和输入激励，观察输出并自动判定 PASS/FAIL。testbench 里可以写延时、<code>initial</code>、<code>$display</code>，这些都不进入芯片。' },
        { t: 'code', lang: 'verilog', title: '一个自检测试程序', code: 'module testbench;\n  logic clk, reset;\n  logic [3:0] a, b;\n  logic       y;\n\n  dut uut(.a(a), .b(b), .y(y));   // 实例化被测模块\n\n  always #5 clk = ~clk;           // 10 个时间单位一个周期\n\n  initial begin\n    clk = 0; reset = 1; a = 0; b = 0;\n    #12 reset = 0;\n    a = 4\'b1010; b = 4\'b0110; #10;\n    if (y !== 1\'b1) $display("FAIL: y=%b", y);\n    else            $display("PASS");\n    $stop;\n  end\nendmodule' },
        { t: 'steps', title: '自检测试程序的五步', items: [
          { title: '实例化 DUT', html: '用命名端口把 testbench 信号接到被测模块。' },
          { title: '产生时钟与复位', html: '<code>always #5 clk = ~clk;</code> 产生周期 10 的时钟。' },
          { title: '施加激励', html: '在 <code>initial</code> 中按时间顺序赋值，覆盖正常值与边界值。' },
          { title: '自动检查', html: '用 <code>!==</code> 比较，失败时 <code>$display</code> 打印。' },
          { title: '结束仿真', html: '<code>$stop</code> 或 <code>$finish</code>。' }
        ] },
        { t: 'p', html: 'testbench 模块通常没有端口，因为它不被实例化到别的电路里。<code>$display</code> 支持 <code>%b</code>、<code>%h</code>、<code>%d</code>、<code>%t</code> 等格式，打印时带上信号名和时间，比只看波形更容易定位第一个错误。时钟用 <code>always #5 clk = ~clk;</code> 产生，周期是 10 个时间单位；注意给 <code>clk</code> 初值 0，否则第一个沿的位置不确定。' },
        { t: 'p', html: '好的 testbench 会先测复位，再测典型向量，最后测边界和随机向量。每类测试都应有明确的期望值，而不是“看一眼波形觉得对”。发现错误时打印输入、期望值和实际值，方便复现。' },
        { t: 'warn', title: '不要用 != 检查 X', html: '用 <code>!=</code> 比较输出是常见错误：当输出为 X 时，<code>y != 1\'b1</code> 的结果是 X，<code>if</code> 会把 X 当作假，于是错误被漏掉。应使用 <code>!==</code>（case 不等）捕捉 X/Z。另一个错误是忘记给时钟初值，或复位时间太短，导致第一个时钟沿采到 X。' },
        { t: 'list', style: 'ul', items: [
          '边界值：0、最大值、全 1、全 0；',
          '进位、借位与溢出；',
          '复位与使能；',
          '非法状态或非法输入编码；',
          'X/Z 传播路径。'
        ] },
        { t: 'exam', title: '考试高频', html: '自检测试程序的三件套：激励（<code>initial</code>/<code>always</code>）、检查（<code>if</code> + <code>!==</code>）、报告（<code>$display</code> + <code>$stop</code>/<code>$finish</code>）。只打印波形而不自动判定，不算合格的 testbench。' }
      ]
    },
    {
      id: 'ch4-summary',
      num: '4.10',
      title: '本章小结与自查',
      lead: '写之前想电路，写之后查规则。',
      tag: '考点',
      blocks: [
        { t: 'key', title: '本章六句话', items: [
          'HDL 描述硬件：每个 <code>always</code> 都要能想象出对应的门与连线。',
          '组合逻辑：<code>assign</code> 或 <code>always_comb</code> + 阻塞赋值。',
          '时序逻辑：<code>always_ff @(posedge clk)</code> + 非阻塞赋值。',
          '防锁存器：默认值、写全 <code>if/else</code>、<code>case</code> 加 <code>default</code>。',
          '组织大电路：模块实例化 + <code>parameter</code>/<code>generate</code>。',
          'FSM 推荐三段式；testbench 要能自动判 PASS/FAIL。'
        ] },
        { t: 'table', title: '写法速查', head: ['想做什么', '推荐写法'], rows: [
          ['组合逻辑', '<code>assign</code> / <code>always_comb</code> + <code>=</code>'],
          ['时序逻辑', '<code>always_ff</code> + <code>&lt;=</code>'],
          ['多路选择', '<code>case</code> 或 <code>?:</code>'],
          ['优先级选择', '<code>if/else</code> 链'],
          ['参数化', '<code>parameter</code> + <code>#(.W(…))</code>'],
          ['层次化', '模块实例化 + 命名端口'],
          ['仿真激励', '<code>initial</code>、<code>#</code>、<code>$display</code>']
        ] },
        { t: 'p', html: '复习时把本章代码分成两类：能综合的 RTL（<code>assign</code>、<code>always_comb</code>、<code>always_ff</code>、<code>case</code>、参数、实例化）和只用于仿真的代码（<code>initial</code>、<code>#</code>、<code>$display</code>、<code>$stop</code>）。两类混在一起，是初学阶段最常见的工程问题。第 5 章开始，我们会用本章的写法搭加法器、ALU 和寄存器堆；第 7 章的数据通路几乎就是“实例化 + <code>always_ff</code> + 组合逻辑”的组合。' },
        { t: 'p', html: '把综合与仿真分开检查：综合看面积、时序和是否推断出意外锁存器；仿真看功能与边界。两者都通过，才说明这份 RTL 既“写对了”，也“能变成硬件”。' },
        { t: 'warn', title: '交卷前自查五条', html: '组合块是否每个输出都有默认值？时序块是否全用 <code>&lt;=</code>？同一信号是否只在一个 <code>always</code> 中赋值？敏感表是否只含时钟沿（和异步复位）？是否误把 <code>#</code> 延时、<code>initial</code>、<code>$display</code> 放进了要综合的 RTL？' },
        { t: 'exam', title: '高频考点', html: '阻塞/非阻塞的区别与选用、<code>case</code> 缺 <code>default</code> 推断锁存器、三段式 FSM 的分工、参数覆盖写法、testbench 用 <code>!==</code> 检查 X。' },
        { t: 'quote', html: '能综合、能仿真、能复查——这才是可以交付的 RTL。', cite: '第 4 章' }
      ]
    }
  ]
};

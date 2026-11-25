window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q7-001',
    ch: 7,
    sec: 'ch7-state',
    topic: '体系结构状态',
    diff: 1,
    type: 'single',
    stem: '下列哪一项<b>不属于</b> MIPS 的体系结构状态？',
    options: ['PC', '32 个通用寄存器', '数据存储器', '流水线寄存器 IF/ID'],
    answer: 3,
    hint: '问自己：程序员能否直接观察到它？',
    explain: '体系结构状态是 ISA 规定、程序可见的状态：PC、通用寄存器和存储器。流水线寄存器是微体系结构为了重叠执行而增加的内部存储，程序看不到，也不能依赖它。'
  },
  {
    id: 'q7-002',
    ch: 7,
    sec: 'ch7-state',
    topic: 'PC',
    diff: 1,
    type: 'fill',
    stem: 'MIPS 的 PC 中保存的是____的地址（填 4 个字以内）。',
    accept: ['下一条指令', '下条指令', '下一条指令地址', '下条指令地址'],
    placeholder: '下一条指令',
    explain: '取指时用 PC 从指令存储器读出当前指令，随后 PC ← PC+4，所以 PC 指向下一条要取的指令。分支和跳转指令会改写 PC，但“指向下一条指令”这个含义不变。'
  },
  {
    id: 'q7-003',
    ch: 7,
    sec: 'ch7-design',
    topic: '设计流程',
    diff: 1,
    type: 'single',
    stem: '设计一个 MIPS 微体系结构时，通常的<b>第一步</b>是：',
    options: ['选择单周期、多周期或流水线', '分析指令集，归纳每条指令需要的操作', '设计控制器', '估算时钟周期'],
    answer: 1,
    hint: '先知道“要做什么”，再决定“怎么做”。',
    explain: '设计从分析指令集开始：逐条列出取指、读寄存器、ALU 运算、访存、写回等动作。只有把动作模式归纳清楚，才能选择微结构、连接数据通路、设计控制器并分析性能。'
  },
  {
    id: 'q7-004',
    ch: 7,
    sec: 'ch7-design',
    topic: '指令动作',
    diff: 2,
    type: 'multi',
    stem: '下列哪些指令执行后<b>一定会写通用寄存器</b>？',
    options: ['<code>add $t0, $t1, $t2</code>', '<code>lw $t0, 0($sp)</code>', '<code>sw $t0, 0($sp)</code>', '<code>beq $t0, $t1, label</code>'],
    answer: [0, 1],
    hint: '注意“写寄存器”和“写存储器”是两回事。',
    explain: 'R 型 <code>add</code> 把结果写入 <code>rd</code>（这里是 <code>$t0</code>）；<code>lw</code> 把读出的数据写入 <code>rt</code>（这里是 <code>$t0</code>）。<code>sw</code> 写的是数据存储器，<code>beq</code> 只可能更新 PC，两者都不写通用寄存器。'
  },
  {
    id: 'q7-005',
    ch: 7,
    sec: 'ch7-design',
    topic: '设计流程排序',
    diff: 1,
    type: 'order',
    stem: '把单周期处理器的设计过程按合理顺序排列。',
    hint: '先分析指令，再选结构；通路和控制器都完成后再评估性能。',
    explain: '正确顺序是：分析指令集 → 选择微结构 → 设计数据通路 → 设计控制器 → 分析性能并迭代。性能分析用来发现瓶颈，再回到前面的步骤改进；若先设计控制器，往往不知道数据通路需要哪些控制信号。',
    lab: {
      items: [
        '分析指令集，归纳所需的读寄存器、ALU、访存、写回操作',
        '选择微结构：单周期、多周期或流水线',
        '用 ALU、寄存器文件、存储器等部件连接数据通路',
        '设计控制器，由 op 与 funct 产生控制信号',
        '分析性能，计算 Tc、CPI 与加速比并迭代'
      ],
      prompt: '按设计流程从先到后排列'
    }
  },
  {
    id: 'q7-006',
    ch: 7,
    sec: 'ch7-perf',
    topic: '性能公式',
    diff: 2,
    type: 'single',
    stem: '同一程序在两实现上运行：A 的 CPI=1、Tc=2 ns；B 的 CPI=1.5、Tc=1 ns。忽略其他差异，结果是：',
    options: ['A 快 1.33 倍', 'B 快 1.33 倍', '两者一样快', 'B 快 2 倍'],
    answer: 1,
    hint: '分别写出 TA 与 TB 关于 IC 的表达式。',
    explain: 'TA = IC × 1 × 2 ns = 2IC ns；TB = IC × 1.5 × 1 ns = 1.5IC ns。TA/TB = 2/1.5 ≈ 1.33，所以 B 更快。B 的 CPI 更差，但时钟周期缩短得更多，净效果仍然是赢。'
  },
  {
    id: 'q7-007',
    ch: 7,
    sec: 'ch7-perf',
    topic: '执行时间计算',
    diff: 2,
    type: 'fill',
    stem: '某程序含 2×10<sup>6</sup> 条指令，平均 CPI=1.5，主频 2 GHz。执行时间是多少毫秒？',
    accept: ['1.5', '1.5ms', '1.5毫秒', '1.50'],
    placeholder: '如 1.5',
    unit: 'ms',
    hint: '先算总周期数，再除以主频。',
    explain: '总周期数 = 2×10<sup>6</sup> × 1.5 = 3×10<sup>6</sup>。2 GHz = 2×10<sup>9</sup> Hz，所以 T = 3×10<sup>6</sup> / (2×10<sup>9</sup>) s = 1.5×10<sup>−3</sup> s = 1.5 ms。'
  },
  {
    id: 'q7-008',
    ch: 7,
    sec: 'ch7-perf',
    topic: 'Amdahl 定律',
    diff: 2,
    type: 'single',
    stem: '某优化只作用于原执行时间的 40%，该部分被加速 2 倍。整体加速比最接近：',
    options: ['1.25', '1.43', '1.67', '2.00'],
    answer: 0,
    hint: 'S = 1 / ((1−f) + f/k)。',
    explain: 'f=0.4，k=2，代入 S = 1 / (0.6 + 0.4/2) = 1 / 0.8 = 1.25。1.67 是 k 趋于无穷大时的上限 1/(1−f)，不是本题的答案。'
  },
  {
    id: 'q7-009',
    ch: 7,
    sec: 'ch7-perf',
    topic: 'Amdahl 上限',
    diff: 2,
    type: 'tf',
    stem: '若只优化程序的一部分，即使把这部分加速到无穷快，整体加速比也不会超过 1/(1−f)，其中 f 是该部分占原时间的比例。',
    answer: 1,
    hint: '令 Amdahl 公式中的 k 趋于无穷大。',
    explain: '正确。S = 1 / ((1−f) + f/k)，当 k→∞ 时 f/k→0，S→1/(1−f)。未优化部分占 1−f，它构成了无法消除的时间下界。'
  },
  {
    id: 'q7-010',
    ch: 7,
    sec: 'ch7-perf',
    topic: 'MIPS 数组求和',
    diff: 3,
    type: 'mips',
    stem: '数组从地址 4096 开始，共 5 个字：11、−7、34、0、92。<code>$a0</code> 是首地址，<code>$a1</code> 是元素个数，请写循环求所有元素之和，结果存入 <code>$v0</code>。',
    hint: '用 <code>$t0</code> 存和、<code>$t1</code> 存下标，每次把下标左移 2 位得到字节偏移。',
    explain: '参考程序逐个读取数组元素并累加：<code>sll</code> 把下标乘 4，<code>addu</code> 加上基址得到元素地址，<code>lw</code> 取出元素，<code>addu</code> 累加。<code>beq</code> 判断下标是否到达 <code>$a1</code>。5 个元素之和为 11−7+34+0+92=130。这段循环每轮执行约 8 条指令，5 轮共约 40 条动态指令，可用于体会 IC 的含义。',
    lab: {
      init: {
        regs: { a0: 4096, a1: 5 },
        memory: { 4096: [11, -7, 34, 0, 92] }
      },
      expect: { regs: { v0: 130 } },
      maxSteps: 3000,
      starter: '# 在这里写循环求和，结果放入 $v0\n',
      solution: [
        '        li   $t0, 0        # sum',
        '        li   $t1, 0        # i',
        'loop:   beq  $t1, $a1, done',
        '        sll  $t2, $t1, 2',
        '        addu $t2, $t2, $a0',
        '        lw   $t3, 0($t2)',
        '        addu $t0, $t0, $t3',
        '        addiu $t1, $t1, 1',
        '        j    loop',
        'done:   move $v0, $t0'
      ].join('\n')
    }
  },
  {
    id: 'q7-011',
    ch: 7,
    sec: 'ch7-single-dp',
    topic: 'lw 数据通路',
    diff: 2,
    type: 'single',
    stem: '单周期 MIPS 执行 <code>lw</code> 时，低 16 位立即数符号扩展后主要用来：',
    options: ['直接作为写回数据', '与基址寄存器相加，形成数据存储器地址', '作为下一条指令地址', '作为 ALU 的控制信号'],
    answer: 1,
    hint: '访存地址由“基址 + 偏移”得到。',
    explain: '<code>lw</code> 的地址计算是“基址寄存器 + 符号扩展的 16 位偏移”。扩展后的立即数经 <code>ALUSrc</code> 选择送入 ALU，与 <code>rs</code> 的值相加，结果作为数据存储器地址。写回数据来自存储器，不是立即数。'
  },
  {
    id: 'q7-012',
    ch: 7,
    sec: 'ch7-single-dp',
    topic: 'beq 的 ALU 运算',
    diff: 2,
    type: 'fill',
    stem: '<code>beq</code> 要判断两个寄存器是否相等。单周期数据通路让 ALU 对它们做____运算，再检查结果是否为零。',
    accept: ['减法', '相减', 'sub', 'subtraction'],
    placeholder: '填一种运算',
    hint: '相等时差为零。',
    explain: 'ALU 对两个源寄存器做减法，若结果为零则说明两者相等，零标志置 1，再结合 <code>Branch</code> 信号决定 <code>PCSrc</code>。因此 <code>beq</code> 的控制信号中 <code>ALUSrc=0</code>，让 ALU 的两个输入都来自寄存器。'
  },
  {
    id: 'q7-013',
    ch: 7,
    sec: 'ch7-single-dp',
    topic: 'lw 机器码',
    diff: 3,
    type: 'fields',
    stem: '把 <code>lw $t1, 4($t0)</code> 编码成 32 位机器码。请填写各字段，注意 <code>lw</code> 的 opcode 是 <code>100011</code>。',
    hint: '<code>$t0</code>=8，<code>$t1</code>=9；偏移量 4 用 16 位补码表示。',
    explain: '<code>lw</code> 是 I 型：opcode=100011，rs=<code>$t0</code>=01000，rt=<code>$t1</code>=01001，imm=4=0000000000000100。拼接为 100011 01000 01001 0000000000000100，即 0x8D090004。',
    lab: {
      kind: 'mips-i',
      instruction: 'lw $t1, 4($t0)',
      fields: [
        { name: 'opcode', width: 6, value: '100011', hint: 'lw 的操作码' },
        { name: 'rs', width: 5, value: '$t0', type: 'reg', hint: '基址寄存器' },
        { name: 'rt', width: 5, value: '$t1', type: 'reg', hint: '目的寄存器' },
        { name: 'imm', width: 16, value: 4, hint: '字节偏移 4' }
      ],
      expected: '0x8D090004'
    }
  },
  {
    id: 'q7-014',
    ch: 7,
    sec: 'ch7-single-ctrl',
    topic: 'RegDst 与 ALUSrc',
    diff: 2,
    type: 'single',
    stem: 'R 型指令与 <code>lw</code> 在控制信号上的典型区别是：',
    options: ['R 型 RegDst=1、ALUSrc=0；lw 反之', '两者 RegDst 都为 1', 'R 型 ALUSrc=1、lw ALUSrc=0', '两者都不写寄存器'],
    answer: 0,
    hint: 'R 型写 <code>rd</code>，ALU 第二操作数来自 <code>rt</code>；lw 写 <code>rt</code>，第二操作数来自立即数。',
    explain: 'R 型把结果写入 <code>rd</code>，所以 <code>RegDst=1</code>；ALU 的第二个操作数来自寄存器 <code>rt</code>，所以 <code>ALUSrc=0</code>。<code>lw</code> 把数据写入 <code>rt</code>，所以 <code>RegDst=0</code>；ALU 要用符号扩展的立即数算地址，所以 <code>ALUSrc=1</code>。'
  },
  {
    id: 'q7-015',
    ch: 7,
    sec: 'ch7-single-ctrl',
    topic: 'sw 控制信号',
    diff: 1,
    type: 'fill',
    stem: '单周期控制中，<code>sw</code> 的 <code>RegWrite</code> 应等于____（填 0 或 1）。',
    accept: ['0', '零'],
    placeholder: '0 或 1',
    explain: '<code>sw</code> 只把寄存器数据写入存储器，不写回任何寄存器，因此 <code>RegWrite=0</code>，而 <code>MemWrite=1</code>。若把 <code>RegWrite</code> 错置为 1，<code>sw</code> 会意外改写 <code>rt</code> 指定的寄存器。'
  },
  {
    id: 'q7-016',
    ch: 7,
    sec: 'ch7-single-ctrl',
    topic: 'R 型机器码',
    diff: 2,
    type: 'fields',
    stem: '把 <code>add $t0, $s1, $s2</code> 编码成 32 位机器码。请填写各字段；R 型 opcode 为 0，<code>add</code> 的 funct 为 <code>100000</code>。',
    hint: '<code>$s1</code>=17，<code>$s2</code>=18，<code>$t0</code>=8；shamt 为 0。',
    explain: 'R 型字段依次为 opcode=000000、rs=<code>$s1</code>=10001、rt=<code>$s2</code>=10010、rd=<code>$t0</code>=01000、shamt=00000、funct=100000。拼接得 0000 0010 0011 0010 0100 0000 0010 0000，即 0x02324020。',
    lab: {
      kind: 'mips-r',
      instruction: 'add $t0, $s1, $s2',
      fields: [
        { name: 'opcode', width: 6, value: '000000', hint: 'R 型固定为 0' },
        { name: 'rs', width: 5, value: '$s1', type: 'reg' },
        { name: 'rt', width: 5, value: '$s2', type: 'reg' },
        { name: 'rd', width: 5, value: '$t0', type: 'reg' },
        { name: 'shamt', width: 5, value: 0 },
        { name: 'funct', width: 6, value: '100000', hint: 'add 的功能码' }
      ],
      expected: '0x02324020'
    }
  },
  {
    id: 'q7-017',
    ch: 7,
    sec: 'ch7-single-perf',
    topic: '单周期时钟周期',
    diff: 1,
    type: 'single',
    stem: '单周期处理器的时钟周期应当设成：',
    options: ['最快指令的延迟', '最慢指令的最长数据通路延迟（含寄存器建立时间）', '所有指令延迟的平均值', '数据存储器访问时间的一半'],
    answer: 1,
    hint: '全机只有一个时钟，所有指令共用同一个周期。',
    explain: '单周期中所有指令都在一个时钟周期内完成，时钟周期必须覆盖最慢指令（通常是 <code>lw</code>）从 PC 出发、经取指、译码、读寄存器、ALU、访存，最后满足寄存器建立时间的整条路径。若按平均值设置，慢指令会来不及完成。'
  },
  {
    id: 'q7-018',
    ch: 7,
    sec: 'ch7-single-perf',
    topic: '关键路径估算',
    diff: 2,
    type: 'fill',
    stem: '某单周期路径：t<sub>pcq</sub>=30 ps，指令存储器 200 ps，译码 70 ps，寄存器读 150 ps，ALU 180 ps，数据存储器 250 ps，寄存器建立 30 ps。时钟周期约为____ ps。',
    accept: ['910', '910ps', '910 ps'],
    placeholder: '填整数',
    unit: 'ps',
    hint: '把 <code>lw</code> 路径上的延迟全部相加。',
    explain: 'Tc = 30 + 200 + 70 + 150 + 180 + 250 + 30 = 910 ps。这条路径对应 <code>lw</code>：取指、译码、读寄存器、ALU 算地址、读数据存储器、写回寄存器前的建立时间。'
  },
  {
    id: 'q7-019',
    ch: 7,
    sec: 'ch7-single-perf',
    topic: 'CPI 与性能',
    diff: 2,
    type: 'tf',
    stem: '单周期处理器 CPI=1，所以它的执行时间一定比 CPI=1.5 的多周期处理器短。',
    answer: 0,
    hint: '执行时间还要乘上 Tc。',
    explain: '错误。T = IC × CPI × Tc。单周期虽然 CPI=1，但它的 Tc 必须覆盖整条最慢路径，往往远大于多周期的单步周期。若多周期的 Tc 不到单周期的一半，即使 CPI=1.5，总时间也可能更短。'
  },
  {
    id: 'q7-020',
    ch: 7,
    sec: 'ch7-multi-dp',
    topic: '多周期状态寄存器',
    diff: 2,
    type: 'single',
    stem: '多周期数据通路中，<code>IR</code>、<code>A</code>、<code>B</code>、<code>ALUOut</code> 等状态寄存器的主要作用是：',
    options: ['保存指令集定义', '在相邻时钟周期之间保存中间结果', '提高存储器容量', '替代 PC 产生下一条指令地址'],
    answer: 1,
    hint: '一条指令跨多个周期，中间结果不能丢。',
    explain: '多周期把一条指令拆成多拍，同一套硬件在不同拍做不同事。状态寄存器在拍与拍之间保存当前指令、操作数和 ALU 结果，使下一拍还能继续使用。它们不是体系结构状态，而是微体系结构的内部存储。'
  },
  {
    id: 'q7-021',
    ch: 7,
    sec: 'ch7-multi-dp',
    topic: 'lw 多周期步骤',
    diff: 1,
    type: 'order',
    stem: '把多周期处理器执行 <code>lw</code> 的五个步骤按先后顺序排列。',
    hint: '先取指，最后写回；算地址在访存之前。',
    explain: '正确顺序是 IF 取指 → ID 译码并读寄存器 → EX 计算地址 → MEM 读数据存储器 → WB 写回 <code>rt</code>。<code>lw</code> 需要 5 个周期，是多周期指令中最长的一类。',
    lab: {
      items: [
        'IF：IR ← Mem[PC]，PC ← PC+4',
        'ID：读 rs，符号扩展立即数，计算分支目标',
        'EX：ALU 计算基址与偏移之和',
        'MEM：按地址读数据存储器',
        'WB：把读出的数据写入 rt'
      ],
      prompt: '按 lw 的执行步骤排序'
    }
  },
  {
    id: 'q7-022',
    ch: 7,
    sec: 'ch7-multi-dp',
    topic: '多周期控制波形',
    diff: 3,
    type: 'wave',
    stem: '下图有 8 个时间片，每片对应多周期处理器的一个时钟周期。执行 <code>lw</code> 时，t1 取指、t2 译码、t3 执行、t4 访存、t5 写回。请画出 <code>IRWrite</code>（写指令寄存器）与 <code>MemRead</code>（读存储器）的波形。',
    hint: '取指要读指令并存 IR；访存要读数据，但不再写 IR。',
    explain: '<code>IRWrite</code> 只在取指周期 t1 有效，因为只有这时才把取出的指令写入 <code>IR</code>。<code>MemRead</code> 在 t1 有效（读指令）且在 t4 有效（<code>lw</code> 读数据），其余周期为 0。多周期用同一套存储器，取指和访存分时进行。',
    lab: {
      rows: [
        { name: '处于 IF 状态', cells: [1, 0, 0, 0, 0, 0, 0, 0], fixed: true },
        { name: '处于 MEM 状态', cells: [0, 0, 0, 1, 0, 0, 0, 0], fixed: true },
        { name: 'IRWrite', cells: [0, 0, 0, 0, 0, 0, 0, 0], fixed: false },
        { name: 'MemRead', cells: [0, 0, 0, 0, 0, 0, 0, 0], fixed: false }
      ],
      solution: {
        IRWrite: [1, 0, 0, 0, 0, 0, 0, 0],
        MemRead: [1, 0, 0, 1, 0, 0, 0, 0]
      },
      note: '每个时间片是一个时钟周期；点击可变行切换 0/1。'
    }
  },
  {
    id: 'q7-023',
    ch: 7,
    sec: 'ch7-multi-perf',
    topic: '多周期与单周期',
    diff: 2,
    type: 'single',
    stem: '“多周期处理器一定比单周期处理器快。”下列判断正确的是：',
    options: ['一定，因为它的 Tc 更短', '不一定，因为它的 CPI 也变大了', '一定，因为它的 CPI 更小', '两者性能公式不同，无法比较'],
    answer: 1,
    hint: '多周期用更多周期换更短周期。',
    explain: '多周期的 Tc 通常更短，但 CPI 从 1 升到 3～5。T = IC × CPI × Tc，两者乘积可能更大、相等或更小，取决于具体延迟。多周期的主要价值往往是省硬件和支持复杂指令，而不是绝对性能。'
  }
]);

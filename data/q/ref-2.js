window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q0-016',
    ch: 0,
    sec: 'ref-mips',
    topic: 'R 型 funct',
    diff: 1,
    type: 'single',
    stem: 'MIPS 中 <code>sub</code> 指令的 funct 字段是？',
    hint: 'R 型的 op 恒为 0，只能靠 funct 区分。',
    options: ['0x22', '0x20', '0x24', '0x2A'],
    answer: 0,
    explain: 'R 型 op = 000000，靠 6 位 funct 区分操作：add=0x20、sub=0x22、and=0x24、or=0x25、slt=0x2A。0x20 是 add、0x24 是 and、0x2A 是 slt，都是相邻表项，只差最后几位。见「MIPS 指令与寄存器」的 R 型 funct 表。'
  },
  {
    id: 'q0-017',
    ch: 0,
    sec: 'ref-mips',
    topic: '寄存器编号',
    diff: 1,
    type: 'fill',
    stem: '寄存器 <code>$t3</code> 的编号是多少？填十进制数。',
    placeholder: '如 9',
    accept: ['11', '0xB', '0x0B'],
    explain: '32 个寄存器按 $0~$31 编号：$t0=8、$t1=9、$t2=10、$t3=11；$s0 从 16 开始，$sp=29、$ra=31。机器码中的 rs/rt/rd 字段就是这 5 位编号，所以 $t3 在指令里编码为 <code>01011</code>。见「MIPS 指令与寄存器」的寄存器约定表。'
  },
  {
    id: 'q0-018',
    ch: 0,
    sec: 'ref-mips',
    topic: '调用约定',
    diff: 2,
    type: 'match',
    stem: '把寄存器与它的约定用途配对。',
    lab: {
      pairs: [
        ['$ra', '返回地址，jal 写入'],
        ['$sp', '栈指针，向低地址增长'],
        ['$a0', '第一个函数参数'],
        ['$v0', '函数返回值']
      ]
    },
    explain: 'MIPS 调用约定：参数放 $a0~$a3，本课程无延迟槽模型的 jal 把 PC+4 写入 $ra，返回值放 $v0/$v1，栈指针 $sp 向低地址增长（分配栈帧时减）。$s0~$s7 是被调用者保存寄存器，$t0~$t9 是调用者保存的临时寄存器。见「MIPS 指令与寄存器」的寄存器约定表。'
  },
  {
    id: 'q0-019',
    ch: 0,
    sec: 'ref-machine',
    topic: 'R 型编码',
    diff: 3,
    type: 'fields',
    stem: '把 <code>sub $t2, $t1, $t3</code> 的六个字段填好，拼出 32 位机器码（$t1=9、$t2=10、$t3=11）。',
    hint: 'R 型：rs、rt 是两个源，rd 是目标。',
    lab: {
      kind: 'mips-r',
      instruction: 'sub $t2, $t1, $t3',
      fields: [
        { name: 'opcode', width: 6, value: '000000', hint: 'R 型恒为 0' },
        { name: 'rs', width: 5, value: '$t1', type: 'reg' },
        { name: 'rt', width: 5, value: '$t3', type: 'reg' },
        { name: 'rd', width: 5, value: '$t2', type: 'reg' },
        { name: 'shamt', width: 5, value: 0 },
        { name: 'funct', width: 6, value: '100010', hint: 'sub = 0x22' }
      ],
      expected: '0x012B5022'
    },
    explain: 'op=000000，rs=$t1=01001，rt=$t3=01011，rd=$t2=01010，shamt=00000，funct=100010（sub=0x22）。拼起来是 <code>000000 01001 01011 01010 00000 100010</code> = <code>0x012B5022</code>。R 型机器码的字段顺序是 op、rs、rt、rd，rd 排在两个源之后；汇编里写成“rd 在前”只是为了和 C 的赋值方向一致。见「机器码格式与编码」的字段布局与手算五步。'
  },
  {
    id: 'q0-020',
    ch: 0,
    sec: 'ref-machine',
    topic: 'I 型编码',
    diff: 2,
    type: 'fields',
    stem: '把 <code>sw $t0, 8($sp)</code> 编码成机器码（$t0=8、$sp=29）。',
    hint: 'I 型：rs 是基址，rt 是源寄存器，立即数是字节偏移。',
    lab: {
      kind: 'mips-i',
      instruction: 'sw $t0, 8($sp)',
      fields: [
        { name: 'opcode', width: 6, value: '101011', hint: 'sw = 0x2B' },
        { name: 'rs', width: 5, value: '$sp', type: 'reg' },
        { name: 'rt', width: 5, value: '$t0', type: 'reg' },
        { name: 'imm', width: 16, value: 8 }
      ],
      expected: '0xAFA80008'
    },
    explain: 'sw 的 opcode = 0x2B = <code>101011</code>；rs 是基址 $sp = 29 = <code>11101</code>，rt 是源 $t0 = 8 = <code>01000</code>，立即数 8 = <code>0000000000001000</code>。拼接得 <code>0xAFA80008</code>。I 型的 16 位立即数参与地址计算前做符号扩展；地址 = $sp + 8。见「机器码格式与编码」的 I 型布局与 lw 例题。'
  },
  {
    id: 'q0-021',
    ch: 0,
    sec: 'ref-perf',
    topic: 'Amdahl 定律',
    diff: 2,
    type: 'single',
    stem: '某程序中 50% 的执行时间可被加速 2 倍。按 Amdahl 定律，整体加速比约为？',
    options: ['1.33', '2.0', '1.5', '4.0'],
    answer: 0,
    explain: 'S = 1 / ((1−f) + f/k) = 1 / (0.5 + 0.5/2) = 1 / 0.75 ≈ 1.33。上限是 1/(1−f) = 2，所以无论 k 多大都到不了 2。选 2.0 是把“部分加速比”当成了整体加速比；选 1.5 是用 2 − 0.5 直接把可优化比例从上限里减掉，属于口径错误。见「性能与流水线公式」的 Amdahl 公式。'
  },
  {
    id: 'q0-022',
    ch: 0,
    sec: 'ref-perf',
    topic: '执行时间',
    diff: 2,
    type: 'fill',
    stem: '程序含 2×10<sup>9</sup> 条指令，CPI = 1.5，时钟频率 2 GHz。执行时间是多少秒？只填数字。',
    placeholder: '如 0.8',
    accept: ['1.5', '1.5s', '1.5秒'],
    unit: 's',
    explain: 'T = IC × CPI / f = 2×10<sup>9</sup> × 1.5 / (2×10<sup>9</sup>) = 1.5 s。也可先算总周期数 3×10<sup>9</sup>，再乘 T<sub>c</sub> = 0.5 ns。三个因子分别由编译器/ISA、微体系结构、工艺决定。见「性能与流水线公式」的性能公式。'
  },
  {
    id: 'q0-023',
    ch: 0,
    sec: 'ref-perf',
    topic: '流水线加速比',
    diff: 3,
    type: 'multi',
    stem: '5 级流水线的实际加速比往往明显小于 5，原因是？',
    options: [
      '流水线寄存器本身有建立与传播开销',
      '各级延迟不均衡，最慢的一级决定 T<sub>c</sub>',
      '分支与数据冒险造成停顿',
      '流水线让每条指令的 CPI 等于级数 5',
      '流水线会增加程序执行的指令数'
    ],
    answer: [0, 1, 2],
    explain: '三个真实原因：①流水线寄存器把 T<sub>c</sub> 抬高，级数越多开销占比越大；②T<sub>c</sub> 由最慢的一级决定，级间不平衡会浪费；③冒险带来停顿，CPI = 1 + 停顿周期/指令。“CPI 等于级数”是常见误解：理想流水线的 CPI 接近 1，每条指令仍只占一个周期，只是 5 条指令的不同阶段在重叠；流水线也不改变指令数。见「性能与流水线公式」的三种微结构对比。'
  },
  {
    id: 'q0-024',
    ch: 0,
    sec: 'ref-mem',
    topic: '地址划分',
    diff: 2,
    type: 'single',
    stem: '32 位地址、容量 2 KB、块大小 16 B 的直接映射缓存，tag 有多少位？',
    options: ['21 位', '7 位', '4 位', '25 位'],
    answer: 0,
    explain: '块数 = 2 KB / 16 B = 128 = 2<sup>7</sup>，故 index = 7 位；offset = log<sub>2</sub>16 = 4 位；tag = 32 − 7 − 4 = 21 位。7 位是 index、4 位是 offset，25 位是忘记减去 offset。若改成 4 路组相联，组数为 32，index 变 5 位、tag 变 23 位。见「存储层次与 cache 公式」的地址划分公式。'
  },
  {
    id: 'q0-025',
    ch: 0,
    sec: 'ref-mem',
    topic: '降低 AMAT',
    diff: 3,
    type: 'multi',
    stem: '下列哪些做法能降低平均访存时间 AMAT？',
    options: [
      '增大缓存容量以降低缺失率',
      '用多级缓存降低缺失代价',
      '提高相联度以减少冲突缺失',
      '把块大小无限增大以利用空间局部性',
      '让缓存命中时间随容量增大而增加'
    ],
    answer: [0, 1, 2],
    explain: 'AMAT = t<sub>hit</sub> + 缺失率 × 缺失代价。前三条分别打击缺失率、缺失代价与冲突缺失，都是有效手段。块大小不能无限增大：块越大缺失代价越高，还会挤占容量、恶化空间局部性的利用率；让命中时间变大则直接抬高 AMAT 的第一项，是反向操作。见「存储层次与 cache 公式」的四条路。'
  },
  {
    id: 'q0-026',
    ch: 0,
    sec: 'ref-mem',
    topic: 'TLB 与缺页',
    diff: 2,
    type: 'tf',
    stem: 'TLB 缺失与缺页是一回事，都需要操作系统从磁盘调入页面。',
    answer: 0,
    explain: '错误。缺失时查页表，若合法页已驻留，可补填 TLB；若合法页未驻留，操作系统需先提供物理页。读入磁盘页是一种情况，按需清零不需要读磁盘。一个查的是“映射在不在”，一个查的是“页在不在”。见「存储层次与 cache 公式」的缓存与虚拟存储分工表。'
  },
  {
    id: 'q0-027',
    ch: 0,
    sec: 'ref-impl',
    topic: '综合与仿真',
    diff: 2,
    type: 'multi',
    stem: '审核拟综合的 RTL 时，哪些情况需要检查工具支持、意外存储或驱动冲突？',
    options: [
      '功能依赖 #延时或目标不支持的 initial 行为',
      '组合 always 块漏写分支，推断出锁存器',
      '同一信号在两个 always 块中被赋值',
      '给所有输出都写了默认值',
      '用 case 并写了 default'
    ],
    answer: [0, 1, 2],
    explain: '目标不支持的行为可能被忽略或报错；漏赋值可能推断意外锁存器，多驱动可能产生冲突。部分 FPGA 支持存储器初始化；异步复位/时钟处理不当、依赖 X 传播语义也属此类。而“给输出默认值”与“case 写 default”恰恰是避免锁存器、保证综合结果可预测的正确做法，不会造成不一致。见「数字系统实现」的五个原因。'
  },
  {
    id: 'q0-028',
    ch: 0,
    sec: 'ref-impl',
    topic: 'FPGA 资源',
    diff: 2,
    type: 'fill',
    stem: 'FPGA 中用来实现任意 k 输入组合函数的核心资源是什么？填英文缩写或中文名。',
    placeholder: '英文缩写',
    accept: ['LUT', '查找表'],
    explain: 'k 输入 LUT 本质是一个 2<sup>k</sup>×1 的 SRAM：输入当地址、输出就是查表结果，因此能实现任意 k 输入函数（常见 4 或 6 输入），后面再接一个触发器就能做时序逻辑。它是第 2 章“用译码器加或门实现 SOP”的直接推广。见「数字系统实现」的实现方式对比。'
  },
  {
    id: 'q0-029',
    ch: 0,
    sec: 'ref-term',
    topic: '术语含义',
    diff: 2,
    type: 'match',
    stem: '把术语与它的含义配对。',
    lab: {
      pairs: [
        ['建立时间', '时钟沿之前数据必须稳定的最短时间'],
        ['传播延迟', '输入变化到输出达到最终值的最长时间'],
        ['亚稳态', '触发器输出停在 0 与 1 之间的不确定状态'],
        ['相联度', '同一组内可放置的缓存行数']
      ]
    },
    explain: '建立时间 t<sub>setup</sub> 约束“数据要早到”，出现在最小时钟周期公式里；传播延迟 t<sub>pd</sub> 是组合电路最长路径的延迟；亚稳态由建立/保持窗口内数据变化引起，可用目的域同步器增加分辨时间，所需级数取决于目标 MTBF；相联度是每组行数，直接映射为 1 路，全相联等于全部行。见「术语与符号表」。'
  },
  {
    id: 'q0-030',
    ch: 0,
    sec: 'ref-term',
    topic: '缩写',
    diff: 1,
    type: 'fill',
    stem: '“平均访存时间”的英文缩写是什么？',
    placeholder: '四个字母',
    accept: ['AMAT', 'amat'],
    explain: 'AMAT = average memory access time，公式为 AMAT = t<sub>hit</sub> + 缺失率 × 缺失代价。相邻的常用缩写还有 CPI（每指令周期数）、IPC（每周期指令数）、TLB（转换后备缓冲器）、DMA（直接存储器访问）。见「术语与符号表」的符号表。'
  }
]);

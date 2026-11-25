window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q7-024',
    ch: 7,
    sec: 'ch7-multi-perf',
    topic: '平均 CPI',
    diff: 2,
    type: 'fill',
    stem: '某程序指令比例：<code>lw</code> 20%（5 周期）、<code>sw</code> 10%（4 周期）、R 型 50%（4 周期）、<code>beq</code> 10%（3 周期）、<code>j</code> 10%（3 周期）。平均 CPI 是____。',
    accept: ['4', '4.0', '4.00'],
    placeholder: '保留一位小数',
    hint: '按比例加权求和：Σ 周期数 × 比例。',
    explain: 'CPI = 0.20×5 + 0.10×4 + 0.50×4 + 0.10×3 + 0.10×3 = 1.0 + 0.4 + 2.0 + 0.3 + 0.3 = 4.0。注意比例之和必须为 1，否则说明漏算或重复计算了某类指令。'
  },
  {
    id: 'q7-025',
    ch: 7,
    sec: 'ch7-multi-perf',
    topic: '多周期 CPI',
    diff: 1,
    type: 'tf',
    stem: '多周期处理器的 CPI 通常大于 1。',
    answer: 1,
    hint: '数一数 <code>lw</code> 要几拍。',
    explain: '正确。多周期把一条指令拆成 3～5 个周期：<code>lw</code> 约 5 拍，<code>sw</code> 和 R 型约 4 拍，<code>beq</code>、<code>j</code> 约 3 拍，所以平均 CPI 明显大于 1。它用更短的 Tc 来补偿。'
  },
  {
    id: 'q7-026',
    ch: 7,
    sec: 'ch7-multi-perf',
    topic: '单/多周期对比',
    diff: 3,
    type: 'single',
    stem: '同一程序分别用两种实现：单周期 CPI=1、Tc=800 ps；多周期 CPI=4、Tc=200 ps。哪个更快？',
    options: ['单周期快 4 倍', '多周期快 4 倍', '两者相同', '缺少 IC，无法比较'],
    answer: 2,
    hint: '分别算每条指令的平均时间。',
    explain: '单周期每条指令平均 1×800 = 800 ps；多周期每条指令平均 4×200 = 800 ps。IC 相同，所以总执行时间相同。单周期 CPI 低但 Tc 长，多周期 Tc 短但 CPI 高，两者的乘积正好相等。'
  },
  {
    id: 'q7-027',
    ch: 7,
    sec: 'ch7-pipe-dp',
    topic: '流水线阶段',
    diff: 1,
    type: 'single',
    stem: '经典五级流水线的阶段顺序是：',
    options: ['IF → ID → EX → MEM → WB', 'IF → EX → ID → MEM → WB', 'ID → IF → EX → WB → MEM', 'IF → ID → MEM → EX → WB'],
    answer: 0,
    hint: '先取指、译码，再执行、访存，最后写回。',
    explain: '五级依次是 IF 取指、ID 译码并读寄存器、EX 执行、MEM 访存、WB 写回。数据从存储器读出后要先经过 MEM 级，才能进入 WB 级写寄存器，所以 MEM 必须在 WB 之前。'
  },
  {
    id: 'q7-028',
    ch: 7,
    sec: 'ch7-pipe-dp',
    topic: '流水线寄存器',
    diff: 1,
    type: 'fill',
    stem: '五级流水线中，EX 与 MEM 之间的流水线寄存器通常记作____。',
    accept: ['EX/MEM', 'EXMEM', 'EX/MEM 寄存器', 'EX/MEM寄存器'],
    placeholder: '如 XX/XX',
    hint: '命名规则是“前一级/后一级”。',
    explain: '级间寄存器按它连接的两级命名：IF/ID、ID/EX、EX/MEM、MEM/WB。EX/MEM 保存 ALU 结果、要写入存储器的数据、目的寄存器号和相应的控制信号，供 MEM 级与 WB 级使用。'
  },
  {
    id: 'q7-029',
    ch: 7,
    sec: 'ch7-perf',
    topic: 'MIPS 数组最大值',
    diff: 3,
    type: 'mips',
    stem: '数组从地址 4096 开始，共 5 个字：5、−3、27、0、41。<code>$a0</code> 是首地址，<code>$a1</code> 是元素个数。请写循环找出最大值，结果存入 <code>$v0</code>。',
    hint: '先把第一个元素当作当前最大值，再用 <code>slt</code> 逐个比较。',
    explain: '参考程序先用 <code>lw</code> 把第一个元素装入 <code>$v0</code>，下标从 1 开始。循环中用 <code>sll</code> 和 <code>addu</code> 求元素地址，<code>lw</code> 取元素，<code>slt $t3,$v0,$t2</code> 判断当前最大值是否小于新元素；若小于则用 <code>move</code> 更新。数组最大值是 41。这段循环也展示了“用程序动态指令数估算执行时间”的 IC 来源。',
    lab: {
      init: {
        regs: { a0: 4096, a1: 5 },
        memory: { 4096: [5, -3, 27, 0, 41] }
      },
      expect: { regs: { v0: 41 } },
      maxSteps: 3000,
      starter: '# 在这里写循环找最大值，结果放入 $v0\n',
      solution: [
        '        lw   $v0, 0($a0)',
        '        li   $t0, 1',
        'loop:   beq  $t0, $a1, done',
        '        sll  $t1, $t0, 2',
        '        addu $t1, $t1, $a0',
        '        lw   $t2, 0($t1)',
        '        slt  $t3, $v0, $t2',
        '        beq  $t3, $zero, skip',
        '        move $v0, $t2',
        'skip:   addiu $t0, $t0, 1',
        '        j    loop',
        'done:'
      ].join('\n')
    }
  },
  {
    id: 'q7-030',
    ch: 7,
    sec: 'ch7-pipe-dp',
    topic: '流水线控制信号波形',
    diff: 3,
    type: 'wave',
    stem: '五级流水线执行 <code>lw</code>：t4 进入 MEM 级，t5 进入 WB 级，每个时间片为一个周期。请画出 <code>MemRead</code> 与 <code>RegWrite</code> 的波形；控制信号随指令逐级传递。',
    hint: '<code>lw</code> 在 MEM 级读数据，在 WB 级写寄存器。',
    explain: '<code>MemRead</code> 只在 MEM 级有效，即 t4；<code>RegWrite</code> 只在 WB 级有效，即 t5。虽然这两个信号在 ID 级就已经译码产生，但它们会随 <code>ID/EX</code>、<code>EX/MEM</code>、<code>MEM/WB</code> 逐级传递，到对应级才真正起作用。',
    lab: {
      rows: [
        { name: 'lw 处于 MEM', cells: [0, 0, 0, 1, 0, 0, 0, 0], fixed: true },
        { name: 'lw 处于 WB', cells: [0, 0, 0, 0, 1, 0, 0, 0], fixed: true },
        { name: 'MemRead', cells: [0, 0, 0, 0, 0, 0, 0, 0], fixed: false },
        { name: 'RegWrite', cells: [0, 0, 0, 0, 0, 0, 0, 0], fixed: false }
      ],
      solution: {
        MemRead: [0, 0, 0, 1, 0, 0, 0, 0],
        RegWrite: [0, 0, 0, 0, 1, 0, 0, 0]
      },
      note: '每个时间片是一个时钟周期；点击可变行切换 0/1。'
    }
  },
  {
    id: 'q7-031',
    ch: 7,
    sec: 'ch7-pipe-ctrl',
    topic: '结构冒险',
    diff: 2,
    type: 'single',
    stem: '结构冒险的典型原因是：',
    options: ['后一条指令需要前一条尚未写回的结果', '两条指令同时争用同一硬件，例如单端口存储器同时取指与访存', '分支结果未确定却已经取指', '时钟频率过高'],
    answer: 1,
    hint: '冒险的名字提示了“资源结构”冲突。',
    explain: '结构冒险是硬件资源冲突：两条指令在同一周期都要用同一个部件。典型例子是统一存储器在 IF 级取指、在 MEM 级读数据。数据相关属于数据冒险，分支未定属于控制冒险。'
  },
  {
    id: 'q7-032',
    ch: 7,
    sec: 'ch7-pipe-ctrl',
    topic: '流水线冲刷',
    diff: 1,
    type: 'fill',
    stem: '流水线冲刷（flush）时，通常把错误路径上指令的控制信号清成____，使它们不改变体系结构状态。',
    accept: ['0', '零', '清零'],
    placeholder: '填一个数字',
    hint: '控制信号全无效，指令就变成“空操作”。',
    explain: '把控制信号清零后，错误路径上的指令虽然还会继续流过流水线，但不会写寄存器、不会写存储器、也不会更新 PC，相当于气泡。这样既能快速腾空流水线，又不会破坏体系结构状态。'
  },
  {
    id: 'q7-033',
    ch: 7,
    sec: 'ch7-pipe-ctrl',
    topic: '结构冒险的解决',
    diff: 2,
    type: 'multi',
    stem: '下列哪些方法可以缓解结构冒险？',
    options: ['分离指令存储器与数据存储器', '复制或增加硬件资源', '停顿流水线', '前递（forwarding）'],
    answer: [0, 1, 2],
    hint: '前递解决的是“数据来得太晚”，不是“资源不够”。',
    explain: '分离指令/数据存储器可以避免取指与访存争用同一端口；复制资源（如双端口寄存器文件、多个加法器）可以同时满足两条指令；实在不行就停顿一拍。前递解决数据冒险，不增加硬件资源，因此不能缓解结构冒险。'
  },
  {
    id: 'q7-034',
    ch: 7,
    sec: 'ch7-data-hazard',
    topic: 'RAW 冒险',
    diff: 1,
    type: 'single',
    stem: '执行序列为 <code>add $s0, $t0, $t1</code> 后接 <code>sub $t2, $s0, $t3</code>。<code>sub</code> 对 <code>$s0</code> 的依赖属于哪类冒险？',
    options: ['RAW（写后读）', 'WAR（读后写）', 'WAW（写后写）', '结构冒险'],
    answer: 0,
    hint: '前一条写，后一条读，而且读的是新值。',
    explain: '<code>add</code> 写 <code>$s0</code>，<code>sub</code> 随后读 <code>$s0</code>，这是典型的写后读 RAW，也叫真相关。WAR 是后一条写、前一条还在读；WAW 是两条都写同一寄存器。'
  },
  {
    id: 'q7-035',
    ch: 7,
    sec: 'ch7-data-hazard',
    topic: '前递与停顿',
    diff: 2,
    type: 'single',
    stem: '在 <code>add $s0, $t0, $t1</code> 后接 <code>sub $t2, $s0, $t3</code> 的序列中，<code>add</code> 的结果在 EX 末产生，<code>sub</code> 在下一周期的 EX 级就要使用它。若支持从 EX/MEM 前递，需要插入几个停顿周期？',
    options: ['0 个', '1 个', '2 个', '3 个'],
    answer: 0,
    hint: '<code>add</code> 的结果在 <code>sub</code> 进入 EX 之前已经可用。',
    explain: '<code>add</code> 在周期 3 的 EX 末算出结果，<code>sub</code> 在周期 4 的 EX 级才需要它。此时结果已保存在 <code>EX/MEM</code> 中，可以直接前递到 <code>sub</code> 的 ALU 输入，不需要停顿。只有 <code>lw</code> 这类数据到 MEM 末才可用的指令才需要停顿。'
  },
  {
    id: 'q7-036',
    ch: 7,
    sec: 'ch7-data-hazard',
    topic: 'load-use 停顿',
    diff: 1,
    type: 'fill',
    stem: '<code>lw</code> 之后紧跟着一条使用该 load 结果的指令，通常需要停顿____个周期（填数字）。',
    accept: ['1', '一', '1个', '1 个'],
    placeholder: '填整数',
    explain: '<code>lw</code> 的数据在 MEM 级末尾才从存储器读出，而下一条指令在下一周期的 EX 级就需要它，时间上来不及，必须让它在 ID 级多等一拍。停顿一拍后，数据可从 <code>MEM/WB</code> 前递到 EX 级。'
  },
  {
    id: 'q7-037',
    ch: 7,
    sec: 'ch7-data-hazard',
    topic: '前递的局限',
    diff: 2,
    type: 'tf',
    stem: '所有数据冒险都可以只靠前递解决。',
    answer: 0,
    hint: '想想 load-use。',
    explain: '错误。前递只能把“已经算出的结果”提前送走。load-use 冒险中，数据还在存储器里，ALU 没有结果可前递，必须停顿一拍。此外，前递还需要额外的连线和多路选择器，可能增加关键路径。'
  },
  {
    id: 'q7-038',
    ch: 7,
    sec: 'ch7-data-hazard',
    topic: 'load-use 处理步骤',
    diff: 3,
    type: 'order',
    stem: '把流水线处理 load-use 冒险的步骤按合理顺序排列。',
    hint: '先发现相关，再决定停顿，然后冻结前级、清空后级，最后恢复。',
    explain: '处理顺序是：在 ID 级比较 load 的目的寄存器与当前指令的源寄存器 → 判定 load-use 并置位 stall → 冻结 PC 和 IF/ID → 清空 ID/EX 控制信号插入气泡 → 下一周期数据可用，解除停顿并继续。关键点是“冻结前级、清空后级”，这样 load 继续前进，而消费者停在 ID 级等数据。',
    lab: {
      items: [
        '在 ID 级比较 ID/EX 中 load 的目的寄存器 rt 与 IF/ID 中指令的 rs、rt',
        '若相等且 rt 不为 0，判定为 load-use 冒险并置位 stall',
        '冻结 PC 和 IF/ID 寄存器，保持当前指令',
        '把 ID/EX 中的控制信号清零，向 EX 级插入气泡',
        '下一周期解除 stall，load 数据可前递，继续取指'
      ],
      prompt: '按 load-use 冒险的处理顺序排列'
    }
  },
  {
    id: 'q7-039',
    ch: 7,
    sec: 'ch7-data-hazard',
    topic: '冒险检测单元 HDL',
    diff: 3,
    type: 'hdl',
    stem: '写一个组合逻辑冒险检测单元：<code>memread=1</code> 表示 EX 级为 <code>lw</code>，<code>exrt</code> 是目的寄存器，<code>ifrs</code>、<code>ifrt</code> 是 ID 级源寄存器；当 <code>exrt</code> 等于任一源寄存器且不为 0 时，输出 <code>stall=1</code>。',
    hint: '用 <code>assign</code> 加比较与逻辑运算；别忘了排除 <code>exrt==0</code>。',
    explain: '判定式为 stall = memread 且 exrt≠0 且（exrt==ifrs 或 exrt==ifrt）。排除 0 是因为 <code>$0</code> 永远为 0，load 到 <code>$0</code> 不会产生真正的数据依赖。该单元只做比较，不涉及时钟，属于组合逻辑。',
    lab: {
      inputs: [
        { name: 'memread', width: 1 },
        { name: 'exrt', width: 5 },
        { name: 'ifrs', width: 5 },
        { name: 'ifrt', width: 5 }
      ],
      outputs: [
        { name: 'stall', width: 1 }
      ],
      tests: [
        { in: { memread: 1, exrt: 8, ifrs: 8, ifrt: 9 }, out: { stall: 1 } },
        { in: { memread: 1, exrt: 9, ifrs: 8, ifrt: 9 }, out: { stall: 1 } },
        { in: { memread: 1, exrt: 8, ifrs: 9, ifrt: 10 }, out: { stall: 0 } },
        { in: { memread: 0, exrt: 8, ifrs: 8, ifrt: 8 }, out: { stall: 0 } },
        { in: { memread: 1, exrt: 0, ifrs: 0, ifrt: 5 }, out: { stall: 0 } },
        { in: { memread: 1, exrt: 31, ifrs: 31, ifrt: 31 }, out: { stall: 1 } },
        { in: { memread: 1, exrt: 16, ifrs: 16, ifrt: 17 }, out: { stall: 1 } },
        { in: { memread: 1, exrt: 10, ifrs: 11, ifrt: 12 }, out: { stall: 0 } }
      ],
      template: [
        'module hazard_detect(input logic memread,',
        '                    input logic [4:0] exrt, ifrs, ifrt,',
        '                    output logic stall);',
        '  // 在这里编写',
        'endmodule'
      ].join('\n'),
      solution: [
        'module hazard_detect(input logic memread,',
        '                     input logic [4:0] exrt, ifrs, ifrt,',
        '                     output logic stall);',
        '  assign stall = memread & (exrt != 0) &',
        '                 ((exrt == ifrs) | (exrt == ifrt));',
        'endmodule'
      ].join('\n'),
      moduleName: 'hazard_detect'
    }
  },
  {
    id: 'q7-040',
    ch: 7,
    sec: 'ch7-control-hazard',
    topic: '控制冒险',
    diff: 1,
    type: 'single',
    stem: '控制冒险产生的主要原因是：',
    options: ['两条指令同时访问存储器', '分支或跳转结果尚未确定，流水线已取入了后续指令', '寄存器文件写端口不足', 'ALU 延迟太长'],
    answer: 1,
    hint: 'PC 下一条该取哪里，还不确定。',
    explain: '控制冒险来自 PC 的不确定性：条件分支要在 EX 级比较完才知道方向，<code>jr</code> 要等寄存器读出目标地址。流水线不能空等，会先按某个 PC 取指；一旦方向错了，就必须冲刷错误路径上的指令。选项 A 是结构冒险。'
  },
  {
    id: 'q7-041',
    ch: 7,
    sec: 'ch7-control-hazard',
    topic: '分支冲刷代价',
    diff: 3,
    type: 'single',
    stem: '五级流水线中，条件分支在 EX 级结束时才确定方向。若预测错误，通常要冲刷几条已经取入的错误路径指令？',
    options: ['0 条', '1 条', '2 条', '4 条'],
    answer: 2,
    hint: '分支在 EX 时，它后面的指令分别在哪个级？',
    explain: '分支进入 EX 级时，它后面已经有两条指令分别进入 ID 和 IF。若分支 Taken 而之前按 Not Taken 取指，这两条都是错误路径，需要冲刷 <code>IF/ID</code> 和 <code>ID/EX</code> 的控制信号。因此典型的分支惩罚是 2 个周期；把比较提前到 ID 级可以把它降到 1 个周期。'
  },
  {
    id: 'q7-042',
    ch: 7,
    sec: 'ch7-exception',
    topic: '精确异常',
    diff: 2,
    type: 'single',
    stem: '“精确异常”的含义是：',
    options: ['异常处理程序可以忽略异常指令', '异常指令之前的指令全部完成，之后的指令都不改变体系结构状态', '所有指令都执行完后才处理异常', '异常时直接停机'],
    answer: 1,
    hint: '“精确”指的是状态边界清楚，可恢复。',
    explain: '精确异常要求异常指令之前的所有指令都已完成并可见，异常指令之后的所有指令都没有写寄存器、写存储器或更新 PC。这样处理程序返回时，程序状态就像在异常指令处被精确暂停过一样。乱序完成若不按序提交，就可能破坏这个性质。'
  },
  {
    id: 'q7-043',
    ch: 7,
    sec: 'ch7-exception',
    topic: 'EPC',
    diff: 1,
    type: 'fill',
    stem: '发生异常时，处理器通常把出错指令的 PC 保存到____寄存器。',
    accept: ['EPC', 'epc', 'EPC 寄存器', 'EPC寄存器'],
    placeholder: '填寄存器缩写',
    hint: 'Exception Program Counter。',
    explain: 'EPC（Exception Program Counter）保存出错指令的地址，异常处理完后用 <code>eret</code> 从 EPC 恢复 PC，回到出错指令或它的下一条继续执行。异常原因则记录在 <code>Cause</code> 寄存器中。'
  },
  {
    id: 'q7-044',
    ch: 7,
    sec: 'ch7-exception',
    topic: '异常处理步骤',
    diff: 2,
    type: 'multi',
    stem: '精确处理异常通常包括下列哪些步骤？',
    options: ['检测异常并把原因记录到 Cause', '把出错指令的 PC 写入 EPC', '冲刷流水线中该指令之后的指令', '让后续指令先写回，稍后再撤销'],
    answer: [0, 1, 2],
    hint: '精确异常要求后续指令“不生效”。',
    explain: '标准流程是：检测异常 → 记录 Cause 和 EPC → 冲刷该指令之后的指令 → 跳到异常处理程序 → 处理完用 <code>eret</code> 返回。让后续指令先写回会产生不精确异常，体系结构状态已被“未来”指令改过，很难恢复。'
  },
  {
    id: 'q7-045',
    ch: 7,
    sec: 'ch7-advanced',
    topic: '寄存器重命名',
    diff: 2,
    type: 'single',
    stem: '寄存器重命名主要用来解决：',
    options: ['结构冒险', 'WAR 与 WAW 冒险', '控制冒险', 'Cache 容量缺失'],
    answer: 1,
    hint: '重命名消除的是“名字冲突”，不是真相关。',
    explain: 'WAR 和 WAW 是假相关：指令争用同一个逻辑寄存器名，但数据本身没有先后依赖。寄存器重命名把逻辑寄存器映射到不同的物理寄存器，让这些指令可以并行；RAW 真相关仍然存在，必须靠前递或等待解决。'
  },
  {
    id: 'q7-046',
    ch: 7,
    sec: 'ch7-advanced',
    topic: '提高 IPC 的技术',
    diff: 2,
    type: 'multi',
    stem: '下列哪些技术主要用来提高 IPC（每周期完成指令数）？',
    options: ['超标量发射', '乱序执行', '同时多线程（SMT）', '单纯加深流水线以提高时钟频率'],
    answer: [0, 1, 2],
    hint: 'IPC 是“每周期几条”，频率是“每秒几周期”。',
    explain: '超标量每周期发射多条指令，乱序执行减少等待，SMT 用另一个线程填充空闲发射槽，三者都直接提高 IPC。加深流水线主要提高时钟频率，而且可能因分支惩罚和寄存器开销使 CPI 变差，不是直接提高 IPC 的技术。'
  }
]);

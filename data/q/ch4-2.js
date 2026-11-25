window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q4-025',
    ch: 4,
    sec: 'ch4-case',
    topic: 'case 与 default',
    diff: 1,
    type: 'single',
    stem: '组合 <code>case</code> 中写 <code>default</code> 的主要作用是？',
    options: [
      '提高仿真速度',
      '覆盖未列出的取值，避免推断锁存器',
      '让综合器删除其他分支',
      '语法必需，否则编译报错'
    ],
    answer: 1,
    explain: '<code>default</code> 给所有未列出的选择码一个确定输出，使每条路径都有赋值，从而避免组合块推断锁存器；它也让非法状态回到可控值。缺 <code>default</code> 语法仍合法，所以更容易被忽略。'
  },
  {
    id: 'q4-026',
    ch: 4,
    sec: 'ch4-case',
    topic: '锁存器推断',
    diff: 3,
    type: 'multi',
    stem: '下列 <code>always_comb</code> 片段中，会推断出锁存器的有？',
    options: [
      '<code>always_comb if (en) y = d;</code>',
      '<code>always_comb begin y = 1\'b0; if (en) y = d; end</code>',
      '<code>always_comb case (s) 1\'b0: y = a; endcase</code>',
      '<code>always_comb begin case (s) 1\'b0: y = a; default: y = b; endcase end</code>',
      '<code>always_comb y = a &amp; b;</code>'
    ],
    answer: [0, 2],
    explain: 'A 在 <code>en=0</code> 时没有给 <code>y</code> 赋值；C 在 <code>s=1</code> 时没有给 <code>y</code> 赋值，两者都必须“保持”，于是推断锁存器。B 开头给了默认值，D 有 <code>default</code>，E 是无条件赋值，都不会推锁存器。'
  },
  {
    id: 'q4-027',
    ch: 4,
    sec: 'ch4-case',
    topic: '无关项',
    diff: 2,
    type: 'fill',
    stem: '在 <code>case</code> 分支标签 <code>3\'b01x</code> 中，<code>x</code> 用作什么项？填“无关”或“无关项”。',
    accept: ['无关', '无关项'],
    placeholder: '两个字',
    explain: '教材用它表示<b>无关项</b>（don\'t care）：综合器可以自由选择 0 或 1，以换取更简的逻辑。仿真时 <code>x</code> 仍是未知值，不能当作确定的 0 写进测试向量；两者要区分清楚。'
  },
  {
    id: 'q4-028',
    ch: 4,
    sec: 'ch4-case',
    topic: '译码器',
    diff: 2,
    type: 'hdl',
    stem: '实现带使能的 2-4 译码器：<code>en=1</code> 时 <code>sel=0..3</code> 分别使 <code>y</code> 的对应一位为 1；<code>en=0</code> 时 <code>y=0</code>。',
    explain: '先在 <code>always_comb</code> 开头令 <code>y=0</code>，再在 <code>en</code> 有效时用 <code>case</code> 把对应位置 1。这样 <code>en=0</code> 和未列出的 <code>sel</code> 都有确定值，不会推锁存器；<code>default</code> 分支保证选择码覆盖完整。',
    lab: {
      inputs: [{ name: 'sel', width: 2 }, { name: 'en', width: 1 }],
      outputs: [{ name: 'y', width: 4 }],
      tests: [
        { in: { sel: 0, en: 0 }, out: { y: 0 } },
        { in: { sel: 3, en: 0 }, out: { y: 0 } },
        { in: { sel: 0, en: 1 }, out: { y: 1 } },
        { in: { sel: 1, en: 1 }, out: { y: 2 } },
        { in: { sel: 2, en: 1 }, out: { y: 4 } },
        { in: { sel: 3, en: 1 }, out: { y: 8 } }
      ],
      template: 'module dec2_4(input logic [1:0] sel,\n              input logic en,\n              output logic [3:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module dec2_4(input logic [1:0] sel,\n              input logic en,\n              output logic [3:0] y);\n  always_comb begin\n    y = 4\'b0000;\n    if (en) begin\n      case (sel)\n        2\'b00: y = 4\'b0001;\n        2\'b01: y = 4\'b0010;\n        2\'b10: y = 4\'b0100;\n        default: y = 4\'b1000;\n      endcase\n    end\n  end\nendmodule',
      moduleName: 'dec2_4'
    }
  },
  {
    id: 'q4-029',
    ch: 4,
    sec: 'ch4-case',
    topic: '优先级编码器',
    diff: 3,
    type: 'hdl',
    stem: '实现 4 输入优先级编码器：<code>a[3]</code> 优先级最高，输出最高位的编号 <code>y</code>；无输入时 <code>valid=0</code>。',
    explain: '<code>if/else if</code> 链天然表达优先级：先判断 <code>a[3]</code>，再依次下降。开头先给 <code>valid=1</code>，最后 <code>else</code> 再清零，保证所有路径都有赋值；漏掉最后的 <code>else</code> 会推锁存器。',
    lab: {
      inputs: [{ name: 'a', width: 4 }],
      outputs: [{ name: 'y', width: 2 }, { name: 'valid', width: 1 }],
      tests: [
        { in: { a: 0 }, out: { y: 0, valid: 0 } },
        { in: { a: 1 }, out: { y: 0, valid: 1 } },
        { in: { a: 2 }, out: { y: 1, valid: 1 } },
        { in: { a: 4 }, out: { y: 2, valid: 1 } },
        { in: { a: 8 }, out: { y: 3, valid: 1 } },
        { in: { a: 5 }, out: { y: 2, valid: 1 } },
        { in: { a: 15 }, out: { y: 3, valid: 1 } }
      ],
      template: 'module prio4(input logic [3:0] a,\n             output logic [1:0] y,\n             output logic valid);\n  // 在这里编写\nendmodule',
      solution: 'module prio4(input logic [3:0] a,\n             output logic [1:0] y,\n             output logic valid);\n  always_comb begin\n    valid = 1\'b1;\n    if (a[3]) y = 2\'b11;\n    else if (a[2]) y = 2\'b10;\n    else if (a[1]) y = 2\'b01;\n    else if (a[0]) y = 2\'b00;\n    else begin\n      y = 2\'b00;\n      valid = 1\'b0;\n    end\n  end\nendmodule',
      moduleName: 'prio4'
    }
  },
  {
    id: 'q4-030',
    ch: 4,
    sec: 'ch4-block',
    topic: '赋值语义',
    diff: 1,
    type: 'single',
    stem: '关于阻塞赋值 <code>=</code> 与非阻塞赋值 <code>&lt;=</code>，正确的是？',
    options: [
      '阻塞立即更新，非阻塞在时间步末统一更新',
      '阻塞用于时序逻辑，非阻塞用于组合逻辑',
      '非阻塞赋值会立即更新左值',
      '两种赋值的综合结果永远相同'
    ],
    answer: 0,
    explain: '阻塞赋值执行完立即生效，后续语句能看到新值；非阻塞赋值先算右边，左值在时间步末统一更新。B 把场合说反了；C 与语义相反；D 忽略了仿真竞争与综合差异。'
  },
  {
    id: 'q4-031',
    ch: 4,
    sec: 'ch4-block',
    topic: '时序赋值',
    diff: 2,
    type: 'fill',
    stem: '时序逻辑中更新寄存器应使用哪种赋值？填“阻塞”或“非阻塞”。',
    accept: ['非阻塞', '非阻塞赋值'],
    placeholder: '阻塞 / 非阻塞',
    explain: '寄存器在时钟沿同时采样，必须用非阻塞 <code>&lt;=</code> 才能正确建模“所有触发器一起更新”。组合逻辑才用阻塞 <code>=</code>；在 <code>always_ff</code> 中写阻塞是典型的仿真竞争来源。'
  },
  {
    id: 'q4-032',
    ch: 4,
    sec: 'ch4-block',
    topic: '阻塞赋值陷阱',
    diff: 3,
    type: 'tf',
    stem: '在同一个 <code>always_ff</code> 块里，<code>a = b; b = a;</code> 能正确交换两个寄存器。',
    answer: 0,
    explain: '第一条阻塞赋值先把 <code>a</code> 改成 <code>b</code> 的值，第二条再把这个“新 <code>a</code>”赋给 <code>b</code>，于是两个寄存器都等于原来的 <code>b</code>，交换失败。应使用 <code>a &lt;= b; b &lt;= a;</code>，让两条右边都取旧值。'
  },
  {
    id: 'q4-033',
    ch: 4,
    sec: 'ch4-block',
    topic: '编码规则',
    diff: 2,
    type: 'multi',
    stem: '下列编码规则中，正确的有？',
    options: [
      '组合逻辑用 <code>always_comb</code> + 阻塞赋值',
      '时序逻辑用 <code>always_ff</code> + 非阻塞赋值',
      '同一信号可以在两个 <code>always</code> 块中赋值，只要类型相同',
      '组合 <code>always</code> 块开头给输出默认值可避免锁存器',
      '<code>assign</code> 语句里可以使用 <code>&lt;=</code> 非阻塞赋值'
    ],
    answer: [0, 1, 3],
    explain: 'A、B 是两条基本配对，D 是防锁存器的常用手段。C 会造成多驱动，仿真出现 X；<code>assign</code> 是连续赋值，只用 <code>=</code>，没有非阻塞语义，所以 E 错。'
  },
  {
    id: 'q4-034',
    ch: 4,
    sec: 'ch4-block',
    topic: '组合块中的顺序',
    diff: 3,
    type: 'single',
    stem: '在 <code>always_comb</code> 中写 <code>t = a &amp; b; y = t | c;</code>，这里用阻塞赋值的主要理由是？',
    options: [
      '让 <code>t</code> 的新值对下一句立即可见',
      '让 <code>t</code> 延迟到块末再更新',
      '阻塞赋值能推断触发器',
      '防止 <code>t</code> 出现 X'
    ],
    answer: 0,
    explain: '组合块中的语句按顺序描述组合依赖：先算 <code>t</code>，下一句立刻用新 <code>t</code> 算 <code>y</code>。若用非阻塞，<code>y</code> 会读到旧的 <code>t</code>，仿真行为与预期不符；B 描述的是非阻塞，C、D 都不是阻塞赋值的功能。'
  },
  {
    id: 'q4-035',
    ch: 4,
    sec: 'ch4-fsm',
    topic: '三段式分工',
    diff: 2,
    type: 'single',
    stem: '三段式 FSM 中，负责在时钟沿更新当前状态的是哪个块？',
    options: [
      '带复位的 <code>always_ff</code>',
      '计算次态的 <code>always_comb</code>',
      '输出译码的 <code>assign</code>',
      '产生激励的 <code>initial</code>'
    ],
    answer: 0,
    explain: '三段式的第一段是状态寄存器：<code>always_ff @(posedge clk)</code> 在时钟沿把 <code>nextstate</code> 打入 <code>state</code>。第二段算次态，第三段算输出；<code>initial</code> 只用于仿真，不参与可综合的 FSM。'
  },
  {
    id: 'q4-036',
    ch: 4,
    sec: 'ch4-fsm',
    topic: 'FSM 风格',
    diff: 2,
    type: 'fill',
    stem: '把状态寄存器、次态逻辑、输出逻辑分开写的 FSM 风格称为___段式。填一个字。',
    accept: ['三', '3', '三段式'],
    placeholder: '一 / 二 / 三',
    explain: '三段式把三部分拆开：状态寄存器用 <code>always_ff</code>，次态用 <code>always_comb</code>，输出单独译码。它比一段式易读、综合结果可预测，是推荐写法。'
  },
  {
    id: 'q4-037',
    ch: 4,
    sec: 'ch4-fsm',
    topic: '三段式优点',
    diff: 3,
    type: 'multi',
    stem: '三段式 FSM 的优点包括？',
    options: [
      '状态寄存器与组合逻辑分离，综合结果可预测',
      '输出可以单独寄存，减少毛刺',
      '可以在次态逻辑中加 <code>default</code> 处理非法状态',
      '一定比一段式使用更少的触发器',
      '不再需要复位'
    ],
    answer: [0, 1, 2],
    explain: 'A、B、C 都是三段式的实际好处。D 错：触发器数量由状态编码和输出是否寄存决定，三段式不保证更少；E 错：无论几段式，状态寄存器都需要复位进入确定状态。'
  },
  {
    id: 'q4-038',
    ch: 4,
    sec: 'ch4-fsm',
    topic: '次态逻辑',
    diff: 3,
    type: 'hdl',
    stem: '实现 FSM 次态逻辑：<code>S0</code> 在 <code>ta</code> 时保持、否则 <code>tb</code> 时进 <code>S1</code>；<code>S1→S2</code>；<code>S2</code> 在 <code>tb</code> 时保持、否则 <code>ta</code> 时进 <code>S3</code>；<code>S3→S0</code>。编码 00/01/10/11。',
    explain: '用 <code>case (state)</code> 逐状态写次态，<code>S0</code>、<code>S2</code> 内的 <code>?:</code> 表达信号优先级，<code>default</code> 处理 <code>S3</code> 和非法编码。只写组合逻辑，不要在这里更新 <code>state</code>；状态寄存器应放在另一个 <code>always_ff</code> 中。',
    lab: {
      inputs: [{ name: 'state', width: 2 }, { name: 'ta', width: 1 }, { name: 'tb', width: 1 }],
      outputs: [{ name: 'next', width: 2 }],
      tests: [
        { in: { state: 0, ta: 0, tb: 0 }, out: { next: 0 } },
        { in: { state: 0, ta: 0, tb: 1 }, out: { next: 1 } },
        { in: { state: 0, ta: 1, tb: 1 }, out: { next: 0 } },
        { in: { state: 1, ta: 0, tb: 0 }, out: { next: 2 } },
        { in: { state: 2, ta: 0, tb: 0 }, out: { next: 2 } },
        { in: { state: 2, ta: 1, tb: 0 }, out: { next: 3 } },
        { in: { state: 2, ta: 0, tb: 1 }, out: { next: 2 } },
        { in: { state: 3, ta: 0, tb: 0 }, out: { next: 0 } }
      ],
      template: 'module fsm_next(input logic [1:0] state,\n                input logic ta, tb,\n                output logic [1:0] next);\n  // 在这里编写\nendmodule',
      solution: 'module fsm_next(input logic [1:0] state,\n                input logic ta, tb,\n                output logic [1:0] next);\n  always_comb begin\n    case (state)\n      2\'b00: next = ta ? 2\'b00 : (tb ? 2\'b01 : 2\'b00);\n      2\'b01: next = 2\'b10;\n      2\'b10: next = tb ? 2\'b10 : (ta ? 2\'b11 : 2\'b10);\n      default: next = 2\'b00;\n    endcase\n  end\nendmodule',
      moduleName: 'fsm_next'
    }
  },
  {
    id: 'q4-039',
    ch: 4,
    sec: 'ch4-fsm',
    topic: '输出译码',
    diff: 3,
    type: 'hdl',
    stem: '实现 FSM 输出译码：<code>state=00</code> 输出 <code>3\'b100</code>，<code>01</code> 输出 <code>3\'b010</code>，其余输出 <code>3\'b001</code>。',
    explain: '输出只由当前状态决定，是纯组合逻辑。用 <code>case</code> 列 00、01，再用 <code>default</code> 覆盖 10、11，写成 <code>3\'b001</code>。所有分支都赋值，避免锁存；若输出需要去毛刺，可在 <code>case</code> 结果后再打一拍寄存器。',
    lab: {
      inputs: [{ name: 'state', width: 2 }],
      outputs: [{ name: 'la', width: 3 }],
      tests: [
        { in: { state: 0 }, out: { la: 4 } },
        { in: { state: 1 }, out: { la: 2 } },
        { in: { state: 2 }, out: { la: 1 } },
        { in: { state: 3 }, out: { la: 1 } }
      ],
      template: 'module fsm_out(input logic [1:0] state,\n               output logic [2:0] la);\n  // 在这里编写\nendmodule',
      solution: 'module fsm_out(input logic [1:0] state,\n               output logic [2:0] la);\n  always_comb begin\n    case (state)\n      2\'b00: la = 3\'b100;\n      2\'b01: la = 3\'b010;\n      default: la = 3\'b001;\n    endcase\n  end\nendmodule',
      moduleName: 'fsm_out'
    }
  },
  {
    id: 'q4-040',
    ch: 4,
    sec: 'ch4-param',
    topic: '参数覆盖',
    diff: 1,
    type: 'single',
    stem: '<code>mux2 #(.WIDTH(32)) mux32 (...);</code> 中 <code>#(.WIDTH(32))</code> 的作用是？',
    options: [
      '把实例的 <code>WIDTH</code> 参数覆盖为 32',
      '生成 32 个 <code>mux2</code> 实例',
      '把模块名改成 <code>mux32</code>',
      '设置 32 个时间单位的延时'
    ],
    answer: 0,
    explain: '<code>#(...)</code> 是参数覆盖列表，<code>.WIDTH(32)</code> 把该实例的参数 <code>WIDTH</code> 设为 32，于是端口位宽变成 32 位。实例名是后面的 <code>mux32</code>，与参数无关；它也不会生成多个实例。'
  },
  {
    id: 'q4-041',
    ch: 4,
    sec: 'ch4-param',
    topic: '参数位宽',
    diff: 2,
    type: 'fill',
    stem: '模块 <code>module m #(parameter W = 4) (input logic [W-1:0] a);</code> 实例化为 <code>m #(.W(8)) u(...)</code> 后，端口 <code>a</code> 的位宽是多少位？',
    accept: ['8', '8位'],
    placeholder: '位数',
    explain: '实例化时 <code>.W(8)</code> 把参数覆盖为 8，端口声明 <code>[W-1:0]</code> 随之变成 <code>[7:0]</code>，共 8 位。若忘记覆盖，默认值 4 会生效；参数化模块的位宽由实例参数决定，不是固定值。'
  },
  {
    id: 'q4-042',
    ch: 4,
    sec: 'ch4-param',
    topic: '位拼接',
    diff: 2,
    type: 'hdl',
    stem: '实现字节内高低半字节交换：输入 <code>a[7:0]</code>，输出 <code>y = {a[3:0], a[7:4]}</code>。',
    explain: '拼接的高位写在左边：<code>{a[3:0], a[7:4]}</code> 把原来的低 4 位放到结果高 4 位，原来的高 4 位放到结果低 4 位。不要写反成 <code>{a[7:4], a[3:0]}</code>，那是原样输出。',
    lab: {
      inputs: [{ name: 'a', width: 8 }],
      outputs: [{ name: 'y', width: 8 }],
      tests: [
        { in: { a: 18 }, out: { y: 33 } },
        { in: { a: 165 }, out: { y: 90 } },
        { in: { a: 0 }, out: { y: 0 } },
        { in: { a: 255 }, out: { y: 255 } }
      ],
      template: 'module nibble_swap(input logic [7:0] a,\n                   output logic [7:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module nibble_swap(input logic [7:0] a,\n                   output logic [7:0] y);\n  assign y = {a[3:0], a[7:4]};\nendmodule',
      moduleName: 'nibble_swap'
    }
  },
  {
    id: 'q4-043',
    ch: 4,
    sec: 'ch4-tb',
    topic: 'testbench 作用',
    diff: 1,
    type: 'single',
    stem: 'testbench 的主要作用是？',
    options: [
      '综合成硬件',
      '产生激励并检查输出，不参与综合',
      '替代综合工具',
      '只能测试时序电路'
    ],
    answer: 1,
    explain: 'testbench 是仿真实验台：实例化 DUT、产生时钟/复位/输入，比较输出并报告 PASS/FAIL。它含 <code>initial</code>、延时等不可综合语句，所以不进入芯片；组合电路同样需要 testbench。'
  },
  {
    id: 'q4-044',
    ch: 4,
    sec: 'ch4-tb',
    topic: 'X 检查',
    diff: 2,
    type: 'single',
    stem: 'testbench 中用 <code>if (y !== 1\'b1)</code> 而不是 <code>!=</code>，主要原因是？',
    options: [
      '能检测 X/Z，避免未知值被误判为匹配',
      '运行速度更快',
      '语法强制要求',
      '会把 <code>y</code> 强制置 1'
    ],
    answer: 0,
    explain: '<code>!==</code> 是 case 不等，X 与 1 比较结果为“不等”，能明确报错；<code>!=</code> 遇到 X 得到 X，<code>if</code> 把 X 当假，错误可能被漏掉。它不会改变 <code>y</code> 的值，也不是语法强制。'
  },
  {
    id: 'q4-045',
    ch: 4,
    sec: 'ch4-tb',
    topic: '时钟周期',
    diff: 3,
    type: 'fill',
    stem: '<code>always #5 clk = ~clk;</code> 产生的时钟周期是多少个时间单位？',
    accept: ['10', '10个时间单位'],
    placeholder: '时间单位数',
    explain: '<code>#5</code> 只延迟半个周期：翻转一次用 5 个时间单位，再翻转一次回到原值，所以完整周期是 10。答 5 是把半周期当成了周期，是最常见的错误。'
  },
  {
    id: 'q4-046',
    ch: 4,
    sec: 'ch4-summary',
    topic: '写法配对',
    diff: 1,
    type: 'match',
    stem: '把建模任务与推荐写法配对。',
    explain: '组合逻辑用 <code>always_comb</code> + 阻塞赋值；时序逻辑用 <code>always_ff</code> + 非阻塞赋值；参数化用 <code>parameter</code>/<code>generate</code>；层次化用模块实例化；仿真激励用 <code>initial</code> 与 <code>$display</code>。这五组对应关系就是本章的骨架。',
    lab: {
      pairs: [
        ['组合逻辑', '<code>always_comb</code> + 阻塞赋值'],
        ['时序逻辑', '<code>always_ff</code> + 非阻塞赋值'],
        ['参数化模块', '<code>parameter</code> / <code>generate</code>'],
        ['结构化建模', '模块实例化与端口连接'],
        ['测试程序', '<code>initial</code> / <code>$display</code>']
      ]
    }
  },
  {
    id: 'q4-047',
    ch: 4,
    sec: 'ch4-summary',
    topic: '可综合性',
    diff: 2,
    type: 'single',
    stem: '下列哪项只能用于仿真、不能综合？',
    options: [
      '<code>assign</code> 连续赋值',
      '<code>always_comb</code>',
      '<code>#5</code> 延时',
      '<code>case</code> 语句'
    ],
    answer: 2,
    explain: '<code>#5</code> 是仿真延时，综合工具会忽略或报错；可综合的 RTL 不描述绝对时间，而用时钟沿和状态来安排时序。<code>assign</code>、<code>always_comb</code>、<code>case</code> 都属于可综合子集。'
  },
  {
    id: 'q4-048',
    ch: 4,
    sec: 'ch4-summary',
    topic: '组合块缺省值',
    diff: 3,
    type: 'single',
    stem: '<code>always_comb begin y = 1\'b0; case (s) 2\'b00: y = a; 2\'b01: y = b; endcase end</code>，当 <code>s = 2\'b10</code> 时 <code>y</code> 等于？',
    options: ['<code>1\'b0</code>', '<code>a</code>', '<code>b</code>', '<code>1\'bx</code>'],
    answer: 0,
    explain: '<code>case</code> 没有 <code>default</code>，但块开头已经给 <code>y</code> 赋了默认值 0；<code>s=10</code> 不匹配任何分支，<code>y</code> 保持默认值 0。这正是“先赋默认值”避免锁存器的原因，不能想当然认为输出是 X。'
  }
);

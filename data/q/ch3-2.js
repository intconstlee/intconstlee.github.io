/* 第 3 章 时序逻辑设计 —— 习题（后半：q3-024 ~ q3-046） */
window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q3-024',
    ch: 3,
    sec: 'ch3-fsm',
    topic: 'Moore 型输出',
    diff: 1,
    type: 'single',
    stem: 'Moore 型状态机的输出只取决于：',
    options: ['当前输入', '当前状态', '时钟频率', '上一个输出'],
    answer: 1,
    explain: 'Moore 型的输出逻辑只以状态为输入，因此输出随状态一起更新；Mealy 型的输出逻辑还接入了输入，所以输出可以在状态不变时随输入改变。这也正是 Mealy 输出通常比 Moore 早一个周期的原因。'
  },
  {
    id: 'q3-025',
    ch: 3,
    sec: 'ch3-fsm',
    topic: '状态机概念配对',
    diff: 2,
    type: 'match',
    stem: '把左侧概念与右侧的描述配对。',
    lab: {
      pairs: [
        ['Moore 型输出', '只由当前状态决定，与输入无关'],
        ['Mealy 型输出', '由当前状态和当前输入共同决定'],
        ['独热编码', '每个状态占一位，只有一位为 1'],
        ['二进制编码', '用 ⌈log<sub>2</sub>k⌉ 位表示 k 个状态']
      ]
    },
    explain: 'Moore 与 Mealy 的差别只在输出逻辑的输入来源；独热与二进制的差别在状态寄存器的位数与译码复杂度。把这四组对应关系记牢，“输出画在状态圈内还是弧上”“哪种编码更省触发器”这类选择题就能直接判断。'
  },
  {
    id: 'q3-026',
    ch: 3,
    sec: 'ch3-fsm',
    topic: '状态寄存器',
    diff: 1,
    type: 'fill',
    stem: '有限状态机中，用来保存当前状态 S 的部件是____。',
    placeholder: '部件名',
    accept: ['状态寄存器', '寄存器', 'state register'],
    explain: 'FSM = 状态寄存器 + 次态逻辑 + 输出逻辑。状态寄存器由触发器构成，只在时钟沿更新；次态逻辑和输出逻辑都是纯组合逻辑，前者算 S′，后者算输出。状态位数 k 决定最多能表示 2<sup>k</sup> 个状态。'
  },
  {
    id: 'q3-027',
    ch: 3,
    sec: 'ch3-fsm',
    topic: 'Mealy 输出的毛刺',
    diff: 2,
    type: 'tf',
    stem: 'Mealy 型状态机的输出由触发器直接输出，因此不会出现毛刺。',
    answer: 0,
    explain: '正好相反：Moore 的输出只由状态决定，可以由状态寄存器直接输出，因此干净；Mealy 的输出是“状态 + 输入”经过组合逻辑得到的，输入一变输出就可能跟着变，毛刺会直接出现在输出上。要消除毛刺，可把 Mealy 输出再用一级触发器寄存。'
  },
  {
    id: 'q3-028',
    ch: 3,
    sec: 'ch3-traffic',
    topic: '交通灯复位状态',
    diff: 1,
    type: 'single',
    stem: '交通灯控制器复位后处于 S<sub>0</sub> 状态，此时 A、B 两个方向的灯分别是：',
    options: ['A 绿、B 红', 'A 红、B 绿', 'A 黄、B 红', 'A 红、B 黄'],
    answer: 0,
    explain: '按题设，复位后 A 大道绿灯、B 大道红灯，这就是 S<sub>0</sub> 的含义。黄灯状态 S<sub>1</sub>、S<sub>3</sub> 只持续一个周期且无条件转移，只有绿灯状态才检查传感器。'
  },
  {
    id: 'q3-029',
    ch: 3,
    sec: 'ch3-traffic',
    topic: 'FSM 设计六步法',
    diff: 2,
    type: 'order',
    stem: '把有限状态机的设计六步法按正确顺序排列。',
    lab: {
      items: [
        '从文字规范中识别输入、输出与状态，画出黑盒图',
        '画出状态转换图，标出每个状态的转换条件与输出',
        '选择状态编码，把图转成状态转换表与输出表',
        '由表写出次态方程与输出方程，可借助卡诺图化简',
        '画出电路：状态寄存器 + 次态逻辑 + 输出逻辑',
        '用仿真或时序图验证，检查未用状态与复位行为'
      ],
      prompt: '按六步法从前往后排列'
    },
    explain: '六步法的骨架是“先图后表、先表后式、先式后路、最后验证”。跳过状态图直接写方程，几乎一定漏掉某个转移条件；跳过验证则容易忽略未用状态和复位后的第一拍。'
  },
  {
    id: 'q3-030',
    ch: 3,
    sec: 'ch3-traffic',
    topic: '状态编码位数',
    diff: 1,
    type: 'fill',
    stem: '交通灯控制器的 4 个状态用二进制编码，至少需要____位。',
    placeholder: '数字',
    accept: ['2', '2位', '两位'],
    explain: '2 位可以表示 4 个状态（00、01、10、11），恰好够用；1 位只能表示 2 个状态。一般地，n 个状态至少需要 ⌈log<sub>2</sub>n⌉ 位，而独热编码需要 n 位。'
  },
  {
    id: 'q3-031',
    ch: 3,
    sec: 'ch3-traffic',
    topic: '次态方程代入',
    diff: 3,
    type: 'single',
    stem: '某 2 位状态机的次态满足 S′<sub>1</sub> = S<sub>1</sub>，S′<sub>0</sub> = ¬S<sub>0</sub>。当前状态为 10 时，下一个状态是：',
    options: ['00', '01', '10', '11'],
    answer: 3,
    explain: '把当前状态 S<sub>1</sub>S<sub>0</sub>=10 代入：S′<sub>1</sub>=S<sub>1</sub>=1，S′<sub>0</sub>=¬S<sub>0</sub>，S<sub>0</sub>=0 取反得 1，所以次态是 11。注意取反号只作用在紧跟它的那个变量上，写方程时先确认它覆盖的范围。'
  },
  {
    id: 'q3-032',
    ch: 3,
    sec: 'ch3-traffic',
    topic: '状态译码逻辑',
    diff: 3,
    type: 'gate',
    stem: '交通灯控制器 A 方向的黄灯输出为 L<sub>A0</sub> = ¬S<sub>1</sub>·S<sub>0</sub>。状态编码 S<sub>1</sub>S<sub>0</sub>：00 绿、01 黄、10 红、11 红。用门电路实现这个译码：输入 S<sub>1</sub>、S<sub>0</sub>，输出 L<sub>A0</sub>。',
    hint: '输出只在 01 这一种状态为 1，即 S<sub>1</sub> 为 0 且 S<sub>0</sub> 为 1。',
    lab: {
      inputs: ['S1', 'S0'],
      outs: ['LA0'],
      rows: [[0, 0, 0], [0, 1, 1], [1, 0, 0], [1, 1, 0]],
      allowed: ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'],
      maxGates: 2,
      expr: '~S1 & S0',
      note: '参考解用 2 个门：1 个 NOT 加 1 个 AND。'
    },
    explain: '输出只在 S<sub>1</sub>S<sub>0</sub>=01 时为 1，即“S<sub>1</sub> 为 0 且 S<sub>0</sub> 为 1”，所以是 S<sub>0</sub> 与 ¬S<sub>1</sub> 相与，两个门即可。这是纯组合的译码逻辑，输出再去驱动灯；状态寄存器本身仍由时钟控制，所以不要把触发器画进来。'
  },
  {
    id: 'q3-033',
    ch: 3,
    sec: 'ch3-encoding',
    topic: '独热编码',
    diff: 2,
    type: 'single',
    stem: '独热编码（one-hot）的主要特点是：',
    options: ['用 ⌈log<sub>2</sub>k⌉ 位表示 k 个状态', '用 k 位表示 k 个状态，任何时刻只有一位为 1', '相邻状态只有一位不同', '不需要状态寄存器'],
    answer: 1,
    explain: '独热编码每个状态占一位，k 个状态需要 k 个触发器，任何时刻只有一位为 1。它的次态逻辑与输出逻辑通常更简单，而且“多位同时为 1”可立即判为非法状态；代价是寄存器多。相邻状态只变一位是格雷码的特点。'
  },
  {
    id: 'q3-034',
    ch: 3,
    sec: 'ch3-encoding',
    topic: '状态编码选择',
    diff: 3,
    type: 'multi',
    stem: '关于状态编码的选择，下列说法正确的有：',
    options: [
      '状态多、面积优先时倾向二进制编码',
      '状态少、速度优先时倾向独热编码',
      '独热编码的寄存器位数一定比二进制编码少',
      '格雷码适合状态按固定顺序循环的场合，可减少翻转',
      '未用状态不必处理，上电后自然会回到初始状态'
    ],
    answer: [0, 1, 3],
    explain: '二进制用 ⌈log<sub>2</sub>k⌉ 位，寄存器最省，A 对；独热每位一个状态，逻辑简单、速度快，B 对，但寄存器更多，C 错；格雷码相邻码只变一位，适合顺序循环，D 对；未用状态没有返回路径就可能卡死，必须显式处理，E 错。'
  },
  {
    id: 'q3-035',
    ch: 3,
    sec: 'ch3-timing',
    topic: '建立时间约束',
    diff: 2,
    type: 'single',
    stem: '触发器之间隔一段组合逻辑，其建立时间约束是：',
    options: ['T<sub>c</sub> ≥ t<sub>pcq</sub> + t<sub>pd</sub> + t<sub>setup</sub>', 'T<sub>c</sub> ≥ t<sub>ccq</sub> + t<sub>cd</sub> + t<sub>hold</sub>', 't<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub>', 'T<sub>c</sub> ≤ t<sub>pcq</sub> + t<sub>setup</sub>'],
    answer: 0,
    explain: '一个周期内数据要完成“发送触发器输出（t<sub>pcq</sub>）→ 组合逻辑传播（t<sub>pd</sub>）→ 在下一个沿之前 t<sub>setup</sub> 就稳定”这一整条路，所以 T<sub>c</sub> 至少容纳这三段。B 把保持参数混进了建立约束；C 是保持约束本身；D 的方向与项都不对。'
  },
  {
    id: 'q3-036',
    ch: 3,
    sec: 'ch3-timing',
    topic: '最小时钟周期计算',
    diff: 2,
    type: 'fill',
    stem: '某电路 t<sub>pcq</sub>=60 ps，关键路径 t<sub>pd</sub>=380 ps，t<sub>setup</sub>=40 ps。最小时钟周期是____ps（填整数）。',
    unit: 'ps',
    placeholder: '整数',
    accept: ['480', '480ps'],
    explain: 'T<sub>c,min</sub> = t<sub>pcq</sub> + t<sub>pd</sub> + t<sub>setup</sub> = 60 + 380 + 40 = 480 ps。三个参数单位都是 ps，直接相加即可；若题目混用 ns 与 ps，先统一单位（1 ns = 1000 ps）再相加。'
  },
  {
    id: 'q3-037',
    ch: 3,
    sec: 'ch3-timing',
    topic: '最高频率换算',
    diff: 2,
    type: 'fill',
    stem: '某同步电路的最小时钟周期为 1.25 ns。它支持的最高时钟频率约为____MHz（填整数）。',
    unit: 'MHz',
    placeholder: '整数',
    accept: ['800', '800MHz'],
    explain: 'f<sub>max</sub> = 1 / T<sub>c,min</sub> = 1 / 1.25 ns = 0.8 GHz = 800 MHz。换算时注意 1 ns = 10<sup>−9</sup> s，所以 1/ns 就是 10<sup>9</sup>/s，即 1 GHz；1.25 ns 对应 800 MHz，而不是 1.25 GHz。'
  },
  {
    id: 'q3-038',
    ch: 3,
    sec: 'ch3-timing',
    topic: '保持时间违例修复',
    diff: 2,
    type: 'single',
    stem: '某条触发器到触发器的路径出现<b>保持时间</b>违例，合理的修复方法是：',
    options: ['降低时钟频率', '提高时钟频率', '在这条路径上插入缓冲器，增加最小延迟', '减小触发器的 t<sub>setup</sub>'],
    answer: 2,
    explain: '保持约束 t<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub> 与时钟周期无关，所以降低或提高频率都不影响它，A、B 无效。违例说明数据来得“太快”，解决办法是增加该路径的最小延迟（插缓冲器或延时单元），或增大接收端时钟的延迟。t<sub>setup</sub> 是器件参数，不能改。'
  },
  {
    id: 'q3-039',
    ch: 3,
    sec: 'ch3-skew',
    topic: '时钟偏移的影响',
    diff: 3,
    type: 'single',
    stem: '时钟偏移 t<sub>skew</sub> 对时序的影响是：',
    options: ['只压缩建立余量', '只压缩保持余量', '同时压缩建立余量与保持余量', '与建立、保持都无关'],
    answer: 2,
    explain: '接收触发器时钟晚到 t<sub>skew</sub>，建立约束变成 T<sub>c</sub> ≥ t<sub>pcq</sub> + t<sub>pd</sub> + t<sub>setup</sub> + t<sub>skew</sub>，保持约束变成 t<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub> + t<sub>skew</sub>。两个不等式右边都多了同一项，所以两种余量同时被吃掉，这正是高速芯片要用时钟树或时钟网格控制偏移的原因。'
  },
  {
    id: 'q3-040',
    ch: 3,
    sec: 'ch3-skew',
    topic: '同步器级数',
    diff: 1,
    type: 'fill',
    stem: '把异步输入同步到本地时钟域，常用的同步器结构至少需要____级触发器（填数字）。',
    placeholder: '数字',
    accept: ['2', '两', '二'],
    explain: '第一级直接面对异步输入，可能进入亚稳态；它有整整一个时钟周期去分辨，到第二级采样时绝大多数情况下已经稳定，所以第二级的输出才能当作同步信号使用。多加一级触发器，大致把 MTBF 提高一个数量级。'
  },
  {
    id: 'q3-041',
    ch: 3,
    sec: 'ch3-skew',
    topic: '同步器与亚稳态',
    diff: 3,
    type: 'multi',
    stem: '关于同步器与亚稳态，下列说法正确的有：',
    options: [
      '亚稳态可以被彻底消除，只要同步器级数足够多',
      '同步器的级数越多，MTBF 越大',
      '多比特异步信号不能各自经过同步器后直接使用',
      '异步信号进入本地时钟域前应先经过同步器',
      '同步器能保证多比特数据的一致性'
    ],
    answer: [1, 2, 3],
    explain: '亚稳态只能把概率压到可接受，不能彻底消除，A 错；每多一级触发器，允许的分辨时间多一个周期，MTBF 大致提高一个数量级，B 对；多比特信号各位可能落在不同周期，数据会撕裂，应改用握手或异步 FIFO，C 对；因此异步信号必须先同步，D 对；同步器只解决单比特可靠性，不保证多比特一致性，E 错。'
  },
  {
    id: 'q3-042',
    ch: 3,
    sec: 'ch3-skew',
    topic: '时序参数配对',
    diff: 1,
    type: 'match',
    stem: '把时序参数与其含义配对。',
    lab: {
      pairs: [
        ['t<sub>setup</sub>', '时钟沿之前数据必须稳定的最短时间'],
        ['t<sub>hold</sub>', '时钟沿之后数据必须保持的最短时间'],
        ['t<sub>pcq</sub>', '时钟沿到 Q 达到最终值的最长时间'],
        ['t<sub>ccq</sub>', '时钟沿到 Q 开始变化的最短时间']
      ]
    },
    explain: '四个参数两两成对：建立与保持描述<b>输入</b>相对时钟沿的约束；t<sub>pcq</sub> 与 t<sub>ccq</sub> 描述<b>输出</b>相对时钟沿的延迟，前者取最长用于建立约束，后者取最短用于保持约束。记错方向就会把两个时序方程写反。'
  },
  {
    id: 'q3-043',
    ch: 3,
    sec: 'ch3-parallel',
    topic: '并行的效果',
    diff: 2,
    type: 'single',
    stem: '用两个相同的 FSM 并行处理一条输入流的两半，结果是：',
    options: ['吞吐率约翻倍，单个事件的延迟基本不变', '吞吐率不变，延迟减半', '吞吐率和延迟都翻倍', '吞吐率翻倍，延迟减半'],
    answer: 0,
    explain: '并行是复制硬件同时处理不同任务，单位时间完成的事件数翻倍，但每个事件仍要走完同样长的处理路径，因此延迟不变。要缩短单个任务的延迟，需要流水线或减少组合逻辑级数；并行与流水线解决的是不同的问题。'
  },
  {
    id: 'q3-044',
    ch: 3,
    sec: 'ch3-parallel',
    topic: '吞吐率',
    diff: 1,
    type: 'fill',
    stem: '并行（复制硬件同时工作）主要提高的是____，而不降低单个任务的延迟。',
    placeholder: '三个字',
    accept: ['吞吐率', '吞吐量', 'throughput'],
    explain: '吞吐率是单位时间完成的任务数，延迟是单个任务从进入到完成的时间。两个 FSM 并行，吞吐率翻倍而延迟不变；流水线则通过缩短每级的工作量来提高吞吐率，同时可能因寄存器开销略微增加单任务延迟。'
  },
  {
    id: 'q3-045',
    ch: 3,
    sec: 'ch3-register',
    topic: '带使能触发器波形',
    diff: 2,
    type: 'wave',
    stem: '画出<b>带使能 EN</b> 的正沿 D 触发器的输出 Q：只在 EN=1 的上升沿才更新。CLK 每个周期占 2 个时间片（前一片为 0、后一片为 1）；EN 与 D 都在下降沿之后变化。Q 初值为 1。',
    hint: 'EN=0 的那些沿，触发器什么也不做，Q 保持原值。',
    lab: {
      rows: [
        { name: 'CLK', cells: [0, 1, 0, 1, 0, 1, 0, 1], fixed: true },
        { name: 'EN', cells: [1, 1, 0, 0, 1, 1, 1, 1], fixed: true },
        { name: 'D', cells: [0, 0, 1, 1, 1, 1, 0, 0], fixed: true },
        { name: 'Q', cells: [0, 0, 0, 0, 0, 0, 0, 0], fixed: false }
      ],
      solution: { Q: [1, 0, 0, 0, 0, 1, 1, 0] },
      note: '逐沿检查 EN：EN=1 才装入 D，EN=0 就保持。'
    },
    explain: '第一个上升沿 EN=1，装入 D=0；第二个上升沿 EN=0，Q 保持 0（此时 D=1 也不理）；第三个上升沿 EN=1，装入 D=1；第四个上升沿 EN=1，装入 D=0。第一个时间片还没有沿，Q 保持初值 1。关键是 EN=0 的沿上触发器“什么都没做”，这正是使能与时钟门控的区别。'
  },
  {
    id: 'q3-046',
    ch: 3,
    sec: 'ch3-reset',
    topic: '同步复位波形',
    diff: 2,
    type: 'wave',
    stem: '画出<b>带同步复位</b>（Reset 高有效）的正沿 D 触发器的输出 Q：Reset=1 的那个上升沿把 Q 清零。CLK 每个周期占 2 个时间片（前一片为 0、后一片为 1）；Reset 与 D 都在下降沿之后变化。Q 初值为 0。',
    hint: '同步复位只改“这个沿装入什么”，不改变“在哪个沿装入”。',
    lab: {
      rows: [
        { name: 'CLK', cells: [0, 1, 0, 1, 0, 1, 0, 1], fixed: true },
        { name: 'Reset', cells: [0, 0, 0, 0, 1, 1, 0, 0], fixed: true },
        { name: 'D', cells: [1, 1, 1, 1, 1, 1, 0, 0], fixed: true },
        { name: 'Q', cells: [0, 0, 0, 0, 0, 0, 0, 0], fixed: false }
      ],
      solution: { Q: [0, 1, 1, 1, 1, 0, 0, 0] },
      note: 'Reset=1 的沿装入 0，Reset=0 的沿装入 D。'
    },
    explain: '前两个上升沿 Reset=0，Q 依次装入 D=1、1；第三个上升沿 Reset=1，尽管 D 为 1，Q 仍被清零，这就是同步复位“复位优先于数据、但只在沿上生效”的表现；第四个上升沿 Reset 已撤销，Q 装入 D=0。若换成异步复位，Reset 变高的那一刻 Q 就会立刻清零，而不等到上升沿。'
  }
);

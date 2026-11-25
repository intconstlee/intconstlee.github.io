window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q2-001',
    ch: 2,
    sec: 'ch2-intro',
    topic: '组合逻辑定义',
    diff: 1,
    type: 'single',
    stem: '下列哪一项是组合逻辑电路的必备特征？',
    options: [
      '输出只由当前输入决定',
      '输出由当前输入和电路过去的状态共同决定',
      '内部一定含有触发器',
      '必须时钟信号才能工作'
    ],
    answer: 0,
    explain: '组合逻辑没有记忆，输出是当前输入的函数。含触发器、依赖时钟或依赖历史状态的都属于时序逻辑（第 3 章）。反馈环是分界线：信号一旦绕回自己的输入，就已经有状态了。'
  },
  {
    id: 'q2-002',
    ch: 2,
    sec: 'ch2-intro',
    topic: '设计流程',
    diff: 1,
    type: 'order',
    stem: '按组合逻辑的系统化设计流程，把下面五步排好。',
    lab: {
      items: ['写规范', '列真值表', '写布尔表达式', '化简', '画门级电路'],
      prompt: '从需求到门电路，拖动排成正确顺序'
    },
    explain: '顺序是规范 → 真值表 → 布尔表达式 → 化简 → 门级电路。没有真值表就无法机械地写出最小项；不化简就画门，会浪费面积和延迟。'
  },
  {
    id: 'q2-003',
    ch: 2,
    sec: 'ch2-intro',
    topic: '设计流程',
    diff: 1,
    type: 'fill',
    stem: '组合逻辑设计流程中，紧接“列真值表”之后的一步是______（写出这一步的名称）。',
    accept: ['布尔表达式', '逻辑表达式', '写布尔表达式', '表达式'],
    placeholder: '填写步骤名称',
    explain: '真值表之后，对每个输出为 1 的行写最小项并相或，得到布尔表达式；再往后才是化简与画门。顺序颠倒，容易在逻辑还没写全时就开始凑电路。'
  },
  {
    id: 'q2-004',
    ch: 2,
    sec: 'ch2-bool-terms',
    topic: '最小项',
    diff: 1,
    type: 'fill',
    stem: '三变量函数的每个最小项含有______个文字（填阿拉伯数字）。',
    accept: ['3', '三'],
    placeholder: '数字',
    explain: '最小项要求每个变量恰好出现一次（原变量或反变量），三变量就是 3 个文字，例如 A′BC。只含两个文字的 AB 只是蕴含项，不是最小项。'
  },
  {
    id: 'q2-005',
    ch: 2,
    sec: 'ch2-bool-terms',
    topic: '术语辨析',
    diff: 2,
    type: 'single',
    stem: '关于乘积项 AB′，下列说法正确的是？',
    options: [
      '它是蕴含项，但不是三变量的最小项',
      '它是三变量的一个最小项',
      '它是三变量的一个最大项',
      '它与 A+B′ 等价'
    ],
    answer: 0,
    explain: 'AB′ 只含两个文字、缺少 C，所以是蕴含项而不是最小项。它展开成最小项是 AB′C′ + AB′C，即 m<sub>4</sub>+m<sub>5</sub>。最大项必须是和项；A+B′ 是另一回事（它等于 (A′B)′），并不等于 AB′。'
  },
  {
    id: 'q2-006',
    ch: 2,
    sec: 'ch2-bool-terms',
    topic: '最小项之和',
    diff: 1,
    type: 'tf',
    stem: '任何 n 变量的布尔函数都可以唯一地写成若干个最小项之和。',
    answer: 1,
    explain: '每个输出为 1 的行对应一个最小项，全部相或即得函数；这些最小项互不重叠，所以表示唯一。写成最简 SOP 时才可能不唯一，最小项之和的写法是唯一的。'
  },
  {
    id: 'q2-007',
    ch: 2,
    sec: 'ch2-sop-pos',
    topic: '写 SOP',
    diff: 2,
    type: 'single',
    stem: '函数 Y=Σm(1,2,4,7)（变量 A、B、C，A 为最高位）的 SOP 是？',
    options: [
      'A′B′C + A′BC′ + AB′C′ + ABC',
      'A′BC + AB′C + ABC′ + ABC',
      'A′B′C′ + A′BC + ABC′ + ABC',
      'A′B′C + A′BC′ + AB′C + ABC′'
    ],
    answer: 0,
    explain: 'm<sub>1</sub>=001 写 A′B′C，m<sub>2</sub>=010 写 A′BC′，m<sub>4</sub>=100 写 AB′C′，m<sub>7</sub>=111 写 ABC。另一选项 A′BC + AB′C + ABC′ + ABC 取的是 3、5、6、7，既不是题设的 1、2、4、7，也不是它的补集 0、3、5、6；其余两项把某几位写反了，代入行号即可发现。这四个最小项两两不相邻，已经是最简。'
  },
  {
    id: 'q2-008',
    ch: 2,
    sec: 'ch2-sop-pos',
    topic: '最小项编号',
    diff: 2,
    type: 'fill',
    stem: '三变量函数 Y=A′BC+AB′C+ABC 用最小项之和记作 Σm(______)。（按升序写编号，用英文逗号分隔）',
    accept: ['3,5,7', '3、5、7', '3 5 7'],
    placeholder: '例如 0,1,2',
    explain: 'A′BC 是 011=m<sub>3</sub>，AB′C 是 101=m<sub>5</sub>，ABC 是 111=m<sub>7</sub>，故 Σm(3,5,7)。把每项里原变量记 1、反变量记 0，读成二进制就是编号。'
  },
  {
    id: 'q2-009',
    ch: 2,
    sec: 'ch2-sop-pos',
    topic: 'SOP 与 POS',
    diff: 2,
    type: 'multi',
    stem: '关于 SOP 与 POS，下列说法正确的有？',
    options: [
      'SOP 是若干最小项相或',
      'POS 是若干最大项相与',
      '同一个函数的 SOP 与 POS 逻辑等价',
      'SOP 一定比 POS 用的门少',
      'POS 中的每个最大项可以不含全部变量'
    ],
    answer: [0, 1, 2],
    explain: 'SOP 对 1 行写最小项再相或，POS 对 0 行写最大项再相与，两者描述同一函数，所以前三项正确。门数取决于具体函数，0 少时 POS 反而更省，所以“SOP 一定门少”不成立；最大项必须包含全部变量，所以“最大项可以不含全部变量”也不对。'
  },
  {
    id: 'q2-010',
    ch: 2,
    sec: 'ch2-sop-pos',
    topic: '写 POS',
    diff: 2,
    type: 'single',
    stem: '某三变量函数在行 0、1、3 上为 0，其余行为 1。用 POS 表示时应取哪些项？',
    options: [
      'M<sub>0</sub>·M<sub>1</sub>·M<sub>3</sub>',
      'M<sub>2</sub>·M<sub>4</sub>·M<sub>5</sub>·M<sub>6</sub>·M<sub>7</sub>',
      'm<sub>0</sub>+m<sub>1</sub>+m<sub>3</sub>',
      'M<sub>0</sub>+M<sub>1</sub>+M<sub>3</sub>'
    ],
    answer: 0,
    explain: 'POS 对每个输出为 0 的行写一个最大项再相与，所以取 0 行的 M<sub>0</sub>、M<sub>1</sub>、M<sub>3</sub>。写成 M<sub>2</sub>·M<sub>4</sub>·… 是误用了输出为 1 的行；M<sub>0</sub>+M<sub>1</sub>+M<sub>3</sub> 把相与写成了相或；m<sub>0</sub>+m<sub>1</sub>+m<sub>3</sub> 则混用了最小项。'
  },
  {
    id: 'q2-011',
    ch: 2,
    sec: 'ch2-sop-pos',
    topic: '最小项编号',
    diff: 2,
    type: 'single',
    stem: '四变量函数（A 为最高位）的最小项 m<sub>13</sub> 对应的输入是？',
    options: [
      'A=1、B=1、C=0、D=1',
      'A=1、B=0、C=1、D=1',
      'A=0、B=1、C=1、D=1',
      'A=1、B=1、C=1、D=0'
    ],
    answer: 0,
    explain: '13=8+4+0+1=1101<sub>2</sub>，按 A、B、C、D 从高到低读得 1、1、0、1。最小项编号就是把该行的四个位当成二进制数的值，反过来也能从编号写出位串。'
  },
  {
    id: 'q2-012',
    ch: 2,
    sec: 'ch2-axioms',
    topic: '对偶式',
    diff: 3,
    type: 'single',
    stem: '表达式 Y=A·B+A′·C 的对偶式是？',
    options: [
      '(A+B)·(A′+C)',
      'A·B+A′·C',
      '(A′+B′)·(A+C)',
      '(A+B)·(A′·C)'
    ],
    answer: 0,
    explain: '对偶只把与、或互换，0、1 互换，变量与反变量本身不动：A·B 变 A+B，A′·C 变 A′+C，中间的或变与，得 (A+B)(A′+C)。选项 (A′+B′)(A+C) 既不是对偶式，也不是反函数：反函数应为 (A′+B′)(A+C′)，它只是把部分变量取了反。'
  },
  {
    id: 'q2-013',
    ch: 2,
    sec: 'ch2-axioms',
    topic: '补公理',
    diff: 1,
    type: 'fill',
    stem: '补公理 A4′ 的或形式是 B + B′ = ______（填 0 或 1）。',
    accept: ['1', '一'],
    placeholder: '0 或 1',
    explain: 'A4 是与形式 B·B′=0，取对偶得或形式 B+B′=1：一个变量与它的补相或恒为 1。这条也是化简里“凑 1”的常用手段。'
  },
  {
    id: 'q2-014',
    ch: 2,
    sec: 'ch2-theorems',
    topic: 'NAND 实现',
    diff: 3,
    type: 'gate',
    stem: '只用 2 输入 NAND 门搭出异或 Y=A⊕B，最多允许 4 个门。',
    lab: {
      inputs: ['A', 'B'],
      outs: ['Y'],
      rows: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]],
      allowed: ['NAND'],
      maxGates: 4,
      expr: 'A ^ B',
      note: '提示：先用 NAND 求 A NAND B，再拿它分别与 A、B 组合'
    },
    explain: '经典 4 NAND 结构：n1=A NAND B；n2=A NAND n1；n3=B NAND n1；Y=n2 NAND n3。展开化简可得 Y=AB′+A′B。三个 NAND 做不到异或，所以上限给 4 个门。'
  },
  {
    id: 'q2-015',
    ch: 2,
    sec: 'ch2-theorems',
    topic: '德摩根',
    diff: 1,
    type: 'single',
    stem: '与 (A+B)′ 等价的是？',
    options: ['A′·B′', 'A+B', 'A·B', 'A′+B′'],
    answer: 0,
    explain: '德摩根：(A+B)′=A′·B′，即“或的非等于非的与”。A′+B′ 把两个否定放错了位置；A+B 则根本没有取反。'
  },
  {
    id: 'q2-016',
    ch: 2,
    sec: 'ch2-theorems',
    topic: '合并律',
    diff: 1,
    type: 'fill',
    stem: '化简 AB + AB′ 的结果是______（填一个小写字母）。',
    accept: ['A', 'a'],
    placeholder: '一个字母',
    explain: 'AB+AB′=A(B+B′)=A·1=A，这是合并律 T9：只差一个变量的两项可以直接并成一项，被消去的就是那个变量。'
  },
  {
    id: 'q2-017',
    ch: 2,
    sec: 'ch2-theorems',
    topic: '代数化简',
    diff: 2,
    type: 'multi',
    stem: '下列化简中正确的有？',
    options: [
      'A + A′B = A + B',
      'AB + A′B = A',
      'AB + A′C + BC = AB + A′C',
      'A(B+C) = AB + AC',
      'A + AB = A·B'
    ],
    answer: [0, 2, 3],
    explain: 'A+A′B=A+AB+A′B=A+B；AB+A′B=B，并不等于 A；BC 是冗余项，所以 AB+A′C+BC=AB+A′C 成立；A(B+C)=AB+AC 是分配律；A+AB=A(1+B)=A，不等于 A·B。'
  },
  {
    id: 'q2-018',
    ch: 2,
    sec: 'ch2-gates',
    topic: '多数表决',
    diff: 2,
    type: 'gate',
    stem: '用 2 输入 AND 门与 OR 门实现三输入多数表决：至少两个输入为 1 时 Y=1。最多 4 个门。',
    lab: {
      inputs: ['A', 'B', 'C'],
      outs: ['Y'],
      rows: [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 1],
             [1, 0, 0, 0], [1, 0, 1, 1], [1, 1, 0, 1], [1, 1, 1, 1]],
      allowed: ['AND', 'OR'],
      maxGates: 4,
      expr: 'A & B | C & (A | B)',
      note: '提示：先算 A·B 与 A+B，再用 C 选择第三条乘积项'
    },
    explain: 'Y=AB+AC+BC=AB+C(A+B)。用 2 输入门实现：G1=A·B，G2=A+B，G3=C·G2，G4=G1+G3，共 4 个门。若写成 AB+AC+BC 直接合并，需要 3 个二输入与门和 2 个二输入或门，共 5 个门，超出限制。'
  },
  {
    id: 'q2-019',
    ch: 2,
    sec: 'ch2-gates',
    topic: '两级逻辑',
    diff: 2,
    type: 'single',
    stem: '把 Y=AB+CD 实现成标准 SOP 两级电路，门数与延迟层数是？',
    options: ['3 个门，2 级', '3 个门，3 级', '4 个门，2 级', '2 个门，2 级'],
    answer: 0,
    explain: '两个与门并行算出 AB、CD，一个或门合并，共 3 个门；输入到输出最多经过“与门→或门”两层，与项数无关。写成 4 个门是多算了一个，写成 2 个门则少算了一个与门。'
  },
  {
    id: 'q2-020',
    ch: 2,
    sec: 'ch2-gates',
    topic: '延迟级数',
    diff: 1,
    type: 'fill',
    stem: '一个 4 输入、6 个最小项的 SOP 电路，输入到输出的最长路径要经过______级门（只填数字，不计输入反相器）。',
    accept: ['2', '两', '二'],
    placeholder: '数字',
    explain: 'SOP 是两级逻辑：第一级与门产生各项，第二级或门合并。项数只增加或门扇入，不增加层数，所以仍是 2 级。'
  },
  {
    id: 'q2-021',
    ch: 2,
    sec: 'ch2-multilevel',
    topic: 'NAND 实现 OR',
    diff: 1,
    type: 'gate',
    stem: '只用 NAND 门实现二输入或 Y=A+B，最多 3 个门。',
    lab: {
      inputs: ['A', 'B'],
      outs: ['Y'],
      rows: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]],
      allowed: ['NAND'],
      maxGates: 3,
      expr: 'A | B',
      note: '提示：把每个输入各自接成反相器'
    },
    explain: 'Y=A+B=((A·A)′·(B·B)′)′：把每个输入各自接成反相器，再用一个 NAND 合并，正好 3 个门。最后一步是德摩根：(A′·B′)′=A+B。'
  },
  {
    id: 'q2-022',
    ch: 2,
    sec: 'ch2-multilevel',
    topic: 'NAND 实现或式',
    diff: 3,
    type: 'gate',
    stem: '只用 NAND 门实现 Y=A′+C，最多 2 个门。',
    lab: {
      inputs: ['A', 'C'],
      outs: ['Y'],
      rows: [[0, 0, 1], [0, 1, 1], [1, 0, 0], [1, 1, 1]],
      allowed: ['NAND'],
      maxGates: 2,
      expr: '~A | C',
      note: '提示：把或式改写成与非式'
    },
    explain: '把或式改写成与非式：A′+C=(A·C′)′。先用一个 NAND 把 C 取反得 C′，再把 A 与 C′ 送进第二个 NAND 即可。这正是德摩根的推气泡：或门换与非门，输入端补圈。'
  },
  {
    id: 'q2-023',
    ch: 2,
    sec: 'ch2-multilevel',
    topic: '推气泡',
    diff: 3,
    type: 'single',
    stem: '把与门输出端的取反圈推到输入端，正确的操作是？',
    options: [
      '换成或门，两条输入都加圈',
      '保持与门，只在一条输入上加圈',
      '换成或门，只在一条输入上加圈',
      '保持与门，两条输入都不加圈'
    ],
    answer: 0,
    explain: '推气泡就是德摩根：(AB)′=A′+B′。输出端一个圈等价于“换成或门、每条输入各加一个圈”。只加一条或忘记换门都会改变函数。'
  },
  {
    id: 'q2-024',
    ch: 2,
    sec: 'ch2-xz',
    topic: '竞争与 X',
    diff: 2,
    type: 'single',
    stem: '一根总线上两个三态缓冲器同时使能，一个输出 0、一个输出 1，此时线上的逻辑值是？',
    options: ['X（非法值）', 'Z（高阻）', '0', '1'],
    answer: 0,
    explain: '两个相反的驱动同时加在一根线上形成竞争，电压落在禁止区，逻辑值不确定，记作 X。Z 是“没有驱动”，正好相反：所有三态门都关闭时才是 Z。'
  },
  {
    id: 'q2-025',
    ch: 2,
    sec: 'ch2-xz',
    topic: '高阻 Z',
    diff: 2,
    type: 'tf',
    stem: '三态门输出 Z 时，等价于输出逻辑 0。',
    answer: 0,
    explain: 'Z 是高阻：驱动源断开，线上电平由其他源或上拉/下拉决定，不是 0。把 Z 当 0 接进普通门会让输入浮空，仿真得到 X，实际芯片可能因中间电平而耗电发热。'
  },
  {
    id: 'q2-026',
    ch: 2,
    sec: 'ch2-kmap',
    topic: '三变量卡诺图',
    diff: 1,
    type: 'kmap',
    stem: '卡诺图变量顺序为 A、B、C（A 为最高位；A 为行，B、C 为列，列按格雷码 00、01、11、10 排列）。函数 Y=Σm(0,1,4,5)，圈出最简与或式的所有组。',
    lab: {
      vars: ['A', 'B', 'C'],
      ones: [0, 1, 4, 5],
      dontcares: [],
      groups: [[0, 1, 4, 5]],
      ask: '本题只需 1 个圈'
    },
    explain: 'm<sub>0</sub>、m<sub>1</sub>、m<sub>4</sub>、m<sub>5</sub> 都满足 B=0（A、C 任意），四格组成一个 2×2 圈，得 B′，即 Y=B′。圈里 A 与 C 都在变化，被消去，只剩 B=0 这个共同点。'
  }
);

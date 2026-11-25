window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q5-001',
    ch: 5,
    sec: 'ch5-intro',
    topic: '模块化设计',
    diff: 1,
    type: 'single',
    stem: '把加法器、ALU、寄存器文件做成可复用的标准模块，最直接的收益是什么？',
    options: [
      '减少重复设计与重复验证',
      '让组合逻辑自动变成时序逻辑',
      '消除电路中所有的传播延迟',
      '使存储器不再需要地址译码器'
    ],
    answer: 0,
    explain: '模块化的核心是“一次设计、验证，多次复用”。上层设计者只需按端口和时序契约连接模块，不必每次重画门级电路。它不会改变逻辑类型，也不会消除延迟，存储器仍然需要译码器。'
  },
  {
    id: 'q5-002',
    ch: 5,
    sec: 'ch5-intro',
    topic: '接口契约',
    diff: 2,
    type: 'tf',
    stem: '模块化设计意味着只要功能相同，端口定义和读写时序就可以随便替换。',
    answer: 0,
    explain: '错误。复用模块的前提是接口契约一致：端口位宽、方向、编码、有效电平、复位方式和读写时序都必须匹配。功能相同但时序不同的模块直接替换，可能让处理器读到旧数据或写错寄存器。'
  },
  {
    id: 'q5-003',
    ch: 5,
    sec: 'ch5-adder-basics',
    topic: '全加器和',
    diff: 1,
    type: 'gate',
    stem: '用异或门搭出全加器的本位和 S：三个输入 A、B、C 中 1 的个数为奇数时 S=1。',
    hint: '两个异或门串联即可：先算 A⊕B，再与 C 异或。',
    lab: {
      inputs: ['A', 'B', 'C'],
      outs: ['S'],
      rows: [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 1, 1, 1]
      ],
      allowed: ['XOR'],
      maxGates: 2,
      expr: 'A ^ B ^ C',
      note: '异或满足结合律，门的串联顺序不影响结果。'
    },
    explain: '全加器的和等于三个输入的异或：S=A⊕B⊕C。输入组合 001、010、100、111（即 1、2、4、7）中都有奇数个 1，因此输出为 1。两个 XOR 门即可实现。'
  },
  {
    id: 'q5-004',
    ch: 5,
    sec: 'ch5-adder-basics',
    topic: '全加器进位',
    diff: 2,
    type: 'gate',
    stem: '搭出全加器的进位 C<sub>out</sub>：A、B、C 中至少两个为 1 时输出 1。',
    hint: 'C<sub>out</sub>=AB+(A⊕B)C，用两个与门、一个异或门、一个或门。',
    lab: {
      inputs: ['A', 'B', 'C'],
      outs: ['Cout'],
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
      allowed: ['AND', 'OR', 'XOR'],
      maxGates: 4,
      expr: '(A & B) | (C & (A ^ B))',
      note: 'AB 覆盖 A、B 同时为 1；(A⊕B)C 覆盖 C 与 A、B 中恰好一个为 1。'
    },
    explain: '进位是三个输入的多数函数。AB 处理 A=B=1；当 A、B 不同时，A⊕B=1，此时只要 C=1 也会产生进位，所以再加 (A⊕B)C。两者相或即为 C<sub>out</sub>=AB+(A⊕B)C，与 AB+AC+BC 等价。门数：1 个 XOR、2 个 AND、1 个 OR，共 4 个。'
  },
  {
    id: 'q5-005',
    ch: 5,
    sec: 'ch5-adder-basics',
    topic: '半加器与全加器',
    diff: 1,
    type: 'single',
    stem: '半加器与全加器的主要区别是什么？',
    options: [
      '全加器多一个进位输入，能接收低位进位',
      '半加器只能做减法，不能做加法',
      '全加器没有进位输出',
      '半加器必须接时钟才能相加'
    ],
    answer: 0,
    explain: '半加器只有 A、B 两个输入，输出和 S=A⊕B 与进位 AB；全加器增加 C<sub>in</sub>，可以接收低位送来的进位，因此能级联成多位加法器。两者都是组合逻辑，不需要时钟。'
  },
  {
    id: 'q5-006',
    ch: 5,
    sec: 'ch5-carry',
    topic: '多位加法器',
    diff: 3,
    type: 'hdl',
    stem: '用组合逻辑实现 4 位加法器，y 为 5 位，包含最高位进位。',
    hint: '把两个 4 位数零扩展成 5 位再相加，或者用拼接把进位保留下来。',
    lab: {
      inputs: [
        { name: 'a', width: 4 },
        { name: 'b', width: 4 },
        { name: 'cin', width: 1 }
      ],
      outputs: [{ name: 'y', width: 5 }],
      tests: [
        { in: { a: 0, b: 0, cin: 0 }, out: { y: 0 } },
        { in: { a: 15, b: 0, cin: 1 }, out: { y: 16 } },
        { in: { a: 10, b: 5, cin: 0 }, out: { y: 15 } },
        { in: { a: 15, b: 15, cin: 1 }, out: { y: 31 } },
        { in: { a: 8, b: 7, cin: 1 }, out: { y: 16 } },
        { in: { a: 1, b: 15, cin: 0 }, out: { y: 16 } }
      ],
      template: 'module add4(input logic [3:0] a, b,\n            input logic cin,\n            output logic [4:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module add4(input logic [3:0] a, b,\n            input logic cin,\n            output logic [4:0] y);\n  assign y = {1\'b0, a} + {1\'b0, b} + cin;\nendmodule',
      moduleName: 'add4'
    },
    explain: '两个 4 位数相加可能产生 5 位结果，所以 y 必须声明为 [4:0]。先把 a、b 分别补一个 0 扩展成 5 位，再连同 cin 相加，进位就不会被截断：y={1\'b0,a}+{1\'b0,b}+cin。测试中 15+15+1=31，正好需要 5 位表示。'
  },
  {
    id: 'q5-007',
    ch: 5,
    sec: 'ch5-carry',
    topic: '行波进位关键路径',
    diff: 1,
    type: 'single',
    stem: '16 位行波进位加法器在最坏情况下，结果必须等待什么信号稳定？',
    options: [
      '进位从最低位逐级传到最高位',
      '所有输入同时反向跳变',
      '时钟从低电平变成高电平',
      '存储器把操作数读出'
    ],
    answer: 0,
    explain: '行波进位把低位的 C<sub>out</sub> 接到高位的 C<sub>in</sub>，高位和必须等低位进位。最坏情况下进位从第 0 位传到最高位，关键路径约为 N×t<sub>FA</sub>，所以位数越多越慢。'
  },
  {
    id: 'q5-008',
    ch: 5,
    sec: 'ch5-carry',
    topic: '行波进位延迟',
    diff: 2,
    type: 'fill',
    stem: '若每个全加器的进位延迟为 0.25 ns，16 位行波进位加法器最坏进位延迟是多少 ns？只填数字。',
    placeholder: '例如 2.5',
    unit: 'ns',
    accept: ['4', '4.0', '4.00', '4ns'],
    explain: '进位要依次穿过 16 级全加器，最坏延迟为 16×0.25 ns=4.0 ns。这里把每级从 C<sub>in</sub> 到 C<sub>out</sub> 的延迟都近似为 0.25 ns；实际电路还要加上输入到第一级和末级到输出的延迟。'
  },
  {
    id: 'q5-009',
    ch: 5,
    sec: 'ch5-carry',
    topic: '快速加法器',
    diff: 3,
    type: 'multi',
    stem: '关于进位前瞻（CLA）与前缀加法器，下列说法正确的有哪些？',
    options: [
      'C<sub>i+1</sub>=G<sub>i</sub>+P<sub>i</sub>C<sub>i</sub>',
      '进位前瞻通过并行计算进位，减少逐级等待',
      '前缀加法器用 (G,P) 组合做树形合并',
      'CLA 的延迟仍严格与位数成正比，和行波进位完全一样',
      '任何加法器都不需要处理进位'
    ],
    answer: [0, 1, 2],
    explain: 'A、B、C 正确：G 表示本位主动产生进位，P 表示本位把低位进位继续传上去；把进位展开后可并行计算；前缀结构把相邻区间的 (G,P) 合并成一棵前缀树。D 错，CLA 的延迟可降到 O(log N) 量级，不再严格线性。E 显然错误，多位加法必须处理进位，只是处理方式不同。'
  },
  {
    id: 'q5-010',
    ch: 5,
    sec: 'ch5-subtract',
    topic: '补码减法',
    diff: 1,
    type: 'single',
    stem: '用加法器计算 8 位 A−B，正确做法是下列哪一项？',
    options: [
      'A 加 B 的按位取反，再令 C<sub>in</sub>=1',
      'A 加 B，再令 C<sub>in</sub>=1',
      'A 加 B，C<sub>in</sub> 保持 0',
      '把 A 和 B 都取反，再令 C<sub>in</sub>=0'
    ],
    answer: 0,
    explain: '补码中 −B 等于“B 按位取反加 1”，所以 A−B=A+B&#773;+1。把 B 的每一位与 Sub=1 异或实现取反，并把 Sub 接到加法器 C<sub>in</sub>，就得到 A+B&#773;+1。只把 C<sub>in</sub> 置 1 而不取反，算的是 A+B+1。'
  },
  {
    id: 'q5-011',
    ch: 5,
    sec: 'ch5-subtract',
    topic: '补码减法计算',
    diff: 2,
    type: 'fill',
    stem: '用 8 位补码计算 0x5A−0x27，结果用 0x 前缀的十六进制表示。',
    placeholder: '0x00',
    accept: ['0x33', '33'],
    explain: '0x5A=90，0x27=39。B 取反得 0xD8，加 1 得 0xD9；0x5A+0xD9=0x133，保留低 8 位为 0x33。最高位进位 C<sub>out</sub>=1，说明无符号减法没有借位；数学结果 90−39=51=0x33，落在 8 位补码范围内，也没有有符号溢出。'
  },
  {
    id: 'q5-012',
    ch: 5,
    sec: 'ch5-subtract',
    topic: '有符号溢出',
    diff: 3,
    type: 'single',
    stem: '8 位补码 0x70+0x70 的 8 位结果与有符号溢出标志 V 分别是？',
    options: [
      '0xE0，V=1',
      '0xE0，V=0',
      '0x60，V=1',
      '0x60，V=0'
    ],
    answer: 0,
    explain: '0x70=0111 0000<sub>2</sub>=112。112+112=224，超出 8 位补码范围 −128 到 127；低 8 位是 1110 0000<sub>2</sub>=0xE0，按补码解释为 −32。进入符号位的进位为 1，向外的进位为 0，V=1⊕0=1。0xE0 只是截断后的 8 位位模式，并不等于数学结果 224。'
  },
  {
    id: 'q5-013',
    ch: 5,
    sec: 'ch5-subtract',
    topic: '无符号借位',
    diff: 2,
    type: 'tf',
    stem: '用 A+B&#773;+1 实现无符号减法时，若最高位进位 C<sub>out</sub>=1，说明 A≥B，没有借位。',
    answer: 1,
    explain: '正确。无符号 A−B 的借位等于 C<sub>out</sub> 取反：C<sub>out</sub>=1 表示加法结果达到 2<sup>N</sup>，即 A+（2<sup>N</sup>−B）≥2<sup>N</sup>，等价于 A≥B，不需要借位；C<sub>out</sub>=0 才表示 A&lt;B，有借位。'
  },
  {
    id: 'q5-014',
    ch: 5,
    sec: 'ch5-comparator',
    topic: '相等比较',
    diff: 2,
    type: 'single',
    stem: '判断两个 4 位数 A、B 是否相等，最直接的硬件做法是？',
    options: [
      '对 A⊕B 的 4 位做或非，全 0 时输出 1',
      '把 A 与 B 相与，结果为 0 时输出 1',
      '只看 A−B 的最高位',
      '只看 A 和 B 的最低位是否相同'
    ],
    answer: 0,
    explain: 'A=B 当且仅当每一位都相同，即 A⊕B 的每一位都为 0。把 4 位异或结果或起来，再取反（或非），只有全 0 时输出 1。相与无法判断相等；只看符号位或最低位都可能把不同数误判为相等。'
  },
  {
    id: 'q5-015',
    ch: 5,
    sec: 'ch5-comparator',
    topic: 'slt 计算',
    diff: 2,
    type: 'fill',
    stem: '按有符号补码比较，A=0xFFFFFFFB、B=0x00000003 时 slt 的结果是 0 还是 1？',
    placeholder: '0 或 1',
    accept: ['1', '0x1'],
    explain: '0xFFFFFFFB 的最高位为 1，按 32 位补码解释是 −5；B=3。因为 −5&lt;3，slt 输出 1。若误按无符号解释，A=4294967291 远大于 3，sltu 才会输出 0。'
  },
  {
    id: 'q5-016',
    ch: 5,
    sec: 'ch5-comparator',
    topic: '有符号与无符号比较',
    diff: 3,
    type: 'multi',
    stem: '关于比较器和 slt/sltu，下列说法正确的有哪些？',
    options: [
      '相等比较可把每一位的 XNOR 结果相与',
      '有符号 slt 可以直接用 A−B 的符号位判断，无需考虑溢出',
      '无符号 sltu 可用减法借位：有借位表示 A&lt;B',
      '比较两个数的大小只需看最低位',
      '无符号数 0xFFFFFFFF 大于 0x00000001'
    ],
    answer: [0, 2, 4],
    explain: 'A 正确：每一位 XNOR 为 1 表示该位相等，全部相与即相等。C 正确：无符号减法有借位说明不够减。E 正确：0xFFFFFFFF 按无符号是 4294967295。B 错，A−B 溢出时符号位会给出相反结论，必须结合溢出标志或先扩展位宽。D 错，最低位相同不代表整个数相同，大小更不由最低位决定。'
  },
  {
    id: 'q5-017',
    ch: 5,
    sec: 'ch5-alu',
    topic: 'ALU 片段',
    diff: 2,
    type: 'hdl',
    stem: '实现 4 位 ALU：op=00 做与、01 做或、10 做加、11 做减，结果截断为 4 位。',
    hint: '用 case 或嵌套三目选择四种运算；减法可直接写 a-b，综合工具会处理成补码加法。',
    lab: {
      inputs: [
        { name: 'a', width: 4 },
        { name: 'b', width: 4 },
        { name: 'op', width: 2 }
      ],
      outputs: [{ name: 'y', width: 4 }],
      tests: [
        { in: { a: 12, b: 10, op: 0 }, out: { y: 8 } },
        { in: { a: 9, b: 6, op: 1 }, out: { y: 15 } },
        { in: { a: 3, b: 5, op: 2 }, out: { y: 8 } },
        { in: { a: 3, b: 5, op: 3 }, out: { y: 14 } },
        { in: { a: 15, b: 1, op: 2 }, out: { y: 0 } },
        { in: { a: 8, b: 8, op: 3 }, out: { y: 0 } },
        { in: { a: 0, b: 15, op: 0 }, out: { y: 0 } },
        { in: { a: 7, b: 8, op: 1 }, out: { y: 15 } }
      ],
      template: 'module alu4(input logic [3:0] a, b,\n            input logic [1:0] op,\n            output logic [3:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module alu4(input logic [3:0] a, b,\n            input logic [1:0] op,\n            output logic [3:0] y);\n  always_comb begin\n    case (op)\n      2\'b00: y = a & b;\n      2\'b01: y = a | b;\n      2\'b10: y = a + b;\n      2\'b11: y = a - b;\n    endcase\n  end\nendmodule',
      moduleName: 'alu4'
    },
    explain: '四种操作按 op 选择。加法和减法都只保留低 4 位：15+1 截断为 0，3−5 得到 −2 的 4 位补码 1110<sub>2</sub>=14。这段 ALU 没有单独的 Zero/Overflow 输出，重点是组合选择和多路结果。'
  },
  {
    id: 'q5-018',
    ch: 5,
    sec: 'ch5-alu',
    topic: 'ALU 结果位域',
    diff: 3,
    type: 'fields',
    stem: '8 位 ALU 执行 0x05−0x07 得到 −2。把结果符号扩展到 32 位后，按字节拆分四个字段。',
    lab: {
      kind: 'bits',
      instruction: '8 位 ALU：0x05−0x07，符号扩展至 32 位',
      fields: [
        { name: '结果[31:24]', width: 8, value: '11111111', hint: '符号扩展补 1' },
        { name: '结果[23:16]', width: 8, value: '11111111', hint: '符号扩展补 1' },
        { name: '结果[15:8]', width: 8, value: '11111111', hint: '符号扩展补 1' },
        { name: '结果[7:0]', width: 8, value: '11111110', hint: '低 8 位是 0xFE' }
      ],
      expected: '0xFFFFFFFE'
    },
    explain: '5−7=−2，8 位补码结果是 1111 1110<sub>2</sub>=0xFE。符号扩展保留符号位并把它复制到高位，所以 32 位结果为 1111…1111 1111 1110<sub>2</sub>=0xFFFFFFFE。四个字节从高到低都是 0xFF、0xFF、0xFF、0xFE；若误用零扩展会得到 0x000000FE，数值就变成 +254。'
  },
  {
    id: 'q5-019',
    ch: 5,
    sec: 'ch5-alu',
    topic: 'ALU 减法控制',
    diff: 1,
    type: 'single',
    stem: 'MIPS ALU 的 ALUControl=110 表示 sub，此时 ALU 内部对 B 和 C<sub>in</sub> 做什么？',
    options: [
      '把 B 逐位取反，并令 C<sub>in</sub>=1',
      '把 B 逐位取反，并令 C<sub>in</sub>=0',
      'B 保持不变，并令 C<sub>in</sub>=1',
      '把 B 清零，并令 C<sub>in</sub>=0'
    ],
    answer: 0,
    explain: '减法用补码实现：A−B=A+B&#773;+1。因此 B 先逐位取反，再让加法器 C<sub>in</sub>=1。只取反不加 1 得到的是 A−B−1；B 不变则根本没有做减法。'
  },
  {
    id: 'q5-020',
    ch: 5,
    sec: 'ch5-alu',
    topic: 'Zero 与 Overflow',
    diff: 3,
    type: 'single',
    stem: '一次 8 位 ALU 加法后 Zero=1 且 Overflow=1，这种情况可能吗？',
    options: [
      '可能，例如 0x80+0x80 得到 0x00',
      '不可能，溢出时结果一定非零',
      '可能，但只可能发生在无符号加法',
      '不可能，Zero 会屏蔽 Overflow'
    ],
    answer: 0,
    explain: '0x80 按补码是 −128，−128+(−128)=−256，超出 8 位补码范围；低 8 位结果为 0x00，所以 Zero=1。符号位 1+1 产生向外的进位 1，而进入符号位的进位是 0，因此 V=1⊕0=1。Zero 只看结果是否全 0，Overflow 看符号位进位关系，两者相互独立，可以同时为 1。'
  },
  {
    id: 'q5-021',
    ch: 5,
    sec: 'ch5-alu',
    topic: 'slt 与 sltu',
    diff: 2,
    type: 'fill',
    stem: '8 位 ALU 做有符号 slt，A=0x7F、B=0xFF，结果为 0 或 1？',
    placeholder: '0 或 1',
    accept: ['0', '0x0'],
    explain: '0x7F=127，0xFF 按 8 位补码是 −1。127&lt;−1 不成立，所以 slt=0。注意 127−(−1)=128，8 位结果 0x80 发生溢出：符号位为 1，V=1，符号位与 V 异或后为 0，才是正确的比较结果。若只看原始符号位会误判为 1；若误把 0xFF 当成无符号 255，也会错答 1，那对应的是 sltu。'
  },
  {
    id: 'q5-022',
    ch: 5,
    sec: 'ch5-shifter',
    topic: '2 选 1 多路选择器',
    diff: 2,
    type: 'gate',
    stem: '用门搭出 2 选 1 多路选择器：S=0 输出 A，S=1 输出 B。',
    hint: 'Y=(A 与 ¬S) 或 (B 与 S)。',
    lab: {
      inputs: ['S', 'A', 'B'],
      outs: ['Y'],
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
      allowed: ['NOT', 'AND', 'OR'],
      maxGates: 4,
      expr: '(A & ~S) | (B & S)',
      note: 'S 同时控制两个与门：一个用 S 选通，另一个用 ¬S 选通。'
    },
    explain: 'S=0 时，A&amp;¬S=A，B&amp;S=0，输出 A；S=1 时，A&amp;¬S=0，B&amp;S=B，输出 B。实现需要 1 个 NOT、2 个 AND、1 个 OR，共 4 个门。这个结构正是桶形移位器每一级的基本单元。'
  },
  {
    id: 'q5-023',
    ch: 5,
    sec: 'ch5-shifter',
    topic: '算术右移',
    diff: 1,
    type: 'single',
    stem: '8 位补码 0x80 算术右移 1 位，结果是？',
    options: ['0xC0', '0x40', '0x00', '0xBF'],
    answer: 0,
    explain: '0x80=1000 0000<sub>2</sub>，按补码是 −128。算术右移复制符号位：最高位补 1，得到 1100 0000<sub>2</sub>=0xC0，即 −64。逻辑右移才会补 0 得到 0x40。'
  },
  {
    id: 'q5-024',
    ch: 5,
    sec: 'ch5-shifter',
    topic: '桶形移位器级数',
    diff: 1,
    type: 'fill',
    stem: '32 位桶形移位器最多需要几级 2:1 多路选择器？填数字。',
    placeholder: '例如 4',
    unit: '级',
    accept: ['5', '五', '5级'],
    explain: '每一级根据移位量的一位决定移 2<sup>k</sup> 位或不动：1、2、4、8、16，共 log<sub>2</sub>32=5 级，就能组合出 0 到 31 位的任意移位。'
  }
]);

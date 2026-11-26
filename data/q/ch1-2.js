window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q1-024',
    ch: 1,
    sec: 'ch1-twos',
    topic: '补码编码',
    diff: 2,
    type: 'single',
    stem: '−20 的 8 位补码是？',
    options: [
      '11101100',
      '11101011',
      '11110100',
      '00010100'
    ],
    answer: 0,
    explain: '20 = 00010100，取反得 11101011，加 1 得 11101100（0xEC）。按补码读：236 − 256 = −20。11101011 是只取反没加 1（反码）；00010100 是 +20 本身；11110100 是 −12 的补码（0xF4），说明取反加一时算错了位。'
  },
  {
    id: 'q1-025',
    ch: 1,
    sec: 'ch1-twos',
    topic: '补码加法与溢出',
    diff: 3,
    type: 'single',
    stem: '在 4 位补码下计算 0101 + 0100，结果与溢出情况是？',
    options: [
      '1001，溢出',
      '1001，不溢出',
      '0001，溢出',
      '0101，不溢出'
    ],
    answer: 0,
    explain: '位串相加得 1001；但 5 + 4 = 9，超出 4 位补码范围 −8 ~ 7，所以溢出。判断方法：两个正数相加得到负数（符号位为 1），符号出错即溢出；也可以算"最高位进位 0 异或次高位进位 1 = 1"。1001 按补码读是 −7，正是 9 − 16 的结果。'
  },
  {
    id: 'q1-026',
    ch: 1,
    sec: 'ch1-twos',
    topic: '符号扩展',
    diff: 3,
    type: 'fill',
    stem: '把 8 位补码 11010110<sub>2</sub> 符号扩展成 16 位，结果是 ______（写满 16 位二进制）。',
    placeholder: '写 16 个 0 或 1',
    accept: ['1111111111010110'],
    explain: '最高位是 1（值为 −42），符号扩展要把这一位复制到所有新增高位：高 8 位补 11111111，得 1111111111010110。若误用零扩展会得到 0000000011010110 = +214，值完全变了。验算：16 位补码 1111111111010110 按"无符号 65494 − 65536"读为 −42，与原值一致。'
  },
  {
    id: 'q1-027',
    ch: 1,
    sec: 'ch1-twos',
    topic: '补码的不对称性',
    diff: 2,
    type: 'tf',
    stem: '8 位补码中，10000000 取反加一后仍然是 10000000，所以 −128 的相反数仍是 −128。',
    answer: 1,
    explain: '正确。取反得 01111111，加 1 又回到 10000000。原因是 +128 超出 8 位补码范围 −128 ~ 127，无法表示，这是补码的不对称性：负数比正数多一个。编程里对最小负数取负会溢出，正是同一个现象。'
  },
  {
    id: 'q1-028',
    ch: 1,
    sec: 'ch1-twos',
    topic: '补码位串',
    diff: 2,
    type: 'bin',
    stem: '在同一块 8 位开关面板上，让补码解释的结果等于 −37。',
    hint: '先写 +37 的二进制，再取反加一。',
    lab: { bits: 8, signed: true, value: -37, showHex: true },
    explain: '37 = 00100101，取反得 11011010，加 1 得 11011011（0xDB）。按补码读：219 − 256 = −37。核对的另一个办法是分半字节：高 4 位 1101 = 13、低 4 位 1011 = 11，13×16 + 11 = 219。'
  },
  {
    id: 'q1-029',
    ch: 1,
    sec: 'ch1-twos',
    topic: '16 位补码',
    diff: 3,
    type: 'bin',
    stem: '把 −300 写成 16 位补码，并拨到 16 位开关面板上。',
    hint: '先写出 +300 的十六进制（0x012C），再按位取反加一；注意 −300 超出 8 位补码范围，要在 16 位上完成取负。',
    lab: { bits: 16, signed: true, value: -300, showHex: true },
    explain: '300 = 0x012C = 0000 0001 0010 1100，取反得 0xFED3，加 1 得 0xFED4 = 1111 1110 1101 0100。验算：0xFED4 = 65236，65236 − 65536 = −300。若只保留低 8 位 0xD4，就丢失了信息。再做符号扩展得到 0xFFD4，即 −44，无法恢复 −300。'
  },
  {
    id: 'q1-030',
    ch: 1,
    sec: 'ch1-gates',
    topic: '门的功能',
    diff: 1,
    type: 'single',
    stem: '哪个门在输入全为 1 时输出 0，其余输入组合都输出 1？',
    options: [
      'NAND',
      'AND',
      'NOR',
      'XNOR'
    ],
    answer: 0,
    explain: 'NAND 是"先与后非"：只有 A = B = 1 时 A·B = 1、取反为 0，其余组合与为 0、取反为 1，口诀"有 0 出 1"。AND 全 1 出 1；NOR 只在全 0 时出 1；XNOR 在输入相同时出 1，全 1 时它也输出 1。'
  },
  {
    id: 'q1-031',
    ch: 1,
    sec: 'ch1-gates',
    topic: '由真值表识别门',
    diff: 2,
    type: 'fill',
    stem: '某二输入门的真值表是：两输入相同时输出 1，不同时输出 0。这个门叫 ______（写英文缩写或中文名）。',
    placeholder: '例如 XOR 或 异或',
    accept: ['XNOR', '同或', '同或门', 'XNOR门'],
    explain: 'XOR 是"不同出 1"，取反后就是"相同出 1"，即 XNOR（同或）：Y = ~(A ⊕ B)。它等价于一位相等比较器：A XNOR B = 1 当且仅当 A = B。MIPS 的 beq 指令判断两个操作数是否相等，就用到这个性质。'
  },
  {
    id: 'q1-032',
    ch: 1,
    sec: 'ch1-gates',
    topic: '通用门与多输入门',
    diff: 3,
    type: 'multi',
    stem: '判断下列关于逻辑门的说法，选出全部正确的项：',
    options: [
      'NAND 与 NOR 都是通用门，一种就能实现任何逻辑函数',
      '三输入与门的布尔式可以写成 A·B·C',
      '把两个二输入 NAND 串联起来，等价于一个三输入 NAND',
      '多输入 XOR 输出 1 表示输入中 1 的个数为奇数',
      '缓冲器会改变逻辑值，所以能当非门用'
    ],
    answer: [0, 1, 3],
    explain: 'A 对：NAND、NOR 的通用性是 CMOS 实现的基础。B 对：与门可扩展到任意输入。C 错：NAND(NAND(A,B),C) 在 A=B=C=1 时等于 NAND(0,1) = 1，而三输入 NAND 应为 0，两者真值表不同。D 对：多输入 XOR 就是奇偶校验。E 错：缓冲器 Y = A，值不变，只增强驱动能力。'
  },
  {
    id: 'q1-033',
    ch: 1,
    sec: 'ch1-gates',
    topic: '搭电路（与或）',
    diff: 1,
    type: 'gate',
    stem: '用至多 3 个门搭出 Y = (A·B) + C，使真值表完全一致。',
    hint: '两个门就够：一个与门求 A·B，一个或门把结果与 C 合并。',
    lab: {
      inputs: ['A', 'B', 'C'],
      outs: ['Y'],
      rows: [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 1, 1]
      ],
      allowed: ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'],
      maxGates: 3,
      expr: '(A & B) | C',
      note: '先算 A·B，再与 C 相或'
    },
    explain: '参考解 2 个门：AND(A,B) 得到 A·B，再 OR 上 C，表达式 (A &amp; B) | C。真值表 8 行里只有 000、010、100 三行为 0（A·B = 0 且 C = 0），其余 5 行为 1。注意 A=B=1、C=0 时 Y 仍为 1：与项的 1 已经足以决定输出，或门不再起限制作用。'
  },
  {
    id: 'q1-034',
    ch: 1,
    sec: 'ch1-gates',
    topic: '只用 NAND 搭异或',
    diff: 3,
    type: 'gate',
    stem: '只允许使用 NAND 门（至多 4 个），搭出 Y = A ⊕ B。',
    hint: '经典接法：n1 = NAND(A,B)，n2 = NAND(A,n1)，n3 = NAND(B,n1)，Y = NAND(n2,n3)。',
    lab: {
      inputs: ['A', 'B'],
      outs: ['Y'],
      rows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
      ],
      allowed: ['NAND'],
      maxGates: 4,
      expr: '~(~(A & ~(A & B)) & ~(B & ~(A & B)))',
      note: '四个 NAND：先用一个求出 A·B 的反，再分别与 A、B 组合，最后合并'
    },
    explain: '四个 NAND 构成异或：n1 = ~(A·B)；n2 = ~(A·n1) = ~A + B；n3 = ~(B·n1) = ~B + A；Y = ~(n2·n3) = ~((~A+B)·(~B+A)) = A⊕B。真值表 00→0、01→1、10→1、11→0。只用二输入 NAND 时，异或最省就是 4 个门，少于 4 个无法凑出这种"相异为 1"的函数。'
  },
  {
    id: 'q1-035',
    ch: 1,
    sec: 'ch1-levels',
    topic: '噪声容限计算',
    diff: 2,
    type: 'single',
    stem: '某反相器 V<sub>IL</sub> = 1.35 V、V<sub>OL</sub> = 0.33 V、V<sub>IH</sub> = 3.15 V、V<sub>OH</sub> = 3.84 V。高电平噪声容限 NM<sub>H</sub> 是？',
    options: [
      '0.69 V',
      '1.02 V',
      '0.51 V',
      '2.49 V'
    ],
    answer: 0,
    explain: 'NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub> = 3.84 − 3.15 = 0.69 V。1.02 V 是低电平噪声容限 NM<sub>L</sub> = 1.35 − 0.33；2.49 V 来自把 V<sub>OH</sub> 减 V<sub>IL</sub>（3.84 − 1.35），0.51 V 则来自参数错位相减。一个门实际能承受的噪声取 NM<sub>L</sub> 与 NM<sub>H</sub> 中较小的那个，本例是 0.69 V。'
  },
  {
    id: 'q1-036',
    ch: 1,
    sec: 'ch1-levels',
    topic: '噪声容限计算',
    diff: 2,
    type: 'fill',
    stem: '某门 V<sub>IH</sub> = 3.0 V、V<sub>OH</sub> = 3.6 V，则 NM<sub>H</sub> = ______ V。',
    placeholder: '填小数',
    accept: ['0.6', '0.60', '0.6V'],
    explain: 'NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub> = 3.6 − 3.0 = 0.6 V。它的含义是：输出高电平时，即使叠加 0.6 V 的负向噪声，接收端仍能把它认成 HIGH；噪声超过这个值就可能误判为 0。同理 NM<sub>L</sub> 管的是输出低电平时向上的噪声。'
  },
  {
    id: 'q1-037',
    ch: 1,
    sec: 'ch1-levels',
    topic: '静态约束',
    diff: 2,
    type: 'single',
    stem: '静态约束（static discipline）要求驱动源与接收端满足什么关系？',
    options: [
      'V<sub>OL</sub> &lt; V<sub>IL</sub> 且 V<sub>OH</sub> &gt; V<sub>IH</sub>',
      'V<sub>OL</sub> &gt; V<sub>IL</sub> 且 V<sub>OH</sub> &lt; V<sub>IH</sub>',
      '只要 V<sub>OL</sub> &lt; V<sub>OH</sub> 且 V<sub>IL</sub> &lt; V<sub>IH</sub> 就够',
      '只要 V<sub>OH</sub> 等于 V<sub>DD</sub> 就够'
    ],
    answer: 0,
    explain: '静态约束要求：最坏的低电平输出必须低于接收端认 LOW 的门限（V<sub>OL</sub> &lt; V<sub>IL</sub>），最坏的高电平输出必须高于认 HIGH 的门限（V<sub>OH</sub> &gt; V<sub>IH</sub>）。这样任意级联都留有余量，噪声容限为正。C 的两条不等式虽然成立，但不足以保证级联可靠；D 只约束了输出上限，与接收端门限无关。'
  },
  {
    id: 'q1-038',
    ch: 1,
    sec: 'ch1-cmos',
    topic: 'CMOS 非门',
    diff: 2,
    type: 'single',
    stem: 'CMOS 非门输入 A = 0 时，内部晶体管的状态与输出是？',
    options: [
      'pMOS 导通、nMOS 截止，Y 被上拉到 1',
      'pMOS 截止、nMOS 导通，Y 被下拉到 0',
      '两个晶体管都导通，Y 约为 V<sub>DD</sub>/2',
      '两个晶体管都截止，Y 浮空'
    ],
    answer: 0,
    explain: '输入 0 时 pMOS 栅极为低电平、导通，把 Y 接到 V<sub>DD</sub>；nMOS 栅极为 0、截止。输入 1 时正好相反。由于两个管子总有一个截止，稳态下 V<sub>DD</sub> 到 GND 没有直流通路，静态功耗极低，输出也是满摆幅。'
  },
  {
    id: 'q1-039',
    ch: 1,
    sec: 'ch1-cmos',
    topic: 'nMOS 传高电平',
    diff: 2,
    type: 'fill',
    stem: 'nMOS 传高电平时，输出最高只能达到 V<sub>DD</sub> 减去一个 ______（填符号或中文名）。',
    placeholder: '例如 Vt 或 阈值电压',
    accept: ['Vt', 'VT', '阈值电压', '阈值'],
    explain: '栅极电压最高为 V<sub>DD</sub>，要维持沟道必须 V<sub>GS</sub> &gt; V<sub>t</sub>，所以源端最多升到 V<sub>DD</sub> − V<sub>t</sub> 就不再上升，输出高电平"缺一块"。这就是 CMOS 门只用 nMOS 做下拉、pMOS 做上拉的原因；要传完整摆幅就用 nMOS 与 pMOS 并联的传输门。'
  },
  {
    id: 'q1-040',
    ch: 1,
    sec: 'ch1-cmos',
    topic: 'CMOS 门结构',
    diff: 2,
    type: 'multi',
    stem: '下面哪些说法符合 CMOS 门的工作原理？',
    options: [
      '上拉网络只用 pMOS，下拉网络只用 nMOS',
      'PDN 中串联的晶体管，在 PUN 中对应并联',
      'NAND2 的 PDN 是 A、B 两个 nMOS 串联',
      '类 nMOS 用常通 pMOS 代替 PUN，静态功耗很低',
      'NOR 通常比 NAND 快，因为上拉 pMOS 迁移率高'
    ],
    answer: [0, 1, 2],
    explain: 'A、B、C 都是 CMOS 门的基本结构，其中"对偶"关系（PDN 串联对应 PUN 并联）是读电路图的关键。D 错：常通 pMOS 使输出为 0 时 V<sub>DD</sub> 到 GND 始终有直流通路，静态功耗反而很大，这正是类 nMOS 逻辑只用于 ROM 阵列等特殊场合的原因。E 错：NOR 的上拉是串联的 pMOS，而 pMOS 迁移率只有 nMOS 的约 1/2~1/3，所以 NOR 通常更慢。'
  },
  {
    id: 'q1-041',
    ch: 1,
    sec: 'ch1-cmos',
    topic: '复合 CMOS 门',
    diff: 3,
    type: 'gate',
    stem: '某 CMOS 复合门实现 Y = ~((A·B) + C)。请用 AND、OR、NOT 搭出等价电路（至多 4 个门）。',
    hint: 'Y 就是"PDN 是否导通"的反：先算 A·B，再或上 C，最后取反。',
    lab: {
      inputs: ['A', 'B', 'C'],
      outs: ['Y'],
      rows: [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 1, 1, 0]
      ],
      allowed: ['AND', 'OR', 'NOT'],
      maxGates: 4,
      expr: '~((A & B) | C)',
      note: 'PDN 是 A、B 串联后再与 C 并联，输出再取反'
    },
    explain: '参考解 3 个门：AND(A,B) → OR(·, C) → NOT，表达式 ~((A &amp; B) | C)。真值表：只有 A=B=1 或 C=1 时括号内为 1、Y 为 0（001、011、101、110、111 五行），其余三行 Y=1。这个式子正对应 CMOS 复合门：PDN 为 A、B 串联再与 C 并联，PUN 取对偶为 A、B 并联再与 C 串联。'
  },
  {
    id: 'q1-042',
    ch: 1,
    sec: 'ch1-power',
    topic: '动态功耗公式',
    diff: 1,
    type: 'single',
    stem: '动态功耗与电源电压 V<sub>DD</sub> 的关系是？',
    options: [
      '与 V<sub>DD</sub> 的平方成正比',
      '与 V<sub>DD</sub> 成正比',
      '与 V<sub>DD</sub> 无关',
      '与 V<sub>DD</sub> 成反比'
    ],
    answer: 0,
    explain: '充放电能量是 ½CV<sub>DD</sub><sup>2</sup>，所以 P = ½CV<sub>DD</sub><sup>2</sup>f，与 V<sub>DD</sub> 的平方成正比。从 5 V 降到 1.8 V（比值 2.78），功耗降到约 1/7.7，这是降压最诱人的地方；代价是噪声容限变小、门延迟变大，所以电压不能无限降。'
  },
  {
    id: 'q1-043',
    ch: 1,
    sec: 'ch1-power',
    topic: '动态功耗计算',
    diff: 3,
    type: 'fill',
    stem: '某节点电容 5 fF，V<sub>DD</sub> = 3 V，每秒翻转 2×10<sup>9</sup> 次。动态功耗 P = ½CV<sub>DD</sub><sup>2</sup>f ≈ ______ µW。',
    placeholder: '填数字，单位 µW',
    accept: ['45', '45.0', '45µW', '45uW'],
    explain: 'P = ½ × 5×10<sup>−15</sup> F × (3 V)<sup>2</sup> × 2×10<sup>9</sup> Hz = ½ × 5 × 9 × 2 × 10<sup>−6</sup> W = 45×10<sup>−6</sup> W = 45 µW。注意单位换算：fF = 10<sup>−15</sup> F，10<sup>9</sup> Hz 与 10<sup>−15</sup> 相乘得 10<sup>−6</sup>，结果直接就是微瓦。'
  },
  {
    id: 'q1-044',
    ch: 1,
    sec: 'ch1-power',
    topic: '静态功耗来源',
    diff: 2,
    type: 'single',
    stem: 'CMOS 门静态功耗很低，根本原因是？',
    options: [
      '稳态时上下拉网络总有一个截止，V<sub>DD</sub> 到 GND 无直流通路',
      '晶体管的导通电阻很大，电流被限制在微安级',
      '电源电压低，所以电流一定小',
      '输出电容很小，充放电电流可以忽略'
    ],
    answer: 0,
    explain: '静态功耗来自 V<sub>DD</sub> 到 GND 的电流。CMOS 门在任一稳定输入下，PUN 与 PDN 恰有一个导通、另一个截止，直流通路被切断，只剩亚阈值泄漏与栅氧漏电。类 nMOS 逻辑是反例：常通 pMOS 让静态电流很大。B、C、D 都没有说明"没有直流通路"这一根本机制，而且电源电压低不代表电流小。'
  },
  {
    id: 'q1-045',
    ch: 1,
    sec: 'ch1-moore',
    topic: '摩尔定律',
    diff: 1,
    type: 'single',
    stem: '摩尔定律的常见表述是？',
    options: [
      '集成电路上可容纳的晶体管数目约每两年翻一番',
      '芯片主频每两年提高十倍',
      '芯片价格每两年翻一番',
      '晶体管尺寸每两年减半，功耗同步下降'
    ],
    answer: 0,
    explain: '摩尔定律讲的是集成度：单位面积可容纳的晶体管数约每两年翻一番，它带来性能提升与成本下降。它既不保证主频翻倍，也不保证功耗同比下降——Dennard 缩放（电压随尺寸同步下降）失效后主频停滞，工业界转向多核，正是这个道理。'
  },
  {
    id: 'q1-046',
    ch: 1,
    sec: 'ch1-moore',
    topic: '工艺缩小的代价',
    diff: 2,
    type: 'tf',
    stem: '工艺尺寸缩小后，动态功耗会下降，但泄漏（静态）功耗会上升，二者需要权衡。',
    answer: 1,
    explain: '正确。尺寸缩小使节点电容与 V<sub>DD</sub> 下降，½CV<sub>DD</sub><sup>2</sup>f 随之减小；但阈值电压降低、栅氧变薄会让亚阈值电流与栅漏电流迅速增大，静态功耗占比越来越高。这就是现代芯片要同时使用电源门控、多阈值电压等手段的原因，也是 1.8 节所说"工艺缩小带来新问题"的核心。'
  }
]);

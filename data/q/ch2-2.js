window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q2-027',
    ch: 2,
    sec: 'ch2-kmap',
    topic: '三变量卡诺图',
    diff: 2,
    type: 'kmap',
    stem: '变量顺序 A、B、C（A 最高位；A 为行，B、C 为列，列按格雷码 00、01、11、10 排列）。Y=Σm(0,1,2,3,5,7)，圈出最简与或式的所有组。',
    lab: {
      vars: ['A', 'B', 'C'],
      ones: [0, 1, 2, 3, 5, 7],
      dontcares: [],
      groups: [[0, 1, 2, 3], [1, 3, 5, 7]],
      ask: '共 2 个圈：A 的一整行，加上 C=1 的两列'
    },
    explain: 'A=0 的整行四个 1 合成 A′；C=1 的两列（BC=01 与 BC=11）四个 1 合成 C。两个圈覆盖全部 1，最简式 Y=A′+C。m<sub>1</sub>、m<sub>3</sub> 被两个圈共用是允许的，只要每个圈都有自己独占的 1。'
  },
  {
    id: 'q2-028',
    ch: 2,
    sec: 'ch2-kmap',
    topic: '格雷码邻接',
    diff: 2,
    type: 'single',
    stem: '卡诺图的行列标签按格雷码 00、01、11、10 排列而不是自然二进制，原因是？',
    options: [
      '保证图上相邻的格只差一个变量',
      '让图上 1 的个数更少',
      '使每行的最小项编号连续',
      '减少卡诺图的格数'
    ],
    answer: 0,
    explain: '合并相邻格时消去的是那个变化的变量，所以相邻格必须只差一个变量。格雷码相邻只改一位；自然二进制里 01 与 10 相邻却差两位，会把不能合并的格凑到一起。'
  },
  {
    id: 'q2-029',
    ch: 2,
    sec: 'ch2-kmap',
    topic: '消去变量数',
    diff: 2,
    type: 'fill',
    stem: '卡诺图中圈住 4 个相邻的 1，可以消去______个变量（填阿拉伯数字）。',
    accept: ['2', '两', '二'],
    placeholder: '数字',
    explain: '2 个格合并消去 1 个变量，4 个格消去 2 个，8 个格消去 3 个：圈内保留“不变化的变量”，其余全部消掉。一般地，2<sup>k</sup> 个格消去 k 个变量。'
  },
  {
    id: 'q2-030',
    ch: 2,
    sec: 'ch2-kmap-dc',
    topic: '四变量卡诺图',
    diff: 2,
    type: 'kmap',
    stem: '四变量卡诺图，变量顺序 A、B、C、D（A 最高位；行按 AB 的格雷码、列按 CD 的格雷码）。Y=Σm(0,1,4,5,10,11,14,15)，圈出最简与或式的所有组。',
    lab: {
      vars: ['A', 'B', 'C', 'D'],
      ones: [0, 1, 4, 5, 10, 11, 14, 15],
      dontcares: [],
      groups: [[0, 1, 4, 5], [10, 11, 14, 15]],
      ask: '共 2 个圈，注意 A 与 C 不是相邻变量'
    },
    explain: 'm<sub>0</sub>、m<sub>1</sub>、m<sub>4</sub>、m<sub>5</sub> 满足 A=0、C=0，四格合成 A′C′；m<sub>10</sub>、m<sub>11</sub>、m<sub>14</sub>、m<sub>15</sub> 满足 A=1、C=1，合成 AC。故 Y=A′C′+AC，即 A 与 C 的同或。变量在图上隔得远，并不妨碍它们组成一个合法矩形。'
  },
  {
    id: 'q2-031',
    ch: 2,
    sec: 'ch2-kmap-dc',
    topic: '无关项',
    diff: 3,
    type: 'kmap',
    stem: '四变量卡诺图（A 最高位；行按 AB、列按 CD 的格雷码）。Y=Σm(1,3,5,7,9)，无关项 d=Σd(11,13,15)。圈出最简与或式的所有组，可把无关项圈入。',
    lab: {
      vars: ['A', 'B', 'C', 'D'],
      ones: [1, 3, 5, 7, 9],
      dontcares: [11, 13, 15],
      groups: [[1, 3, 5, 7, 9, 11, 13, 15]],
      ask: '把无关项圈进来后，最简只要 1 个圈'
    },
    explain: 'D=1 的两列共 8 个格全是 1 或 X，把 X 当作 1 圈成一个 4×2 的大圈：A、B、C 都变化，只剩 D，故 Y=D。无关项的价值就在这里，它把本来分散的 1 连成了一整块。'
  },
  {
    id: 'q2-032',
    ch: 2,
    sec: 'ch2-kmap-dc',
    topic: '无关项处理',
    diff: 2,
    type: 'single',
    stem: '卡诺图化简时，对无关项 X 的正确态度是？',
    options: [
      '可当 1 圈进圈，也可当 0 不理，目的是让表达式最简',
      '必须把所有 X 都圈进圈',
      '必须把所有 X 都当作 0 处理',
      'X 只允许出现在 POS 的圈里'
    ],
    answer: 0,
    explain: '无关项对应永远不会出现的输入，输出取什么都不会影响功能。用不用它只看是否有利于化简：能帮圈变大就用，帮不上就留作 0。'
  },
  {
    id: 'q2-033',
    ch: 2,
    sec: 'ch2-kmap-dc',
    topic: '画圈规则',
    diff: 3,
    type: 'multi',
    stem: '关于卡诺图画圈，下列说法正确的有？',
    options: [
      '每个圈包含 2 的幂个格',
      '圈可以重叠，但每个圈至少要有一个只属于它的 1',
      '只要圈足够大，可以把 0 也圈进来',
      '最左列与最右列相邻，四个角两两相邻',
      '圈的个数越多，表达式越简单'
    ],
    answer: [0, 1, 3],
    explain: '圈必须为 2 的幂、只含 1 或 X，并且每个圈要有“私有”的 1，否则这个圈是多余的；重叠允许，上下、左右边界可分别跨越，四个角可组成一个矩形圈。把 0 圈进来会改变函数，“圈越多越简单”也正好说反了。'
  },
  {
    id: 'q2-034',
    ch: 2,
    sec: 'ch2-mux',
    topic: 'MUX 建模',
    diff: 2,
    type: 'hdl',
    stem: '用 SystemVerilog 写一个 2:1 复用器，端口为 s、d0、d1、y：s=0 时 y=d0，s=1 时 y=d1。可用 assign 连续赋值，或 always_comb 加 if/case。',
    lab: {
      inputs: [{ name: 's', width: 1 }, { name: 'd0', width: 1 }, { name: 'd1', width: 1 }],
      outputs: [{ name: 'y', width: 1 }],
      tests: [
        { in: { s: 0, d0: 0, d1: 0 }, out: { y: 0 } },
        { in: { s: 0, d0: 1, d1: 0 }, out: { y: 1 } },
        { in: { s: 0, d0: 1, d1: 1 }, out: { y: 1 } },
        { in: { s: 1, d0: 0, d1: 1 }, out: { y: 1 } },
        { in: { s: 1, d0: 1, d1: 0 }, out: { y: 0 } },
        { in: { s: 1, d0: 0, d1: 0 }, out: { y: 0 } }
      ],
      template: 'module mux2(input logic s, d0, d1,\n             output logic y);\n  // 在这里写 assign 或 always_comb\nendmodule',
      solution: 'module mux2(input logic s, d0, d1,\n             output logic y);\n  assign y = s ? d1 : d0;\nendmodule',
      moduleName: 'mux2'
    },
    explain: '2:1 MUX 的表达式是 Y=S′D<sub>0</sub>+SD<sub>1</sub>，因此 assign y = s ? d1 : d0 与 assign y = (~s &amp; d0) | (s &amp; d1) 都对。判题时 s=0 必须选 d0、s=1 必须选 d1。'
  },
  {
    id: 'q2-035',
    ch: 2,
    sec: 'ch2-mux',
    topic: 'MUX 门级',
    diff: 2,
    type: 'gate',
    stem: '用 AND、OR、NOT 门实现 2:1 复用器：Y = S′D<sub>0</sub> + SD<sub>1</sub>，最多 4 个门。',
    lab: {
      inputs: ['S', 'D0', 'D1'],
      outs: ['Y'],
      rows: [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 1],
             [1, 0, 0, 0], [1, 0, 1, 1], [1, 1, 0, 0], [1, 1, 1, 1]],
      allowed: ['AND', 'OR', 'NOT'],
      maxGates: 4,
      expr: '(~S & D0) | (S & D1)',
      note: '提示：S 取反一次，两个与门，最后一个或门'
    },
    explain: 'S′D<sub>0</sub> 需要一个 NOT 与一个 AND，SD<sub>1</sub> 需要一个 AND，最后 OR 合并，共 4 个门。这就是 4:1 MUX 树形结构里反复出现的基本单元。'
  },
  {
    id: 'q2-036',
    ch: 2,
    sec: 'ch2-mux',
    topic: 'MUX 选择端',
    diff: 1,
    type: 'single',
    stem: '8:1 复用器需要几个选择端？',
    options: ['3', '8', '2', '4'],
    answer: 0,
    explain: '2<sup>n</sup>:1 的复用器需要 n 个选择端：3 个选择端能区分 8 个数据输入。选择端位数是数据端个数的以 2 为底的对数。'
  },
  {
    id: 'q2-037',
    ch: 2,
    sec: 'ch2-mux',
    topic: 'MUX 实现函数',
    diff: 3,
    type: 'fill',
    stem: '用 4:1 MUX 实现三变量函数 Y=Σm(1,2,4,7)，以 A 为 S<sub>1</sub>、B 为 S<sub>0</sub>，C 接数据端。D<sub>1</sub> 应接______（可填 C、C′、0 或 1）。',
    accept: ['C′', 'C非', 'C的非', '非C', '~C', '!C'],
    placeholder: 'C、C′、0 或 1',
    explain: '选择端 AB=01 时函数面对 m<sub>2</sub> 与 m<sub>3</sub>：m<sub>2</sub>=1、m<sub>3</sub>=0，即 Y=C′，所以 D<sub>1</sub>=C′。同理 D<sub>0</sub>=C（m<sub>0</sub>=0、m<sub>1</sub>=1），D<sub>2</sub>=C′，D<sub>3</sub>=C；这正是三变量奇校验函数。'
  },
  {
    id: 'q2-038',
    ch: 2,
    sec: 'ch2-mux',
    topic: '带使能 MUX',
    diff: 3,
    type: 'hdl',
    stem: '写一个带使能的 2:1 复用器，端口为 en、s、d0、d1、y：en=1 时 y 取 s 选中的数据（s=0 选 d0，s=1 选 d1）；en=0 时 y=0。',
    lab: {
      inputs: [{ name: 'en', width: 1 }, { name: 's', width: 1 }, { name: 'd0', width: 1 }, { name: 'd1', width: 1 }],
      outputs: [{ name: 'y', width: 1 }],
      tests: [
        { in: { en: 0, s: 0, d0: 1, d1: 0 }, out: { y: 0 } },
        { in: { en: 0, s: 1, d0: 1, d1: 0 }, out: { y: 0 } },
        { in: { en: 0, s: 1, d0: 0, d1: 1 }, out: { y: 0 } },
        { in: { en: 1, s: 0, d0: 0, d1: 1 }, out: { y: 0 } },
        { in: { en: 1, s: 0, d0: 1, d1: 0 }, out: { y: 1 } },
        { in: { en: 1, s: 1, d0: 1, d1: 0 }, out: { y: 0 } },
        { in: { en: 1, s: 1, d0: 0, d1: 1 }, out: { y: 1 } },
        { in: { en: 1, s: 0, d0: 0, d1: 0 }, out: { y: 0 } }
      ],
      template: 'module mux2en(input logic en, s, d0, d1,\n                output logic y);\n  // 在这里写 assign 或 always_comb\nendmodule',
      solution: 'module mux2en(input logic en, s, d0, d1,\n                output logic y);\n  assign y = en & (s ? d1 : d0);\nendmodule',
      moduleName: 'mux2en'
    },
    explain: '使能相当于在输出再与一次 EN：EN=0 时无论选择端与数据是什么，Y 都是 0；EN=1 时退化成普通 2:1 MUX。assign y = en &amp; (s ? d1 : d0) 一行即可，用 case 或 if 也可以。'
  },
  {
    id: 'q2-039',
    ch: 2,
    sec: 'ch2-decoder',
    topic: '译码器规模',
    diff: 1,
    type: 'single',
    stem: '3:8 译码器有几根输出线？输入为 101 时哪根输出为 1？',
    options: ['8 根，Y<sub>5</sub>', '3 根，Y<sub>3</sub>', '8 根，Y<sub>3</sub>', '6 根，Y<sub>5</sub>'],
    answer: 0,
    explain: 'N:2<sup>N</sup> 译码器的输出线数是 2<sup>N</sup>，3 位输入对应 8 根。101<sub>2</sub>=5，所以 Y<sub>5</sub> 为 1，其余 7 根为 0。'
  },
  {
    id: 'q2-040',
    ch: 2,
    sec: 'ch2-decoder',
    topic: '译码器实现 SOP',
    diff: 2,
    type: 'fill',
    stem: '用 3:8 译码器加一个或门实现多数表决 Y=Σm(3,5,6,7)，应把哪几根输出接到或门？（按升序写编号，用英文逗号分隔）',
    accept: ['3,5,6,7', '3、5、6、7', '3 5 6 7'],
    placeholder: '例如 0,1,2',
    explain: '多数表决化简后的三个乘积项覆盖 m<sub>3</sub>、m<sub>5</sub>、m<sub>6</sub>、m<sub>7</sub>；译码器的输出正好是全部最小项，把 Y<sub>3</sub>、Y<sub>5</sub>、Y<sub>6</sub>、Y<sub>7</sub> 或起来即可，或门需要 4 个输入。'
  },
  {
    id: 'q2-041',
    ch: 2,
    sec: 'ch2-decoder',
    topic: '或门扇入',
    diff: 3,
    type: 'single',
    stem: '用 N:2<sup>N</sup> 译码器加或门实现一个有 M 个最小项的函数，或门至少需要几个输入？',
    options: ['M', '2<sup>N</sup>', 'N', 'M+1'],
    answer: 0,
    explain: '函数为 1 的每一行都要有一根译码器输出线参与或运算，所以或门至少需要 M 个输入。M 接近 2<sup>N</sup> 时扇入会非常大，这也是大函数不宜纯译码器实现的原因。'
  },
  {
    id: 'q2-042',
    ch: 2,
    sec: 'ch2-timing',
    topic: 'tpd 与 tcd',
    diff: 2,
    type: 'single',
    stem: '某电路从输入到输出有四条并行路径，延迟分别为 1t、2t、3t、5t，则 t<sub>pd</sub> 与 t<sub>cd</sub> 分别是？',
    options: ['5t、1t', '1t、5t', '11t、1t', '5t、2t'],
    answer: 0,
    explain: 't<sub>pd</sub> 是最坏情况下的最长延迟，取 5t；t<sub>cd</sub> 是输出开始变化的最短时间，取 1t。11t 是把并行路径当串联相加，没有物理意义。'
  },
  {
    id: 'q2-043',
    ch: 2,
    sec: 'ch2-timing',
    topic: '延迟计算',
    diff: 2,
    type: 'fill',
    stem: '某电路从输入 A 到输出要经过 4 个门，每个门的 t<sub>pd</sub>=t<sub>cd</sub>=20 ps，则 t<sub>pd</sub>=______ ps（只填数字）。',
    accept: ['80', '80ps', '80 ps'],
    placeholder: '数字',
    explain: 't<sub>pd</sub> 是关键路径上各门延迟之和：4×20 ps=80 ps。若最短路径只经过 1 个门，则 t<sub>cd</sub>=20 ps。'
  },
  {
    id: 'q2-044',
    ch: 2,
    sec: 'ch2-timing',
    topic: '关键路径',
    diff: 1,
    type: 'tf',
    stem: '传播延迟 t<sub>pd</sub> 由输入到输出的最长路径（关键路径）决定。',
    answer: 1,
    explain: '要保证输出在所有情况下都已稳定，必须等最慢的那条路径走完，所以 t<sub>pd</sub> 取最长路径之和；t<sub>cd</sub> 才取最短路径。'
  },
  {
    id: 'q2-045',
    ch: 2,
    sec: 'ch2-timing',
    topic: '路径分析',
    diff: 3,
    type: 'single',
    stem: '电路 Y=(A+B)C+D 依次由 OR、NAND、NOT、OR 实现（NAND 与 NOT 合起来充当与门），各门 t<sub>pd</sub>=t<sub>cd</sub>=t。下列判断正确的是？',
    options: [
      't<sub>pd</sub>=4t，t<sub>cd</sub>=t',
      't<sub>pd</sub>=t<sub>cd</sub>=4t',
      't<sub>pd</sub>=3t，t<sub>cd</sub>=2t',
      't<sub>pd</sub>=4t，t<sub>cd</sub>=4t'
    ],
    answer: 0,
    explain: 'A、B 要经过 OR→NAND→NOT→OR 四个门才到 Y，是最长路径，t<sub>pd</sub>=4t；D 直接进最后的 OR，只经 1 个门，是最短路径，t<sub>cd</sub>=t。同一电路的两个延迟由不同路径决定。'
  },
  {
    id: 'q2-046',
    ch: 2,
    sec: 'ch2-glitch',
    topic: '毛刺成因',
    diff: 2,
    type: 'single',
    stem: '组合电路产生毛刺的根本原因是？',
    options: [
      '同一信号经不同路径到达同一门，延迟不同',
      '电源电压不足',
      '门电路数量太多',
      '卡诺图圈组画错'
    ],
    answer: 0,
    explain: '毛刺是“到达时间不一致”的瞬态结果：输入变化后，各路径的延迟让某些门暂时输出错误的组合。它不是逻辑错误，正确化简的电路照样有毛刺。'
  },
  {
    id: 'q2-047',
    ch: 2,
    sec: 'ch2-glitch',
    topic: '毛刺与同步设计',
    diff: 2,
    type: 'multi',
    stem: '关于毛刺，下列说法正确的有？',
    options: [
      '同步时序电路中，只要数据在时钟沿前稳定，毛刺无害',
      '毛刺被当作时钟或异步清零使用会造成误触发',
      '加入冗余项（如 AC）可以消除特定输入变化下的毛刺',
      '毛刺可以通过更仔细的布线彻底消除',
      '毛刺说明布尔表达式化简错了'
    ],
    answer: [0, 1, 2],
    explain: '毛刺由路径延迟差产生，正确化简也仍然存在：布线无法彻底消除它，“有毛刺说明化简错了”也不成立。冗余项让两个乘积项在关键变量变化时总有一个为 1，从而盖住毛刺；同步设计靠“只在时钟沿采样”避开它。'
  },
  {
    id: 'q2-048',
    ch: 2,
    sec: 'ch2-glitch',
    topic: '毛刺是否致命',
    diff: 2,
    type: 'tf',
    stem: '组合逻辑的毛刺在同步时序电路中一定会导致状态错误。',
    answer: 0,
    explain: '同步电路只在时钟沿采样，只要毛刺在时钟沿前消失、数据满足建立时间，就不会被采到。只有把毛刺当时钟或异步复位用时才会真的出事。'
  }
);

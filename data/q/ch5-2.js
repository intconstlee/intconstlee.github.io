window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(...[
  {
    id: 'q5-025',
    ch: 5,
    sec: 'ch5-muldiv',
    topic: '移位代替乘法',
    diff: 1,
    type: 'single',
    stem: '在整数运算中，把 x 乘以 8 最省硬件的做法是？',
    options: [
      '把 x 左移 3 位',
      '把 x 右移 3 位',
      '把 x 与 0x08 相或',
      '把 x 取反后加 1'
    ],
    answer: 0,
    explain: '左移 k 位等价于乘以 2<sup>k</sup>，8=2<sup>3</sup>，所以左移 3 位即可。右移 3 位是除以 8；与 0x08 相或只会把某一位置 1，不是乘法。编译器常用移位代替乘以常数的乘法。'
  },
  {
    id: 'q5-026',
    ch: 5,
    sec: 'ch5-muldiv',
    topic: '算术右移计算',
    diff: 2,
    type: 'fill',
    stem: '4 位补码 1001 算术右移 1 位，结果写成 4 位二进制。',
    placeholder: '0000',
    accept: ['1100', '0b1100'],
    explain: '1001 的最高位为 1，按补码是 −7。算术右移复制符号位，得到 1100，即 −4。数学上 −7/2=−3.5，算术右移等价于向下取整，结果是 −4，而不是 −3。'
  },
  {
    id: 'q5-027',
    ch: 5,
    sec: 'ch5-muldiv',
    topic: '乘法器结构',
    diff: 2,
    type: 'tf',
    stem: '阵列乘法器把多个部分积并行相加，通常比移位-相加的迭代结构更快，但需要更多加法器。',
    answer: 1,
    explain: '正确。阵列乘法器用空间换时间：大量加法器同时处理部分积，组合延迟较短但面积大；迭代结构每个时钟只处理一位，复用同一个加法器，面积小但需要多个周期。'
  },
  {
    id: 'q5-028',
    ch: 5,
    sec: 'ch5-float',
    topic: 'IEEE 754 编码',
    diff: 3,
    type: 'fields',
    stem: '按 IEEE 754 单精度拆分 −6.5 的符号、指数和尾数，并核对 32 位编码。',
    lab: {
      kind: 'bits',
      instruction: 'IEEE 754 单精度：−6.5',
      fields: [
        { name: 'S 符号', width: 1, value: '1', hint: '负数为 1' },
        { name: 'E 指数', width: 8, value: '10000001', hint: '实际指数 2，加偏置 127' },
        { name: 'M 尾数', width: 23, value: '10100000000000000000000', hint: '隐含 1 不写入尾数域' }
      ],
      expected: '0xC0D00000'
    },
    explain: '6.5=110.1<sub>2</sub>=1.101×2<sup>2</sup>。符号为负，S=1；E=2+127=129=1000 0001<sub>2</sub>；尾数取小数点后的 101，再补 20 个 0 到 23 位。拼成 1 10000001 10100000000000000000000，即 0xC0D00000。'
  },
  {
    id: 'q5-029',
    ch: 5,
    sec: 'ch5-float',
    topic: '浮点加法步骤',
    diff: 2,
    type: 'order',
    stem: '把 IEEE 754 浮点加法的处理步骤按正确顺序排列。',
    lab: {
      items: [
        '对阶：小指数的尾数右移',
        '尾数相加或相减',
        '规格化结果',
        '按最近偶数舍入，并判断上溢与下溢'
      ],
      prompt: '拖动排列浮点加减的处理步骤'
    },
    explain: '浮点加减不能直接把位串相加。先对齐小数点（对阶），再对尾数做加减，然后规格化使尾数落在 [1,2)，最后按舍入模式处理附加位，并判断结果是否上溢为无穷大、下溢为非规格化数或 0，以及是否产生 NaN。'
  },
  {
    id: 'q5-030',
    ch: 5,
    sec: 'ch5-float',
    topic: '浮点特殊值',
    diff: 2,
    type: 'single',
    stem: '单精度浮点数指数 E=255 且尾数 M 不等于 0 时，表示什么？',
    options: ['NaN（非数）', '+∞', '−∞', '非规格化数'],
    answer: 0,
    explain: 'E=255 是单精度的指数上边界：M=0 表示 ±∞（符号位决定正负），M≠0 表示 NaN。非规格化数对应 E=0 且 M≠0；E=0、M=0 表示 ±0。NaN 用来表示 0/0、∞−∞ 等非法运算结果。'
  },
  {
    id: 'q5-031',
    ch: 5,
    sec: 'ch5-float',
    topic: '浮点解码',
    diff: 2,
    type: 'fill',
    stem: '单精度位串 0xBF400000 表示的十进制值是多少？填小数。',
    placeholder: '−1.5',
    accept: ['-0.75', '−0.75', '-0.750', '−0.750'],
    explain: '0xBF400000 的符号位 S=1，指数域为 0111 1110<sub>2</sub>=126，实际指数 126−127=−1；尾数域最高位为 1，其余为 0，所以有效数为 1.1<sub>2</sub>。值为 −1.1<sub>2</sub>×2<sup>−1</sup>=−1.5×0.5=−0.75。'
  },
  {
    id: 'q5-032',
    ch: 5,
    sec: 'ch5-counter',
    topic: '计数器模值',
    diff: 1,
    type: 'single',
    stem: '一个 8 位二进制计数器从 0 开始不断加 1，它的模是多少？',
    options: ['256', '255', '128', '8'],
    answer: 0,
    explain: '8 位寄存器能表示 2<sup>8</sup>=256 个状态 0 到 255。加到 255 后再加 1，低 8 位回绕为 0，所以模是 256。255 是最大计数值，不是模；模 k 计数器会在 k 个状态后回到起点。'
  },
  {
    id: 'q5-033',
    ch: 5,
    sec: 'ch5-counter',
    topic: '计数器状态',
    diff: 2,
    type: 'fill',
    stem: '4 位计数器初值为 0101，EN=1 且连续经过 3 个时钟沿后，状态写成 4 位二进制是什么？',
    placeholder: '0000',
    accept: ['1000', '0b1000'],
    explain: '初值 0101<sub>2</sub>=5，每个 EN=1 的时钟沿加 1：5→6（0110）→7（0111）→8（1000）。第 8 个状态没有超过 4 位范围，不发生回绕，所以结果是 1000。'
  },
  {
    id: 'q5-034',
    ch: 5,
    sec: 'ch5-counter',
    topic: '移位寄存器',
    diff: 2,
    type: 'multi',
    stem: '关于移位寄存器，下列说法正确的有哪些？',
    options: [
      '可以用于串行数据与并行数据之间的转换',
      '可以作为延迟线或芯片测试中的扫描链',
      '每个时钟沿把数据整体移动一位，并从一端移入新位',
      '只能左移，不能右移',
      '不需要时钟，属于纯组合逻辑'
    ],
    answer: [0, 1, 2],
    explain: 'A、B、C 正确。移位寄存器把串行位流逐位攒成并行字，也能把并行字逐位送出；每移一位相当于延迟一个时钟，扫描链则把触发器串起来做测试。D 错，改变拼接顺序就能实现左移或右移。E 错，移位寄存器由触发器构成，必须在时钟沿更新。'
  },
  {
    id: 'q5-035',
    ch: 5,
    sec: 'ch5-memory',
    topic: '地址译码器',
    diff: 2,
    type: 'hdl',
    stem: '实现带使能的 3-8 译码器：en=1 时，把 addr 对应的 y 位拉高；en=0 时 y 全为 0。',
    hint: '可用移位：en 为 1 时让 8 位常量 1 左移 addr 位。',
    lab: {
      inputs: [
        { name: 'en', width: 1 },
        { name: 'addr', width: 3 }
      ],
      outputs: [{ name: 'y', width: 8 }],
      tests: [
        { in: { en: 0, addr: 0 }, out: { y: 0 } },
        { in: { en: 1, addr: 0 }, out: { y: 1 } },
        { in: { en: 1, addr: 1 }, out: { y: 2 } },
        { in: { en: 1, addr: 2 }, out: { y: 4 } },
        { in: { en: 1, addr: 3 }, out: { y: 8 } },
        { in: { en: 1, addr: 4 }, out: { y: 16 } },
        { in: { en: 1, addr: 5 }, out: { y: 32 } },
        { in: { en: 1, addr: 6 }, out: { y: 64 } },
        { in: { en: 1, addr: 7 }, out: { y: 128 } }
      ],
      template: 'module decoder3to8(input logic en,\n                    input logic [2:0] addr,\n                    output logic [7:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module decoder3to8(input logic en,\n                    input logic [2:0] addr,\n                    output logic [7:0] y);\n  assign y = en ? (8\'b1 << addr) : 8\'b0;\nendmodule',
      moduleName: 'decoder3to8'
    },
    explain: '3 位地址有 8 种组合，译码器每次只让一根输出线为 1。en=1 时，8\'b1 左移 addr 位，正好把第 addr 位置 1；en=0 时全部清零。存储器正是用这种译码器把地址变成唯一一根字线。'
  },
  {
    id: 'q5-036',
    ch: 5,
    sec: 'ch5-memory',
    topic: 'DRAM 读取过程',
    diff: 2,
    type: 'order',
    stem: '把一次存储器读操作的主要步骤按数据流动顺序排列。',
    lab: {
      items: [
        '地址送入译码器',
        '译码器拉高唯一一根字线',
        '选中单元把数据送到位线',
        '灵敏放大器放大位线信号',
        '数据出现在存储器输出端'
      ],
      prompt: '拖动排列从地址到数据的读取路径'
    },
    explain: '地址先经过译码，选中一行（字线）；该行每个存储单元把 0/1 反映到位线上；位线电压摆幅通常很小，需要灵敏放大器放大并恢复成数字电平；最后经输出电路送到数据端口。DRAM 读出后还要把数据回写，因为读是破坏性的。'
  },
  {
    id: 'q5-037',
    ch: 5,
    sec: 'ch5-memory',
    topic: 'SRAM 与 DRAM',
    diff: 1,
    type: 'single',
    stem: '关于 SRAM 与 DRAM，下列哪项描述正确？',
    options: [
      'SRAM 为 6T、无需刷新；DRAM 为 1T1C、需要刷新',
      'SRAM 为 1T1C、需要刷新；DRAM 为 6T、无需刷新',
      '两者都是非易失性存储器，断电后数据不丢',
      'DRAM 不需要地址译码器，SRAM 需要'
    ],
    answer: 0,
    explain: 'SRAM 单元由 6 个晶体管组成，两个交叉耦合反相器只要供电就能锁住数据，速度快但面积大，常用于缓存。DRAM 用 1 个晶体管加 1 个电容存电荷，密度高、成本低，但会漏电，必须周期性刷新，且读操作是破坏性的。两者都易失，也都需要译码器。'
  },
  {
    id: 'q5-038',
    ch: 5,
    sec: 'ch5-memory',
    topic: '地址位数',
    diff: 1,
    type: 'single',
    stem: '一个 1024 字 × 8 位的存储器，至少需要多少位地址？',
    options: ['10', '12', '1024', '8'],
    answer: 0,
    explain: '字数 1024=2<sup>10</sup>，所以需要 10 位地址来区分 0 到 1023 号字。8 是每字的数据位数，不是地址位数；12 位地址会对应 4096 个字。'
  },
  {
    id: 'q5-039',
    ch: 5,
    sec: 'ch5-memory',
    topic: '存储器容量',
    diff: 2,
    type: 'fill',
    stem: '4096 字 × 16 位的存储器容量是多少 KiB？只填数字。',
    placeholder: '例如 2',
    unit: 'KiB',
    accept: ['8', '8.0', '8KiB'],
    explain: '总位数=4096×16=65536 位。1 字节=8 位，所以是 8192 字节；1 KiB=1024 字节，8192÷1024=8 KiB。也可以先算 4096×2 字节=8192 字节。'
  },
  {
    id: 'q5-040',
    ch: 5,
    sec: 'ch5-regfile',
    topic: '寄存器文件端口',
    diff: 1,
    type: 'single',
    stem: 'MIPS 寄存器文件通常设计成哪种端口组合？',
    options: [
      '两个读端口、一个写端口',
      '两个写端口、一个读端口',
      '一个读写共用端口',
      '32 个完全独立的端口'
    ],
    answer: 0,
    explain: '一条 R 型指令要同时读出 rs 和 rt 两个源寄存器，执行后写回 rd 一个目的寄存器，所以两读一写最合适。每增加一个端口都要增加地址译码、数据通路和单元面积，32 个独立端口代价过高。'
  },
  {
    id: 'q5-041',
    ch: 5,
    sec: 'ch5-regfile',
    topic: 'ROM 容量',
    diff: 2,
    type: 'single',
    stem: '一个 ROM 有 8 位地址线、每个字 16 位，它的总容量是多少位？',
    options: ['4096', '256', '2048', '65536'],
    answer: 0,
    explain: '8 位地址可寻址 2<sup>8</sup>=256 个字，每字 16 位，所以总容量为 256×16=4096 位。256 只是字数，不是位数；65536 相当于把地址线误当成 12 位（4096 字）再乘 16 位，和本题的 8 位地址不符。'
  },
  {
    id: 'q5-042',
    ch: 5,
    sec: 'ch5-regfile',
    topic: 'ROM 实现逻辑',
    diff: 2,
    type: 'tf',
    stem: 'ROM 把地址当输入、数据当输出，可以用来实现组合逻辑的真值表。',
    answer: 1,
    explain: '正确。ROM 本质上是一个查表器：地址的每一种组合对应一个存储字，把真值表的输出预先写进去，就能实现相应的组合函数。FPGA 的 LUT 就是一个小型 SRAM/ROM，用输入作为地址查出结果。'
  },
  {
    id: 'q5-043',
    ch: 5,
    sec: 'ch5-pla-fpga',
    topic: '优先编码器',
    diff: 3,
    type: 'hdl',
    stem: '在 FPGA 中用组合逻辑实现 4 输入优先编码器：输出编号最大的那个为 1 的输入下标；输入全 0 时输出 0。',
    hint: '从 in[3] 开始向下检查，用嵌套三目或 casez；综合后会映射到 LUT。',
    lab: {
      inputs: [{ name: 'in', width: 4 }],
      outputs: [{ name: 'y', width: 2 }],
      tests: [
        { in: { in: 0 }, out: { y: 0 } },
        { in: { in: 1 }, out: { y: 0 } },
        { in: { in: 2 }, out: { y: 1 } },
        { in: { in: 3 }, out: { y: 1 } },
        { in: { in: 4 }, out: { y: 2 } },
        { in: { in: 5 }, out: { y: 2 } },
        { in: { in: 6 }, out: { y: 2 } },
        { in: { in: 8 }, out: { y: 3 } },
        { in: { in: 12 }, out: { y: 3 } },
        { in: { in: 15 }, out: { y: 3 } }
      ],
      template: 'module priority4(input logic [3:0] in,\n                   output logic [1:0] y);\n  // 在这里编写\nendmodule',
      solution: 'module priority4(input logic [3:0] in,\n                   output logic [1:0] y);\n  assign y = in[3] ? 2\'d3 :\n             in[2] ? 2\'d2 :\n             in[1] ? 2\'d1 : 2\'d0;\nendmodule',
      moduleName: 'priority4'
    },
    explain: '优先级从高到低是 in[3]、in[2]、in[1]、in[0]。只要 in[3]=1 就输出 3，否则再看 in[2]，依此类推；in=0 时自然落到 0。例如 in=6=0110<sub>2</sub>，in[2] 为 1 且 in[3] 为 0，输出 2；in=12=1100<sub>2</sub>，in[3] 为 1，输出 3。'
  },
  {
    id: 'q5-044',
    ch: 5,
    sec: 'ch5-pla-fpga',
    topic: 'LUT 容量',
    diff: 1,
    type: 'single',
    stem: '一个 k 输入查找表（LUT）内部需要存储多少位配置数据？',
    options: ['2<sup>k</sup> 位', 'k 位', '2k 位', 'k<sup>2</sup> 位'],
    answer: 0,
    explain: 'k 个输入共有 2<sup>k</sup> 种组合，每种组合都要对应一个输出位，所以 LUT 是一个 2<sup>k</sup>×1 的 SRAM。例如 4 输入 LUT 存 16 位，6 输入 LUT 存 64 位。'
  },
  {
    id: 'q5-045',
    ch: 5,
    sec: 'ch5-pla-fpga',
    topic: 'PLA 与 ROM',
    diff: 2,
    type: 'single',
    stem: '用 PLA 实现 SOP 表达式，相对于用 ROM 查表的主要优势是什么？',
    options: [
      '只实现实际用到的乘积项，项数少时更省面积',
      '可以保存程序，不需要任何配置',
      '无论函数多复杂，面积都一定更小',
      'PLA 只能实现异或函数'
    ],
    answer: 0,
    explain: 'ROM 按地址存所有最小项对应的输出，地址空间有多大就要多少存储单元；PLA 的与平面只产生函数真正需要的乘积项，或平面再把它们或起来。当乘积项远少于最小项时，PLA 更省面积；如果函数需要大量乘积项，优势就不明显。'
  },
  {
    id: 'q5-046',
    ch: 5,
    sec: 'ch5-pla-fpga',
    topic: 'FPGA 配置位数',
    diff: 2,
    type: 'fill',
    stem: '某 FPGA 设计使用 100 个 4 输入 LUT，每个 LUT 需要 16 位配置数据。仅这些 LUT 至少需要多少位配置存储？只填数字。',
    placeholder: '例如 1000',
    unit: '位',
    accept: ['1600', '1600位'],
    explain: '4 输入 LUT 的真值表有 2<sup>4</sup>=16 项，每项 1 位，所以每个 LUT 需要 16 位配置。100 个共需 100×16=1600 位。实际 FPGA 还要为互连开关、触发器和 I/O 配置，总配置位数会更大。'
  },
  {
    id: 'q5-047',
    ch: 5,
    sec: 'ch5-pla-fpga',
    topic: 'FPGA 与 ASIC',
    diff: 3,
    type: 'multi',
    stem: '关于 FPGA、LUT 与 ASIC，下列说法正确的有哪些？',
    options: [
      'FPGA 可现场重编程，适合原型验证和小批量生产',
      'LUT 本质是小 SRAM，可实现任意 k 输入组合函数',
      'ASIC 通常性能功耗更优，但流片成本高、周期长',
      'FPGA 的可编程互连不占面积，也不会增加延迟',
      'FPGA 编程后变成掩膜 ROM，不能再修改'
    ],
    answer: [0, 1, 2],
    explain: 'A、B、C 正确。FPGA 的配置可以反复下载；LUT 用输入当地址查配置位，故能实现任意 k 输入函数；ASIC 为特定功能定制，性能功耗好但前期成本高。D 错，互连开关和长线正是 FPGA 面积、延迟和功耗开销的重要来源。E 错，多数 FPGA 的配置存储在 SRAM 中，掉电会丢失，重新下载即可改变电路，并不是掩膜 ROM。'
  }
]);

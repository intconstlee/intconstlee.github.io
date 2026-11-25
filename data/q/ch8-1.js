window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q8-001',
    ch: 8,
    sec: 'ch8-hierarchy',
    topic: '局部性',
    diff: 1,
    type: 'tf',
    stem: '程序顺序访问数组元素时，相邻地址很快被访问，这属于空间局部性。',
    explain: '空间局部性指被访问地址附近的单元很可能马上被访问，数组的相邻元素就是典型例子。时间局部性指同一个数据被反复访问，例如循环变量。两者常同时出现，但判据不同。',
    answer: 1
  },
  {
    id: 'q8-002',
    ch: 8,
    sec: 'ch8-hierarchy',
    topic: '存储层次',
    diff: 1,
    type: 'single',
    stem: '下列“存储层次与典型实现”的对应中，正确的是：',
    options: ['主存——SRAM', '寄存器——DRAM', 'L1 缓存——SRAM', '磁盘——SRAM'],
    answer: 2,
    explain: 'L1、L2、L3 用 SRAM，速度快、成本高；主存用 DRAM，靠电容存储并需要刷新；寄存器由触发器构成；磁盘是磁介质。'
  },
  {
    id: 'q8-003',
    ch: 8,
    sec: 'ch8-hierarchy',
    topic: '存储层次',
    diff: 1,
    type: 'fill',
    stem: '存储器层次中，速度最快、容量最小、每位成本最高的层次是________。',
    accept: ['寄存器', '寄存器组', 'register', 'registers'],
    placeholder: '填层次名称',
    explain: '寄存器在 CPU 内部，由触发器实现，延迟小于 1 个周期，但容量只有几十到几百字节。'
  },
  {
    id: 'q8-004',
    ch: 8,
    sec: 'ch8-amat',
    topic: 'AMAT',
    diff: 1,
    type: 'fill',
    stem: '某缓存命中时间 1 周期，缺失率 5%，缺失代价 100 周期。用 AMAT 公式计算平均访存时间，填周期数。',
    accept: ['6', '6.0', '6周期', '6个周期'],
    unit: '周期',
    placeholder: '如 6',
    explain: 'AMAT = t<sub>hit</sub> + 缺失率 × t<sub>miss</sub> = 1 + 0.05 × 100 = 6 周期。'
  },
  {
    id: 'q8-005',
    ch: 8,
    sec: 'ch8-amat',
    topic: 'AMAT',
    diff: 2,
    type: 'single',
    stem: '关于平均访存时间 AMAT，下列说法正确的是：',
    options: ['AMAT = 命中时间 + 缺失率 × 缺失代价', 'AMAT 等于最坏情况的访存时间', '提高命中率一定会增大 AMAT', '缺失代价只由缓存容量决定'],
    answer: 0,
    explain: 'AMAT 是加权平均：大多数访问只花命中时间，少数缺失才付出缺失代价。最坏情况是每次都缺失；提高命中率会减小 AMAT；缺失代价还取决于下一级的延迟与带宽。'
  },
  {
    id: 'q8-006',
    ch: 8,
    sec: 'ch8-amat',
    topic: '多级缓存 AMAT',
    diff: 3,
    type: 'fill',
    stem: 'L1 命中时间 1 周期、缺失率 5%；L2 命中时间 10 周期、命中率 90%、缺失代价 100 周期。求 AMAT（周期）。',
    accept: ['2', '2.0', '2.00', '2周期'],
    unit: '周期',
    explain: 'L1 缺失代价 = 10 + (1 − 0.9) × 100 = 20 周期；AMAT = 1 + 0.05 × 20 = 2 周期。'
  },
  {
    id: 'q8-007',
    ch: 8,
    sec: 'ch8-amat',
    topic: 'AMAT 优化',
    diff: 2,
    type: 'multi',
    stem: '下列措施中，能够降低 AMAT 的有：',
    options: [
      '增大缓存容量以减少容量缺失',
      '把块大小增大到整页，缺失率一定下降',
      '采用多级缓存降低缺失代价',
      '预取后续数据块以隐藏缺失代价',
      '提高时钟频率就能降低以周期计的 AMAT'
    ],
    answer: [0, 2, 3],
    explain: '增大容量从缺失率入手，多级缓存降低缺失代价，预取隐藏缺失延迟。块过大可能增加冲突与缺失代价；提高频率缩短的是每周期的时间，以周期计的 AMAT 不变。'
  },
  {
    id: 'q8-008',
    ch: 8,
    sec: 'ch8-amat',
    topic: 'AMAT 与 CPU 时间',
    diff: 2,
    type: 'tf',
    stem: 'AMAT 是平均每次访存的时间，因此用 AMAT 乘以指令数就能得到程序运行时间。',
    explain: '只有访存指令才产生访存时间，还要考虑访存比例、CPI 与流水线停顿。CPU 时间 = 指令数 × CPI × 时钟周期，AMAT 只影响其中的访存部分。',
    answer: 0
  },
  {
    id: 'q8-009',
    ch: 8,
    sec: 'ch8-cache-line',
    topic: '地址拆分',
    diff: 1,
    type: 'fill',
    stem: '32 位地址、64 KB 直接映射缓存、块大小 32 字节，Tag 是多少位？',
    accept: ['16', '16位'],
    unit: '位',
    explain: '块数 = 64 KB / 32 B = 2048 = 2<sup>11</sup>，Index 11 位；Offset = log<sub>2</sub>32 = 5 位；Tag = 32 − 11 − 5 = 16 位。'
  },
  {
    id: 'q8-010',
    ch: 8,
    sec: 'ch8-cache-line',
    topic: '地址拆分',
    diff: 2,
    type: 'fields',
    stem: '32 位地址、2 KB 直接映射缓存、块 16 字节。把地址 0x00001234 拆成 Tag、Index、Offset 三个字段。',
    lab: {
      kind: 'bits',
      fields: [
        { name: 'Tag', width: 21, value: '000000000000000000010', hint: '地址的第 31 至 11 位' },
        { name: 'Index', width: 7, value: '0100011', hint: '地址的第 10 至 4 位' },
        { name: 'Offset', width: 4, value: '0100', hint: '地址的第 3 至 0 位' }
      ],
      expected: '0x00001234'
    },
    explain: '块数 = 2 KB / 16 B = 128 = 2<sup>7</sup>，Index 7 位；Offset = 4 位；Tag = 32 − 7 − 4 = 21 位。0x1234 的 Tag 为 2，Index 为 0x23 即 35，Offset 为 4。'
  },
  {
    id: 'q8-011',
    ch: 8,
    sec: 'ch8-cache-line',
    topic: '组相联索引',
    diff: 3,
    type: 'single',
    stem: '32 KB 数据、4 路组相联、块大小 64 字节，Index 是多少位？',
    options: ['6', '8', '9', '7'],
    answer: 3,
    explain: '行数 = 32 KB / 64 B = 512；组数 = 512 / 4 = 128 = 2<sup>7</sup>，所以 Index 7 位；Offset 6 位，Tag 19 位。'
  },
  {
    id: 'q8-012',
    ch: 8,
    sec: 'ch8-cache-line',
    topic: '地址字段',
    diff: 2,
    type: 'multi',
    stem: '关于缓存地址的 Tag、Index、Offset，下列说法正确的有：',
    options: [
      'Offset 决定块内的哪个字节',
      '块大小越大，Offset 位数越少',
      'Index 用来选择组或行',
      'Tag 用来确认该行装的是否为所需块',
      'Index 位数只由总容量决定，与相联度无关'
    ],
    answer: [0, 2, 3],
    explain: 'Offset 位数 = log<sub>2</sub>(块大小)，块越大位数越多；Index 位数 = log<sub>2</sub>(组数)，而组数 = 行数 / 路数，所以与相联度有关。'
  },
  {
    id: 'q8-013',
    ch: 8,
    sec: 'ch8-cache-lookup',
    topic: '缺失处理',
    diff: 1,
    type: 'order',
    stem: '把缓存缺失后的处理步骤排成正确顺序。',
    lab: {
      items: [
        '发现 Tag 不匹配或有效位为 0',
        '向下一级请求整块数据',
        '按替换策略选择牺牲行，脏块先写回',
        '装入新块，写入 Tag 并置有效位',
        '重新执行这次访存'
      ],
      prompt: '按缓存缺失处理的先后顺序排列'
    },
    explain: '缺失先确认原因，再向下一级取块；若牺牲行是脏的必须先写回；装入后更新 Tag 与有效位，最后重新执行访存，此时通常命中。'
  },
  {
    id: 'q8-014',
    ch: 8,
    sec: 'ch8-cache-lookup',
    topic: '命中判定',
    diff: 2,
    type: 'single',
    stem: '直接映射缓存命中时，是否还需要比较 Tag？',
    options: ['不需要，Index 相同就是同一块', '只在写操作时需要', '需要，Index 只选行，Tag 才能确认块', '只在缺失时才需要'],
    answer: 2,
    explain: '不同地址的 Index 可能相同，必须比较 Tag 并检查有效位，否则会把别的块当成命中。'
  },
  {
    id: 'q8-015',
    ch: 8,
    sec: 'ch8-cache-lookup',
    topic: '缺失处理',
    diff: 1,
    type: 'tf',
    stem: '缓存缺失时，CPU 只取回当前需要的那一个字，不必把整块装入缓存。',
    explain: '缓存按块搬运，缺失时从下一级取回整块并装入，利用空间局部性让后续相邻访问命中。',
    answer: 0
  },
  {
    id: 'q8-016',
    ch: 8,
    sec: 'ch8-mapping',
    topic: '直接映射冲突',
    diff: 2,
    type: 'single',
    stem: '2 KB、块 16 字节的直接映射缓存中，下列哪两个地址会争用同一行？',
    options: ['0x0000 与 0x0400', '0x0000 与 0x0800', '0x0000 与 0x0004', '0x0000 与 0x07F0'],
    answer: 1,
    explain: 'Index 是地址第 10 至 4 位。0x0800 = 2<sup>11</sup>，低 11 位为 0，Index 与 0x0000 相同，但 Tag 为 1，因此冲突。0x0400 的 Index 为 64，0x07F0 的 Index 为 127，0x0004 与 0x0000 在同一块。'
  },
  {
    id: 'q8-017',
    ch: 8,
    sec: 'ch8-mapping',
    topic: '地址拆分',
    diff: 2,
    type: 'fields',
    stem: '32 位地址、1 KB 缓存、块 32 字节、2 路组相联。把地址 0x0000ABCD 拆成 Tag、Index、Offset。',
    lab: {
      kind: 'bits',
      fields: [
        { name: 'Tag', width: 23, value: '00000000000000001010101', hint: '剩余的高位' },
        { name: 'Index', width: 4, value: '1110', hint: '16 组，Index 4 位' },
        { name: 'Offset', width: 5, value: '01101', hint: '32 字节块，Offset 5 位' }
      ],
      expected: '0x0000ABCD'
    },
    explain: '行数 = 1 KB / 32 B = 32；2 路时组数 = 32 / 2 = 16，Index 4 位；Offset = 5 位；Tag = 32 − 4 − 5 = 23 位。0xABCD 的 Tag 为 0x55 即 85，Index 为 14，Offset 为 13。'
  },
  {
    id: 'q8-018',
    ch: 8,
    sec: 'ch8-mapping',
    topic: '映射方式',
    diff: 2,
    type: 'multi',
    stem: '关于三种映射方式，下列说法正确的有：',
    options: [
      '全相联因为要比较所有 Tag，常用于大容量 L1',
      '直接映射每组只有 1 行，硬件最简单',
      '组相联的组数等于总行数乘以路数',
      '全相联只有 1 组，冲突缺失最少',
      'N 路组相联需要并行比较 N 个 Tag'
    ],
    answer: [1, 3, 4],
    explain: '全相联比较器多、成本高，只用于 TLB 等小结构；组数 = 总行数 / 路数，不是乘。'
  },
  {
    id: 'q8-019',
    ch: 8,
    sec: 'ch8-mapping',
    topic: '组数计算',
    diff: 3,
    type: 'fill',
    stem: '总容量 32 KB、块 64 字节、4 路组相联，缓存共有多少组？',
    accept: ['128', '128组'],
    unit: '组',
    explain: '行数 = 32 KB / 64 B = 512；组数 = 512 / 4 = 128。'
  },
  {
    id: 'q8-020',
    ch: 8,
    sec: 'ch8-policy',
    topic: '写策略',
    diff: 1,
    type: 'match',
    stem: '把写策略与它的含义配对。',
    lab: {
      pairs: [
        ['写直达', '写缓存的同时写下一级，简单但流量大'],
        ['写回', '只写缓存并置脏位，替换时才写回'],
        ['写分配', '写缺失时先把块装入缓存再写'],
        ['不写分配', '写缺失时直接写到下一级，不装入缓存']
      ]
    },
    explain: '写直达与写回决定“何时写下一级”；写分配与不写分配决定“写缺失时是否装入缓存”。常见搭配是写回配写分配、写直达配不写分配。'
  },
  {
    id: 'q8-021',
    ch: 8,
    sec: 'ch8-policy',
    topic: '脏位',
    diff: 2,
    type: 'single',
    stem: '写回策略中脏位的作用是：',
    options: ['标记该行被修改过，替换时需要写回', '标记该行是否有效', '记录该行最近被访问的次数', '标记该行是否只读'],
    answer: 0,
    explain: '脏位 D 为 1 表示缓存中的副本比下一级新，替换这一行时必须先写回；干净块可以直接丢弃。'
  },
  {
    id: 'q8-022',
    ch: 8,
    sec: 'ch8-policy',
    topic: '写缓冲',
    diff: 2,
    type: 'tf',
    stem: '写直达通常配合写缓冲，以减少 CPU 等待下一级写完的时间。',
    explain: '写直达每次写都要到下一级，写缓冲把写请求排队，CPU 可以继续执行；代价是要处理缓冲未清空时的一致性。',
    answer: 1
  },
  {
    id: 'q8-023',
    ch: 8,
    sec: 'ch8-multilevel',
    topic: '多级缓存缺失代价',
    diff: 3,
    type: 'fill',
    stem: 'L1 缺失后访问 L2：L2 命中时间 12 周期、命中率 75%，L2 缺失时访问主存需 200 周期。L1 的缺失代价是多少周期？',
    accept: ['62', '62周期'],
    unit: '周期',
    explain: 'L1 缺失代价 = 12 + (1 − 0.75) × 200 = 12 + 50 = 62 周期。'
  },
  {
    id: 'q8-024',
    ch: 8,
    sec: 'ch8-multilevel',
    topic: '受害者缓存',
    diff: 2,
    type: 'single',
    stem: '受害者缓存（victim cache）的主要作用是：',
    options: ['扩大 L1 的容量到 L2 大小', '存放刚被替换出的块，减少冲突缺失', '记录页表的映射关系', '替代 TLB 完成地址转换'],
    answer: 1,
    explain: '受害者缓存是一个很小的全相联缓存，专门接住从 L1 被挤出的块。若刚挤出的块马上又被访问，就能从这里捞回，避免再次访问下一级。'
  },
  {
    id: 'q8-025',
    ch: 8,
    sec: 'ch8-multilevel',
    topic: '高级缓存设计',
    diff: 2,
    type: 'multi',
    stem: '下列属于高级缓存设计、用于降低缺失影响的有：',
    options: [
      '多级缓存',
      '非阻塞缓存',
      '把 L1 改成直接映射以减少冲突缺失',
      '预取',
      '增大块大小到整页，一定降低缺失率'
    ],
    answer: [0, 1, 3],
    explain: '多级缓存降低缺失代价，非阻塞缓存减少缺失带来的停顿，预取隐藏缺失延迟。块过大会增加缺失代价与冲突；直接映射的冲突比组相联更多，不是优化方向。'
  }
);

window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q8-026',
    ch: 8,
    sec: 'ch8-vm',
    topic: '虚拟存储器作用',
    diff: 1,
    type: 'single',
    stem: '虚拟存储器最核心的两个作用是：',
    options: ['提高 CPU 主频并降低功耗', '替代缓存以加快访存', '把磁盘变成 SRAM', '扩大可用地址空间并隔离进程'],
    answer: 3,
    explain: '虚拟存储器把磁盘作为主存的后备，让每个进程看到独立而连续的地址空间；页表与权限位同时提供隔离与保护。它不能替代缓存，也不会改变磁盘的物理速度。'
  },
  {
    id: 'q8-027',
    ch: 8,
    sec: 'ch8-vm',
    topic: '页内偏移',
    diff: 1,
    type: 'fill',
    stem: '页大小为 4 KB 时，页内偏移 Offset 占多少位？',
    accept: ['12', '12位'],
    unit: '位',
    explain: '4 KB = 2<sup>12</sup>，所以 Offset 为 12 位；虚拟地址剩下的高位才是 VPN。'
  },
  {
    id: 'q8-028',
    ch: 8,
    sec: 'ch8-vm',
    topic: '虚拟地址拆分',
    diff: 3,
    type: 'fields',
    stem: '32 位虚拟地址、4 KB 页。把虚拟地址 0x0000ABCD 拆成 VPN 与 Offset。',
    lab: {
      kind: 'bits',
      fields: [
        { name: 'VPN', width: 20, value: '00000000000000001010', hint: '高 20 位，送页表翻译' },
        { name: 'Offset', width: 12, value: '101111001101', hint: '低 12 位，虚实地址相同' }
      ],
      expected: '0x0000ABCD'
    },
    explain: 'Offset 12 位，取低 12 位 0xBCD；VPN 为剩余 20 位 0x0000A。虚实地址的 Offset 相同，只有页号被页表翻译。'
  },
  {
    id: 'q8-029',
    ch: 8,
    sec: 'ch8-pagetable',
    topic: '页表大小',
    diff: 2,
    type: 'fill',
    stem: '32 位虚拟地址、4 KB 页、页表项 4 字节，单级页表占多少 MB？',
    accept: ['4', '4MB'],
    unit: 'MB',
    explain: 'Offset 12 位，VPN 20 位，页表项数 2<sup>20</sup> = 1 048 576；每项 4 B，总大小 4 MB。'
  },
  {
    id: 'q8-030',
    ch: 8,
    sec: 'ch8-pagetable',
    topic: '页表项',
    diff: 2,
    type: 'single',
    stem: '页表项的有效位为 0，通常意味着：',
    options: ['该页被修改过，需要写回磁盘', '该页只能读不能写', '该页不在内存，访问会触发缺页异常', '该页的物理页号是 0'],
    answer: 2,
    explain: '有效位表示该页当前是否驻留内存。为 0 时访问触发缺页，操作系统从磁盘调入后再把有效位置 1；脏位才表示是否被修改。'
  },
  {
    id: 'q8-031',
    ch: 8,
    sec: 'ch8-pagetable',
    topic: '物理地址拼接',
    diff: 2,
    type: 'fields',
    stem: '某页表项给出物理页号 PPN = 0x000AB，页内偏移为 0x123。拼出 32 位物理地址。',
    lab: {
      kind: 'bits',
      fields: [
        { name: 'PPN', width: 20, value: '00000000000010101011', hint: '来自页表项' },
        { name: 'Offset', width: 12, value: '000100100011', hint: '虚拟地址低 12 位直接复制' }
      ],
      expected: '0x000AB123'
    },
    explain: '物理地址 = PPN 左移 12 位后与 Offset 拼接，即 0x000AB000 + 0x123 = 0x000AB123。'
  },
  {
    id: 'q8-032',
    ch: 8,
    sec: 'ch8-pagetable',
    topic: '多级页表',
    diff: 3,
    type: 'single',
    stem: '多级页表主要解决了单级页表的什么问题？',
    options: ['地址转换不需要 TLB', '每个进程都要连续占用巨大的页表空间', '页内偏移位数太多', '缓存行装不下页表项'],
    answer: 1,
    explain: '多级页表只为实际使用的地址区间分配下级页表，省下大量未使用区间的页表项；代价是 TLB 缺失时要多次访存遍历页表。'
  },
  {
    id: 'q8-033',
    ch: 8,
    sec: 'ch8-tlb',
    topic: 'TLB 命中路径',
    diff: 2,
    type: 'order',
    stem: '把 TLB 命中时一次访存的地址转换步骤排序。',
    lab: {
      items: [
        '用虚拟页号 VPN 查 TLB',
        '命中后从 TLB 取得物理页号 PPN',
        '把 PPN 与页内偏移拼成物理地址',
        '用物理地址访问缓存或主存'
      ],
      prompt: '按地址转换的先后顺序排列'
    },
    explain: 'TLB 缓存的是 VPN 到 PPN 的映射；命中后用 PPN 与不变的 Offset 拼出物理地址，再访问缓存或主存。'
  },
  {
    id: 'q8-034',
    ch: 8,
    sec: 'ch8-tlb',
    topic: 'TLB 缺失与缺页',
    diff: 3,
    type: 'single',
    stem: 'TLB 缺失与缺页的主要区别是：',
    options: ['两者完全等价', 'TLB 缺失一定导致缺页', '缺页只发生在写操作时', 'TLB 缺失通常只需查页表补齐映射，缺页要从磁盘调入'],
    answer: 3,
    explain: 'TLB 只是页表项的小缓存，缺失时页表里通常还有映射，补进去只需几十周期；缺页是页本身不在内存，要读磁盘，代价数百万周期。'
  },
  {
    id: 'q8-035',
    ch: 8,
    sec: 'ch8-io',
    topic: 'DMA 传输',
    diff: 2,
    type: 'num',
    stem: '某 DMA 控制器每次最多搬运 4 KB，设备共产生 1 MB 数据。忽略启动与中断开销，至少需要多少次 DMA 传输？',
    answer: 256,
    tol: 0,
    unit: '次',
    placeholder: '填整数',
    explain: '1 MB = 1024 KB，1024 KB / 4 KB = 256 次。DMA 按块搬运，块越大，启动次数与中断次数越少；但单次传输的延迟与缓冲区占用也会增加。'
  },
  {
    id: 'q8-036',
    ch: 8,
    sec: 'ch8-io',
    topic: '内存映射 I/O',
    diff: 2,
    type: 'single',
    stem: 'MIPS 用 lw 与 sw 访问设备寄存器，这种方式称为：',
    options: ['内存映射 I/O', '端口映射 I/O', '程序查询 I/O', '通道 I/O'],
    answer: 0,
    explain: '内存映射 I/O 把设备寄存器放进地址空间，用普通访存指令访问，可复用保护机制；端口映射 I/O 用独立的端口空间与 in、out 指令，x86 仍保留这种方式。'
  },
  {
    id: 'q8-037',
    ch: 8,
    sec: 'ch8-io',
    topic: '轮询与中断',
    diff: 1,
    type: 'single',
    stem: '对于很少就绪的慢速设备，下列哪种 I/O 方式更节省 CPU 时间？',
    options: ['轮询方式', '关中断后忙等', '中断方式', '反复读取状态并复位'],
    answer: 2,
    explain: '设备很少就绪时，轮询会让 CPU 长时间空转；中断只在就绪时打断 CPU，其余时间 CPU 可以做别的事。DMA 更适合大块传输。'
  },
  {
    id: 'q8-038',
    ch: 8,
    sec: 'ch8-io',
    topic: '中断处理',
    diff: 2,
    type: 'order',
    stem: '把一次中断处理的主要步骤排序。',
    lab: {
      items: [
        '设备发出中断请求',
        'CPU 完成当前指令并保存现场',
        '跳转到中断服务程序',
        'ISR 清除中断标志并处理数据',
        '恢复现场并返回'
      ],
      prompt: '按中断处理的先后顺序排列'
    },
    explain: '中断在指令边界被响应：先保存现场，再进入 ISR；ISR 必须先清标志防止重复进入，处理完后恢复现场返回。'
  },
  {
    id: 'q8-039',
    ch: 8,
    sec: 'ch8-embedded',
    topic: '串行接口',
    diff: 2,
    type: 'single',
    stem: '下列串行接口中，采用异步方式、靠起止位同步的是：',
    options: ['SPI', 'I2C', 'PCIe', 'UART'],
    answer: 3,
    explain: 'SPI 与 I2C 都有时钟线，属于同步串行；UART 没有时钟线，靠双方约定的波特率与起止位同步。PCIe 是系统总线，不是板级低速串行接口。'
  },
  {
    id: 'q8-040',
    ch: 8,
    sec: 'ch8-embedded',
    topic: '计时器',
    diff: 2,
    type: 'fill',
    stem: '系统时钟 80 MHz，计时器预分频 80，要每 1 ms 中断一次，比较值应设为多少？',
    accept: ['1000', '1000次'],
    unit: '次',
    explain: '预分频后计数频率 = 80 MHz / 80 = 1 MHz，即每微秒计 1 次；1 ms = 1000 微秒，所以比较值为 1000。'
  },
  {
    id: 'q8-041',
    ch: 8,
    sec: 'ch8-pc',
    topic: 'PCIe',
    diff: 1,
    type: 'single',
    stem: 'PCIe 相比传统并行 PCI 的主要特点是：',
    options: ['共享并行总线，设备越多越慢', '串行点对点，可多通道扩展', '只能连接磁盘', '不需要设备驱动'],
    answer: 1,
    explain: 'PCIe 每个设备有独立的串行链路，多条通道可以聚合带宽；并行 PCI 是共享总线，设备争用同一组信号线。'
  },
  {
    id: 'q8-042',
    ch: 8,
    sec: 'ch8-pc',
    topic: 'x86 大页',
    diff: 2,
    type: 'single',
    stem: 'x86 支持 2 MB 与 1 GB 大页，其主要好处是：',
    options: ['一个 TLB 项覆盖更大范围，减少 TLB 缺失', '让缓存行变大', '取消页表', '提高主频'],
    answer: 0,
    explain: '大页让每个 TLB 项映射更大的地址范围，同样的 TLB 项数可以覆盖更多内存，减少 TLB 缺失；代价是页内碎片与换页粒度变大。'
  },
  {
    id: 'q8-043',
    ch: 8,
    sec: 'ch8-pc',
    topic: 'USB',
    diff: 1,
    type: 'fill',
    stem: 'USB 2.0 高速模式的理论速率是多少 Mb/s？',
    accept: ['480', '480Mb/s'],
    unit: 'Mb/s',
    explain: 'USB 2.0 高速模式为 480 Mb/s，全速为 12 Mb/s，低速为 1.5 Mb/s。'
  },
  {
    id: 'q8-044',
    ch: 8,
    sec: 'ch8-pc',
    topic: 'PC 总线',
    diff: 1,
    type: 'match',
    stem: '把 PC 总线或接口与它的特点配对。',
    lab: {
      pairs: [
        ['USB', '支持热插拔、树形拓扑、可供电'],
        ['PCIe', '串行点对点、多通道的系统总线'],
        ['SATA', '连接硬盘与 SSD 的串行存储接口'],
        ['DDR3', '双沿传输、突发传输的内存']
      ]
    },
    explain: 'USB 面向外设、可热插拔；PCIe 是系统主干；SATA 面向存储设备；DDR3 是内存接口，靠双沿与突发提高带宽。'
  },
  {
    id: 'q8-045',
    ch: 8,
    sec: 'ch8-summary',
    topic: '缺失分类',
    diff: 3,
    type: 'single',
    stem: '下列哪一次缓存缺失属于强制缺失（compulsory miss）？',
    options: ['缓存容量不足挤掉了常用块', '程序第一次访问某个块', '两个块映射到同一组互相替换', '写回时脏位为 1 导致的写回'],
    answer: 1,
    explain: '强制缺失是冷启动后第一次访问某块，无法通过增大容量或提高相联度消除，只能预取缓解。容量缺失与冲突缺失分别由容量不足和映射冲突造成。'
  },
  {
    id: 'q8-046',
    ch: 8,
    sec: 'ch8-summary',
    topic: '访存全路径',
    diff: 3,
    type: 'single',
    stem: '关于一次带 TLB 与缓存的访存，下列说法正确的是：',
    options: ['TLB 命中说明数据一定在 L1 中', 'TLB 缺失一定意味着缺页', '缺页要读磁盘，代价远大于 TLB 缺失', '缓存命中时可以跳过地址转换'],
    answer: 2,
    explain: 'TLB 管映射，L1 管数据，两者命中与否互相独立；TLB 缺失可能只是映射不在 TLB 中，补页表即可；缓存若用物理地址索引，仍要先完成地址转换，VIPT 只是把转换与索引重叠。'
  }
);

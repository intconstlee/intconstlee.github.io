/* 全站元数据：章节标题、色彩种子、图标与首页文案。 */
window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.meta = {
  site: {
    name: '门与指令',
    en: 'Gates & Instructions',
    sub: '数字设计与计算机体系结构 · 交互实验室',
    edition: 'Harris & Harris · 原书第 2 版',
    intro: '从一枚逻辑门出发，一路搭到能跑程序的处理器。读讲义、做实验、把你造出来的机器跑起来。',
    footer: '依据《数字设计和计算机体系结构》（原书第 2 版）与配套《知识点精讲》编写',
    defaultSeed: '#4A3F8C',
    practiceSeed: '#1F5F5B',
    statsSeed: '#2F6B7A'
  },
  chapters: [
    {
      num: 1,
      title: '二进制',
      en: 'Binary',
      tagline: '电压如何变成 0 和 1',
      blurb: '数制、补码、逻辑门与 CMOS 开关模型。全书的地基，也是“数字”二字的来历。',
      seed: '#2563C9',
      icon: 'bits',
      motif: 'bits',
      pages: '1–38',
      topics: ['数制转换', '补码与溢出', '逻辑门', 'CMOS', '噪声容限', '功耗']
    },
    {
      num: 2,
      title: '组合逻辑设计',
      en: 'Combinational Logic',
      tagline: '没有记忆的电路，如何思考',
      blurb: '布尔代数、卡诺图、MUX 与译码器，再加上传播延迟与毛刺——把“功能正确”变成“又快又稳”。',
      seed: '#B23A2A',
      icon: 'gates',
      motif: 'gates',
      pages: '39–60',
      topics: ['布尔代数', 'SOP/POS', '卡诺图', '无关项', 'MUX', '传播延迟']
    },
    {
      num: 3,
      title: '时序逻辑设计',
      en: 'Sequential Logic',
      tagline: '让电路记住刚刚发生了什么',
      blurb: '锁存器与触发器、有限状态机、建立/保持时间与亚稳态。同步设计的第一条纪律从这里开始。',
      seed: '#6D48C7',
      icon: 'clock',
      motif: 'wave',
      pages: '61–100',
      topics: ['锁存器', '触发器', 'FSM', '建立时间', '保持时间', '亚稳态']
    },
    {
      num: 4,
      title: '硬件描述语言',
      en: 'Hardware Description Language',
      tagline: '用代码画出一块芯片',
      blurb: 'SystemVerilog 的组合与时序建模、阻塞/非阻塞赋值、case 与 always。写出能综合、也能仿真通过的 RTL。',
      seed: '#0F7B6C',
      icon: 'code',
      motif: 'code',
      pages: '101–145',
      topics: ['模块', 'assign', 'always_comb', 'always_ff', '非阻塞赋值', 'FSM 建模']
    },
    {
      num: 5,
      title: '数字模块',
      en: 'Digital Building Blocks',
      tagline: '把常用电路做成标准件',
      blurb: '加法器、ALU、乘法、浮点、计数器、SRAM 与 PLA/FPGA——处理器货架上的一整排零件。',
      seed: '#A4670A',
      icon: 'chip',
      motif: 'chip',
      pages: '146–180',
      topics: ['加法器', 'ALU', '浮点数', '计数器', '存储器阵列', 'PLA/FPGA']
    },
    {
      num: 6,
      title: '体系结构',
      en: 'Architecture',
      tagline: '程序员眼中的那台机器',
      blurb: 'MIPS 指令集、寄存器、机器码编码与寻址方式。写得出汇编，也手算得出每条指令的 32 位。',
      seed: '#B0256B',
      icon: 'isa',
      motif: 'isa',
      pages: '181–227',
      topics: ['MIPS 指令', '汇编编程', 'R/I/J 型编码', '寻址方式', '函数调用', '机器语言']
    },
    {
      num: 7,
      title: '微体系结构',
      en: 'Microarchitecture',
      tagline: '把指令变成真正会跑的硬件',
      blurb: '单周期、多周期与流水线数据通路，CPI 与加速比，冒险与转发。用第 1–5 章的积木实现第 6 章的契约。',
      seed: '#5E7200',
      icon: 'pipeline',
      motif: 'pipeline',
      pages: '228–300',
      topics: ['数据通路', '控制器', '性能', '流水线', '冒险', '转发']
    },
    {
      num: 8,
      title: '存储器和 I/O 系统',
      en: 'Memory & I/O',
      tagline: '把程序装进去，把世界接出来',
      blurb: '高速缓存、虚拟存储器、TLB 与中断。理解为什么 CPU 那么快，却总在等内存。',
      seed: '#2C7A3F',
      icon: 'cache',
      motif: 'cache',
      pages: '301–371',
      topics: ['存储层次', 'AMAT', '直接映射', '组相联', '虚拟存储器', 'TLB', 'I/O']
    },
    {
      num: 0,
      title: '速查台',
      en: 'Quick Reference',
      tagline: '公式、数据与指令，一页翻到',
      blurb: '把全书最常用的公式、门延迟、MIPS 指令编码、性能方程与术语压成可检索的速查卡。',
      seed: '#546A76',
      icon: 'index',
      motif: 'index',
      pages: '附录',
      topics: ['公式表', '指令表', '术语表', '数据速查']
    }
  ]
};

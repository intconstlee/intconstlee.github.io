window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q6-001',
    ch: 6,
    sec: 'ch6-isa',
    topic: 'ISA 的范畴',
    diff: 1,
    type: 'single',
    stem: '下列哪一项<b>不属于</b>指令集体系结构（ISA）规定的内容？',
    hint: '想想换一代 CPU 之后，哪些东西变了、哪些没变。',
    options: ['指令的二进制格式', '通用寄存器的数量与用途', '流水线的级数与转发通路', '寻址方式与内存模型'],
    answer: 2,
    explain: 'ISA 只规定程序员可见的抽象：指令格式、寄存器、寻址方式、内存模型。流水线级数、转发通路、缓存容量属于微体系结构，是同一 ISA 的不同实现方式。'
  },
  {
    id: 'q6-002',
    ch: 6,
    sec: 'ch6-isa',
    topic: 'ISA 与实现',
    diff: 1,
    type: 'tf',
    stem: '同一个 ISA 可以有多种不同的微体系结构实现。',
    answer: 1,
    explain: '正确。Intel i7、80486、AMD Athlon 都实现 x86，但数据通路、流水线级数、缓存大小各不相同。ISA 是契约，微体系结构是履约方式。'
  },
  {
    id: 'q6-003',
    ch: 6,
    sec: 'ch6-asm',
    topic: '指令长度',
    diff: 1,
    type: 'single',
    stem: 'MIPS 的一条机器指令占多少位？',
    options: ['8 位', '16 位', '32 位', '可变长，1 到 15 字节'],
    answer: 2,
    explain: 'MIPS 是定长指令集，R 型、I 型、J 型都是 32 位。定长让取指与译码简单，这也是它适合教学与流水线的原因。'
  },
  {
    id: 'q6-004',
    ch: 6,
    sec: 'ch6-asm',
    topic: 'I 型立即数宽度',
    diff: 1,
    type: 'fill',
    stem: 'MIPS 的 I 型指令中，立即数字段占多少位？（填十进制数）',
    placeholder: '填十进制数',
    accept: ['16', '16位', '十六'],
    explain: 'I 型共 32 位，由 op（6）+ rs（5）+ rt（5）+ 立即数（16）组成，所以立即数字段是 16 位。'
  },
  {
    id: 'q6-005',
    ch: 6,
    sec: 'ch6-regs',
    topic: '零寄存器',
    diff: 1,
    type: 'single',
    stem: '哪个寄存器恒为 0，且写入会被硬件忽略？',
    options: ['$zero', '$at', '$gp', '$ra'],
    answer: 0,
    explain: '$zero 就是 $0，硬件保证它读出恒为 0，对它的写入被丢弃。它常用来提供常数 0，例如 move $t0,$t1 展开后是 add $t0,$t1,$zero。'
  },
  {
    id: 'q6-006',
    ch: 6,
    sec: 'ch6-regs',
    topic: '保存寄存器',
    diff: 2,
    type: 'fill',
    stem: '$s0–$s7 这类保存寄存器在函数调用中由谁负责保存？（填“调用者”或“被调用者”）',
    placeholder: '调用者 / 被调用者',
    accept: ['被调用者', '被调函数', 'callee', '被调用者保存'],
    explain: '按 MIPS 约定，$s0–$s7 由被调用者保存：函数若使用了它们，必须先把原值存进栈帧，返回前恢复。$t0–$t9 则由调用者自己负责。'
  },
  {
    id: 'q6-007',
    ch: 6,
    sec: 'ch6-regs',
    topic: '临时寄存器',
    diff: 2,
    type: 'tf',
    stem: '$t0–$t9 是调用者保存的临时寄存器，被调用函数可以直接改写它们。',
    answer: 1,
    explain: '正确。$t 系列是 caller-saved，被调用者可以随意覆盖；调用者若在调用之后还要用这些值，必须自己在 jal 之前保存。'
  },
  {
    id: 'q6-008',
    ch: 6,
    sec: 'ch6-rtype',
    topic: 'R 型编码',
    diff: 1,
    type: 'fields',
    stem: '把 <code>add $t0, $s3, $s4</code> 的各字段填对，拼出 32 位机器码。',
    lab: {
      kind: 'mips-r',
      instruction: 'add $t0, $s3, $s4',
      fields: [
        { name: 'opcode', width: 6, value: '000000', hint: 'R 型恒为 0' },
        { name: 'rs', width: 5, value: '$s3', type: 'reg' },
        { name: 'rt', width: 5, value: '$s4', type: 'reg' },
        { name: 'rd', width: 5, value: '$t0', type: 'reg' },
        { name: 'shamt', width: 5, value: '00000', hint: '不移位填 0' },
        { name: 'funct', width: 6, value: '100000', hint: 'add 的 funct 是 0x20' }
      ],
      expected: '0x02744020'
    },
    explain: '$s3=19=10011，$s4=20=10100，$t0=8=01000，op=000000，shamt=0，funct=0x20=100000。拼接：000000 10011 10100 01000 00000 100000 = 0x02744020。'
  },
  {
    id: 'q6-009',
    ch: 6,
    sec: 'ch6-rtype',
    topic: 'sll 编码',
    diff: 2,
    type: 'fields',
    stem: '把 <code>sll $t0, $t1, 4</code> 编码成机器码。',
    lab: {
      kind: 'mips-r',
      instruction: 'sll $t0, $t1, 4',
      fields: [
        { name: 'opcode', width: 6, value: '000000', hint: 'R 型恒为 0' },
        { name: 'rs', width: 5, value: '$zero', type: 'reg', hint: '移位指令不用 rs，填 0' },
        { name: 'rt', width: 5, value: '$t1', type: 'reg' },
        { name: 'rd', width: 5, value: '$t0', type: 'reg' },
        { name: 'shamt', width: 5, value: '00100', hint: '左移 4 位' },
        { name: 'funct', width: 6, value: '000000', hint: 'sll 的 funct 是 0' }
      ],
      expected: '0x00094100'
    },
    explain: 'op=0，rs 不用（填 $zero 即 0），rt=$t1=9=01001，rd=$t0=8=01000，shamt=4=00100，funct=0。拼接得 000000 00000 01001 01000 00100 000000 = 0x00094100。移位量在 shamt，不在立即数位置。'
  },
  {
    id: 'q6-010',
    ch: 6,
    sec: 'ch6-rtype',
    topic: 'sub 编码',
    diff: 2,
    type: 'fill',
    stem: '把 <code>sub $t0, $t1, $t2</code> 编码成 8 位十六进制机器码（带 0x 前缀）。',
    placeholder: '0x________',
    accept: ['0x012A4022', '012A4022', '0x012a4022'],
    explain: 'op=000000，rs=$t1=9=01001，rt=$t2=10=01010，rd=$t0=8=01000，shamt=00000，funct=sub=0x22=100010。拼接：000000 01001 01010 01000 00000 100010 = 0x012A4022。'
  },
  {
    id: 'q6-011',
    ch: 6,
    sec: 'ch6-rtype',
    topic: 'funct 的作用',
    diff: 2,
    type: 'single',
    stem: 'R 型的 op 字段恒为 0，硬件靠哪个字段区分 add 与 sub？',
    options: ['rs', 'rt', 'shamt', 'funct'],
    answer: 3,
    explain: '两者的 op 都是 000000、字段布局完全相同，只有 funct 不同：add 是 0x20，sub 是 0x22，因此靠 funct 区分具体运算。'
  },
  {
    id: 'q6-012',
    ch: 6,
    sec: 'ch6-itype',
    topic: 'lw 编码',
    diff: 1,
    type: 'fields',
    stem: '把 <code>lw $t2, 12($sp)</code> 编码成机器码。',
    lab: {
      kind: 'mips-i',
      instruction: 'lw $t2, 12($sp)',
      fields: [
        { name: 'opcode', width: 6, value: '100011', hint: 'lw 的 opcode 是 0x23' },
        { name: 'rs', width: 5, value: '$sp', type: 'reg', hint: '基址寄存器' },
        { name: 'rt', width: 5, value: '$t2', type: 'reg', hint: '目标寄存器' },
        { name: 'immediate', width: 16, value: '0000000000001100', hint: '偏移量 12' }
      ],
      expected: '0x8FAA000C'
    },
    explain: 'op=lw=0x23=100011，rs=基址 $sp=29=11101，rt=目标 $t2=10=01010，立即数=12=0000000000001100。拼接：100011 11101 01010 0000 0000 0000 1100 = 0x8FAA000C。'
  },
  {
    id: 'q6-013',
    ch: 6,
    sec: 'ch6-itype',
    topic: 'sw 编码',
    diff: 2,
    type: 'fields',
    stem: '把 <code>sw $t0, 8($sp)</code> 编码成机器码。',
    lab: {
      kind: 'mips-i',
      instruction: 'sw $t0, 8($sp)',
      fields: [
        { name: 'opcode', width: 6, value: '101011', hint: 'sw 的 opcode 是 0x2B' },
        { name: 'rs', width: 5, value: '$sp', type: 'reg', hint: '基址寄存器' },
        { name: 'rt', width: 5, value: '$t0', type: 'reg', hint: '要写入的源寄存器' },
        { name: 'immediate', width: 16, value: '0000000000001000', hint: '偏移量 8' }
      ],
      expected: '0xAFA80008'
    },
    explain: 'op=sw=0x2B=101011，rs=$sp=29=11101，rt=$t0=8=01000，立即数=8=0000000000001000。拼接：101011 11101 01000 0000 0000 0000 1000 = 0xAFA80008。sw 与 lw 只差 opcode。'
  },
  {
    id: 'q6-014',
    ch: 6,
    sec: 'ch6-itype',
    topic: 'beq 编码',
    diff: 3,
    type: 'fields',
    stem: '把 <code>beq $s0, $s1, 3</code> 编码成机器码（偏移量以字为单位）。',
    lab: {
      kind: 'mips-i',
      instruction: 'beq $s0, $s1, 3',
      fields: [
        { name: 'opcode', width: 6, value: '000100', hint: 'beq 的 opcode 是 0x04' },
        { name: 'rs', width: 5, value: '$s0', type: 'reg' },
        { name: 'rt', width: 5, value: '$s1', type: 'reg' },
        { name: 'immediate', width: 16, value: '0000000000000011', hint: '偏移量 3 个字' }
      ],
      expected: '0x12110003'
    },
    explain: 'op=beq=0x04=000100，rs=$s0=16=10000，rt=$s1=17=10001，立即数=偏移量 3=0000000000000011。拼接：000100 10000 10001 0000 0000 0000 0011 = 0x12110003。这个 3 表示相对 PC+4 跳 3 个字。'
  },
  {
    id: 'q6-015',
    ch: 6,
    sec: 'ch6-itype',
    topic: '反汇编',
    diff: 2,
    type: 'fill',
    stem: '机器码 <code>0x11080005</code> 对应的汇编指令是什么？（两个操作数相同，偏移写十进制）',
    placeholder: 'beq $t0, $t0, ?',
    accept: ['beq $t0,$t0,5', 'beq $t0,$t0,0x5', 'beqt0,t0,5'],
    explain: '拆位：000100 01000 01000 0000000000000101。op=4 是 beq，rs=rt=8 都是 $t0，偏移 5。两个操作数恒相等，所以它等价于无条件跳转，目标为 PC+4 加 5 个字。'
  },
  {
    id: 'q6-016',
    ch: 6,
    sec: 'ch6-itype',
    topic: 'J 型指令',
    diff: 1,
    type: 'single',
    stem: '下列指令中采用 J 型格式的是？',
    options: ['add', 'lw', 'beq', 'jal'],
    answer: 3,
    explain: 'J 型只有 j 与 jal 两条，格式是 6 位 op 加 26 位目标地址。add 是 R 型，lw 与 beq 是 I 型。'
  },
  {
    id: 'q6-017',
    ch: 6,
    sec: 'ch6-arith',
    topic: '算术编程',
    diff: 1,
    type: 'mips',
    stem: '$a0、$a1、$a2、$a3 分别存放 a、b、c、d，把 (a+b) − (c+d) 的结果写入 $v0。',
    lab: {
      init: { regs: { a0: 7, a1: 3, a2: 2, a3: 5 } },
      expect: { regs: { v0: 3 } },
      maxSteps: 3000,
      starter: '# $a0=a, $a1=b, $a2=c, $a3=d\n# 把 (a+b)-(c+d) 存入 $v0\n',
      solution: 'add $t0, $a0, $a1\nadd $t1, $a2, $a3\nsub $v0, $t0, $t1'
    },
    explain: '$t0 = a+b = 10，$t1 = c+d = 7，$v0 = 10 − 7 = 3。注意目标寄存器写在最前面，sub 的两个源顺序不能反。'
  },
  {
    id: 'q6-018',
    ch: 6,
    sec: 'ch6-arith',
    topic: '移位实现乘法',
    diff: 2,
    type: 'mips',
    stem: '不用乘法指令，用移位与加法计算 3×$a0+5，结果写入 $v0。',
    lab: {
      init: { regs: { a0: 7 } },
      expect: { regs: { v0: 26 } },
      maxSteps: 3000,
      starter: '# $a0 = x，计算 3x+5 存入 $v0\n# 提示：3x = 2x + x\n',
      solution: 'sll $t0, $a0, 1\nadd $t0, $t0, $a0\naddi $v0, $t0, 5'
    },
    explain: '3x = 2x + x：sll 得到 2x = 14，加 x 得 21，再加 5 得 26。小常数乘法用移位加法比乘法指令更快，编译器也常这样优化。'
  },
  {
    id: 'q6-019',
    ch: 6,
    sec: 'ch6-arith',
    topic: '掩码与置位',
    diff: 2,
    type: 'mips',
    stem: '取 $a0 的低 4 位，再把第 4、5 位置 1，结果写入 $v0。',
    lab: {
      init: { regs: { a0: 0xA5 } },
      expect: { regs: { v0: 0x35 } },
      maxSteps: 3000,
      starter: '# $a0 = 0xA5\n# 先用 andi 取低 4 位，再用 ori 置位\n',
      solution: 'andi $t0, $a0, 0x0F\nori $v0, $t0, 0x30'
    },
    explain: '0xA5 &amp; 0x0F = 0x05，只留低 4 位；0x05 | 0x30 = 0x35 = 53，把第 4、5 位置 1。andi 与 ori 的立即数是零扩展，正好适合做位掩码。'
  },
  {
    id: 'q6-020',
    ch: 6,
    sec: 'ch6-arith',
    topic: 'slt 语义',
    diff: 2,
    type: 'single',
    stem: '执行 <code>slt $t0, $s1, $s2</code> 时若 $s1 &lt; $s2，$t0 的值是？',
    options: ['0', '1', '−1', '$s1 − $s2'],
    answer: 1,
    explain: 'slt 是 set on less than：rs &lt; rt 时把目标置 1，否则置 0。它不保存差值，也不产生标志位，只给一个 0/1 结果供分支使用。'
  },
  {
    id: 'q6-021',
    ch: 6,
    sec: 'ch6-arith',
    topic: '算术右移',
    diff: 3,
    type: 'single',
    stem: '−8 算术右移 1 位（<code>sra</code>）的结果是？',
    options: ['−4', '4', '0x7FFFFFFC', '−16'],
    answer: 0,
    explain: '−8 的位串是 0xFFFFFFF8，算术右移高位补符号位 1，得 0xFFFFFFFC，即 −4。若用 srl 逻辑右移补 0，就会得到 0x7FFFFFFC，那是一个很大的正数。'
  },
  {
    id: 'q6-022',
    ch: 6,
    sec: 'ch6-branch',
    topic: 'slt 与分支',
    diff: 2,
    type: 'mips',
    stem: '把 $a0 与 $a1 中较大的数写入 $v0。两个数都是有符号整数（可能为负），请用 slt 比较。',
    lab: {
      init: { regs: { a0: -5, a1: -9 } },
      expect: { regs: { v0: -5 } },
      maxSteps: 3000,
      starter: '# $a0 = -5, $a1 = -9\n# 用 slt 判断大小，把较大者存入 $v0\n',
      solution: 'slt $t0, $a0, $a1\nbeq $t0, $zero, takeA\nadd $v0, $zero, $a1\nj fin\ntakeA:\nadd $v0, $zero, $a0\nfin:'
    },
    explain: 'slt $t0,$a0,$a1 在 a0 &lt; a1 时给出 1，此时 a1 更大；否则 a0 更大。−5 与 −9 比较，−5 更大，所以结果为 −5。必须用有符号的 slt，不能用 sltu。'
  },
  {
    id: 'q6-023',
    ch: 6,
    sec: 'ch6-branch',
    topic: '循环求和',
    diff: 2,
    type: 'mips',
    stem: '用循环计算 1+2+…+n，n 存放在 $a0（正整数），和写入 $v0。',
    lab: {
      init: { regs: { a0: 10 } },
      expect: { regs: { v0: 55 } },
      maxSteps: 3000,
      starter: '# $a0 = n（正整数）\n# 计算 1+2+...+n 存入 $v0\n',
      solution: 'li $v0, 0\nli $t0, 1\nloop:\nadd $v0, $v0, $t0\naddi $t0, $t0, 1\nslt $t1, $a0, $t0\nbeq $t1, $zero, loop'
    },
    explain: '累加 1 到 n 后，i 变成 n+1，此时 slt(n, n+1) 为 1，beq 不跳转，循环结束。n=10 时和为 55。循环条件用“n &lt; i 就退出”，比每轮都判断更省一条跳转。'
  },
  {
    id: 'q6-024',
    ch: 6,
    sec: 'ch6-branch',
    topic: '位运算循环',
    diff: 3,
    type: 'mips',
    stem: '把 $a0 反复逻辑右移 1 位，直到它变成 0，统计移位次数并写入 $v0（$a0 为正整数）。',
    lab: {
      init: { regs: { a0: 13 } },
      expect: { regs: { v0: 4 } },
      maxSteps: 3000,
      starter: '# $a0 = 13\n# 反复 srl 直到 0，次数放入 $v0\n',
      solution: 'li $v0, 0\nloop:\nsrl $a0, $a0, 1\naddi $v0, $v0, 1\nbne $a0, $zero, loop'
    },
    explain: '13 → 6 → 3 → 1 → 0，共移位 4 次。每轮先移位再计数，用 bne 判断移位后的值是否已经为 0；为 0 时不再跳回，程序结束。'
  },
  {
    id: 'q6-025',
    ch: 6,
    sec: 'ch6-branch',
    topic: '分支基准地址',
    diff: 3,
    type: 'single',
    stem: 'beq 指令的 16 位偏移量是相对于哪个地址计算的？',
    options: ['当前指令的地址 PC', 'PC+4', '$ra 中的返回地址', '代码段的起始地址'],
    answer: 1,
    explain: '取指之后 PC 已经自动加了 4，硬件用“已更新的 PC”作基准，所以目标地址 = PC+4 + 偏移×4。若按当前 PC 算，每条分支都会偏 4 字节。'
  },
  {
    id: 'q6-026',
    ch: 6,
    sec: 'ch6-branch',
    topic: '伪指令辨别',
    diff: 2,
    type: 'tf',
    stem: '<code>blt</code> 是 MIPS 的真实机器指令，硬件直接支持。',
    answer: 0,
    explain: '错误。blt 是伪指令，汇编器把它展开成 slt 与 bne 两条真实指令（中间用 $at 暂存比较结果）。真实的条件分支只有 beq 与 bne。'
  }
);

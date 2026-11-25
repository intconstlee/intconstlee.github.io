window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.questions.push(
  {
    id: 'q6-027',
    ch: 6,
    sec: 'ch6-array',
    topic: '数组求和',
    diff: 2,
    type: 'mips',
    stem: '$a0 是数组首地址，$a1 是元素个数（至少 1 个），把全部元素之和写入 $v0。元素是 32 位有符号字。',
    lab: {
      init: { regs: { a0: 4096, a1: 5 }, memory: { 4096: [11, -7, 34, 0, 92] } },
      expect: { regs: { v0: 130 } },
      maxSteps: 3000,
      starter: '# $a0 = 数组首地址，$a1 = 元素个数\n# 求和存入 $v0\n# 地址 = 基址 + i*4\n',
      solution: 'li $t0, 0\nli $v0, 0\nloop:\nsll $t1, $t0, 2\nadd $t1, $t1, $a0\nlw $t2, 0($t1)\nadd $v0, $v0, $t2\naddi $t0, $t0, 1\nslt $t1, $t0, $a1\nbne $t1, $zero, loop'
    },
    explain: '11 + (−7) + 34 + 0 + 92 = 130。地址 = 基址 + i×4，用 sll 乘 4；i 从 0 递增到 n 时 slt(i, n) 变 0，循环自然结束。'
  },
  {
    id: 'q6-028',
    ch: 6,
    sec: 'ch6-array',
    topic: '数组就地修改',
    diff: 3,
    type: 'mips',
    stem: '$a0 是数组首地址，$a1 是元素个数（至少 1 个）。把每个元素乘以 2 写回原处，并把新元素之和写入 $v0。',
    lab: {
      init: { regs: { a0: 4096, a1: 4 }, memory: { 4096: [3, -2, 0, 7] } },
      expect: { regs: { v0: 16 }, memory: { 4096: [6, -4, 0, 14] } },
      maxSteps: 3000,
      starter: '# $a0 = 首地址，$a1 = 元素个数\n# 每个元素乘 2 写回，同时累加新值到 $v0\n',
      solution: 'li $t0, 0\nli $v0, 0\nloop:\nsll $t1, $t0, 2\nadd $t1, $t1, $a0\nlw $t2, 0($t1)\nsll $t2, $t2, 1\nsw $t2, 0($t1)\nadd $v0, $v0, $t2\naddi $t0, $t0, 1\nslt $t1, $t0, $a1\nbne $t1, $zero, loop'
    },
    explain: '3→6，−2→−4，0→0，7→14，内存变成 [6, −4, 0, 14]，和是 16。sw 必须写回同一个地址；sll 乘 2 对负数同样正确，因为补码左移就是乘 2。'
  },
  {
    id: 'q6-029',
    ch: 6,
    sec: 'ch6-array',
    topic: '数组地址',
    diff: 1,
    type: 'single',
    stem: '若 int 数组首地址存放在 $s0，则 a[i] 的地址是？',
    options: ['$s0 + i', '$s0 + 4×i', '4×$s0 + i', '$s0 + i/4'],
    answer: 1,
    explain: 'int 占 4 字节，元素之间相隔 4 字节，所以地址 = 基址 + 4i。汇编里常用 sll $t0,$t1,2 完成乘 4，再加基址。'
  },
  {
    id: 'q6-030',
    ch: 6,
    sec: 'ch6-array',
    topic: '下标缩放',
    diff: 1,
    type: 'fill',
    stem: '要把下标 i 换算成字数组的字节偏移，<code>sll $t0, $t1, ___</code> 中应填几？（填十进制数）',
    placeholder: '填十进制数',
    accept: ['2', '二'],
    explain: '每个元素 4 字节，4 = 2 的 2 次方，所以左移 2 位就是乘 4。若元素是半字则移 1 位，字节数组不用移。'
  },
  {
    id: 'q6-031',
    ch: 6,
    sec: 'ch6-array',
    topic: '访存与对齐',
    diff: 2,
    type: 'multi',
    stem: '关于 MIPS 的数组与访存，下列说法正确的有？',
    options: [
      '<code>lw</code> 的地址必须是 4 的倍数',
      '<code>lb</code> 读一个字节并按符号扩展装入寄存器',
      'int 数组相邻元素在内存中相差 1 字节',
      '<code>sll $t0,$t1,2</code> 相当于把下标乘 4',
      '半字（halfword）占 8 字节'
    ],
    answer: [0, 1, 3],
    explain: 'lw 要求字对齐；lb 做符号扩展（lbu 才是零扩展）；int 相邻元素差 4 字节而不是 1；sll 左移 2 位等于乘 4；半字是 2 字节。所以正确项是第 1、2、4 项。'
  },
  {
    id: 'q6-032',
    ch: 6,
    sec: 'ch6-call',
    topic: 'jal 调用',
    diff: 2,
    type: 'mips',
    stem: '写一个函数 triple，返回 3×参数+1。主程序用 $a0 传参并调用它，结果留在 $v0。',
    lab: {
      init: { regs: { a0: 6 } },
      expect: { regs: { v0: 19 } },
      maxSteps: 3000,
      starter: '# $a0 = 6\n# 函数 triple 返回 3*$a0+1\n# 主程序用 jal 调用它\n',
      solution: '    j    main\ntriple:\n    sll  $t0, $a0, 1\n    add  $t0, $t0, $a0\n    addi $v0, $t0, 1\n    jr   $ra\nmain:\n    jal  triple'
    },
    explain: '3×6+1 = 19。jal 把返回地址存入 $ra，函数用 jr $ra 返回。函数只用 $t 寄存器，没有内层调用，所以不必建栈帧。'
  },
  {
    id: 'q6-033',
    ch: 6,
    sec: 'ch6-call',
    topic: '递归与栈帧',
    diff: 3,
    type: 'mips',
    stem: '用递归计算 1+2+…+n：sum(n) = n + sum(n−1)，sum(0) = 0。n 在 $a0，结果写入 $v0。',
    lab: {
      init: { regs: { a0: 6 } },
      expect: { regs: { v0: 21 } },
      maxSteps: 3000,
      starter: '# $a0 = 6\n# 递归函数 sum(n) = n + sum(n-1)，sum(0) = 0\n# 每次调用都要保存 $ra 与 n\n',
      solution: '    j    main\nrsum:\n    addi $sp, $sp, -8\n    sw   $ra, 4($sp)\n    sw   $a0, 0($sp)\n    beq  $a0, $zero, base\n    addi $a0, $a0, -1\n    jal  rsum\n    lw   $a0, 0($sp)\n    lw   $ra, 4($sp)\n    addi $sp, $sp, 8\n    add  $v0, $v0, $a0\n    jr   $ra\nbase:\n    li   $v0, 0\n    lw   $ra, 4($sp)\n    addi $sp, $sp, 8\n    jr   $ra\nmain:\n    jal  rsum'
    },
    explain: 'sum(6) = 6+5+4+3+2+1 = 21。每层调用都要把 $ra 与 n 存进栈帧，否则内层 jal 会覆盖返回地址；栈向低地址增长，分配用 addi $sp,$sp,-8，恢复时再加回。'
  },
  {
    id: 'q6-034',
    ch: 6,
    sec: 'ch6-call',
    topic: '调用流程排序',
    diff: 2,
    type: 'order',
    stem: '按一次函数调用的先后顺序，排列下列步骤。',
    lab: {
      items: [
        '调用者把参数放入 $a0–$a3',
        '执行 jal，硬件把返回地址存入 $ra',
        '被调用者下移 $sp 分配栈帧，保存 $ra 与用到的 $s',
        '执行函数体',
        '返回值放入 $v0',
        '恢复 $s 与 $ra，$sp 上移回原位',
        '执行 jr $ra 返回调用点'
      ],
      prompt: '从传参到返回，按真实执行顺序排列'
    },
    explain: '先传参再 jal；被调用者建帧保存现场，执行完把返回值放 $v0，恢复现场后用 jr $ra 回到调用点。顺序错了就会出现返回地址被覆盖或栈不平衡。'
  },
  {
    id: 'q6-035',
    ch: 6,
    sec: 'ch6-call',
    topic: '保存 $ra',
    diff: 1,
    type: 'single',
    stem: '递归函数为什么必须把 $ra 保存到栈中？',
    options: ['jal 会覆盖 $ra，内层调用会破坏外层的返回地址', '$ra 是只读寄存器，只能存不能读', '$ra 由调用者保存，被调用者不能碰', '不保存 $ra 就无法给 $v0 赋值'],
    answer: 0,
    explain: 'jal 每次执行都会把新的返回地址写进 $ra。递归时内层调用会覆盖外层的返回地址，所以外层必须在调用前把 $ra 存进自己的栈帧，返回前再取回。'
  },
  {
    id: 'q6-036',
    ch: 6,
    sec: 'ch6-call',
    topic: '返回地址寄存器',
    diff: 1,
    type: 'fill',
    stem: '执行 <code>jal</code> 时，硬件把返回地址存入哪个寄存器？（写寄存器名，带 $ 前缀）',
    placeholder: '$__',
    accept: ['$ra', 'ra', '$31'],
    explain: 'jal 把 jal 的下一条指令地址写入 $ra（即 $31），函数结束时用 jr $ra 返回调用点。'
  },
  {
    id: 'q6-037',
    ch: 6,
    sec: 'ch6-call',
    topic: '叶子函数',
    diff: 3,
    type: 'tf',
    stem: '一个不调用其他函数、也不递归的叶子函数，同样必须把 $ra 保存到栈中。',
    answer: 0,
    explain: '错误。叶子函数内部没有 jal，$ra 不会被覆盖，可以直接 jr $ra 返回，不需要为保存 $ra 建栈帧（若用到 $s 寄存器，仍需保存它们）。'
  },
  {
    id: 'q6-038',
    ch: 6,
    sec: 'ch6-addr',
    topic: '寻址方式配对',
    diff: 2,
    type: 'match',
    stem: '把五种寻址方式与它们的有效地址计算配对。',
    lab: {
      pairs: [
        ['寄存器寻址', '操作数就在寄存器里，如 add $t0,$t1,$t2'],
        ['立即数寻址', '操作数是指令中的 16 位常数，如 addi $t0,$t1,5'],
        ['基址偏移', 'EA = 基址寄存器 + 偏移，如 lw $t0,8($s1)'],
        ['PC 相对', 'EA = PC+4 + 偏移×4，如 beq $s0,$s1,L'],
        ['伪直接', 'EA = PC+4 高 4 位 ‖ 26 位字段 ‖ 00，如 j L']
      ]
    },
    explain: '寄存器与立即数寻址的操作数不在内存里，不需要算地址；基址偏移是寄存器加常数；PC 相对以 PC+4 为基准再乘 4；伪直接拼的是 (PC+4) 的高 4 位与 26 位字段。'
  },
  {
    id: 'q6-039',
    ch: 6,
    sec: 'ch6-addr',
    topic: '基址偏移',
    diff: 1,
    type: 'single',
    stem: '指令 <code>lw $t0, 8($s1)</code> 的有效地址是？',
    options: ['$s1 + 8', '$s1 + 32', 'PC + 4 + 8', '$s1'],
    answer: 0,
    explain: '这是基址偏移寻址：基址寄存器 $s1 加上符号扩展后的 8 就是有效地址，与 PC 无关。只有分支指令才用 PC 相对。'
  },
  {
    id: 'q6-040',
    ch: 6,
    sec: 'ch6-addr',
    topic: 'j 的寻址',
    diff: 2,
    type: 'single',
    stem: '指令 <code>j L</code> 使用哪种寻址方式？',
    options: ['寄存器寻址', '立即数寻址', 'PC 相对寻址', '伪直接寻址'],
    answer: 3,
    explain: 'j 的目标地址由 (PC+4) 的高 4 位、指令中的 26 位字段和末尾的 00 拼接而成，称为伪直接寻址；它只在当前 256 MB 区域内有效。'
  },
  {
    id: 'q6-041',
    ch: 6,
    sec: 'ch6-addr',
    topic: '末尾补零',
    diff: 3,
    type: 'fill',
    stem: 'j 指令把 26 位字段左移后与 PC+4 的高 4 位拼接，左移时末尾补几个 0？（填十进制数）',
    placeholder: '填十进制数',
    accept: ['2', '二'],
    explain: '26 位字段是字地址的低 26 位，字地址乘 4 才变成字节地址，乘 4 等于左移 2 位，所以末尾补 2 个 0。拼接后共 28 位，再加高 4 位就是完整 32 位地址。'
  },
  {
    id: 'q6-042',
    ch: 6,
    sec: 'ch6-toolchain',
    topic: '工具链顺序',
    diff: 2,
    type: 'order',
    stem: '按程序从源码到运行的先后顺序，排列下列四个阶段。',
    lab: {
      items: [
        '编译：C 源码变成汇编',
        '汇编：汇编代码变成机器码目标文件',
        '链接：合并目标文件与库，确定最终地址',
        '装入：可执行文件放进内存并设置 PC'
      ],
      prompt: '从源码到跑起来，按顺序排列'
    },
    explain: '编译把 C 变成汇编，汇编把汇编变成机器码目标文件，链接合并目标文件与库并定地址，装入把可执行文件放进内存、设置 PC 后开始执行。'
  },
  {
    id: 'q6-043',
    ch: 6,
    sec: 'ch6-toolchain',
    topic: '内存映射',
    diff: 2,
    type: 'single',
    stem: '在 MIPS 的内存映射中，程序代码段（text）的起始地址是？',
    options: ['0x00000000', '0x00400000', '0x10010000', '0x7FFFFFFC'],
    answer: 1,
    explain: '0x00000000 是保留区（异常入口等），0x00400000 是代码段，0x10010000 是静态数据段，0x7FFFFFFC 附近是栈顶。'
  },
  {
    id: 'q6-044',
    ch: 6,
    sec: 'ch6-toolchain',
    topic: '栈的增长方向',
    diff: 1,
    type: 'fill',
    stem: 'MIPS 的栈向哪个方向增长？（填“高”或“低”）',
    placeholder: '高 / 低',
    accept: ['低', '低地址', '向低地址', '向下'],
    explain: '栈从高地址 0x7FFFFFFC 开始，向低地址增长，所以分配栈帧是 addi $sp,$sp,-8，释放时再加回来。堆则相反，向高地址增长。'
  },
  {
    id: 'q6-045',
    ch: 6,
    sec: 'ch6-toolchain',
    topic: '汇编器的职责',
    diff: 2,
    type: 'multi',
    stem: '下列哪些工作是汇编器（assembler）完成的？',
    options: [
      '把标签换算成地址并计算分支偏移',
      '把伪指令展开成真实指令',
      '把可执行文件装入内存并设置 PC',
      '生成带重定位信息的目标文件',
      '把 C 源码翻译成汇编'
    ],
    answer: [0, 1, 3],
    explain: '装入是 loader 的工作，C 到汇编是编译器的工作。汇编器负责标签与偏移、伪指令展开、生成含重定位信息的目标文件；链接器再做合并与最终定址。'
  },
  {
    id: 'q6-046',
    ch: 6,
    sec: 'ch6-pseudo',
    topic: '伪指令求绝对值',
    diff: 3,
    type: 'mips',
    stem: '求 $a0 的绝对值并写入 $v0（$a0 可能为负数）。',
    hint: '可以借助 move、blt 等伪指令，别忘了 $zero 恒为 0。',
    lab: {
      init: { regs: { a0: -37 } },
      expect: { regs: { v0: 37 } },
      maxSteps: 3000,
      starter: '# $a0 = -37\n# 把绝对值存入 $v0，可用 move 与 blt\n',
      solution: '    move $v0, $a0\n    blt  $a0, $zero, neg\n    j    fin\nneg:\n    sub  $v0, $zero, $a0\nfin:'
    },
    explain: 'move 展开为 add $v0,$a0,$zero，blt 展开为 slt 加 bne。−37 为负，走 neg 分支，用 0 − (−37) = 37 得到绝对值。'
  },
  {
    id: 'q6-047',
    ch: 6,
    sec: 'ch6-pseudo',
    topic: 'li 的展开',
    diff: 2,
    type: 'single',
    stem: '<code>li $t0, 0x12345678</code> 会被汇编器展开成哪一组指令？',
    options: ['lui 装高 16 位，ori 补低 16 位', 'lw $t0,0x12345678', 'addi $t0,$zero,0x12345678', '两条 sll 指令'],
    answer: 0,
    explain: 'li 装 32 位常数时，先用 lui 把高 16 位放进目标寄存器（低 16 位清零），再用 ori 或上低 16 位。addi 的立即数只有 16 位，装不下 0x12345678。'
  },
  {
    id: 'q6-048',
    ch: 6,
    sec: 'ch6-pseudo',
    topic: '异常现场',
    diff: 2,
    type: 'fill',
    stem: 'MIPS 发生异常时，硬件把出错指令的地址保存在哪个寄存器？（写缩写即可）',
    placeholder: '三个字母',
    accept: ['EPC', 'epc'],
    explain: '异常发生时硬件把出错指令地址写入 EPC（异常程序计数器），处理完执行 eret 就回到 EPC 处继续。异常处理程序的入口固定为 0x80000180。'
  },
  {
    id: 'q6-049',
    ch: 6,
    sec: 'ch6-pseudo',
    topic: '异常的来源',
    diff: 2,
    type: 'multi',
    stem: '下列哪些事件会触发异常？',
    options: ['算术溢出', '取指时遇到非法指令', '访问越界或未对齐的地址', 'C 源程序少写了一个分号', '程序运行时间超过预期'],
    answer: [0, 1, 2],
    explain: '溢出、非法指令、地址越界都是运行期由硬件检测到的异常；少写分号是编译期错误，根本生成不了机器码；运行时间长短不是异常。'
  },
  {
    id: 'q6-050',
    ch: 6,
    sec: 'ch6-signed',
    topic: 'sltu 比较',
    diff: 3,
    type: 'single',
    stem: '设 $s1 = −1（位串 0xFFFFFFFF），$s2 = 1，执行 <code>sltu $t0, $s1, $s2</code> 后 $t0 是？',
    options: ['0', '1', '0xFFFFFFFF', '−1'],
    answer: 0,
    explain: 'sltu 按无符号比较：0xFFFFFFFF = 4294967295，不小于 1，所以结果为 0。若用 slt 按补码比较，−1 &lt; 1，结果会是 1。'
  },
  {
    id: 'q6-051',
    ch: 6,
    sec: 'ch6-signed',
    topic: '立即数扩展',
    diff: 2,
    type: 'fill',
    stem: 'addi 的 16 位立即数在参与运算前要做哪种扩展？（填“符号”或“零”）',
    placeholder: '符号 / 零',
    accept: ['符号', '符号扩展', 'sign', '有符号'],
    explain: 'addi、lw/sw 的偏移、分支偏移都要做符号扩展：最高位复制到高 16 位。只有 andi、ori、xori 这类逻辑立即数指令才做零扩展。'
  },
  {
    id: 'q6-052',
    ch: 6,
    sec: 'ch6-signed',
    topic: '有符号与无符号',
    diff: 3,
    type: 'multi',
    stem: '关于有符号与无符号指令，下列说法正确的有？',
    options: [
      'addi 的立即数总是符号扩展',
      'addiu 会检测溢出并触发异常',
      'slt 把操作数按补码比较',
      'mult 与 multu 对同一对位串的结果总相同',
      '比较无符号大小时应使用 sltu'
    ],
    answer: [0, 2, 4],
    explain: 'addiu 与 add 的区别正是不报溢出（addiu 也会回绕），所以第二项错；mult 与 multu 对同一对位串得到的 64 位乘积不同，第四项错；其余三项正确。'
  },
  {
    id: 'q6-053',
    ch: 6,
    sec: 'ch6-x86',
    topic: 'x86 指令长度',
    diff: 1,
    type: 'single',
    stem: 'x86 指令的长度是？',
    options: ['固定 32 位', '固定 16 位', '可变长，1 到 15 字节', '可变长，1 到 4 字节'],
    answer: 2,
    explain: 'x86 是 CISC，指令变长，典型长度 1 到 15 字节；MIPS 则是定长 32 位。变长指令省代码空间，但取指与译码更复杂。'
  },
  {
    id: 'q6-054',
    ch: 6,
    sec: 'ch6-x86',
    topic: 'x86 的性能来源',
    diff: 2,
    type: 'single',
    stem: '现代 x86 处理器为什么没有因为指令复杂而变慢？',
    options: ['把复杂指令译码成类 RISC 的微操作，再乱序执行', '把所有指令都改成定长 32 位', '取消了流水线，改用单周期执行', '把通用寄存器增加到 32 个'],
    answer: 0,
    explain: '前端把 CISC 指令翻译成简单的微操作，后端用乱序、超标量、深流水线执行。ISA 仍是 CISC，微体系结构却是 RISC 式的。'
  },
  {
    id: 'q6-055',
    ch: 6,
    sec: 'ch6-x86',
    topic: 'x86 寄存器数量',
    diff: 1,
    type: 'fill',
    stem: '32 位 x86 体系结构中有多少个通用寄存器？（填十进制数）',
    placeholder: '填十进制数',
    accept: ['8', '8个', '八'],
    explain: '32 位 x86 有 8 个通用寄存器（EAX、EBX、ECX、EDX、ESI、EDI、EBP、ESP），而 MIPS 有 32 个。寄存器少，访存就多，这是 x86 与 RISC 的一个明显差别。'
  }
);

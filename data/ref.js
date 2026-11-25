window.DATA = window.DATA || { sections: {}, questions: [] };

window.DATA.sections[0] = {
  num: 0,
  intro: '全书公式、数据、指令与术语的速查台：按主题查表，按公式套算。',
  sections: [
    {
      id: 'ref-num',
      num: '1.3–1.4',
      title: '数制与补码速查',
      lead: '换基靠分组，求负靠取反加一。',
      tag: '基础',
      blocks: [
        { t: 'p', html: '数制换算只记两条：<b>二进制与十六进制是分组替换</b>（1 位十六进制 = 4 位二进制，1 字节 = 2 位十六进制，不涉及算术）；<b>十进制才需要按权展开或除基取余</b>。补码只记一条：最高位带负权 −2<sup>N−1</sup>，其余位仍是正权，所以“取反加一”与“模 2<sup>N</sup> 相减”是同一件事。' },
        { t: 'table', title: '2 的幂与量级', head: ['幂', '值', '幂', '值'], rows: [
          ['2<sup>0</sup>', '1', '2<sup>8</sup>', '256'],
          ['2<sup>4</sup>', '16', '2<sup>10</sup>', '1024（1 K）'],
          ['2<sup>5</sup>', '32', '2<sup>12</sup>', '4096（4 K）'],
          ['2<sup>6</sup>', '64', '2<sup>16</sup>', '65536（64 K）'],
          ['2<sup>7</sup>', '128', '2<sup>20</sup>', '1048576（1 M）'],
          ['2<sup>30</sup>', '1073741824（1 G）', '2<sup>32</sup>', '4294967296（4 G）']
        ], caption: '记 2<sup>10</sup> ≈ 10<sup>3</sup>：1 K 与 1000 只差 2.4%，估算时可直接替换，但算容量时必须用 1024。' },
        { t: 'kv', title: '宽度与单位', items: [
          { k: '位（bit）', v: '1 位，2 种取值，信息量 log<sub>2</sub>2 = 1 位' },
          { k: '半字节（nibble）', v: '4 位 = 1 位十六进制，16 种取值' },
          { k: '字节（byte）', v: '8 位 = 2 位十六进制，256 种取值；存储器按字节编址' },
          { k: '字（word）', v: '32 位 = 4 字节 = 8 位十六进制（本书 MIPS）' },
          { k: 'K / M / G', v: '2<sup>10</sup> / 2<sup>20</sup> / 2<sup>30</sup>，即 1024 / 1048576 / 1073741824' }
        ] },
        { t: 'formula', html: 'A = −a<sub>N−1</sub>·2<sup>N−1</sup> + Σ<sub>i=0</sub><sup>N−2</sup> a<sub>i</sub>·2<sup>i</sup>，求 −A 即“各位取反再加 1”。', note: 'N 位补码范围 −2<sup>N−1</sup> ~ 2<sup>N−1</sup>−1；N 位无符号范围 0 ~ 2<sup>N</sup>−1。例：8 位补码 −128~127，16 位 −32768~32767。' },
        { t: 'table', title: '四种有符号表示（N 位）', head: ['方案', '负数表示', '范围', '代价'], rows: [
          ['符号-幅值', '最高位为符号位，其余为幅值', '−(2<sup>N−1</sup>−1) ~ 2<sup>N−1</sup>−1', '有 +0 与 −0，加减要分情况'],
          ['反码', '各位取反', '−(2<sup>N−1</sup>−1) ~ 2<sup>N−1</sup>−1', '有 ±0，加法需循环进位'],
          ['补码', '各位取反再加 1', '−2<sup>N−1</sup> ~ 2<sup>N−1</sup>−1', '只有一个 0，加减统一'],
          ['偏移', '加偏移量 2<sup>N−1</sup>', '由位数与偏移量决定', '多用于浮点数的指数']
        ] },
        { t: 'key', title: '补码四条实用规则', items: [
          '<b>范围</b>：<code>1000…0</code> 是最小负数 −2<sup>N−1</sup>，<code>0111…1</code> 是最大正数 2<sup>N−1</sup>−1。',
          '<b>符号扩展</b>：扩宽时把最高位复制到新增高位；8 位 <code>11010110</code>（−42）扩成 16 位是 <code>1111111111010110</code>。',
          '<b>零扩展</b>：无符号数扩宽时高位补 0；<code>lbu</code>、<code>lhu</code>、<code>andi</code>、<code>ori</code> 用的都是零扩展。',
          '<b>溢出</b>：两个同号数相加，结果符号与操作数不同即溢出；硬件判据是“最高位进位 ⊕ 次高位进位”。'
        ] },
        { t: 'table', title: '十六进制数字对照', head: ['十六进制', '十进制', '二进制', '十六进制', '十进制', '二进制'], rows: [
          ['0', '0', '0000', '8', '8', '1000'],
          ['1', '1', '0001', '9', '9', '1001'],
          ['2', '2', '0010', 'A', '10', '1010'],
          ['3', '3', '0011', 'B', '11', '1011'],
          ['4', '4', '0100', 'C', '12', '1100'],
          ['5', '5', '0101', 'D', '13', '1101'],
          ['6', '6', '0110', 'E', '14', '1110'],
          ['7', '7', '0111', 'F', '15', '1111']
        ] },
        { t: 'warn', title: '三个高频错误', html: '<b>①</b>把 <code>10000000</code> 当成 −0：它是 −128，而 −128 的相反数在 8 位内不存在（+128 溢出），取反加一后仍是原码。<b>②</b>符号扩展时补 0：8 位 <code>11010110</code> 若高位补 0 就变成 +214，必须补 1。<b>③</b>把 <code>1111</code> 一律当 15：作为补码它是 −1，比较大小要用 <code>slt</code>（有符号）而不是 <code>sltu</code>。' }
      ]
    },
    {
      id: 'ref-gate',
      num: '1.5',
      title: '逻辑门速查',
      lead: '八个门，两套通用门，一条优先级。',
      tag: '基础',
      blocks: [
        { t: 'p', html: '逻辑门把连续的电压压成 0/1，行为由真值表或布尔式唯一确定。本书采用<b>正逻辑</b>：高电压为 1，0 V 为 0；1、TRUE、HIGH 三者等价，0、FALSE、LOW 三者等价。' },
        { t: 'table', title: '八个基本门', head: ['门', '布尔式', '真值要点', '口诀'], rows: [
          ['NOT', 'Y = <span class="ovl">A</span>', '0→1，1→0', '取反'],
          ['缓冲器', 'Y = A', '输出跟随输入', '增强驱动'],
          ['AND', 'Y = A·B', '两个都为 1 才为 1', '有 0 出 0'],
          ['OR', 'Y = A+B', '有一个 1 就为 1', '有 1 出 1'],
          ['NAND', 'Y = <span class="ovl">A·B</span>', '两个都为 1 时出 0', '有 0 出 1'],
          ['NOR', 'Y = <span class="ovl">A+B</span>', '两个都为 0 时出 1', '全 0 出 1'],
          ['XOR', 'Y = A⊕B', '两个不同才为 1', '不同出 1'],
          ['XNOR', 'Y = <span class="ovl">A⊕B</span>', '两个相同就为 1', '相同出 1']
        ] },
        { t: 'table', title: '只用 NAND 实现', head: ['目标', '接法', '门数'], rows: [
          ['NOT', '两个输入并接到 A', '1'],
          ['AND', '先 A NAND B，再让该输出自己 NAND 自己', '2'],
          ['OR', 'A、B 各自先并接成非，再送入 NAND', '3'],
          ['NOR', '按 OR 接法得到或，再并接取反', '4'],
          ['XOR', '4 个 NAND：N1=AB 的与非，N2=A·N1 的与非，N3=B·N1 的与非，Y=N2 NAND N3', '4']
        ], caption: 'NAND 与 NOR 都是通用门：任选其一就能实现任何逻辑函数，这正是 CMOS 里 NAND 用得最多的原因。' },
        { t: 'formula', html: 'A⊕B = A<span class="ovl">B</span> + <span class="ovl">A</span>B = (A+B)(<span class="ovl">A</span>+<span class="ovl">B</span>) = (<span class="ovl">AB</span>)(A+B)', note: '异或即“模 2 加”：1 的个数为奇数时输出 1，因此它是全加器与奇偶校验的核心。自反性 A⊕B⊕B = A。' },
        { t: 'note', title: '多输入门与优先级', html: 'AND/OR 可扩展到任意多输入；XOR 的多输入含义是“1 的个数为奇数则输出 1”。运算优先级固定为 <b>NOT &gt; AND &gt; OR</b>，所以 <span class="ovl">A</span>B + C 是 (<span class="ovl">A</span>·B) + C，不是 <span class="ovl">A(B+C)</span>——写复杂式子一律加括号。' },
        { t: 'warn', title: '别把“取反”记错位置', html: 'NAND 不是“两个输入各自取反再相与”：那会得到 <span class="ovl">A</span>·<span class="ovl">B</span> = <span class="ovl">A+B</span>，正好是 NOR 的输出。NAND 是“先与再非”，由德摩根等于 <span class="ovl">A</span> + <span class="ovl">B</span>，即“输入取反后相或”。记法：圈画在输出端表示整体取反；把圈移到输入端时，门也要同时换成对偶门。' }
      ]
    },
    {
      id: 'ref-cmos',
      num: '1.6–1.7',
      title: 'CMOS 与电气参数',
      lead: '噪声容限决定能不能级联，电容决定快慢与功耗。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '数字抽象能成立，靠的是一条承诺：任何有效输入都产生有效输出，即<b>静态约束</b> V<sub>OL</sub> &lt; V<sub>IL</sub> 且 V<sub>OH</sub> &gt; V<sub>IH</sub>。满足它，门才能可靠级联，噪声才被一级级“再生”掉。' },
        { t: 'table', title: '四个逻辑电平参数', head: ['参数', '含义', '方向要求'], rows: [
          ['V<sub>OL</sub>', '输出低电平的上限', '越小越好'],
          ['V<sub>OH</sub>', '输出高电平的下限', '越大越好'],
          ['V<sub>IL</sub>', '被识别为低电平的输入上限', '越大越好（容限更宽）'],
          ['V<sub>IH</sub>', '被识别为高电平的输入下限', '越小越好（容限更宽）']
        ], caption: 'V<sub>IL</sub> 与 V<sub>IH</sub> 之间是禁止区域，落在其中的输入，接收端行为不可预测。' },
        { t: 'formula', html: 'NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>，NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>', note: '噪声容限是“加在最坏输出上仍能被正确识别”的最大噪声。工程上常在传输特性的单位增益点（斜率为 −1 处）选取 V<sub>IL</sub>、V<sub>IH</sub>，此时容限最大。' },
        { t: 'example', title: '例：5 V 工艺的容限', html: 'V<sub>IL</sub>=1.35 V、V<sub>IH</sub>=3.15 V、V<sub>OL</sub>=0.33 V、V<sub>OH</sub>=3.84 V。则 NM<sub>L</sub>=1.35−0.33=1.02 V，NM<sub>H</sub>=3.84−3.15=0.69 V。若叠加 1 V 噪声：低电平仍可识别（1.02 &gt; 1），高电平则失效（3.84−1=2.84 V &lt; 3.15 V）。' },
        { t: 'table', title: '两种晶体管', head: ['类型', '导通条件', '导通时强传', '关闭条件'], rows: [
          ['nMOS', '栅极为高（V<sub>GS</sub> &gt; V<sub>t</sub>）', '强 0，把输出拉到 GND', '栅极为低'],
          ['pMOS', '栅极为低（V<sub>GS</sub> &lt; V<sub>t</sub>）', '强 1，把输出拉到 V<sub>DD</sub>', '栅极为高']
        ], caption: 'nMOS 传 1 会损失一个阈值电压，pMOS 传 0 会损失一个阈值电压；要传完整摆幅就用两者并联（传输门）。' },
        { t: 'table', title: 'CMOS 门的上拉与下拉', head: ['门', 'PDN（nMOS）', 'PUN（pMOS）', '输出'], rows: [
          ['NAND2', 'A 与 B 串联', 'A 与 B 并联', '<span class="ovl">A·B</span>'],
          ['NOR2', 'A 与 B 并联', 'A 与 B 串联', '<span class="ovl">A+B</span>'],
          ['AND2', 'NAND 后接反相器', '——', 'A·B'],
          ['OR2', 'NOR 后接反相器', '——', 'A+B']
        ], caption: 'PUN 与 PDN 严格对偶：PDN 串联对应 PUN 并联。串联 pMOS 会拖慢上拉，所以同等扇入下 NAND 比 NOR 快。' },
        { t: 'formula', html: 'P<sub>dyn</sub> = ½·C·V<sub>DD</sub><sup>2</sup>·f，P<sub>static</sub> = V<sub>DD</sub>·I<sub>leak</sub>', note: 'f 是节点翻转频率；并非每周期都翻转时用活动因子 α 写成 αCV<sub>DD</sub><sup>2</sup>f。CMOS 门静态时总有一个晶体管截止，故静态功耗只有泄漏。' },
        { t: 'warn', title: '功耗的四个误区', html: '①动态功耗与 V<sub>DD</sub> <b>平方</b>成正比，降电压最有效；②它与<b>翻转的节点电容</b>成正比，与晶体管总数不成正比；③时钟树每周期都翻转，常常是动态功耗大户，门控时钟能显著省电；④工艺缩小后动态功耗下降，<b>泄漏功耗上升</b>，两者要权衡。' }
      ]
    },
    {
      id: 'ref-bool',
      num: '2.3',
      title: '布尔代数定理',
      lead: '与或成对，德摩根一推，式子就短了。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '布尔代数的公理与定理几乎都<b>成对出现</b>：把“与”和“或”互换、0 和 1 互换，等式依然成立，这叫对偶原理。所以只需证明一半，另一半自动成立。' },
        { t: 'table', title: '公理与单变量定理', head: ['名称', '与形式', '或形式'], rows: [
          ['零元', 'B·0 = 0', 'B+1 = 1'],
          ['同一', 'B·1 = B', 'B+0 = B'],
          ['幂等', 'B·B = B', 'B+B = B'],
          ['互补', 'B·<span class="ovl">B</span> = 0', 'B+<span class="ovl">B</span> = 1'],
          ['双重否定', '对 B 连取两次反得 B', '同左']
        ] },
        { t: 'table', title: '多变量定理', head: ['名称', '与形式', '或形式'], rows: [
          ['交换', 'B·C = C·B', 'B+C = C+B'],
          ['结合', '(BC)D = B(CD)', '(B+C)+D = B+(C+D)'],
          ['分配', 'B(C+D) = BC + BD', 'B+CD = (B+C)(B+D)'],
          ['合并', 'BC + B<span class="ovl">C</span> = B', '(B+C)(B+<span class="ovl">C</span>) = B'],
          ['吸收', 'B + BC = B', 'B(B+C) = B'],
          ['消去', 'B(<span class="ovl">B</span>+C) = BC', 'B + <span class="ovl">B</span>C = B + C'],
          ['德摩根', '<span class="ovl">B·C</span> = <span class="ovl">B</span> + <span class="ovl">C</span>', '<span class="ovl">B+C</span> = <span class="ovl">B</span>·<span class="ovl">C</span>']
        ] },
        { t: 'formula', html: '<span class="ovl">A·B</span> = <span class="ovl">A</span> + <span class="ovl">B</span>，<span class="ovl">A+B</span> = <span class="ovl">A</span>·<span class="ovl">B</span>', note: '电路上的含义是“推气泡”：把输出端的圈推到输入端，同时把与门换成或门（或反之），每条输入都要加圈。' },
        { t: 'table', title: '化简最常用的四招', head: ['工具', '形式', '什么时候用'], rows: [
          ['合并', 'BC + B<span class="ovl">C</span> = B', '同一个变量以互补形式出现两次'],
          ['吸收', 'A + AB = A', '某一项完全被另一项包含'],
          ['消去', 'A + <span class="ovl">A</span>B = A + B', '反变量项被“吸收”进另一项'],
          ['冗余项', 'AB + <span class="ovl">A</span>C + BC = AB + <span class="ovl">A</span>C', 'BC 是多余项，删掉可消除毛刺']
        ], caption: '先合并同类项，再找能吸收/消去的项，最后检查是否有冗余项（尤其做时序电路时）。' },
        { t: 'example', title: '例：合并同类项', html: 'Y = <span class="ovl">A</span>BC + A<span class="ovl">B</span>C + AB<span class="ovl">C</span> + ABC。先把后两项合并：AB(<span class="ovl">C</span>+C) = AB；再把前两项合并：C(<span class="ovl">A</span>B + A<span class="ovl">B</span>) = C(A⊕B)；于是 Y = AB + C(A⊕B)，它等于 AB + AC + BC。三条式子功能相同，门数与延迟不同——这正是必须化简的理由。' },
        { t: 'warn', title: '两个扣分点', html: '<b>①优先级</b>：NOT &gt; AND &gt; OR，所以 <span class="ovl">A</span>B+C 不是 <span class="ovl">A(B+C)</span>，写答案时宁可多加括号。<b>②中间结果</b>：化简过程中若把“或”当成“异或”（例如把 A+<span class="ovl">A</span>B 写成 B），结果会完全变样；每步都用真值表抽一两组输入验算最保险。' }
      ]
    },
    {
      id: 'ref-kmap',
      num: '2.7',
      title: '卡诺图规则',
      lead: '邻接消变量：圈越大、项越短。',
      tag: '核心',
      blocks: [
        { t: 'p', html: '卡诺图把真值表按<b>格雷码</b>排成二维方格，使相邻格只有一个变量不同。于是圈住 2<sup>k</sup> 个相邻的 1，就能消去 k 个变量：圈越大，乘积项越短。' },
        { t: 'key', title: '圈法五条铁律', items: [
          '每个圈只能含 1、2、4、8… 个格，即 2 的幂，且圈内不能有 0（无关项 X 可以）。',
          '圈要<b>尽可能大</b>：圈越大，消去的变量越多，项越短。',
          '圈可以<b>重叠</b>，但每个圈至少要含一个不被其他圈覆盖的 1，否则这个圈是多余的。',
          '<b>边界相邻</b>：最左列与最右列相邻、最上行与最下行相邻；四变量图中四个角彼此相邻。',
          '必须<b>覆盖所有 1</b>，且圈的个数尽量少；剩下的 1 若无法合并，就单独成圈（最小项）。'
        ] },
        { t: 'table', title: '两种常用排布', head: ['变量数', '格数', '行标签', '列标签'], rows: [
          ['3 个（A,B,C）', '8', 'A：0、1', 'BC：00、01、11、10'],
          ['4 个（A,B,C,D）', '16', 'AB：00、01、11、10', 'CD：00、01、11、10']
        ], caption: '行列都必须用格雷码 00、01、11、10；写成自然二进制 00、01、10、11 会破坏邻接关系，是最常见的画图错误。' },
        { t: 'steps', title: '化简五步', items: [
          { title: '画图', html: '按格雷码排好行列，把真值表的 1、0、X 填进对应格。' },
          { title: '找大圈', html: '优先找 8 格、4 格，再找 2 格，最后处理孤立 1；先圈“只有一个圈能覆盖”的 1。' },
          { title: '写项', html: '圈内取值不变的变量保留：为 1 写原变量，为 0 写反变量；变化的变量消去。' },
          { title: '相或', html: '所有乘积项相或，得到最简与或式（SOP）。' },
          { title: '求 POS', html: '若要或与式，改圈 0 得到 <span class="ovl">Y</span> 的 SOP，再整体取反并用德摩根。' }
        ] },
        { t: 'example', title: '例：四角相邻', html: '四变量图中 m0、m2、m8、m10 正好在四个角。它们的二进制是 0000、0010、1000、1010：B 恒为 0、D 恒为 0，A 与 C 取遍四种组合，故合并为 <span class="ovl">B</span><span class="ovl">D</span>。再看 m13、m15（1101、1111），只有 C 不同，合并为 ABD。最终 Y = <span class="ovl">B</span><span class="ovl">D</span> + ABD。' },
        { t: 'warn', title: '三个常见错误', html: '<b>①</b>漏圈孤立的 1，或把圈画成 3 格、6 格；<b>②</b>忘记边界与四角相邻，错过最大的圈；<b>③</b>行列标签没按格雷码，导致“看起来相邻其实不相邻”。另外，无关项 X 要主动用来扩大圈，而不是全部当 0。' }
      ]
    },
    {
      id: 'ref-seq',
      num: '3.5',
      title: '时序与触发器参数',
      lead: '两条方程定生死：周期看建立，频率看保持。',
      tag: '考点',
      blocks: [
        { t: 'p', html: '同步设计把状态只放在触发器里、只在时钟沿更新、触发器之间只放组合逻辑。于是整机时序可以按“一个周期”逐拍分析，而分析只需四个参数与两条不等式。' },
        { t: 'table', title: '触发器的四个时序参数', head: ['参数', '含义', '决定什么'], rows: [
          ['t<sub>setup</sub>', '时钟沿之前数据必须稳定的最短时间', '最小时钟周期（建立约束）'],
          ['t<sub>hold</sub>', '时钟沿之后数据必须保持的最短时间', '会不会“跑得太快”（保持约束）'],
          ['t<sub>pcq</sub>', '时钟沿到 Q 达到最终值的最长时间', '建立约束里的输出延迟'],
          ['t<sub>ccq</sub>', '时钟沿到 Q 开始变化的最短时间', '保持约束里的最快输出']
        ] },
        { t: 'formula', html: 'T<sub>c</sub> ≥ t<sub>pcq</sub> + t<sub>pd</sub> + t<sub>setup</sub>，t<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub>', note: '第一式给出 T<sub>c,min</sub> 与 f<sub>max</sub> = 1/T<sub>c,min</sub>；第二式与周期无关，只与“最短路径”有关。t<sub>pd</sub> 取关键路径，t<sub>cd</sub> 取最短路径。' },
        { t: 'formula', html: '含时钟偏移 t<sub>skew</sub>（建立取接收端更早、保持取接收端更晚的最坏情况）：T<sub>c</sub> ≥ t<sub>pcq</sub> + t<sub>pd</sub> + t<sub>setup</sub> + t<sub>skew</sub>，t<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub> + t<sub>skew</sub>', note: '时钟偏移会同时吃掉建立余量与保持余量，所以高速芯片必须做时钟树或时钟网格，把偏移压到很小。' },
        { t: 'example', title: '例：算周期与频率', html: 't<sub>pcq</sub>=0.08 ns、t<sub>setup</sub>=0.05 ns、t<sub>pd</sub>=1.20 ns、t<sub>hold</sub>=0.02 ns、t<sub>ccq</sub>=0.05 ns、t<sub>cd</sub>=0.30 ns。则 T<sub>c,min</sub>=0.08+1.20+0.05=1.33 ns，f<sub>max</sub>=1/1.33≈752 MHz；保持检查 0.05+0.30=0.35 ns &gt; 0.02 ns，通过。' },
        { t: 'table', title: '锁存器与触发器', head: ['对比项', '锁存器', '触发器'], rows: [
          ['敏感方式', '电平敏感', '边沿触发'],
          ['透明期', '有：CLK 有效期间输出跟随输入', '无：只在时钟沿采样'],
          ['时序分析', '难：毛刺可穿透', '易：按周期逐拍分析'],
          ['用途', '低功耗设计、异步接口', '同步系统的标准状态元件']
        ] },
        { t: 'kv', title: 'FSM 状态编码与同步器', items: [
          { k: '二进制编码', v: '用 ⌈log<sub>2</sub>k⌉ 位表示 k 个状态，寄存器最省，次态逻辑较复杂' },
          { k: '独热编码', v: 'k 位、每状态一位为 1；寄存器多但逻辑简单，FPGA 中常用' },
          { k: '格雷码', v: '相邻状态只变一位，减少翻转与毛刺，适合顺序循环' },
          { k: '两级同步器', v: '异步输入先过两级触发器；第一级的亚稳态有整整一个周期去分辨' },
          { k: 'MTBF', v: 'MTBF = e<sup>t<sub>r</sub>/τ</sup> / (T<sub>0</sub>·f<sub>clk</sub>·f<sub>data</sub>)，多一级触发器就把可靠性提高一个数量级' }
        ] },
        { t: 'warn', title: '保持违例不能靠降频修', html: '保持约束 t<sub>ccq</sub> + t<sub>cd</sub> ≥ t<sub>hold</sub> 里没有 T<sub>c</sub>：数据在时钟沿后 t<sub>hold</sub> 内就冲过来，与周期长短无关。修复只能<b>增加该路径的 t<sub>cd</sub></b>（插缓冲器/延时单元）或调整时钟偏移。另一个坑：多比特异步信号不能各自过同步器，必须用握手或异步 FIFO。' }
      ]
    },
    {
      id: 'ref-verilog',
      num: '4.2–4.6',
      title: 'Verilog 语法模板',
      lead: '组合用阻塞，时序用非阻塞，缺分支出锁存器。',
      tag: '核心',
      blocks: [
        { t: 'p', html: 'HDL 描述的是<b>硬件</b>而不是程序：assign 是一条连线，if 综合成 MUX，case 综合成译码/多路选择，for 会展开成多份硬件。写每一行都要能想象出对应的门与连线。' },
        { t: 'code', lang: 'verilog', title: '组合逻辑：assign 与 always_comb', code: '// 写法一：连续赋值\nassign y = (a & b) | c;\n\n// 写法二：always_comb + 阻塞赋值，必须先给默认值\nalways_comb begin\n  y = 1\'b0;            // 默认值：防止漏赋值推断出锁存器\n  if (en) y = d;\nend' },
        { t: 'code', lang: 'verilog', title: '时序逻辑：always_ff', code: 'always_ff @(posedge clk or posedge reset)   // 异步复位\n  if (reset) q <= 1\'b0;\n  else       q <= d;\n\nalways_ff @(posedge clk)                    // 同步复位\n  if (reset) q <= 1\'b0;\n  else       q <= d;\n\nalways_ff @(posedge clk)                    // 带使能：无 else 即保持\n  if (en) q <= d;' },
        { t: 'code', lang: 'verilog', title: 'FSM 三段式骨架', code: 'typedef enum logic [1:0] {S0, S1, S2, S3} statetype;\nstatetype state, nextstate;\n\nalways_ff @(posedge clk or posedge reset)\n  if (reset) state <= S0;\n  else       state <= nextstate;\n\nalways_comb begin\n  nextstate = S0;                     // 默认值\n  case (state)\n    S0: nextstate = ta ? S0 : (tb ? S1 : S0);\n    S1: nextstate = S2;\n    S2: nextstate = tb ? S2 : (ta ? S3 : S2);\n    S3: nextstate = S0;\n    default: nextstate = S0;          // 未用状态回到确定状态\n  endcase\nend\n\nassign la = (state == S0) ? GREEN : (state == S1) ? YELLOW : RED;' },
        { t: 'table', title: '两种赋值', head: ['赋值', '语义', '用在哪'], rows: [
          ['阻塞 =', '立即生效，后续语句看得到新值', '组合逻辑 always_comb'],
          ['非阻塞 &lt;=', '右侧用块开始时的旧值，块末统一更新', '时序逻辑 always_ff']
        ], caption: '非阻塞赋值才能正确建模“所有触发器同时更新”，这也是它专用于时序块的根本原因。' },
        { t: 'table', title: '写法与综合结果', head: ['写法', '综合成', '注意'], rows: [
          ['assign y = s ? d1 : d0', '2:1 MUX', '嵌套三目要加括号'],
          ['if / else if 链', '级联的优先 MUX', '串行优先级，可能成为关键路径'],
          ['case 且写 default', '译码器/多路选择器', '不写 default 可能出锁存器'],
          ['always_comb 漏分支', '锁存器（多半非本意）', '块首给默认值可避免'],
          ['for 循环', '展开成多份硬件', '循环次数必须是常数'],
          ['#5 延时、initial', '不可综合', '只用于仿真与 testbench']
        ] },
        { t: 'kv', title: '语法速记', items: [
          { k: '位宽常量', v: "<code>4'b1010</code>、<code>8'hA5</code>、<code>32'd42</code>；省略位数默认 32 位，写常量要写全" },
          { k: '拼接与复制', v: '<code>{a[3:0], b[7:4]}</code> 拼接；<code>{4{a[0]}}</code> 复制（符号扩展常用）' },
          { k: '缩位运算', v: '<code>&amp;a</code> 全 1、<code>|a</code> 非零、<code>^a</code> 奇校验' },
          { k: '相等比较', v: '<code>==</code> 遇 X 得 X；testbench 里用 <code>!==</code> 才能捕捉 X' },
          { k: '参数化', v: '<code>#(parameter WIDTH = 8)</code> + 实例化 <code>#(.WIDTH(32))</code>' }
        ] },
        { t: 'warn', title: '三条铁律', html: '①组合逻辑用 <code>always_comb</code> + 阻塞赋值；②时序逻辑用 <code>always_ff</code> + 非阻塞赋值；③<b>同一信号不要在两个 always 块中赋值</b>（多驱动）。违反前两条会造成“仿真对、综合错”；违反第三条会得到 X 或综合报错。' }
      ]
    },
    {
      id: 'ref-mips',
      num: '6.2–6.3',
      title: 'MIPS 指令与寄存器',
      lead: '32 位定长、三种格式、32 个寄存器。',
      tag: '考点',
      blocks: [
        { t: 'p', html: 'MIPS 是典型的 RISC：所有指令 32 位定长，只有 R/I/J 三种格式，32 个 32 位通用寄存器，访存只能用 <code>lw/sw</code>。三条设计原则：<b>规整性有利于简单性、越常用越快、为编译器和流水线设计</b>。' },
        { t: 'table', title: 'R 型指令（op = 000000，靠 funct 区分）', head: ['指令', '含义', 'funct', '指令', '含义', 'funct'], rows: [
          ['add', '加（检溢出）', '0x20', 'sub', '减（检溢出）', '0x22'],
          ['addu', '加（不检溢出）', '0x21', 'subu', '减（不检溢出）', '0x23'],
          ['and', '与', '0x24', 'or', '或', '0x25'],
          ['xor', '异或', '0x26', 'nor', '或非', '0x27'],
          ['slt', '置小于（有符号）', '0x2A', 'sltu', '置小于（无符号）', '0x2B'],
          ['sll', '逻辑左移', '0x00', 'srl', '逻辑右移', '0x02'],
          ['sra', '算术右移', '0x03', 'jr', '寄存器跳转', '0x08'],
          ['syscall', '系统调用', '0x0C', 'break', '断点', '0x0D']
        ] },
        { t: 'table', title: 'I 型指令（靠 opcode 区分）', head: ['指令', '含义', 'opcode', '指令', '含义', 'opcode'], rows: [
          ['beq', '相等则分支', '0x04', 'bne', '不等则分支', '0x05'],
          ['blez', '≤0 则分支', '0x06', 'bgtz', '&gt;0 则分支', '0x07'],
          ['addi', '加立即数（符号扩展）', '0x08', 'addiu', '加立即数（不检溢出）', '0x09'],
          ['slti', '置小于立即数', '0x0A', 'sltiu', '置小于立即数（无符号）', '0x0B'],
          ['andi', '与立即数（零扩展）', '0x0C', 'ori', '或立即数（零扩展）', '0x0D'],
          ['xori', '异或立即数（零扩展）', '0x0E', 'lui', '装入立即数高 16 位', '0x0F'],
          ['lb', '取字节（符号扩展）', '0x20', 'lw', '取字', '0x23'],
          ['lbu', '取字节（零扩展）', '0x24', 'sb', '存字节', '0x28'],
          ['lh', '取半字（符号扩展）', '0x21', 'sh', '存半字', '0x29'],
          ['lhu', '取半字（零扩展）', '0x25', 'sw', '存字', '0x2B']
        ] },
        { t: 'kv', title: 'J 型与其他', items: [
          { k: 'j', v: 'opcode 0x02，无条件跳转' },
          { k: 'jal', v: 'opcode 0x03，跳转并把 PC+4 写入 $ra' },
          { k: 'sllv / srlv / srav', v: '可变移位：移位量放在 rs 中（funct 0x04 / 0x06 / 0x07）' },
          { k: 'mult / div', v: '结果放 HI/LO；<code>mfhi</code> 读 HI（funct 0x10）、<code>mflo</code> 读 LO' },
          { k: '浮点', v: '协处理器 1 的 $f0~$f31；add.s/sub.s/mul.s/div.s，lwc1/swc1 访存' }
        ] },
        { t: 'table', title: '寄存器约定', head: ['编号', '名称', '用途'], rows: [
          ['$0', '$zero', '恒为 0，写入被忽略'],
          ['$1', '$at', '汇编器保留（伪指令展开用）'],
          ['$2–$3', '$v0–$v1', '函数返回值'],
          ['$4–$7', '$a0–$a3', '函数参数（前四个）'],
          ['$8–$15', '$t0–$t7', '临时寄存器，调用者保存'],
          ['$16–$23', '$s0–$s7', '保存寄存器，被调用者保存'],
          ['$24–$25', '$t8–$t9', '更多临时寄存器'],
          ['$26–$27', '$k0–$k1', '内核保留（异常处理用）'],
          ['$28', '$gp', '全局指针（静态数据区）'],
          ['$29', '$sp', '栈指针，向低地址增长'],
          ['$30', '$fp', '帧指针'],
          ['$31', '$ra', '返回地址（jal 写入）']
        ] },
        { t: 'table', title: '常用伪指令', head: ['伪指令', '等价实现'], rows: [
          ['nop', 'sll $0, $0, 0'],
          ['move $rd, $rs', 'addu $rd, $rs, $0'],
          ['li $rt, imm', 'lui + ori（大常数时）'],
          ['la $rt, label', 'lui + ori（装入标签地址）'],
          ['b label', 'beq $0, $0, label'],
          ['blt $rs, $rt, L', 'slt $at, $rs, $rt + bne $at, $0, L']
        ] },
        { t: 'code', lang: 'mips', title: '数组求和模板', code: '# $s0 = a 基址, $s1 = n, $s2 = sum\n      add  $s2, $zero, $zero   # sum = 0\n      add  $t0, $zero, $zero   # i = 0\nLoop: beq  $t0, $s1, Done      # i == n 结束\n      sll  $t1, $t0, 2         # t1 = i*4\n      add  $t1, $t1, $s0       # t1 = &a[i]\n      lw   $t2, 0($t1)         # t2 = a[i]\n      add  $s2, $s2, $t2       # sum += a[i]\n      addi $t0, $t0, 1         # i++\n      j    Loop\nDone:' },
        { t: 'warn', title: '指令表里的三个坑', html: '<b>①</b>算术立即数<b>总是符号扩展</b>（<code>andi/ori/xori</code> 是例外，用零扩展）：没有“无符号立即数加法”，要加大常数只能 <code>ori</code> 或先 <code>lui</code>。<b>②</b><code>addiu</code> 不是无符号加法，它照样按 32 位加，只是<b>不触发溢出异常</b>。<b>③</b><code>slt/sltu</code> 只差一个字母，比较的是同一组位串的不同解释：<code>1111</code> 作为补码是 −1，作为无符号是 15。' }
      ]
    },
    {
      id: 'ref-machine',
      num: '6.3',
      title: '机器码格式与编码',
      lead: '查表、填字段、拼 32 位。',
      tag: '考点',
      blocks: [
        { t: 'p', html: '每条 MIPS 指令恰好 32 位。<b>R 型</b>做寄存器运算，<b>I 型</b>带 16 位立即数（算术、访存、分支），<b>J 型</b>带 26 位目标地址。编码就是把汇编里的寄存器名换成 5 位编号、把常数换成对应字段。' },
        { t: 'table', title: '三种格式的字段布局', head: ['格式', '字段（位宽）', '用于'], rows: [
          ['R', 'op(6) rs(5) rt(5) rd(5) shamt(5) funct(6)', 'add/sub/and/or/slt/sll/srl/sra/jr'],
          ['I', 'op(6) rs(5) rt(5) imm(16)', 'addi/andi/ori/lw/sw/beq/bne/lui'],
          ['J', 'op(6) target(26)', 'j / jal']
        ], caption: 'R 型 op 恒为 000000，靠 funct 区分；I 型的 imm 参与运算前要符号扩展（逻辑运算除外）；shamt 只有移位指令用。' },
        { t: 'steps', title: '手算五步', items: [
          { title: '认格式', html: '看指令类型——寄存器运算用 R，带立即数/访存/分支用 I，直接跳转用 J。' },
          { title: '查码', html: 'R 型查 funct，I/J 型查 opcode；寄存器名查编号表（$t0=8、$s0=16、$sp=29…）。' },
          { title: '填字段', html: '按“目标在前”的顺序：R 型 rd 是目标，rs/rt 是源；I 型 rt 常是目标或源。' },
          { title: '拼二进制', html: '按字段宽度依次拼接，务必数满 32 位；imm 负数用 16 位补码。' },
          { title: '转十六进制', html: '每 4 位一组转 1 位十六进制，得到 8 位十六进制机器码。' }
        ] },
        { t: 'example', title: '例：add $t0, $s1, $s2', html: 'op=000000，rs=$s1=17=10001，rt=$s2=18=10010，rd=$t0=8=01000，shamt=00000，funct=add=100000。拼接得 <code>000000 10001 10010 01000 00000 100000</code>，即 <code>0x02324020</code>。' },
        { t: 'example', title: '例：lw $t0, 4($a0)', html: 'op=lw=0x23=100011，rs=$a0=4=00100，rt=$t0=8=01000，imm=4=0000000000000100。拼接得 <code>100011 00100 01000 0000000000000100</code>，即 <code>0x8C880004</code>。反过来看到 <code>0x8C880004</code>，先拆字段再查表，就能还原成这条指令。' },
        { t: 'formula', html: '分支目标 = (PC+4) + offset×4；跳转目标 = {(PC+4)[31:28], target[25:0], 2\'b00}', note: '分支偏移以<b>字</b>为单位且相对 PC+4（取指后 PC 已加 4），范围约 ±2<sup>15</sup> 字；J 型把 26 位目标左移 2 位，只能跳到当前 256 MB 区域内。' },
        { t: 'warn', title: '编码时最易错的四处', html: '<b>①</b>把 rd 与 rt 填反：R 型的顺序是 rs、rt 两个源在前，rd 目标在中间。<b>②</b>分支偏移按字节填：字段里应填“字”数（字节偏移除以 4）。<b>③</b>忘记 shamt 占 5 位：非移位指令必须填 00000，否则整条码全错位。<b>④</b>负数立即数直接写绝对值：16 位 imm 要用补码表示。' }
      ]
    },
    {
      id: 'ref-perf',
      num: '7.2 / 7.5',
      title: '性能与流水线公式',
      lead: '一条乘法公式，三把改进的钥匙。',
      tag: '考点',
      blocks: [
        { t: 'formula', html: 'T<sub>exec</sub> = 指令数 IC × CPI × T<sub>c</sub> = IC × CPI / f', note: '三条因子分别由编译器/ISA、微体系结构、工艺与流水级数决定。改进性能就是设法减小其中一个，而不能让另外两个变大。' },
        { t: 'table', title: '三个因子由谁决定', head: ['因子', '含义', '主要由谁决定'], rows: [
          ['IC（指令数）', '程序执行了多少条指令', '编译器、ISA、算法'],
          ['CPI', '平均每条指令用几个周期', '微体系结构：单周期/多周期/流水线'],
          ['T<sub>c</sub> 或 f', '一个周期多长', '工艺、逻辑级数、流水级数']
        ] },
        { t: 'formula', html: 'S = T<sub>old</sub> / T<sub>new</sub> = 1 / ((1−f) + f/k)', note: 'Amdahl 定律：f 是被优化部分占原时间的比例，k 是该部分的加速倍数。整体加速比的上限是 1/(1−f)，与 k 无关。' },
        { t: 'table', title: '三种微结构对比', head: ['结构', 'CPI', 'T<sub>c</sub>', '特点'], rows: [
          ['单周期', '1', '由最慢指令（通常是 lw）的整条路径决定', '最简单，硬件浪费大'],
          ['多周期', '3~5', '只覆盖一步，约为单周期的 1/4~1/5', '复用硬件，需状态寄存器'],
          ['5 级流水线', '1 + 停顿/指令', '取最慢一级 + 流水线寄存器开销', '吞吐率接近 5 倍，需处理冒险']
        ], caption: '多周期并不一定比单周期快：它用更高的 CPI 换更短的 T<sub>c</sub>。真正的跃升来自流水线——让多条指令的不同阶段同时进行。' },
        { t: 'table', title: '三类冒险', head: ['类型', '原因', '解决'], rows: [
          ['结构冒险', '两条指令同时要用同一硬件', '分离指令/数据存储器、复制资源、停顿'],
          ['数据冒险', '后一条要用前一条还没写回的结果', '前递、停顿、编译器调度'],
          ['控制冒险', '分支结果未定就取了错误方向', '分支预测、延迟槽、冲刷']
        ], caption: '数据冒险里最常见的是 RAW（真相关），可用前递解决；load-use 因为数据到 MEM 末才可用，必须停一拍。WAR/WAW 只在乱序执行时出现，靠寄存器重命名。' },
        { t: 'example', title: '例：流水线加速比', html: '程序 10<sup>6</sup> 条指令。非流水线 T<sub>c</sub>=800 ps、CPI=1；5 级流水线每级 200 ps 加 20 ps 寄存器开销，T<sub>c</sub>=220 ps；20% 的指令各停 1 拍，CPI=1.2。则 T<sub>pipe</sub>=10<sup>6</sup>×1.2×220 ps=264 μs，T<sub>non</sub>=800 μs，S≈3.03。理想上限 800/220≈3.6，停顿吃掉了约 16% 的收益。' },
        { t: 'warn', title: '深流水线为何收益递减', html: 'T<sub>c</sub> = max(各级延迟) + t<sub>setup(流水线寄存器)</sub>。级数越多，寄存器开销占比越大，T<sub>c</sub> 不能无限缩小；同时分支误预测与冒险的代价按<b>周期数</b>计，级数越深，一次冲刷浪费的周期越多。所以现代处理器转向提高 IPC（超标量、乱序）与多核，而不是一味加深流水。' }
      ]
    },
    {
      id: 'ref-mem',
      num: '8.2–8.4',
      title: '存储层次与 cache 公式',
      lead: '先算地址三位，再套 AMAT。',
      tag: '考点',
      blocks: [
        { t: 'formula', html: 'AMAT = t<sub>hit</sub> + 缺失率 × 缺失代价', note: '缺失率 = 1 − 命中率。例：命中 1 周期、缺失率 5%、缺失代价 100 周期，则 AMAT = 1 + 0.05×100 = 6 周期；缺失率降到 2% 后只剩 3 周期——小变化被缺失代价放大。' },
        { t: 'table', title: '存储层次（数量级记忆）', head: ['层次', '典型容量', '典型延迟'], rows: [
          ['寄存器', '几十~几百字节', '不到 1 个周期'],
          ['L1 缓存（SRAM）', '16~64 KB', '1~4 个周期'],
          ['L2 缓存（SRAM）', '256 KB~2 MB', '10~20 个周期'],
          ['L3 缓存（SRAM）', '几 MB~几十 MB', '30~50 个周期'],
          ['主存（DRAM）', 'GB 级', '100~300 个周期'],
          ['SSD / 磁盘', 'GB~TB 级', '微秒级 / 毫秒级']
        ], caption: '层次能成立靠局部性：时间局部性（刚用过的还会用）与空间局部性（邻近地址会被用）。' },
        { t: 'formula', html: 'offset = log<sub>2</sub>(块大小)，index = log<sub>2</sub>(块数 / 路数)，tag = 32 − index − offset', note: '块数 = 缓存容量 / 块大小。直接映射是 1 路，全相联只有 1 组、没有 index。' },
        { t: 'example', title: '例：地址划分', html: '32 位地址、容量 2 KB、块 16 B、直接映射：块数 = 2048/16 = 128 = 2<sup>7</sup>，index = 7 位；offset = log<sub>2</sub>16 = 4 位；tag = 32−7−4 = 21 位。若改为 4 路组相联：组数 = 32，index = 5 位，tag = 23 位。' },
        { t: 'table', title: '缺失的三种来源', head: ['来源', '含义', '缓解'], rows: [
          ['强制缺失', '第一次访问该块，无法避免', '预取（只能提前，不能消除）'],
          ['容量缺失', '缓存太小，装不下工作集', '增大容量'],
          ['冲突缺失', '多个块映射到同一组互相挤掉', '提高相联度、受害者缓存']
        ] },
        { t: 'kv', title: '降低 AMAT 的四条路', items: [
          { k: '降命中时间', v: '缩小缓存、加快 SRAM、用虚拟地址索引（不必等地址转换）' },
          { k: '降缺失率', v: '增大容量、提高相联度、优化替换策略（LRU/伪 LRU）、预取' },
          { k: '降缺失代价', v: '多级缓存、关键字优先、非阻塞缓存、写缓冲' },
          { k: '减少访问次数', v: '优化程序局部性：循环分块、数据布局、复用' }
        ] },
        { t: 'table', title: '缓存与虚拟存储的分工', head: ['对比项', '高速缓存', '虚拟存储器'], rows: [
          ['解决什么', 'CPU 与主存的速度差', '主存容量不足、进程隔离与保护'],
          ['谁来管理', '纯硬件', '硬件 + 操作系统'],
          ['替换单位', '块（16~64 B）', '页（4~64 KB）'],
          ['缺失代价', '几十~几百周期', '缺页：数百万周期（磁盘 I/O）'],
          ['写策略', '写直达或写回', '写回（脏页）']
        ] },
        { t: 'warn', title: '两个容易混的概念', html: '<b>①TLB 缺失 ≠ 缺页</b>：前者只是映射不在 TLB 中，页还在内存，遍历页表几十周期即可补齐；后者是页表项有效位为 0，必须由操作系统从磁盘调入。②写直达简单但流量大，写回省带宽但要脏位、多核还要一致性协议；写回通常配写分配，写直达常配不写分配。' }
      ]
    },
    {
      id: 'ref-impl',
      num: '附录 A',
      title: '数字系统实现',
      lead: 'RTL 到芯片：综合、布局布线、制造、测试。',
      tag: '进阶',
      blocks: [
        { t: 'p', html: '设计完成不等于芯片可用。从 RTL 到真实芯片要经过<b>综合（门级网表）→ 布局布线（版图）→ 制造封装 → 测试</b>，每一环都会引入延迟、面积与功耗的开销。所以写代码时就要想着物理实现。' },
        { t: 'steps', title: '综合三步', items: [
          { title: '翻译', html: '把 HDL 语句转成布尔方程与状态机，得到与工艺无关的逻辑描述。' },
          { title: '优化', html: '布尔化简、资源共享、常量传播、死代码消除，在满足时序的前提下减面积。' },
          { title: '映射', html: '把逻辑映射到目标库的门——标准单元，或 FPGA 的 LUT。' }
        ] },
        { t: 'table', title: '五种实现方式', head: ['方式', '特点', '典型场合'], rows: [
          ['分立器件（74 系列）', '教学原型用；慢、功耗大、集成度低', '实验台小电路'],
          ['PLD / CPLD', '可编程与或阵列，适合胶合逻辑', '小规模粘合'],
          ['FPGA', 'LUT + 触发器 + 可编程互连，可反复重编程', '原型验证、小批量'],
          ['标准单元 ASIC', '用单元库综合与布局布线，性能功耗最优', '大批量产品'],
          ['全定制', '手工设计每个晶体管，性能最高', 'CPU 关键模块']
        ], caption: 'FPGA 上市快但面积/功耗/速度不如 ASIC；ASIC 性能功耗最优，但 NRE 成本高、周期长。' },
        { t: 'kv', title: '工艺与成本', items: [
          { k: '工艺节点', v: '0.6 μm → 65 nm → 7 nm：尺寸缩小，速度提高、功耗下降、集成度提高' },
          { k: '晶圆', v: '200 mm / 300 mm：直径越大，单晶圆可切的芯片越多，单颗越便宜' },
          { k: '封装', v: 'DIP、QFP、BGA、CSP：引脚数、散热、信号完整性不同' },
          { k: '成本模型', v: '单芯片成本 ≈ (晶圆成本 + 测试成本) / (每晶圆芯片数 × 良率)' },
          { k: '良率', v: '缺陷随机分布，芯片面积越大命中缺陷的概率越高，良率越低' }
        ] },
        { t: 'table', title: '测试与可测性设计', head: ['概念', '说明'], rows: [
          ['故障模型', '固定 0/1 故障（stuck-at）、桥接故障、延迟故障'],
          ['测试向量', '能区分好芯片与坏芯片的输入序列'],
          ['扫描链', '把触发器串成移位寄存器，便于注入激励与观察结果'],
          ['BIST', '内建自测试：芯片自己生成激励并判断结果']
        ] },
        { t: 'warn', title: '综合与仿真不一致的五个原因', html: '①用了不可综合的写法（#延时、initial、文件 I/O）；②组合块漏分支，推断出锁存器；③同一信号多驱动；④异步复位/时钟处理不当；⑤依赖仿真器的 X 传播语义。对策是三件事一起做：<b>代码规范 + lint 检查 + 门级仿真</b>。' }
      ]
    },
    {
      id: 'ref-term',
      num: '速查',
      title: '术语与符号表',
      lead: '中英对照，符号归一。',
      tag: '基础',
      blocks: [
        { t: 'p', html: '术语题考的是“能不能用一句话说清”。下表按全书出现顺序排列：第三列是常用符号或一句话备注。记忆时优先记<b>英文缩写</b>与<b>一句话定义</b>，两者能互相勾出来就算过关。' },
        { t: 'table', title: '中英术语对照', head: ['中文', '英文', '符号/备注'], rows: [
          ['抽象', 'abstraction', '隐藏不重要的细节'],
          ['约束', 'discipline', '限定设计选择的范围'],
          ['传播延迟', 'propagation delay', 't<sub>pd</sub>'],
          ['最小延迟', 'contamination delay', 't<sub>cd</sub>'],
          ['建立时间', 'setup time', 't<sub>setup</sub>'],
          ['保持时间', 'hold time', 't<sub>hold</sub>'],
          ['亚稳态', 'metastability', '输出停在 0/1 之间'],
          ['有限状态机', 'finite state machine', 'FSM'],
          ['综合', 'synthesis', 'RTL 到门级网表'],
          ['流水线', 'pipeline', '各级重叠执行'],
          ['数据冒险', 'data hazard', 'RAW 最常见'],
          ['前递', 'forwarding', '把结果直接送给下一条'],
          ['高速缓存', 'cache', '块为单位'],
          ['相联度', 'associativity', '每组行数'],
          ['虚拟存储器', 'virtual memory', '页为单位'],
          ['页表', 'page table', 'VPN 到 PPN'],
          ['转换后备缓冲器', 'translation lookaside buffer', 'TLB'],
          ['直接存储器访问', 'direct memory access', 'DMA']
        ] },
        { t: 'kv', title: '符号表', items: [
          { k: 't<sub>pd</sub> / t<sub>cd</sub>', v: '组合电路最长路径延迟 / 最短路径延迟' },
          { k: 't<sub>pcq</sub> / t<sub>ccq</sub>', v: '时钟到输出的传播延迟 / 最小延迟' },
          { k: 'T<sub>c</sub>', v: '时钟周期，f = 1/T<sub>c</sub>' },
          { k: 'IC / CPI', v: '指令数 / 平均每指令周期数' },
          { k: 'AMAT', v: '平均访存时间 = 命中时间 + 缺失率 × 缺失代价' },
          { k: 'MTBF', v: '平均无故障时间，衡量同步器可靠性' },
          { k: 'V<sub>IL</sub> / V<sub>IH</sub> / V<sub>OL</sub> / V<sub>OH</sub>', v: '输入低/高、输出低/高的逻辑电平门限' }
        ] },
        { t: 'note', title: '怎么用这张速查台', html: '三步走：先按主题定位表，再回公式块确认符号定义，最后用例题核对数量级。若算出来“差 2 倍”或“差一个数量级”，先查两件事：<b>K 是 1024 还是 1000</b>，以及<b>位与字节有没有混</b>。' },
        { t: 'quote', html: '公式是压缩过的推导。背不下来时，回到它是从哪张图、哪个假设推出来的。', cite: '—— 学习建议' }
      ]
    }
  ]
};

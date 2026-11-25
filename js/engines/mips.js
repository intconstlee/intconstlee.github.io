/*
 * mips.js - a small, dependency-free MIPS32 assembler/interpreter for the
 * browser and for Node-based judge tests.
 *
 * Addressing model used by the interpreter:
 *   - instructions are addressed by their index in the expanded instruction
 *     stream (0, 1, 2, ...).  Labels therefore contain instruction indexes.
 *   - branches are relative to the next instruction index and jumps store an
 *     absolute instruction index.
 *   - data memory is a sparse byte-addressed, little-endian address space.
 *
 * This file is a classic browser script and also exports itself through
 * CommonJS when loaded by Node.
 */
(function (root) {
  'use strict';

  var REG_NAMES = [
    'zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3',
    't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7',
    't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'
  ];

  var REG_INDEX = Object.create(null);
  var i;
  for (i = 0; i < REG_NAMES.length; i++) {
    REG_INDEX[REG_NAMES[i]] = i;
  }
  REG_INDEX.s8 = 30; /* common alias for fp */

  var DEFAULT_MAX_STEPS = 10000;
  var DATA_BASE = 4096;
  var ADDRESS_SPACE = 4294967296; /* 2^32 */
  var NUMBER_RE = /^[+-]?(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|[0-9]+)$/;
  var LABEL_RE = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
  var MAX_STRING_BYTES = 1048576;

  /* ------------------------------------------------------------------ */
  /* Errors and small helpers                                           */
  /* ------------------------------------------------------------------ */

  function MipsError(message, line) {
    this.name = 'MipsError';
    this.message = message;
    this.line = line || 0;
  }
  MipsError.prototype = Object.create(Error.prototype);
  MipsError.prototype.constructor = MipsError;

  function fail(message, line) {
    throw new MipsError(message, line);
  }

  function formatError(err) {
    var message = err && err.message ? err.message : String(err);
    if (err && err.line) {
      return '第 ' + err.line + ' 行: ' + message;
    }
    return message;
  }

  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function copyMap(map) {
    var out = {};
    var keys = Object.keys(map);
    for (var k = 0; k < keys.length; k++) {
      Object.defineProperty(out, keys[k], {
        value: map[keys[k]],
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    return out;
  }

  function int32(value) {
    return value | 0;
  }

  function uint32(value) {
    return value >>> 0;
  }

  function hexAddress(value) {
    return '0x' + (value >>> 0).toString(16);
  }

  function stripComment(line) {
    var quote = null;
    var escaped = false;
    var i;
    for (i = 0; i < line.length; i++) {
      var ch = line.charAt(i);
      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          quote = null;
        }
      } else if (ch === '#' ) {
        return line.slice(0, i);
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      }
    }
    return line;
  }

  /* Split operands at top-level commas/whitespace.  Parentheses and quoted
     strings are kept together. */
  function tokenizeOperands(text, line) {
    var tokens = [];
    var current = '';
    var depth = 0;
    var quote = null;
    var escaped = false;
    var i;
    for (i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (quote) {
        current += ch;
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          quote = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        current += ch;
      } else if (ch === '(') {
        depth++;
        current += ch;
      } else if (ch === ')') {
        depth--;
        if (depth < 0) {
          fail('括号不匹配', line);
        }
        current += ch;
      } else if (depth === 0 && (ch === ',' || /\s/.test(ch))) {
        if (current.trim()) {
          tokens.push(current.trim());
        }
        current = '';
      } else {
        current += ch;
      }
    }
    if (quote) {
      fail('字符串或字符常量未闭合', line);
    }
    if (depth !== 0) {
      fail('括号不匹配', line);
    }
    if (current.trim()) {
      tokens.push(current.trim());
    }
    return tokens;
  }

  function unescapeText(text, line) {
    var out = '';
    var i = 0;
    while (i < text.length) {
      var ch = text.charAt(i);
      if (ch !== '\\') {
        out += ch;
        i++;
        continue;
      }
      i++;
      if (i >= text.length) {
        fail('字符串末尾存在不完整的转义字符', line);
      }
      var next = text.charAt(i);
      i++;
      switch (next) {
        case 'n': out += '\n'; break;
        case 't': out += '\t'; break;
        case 'r': out += '\r'; break;
        case '0': out += '\0'; break;
        case 'a': out += '\x07'; break;
        case 'b': out += '\b'; break;
        case 'f': out += '\f'; break;
        case 'v': out += '\v'; break;
        case '\\': out += '\\'; break;
        case '"': out += '"'; break;
        case "'": out += "'"; break;
        case 'x': {
          var hex = text.substr(i, 2);
          if (!/^[0-9a-fA-F]{2}$/.test(hex)) {
            fail('\\x 转义需要两个十六进制数字', line);
          }
          out += String.fromCharCode(parseInt(hex, 16));
          i += 2;
          break;
        }
        case 'u': {
          var hex4 = text.substr(i, 4);
          if (!/^[0-9a-fA-F]{4}$/.test(hex4)) {
            fail('\\u 转义需要四个十六进制数字', line);
          }
          out += String.fromCharCode(parseInt(hex4, 16));
          i += 4;
          break;
        }
        default:
          fail('未知转义字符: \\' + next, line);
      }
    }
    return out;
  }

  function parseStringToken(token, line) {
    token = token.trim();
    if (token.length < 2 || token.charAt(0) !== '"') {
      fail('字符串值必须用双引号括起来', line);
    }
    var i;
    var closedAt = -1;
    for (i = 1; i < token.length; i++) {
      if (token.charAt(i) === '\\') {
        i++;
      } else if (token.charAt(i) === '"') {
        closedAt = i;
        break;
      }
    }
    if (closedAt !== token.length - 1) {
      fail('字符串格式错误: ' + token, line);
    }
    return unescapeText(token.slice(1, -1), line);
  }

  function parseCharToken(token, line) {
    if (token.charAt(0) !== "'") {
      fail('字符常量格式错误: ' + token, line);
    }
    var closedAt = -1;
    var i;
    for (i = 1; i < token.length; i++) {
      if (token.charAt(i) === '\\') {
        i++;
      } else if (token.charAt(i) === "'") {
        closedAt = i;
        break;
      }
    }
    if (closedAt !== token.length - 1) {
      fail('字符常量格式错误: ' + token, line);
    }
    var text = unescapeText(token.slice(1, -1), line);
    var chars = Array.from(text);
    if (chars.length !== 1) {
      fail('字符常量必须恰好包含一个字符: ' + token, line);
    }
    return chars[0].codePointAt(0);
  }

  function isNumericToken(token) {
    return token.charAt(0) === "'" || NUMBER_RE.test(token);
  }

  function parseNumberToken(token, line) {
    token = String(token).trim();
    if (!token) {
      fail('缺少数值', line);
    }
    if (token.charAt(0) === "'") {
      return parseCharToken(token, line);
    }
    var match = NUMBER_RE.exec(token);
    if (!match) {
      fail('无法识别的数值: ' + token, line);
    }
    var negative = token.charAt(0) === '-';
    var positive = token.charAt(0) === '+';
    var body = negative || positive ? token.slice(1) : token;
    var radix = 10;
    if (/^0[xX]/.test(body)) {
      radix = 16;
      body = body.slice(2);
    } else if (/^0[bB]/.test(body)) {
      radix = 2;
      body = body.slice(2);
    } else if (/^0[oO]/.test(body)) {
      radix = 8;
      body = body.slice(2);
    }
    var value = parseInt(body, radix);
    if (negative) {
      value = -value;
    }
    if (!isFinite(value) || Math.floor(value) !== value ||
        value < -2147483648 || value > 4294967295) {
      fail('数值超出 32 位范围: ' + token, line);
    }
    return value;
  }

  function parseImmediate(token, line, min, max, description) {
    var value = parseNumberToken(token, line);
    if (value < min || value > max) {
      fail('立即数超出范围: ' + token + '（' + description + '）', line);
    }
    return value;
  }

  function parseRegister(token, line) {
    var raw = String(token).trim();
    if (!raw) {
      fail('缺少寄存器', line);
    }
    var name = raw.charAt(0) === '$' ? raw.slice(1) : raw;
    var lower = name.toLowerCase();
    if (/^[0-9]+$/.test(name)) {
      var num = parseInt(name, 10);
      if (num < 0 || num > 31) {
        fail('未知寄存器: ' + raw, line);
      }
      return num;
    }
    if (hasOwn(REG_INDEX, lower)) {
      return REG_INDEX[lower];
    }
    fail('未知寄存器: ' + raw, line);
  }

  function registerNameForInit(key, line) {
    var raw = String(key).trim();
    var name = raw.charAt(0) === '$' ? raw.slice(1) : raw;
    if (/^[0-9]+$/.test(name)) {
      var num = parseInt(name, 10);
      if (num < 0 || num > 31) {
        fail('未知寄存器: ' + raw, line);
      }
      return num;
    }
    if (hasOwn(REG_INDEX, name.toLowerCase())) {
      return REG_INDEX[name.toLowerCase()];
    }
    fail('未知寄存器: ' + raw, line);
  }

  function parseLabelOperand(token, line) {
    var label = String(token).trim();
    if (!LABEL_RE.test(label)) {
      fail('无效的标签名: ' + label, line);
    }
    return label;
  }

  /* UTF-8 helpers: .asciiz stores bytes, and syscall 4 decodes those bytes. */
  function utf8Encode(text) {
    var bytes = [];
    var i;
    for (i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
        var low = text.charCodeAt(i + 1);
        if (low >= 0xdc00 && low <= 0xdfff) {
          code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00);
          i++;
        }
      }
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6));
        bytes.push(0x80 | (code & 0x3f));
      } else if (code < 0x10000) {
        bytes.push(0xe0 | (code >> 12));
        bytes.push(0x80 | ((code >> 6) & 0x3f));
        bytes.push(0x80 | (code & 0x3f));
      } else {
        bytes.push(0xf0 | (code >> 18));
        bytes.push(0x80 | ((code >> 12) & 0x3f));
        bytes.push(0x80 | ((code >> 6) & 0x3f));
        bytes.push(0x80 | (code & 0x3f));
      }
    }
    return bytes;
  }

  function utf8Decode(bytes) {
    var out = '';
    var i = 0;
    while (i < bytes.length) {
      var b0 = bytes[i++];
      if (b0 < 0x80) {
        out += String.fromCharCode(b0);
      } else if ((b0 & 0xe0) === 0xc0) {
        if (i >= bytes.length || (bytes[i] & 0xc0) !== 0x80) {
          out += '\ufffd';
        } else {
          out += String.fromCharCode(((b0 & 0x1f) << 6) | (bytes[i++] & 0x3f));
        }
      } else if ((b0 & 0xf0) === 0xe0) {
        if (i + 1 >= bytes.length ||
            (bytes[i] & 0xc0) !== 0x80 || (bytes[i + 1] & 0xc0) !== 0x80) {
          out += '\ufffd';
        } else {
          var cp3 = ((b0 & 0x0f) << 12) |
                    ((bytes[i++] & 0x3f) << 6) |
                    (bytes[i++] & 0x3f);
          out += String.fromCharCode(cp3);
        }
      } else if ((b0 & 0xf8) === 0xf0) {
        if (i + 2 >= bytes.length ||
            (bytes[i] & 0xc0) !== 0x80 ||
            (bytes[i + 1] & 0xc0) !== 0x80 ||
            (bytes[i + 2] & 0xc0) !== 0x80) {
          out += '\ufffd';
        } else {
          var cp4 = ((b0 & 0x07) << 18) |
                    ((bytes[i++] & 0x3f) << 12) |
                    ((bytes[i++] & 0x3f) << 6) |
                    (bytes[i++] & 0x3f);
          if (cp4 > 0xffff) {
            cp4 -= 0x10000;
            out += String.fromCharCode(0xd800 + (cp4 >> 10));
            out += String.fromCharCode(0xdc00 + (cp4 & 0x3ff));
          } else {
            out += String.fromCharCode(cp4);
          }
        }
      } else {
        out += '\ufffd';
      }
    }
    return out;
  }

  /* Sparse byte-addressed memory. */
  function memoryByte(bytes, address) {
    var key = String(address >>> 0);
    return hasOwn(bytes, key) ? bytes[key] : 0;
  }

  function markWord(touched, address) {
    var base = (address & 0xfffffffc) >>> 0;
    touched[String(base)] = true;
  }

  function putMemoryByte(bytes, touched, address, value) {
    var addr = address >>> 0;
    bytes[String(addr)] = value & 0xff;
    markWord(touched, addr);
  }

  function writeMemoryWord(bytes, touched, address, value) {
    var addr = address >>> 0;
    for (var b = 0; b < 4; b++) {
      putMemoryByte(bytes, touched, (addr + b) >>> 0, (value >>> (b * 8)) & 0xff);
    }
  }

  function writeMemoryHalf(bytes, touched, address, value) {
    var addr = address >>> 0;
    for (var b = 0; b < 2; b++) {
      putMemoryByte(bytes, touched, (addr + b) >>> 0, (value >>> (b * 8)) & 0xff);
    }
  }

  function readMemoryWord(bytes, address) {
    var addr = address >>> 0;
    var value = memoryByte(bytes, addr) |
                (memoryByte(bytes, (addr + 1) >>> 0) << 8) |
                (memoryByte(bytes, (addr + 2) >>> 0) << 16) |
                (memoryByte(bytes, (addr + 3) >>> 0) << 24);
    return value | 0;
  }

  function readMemoryHalf(bytes, address) {
    var addr = address >>> 0;
    return (memoryByte(bytes, addr) |
            (memoryByte(bytes, (addr + 1) >>> 0) << 8)) & 0xffff;
  }

  function snapshotMemory(bytes, touched) {
    var numericKeys = Object.keys(touched).map(Number).sort(function (a, b) {
      return a - b;
    });
    var mem = {};
    for (var k = 0; k < numericKeys.length; k++) {
      var base = numericKeys[k] >>> 0;
      var value = readMemoryWord(bytes, base);
      Object.defineProperty(mem, String(base), {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    return mem;
  }

  /* ------------------------------------------------------------------ */
  /* Instruction encoding (used by assemble().words)                    */
  /* ------------------------------------------------------------------ */

  var R_FUNCTS = {
    add: 0x20, addu: 0x21, sub: 0x22, subu: 0x23,
    and: 0x24, or: 0x25, xor: 0x26, nor: 0x27,
    slt: 0x2a, sltu: 0x2b,
    sll: 0x00, srl: 0x02, sra: 0x03,
    sllv: 0x04, srlv: 0x06, srav: 0x07,
    jr: 0x08, mult: 0x18, multu: 0x19,
    div: 0x1a, divu: 0x1b,
    mfhi: 0x10, mflo: 0x12, syscall: 0x0c
  };

  var I_OPCODES = {
    addi: 0x08, addiu: 0x09, slti: 0x0a, sltiu: 0x0b,
    andi: 0x0c, ori: 0x0d, xori: 0x0e, lui: 0x0f,
    lb: 0x20, lh: 0x21, lw: 0x23,
    lbu: 0x24, lhu: 0x25,
    sb: 0x28, sh: 0x29, sw: 0x2b,
    beq: 0x04, bne: 0x05, blez: 0x06, bgtz: 0x07,
    bltz: 0x01, bgez: 0x01
  };

  function encodeInstruction(op) {
    if (hasOwn(R_FUNCTS, op.op)) {
      var rs = op.rs || 0;
      var rt = op.rt || 0;
      var rd = op.rd || 0;
      var sa = op.sa || 0;
      if (op.op === 'syscall') {
        var code = op.code === undefined ? 0 : op.code;
        return (((code & 0xfffff) << 6) | 0x0c) >>> 0;
      }
      return (((rs & 31) << 21) |
              ((rt & 31) << 16) |
              ((rd & 31) << 11) |
              ((sa & 31) << 6) |
              R_FUNCTS[op.op]) >>> 0;
    }
    if (op.op === 'j' || op.op === 'jal') {
      var target = op.target || 0;
      return ((((op.op === 'j' ? 0x02 : 0x03) & 0x3f) << 26) |
              (target & 0x03ffffff)) >>> 0;
    }
    if (hasOwn(I_OPCODES, op.op)) {
      var imm;
      if (op.op === 'beq' || op.op === 'bne' ||
          op.op === 'blez' || op.op === 'bgtz' ||
          op.op === 'bltz' || op.op === 'bgez') {
        imm = op.offset || 0;
      } else {
        imm = op.imm || 0;
      }
      var encodedRt = op.rt || 0;
      if (op.op === 'bltz') {
        encodedRt = 0;
      } else if (op.op === 'bgez') {
        encodedRt = 1;
      }
      return (((I_OPCODES[op.op] & 0x3f) << 26) |
              (((op.rs || 0) & 31) << 21) |
              ((encodedRt & 31) << 16) |
              (imm & 0xffff)) >>> 0;
    }
    return 0;
  }

  /* ------------------------------------------------------------------ */
  /* Assembler                                                          */
  /* ------------------------------------------------------------------ */

  function assembleInternal(code) {
    if (typeof code !== 'string') {
      fail('源代码必须是字符串');
    }
    code = code.replace(/^\ufeff/, '');

    var ops = [];
    var labels = Object.create(null);
    var dataLabels = Object.create(null);
    var allLabels = Object.create(null);
    var dataBytes = Object.create(null);
    var touchedWords = Object.create(null);
    var dataRelocs = [];
    var dataPtr = DATA_BASE;
    var section = 'text';

    function declareLabel(name, line) {
      if (hasOwn(allLabels, name)) {
        fail('标签重复定义: ' + name + '（首次定义在第 ' +
             allLabels[name].line + ' 行）', line);
      }
      if (section === 'text') {
        labels[name] = ops.length;
        allLabels[name] = { kind: 'text', line: line };
      } else {
        dataLabels[name] = dataPtr;
        allLabels[name] = { kind: 'data', line: line };
      }
    }

    function advanceData(count, line) {
      if (!isFinite(count) || Math.floor(count) !== count || count < 0) {
        fail('数据段大小必须是非负整数', line);
      }
      if (dataPtr + count > ADDRESS_SPACE) {
        fail('数据段超出 32 位地址空间', line);
      }
      dataPtr += count;
    }

    function emit(op, line) {
      op.line = line;
      ops.push(op);
      return op;
    }

    function resolveAddressLabel(label, line) {
      if (hasOwn(dataLabels, label)) {
        return dataLabels[label];
      }
      if (hasOwn(labels, label)) {
        return labels[label];
      }
      fail('标签不存在: ' + label, line);
    }

    function parseMemOperand(token, line) {
      var m = /^(.*)\(\s*([^()]+?)\s*\)$/.exec(String(token).trim());
      if (!m) {
        fail('内存操作数格式错误，应为 offset($寄存器)', line);
      }
      var offsetText = m[1].trim();
      var baseRegister = parseRegister(m[2], line);
      var offset = 0;
      if (offsetText) {
        offset = parseImmediate(offsetText, line, -32768, 32767,
                                '内存偏移 -32768..32767');
      }
      return { base: baseRegister, offset: offset };
    }

    function emitLi(rd, value, line) {
      var v = value | 0;
      var low = v & 0xffff;
      var high = (v >>> 16) & 0xffff;
      if (v >= -32768 && v <= 32767) {
        emit({ op: 'addiu', rt: rd, rs: 0, imm: v }, line);
      } else if ((v >>> 0) <= 65535) {
        emit({ op: 'ori', rt: rd, rs: 0, imm: low }, line);
      } else {
        emit({ op: 'lui', rt: rd, rs: 0, imm: high }, line);
        if (low !== 0) {
          emit({ op: 'ori', rt: rd, rs: rd, imm: low }, line);
        }
      }
    }

    function requireArgs(args, count, usage, line) {
      if (args.length !== count) {
        fail('操作数数量错误，应为: ' + usage, line);
      }
    }

    /* ----------------------------- data ----------------------------- */

    function directiveData(head, tail, line) {
      var args = tail.trim() ? tokenizeOperands(tail.trim(), line) : [];
      var j;

      if (head === '.data' || head === '.text') {
        if (args.length) {
          fail(head + ' 指令不接受参数', line);
        }
        section = head === '.data' ? 'data' : 'text';
        return;
      }

      if (head === '.globl' || head === '.global') {
        return;
      }

      if (head === '.section') {
        if (args.length !== 1) {
          fail('.section 需要一个段名参数', line);
        }
        var sec = args[0].toLowerCase();
        if (sec === '.data' || sec === 'data' || sec === '.rodata') {
          section = 'data';
        } else if (sec === '.text' || sec === 'text') {
          section = 'text';
        } else {
          fail('不支持的段: ' + args[0], line);
        }
        return;
      }

      if (section !== 'data') {
        fail(head + ' 只能用于 .data 数据段', line);
      }

      if (head === '.word') {
        if (!args.length) {
          fail('.word 至少需要一个值', line);
        }
        for (j = 0; j < args.length; j++) {
          var token = args[j];
          if (isNumericToken(token)) {
            var wordValue = parseNumberToken(token, line) | 0;
            writeMemoryWord(dataBytes, touchedWords, dataPtr, wordValue);
          } else if (LABEL_RE.test(token)) {
            writeMemoryWord(dataBytes, touchedWords, dataPtr, 0);
            dataRelocs.push({ addr: dataPtr, label: token, line: line });
          } else {
            fail('无法识别的 .word 值: ' + token, line);
          }
          advanceData(4, line);
        }
        return;
      }

      if (head === '.half' || head === '.hword') {
        if (!args.length) {
          fail('.half 至少需要一个值', line);
        }
        for (j = 0; j < args.length; j++) {
          var hval = parseNumberToken(args[j], line);
          if (hval < -32768 || hval > 65535) {
            fail('.half 值超出范围: ' + args[j] + '（-32768..65535）', line);
          }
          writeMemoryHalf(dataBytes, touchedWords, dataPtr, hval & 0xffff);
          advanceData(2, line);
        }
        return;
      }

      if (head === '.byte') {
        if (!args.length) {
          fail('.byte 至少需要一个值', line);
        }
        for (j = 0; j < args.length; j++) {
          var bval = parseNumberToken(args[j], line);
          if (bval < -128 || bval > 255) {
            fail('.byte 值超出范围: ' + args[j] + '（-128..255）', line);
          }
          putMemoryByte(dataBytes, touchedWords, dataPtr, bval & 0xff);
          advanceData(1, line);
        }
        return;
      }

      if (head === '.space') {
        requireArgs(args, 1, '.space N', line);
        var n = parseNumberToken(args[0], line);
        if (n < 0 || Math.floor(n) !== n) {
          fail('.space 的大小必须是非负整数', line);
        }
        advanceData(n, line);
        return;
      }

      if (head === '.align') {
        requireArgs(args, 1, '.align n', line);
        var alignPow = parseNumberToken(args[0], line);
        if (alignPow < 0 || alignPow > 16 || Math.floor(alignPow) !== alignPow) {
          fail('.align 的幂次必须在 0..16 之间', line);
        }
        var alignment = Math.pow(2, alignPow);
        var padding = (alignment - (dataPtr % alignment)) % alignment;
        advanceData(padding, line);
        return;
      }

      if (head === '.ascii' || head === '.asciiz') {
        if (!args.length) {
          fail(head + ' 至少需要一个字符串', line);
        }
        var text = '';
        for (j = 0; j < args.length; j++) {
          text += parseStringToken(args[j], line);
        }
        var data = utf8Encode(text);
        if (head === '.asciiz') {
          data.push(0);
        }
        var stringStart = dataPtr;
        advanceData(data.length, line);
        for (j = 0; j < data.length; j++) {
          putMemoryByte(dataBytes, touchedWords, stringStart + j, data[j]);
        }
        return;
      }

      fail('未知伪指令: ' + head, line);
    }

    /* -------------------------- instructions ------------------------- */

    function parseInstruction(head, tail, line) {
      var opname = head.toLowerCase();
      var args = tail.trim() ? tokenizeOperands(tail.trim(), line) : [];
      var result;

      switch (opname) {
        /* R-type arithmetic / logic */
        case 'add':
        case 'addu':
        case 'sub':
        case 'subu':
        case 'and':
        case 'or':
        case 'xor':
        case 'nor':
        case 'slt':
        case 'sltu':
          requireArgs(args, 3, opname + ' rd, rs, rt', line);
          emit({
            op: opname,
            rd: parseRegister(args[0], line),
            rs: parseRegister(args[1], line),
            rt: parseRegister(args[2], line)
          }, line);
          break;

        /* immediate shifts */
        case 'sll':
        case 'srl':
        case 'sra':
          requireArgs(args, 3, opname + ' rd, rt, shamt', line);
          emit({
            op: opname,
            rd: parseRegister(args[0], line),
            rt: parseRegister(args[1], line),
            sa: parseImmediate(args[2], line, 0, 31, '移位量 0..31')
          }, line);
          break;

        /* variable shifts */
        case 'sllv':
        case 'srlv':
        case 'srav':
          requireArgs(args, 3, opname + ' rd, rt, rs', line);
          emit({
            op: opname,
            rd: parseRegister(args[0], line),
            rt: parseRegister(args[1], line),
            rs: parseRegister(args[2], line)
          }, line);
          break;

        case 'jr':
          requireArgs(args, 1, 'jr rs', line);
          emit({ op: 'jr', rs: parseRegister(args[0], line) }, line);
          break;

        case 'mult':
        case 'multu':
        case 'div':
        case 'divu':
          requireArgs(args, 2, opname + ' rs, rt', line);
          emit({
            op: opname,
            rs: parseRegister(args[0], line),
            rt: parseRegister(args[1], line)
          }, line);
          break;

        case 'mfhi':
        case 'mflo':
          requireArgs(args, 1, opname + ' rd', line);
          emit({ op: opname, rd: parseRegister(args[0], line) }, line);
          break;

        case 'syscall':
          if (args.length > 1) {
            fail('syscall 最多接受一个功能号操作数', line);
          }
          result = { op: 'syscall' };
          if (args.length === 1) {
            result.code = parseImmediate(args[0], line, 0, 0xfffff,
                                         'syscall 功能号 0..1048575');
          }
          emit(result, line);
          break;

        /* I-type arithmetic / logic */
        case 'addi':
        case 'addiu':
        case 'slti':
        case 'sltiu':
          requireArgs(args, 3, opname + ' rt, rs, imm', line);
          emit({
            op: opname,
            rt: parseRegister(args[0], line),
            rs: parseRegister(args[1], line),
            imm: parseImmediate(args[2], line, -32768, 32767,
                                '有符号 16 位立即数 -32768..32767')
          }, line);
          break;

        case 'andi':
        case 'ori':
        case 'xori':
          requireArgs(args, 3, opname + ' rt, rs, imm', line);
          emit({
            op: opname,
            rt: parseRegister(args[0], line),
            rs: parseRegister(args[1], line),
            imm: parseImmediate(args[2], line, 0, 65535,
                                '无符号 16 位立即数 0..65535')
          }, line);
          break;

        case 'lui':
          requireArgs(args, 2, 'lui rt, imm', line);
          emit({
            op: 'lui',
            rt: parseRegister(args[0], line),
            rs: 0,
            imm: parseImmediate(args[1], line, 0, 65535,
                                '无符号 16 位立即数 0..65535')
          }, line);
          break;

        /* loads / stores */
        case 'lw':
        case 'sw':
        case 'lb':
        case 'lbu':
        case 'lh':
        case 'lhu':
        case 'sb':
        case 'sh':
          requireArgs(args, 2, opname + ' rt, offset($base)', line);
          var mem = parseMemOperand(args[1], line);
          emit({
            op: opname,
            rt: parseRegister(args[0], line),
            rs: mem.base,
            offset: mem.offset
          }, line);
          break;

        /* conditional branches */
        case 'beq':
        case 'bne':
          requireArgs(args, 3, opname + ' rs, rt, label', line);
          emit({
            op: opname,
            rs: parseRegister(args[0], line),
            rt: parseRegister(args[1], line),
            label: parseLabelOperand(args[2], line)
          }, line);
          break;

        case 'blez':
        case 'bgtz':
        case 'bltz':
        case 'bgez':
          requireArgs(args, 2, opname + ' rs, label', line);
          emit({
            op: opname,
            rs: parseRegister(args[0], line),
            rt: 0,
            label: parseLabelOperand(args[1], line)
          }, line);
          break;

        /* jumps */
        case 'j':
        case 'jal':
          requireArgs(args, 1, opname + ' label', line);
          emit({ op: opname, label: parseLabelOperand(args[0], line) }, line);
          break;

        /* pseudo instructions */
        case 'li':
          requireArgs(args, 2, 'li rd, imm', line);
          emitLi(parseRegister(args[0], line),
                 parseNumberToken(args[1], line), line);
          break;

        case 'la':
          requireArgs(args, 2, 'la rd, label', line);
          var laRd = parseRegister(args[0], line);
          var laLabel = parseLabelOperand(args[1], line);
          emit({ op: 'lui', rt: laRd, rs: 0, imm: 0,
                 patchLabel: laLabel, patchPart: 'high' }, line);
          emit({ op: 'ori', rt: laRd, rs: laRd, imm: 0,
                 patchLabel: laLabel, patchPart: 'low' }, line);
          break;

        case 'move':
          requireArgs(args, 2, 'move rd, rs', line);
          emit({
            op: 'addu',
            rd: parseRegister(args[0], line),
            rs: parseRegister(args[1], line),
            rt: 0
          }, line);
          break;

        case 'nop':
          requireArgs(args, 0, 'nop', line);
          emit({ op: 'sll', rd: 0, rt: 0, sa: 0 }, line);
          break;

        case 'neg':
          requireArgs(args, 2, 'neg rd, rs', line);
          emit({
            op: 'sub',
            rd: parseRegister(args[0], line),
            rs: 0,
            rt: parseRegister(args[1], line)
          }, line);
          break;

        case 'not':
          requireArgs(args, 2, 'not rd, rs', line);
          emit({
            op: 'nor',
            rd: parseRegister(args[0], line),
            rs: parseRegister(args[1], line),
            rt: 0
          }, line);
          break;

        case 'b':
          requireArgs(args, 1, 'b label', line);
          emit({
            op: 'beq',
            rs: 0,
            rt: 0,
            label: parseLabelOperand(args[0], line)
          }, line);
          break;

        case 'beqz':
          requireArgs(args, 2, 'beqz rs, label', line);
          emit({
            op: 'beq',
            rs: parseRegister(args[0], line),
            rt: 0,
            label: parseLabelOperand(args[1], line)
          }, line);
          break;

        case 'bnez':
          requireArgs(args, 2, 'bnez rs, label', line);
          emit({
            op: 'bne',
            rs: parseRegister(args[0], line),
            rt: 0,
            label: parseLabelOperand(args[1], line)
          }, line);
          break;

        case 'blt':
        case 'bltu':
        case 'ble':
        case 'bleu':
        case 'bgt':
        case 'bgtu':
        case 'bge':
        case 'bgeu':
          requireArgs(args, 3, opname + ' rs, rt, label', line);
          var brRs = parseRegister(args[0], line);
          var brRt = parseRegister(args[1], line);
          var brLabel = parseLabelOperand(args[2], line);
          var at = 1;
          var sltOp = (opname === 'bltu' || opname === 'bleu' ||
                       opname === 'bgtu' || opname === 'bgeu') ? 'sltu' : 'slt';
          if (opname === 'blt' || opname === 'bltu') {
            emit({ op: sltOp, rd: at, rs: brRs, rt: brRt }, line);
            emit({ op: 'bne', rs: at, rt: 0, label: brLabel }, line);
          } else if (opname === 'ble' || opname === 'bleu') {
            emit({ op: sltOp, rd: at, rs: brRt, rt: brRs }, line);
            emit({ op: 'beq', rs: at, rt: 0, label: brLabel }, line);
          } else if (opname === 'bgt' || opname === 'bgtu') {
            emit({ op: sltOp, rd: at, rs: brRt, rt: brRs }, line);
            emit({ op: 'bne', rs: at, rt: 0, label: brLabel }, line);
          } else {
            emit({ op: sltOp, rd: at, rs: brRs, rt: brRt }, line);
            emit({ op: 'beq', rs: at, rt: 0, label: brLabel }, line);
          }
          break;

        default:
          fail('未知指令: ' + head, line);
      }
    }

    /* ---------------------------- parse ------------------------------ */

    var lines = code.replace(/\r\n?/g, '\n').split('\n');
    for (var lineNo = 0; lineNo < lines.length; lineNo++) {
      var line = lineNo + 1;
      var text = stripComment(lines[lineNo]).trim();
      if (!text) {
        continue;
      }

      var rest = text;
      var labelMatch;
      while ((labelMatch = /^([A-Za-z_.$][A-Za-z0-9_.$]*)\s*:\s*/.exec(rest))) {
        declareLabel(labelMatch[1], line);
        rest = rest.slice(labelMatch[0].length).trim();
      }
      if (!rest) {
        continue;
      }

      var headMatch = /^(\S+)(?:\s+([\s\S]*))?$/.exec(rest);
      var head = headMatch[1];
      var tail = headMatch[2] || '';

      if (head.charAt(0) === '.') {
        directiveData(head.toLowerCase(), tail, line);
      } else if (section === 'data') {
        fail('数据段不能包含指令: ' + head, line);
      } else {
        parseInstruction(head, tail, line);
      }
    }

    /* Resolve data word label relocations. */
    for (var r = 0; r < dataRelocs.length; r++) {
      var rel = dataRelocs[r];
      var address = resolveAddressLabel(rel.label, rel.line);
      writeMemoryWord(dataBytes, touchedWords, rel.addr, address | 0);
    }

    /* Resolve branch/jump labels and la() patches. */
    for (var pcIndex = 0; pcIndex < ops.length; pcIndex++) {
      var op = ops[pcIndex];

      if (op.label !== undefined) {
        if (!hasOwn(labels, op.label)) {
          fail('标签不存在: ' + op.label, op.line);
        }
        if (op.op === 'j' || op.op === 'jal') {
          op.target = labels[op.label];
        } else {
          op.offset = labels[op.label] - (pcIndex + 1);
        }
        delete op.label;
      }

      if (op.patchLabel !== undefined) {
        var patchAddress = resolveAddressLabel(op.patchLabel, op.line);
        if (op.patchPart === 'high') {
          op.imm = (patchAddress >>> 16) & 0xffff;
        } else {
          op.imm = patchAddress & 0xffff;
        }
        delete op.patchLabel;
        delete op.patchPart;
      }
    }

    var words = [];
    for (var w = 0; w < ops.length; w++) {
      words.push({
        addr: w * 4,
        value: encodeInstruction(ops[w]) >>> 0
      });
    }

    return {
      ops: ops,
      labels: labels,
      dataLabels: dataLabels,
      dataBytes: dataBytes,
      touchedWords: touchedWords,
      words: words,
      count: ops.length
    };
  }

  function assemble(code) {
    try {
      var assembled = assembleInternal(code);
      return {
        ok: true,
        error: null,
        labels: copyMap(assembled.labels),
        dataLabels: copyMap(assembled.dataLabels),
        words: assembled.words,
        count: assembled.count
      };
    } catch (err) {
      return {
        ok: false,
        error: formatError(err),
        labels: {},
        dataLabels: {},
        words: [],
        count: 0
      };
    }
  }

  /* ------------------------------------------------------------------ */
  /* Interpreter                                                        */
  /* ------------------------------------------------------------------ */

  function readSigned32(value) {
    if (typeof value !== 'number' || !isFinite(value) ||
        Math.floor(value) !== value) {
      fail('寄存器或内存初值必须是整数');
    }
    if (value < -2147483648 || value > 4294967295) {
      fail('寄存器或内存初值超出 32 位范围: ' + value);
    }
    return value | 0;
  }

  function readAddressKey(key) {
    var text = String(key).trim();
    if (!/^(?:[0-9]+|0[xX][0-9a-fA-F]+)$/.test(text)) {
      fail('内存起始地址格式错误: ' + key);
    }
    var address = Number(text);
    if (!isFinite(address) || Math.floor(address) !== address ||
        address < 0 || address > 4294967295) {
      fail('内存起始地址超出 32 位范围: ' + key);
    }
    return address;
  }

  function run(code, init) {
    var invalidInit = false;
    if (init === undefined || init === null) {
      init = {};
    } else if (typeof init !== 'object' || Array.isArray(init)) {
      init = {};
      invalidInit = true;
    }

    var regs = [];
    for (var ri = 0; ri < 32; ri++) {
      regs.push(0);
    }
    regs[28] = 0x10008000 | 0; /* gp */
    regs[29] = 0x7fffeffc | 0; /* sp */
    regs[31] = -1;             /* ra */

    var steps = 0;
    var output = '';
    var hi = 0;
    var lo = 0;
    var maxSteps = DEFAULT_MAX_STEPS;
    var bytes = Object.create(null);
    var touchedWords = Object.create(null);
    var ops = [];
    var labels = Object.create(null);

    function snapshot(ok, error) {
      var regsObject = {};
      var regsRaw = [];
      for (var r = 0; r < 32; r++) {
        var value = r === 0 ? 0 : regs[r] | 0;
        regs[r] = value;
        regsObject[REG_NAMES[r]] = value;
        regsRaw.push(value);
      }
      return {
        ok: !!ok,
        error: ok ? null : (error || '未知错误'),
        steps: steps,
        regs: regsObject,
        regsRaw: regsRaw,
        mem: snapshotMemory(bytes, touchedWords),
        output: output
      };
    }

    try {
      if (invalidInit) {
        fail('init 必须是对象');
      }
      if (typeof code !== 'string') {
        fail('源代码必须是字符串');
      }

      if (init.maxSteps !== undefined) {
        if (typeof init.maxSteps !== 'number' || !isFinite(init.maxSteps) ||
            Math.floor(init.maxSteps) !== init.maxSteps ||
            init.maxSteps < 0) {
          fail('init.maxSteps 必须是非负整数');
        }
        maxSteps = init.maxSteps;
      }

      if (init.regs !== undefined && init.regs !== null) {
        if (typeof init.regs !== 'object' || Array.isArray(init.regs)) {
          fail('init.regs 必须是对象');
        }
        var regKeys = Object.keys(init.regs);
        for (var rk = 0; rk < regKeys.length; rk++) {
          var regIndex;
          try {
            regIndex = registerNameForInit(regKeys[rk]);
          } catch (regErr) {
            fail('初始化寄存器错误: ' + regErr.message);
          }
          regs[regIndex] = readSigned32(init.regs[regKeys[rk]]);
        }
        regs[0] = 0;
      }

      var assembled = assembleInternal(code);
      ops = assembled.ops;
      labels = assembled.labels;
      bytes = assembled.dataBytes;
      touchedWords = assembled.touchedWords;

      if (init.memory !== undefined && init.memory !== null) {
        if (typeof init.memory !== 'object' || Array.isArray(init.memory)) {
          fail('init.memory 必须是对象');
        }
        var memKeys = Object.keys(init.memory);
        var memEntries = [];
        for (var mk = 0; mk < memKeys.length; mk++) {
          memEntries.push({
            address: readAddressKey(memKeys[mk]),
            values: init.memory[memKeys[mk]],
            key: memKeys[mk]
          });
        }
        memEntries.sort(function (a, b) {
          return a.address - b.address;
        });
        for (var me = 0; me < memEntries.length; me++) {
          var entry = memEntries[me];
          if (!Array.isArray(entry.values)) {
            fail('init.memory[' + entry.key + '] 必须是数组');
          }
          for (var mv = 0; mv < entry.values.length; mv++) {
            var address = entry.address + mv * 4;
            if (address + 3 > 4294967295) {
              fail('init.memory[' + entry.key + '] 超出 32 位地址空间');
            }
            var word = readSigned32(entry.values[mv]);
            writeMemoryWord(bytes, touchedWords, address, word);
          }
        }
      }

      function readReg(index) {
        return index === 0 ? 0 : (regs[index] | 0);
      }

      function writeReg(index, value) {
        if (index !== 0) {
          regs[index] = value | 0;
        }
      }

      function effectiveAddress(op) {
        return ((readReg(op.rs) + op.offset) >>> 0);
      }

      function ensureAligned(op, address, alignment) {
        if ((address & (alignment - 1)) !== 0) {
          fail(op.op + ' 地址 ' + hexAddress(address) +
               ' 未按 ' + alignment + ' 字节对齐', op.line);
        }
      }

      function readCString(op, address) {
        var collected = [];
        var addr = address >>> 0;
        var n;
        for (n = 0; n < MAX_STRING_BYTES; n++) {
          var b = memoryByte(bytes, addr);
          if (b === 0) {
            return utf8Decode(collected);
          }
          collected.push(b);
          addr = (addr + 1) >>> 0;
        }
        fail('syscall 4 的字符串缺少 NUL 结束符或过长', op.line);
      }

      function signExtend16(value) {
        return (value << 16) >> 16;
      }

      function bigSigned32(value) {
        var n = value & 0xffffffffn;
        if (n >= 0x80000000n) {
          n -= 0x100000000n;
        }
        return Number(n);
      }

      function signedBig(value) {
        return BigInt(value);
      }

      function unsignedBig(value) {
        return BigInt(value >>> 0);
      }

      function branchRelative(op, offset, pc, nextValue) {
        var target = pc + 1 + offset;
        if (target < 0 || target > ops.length) {
          fail('分支目标越界: ' + target, op.line);
        }
        return target;
      }

      function jumpAbsolute(op, target) {
        if (target < 0 || target > ops.length) {
          fail('跳转目标越界: ' + target, op.line);
        }
        return target;
      }

      var pc = 0;
      var halted = false;

      while (!halted && pc < ops.length) {
        if (steps >= maxSteps) {
          fail('运行超过 ' + maxSteps + ' 步，可能存在死循环', ops[pc].line);
        }

        var op = ops[pc];
        var nextPc = pc + 1;
        steps++;

        switch (op.op) {
          case 'add':
          case 'addu':
            writeReg(op.rd, (readReg(op.rs) + readReg(op.rt)) | 0);
            break;
          case 'sub':
          case 'subu':
            writeReg(op.rd, (readReg(op.rs) - readReg(op.rt)) | 0);
            break;
          case 'and':
            writeReg(op.rd, readReg(op.rs) & readReg(op.rt));
            break;
          case 'or':
            writeReg(op.rd, readReg(op.rs) | readReg(op.rt));
            break;
          case 'xor':
            writeReg(op.rd, readReg(op.rs) ^ readReg(op.rt));
            break;
          case 'nor':
            writeReg(op.rd, ~(readReg(op.rs) | readReg(op.rt)));
            break;
          case 'slt':
            writeReg(op.rd, readReg(op.rs) < readReg(op.rt) ? 1 : 0);
            break;
          case 'sltu':
            writeReg(op.rd,
                     (readReg(op.rs) >>> 0) < (readReg(op.rt) >>> 0) ? 1 : 0);
            break;
          case 'sll':
            writeReg(op.rd, (readReg(op.rt) << (op.sa & 31)) | 0);
            break;
          case 'srl':
            writeReg(op.rd, (readReg(op.rt) >>> (op.sa & 31)) | 0);
            break;
          case 'sra':
            writeReg(op.rd, readReg(op.rt) >> (op.sa & 31));
            break;
          case 'sllv':
            writeReg(op.rd,
                     (readReg(op.rt) << (readReg(op.rs) & 31)) | 0);
            break;
          case 'srlv':
            writeReg(op.rd,
                     (readReg(op.rt) >>> (readReg(op.rs) & 31)) | 0);
            break;
          case 'srav':
            writeReg(op.rd, readReg(op.rt) >> (readReg(op.rs) & 31));
            break;
          case 'jr':
            var jrTarget = readReg(op.rs);
            if (op.rs === 31 && jrTarget === -1) {
              halted = true;
            } else {
              nextPc = jumpAbsolute(op, jrTarget);
            }
            break;
          case 'mult':
          case 'multu':
            var ma = readReg(op.rs);
            var mb = readReg(op.rt);
            var product = (op.op === 'multu')
              ? unsignedBig(ma) * unsignedBig(mb)
              : signedBig(ma) * signedBig(mb);
            lo = bigSigned32(product);
            hi = bigSigned32(product >> 32n);
            break;
          case 'div':
          case 'divu':
            var da = readReg(op.rs);
            var db = readReg(op.rt);
            if (db === 0) {
              fail('除数不能为 0', op.line);
            }
            var quotient, remainder;
            if (op.op === 'divu') {
              quotient = unsignedBig(da) / unsignedBig(db);
              remainder = unsignedBig(da) % unsignedBig(db);
            } else {
              quotient = signedBig(da) / signedBig(db);
              remainder = signedBig(da) % signedBig(db);
            }
            lo = bigSigned32(quotient);
            hi = bigSigned32(remainder);
            break;
          case 'mfhi':
            writeReg(op.rd, hi);
            break;
          case 'mflo':
            writeReg(op.rd, lo);
            break;
          case 'syscall':
            var syscallCode = op.code === undefined ? readReg(2) : op.code;
            if (syscallCode === 1) {
              output += String(readReg(4));
            } else if (syscallCode === 10) {
              halted = true;
            } else if (syscallCode === 11) {
              output += String.fromCharCode(readReg(4) & 0xff);
            } else if (syscallCode === 4) {
              output += readCString(op, readReg(4));
            } else {
              fail('不支持的 syscall 功能号: ' + syscallCode, op.line);
            }
            break;
          case 'addi':
          case 'addiu':
            writeReg(op.rt,
                     (readReg(op.rs) + signExtend16(op.imm)) | 0);
            break;
          case 'andi':
            writeReg(op.rt, readReg(op.rs) & (op.imm & 0xffff));
            break;
          case 'ori':
            writeReg(op.rt, readReg(op.rs) | (op.imm & 0xffff));
            break;
          case 'xori':
            writeReg(op.rt, readReg(op.rs) ^ (op.imm & 0xffff));
            break;
          case 'slti':
            writeReg(op.rt,
                     readReg(op.rs) < signExtend16(op.imm) ? 1 : 0);
            break;
          case 'sltiu':
            writeReg(op.rt,
                     (readReg(op.rs) >>> 0) <
                     (signExtend16(op.imm) >>> 0) ? 1 : 0);
            break;
          case 'lui':
            writeReg(op.rt, ((op.imm & 0xffff) << 16) | 0);
            break;
          case 'lw':
            var lwAddr = effectiveAddress(op);
            ensureAligned(op, lwAddr, 4);
            writeReg(op.rt, readMemoryWord(bytes, lwAddr));
            break;
          case 'sw':
            var swAddr = effectiveAddress(op);
            ensureAligned(op, swAddr, 4);
            writeMemoryWord(bytes, touchedWords, swAddr, readReg(op.rt));
            break;
          case 'lb':
            var lbAddr = effectiveAddress(op);
            var lbValue = memoryByte(bytes, lbAddr);
            writeReg(op.rt, (lbValue << 24) >> 24);
            break;
          case 'lbu':
            var lbuAddr = effectiveAddress(op);
            writeReg(op.rt, memoryByte(bytes, lbuAddr));
            break;
          case 'lh':
            var lhAddr = effectiveAddress(op);
            ensureAligned(op, lhAddr, 2);
            var lhValue = readMemoryHalf(bytes, lhAddr);
            writeReg(op.rt, (lhValue << 16) >> 16);
            break;
          case 'lhu':
            var lhuAddr = effectiveAddress(op);
            ensureAligned(op, lhuAddr, 2);
            writeReg(op.rt, readMemoryHalf(bytes, lhuAddr));
            break;
          case 'sb':
            var sbAddr = effectiveAddress(op);
            putMemoryByte(bytes, touchedWords, sbAddr, readReg(op.rt) & 0xff);
            break;
          case 'sh':
            var shAddr = effectiveAddress(op);
            ensureAligned(op, shAddr, 2);
            writeMemoryHalf(bytes, touchedWords, shAddr, readReg(op.rt));
            break;
          case 'beq':
            if (readReg(op.rs) === readReg(op.rt)) {
              nextPc = branchRelative(op, op.offset, pc);
            }
            break;
          case 'bne':
            if (readReg(op.rs) !== readReg(op.rt)) {
              nextPc = branchRelative(op, op.offset, pc);
            }
            break;
          case 'blez':
            if (readReg(op.rs) <= 0) {
              nextPc = branchRelative(op, op.offset, pc);
            }
            break;
          case 'bgtz':
            if (readReg(op.rs) > 0) {
              nextPc = branchRelative(op, op.offset, pc);
            }
            break;
          case 'bltz':
            if (readReg(op.rs) < 0) {
              nextPc = branchRelative(op, op.offset, pc);
            }
            break;
          case 'bgez':
            if (readReg(op.rs) >= 0) {
              nextPc = branchRelative(op, op.offset, pc);
            }
            break;
          case 'j':
            nextPc = jumpAbsolute(op, op.target);
            break;
          case 'jal':
            writeReg(31, nextPc);
            nextPc = jumpAbsolute(op, op.target);
            break;
          default:
            fail('内部错误: 未知执行指令 ' + op.op, op.line);
        }

        if (halted) {
          break;
        }
        if (nextPc < 0 || nextPc > ops.length) {
          fail('指令地址越界: ' + nextPc, op.line);
        }
        pc = nextPc;
      }

      return snapshot(true, null);
    } catch (err) {
      return snapshot(false, formatError(err));
    }
  }

  root.MIPS = { run: run, assemble: assemble };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.MIPS;
  }
})(typeof window !== 'undefined' ? window : globalThis);

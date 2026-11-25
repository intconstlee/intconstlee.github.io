/*
 * 纯前端、离线的 SystemVerilog 组合逻辑判题引擎。
 * 兼容经典浏览器脚本与 CommonJS，不依赖 DOM / fs / eval。
 */
(function (root) {
  'use strict';

  var MAX_CODE_LENGTH = 20000;
  var MAX_WIDTH = 4096;
  var MAX_ROUNDS = 200;
  var MAX_LOOP_ITERATIONS = 10000;
  var MAX_OPS = 5000000;
  var TIME_LIMIT_MS = 4000;

  function HdlError(message, line) {
    this.name = 'HdlError';
    this.message = message;
    this.line = (typeof line === 'number' && line > 0) ? line : null;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HdlError);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
  HdlError.prototype = Object.create(Error.prototype);
  HdlError.prototype.constructor = HdlError;

  function formatError(e) {
    if (e instanceof HdlError) {
      return e.line ? ('第 ' + e.line + ' 行：' + e.message) : e.message;
    }
    var detail = e && e.message ? e.message : String(e);
    return '评测失败：' + detail;
  }

  var maskCache = new Map();
  function maskFor(width) {
    if (width <= 0) return 0n;
    var cached = maskCache.get(width);
    if (cached !== undefined) return cached;
    var value = (1n << BigInt(width)) - 1n;
    maskCache.set(width, value);
    return value;
  }

  function maskValue(value, width) {
    if (width <= 0) return 0n;
    return value & maskFor(width);
  }

  function bitLengthOf(value) {
    var n = 0;
    var v = value < 0n ? -value : value;
    while (v > 0n) {
      n++;
      v >>= 1n;
    }
    return n;
  }

  function ceilLog2(value) {
    if (value <= 1n) return 0n;
    var v = value - 1n;
    var n = 0n;
    while (v > 0n) {
      n++;
      v >>= 1n;
    }
    return n;
  }

  function toSafeInteger(value, line, what) {
    var limit = BigInt(Number.MAX_SAFE_INTEGER);
    if (value > limit || value < -limit) {
      throw new HdlError((what || '常量') + '过大', line);
    }
    return Number(value);
  }

  function isDigitChar(c) {
    return c >= '0' && c <= '9';
  }

  function isIdentStart(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$';
  }

  function isIdentChar(c) {
    return isIdentStart(c) || isDigitChar(c);
  }

  function isBaseBodyChar(c) {
    return isDigitChar(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F') ||
      c === 'x' || c === 'X' || c === 'z' || c === 'Z' || c === '?' || c === '_';
  }

  var TYPE_WORDS = {
    logic: true, wire: true, reg: true, integer: true, int: true, bit: true,
    signed: true, unsigned: true
  };
  var BASE_TYPE_WORDS = {
    logic: true, wire: true, reg: true, integer: true, int: true, bit: true
  };
  var RESERVED = {};
  [
    'module', 'endmodule', 'input', 'output', 'inout', 'logic', 'wire', 'reg',
    'integer', 'int', 'bit', 'signed', 'unsigned', 'assign', 'always',
    'always_comb', 'always_ff', 'always_latch', 'begin', 'end', 'if', 'else',
    'case', 'casez', 'casex', 'endcase', 'default', 'parameter', 'localparam',
    'for', 'posedge', 'negedge', 'or', 'and', 'not', 'initial', 'generate',
    'genvar', 'function', 'task', 'endfunction', 'endtask', 'unique', 'priority',
    'unique0', 'return'
  ].forEach(function (word) { RESERVED[word] = true; });

  var UNARY_OPS = {
    '!': true, '~': true, '&': true, '|': true, '^': true,
    '~&': true, '~|': true, '~^': true, '^~': true, '+': true, '-': true
  };

  var BINARY_PRECEDENCE = [
    ['||'],
    ['&&'],
    ['|'],
    ['^', '~^', '^~'],
    ['&'],
    ['==', '!=', '===', '!=='],
    ['<', '<=', '>', '>='],
    ['<<', '>>', '>>>', '<<<'],
    ['+', '-'],
    ['*', '/', '%']
  ];

  /* ------------------------------------------------------------------ */
  /* 词法分析                                                           */
  /* ------------------------------------------------------------------ */

  function tokenize(code) {
    var tokens = [];
    var i = 0;
    var line = 1;
    var len = code.length;

    while (i < len) {
      var c = code[i];

      if (c === '\n') { line++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v') {
        i++;
        continue;
      }

      if (c === '/' && code[i + 1] === '/') {
        i += 2;
        while (i < len && code[i] !== '\n') i++;
        continue;
      }
      if (c === '/' && code[i + 1] === '*') {
        var commentLine = line;
        i += 2;
        var closed = false;
        while (i < len) {
          if (code[i] === '*' && code[i + 1] === '/') {
            i += 2;
            closed = true;
            break;
          }
          if (code[i] === '\n') line++;
          i++;
        }
        if (!closed) throw new HdlError('块注释未闭合', commentLine);
        continue;
      }

      if (isDigitChar(c)) {
        var numStart = i;
        var numLine = line;
        while (i < len && (isDigitChar(code[i]) || code[i] === '_')) i++;
        if (code[i] === "'") {
          i++;
          if (code[i] === 's' || code[i] === 'S') i++;
          if (i < len && /[bBoOdDhH]/.test(code[i])) {
            i++;
            while (i < len && isBaseBodyChar(code[i])) i++;
          } else {
            throw new HdlError('无效的数字常量', numLine);
          }
        }
        tokens.push({ type: 'num', value: code.slice(numStart, i), line: numLine });
        continue;
      }

      if (c === "'") {
        var apostropheStart = i;
        var apostropheLine = line;
        i++;
        if (code[i] === 's' || code[i] === 'S') i++;
        if (i < len && /[bBoOdDhH]/.test(code[i])) {
          i++;
          while (i < len && isBaseBodyChar(code[i])) i++;
        } else if (i < len && /[01xXzZ?]/.test(code[i])) {
          i++;
        } else {
          throw new HdlError('无效的数字常量', apostropheLine);
        }
        tokens.push({ type: 'num', value: code.slice(apostropheStart, i), line: apostropheLine });
        continue;
      }

      if (isIdentStart(c)) {
        var idStart = i;
        var idLine = line;
        while (i < len && isIdentChar(code[i])) i++;
        tokens.push({ type: 'id', value: code.slice(idStart, i), line: idLine });
        continue;
      }

      var three = code.slice(i, i + 3);
      if (three === '===' || three === '!==' || three === '<<<' || three === '>>>') {
        tokens.push({ type: 'op', value: three, line: line });
        i += 3;
        continue;
      }
      var two = code.slice(i, i + 2);
      if (two === '==' || two === '!=' || two === '<=' || two === '>=' ||
          two === '&&' || two === '||' || two === '<<' || two === '>>' ||
          two === '~^' || two === '^~' || two === '~&' || two === '~|') {
        tokens.push({ type: 'op', value: two, line: line });
        i += 2;
        continue;
      }

      if ('~!&|^+-*/%<>=?:;,.#@()[]{}'.indexOf(c) >= 0) {
        tokens.push({ type: 'op', value: c, line: line });
        i++;
        continue;
      }

      if (c === '`') {
        throw new HdlError('不支持预处理指令', line);
      }
      throw new HdlError('无法识别的字符“' + c + '”', line);
    }

    tokens.push({ type: 'eof', value: '', line: line });
    return tokens;
  }

  function parseNumberToken(raw, line) {
    var fillMatch = /^'([01])$/.exec(raw);
    if (fillMatch) {
      return {
        type: 'num',
        value: fillMatch[1] === '1' ? 1n : 0n,
        width: 1,
        isFill: true,
        fillBit: fillMatch[1] === '1' ? 1 : 0,
        wildMask: 0n,
        line: line
      };
    }

    if (/^'[xXzZ?]$/.test(raw)) {
      throw new HdlError('不支持未定值常量“' + raw + '”', line);
    }

    var based = /^(?:(\d[\d_]*))?'([sS])?([bBoOdDhH])([0-9a-fA-FxXzZ?_]+)$/.exec(raw);
    if (based) {
      var sizeText = based[1];
      var base = based[3].toLowerCase();
      var digits = based[4].replace(/_/g, '').toLowerCase();
      var width;
      var value;
      var wildMask = 0n;

      if (sizeText !== undefined) {
        width = Number(sizeText.replace(/_/g, ''));
        if (!Number.isInteger(width) || width < 1) {
          throw new HdlError('常量位宽必须大于 0', line);
        }
        if (width > MAX_WIDTH) {
          throw new HdlError('常量位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', line);
        }
      }

      if (base === 'd') {
        if (!/^\d+$/.test(digits)) {
          throw new HdlError('十进制常量包含非法字符或 X/Z', line);
        }
        value = BigInt(digits);
        if (width === undefined) width = Math.max(32, bitLengthOf(value));
        if (width > MAX_WIDTH) {
          throw new HdlError('常量位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', line);
        }
        value = maskValue(value, width);
      } else {
        var bitsPer = base === 'b' ? 1 : (base === 'o' ? 3 : 4);
        var radix = base === 'b' ? 2 : (base === 'o' ? 8 : 16);
        var digitWidth = bitsPer;
        var naturalWidth = digitWidth * digits.length;

        for (var k = 0; k < digits.length; k++) {
          var ch = digits[k];
          var dv = 0;
          var wild = false;
          if (ch === 'x' || ch === 'z' || ch === '?') {
            wild = true;
          } else {
            dv = parseInt(ch, radix);
            if (!isFinite(dv) || dv < 0 || dv >= Math.pow(2, bitsPer)) {
              throw new HdlError('数字常量“' + raw + '”包含非法数字', line);
            }
          }
          if (wild) {
            value = (value === undefined ? 0n : value) << BigInt(bitsPer);
            wildMask = (wildMask << BigInt(bitsPer)) | maskFor(bitsPer);
          } else {
            value = (value === undefined ? 0n : value) << BigInt(bitsPer);
            value = value | BigInt(dv);
            wildMask = wildMask << BigInt(bitsPer);
          }
        }
        if (value === undefined) value = 0n;
        if (width === undefined) width = Math.max(32, naturalWidth);
        if (width > MAX_WIDTH) {
          throw new HdlError('常量位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', line);
        }
        value = value & maskFor(width);
        wildMask = wildMask & maskFor(width);
      }

      return {
        type: 'num',
        value: value,
        width: width,
        isFill: false,
        fillBit: 0,
        wildMask: wildMask,
        line: line
      };
    }

    if (/^\d[\d_]*$/.test(raw)) {
      var dec = BigInt(raw.replace(/_/g, ''));
      var w = Math.max(32, bitLengthOf(dec));
      if (w > MAX_WIDTH) {
        throw new HdlError('常量位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', line);
      }
      return {
        type: 'num',
        value: maskValue(dec, w),
        width: w,
        isFill: false,
        fillBit: 0,
        wildMask: 0n,
        line: line
      };
    }

    throw new HdlError('无效的数字常量“' + raw + '”', line);
  }

  /* ------------------------------------------------------------------ */
  /* 语法分析                                                           */
  /* ------------------------------------------------------------------ */

  function Parser(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  Parser.prototype.peek = function (offset) {
    var idx = this.pos + (offset || 0);
    if (idx < 0) idx = 0;
    if (idx >= this.tokens.length) idx = this.tokens.length - 1;
    return this.tokens[idx];
  };

  Parser.prototype.next = function () {
    var token = this.peek();
    if (token.type !== 'eof') this.pos++;
    return token;
  };

  Parser.prototype.check = function (value) {
    return this.peek().value === value;
  };

  Parser.prototype.checkKeyword = function (value) {
    var token = this.peek();
    return token.type === 'id' && token.value === value;
  };

  Parser.prototype.accept = function (value) {
    if (this.check(value)) {
      this.pos++;
      return true;
    }
    return false;
  };

  Parser.prototype.acceptKeyword = function (value) {
    if (this.checkKeyword(value)) {
      this.pos++;
      return true;
    }
    return false;
  };

  Parser.prototype.expect = function (value, message) {
    if (!this.check(value)) {
      throw new HdlError(message || ('缺少“' + value + '”'), this.peek().line);
    }
    this.pos++;
  };

  Parser.prototype.expectIdentifier = function (desc) {
    var token = this.peek();
    if (token.type !== 'id' || RESERVED[token.value] || token.value.charAt(0) === '$') {
      throw new HdlError('此处需要' + (desc || '标识符'), token.line);
    }
    this.pos++;
    return token;
  };

  Parser.prototype.unexpected = function (message) {
    var token = this.peek();
    throw new HdlError(message || ('无法识别的内容“' + (token.value || '文件结尾') + '”'), token.line);
  };

  Parser.prototype.parseSource = function () {
    var modules = [];
    while (this.peek().type !== 'eof') {
      if (this.accept(';')) continue;
      if (this.checkKeyword('module')) {
        modules.push(this.parseModule());
      } else if (modules.length === 0) {
        throw new HdlError('没有找到 module', this.peek().line);
      } else {
        this.unexpected();
      }
    }
    if (modules.length === 0) {
      throw new HdlError('没有找到 module');
    }
    return modules;
  };

  Parser.prototype.parseModule = function () {
    var start = this.peek();
    this.expect('module');
    var nameToken = this.expectIdentifier('模块名');
    var params = [];

    if (this.accept('#')) {
      this.expect('(', '括号不匹配');
      if (!this.check(')')) params = this.parseParameterItems('parameter');
      this.expect(')', '括号不匹配');
    }

    var ports = [];
    if (this.accept('(')) {
      ports = this.parsePortList();
    }

    this.expect(';', '模块声明缺少分号');
    var body = this.parseModuleBody();
    return {
      name: nameToken.value,
      line: start.line,
      params: params,
      ports: ports,
      body: body
    };
  };

  Parser.prototype.parsePortList = function () {
    var ports = [];
    if (this.accept(')')) return ports;

    var t = this.peek();
    var ansi = t.type === 'id' && (t.value === 'input' || t.value === 'output' || t.value === 'inout');

    if (!ansi) {
      while (true) {
        var pname = this.expectIdentifier('端口名');
        ports.push({
          name: pname.value,
          direction: null,
          type: null,
          range: null,
          line: pname.line,
          ansi: false
        });
        if (this.accept(',')) {
          if (this.check(')')) throw new HdlError('端口列表存在多余的逗号', this.peek().line);
          continue;
        }
        break;
      }
      this.expect(')', '括号不匹配');
      return ports;
    }

    var direction = null;
    var type = null;
    var range = null;
    while (true) {
      if (this.peek().type === 'id' &&
          (this.peek().value === 'input' || this.peek().value === 'output' || this.peek().value === 'inout')) {
        var dirToken = this.next();
        if (dirToken.value === 'inout') {
          throw new HdlError('暂不支持 inout 端口', dirToken.line);
        }
        direction = dirToken.value;
        var typeInfo = this.parseTypePrefix();
        type = typeInfo.type;
        range = null;
        if (this.check('[')) range = this.parseRange();
      }

      if (!direction) {
        throw new HdlError('ANSI 端口声明缺少 input/output', this.peek().line);
      }

      var nameToken = this.expectIdentifier('端口名');
      ports.push({
        name: nameToken.value,
        direction: direction,
        type: type,
        range: range,
        line: nameToken.line,
        ansi: true
      });

      if (this.accept(',')) {
        if (this.check(')')) throw new HdlError('端口列表存在多余的逗号', this.peek().line);
        continue;
      }
      break;
    }

    this.expect(')', '括号不匹配');
    return ports;
  };

  Parser.prototype.parseTypePrefix = function () {
    var line = this.peek().line;
    var type = null;
    while (this.peek().type === 'id') {
      var value = this.peek().value;
      if (value === 'signed' || value === 'unsigned') {
        this.next();
        continue;
      }
      if (TYPE_WORDS[value] && value !== 'signed' && value !== 'unsigned') {
        type = value;
        this.next();
        continue;
      }
      break;
    }
    return { type: type, line: line };
  };

  Parser.prototype.parseRange = function () {
    var line = this.peek().line;
    this.expect('[', '方括号不匹配');
    var msb = this.parseExpression();
    this.expect(':', '位宽范围缺少冒号');
    var lsb = this.parseExpression();
    this.expect(']', '方括号不匹配');
    return { msb: msb, lsb: lsb, line: line };
  };

  Parser.prototype.parseModuleBody = function () {
    var body = {
      portDecls: [],
      varDecls: [],
      params: [],
      constructs: []
    };

    while (!this.checkKeyword('endmodule')) {
      if (this.peek().type === 'eof') {
        throw new HdlError('缺少 endmodule', this.peek().line);
      }
      if (this.accept(';')) continue;

      var token = this.peek();
      if (token.type !== 'id') {
        this.unexpected();
      }

      if (token.value === 'input' || token.value === 'output' || token.value === 'inout') {
        body.portDecls.push(this.parseBodyPortDecl());
        continue;
      }
      if (BASE_TYPE_WORDS[token.value]) {
        body.varDecls.push(this.parseVariableDecl());
        continue;
      }
      if (token.value === 'parameter' || token.value === 'localparam') {
        var defs = this.parseParameterItems(null);
        this.expect(';', '参数声明缺少分号');
        body.params = body.params.concat(defs);
        continue;
      }
      if (token.value === 'assign') {
        this.next();
        var assigns = this.parseContinuousAssign();
        body.constructs = body.constructs.concat(assigns);
        continue;
      }
      if (token.value === 'always_comb' || token.value === 'always') {
        body.constructs.push(this.parseAlwaysConstruct());
        continue;
      }
      if (token.value === 'always_ff' || token.value === 'always_latch') {
        throw new HdlError('暂不支持时序逻辑块 ' + token.value, token.line);
      }
      if (token.value === 'initial') {
        throw new HdlError('暂不支持 initial 块', token.line);
      }
      if (token.value === 'function' || token.value === 'task' ||
          token.value === 'generate' || token.value === 'genvar') {
        throw new HdlError('暂不支持 ' + token.value, token.line);
      }

      this.unexpected();
    }

    this.expect('endmodule');
    if (this.accept(':')) {
      this.expectIdentifier('模块结束标签');
    }
    return body;
  };

  Parser.prototype.parseBodyPortDecl = function () {
    var dirToken = this.next();
    if (dirToken.value === 'inout') {
      throw new HdlError('暂不支持 inout 端口', dirToken.line);
    }
    var typeInfo = this.parseTypePrefix();
    var range = null;
    if (this.check('[')) range = this.parseRange();
    var names = [];
    while (true) {
      names.push(this.expectIdentifier('端口名').value);
      if (!this.accept(',')) break;
      if (this.peek().value === ';' || this.peek().type === 'eof') {
        throw new HdlError('端口声明存在多余的逗号', this.peek().line);
      }
    }
    this.expect(';', '端口声明缺少分号');
    return {
      direction: dirToken.value,
      type: typeInfo.type,
      range: range,
      names: names,
      line: dirToken.line
    };
  };

  Parser.prototype.parseVariableDecl = function () {
    var typeToken = this.next();
    var type = typeToken.value;
    var extra = this.parseTypePrefix();
    if (extra.type) type = extra.type;
    var range = null;
    if (this.check('[')) range = this.parseRange();
    var names = [];
    while (true) {
      names.push(this.expectIdentifier('信号名').value);
      if (this.check('=')) {
        throw new HdlError('暂不支持声明信号时赋初值', this.peek().line);
      }
      if (!this.accept(',')) break;
      if (this.peek().value === ';' || this.peek().type === 'eof') {
        throw new HdlError('声明末尾存在多余的逗号', this.peek().line);
      }
    }
    this.expect(';', '声明缺少分号');
    return {
      type: type,
      range: range,
      names: names,
      line: typeToken.line
    };
  };

  Parser.prototype.parseParameterItems = function (initialKind) {
    var defs = [];
    var kind = initialKind || null;

    while (true) {
      if (this.checkKeyword('parameter') || this.checkKeyword('localparam')) {
        kind = this.next().value;
      } else if (!kind) {
        throw new HdlError('参数声明缺少 parameter 或 localparam', this.peek().line);
      }

      var typeInfo = this.parseTypePrefix();
      var range = null;
      if (this.check('[')) range = this.parseRange();
      var nameToken = this.expectIdentifier('参数名');
      this.expect('=', '参数缺少默认值');
      var expr = this.parseExpression();
      defs.push({
        name: nameToken.value,
        expr: expr,
        kind: kind,
        type: typeInfo.type,
        range: range,
        line: nameToken.line
      });

      if (this.accept(',')) {
        if (this.check(')') || this.check(';') || this.peek().type === 'eof') {
          throw new HdlError('参数列表存在多余的逗号', this.peek().line);
        }
        continue;
      }
      break;
    }
    return defs;
  };

  Parser.prototype.parseContinuousAssign = function () {
    var result = [];
    while (true) {
      var line = this.peek().line;
      var lhs = this.parseLvalue();
      this.expect('=', 'assign 语句缺少 =');
      var expr = this.parseExpression();
      result.push({ kind: 'assign', lhs: lhs, expr: expr, line: line });
      if (this.accept(',')) continue;
      this.expect(';', '缺少分号');
      break;
    }
    return result;
  };

  Parser.prototype.parseAlwaysConstruct = function () {
    var start = this.next();
    var line = start.line;

    if (start.value === 'always') {
      if (!this.accept('@')) {
        throw new HdlError('always 语句缺少敏感列表 @', this.peek().line);
      }
      if (!this.accept('*')) {
        this.expect('(', '括号不匹配');
        var depth = 1;
        while (depth > 0) {
          var token = this.next();
          if (token.type === 'eof') {
            throw new HdlError('括号不匹配', token.line);
          }
          if (token.type === 'id' && (token.value === 'posedge' || token.value === 'negedge')) {
            throw new HdlError('暂不支持时序逻辑（检测到 ' + token.value + '）', token.line);
          }
          if (token.value === '(') depth++;
          else if (token.value === ')') depth--;
        }
      }
    }

    var stmt = this.parseStatement();
    return { kind: 'always', stmt: stmt, line: line };
  };

  Parser.prototype.parseStatement = function () {
    var t = this.peek();
    var line = t.line;

    if (this.accept(';')) {
      return { type: 'empty', line: line };
    }

    if (this.acceptKeyword('begin')) {
      if (this.accept(':')) this.expectIdentifier('代码块名');
      var statements = [];
      while (!this.checkKeyword('end')) {
        if (this.peek().type === 'eof') {
          throw new HdlError('缺少 end', this.peek().line);
        }
        statements.push(this.parseStatement());
      }
      this.expect('end');
      if (this.accept(':')) this.expectIdentifier('代码块结束标签');
      return { type: 'block', stmts: statements, line: line };
    }

    if (this.acceptKeyword('if')) {
      this.expect('(', '括号不匹配');
      var cond = this.parseExpression();
      this.expect(')', '括号不匹配');
      var thenStmt = this.parseStatement();
      var elseStmt = null;
      if (this.acceptKeyword('else')) elseStmt = this.parseStatement();
      return { type: 'if', cond: cond, thenStmt: thenStmt, elseStmt: elseStmt, line: line };
    }

    if (this.checkKeyword('case') || this.checkKeyword('casez') || this.checkKeyword('casex')) {
      return this.parseCaseStatement();
    }

    if (this.checkKeyword('unique') || this.checkKeyword('priority') || this.checkKeyword('unique0')) {
      this.next();
      if (!(this.checkKeyword('case') || this.checkKeyword('casez') || this.checkKeyword('casex'))) {
        throw new HdlError('unique/priority 后必须跟 case 语句', this.peek().line);
      }
      return this.parseCaseStatement();
    }

    if (this.acceptKeyword('for')) {
      return this.parseForStatement(line);
    }

    if (this.checkKeyword('end') || this.checkKeyword('endcase') || this.checkKeyword('else') ||
        this.checkKeyword('endmodule')) {
      this.unexpected('此处缺少语句');
    }

    return this.parseAssignmentStatement();
  };

  Parser.prototype.parseAssignmentStatement = function () {
    var line = this.peek().line;
    var lhs = this.parseLvalue();
    var nonblocking = false;
    if (this.accept('=')) {
      nonblocking = false;
    } else if (this.accept('<=')) {
      nonblocking = true;
    } else {
      throw new HdlError('赋值语句缺少 = 或 <=', this.peek().line);
    }
    var expr = this.parseExpression();
    this.expect(';', '缺少分号');
    return { type: 'assign', lhs: lhs, expr: expr, nonblocking: nonblocking, line: line };
  };

  Parser.prototype.parseLvalue = function () {
    var token = this.peek();
    if (token.type === 'id' && !RESERVED[token.value] && token.value.charAt(0) !== '$') {
      this.next();
      var node = { type: 'lvid', name: token.value, line: token.line };
      while (this.accept('[')) {
        var hi = this.parseExpression();
        if (this.accept(':')) {
          var lo = this.parseExpression();
          this.expect(']', '方括号不匹配');
          node = { type: 'lvpart', base: node, hi: hi, lo: lo, line: token.line };
        } else {
          this.expect(']', '方括号不匹配');
          node = { type: 'lvbit', base: node, index: hi, line: token.line };
        }
      }
      return node;
    }

    if (this.accept('{')) {
      var parts = [];
      if (this.check('}')) throw new HdlError('赋值左侧的拼接不能为空', this.peek().line);
      while (true) {
        parts.push(this.parseLvalue());
        if (!this.accept(',')) break;
      }
      this.expect('}', '花括号不匹配');
      return { type: 'lvcat', parts: parts, line: token.line };
    }

    throw new HdlError('赋值左侧必须是信号、位选或拼接', this.peek().line);
  };

  Parser.prototype.parseCaseStatement = function () {
    var keyword = this.next();
    var kind = keyword.value;
    this.expect('(', '括号不匹配');
    var subject = this.parseExpression();
    this.expect(')', '括号不匹配');

    var items = [];
    var defaultStmt = null;
    var defaultLine = 0;

    while (!this.checkKeyword('endcase')) {
      if (this.peek().type === 'eof') {
        throw new HdlError('缺少 endcase', this.peek().line);
      }

      if (this.acceptKeyword('default')) {
        if (defaultStmt) {
          throw new HdlError('case 中存在多个 default', this.peek().line);
        }
        this.accept(':');
        defaultLine = this.peek().line;
        defaultStmt = this.parseStatement();
        continue;
      }

      var patterns = [];
      var itemLine = this.peek().line;
      while (true) {
        patterns.push(this.parseExpression());
        if (!this.accept(',')) break;
        if (this.check(':')) {
          throw new HdlError('case 分支表达式中存在多余的逗号', this.peek().line);
        }
      }
      this.expect(':', 'case 分支缺少冒号');
      var stmt = this.parseStatement();
      items.push({ patterns: patterns, stmt: stmt, line: itemLine });
    }

    this.expect('endcase');
    return {
      type: 'case',
      kind: kind,
      subject: subject,
      items: items,
      defaultStmt: defaultStmt,
      defaultLine: defaultLine,
      line: keyword.line
    };
  };

  Parser.prototype.parseForStatement = function (line) {
    this.expect('(', '括号不匹配');

    var init = null;
    if (!this.check(';')) {
      init = this.parseForAssignmentCore();
    }
    this.expect(';', 'for 语句缺少分号');

    var cond = null;
    if (!this.check(';')) {
      cond = this.parseExpression();
    }
    this.expect(';', 'for 语句缺少分号');

    var step = null;
    if (!this.check(')')) {
      step = this.parseForAssignmentCore();
    }
    this.expect(')', '括号不匹配');

    var body = this.parseStatement();
    return { type: 'for', init: init, cond: cond, step: step, body: body, line: line };
  };

  Parser.prototype.parseForAssignmentCore = function () {
    var line = this.peek().line;
    if (this.peek().type === 'id' && (TYPE_WORDS[this.peek().value] || this.peek().value === 'int')) {
      throw new HdlError('暂不支持 for 循环内声明变量', this.peek().line);
    }
    var lhs = this.parseLvalue();
    if (!this.accept('=')) {
      throw new HdlError('for 初始化/更新语句只支持 = 赋值', this.peek().line);
    }
    var expr = this.parseExpression();
    return { type: 'assign', lhs: lhs, expr: expr, nonblocking: false, line: line };
  };

  Parser.prototype.parseExpression = function () {
    return this.parseTernary();
  };

  Parser.prototype.parseTernary = function () {
    var cond = this.parseBinary(0);
    if (this.accept('?')) {
      var yes = this.parseExpression();
      this.expect(':', '三目运算符缺少冒号');
      var no = this.parseTernary();
      return { type: 'tern', cond: cond, yes: yes, no: no, line: cond.line };
    }
    return cond;
  };

  Parser.prototype.parseBinary = function (level) {
    if (level >= BINARY_PRECEDENCE.length) {
      return this.parseUnary();
    }
    var left = this.parseBinary(level + 1);
    var operators = BINARY_PRECEDENCE[level];
    while (true) {
      var token = this.peek();
      if (token.type !== 'op' || operators.indexOf(token.value) < 0) break;
      this.next();
      var right = this.parseBinary(level + 1);
      left = { type: 'bin', op: token.value, left: left, right: right, line: token.line };
    }
    return left;
  };

  Parser.prototype.parseUnary = function () {
    var token = this.peek();
    if (token.type === 'op' && UNARY_OPS[token.value]) {
      this.next();
      var child = this.parseUnary();
      return { type: 'un', op: token.value, expr: child, line: token.line };
    }
    return this.parsePrimary();
  };

  Parser.prototype.parsePrimary = function () {
    var token = this.peek();

    if (token.type === 'num') {
      this.next();
      return parseNumberToken(token.value, token.line);
    }

    if (this.accept('(')) {
      var expr = this.parseExpression();
      this.expect(')', '括号不匹配');
      return expr;
    }

    if (this.accept('{')) {
      var line = token.line;
      var first = this.parseExpression();
      if (this.accept('{')) {
        var parts = [];
        if (this.check('}')) throw new HdlError('复制拼接不能为空', this.peek().line);
        while (true) {
          parts.push(this.parseExpression());
          if (!this.accept(',')) break;
        }
        this.expect('}', '花括号不匹配');
        this.expect('}', '花括号不匹配');
        return { type: 'repl', count: first, parts: parts, line: line };
      }
      var values = [first];
      while (this.accept(',')) values.push(this.parseExpression());
      this.expect('}', '花括号不匹配');
      return { type: 'concat', parts: values, line: line };
    }

    if (token.type === 'id') {
      this.next();
      if (token.value.charAt(0) === '$') {
        if (token.value !== '$clog2') {
          throw new HdlError('不支持的系统函数 ' + token.value, token.line);
        }
        this.expect('(', '括号不匹配');
        var arg = this.parseExpression();
        this.expect(')', '括号不匹配');
        return { type: 'call', name: '$clog2', arg: arg, line: token.line };
      }
      if (RESERVED[token.value]) {
        throw new HdlError('关键字“' + token.value + '”不能出现在表达式中', token.line);
      }
      if (this.check('(')) {
        throw new HdlError('暂不支持函数调用 ' + token.value, token.line);
      }
      var node = { type: 'id', name: token.value, line: token.line };
      while (this.accept('[')) {
        var hi = this.parseExpression();
        if (this.accept(':')) {
          var lo = this.parseExpression();
          this.expect(']', '方括号不匹配');
          node = { type: 'part', base: node, hi: hi, lo: lo, line: token.line };
        } else {
          this.expect(']', '方括号不匹配');
          node = { type: 'bit', base: node, index: hi, line: token.line };
        }
      }
      return node;
    }

    throw new HdlError('此处需要表达式', token.line);
  };

  /* ------------------------------------------------------------------ */
  /* 常量 / 位宽求值辅助                                                */
  /* ------------------------------------------------------------------ */

  function createWork(deadline) {
    return {
      ops: 0,
      deadline: deadline || (Date.now() + TIME_LIMIT_MS)
    };
  }

  function tickWork(work, line) {
    work.ops++;
    if (work.ops > MAX_OPS) {
      throw new HdlError('评测超时：计算量超过上限', line);
    }
    if ((work.ops & 1023) === 0 && Date.now() > work.deadline) {
      throw new HdlError('评测超时', line);
    }
  }

  function truthy(valueRecord) {
    return valueRecord.value !== 0n;
  }

  function checkedWidth(width, line, what) {
    if (!isFinite(width) || width < 1 || width > MAX_WIDTH) {
      throw new HdlError((what || '表达式') + '位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', line);
    }
    return width;
  }

  function parityOf(value) {
    var p = 0n;
    var v = value;
    while (v > 0n) {
      p ^= (v & 1n);
      v >>= 1n;
    }
    return p;
  }

  function inferWidth(node, env, work) {
    tickWork(work, node.line);
    switch (node.type) {
      case 'num':
        return node.isFill ? 0 : node.width;
      case 'id': {
        var value = env.lookup(node.name, node.line);
        return value.width;
      }
      case 'un': {
        if (node.op === '!' || node.op === '&' || node.op === '|' || node.op === '^' ||
            node.op === '~&' || node.op === '~|' || node.op === '~^' || node.op === '^~') {
          return 1;
        }
        var uw = inferWidth(node.expr, env, work);
        return uw > 0 ? uw : 1;
      }
      case 'bin': {
        if (node.op === '&&' || node.op === '||' || node.op === '==' || node.op === '!=' ||
            node.op === '===' || node.op === '!==' || node.op === '<' || node.op === '<=' ||
            node.op === '>' || node.op === '>=') {
          return 1;
        }
        if (node.op === '<<' || node.op === '>>' || node.op === '>>>' || node.op === '<<<') {
          var sw = inferWidth(node.left, env, work);
          return sw > 0 ? sw : 1;
        }
        var lw = inferWidth(node.left, env, work);
        var rw = inferWidth(node.right, env, work);
        return checkedWidth(Math.max(lw, rw, 1), node.line);
      }
      case 'tern': {
        var tw = inferWidth(node.yes, env, work);
        var fw = inferWidth(node.no, env, work);
        return checkedWidth(Math.max(tw, fw, 1), node.line);
      }
      case 'concat': {
        var total = 0;
        for (var i = 0; i < node.parts.length; i++) {
          var pw = inferWidth(node.parts[i], env, work);
          total += pw > 0 ? pw : 1;
        }
        return checkedWidth(total, node.line, '拼接');
      }
      case 'repl': {
        var inner = 0;
        for (var j = 0; j < node.parts.length; j++) {
          var iw = inferWidth(node.parts[j], env, work);
          inner += iw > 0 ? iw : 1;
        }
        var countRecord = evalExpr(node.count, env, 0, work);
        var count = toSafeInteger(countRecord.value, node.line, '复制次数');
        var res = inner * count;
        if (count < 0 || res > MAX_WIDTH) {
          throw new HdlError('复制拼接位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', node.line);
        }
        return res;
      }
      case 'bit':
        return 1;
      case 'part': {
        var hi = evalIndexNumber(node.hi, env, work, node.line);
        var lo = evalIndexNumber(node.lo, env, work, node.line);
        var pw2 = Math.abs(hi - lo) + 1;
        if (pw2 > MAX_WIDTH) {
          throw new HdlError('部分选择位宽超过上限', node.line);
        }
        return pw2;
      }
      case 'call':
        return 32;
      default:
        return 1;
    }
  }

  function evalIndexNumber(expr, env, work, line) {
    var record = evalExpr(expr, env, 0, work);
    return toSafeInteger(record.value, line || expr.line, '下标');
  }

  function evalExpr(node, env, ctxWidth, work) {
    tickWork(work, node.line);
    if (ctxWidth && ctxWidth > MAX_WIDTH) {
      throw new HdlError('表达式位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', node.line);
    }
    var contextWidth = (ctxWidth && ctxWidth > 0) ? ctxWidth : 0;

    switch (node.type) {
      case 'num': {
        if (node.isFill) {
          var fw = contextWidth > 0 ? contextWidth : 1;
          return {
            value: node.fillBit === 1 ? maskFor(fw) : 0n,
            width: fw
          };
        }
        return { value: node.value, width: node.width };
      }

      case 'id': {
        var resolved = env.lookup(node.name, node.line);
        return {
          value: maskValue(resolved.value, resolved.width),
          width: resolved.width
        };
      }

      case 'un': {
        var op = node.op;
        if (op === '!') {
          var one = evalExpr(node.expr, env, 0, work);
          return { value: truthy(one) ? 0n : 1n, width: 1 };
        }
        if (op === '&' || op === '|' || op === '^' || op === '~&' || op === '~|' ||
            op === '~^' || op === '^~') {
          var reduce = evalExpr(node.expr, env, 0, work);
          var rv = maskValue(reduce.value, reduce.width);
          var rw = reduce.width > 0 ? reduce.width : 1;
          var result = 0n;
          if (op === '&') result = (rv === maskFor(rw)) ? 1n : 0n;
          else if (op === '|') result = (rv !== 0n) ? 1n : 0n;
          else if (op === '^' || op === '~^' || op === '^~') {
            var parity = parityOf(rv);
            result = parity;
            if (op === '~^' || op === '^~') result = parity ^ 1n;
          } else if (op === '~&') {
            result = (rv === maskFor(rw)) ? 0n : 1n;
          } else if (op === '~|') {
            result = (rv === 0n) ? 1n : 0n;
          }
          return { value: result, width: 1 };
        }

        var uw = inferWidth(node.expr, env, work);
        var width = checkedWidth(Math.max(uw, contextWidth, 1), node.line);
        var v = evalExpr(node.expr, env, width, work);
        var masked = maskValue(v.value, width);
        if (op === '~') return { value: (~masked) & maskFor(width), width: width };
        if (op === '-') return { value: (0n - masked) & maskFor(width), width: width };
        return { value: masked, width: width };
      }

      case 'bin': {
        var binaryOp = node.op;
        if (binaryOp === '&&' || binaryOp === '||') {
          var llog = evalExpr(node.left, env, 0, work);
          var rlog = evalExpr(node.right, env, 0, work);
          var ltrue = truthy(llog);
          var rtrue = truthy(rlog);
          var logicResult;
          if (binaryOp === '&&') logicResult = (ltrue && rtrue) ? 1n : 0n;
          else logicResult = (ltrue || rtrue) ? 1n : 0n;
          return { value: logicResult, width: 1 };
        }

        if (binaryOp === '==' || binaryOp === '!=' || binaryOp === '===' || binaryOp === '!==' ||
            binaryOp === '<' || binaryOp === '<=' || binaryOp === '>' || binaryOp === '>=') {
          var lw0 = inferWidth(node.left, env, work);
          var rw0 = inferWidth(node.right, env, work);
          var cmpWidth = checkedWidth(Math.max(lw0, rw0, 1), node.line);
          var lv0 = evalExpr(node.left, env, cmpWidth, work);
          var rv0 = evalExpr(node.right, env, cmpWidth, work);
          var a0 = maskValue(lv0.value, cmpWidth);
          var b0 = maskValue(rv0.value, cmpWidth);
          var comparison = 0n;
          if (binaryOp === '==') comparison = (a0 === b0) ? 1n : 0n;
          else if (binaryOp === '!=') comparison = (a0 !== b0) ? 1n : 0n;
          else if (binaryOp === '===') comparison = (a0 === b0) ? 1n : 0n;
          else if (binaryOp === '!==') comparison = (a0 !== b0) ? 1n : 0n;
          else if (binaryOp === '<') comparison = (a0 < b0) ? 1n : 0n;
          else if (binaryOp === '<=') comparison = (a0 <= b0) ? 1n : 0n;
          else if (binaryOp === '>') comparison = (a0 > b0) ? 1n : 0n;
          else if (binaryOp === '>=') comparison = (a0 >= b0) ? 1n : 0n;
          return { value: comparison, width: 1 };
        }

        if (binaryOp === '<<' || binaryOp === '>>' || binaryOp === '>>>' || binaryOp === '<<<') {
          var shiftWidth = checkedWidth(Math.max(inferWidth(node.left, env, work), contextWidth, 1), node.line);
          var leftShift = evalExpr(node.left, env, shiftWidth, work);
          var rightShift = evalExpr(node.right, env, 0, work);
          var leftValue = maskValue(leftShift.value, shiftWidth);
          var amountLow = rightShift.value & 0xFFFFFFFFn;
          var amount = amountLow > BigInt(shiftWidth) ? shiftWidth : Number(amountLow);
          var shiftResult;
          if (amount >= shiftWidth) {
            shiftResult = 0n;
          } else if (binaryOp === '<<' || binaryOp === '<<<') {
            shiftResult = (leftValue << BigInt(amount)) & maskFor(shiftWidth);
          } else {
            shiftResult = leftValue >> BigInt(amount);
          }
          return { value: shiftResult, width: shiftWidth };
        }

        var leftWidth = inferWidth(node.left, env, work);
        var rightWidth = inferWidth(node.right, env, work);
        var opWidth = checkedWidth(Math.max(leftWidth, rightWidth, contextWidth, 1), node.line);
        var lv = evalExpr(node.left, env, opWidth, work);
        var rv = evalExpr(node.right, env, opWidth, work);
        var a = maskValue(lv.value, opWidth);
        var b = maskValue(rv.value, opWidth);
        var calc;
        if (binaryOp === '&') calc = a & b;
        else if (binaryOp === '|') calc = a | b;
        else if (binaryOp === '^') calc = a ^ b;
        else if (binaryOp === '~^' || binaryOp === '^~') calc = (~(a ^ b)) & maskFor(opWidth);
        else if (binaryOp === '+') calc = a + b;
        else if (binaryOp === '-') calc = a - b;
        else if (binaryOp === '*') calc = a * b;
        else if (binaryOp === '/') calc = (b === 0n) ? 0n : (a / b);
        else if (binaryOp === '%') calc = (b === 0n) ? 0n : (a % b);
        else {
          throw new HdlError('不支持的二元运算符 ' + binaryOp, node.line);
        }
        return { value: maskValue(calc, opWidth), width: opWidth };
      }

      case 'tern': {
        var condRecord = evalExpr(node.cond, env, 0, work);
        var yesWidth = inferWidth(node.yes, env, work);
        var noWidth = inferWidth(node.no, env, work);
        var ternaryWidth = checkedWidth(Math.max(yesWidth, noWidth, contextWidth, 1), node.line);
        var chosen = truthy(condRecord) ? node.yes : node.no;
        var chosenRecord = evalExpr(chosen, env, ternaryWidth, work);
        return {
          value: maskValue(chosenRecord.value, ternaryWidth),
          width: ternaryWidth
        };
      }

      case 'concat': {
        var totalWidth = 0;
        var concatValue = 0n;
        for (var ci = 0; ci < node.parts.length; ci++) {
          var partNode = node.parts[ci];
          var partWidth = inferWidth(partNode, env, work);
          if (partWidth <= 0) partWidth = 1;
          var partRecord = evalExpr(partNode, env, partWidth, work);
          concatValue = (concatValue << BigInt(partWidth)) |
            maskValue(partRecord.value, partWidth);
          totalWidth += partWidth;
          if (totalWidth > MAX_WIDTH) {
            throw new HdlError('拼接位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', node.line);
          }
        }
        return { value: maskValue(concatValue, totalWidth), width: totalWidth };
      }

      case 'repl': {
        var innerWidth = 0;
        var innerValue = 0n;
        for (var ri = 0; ri < node.parts.length; ri++) {
          var repPart = node.parts[ri];
          var rpWidth = inferWidth(repPart, env, work);
          if (rpWidth <= 0) rpWidth = 1;
          var rp = evalExpr(repPart, env, rpWidth, work);
          innerValue = (innerValue << BigInt(rpWidth)) | maskValue(rp.value, rpWidth);
          innerWidth += rpWidth;
          if (innerWidth > MAX_WIDTH) {
            throw new HdlError('复制拼接位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', node.line);
          }
        }
        var countVal = evalExpr(node.count, env, 0, work);
        var countInt = toSafeInteger(countVal.value, node.line, '复制次数');
        if (countInt <= 0) {
          throw new HdlError('复制次数必须大于 0', node.line);
        }
        var finalWidth = innerWidth * countInt;
        if (finalWidth > MAX_WIDTH) {
          throw new HdlError('复制拼接位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', node.line);
        }
        var repeated = 0n;
        for (var rr = 0; rr < countInt; rr++) {
          repeated = (repeated << BigInt(innerWidth)) | innerValue;
        }
        return { value: maskValue(repeated, finalWidth), width: finalWidth };
      }

      case 'bit': {
        var baseRecord = evalExpr(node.base, env, 0, work);
        var bitIndex = evalIndexNumber(node.index, env, work, node.line);
        var bitResult = 0n;
        var baseSignal = (node.base.type === 'id' && env.getSignal) ?
          env.getSignal(node.base.name) : null;
        if (baseSignal) {
          var position = declaredIndexToPosition(baseSignal, bitIndex);
          if (position >= 0) {
            bitResult = (baseRecord.value >> BigInt(position)) & 1n;
          }
        } else if (bitIndex >= 0 && bitIndex < baseRecord.width) {
          bitResult = (baseRecord.value >> BigInt(bitIndex)) & 1n;
        }
        return { value: bitResult, width: 1 };
      }

      case 'part': {
        var partBase = evalExpr(node.base, env, 0, work);
        var partHi = evalIndexNumber(node.hi, env, work, node.line);
        var partLo = evalIndexNumber(node.lo, env, work, node.line);
        var partResultWidth = Math.abs(partHi - partLo) + 1;
        if (partResultWidth > MAX_WIDTH) {
          throw new HdlError('部分选择位宽超过上限', node.line);
        }
        var partSignal = (node.base.type === 'id' && env.getSignal) ?
          env.getSignal(node.base.name) : null;
        var partValue = 0n;
        if (partHi >= partLo) {
          for (var pi = partHi; pi >= partLo; pi--) {
            var ppos = partSignal ? declaredIndexToPosition(partSignal, pi) : pi;
            var pbit = 0n;
            if (ppos >= 0 && (partSignal || pi < partBase.width)) {
              pbit = (partBase.value >> BigInt(ppos)) & 1n;
            }
            partValue = (partValue << 1n) | pbit;
          }
        } else {
          for (var pj = partHi; pj <= partLo; pj++) {
            var ppos2 = partSignal ? declaredIndexToPosition(partSignal, pj) : pj;
            var pbit2 = 0n;
            if (ppos2 >= 0 && (partSignal || pj < partBase.width)) {
              pbit2 = (partBase.value >> BigInt(ppos2)) & 1n;
            }
            partValue = (partValue << 1n) | pbit2;
          }
        }
        return { value: partValue, width: partResultWidth };
      }

      case 'call': {
        var argRecord = evalExpr(node.arg, env, 0, work);
        var log2 = ceilLog2(argRecord.value);
        return { value: maskValue(log2, 32), width: 32 };
      }

      default:
        throw new HdlError('无法求值的表达式', node.line);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 综合：参数、信号、静态检查                                         */
  /* ------------------------------------------------------------------ */

  function resolveParameters(module, work) {
    var defs = new Map();
    var allDefs = module.params.concat(module.body.params);
    for (var i = 0; i < allDefs.length; i++) {
      var def = allDefs[i];
      if (defs.has(def.name)) {
        throw new HdlError('参数 ' + def.name + ' 重复声明', def.line);
      }
      defs.set(def.name, def);
    }

    var resolved = new Map();
    var resolving = new Set();

    function resolveParam(name, requestLine) {
      if (resolved.has(name)) return resolved.get(name);
      if (!defs.has(name)) {
        throw new HdlError('未声明的信号 ' + name, requestLine || 1);
      }
      var def = defs.get(name);
      if (resolving.has(name)) {
        throw new HdlError('参数 ' + name + ' 存在循环依赖', def.line);
      }
      resolving.add(name);
      var env = {
        lookup: function (id, line) {
          if (!defs.has(id)) {
            throw new HdlError('未声明的信号 ' + id, line || def.line);
          }
          return resolveParam(id, line || def.line);
        },
        getSignal: function () { return null; }
      };
      var record = evalExpr(def.expr, env, 0, work);
      var width = record.width > 0 ? record.width : 32;
      if (width > MAX_WIDTH) {
        throw new HdlError('参数 ' + name + ' 的位宽超过上限', def.line);
      }
      var result = {
        value: maskValue(record.value, width),
        width: width
      };
      resolved.set(name, result);
      resolving.delete(name);
      return result;
    }

    defs.forEach(function (_, name) {
      resolveParam(name);
    });

    return resolved;
  }

  function makeConstEnv(resolved) {
    return {
      lookup: function (name, line) {
        var record = resolved.get(name);
        if (!record) {
          throw new HdlError('未声明的参数 ' + name, line);
        }
        return record;
      },
      getSignal: function () { return null; }
    };
  }

  function evalRangeWidth(range, env, work, line) {
    if (!range) return null;
    var msbRecord = evalExpr(range.msb, env, 0, work);
    var lsbRecord = evalExpr(range.lsb, env, 0, work);
    var left = toSafeInteger(msbRecord.value, range.line, '位宽常量');
    var right = toSafeInteger(lsbRecord.value, range.line, '位宽常量');
    var width = Math.abs(left - right) + 1;
    if (width < 1 || width > MAX_WIDTH) {
      throw new HdlError('位宽超过上限（最大 ' + MAX_WIDTH + ' 位）', line || range.line);
    }
    return { width: width, left: left, right: right };
  }

  function geometryFor(type, range, env, work, line) {
    var parsed = evalRangeWidth(range, env, work, line);
    if (parsed) return parsed;
    if (type === 'integer' || type === 'int') {
      return { width: 32, left: 31, right: 0 };
    }
    return { width: 1, left: 0, right: 0 };
  }

  function elaborateModule(module, work, warnings) {
    var params = resolveParameters(module, work);
    var constEnv = makeConstEnv(params);
    var signals = new Map();
    var ports = [];

    var bodyPortMap = new Map();
    var bodyPortOrder = [];
    for (var bi = 0; bi < module.body.portDecls.length; bi++) {
      var bd = module.body.portDecls[bi];
      for (var bj = 0; bj < bd.names.length; bj++) {
        var bname = bd.names[bj];
        if (bodyPortMap.has(bname)) {
          throw new HdlError('端口 ' + bname + ' 重复声明', bd.line);
        }
        bodyPortMap.set(bname, bd);
        bodyPortOrder.push(bname);
      }
    }

    function addSignal(name, geometry, direction, type, line, isPort) {
      if (params.has(name)) {
        throw new HdlError('信号 ' + name + ' 与参数同名', line);
      }
      if (signals.has(name)) {
        throw new HdlError('信号 ' + name + ' 重复声明', line);
      }
      var sig = {
        name: name,
        width: geometry.width,
        left: geometry.left,
        right: geometry.right,
        direction: direction || null,
        type: type || 'wire',
        line: line,
        isPort: !!isPort
      };
      signals.set(name, sig);
      if (isPort) ports.push(sig);
      return sig;
    }

    var headerNames = new Set();
    for (var pi = 0; pi < module.ports.length; pi++) {
      var headerPort = module.ports[pi];
      if (headerNames.has(headerPort.name)) {
        throw new HdlError('端口 ' + headerPort.name + ' 重复声明', headerPort.line);
      }
      headerNames.add(headerPort.name);

      var bodyDecl = bodyPortMap.get(headerPort.name) || null;
      var direction = headerPort.direction || (bodyDecl ? bodyDecl.direction : null);
      if (!direction) {
        throw new HdlError('端口 ' + headerPort.name + ' 未声明方向', headerPort.line);
      }
      if (headerPort.direction && bodyDecl && bodyDecl.direction &&
          headerPort.direction !== bodyDecl.direction) {
        throw new HdlError('端口 ' + headerPort.name + ' 方向声明冲突', headerPort.line);
      }

      var type;
      var range;
      var line;
      if (headerPort.direction) {
        type = headerPort.type || 'wire';
        range = headerPort.range;
        line = headerPort.line;
      } else {
        type = bodyDecl.type || 'wire';
        range = bodyDecl.range;
        line = bodyDecl.line;
      }

      var geometry = geometryFor(type, range, constEnv, work, line);
      addSignal(headerPort.name, geometry, direction, type, line, true);
    }

    for (var ei = 0; ei < bodyPortOrder.length; ei++) {
      var extraName = bodyPortOrder[ei];
      if (headerNames.has(extraName)) continue;
      var extraDecl = bodyPortMap.get(extraName);
      var extraType = extraDecl.type || 'wire';
      var extraGeometry = geometryFor(extraType, extraDecl.range, constEnv, work, extraDecl.line);
      addSignal(extraName, extraGeometry, extraDecl.direction, extraType, extraDecl.line, true);
    }

    for (var vi = 0; vi < module.body.varDecls.length; vi++) {
      var vd = module.body.varDecls[vi];
      for (var vj = 0; vj < vd.names.length; vj++) {
        var vname = vd.names[vj];
        var vType = vd.type || 'wire';
        var vGeometry = geometryFor(vType, vd.range, constEnv, work, vd.line);
        addSignal(vname, vGeometry, null, vType, vd.line, false);
      }
    }

    var elab = {
      module: module,
      params: params,
      signals: signals,
      ports: ports,
      constructs: module.body.constructs
    };

    for (var ci = 0; ci < module.body.constructs.length; ci++) {
      var construct = module.body.constructs[ci];
      if (construct.kind === 'assign') {
        validateLvalue(construct.lhs, elab);
        validateExpr(construct.expr, elab);
      } else {
        validateStmt(construct.stmt, elab, warnings);
      }
    }

    return elab;
  }

  function validateExpr(node, elab) {
    if (!node) return;
    switch (node.type) {
      case 'num':
        return;
      case 'id':
        if (!elab.signals.has(node.name) && !elab.params.has(node.name)) {
          throw new HdlError('未声明的信号 ' + node.name, node.line);
        }
        return;
      case 'un':
      case 'call':
        validateExpr(node.type === 'call' ? node.arg : node.expr, elab);
        return;
      case 'bin':
        validateExpr(node.left, elab);
        validateExpr(node.right, elab);
        return;
      case 'tern':
        validateExpr(node.cond, elab);
        validateExpr(node.yes, elab);
        validateExpr(node.no, elab);
        return;
      case 'concat':
        for (var i = 0; i < node.parts.length; i++) validateExpr(node.parts[i], elab);
        return;
      case 'repl':
        validateExpr(node.count, elab);
        for (var j = 0; j < node.parts.length; j++) validateExpr(node.parts[j], elab);
        return;
      case 'bit':
        validateExpr(node.base, elab);
        validateExpr(node.index, elab);
        return;
      case 'part':
        validateExpr(node.base, elab);
        validateExpr(node.hi, elab);
        validateExpr(node.lo, elab);
        return;
      default:
        throw new HdlError('表达式结构无效', node.line);
    }
  }

  function validateLvalue(node, elab) {
    if (!node) throw new HdlError('赋值左侧为空');
    if (node.type === 'lvid') {
      if (elab.params.has(node.name)) {
        throw new HdlError('参数 ' + node.name + ' 不能被赋值', node.line);
      }
      if (!elab.signals.has(node.name)) {
        throw new HdlError('未声明的信号 ' + node.name, node.line);
      }
      return;
    }
    if (node.type === 'lvbit' || node.type === 'lvpart') {
      if (!node.base || node.base.type !== 'lvid') {
        throw new HdlError('暂不支持链式位选赋值', node.line);
      }
      if (elab.params.has(node.base.name)) {
        throw new HdlError('参数 ' + node.base.name + ' 不能被赋值', node.line);
      }
      if (!elab.signals.has(node.base.name)) {
        throw new HdlError('未声明的信号 ' + node.base.name, node.line);
      }
      if (node.type === 'lvbit') validateExpr(node.index, elab);
      else {
        validateExpr(node.hi, elab);
        validateExpr(node.lo, elab);
      }
      return;
    }
    if (node.type === 'lvcat') {
      for (var i = 0; i < node.parts.length; i++) validateLvalue(node.parts[i], elab);
      return;
    }
    throw new HdlError('无效的赋值目标', node.line);
  }

  function validateStmt(stmt, elab, warnings) {
    if (!stmt) return;
    switch (stmt.type) {
      case 'empty':
        return;
      case 'block':
        for (var i = 0; i < stmt.stmts.length; i++) validateStmt(stmt.stmts[i], elab, warnings);
        return;
      case 'if':
        validateExpr(stmt.cond, elab);
        validateStmt(stmt.thenStmt, elab, warnings);
        if (stmt.elseStmt) validateStmt(stmt.elseStmt, elab, warnings);
        return;
      case 'case':
        validateExpr(stmt.subject, elab);
        for (var j = 0; j < stmt.items.length; j++) {
          for (var k = 0; k < stmt.items[j].patterns.length; k++) {
            validateExpr(stmt.items[j].patterns[k], elab);
          }
          validateStmt(stmt.items[j].stmt, elab, warnings);
        }
        if (stmt.defaultStmt) validateStmt(stmt.defaultStmt, elab, warnings);
        return;
      case 'assign':
        validateLvalue(stmt.lhs, elab);
        validateExpr(stmt.expr, elab);
        if (stmt.nonblocking) {
          warnings.push('第 ' + stmt.line + ' 行：组合逻辑中的非阻塞赋值已按阻塞赋值处理');
        }
        return;
      case 'for':
        if (stmt.init) validateStmt(stmt.init, elab, warnings);
        if (stmt.cond) validateExpr(stmt.cond, elab);
        if (stmt.step) validateStmt(stmt.step, elab, warnings);
        validateStmt(stmt.body, elab, warnings);
        return;
      default:
        throw new HdlError('无效的语句结构', stmt.line);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 仿真                                                               */
  /* ------------------------------------------------------------------ */

  function declaredIndexToPosition(signal, index) {
    if (signal.left >= signal.right) {
      if (index < signal.right || index > signal.left) return -1;
      return index - signal.right;
    }
    if (index < signal.left || index > signal.right) return -1;
    return signal.right - index;
  }

  function makeSimEnv(elab, values) {
    return {
      lookup: function (name, line) {
        if (elab.params.has(name)) {
          return elab.params.get(name);
        }
        var sig = elab.signals.get(name);
        if (!sig) {
          throw new HdlError('未声明的信号 ' + name, line);
        }
        return { value: values.get(sig.name) || 0n, width: sig.width };
      },
      getSignal: function (name) {
        return elab.signals.get(name) || null;
      }
    };
  }

  function flattenLvalue(node, env, work) {
    if (node.type === 'lvid') {
      var sig = env.getSignal(node.name);
      if (!sig) throw new HdlError('未声明的信号 ' + node.name, node.line);
      return [{ kind: 'whole', name: sig.name, width: sig.width, line: node.line }];
    }

    if (node.type === 'lvbit' || node.type === 'lvpart') {
      if (!node.base || node.base.type !== 'lvid') {
        throw new HdlError('暂不支持链式位选赋值', node.line);
      }
      var target = env.getSignal(node.base.name);
      if (!target) throw new HdlError('未声明的信号 ' + node.base.name, node.line);
      if (node.type === 'lvbit') {
        var bitIndex = evalIndexNumber(node.index, env, work, node.line);
        var bitPos = declaredIndexToPosition(target, bitIndex);
        return [{
          kind: 'bits',
          name: target.name,
          width: 1,
          positions: [bitPos],
          line: node.line
        }];
      }
      var hi = evalIndexNumber(node.hi, env, work, node.line);
      var lo = evalIndexNumber(node.lo, env, work, node.line);
      var partWidth = Math.abs(hi - lo) + 1;
      if (partWidth > MAX_WIDTH) {
        throw new HdlError('部分选择位宽超过上限', node.line);
      }
      var positions = [];
      var step = hi >= lo ? -1 : 1;
      var cur = hi;
      for (var i = 0; i < partWidth; i++) {
        positions.push(declaredIndexToPosition(target, cur));
        cur += step;
      }
      return [{
        kind: 'bits',
        name: target.name,
        width: partWidth,
        positions: positions,
        line: node.line
      }];
    }

    if (node.type === 'lvcat') {
      var leaves = [];
      for (var j = 0; j < node.parts.length; j++) {
        leaves = leaves.concat(flattenLvalue(node.parts[j], env, work));
      }
      return leaves;
    }

    throw new HdlError('无效的赋值目标', node.line);
  }

  function setSignalValue(state, name, value, width) {
    state.values.set(name, maskValue(value, width));
  }

  function writeLeaf(leaf, segment, env, state, work) {
    tickWork(work, leaf.line);
    var sig = env.getSignal(leaf.name);
    if (!sig) throw new HdlError('未声明的信号 ' + leaf.name, leaf.line);
    state.assigned.add(leaf.name);

    if (leaf.kind === 'whole') {
      setSignalValue(state, leaf.name, segment, sig.width);
      return;
    }

    var current = state.values.get(leaf.name) || 0n;
    for (var i = 0; i < leaf.positions.length; i++) {
      var pos = leaf.positions[i];
      if (pos < 0) continue;
      var sourceBit = (segment >> BigInt(leaf.width - 1 - i)) & 1n;
      var bitMask = 1n << BigInt(pos);
      if (sourceBit === 1n) current |= bitMask;
      else current &= ~bitMask;
    }
    setSignalValue(state, leaf.name, current, sig.width);
  }

  function executeAssignment(lhs, expr, env, state, work) {
    var leaves = flattenLvalue(lhs, env, work);
    var targetWidth = 0;
    for (var i = 0; i < leaves.length; i++) targetWidth += leaves[i].width;
    if (targetWidth <= 0 || targetWidth > MAX_WIDTH) {
      throw new HdlError('赋值目标位宽无效', lhs.line);
    }

    tickWork(work, lhs.line);
    var rhs = evalExpr(expr, env, targetWidth, work);
    var remaining = maskValue(rhs.value, targetWidth);

    for (var j = leaves.length - 1; j >= 0; j--) {
      var leaf = leaves[j];
      var segment = remaining & maskFor(leaf.width);
      writeLeaf(leaf, segment, env, state, work);
      remaining >>= BigInt(leaf.width);
    }
  }

  function matchCasePattern(patternNode, subjectValue, subjectWidth, caseKind, env, work) {
    var patternWidth = inferWidth(patternNode, env, work);
    if (patternWidth <= 0) patternWidth = 1;
    var commonWidth = Math.max(subjectWidth, patternWidth, 1);
    var patternValue = evalExpr(patternNode, env, commonWidth, work);
    var sv = maskValue(subjectValue, commonWidth);
    var pv = maskValue(patternValue.value, commonWidth);
    var wild = 0n;

    if (patternNode.type === 'num' && (caseKind === 'casez' || caseKind === 'casex')) {
      wild = maskValue(patternNode.wildMask, commonWidth);
    }
    var care = maskFor(commonWidth) & (~wild);
    return ((sv ^ pv) & care) === 0n;
  }

  function execStmt(stmt, env, state, work) {
    tickWork(work, stmt.line);
    switch (stmt.type) {
      case 'empty':
        return;

      case 'block':
        for (var i = 0; i < stmt.stmts.length; i++) {
          execStmt(stmt.stmts[i], env, state, work);
        }
        return;

      case 'if': {
        var condRecord = evalExpr(stmt.cond, env, 0, work);
        if (truthy(condRecord)) execStmt(stmt.thenStmt, env, state, work);
        else if (stmt.elseStmt) execStmt(stmt.elseStmt, env, state, work);
        return;
      }

      case 'case': {
        var subject = evalExpr(stmt.subject, env, 0, work);
        var matched = false;
        for (var j = 0; j < stmt.items.length && !matched; j++) {
          var item = stmt.items[j];
          for (var k = 0; k < item.patterns.length; k++) {
            if (matchCasePattern(item.patterns[k], subject.value, subject.width, stmt.kind, env, work)) {
              execStmt(item.stmt, env, state, work);
              matched = true;
              break;
            }
          }
        }
        if (!matched && stmt.defaultStmt) {
          execStmt(stmt.defaultStmt, env, state, work);
        }
        return;
      }

      case 'assign':
        executeAssignment(stmt.lhs, stmt.expr, env, state, work);
        return;

      case 'for': {
        if (stmt.init) execStmt(stmt.init, env, state, work);
        var iterations = 0;
        while (true) {
          if (stmt.cond) {
            var conditionRecord = evalExpr(stmt.cond, env, 0, work);
            if (!truthy(conditionRecord)) break;
          }
          execStmt(stmt.body, env, state, work);
          if (stmt.step) execStmt(stmt.step, env, state, work);
          iterations++;
          tickWork(work, stmt.line);
          if (iterations > MAX_LOOP_ITERATIONS) {
            throw new HdlError('循环次数超过上限', stmt.line);
          }
        }
        return;
      }

      default:
        throw new HdlError('无效的语句结构', stmt.line);
    }
  }

  function signalsChanged(values, before) {
    if (values.size !== before.size) return true;
    for (var entry of values) {
      if (before.get(entry[0]) !== entry[1]) return true;
    }
    return false;
  }

  function simulateTest(elab, mapping, test, work) {
    var values = new Map();
    elab.signals.forEach(function (sig) {
      values.set(sig.name, 0n);
    });

    var testIn = (test && test.in && typeof test.in === 'object') ? test.in : {};
    for (var i = 0; i < mapping.inputs.length; i++) {
      var item = mapping.inputs[i];
      var raw = Object.prototype.hasOwnProperty.call(testIn, item.specName) ?
        testIn[item.specName] : 0;
      var inputValue = coerceTestValue(raw);
      values.set(item.port.name, maskValue(inputValue, item.port.width));
    }

    var state = { values: values, assigned: new Set() };
    var env = makeSimEnv(elab, values);
    var stable = false;
    var firstLine = elab.module.line;
    if (elab.constructs.length > 0) firstLine = elab.constructs[0].line;

    for (var round = 0; round < MAX_ROUNDS; round++) {
      tickWork(work, firstLine);
      var before = new Map(values);
      for (var c = 0; c < elab.constructs.length; c++) {
        var construct = elab.constructs[c];
        if (construct.kind === 'assign') {
          executeAssignment(construct.lhs, construct.expr, env, state, work);
        } else {
          execStmt(construct.stmt, env, state, work);
        }
      }
      if (!signalsChanged(values, before)) {
        stable = true;
        break;
      }
    }

    if (!stable) {
      throw new HdlError('组合逻辑存在环路（' + MAX_ROUNDS + ' 轮内未稳定）', firstLine);
    }

    for (var oi = 0; oi < mapping.outputs.length; oi++) {
      var out = mapping.outputs[oi];
      if (!state.assigned.has(out.port.name)) {
        throw new HdlError('输出 ' + out.specName + ' 未被赋值', out.port.line);
      }
    }

    return values;
  }

  /* ------------------------------------------------------------------ */
  /* spec / 端口映射 / 判题入口                                         */
  /* ------------------------------------------------------------------ */

  function coerceTestValue(value) {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number' && isFinite(value)) return BigInt(Math.trunc(value));
    if (typeof value === 'boolean') return value ? 1n : 0n;
    if (typeof value === 'string' && /^[+-]?\d+$/.test(value)) return BigInt(value);
    return 0n;
  }

  function validateSpec(spec) {
    if (!spec || typeof spec !== 'object') {
      throw new HdlError('spec 无效');
    }
    var inputs = spec.inputs === undefined ? [] : spec.inputs;
    var outputs = spec.outputs === undefined ? [] : spec.outputs;
    var tests = spec.tests;

    if (!Array.isArray(inputs) || !Array.isArray(outputs)) {
      throw new HdlError('spec.inputs 和 spec.outputs 必须是数组');
    }
    if (!Array.isArray(tests)) {
      throw new HdlError('spec.tests 必须是数组');
    }
    if (tests.length === 0) {
      throw new HdlError('测试用例为空');
    }

    var names = new Set();
    function normalizePorts(list, kind) {
      var result = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (!item || typeof item !== 'object' || typeof item.name !== 'string' || item.name === '') {
          throw new HdlError('spec.' + kind + ' 中存在无效端口');
        }
        if (names.has(item.name)) {
          throw new HdlError('spec 端口 ' + item.name + ' 重复');
        }
        names.add(item.name);
        var width = item.width === undefined ? 1 : item.width;
        if (!Number.isInteger(width) || width < 1 || width > MAX_WIDTH) {
          throw new HdlError('spec 端口 ' + item.name + ' 的位宽无效');
        }
        result.push({ name: item.name, width: width });
      }
      return result;
    }

    var normalizedInputs = normalizePorts(inputs, 'inputs');
    var normalizedOutputs = normalizePorts(outputs, 'outputs');

    for (var t = 0; t < tests.length; t++) {
      var test = tests[t];
      if (!test || typeof test !== 'object') {
        throw new HdlError('第 ' + (t + 1) + ' 个测试用例格式无效');
      }
      if (test.in !== undefined && test.in !== null && typeof test.in !== 'object') {
        throw new HdlError('第 ' + (t + 1) + ' 个测试用例的输入格式无效');
      }
      if (test.out !== undefined && test.out !== null && typeof test.out !== 'object') {
        throw new HdlError('第 ' + (t + 1) + ' 个测试用例的输出格式无效');
      }
    }

    return {
      moduleName: (typeof spec.moduleName === 'string' && spec.moduleName) ? spec.moduleName : null,
      inputs: normalizedInputs,
      outputs: normalizedOutputs,
      tests: tests
    };
  }

  function mapPorts(elab, spec, warnings) {
    var used = new Set();
    var inputBySpec = new Map();
    var outputBySpec = new Map();

    function exactPort(name, direction) {
      for (var i = 0; i < elab.ports.length; i++) {
        var p = elab.ports[i];
        if (!used.has(p.name) && p.name === name && p.direction === direction) return p;
      }
      return null;
    }

    function sameNamePort(name) {
      for (var i = 0; i < elab.ports.length; i++) {
        if (elab.ports[i].name === name) return elab.ports[i];
      }
      return null;
    }

    function widthWarn(specPort, port) {
      if (port.width !== specPort.width) {
        warnings.push('第 ' + port.line + ' 行：端口 ' + specPort.name +
          ' 的位宽为 ' + port.width + '，spec 要求 ' + specPort.width);
      }
    }

    for (var i = 0; i < spec.inputs.length; i++) {
      var sp = spec.inputs[i];
      var p = exactPort(sp.name, 'input');
      if (!p) {
        var same = sameNamePort(sp.name);
        if (same) {
          throw new HdlError('端口 ' + sp.name + ' 的方向应为输入', same.line);
        }
      } else {
        used.add(p.name);
        inputBySpec.set(sp.name, p);
      }
    }

    for (var j = 0; j < spec.outputs.length; j++) {
      var so = spec.outputs[j];
      var po = exactPort(so.name, 'output');
      if (!po) {
        var sameOut = sameNamePort(so.name);
        if (sameOut) {
          throw new HdlError('端口 ' + so.name + ' 的方向应为输出', sameOut.line);
        }
      } else {
        used.add(po.name);
        outputBySpec.set(so.name, po);
      }
    }

    var availableInputs = [];
    var availableOutputs = [];
    for (var pi = 0; pi < elab.ports.length; pi++) {
      var port = elab.ports[pi];
      if (used.has(port.name)) continue;
      if (port.direction === 'input') availableInputs.push(port);
      else if (port.direction === 'output') availableOutputs.push(port);
    }

    for (var ii = 0; ii < spec.inputs.length; ii++) {
      var sIn = spec.inputs[ii];
      if (inputBySpec.has(sIn.name)) {
        widthWarn(sIn, inputBySpec.get(sIn.name));
        continue;
      }
      if (availableInputs.length === 0) {
        throw new HdlError('缺少输入端口 ' + sIn.name, elab.module.line);
      }
      var fallbackIn = availableInputs.shift();
      used.add(fallbackIn.name);
      inputBySpec.set(sIn.name, fallbackIn);
      warnings.push('第 ' + fallbackIn.line + ' 行：端口 ' + fallbackIn.name +
        ' 与 spec 的输入 ' + sIn.name + ' 名称不一致，已按声明顺序匹配');
      widthWarn(sIn, fallbackIn);
    }

    for (var oi = 0; oi < spec.outputs.length; oi++) {
      var sOut = spec.outputs[oi];
      if (outputBySpec.has(sOut.name)) {
        widthWarn(sOut, outputBySpec.get(sOut.name));
        continue;
      }
      if (availableOutputs.length === 0) {
        throw new HdlError('缺少输出端口 ' + sOut.name, elab.module.line);
      }
      var fallbackOut = availableOutputs.shift();
      used.add(fallbackOut.name);
      outputBySpec.set(sOut.name, fallbackOut);
      warnings.push('第 ' + fallbackOut.line + ' 行：端口 ' + fallbackOut.name +
        ' 与 spec 的输出 ' + sOut.name + ' 名称不一致，已按声明顺序匹配');
      widthWarn(sOut, fallbackOut);
    }

    for (var xi = 0; xi < elab.ports.length; xi++) {
      var extra = elab.ports[xi];
      if (!used.has(extra.name)) {
        warnings.push('第 ' + extra.line + ' 行：端口 ' + extra.name + ' 未在 spec 中声明');
      }
    }

    var inputs = [];
    var outputs = [];
    for (var k = 0; k < spec.inputs.length; k++) {
      inputs.push({ specName: spec.inputs[k].name, specPort: spec.inputs[k], port: inputBySpec.get(spec.inputs[k].name) });
    }
    for (var m = 0; m < spec.outputs.length; m++) {
      outputs.push({ specName: spec.outputs[m].name, specPort: spec.outputs[m], port: outputBySpec.get(spec.outputs[m].name) });
    }
    return { inputs: inputs, outputs: outputs };
  }

  function check(code, spec) {
    var warnings = [];
    var total = 0;
    var moduleName = '';
    var selectedModuleName = '';
    var selectedModule = null;

    try {
      if (spec && typeof spec === 'object' && Array.isArray(spec.tests)) {
        total = spec.tests.length;
      }
      var specInfo = validateSpec(spec);
      total = specInfo.tests.length;
      moduleName = specInfo.moduleName || '';

      if (typeof code !== 'string') {
        throw new HdlError('代码必须是字符串');
      }
      if (code.length > MAX_CODE_LENGTH) {
        throw new HdlError('代码过长（最多 ' + MAX_CODE_LENGTH + ' 个字符）');
      }

      var work = createWork(Date.now() + TIME_LIMIT_MS);
      var tokens = tokenize(code);
      var parser = new Parser(tokens);
      var modules = parser.parseSource();

      if (specInfo.moduleName) {
        for (var mi = 0; mi < modules.length; mi++) {
          if (modules[mi].name === specInfo.moduleName) {
            selectedModule = modules[mi];
            break;
          }
        }
        if (!selectedModule) {
          selectedModule = modules[0];
          warnings.push('未找到模块 ' + specInfo.moduleName + '，已使用模块 ' + selectedModule.name);
        }
      } else {
        selectedModule = modules[0];
      }

      selectedModuleName = selectedModule.name;
      moduleName = selectedModule.name;

      var elab = elaborateModule(selectedModule, work, warnings);
      var mapping = mapPorts(elab, specInfo, warnings);

      var failures = [];
      var failed = 0;

      for (var ti = 0; ti < specInfo.tests.length; ti++) {
        tickWork(work, selectedModule.line);
        var test = specInfo.tests[ti];
        var values = simulateTest(elab, mapping, test, work);
        var testOut = (test.out && typeof test.out === 'object') ? test.out : {};
        var expectedCopy = {};
        var gotCopy = {};
        var mismatch = false;

        for (var oi = 0; oi < mapping.outputs.length; oi++) {
          var output = mapping.outputs[oi];
          var name = output.specName;
          var expectedRaw = Object.prototype.hasOwnProperty.call(testOut, name) ? testOut[name] : 0;
          var expectedBig = coerceTestValue(expectedRaw);
          var gotBig = values.get(output.port.name) || 0n;
          expectedCopy[name] = expectedRaw;
          gotCopy[name] = Number(gotBig);
          if (expectedBig !== gotBig) mismatch = true;
        }

        if (mismatch) {
          failed++;
          if (failures.length < 5) {
            var inputCopy = {};
            var sourceIn = (test.in && typeof test.in === 'object') ? test.in : {};
            for (var key in sourceIn) {
              if (Object.prototype.hasOwnProperty.call(sourceIn, key)) {
                inputCopy[key] = sourceIn[key];
              }
            }
            failures.push({
              in: inputCopy,
              expected: expectedCopy,
              got: gotCopy
            });
          }
        }
      }

      return {
        ok: failed === 0,
        error: null,
        failures: failures,
        passed: total - failed,
        total: total,
        moduleName: selectedModuleName,
        warnings: warnings
      };
    } catch (e) {
      return {
        ok: false,
        error: formatError(e),
        failures: [],
        passed: 0,
        total: total,
        moduleName: selectedModuleName || moduleName,
        warnings: warnings
      };
    }
  }

  root.HDL = { check: check };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.HDL;
  }
})(typeof window !== 'undefined' ? window : globalThis);

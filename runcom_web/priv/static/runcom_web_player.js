(() => {
  // node_modules/asciinema-player/dist/logging--P0CsEu_.js
  function parseNpt(time) {
    if (typeof time === "number") {
      return time;
    } else if (typeof time === "string") {
      return time.split(":").reverse().map(parseFloat).reduce((sum, n, i) => sum + n * Math.pow(60, i));
    } else {
      return void 0;
    }
  }
  function debounce(f, delay) {
    let timeout;
    return function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => f.apply(this, args), delay);
    };
  }
  function throttle(f, interval) {
    let enableCall = true;
    return function() {
      if (!enableCall) return;
      enableCall = false;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      f.apply(this, args);
      setTimeout(() => enableCall = true, interval);
    };
  }
  var FULL_HEX_COLOR_REGEX = /^#[0-9a-f]{6}$/;
  var SHORT_HEX_COLOR_REGEX = /^#[0-9a-f]{3}$/;
  function normalizeHexColor(color) {
    let fallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
    if (typeof color !== "string") return fallback;
    const normalized = color.trim().toLowerCase();
    if (FULL_HEX_COLOR_REGEX.test(normalized)) {
      return normalized;
    }
    if (SHORT_HEX_COLOR_REGEX.test(normalized)) {
      return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }
    return fallback;
  }
  function lerpOklab(t, c1, c2) {
    return [c1[0] + t * (c2[0] - c1[0]), c1[1] + t * (c2[1] - c1[1]), c1[2] + t * (c2[2] - c1[2])];
  }
  function hexToOklab(hex) {
    const [r, g, b] = hexToSrgb(hex).map(srgbToLinear);
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    return [0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_, 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_, 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_];
  }
  function oklabToHex(lab) {
    const rgb = oklabToSrgb(lab);
    if (isSrgbInGamut(rgb)) return srgbToHex(rgb);
    const [L, C, h] = oklabToOklch(lab);
    let low = 0;
    let high = C;
    let best = [L, 0, h];
    for (let i = 0; i < 24; i += 1) {
      const mid = (low + high) / 2;
      const candidate = [L, mid, h];
      const candidateRgb = oklabToSrgb(oklchToOklab(candidate));
      if (isSrgbInGamut(candidateRgb)) {
        low = mid;
        best = candidate;
      } else {
        high = mid;
      }
    }
    return srgbToHex(oklabToSrgb(oklchToOklab(best)));
  }
  function oklabToSrgb(lab) {
    const L = clamp(lab[0], 0, 1);
    const a = lab[1];
    const b = lab[2];
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;
    const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(blue)];
  }
  function oklabToOklch(_ref) {
    let [L, a, b] = _ref;
    return [L, Math.hypot(a, b), Math.atan2(b, a)];
  }
  function oklchToOklab(_ref2) {
    let [L, C, h] = _ref2;
    return [L, C * Math.cos(h), C * Math.sin(h)];
  }
  function hexToSrgb(hex) {
    return [Number.parseInt(hex.slice(1, 3), 16) / 255, Number.parseInt(hex.slice(3, 5), 16) / 255, Number.parseInt(hex.slice(5, 7), 16) / 255];
  }
  function srgbToHex(rgb) {
    const toHex = (value) => {
      const byte = Math.round(clamp(value, 0, 1) * 255);
      return byte.toString(16).padStart(2, "0");
    };
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
  }
  function srgbToLinear(c) {
    if (c <= 0.04045) return c / 12.92;
    return ((c + 0.055) / 1.055) ** 2.4;
  }
  function linearToSrgb(c) {
    if (c <= 31308e-7) return c * 12.92;
    return 1.055 * c ** (1 / 2.4) - 0.055;
  }
  function isSrgbInGamut(_ref3) {
    let [r, g, b] = _ref3;
    return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  var DummyLogger = class {
    log() {
    }
    debug() {
    }
    info() {
    }
    warn() {
    }
    error() {
    }
  };
  var PrefixedLogger = class {
    constructor(logger, prefix) {
      this.logger = logger;
      this.prefix = prefix;
    }
    log(message) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      this.logger.log(`${this.prefix}${message}`, ...args);
    }
    debug(message) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      this.logger.debug(`${this.prefix}${message}`, ...args);
    }
    info(message) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      this.logger.info(`${this.prefix}${message}`, ...args);
    }
    warn(message) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      this.logger.warn(`${this.prefix}${message}`, ...args);
    }
    error(message) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }
      this.logger.error(`${this.prefix}${message}`, ...args);
    }
  };

  // node_modules/asciinema-player/dist/core-DnNOMtZn.js
  var wasm;
  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  function debugString(val) {
    const type = typeof val;
    if (type == "number" || type == "boolean" || val == null) {
      return `${val}`;
    }
    if (type == "string") {
      return `"${val}"`;
    }
    if (type == "symbol") {
      const description = val.description;
      if (description == null) {
        return "Symbol";
      } else {
        return `Symbol(${description})`;
      }
    }
    if (type == "function") {
      const name = val.name;
      if (typeof name == "string" && name.length > 0) {
        return `Function(${name})`;
      } else {
        return "Function";
      }
    }
    if (Array.isArray(val)) {
      const length = val.length;
      let debug = "[";
      if (length > 0) {
        debug += debugString(val[0]);
      }
      for (let i = 1; i < length; i++) {
        debug += ", " + debugString(val[i]);
      }
      debug += "]";
      return debug;
    }
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className2;
    if (builtInMatches && builtInMatches.length > 1) {
      className2 = builtInMatches[1];
    } else {
      return toString.call(val);
    }
    if (className2 == "Object") {
      try {
        return "Object(" + JSON.stringify(val) + ")";
      } catch (_) {
        return "Object";
      }
    }
    if (val instanceof Error) {
      return `${val.name}: ${val.message}
${val.stack}`;
    }
    return className2;
  }
  function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  var cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
  }
  var cachedUint32ArrayMemory0 = null;
  function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
      cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
  }
  var cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function getObject(idx) {
    return heap[idx];
  }
  var heap = new Array(128).fill(void 0);
  heap.push(void 0, null, true, false);
  var heap_next = heap.length;
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length, 1) >>> 0;
      getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
      const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
      const ret = cachedTextEncoder.encodeInto(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  var cachedTextDecoder = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  cachedTextDecoder.decode();
  var MAX_SAFARI_DECODE_BYTES = 2146435072;
  var numBytesDecoded = 0;
  function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
      cachedTextDecoder = new TextDecoder("utf-8", {
        ignoreBOM: true,
        fatal: true
      });
      cachedTextDecoder.decode();
      numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }
  var cachedTextEncoder = new TextEncoder();
  if (!("encodeInto" in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function(arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
        read: arg.length,
        written: buf.length
      };
    };
  }
  var WASM_VECTOR_LEN = 0;
  var VtFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm.__wbg_vt_free(ptr >>> 0, 1));
  var Vt = class _Vt {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(_Vt.prototype);
      obj.__wbg_ptr = ptr;
      VtFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      VtFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vt_free(ptr, 0);
    }
    /**
     * @param {string} s
     * @returns {any}
     */
    feed(s) {
      const ptr0 = passStringToWasm0(s, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.vt_feed(this.__wbg_ptr, ptr0, len0);
      return takeObject(ret);
    }
    /**
     * @param {number} cols
     * @param {number} rows
     * @returns {any}
     */
    resize(cols, rows) {
      const ret = wasm.vt_resize(this.__wbg_ptr, cols, rows);
      return takeObject(ret);
    }
    /**
     * @returns {Uint32Array}
     */
    getSize() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vt_getSize(retptr, this.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayU32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 4, 4);
        return v1;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} row
     * @param {boolean} cursor_on
     * @returns {any}
     */
    getLine(row, cursor_on) {
      const ret = wasm.vt_getLine(this.__wbg_ptr, row, cursor_on);
      return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    getCursor() {
      const ret = wasm.vt_getCursor(this.__wbg_ptr);
      return takeObject(ret);
    }
  };
  if (Symbol.dispose) Vt.prototype[Symbol.dispose] = Vt.prototype.free;
  function create(cols, rows, scrollback_limit, bold_is_bright) {
    const ret = wasm.create(cols, rows, scrollback_limit, bold_is_bright);
    return Vt.__wrap(ret);
  }
  var EXPECTED_RESPONSE_TYPES = /* @__PURE__ */ new Set(["basic", "cors", "default"]);
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);
          if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {
            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    } else {
      const instance = await WebAssembly.instantiate(module, imports);
      if (instance instanceof WebAssembly.Instance) {
        return {
          instance,
          module
        };
      } else {
        return instance;
      }
    }
  }
  function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_debug_string_adfb662ae34724b6 = function(arg0, arg1) {
      const ret = debugString(getObject(arg1));
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_new_13317ed16189158e = function() {
      const ret = new Array();
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_4ceb6a766bf78b04 = function() {
      const ret = new Object();
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
      getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_set_8b6a9a61e98a8881 = function(arg0, arg1, arg2) {
      getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cast_4625c577ab2ec9ee = function(arg0) {
      const ret = BigInt.asUintN(64, arg0);
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {
      const ret = arg0;
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
      takeObject(arg0);
    };
    return imports;
  }
  function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
  }
  function initSync(module) {
    if (wasm !== void 0) return wasm;
    if (typeof module !== "undefined") {
      if (Object.getPrototypeOf(module) === Object.prototype) {
        ({
          module
        } = module);
      } else {
        console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
      }
    }
    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
      module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
  }
  async function __wbg_init(module_or_path) {
    if (wasm !== void 0) return wasm;
    if (typeof module_or_path !== "undefined") {
      if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
        ({
          module_or_path
        } = module_or_path);
      } else {
        console.warn("using deprecated parameters for the initialization function; pass a single object instead");
      }
    }
    const imports = __wbg_get_imports();
    if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
      module_or_path = fetch(module_or_path);
    }
    const {
      instance,
      module
    } = await __wbg_load(await module_or_path, imports);
    return __wbg_finalize_init(instance, module);
  }
  var exports = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    Vt,
    create,
    default: __wbg_init,
    initSync
  });
  var base64codes = [62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 0, 0, 0, 0, 0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
  function getBase64Code(charCode) {
    return base64codes[charCode - 43];
  }
  function base64Decode(str) {
    let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
    let n = str.length;
    let result = new Uint8Array(3 * (n / 4));
    let buffer2;
    for (let i = 0, j = 0; i < n; i += 4, j += 3) {
      buffer2 = getBase64Code(str.charCodeAt(i)) << 18 | getBase64Code(str.charCodeAt(i + 1)) << 12 | getBase64Code(str.charCodeAt(i + 2)) << 6 | getBase64Code(str.charCodeAt(i + 3));
      result[j] = buffer2 >> 16;
      result[j + 1] = buffer2 >> 8 & 255;
      result[j + 2] = buffer2 & 255;
    }
    return result.subarray(0, result.length - missingOctets);
  }
  var vtWasmModule = base64Decode("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CAgJCgsODA4NDgsgAkGoAWpBASABKAIAIAEoAgRB1NzAABCBASABIAIpA6gBNwIAIABBADoAAAwYCyACQbABakEBIAEoAgAgASgCBEHk3MAAEIEBIAEgAikDsAE3AgAgAEEBOgAADBcLIAJBuAFqQQEgASgCACABKAIEQfTcwAAQgQEgASACKQO4ATcCACAAQQI6AAAMFgsgAkHAAWpBASABKAIAIAEoAgRBhN3AABCBASABIAIpA8ABNwIAIABBAzoAAAwVCyACQcgBakEBIAEoAgAgASgCBEGU3cAAEIEBIAEgAikDyAE3AgAgAEEEOgAADBQLIAJB0AFqQQEgASgCACABKAIEQaTdwAAQgQEgASACKQPQATcCACAAQQU6AAAMEwsgAkHYAWpBASABKAIAIAEoAgRBtN3AABCBASABIAIpA9gBNwIAIABBBjoAAAwSCyACQeABakEBIAEoAgAgASgCBEHE3cAAEIEBIAEgAikD4AE3AgAgAEEHOgAADBELIAJB6AFqQQEgASgCACABKAIEQdTdwAAQgQEgASACKQPoATcCACAAQQg6AAAMEAsgAkHwAWpBASABKAIAIAEoAgRB5N3AABCBASABIAIpA/ABNwIAIABBCToAAAwPCyACQfgBakEBIAEoAgAgASgCBEH03cAAEIEBIAEgAikD+AE3AgAgAEEKOgAADA4LIAJBgAJqQQEgASgCACABKAIEQYTewAAQgQEgASACKQOAAjcCACAAQQs6AAAMDQsgAkGIAmpBASABKAIAIAEoAgRBlN7AABCBASABIAIpA4gCNwIAIABBDDoAAAwMCyACQZACakEBIAEoAgAgASgCBEGk3sAAEIEBIAEgAikDkAI3AgAgAEENOgAADAsLAkACQCADQR5rQf//A3FBCE8EQCADQSZrDgIBCAILIAJBCGpBASABKAIAIAEoAgRBxODAABCBASABIAIpAwg3AgAgACADQR5rOgACIABBDjsAAAwMCwJAIAEoAgQiA0ECTwRAIAJBmAFqIAEoAgBBEGoQaSACKAKYASIDDQEgASgCBCEDCyACQegAakEBIAEoAgAgA0G03sAAEIEBIAIoAmwhAyACKAJoIQQMDQsCQAJAAkAgAigCnAFBAUcNACADLwEAQQJrDgQBAAACAAsgAkHwAGpBASABKAIAIAEoAgRBhN/AABCB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ACABQQRqIQwgAkFAayENIAJBJWohDiACQRxqIQ8gASgCJCEFIAEoAhQhECABKAIQIQMCQAJAAn8CQANAIAEoAgAhBiABQYCAgIB4NgIAIAEoAgQhCwJAAkACQAJAAkAgBkGAgICAeEcEQCABKQIIIREgCyEHDAELAkAgAyAQRgRAQYCAgIB4IQYMAQsgASADQRBqIgg2AhAgAykCCCERIAMoAgQhByADKAIAIQYgCCEDC0GAgICAeCALEKMBIAZBgICAgHhGDQELIAIgBzYCDCACIAY2AgggAiARNwIQIBFCIIghEkF/IAUgEaciBEcgBCAFSxtB/wFxDgICAwELQYCAgIB4IAcQowEgAEGAgICAeDYCACABQYCAgIB4NgIADAcLAkAgEqdBAXENACAFIAQgByAEEDRrIgMgAyAFSRsiAyAESw0AIAIgAzYCECADIQQLAn9BgICAgHggBCAFTQ0AGgJAAkAgByAEIAVBuNrAABCQASgCBEUEQCACQThqIgMgAkEIaiIIIAVBAWsQPyACQTBqIANBCGooAgA2AgAgAiACKQI4NwMoIAItABQhBCADQRBqIAIoAgwgAigCECIHIAdBAWtB2NrAABCQASIHQRBqLwEAOwEAIAJCoICAgBA3AjggAiAHKQIINwJAIAggA0Ho2sAAEFcgAiAEOgA0IAItABRBAXFFDQEMAgsgAkE4aiIDIAJBCGogBRA/IAJBMGogA0EIaigCADYCACACIAIpAjg3AyggAiACLQAUIgM6ADQgAw0BCyACQShqEIsBCyACKAIwBEAgAkFAayACQTRqKAIANgIAIAJBAToAFCACIAIpAiw3AzggAigCKAwBCyACKAIoIAIoAixBBEEUEJ8BQYCAgIB4CyEDQYCAgIB4IAsQowEgASADNgIAIAwgAikDODcCACAMQQhqIAJBQGsoAgA2AgAgAEEIaiACQRBqKQIANwIAIAAgAikCCDcCAAwGCyAAIBE3AgggACAHNgIEIAAgBjYCAAwFCwJAIAMgEEcEQCABIANBEGoiCDYCECADKAIAIgZBgICAgHhHDQELIAJBADsAQCACQQI6ADwgAkECOgA4IAJBCGoiASAFIAJBOGoQQSAAIAIpAgg3AgAgAkEAOgAUIABBCGogAUEIaikCADcCAAwFCyADQQxqKAIAIQkgDyADKQIENwIAIA9BCGogCTYCACACIAY2AhggBSAEayIJRQ0BIBKnQQFxRQRAIAJBADsAQCACQQI6ADwgAkECOgA4IAJBCGogBSACQThqEEEMAgsgAi0AJEUEQCACQRhqEIsBCyACKAIcIQMgAigCICIKIAlNBEAgAkEIaiIEIAMgChCAAQJAIAItACQiBg0AIAJBADoAFCACKAIQIAVPDQAgAkEAOwBAIAJBAjoAPCACQQI6ADggBCAFIAJBOGoQQQsgAigCGCADQQRBFBCfASAGRQ0EQYCAgIB4IAsQowEgAUEIaiACQRBqKQIANwIAIAEgAikCCDcCAEGAgICAeCACEKMBIAghAwwBCwsgAyAKIAlB+NnAABCQASgCBEUEQCANQQhqIAcgBCAEQQFrQYjawAAQkAEiCEEQai8BADsBACANIAgpAgg3AgAgAkKggICAEDcCOCACQQhqIAJBOGpBmNrAABBXIAlBAWshCQsgCSAKTQRAIAJBCGogAyAJEIABIAIoAhghBiADIAogCRCIASAGQYCAgIB4Rg0DIAogCiAJayIIIAggCksbIQQgAi0AJAwCCyAJIApBqNrAABCzAQALIAJBKmogDkECai0AADoAACACIA4vAAA7ASggAigCICEEIAIoAhwhAyACLQAkCyEIQYCAgIB4IAsQowEgASAIOgAMIAEgBDYCCCABIAM2AgQgASAGNgIAIAEgAi8BKDsADSABQQ9qIAJBKmotAAA6AAALIAAgAikCCDcCACAAQQhqIAJBEGopAgA3AgALIAJB0ABqJAAL5QoCEH8BfiMAQZABayICJAAgACgCbCIFIAAoAhwiBmsiAUEAIAEgACgCFCIHIAZrIAVqTRshDSAFIAdqIQMgB0EEdCIBIAAoAhAiCmohDyAAKAIYIQwgACgCaCEOIAAoAqABIQsgACgCnAEhCCAKIQQDQAJAIAMgBkYNACABRQ0AIAkgDGpBACAELQAMIhAbIQkgA0EBayEDIAFBEGshASAEQRBqIQQgDSAQQQFzaiENDAELCyAIIAxHBEBBACEFIABBADYCFCACIAg2AjggAkEANgI0IAIgBzYCMCACIABBDGoiDDYCLCACIA82AiggAiAKNgIkIAJBgICAgHg2AhQgAkHIAGogAkEUaiIBEBACfyACKAJIQYCAgIB4RgRAIAEQoQFBBCEEQQAMAQsgAkEIakEE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QQlJDQEgA0UEQCABIQMDQCADIAVqIgEgAyACEGogASEDIAIgACACayIATQ0ACwwBCwtBACAAQQR0IgNrIQUDQCABIAVqIAEgABBqIAEgA2ohASACIABrIgIgAE8NAAsMAQsLIAEgAEEEdCIFayIDIAJBBHQiBmohByAAIAJLDQEgBEEQaiIAIAMgBRAWGiADIAEgBhASIAcgACAFEBYaDAILIARBCGoiByABIABBBHRrIgZBCGopAgA3AwAgBCAGKQIANwMAIAJBBHQhCCACIgUhAQNAIAYgAUEEdGohAwNAIARBGGoiCSADQQhqIgopAgA3AwAgBCADKQIANwMQIAcpAwAhDSADIAQpAwA3AgAgCiANNwIAIAcgCSkDADcDACAEIAQpAxA3AwAgACABSwRAIAMgCGohAyABIAJqIQEMAQsLIAEgAGsiAQRAIAEgBSABIAVJGyEFDAEFIAQpAwAhDSAGQQhqIARBCGoiBykDADcCACAGIA03AgBBASAFIAVBAU0bIQlBASEBA0AgASAJRg0EIAYgAUEEdGoiBSkCACENIAcgBUEIaiIKKQIANwMAIAQgDTcDACABIAJqIQMDQCAEQRhqIgsgBiADQQR0aiIIQQhqIgwpAgA3AwAgBCAIKQIANwMQIAcpAwAhDSAIIAQpAwA3AgAgDCANNwIAIAcgCykDADcDACAEIAQpAxA3AwAgACADSwRAIAIgA2ohAwwBCyADIABrIgMgAUcNAAsgBCkDACENIAogBykDADcCACAFIA03AgAgAUEBaiEBDAALAAsACwALIARBEGoiACABIAYQFhogByADIAUQEiADIAAgBhAWGgsgBEGQAWokAAuQBQEIfwJAIAJBEEkEQCAAIQMMAQsCQEEAIABrQQNxIgYgAGoiBSAATQ0AIAZBAWsgACEDIAEhBCAGBEAgBiEHA0AgAyAELQAAOgAAIARBAWohBCADQQFqIQMgB0EBayIHDQALC0EHSQ0AA0AgAyAELQAAOgAAIANBAWogBEEBai0AADoAACADQQJqIARBAmotAAA6AAAgA0EDaiAEQQNqLQAAOgAAIANBBGogBEEEai0AADoAACADQQVqIARBBWotAAA6AAAgA0EGaiAEQQZqLQAAOgAAIANBB2ogBEEHai0AADoAACAEQQhqIQQgBSADQQhqIgNHDQALCyACIAZr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AygCHCIAIAEgAhAlIANBKGogAEHgAGooAgAgAEHkAGooAgAQIyADQRBqIAAQJCADIAMpAxA3AjQgA0EIaiADKAIsIAMoAjAQWyADKAIMIQAgAygCCEEBcQRAIAMgADYCPCADQTxqQezCwAAQQgALIANBKGoQbiADKAIgIAMoAiQQsgEgA0FAayQAIAALmQEBA38gAUFsbCECIAFB/////wNxIQMgACABQRRsaiEBQQAhAAJAA0AgAkUNAQJAIAFBFGsiBCgCAEEgRw0AIAFBEGsoAgBBAUcNACABQQxrLQAAQQJHDQAgAUEIay0AAEECRw0AIAFBBGstAAANACABQQNrLQAAQR9xDQAgAkEUaiECIABBAWohACAEIQEMAQsLIAAhAwsgAwuxAQECfyMAQRBrIgIkAAJAIAFFDQAgAUEDakECdiEBAkAgAEEETQRAIAFBAWsiA0GAAkkNAQsgAkGsssEAKAIANgIIIAEgACACQQhqQaiqwQBBBEEFEE8hAEGsssEAIAIoAgg2AgAMAQsgAkGsssEANgIEIAIgA0ECdEGsqsEAaiIDKAIANgIMIAEgACACQQxqIAJBBGpBBkEHEE8hACADIAIoAgw2AgALIAJBEGokACAAC6ABAQN/IwBBEGsiBSQAIAVBCGogACABIAJB4M7AABBnIAUoAgwiBiADIAIgAWsiByADIAdJGyIDTwRAIAYgA2siBiAFKAIIIAZBBHRqIAMQFSAAIAEgASADaiAEECogAQRAIAAgAUEBa0HwzsAAEGJBADoADAsgACACQQFrQYDPwAAQYkEAOgAMIAVBEGokAA8LQczJwABBIUHwycAAEHEAC6gBAQF/IwBBQGoiAyQAIANBCGogACgCABACIAMoAgghACADIAMoAgw2AgQgAyAANgIAIANBATYCMCADQQI2AhggA0GYqsEANgIUIANCATcCICADIAMoAgQiADYCPCADIAMoAgA2AjggAyAANgI0IAMgA0E0ajYCLCADIANBLGo2AhwgASACIANBFGoQFyADKAI0IgEEQCADKAI4QQEgARA4CyADQUBrJAALpAEBAX8jAEEQayIDJAACQCAARQ0AIAJFDQACQCABQQRNBEAgAkEDakECdkEBayIBQYACSQ0BCyADQayywQAoAgA2AgggACADQQhqQaiqwQBBAhAxQayywQAgAygC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BDYCBCAAIAE2AgALOAACQCABaUEBRw0AQYCAgIB4IAFrIABJDQAgAARAQeyywQAtAAAaIAEgABA1IgFFDQELIAEPCwALOAACQCACQYCAxABGDQAgACACIAEoAhARAgBFDQBBAQ8LIANFBEBBAA8LIAAgA0EAIAEoAgwRAwALLQEBfyABIAAoAgBPBH8gACgCBCECIAAtAAhFBEAgASACTQ8LIAEgAkkFQQALC3ABA38gACgCACIEIAAoAggiBUYEQCMAQRBrIgMkACADQQhqIAAgBEEBQQJBCBAmIAMoAggiBEGBgICAeEcEQCADKAIMGiAEIAIQrgEACyADQRBqJAALIAAgBUEBajYCCCAAKAIEIAVBA3RqIAE3AQALNAEBfyAAKAIIIgMgACgCAEYEQCAAIAIQawsgACADQQFqNgIIIAAoAgQgA0ECdGogATYCAAsuAQF/IwBBEGsiAiQAIAJBCGogASAAEIwBIAIoAggiAARAIAJBEGokACAADwsACzcBAX8jAEEgayIBJAAgAUEANgIYIAFBATYCDCABQYzpwAA2AgggAUIENwIQIAFBCGogABCKAQALKgEBfyACIAMQNSIEBEAgBCAAIAEgAyABIANJGxAWGiAAIAIgARA4CyAECysAIAIgA0kEQCADIAIgBBC0AQALIAAgAiADazYCBCAAIAEgA0EUbGo2AgALLwEBfyAAIAIQjgEgACgCBCAAKAIIIgNBFGxqIAEgAkEUbBAWGiAAIAIgA2o2AggLKwAgASADSwRAIAEgAyAEELQBAAsgACADIAFrNgIEIAAgAiABQQR0ajYCAAsvAAJAAkAgA2lBAUcNAEGAgICAeCADayABSQ0AIAAgASADIAIQfiIADQELAAsgAAsuAANAIAEEQCAAKAIAIABBBGooAgBBBEEUEJ8BIAFBAWshASAAQRBqIQAMAQsLCzIBAX8gACgCCCECIAEgACgCAEECai0AABCbASEBIAAoAgQgAiABEAEgACACQQFqNgIICyoAIAAgACgCaCABaiIBIAAoApwBIgBBAWsgACABSxtBACABQQBOGzYCaAszAQJ/IAAgACgCqAEiAiAAKAKsAUEBaiIDIAEgAEGyAWoQNiAAKAJgIAAoAmQgAiADEFMLMwECfyAAIAAoAqgBIgIgACgCrAFBAWoiAyABIABBsgFqEB0gACgCYCAAKAJkIAIgAxBTCyoAIAEgAkkEQEGkyMAAQSNBvMnAABBxAAsgAiAAIAJBFGxqIAEgAmsQGQs1ACAAIAApAnQ3AmggACAAKQF8NwGyASAAIAAvAYYBOwG+ASAAQboBaiAAQYQBai8BADsBAAvsAQICfwF+IwBBEGsiAiQAIAJBATsBDCACIAE2AgggAiAANgIEIwBBEGsiASQAIAJBBGoiACkCACEEIAEgADYCDCABIAQ3AgQjAEEQayIAJAAgAUEEaiIBKAIAIgIoAgwhAwJAAkACQAJAIAIoAgQOAgABAgsgAw0BQQEhAkEAIQMMAgsgAw0AIAIoAgAiAigCBCEDIAIoAgAhAgwBCyAAQYCAgIB4NgIAIAAgATYCDCABKAIIIgEtAAkaIABBGyABLQAIEEoACyAAIAM2AgQgACACNgIAIAEoAggiAS0ACRogAEEcIAEtAAgQSgALKwECfwJAIAAoAgQgACgCCCIBEDQiAkUNACABIAJJDQAgACABIAJrNgIICwsmACACBEBB7LLBAC0AABogASACEDUhAQsgACACNgIEIAAgATYCAAsjAQF/IAEgACgCACAAKAIIIgJrSwRAIAAgAiABQQRBEBBtCwsjAQF/IAEgACgCACAAKAIIIgJrSwRAIAAgAiABQQRBFBBtCwslACAAQQE2AgQgACABKAIEIAEoAgBrQQR2IgE2AgggACABNgIACxsAIAEgAk0EQCACIAEgAxBLAAsgACACQRRsagsgACABIAJNBEAgAiABQeTjwAAQSwALIAAgAmpBAToAAAsbACABIAJNBEAgAiABIAMQSwALIAAgAkEEdGoLAwAACwMAAAsDAAALAwAACwMAAAsDAAALGgBB7LLBAC0AABpBBCAAEDUiAARAIAAPCwALIQAgAEUEQEGc68AAQTIQuQEACyAAIAIgAyABKAIQEQEACxYAIAFBAXFFBEAgALgQCQ8LIACtEAoLRgEBfyAAIAAoAgBBAWsiATYCACABRQRAIABBDGoQRwJAIABBf0YNACAAIAAoAgRBAWsiATYCBCABDQAgAEEEQZwGEDgLCwsfACAARQRAQZzrwABBMhC5AQALIAAgAiABKAIQEQIACyEBAX8gACgCECIBIAAoAhQQgwEgACgCDCABQQRBEBCfAQsSACAABEAgASACIAAgA2wQOAsLIQEBfyAAKAIEIgEgACgCCBCDASAAKAIAIAFBBEEQEJ8BCxYAIABBEGoQWCAAKAIAIAAoAgQQowELFAAgACAAKAIAQQFrNgIAIAEQnAELGQAgAEGAgICAeEcEQCAAIAFBBEEUEJ8BCwsUACABBEBBgICAgHggARCjAQsgAQsZACABKAIcQcjlwABBDiABKAIgKAIMEQMACw8AIAIEQCAAIAEgAhA4CwsPACABBEAgACACIAEQOAsLEwAgAARADwtBpKnBAEEbELkBAAsPACAAQYQBTwRAIAAQAwsLEwAgACgCCCAAKAIAQQJBAhCfAQsVACACIAIQpAEaIABBgICAgHg2AgALFAAgACgCACABIAAoAgQoAgwRAgALEAAgASAAKAIEIAAoAggQDws8ACAARQRAIwBBIGsiACQAIABBADYCGCAAQQE2AgwgAEHQxMAANgIIIABCBDcCECAAQQhqIAEQigEACwALFAAgAEEANgIIIABCgICAgBA3AgALEgAgACABQZDNwAAQYkEBOgAMCxAAIAEgACgCACAAKAIEEA8LDgAgAEEANgIAIAEQnAELawEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBAjYCDCADQejpwAA2AgggA0ICNwIUIAMgA0EEaq1CgICAgOABhDcDKCADIAOtQoCAgIDgAYQ3AyAgAyADQSBqNgIQIANBCGogAhCKAQALawEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBAjYCDCADQcjpwAA2AgggA0ICNwIUIAMgA0EEaq1CgICAgOABhDcDKCADIAOtQoCAgIDgAYQ3AyAgAyADQSBqNgIQIANBCGogAhCKAQALawEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBAjYCDCADQZzqwAA2AgggA0ICNwIUIAMgA0EEaq1CgICAgOABhDcDKCADIAOtQoCAgIDgAYQ3AyAgAyADQSBqNgIQIANBCGogAhCKAQALDgBB8OXAAEErIAAQcQALCwAgACMAaiQAIwALDgBBv6nBAEHPABC5AQALCQAgACABEAcACw0AIABB9ObAACABEBcLDAAgACABKQIANwMACwoAIAAoAgAQqQELDQAgAEGAgICAeDYCAAsJACAAQQA2AgALBgAgABBYCwUAQYAECwQAQQELBAAgAQsEAEEACwvSbSAAQYCAwAALQB0AAAAEAAAABAAAAB4AAABjYWxsZWQgYFJlc3VsdDo6dW53cmFwKClgIG9uIGFuIGBFcnJgIHZhbHVlRXJyb3IAQb+JwAALAXgAQeCJwAALEP////////////////////8AQYaKwAALDwEAAAAAACAAAAAAAAAAAgBBwIrAAAsg//////////////////////////////////////////8AQaSLwAALCBAAAAAAAAABAEHAuMAACwL/BwBB1LjAAAsHDwD////1/wBBgLnAAAsW////////////////////////////AwBBoLnAAAsd/////////////////////////////////////w8AQf+5wAALGPz//////////////////////////////wBBoLrAAAs+//////////////////////////////////////////////////////////////////////////////////8AQYy7wAALOP////////////////////////////////////////////////////////////////////////9/AEHgu8AAC9EB/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wMAQcC9wAALJ///////////////////////////////////////////////////DwBBwMDAAAvBI3NyYy9saWIucnMAAAEADwDwGg8AAAAAAOIlAADlJQAAAAAAALDgAACz4AAAAAAAADz7AQBp+wEAAAAAAGr7AQBs+wEAAAAAAIAlAACfJQAAAAAAAAD7AQA7+wEAAAAAAGF0dGVtcHRlZCB0byB0YWtlIG93bmVyc2hpcCBvZiBSdXN0IHZhbHVlIHdoaWxlIGl0IHdhcyBib3Jyb3dlZGJndGV4dGNvZGVwb2ludHNyYXN0ZXJfc3ltYm9s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FVFVVVVVVVVVAAAAAAAAQFVVVVVVVVVVVdVXVVVVVVVVVVVVVVUFAABUVVVVVVVVVVVVVVVVVRUAAFVVUVVVVVVVBRAAAAEBUFVVVVVVVVVVVVUBVVVVVVX/////f1VVVVBVAABVVVVVVVVVVVVVBQBBwPzAAAuYBEBVVVVVVVVVVVVVVVVVRVQBAFRRAQBVVQVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVRAFUVVFVFVVVBVVVVVVVVUVBVVVVVVVVVVVVVVVVVVVUQRUUUFFVVVVVVVVVUFFVVUFVVVVVVVVVVVVVVVVVVVQBEFRRVVVVVQVVVVVVVQUAUVVVVVVVVVVVVVVVVVVVBAFUVVFVAVVVBVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVFVFVVUVUVVVVVVVVVVVVVVVRUVVVVVVVVVVVVVVVVVQRUBQRQVUFVVQVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVFEQFBFBVQVVVBVVVVVVVVVVQVVVVVVVVVVVVVVVVVRVEAVRVQVUVVVUFVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVUUVBURVFVVVVVVVVVVVVVVVVVVVVVVVVVVVUQBAVVUVAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRAABUVVUAQFVVVVVVVVVVVVVVVVVVVVVVVVBVVVVVVVURUVVVVVVVVVVVVVVVVVUBAABAAARVAQAAAQAAAAAAAAAAVFVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQEEAEFBVVVVVVVVUAVUVVVVAVRVVUVBVVFVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqAEGAgcEAC5ADVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBVVVVVVVVVVVVVVVVBVRVVVVVVVUFVVVVVVVVVQVVVVVVVVVVBVVVVX///ff//ddfd9bV11UQAFBVRQEAAFVXUVVVVVVVVVVVVVUVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBVUVUVVAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVcVFFVVVVVVVVVVVVVVVVVVRQBARAEAVBUAABRVVVVVVVVVVVVVVVUAAAAAAAAAQFVVVVVVVVVVVVVVVQBVVVVVVVVVVVVVVVUAAFAFVVVVVVVVVVVVFQAAVVVVUFVVVVVVVVUFUBBQVVVVVVVVVVVVVVVVVUVQEVBVVVVVVVVVVVVVVVVVVQAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAAAQAVFFVVFBVVVVVVVVVVVVVVVVVVVVVVQBBoITBAAuTCFVVFQBVVVVVVVUFQFVVVVVVVVVVVVVVVQAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAAAAAAAAAAFRVVVVVVVVVVVX1VVVVaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/VfXVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX1VVVVVVV9VVVVVVVVVVVVVVVX///9VVVVVVVVVVVVV1VVVVVXVVVVVXVX1VVVVVX1VX1V1VVdVVVVVdVX1XXVdVV31VVVVVVVVVVdVVVVVVVVVVXfV31VVVVVVVVVVVVVVVVVVVf1VVVVVVVVXVVXVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdVXVVVVVVVVVVVVVVVVV11VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVBVVVVVVVVVVVVVVVVVVVX9////////////////X1XVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAAAAAAAAqqqqqqqqmqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlpVVVVVVVWqqqqqqqqqqqqqqqqqqgoAqqqqaqmqqqqqqqqqqqqqqqqqqqqqqqqqqmqBqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlWpqqqqqqqqqqqqqqmqqqqqqqqqqqqqqqqoqqqqqqqqqqqqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVlaqqqqqqqqqqqqqqaqqqqqqqqqqqqqpVVaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVVVVVVVVVVVVVVVVVVVVqqqqVqqqqqqqqqqqqqqqqqpqVVVVVVVVVVVVVVVVVV9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVQAAAUFVVVVVVVVUFVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVRUUVVVVVVVVVQVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBVVVVVVVUAAAAAUFVFFVVVVVVVVVVVVQUAUFVVVVVVFQAAUFVVVaqqqqqqqqpWQFVVVVVVVVVVVVVVFQVQUFVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVAUBBQVVVFVVVVFVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVQQUVAVRVVVVVVVVVVVVVVBVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFUUVVVVVWqqqqqqqqqqqpVVVUAAAAAAEAVAEG/jMEAC+EMVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAAAA8KqqWlUAAAAAqqqqqqqqqqpqqqqqqmqqVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFamqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlZVVVVVVVVVVVVVVVVVVQVUVVVVVVVVVVVVVVVVVVVVqmpVVQAAVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFQFUBQVUAVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBVVVVVVVV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVFVVVVVVVVVVVVVVVVVVVVVVVVUBVVVVVVVVVVVVVVVVVVVVVVUFAABUVVVVVVVVVVVVVVUFUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVAAAAQFVVVVVVVVVVVVUUVFUVUFVVVVVVVVVVVVVVFUBBVUVVVVVVVVVVVVVVVVVVVVVAVVVVVVVVVVUVAAEAVFVVVVVVVVVVVVVVVVVVFVVVVVBVVVVVVVVVVVVVVVUFAEAFVQEUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVUARVRVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRUVAEBVVVVVVVBVVVVVVVVVVVVVVVVVFURUVVVVVRVVVVUFAFQAVFVVVVVVVVVVVVVVVVVVVVUAAAVEVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVUUAEQRBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFQVQVRBUVVVVVVVVUFVVVVVVVVVVVVVVVVVVVVVVVVVVFQBAEVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVEAEFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBBRAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVAABBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVRUEEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAFVVRVVVVVVVVVAQBAVVVVVVVVVVVVFQAEQFUVVVUBQAFVVVVVVVVVVVVVAAAAAEBQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBAABBVVVVVVVVVVVVVVVVVVVVVVVVVVQUAAAAAAAUABEFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBQEUQAABVVVVVVVVVVVVVVVVVVVVVVVVQEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVUVVVAVVVVVVVVVVVVVVVVBUBVRFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFQAAAFBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBUVVVVVVVVVVVVVVVVVVUAQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVFUBVVVVVVVVVVVVVVVVVVVVVVVVVqlRVVVpVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVaqqqqqqqqqqqqqqqqqqqqqqqqqqqlpVVVVVVVVVVVVVqqpWVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqmqaaqqqqqqqqqqalVVVWVVVVVVVVVVallVVVWqVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVVVVVVVVQQBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBBq5nBAAt1UAAAAAAAQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRFQBQAAAABAAQBVVVVVVVVVBVBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFVFVVVVVVVVVVVVVVVVVVAEGtmsEACwJAFQBBu5rBAAvFBlRVUVVVVVRVVVVVFQABAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVUAQAAAAAAUABAEQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAQFVVVVVVVVVVVVVVVVVVV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXVVVVVVVVVVVVVVVVVVVVVdf3/f1VVVVVVVVVVVVVVVVVVVVVVVfX///////9uVVVVqqq6qqqqqur6v79VqqpWVV9VVVWqWlVVVVVVVf//////////V1VV/f/f///////////////////////3//////9VVVX/////////////f9X/VVVV/////1dX//////////////////////9/9//////////////////////////////////////////////////////////////X////////////////////X1VV1X////////9VVVVVdVVVVVVVVX1VVVVXVVVVVVVVVVVVVVVVVVVVVVVVVVXV////////////////////////////VVVVVVVVVVVVVVVV//////////////////////9fVVd//VX/VVXVV1X//1dVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX///9VV1VVVVVVVf//////////////f///3/////////////////////////////////////////////////////////////9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV////V///V1X//////////////9//X1X1////Vf//V1X//1dVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlpVVVVVVVVVVVmWVWGqpVmqVVVVVVWVVVVVVVVVVZVVVQBBjqHBAAsBAwBBnKHBAAuJCVVVVVVVlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFQCWalpaaqoFQKZZlWVVVVVVVVVVVQAAAABVVlVVqVZVVVVVVVVVVVVWVVVVVVVVVVUAAAAAAAAAAFRVVVWVWVlVVWVVVWlVVVVVVVVVVVVVVZVWlWqqqqpVqqpaVVVVWVWqqqpVVVVVZVVVWlVVVVWlZVZVVVWVVVVVVVVVppaalllZZamWqqpmVapVWllVWlZlVVVVaqqlpVpVVVWlqlpVVVlZVVVZVVVVVVWVVVVVVVVVVVVVVVVVVVVVVVVVVVVlVfVVVVVpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVqqqqqqqqqqqqVVVVqqqqqqVaVVWaqlpVpaVVWlqllqVaVVVVpVpVlVVVVX1VaVmlVV9VZlVVVVVVVVVVZlX///9VVVWammqaVVVV1VVVVVXVVVWlXVX1VVVVVb1Vr6q6qquqqppVuqr6rrquVV31VVVVVVVVVVdVVVVVWVVVVXfV31VVVVVVVVWlqqpVVVVVVVXVV1VVVVVVVVVVVVVVVVetWlVVVVVVVVVVVaqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqAAAAwKqqWlUAAAAAqqqqqqqqqqpqqqqqqmqqVVVVVVVVVVVVVVVVBVRVVVVVVVVVVVVVVVVVVVWqalVVAABUWaqqalWqqqqqqqqqWqqqqqqqqqqqqqqqqqqqWlWqqqqqqqqquv7/v6qqqqpWVVVVVVVVVVVVVVVVVfX///////8vbml4L3N0b3JlLzI4aHl6ZmwzMzhrczRhbWhhN3ZwcG5sYnExczFucWF2LXJ1c3QtZGVmYXVsdC0xLjg1LjAvbGliL3J1c3RsaWIvc3JjL3J1c3QvbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5ycy9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL3dhc20tYmluZGdlbi0wLjIuMTA2L3NyYy9jb252ZXJ0L3NsaWNlcy5ycy9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL3dhc20tYmluZGdlbi0wLjIuMTA2L3NyYy9leHRlcm5yZWYucnMdVBAAZwAAAH8AAAARAAAAHVQQAGcAAACMAAAAEQAAAG51bGwgcG9pbnRlciBwYXNzZWQgdG8gcnVzdHJlY3Vyc2l2ZSB1c2Ugb2YgYW4gb2JqZWN0IGRldGVjdGVkIHdoaWNoIHdvdWxkIGxlYWQgdG8gdW5zYWZlIGFsaWFzaW5nIGluIHJ1c3RKc1ZhbHVlKCkADlUQAAgAAAAWVRAAAQBBqKrBAAsBBABICXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AgZ3YWxydXMGMC4yNC40DHdhc20tYmluZGdlbhMwLjIuMTA2ICgxMTgzMWZiODkp");
  async function init(options) {
    await __wbg_init({
      module_or_path: await options.module,
      memory: options.memory
    });
    return exports;
  }
  var Clock = class {
    constructor() {
      let speed = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
      this.speed = speed;
      this.startTime = performance.now();
    }
    getTime() {
      return this.speed * (performance.now() - this.startTime) / 1e3;
    }
    setTime(time) {
      this.startTime = performance.now() - time / this.speed * 1e3;
    }
  };
  var NullClock = class {
    constructor() {
    }
    getTime(_speed) {
    }
    setTime(_time) {
    }
  };
  var Stream = class _Stream {
    constructor(input, xfs) {
      this.input = typeof input.next === "function" ? input : input[Symbol.iterator]();
      this.xfs = xfs ?? [];
    }
    map(f) {
      return this.transform(Map$1(f));
    }
    flatMap(f) {
      return this.transform(FlatMap(f));
    }
    filter(f) {
      return this.transform(Filter(f));
    }
    take(n) {
      return this.transform(Take(n));
    }
    drop(n) {
      return this.transform(Drop(n));
    }
    transform(f) {
      return new _Stream(this.input, this.xfs.concat([f]));
    }
    multiplex(other, comparator) {
      return new _Stream(new Multiplexer(this[Symbol.iterator](), other[Symbol.iterator](), comparator));
    }
    toArray() {
      return Array.from(this);
    }
    [Symbol.iterator]() {
      let v = 0;
      let values = [];
      let flushed = false;
      const xf = compose(this.xfs, (val) => values.push(val));
      return {
        next: () => {
          if (v === values.length) {
            values = [];
            v = 0;
          }
          while (values.length === 0) {
            const next = this.input.next();
            if (next.done) {
              break;
            } else {
              xf.step(next.value);
            }
          }
          if (values.length === 0 && !flushed) {
            xf.flush();
            flushed = true;
          }
          if (values.length > 0) {
            return {
              done: false,
              value: values[v++]
            };
          } else {
            return {
              done: true
            };
          }
        }
      };
    }
  };
  function Map$1(f) {
    return (emit) => {
      return (input) => {
        emit(f(input));
      };
    };
  }
  function FlatMap(f) {
    return (emit) => {
      return (input) => {
        f(input).forEach(emit);
      };
    };
  }
  function Filter(f) {
    return (emit) => {
      return (input) => {
        if (f(input)) {
          emit(input);
        }
      };
    };
  }
  function Take(n) {
    let c = 0;
    return (emit) => {
      return (input) => {
        if (c < n) {
          emit(input);
        }
        c += 1;
      };
    };
  }
  function Drop(n) {
    let c = 0;
    return (emit) => {
      return (input) => {
        c += 1;
        if (c > n) {
          emit(input);
        }
      };
    };
  }
  function compose(xfs, push) {
    return xfs.reverse().reduce((next, curr) => {
      const xf = toXf(curr(next.step));
      return {
        step: xf.step,
        flush: () => {
          xf.flush();
          next.flush();
        }
      };
    }, toXf(push));
  }
  function toXf(xf) {
    if (typeof xf === "function") {
      return {
        step: xf,
        flush: () => {
        }
      };
    } else {
      return xf;
    }
  }
  var Multiplexer = class {
    constructor(left, right, comparator) {
      this.left = left;
      this.right = right;
      this.comparator = comparator;
    }
    [Symbol.iterator]() {
      let leftItem;
      let rightItem;
      return {
        next: () => {
          if (leftItem === void 0 && this.left !== void 0) {
            const result = this.left.next();
            if (result.done) {
              this.left = void 0;
            } else {
              leftItem = result.value;
            }
          }
          if (rightItem === void 0 && this.right !== void 0) {
            const result = this.right.next();
            if (result.done) {
              this.right = void 0;
            } else {
              rightItem = result.value;
            }
          }
          if (leftItem === void 0 && rightItem === void 0) {
            return {
              done: true
            };
          } else if (leftItem === void 0) {
            const value = rightItem;
            rightItem = void 0;
            return {
              done: false,
              value
            };
          } else if (rightItem === void 0) {
            const value = leftItem;
            leftItem = void 0;
            return {
              done: false,
              value
            };
          } else if (this.comparator(leftItem, rightItem)) {
            const value = leftItem;
            leftItem = void 0;
            return {
              done: false,
              value
            };
          } else {
            const value = rightItem;
            rightItem = void 0;
            return {
              done: false,
              value
            };
          }
        }
      };
    }
  };
  function normalizeTheme(theme) {
    const foreground = normalizeHexColor(theme.foreground);
    const background = normalizeHexColor(theme.background);
    const paletteInput = theme.palette;
    if (paletteInput === void 0) return;
    if (!foreground || !background || paletteInput.length < 8) return;
    const palette = [];
    const limit = Math.min(paletteInput.length, 16);
    for (let i = 0; i < limit; i += 1) {
      const color = normalizeHexColor(paletteInput[i]);
      if (!color) return;
      palette.push(color);
    }
    for (let i = palette.length; i < 16; i += 1) {
      palette.push(palette[i - 8]);
    }
    return {
      foreground,
      background,
      palette
    };
  }
  async function parse$2(data) {
    if (data instanceof Response) {
      const text = await data.text();
      const result = parseJsonl(text);
      if (result !== void 0) {
        const {
          header,
          events
        } = result;
        if (header.version === 2) {
          return parseAsciicastV2(header, events);
        } else if (header.version === 3) {
          return parseAsciicastV3(header, events);
        } else {
          throw new Error(`asciicast v${header.version} format not supported`);
        }
      } else {
        const header = JSON.parse(text);
        if (header.version === 1) {
          return parseAsciicastV1(header);
        }
      }
    } else if (typeof data === "object" && data.version === 1) {
      return parseAsciicastV1(data);
    } else if (Array.isArray(data)) {
      const header = data[0];
      if (header.version === 2) {
        const events = data.slice(1, data.length);
        return parseAsciicastV2(header, events);
      } else if (header.version === 3) {
        const events = data.slice(1, data.length);
        return parseAsciicastV3(header, events);
      } else {
        throw new Error(`asciicast v${header.version} format not supported`);
      }
    }
    throw new Error("invalid data");
  }
  function parseJsonl(jsonl) {
    const lines = jsonl.split("\n");
    let header;
    try {
      header = JSON.parse(lines[0]);
    } catch (_error) {
      return;
    }
    const events = new Stream(lines).drop(1).filter((l) => l[0] === "[").map(JSON.parse);
    return {
      header,
      events
    };
  }
  function parseAsciicastV1(data) {
    let time = 0;
    const events = new Stream(data.stdout).map((e) => {
      time += e[0];
      return [time, "o", e[1]];
    });
    return {
      cols: data.width,
      rows: data.height,
      events
    };
  }
  function parseAsciicastV2(header, events) {
    return {
      cols: header.width,
      rows: header.height,
      theme: parseTheme$1(header.theme),
      events,
      idleTimeLimit: header.idle_time_limit
    };
  }
  function parseAsciicastV3(header, events) {
    if (!(events instanceof Stream)) {
      events = new Stream(events);
    }
    let time = 0;
    events = events.map((e) => {
      time += e[0];
      return [time, e[1], e[2]];
    });
    return {
      cols: header.term.cols,
      rows: header.term.rows,
      theme: parseTheme$1(header.term?.theme),
      events,
      idleTimeLimit: header.idle_time_limit
    };
  }
  function parseTheme$1(theme) {
    const palette = typeof theme?.palette === "string" ? theme.palette.split(":") : void 0;
    return normalizeTheme({
      foreground: theme?.fg,
      background: theme?.bg,
      palette
    });
  }
  function unparseAsciicastV2(recording2) {
    const header = JSON.stringify({
      version: 2,
      width: recording2.cols,
      height: recording2.rows
    });
    const events = recording2.events.map(JSON.stringify).join("\n");
    return `${header}
${events}
`;
  }
  function recording(src, _ref, _ref2) {
    let {
      feed,
      resize,
      onInput,
      onMarker,
      setState,
      logger
    } = _ref;
    let {
      speed,
      idleTimeLimit,
      startAt,
      loop,
      posterTime,
      markers: markers_,
      pauseOnMarkers,
      cols: initialCols,
      rows: initialRows,
      audioUrl
    } = _ref2;
    let cols;
    let rows;
    let events;
    let markers;
    let duration;
    let effectiveStartAt;
    let eventTimeoutId;
    let nextEventIndex = 0;
    let lastEventTime = 0;
    let startTime;
    let pauseElapsedTime;
    let playCount = 0;
    let waitingForAudio = false;
    let waitingTimeout;
    let shouldResumeOnAudioPlaying = false;
    let now = () => performance.now() * speed;
    let audioCtx;
    let audioElement;
    let audioSeekable = false;
    async function init2() {
      const timeout = setTimeout(() => {
        setState("loading");
      }, 3e3);
      try {
        let metadata = loadRecording(src, logger, {
          idleTimeLimit,
          startAt,
          markers_
        });
        const hasAudio = await loadAudio(audioUrl);
        metadata = await metadata;
        return {
          ...metadata,
          hasAudio
        };
      } finally {
        clearTimeout(timeout);
      }
    }
    async function loadRecording(src2, logger2, opts) {
      const {
        parser,
        minFrameTime,
        inputOffset,
        dumpFilename,
        encoding = "utf-8"
      } = src2;
      const data = await doFetch(src2);
      const recording2 = prepare(await parser(data, {
        encoding
      }), logger2, {
        ...opts,
        minFrameTime,
        inputOffset
      });
      ({
        cols,
        rows,
        events,
        duration,
        effectiveStartAt
      } = recording2);
      initialCols = initialCols ?? cols;
      initialRows = initialRows ?? rows;
      if (events.length === 0) {
        throw new Error("recording is missing events");
      }
      if (dumpFilename !== void 0) {
        dump(recording2, dumpFilename);
      }
      const poster = posterTime !== void 0 ? getPoster(posterTime) : void 0;
      markers = events.filter((e) => e[1] === "m").map((e) => [e[0], e[2].label]);
      return {
        cols,
        rows,
        duration,
        theme: recording2.theme,
        poster,
        markers
      };
    }
    async function loadAudio(audioUrl2) {
      if (!audioUrl2) return false;
      audioElement = await createAudioElement(audioUrl2);
      audioSeekable = !Number.isNaN(audioElement.duration) && audioElement.duration !== Infinity && audioElement.seekable.length > 0 && audioElement.seekable.end(audioElement.seekable.length - 1) === audioElement.duration;
      if (audioSeekable) {
        audioElement.addEventListener("playing", onAudioPlaying);
        audioElement.addEventListener("waiting", onAudioWaiting);
      } else {
        logger.warn(`audio is not seekable - you must enable range request support on the server providing ${audioElement.src} for audio seeking to work`);
      }
      return true;
    }
    async function doFetch(_ref3) {
      let {
        url,
        data,
        fetchOpts = {}
      } = _ref3;
      if (typeof url === "string") {
        return await doFetchOne(url, fetchOpts);
      } else if (Array.isArray(url)) {
        return await Promise.all(url.map((url2) => doFetchOne(url2, fetchOpts)));
      } else if (data !== void 0) {
        if (typeof data === "function") {
          data = data();
        }
        if (!(data instanceof Promise)) {
          data = Promise.resolve(data);
        }
        const value = await data;
        if (typeof value === "string" || value instanceof ArrayBuffer) {
          return new Response(value);
        } else {
          return value;
        }
      } else {
        throw new Error("failed fetching recording file: url/data missing in src");
      }
    }
    async function doFetchOne(url, fetchOpts) {
      const response = await fetch(url, fetchOpts);
      if (!response.ok) {
        throw new Error(`failed fetching recording from ${url}: ${response.status} ${response.statusText}`);
      }
      return response;
    }
    function scheduleNextEvent() {
      const nextEvent = events[nextEventIndex];
      if (nextEvent) {
        eventTimeoutId = scheduleAt(runNextEvent, nextEvent[0]);
      } else {
        onEnd();
      }
    }
    function scheduleAt(f, targetTime) {
      let timeout = (targetTime * 1e3 - (now() - startTime)) / speed;
      if (timeout < 0) {
        timeout = 0;
      }
      return setTimeout(f, timeout);
    }
    function runNextEvent() {
      let event = events[nextEventIndex];
      let elapsedWallTime;
      do {
        lastEventTime = event[0];
        nextEventIndex++;
        const stop = executeEvent2(event);
        if (stop) {
          return;
        }
        event = events[nextEventIndex];
        elapsedWallTime = now() - startTime;
      } while (event && elapsedWallTime > event[0] * 1e3);
      scheduleNextEvent();
    }
    function cancelNextEvent() {
      clearTimeout(eventTimeoutId);
      eventTimeoutId = null;
    }
    function executeEvent2(event) {
      const [time, type, data] = event;
      if (type === "o") {
        feed(data);
      } else if (type === "i") {
        onInput(data);
      } else if (type === "r") {
        const [cols2, rows2] = data.split("x");
        resize(cols2, rows2);
      } else if (type === "m") {
        onMarker(data);
        if (pauseOnMarkers) {
          pause();
          pauseElapsedTime = time * 1e3;
          setState("idle", {
            reason: "paused"
          });
          return true;
        }
      }
      return false;
    }
    function onEnd() {
      cancelNextEvent();
      playCount++;
      if (loop === true || typeof loop === "number" && playCount < loop) {
        nextEventIndex = 0;
        startTime = now();
        feed("\x1Bc");
        resizeTerminalToInitialSize();
        scheduleNextEvent();
        if (audioElement) {
          audioElement.currentTime = 0;
        }
      } else {
        pauseElapsedTime = duration * 1e3;
        setState("ended");
        if (audioElement) {
          audioElement.pause();
        }
      }
    }
    async function play() {
      if (eventTimeoutId) throw new Error("already playing");
      if (events[nextEventIndex] === void 0) throw new Error("already ended");
      if (effectiveStartAt !== null) {
        seek(effectiveStartAt);
      }
      await resume();
      return true;
    }
    function pause() {
      shouldResumeOnAudioPlaying = false;
      if (audioElement) {
        audioElement.pause();
      }
      if (!eventTimeoutId) return true;
      cancelNextEvent();
      pauseElapsedTime = now() - startTime;
      return true;
    }
    async function resume() {
      if (audioElement && !audioCtx) setupAudioCtx();
      startTime = now() - pauseElapsedTime;
      pauseElapsedTime = null;
      scheduleNextEvent();
      if (audioElement) {
        await audioElement.play();
      }
    }
    async function seek(where) {
      if (waitingForAudio) {
        return false;
      }
      const isPlaying = !!eventTimeoutId;
      pause();
      if (audioElement) {
        audioElement.pause();
      }
      const currentTime = (pauseElapsedTime ?? 0) / 1e3;
      if (typeof where === "string") {
        if (where === "<<") {
          where = currentTime - 5;
        } else if (where === ">>") {
          where = currentTime + 5;
        } else if (where === "<<<") {
          where = currentTime - 0.1 * duration;
        } else if (where === ">>>") {
          where = currentTime + 0.1 * duration;
        } else if (where[where.length - 1] === "%") {
          where = parseFloat(where.substring(0, where.length - 1)) / 100 * duration;
        }
      } else if (typeof where === "object") {
        if (where.marker === "prev") {
          where = findMarkerTimeBefore(currentTime) ?? 0;
          if (isPlaying && currentTime - where < 1) {
            where = findMarkerTimeBefore(where) ?? 0;
          }
        } else if (where.marker === "next") {
          where = findMarkerTimeAfter(currentTime) ?? duration;
        } else if (typeof where.marker === "number") {
          const marker = markers[where.marker];
          if (marker === void 0) {
            throw new Error(`invalid marker index: ${where.marker}`);
          } else {
            where = marker[0];
          }
        }
      }
      const targetTime = Math.min(Math.max(where, 0), duration);
      if (targetTime * 1e3 === pauseElapsedTime) return false;
      if (targetTime < lastEventTime) {
        feed("\x1Bc");
        resizeTerminalToInitialSize();
        nextEventIndex = 0;
        lastEventTime = 0;
      }
      let event = events[nextEventIndex];
      while (event && event[0] <= targetTime) {
        if (event[1] === "o" || event[1] === "r") {
          executeEvent2(event);
        }
        lastEventTime = event[0];
        event = events[++nextEventIndex];
      }
      pauseElapsedTime = targetTime * 1e3;
      effectiveStartAt = null;
      if (audioElement && audioSeekable) {
        audioElement.currentTime = targetTime / speed;
      }
      if (isPlaying) {
        await resume();
      } else if (events[nextEventIndex] === void 0) {
        onEnd();
      }
      return true;
    }
    function findMarkerTimeBefore(time) {
      if (markers.length == 0) return;
      let i = 0;
      let marker = markers[i];
      let lastMarkerTimeBefore;
      while (marker && marker[0] < time) {
        lastMarkerTimeBefore = marker[0];
        marker = markers[++i];
      }
      return lastMarkerTimeBefore;
    }
    function findMarkerTimeAfter(time) {
      if (markers.length == 0) return;
      let i = markers.length - 1;
      let marker = markers[i];
      let firstMarkerTimeAfter;
      while (marker && marker[0] > time) {
        firstMarkerTimeAfter = marker[0];
        marker = markers[--i];
      }
      return firstMarkerTimeAfter;
    }
    function step(n) {
      if (n === void 0) {
        n = 1;
      }
      let nextEvent;
      let targetIndex;
      if (n > 0) {
        let index = nextEventIndex;
        nextEvent = events[index];
        for (let i = 0; i < n; i++) {
          while (nextEvent !== void 0 && nextEvent[1] !== "o") {
            nextEvent = events[++index];
          }
          if (nextEvent !== void 0 && nextEvent[1] === "o") {
            targetIndex = index;
          }
        }
      } else {
        let index = Math.max(nextEventIndex - 2, 0);
        nextEvent = events[index];
        for (let i = n; i < 0; i++) {
          while (nextEvent !== void 0 && nextEvent[1] !== "o") {
            nextEvent = events[--index];
          }
          if (nextEvent !== void 0 && nextEvent[1] === "o") {
            targetIndex = index;
          }
        }
        if (targetIndex !== void 0) {
          feed("\x1Bc");
          resizeTerminalToInitialSize();
          nextEventIndex = 0;
        }
      }
      if (targetIndex === void 0) return;
      while (nextEventIndex <= targetIndex) {
        nextEvent = events[nextEventIndex++];
        if (nextEvent[1] === "o" || nextEvent[1] === "r") {
          executeEvent2(nextEvent);
        }
      }
      lastEventTime = nextEvent[0];
      pauseElapsedTime = lastEventTime * 1e3;
      effectiveStartAt = null;
      if (audioElement && audioSeekable) {
        audioElement.currentTime = lastEventTime / speed;
      }
      if (events[targetIndex + 1] === void 0) {
        onEnd();
      }
    }
    async function restart() {
      if (eventTimeoutId) throw new Error("still playing");
      if (events[nextEventIndex] !== void 0) throw new Error("not ended");
      seek(0);
      await resume();
      return true;
    }
    function getPoster(time) {
      return events.filter((e) => e[0] < time && e[1] === "o").map((e) => e[2]);
    }
    function getCurrentTime() {
      if (eventTimeoutId) {
        return (now() - startTime) / 1e3;
      } else {
        return (pauseElapsedTime ?? 0) / 1e3;
      }
    }
    function resizeTerminalToInitialSize() {
      resize(initialCols, initialRows);
    }
    function setupAudioCtx() {
      audioCtx = new AudioContext({
        latencyHint: "interactive"
      });
      const src2 = audioCtx.createMediaElementSource(audioElement);
      src2.connect(audioCtx.destination);
      now = audioNow;
    }
    function audioNow() {
      if (!audioCtx) throw new Error("audio context not started - can't tell time!");
      const {
        contextTime,
        performanceTime
      } = audioCtx.getOutputTimestamp();
      return performanceTime === 0 ? contextTime * 1e3 : contextTime * 1e3 + (performance.now() - performanceTime);
    }
    function onAudioWaiting() {
      logger.debug("audio buffering");
      waitingForAudio = true;
      shouldResumeOnAudioPlaying = !!eventTimeoutId;
      waitingTimeout = setTimeout(() => setState("loading"), 1e3);
      if (!eventTimeoutId) return true;
      logger.debug("pausing session playback");
      cancelNextEvent();
      pauseElapsedTime = now() - startTime;
    }
    function onAudioPlaying() {
      logger.debug("audio resumed");
      clearTimeout(waitingTimeout);
      setState("playing");
      if (!waitingForAudio) return;
      waitingForAudio = false;
      if (shouldResumeOnAudioPlaying) {
        logger.debug("resuming session playback");
        startTime = now() - pauseElapsedTime;
        pauseElapsedTime = null;
        scheduleNextEvent();
      }
    }
    function mute() {
      if (audioElement) {
        audioElement.muted = true;
        return true;
      }
    }
    function unmute() {
      if (audioElement) {
        audioElement.muted = false;
        return true;
      }
    }
    return {
      init: init2,
      play,
      pause,
      seek,
      step,
      restart,
      stop: pause,
      mute,
      unmute,
      getCurrentTime
    };
  }
  function batcher(logger) {
    let minFrameTime = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1 / 60;
    let prevEvent;
    return (emit) => {
      let ic = 0;
      let oc = 0;
      return {
        step: (event) => {
          ic++;
          if (prevEvent === void 0) {
            prevEvent = event;
            return;
          }
          if (event[1] === "o" && prevEvent[1] === "o" && event[0] - prevEvent[0] < minFrameTime) {
            prevEvent[2] += event[2];
          } else {
            emit(prevEvent);
            prevEvent = event;
            oc++;
          }
        },
        flush: () => {
          if (prevEvent !== void 0) {
            emit(prevEvent);
            oc++;
          }
          logger.debug(`batched ${ic} frames to ${oc} frames`);
        }
      };
    };
  }
  function prepare(recording2, logger, _ref4) {
    let {
      startAt = 0,
      idleTimeLimit,
      minFrameTime,
      inputOffset,
      markers_
    } = _ref4;
    let {
      events
    } = recording2;
    if (!(events instanceof Stream)) {
      events = new Stream(events);
    }
    idleTimeLimit = idleTimeLimit ?? recording2.idleTimeLimit ?? Infinity;
    const limiterOutput = {
      offset: 0
    };
    events = events.transform(batcher(logger, minFrameTime)).map(timeLimiter(idleTimeLimit, startAt, limiterOutput)).map(markerWrapper());
    if (markers_ !== void 0) {
      markers_ = new Stream(markers_).map(normalizeMarker);
      events = events.filter((e) => e[1] !== "m").multiplex(markers_, (a, b) => a[0] < b[0]).map(markerWrapper());
    }
    events = events.toArray();
    if (inputOffset !== void 0) {
      events = events.map((e) => e[1] === "i" ? [e[0] + inputOffset, e[1], e[2]] : e);
      events.sort((a, b) => a[0] - b[0]);
    }
    const duration = events[events.length - 1][0];
    const effectiveStartAt = startAt - limiterOutput.offset;
    return {
      ...recording2,
      events,
      duration,
      effectiveStartAt
    };
  }
  function normalizeMarker(m) {
    return typeof m === "number" ? [m, "m", ""] : [m[0], "m", m[1]];
  }
  function timeLimiter(idleTimeLimit, startAt, output) {
    let prevT = 0;
    let shift = 0;
    return function(e) {
      const delay = e[0] - prevT;
      const delta = delay - idleTimeLimit;
      prevT = e[0];
      if (delta > 0) {
        shift += delta;
        if (e[0] < startAt) {
          output.offset += delta;
        }
      }
      return [e[0] - shift, e[1], e[2]];
    };
  }
  function markerWrapper() {
    let i = 0;
    return function(e) {
      if (e[1] === "m") {
        return [e[0], e[1], {
          index: i++,
          time: e[0],
          label: e[2]
        }];
      } else {
        return e;
      }
    };
  }
  function dump(recording2, filename) {
    const link = document.createElement("a");
    const events = recording2.events.map((e) => e[1] === "m" ? [e[0], e[1], e[2].label] : e);
    const asciicast = unparseAsciicastV2({
      ...recording2,
      events
    });
    link.href = URL.createObjectURL(new Blob([asciicast], {
      type: "text/plain"
    }));
    link.download = filename;
    link.click();
  }
  async function createAudioElement(src) {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.loop = false;
    audio.crossOrigin = "anonymous";
    let resolve;
    const canPlay = new Promise((resolve_) => {
      resolve = resolve_;
    });
    function onCanPlay() {
      resolve();
      audio.removeEventListener("canplay", onCanPlay);
    }
    audio.addEventListener("canplay", onCanPlay);
    audio.src = src;
    audio.load();
    await canPlay;
    return audio;
  }
  function clock(_ref, _ref2, _ref3) {
    let {
      hourColor = 3,
      minuteColor = 4,
      separatorColor = 9
    } = _ref;
    let {
      feed
    } = _ref2;
    let {
      cols = 5,
      rows = 1
    } = _ref3;
    const middleRow = Math.floor(rows / 2);
    const leftPad = Math.floor(cols / 2) - 2;
    const setupCursor = `\x1B[?25l\x1B[1m\x1B[${middleRow}B`;
    let intervalId;
    const getCurrentTime = () => {
      const d = /* @__PURE__ */ new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const seqs = [];
      seqs.push("\r");
      for (let i = 0; i < leftPad; i++) {
        seqs.push(" ");
      }
      seqs.push(`\x1B[3${hourColor}m`);
      if (h < 10) {
        seqs.push("0");
      }
      seqs.push(`${h}`);
      seqs.push(`\x1B[3${separatorColor};5m:\x1B[25m`);
      seqs.push(`\x1B[3${minuteColor}m`);
      if (m < 10) {
        seqs.push("0");
      }
      seqs.push(`${m}`);
      return seqs;
    };
    const updateTime = () => {
      getCurrentTime().forEach(feed);
    };
    return {
      init: () => {
        const duration = 24 * 60;
        const poster = [setupCursor].concat(getCurrentTime());
        return {
          cols,
          rows,
          duration,
          poster
        };
      },
      play: () => {
        feed(setupCursor);
        updateTime();
        intervalId = setInterval(updateTime, 1e3);
        return true;
      },
      stop: () => {
        clearInterval(intervalId);
      },
      getCurrentTime: () => {
        const d = /* @__PURE__ */ new Date();
        return d.getHours() * 60 + d.getMinutes();
      }
    };
  }
  function random(src, _ref, _ref2) {
    let {
      feed
    } = _ref;
    let {
      speed
    } = _ref2;
    const base = " ".charCodeAt(0);
    const range = "~".charCodeAt(0) - base;
    let timeoutId;
    const schedule = () => {
      const t = Math.pow(5, Math.random() * 4);
      timeoutId = setTimeout(print, t / speed);
    };
    const print = () => {
      schedule();
      const char = String.fromCharCode(base + Math.floor(Math.random() * range));
      feed(char);
    };
    return () => {
      schedule();
      return () => clearInterval(timeoutId);
    };
  }
  function benchmark(_ref, _ref2) {
    let {
      url,
      iterations = 10
    } = _ref;
    let {
      feed,
      setState
    } = _ref2;
    let data;
    let byteCount = 0;
    return {
      async init() {
        const recording2 = await parse$2(await fetch(url));
        const {
          cols,
          rows,
          events
        } = recording2;
        data = Array.from(events).filter((_ref3) => {
          let [_time, type, _text] = _ref3;
          return type === "o";
        }).map((_ref4) => {
          let [time, _type, text] = _ref4;
          return [time, text];
        });
        const duration = data[data.length - 1][0];
        for (const [_, text] of data) {
          byteCount += new Blob([text]).size;
        }
        return {
          cols,
          rows,
          duration
        };
      },
      play() {
        const startTime = performance.now();
        for (let i = 0; i < iterations; i++) {
          for (const [_, text] of data) {
            feed(text);
          }
          feed("\x1Bc");
        }
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1e3;
        const throughput = byteCount * iterations / duration;
        const throughputMbs = byteCount / (1024 * 1024) * iterations / duration;
        console.info("benchmark: result", {
          byteCount,
          iterations,
          duration,
          throughput,
          throughputMbs
        });
        setTimeout(() => {
          setState("stopped", {
            reason: "ended"
          });
        }, 0);
        return true;
      }
    };
  }
  var Queue = class {
    constructor() {
      this.items = [];
      this.onPush = void 0;
    }
    push(item) {
      this.items.push(item);
      if (this.onPush !== void 0) {
        this.onPush(this.popAll());
        this.onPush = void 0;
      }
    }
    popAll() {
      if (this.items.length > 0) {
        const items = this.items;
        this.items = [];
        return items;
      } else {
        const thiz = this;
        return new Promise((resolve) => {
          thiz.onPush = resolve;
        });
      }
    }
  };
  function getBuffer(bufferTime, feed, resize, onInput, onMarker, setTime, baseStreamTime, minFrameTime, logger) {
    const execute = executeEvent(feed, resize, onInput, onMarker);
    if (bufferTime === 0) {
      logger.debug("using no buffer");
      return nullBuffer(execute);
    } else {
      bufferTime = bufferTime ?? {};
      let getBufferTime;
      if (typeof bufferTime === "number") {
        logger.debug(`using fixed time buffer (${bufferTime} ms)`);
        getBufferTime = (_latency) => bufferTime;
      } else if (typeof bufferTime === "function") {
        logger.debug("using custom dynamic buffer");
        getBufferTime = bufferTime({
          logger
        });
      } else {
        logger.debug("using adaptive buffer", bufferTime);
        getBufferTime = adaptiveBufferTimeProvider({
          logger
        }, bufferTime);
      }
      return buffer(getBufferTime, execute, setTime, logger, baseStreamTime ?? 0, minFrameTime);
    }
  }
  function nullBuffer(execute) {
    return {
      pushEvent(event) {
        execute(event[1], event[2]);
      },
      pushText(text) {
        execute("o", text);
      },
      stop() {
      }
    };
  }
  function executeEvent(feed, resize, onInput, onMarker) {
    return function(code, data) {
      if (code === "o") {
        feed(data);
      } else if (code === "i") {
        onInput(data);
      } else if (code === "r") {
        resize(data.cols, data.rows);
      } else if (code === "m") {
        onMarker(data);
      }
    };
  }
  function buffer(getBufferTime, execute, setTime, logger, baseStreamTime) {
    let minFrameTime = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 1 / 60;
    let epoch = performance.now() - baseStreamTime * 1e3;
    let bufferTime = getBufferTime(0);
    const queue = new Queue();
    minFrameTime *= 1e3;
    let prevElapsedStreamTime = -minFrameTime;
    let stop = false;
    function elapsedWallTime() {
      return performance.now() - epoch;
    }
    setTimeout(async () => {
      while (!stop) {
        const events = await queue.popAll();
        if (stop) return;
        for (const event of events) {
          const elapsedStreamTime = event[0] * 1e3 + bufferTime;
          if (elapsedStreamTime - prevElapsedStreamTime < minFrameTime) {
            execute(event[1], event[2]);
            continue;
          }
          const delay = elapsedStreamTime - elapsedWallTime();
          if (delay > 0) {
            await sleep(delay);
            if (stop) return;
          }
          setTime(event[0]);
          execute(event[1], event[2]);
          prevElapsedStreamTime = elapsedStreamTime;
        }
      }
    }, 0);
    return {
      pushEvent(event) {
        let latency = elapsedWallTime() - event[0] * 1e3;
        if (latency < 0) {
          logger.debug(`correcting epoch by ${latency} ms`);
          epoch += latency;
          latency = 0;
        }
        bufferTime = getBufferTime(latency);
        queue.push(event);
      },
      pushText(text) {
        queue.push([elapsedWallTime() / 1e3, "o", text]);
      },
      stop() {
        stop = true;
        queue.push(void 0);
      }
    };
  }
  function sleep(t) {
    return new Promise((resolve) => {
      setTimeout(resolve, t);
    });
  }
  function adaptiveBufferTimeProvider() {
    let {
      logger
    } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let {
      minBufferTime = 50,
      bufferLevelStep = 100,
      maxBufferLevel = 50,
      transitionDuration = 500,
      peakHalfLifeUp = 100,
      peakHalfLifeDown = 1e4,
      floorHalfLifeUp = 5e3,
      floorHalfLifeDown = 100,
      idealHalfLifeUp = 1e3,
      idealHalfLifeDown = 5e3,
      safetyMultiplier = 1.2,
      minImprovementDuration = 3e3
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    function levelToMs(level) {
      return level === 0 ? minBufferTime : bufferLevelStep * level;
    }
    let bufferLevel = 1;
    let bufferTime = levelToMs(bufferLevel);
    let lastUpdateTime = performance.now();
    let smoothedPeakLatency = null;
    let smoothedFloorLatency = null;
    let smoothedIdealBufferTime = null;
    let stableSince = null;
    let targetBufferTime = null;
    let transitionRate = null;
    return function(latency) {
      const now = performance.now();
      const dt = Math.max(0, now - lastUpdateTime);
      lastUpdateTime = now;
      if (smoothedPeakLatency === null) {
        smoothedPeakLatency = latency;
      } else if (latency > smoothedPeakLatency) {
        const alphaUp = 1 - Math.pow(2, -dt / peakHalfLifeUp);
        smoothedPeakLatency += alphaUp * (latency - smoothedPeakLatency);
      } else {
        const alphaDown = 1 - Math.pow(2, -dt / peakHalfLifeDown);
        smoothedPeakLatency += alphaDown * (latency - smoothedPeakLatency);
      }
      smoothedPeakLatency = Math.max(smoothedPeakLatency, 0);
      if (smoothedFloorLatency === null) {
        smoothedFloorLatency = latency;
      } else if (latency > smoothedFloorLatency) {
        const alphaUp = 1 - Math.pow(2, -dt / floorHalfLifeUp);
        smoothedFloorLatency += alphaUp * (latency - smoothedFloorLatency);
      } else {
        const alphaDown = 1 - Math.pow(2, -dt / floorHalfLifeDown);
        smoothedFloorLatency += alphaDown * (latency - smoothedFloorLatency);
      }
      smoothedFloorLatency = Math.max(smoothedFloorLatency, 0);
      const jitter = smoothedPeakLatency - smoothedFloorLatency;
      const idealBufferTime = safetyMultiplier * (smoothedPeakLatency + jitter);
      if (smoothedIdealBufferTime === null) {
        smoothedIdealBufferTime = idealBufferTime;
      } else if (idealBufferTime > smoothedIdealBufferTime) {
        const alphaUp = 1 - Math.pow(2, -dt / idealHalfLifeUp);
        smoothedIdealBufferTime += +alphaUp * (idealBufferTime - smoothedIdealBufferTime);
      } else {
        const alphaDown = 1 - Math.pow(2, -dt / idealHalfLifeDown);
        smoothedIdealBufferTime += +alphaDown * (idealBufferTime - smoothedIdealBufferTime);
      }
      let newBufferLevel;
      if (smoothedIdealBufferTime <= minBufferTime) {
        newBufferLevel = 0;
      } else {
        newBufferLevel = clamp2(Math.ceil(smoothedIdealBufferTime / bufferLevelStep), 1, maxBufferLevel);
      }
      if (latency > bufferTime) {
        logger.debug("buffer underrun", {
          latency,
          bufferTime
        });
      }
      if (newBufferLevel > bufferLevel) {
        if (latency > bufferTime) {
          bufferLevel = Math.min(newBufferLevel, bufferLevel + 3);
        } else {
          bufferLevel += 1;
        }
        targetBufferTime = levelToMs(bufferLevel);
        transitionRate = (targetBufferTime - bufferTime) / transitionDuration;
        stableSince = null;
        logger.debug("raising buffer", {
          latency,
          bufferTime,
          targetBufferTime
        });
      } else if (newBufferLevel < bufferLevel) {
        if (stableSince == null) stableSince = now;
        if (now - stableSince >= minImprovementDuration) {
          bufferLevel -= 1;
          targetBufferTime = levelToMs(bufferLevel);
          transitionRate = (targetBufferTime - bufferTime) / transitionDuration;
          stableSince = now;
          logger.debug("lowering buffer", {
            latency,
            bufferTime,
            targetBufferTime
          });
        }
      } else {
        stableSince = null;
      }
      if (targetBufferTime !== null) {
        bufferTime += transitionRate * dt;
        if (transitionRate >= 0 && bufferTime > targetBufferTime || transitionRate < 0 && bufferTime < targetBufferTime) {
          bufferTime = targetBufferTime;
          targetBufferTime = null;
        }
      }
      return bufferTime;
    };
  }
  function clamp2(x, lo, hi) {
    return Math.min(hi, Math.max(lo, x));
  }
  var ONE_SEC_IN_USEC = 1e6;
  function alisHandler(logger) {
    const outputDecoder = new TextDecoder();
    const inputDecoder = new TextDecoder();
    let handler = parseMagicString;
    let lastEventTime;
    let markerIndex = 0;
    function parseMagicString(buffer2) {
      const text = new TextDecoder().decode(buffer2);
      if (text === "ALiS") {
        handler = parseFirstFrame;
      } else {
        throw new Error("not an ALiS v1 live stream");
      }
    }
    function parseFirstFrame(buffer2) {
      const view = new BinaryReader(new DataView(buffer2));
      const type = view.getUint8();
      if (type !== 1) throw new Error(`expected reset (0x01) frame, got ${type}`);
      return parseResetFrame(view, buffer2);
    }
    function parseResetFrame(view, buffer2) {
      view.decodeVarUint();
      let time = view.decodeVarUint();
      lastEventTime = time;
      time = time / ONE_SEC_IN_USEC;
      markerIndex = 0;
      const cols = view.decodeVarUint();
      const rows = view.decodeVarUint();
      const themeFormat = view.getUint8();
      let theme;
      if (themeFormat === 8) {
        const len = (2 + 8) * 3;
        theme = parseTheme(new Uint8Array(buffer2, view.offset, len));
        view.forward(len);
      } else if (themeFormat === 16) {
        const len = (2 + 16) * 3;
        theme = parseTheme(new Uint8Array(buffer2, view.offset, len));
        view.forward(len);
      } else if (themeFormat !== 0) {
        throw new Error(`alis: invalid theme format (${themeFormat})`);
      }
      const initLen = view.decodeVarUint();
      let init2;
      if (initLen > 0) {
        init2 = outputDecoder.decode(new Uint8Array(buffer2, view.offset, initLen));
      }
      handler = parseFrame2;
      return {
        time,
        term: {
          size: {
            cols,
            rows
          },
          theme,
          init: init2
        }
      };
    }
    function parseFrame2(buffer2) {
      const view = new BinaryReader(new DataView(buffer2));
      const type = view.getUint8();
      if (type === 1) {
        return parseResetFrame(view, buffer2);
      } else if (type === 111) {
        return parseOutputFrame(view, buffer2);
      } else if (type === 105) {
        return parseInputFrame(view, buffer2);
      } else if (type === 114) {
        return parseResizeFrame(view);
      } else if (type === 109) {
        return parseMarkerFrame(view, buffer2);
      } else if (type === 120) {
        return parseExitFrame(view);
      } else if (type === 4) {
        handler = parseFirstFrame;
        return false;
      } else {
        logger.debug(`alis: unknown frame type: ${type}`);
      }
    }
    function parseOutputFrame(view, buffer2) {
      view.decodeVarUint();
      const relTime = view.decodeVarUint();
      lastEventTime += relTime;
      const len = view.decodeVarUint();
      const text = outputDecoder.decode(new Uint8Array(buffer2, view.offset, len));
      return [lastEventTime / ONE_SEC_IN_USEC, "o", text];
    }
    function parseInputFrame(view, buffer2) {
      view.decodeVarUint();
      const relTime = view.decodeVarUint();
      lastEventTime += relTime;
      const len = view.decodeVarUint();
      const text = inputDecoder.decode(new Uint8Array(buffer2, view.offset, len));
      return [lastEventTime / ONE_SEC_IN_USEC, "i", text];
    }
    function parseResizeFrame(view) {
      view.decodeVarUint();
      const relTime = view.decodeVarUint();
      lastEventTime += relTime;
      const cols = view.decodeVarUint();
      const rows = view.decodeVarUint();
      return [lastEventTime / ONE_SEC_IN_USEC, "r", {
        cols,
        rows
      }];
    }
    function parseMarkerFrame(view, buffer2) {
      view.decodeVarUint();
      const relTime = view.decodeVarUint();
      lastEventTime += relTime;
      const len = view.decodeVarUint();
      const decoder = new TextDecoder();
      const index = markerIndex++;
      const time = lastEventTime / ONE_SEC_IN_USEC;
      const label = decoder.decode(new Uint8Array(buffer2, view.offset, len));
      return [time, "m", {
        index,
        time,
        label
      }];
    }
    function parseExitFrame(view) {
      view.decodeVarUint();
      const relTime = view.decodeVarUint();
      lastEventTime += relTime;
      const status = view.decodeVarUint();
      return [lastEventTime / ONE_SEC_IN_USEC, "x", {
        status
      }];
    }
    return function(buffer2) {
      return handler(buffer2);
    };
  }
  function parseTheme(arr) {
    const colorCount = arr.length / 3;
    const foreground = hexColor(arr[0], arr[1], arr[2]);
    const background = hexColor(arr[3], arr[4], arr[5]);
    const palette = [];
    for (let i = 2; i < colorCount; i++) {
      palette.push(hexColor(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]));
    }
    return normalizeTheme({
      foreground,
      background,
      palette
    });
  }
  function hexColor(r, g, b) {
    return `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
  }
  function byteToHex(value) {
    return value.toString(16).padStart(2, "0");
  }
  var BinaryReader = class {
    constructor(inner) {
      let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      this.inner = inner;
      this.offset = offset;
    }
    forward(delta) {
      this.offset += delta;
    }
    getUint8() {
      const value = this.inner.getUint8(this.offset);
      this.offset += 1;
      return value;
    }
    decodeVarUint() {
      let number = BigInt(0);
      let shift = BigInt(0);
      let byte = this.getUint8();
      while (byte > 127) {
        byte &= 127;
        number += BigInt(byte) << shift;
        shift += BigInt(7);
        byte = this.getUint8();
      }
      number = number + (BigInt(byte) << shift);
      return Number(number);
    }
  };
  function ascicastV2Handler() {
    let parse2 = parseHeader;
    function parseHeader(buffer2) {
      const header = JSON.parse(buffer2);
      if (header.version !== 2) {
        throw new Error("not an asciicast v2 stream");
      }
      parse2 = parseEvent;
      return {
        time: 0,
        term: {
          size: {
            cols: header.width,
            rows: header.height
          }
        }
      };
    }
    function parseEvent(buffer2) {
      const event = JSON.parse(buffer2);
      if (event[1] === "r") {
        const [cols, rows] = event[2].split("x");
        return [event[0], "r", {
          cols: parseInt(cols, 10),
          rows: parseInt(rows, 10)
        }];
      } else {
        return event;
      }
    }
    return function(buffer2) {
      return parse2(buffer2);
    };
  }
  function ascicastV3Handler() {
    let parse2 = parseHeader;
    let currentTime = 0;
    function parseHeader(buffer2) {
      const header = JSON.parse(buffer2);
      if (header.version !== 3) {
        throw new Error("not an asciicast v3 stream");
      }
      parse2 = parseEvent;
      const term = {
        size: {
          cols: header.term.cols,
          rows: header.term.rows
        }
      };
      if (header.term.theme) {
        const palette = typeof header.term.theme.palette === "string" ? header.term.theme.palette.split(":") : void 0;
        const theme = normalizeTheme({
          foreground: header.term.theme.fg,
          background: header.term.theme.bg,
          palette
        });
        if (theme) {
          term.theme = theme;
        }
      }
      return {
        time: 0,
        term
      };
    }
    function parseEvent(buffer2) {
      const event = JSON.parse(buffer2);
      const [interval, eventType, data] = event;
      currentTime += interval;
      if (eventType === "r") {
        const [cols, rows] = data.split("x");
        return [currentTime, "r", {
          cols: parseInt(cols, 10),
          rows: parseInt(rows, 10)
        }];
      } else {
        return [currentTime, eventType, data];
      }
    }
    return function(buffer2) {
      return parse2(buffer2);
    };
  }
  function rawHandler() {
    const outputDecoder = new TextDecoder();
    let parse2 = parseSize;
    function parseSize(buffer2) {
      const text = outputDecoder.decode(buffer2, {
        stream: true
      });
      const [cols, rows] = sizeFromResizeSeq(text) ?? sizeFromScriptStartMessage(text) ?? [80, 24];
      parse2 = parseOutput;
      return {
        time: 0,
        term: {
          size: {
            cols,
            rows
          },
          init: text
        }
      };
    }
    function parseOutput(buffer2) {
      return outputDecoder.decode(buffer2, {
        stream: true
      });
    }
    return function(buffer2) {
      return parse2(buffer2);
    };
  }
  function sizeFromResizeSeq(text) {
    const match = text.match(/\x1b\[8;(\d+);(\d+)t/);
    if (match !== null) {
      return [parseInt(match[2], 10), parseInt(match[1], 10)];
    }
  }
  function sizeFromScriptStartMessage(text) {
    const match = text.match(/\[.*COLUMNS="(\d{1,3})" LINES="(\d{1,3})".*\]/);
    if (match !== null) {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }
  }
  var RECONNECT_DELAY_BASE = 500;
  var RECONNECT_DELAY_CAP = 1e4;
  function exponentialDelay(attempt) {
    const base = Math.min(RECONNECT_DELAY_BASE * Math.pow(2, attempt), RECONNECT_DELAY_CAP);
    return Math.random() * base;
  }
  function websocket(_ref, _ref2, _ref3) {
    let {
      url,
      bufferTime,
      reconnectDelay = exponentialDelay,
      minFrameTime
    } = _ref;
    let {
      feed,
      reset,
      resize,
      onInput,
      onMarker,
      setState,
      logger
    } = _ref2;
    let {
      audioUrl
    } = _ref3;
    logger = new PrefixedLogger(logger, "websocket: ");
    let socket;
    let buf;
    let clock2 = new NullClock();
    let reconnectAttempt = 0;
    let successfulConnectionTimeout;
    let stop = false;
    let wasOnline = false;
    let gotExitEvent = false;
    let gotEotEvent = false;
    let initTimeout;
    let audioElement;
    function connect() {
      socket = new WebSocket(url, ["v1.alis", "v2.asciicast", "v3.asciicast", "raw"]);
      socket.binaryType = "arraybuffer";
      let proto;
      socket.onopen = () => {
        proto = socket.protocol || "raw";
        logger.info("opened");
        logger.info(`activating ${proto} protocol handler`);
        if (proto === "v1.alis") {
          socket.onmessage = onMessage(alisHandler(logger));
        } else if (proto === "v2.asciicast") {
          socket.onmessage = onMessage(ascicastV2Handler());
        } else if (proto === "v3.asciicast") {
          socket.onmessage = onMessage(ascicastV3Handler());
        } else if (proto === "raw") {
          socket.onmessage = onMessage(rawHandler());
        }
        successfulConnectionTimeout = setTimeout(() => {
          reconnectAttempt = 0;
        }, 1e3);
      };
      socket.onclose = (event) => {
        clearTimeout(initTimeout);
        stopBuffer();
        if (stop) return;
        let ended = false;
        let endedMessage = "Stream ended";
        if (proto === "v1.alis") {
          if (gotEotEvent || event.code >= 4e3 && event.code <= 4100) {
            ended = true;
            endedMessage = event.reason || endedMessage;
          }
        } else if (gotExitEvent || event.code === 1e3 || event.code === 1005) {
          ended = true;
        }
        if (ended) {
          logger.info("closed");
          setState("ended", {
            message: endedMessage
          });
        } else if (event.code === 1002) {
          logger.debug(`close reason: ${event.reason}`);
          setState("ended", {
            message: "Err: Player not compatible with the server"
          });
        } else {
          clearTimeout(successfulConnectionTimeout);
          const delay = reconnectDelay(reconnectAttempt++);
          logger.info(`unexpected close, reconnecting in ${delay}...`);
          setState("loading");
          setTimeout(connect, delay);
        }
      };
      wasOnline = false;
    }
    function onMessage(handler) {
      initTimeout = setTimeout(onStreamEnd, 5e3);
      return function(event) {
        try {
          const result = handler(event.data);
          if (buf) {
            if (Array.isArray(result)) {
              buf.pushEvent(result);
              if (result[1] === "x") {
                gotExitEvent = true;
              }
            } else if (typeof result === "string") {
              buf.pushText(result);
            } else if (typeof result === "object" && !Array.isArray(result)) {
              onStreamReset(result);
            } else if (result === false) {
              onStreamEnd();
              gotEotEvent = true;
            } else if (result !== void 0) {
              throw new Error(`unexpected value from protocol handler: ${result}`);
            }
          } else {
            if (typeof result === "object" && !Array.isArray(result)) {
              onStreamReset(result);
              clearTimeout(initTimeout);
            } else if (result === void 0) {
              clearTimeout(initTimeout);
              initTimeout = setTimeout(onStreamEnd, 1e3);
            } else {
              clearTimeout(initTimeout);
              throw new Error(`unexpected value from protocol handler: ${result}`);
            }
          }
        } catch (e) {
          socket.close();
          throw e;
        }
      };
    }
    function onStreamReset(_ref4) {
      let {
        time,
        term
      } = _ref4;
      const {
        size,
        init: init2,
        theme
      } = term;
      const {
        cols,
        rows
      } = size;
      logger.info(`stream reset (${cols}x${rows} @${time})`);
      setState("playing");
      stopBuffer();
      buf = getBuffer(bufferTime, feed, resize, onInput, onMarker, (t) => clock2.setTime(t), time, minFrameTime, logger);
      reset(cols, rows, init2, theme);
      clock2 = new Clock();
      wasOnline = true;
      gotExitEvent = false;
      gotEotEvent = false;
      if (typeof time === "number") {
        clock2.setTime(time);
      }
    }
    function onStreamEnd() {
      stopBuffer();
      if (wasOnline) {
        logger.info("stream ended");
        setState("offline", {
          message: "Stream ended"
        });
      } else {
        logger.info("stream offline");
        setState("offline", {
          message: "Stream offline"
        });
      }
      clock2 = new NullClock();
    }
    function stopBuffer() {
      if (buf) buf.stop();
      buf = null;
    }
    function startAudio() {
      if (!audioUrl) return;
      audioElement = new Audio();
      audioElement.preload = "auto";
      audioElement.crossOrigin = "anonymous";
      audioElement.src = audioUrl;
      audioElement.play();
    }
    function stopAudio() {
      if (!audioElement) return;
      audioElement.pause();
    }
    function mute() {
      if (audioElement) {
        audioElement.muted = true;
        return true;
      }
    }
    function unmute() {
      if (audioElement) {
        audioElement.muted = false;
        return true;
      }
    }
    return {
      init: () => {
        return {
          hasAudio: !!audioUrl
        };
      },
      play: () => {
        connect();
        startAudio();
      },
      stop: () => {
        stop = true;
        stopBuffer();
        if (socket !== void 0) socket.close();
        stopAudio();
      },
      mute,
      unmute,
      getCurrentTime: () => clock2.getTime()
    };
  }
  function eventsource(_ref, _ref2) {
    let {
      url,
      bufferTime,
      minFrameTime
    } = _ref;
    let {
      feed,
      reset,
      resize,
      onInput,
      onMarker,
      setState,
      logger
    } = _ref2;
    logger = new PrefixedLogger(logger, "eventsource: ");
    let es;
    let buf;
    let clock2 = new NullClock();
    function initBuffer(baseStreamTime) {
      if (buf !== void 0) buf.stop();
      buf = getBuffer(bufferTime, feed, resize, onInput, onMarker, (t) => clock2.setTime(t), baseStreamTime, minFrameTime, logger);
    }
    return {
      play: () => {
        es = new EventSource(url);
        es.addEventListener("open", () => {
          logger.info("opened");
          initBuffer();
        });
        es.addEventListener("error", (e) => {
          logger.info("errored");
          logger.debug({
            e
          });
          setState("loading");
        });
        es.addEventListener("message", (event) => {
          const e = JSON.parse(event.data);
          if (Array.isArray(e)) {
            buf.pushEvent(e);
          } else if (e.cols !== void 0 || e.width !== void 0) {
            const cols = e.cols ?? e.width;
            const rows = e.rows ?? e.height;
            logger.debug(`vt reset (${cols}x${rows})`);
            setState("playing");
            initBuffer(e.time);
            reset(cols, rows, e.init ?? void 0);
            clock2 = new Clock();
            if (typeof e.time === "number") {
              clock2.setTime(e.time);
            }
          } else if (e.state === "offline") {
            logger.info("stream offline");
            setState("offline", {
              message: "Stream offline"
            });
            clock2 = new NullClock();
          }
        });
        es.addEventListener("done", () => {
          logger.info("closed");
          es.close();
          setState("ended", {
            message: "Stream ended"
          });
        });
      },
      stop: () => {
        if (buf !== void 0) buf.stop();
        if (es !== void 0) es.close();
      },
      getCurrentTime: () => clock2.getTime()
    };
  }
  async function parse$1(responses, _ref) {
    let {
      encoding
    } = _ref;
    const textDecoder = new TextDecoder(encoding);
    let cols;
    let rows;
    let timing = (await responses[0].text()).split("\n").filter((line) => line.length > 0).map((line) => line.split(" "));
    if (timing[0].length < 3) {
      timing = timing.map((entry) => ["O", entry[0], entry[1]]);
    }
    const buffer2 = await responses[1].arrayBuffer();
    const array = new Uint8Array(buffer2);
    const dataOffset = array.findIndex((byte) => byte == 10) + 1;
    const header = textDecoder.decode(array.subarray(0, dataOffset));
    const sizeMatch = header.match(/COLUMNS="(\d+)" LINES="(\d+)"/);
    if (sizeMatch !== null) {
      cols = parseInt(sizeMatch[1], 10);
      rows = parseInt(sizeMatch[2], 10);
    }
    const stdout = {
      array,
      cursor: dataOffset
    };
    let stdin = stdout;
    if (responses[2] !== void 0) {
      const buffer3 = await responses[2].arrayBuffer();
      const array2 = new Uint8Array(buffer3);
      stdin = {
        array: array2,
        cursor: dataOffset
      };
    }
    const events = [];
    let time = 0;
    for (const entry of timing) {
      time += parseFloat(entry[1]);
      if (entry[0] === "O") {
        const count = parseInt(entry[2], 10);
        const bytes = stdout.array.subarray(stdout.cursor, stdout.cursor + count);
        const text = textDecoder.decode(bytes);
        events.push([time, "o", text]);
        stdout.cursor += count;
      } else if (entry[0] === "I") {
        const count = parseInt(entry[2], 10);
        const bytes = stdin.array.subarray(stdin.cursor, stdin.cursor + count);
        const text = textDecoder.decode(bytes);
        events.push([time, "i", text]);
        stdin.cursor += count;
      } else if (entry[0] === "S" && entry[2] === "SIGWINCH") {
        const cols2 = parseInt(entry[4].slice(5), 10);
        const rows2 = parseInt(entry[3].slice(5), 10);
        events.push([time, "r", `${cols2}x${rows2}`]);
      } else if (entry[0] === "H" && entry[2] === "COLUMNS") {
        cols = parseInt(entry[3], 10);
      } else if (entry[0] === "H" && entry[2] === "LINES") {
        rows = parseInt(entry[3], 10);
      }
    }
    cols = cols ?? 80;
    rows = rows ?? 24;
    return {
      cols,
      rows,
      events
    };
  }
  async function parse(response, _ref) {
    let {
      encoding
    } = _ref;
    const textDecoder = new TextDecoder(encoding);
    const buffer2 = await response.arrayBuffer();
    const array = new Uint8Array(buffer2);
    const firstFrame = parseFrame(array);
    const baseTime = firstFrame.time;
    const firstFrameText = textDecoder.decode(firstFrame.data);
    const sizeMatch = firstFrameText.match(/\x1b\[8;(\d+);(\d+)t/);
    const events = [];
    let cols = 80;
    let rows = 24;
    if (sizeMatch !== null) {
      cols = parseInt(sizeMatch[2], 10);
      rows = parseInt(sizeMatch[1], 10);
    }
    let cursor = 0;
    let frame = parseFrame(array);
    while (frame !== void 0) {
      const time = frame.time - baseTime;
      const text = textDecoder.decode(frame.data);
      events.push([time, "o", text]);
      cursor += frame.len;
      frame = parseFrame(array.subarray(cursor));
    }
    return {
      cols,
      rows,
      events
    };
  }
  function parseFrame(array) {
    if (array.length < 13) return;
    const time = parseTimestamp(array.subarray(0, 8));
    const len = parseNumber(array.subarray(8, 12));
    const data = array.subarray(12, 12 + len);
    return {
      time,
      data,
      len: len + 12
    };
  }
  function parseNumber(array) {
    return array[0] + array[1] * 256 + array[2] * 256 * 256 + array[3] * 256 * 256 * 256;
  }
  function parseTimestamp(array) {
    const sec = parseNumber(array.subarray(0, 4));
    const usec = parseNumber(array.subarray(4, 8));
    return sec + usec / 1e6;
  }
  var DEFAULT_COLS = 80;
  var DEFAULT_ROWS = 24;
  var vt = init({
    module: vtWasmModule
  });
  var State = class {
    constructor(core) {
      this.core = core;
      this.driver = core.driver;
    }
    onEnter(data) {
    }
    init() {
    }
    play() {
    }
    pause() {
    }
    togglePlay() {
    }
    mute() {
      if (this.driver && this.driver.mute()) {
        this.core._dispatchEvent("muted", true);
      }
    }
    unmute() {
      if (this.driver && this.driver.unmute()) {
        this.core._dispatchEvent("muted", false);
      }
    }
    seek(where) {
      return false;
    }
    step(n) {
    }
    stop() {
      this.driver.stop();
    }
  };
  var UninitializedState = class extends State {
    async init() {
      try {
        await this.core._initializeDriver();
        return this.core._setState("idle");
      } catch (e) {
        this.core._setState("errored");
        throw e;
      }
    }
    async play() {
      this.core._dispatchEvent("play");
      const idleState = await this.init();
      await idleState.doPlay();
    }
    async togglePlay() {
      await this.play();
    }
    async seek(where) {
      const idleState = await this.init();
      return await idleState.seek(where);
    }
    async step(n) {
      const idleState = await this.init();
      await idleState.step(n);
    }
    stop() {
    }
  };
  var Idle = class extends State {
    onEnter(_ref) {
      let {
        reason,
        message
      } = _ref;
      this.core._dispatchEvent("idle", {
        message
      });
      if (reason === "paused") {
        this.core._dispatchEvent("pause");
      }
    }
    async play() {
      this.core._dispatchEvent("play");
      await this.doPlay();
    }
    async doPlay() {
      const stop = await this.driver.play();
      if (stop === true) {
        this.core._setState("playing");
      } else if (typeof stop === "function") {
        this.core._setState("playing");
        this.driver.stop = stop;
      }
    }
    async togglePlay() {
      await this.play();
    }
    seek(where) {
      return this.driver.seek(where);
    }
    step(n) {
      this.driver.step(n);
    }
  };
  var PlayingState = class extends State {
    onEnter() {
      this.core._dispatchEvent("playing");
    }
    pause() {
      if (this.driver.pause() === true) {
        this.core._setState("idle", {
          reason: "paused"
        });
      }
    }
    togglePlay() {
      this.pause();
    }
    seek(where) {
      return this.driver.seek(where);
    }
  };
  var LoadingState = class extends State {
    onEnter() {
      this.core._dispatchEvent("loading");
    }
  };
  var OfflineState = class extends State {
    onEnter(_ref2) {
      let {
        message
      } = _ref2;
      this.core._dispatchEvent("offline", {
        message
      });
    }
  };
  var EndedState = class extends State {
    onEnter(_ref3) {
      let {
        message
      } = _ref3;
      this.core._dispatchEvent("ended", {
        message
      });
    }
    async play() {
      this.core._dispatchEvent("play");
      if (await this.driver.restart()) {
        this.core._setState("playing");
      }
    }
    async togglePlay() {
      await this.play();
    }
    async seek(where) {
      if (await this.driver.seek(where) === true) {
        this.core._setState("idle");
        return true;
      }
      return false;
    }
  };
  var ErroredState = class extends State {
    onEnter() {
      this.core._dispatchEvent("errored");
    }
  };
  var Core = class {
    constructor(src, opts) {
      this.logger = opts.logger;
      this.state = new UninitializedState(this);
      this.stateName = "uninitialized";
      this.driver = getDriver(src);
      this.changedLines = /* @__PURE__ */ new Set();
      this.duration = void 0;
      this.cols = opts.cols;
      this.rows = opts.rows;
      this.speed = opts.speed;
      this.loop = opts.loop;
      this.autoPlay = opts.autoPlay;
      this.idleTimeLimit = opts.idleTimeLimit;
      this.preload = opts.preload;
      this.startAt = parseNpt(opts.startAt);
      this.poster = this._parsePoster(opts.poster);
      this.markers = this._normalizeMarkers(opts.markers);
      this.pauseOnMarkers = opts.pauseOnMarkers;
      this.audioUrl = opts.audioUrl;
      this.boldIsBright = opts.boldIsBright ?? false;
      this.commandQueue = Promise.resolve();
      this.needsClear = false;
      this.eventHandlers = /* @__PURE__ */ new Map([["ended", []], ["errored", []], ["idle", []], ["input", []], ["loading", []], ["marker", []], ["metadata", []], ["muted", []], ["offline", []], ["pause", []], ["play", []], ["playing", []], ["ready", []], ["seeked", []], ["vtUpdate", []]]);
    }
    async init() {
      this.wasm = await vt;
      const {
        memory
      } = await this.wasm.default();
      this.memory = memory;
      this._initializeVt(this.cols ?? DEFAULT_COLS, this.rows ?? DEFAULT_ROWS);
      const feed = this._feed.bind(this);
      const onInput = (data) => {
        this._dispatchEvent("input", {
          data
        });
      };
      const onMarker = (_ref4) => {
        let {
          index,
          time,
          label
        } = _ref4;
        this._dispatchEvent("marker", {
          index,
          time,
          label
        });
      };
      const reset = this._resetVt.bind(this);
      const resize = this._resizeVt.bind(this);
      const setState = this._setState.bind(this);
      const posterTime = this.poster.type === "npt" && !this.autoPlay ? this.poster.value : void 0;
      this.driver = this.driver({
        feed,
        onInput,
        onMarker,
        reset,
        resize,
        setState,
        logger: this.logger
      }, {
        cols: this.cols,
        rows: this.rows,
        speed: this.speed,
        idleTimeLimit: this.idleTimeLimit,
        startAt: this.startAt,
        loop: this.loop,
        posterTime,
        markers: this.markers,
        pauseOnMarkers: this.pauseOnMarkers,
        audioUrl: this.audioUrl
      });
      if (typeof this.driver === "function") {
        this.driver = {
          play: this.driver
        };
      }
      if (this.preload || posterTime !== void 0) {
        this._withState((state) => state.init());
      }
      const config = {
        isPausable: !!this.driver.pause,
        isSeekable: !!this.driver.seek
      };
      if (this.driver.init === void 0) {
        this.driver.init = () => {
          return {};
        };
      }
      if (this.driver.pause === void 0) {
        this.driver.pause = () => {
        };
      }
      if (this.driver.seek === void 0) {
        this.driver.seek = (where) => false;
      }
      if (this.driver.step === void 0) {
        this.driver.step = (n) => {
        };
      }
      if (this.driver.stop === void 0) {
        this.driver.stop = () => {
        };
      }
      if (this.driver.restart === void 0) {
        this.driver.restart = () => {
        };
      }
      if (this.driver.mute === void 0) {
        this.driver.mute = () => {
        };
      }
      if (this.driver.unmute === void 0) {
        this.driver.unmute = () => {
        };
      }
      if (this.driver.getCurrentTime === void 0) {
        const play = this.driver.play;
        let clock2 = new NullClock();
        this.driver.play = () => {
          clock2 = new Clock(this.speed);
          return play();
        };
        this.driver.getCurrentTime = () => clock2.getTime();
      }
      this._dispatchEvent("ready", config);
      if (this.autoPlay) {
        this.play();
      } else if (this.poster.type === "text") {
        this._feed(this.poster.value);
        this.needsClear = true;
      }
    }
    play() {
      this._clearIfNeeded();
      return this._withState((state) => state.play());
    }
    pause() {
      return this._withState((state) => state.pause());
    }
    togglePlay() {
      this._clearIfNeeded();
      return this._withState((state) => state.togglePlay());
    }
    seek(where) {
      this._clearIfNeeded();
      return this._withState(async (state) => {
        if (await state.seek(where)) {
          this._dispatchEvent("seeked");
        }
      });
    }
    step(n) {
      this._clearIfNeeded();
      return this._withState((state) => state.step(n));
    }
    stop() {
      return this._withState((state) => state.stop());
    }
    mute() {
      return this._withState((state) => state.mute());
    }
    unmute() {
      return this._withState((state) => state.unmute());
    }
    getLine(n, cursorOn) {
      return this.vt.getLine(n, cursorOn);
    }
    getDataView(_ref5, size) {
      let [ptr, len] = _ref5;
      return new DataView(this.memory.buffer, ptr, len * size);
    }
    getUint32Array(_ref6) {
      let [ptr, len] = _ref6;
      return new Uint32Array(this.memory.buffer, ptr, len);
    }
    getCursor() {
      const cursor = this.vt.getCursor();
      if (cursor) {
        return {
          col: cursor[0],
          row: cursor[1],
          visible: true
        };
      }
      return {
        col: 0,
        row: 0,
        visible: false
      };
    }
    getCurrentTime() {
      return this.driver.getCurrentTime();
    }
    getRemainingTime() {
      if (typeof this.duration === "number") {
        return this.duration - Math.min(this.getCurrentTime(), this.duration);
      }
    }
    getProgress() {
      if (typeof this.duration === "number") {
        return Math.min(this.getCurrentTime(), this.duration) / this.duration;
      }
    }
    getDuration() {
      return this.duration;
    }
    addEventListener(eventName, handler) {
      this.eventHandlers.get(eventName).push(handler);
    }
    removeEventListener(eventName, handler) {
      const handlers = this.eventHandlers.get(eventName);
      if (!handlers) return;
      const idx = handlers.indexOf(handler);
      if (idx !== -1) handlers.splice(idx, 1);
    }
    _dispatchEvent(eventName) {
      let data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      for (const h of this.eventHandlers.get(eventName)) {
        h(data);
      }
    }
    _withState(f) {
      return this._enqueueCommand(() => f(this.state));
    }
    _enqueueCommand(f) {
      this.commandQueue = this.commandQueue.then(f);
      return this.commandQueue;
    }
    _setState(newState) {
      let data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (this.stateName === newState) return this.state;
      this.stateName = newState;
      if (newState === "playing") {
        this.state = new PlayingState(this);
      } else if (newState === "idle") {
        this.state = new Idle(this);
      } else if (newState === "loading") {
        this.state = new LoadingState(this);
      } else if (newState === "ended") {
        this.state = new EndedState(this);
      } else if (newState === "offline") {
        this.state = new OfflineState(this);
      } else if (newState === "errored") {
        this.state = new ErroredState(this);
      } else {
        throw new Error(`invalid state: ${newState}`);
      }
      this.state.onEnter(data);
      return this.state;
    }
    _feed(data) {
      const changedRows = this.vt.feed(data);
      this._dispatchEvent("vtUpdate", {
        changedRows
      });
    }
    async _initializeDriver() {
      const meta = await this.driver.init();
      this.cols = this.cols ?? meta.cols ?? DEFAULT_COLS;
      this.rows = this.rows ?? meta.rows ?? DEFAULT_ROWS;
      this.duration = this.duration ?? meta.duration;
      this.markers = this._normalizeMarkers(meta.markers) ?? this.markers ?? [];
      if (this.cols === 0) {
        this.cols = DEFAULT_COLS;
      }
      if (this.rows === 0) {
        this.rows = DEFAULT_ROWS;
      }
      this._initializeVt(this.cols, this.rows);
      if (meta.poster !== void 0) {
        meta.poster.forEach((text) => this.vt.feed(text));
        this.needsClear = true;
      } else if (this.poster.type === "text") {
        this.vt.feed(this.poster.value);
        this.needsClear = true;
      }
      this._dispatchEvent("metadata", {
        size: {
          cols: this.cols,
          rows: this.rows
        },
        theme: meta.theme ?? null,
        duration: this.duration,
        markers: this.markers,
        hasAudio: meta.hasAudio
      });
      this._dispatchEvent("vtUpdate", {
        size: {
          cols: this.cols,
          rows: this.rows
        },
        theme: meta.theme ?? null,
        changedRows: Array.from({
          length: this.rows
        }, (_, i) => i)
      });
    }
    _clearIfNeeded() {
      if (this.needsClear) {
        this._feed("\x1Bc");
        this.needsClear = false;
      }
    }
    _resetVt(cols, rows) {
      let init2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
      let theme = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : void 0;
      this.logger.debug(`core: vt reset (${cols}x${rows})`);
      this.cols = cols;
      this.rows = rows;
      this._initializeVt(cols, rows);
      if (init2 !== void 0 && init2 !== "") {
        this.vt.feed(init2);
      }
      this._dispatchEvent("metadata", {
        size: {
          cols,
          rows
        },
        theme: theme ?? null
      });
      this._dispatchEvent("vtUpdate", {
        size: {
          cols,
          rows
        },
        theme: theme ?? null,
        changedRows: Array.from({
          length: rows
        }, (_, i) => i)
      });
    }
    _resizeVt(cols, rows) {
      if (cols === this.vt.cols && rows === this.vt.rows) return;
      const changedRows = this.vt.resize(cols, rows);
      this.vt.cols = cols;
      this.vt.rows = rows;
      this.logger.debug(`core: vt resize (${cols}x${rows})`);
      this._dispatchEvent("metadata", {
        size: {
          cols,
          rows
        }
      });
      this._dispatchEvent("vtUpdate", {
        size: {
          cols,
          rows
        },
        changedRows
      });
    }
    _initializeVt(cols, rows) {
      this.logger.debug("vt init", {
        cols,
        rows
      });
      this.vt = this.wasm.create(cols, rows, 100, this.boldIsBright);
      this.vt.cols = cols;
      this.vt.rows = rows;
    }
    _parsePoster(poster) {
      if (typeof poster !== "string") return {};
      if (poster.substring(0, 16) == "data:text/plain,") {
        return {
          type: "text",
          value: poster.substring(16)
        };
      } else if (poster.substring(0, 4) == "npt:") {
        return {
          type: "npt",
          value: parseNpt(poster.substring(4))
        };
      }
      return {};
    }
    _normalizeMarkers(markers) {
      if (Array.isArray(markers)) {
        return markers.map((m) => typeof m === "number" ? [m, ""] : m);
      }
    }
  };
  var DRIVERS = /* @__PURE__ */ new Map([["benchmark", benchmark], ["clock", clock], ["eventsource", eventsource], ["random", random], ["recording", recording], ["websocket", websocket]]);
  var PARSERS = /* @__PURE__ */ new Map([["asciicast", parse$2], ["typescript", parse$1], ["ttyrec", parse]]);
  function getDriver(src) {
    if (typeof src === "function") return src;
    if (typeof src === "string") {
      if (src.substring(0, 5) == "ws://" || src.substring(0, 6) == "wss://") {
        src = {
          driver: "websocket",
          url: src
        };
      } else if (src.substring(0, 6) == "clock:") {
        src = {
          driver: "clock"
        };
      } else if (src.substring(0, 7) == "random:") {
        src = {
          driver: "random"
        };
      } else if (src.substring(0, 10) == "benchmark:") {
        src = {
          driver: "benchmark",
          url: src.substring(10)
        };
      } else {
        src = {
          driver: "recording",
          url: src
        };
      }
    }
    if (src.driver === void 0) {
      src.driver = "recording";
    }
    if (src.driver == "recording") {
      if (src.parser === void 0) {
        src.parser = "asciicast";
      }
      if (typeof src.parser === "string") {
        if (PARSERS.has(src.parser)) {
          src.parser = PARSERS.get(src.parser);
        } else {
          throw new Error(`unknown parser: ${src.parser}`);
        }
      }
    }
    if (DRIVERS.has(src.driver)) {
      const driver = DRIVERS.get(src.driver);
      return (callbacks, opts) => driver(src, callbacks, opts);
    } else {
      throw new Error(`unsupported driver: ${JSON.stringify(src)}`);
    }
  }

  // node_modules/asciinema-player/dist/opts-BtLxsM_6.js
  var IS_DEV = false;
  var equalFn = (a, b) => a === b;
  var $PROXY = Symbol("solid-proxy");
  var $TRACK = Symbol("solid-track");
  var signalOptions = {
    equals: equalFn
  };
  var runEffects = runQueue;
  var STALE = 1;
  var PENDING = 2;
  var UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  var Transition$1 = null;
  var ExternalSourceConfig = null;
  var Listener = null;
  var Updates = null;
  var Effects = null;
  var ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: current ? current.context : null,
      owner: current
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        value2 = value2(s.value);
      }
      return writeSignal(s, value2);
    };
    return [readSignal.bind(s), setter];
  }
  function createComputed(fn, value, options) {
    const c = createComputation(fn, value, true, STALE);
    updateComputation(c);
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, false, STALE);
    updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE);
    c.user = true;
    Effects ? Effects.push(c) : updateComputation(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || void 0;
    updateComputation(c);
    return readSignal.bind(c);
  }
  function batch(fn) {
    return runUpdates(fn, false);
  }
  function untrack(fn) {
    if (Listener === null) return fn();
    const listener = Listener;
    Listener = null;
    try {
      if (ExternalSourceConfig) ;
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null) ;
    else if (Owner.cleanups === null) Owner.cleanups = [fn];
    else Owner.cleanups.push(fn);
    return fn;
  }
  function getListener() {
    return Listener;
  }
  function startTransition(fn) {
    const l = Listener;
    const o = Owner;
    return Promise.resolve().then(() => {
      Listener = l;
      Owner = o;
      let t;
      runUpdates(fn, false);
      Listener = Owner = null;
      return t ? t.done : void 0;
    });
  }
  var [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
  function useTransition() {
    return [transPending, startTransition];
  }
  function children(fn) {
    const children2 = createMemo(fn);
    const memo = createMemo(() => resolveChildren(children2()));
    memo.toArray = () => {
      const c = memo();
      return Array.isArray(c) ? c : c != null ? [c] : [];
    };
    return memo;
  }
  function readSignal() {
    if (this.sources && this.state) {
      if (this.state === STALE) updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0; i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition$1 && Transition$1.running;
            if (TransitionRunning && Transition$1.disposed.has(o)) ;
            if (TransitionRunning ? !o.tState : !o.state) {
              if (o.pure) Updates.push(o);
              else Effects.push(o);
              if (o.observers) markDownstream(o);
            }
            if (!TransitionRunning) o.state = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (IS_DEV) ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn) return;
    cleanNode(node);
    const time = ExecCount;
    runComputation(
      node,
      node.value,
      time
    );
  }
  function runComputation(node, value, time) {
    let nextValue;
    const owner = Owner, listener = Listener;
    Listener = Owner = node;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      node.updatedAt = time + 1;
      return handleError(err);
    } finally {
      Listener = listener;
      Owner = owner;
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue);
      } else node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init2, pure, state = STALE, options) {
    const c = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init2,
      owner: Owner,
      context: Owner ? Owner.context : null,
      pure
    };
    if (Owner === null) ;
    else if (Owner !== UNOWNED) {
      {
        if (!Owner.owned) Owner.owned = [c];
        else Owner.owned.push(c);
      }
    }
    return c;
  }
  function runTop(node) {
    if (node.state === 0) return;
    if (node.state === PENDING) return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (node.state) ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (node.state === STALE) {
        updateComputation(node);
      } else if (node.state === PENDING) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init2) {
    if (Updates) return fn();
    let wait = false;
    if (!init2) Updates = [];
    if (Effects) wait = true;
    else Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!wait) Effects = null;
      Updates = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait) return;
    const e = Effects;
    Effects = null;
    if (e.length) runUpdates(() => runEffects(e), false);
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++) runTop(queue[i]);
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user) runTop(e);
      else queue[userLength++] = e;
    }
    for (i = 0; i < userLength; i++) runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        const state = source.state;
        if (state === STALE) {
          if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
            runTop(source);
        } else if (state === PENDING) lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (!o.state) {
        o.state = PENDING;
        if (o.pure) Updates.push(o);
        else Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (node.tOwned) {
      for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
      delete node.tOwned;
    }
    if (node.owned) {
      for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
      node.cleanups = null;
    }
    node.state = 0;
  }
  function castError(err) {
    if (err instanceof Error) return err;
    return new Error(typeof err === "string" ? err : "Unknown error", {
      cause: err
    });
  }
  function handleError(err, owner = Owner) {
    const error = castError(err);
    throw error;
  }
  function resolveChildren(children2) {
    if (typeof children2 === "function" && !children2.length) return resolveChildren(children2());
    if (Array.isArray(children2)) {
      const results = [];
      for (let i = 0; i < children2.length; i++) {
        const result = resolveChildren(children2[i]);
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
      }
      return results;
    }
    return children2;
  }
  var FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++) d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [], newLen = newItems.length, i, j;
      newItems[$TRACK];
      return untrack(() => {
        let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = /* @__PURE__ */ new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === void 0 ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== void 0 && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  function createComponent(Comp, props) {
    return untrack(() => Comp(props || {}));
  }
  var narrowedError = (name) => `Stale read from <${name}>.`;
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
  }
  function Show(props) {
    const keyed = props.keyed;
    const conditionValue = createMemo(() => props.when, void 0, void 0);
    const condition = keyed ? conditionValue : createMemo(conditionValue, void 0, {
      equals: (a, b) => !a === !b
    });
    return createMemo(
      () => {
        const c = condition();
        if (c) {
          const child = props.children;
          const fn = typeof child === "function" && child.length > 0;
          return fn ? untrack(
            () => child(
              keyed ? c : () => {
                if (!untrack(condition)) throw narrowedError("Show");
                return conditionValue();
              }
            )
          ) : child;
        }
        return props.fallback;
      },
      void 0,
      void 0
    );
  }
  function Switch(props) {
    const chs = children(() => props.children);
    const switchFunc = createMemo(() => {
      const ch = chs();
      const mps = Array.isArray(ch) ? ch : [ch];
      let func = () => void 0;
      for (let i = 0; i < mps.length; i++) {
        const index = i;
        const mp = mps[i];
        const prevFunc = func;
        const conditionValue = createMemo(
          () => prevFunc() ? void 0 : mp.when,
          void 0,
          void 0
        );
        const condition = mp.keyed ? conditionValue : createMemo(conditionValue, void 0, {
          equals: (a, b) => !a === !b
        });
        func = () => prevFunc() || (condition() ? [index, conditionValue, mp] : void 0);
      }
      return func;
    });
    return createMemo(
      () => {
        const sel = switchFunc()();
        if (!sel) return props.fallback;
        const [index, conditionValue, mp] = sel;
        const child = mp.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn ? untrack(
          () => child(
            mp.keyed ? conditionValue() : () => {
              if (untrack(switchFunc)()?.[0] !== index) throw narrowedError("Match");
              return conditionValue();
            }
          )
        ) : child;
      },
      void 0,
      void 0
    );
  }
  function Match(props) {
    return props;
  }
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart])) a[aStart].remove();
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart, sequence = 1, t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence) break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index) parentNode.insertBefore(b[bStart++], node);
            } else parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else aStart++;
        } else a[aStart++].remove();
      }
    }
  }
  var $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init2, options = {}) {
    let disposer;
    createRoot((dispose2) => {
      disposer = dispose2;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init2);
    }, options.owner);
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, isImportNode, isSVG, isMathML) {
    let node;
    const create3 = () => {
      const t = document.createElement("template");
      t.innerHTML = html;
      return t.content.firstChild;
    };
    const fn = isImportNode ? () => untrack(() => document.importNode(node || (node = create3()), true)) : () => (node || (node = create3())).cloneNode(true);
    fn.cloneNode = fn;
    return fn;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function setAttribute(node, name, value) {
    if (value == null) node.removeAttribute(name);
    else node.setAttribute(name, value);
  }
  function className(node, value) {
    if (value == null) node.removeAttribute("class");
    else node.className = value;
  }
  function addEventListener(node, name, handler, delegate) {
    {
      if (Array.isArray(handler)) {
        node[`$$${name}`] = handler[0];
        node[`$$${name}Data`] = handler[1];
      } else node[`$$${name}`] = handler;
    }
  }
  function style(node, value, prev) {
    if (!value) return prev ? setAttribute(node, "style") : value;
    const nodeStyle = node.style;
    if (typeof value === "string") return nodeStyle.cssText = value;
    typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
    prev || (prev = {});
    value || (value = {});
    let v, s;
    for (s in prev) {
      value[s] == null && nodeStyle.removeProperty(s);
      delete prev[s];
    }
    for (s in value) {
      v = value[s];
      if (v !== prev[s]) {
        nodeStyle.setProperty(s, v);
        prev[s] = v;
      }
    }
    return prev;
  }
  function use(fn, element, arg) {
    return untrack(() => fn(element, arg));
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function eventHandler(e) {
    let node = e.target;
    const key = `$$${e.type}`;
    const oriTarget = e.target;
    const oriCurrentTarget = e.currentTarget;
    const retarget = (value) => Object.defineProperty(e, "target", {
      configurable: true,
      value
    });
    const handleNode = () => {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble) return;
      }
      node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
      return true;
    };
    const walkUpTree = () => {
      while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
    };
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (e.composedPath) {
      const path = e.composedPath();
      retarget(path[0]);
      for (let i = 0; i < path.length - 2; i++) {
        node = path[i];
        if (!handleNode()) break;
        if (node._$host) {
          node = node._$host;
          walkUpTree();
          break;
        }
        if (node.parentNode === oriCurrentTarget) {
          break;
        }
      }
    } else walkUpTree();
    retarget(oriTarget);
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (t === "number") {
        value = value.toString();
        if (value === current) return current;
      }
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data !== value && (node.data = value);
        } else node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function") v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi) return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value.nodeType) {
      if (Array.isArray(current)) {
        if (multi) return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else parent.replaceChild(value, parent.firstChild);
      current = value;
    } else ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap2) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[normalized.length], t;
      if (item == null || item === true || item === false) ;
      else if ((t = typeof item) === "object" && item.nodeType) {
        normalized.push(item);
      } else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (t === "function") {
        if (unwrap2) {
          while (typeof item === "function") item = item();
          dynamic = normalizeIncomingArray(
            normalized,
            Array.isArray(item) ? item : [item],
            Array.isArray(prev) ? prev : [prev]
          ) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
        else normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0) return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i)
            isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else isParent && el.remove();
        } else inserted = true;
      }
    } else parent.insertBefore(node, marker);
    return [node];
  }
  var $RAW = Symbol("store-raw");
  var $NODE = Symbol("store-node");
  var $HAS = Symbol("store-has");
  var $SELF = Symbol("store-self");
  function wrap$1(value) {
    let p = value[$PROXY];
    if (!p) {
      Object.defineProperty(value, $PROXY, {
        value: p = new Proxy(value, proxyTraps$1)
      });
      if (!Array.isArray(value)) {
        const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
        for (let i = 0, l = keys.length; i < l; i++) {
          const prop = keys[i];
          if (desc[prop].get) {
            Object.defineProperty(value, prop, {
              enumerable: desc[prop].enumerable,
              get: desc[prop].get.bind(p)
            });
          }
        }
      }
    }
    return p;
  }
  function isWrappable(obj) {
    let proto;
    return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = /* @__PURE__ */ new Set()) {
    let result, unwrapped, v, prop;
    if (result = item != null && item[$RAW]) return result;
    if (!isWrappable(item) || set.has(item)) return item;
    if (Array.isArray(item)) {
      if (Object.isFrozen(item)) item = item.slice(0);
      else set.add(item);
      for (let i = 0, l = item.length; i < l; i++) {
        v = item[i];
        if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
      }
    } else {
      if (Object.isFrozen(item)) item = Object.assign({}, item);
      else set.add(item);
      const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
      for (let i = 0, l = keys.length; i < l; i++) {
        prop = keys[i];
        if (desc[prop].get) continue;
        v = item[prop];
        if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
      }
    }
    return item;
  }
  function getNodes(target, symbol) {
    let nodes = target[symbol];
    if (!nodes)
      Object.defineProperty(target, symbol, {
        value: nodes = /* @__PURE__ */ Object.create(null)
      });
    return nodes;
  }
  function getNode(nodes, property, value) {
    if (nodes[property]) return nodes[property];
    const [s, set] = createSignal(value, {
      equals: false,
      internal: true
    });
    s.$ = set;
    return nodes[property] = s;
  }
  function proxyDescriptor$1(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE)
      return desc;
    delete desc.value;
    delete desc.writable;
    desc.get = () => target[$PROXY][property];
    return desc;
  }
  function trackSelf(target) {
    getListener() && getNode(getNodes(target, $NODE), $SELF)();
  }
  function ownKeys(target) {
    trackSelf(target);
    return Reflect.ownKeys(target);
  }
  var proxyTraps$1 = {
    get(target, property, receiver) {
      if (property === $RAW) return target;
      if (property === $PROXY) return receiver;
      if (property === $TRACK) {
        trackSelf(target);
        return receiver;
      }
      const nodes = getNodes(target, $NODE);
      const tracked = nodes[property];
      let value = tracked ? tracked() : target[property];
      if (property === $NODE || property === $HAS || property === "__proto__") return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get))
          value = getNode(nodes, property, value)();
      }
      return isWrappable(value) ? wrap$1(value) : value;
    },
    has(target, property) {
      if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__")
        return true;
      getListener() && getNode(getNodes(target, $HAS), property)();
      return property in target;
    },
    set() {
      return true;
    },
    deleteProperty() {
      return true;
    },
    ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor$1
  };
  function setProperty(state, property, value, deleting = false) {
    if (!deleting && state[property] === value) return;
    const prev = state[property], len = state.length;
    if (value === void 0) {
      delete state[property];
      if (state[$HAS] && state[$HAS][property] && prev !== void 0) state[$HAS][property].$();
    } else {
      state[property] = value;
      if (state[$HAS] && state[$HAS][property] && prev === void 0) state[$HAS][property].$();
    }
    let nodes = getNodes(state, $NODE), node;
    if (node = getNode(nodes, property, prev)) node.$(() => value);
    if (Array.isArray(state) && state.length !== len) {
      for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
      (node = getNode(nodes, "length", len)) && node.$(state.length);
    }
    (node = nodes[$SELF]) && node.$();
  }
  function mergeStoreNode(state, value) {
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      setProperty(state, key, value[key]);
    }
  }
  function updateArray(current, next) {
    if (typeof next === "function") next = next(current);
    next = unwrap(next);
    if (Array.isArray(next)) {
      if (current === next) return;
      let i = 0, len = next.length;
      for (; i < len; i++) {
        const value = next[i];
        if (current[i] !== value) setProperty(current, i, value);
      }
      setProperty(current, "length", len);
    } else mergeStoreNode(current, next);
  }
  function updatePath(current, path, traversed = []) {
    let part, prev = current;
    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part, isArray = Array.isArray(current);
      if (Array.isArray(part)) {
        for (let i = 0; i < part.length; i++) {
          updatePath(current, [part[i]].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === "function") {
        for (let i = 0; i < current.length; i++) {
          if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === "object") {
        const { from = 0, to = current.length - 1, by = 1 } = part;
        for (let i = from; i <= to; i += by) {
          updatePath(current, [i].concat(path), traversed);
        }
        return;
      } else if (path.length > 1) {
        updatePath(current[part], path, [part].concat(traversed));
        return;
      }
      prev = current[part];
      traversed = [part].concat(traversed);
    }
    let value = path[0];
    if (typeof value === "function") {
      value = value(prev, traversed);
      if (value === prev) return;
    }
    if (part === void 0 && value == void 0) return;
    value = unwrap(value);
    if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
      mergeStoreNode(prev, value);
    } else setProperty(current, part, value);
  }
  function createStore(...[store, options]) {
    const unwrappedStore = unwrap(store || {});
    const isArray = Array.isArray(unwrappedStore);
    const wrappedStore = wrap$1(unwrappedStore);
    function setStore(...args) {
      batch(() => {
        isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
      });
    }
    return [wrappedStore, setStore];
  }
  var noop = () => {
  };
  var noopTransition = (el, done) => done();
  function createSwitchTransition(source, options) {
    const initSource = untrack(source);
    const initReturned = initSource ? [initSource] : [];
    const { onEnter = noopTransition, onExit = noopTransition } = options;
    const [returned, setReturned] = createSignal(options.appear ? [] : initReturned);
    const [isTransitionPending] = useTransition();
    let next;
    let isExiting = false;
    function exitTransition2(el, after) {
      if (!el)
        return after && after();
      isExiting = true;
      onExit(el, () => {
        batch(() => {
          isExiting = false;
          setReturned((p) => p.filter((e) => e !== el));
          after && after();
        });
      });
    }
    function enterTransition2(after) {
      const el = next;
      if (!el)
        return after && after();
      next = void 0;
      setReturned((p) => [el, ...p]);
      onEnter(el, after ?? noop);
    }
    const triggerTransitions = options.mode === "out-in" ? (
      // exit -> enter
      // exit -> enter
      (prev) => isExiting || exitTransition2(prev, enterTransition2)
    ) : options.mode === "in-out" ? (
      // enter -> exit
      // enter -> exit
      (prev) => enterTransition2(() => exitTransition2(prev))
    ) : (
      // exit & enter
      // exit & enter
      (prev) => {
        exitTransition2(prev);
        enterTransition2();
      }
    );
    createComputed((prev) => {
      const el = source();
      if (untrack(isTransitionPending)) {
        isTransitionPending();
        return prev;
      }
      if (el !== prev) {
        next = el;
        batch(() => untrack(() => triggerTransitions(prev)));
      }
      return el;
    }, options.appear ? void 0 : initSource);
    return returned;
  }
  var defaultElementPredicate = (item) => item instanceof Element;
  function getFirstChild(value, predicate) {
    if (predicate(value))
      return value;
    if (typeof value === "function" && !value.length)
      return getFirstChild(value(), predicate);
    if (Array.isArray(value)) {
      for (const item of value) {
        const result = getFirstChild(item, predicate);
        if (result)
          return result;
      }
    }
    return null;
  }
  function resolveFirst(fn, predicate = defaultElementPredicate, serverPredicate = defaultElementPredicate) {
    const children2 = createMemo(fn);
    return createMemo(() => getFirstChild(children2(), predicate));
  }
  function createClassnames(props) {
    return createMemo(() => {
      const name = props.name || "s";
      return {
        enterActive: (props.enterActiveClass || name + "-enter-active").split(" "),
        enter: (props.enterClass || name + "-enter").split(" "),
        enterTo: (props.enterToClass || name + "-enter-to").split(" "),
        exitActive: (props.exitActiveClass || name + "-exit-active").split(" "),
        exit: (props.exitClass || name + "-exit").split(" "),
        exitTo: (props.exitToClass || name + "-exit-to").split(" "),
        move: (props.moveClass || name + "-move").split(" ")
      };
    });
  }
  function nextFrame(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }
  function enterTransition(classes, events, el, done) {
    const { onBeforeEnter, onEnter, onAfterEnter } = events;
    onBeforeEnter?.(el);
    el.classList.add(...classes.enter);
    el.classList.add(...classes.enterActive);
    queueMicrotask(() => {
      if (!el.parentNode)
        return done?.();
      onEnter?.(el, () => endTransition());
    });
    nextFrame(() => {
      el.classList.remove(...classes.enter);
      el.classList.add(...classes.enterTo);
      if (!onEnter || onEnter.length < 2) {
        el.addEventListener("transitionend", endTransition);
        el.addEventListener("animationend", endTransition);
      }
    });
    function endTransition(e) {
      if (!e || e.target === el) {
        done?.();
        el.removeEventListener("transitionend", endTransition);
        el.removeEventListener("animationend", endTransition);
        el.classList.remove(...classes.enterActive);
        el.classList.remove(...classes.enterTo);
        onAfterEnter?.(el);
      }
    }
  }
  function exitTransition(classes, events, el, done) {
    const { onBeforeExit, onExit, onAfterExit } = events;
    if (!el.parentNode)
      return done?.();
    onBeforeExit?.(el);
    el.classList.add(...classes.exit);
    el.classList.add(...classes.exitActive);
    onExit?.(el, () => endTransition());
    nextFrame(() => {
      el.classList.remove(...classes.exit);
      el.classList.add(...classes.exitTo);
      if (!onExit || onExit.length < 2) {
        el.addEventListener("transitionend", endTransition);
        el.addEventListener("animationend", endTransition);
      }
    });
    function endTransition(e) {
      if (!e || e.target === el) {
        done?.();
        el.removeEventListener("transitionend", endTransition);
        el.removeEventListener("animationend", endTransition);
        el.classList.remove(...classes.exitActive);
        el.classList.remove(...classes.exitTo);
        onAfterExit?.(el);
      }
    }
  }
  var TRANSITION_MODE_MAP = {
    inout: "in-out",
    outin: "out-in"
  };
  var Transition = (props) => {
    const classnames = createClassnames(props);
    return createSwitchTransition(
      resolveFirst(() => props.children),
      {
        mode: TRANSITION_MODE_MAP[props.mode],
        appear: props.appear,
        onEnter(el, done) {
          enterTransition(classnames(), props, el, done);
        },
        onExit(el, done) {
          exitTransition(classnames(), props, el, done);
        }
      }
    );
  };
  var _tmpl$$e = /* @__PURE__ */ template(`<div class="ap-term"><canvas></canvas><svg class="ap-term-symbols" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true"><defs></defs><g></g></svg><pre class="ap-term-text" aria-live="off" tabindex="0"></pre></div>`, 12);
  var SVG_NS = "http://www.w3.org/2000/svg";
  var BLOCK_H_RES = 8;
  var BLOCK_V_RES = 24;
  var BOLD_MASK = 1;
  var FAINT_MASK = 1 << 1;
  var ITALIC_MASK = 1 << 2;
  var UNDERLINE_MASK = 1 << 3;
  var STRIKETHROUGH_MASK = 1 << 4;
  var BLINK_MASK = 1 << 5;
  var Terminal = ((props) => {
    const core = props.core;
    const textRowPool = [];
    const vectorSymbolRowPool = [];
    const vectorSymbolUsePool = [];
    const vectorSymbolDefCache = /* @__PURE__ */ new Set();
    const colorsCache = /* @__PURE__ */ new Map();
    const attrClassCache = /* @__PURE__ */ new Map();
    const [size, setSize] = createSignal({
      cols: props.cols,
      rows: props.rows
    }, {
      equals: (newVal, oldVal) => newVal.cols === oldVal.cols && newVal.rows === oldVal.rows
    });
    const [theme, setTheme] = createSignal(buildTheme(FALLBACK_THEME));
    const lineHeight = () => props.lineHeight ?? 1.3333333333;
    const [blinkOn, setBlinkOn] = createSignal(true);
    const cursorOn = createMemo(() => blinkOn() || cursorHold);
    const style$1 = createMemo(() => {
      return {
        width: `${size().cols}ch`,
        height: `${lineHeight() * size().rows}em`,
        "font-size": `${(props.scale || 1) * 100}%`,
        "--term-line-height": `${lineHeight()}em`,
        "--term-cols": size().cols,
        "--term-rows": size().rows
      };
    });
    let cursor = {
      col: 0,
      row: 0,
      visible: false
    };
    let pendingChanges = {
      size: void 0,
      theme: void 0,
      rows: /* @__PURE__ */ new Set()
    };
    let el;
    let canvasEl;
    let canvasCtx;
    let textEl;
    let vectorSymbolsEl;
    let vectorSymbolDefsEl;
    let vectorSymbolRowsEl;
    let frameRequestId;
    let blinkIntervalId;
    let cssTheme;
    let cursorHold = false;
    onMount(() => {
      setupCanvas();
      setInitialTheme();
      adjustTextRowNodeCount(size().rows);
      adjustSymbolRowNodeCount(size().rows);
      core.addEventListener("vtUpdate", onVtUpdate);
    });
    onCleanup(() => {
      core.removeEventListener("vtUpdate", onVtUpdate);
      clearInterval(blinkIntervalId);
      cancelAnimationFrame(frameRequestId);
    });
    createEffect(() => {
      if (props.blinking && blinkIntervalId === void 0) {
        blinkIntervalId = setInterval(toggleBlink, 600);
      } else {
        clearInterval(blinkIntervalId);
        blinkIntervalId = void 0;
        setBlinkOn(true);
      }
    });
    createEffect(() => {
      cursorOn();
      if (cursor.visible) {
        pendingChanges.rows.add(cursor.row);
        scheduleRender();
      }
    });
    function setupCanvas() {
      canvasCtx = canvasEl.getContext("2d");
      if (!canvasCtx) throw new Error("2D ctx not available");
      const {
        cols,
        rows
      } = size();
      canvasEl.width = cols * BLOCK_H_RES;
      canvasEl.height = rows * BLOCK_V_RES;
      canvasEl.style.imageRendering = "pixelated";
      canvasCtx.imageSmoothingEnabled = false;
    }
    function resizeCanvas(_ref) {
      let {
        cols,
        rows
      } = _ref;
      canvasEl.width = cols * BLOCK_H_RES;
      canvasEl.height = rows * BLOCK_V_RES;
      canvasCtx.imageSmoothingEnabled = false;
    }
    function setInitialTheme() {
      cssTheme = getCssTheme(el);
      pendingChanges.theme = cssTheme;
    }
    function onVtUpdate(_ref2) {
      let {
        size: newSize,
        theme: theme2,
        changedRows
      } = _ref2;
      let activity = false;
      if (changedRows !== void 0) {
        for (const row of changedRows) {
          pendingChanges.rows.add(row);
          cursorHold = true;
          activity = true;
        }
      }
      if (theme2 !== void 0 && props.preferEmbeddedTheme) {
        pendingChanges.theme = theme2;
        for (let row = 0; row < size().rows; row++) {
          pendingChanges.rows.add(row);
        }
      }
      const newCursor = core.getCursor();
      if (newCursor.visible != cursor.visible || newCursor.col != cursor.col || newCursor.row != cursor.row) {
        if (cursor.visible) {
          pendingChanges.rows.add(cursor.row);
        }
        if (newCursor.visible) {
          pendingChanges.rows.add(newCursor.row);
        }
        cursor = newCursor;
        cursorHold = true;
        activity = true;
      }
      if (newSize !== void 0) {
        pendingChanges.size = newSize;
        for (const row of pendingChanges.rows) {
          if (row >= newSize.rows) {
            pendingChanges.rows.delete(row);
          }
        }
      }
      if (activity && cursor.visible) {
        pendingChanges.rows.add(cursor.row);
      }
      scheduleRender();
    }
    function toggleBlink() {
      setBlinkOn((blink) => {
        if (!blink) cursorHold = false;
        return !blink;
      });
    }
    function scheduleRender() {
      if (frameRequestId === void 0) {
        frameRequestId = requestAnimationFrame(render2);
      }
    }
    function render2() {
      frameRequestId = void 0;
      const {
        size: newSize,
        theme: newTheme,
        rows
      } = pendingChanges;
      batch(function() {
        if (newSize !== void 0) {
          resizeCanvas(newSize);
          adjustTextRowNodeCount(newSize.rows);
          adjustSymbolRowNodeCount(newSize.rows);
          setSize(newSize);
        }
        if (newTheme !== void 0) {
          if (newTheme === null) {
            setTheme(buildTheme(cssTheme));
          } else {
            setTheme(buildTheme(newTheme));
          }
          colorsCache.clear();
        }
        const theme_ = theme();
        const cursorOn_ = blinkOn() || cursorHold;
        for (const r of rows) {
          renderRow(r, theme_, cursorOn_);
        }
      });
      pendingChanges.size = void 0;
      pendingChanges.theme = void 0;
      pendingChanges.rows.clear();
      props.stats.renders += 1;
    }
    function renderRow(rowIndex, theme2, cursorOn2) {
      const line = core.getLine(rowIndex, cursorOn2);
      clearCanvasRow(rowIndex);
      renderRowBg(rowIndex, line.bg, theme2);
      renderRowRasterSymbols(rowIndex, line.raster_symbols, theme2);
      renderRowVectorSymbols(rowIndex, line.vector_symbols, theme2);
      renderRowText(rowIndex, line.text, line.codepoints, theme2);
    }
    function clearCanvasRow(rowIndex) {
      canvasCtx.clearRect(0, rowIndex * BLOCK_V_RES, size().cols * BLOCK_H_RES, BLOCK_V_RES);
    }
    function renderRowBg(rowIndex, spans, theme2) {
      const view = core.getDataView(spans, 8);
      const y = rowIndex * BLOCK_V_RES;
      let i = 0;
      while (i < view.byteLength) {
        const column = view.getUint16(i + 0, true);
        const width = view.getUint16(i + 2, true);
        const color = getColor(view, i + 4, theme2);
        i += 8;
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(column * BLOCK_H_RES, y, width * BLOCK_H_RES, BLOCK_V_RES);
      }
    }
    function renderRowRasterSymbols(rowIndex, symbols, theme2) {
      const view = core.getDataView(symbols, 12);
      const y = rowIndex * BLOCK_V_RES;
      let i = 0;
      while (i < view.byteLength) {
        const column = view.getUint16(i + 0, true);
        const codepoint = view.getUint32(i + 4, true);
        const color = getColor(view, i + 8, theme2) || theme2.fg;
        i += 12;
        canvasCtx.fillStyle = color;
        drawBlockGlyph(canvasCtx, codepoint, column * BLOCK_H_RES, y);
      }
    }
    function renderRowVectorSymbols(rowIndex, symbols, theme2) {
      const view = core.getDataView(symbols, 16);
      const frag = document.createDocumentFragment();
      const symbolRow = vectorSymbolRowsEl.children[rowIndex];
      let i = 0;
      while (i < view.byteLength) {
        const column = view.getUint16(i + 0, true);
        const codepoint = view.getUint32(i + 4, true);
        const color = getColor(view, i + 8, theme2);
        const attrs = view.getUint8(i + 12);
        i += 16;
        const blink = (attrs & BLINK_MASK) !== 0;
        const el2 = createVectorSymbolNode(codepoint, column, color, blink);
        if (el2) {
          frag.appendChild(el2);
        }
      }
      recycleVectorSymbolUses(symbolRow);
      symbolRow.replaceChildren(frag);
    }
    function renderRowText(rowIndex, spans, codepoints, theme2) {
      const spansView = core.getDataView(spans, 12);
      const codepointsView = core.getUint32Array(codepoints);
      const frag = document.createDocumentFragment();
      let i = 0;
      while (i < spansView.byteLength) {
        const column = spansView.getUint16(i + 0, true);
        const codepointsStart = spansView.getUint16(i + 2, true);
        const len = spansView.getUint16(i + 4, true);
        const color = getColor(spansView, i + 6, theme2);
        const attrs = spansView.getUint8(i + 10);
        const text = String.fromCodePoint(...codepointsView.subarray(codepointsStart, codepointsStart + len));
        i += 12;
        const el2 = document.createElement("span");
        const style2 = el2.style;
        style2.setProperty("--offset", column);
        el2.textContent = text;
        if (color) {
          style2.color = color;
        }
        const cls = getAttrClass(attrs);
        if (cls !== null) {
          el2.className = cls;
        }
        frag.appendChild(el2);
      }
      textEl.children[rowIndex].replaceChildren(frag);
    }
    function getAttrClass(attrs) {
      let c = attrClassCache.get(attrs);
      if (c === void 0) {
        c = buildAttrClass(attrs);
        attrClassCache.set(attrs, c);
      }
      return c;
    }
    function buildAttrClass(attrs) {
      let cls = "";
      if ((attrs & BOLD_MASK) !== 0) {
        cls += "ap-bold ";
      } else if ((attrs & FAINT_MASK) !== 0) {
        cls += "ap-faint ";
      }
      if ((attrs & ITALIC_MASK) !== 0) {
        cls += "ap-italic ";
      }
      if ((attrs & UNDERLINE_MASK) !== 0) {
        cls += "ap-underline ";
      }
      if ((attrs & STRIKETHROUGH_MASK) !== 0) {
        cls += "ap-strike ";
      }
      if ((attrs & BLINK_MASK) !== 0) {
        cls += "ap-blink ";
      }
      return cls === "" ? null : cls;
    }
    function getColor(view, offset, theme2) {
      const tag = view.getUint8(offset);
      if (tag === 0) {
        return null;
      } else if (tag === 1) {
        return theme2.fg;
      } else if (tag === 2) {
        return theme2.bg;
      } else if (tag === 3) {
        return theme2.palette[view.getUint8(offset + 1)];
      } else if (tag === 4) {
        const key = view.getUint32(offset, true);
        let c = colorsCache.get(key);
        if (c === void 0) {
          const r = view.getUint8(offset + 1);
          const g = view.getUint8(offset + 2);
          const b = view.getUint8(offset + 3);
          c = "rgb(" + r + "," + g + "," + b + ")";
          colorsCache.set(key, c);
        }
        return c;
      } else {
        throw new Error(`invalid color tag: ${tag}`);
      }
    }
    function adjustTextRowNodeCount(rows) {
      let r = textEl.children.length;
      if (r < rows) {
        const frag = document.createDocumentFragment();
        while (r < rows) {
          const row = getNewRow();
          row.style.setProperty("--row", r);
          frag.appendChild(row);
          r += 1;
        }
        textEl.appendChild(frag);
      }
      while (textEl.children.length > rows) {
        const row = textEl.lastElementChild;
        textEl.removeChild(row);
        textRowPool.push(row);
      }
    }
    function adjustSymbolRowNodeCount(rows) {
      let r = vectorSymbolRowsEl.children.length;
      if (r < rows) {
        const frag = document.createDocumentFragment();
        while (r < rows) {
          const row = getNewSymbolRow();
          row.setAttribute("transform", `translate(0 ${r})`);
          frag.appendChild(row);
          r += 1;
        }
        vectorSymbolRowsEl.appendChild(frag);
      }
      while (vectorSymbolRowsEl.children.length > rows) {
        const row = vectorSymbolRowsEl.lastElementChild;
        vectorSymbolRowsEl.removeChild(row);
        vectorSymbolRowPool.push(row);
      }
    }
    function getNewRow() {
      let row = textRowPool.pop();
      if (row === void 0) {
        row = document.createElement("span");
        row.className = "ap-line";
      }
      return row;
    }
    function getNewSymbolRow() {
      let row = vectorSymbolRowPool.pop();
      if (row === void 0) {
        row = document.createElementNS(SVG_NS, "g");
        row.setAttribute("class", "ap-symbol-line");
      }
      return row;
    }
    function createVectorSymbolNode(codepoint, column, fg, blink) {
      if (!ensureVectorSymbolDef(codepoint)) {
        return null;
      }
      const isPowerline = POWERLINE_SYMBOLS.has(codepoint);
      const symbolX = isPowerline ? column - POWERLINE_SYMBOL_NUDGE : column;
      const symbolWidth = isPowerline ? 1 + POWERLINE_SYMBOL_NUDGE * 2 : 1;
      const node = getVectorSymbolUse();
      node.setAttribute("href", `#sym-${codepoint}`);
      node.setAttribute("x", symbolX);
      node.setAttribute("y", 0);
      node.setAttribute("width", symbolWidth);
      node.setAttribute("height", "1");
      if (fg) {
        node.style.setProperty("color", fg);
      } else {
        node.style.removeProperty("color");
      }
      if (blink) {
        node.classList.add("ap-blink");
      } else {
        node.classList.remove("ap-blink");
      }
      return node;
    }
    function recycleVectorSymbolUses(row) {
      while (row.firstChild) {
        const child = row.firstChild;
        row.removeChild(child);
        vectorSymbolUsePool.push(child);
      }
    }
    function getVectorSymbolUse() {
      let node = vectorSymbolUsePool.pop();
      if (node === void 0) {
        node = document.createElementNS(SVG_NS, "use");
      }
      return node;
    }
    function ensureVectorSymbolDef(codepoint) {
      const content = getVectorSymbolDef(codepoint);
      if (!content) {
        return false;
      }
      if (vectorSymbolDefCache.has(codepoint)) {
        return true;
      }
      const id = `sym-${codepoint}`;
      const symbol = document.createElementNS(SVG_NS, "symbol");
      symbol.setAttribute("id", id);
      symbol.setAttribute("viewBox", "0 0 1 1");
      symbol.setAttribute("preserveAspectRatio", "none");
      symbol.setAttribute("overflow", "visible");
      symbol.innerHTML = content;
      vectorSymbolDefsEl.appendChild(symbol);
      vectorSymbolDefCache.add(codepoint);
      return true;
    }
    return (() => {
      const _el$ = _tmpl$$e.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$3.nextSibling;
      const _ref$ = el;
      typeof _ref$ === "function" ? use(_ref$, _el$) : el = _el$;
      const _ref$2 = canvasEl;
      typeof _ref$2 === "function" ? use(_ref$2, _el$2) : canvasEl = _el$2;
      const _ref$3 = vectorSymbolsEl;
      typeof _ref$3 === "function" ? use(_ref$3, _el$3) : vectorSymbolsEl = _el$3;
      const _ref$4 = vectorSymbolDefsEl;
      typeof _ref$4 === "function" ? use(_ref$4, _el$4) : vectorSymbolDefsEl = _el$4;
      const _ref$5 = vectorSymbolRowsEl;
      typeof _ref$5 === "function" ? use(_ref$5, _el$5) : vectorSymbolRowsEl = _el$5;
      const _ref$6 = textEl;
      typeof _ref$6 === "function" ? use(_ref$6, _el$6) : textEl = _el$6;
      createRenderEffect((_p$) => {
        const _v$ = style$1(), _v$2 = `0 0 ${size().cols} ${size().rows}`, _v$3 = !!blinkOn(), _v$4 = !!blinkOn();
        _p$._v$ = style(_el$, _v$, _p$._v$);
        _v$2 !== _p$._v$2 && setAttribute(_el$3, "viewBox", _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && _el$3.classList.toggle("ap-blink", _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && _el$6.classList.toggle("ap-blink", _p$._v$4 = _v$4);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0
      });
      return _el$;
    })();
  });
  function buildTheme(theme) {
    return {
      fg: theme.foreground,
      bg: theme.background,
      palette: generate256Palette(theme.palette, theme.background, theme.foreground)
    };
  }
  function getCssTheme(el) {
    const style2 = getComputedStyle(el);
    const foreground = normalizeHexColor(style2.getPropertyValue("--term-color-foreground"), FALLBACK_THEME.foreground);
    const background = normalizeHexColor(style2.getPropertyValue("--term-color-background"), FALLBACK_THEME.background);
    const palette = [];
    for (let i = 0; i < 16; i++) {
      const fallback = i >= 8 ? palette[i - 8] : FALLBACK_THEME.palette[i];
      palette[i] = normalizeHexColor(style2.getPropertyValue(`--term-color-${i}`), fallback);
    }
    return {
      foreground,
      background,
      palette
    };
  }
  function generate256Palette(base16, bg, fg) {
    const bgLab = hexToOklab(bg);
    const fgLab = hexToOklab(fg);
    const c100 = hexToOklab(base16[1]);
    const c010 = hexToOklab(base16[2]);
    const c110 = hexToOklab(base16[3]);
    const c001 = hexToOklab(base16[4]);
    const c101 = hexToOklab(base16[5]);
    const c011 = hexToOklab(base16[6]);
    const palette = [...base16];
    for (let r = 0; r < 6; r += 1) {
      const tR = r / 5;
      const c0 = lerpOklab(tR, bgLab, c100);
      const c1 = lerpOklab(tR, c010, c110);
      const c2 = lerpOklab(tR, c001, c101);
      const c3 = lerpOklab(tR, c011, fgLab);
      for (let g = 0; g < 6; g += 1) {
        const tG = g / 5;
        const c4 = lerpOklab(tG, c0, c1);
        const c5 = lerpOklab(tG, c2, c3);
        for (let b = 0; b < 6; b += 1) {
          const tB = b / 5;
          const c6 = lerpOklab(tB, c4, c5);
          palette.push(oklabToHex(c6));
        }
      }
    }
    for (let i = 0; i < 24; i += 1) {
      const t = (i + 1) / 25;
      palette.push(oklabToHex(lerpOklab(t, bgLab, fgLab)));
    }
    return palette;
  }
  function drawBlockGlyph(ctx, codepoint, x, y) {
    const unitX = BLOCK_H_RES / 8;
    const unitY = BLOCK_V_RES / 8;
    const halfX = BLOCK_H_RES / 2;
    const halfY = BLOCK_V_RES / 2;
    const sextantX = BLOCK_H_RES / 2;
    const sextantY = BLOCK_V_RES / 3;
    switch (codepoint) {
      case 9600:
        ctx.fillRect(x, y, BLOCK_H_RES, halfY);
        break;
      case 9601:
        ctx.fillRect(x, y + unitY * 7, BLOCK_H_RES, unitY);
        break;
      case 9602:
        ctx.fillRect(x, y + unitY * 6, BLOCK_H_RES, unitY * 2);
        break;
      case 9603:
        ctx.fillRect(x, y + unitY * 5, BLOCK_H_RES, unitY * 3);
        break;
      case 9604:
        ctx.fillRect(x, y + halfY, BLOCK_H_RES, halfY);
        break;
      case 9605:
        ctx.fillRect(x, y + unitY * 3, BLOCK_H_RES, unitY * 5);
        break;
      case 9606:
        ctx.fillRect(x, y + unitY * 2, BLOCK_H_RES, unitY * 6);
        break;
      case 9607:
        ctx.fillRect(x, y + unitY, BLOCK_H_RES, unitY * 7);
        break;
      case 9608:
        ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
        break;
      case 9632:
        ctx.fillRect(x, y + unitY * 2, BLOCK_H_RES, unitY * 4);
        break;
      case 9609:
        ctx.fillRect(x, y, unitX * 7, BLOCK_V_RES);
        break;
      case 9610:
        ctx.fillRect(x, y, unitX * 6, BLOCK_V_RES);
        break;
      case 9611:
        ctx.fillRect(x, y, unitX * 5, BLOCK_V_RES);
        break;
      case 9612:
        ctx.fillRect(x, y, halfX, BLOCK_V_RES);
        break;
      case 9613:
        ctx.fillRect(x, y, unitX * 3, BLOCK_V_RES);
        break;
      case 9614:
        ctx.fillRect(x, y, unitX * 2, BLOCK_V_RES);
        break;
      case 9615:
        ctx.fillRect(x, y, unitX, BLOCK_V_RES);
        break;
      case 9616:
        ctx.fillRect(x + halfX, y, halfX, BLOCK_V_RES);
        break;
      case 9617:
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
        ctx.restore();
        break;
      case 9618:
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
        ctx.restore();
        break;
      case 9619:
        ctx.save();
        ctx.globalAlpha = 0.75;
        ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
        ctx.restore();
        break;
      case 9620:
        ctx.fillRect(x, y, BLOCK_H_RES, unitY);
        break;
      case 9621:
        ctx.fillRect(x + unitX * 7, y, unitX, BLOCK_V_RES);
        break;
      case 9622:
        ctx.fillRect(x, y + halfY, halfX, halfY);
        break;
      case 9623:
        ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
        break;
      case 9624:
        ctx.fillRect(x, y, halfX, halfY);
        break;
      case 9625:
        ctx.fillRect(x, y, halfX, BLOCK_V_RES);
        ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
        break;
      case 9626:
        ctx.fillRect(x, y, halfX, halfY);
        ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
        break;
      case 9627:
        ctx.fillRect(x, y, BLOCK_H_RES, halfY);
        ctx.fillRect(x, y + halfY, halfX, halfY);
        break;
      case 9628:
        ctx.fillRect(x, y, BLOCK_H_RES, halfY);
        ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
        break;
      case 9629:
        ctx.fillRect(x + halfX, y, halfX, halfY);
        break;
      case 9630:
        ctx.fillRect(x + halfX, y, halfX, halfY);
        ctx.fillRect(x, y + halfY, halfX, halfY);
        break;
      case 9631:
        ctx.fillRect(x + halfX, y, halfX, BLOCK_V_RES);
        ctx.fillRect(x, y + halfY, halfX, halfY);
        break;
      case 129792:
        ctx.fillRect(x, y, sextantX, sextantY);
        break;
      case 129793:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        break;
      case 129794:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        break;
      case 129795:
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        break;
      case 129796:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        break;
      case 129797:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        break;
      case 129798:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        break;
      case 129799:
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        break;
      case 129800:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        break;
      case 129801:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        break;
      case 129802:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        break;
      case 129803:
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        break;
      case 129804:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        break;
      case 129805:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        break;
      case 129806:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        break;
      case 129807:
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129808:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129809:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129810:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129811:
        ctx.fillRect(x, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129812:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129813:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129814:
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129815:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129816:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY * 2);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129817:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129818:
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129819:
        ctx.fillRect(x, y, sextantX, sextantY * 3);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        break;
      case 129820:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129821:
        ctx.fillRect(x, y, sextantX * 2, sextantY * 2);
        ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129822:
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129823:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129824:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129825:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129826:
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129827:
        ctx.fillRect(x, y, sextantX, sextantY * 2);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129828:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129829:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129830:
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129831:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129832:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129833:
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129834:
        ctx.fillRect(x, y, sextantX, sextantY * 2);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
        break;
      case 129835:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129836:
        ctx.fillRect(x, y, sextantX * 2, sextantY * 2);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129837:
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129838:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129839:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129840:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129841:
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129842:
        ctx.fillRect(x, y, sextantX, sextantY * 2);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129843:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129844:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129845:
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129846:
        ctx.fillRect(x, y, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129847:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY * 2);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129848:
        ctx.fillRect(x, y, sextantX * 2, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
        break;
      case 129849:
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY * 2);
        break;
      case 129850:
        ctx.fillRect(x, y, sextantX, sextantY * 3);
        ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
        ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
        break;
      case 129851:
        ctx.fillRect(x + sextantX, y, sextantX, sextantY);
        ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY * 2);
        break;
    }
  }
  var SYMBOL_STROKE = 0.05;
  var CELL_RATIO = 9.0375 / 20;
  function getVectorSymbolDef(codepoint) {
    const stroke = `stroke="currentColor" stroke-width="${SYMBOL_STROKE}" stroke-linejoin="miter" stroke-linecap="square"`;
    const strokeButt = `stroke="currentColor" stroke-width="${SYMBOL_STROKE}" stroke-linejoin="miter" stroke-linecap="butt"`;
    const stroked = (d) => `<path d="${d}" fill="none" ${stroke}/>`;
    const third = 1 / 3;
    const twoThirds = 2 / 3;
    switch (codepoint) {
      // ◢ - black lower right triangle (https://symbl.cc/en/25E2/)
      case 9698:
        return '<path d="M1,1 L1,0 L0,1 Z" fill="currentColor"/>' + stroked("M1,1 L1,0 L0,1 Z");
      // ◣ - black lower left triangle (https://symbl.cc/en/25E3/)
      case 9699:
        return '<path d="M0,1 L0,0 L1,1 Z" fill="currentColor"/>' + stroked("M0,1 L0,0 L1,1 Z");
      // ◤ - black upper left triangle (https://symbl.cc/en/25E4/)
      case 9700:
        return '<path d="M0,0 L1,0 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L1,0 L0,1 Z");
      // ◥ - black upper right triangle (https://symbl.cc/en/25E5/)
      case 9701:
        return '<path d="M1,0 L1,1 L0,0 Z" fill="currentColor"/>' + stroked("M1,0 L1,1 L0,0 Z");
      case 9871: {
        const horizontalGap = 0.15;
        const verticalGap = 0.2;
        const lineHeight = 0.17;
        const halfHorizontalGap = horizontalGap / 2;
        const halfVerticalGap = verticalGap / 2;
        const toViewBoxY = (offset) => 0.5 + offset * CELL_RATIO;
        const leftX1 = 0.5 - halfHorizontalGap;
        const rightX0 = 0.5 + halfHorizontalGap;
        const rightX1 = 1 + 0.02;
        const topY0 = toViewBoxY(-halfVerticalGap - lineHeight);
        const topY1 = toViewBoxY(-halfVerticalGap);
        const bottomY0 = toViewBoxY(halfVerticalGap);
        const bottomY1 = toViewBoxY(halfVerticalGap + lineHeight);
        const rect = (x0, x1, y0, y1) => `M${x0},${y0} L${x1},${y0} L${x1},${y1} L${x0},${y1} Z`;
        return `<path d="${rect(0, leftX1, topY0, topY1)} ${rect(rightX0, rightX1, topY0, topY1)} ${rect(0, leftX1, bottomY0, bottomY1)} ${rect(rightX0, rightX1, bottomY0, bottomY1)}" fill="currentColor"/>`;
      }
      // 🬼 - lower left block diagonal lower middle left to lower centre (https://symbl.cc/en/1FB3C/)
      case 129852:
        return `<path d="M0,${twoThirds} L0,1 L0.5,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L0.5,1 Z`);
      // 🬽 - lower left block diagonal lower middle left to lower right (https://symbl.cc/en/1FB3D/)
      case 129853:
        return `<path d="M0,${twoThirds} L0,1 L1,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 Z`);
      // 🬾 - lower left block diagonal upper middle left to lower centre (https://symbl.cc/en/1FB3E/)
      case 129854:
        return `<path d="M0,${third} L0.5,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L0.5,1 L0,1 Z`);
      // 🬿 - lower left block diagonal upper middle left to lower right (https://symbl.cc/en/1FB3F/)
      case 129855:
        return `<path d="M0,${third} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L1,1 L0,1 Z`);
      // 🭀 - lower left block diagonal upper left to lower centre (https://symbl.cc/en/1FB40/)
      case 129856:
        return '<path d="M0,0 L0.5,1 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L0.5,1 L0,1 Z");
      // 🭁 - lower right block diagonal upper middle left to upper centre (https://symbl.cc/en/1FB41/)
      case 129857:
        return `<path d="M0,${third} L0,1 L1,1 L1,0 L0.5,0 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,1 L1,1 L1,0 L0.5,0 Z`);
      // 🭂 - lower right block diagonal upper middle left to upper right (https://symbl.cc/en/1FB42/)
      case 129858:
        return `<path d="M0,${third} L0,1 L1,1 L1,0 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,1 L1,1 L1,0 Z`);
      // 🭃 - lower right block diagonal lower middle left to upper centre (https://symbl.cc/en/1FB43/)
      case 129859:
        return `<path d="M0,${twoThirds} L0,1 L1,1 L1,0 L0.5,0 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 L1,0 L0.5,0 Z`);
      // 🭄 - lower right block diagonal lower middle left to upper right (https://symbl.cc/en/1FB44/)
      case 129860:
        return `<path d="M0,${twoThirds} L0,1 L1,1 L1,0 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 L1,0 Z`);
      // 🭅 - lower right block diagonal lower left to upper centre (https://symbl.cc/en/1FB45/)
      case 129861:
        return '<path d="M0.5,0 L1,0 L1,1 L0,1 Z" fill="currentColor"/>' + stroked("M0.5,0 L1,0 L1,1 L0,1 Z");
      // 🭆 - lower right block diagonal lower middle left to upper middle right (https://symbl.cc/en/1FB46/)
      case 129862:
        return `<path d="M0,${twoThirds} L0,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 L1,${third} Z`);
      // 🭇 - lower right block diagonal lower centre to lower middle right (https://symbl.cc/en/1FB47/)
      case 129863:
        return `<path d="M0.5,1 L1,1 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0.5,1 L1,1 L1,${twoThirds} Z`);
      // 🭈 - lower right block diagonal lower left to lower middle right (https://symbl.cc/en/1FB48/)
      case 129864:
        return `<path d="M0,1 L1,1 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,1 L1,1 L1,${twoThirds} Z`);
      // 🭉 - lower right block diagonal lower centre to upper middle right (https://symbl.cc/en/1FB49/)
      case 129865:
        return `<path d="M0.5,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0.5,1 L1,1 L1,${third} Z`);
      // 🭊 - lower right block diagonal lower left to upper middle right (https://symbl.cc/en/1FB4A/)
      case 129866:
        return `<path d="M0,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,1 L1,1 L1,${third} Z`);
      // 🭋 - lower right block diagonal lower centre to upper right (https://symbl.cc/en/1FB4B/)
      case 129867:
        return '<path d="M0.5,1 L1,0 L1,1 Z" fill="currentColor"/>' + stroked("M0.5,1 L1,0 L1,1 Z");
      // 🭌 - lower left block diagonal upper centre to upper middle right (https://symbl.cc/en/1FB4C/)
      case 129868:
        return `<path d="M0,0 L0.5,0 L1,${third} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L0.5,0 L1,${third} L1,1 L0,1 Z`);
      // 🭍 - lower left block diagonal upper left to upper middle right (https://symbl.cc/en/1FB4D/)
      case 129869:
        return `<path d="M0,0 L0,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,0 L0,1 L1,1 L1,${third} Z`);
      // 🭎 - lower left block diagonal upper centre to lower middle right (https://symbl.cc/en/1FB4E/)
      case 129870:
        return `<path d="M0,0 L0.5,0 L1,${twoThirds} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L0.5,0 L1,${twoThirds} L1,1 L0,1 Z`);
      // 🭏 - lower left block diagonal upper left to lower middle right (https://symbl.cc/en/1FB4F/)
      case 129871:
        return `<path d="M0,0 L1,${twoThirds} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,${twoThirds} L1,1 L0,1 Z`);
      // 🭐 - lower left block diagonal upper centre to lower right (https://symbl.cc/en/1FB50/)
      case 129872:
        return '<path d="M0,0 L0.5,0 L1,1 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L0.5,0 L1,1 L0,1 Z");
      // 🭑 - lower left block diagonal upper middle left to lower middle right (https://symbl.cc/en/1FB51/)
      case 129873:
        return `<path d="M0,${third} L1,${twoThirds} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L1,${twoThirds} L1,1 L0,1 Z`);
      // 🭒 - upper right block diagonal lower middle left to lower centre (https://symbl.cc/en/1FB52/)
      case 129874:
        return `<path d="M0,${twoThirds} L0,0 L1,0 L1,1 L0.5,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,0 L1,0 L1,1 L0.5,1 Z`);
      // 🭓 - upper right block diagonal lower middle left to lower right (https://symbl.cc/en/1FB53/)
      case 129875:
        return `<path d="M0,${twoThirds} L0,0 L1,0 L1,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,0 L1,0 L1,1 Z`);
      // 🭔 - upper right block diagonal upper middle left to lower centre (https://symbl.cc/en/1FB54/)
      case 129876:
        return `<path d="M0,${third} L0,0 L1,0 L1,1 L0.5,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,0 L1,0 L1,1 L0.5,1 Z`);
      // 🭕 - upper right block diagonal upper middle left to lower right (https://symbl.cc/en/1FB55/)
      case 129877:
        return `<path d="M0,${third} L0,0 L1,0 L1,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,0 L1,0 L1,1 Z`);
      // 🭖 - upper right block diagonal upper left to lower centre (https://symbl.cc/en/1FB56/)
      case 129878:
        return '<path d="M0,0 L1,0 L1,1 L0.5,1 Z" fill="currentColor"/>' + stroked("M0,0 L1,0 L1,1 L0.5,1 Z");
      // 🭗 - upper left block diagonal upper middle left to upper centre (https://symbl.cc/en/1FB57/)
      case 129879:
        return `<path d="M0,${third} L0.5,0 L0,0 Z" fill="currentColor"/>` + stroked(`M0,${third} L0.5,0 L0,0 Z`);
      // 🭘 - upper left block diagonal upper middle left to upper right (https://symbl.cc/en/1FB58/)
      case 129880:
        return `<path d="M0,0 L1,0 L0,${third} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L0,${third} Z`);
      // 🭙 - upper left block diagonal lower middle left to upper centre (https://symbl.cc/en/1FB59/)
      case 129881:
        return `<path d="M0,0 L0.5,0 L0,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L0.5,0 L0,${twoThirds} Z`);
      // 🭚 - upper left block diagonal lower middle left to upper right (https://symbl.cc/en/1FB5A/)
      case 129882:
        return `<path d="M0,0 L1,0 L0,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L0,${twoThirds} Z`);
      // 🭛 - upper left block diagonal lower left to upper centre (https://symbl.cc/en/1FB5B/)
      case 129883:
        return '<path d="M0,0 L0.5,0 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L0.5,0 L0,1 Z");
      // 🭜 - upper left block diagonal lower middle left to upper middle right (https://symbl.cc/en/1FB5C/)
      case 129884:
        return `<path d="M0,0 L1,0 L1,${third} L0,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} L0,${twoThirds} Z`);
      // 🭝 - upper left block diagonal lower centre to lower middle right (https://symbl.cc/en/1FB5D/)
      case 129885:
        return `<path d="M0,0 L1,0 L1,${twoThirds} L0.5,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${twoThirds} L0.5,1 L0,1 Z`);
      // 🭞 - upper left block diagonal lower left to lower middle right (https://symbl.cc/en/1FB5E/)
      case 129886:
        return `<path d="M0,0 L1,0 L1,${twoThirds} L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${twoThirds} L0,1 Z`);
      // 🭟 - upper left block diagonal lower centre to upper middle right (https://symbl.cc/en/1FB5F/)
      case 129887:
        return `<path d="M0,0 L1,0 L1,${third} L0.5,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} L0.5,1 L0,1 Z`);
      // 🭠 - upper left block diagonal lower left to upper middle right (https://symbl.cc/en/1FB60/)
      case 129888:
        return `<path d="M0,0 L1,0 L1,${third} L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} L0,1 Z`);
      // 🭡 - upper left block diagonal lower centre to upper right (https://symbl.cc/en/1FB61/)
      case 129889:
        return '<path d="M0,0 L1,0 L0.5,1 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L1,0 L0.5,1 L0,1 Z");
      // 🭢 - upper right block diagonal upper centre to upper middle right (https://symbl.cc/en/1FB62/)
      case 129890:
        return `<path d="M0.5,0 L1,0 L1,${third} Z" fill="currentColor"/>` + stroked(`M0.5,0 L1,0 L1,${third} Z`);
      // 🭣 - upper right block diagonal upper left to upper middle right (https://symbl.cc/en/1FB63/)
      case 129891:
        return `<path d="M0,0 L1,0 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} Z`);
      // 🭤 - upper right block diagonal upper centre to lower middle right (https://symbl.cc/en/1FB64/)
      case 129892:
        return `<path d="M0.5,0 L1,0 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0.5,0 L1,0 L1,${twoThirds} Z`);
      // 🭥 - upper right block diagonal upper left to lower middle right (https://symbl.cc/en/1FB65/)
      case 129893:
        return `<path d="M0,0 L1,0 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${twoThirds} Z`);
      // 🭦 - upper right block diagonal upper centre to lower right (https://symbl.cc/en/1FB66/)
      case 129894:
        return '<path d="M0.5,0 L1,0 L1,1 Z" fill="currentColor"/>' + stroked("M0.5,0 L1,0 L1,1 Z");
      // 🭧 - upper right block diagonal upper middle left to lower middle right (https://symbl.cc/en/1FB67/)
      case 129895:
        return `<path d="M0,${third} L0,0 L1,0 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,${third} L0,0 L1,0 L1,${twoThirds} Z`);
      // 🭨 - upper and right and lower triangular three quarters block (https://symbl.cc/en/1FB68/)
      case 129896:
        return `<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M0,0 L0,1 L0.5,0.5 Z" fill="currentColor"/><path d="M0,0 L1,0 M0,1 L1,1 M1,0 L1,1" fill="none" ${stroke}/><path d="M0,0 L0.5,0.5 M0,1 L0.5,0.5" fill="none" ${strokeButt}/>`;
      // 🭩 - left and lower and right triangular three quarters block (https://symbl.cc/en/1FB69/)
      case 129897:
        return `<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M0,0 L1,0 L0.5,0.5 Z" fill="currentColor"/><path d="M0,0 L0,1 M1,0 L1,1 M0,1 L1,1" fill="none" ${stroke}/><path d="M0,0 L0.5,0.5 M1,0 L0.5,0.5" fill="none" ${strokeButt}/>`;
      // 🭪 - upper and left and lower triangular three quarters block (https://symbl.cc/en/1FB6A/)
      case 129898:
        return `<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M1,0 L1,1 L0.5,0.5 Z" fill="currentColor"/><path d="M0,0 L1,0 M0,1 L1,1 M0,0 L0,1" fill="none" ${stroke}/><path d="M1,0 L0.5,0.5 M1,1 L0.5,0.5" fill="none" ${strokeButt}/>`;
      // 🭫 - left and upper and right triangular three quarters block (https://symbl.cc/en/1FB6B/)
      case 129899:
        return `<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M0,1 L1,1 L0.5,0.5 Z" fill="currentColor"/><path d="M0,0 L1,0 M0,0 L0,1 M1,0 L1,1" fill="none" ${stroke}/><path d="M0,1 L0.5,0.5 M1,1 L0.5,0.5" fill="none" ${strokeButt}/>`;
      // 🭬 - left triangular one quarter block (https://symbl.cc/en/1FB6C/)
      case 129900:
        return '<path d="M0,0 L0,1 L0.5,0.5 Z" fill="currentColor"/>' + stroked("M0,0 L0,1 L0.5,0.5 Z");
      // powerline right full triangle (https://www.nerdfonts.com/cheat-sheet)
      case 57520:
        return '<path d="M0,0 L1,0.5 L0,1 Z" fill="currentColor"/>';
      // powerline right bracket (https://www.nerdfonts.com/cheat-sheet)
      case 57521:
        return '<path d="M0,0 L1,0.5 L0,1" fill="none" stroke="currentColor" stroke-width="0.07" stroke-linejoin="miter"/>';
      // powerline left full triangle (https://www.nerdfonts.com/cheat-sheet)
      case 57522:
        return '<path d="M1,0 L0,0.5 L1,1 Z" fill="currentColor"/>';
      // powerline left bracket (https://www.nerdfonts.com/cheat-sheet)
      case 57523:
        return '<path d="M1,0 L0,0.5 L1,1" fill="none" stroke="currentColor" stroke-width="0.07" stroke-linejoin="miter"/>';
      default:
        return null;
    }
  }
  var POWERLINE_SYMBOLS = /* @__PURE__ */ new Set([57520, 57521, 57522, 57523]);
  var POWERLINE_SYMBOL_NUDGE = 0.02;
  var FALLBACK_THEME = {
    foreground: "#000000",
    background: "#000000",
    palette: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"]
  };
  var _tmpl$$d = /* @__PURE__ */ template(`<svg version="1.1" viewBox="0 0 12 12" class="ap-icon ap-icon-fullscreen-off"><path d="M7,5 L7,0 L9,2 L11,0 L12,1 L10,3 L12,5 Z"></path><path d="M5,7 L0,7 L2,9 L0,11 L1,12 L3,10 L5,12 Z"></path></svg>`, 6);
  var ExpandIcon = ((props) => {
    return _tmpl$$d.cloneNode(true);
  });
  var _tmpl$$c = /* @__PURE__ */ template(`<svg version="1.1" viewBox="6 8 14 16" class="ap-icon"><path d="M0.938 8.313h22.125c0.5 0 0.938 0.438 0.938 0.938v13.5c0 0.5-0.438 0.938-0.938 0.938h-22.125c-0.5 0-0.938-0.438-0.938-0.938v-13.5c0-0.5 0.438-0.938 0.938-0.938zM1.594 22.063h20.813v-12.156h-20.813v12.156zM3.844 11.188h1.906v1.938h-1.906v-1.938zM7.469 11.188h1.906v1.938h-1.906v-1.938zM11.031 11.188h1.938v1.938h-1.938v-1.938zM14.656 11.188h1.875v1.938h-1.875v-1.938zM18.25 11.188h1.906v1.938h-1.906v-1.938zM5.656 15.031h1.938v1.938h-1.938v-1.938zM9.281 16.969v-1.938h1.906v1.938h-1.906zM12.875 16.969v-1.938h1.906v1.938h-1.906zM18.406 16.969h-1.938v-1.938h1.938v1.938zM16.531 20.781h-9.063v-1.906h9.063v1.906z"></path></svg>`, 4);
  var KeyboardIcon = ((props) => {
    return _tmpl$$c.cloneNode(true);
  });
  var _tmpl$$b = /* @__PURE__ */ template(`<svg version="1.1" viewBox="0 0 12 12" class="ap-icon" aria-label="Pause" role="button"><path d="M1,0 L4,0 L4,12 L1,12 Z"></path><path d="M8,0 L11,0 L11,12 L8,12 Z"></path></svg>`, 6);
  var PauseIcon = ((props) => {
    return _tmpl$$b.cloneNode(true);
  });
  var _tmpl$$a = /* @__PURE__ */ template(`<svg version="1.1" viewBox="0 0 12 12" class="ap-icon" aria-label="Play" role="button"><path d="M1,0 L11,6 L1,12 Z"></path></svg>`, 4);
  var PlayIcon = ((props) => {
    return _tmpl$$a.cloneNode(true);
  });
  var _tmpl$$9 = /* @__PURE__ */ template(`<svg version="1.1" viewBox="0 0 12 12" class="ap-icon ap-icon-fullscreen-on"><path d="M12,0 L7,0 L9,2 L7,4 L8,5 L10,3 L12,5 Z"></path><path d="M0,12 L0,7 L2,9 L4,7 L5,8 L3,10 L5,12 Z"></path></svg>`, 6);
  var ShrinkIcon = ((props) => {
    return _tmpl$$9.cloneNode(true);
  });
  var _tmpl$$8 = /* @__PURE__ */ template(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z"></path><path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z"></path></svg>`, 6);
  var SpeakerOnIcon = ((props) => {
    return _tmpl$$8.cloneNode(true);
  });
  var _tmpl$$7 = /* @__PURE__ */ template(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path d="M10.047 3.062a.75.75 0 0 1 .453.688v12.5a.75.75 0 0 1-1.264.546L5.203 13H2.667a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 1.5 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .7-.48h2.535l4.033-3.796a.75.75 0 0 1 .811-.142ZM13.78 7.22a.75.75 0 1 0-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 0 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L16.56 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L15.5 8.94l-1.72-1.72Z"></path></svg>`, 4);
  var SpeakerOffIcon = ((props) => {
    return _tmpl$$7.cloneNode(true);
  });
  var _tmpl$$6 = /* @__PURE__ */ template(`<span class="ap-button ap-playback-button" tabindex="0"></span>`, 2);
  var _tmpl$2$1 = /* @__PURE__ */ template(`<span class="ap-bar"><span class="ap-gutter ap-gutter-empty"></span><span class="ap-gutter ap-gutter-full"></span></span>`, 6);
  var _tmpl$3$1 = /* @__PURE__ */ template(`<span class="ap-tooltip">Unmute (m)</span>`, 2);
  var _tmpl$4$1 = /* @__PURE__ */ template(`<span class="ap-tooltip">Mute (m)</span>`, 2);
  var _tmpl$5$1 = /* @__PURE__ */ template(`<span class="ap-button ap-speaker-button ap-tooltip-container" aria-label="Mute / unmute" role="button" tabindex="0"></span>`, 2);
  var _tmpl$6$1 = /* @__PURE__ */ template(`<div class="ap-control-bar"><span class="ap-timer" aria-readonly="true" role="textbox" tabindex="0"><span class="ap-time-elapsed"></span><span class="ap-time-remaining"></span></span><span class="ap-progressbar"></span><span class="ap-button ap-kbd-button ap-tooltip-container" aria-label="Show keyboard shortcuts" role="button" tabindex="0"><span class="ap-tooltip">Keyboard shortcuts (?)</span></span><span class="ap-button ap-fullscreen-button ap-tooltip-container" aria-label="Toggle fullscreen mode" role="button" tabindex="0"><span class="ap-tooltip">Fullscreen (f)</span></span></div>`, 18);
  var _tmpl$7$1 = /* @__PURE__ */ template(`<span class="ap-marker-container ap-tooltip-container"><span class="ap-marker"></span><span class="ap-tooltip"></span></span>`, 6);
  function formatTime(seconds) {
    let s = Math.floor(seconds);
    const d = Math.floor(s / 86400);
    s %= 86400;
    const h = Math.floor(s / 3600);
    s %= 3600;
    const m = Math.floor(s / 60);
    s %= 60;
    if (d > 0) {
      return `${zeroPad(d)}:${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
    } else if (h > 0) {
      return `${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
    } else {
      return `${zeroPad(m)}:${zeroPad(s)}`;
    }
  }
  function zeroPad(n) {
    return n < 10 ? `0${n}` : n.toString();
  }
  var ControlBar = ((props) => {
    const e = (f) => {
      return (e2) => {
        e2.preventDefault();
        f(e2);
      };
    };
    const currentTime = () => typeof props.currentTime === "number" ? formatTime(props.currentTime) : "--:--";
    const remainingTime = () => typeof props.remainingTime === "number" ? "-" + formatTime(props.remainingTime) : currentTime();
    const markers = createMemo(() => typeof props.duration === "number" ? props.markers.filter((m) => m[0] < props.duration) : []);
    const markerPosition = (m) => `${m[0] / props.duration * 100}%`;
    const markerText = (m) => {
      if (m[1] === "") {
        return formatTime(m[0]);
      } else {
        return `${formatTime(m[0])} - ${m[1]}`;
      }
    };
    const isPastMarker = (m) => typeof props.currentTime === "number" ? m[0] <= props.currentTime : false;
    const gutterBarStyle = () => {
      return {
        transform: `scaleX(${props.progress || 0}`
      };
    };
    const calcPosition = (e2) => {
      const barWidth = e2.currentTarget.offsetWidth;
      const rect = e2.currentTarget.getBoundingClientRect();
      const mouseX = e2.clientX - rect.left;
      const pos = Math.max(0, mouseX / barWidth);
      return `${pos * 100}%`;
    };
    const [mouseDown, setMouseDown] = createSignal(false);
    const throttledSeek = throttle(props.onSeekClick, 50);
    const onMouseDown = (e2) => {
      if (e2._marker) return;
      if (e2.altKey || e2.shiftKey || e2.metaKey || e2.ctrlKey || e2.button !== 0) return;
      setMouseDown(true);
      props.onSeekClick(calcPosition(e2));
    };
    const seekToMarker = (index) => {
      return e(() => {
        props.onSeekClick({
          marker: index
        });
      });
    };
    const onMove = (e2) => {
      if (e2.altKey || e2.shiftKey || e2.metaKey || e2.ctrlKey) return;
      if (mouseDown()) {
        throttledSeek(calcPosition(e2));
      }
    };
    const onDocumentMouseUp = () => {
      setMouseDown(false);
    };
    document.addEventListener("mouseup", onDocumentMouseUp);
    onCleanup(() => {
      document.removeEventListener("mouseup", onDocumentMouseUp);
    });
    return (() => {
      const _el$ = _tmpl$6$1.cloneNode(true), _el$3 = _el$.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$3.nextSibling, _el$13 = _el$6.nextSibling, _el$14 = _el$13.firstChild, _el$15 = _el$13.nextSibling, _el$16 = _el$15.firstChild;
      const _ref$ = props.ref;
      typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
      insert(_el$, createComponent(Show, {
        get when() {
          return props.isPausable;
        },
        get children() {
          const _el$2 = _tmpl$$6.cloneNode(true);
          addEventListener(_el$2, "click", e(props.onPlayClick));
          insert(_el$2, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return props.isPlaying;
                },
                get children() {
                  return createComponent(PauseIcon, {});
                }
              }), createComponent(Match, {
                when: true,
                get children() {
                  return createComponent(PlayIcon, {});
                }
              })];
            }
          }));
          return _el$2;
        }
      }), _el$3);
      insert(_el$4, currentTime);
      insert(_el$5, remainingTime);
      insert(_el$6, createComponent(Show, {
        get when() {
          return typeof props.progress === "number" || props.isSeekable;
        },
        get children() {
          const _el$7 = _tmpl$2$1.cloneNode(true), _el$8 = _el$7.firstChild, _el$9 = _el$8.nextSibling;
          _el$7.$$mousemove = onMove;
          _el$7.$$mousedown = onMouseDown;
          insert(_el$7, createComponent(For, {
            get each() {
              return markers();
            },
            children: (m, i) => (() => {
              const _el$17 = _tmpl$7$1.cloneNode(true), _el$18 = _el$17.firstChild, _el$19 = _el$18.nextSibling;
              _el$17.$$mousedown = (e2) => {
                e2._marker = true;
              };
              addEventListener(_el$17, "click", seekToMarker(i()));
              insert(_el$19, () => markerText(m));
              createRenderEffect((_p$) => {
                const _v$ = markerPosition(m), _v$2 = !!isPastMarker(m);
                _v$ !== _p$._v$ && _el$17.style.setProperty("left", _p$._v$ = _v$);
                _v$2 !== _p$._v$2 && _el$18.classList.toggle("ap-marker-past", _p$._v$2 = _v$2);
                return _p$;
              }, {
                _v$: void 0,
                _v$2: void 0
              });
              return _el$17;
            })()
          }), null);
          createRenderEffect((_$p) => style(_el$9, gutterBarStyle(), _$p));
          return _el$7;
        }
      }));
      insert(_el$, createComponent(Show, {
        get when() {
          return props.isMuted !== void 0;
        },
        get children() {
          const _el$10 = _tmpl$5$1.cloneNode(true);
          addEventListener(_el$10, "click", e(props.onMuteClick));
          insert(_el$10, createComponent(Switch, {
            get children() {
              return [createComponent(Match, {
                get when() {
                  return props.isMuted === true;
                },
                get children() {
                  return [createComponent(SpeakerOffIcon, {}), _tmpl$3$1.cloneNode(true)];
                }
              }), createComponent(Match, {
                get when() {
                  return props.isMuted === false;
                },
                get children() {
                  return [createComponent(SpeakerOnIcon, {}), _tmpl$4$1.cloneNode(true)];
                }
              })];
            }
          }));
          return _el$10;
        }
      }), _el$13);
      addEventListener(_el$13, "click", e(props.onHelpClick));
      insert(_el$13, createComponent(KeyboardIcon, {}), _el$14);
      addEventListener(_el$15, "click", e(props.onFullscreenClick));
      insert(_el$15, createComponent(ShrinkIcon, {}), _el$16);
      insert(_el$15, createComponent(ExpandIcon, {}), _el$16);
      createRenderEffect(() => _el$.classList.toggle("ap-seekable", !!props.isSeekable));
      return _el$;
    })();
  });
  delegateEvents(["click", "mousedown", "mousemove"]);
  var _tmpl$$5 = /* @__PURE__ */ template(`<div class="ap-overlay ap-overlay-error"><span>\u{1F4A5}</span></div>`, 4);
  var ErrorOverlay = ((props) => {
    return _tmpl$$5.cloneNode(true);
  });
  var _tmpl$$4 = /* @__PURE__ */ template(`<div class="ap-overlay ap-overlay-loading"><span class="ap-loader"></span></div>`, 4);
  var LoaderOverlay = ((props) => {
    return _tmpl$$4.cloneNode(true);
  });
  var _tmpl$$3 = /* @__PURE__ */ template(`<div class="ap-overlay ap-overlay-info"><span></span></div>`, 4);
  var InfoOverlay = ((props) => {
    return (() => {
      const _el$ = _tmpl$$3.cloneNode(true), _el$2 = _el$.firstChild;
      insert(_el$2, () => props.message);
      createRenderEffect(() => _el$.classList.toggle("ap-was-playing", !!props.wasPlaying));
      return _el$;
    })();
  });
  var _tmpl$$2 = /* @__PURE__ */ template(`<div class="ap-overlay ap-overlay-start"><div class="ap-play-button"><div><span><svg version="1.1" viewBox="0 0 1000.0 1000.0" class="ap-icon"><defs><mask id="small-triangle-mask"><rect width="100%" height="100%" fill="white"></rect><polygon points="700.0 500.0, 400.00000000000006 326.7949192431122, 399.9999999999999 673.2050807568877" fill="black"></polygon></mask></defs><polygon points="1000.0 500.0, 250.0000000000001 66.98729810778059, 249.99999999999977 933.0127018922192" mask="url(#small-triangle-mask)" fill="white" class="ap-play-btn-fill"></polygon><polyline points="673.2050807568878 400.0, 326.7949192431123 600.0" stroke="white" stroke-width="90" class="ap-play-btn-stroke"></polyline></svg></span></div></div></div>`, 22);
  var StartOverlay = ((props) => {
    const e = (f) => {
      return (e2) => {
        e2.preventDefault();
        f(e2);
      };
    };
    return (() => {
      const _el$ = _tmpl$$2.cloneNode(true);
      addEventListener(_el$, "click", e(props.onClick));
      return _el$;
    })();
  });
  delegateEvents(["click"]);
  var _tmpl$$1 = /* @__PURE__ */ template(`<li><kbd>space</kbd> - pause / resume</li>`, 4);
  var _tmpl$2 = /* @__PURE__ */ template(`<li><kbd>\u2190</kbd> / <kbd>\u2192</kbd> - rewind / fast-forward by 5 seconds</li>`, 6);
  var _tmpl$3 = /* @__PURE__ */ template(`<li><kbd>Shift</kbd> + <kbd>\u2190</kbd> / <kbd>\u2192</kbd> - rewind / fast-forward by 10%</li>`, 8);
  var _tmpl$4 = /* @__PURE__ */ template(`<li><kbd>[</kbd> / <kbd>]</kbd> - jump to the previous / next marker</li>`, 6);
  var _tmpl$5 = /* @__PURE__ */ template(`<li><kbd>0</kbd>, <kbd>1</kbd>, <kbd>2</kbd> ... <kbd>9</kbd> - jump to 0%, 10%, 20% ... 90%</li>`, 10);
  var _tmpl$6 = /* @__PURE__ */ template(`<li><kbd>,</kbd> / <kbd>.</kbd> - step back / forward, a frame at a time (when paused)</li>`, 6);
  var _tmpl$7 = /* @__PURE__ */ template(`<li><kbd>m</kbd> - mute / unmute audio</li>`, 4);
  var _tmpl$8 = /* @__PURE__ */ template(`<div class="ap-overlay ap-overlay-help"><div><div><p>Keyboard shortcuts</p><ul><li><kbd>f</kbd> - toggle fullscreen mode</li><li><kbd>?</kbd> - show this help popup</li></ul></div></div></div>`, 18);
  var HelpOverlay = ((props) => {
    const e = (f) => {
      return (e2) => {
        e2.preventDefault();
        f(e2);
      };
    };
    return (() => {
      const _el$ = _tmpl$8.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$12 = _el$5.firstChild, _el$14 = _el$12.nextSibling;
      addEventListener(_el$, "click", e(props.onClose));
      _el$2.$$click = (e2) => {
        e2.stopPropagation();
      };
      insert(_el$5, createComponent(Show, {
        get when() {
          return props.isPausable;
        },
        get children() {
          return _tmpl$$1.cloneNode(true);
        }
      }), _el$12);
      insert(_el$5, createComponent(Show, {
        get when() {
          return props.isSeekable;
        },
        get children() {
          return [_tmpl$2.cloneNode(true), _tmpl$3.cloneNode(true), _tmpl$4.cloneNode(true), _tmpl$5.cloneNode(true), _tmpl$6.cloneNode(true)];
        }
      }), _el$12);
      insert(_el$5, createComponent(Show, {
        get when() {
          return props.hasAudio;
        },
        get children() {
          return _tmpl$7.cloneNode(true);
        }
      }), _el$14);
      return _el$;
    })();
  });
  delegateEvents(["click"]);
  var _tmpl$ = /* @__PURE__ */ template(`<div class="ap-wrapper" tabindex="-1"><div></div></div>`, 4);
  var CONTROL_BAR_HEIGHT = 32;
  var Player = ((props) => {
    const logger = props.logger;
    const core = props.core;
    const autoPlay = props.autoPlay;
    const charW = props.charW;
    const charH = props.charH;
    const bordersW = props.bordersW;
    const bordersH = props.bordersH;
    const themeOption = props.theme ?? "auto/asciinema";
    const preferEmbeddedTheme = themeOption.slice(0, 5) === "auto/";
    const themeName = preferEmbeddedTheme ? themeOption.slice(5) : themeOption;
    const [state, setState] = createStore({
      containerW: 0,
      containerH: 0,
      isPausable: true,
      isSeekable: true,
      isFullscreen: false,
      currentTime: null,
      remainingTime: null,
      progress: null
    });
    const [isPlaying, setIsPlaying] = createSignal(false);
    const [isMuted, setIsMuted] = createSignal(void 0);
    const [wasPlaying, setWasPlaying] = createSignal(false);
    const [overlay, setOverlay] = createSignal(!autoPlay ? "start" : null);
    const [infoMessage, setInfoMessage] = createSignal(null);
    const [blinking, setBlinking] = createSignal(false);
    const [terminalSize, setTerminalSize] = createSignal({
      cols: props.cols,
      rows: props.rows
    }, {
      equals: (newVal, oldVal) => newVal.cols === oldVal.cols && newVal.rows === oldVal.rows
    });
    const [duration, setDuration] = createSignal(null);
    const [markers, setMarkers] = createStore([]);
    const [userActive, setUserActive] = createSignal(false);
    const [isHelpVisible, setIsHelpVisible] = createSignal(false);
    const [originalTheme, setOriginalTheme] = createSignal(null);
    const terminalCols = createMemo(() => terminalSize().cols || 80);
    const terminalRows = createMemo(() => terminalSize().rows || 24);
    const controlBarHeight = () => props.controls === false ? 0 : CONTROL_BAR_HEIGHT;
    const controlsVisible = () => props.controls === true || props.controls === "auto" && userActive();
    let userActivityTimeoutId;
    let timeUpdateIntervalId;
    let wrapperRef;
    let playerRef;
    let controlBarRef;
    let resizeObserver;
    function onPlaying() {
      setBlinking(true);
      startTimeUpdates();
    }
    function onStopped() {
      setBlinking(false);
      stopTimeUpdates();
      updateTime();
    }
    let resolveCoreReady;
    const coreReady = new Promise((resolve) => {
      resolveCoreReady = resolve;
    });
    const onCoreReady = (_ref) => {
      let {
        isPausable,
        isSeekable
      } = _ref;
      setState({
        isPausable,
        isSeekable
      });
      resolveCoreReady();
    };
    const onCoreMetadata = (meta) => {
      batch(() => {
        if (meta.duration !== void 0) {
          setDuration(meta.duration);
        }
        if (meta.markers !== void 0) {
          setMarkers(meta.markers);
        }
        if (meta.hasAudio !== void 0) {
          setIsMuted(meta.hasAudio ? false : void 0);
        }
        if (meta.size !== void 0) {
          setTerminalSize(meta.size);
        }
        if (meta.theme !== void 0) {
          setOriginalTheme(meta.theme);
        }
      });
    };
    const onCorePlay = () => {
      setOverlay(null);
    };
    const onCorePlaying = () => {
      batch(() => {
        setIsPlaying(true);
        setWasPlaying(true);
        setOverlay(null);
        onPlaying();
      });
    };
    const onCoreIdle = () => {
      batch(() => {
        setIsPlaying(false);
        onStopped();
      });
    };
    const onCoreLoading = () => {
      batch(() => {
        setIsPlaying(false);
        onStopped();
        setOverlay("loader");
      });
    };
    const onCoreOffline = (_ref2) => {
      let {
        message
      } = _ref2;
      batch(() => {
        setIsPlaying(false);
        onStopped();
        if (message !== void 0) {
          setInfoMessage(message);
          setOverlay("info");
        }
      });
    };
    const onCoreMuted = (muted) => {
      setIsMuted(muted);
    };
    const stats = {
      terminal: {
        renders: 0
      }
    };
    const onCoreEnded = (_ref3) => {
      let {
        message
      } = _ref3;
      batch(() => {
        setIsPlaying(false);
        onStopped();
        if (message !== void 0) {
          setInfoMessage(message);
          setOverlay("info");
        }
      });
      logger.debug("stats", stats.terminal);
    };
    const onCoreErrored = () => {
      setOverlay("error");
    };
    const onCoreSeeked = () => {
      updateTime();
    };
    core.addEventListener("ready", onCoreReady);
    core.addEventListener("metadata", onCoreMetadata);
    core.addEventListener("play", onCorePlay);
    core.addEventListener("playing", onCorePlaying);
    core.addEventListener("idle", onCoreIdle);
    core.addEventListener("loading", onCoreLoading);
    core.addEventListener("offline", onCoreOffline);
    core.addEventListener("muted", onCoreMuted);
    core.addEventListener("ended", onCoreEnded);
    core.addEventListener("errored", onCoreErrored);
    core.addEventListener("seeked", onCoreSeeked);
    const setupResizeObserver = () => {
      resizeObserver = new ResizeObserver(debounce((_entries) => {
        setState({
          containerW: wrapperRef.offsetWidth,
          containerH: wrapperRef.offsetHeight
        });
        wrapperRef.dispatchEvent(new CustomEvent("resize", {
          detail: {
            el: playerRef
          }
        }));
      }, 10));
      resizeObserver.observe(wrapperRef);
    };
    onMount(async () => {
      logger.info("view: mounted");
      logger.debug("view: font measurements", {
        charW,
        charH
      });
      setupResizeObserver();
      setState({
        containerW: wrapperRef.offsetWidth,
        containerH: wrapperRef.offsetHeight
      });
    });
    onCleanup(() => {
      core.removeEventListener("ready", onCoreReady);
      core.removeEventListener("metadata", onCoreMetadata);
      core.removeEventListener("play", onCorePlay);
      core.removeEventListener("playing", onCorePlaying);
      core.removeEventListener("idle", onCoreIdle);
      core.removeEventListener("loading", onCoreLoading);
      core.removeEventListener("offline", onCoreOffline);
      core.removeEventListener("muted", onCoreMuted);
      core.removeEventListener("ended", onCoreEnded);
      core.removeEventListener("errored", onCoreErrored);
      core.removeEventListener("seeked", onCoreSeeked);
      core.stop();
      stopTimeUpdates();
      resizeObserver.disconnect();
    });
    const terminalElementSize = createMemo(() => {
      const terminalW = charW * terminalCols() + bordersW;
      const terminalH = charH * terminalRows() + bordersH;
      let fit = props.fit ?? "width";
      if (fit === "both" || state.isFullscreen) {
        const containerRatio = state.containerW / (state.containerH - controlBarHeight());
        const terminalRatio = terminalW / terminalH;
        if (containerRatio > terminalRatio) {
          fit = "height";
        } else {
          fit = "width";
        }
      }
      if (fit === false || fit === "none") {
        return {};
      } else if (fit === "width") {
        const scale = state.containerW / terminalW;
        return {
          scale,
          width: state.containerW,
          height: terminalH * scale + controlBarHeight()
        };
      } else if (fit === "height") {
        const scale = (state.containerH - controlBarHeight()) / terminalH;
        return {
          scale,
          width: terminalW * scale,
          height: state.containerH
        };
      } else {
        throw new Error(`unsupported fit mode: ${fit}`);
      }
    });
    const onFullscreenChange = () => {
      setState("isFullscreen", document.fullscreenElement ?? document.webkitFullscreenElement);
    };
    const toggleFullscreen = () => {
      if (state.isFullscreen) {
        (document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => {
        })).apply(document);
      } else {
        (wrapperRef.requestFullscreen ?? wrapperRef.webkitRequestFullscreen ?? (() => {
        })).apply(wrapperRef);
      }
    };
    const toggleHelp = () => {
      if (isHelpVisible()) {
        setIsHelpVisible(false);
      } else {
        core.pause();
        setIsHelpVisible(true);
      }
    };
    const onKeyDown = (e) => {
      if (e.altKey || e.metaKey || e.ctrlKey) {
        return;
      }
      if (e.key == " ") {
        core.togglePlay();
      } else if (e.key == ",") {
        core.step(-1).then(updateTime);
      } else if (e.key == ".") {
        core.step().then(updateTime);
      } else if (e.key == "f") {
        toggleFullscreen();
      } else if (e.key == "m") {
        toggleMuted();
      } else if (e.key == "[") {
        core.seek({
          marker: "prev"
        });
      } else if (e.key == "]") {
        core.seek({
          marker: "next"
        });
      } else if (e.key.charCodeAt(0) >= 48 && e.key.charCodeAt(0) <= 57) {
        const pos = (e.key.charCodeAt(0) - 48) / 10;
        core.seek(`${pos * 100}%`);
      } else if (e.key == "?") {
        toggleHelp();
      } else if (e.key == "ArrowLeft") {
        if (e.shiftKey) {
          core.seek("<<<");
        } else {
          core.seek("<<");
        }
      } else if (e.key == "ArrowRight") {
        if (e.shiftKey) {
          core.seek(">>>");
        } else {
          core.seek(">>");
        }
      } else if (e.key == "Escape") {
        setIsHelpVisible(false);
      } else {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
    };
    const wrapperOnMouseMove = () => {
      if (state.isFullscreen) {
        onUserActive(true);
      }
    };
    const playerOnMouseLeave = () => {
      if (!state.isFullscreen) {
        onUserActive(false);
      }
    };
    const startTimeUpdates = () => {
      timeUpdateIntervalId = setInterval(updateTime, 100);
    };
    const stopTimeUpdates = () => {
      clearInterval(timeUpdateIntervalId);
    };
    const updateTime = async () => {
      const currentTime = await core.getCurrentTime();
      const remainingTime = await core.getRemainingTime();
      const progress = await core.getProgress();
      setState({
        currentTime,
        remainingTime,
        progress
      });
    };
    const onUserActive = (show) => {
      clearTimeout(userActivityTimeoutId);
      if (show) {
        userActivityTimeoutId = setTimeout(() => onUserActive(false), 2e3);
      }
      setUserActive(show);
    };
    const embeddedTheme = createMemo(() => preferEmbeddedTheme ? originalTheme() : null);
    const playerStyle = () => {
      const style2 = {};
      if ((props.fit === false || props.fit === "none") && props.terminalFontSize !== void 0) {
        if (props.terminalFontSize === "small") {
          style2["font-size"] = "12px";
        } else if (props.terminalFontSize === "medium") {
          style2["font-size"] = "18px";
        } else if (props.terminalFontSize === "big") {
          style2["font-size"] = "24px";
        } else {
          style2["font-size"] = props.terminalFontSize;
        }
      }
      const size = terminalElementSize();
      if (size.width !== void 0) {
        style2["width"] = `${size.width}px`;
        style2["height"] = `${size.height}px`;
      }
      if (props.terminalFontFamily !== void 0) {
        style2["--term-font-family"] = props.terminalFontFamily;
      }
      const themeColors = embeddedTheme();
      if (themeColors) {
        style2["--term-color-foreground"] = themeColors.foreground;
        style2["--term-color-background"] = themeColors.background;
      }
      return style2;
    };
    const play = () => {
      coreReady.then(() => core.play());
    };
    const togglePlay = () => {
      coreReady.then(() => core.togglePlay());
    };
    const toggleMuted = () => {
      coreReady.then(() => {
        if (isMuted() === true) {
          core.unmute();
        } else {
          core.mute();
        }
      });
    };
    const seek = (pos) => {
      coreReady.then(() => core.seek(pos));
    };
    const playerClass = () => `ap-player ap-default-term-ff asciinema-player-theme-${themeName}`;
    const terminalScale = () => terminalElementSize()?.scale;
    const el = (() => {
      const _el$ = _tmpl$.cloneNode(true), _el$2 = _el$.firstChild;
      const _ref$ = wrapperRef;
      typeof _ref$ === "function" ? use(_ref$, _el$) : wrapperRef = _el$;
      _el$.addEventListener("webkitfullscreenchange", onFullscreenChange);
      _el$.addEventListener("fullscreenchange", onFullscreenChange);
      _el$.$$mousemove = wrapperOnMouseMove;
      _el$.$$keydown = onKeyDown;
      const _ref$2 = playerRef;
      typeof _ref$2 === "function" ? use(_ref$2, _el$2) : playerRef = _el$2;
      _el$2.$$mousemove = () => onUserActive(true);
      _el$2.addEventListener("mouseleave", playerOnMouseLeave);
      insert(_el$2, createComponent(Terminal, {
        get cols() {
          return terminalCols();
        },
        get rows() {
          return terminalRows();
        },
        get scale() {
          return terminalScale();
        },
        get blinking() {
          return blinking();
        },
        get lineHeight() {
          return props.terminalLineHeight;
        },
        preferEmbeddedTheme,
        core,
        get stats() {
          return stats.terminal;
        }
      }), null);
      insert(_el$2, createComponent(Show, {
        get when() {
          return props.controls !== false;
        },
        get children() {
          return createComponent(ControlBar, {
            get duration() {
              return duration();
            },
            get currentTime() {
              return state.currentTime;
            },
            get remainingTime() {
              return state.remainingTime;
            },
            get progress() {
              return state.progress;
            },
            markers,
            get isPlaying() {
              return isPlaying() || overlay() == "loader";
            },
            get isPausable() {
              return state.isPausable;
            },
            get isSeekable() {
              return state.isSeekable;
            },
            get isMuted() {
              return isMuted();
            },
            onPlayClick: togglePlay,
            onFullscreenClick: toggleFullscreen,
            onHelpClick: toggleHelp,
            onSeekClick: seek,
            onMuteClick: toggleMuted,
            ref(r$) {
              const _ref$3 = controlBarRef;
              typeof _ref$3 === "function" ? _ref$3(r$) : controlBarRef = r$;
            }
          });
        }
      }), null);
      insert(_el$2, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return overlay() == "start";
            },
            get children() {
              return createComponent(StartOverlay, {
                onClick: play
              });
            }
          }), createComponent(Match, {
            get when() {
              return overlay() == "loader";
            },
            get children() {
              return createComponent(LoaderOverlay, {});
            }
          }), createComponent(Match, {
            get when() {
              return overlay() == "error";
            },
            get children() {
              return createComponent(ErrorOverlay, {});
            }
          })];
        }
      }), null);
      insert(_el$2, createComponent(Transition, {
        name: "slide",
        get children() {
          return createComponent(Show, {
            get when() {
              return overlay() == "info";
            },
            get children() {
              return createComponent(InfoOverlay, {
                get message() {
                  return infoMessage();
                },
                get wasPlaying() {
                  return wasPlaying();
                }
              });
            }
          });
        }
      }), null);
      insert(_el$2, createComponent(Show, {
        get when() {
          return isHelpVisible();
        },
        get children() {
          return createComponent(HelpOverlay, {
            onClose: () => setIsHelpVisible(false),
            get isPausable() {
              return state.isPausable;
            },
            get isSeekable() {
              return state.isSeekable;
            },
            get hasAudio() {
              return isMuted() !== void 0;
            }
          });
        }
      }), null);
      createRenderEffect((_p$) => {
        const _v$ = !!controlsVisible(), _v$2 = playerClass(), _v$3 = playerStyle();
        _v$ !== _p$._v$ && _el$.classList.toggle("ap-hud", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$2, _p$._v$2 = _v$2);
        _p$._v$3 = style(_el$2, _v$3, _p$._v$3);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0
      });
      return _el$;
    })();
    return el;
  });
  delegateEvents(["keydown", "mousemove"]);
  function mount(core, elem) {
    let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const metrics = measureTerminal(opts.terminalFontFamily, opts.terminalLineHeight);
    const props = {
      core,
      logger: opts.logger,
      cols: opts.cols,
      rows: opts.rows,
      fit: opts.fit,
      controls: opts.controls,
      autoPlay: opts.autoPlay,
      terminalFontSize: opts.terminalFontSize,
      terminalFontFamily: opts.terminalFontFamily,
      terminalLineHeight: opts.terminalLineHeight,
      theme: opts.theme,
      ...metrics
    };
    let el;
    const dispose2 = render(() => {
      el = createComponent(Player, props);
      return el;
    }, elem);
    return {
      el,
      dispose: dispose2
    };
  }
  function measureTerminal(fontFamily, lineHeight) {
    const cols = 80;
    const rows = 24;
    const playerDiv = document.createElement("div");
    playerDiv.className = "ap-default-term-ff";
    playerDiv.style.height = "0px";
    playerDiv.style.overflow = "hidden";
    playerDiv.style.fontSize = "15px";
    if (fontFamily !== void 0) {
      playerDiv.style.setProperty("--term-font-family", fontFamily);
    }
    const termDiv = document.createElement("div");
    termDiv.className = "ap-term";
    termDiv.style.width = `${cols}ch`;
    termDiv.style.height = `${rows * (lineHeight ?? 1.3333333333)}em`;
    termDiv.style.fontSize = "100%";
    playerDiv.appendChild(termDiv);
    document.body.appendChild(playerDiv);
    const metrics = {
      charW: termDiv.clientWidth / cols,
      charH: termDiv.clientHeight / rows,
      bordersW: termDiv.offsetWidth - termDiv.clientWidth,
      bordersH: termDiv.offsetHeight - termDiv.clientHeight
    };
    document.body.removeChild(playerDiv);
    return metrics;
  }
  var CORE_OPTS = ["audioUrl", "autoPlay", "autoplay", "boldIsBright", "cols", "idleTimeLimit", "loop", "markers", "pauseOnMarkers", "poster", "preload", "rows", "speed", "startAt"];
  var UI_OPTS = ["autoPlay", "autoplay", "cols", "controls", "fit", "rows", "terminalFontFamily", "terminalFontSize", "terminalLineHeight", "theme"];
  function coreOpts(inputOpts) {
    let overrides = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const opts = Object.fromEntries(Object.entries(inputOpts).filter((_ref) => {
      let [key] = _ref;
      return CORE_OPTS.includes(key);
    }));
    opts.autoPlay ??= opts.autoplay;
    opts.speed ??= 1;
    return {
      ...opts,
      ...overrides
    };
  }
  function uiOpts(inputOpts) {
    let overrides = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const opts = Object.fromEntries(Object.entries(inputOpts).filter((_ref2) => {
      let [key] = _ref2;
      return UI_OPTS.includes(key);
    }));
    opts.autoPlay ??= opts.autoplay;
    opts.controls ??= "auto";
    return {
      ...opts,
      ...overrides
    };
  }

  // node_modules/asciinema-player/dist/index.js
  function create2(src, elem) {
    let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const logger = opts.logger ?? new DummyLogger();
    const core = new Core(src, coreOpts(opts, {
      logger
    }));
    const {
      el,
      dispose: dispose2
    } = mount(core, elem, uiOpts(opts, {
      logger
    }));
    const ready = core.init();
    const player = {
      el,
      dispose: dispose2,
      getCurrentTime: () => ready.then(core.getCurrentTime.bind(core)),
      getDuration: () => ready.then(core.getDuration.bind(core)),
      play: () => ready.then(core.play.bind(core)),
      pause: () => ready.then(core.pause.bind(core)),
      seek: (pos) => ready.then(() => core.seek(pos))
    };
    player.addEventListener = (name, callback) => {
      return core.addEventListener(name, callback.bind(player));
    };
    return player;
  }

  // node_modules/asciinema-player/dist/bundle/asciinema-player.css
  var asciinema_player_default = '.ap-default-term-ff {\n  --term-font-family: "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace, "Symbols Nerd Font";\n}\ndiv.ap-wrapper {\n  outline: none;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n}\ndiv.ap-wrapper .title-bar {\n  display: none;\n  top: -78px;\n  transition: top 0.15s linear;\n  position: absolute;\n  left: 0;\n  right: 0;\n  box-sizing: content-box;\n  font-size: 20px;\n  line-height: 1em;\n  padding: 15px;\n  font-family: sans-serif;\n  color: white;\n  background-color: rgba(0, 0, 0, 0.8);\n}\ndiv.ap-wrapper .title-bar img {\n  vertical-align: middle;\n  height: 48px;\n  margin-right: 16px;\n}\ndiv.ap-wrapper .title-bar a {\n  color: white;\n  text-decoration: underline;\n}\ndiv.ap-wrapper .title-bar a:hover {\n  text-decoration: none;\n}\ndiv.ap-wrapper:fullscreen {\n  background-color: #000;\n  width: 100%;\n  align-items: center;\n}\ndiv.ap-wrapper:fullscreen .title-bar {\n  display: initial;\n}\ndiv.ap-wrapper:fullscreen.hud .title-bar {\n  top: 0;\n}\ndiv.ap-wrapper div.ap-player {\n  text-align: left;\n  display: inline-block;\n  padding: 0px;\n  position: relative;\n  box-sizing: content-box;\n  overflow: hidden;\n  max-width: 100%;\n  border-radius: 4px;\n  font-size: 15px;\n  background-color: var(--term-color-background);\n}\n.ap-player {\n  --term-color-foreground: #ffffff;\n  --term-color-background: #000000;\n  --term-color-0: var(--term-color-foreground);\n  --term-color-1: var(--term-color-foreground);\n  --term-color-2: var(--term-color-foreground);\n  --term-color-3: var(--term-color-foreground);\n  --term-color-4: var(--term-color-foreground);\n  --term-color-5: var(--term-color-foreground);\n  --term-color-6: var(--term-color-foreground);\n  --term-color-7: var(--term-color-foreground);\n  --term-color-8: var(--term-color-0);\n  --term-color-9: var(--term-color-1);\n  --term-color-10: var(--term-color-2);\n  --term-color-11: var(--term-color-3);\n  --term-color-12: var(--term-color-4);\n  --term-color-13: var(--term-color-5);\n  --term-color-14: var(--term-color-6);\n  --term-color-15: var(--term-color-7);\n}\ndiv.ap-term {\n  position: relative;\n  font-family: var(--term-font-family);\n  border-width: 0.75em;\n  border-radius: 0;\n  border-style: solid;\n  border-color: var(--term-color-background);\n  box-sizing: content-box;\n}\ndiv.ap-term canvas {\n  position: absolute;\n  inset: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\ndiv.ap-term svg.ap-term-symbols {\n  position: absolute;\n  inset: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  pointer-events: none;\n}\ndiv.ap-term svg.ap-term-symbols use {\n  color: var(--term-color-foreground);\n}\ndiv.ap-term svg.ap-term-symbols:not(.ap-blink) .ap-blink {\n  opacity: 0;\n}\ndiv.ap-term pre.ap-term-text {\n  position: absolute;\n  inset: 0;\n  box-sizing: content-box;\n  overflow: hidden;\n  padding: 0;\n  margin: 0px;\n  display: block;\n  white-space: pre;\n  word-wrap: normal;\n  word-break: normal;\n  cursor: text;\n  color: var(--term-color-foreground);\n  outline: none;\n  line-height: var(--term-line-height);\n  font-family: inherit;\n  font-size: inherit;\n  font-variant-ligatures: none;\n  border: 0;\n  border-radius: 0;\n  background-color: transparent !important;\n}\npre.ap-term-text .ap-line {\n  display: block;\n  width: 100%;\n  height: var(--term-line-height);\n  position: absolute;\n  top: calc(100% * var(--row) / var(--term-rows));\n  letter-spacing: normal;\n  overflow: hidden;\n}\npre.ap-term-text .ap-line span {\n  position: absolute;\n  left: calc(100% * var(--offset) / var(--term-cols));\n  padding: 0;\n  display: inline-block;\n  height: 100%;\n}\npre.ap-term-text:not(.ap-blink) .ap-line .ap-blink {\n  color: transparent;\n  border-color: transparent;\n}\npre.ap-term-text .ap-bold {\n  font-weight: bold;\n}\npre.ap-term-text .ap-faint {\n  opacity: 0.5;\n}\npre.ap-term-text .ap-underline {\n  text-decoration: underline;\n}\npre.ap-term-text .ap-italic {\n  font-style: italic;\n}\npre.ap-term-text .ap-strike {\n  text-decoration: line-through;\n}\n.ap-line span {\n  color: var(--term-color-foreground);\n}\ndiv.ap-player div.ap-control-bar {\n  width: 100%;\n  height: 32px;\n  display: flex;\n  justify-content: space-between;\n  align-items: stretch;\n  color: var(--term-color-foreground);\n  box-sizing: content-box;\n  line-height: 1;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  opacity: 0;\n  transition: opacity 0.15s linear;\n  user-select: none;\n  border-top: 2px solid color-mix(in oklab, var(--term-color-background) 80%, var(--term-color-foreground));\n  z-index: 30;\n}\ndiv.ap-player div.ap-control-bar * {\n  box-sizing: inherit;\n}\ndiv.ap-control-bar svg.ap-icon path {\n  fill: var(--term-color-foreground);\n}\ndiv.ap-control-bar span.ap-button {\n  display: flex;\n  flex: 0 0 auto;\n  cursor: pointer;\n}\ndiv.ap-control-bar span.ap-playback-button {\n  width: 12px;\n  height: 12px;\n  padding: 10px;\n  margin: 0 0 0 2px;\n}\ndiv.ap-control-bar span.ap-playback-button svg {\n  height: 12px;\n  width: 12px;\n}\ndiv.ap-control-bar span.ap-timer {\n  display: flex;\n  flex: 0 0 auto;\n  min-width: 50px;\n  margin: 0 10px;\n  height: 100%;\n  text-align: center;\n  font-size: 13px;\n  line-height: 100%;\n  cursor: default;\n}\ndiv.ap-control-bar span.ap-timer span {\n  font-family: var(--term-font-family);\n  font-size: inherit;\n  font-weight: 600;\n  margin: auto;\n}\ndiv.ap-control-bar span.ap-timer .ap-time-remaining {\n  display: none;\n}\ndiv.ap-control-bar span.ap-timer:hover .ap-time-elapsed {\n  display: none;\n}\ndiv.ap-control-bar span.ap-timer:hover .ap-time-remaining {\n  display: flex;\n}\ndiv.ap-control-bar .ap-progressbar {\n  display: block;\n  flex: 1 1 auto;\n  height: 100%;\n  padding: 0 10px;\n}\ndiv.ap-control-bar .ap-progressbar .ap-bar {\n  display: block;\n  position: relative;\n  cursor: default;\n  height: 100%;\n  font-size: 0;\n}\ndiv.ap-control-bar .ap-progressbar .ap-bar .ap-gutter {\n  display: block;\n  position: absolute;\n  top: 15px;\n  left: 0;\n  right: 0;\n  height: 3px;\n}\ndiv.ap-control-bar .ap-progressbar .ap-bar .ap-gutter-empty {\n  background-color: color-mix(in oklab, var(--term-color-foreground) 20%, var(--term-color-background));\n}\ndiv.ap-control-bar .ap-progressbar .ap-bar .ap-gutter-full {\n  width: 100%;\n  transform-origin: left center;\n  background-color: var(--term-color-foreground);\n  border-radius: 3px;\n}\ndiv.ap-control-bar.ap-seekable .ap-progressbar .ap-bar {\n  cursor: pointer;\n}\ndiv.ap-control-bar .ap-fullscreen-button {\n  width: 14px;\n  height: 14px;\n  padding: 9px;\n  margin: 0 2px 0 4px;\n}\ndiv.ap-control-bar .ap-fullscreen-button svg {\n  width: 14px;\n  height: 14px;\n}\ndiv.ap-control-bar .ap-fullscreen-button svg.ap-icon-fullscreen-on {\n  display: inline;\n}\ndiv.ap-control-bar .ap-fullscreen-button svg.ap-icon-fullscreen-off {\n  display: none;\n}\ndiv.ap-control-bar .ap-fullscreen-button .ap-tooltip {\n  right: 5px;\n  left: initial;\n  transform: none;\n}\ndiv.ap-control-bar .ap-kbd-button {\n  height: 14px;\n  padding: 9px;\n  margin: 0 0 0 4px;\n}\ndiv.ap-control-bar .ap-kbd-button svg {\n  width: 26px;\n  height: 14px;\n}\ndiv.ap-control-bar .ap-kbd-button .ap-tooltip {\n  right: 5px;\n  left: initial;\n  transform: none;\n}\ndiv.ap-control-bar .ap-speaker-button {\n  width: 19px;\n  padding: 6px 9px;\n  margin: 0 0 0 4px;\n  position: relative;\n}\ndiv.ap-control-bar .ap-speaker-button svg {\n  width: 19px;\n}\ndiv.ap-control-bar .ap-speaker-button .ap-tooltip {\n  left: -50%;\n  transform: none;\n}\ndiv.ap-wrapper.ap-hud .ap-control-bar {\n  opacity: 1;\n}\ndiv.ap-wrapper:fullscreen .ap-fullscreen-button svg.ap-icon-fullscreen-on {\n  display: none;\n}\ndiv.ap-wrapper:fullscreen .ap-fullscreen-button svg.ap-icon-fullscreen-off {\n  display: inline;\n}\nspan.ap-progressbar span.ap-marker-container {\n  display: block;\n  top: 0;\n  bottom: 0;\n  width: 21px;\n  position: absolute;\n  margin-left: -10px;\n}\nspan.ap-marker-container span.ap-marker {\n  display: block;\n  top: 13px;\n  bottom: 12px;\n  left: 7px;\n  right: 7px;\n  background-color: color-mix(in oklab, var(--term-color-foreground) 33%, var(--term-color-background));\n  position: absolute;\n  transition: top 0.1s, bottom 0.1s, left 0.1s, right 0.1s, background-color 0.1s;\n  border-radius: 50%;\n}\nspan.ap-marker-container span.ap-marker.ap-marker-past {\n  background-color: var(--term-color-foreground);\n}\nspan.ap-marker-container span.ap-marker:hover,\nspan.ap-marker-container:hover span.ap-marker {\n  background-color: var(--term-color-foreground);\n  top: 11px;\n  bottom: 10px;\n  left: 5px;\n  right: 5px;\n}\n.ap-tooltip-container span.ap-tooltip {\n  visibility: hidden;\n  background-color: var(--term-color-foreground);\n  color: var(--term-color-background);\n  font-family: var(--term-font-family);\n  font-weight: bold;\n  text-align: center;\n  padding: 0 0.5em;\n  border-radius: 4px;\n  position: absolute;\n  z-index: 1;\n  white-space: nowrap;\n  /* Prevents the text from wrapping and makes sure the tooltip width adapts to the text length */\n  font-size: 13px;\n  line-height: 2em;\n  bottom: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.ap-tooltip-container:hover span.ap-tooltip {\n  visibility: visible;\n}\n.ap-player .ap-overlay {\n  z-index: 10;\n  background-repeat: no-repeat;\n  background-position: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.ap-player .ap-overlay-start {\n  cursor: pointer;\n}\n.ap-player .ap-overlay-start .ap-play-button {\n  font-size: 0px;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  text-align: center;\n  color: white;\n  height: 80px;\n  max-height: 66%;\n  margin: auto;\n}\n.ap-player .ap-overlay-start .ap-play-button div {\n  height: 100%;\n}\n.ap-player .ap-overlay-start .ap-play-button div span {\n  height: 100%;\n  display: block;\n}\n.ap-player .ap-overlay-start .ap-play-button div span svg {\n  height: 100%;\n  display: inline-block;\n}\n.ap-player .ap-overlay-start .ap-play-button svg {\n  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.4));\n}\n.ap-player .ap-overlay-loading .ap-loader {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  display: inline-block;\n  position: relative;\n  border: 10px solid;\n  border-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.7) #ffffff;\n  border-color: color-mix(in srgb, var(--term-color-foreground) 30%, var(--term-color-background)) color-mix(in srgb, var(--term-color-foreground) 50%, var(--term-color-background)) color-mix(in srgb, var(--term-color-foreground) 70%, var(--term-color-background)) color-mix(in srgb, var(--term-color-foreground) 100%, var(--term-color-background));\n  box-sizing: border-box;\n  animation: ap-loader-rotation 1s linear infinite;\n}\n.ap-player .ap-overlay-info {\n  background-color: var(--term-color-background);\n}\n.ap-player .ap-overlay-info span {\n  font-family: var(--term-font-family);\n  font-size: 2em;\n  font-weight: bold;\n  color: var(--term-color-background);\n  background-color: var(--term-color-foreground);\n  padding: 0.5em 0.75em;\n  text-transform: uppercase;\n}\n.ap-player .ap-overlay-help {\n  background-color: rgba(0, 0, 0, 0.8);\n  container-type: inline-size;\n}\n.ap-player .ap-overlay-help > div {\n  font-family: var(--term-font-family);\n  max-width: 85%;\n  max-height: 85%;\n  font-size: 18px;\n  color: var(--term-color-foreground);\n  box-sizing: border-box;\n  margin-bottom: 32px;\n}\n.ap-player .ap-overlay-help > div div {\n  padding: calc(min(4cqw, 40px));\n  font-size: calc(min(1.9cqw, 18px));\n  background-color: var(--term-color-background);\n  border: 1px solid color-mix(in oklab, var(--term-color-background) 90%, var(--term-color-foreground));\n  border-radius: 6px;\n}\n.ap-player .ap-overlay-help > div div p {\n  font-weight: bold;\n  margin: 0 0 2em 0;\n}\n.ap-player .ap-overlay-help > div div ul {\n  list-style: none;\n  padding: 0;\n}\n.ap-player .ap-overlay-help > div div ul li {\n  margin: 0 0 0.75em 0;\n}\n.ap-player .ap-overlay-help > div div kbd {\n  color: var(--term-color-background);\n  background-color: var(--term-color-foreground);\n  padding: 0.2em 0.5em;\n  border-radius: 0.2em;\n  font-family: inherit;\n  font-size: 0.85em;\n  border: none;\n  margin: 0;\n}\n.ap-player .ap-overlay-error span {\n  font-size: 8em;\n}\n.ap-player .slide-enter-active {\n  transition: opacity 0.2s;\n}\n.ap-player .slide-enter-active.ap-was-playing {\n  transition: top 0.2s ease-out, opacity 0.2s;\n}\n.ap-player .slide-exit-active {\n  transition: top 0.2s ease-in, opacity 0.2s;\n}\n.ap-player .slide-enter {\n  top: -50%;\n  opacity: 0;\n}\n.ap-player .slide-enter-to {\n  top: 0%;\n}\n.ap-player .slide-enter,\n.ap-player .slide-enter-to,\n.ap-player .slide-exit,\n.ap-player .slide-exit-to {\n  bottom: auto;\n  height: 100%;\n}\n.ap-player .slide-exit {\n  top: 0%;\n}\n.ap-player .slide-exit-to {\n  top: -50%;\n  opacity: 0;\n}\n@keyframes ap-loader-rotation {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.asciinema-player-theme-asciinema {\n  --term-color-foreground: #cccccc;\n  --term-color-background: #121314;\n  --term-color-0: #000000;\n  --term-color-1: #dd3c69;\n  --term-color-2: #4ebf22;\n  --term-color-3: #ddaf3c;\n  --term-color-4: #26b0d7;\n  --term-color-5: #b954e1;\n  --term-color-6: #54e1b9;\n  --term-color-7: #d9d9d9;\n  --term-color-8: #4d4d4d;\n  --term-color-9: #dd3c69;\n  --term-color-10: #4ebf22;\n  --term-color-11: #ddaf3c;\n  --term-color-12: #26b0d7;\n  --term-color-13: #b954e1;\n  --term-color-14: #54e1b9;\n  --term-color-15: #ffffff;\n}\n/*\n  Based on Dracula: https://draculatheme.com\n */\n.asciinema-player-theme-dracula {\n  --term-color-foreground: #f8f8f2;\n  --term-color-background: #282a36;\n  --term-color-0: #21222c;\n  --term-color-1: #ff5555;\n  --term-color-2: #50fa7b;\n  --term-color-3: #f1fa8c;\n  --term-color-4: #bd93f9;\n  --term-color-5: #ff79c6;\n  --term-color-6: #8be9fd;\n  --term-color-7: #f8f8f2;\n  --term-color-8: #6272a4;\n  --term-color-9: #ff6e6e;\n  --term-color-10: #69ff94;\n  --term-color-11: #ffffa5;\n  --term-color-12: #d6acff;\n  --term-color-13: #ff92df;\n  --term-color-14: #a4ffff;\n  --term-color-15: #ffffff;\n}\n/* Based on Monokai from base16 collection - https://github.com/chriskempson/base16 */\n.asciinema-player-theme-monokai {\n  --term-color-foreground: #f8f8f2;\n  --term-color-background: #272822;\n  --term-color-0: #272822;\n  --term-color-1: #f92672;\n  --term-color-2: #a6e22e;\n  --term-color-3: #f4bf75;\n  --term-color-4: #66d9ef;\n  --term-color-5: #ae81ff;\n  --term-color-6: #a1efe4;\n  --term-color-7: #f8f8f2;\n  --term-color-8: #75715e;\n  --term-color-15: #f9f8f5;\n}\n/*\n  Based on Nord: https://github.com/arcticicestudio/nord\n  Via: https://github.com/neilotoole/asciinema-theme-nord\n */\n.asciinema-player-theme-nord {\n  --term-color-foreground: #eceff4;\n  --term-color-background: #2e3440;\n  --term-color-0: #3b4252;\n  --term-color-1: #bf616a;\n  --term-color-2: #a3be8c;\n  --term-color-3: #ebcb8b;\n  --term-color-4: #81a1c1;\n  --term-color-5: #b48ead;\n  --term-color-6: #88c0d0;\n  --term-color-7: #eceff4;\n}\n.asciinema-player-theme-seti {\n  --term-color-foreground: #cacecd;\n  --term-color-background: #111213;\n  --term-color-0: #323232;\n  --term-color-1: #c22832;\n  --term-color-2: #8ec43d;\n  --term-color-3: #e0c64f;\n  --term-color-4: #43a5d5;\n  --term-color-5: #8b57b5;\n  --term-color-6: #8ec43d;\n  --term-color-7: #eeeeee;\n  --term-color-15: #ffffff;\n}\n/*\n  Based on Solarized Dark: https://ethanschoonover.com/solarized/\n */\n.asciinema-player-theme-solarized-dark {\n  --term-color-foreground: #839496;\n  --term-color-background: #002b36;\n  --term-color-0: #073642;\n  --term-color-1: #dc322f;\n  --term-color-2: #859900;\n  --term-color-3: #b58900;\n  --term-color-4: #268bd2;\n  --term-color-5: #d33682;\n  --term-color-6: #2aa198;\n  --term-color-7: #eee8d5;\n  --term-color-8: #002b36;\n  --term-color-9: #cb4b16;\n  --term-color-10: #586e75;\n  --term-color-11: #657b83;\n  --term-color-12: #839496;\n  --term-color-13: #6c71c4;\n  --term-color-14: #93a1a1;\n  --term-color-15: #fdf6e3;\n}\n/*\n  Based on Solarized Light: https://ethanschoonover.com/solarized/\n */\n.asciinema-player-theme-solarized-light {\n  --term-color-foreground: #657b83;\n  --term-color-background: #fdf6e3;\n  --term-color-0: #073642;\n  --term-color-1: #dc322f;\n  --term-color-2: #859900;\n  --term-color-3: #b58900;\n  --term-color-4: #268bd2;\n  --term-color-5: #d33682;\n  --term-color-6: #2aa198;\n  --term-color-7: #eee8d5;\n  --term-color-8: #002b36;\n  --term-color-9: #cb4b16;\n  --term-color-10: #586e75;\n  --term-color-11: #657c83;\n  --term-color-12: #839496;\n  --term-color-13: #6c71c4;\n  --term-color-14: #93a1a1;\n  --term-color-15: #fdf6e3;\n}\n.asciinema-player-theme-solarized-light .ap-overlay-start .ap-play-button svg .ap-play-btn-fill {\n  fill: var(--term-color-1);\n}\n.asciinema-player-theme-solarized-light .ap-overlay-start .ap-play-button svg .ap-play-btn-stroke {\n  stroke: var(--term-color-1);\n}\n/*\n  Based on Tango: https://en.wikipedia.org/wiki/Tango_Desktop_Project\n */\n.asciinema-player-theme-tango {\n  --term-color-foreground: #cccccc;\n  --term-color-background: #121314;\n  --term-color-0: #000000;\n  --term-color-1: #cc0000;\n  --term-color-2: #4e9a06;\n  --term-color-3: #c4a000;\n  --term-color-4: #3465a4;\n  --term-color-5: #75507b;\n  --term-color-6: #06989a;\n  --term-color-7: #d3d7cf;\n  --term-color-8: #555753;\n  --term-color-9: #ef2929;\n  --term-color-10: #8ae234;\n  --term-color-11: #fce94f;\n  --term-color-12: #729fcf;\n  --term-color-13: #ad7fa8;\n  --term-color-14: #34e2e2;\n  --term-color-15: #eeeeec;\n}\n/*\n  Based on gruvbox: https://github.com/morhetz/gruvbox\n */\n.asciinema-player-theme-gruvbox-dark {\n  --term-color-foreground: #fbf1c7;\n  --term-color-background: #282828;\n  --term-color-0: #282828;\n  --term-color-1: #cc241d;\n  --term-color-2: #98971a;\n  --term-color-3: #d79921;\n  --term-color-4: #458588;\n  --term-color-5: #b16286;\n  --term-color-6: #689d6a;\n  --term-color-7: #a89984;\n  --term-color-8: #7c6f65;\n  --term-color-9: #fb4934;\n  --term-color-10: #b8bb26;\n  --term-color-11: #fabd2f;\n  --term-color-12: #83a598;\n  --term-color-13: #d3869b;\n  --term-color-14: #8ec07c;\n  --term-color-15: #fbf1c7;\n}\n';

  // js/asciinema_player.js
  var themeCss = `
.asciinema-player-theme-runcom-light {
  --term-color-foreground: #1F2328;
  --term-color-background: #ffffff;
  --term-color-0: #24292f;
  --term-color-1: #cf222e;
  --term-color-2: #116329;
  --term-color-3: #4d2d00;
  --term-color-4: #0969da;
  --term-color-5: #8250df;
  --term-color-6: #1b7c83;
  --term-color-7: #6e7781;
  --term-color-8: #57606a;
  --term-color-9: #a40e26;
  --term-color-10: #1a7f37;
  --term-color-11: #633c01;
  --term-color-12: #218bff;
  --term-color-13: #8250df;
  --term-color-14: #1b7c83;
  --term-color-15: #6e7781;
}
.asciinema-player-theme-runcom-dark {
  --term-color-foreground: #e6edf3;
  --term-color-background: #0d1117;
  --term-color-0: #484f58;
  --term-color-1: #ff7b72;
  --term-color-2: #3fb950;
  --term-color-3: #d29922;
  --term-color-4: #58a6ff;
  --term-color-5: #bc8cff;
  --term-color-6: #39c5cf;
  --term-color-7: #b1bac4;
  --term-color-8: #6e7681;
  --term-color-9: #ffa198;
  --term-color-10: #56d364;
  --term-color-11: #e3b341;
  --term-color-12: #79c0ff;
  --term-color-13: #bc8cff;
  --term-color-14: #39c5cf;
  --term-color-15: #b1bac4;
}
`;
  if (!document.querySelector("[data-asciinema-css]")) {
    const style2 = document.createElement("style");
    style2.setAttribute("data-asciinema-css", "");
    style2.textContent = asciinema_player_default + themeCss;
    document.head.appendChild(style2);
  }
  function detectTheme() {
    const html = document.documentElement;
    return html.getAttribute("data-theme") === "dark" ? "runcom-dark" : "runcom-light";
  }
  function mount2(el) {
    const data = el.dataset.cast;
    if (!data) return;
    let player = create2(
      { data },
      el,
      {
        fit: "width",
        terminalFontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
        theme: detectTheme(),
        speed: 4,
        idleTimeLimit: 0.5
      }
    );
    const observer = new MutationObserver(() => {
      const newTheme = detectTheme();
      if (player && player.dispose) player.dispose();
      el.innerHTML = "";
      player = create2(
        { data },
        el,
        {
          fit: "width",
          terminalFontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
          theme: newTheme,
          speed: 4,
          idleTimeLimit: 0.5
        }
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => {
      observer.disconnect();
      if (player && player.dispose) player.dispose();
    };
  }
  window.__runcom_player = { mount: mount2 };
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9hc2NpaW5lbWEtcGxheWVyL2Rpc3QvbG9nZ2luZy0tUDBDc0V1Xy5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL2FzY2lpbmVtYS1wbGF5ZXIvZGlzdC9jb3JlLURuTk9NdFpuLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvYXNjaWluZW1hLXBsYXllci9kaXN0L29wdHMtQnRMeHNNXzYuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9hc2NpaW5lbWEtcGxheWVyL2Rpc3QvaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9hc2NpaW5lbWEtcGxheWVyL2Rpc3QvYnVuZGxlL2FzY2lpbmVtYS1wbGF5ZXIuY3NzIiwgIi4uLy4uL2Fzc2V0cy9qcy9hc2NpaW5lbWFfcGxheWVyLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJmdW5jdGlvbiBwYXJzZU5wdCh0aW1lKSB7XG4gIGlmICh0eXBlb2YgdGltZSA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiB0aW1lO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB0aW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIHRpbWUuc3BsaXQoXCI6XCIpLnJldmVyc2UoKS5tYXAocGFyc2VGbG9hdCkucmVkdWNlKChzdW0sIG4sIGkpID0+IHN1bSArIG4gKiBNYXRoLnBvdyg2MCwgaSkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbmZ1bmN0aW9uIGRlYm91bmNlKGYsIGRlbGF5KSB7XG4gIGxldCB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGYuYXBwbHkodGhpcywgYXJncyksIGRlbGF5KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHRocm90dGxlKGYsIGludGVydmFsKSB7XG4gIGxldCBlbmFibGVDYWxsID0gdHJ1ZTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWVuYWJsZUNhbGwpIHJldHVybjtcbiAgICBlbmFibGVDYWxsID0gZmFsc2U7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuICAgIGYuYXBwbHkodGhpcywgYXJncyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBlbmFibGVDYWxsID0gdHJ1ZSwgaW50ZXJ2YWwpO1xuICB9O1xufVxuXG5jb25zdCBGVUxMX0hFWF9DT0xPUl9SRUdFWCA9IC9eI1swLTlhLWZdezZ9JC87XG5jb25zdCBTSE9SVF9IRVhfQ09MT1JfUkVHRVggPSAvXiNbMC05YS1mXXszfSQvO1xuZnVuY3Rpb24gbm9ybWFsaXplSGV4Q29sb3IoY29sb3IpIHtcbiAgbGV0IGZhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gIGlmICh0eXBlb2YgY29sb3IgIT09IFwic3RyaW5nXCIpIHJldHVybiBmYWxsYmFjaztcbiAgY29uc3Qgbm9ybWFsaXplZCA9IGNvbG9yLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoRlVMTF9IRVhfQ09MT1JfUkVHRVgudGVzdChub3JtYWxpemVkKSkge1xuICAgIHJldHVybiBub3JtYWxpemVkO1xuICB9XG4gIGlmIChTSE9SVF9IRVhfQ09MT1JfUkVHRVgudGVzdChub3JtYWxpemVkKSkge1xuICAgIHJldHVybiBgIyR7bm9ybWFsaXplZFsxXX0ke25vcm1hbGl6ZWRbMV19JHtub3JtYWxpemVkWzJdfSR7bm9ybWFsaXplZFsyXX0ke25vcm1hbGl6ZWRbM119JHtub3JtYWxpemVkWzNdfWA7XG4gIH1cbiAgcmV0dXJuIGZhbGxiYWNrO1xufVxuZnVuY3Rpb24gbGVycE9rbGFiKHQsIGMxLCBjMikge1xuICByZXR1cm4gW2MxWzBdICsgdCAqIChjMlswXSAtIGMxWzBdKSwgYzFbMV0gKyB0ICogKGMyWzFdIC0gYzFbMV0pLCBjMVsyXSArIHQgKiAoYzJbMl0gLSBjMVsyXSldO1xufVxuZnVuY3Rpb24gaGV4VG9Pa2xhYihoZXgpIHtcbiAgY29uc3QgW3IsIGcsIGJdID0gaGV4VG9TcmdiKGhleCkubWFwKHNyZ2JUb0xpbmVhcik7XG4gIGNvbnN0IGwgPSAwLjQxMjIyMTQ3MDggKiByICsgMC41MzYzMzI1MzYzICogZyArIDAuMDUxNDQ1OTkyOSAqIGI7XG4gIGNvbnN0IG0gPSAwLjIxMTkwMzQ5ODIgKiByICsgMC42ODA2OTk1NDUxICogZyArIDAuMTA3Mzk2OTU2NiAqIGI7XG4gIGNvbnN0IHMgPSAwLjA4ODMwMjQ2MTkgKiByICsgMC4yODE3MTg4Mzc2ICogZyArIDAuNjI5OTc4NzAwNSAqIGI7XG4gIGNvbnN0IGxfID0gTWF0aC5jYnJ0KGwpO1xuICBjb25zdCBtXyA9IE1hdGguY2JydChtKTtcbiAgY29uc3Qgc18gPSBNYXRoLmNicnQocyk7XG4gIHJldHVybiBbMC4yMTA0NTQyNTUzICogbF8gKyAwLjc5MzYxNzc4NSAqIG1fIC0gMC4wMDQwNzIwNDY4ICogc18sIDEuOTc3OTk4NDk1MSAqIGxfIC0gMi40Mjg1OTIyMDUgKiBtXyArIDAuNDUwNTkzNzA5OSAqIHNfLCAwLjAyNTkwNDAzNzEgKiBsXyArIDAuNzgyNzcxNzY2MiAqIG1fIC0gMC44MDg2NzU3NjYgKiBzX107XG59XG5mdW5jdGlvbiBva2xhYlRvSGV4KGxhYikge1xuICBjb25zdCByZ2IgPSBva2xhYlRvU3JnYihsYWIpO1xuICBpZiAoaXNTcmdiSW5HYW11dChyZ2IpKSByZXR1cm4gc3JnYlRvSGV4KHJnYik7XG4gIGNvbnN0IFtMLCBDLCBoXSA9IG9rbGFiVG9Pa2xjaChsYWIpO1xuICBsZXQgbG93ID0gMDtcbiAgbGV0IGhpZ2ggPSBDO1xuICBsZXQgYmVzdCA9IFtMLCAwLCBoXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSArPSAxKSB7XG4gICAgY29uc3QgbWlkID0gKGxvdyArIGhpZ2gpIC8gMjtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBbTCwgbWlkLCBoXTtcbiAgICBjb25zdCBjYW5kaWRhdGVSZ2IgPSBva2xhYlRvU3JnYihva2xjaFRvT2tsYWIoY2FuZGlkYXRlKSk7XG4gICAgaWYgKGlzU3JnYkluR2FtdXQoY2FuZGlkYXRlUmdiKSkge1xuICAgICAgbG93ID0gbWlkO1xuICAgICAgYmVzdCA9IGNhbmRpZGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlnaCA9IG1pZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNyZ2JUb0hleChva2xhYlRvU3JnYihva2xjaFRvT2tsYWIoYmVzdCkpKTtcbn1cbmZ1bmN0aW9uIG9rbGFiVG9TcmdiKGxhYikge1xuICBjb25zdCBMID0gY2xhbXAobGFiWzBdLCAwLCAxKTtcbiAgY29uc3QgYSA9IGxhYlsxXTtcbiAgY29uc3QgYiA9IGxhYlsyXTtcbiAgY29uc3QgbF8gPSBMICsgMC4zOTYzMzc3Nzc0ICogYSArIDAuMjE1ODAzNzU3MyAqIGI7XG4gIGNvbnN0IG1fID0gTCAtIDAuMTA1NTYxMzQ1OCAqIGEgLSAwLjA2Mzg1NDE3MjggKiBiO1xuICBjb25zdCBzXyA9IEwgLSAwLjA4OTQ4NDE3NzUgKiBhIC0gMS4yOTE0ODU1NDggKiBiO1xuICBjb25zdCBsID0gbF8gKiogMztcbiAgY29uc3QgbSA9IG1fICoqIDM7XG4gIGNvbnN0IHMgPSBzXyAqKiAzO1xuICBjb25zdCByID0gNC4wNzY3NDE2NjIxICogbCAtIDMuMzA3NzExNTkxMyAqIG0gKyAwLjIzMDk2OTkyOTIgKiBzO1xuICBjb25zdCBnID0gLTEuMjY4NDM4MDA0NiAqIGwgKyAyLjYwOTc1NzQwMTEgKiBtIC0gMC4zNDEzMTkzOTY1ICogcztcbiAgY29uc3QgYmx1ZSA9IC0wLjAwNDE5NjA4NjMgKiBsIC0gMC43MDM0MTg2MTQ3ICogbSArIDEuNzA3NjE0NzAxICogcztcbiAgcmV0dXJuIFtsaW5lYXJUb1NyZ2IociksIGxpbmVhclRvU3JnYihnKSwgbGluZWFyVG9TcmdiKGJsdWUpXTtcbn1cbmZ1bmN0aW9uIG9rbGFiVG9Pa2xjaChfcmVmKSB7XG4gIGxldCBbTCwgYSwgYl0gPSBfcmVmO1xuICByZXR1cm4gW0wsIE1hdGguaHlwb3QoYSwgYiksIE1hdGguYXRhbjIoYiwgYSldO1xufVxuZnVuY3Rpb24gb2tsY2hUb09rbGFiKF9yZWYyKSB7XG4gIGxldCBbTCwgQywgaF0gPSBfcmVmMjtcbiAgcmV0dXJuIFtMLCBDICogTWF0aC5jb3MoaCksIEMgKiBNYXRoLnNpbihoKV07XG59XG5mdW5jdGlvbiBoZXhUb1NyZ2IoaGV4KSB7XG4gIHJldHVybiBbTnVtYmVyLnBhcnNlSW50KGhleC5zbGljZSgxLCAzKSwgMTYpIC8gMjU1LCBOdW1iZXIucGFyc2VJbnQoaGV4LnNsaWNlKDMsIDUpLCAxNikgLyAyNTUsIE51bWJlci5wYXJzZUludChoZXguc2xpY2UoNSwgNyksIDE2KSAvIDI1NV07XG59XG5mdW5jdGlvbiBzcmdiVG9IZXgocmdiKSB7XG4gIGNvbnN0IHRvSGV4ID0gdmFsdWUgPT4ge1xuICAgIGNvbnN0IGJ5dGUgPSBNYXRoLnJvdW5kKGNsYW1wKHZhbHVlLCAwLCAxKSAqIDI1NSk7XG4gICAgcmV0dXJuIGJ5dGUudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgfTtcbiAgcmV0dXJuIGAjJHt0b0hleChyZ2JbMF0pfSR7dG9IZXgocmdiWzFdKX0ke3RvSGV4KHJnYlsyXSl9YDtcbn1cbmZ1bmN0aW9uIHNyZ2JUb0xpbmVhcihjKSB7XG4gIGlmIChjIDw9IDAuMDQwNDUpIHJldHVybiBjIC8gMTIuOTI7XG4gIHJldHVybiAoKGMgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40O1xufVxuZnVuY3Rpb24gbGluZWFyVG9TcmdiKGMpIHtcbiAgaWYgKGMgPD0gMC4wMDMxMzA4KSByZXR1cm4gYyAqIDEyLjkyO1xuICByZXR1cm4gMS4wNTUgKiBjICoqICgxIC8gMi40KSAtIDAuMDU1O1xufVxuZnVuY3Rpb24gaXNTcmdiSW5HYW11dChfcmVmMykge1xuICBsZXQgW3IsIGcsIGJdID0gX3JlZjM7XG4gIHJldHVybiByID49IDAgJiYgciA8PSAxICYmIGcgPj0gMCAmJiBnIDw9IDEgJiYgYiA+PSAwICYmIGIgPD0gMTtcbn1cbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHZhbHVlKSk7XG59XG5cbmNsYXNzIER1bW15TG9nZ2VyIHtcbiAgbG9nKCkge31cbiAgZGVidWcoKSB7fVxuICBpbmZvKCkge31cbiAgd2FybigpIHt9XG4gIGVycm9yKCkge31cbn1cbmNsYXNzIFByZWZpeGVkTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IobG9nZ2VyLCBwcmVmaXgpIHtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcbiAgfVxuICBsb2cobWVzc2FnZSkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5sb2coYCR7dGhpcy5wcmVmaXh9JHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9XG4gIGRlYnVnKG1lc3NhZ2UpIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoYCR7dGhpcy5wcmVmaXh9JHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9XG4gIGluZm8obWVzc2FnZSkge1xuICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICBhcmdzW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5pbmZvKGAke3RoaXMucHJlZml4fSR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfVxuICB3YXJuKG1lc3NhZ2UpIHtcbiAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgYXJnc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIud2FybihgJHt0aGlzLnByZWZpeH0ke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gIH1cbiAgZXJyb3IobWVzc2FnZSkge1xuICAgIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNSA+IDEgPyBfbGVuNSAtIDEgOiAwKSwgX2tleTUgPSAxOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgICBhcmdzW19rZXk1IC0gMV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5lcnJvcihgJHt0aGlzLnByZWZpeH0ke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRHVtbXlMb2dnZXIgYXMgRCwgUHJlZml4ZWRMb2dnZXIgYXMgUCwgZGVib3VuY2UgYXMgZCwgaGV4VG9Pa2xhYiBhcyBoLCBsZXJwT2tsYWIgYXMgbCwgbm9ybWFsaXplSGV4Q29sb3IgYXMgbiwgb2tsYWJUb0hleCBhcyBvLCBwYXJzZU5wdCBhcyBwLCB0aHJvdHRsZSBhcyB0IH07XG4iLCAiaW1wb3J0IHsgbiBhcyBub3JtYWxpemVIZXhDb2xvciwgUCBhcyBQcmVmaXhlZExvZ2dlciwgcCBhcyBwYXJzZU5wdCB9IGZyb20gJy4vbG9nZ2luZy0tUDBDc0V1Xy5qcyc7XG5cbmxldCB3YXNtO1xuZnVuY3Rpb24gYWRkSGVhcE9iamVjdChvYmopIHtcbiAgaWYgKGhlYXBfbmV4dCA9PT0gaGVhcC5sZW5ndGgpIGhlYXAucHVzaChoZWFwLmxlbmd0aCArIDEpO1xuICBjb25zdCBpZHggPSBoZWFwX25leHQ7XG4gIGhlYXBfbmV4dCA9IGhlYXBbaWR4XTtcbiAgaGVhcFtpZHhdID0gb2JqO1xuICByZXR1cm4gaWR4O1xufVxuZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7XG4gIC8vIHByaW1pdGl2ZSB0eXBlc1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHtcbiAgICByZXR1cm4gYCR7dmFsfWA7XG4gIH1cbiAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYFwiJHt2YWx9XCJgO1xuICB9XG4gIGlmICh0eXBlID09ICdzeW1ib2wnKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB2YWwuZGVzY3JpcHRpb247XG4gICAgaWYgKGRlc2NyaXB0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnU3ltYm9sJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBTeW1ib2woJHtkZXNjcmlwdGlvbn0pYDtcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnN0IG5hbWUgPSB2YWwubmFtZTtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgbmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYEZ1bmN0aW9uKCR7bmFtZX0pYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdGdW5jdGlvbic7XG4gICAgfVxuICB9XG4gIC8vIG9iamVjdHNcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHZhbC5sZW5ndGg7XG4gICAgbGV0IGRlYnVnID0gJ1snO1xuICAgIGlmIChsZW5ndGggPiAwKSB7XG4gICAgICBkZWJ1ZyArPSBkZWJ1Z1N0cmluZyh2YWxbMF0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBkZWJ1ZyArPSAnLCAnICsgZGVidWdTdHJpbmcodmFsW2ldKTtcbiAgICB9XG4gICAgZGVidWcgKz0gJ10nO1xuICAgIHJldHVybiBkZWJ1ZztcbiAgfVxuICAvLyBUZXN0IGZvciBidWlsdC1pblxuICBjb25zdCBidWlsdEluTWF0Y2hlcyA9IC9cXFtvYmplY3QgKFteXFxdXSspXFxdLy5leGVjKHRvU3RyaW5nLmNhbGwodmFsKSk7XG4gIGxldCBjbGFzc05hbWU7XG4gIGlmIChidWlsdEluTWF0Y2hlcyAmJiBidWlsdEluTWF0Y2hlcy5sZW5ndGggPiAxKSB7XG4gICAgY2xhc3NOYW1lID0gYnVpbHRJbk1hdGNoZXNbMV07XG4gIH0gZWxzZSB7XG4gICAgLy8gRmFpbGVkIHRvIG1hdGNoIHRoZSBzdGFuZGFyZCAnW29iamVjdCBDbGFzc05hbWVdJ1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCk7XG4gIH1cbiAgaWYgKGNsYXNzTmFtZSA9PSAnT2JqZWN0Jykge1xuICAgIC8vIHdlJ3JlIGEgdXNlciBkZWZpbmVkIGNsYXNzIG9yIE9iamVjdFxuICAgIC8vIEpTT04uc3RyaW5naWZ5IGF2b2lkcyBwcm9ibGVtcyB3aXRoIGN5Y2xlcywgYW5kIGlzIGdlbmVyYWxseSBtdWNoXG4gICAgLy8gZWFzaWVyIHRoYW4gbG9vcGluZyB0aHJvdWdoIG93blByb3BlcnRpZXMgb2YgYHZhbGAuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAnT2JqZWN0KCcgKyBKU09OLnN0cmluZ2lmeSh2YWwpICsgJyknO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgICB9XG4gIH1cbiAgLy8gZXJyb3JzXG4gIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHJldHVybiBgJHt2YWwubmFtZX06ICR7dmFsLm1lc3NhZ2V9XFxuJHt2YWwuc3RhY2t9YDtcbiAgfVxuICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuXG4gIHJldHVybiBjbGFzc05hbWU7XG59XG5mdW5jdGlvbiBkcm9wT2JqZWN0KGlkeCkge1xuICBpZiAoaWR4IDwgMTMyKSByZXR1cm47XG4gIGhlYXBbaWR4XSA9IGhlYXBfbmV4dDtcbiAgaGVhcF9uZXh0ID0gaWR4O1xufVxuZnVuY3Rpb24gZ2V0QXJyYXlVMzJGcm9tV2FzbTAocHRyLCBsZW4pIHtcbiAgcHRyID0gcHRyID4+PiAwO1xuICByZXR1cm4gZ2V0VWludDMyQXJyYXlNZW1vcnkwKCkuc3ViYXJyYXkocHRyIC8gNCwgcHRyIC8gNCArIGxlbik7XG59XG5sZXQgY2FjaGVkRGF0YVZpZXdNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldERhdGFWaWV3TWVtb3J5MCgpIHtcbiAgaWYgKGNhY2hlZERhdGFWaWV3TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWREYXRhVmlld01lbW9yeTAuYnVmZmVyLmRldGFjaGVkID09PSB0cnVlIHx8IGNhY2hlZERhdGFWaWV3TWVtb3J5MC5idWZmZXIuZGV0YWNoZWQgPT09IHVuZGVmaW5lZCAmJiBjYWNoZWREYXRhVmlld01lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICBjYWNoZWREYXRhVmlld01lbW9yeTAgPSBuZXcgRGF0YVZpZXcod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkRGF0YVZpZXdNZW1vcnkwO1xufVxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gIHB0ciA9IHB0ciA+Pj4gMDtcbiAgcmV0dXJuIGRlY29kZVRleHQocHRyLCBsZW4pO1xufVxubGV0IGNhY2hlZFVpbnQzMkFycmF5TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRVaW50MzJBcnJheU1lbW9yeTAoKSB7XG4gIGlmIChjYWNoZWRVaW50MzJBcnJheU1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVkVWludDMyQXJyYXlNZW1vcnkwLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICBjYWNoZWRVaW50MzJBcnJheU1lbW9yeTAgPSBuZXcgVWludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkVWludDMyQXJyYXlNZW1vcnkwO1xufVxubGV0IGNhY2hlZFVpbnQ4QXJyYXlNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQ4QXJyYXlNZW1vcnkwKCkge1xuICBpZiAoY2FjaGVkVWludDhBcnJheU1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVkVWludDhBcnJheU1lbW9yeTAuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgIGNhY2hlZFVpbnQ4QXJyYXlNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkVWludDhBcnJheU1lbW9yeTA7XG59XG5mdW5jdGlvbiBnZXRPYmplY3QoaWR4KSB7XG4gIHJldHVybiBoZWFwW2lkeF07XG59XG5sZXQgaGVhcCA9IG5ldyBBcnJheSgxMjgpLmZpbGwodW5kZWZpbmVkKTtcbmhlYXAucHVzaCh1bmRlZmluZWQsIG51bGwsIHRydWUsIGZhbHNlKTtcbmxldCBoZWFwX25leHQgPSBoZWFwLmxlbmd0aDtcbmZ1bmN0aW9uIHBhc3NTdHJpbmdUb1dhc20wKGFyZywgbWFsbG9jLCByZWFsbG9jKSB7XG4gIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCwgMSkgPj4+IDA7XG4gICAgZ2V0VWludDhBcnJheU1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGJ1Zi5sZW5ndGgpLnNldChidWYpO1xuICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7XG4gICAgcmV0dXJuIHB0cjtcbiAgfVxuICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgbGV0IHB0ciA9IG1hbGxvYyhsZW4sIDEpID4+PiAwO1xuICBjb25zdCBtZW0gPSBnZXRVaW50OEFycmF5TWVtb3J5MCgpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICBjb25zdCBjb2RlID0gYXJnLmNoYXJDb2RlQXQob2Zmc2V0KTtcbiAgICBpZiAoY29kZSA+IDB4N0YpIGJyZWFrO1xuICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgfVxuICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICBhcmcgPSBhcmcuc2xpY2Uob2Zmc2V0KTtcbiAgICB9XG4gICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMsIDEpID4+PiAwO1xuICAgIGNvbnN0IHZpZXcgPSBnZXRVaW50OEFycmF5TWVtb3J5MCgpLnN1YmFycmF5KHB0ciArIG9mZnNldCwgcHRyICsgbGVuKTtcbiAgICBjb25zdCByZXQgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGVJbnRvKGFyZywgdmlldyk7XG4gICAgb2Zmc2V0ICs9IHJldC53cml0dGVuO1xuICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIG9mZnNldCwgMSkgPj4+IDA7XG4gIH1cbiAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICByZXR1cm4gcHRyO1xufVxuZnVuY3Rpb24gdGFrZU9iamVjdChpZHgpIHtcbiAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGlkeCk7XG4gIGRyb3BPYmplY3QoaWR4KTtcbiAgcmV0dXJuIHJldDtcbn1cbmxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7XG4gIGlnbm9yZUJPTTogdHJ1ZSxcbiAgZmF0YWw6IHRydWVcbn0pO1xuY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7XG5jb25zdCBNQVhfU0FGQVJJX0RFQ09ERV9CWVRFUyA9IDIxNDY0MzUwNzI7XG5sZXQgbnVtQnl0ZXNEZWNvZGVkID0gMDtcbmZ1bmN0aW9uIGRlY29kZVRleHQocHRyLCBsZW4pIHtcbiAgbnVtQnl0ZXNEZWNvZGVkICs9IGxlbjtcbiAgaWYgKG51bUJ5dGVzRGVjb2RlZCA+PSBNQVhfU0FGQVJJX0RFQ09ERV9CWVRFUykge1xuICAgIGNhY2hlZFRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcsIHtcbiAgICAgIGlnbm9yZUJPTTogdHJ1ZSxcbiAgICAgIGZhdGFsOiB0cnVlXG4gICAgfSk7XG4gICAgY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7XG4gICAgbnVtQnl0ZXNEZWNvZGVkID0gbGVuO1xuICB9XG4gIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhBcnJheU1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpO1xufVxuY29uc3QgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbmlmICghKCdlbmNvZGVJbnRvJyBpbiBjYWNoZWRUZXh0RW5jb2RlcikpIHtcbiAgY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byA9IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICB2aWV3LnNldChidWYpO1xuICAgIHJldHVybiB7XG4gICAgICByZWFkOiBhcmcubGVuZ3RoLFxuICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG4gIH07XG59XG5sZXQgV0FTTV9WRUNUT1JfTEVOID0gMDtcbmNvbnN0IFZ0RmluYWxpemF0aW9uID0gdHlwZW9mIEZpbmFsaXphdGlvblJlZ2lzdHJ5ID09PSAndW5kZWZpbmVkJyA/IHtcbiAgcmVnaXN0ZXI6ICgpID0+IHt9LFxuICB1bnJlZ2lzdGVyOiAoKSA9PiB7fVxufSA6IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeShwdHIgPT4gd2FzbS5fX3diZ192dF9mcmVlKHB0ciA+Pj4gMCwgMSkpO1xuY2xhc3MgVnQge1xuICBzdGF0aWMgX193cmFwKHB0cikge1xuICAgIHB0ciA9IHB0ciA+Pj4gMDtcbiAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFZ0LnByb3RvdHlwZSk7XG4gICAgb2JqLl9fd2JnX3B0ciA9IHB0cjtcbiAgICBWdEZpbmFsaXphdGlvbi5yZWdpc3RlcihvYmosIG9iai5fX3diZ19wdHIsIG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7XG4gICAgY29uc3QgcHRyID0gdGhpcy5fX3diZ19wdHI7XG4gICAgdGhpcy5fX3diZ19wdHIgPSAwO1xuICAgIFZ0RmluYWxpemF0aW9uLnVucmVnaXN0ZXIodGhpcyk7XG4gICAgcmV0dXJuIHB0cjtcbiAgfVxuICBmcmVlKCkge1xuICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7XG4gICAgd2FzbS5fX3diZ192dF9mcmVlKHB0ciwgMCk7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuICBmZWVkKHMpIHtcbiAgICBjb25zdCBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocywgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydCwgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydDIpO1xuICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgY29uc3QgcmV0ID0gd2FzbS52dF9mZWVkKHRoaXMuX193YmdfcHRyLCBwdHIwLCBsZW4wKTtcbiAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gY29sc1xuICAgKiBAcGFyYW0ge251bWJlcn0gcm93c1xuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cbiAgcmVzaXplKGNvbHMsIHJvd3MpIHtcbiAgICBjb25zdCByZXQgPSB3YXNtLnZ0X3Jlc2l6ZSh0aGlzLl9fd2JnX3B0ciwgY29scywgcm93cyk7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgfVxuICAvKipcbiAgICogQHJldHVybnMge1VpbnQzMkFycmF5fVxuICAgKi9cbiAgZ2V0U2l6ZSgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICB3YXNtLnZ0X2dldFNpemUocmV0cHRyLCB0aGlzLl9fd2JnX3B0cik7XG4gICAgICB2YXIgcjAgPSBnZXREYXRhVmlld01lbW9yeTAoKS5nZXRJbnQzMihyZXRwdHIgKyA0ICogMCwgdHJ1ZSk7XG4gICAgICB2YXIgcjEgPSBnZXREYXRhVmlld01lbW9yeTAoKS5nZXRJbnQzMihyZXRwdHIgKyA0ICogMSwgdHJ1ZSk7XG4gICAgICB2YXIgdjEgPSBnZXRBcnJheVUzMkZyb21XYXNtMChyMCwgcjEpLnNsaWNlKCk7XG4gICAgICB3YXNtLl9fd2JpbmRnZW5fZXhwb3J0MyhyMCwgcjEgKiA0LCA0KTtcbiAgICAgIHJldHVybiB2MTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByb3dcbiAgICogQHBhcmFtIHtib29sZWFufSBjdXJzb3Jfb25cbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG4gIGdldExpbmUocm93LCBjdXJzb3Jfb24pIHtcbiAgICBjb25zdCByZXQgPSB3YXNtLnZ0X2dldExpbmUodGhpcy5fX3diZ19wdHIsIHJvdywgY3Vyc29yX29uKTtcbiAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xuICB9XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cbiAgZ2V0Q3Vyc29yKCkge1xuICAgIGNvbnN0IHJldCA9IHdhc20udnRfZ2V0Q3Vyc29yKHRoaXMuX193YmdfcHRyKTtcbiAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xuICB9XG59XG5pZiAoU3ltYm9sLmRpc3Bvc2UpIFZ0LnByb3RvdHlwZVtTeW1ib2wuZGlzcG9zZV0gPSBWdC5wcm90b3R5cGUuZnJlZTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gY29sc1xuICogQHBhcmFtIHtudW1iZXJ9IHJvd3NcbiAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxiYWNrX2xpbWl0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJvbGRfaXNfYnJpZ2h0XG4gKiBAcmV0dXJucyB7VnR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShjb2xzLCByb3dzLCBzY3JvbGxiYWNrX2xpbWl0LCBib2xkX2lzX2JyaWdodCkge1xuICBjb25zdCByZXQgPSB3YXNtLmNyZWF0ZShjb2xzLCByb3dzLCBzY3JvbGxiYWNrX2xpbWl0LCBib2xkX2lzX2JyaWdodCk7XG4gIHJldHVybiBWdC5fX3dyYXAocmV0KTtcbn1cbmNvbnN0IEVYUEVDVEVEX1JFU1BPTlNFX1RZUEVTID0gbmV3IFNldChbJ2Jhc2ljJywgJ2NvcnMnLCAnZGVmYXVsdCddKTtcbmFzeW5jIGZ1bmN0aW9uIF9fd2JnX2xvYWQobW9kdWxlLCBpbXBvcnRzKSB7XG4gIGlmICh0eXBlb2YgUmVzcG9uc2UgPT09ICdmdW5jdGlvbicgJiYgbW9kdWxlIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcbiAgICBpZiAodHlwZW9mIFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcobW9kdWxlLCBpbXBvcnRzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc3QgdmFsaWRSZXNwb25zZSA9IG1vZHVsZS5vayAmJiBFWFBFQ1RFRF9SRVNQT05TRV9UWVBFUy5oYXMobW9kdWxlLnR5cGUpO1xuICAgICAgICBpZiAodmFsaWRSZXNwb25zZSAmJiBtb2R1bGUuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpICE9PSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmdgIGZhaWxlZCBiZWNhdXNlIHlvdXIgc2VydmVyIGRvZXMgbm90IHNlcnZlIFdhc20gd2l0aCBgYXBwbGljYXRpb24vd2FzbWAgTUlNRSB0eXBlLiBGYWxsaW5nIGJhY2sgdG8gYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlYCB3aGljaCBpcyBzbG93ZXIuIE9yaWdpbmFsIGVycm9yOlxcblwiLCBlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKGJ5dGVzLCBpbXBvcnRzKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG4gICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbmNlLFxuICAgICAgICBtb2R1bGVcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIF9fd2JnX2dldF9pbXBvcnRzKCkge1xuICBjb25zdCBpbXBvcnRzID0ge307XG4gIGltcG9ydHMud2JnID0ge307XG4gIGltcG9ydHMud2JnLl9fd2JnX19fd2JpbmRnZW5fZGVidWdfc3RyaW5nX2FkZmI2NjJhZTM0NzI0YjYgPSBmdW5jdGlvbiAoYXJnMCwgYXJnMSkge1xuICAgIGNvbnN0IHJldCA9IGRlYnVnU3RyaW5nKGdldE9iamVjdChhcmcxKSk7XG4gICAgY29uc3QgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydCwgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydDIpO1xuICAgIGNvbnN0IGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgZ2V0RGF0YVZpZXdNZW1vcnkwKCkuc2V0SW50MzIoYXJnMCArIDQgKiAxLCBsZW4xLCB0cnVlKTtcbiAgICBnZXREYXRhVmlld01lbW9yeTAoKS5zZXRJbnQzMihhcmcwICsgNCAqIDAsIHB0cjEsIHRydWUpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diZ19fX3diaW5kZ2VuX3Rocm93X2RkMjQ0MTdlZDM2ZmM0NmUgPSBmdW5jdGlvbiAoYXJnMCwgYXJnMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSkpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diZ19uZXdfMTMzMTdlZDE2MTg5MTU4ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXkoKTtcbiAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diZ19uZXdfNGNlYjZhNzY2YmY3OGIwNCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCByZXQgPSBuZXcgT2JqZWN0KCk7XG4gICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193Ymdfc2V0XzNmMWQwYjk4NGVkMjcyZWQgPSBmdW5jdGlvbiAoYXJnMCwgYXJnMSwgYXJnMikge1xuICAgIGdldE9iamVjdChhcmcwKVt0YWtlT2JqZWN0KGFyZzEpXSA9IHRha2VPYmplY3QoYXJnMik7XG4gIH07XG4gIGltcG9ydHMud2JnLl9fd2JnX3NldF84YjZhOWE2MWU5OGE4ODgxID0gZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICBnZXRPYmplY3QoYXJnMClbYXJnMSA+Pj4gMF0gPSB0YWtlT2JqZWN0KGFyZzIpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Nhc3RfMjI0MWI2YWY0YzRiMjk0MSA9IGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgLy8gQ2FzdCBpbnRyaW5zaWMgZm9yIGBSZWYoU3RyaW5nKSAtPiBFeHRlcm5yZWZgLlxuICAgIGNvbnN0IHJldCA9IGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKTtcbiAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2Nhc3RfNDYyNWM1NzdhYjJlYzllZSA9IGZ1bmN0aW9uIChhcmcwKSB7XG4gICAgLy8gQ2FzdCBpbnRyaW5zaWMgZm9yIGBVNjQgLT4gRXh0ZXJucmVmYC5cbiAgICBjb25zdCByZXQgPSBCaWdJbnQuYXNVaW50Tig2NCwgYXJnMCk7XG4gICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmluZGdlbl9jYXN0X2Q2Y2QxOWI4MTU2MGZkNmUgPSBmdW5jdGlvbiAoYXJnMCkge1xuICAgIC8vIENhc3QgaW50cmluc2ljIGZvciBgRjY0IC0+IEV4dGVybnJlZmAuXG4gICAgY29uc3QgcmV0ID0gYXJnMDtcbiAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX29iamVjdF9jbG9uZV9yZWYgPSBmdW5jdGlvbiAoYXJnMCkge1xuICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKTtcbiAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX29iamVjdF9kcm9wX3JlZiA9IGZ1bmN0aW9uIChhcmcwKSB7XG4gICAgdGFrZU9iamVjdChhcmcwKTtcbiAgfTtcbiAgcmV0dXJuIGltcG9ydHM7XG59XG5mdW5jdGlvbiBfX3diZ19maW5hbGl6ZV9pbml0KGluc3RhbmNlLCBtb2R1bGUpIHtcbiAgd2FzbSA9IGluc3RhbmNlLmV4cG9ydHM7XG4gIF9fd2JnX2luaXQuX193YmluZGdlbl93YXNtX21vZHVsZSA9IG1vZHVsZTtcbiAgY2FjaGVkRGF0YVZpZXdNZW1vcnkwID0gbnVsbDtcbiAgY2FjaGVkVWludDMyQXJyYXlNZW1vcnkwID0gbnVsbDtcbiAgY2FjaGVkVWludDhBcnJheU1lbW9yeTAgPSBudWxsO1xuICByZXR1cm4gd2FzbTtcbn1cbmZ1bmN0aW9uIGluaXRTeW5jKG1vZHVsZSkge1xuICBpZiAod2FzbSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gd2FzbTtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZihtb2R1bGUpID09PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICAoe1xuICAgICAgICBtb2R1bGVcbiAgICAgIH0gPSBtb2R1bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3VzaW5nIGRlcHJlY2F0ZWQgcGFyYW1ldGVycyBmb3IgYGluaXRTeW5jKClgOyBwYXNzIGEgc2luZ2xlIG9iamVjdCBpbnN0ZWFkJyk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGltcG9ydHMgPSBfX3diZ19nZXRfaW1wb3J0cygpO1xuICBpZiAoIShtb2R1bGUgaW5zdGFuY2VvZiBXZWJBc3NlbWJseS5Nb2R1bGUpKSB7XG4gICAgbW9kdWxlID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShtb2R1bGUpO1xuICB9XG4gIGNvbnN0IGluc3RhbmNlID0gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZHVsZSwgaW1wb3J0cyk7XG4gIHJldHVybiBfX3diZ19maW5hbGl6ZV9pbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuYXN5bmMgZnVuY3Rpb24gX193YmdfaW5pdChtb2R1bGVfb3JfcGF0aCkge1xuICBpZiAod2FzbSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gd2FzbTtcbiAgaWYgKHR5cGVvZiBtb2R1bGVfb3JfcGF0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKG1vZHVsZV9vcl9wYXRoKSA9PT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgKHtcbiAgICAgICAgbW9kdWxlX29yX3BhdGhcbiAgICAgIH0gPSBtb2R1bGVfb3JfcGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybigndXNpbmcgZGVwcmVjYXRlZCBwYXJhbWV0ZXJzIGZvciB0aGUgaW5pdGlhbGl6YXRpb24gZnVuY3Rpb247IHBhc3MgYSBzaW5nbGUgb2JqZWN0IGluc3RlYWQnKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaW1wb3J0cyA9IF9fd2JnX2dldF9pbXBvcnRzKCk7XG4gIGlmICh0eXBlb2YgbW9kdWxlX29yX3BhdGggPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBSZXF1ZXN0ID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZV9vcl9wYXRoIGluc3RhbmNlb2YgUmVxdWVzdCB8fCB0eXBlb2YgVVJMID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZV9vcl9wYXRoIGluc3RhbmNlb2YgVVJMKSB7XG4gICAgbW9kdWxlX29yX3BhdGggPSBmZXRjaChtb2R1bGVfb3JfcGF0aCk7XG4gIH1cbiAgY29uc3Qge1xuICAgIGluc3RhbmNlLFxuICAgIG1vZHVsZVxuICB9ID0gYXdhaXQgX193YmdfbG9hZChhd2FpdCBtb2R1bGVfb3JfcGF0aCwgaW1wb3J0cyk7XG4gIHJldHVybiBfX3diZ19maW5hbGl6ZV9pbml0KGluc3RhbmNlLCBtb2R1bGUpO1xufVxuXG52YXIgZXhwb3J0cyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgVnQ6IFZ0LFxuICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgIGRlZmF1bHQ6IF9fd2JnX2luaXQsXG4gICAgaW5pdFN5bmM6IGluaXRTeW5jXG59KTtcblxuY29uc3QgYmFzZTY0Y29kZXMgPSBbNjIsMCwwLDAsNjMsNTIsNTMsNTQsNTUsNTYsNTcsNTgsNTksNjAsNjEsMCwwLDAsMCwwLDAsMCwwLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDAsMCwwLDAsMCwwLDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDQyLDQzLDQ0LDQ1LDQ2LDQ3LDQ4LDQ5LDUwLDUxXTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0QmFzZTY0Q29kZShjaGFyQ29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiYXNlNjRjb2Rlc1tjaGFyQ29kZSAtIDQzXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYmFzZTY0RGVjb2RlKHN0cikge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5nT2N0ZXRzID0gc3RyLmVuZHNXaXRoKFwiPT1cIikgPyAyIDogc3RyLmVuZHNXaXRoKFwiPVwiKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIGxldCBuID0gc3RyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkoMyAqIChuIC8gNCkpO1xuICAgICAgICAgICAgICAgIGxldCBidWZmZXI7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCBuOyBpICs9IDQsIGogKz0gMykge1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmFzZTY0Q29kZShzdHIuY2hhckNvZGVBdChpKSkgPDwgMTggfFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmFzZTY0Q29kZShzdHIuY2hhckNvZGVBdChpICsgMSkpIDw8IDEyIHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldEJhc2U2NENvZGUoc3RyLmNoYXJDb2RlQXQoaSArIDIpKSA8PCA2IHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldEJhc2U2NENvZGUoc3RyLmNoYXJDb2RlQXQoaSArIDMpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2pdID0gYnVmZmVyID4+IDE2O1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaiArIDFdID0gKGJ1ZmZlciA+PiA4KSAmIDB4RkY7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtqICsgMl0gPSBidWZmZXIgJiAweEZGO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc3ViYXJyYXkoMCwgcmVzdWx0Lmxlbmd0aCAtIG1pc3NpbmdPY3RldHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdnRXYXNtTW9kdWxlID0gYmFzZTY0RGVjb2RlKFwiQUdGemJRRUFBQUFCbkFFWFlBSi9md0JnQTM5L2Z3QmdBbjkvQVg5Z0EzOS9md0YvWUFGL0FHQUJmd0YvWUFSL2YzOS9BR0FGZjM5L2YzOEFZQVIvZjM5L0FYOWdCbjkvZjM5L2Z3QmdCWDkvZjM5L0FYOWdBQUYvWUFaL2YzOS9mMzhCZjJBQmZBRi9ZQUYrQVg5Z0IzOS9mMzkvZjM4QVlBTi9mMzRCZjJBRWYzOS9mZ0JnQTM5K2Z3QmdCWDkvZkg5L0FHQUZmMzkrZjM4QVlBVi9mMzEvZndCZ0FBQUNvQU1MQTNkaVp4cGZYM2RpWjE5dVpYZGZNVE16TVRkbFpERTJNVGc1TVRVNFpRQUxBM2RpWnhwZlgzZGlaMTl6WlhSZk9HSTJZVGxoTmpGbE9UaGhPRGc0TVFBQkEzZGlaeTVmWDNkaVoxOWZYM2RpYVc1a1oyVnVYMlJsWW5WblgzTjBjbWx1WjE5aFpHWmlOall5WVdVek5EY3lOR0kyQUFBRGQySm5HbDlmZDJKcGJtUm5aVzVmYjJKcVpXTjBYMlJ5YjNCZmNtVm1BQVFEZDJKbkcxOWZkMkpwYm1SblpXNWZiMkpxWldOMFgyTnNiMjVsWDNKbFpnQUZBM2RpWnhwZlgzZGlaMTl6WlhSZk0yWXhaREJpT1RnMFpXUXlOekpsWkFBQkEzZGlaeHBmWDNkaVoxOXVaWGRmTkdObFlqWmhOelkyWW1ZM09HSXdOQUFMQTNkaVp5ZGZYM2RpWjE5ZlgzZGlhVzVrWjJWdVgzUm9jbTkzWDJSa01qUTBNVGRsWkRNMlptTTBObVVBQUFOM1ltY2dYMTkzWW1sdVpHZGxibDlqWVhOMFh6SXlOREZpTm1GbU5HTTBZakk1TkRFQUFnTjNZbWNnWDE5M1ltbHVaR2RsYmw5allYTjBYMlEyWTJReE9XSTRNVFUyTUdaa05tVUFEUU4zWW1jZ1gxOTNZbWx1WkdkbGJsOWpZWE4wWHpRMk1qVmpOVGMzWVdJeVpXTTVaV1VBRGdPN0Fia0JBd0FEQVFNQUJBRUtBZ0VEQXdNQkNBOEtCd01KQndBSkFRQUJDUWNCQVFZQkJBRUdCUUlHQUFNQ0FnY0RBUUFCQ1FZR0FBRUVBUUFBRUFJR0JBQUZBUUVCQUFVTUJRSUFCZ0FBQUFFRUJRVUJCQUVBQUFjQUF3RVJCQUFIQWdBQkFBa0hCQVFBQVFBQUFBQUdBZ2dDRWdFQ0JBZ0hBUWNJQUFBQUFBQUJCQUFFQVFBQUFBZ0JDQXdIRXdvVUZRVUdBZ1FEQkFZRUJBQUFBZ0lCQVFRRUJBRUNBZ0FBQUFJQUFRRUJCQVVXQUFJQUJBQUFCQUlGQWdVRUJRRndBU3NyQlFNQkFCRUdDUUYvQVVHQWdNQUFDd2ZGQVF3R2JXVnRiM0o1QWdBTlgxOTNZbWRmZG5SZlpuSmxaUUErQm1OeVpXRjBaUUFhQjNaMFgyWmxaV1FBQ3dsMmRGOXlaWE5wZW1VQU13cDJkRjluWlhSVGFYcGxBR1lLZG5SZloyVjBUR2x1WlFBTkRIWjBYMmRsZEVOMWNuTnZjZ0F2RVY5ZmQySnBibVJuWlc1ZlpYaHdiM0owQUhjU1gxOTNZbWx1WkdkbGJsOWxlSEJ2Y25ReUFJSUJIMTlmZDJKcGJtUm5aVzVmWVdSa1gzUnZYM04wWVdOclgzQnZhVzUwWlhJQXR3RVNYMTkzWW1sdVpHZGxibDlsZUhCdmNuUXpBS2NCQ1UwQkFFRUJDeXF0QWNFQnd3Rkd3QUU5d2dFSkNnaWxBYXdCc1FFVWxnR1RBVHVVQVpZQm5RR2FBWlFCbEFHWUFaVUJsd0crQWJzQnZBRXd2UUd2QWFRQnF3Ry9BWE9QQVVWZEdHaTZBUXdCSUFxRDF3SzVBYjgxQVJCL0l3QkJvQUZySWdRa0FDQUVRVEJxSUFBUVhpQUVLQUl3SVFNZ0JFRW9haUlBSUFJMkFnUWdBQ0FCTmdJQUlBTkIzQUJxSVFzZ0EwSFFBR29oRENBRFFUQnFJUThnQTBFa2FpRVFJQU5CREdvaEVTQURRYklCYWlFSElBTkJ4QUZxSVFrZ0JDZ0NLQ0lOSUFRb0Fpd2lEbW9oRWlBTklRSURRQUpBQWtBQ1FBSkFBa0FDUUNBREFuOENRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUlBSWdFa1lOQUFKL0lBSXNBQUFpQUVFQVRnUkFJQUJCL3dGeElRQWdBa0VCYWd3QkN5QUNMUUFCUVQ5eElRVWdBRUVmY1NFQklBQkJYMDBFUUNBQlFRWjBJQVZ5SVFBZ0FrRUNhZ3dCQ3lBQ0xRQUNRVDl4SUFWQkJuUnlJUVVnQUVGd1NRUkFJQVVnQVVFTWRISWhBQ0FDUVFOcURBRUxJQUZCRW5SQmdJRHdBSEVnQWkwQUEwRS9jU0FGUVFaMGNuSWlBRUdBZ01RQVJnMEJJQUpCQkdvTElRSkJ3UUFnQUNBQVFaOEJTeHNoQVFKQUFrQUNRQ0FETFFETUJTSUdEZ1VBQkFRRUFRUUxJQUZCSUd0QjRBQkpEUUVNQXdzZ0FVRXdhMEVNVHcwQ0RDQUxJQVFnQURZQ1FDQUVRU0U2QUR3TUFnc2dCRUh3QUdvaUFTQURRZUFBYWlnQ0FDQURRZVFBYWlnQ0FCQWpJQVJCQ0dvZ0F4QWtJQVFnQkNrRENEY0NmQ0FFSUFRb0FuUWdCQ2dDZUJCYklBUW9BZ1FoQUNBRUtBSUFRUUZ4UlFSQUlBRVFiaUFPQkVBZ0RVRUJJQTRRT0FzZ0JDZ0NOQ0FFS0FJNEVMSUJJQVJCb0FGcUpBQWdBQThMSUFRZ0FEWUNUQ0FFUWN3QWFrSGN3c0FBRUVJQUN3SkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FDQUJRZjhCY1NJRlFSdEhCRUFnQlVIYkFFWU5BU0FHRGcwREJBVUdCdzRJRGc0T0FnNEpEZ3NnQTBFQk9nRE1CU0FKRUN3TVZBc2dCZzROQVNNREJBVU5CZzBORFFBTkJ3MExJQUZCSUd0QjN3QkpEVklNQ3dzQ1FDQUJRUmhKRFFBZ0FVRVpSZzBBSUFGQi9BRnhRUnhIRFFzTElBUkJQR29nQUJCSURESUxJQUZCOEFGeFFTQkdEUVlnQVVFd2EwRWdTUTBJSUFGQjBRQnJRUWRKRFFnQ1FDQUZRZGtBYXc0RkNRa0FDUjhBQ3lBQlFlQUFhMEVmVHcwSkRBZ0xJQUZCTUd0Qnp3QlBEUWdnQTBFQU9nRE1CU0FFUVR4cUlBa2dBQkF0RERBTElBRkJMMHNFUUNBQlFUdEhJQUZCT2s5eFJRUkFJQU5CQkRvQXpBVU1Ud3NnQVVGQWFrRS9TUTBFQ3lBQlFmd0JjVUU4UncwSElBTWdBRFlDeEFFZ0EwRUVPZ0RNQlF4T0N5QUJRVUJxUVQ5SkRRUWdBVUg4QVhGQlBFY05CZ3hMQ3lBQlFVQnFRVDlQRFFVTVNRc2dBVUVnYTBIZ0FFa05Td0pBSUFWQkdHc09Bd2NHQndBTElBVkJtUUZyUVFKSkRRWWdCVUhRQUVZTlN5QUZRUWRHRFVnTUJRc2dBMEVBT2dETUJTQUVRVHhxSUFrZ0FCQU9EQ3NMSUFNZ0FEWUN4QUVnQTBFQ09nRE1CUXhKQ3lBRFFRQTZBTXdGSUFSQlBHb2dDU0FBRUE0TUtRc2dBMEVBT2dETUJTQUVRVHhxSUFrZ0FCQXREQ2dMQWtBZ0JVRVlhdzREQWdFQ0FBc2dCVUdaQVd0QkFra05BU0FGUWRBQVJ3MEFJQVpCQVdzT0NoVURDQWtLSkFzTURRNUdDeUFCUWZBQmNTSUlRWUFCUmcwQUlBRkJrUUZyUVFaTERRRUxJQU5CQURvQXpBVWdCRUU4YWlBQUVFZ01KUXNnQ0VFZ1J3MEJJQVpCQkVjTkFRdy9DeUFCUWZBQmNTRUlEQUVMSUFaQkFXc09DZ0VBQXdRRkRnWUhDQWtPQ3lBSVFTQkhEUUVNT3dzZ0FVRVlUdzBLREFzTEFrQWdBVUVZU1EwQUlBRkJHVVlOQUNBQlFmd0JjVUVjUncwTUN5QUVRVHhxSUFBUVNBd2ZDd0pBQWtBZ0FVRVlTUTBBSUFGQkdVWU5BQ0FCUWZ3QmNVRWNSdzBCQ3lBRVFUeHFJQUFRU0F3ZkN5QUJRZkFCY1VFZ1JnMDVEQW9MQWtBZ0FVRVlTUTBBSUFGQkdVWU5BQ0FCUWZ3QmNVRWNSdzBLQ3lBRVFUeHFJQUFRU0F3ZEN5QUJRVUJxUVQ5UEJFQWdBVUh3QVhFaUNFRWdSZzAzSUFoQk1FWU5PZ3dKQ3lBRFFRQTZBTXdGSUFSQlBHb2dDU0FBRUE0TUhBc2dBVUg4QVhGQlBFWU5BeUFCUWZBQmNVRWdSZzB2SUFGQlFHcEJQMDhOQnd3RUN5QUJRUzlORFFZZ0FVRTZTUTA0SUFGQk8wWU5PQ0FCUVVCcVFUNU5EUU1NQmdzZ0FVRkFha0UvU1EwQ0RBVUxJQUZCR0VrTk55QUJRUmxHRFRjZ0FVSDhBWEZCSEVZTk53d0VDeUFESUFBMkFzUUJJQU5CQ0RvQXpBVU1OZ3NnQTBFS09nRE1CUXcxQ3lBRlFkZ0FheUlJUVFkTlFRQkJBU0FJZEVIQkFYRWJEUVVnQlVFWlJnMEFJQUZCL0FGeFFSeEhEUUVMSUFSQlBHb2dBQkJJREJRTElBVkJrQUZyRGhBQkJRVUZCUVVGQlFNRkJRSXZBQU1EQkFzZ0EwRU1PZ0RNQlF3eEN5QURRUWM2QU13RklBa1FMQXd3Q3lBRFFRTTZBTXdGSUFrUUxBd3ZDeUFEUVEwNkFNd0ZEQzRMQWtBZ0JVRTZhdzRDQkFJQUN5QUZRUmxHRFFJTElBWkJBMnNPQndrc0F3b0ZDd2NzQ3lBR1FRTnJEZ2NJS3lzSkJRb0hLd3NnQmtFRGF3NEhCeW9DQ0NvSkJpb0xJQVpCQTJzT0J3WXBLUWNKQ0FVcEN5QUJRUmhKRFFBZ0FVSDhBWEZCSEVjTktBc2dCRUU4YWlBQUVFZ01DQXNnQVVFd2EwRUtUdzBtQ3lBRFFRZzZBTXdGRENRTElBRkI4QUZ4UVNCR0RSOExJQUZCOEFGeFFUQkhEU01NQXdzZ0FVRTZSdzBpRENBTEFrQWdBVUVZU1EwQUlBRkJHVVlOQUNBQlFmd0JjVUVjUncwaUN5QUVRVHhxSUFBUVNBd0NDeUFCUWZBQmNVRWdSZzBWSUFGQk9rWU5BQ0FCUWZ3QmNVRThSdzBnQ3lBRFFRczZBTXdGREI4TElBUXRBRHdpQUVFeVJnMGZBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQ0FBUVFGckRqRUNBd1FGQmdjSUNRb0xEQTBPRHlVUUpoRVNFeFFWRmhjWUdSb2JIQjBlSHdBaElpTWtKU1luS0NrcUt5d3RNREV5QVFzZ0JDZ0NRQ0VBREI4TElBTkJma0YvSUFNb0FtZ2dBeWdDbkFGR0d4Q0ZBUXc5Q3lBRUx3RStJUUFnQkNBREtBSm9OZ0pNSUFSQkFEb0FmQ0FFSUFOQjFBQnFLQUlBSWdFMkFuQWdCQ0FCSUFNb0FsaEJBblJxTmdKMFFRRWdBQ0FBUVFGTkd5RUFJQVFnQkVITUFHbzJBbmdEUUNBQVFRRnJJZ0FFUUNBRVFmQUFhaEJRRFFFTU5nc0xJQVJCOEFCcUVGQWlBRVVOTkNBQUtBSUFERFVMSUFOQkFTQUVMd0UrSWdBZ0FFRUJUUnRCQVdzaUFDQURLQUtjQVNJQlFRRnJJQUFnQVVrYk5nSm9ERHNMSUFOQkFTQUVMd0UrSWdBZ0FFRUJUUnNRTWd3NkN5QURRUUVnQkM4QlBpSUFJQUJCQVUwYkVGOGdBMEVBTmdKb0REa0xJQU5CQVNBRUx3RStJZ0FnQUVFQlRSc1FZU0FEUVFBMkFtZ01PQXNnQTBFQU5nSm9ERGNMQWtBZ0JDMEFQVUVCYXc0Q0pnQVRDeUFEUVFBMkFsZ01OZ3NnQTBFQklBUXZBVDRpQUNBQVFRRk5HeUlBUVg5elFRQWdBR3NnQXlnQ2FDQURLQUtjQVVZYkVJVUJERFVMSUFOQkFTQUVMd0UrSWdBZ0FFRUJUUnNRWHd3MEN5QURRUUVnQkM4QlBpSUFJQUJCQVUwYkVJVUJERE1MSUFOQkFTQUVMd0ZBSWdBZ0FFRUJUUnRCQVdzaUFDQURLQUtjQVNJQlFRRnJJQUFnQVVrYk5nSm9JQU5CQVNBRUx3RStJZ0FnQUVFQlRSdEJBV3NRVWd3eUN5QURRUUVnQkM4QlBpSUFJQUJCQVUwYkVHRU1NUXNnQXlnQ2FDSUFJQU1vQXB3QklnRlBCRUFnQXlBQlFRRnJJZ0EyQW1nTFFRRWdCQzhCUGlJQklBRkJBVTBiSWdFZ0F5Z0NHQ0FBYXlJRklBRWdCVWtiSVFFZ0F5QURLQUpzUWJETndBQVFZaUlGS0FJRUlBVW9BZ2dnQUVHbzJjQUFFSkFCS0FJRVJRUkFJQVVvQWdRZ0JTZ0NDQ0FBUVFGclFialp3QUFRa0FFaUJrS2dnSUNBRURjQ0FDQUdJQWNwQVFBM0FRZ2dCa0VRYWlBSFFRaHFMd0VBT3dFQUN5QUVRUmhxSUFVb0FnUWdCU2dDQ0NBQVFjalp3QUFRZnlBRUtBSVlJQVFvQWh3Z0FSQ0lBU0FGS0FJRUlBVW9BZ2dnQUVIWTJjQUFFSkFCSWdBb0FnUkZCRUFnQUVLZ2dJQ0FFRGNDQUNBQUlBY3BBUUEzQVFnZ0FFRVFhaUFIUVFocUx3RUFPd0VBQ3lBRVFSQnFJQVVvQWdRZ0JTZ0NDQ0lBSUFBZ0FXdEI2Tm5BQUJCL0lBUW9BaEFoQUNBRUtBSVVJQVJCK0FCcUlBZEJDR292QVFBN0FRQWdCQ0FIS1FFQU53TndRUlJzSVFFRFFDQUJCRUFnQUVLZ2dJQ0FFRGNDQUNBQUlBUXBBM0EzQWdnZ0FFRVFhaUFFUWZnQWFpOEJBRHNCQUNBQlFSUnJJUUVnQUVFVWFpRUFEQUVMQ3lBRlFRQTZBQXdnQTBIZ0FHb29BZ0FnQTBIa0FHb29BZ0FnQXlnQ2JCQ1JBUXd3Q3lBREtBS2NBU0VGSUFNb0FxQUJJUVpCQUNFQkEwQWdBU0FHUmcwd1FRQWhBQU5BSUFBZ0JVWUVRQ0FEUWVBQWFpZ0NBQ0FEUWVRQWFpZ0NBQ0FCRUpFQklBRkJBV29oQVF3Q0JTQUVRUUE3QUhnZ0JFRUNPZ0IwSUFSQkFqb0FjQ0FESUFBZ0FVSEZBQ0FFUWZBQWFoQVRHaUFBUVFGcUlRQU1BUXNBQ3dBTEFBc2dCQ2dDU0NFQklBUW9Ba1FoQUNBRUlBUW9Ba0EyQW5nZ0JDQUFOZ0p3SUFRZ0FVRUJkQ0lCSUFCcUlnVTJBbndEUUNBQkJFQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQ0FBTHdFQUlnWkJBV3NPQndFeE1URXhBZ01BQ3lBR1FaY0lhdzREQkFVR0F3c2dBMEVBT2dEQkFRd0hDeUFEUWdBM0FtZ2dBMEVBT2dDK0FRd0dDeUFEUVFBNkFMOEJEQVVMSUFOQkFEb0FjQXdFQ3lBREVHOE1BZ3NnQXhDSkFRd0NDeUFERUc4Z0F4Q0pBUXNnQXhBUkN5QUFRUUpxSVFBZ0FVRUNheUVCREFFTEN5QUVJQVUyQW5RZ0JFSHdBR29RcWdFTUxnc2dCQ2dDU0NFQklBUW9Ba1FoQUNBRUlBUW9Ba0EyQW5nZ0JDQUFOZ0p3SUFRZ0FVRUJkQ0lCSUFCcUlnWTJBbndEUUNBQkJFQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQWdBQzhCQUNJRlFRRnJEZ2NCTHk4dkx3SURBQXNnQlVHWENHc09Bd1lFQlFNTElBTkJBVG9Bd1FFTUJnc2dBMEVCT2dDK0FTQURRUUEyQW1nZ0F5QURLQUtvQVRZQ2JBd0ZDeUFEUVFFNkFMOEJEQVFMSUFOQkFUb0FjQXdEQ3lBREVHVU1BZ3NnQXhCbEN5TUFRVEJySWdVa0FDQURMUUM4QVVVRVFDQURRUUU2QUx3QklBTkI5QUJxSUFOQmlBRnFFSFFnQXlBRFFTUnFFSFVnQlVFTWFpSUlJQU1vQXB3QklBTW9BcUFCSWdwQkFVRUFJQU5Cc2dGcUVCOGdBMEVNYWhDZ0FTQURJQWhCSkJBV0lnZ29BbUFnQ0NnQ1pFRUFJQW9RVXdzZ0JVRXdhaVFBSUFNUUVRc2dBRUVDYWlFQUlBRkJBbXNoQVF3QkN3c2dCQ0FHTmdKMElBUkI4QUJxRUtvQkRDMExBa0JCQVNBRUx3RStJZ0FnQUVFQlRSdEJBV3NpQUNBRUx3RkFJZ0VnQXlnQ29BRWlCU0FCRzBFQmF5SUJTU0FCSUFWSmNVVUVRQ0FES0FLb0FTRUFEQUVMSUFNZ0FUWUNyQUVnQXlBQU5nS29BUXNnQTBFQU5nSm9JQU1nQUVFQUlBTXRBTDRCR3pZQ2JBd3NDeUFEUVFFNkFIQWdBMEVBT3dDOUFTQURRUUE3QWJvQklBTkJBam9BdGdFZ0EwRUNPZ0N5QVNBRFFRQTdBYkFCSUFOQ0FEY0NwQUVnQTBHQWdJQUlOZ0tFQVNBRFFRSTZBSUFCSUFOQkFqb0FmQ0FEUWdBM0FuUWdBeUFES0FLZ0FVRUJhellDckFFTUt3c2dBeWdDb0FFZ0F5Z0NyQUVpQUVFQmFpQUFJQU1vQW13aUFFa2JJUUVnQXlBQUlBRkJBU0FFTHdFK0lnVWdCVUVCVFJzZ0J4QWRJQU5CNEFCcUtBSUFJQU5CNUFCcUtBSUFJQUFnQVJCVERDb0xJQU1nQXlnQ2FDQURLQUpzSWdCQkFFRUJJQVF2QVQ0aUFTQUJRUUZOR3lBSEVDSWdBMEhnQUdvb0FnQWdBMEhrQUdvb0FnQWdBQkNSQVF3cEN3SkFBa0FDUUNBRUxRQTlRUUZyRGdNQkFpc0FDeUFESUFNb0FtZ2dBeWdDYkNJQVFRRWdCQ0FIRUNJZ0EwSGdBR29vQWdBZ0EwSGtBR29vQWdBZ0FDQURLQUtnQVJCVERDb0xJQU1nQXlnQ2FDQURLQUpzSWdCQkFpQUVJQWNRSWlBRFFlQUFhaWdDQUNBRFFlUUFhaWdDQUVFQUlBQkJBV29RVXd3cEN5QURRUUFnQXlnQ0hDQUhFQ29nQTBIZ0FHb29BZ0FnQTBIa0FHb29BZ0JCQUNBREtBS2dBUkJURENnTElBTWdBeWdDYUNBREtBSnNJZ0FnQkMwQVBVRUVjaUFFSUFjUUlpQURRZUFBYWlnQ0FDQURRZVFBYWlnQ0FDQUFFSkVCRENjTElBTWdCQzBBUFRvQXNRRU1KZ3NnQXlBRUxRQTlPZ0N3QVF3bEN5QURRUUVRTWd3a0N5TUFRUkJySWdVa0FBSkFBa0FDUUNBREtBSm9JZ2hGRFFBZ0NDQURLQUtjQVU4TkFDQUZRUWhxSUFNb0FsUWlBQ0FES0FKWUlnRWdDQkE4SUFVb0FnaEJBVWNOQUNBRktBSU1JZ1lnQVVzTkFTQURRZEFBYWlJS0tBSUFJQUZHQkg4Z0NrRzg0c0FBRUdzZ0F5Z0NWQVVnQUFzZ0JrRUNkR29oQUNBQklBWkxCRUFnQUVFRWFpQUFJQUVnQm10QkFuUVFFZ3NnQUNBSU5nSUFJQU1nQVVFQmFqWUNXQXNnQlVFUWFpUUFEQUVMSUFZZ0FVRzg0c0FBRUV3QUN3d2pDeUFES0FKb0lnQWdBeWdDbkFFaUJVWUVRQ0FESUFCQkFXc2lBRFlDYUFzZ0F5QUFJQU1vQW13aUFVRUJJQVF2QVQ0aUJpQUdRUUZOR3lJR0lBVWdBR3NpQlNBRklBWkxHeUlGSUFjUUlDQUFJQUFnQldvaUJTQUFJQVZMR3lFRkEwQWdBQ0FGUndSQUlBTWdBQ0FCUVNBZ0J4QVRHaUFBUVFGcUlRQU1BUXNMSUFOQjRBQnFLQUlBSUFOQjVBQnFLQUlBSUFFUWtRRU1JZ3NnQXlnQ29BRWdBeWdDckFFaUFFRUJhaUFBSUFNb0Ftd2lBRWtiSVFFZ0F5QUFJQUZCQVNBRUx3RStJZ1VnQlVFQlRSc2dCeEEySUFOQjRBQnFLQUlBSUFOQjVBQnFLQUlBSUFBZ0FSQlREQ0VMSUFNUVhDQURMUURBQVVFQlJ3MGdJQU5CQURZQ2FBd2dDeUFERUZ3Z0EwRUFOZ0pvREI4TElBTWdBQkFoREI0TElBTW9BbWdpQlVVTkhTQUVMd0UrSVFBZ0F5Z0NiQ0VCSUFSQklHb2dBeEJ3SUFRb0FpUWlCaUFCVFEwU1FRRWdBQ0FBUVFGTkd5RUFJQVFvQWlBZ0FVRUVkR29pQVVFRWFpZ0NBQ0FCUVFocUtBSUFJQVZCQVd0QnVPWEFBQkNRQVNnQ0FDRUJBMEFnQUVVTkhpQURJQUVRSVNBQVFRRnJJUUFNQUFzQUN5QURLQUpzSWdBZ0F5Z0NxQUZHRFJJZ0FFVU5IQ0FESUFCQkFXc1FVZ3djQ3lBRVFjd0FhaUlBSUFNb0Fwd0JJZ1VnQXlnQ29BRWlBU0FES0FKSUlBTW9Ba3hCQUJBZklBUkI4QUJxSWdZZ0JTQUJRUUZCQUVFQUVCOGdFUkNnQVNBRElBQkJKQkFXSVFBZ0R4Q2dBU0FRSUFaQkpCQVdHaUFBUVFBNkFMd0JJQVJCbEFGcUlnWWdCUkE1SUFBb0FsQWdBRUhVQUdvb0FnQkJCRUVFRUo4QklBeEJDR29nQmtFSWFpSUZLQUlBTmdJQUlBd2dCQ2tDbEFFM0FnQWdBRUVBT3dHNkFTQUFRUUk2QUxZQklBQkJBam9Bc2dFZ0FFRUJPZ0J3SUFCQ0FEY0NhQ0FBUVFBN0FiQUJJQUJCZ0lBRU5nQzlBU0FBSUFGQkFXczJBcXdCSUFCQ0FEY0NwQUVnQUVHQWdJQUlOZ0tZQVNBQVFRSTZBSlFCSUFCQkFqb0FrQUVnQUVFQU5nS01BU0FBUW9DQWdBZzNBb1FCSUFCQkFqb0FnQUVnQUVFQ09nQjhJQUJDQURjQ2RDQUdJQUVRVlNBQUtBSmNJQUJCNEFCcUtBSUFRUUZCQVJDZkFTQUxRUWhxSUFVb0FnQTJBZ0FnQ3lBRUtRS1VBVGNDQUF3YkN5QUVLQUpJSVFFZ0JDZ0NSQ0VBSUFRZ0JDZ0NRRFlDZUNBRUlBQTJBbkFnQkNBQlFRRjBJZ0VnQUdvaUJUWUNmQU5BSUFFRVFBSkFJQUF2QVFCQkZFY0VRQ0FEUVFBNkFMMEJEQUVMSUFOQkFEb0F3QUVMSUFCQkFtb2hBQ0FCUVFKcklRRU1BUXNMSUFRZ0JUWUNkQ0FFUWZBQWFoQ3FBUXdhQ3lBREVJa0JEQmtMSUFNUVpRd1lDeUFEUVFFZ0JDOEJQaUlBSUFCQkFVMGJFSVlCREJjTElBUW9Ba2hCQld3aEFTQURMUUM3QVNFRklBUW9Ba0FnQkNnQ1JDSUtJUUFEUUFKQUlBRkZEUUFnQUNnQUFTRUdBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FnQUMwQUFFRUJhdzRTQVFJREJBVUdCd2dKQ2dzTURRNFBFQkVUQUF0QkFDRUZJQU5CQURzQnVnRWdBMEVDT2dDMkFTQURRUUk2QUxJQkRCRUxJQU5CQVRvQXVnRU1FQXNnQTBFQ09nQzZBUXdQQ3lBRElBVkJBWElpQlRvQXV3RU1EZ3NnQXlBRlFRSnlJZ1U2QUxzQkRBMExJQU1nQlVFSWNpSUZPZ0M3QVF3TUN5QURJQVZCRUhJaUJUb0F1d0VNQ3dzZ0F5QUZRUVJ5SWdVNkFMc0JEQW9MSUFOQkFEb0F1Z0VNQ1FzZ0F5QUZRZjRCY1NJRk9nQzdBUXdJQ3lBRElBVkIvUUZ4SWdVNkFMc0JEQWNMSUFNZ0JVSDNBWEVpQlRvQXV3RU1CZ3NnQXlBRlFlOEJjU0lGT2dDN0FRd0ZDeUFESUFWQit3RnhJZ1U2QUxzQkRBUUxJQWNnQmpZQkFBd0RDeUFIUVFJNkFBQU1BZ3NnQXlBR05nRzJBUXdCQ3lBRFFRSTZBTFlCQ3lBQVFRVnFJUUFnQVVFRmF5RUJEQUVMQ3lBS1FRRkJCUkNmQVF3V0N5QURRUUEyQXFRQkRCVUxJQVFvQWtnaEFTQUVLQUpFSVFBZ0JDQUVLQUpBTmdKNElBUWdBRFlDY0NBRUlBRkJBWFFpQVNBQWFpSUZOZ0o4QTBBZ0FRUkFBa0FnQUM4QkFFRVVSd1JBSUFOQkFUb0F2UUVNQVFzZ0EwRUJPZ0RBQVFzZ0FFRUNhaUVBSUFGQkFtc2hBUXdCQ3dzZ0JDQUZOZ0owSUFSQjhBQnFFS29CREJRTElBTkJBVFlDcEFFTUV3c2dBMEVCSUFRdkFUNGlBQ0FBUVFGTkd4Q0hBUXdTQ3lBRUxRQTlEUUVMSXdCQkVHc2lBQ1FBSUFCQkNHb2dBeWdDVkNJR0lBTW9BbGdpQVNBREtBSm9FRHdDUUFKQUlBQW9BZ2hGQkVBZ0FDZ0NEQ0lGSUFGUERRRWdCaUFGUVFKMGFpSUdJQVpCQkdvZ0FTQUZRWDl6YWtFQ2RCQVNJQU1nQVVFQmF6WUNXQXNnQUVFUWFpUUFEQUVMSXdCQk1Hc2lBQ1FBSUFBZ0FUWUNCQ0FBSUFVMkFnQWdBRUVETmdJTUlBQkJ5TVhBQURZQ0NDQUFRZ0kzQWhRZ0FDQUFRUVJxclVLQWdJQ0E0QUdFTndNb0lBQWdBSzFDZ0lDQWdPQUJoRGNESUNBQUlBQkJJR28yQWhBZ0FFRUlha0hNNHNBQUVJb0JBQXNNRUFzZ0EwRUFOZ0pZREE4TElBTkJBU0FFTHdFK0lnQWdBRUVCVFJ0QkFXc1FVZ3dPQ3lBRFFRRWdCQzhCUGlJQUlBQkJBVTBiRUY4TURRc2dBeTBBd2dGQkFVY05EQ0FESUFRdkFUNGlBQ0FES0FLY0FTQUFHeUFFTHdGQUlnQWdBeWdDb0FFZ0FCc1FKUXdNQ3lBRElBQTJBc1FCSUFOQkNUb0F6QVVNQ2dzZ0FTQUdRYmpsd0FBUVN3QUxJQU5CQVJDR0FRd0pDd0FMUVFBTElnQWdBeWdDbkFFaUFVRUJheUFBSUFGSkd6WUNhQXdHQ3lBSklBQTJBZ0FNQkFzZ0F5QUFOZ0xFQVNBRFFRVTZBTXdGREFNTElBTkJBRG9BekFVTUFnc2dBMEVHT2dETUJRd0JDeUFKS0FLRUJDRUJBa0FDUUFKQUFrQUNRQ0FBUVRwckRnSUJBQUlMSUFsQkh5QUJRUUZxSWdBZ0FFRWdSaHMyQW9RRURBTUxJQUZCSUVrTkFTQUJRU0JCNU52QUFCQkxBQXNnQVVFZ1R3UkFJQUZCSUVIMDI4QUFFRXNBQ3lBSklBRkJCSFJxUVFScUlnVW9BZ0FpQVVFR1NRUkFJQVVnQVVFQmRHcEJCR29pQVNBQkx3RUFRUXBzSUFCQk1HdEIvd0Z4YWpzQkFBd0NDeUFCUVFaQnRPSEFBQkJMQUFzZ0NTQUJRUVIwYWtFRWFpSUJLQUlBUVFGcUlRQWdBVUVGSUFBZ0FFRUZUeHMyQWdBTEN5QUVRVEk2QUR3TUFBc0FDOThVQVFaL0l3QkJ3QUpySWdJa0FDQUJLQUlFSVFNRFFBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUlBTUVRQ0FDUWJnQ2FpQUJLQUlBRUdrZ0FpZ0N1QUloQXlBQ0tBSzhBa0VCYXc0R0FRVUVCUUlEQlFzZ0FFRVNPZ0FBREFzTEFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFJQU12QVFBaUF3NGVBQUVDQXdRRkRnWU9CdzRPRGc0T0RnNE9EZzRPQ0FnSkNnc09EQTRORGdzZ0FrR29BV3BCQVNBQktBSUFJQUVvQWdSQjFOekFBQkNCQVNBQklBSXBBNmdCTndJQUlBQkJBRG9BQUF3WUN5QUNRYkFCYWtFQklBRW9BZ0FnQVNnQ0JFSGszTUFBRUlFQklBRWdBaWtEc0FFM0FnQWdBRUVCT2dBQURCY0xJQUpCdUFGcVFRRWdBU2dDQUNBQktBSUVRZlRjd0FBUWdRRWdBU0FDS1FPNEFUY0NBQ0FBUVFJNkFBQU1GZ3NnQWtIQUFXcEJBU0FCS0FJQUlBRW9BZ1JCaE4zQUFCQ0JBU0FCSUFJcEE4QUJOd0lBSUFCQkF6b0FBQXdWQ3lBQ1FjZ0Jha0VCSUFFb0FnQWdBU2dDQkVHVTNjQUFFSUVCSUFFZ0Fpa0R5QUUzQWdBZ0FFRUVPZ0FBREJRTElBSkIwQUZxUVFFZ0FTZ0NBQ0FCS0FJRVFhVGR3QUFRZ1FFZ0FTQUNLUVBRQVRjQ0FDQUFRUVU2QUFBTUV3c2dBa0hZQVdwQkFTQUJLQUlBSUFFb0FnUkJ0TjNBQUJDQkFTQUJJQUlwQTlnQk53SUFJQUJCQmpvQUFBd1NDeUFDUWVBQmFrRUJJQUVvQWdBZ0FTZ0NCRUhFM2NBQUVJRUJJQUVnQWlrRDRBRTNBZ0FnQUVFSE9nQUFEQkVMSUFKQjZBRnFRUUVnQVNnQ0FDQUJLQUlFUWRUZHdBQVFnUUVnQVNBQ0tRUG9BVGNDQUNBQVFRZzZBQUFNRUFzZ0FrSHdBV3BCQVNBQktBSUFJQUVvQWdSQjVOM0FBQkNCQVNBQklBSXBBL0FCTndJQUlBQkJDVG9BQUF3UEN5QUNRZmdCYWtFQklBRW9BZ0FnQVNnQ0JFSDAzY0FBRUlFQklBRWdBaWtEK0FFM0FnQWdBRUVLT2dBQURBNExJQUpCZ0FKcVFRRWdBU2dDQUNBQktBSUVRWVRld0FBUWdRRWdBU0FDS1FPQUFqY0NBQ0FBUVFzNkFBQU1EUXNnQWtHSUFtcEJBU0FCS0FJQUlBRW9BZ1JCbE43QUFCQ0JBU0FCSUFJcEE0Z0NOd0lBSUFCQkREb0FBQXdNQ3lBQ1FaQUNha0VCSUFFb0FnQWdBU2dDQkVHazNzQUFFSUVCSUFFZ0Fpa0RrQUkzQWdBZ0FFRU5PZ0FBREFzTEFrQUNRQ0FEUVI1clFmLy9BM0ZCQ0U4RVFDQURRU1pyRGdJQkNBSUxJQUpCQ0dwQkFTQUJLQUlBSUFFb0FnUkJ4T0RBQUJDQkFTQUJJQUlwQXdnM0FnQWdBQ0FEUVI1ck9nQUNJQUJCRGpzQUFBd01Dd0pBSUFFb0FnUWlBMEVDVHdSQUlBSkJtQUZxSUFFb0FnQkJFR29RYVNBQ0tBS1lBU0lERFFFZ0FTZ0NCQ0VEQ3lBQ1FlZ0Fha0VCSUFFb0FnQWdBMEcwM3NBQUVJRUJJQUlvQW13aEF5QUNLQUpvSVFRTURRc0NRQUpBQWtBZ0FpZ0NuQUZCQVVjTkFDQURMd0VBUVFKckRnUUJBQUFDQUFzZ0FrSHdBR3BCQVNBQktBSUFJQUVvQWdSQmhOL0FBQkNCQVNBQ0tBSjBJUU1nQWlnQ2NDRUVEQTRMSUFFb0FnQWhBeUFCS0FJRUlnUkJCVThFUUNBRExRQWtJUVVnQXk4Qk5DRUdJQU12QVVRaEJ5QUNRWUFCYWtFRklBTWdCRUhFM3NBQUVJRUJJQUVnQWlrRGdBRTNBZ0FnQUVFT09nQUFJQUFnQlNBR1FRaDBRWUQrQTNFZ0IwRVFkSEp5UVFoMFFRRnlOZ0FCREEwTElBSkIrQUJxUVFJZ0F5QUVRZFRld0FBUWdRRWdBaWdDZkNFRElBSW9BbmdoQkF3TkN5QUJLQUlBSVFNZ0FTZ0NCQ0lFUVFOUEJFQWdBeTBBSkNFRklBSkJrQUZxUVFNZ0F5QUVRZVRld0FBUWdRRWdBU0FDS1FPUUFUY0NBQ0FBSUFVNkFBSWdBRUVPT3dBQURBd0xJQUpCaUFGcVFRSWdBeUFFUWZUZXdBQVFnUUVnQWlnQ2pBRWhBeUFDS0FLSUFTRUVEQXdMQWtBQ1FDQURRZmovQTNGQktFY0VRQ0FEUVRCckRnSUJDUUlMSUFKQkVHcEJBU0FCS0FJQUlBRW9BZ1JCdE9EQUFCQ0JBU0FCSUFJcEF4QTNBZ0FnQUNBRFFTaHJPZ0FDSUFCQkVEc0FBQXdNQ3dKQUlBRW9BZ1FpQTBFQ1R3UkFJQUpCMkFCcUlBRW9BZ0JCRUdvUWFTQUNLQUpZSWdNTkFTQUJLQUlFSVFNTElBSkJLR3BCQVNBQktBSUFJQU5CcE4vQUFCQ0JBU0FDS0FJc0lRTWdBaWdDS0NFRURBMExBa0FDUUFKQUlBSW9BbHhCQVVjTkFDQURMd0VBUVFKckRnUUJBQUFDQUFzZ0FrRXdha0VCSUFFb0FnQWdBU2dDQkVIMDM4QUFFSUVCSUFJb0FqUWhBeUFDS0FJd0lRUU1EZ3NnQVNnQ0FDRURJQUVvQWdRaUJFRUZUd1JBSUFNdEFDUWhCU0FETHdFMElRWWdBeThCUkNFSElBSkJRR3RCQlNBRElBUkJ0Ti9BQUJDQkFTQUJJQUlwQTBBM0FnQWdBRUVRT2dBQUlBQWdCU0FHUVFoMFFZRCtBM0VnQjBFUWRISnlRUWgwUVFGeU5nQUJEQTBMSUFKQk9HcEJBaUFESUFSQnhOL0FBQkNCQVNBQ0tBSThJUU1nQWlnQ09DRUVEQTBMSUFFb0FnQWhBeUFCS0FJRUlnUkJBMDhFUUNBRExRQWtJUVVnQWtIUUFHcEJBeUFESUFSQjFOL0FBQkNCQVNBQklBSXBBMUEzQWdBZ0FDQUZPZ0FDSUFCQkVEc0FBQXdNQ3lBQ1FjZ0Fha0VDSUFNZ0JFSGszOEFBRUlFQklBSW9Ba3doQXlBQ0tBSklJUVFNREFzZ0EwSGFBR3RCLy84RGNVRUlTUTBISUFOQjVBQnJRZi8vQTNGQkNFOE5BeUFDUVNCcVFRRWdBU2dDQUNBQktBSUVRWlRnd0FBUWdRRWdBU0FDS1FNZ053SUFJQUFnQTBIY0FHczZBQUlnQUVFUU93QUFEQW9MSUFNdkFRQWlCRUV3UndSQUlBUkJKa2NOQXlBREx3RUNRUUpIRFFOQkNDRUVRUVloQlVFRUlRWU1DUXNnQXk4QkFrRUNSdzBDUVFnaEJFRUdJUVZCQkNFR0RBY0xJQU12QVFBaUJFRXdSd1JBSUFSQkprY05BaUFETHdFQ1FRSkhEUUpCQ2lFRVFRZ2hCVUVHSVFZTUNBc2dBeThCQWtFQ1J3MEJRUW9oQkVFSUlRVkJCaUVHREFZTElBTXZBUUFpQkVFd1J3UkFJQVJCSmtjTkFTQURMd0VDUVFWSERRRWdBeTBBQkNFRElBSkJxQUpxUVFFZ0FTZ0NBQ0FCS0FJRVFmVGd3QUFRZ1FFZ0FTQUNLUU9vQWpjQ0FDQUFJQU02QUFJZ0FFRU9Pd0FBREFnTElBTXZBUUpCQlVZTkFRc2dBa0VCSUFFb0FnQWdBU2dDQkVHVTRjQUFFSUVCSUFJb0FnUWhBeUFDS0FJQUlRUU1Cd3NnQXkwQUJDRURJQUpCc0FKcVFRRWdBU2dDQUNBQktBSUVRWVRod0FBUWdRRWdBU0FDS1FPd0FqY0NBQ0FBSUFNNkFBSWdBRUVRT3dBQURBVUxJQUpCb0FGcVFRRWdBU2dDQUNBQktBSUVRWlRmd0FBUWdRRWdBU0FDS1FPZ0FUY0NBQ0FBUVE4NkFBQU1CQXNnQWtIZ0FHcEJBU0FCS0FJQUlBRW9BZ1JCaE9EQUFCQ0JBU0FCSUFJcEEyQTNBZ0FnQUVFUk9nQUFEQU1MSUFKQkdHcEJBU0FCS0FJQUlBRW9BZ1JCcE9EQUFCQ0JBU0FCSUFJcEF4ZzNBZ0FnQUNBRFFkSUFhem9BQWlBQVFRNDdBQUFNQWdzZ0F5QUdhaTBBQUNFR0lBTWdCV292QVFBaEJTQURJQVJxTHdFQUlRTWdBa0dnQW1wQkFTQUJLQUlBSUFFb0FnUkI1T0RBQUJDQkFTQUJJQUlwQTZBQ053SUFJQUJCRURvQUFDQUFJQVlnQlVFSWRFR0EvZ054SUFOQkVIUnlja0VJZEVFQmNqWUFBUXdCQ3lBQ1FaZ0Nha0VCSUFFb0FnQWdBU2dDQkVIVTRNQUFFSUVCSUFFZ0Fpa0RtQUkzQWdBZ0F5QUdhaTBBQUNFQklBTWdCV292QVFBaEJTQURJQVJxTHdFQUlRTWdBRUVPT2dBQUlBQWdBU0FGUVFoMFFZRCtBM0VnQTBFUWRISnlRUWgwUVFGeU5nQUJDeUFDUWNBQ2FpUUFEd3NnQVNBRU5nSUFJQUVnQXpZQ0JBd0FDd0FML3hJQ0pIOEJmaU1BUWZBQWF5SURKQUFnQTBFMGFpQUFFRjRnQXlnQ05DSUZRUUEyQW9nR0lBVkJBRFlDL0FVZ0JVRUFOZ0x3QlNBRlFRQTJBdVFGSUFWQkFEWUMyQVVnQlMwQWNFRUJjUVJBSUFVb0Ftd2dBVVlnQWtFQVIzRWhJU0FGS0FKb0lRWUxJQU5CS0dvZ0JSQndJQU1vQWl3aUFDQUJTd1JBSUFWQmdBWnFJUjBnQlVIOEJXb2hGQ0FGUWZRRmFpRWVJQVZCOEFWcUlSVWdCVUhvQldvaEh5QUZRZHdGYWlFV0lBVkIwQVZxSVJnZ0F5Z0NLQ0FCUVFSMGFpSUJLQUlFSVFBZ0FDQUJLQUlJUVJSc2FpRWlJQU5CMWdCcUlTTWdBMEhRQUdvaUFVRUVjaUVrSUFaQi8vOERjU0VsSUFGQkNXb2hKa0VGSVFGQkJTRUpBMEFDUUFKQUFrQWdBQ0lJSUNKSEJFQWdDRUVVYWlFQUlBZ29BZ1FpRGtVTkJDQUlLQUlBSVFZZ0NFRUlhaUVnQWtBQ1FDQURBbjhDUUNBaElDVWdEMEgvL3dOeElobEdjU0FJUVJGcUloQXRBQUJCRUhGQkJIWkhCRUJCQVNBZ0tBQUFJZ1JCL3dGeFFRSkdEUUlhSUFSQkFYRU5BU0FFUVlEK0EzRkJBM0lNQWdzZ0EwRUZJQWdvQUF3aUFrR0FmbkZCQkVFRElBSkJBWEViY2lBQ1FmOEJjVUVDUmhzaUJEWUNiRUVBSVFvZ0NDZ0FDQ0lIUWY4QmNVRUNSdzBDUVFBaEFnd0hDeUFFUVlCK2NVRUVjZ3NpQkRZQ2JFRUNJUUlnQ0NnQURDSUhRZjhCY1VFQ1J3MEJRUUFoQ2d3RkN5QUhRUWgySVFvZ0IwRUJjUTBEUVFNaEFpQUhRWUR3QTNFTkJDQUZMUUNNQmtFQlJ3MEVEQUlMSUFkQkNIWWhDaUFIUVFGeERRSkJBeUVDSUFkQmdQQURjUTBESUFVdEFJd0dEUUVNQXdzZ0NVSC9BWEZCQlVjRVFDQVlJQkd0SUFtdFF2OEJnMElnaGlBYXJVSW9ob1NFUWZ6Q3dBQVFlZ3NnQVVIL0FYRkJCVWNFUUNBRElBczdBRmNnQTBIWkFHb2dDMEVRZGpvQUFDQURJQXc2QUZvZ0F5QUJPZ0JXSUFNZ0RUc0JWQ0FESUJjMkFsQWdGaUFEUWRBQWFrR013OEFBRUdNTElBVW9Bb2dHSVFFZ0JTZ0NoQVloQWlBRktBTDhCU0VFSUFVb0F2Z0ZJUWdnQlNnQzhBVWhGQ0FGS0FMc0JTRVZJQVVvQXVRRklRWWdCU2dDNEFVaEJ5QUZLQUxZQlNFSklBVW9BdFFGSVFVZ0EwRUFOZ0pzSUFOQklHb2dBMEhzQUdvUUJpSUFRZC9Cd0FCQkFpQUZJQWtRR3dKQUFuOGdBeWdDSUFSQUlBTW9BaVFNQVFzZ0EwRVlhaUFEUWV3QWFpQUFRZUhCd0FCQkJDQUhJQVlRR3lBREtBSVlCRUFnQXlnQ0hBd0JDeUFEUVJCcUlBTkI3QUJxSUFCQjVjSEFBRUVLSUFJZ0FSQWJJQU1vQWhBRVFDQURLQUlVREFFTElBTkJDR29nQTBIc0FHb2dBRUh2d2NBQVFRNGdGU0FVRUJzZ0F5Z0NDQVJBSUFNb0Fnd01BUXNnQXlBRFFld0FhaUFBUWYzQndBQkJEaUFJSUFRUUd5QURLQUlBUlEwQklBTW9BZ1FMSVFFZ0FCQ3BBU0FESUFFMkFtd2dBMEhzQUdwQm5NUEFBQkJDQUFzZ0F5Z0NPQ0FES0FJOEVMSUJJQU5COEFCcUpBQWdBQThMSUFwQkNISWdDaUFJTFFBUVFRRkdHeUVLREFFTFFRUWhBZ3NnQXlBS1FRaDBRWUQrQTNFZ0IwR0FnSHh4Y2lJS0lBSnlJZ2MyQWtBZ0EwRUFJQU5CN0FCcUloSWdCRUgvQVhGQkJVWWlCQnMyQWxnZ0F5QVJyU0FKclVML0FZTkNJSVlnR3ExQ0tJYUVoQ0luTndOUUFrQWdDVUgvQVhGQkJVWUVRRUVGSVFrZ0JBMEJJQTVCRUhRZ0dYSWhFU0FTRUZraUNVRUlkaUVhREFFTElBUkZCRUFnSkNBRFFld0FhaUlFRUZGRkJFQWdHQ0FuUWJ6RHdBQVFlaUFPUVJCMElCbHlJUkVnQkJCWklnbEJDSFloR2d3Q0N5QU9RUkIwSUJGcUlSRU1BUXNnR0NBblFhekR3QUFRZWtFRklRa0xRWWpCd0FBZ0JoQjVJUVFDUUFKQUFrQUNRQUovQWtBZ0JrR2d5d0JHRFFBZ0JBMEFRWlRCd0FBZ0JoQjVEUUJCMk1EQUFDQUdFSGtoQkFKQUlBWkJqODBBUmcwQUlBUU5BRUhrd01BQUlBWVFlUTBBUWZEQXdBQWdCaEI1RFFCQi9NREFBQ0FHRUhsRkRRTUxJQU5CUUdzUVdTRVNJQkF0QUFCQkFuUkIvQUJ4UVFJZ0NFRVFhaTBBQUNJRVFRRkdJQVJCQWtZYmNrSC9BWEVoRXlBZUtBSUFJaHNnRkNnQ0FDSUhSZ1JBSXdCQkVHc2lCQ1FBSUFSQkNHb2dIaUFiUVFGQkJFRVFFQ1lnQkNnQ0NDSWJRWUdBZ0lCNFJ3UkFJQVFvQWd3YUlCdEJ6TVBBQUJDdUFRQUxJQVJCRUdva0FBc2dCU2dDK0FVZ0IwRUVkR29pQkNBVE9nQU1JQVFnRWpZQ0NDQUVJQVkyQWdRZ0JDQVBPd0VBSUJRTUFRc2dBMEZBYXhCWklSSWdIeWdDQUNJVElCVW9BZ0FpQjBZRVFDTUFRUkJySWdRa0FDQUVRUWhxSUI4Z0UwRUJRUVJCREJBbUlBUW9BZ2dpRTBHQmdJQ0FlRWNFUUNBRUtBSU1HaUFUUWR6RHdBQVFyZ0VBQ3lBRVFSQnFKQUFMSUFVb0F1d0ZJQWRCREd4cUlnUWdFallDQ0NBRUlBWTJBZ1FnQkNBUE93RUFJQlVMSUFkQkFXbzJBZ0JCSUNFR0RBRUxJQVpCZ0FGSkRRQWdEa0gvL3dOeFFRRkxEUUVnQmtILy93Tk5CRUFnQmtFRGRrSEFnTUFBYWkwQUFDQUdRUWR4ZGtFQmNVVU5BUXdDQzBITXdNQUFJQVlRZVEwQkN5QURJQXM3QUZjZ0ppQUxRUkIySWdRNkFBQWdBeUFnTmdKY0lBTWdERG9BV2lBRElBMDdBVlFnQXlBWE5nSlFJQU1nQVRvQVZnSkFJQUZCL3dGeFFRVkdEUUFDUUNBRFFVQnJJQ01RVVFSQUlCQXRBQUJCQW5SQi9BQnhRUUlnQ0VFUWFpMEFBQ0lIUVFGR0lBZEJBa1liY2tHL0FYRWdESE5CdndGeFJRMEJDd0pBSUFaQklFY05BQ0FNUVFoeFFRTjJJQkF0QUFBaUIwRUNjVUVCZGtjTkFDQU1RUkJ4UVFSMklBZEJCSEZCQW5aR0RRRUxJQU1nQ3pzQVp5QURRZUFBYWlJSFFRbHFJQVE2QUFBZ0F5QU1PZ0JxSUFNZ0FUb0FaaUFESUEwN0FXUWdBeUFYTmdKZ0lCWWdCMEhzdzhBQUVHTU1BUXNnRFVFQmFpRU5JQUVoQWd3Q0N5QWNRUkIwSUJseUlSY2dFQzBBQUVFQ2RFSDhBSEZCQWlBSVFSQnFMUUFBSWdGQkFVWWdBVUVDUmh0eVFmOEJjU0VNSUFwQkNIWWhDMEVCSVEwTUFRc2dBVUgvQVhGQkJVY0VRQ0FESUFzN0FFc2dBMEhFQUdvaUFrRUphaUFMUVJCMk9nQUFJQU1nRERvQVRpQURJQUU2QUVvZ0F5QU5Pd0ZJSUFNZ0Z6WUNSQ0FXSUFKQi9NUEFBQkJqQ3lBUUxRQUFJUUlnQ0VFUWFpMEFBQ0VCSUFNZ0J6WUJWaUFEUVFFN0FWUWdBeUFjT3dGU0lBTWdEenNCVUNBRElBSkJBblJCL0FCeFFRSWdBVUVCUmlBQlFRSkdHM0k2QUZvZ0ZpQURRZEFBYWtHTXhNQUFFR05CQlNFQ0N5QUZLQUtJQmlJRUlBVW9Bb0FHUmdSQUl3QkJFR3NpQVNRQUlBRkJDR29nSFNBZEtBSUFRUUZCQkVFRUVDWWdBU2dDQ0NJSVFZR0FnSUI0UndSQUlBRW9BZ3dhSUFoQm5NVEFBQkN1QVFBTElBRkJFR29rQUFzZ0hFRUJhaUVjSUFVb0FvUUdJQVJCQW5ScUlBWTJBZ0FnQlNBRVFRRnFOZ0tJQmlBT0lBOXFJUThnQWlFQkRBQUxBQXNnQVNBQVFaamx3QUFRU3dBTHVRNEJBMzhqQUVIZ0FHc2lBeVFBSUFGQkJHb2hCQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBZ0FTZ0NBQ0lGUVlDQXhBQkdCRUFnQWtGQWFnNDJBUUlEQkFVR0J3Z0pDZ3NNRFE0M053ODNOeEFSTnpjU0V6Y1VOemMzTnpjVkZoYzNHQmthR3h3M056Y2RIamMzTnpjZklESWhOd3NDUUNBQ1Fld0FhdzRGTlRjM056TUFDeUFDUWVnQVJnMHpERFlMSUFCQkhUb0FBQ0FBSUFFdkFRZzdBUUlNTmdzZ0FFRU1PZ0FBSUFBZ0FTOEJDRHNCQWd3MUN5QUFRUWs2QUFBZ0FDQUJMd0VJT3dFQ0REUUxJQUJCQ2pvQUFDQUFJQUV2QVFnN0FRSU1Nd3NnQUVFSU9nQUFJQUFnQVM4QkNEc0JBZ3d5Q3lBQVFRUTZBQUFnQUNBQkx3RUlPd0VDRERFTElBQkJCVG9BQUNBQUlBRXZBUWc3QVFJTU1Bc2dBRUVDT2dBQUlBQWdBUzhCQ0RzQkFnd3ZDeUFBUVFzNkFBQWdBQ0FCTHdFWU93RUVJQUFnQVM4QkNEc0JBZ3d1Q3lBQVFRTTZBQUFnQUNBQkx3RUlPd0VDREMwTElBRXZBUWdPQkJjWUdSb1dDeUFCTHdFSURnTWJIQjBhQ3lBQVFSNDZBQUFnQUNBQkx3RUlPd0VDRENvTElBQkJGVG9BQUNBQUlBRXZBUWc3QVFJTUtRc2dBRUVOT2dBQUlBQWdBUzhCQ0RzQkFnd29DeUFBUVMwNkFBQWdBQ0FCTHdFSU93RUNEQ2NMSUFCQktEb0FBQ0FBSUFFdkFRZzdBUUlNSmdzZ0FTOEJDQTRHR1JnYUdCZ2JHQXNnQUVFV09nQUFJQUFnQVM4QkNEc0JBZ3drQ3lBQVFRRTZBQUFnQUNBQkx3RUlPd0VDRENNTElBQkJBam9BQUNBQUlBRXZBUWc3QVFJTUlnc2dBRUVLT2dBQUlBQWdBUzhCQ0RzQkFnd2hDeUFBUVNJNkFBQWdBQ0FCTHdFSU93RUNEQ0FMSUFCQkx6b0FBQ0FBSUFFdkFRZzdBUUlNSHdzZ0FFRXdPZ0FBSUFBZ0FTOEJDRHNCQWd3ZUN5QUFRUXM2QUFBZ0FDQUJMd0VZT3dFRUlBQWdBUzhCQ0RzQkFnd2RDeUFCTHdFSURnUVVFeE1WRXdzZ0F5QUVJQUVvQW9RRVFZVGN3QUFRZGlBRFFVQnJJZ0VnQXlnQ0FDSUNJQUlnQXlnQ0JFRUVkR29RS0NBRFFUdHFJQUZCQ0dvb0FnQTJBQUFnQXlBREtRSkFOd0F6SUFCQkt6b0FBQ0FBSUFNcEFEQTNBQUVnQUVFSWFpQURRVGRxS1FBQU53QUFEQnNMSUFOQkNHb2dCQ0FCS0FLRUJFR1UzTUFBRUhZZ0EwRkFheUlCSUFNb0FnZ2lBaUFDSUFNb0FneEJCSFJxRUNnZ0EwRTdhaUFCUVFocUtBSUFOZ0FBSUFNZ0F5a0NRRGNBTXlBQVFTVTZBQUFnQUNBREtRQXdOd0FCSUFCQkNHb2dBMEUzYWlrQUFEY0FBQXdhQ3lBRFFSaHFJQVFnQVNnQ2hBUkJwTnpBQUJCMklBTWdBeWtER0RjQ1RDQURRZFlBYWlBRFFjd0FhaEFNQW44Z0F5MEFWa0VTUmdSQVFRQWhBVUVBSVFSQkFRd0JDeUFEUVJCcVFRUkJBVUVGUVpUSXdBQVFZQ0FEUWRvQWFpMEFBQ0VCSUFNb0FoQWhBaUFES0FJVUlnUWdBeWdBVmpZQUFDQUVRUVJxSUFFNkFBQWdBMEVCTmdJNElBTWdCRFlDTkNBRElBSTJBakFnQXlBREtRSk1Od0pBUVFVaEFrRUJJUUVEUUNBRFFkc0FhaUFEUVVCckVBd2dBeTBBVzBFU1JrVUVRQ0FES0FJd0lBRkdCRUFnQTBFd2FpQUJRUUZCQVVFRkVHMGdBeWdDTkNFRUN5QUNJQVJxSWdVZ0F5Z0FXellBQUNBRlFRUnFJQU5CM3dCcUxRQUFPZ0FBSUFNZ0FVRUJhaUlCTmdJNElBSkJCV29oQWd3QkN3c2dBeWdDTUNFRUlBTW9BalFMSVFJZ0FDQUJOZ0lNSUFBZ0FqWUNDQ0FBSUFRMkFnUWdBRUVwT2dBQURCa0xJQUJCRXpvQUFDQUFJQUV2QVJnN0FRUWdBQ0FCTHdFSU93RUNEQmdMSUFCQkp6b0FBQXdYQ3lBQVFTWTZBQUFNRmdzZ0FFRXlPZ0FBREJVTElBQkJGenNCQUF3VUN5QUFRWmNDT3dFQURCTUxJQUJCbHdRN0FRQU1FZ3NnQUVHWEJqc0JBQXdSQ3lBQVFUSTZBQUFNRUFzZ0FFRVlPd0VBREE4TElBQkJtQUk3QVFBTURnc2dBRUdZQkRzQkFBd05DeUFBUVRJNkFBQU1EQXNnQUVFSE93RUFEQXNMSUFCQmh3STdBUUFNQ2dzZ0FFR0hCRHNCQUF3SkN5QUFRVEk2QUFBTUNBc2dBRUV1T3dFQURBY0xJQUJCcmdJN0FRQU1CZ3NnQVM4QkNFRUlSZzBESUFCQk1qb0FBQXdGQ3lBRlFTRkhEUU1nQUVFVU9nQUFEQVFMSUFWQlAwY05BaUFEUVNCcUlBUWdBU2dDaEFSQnROekFBQkIySUFOQlFHc2lBU0FES0FJZ0lnSWdBaUFES0FJa1FRUjBhaEFwSUFOQk8yb2dBVUVJYWlnQ0FEWUFBQ0FESUFNcEFrQTNBRE1nQUVFU09nQUFJQUFnQXlrQU1EY0FBU0FBUVFocUlBTkJOMm9wQUFBM0FBQU1Bd3NnQlVFL1J3MEJJQU5CS0dvZ0JDQUJLQUtFQkVIRTNNQUFFSFlnQTBGQWF5SUJJQU1vQWlnaUFpQUNJQU1vQWl4QkJIUnFFQ2tnQTBFN2FpQUJRUWhxS0FJQU5nQUFJQU1nQXlrQ1FEY0FNeUFBUVJBNkFBQWdBQ0FES1FBd053QUJJQUJCQ0dvZ0EwRTNhaWtBQURjQUFBd0NDeUFBUVRFNkFBQWdBQ0FCTHdFWU93RUVJQUFnQVM4QktEc0JBZ3dCQ3lBQVFUSTZBQUFMSUFOQjRBQnFKQUFMbVFvQkNuOENRQUpBQWtBZ0FDZ0NBQ0lGSUFBb0FnZ2lBM0lFUUFKQUlBTkJBWEZGRFFBZ0FTQUNhaUVHQWtBZ0FDZ0NEQ0lKUlFSQUlBRWhCQXdCQ3lBQklRUURRQ0FFSUFaR0RRSUNmeUFFSWdNc0FBQWlCRUVBVGdSQUlBTkJBV29NQVFzZ0EwRUNhaUFFUVdCSkRRQWFJQU5CQTJvZ0JFRndTUTBBR2lBRFFRUnFDeUlFSUFOcklBZHFJUWNnQ1NBSVFRRnFJZ2hIRFFBTEN5QUVJQVpHRFFBQ1FDQUVMQUFBUVFCT0RRQUxJQWNnQWdKL0FrQWdCMFVOQUNBQ0lBZE5CRUFnQWlBSFJnMEJRUUFNQWdzZ0FTQUhhaXdBQUVGQVRnMEFRUUFNQVFzZ0FRc2lBeHNoQWlBRElBRWdBeHNoQVFzZ0JVVU5BeUFBS0FJRUlRc2dBa0VRVHdSQUlBRWdBVUVEYWtGOGNTSUhheUlJSUFKcUlncEJBM0VoQ1VFQUlRVkJBQ0VESUFFZ0IwY0VRQ0FJUVh4TkJFQkJBQ0VHQTBBZ0F5QUJJQVpxSWdRc0FBQkJ2MzlLYWlBRVFRRnFMQUFBUWI5L1Ntb2dCRUVDYWl3QUFFRy9mMHBxSUFSQkEyb3NBQUJCdjM5S2FpRURJQVpCQkdvaUJnMEFDd3NnQVNFRUEwQWdBeUFFTEFBQVFiOS9TbW9oQXlBRVFRRnFJUVFnQ0VFQmFpSUlEUUFMQ3dKQUlBbEZEUUFnQnlBS1FYeHhhaUlFTEFBQVFiOS9TaUVGSUFsQkFVWU5BQ0FGSUFRc0FBRkJ2MzlLYWlFRklBbEJBa1lOQUNBRklBUXNBQUpCdjM5S2FpRUZDeUFLUVFKMklRWWdBeUFGYWlFRkEwQWdCeUVJSUFaRkRRUkJ3QUVnQmlBR1FjQUJUeHNpQ1VFRGNTRUtJQWxCQW5RaEIwRUFJUVFnQmtFRVR3UkFJQWdnQjBId0IzRnFJUXdnQ0NFREEwQWdCQ0FES0FJQUlnUkJmM05CQjNZZ0JFRUdkbkpCZ1lLRUNIRnFJQU1vQWdRaUJFRi9jMEVIZGlBRVFRWjJja0dCZ29RSWNXb2dBeWdDQ0NJRVFYOXpRUWQySUFSQkJuWnlRWUdDaEFoeGFpQURLQUlNSWdSQmYzTkJCM1lnQkVFR2RuSkJnWUtFQ0hGcUlRUWdEQ0FEUVJCcUlnTkhEUUFMQ3lBR0lBbHJJUVlnQnlBSWFpRUhJQVJCQ0haQi80SDhCM0VnQkVIL2dmd0hjV3BCZ1lBRWJFRVFkaUFGYWlFRklBcEZEUUFMSUFnZ0NVSDhBWEZCQW5ScUlnUW9BZ0FpQTBGL2MwRUhkaUFEUVFaMmNrR0Jnb1FJY1NFRElBcEJBVVlOQWlBRElBUW9BZ1FpQTBGL2MwRUhkaUFEUVFaMmNrR0Jnb1FJY1dvaEF5QUtRUUpHRFFJZ0F5QUVLQUlJSWdOQmYzTkJCM1lnQTBFR2RuSkJnWUtFQ0hGcUlRTU1BZ3NnQWtVRVFFRUFJUVVNQXdzZ0FrRURjU0VFQWtBZ0FrRUVTUVJBUVFBaEJVRUFJUWdNQVF0QkFDRUZJQUVoQXlBQ1FReHhJZ2doQndOQUlBVWdBeXdBQUVHL2YwcHFJQU5CQVdvc0FBQkJ2MzlLYWlBRFFRSnFMQUFBUWI5L1Ntb2dBMEVEYWl3QUFFRy9mMHBxSVFVZ0EwRUVhaUVESUFkQkJHc2lCdzBBQ3dzZ0JFVU5BaUFCSUFocUlRTURRQ0FGSUFNc0FBQkJ2MzlLYWlFRklBTkJBV29oQXlBRVFRRnJJZ1FOQUFzTUFnc01BZ3NnQTBFSWRrSC9nUnh4SUFOQi80SDhCM0ZxUVlHQUJHeEJFSFlnQldvaEJRc0NRQ0FGSUF0SkJFQWdDeUFGYXlFR0FrQUNRQUpBSUFBdEFCZ2lBMEVBSUFOQkEwY2JJZ05CQVdzT0FnQUJBZ3NnQmlFRFFRQWhCZ3dCQ3lBR1FRRjJJUU1nQmtFQmFrRUJkaUVHQ3lBRFFRRnFJUU1nQUNnQ0VDRUlJQUFvQWlBaEJDQUFLQUljSVFBRFFDQURRUUZySWdORkRRSWdBQ0FJSUFRb0FoQVJBZ0JGRFFBTFFRRVBDd3dCQ3lBQUlBRWdBaUFFS0FJTUVRTUFCRUJCQVE4TFFRQWhBd05BSUFNZ0JrWUVRRUVBRHdzZ0EwRUJhaUVESUFBZ0NDQUVLQUlRRVFJQVJRMEFDeUFEUVFGcklBWkpEd3NnQUNnQ0hDQUJJQUlnQUNnQ0lDZ0NEQkVEQUF2aEN3SVBmd0orSXdCQjBBQnJJZ0lrQUNBQlFRUnFJUXdnQWtGQWF5RU5JQUpCSldvaERpQUNRUnhxSVE4Z0FTZ0NKQ0VGSUFFb0FoUWhFQ0FCS0FJUUlRTUNRQUpBQW44Q1FBTkFJQUVvQWdBaEJpQUJRWUNBZ0lCNE5nSUFJQUVvQWdRaEN3SkFBa0FDUUFKQUFrQWdCa0dBZ0lDQWVFY0VRQ0FCS1FJSUlSRWdDeUVIREFFTEFrQWdBeUFRUmdSQVFZQ0FnSUI0SVFZTUFRc2dBU0FEUVJCcUlnZzJBaEFnQXlrQ0NDRVJJQU1vQWdRaEJ5QURLQUlBSVFZZ0NDRURDMEdBZ0lDQWVDQUxFS01CSUFaQmdJQ0FnSGhHRFFFTElBSWdCellDRENBQ0lBWTJBZ2dnQWlBUk53SVFJQkZDSUlnaEVrRi9JQVVnRWFjaUJFY2dCQ0FGU3h0Qi93RnhEZ0lDQXdFTFFZQ0FnSUI0SUFjUW93RWdBRUdBZ0lDQWVEWUNBQ0FCUVlDQWdJQjROZ0lBREFjTEFrQWdFcWRCQVhFTkFDQUZJQVFnQnlBRUVEUnJJZ01nQXlBRlNSc2lBeUFFU3cwQUlBSWdBellDRUNBRElRUUxBbjlCZ0lDQWdIZ2dCQ0FGVFEwQUdnSkFBa0FnQnlBRUlBVkJ1TnJBQUJDUUFTZ0NCRVVFUUNBQ1FUaHFJZ01nQWtFSWFpSUlJQVZCQVdzUVB5QUNRVEJxSUFOQkNHb29BZ0EyQWdBZ0FpQUNLUUk0TndNb0lBSXRBQlFoQkNBRFFSQnFJQUlvQWd3Z0FpZ0NFQ0lISUFkQkFXdEIyTnJBQUJDUUFTSUhRUkJxTHdFQU93RUFJQUpDb0lDQWdCQTNBamdnQWlBSEtRSUlOd0pBSUFnZ0EwSG8yc0FBRUZjZ0FpQUVPZ0EwSUFJdEFCUkJBWEZGRFFFTUFnc2dBa0U0YWlJRElBSkJDR29nQlJBL0lBSkJNR29nQTBFSWFpZ0NBRFlDQUNBQ0lBSXBBamczQXlnZ0FpQUNMUUFVSWdNNkFEUWdBdzBCQ3lBQ1FTaHFFSXNCQ3lBQ0tBSXdCRUFnQWtGQWF5QUNRVFJxS0FJQU5nSUFJQUpCQVRvQUZDQUNJQUlwQWl3M0F6Z2dBaWdDS0F3QkN5QUNLQUlvSUFJb0FpeEJCRUVVRUo4QlFZQ0FnSUI0Q3lFRFFZQ0FnSUI0SUFzUW93RWdBU0FETmdJQUlBd2dBaWtET0RjQ0FDQU1RUWhxSUFKQlFHc29BZ0EyQWdBZ0FFRUlhaUFDUVJCcUtRSUFOd0lBSUFBZ0Fpa0NDRGNDQUF3R0N5QUFJQkUzQWdnZ0FDQUhOZ0lFSUFBZ0JqWUNBQXdGQ3dKQUlBTWdFRWNFUUNBQklBTkJFR29pQ0RZQ0VDQURLQUlBSWdaQmdJQ0FnSGhIRFFFTElBSkJBRHNBUUNBQ1FRSTZBRHdnQWtFQ09nQTRJQUpCQ0dvaUFTQUZJQUpCT0dvUVFTQUFJQUlwQWdnM0FnQWdBa0VBT2dBVUlBQkJDR29nQVVFSWFpa0NBRGNDQUF3RkN5QURRUXhxS0FJQUlRa2dEeUFES1FJRU53SUFJQTlCQ0dvZ0NUWUNBQ0FDSUFZMkFoZ2dCU0FFYXlJSlJRMEJJQktuUVFGeFJRUkFJQUpCQURzQVFDQUNRUUk2QUR3Z0FrRUNPZ0E0SUFKQkNHb2dCU0FDUVRocUVFRU1BZ3NnQWkwQUpFVUVRQ0FDUVJocUVJc0JDeUFDS0FJY0lRTWdBaWdDSUNJS0lBbE5CRUFnQWtFSWFpSUVJQU1nQ2hDQUFRSkFJQUl0QUNRaUJnMEFJQUpCQURvQUZDQUNLQUlRSUFWUERRQWdBa0VBT3dCQUlBSkJBam9BUENBQ1FRSTZBRGdnQkNBRklBSkJPR29RUVFzZ0FpZ0NHQ0FEUVFSQkZCQ2ZBU0FHUlEwRVFZQ0FnSUI0SUFzUW93RWdBVUVJYWlBQ1FSQnFLUUlBTndJQUlBRWdBaWtDQ0RjQ0FFR0FnSUNBZUNBQ0VLTUJJQWdoQXd3QkN3c2dBeUFLSUFsQitObkFBQkNRQVNnQ0JFVUVRQ0FOUVFocUlBY2dCQ0FFUVFGclFZamF3QUFRa0FFaUNFRVFhaThCQURzQkFDQU5JQWdwQWdnM0FnQWdBa0tnZ0lDQUVEY0NPQ0FDUVFocUlBSkJPR3BCbU5yQUFCQlhJQWxCQVdzaENRc2dDU0FLVFFSQUlBSkJDR29nQXlBSkVJQUJJQUlvQWhnaEJpQURJQW9nQ1JDSUFTQUdRWUNBZ0lCNFJnMERJQW9nQ2lBSmF5SUlJQWdnQ2tzYklRUWdBaTBBSkF3Q0N5QUpJQXBCcU5yQUFCQ3pBUUFMSUFKQkttb2dEa0VDYWkwQUFEb0FBQ0FDSUE0dkFBQTdBU2dnQWlnQ0lDRUVJQUlvQWh3aEF5QUNMUUFrQ3lFSVFZQ0FnSUI0SUFzUW93RWdBU0FJT2dBTUlBRWdCRFlDQ0NBQklBTTJBZ1FnQVNBR05nSUFJQUVnQWk4QktEc0FEU0FCUVE5cUlBSkJLbW90QUFBNkFBQUxJQUFnQWlrQ0NEY0NBQ0FBUVFocUlBSkJFR29wQWdBM0FnQUxJQUpCMEFCcUpBQUw1UW9DRUg4QmZpTUFRWkFCYXlJQ0pBQWdBQ2dDYkNJRklBQW9BaHdpQm1zaUFVRUFJQUVnQUNnQ0ZDSUhJQVpySUFWcVRSc2hEU0FGSUFkcUlRTWdCMEVFZENJQklBQW9BaEFpQ21vaER5QUFLQUlZSVF3Z0FDZ0NhQ0VPSUFBb0FxQUJJUXNnQUNnQ25BRWhDQ0FLSVFRRFFBSkFJQU1nQmtZTkFDQUJSUTBBSUFrZ0RHcEJBQ0FFTFFBTUloQWJJUWtnQTBFQmF5RURJQUZCRUdzaEFTQUVRUkJxSVFRZ0RTQVFRUUZ6YWlFTkRBRUxDeUFJSUF4SEJFQkJBQ0VGSUFCQkFEWUNGQ0FDSUFnMkFqZ2dBa0VBTmdJMElBSWdCellDTUNBQ0lBQkJER29pRERZQ0xDQUNJQTgyQWlnZ0FpQUtOZ0lrSUFKQmdJQ0FnSGcyQWhRZ0FrSElBR29nQWtFVWFpSUJFQkFDZnlBQ0tBSklRWUNBZ0lCNFJnUkFJQUVRb1FGQkJDRUVRUUFNQVFzZ0FrRUlha0VFUVFSQkVFR1V5TUFBRUdBZ0FrSFFBR29wQWdBaEVTQUNLQUlJSVFFZ0FpZ0NEQ0lFSUFJcEFrZzNBZ0FnQkVFSWFpQVJOd0lBSUFKQkFUWUNSQ0FDSUFRMkFrQWdBaUFCTmdJOElBSkIyQUJxSUFKQkZHcEJLQkFXR2tFUUlRTkJBU0VGQTBBZ0FrR0FBV29nQWtIWUFHb1FFQ0FDS0FLQUFVR0FnSUNBZUVjRVFDQUNLQUk4SUFWR0JFQWdBa0U4YWtFQkVJMEJJQUlvQWtBaEJBc2dBeUFFYWlJQklBSXBBb0FCTndJQUlBRkJDR29nQWtHSUFXb3BBZ0EzQWdBZ0FpQUZRUUZxSWdVMkFrUWdBMEVRYWlFRERBRUxDMEdBZ0lDQWVDQUNLQUtFQVJDakFTQUNRZGdBYWhDaEFTQUNLQUk4Q3lFSElBa2dEbW9oQ1NBRlFRUjBJUU1nQkNFQkFrQURRQ0FEUlEwQklBTkJFR3NoQXlBQktBSUlJUW9nQVVFUWFpRUJJQWdnQ2tZTkFBdEI4TS9BQUVFM1FhalF3QUFRY1FBTElBd1FvQUVnQUNBRk5nSVVJQUFnQkRZQ0VDQUFJQWMyQWd3Z0JTQUdTUVJBSUFKQkFEc0FZQ0FDUVFJNkFGd2dBa0VDT2dCWUlBQWdCaUFGYXlBSUlBSkIyQUJxRUM0Z0FDZ0NGQ0VGQ3lBRlFRRnJJUVJCQUNFQlFRQWhBd05BQWtBZ0FTQU5UdzBBSUFNZ0JFOE5BQ0FCSUFBb0FoQWdBQ2dDRkNBRFFiRFB3QUFRa2dFdEFBeEJBWE5xSVFFZ0EwRUJhaUVEREFFTEN3Si9BMEFnQUNnQ0ZDSUJJQWdnQ1VzTkFSb2dBQ2dDRUNBQklBTkJvTS9BQUJDU0FTMEFEQVJBSUFOQkFXb2hBeUFKSUFocklRa01BUXNMSUFBb0FoUUxJUWNnQ1NBSVFRRnJJZ0VnQVNBSlN4c2hEaUFESUFZZ0JXdHFJZ0ZCQUU0aEJDQUJRUUFnQkJzaEJTQUdRUUFnQVNBRUcyc2hCZ3NDUUFKQUFrQkJmeUFHSUF0SElBWWdDMHNiUWY4QmNRNENBZ0FCQ3lBSElBWnJJZ0ZCQUNBQklBZE5HeUlFSUFzZ0Jtc2lBU0FCSUFSTEd5SURRUUFnQlNBR1NSc2dCV29oQlNBQklBUk5EUUVnQWtFQU93QmdJQUpCQWpvQVhDQUNRUUk2QUZnZ0FDQUJJQU5ySUFnZ0FrSFlBR29RTGd3QkN3SkFJQVlnQzJzaUNpQUdJQVZCZjNOcUlnRWdBU0FLU3hzaUJFVU5BQ0FBS0FJUUlRTWdCQ0FIVFFSQUlBQWdCeUFFYXlJQk5nSVVJQU1nQVVFRWRHb2hBeUFFSVFFRFFDQUJCRUFnQXlnQ0FDQURRUVJxS0FJQVFRUkJGQkNmQVNBQlFRRnJJUUVnQTBFUWFpRUREQUVMQ3lBQUtBSVVJUWNnQUNnQ0VDRURDd0pBSUFkRkRRQWdBeUFIUVFSMGFpSUJRUkJHRFFBZ0FVRUVhMEVBT2dBQURBRUxRWkRQd0FBUXRnRUFDeUFGSUFwcklBUnFJUVVMSUFBZ0JUWUNiQ0FBSUE0MkFtZ2dBRUVCT2dBZ0lBQWdDellDSENBQUlBZzJBaGdDZnlBQUtBS2dBU0lESUFBb0FtUWlBVTBFUUNBQUlBTTJBbVFnQXd3QkN5QUFRZHdBYWlBRElBRnJRUUFRT2lBQUtBSmtJUU1nQUNnQ29BRUxJUUVnQUNnQ1lDQURRUUFnQVJCVElBQW9BcHdCSWdFZ0FDZ0NkRTBFUUNBQUlBRkJBV3MyQW5RTElBQW9BcUFCSWdFZ0FDZ0NlRTBFUUNBQUlBRkJBV3MyQW5nTElBSkJrQUZxSkFBTHV3a0JCMzhDUUFKQUlBSWdBQ0FCYTBzRVFDQUJJQUpxSVFVZ0FDQUNhaUVBSUFKQkVFa05BVUVBSUFCQkEzRWlCbXNoQndKQUlBQkJmSEVpQXlBQVR3MEFJQVpCQVdzQ1FDQUdSUVJBSUFVaEJBd0JDeUFHSVFnZ0JTRUVBMEFnQUVFQmF5SUFJQVJCQVdzaUJDMEFBRG9BQUNBSVFRRnJJZ2dOQUFzTFFRTkpEUUFnQkVFRWF5RUVBMEFnQUVFQmF5QUVRUU5xTFFBQU9nQUFJQUJCQW1zZ0JFRUNhaTBBQURvQUFDQUFRUU5ySUFSQkFXb3RBQUE2QUFBZ0FFRUVheUlBSUFRdEFBQTZBQUFnQkVFRWF5RUVJQUFnQTBzTkFBc0xJQU1nQWlBR2F5SUVRWHh4SWdKcklRQkJBQ0FDYXlFR0FrQWdCU0FIYWlJRlFRTnhSUVJBSUFBZ0EwOE5BU0FCSUFScVFRUnJJUUVEUUNBRFFRUnJJZ01nQVNnQ0FEWUNBQ0FCUVFScklRRWdBQ0FEU1EwQUN3d0JDeUFBSUFOUERRQWdCVUVEZENJQ1FSaHhJUWdnQlVGOGNTSUhRUVJySVFGQkFDQUNhMEVZY1NFSklBY29BZ0FoQWdOQUlBSWdDWFFoQnlBRFFRUnJJZ01nQnlBQktBSUFJZ0lnQ0haeU5nSUFJQUZCQkdzaEFTQUFJQU5KRFFBTEN5QUVRUU54SVFJZ0JTQUdhaUVGREFFTElBSkJFRThFUUFKQVFRQWdBR3RCQTNFaUJpQUFhaUlFSUFCTkRRQWdCa0VCYXlBQklRTWdCZ1JBSUFZaEJRTkFJQUFnQXkwQUFEb0FBQ0FEUVFGcUlRTWdBRUVCYWlFQUlBVkJBV3NpQlEwQUN3dEJCMGtOQUFOQUlBQWdBeTBBQURvQUFDQUFRUUZxSUFOQkFXb3RBQUE2QUFBZ0FFRUNhaUFEUVFKcUxRQUFPZ0FBSUFCQkEyb2dBMEVEYWkwQUFEb0FBQ0FBUVFScUlBTkJCR290QUFBNkFBQWdBRUVGYWlBRFFRVnFMUUFBT2dBQUlBQkJCbW9nQTBFR2FpMEFBRG9BQUNBQVFRZHFJQU5CQjJvdEFBQTZBQUFnQTBFSWFpRURJQVFnQUVFSWFpSUFSdzBBQ3dzZ0FpQUdheUlEUVh4eElnZ2dCR29oQUFKQUlBRWdCbW9pQlVFRGNVVUVRQ0FBSUFSTkRRRWdCU0VCQTBBZ0JDQUJLQUlBTmdJQUlBRkJCR29oQVNBRVFRUnFJZ1FnQUVrTkFBc01BUXNnQUNBRVRRMEFJQVZCQTNRaUFrRVljU0VHSUFWQmZIRWlCMEVFYWlFQlFRQWdBbXRCR0hFaENTQUhLQUlBSVFJRFFDQUNJQVoySVFjZ0JDQUhJQUVvQWdBaUFpQUpkSEkyQWdBZ0FVRUVhaUVCSUFSQkJHb2lCQ0FBU1EwQUN3c2dBMEVEY1NFQ0lBVWdDR29oQVFzZ0FDQUNhaUlGSUFCTkRRRWdBa0VCYXlBQ1FRZHhJZ01FUUFOQUlBQWdBUzBBQURvQUFDQUJRUUZxSVFFZ0FFRUJhaUVBSUFOQkFXc2lBdzBBQ3d0QkIwa05BUU5BSUFBZ0FTMEFBRG9BQUNBQVFRRnFJQUZCQVdvdEFBQTZBQUFnQUVFQ2FpQUJRUUpxTFFBQU9nQUFJQUJCQTJvZ0FVRURhaTBBQURvQUFDQUFRUVJxSUFGQkJHb3RBQUE2QUFBZ0FFRUZhaUFCUVFWcUxRQUFPZ0FBSUFCQkJtb2dBVUVHYWkwQUFEb0FBQ0FBUVFkcUlBRkJCMm90QUFBNkFBQWdBVUVJYWlFQklBVWdBRUVJYWlJQVJ3MEFDd3dCQ3lBQUlBSnJJZ1FnQUU4TkFDQUNRUUZySUFKQkEzRWlBUVJBQTBBZ0FFRUJheUlBSUFWQkFXc2lCUzBBQURvQUFDQUJRUUZySWdFTkFBc0xRUU5KRFFBZ0JVRUVheUVCQTBBZ0FFRUJheUFCUVFOcUxRQUFPZ0FBSUFCQkFtc2dBVUVDYWkwQUFEb0FBQ0FBUVFOcklBRkJBV290QUFBNkFBQWdBRUVFYXlJQUlBRXRBQUE2QUFBZ0FVRUVheUVCSUFBZ0JFc05BQXNMQzdnS0FRVi9JQUFnQWtHQXpjQUFFR0lpQWlnQ0JDQUNLQUlJSUFGQjBOWEFBQkNRQVNnQ0JDRUdRUUVoQndKQUFrQUNmd0pBQWtBQ1FBSkFBa0FDUUFKQUlBTkJvQUZKRFFBZ0EwRU5ka0dBN2NBQWFpMEFBQ0lBUVJWUERRRWdBMEVIZGtFL2NTQUFRUVowY2tHQTc4QUFhaTBBQUNJQVFiUUJUdzBDQWtBQ1FDQURRUUoyUVI5eElBQkJCWFJ5UWNENXdBQnFMUUFBSUFOQkFYUkJCbkYyUVFOeFFRSnJEZ0lCQUFJTElBTkJqdndEYTBFQ1NRMEJJQU5CM0F0R0RRRWdBMEhZTDBZTkFTQURRWkEwUmcwQklBTkJnNWdFUmcwQklBTkIvdi8vQUhGQi9Na0NSZzBCSUFOQm9neHJRZUVFU1EwQklBTkJnQzlyUVRCSkRRRWdBMEd4MmdCclFUOUpEUUVnQTBIbTR3ZHJRUnBKRFFFTFFRQWhCd3NnQWlnQ0NDSUZJQUZCZjNOcUlRQUNRQUpBQWtBQ1FDQUdEZ01EQVFJQUMwR2cyTUFBUVNoQnlOakFBQkJ4QUFzZ0FpZ0NCQ0VHSUFjTkJ3SkFBa0FDUUNBQURnSUFBUUlMSUFZZ0JTQUJRZkRWd0FBUWtBRWlBa0VnTmdJQVFRQWhBRUVCSVFZTUN3dEJBaUVBSUFZZ0JTQUJRWURXd0FBUWtBRWlCVUVDTmdJRUlBVWdBellDQUNBRklBUXBBQUEzQUFnZ0JVRVFhaUFFUVFocUx3QUFPd0FBSUFJb0FnUWdBaWdDQ0NBQlFRRnFRWkRXd0FBUWtBRWlBa0VnTmdJQURBY0xRUUloQUNBR0lBVWdBVUdnMXNBQUVKQUJJZ1ZCQWpZQ0JDQUZJQU0yQWdBZ0JTQUVLUUFBTndBSUlBVkJFR29nQkVFSWFpSURMd0FBT3dBQUlBSW9BZ1FnQWlnQ0NDQUJRUUZxSWdWQnNOYkFBQkNRQVNnQ0JFRUNSZ1JBSUFJb0FnUWdBaWdDQ0NBQlFRSnFRY0RXd0FBUWtBRWlBVUtnZ0lDQUVEY0NBQ0FCSUFRcEFBQTNBQWdnQVVFUWFpQURMd0FBT3dBQUN5QUNLQUlFSUFJb0FnZ2dCVUhRMXNBQUVKQUJJZ0pCSURZQ0FBd0dDMEVCSVFZZ0FVRUJhaUVJSUFJb0FnUWhDU0FIRFFSQkFpRUFJQWtnQlNBQlFZRFh3QUFRa0FFaUFVRUNOZ0lFSUFFZ0F6WUNBQ0FCSUFRcEFBQTNBQWdnQVVFUWFpQUVRUWhxTHdBQU93QUFJQUlvQWdRZ0FpZ0NDQ0FJUVpEWHdBQVFrQUVpQWtFZ05nSUFEQVVMSUFjTkFnSkFBa0FnQUE0Q0NnQUJDMEVCSVFZZ0FpZ0NCQ0FGSUFGQkFXcEJ3TmZBQUJDUUFTSUNRU0EyQWdCQkFDRUFEQWdMSUFJb0FnUWdCU0FCUVFGclFkRFh3QUFRa0FFaUFFS2dnSUNBRURjQ0FDQUFJQVFwQUFBM0FBZ2dBRUVRYWlBRVFRaHFJZ2N2QUFBN0FBQkJBaUVBSUFJb0FnUWdBaWdDQ0NBQlFlRFh3QUFRa0FFaUJVRUNOZ0lFSUFVZ0F6WUNBQ0FGSUFRcEFBQTNBQWdnQlVFUWFpQUhMd0FBT3dBQUlBSW9BZ1FnQWlnQ0NDQUJRUUZxSWdOQjhOZkFBQkNRQVNnQ0JFRUNSZ1JBSUFJb0FnUWdBaWdDQ0NBQlFRSnFRWURZd0FBUWtBRWlBVUtnZ0lDQUVEY0NBQ0FCSUFRcEFBQTNBQWdnQVVFUWFpQUhMd0FBT3dBQUN5QUNLQUlFSUFJb0FnZ2dBMEdRMk1BQUVKQUJJZ0pCSURZQ0FBd0VDeUFBUVJWQjlNYkFBQkJMQUFzZ0FFRzBBVUdFeDhBQUVFc0FDeUFDS0FJRUlBVWdBVUVCYTBHZzE4QUFFSkFCSWdCQ29JQ0FnQkEzQWdBZ0FDQUVLUUFBTndBSUlBQkJFR29nQkVFSWFpOEFBRHNBQUNBQ0tBSUVJQUlvQWdnZ0FVR3cxOEFBRUpBQkRBTUxJQWtnQlNBQlFlRFd3QUFRa0FFaUFFRUJOZ0lFSUFBZ0F6WUNBQ0FBSUFRcEFBQTNBQWdnQUVFUWFpQUVRUWhxTHdBQU93QUFJQUlvQWdRZ0FpZ0NDQ0FJUWZEV3dBQVFrQUVpQWtFZ05nSUFRUUVoQUF3REMwRUFJUVlNQWdzZ0JpQUZJQUZCNE5YQUFCQ1FBUXNpQWlBRE5nSUFRUUVoQmtFQklRQUxJQUlnQmpZQ0JDQUNJQVFwQUFBM0FBZ2dBa0VRYWlBRVFRaHFMd0FBT3dBQUN5QUFDNklHQVF4L0l3QkJFR3NpQmlRQVFRb2hBd0pBSUFBb0FnQWlBRUdRemdCSkJFQWdBQ0VDREFFTEEwQWdCa0VHYWlBRGFpSUVRUVJySUFCQmtNNEFiaUlDUWZDeEEyd2dBR29pQjBILy93TnhRZVFBYmlJSVFRRjBRWlhud0FCcUx3QUFPd0FBSUFSQkFtc2dDRUdjZjJ3Z0IycEIvLzhEY1VFQmRFR1Y1OEFBYWk4QUFEc0FBQ0FEUVFScklRTWdBRUgvd2RjdlN5QUNJUUFOQUFzTElBSkI0d0JMQkVBZ0EwRUNheUlESUFaQkJtcHFJQUlnQWtILy93TnhRZVFBYmlJQ1FaeC9iR3BCLy84RGNVRUJkRUdWNThBQWFpOEFBRHNBQUFzQ1FDQUNRUXBQQkVBZ0EwRUNheUlBSUFaQkJtcHFJQUpCQVhSQmxlZkFBR292QUFBN0FBQU1BUXNnQTBFQmF5SUFJQVpCQm1wcUlBSkJNSEk2QUFBTFFRb2dBR3NoQkVFQklRTkJLMEdBZ01RQUlBRW9BaFFpQWtFQmNTSUZHeUVISUFKQkJIRkJBblloQ0NBR1FRWnFJQUJxSVFvQ1FDQUJLQUlBUlFSQUlBRW9BaHdpQUNBQktBSWdJZ0VnQnlBSUVIZ05BU0FBSUFvZ0JDQUJLQUlNRVFNQUlRTU1BUXNnQVNnQ0JDSUpJQVFnQldvaUMwMEVRQ0FCS0FJY0lnQWdBU2dDSUNJQklBY2dDQkI0RFFFZ0FDQUtJQVFnQVNnQ0RCRURBQ0VEREFFTElBSkJDSEVFUUNBQktBSVFJUXdnQVVFd05nSVFJQUV0QUJnaERTQUJRUUU2QUJnZ0FTZ0NIQ0lDSUFFb0FpQWlDeUFISUFnUWVBMEJJQUFnQ1dvZ0JXdEJDV3NoQUFOQUlBQkJBV3NpQUFSQUlBSkJNQ0FMS0FJUUVRSUFSUTBCREFNTEN5QUNJQW9nQkNBTEtBSU1FUU1BRFFFZ0FTQU5PZ0FZSUFFZ0REWUNFRUVBSVFNTUFRc2dDU0FMYXlFQ0FrQUNRQUpBUVFFZ0FTMEFHQ0lBSUFCQkEwWWJJZ0JCQVdzT0FnQUJBZ3NnQWlFQVFRQWhBZ3dCQ3lBQ1FRRjJJUUFnQWtFQmFrRUJkaUVDQ3lBQVFRRnFJUUFnQVNnQ0VDRUpJQUVvQWlBaEJTQUJLQUljSVFFQ1FBTkFJQUJCQVdzaUFFVU5BU0FCSUFrZ0JTZ0NFQkVDQUVVTkFBc01BUXNnQVNBRklBY2dDQkI0RFFBZ0FTQUtJQVFnQlNnQ0RCRURBQTBBUVFBaEFBTkFJQUFnQWtZRVFFRUFJUU1NQWdzZ0FFRUJhaUVBSUFFZ0NTQUZLQUlRRVFJQVJRMEFDeUFBUVFGcklBSkpJUU1MSUFaQkVHb2tBQ0FEQzhrRkFncC9BWDRqQUVHUUFXc2lCQ1FBQWtBQ1FBSkFBMEJCQUNBQ1FRUjBheUVGQWtBRFFDQUNSUTBGSUFCRkRRVWdBQ0FDYWtFWVNRMERJQUFnQWlBQUlBSkpJZ01iUVFsSkRRRWdBMFVFUUNBQklRTURRQ0FESUFWcUlnRWdBeUFDRUdvZ0FTRURJQUlnQUNBQ2F5SUFUUTBBQ3d3QkN3dEJBQ0FBUVFSMElnTnJJUVVEUUNBQklBVnFJQUVnQUJCcUlBRWdBMm9oQVNBQ0lBQnJJZ0lnQUU4TkFBc01BUXNMSUFFZ0FFRUVkQ0lGYXlJRElBSkJCSFFpQm1vaEJ5QUFJQUpMRFFFZ0JFRVFhaUlBSUFNZ0JSQVdHaUFESUFFZ0JoQVNJQWNnQUNBRkVCWWFEQUlMSUFSQkNHb2lCeUFCSUFCQkJIUnJJZ1pCQ0dvcEFnQTNBd0FnQkNBR0tRSUFOd01BSUFKQkJIUWhDQ0FDSWdVaEFRTkFJQVlnQVVFRWRHb2hBd05BSUFSQkdHb2lDU0FEUVFocUlnb3BBZ0EzQXdBZ0JDQURLUUlBTndNUUlBY3BBd0FoRFNBRElBUXBBd0EzQWdBZ0NpQU5Od0lBSUFjZ0NTa0RBRGNEQUNBRUlBUXBBeEEzQXdBZ0FDQUJTd1JBSUFNZ0NHb2hBeUFCSUFKcUlRRU1BUXNMSUFFZ0FHc2lBUVJBSUFFZ0JTQUJJQVZKR3lFRkRBRUZJQVFwQXdBaERTQUdRUWhxSUFSQkNHb2lCeWtEQURjQ0FDQUdJQTAzQWdCQkFTQUZJQVZCQVUwYklRbEJBU0VCQTBBZ0FTQUpSZzBFSUFZZ0FVRUVkR29pQlNrQ0FDRU5JQWNnQlVFSWFpSUtLUUlBTndNQUlBUWdEVGNEQUNBQklBSnFJUU1EUUNBRVFSaHFJZ3NnQmlBRFFRUjBhaUlJUVFocUlnd3BBZ0EzQXdBZ0JDQUlLUUlBTndNUUlBY3BBd0FoRFNBSUlBUXBBd0EzQWdBZ0RDQU5Od0lBSUFjZ0N5a0RBRGNEQUNBRUlBUXBBeEEzQXdBZ0FDQURTd1JBSUFJZ0Eyb2hBd3dCQ3lBRElBQnJJZ01nQVVjTkFBc2dCQ2tEQUNFTklBb2dCeWtEQURjQ0FDQUZJQTAzQWdBZ0FVRUJhaUVCREFBTEFBc0FDd0FMSUFSQkVHb2lBQ0FCSUFZUUZob2dCeUFESUFVUUVpQURJQUFnQmhBV0dnc2dCRUdRQVdva0FBdVFCUUVJZndKQUlBSkJFRWtFUUNBQUlRTU1BUXNDUUVFQUlBQnJRUU54SWdZZ0FHb2lCU0FBVFEwQUlBWkJBV3NnQUNFRElBRWhCQ0FHQkVBZ0JpRUhBMEFnQXlBRUxRQUFPZ0FBSUFSQkFXb2hCQ0FEUVFGcUlRTWdCMEVCYXlJSERRQUxDMEVIU1EwQUEwQWdBeUFFTFFBQU9nQUFJQU5CQVdvZ0JFRUJhaTBBQURvQUFDQURRUUpxSUFSQkFtb3RBQUE2QUFBZ0EwRURhaUFFUVFOcUxRQUFPZ0FBSUFOQkJHb2dCRUVFYWkwQUFEb0FBQ0FEUVFWcUlBUkJCV290QUFBNkFBQWdBMEVHYWlBRVFRWnFMUUFBT2dBQUlBTkJCMm9nQkVFSGFpMEFBRG9BQUNBRVFRaHFJUVFnQlNBRFFRaHFJZ05IRFFBTEN5QUNJQVpySWdkQmZIRWlDQ0FGYWlFREFrQWdBU0FHYWlJRVFRTnhSUVJBSUFNZ0JVME5BU0FFSVFFRFFDQUZJQUVvQWdBMkFnQWdBVUVFYWlFQklBVkJCR29pQlNBRFNRMEFDd3dCQ3lBRElBVk5EUUFnQkVFRGRDSUNRUmh4SVFZZ0JFRjhjU0lKUVFScUlRRkJBQ0FDYTBFWWNTRUtJQWtvQWdBaEFnTkFJQUlnQm5ZaENTQUZJQWtnQVNnQ0FDSUNJQXAwY2pZQ0FDQUJRUVJxSVFFZ0JVRUVhaUlGSUFOSkRRQUxDeUFIUVFOeElRSWdCQ0FJYWlFQkN3SkFJQUlnQTJvaUJpQURUUTBBSUFKQkFXc2dBa0VIY1NJRUJFQURRQ0FESUFFdEFBQTZBQUFnQVVFQmFpRUJJQU5CQVdvaEF5QUVRUUZySWdRTkFBc0xRUWRKRFFBRFFDQURJQUV0QUFBNkFBQWdBMEVCYWlBQlFRRnFMUUFBT2dBQUlBTkJBbW9nQVVFQ2FpMEFBRG9BQUNBRFFRTnFJQUZCQTJvdEFBQTZBQUFnQTBFRWFpQUJRUVJxTFFBQU9nQUFJQU5CQldvZ0FVRUZhaTBBQURvQUFDQURRUVpxSUFGQkJtb3RBQUE2QUFBZ0EwRUhhaUFCUVFkcUxRQUFPZ0FBSUFGQkNHb2hBU0FHSUFOQkNHb2lBMGNOQUFzTElBQUw2Z1FCQ244akFFRXdheUlESkFBZ0F5QUJOZ0lzSUFNZ0FEWUNLQ0FEUVFNNkFDUWdBMElnTndJY0lBTkJBRFlDRkNBRFFRQTJBZ3dDZndKQUFrQUNRQ0FDS0FJUUlncEZCRUFnQWlnQ0RDSUFSUTBCSUFJb0FnZ2lBU0FBUVFOMGFpRUVJQUJCQVd0Qi8vLy8vd0Z4UVFGcUlRY2dBaWdDQUNFQUEwQWdBRUVFYWlnQ0FDSUZCRUFnQXlnQ0tDQUFLQUlBSUFVZ0F5Z0NMQ2dDREJFREFBMEVDeUFCS0FJQUlBTkJER29nQVVFRWFpZ0NBQkVDQUEwRElBQkJDR29oQUNBRUlBRkJDR29pQVVjTkFBc01BUXNnQWlnQ0ZDSUFSUTBBSUFCQkJYUWhDeUFBUVFGclFmLy8vejl4UVFGcUlRY2dBaWdDQ0NFRklBSW9BZ0FoQUFOQUlBQkJCR29vQWdBaUFRUkFJQU1vQWlnZ0FDZ0NBQ0FCSUFNb0Fpd29BZ3dSQXdBTkF3c2dBeUFJSUFwcUlnRkJFR29vQWdBMkFod2dBeUFCUVJ4cUxRQUFPZ0FrSUFNZ0FVRVlhaWdDQURZQ0lDQUJRUXhxS0FJQUlRUkJBQ0VKUVFBaEJnSkFBa0FDUUNBQlFRaHFLQUlBUVFGckRnSUFBZ0VMSUFVZ0JFRURkR29pRENnQ0FBMEJJQXdvQWdRaEJBdEJBU0VHQ3lBRElBUTJBaEFnQXlBR05nSU1JQUZCQkdvb0FnQWhCQUpBQWtBQ1FDQUJLQUlBUVFGckRnSUFBZ0VMSUFVZ0JFRURkR29pQmlnQ0FBMEJJQVlvQWdRaEJBdEJBU0VKQ3lBRElBUTJBaGdnQXlBSk5nSVVJQVVnQVVFVWFpZ0NBRUVEZEdvaUFTZ0NBQ0FEUVF4cUlBRkJCR29vQWdBUkFnQU5BaUFBUVFocUlRQWdDeUFJUVNCcUlnaEhEUUFMQ3lBSElBSW9BZ1JQRFFFZ0F5Z0NLQ0FDS0FJQUlBZEJBM1JxSWdBb0FnQWdBQ2dDQkNBREtBSXNLQUlNRVFNQVJRMEJDMEVCREFFTFFRQUxJQU5CTUdva0FBdXJCQUVNZnlBQlFRRnJJUTRnQUNnQ0JDRUtJQUFvQWdBaEN5QUFLQUlJSVF3Q1FBTkFJQVVOQVFKL0FrQWdBaUFEU1EwQUEwQWdBU0FEYWlFRkFrQUNRQUpBSUFJZ0Eyc2lCMEVIVFFSQUlBSWdBMGNOQVNBQ0lRTU1CUXNDUUNBRlFRTnFRWHh4SWdZZ0JXc2lCQVJBUVFBaEFBTkFJQUFnQldvdEFBQkJDa1lOQlNBRUlBQkJBV29pQUVjTkFBc2dCMEVJYXlJQUlBUlBEUUVNQXdzZ0IwRUlheUVBQ3dOQUlBWW9BZ0FpQ1VHQWdvUUlJQWxCaXBTbzBBQnphM0lnQmtFRWFpZ0NBQ0lKUVlDQ2hBZ2dDVUdLbEtqUUFITnJjbkZCZ0lHQ2hIaHhRWUNCZ29SNFJ3MENJQVpCQ0dvaEJpQUFJQVJCQ0dvaUJFOE5BQXNNQVF0QkFDRUFBMEFnQUNBRmFpMEFBRUVLUmcwQ0lBY2dBRUVCYWlJQVJ3MEFDeUFDSVFNTUF3c2dCQ0FIUmdSQUlBSWhBd3dEQ3lBRUlBVnFJUVlnQWlBRWF5QURheUVIUVFBaEFBSkFBMEFnQUNBR2FpMEFBRUVLUmcwQklBY2dBRUVCYWlJQVJ3MEFDeUFDSVFNTUF3c2dBQ0FFYWlFQUN5QUFJQU5xSWdSQkFXb2hBd0pBSUFJZ0JFME5BQ0FBSUFWcUxRQUFRUXBIRFFCQkFDRUZJQU1pQkF3REN5QUNJQU5QRFFBTEN5QUNJQWhHRFFKQkFTRUZJQWdoQkNBQ0N5RUFBa0FnREMwQUFBUkFJQXRCak9mQUFFRUVJQW9vQWd3UkF3QU5BUXNnQUNBSWF5RUhRUUFoQmlBQUlBaEhCRUFnQUNBT2FpMEFBRUVLUmlFR0N5QUJJQWhxSVFBZ0RDQUdPZ0FBSUFRaENDQUxJQUFnQnlBS0tBSU1FUU1BUlEwQkN3dEJBU0VOQ3lBTkM2RUVBZ3QvQW40akFFSFFBR3NoQkFKQUlBQkZEUUFnQWtVTkFDQUVRUWhxSWdOQkVHb2lCaUFCSUFCQmJHeHFJZ3NpQjBFUWFpZ0NBRFlDQUNBRFFRaHFJZ2dnQjBFSWFpa0NBRGNEQUNBRUlBY3BBZ0EzQXdnZ0FrRVViQ0VKSUFJaUF5RUZBMEFnQ3lBRFFSUnNhaUVCQTBBZ0FTa0NBQ0VPSUFFZ0JDa0RDRGNDQUNBSUtRTUFJUThnQ0NBQlFRaHFJZ29wQWdBM0F3QWdDaUFQTndJQUlBWW9BZ0FoQ2lBR0lBRkJFR29pRENnQ0FEWUNBQ0FNSUFvMkFnQWdCQ0FPTndNSUlBQWdBMDFGQkVBZ0FTQUphaUVCSUFJZ0Eyb2hBd3dCQ3dzZ0F5QUFheUlEQkVBZ0F5QUZJQU1nQlVrYklRVU1BUVVnQnlBRUtRTUlOd0lBSUFkQkVHb2dCRUVJYWlJQlFSQnFJZ1lvQWdBMkFnQWdCMEVJYWlBQlFRaHFJZ2dwQXdBM0FnQkJBU0FGSUFWQkFVMGJJUXRCQVNFREEwQWdBeUFMUmcwRElBWWdCeUFEUVJSc2FpSUZRUkJxSWdvb0FnQTJBZ0FnQ0NBRlFRaHFJZ3dwQWdBM0F3QWdCQ0FGS1FJQU53TUlJQUlnQTJvaEFRTkFJQWNnQVVFVWJHb2lDU2tDQUNFT0lBa2dCQ2tEQ0RjQ0FDQUlLUU1BSVE4Z0NDQUpRUWhxSWcwcEFnQTNBd0FnRFNBUE53SUFJQVlvQWdBaERTQUdJQWxCRUdvaUNTZ0NBRFlDQUNBSklBMDJBZ0FnQkNBT053TUlJQUFnQVVzRVFDQUJJQUpxSVFFTUFRc2dBeUFCSUFCcklnRkhEUUFMSUFVZ0JDa0RDRGNDQUNBS0lBWW9BZ0EyQWdBZ0RDQUlLUU1BTndJQUlBTkJBV29oQXd3QUN3QUxBQXNBQ3d2UkJBSURmd1IrSXdCQjBBWnJJZ1FrQUNBRVFmd0Jha0VBUVlVRUVCNGFJQVJCZ0lERUFEWUMrQUVnQkVFMGFpSUZJQUFnQVVFQklBSkJBQkFmSUFSQjJBQnFJQUFnQVVFQlFRQkJBQkFmSUFSQnhBWnFJZ1lnQVJCVklBUkJoQUZxSUFBUU9TQUVRUUE2QVBBQklBUWdBVFlDMUFFZ0JDQUFOZ0xRQVNBRVFRQTdBZTRCSUFSQkFqb0E2Z0VnQkVFQ09nRG1BU0FFUVFFNkFLUUJJQVJDQURjQ25BRWdCQ0FDTmdLQUFTQUVRUUUyQW53Z0JFRUFPd0hrQVNBRVFRQTZBUFVCSUFSQmdJQUVOZ0R4QVNBRVFnQTNBdGdCSUFRZ0FVRUJhellDNEFFZ0JFRUNPZ0N3QVNBRVFRSTZBTFFCSUFSQkFEWUN3QUVnQkVFQ09nREVBU0FFUVFJNkFNZ0JJQVJCZ0lDQUNEWUN6QUVnQkVJQU53S29BU0FFUW9DQWdBZzNBcmdCSUFSQm1BRnFJQVpCQ0dvb0FnQTJBZ0FnQkVFQU9nRDJBU0FFSUFRcEFzUUdOd0tRQVNBRVFTaHFJQUJCQWtFSVFZekN3QUFRWUNBRUtRTW9JUWNnQkVFZ2FpQUFRUUpCREVHY3dzQUFFR0FnQkNrRElDRUlJQVJCR0dvZ0FFRUVRUXhCck1MQUFCQmdJQVFwQXhnaENTQUVRUkJxSUFCQkJFRVFRYnpDd0FBUVlDQUVLUU1RSVFvZ0JFRUlhaUFBUVFSQkJFSE13c0FBRUdBZ0JDQURRUUJIT2dEQUJpQUVRUUEyQXJ3R0lBUkJBRFlDc0FZZ0JDQUtOd0tvQmlBRVFRQTJBcVFHSUFRZ0NUY0NuQVlnQkVFQU5nS1lCaUFFSUFnM0FwQUdJQVJCQURZQ2pBWWdCQ0FITndLRUJpQUVJQVFwQXdnM0FyUUdRWndHRUprQklnQkJBRFlDQ0NBQVFvR0FnSUFRTndJQUlBQkJER29nQlVHUUJoQVdHaUFFUWRBR2FpUUFJQUJCQ0dvTHhoQUNFWDhFZmlNQVFTQnJJZ3drQUJBQUlRb2dERUVBTmdJY0lBd2dDallDR0NBTUlBRTJBaFFnREVFVWFpQUZFSVFCSUF3b0Fod2hBU0FHUWYvL0EzRzRFQWtoQlNBTUtBSVlJaFVnQVNBRkVBRWpBRUVnYXlJR0pBQUNRRUd3c3NFQUtBSUFJZ1VOQUVHMHNzRUFRUUEyQWdCQnNMTEJBRUVCTmdJQVFiaXl3UUFvQWdBaEFVRzhzc0VBS0FJQUlRaEJ1TExCQUVIWTY4QUFLUUlBSWhnM0FnQWdCa0VJYWtIZzY4QUFLUUlBSWhrM0F3QkJ4TExCQUNnQ0FDRUtRY0N5d1FBZ0dUY0NBQ0FHSUJnM0F3QWdCVVVOQUNBSVJRMEFBa0FnQ2tVTkFDQUJRUWhxSVFrZ0FTa0RBRUovaFVLQWdZS0VpSkNnd0lCL2d5RVpRUUVoQ3lBQklRVURRQ0FMUlEwQklCa2hHQU5BSUJoUUJFQWdCVUhnQUdzaEJTQUpLUU1BUW4rRlFvQ0Jnb1NJa0tEQWdIK0RJUmdnQ1VFSWFpRUpEQUVMQ3lBWVFnRjlJQmlESVJrZ0NrRUJheUlLSVFzZ0JTQVllcWRCQTNaQmRHeHFRUVJyS0FJQUlnZEJoQUZKRFFBZ0J4QUREQUFMQUFzZ0JrRVVhaUFJUVFGcUVFTWdBU0FHS0FJY2F5QUdLQUlVSUFZb0FoZ1FwZ0VMSUFaQklHb2tBRUcwc3NFQUtBSUFSUVJBUWJTeXdRQkJmellDQUVHOHNzRUFLQUlBSWdFZ0EzRWhCaUFEclNJYVFobUlRb0dDaElpUW9NQ0FBWDRoRzBHNHNzRUFLQUlBSVFvRFFDQUdJQXBxS1FBQUloa2dHNFVpR0VLQmdvU0lrS0RBZ0FGOUlCaENmNFdEUW9DQmdvU0lrS0RBZ0grRElSZ0NRQUpBQTBBZ0dFSUFVZ1JBSUFNZ0NpQVllcWRCQTNZZ0Jtb2dBWEZCZEd4cUlnVkJER3NvQWdCR0JFQWdCVUVJYXlnQ0FDQUVSZzBEQ3lBWVFnRjlJQmlESVJnTUFRc0xJQmtnR1VJQmhvTkNnSUdDaElpUW9NQ0FmNE5RRFFGQndMTEJBQ2dDQUVVRVFDTUFRVEJySWdna0FBSkFBa0FDUUVIRXNzRUFLQUlBSWdwQmYwWU5BRUc4c3NFQUtBSUFJZ2xCQVdvaUMwRURkaUVCSUFrZ0FVRUhiQ0FKUVFoSkd5SU9RUUYySUFwTkJFQWdDRUVJYWdKL0lBb2dEaUFLSUE1TEd5SUJRUWRQQkVBZ0FVSCsvLy8vQVVzTkEwRi9JQUZCQTNSQkNHcEJCMjVCQVd0bmRrRUJhZ3dCQzBFRVFRZ2dBVUVEU1JzTElnRVFReUFJS0FJSUlnVkZEUUVnQ0NnQ0VDRUdJQWdvQWd3aUNRUkFRZXl5d1FBdEFBQWFJQVVnQ1JBMUlRVUxJQVZGRFFJZ0JTQUdha0gvQVNBQlFRaHFFQjRoQ3lBSVFRQTJBaUFnQ0NBQlFRRnJJZ2MyQWhnZ0NDQUxOZ0lVSUFoQkNEWUNFQ0FJSUFjZ0FVRURka0VIYkNBQlFRbEpHeUlPTmdJY0lBdEJER3NoRVVHNHNzRUFLQUlBSWdZcEF3QkNmNFZDZ0lHQ2hJaVFvTUNBZjRNaEdDQUdJUUVnQ2lFSlFRQWhCUU5BSUFrRVFBTkFJQmhRQkVBZ0JVRUlhaUVGSUFFcEF3aENmNFZDZ0lHQ2hJaVFvTUNBZjRNaEdDQUJRUWhxSVFFTUFRc0xJQWdnQ3lBSElBWWdHSHFuUVFOMklBVnFJZzFCZEd4cUlnWkJER3NvQWdBaUVDQUdRUWhyS0FJQUlCQWJyUkJrSUJFZ0NDZ0NBRUYwYkdvaUVFRzRzc0VBS0FJQUlnWWdEVUYwYkdwQkRHc2lEU2tBQURjQUFDQVFRUWhxSUExQkNHb29BQUEyQUFBZ0NVRUJheUVKSUJoQ0FYMGdHSU1oR0F3QkN3c2dDQ0FLTmdJZ0lBZ2dEaUFLYXpZQ0hFRUFJUUVEUUNBQlFSQkhCRUFnQVVHNHNzRUFhaUlGS0FJQUlRWWdCU0FCSUFocVFSUnFJZ1VvQWdBMkFnQWdCU0FHTmdJQUlBRkJCR29oQVF3QkN3c2dDQ2dDR0NJQlJRMERJQWhCSkdvZ0FVRUJhaEJESUFnb0FoUWdDQ2dDTEdzZ0NDZ0NKQ0FJS0FJb0VLWUJEQU1MSUFFZ0MwRUhjVUVBUjJvaEJVRzRzc0VBS0FJQUlnWWhBUU5BSUFVRVFDQUJJQUVwQXdBaUdFSi9oVUlIaUVLQmdvU0lrS0RBZ0FHRElCaEMvLzc5Ky9mdjM3Ly9BSVI4TndNQUlBRkJDR29oQVNBRlFRRnJJUVVNQVFVQ1FDQUxRUWhQQkVBZ0JpQUxhaUFHS1FBQU53QUFEQUVMSUFaQkNHb2dCaUFMRUJJTElBWkJDR29oRVNBR1FReHJJUkFnQmlFRlFRQWhBUU5BQWtBQ1FDQUJJQXRIQkVBZ0FTQUdhaUlUTFFBQVFZQUJSdzBDSUFGQmRHd2lCeUFRYWlFVUlBWWdCMm9pQjBFSWF5RVdJQWRCREdzaEZ3TkFJQUVnRnlnQ0FDSUhJQllvQWdBZ0J4c2lCeUFKY1NJUGF5QUdJQWtnQjYwUVJDSU5JQTlyY3lBSmNVRUlTUTBDSUFZZ0RXb2lEeTBBQUNBUElBZEJHWFlpQnpvQUFDQVJJQTFCQ0dzZ0NYRnFJQWM2QUFBZ0RVRjBiQ0VIUWY4QlJ3UkFJQVlnQjJvaERVRjBJUWNEUUNBSFJRMENJQVVnQjJvaUR5MEFBQ0VTSUE4Z0J5QU5haUlQTFFBQU9nQUFJQThnRWpvQUFDQUhRUUZxSVFjTUFBc0FDd3NnRTBIL0FUb0FBQ0FSSUFGQkNHc2dDWEZxUWY4Qk9nQUFJQWNnRUdvaUIwRUlhaUFVUVFocUtBQUFOZ0FBSUFjZ0ZDa0FBRGNBQUF3Q0MwSEFzc0VBSUE0Z0NtczJBZ0FNQndzZ0V5QUhRUmwySWdjNkFBQWdFU0FCUVFocklBbHhhaUFIT2dBQUN5QUJRUUZxSVFFZ0JVRU1heUVGREFBTEFBc0FDd0FMSXdCQklHc2lBQ1FBSUFCQkFEWUNHQ0FBUVFFMkFnd2dBRUhJNnNBQU5nSUlJQUJDQkRjQ0VDQUFRUWhxUWZ6cXdBQVFpZ0VBQ3dBTElBaEJNR29rQUFzZ0F5QUVFQWdoQVNBTVFRaHFRYml5d1FBb0FnQkJ2TExCQUNnQ0FDQWFFR1FnRENnQ0NDRUZJQXd0QUF3aEJrSEVzc0VBUWNTeXdRQW9BZ0JCQVdvMkFnQkJ3TExCQUVIQXNzRUFLQUlBSUFaQkFYRnJOZ0lBUWJpeXdRQW9BZ0FnQlVGMGJHb2lCVUVFYXlBQk5nSUFJQVZCQ0dzZ0JEWUNBQ0FGUVF4cklBTTJBZ0FMSUFWQkJHc29BZ0FRQkNFQlFiU3l3UUJCdExMQkFDZ0NBRUVCYWpZQ0FDQUNJQUVnRlJBRklBQkJBRFlDQUNBTVFTQnFKQUFQQ3lBT1FRaHFJZzRnQm1vZ0FYRWhCZ3dBQ3dBTEl3QkJNR3NpQUNRQUlBQkJBVFlDRENBQVFlamx3QUEyQWdnZ0FFSUJOd0lVSUFBZ0FFRXZhcTFDZ0lDQWdMQUJoRGNESUNBQUlBQkJJR28yQWhBZ0FFRUlha0hRN01BQUVJb0JBQXU5QXdFSGZ5QUJRUUZySVFsQkFDQUJheUVLSUFCQkFuUWhDQ0FDS0FJQUlRVURRQUpBSUFWRkRRQWdCU0VCQTBBQ1FBSkFBa0FDZndKQUlBRW9BZ2dpQlVFQmNVVUVRQ0FCS0FJQVFYeHhJZ3NnQVVFSWFpSUdheUFJU1EwRElBc2dDR3NnQ25FaUJTQUdJQU1nQUNBRUVRSUFRUUowYWtFSWFra0VRQ0FHS0FJQUlRVWdCaUFKY1EwRUlBSWdCVUY4Y1RZQ0FDQUJJZ1VvQWdBTUF3dEJBQ0VDSUFWQkFEWUNBQ0FGUVFocklnVkNBRGNDQUNBRklBRW9BZ0JCZkhFMkFnQUNRQ0FCS0FJQUlnQkJBbkVOQUNBQVFYeHhJZ0JGRFFBZ0FDQUFLQUlFUVFOeElBVnlOZ0lFSUFVb0FnUkJBM0VoQWdzZ0JTQUJJQUp5TmdJRUlBRWdBU2dDQ0VGK2NUWUNDQ0FCSUFFb0FnQWlBRUVEY1NBRmNpSUNOZ0lBSUFCQkFuRU5BU0FGS0FJQURBSUxJQUVnQlVGK2NUWUNDQ0FCS0FJRVFYeHhJZ1VFZjBFQUlBVWdCUzBBQUVFQmNSc0ZRUUFMSVFVZ0FSQkFJQUV0QUFCQkFuRU5Bd3dFQ3lBQklBSkJmWEUyQWdBZ0JTZ0NBRUVDY2dzaEFpQUZJQUpCQVhJMkFnQWdCVUVJYWlFSERBUUxJQUlnQlRZQ0FBd0VDeUFGSUFVb0FnQkJBbkkyQWdBTElBSWdCVFlDQUNBRklRRU1BQXNBQ3dzZ0J3djBBd0VGZnlNQVFUQnJJZ1lrQUNBQ0lBRnJJZ2NnQTBzaENTQUNRUUZySWdnZ0FDZ0NIQ0lGUVFGclNRUkFJQUFnQ0VHZ3pzQUFFR0pCQURvQURBc2dBeUFISUFrYklRTUNRQUpBSUFGRkJFQUNRQ0FDSUFWSEJFQWdCa0VRYWlBQUtBSVlJQVFRS3lBRlFRUjBJQUpCQkhScklRY2dBRUVNYWlFSklBQW9BaFFpQVNBQ0lBVnJhaUVFSUFFaEFnTkFJQU5GQkVBZ0JpZ0NFQ0FHS0FJVVFRUkJGQkNmQVF3RkN5QUdRU0JxSUFaQkVHb1FWQ0FCSUFSSkRRSWdDU2dDQUNJSUlBSkdCRUFqQUVFUWF5SUZKQUFnQlVFSWFpQUpJQWhCQVVFRVFSQVFKaUFGS0FJSUlnaEJnWUNBZ0hoSEJFQWdCU2dDREJvZ0NFR3d6c0FBRUs0QkFBc2dCVUVRYWlRQUN5QUFLQUlRSUFSQkJIUnFJUVVnQWlBRVN3UkFJQVZCRUdvZ0JTQUhFQklMSUFVZ0Jpa0NJRGNDQUNBQUlBSkJBV29pQWpZQ0ZDQUZRUWhxSUFaQktHb3BBZ0EzQWdBZ0EwRUJheUVESUFkQkVHb2hCd3dBQ3dBTElBQWdBeUFBS0FJWUlBUVFMZ3dDQ3lBRUlBSkJzTTdBQUJCTUFBc2dBQ0FCUVFGclFjRE93QUFRWWtFQU9nQU1JQVpCQ0dvZ0FDQUJJQUpCME03QUFCQm5JQVlvQWd3aUFTQURTUTBCSUFNZ0JpZ0NDQ0FEUVFSMGFpQUJJQU5yRUJVZ0FDQUNJQU5ySUFJZ0JCQXFDeUFBUVFFNkFDQWdCa0V3YWlRQUR3dEJwTWpBQUVFalFiekp3QUFRY1FBTGxBTUJCWDhDUUNBQ1FSQkpCRUFnQUNFRERBRUxBa0JCQUNBQWEwRURjU0lGSUFCcUlnUWdBRTBOQUNBRlFRRnJJQUFoQXlBRkJFQWdCU0VHQTBBZ0F5QUJPZ0FBSUFOQkFXb2hBeUFHUVFGcklnWU5BQXNMUVFkSkRRQURRQ0FESUFFNkFBQWdBMEVIYWlBQk9nQUFJQU5CQm1vZ0FUb0FBQ0FEUVFWcUlBRTZBQUFnQTBFRWFpQUJPZ0FBSUFOQkEyb2dBVG9BQUNBRFFRSnFJQUU2QUFBZ0EwRUJhaUFCT2dBQUlBUWdBMEVJYWlJRFJ3MEFDd3NnQkNBQ0lBVnJJZ0pCZkhGcUlnTWdCRXNFUUNBQlFmOEJjVUdCZ29RSWJDRUZBMEFnQkNBRk5nSUFJQVJCQkdvaUJDQURTUTBBQ3dzZ0FrRURjU0VDQ3dKQUlBSWdBMm9pQlNBRFRRMEFJQUpCQVdzZ0FrRUhjU0lFQkVBRFFDQURJQUU2QUFBZ0EwRUJhaUVESUFSQkFXc2lCQTBBQ3d0QkIwa05BQU5BSUFNZ0FUb0FBQ0FEUVFkcUlBRTZBQUFnQTBFR2FpQUJPZ0FBSUFOQkJXb2dBVG9BQUNBRFFRUnFJQUU2QUFBZ0EwRURhaUFCT2dBQUlBTkJBbW9nQVRvQUFDQURRUUZxSUFFNkFBQWdCU0FEUVFocUlnTkhEUUFMQ3lBQUM3RURBUVYvSXdCQlFHb2lCaVFBSUFaQkFEc0FFaUFHUVFJNkFBNGdCa0VDT2dBS0lBWkJNR29pQjBFSWFpSUlJQVVnQmtFS2FpQUZHeUlGUVFocUx3QUFPd0VBSUFZZ0JTa0FBRGNETUNBR1FSUnFJQUVnQnhBcklBWWdBa0VFUVJCQjhNekFBQkJnSUFaQkFEWUNMQ0FHSUFZcEF3QTNBaVFnQmtFa2FpQUNFSTBCUVFFZ0FpQUNRUUZOR3lJSlFRRnJJUWNnQmlnQ0tDQUdLQUlzSWdwQkJIUnFJUVVDZndOQUlBY0VRQ0FHUVRCcUlBWkJGR29RVkNBRklBWXBBakEzQWdBZ0JVRUlhaUFJS1FJQU53SUFJQWRCQVdzaEJ5QUZRUkJxSVFVTUFRVUNRQ0FKSUFwcUlRY0NRQ0FDUlFSQUlBWW9BaFFnQmlnQ0dFRUVRUlFRbndFZ0IwRUJheUVIREFFTElBVWdCaWtDRkRjQ0FDQUZRUWhxSUFaQkhHb3BBZ0EzQWdBTElBWWdCellDTENBRFFRRnhSUTBBSUFRRVFDQUdRU1JxSUFRUWpRRUxJQVJCQ200Z0JHb2hCVUVCREFNTEN3c2dCa0VrYWtIb0J4Q05BVUVBQ3lFRElBQWdCaWtDSkRjQ0RDQUFJQUkyQWh3Z0FDQUJOZ0lZSUFCQkFEb0FJQ0FBSUFVMkFnZ2dBQ0FFTmdJRUlBQWdBellDQUNBQVFSUnFJQVpCTEdvb0FnQTJBZ0FnQmtGQWF5UUFDNllEQVFOL0l3QkJFR3NpQmlRQUlBTWdBQ2dDR0NBQmF5SUZJQU1nQlVrYklRTWdBU0FBSUFKQm9NM0FBQkJpSWdBb0FnZ2lBa0VCYXlJRklBRWdCVWtiSVFFZ0FDZ0NCQ0FDSUFGQjJOakFBQkNRQVNJRktBSUVSUVJBSUFWQ29JQ0FnQkEzQWdBZ0JTQUVLUUFBTndBSUlBVkJFR29nQkVFSWFpSUhMd0FBT3dBQUlBQW9BZ1FnQUNnQ0NDQUJRUUZyUWVqWXdBQVFrQUVpQlVLZ2dJQ0FFRGNDQUNBRklBUXBBQUEzQUFnZ0JVRVFhaUFITHdBQU93QUFDeUFHUVFocUlBQW9BZ1FnQUNnQ0NDQUJRZmpZd0FBUWZ3SkFJQU1nQmlnQ0RDSUZUUVJBSUFVZ0Eyc2lCU0FHS0FJSUlBVkJGR3hxSUFNUUdTQUFLQUlFSUFBb0FnZ2dBVUdJMmNBQUVKQUJJZ0VvQWdSRkJFQWdBVUtnZ0lDQUVEY0NBQ0FCSUFRcEFBQTNBQWdnQVVFUWFpQUVRUWhxTHdBQU93QUFJQUpGRFFJZ0FDZ0NCQ0FDUVJSc2FpSUFRUlJySWdGRkRRSWdBVUVnTmdJQUlBQkJFR3RCQVRZQ0FDQUFRUXhySWdBZ0JDa0FBRGNBQUNBQVFRaHFJQVJCQ0dvdkFBQTdBQUFMSUFaQkVHb2tBQThMUWN6SndBQkJJVUh3eWNBQUVIRUFDMEdZMmNBQUVMWUJBQXYyQWdFRWZ3SkFJQUFDZndKQUFrQUNRQUpBQWtBZ0FDZ0NwQUVpQWtFQlRRUkFBa0FnQVVIL0FFc05BQ0FBSUFKcVFiQUJhaTBBQUVFQmNVVU5BQ0FCUVFKMFFialF3QUJxS0FJQUlRRUxJQUFvQW1naUF5QUFLQUtjQVNJRVR3MERJQUFvQW13aEFpQUFMUUM5QVEwQkRBSUxJQUpCQWtHbzVjQUFFRXNBQ3lBQUlBTWdBa0VCSUFCQnNnRnFFQ0FMSUFBZ0F5QUNJQUVnQUVHeUFXb1FFeUlGRFFFTElBQXRBTDhCRFFFZ0FDQURRUUZySUFBb0Ftd2lBaUFCSUFCQnNnRnFJZ1VRRTBVRVFDQUFJQU5CQW1zZ0FpQUJJQVVRRXhvTElBUkJBV3NNQWdzZ0FDQURJQVZxSWdFMkFtZ2dBU0FFUncwQ0lBQXRBTDhCRFFJZ0JFRUJhd3dCQ3dKQUlBQW9BbXdpQWlBQUtBS3NBVWNFUUNBQ0lBQW9BcUFCUVFGclR3MEJJQUFnQWhDd0FTQUFJQUpCQVdvaUFqWUNiQXdCQ3lBQUlBSVFzQUVnQUVFQkVJY0JJQUFvQW13aEFnc2dBRUVBSUFJZ0FTQUFRYklCYWhBVEN6WUNhQXNnQUNnQ1lDQUFLQUprSUFJUWtRRUwrZ0lBQWtBQ1FBSkFBa0FDUUFKQUFrQWdBMEVCYXc0R0FBRUNBd1FGQmdzZ0FDZ0NHQ0VFSUFBZ0FrSFF6Y0FBRUdJaUEwRUFPZ0FNSUFNb0FnUWdBeWdDQ0NBQklBUWdCUkFuSUFBZ0FrRUJhaUFBS0FJY0lBVVFLZzhMSUFBb0FoZ2hBeUFBSUFKQjRNM0FBQkJpSWdRb0FnUWdCQ2dDQ0VFQUlBRkJBV29pQVNBRElBRWdBMGtiSUFVUUp5QUFRUUFnQWlBRkVDb1BDeUFBUVFBZ0FDZ0NIQ0FGRUNvUEN5QUFLQUlZSVFNZ0FDQUNRZkROd0FBUVlpSUFLQUlFSUFBb0FnZ2dBU0FESUFVUUp5QUFRUUE2QUF3UEN5QUFLQUlZSVFNZ0FDQUNRWURPd0FBUVlpSUFLQUlFSUFBb0FnaEJBQ0FCUVFGcUlnQWdBeUFBSUFOSkd5QUZFQ2NQQ3lBQUtBSVlJUUVnQUNBQ1FaRE93QUFRWWlJQUtBSUVJQUFvQWdoQkFDQUJJQVVRSnlBQVFRQTZBQXdQQ3lBQUtBSVlJUU1nQUNBQ1FjRE53QUFRWWlJQUtBSUVJQUFvQWdnZ0FTQUJJQVFnQXlBQmF5SUJJQUVnQkVzYmFpSUJJQVVRSnlBQklBTkdCRUFnQUVFQU9nQU1Dd3ZVQWdFRmZ5TUFRVUJxSWdNa0FDQURRUUEyQWlBZ0F5QUJOZ0lZSUFNZ0FTQUNhallDSENBRFFSQnFJQU5CR0dvUVRRSkFJQU1vQWhCRkJFQWdBRUVBTmdJSUlBQkNnSUNBZ01BQU53SUFEQUVMSUFNb0FoUWhCQ0FEUVFocVFRUkJCRUVFUVpUSXdBQVFZQ0FES0FJSUlRVWdBeWdDRENJR0lBUTJBZ0FnQTBFQk5nSXNJQU1nQmpZQ0tDQURJQVUyQWlRZ0EwRTRhaUFEUVNCcUtBSUFOZ0lBSUFNZ0F5a0NHRGNETUVFRUlRVkJBU0VFQTBBZ0F5QURRVEJxRUUwZ0F5Z0NBRUVCUjBVRVFDQURLQUlFSVFjZ0F5Z0NKQ0FFUmdSQUlBTkJKR29nQkVFQlFRUkJCQkJ0SUFNb0FpZ2hCZ3NnQlNBR2FpQUhOZ0lBSUFNZ0JFRUJhaUlFTmdJc0lBVkJCR29oQlF3QkN3c2dBQ0FES1FJa053SUFJQUJCQ0dvZ0EwRXNhaWdDQURZQ0FBc0RRQ0FDQkVBZ0FVRUFPZ0FBSUFKQkFXc2hBaUFCUVFGcUlRRU1BUXNMSUFOQlFHc2tBQXZLQWdJRmZ3SitJd0JCSUdzaUFpUUFJQUFDZndKQUFrQWdBUzBBSUVVRVFBd0JDeUFCUVFBNkFDQUNRQ0FCS0FJQVFRRkdCRUFnQVNnQ0ZDSUZJQUVvQWh4cklnTWdBU2dDQ0VzTkFRc01BUXNnQlNBRElBRW9BZ1JySWdSUEJFQkJBQ0VESUFGQkFEWUNGQ0FDSUFGQkRHbzJBaFFnQWlBQktBSVFJZ1kyQWd3Z0FpQUVOZ0lZSUFJZ0JTQUVhellDSENBQ0lBWWdCRUVFZEdvMkFoQWdBUzBBdkFFTkFrRVVRUVFRZkNFQklBSkJER29pQTBFSWFpa0NBQ0VISUFJcEFnd2hDQ0FCUVJCcUlBTkJFR29vQWdBMkFnQWdBVUVJYWlBSE53SUFJQUVnQ0RjQ0FFR2c1TUFBREFNTElBUWdCVUgweThBQUVMTUJBQXNnQWtFQU5nSU1RUUVoQXlBQkxRQzhBUTBBUVFCQkFSQjhJUUZCaE9UQUFBd0JDMEVBUVFFUWZDRUJJQU5GQkVBZ0FrRU1haEJZQzBHRTVNQUFDellDQkNBQUlBRTJBZ0FnQWtFZ2FpUUFDNUlDQVFWL0FrQUNRQUpBUVg4Z0FDZ0NuQUVpQXlBQlJ5QUJJQU5KRzBIL0FYRU9BZ0lCQUFzZ0FDQUFLQUpZSWdNRWZ5QUFLQUpVSVFVRFFDQURRUUpKUlFSQUlBTkJBWFlpQmlBRWFpSUhJQVFnQlNBSFFRSjBhaWdDQUNBQlNSc2hCQ0FESUFacklRTU1BUXNMSUFRZ0JTQUVRUUowYWlnQ0FDQUJTV29GUVFBTE5nSllEQUVMUVFBZ0FTQURRWGh4UVFocUlnUnJJZ05CQUNBQklBTlBHeUlEUVFOMklBTkJCM0ZCQUVkcWF5RURJQUJCMEFCcUlRVURRQ0FEUlEwQklBVWdCRUhjNHNBQUVIc2dBMEVCYWlFRElBUkJDR29oQkF3QUN3QUxJQUlnQUNnQ29BRkhCRUFnQUVFQU5nS29BU0FBSUFKQkFXczJBcXdCQ3lBQUlBSTJBcUFCSUFBZ0FUWUNuQUVnQUJBUkMvSUJBZ1IvQVg0akFFRVFheUlHSkFBQ1FDQUNJQUlnQTJvaUEwc0VRRUVBSVFJTUFRdEJBQ0VDSUFRZ0JXcEJBV3RCQUNBRWEzR3RRUWhCQkNBRlFRRkdHeUlISUFFb0FnQWlDRUVCZENJSklBTWdBeUFKU1JzaUF5QURJQWRKR3lJSHJYNGlDa0lnaUtjTkFDQUtweUlEUVlDQWdJQjRJQVJyU3cwQUlBUWhBZ0ovSUFnRVFDQUZSUVJBSUFaQkNHb2dCQ0FERUl3QklBWW9BZ2dNQWdzZ0FTZ0NCQ0FGSUFoc0lBUWdBeEIrREFFTElBWWdCQ0FERUl3QklBWW9BZ0FMSWdWRkRRQWdBU0FITmdJQUlBRWdCVFlDQkVHQmdJQ0FlQ0VDQ3lBQUlBTTJBZ1FnQUNBQ05nSUFJQVpCRUdva0FBdVpBZ0VEZndKQUFrQUNRQ0FCSUFKR0RRQWdBQ0FCSUFKQm9OWEFBQkNRQVNnQ0JFVUVRQ0FBSUFFZ0FrRUJhMEd3MWNBQUVKQUJJZ1ZDb0lDQWdCQTNBZ0FnQlNBRUtRQUFOd0FJSUFWQkVHb2dCRUVJYWk4QUFEc0FBQXNnQWlBRFN3MEJJQUVnQTBrTkFpQURRUlJzSWdZZ0FrRVViQ0lDYXlFRklBQWdBbW9oQWlBRVFRaHFJUWNEUUNBRkJFQWdBa0tnZ0lDQUVEY0NBQ0FDSUFRcEFBQTNBQWdnQWtFUWFpQUhMd0FBT3dBQUlBVkJGR3NoQlNBQ1FSUnFJUUlNQVFzTElBRWdBMDBOQUNBQUlBWnFJZ0FvQWdRTkFDQUFRcUNBZ0lBUU53SUFJQUFnQkNrQUFEY0FDQ0FBUVJCcUlBUkJDR292QUFBN0FBQUxEd3NnQWlBRFFjRFZ3QUFRdFFFQUN5QURJQUZCd05YQUFCQ3pBUUFMaXdJQkEzOGpBRUV3YXlJREpBQWdBeUFDTmdJWUlBTWdBVFlDRkFKQUlBTkJGR29RV2lJQlFmLy9BM0ZCQTBZRVFDQUFRUUEyQWdnZ0FFS0FnSUNBSURjQ0FBd0JDeUFEUVFocVFRUkJBa0VDUVpUSXdBQVFZQ0FES0FJSUlRSWdBeWdDRENJRUlBRTdBUUFnQTBFQk5nSWtJQU1nQkRZQ0lDQURJQUkyQWh3Z0F5QURLUUlVTndJb1FRSWhBVUVCSVFJRFFDQURRU2hxRUZvaUJVSC8vd054UVFOR1JRUkFJQU1vQWh3Z0FrWUVRQ0FEUVJ4cUlBSkJBVUVDUVFJUWJTQURLQUlnSVFRTElBRWdCR29nQlRzQkFDQURJQUpCQVdvaUFqWUNKQ0FCUVFKcUlRRU1BUXNMSUFBZ0F5a0NIRGNDQUNBQVFRaHFJQU5CSkdvb0FnQTJBZ0FMSUFOQk1Hb2tBQXVGQWdFRGZ5TUFRVEJySWdNa0FDQURJQUkyQWhnZ0F5QUJOZ0lVQWtBZ0EwRVVhaEJPUWYvL0EzRWlBVVVFUUNBQVFRQTJBZ2dnQUVLQWdJQ0FJRGNDQUF3QkN5QURRUWhxUVFSQkFrRUNRWlRJd0FBUVlDQURLQUlJSVFJZ0F5Z0NEQ0lFSUFFN0FRQWdBMEVCTmdJa0lBTWdCRFlDSUNBRElBSTJBaHdnQXlBREtRSVVOd0lvUVFJaEFVRUJJUUlEUUNBRFFTaHFFRTVCLy84RGNTSUZCRUFnQXlnQ0hDQUNSZ1JBSUFOQkhHb2dBa0VCUVFKQkFoQnRJQU1vQWlBaEJBc2dBU0FFYWlBRk93RUFJQU1nQWtFQmFpSUNOZ0lrSUFGQkFtb2hBUXdCQ3dzZ0FDQURLUUljTndJQUlBQkJDR29nQTBFa2FpZ0NBRFlDQUFzZ0EwRXdhaVFBQzRNQ0FRSi9Jd0JCTUdzaUJDUUFJQVJCRUdvZ0FDZ0NHQ0FERUNzZ0JFRUlhaUFBRUhJZ0JDQUJJQUlnQkNnQ0NDQUVLQUlNUWVEUHdBQVFiQUpBSUFRb0FnUWlBRVVFUUNBRUtBSVFJQVFvQWhSQkJFRVVFSjhCREFFTElBQkJCSFFpQVVFUWF5RURJQUVnQkNnQ0FDSUFhaUlDUVJCcklRRURRQ0FEQkVBZ0JFRWdhaUlGSUFSQkVHb1FWQ0FBS0FJQUlBQkJCR29vQWdCQkJFRVVFSjhCSUFCQkNHb2dCVUVJYWlrQ0FEY0NBQ0FBSUFRcEFpQTNBZ0FnQTBFUWF5RURJQUJCRUdvaEFBd0JCU0FCS0FJQUlBSkJER3NvQWdCQkJFRVVFSjhCSUFGQkNHb2dCRUVZYWlrQ0FEY0NBQ0FCSUFRcEFoQTNBZ0FMQ3dzZ0JFRXdhaVFBQzRBQ0FRWi9Jd0JCSUdzaUF5UUFJQU5CQ0dvZ0FVRUVRUlJCa05YQUFCQmdJQU5CQURZQ0hDQURJQU1wQXdnM0FoUWdBMEVVYWlBQkVJNEJRUUVnQVNBQlFRRk5HeUlHUVFGcklRVWdBeWdDR0NBREtBSWNJZ2RCRkd4cUlRUWdBa0VJYWlFSUFrQURRQ0FGQkVBZ0JFS2dnSUNBRURjQ0FDQUVJQUlwQUFBM0FBZ2dCRUVRYWlBSUx3QUFPd0FBSUFWQkFXc2hCU0FFUVJScUlRUU1BUVVDUUNBR0lBZHFJUVVnQVEwQUlBVkJBV3NoQlF3REN3c0xJQVJDb0lDQWdCQTNBZ0FnQkNBQ0tRQUFOd0FJSUFSQkVHb2dBa0VJYWk4QUFEc0FBQXNnQUNBREtRSVVOd0lBSUFCQkNHb2dCVFlDQUNBQVFRQTZBQXdnQTBFZ2FpUUFDOVFCQVFWL0FrQWdBQ2dDaEFRaUFVRi9Sd1JBSUFGQkFXb2hBeUFCUVNCSkRRRWdBMEVnUWRUYndBQVFzd0VBQzBIVTI4QUFFSDBBQ3lBQVFRUnFJZ0VnQTBFRWRHb2hCUU5BSUFFZ0JVWkZCRUFDUUNBQktBSUFJZ0pCZjBjRVFDQUNRUVpKRFFFZ0FrRUJha0VHUWFUaHdBQVFzd0VBQzBHazRjQUFFSDBBQ3lBQlFRUnFJUVFnQVVFUWFpQUNRUUYwUVFKcUlRSURRQ0FDQkVBZ0JFRUFPd0VBSUFKQkFtc2hBaUFFUVFKcUlRUU1BUXNMSUFGQkFEWUNBQ0VCREFFTEN5QUFRWUNBeEFBMkFnQWdBRUVBTmdLRUJBdnpBUUVCZndKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBZ0FTZ0NBQ0lEUVlDQXhBQkdCRUFnQWtIZy8vOEFjVUhBQUVZTkFTQUNRVGRyRGdJREJBSUxJQUpCTUVZTkJpQUNRVGhHRFFVZ0EwRW9hdzRDQ1FvTkN5QUFJQUpCUUdzUVNBOExJQUpCNHdCR0RRSU1Dd3NnQUVFUk9nQUFEd3NnQUVFUE9nQUFEd3NnQUVFa09nQUFJQUZCQURvQWlBUVBDeUFEUVNOckRnY0JCd2NIQndNR0J3c2dBMEVvYXc0Q0FRUUdDeUFBUVE0NkFBQVBDeUFBUVpvQ093RUFEd3NnQUVFYU93RUFEd3NnQWtFd1J3MEJDeUFBUVprQ093RUFEd3NnQUVFWk93RUFEd3NnQUVFeU9nQUFDOFVCQVFKL0l3QkJNR3NpQkNRQUlBUkJER29nQWlBREVDc2dCQ0FCTmdJY0lBQkJER29nQVJDTkFTQUJCRUFnQUNnQ0VDQUFLQUlVSWdKQkJIUnFJUU1DUUFOQUFrQWdCRUVnYWlJRklBUkJER29RVkNBRUtBSWdRWUNBZ0lCNFJnMEFJQU1nQkNrQ0lEY0NBQ0FEUVFocUlBVkJDR29wQWdBM0FnQWdBMEVRYWlFRElBSkJBV29oQWlBQlFRRnJJZ0VOQVF3Q0N3dEJnSUNBZ0hnZ0JDZ0NKQkNqQVFzZ0FDQUNOZ0lVQ3lBRUtBSU1JQVFvQWhCQkJFRVVFSjhCSUFSQk1Hb2tBQXVIQVFFRGZ5TUFRU0JySWdFa0FDQUJRUVJxSUFBUVZpQUJLQUlFSWdBdEFIQkJBWEVFZnlBQUtBSnNJUU1nQUNnQ2FDRUFJQUZCQURZQ0VCQUFJUUlnQVVFQU5nSWNJQUVnQWpZQ0dDQUJJQUZCRUdvMkFoUWdBVUVVYWlJQ0lBQVFoQUVnQWlBREVJUUJJQUVvQWhnRlFZQUJDeUFCS0FJSUlBRW9BZ3dRb2dFZ0FVRWdhaVFBQzhFQkFRVi9Jd0JCRUdzaUFpUUFRUUVoQkFKQUlBRW9BaHdpQTBHN2dNQUFRUVVnQVNnQ0lDSUdLQUlNSWdVUkF3QU5BQUpBSUFFdEFCUkJCSEZGQkVBZ0EwR1M1OEFBUVFFZ0JSRURBQTBDSUFBZ0F5QUdFRGRGRFFFTUFnc2dBMEdUNThBQVFRSWdCUkVEQUEwQklBSWdCallDQkNBQ0lBTTJBZ0FnQWtFQk9nQVBJQUlnQWtFUGFqWUNDQ0FBSUFKQjlPYkFBQkEzRFFFZ0FrR1E1OEFBUVFJUUdBMEJDeUFEUVphcXdRQkJBU0FGRVFNQUlRUUxJQUpCRUdva0FDQUVDN0FCQVFGL0lBQkJBRFlDQUNBQVFRaHJJZ1FnQkNnQ0FFRitjVFlDQUFKQUlBSWdBeEVGQUVVTkFBSkFBa0FnQUVFRWF5Z0NBRUY4Y1NJQ1JRMEFJQUl0QUFCQkFYRU5BQ0FFRUVBZ0JDMEFBRUVDY1VVTkFTQUNJQUlvQWdCQkFuSTJBZ0FQQ3lBRUtBSUFJZ0pCQW5FTkFTQUNRWHh4SWdKRkRRRWdBaTBBQUVFQmNRMEJJQUFnQWlnQ0NFRjhjVFlDQUNBQ0lBUkJBWEkyQWdnTER3c2dBQ0FCS0FJQU5nSUFJQUVnQkRZQ0FBdW5BUUVDZnlNQVFTQnJJZ0lrQUNBQ0lBQW9BbWcyQWd3Z0FrRUFPZ0FjSUFJZ0FDZ0NWQ0lETmdJUUlBSWdBeUFBS0FKWVFRSjBhallDRkNBQ0lBSkJER28yQWhnZ0FBSi9Ba0FDUUFOQUlBRkJBV3NpQVFSQUlBSkJFR29RU1EwQkRBSUxDeUFDUVJCcUVFa2lBUTBCQ3lBQUtBS2NBU0lEUVFGcklnQU1BUXNnQUNnQ25BRWlBMEVCYXlFQUlBRW9BZ0FMSWdFZ0FDQUJJQU5KR3pZQ2FDQUNRU0JxSkFBTG93RUJBWDhqQUVGQWFpSURKQUFnQTBFY2FpQUFFRjRnQXlnQ0hDSUFJQUVnQWhBbElBTkJLR29nQUVIZ0FHb29BZ0FnQUVIa0FHb29BZ0FRSXlBRFFSQnFJQUFRSkNBRElBTXBBeEEzQWpRZ0EwRUlhaUFES0FJc0lBTW9BakFRV3lBREtBSU1JUUFnQXlnQ0NFRUJjUVJBSUFNZ0FEWUNQQ0FEUVR4cVFlekN3QUFRUWdBTElBTkJLR29RYmlBREtBSWdJQU1vQWlRUXNnRWdBMEZBYXlRQUlBQUxtUUVCQTM4Z0FVRnNiQ0VDSUFGQi8vLy8vd054SVFNZ0FDQUJRUlJzYWlFQlFRQWhBQUpBQTBBZ0FrVU5BUUpBSUFGQkZHc2lCQ2dDQUVFZ1J3MEFJQUZCRUdzb0FnQkJBVWNOQUNBQlFReHJMUUFBUVFKSERRQWdBVUVJYXkwQUFFRUNSdzBBSUFGQkJHc3RBQUFOQUNBQlFRTnJMUUFBUVI5eERRQWdBa0VVYWlFQ0lBQkJBV29oQUNBRUlRRU1BUXNMSUFBaEF3c2dBd3V4QVFFQ2Z5TUFRUkJySWdJa0FBSkFJQUZGRFFBZ0FVRURha0VDZGlFQkFrQWdBRUVFVFFSQUlBRkJBV3NpQTBHQUFra05BUXNnQWtHc3NzRUFLQUlBTmdJSUlBRWdBQ0FDUVFocVFhaXF3UUJCQkVFRkVFOGhBRUdzc3NFQUlBSW9BZ2cyQWdBTUFRc2dBa0dzc3NFQU5nSUVJQUlnQTBFQ2RFR3Nxc0VBYWlJREtBSUFOZ0lNSUFFZ0FDQUNRUXhxSUFKQkJHcEJCa0VIRUU4aEFDQURJQUlvQWd3MkFnQUxJQUpCRUdva0FDQUFDNkFCQVFOL0l3QkJFR3NpQlNRQUlBVkJDR29nQUNBQklBSkI0TTdBQUJCbklBVW9BZ3dpQmlBRElBSWdBV3NpQnlBRElBZEpHeUlEVHdSQUlBWWdBMnNpQmlBRktBSUlJQVpCQkhScUlBTVFGU0FBSUFFZ0FTQURhaUFFRUNvZ0FRUkFJQUFnQVVFQmEwSHd6c0FBRUdKQkFEb0FEQXNnQUNBQ1FRRnJRWURQd0FBUVlrRUFPZ0FNSUFWQkVHb2tBQThMUWN6SndBQkJJVUh3eWNBQUVIRUFDNmdCQVFGL0l3QkJRR29pQXlRQUlBTkJDR29nQUNnQ0FCQUNJQU1vQWdnaEFDQURJQU1vQWd3MkFnUWdBeUFBTmdJQUlBTkJBVFlDTUNBRFFRSTJBaGdnQTBHWXFzRUFOZ0lVSUFOQ0FUY0NJQ0FESUFNb0FnUWlBRFlDUENBRElBTW9BZ0EyQWpnZ0F5QUFOZ0kwSUFNZ0EwRTBhallDTENBRElBTkJMR28yQWh3Z0FTQUNJQU5CRkdvUUZ5QURLQUkwSWdFRVFDQURLQUk0UVFFZ0FSQTRDeUFEUVVCckpBQUxwQUVCQVg4akFFRVFheUlESkFBQ1FDQUFSUTBBSUFKRkRRQUNRQ0FCUVFSTkJFQWdBa0VEYWtFQ2RrRUJheUlCUVlBQ1NRMEJDeUFEUWF5eXdRQW9BZ0EyQWdnZ0FDQURRUWhxUWFpcXdRQkJBaEF4UWF5eXdRQWdBeWdDQ0RZQ0FBd0JDeUFEUWF5eXdRQTJBZ1FnQXlBQlFRSjBRYXlxd1FCcUlnRW9BZ0EyQWd3Z0FDQURRUXhxSUFOQkJHcEJBeEF4SUFFZ0F5Z0NERFlDQUFzZ0EwRVFhaVFBQzRzQkFRSi9Jd0JCRUdzaUFpUUFJQUpDZ0lDQWdNQUFOd0lFSUFKQkFEWUNEQ0FCUVFocklnTkJBQ0FCSUFOUEd5SUJRUU4ySUFGQkIzRkJBRWRxSVFGQkNDRURBMEFnQVFSQUlBSkJCR29nQTBHczRzQUFFSHNnQVVFQmF5RUJJQU5CQ0dvaEF3d0JCU0FBSUFJcEFnUTNBZ0FnQUVFSWFpQUNRUXhxS0FJQU5nSUFJQUpCRUdva0FBc0xDNDBCQVFSL0lBRWdBQ2dDQUNBQUtBSUlJZ1JyU3dSQUlBQWdCQ0FCUVFGQkFSQnRJQUFvQWdnaEJBc2dBQ2dDQkNBRWFpRUZRUUVnQVNBQlFRRk5HeUlHUVFGcklRTUNRQU5BSUFNRVFDQUZJQUk2QUFBZ0EwRUJheUVESUFWQkFXb2hCUXdCQlFKQUlBUWdCbW9oQXlBQkRRQWdBMEVCYXlFRERBTUxDd3NnQlNBQ09nQUFDeUFBSUFNMkFnZ0xBd0FBQzNvQkFuOENmeUFDUlFSQVFRRU1BUXNEUUNBQ1FRRk5CRUFDUUNBQklBUkJBblJxS0FJQUlnRWdBMGNOQUVFQURBTUxCU0FFSUFKQkFYWWlCU0FFYWlJRUlBRWdCRUVDZEdvb0FnQWdBMHNiSVFRZ0FpQUZheUVDREFFTEN5QUVJQUVnQTBscUlRUkJBUXNoQWlBQUlBUTJBZ1FnQUNBQ05nSUFDNGdCQVFKL0l3QkJFR3NpQXlRQUlBTWdBU2dDQUNJRktBSUFOZ0lNUVFFaEJFR0FFQ0FDUVFKcUlnRWdBV3dpQVNBQlFZQVFUUnNpQWtFRUlBTkJER3BCQVVFRVFRVVFUeUVCSUFVZ0F5Z0NERFlDQUNBQkJFQWdBVUlBTndJRUlBRWdBU0FDUVFKMGFrRUNjallDQUVFQUlRUUxJQUFnQVRZQ0JDQUFJQVEyQWdBZ0EwRVFhaVFBQzQwQkFRTi9Jd0JCa0FacklnTWtBQ0FBRUtnQklBQkJDR3NoQWdKQUFrQWdBVVVFUUNBQ0tBSUFRUUZIRFFJZ0F5QUFRUVJxUVpBR0VCWWdBa0VBTmdJQUFrQWdBa0YvUmcwQUlBQkJCR3NpQkNnQ0FFRUJheUVBSUFRZ0FEWUNBQ0FBRFFBZ0FrRUVRWndHRURnTEVFY01BUXNnQWhDY0FRc2dBMEdRQm1va0FBOExRYURCd0FCQlB4QzVBUUFMM3dFQkJIOGpBRUVRYXlJRUpBQWdBU2dDQ0NJRElBSlBCRUFnQkVFSWFpQURJQUpySWdOQkJFRVVRY2phd0FBUVlDQUVLQUlJSVFVZ0JDZ0NEQ0FCSUFJMkFnZ2dBU2dDQkNBQ1FSUnNhaUFEUVJSc0VCWWhBU0FBSUFNMkFnZ2dBQ0FCTmdJRUlBQWdCVFlDQUNBRVFSQnFKQUFQQ3lNQVFUQnJJZ0FrQUNBQUlBTTJBZ1FnQUNBQ05nSUFJQUJCQXpZQ0RDQUFRZmpGd0FBMkFnZ2dBRUlDTndJVUlBQWdBRUVFYXExQ2dJQ0FnT0FCaERjREtDQUFJQUN0UW9DQWdJRGdBWVEzQXlBZ0FDQUFRU0JxTmdJUUlBQkJDR3BCeU5yQUFCQ0tBUUFMZmdFRGZ3SkFJQUFvQWdBaUFVRUNjUTBBSUFGQmZIRWlBa1VOQUNBQ0lBSW9BZ1JCQTNFZ0FDZ0NCRUY4Y1hJMkFnUWdBQ2dDQUNFQkN5QUFLQUlFSWdKQmZIRWlBd1JBSUFNZ0F5Z0NBRUVEY1NBQlFYeHhjallDQUNBQUtBSUVJUUlnQUNnQ0FDRUJDeUFBSUFKQkEzRTJBZ1FnQUNBQlFRTnhOZ0lBQzM4QkFuOGdBQ0FCSUFBb0FnZ2lBMnNpQkJDT0FTQUVCRUFnQXlBQmF5RUVJQUVnQUNnQ0NDSUJhaUFEYXlFRElBQW9BZ1FnQVVFVWJHb2hBUU5BSUFGQ29JQ0FnQkEzQWdBZ0FVRUlhaUFDS1FBQU53QUFJQUZCRUdvZ0FrRUlhaThBQURzQUFDQUJRUlJxSVFFZ0JFRUJhaUlFRFFBTElBQWdBellDQ0FzTGdnRUJBWDhqQUVGQWFpSUNKQUFnQWtFck5nSU1JQUpCa0lEQUFEWUNDQ0FDUVlDQXdBQTJBaFFnQWlBQU5nSVFJQUpCQWpZQ0hDQUNRZVRtd0FBMkFoZ2dBa0lDTndJa0lBSWdBa0VRYXExQ2dJQ0FnTUFCaERjRE9DQUNJQUpCQ0dxdFFvQ0FnSURRQVlRM0F6QWdBaUFDUVRCcU5nSWdJQUpCR0dvZ0FSQ0tBUUFMZGdJQmZ3RitBa0FDUUNBQnJVSU1maUlEUWlDSXB3MEFJQU9uSWdKQmVFc05BQ0FDUVFkcVFYaHhJZ0lnQVVFSWFtb2hBU0FCSUFKSkRRRWdBVUg0Ly8vL0IwMEVRQ0FBSUFJMkFnZ2dBQ0FCTmdJRUlBQkJDRFlDQUE4TElBQkJBRFlDQUE4TElBQkJBRFlDQUE4TElBQkJBRFlDQUF0MkFRSi9JQUtuSVFOQkNDRUVBMEFnQVNBRGNTSURJQUJxS1FBQVFvQ0Jnb1NJa0tEQWdIK0RJZ0pDQUZKRkJFQWdBeUFFYWlFRElBUkJDR29oQkF3QkN3c2dBbnFuUVFOMklBTnFJQUZ4SWdFZ0FHb3NBQUJCQUU0RWZ5QUFLUU1BUW9DQmdvU0lrS0RBZ0grRGVxZEJBM1lGSUFFTEMzUUJCbjhnQUNnQ0JDRUdJQUFvQWdBaEFnSkFBMEFnQVNBRFJnMEJBa0FnQWlBR1JnMEFJQUFnQWtFUWFpSUhOZ0lBSUFJb0FnUWhCU0FDS0FJQUlnSkJnSUNBZ0hoR0RRQWdBaUFGRUtNQklBTkJBV29oQXlBSElRSU1BUXNMUVlDQWdJQjRJQVVRb3dFZ0FTQURheUVFQ3lBRUMyb0FBbjhnQWtFQ2RDSUJJQU5CQTNSQmdJQUJhaUlDSUFFZ0Frc2JRWWVBQkdvaUFVRVFka0FBSWdKQmYwWUVRRUVBSVFKQkFRd0JDeUFDUVJCMElnSkNBRGNDQkNBQ0lBSWdBVUdBZ0h4eGFrRUNjallDQUVFQUN5RURJQUFnQWpZQ0JDQUFJQU0yQWdBTGtBRUFJQUFRbmdFZ0FFRWthaENlQVNBQUtBSlFJQUFvQWxSQkJFRUVFSjhCSUFBb0Fsd2dBQ2dDWUVFQlFRRVFud0VnQUNnQzBBVWdBQ2dDMUFWQkFrRUlFSjhCSUFBb0F0d0ZJQUFvQXVBRlFRSkJEQkNmQVNBQUtBTG9CU0FBS0FMc0JVRUVRUXdRbndFZ0FDZ0M5QVVnQUNnQytBVkJCRUVRRUo4QklBQW9Bb0FHSUFBb0FvUUdRUVJCQkJDZkFRdURBUUVCZndKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQWdBVUVJYXc0SUFRSUdCZ1lEQkFVQUMwRXlJUUlnQVVHRUFXc09DZ1VHQ1FrSENRa0pDUWdKQ3d3SUMwRWJJUUlNQnd0QkJpRUNEQVlMUVN3aEFnd0ZDMEVxSVFJTUJBdEJIeUVDREFNTFFTQWhBZ3dDQzBFY0lRSU1BUXRCSXlFQ0N5QUFJQUk2QUFBTGF3RUhmeUFBS0FJSUlRTWdBQ2dDQkNFRUlBQXRBQXhCQVhFaEJTQUFLQUlBSWdJaEFRSkFBMEFnQVNBRVJnUkFRUUFQQ3lBQUlBRkJCR29pQmpZQ0FDQUZEUUVnQVNnQ0FDRUhJQVloQVNBREtBSUFJQWRQRFFBTElBRkJCR3NoQWdzZ0FFRUJPZ0FNSUFJTGV3RUNmeU1BUVJCcklnTWtBRUhNc3NFQVFjeXl3UUFvQWdBaUJFRUJhallDQUFKQUlBUkJBRWdOQUFKQVFkU3l3UUF0QUFCRkJFQkIwTExCQUVIUXNzRUFLQUlBUVFGcU5nSUFRY2l5d1FBb0FnQkJBRTROQVF3Q0N5QURRUWhxSUFBZ0FSRUFBQUFMUWRTeXdRQkJBRG9BQUNBQ1JRMEFBQXNBQzJzQkFYOGpBRUV3YXlJREpBQWdBeUFCTmdJRUlBTWdBRFlDQUNBRFFRSTJBZ3dnQTBIUTVzQUFOZ0lJSUFOQ0FqY0NGQ0FESUFPdFFvQ0FnSURnQVlRM0F5Z2dBeUFEUVFScXJVS0FnSUNBNEFHRU53TWdJQU1nQTBFZ2FqWUNFQ0FEUVFocUlBSVFpZ0VBQzJzQkFYOGpBRUV3YXlJREpBQWdBeUFCTmdJRUlBTWdBRFlDQUNBRFFRTTJBZ3dnQTBHY3hjQUFOZ0lJSUFOQ0FqY0NGQ0FESUFOQkJHcXRRb0NBZ0lEZ0FZUTNBeWdnQXlBRHJVS0FnSUNBNEFHRU53TWdJQU1nQTBFZ2FqWUNFQ0FEUVFocUlBSVFpZ0VBQzJjQkIzOGdBU2dDQ0NFRElBRW9BZ0FoQWlBQktBSUVJUVlEUUFKQUlBTWhCQ0FDSUFaR0JFQkJBQ0VGREFFTFFRRWhCU0FCSUFKQkFXb2lCellDQUNBQklBUkJBV29pQXpZQ0NDQUNMUUFBSUFjaEFrVU5BUXNMSUFBZ0JEWUNCQ0FBSUFVMkFnQUxaUUVFZnlBQUtBSUFJUUVnQUNnQ0JDRURBa0FEUUNBQklBTkdCRUJCQUE4TElBQWdBVUVRYWlJRU5nSUFJQUV2QVFRaUFrRVpUVUVBUVFFZ0FuUkJ3b0dBRUhFYkRRRWdBa0dYQ0d0QkEwa05BU0FFSVFFZ0FrRXZSdzBBQzBHWENBOExJQUlMYUFFQ2Z5TUFRUkJySWdZa0FBSkFJQUFnQVNBQ0lBTWdCUkFjSWdjTkFDQUdRUWhxSUFNZ0FDQUJJQVFSQmdCQkFDRUhJQVlvQWdnTkFDQUdLQUlNSWdRZ0FpZ0NBRFlDQ0NBQ0lBUTJBZ0FnQUNBQklBSWdBeUFGRUJ3aEJ3c2dCa0VRYWlRQUlBY0xZd0VGZnlBQUtBSUVRUVJySVFJZ0FDZ0NDQ0VESUFBb0FnQWhCQ0FBTFFBTVFRRnhJUVVEUUNBRUlBSWlBVUVFYWtZRVFFRUFEd3NnQUNBQk5nSUVJQVZGQkVBZ0FVRUVheUVDSUFNb0FnQWdBU2dDQUUwTkFRc0xJQUJCQVRvQURDQUJDMmtCQW44Q1FBSkFJQUF0QUFBaUF5QUJMUUFBUncwQVFRRWhBZ0pBQWtBZ0EwRURhdzRDQVFBREN5QUFMUUFCSUFFdEFBRkhEUUZCQUNFQ0lBQXRBQUlnQVMwQUFrY05BaUFBTFFBRElBRXRBQU5HRHdzZ0FDMEFBU0FCTFFBQlJnOExRUUFoQWdzZ0FndGlBUUovSUFBZ0FDZ0NhQ0lDSUFBb0Fwd0JRUUZySWdNZ0FpQURTUnMyQW1nZ0FDQUJJQUFvQXFnQlFRQWdBQzBBdmdFaUFoc2lBV29pQXlBQklBRWdBMGtiSWdFZ0FDZ0NyQUVnQUNnQ29BRkJBV3NnQWhzaUFDQUFJQUZMR3pZQ2JBdGNBQUpBSUFJZ0EwMEVRQ0FCSUFOSkRRRWdBeUFDYXlFRElBQWdBbW9oQWdOQUlBTUVRQ0FDUVFFNkFBQWdBMEVCYXlFRElBSkJBV29oQWd3QkN3c1BDeUFDSUFOQjlPUEFBQkMxQVFBTElBTWdBVUgwNDhBQUVMTUJBQXRvQVFSL0l3QkJFR3NpQWlRQUlBRW9BZ1FoQXlBQ1FRaHFJQUVvQWdnaUJFRUVRUlJCOE1yQUFCQmdJQUlvQWdnaEJTQUNLQUlNSUFNZ0JFRVViQkFXSVFNZ0FDQUVOZ0lJSUFBZ0F6WUNCQ0FBSUFVMkFnQWdBQ0FCTFFBTU9nQU1JQUpCRUdva0FBdGdBUU4vSXdCQklHc2lBaVFBSUFKQkNHb2dBVUVCUVFGQjFPUEFBQkJnSUFKQkZHb2lBMEVJYWlJRVFRQTJBZ0FnQWlBQ0tRTUlOd0lVSUFNZ0FVRUJFRG9nQUVFSWFpQUVLQUlBTmdJQUlBQWdBaWtDRkRjQ0FDQUNRU0JxSkFBTFd3RUNmeUFCRUtnQklBRkJDR3NpQXlnQ0FFRUJhaUVDSUFNZ0FqWUNBQUpBSUFJRVFDQUJLQUlBSWdKQmYwWU5BU0FBSUFNMkFnZ2dBQ0FCTmdJRUlBQWdBVUVFYWpZQ0FDQUJJQUpCQVdvMkFnQVBDd0FMRUxnQkFBdVZBUUVEZnlBQUtBSUFJZ1FnQUNnQ0NDSUZSZ1JBSXdCQkVHc2lBeVFBSUFOQkNHb2dBQ0FFUVFGQkJFRVVFQ1lnQXlnQ0NDSUVRWUdBZ0lCNFJ3UkFJQU1vQWd3YUlBUWdBaEN1QVFBTElBTkJFR29rQUFzZ0FDQUZRUUZxTmdJSUlBQW9BZ1FnQlVFVWJHb2lBQ0FCS1FJQU53SUFJQUJCQ0dvZ0FVRUlhaWtDQURjQ0FDQUFRUkJxSUFGQkVHb29BZ0EyQWdBTHJRRUJCWDhnQUNnQ0JDRUNJQUFvQWdBaEFTQUFRb1NBZ0lEQUFEY0NBQUpBSUFFZ0FrWU5BQ0FDSUFGclFRUjJJUUlEUUNBQ1JRMEJJQUVvQWdBZ0FVRUVhaWdDQUVFRVFSUVFud0VnQWtFQmF5RUNJQUZCRUdvaEFRd0FDd0FMSUFBb0FoQWlBUVJBSUFBb0FnZ2lBaWdDQ0NJRElBQW9BZ3dpQkVjRVFDQUNLQUlFSWdVZ0EwRUVkR29nQlNBRVFRUjBhaUFCUVFSMEVCSWdBQ2dDRUNFQkN5QUNJQUVnQTJvMkFnZ0xDMDRCQkg4Q1FBSkFBa0FnQUMwQUFDSUVRUU5yRGdJQUFRSUxJQUF0QUFFaEF3d0JDeUFBTFFBQ1FSQjBJUUVnQUMwQUEwRVlkQ0VDSUFBdEFBRWhBd3NnQVNBQ2NpQURRUWgwY2lBRWNndFNBUVIvSUFBb0FnQWhBU0FBS0FJRUlRUURRQ0FCSUFSR0JFQkJBdzhMSUFBZ0FVRVFhaUlDTmdJQUlBRXZBUVFoQXlBQ0lRRkJCRUVVUVFNZ0EwRVVSaHNnQTBFRVJoc2lBa0VEUmcwQUN5QUNDMHdCQW44Z0FrRUNkQ0VDRUFBaEJBTkFJQUlFUUNBRUlBTWdBU2dDQUVFQUVKc0JFQUVnQWtFRWF5RUNJQU5CQVdvaEF5QUJRUVJxSVFFTUFRc0xJQUFnQkRZQ0JDQUFRUUEyQWdBTFV3RUJmeUFBS0FKc0lnRWdBQ2dDckFGSEJFQWdBQ2dDb0FGQkFXc2dBVXNFUUNBQUlBRkJBV28yQW13Z0FDQUFLQUpvSWdFZ0FDZ0NuQUZCQVdzaUFDQUFJQUZMR3pZQ2FBc1BDeUFBUVFFUWh3RUxWd0FnQVNBQ0VFVUVRQ0FBUVlDQWdJQjROZ0lBRHdzZ0FTZ0NBQ0lDSUFFb0FnUkdCRUFnQUVHQWdJQ0FlRFlDQUE4TElBRWdBa0VRYWpZQ0FDQUFJQUlwQWdBM0FnQWdBRUVJYWlBQ1FRaHFLUUlBTndJQUMxTUJBbjhnQVJDb0FTQUJRUWhySWdJb0FnQkJBV29oQXlBQ0lBTTJBZ0FDUUNBREJFQWdBU2dDQUEwQklBQWdBallDQ0NBQUlBRTJBZ1FnQVVGL05nSUFJQUFnQVVFRWFqWUNBQThMQUFzUXVBRUFDMUVCQW44Z0FDQUFLQUpvSWdJZ0FDZ0NuQUZCQVdzaUF5QUNJQU5KR3pZQ2FDQUFJQUFvQXFBQlFRRnJJQUFvQXF3QklnSWdBQ2dDYkNJQUlBSkxHeUlDSUFBZ0FXb2lBQ0FBSUFKTEd6WUNiQXZ0QVFJRWZ3RitJd0JCRUdzaUJpUUFJd0JCRUdzaUJ5UUFJQVpCQkdvaUJRSi9Ba0FnQWlBRGFrRUJhMEVBSUFKcmNhMGdBYTErSWdsQ0lJaW5EUUFnQ2FjaUEwR0FnSUNBZUNBQ2Ewc05BQ0FEUlFSQUlBVWdBallDQ0NBRlFRQTJBZ1JCQUF3Q0N5QUhRUWhxSUFJZ0F4Q01BU0FIS0FJSUlnZ0VRQ0FGSUFnMkFnZ2dCU0FCTmdJRVFRQU1BZ3NnQlNBRE5nSUlJQVVnQWpZQ0JFRUJEQUVMSUFWQkFEWUNCRUVCQ3pZQ0FDQUhRUkJxSkFBZ0JpZ0NDQ0VCSUFZb0FnUkZCRUFnQUNBR0tBSU1OZ0lFSUFBZ0FUWUNBQ0FHUVJCcUpBQVBDeUFHS0FJTUdpQUJJQVFRcmdFQUMwb0JBbjhnQUNBQUtBSm9JZ0lnQUNnQ25BRkJBV3NpQXlBQ0lBTkpHellDYUNBQUlBQW9BcWdCSWdKQkFDQUFLQUpzSWdBZ0FrOGJJZ0lnQUNBQmF5SUFJQUFnQWtnYk5nSnNDejhCQVg4akFFRVFheUlESkFBZ0EwRUlhaUFBRUhJZ0FTQURLQUlNSWdCSkJFQWdBeWdDQ0NBRFFSQnFKQUFnQVVFRWRHb1BDeUFCSUFBZ0FoQkxBQXVGQVFFRGZ5QUFLQUlBSWdRZ0FDZ0NDQ0lGUmdSQUl3QkJFR3NpQXlRQUlBTkJDR29nQUNBRVFRRkJBa0VNRUNZZ0F5Z0NDQ0lFUVlHQWdJQjRSd1JBSUFNb0Fnd2FJQVFnQWhDdUFRQUxJQU5CRUdva0FBc2dBQ0FGUVFGcU5nSUlJQUFvQWdRZ0JVRU1iR29pQUNBQktRRUFOd0VBSUFCQkNHb2dBVUVJYWlnQkFEWUJBQXRHQVFOL0lBRWdBaUFERUVRaUJTQUJhaUlFTFFBQUlRWWdCQ0FEcDBFWmRpSUVPZ0FBSUFFZ0JVRUlheUFDY1dwQkNHb2dCRG9BQUNBQUlBWTZBQVFnQUNBRk5nSUFDMVFCQVg4Z0FDQUFLQUpzTmdKNElBQWdBQ2tCc2dFM0FYd2dBQ0FBTHdHK0FUc0JoZ0VnQUVHRUFXb2dBRUc2QVdvdkFRQTdBUUFnQUNBQUtBSm9JZ0VnQUNnQ25BRkJBV3NpQUNBQUlBRkxHellDZEF0UkFnRi9BWDRqQUVFUWF5SUNKQUFnQWtFRWFpQUJFRllnQWlnQ0JDa0NuQUVoQTBFSUVKa0JJZ0VnQXpjQ0FDQUNLQUlJSUFJb0Fnd1FvZ0VnQUVFQ05nSUVJQUFnQVRZQ0FDQUNRUkJxSkFBTFNRRUJmeU1BUVJCcklnVWtBQ0FGUVFocUlBRVFjaUFGSUFJZ0F5QUZLQUlJSUFVb0Fnd2dCQkJzSUFVb0FnUWhBU0FBSUFVb0FnQTJBZ0FnQUNBQk5nSUVJQVZCRUdva0FBdFBBUUovSUFBb0FnUWhBaUFBS0FJQUlRTUNRQ0FBS0FJSUlnQXRBQUJGRFFBZ0EwR001OEFBUVFRZ0FpZ0NEQkVEQUVVTkFFRUJEd3NnQUNBQlFRcEdPZ0FBSUFNZ0FTQUNLQUlRRVFJQUMwZ0JBbjhDUUNBQktBSUFJZ0pCZjBjRVFDQUNRUUZxSVFNZ0FrRUdTUTBCSUFOQkJrSEU0Y0FBRUxNQkFBdEJ4T0hBQUJCOUFBc2dBQ0FETmdJRUlBQWdBVUVFYWpZQ0FBdENBUUYvSUFKQkFuUWhBZ05BSUFJRVFDQUFLQUlBSVFNZ0FDQUJLQUlBTmdJQUlBRWdBellDQUNBQ1FRRnJJUUlnQVVFRWFpRUJJQUJCQkdvaEFBd0JDd3NMU0FFQ2Z5TUFRUkJySWdJa0FDQUNRUWhxSUFBZ0FDZ0NBRUVCUVFSQkJCQW1JQUlvQWdnaUFFR0JnSUNBZUVjRVFDQUNLQUlNSVFNZ0FDQUJFSzRCQUFzZ0FrRVFhaVFBQ3o4QUFrQWdBU0FDVFFSQUlBSWdCRTBOQVNBQ0lBUWdCUkN6QVFBTElBRWdBaUFGRUxVQkFBc2dBQ0FDSUFGck5nSUVJQUFnQXlBQlFRUjBhallDQUF0SUFRSi9Jd0JCRUdzaUJTUUFJQVZCQ0dvZ0FDQUJJQUlnQXlBRUVDWWdCU2dDQ0NJQVFZR0FnSUI0UndSQUlBVW9BZ3doQmlBQVFZVE13QUFRcmdFQUN5QUZRUkJxSkFBTFJ3RUNmeUFBS0FJQUlBQW9BZ1JCQkVFRUVKOEJJQUFvQWd3aEFpQUFLQUlRSWdBb0FnQWlBUVJBSUFJZ0FSRUVBQXNnQUNnQ0JDSUJCRUFnQWlBQUtBSUlJQUVRT0FzTFFRQWdBQzBBdkFGQkFVWUVRQ0FBUVFBNkFMd0JJQUJCOUFCcUlBQkJpQUZxRUhRZ0FDQUFRU1JxRUhVZ0FDZ0NZQ0FBS0FKa1FRQWdBQ2dDb0FFUVV3c0xRUUVEZnlBQktBSVVJZ0lnQVNnQ0hDSURheUVFSUFJZ0Ewa0VRQ0FFSUFKQndNL0FBQkMwQVFBTElBQWdBellDQkNBQUlBRW9BaEFnQkVFRWRHbzJBZ0FMUWdFQmZ5TUFRU0JySWdNa0FDQURRUUEyQWhBZ0EwRUJOZ0lFSUFOQ0JEY0NDQ0FESUFFMkFod2dBeUFBTmdJWUlBTWdBMEVZYWpZQ0FDQURJQUlRaWdFQUMwRUJBMzhnQVNnQ0ZDSUNJQUVvQWh3aUEyc2hCQ0FDSUFOSkJFQWdCQ0FDUWREUHdBQVF0QUVBQ3lBQUlBTTJBZ1FnQUNBQktBSVFJQVJCQkhScU5nSUFDMFFCQVg4Z0FTZ0NBQ0lDSUFFb0FnUkdCRUFnQUVHQWdJQ0FlRFlDQUE4TElBRWdBa0VRYWpZQ0FDQUFJQUlwQWdBM0FnQWdBRUVJYWlBQ1FRaHFLUUlBTndJQUN6c0JBMzhEUUNBQ1FSUkdSUVJBSUFBZ0Ftb2lBeWdDQUNFRUlBTWdBU0FDYWlJREtBSUFOZ0lBSUFNZ0JEWUNBQ0FDUVFScUlRSU1BUXNMQ3pzQkEzOERRQ0FDUVNSR1JRUkFJQUFnQW1vaUF5Z0NBQ0VFSUFNZ0FTQUNhaUlES0FJQU5nSUFJQU1nQkRZQ0FDQUNRUVJxSVFJTUFRc0xDem9CQVg4Q1FDQUNRWDlIQkVBZ0FrRUJhaUVFSUFKQklFa05BU0FFUVNBZ0F4Q3pBUUFMSUFNUWZRQUxJQUFnQkRZQ0JDQUFJQUUyQWdBTE9BQUNRQ0FCYVVFQlJ3MEFRWUNBZ0lCNElBRnJJQUJKRFFBZ0FBUkFRZXl5d1FBdEFBQWFJQUVnQUJBMUlnRkZEUUVMSUFFUEN3QUxPQUFDUUNBQ1FZQ0F4QUJHRFFBZ0FDQUNJQUVvQWhBUkFnQkZEUUJCQVE4TElBTkZCRUJCQUE4TElBQWdBMEVBSUFFb0Fnd1JBd0FMTFFFQmZ5QUJJQUFvQWdCUEJIOGdBQ2dDQkNFQ0lBQXRBQWhGQkVBZ0FTQUNUUThMSUFFZ0Fra0ZRUUFMQzNBQkEzOGdBQ2dDQUNJRUlBQW9BZ2dpQlVZRVFDTUFRUkJySWdNa0FDQURRUWhxSUFBZ0JFRUJRUUpCQ0JBbUlBTW9BZ2dpQkVHQmdJQ0FlRWNFUUNBREtBSU1HaUFFSUFJUXJnRUFDeUFEUVJCcUpBQUxJQUFnQlVFQmFqWUNDQ0FBS0FJRUlBVkJBM1JxSUFFM0FRQUxOQUVCZnlBQUtBSUlJZ01nQUNnQ0FFWUVRQ0FBSUFJUWF3c2dBQ0FEUVFGcU5nSUlJQUFvQWdRZ0EwRUNkR29nQVRZQ0FBc3VBUUYvSXdCQkVHc2lBaVFBSUFKQkNHb2dBU0FBRUl3QklBSW9BZ2dpQUFSQUlBSkJFR29rQUNBQUR3c0FDemNCQVg4akFFRWdheUlCSkFBZ0FVRUFOZ0lZSUFGQkFUWUNEQ0FCUVl6cHdBQTJBZ2dnQVVJRU53SVFJQUZCQ0dvZ0FCQ0tBUUFMS2dFQmZ5QUNJQU1RTlNJRUJFQWdCQ0FBSUFFZ0F5QUJJQU5KR3hBV0dpQUFJQUlnQVJBNEN5QUVDeXNBSUFJZ0Ewa0VRQ0FESUFJZ0JCQzBBUUFMSUFBZ0FpQURhellDQkNBQUlBRWdBMEVVYkdvMkFnQUxMd0VCZnlBQUlBSVFqZ0VnQUNnQ0JDQUFLQUlJSWdOQkZHeHFJQUVnQWtFVWJCQVdHaUFBSUFJZ0EybzJBZ2dMS3dBZ0FTQURTd1JBSUFFZ0F5QUVFTFFCQUFzZ0FDQURJQUZyTmdJRUlBQWdBaUFCUVFSMGFqWUNBQXN2QUFKQUFrQWdBMmxCQVVjTkFFR0FnSUNBZUNBRGF5QUJTUTBBSUFBZ0FTQURJQUlRZmlJQURRRUxBQXNnQUFzdUFBTkFJQUVFUUNBQUtBSUFJQUJCQkdvb0FnQkJCRUVVRUo4QklBRkJBV3NoQVNBQVFSQnFJUUFNQVFzTEN6SUJBWDhnQUNnQ0NDRUNJQUVnQUNnQ0FFRUNhaTBBQUJDYkFTRUJJQUFvQWdRZ0FpQUJFQUVnQUNBQ1FRRnFOZ0lJQ3lvQUlBQWdBQ2dDYUNBQmFpSUJJQUFvQXB3QklnQkJBV3NnQUNBQlN4dEJBQ0FCUVFCT0d6WUNhQXN6QVFKL0lBQWdBQ2dDcUFFaUFpQUFLQUtzQVVFQmFpSURJQUVnQUVHeUFXb1FOaUFBS0FKZ0lBQW9BbVFnQWlBREVGTUxNd0VDZnlBQUlBQW9BcWdCSWdJZ0FDZ0NyQUZCQVdvaUF5QUJJQUJCc2dGcUVCMGdBQ2dDWUNBQUtBSmtJQUlnQXhCVEN5b0FJQUVnQWtrRVFFR2t5TUFBUVNOQnZNbkFBQkJ4QUFzZ0FpQUFJQUpCRkd4cUlBRWdBbXNRR1FzMUFDQUFJQUFwQW5RM0FtZ2dBQ0FBS1FGOE53R3lBU0FBSUFBdkFZWUJPd0crQVNBQVFib0JhaUFBUVlRQmFpOEJBRHNCQUF2c0FRSUNmd0YrSXdCQkVHc2lBaVFBSUFKQkFUc0JEQ0FDSUFFMkFnZ2dBaUFBTmdJRUl3QkJFR3NpQVNRQUlBSkJCR29pQUNrQ0FDRUVJQUVnQURZQ0RDQUJJQVEzQWdRakFFRVFheUlBSkFBZ0FVRUVhaUlCS0FJQUlnSW9BZ3doQXdKQUFrQUNRQUpBSUFJb0FnUU9BZ0FCQWdzZ0F3MEJRUUVoQWtFQUlRTU1BZ3NnQXcwQUlBSW9BZ0FpQWlnQ0JDRURJQUlvQWdBaEFnd0JDeUFBUVlDQWdJQjROZ0lBSUFBZ0FUWUNEQ0FCS0FJSUlnRXRBQWthSUFCQkd5QUJMUUFJRUVvQUN5QUFJQU0yQWdRZ0FDQUNOZ0lBSUFFb0FnZ2lBUzBBQ1JvZ0FFRWNJQUV0QUFnUVNnQUxLd0VDZndKQUlBQW9BZ1FnQUNnQ0NDSUJFRFFpQWtVTkFDQUJJQUpKRFFBZ0FDQUJJQUpyTmdJSUN3c21BQ0FDQkVCQjdMTEJBQzBBQUJvZ0FTQUNFRFVoQVFzZ0FDQUNOZ0lFSUFBZ0FUWUNBQXNqQVFGL0lBRWdBQ2dDQUNBQUtBSUlJZ0pyU3dSQUlBQWdBaUFCUVFSQkVCQnRDd3NqQVFGL0lBRWdBQ2dDQUNBQUtBSUlJZ0pyU3dSQUlBQWdBaUFCUVFSQkZCQnRDd3NsQUNBQVFRRTJBZ1FnQUNBQktBSUVJQUVvQWdCclFRUjJJZ0UyQWdnZ0FDQUJOZ0lBQ3hzQUlBRWdBazBFUUNBQ0lBRWdBeEJMQUFzZ0FDQUNRUlJzYWdzZ0FDQUJJQUpOQkVBZ0FpQUJRZVRqd0FBUVN3QUxJQUFnQW1wQkFUb0FBQXNiQUNBQklBSk5CRUFnQWlBQklBTVFTd0FMSUFBZ0FrRUVkR29MQXdBQUN3TUFBQXNEQUFBTEF3QUFDd01BQUFzREFBQUxHZ0JCN0xMQkFDMEFBQnBCQkNBQUVEVWlBQVJBSUFBUEN3QUxJUUFnQUVVRVFFR2M2OEFBUVRJUXVRRUFDeUFBSUFJZ0F5QUJLQUlRRVFFQUN4WUFJQUZCQVhGRkJFQWdBTGdRQ1E4TElBQ3RFQW9MUmdFQmZ5QUFJQUFvQWdCQkFXc2lBVFlDQUNBQlJRUkFJQUJCREdvUVJ3SkFJQUJCZjBZTkFDQUFJQUFvQWdSQkFXc2lBVFlDQkNBQkRRQWdBRUVFUVp3R0VEZ0xDd3NmQUNBQVJRUkFRWnpyd0FCQk1oQzVBUUFMSUFBZ0FpQUJLQUlRRVFJQUN5RUJBWDhnQUNnQ0VDSUJJQUFvQWhRUWd3RWdBQ2dDRENBQlFRUkJFQkNmQVFzU0FDQUFCRUFnQVNBQ0lBQWdBMndRT0FzTElRRUJmeUFBS0FJRUlnRWdBQ2dDQ0JDREFTQUFLQUlBSUFGQkJFRVFFSjhCQ3hZQUlBQkJFR29RV0NBQUtBSUFJQUFvQWdRUW93RUxGQUFnQUNBQUtBSUFRUUZyTmdJQUlBRVFuQUVMR1FBZ0FFR0FnSUNBZUVjRVFDQUFJQUZCQkVFVUVKOEJDd3NVQUNBQkJFQkJnSUNBZ0hnZ0FSQ2pBUXNnQVFzWkFDQUJLQUljUWNqbHdBQkJEaUFCS0FJZ0tBSU1FUU1BQ3c4QUlBSUVRQ0FBSUFFZ0FoQTRDd3NQQUNBQkJFQWdBQ0FDSUFFUU9Bc0xFd0FnQUFSQUR3dEJwS25CQUVFYkVMa0JBQXNQQUNBQVFZUUJUd1JBSUFBUUF3c0xFd0FnQUNnQ0NDQUFLQUlBUVFKQkFoQ2ZBUXNWQUNBQ0lBSVFwQUVhSUFCQmdJQ0FnSGcyQWdBTEZBQWdBQ2dDQUNBQklBQW9BZ1FvQWd3UkFnQUxFQUFnQVNBQUtBSUVJQUFvQWdnUUR3czhBQ0FBUlFSQUl3QkJJR3NpQUNRQUlBQkJBRFlDR0NBQVFRRTJBZ3dnQUVIUXhNQUFOZ0lJSUFCQ0JEY0NFQ0FBUVFocUlBRVFpZ0VBQ3dBTEZBQWdBRUVBTmdJSUlBQkNnSUNBZ0JBM0FnQUxFZ0FnQUNBQlFaRE53QUFRWWtFQk9nQU1DeEFBSUFFZ0FDZ0NBQ0FBS0FJRUVBOExEZ0FnQUVFQU5nSUFJQUVRbkFFTGF3RUJmeU1BUVRCcklnTWtBQ0FESUFFMkFnUWdBeUFBTmdJQUlBTkJBallDRENBRFFlanB3QUEyQWdnZ0EwSUNOd0lVSUFNZ0EwRUVhcTFDZ0lDQWdPQUJoRGNES0NBRElBT3RRb0NBZ0lEZ0FZUTNBeUFnQXlBRFFTQnFOZ0lRSUFOQkNHb2dBaENLQVFBTGF3RUJmeU1BUVRCcklnTWtBQ0FESUFFMkFnUWdBeUFBTmdJQUlBTkJBallDRENBRFFjanB3QUEyQWdnZ0EwSUNOd0lVSUFNZ0EwRUVhcTFDZ0lDQWdPQUJoRGNES0NBRElBT3RRb0NBZ0lEZ0FZUTNBeUFnQXlBRFFTQnFOZ0lRSUFOQkNHb2dBaENLQVFBTGF3RUJmeU1BUVRCcklnTWtBQ0FESUFFMkFnUWdBeUFBTmdJQUlBTkJBallDRENBRFFaenF3QUEyQWdnZ0EwSUNOd0lVSUFNZ0EwRUVhcTFDZ0lDQWdPQUJoRGNES0NBRElBT3RRb0NBZ0lEZ0FZUTNBeUFnQXlBRFFTQnFOZ0lRSUFOQkNHb2dBaENLQVFBTERnQkI4T1hBQUVFcklBQVFjUUFMQ3dBZ0FDTUFhaVFBSXdBTERnQkJ2Nm5CQUVIUEFCQzVBUUFMQ1FBZ0FDQUJFQWNBQ3cwQUlBQkI5T2JBQUNBQkVCY0xEQUFnQUNBQktRSUFOd01BQ3dvQUlBQW9BZ0FRcVFFTERRQWdBRUdBZ0lDQWVEWUNBQXNKQUNBQVFRQTJBZ0FMQmdBZ0FCQllDd1VBUVlBRUN3UUFRUUVMQkFBZ0FRc0VBRUVBQ3d2U2JTQUFRWUNBd0FBTFFCMEFBQUFFQUFBQUJBQUFBQjRBQUFCallXeHNaV1FnWUZKbGMzVnNkRG82ZFc1M2NtRndLQ2xnSUc5dUlHRnVJR0JGY25KZ0lIWmhiSFZsUlhKeWIzSUFRYitKd0FBTEFYZ0FRZUNKd0FBTEVQLy8vLy8vLy8vLy8vLy8vLy8vLy84QVFZYUt3QUFMRHdFQUFBQUFBQ0FBQUFBQUFBQUFBZ0JCd0lyQUFBc2cvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy84QVFhU0x3QUFMQ0JBQUFBQUFBQUFCQUVIQXVNQUFDd0wvQndCQjFMakFBQXNIRHdELy8vLzEvd0JCZ0xuQUFBc1cvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vQXdCQm9MbkFBQXNkLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL3c4QVFmKzV3QUFMR1B6Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vd0JCb0xyQUFBcysvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOEFRWXk3d0FBTE9QLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOS9BRUhndThBQUM5RUIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vd01BUWNDOXdBQUxKLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vRHdCQndNREFBQXZCSTNOeVl5OXNhV0l1Y25NQUFBRUFEd0R3R2c4QUFBQUFBT0lsQUFEbEpRQUFBQUFBQUxEZ0FBQ3o0QUFBQUFBQUFEejdBUUJwK3dFQUFBQUFBR3I3QVFCcyt3RUFBQUFBQUlBbEFBQ2ZKUUFBQUFBQUFBRDdBUUE3K3dFQUFBQUFBR0YwZEdWdGNIUmxaQ0IwYnlCMFlXdGxJRzkzYm1WeWMyaHBjQ0J2WmlCU2RYTjBJSFpoYkhWbElIZG9hV3hsSUdsMElIZGhjeUJpYjNKeWIzZGxaR0puZEdWNGRHTnZaR1Z3YjJsdWRITnlZWE4wWlhKZmMzbHRZbTlzYzNabFkzUnZjbDl6ZVcxaWIyeHpBRUFnRUFBS0FBQUFaZ0FBQUJNQUFBQkFJQkFBQ2dBQUFHY0FBQUFWQUFBQVFDQVFBQW9BQUFCb0FBQUFHUUFBQUVBZ0VBQUtBQUFBYVFBQUFCa0FBQUJBSUJBQUNnQUFBR29BQUFBVkFBQUFRQ0FRQUFvQUFBQnlBQUFBTmdBQUFFQWdFQUFLQUFBQWR3QUFBRFlBQUFCQUlCQUFDZ0FBQVA0QUFBQWJBQUFBUUNBUUFBb0FBQUFDQVFBQUhRQUFBRUFnRUFBS0FBQUFHUUVBQUMwQUFBQkFJQkFBQ2dBQUFLOEFBQUFqQUFBQVFDQVFBQW9BQUFDNUFBQUFJd0FBQUVBZ0VBQUtBQUFBemdBQUFDVUFBQUJBSUJBQUNnQUFBTVlBQUFBbEFBQUFRQ0FRQUFvQUFBRHpBQUFBS1FBQUFFQWdFQUFLQUFBQTJnQUFBQ1VBQUFCQUlCQUFDZ0FBQU40QUFBQVdBQUFBUUNBUUFBb0FBQUQ1QUFBQUhRQUFBRUFnRUFBS0FBQUFJQUVBQUM4QUFBQmpZWEJoWTJsMGVTQnZkbVZ5Wm14dmR3QUFBRHdpRUFBUkFBQUFLU0J6YUc5MWJHUWdZbVVnUENCc1pXNGdLR2x6SUdsdWMyVnlkR2x2YmlCcGJtUmxlQ0FvYVhNZ0tTQnphRzkxYkdRZ1ltVWdQRDBnYkdWdUlDaHBjeUFBQUFCdUloQUFGQUFBQUlJaUVBQVhBQUFBRmxVUUFBRUFBQUJ5WlcxdmRtRnNJR2x1WkdWNElDaHBjeUFBQUxRaUVBQVNBQUFBV0NJUUFCWUFBQUFXVlJBQUFRQUFBR0JoZEdBZ2MzQnNhWFFnYVc1a1pYZ2dLR2x6SUFBQUFPQWlFQUFWQUFBQWdpSVFBQmNBQUFBV1ZSQUFBUUFBQUM5b2IyMWxMM0oxYm01bGNpOHVZMkZ5WjI4dmNtVm5hWE4wY25rdmMzSmpMMmx1WkdWNExtTnlZWFJsY3k1cGJ5MHhPVFE1WTJZNFl6WmlOV0kxTlRkbUwzVnVhV052WkdVdGQybGtkR2d0TUM0eExqRTBMM055WXk5MFlXSnNaWE11Y25NUUl4QUFaQUFBQUpFQUFBQVZBQUFBRUNNUUFHUUFBQUNYQUFBQUdRQUFBQzl1YVhndmMzUnZjbVV2TWpob2VYcG1iRE16T0d0ek5HRnRhR0UzZG5Cd2JteGljVEZ6TVc1eFlYWXRjblZ6ZEMxa1pXWmhkV3gwTFRFdU9EVXVNQzlzYVdJdmNuVnpkR3hwWWk5emNtTXZjblZ6ZEM5c2FXSnlZWEo1TDJOdmNtVXZjM0pqTDJsMFpYSXZkSEpoYVhSekwybDBaWEpoZEc5eUxuSnpBQUFBbENNUUFIMEFBQUN6QndBQUNRQUFBR0Z6YzJWeWRHbHZiaUJtWVdsc1pXUTZJRzFwWkNBOFBTQnpaV3htTG14bGJpZ3BMMjVwZUM5emRHOXlaUzh5T0doNWVtWnNNek00YTNNMFlXMW9ZVGQyY0hCdWJHSnhNWE14Ym5GaGRpMXlkWE4wTFdSbFptRjFiSFF0TVM0NE5TNHdMMnhwWWk5eWRYTjBiR2xpTDNOeVl5OXlkWE4wTDJ4cFluSmhjbmt2WTI5eVpTOXpjbU12YzJ4cFkyVXZiVzlrTG5KekFBQUFSeVFRQUhJQUFBQ2dEUUFBQ1FBQUFHRnpjMlZ5ZEdsdmJpQm1ZV2xzWldRNklHc2dQRDBnYzJWc1ppNXNaVzRvS1FBQUFFY2tFQUJ5QUFBQXpRMEFBQWtBQUFBdmJtbDRMM04wYjNKbEx6STRhSGw2Wm13ek16aHJjelJoYldoaE4zWndjRzVzWW5FeGN6RnVjV0YyTFhKMWMzUXRaR1ZtWVhWc2RDMHhMamcxTGpBdmJHbGlMM0oxYzNSc2FXSXZjM0pqTDNKMWMzUXZiR2xpY21GeWVTOWhiR3h2WXk5emNtTXZjMnhwWTJVdWNuTUFBQ1VRQUc4QUFBQ2hBQUFBR1FBQUFDOXVhWGd2YzNSdmNtVXZNamhvZVhwbWJETXpPR3R6TkdGdGFHRTNkbkJ3Ym14aWNURnpNVzV4WVhZdGNuVnpkQzFrWldaaGRXeDBMVEV1T0RVdU1DOXNhV0l2Y25WemRHeHBZaTl6Y21NdmNuVnpkQzlzYVdKeVlYSjVMMkZzYkc5akwzTnlZeTkyWldNdmJXOWtMbkp6QUFBQWdDVVFBSEVBQUFBL0NnQUFKQUFBQUVCVEVBQnhBQUFBS0FJQUFCRUFBQUF2YUc5dFpTOXlkVzV1WlhJdkxtTmhjbWR2TDNKbFoybHpkSEo1TDNOeVl5OXBibVJsZUM1amNtRjBaWE11YVc4dE1UazBPV05tT0dNMllqVmlOVFUzWmk5aGRuUXRNQzR4Tmk0d0wzTnlZeTlpZFdabVpYSXVjbk1BQUJRbUVBQmFBQUFBTFFBQUFCa0FBQUFVSmhBQVdnQUFBRm9BQUFBTkFBQUFGQ1lRQUZvQUFBQmVBQUFBRFFBQUFCUW1FQUJhQUFBQVl3QUFBQTBBQUFBVUpoQUFXZ0FBQUdnQUFBQWRBQUFBRkNZUUFGb0FBQUIxQUFBQUpRQUFBQlFtRUFCYUFBQUFmd0FBQUNVQUFBQVVKaEFBV2dBQUFJY0FBQUFWQUFBQUZDWVFBRm9BQUFDUkFBQUFKUUFBQUJRbUVBQmFBQUFBbUFBQUFCVUFBQUFVSmhBQVdnQUFBSjBBQUFBbEFBQUFGQ1lRQUZvQUFBQ29BQUFBRVFBQUFCUW1FQUJhQUFBQXN3QUFBQ0FBQUFBVUpoQUFXZ0FBQUxjQUFBQVJBQUFBRkNZUUFGb0FBQUM1QUFBQUVRQUFBQlFtRUFCYUFBQUF3d0FBQUEwQUFBQVVKaEFBV2dBQUFNY0FBQUFSQUFBQUZDWVFBRm9BQUFES0FBQUFEUUFBQUJRbUVBQmFBQUFBOUFBQUFDc0FBQUFVSmhBQVdnQUFBRGtCQUFBc0FBQUFGQ1lRQUZvQUFBQXlBUUFBR3dBQUFCUW1FQUJhQUFBQVJRRUFBQlFBQUFBVUpoQUFXZ0FBQUZjQkFBQVlBQUFBRkNZUUFGb0FBQUJjQVFBQUdBQUFBR0Z6YzJWeWRHbHZiaUJtWVdsc1pXUTZJR3hwYm1WekxtbDBaWElvS1M1aGJHd29mR3g4SUd3dWJHVnVLQ2tnUFQwZ1kyOXNjeWtBRkNZUUFGb0FBQUQzQVFBQUJRQUFBQUFBQUFBQkFBQUFBZ0FBQUFNQUFBQUVBQUFBQlFBQUFBWUFBQUFIQUFBQUNBQUFBQWtBQUFBS0FBQUFDd0FBQUF3QUFBQU5BQUFBRGdBQUFBOEFBQUFRQUFBQUVRQUFBQklBQUFBVEFBQUFGQUFBQUJVQUFBQVdBQUFBRndBQUFCZ0FBQUFaQUFBQUdnQUFBQnNBQUFBY0FBQUFIUUFBQUI0QUFBQWZBQUFBSUFBQUFDRUFBQUFpQUFBQUl3QUFBQ1FBQUFBbEFBQUFKZ0FBQUNjQUFBQW9BQUFBS1FBQUFDb0FBQUFyQUFBQUxBQUFBQzBBQUFBdUFBQUFMd0FBQURBQUFBQXhBQUFBTWdBQUFETUFBQUEwQUFBQU5RQUFBRFlBQUFBM0FBQUFPQUFBQURrQUFBQTZBQUFBT3dBQUFEd0FBQUE5QUFBQVBnQUFBRDhBQUFCQUFBQUFRUUFBQUVJQUFBQkRBQUFBUkFBQUFFVUFBQUJHQUFBQVJ3QUFBRWdBQUFCSkFBQUFTZ0FBQUVzQUFBQk1BQUFBVFFBQUFFNEFBQUJQQUFBQVVBQUFBRkVBQUFCU0FBQUFVd0FBQUZRQUFBQlZBQUFBVmdBQUFGY0FBQUJZQUFBQVdRQUFBRm9BQUFCYkFBQUFYQUFBQUYwQUFBQmVBQUFBWHdBQUFHWW1BQUNTSlFBQUNTUUFBQXdrQUFBTkpBQUFDaVFBQUxBQUFBQ3hBQUFBSkNRQUFBc2tBQUFZSlFBQUVDVUFBQXdsQUFBVUpRQUFQQ1VBQUxvakFBQzdJd0FBQUNVQUFMd2pBQUM5SXdBQUhDVUFBQ1FsQUFBMEpRQUFMQ1VBQUFJbEFBQmtJZ0FBWlNJQUFNQURBQUJnSWdBQW93QUFBTVVpQUFCL0FBQUFMMmh2YldVdmNuVnVibVZ5THk1allYSm5ieTl5WldkcGMzUnllUzl6Y21NdmFXNWtaWGd1WTNKaGRHVnpMbWx2TFRFNU5EbGpaamhqTm1JMVlqVTFOMll2WVhaMExUQXVNVFl1TUM5emNtTXZiR2x1WlM1eWN6Z3FFQUJZQUFBQUVBQUFBQlFBQUFBNEtoQUFXQUFBQUIwQUFBQVdBQUFBT0NvUUFGZ0FBQUFlQUFBQUZ3QUFBRGdxRUFCWUFBQUFJUUFBQUJNQUFBQTRLaEFBV0FBQUFDc0FBQUFrQUFBQU9Db1FBRmdBQUFBeEFBQUFHd0FBQURncUVBQllBQUFBTlFBQUFCc0FBQUE0S2hBQVdBQUFBRHdBQUFBYkFBQUFPQ29RQUZnQUFBQTlBQUFBR3dBQUFEZ3FFQUJZQUFBQVFRQUFBQnNBQUFBNEtoQUFXQUFBQUVNQUFBQWVBQUFBT0NvUUFGZ0FBQUJFQUFBQUh3QUFBRGdxRUFCWUFBQUFSd0FBQUJzQUFBQTRLaEFBV0FBQUFFNEFBQUFiQUFBQU9Db1FBRmdBQUFCUEFBQUFHd0FBQURncUVBQllBQUFBVmdBQUFCc0FBQUE0S2hBQVdBQUFBRmNBQUFBYkFBQUFPQ29RQUZnQUFBQmVBQUFBR3dBQUFEZ3FFQUJZQUFBQVh3QUFBQnNBQUFBNEtoQUFXQUFBQUcwQUFBQWJBQUFBT0NvUUFGZ0FBQUIxQUFBQUd3QUFBRGdxRUFCWUFBQUFkZ0FBQUJzQUFBQTRLaEFBV0FBQUFIZ0FBQUFlQUFBQU9Db1FBRmdBQUFCNUFBQUFId0FBQURncUVBQllBQUFBZkFBQUFCc0FBQUJwYm5SbGNtNWhiQ0JsY25KdmNqb2daVzUwWlhKbFpDQjFibkpsWVdOb1lXSnNaU0JqYjJSbE9Db1FBRmdBQUFDQUFBQUFFUUFBQURncUVBQllBQUFBaVFBQUFDY0FBQUE0S2hBQVdBQUFBSTBBQUFBWEFBQUFPQ29RQUZnQUFBQ1FBQUFBRXdBQUFEZ3FFQUJZQUFBQWtnQUFBQ2NBQUFBNEtoQUFXQUFBQUpZQUFBQWpBQUFBT0NvUUFGZ0FBQUNiQUFBQUZnQUFBRGdxRUFCWUFBQUFuQUFBQUJjQUFBQTRLaEFBV0FBQUFKOEFBQUFUQUFBQU9Db1FBRmdBQUFDaEFBQUFKd0FBQURncUVBQllBQUFBcUFBQUFCTUFBQUE0S2hBQVdBQUFBTDBBQUFBVkFBQUFPQ29RQUZnQUFBQy9BQUFBSlFBQUFEZ3FFQUJZQUFBQXdBQUFBQndBQUFBNEtoQUFXQUFBQU1NQUFBQWxBQUFBT0NvUUFGZ0FBQUR0QUFBQU1BQUFBRGdxRUFCWUFBQUE5QUFBQUNNQUFBQTRLaEFBV0FBQUFQa0FBQUFsQUFBQU9Db1FBRmdBQUFENkFBQUFIQUFBQUM5b2IyMWxMM0oxYm01bGNpOHVZMkZ5WjI4dmNtVm5hWE4wY25rdmMzSmpMMmx1WkdWNExtTnlZWFJsY3k1cGJ5MHhPVFE1WTJZNFl6WmlOV0kxTlRkbUwyRjJkQzB3TGpFMkxqQXZjM0pqTDNCaGNuTmxjaTV5Y3dBQWVDMFFBRm9BQUFER0FRQUFJZ0FBQUhndEVBQmFBQUFBMmdFQUFBMEFBQUI0TFJBQVdnQUFBTndCQUFBTkFBQUFlQzBRQUZvQUFBQk5BZ0FBSmdBQUFIZ3RFQUJhQUFBQVVnSUFBQ1lBQUFCNExSQUFXZ0FBQUZnQ0FBQVlBQUFBZUMwUUFGb0FBQUJ3QWdBQUV3QUFBSGd0RUFCYUFBQUFkQUlBQUJNQUFBQjRMUkFBV2dBQUFBVURBQUFuQUFBQWVDMFFBRm9BQUFBTEF3QUFKd0FBQUhndEVBQmFBQUFBRVFNQUFDY0FBQUI0TFJBQVdnQUFBQmNEQUFBbkFBQUFlQzBRQUZvQUFBQWRBd0FBSndBQUFIZ3RFQUJhQUFBQUl3TUFBQ2NBQUFCNExSQUFXZ0FBQUNrREFBQW5BQUFBZUMwUUFGb0FBQUF2QXdBQUp3QUFBSGd0RUFCYUFBQUFOUU1BQUNjQUFBQjRMUkFBV2dBQUFEc0RBQUFuQUFBQWVDMFFBRm9BQUFCQkF3QUFKd0FBQUhndEVBQmFBQUFBUndNQUFDY0FBQUI0TFJBQVdnQUFBRTBEQUFBbkFBQUFlQzBRQUZvQUFBQlRBd0FBSndBQUFIZ3RFQUJhQUFBQWJnTUFBQ3NBQUFCNExSQUFXZ0FBQUhjREFBQXZBQUFBZUMwUUFGb0FBQUI3QXdBQUx3QUFBSGd0RUFCYUFBQUFnd01BQUM4QUFBQjRMUkFBV2dBQUFJY0RBQUF2QUFBQWVDMFFBRm9BQUFDTUF3QUFLd0FBQUhndEVBQmFBQUFBa1FNQUFDY0FBQUI0TFJBQVdnQUFBSzBEQUFBckFBQUFlQzBRQUZvQUFBQzJBd0FBTHdBQUFIZ3RFQUJhQUFBQXVnTUFBQzhBQUFCNExSQUFXZ0FBQU1JREFBQXZBQUFBZUMwUUFGb0FBQURHQXdBQUx3QUFBSGd0RUFCYUFBQUF5d01BQUNzQUFBQjRMUkFBV2dBQUFOQURBQUFuQUFBQWVDMFFBRm9BQUFEZUF3QUFKd0FBQUhndEVBQmFBQUFBMXdNQUFDY0FBQUI0TFJBQVdnQUFBSmdEQUFBbkFBQUFlQzBRQUZvQUFBQmFBd0FBSndBQUFIZ3RFQUJhQUFBQVlBTUFBQ2NBQUFCNExSQUFXZ0FBQUo4REFBQW5BQUFBZUMwUUFGb0FBQUJuQXdBQUp3QUFBSGd0RUFCYUFBQUFwZ01BQUNjQUFBQjRMUkFBV2dBQUFPUURBQUFuQUFBQWVDMFFBRm9BQUFBT0JBQUFFd0FBQUhndEVBQmFBQUFBRndRQUFCc0FBQUI0TFJBQVdnQUFBQ0FFQUFBVUFBQUFMMmh2YldVdmNuVnVibVZ5THk1allYSm5ieTl5WldkcGMzUnllUzl6Y21NdmFXNWtaWGd1WTNKaGRHVnpMbWx2TFRFNU5EbGpaamhqTm1JMVlqVTFOMll2WVhaMExUQXVNVFl1TUM5emNtTXZkR0ZpY3k1eWM5UXdFQUJZQUFBQUNRQUFBQklBQUFEVU1CQUFXQUFBQUJFQUFBQVVBQUFBMURBUUFGZ0FBQUFYQUFBQUZBQUFBTlF3RUFCWUFBQUFId0FBQUJRQUFBQXZhRzl0WlM5eWRXNXVaWEl2TG1OaGNtZHZMM0psWjJsemRISjVMM055WXk5cGJtUmxlQzVqY21GMFpYTXVhVzh0TVRrME9XTm1PR00yWWpWaU5UVTNaaTloZG5RdE1DNHhOaTR3TDNOeVl5OTBaWEp0YVc1aGJDOWthWEowZVY5c2FXNWxjeTV5YzJ3eEVBQm9BQUFBQ0FBQUFCUUFBQUJzTVJBQWFBQUFBQXdBQUFBUEFBQUFiREVRQUdnQUFBQVFBQUFBRHdCQmpPVEFBQXZQQndFQUFBQWZBQUFBSUFBQUFDRUFBQUFpQUFBQUl3QUFBQlFBQUFBRUFBQUFKQUFBQUNVQUFBQW1BQUFBSndBQUFDOW9iMjFsTDNKMWJtNWxjaTh1WTJGeVoyOHZjbVZuYVhOMGNua3ZjM0pqTDJsdVpHVjRMbU55WVhSbGN5NXBieTB4T1RRNVkyWTRZelppTldJMU5UZG1MMkYyZEMwd0xqRTJMakF2YzNKakwzUmxjbTFwYm1Gc0xuSnpQRElRQUZ3QUFBQjFBZ0FBRlFBQUFEd3lFQUJjQUFBQXNRSUFBQTRBQUFBOE1oQUFYQUFBQUFVRUFBQWpBQUFBUW05eWNtOTNUWFYwUlhKeWIzSmhiSEpsWVdSNUlHSnZjbkp2ZDJWa09pRFdNaEFBRWdBQUFHTmhiR3hsWkNCZ1QzQjBhVzl1T2pwMWJuZHlZWEFvS1dBZ2IyNGdZU0JnVG05dVpXQWdkbUZzZFdWcGJtUmxlQ0J2ZFhRZ2IyWWdZbTkxYm1Sek9pQjBhR1VnYkdWdUlHbHpJQ0JpZFhRZ2RHaGxJR2x1WkdWNElHbHpJQUFBQUJzekVBQWdBQUFBT3pNUUFCSUFBQUE2SUFBQUFRQUFBQUFBQUFCZ014QUFBZ0FBQUFBQUFBQU1BQUFBQkFBQUFDZ0FBQUFwQUFBQUtnQUFBQ0FnSUNBc0NpZ29DakF3TURFd01qQXpNRFF3TlRBMk1EY3dPREE1TVRBeE1URXlNVE14TkRFMU1UWXhOekU0TVRreU1ESXhNakl5TXpJME1qVXlOakkzTWpneU9UTXdNekV6TWpNek16UXpOVE0yTXpjek9ETTVOREEwTVRReU5ETTBORFExTkRZME56UTRORGsxTURVeE5USTFNelUwTlRVMU5qVTNOVGcxT1RZd05qRTJNall6TmpRMk5UWTJOamMyT0RZNU56QTNNVGN5TnpNM05EYzFOelkzTnpjNE56azRNRGd4T0RJNE16ZzBPRFU0TmpnM09EZzRPVGt3T1RFNU1qa3pPVFE1TlRrMk9UYzVPRGs1WVhSMFpXMXdkR1ZrSUhSdklHbHVaR1Y0SUhOc2FXTmxJSFZ3SUhSdklHMWhlR2x0ZFcwZ2RYTnBlbVVBQUFCZE5CQUFMQUFBQUhKaGJtZGxJSE4wWVhKMElHbHVaR1Y0SUNCdmRYUWdiMllnY21GdVoyVWdabTl5SUhOc2FXTmxJRzltSUd4bGJtZDBhQ0NVTkJBQUVnQUFBS1kwRUFBaUFBQUFjbUZ1WjJVZ1pXNWtJR2x1WkdWNElOZzBFQUFRQUFBQXBqUVFBQ0lBQUFCemJHbGpaU0JwYm1SbGVDQnpkR0Z5ZEhNZ1lYUWdJR0oxZENCbGJtUnpJR0YwSUFENE5CQUFGZ0FBQUE0MUVBQU5BQUFBU0dGemFDQjBZV0pzWlNCallYQmhZMmwwZVNCdmRtVnlabXh2ZHl3MUVBQWNBQUFBTDNKMWMzUXZaR1Z3Y3k5b1lYTm9Zbkp2ZDI0dE1DNHhOUzR5TDNOeVl5OXlZWGN2Ylc5a0xuSnpBQUJRTlJBQUtnQUFBQ01BQUFBb0FBQUFzVk1RQUd3QUFBQWpBUUFBRGdBQUFHTnNiM04xY21VZ2FXNTJiMnRsWkNCeVpXTjFjbk5wZG1Wc2VTQnZjaUJoWm5SbGNpQmlaV2x1WnlCa2NtOXdjR1ZrQUFELy8vLy8vLy8vLzlBMUVBQkI2T3ZBQUF0MUwyaHZiV1V2Y25WdWJtVnlMeTVqWVhKbmJ5OXlaV2RwYzNSeWVTOXpjbU12YVc1a1pYZ3VZM0poZEdWekxtbHZMVEU1TkRsalpqaGpObUkxWWpVMU4yWXZjMlZ5WkdVdGQyRnpiUzFpYVc1a1oyVnVMVEF1Tmk0MUwzTnlZeTlzYVdJdWNuTUFBQURvTlJBQVpRQUFBRFVBQUFBT0FFR0I3Y0FBQzRjQkFRSURBd1FGQmdjSUNRb0xEQTBPQXdNREF3TURBdzhEQXdNREF3TUREd2tKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pFQWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkFFR0I3OEFBQzU4TEFRSUNBZ0lEQWdJRUFnVUdCd2dKQ2dzTURRNFBFQkVTRXhRVkZoY1lHUm9iSEIwQ0FoNENBZ0lDQWdJQ0h5QWhJaU1DSkNVbUp5Z3BBaW9DQWdJQ0t5d0NBZ0lDTFM0Q0FnSXZNREV5TXdJQ0FnSUNBalFDQWpVMk53STRPVG83UEQwK1B6azVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9VQTVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVRUUlDUWtNQ0FrUkZSa2RJU1FKS09UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1U3dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FqazVPVGxNQWdJQ0FnSk5UazlRQWdJQ1VRSlNVd0lDQWdJQ0FnSUNBZ0lDQWdKVVZRSUNWZ0pYQWdKWVdWcGJYRjFlWDJCaEFtSmpBbVJsWm1jQ2FBSnBhbXRzQWdKdGJtOXdBbkZ5QWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSnpBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNkSFVDQWdJQ0FnSUNkbmM1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1hnNU9UazVPVGs1T1RsNWVnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDZXprNWZEazVmUUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0orQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDZndJQ0FvQ0JnZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FvT0VBZ0lDQWdJQ0FnSUNBb1dHZFFJQ2h3SUNBb2dDQWdJQ0FnSUNpWW9DQWdJQ0FnSUNBZ0lDQWdJQ2k0d0NqWTRDajVDUmtwT1VsWllDbHdJQ21KbWFtd0lDQWdJQ0FnSUNBZ0k1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVG1jSFIwZEhSMGRIUjBkSFIwZEhSMGRIUjBkSFIwZEhSMGRIUjBkSFIwZEhSMENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDZEFnSUNBcDZmQWdRQ0JRWUhDQWtLQ3d3TkRnOFFFUklURkJVV0Z4Z1pHaHNjSFFJQ0hnSUNBZ0lDQWdJZklDRWlJd0lrSlNZbktDa0NLZ0lDQWdLZ29hS2pwS1dtTHFlb3FhcXJySzB6QWdJQ0FnSUNyZ0lDTlRZM0FqZzVPanM4UFQ2dk9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNVRBSUNBZ0lDc0U1UHNZV0dkUUlDaHdJQ0FvZ0NBZ0lDQWdJQ2lZb0NBZ0lDQWdJQ0FnSUNBZ0lDaTR5eXM0NENqNUNSa3BPVWxaWUNsd0lDbUptYW13SUNBZ0lDQWdJQ0FnSlZWWFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVQVFiejZ3QUFMS1ZWVlZWVVZBRkJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUJBRUh2K3NBQUM4UUJFRUVRVlZWVlZWVlhWVlZWVlZWVlZWVlZVVlZWQUFCQVZQWGRWVlZWVlZWVlZWVVZBQUFBQUFCVlZWVlYvRjFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRVUFGQUFVQkZCVlZWVlZWVlZWRlZGVlZWVlZWVlZWQUFBQUFBQUFRRlZWVlZWVlZWVlZWZFZYVlZWVlZWVlZWVlZWVlZVRkFBQlVWVlZWVlZWVlZWVlZWVlZWVlJVQUFGVlZVVlZWVlZWVkJSQUFBQUVCVUZWVlZWVlZWVlZWVlZVQlZWVlZWVlgvLy8vL2YxVlZWVkJWQUFCVlZWVlZWVlZWVlZWVkJRQkJ3UHpBQUF1WUJFQlZWVlZWVlZWVlZWVlZWVlZWUlZRQkFGUlJBUUJWVlFWVlZWVlZWVlZWVVZWVlZWVlZWVlZWVlZWVlZWVlZSQUZVVlZGVkZWVlZCVlZWVlZWVlZVVkJWVlZWVlZWVlZWVlZWVlZWVlZWVVFSVVVVRkZWVlZWVlZWVlZVRkZWVlVGVlZWVlZWVlZWVlZWVlZWVlZWVlFCRUZSUlZWVlZWUVZWVlZWVlZRVUFVVlZWVlZWVlZWVlZWVlZWVlZWVkJBRlVWVkZWQVZWVkJWVlZWVlZWVlZWRlZWVlZWVlZWVlZWVlZWVlZWVlZGVkZWVlVWVVZWVlZWVlZWVlZWVlZWVlJVVlZWVlZWVlZWVlZWVlZWVlZRUlVCUVJRVlVGVlZRVlZWVlZWVlZWVlVWVlZWVlZWVlZWVlZWVlZWVlZWRkVRRkJGQlZRVlZWQlZWVlZWVlZWVlZRVlZWVlZWVlZWVlZWVlZWVlZSVkVBVlJWUVZVVlZWVUZWVlZWVlZWVlZWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVVZCVVJWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVRQkFWVlVWQUVCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZSQUFCVVZWVUFRRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkJWVlZWVlZWVVJVVlZWVlZWVlZWVlZWVlZWVlZVQkFBQkFBQVJWQVFBQUFRQUFBQUFBQUFBQVZGVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRRUVBRUZCVlZWVlZWVlZVQVZVVlZWVkFWUlZWVVZCVlZGVlZWVlJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVnFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxQUVHQWdjRUFDNUFEVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUJWVlZWVlZWVlZWVlZWVlZWQlZSVlZWVlZWVlVGVlZWVlZWVlZWUVZWVlZWVlZWVlZCVlZWVlgvLy9mZi8vZGRmZDliVjExVVFBRkJWUlFFQUFGVlhVVlZWVlZWVlZWVlZWVlVWQUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFWVlZWVlZWVlZWVlVWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRQlZVVlVWVkFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVmNWRkZWVlZWVlZWVlZWVlZWVlZWVlZSUUJBUkFFQVZCVUFBQlJWVlZWVlZWVlZWVlZWVlZVQUFBQUFBQUFBUUZWVlZWVlZWVlZWVlZWVlZRQlZWVlZWVlZWVlZWVlZWVlVBQUZBRlZWVlZWVlZWVlZWVkZRQUFWVlZWVUZWVlZWVlZWVlVGVUJCUVZWVlZWVlZWVlZWVlZWVlZWVVZRRVZCVlZWVlZWVlZWVlZWVlZWVlZWUUFBQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFBQUFBQVFBVkZGVlZGQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRQkJvSVRCQUF1VENGVlZGUUJWVlZWVlZWVUZRRlZWVlZWVlZWVlZWVlZWVlFBQUFBQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVQUFBQUFBQUFBQUZSVlZWVlZWVlZWVlZYMVZWVlZhVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWL1ZmWFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlgxVlZWVlZWVjlWVlZWVlZWVlZWVlZWVlZYLy8vOVZWVlZWVlZWVlZWVlYxVlZWVlZYVlZWVlZYVlgxVlZWVlZYMVZYMVYxVlZkVlZWVlZkVlgxWFhWZFZWMzFWVlZWVlZWVlZWZFZWVlZWVlZWVlZYZlYzMVZWVlZWVlZWVlZWVlZWVlZWVlZmMVZWVlZWVlZWWFZWWFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVmRWWFZWVlZWVlZWVlZWVlZWVlZWMTFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlZCVlZWVlZWVlZWVlZWVlZWVlZWVlg5Ly8vLy8vLy8vLy8vLy8vL1gxWFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUFBQUFBQUFBQUFxcXFxcXFxcW1xcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXBWVlZXcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcWxwVlZWVlZWVldxcXFxcXFxcXFxcXFxcXFxcXFnb0FxcXFxYXFtcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFtcUJxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFsV3BxcXFxcXFxcXFxcXFxcW1xcXFxcXFxcXFxcXFxcXFxb3FxcXFxcXFxcXFxcWFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxbFZWbGFxcXFxcXFxcXFxcXFxcWFxcXFxcXFxcXFxcXFxcFZWYXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXBWVlZWVlZWVlZWVlZWVlZWVlZWVlZxcXFxVnFxcXFxcXFxcXFxcXFxcXFxcHFWVlZWVlZWVlZWVlZWVlZWVlY5VlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlFBQUFVRlZWVlZWVlZWVUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRVlZWVlJVVVZWVlZWVlZWVlFWVlVWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkJWVlZWVlZWVUFBQUFBVUZWRkZWVlZWVlZWVlZWVlZRVUFVRlZWVlZWVkZRQUFVRlZWVmFxcXFxcXFxcXBXUUZWVlZWVlZWVlZWVlZWVkZRVlFVRlZWVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZBVUJCUVZWVkZWVlZWRlZWVlZWVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZRUVVWQVZSVlZWVlZWVlZWVlZWVlZCVlJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlVVVlZWVlZXcXFxcXFxcXFxcXFwVlZWVUFBQUFBQUVBVkFFRy9qTUVBQytFTVZWVlZWVlZWVlZWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWQUFBQThLcXFXbFVBQUFBQXFxcXFxcXFxcXFwcXFxcXFxbXFxVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRmFtcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxbFpWVlZWVlZWVlZWVlZWVlZWVlZRVlVWVlZWVlZWVlZWVlZWVlZWVlZWVnFtcFZWUUFBVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUZRRlVCUVZVQVZWVlZWVlZWVlZWVlZVQVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWQlZWVlZWVlZWMVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlZGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUZBQUJVVlZWVlZWVlZWVlZWVlZVRlVGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVkFBQUFRRlZWVlZWVlZWVlZWVlVVVkZVVlVGVlZWVlZWVlZWVlZWVlZGVUJCVlVWVlZWVlZWVlZWVlZWVlZWVlZWVlZBVlZWVlZWVlZWVlVWQUFFQVZGVlZWVlZWVlZWVlZWVlZWVlZWRlZWVlZWQlZWVlZWVlZWVlZWVlZWVlVGQUVBRlZRRVVWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlVBUlZSVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlJVVkFFQlZWVlZWVlZCVlZWVlZWVlZWVlZWVlZWVlZGVVJVVlZWVlZSVlZWVlVGQUZRQVZGVlZWVlZWVlZWVlZWVlZWVlZWVlZVQUFBVkVWVlZWVlZWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVVBRVFSQkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlFWUVZSQlVWVlZWVlZWVlVGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZGUUJBRVZSVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlZFQUVGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVQkJSQUFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVkFBQkJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlJVRUVWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRQUZWVlJWVlZWVlZWVlZBUUJBVlZWVlZWVlZWVlZWRlFBRVFGVVZWVlVCUUFGVlZWVlZWVlZWVlZWVkFBQUFBRUJRVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFCQUFCQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUVVBQUFBQUFBVUFCRUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVQlFFVVFBQUJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRRVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlJWVVZWVkFWVlZWVlZWVlZWVlZWVlZWQlVCVlJGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVRlFBQUFGQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUJVVlZWVlZWVlZWVlZWVlZWVlZWVUFRRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVWVlZWVlZWVlZWVlZWVlZWVlZWVlZGVUJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWcWxSVlZWcFZWVldxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwVlZhcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxbHBWVlZWVlZWVlZWVlZWcXFwV1ZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZxcW1xYWFxcXFxcXFxcXFxYWxWVlZXVlZWVlZWVlZWVmFsbFZWVldxVlZXcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcWxWVlZWVlZWVlZWUVFCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUJCcTVuQkFBdDFVQUFBQUFBQVFGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUkZRQlFBQUFBQkFBUUJWVlZWVlZWVlZCVkJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVGVkZWVlZWVlZWVlZWVlZWVlZWVlZBRUd0bXNFQUN3SkFGUUJCdTVyQkFBdkZCbFJWVVZWVlZWUlZWVlZWRlFBQkFBQUFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVBUUFBQUFBQVVBQkFFUUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlZWVlZWVlZWVlZWVlZWVlZWVlZWQUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkFFQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUFRRlZWVlZWVlZWVlZWVlZWVlZWVlYxVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlhWVlZWVlZWVlZWVlZWVlZWVlZWVlZkZjMvZjFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVmZYLy8vLy8vLzl1VlZWVnFxcTZxcXFxcXVyNnY3OVZxcXBXVlY5VlZWV3FXbFZWVlZWVlZmLy8vLy8vLy8vL1YxVlYvZi9mLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8zLy8vLy8vOVZWVlgvLy8vLy8vLy8vLy8vZjlYL1ZWVlYvLy8vLzFkWC8vLy8vLy8vLy8vLy8vLy8vLy8vLy85LzkvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1gvLy8vLy8vLy8vLy8vLy8vLy8vL1gxVlYxWC8vLy8vLy8vOVZWVlZWZFZWVlZWVlZWWDFWVlZWWFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWWFYvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vVlZWVlZWVlZWVlZWVlZWVi8vLy8vLy8vLy8vLy8vLy8vLy8vLy85ZlZWZC8vVlgvVlZYVlYxWC8vMWRWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWWC8vLzlWVjFWVlZWVlZWZi8vLy8vLy8vLy8vLy8vZi8vLzMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlYvLy8vVi8vL1YxWC8vLy8vLy8vLy8vLy8vOS8vWDFYMS8vLy9WZi8vVjFYLy8xZFZxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcWxwVlZWVlZWVlZWVlZtV1ZXR3FwVm1xVlZWVlZWV1ZWVlZWVlZWVlZaVlZWUUJCanFIQkFBc0JBd0JCbktIQkFBdUpDVlZWVlZWVmxWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlFDV2FscGFhcW9GUUtaWmxXVlZWVlZWVlZWVlZRQUFBQUJWVmxWVnFWWlZWVlZWVlZWVlZWVldWVlZWVlZWVlZWVUFBQUFBQUFBQUFGUlZWVldWV1ZsVlZXVlZWV2xWVlZWVlZWVlZWVlZWVlpWV2xXcXFxcXBWcXFwYVZWVlZXVldxcXFwVlZWVlZaVlZWV2xWVlZWV2xaVlpWVlZXVlZWVlZWVlZWcHBhYWxsbFpaYW1XcXFwbVZhcFZXbGxWV2xabFZWVlZhcXFscFZwVlZWV2xxbHBWVlZsWlZWVlpWVlZWVlZXVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVmxWZlZWVlZWcFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVnFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXBWcXFxcXFxcXFxcXFxVlZWVnFxcXFxcVZhVlZXYXFscFZwYVZWV2xxbGxxVmFWVlZWcFZwVmxWVlZWWDFWYVZtbFZWOVZabFZWVlZWVlZWVlZabFgvLy85VlZWV2FtbXFhVlZWVjFWVlZWVlhWVlZXbFhWWDFWVlZWVmIxVnI2cTZxcXVxcXBwVnVxcjZycnF1VlYzMVZWVlZWVlZWVlZkVlZWVlZXVlZWVlhmVjMxVlZWVlZWVlZXbHFxcFZWVlZWVlZYVlYxVlZWVlZWVlZWVlZWVlZWVmV0V2xWVlZWVlZWVlZWVmFxcXFxcXFxcXBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFBQUFBd0txcVdsVUFBQUFBcXFxcXFxcXFxcXBxcXFxcXFtcXFWVlZWVlZWVlZWVlZWVlZWQlZSVlZWVlZWVlZWVlZWVlZWVlZWVldxYWxWVkFBQlVXYXFxYWxXcXFxcXFxcXFxV3FxcXFxcXFxcXFxcXFxcXFxcXFXbFdxcXFxcXFxcXF1djcvdjZxcXFxcFdWVlZWVlZWVlZWVlZWVlZWVmZYLy8vLy8vLzh2Ym1sNEwzTjBiM0psTHpJNGFIbDZabXd6TXpocmN6UmhiV2hoTjNad2NHNXNZbkV4Y3pGdWNXRjJMWEoxYzNRdFpHVm1ZWFZzZEMweExqZzFMakF2YkdsaUwzSjFjM1JzYVdJdmMzSmpMM0oxYzNRdmJHbGljbUZ5ZVM5aGJHeHZZeTl6Y21NdmNtRjNYM1psWXk1eWN5OW9iMjFsTDNKMWJtNWxjaTh1WTJGeVoyOHZjbVZuYVhOMGNua3ZjM0pqTDJsdVpHVjRMbU55WVhSbGN5NXBieTB4T1RRNVkyWTRZelppTldJMU5UZG1MM2RoYzIwdFltbHVaR2RsYmkwd0xqSXVNVEEyTDNOeVl5OWpiMjUyWlhKMEwzTnNhV05sY3k1eWN5OW9iMjFsTDNKMWJtNWxjaTh1WTJGeVoyOHZjbVZuYVhOMGNua3ZjM0pqTDJsdVpHVjRMbU55WVhSbGN5NXBieTB4T1RRNVkyWTRZelppTldJMU5UZG1MM2RoYzIwdFltbHVaR2RsYmkwd0xqSXVNVEEyTDNOeVl5OWxlSFJsY201eVpXWXVjbk1kVkJBQVp3QUFBSDhBQUFBUkFBQUFIVlFRQUdjQUFBQ01BQUFBRVFBQUFHNTFiR3dnY0c5cGJuUmxjaUJ3WVhOelpXUWdkRzhnY25WemRISmxZM1Z5YzJsMlpTQjFjMlVnYjJZZ1lXNGdiMkpxWldOMElHUmxkR1ZqZEdWa0lIZG9hV05vSUhkdmRXeGtJR3hsWVdRZ2RHOGdkVzV6WVdabElHRnNhV0Z6YVc1bklHbHVJSEoxYzNSS2MxWmhiSFZsS0NrQURsVVFBQWdBQUFBV1ZSQUFBUUJCcUtyQkFBc0JCQUJJQ1hCeWIyUjFZMlZ5Y3dFTWNISnZZMlZ6YzJWa0xXSjVBZ1ozWVd4eWRYTUdNQzR5TkM0MERIZGhjMjB0WW1sdVpHZGxiaE13TGpJdU1UQTJJQ2d4TVRnek1XWmlPRGtwXCIpO1xuXG5hc3luYyBmdW5jdGlvbiBpbml0KG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgX193YmdfaW5pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfb3JfcGF0aDogYXdhaXQgb3B0aW9ucy5tb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnk6IG9wdGlvbnMubWVtb3J5LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHM7XG4gICAgICAgICAgICAgICAgfVxuXG5jbGFzcyBDbG9jayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBzcGVlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMS4wO1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICB9XG4gIGdldFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3BlZWQgKiAocGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLnN0YXJ0VGltZSkgLyAxMDAwLjA7XG4gIH1cbiAgc2V0VGltZSh0aW1lKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRpbWUgLyB0aGlzLnNwZWVkICogMTAwMC4wO1xuICB9XG59XG5jbGFzcyBOdWxsQ2xvY2sge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIGdldFRpbWUoX3NwZWVkKSB7fVxuICBzZXRUaW1lKF90aW1lKSB7fVxufVxuXG4vLyBFZmZpY2llbnQgYXJyYXkgdHJhbnNmb3JtYXRpb25zIHdpdGhvdXQgaW50ZXJtZWRpYXRlIGFycmF5IG9iamVjdHMuXG4vLyBJbnNwaXJlZCBieSBFbGl4aXIncyBzdHJlYW1zIGFuZCBSdXN0J3MgaXRlcmF0b3IgYWRhcHRlcnMuXG5cbmNsYXNzIFN0cmVhbSB7XG4gIGNvbnN0cnVjdG9yKGlucHV0LCB4ZnMpIHtcbiAgICB0aGlzLmlucHV0ID0gdHlwZW9mIGlucHV0Lm5leHQgPT09IFwiZnVuY3Rpb25cIiA/IGlucHV0IDogaW5wdXRbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgIHRoaXMueGZzID0geGZzID8/IFtdO1xuICB9XG4gIG1hcChmKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKE1hcCQxKGYpKTtcbiAgfVxuICBmbGF0TWFwKGYpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oRmxhdE1hcChmKSk7XG4gIH1cbiAgZmlsdGVyKGYpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oRmlsdGVyKGYpKTtcbiAgfVxuICB0YWtlKG4pIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oVGFrZShuKSk7XG4gIH1cbiAgZHJvcChuKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKERyb3AobikpO1xuICB9XG4gIHRyYW5zZm9ybShmKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJlYW0odGhpcy5pbnB1dCwgdGhpcy54ZnMuY29uY2F0KFtmXSkpO1xuICB9XG4gIG11bHRpcGxleChvdGhlciwgY29tcGFyYXRvcikge1xuICAgIHJldHVybiBuZXcgU3RyZWFtKG5ldyBNdWx0aXBsZXhlcih0aGlzW1N5bWJvbC5pdGVyYXRvcl0oKSwgb3RoZXJbU3ltYm9sLml0ZXJhdG9yXSgpLCBjb21wYXJhdG9yKSk7XG4gIH1cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgdiA9IDA7XG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuICAgIGxldCBmbHVzaGVkID0gZmFsc2U7XG4gICAgY29uc3QgeGYgPSBjb21wb3NlKHRoaXMueGZzLCB2YWwgPT4gdmFsdWVzLnB1c2godmFsKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgaWYgKHYgPT09IHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICB2ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmlucHV0Lm5leHQoKTtcbiAgICAgICAgICBpZiAobmV4dC5kb25lKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeGYuc3RlcChuZXh0LnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDAgJiYgIWZsdXNoZWQpIHtcbiAgICAgICAgICB4Zi5mbHVzaCgpO1xuICAgICAgICAgIGZsdXNoZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZXNbdisrXVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuZnVuY3Rpb24gTWFwJDEoZikge1xuICByZXR1cm4gZW1pdCA9PiB7XG4gICAgcmV0dXJuIGlucHV0ID0+IHtcbiAgICAgIGVtaXQoZihpbnB1dCkpO1xuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBGbGF0TWFwKGYpIHtcbiAgcmV0dXJuIGVtaXQgPT4ge1xuICAgIHJldHVybiBpbnB1dCA9PiB7XG4gICAgICBmKGlucHV0KS5mb3JFYWNoKGVtaXQpO1xuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBGaWx0ZXIoZikge1xuICByZXR1cm4gZW1pdCA9PiB7XG4gICAgcmV0dXJuIGlucHV0ID0+IHtcbiAgICAgIGlmIChmKGlucHV0KSkge1xuICAgICAgICBlbWl0KGlucHV0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufVxuZnVuY3Rpb24gVGFrZShuKSB7XG4gIGxldCBjID0gMDtcbiAgcmV0dXJuIGVtaXQgPT4ge1xuICAgIHJldHVybiBpbnB1dCA9PiB7XG4gICAgICBpZiAoYyA8IG4pIHtcbiAgICAgICAgZW1pdChpbnB1dCk7XG4gICAgICB9XG4gICAgICBjICs9IDE7XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIERyb3Aobikge1xuICBsZXQgYyA9IDA7XG4gIHJldHVybiBlbWl0ID0+IHtcbiAgICByZXR1cm4gaW5wdXQgPT4ge1xuICAgICAgYyArPSAxO1xuICAgICAgaWYgKGMgPiBuKSB7XG4gICAgICAgIGVtaXQoaW5wdXQpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBjb21wb3NlKHhmcywgcHVzaCkge1xuICByZXR1cm4geGZzLnJldmVyc2UoKS5yZWR1Y2UoKG5leHQsIGN1cnIpID0+IHtcbiAgICBjb25zdCB4ZiA9IHRvWGYoY3VycihuZXh0LnN0ZXApKTtcbiAgICByZXR1cm4ge1xuICAgICAgc3RlcDogeGYuc3RlcCxcbiAgICAgIGZsdXNoOiAoKSA9PiB7XG4gICAgICAgIHhmLmZsdXNoKCk7XG4gICAgICAgIG5leHQuZmx1c2goKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LCB0b1hmKHB1c2gpKTtcbn1cbmZ1bmN0aW9uIHRvWGYoeGYpIHtcbiAgaWYgKHR5cGVvZiB4ZiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0ZXA6IHhmLFxuICAgICAgZmx1c2g6ICgpID0+IHt9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geGY7XG4gIH1cbn1cbmNsYXNzIE11bHRpcGxleGVyIHtcbiAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQsIGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB0aGlzLmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICB9XG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGxldCBsZWZ0SXRlbTtcbiAgICBsZXQgcmlnaHRJdGVtO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIGlmIChsZWZ0SXRlbSA9PT0gdW5kZWZpbmVkICYmIHRoaXMubGVmdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5sZWZ0Lm5leHQoKTtcbiAgICAgICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMubGVmdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVmdEl0ZW0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyaWdodEl0ZW0gPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJpZ2h0Lm5leHQoKTtcbiAgICAgICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMucmlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJpZ2h0SXRlbSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlZnRJdGVtID09PSB1bmRlZmluZWQgJiYgcmlnaHRJdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAobGVmdEl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmlnaHRJdGVtO1xuICAgICAgICAgIHJpZ2h0SXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHJpZ2h0SXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBsZWZ0SXRlbTtcbiAgICAgICAgICBsZWZ0SXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29tcGFyYXRvcihsZWZ0SXRlbSwgcmlnaHRJdGVtKSkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbGVmdEl0ZW07XG4gICAgICAgICAgbGVmdEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJpZ2h0SXRlbTtcbiAgICAgICAgICByaWdodEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVGhlbWUodGhlbWUpIHtcbiAgY29uc3QgZm9yZWdyb3VuZCA9IG5vcm1hbGl6ZUhleENvbG9yKHRoZW1lLmZvcmVncm91bmQpO1xuICBjb25zdCBiYWNrZ3JvdW5kID0gbm9ybWFsaXplSGV4Q29sb3IodGhlbWUuYmFja2dyb3VuZCk7XG4gIGNvbnN0IHBhbGV0dGVJbnB1dCA9IHRoZW1lLnBhbGV0dGU7XG4gIGlmIChwYWxldHRlSW5wdXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICBpZiAoIWZvcmVncm91bmQgfHwgIWJhY2tncm91bmQgfHwgcGFsZXR0ZUlucHV0Lmxlbmd0aCA8IDgpIHJldHVybjtcbiAgY29uc3QgcGFsZXR0ZSA9IFtdO1xuICBjb25zdCBsaW1pdCA9IE1hdGgubWluKHBhbGV0dGVJbnB1dC5sZW5ndGgsIDE2KTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW1pdDsgaSArPSAxKSB7XG4gICAgY29uc3QgY29sb3IgPSBub3JtYWxpemVIZXhDb2xvcihwYWxldHRlSW5wdXRbaV0pO1xuICAgIGlmICghY29sb3IpIHJldHVybjtcbiAgICBwYWxldHRlLnB1c2goY29sb3IpO1xuICB9XG4gIGZvciAobGV0IGkgPSBwYWxldHRlLmxlbmd0aDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICBwYWxldHRlLnB1c2gocGFsZXR0ZVtpIC0gOF0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgZm9yZWdyb3VuZCxcbiAgICBiYWNrZ3JvdW5kLFxuICAgIHBhbGV0dGVcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcGFyc2UkMihkYXRhKSB7XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZGF0YS50ZXh0KCk7XG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VKc29ubCh0ZXh0KTtcbiAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICBldmVudHNcbiAgICAgIH0gPSByZXN1bHQ7XG4gICAgICBpZiAoaGVhZGVyLnZlcnNpb24gPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlQXNjaWljYXN0VjIoaGVhZGVyLCBldmVudHMpO1xuICAgICAgfSBlbHNlIGlmIChoZWFkZXIudmVyc2lvbiA9PT0gMykge1xuICAgICAgICByZXR1cm4gcGFyc2VBc2NpaWNhc3RWMyhoZWFkZXIsIGV2ZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGFzY2lpY2FzdCB2JHtoZWFkZXIudmVyc2lvbn0gZm9ybWF0IG5vdCBzdXBwb3J0ZWRgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaGVhZGVyID0gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgIGlmIChoZWFkZXIudmVyc2lvbiA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcGFyc2VBc2NpaWNhc3RWMShoZWFkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBkYXRhLnZlcnNpb24gPT09IDEpIHtcbiAgICByZXR1cm4gcGFyc2VBc2NpaWNhc3RWMShkYXRhKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgY29uc3QgaGVhZGVyID0gZGF0YVswXTtcbiAgICBpZiAoaGVhZGVyLnZlcnNpb24gPT09IDIpIHtcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGRhdGEuc2xpY2UoMSwgZGF0YS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHBhcnNlQXNjaWljYXN0VjIoaGVhZGVyLCBldmVudHMpO1xuICAgIH0gZWxzZSBpZiAoaGVhZGVyLnZlcnNpb24gPT09IDMpIHtcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGRhdGEuc2xpY2UoMSwgZGF0YS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHBhcnNlQXNjaWljYXN0VjMoaGVhZGVyLCBldmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGFzY2lpY2FzdCB2JHtoZWFkZXIudmVyc2lvbn0gZm9ybWF0IG5vdCBzdXBwb3J0ZWRgKTtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBkYXRhXCIpO1xufVxuZnVuY3Rpb24gcGFyc2VKc29ubChqc29ubCkge1xuICBjb25zdCBsaW5lcyA9IGpzb25sLnNwbGl0KFwiXFxuXCIpO1xuICBsZXQgaGVhZGVyO1xuICB0cnkge1xuICAgIGhlYWRlciA9IEpTT04ucGFyc2UobGluZXNbMF0pO1xuICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZXZlbnRzID0gbmV3IFN0cmVhbShsaW5lcykuZHJvcCgxKS5maWx0ZXIobCA9PiBsWzBdID09PSBcIltcIikubWFwKEpTT04ucGFyc2UpO1xuICByZXR1cm4ge1xuICAgIGhlYWRlcixcbiAgICBldmVudHNcbiAgfTtcbn1cbmZ1bmN0aW9uIHBhcnNlQXNjaWljYXN0VjEoZGF0YSkge1xuICBsZXQgdGltZSA9IDA7XG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBTdHJlYW0oZGF0YS5zdGRvdXQpLm1hcChlID0+IHtcbiAgICB0aW1lICs9IGVbMF07XG4gICAgcmV0dXJuIFt0aW1lLCBcIm9cIiwgZVsxXV07XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIGNvbHM6IGRhdGEud2lkdGgsXG4gICAgcm93czogZGF0YS5oZWlnaHQsXG4gICAgZXZlbnRzXG4gIH07XG59XG5mdW5jdGlvbiBwYXJzZUFzY2lpY2FzdFYyKGhlYWRlciwgZXZlbnRzKSB7XG4gIHJldHVybiB7XG4gICAgY29sczogaGVhZGVyLndpZHRoLFxuICAgIHJvd3M6IGhlYWRlci5oZWlnaHQsXG4gICAgdGhlbWU6IHBhcnNlVGhlbWUkMShoZWFkZXIudGhlbWUpLFxuICAgIGV2ZW50cyxcbiAgICBpZGxlVGltZUxpbWl0OiBoZWFkZXIuaWRsZV90aW1lX2xpbWl0XG4gIH07XG59XG5mdW5jdGlvbiBwYXJzZUFzY2lpY2FzdFYzKGhlYWRlciwgZXZlbnRzKSB7XG4gIGlmICghKGV2ZW50cyBpbnN0YW5jZW9mIFN0cmVhbSkpIHtcbiAgICBldmVudHMgPSBuZXcgU3RyZWFtKGV2ZW50cyk7XG4gIH1cbiAgbGV0IHRpbWUgPSAwO1xuICBldmVudHMgPSBldmVudHMubWFwKGUgPT4ge1xuICAgIHRpbWUgKz0gZVswXTtcbiAgICByZXR1cm4gW3RpbWUsIGVbMV0sIGVbMl1dO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBjb2xzOiBoZWFkZXIudGVybS5jb2xzLFxuICAgIHJvd3M6IGhlYWRlci50ZXJtLnJvd3MsXG4gICAgdGhlbWU6IHBhcnNlVGhlbWUkMShoZWFkZXIudGVybT8udGhlbWUpLFxuICAgIGV2ZW50cyxcbiAgICBpZGxlVGltZUxpbWl0OiBoZWFkZXIuaWRsZV90aW1lX2xpbWl0XG4gIH07XG59XG5mdW5jdGlvbiBwYXJzZVRoZW1lJDEodGhlbWUpIHtcbiAgY29uc3QgcGFsZXR0ZSA9IHR5cGVvZiB0aGVtZT8ucGFsZXR0ZSA9PT0gXCJzdHJpbmdcIiA/IHRoZW1lLnBhbGV0dGUuc3BsaXQoXCI6XCIpIDogdW5kZWZpbmVkO1xuICByZXR1cm4gbm9ybWFsaXplVGhlbWUoe1xuICAgIGZvcmVncm91bmQ6IHRoZW1lPy5mZyxcbiAgICBiYWNrZ3JvdW5kOiB0aGVtZT8uYmcsXG4gICAgcGFsZXR0ZVxuICB9KTtcbn1cbmZ1bmN0aW9uIHVucGFyc2VBc2NpaWNhc3RWMihyZWNvcmRpbmcpIHtcbiAgY29uc3QgaGVhZGVyID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgIHZlcnNpb246IDIsXG4gICAgd2lkdGg6IHJlY29yZGluZy5jb2xzLFxuICAgIGhlaWdodDogcmVjb3JkaW5nLnJvd3NcbiAgfSk7XG4gIGNvbnN0IGV2ZW50cyA9IHJlY29yZGluZy5ldmVudHMubWFwKEpTT04uc3RyaW5naWZ5KS5qb2luKFwiXFxuXCIpO1xuICByZXR1cm4gYCR7aGVhZGVyfVxcbiR7ZXZlbnRzfVxcbmA7XG59XG5cbmZ1bmN0aW9uIHJlY29yZGluZyhzcmMsIF9yZWYsIF9yZWYyKSB7XG4gIGxldCB7XG4gICAgZmVlZCxcbiAgICByZXNpemUsXG4gICAgb25JbnB1dCxcbiAgICBvbk1hcmtlcixcbiAgICBzZXRTdGF0ZSxcbiAgICBsb2dnZXJcbiAgfSA9IF9yZWY7XG4gIGxldCB7XG4gICAgc3BlZWQsXG4gICAgaWRsZVRpbWVMaW1pdCxcbiAgICBzdGFydEF0LFxuICAgIGxvb3AsXG4gICAgcG9zdGVyVGltZSxcbiAgICBtYXJrZXJzOiBtYXJrZXJzXyxcbiAgICBwYXVzZU9uTWFya2VycyxcbiAgICBjb2xzOiBpbml0aWFsQ29scyxcbiAgICByb3dzOiBpbml0aWFsUm93cyxcbiAgICBhdWRpb1VybFxuICB9ID0gX3JlZjI7XG4gIGxldCBjb2xzO1xuICBsZXQgcm93cztcbiAgbGV0IGV2ZW50cztcbiAgbGV0IG1hcmtlcnM7XG4gIGxldCBkdXJhdGlvbjtcbiAgbGV0IGVmZmVjdGl2ZVN0YXJ0QXQ7XG4gIGxldCBldmVudFRpbWVvdXRJZDtcbiAgbGV0IG5leHRFdmVudEluZGV4ID0gMDtcbiAgbGV0IGxhc3RFdmVudFRpbWUgPSAwO1xuICBsZXQgc3RhcnRUaW1lO1xuICBsZXQgcGF1c2VFbGFwc2VkVGltZTtcbiAgbGV0IHBsYXlDb3VudCA9IDA7XG4gIGxldCB3YWl0aW5nRm9yQXVkaW8gPSBmYWxzZTtcbiAgbGV0IHdhaXRpbmdUaW1lb3V0O1xuICBsZXQgc2hvdWxkUmVzdW1lT25BdWRpb1BsYXlpbmcgPSBmYWxzZTtcbiAgbGV0IG5vdyA9ICgpID0+IHBlcmZvcm1hbmNlLm5vdygpICogc3BlZWQ7XG4gIGxldCBhdWRpb0N0eDtcbiAgbGV0IGF1ZGlvRWxlbWVudDtcbiAgbGV0IGF1ZGlvU2Vla2FibGUgPSBmYWxzZTtcbiAgYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTdGF0ZShcImxvYWRpbmdcIik7XG4gICAgfSwgMzAwMCk7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBtZXRhZGF0YSA9IGxvYWRSZWNvcmRpbmcoc3JjLCBsb2dnZXIsIHtcbiAgICAgICAgaWRsZVRpbWVMaW1pdCxcbiAgICAgICAgc3RhcnRBdCxcbiAgICAgICAgbWFya2Vyc19cbiAgICAgIH0pO1xuICAgICAgY29uc3QgaGFzQXVkaW8gPSBhd2FpdCBsb2FkQXVkaW8oYXVkaW9VcmwpO1xuICAgICAgbWV0YWRhdGEgPSBhd2FpdCBtZXRhZGF0YTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm1ldGFkYXRhLFxuICAgICAgICBoYXNBdWRpb1xuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBhc3luYyBmdW5jdGlvbiBsb2FkUmVjb3JkaW5nKHNyYywgbG9nZ2VyLCBvcHRzKSB7XG4gICAgY29uc3Qge1xuICAgICAgcGFyc2VyLFxuICAgICAgbWluRnJhbWVUaW1lLFxuICAgICAgaW5wdXRPZmZzZXQsXG4gICAgICBkdW1wRmlsZW5hbWUsXG4gICAgICBlbmNvZGluZyA9IFwidXRmLThcIlxuICAgIH0gPSBzcmM7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGRvRmV0Y2goc3JjKTtcbiAgICBjb25zdCByZWNvcmRpbmcgPSBwcmVwYXJlKGF3YWl0IHBhcnNlcihkYXRhLCB7XG4gICAgICBlbmNvZGluZ1xuICAgIH0pLCBsb2dnZXIsIHtcbiAgICAgIC4uLm9wdHMsXG4gICAgICBtaW5GcmFtZVRpbWUsXG4gICAgICBpbnB1dE9mZnNldFxuICAgIH0pO1xuICAgICh7XG4gICAgICBjb2xzLFxuICAgICAgcm93cyxcbiAgICAgIGV2ZW50cyxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgZWZmZWN0aXZlU3RhcnRBdFxuICAgIH0gPSByZWNvcmRpbmcpO1xuICAgIGluaXRpYWxDb2xzID0gaW5pdGlhbENvbHMgPz8gY29scztcbiAgICBpbml0aWFsUm93cyA9IGluaXRpYWxSb3dzID8/IHJvd3M7XG4gICAgaWYgKGV2ZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInJlY29yZGluZyBpcyBtaXNzaW5nIGV2ZW50c1wiKTtcbiAgICB9XG4gICAgaWYgKGR1bXBGaWxlbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkdW1wKHJlY29yZGluZywgZHVtcEZpbGVuYW1lKTtcbiAgICB9XG4gICAgY29uc3QgcG9zdGVyID0gcG9zdGVyVGltZSAhPT0gdW5kZWZpbmVkID8gZ2V0UG9zdGVyKHBvc3RlclRpbWUpIDogdW5kZWZpbmVkO1xuICAgIG1hcmtlcnMgPSBldmVudHMuZmlsdGVyKGUgPT4gZVsxXSA9PT0gXCJtXCIpLm1hcChlID0+IFtlWzBdLCBlWzJdLmxhYmVsXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHMsXG4gICAgICByb3dzLFxuICAgICAgZHVyYXRpb24sXG4gICAgICB0aGVtZTogcmVjb3JkaW5nLnRoZW1lLFxuICAgICAgcG9zdGVyLFxuICAgICAgbWFya2Vyc1xuICAgIH07XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gbG9hZEF1ZGlvKGF1ZGlvVXJsKSB7XG4gICAgaWYgKCFhdWRpb1VybCkgcmV0dXJuIGZhbHNlO1xuICAgIGF1ZGlvRWxlbWVudCA9IGF3YWl0IGNyZWF0ZUF1ZGlvRWxlbWVudChhdWRpb1VybCk7XG4gICAgYXVkaW9TZWVrYWJsZSA9ICFOdW1iZXIuaXNOYU4oYXVkaW9FbGVtZW50LmR1cmF0aW9uKSAmJiBhdWRpb0VsZW1lbnQuZHVyYXRpb24gIT09IEluZmluaXR5ICYmIGF1ZGlvRWxlbWVudC5zZWVrYWJsZS5sZW5ndGggPiAwICYmIGF1ZGlvRWxlbWVudC5zZWVrYWJsZS5lbmQoYXVkaW9FbGVtZW50LnNlZWthYmxlLmxlbmd0aCAtIDEpID09PSBhdWRpb0VsZW1lbnQuZHVyYXRpb247XG4gICAgaWYgKGF1ZGlvU2Vla2FibGUpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicGxheWluZ1wiLCBvbkF1ZGlvUGxheWluZyk7XG4gICAgICBhdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIndhaXRpbmdcIiwgb25BdWRpb1dhaXRpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIud2FybihgYXVkaW8gaXMgbm90IHNlZWthYmxlIC0geW91IG11c3QgZW5hYmxlIHJhbmdlIHJlcXVlc3Qgc3VwcG9ydCBvbiB0aGUgc2VydmVyIHByb3ZpZGluZyAke2F1ZGlvRWxlbWVudC5zcmN9IGZvciBhdWRpbyBzZWVraW5nIHRvIHdvcmtgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaChfcmVmMykge1xuICAgIGxldCB7XG4gICAgICB1cmwsXG4gICAgICBkYXRhLFxuICAgICAgZmV0Y2hPcHRzID0ge31cbiAgICB9ID0gX3JlZjM7XG4gICAgaWYgKHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBhd2FpdCBkb0ZldGNoT25lKHVybCwgZmV0Y2hPcHRzKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodXJsKSkge1xuICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHVybC5tYXAodXJsID0+IGRvRmV0Y2hPbmUodXJsLCBmZXRjaE9wdHMpKSk7XG4gICAgfSBlbHNlIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhKCk7XG4gICAgICB9XG4gICAgICBpZiAoIShkYXRhIGluc3RhbmNlb2YgUHJvbWlzZSkpIHtcbiAgICAgICAgZGF0YSA9IFByb21pc2UucmVzb2x2ZShkYXRhKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgZGF0YTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmFpbGVkIGZldGNoaW5nIHJlY29yZGluZyBmaWxlOiB1cmwvZGF0YSBtaXNzaW5nIGluIHNyY1wiKTtcbiAgICB9XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaE9uZSh1cmwsIGZldGNoT3B0cykge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBmZXRjaE9wdHMpO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIGZldGNoaW5nIHJlY29yZGluZyBmcm9tICR7dXJsfTogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG4gIGZ1bmN0aW9uIHNjaGVkdWxlTmV4dEV2ZW50KCkge1xuICAgIGNvbnN0IG5leHRFdmVudCA9IGV2ZW50c1tuZXh0RXZlbnRJbmRleF07XG4gICAgaWYgKG5leHRFdmVudCkge1xuICAgICAgZXZlbnRUaW1lb3V0SWQgPSBzY2hlZHVsZUF0KHJ1bk5leHRFdmVudCwgbmV4dEV2ZW50WzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25FbmQoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2NoZWR1bGVBdChmLCB0YXJnZXRUaW1lKSB7XG4gICAgbGV0IHRpbWVvdXQgPSAodGFyZ2V0VGltZSAqIDEwMDAgLSAobm93KCkgLSBzdGFydFRpbWUpKSAvIHNwZWVkO1xuICAgIGlmICh0aW1lb3V0IDwgMCkge1xuICAgICAgdGltZW91dCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBzZXRUaW1lb3V0KGYsIHRpbWVvdXQpO1xuICB9XG4gIGZ1bmN0aW9uIHJ1bk5leHRFdmVudCgpIHtcbiAgICBsZXQgZXZlbnQgPSBldmVudHNbbmV4dEV2ZW50SW5kZXhdO1xuICAgIGxldCBlbGFwc2VkV2FsbFRpbWU7XG4gICAgZG8ge1xuICAgICAgbGFzdEV2ZW50VGltZSA9IGV2ZW50WzBdO1xuICAgICAgbmV4dEV2ZW50SW5kZXgrKztcbiAgICAgIGNvbnN0IHN0b3AgPSBleGVjdXRlRXZlbnQoZXZlbnQpO1xuICAgICAgaWYgKHN0b3ApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZXZlbnQgPSBldmVudHNbbmV4dEV2ZW50SW5kZXhdO1xuICAgICAgZWxhcHNlZFdhbGxUaW1lID0gbm93KCkgLSBzdGFydFRpbWU7XG4gICAgfSB3aGlsZSAoZXZlbnQgJiYgZWxhcHNlZFdhbGxUaW1lID4gZXZlbnRbMF0gKiAxMDAwKTtcbiAgICBzY2hlZHVsZU5leHRFdmVudCgpO1xuICB9XG4gIGZ1bmN0aW9uIGNhbmNlbE5leHRFdmVudCgpIHtcbiAgICBjbGVhclRpbWVvdXQoZXZlbnRUaW1lb3V0SWQpO1xuICAgIGV2ZW50VGltZW91dElkID0gbnVsbDtcbiAgfVxuICBmdW5jdGlvbiBleGVjdXRlRXZlbnQoZXZlbnQpIHtcbiAgICBjb25zdCBbdGltZSwgdHlwZSwgZGF0YV0gPSBldmVudDtcbiAgICBpZiAodHlwZSA9PT0gXCJvXCIpIHtcbiAgICAgIGZlZWQoZGF0YSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcImlcIikge1xuICAgICAgb25JbnB1dChkYXRhKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiclwiKSB7XG4gICAgICBjb25zdCBbY29scywgcm93c10gPSBkYXRhLnNwbGl0KFwieFwiKTtcbiAgICAgIHJlc2l6ZShjb2xzLCByb3dzKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwibVwiKSB7XG4gICAgICBvbk1hcmtlcihkYXRhKTtcbiAgICAgIGlmIChwYXVzZU9uTWFya2Vycykge1xuICAgICAgICBwYXVzZSgpO1xuICAgICAgICBwYXVzZUVsYXBzZWRUaW1lID0gdGltZSAqIDEwMDA7XG4gICAgICAgIHNldFN0YXRlKFwiaWRsZVwiLCB7XG4gICAgICAgICAgcmVhc29uOiBcInBhdXNlZFwiXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIG9uRW5kKCkge1xuICAgIGNhbmNlbE5leHRFdmVudCgpO1xuICAgIHBsYXlDb3VudCsrO1xuICAgIGlmIChsb29wID09PSB0cnVlIHx8IHR5cGVvZiBsb29wID09PSBcIm51bWJlclwiICYmIHBsYXlDb3VudCA8IGxvb3ApIHtcbiAgICAgIG5leHRFdmVudEluZGV4ID0gMDtcbiAgICAgIHN0YXJ0VGltZSA9IG5vdygpO1xuICAgICAgZmVlZChcIlxceDFiY1wiKTsgLy8gcmVzZXQgdGVybWluYWxcbiAgICAgIHJlc2l6ZVRlcm1pbmFsVG9Jbml0aWFsU2l6ZSgpO1xuICAgICAgc2NoZWR1bGVOZXh0RXZlbnQoKTtcbiAgICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGF1c2VFbGFwc2VkVGltZSA9IGR1cmF0aW9uICogMTAwMDtcbiAgICAgIHNldFN0YXRlKFwiZW5kZWRcIik7XG4gICAgICBpZiAoYXVkaW9FbGVtZW50KSB7XG4gICAgICAgIGF1ZGlvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhc3luYyBmdW5jdGlvbiBwbGF5KCkge1xuICAgIGlmIChldmVudFRpbWVvdXRJZCkgdGhyb3cgbmV3IEVycm9yKFwiYWxyZWFkeSBwbGF5aW5nXCIpO1xuICAgIGlmIChldmVudHNbbmV4dEV2ZW50SW5kZXhdID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihcImFscmVhZHkgZW5kZWRcIik7XG4gICAgaWYgKGVmZmVjdGl2ZVN0YXJ0QXQgIT09IG51bGwpIHtcbiAgICAgIHNlZWsoZWZmZWN0aXZlU3RhcnRBdCk7XG4gICAgfVxuICAgIGF3YWl0IHJlc3VtZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgIHNob3VsZFJlc3VtZU9uQXVkaW9QbGF5aW5nID0gZmFsc2U7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCkge1xuICAgICAgYXVkaW9FbGVtZW50LnBhdXNlKCk7XG4gICAgfVxuICAgIGlmICghZXZlbnRUaW1lb3V0SWQpIHJldHVybiB0cnVlO1xuICAgIGNhbmNlbE5leHRFdmVudCgpO1xuICAgIHBhdXNlRWxhcHNlZFRpbWUgPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBhc3luYyBmdW5jdGlvbiByZXN1bWUoKSB7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCAmJiAhYXVkaW9DdHgpIHNldHVwQXVkaW9DdHgoKTtcbiAgICBzdGFydFRpbWUgPSBub3coKSAtIHBhdXNlRWxhcHNlZFRpbWU7XG4gICAgcGF1c2VFbGFwc2VkVGltZSA9IG51bGw7XG4gICAgc2NoZWR1bGVOZXh0RXZlbnQoKTtcbiAgICBpZiAoYXVkaW9FbGVtZW50KSB7XG4gICAgICBhd2FpdCBhdWRpb0VsZW1lbnQucGxheSgpO1xuICAgIH1cbiAgfVxuICBhc3luYyBmdW5jdGlvbiBzZWVrKHdoZXJlKSB7XG4gICAgaWYgKHdhaXRpbmdGb3JBdWRpbykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpc1BsYXlpbmcgPSAhIWV2ZW50VGltZW91dElkO1xuICAgIHBhdXNlKCk7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCkge1xuICAgICAgYXVkaW9FbGVtZW50LnBhdXNlKCk7XG4gICAgfVxuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gKHBhdXNlRWxhcHNlZFRpbWUgPz8gMCkgLyAxMDAwO1xuICAgIGlmICh0eXBlb2Ygd2hlcmUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmICh3aGVyZSA9PT0gXCI8PFwiKSB7XG4gICAgICAgIHdoZXJlID0gY3VycmVudFRpbWUgLSA1O1xuICAgICAgfSBlbHNlIGlmICh3aGVyZSA9PT0gXCI+PlwiKSB7XG4gICAgICAgIHdoZXJlID0gY3VycmVudFRpbWUgKyA1O1xuICAgICAgfSBlbHNlIGlmICh3aGVyZSA9PT0gXCI8PDxcIikge1xuICAgICAgICB3aGVyZSA9IGN1cnJlbnRUaW1lIC0gMC4xICogZHVyYXRpb247XG4gICAgICB9IGVsc2UgaWYgKHdoZXJlID09PSBcIj4+PlwiKSB7XG4gICAgICAgIHdoZXJlID0gY3VycmVudFRpbWUgKyAwLjEgKiBkdXJhdGlvbjtcbiAgICAgIH0gZWxzZSBpZiAod2hlcmVbd2hlcmUubGVuZ3RoIC0gMV0gPT09IFwiJVwiKSB7XG4gICAgICAgIHdoZXJlID0gcGFyc2VGbG9hdCh3aGVyZS5zdWJzdHJpbmcoMCwgd2hlcmUubGVuZ3RoIC0gMSkpIC8gMTAwICogZHVyYXRpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2hlcmUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGlmICh3aGVyZS5tYXJrZXIgPT09IFwicHJldlwiKSB7XG4gICAgICAgIHdoZXJlID0gZmluZE1hcmtlclRpbWVCZWZvcmUoY3VycmVudFRpbWUpID8/IDA7XG4gICAgICAgIGlmIChpc1BsYXlpbmcgJiYgY3VycmVudFRpbWUgLSB3aGVyZSA8IDEpIHtcbiAgICAgICAgICB3aGVyZSA9IGZpbmRNYXJrZXJUaW1lQmVmb3JlKHdoZXJlKSA/PyAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHdoZXJlLm1hcmtlciA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgd2hlcmUgPSBmaW5kTWFya2VyVGltZUFmdGVyKGN1cnJlbnRUaW1lKSA/PyBkdXJhdGlvbjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdoZXJlLm1hcmtlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBjb25zdCBtYXJrZXIgPSBtYXJrZXJzW3doZXJlLm1hcmtlcl07XG4gICAgICAgIGlmIChtYXJrZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBtYXJrZXIgaW5kZXg6ICR7d2hlcmUubWFya2VyfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdoZXJlID0gbWFya2VyWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldFRpbWUgPSBNYXRoLm1pbihNYXRoLm1heCh3aGVyZSwgMCksIGR1cmF0aW9uKTtcbiAgICBpZiAodGFyZ2V0VGltZSAqIDEwMDAgPT09IHBhdXNlRWxhcHNlZFRpbWUpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodGFyZ2V0VGltZSA8IGxhc3RFdmVudFRpbWUpIHtcbiAgICAgIGZlZWQoXCJcXHgxYmNcIik7IC8vIHJlc2V0IHRlcm1pbmFsXG4gICAgICByZXNpemVUZXJtaW5hbFRvSW5pdGlhbFNpemUoKTtcbiAgICAgIG5leHRFdmVudEluZGV4ID0gMDtcbiAgICAgIGxhc3RFdmVudFRpbWUgPSAwO1xuICAgIH1cbiAgICBsZXQgZXZlbnQgPSBldmVudHNbbmV4dEV2ZW50SW5kZXhdO1xuICAgIHdoaWxlIChldmVudCAmJiBldmVudFswXSA8PSB0YXJnZXRUaW1lKSB7XG4gICAgICBpZiAoZXZlbnRbMV0gPT09IFwib1wiIHx8IGV2ZW50WzFdID09PSBcInJcIikge1xuICAgICAgICBleGVjdXRlRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgICAgbGFzdEV2ZW50VGltZSA9IGV2ZW50WzBdO1xuICAgICAgZXZlbnQgPSBldmVudHNbKytuZXh0RXZlbnRJbmRleF07XG4gICAgfVxuICAgIHBhdXNlRWxhcHNlZFRpbWUgPSB0YXJnZXRUaW1lICogMTAwMDtcbiAgICBlZmZlY3RpdmVTdGFydEF0ID0gbnVsbDtcbiAgICBpZiAoYXVkaW9FbGVtZW50ICYmIGF1ZGlvU2Vla2FibGUpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRhcmdldFRpbWUgLyBzcGVlZDtcbiAgICB9XG4gICAgaWYgKGlzUGxheWluZykge1xuICAgICAgYXdhaXQgcmVzdW1lKCk7XG4gICAgfSBlbHNlIGlmIChldmVudHNbbmV4dEV2ZW50SW5kZXhdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9uRW5kKCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGZpbmRNYXJrZXJUaW1lQmVmb3JlKHRpbWUpIHtcbiAgICBpZiAobWFya2Vycy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgbWFya2VyID0gbWFya2Vyc1tpXTtcbiAgICBsZXQgbGFzdE1hcmtlclRpbWVCZWZvcmU7XG4gICAgd2hpbGUgKG1hcmtlciAmJiBtYXJrZXJbMF0gPCB0aW1lKSB7XG4gICAgICBsYXN0TWFya2VyVGltZUJlZm9yZSA9IG1hcmtlclswXTtcbiAgICAgIG1hcmtlciA9IG1hcmtlcnNbKytpXTtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RNYXJrZXJUaW1lQmVmb3JlO1xuICB9XG4gIGZ1bmN0aW9uIGZpbmRNYXJrZXJUaW1lQWZ0ZXIodGltZSkge1xuICAgIGlmIChtYXJrZXJzLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgbGV0IGkgPSBtYXJrZXJzLmxlbmd0aCAtIDE7XG4gICAgbGV0IG1hcmtlciA9IG1hcmtlcnNbaV07XG4gICAgbGV0IGZpcnN0TWFya2VyVGltZUFmdGVyO1xuICAgIHdoaWxlIChtYXJrZXIgJiYgbWFya2VyWzBdID4gdGltZSkge1xuICAgICAgZmlyc3RNYXJrZXJUaW1lQWZ0ZXIgPSBtYXJrZXJbMF07XG4gICAgICBtYXJrZXIgPSBtYXJrZXJzWy0taV07XG4gICAgfVxuICAgIHJldHVybiBmaXJzdE1hcmtlclRpbWVBZnRlcjtcbiAgfVxuICBmdW5jdGlvbiBzdGVwKG4pIHtcbiAgICBpZiAobiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuID0gMTtcbiAgICB9XG4gICAgbGV0IG5leHRFdmVudDtcbiAgICBsZXQgdGFyZ2V0SW5kZXg7XG4gICAgaWYgKG4gPiAwKSB7XG4gICAgICBsZXQgaW5kZXggPSBuZXh0RXZlbnRJbmRleDtcbiAgICAgIG5leHRFdmVudCA9IGV2ZW50c1tpbmRleF07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICB3aGlsZSAobmV4dEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgbmV4dEV2ZW50WzFdICE9PSBcIm9cIikge1xuICAgICAgICAgIG5leHRFdmVudCA9IGV2ZW50c1srK2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgbmV4dEV2ZW50WzFdID09PSBcIm9cIikge1xuICAgICAgICAgIHRhcmdldEluZGV4ID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGluZGV4ID0gTWF0aC5tYXgobmV4dEV2ZW50SW5kZXggLSAyLCAwKTtcbiAgICAgIG5leHRFdmVudCA9IGV2ZW50c1tpbmRleF07XG4gICAgICBmb3IgKGxldCBpID0gbjsgaSA8IDA7IGkrKykge1xuICAgICAgICB3aGlsZSAobmV4dEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgbmV4dEV2ZW50WzFdICE9PSBcIm9cIikge1xuICAgICAgICAgIG5leHRFdmVudCA9IGV2ZW50c1stLWluZGV4XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgbmV4dEV2ZW50WzFdID09PSBcIm9cIikge1xuICAgICAgICAgIHRhcmdldEluZGV4ID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0YXJnZXRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZlZWQoXCJcXHgxYmNcIik7IC8vIHJlc2V0IHRlcm1pbmFsXG4gICAgICAgIHJlc2l6ZVRlcm1pbmFsVG9Jbml0aWFsU2l6ZSgpO1xuICAgICAgICBuZXh0RXZlbnRJbmRleCA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0YXJnZXRJbmRleCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgd2hpbGUgKG5leHRFdmVudEluZGV4IDw9IHRhcmdldEluZGV4KSB7XG4gICAgICBuZXh0RXZlbnQgPSBldmVudHNbbmV4dEV2ZW50SW5kZXgrK107XG4gICAgICBpZiAobmV4dEV2ZW50WzFdID09PSBcIm9cIiB8fCBuZXh0RXZlbnRbMV0gPT09IFwiclwiKSB7XG4gICAgICAgIGV4ZWN1dGVFdmVudChuZXh0RXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0RXZlbnRUaW1lID0gbmV4dEV2ZW50WzBdO1xuICAgIHBhdXNlRWxhcHNlZFRpbWUgPSBsYXN0RXZlbnRUaW1lICogMTAwMDtcbiAgICBlZmZlY3RpdmVTdGFydEF0ID0gbnVsbDtcbiAgICBpZiAoYXVkaW9FbGVtZW50ICYmIGF1ZGlvU2Vla2FibGUpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IGxhc3RFdmVudFRpbWUgLyBzcGVlZDtcbiAgICB9XG4gICAgaWYgKGV2ZW50c1t0YXJnZXRJbmRleCArIDFdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9uRW5kKCk7XG4gICAgfVxuICB9XG4gIGFzeW5jIGZ1bmN0aW9uIHJlc3RhcnQoKSB7XG4gICAgaWYgKGV2ZW50VGltZW91dElkKSB0aHJvdyBuZXcgRXJyb3IoXCJzdGlsbCBwbGF5aW5nXCIpO1xuICAgIGlmIChldmVudHNbbmV4dEV2ZW50SW5kZXhdICE9PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcihcIm5vdCBlbmRlZFwiKTtcbiAgICBzZWVrKDApO1xuICAgIGF3YWl0IHJlc3VtZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFBvc3Rlcih0aW1lKSB7XG4gICAgcmV0dXJuIGV2ZW50cy5maWx0ZXIoZSA9PiBlWzBdIDwgdGltZSAmJiBlWzFdID09PSBcIm9cIikubWFwKGUgPT4gZVsyXSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XG4gICAgaWYgKGV2ZW50VGltZW91dElkKSB7XG4gICAgICByZXR1cm4gKG5vdygpIC0gc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAocGF1c2VFbGFwc2VkVGltZSA/PyAwKSAvIDEwMDA7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHJlc2l6ZVRlcm1pbmFsVG9Jbml0aWFsU2l6ZSgpIHtcbiAgICByZXNpemUoaW5pdGlhbENvbHMsIGluaXRpYWxSb3dzKTtcbiAgfVxuICBmdW5jdGlvbiBzZXR1cEF1ZGlvQ3R4KCkge1xuICAgIGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCh7XG4gICAgICBsYXRlbmN5SGludDogXCJpbnRlcmFjdGl2ZVwiXG4gICAgfSk7XG4gICAgY29uc3Qgc3JjID0gYXVkaW9DdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvRWxlbWVudCk7XG4gICAgc3JjLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgIG5vdyA9IGF1ZGlvTm93O1xuICB9XG4gIGZ1bmN0aW9uIGF1ZGlvTm93KCkge1xuICAgIGlmICghYXVkaW9DdHgpIHRocm93IG5ldyBFcnJvcihcImF1ZGlvIGNvbnRleHQgbm90IHN0YXJ0ZWQgLSBjYW4ndCB0ZWxsIHRpbWUhXCIpO1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbnRleHRUaW1lLFxuICAgICAgcGVyZm9ybWFuY2VUaW1lXG4gICAgfSA9IGF1ZGlvQ3R4LmdldE91dHB1dFRpbWVzdGFtcCgpO1xuXG4gICAgLy8gVGhlIGNoZWNrIGJlbG93IGlzIG5lZWRlZCBmb3IgQ2hyb21lLFxuICAgIC8vIHdoaWNoIHJldHVybnMgMCBmb3IgZmlyc3Qgc2V2ZXJhbCBkb3plbiBtaWxsaXMsXG4gICAgLy8gY29tcGxldGVseSBydWluaW5nIHRoZSB0aW1pbmcgKHRoZSBjbG9jayBqdW1wcyBiYWNrd2FyZHMgb25jZSksXG4gICAgLy8gdGhlcmVmb3JlIHdlIGluaXRpYWxseSBpZ25vcmUgcGVyZm9ybWFuY2VUaW1lIGluIG91ciBjYWxjdWxhdGlvbi5cblxuICAgIHJldHVybiBwZXJmb3JtYW5jZVRpbWUgPT09IDAgPyBjb250ZXh0VGltZSAqIDEwMDAgOiBjb250ZXh0VGltZSAqIDEwMDAgKyAocGVyZm9ybWFuY2Uubm93KCkgLSBwZXJmb3JtYW5jZVRpbWUpO1xuICB9XG4gIGZ1bmN0aW9uIG9uQXVkaW9XYWl0aW5nKCkge1xuICAgIGxvZ2dlci5kZWJ1ZyhcImF1ZGlvIGJ1ZmZlcmluZ1wiKTtcbiAgICB3YWl0aW5nRm9yQXVkaW8gPSB0cnVlO1xuICAgIHNob3VsZFJlc3VtZU9uQXVkaW9QbGF5aW5nID0gISFldmVudFRpbWVvdXRJZDtcbiAgICB3YWl0aW5nVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gc2V0U3RhdGUoXCJsb2FkaW5nXCIpLCAxMDAwKTtcbiAgICBpZiAoIWV2ZW50VGltZW91dElkKSByZXR1cm4gdHJ1ZTtcbiAgICBsb2dnZXIuZGVidWcoXCJwYXVzaW5nIHNlc3Npb24gcGxheWJhY2tcIik7XG4gICAgY2FuY2VsTmV4dEV2ZW50KCk7XG4gICAgcGF1c2VFbGFwc2VkVGltZSA9IG5vdygpIC0gc3RhcnRUaW1lO1xuICB9XG4gIGZ1bmN0aW9uIG9uQXVkaW9QbGF5aW5nKCkge1xuICAgIGxvZ2dlci5kZWJ1ZyhcImF1ZGlvIHJlc3VtZWRcIik7XG4gICAgY2xlYXJUaW1lb3V0KHdhaXRpbmdUaW1lb3V0KTtcbiAgICBzZXRTdGF0ZShcInBsYXlpbmdcIik7XG4gICAgaWYgKCF3YWl0aW5nRm9yQXVkaW8pIHJldHVybjtcbiAgICB3YWl0aW5nRm9yQXVkaW8gPSBmYWxzZTtcbiAgICBpZiAoc2hvdWxkUmVzdW1lT25BdWRpb1BsYXlpbmcpIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcInJlc3VtaW5nIHNlc3Npb24gcGxheWJhY2tcIik7XG4gICAgICBzdGFydFRpbWUgPSBub3coKSAtIHBhdXNlRWxhcHNlZFRpbWU7XG4gICAgICBwYXVzZUVsYXBzZWRUaW1lID0gbnVsbDtcbiAgICAgIHNjaGVkdWxlTmV4dEV2ZW50KCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG11dGUoKSB7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCkge1xuICAgICAgYXVkaW9FbGVtZW50Lm11dGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1bm11dGUoKSB7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCkge1xuICAgICAgYXVkaW9FbGVtZW50Lm11dGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBpbml0LFxuICAgIHBsYXksXG4gICAgcGF1c2UsXG4gICAgc2VlayxcbiAgICBzdGVwLFxuICAgIHJlc3RhcnQsXG4gICAgc3RvcDogcGF1c2UsXG4gICAgbXV0ZSxcbiAgICB1bm11dGUsXG4gICAgZ2V0Q3VycmVudFRpbWVcbiAgfTtcbn1cbmZ1bmN0aW9uIGJhdGNoZXIobG9nZ2VyKSB7XG4gIGxldCBtaW5GcmFtZVRpbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDEuMCAvIDYwO1xuICBsZXQgcHJldkV2ZW50O1xuICByZXR1cm4gZW1pdCA9PiB7XG4gICAgbGV0IGljID0gMDtcbiAgICBsZXQgb2MgPSAwO1xuICAgIHJldHVybiB7XG4gICAgICBzdGVwOiBldmVudCA9PiB7XG4gICAgICAgIGljKys7XG4gICAgICAgIGlmIChwcmV2RXZlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHByZXZFdmVudCA9IGV2ZW50O1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnRbMV0gPT09IFwib1wiICYmIHByZXZFdmVudFsxXSA9PT0gXCJvXCIgJiYgZXZlbnRbMF0gLSBwcmV2RXZlbnRbMF0gPCBtaW5GcmFtZVRpbWUpIHtcbiAgICAgICAgICBwcmV2RXZlbnRbMl0gKz0gZXZlbnRbMl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW1pdChwcmV2RXZlbnQpO1xuICAgICAgICAgIHByZXZFdmVudCA9IGV2ZW50O1xuICAgICAgICAgIG9jKys7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmbHVzaDogKCkgPT4ge1xuICAgICAgICBpZiAocHJldkV2ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbWl0KHByZXZFdmVudCk7XG4gICAgICAgICAgb2MrKztcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuZGVidWcoYGJhdGNoZWQgJHtpY30gZnJhbWVzIHRvICR7b2N9IGZyYW1lc2ApO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBwcmVwYXJlKHJlY29yZGluZywgbG9nZ2VyLCBfcmVmNCkge1xuICBsZXQge1xuICAgIHN0YXJ0QXQgPSAwLFxuICAgIGlkbGVUaW1lTGltaXQsXG4gICAgbWluRnJhbWVUaW1lLFxuICAgIGlucHV0T2Zmc2V0LFxuICAgIG1hcmtlcnNfXG4gIH0gPSBfcmVmNDtcbiAgbGV0IHtcbiAgICBldmVudHNcbiAgfSA9IHJlY29yZGluZztcbiAgaWYgKCEoZXZlbnRzIGluc3RhbmNlb2YgU3RyZWFtKSkge1xuICAgIGV2ZW50cyA9IG5ldyBTdHJlYW0oZXZlbnRzKTtcbiAgfVxuICBpZGxlVGltZUxpbWl0ID0gaWRsZVRpbWVMaW1pdCA/PyByZWNvcmRpbmcuaWRsZVRpbWVMaW1pdCA/PyBJbmZpbml0eTtcbiAgY29uc3QgbGltaXRlck91dHB1dCA9IHtcbiAgICBvZmZzZXQ6IDBcbiAgfTtcbiAgZXZlbnRzID0gZXZlbnRzLnRyYW5zZm9ybShiYXRjaGVyKGxvZ2dlciwgbWluRnJhbWVUaW1lKSkubWFwKHRpbWVMaW1pdGVyKGlkbGVUaW1lTGltaXQsIHN0YXJ0QXQsIGxpbWl0ZXJPdXRwdXQpKS5tYXAobWFya2VyV3JhcHBlcigpKTtcbiAgaWYgKG1hcmtlcnNfICE9PSB1bmRlZmluZWQpIHtcbiAgICBtYXJrZXJzXyA9IG5ldyBTdHJlYW0obWFya2Vyc18pLm1hcChub3JtYWxpemVNYXJrZXIpO1xuICAgIGV2ZW50cyA9IGV2ZW50cy5maWx0ZXIoZSA9PiBlWzFdICE9PSBcIm1cIikubXVsdGlwbGV4KG1hcmtlcnNfLCAoYSwgYikgPT4gYVswXSA8IGJbMF0pLm1hcChtYXJrZXJXcmFwcGVyKCkpO1xuICB9XG4gIGV2ZW50cyA9IGV2ZW50cy50b0FycmF5KCk7XG4gIGlmIChpbnB1dE9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gZXZlbnRzLm1hcChlID0+IGVbMV0gPT09IFwiaVwiID8gW2VbMF0gKyBpbnB1dE9mZnNldCwgZVsxXSwgZVsyXV0gOiBlKTtcbiAgICBldmVudHMuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICB9XG4gIGNvbnN0IGR1cmF0aW9uID0gZXZlbnRzW2V2ZW50cy5sZW5ndGggLSAxXVswXTtcbiAgY29uc3QgZWZmZWN0aXZlU3RhcnRBdCA9IHN0YXJ0QXQgLSBsaW1pdGVyT3V0cHV0Lm9mZnNldDtcbiAgcmV0dXJuIHtcbiAgICAuLi5yZWNvcmRpbmcsXG4gICAgZXZlbnRzLFxuICAgIGR1cmF0aW9uLFxuICAgIGVmZmVjdGl2ZVN0YXJ0QXRcbiAgfTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZU1hcmtlcihtKSB7XG4gIHJldHVybiB0eXBlb2YgbSA9PT0gXCJudW1iZXJcIiA/IFttLCBcIm1cIiwgXCJcIl0gOiBbbVswXSwgXCJtXCIsIG1bMV1dO1xufVxuZnVuY3Rpb24gdGltZUxpbWl0ZXIoaWRsZVRpbWVMaW1pdCwgc3RhcnRBdCwgb3V0cHV0KSB7XG4gIGxldCBwcmV2VCA9IDA7XG4gIGxldCBzaGlmdCA9IDA7XG4gIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnN0IGRlbGF5ID0gZVswXSAtIHByZXZUO1xuICAgIGNvbnN0IGRlbHRhID0gZGVsYXkgLSBpZGxlVGltZUxpbWl0O1xuICAgIHByZXZUID0gZVswXTtcbiAgICBpZiAoZGVsdGEgPiAwKSB7XG4gICAgICBzaGlmdCArPSBkZWx0YTtcbiAgICAgIGlmIChlWzBdIDwgc3RhcnRBdCkge1xuICAgICAgICBvdXRwdXQub2Zmc2V0ICs9IGRlbHRhO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW2VbMF0gLSBzaGlmdCwgZVsxXSwgZVsyXV07XG4gIH07XG59XG5mdW5jdGlvbiBtYXJrZXJXcmFwcGVyKCkge1xuICBsZXQgaSA9IDA7XG4gIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlWzFdID09PSBcIm1cIikge1xuICAgICAgcmV0dXJuIFtlWzBdLCBlWzFdLCB7XG4gICAgICAgIGluZGV4OiBpKyssXG4gICAgICAgIHRpbWU6IGVbMF0sXG4gICAgICAgIGxhYmVsOiBlWzJdXG4gICAgICB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGU7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gZHVtcChyZWNvcmRpbmcsIGZpbGVuYW1lKSB7XG4gIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgY29uc3QgZXZlbnRzID0gcmVjb3JkaW5nLmV2ZW50cy5tYXAoZSA9PiBlWzFdID09PSBcIm1cIiA/IFtlWzBdLCBlWzFdLCBlWzJdLmxhYmVsXSA6IGUpO1xuICBjb25zdCBhc2NpaWNhc3QgPSB1bnBhcnNlQXNjaWljYXN0VjIoe1xuICAgIC4uLnJlY29yZGluZyxcbiAgICBldmVudHNcbiAgfSk7XG4gIGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2FzY2lpY2FzdF0sIHtcbiAgICB0eXBlOiBcInRleHQvcGxhaW5cIlxuICB9KSk7XG4gIGxpbmsuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgbGluay5jbGljaygpO1xufVxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXVkaW9FbGVtZW50KHNyYykge1xuICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICBhdWRpby5wcmVsb2FkID0gXCJtZXRhZGF0YVwiO1xuICBhdWRpby5sb29wID0gZmFsc2U7XG4gIGF1ZGlvLmNyb3NzT3JpZ2luID0gXCJhbm9ueW1vdXNcIjtcbiAgbGV0IHJlc29sdmU7XG4gIGNvbnN0IGNhblBsYXkgPSBuZXcgUHJvbWlzZShyZXNvbHZlXyA9PiB7XG4gICAgcmVzb2x2ZSA9IHJlc29sdmVfO1xuICB9KTtcbiAgZnVuY3Rpb24gb25DYW5QbGF5KCkge1xuICAgIHJlc29sdmUoKTtcbiAgICBhdWRpby5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2FucGxheVwiLCBvbkNhblBsYXkpO1xuICB9XG4gIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5wbGF5XCIsIG9uQ2FuUGxheSk7XG4gIGF1ZGlvLnNyYyA9IHNyYztcbiAgYXVkaW8ubG9hZCgpO1xuICBhd2FpdCBjYW5QbGF5O1xuICByZXR1cm4gYXVkaW87XG59XG5cbmZ1bmN0aW9uIGNsb2NrKF9yZWYsIF9yZWYyLCBfcmVmMykge1xuICBsZXQge1xuICAgIGhvdXJDb2xvciA9IDMsXG4gICAgbWludXRlQ29sb3IgPSA0LFxuICAgIHNlcGFyYXRvckNvbG9yID0gOVxuICB9ID0gX3JlZjtcbiAgbGV0IHtcbiAgICBmZWVkXG4gIH0gPSBfcmVmMjtcbiAgbGV0IHtcbiAgICBjb2xzID0gNSxcbiAgICByb3dzID0gMVxuICB9ID0gX3JlZjM7XG4gIGNvbnN0IG1pZGRsZVJvdyA9IE1hdGguZmxvb3Iocm93cyAvIDIpO1xuICBjb25zdCBsZWZ0UGFkID0gTWF0aC5mbG9vcihjb2xzIC8gMikgLSAyO1xuICBjb25zdCBzZXR1cEN1cnNvciA9IGBcXHgxYls/MjVsXFx4MWJbMW1cXHgxYlske21pZGRsZVJvd31CYDtcbiAgbGV0IGludGVydmFsSWQ7XG4gIGNvbnN0IGdldEN1cnJlbnRUaW1lID0gKCkgPT4ge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGggPSBkLmdldEhvdXJzKCk7XG4gICAgY29uc3QgbSA9IGQuZ2V0TWludXRlcygpO1xuICAgIGNvbnN0IHNlcXMgPSBbXTtcbiAgICBzZXFzLnB1c2goXCJcXHJcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWZ0UGFkOyBpKyspIHtcbiAgICAgIHNlcXMucHVzaChcIiBcIik7XG4gICAgfVxuICAgIHNlcXMucHVzaChgXFx4MWJbMyR7aG91ckNvbG9yfW1gKTtcbiAgICBpZiAoaCA8IDEwKSB7XG4gICAgICBzZXFzLnB1c2goXCIwXCIpO1xuICAgIH1cbiAgICBzZXFzLnB1c2goYCR7aH1gKTtcbiAgICBzZXFzLnB1c2goYFxceDFiWzMke3NlcGFyYXRvckNvbG9yfTs1bTpcXHgxYlsyNW1gKTtcbiAgICBzZXFzLnB1c2goYFxceDFiWzMke21pbnV0ZUNvbG9yfW1gKTtcbiAgICBpZiAobSA8IDEwKSB7XG4gICAgICBzZXFzLnB1c2goXCIwXCIpO1xuICAgIH1cbiAgICBzZXFzLnB1c2goYCR7bX1gKTtcbiAgICByZXR1cm4gc2VxcztcbiAgfTtcbiAgY29uc3QgdXBkYXRlVGltZSA9ICgpID0+IHtcbiAgICBnZXRDdXJyZW50VGltZSgpLmZvckVhY2goZmVlZCk7XG4gIH07XG4gIHJldHVybiB7XG4gICAgaW5pdDogKCkgPT4ge1xuICAgICAgY29uc3QgZHVyYXRpb24gPSAyNCAqIDYwO1xuICAgICAgY29uc3QgcG9zdGVyID0gW3NldHVwQ3Vyc29yXS5jb25jYXQoZ2V0Q3VycmVudFRpbWUoKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2xzLFxuICAgICAgICByb3dzLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgcG9zdGVyXG4gICAgICB9O1xuICAgIH0sXG4gICAgcGxheTogKCkgPT4ge1xuICAgICAgZmVlZChzZXR1cEN1cnNvcik7XG4gICAgICB1cGRhdGVUaW1lKCk7XG4gICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodXBkYXRlVGltZSwgMTAwMCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHN0b3A6ICgpID0+IHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XG4gICAgfSxcbiAgICBnZXRDdXJyZW50VGltZTogKCkgPT4ge1xuICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gICAgICByZXR1cm4gZC5nZXRIb3VycygpICogNjAgKyBkLmdldE1pbnV0ZXMoKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJhbmRvbShzcmMsIF9yZWYsIF9yZWYyKSB7XG4gIGxldCB7XG4gICAgZmVlZFxuICB9ID0gX3JlZjtcbiAgbGV0IHtcbiAgICBzcGVlZFxuICB9ID0gX3JlZjI7XG4gIGNvbnN0IGJhc2UgPSBcIiBcIi5jaGFyQ29kZUF0KDApO1xuICBjb25zdCByYW5nZSA9IFwiflwiLmNoYXJDb2RlQXQoMCkgLSBiYXNlO1xuICBsZXQgdGltZW91dElkO1xuICBjb25zdCBzY2hlZHVsZSA9ICgpID0+IHtcbiAgICBjb25zdCB0ID0gTWF0aC5wb3coNSwgTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQocHJpbnQsIHQgLyBzcGVlZCk7XG4gIH07XG4gIGNvbnN0IHByaW50ID0gKCkgPT4ge1xuICAgIHNjaGVkdWxlKCk7XG4gICAgY29uc3QgY2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYmFzZSArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKSk7XG4gICAgZmVlZChjaGFyKTtcbiAgfTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzY2hlZHVsZSgpO1xuICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKHRpbWVvdXRJZCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJlbmNobWFyayhfcmVmLCBfcmVmMikge1xuICBsZXQge1xuICAgIHVybCxcbiAgICBpdGVyYXRpb25zID0gMTBcbiAgfSA9IF9yZWY7XG4gIGxldCB7XG4gICAgZmVlZCxcbiAgICBzZXRTdGF0ZVxuICB9ID0gX3JlZjI7XG4gIGxldCBkYXRhO1xuICBsZXQgYnl0ZUNvdW50ID0gMDtcbiAgcmV0dXJuIHtcbiAgICBhc3luYyBpbml0KCkge1xuICAgICAgY29uc3QgcmVjb3JkaW5nID0gYXdhaXQgcGFyc2UkMihhd2FpdCBmZXRjaCh1cmwpKTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29scyxcbiAgICAgICAgcm93cyxcbiAgICAgICAgZXZlbnRzXG4gICAgICB9ID0gcmVjb3JkaW5nO1xuICAgICAgZGF0YSA9IEFycmF5LmZyb20oZXZlbnRzKS5maWx0ZXIoX3JlZjMgPT4ge1xuICAgICAgICBsZXQgW190aW1lLCB0eXBlLCBfdGV4dF0gPSBfcmVmMztcbiAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwib1wiO1xuICAgICAgfSkubWFwKF9yZWY0ID0+IHtcbiAgICAgICAgbGV0IFt0aW1lLCBfdHlwZSwgdGV4dF0gPSBfcmVmNDtcbiAgICAgICAgcmV0dXJuIFt0aW1lLCB0ZXh0XTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV1bMF07XG4gICAgICBmb3IgKGNvbnN0IFtfLCB0ZXh0XSBvZiBkYXRhKSB7XG4gICAgICAgIGJ5dGVDb3VudCArPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2xzLFxuICAgICAgICByb3dzLFxuICAgICAgICBkdXJhdGlvblxuICAgICAgfTtcbiAgICB9LFxuICAgIHBsYXkoKSB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrKSB7XG4gICAgICAgIGZvciAoY29uc3QgW18sIHRleHRdIG9mIGRhdGEpIHtcbiAgICAgICAgICBmZWVkKHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGZlZWQoXCJcXHgxYmNcIik7IC8vIHJlc2V0IHRlcm1pbmFsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gKGVuZFRpbWUgLSBzdGFydFRpbWUpIC8gMTAwMDtcbiAgICAgIGNvbnN0IHRocm91Z2hwdXQgPSBieXRlQ291bnQgKiBpdGVyYXRpb25zIC8gZHVyYXRpb247XG4gICAgICBjb25zdCB0aHJvdWdocHV0TWJzID0gYnl0ZUNvdW50IC8gKDEwMjQgKiAxMDI0KSAqIGl0ZXJhdGlvbnMgLyBkdXJhdGlvbjtcbiAgICAgIGNvbnNvbGUuaW5mbyhcImJlbmNobWFyazogcmVzdWx0XCIsIHtcbiAgICAgICAgYnl0ZUNvdW50LFxuICAgICAgICBpdGVyYXRpb25zLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgdGhyb3VnaHB1dCxcbiAgICAgICAgdGhyb3VnaHB1dE1ic1xuICAgICAgfSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0U3RhdGUoXCJzdG9wcGVkXCIsIHtcbiAgICAgICAgICByZWFzb246IFwiZW5kZWRcIlxuICAgICAgICB9KTtcbiAgICAgIH0sIDApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xufVxuXG5jbGFzcyBRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLm9uUHVzaCA9IHVuZGVmaW5lZDtcbiAgfVxuICBwdXNoKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgaWYgKHRoaXMub25QdXNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25QdXNoKHRoaXMucG9wQWxsKCkpO1xuICAgICAgdGhpcy5vblB1c2ggPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIHBvcEFsbCgpIHtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICB0aGlzLml0ZW1zID0gW107XG4gICAgICByZXR1cm4gaXRlbXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRoaXogPSB0aGlzO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICB0aGl6Lm9uUHVzaCA9IHJlc29sdmU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QnVmZmVyKGJ1ZmZlclRpbWUsIGZlZWQsIHJlc2l6ZSwgb25JbnB1dCwgb25NYXJrZXIsIHNldFRpbWUsIGJhc2VTdHJlYW1UaW1lLCBtaW5GcmFtZVRpbWUsIGxvZ2dlcikge1xuICBjb25zdCBleGVjdXRlID0gZXhlY3V0ZUV2ZW50KGZlZWQsIHJlc2l6ZSwgb25JbnB1dCwgb25NYXJrZXIpO1xuICBpZiAoYnVmZmVyVGltZSA9PT0gMCkge1xuICAgIGxvZ2dlci5kZWJ1ZyhcInVzaW5nIG5vIGJ1ZmZlclwiKTtcbiAgICByZXR1cm4gbnVsbEJ1ZmZlcihleGVjdXRlKTtcbiAgfSBlbHNlIHtcbiAgICBidWZmZXJUaW1lID0gYnVmZmVyVGltZSA/PyB7fTtcbiAgICBsZXQgZ2V0QnVmZmVyVGltZTtcbiAgICBpZiAodHlwZW9mIGJ1ZmZlclRpbWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhgdXNpbmcgZml4ZWQgdGltZSBidWZmZXIgKCR7YnVmZmVyVGltZX0gbXMpYCk7XG4gICAgICBnZXRCdWZmZXJUaW1lID0gX2xhdGVuY3kgPT4gYnVmZmVyVGltZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBidWZmZXJUaW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcInVzaW5nIGN1c3RvbSBkeW5hbWljIGJ1ZmZlclwiKTtcbiAgICAgIGdldEJ1ZmZlclRpbWUgPSBidWZmZXJUaW1lKHtcbiAgICAgICAgbG9nZ2VyXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLmRlYnVnKFwidXNpbmcgYWRhcHRpdmUgYnVmZmVyXCIsIGJ1ZmZlclRpbWUpO1xuICAgICAgZ2V0QnVmZmVyVGltZSA9IGFkYXB0aXZlQnVmZmVyVGltZVByb3ZpZGVyKHtcbiAgICAgICAgbG9nZ2VyXG4gICAgICB9LCBidWZmZXJUaW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmZlcihnZXRCdWZmZXJUaW1lLCBleGVjdXRlLCBzZXRUaW1lLCBsb2dnZXIsIGJhc2VTdHJlYW1UaW1lID8/IDAuMCwgbWluRnJhbWVUaW1lKTtcbiAgfVxufVxuZnVuY3Rpb24gbnVsbEJ1ZmZlcihleGVjdXRlKSB7XG4gIHJldHVybiB7XG4gICAgcHVzaEV2ZW50KGV2ZW50KSB7XG4gICAgICBleGVjdXRlKGV2ZW50WzFdLCBldmVudFsyXSk7XG4gICAgfSxcbiAgICBwdXNoVGV4dCh0ZXh0KSB7XG4gICAgICBleGVjdXRlKFwib1wiLCB0ZXh0KTtcbiAgICB9LFxuICAgIHN0b3AoKSB7fVxuICB9O1xufVxuZnVuY3Rpb24gZXhlY3V0ZUV2ZW50KGZlZWQsIHJlc2l6ZSwgb25JbnB1dCwgb25NYXJrZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChjb2RlLCBkYXRhKSB7XG4gICAgaWYgKGNvZGUgPT09IFwib1wiKSB7XG4gICAgICBmZWVkKGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gXCJpXCIpIHtcbiAgICAgIG9uSW5wdXQoZGF0YSk7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSBcInJcIikge1xuICAgICAgcmVzaXplKGRhdGEuY29scywgZGF0YS5yb3dzKTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IFwibVwiKSB7XG4gICAgICBvbk1hcmtlcihkYXRhKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBidWZmZXIoZ2V0QnVmZmVyVGltZSwgZXhlY3V0ZSwgc2V0VGltZSwgbG9nZ2VyLCBiYXNlU3RyZWFtVGltZSkge1xuICBsZXQgbWluRnJhbWVUaW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiAxLjAgLyA2MDtcbiAgbGV0IGVwb2NoID0gcGVyZm9ybWFuY2Uubm93KCkgLSBiYXNlU3RyZWFtVGltZSAqIDEwMDA7XG4gIGxldCBidWZmZXJUaW1lID0gZ2V0QnVmZmVyVGltZSgwKTtcbiAgY29uc3QgcXVldWUgPSBuZXcgUXVldWUoKTtcbiAgbWluRnJhbWVUaW1lICo9IDEwMDA7XG4gIGxldCBwcmV2RWxhcHNlZFN0cmVhbVRpbWUgPSAtbWluRnJhbWVUaW1lO1xuICBsZXQgc3RvcCA9IGZhbHNlO1xuICBmdW5jdGlvbiBlbGFwc2VkV2FsbFRpbWUoKSB7XG4gICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpIC0gZXBvY2g7XG4gIH1cbiAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgd2hpbGUgKCFzdG9wKSB7XG4gICAgICBjb25zdCBldmVudHMgPSBhd2FpdCBxdWV1ZS5wb3BBbGwoKTtcbiAgICAgIGlmIChzdG9wKSByZXR1cm47XG4gICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgICBjb25zdCBlbGFwc2VkU3RyZWFtVGltZSA9IGV2ZW50WzBdICogMTAwMCArIGJ1ZmZlclRpbWU7XG4gICAgICAgIGlmIChlbGFwc2VkU3RyZWFtVGltZSAtIHByZXZFbGFwc2VkU3RyZWFtVGltZSA8IG1pbkZyYW1lVGltZSkge1xuICAgICAgICAgIGV4ZWN1dGUoZXZlbnRbMV0sIGV2ZW50WzJdKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWxheSA9IGVsYXBzZWRTdHJlYW1UaW1lIC0gZWxhcHNlZFdhbGxUaW1lKCk7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICBhd2FpdCBzbGVlcChkZWxheSk7XG4gICAgICAgICAgaWYgKHN0b3ApIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lKGV2ZW50WzBdKTtcbiAgICAgICAgZXhlY3V0ZShldmVudFsxXSwgZXZlbnRbMl0pO1xuICAgICAgICBwcmV2RWxhcHNlZFN0cmVhbVRpbWUgPSBlbGFwc2VkU3RyZWFtVGltZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIDApO1xuICByZXR1cm4ge1xuICAgIHB1c2hFdmVudChldmVudCkge1xuICAgICAgbGV0IGxhdGVuY3kgPSBlbGFwc2VkV2FsbFRpbWUoKSAtIGV2ZW50WzBdICogMTAwMDtcbiAgICAgIGlmIChsYXRlbmN5IDwgMCkge1xuICAgICAgICBsb2dnZXIuZGVidWcoYGNvcnJlY3RpbmcgZXBvY2ggYnkgJHtsYXRlbmN5fSBtc2ApO1xuICAgICAgICBlcG9jaCArPSBsYXRlbmN5O1xuICAgICAgICBsYXRlbmN5ID0gMDtcbiAgICAgIH1cbiAgICAgIGJ1ZmZlclRpbWUgPSBnZXRCdWZmZXJUaW1lKGxhdGVuY3kpO1xuICAgICAgcXVldWUucHVzaChldmVudCk7XG4gICAgfSxcbiAgICBwdXNoVGV4dCh0ZXh0KSB7XG4gICAgICBxdWV1ZS5wdXNoKFtlbGFwc2VkV2FsbFRpbWUoKSAvIDEwMDAsIFwib1wiLCB0ZXh0XSk7XG4gICAgfSxcbiAgICBzdG9wKCkge1xuICAgICAgc3RvcCA9IHRydWU7XG4gICAgICBxdWV1ZS5wdXNoKHVuZGVmaW5lZCk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gc2xlZXAodCkge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCB0KTtcbiAgfSk7XG59XG5mdW5jdGlvbiBhZGFwdGl2ZUJ1ZmZlclRpbWVQcm92aWRlcigpIHtcbiAgbGV0IHtcbiAgICBsb2dnZXJcbiAgfSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gIGxldCB7XG4gICAgbWluQnVmZmVyVGltZSA9IDUwLFxuICAgIGJ1ZmZlckxldmVsU3RlcCA9IDEwMCxcbiAgICBtYXhCdWZmZXJMZXZlbCA9IDUwLFxuICAgIHRyYW5zaXRpb25EdXJhdGlvbiA9IDUwMCxcbiAgICBwZWFrSGFsZkxpZmVVcCA9IDEwMCxcbiAgICBwZWFrSGFsZkxpZmVEb3duID0gMTAwMDAsXG4gICAgZmxvb3JIYWxmTGlmZVVwID0gNTAwMCxcbiAgICBmbG9vckhhbGZMaWZlRG93biA9IDEwMCxcbiAgICBpZGVhbEhhbGZMaWZlVXAgPSAxMDAwLFxuICAgIGlkZWFsSGFsZkxpZmVEb3duID0gNTAwMCxcbiAgICBzYWZldHlNdWx0aXBsaWVyID0gMS4yLFxuICAgIG1pbkltcHJvdmVtZW50RHVyYXRpb24gPSAzMDAwXG4gIH0gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICBmdW5jdGlvbiBsZXZlbFRvTXMobGV2ZWwpIHtcbiAgICByZXR1cm4gbGV2ZWwgPT09IDAgPyBtaW5CdWZmZXJUaW1lIDogYnVmZmVyTGV2ZWxTdGVwICogbGV2ZWw7XG4gIH1cbiAgbGV0IGJ1ZmZlckxldmVsID0gMTtcbiAgbGV0IGJ1ZmZlclRpbWUgPSBsZXZlbFRvTXMoYnVmZmVyTGV2ZWwpO1xuICBsZXQgbGFzdFVwZGF0ZVRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgbGV0IHNtb290aGVkUGVha0xhdGVuY3kgPSBudWxsO1xuICBsZXQgc21vb3RoZWRGbG9vckxhdGVuY3kgPSBudWxsO1xuICBsZXQgc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUgPSBudWxsO1xuICBsZXQgc3RhYmxlU2luY2UgPSBudWxsO1xuICBsZXQgdGFyZ2V0QnVmZmVyVGltZSA9IG51bGw7XG4gIGxldCB0cmFuc2l0aW9uUmF0ZSA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbiAobGF0ZW5jeSkge1xuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGNvbnN0IGR0ID0gTWF0aC5tYXgoMCwgbm93IC0gbGFzdFVwZGF0ZVRpbWUpO1xuICAgIGxhc3RVcGRhdGVUaW1lID0gbm93O1xuXG4gICAgLy8gYWRqdXN0IEVNQS1zbW9vdGhlZCBwZWFrIGxhdGVuY3kgZnJvbSBjdXJyZW50IGxhdGVuY3lcblxuICAgIGlmIChzbW9vdGhlZFBlYWtMYXRlbmN5ID09PSBudWxsKSB7XG4gICAgICBzbW9vdGhlZFBlYWtMYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICB9IGVsc2UgaWYgKGxhdGVuY3kgPiBzbW9vdGhlZFBlYWtMYXRlbmN5KSB7XG4gICAgICBjb25zdCBhbHBoYVVwID0gMSAtIE1hdGgucG93KDIsIC1kdCAvIHBlYWtIYWxmTGlmZVVwKTtcbiAgICAgIHNtb290aGVkUGVha0xhdGVuY3kgKz0gYWxwaGFVcCAqIChsYXRlbmN5IC0gc21vb3RoZWRQZWFrTGF0ZW5jeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFscGhhRG93biA9IDEgLSBNYXRoLnBvdygyLCAtZHQgLyBwZWFrSGFsZkxpZmVEb3duKTtcbiAgICAgIHNtb290aGVkUGVha0xhdGVuY3kgKz0gYWxwaGFEb3duICogKGxhdGVuY3kgLSBzbW9vdGhlZFBlYWtMYXRlbmN5KTtcbiAgICB9XG4gICAgc21vb3RoZWRQZWFrTGF0ZW5jeSA9IE1hdGgubWF4KHNtb290aGVkUGVha0xhdGVuY3ksIDApO1xuXG4gICAgLy8gYWRqdXN0IEVNQS1zbW9vdGhlZCBmbG9vciBsYXRlbmN5IGZyb20gY3VycmVudCBsYXRlbmN5XG5cbiAgICBpZiAoc21vb3RoZWRGbG9vckxhdGVuY3kgPT09IG51bGwpIHtcbiAgICAgIHNtb290aGVkRmxvb3JMYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICB9IGVsc2UgaWYgKGxhdGVuY3kgPiBzbW9vdGhlZEZsb29yTGF0ZW5jeSkge1xuICAgICAgY29uc3QgYWxwaGFVcCA9IDEgLSBNYXRoLnBvdygyLCAtZHQgLyBmbG9vckhhbGZMaWZlVXApO1xuICAgICAgc21vb3RoZWRGbG9vckxhdGVuY3kgKz0gYWxwaGFVcCAqIChsYXRlbmN5IC0gc21vb3RoZWRGbG9vckxhdGVuY3kpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhbHBoYURvd24gPSAxIC0gTWF0aC5wb3coMiwgLWR0IC8gZmxvb3JIYWxmTGlmZURvd24pO1xuICAgICAgc21vb3RoZWRGbG9vckxhdGVuY3kgKz0gYWxwaGFEb3duICogKGxhdGVuY3kgLSBzbW9vdGhlZEZsb29yTGF0ZW5jeSk7XG4gICAgfVxuICAgIHNtb290aGVkRmxvb3JMYXRlbmN5ID0gTWF0aC5tYXgoc21vb3RoZWRGbG9vckxhdGVuY3ksIDApO1xuXG4gICAgLy8gYWRqdXN0IEVNQS1zbW9vdGhlZCBpZGVhbCBidWZmZXIgdGltZVxuXG4gICAgY29uc3Qgaml0dGVyID0gc21vb3RoZWRQZWFrTGF0ZW5jeSAtIHNtb290aGVkRmxvb3JMYXRlbmN5O1xuICAgIGNvbnN0IGlkZWFsQnVmZmVyVGltZSA9IHNhZmV0eU11bHRpcGxpZXIgKiAoc21vb3RoZWRQZWFrTGF0ZW5jeSArIGppdHRlcik7XG4gICAgaWYgKHNtb290aGVkSWRlYWxCdWZmZXJUaW1lID09PSBudWxsKSB7XG4gICAgICBzbW9vdGhlZElkZWFsQnVmZmVyVGltZSA9IGlkZWFsQnVmZmVyVGltZTtcbiAgICB9IGVsc2UgaWYgKGlkZWFsQnVmZmVyVGltZSA+IHNtb290aGVkSWRlYWxCdWZmZXJUaW1lKSB7XG4gICAgICBjb25zdCBhbHBoYVVwID0gMSAtIE1hdGgucG93KDIsIC1kdCAvIGlkZWFsSGFsZkxpZmVVcCk7XG4gICAgICBzbW9vdGhlZElkZWFsQnVmZmVyVGltZSArPSArYWxwaGFVcCAqIChpZGVhbEJ1ZmZlclRpbWUgLSBzbW9vdGhlZElkZWFsQnVmZmVyVGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFscGhhRG93biA9IDEgLSBNYXRoLnBvdygyLCAtZHQgLyBpZGVhbEhhbGZMaWZlRG93bik7XG4gICAgICBzbW9vdGhlZElkZWFsQnVmZmVyVGltZSArPSArYWxwaGFEb3duICogKGlkZWFsQnVmZmVyVGltZSAtIHNtb290aGVkSWRlYWxCdWZmZXJUaW1lKTtcbiAgICB9XG5cbiAgICAvLyBxdWFudGl6ZSBzbW9vdGhlZCBpZGVhbCBidWZmZXIgdGltZSB0byBkaXNjcmV0ZSBidWZmZXIgbGV2ZWxcblxuICAgIGxldCBuZXdCdWZmZXJMZXZlbDtcbiAgICBpZiAoc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUgPD0gbWluQnVmZmVyVGltZSkge1xuICAgICAgbmV3QnVmZmVyTGV2ZWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdCdWZmZXJMZXZlbCA9IGNsYW1wKE1hdGguY2VpbChzbW9vdGhlZElkZWFsQnVmZmVyVGltZSAvIGJ1ZmZlckxldmVsU3RlcCksIDEsIG1heEJ1ZmZlckxldmVsKTtcbiAgICB9XG4gICAgaWYgKGxhdGVuY3kgPiBidWZmZXJUaW1lKSB7XG4gICAgICBsb2dnZXIuZGVidWcoJ2J1ZmZlciB1bmRlcnJ1bicsIHtcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgICAgYnVmZmVyVGltZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYWRqdXN0IGJ1ZmZlciBsZXZlbCBhbmQgdGFyZ2V0IGJ1ZmZlciB0aW1lIGZvciBuZXcgYnVmZmVyIGxldmVsXG5cbiAgICBpZiAobmV3QnVmZmVyTGV2ZWwgPiBidWZmZXJMZXZlbCkge1xuICAgICAgaWYgKGxhdGVuY3kgPiBidWZmZXJUaW1lKSB7XG4gICAgICAgIC8vIDwtIHVuZGVycnVuIC0gcmFpc2UgcXVpY2tseVxuICAgICAgICBidWZmZXJMZXZlbCA9IE1hdGgubWluKG5ld0J1ZmZlckxldmVsLCBidWZmZXJMZXZlbCArIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyTGV2ZWwgKz0gMTtcbiAgICAgIH1cbiAgICAgIHRhcmdldEJ1ZmZlclRpbWUgPSBsZXZlbFRvTXMoYnVmZmVyTGV2ZWwpO1xuICAgICAgdHJhbnNpdGlvblJhdGUgPSAodGFyZ2V0QnVmZmVyVGltZSAtIGJ1ZmZlclRpbWUpIC8gdHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgc3RhYmxlU2luY2UgPSBudWxsO1xuICAgICAgbG9nZ2VyLmRlYnVnKCdyYWlzaW5nIGJ1ZmZlcicsIHtcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgICAgYnVmZmVyVGltZSxcbiAgICAgICAgdGFyZ2V0QnVmZmVyVGltZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChuZXdCdWZmZXJMZXZlbCA8IGJ1ZmZlckxldmVsKSB7XG4gICAgICBpZiAoc3RhYmxlU2luY2UgPT0gbnVsbCkgc3RhYmxlU2luY2UgPSBub3c7XG4gICAgICBpZiAobm93IC0gc3RhYmxlU2luY2UgPj0gbWluSW1wcm92ZW1lbnREdXJhdGlvbikge1xuICAgICAgICBidWZmZXJMZXZlbCAtPSAxO1xuICAgICAgICB0YXJnZXRCdWZmZXJUaW1lID0gbGV2ZWxUb01zKGJ1ZmZlckxldmVsKTtcbiAgICAgICAgdHJhbnNpdGlvblJhdGUgPSAodGFyZ2V0QnVmZmVyVGltZSAtIGJ1ZmZlclRpbWUpIC8gdHJhbnNpdGlvbkR1cmF0aW9uO1xuICAgICAgICBzdGFibGVTaW5jZSA9IG5vdztcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdsb3dlcmluZyBidWZmZXInLCB7XG4gICAgICAgICAgbGF0ZW5jeSxcbiAgICAgICAgICBidWZmZXJUaW1lLFxuICAgICAgICAgIHRhcmdldEJ1ZmZlclRpbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YWJsZVNpbmNlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBsaW5lYXIgdHJhbnNpdGlvbiB0byB0YXJnZXQgYnVmZmVyIHRpbWVcblxuICAgIGlmICh0YXJnZXRCdWZmZXJUaW1lICE9PSBudWxsKSB7XG4gICAgICBidWZmZXJUaW1lICs9IHRyYW5zaXRpb25SYXRlICogZHQ7XG4gICAgICBpZiAodHJhbnNpdGlvblJhdGUgPj0gMCAmJiBidWZmZXJUaW1lID4gdGFyZ2V0QnVmZmVyVGltZSB8fCB0cmFuc2l0aW9uUmF0ZSA8IDAgJiYgYnVmZmVyVGltZSA8IHRhcmdldEJ1ZmZlclRpbWUpIHtcbiAgICAgICAgYnVmZmVyVGltZSA9IHRhcmdldEJ1ZmZlclRpbWU7XG4gICAgICAgIHRhcmdldEJ1ZmZlclRpbWUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyVGltZTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsYW1wKHgsIGxvLCBoaSkge1xuICByZXR1cm4gTWF0aC5taW4oaGksIE1hdGgubWF4KGxvLCB4KSk7XG59XG5cbmNvbnN0IE9ORV9TRUNfSU5fVVNFQyA9IDEwMDAwMDA7XG5mdW5jdGlvbiBhbGlzSGFuZGxlcihsb2dnZXIpIHtcbiAgY29uc3Qgb3V0cHV0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuICBjb25zdCBpbnB1dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgbGV0IGhhbmRsZXIgPSBwYXJzZU1hZ2ljU3RyaW5nO1xuICBsZXQgbGFzdEV2ZW50VGltZTtcbiAgbGV0IG1hcmtlckluZGV4ID0gMDtcbiAgZnVuY3Rpb24gcGFyc2VNYWdpY1N0cmluZyhidWZmZXIpIHtcbiAgICBjb25zdCB0ZXh0ID0gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGJ1ZmZlcik7XG4gICAgaWYgKHRleHQgPT09IFwiQUxpU1xceDAxXCIpIHtcbiAgICAgIGhhbmRsZXIgPSBwYXJzZUZpcnN0RnJhbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBhbiBBTGlTIHYxIGxpdmUgc3RyZWFtXCIpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwYXJzZUZpcnN0RnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgdmlldyA9IG5ldyBCaW5hcnlSZWFkZXIobmV3IERhdGFWaWV3KGJ1ZmZlcikpO1xuICAgIGNvbnN0IHR5cGUgPSB2aWV3LmdldFVpbnQ4KCk7XG4gICAgaWYgKHR5cGUgIT09IDB4MDEpIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgcmVzZXQgKDB4MDEpIGZyYW1lLCBnb3QgJHt0eXBlfWApO1xuICAgIHJldHVybiBwYXJzZVJlc2V0RnJhbWUodmlldywgYnVmZmVyKTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZVJlc2V0RnJhbWUodmlldywgYnVmZmVyKSB7XG4gICAgdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgbGV0IHRpbWUgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBsYXN0RXZlbnRUaW1lID0gdGltZTtcbiAgICB0aW1lID0gdGltZSAvIE9ORV9TRUNfSU5fVVNFQztcbiAgICBtYXJrZXJJbmRleCA9IDA7XG4gICAgY29uc3QgY29scyA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGNvbnN0IHJvd3MgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCB0aGVtZUZvcm1hdCA9IHZpZXcuZ2V0VWludDgoKTtcbiAgICBsZXQgdGhlbWU7XG4gICAgaWYgKHRoZW1lRm9ybWF0ID09PSA4KSB7XG4gICAgICBjb25zdCBsZW4gPSAoMiArIDgpICogMztcbiAgICAgIHRoZW1lID0gcGFyc2VUaGVtZShuZXcgVWludDhBcnJheShidWZmZXIsIHZpZXcub2Zmc2V0LCBsZW4pKTtcbiAgICAgIHZpZXcuZm9yd2FyZChsZW4pO1xuICAgIH0gZWxzZSBpZiAodGhlbWVGb3JtYXQgPT09IDE2KSB7XG4gICAgICBjb25zdCBsZW4gPSAoMiArIDE2KSAqIDM7XG4gICAgICB0aGVtZSA9IHBhcnNlVGhlbWUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCB2aWV3Lm9mZnNldCwgbGVuKSk7XG4gICAgICB2aWV3LmZvcndhcmQobGVuKTtcbiAgICB9IGVsc2UgaWYgKHRoZW1lRm9ybWF0ICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGFsaXM6IGludmFsaWQgdGhlbWUgZm9ybWF0ICgke3RoZW1lRm9ybWF0fSlgKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdExlbiA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGxldCBpbml0O1xuICAgIGlmIChpbml0TGVuID4gMCkge1xuICAgICAgaW5pdCA9IG91dHB1dERlY29kZXIuZGVjb2RlKG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgdmlldy5vZmZzZXQsIGluaXRMZW4pKTtcbiAgICB9XG4gICAgaGFuZGxlciA9IHBhcnNlRnJhbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWUsXG4gICAgICB0ZXJtOiB7XG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICBjb2xzLFxuICAgICAgICAgIHJvd3NcbiAgICAgICAgfSxcbiAgICAgICAgdGhlbWUsXG4gICAgICAgIGluaXRcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHBhcnNlRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgdmlldyA9IG5ldyBCaW5hcnlSZWFkZXIobmV3IERhdGFWaWV3KGJ1ZmZlcikpO1xuICAgIGNvbnN0IHR5cGUgPSB2aWV3LmdldFVpbnQ4KCk7XG4gICAgaWYgKHR5cGUgPT09IDB4MDEpIHtcbiAgICAgIHJldHVybiBwYXJzZVJlc2V0RnJhbWUodmlldywgYnVmZmVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDB4NmYpIHtcbiAgICAgIC8vIFwib1wiXG4gICAgICByZXR1cm4gcGFyc2VPdXRwdXRGcmFtZSh2aWV3LCBidWZmZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMHg2OSkge1xuICAgICAgLy8gXCJpXCJcbiAgICAgIHJldHVybiBwYXJzZUlucHV0RnJhbWUodmlldywgYnVmZmVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDB4NzIpIHtcbiAgICAgIC8vIFwiclwiXG4gICAgICByZXR1cm4gcGFyc2VSZXNpemVGcmFtZSh2aWV3KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDB4NmQpIHtcbiAgICAgIC8vIFwibVwiXG4gICAgICByZXR1cm4gcGFyc2VNYXJrZXJGcmFtZSh2aWV3LCBidWZmZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMHg3OCkge1xuICAgICAgLy8gXCJ4XCJcbiAgICAgIHJldHVybiBwYXJzZUV4aXRGcmFtZSh2aWV3KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDB4MDQpIHtcbiAgICAgIC8vIEVPVFxuICAgICAgaGFuZGxlciA9IHBhcnNlRmlyc3RGcmFtZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLmRlYnVnKGBhbGlzOiB1bmtub3duIGZyYW1lIHR5cGU6ICR7dHlwZX1gKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VPdXRwdXRGcmFtZSh2aWV3LCBidWZmZXIpIHtcbiAgICB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCByZWxUaW1lID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgbGFzdEV2ZW50VGltZSArPSByZWxUaW1lO1xuICAgIGNvbnN0IGxlbiA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGNvbnN0IHRleHQgPSBvdXRwdXREZWNvZGVyLmRlY29kZShuZXcgVWludDhBcnJheShidWZmZXIsIHZpZXcub2Zmc2V0LCBsZW4pKTtcbiAgICByZXR1cm4gW2xhc3RFdmVudFRpbWUgLyBPTkVfU0VDX0lOX1VTRUMsIFwib1wiLCB0ZXh0XTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZUlucHV0RnJhbWUodmlldywgYnVmZmVyKSB7XG4gICAgdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3QgcmVsVGltZSA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGxhc3RFdmVudFRpbWUgKz0gcmVsVGltZTtcbiAgICBjb25zdCBsZW4gPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCB0ZXh0ID0gaW5wdXREZWNvZGVyLmRlY29kZShuZXcgVWludDhBcnJheShidWZmZXIsIHZpZXcub2Zmc2V0LCBsZW4pKTtcbiAgICByZXR1cm4gW2xhc3RFdmVudFRpbWUgLyBPTkVfU0VDX0lOX1VTRUMsIFwiaVwiLCB0ZXh0XTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZVJlc2l6ZUZyYW1lKHZpZXcpIHtcbiAgICB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCByZWxUaW1lID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgbGFzdEV2ZW50VGltZSArPSByZWxUaW1lO1xuICAgIGNvbnN0IGNvbHMgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCByb3dzID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgcmV0dXJuIFtsYXN0RXZlbnRUaW1lIC8gT05FX1NFQ19JTl9VU0VDLCBcInJcIiwge1xuICAgICAgY29scyxcbiAgICAgIHJvd3NcbiAgICB9XTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZU1hcmtlckZyYW1lKHZpZXcsIGJ1ZmZlcikge1xuICAgIHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGNvbnN0IHJlbFRpbWUgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBsYXN0RXZlbnRUaW1lICs9IHJlbFRpbWU7XG4gICAgY29uc3QgbGVuID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuICAgIGNvbnN0IGluZGV4ID0gbWFya2VySW5kZXgrKztcbiAgICBjb25zdCB0aW1lID0gbGFzdEV2ZW50VGltZSAvIE9ORV9TRUNfSU5fVVNFQztcbiAgICBjb25zdCBsYWJlbCA9IGRlY29kZXIuZGVjb2RlKG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgdmlldy5vZmZzZXQsIGxlbikpO1xuICAgIHJldHVybiBbdGltZSwgXCJtXCIsIHtcbiAgICAgIGluZGV4LFxuICAgICAgdGltZSxcbiAgICAgIGxhYmVsXG4gICAgfV07XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VFeGl0RnJhbWUodmlldykge1xuICAgIHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGNvbnN0IHJlbFRpbWUgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBsYXN0RXZlbnRUaW1lICs9IHJlbFRpbWU7XG4gICAgY29uc3Qgc3RhdHVzID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgcmV0dXJuIFtsYXN0RXZlbnRUaW1lIC8gT05FX1NFQ19JTl9VU0VDLCBcInhcIiwge1xuICAgICAgc3RhdHVzXG4gICAgfV07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChidWZmZXIpIHtcbiAgICByZXR1cm4gaGFuZGxlcihidWZmZXIpO1xuICB9O1xufVxuZnVuY3Rpb24gcGFyc2VUaGVtZShhcnIpIHtcbiAgY29uc3QgY29sb3JDb3VudCA9IGFyci5sZW5ndGggLyAzO1xuICBjb25zdCBmb3JlZ3JvdW5kID0gaGV4Q29sb3IoYXJyWzBdLCBhcnJbMV0sIGFyclsyXSk7XG4gIGNvbnN0IGJhY2tncm91bmQgPSBoZXhDb2xvcihhcnJbM10sIGFycls0XSwgYXJyWzVdKTtcbiAgY29uc3QgcGFsZXR0ZSA9IFtdO1xuICBmb3IgKGxldCBpID0gMjsgaSA8IGNvbG9yQ291bnQ7IGkrKykge1xuICAgIHBhbGV0dGUucHVzaChoZXhDb2xvcihhcnJbaSAqIDNdLCBhcnJbaSAqIDMgKyAxXSwgYXJyW2kgKiAzICsgMl0pKTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplVGhlbWUoe1xuICAgIGZvcmVncm91bmQsXG4gICAgYmFja2dyb3VuZCxcbiAgICBwYWxldHRlXG4gIH0pO1xufVxuZnVuY3Rpb24gaGV4Q29sb3IociwgZywgYikge1xuICByZXR1cm4gYCMke2J5dGVUb0hleChyKX0ke2J5dGVUb0hleChnKX0ke2J5dGVUb0hleChiKX1gO1xufVxuZnVuY3Rpb24gYnl0ZVRvSGV4KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpO1xufVxuY2xhc3MgQmluYXJ5UmVhZGVyIHtcbiAgY29uc3RydWN0b3IoaW5uZXIpIHtcbiAgICBsZXQgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgIHRoaXMuaW5uZXIgPSBpbm5lcjtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfVxuICBmb3J3YXJkKGRlbHRhKSB7XG4gICAgdGhpcy5vZmZzZXQgKz0gZGVsdGE7XG4gIH1cbiAgZ2V0VWludDgoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmlubmVyLmdldFVpbnQ4KHRoaXMub2Zmc2V0KTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBkZWNvZGVWYXJVaW50KCkge1xuICAgIGxldCBudW1iZXIgPSBCaWdJbnQoMCk7XG4gICAgbGV0IHNoaWZ0ID0gQmlnSW50KDApO1xuICAgIGxldCBieXRlID0gdGhpcy5nZXRVaW50OCgpO1xuICAgIHdoaWxlIChieXRlID4gMTI3KSB7XG4gICAgICBieXRlICY9IDEyNztcbiAgICAgIG51bWJlciArPSBCaWdJbnQoYnl0ZSkgPDwgc2hpZnQ7XG4gICAgICBzaGlmdCArPSBCaWdJbnQoNyk7XG4gICAgICBieXRlID0gdGhpcy5nZXRVaW50OCgpO1xuICAgIH1cbiAgICBudW1iZXIgPSBudW1iZXIgKyAoQmlnSW50KGJ5dGUpIDw8IHNoaWZ0KTtcbiAgICByZXR1cm4gTnVtYmVyKG51bWJlcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNjaWNhc3RWMkhhbmRsZXIoKSB7XG4gIGxldCBwYXJzZSA9IHBhcnNlSGVhZGVyO1xuICBmdW5jdGlvbiBwYXJzZUhlYWRlcihidWZmZXIpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBKU09OLnBhcnNlKGJ1ZmZlcik7XG4gICAgaWYgKGhlYWRlci52ZXJzaW9uICE9PSAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgYW4gYXNjaWljYXN0IHYyIHN0cmVhbVwiKTtcbiAgICB9XG4gICAgcGFyc2UgPSBwYXJzZUV2ZW50O1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiAwLjAsXG4gICAgICB0ZXJtOiB7XG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICBjb2xzOiBoZWFkZXIud2lkdGgsXG4gICAgICAgICAgcm93czogaGVhZGVyLmhlaWdodFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZUV2ZW50KGJ1ZmZlcikge1xuICAgIGNvbnN0IGV2ZW50ID0gSlNPTi5wYXJzZShidWZmZXIpO1xuICAgIGlmIChldmVudFsxXSA9PT0gXCJyXCIpIHtcbiAgICAgIGNvbnN0IFtjb2xzLCByb3dzXSA9IGV2ZW50WzJdLnNwbGl0KFwieFwiKTtcbiAgICAgIHJldHVybiBbZXZlbnRbMF0sIFwiclwiLCB7XG4gICAgICAgIGNvbHM6IHBhcnNlSW50KGNvbHMsIDEwKSxcbiAgICAgICAgcm93czogcGFyc2VJbnQocm93cywgMTApXG4gICAgICB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgIHJldHVybiBwYXJzZShidWZmZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhc2NpY2FzdFYzSGFuZGxlcigpIHtcbiAgbGV0IHBhcnNlID0gcGFyc2VIZWFkZXI7XG4gIGxldCBjdXJyZW50VGltZSA9IDA7XG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVyKGJ1ZmZlcikge1xuICAgIGNvbnN0IGhlYWRlciA9IEpTT04ucGFyc2UoYnVmZmVyKTtcbiAgICBpZiAoaGVhZGVyLnZlcnNpb24gIT09IDMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBhbiBhc2NpaWNhc3QgdjMgc3RyZWFtXCIpO1xuICAgIH1cbiAgICBwYXJzZSA9IHBhcnNlRXZlbnQ7XG4gICAgY29uc3QgdGVybSA9IHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgY29sczogaGVhZGVyLnRlcm0uY29scyxcbiAgICAgICAgcm93czogaGVhZGVyLnRlcm0ucm93c1xuICAgICAgfVxuICAgIH07XG4gICAgaWYgKGhlYWRlci50ZXJtLnRoZW1lKSB7XG4gICAgICBjb25zdCBwYWxldHRlID0gdHlwZW9mIGhlYWRlci50ZXJtLnRoZW1lLnBhbGV0dGUgPT09IFwic3RyaW5nXCIgPyBoZWFkZXIudGVybS50aGVtZS5wYWxldHRlLnNwbGl0KFwiOlwiKSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IHRoZW1lID0gbm9ybWFsaXplVGhlbWUoe1xuICAgICAgICBmb3JlZ3JvdW5kOiBoZWFkZXIudGVybS50aGVtZS5mZyxcbiAgICAgICAgYmFja2dyb3VuZDogaGVhZGVyLnRlcm0udGhlbWUuYmcsXG4gICAgICAgIHBhbGV0dGVcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoZW1lKSB7XG4gICAgICAgIHRlcm0udGhlbWUgPSB0aGVtZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWU6IDAuMCxcbiAgICAgIHRlcm1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHBhcnNlRXZlbnQoYnVmZmVyKSB7XG4gICAgY29uc3QgZXZlbnQgPSBKU09OLnBhcnNlKGJ1ZmZlcik7XG4gICAgY29uc3QgW2ludGVydmFsLCBldmVudFR5cGUsIGRhdGFdID0gZXZlbnQ7XG4gICAgY3VycmVudFRpbWUgKz0gaW50ZXJ2YWw7XG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gXCJyXCIpIHtcbiAgICAgIGNvbnN0IFtjb2xzLCByb3dzXSA9IGRhdGEuc3BsaXQoXCJ4XCIpO1xuICAgICAgcmV0dXJuIFtjdXJyZW50VGltZSwgXCJyXCIsIHtcbiAgICAgICAgY29sczogcGFyc2VJbnQoY29scywgMTApLFxuICAgICAgICByb3dzOiBwYXJzZUludChyb3dzLCAxMClcbiAgICAgIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW2N1cnJlbnRUaW1lLCBldmVudFR5cGUsIGRhdGFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgIHJldHVybiBwYXJzZShidWZmZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiByYXdIYW5kbGVyKCkge1xuICBjb25zdCBvdXRwdXREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG4gIGxldCBwYXJzZSA9IHBhcnNlU2l6ZTtcbiAgZnVuY3Rpb24gcGFyc2VTaXplKGJ1ZmZlcikge1xuICAgIGNvbnN0IHRleHQgPSBvdXRwdXREZWNvZGVyLmRlY29kZShidWZmZXIsIHtcbiAgICAgIHN0cmVhbTogdHJ1ZVxuICAgIH0pO1xuICAgIGNvbnN0IFtjb2xzLCByb3dzXSA9IHNpemVGcm9tUmVzaXplU2VxKHRleHQpID8/IHNpemVGcm9tU2NyaXB0U3RhcnRNZXNzYWdlKHRleHQpID8/IFs4MCwgMjRdO1xuICAgIHBhcnNlID0gcGFyc2VPdXRwdXQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWU6IDAuMCxcbiAgICAgIHRlcm06IHtcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIGNvbHMsXG4gICAgICAgICAgcm93c1xuICAgICAgICB9LFxuICAgICAgICBpbml0OiB0ZXh0XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZU91dHB1dChidWZmZXIpIHtcbiAgICByZXR1cm4gb3V0cHV0RGVjb2Rlci5kZWNvZGUoYnVmZmVyLCB7XG4gICAgICBzdHJlYW06IHRydWVcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgIHJldHVybiBwYXJzZShidWZmZXIpO1xuICB9O1xufVxuZnVuY3Rpb24gc2l6ZUZyb21SZXNpemVTZXEodGV4dCkge1xuICBjb25zdCBtYXRjaCA9IHRleHQubWF0Y2goL1xceDFiXFxbODsoXFxkKyk7KFxcZCspdC8pO1xuICBpZiAobWF0Y2ggIT09IG51bGwpIHtcbiAgICByZXR1cm4gW3BhcnNlSW50KG1hdGNoWzJdLCAxMCksIHBhcnNlSW50KG1hdGNoWzFdLCAxMCldO1xuICB9XG59XG5mdW5jdGlvbiBzaXplRnJvbVNjcmlwdFN0YXJ0TWVzc2FnZSh0ZXh0KSB7XG4gIGNvbnN0IG1hdGNoID0gdGV4dC5tYXRjaCgvXFxbLipDT0xVTU5TPVwiKFxcZHsxLDN9KVwiIExJTkVTPVwiKFxcZHsxLDN9KVwiLipcXF0vKTtcbiAgaWYgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtwYXJzZUludChtYXRjaFsxXSwgMTApLCBwYXJzZUludChtYXRjaFsyXSwgMTApXTtcbiAgfVxufVxuXG5jb25zdCBSRUNPTk5FQ1RfREVMQVlfQkFTRSA9IDUwMDtcbmNvbnN0IFJFQ09OTkVDVF9ERUxBWV9DQVAgPSAxMDAwMDtcbmZ1bmN0aW9uIGV4cG9uZW50aWFsRGVsYXkoYXR0ZW1wdCkge1xuICBjb25zdCBiYXNlID0gTWF0aC5taW4oUkVDT05ORUNUX0RFTEFZX0JBU0UgKiBNYXRoLnBvdygyLCBhdHRlbXB0KSwgUkVDT05ORUNUX0RFTEFZX0NBUCk7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogYmFzZTtcbn1cbmZ1bmN0aW9uIHdlYnNvY2tldChfcmVmLCBfcmVmMiwgX3JlZjMpIHtcbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgYnVmZmVyVGltZSxcbiAgICByZWNvbm5lY3REZWxheSA9IGV4cG9uZW50aWFsRGVsYXksXG4gICAgbWluRnJhbWVUaW1lXG4gIH0gPSBfcmVmO1xuICBsZXQge1xuICAgIGZlZWQsXG4gICAgcmVzZXQsXG4gICAgcmVzaXplLFxuICAgIG9uSW5wdXQsXG4gICAgb25NYXJrZXIsXG4gICAgc2V0U3RhdGUsXG4gICAgbG9nZ2VyXG4gIH0gPSBfcmVmMjtcbiAgbGV0IHtcbiAgICBhdWRpb1VybFxuICB9ID0gX3JlZjM7XG4gIGxvZ2dlciA9IG5ldyBQcmVmaXhlZExvZ2dlcihsb2dnZXIsIFwid2Vic29ja2V0OiBcIik7XG4gIGxldCBzb2NrZXQ7XG4gIGxldCBidWY7XG4gIGxldCBjbG9jayA9IG5ldyBOdWxsQ2xvY2soKTtcbiAgbGV0IHJlY29ubmVjdEF0dGVtcHQgPSAwO1xuICBsZXQgc3VjY2Vzc2Z1bENvbm5lY3Rpb25UaW1lb3V0O1xuICBsZXQgc3RvcCA9IGZhbHNlO1xuICBsZXQgd2FzT25saW5lID0gZmFsc2U7XG4gIGxldCBnb3RFeGl0RXZlbnQgPSBmYWxzZTtcbiAgbGV0IGdvdEVvdEV2ZW50ID0gZmFsc2U7XG4gIGxldCBpbml0VGltZW91dDtcbiAgbGV0IGF1ZGlvRWxlbWVudDtcbiAgZnVuY3Rpb24gY29ubmVjdCgpIHtcbiAgICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCwgW1widjEuYWxpc1wiLCBcInYyLmFzY2lpY2FzdFwiLCBcInYzLmFzY2lpY2FzdFwiLCBcInJhd1wiXSk7XG4gICAgc29ja2V0LmJpbmFyeVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgbGV0IHByb3RvO1xuICAgIHNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICBwcm90byA9IHNvY2tldC5wcm90b2NvbCB8fCBcInJhd1wiO1xuICAgICAgbG9nZ2VyLmluZm8oXCJvcGVuZWRcIik7XG4gICAgICBsb2dnZXIuaW5mbyhgYWN0aXZhdGluZyAke3Byb3RvfSBwcm90b2NvbCBoYW5kbGVyYCk7XG4gICAgICBpZiAocHJvdG8gPT09IFwidjEuYWxpc1wiKSB7XG4gICAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2UoYWxpc0hhbmRsZXIobG9nZ2VyKSk7XG4gICAgICB9IGVsc2UgaWYgKHByb3RvID09PSBcInYyLmFzY2lpY2FzdFwiKSB7XG4gICAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2UoYXNjaWNhc3RWMkhhbmRsZXIoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByb3RvID09PSBcInYzLmFzY2lpY2FzdFwiKSB7XG4gICAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2UoYXNjaWNhc3RWM0hhbmRsZXIoKSk7XG4gICAgICB9IGVsc2UgaWYgKHByb3RvID09PSBcInJhd1wiKSB7XG4gICAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2UocmF3SGFuZGxlcigpKTtcbiAgICAgIH1cbiAgICAgIHN1Y2Nlc3NmdWxDb25uZWN0aW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZWNvbm5lY3RBdHRlbXB0ID0gMDtcbiAgICAgIH0sIDEwMDApO1xuICAgIH07XG4gICAgc29ja2V0Lm9uY2xvc2UgPSBldmVudCA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoaW5pdFRpbWVvdXQpO1xuICAgICAgc3RvcEJ1ZmZlcigpO1xuICAgICAgaWYgKHN0b3ApIHJldHVybjtcbiAgICAgIGxldCBlbmRlZCA9IGZhbHNlO1xuICAgICAgbGV0IGVuZGVkTWVzc2FnZSA9IFwiU3RyZWFtIGVuZGVkXCI7XG4gICAgICBpZiAocHJvdG8gPT09IFwidjEuYWxpc1wiKSB7XG4gICAgICAgIGlmIChnb3RFb3RFdmVudCB8fCBldmVudC5jb2RlID49IDQwMDAgJiYgZXZlbnQuY29kZSA8PSA0MTAwKSB7XG4gICAgICAgICAgZW5kZWQgPSB0cnVlO1xuICAgICAgICAgIGVuZGVkTWVzc2FnZSA9IGV2ZW50LnJlYXNvbiB8fCBlbmRlZE1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZ290RXhpdEV2ZW50IHx8IGV2ZW50LmNvZGUgPT09IDEwMDAgfHwgZXZlbnQuY29kZSA9PT0gMTAwNSkge1xuICAgICAgICBlbmRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoZW5kZWQpIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJjbG9zZWRcIik7XG4gICAgICAgIHNldFN0YXRlKFwiZW5kZWRcIiwge1xuICAgICAgICAgIG1lc3NhZ2U6IGVuZGVkTWVzc2FnZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gMTAwMikge1xuICAgICAgICBsb2dnZXIuZGVidWcoYGNsb3NlIHJlYXNvbjogJHtldmVudC5yZWFzb259YCk7XG4gICAgICAgIHNldFN0YXRlKFwiZW5kZWRcIiwge1xuICAgICAgICAgIG1lc3NhZ2U6IFwiRXJyOiBQbGF5ZXIgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgc2VydmVyXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhclRpbWVvdXQoc3VjY2Vzc2Z1bENvbm5lY3Rpb25UaW1lb3V0KTtcbiAgICAgICAgY29uc3QgZGVsYXkgPSByZWNvbm5lY3REZWxheShyZWNvbm5lY3RBdHRlbXB0KyspO1xuICAgICAgICBsb2dnZXIuaW5mbyhgdW5leHBlY3RlZCBjbG9zZSwgcmVjb25uZWN0aW5nIGluICR7ZGVsYXl9Li4uYCk7XG4gICAgICAgIHNldFN0YXRlKFwibG9hZGluZ1wiKTtcbiAgICAgICAgc2V0VGltZW91dChjb25uZWN0LCBkZWxheSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3YXNPbmxpbmUgPSBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBvbk1lc3NhZ2UoaGFuZGxlcikge1xuICAgIGluaXRUaW1lb3V0ID0gc2V0VGltZW91dChvblN0cmVhbUVuZCwgNTAwMCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gaGFuZGxlcihldmVudC5kYXRhKTtcbiAgICAgICAgaWYgKGJ1Zikge1xuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgICAgIGJ1Zi5wdXNoRXZlbnQocmVzdWx0KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHRbMV0gPT09IFwieFwiKSB7XG4gICAgICAgICAgICAgIGdvdEV4aXRFdmVudCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBidWYucHVzaFRleHQocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICAgICAgLy8gVE9ETzogY2hlY2sgbGFzdCBldmVudCBJRCBmcm9tIHRoZSBwYXJzZXIsIGRvbid0IHJlc2V0IGlmIHdlIGRpZG4ndCBtaXNzIGFueXRoaW5nXG4gICAgICAgICAgICBvblN0cmVhbVJlc2V0KHJlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBFT1RcbiAgICAgICAgICAgIG9uU3RyZWFtRW5kKCk7XG4gICAgICAgICAgICBnb3RFb3RFdmVudCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmV4cGVjdGVkIHZhbHVlIGZyb20gcHJvdG9jb2wgaGFuZGxlcjogJHtyZXN1bHR9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgICAgIG9uU3RyZWFtUmVzZXQocmVzdWx0KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpbml0VGltZW91dCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGluaXRUaW1lb3V0KTtcbiAgICAgICAgICAgIGluaXRUaW1lb3V0ID0gc2V0VGltZW91dChvblN0cmVhbUVuZCwgMTAwMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpbml0VGltZW91dCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgdmFsdWUgZnJvbSBwcm90b2NvbCBoYW5kbGVyOiAke3Jlc3VsdH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBvblN0cmVhbVJlc2V0KF9yZWY0KSB7XG4gICAgbGV0IHtcbiAgICAgIHRpbWUsXG4gICAgICB0ZXJtXG4gICAgfSA9IF9yZWY0O1xuICAgIGNvbnN0IHtcbiAgICAgIHNpemUsXG4gICAgICBpbml0LFxuICAgICAgdGhlbWVcbiAgICB9ID0gdGVybTtcbiAgICBjb25zdCB7XG4gICAgICBjb2xzLFxuICAgICAgcm93c1xuICAgIH0gPSBzaXplO1xuICAgIGxvZ2dlci5pbmZvKGBzdHJlYW0gcmVzZXQgKCR7Y29sc314JHtyb3dzfSBAJHt0aW1lfSlgKTtcbiAgICBzZXRTdGF0ZShcInBsYXlpbmdcIik7XG4gICAgc3RvcEJ1ZmZlcigpO1xuICAgIGJ1ZiA9IGdldEJ1ZmZlcihidWZmZXJUaW1lLCBmZWVkLCByZXNpemUsIG9uSW5wdXQsIG9uTWFya2VyLCB0ID0+IGNsb2NrLnNldFRpbWUodCksIHRpbWUsIG1pbkZyYW1lVGltZSwgbG9nZ2VyKTtcbiAgICByZXNldChjb2xzLCByb3dzLCBpbml0LCB0aGVtZSk7XG4gICAgY2xvY2sgPSBuZXcgQ2xvY2soKTtcbiAgICB3YXNPbmxpbmUgPSB0cnVlO1xuICAgIGdvdEV4aXRFdmVudCA9IGZhbHNlO1xuICAgIGdvdEVvdEV2ZW50ID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiB0aW1lID09PSBcIm51bWJlclwiKSB7XG4gICAgICBjbG9jay5zZXRUaW1lKHRpbWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvblN0cmVhbUVuZCgpIHtcbiAgICBzdG9wQnVmZmVyKCk7XG4gICAgaWYgKHdhc09ubGluZSkge1xuICAgICAgbG9nZ2VyLmluZm8oXCJzdHJlYW0gZW5kZWRcIik7XG4gICAgICBzZXRTdGF0ZShcIm9mZmxpbmVcIiwge1xuICAgICAgICBtZXNzYWdlOiBcIlN0cmVhbSBlbmRlZFwiXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLmluZm8oXCJzdHJlYW0gb2ZmbGluZVwiKTtcbiAgICAgIHNldFN0YXRlKFwib2ZmbGluZVwiLCB7XG4gICAgICAgIG1lc3NhZ2U6IFwiU3RyZWFtIG9mZmxpbmVcIlxuICAgICAgfSk7XG4gICAgfVxuICAgIGNsb2NrID0gbmV3IE51bGxDbG9jaygpO1xuICB9XG4gIGZ1bmN0aW9uIHN0b3BCdWZmZXIoKSB7XG4gICAgaWYgKGJ1ZikgYnVmLnN0b3AoKTtcbiAgICBidWYgPSBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIHN0YXJ0QXVkaW8oKSB7XG4gICAgaWYgKCFhdWRpb1VybCkgcmV0dXJuO1xuICAgIGF1ZGlvRWxlbWVudCA9IG5ldyBBdWRpbygpO1xuICAgIGF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXCJhdXRvXCI7XG4gICAgYXVkaW9FbGVtZW50LmNyb3NzT3JpZ2luID0gXCJhbm9ueW1vdXNcIjtcbiAgICBhdWRpb0VsZW1lbnQuc3JjID0gYXVkaW9Vcmw7XG4gICAgYXVkaW9FbGVtZW50LnBsYXkoKTtcbiAgfVxuICBmdW5jdGlvbiBzdG9wQXVkaW8oKSB7XG4gICAgaWYgKCFhdWRpb0VsZW1lbnQpIHJldHVybjtcbiAgICBhdWRpb0VsZW1lbnQucGF1c2UoKTtcbiAgfVxuICBmdW5jdGlvbiBtdXRlKCkge1xuICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5tdXRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdW5tdXRlKCkge1xuICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5tdXRlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgaW5pdDogKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGFzQXVkaW86ICEhYXVkaW9VcmxcbiAgICAgIH07XG4gICAgfSxcbiAgICBwbGF5OiAoKSA9PiB7XG4gICAgICBjb25uZWN0KCk7XG4gICAgICBzdGFydEF1ZGlvKCk7XG4gICAgfSxcbiAgICBzdG9wOiAoKSA9PiB7XG4gICAgICBzdG9wID0gdHJ1ZTtcbiAgICAgIHN0b3BCdWZmZXIoKTtcbiAgICAgIGlmIChzb2NrZXQgIT09IHVuZGVmaW5lZCkgc29ja2V0LmNsb3NlKCk7XG4gICAgICBzdG9wQXVkaW8oKTtcbiAgICB9LFxuICAgIG11dGUsXG4gICAgdW5tdXRlLFxuICAgIGdldEN1cnJlbnRUaW1lOiAoKSA9PiBjbG9jay5nZXRUaW1lKClcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXZlbnRzb3VyY2UoX3JlZiwgX3JlZjIpIHtcbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgYnVmZmVyVGltZSxcbiAgICBtaW5GcmFtZVRpbWVcbiAgfSA9IF9yZWY7XG4gIGxldCB7XG4gICAgZmVlZCxcbiAgICByZXNldCxcbiAgICByZXNpemUsXG4gICAgb25JbnB1dCxcbiAgICBvbk1hcmtlcixcbiAgICBzZXRTdGF0ZSxcbiAgICBsb2dnZXJcbiAgfSA9IF9yZWYyO1xuICBsb2dnZXIgPSBuZXcgUHJlZml4ZWRMb2dnZXIobG9nZ2VyLCBcImV2ZW50c291cmNlOiBcIik7XG4gIGxldCBlcztcbiAgbGV0IGJ1ZjtcbiAgbGV0IGNsb2NrID0gbmV3IE51bGxDbG9jaygpO1xuICBmdW5jdGlvbiBpbml0QnVmZmVyKGJhc2VTdHJlYW1UaW1lKSB7XG4gICAgaWYgKGJ1ZiAhPT0gdW5kZWZpbmVkKSBidWYuc3RvcCgpO1xuICAgIGJ1ZiA9IGdldEJ1ZmZlcihidWZmZXJUaW1lLCBmZWVkLCByZXNpemUsIG9uSW5wdXQsIG9uTWFya2VyLCB0ID0+IGNsb2NrLnNldFRpbWUodCksIGJhc2VTdHJlYW1UaW1lLCBtaW5GcmFtZVRpbWUsIGxvZ2dlcik7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwbGF5OiAoKSA9PiB7XG4gICAgICBlcyA9IG5ldyBFdmVudFNvdXJjZSh1cmwpO1xuICAgICAgZXMuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIm9wZW5lZFwiKTtcbiAgICAgICAgaW5pdEJ1ZmZlcigpO1xuICAgICAgfSk7XG4gICAgICBlcy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZSA9PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiZXJyb3JlZFwiKTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKHtcbiAgICAgICAgICBlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRTdGF0ZShcImxvYWRpbmdcIik7XG4gICAgICB9KTtcbiAgICAgIGVzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc3QgZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGUpKSB7XG4gICAgICAgICAgYnVmLnB1c2hFdmVudChlKTtcbiAgICAgICAgfSBlbHNlIGlmIChlLmNvbHMgIT09IHVuZGVmaW5lZCB8fCBlLndpZHRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBjb2xzID0gZS5jb2xzID8/IGUud2lkdGg7XG4gICAgICAgICAgY29uc3Qgcm93cyA9IGUucm93cyA/PyBlLmhlaWdodDtcbiAgICAgICAgICBsb2dnZXIuZGVidWcoYHZ0IHJlc2V0ICgke2NvbHN9eCR7cm93c30pYCk7XG4gICAgICAgICAgc2V0U3RhdGUoXCJwbGF5aW5nXCIpO1xuICAgICAgICAgIGluaXRCdWZmZXIoZS50aW1lKTtcbiAgICAgICAgICByZXNldChjb2xzLCByb3dzLCBlLmluaXQgPz8gdW5kZWZpbmVkKTtcbiAgICAgICAgICBjbG9jayA9IG5ldyBDbG9jaygpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZS50aW1lID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBjbG9jay5zZXRUaW1lKGUudGltZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGUuc3RhdGUgPT09IFwib2ZmbGluZVwiKSB7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oXCJzdHJlYW0gb2ZmbGluZVwiKTtcbiAgICAgICAgICBzZXRTdGF0ZShcIm9mZmxpbmVcIiwge1xuICAgICAgICAgICAgbWVzc2FnZTogXCJTdHJlYW0gb2ZmbGluZVwiXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY2xvY2sgPSBuZXcgTnVsbENsb2NrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZXMuYWRkRXZlbnRMaXN0ZW5lcihcImRvbmVcIiwgKCkgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcImNsb3NlZFwiKTtcbiAgICAgICAgZXMuY2xvc2UoKTtcbiAgICAgICAgc2V0U3RhdGUoXCJlbmRlZFwiLCB7XG4gICAgICAgICAgbWVzc2FnZTogXCJTdHJlYW0gZW5kZWRcIlxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc3RvcDogKCkgPT4ge1xuICAgICAgaWYgKGJ1ZiAhPT0gdW5kZWZpbmVkKSBidWYuc3RvcCgpO1xuICAgICAgaWYgKGVzICE9PSB1bmRlZmluZWQpIGVzLmNsb3NlKCk7XG4gICAgfSxcbiAgICBnZXRDdXJyZW50VGltZTogKCkgPT4gY2xvY2suZ2V0VGltZSgpXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlJDEocmVzcG9uc2VzLCBfcmVmKSB7XG4gIGxldCB7XG4gICAgZW5jb2RpbmdcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IHRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKGVuY29kaW5nKTtcbiAgbGV0IGNvbHM7XG4gIGxldCByb3dzO1xuICBsZXQgdGltaW5nID0gKGF3YWl0IHJlc3BvbnNlc1swXS50ZXh0KCkpLnNwbGl0KFwiXFxuXCIpLmZpbHRlcihsaW5lID0+IGxpbmUubGVuZ3RoID4gMCkubWFwKGxpbmUgPT4gbGluZS5zcGxpdChcIiBcIikpO1xuICBpZiAodGltaW5nWzBdLmxlbmd0aCA8IDMpIHtcbiAgICB0aW1pbmcgPSB0aW1pbmcubWFwKGVudHJ5ID0+IFtcIk9cIiwgZW50cnlbMF0sIGVudHJ5WzFdXSk7XG4gIH1cbiAgY29uc3QgYnVmZmVyID0gYXdhaXQgcmVzcG9uc2VzWzFdLmFycmF5QnVmZmVyKCk7XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgY29uc3QgZGF0YU9mZnNldCA9IGFycmF5LmZpbmRJbmRleChieXRlID0+IGJ5dGUgPT0gMHgwYSkgKyAxO1xuICBjb25zdCBoZWFkZXIgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoYXJyYXkuc3ViYXJyYXkoMCwgZGF0YU9mZnNldCkpO1xuICBjb25zdCBzaXplTWF0Y2ggPSBoZWFkZXIubWF0Y2goL0NPTFVNTlM9XCIoXFxkKylcIiBMSU5FUz1cIihcXGQrKVwiLyk7XG4gIGlmIChzaXplTWF0Y2ggIT09IG51bGwpIHtcbiAgICBjb2xzID0gcGFyc2VJbnQoc2l6ZU1hdGNoWzFdLCAxMCk7XG4gICAgcm93cyA9IHBhcnNlSW50KHNpemVNYXRjaFsyXSwgMTApO1xuICB9XG4gIGNvbnN0IHN0ZG91dCA9IHtcbiAgICBhcnJheSxcbiAgICBjdXJzb3I6IGRhdGFPZmZzZXRcbiAgfTtcbiAgbGV0IHN0ZGluID0gc3Rkb3V0O1xuICBpZiAocmVzcG9uc2VzWzJdICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBidWZmZXIgPSBhd2FpdCByZXNwb25zZXNbMl0uYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCBhcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gICAgc3RkaW4gPSB7XG4gICAgICBhcnJheSxcbiAgICAgIGN1cnNvcjogZGF0YU9mZnNldFxuICAgIH07XG4gIH1cbiAgY29uc3QgZXZlbnRzID0gW107XG4gIGxldCB0aW1lID0gMDtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiB0aW1pbmcpIHtcbiAgICB0aW1lICs9IHBhcnNlRmxvYXQoZW50cnlbMV0pO1xuICAgIGlmIChlbnRyeVswXSA9PT0gXCJPXCIpIHtcbiAgICAgIGNvbnN0IGNvdW50ID0gcGFyc2VJbnQoZW50cnlbMl0sIDEwKTtcbiAgICAgIGNvbnN0IGJ5dGVzID0gc3Rkb3V0LmFycmF5LnN1YmFycmF5KHN0ZG91dC5jdXJzb3IsIHN0ZG91dC5jdXJzb3IgKyBjb3VudCk7XG4gICAgICBjb25zdCB0ZXh0ID0gdGV4dERlY29kZXIuZGVjb2RlKGJ5dGVzKTtcbiAgICAgIGV2ZW50cy5wdXNoKFt0aW1lLCBcIm9cIiwgdGV4dF0pO1xuICAgICAgc3Rkb3V0LmN1cnNvciArPSBjb3VudDtcbiAgICB9IGVsc2UgaWYgKGVudHJ5WzBdID09PSBcIklcIikge1xuICAgICAgY29uc3QgY291bnQgPSBwYXJzZUludChlbnRyeVsyXSwgMTApO1xuICAgICAgY29uc3QgYnl0ZXMgPSBzdGRpbi5hcnJheS5zdWJhcnJheShzdGRpbi5jdXJzb3IsIHN0ZGluLmN1cnNvciArIGNvdW50KTtcbiAgICAgIGNvbnN0IHRleHQgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoYnl0ZXMpO1xuICAgICAgZXZlbnRzLnB1c2goW3RpbWUsIFwiaVwiLCB0ZXh0XSk7XG4gICAgICBzdGRpbi5jdXJzb3IgKz0gY291bnQ7XG4gICAgfSBlbHNlIGlmIChlbnRyeVswXSA9PT0gXCJTXCIgJiYgZW50cnlbMl0gPT09IFwiU0lHV0lOQ0hcIikge1xuICAgICAgY29uc3QgY29scyA9IHBhcnNlSW50KGVudHJ5WzRdLnNsaWNlKDUpLCAxMCk7XG4gICAgICBjb25zdCByb3dzID0gcGFyc2VJbnQoZW50cnlbM10uc2xpY2UoNSksIDEwKTtcbiAgICAgIGV2ZW50cy5wdXNoKFt0aW1lLCBcInJcIiwgYCR7Y29sc314JHtyb3dzfWBdKTtcbiAgICB9IGVsc2UgaWYgKGVudHJ5WzBdID09PSBcIkhcIiAmJiBlbnRyeVsyXSA9PT0gXCJDT0xVTU5TXCIpIHtcbiAgICAgIGNvbHMgPSBwYXJzZUludChlbnRyeVszXSwgMTApO1xuICAgIH0gZWxzZSBpZiAoZW50cnlbMF0gPT09IFwiSFwiICYmIGVudHJ5WzJdID09PSBcIkxJTkVTXCIpIHtcbiAgICAgIHJvd3MgPSBwYXJzZUludChlbnRyeVszXSwgMTApO1xuICAgIH1cbiAgfVxuICBjb2xzID0gY29scyA/PyA4MDtcbiAgcm93cyA9IHJvd3MgPz8gMjQ7XG4gIHJldHVybiB7XG4gICAgY29scyxcbiAgICByb3dzLFxuICAgIGV2ZW50c1xuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZShyZXNwb25zZSwgX3JlZikge1xuICBsZXQge1xuICAgIGVuY29kaW5nXG4gIH0gPSBfcmVmO1xuICBjb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihlbmNvZGluZyk7XG4gIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgY29uc3QgZmlyc3RGcmFtZSA9IHBhcnNlRnJhbWUoYXJyYXkpO1xuICBjb25zdCBiYXNlVGltZSA9IGZpcnN0RnJhbWUudGltZTtcbiAgY29uc3QgZmlyc3RGcmFtZVRleHQgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoZmlyc3RGcmFtZS5kYXRhKTtcbiAgY29uc3Qgc2l6ZU1hdGNoID0gZmlyc3RGcmFtZVRleHQubWF0Y2goL1xceDFiXFxbODsoXFxkKyk7KFxcZCspdC8pO1xuICBjb25zdCBldmVudHMgPSBbXTtcbiAgbGV0IGNvbHMgPSA4MDtcbiAgbGV0IHJvd3MgPSAyNDtcbiAgaWYgKHNpemVNYXRjaCAhPT0gbnVsbCkge1xuICAgIGNvbHMgPSBwYXJzZUludChzaXplTWF0Y2hbMl0sIDEwKTtcbiAgICByb3dzID0gcGFyc2VJbnQoc2l6ZU1hdGNoWzFdLCAxMCk7XG4gIH1cbiAgbGV0IGN1cnNvciA9IDA7XG4gIGxldCBmcmFtZSA9IHBhcnNlRnJhbWUoYXJyYXkpO1xuICB3aGlsZSAoZnJhbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lIC0gYmFzZVRpbWU7XG4gICAgY29uc3QgdGV4dCA9IHRleHREZWNvZGVyLmRlY29kZShmcmFtZS5kYXRhKTtcbiAgICBldmVudHMucHVzaChbdGltZSwgXCJvXCIsIHRleHRdKTtcbiAgICBjdXJzb3IgKz0gZnJhbWUubGVuO1xuICAgIGZyYW1lID0gcGFyc2VGcmFtZShhcnJheS5zdWJhcnJheShjdXJzb3IpKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGNvbHMsXG4gICAgcm93cyxcbiAgICBldmVudHNcbiAgfTtcbn1cbmZ1bmN0aW9uIHBhcnNlRnJhbWUoYXJyYXkpIHtcbiAgaWYgKGFycmF5Lmxlbmd0aCA8IDEzKSByZXR1cm47XG4gIGNvbnN0IHRpbWUgPSBwYXJzZVRpbWVzdGFtcChhcnJheS5zdWJhcnJheSgwLCA4KSk7XG4gIGNvbnN0IGxlbiA9IHBhcnNlTnVtYmVyKGFycmF5LnN1YmFycmF5KDgsIDEyKSk7XG4gIGNvbnN0IGRhdGEgPSBhcnJheS5zdWJhcnJheSgxMiwgMTIgKyBsZW4pO1xuICByZXR1cm4ge1xuICAgIHRpbWUsXG4gICAgZGF0YSxcbiAgICBsZW46IGxlbiArIDEyXG4gIH07XG59XG5mdW5jdGlvbiBwYXJzZU51bWJlcihhcnJheSkge1xuICByZXR1cm4gYXJyYXlbMF0gKyBhcnJheVsxXSAqIDI1NiArIGFycmF5WzJdICogMjU2ICogMjU2ICsgYXJyYXlbM10gKiAyNTYgKiAyNTYgKiAyNTY7XG59XG5mdW5jdGlvbiBwYXJzZVRpbWVzdGFtcChhcnJheSkge1xuICBjb25zdCBzZWMgPSBwYXJzZU51bWJlcihhcnJheS5zdWJhcnJheSgwLCA0KSk7XG4gIGNvbnN0IHVzZWMgPSBwYXJzZU51bWJlcihhcnJheS5zdWJhcnJheSg0LCA4KSk7XG4gIHJldHVybiBzZWMgKyB1c2VjIC8gMTAwMDAwMDtcbn1cblxuY29uc3QgREVGQVVMVF9DT0xTID0gODA7XG5jb25zdCBERUZBVUxUX1JPV1MgPSAyNDtcbmNvbnN0IHZ0ID0gaW5pdCh7XG4gIG1vZHVsZTogdnRXYXNtTW9kdWxlXG59KTsgLy8gdHJpZ2dlciBhc3luYyBsb2FkaW5nIG9mIHdhc21cblxuY2xhc3MgU3RhdGUge1xuICBjb25zdHJ1Y3Rvcihjb3JlKSB7XG4gICAgdGhpcy5jb3JlID0gY29yZTtcbiAgICB0aGlzLmRyaXZlciA9IGNvcmUuZHJpdmVyO1xuICB9XG4gIG9uRW50ZXIoZGF0YSkge31cbiAgaW5pdCgpIHt9XG4gIHBsYXkoKSB7fVxuICBwYXVzZSgpIHt9XG4gIHRvZ2dsZVBsYXkoKSB7fVxuICBtdXRlKCkge1xuICAgIGlmICh0aGlzLmRyaXZlciAmJiB0aGlzLmRyaXZlci5tdXRlKCkpIHtcbiAgICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcIm11dGVkXCIsIHRydWUpO1xuICAgIH1cbiAgfVxuICB1bm11dGUoKSB7XG4gICAgaWYgKHRoaXMuZHJpdmVyICYmIHRoaXMuZHJpdmVyLnVubXV0ZSgpKSB7XG4gICAgICB0aGlzLmNvcmUuX2Rpc3BhdGNoRXZlbnQoXCJtdXRlZFwiLCBmYWxzZSk7XG4gICAgfVxuICB9XG4gIHNlZWsod2hlcmUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RlcChuKSB7fVxuICBzdG9wKCkge1xuICAgIHRoaXMuZHJpdmVyLnN0b3AoKTtcbiAgfVxufVxuY2xhc3MgVW5pbml0aWFsaXplZFN0YXRlIGV4dGVuZHMgU3RhdGUge1xuICBhc3luYyBpbml0KCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmNvcmUuX2luaXRpYWxpemVEcml2ZXIoKTtcbiAgICAgIHJldHVybiB0aGlzLmNvcmUuX3NldFN0YXRlKFwiaWRsZVwiKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmNvcmUuX3NldFN0YXRlKFwiZXJyb3JlZFwiKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG4gIGFzeW5jIHBsYXkoKSB7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwicGxheVwiKTtcbiAgICBjb25zdCBpZGxlU3RhdGUgPSBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICBhd2FpdCBpZGxlU3RhdGUuZG9QbGF5KCk7XG4gIH1cbiAgYXN5bmMgdG9nZ2xlUGxheSgpIHtcbiAgICBhd2FpdCB0aGlzLnBsYXkoKTtcbiAgfVxuICBhc3luYyBzZWVrKHdoZXJlKSB7XG4gICAgY29uc3QgaWRsZVN0YXRlID0gYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgcmV0dXJuIGF3YWl0IGlkbGVTdGF0ZS5zZWVrKHdoZXJlKTtcbiAgfVxuICBhc3luYyBzdGVwKG4pIHtcbiAgICBjb25zdCBpZGxlU3RhdGUgPSBhd2FpdCB0aGlzLmluaXQoKTtcbiAgICBhd2FpdCBpZGxlU3RhdGUuc3RlcChuKTtcbiAgfVxuICBzdG9wKCkge31cbn1cbmNsYXNzIElkbGUgZXh0ZW5kcyBTdGF0ZSB7XG4gIG9uRW50ZXIoX3JlZikge1xuICAgIGxldCB7XG4gICAgICByZWFzb24sXG4gICAgICBtZXNzYWdlXG4gICAgfSA9IF9yZWY7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwiaWRsZVwiLCB7XG4gICAgICBtZXNzYWdlXG4gICAgfSk7XG4gICAgaWYgKHJlYXNvbiA9PT0gXCJwYXVzZWRcIikge1xuICAgICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwicGF1c2VcIik7XG4gICAgfVxuICB9XG4gIGFzeW5jIHBsYXkoKSB7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwicGxheVwiKTtcbiAgICBhd2FpdCB0aGlzLmRvUGxheSgpO1xuICB9XG4gIGFzeW5jIGRvUGxheSgpIHtcbiAgICBjb25zdCBzdG9wID0gYXdhaXQgdGhpcy5kcml2ZXIucGxheSgpO1xuICAgIGlmIChzdG9wID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmNvcmUuX3NldFN0YXRlKFwicGxheWluZ1wiKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdG9wID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuY29yZS5fc2V0U3RhdGUoXCJwbGF5aW5nXCIpO1xuICAgICAgdGhpcy5kcml2ZXIuc3RvcCA9IHN0b3A7XG4gICAgfVxuICB9XG4gIGFzeW5jIHRvZ2dsZVBsYXkoKSB7XG4gICAgYXdhaXQgdGhpcy5wbGF5KCk7XG4gIH1cbiAgc2Vlayh3aGVyZSkge1xuICAgIHJldHVybiB0aGlzLmRyaXZlci5zZWVrKHdoZXJlKTtcbiAgfVxuICBzdGVwKG4pIHtcbiAgICB0aGlzLmRyaXZlci5zdGVwKG4pO1xuICB9XG59XG5jbGFzcyBQbGF5aW5nU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gIG9uRW50ZXIoKSB7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwicGxheWluZ1wiKTtcbiAgfVxuICBwYXVzZSgpIHtcbiAgICBpZiAodGhpcy5kcml2ZXIucGF1c2UoKSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jb3JlLl9zZXRTdGF0ZShcImlkbGVcIiwge1xuICAgICAgICByZWFzb246IFwicGF1c2VkXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICB0b2dnbGVQbGF5KCkge1xuICAgIHRoaXMucGF1c2UoKTtcbiAgfVxuICBzZWVrKHdoZXJlKSB7XG4gICAgcmV0dXJuIHRoaXMuZHJpdmVyLnNlZWsod2hlcmUpO1xuICB9XG59XG5jbGFzcyBMb2FkaW5nU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gIG9uRW50ZXIoKSB7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwibG9hZGluZ1wiKTtcbiAgfVxufVxuY2xhc3MgT2ZmbGluZVN0YXRlIGV4dGVuZHMgU3RhdGUge1xuICBvbkVudGVyKF9yZWYyKSB7XG4gICAgbGV0IHtcbiAgICAgIG1lc3NhZ2VcbiAgICB9ID0gX3JlZjI7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwib2ZmbGluZVwiLCB7XG4gICAgICBtZXNzYWdlXG4gICAgfSk7XG4gIH1cbn1cbmNsYXNzIEVuZGVkU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gIG9uRW50ZXIoX3JlZjMpIHtcbiAgICBsZXQge1xuICAgICAgbWVzc2FnZVxuICAgIH0gPSBfcmVmMztcbiAgICB0aGlzLmNvcmUuX2Rpc3BhdGNoRXZlbnQoXCJlbmRlZFwiLCB7XG4gICAgICBtZXNzYWdlXG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgcGxheSgpIHtcbiAgICB0aGlzLmNvcmUuX2Rpc3BhdGNoRXZlbnQoXCJwbGF5XCIpO1xuICAgIGlmIChhd2FpdCB0aGlzLmRyaXZlci5yZXN0YXJ0KCkpIHtcbiAgICAgIHRoaXMuY29yZS5fc2V0U3RhdGUoJ3BsYXlpbmcnKTtcbiAgICB9XG4gIH1cbiAgYXN5bmMgdG9nZ2xlUGxheSgpIHtcbiAgICBhd2FpdCB0aGlzLnBsYXkoKTtcbiAgfVxuICBhc3luYyBzZWVrKHdoZXJlKSB7XG4gICAgaWYgKChhd2FpdCB0aGlzLmRyaXZlci5zZWVrKHdoZXJlKSkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuY29yZS5fc2V0U3RhdGUoJ2lkbGUnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbmNsYXNzIEVycm9yZWRTdGF0ZSBleHRlbmRzIFN0YXRlIHtcbiAgb25FbnRlcigpIHtcbiAgICB0aGlzLmNvcmUuX2Rpc3BhdGNoRXZlbnQoXCJlcnJvcmVkXCIpO1xuICB9XG59XG5jbGFzcyBDb3JlIHtcbiAgY29uc3RydWN0b3Ioc3JjLCBvcHRzKSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRzLmxvZ2dlcjtcbiAgICB0aGlzLnN0YXRlID0gbmV3IFVuaW5pdGlhbGl6ZWRTdGF0ZSh0aGlzKTtcbiAgICB0aGlzLnN0YXRlTmFtZSA9IFwidW5pbml0aWFsaXplZFwiO1xuICAgIHRoaXMuZHJpdmVyID0gZ2V0RHJpdmVyKHNyYyk7XG4gICAgdGhpcy5jaGFuZ2VkTGluZXMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5kdXJhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNvbHMgPSBvcHRzLmNvbHM7XG4gICAgdGhpcy5yb3dzID0gb3B0cy5yb3dzO1xuICAgIHRoaXMuc3BlZWQgPSBvcHRzLnNwZWVkO1xuICAgIHRoaXMubG9vcCA9IG9wdHMubG9vcDtcbiAgICB0aGlzLmF1dG9QbGF5ID0gb3B0cy5hdXRvUGxheTtcbiAgICB0aGlzLmlkbGVUaW1lTGltaXQgPSBvcHRzLmlkbGVUaW1lTGltaXQ7XG4gICAgdGhpcy5wcmVsb2FkID0gb3B0cy5wcmVsb2FkO1xuICAgIHRoaXMuc3RhcnRBdCA9IHBhcnNlTnB0KG9wdHMuc3RhcnRBdCk7XG4gICAgdGhpcy5wb3N0ZXIgPSB0aGlzLl9wYXJzZVBvc3RlcihvcHRzLnBvc3Rlcik7XG4gICAgdGhpcy5tYXJrZXJzID0gdGhpcy5fbm9ybWFsaXplTWFya2VycyhvcHRzLm1hcmtlcnMpO1xuICAgIHRoaXMucGF1c2VPbk1hcmtlcnMgPSBvcHRzLnBhdXNlT25NYXJrZXJzO1xuICAgIHRoaXMuYXVkaW9VcmwgPSBvcHRzLmF1ZGlvVXJsO1xuICAgIHRoaXMuYm9sZElzQnJpZ2h0ID0gb3B0cy5ib2xkSXNCcmlnaHQgPz8gZmFsc2U7XG4gICAgdGhpcy5jb21tYW5kUXVldWUgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB0aGlzLm5lZWRzQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50SGFuZGxlcnMgPSBuZXcgTWFwKFtbXCJlbmRlZFwiLCBbXV0sIFtcImVycm9yZWRcIiwgW11dLCBbXCJpZGxlXCIsIFtdXSwgW1wiaW5wdXRcIiwgW11dLCBbXCJsb2FkaW5nXCIsIFtdXSwgW1wibWFya2VyXCIsIFtdXSwgW1wibWV0YWRhdGFcIiwgW11dLCBbXCJtdXRlZFwiLCBbXV0sIFtcIm9mZmxpbmVcIiwgW11dLCBbXCJwYXVzZVwiLCBbXV0sIFtcInBsYXlcIiwgW11dLCBbXCJwbGF5aW5nXCIsIFtdXSwgW1wicmVhZHlcIiwgW11dLCBbXCJzZWVrZWRcIiwgW11dLCBbXCJ2dFVwZGF0ZVwiLCBbXV1dKTtcbiAgfVxuICBhc3luYyBpbml0KCkge1xuICAgIHRoaXMud2FzbSA9IGF3YWl0IHZ0O1xuICAgIGNvbnN0IHtcbiAgICAgIG1lbW9yeVxuICAgIH0gPSBhd2FpdCB0aGlzLndhc20uZGVmYXVsdCgpO1xuICAgIHRoaXMubWVtb3J5ID0gbWVtb3J5O1xuICAgIHRoaXMuX2luaXRpYWxpemVWdCh0aGlzLmNvbHMgPz8gREVGQVVMVF9DT0xTLCB0aGlzLnJvd3MgPz8gREVGQVVMVF9ST1dTKTtcbiAgICBjb25zdCBmZWVkID0gdGhpcy5fZmVlZC5iaW5kKHRoaXMpO1xuICAgIGNvbnN0IG9uSW5wdXQgPSBkYXRhID0+IHtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJpbnB1dFwiLCB7XG4gICAgICAgIGRhdGFcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3Qgb25NYXJrZXIgPSBfcmVmNCA9PiB7XG4gICAgICBsZXQge1xuICAgICAgICBpbmRleCxcbiAgICAgICAgdGltZSxcbiAgICAgICAgbGFiZWxcbiAgICAgIH0gPSBfcmVmNDtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJtYXJrZXJcIiwge1xuICAgICAgICBpbmRleCxcbiAgICAgICAgdGltZSxcbiAgICAgICAgbGFiZWxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgcmVzZXQgPSB0aGlzLl9yZXNldFZ0LmJpbmQodGhpcyk7XG4gICAgY29uc3QgcmVzaXplID0gdGhpcy5fcmVzaXplVnQuYmluZCh0aGlzKTtcbiAgICBjb25zdCBzZXRTdGF0ZSA9IHRoaXMuX3NldFN0YXRlLmJpbmQodGhpcyk7XG4gICAgY29uc3QgcG9zdGVyVGltZSA9IHRoaXMucG9zdGVyLnR5cGUgPT09IFwibnB0XCIgJiYgIXRoaXMuYXV0b1BsYXkgPyB0aGlzLnBvc3Rlci52YWx1ZSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRyaXZlciA9IHRoaXMuZHJpdmVyKHtcbiAgICAgIGZlZWQsXG4gICAgICBvbklucHV0LFxuICAgICAgb25NYXJrZXIsXG4gICAgICByZXNldCxcbiAgICAgIHJlc2l6ZSxcbiAgICAgIHNldFN0YXRlLFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlclxuICAgIH0sIHtcbiAgICAgIGNvbHM6IHRoaXMuY29scyxcbiAgICAgIHJvd3M6IHRoaXMucm93cyxcbiAgICAgIHNwZWVkOiB0aGlzLnNwZWVkLFxuICAgICAgaWRsZVRpbWVMaW1pdDogdGhpcy5pZGxlVGltZUxpbWl0LFxuICAgICAgc3RhcnRBdDogdGhpcy5zdGFydEF0LFxuICAgICAgbG9vcDogdGhpcy5sb29wLFxuICAgICAgcG9zdGVyVGltZTogcG9zdGVyVGltZSxcbiAgICAgIG1hcmtlcnM6IHRoaXMubWFya2VycyxcbiAgICAgIHBhdXNlT25NYXJrZXJzOiB0aGlzLnBhdXNlT25NYXJrZXJzLFxuICAgICAgYXVkaW9Vcmw6IHRoaXMuYXVkaW9VcmxcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIHRoaXMuZHJpdmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZHJpdmVyID0ge1xuICAgICAgICBwbGF5OiB0aGlzLmRyaXZlclxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJlbG9hZCB8fCBwb3N0ZXJUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3dpdGhTdGF0ZShzdGF0ZSA9PiBzdGF0ZS5pbml0KCkpO1xuICAgIH1cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICBpc1BhdXNhYmxlOiAhIXRoaXMuZHJpdmVyLnBhdXNlLFxuICAgICAgaXNTZWVrYWJsZTogISF0aGlzLmRyaXZlci5zZWVrXG4gICAgfTtcbiAgICBpZiAodGhpcy5kcml2ZXIuaW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRyaXZlci5pbml0ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodGhpcy5kcml2ZXIucGF1c2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIucGF1c2UgPSAoKSA9PiB7fTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLnNlZWsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIuc2VlayA9IHdoZXJlID0+IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5kcml2ZXIuc3RlcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRyaXZlci5zdGVwID0gbiA9PiB7fTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLnN0b3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIuc3RvcCA9ICgpID0+IHt9O1xuICAgIH1cbiAgICBpZiAodGhpcy5kcml2ZXIucmVzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRyaXZlci5yZXN0YXJ0ID0gKCkgPT4ge307XG4gICAgfVxuICAgIGlmICh0aGlzLmRyaXZlci5tdXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZHJpdmVyLm11dGUgPSAoKSA9PiB7fTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLnVubXV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRyaXZlci51bm11dGUgPSAoKSA9PiB7fTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLmdldEN1cnJlbnRUaW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHBsYXkgPSB0aGlzLmRyaXZlci5wbGF5O1xuICAgICAgbGV0IGNsb2NrID0gbmV3IE51bGxDbG9jaygpO1xuICAgICAgdGhpcy5kcml2ZXIucGxheSA9ICgpID0+IHtcbiAgICAgICAgY2xvY2sgPSBuZXcgQ2xvY2sodGhpcy5zcGVlZCk7XG4gICAgICAgIHJldHVybiBwbGF5KCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5kcml2ZXIuZ2V0Q3VycmVudFRpbWUgPSAoKSA9PiBjbG9jay5nZXRUaW1lKCk7XG4gICAgfVxuICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJyZWFkeVwiLCBjb25maWcpO1xuICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICB0aGlzLnBsYXkoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zdGVyLnR5cGUgPT09IFwidGV4dFwiKSB7XG4gICAgICB0aGlzLl9mZWVkKHRoaXMucG9zdGVyLnZhbHVlKTtcbiAgICAgIHRoaXMubmVlZHNDbGVhciA9IHRydWU7XG4gICAgfVxuICB9XG4gIHBsYXkoKSB7XG4gICAgdGhpcy5fY2xlYXJJZk5lZWRlZCgpO1xuICAgIHJldHVybiB0aGlzLl93aXRoU3RhdGUoc3RhdGUgPT4gc3RhdGUucGxheSgpKTtcbiAgfVxuICBwYXVzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLnBhdXNlKCkpO1xuICB9XG4gIHRvZ2dsZVBsYXkoKSB7XG4gICAgdGhpcy5fY2xlYXJJZk5lZWRlZCgpO1xuICAgIHJldHVybiB0aGlzLl93aXRoU3RhdGUoc3RhdGUgPT4gc3RhdGUudG9nZ2xlUGxheSgpKTtcbiAgfVxuICBzZWVrKHdoZXJlKSB7XG4gICAgdGhpcy5fY2xlYXJJZk5lZWRlZCgpO1xuICAgIHJldHVybiB0aGlzLl93aXRoU3RhdGUoYXN5bmMgc3RhdGUgPT4ge1xuICAgICAgaWYgKGF3YWl0IHN0YXRlLnNlZWsod2hlcmUpKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJzZWVrZWRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgc3RlcChuKSB7XG4gICAgdGhpcy5fY2xlYXJJZk5lZWRlZCgpO1xuICAgIHJldHVybiB0aGlzLl93aXRoU3RhdGUoc3RhdGUgPT4gc3RhdGUuc3RlcChuKSk7XG4gIH1cbiAgc3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLnN0b3AoKSk7XG4gIH1cbiAgbXV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLm11dGUoKSk7XG4gIH1cbiAgdW5tdXRlKCkge1xuICAgIHJldHVybiB0aGlzLl93aXRoU3RhdGUoc3RhdGUgPT4gc3RhdGUudW5tdXRlKCkpO1xuICB9XG4gIGdldExpbmUobiwgY3Vyc29yT24pIHtcbiAgICByZXR1cm4gdGhpcy52dC5nZXRMaW5lKG4sIGN1cnNvck9uKTtcbiAgfVxuICBnZXREYXRhVmlldyhfcmVmNSwgc2l6ZSkge1xuICAgIGxldCBbcHRyLCBsZW5dID0gX3JlZjU7XG4gICAgcmV0dXJuIG5ldyBEYXRhVmlldyh0aGlzLm1lbW9yeS5idWZmZXIsIHB0ciwgbGVuICogc2l6ZSk7XG4gIH1cbiAgZ2V0VWludDMyQXJyYXkoX3JlZjYpIHtcbiAgICBsZXQgW3B0ciwgbGVuXSA9IF9yZWY2O1xuICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkodGhpcy5tZW1vcnkuYnVmZmVyLCBwdHIsIGxlbik7XG4gIH1cbiAgZ2V0Q3Vyc29yKCkge1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMudnQuZ2V0Q3Vyc29yKCk7XG4gICAgaWYgKGN1cnNvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29sOiBjdXJzb3JbMF0sXG4gICAgICAgIHJvdzogY3Vyc29yWzFdLFxuICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY29sOiAwLFxuICAgICAgcm93OiAwLFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9O1xuICB9XG4gIGdldEN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLmRyaXZlci5nZXRDdXJyZW50VGltZSgpO1xuICB9XG4gIGdldFJlbWFpbmluZ1RpbWUoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmR1cmF0aW9uID09PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5kdXJhdGlvbiAtIE1hdGgubWluKHRoaXMuZ2V0Q3VycmVudFRpbWUoKSwgdGhpcy5kdXJhdGlvbik7XG4gICAgfVxuICB9XG4gIGdldFByb2dyZXNzKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5kdXJhdGlvbiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMuZ2V0Q3VycmVudFRpbWUoKSwgdGhpcy5kdXJhdGlvbikgLyB0aGlzLmR1cmF0aW9uO1xuICAgIH1cbiAgfVxuICBnZXREdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kdXJhdGlvbjtcbiAgfVxuICBhZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgIHRoaXMuZXZlbnRIYW5kbGVycy5nZXQoZXZlbnROYW1lKS5wdXNoKGhhbmRsZXIpO1xuICB9XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmV2ZW50SGFuZGxlcnMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgaWYgKCFoYW5kbGVycykgcmV0dXJuO1xuICAgIGNvbnN0IGlkeCA9IGhhbmRsZXJzLmluZGV4T2YoaGFuZGxlcik7XG4gICAgaWYgKGlkeCAhPT0gLTEpIGhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuICB9XG4gIF9kaXNwYXRjaEV2ZW50KGV2ZW50TmFtZSkge1xuICAgIGxldCBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBmb3IgKGNvbnN0IGggb2YgdGhpcy5ldmVudEhhbmRsZXJzLmdldChldmVudE5hbWUpKSB7XG4gICAgICBoKGRhdGEpO1xuICAgIH1cbiAgfVxuICBfd2l0aFN0YXRlKGYpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5xdWV1ZUNvbW1hbmQoKCkgPT4gZih0aGlzLnN0YXRlKSk7XG4gIH1cbiAgX2VucXVldWVDb21tYW5kKGYpIHtcbiAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IHRoaXMuY29tbWFuZFF1ZXVlLnRoZW4oZik7XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZFF1ZXVlO1xuICB9XG4gIF9zZXRTdGF0ZShuZXdTdGF0ZSkge1xuICAgIGxldCBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBpZiAodGhpcy5zdGF0ZU5hbWUgPT09IG5ld1N0YXRlKSByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLnN0YXRlTmFtZSA9IG5ld1N0YXRlO1xuICAgIGlmIChuZXdTdGF0ZSA9PT0gXCJwbGF5aW5nXCIpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBuZXcgUGxheWluZ1N0YXRlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT09IFwiaWRsZVwiKSB7XG4gICAgICB0aGlzLnN0YXRlID0gbmV3IElkbGUodGhpcyk7XG4gICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBuZXcgTG9hZGluZ1N0YXRlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT09IFwiZW5kZWRcIikge1xuICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBFbmRlZFN0YXRlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT09IFwib2ZmbGluZVwiKSB7XG4gICAgICB0aGlzLnN0YXRlID0gbmV3IE9mZmxpbmVTdGF0ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09PSBcImVycm9yZWRcIikge1xuICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBFcnJvcmVkU3RhdGUodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBzdGF0ZTogJHtuZXdTdGF0ZX1gKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5vbkVudGVyKGRhdGEpO1xuICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICB9XG4gIF9mZWVkKGRhdGEpIHtcbiAgICBjb25zdCBjaGFuZ2VkUm93cyA9IHRoaXMudnQuZmVlZChkYXRhKTtcbiAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwidnRVcGRhdGVcIiwge1xuICAgICAgY2hhbmdlZFJvd3NcbiAgICB9KTtcbiAgfVxuICBhc3luYyBfaW5pdGlhbGl6ZURyaXZlcigpIHtcbiAgICBjb25zdCBtZXRhID0gYXdhaXQgdGhpcy5kcml2ZXIuaW5pdCgpO1xuICAgIHRoaXMuY29scyA9IHRoaXMuY29scyA/PyBtZXRhLmNvbHMgPz8gREVGQVVMVF9DT0xTO1xuICAgIHRoaXMucm93cyA9IHRoaXMucm93cyA/PyBtZXRhLnJvd3MgPz8gREVGQVVMVF9ST1dTO1xuICAgIHRoaXMuZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uID8/IG1ldGEuZHVyYXRpb247XG4gICAgdGhpcy5tYXJrZXJzID0gdGhpcy5fbm9ybWFsaXplTWFya2VycyhtZXRhLm1hcmtlcnMpID8/IHRoaXMubWFya2VycyA/PyBbXTtcbiAgICBpZiAodGhpcy5jb2xzID09PSAwKSB7XG4gICAgICB0aGlzLmNvbHMgPSBERUZBVUxUX0NPTFM7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvd3MgPT09IDApIHtcbiAgICAgIHRoaXMucm93cyA9IERFRkFVTFRfUk9XUztcbiAgICB9XG4gICAgdGhpcy5faW5pdGlhbGl6ZVZ0KHRoaXMuY29scywgdGhpcy5yb3dzKTtcbiAgICBpZiAobWV0YS5wb3N0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbWV0YS5wb3N0ZXIuZm9yRWFjaCh0ZXh0ID0+IHRoaXMudnQuZmVlZCh0ZXh0KSk7XG4gICAgICB0aGlzLm5lZWRzQ2xlYXIgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wb3N0ZXIudHlwZSA9PT0gXCJ0ZXh0XCIpIHtcbiAgICAgIHRoaXMudnQuZmVlZCh0aGlzLnBvc3Rlci52YWx1ZSk7XG4gICAgICB0aGlzLm5lZWRzQ2xlYXIgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwibWV0YWRhdGFcIiwge1xuICAgICAgc2l6ZToge1xuICAgICAgICBjb2xzOiB0aGlzLmNvbHMsXG4gICAgICAgIHJvd3M6IHRoaXMucm93c1xuICAgICAgfSxcbiAgICAgIHRoZW1lOiBtZXRhLnRoZW1lID8/IG51bGwsXG4gICAgICBkdXJhdGlvbjogdGhpcy5kdXJhdGlvbixcbiAgICAgIG1hcmtlcnM6IHRoaXMubWFya2VycyxcbiAgICAgIGhhc0F1ZGlvOiBtZXRhLmhhc0F1ZGlvXG4gICAgfSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hFdmVudChcInZ0VXBkYXRlXCIsIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgY29sczogdGhpcy5jb2xzLFxuICAgICAgICByb3dzOiB0aGlzLnJvd3NcbiAgICAgIH0sXG4gICAgICB0aGVtZTogbWV0YS50aGVtZSA/PyBudWxsLFxuICAgICAgY2hhbmdlZFJvd3M6IEFycmF5LmZyb20oe1xuICAgICAgICBsZW5ndGg6IHRoaXMucm93c1xuICAgICAgfSwgKF8sIGkpID0+IGkpXG4gICAgfSk7XG4gIH1cbiAgX2NsZWFySWZOZWVkZWQoKSB7XG4gICAgaWYgKHRoaXMubmVlZHNDbGVhcikge1xuICAgICAgdGhpcy5fZmVlZCgnXFx4MWJjJyk7XG4gICAgICB0aGlzLm5lZWRzQ2xlYXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgX3Jlc2V0VnQoY29scywgcm93cykge1xuICAgIGxldCBpbml0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gICAgbGV0IHRoZW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoYGNvcmU6IHZ0IHJlc2V0ICgke2NvbHN9eCR7cm93c30pYCk7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuX2luaXRpYWxpemVWdChjb2xzLCByb3dzKTtcbiAgICBpZiAoaW5pdCAhPT0gdW5kZWZpbmVkICYmIGluaXQgIT09IFwiXCIpIHtcbiAgICAgIHRoaXMudnQuZmVlZChpbml0KTtcbiAgICB9XG4gICAgdGhpcy5fZGlzcGF0Y2hFdmVudChcIm1ldGFkYXRhXCIsIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgY29scyxcbiAgICAgICAgcm93c1xuICAgICAgfSxcbiAgICAgIHRoZW1lOiB0aGVtZSA/PyBudWxsXG4gICAgfSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hFdmVudChcInZ0VXBkYXRlXCIsIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgY29scyxcbiAgICAgICAgcm93c1xuICAgICAgfSxcbiAgICAgIHRoZW1lOiB0aGVtZSA/PyBudWxsLFxuICAgICAgY2hhbmdlZFJvd3M6IEFycmF5LmZyb20oe1xuICAgICAgICBsZW5ndGg6IHJvd3NcbiAgICAgIH0sIChfLCBpKSA9PiBpKVxuICAgIH0pO1xuICB9XG4gIF9yZXNpemVWdChjb2xzLCByb3dzKSB7XG4gICAgaWYgKGNvbHMgPT09IHRoaXMudnQuY29scyAmJiByb3dzID09PSB0aGlzLnZ0LnJvd3MpIHJldHVybjtcbiAgICBjb25zdCBjaGFuZ2VkUm93cyA9IHRoaXMudnQucmVzaXplKGNvbHMsIHJvd3MpO1xuICAgIHRoaXMudnQuY29scyA9IGNvbHM7XG4gICAgdGhpcy52dC5yb3dzID0gcm93cztcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgY29yZTogdnQgcmVzaXplICgke2NvbHN9eCR7cm93c30pYCk7XG4gICAgdGhpcy5fZGlzcGF0Y2hFdmVudChcIm1ldGFkYXRhXCIsIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgY29scyxcbiAgICAgICAgcm93c1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJ2dFVwZGF0ZVwiLCB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIGNvbHMsXG4gICAgICAgIHJvd3NcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkUm93c1xuICAgIH0pO1xuICB9XG4gIF9pbml0aWFsaXplVnQoY29scywgcm93cykge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCd2dCBpbml0Jywge1xuICAgICAgY29scyxcbiAgICAgIHJvd3NcbiAgICB9KTtcbiAgICB0aGlzLnZ0ID0gdGhpcy53YXNtLmNyZWF0ZShjb2xzLCByb3dzLCAxMDAsIHRoaXMuYm9sZElzQnJpZ2h0KTtcbiAgICB0aGlzLnZ0LmNvbHMgPSBjb2xzO1xuICAgIHRoaXMudnQucm93cyA9IHJvd3M7XG4gIH1cbiAgX3BhcnNlUG9zdGVyKHBvc3Rlcikge1xuICAgIGlmICh0eXBlb2YgcG9zdGVyICE9PSBcInN0cmluZ1wiKSByZXR1cm4ge307XG4gICAgaWYgKHBvc3Rlci5zdWJzdHJpbmcoMCwgMTYpID09IFwiZGF0YTp0ZXh0L3BsYWluLFwiKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgdmFsdWU6IHBvc3Rlci5zdWJzdHJpbmcoMTYpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAocG9zdGVyLnN1YnN0cmluZygwLCA0KSA9PSBcIm5wdDpcIikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJucHRcIixcbiAgICAgICAgdmFsdWU6IHBhcnNlTnB0KHBvc3Rlci5zdWJzdHJpbmcoNCkpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cbiAgX25vcm1hbGl6ZU1hcmtlcnMobWFya2Vycykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1hcmtlcnMpKSB7XG4gICAgICByZXR1cm4gbWFya2Vycy5tYXAobSA9PiB0eXBlb2YgbSA9PT0gXCJudW1iZXJcIiA/IFttLCBcIlwiXSA6IG0pO1xuICAgIH1cbiAgfVxufVxuY29uc3QgRFJJVkVSUyA9IG5ldyBNYXAoW1tcImJlbmNobWFya1wiLCBiZW5jaG1hcmtdLCBbXCJjbG9ja1wiLCBjbG9ja10sIFtcImV2ZW50c291cmNlXCIsIGV2ZW50c291cmNlXSwgW1wicmFuZG9tXCIsIHJhbmRvbV0sIFtcInJlY29yZGluZ1wiLCByZWNvcmRpbmddLCBbXCJ3ZWJzb2NrZXRcIiwgd2Vic29ja2V0XV0pO1xuY29uc3QgUEFSU0VSUyA9IG5ldyBNYXAoW1tcImFzY2lpY2FzdFwiLCBwYXJzZSQyXSwgW1widHlwZXNjcmlwdFwiLCBwYXJzZSQxXSwgW1widHR5cmVjXCIsIHBhcnNlXV0pO1xuZnVuY3Rpb24gZ2V0RHJpdmVyKHNyYykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gc3JjO1xuICBpZiAodHlwZW9mIHNyYyA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmIChzcmMuc3Vic3RyaW5nKDAsIDUpID09IFwid3M6Ly9cIiB8fCBzcmMuc3Vic3RyaW5nKDAsIDYpID09IFwid3NzOi8vXCIpIHtcbiAgICAgIHNyYyA9IHtcbiAgICAgICAgZHJpdmVyOiBcIndlYnNvY2tldFwiLFxuICAgICAgICB1cmw6IHNyY1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHNyYy5zdWJzdHJpbmcoMCwgNikgPT0gXCJjbG9jazpcIikge1xuICAgICAgc3JjID0ge1xuICAgICAgICBkcml2ZXI6IFwiY2xvY2tcIlxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHNyYy5zdWJzdHJpbmcoMCwgNykgPT0gXCJyYW5kb206XCIpIHtcbiAgICAgIHNyYyA9IHtcbiAgICAgICAgZHJpdmVyOiBcInJhbmRvbVwiXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoc3JjLnN1YnN0cmluZygwLCAxMCkgPT0gXCJiZW5jaG1hcms6XCIpIHtcbiAgICAgIHNyYyA9IHtcbiAgICAgICAgZHJpdmVyOiBcImJlbmNobWFya1wiLFxuICAgICAgICB1cmw6IHNyYy5zdWJzdHJpbmcoMTApXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzcmMgPSB7XG4gICAgICAgIGRyaXZlcjogXCJyZWNvcmRpbmdcIixcbiAgICAgICAgdXJsOiBzcmNcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChzcmMuZHJpdmVyID09PSB1bmRlZmluZWQpIHtcbiAgICBzcmMuZHJpdmVyID0gXCJyZWNvcmRpbmdcIjtcbiAgfVxuICBpZiAoc3JjLmRyaXZlciA9PSBcInJlY29yZGluZ1wiKSB7XG4gICAgaWYgKHNyYy5wYXJzZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3JjLnBhcnNlciA9IFwiYXNjaWljYXN0XCI7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjLnBhcnNlciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKFBBUlNFUlMuaGFzKHNyYy5wYXJzZXIpKSB7XG4gICAgICAgIHNyYy5wYXJzZXIgPSBQQVJTRVJTLmdldChzcmMucGFyc2VyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBwYXJzZXI6ICR7c3JjLnBhcnNlcn1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKERSSVZFUlMuaGFzKHNyYy5kcml2ZXIpKSB7XG4gICAgY29uc3QgZHJpdmVyID0gRFJJVkVSUy5nZXQoc3JjLmRyaXZlcik7XG4gICAgcmV0dXJuIChjYWxsYmFja3MsIG9wdHMpID0+IGRyaXZlcihzcmMsIGNhbGxiYWNrcywgb3B0cyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBkcml2ZXI6ICR7SlNPTi5zdHJpbmdpZnkoc3JjKX1gKTtcbiAgfVxufVxuXG5leHBvcnQgeyBDb3JlIGFzIEMgfTtcbiIsICJpbXBvcnQgeyBoIGFzIGhleFRvT2tsYWIsIGwgYXMgbGVycE9rbGFiLCBvIGFzIG9rbGFiVG9IZXgsIG4gYXMgbm9ybWFsaXplSGV4Q29sb3IsIHQgYXMgdGhyb3R0bGUsIGQgYXMgZGVib3VuY2UgfSBmcm9tICcuL2xvZ2dpbmctLVAwQ3NFdV8uanMnO1xuXG5jb25zdCBJU19ERVYgPSBmYWxzZTtcbmNvbnN0IGVxdWFsRm4gPSAoYSwgYikgPT4gYSA9PT0gYjtcbmNvbnN0ICRQUk9YWSA9IFN5bWJvbChcInNvbGlkLXByb3h5XCIpO1xuY29uc3QgJFRSQUNLID0gU3ltYm9sKFwic29saWQtdHJhY2tcIik7XG5jb25zdCBzaWduYWxPcHRpb25zID0ge1xuICBlcXVhbHM6IGVxdWFsRm5cbn07XG5sZXQgcnVuRWZmZWN0cyA9IHJ1blF1ZXVlO1xuY29uc3QgU1RBTEUgPSAxO1xuY29uc3QgUEVORElORyA9IDI7XG5jb25zdCBVTk9XTkVEID0ge1xuICBvd25lZDogbnVsbCxcbiAgY2xlYW51cHM6IG51bGwsXG4gIGNvbnRleHQ6IG51bGwsXG4gIG93bmVyOiBudWxsXG59O1xudmFyIE93bmVyID0gbnVsbDtcbmxldCBUcmFuc2l0aW9uJDEgPSBudWxsO1xubGV0IEV4dGVybmFsU291cmNlQ29uZmlnID0gbnVsbDtcbmxldCBMaXN0ZW5lciA9IG51bGw7XG5sZXQgVXBkYXRlcyA9IG51bGw7XG5sZXQgRWZmZWN0cyA9IG51bGw7XG5sZXQgRXhlY0NvdW50ID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZVJvb3QoZm4sIGRldGFjaGVkT3duZXIpIHtcbiAgY29uc3QgbGlzdGVuZXIgPSBMaXN0ZW5lcixcbiAgICBvd25lciA9IE93bmVyLFxuICAgIHVub3duZWQgPSBmbi5sZW5ndGggPT09IDAsXG4gICAgY3VycmVudCA9IGRldGFjaGVkT3duZXIgPT09IHVuZGVmaW5lZCA/IG93bmVyIDogZGV0YWNoZWRPd25lcixcbiAgICByb290ID0gdW5vd25lZFxuICAgICAgPyBVTk9XTkVEXG4gICAgICA6IHtcbiAgICAgICAgICBvd25lZDogbnVsbCxcbiAgICAgICAgICBjbGVhbnVwczogbnVsbCxcbiAgICAgICAgICBjb250ZXh0OiBjdXJyZW50ID8gY3VycmVudC5jb250ZXh0IDogbnVsbCxcbiAgICAgICAgICBvd25lcjogY3VycmVudFxuICAgICAgICB9LFxuICAgIHVwZGF0ZUZuID0gdW5vd25lZCA/IGZuIDogKCkgPT4gZm4oKCkgPT4gdW50cmFjaygoKSA9PiBjbGVhbk5vZGUocm9vdCkpKTtcbiAgT3duZXIgPSByb290O1xuICBMaXN0ZW5lciA9IG51bGw7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJ1blVwZGF0ZXModXBkYXRlRm4sIHRydWUpO1xuICB9IGZpbmFsbHkge1xuICAgIExpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgT3duZXIgPSBvd25lcjtcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlU2lnbmFsKHZhbHVlLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zID8gT2JqZWN0LmFzc2lnbih7fSwgc2lnbmFsT3B0aW9ucywgb3B0aW9ucykgOiBzaWduYWxPcHRpb25zO1xuICBjb25zdCBzID0ge1xuICAgIHZhbHVlLFxuICAgIG9ic2VydmVyczogbnVsbCxcbiAgICBvYnNlcnZlclNsb3RzOiBudWxsLFxuICAgIGNvbXBhcmF0b3I6IG9wdGlvbnMuZXF1YWxzIHx8IHVuZGVmaW5lZFxuICB9O1xuICBjb25zdCBzZXR0ZXIgPSB2YWx1ZSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlKHMudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gd3JpdGVTaWduYWwocywgdmFsdWUpO1xuICB9O1xuICByZXR1cm4gW3JlYWRTaWduYWwuYmluZChzKSwgc2V0dGVyXTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNvbXB1dGVkKGZuLCB2YWx1ZSwgb3B0aW9ucykge1xuICBjb25zdCBjID0gY3JlYXRlQ29tcHV0YXRpb24oZm4sIHZhbHVlLCB0cnVlLCBTVEFMRSk7XG4gIHVwZGF0ZUNvbXB1dGF0aW9uKGMpO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVuZGVyRWZmZWN0KGZuLCB2YWx1ZSwgb3B0aW9ucykge1xuICBjb25zdCBjID0gY3JlYXRlQ29tcHV0YXRpb24oZm4sIHZhbHVlLCBmYWxzZSwgU1RBTEUpO1xuICB1cGRhdGVDb21wdXRhdGlvbihjKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUVmZmVjdChmbiwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgcnVuRWZmZWN0cyA9IHJ1blVzZXJFZmZlY3RzO1xuICBjb25zdCBjID0gY3JlYXRlQ29tcHV0YXRpb24oZm4sIHZhbHVlLCBmYWxzZSwgU1RBTEUpO1xuICBjLnVzZXIgPSB0cnVlO1xuICBFZmZlY3RzID8gRWZmZWN0cy5wdXNoKGMpIDogdXBkYXRlQ29tcHV0YXRpb24oYyk7XG59XG5mdW5jdGlvbiBjcmVhdGVNZW1vKGZuLCB2YWx1ZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIHNpZ25hbE9wdGlvbnMsIG9wdGlvbnMpIDogc2lnbmFsT3B0aW9ucztcbiAgY29uc3QgYyA9IGNyZWF0ZUNvbXB1dGF0aW9uKGZuLCB2YWx1ZSwgdHJ1ZSwgMCk7XG4gIGMub2JzZXJ2ZXJzID0gbnVsbDtcbiAgYy5vYnNlcnZlclNsb3RzID0gbnVsbDtcbiAgYy5jb21wYXJhdG9yID0gb3B0aW9ucy5lcXVhbHMgfHwgdW5kZWZpbmVkO1xuICB1cGRhdGVDb21wdXRhdGlvbihjKTtcbiAgcmV0dXJuIHJlYWRTaWduYWwuYmluZChjKTtcbn1cbmZ1bmN0aW9uIGJhdGNoKGZuKSB7XG4gIHJldHVybiBydW5VcGRhdGVzKGZuLCBmYWxzZSk7XG59XG5mdW5jdGlvbiB1bnRyYWNrKGZuKSB7XG4gIGlmIChMaXN0ZW5lciA9PT0gbnVsbCkgcmV0dXJuIGZuKCk7XG4gIGNvbnN0IGxpc3RlbmVyID0gTGlzdGVuZXI7XG4gIExpc3RlbmVyID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBpZiAoRXh0ZXJuYWxTb3VyY2VDb25maWcpIDtcbiAgICByZXR1cm4gZm4oKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICB9XG59XG5mdW5jdGlvbiBvbk1vdW50KGZuKSB7XG4gIGNyZWF0ZUVmZmVjdCgoKSA9PiB1bnRyYWNrKGZuKSk7XG59XG5mdW5jdGlvbiBvbkNsZWFudXAoZm4pIHtcbiAgaWYgKE93bmVyID09PSBudWxsKTtcbiAgZWxzZSBpZiAoT3duZXIuY2xlYW51cHMgPT09IG51bGwpIE93bmVyLmNsZWFudXBzID0gW2ZuXTtcbiAgZWxzZSBPd25lci5jbGVhbnVwcy5wdXNoKGZuKTtcbiAgcmV0dXJuIGZuO1xufVxuZnVuY3Rpb24gZ2V0TGlzdGVuZXIoKSB7XG4gIHJldHVybiBMaXN0ZW5lcjtcbn1cbmZ1bmN0aW9uIHN0YXJ0VHJhbnNpdGlvbihmbikge1xuICBjb25zdCBsID0gTGlzdGVuZXI7XG4gIGNvbnN0IG8gPSBPd25lcjtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgIExpc3RlbmVyID0gbDtcbiAgICBPd25lciA9IG87XG4gICAgbGV0IHQ7XG4gICAgcnVuVXBkYXRlcyhmbiwgZmFsc2UpO1xuICAgIExpc3RlbmVyID0gT3duZXIgPSBudWxsO1xuICAgIHJldHVybiB0ID8gdC5kb25lIDogdW5kZWZpbmVkO1xuICB9KTtcbn1cbmNvbnN0IFt0cmFuc1BlbmRpbmcsIHNldFRyYW5zUGVuZGluZ10gPSAvKkBfX1BVUkVfXyovIGNyZWF0ZVNpZ25hbChmYWxzZSk7XG5mdW5jdGlvbiB1c2VUcmFuc2l0aW9uKCkge1xuICByZXR1cm4gW3RyYW5zUGVuZGluZywgc3RhcnRUcmFuc2l0aW9uXTtcbn1cbmZ1bmN0aW9uIGNoaWxkcmVuKGZuKSB7XG4gIGNvbnN0IGNoaWxkcmVuID0gY3JlYXRlTWVtbyhmbik7XG4gIGNvbnN0IG1lbW8gPSBjcmVhdGVNZW1vKCgpID0+IHJlc29sdmVDaGlsZHJlbihjaGlsZHJlbigpKSk7XG4gIG1lbW8udG9BcnJheSA9ICgpID0+IHtcbiAgICBjb25zdCBjID0gbWVtbygpO1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGMpID8gYyA6IGMgIT0gbnVsbCA/IFtjXSA6IFtdO1xuICB9O1xuICByZXR1cm4gbWVtbztcbn1cbmZ1bmN0aW9uIHJlYWRTaWduYWwoKSB7XG4gIGlmICh0aGlzLnNvdXJjZXMgJiYgKHRoaXMuc3RhdGUpKSB7XG4gICAgaWYgKCh0aGlzLnN0YXRlKSA9PT0gU1RBTEUpIHVwZGF0ZUNvbXB1dGF0aW9uKHRoaXMpO1xuICAgIGVsc2Uge1xuICAgICAgY29uc3QgdXBkYXRlcyA9IFVwZGF0ZXM7XG4gICAgICBVcGRhdGVzID0gbnVsbDtcbiAgICAgIHJ1blVwZGF0ZXMoKCkgPT4gbG9va1Vwc3RyZWFtKHRoaXMpLCBmYWxzZSk7XG4gICAgICBVcGRhdGVzID0gdXBkYXRlcztcbiAgICB9XG4gIH1cbiAgaWYgKExpc3RlbmVyKSB7XG4gICAgY29uc3Qgc1Nsb3QgPSB0aGlzLm9ic2VydmVycyA/IHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA6IDA7XG4gICAgaWYgKCFMaXN0ZW5lci5zb3VyY2VzKSB7XG4gICAgICBMaXN0ZW5lci5zb3VyY2VzID0gW3RoaXNdO1xuICAgICAgTGlzdGVuZXIuc291cmNlU2xvdHMgPSBbc1Nsb3RdO1xuICAgIH0gZWxzZSB7XG4gICAgICBMaXN0ZW5lci5zb3VyY2VzLnB1c2godGhpcyk7XG4gICAgICBMaXN0ZW5lci5zb3VyY2VTbG90cy5wdXNoKHNTbG90KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm9ic2VydmVycykge1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbTGlzdGVuZXJdO1xuICAgICAgdGhpcy5vYnNlcnZlclNsb3RzID0gW0xpc3RlbmVyLnNvdXJjZXMubGVuZ3RoIC0gMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goTGlzdGVuZXIpO1xuICAgICAgdGhpcy5vYnNlcnZlclNsb3RzLnB1c2goTGlzdGVuZXIuc291cmNlcy5sZW5ndGggLSAxKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXMudmFsdWU7XG59XG5mdW5jdGlvbiB3cml0ZVNpZ25hbChub2RlLCB2YWx1ZSwgaXNDb21wKSB7XG4gIGxldCBjdXJyZW50ID1cbiAgICBub2RlLnZhbHVlO1xuICBpZiAoIW5vZGUuY29tcGFyYXRvciB8fCAhbm9kZS5jb21wYXJhdG9yKGN1cnJlbnQsIHZhbHVlKSkge1xuICAgIG5vZGUudmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAobm9kZS5vYnNlcnZlcnMgJiYgbm9kZS5vYnNlcnZlcnMubGVuZ3RoKSB7XG4gICAgICBydW5VcGRhdGVzKCgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLm9ic2VydmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGNvbnN0IG8gPSBub2RlLm9ic2VydmVyc1tpXTtcbiAgICAgICAgICBjb25zdCBUcmFuc2l0aW9uUnVubmluZyA9IFRyYW5zaXRpb24kMSAmJiBUcmFuc2l0aW9uJDEucnVubmluZztcbiAgICAgICAgICBpZiAoVHJhbnNpdGlvblJ1bm5pbmcgJiYgVHJhbnNpdGlvbiQxLmRpc3Bvc2VkLmhhcyhvKSkgO1xuICAgICAgICAgIGlmIChUcmFuc2l0aW9uUnVubmluZyA/ICFvLnRTdGF0ZSA6ICFvLnN0YXRlKSB7XG4gICAgICAgICAgICBpZiAoby5wdXJlKSBVcGRhdGVzLnB1c2gobyk7XG4gICAgICAgICAgICBlbHNlIEVmZmVjdHMucHVzaChvKTtcbiAgICAgICAgICAgIGlmIChvLm9ic2VydmVycykgbWFya0Rvd25zdHJlYW0obyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghVHJhbnNpdGlvblJ1bm5pbmcpIG8uc3RhdGUgPSBTVEFMRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVXBkYXRlcy5sZW5ndGggPiAxMGU1KSB7XG4gICAgICAgICAgVXBkYXRlcyA9IFtdO1xuICAgICAgICAgIGlmIChJU19ERVYpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNvbXB1dGF0aW9uKG5vZGUpIHtcbiAgaWYgKCFub2RlLmZuKSByZXR1cm47XG4gIGNsZWFuTm9kZShub2RlKTtcbiAgY29uc3QgdGltZSA9IEV4ZWNDb3VudDtcbiAgcnVuQ29tcHV0YXRpb24oXG4gICAgbm9kZSxcbiAgICBub2RlLnZhbHVlLFxuICAgIHRpbWVcbiAgKTtcbn1cbmZ1bmN0aW9uIHJ1bkNvbXB1dGF0aW9uKG5vZGUsIHZhbHVlLCB0aW1lKSB7XG4gIGxldCBuZXh0VmFsdWU7XG4gIGNvbnN0IG93bmVyID0gT3duZXIsXG4gICAgbGlzdGVuZXIgPSBMaXN0ZW5lcjtcbiAgTGlzdGVuZXIgPSBPd25lciA9IG5vZGU7XG4gIHRyeSB7XG4gICAgbmV4dFZhbHVlID0gbm9kZS5mbih2YWx1ZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChub2RlLnB1cmUpIHtcbiAgICAgIHtcbiAgICAgICAgbm9kZS5zdGF0ZSA9IFNUQUxFO1xuICAgICAgICBub2RlLm93bmVkICYmIG5vZGUub3duZWQuZm9yRWFjaChjbGVhbk5vZGUpO1xuICAgICAgICBub2RlLm93bmVkID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbm9kZS51cGRhdGVkQXQgPSB0aW1lICsgMTtcbiAgICByZXR1cm4gaGFuZGxlRXJyb3IoZXJyKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIE93bmVyID0gb3duZXI7XG4gIH1cbiAgaWYgKCFub2RlLnVwZGF0ZWRBdCB8fCBub2RlLnVwZGF0ZWRBdCA8PSB0aW1lKSB7XG4gICAgaWYgKG5vZGUudXBkYXRlZEF0ICE9IG51bGwgJiYgXCJvYnNlcnZlcnNcIiBpbiBub2RlKSB7XG4gICAgICB3cml0ZVNpZ25hbChub2RlLCBuZXh0VmFsdWUpO1xuICAgIH0gZWxzZSBub2RlLnZhbHVlID0gbmV4dFZhbHVlO1xuICAgIG5vZGUudXBkYXRlZEF0ID0gdGltZTtcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlQ29tcHV0YXRpb24oZm4sIGluaXQsIHB1cmUsIHN0YXRlID0gU1RBTEUsIG9wdGlvbnMpIHtcbiAgY29uc3QgYyA9IHtcbiAgICBmbixcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgdXBkYXRlZEF0OiBudWxsLFxuICAgIG93bmVkOiBudWxsLFxuICAgIHNvdXJjZXM6IG51bGwsXG4gICAgc291cmNlU2xvdHM6IG51bGwsXG4gICAgY2xlYW51cHM6IG51bGwsXG4gICAgdmFsdWU6IGluaXQsXG4gICAgb3duZXI6IE93bmVyLFxuICAgIGNvbnRleHQ6IE93bmVyID8gT3duZXIuY29udGV4dCA6IG51bGwsXG4gICAgcHVyZVxuICB9O1xuICBpZiAoT3duZXIgPT09IG51bGwpO1xuICBlbHNlIGlmIChPd25lciAhPT0gVU5PV05FRCkge1xuICAgIHtcbiAgICAgIGlmICghT3duZXIub3duZWQpIE93bmVyLm93bmVkID0gW2NdO1xuICAgICAgZWxzZSBPd25lci5vd25lZC5wdXNoKGMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYztcbn1cbmZ1bmN0aW9uIHJ1blRvcChub2RlKSB7XG4gIGlmICgobm9kZS5zdGF0ZSkgPT09IDApIHJldHVybjtcbiAgaWYgKChub2RlLnN0YXRlKSA9PT0gUEVORElORykgcmV0dXJuIGxvb2tVcHN0cmVhbShub2RlKTtcbiAgaWYgKG5vZGUuc3VzcGVuc2UgJiYgdW50cmFjayhub2RlLnN1c3BlbnNlLmluRmFsbGJhY2spKSByZXR1cm4gbm9kZS5zdXNwZW5zZS5lZmZlY3RzLnB1c2gobm9kZSk7XG4gIGNvbnN0IGFuY2VzdG9ycyA9IFtub2RlXTtcbiAgd2hpbGUgKChub2RlID0gbm9kZS5vd25lcikgJiYgKCFub2RlLnVwZGF0ZWRBdCB8fCBub2RlLnVwZGF0ZWRBdCA8IEV4ZWNDb3VudCkpIHtcbiAgICBpZiAobm9kZS5zdGF0ZSkgYW5jZXN0b3JzLnB1c2gobm9kZSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IGFuY2VzdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIG5vZGUgPSBhbmNlc3RvcnNbaV07XG4gICAgaWYgKChub2RlLnN0YXRlKSA9PT0gU1RBTEUpIHtcbiAgICAgIHVwZGF0ZUNvbXB1dGF0aW9uKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAoKG5vZGUuc3RhdGUpID09PSBQRU5ESU5HKSB7XG4gICAgICBjb25zdCB1cGRhdGVzID0gVXBkYXRlcztcbiAgICAgIFVwZGF0ZXMgPSBudWxsO1xuICAgICAgcnVuVXBkYXRlcygoKSA9PiBsb29rVXBzdHJlYW0obm9kZSwgYW5jZXN0b3JzWzBdKSwgZmFsc2UpO1xuICAgICAgVXBkYXRlcyA9IHVwZGF0ZXM7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBydW5VcGRhdGVzKGZuLCBpbml0KSB7XG4gIGlmIChVcGRhdGVzKSByZXR1cm4gZm4oKTtcbiAgbGV0IHdhaXQgPSBmYWxzZTtcbiAgaWYgKCFpbml0KSBVcGRhdGVzID0gW107XG4gIGlmIChFZmZlY3RzKSB3YWl0ID0gdHJ1ZTtcbiAgZWxzZSBFZmZlY3RzID0gW107XG4gIEV4ZWNDb3VudCsrO1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGZuKCk7XG4gICAgY29tcGxldGVVcGRhdGVzKHdhaXQpO1xuICAgIHJldHVybiByZXM7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmICghd2FpdCkgRWZmZWN0cyA9IG51bGw7XG4gICAgVXBkYXRlcyA9IG51bGw7XG4gICAgaGFuZGxlRXJyb3IoZXJyKTtcbiAgfVxufVxuZnVuY3Rpb24gY29tcGxldGVVcGRhdGVzKHdhaXQpIHtcbiAgaWYgKFVwZGF0ZXMpIHtcbiAgICBydW5RdWV1ZShVcGRhdGVzKTtcbiAgICBVcGRhdGVzID0gbnVsbDtcbiAgfVxuICBpZiAod2FpdCkgcmV0dXJuO1xuICBjb25zdCBlID0gRWZmZWN0cztcbiAgRWZmZWN0cyA9IG51bGw7XG4gIGlmIChlLmxlbmd0aCkgcnVuVXBkYXRlcygoKSA9PiBydW5FZmZlY3RzKGUpLCBmYWxzZSk7XG59XG5mdW5jdGlvbiBydW5RdWV1ZShxdWV1ZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSBydW5Ub3AocXVldWVbaV0pO1xufVxuZnVuY3Rpb24gcnVuVXNlckVmZmVjdHMocXVldWUpIHtcbiAgbGV0IGksXG4gICAgdXNlckxlbmd0aCA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGUgPSBxdWV1ZVtpXTtcbiAgICBpZiAoIWUudXNlcikgcnVuVG9wKGUpO1xuICAgIGVsc2UgcXVldWVbdXNlckxlbmd0aCsrXSA9IGU7XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IHVzZXJMZW5ndGg7IGkrKykgcnVuVG9wKHF1ZXVlW2ldKTtcbn1cbmZ1bmN0aW9uIGxvb2tVcHN0cmVhbShub2RlLCBpZ25vcmUpIHtcbiAgbm9kZS5zdGF0ZSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5zb3VyY2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3Qgc291cmNlID0gbm9kZS5zb3VyY2VzW2ldO1xuICAgIGlmIChzb3VyY2Uuc291cmNlcykge1xuICAgICAgY29uc3Qgc3RhdGUgPSBzb3VyY2Uuc3RhdGU7XG4gICAgICBpZiAoc3RhdGUgPT09IFNUQUxFKSB7XG4gICAgICAgIGlmIChzb3VyY2UgIT09IGlnbm9yZSAmJiAoIXNvdXJjZS51cGRhdGVkQXQgfHwgc291cmNlLnVwZGF0ZWRBdCA8IEV4ZWNDb3VudCkpXG4gICAgICAgICAgcnVuVG9wKHNvdXJjZSk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBQRU5ESU5HKSBsb29rVXBzdHJlYW0oc291cmNlLCBpZ25vcmUpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gbWFya0Rvd25zdHJlYW0obm9kZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUub2JzZXJ2ZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgbyA9IG5vZGUub2JzZXJ2ZXJzW2ldO1xuICAgIGlmICghby5zdGF0ZSkge1xuICAgICAgby5zdGF0ZSA9IFBFTkRJTkc7XG4gICAgICBpZiAoby5wdXJlKSBVcGRhdGVzLnB1c2gobyk7XG4gICAgICBlbHNlIEVmZmVjdHMucHVzaChvKTtcbiAgICAgIG8ub2JzZXJ2ZXJzICYmIG1hcmtEb3duc3RyZWFtKG8pO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gY2xlYW5Ob2RlKG5vZGUpIHtcbiAgbGV0IGk7XG4gIGlmIChub2RlLnNvdXJjZXMpIHtcbiAgICB3aGlsZSAobm9kZS5zb3VyY2VzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc291cmNlID0gbm9kZS5zb3VyY2VzLnBvcCgpLFxuICAgICAgICBpbmRleCA9IG5vZGUuc291cmNlU2xvdHMucG9wKCksXG4gICAgICAgIG9icyA9IHNvdXJjZS5vYnNlcnZlcnM7XG4gICAgICBpZiAob2JzICYmIG9icy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbiA9IG9icy5wb3AoKSxcbiAgICAgICAgICBzID0gc291cmNlLm9ic2VydmVyU2xvdHMucG9wKCk7XG4gICAgICAgIGlmIChpbmRleCA8IG9icy5sZW5ndGgpIHtcbiAgICAgICAgICBuLnNvdXJjZVNsb3RzW3NdID0gaW5kZXg7XG4gICAgICAgICAgb2JzW2luZGV4XSA9IG47XG4gICAgICAgICAgc291cmNlLm9ic2VydmVyU2xvdHNbaW5kZXhdID0gcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAobm9kZS50T3duZWQpIHtcbiAgICBmb3IgKGkgPSBub2RlLnRPd25lZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgY2xlYW5Ob2RlKG5vZGUudE93bmVkW2ldKTtcbiAgICBkZWxldGUgbm9kZS50T3duZWQ7XG4gIH1cbiAgaWYgKG5vZGUub3duZWQpIHtcbiAgICBmb3IgKGkgPSBub2RlLm93bmVkLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBjbGVhbk5vZGUobm9kZS5vd25lZFtpXSk7XG4gICAgbm9kZS5vd25lZCA9IG51bGw7XG4gIH1cbiAgaWYgKG5vZGUuY2xlYW51cHMpIHtcbiAgICBmb3IgKGkgPSBub2RlLmNsZWFudXBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBub2RlLmNsZWFudXBzW2ldKCk7XG4gICAgbm9kZS5jbGVhbnVwcyA9IG51bGw7XG4gIH1cbiAgbm9kZS5zdGF0ZSA9IDA7XG59XG5mdW5jdGlvbiBjYXN0RXJyb3IoZXJyKSB7XG4gIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIGVycjtcbiAgcmV0dXJuIG5ldyBFcnJvcih0eXBlb2YgZXJyID09PSBcInN0cmluZ1wiID8gZXJyIDogXCJVbmtub3duIGVycm9yXCIsIHtcbiAgICBjYXVzZTogZXJyXG4gIH0pO1xufVxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyLCBvd25lciA9IE93bmVyKSB7XG4gIGNvbnN0IGVycm9yID0gY2FzdEVycm9yKGVycik7XG4gIHRocm93IGVycm9yO1xufVxuZnVuY3Rpb24gcmVzb2x2ZUNoaWxkcmVuKGNoaWxkcmVuKSB7XG4gIGlmICh0eXBlb2YgY2hpbGRyZW4gPT09IFwiZnVuY3Rpb25cIiAmJiAhY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gcmVzb2x2ZUNoaWxkcmVuKGNoaWxkcmVuKCkpO1xuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZUNoaWxkcmVuKGNoaWxkcmVuW2ldKTtcbiAgICAgIEFycmF5LmlzQXJyYXkocmVzdWx0KSA/IHJlc3VsdHMucHVzaC5hcHBseShyZXN1bHRzLCByZXN1bHQpIDogcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG4gIHJldHVybiBjaGlsZHJlbjtcbn1cblxuY29uc3QgRkFMTEJBQ0sgPSBTeW1ib2woXCJmYWxsYmFja1wiKTtcbmZ1bmN0aW9uIGRpc3Bvc2UoZCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIGRbaV0oKTtcbn1cbmZ1bmN0aW9uIG1hcEFycmF5KGxpc3QsIG1hcEZuLCBvcHRpb25zID0ge30pIHtcbiAgbGV0IGl0ZW1zID0gW10sXG4gICAgbWFwcGVkID0gW10sXG4gICAgZGlzcG9zZXJzID0gW10sXG4gICAgbGVuID0gMCxcbiAgICBpbmRleGVzID0gbWFwRm4ubGVuZ3RoID4gMSA/IFtdIDogbnVsbDtcbiAgb25DbGVhbnVwKCgpID0+IGRpc3Bvc2UoZGlzcG9zZXJzKSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgbGV0IG5ld0l0ZW1zID0gbGlzdCgpIHx8IFtdLFxuICAgICAgbmV3TGVuID0gbmV3SXRlbXMubGVuZ3RoLFxuICAgICAgaSxcbiAgICAgIGo7XG4gICAgbmV3SXRlbXNbJFRSQUNLXTtcbiAgICByZXR1cm4gdW50cmFjaygoKSA9PiB7XG4gICAgICBsZXQgbmV3SW5kaWNlcywgbmV3SW5kaWNlc05leHQsIHRlbXAsIHRlbXBkaXNwb3NlcnMsIHRlbXBJbmRleGVzLCBzdGFydCwgZW5kLCBuZXdFbmQsIGl0ZW07XG4gICAgICBpZiAobmV3TGVuID09PSAwKSB7XG4gICAgICAgIGlmIChsZW4gIT09IDApIHtcbiAgICAgICAgICBkaXNwb3NlKGRpc3Bvc2Vycyk7XG4gICAgICAgICAgZGlzcG9zZXJzID0gW107XG4gICAgICAgICAgaXRlbXMgPSBbXTtcbiAgICAgICAgICBtYXBwZWQgPSBbXTtcbiAgICAgICAgICBsZW4gPSAwO1xuICAgICAgICAgIGluZGV4ZXMgJiYgKGluZGV4ZXMgPSBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZmFsbGJhY2spIHtcbiAgICAgICAgICBpdGVtcyA9IFtGQUxMQkFDS107XG4gICAgICAgICAgbWFwcGVkWzBdID0gY3JlYXRlUm9vdChkaXNwb3NlciA9PiB7XG4gICAgICAgICAgICBkaXNwb3NlcnNbMF0gPSBkaXNwb3NlcjtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGVuID0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgbWFwcGVkID0gbmV3IEFycmF5KG5ld0xlbik7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBuZXdMZW47IGorKykge1xuICAgICAgICAgIGl0ZW1zW2pdID0gbmV3SXRlbXNbal07XG4gICAgICAgICAgbWFwcGVkW2pdID0gY3JlYXRlUm9vdChtYXBwZXIpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IG5ld0xlbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbXAgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgICAgICAgdGVtcGRpc3Bvc2VycyA9IG5ldyBBcnJheShuZXdMZW4pO1xuICAgICAgICBpbmRleGVzICYmICh0ZW1wSW5kZXhlcyA9IG5ldyBBcnJheShuZXdMZW4pKTtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBzdGFydCA9IDAsIGVuZCA9IE1hdGgubWluKGxlbiwgbmV3TGVuKTtcbiAgICAgICAgICBzdGFydCA8IGVuZCAmJiBpdGVtc1tzdGFydF0gPT09IG5ld0l0ZW1zW3N0YXJ0XTtcbiAgICAgICAgICBzdGFydCsrXG4gICAgICAgICk7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgZW5kID0gbGVuIC0gMSwgbmV3RW5kID0gbmV3TGVuIC0gMTtcbiAgICAgICAgICBlbmQgPj0gc3RhcnQgJiYgbmV3RW5kID49IHN0YXJ0ICYmIGl0ZW1zW2VuZF0gPT09IG5ld0l0ZW1zW25ld0VuZF07XG4gICAgICAgICAgZW5kLS0sIG5ld0VuZC0tXG4gICAgICAgICkge1xuICAgICAgICAgIHRlbXBbbmV3RW5kXSA9IG1hcHBlZFtlbmRdO1xuICAgICAgICAgIHRlbXBkaXNwb3NlcnNbbmV3RW5kXSA9IGRpc3Bvc2Vyc1tlbmRdO1xuICAgICAgICAgIGluZGV4ZXMgJiYgKHRlbXBJbmRleGVzW25ld0VuZF0gPSBpbmRleGVzW2VuZF0pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0luZGljZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIG5ld0luZGljZXNOZXh0ID0gbmV3IEFycmF5KG5ld0VuZCArIDEpO1xuICAgICAgICBmb3IgKGogPSBuZXdFbmQ7IGogPj0gc3RhcnQ7IGotLSkge1xuICAgICAgICAgIGl0ZW0gPSBuZXdJdGVtc1tqXTtcbiAgICAgICAgICBpID0gbmV3SW5kaWNlcy5nZXQoaXRlbSk7XG4gICAgICAgICAgbmV3SW5kaWNlc05leHRbal0gPSBpID09PSB1bmRlZmluZWQgPyAtMSA6IGk7XG4gICAgICAgICAgbmV3SW5kaWNlcy5zZXQoaXRlbSwgaik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgICBpdGVtID0gaXRlbXNbaV07XG4gICAgICAgICAgaiA9IG5ld0luZGljZXMuZ2V0KGl0ZW0pO1xuICAgICAgICAgIGlmIChqICE9PSB1bmRlZmluZWQgJiYgaiAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRlbXBbal0gPSBtYXBwZWRbaV07XG4gICAgICAgICAgICB0ZW1wZGlzcG9zZXJzW2pdID0gZGlzcG9zZXJzW2ldO1xuICAgICAgICAgICAgaW5kZXhlcyAmJiAodGVtcEluZGV4ZXNbal0gPSBpbmRleGVzW2ldKTtcbiAgICAgICAgICAgIGogPSBuZXdJbmRpY2VzTmV4dFtqXTtcbiAgICAgICAgICAgIG5ld0luZGljZXMuc2V0KGl0ZW0sIGopO1xuICAgICAgICAgIH0gZWxzZSBkaXNwb3NlcnNbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGogPSBzdGFydDsgaiA8IG5ld0xlbjsgaisrKSB7XG4gICAgICAgICAgaWYgKGogaW4gdGVtcCkge1xuICAgICAgICAgICAgbWFwcGVkW2pdID0gdGVtcFtqXTtcbiAgICAgICAgICAgIGRpc3Bvc2Vyc1tqXSA9IHRlbXBkaXNwb3NlcnNbal07XG4gICAgICAgICAgICBpZiAoaW5kZXhlcykge1xuICAgICAgICAgICAgICBpbmRleGVzW2pdID0gdGVtcEluZGV4ZXNbal07XG4gICAgICAgICAgICAgIGluZGV4ZXNbal0oaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIG1hcHBlZFtqXSA9IGNyZWF0ZVJvb3QobWFwcGVyKTtcbiAgICAgICAgfVxuICAgICAgICBtYXBwZWQgPSBtYXBwZWQuc2xpY2UoMCwgKGxlbiA9IG5ld0xlbikpO1xuICAgICAgICBpdGVtcyA9IG5ld0l0ZW1zLnNsaWNlKDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcHBlZDtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBtYXBwZXIoZGlzcG9zZXIpIHtcbiAgICAgIGRpc3Bvc2Vyc1tqXSA9IGRpc3Bvc2VyO1xuICAgICAgaWYgKGluZGV4ZXMpIHtcbiAgICAgICAgY29uc3QgW3MsIHNldF0gPSBjcmVhdGVTaWduYWwoaik7XG4gICAgICAgIGluZGV4ZXNbal0gPSBzZXQ7XG4gICAgICAgIHJldHVybiBtYXBGbihuZXdJdGVtc1tqXSwgcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwRm4obmV3SXRlbXNbal0pO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChDb21wLCBwcm9wcykge1xuICByZXR1cm4gdW50cmFjaygoKSA9PiBDb21wKHByb3BzIHx8IHt9KSk7XG59XG5cbmNvbnN0IG5hcnJvd2VkRXJyb3IgPSBuYW1lID0+IGBTdGFsZSByZWFkIGZyb20gPCR7bmFtZX0+LmA7XG5mdW5jdGlvbiBGb3IocHJvcHMpIHtcbiAgY29uc3QgZmFsbGJhY2sgPSBcImZhbGxiYWNrXCIgaW4gcHJvcHMgJiYge1xuICAgIGZhbGxiYWNrOiAoKSA9PiBwcm9wcy5mYWxsYmFja1xuICB9O1xuICByZXR1cm4gY3JlYXRlTWVtbyhtYXBBcnJheSgoKSA9PiBwcm9wcy5lYWNoLCBwcm9wcy5jaGlsZHJlbiwgZmFsbGJhY2sgfHwgdW5kZWZpbmVkKSk7XG59XG5mdW5jdGlvbiBTaG93KHByb3BzKSB7XG4gIGNvbnN0IGtleWVkID0gcHJvcHMua2V5ZWQ7XG4gIGNvbnN0IGNvbmRpdGlvblZhbHVlID0gY3JlYXRlTWVtbygoKSA9PiBwcm9wcy53aGVuLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gIGNvbnN0IGNvbmRpdGlvbiA9IGtleWVkXG4gICAgPyBjb25kaXRpb25WYWx1ZVxuICAgIDogY3JlYXRlTWVtbyhjb25kaXRpb25WYWx1ZSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGVxdWFsczogKGEsIGIpID0+ICFhID09PSAhYlxuICAgICAgfSk7XG4gIHJldHVybiBjcmVhdGVNZW1vKFxuICAgICgpID0+IHtcbiAgICAgIGNvbnN0IGMgPSBjb25kaXRpb24oKTtcbiAgICAgIGlmIChjKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gcHJvcHMuY2hpbGRyZW47XG4gICAgICAgIGNvbnN0IGZuID0gdHlwZW9mIGNoaWxkID09PSBcImZ1bmN0aW9uXCIgJiYgY2hpbGQubGVuZ3RoID4gMDtcbiAgICAgICAgcmV0dXJuIGZuXG4gICAgICAgICAgPyB1bnRyYWNrKCgpID0+XG4gICAgICAgICAgICAgIGNoaWxkKFxuICAgICAgICAgICAgICAgIGtleWVkXG4gICAgICAgICAgICAgICAgICA/IGNcbiAgICAgICAgICAgICAgICAgIDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghdW50cmFjayhjb25kaXRpb24pKSB0aHJvdyBuYXJyb3dlZEVycm9yKFwiU2hvd1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZGl0aW9uVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBjaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9wcy5mYWxsYmFjaztcbiAgICB9LFxuICAgIHVuZGVmaW5lZCxcbiAgICB1bmRlZmluZWRcbiAgKTtcbn1cbmZ1bmN0aW9uIFN3aXRjaChwcm9wcykge1xuICBjb25zdCBjaHMgPSBjaGlsZHJlbigoKSA9PiBwcm9wcy5jaGlsZHJlbik7XG4gIGNvbnN0IHN3aXRjaEZ1bmMgPSBjcmVhdGVNZW1vKCgpID0+IHtcbiAgICBjb25zdCBjaCA9IGNocygpO1xuICAgIGNvbnN0IG1wcyA9IEFycmF5LmlzQXJyYXkoY2gpID8gY2ggOiBbY2hdO1xuICAgIGxldCBmdW5jID0gKCkgPT4gdW5kZWZpbmVkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGk7XG4gICAgICBjb25zdCBtcCA9IG1wc1tpXTtcbiAgICAgIGNvbnN0IHByZXZGdW5jID0gZnVuYztcbiAgICAgIGNvbnN0IGNvbmRpdGlvblZhbHVlID0gY3JlYXRlTWVtbyhcbiAgICAgICAgKCkgPT4gKHByZXZGdW5jKCkgPyB1bmRlZmluZWQgOiBtcC53aGVuKSxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWRcbiAgICAgICk7XG4gICAgICBjb25zdCBjb25kaXRpb24gPSBtcC5rZXllZFxuICAgICAgICA/IGNvbmRpdGlvblZhbHVlXG4gICAgICAgIDogY3JlYXRlTWVtbyhjb25kaXRpb25WYWx1ZSwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgICBlcXVhbHM6IChhLCBiKSA9PiAhYSA9PT0gIWJcbiAgICAgICAgICB9KTtcbiAgICAgIGZ1bmMgPSAoKSA9PiBwcmV2RnVuYygpIHx8IChjb25kaXRpb24oKSA/IFtpbmRleCwgY29uZGl0aW9uVmFsdWUsIG1wXSA6IHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xuICB9KTtcbiAgcmV0dXJuIGNyZWF0ZU1lbW8oXG4gICAgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsID0gc3dpdGNoRnVuYygpKCk7XG4gICAgICBpZiAoIXNlbCkgcmV0dXJuIHByb3BzLmZhbGxiYWNrO1xuICAgICAgY29uc3QgW2luZGV4LCBjb25kaXRpb25WYWx1ZSwgbXBdID0gc2VsO1xuICAgICAgY29uc3QgY2hpbGQgPSBtcC5jaGlsZHJlbjtcbiAgICAgIGNvbnN0IGZuID0gdHlwZW9mIGNoaWxkID09PSBcImZ1bmN0aW9uXCIgJiYgY2hpbGQubGVuZ3RoID4gMDtcbiAgICAgIHJldHVybiBmblxuICAgICAgICA/IHVudHJhY2soKCkgPT5cbiAgICAgICAgICAgIGNoaWxkKFxuICAgICAgICAgICAgICBtcC5rZXllZFxuICAgICAgICAgICAgICAgID8gY29uZGl0aW9uVmFsdWUoKVxuICAgICAgICAgICAgICAgIDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodW50cmFjayhzd2l0Y2hGdW5jKSgpPy5bMF0gIT09IGluZGV4KSB0aHJvdyBuYXJyb3dlZEVycm9yKFwiTWF0Y2hcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25kaXRpb25WYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgOiBjaGlsZDtcbiAgICB9LFxuICAgIHVuZGVmaW5lZCxcbiAgICB1bmRlZmluZWRcbiAgKTtcbn1cbmZ1bmN0aW9uIE1hdGNoKHByb3BzKSB7XG4gIHJldHVybiBwcm9wcztcbn1cblxuZnVuY3Rpb24gcmVjb25jaWxlQXJyYXlzKHBhcmVudE5vZGUsIGEsIGIpIHtcbiAgbGV0IGJMZW5ndGggPSBiLmxlbmd0aCxcbiAgICBhRW5kID0gYS5sZW5ndGgsXG4gICAgYkVuZCA9IGJMZW5ndGgsXG4gICAgYVN0YXJ0ID0gMCxcbiAgICBiU3RhcnQgPSAwLFxuICAgIGFmdGVyID0gYVthRW5kIC0gMV0ubmV4dFNpYmxpbmcsXG4gICAgbWFwID0gbnVsbDtcbiAgd2hpbGUgKGFTdGFydCA8IGFFbmQgfHwgYlN0YXJ0IDwgYkVuZCkge1xuICAgIGlmIChhW2FTdGFydF0gPT09IGJbYlN0YXJ0XSkge1xuICAgICAgYVN0YXJ0Kys7XG4gICAgICBiU3RhcnQrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB3aGlsZSAoYVthRW5kIC0gMV0gPT09IGJbYkVuZCAtIDFdKSB7XG4gICAgICBhRW5kLS07XG4gICAgICBiRW5kLS07XG4gICAgfVxuICAgIGlmIChhRW5kID09PSBhU3RhcnQpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBiRW5kIDwgYkxlbmd0aCA/IChiU3RhcnQgPyBiW2JTdGFydCAtIDFdLm5leHRTaWJsaW5nIDogYltiRW5kIC0gYlN0YXJ0XSkgOiBhZnRlcjtcbiAgICAgIHdoaWxlIChiU3RhcnQgPCBiRW5kKSBwYXJlbnROb2RlLmluc2VydEJlZm9yZShiW2JTdGFydCsrXSwgbm9kZSk7XG4gICAgfSBlbHNlIGlmIChiRW5kID09PSBiU3RhcnQpIHtcbiAgICAgIHdoaWxlIChhU3RhcnQgPCBhRW5kKSB7XG4gICAgICAgIGlmICghbWFwIHx8ICFtYXAuaGFzKGFbYVN0YXJ0XSkpIGFbYVN0YXJ0XS5yZW1vdmUoKTtcbiAgICAgICAgYVN0YXJ0Kys7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhW2FTdGFydF0gPT09IGJbYkVuZCAtIDFdICYmIGJbYlN0YXJ0XSA9PT0gYVthRW5kIC0gMV0pIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBhWy0tYUVuZF0ubmV4dFNpYmxpbmc7XG4gICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShiW2JTdGFydCsrXSwgYVthU3RhcnQrK10ubmV4dFNpYmxpbmcpO1xuICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYlstLWJFbmRdLCBub2RlKTtcbiAgICAgIGFbYUVuZF0gPSBiW2JFbmRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW1hcCkge1xuICAgICAgICBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGxldCBpID0gYlN0YXJ0O1xuICAgICAgICB3aGlsZSAoaSA8IGJFbmQpIG1hcC5zZXQoYltpXSwgaSsrKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGluZGV4ID0gbWFwLmdldChhW2FTdGFydF0pO1xuICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGJTdGFydCA8IGluZGV4ICYmIGluZGV4IDwgYkVuZCkge1xuICAgICAgICAgIGxldCBpID0gYVN0YXJ0LFxuICAgICAgICAgICAgc2VxdWVuY2UgPSAxLFxuICAgICAgICAgICAgdDtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgYUVuZCAmJiBpIDwgYkVuZCkge1xuICAgICAgICAgICAgaWYgKCh0ID0gbWFwLmdldChhW2ldKSkgPT0gbnVsbCB8fCB0ICE9PSBpbmRleCArIHNlcXVlbmNlKSBicmVhaztcbiAgICAgICAgICAgIHNlcXVlbmNlKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzZXF1ZW5jZSA+IGluZGV4IC0gYlN0YXJ0KSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gYVthU3RhcnRdO1xuICAgICAgICAgICAgd2hpbGUgKGJTdGFydCA8IGluZGV4KSBwYXJlbnROb2RlLmluc2VydEJlZm9yZShiW2JTdGFydCsrXSwgbm9kZSk7XG4gICAgICAgICAgfSBlbHNlIHBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGJbYlN0YXJ0KytdLCBhW2FTdGFydCsrXSk7XG4gICAgICAgIH0gZWxzZSBhU3RhcnQrKztcbiAgICAgIH0gZWxzZSBhW2FTdGFydCsrXS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgJCRFVkVOVFMgPSBcIl8kRFhfREVMRUdBVEVcIjtcbmZ1bmN0aW9uIHJlbmRlcihjb2RlLCBlbGVtZW50LCBpbml0LCBvcHRpb25zID0ge30pIHtcbiAgbGV0IGRpc3Bvc2VyO1xuICBjcmVhdGVSb290KGRpc3Bvc2UgPT4ge1xuICAgIGRpc3Bvc2VyID0gZGlzcG9zZTtcbiAgICBlbGVtZW50ID09PSBkb2N1bWVudFxuICAgICAgPyBjb2RlKClcbiAgICAgIDogaW5zZXJ0KGVsZW1lbnQsIGNvZGUoKSwgZWxlbWVudC5maXJzdENoaWxkID8gbnVsbCA6IHVuZGVmaW5lZCwgaW5pdCk7XG4gIH0sIG9wdGlvbnMub3duZXIpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGRpc3Bvc2VyKCk7XG4gICAgZWxlbWVudC50ZXh0Q29udGVudCA9IFwiXCI7XG4gIH07XG59XG5mdW5jdGlvbiB0ZW1wbGF0ZShodG1sLCBpc0ltcG9ydE5vZGUsIGlzU1ZHLCBpc01hdGhNTCkge1xuICBsZXQgbm9kZTtcbiAgY29uc3QgY3JlYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG4gICAgdC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiB0LmNvbnRlbnQuZmlyc3RDaGlsZDtcbiAgfTtcbiAgY29uc3QgZm4gPSBpc0ltcG9ydE5vZGVcbiAgICA/ICgpID0+IHVudHJhY2soKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZShub2RlIHx8IChub2RlID0gY3JlYXRlKCkpLCB0cnVlKSlcbiAgICA6ICgpID0+IChub2RlIHx8IChub2RlID0gY3JlYXRlKCkpKS5jbG9uZU5vZGUodHJ1ZSk7XG4gIGZuLmNsb25lTm9kZSA9IGZuO1xuICByZXR1cm4gZm47XG59XG5mdW5jdGlvbiBkZWxlZ2F0ZUV2ZW50cyhldmVudE5hbWVzLCBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCkge1xuICBjb25zdCBlID0gZG9jdW1lbnRbJCRFVkVOVFNdIHx8IChkb2N1bWVudFskJEVWRU5UU10gPSBuZXcgU2V0KCkpO1xuICBmb3IgKGxldCBpID0gMCwgbCA9IGV2ZW50TmFtZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgbmFtZSA9IGV2ZW50TmFtZXNbaV07XG4gICAgaWYgKCFlLmhhcyhuYW1lKSkge1xuICAgICAgZS5hZGQobmFtZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50SGFuZGxlcik7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICBlbHNlIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGNsYXNzTmFtZShub2RlLCB2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgZWxzZSBub2RlLmNsYXNzTmFtZSA9IHZhbHVlO1xufVxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcihub2RlLCBuYW1lLCBoYW5kbGVyLCBkZWxlZ2F0ZSkge1xuICB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICAgIG5vZGVbYCQkJHtuYW1lfWBdID0gaGFuZGxlclswXTtcbiAgICAgIG5vZGVbYCQkJHtuYW1lfURhdGFgXSA9IGhhbmRsZXJbMV07XG4gICAgfSBlbHNlIG5vZGVbYCQkJHtuYW1lfWBdID0gaGFuZGxlcjtcbiAgfVxufVxuZnVuY3Rpb24gc3R5bGUobm9kZSwgdmFsdWUsIHByZXYpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIHByZXYgPyBzZXRBdHRyaWJ1dGUobm9kZSwgXCJzdHlsZVwiKSA6IHZhbHVlO1xuICBjb25zdCBub2RlU3R5bGUgPSBub2RlLnN0eWxlO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm4gKG5vZGVTdHlsZS5jc3NUZXh0ID0gdmFsdWUpO1xuICB0eXBlb2YgcHJldiA9PT0gXCJzdHJpbmdcIiAmJiAobm9kZVN0eWxlLmNzc1RleHQgPSBwcmV2ID0gdW5kZWZpbmVkKTtcbiAgcHJldiB8fCAocHJldiA9IHt9KTtcbiAgdmFsdWUgfHwgKHZhbHVlID0ge30pO1xuICBsZXQgdiwgcztcbiAgZm9yIChzIGluIHByZXYpIHtcbiAgICB2YWx1ZVtzXSA9PSBudWxsICYmIG5vZGVTdHlsZS5yZW1vdmVQcm9wZXJ0eShzKTtcbiAgICBkZWxldGUgcHJldltzXTtcbiAgfVxuICBmb3IgKHMgaW4gdmFsdWUpIHtcbiAgICB2ID0gdmFsdWVbc107XG4gICAgaWYgKHYgIT09IHByZXZbc10pIHtcbiAgICAgIG5vZGVTdHlsZS5zZXRQcm9wZXJ0eShzLCB2KTtcbiAgICAgIHByZXZbc10gPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJldjtcbn1cbmZ1bmN0aW9uIHVzZShmbiwgZWxlbWVudCwgYXJnKSB7XG4gIHJldHVybiB1bnRyYWNrKCgpID0+IGZuKGVsZW1lbnQsIGFyZykpO1xufVxuZnVuY3Rpb24gaW5zZXJ0KHBhcmVudCwgYWNjZXNzb3IsIG1hcmtlciwgaW5pdGlhbCkge1xuICBpZiAobWFya2VyICE9PSB1bmRlZmluZWQgJiYgIWluaXRpYWwpIGluaXRpYWwgPSBbXTtcbiAgaWYgKHR5cGVvZiBhY2Nlc3NvciAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gaW5zZXJ0RXhwcmVzc2lvbihwYXJlbnQsIGFjY2Vzc29yLCBpbml0aWFsLCBtYXJrZXIpO1xuICBjcmVhdGVSZW5kZXJFZmZlY3QoY3VycmVudCA9PiBpbnNlcnRFeHByZXNzaW9uKHBhcmVudCwgYWNjZXNzb3IoKSwgY3VycmVudCwgbWFya2VyKSwgaW5pdGlhbCk7XG59XG5mdW5jdGlvbiBldmVudEhhbmRsZXIoZSkge1xuICBsZXQgbm9kZSA9IGUudGFyZ2V0O1xuICBjb25zdCBrZXkgPSBgJCQke2UudHlwZX1gO1xuICBjb25zdCBvcmlUYXJnZXQgPSBlLnRhcmdldDtcbiAgY29uc3Qgb3JpQ3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcbiAgY29uc3QgcmV0YXJnZXQgPSB2YWx1ZSA9PlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCBcInRhcmdldFwiLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZVxuICAgIH0pO1xuICBjb25zdCBoYW5kbGVOb2RlID0gKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBub2RlW2tleV07XG4gICAgaWYgKGhhbmRsZXIgJiYgIW5vZGUuZGlzYWJsZWQpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBub2RlW2Ake2tleX1EYXRhYF07XG4gICAgICBkYXRhICE9PSB1bmRlZmluZWQgPyBoYW5kbGVyLmNhbGwobm9kZSwgZGF0YSwgZSkgOiBoYW5kbGVyLmNhbGwobm9kZSwgZSk7XG4gICAgICBpZiAoZS5jYW5jZWxCdWJibGUpIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5ob3N0ICYmXG4gICAgICB0eXBlb2Ygbm9kZS5ob3N0ICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAhbm9kZS5ob3N0Ll8kaG9zdCAmJlxuICAgICAgbm9kZS5jb250YWlucyhlLnRhcmdldCkgJiZcbiAgICAgIHJldGFyZ2V0KG5vZGUuaG9zdCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIGNvbnN0IHdhbGtVcFRyZWUgPSAoKSA9PiB7XG4gICAgd2hpbGUgKGhhbmRsZU5vZGUoKSAmJiAobm9kZSA9IG5vZGUuXyRob3N0IHx8IG5vZGUucGFyZW50Tm9kZSB8fCBub2RlLmhvc3QpKTtcbiAgfTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIFwiY3VycmVudFRhcmdldFwiLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldCgpIHtcbiAgICAgIHJldHVybiBub2RlIHx8IGRvY3VtZW50O1xuICAgIH1cbiAgfSk7XG4gIGlmIChlLmNvbXBvc2VkUGF0aCkge1xuICAgIGNvbnN0IHBhdGggPSBlLmNvbXBvc2VkUGF0aCgpO1xuICAgIHJldGFyZ2V0KHBhdGhbMF0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgIG5vZGUgPSBwYXRoW2ldO1xuICAgICAgaWYgKCFoYW5kbGVOb2RlKCkpIGJyZWFrO1xuICAgICAgaWYgKG5vZGUuXyRob3N0KSB7XG4gICAgICAgIG5vZGUgPSBub2RlLl8kaG9zdDtcbiAgICAgICAgd2Fsa1VwVHJlZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnBhcmVudE5vZGUgPT09IG9yaUN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Ugd2Fsa1VwVHJlZSgpO1xuICByZXRhcmdldChvcmlUYXJnZXQpO1xufVxuZnVuY3Rpb24gaW5zZXJ0RXhwcmVzc2lvbihwYXJlbnQsIHZhbHVlLCBjdXJyZW50LCBtYXJrZXIsIHVud3JhcEFycmF5KSB7XG4gIHdoaWxlICh0eXBlb2YgY3VycmVudCA9PT0gXCJmdW5jdGlvblwiKSBjdXJyZW50ID0gY3VycmVudCgpO1xuICBpZiAodmFsdWUgPT09IGN1cnJlbnQpIHJldHVybiBjdXJyZW50O1xuICBjb25zdCB0ID0gdHlwZW9mIHZhbHVlLFxuICAgIG11bHRpID0gbWFya2VyICE9PSB1bmRlZmluZWQ7XG4gIHBhcmVudCA9IChtdWx0aSAmJiBjdXJyZW50WzBdICYmIGN1cnJlbnRbMF0ucGFyZW50Tm9kZSkgfHwgcGFyZW50O1xuICBpZiAodCA9PT0gXCJzdHJpbmdcIiB8fCB0ID09PSBcIm51bWJlclwiKSB7XG4gICAgaWYgKHQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gY3VycmVudCkgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuICAgIGlmIChtdWx0aSkge1xuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50WzBdO1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBub2RlLmRhdGEgIT09IHZhbHVlICYmIChub2RlLmRhdGEgPSB2YWx1ZSk7XG4gICAgICB9IGVsc2Ugbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKTtcbiAgICAgIGN1cnJlbnQgPSBjbGVhbkNoaWxkcmVuKHBhcmVudCwgY3VycmVudCwgbWFya2VyLCBub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJlbnQgIT09IFwiXCIgJiYgdHlwZW9mIGN1cnJlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcmVudC5maXJzdENoaWxkLmRhdGEgPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSBjdXJyZW50ID0gcGFyZW50LnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKHZhbHVlID09IG51bGwgfHwgdCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICBjdXJyZW50ID0gY2xlYW5DaGlsZHJlbihwYXJlbnQsIGN1cnJlbnQsIG1hcmtlcik7XG4gIH0gZWxzZSBpZiAodCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY3JlYXRlUmVuZGVyRWZmZWN0KCgpID0+IHtcbiAgICAgIGxldCB2ID0gdmFsdWUoKTtcbiAgICAgIHdoaWxlICh0eXBlb2YgdiA9PT0gXCJmdW5jdGlvblwiKSB2ID0gdigpO1xuICAgICAgY3VycmVudCA9IGluc2VydEV4cHJlc3Npb24ocGFyZW50LCB2LCBjdXJyZW50LCBtYXJrZXIpO1xuICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiBjdXJyZW50O1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBjb25zdCBjdXJyZW50QXJyYXkgPSBjdXJyZW50ICYmIEFycmF5LmlzQXJyYXkoY3VycmVudCk7XG4gICAgaWYgKG5vcm1hbGl6ZUluY29taW5nQXJyYXkoYXJyYXksIHZhbHVlLCBjdXJyZW50LCB1bndyYXBBcnJheSkpIHtcbiAgICAgIGNyZWF0ZVJlbmRlckVmZmVjdCgoKSA9PiAoY3VycmVudCA9IGluc2VydEV4cHJlc3Npb24ocGFyZW50LCBhcnJheSwgY3VycmVudCwgbWFya2VyLCB0cnVlKSkpO1xuICAgICAgcmV0dXJuICgpID0+IGN1cnJlbnQ7XG4gICAgfVxuICAgIGlmIChhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgIGN1cnJlbnQgPSBjbGVhbkNoaWxkcmVuKHBhcmVudCwgY3VycmVudCwgbWFya2VyKTtcbiAgICAgIGlmIChtdWx0aSkgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50QXJyYXkpIHtcbiAgICAgIGlmIChjdXJyZW50Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhcHBlbmROb2RlcyhwYXJlbnQsIGFycmF5LCBtYXJrZXIpO1xuICAgICAgfSBlbHNlIHJlY29uY2lsZUFycmF5cyhwYXJlbnQsIGN1cnJlbnQsIGFycmF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCAmJiBjbGVhbkNoaWxkcmVuKHBhcmVudCk7XG4gICAgICBhcHBlbmROb2RlcyhwYXJlbnQsIGFycmF5KTtcbiAgICB9XG4gICAgY3VycmVudCA9IGFycmF5O1xuICB9IGVsc2UgaWYgKHZhbHVlLm5vZGVUeXBlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY3VycmVudCkpIHtcbiAgICAgIGlmIChtdWx0aSkgcmV0dXJuIChjdXJyZW50ID0gY2xlYW5DaGlsZHJlbihwYXJlbnQsIGN1cnJlbnQsIG1hcmtlciwgdmFsdWUpKTtcbiAgICAgIGNsZWFuQ2hpbGRyZW4ocGFyZW50LCBjdXJyZW50LCBudWxsLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50ID09IG51bGwgfHwgY3VycmVudCA9PT0gXCJcIiB8fCAhcGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2YWx1ZSk7XG4gICAgfSBlbHNlIHBhcmVudC5yZXBsYWNlQ2hpbGQodmFsdWUsIHBhcmVudC5maXJzdENoaWxkKTtcbiAgICBjdXJyZW50ID0gdmFsdWU7XG4gIH0gZWxzZTtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5mdW5jdGlvbiBub3JtYWxpemVJbmNvbWluZ0FycmF5KG5vcm1hbGl6ZWQsIGFycmF5LCBjdXJyZW50LCB1bndyYXApIHtcbiAgbGV0IGR5bmFtaWMgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbGV0IGl0ZW0gPSBhcnJheVtpXSxcbiAgICAgIHByZXYgPSBjdXJyZW50ICYmIGN1cnJlbnRbbm9ybWFsaXplZC5sZW5ndGhdLFxuICAgICAgdDtcbiAgICBpZiAoaXRlbSA9PSBudWxsIHx8IGl0ZW0gPT09IHRydWUgfHwgaXRlbSA9PT0gZmFsc2UpO1xuICAgIGVsc2UgaWYgKCh0ID0gdHlwZW9mIGl0ZW0pID09PSBcIm9iamVjdFwiICYmIGl0ZW0ubm9kZVR5cGUpIHtcbiAgICAgIG5vcm1hbGl6ZWQucHVzaChpdGVtKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGR5bmFtaWMgPSBub3JtYWxpemVJbmNvbWluZ0FycmF5KG5vcm1hbGl6ZWQsIGl0ZW0sIHByZXYpIHx8IGR5bmFtaWM7XG4gICAgfSBlbHNlIGlmICh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGlmICh1bndyYXApIHtcbiAgICAgICAgd2hpbGUgKHR5cGVvZiBpdGVtID09PSBcImZ1bmN0aW9uXCIpIGl0ZW0gPSBpdGVtKCk7XG4gICAgICAgIGR5bmFtaWMgPVxuICAgICAgICAgIG5vcm1hbGl6ZUluY29taW5nQXJyYXkoXG4gICAgICAgICAgICBub3JtYWxpemVkLFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShpdGVtKSA/IGl0ZW0gOiBbaXRlbV0sXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHByZXYpID8gcHJldiA6IFtwcmV2XVxuICAgICAgICAgICkgfHwgZHluYW1pYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcm1hbGl6ZWQucHVzaChpdGVtKTtcbiAgICAgICAgZHluYW1pYyA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKHByZXYgJiYgcHJldi5ub2RlVHlwZSA9PT0gMyAmJiBwcmV2LmRhdGEgPT09IHZhbHVlKSBub3JtYWxpemVkLnB1c2gocHJldik7XG4gICAgICBlbHNlIG5vcm1hbGl6ZWQucHVzaChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2YWx1ZSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZHluYW1pYztcbn1cbmZ1bmN0aW9uIGFwcGVuZE5vZGVzKHBhcmVudCwgYXJyYXksIG1hcmtlciA9IG51bGwpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBwYXJlbnQuaW5zZXJ0QmVmb3JlKGFycmF5W2ldLCBtYXJrZXIpO1xufVxuZnVuY3Rpb24gY2xlYW5DaGlsZHJlbihwYXJlbnQsIGN1cnJlbnQsIG1hcmtlciwgcmVwbGFjZW1lbnQpIHtcbiAgaWYgKG1hcmtlciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gKHBhcmVudC50ZXh0Q29udGVudCA9IFwiXCIpO1xuICBjb25zdCBub2RlID0gcmVwbGFjZW1lbnQgfHwgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gIGlmIChjdXJyZW50Lmxlbmd0aCkge1xuICAgIGxldCBpbnNlcnRlZCA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSBjdXJyZW50Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBlbCA9IGN1cnJlbnRbaV07XG4gICAgICBpZiAobm9kZSAhPT0gZWwpIHtcbiAgICAgICAgY29uc3QgaXNQYXJlbnQgPSBlbC5wYXJlbnROb2RlID09PSBwYXJlbnQ7XG4gICAgICAgIGlmICghaW5zZXJ0ZWQgJiYgIWkpXG4gICAgICAgICAgaXNQYXJlbnQgPyBwYXJlbnQucmVwbGFjZUNoaWxkKG5vZGUsIGVsKSA6IHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgbWFya2VyKTtcbiAgICAgICAgZWxzZSBpc1BhcmVudCAmJiBlbC5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSBpbnNlcnRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgcGFyZW50Lmluc2VydEJlZm9yZShub2RlLCBtYXJrZXIpO1xuICByZXR1cm4gW25vZGVdO1xufVxuXG5jb25zdCAkUkFXID0gU3ltYm9sKFwic3RvcmUtcmF3XCIpLFxuICAkTk9ERSA9IFN5bWJvbChcInN0b3JlLW5vZGVcIiksXG4gICRIQVMgPSBTeW1ib2woXCJzdG9yZS1oYXNcIiksXG4gICRTRUxGID0gU3ltYm9sKFwic3RvcmUtc2VsZlwiKTtcbmZ1bmN0aW9uIHdyYXAkMSh2YWx1ZSkge1xuICBsZXQgcCA9IHZhbHVlWyRQUk9YWV07XG4gIGlmICghcCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgJFBST1hZLCB7XG4gICAgICB2YWx1ZTogKHAgPSBuZXcgUHJveHkodmFsdWUsIHByb3h5VHJhcHMkMSkpXG4gICAgfSk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKSxcbiAgICAgICAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHZhbHVlKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcHJvcCA9IGtleXNbaV07XG4gICAgICAgIGlmIChkZXNjW3Byb3BdLmdldCkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgcHJvcCwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogZGVzY1twcm9wXS5lbnVtZXJhYmxlLFxuICAgICAgICAgICAgZ2V0OiBkZXNjW3Byb3BdLmdldC5iaW5kKHApXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHA7XG59XG5mdW5jdGlvbiBpc1dyYXBwYWJsZShvYmopIHtcbiAgbGV0IHByb3RvO1xuICByZXR1cm4gKFxuICAgIG9iaiAhPSBudWxsICYmXG4gICAgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJlxuICAgIChvYmpbJFBST1hZXSB8fFxuICAgICAgIShwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopKSB8fFxuICAgICAgcHJvdG8gPT09IE9iamVjdC5wcm90b3R5cGUgfHxcbiAgICAgIEFycmF5LmlzQXJyYXkob2JqKSlcbiAgKTtcbn1cbmZ1bmN0aW9uIHVud3JhcChpdGVtLCBzZXQgPSBuZXcgU2V0KCkpIHtcbiAgbGV0IHJlc3VsdCwgdW53cmFwcGVkLCB2LCBwcm9wO1xuICBpZiAoKHJlc3VsdCA9IGl0ZW0gIT0gbnVsbCAmJiBpdGVtWyRSQVddKSkgcmV0dXJuIHJlc3VsdDtcbiAgaWYgKCFpc1dyYXBwYWJsZShpdGVtKSB8fCBzZXQuaGFzKGl0ZW0pKSByZXR1cm4gaXRlbTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICBpZiAoT2JqZWN0LmlzRnJvemVuKGl0ZW0pKSBpdGVtID0gaXRlbS5zbGljZSgwKTtcbiAgICBlbHNlIHNldC5hZGQoaXRlbSk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBpdGVtLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdiA9IGl0ZW1baV07XG4gICAgICBpZiAoKHVud3JhcHBlZCA9IHVud3JhcCh2LCBzZXQpKSAhPT0gdikgaXRlbVtpXSA9IHVud3JhcHBlZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE9iamVjdC5pc0Zyb3plbihpdGVtKSkgaXRlbSA9IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0pO1xuICAgIGVsc2Ugc2V0LmFkZChpdGVtKTtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoaXRlbSksXG4gICAgICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoaXRlbSk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcHJvcCA9IGtleXNbaV07XG4gICAgICBpZiAoZGVzY1twcm9wXS5nZXQpIGNvbnRpbnVlO1xuICAgICAgdiA9IGl0ZW1bcHJvcF07XG4gICAgICBpZiAoKHVud3JhcHBlZCA9IHVud3JhcCh2LCBzZXQpKSAhPT0gdikgaXRlbVtwcm9wXSA9IHVud3JhcHBlZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGl0ZW07XG59XG5mdW5jdGlvbiBnZXROb2Rlcyh0YXJnZXQsIHN5bWJvbCkge1xuICBsZXQgbm9kZXMgPSB0YXJnZXRbc3ltYm9sXTtcbiAgaWYgKCFub2RlcylcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBzeW1ib2wsIHtcbiAgICAgIHZhbHVlOiAobm9kZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpKVxuICAgIH0pO1xuICByZXR1cm4gbm9kZXM7XG59XG5mdW5jdGlvbiBnZXROb2RlKG5vZGVzLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKG5vZGVzW3Byb3BlcnR5XSkgcmV0dXJuIG5vZGVzW3Byb3BlcnR5XTtcbiAgY29uc3QgW3MsIHNldF0gPSBjcmVhdGVTaWduYWwodmFsdWUsIHtcbiAgICBlcXVhbHM6IGZhbHNlLFxuICAgIGludGVybmFsOiB0cnVlXG4gIH0pO1xuICBzLiQgPSBzZXQ7XG4gIHJldHVybiAobm9kZXNbcHJvcGVydHldID0gcyk7XG59XG5mdW5jdGlvbiBwcm94eURlc2NyaXB0b3IkMSh0YXJnZXQsIHByb3BlcnR5KSB7XG4gIGNvbnN0IGRlc2MgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5KTtcbiAgaWYgKCFkZXNjIHx8IGRlc2MuZ2V0IHx8ICFkZXNjLmNvbmZpZ3VyYWJsZSB8fCBwcm9wZXJ0eSA9PT0gJFBST1hZIHx8IHByb3BlcnR5ID09PSAkTk9ERSlcbiAgICByZXR1cm4gZGVzYztcbiAgZGVsZXRlIGRlc2MudmFsdWU7XG4gIGRlbGV0ZSBkZXNjLndyaXRhYmxlO1xuICBkZXNjLmdldCA9ICgpID0+IHRhcmdldFskUFJPWFldW3Byb3BlcnR5XTtcbiAgcmV0dXJuIGRlc2M7XG59XG5mdW5jdGlvbiB0cmFja1NlbGYodGFyZ2V0KSB7XG4gIGdldExpc3RlbmVyKCkgJiYgZ2V0Tm9kZShnZXROb2Rlcyh0YXJnZXQsICROT0RFKSwgJFNFTEYpKCk7XG59XG5mdW5jdGlvbiBvd25LZXlzKHRhcmdldCkge1xuICB0cmFja1NlbGYodGFyZ2V0KTtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xufVxuY29uc3QgcHJveHlUcmFwcyQxID0ge1xuICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICBpZiAocHJvcGVydHkgPT09ICRSQVcpIHJldHVybiB0YXJnZXQ7XG4gICAgaWYgKHByb3BlcnR5ID09PSAkUFJPWFkpIHJldHVybiByZWNlaXZlcjtcbiAgICBpZiAocHJvcGVydHkgPT09ICRUUkFDSykge1xuICAgICAgdHJhY2tTZWxmKHRhcmdldCk7XG4gICAgICByZXR1cm4gcmVjZWl2ZXI7XG4gICAgfVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXModGFyZ2V0LCAkTk9ERSk7XG4gICAgY29uc3QgdHJhY2tlZCA9IG5vZGVzW3Byb3BlcnR5XTtcbiAgICBsZXQgdmFsdWUgPSB0cmFja2VkID8gdHJhY2tlZCgpIDogdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICBpZiAocHJvcGVydHkgPT09ICROT0RFIHx8IHByb3BlcnR5ID09PSAkSEFTIHx8IHByb3BlcnR5ID09PSBcIl9fcHJvdG9fX1wiKSByZXR1cm4gdmFsdWU7XG4gICAgaWYgKCF0cmFja2VkKSB7XG4gICAgICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmIChcbiAgICAgICAgZ2V0TGlzdGVuZXIoKSAmJlxuICAgICAgICAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIgfHwgdGFyZ2V0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSkgJiZcbiAgICAgICAgIShkZXNjICYmIGRlc2MuZ2V0KVxuICAgICAgKVxuICAgICAgICB2YWx1ZSA9IGdldE5vZGUobm9kZXMsIHByb3BlcnR5LCB2YWx1ZSkoKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzV3JhcHBhYmxlKHZhbHVlKSA/IHdyYXAkMSh2YWx1ZSkgOiB2YWx1ZTtcbiAgfSxcbiAgaGFzKHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICBpZiAoXG4gICAgICBwcm9wZXJ0eSA9PT0gJFJBVyB8fFxuICAgICAgcHJvcGVydHkgPT09ICRQUk9YWSB8fFxuICAgICAgcHJvcGVydHkgPT09ICRUUkFDSyB8fFxuICAgICAgcHJvcGVydHkgPT09ICROT0RFIHx8XG4gICAgICBwcm9wZXJ0eSA9PT0gJEhBUyB8fFxuICAgICAgcHJvcGVydHkgPT09IFwiX19wcm90b19fXCJcbiAgICApXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBnZXRMaXN0ZW5lcigpICYmIGdldE5vZGUoZ2V0Tm9kZXModGFyZ2V0LCAkSEFTKSwgcHJvcGVydHkpKCk7XG4gICAgcmV0dXJuIHByb3BlcnR5IGluIHRhcmdldDtcbiAgfSxcbiAgc2V0KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgb3duS2V5czogb3duS2V5cyxcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBwcm94eURlc2NyaXB0b3IkMVxufTtcbmZ1bmN0aW9uIHNldFByb3BlcnR5KHN0YXRlLCBwcm9wZXJ0eSwgdmFsdWUsIGRlbGV0aW5nID0gZmFsc2UpIHtcbiAgaWYgKCFkZWxldGluZyAmJiBzdGF0ZVtwcm9wZXJ0eV0gPT09IHZhbHVlKSByZXR1cm47XG4gIGNvbnN0IHByZXYgPSBzdGF0ZVtwcm9wZXJ0eV0sXG4gICAgbGVuID0gc3RhdGUubGVuZ3RoO1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGRlbGV0ZSBzdGF0ZVtwcm9wZXJ0eV07XG4gICAgaWYgKHN0YXRlWyRIQVNdICYmIHN0YXRlWyRIQVNdW3Byb3BlcnR5XSAmJiBwcmV2ICE9PSB1bmRlZmluZWQpIHN0YXRlWyRIQVNdW3Byb3BlcnR5XS4kKCk7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgaWYgKHN0YXRlWyRIQVNdICYmIHN0YXRlWyRIQVNdW3Byb3BlcnR5XSAmJiBwcmV2ID09PSB1bmRlZmluZWQpIHN0YXRlWyRIQVNdW3Byb3BlcnR5XS4kKCk7XG4gIH1cbiAgbGV0IG5vZGVzID0gZ2V0Tm9kZXMoc3RhdGUsICROT0RFKSxcbiAgICBub2RlO1xuICBpZiAoKG5vZGUgPSBnZXROb2RlKG5vZGVzLCBwcm9wZXJ0eSwgcHJldikpKSBub2RlLiQoKCkgPT4gdmFsdWUpO1xuICBpZiAoQXJyYXkuaXNBcnJheShzdGF0ZSkgJiYgc3RhdGUubGVuZ3RoICE9PSBsZW4pIHtcbiAgICBmb3IgKGxldCBpID0gc3RhdGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIChub2RlID0gbm9kZXNbaV0pICYmIG5vZGUuJCgpO1xuICAgIChub2RlID0gZ2V0Tm9kZShub2RlcywgXCJsZW5ndGhcIiwgbGVuKSkgJiYgbm9kZS4kKHN0YXRlLmxlbmd0aCk7XG4gIH1cbiAgKG5vZGUgPSBub2Rlc1skU0VMRl0pICYmIG5vZGUuJCgpO1xufVxuZnVuY3Rpb24gbWVyZ2VTdG9yZU5vZGUoc3RhdGUsIHZhbHVlKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgc2V0UHJvcGVydHkoc3RhdGUsIGtleSwgdmFsdWVba2V5XSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZUFycmF5KGN1cnJlbnQsIG5leHQpIHtcbiAgaWYgKHR5cGVvZiBuZXh0ID09PSBcImZ1bmN0aW9uXCIpIG5leHQgPSBuZXh0KGN1cnJlbnQpO1xuICBuZXh0ID0gdW53cmFwKG5leHQpO1xuICBpZiAoQXJyYXkuaXNBcnJheShuZXh0KSkge1xuICAgIGlmIChjdXJyZW50ID09PSBuZXh0KSByZXR1cm47XG4gICAgbGV0IGkgPSAwLFxuICAgICAgbGVuID0gbmV4dC5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBuZXh0W2ldO1xuICAgICAgaWYgKGN1cnJlbnRbaV0gIT09IHZhbHVlKSBzZXRQcm9wZXJ0eShjdXJyZW50LCBpLCB2YWx1ZSk7XG4gICAgfVxuICAgIHNldFByb3BlcnR5KGN1cnJlbnQsIFwibGVuZ3RoXCIsIGxlbik7XG4gIH0gZWxzZSBtZXJnZVN0b3JlTm9kZShjdXJyZW50LCBuZXh0KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVBhdGgoY3VycmVudCwgcGF0aCwgdHJhdmVyc2VkID0gW10pIHtcbiAgbGV0IHBhcnQsXG4gICAgcHJldiA9IGN1cnJlbnQ7XG4gIGlmIChwYXRoLmxlbmd0aCA+IDEpIHtcbiAgICBwYXJ0ID0gcGF0aC5zaGlmdCgpO1xuICAgIGNvbnN0IHBhcnRUeXBlID0gdHlwZW9mIHBhcnQsXG4gICAgICBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShjdXJyZW50KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJ0KSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHVwZGF0ZVBhdGgoY3VycmVudCwgW3BhcnRbaV1dLmNvbmNhdChwYXRoKSwgdHJhdmVyc2VkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkgJiYgcGFydFR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0KGN1cnJlbnRbaV0sIGkpKSB1cGRhdGVQYXRoKGN1cnJlbnQsIFtpXS5jb25jYXQocGF0aCksIHRyYXZlcnNlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChpc0FycmF5ICYmIHBhcnRUeXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBjb25zdCB7IGZyb20gPSAwLCB0byA9IGN1cnJlbnQubGVuZ3RoIC0gMSwgYnkgPSAxIH0gPSBwYXJ0O1xuICAgICAgZm9yIChsZXQgaSA9IGZyb207IGkgPD0gdG87IGkgKz0gYnkpIHtcbiAgICAgICAgdXBkYXRlUGF0aChjdXJyZW50LCBbaV0uY29uY2F0KHBhdGgpLCB0cmF2ZXJzZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAocGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICB1cGRhdGVQYXRoKGN1cnJlbnRbcGFydF0sIHBhdGgsIFtwYXJ0XS5jb25jYXQodHJhdmVyc2VkKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHByZXYgPSBjdXJyZW50W3BhcnRdO1xuICAgIHRyYXZlcnNlZCA9IFtwYXJ0XS5jb25jYXQodHJhdmVyc2VkKTtcbiAgfVxuICBsZXQgdmFsdWUgPSBwYXRoWzBdO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YWx1ZSA9IHZhbHVlKHByZXYsIHRyYXZlcnNlZCk7XG4gICAgaWYgKHZhbHVlID09PSBwcmV2KSByZXR1cm47XG4gIH1cbiAgaWYgKHBhcnQgPT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA9PSB1bmRlZmluZWQpIHJldHVybjtcbiAgdmFsdWUgPSB1bndyYXAodmFsdWUpO1xuICBpZiAocGFydCA9PT0gdW5kZWZpbmVkIHx8IChpc1dyYXBwYWJsZShwcmV2KSAmJiBpc1dyYXBwYWJsZSh2YWx1ZSkgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSkge1xuICAgIG1lcmdlU3RvcmVOb2RlKHByZXYsIHZhbHVlKTtcbiAgfSBlbHNlIHNldFByb3BlcnR5KGN1cnJlbnQsIHBhcnQsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKC4uLltzdG9yZSwgb3B0aW9uc10pIHtcbiAgY29uc3QgdW53cmFwcGVkU3RvcmUgPSB1bndyYXAoc3RvcmUgfHwge30pO1xuICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSh1bndyYXBwZWRTdG9yZSk7XG4gIGNvbnN0IHdyYXBwZWRTdG9yZSA9IHdyYXAkMSh1bndyYXBwZWRTdG9yZSk7XG4gIGZ1bmN0aW9uIHNldFN0b3JlKC4uLmFyZ3MpIHtcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBpc0FycmF5ICYmIGFyZ3MubGVuZ3RoID09PSAxXG4gICAgICAgID8gdXBkYXRlQXJyYXkodW53cmFwcGVkU3RvcmUsIGFyZ3NbMF0pXG4gICAgICAgIDogdXBkYXRlUGF0aCh1bndyYXBwZWRTdG9yZSwgYXJncyk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIFt3cmFwcGVkU3RvcmUsIHNldFN0b3JlXTtcbn1cblxuY29uc3Qgbm9vcCA9ICgpID0+IHtcbiAgICAvKiBub29wICovXG59O1xuY29uc3Qgbm9vcFRyYW5zaXRpb24gPSAoZWwsIGRvbmUpID0+IGRvbmUoKTtcbi8qKlxuICogQ3JlYXRlIGFuIGVsZW1lbnQgdHJhbnNpdGlvbiBpbnRlcmZhY2UgZm9yIHN3aXRjaGluZyBiZXR3ZWVuIHNpbmdsZSBlbGVtZW50cy5cbiAqIEl0IGNhbiBiZSB1c2VkIHRvIGltcGxlbWVudCBvd24gdHJhbnNpdGlvbiBlZmZlY3QsIG9yIGEgY3VzdG9tIGA8VHJhbnNpdGlvbj5gLWxpa2UgY29tcG9uZW50LlxuICpcbiAqIEl0IHdpbGwgb2JzZXJ2ZSB7QGxpbmsgc291cmNlfSBhbmQgcmV0dXJuIGEgc2lnbmFsIHdpdGggYXJyYXkgb2YgZWxlbWVudHMgdG8gYmUgcmVuZGVyZWQgKGN1cnJlbnQgb25lIGFuZCBleGl0aW5nIG9uZXMpLlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgYSBzaWduYWwgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LiBBbnkgbnVsbGlzaCB2YWx1ZSB3aWxsIG1lYW4gdGhlcmUgaXMgbm8gZWxlbWVudC5cbiAqIEFueSBvYmplY3QgY2FuIHVzZWQgYXMgdGhlIHNvdXJjZSwgYnV0IG1vc3QgbGlrZWx5IHlvdSB3aWxsIHdhbnQgdG8gdXNlIGEgYEhUTUxFbGVtZW50YCBvciBgU1ZHRWxlbWVudGAuXG4gKiBAcGFyYW0gb3B0aW9ucyB0cmFuc2l0aW9uIG9wdGlvbnMge0BsaW5rIFN3aXRjaFRyYW5zaXRpb25PcHRpb25zfVxuICogQHJldHVybnMgYSBzaWduYWwgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBlbGVtZW50IGFuZCBleGl0aW5nIHByZXZpb3VzIGVsZW1lbnRzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3NvbGlkanMtY29tbXVuaXR5L3NvbGlkLXByaW1pdGl2ZXMvdHJlZS9tYWluL3BhY2thZ2VzL3RyYW5zaXRpb24tZ3JvdXAjY3JlYXRlU3dpdGNoVHJhbnNpdGlvblxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBbZWwsIHNldEVsXSA9IGNyZWF0ZVNpZ25hbDxIVE1MRGl2RWxlbWVudD4oKTtcbiAqXG4gKiBjb25zdCByZW5kZXJlZCA9IGNyZWF0ZVN3aXRjaFRyYW5zaXRpb24oZWwsIHtcbiAqICAgb25FbnRlcihlbCwgZG9uZSkge1xuICogICAgIC8vIHRoZSBlbnRlciBjYWxsYmFjayBpcyBjYWxsZWQgYmVmb3JlIHRoZSBlbGVtZW50IGlzIGluc2VydGVkIGludG8gdGhlIERPTVxuICogICAgIC8vIHNvIHJ1biB0aGUgYW5pbWF0aW9uIGluIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZSAvIG1pY3JvdGFza1xuICogICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHsgLi4uIH0pXG4gKiAgIH0sXG4gKiAgIG9uRXhpdChlbCwgZG9uZSkge1xuICogICAgIC8vIHRoZSBleGl0dGluZyBlbGVtZW50IGlzIGtlcHQgaW4gdGhlIERPTSB1bnRpbCB0aGUgZG9uZSgpIGNhbGxiYWNrIGlzIGNhbGxlZFxuICogICB9LFxuICogfSlcbiAqXG4gKiAvLyBjaGFuZ2UgdGhlIHNvdXJjZSB0byB0cmlnZ2VyIHRoZSB0cmFuc2l0aW9uXG4gKiBzZXRFbChyZWZUb0h0bWxFbGVtZW50KTtcbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3dpdGNoVHJhbnNpdGlvbihzb3VyY2UsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpbml0U291cmNlID0gdW50cmFjayhzb3VyY2UpO1xuICAgIGNvbnN0IGluaXRSZXR1cm5lZCA9IGluaXRTb3VyY2UgPyBbaW5pdFNvdXJjZV0gOiBbXTtcbiAgICBjb25zdCB7IG9uRW50ZXIgPSBub29wVHJhbnNpdGlvbiwgb25FeGl0ID0gbm9vcFRyYW5zaXRpb24gfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgW3JldHVybmVkLCBzZXRSZXR1cm5lZF0gPSBjcmVhdGVTaWduYWwob3B0aW9ucy5hcHBlYXIgPyBbXSA6IGluaXRSZXR1cm5lZCk7XG4gICAgY29uc3QgW2lzVHJhbnNpdGlvblBlbmRpbmddID0gdXNlVHJhbnNpdGlvbigpO1xuICAgIGxldCBuZXh0O1xuICAgIGxldCBpc0V4aXRpbmcgPSBmYWxzZTtcbiAgICBmdW5jdGlvbiBleGl0VHJhbnNpdGlvbihlbCwgYWZ0ZXIpIHtcbiAgICAgICAgaWYgKCFlbClcbiAgICAgICAgICAgIHJldHVybiBhZnRlciAmJiBhZnRlcigpO1xuICAgICAgICBpc0V4aXRpbmcgPSB0cnVlO1xuICAgICAgICBvbkV4aXQoZWwsICgpID0+IHtcbiAgICAgICAgICAgIGJhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpc0V4aXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZXRSZXR1cm5lZChwID0+IHAuZmlsdGVyKGUgPT4gZSAhPT0gZWwpKTtcbiAgICAgICAgICAgICAgICBhZnRlciAmJiBhZnRlcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbnRlclRyYW5zaXRpb24oYWZ0ZXIpIHtcbiAgICAgICAgY29uc3QgZWwgPSBuZXh0O1xuICAgICAgICBpZiAoIWVsKVxuICAgICAgICAgICAgcmV0dXJuIGFmdGVyICYmIGFmdGVyKCk7XG4gICAgICAgIG5leHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHNldFJldHVybmVkKHAgPT4gW2VsLCAuLi5wXSk7XG4gICAgICAgIG9uRW50ZXIoZWwsIGFmdGVyID8/IG5vb3ApO1xuICAgIH1cbiAgICBjb25zdCB0cmlnZ2VyVHJhbnNpdGlvbnMgPSBvcHRpb25zLm1vZGUgPT09IFwib3V0LWluXCJcbiAgICAgICAgPyAvLyBleGl0IC0+IGVudGVyXG4gICAgICAgICAgICAvLyBleGl0IC0+IGVudGVyXG4gICAgICAgICAgICBwcmV2ID0+IGlzRXhpdGluZyB8fCBleGl0VHJhbnNpdGlvbihwcmV2LCBlbnRlclRyYW5zaXRpb24pXG4gICAgICAgIDogb3B0aW9ucy5tb2RlID09PSBcImluLW91dFwiXG4gICAgICAgICAgICA/IC8vIGVudGVyIC0+IGV4aXRcbiAgICAgICAgICAgICAgICAvLyBlbnRlciAtPiBleGl0XG4gICAgICAgICAgICAgICAgcHJldiA9PiBlbnRlclRyYW5zaXRpb24oKCkgPT4gZXhpdFRyYW5zaXRpb24ocHJldikpXG4gICAgICAgICAgICA6IC8vIGV4aXQgJiBlbnRlclxuICAgICAgICAgICAgICAgIC8vIGV4aXQgJiBlbnRlclxuICAgICAgICAgICAgICAgIHByZXYgPT4ge1xuICAgICAgICAgICAgICAgICAgICBleGl0VHJhbnNpdGlvbihwcmV2KTtcbiAgICAgICAgICAgICAgICAgICAgZW50ZXJUcmFuc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICBjcmVhdGVDb21wdXRlZCgocHJldikgPT4ge1xuICAgICAgICBjb25zdCBlbCA9IHNvdXJjZSgpO1xuICAgICAgICBpZiAodW50cmFjayhpc1RyYW5zaXRpb25QZW5kaW5nKSkge1xuICAgICAgICAgICAgLy8gd2FpdCBmb3IgcGVuZGluZyB0cmFuc2l0aW9uIHRvIGVuZCBiZWZvcmUgYW5pbWF0aW5nXG4gICAgICAgICAgICBpc1RyYW5zaXRpb25QZW5kaW5nKCk7XG4gICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWwgIT09IHByZXYpIHtcbiAgICAgICAgICAgIG5leHQgPSBlbDtcbiAgICAgICAgICAgIGJhdGNoKCgpID0+IHVudHJhY2soKCkgPT4gdHJpZ2dlclRyYW5zaXRpb25zKHByZXYpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH0sIG9wdGlvbnMuYXBwZWFyID8gdW5kZWZpbmVkIDogaW5pdFNvdXJjZSk7XG4gICAgcmV0dXJuIHJldHVybmVkO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcHJlZGljYXRlIHVzZWQgaW4gYHJlc29sdmVFbGVtZW50cygpYCBhbmQgYHJlc29sdmVGaXJzdCgpYCB0byBmaWx0ZXIgRWxlbWVudHMuXG4gKlxuICogT24gdGhlIGNsaWVudCBpdCB1c2VzIGBpbnN0YW5jZW9mIEVsZW1lbnRgIGNoZWNrLCBvbiB0aGUgc2VydmVyIGl0IGNoZWNrcyBmb3IgdGhlIG9iamVjdCB3aXRoIGB0YCBwcm9wZXJ0eS4gKGdlbmVyYXRlZCBieSBjb21waWxpbmcgSlNYKVxuICovXG5jb25zdCBkZWZhdWx0RWxlbWVudFByZWRpY2F0ZSA9IChpdGVtKSA9PiBpdGVtIGluc3RhbmNlb2YgRWxlbWVudDtcbi8qKlxuICogVXRpbGl0eSBmb3IgcmVzb2x2aW5nIHJlY3Vyc2l2ZWx5IG5lc3RlZCBKU1ggY2hpbGRyZW4gaW4gc2VhcmNoIG9mIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyBhIHByZWRpY2F0ZS5cbiAqXG4gKiBJdCBkb2VzICoqbm90KiogY3JlYXRlIGEgY29tcHV0YXRpb24gLSBzaG91bGQgYmUgd3JhcHBlZCBpbiBvbmUgdG8gcmVwZWF0IHRoZSByZXNvbHV0aW9uIG9uIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHZhbHVlIEpTWCBjaGlsZHJlblxuICogQHBhcmFtIHByZWRpY2F0ZSBwcmVkaWNhdGUgdG8gZmlsdGVyIGVsZW1lbnRzXG4gKiBAcmV0dXJucyBzaW5nbGUgZm91bmQgZWxlbWVudCBvciBgbnVsbGAgaWYgbm8gZWxlbWVudHMgd2VyZSBmb3VuZFxuICovXG5mdW5jdGlvbiBnZXRGaXJzdENoaWxkKHZhbHVlLCBwcmVkaWNhdGUpIHtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiAmJiAhdmFsdWUubGVuZ3RoKVxuICAgICAgICByZXR1cm4gZ2V0Rmlyc3RDaGlsZCh2YWx1ZSgpLCBwcmVkaWNhdGUpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEZpcnN0Q2hpbGQoaXRlbSwgcHJlZGljYXRlKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHJlc29sdmVGaXJzdChmbiwgcHJlZGljYXRlID0gZGVmYXVsdEVsZW1lbnRQcmVkaWNhdGUsIHNlcnZlclByZWRpY2F0ZSA9IGRlZmF1bHRFbGVtZW50UHJlZGljYXRlKSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBjcmVhdGVNZW1vKGZuKTtcbiAgICByZXR1cm4gY3JlYXRlTWVtbygoKSA9PiBnZXRGaXJzdENoaWxkKGNoaWxkcmVuKCksIHByZWRpY2F0ZSkpO1xufVxuXG4vLyBzcmMvY29tbW9uLnRzXG5mdW5jdGlvbiBjcmVhdGVDbGFzc25hbWVzKHByb3BzKSB7XG4gIHJldHVybiBjcmVhdGVNZW1vKCgpID0+IHtcbiAgICBjb25zdCBuYW1lID0gcHJvcHMubmFtZSB8fCBcInNcIjtcbiAgICByZXR1cm4ge1xuICAgICAgZW50ZXJBY3RpdmU6IChwcm9wcy5lbnRlckFjdGl2ZUNsYXNzIHx8IG5hbWUgKyBcIi1lbnRlci1hY3RpdmVcIikuc3BsaXQoXCIgXCIpLFxuICAgICAgZW50ZXI6IChwcm9wcy5lbnRlckNsYXNzIHx8IG5hbWUgKyBcIi1lbnRlclwiKS5zcGxpdChcIiBcIiksXG4gICAgICBlbnRlclRvOiAocHJvcHMuZW50ZXJUb0NsYXNzIHx8IG5hbWUgKyBcIi1lbnRlci10b1wiKS5zcGxpdChcIiBcIiksXG4gICAgICBleGl0QWN0aXZlOiAocHJvcHMuZXhpdEFjdGl2ZUNsYXNzIHx8IG5hbWUgKyBcIi1leGl0LWFjdGl2ZVwiKS5zcGxpdChcIiBcIiksXG4gICAgICBleGl0OiAocHJvcHMuZXhpdENsYXNzIHx8IG5hbWUgKyBcIi1leGl0XCIpLnNwbGl0KFwiIFwiKSxcbiAgICAgIGV4aXRUbzogKHByb3BzLmV4aXRUb0NsYXNzIHx8IG5hbWUgKyBcIi1leGl0LXRvXCIpLnNwbGl0KFwiIFwiKSxcbiAgICAgIG1vdmU6IChwcm9wcy5tb3ZlQ2xhc3MgfHwgbmFtZSArIFwiLW1vdmVcIikuc3BsaXQoXCIgXCIpXG4gICAgfTtcbiAgfSk7XG59XG5mdW5jdGlvbiBuZXh0RnJhbWUoZm4pIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShmbikpO1xufVxuZnVuY3Rpb24gZW50ZXJUcmFuc2l0aW9uKGNsYXNzZXMsIGV2ZW50cywgZWwsIGRvbmUpIHtcbiAgY29uc3QgeyBvbkJlZm9yZUVudGVyLCBvbkVudGVyLCBvbkFmdGVyRW50ZXIgfSA9IGV2ZW50cztcbiAgb25CZWZvcmVFbnRlcj8uKGVsKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzLmVudGVyKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzLmVudGVyQWN0aXZlKTtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlmICghZWwucGFyZW50Tm9kZSlcbiAgICAgIHJldHVybiBkb25lPy4oKTtcbiAgICBvbkVudGVyPy4oZWwsICgpID0+IGVuZFRyYW5zaXRpb24oKSk7XG4gIH0pO1xuICBuZXh0RnJhbWUoKCkgPT4ge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcy5lbnRlcik7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzLmVudGVyVG8pO1xuICAgIGlmICghb25FbnRlciB8fCBvbkVudGVyLmxlbmd0aCA8IDIpIHtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGVuZFRyYW5zaXRpb24pO1xuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBlbmRUcmFuc2l0aW9uKTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBlbmRUcmFuc2l0aW9uKGUpIHtcbiAgICBpZiAoIWUgfHwgZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICBkb25lPy4oKTtcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGVuZFRyYW5zaXRpb24pO1xuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBlbmRUcmFuc2l0aW9uKTtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcy5lbnRlckFjdGl2ZSk7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMuZW50ZXJUbyk7XG4gICAgICBvbkFmdGVyRW50ZXI/LihlbCk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBleGl0VHJhbnNpdGlvbihjbGFzc2VzLCBldmVudHMsIGVsLCBkb25lKSB7XG4gIGNvbnN0IHsgb25CZWZvcmVFeGl0LCBvbkV4aXQsIG9uQWZ0ZXJFeGl0IH0gPSBldmVudHM7XG4gIGlmICghZWwucGFyZW50Tm9kZSlcbiAgICByZXR1cm4gZG9uZT8uKCk7XG4gIG9uQmVmb3JlRXhpdD8uKGVsKTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzLmV4aXQpO1xuICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMuZXhpdEFjdGl2ZSk7XG4gIG9uRXhpdD8uKGVsLCAoKSA9PiBlbmRUcmFuc2l0aW9uKCkpO1xuICBuZXh0RnJhbWUoKCkgPT4ge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcy5leGl0KTtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMuZXhpdFRvKTtcbiAgICBpZiAoIW9uRXhpdCB8fCBvbkV4aXQubGVuZ3RoIDwgMikge1xuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZW5kVHJhbnNpdGlvbik7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGVuZFRyYW5zaXRpb24pO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIGVuZFRyYW5zaXRpb24oZSkge1xuICAgIGlmICghZSB8fCBlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgIGRvbmU/LigpO1xuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZW5kVHJhbnNpdGlvbik7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGVuZFRyYW5zaXRpb24pO1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzLmV4aXRBY3RpdmUpO1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzLmV4aXRUbyk7XG4gICAgICBvbkFmdGVyRXhpdD8uKGVsKTtcbiAgICB9XG4gIH1cbn1cbnZhciBUUkFOU0lUSU9OX01PREVfTUFQID0ge1xuICBpbm91dDogXCJpbi1vdXRcIixcbiAgb3V0aW46IFwib3V0LWluXCJcbn07XG52YXIgVHJhbnNpdGlvbiA9IChwcm9wcykgPT4ge1xuICBjb25zdCBjbGFzc25hbWVzID0gY3JlYXRlQ2xhc3NuYW1lcyhwcm9wcyk7XG4gIHJldHVybiBjcmVhdGVTd2l0Y2hUcmFuc2l0aW9uKFxuICAgIHJlc29sdmVGaXJzdCgoKSA9PiBwcm9wcy5jaGlsZHJlbiksXG4gICAge1xuICAgICAgbW9kZTogVFJBTlNJVElPTl9NT0RFX01BUFtwcm9wcy5tb2RlXSxcbiAgICAgIGFwcGVhcjogcHJvcHMuYXBwZWFyLFxuICAgICAgb25FbnRlcihlbCwgZG9uZSkge1xuICAgICAgICBlbnRlclRyYW5zaXRpb24oY2xhc3NuYW1lcygpLCBwcm9wcywgZWwsIGRvbmUpO1xuICAgICAgfSxcbiAgICAgIG9uRXhpdChlbCwgZG9uZSkge1xuICAgICAgICBleGl0VHJhbnNpdGlvbihjbGFzc25hbWVzKCksIHByb3BzLCBlbCwgZG9uZSk7XG4gICAgICB9XG4gICAgfVxuICApO1xufTtcblxuY29uc3QgX3RtcGwkJGUgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxkaXYgY2xhc3M9XCJhcC10ZXJtXCI+PGNhbnZhcz48L2NhbnZhcz48c3ZnIGNsYXNzPVwiYXAtdGVybS1zeW1ib2xzXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjxkZWZzPjwvZGVmcz48Zz48L2c+PC9zdmc+PHByZSBjbGFzcz1cImFwLXRlcm0tdGV4dFwiIGFyaWEtbGl2ZT1cIm9mZlwiIHRhYmluZGV4PVwiMFwiPjwvcHJlPjwvZGl2PmAsIDEyKTtcbmNvbnN0IFNWR19OUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbmNvbnN0IEJMT0NLX0hfUkVTID0gODtcbmNvbnN0IEJMT0NLX1ZfUkVTID0gMjQ7XG5jb25zdCBCT0xEX01BU0sgPSAxO1xuY29uc3QgRkFJTlRfTUFTSyA9IDEgPDwgMTtcbmNvbnN0IElUQUxJQ19NQVNLID0gMSA8PCAyO1xuY29uc3QgVU5ERVJMSU5FX01BU0sgPSAxIDw8IDM7XG5jb25zdCBTVFJJS0VUSFJPVUdIX01BU0sgPSAxIDw8IDQ7XG5jb25zdCBCTElOS19NQVNLID0gMSA8PCA1O1xudmFyIFRlcm1pbmFsID0gKHByb3BzID0+IHtcbiAgY29uc3QgY29yZSA9IHByb3BzLmNvcmU7XG4gIGNvbnN0IHRleHRSb3dQb29sID0gW107XG4gIGNvbnN0IHZlY3RvclN5bWJvbFJvd1Bvb2wgPSBbXTtcbiAgY29uc3QgdmVjdG9yU3ltYm9sVXNlUG9vbCA9IFtdO1xuICBjb25zdCB2ZWN0b3JTeW1ib2xEZWZDYWNoZSA9IG5ldyBTZXQoKTtcbiAgY29uc3QgY29sb3JzQ2FjaGUgPSBuZXcgTWFwKCk7XG4gIGNvbnN0IGF0dHJDbGFzc0NhY2hlID0gbmV3IE1hcCgpO1xuICBjb25zdCBbc2l6ZSwgc2V0U2l6ZV0gPSBjcmVhdGVTaWduYWwoe1xuICAgIGNvbHM6IHByb3BzLmNvbHMsXG4gICAgcm93czogcHJvcHMucm93c1xuICB9LCB7XG4gICAgZXF1YWxzOiAobmV3VmFsLCBvbGRWYWwpID0+IG5ld1ZhbC5jb2xzID09PSBvbGRWYWwuY29scyAmJiBuZXdWYWwucm93cyA9PT0gb2xkVmFsLnJvd3NcbiAgfSk7XG4gIGNvbnN0IFt0aGVtZSwgc2V0VGhlbWVdID0gY3JlYXRlU2lnbmFsKGJ1aWxkVGhlbWUoRkFMTEJBQ0tfVEhFTUUpKTtcbiAgY29uc3QgbGluZUhlaWdodCA9ICgpID0+IHByb3BzLmxpbmVIZWlnaHQgPz8gMS4zMzMzMzMzMzMzO1xuICBjb25zdCBbYmxpbmtPbiwgc2V0QmxpbmtPbl0gPSBjcmVhdGVTaWduYWwodHJ1ZSk7XG4gIGNvbnN0IGN1cnNvck9uID0gY3JlYXRlTWVtbygoKSA9PiBibGlua09uKCkgfHwgY3Vyc29ySG9sZCk7XG4gIGNvbnN0IHN0eWxlJDEgPSBjcmVhdGVNZW1vKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IGAke3NpemUoKS5jb2xzfWNoYCxcbiAgICAgIGhlaWdodDogYCR7bGluZUhlaWdodCgpICogc2l6ZSgpLnJvd3N9ZW1gLFxuICAgICAgXCJmb250LXNpemVcIjogYCR7KHByb3BzLnNjYWxlIHx8IDEuMCkgKiAxMDB9JWAsXG4gICAgICBcIi0tdGVybS1saW5lLWhlaWdodFwiOiBgJHtsaW5lSGVpZ2h0KCl9ZW1gLFxuICAgICAgXCItLXRlcm0tY29sc1wiOiBzaXplKCkuY29scyxcbiAgICAgIFwiLS10ZXJtLXJvd3NcIjogc2l6ZSgpLnJvd3NcbiAgICB9O1xuICB9KTtcbiAgbGV0IGN1cnNvciA9IHtcbiAgICBjb2w6IDAsXG4gICAgcm93OiAwLFxuICAgIHZpc2libGU6IGZhbHNlXG4gIH07XG4gIGxldCBwZW5kaW5nQ2hhbmdlcyA9IHtcbiAgICBzaXplOiB1bmRlZmluZWQsXG4gICAgdGhlbWU6IHVuZGVmaW5lZCxcbiAgICByb3dzOiBuZXcgU2V0KClcbiAgfTtcbiAgbGV0IGVsO1xuICBsZXQgY2FudmFzRWw7XG4gIGxldCBjYW52YXNDdHg7XG4gIGxldCB0ZXh0RWw7XG4gIGxldCB2ZWN0b3JTeW1ib2xzRWw7XG4gIGxldCB2ZWN0b3JTeW1ib2xEZWZzRWw7XG4gIGxldCB2ZWN0b3JTeW1ib2xSb3dzRWw7XG4gIGxldCBmcmFtZVJlcXVlc3RJZDtcbiAgbGV0IGJsaW5rSW50ZXJ2YWxJZDtcbiAgbGV0IGNzc1RoZW1lO1xuICBsZXQgY3Vyc29ySG9sZCA9IGZhbHNlO1xuICBvbk1vdW50KCgpID0+IHtcbiAgICBzZXR1cENhbnZhcygpO1xuICAgIHNldEluaXRpYWxUaGVtZSgpO1xuICAgIGFkanVzdFRleHRSb3dOb2RlQ291bnQoc2l6ZSgpLnJvd3MpO1xuICAgIGFkanVzdFN5bWJvbFJvd05vZGVDb3VudChzaXplKCkucm93cyk7XG4gICAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwidnRVcGRhdGVcIiwgb25WdFVwZGF0ZSk7XG4gIH0pO1xuICBvbkNsZWFudXAoKCkgPT4ge1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZ0VXBkYXRlXCIsIG9uVnRVcGRhdGUpO1xuICAgIGNsZWFySW50ZXJ2YWwoYmxpbmtJbnRlcnZhbElkKTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShmcmFtZVJlcXVlc3RJZCk7XG4gIH0pO1xuICBjcmVhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChwcm9wcy5ibGlua2luZyAmJiBibGlua0ludGVydmFsSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYmxpbmtJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodG9nZ2xlQmxpbmssIDYwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoYmxpbmtJbnRlcnZhbElkKTtcbiAgICAgIGJsaW5rSW50ZXJ2YWxJZCA9IHVuZGVmaW5lZDtcbiAgICAgIHNldEJsaW5rT24odHJ1ZSk7XG4gICAgfVxuICB9KTtcbiAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBjdXJzb3JPbigpO1xuICAgIGlmIChjdXJzb3IudmlzaWJsZSkge1xuICAgICAgcGVuZGluZ0NoYW5nZXMucm93cy5hZGQoY3Vyc29yLnJvdyk7XG4gICAgICBzY2hlZHVsZVJlbmRlcigpO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIHNldHVwQ2FudmFzKCkge1xuICAgIGNhbnZhc0N0eCA9IGNhbnZhc0VsLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBpZiAoIWNhbnZhc0N0eCkgdGhyb3cgbmV3IEVycm9yKFwiMkQgY3R4IG5vdCBhdmFpbGFibGVcIik7XG4gICAgY29uc3Qge1xuICAgICAgY29scyxcbiAgICAgIHJvd3NcbiAgICB9ID0gc2l6ZSgpO1xuICAgIGNhbnZhc0VsLndpZHRoID0gY29scyAqIEJMT0NLX0hfUkVTO1xuICAgIGNhbnZhc0VsLmhlaWdodCA9IHJvd3MgKiBCTE9DS19WX1JFUztcbiAgICBjYW52YXNFbC5zdHlsZS5pbWFnZVJlbmRlcmluZyA9IFwicGl4ZWxhdGVkXCI7XG4gICAgY2FudmFzQ3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIHJlc2l6ZUNhbnZhcyhfcmVmKSB7XG4gICAgbGV0IHtcbiAgICAgIGNvbHMsXG4gICAgICByb3dzXG4gICAgfSA9IF9yZWY7XG4gICAgY2FudmFzRWwud2lkdGggPSBjb2xzICogQkxPQ0tfSF9SRVM7XG4gICAgY2FudmFzRWwuaGVpZ2h0ID0gcm93cyAqIEJMT0NLX1ZfUkVTO1xuICAgIGNhbnZhc0N0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBzZXRJbml0aWFsVGhlbWUoKSB7XG4gICAgY3NzVGhlbWUgPSBnZXRDc3NUaGVtZShlbCk7XG4gICAgcGVuZGluZ0NoYW5nZXMudGhlbWUgPSBjc3NUaGVtZTtcbiAgfVxuICBmdW5jdGlvbiBvblZ0VXBkYXRlKF9yZWYyKSB7XG4gICAgbGV0IHtcbiAgICAgIHNpemU6IG5ld1NpemUsXG4gICAgICB0aGVtZSxcbiAgICAgIGNoYW5nZWRSb3dzXG4gICAgfSA9IF9yZWYyO1xuICAgIGxldCBhY3Rpdml0eSA9IGZhbHNlO1xuICAgIGlmIChjaGFuZ2VkUm93cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiBjaGFuZ2VkUm93cykge1xuICAgICAgICBwZW5kaW5nQ2hhbmdlcy5yb3dzLmFkZChyb3cpO1xuICAgICAgICBjdXJzb3JIb2xkID0gdHJ1ZTtcbiAgICAgICAgYWN0aXZpdHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhlbWUgIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5wcmVmZXJFbWJlZGRlZFRoZW1lKSB7XG4gICAgICBwZW5kaW5nQ2hhbmdlcy50aGVtZSA9IHRoZW1lO1xuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgc2l6ZSgpLnJvd3M7IHJvdysrKSB7XG4gICAgICAgIHBlbmRpbmdDaGFuZ2VzLnJvd3MuYWRkKHJvdyk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG5ld0N1cnNvciA9IGNvcmUuZ2V0Q3Vyc29yKCk7XG4gICAgaWYgKG5ld0N1cnNvci52aXNpYmxlICE9IGN1cnNvci52aXNpYmxlIHx8IG5ld0N1cnNvci5jb2wgIT0gY3Vyc29yLmNvbCB8fCBuZXdDdXJzb3Iucm93ICE9IGN1cnNvci5yb3cpIHtcbiAgICAgIGlmIChjdXJzb3IudmlzaWJsZSkge1xuICAgICAgICBwZW5kaW5nQ2hhbmdlcy5yb3dzLmFkZChjdXJzb3Iucm93KTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXdDdXJzb3IudmlzaWJsZSkge1xuICAgICAgICBwZW5kaW5nQ2hhbmdlcy5yb3dzLmFkZChuZXdDdXJzb3Iucm93KTtcbiAgICAgIH1cbiAgICAgIGN1cnNvciA9IG5ld0N1cnNvcjtcbiAgICAgIGN1cnNvckhvbGQgPSB0cnVlO1xuICAgICAgYWN0aXZpdHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAobmV3U2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwZW5kaW5nQ2hhbmdlcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIHBlbmRpbmdDaGFuZ2VzLnJvd3MpIHtcbiAgICAgICAgaWYgKHJvdyA+PSBuZXdTaXplLnJvd3MpIHtcbiAgICAgICAgICBwZW5kaW5nQ2hhbmdlcy5yb3dzLmRlbGV0ZShyb3cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhY3Rpdml0eSAmJiBjdXJzb3IudmlzaWJsZSkge1xuICAgICAgcGVuZGluZ0NoYW5nZXMucm93cy5hZGQoY3Vyc29yLnJvdyk7XG4gICAgfVxuICAgIHNjaGVkdWxlUmVuZGVyKCk7XG4gIH1cbiAgZnVuY3Rpb24gdG9nZ2xlQmxpbmsoKSB7XG4gICAgc2V0QmxpbmtPbihibGluayA9PiB7XG4gICAgICBpZiAoIWJsaW5rKSBjdXJzb3JIb2xkID0gZmFsc2U7XG4gICAgICByZXR1cm4gIWJsaW5rO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHNjaGVkdWxlUmVuZGVyKCkge1xuICAgIGlmIChmcmFtZVJlcXVlc3RJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmcmFtZVJlcXVlc3RJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgZnJhbWVSZXF1ZXN0SWQgPSB1bmRlZmluZWQ7XG4gICAgY29uc3Qge1xuICAgICAgc2l6ZTogbmV3U2l6ZSxcbiAgICAgIHRoZW1lOiBuZXdUaGVtZSxcbiAgICAgIHJvd3NcbiAgICB9ID0gcGVuZGluZ0NoYW5nZXM7XG4gICAgYmF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKG5ld1NpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXNpemVDYW52YXMobmV3U2l6ZSk7XG4gICAgICAgIGFkanVzdFRleHRSb3dOb2RlQ291bnQobmV3U2l6ZS5yb3dzKTtcbiAgICAgICAgYWRqdXN0U3ltYm9sUm93Tm9kZUNvdW50KG5ld1NpemUucm93cyk7XG4gICAgICAgIHNldFNpemUobmV3U2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAobmV3VGhlbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobmV3VGhlbWUgPT09IG51bGwpIHtcbiAgICAgICAgICBzZXRUaGVtZShidWlsZFRoZW1lKGNzc1RoZW1lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0VGhlbWUoYnVpbGRUaGVtZShuZXdUaGVtZSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbG9yc0NhY2hlLmNsZWFyKCk7XG4gICAgICB9XG4gICAgICBjb25zdCB0aGVtZV8gPSB0aGVtZSgpO1xuICAgICAgY29uc3QgY3Vyc29yT25fID0gYmxpbmtPbigpIHx8IGN1cnNvckhvbGQ7XG4gICAgICBmb3IgKGNvbnN0IHIgb2Ygcm93cykge1xuICAgICAgICByZW5kZXJSb3cociwgdGhlbWVfLCBjdXJzb3JPbl8pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHBlbmRpbmdDaGFuZ2VzLnNpemUgPSB1bmRlZmluZWQ7XG4gICAgcGVuZGluZ0NoYW5nZXMudGhlbWUgPSB1bmRlZmluZWQ7XG4gICAgcGVuZGluZ0NoYW5nZXMucm93cy5jbGVhcigpO1xuICAgIHByb3BzLnN0YXRzLnJlbmRlcnMgKz0gMTtcbiAgfVxuICBmdW5jdGlvbiByZW5kZXJSb3cocm93SW5kZXgsIHRoZW1lLCBjdXJzb3JPbikge1xuICAgIGNvbnN0IGxpbmUgPSBjb3JlLmdldExpbmUocm93SW5kZXgsIGN1cnNvck9uKTtcbiAgICBjbGVhckNhbnZhc1Jvdyhyb3dJbmRleCk7XG4gICAgcmVuZGVyUm93Qmcocm93SW5kZXgsIGxpbmUuYmcsIHRoZW1lKTtcbiAgICByZW5kZXJSb3dSYXN0ZXJTeW1ib2xzKHJvd0luZGV4LCBsaW5lLnJhc3Rlcl9zeW1ib2xzLCB0aGVtZSk7XG4gICAgcmVuZGVyUm93VmVjdG9yU3ltYm9scyhyb3dJbmRleCwgbGluZS52ZWN0b3Jfc3ltYm9scywgdGhlbWUpO1xuICAgIHJlbmRlclJvd1RleHQocm93SW5kZXgsIGxpbmUudGV4dCwgbGluZS5jb2RlcG9pbnRzLCB0aGVtZSk7XG4gIH1cbiAgZnVuY3Rpb24gY2xlYXJDYW52YXNSb3cocm93SW5kZXgpIHtcbiAgICBjYW52YXNDdHguY2xlYXJSZWN0KDAsIHJvd0luZGV4ICogQkxPQ0tfVl9SRVMsIHNpemUoKS5jb2xzICogQkxPQ0tfSF9SRVMsIEJMT0NLX1ZfUkVTKTtcbiAgfVxuICBmdW5jdGlvbiByZW5kZXJSb3dCZyhyb3dJbmRleCwgc3BhbnMsIHRoZW1lKSB7XG4gICAgLy8gVGhlIG1lbW9yeSBsYXlvdXQgb2YgYSBCZ1NwYW4gbXVzdCBmb2xsb3cgb25lIGRlZmluZWQgaW4gbGliLnJzIChzZWUgdGhlIGFzc2VydGlvbnMgYXQgdGhlIGJvdHRvbSlcbiAgICBjb25zdCB2aWV3ID0gY29yZS5nZXREYXRhVmlldyhzcGFucywgOCk7XG4gICAgY29uc3QgeSA9IHJvd0luZGV4ICogQkxPQ0tfVl9SRVM7XG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgdmlldy5ieXRlTGVuZ3RoKSB7XG4gICAgICBjb25zdCBjb2x1bW4gPSB2aWV3LmdldFVpbnQxNihpICsgMCwgdHJ1ZSk7XG4gICAgICBjb25zdCB3aWR0aCA9IHZpZXcuZ2V0VWludDE2KGkgKyAyLCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3IodmlldywgaSArIDQsIHRoZW1lKTtcbiAgICAgIGkgKz0gODtcbiAgICAgIGNhbnZhc0N0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgIGNhbnZhc0N0eC5maWxsUmVjdChjb2x1bW4gKiBCTE9DS19IX1JFUywgeSwgd2lkdGggKiBCTE9DS19IX1JFUywgQkxPQ0tfVl9SRVMpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiByZW5kZXJSb3dSYXN0ZXJTeW1ib2xzKHJvd0luZGV4LCBzeW1ib2xzLCB0aGVtZSkge1xuICAgIC8vIFRoZSBtZW1vcnkgbGF5b3V0IG9mIGEgUmFzdGVyU3ltYm9sIG11c3QgZm9sbG93IG9uZSBkZWZpbmVkIGluIGxpYi5ycyAoc2VlIHRoZSBhc3NlcnRpb25zIGF0IHRoZSBib3R0b20pXG4gICAgY29uc3QgdmlldyA9IGNvcmUuZ2V0RGF0YVZpZXcoc3ltYm9scywgMTIpO1xuICAgIGNvbnN0IHkgPSByb3dJbmRleCAqIEJMT0NLX1ZfUkVTO1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHZpZXcuYnl0ZUxlbmd0aCkge1xuICAgICAgY29uc3QgY29sdW1uID0gdmlldy5nZXRVaW50MTYoaSArIDAsIHRydWUpO1xuICAgICAgY29uc3QgY29kZXBvaW50ID0gdmlldy5nZXRVaW50MzIoaSArIDQsIHRydWUpO1xuICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvcih2aWV3LCBpICsgOCwgdGhlbWUpIHx8IHRoZW1lLmZnO1xuICAgICAgaSArPSAxMjtcbiAgICAgIGNhbnZhc0N0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgIGRyYXdCbG9ja0dseXBoKGNhbnZhc0N0eCwgY29kZXBvaW50LCBjb2x1bW4gKiBCTE9DS19IX1JFUywgeSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHJlbmRlclJvd1ZlY3RvclN5bWJvbHMocm93SW5kZXgsIHN5bWJvbHMsIHRoZW1lKSB7XG4gICAgLy8gVGhlIG1lbW9yeSBsYXlvdXQgb2YgYSBWZWN0b3JTeW1ib2wgbXVzdCBmb2xsb3cgb25lIGRlZmluZWQgaW4gbGliLnJzIChzZWUgdGhlIGFzc2VydGlvbnMgYXQgdGhlIGJvdHRvbSlcbiAgICBjb25zdCB2aWV3ID0gY29yZS5nZXREYXRhVmlldyhzeW1ib2xzLCAxNik7XG4gICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCBzeW1ib2xSb3cgPSB2ZWN0b3JTeW1ib2xSb3dzRWwuY2hpbGRyZW5bcm93SW5kZXhdO1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHZpZXcuYnl0ZUxlbmd0aCkge1xuICAgICAgY29uc3QgY29sdW1uID0gdmlldy5nZXRVaW50MTYoaSArIDAsIHRydWUpO1xuICAgICAgY29uc3QgY29kZXBvaW50ID0gdmlldy5nZXRVaW50MzIoaSArIDQsIHRydWUpO1xuICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvcih2aWV3LCBpICsgOCwgdGhlbWUpO1xuICAgICAgY29uc3QgYXR0cnMgPSB2aWV3LmdldFVpbnQ4KGkgKyAxMik7XG4gICAgICBpICs9IDE2O1xuICAgICAgY29uc3QgYmxpbmsgPSAoYXR0cnMgJiBCTElOS19NQVNLKSAhPT0gMDtcbiAgICAgIGNvbnN0IGVsID0gY3JlYXRlVmVjdG9yU3ltYm9sTm9kZShjb2RlcG9pbnQsIGNvbHVtbiwgY29sb3IsIGJsaW5rKTtcbiAgICAgIGlmIChlbCkge1xuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVjeWNsZVZlY3RvclN5bWJvbFVzZXMoc3ltYm9sUm93KTtcbiAgICBzeW1ib2xSb3cucmVwbGFjZUNoaWxkcmVuKGZyYWcpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbmRlclJvd1RleHQocm93SW5kZXgsIHNwYW5zLCBjb2RlcG9pbnRzLCB0aGVtZSkge1xuICAgIC8vIFRoZSBtZW1vcnkgbGF5b3V0IG9mIGEgVGV4dFNwYW4gbXVzdCBmb2xsb3cgb25lIGRlZmluZWQgaW4gbGliLnJzIChzZWUgdGhlIGFzc2VydGlvbnMgYXQgdGhlIGJvdHRvbSlcbiAgICBjb25zdCBzcGFuc1ZpZXcgPSBjb3JlLmdldERhdGFWaWV3KHNwYW5zLCAxMik7XG4gICAgY29uc3QgY29kZXBvaW50c1ZpZXcgPSBjb3JlLmdldFVpbnQzMkFycmF5KGNvZGVwb2ludHMpO1xuICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgc3BhbnNWaWV3LmJ5dGVMZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IHNwYW5zVmlldy5nZXRVaW50MTYoaSArIDAsIHRydWUpO1xuICAgICAgY29uc3QgY29kZXBvaW50c1N0YXJ0ID0gc3BhbnNWaWV3LmdldFVpbnQxNihpICsgMiwgdHJ1ZSk7XG4gICAgICBjb25zdCBsZW4gPSBzcGFuc1ZpZXcuZ2V0VWludDE2KGkgKyA0LCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3Ioc3BhbnNWaWV3LCBpICsgNiwgdGhlbWUpO1xuICAgICAgY29uc3QgYXR0cnMgPSBzcGFuc1ZpZXcuZ2V0VWludDgoaSArIDEwKTtcbiAgICAgIGNvbnN0IHRleHQgPSBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlcG9pbnRzVmlldy5zdWJhcnJheShjb2RlcG9pbnRzU3RhcnQsIGNvZGVwb2ludHNTdGFydCArIGxlbikpO1xuICAgICAgaSArPSAxMjtcbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBjb25zdCBzdHlsZSA9IGVsLnN0eWxlO1xuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoXCItLW9mZnNldFwiLCBjb2x1bW4pO1xuICAgICAgZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHN0eWxlLmNvbG9yID0gY29sb3I7XG4gICAgICB9XG4gICAgICBjb25zdCBjbHMgPSBnZXRBdHRyQ2xhc3MoYXR0cnMpO1xuICAgICAgaWYgKGNscyAhPT0gbnVsbCkge1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBjbHM7XG4gICAgICB9XG4gICAgICBmcmFnLmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgdGV4dEVsLmNoaWxkcmVuW3Jvd0luZGV4XS5yZXBsYWNlQ2hpbGRyZW4oZnJhZyk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0QXR0ckNsYXNzKGF0dHJzKSB7XG4gICAgbGV0IGMgPSBhdHRyQ2xhc3NDYWNoZS5nZXQoYXR0cnMpO1xuICAgIGlmIChjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGMgPSBidWlsZEF0dHJDbGFzcyhhdHRycyk7XG4gICAgICBhdHRyQ2xhc3NDYWNoZS5zZXQoYXR0cnMsIGMpO1xuICAgIH1cbiAgICByZXR1cm4gYztcbiAgfVxuICBmdW5jdGlvbiBidWlsZEF0dHJDbGFzcyhhdHRycykge1xuICAgIGxldCBjbHMgPSBcIlwiO1xuICAgIGlmICgoYXR0cnMgJiBCT0xEX01BU0spICE9PSAwKSB7XG4gICAgICBjbHMgKz0gXCJhcC1ib2xkIFwiO1xuICAgIH0gZWxzZSBpZiAoKGF0dHJzICYgRkFJTlRfTUFTSykgIT09IDApIHtcbiAgICAgIGNscyArPSBcImFwLWZhaW50IFwiO1xuICAgIH1cbiAgICBpZiAoKGF0dHJzICYgSVRBTElDX01BU0spICE9PSAwKSB7XG4gICAgICBjbHMgKz0gXCJhcC1pdGFsaWMgXCI7XG4gICAgfVxuICAgIGlmICgoYXR0cnMgJiBVTkRFUkxJTkVfTUFTSykgIT09IDApIHtcbiAgICAgIGNscyArPSBcImFwLXVuZGVybGluZSBcIjtcbiAgICB9XG4gICAgaWYgKChhdHRycyAmIFNUUklLRVRIUk9VR0hfTUFTSykgIT09IDApIHtcbiAgICAgIGNscyArPSBcImFwLXN0cmlrZSBcIjtcbiAgICB9XG4gICAgaWYgKChhdHRycyAmIEJMSU5LX01BU0spICE9PSAwKSB7XG4gICAgICBjbHMgKz0gXCJhcC1ibGluayBcIjtcbiAgICB9XG4gICAgcmV0dXJuIGNscyA9PT0gXCJcIiA/IG51bGwgOiBjbHM7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0Q29sb3Iodmlldywgb2Zmc2V0LCB0aGVtZSkge1xuICAgIGNvbnN0IHRhZyA9IHZpZXcuZ2V0VWludDgob2Zmc2V0KTtcbiAgICBpZiAodGFnID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoZW1lLmZnO1xuICAgIH0gZWxzZSBpZiAodGFnID09PSAyKSB7XG4gICAgICByZXR1cm4gdGhlbWUuYmc7XG4gICAgfSBlbHNlIGlmICh0YWcgPT09IDMpIHtcbiAgICAgIHJldHVybiB0aGVtZS5wYWxldHRlW3ZpZXcuZ2V0VWludDgob2Zmc2V0ICsgMSldO1xuICAgIH0gZWxzZSBpZiAodGFnID09PSA0KSB7XG4gICAgICBjb25zdCBrZXkgPSB2aWV3LmdldFVpbnQzMihvZmZzZXQsIHRydWUpO1xuICAgICAgbGV0IGMgPSBjb2xvcnNDYWNoZS5nZXQoa2V5KTtcbiAgICAgIGlmIChjID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgciA9IHZpZXcuZ2V0VWludDgob2Zmc2V0ICsgMSk7XG4gICAgICAgIGNvbnN0IGcgPSB2aWV3LmdldFVpbnQ4KG9mZnNldCArIDIpO1xuICAgICAgICBjb25zdCBiID0gdmlldy5nZXRVaW50OChvZmZzZXQgKyAzKTtcbiAgICAgICAgYyA9IFwicmdiKFwiICsgciArIFwiLFwiICsgZyArIFwiLFwiICsgYiArIFwiKVwiO1xuICAgICAgICBjb2xvcnNDYWNoZS5zZXQoa2V5LCBjKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgY29sb3IgdGFnOiAke3RhZ31gKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gYWRqdXN0VGV4dFJvd05vZGVDb3VudChyb3dzKSB7XG4gICAgbGV0IHIgPSB0ZXh0RWwuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIGlmIChyIDwgcm93cykge1xuICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHdoaWxlIChyIDwgcm93cykge1xuICAgICAgICBjb25zdCByb3cgPSBnZXROZXdSb3coKTtcbiAgICAgICAgcm93LnN0eWxlLnNldFByb3BlcnR5KFwiLS1yb3dcIiwgcik7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgciArPSAxO1xuICAgICAgfVxuICAgICAgdGV4dEVsLmFwcGVuZENoaWxkKGZyYWcpO1xuICAgIH1cbiAgICB3aGlsZSAodGV4dEVsLmNoaWxkcmVuLmxlbmd0aCA+IHJvd3MpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRleHRFbC5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgdGV4dEVsLnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgICB0ZXh0Um93UG9vbC5wdXNoKHJvdyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFkanVzdFN5bWJvbFJvd05vZGVDb3VudChyb3dzKSB7XG4gICAgbGV0IHIgPSB2ZWN0b3JTeW1ib2xSb3dzRWwuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIGlmIChyIDwgcm93cykge1xuICAgICAgY29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHdoaWxlIChyIDwgcm93cykge1xuICAgICAgICBjb25zdCByb3cgPSBnZXROZXdTeW1ib2xSb3coKTtcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAgJHtyfSlgKTtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICByICs9IDE7XG4gICAgICB9XG4gICAgICB2ZWN0b3JTeW1ib2xSb3dzRWwuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gICAgfVxuICAgIHdoaWxlICh2ZWN0b3JTeW1ib2xSb3dzRWwuY2hpbGRyZW4ubGVuZ3RoID4gcm93cykge1xuICAgICAgY29uc3Qgcm93ID0gdmVjdG9yU3ltYm9sUm93c0VsLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICB2ZWN0b3JTeW1ib2xSb3dzRWwucmVtb3ZlQ2hpbGQocm93KTtcbiAgICAgIHZlY3RvclN5bWJvbFJvd1Bvb2wucHVzaChyb3cpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXROZXdSb3coKSB7XG4gICAgbGV0IHJvdyA9IHRleHRSb3dQb29sLnBvcCgpO1xuICAgIGlmIChyb3cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICByb3cuY2xhc3NOYW1lID0gXCJhcC1saW5lXCI7XG4gICAgfVxuICAgIHJldHVybiByb3c7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TmV3U3ltYm9sUm93KCkge1xuICAgIGxldCByb3cgPSB2ZWN0b3JTeW1ib2xSb3dQb29sLnBvcCgpO1xuICAgIGlmIChyb3cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgXCJnXCIpO1xuICAgICAgcm93LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXAtc3ltYm9sLWxpbmVcIik7XG4gICAgfVxuICAgIHJldHVybiByb3c7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlVmVjdG9yU3ltYm9sTm9kZShjb2RlcG9pbnQsIGNvbHVtbiwgZmcsIGJsaW5rKSB7XG4gICAgaWYgKCFlbnN1cmVWZWN0b3JTeW1ib2xEZWYoY29kZXBvaW50KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGlzUG93ZXJsaW5lID0gUE9XRVJMSU5FX1NZTUJPTFMuaGFzKGNvZGVwb2ludCk7XG4gICAgY29uc3Qgc3ltYm9sWCA9IGlzUG93ZXJsaW5lID8gY29sdW1uIC0gUE9XRVJMSU5FX1NZTUJPTF9OVURHRSA6IGNvbHVtbjtcbiAgICBjb25zdCBzeW1ib2xXaWR0aCA9IGlzUG93ZXJsaW5lID8gMSArIFBPV0VSTElORV9TWU1CT0xfTlVER0UgKiAyIDogMTtcbiAgICBjb25zdCBub2RlID0gZ2V0VmVjdG9yU3ltYm9sVXNlKCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGAjc3ltLSR7Y29kZXBvaW50fWApO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKFwieFwiLCBzeW1ib2xYKTtcbiAgICBub2RlLnNldEF0dHJpYnV0ZShcInlcIiwgMCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBzeW1ib2xXaWR0aCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIxXCIpO1xuICAgIGlmIChmZykge1xuICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcImNvbG9yXCIsIGZnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImNvbG9yXCIpO1xuICAgIH1cbiAgICBpZiAoYmxpbmspIHtcbiAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImFwLWJsaW5rXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJhcC1ibGlua1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgZnVuY3Rpb24gcmVjeWNsZVZlY3RvclN5bWJvbFVzZXMocm93KSB7XG4gICAgd2hpbGUgKHJvdy5maXJzdENoaWxkKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IHJvdy5maXJzdENoaWxkO1xuICAgICAgcm93LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgIHZlY3RvclN5bWJvbFVzZVBvb2wucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGdldFZlY3RvclN5bWJvbFVzZSgpIHtcbiAgICBsZXQgbm9kZSA9IHZlY3RvclN5bWJvbFVzZVBvb2wucG9wKCk7XG4gICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsIFwidXNlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICBmdW5jdGlvbiBlbnN1cmVWZWN0b3JTeW1ib2xEZWYoY29kZXBvaW50KSB7XG4gICAgY29uc3QgY29udGVudCA9IGdldFZlY3RvclN5bWJvbERlZihjb2RlcG9pbnQpO1xuICAgIGlmICghY29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodmVjdG9yU3ltYm9sRGVmQ2FjaGUuaGFzKGNvZGVwb2ludCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IGBzeW0tJHtjb2RlcG9pbnR9YDtcbiAgICBjb25zdCBzeW1ib2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCBcInN5bWJvbFwiKTtcbiAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIDEgMVwiKTtcbiAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwicHJlc2VydmVBc3BlY3RSYXRpb1wiLCBcIm5vbmVcIik7XG4gICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcIm92ZXJmbG93XCIsIFwidmlzaWJsZVwiKTtcbiAgICBzeW1ib2wuaW5uZXJIVE1MID0gY29udGVudDtcbiAgICB2ZWN0b3JTeW1ib2xEZWZzRWwuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcbiAgICB2ZWN0b3JTeW1ib2xEZWZDYWNoZS5hZGQoY29kZXBvaW50KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gKCgpID0+IHtcbiAgICBjb25zdCBfZWwkID0gX3RtcGwkJGUuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgX2VsJDIgPSBfZWwkLmZpcnN0Q2hpbGQsXG4gICAgICBfZWwkMyA9IF9lbCQyLm5leHRTaWJsaW5nLFxuICAgICAgX2VsJDQgPSBfZWwkMy5maXJzdENoaWxkLFxuICAgICAgX2VsJDUgPSBfZWwkNC5uZXh0U2libGluZyxcbiAgICAgIF9lbCQ2ID0gX2VsJDMubmV4dFNpYmxpbmc7XG4gICAgY29uc3QgX3JlZiQgPSBlbDtcbiAgICB0eXBlb2YgX3JlZiQgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJCwgX2VsJCkgOiBlbCA9IF9lbCQ7XG4gICAgY29uc3QgX3JlZiQyID0gY2FudmFzRWw7XG4gICAgdHlwZW9mIF9yZWYkMiA9PT0gXCJmdW5jdGlvblwiID8gdXNlKF9yZWYkMiwgX2VsJDIpIDogY2FudmFzRWwgPSBfZWwkMjtcbiAgICBjb25zdCBfcmVmJDMgPSB2ZWN0b3JTeW1ib2xzRWw7XG4gICAgdHlwZW9mIF9yZWYkMyA9PT0gXCJmdW5jdGlvblwiID8gdXNlKF9yZWYkMywgX2VsJDMpIDogdmVjdG9yU3ltYm9sc0VsID0gX2VsJDM7XG4gICAgY29uc3QgX3JlZiQ0ID0gdmVjdG9yU3ltYm9sRGVmc0VsO1xuICAgIHR5cGVvZiBfcmVmJDQgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJDQsIF9lbCQ0KSA6IHZlY3RvclN5bWJvbERlZnNFbCA9IF9lbCQ0O1xuICAgIGNvbnN0IF9yZWYkNSA9IHZlY3RvclN5bWJvbFJvd3NFbDtcbiAgICB0eXBlb2YgX3JlZiQ1ID09PSBcImZ1bmN0aW9uXCIgPyB1c2UoX3JlZiQ1LCBfZWwkNSkgOiB2ZWN0b3JTeW1ib2xSb3dzRWwgPSBfZWwkNTtcbiAgICBjb25zdCBfcmVmJDYgPSB0ZXh0RWw7XG4gICAgdHlwZW9mIF9yZWYkNiA9PT0gXCJmdW5jdGlvblwiID8gdXNlKF9yZWYkNiwgX2VsJDYpIDogdGV4dEVsID0gX2VsJDY7XG4gICAgY3JlYXRlUmVuZGVyRWZmZWN0KF9wJCA9PiB7XG4gICAgICBjb25zdCBfdiQgPSBzdHlsZSQxKCksXG4gICAgICAgIF92JDIgPSBgMCAwICR7c2l6ZSgpLmNvbHN9ICR7c2l6ZSgpLnJvd3N9YCxcbiAgICAgICAgX3YkMyA9ICEhYmxpbmtPbigpLFxuICAgICAgICBfdiQ0ID0gISFibGlua09uKCk7XG4gICAgICBfcCQuX3YkID0gc3R5bGUoX2VsJCwgX3YkLCBfcCQuX3YkKTtcbiAgICAgIF92JDIgIT09IF9wJC5fdiQyICYmIHNldEF0dHJpYnV0ZShfZWwkMywgXCJ2aWV3Qm94XCIsIF9wJC5fdiQyID0gX3YkMik7XG4gICAgICBfdiQzICE9PSBfcCQuX3YkMyAmJiBfZWwkMy5jbGFzc0xpc3QudG9nZ2xlKFwiYXAtYmxpbmtcIiwgX3AkLl92JDMgPSBfdiQzKTtcbiAgICAgIF92JDQgIT09IF9wJC5fdiQ0ICYmIF9lbCQ2LmNsYXNzTGlzdC50b2dnbGUoXCJhcC1ibGlua1wiLCBfcCQuX3YkNCA9IF92JDQpO1xuICAgICAgcmV0dXJuIF9wJDtcbiAgICB9LCB7XG4gICAgICBfdiQ6IHVuZGVmaW5lZCxcbiAgICAgIF92JDI6IHVuZGVmaW5lZCxcbiAgICAgIF92JDM6IHVuZGVmaW5lZCxcbiAgICAgIF92JDQ6IHVuZGVmaW5lZFxuICAgIH0pO1xuICAgIHJldHVybiBfZWwkO1xuICB9KSgpO1xufSk7XG5mdW5jdGlvbiBidWlsZFRoZW1lKHRoZW1lKSB7XG4gIHJldHVybiB7XG4gICAgZmc6IHRoZW1lLmZvcmVncm91bmQsXG4gICAgYmc6IHRoZW1lLmJhY2tncm91bmQsXG4gICAgcGFsZXR0ZTogZ2VuZXJhdGUyNTZQYWxldHRlKHRoZW1lLnBhbGV0dGUsIHRoZW1lLmJhY2tncm91bmQsIHRoZW1lLmZvcmVncm91bmQpXG4gIH07XG59XG5mdW5jdGlvbiBnZXRDc3NUaGVtZShlbCkge1xuICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBjb25zdCBmb3JlZ3JvdW5kID0gbm9ybWFsaXplSGV4Q29sb3Ioc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcIi0tdGVybS1jb2xvci1mb3JlZ3JvdW5kXCIpLCBGQUxMQkFDS19USEVNRS5mb3JlZ3JvdW5kKTtcbiAgY29uc3QgYmFja2dyb3VuZCA9IG5vcm1hbGl6ZUhleENvbG9yKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLXRlcm0tY29sb3ItYmFja2dyb3VuZFwiKSwgRkFMTEJBQ0tfVEhFTUUuYmFja2dyb3VuZCk7XG4gIGNvbnN0IHBhbGV0dGUgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgY29uc3QgZmFsbGJhY2sgPSBpID49IDggPyBwYWxldHRlW2kgLSA4XSA6IEZBTExCQUNLX1RIRU1FLnBhbGV0dGVbaV07XG4gICAgcGFsZXR0ZVtpXSA9IG5vcm1hbGl6ZUhleENvbG9yKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoYC0tdGVybS1jb2xvci0ke2l9YCksIGZhbGxiYWNrKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGZvcmVncm91bmQsXG4gICAgYmFja2dyb3VuZCxcbiAgICBwYWxldHRlXG4gIH07XG59XG5mdW5jdGlvbiBnZW5lcmF0ZTI1NlBhbGV0dGUoYmFzZTE2LCBiZywgZmcpIHtcbiAgY29uc3QgYmdMYWIgPSBoZXhUb09rbGFiKGJnKTtcbiAgY29uc3QgZmdMYWIgPSBoZXhUb09rbGFiKGZnKTtcbiAgY29uc3QgYzEwMCA9IGhleFRvT2tsYWIoYmFzZTE2WzFdKTtcbiAgY29uc3QgYzAxMCA9IGhleFRvT2tsYWIoYmFzZTE2WzJdKTtcbiAgY29uc3QgYzExMCA9IGhleFRvT2tsYWIoYmFzZTE2WzNdKTtcbiAgY29uc3QgYzAwMSA9IGhleFRvT2tsYWIoYmFzZTE2WzRdKTtcbiAgY29uc3QgYzEwMSA9IGhleFRvT2tsYWIoYmFzZTE2WzVdKTtcbiAgY29uc3QgYzAxMSA9IGhleFRvT2tsYWIoYmFzZTE2WzZdKTtcbiAgY29uc3QgcGFsZXR0ZSA9IFsuLi5iYXNlMTZdO1xuXG4gIC8vIDIxNiBjb2xvciBjdWJlIHJhbmdlXG5cbiAgZm9yIChsZXQgciA9IDA7IHIgPCA2OyByICs9IDEpIHtcbiAgICBjb25zdCB0UiA9IHIgLyA1O1xuICAgIGNvbnN0IGMwID0gbGVycE9rbGFiKHRSLCBiZ0xhYiwgYzEwMCk7XG4gICAgY29uc3QgYzEgPSBsZXJwT2tsYWIodFIsIGMwMTAsIGMxMTApO1xuICAgIGNvbnN0IGMyID0gbGVycE9rbGFiKHRSLCBjMDAxLCBjMTAxKTtcbiAgICBjb25zdCBjMyA9IGxlcnBPa2xhYih0UiwgYzAxMSwgZmdMYWIpO1xuICAgIGZvciAobGV0IGcgPSAwOyBnIDwgNjsgZyArPSAxKSB7XG4gICAgICBjb25zdCB0RyA9IGcgLyA1O1xuICAgICAgY29uc3QgYzQgPSBsZXJwT2tsYWIodEcsIGMwLCBjMSk7XG4gICAgICBjb25zdCBjNSA9IGxlcnBPa2xhYih0RywgYzIsIGMzKTtcbiAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgNjsgYiArPSAxKSB7XG4gICAgICAgIGNvbnN0IHRCID0gYiAvIDU7XG4gICAgICAgIGNvbnN0IGM2ID0gbGVycE9rbGFiKHRCLCBjNCwgYzUpO1xuICAgICAgICBwYWxldHRlLnB1c2gob2tsYWJUb0hleChjNikpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGdyYXlzY2FsZSByYW5nZVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkgKz0gMSkge1xuICAgIGNvbnN0IHQgPSAoaSArIDEpIC8gMjU7XG4gICAgcGFsZXR0ZS5wdXNoKG9rbGFiVG9IZXgobGVycE9rbGFiKHQsIGJnTGFiLCBmZ0xhYikpKTtcbiAgfVxuICByZXR1cm4gcGFsZXR0ZTtcbn1cbmZ1bmN0aW9uIGRyYXdCbG9ja0dseXBoKGN0eCwgY29kZXBvaW50LCB4LCB5KSB7XG4gIGNvbnN0IHVuaXRYID0gQkxPQ0tfSF9SRVMgLyA4O1xuICBjb25zdCB1bml0WSA9IEJMT0NLX1ZfUkVTIC8gODtcbiAgY29uc3QgaGFsZlggPSBCTE9DS19IX1JFUyAvIDI7XG4gIGNvbnN0IGhhbGZZID0gQkxPQ0tfVl9SRVMgLyAyO1xuICBjb25zdCBzZXh0YW50WCA9IEJMT0NLX0hfUkVTIC8gMjtcbiAgY29uc3Qgc2V4dGFudFkgPSBCTE9DS19WX1JFUyAvIDM7XG4gIHN3aXRjaCAoY29kZXBvaW50KSB7XG4gICAgY2FzZSAweDI1ODA6XG4gICAgICAvLyB1cHBlciBoYWxmIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODAvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIEJMT0NLX0hfUkVTLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4MTpcbiAgICAgIC8vIGxvd2VyIG9uZSBlaWdodGggYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4MS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHVuaXRZICogNywgQkxPQ0tfSF9SRVMsIHVuaXRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTgyOlxuICAgICAgLy8gbG93ZXIgb25lIHF1YXJ0ZXIgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4Mi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHVuaXRZICogNiwgQkxPQ0tfSF9SRVMsIHVuaXRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4MzpcbiAgICAgIC8vIGxvd2VyIHRocmVlIGVpZ2h0aHMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4My8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHVuaXRZICogNSwgQkxPQ0tfSF9SRVMsIHVuaXRZICogMyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4NDpcbiAgICAgIC8vIGxvd2VyIGhhbGYgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4NC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIGhhbGZZLCBCTE9DS19IX1JFUywgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODU6XG4gICAgICAvLyBsb3dlciBmaXZlIGVpZ2h0aHMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4NS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHVuaXRZICogMywgQkxPQ0tfSF9SRVMsIHVuaXRZICogNSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4NjpcbiAgICAgIC8vIGxvd2VyIHRocmVlIHF1YXJ0ZXJzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSAqIDIsIEJMT0NLX0hfUkVTLCB1bml0WSAqIDYpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODc6XG4gICAgICAvLyBsb3dlciBzZXZlbiBlaWdodGhzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODcvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSwgQkxPQ0tfSF9SRVMsIHVuaXRZICogNyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4ODpcbiAgICAgIC8vIGZ1bGwgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4OC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgQkxPQ0tfSF9SRVMsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNWEwOlxuICAgICAgLy8gYmxhY2sgc3F1YXJlIChodHRwczovL3N5bWJsLmNjL2VuLzI1QTAvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSAqIDIsIEJMT0NLX0hfUkVTLCB1bml0WSAqIDQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODk6XG4gICAgICAvLyBsZWZ0IHNldmVuIGVpZ2h0aHMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4OS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgdW5pdFggKiA3LCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4YTpcbiAgICAgIC8vIGxlZnQgdGhyZWUgcXVhcnRlcnMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4QS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgdW5pdFggKiA2LCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4YjpcbiAgICAgIC8vIGxlZnQgZml2ZSBlaWdodGhzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OEIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHVuaXRYICogNSwgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OGM6XG4gICAgICAvLyBsZWZ0IGhhbGYgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4Qy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgaGFsZlgsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNThkOlxuICAgICAgLy8gbGVmdCB0aHJlZSBlaWdodGhzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OEQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHVuaXRYICogMywgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OGU6XG4gICAgICAvLyBsZWZ0IG9uZSBxdWFydGVyIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OEUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHVuaXRYICogMiwgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OGY6XG4gICAgICAvLyBsZWZ0IG9uZSBlaWdodGggYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU4Ri8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgdW5pdFgsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTkwOlxuICAgICAgLy8gcmlnaHQgaGFsZiBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTkwLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgaGFsZlgsIHksIGhhbGZYLCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5MTpcbiAgICAgIC8vIGxpZ2h0IHNoYWRlIChodHRwczovL3N5bWJsLmNjL2VuLzI1OTEvKVxuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuMjU7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgQkxPQ0tfSF9SRVMsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5MjpcbiAgICAgIC8vIG1lZGl1bSBzaGFkZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTkyLylcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjU7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgQkxPQ0tfSF9SRVMsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5MzpcbiAgICAgIC8vIGRhcmsgc2hhZGUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5My8pXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMC43NTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBCTE9DS19IX1JFUywgQkxPQ0tfVl9SRVMpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTk0OlxuICAgICAgLy8gdXBwZXIgb25lIGVpZ2h0aCBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTk0LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBCTE9DS19IX1JFUywgdW5pdFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTU6XG4gICAgICAvLyByaWdodCBvbmUgZWlnaHRoIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OTUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyB1bml0WCAqIDcsIHksIHVuaXRYLCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5NjpcbiAgICAgIC8vIHF1YWRyYW50IGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5Ni8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIGhhbGZZLCBoYWxmWCwgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTc6XG4gICAgICAvLyBxdWFkcmFudCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTk3LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgaGFsZlgsIHkgKyBoYWxmWSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTk4OlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTk4LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBoYWxmWCwgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTk6XG4gICAgICAvLyBxdWFkcmFudCB1cHBlciBsZWZ0IGFuZCBsb3dlciBsZWZ0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTk5LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBoYWxmWCwgQkxPQ0tfVl9SRVMpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBoYWxmWCwgeSArIGhhbGZZLCBoYWxmWCwgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OWE6XG4gICAgICAvLyBxdWFkcmFudCB1cHBlciBsZWZ0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTlBLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBoYWxmWCwgaGFsZlkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBoYWxmWCwgeSArIGhhbGZZLCBoYWxmWCwgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OWI6XG4gICAgICAvLyBxdWFkcmFudCB1cHBlciBsZWZ0IGFuZCB1cHBlciByaWdodCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTlCLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBCTE9DS19IX1JFUywgaGFsZlkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBoYWxmWSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTljOlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgbGVmdCBhbmQgdXBwZXIgcmlnaHQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzI1OUMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIEJMT0NLX0hfUkVTLCBoYWxmWSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIGhhbGZYLCB5ICsgaGFsZlksIGhhbGZYLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5ZDpcbiAgICAgIC8vIHF1YWRyYW50IHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzI1OUQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBoYWxmWCwgeSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTllOlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgcmlnaHQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5RS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIGhhbGZYLCB5LCBoYWxmWCwgaGFsZlkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBoYWxmWSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTlmOlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgcmlnaHQgYW5kIGxvd2VyIGxlZnQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzI1OUYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBoYWxmWCwgeSwgaGFsZlgsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgaGFsZlksIGhhbGZYLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMDA6XG4gICAgICAvLyBzZXh0YW50LTE6IHVwcGVyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDAvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMDE6XG4gICAgICAvLyBzZXh0YW50LTI6IHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjAxLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMDI6XG4gICAgICAvLyBzZXh0YW50LTEyOiB1cHBlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjAzOlxuICAgICAgLy8gc2V4dGFudC0zOiBtaWRkbGUgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwMy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjA0OlxuICAgICAgLy8gc2V4dGFudC0xMzogdG9wLWxlZnQgYW5kIG1pZGRsZS1sZWZ0IGZpbGxlZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwNC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMDU6XG4gICAgICAvLyBzZXh0YW50LTIzOiB1cHBlciByaWdodCBhbmQgbWlkZGxlIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMDY6XG4gICAgICAvLyBzZXh0YW50LTEyMzogdXBwZXIgb25lIHRoaXJkIGFuZCBtaWRkbGUgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwNi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjA3OlxuICAgICAgLy8gc2V4dGFudC00OiBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDcvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjA4OlxuICAgICAgLy8gc2V4dGFudC0xNDogdXBwZXIgbGVmdCBhbmQgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjA4LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjA5OlxuICAgICAgLy8gc2V4dGFudC0yNDogdG9wLXJpZ2h0IGFuZCBtaWRkbGUtcmlnaHQgZmlsbGVkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjA5LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMGE6XG4gICAgICAvLyBzZXh0YW50LTEyNDogdXBwZXIgb25lIHRoaXJkIGFuZCBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMEEvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjBiOlxuICAgICAgLy8gc2V4dGFudC0zNDogbWlkZGxlIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwQi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwYzpcbiAgICAgIC8vIHNleHRhbnQtMTM0OiB1cHBlciBsZWZ0LCBtaWRkbGUgbGVmdCBhbmQgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjBDLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMGQ6XG4gICAgICAvLyBzZXh0YW50LTIzNDogdXBwZXIgcmlnaHQgYW5kIG1pZGRsZSBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMEQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjBlOlxuICAgICAgLy8gc2V4dGFudC0xMjM0OiB0b3AgYW5kIG1pZGRsZSByb3dzIGZpbGxlZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwRS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwZjpcbiAgICAgIC8vIHNleHRhbnQtNTogbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwRi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxMDpcbiAgICAgIC8vIHNleHRhbnQtMTU6IHVwcGVyIGxlZnQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTAvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxMTpcbiAgICAgIC8vIHNleHRhbnQtMjU6IHVwcGVyIHJpZ2h0IGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjExLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxMjpcbiAgICAgIC8vIHNleHRhbnQtMTI1OiB1cHBlciBvbmUgdGhpcmQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTM6XG4gICAgICAvLyBzZXh0YW50LTM1OiBtaWRkbGUgbGVmdCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxMy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxNDpcbiAgICAgIC8vIHNleHRhbnQtMjM1OiB1cHBlciByaWdodCBhbmQgbGVmdCBjb2x1bW4gbG93ZXIgdHdvIHRoaXJkcyAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxNC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTU6XG4gICAgICAvLyBzZXh0YW50LTEyMzU6IHVwcGVyIG9uZSB0aGlyZCBhbmQgbGVmdCBjb2x1bW4gbG93ZXIgdHdvIHRoaXJkcyAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxNS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxNjpcbiAgICAgIC8vIHNleHRhbnQtNDU6IG1pZGRsZSByaWdodCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxNi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxNzpcbiAgICAgIC8vIHNleHRhbnQtMTQ1OiB1cHBlciBsZWZ0LCBtaWRkbGUgcmlnaHQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTcvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxODpcbiAgICAgIC8vIHNleHRhbnQtMjQ1OiByaWdodCBjb2x1bW4gdXBwZXIgdHdvIHRoaXJkcyBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxOC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjE5OlxuICAgICAgLy8gc2V4dGFudC0xMjQ1OiB1cHBlciBvbmUgdGhpcmQsIG1pZGRsZSByaWdodCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxOS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxYTpcbiAgICAgIC8vIHNleHRhbnQtMzQ1OiBtaWRkbGUgb25lIHRoaXJkIGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjFBLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMWI6XG4gICAgICAvLyBzZXh0YW50LTEzNDU6IGxlZnQgY29sdW1uIGFuZCBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMUIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSAqIDMpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjFjOlxuICAgICAgLy8gc2V4dGFudC0yMzQ1OiB1cHBlciByaWdodCwgbWlkZGxlIG9uZSB0aGlyZCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxQy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxZDpcbiAgICAgIC8vIHNleHRhbnQtMTIzNDU6IHVwcGVyIHR3byB0aGlyZHMgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMUQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjFlOlxuICAgICAgLy8gc2V4dGFudC02OiBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxRS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjFmOlxuICAgICAgLy8gc2V4dGFudC0xNjogdXBwZXIgbGVmdCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMUYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjIwOlxuICAgICAgLy8gc2V4dGFudC0yNjogdXBwZXIgcmlnaHQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjIwLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjIxOlxuICAgICAgLy8gc2V4dGFudC0xMjY6IHVwcGVyIG9uZSB0aGlyZCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMjEvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyMjpcbiAgICAgIC8vIHNleHRhbnQtMzY6IG1pZGRsZSBsZWZ0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyMi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyMzpcbiAgICAgIC8vIHNleHRhbnQtMTM2OiB1cHBlciBsZWZ0LCBtaWRkbGUgbGVmdCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMjMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyNDpcbiAgICAgIC8vIHNleHRhbnQtMjM2OiB1cHBlciByaWdodCwgbWlkZGxlIGxlZnQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjI0LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyNTpcbiAgICAgIC8vIHNleHRhbnQtMTIzNjogdXBwZXIgb25lIHRoaXJkLCBtaWRkbGUgbGVmdCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMjUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjY6XG4gICAgICAvLyBzZXh0YW50LTQ2OiBtaWRkbGUgcmlnaHQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjI2LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjc6XG4gICAgICAvLyBzZXh0YW50LTE0NjogdXBwZXIgbGVmdCBhbmQgcmlnaHQgY29sdW1uIGxvd2VyIHR3byB0aGlyZHMgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMjcvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjI4OlxuICAgICAgLy8gc2V4dGFudC0xMjQ2OiB1cHBlciBvbmUgdGhpcmQgYW5kIHJpZ2h0IGNvbHVtbiBsb3dlciB0d28gdGhpcmRzIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjI4LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjk6XG4gICAgICAvLyBzZXh0YW50LTM0NjogbWlkZGxlIG9uZSB0aGlyZCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMjkvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjJhOlxuICAgICAgLy8gc2V4dGFudC0xMzQ2OiBsZWZ0IGNvbHVtbiB1cHBlciB0d28gdGhpcmRzIGFuZCByaWdodCBjb2x1bW4gbG93ZXIgdHdvIHRoaXJkcyAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyQS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjJiOlxuICAgICAgLy8gc2V4dGFudC0yMzQ2OiB1cHBlciByaWdodCwgbWlkZGxlIG9uZSB0aGlyZCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMkIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyYzpcbiAgICAgIC8vIHNleHRhbnQtMTIzNDY6IHVwcGVyIHR3byB0aGlyZHMgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjJDLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZICogMik7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjJkOlxuICAgICAgLy8gc2V4dGFudC01NjogbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjJELylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyZTpcbiAgICAgIC8vIHNleHRhbnQtMTU2OiB1cHBlciBsZWZ0IGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMkUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMmY6XG4gICAgICAvLyBzZXh0YW50LTI1NjogdXBwZXIgcmlnaHQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyRi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjMwOlxuICAgICAgLy8gc2V4dGFudC0xMjU2OiB1cHBlciBvbmUgdGhpcmQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzMC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMzE6XG4gICAgICAvLyBzZXh0YW50LTM1NjogbWlkZGxlIGxlZnQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzMS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjMyOlxuICAgICAgLy8gc2V4dGFudC0xMzU2OiBsZWZ0IGNvbHVtbiB1cHBlciB0d28gdGhpcmRzIGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjMzOlxuICAgICAgLy8gc2V4dGFudC0yMzU2OiB1cHBlciByaWdodCwgbWlkZGxlIGxlZnQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzMy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzNDpcbiAgICAgIC8vIHNleHRhbnQtMTIzNTY6IHVwcGVyIG9uZSB0aGlyZCwgbWlkZGxlIGxlZnQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzNC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjM1OlxuICAgICAgLy8gc2V4dGFudC00NTY6IG1pZGRsZSByaWdodCBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjM1LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzNjpcbiAgICAgIC8vIHNleHRhbnQtMTQ1NjogdXBwZXIgbGVmdCwgbWlkZGxlIHJpZ2h0IGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMzc6XG4gICAgICAvLyBzZXh0YW50LTI0NTY6IHJpZ2h0IGNvbHVtbiB1cHBlciB0d28gdGhpcmRzIGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzcvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMzg6XG4gICAgICAvLyBzZXh0YW50LTEyNDU2OiB1cHBlciBvbmUgdGhpcmQsIG1pZGRsZSByaWdodCBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjM4LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzOTpcbiAgICAgIC8vIHNleHRhbnQtMzQ1NjogbWlkZGxlIG9uZSB0aGlyZCBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjM5LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzYTpcbiAgICAgIC8vIHNleHRhbnQtMTM0NTY6IGxlZnQgY29sdW1uIGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCM0EvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSAqIDMpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzYjpcbiAgICAgIC8vIHNleHRhbnQtMjM0NTY6IHVwcGVyIHJpZ2h0IGFuZCBsb3dlciB0d28gdGhpcmRzIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjNCLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgfVxufVxuY29uc3QgU1lNQk9MX1NUUk9LRSA9IDAuMDU7XG5jb25zdCBDRUxMX1JBVElPID0gOS4wMzc1IC8gMjA7XG5mdW5jdGlvbiBnZXRWZWN0b3JTeW1ib2xEZWYoY29kZXBvaW50KSB7XG4gIGNvbnN0IHN0cm9rZSA9IGBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIke1NZTUJPTF9TVFJPS0V9XCIgc3Ryb2tlLWxpbmVqb2luPVwibWl0ZXJcIiBzdHJva2UtbGluZWNhcD1cInNxdWFyZVwiYDtcbiAgY29uc3Qgc3Ryb2tlQnV0dCA9IGBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIke1NZTUJPTF9TVFJPS0V9XCIgc3Ryb2tlLWxpbmVqb2luPVwibWl0ZXJcIiBzdHJva2UtbGluZWNhcD1cImJ1dHRcImA7XG4gIGNvbnN0IHN0cm9rZWQgPSBkID0+IGA8cGF0aCBkPVwiJHtkfVwiIGZpbGw9XCJub25lXCIgJHtzdHJva2V9Lz5gO1xuICBjb25zdCB0aGlyZCA9IDEgLyAzO1xuICBjb25zdCB0d29UaGlyZHMgPSAyIC8gMztcbiAgc3dpdGNoIChjb2RlcG9pbnQpIHtcbiAgICAvLyBcdTI1RTIgLSBibGFjayBsb3dlciByaWdodCB0cmlhbmdsZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNUUyLylcbiAgICBjYXNlIDB4MjVlMjpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0xLDEgTDEsMCBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTEsMSBMMSwwIEwwLDEgWlwiKTtcblxuICAgIC8vIFx1MjVFMyAtIGJsYWNrIGxvd2VyIGxlZnQgdHJpYW5nbGUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjVFMy8pXG4gICAgY2FzZSAweDI1ZTM6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwxIEwwLDAgTDEsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0wLDEgTDAsMCBMMSwxIFpcIik7XG5cbiAgICAvLyBcdTI1RTQgLSBibGFjayB1cHBlciBsZWZ0IHRyaWFuZ2xlIChodHRwczovL3N5bWJsLmNjL2VuLzI1RTQvKVxuICAgIGNhc2UgMHgyNWU0OlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMCBMMSwwIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwwIEwxLDAgTDAsMSBaXCIpO1xuXG4gICAgLy8gXHUyNUU1IC0gYmxhY2sgdXBwZXIgcmlnaHQgdHJpYW5nbGUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjVFNS8pXG4gICAgY2FzZSAweDI1ZTU6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMSwwIEwxLDEgTDAsMCBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0xLDAgTDEsMSBMMCwwIFpcIik7XG4gICAgY2FzZSAweDI2OGY6XG4gICAgICB7XG4gICAgICAgIC8vIFx1MjY4RiAtIGRpZ3JhbSBmb3IgZ3JlYXRlciB5aW4gKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjY4Ri8pXG4gICAgICAgIGNvbnN0IGhvcml6b250YWxHYXAgPSAwLjE1O1xuICAgICAgICBjb25zdCB2ZXJ0aWNhbEdhcCA9IDAuMjtcbiAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IDAuMTc7XG4gICAgICAgIGNvbnN0IGhhbGZIb3Jpem9udGFsR2FwID0gaG9yaXpvbnRhbEdhcCAvIDI7XG4gICAgICAgIGNvbnN0IGhhbGZWZXJ0aWNhbEdhcCA9IHZlcnRpY2FsR2FwIC8gMjtcbiAgICAgICAgY29uc3QgdG9WaWV3Qm94WSA9IG9mZnNldCA9PiAwLjUgKyBvZmZzZXQgKiBDRUxMX1JBVElPO1xuICAgICAgICBjb25zdCBsZWZ0WDEgPSAwLjUgLSBoYWxmSG9yaXpvbnRhbEdhcDtcbiAgICAgICAgY29uc3QgcmlnaHRYMCA9IDAuNSArIGhhbGZIb3Jpem9udGFsR2FwO1xuICAgICAgICBjb25zdCByaWdodFgxID0gMSArIDAuMDI7IC8vIHNsaWdodCBvdmVyZHJhd1xuICAgICAgICBjb25zdCB0b3BZMCA9IHRvVmlld0JveFkoLWhhbGZWZXJ0aWNhbEdhcCAtIGxpbmVIZWlnaHQpO1xuICAgICAgICBjb25zdCB0b3BZMSA9IHRvVmlld0JveFkoLWhhbGZWZXJ0aWNhbEdhcCk7XG4gICAgICAgIGNvbnN0IGJvdHRvbVkwID0gdG9WaWV3Qm94WShoYWxmVmVydGljYWxHYXApO1xuICAgICAgICBjb25zdCBib3R0b21ZMSA9IHRvVmlld0JveFkoaGFsZlZlcnRpY2FsR2FwICsgbGluZUhlaWdodCk7XG4gICAgICAgIGNvbnN0IHJlY3QgPSAoeDAsIHgxLCB5MCwgeTEpID0+IGBNJHt4MH0sJHt5MH0gTCR7eDF9LCR7eTB9IEwke3gxfSwke3kxfSBMJHt4MH0sJHt5MX0gWmA7XG4gICAgICAgIHJldHVybiBgPHBhdGggZD1cIiR7cmVjdCgwLCBsZWZ0WDEsIHRvcFkwLCB0b3BZMSl9ICR7cmVjdChyaWdodFgwLCByaWdodFgxLCB0b3BZMCwgdG9wWTEpfSAke3JlY3QoMCwgbGVmdFgxLCBib3R0b21ZMCwgYm90dG9tWTEpfSAke3JlY3QocmlnaHRYMCwgcmlnaHRYMSwgYm90dG9tWTAsIGJvdHRvbVkxKX1cIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmA7XG4gICAgICB9XG5cbiAgICAvLyBcdUQ4M0VcdURGM0MgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzQy8pXG4gICAgY2FzZSAweDFmYjNjOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0d29UaGlyZHN9IEwwLDEgTDAuNSwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3R3b1RoaXJkc30gTDAsMSBMMC41LDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjNEIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzRC8pXG4gICAgY2FzZSAweDFmYjNkOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0d29UaGlyZHN9IEwwLDEgTDEsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0d29UaGlyZHN9IEwwLDEgTDEsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGM0UgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzRS8pXG4gICAgY2FzZSAweDFmYjNlOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0aGlyZH0gTDAuNSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwwLjUsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REYzRiAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbWlkZGxlIGxlZnQgdG8gbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCM0YvKVxuICAgIGNhc2UgMHgxZmIzZjpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dGhpcmR9IEwxLDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDEsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0MCAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbGVmdCB0byBsb3dlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDAvKVxuICAgIGNhc2UgMHgxZmI0MDpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLDAgTDAuNSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwwIEwwLjUsMSBMMCwxIFpcIik7XG5cbiAgICAvLyBcdUQ4M0VcdURGNDEgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byB1cHBlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDEvKVxuICAgIGNhc2UgMHgxZmI0MTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dGhpcmR9IEwwLDEgTDEsMSBMMSwwIEwwLjUsMCBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDAsMSBMMSwxIEwxLDAgTDAuNSwwIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0MiAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIG1pZGRsZSBsZWZ0IHRvIHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQyLylcbiAgICBjYXNlIDB4MWZiNDI6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMCwxIEwxLDEgTDEsMCBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDAsMSBMMSwxIEwxLDAgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjQzIC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbWlkZGxlIGxlZnQgdG8gdXBwZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQzLylcbiAgICBjYXNlIDB4MWZiNDM6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3R3b1RoaXJkc30gTDAsMSBMMSwxIEwxLDAgTDAuNSwwIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3R3b1RoaXJkc30gTDAsMSBMMSwxIEwxLDAgTDAuNSwwIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0NCAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIG1pZGRsZSBsZWZ0IHRvIHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQ0LylcbiAgICBjYXNlIDB4MWZiNDQ6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3R3b1RoaXJkc30gTDAsMSBMMSwxIEwxLDAgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dHdvVGhpcmRzfSBMMCwxIEwxLDEgTDEsMCBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNDUgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCBsb3dlciBsZWZ0IHRvIHVwcGVyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0NS8pXG4gICAgY2FzZSAweDFmYjQ1OlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAuNSwwIEwxLDAgTDEsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAuNSwwIEwxLDAgTDEsMSBMMCwxIFpcIik7XG5cbiAgICAvLyBcdUQ4M0VcdURGNDYgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDYvKVxuICAgIGNhc2UgMHgxZmI0NjpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dHdvVGhpcmRzfSBMMCwxIEwxLDEgTDEsJHt0aGlyZH0gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dHdvVGhpcmRzfSBMMCwxIEwxLDEgTDEsJHt0aGlyZH0gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjQ3IC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgY2VudHJlIHRvIGxvd2VyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0Ny8pXG4gICAgY2FzZSAweDFmYjQ3OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAuNSwxIEwxLDEgTDEsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMC41LDEgTDEsMSBMMSwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjQ4IC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbGVmdCB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDgvKVxuICAgIGNhc2UgMHgxZmI0ODpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDEgTDEsMSBMMSwke3R3b1RoaXJkc30gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDEgTDEsMSBMMSwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjQ5IC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgY2VudHJlIHRvIHVwcGVyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0OS8pXG4gICAgY2FzZSAweDFmYjQ5OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAuNSwxIEwxLDEgTDEsJHt0aGlyZH0gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLjUsMSBMMSwxIEwxLCR7dGhpcmR9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0QSAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGxlZnQgdG8gdXBwZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjRBLylcbiAgICBjYXNlIDB4MWZiNGE6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwxIEwxLDEgTDEsJHt0aGlyZH0gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDEgTDEsMSBMMSwke3RoaXJkfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNEIgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCBsb3dlciBjZW50cmUgdG8gdXBwZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNEIvKVxuICAgIGNhc2UgMHgxZmI0YjpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLjUsMSBMMSwwIEwxLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMC41LDEgTDEsMCBMMSwxIFpcIik7XG5cbiAgICAvLyBcdUQ4M0VcdURGNEMgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGNlbnRyZSB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNEMvKVxuICAgIGNhc2UgMHgxZmI0YzpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDAuNSwwIEwxLCR7dGhpcmR9IEwxLDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMC41LDAgTDEsJHt0aGlyZH0gTDEsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0RCAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbGVmdCB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNEQvKVxuICAgIGNhc2UgMHgxZmI0ZDpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDAsMSBMMSwxIEwxLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwwLDEgTDEsMSBMMSwke3RoaXJkfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNEUgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGNlbnRyZSB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNEUvKVxuICAgIGNhc2UgMHgxZmI0ZTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDAuNSwwIEwxLCR7dHdvVGhpcmRzfSBMMSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDAuNSwwIEwxLCR7dHdvVGhpcmRzfSBMMSwxIEwwLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjRGIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBsZWZ0IHRvIGxvd2VyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0Ri8pXG4gICAgY2FzZSAweDFmYjRmOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwke3R3b1RoaXJkc30gTDEsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLCR7dHdvVGhpcmRzfSBMMSwxIEwwLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjUwIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBjZW50cmUgdG8gbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNTAvKVxuICAgIGNhc2UgMHgxZmI1MDpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLDAgTDAuNSwwIEwxLDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0wLDAgTDAuNSwwIEwxLDEgTDAsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjUxIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNTEvKVxuICAgIGNhc2UgMHgxZmI1MTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dGhpcmR9IEwxLCR7dHdvVGhpcmRzfSBMMSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwxLCR7dHdvVGhpcmRzfSBMMSwxIEwwLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjUyIC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbWlkZGxlIGxlZnQgdG8gbG93ZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjUyLylcbiAgICBjYXNlIDB4MWZiNTI6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3R3b1RoaXJkc30gTDAsMCBMMSwwIEwxLDEgTDAuNSwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3R3b1RoaXJkc30gTDAsMCBMMSwwIEwxLDEgTDAuNSwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1MyAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjUzLylcbiAgICBjYXNlIDB4MWZiNTM6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3R3b1RoaXJkc30gTDAsMCBMMSwwIEwxLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dHdvVGhpcmRzfSBMMCwwIEwxLDAgTDEsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNTQgLSB1cHBlciByaWdodCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byBsb3dlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNTQvKVxuICAgIGNhc2UgMHgxZmI1NDpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dGhpcmR9IEwwLDAgTDEsMCBMMSwxIEwwLjUsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDAsMCBMMSwwIEwxLDEgTDAuNSwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1NSAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjU1LylcbiAgICBjYXNlIDB4MWZiNTU6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMCwwIEwxLDAgTDEsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDAsMCBMMSwwIEwxLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjU2IC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbGVmdCB0byBsb3dlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNTYvKVxuICAgIGNhc2UgMHgxZmI1NjpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwxIEwwLjUsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0wLDAgTDEsMCBMMSwxIEwwLjUsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjU3IC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byB1cHBlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNTcvKVxuICAgIGNhc2UgMHgxZmI1NzpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dGhpcmR9IEwwLjUsMCBMMCwwIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3RoaXJkfSBMMC41LDAgTDAsMCBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNTggLSB1cHBlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIG1pZGRsZSBsZWZ0IHRvIHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjU4LylcbiAgICBjYXNlIDB4MWZiNTg6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwxLDAgTDAsJHt0aGlyZH0gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDEsMCBMMCwke3RoaXJkfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNTkgLSB1cHBlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIG1pZGRsZSBsZWZ0IHRvIHVwcGVyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1OS8pXG4gICAgY2FzZSAweDFmYjU5OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMC41LDAgTDAsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwwLjUsMCBMMCwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjVBIC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1QS8pXG4gICAgY2FzZSAweDFmYjVhOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwwIEwwLCR7dHdvVGhpcmRzfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMSwwIEwwLCR7dHdvVGhpcmRzfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNUIgLSB1cHBlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGxlZnQgdG8gdXBwZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjVCLylcbiAgICBjYXNlIDB4MWZiNWI6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwwLjUsMCBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAsMCBMMC41LDAgTDAsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjVDIC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNUMvKVxuICAgIGNhc2UgMHgxZmI1YzpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwke3RoaXJkfSBMMCwke3R3b1RoaXJkc30gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDEsMCBMMSwke3RoaXJkfSBMMCwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjVEIC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBjZW50cmUgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjVELylcbiAgICBjYXNlIDB4MWZiNWQ6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IEwwLjUsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IEwwLjUsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1RSAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbGVmdCB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNUUvKVxuICAgIGNhc2UgMHgxZmI1ZTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwke3R3b1RoaXJkc30gTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMSwwIEwxLCR7dHdvVGhpcmRzfSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1RiAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgY2VudHJlIHRvIHVwcGVyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1Ri8pXG4gICAgY2FzZSAweDFmYjVmOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwwIEwxLCR7dGhpcmR9IEwwLjUsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDEsJHt0aGlyZH0gTDAuNSwxIEwwLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjYwIC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBsZWZ0IHRvIHVwcGVyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2MC8pXG4gICAgY2FzZSAweDFmYjYwOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwwIEwxLCR7dGhpcmR9IEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDEsMCBMMSwke3RoaXJkfSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY2MSAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgY2VudHJlIHRvIHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjYxLylcbiAgICBjYXNlIDB4MWZiNjE6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwxLDAgTDAuNSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwwIEwxLDAgTDAuNSwxIEwwLDEgWlwiKTtcblxuICAgIC8vIFx1RDgzRVx1REY2MiAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGNlbnRyZSB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjIvKVxuICAgIGNhc2UgMHgxZmI2MjpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLjUsMCBMMSwwIEwxLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMC41LDAgTDEsMCBMMSwke3RoaXJkfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNjMgLSB1cHBlciByaWdodCBibG9jayBkaWFnb25hbCB1cHBlciBsZWZ0IHRvIHVwcGVyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2My8pXG4gICAgY2FzZSAweDFmYjYzOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwwIEwxLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDEsJHt0aGlyZH0gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjY0IC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgY2VudHJlIHRvIGxvd2VyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2NC8pXG4gICAgY2FzZSAweDFmYjY0OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAuNSwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMC41LDAgTDEsMCBMMSwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjY1IC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbGVmdCB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjUvKVxuICAgIGNhc2UgMHgxZmI2NTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwke3R3b1RoaXJkc30gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDEsMCBMMSwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjY2IC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgY2VudHJlIHRvIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjY2LylcbiAgICBjYXNlIDB4MWZiNjY6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMC41LDAgTDEsMCBMMSwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAuNSwwIEwxLDAgTDEsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjY3IC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbWlkZGxlIGxlZnQgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjY3LylcbiAgICBjYXNlIDB4MWZiNjc6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3RoaXJkfSBMMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY2OCAtIHVwcGVyIGFuZCByaWdodCBhbmQgbG93ZXIgdHJpYW5ndWxhciB0aHJlZSBxdWFydGVycyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2OC8pXG4gICAgY2FzZSAweDFmYjY4OlxuICAgICAgcmV0dXJuICc8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0wLDAgTDEsMCBMMSwxIEwwLDEgWiBNMCwwIEwwLDEgTDAuNSwwLjUgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIGA8cGF0aCBkPVwiTTAsMCBMMSwwIE0wLDEgTDEsMSBNMSwwIEwxLDFcIiBmaWxsPVwibm9uZVwiICR7c3Ryb2tlfS8+YCArIGA8cGF0aCBkPVwiTTAsMCBMMC41LDAuNSBNMCwxIEwwLjUsMC41XCIgZmlsbD1cIm5vbmVcIiAke3N0cm9rZUJ1dHR9Lz5gO1xuXG4gICAgLy8gXHVEODNFXHVERjY5IC0gbGVmdCBhbmQgbG93ZXIgYW5kIHJpZ2h0IHRyaWFuZ3VsYXIgdGhyZWUgcXVhcnRlcnMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjkvKVxuICAgIGNhc2UgMHgxZmI2OTpcbiAgICAgIHJldHVybiAnPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNMCwwIEwxLDAgTDEsMSBMMCwxIFogTTAsMCBMMSwwIEwwLjUsMC41IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBgPHBhdGggZD1cIk0wLDAgTDAsMSBNMSwwIEwxLDEgTTAsMSBMMSwxXCIgZmlsbD1cIm5vbmVcIiAke3N0cm9rZX0vPmAgKyBgPHBhdGggZD1cIk0wLDAgTDAuNSwwLjUgTTEsMCBMMC41LDAuNVwiIGZpbGw9XCJub25lXCIgJHtzdHJva2VCdXR0fS8+YDtcblxuICAgIC8vIFx1RDgzRVx1REY2QSAtIHVwcGVyIGFuZCBsZWZ0IGFuZCBsb3dlciB0cmlhbmd1bGFyIHRocmVlIHF1YXJ0ZXJzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjZBLylcbiAgICBjYXNlIDB4MWZiNmE6XG4gICAgICByZXR1cm4gJzxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTAsMCBMMSwwIEwxLDEgTDAsMSBaIE0xLDAgTDEsMSBMMC41LDAuNSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgYDxwYXRoIGQ9XCJNMCwwIEwxLDAgTTAsMSBMMSwxIE0wLDAgTDAsMVwiIGZpbGw9XCJub25lXCIgJHtzdHJva2V9Lz5gICsgYDxwYXRoIGQ9XCJNMSwwIEwwLjUsMC41IE0xLDEgTDAuNSwwLjVcIiBmaWxsPVwibm9uZVwiICR7c3Ryb2tlQnV0dH0vPmA7XG5cbiAgICAvLyBcdUQ4M0VcdURGNkIgLSBsZWZ0IGFuZCB1cHBlciBhbmQgcmlnaHQgdHJpYW5ndWxhciB0aHJlZSBxdWFydGVycyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2Qi8pXG4gICAgY2FzZSAweDFmYjZiOlxuICAgICAgcmV0dXJuICc8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0wLDAgTDEsMCBMMSwxIEwwLDEgWiBNMCwxIEwxLDEgTDAuNSwwLjUgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIGA8cGF0aCBkPVwiTTAsMCBMMSwwIE0wLDAgTDAsMSBNMSwwIEwxLDFcIiBmaWxsPVwibm9uZVwiICR7c3Ryb2tlfS8+YCArIGA8cGF0aCBkPVwiTTAsMSBMMC41LDAuNSBNMSwxIEwwLjUsMC41XCIgZmlsbD1cIm5vbmVcIiAke3N0cm9rZUJ1dHR9Lz5gO1xuXG4gICAgLy8gXHVEODNFXHVERjZDIC0gbGVmdCB0cmlhbmd1bGFyIG9uZSBxdWFydGVyIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjZDLylcbiAgICBjYXNlIDB4MWZiNmM6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwwLDEgTDAuNSwwLjUgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwwIEwwLDEgTDAuNSwwLjUgWlwiKTtcblxuICAgIC8vIHBvd2VybGluZSByaWdodCBmdWxsIHRyaWFuZ2xlIChodHRwczovL3d3dy5uZXJkZm9udHMuY29tL2NoZWF0LXNoZWV0KVxuICAgIGNhc2UgMHhlMGIwOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMCBMMSwwLjUgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nO1xuXG4gICAgLy8gcG93ZXJsaW5lIHJpZ2h0IGJyYWNrZXQgKGh0dHBzOi8vd3d3Lm5lcmRmb250cy5jb20vY2hlYXQtc2hlZXQpXG4gICAgY2FzZSAweGUwYjE6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwxLDAuNSBMMCwxXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIwLjA3XCIgc3Ryb2tlLWxpbmVqb2luPVwibWl0ZXJcIi8+JztcblxuICAgIC8vIHBvd2VybGluZSBsZWZ0IGZ1bGwgdHJpYW5nbGUgKGh0dHBzOi8vd3d3Lm5lcmRmb250cy5jb20vY2hlYXQtc2hlZXQpXG4gICAgY2FzZSAweGUwYjI6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMSwwIEwwLDAuNSBMMSwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPic7XG5cbiAgICAvLyBwb3dlcmxpbmUgbGVmdCBicmFja2V0IChodHRwczovL3d3dy5uZXJkZm9udHMuY29tL2NoZWF0LXNoZWV0KVxuICAgIGNhc2UgMHhlMGIzOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTEsMCBMMCwwLjUgTDEsMVwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMC4wN1wiIHN0cm9rZS1saW5lam9pbj1cIm1pdGVyXCIvPic7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG5jb25zdCBQT1dFUkxJTkVfU1lNQk9MUyA9IG5ldyBTZXQoWzB4ZTBiMCwgMHhlMGIxLCAweGUwYjIsIDB4ZTBiM10pO1xuY29uc3QgUE9XRVJMSU5FX1NZTUJPTF9OVURHRSA9IDAuMDI7XG5jb25zdCBGQUxMQkFDS19USEVNRSA9IHtcbiAgZm9yZWdyb3VuZDogXCIjMDAwMDAwXCIsXG4gIGJhY2tncm91bmQ6IFwiIzAwMDAwMFwiLFxuICBwYWxldHRlOiBbXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCJdXG59O1xuXG5jb25zdCBfdG1wbCQkZCA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCAxMiAxMlwiIGNsYXNzPVwiYXAtaWNvbiBhcC1pY29uLWZ1bGxzY3JlZW4tb2ZmXCI+PHBhdGggZD1cIk03LDUgTDcsMCBMOSwyIEwxMSwwIEwxMiwxIEwxMCwzIEwxMiw1IFpcIj48L3BhdGg+PHBhdGggZD1cIk01LDcgTDAsNyBMMiw5IEwwLDExIEwxLDEyIEwzLDEwIEw1LDEyIFpcIj48L3BhdGg+PC9zdmc+YCwgNik7XG52YXIgRXhwYW5kSWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkZC5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJGMgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCI2IDggMTQgMTZcIiBjbGFzcz1cImFwLWljb25cIj48cGF0aCBkPVwiTTAuOTM4IDguMzEzaDIyLjEyNWMwLjUgMCAwLjkzOCAwLjQzOCAwLjkzOCAwLjkzOHYxMy41YzAgMC41LTAuNDM4IDAuOTM4LTAuOTM4IDAuOTM4aC0yMi4xMjVjLTAuNSAwLTAuOTM4LTAuNDM4LTAuOTM4LTAuOTM4di0xMy41YzAtMC41IDAuNDM4LTAuOTM4IDAuOTM4LTAuOTM4ek0xLjU5NCAyMi4wNjNoMjAuODEzdi0xMi4xNTZoLTIwLjgxM3YxMi4xNTZ6TTMuODQ0IDExLjE4OGgxLjkwNnYxLjkzOGgtMS45MDZ2LTEuOTM4ek03LjQ2OSAxMS4xODhoMS45MDZ2MS45MzhoLTEuOTA2di0xLjkzOHpNMTEuMDMxIDExLjE4OGgxLjkzOHYxLjkzOGgtMS45Mzh2LTEuOTM4ek0xNC42NTYgMTEuMTg4aDEuODc1djEuOTM4aC0xLjg3NXYtMS45Mzh6TTE4LjI1IDExLjE4OGgxLjkwNnYxLjkzOGgtMS45MDZ2LTEuOTM4ek01LjY1NiAxNS4wMzFoMS45Mzh2MS45MzhoLTEuOTM4di0xLjkzOHpNOS4yODEgMTYuOTY5di0xLjkzOGgxLjkwNnYxLjkzOGgtMS45MDZ6TTEyLjg3NSAxNi45Njl2LTEuOTM4aDEuOTA2djEuOTM4aC0xLjkwNnpNMTguNDA2IDE2Ljk2OWgtMS45Mzh2LTEuOTM4aDEuOTM4djEuOTM4ek0xNi41MzEgMjAuNzgxaC05LjA2M3YtMS45MDZoOS4wNjN2MS45MDZ6XCI+PC9wYXRoPjwvc3ZnPmAsIDQpO1xudmFyIEtleWJvYXJkSWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkYy5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJGIgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMTIgMTJcIiBjbGFzcz1cImFwLWljb25cIiBhcmlhLWxhYmVsPVwiUGF1c2VcIiByb2xlPVwiYnV0dG9uXCI+PHBhdGggZD1cIk0xLDAgTDQsMCBMNCwxMiBMMSwxMiBaXCI+PC9wYXRoPjxwYXRoIGQ9XCJNOCwwIEwxMSwwIEwxMSwxMiBMOCwxMiBaXCI+PC9wYXRoPjwvc3ZnPmAsIDYpO1xudmFyIFBhdXNlSWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkYi5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJGEgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMTIgMTJcIiBjbGFzcz1cImFwLWljb25cIiBhcmlhLWxhYmVsPVwiUGxheVwiIHJvbGU9XCJidXR0b25cIj48cGF0aCBkPVwiTTEsMCBMMTEsNiBMMSwxMiBaXCI+PC9wYXRoPjwvc3ZnPmAsIDQpO1xudmFyIFBsYXlJY29uID0gKHByb3BzID0+IHtcbiAgcmV0dXJuIF90bXBsJCRhLmNsb25lTm9kZSh0cnVlKTtcbn0pO1xuXG5jb25zdCBfdG1wbCQkOSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCAxMiAxMlwiIGNsYXNzPVwiYXAtaWNvbiBhcC1pY29uLWZ1bGxzY3JlZW4tb25cIj48cGF0aCBkPVwiTTEyLDAgTDcsMCBMOSwyIEw3LDQgTDgsNSBMMTAsMyBMMTIsNSBaXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMCwxMiBMMCw3IEwyLDkgTDQsNyBMNSw4IEwzLDEwIEw1LDEyIFpcIj48L3BhdGg+PC9zdmc+YCwgNik7XG52YXIgU2hyaW5rSWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkOS5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJDggPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjAgMjBcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZD1cIk0xMC41IDMuNzVhLjc1Ljc1IDAgMCAwLTEuMjY0LS41NDZMNS4yMDMgN0gyLjY2N2EuNzUuNzUgMCAwIDAtLjcuNDhBNi45ODUgNi45ODUgMCAwIDAgMS41IDEwYzAgLjg4Ny4xNjUgMS43MzcuNDY4IDIuNTIuMTExLjI5LjM5LjQ4LjcuNDhoMi41MzVsNC4wMzMgMy43OTZhLjc1Ljc1IDAgMCAwIDEuMjY0LS41NDZWMy43NVpNMTYuNDUgNS4wNWEuNzUuNzUgMCAwIDAtMS4wNiAxLjA2MSA1LjUgNS41IDAgMCAxIDAgNy43NzguNzUuNzUgMCAwIDAgMS4wNiAxLjA2IDcgNyAwIDAgMCAwLTkuODk5WlwiPjwvcGF0aD48cGF0aCBkPVwiTTE0LjMyOSA3LjE3MmEuNzUuNzUgMCAwIDAtMS4wNjEgMS4wNiAyLjUgMi41IDAgMCAxIDAgMy41MzYuNzUuNzUgMCAwIDAgMS4wNiAxLjA2IDQgNCAwIDAgMCAwLTUuNjU2WlwiPjwvcGF0aD48L3N2Zz5gLCA2KTtcbnZhciBTcGVha2VyT25JY29uID0gKHByb3BzID0+IHtcbiAgcmV0dXJuIF90bXBsJCQ4LmNsb25lTm9kZSh0cnVlKTtcbn0pO1xuXG5jb25zdCBfdG1wbCQkNyA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyMCAyMFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cInNpemUtNVwiPjxwYXRoIGQ9XCJNMTAuMDQ3IDMuMDYyYS43NS43NSAwIDAgMSAuNDUzLjY4OHYxMi41YS43NS43NSAwIDAgMS0xLjI2NC41NDZMNS4yMDMgMTNIMi42NjdhLjc1Ljc1IDAgMCAxLS43LS40OEE2Ljk4NSA2Ljk4NSAwIDAgMSAxLjUgMTBjMC0uODg3LjE2NS0xLjczNy40NjgtMi41MmEuNzUuNzUgMCAwIDEgLjctLjQ4aDIuNTM1bDQuMDMzLTMuNzk2YS43NS43NSAwIDAgMSAuODExLS4xNDJaTTEzLjc4IDcuMjJhLjc1Ljc1IDAgMSAwLTEuMDYgMS4wNkwxNC40NCAxMGwtMS43MiAxLjcyYS43NS43NSAwIDAgMCAxLjA2IDEuMDZsMS43Mi0xLjcyIDEuNzIgMS43MmEuNzUuNzUgMCAxIDAgMS4wNi0xLjA2TDE2LjU2IDEwbDEuNzItMS43MmEuNzUuNzUgMCAwIDAtMS4wNi0xLjA2TDE1LjUgOC45NGwtMS43Mi0xLjcyWlwiPjwvcGF0aD48L3N2Zz5gLCA0KTtcbnZhciBTcGVha2VyT2ZmSWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkNy5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJDYgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzcGFuIGNsYXNzPVwiYXAtYnV0dG9uIGFwLXBsYXliYWNrLWJ1dHRvblwiIHRhYmluZGV4PVwiMFwiPjwvc3Bhbj5gLCAyKSxcbiAgX3RtcGwkMiQxID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3BhbiBjbGFzcz1cImFwLWJhclwiPjxzcGFuIGNsYXNzPVwiYXAtZ3V0dGVyIGFwLWd1dHRlci1lbXB0eVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImFwLWd1dHRlciBhcC1ndXR0ZXItZnVsbFwiPjwvc3Bhbj48L3NwYW4+YCwgNiksXG4gIF90bXBsJDMkMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHNwYW4gY2xhc3M9XCJhcC10b29sdGlwXCI+VW5tdXRlIChtKTwvc3Bhbj5gLCAyKSxcbiAgX3RtcGwkNCQxID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3BhbiBjbGFzcz1cImFwLXRvb2x0aXBcIj5NdXRlIChtKTwvc3Bhbj5gLCAyKSxcbiAgX3RtcGwkNSQxID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3BhbiBjbGFzcz1cImFwLWJ1dHRvbiBhcC1zcGVha2VyLWJ1dHRvbiBhcC10b29sdGlwLWNvbnRhaW5lclwiIGFyaWEtbGFiZWw9XCJNdXRlIC8gdW5tdXRlXCIgcm9sZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiPjwvc3Bhbj5gLCAyKSxcbiAgX3RtcGwkNiQxID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtY29udHJvbC1iYXJcIj48c3BhbiBjbGFzcz1cImFwLXRpbWVyXCIgYXJpYS1yZWFkb25seT1cInRydWVcIiByb2xlPVwidGV4dGJveFwiIHRhYmluZGV4PVwiMFwiPjxzcGFuIGNsYXNzPVwiYXAtdGltZS1lbGFwc2VkXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwiYXAtdGltZS1yZW1haW5pbmdcIj48L3NwYW4+PC9zcGFuPjxzcGFuIGNsYXNzPVwiYXAtcHJvZ3Jlc3NiYXJcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJhcC1idXR0b24gYXAta2JkLWJ1dHRvbiBhcC10b29sdGlwLWNvbnRhaW5lclwiIGFyaWEtbGFiZWw9XCJTaG93IGtleWJvYXJkIHNob3J0Y3V0c1wiIHJvbGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIj48c3BhbiBjbGFzcz1cImFwLXRvb2x0aXBcIj5LZXlib2FyZCBzaG9ydGN1dHMgKD8pPC9zcGFuPjwvc3Bhbj48c3BhbiBjbGFzcz1cImFwLWJ1dHRvbiBhcC1mdWxsc2NyZWVuLWJ1dHRvbiBhcC10b29sdGlwLWNvbnRhaW5lclwiIGFyaWEtbGFiZWw9XCJUb2dnbGUgZnVsbHNjcmVlbiBtb2RlXCIgcm9sZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiPjxzcGFuIGNsYXNzPVwiYXAtdG9vbHRpcFwiPkZ1bGxzY3JlZW4gKGYpPC9zcGFuPjwvc3Bhbj48L2Rpdj5gLCAxOCksXG4gIF90bXBsJDckMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHNwYW4gY2xhc3M9XCJhcC1tYXJrZXItY29udGFpbmVyIGFwLXRvb2x0aXAtY29udGFpbmVyXCI+PHNwYW4gY2xhc3M9XCJhcC1tYXJrZXJcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJhcC10b29sdGlwXCI+PC9zcGFuPjwvc3Bhbj5gLCA2KTtcbmZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xuICBsZXQgcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyk7XG4gIGNvbnN0IGQgPSBNYXRoLmZsb29yKHMgLyA4NjQwMCk7XG4gIHMgJT0gODY0MDA7XG4gIGNvbnN0IGggPSBNYXRoLmZsb29yKHMgLyAzNjAwKTtcbiAgcyAlPSAzNjAwO1xuICBjb25zdCBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICBzICU9IDYwO1xuICBpZiAoZCA+IDApIHtcbiAgICByZXR1cm4gYCR7emVyb1BhZChkKX06JHt6ZXJvUGFkKGgpfToke3plcm9QYWQobSl9OiR7emVyb1BhZChzKX1gO1xuICB9IGVsc2UgaWYgKGggPiAwKSB7XG4gICAgcmV0dXJuIGAke3plcm9QYWQoaCl9OiR7emVyb1BhZChtKX06JHt6ZXJvUGFkKHMpfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAke3plcm9QYWQobSl9OiR7emVyb1BhZChzKX1gO1xuICB9XG59XG5mdW5jdGlvbiB6ZXJvUGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/IGAwJHtufWAgOiBuLnRvU3RyaW5nKCk7XG59XG52YXIgQ29udHJvbEJhciA9IChwcm9wcyA9PiB7XG4gIGNvbnN0IGUgPSBmID0+IHtcbiAgICByZXR1cm4gZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBmKGUpO1xuICAgIH07XG4gIH07XG4gIGNvbnN0IGN1cnJlbnRUaW1lID0gKCkgPT4gdHlwZW9mIHByb3BzLmN1cnJlbnRUaW1lID09PSBcIm51bWJlclwiID8gZm9ybWF0VGltZShwcm9wcy5jdXJyZW50VGltZSkgOiBcIi0tOi0tXCI7XG4gIGNvbnN0IHJlbWFpbmluZ1RpbWUgPSAoKSA9PiB0eXBlb2YgcHJvcHMucmVtYWluaW5nVGltZSA9PT0gXCJudW1iZXJcIiA/IFwiLVwiICsgZm9ybWF0VGltZShwcm9wcy5yZW1haW5pbmdUaW1lKSA6IGN1cnJlbnRUaW1lKCk7XG4gIGNvbnN0IG1hcmtlcnMgPSBjcmVhdGVNZW1vKCgpID0+IHR5cGVvZiBwcm9wcy5kdXJhdGlvbiA9PT0gXCJudW1iZXJcIiA/IHByb3BzLm1hcmtlcnMuZmlsdGVyKG0gPT4gbVswXSA8IHByb3BzLmR1cmF0aW9uKSA6IFtdKTtcbiAgY29uc3QgbWFya2VyUG9zaXRpb24gPSBtID0+IGAke21bMF0gLyBwcm9wcy5kdXJhdGlvbiAqIDEwMH0lYDtcbiAgY29uc3QgbWFya2VyVGV4dCA9IG0gPT4ge1xuICAgIGlmIChtWzFdID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gZm9ybWF0VGltZShtWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2Zvcm1hdFRpbWUobVswXSl9IC0gJHttWzFdfWA7XG4gICAgfVxuICB9O1xuICBjb25zdCBpc1Bhc3RNYXJrZXIgPSBtID0+IHR5cGVvZiBwcm9wcy5jdXJyZW50VGltZSA9PT0gXCJudW1iZXJcIiA/IG1bMF0gPD0gcHJvcHMuY3VycmVudFRpbWUgOiBmYWxzZTtcbiAgY29uc3QgZ3V0dGVyQmFyU3R5bGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlWCgke3Byb3BzLnByb2dyZXNzIHx8IDB9YFxuICAgIH07XG4gIH07XG4gIGNvbnN0IGNhbGNQb3NpdGlvbiA9IGUgPT4ge1xuICAgIGNvbnN0IGJhcldpZHRoID0gZS5jdXJyZW50VGFyZ2V0Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IHJlY3QgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IHBvcyA9IE1hdGgubWF4KDAsIG1vdXNlWCAvIGJhcldpZHRoKTtcbiAgICByZXR1cm4gYCR7cG9zICogMTAwfSVgO1xuICB9O1xuICBjb25zdCBbbW91c2VEb3duLCBzZXRNb3VzZURvd25dID0gY3JlYXRlU2lnbmFsKGZhbHNlKTtcbiAgY29uc3QgdGhyb3R0bGVkU2VlayA9IHRocm90dGxlKHByb3BzLm9uU2Vla0NsaWNrLCA1MCk7XG4gIGNvbnN0IG9uTW91c2VEb3duID0gZSA9PiB7XG4gICAgaWYgKGUuX21hcmtlcikgcmV0dXJuO1xuICAgIGlmIChlLmFsdEtleSB8fCBlLnNoaWZ0S2V5IHx8IGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5idXR0b24gIT09IDApIHJldHVybjtcbiAgICBzZXRNb3VzZURvd24odHJ1ZSk7XG4gICAgcHJvcHMub25TZWVrQ2xpY2soY2FsY1Bvc2l0aW9uKGUpKTtcbiAgfTtcbiAgY29uc3Qgc2Vla1RvTWFya2VyID0gaW5kZXggPT4ge1xuICAgIHJldHVybiBlKCgpID0+IHtcbiAgICAgIHByb3BzLm9uU2Vla0NsaWNrKHtcbiAgICAgICAgbWFya2VyOiBpbmRleFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9uTW92ZSA9IGUgPT4ge1xuICAgIGlmIChlLmFsdEtleSB8fCBlLnNoaWZ0S2V5IHx8IGUubWV0YUtleSB8fCBlLmN0cmxLZXkpIHJldHVybjtcbiAgICBpZiAobW91c2VEb3duKCkpIHtcbiAgICAgIHRocm90dGxlZFNlZWsoY2FsY1Bvc2l0aW9uKGUpKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uRG9jdW1lbnRNb3VzZVVwID0gKCkgPT4ge1xuICAgIHNldE1vdXNlRG93bihmYWxzZSk7XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uRG9jdW1lbnRNb3VzZVVwKTtcbiAgb25DbGVhbnVwKCgpID0+IHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbkRvY3VtZW50TW91c2VVcCk7XG4gIH0pO1xuICByZXR1cm4gKCgpID0+IHtcbiAgICBjb25zdCBfZWwkID0gX3RtcGwkNiQxLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgIF9lbCQzID0gX2VsJC5maXJzdENoaWxkLFxuICAgICAgX2VsJDQgPSBfZWwkMy5maXJzdENoaWxkLFxuICAgICAgX2VsJDUgPSBfZWwkNC5uZXh0U2libGluZyxcbiAgICAgIF9lbCQ2ID0gX2VsJDMubmV4dFNpYmxpbmcsXG4gICAgICBfZWwkMTMgPSBfZWwkNi5uZXh0U2libGluZyxcbiAgICAgIF9lbCQxNCA9IF9lbCQxMy5maXJzdENoaWxkLFxuICAgICAgX2VsJDE1ID0gX2VsJDEzLm5leHRTaWJsaW5nLFxuICAgICAgX2VsJDE2ID0gX2VsJDE1LmZpcnN0Q2hpbGQ7XG4gICAgY29uc3QgX3JlZiQgPSBwcm9wcy5yZWY7XG4gICAgdHlwZW9mIF9yZWYkID09PSBcImZ1bmN0aW9uXCIgPyB1c2UoX3JlZiQsIF9lbCQpIDogcHJvcHMucmVmID0gX2VsJDtcbiAgICBpbnNlcnQoX2VsJCwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gcHJvcHMuaXNQYXVzYWJsZTtcbiAgICAgIH0sXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIGNvbnN0IF9lbCQyID0gX3RtcGwkJDYuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBhZGRFdmVudExpc3RlbmVyKF9lbCQyLCBcImNsaWNrXCIsIGUocHJvcHMub25QbGF5Q2xpY2spKTtcbiAgICAgICAgaW5zZXJ0KF9lbCQyLCBjcmVhdGVDb21wb25lbnQoU3dpdGNoLCB7XG4gICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtjcmVhdGVDb21wb25lbnQoTWF0Y2gsIHtcbiAgICAgICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzLmlzUGxheWluZztcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoUGF1c2VJY29uLCB7fSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLCBjcmVhdGVDb21wb25lbnQoTWF0Y2gsIHtcbiAgICAgICAgICAgICAgd2hlbjogdHJ1ZSxcbiAgICAgICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoUGxheUljb24sIHt9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSldO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gX2VsJDI7XG4gICAgICB9XG4gICAgfSksIF9lbCQzKTtcbiAgICBpbnNlcnQoX2VsJDQsIGN1cnJlbnRUaW1lKTtcbiAgICBpbnNlcnQoX2VsJDUsIHJlbWFpbmluZ1RpbWUpO1xuICAgIGluc2VydChfZWwkNiwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHByb3BzLnByb2dyZXNzID09PSBcIm51bWJlclwiIHx8IHByb3BzLmlzU2Vla2FibGU7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICBjb25zdCBfZWwkNyA9IF90bXBsJDIkMS5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgX2VsJDggPSBfZWwkNy5maXJzdENoaWxkLFxuICAgICAgICAgIF9lbCQ5ID0gX2VsJDgubmV4dFNpYmxpbmc7XG4gICAgICAgIF9lbCQ3LiQkbW91c2Vtb3ZlID0gb25Nb3ZlO1xuICAgICAgICBfZWwkNy4kJG1vdXNlZG93biA9IG9uTW91c2VEb3duO1xuICAgICAgICBpbnNlcnQoX2VsJDcsIGNyZWF0ZUNvbXBvbmVudChGb3IsIHtcbiAgICAgICAgICBnZXQgZWFjaCgpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXJrZXJzKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGlsZHJlbjogKG0sIGkpID0+ICgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBfZWwkMTcgPSBfdG1wbCQ3JDEuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgICBfZWwkMTggPSBfZWwkMTcuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgX2VsJDE5ID0gX2VsJDE4Lm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgX2VsJDE3LiQkbW91c2Vkb3duID0gZSA9PiB7XG4gICAgICAgICAgICAgIGUuX21hcmtlciA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihfZWwkMTcsIFwiY2xpY2tcIiwgc2Vla1RvTWFya2VyKGkoKSkpO1xuICAgICAgICAgICAgaW5zZXJ0KF9lbCQxOSwgKCkgPT4gbWFya2VyVGV4dChtKSk7XG4gICAgICAgICAgICBjcmVhdGVSZW5kZXJFZmZlY3QoX3AkID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgX3YkID0gbWFya2VyUG9zaXRpb24obSksXG4gICAgICAgICAgICAgICAgX3YkMiA9ICEhaXNQYXN0TWFya2VyKG0pO1xuICAgICAgICAgICAgICBfdiQgIT09IF9wJC5fdiQgJiYgX2VsJDE3LnN0eWxlLnNldFByb3BlcnR5KFwibGVmdFwiLCBfcCQuX3YkID0gX3YkKTtcbiAgICAgICAgICAgICAgX3YkMiAhPT0gX3AkLl92JDIgJiYgX2VsJDE4LmNsYXNzTGlzdC50b2dnbGUoXCJhcC1tYXJrZXItcGFzdFwiLCBfcCQuX3YkMiA9IF92JDIpO1xuICAgICAgICAgICAgICByZXR1cm4gX3AkO1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBfdiQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgX3YkMjogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBfZWwkMTc7XG4gICAgICAgICAgfSkoKVxuICAgICAgICB9KSwgbnVsbCk7XG4gICAgICAgIGNyZWF0ZVJlbmRlckVmZmVjdChfJHAgPT4gc3R5bGUoX2VsJDksIGd1dHRlckJhclN0eWxlKCksIF8kcCkpO1xuICAgICAgICByZXR1cm4gX2VsJDc7XG4gICAgICB9XG4gICAgfSkpO1xuICAgIGluc2VydChfZWwkLCBjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiBwcm9wcy5pc011dGVkICE9PSB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICBjb25zdCBfZWwkMTAgPSBfdG1wbCQ1JDEuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBhZGRFdmVudExpc3RlbmVyKF9lbCQxMCwgXCJjbGlja1wiLCBlKHByb3BzLm9uTXV0ZUNsaWNrKSk7XG4gICAgICAgIGluc2VydChfZWwkMTAsIGNyZWF0ZUNvbXBvbmVudChTd2l0Y2gsIHtcbiAgICAgICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gW2NyZWF0ZUNvbXBvbmVudChNYXRjaCwge1xuICAgICAgICAgICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcHMuaXNNdXRlZCA9PT0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbY3JlYXRlQ29tcG9uZW50KFNwZWFrZXJPZmZJY29uLCB7fSksIF90bXBsJDMkMS5jbG9uZU5vZGUodHJ1ZSldO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgY3JlYXRlQ29tcG9uZW50KE1hdGNoLCB7XG4gICAgICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wcy5pc011dGVkID09PSBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbY3JlYXRlQ29tcG9uZW50KFNwZWFrZXJPbkljb24sIHt9KSwgX3RtcGwkNCQxLmNsb25lTm9kZSh0cnVlKV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIF9lbCQxMDtcbiAgICAgIH1cbiAgICB9KSwgX2VsJDEzKTtcbiAgICBhZGRFdmVudExpc3RlbmVyKF9lbCQxMywgXCJjbGlja1wiLCBlKHByb3BzLm9uSGVscENsaWNrKSk7XG4gICAgaW5zZXJ0KF9lbCQxMywgY3JlYXRlQ29tcG9uZW50KEtleWJvYXJkSWNvbiwge30pLCBfZWwkMTQpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoX2VsJDE1LCBcImNsaWNrXCIsIGUocHJvcHMub25GdWxsc2NyZWVuQ2xpY2spKTtcbiAgICBpbnNlcnQoX2VsJDE1LCBjcmVhdGVDb21wb25lbnQoU2hyaW5rSWNvbiwge30pLCBfZWwkMTYpO1xuICAgIGluc2VydChfZWwkMTUsIGNyZWF0ZUNvbXBvbmVudChFeHBhbmRJY29uLCB7fSksIF9lbCQxNik7XG4gICAgY3JlYXRlUmVuZGVyRWZmZWN0KCgpID0+IF9lbCQuY2xhc3NMaXN0LnRvZ2dsZShcImFwLXNlZWthYmxlXCIsICEhcHJvcHMuaXNTZWVrYWJsZSkpO1xuICAgIHJldHVybiBfZWwkO1xuICB9KSgpO1xufSk7XG5kZWxlZ2F0ZUV2ZW50cyhbXCJjbGlja1wiLCBcIm1vdXNlZG93blwiLCBcIm1vdXNlbW92ZVwiXSk7XG5cbmNvbnN0IF90bXBsJCQ1ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtb3ZlcmxheSBhcC1vdmVybGF5LWVycm9yXCI+PHNwYW4+XHVEODNEXHVEQ0E1PC9zcGFuPjwvZGl2PmAsIDQpO1xudmFyIEVycm9yT3ZlcmxheSA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkNS5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJDQgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxkaXYgY2xhc3M9XCJhcC1vdmVybGF5IGFwLW92ZXJsYXktbG9hZGluZ1wiPjxzcGFuIGNsYXNzPVwiYXAtbG9hZGVyXCI+PC9zcGFuPjwvZGl2PmAsIDQpO1xudmFyIExvYWRlck92ZXJsYXkgPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJDQuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCQzID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtb3ZlcmxheSBhcC1vdmVybGF5LWluZm9cIj48c3Bhbj48L3NwYW4+PC9kaXY+YCwgNCk7XG52YXIgSW5mb092ZXJsYXkgPSAocHJvcHMgPT4ge1xuICByZXR1cm4gKCgpID0+IHtcbiAgICBjb25zdCBfZWwkID0gX3RtcGwkJDMuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgX2VsJDIgPSBfZWwkLmZpcnN0Q2hpbGQ7XG4gICAgaW5zZXJ0KF9lbCQyLCAoKSA9PiBwcm9wcy5tZXNzYWdlKTtcbiAgICBjcmVhdGVSZW5kZXJFZmZlY3QoKCkgPT4gX2VsJC5jbGFzc0xpc3QudG9nZ2xlKFwiYXAtd2FzLXBsYXlpbmdcIiwgISFwcm9wcy53YXNQbGF5aW5nKSk7XG4gICAgcmV0dXJuIF9lbCQ7XG4gIH0pKCk7XG59KTtcblxuY29uc3QgX3RtcGwkJDIgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxkaXYgY2xhc3M9XCJhcC1vdmVybGF5IGFwLW92ZXJsYXktc3RhcnRcIj48ZGl2IGNsYXNzPVwiYXAtcGxheS1idXR0b25cIj48ZGl2PjxzcGFuPjxzdmcgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMTAwMC4wIDEwMDAuMFwiIGNsYXNzPVwiYXAtaWNvblwiPjxkZWZzPjxtYXNrIGlkPVwic21hbGwtdHJpYW5nbGUtbWFza1wiPjxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwid2hpdGVcIj48L3JlY3Q+PHBvbHlnb24gcG9pbnRzPVwiNzAwLjAgNTAwLjAsIDQwMC4wMDAwMDAwMDAwMDAwNiAzMjYuNzk0OTE5MjQzMTEyMiwgMzk5Ljk5OTk5OTk5OTk5OTkgNjczLjIwNTA4MDc1Njg4NzdcIiBmaWxsPVwiYmxhY2tcIj48L3BvbHlnb24+PC9tYXNrPjwvZGVmcz48cG9seWdvbiBwb2ludHM9XCIxMDAwLjAgNTAwLjAsIDI1MC4wMDAwMDAwMDAwMDAxIDY2Ljk4NzI5ODEwNzc4MDU5LCAyNDkuOTk5OTk5OTk5OTk5NzcgOTMzLjAxMjcwMTg5MjIxOTJcIiBtYXNrPVwidXJsKCNzbWFsbC10cmlhbmdsZS1tYXNrKVwiIGZpbGw9XCJ3aGl0ZVwiIGNsYXNzPVwiYXAtcGxheS1idG4tZmlsbFwiPjwvcG9seWdvbj48cG9seWxpbmUgcG9pbnRzPVwiNjczLjIwNTA4MDc1Njg4NzggNDAwLjAsIDMyNi43OTQ5MTkyNDMxMTIzIDYwMC4wXCIgc3Ryb2tlPVwid2hpdGVcIiBzdHJva2Utd2lkdGg9XCI5MFwiIGNsYXNzPVwiYXAtcGxheS1idG4tc3Ryb2tlXCI+PC9wb2x5bGluZT48L3N2Zz48L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+YCwgMjIpO1xudmFyIFN0YXJ0T3ZlcmxheSA9IChwcm9wcyA9PiB7XG4gIGNvbnN0IGUgPSBmID0+IHtcbiAgICByZXR1cm4gZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBmKGUpO1xuICAgIH07XG4gIH07XG4gIHJldHVybiAoKCkgPT4ge1xuICAgIGNvbnN0IF9lbCQgPSBfdG1wbCQkMi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihfZWwkLCBcImNsaWNrXCIsIGUocHJvcHMub25DbGljaykpO1xuICAgIHJldHVybiBfZWwkO1xuICB9KSgpO1xufSk7XG5kZWxlZ2F0ZUV2ZW50cyhbXCJjbGlja1wiXSk7XG5cbmNvbnN0IF90bXBsJCQxID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8bGk+PGtiZD5zcGFjZTwva2JkPiAtIHBhdXNlIC8gcmVzdW1lPC9saT5gLCA0KSxcbiAgX3RtcGwkMiA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGxpPjxrYmQ+XHUyMTkwPC9rYmQ+IC8gPGtiZD5cdTIxOTI8L2tiZD4gLSByZXdpbmQgLyBmYXN0LWZvcndhcmQgYnkgNSBzZWNvbmRzPC9saT5gLCA2KSxcbiAgX3RtcGwkMyA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGxpPjxrYmQ+U2hpZnQ8L2tiZD4gKyA8a2JkPlx1MjE5MDwva2JkPiAvIDxrYmQ+XHUyMTkyPC9rYmQ+IC0gcmV3aW5kIC8gZmFzdC1mb3J3YXJkIGJ5IDEwJTwvbGk+YCwgOCksXG4gIF90bXBsJDQgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxsaT48a2JkPls8L2tiZD4gLyA8a2JkPl08L2tiZD4gLSBqdW1wIHRvIHRoZSBwcmV2aW91cyAvIG5leHQgbWFya2VyPC9saT5gLCA2KSxcbiAgX3RtcGwkNSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGxpPjxrYmQ+MDwva2JkPiwgPGtiZD4xPC9rYmQ+LCA8a2JkPjI8L2tiZD4gLi4uIDxrYmQ+OTwva2JkPiAtIGp1bXAgdG8gMCUsIDEwJSwgMjAlIC4uLiA5MCU8L2xpPmAsIDEwKSxcbiAgX3RtcGwkNiA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGxpPjxrYmQ+LDwva2JkPiAvIDxrYmQ+Ljwva2JkPiAtIHN0ZXAgYmFjayAvIGZvcndhcmQsIGEgZnJhbWUgYXQgYSB0aW1lICh3aGVuIHBhdXNlZCk8L2xpPmAsIDYpLFxuICBfdG1wbCQ3ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8bGk+PGtiZD5tPC9rYmQ+IC0gbXV0ZSAvIHVubXV0ZSBhdWRpbzwvbGk+YCwgNCksXG4gIF90bXBsJDggPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxkaXYgY2xhc3M9XCJhcC1vdmVybGF5IGFwLW92ZXJsYXktaGVscFwiPjxkaXY+PGRpdj48cD5LZXlib2FyZCBzaG9ydGN1dHM8L3A+PHVsPjxsaT48a2JkPmY8L2tiZD4gLSB0b2dnbGUgZnVsbHNjcmVlbiBtb2RlPC9saT48bGk+PGtiZD4/PC9rYmQ+IC0gc2hvdyB0aGlzIGhlbHAgcG9wdXA8L2xpPjwvdWw+PC9kaXY+PC9kaXY+PC9kaXY+YCwgMTgpO1xudmFyIEhlbHBPdmVybGF5ID0gKHByb3BzID0+IHtcbiAgY29uc3QgZSA9IGYgPT4ge1xuICAgIHJldHVybiBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGYoZSk7XG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuICgoKSA9PiB7XG4gICAgY29uc3QgX2VsJCA9IF90bXBsJDguY2xvbmVOb2RlKHRydWUpLFxuICAgICAgX2VsJDIgPSBfZWwkLmZpcnN0Q2hpbGQsXG4gICAgICBfZWwkMyA9IF9lbCQyLmZpcnN0Q2hpbGQsXG4gICAgICBfZWwkNCA9IF9lbCQzLmZpcnN0Q2hpbGQsXG4gICAgICBfZWwkNSA9IF9lbCQ0Lm5leHRTaWJsaW5nLFxuICAgICAgX2VsJDEyID0gX2VsJDUuZmlyc3RDaGlsZCxcbiAgICAgIF9lbCQxNCA9IF9lbCQxMi5uZXh0U2libGluZztcbiAgICBhZGRFdmVudExpc3RlbmVyKF9lbCQsIFwiY2xpY2tcIiwgZShwcm9wcy5vbkNsb3NlKSk7XG4gICAgX2VsJDIuJCRjbGljayA9IGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9O1xuICAgIGluc2VydChfZWwkNSwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gcHJvcHMuaXNQYXVzYWJsZTtcbiAgICAgIH0sXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiBfdG1wbCQkMS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICB9XG4gICAgfSksIF9lbCQxMik7XG4gICAgaW5zZXJ0KF9lbCQ1LCBjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiBwcm9wcy5pc1NlZWthYmxlO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIFtfdG1wbCQyLmNsb25lTm9kZSh0cnVlKSwgX3RtcGwkMy5jbG9uZU5vZGUodHJ1ZSksIF90bXBsJDQuY2xvbmVOb2RlKHRydWUpLCBfdG1wbCQ1LmNsb25lTm9kZSh0cnVlKSwgX3RtcGwkNi5jbG9uZU5vZGUodHJ1ZSldO1xuICAgICAgfVxuICAgIH0pLCBfZWwkMTIpO1xuICAgIGluc2VydChfZWwkNSwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gcHJvcHMuaGFzQXVkaW87XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gX3RtcGwkNy5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICB9XG4gICAgfSksIF9lbCQxNCk7XG4gICAgcmV0dXJuIF9lbCQ7XG4gIH0pKCk7XG59KTtcbmRlbGVnYXRlRXZlbnRzKFtcImNsaWNrXCJdKTtcblxuY29uc3QgX3RtcGwkID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtd3JhcHBlclwiIHRhYmluZGV4PVwiLTFcIj48ZGl2PjwvZGl2PjwvZGl2PmAsIDQpO1xuY29uc3QgQ09OVFJPTF9CQVJfSEVJR0hUID0gMzI7IC8vIG11c3QgbWF0Y2ggaGVpZ2h0IG9mIGRpdi5hcC1jb250cm9sLWJhciBpbiBDU1NcblxudmFyIFBsYXllciA9IChwcm9wcyA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IHByb3BzLmxvZ2dlcjtcbiAgY29uc3QgY29yZSA9IHByb3BzLmNvcmU7XG4gIGNvbnN0IGF1dG9QbGF5ID0gcHJvcHMuYXV0b1BsYXk7XG4gIGNvbnN0IGNoYXJXID0gcHJvcHMuY2hhclc7XG4gIGNvbnN0IGNoYXJIID0gcHJvcHMuY2hhckg7XG4gIGNvbnN0IGJvcmRlcnNXID0gcHJvcHMuYm9yZGVyc1c7XG4gIGNvbnN0IGJvcmRlcnNIID0gcHJvcHMuYm9yZGVyc0g7XG4gIGNvbnN0IHRoZW1lT3B0aW9uID0gcHJvcHMudGhlbWUgPz8gXCJhdXRvL2FzY2lpbmVtYVwiO1xuICBjb25zdCBwcmVmZXJFbWJlZGRlZFRoZW1lID0gdGhlbWVPcHRpb24uc2xpY2UoMCwgNSkgPT09IFwiYXV0by9cIjtcbiAgY29uc3QgdGhlbWVOYW1lID0gcHJlZmVyRW1iZWRkZWRUaGVtZSA/IHRoZW1lT3B0aW9uLnNsaWNlKDUpIDogdGhlbWVPcHRpb247XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gY3JlYXRlU3RvcmUoe1xuICAgIGNvbnRhaW5lclc6IDAsXG4gICAgY29udGFpbmVySDogMCxcbiAgICBpc1BhdXNhYmxlOiB0cnVlLFxuICAgIGlzU2Vla2FibGU6IHRydWUsXG4gICAgaXNGdWxsc2NyZWVuOiBmYWxzZSxcbiAgICBjdXJyZW50VGltZTogbnVsbCxcbiAgICByZW1haW5pbmdUaW1lOiBudWxsLFxuICAgIHByb2dyZXNzOiBudWxsXG4gIH0pO1xuICBjb25zdCBbaXNQbGF5aW5nLCBzZXRJc1BsYXlpbmddID0gY3JlYXRlU2lnbmFsKGZhbHNlKTtcbiAgY29uc3QgW2lzTXV0ZWQsIHNldElzTXV0ZWRdID0gY3JlYXRlU2lnbmFsKHVuZGVmaW5lZCk7XG4gIGNvbnN0IFt3YXNQbGF5aW5nLCBzZXRXYXNQbGF5aW5nXSA9IGNyZWF0ZVNpZ25hbChmYWxzZSk7XG4gIGNvbnN0IFtvdmVybGF5LCBzZXRPdmVybGF5XSA9IGNyZWF0ZVNpZ25hbCghYXV0b1BsYXkgPyBcInN0YXJ0XCIgOiBudWxsKTtcbiAgY29uc3QgW2luZm9NZXNzYWdlLCBzZXRJbmZvTWVzc2FnZV0gPSBjcmVhdGVTaWduYWwobnVsbCk7XG4gIGNvbnN0IFtibGlua2luZywgc2V0QmxpbmtpbmddID0gY3JlYXRlU2lnbmFsKGZhbHNlKTtcbiAgY29uc3QgW3Rlcm1pbmFsU2l6ZSwgc2V0VGVybWluYWxTaXplXSA9IGNyZWF0ZVNpZ25hbCh7XG4gICAgY29sczogcHJvcHMuY29scyxcbiAgICByb3dzOiBwcm9wcy5yb3dzXG4gIH0sIHtcbiAgICBlcXVhbHM6IChuZXdWYWwsIG9sZFZhbCkgPT4gbmV3VmFsLmNvbHMgPT09IG9sZFZhbC5jb2xzICYmIG5ld1ZhbC5yb3dzID09PSBvbGRWYWwucm93c1xuICB9KTtcbiAgY29uc3QgW2R1cmF0aW9uLCBzZXREdXJhdGlvbl0gPSBjcmVhdGVTaWduYWwobnVsbCk7XG4gIGNvbnN0IFttYXJrZXJzLCBzZXRNYXJrZXJzXSA9IGNyZWF0ZVN0b3JlKFtdKTtcbiAgY29uc3QgW3VzZXJBY3RpdmUsIHNldFVzZXJBY3RpdmVdID0gY3JlYXRlU2lnbmFsKGZhbHNlKTtcbiAgY29uc3QgW2lzSGVscFZpc2libGUsIHNldElzSGVscFZpc2libGVdID0gY3JlYXRlU2lnbmFsKGZhbHNlKTtcbiAgY29uc3QgW29yaWdpbmFsVGhlbWUsIHNldE9yaWdpbmFsVGhlbWVdID0gY3JlYXRlU2lnbmFsKG51bGwpO1xuICBjb25zdCB0ZXJtaW5hbENvbHMgPSBjcmVhdGVNZW1vKCgpID0+IHRlcm1pbmFsU2l6ZSgpLmNvbHMgfHwgODApO1xuICBjb25zdCB0ZXJtaW5hbFJvd3MgPSBjcmVhdGVNZW1vKCgpID0+IHRlcm1pbmFsU2l6ZSgpLnJvd3MgfHwgMjQpO1xuICBjb25zdCBjb250cm9sQmFySGVpZ2h0ID0gKCkgPT4gcHJvcHMuY29udHJvbHMgPT09IGZhbHNlID8gMCA6IENPTlRST0xfQkFSX0hFSUdIVDtcbiAgY29uc3QgY29udHJvbHNWaXNpYmxlID0gKCkgPT4gcHJvcHMuY29udHJvbHMgPT09IHRydWUgfHwgcHJvcHMuY29udHJvbHMgPT09IFwiYXV0b1wiICYmIHVzZXJBY3RpdmUoKTtcbiAgbGV0IHVzZXJBY3Rpdml0eVRpbWVvdXRJZDtcbiAgbGV0IHRpbWVVcGRhdGVJbnRlcnZhbElkO1xuICBsZXQgd3JhcHBlclJlZjtcbiAgbGV0IHBsYXllclJlZjtcbiAgbGV0IGNvbnRyb2xCYXJSZWY7XG4gIGxldCByZXNpemVPYnNlcnZlcjtcbiAgZnVuY3Rpb24gb25QbGF5aW5nKCkge1xuICAgIHNldEJsaW5raW5nKHRydWUpO1xuICAgIHN0YXJ0VGltZVVwZGF0ZXMoKTtcbiAgfVxuICBmdW5jdGlvbiBvblN0b3BwZWQoKSB7XG4gICAgc2V0QmxpbmtpbmcoZmFsc2UpO1xuICAgIHN0b3BUaW1lVXBkYXRlcygpO1xuICAgIHVwZGF0ZVRpbWUoKTtcbiAgfVxuICBsZXQgcmVzb2x2ZUNvcmVSZWFkeTtcbiAgY29uc3QgY29yZVJlYWR5ID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgcmVzb2x2ZUNvcmVSZWFkeSA9IHJlc29sdmU7XG4gIH0pO1xuICBjb25zdCBvbkNvcmVSZWFkeSA9IF9yZWYgPT4ge1xuICAgIGxldCB7XG4gICAgICBpc1BhdXNhYmxlLFxuICAgICAgaXNTZWVrYWJsZVxuICAgIH0gPSBfcmVmO1xuICAgIHNldFN0YXRlKHtcbiAgICAgIGlzUGF1c2FibGUsXG4gICAgICBpc1NlZWthYmxlXG4gICAgfSk7XG4gICAgcmVzb2x2ZUNvcmVSZWFkeSgpO1xuICB9O1xuICBjb25zdCBvbkNvcmVNZXRhZGF0YSA9IG1ldGEgPT4ge1xuICAgIGJhdGNoKCgpID0+IHtcbiAgICAgIGlmIChtZXRhLmR1cmF0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0RHVyYXRpb24obWV0YS5kdXJhdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAobWV0YS5tYXJrZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0TWFya2VycyhtZXRhLm1hcmtlcnMpO1xuICAgICAgfVxuICAgICAgaWYgKG1ldGEuaGFzQXVkaW8gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXRJc011dGVkKG1ldGEuaGFzQXVkaW8gPyBmYWxzZSA6IHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgICBpZiAobWV0YS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0VGVybWluYWxTaXplKG1ldGEuc2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAobWV0YS50aGVtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldE9yaWdpbmFsVGhlbWUobWV0YS50aGVtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9uQ29yZVBsYXkgPSAoKSA9PiB7XG4gICAgc2V0T3ZlcmxheShudWxsKTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlUGxheWluZyA9ICgpID0+IHtcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBzZXRJc1BsYXlpbmcodHJ1ZSk7XG4gICAgICBzZXRXYXNQbGF5aW5nKHRydWUpO1xuICAgICAgc2V0T3ZlcmxheShudWxsKTtcbiAgICAgIG9uUGxheWluZygpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvbkNvcmVJZGxlID0gKCkgPT4ge1xuICAgIGJhdGNoKCgpID0+IHtcbiAgICAgIHNldElzUGxheWluZyhmYWxzZSk7XG4gICAgICBvblN0b3BwZWQoKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlTG9hZGluZyA9ICgpID0+IHtcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBzZXRJc1BsYXlpbmcoZmFsc2UpO1xuICAgICAgb25TdG9wcGVkKCk7XG4gICAgICBzZXRPdmVybGF5KFwibG9hZGVyXCIpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvbkNvcmVPZmZsaW5lID0gX3JlZjIgPT4ge1xuICAgIGxldCB7XG4gICAgICBtZXNzYWdlXG4gICAgfSA9IF9yZWYyO1xuICAgIGJhdGNoKCgpID0+IHtcbiAgICAgIHNldElzUGxheWluZyhmYWxzZSk7XG4gICAgICBvblN0b3BwZWQoKTtcbiAgICAgIGlmIChtZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0SW5mb01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIHNldE92ZXJsYXkoXCJpbmZvXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBjb25zdCBvbkNvcmVNdXRlZCA9IG11dGVkID0+IHtcbiAgICBzZXRJc011dGVkKG11dGVkKTtcbiAgfTtcbiAgY29uc3Qgc3RhdHMgPSB7XG4gICAgdGVybWluYWw6IHtcbiAgICAgIHJlbmRlcnM6IDBcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uQ29yZUVuZGVkID0gX3JlZjMgPT4ge1xuICAgIGxldCB7XG4gICAgICBtZXNzYWdlXG4gICAgfSA9IF9yZWYzO1xuICAgIGJhdGNoKCgpID0+IHtcbiAgICAgIHNldElzUGxheWluZyhmYWxzZSk7XG4gICAgICBvblN0b3BwZWQoKTtcbiAgICAgIGlmIChtZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0SW5mb01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIHNldE92ZXJsYXkoXCJpbmZvXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGxvZ2dlci5kZWJ1ZyhcInN0YXRzXCIsIHN0YXRzLnRlcm1pbmFsKTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlRXJyb3JlZCA9ICgpID0+IHtcbiAgICBzZXRPdmVybGF5KFwiZXJyb3JcIik7XG4gIH07XG4gIGNvbnN0IG9uQ29yZVNlZWtlZCA9ICgpID0+IHtcbiAgICB1cGRhdGVUaW1lKCk7XG4gIH07XG4gIGNvcmUuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5XCIsIG9uQ29yZVJlYWR5KTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwibWV0YWRhdGFcIiwgb25Db3JlTWV0YWRhdGEpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsIG9uQ29yZVBsYXkpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5aW5nXCIsIG9uQ29yZVBsYXlpbmcpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJpZGxlXCIsIG9uQ29yZUlkbGUpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkaW5nXCIsIG9uQ29yZUxvYWRpbmcpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJvZmZsaW5lXCIsIG9uQ29yZU9mZmxpbmUpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJtdXRlZFwiLCBvbkNvcmVNdXRlZCk7XG4gIGNvcmUuYWRkRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsIG9uQ29yZUVuZGVkKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JlZFwiLCBvbkNvcmVFcnJvcmVkKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwic2Vla2VkXCIsIG9uQ29yZVNlZWtlZCk7XG4gIGNvbnN0IHNldHVwUmVzaXplT2JzZXJ2ZXIgPSAoKSA9PiB7XG4gICAgcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoZGVib3VuY2UoX2VudHJpZXMgPT4ge1xuICAgICAgc2V0U3RhdGUoe1xuICAgICAgICBjb250YWluZXJXOiB3cmFwcGVyUmVmLm9mZnNldFdpZHRoLFxuICAgICAgICBjb250YWluZXJIOiB3cmFwcGVyUmVmLm9mZnNldEhlaWdodFxuICAgICAgfSk7XG4gICAgICB3cmFwcGVyUmVmLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwicmVzaXplXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgZWw6IHBsYXllclJlZlxuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSwgMTApKTtcbiAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKHdyYXBwZXJSZWYpO1xuICB9O1xuICBvbk1vdW50KGFzeW5jICgpID0+IHtcbiAgICBsb2dnZXIuaW5mbyhcInZpZXc6IG1vdW50ZWRcIik7XG4gICAgbG9nZ2VyLmRlYnVnKFwidmlldzogZm9udCBtZWFzdXJlbWVudHNcIiwge1xuICAgICAgY2hhclcsXG4gICAgICBjaGFySFxuICAgIH0pO1xuICAgIHNldHVwUmVzaXplT2JzZXJ2ZXIoKTtcbiAgICBzZXRTdGF0ZSh7XG4gICAgICBjb250YWluZXJXOiB3cmFwcGVyUmVmLm9mZnNldFdpZHRoLFxuICAgICAgY29udGFpbmVySDogd3JhcHBlclJlZi5vZmZzZXRIZWlnaHRcbiAgICB9KTtcbiAgfSk7XG4gIG9uQ2xlYW51cCgoKSA9PiB7XG4gICAgY29yZS5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVhZHlcIiwgb25Db3JlUmVhZHkpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1ldGFkYXRhXCIsIG9uQ29yZU1ldGFkYXRhKTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsIG9uQ29yZVBsYXkpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBsYXlpbmdcIiwgb25Db3JlUGxheWluZyk7XG4gICAgY29yZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiaWRsZVwiLCBvbkNvcmVJZGxlKTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkaW5nXCIsIG9uQ29yZUxvYWRpbmcpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm9mZmxpbmVcIiwgb25Db3JlT2ZmbGluZSk7XG4gICAgY29yZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibXV0ZWRcIiwgb25Db3JlTXV0ZWQpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsIG9uQ29yZUVuZGVkKTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvcmVkXCIsIG9uQ29yZUVycm9yZWQpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNlZWtlZFwiLCBvbkNvcmVTZWVrZWQpO1xuICAgIGNvcmUuc3RvcCgpO1xuICAgIHN0b3BUaW1lVXBkYXRlcygpO1xuICAgIHJlc2l6ZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgfSk7XG4gIGNvbnN0IHRlcm1pbmFsRWxlbWVudFNpemUgPSBjcmVhdGVNZW1vKCgpID0+IHtcbiAgICBjb25zdCB0ZXJtaW5hbFcgPSBjaGFyVyAqIHRlcm1pbmFsQ29scygpICsgYm9yZGVyc1c7XG4gICAgY29uc3QgdGVybWluYWxIID0gY2hhckggKiB0ZXJtaW5hbFJvd3MoKSArIGJvcmRlcnNIO1xuICAgIGxldCBmaXQgPSBwcm9wcy5maXQgPz8gXCJ3aWR0aFwiO1xuICAgIGlmIChmaXQgPT09IFwiYm90aFwiIHx8IHN0YXRlLmlzRnVsbHNjcmVlbikge1xuICAgICAgY29uc3QgY29udGFpbmVyUmF0aW8gPSBzdGF0ZS5jb250YWluZXJXIC8gKHN0YXRlLmNvbnRhaW5lckggLSBjb250cm9sQmFySGVpZ2h0KCkpO1xuICAgICAgY29uc3QgdGVybWluYWxSYXRpbyA9IHRlcm1pbmFsVyAvIHRlcm1pbmFsSDtcbiAgICAgIGlmIChjb250YWluZXJSYXRpbyA+IHRlcm1pbmFsUmF0aW8pIHtcbiAgICAgICAgZml0ID0gXCJoZWlnaHRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpdCA9IFwid2lkdGhcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpdCA9PT0gZmFsc2UgfHwgZml0ID09PSBcIm5vbmVcIikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0gZWxzZSBpZiAoZml0ID09PSBcIndpZHRoXCIpIHtcbiAgICAgIGNvbnN0IHNjYWxlID0gc3RhdGUuY29udGFpbmVyVyAvIHRlcm1pbmFsVztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNjYWxlOiBzY2FsZSxcbiAgICAgICAgd2lkdGg6IHN0YXRlLmNvbnRhaW5lclcsXG4gICAgICAgIGhlaWdodDogdGVybWluYWxIICogc2NhbGUgKyBjb250cm9sQmFySGVpZ2h0KClcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChmaXQgPT09IFwiaGVpZ2h0XCIpIHtcbiAgICAgIGNvbnN0IHNjYWxlID0gKHN0YXRlLmNvbnRhaW5lckggLSBjb250cm9sQmFySGVpZ2h0KCkpIC8gdGVybWluYWxIO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgICB3aWR0aDogdGVybWluYWxXICogc2NhbGUsXG4gICAgICAgIGhlaWdodDogc3RhdGUuY29udGFpbmVySFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBmaXQgbW9kZTogJHtmaXR9YCk7XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb25GdWxsc2NyZWVuQ2hhbmdlID0gKCkgPT4ge1xuICAgIHNldFN0YXRlKFwiaXNGdWxsc2NyZWVuXCIsIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID8/IGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50KTtcbiAgfTtcbiAgY29uc3QgdG9nZ2xlRnVsbHNjcmVlbiA9ICgpID0+IHtcbiAgICBpZiAoc3RhdGUuaXNGdWxsc2NyZWVuKSB7XG4gICAgICAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4gPz8gZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4gPz8gKCgpID0+IHt9KSkuYXBwbHkoZG9jdW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAod3JhcHBlclJlZi5yZXF1ZXN0RnVsbHNjcmVlbiA/PyB3cmFwcGVyUmVmLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuID8/ICgoKSA9PiB7fSkpLmFwcGx5KHdyYXBwZXJSZWYpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdG9nZ2xlSGVscCA9ICgpID0+IHtcbiAgICBpZiAoaXNIZWxwVmlzaWJsZSgpKSB7XG4gICAgICBzZXRJc0hlbHBWaXNpYmxlKGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29yZS5wYXVzZSgpO1xuICAgICAgc2V0SXNIZWxwVmlzaWJsZSh0cnVlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uS2V5RG93biA9IGUgPT4ge1xuICAgIGlmIChlLmFsdEtleSB8fCBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlLmtleSA9PSBcIiBcIikge1xuICAgICAgY29yZS50b2dnbGVQbGF5KCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIixcIikge1xuICAgICAgY29yZS5zdGVwKC0xKS50aGVuKHVwZGF0ZVRpbWUpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCIuXCIpIHtcbiAgICAgIGNvcmUuc3RlcCgpLnRoZW4odXBkYXRlVGltZSk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcImZcIikge1xuICAgICAgdG9nZ2xlRnVsbHNjcmVlbigpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCJtXCIpIHtcbiAgICAgIHRvZ2dsZU11dGVkKCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIltcIikge1xuICAgICAgY29yZS5zZWVrKHtcbiAgICAgICAgbWFya2VyOiBcInByZXZcIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIl1cIikge1xuICAgICAgY29yZS5zZWVrKHtcbiAgICAgICAgbWFya2VyOiBcIm5leHRcIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChlLmtleS5jaGFyQ29kZUF0KDApID49IDQ4ICYmIGUua2V5LmNoYXJDb2RlQXQoMCkgPD0gNTcpIHtcbiAgICAgIGNvbnN0IHBvcyA9IChlLmtleS5jaGFyQ29kZUF0KDApIC0gNDgpIC8gMTA7XG4gICAgICBjb3JlLnNlZWsoYCR7cG9zICogMTAwfSVgKTtcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09IFwiP1wiKSB7XG4gICAgICB0b2dnbGVIZWxwKCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIkFycm93TGVmdFwiKSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBjb3JlLnNlZWsoXCI8PDxcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3JlLnNlZWsoXCI8PFwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUua2V5ID09IFwiQXJyb3dSaWdodFwiKSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBjb3JlLnNlZWsoXCI+Pj5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3JlLnNlZWsoXCI+PlwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUua2V5ID09IFwiRXNjYXBlXCIpIHtcbiAgICAgIHNldElzSGVscFZpc2libGUoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuICBjb25zdCB3cmFwcGVyT25Nb3VzZU1vdmUgPSAoKSA9PiB7XG4gICAgaWYgKHN0YXRlLmlzRnVsbHNjcmVlbikge1xuICAgICAgb25Vc2VyQWN0aXZlKHRydWUpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcGxheWVyT25Nb3VzZUxlYXZlID0gKCkgPT4ge1xuICAgIGlmICghc3RhdGUuaXNGdWxsc2NyZWVuKSB7XG4gICAgICBvblVzZXJBY3RpdmUoZmFsc2UpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc3RhcnRUaW1lVXBkYXRlcyA9ICgpID0+IHtcbiAgICB0aW1lVXBkYXRlSW50ZXJ2YWxJZCA9IHNldEludGVydmFsKHVwZGF0ZVRpbWUsIDEwMCk7XG4gIH07XG4gIGNvbnN0IHN0b3BUaW1lVXBkYXRlcyA9ICgpID0+IHtcbiAgICBjbGVhckludGVydmFsKHRpbWVVcGRhdGVJbnRlcnZhbElkKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlVGltZSA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50VGltZSA9IGF3YWl0IGNvcmUuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICBjb25zdCByZW1haW5pbmdUaW1lID0gYXdhaXQgY29yZS5nZXRSZW1haW5pbmdUaW1lKCk7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBhd2FpdCBjb3JlLmdldFByb2dyZXNzKCk7XG4gICAgc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFRpbWUsXG4gICAgICByZW1haW5pbmdUaW1lLFxuICAgICAgcHJvZ3Jlc3NcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb25Vc2VyQWN0aXZlID0gc2hvdyA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHVzZXJBY3Rpdml0eVRpbWVvdXRJZCk7XG4gICAgaWYgKHNob3cpIHtcbiAgICAgIHVzZXJBY3Rpdml0eVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gb25Vc2VyQWN0aXZlKGZhbHNlKSwgMjAwMCk7XG4gICAgfVxuICAgIHNldFVzZXJBY3RpdmUoc2hvdyk7XG4gIH07XG4gIGNvbnN0IGVtYmVkZGVkVGhlbWUgPSBjcmVhdGVNZW1vKCgpID0+IHByZWZlckVtYmVkZGVkVGhlbWUgPyBvcmlnaW5hbFRoZW1lKCkgOiBudWxsKTtcbiAgY29uc3QgcGxheWVyU3R5bGUgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB7fTtcbiAgICBpZiAoKHByb3BzLmZpdCA9PT0gZmFsc2UgfHwgcHJvcHMuZml0ID09PSBcIm5vbmVcIikgJiYgcHJvcHMudGVybWluYWxGb250U2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAocHJvcHMudGVybWluYWxGb250U2l6ZSA9PT0gXCJzbWFsbFwiKSB7XG4gICAgICAgIHN0eWxlW1wiZm9udC1zaXplXCJdID0gXCIxMnB4XCI7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnRlcm1pbmFsRm9udFNpemUgPT09IFwibWVkaXVtXCIpIHtcbiAgICAgICAgc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjE4cHhcIjtcbiAgICAgIH0gZWxzZSBpZiAocHJvcHMudGVybWluYWxGb250U2l6ZSA9PT0gXCJiaWdcIikge1xuICAgICAgICBzdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMjRweFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGVbXCJmb250LXNpemVcIl0gPSBwcm9wcy50ZXJtaW5hbEZvbnRTaXplO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzaXplID0gdGVybWluYWxFbGVtZW50U2l6ZSgpO1xuICAgIGlmIChzaXplLndpZHRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlW1wid2lkdGhcIl0gPSBgJHtzaXplLndpZHRofXB4YDtcbiAgICAgIHN0eWxlW1wiaGVpZ2h0XCJdID0gYCR7c2l6ZS5oZWlnaHR9cHhgO1xuICAgIH1cbiAgICBpZiAocHJvcHMudGVybWluYWxGb250RmFtaWx5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlW1wiLS10ZXJtLWZvbnQtZmFtaWx5XCJdID0gcHJvcHMudGVybWluYWxGb250RmFtaWx5O1xuICAgIH1cbiAgICBjb25zdCB0aGVtZUNvbG9ycyA9IGVtYmVkZGVkVGhlbWUoKTtcbiAgICBpZiAodGhlbWVDb2xvcnMpIHtcbiAgICAgIHN0eWxlW1wiLS10ZXJtLWNvbG9yLWZvcmVncm91bmRcIl0gPSB0aGVtZUNvbG9ycy5mb3JlZ3JvdW5kO1xuICAgICAgc3R5bGVbXCItLXRlcm0tY29sb3ItYmFja2dyb3VuZFwiXSA9IHRoZW1lQ29sb3JzLmJhY2tncm91bmQ7XG4gICAgfVxuICAgIHJldHVybiBzdHlsZTtcbiAgfTtcbiAgY29uc3QgcGxheSA9ICgpID0+IHtcbiAgICBjb3JlUmVhZHkudGhlbigoKSA9PiBjb3JlLnBsYXkoKSk7XG4gIH07XG4gIGNvbnN0IHRvZ2dsZVBsYXkgPSAoKSA9PiB7XG4gICAgY29yZVJlYWR5LnRoZW4oKCkgPT4gY29yZS50b2dnbGVQbGF5KCkpO1xuICB9O1xuICBjb25zdCB0b2dnbGVNdXRlZCA9ICgpID0+IHtcbiAgICBjb3JlUmVhZHkudGhlbigoKSA9PiB7XG4gICAgICBpZiAoaXNNdXRlZCgpID09PSB0cnVlKSB7XG4gICAgICAgIGNvcmUudW5tdXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3JlLm11dGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2VlayA9IHBvcyA9PiB7XG4gICAgY29yZVJlYWR5LnRoZW4oKCkgPT4gY29yZS5zZWVrKHBvcykpO1xuICB9O1xuICBjb25zdCBwbGF5ZXJDbGFzcyA9ICgpID0+IGBhcC1wbGF5ZXIgYXAtZGVmYXVsdC10ZXJtLWZmIGFzY2lpbmVtYS1wbGF5ZXItdGhlbWUtJHt0aGVtZU5hbWV9YDtcbiAgY29uc3QgdGVybWluYWxTY2FsZSA9ICgpID0+IHRlcm1pbmFsRWxlbWVudFNpemUoKT8uc2NhbGU7XG4gIGNvbnN0IGVsID0gKCgpID0+IHtcbiAgICBjb25zdCBfZWwkID0gX3RtcGwkLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgIF9lbCQyID0gX2VsJC5maXJzdENoaWxkO1xuICAgIGNvbnN0IF9yZWYkID0gd3JhcHBlclJlZjtcbiAgICB0eXBlb2YgX3JlZiQgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJCwgX2VsJCkgOiB3cmFwcGVyUmVmID0gX2VsJDtcbiAgICBfZWwkLmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJraXRmdWxsc2NyZWVuY2hhbmdlXCIsIG9uRnVsbHNjcmVlbkNoYW5nZSk7XG4gICAgX2VsJC5hZGRFdmVudExpc3RlbmVyKFwiZnVsbHNjcmVlbmNoYW5nZVwiLCBvbkZ1bGxzY3JlZW5DaGFuZ2UpO1xuICAgIF9lbCQuJCRtb3VzZW1vdmUgPSB3cmFwcGVyT25Nb3VzZU1vdmU7XG4gICAgX2VsJC4kJGtleWRvd24gPSBvbktleURvd247XG4gICAgY29uc3QgX3JlZiQyID0gcGxheWVyUmVmO1xuICAgIHR5cGVvZiBfcmVmJDIgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJDIsIF9lbCQyKSA6IHBsYXllclJlZiA9IF9lbCQyO1xuICAgIF9lbCQyLiQkbW91c2Vtb3ZlID0gKCkgPT4gb25Vc2VyQWN0aXZlKHRydWUpO1xuICAgIF9lbCQyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIHBsYXllck9uTW91c2VMZWF2ZSk7XG4gICAgaW5zZXJ0KF9lbCQyLCBjcmVhdGVDb21wb25lbnQoVGVybWluYWwsIHtcbiAgICAgIGdldCBjb2xzKCkge1xuICAgICAgICByZXR1cm4gdGVybWluYWxDb2xzKCk7XG4gICAgICB9LFxuICAgICAgZ2V0IHJvd3MoKSB7XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbFJvd3MoKTtcbiAgICAgIH0sXG4gICAgICBnZXQgc2NhbGUoKSB7XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbFNjYWxlKCk7XG4gICAgICB9LFxuICAgICAgZ2V0IGJsaW5raW5nKCkge1xuICAgICAgICByZXR1cm4gYmxpbmtpbmcoKTtcbiAgICAgIH0sXG4gICAgICBnZXQgbGluZUhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzLnRlcm1pbmFsTGluZUhlaWdodDtcbiAgICAgIH0sXG4gICAgICBwcmVmZXJFbWJlZGRlZFRoZW1lOiBwcmVmZXJFbWJlZGRlZFRoZW1lLFxuICAgICAgY29yZTogY29yZSxcbiAgICAgIGdldCBzdGF0cygpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRzLnRlcm1pbmFsO1xuICAgICAgfVxuICAgIH0pLCBudWxsKTtcbiAgICBpbnNlcnQoX2VsJDIsIGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzLmNvbnRyb2xzICE9PSBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoQ29udHJvbEJhciwge1xuICAgICAgICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBkdXJhdGlvbigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmN1cnJlbnRUaW1lO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IHJlbWFpbmluZ1RpbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUucmVtYWluaW5nVGltZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBwcm9ncmVzcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5wcm9ncmVzcztcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1hcmtlcnM6IG1hcmtlcnMsXG4gICAgICAgICAgZ2V0IGlzUGxheWluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1BsYXlpbmcoKSB8fCBvdmVybGF5KCkgPT0gXCJsb2FkZXJcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBpc1BhdXNhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmlzUGF1c2FibGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgaXNTZWVrYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5pc1NlZWthYmxlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGlzTXV0ZWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNNdXRlZCgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25QbGF5Q2xpY2s6IHRvZ2dsZVBsYXksXG4gICAgICAgICAgb25GdWxsc2NyZWVuQ2xpY2s6IHRvZ2dsZUZ1bGxzY3JlZW4sXG4gICAgICAgICAgb25IZWxwQ2xpY2s6IHRvZ2dsZUhlbHAsXG4gICAgICAgICAgb25TZWVrQ2xpY2s6IHNlZWssXG4gICAgICAgICAgb25NdXRlQ2xpY2s6IHRvZ2dsZU11dGVkLFxuICAgICAgICAgIHJlZihyJCkge1xuICAgICAgICAgICAgY29uc3QgX3JlZiQzID0gY29udHJvbEJhclJlZjtcbiAgICAgICAgICAgIHR5cGVvZiBfcmVmJDMgPT09IFwiZnVuY3Rpb25cIiA/IF9yZWYkMyhyJCkgOiBjb250cm9sQmFyUmVmID0gciQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgaW5zZXJ0KF9lbCQyLCBjcmVhdGVDb21wb25lbnQoU3dpdGNoLCB7XG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiBbY3JlYXRlQ29tcG9uZW50KE1hdGNoLCB7XG4gICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gb3ZlcmxheSgpID09IFwic3RhcnRcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoU3RhcnRPdmVybGF5LCB7XG4gICAgICAgICAgICAgIG9uQ2xpY2s6IHBsYXlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSksIGNyZWF0ZUNvbXBvbmVudChNYXRjaCwge1xuICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIG92ZXJsYXkoKSA9PSBcImxvYWRlclwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbXBvbmVudChMb2FkZXJPdmVybGF5LCB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSwgY3JlYXRlQ29tcG9uZW50KE1hdGNoLCB7XG4gICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gb3ZlcmxheSgpID09IFwiZXJyb3JcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoRXJyb3JPdmVybGF5LCB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KV07XG4gICAgICB9XG4gICAgfSksIG51bGwpO1xuICAgIGluc2VydChfZWwkMiwgY3JlYXRlQ29tcG9uZW50KFRyYW5zaXRpb24sIHtcbiAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gb3ZlcmxheSgpID09IFwiaW5mb1wiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbXBvbmVudChJbmZvT3ZlcmxheSwge1xuICAgICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5mb01lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZ2V0IHdhc1BsYXlpbmcoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdhc1BsYXlpbmcoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgaW5zZXJ0KF9lbCQyLCBjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiBpc0hlbHBWaXNpYmxlKCk7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50KEhlbHBPdmVybGF5LCB7XG4gICAgICAgICAgb25DbG9zZTogKCkgPT4gc2V0SXNIZWxwVmlzaWJsZShmYWxzZSksXG4gICAgICAgICAgZ2V0IGlzUGF1c2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuaXNQYXVzYWJsZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBpc1NlZWthYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmlzU2Vla2FibGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgaGFzQXVkaW8oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNNdXRlZCgpICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgY3JlYXRlUmVuZGVyRWZmZWN0KF9wJCA9PiB7XG4gICAgICBjb25zdCBfdiQgPSAhIWNvbnRyb2xzVmlzaWJsZSgpLFxuICAgICAgICBfdiQyID0gcGxheWVyQ2xhc3MoKSxcbiAgICAgICAgX3YkMyA9IHBsYXllclN0eWxlKCk7XG4gICAgICBfdiQgIT09IF9wJC5fdiQgJiYgX2VsJC5jbGFzc0xpc3QudG9nZ2xlKFwiYXAtaHVkXCIsIF9wJC5fdiQgPSBfdiQpO1xuICAgICAgX3YkMiAhPT0gX3AkLl92JDIgJiYgY2xhc3NOYW1lKF9lbCQyLCBfcCQuX3YkMiA9IF92JDIpO1xuICAgICAgX3AkLl92JDMgPSBzdHlsZShfZWwkMiwgX3YkMywgX3AkLl92JDMpO1xuICAgICAgcmV0dXJuIF9wJDtcbiAgICB9LCB7XG4gICAgICBfdiQ6IHVuZGVmaW5lZCxcbiAgICAgIF92JDI6IHVuZGVmaW5lZCxcbiAgICAgIF92JDM6IHVuZGVmaW5lZFxuICAgIH0pO1xuICAgIHJldHVybiBfZWwkO1xuICB9KSgpO1xuICByZXR1cm4gZWw7XG59KTtcbmRlbGVnYXRlRXZlbnRzKFtcImtleWRvd25cIiwgXCJtb3VzZW1vdmVcIl0pO1xuXG5mdW5jdGlvbiBtb3VudChjb3JlLCBlbGVtKSB7XG4gIGxldCBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgY29uc3QgbWV0cmljcyA9IG1lYXN1cmVUZXJtaW5hbChvcHRzLnRlcm1pbmFsRm9udEZhbWlseSwgb3B0cy50ZXJtaW5hbExpbmVIZWlnaHQpO1xuICBjb25zdCBwcm9wcyA9IHtcbiAgICBjb3JlOiBjb3JlLFxuICAgIGxvZ2dlcjogb3B0cy5sb2dnZXIsXG4gICAgY29sczogb3B0cy5jb2xzLFxuICAgIHJvd3M6IG9wdHMucm93cyxcbiAgICBmaXQ6IG9wdHMuZml0LFxuICAgIGNvbnRyb2xzOiBvcHRzLmNvbnRyb2xzLFxuICAgIGF1dG9QbGF5OiBvcHRzLmF1dG9QbGF5LFxuICAgIHRlcm1pbmFsRm9udFNpemU6IG9wdHMudGVybWluYWxGb250U2l6ZSxcbiAgICB0ZXJtaW5hbEZvbnRGYW1pbHk6IG9wdHMudGVybWluYWxGb250RmFtaWx5LFxuICAgIHRlcm1pbmFsTGluZUhlaWdodDogb3B0cy50ZXJtaW5hbExpbmVIZWlnaHQsXG4gICAgdGhlbWU6IG9wdHMudGhlbWUsXG4gICAgLi4ubWV0cmljc1xuICB9O1xuICBsZXQgZWw7XG4gIGNvbnN0IGRpc3Bvc2UgPSByZW5kZXIoKCkgPT4ge1xuICAgIGVsID0gY3JlYXRlQ29tcG9uZW50KFBsYXllciwgcHJvcHMpO1xuICAgIHJldHVybiBlbDtcbiAgfSwgZWxlbSk7XG4gIHJldHVybiB7XG4gICAgZWw6IGVsLFxuICAgIGRpc3Bvc2U6IGRpc3Bvc2VcbiAgfTtcbn1cbmZ1bmN0aW9uIG1lYXN1cmVUZXJtaW5hbChmb250RmFtaWx5LCBsaW5lSGVpZ2h0KSB7XG4gIGNvbnN0IGNvbHMgPSA4MDtcbiAgY29uc3Qgcm93cyA9IDI0O1xuICBjb25zdCBwbGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBwbGF5ZXJEaXYuY2xhc3NOYW1lID0gXCJhcC1kZWZhdWx0LXRlcm0tZmZcIjtcbiAgcGxheWVyRGl2LnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XG4gIHBsYXllckRpdi5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gIHBsYXllckRpdi5zdHlsZS5mb250U2l6ZSA9IFwiMTVweFwiOyAvLyBtdXN0IG1hdGNoIGZvbnQtc2l6ZSBvZiBkaXYuYXNjaWluZW1hLXBsYXllciBpbiBDU1NcblxuICBpZiAoZm9udEZhbWlseSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcGxheWVyRGl2LnN0eWxlLnNldFByb3BlcnR5KFwiLS10ZXJtLWZvbnQtZmFtaWx5XCIsIGZvbnRGYW1pbHkpO1xuICB9XG4gIGNvbnN0IHRlcm1EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB0ZXJtRGl2LmNsYXNzTmFtZSA9IFwiYXAtdGVybVwiO1xuICB0ZXJtRGl2LnN0eWxlLndpZHRoID0gYCR7Y29sc31jaGA7XG4gIHRlcm1EaXYuc3R5bGUuaGVpZ2h0ID0gYCR7cm93cyAqIChsaW5lSGVpZ2h0ID8/IDEuMzMzMzMzMzMzMyl9ZW1gO1xuICB0ZXJtRGl2LnN0eWxlLmZvbnRTaXplID0gXCIxMDAlXCI7XG4gIHBsYXllckRpdi5hcHBlbmRDaGlsZCh0ZXJtRGl2KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwbGF5ZXJEaXYpO1xuICBjb25zdCBtZXRyaWNzID0ge1xuICAgIGNoYXJXOiB0ZXJtRGl2LmNsaWVudFdpZHRoIC8gY29scyxcbiAgICBjaGFySDogdGVybURpdi5jbGllbnRIZWlnaHQgLyByb3dzLFxuICAgIGJvcmRlcnNXOiB0ZXJtRGl2Lm9mZnNldFdpZHRoIC0gdGVybURpdi5jbGllbnRXaWR0aCxcbiAgICBib3JkZXJzSDogdGVybURpdi5vZmZzZXRIZWlnaHQgLSB0ZXJtRGl2LmNsaWVudEhlaWdodFxuICB9O1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHBsYXllckRpdik7XG4gIHJldHVybiBtZXRyaWNzO1xufVxuXG5jb25zdCBDT1JFX09QVFMgPSBbJ2F1ZGlvVXJsJywgJ2F1dG9QbGF5JywgJ2F1dG9wbGF5JywgJ2JvbGRJc0JyaWdodCcsICdjb2xzJywgJ2lkbGVUaW1lTGltaXQnLCAnbG9vcCcsICdtYXJrZXJzJywgJ3BhdXNlT25NYXJrZXJzJywgJ3Bvc3RlcicsICdwcmVsb2FkJywgJ3Jvd3MnLCAnc3BlZWQnLCAnc3RhcnRBdCddO1xuY29uc3QgVUlfT1BUUyA9IFsnYXV0b1BsYXknLCAnYXV0b3BsYXknLCAnY29scycsICdjb250cm9scycsICdmaXQnLCAncm93cycsICd0ZXJtaW5hbEZvbnRGYW1pbHknLCAndGVybWluYWxGb250U2l6ZScsICd0ZXJtaW5hbExpbmVIZWlnaHQnLCAndGhlbWUnXTtcbmZ1bmN0aW9uIGNvcmVPcHRzKGlucHV0T3B0cykge1xuICBsZXQgb3ZlcnJpZGVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgY29uc3Qgb3B0cyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhpbnB1dE9wdHMpLmZpbHRlcihfcmVmID0+IHtcbiAgICBsZXQgW2tleV0gPSBfcmVmO1xuICAgIHJldHVybiBDT1JFX09QVFMuaW5jbHVkZXMoa2V5KTtcbiAgfSkpO1xuICBvcHRzLmF1dG9QbGF5ID8/PSBvcHRzLmF1dG9wbGF5O1xuICBvcHRzLnNwZWVkID8/PSAxLjA7XG4gIHJldHVybiB7XG4gICAgLi4ub3B0cyxcbiAgICAuLi5vdmVycmlkZXNcbiAgfTtcbn1cbmZ1bmN0aW9uIHVpT3B0cyhpbnB1dE9wdHMpIHtcbiAgbGV0IG92ZXJyaWRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIGNvbnN0IG9wdHMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoaW5wdXRPcHRzKS5maWx0ZXIoX3JlZjIgPT4ge1xuICAgIGxldCBba2V5XSA9IF9yZWYyO1xuICAgIHJldHVybiBVSV9PUFRTLmluY2x1ZGVzKGtleSk7XG4gIH0pKTtcbiAgb3B0cy5hdXRvUGxheSA/Pz0gb3B0cy5hdXRvcGxheTtcbiAgb3B0cy5jb250cm9scyA/Pz0gXCJhdXRvXCI7XG4gIHJldHVybiB7XG4gICAgLi4ub3B0cyxcbiAgICAuLi5vdmVycmlkZXNcbiAgfTtcbn1cblxuZXhwb3J0IHsgY29yZU9wdHMgYXMgYywgbW91bnQgYXMgbSwgdWlPcHRzIGFzIHUgfTtcbiIsICJpbXBvcnQgeyBDIGFzIENvcmUgfSBmcm9tICcuL2NvcmUtRG5OT010Wm4uanMnO1xuaW1wb3J0IHsgYyBhcyBjb3JlT3B0cywgbSBhcyBtb3VudCwgdSBhcyB1aU9wdHMgfSBmcm9tICcuL29wdHMtQnRMeHNNXzYuanMnO1xuaW1wb3J0IHsgRCBhcyBEdW1teUxvZ2dlciB9IGZyb20gJy4vbG9nZ2luZy0tUDBDc0V1Xy5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZShzcmMsIGVsZW0pIHtcbiAgbGV0IG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuICBjb25zdCBsb2dnZXIgPSBvcHRzLmxvZ2dlciA/PyBuZXcgRHVtbXlMb2dnZXIoKTtcbiAgY29uc3QgY29yZSA9IG5ldyBDb3JlKHNyYywgY29yZU9wdHMob3B0cywge1xuICAgIGxvZ2dlclxuICB9KSk7XG4gIGNvbnN0IHtcbiAgICBlbCxcbiAgICBkaXNwb3NlXG4gIH0gPSBtb3VudChjb3JlLCBlbGVtLCB1aU9wdHMob3B0cywge1xuICAgIGxvZ2dlclxuICB9KSk7XG4gIGNvbnN0IHJlYWR5ID0gY29yZS5pbml0KCk7XG4gIGNvbnN0IHBsYXllciA9IHtcbiAgICBlbCxcbiAgICBkaXNwb3NlLFxuICAgIGdldEN1cnJlbnRUaW1lOiAoKSA9PiByZWFkeS50aGVuKGNvcmUuZ2V0Q3VycmVudFRpbWUuYmluZChjb3JlKSksXG4gICAgZ2V0RHVyYXRpb246ICgpID0+IHJlYWR5LnRoZW4oY29yZS5nZXREdXJhdGlvbi5iaW5kKGNvcmUpKSxcbiAgICBwbGF5OiAoKSA9PiByZWFkeS50aGVuKGNvcmUucGxheS5iaW5kKGNvcmUpKSxcbiAgICBwYXVzZTogKCkgPT4gcmVhZHkudGhlbihjb3JlLnBhdXNlLmJpbmQoY29yZSkpLFxuICAgIHNlZWs6IHBvcyA9PiByZWFkeS50aGVuKCgpID0+IGNvcmUuc2Vlayhwb3MpKVxuICB9O1xuICBwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lciA9IChuYW1lLCBjYWxsYmFjaykgPT4ge1xuICAgIHJldHVybiBjb3JlLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2FsbGJhY2suYmluZChwbGF5ZXIpKTtcbiAgfTtcbiAgcmV0dXJuIHBsYXllcjtcbn1cblxuZXhwb3J0IHsgY3JlYXRlIH07XG4iLCAiLmFwLWRlZmF1bHQtdGVybS1mZiB7XG4gIC0tdGVybS1mb250LWZhbWlseTogXCJDYXNjYWRpYSBDb2RlXCIsIFwiU291cmNlIENvZGUgUHJvXCIsIE1lbmxvLCBDb25zb2xhcywgXCJEZWphVnUgU2FucyBNb25vXCIsIG1vbm9zcGFjZSwgXCJTeW1ib2xzIE5lcmQgRm9udFwiO1xufVxuZGl2LmFwLXdyYXBwZXIge1xuICBvdXRsaW5lOiBub25lO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuZGl2LmFwLXdyYXBwZXIgLnRpdGxlLWJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHRvcDogLTc4cHg7XG4gIHRyYW5zaXRpb246IHRvcCAwLjE1cyBsaW5lYXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICBmb250LXNpemU6IDIwcHg7XG4gIGxpbmUtaGVpZ2h0OiAxZW07XG4gIHBhZGRpbmc6IDE1cHg7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTtcbn1cbmRpdi5hcC13cmFwcGVyIC50aXRsZS1iYXIgaW1nIHtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgaGVpZ2h0OiA0OHB4O1xuICBtYXJnaW4tcmlnaHQ6IDE2cHg7XG59XG5kaXYuYXAtd3JhcHBlciAudGl0bGUtYmFyIGEge1xuICBjb2xvcjogd2hpdGU7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuZGl2LmFwLXdyYXBwZXIgLnRpdGxlLWJhciBhOmhvdmVyIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuZGl2LmFwLXdyYXBwZXI6ZnVsbHNjcmVlbiB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XG4gIHdpZHRoOiAxMDAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuZGl2LmFwLXdyYXBwZXI6ZnVsbHNjcmVlbiAudGl0bGUtYmFyIHtcbiAgZGlzcGxheTogaW5pdGlhbDtcbn1cbmRpdi5hcC13cmFwcGVyOmZ1bGxzY3JlZW4uaHVkIC50aXRsZS1iYXIge1xuICB0b3A6IDA7XG59XG5kaXYuYXAtd3JhcHBlciBkaXYuYXAtcGxheWVyIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwYWRkaW5nOiAwcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIG1heC13aWR0aDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBmb250LXNpemU6IDE1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCk7XG59XG4uYXAtcGxheWVyIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNmZmZmZmY7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMDAwMDAwO1xuICAtLXRlcm0tY29sb3ItMDogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgLS10ZXJtLWNvbG9yLTE6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIC0tdGVybS1jb2xvci0yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICAtLXRlcm0tY29sb3ItMzogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgLS10ZXJtLWNvbG9yLTQ6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIC0tdGVybS1jb2xvci01OiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICAtLXRlcm0tY29sb3ItNjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgLS10ZXJtLWNvbG9yLTc6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIC0tdGVybS1jb2xvci04OiB2YXIoLS10ZXJtLWNvbG9yLTApO1xuICAtLXRlcm0tY29sb3ItOTogdmFyKC0tdGVybS1jb2xvci0xKTtcbiAgLS10ZXJtLWNvbG9yLTEwOiB2YXIoLS10ZXJtLWNvbG9yLTIpO1xuICAtLXRlcm0tY29sb3ItMTE6IHZhcigtLXRlcm0tY29sb3ItMyk7XG4gIC0tdGVybS1jb2xvci0xMjogdmFyKC0tdGVybS1jb2xvci00KTtcbiAgLS10ZXJtLWNvbG9yLTEzOiB2YXIoLS10ZXJtLWNvbG9yLTUpO1xuICAtLXRlcm0tY29sb3ItMTQ6IHZhcigtLXRlcm0tY29sb3ItNik7XG4gIC0tdGVybS1jb2xvci0xNTogdmFyKC0tdGVybS1jb2xvci03KTtcbn1cbmRpdi5hcC10ZXJtIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBmb250LWZhbWlseTogdmFyKC0tdGVybS1mb250LWZhbWlseSk7XG4gIGJvcmRlci13aWR0aDogMC43NWVtO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICBib3JkZXItY29sb3I6IHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCk7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xufVxuZGl2LmFwLXRlcm0gY2FudmFzIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5kaXYuYXAtdGVybSBzdmcuYXAtdGVybS1zeW1ib2xzIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuZGl2LmFwLXRlcm0gc3ZnLmFwLXRlcm0tc3ltYm9scyB1c2Uge1xuICBjb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbn1cbmRpdi5hcC10ZXJtIHN2Zy5hcC10ZXJtLXN5bWJvbHM6bm90KC5hcC1ibGluaykgLmFwLWJsaW5rIHtcbiAgb3BhY2l0eTogMDtcbn1cbmRpdi5hcC10ZXJtIHByZS5hcC10ZXJtLXRleHQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGluc2V0OiAwO1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwcHg7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aGl0ZS1zcGFjZTogcHJlO1xuICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgd29yZC1icmVhazogbm9ybWFsO1xuICBjdXJzb3I6IHRleHQ7XG4gIGNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICBvdXRsaW5lOiBub25lO1xuICBsaW5lLWhlaWdodDogdmFyKC0tdGVybS1saW5lLWhlaWdodCk7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICBmb250LXNpemU6IGluaGVyaXQ7XG4gIGZvbnQtdmFyaWFudC1saWdhdHVyZXM6IG5vbmU7XG4gIGJvcmRlcjogMDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbn1cbnByZS5hcC10ZXJtLXRleHQgLmFwLWxpbmUge1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogdmFyKC0tdGVybS1saW5lLWhlaWdodCk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiBjYWxjKDEwMCUgKiB2YXIoLS1yb3cpIC8gdmFyKC0tdGVybS1yb3dzKSk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5wcmUuYXAtdGVybS10ZXh0IC5hcC1saW5lIHNwYW4ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IGNhbGMoMTAwJSAqIHZhcigtLW9mZnNldCkgLyB2YXIoLS10ZXJtLWNvbHMpKTtcbiAgcGFkZGluZzogMDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5wcmUuYXAtdGVybS10ZXh0Om5vdCguYXAtYmxpbmspIC5hcC1saW5lIC5hcC1ibGluayB7XG4gIGNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cbnByZS5hcC10ZXJtLXRleHQgLmFwLWJvbGQge1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbnByZS5hcC10ZXJtLXRleHQgLmFwLWZhaW50IHtcbiAgb3BhY2l0eTogMC41O1xufVxucHJlLmFwLXRlcm0tdGV4dCAuYXAtdW5kZXJsaW5lIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG59XG5wcmUuYXAtdGVybS10ZXh0IC5hcC1pdGFsaWMge1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG59XG5wcmUuYXAtdGVybS10ZXh0IC5hcC1zdHJpa2Uge1xuICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcbn1cbi5hcC1saW5lIHNwYW4ge1xuICBjb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbn1cbmRpdi5hcC1wbGF5ZXIgZGl2LmFwLWNvbnRyb2wtYmFyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMzJweDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICBsaW5lLWhlaWdodDogMTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4xNXMgbGluZWFyO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgYm9yZGVyLXRvcDogMnB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xhYiwgdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKSA4MCUsIHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCkpO1xuICB6LWluZGV4OiAzMDtcbn1cbmRpdi5hcC1wbGF5ZXIgZGl2LmFwLWNvbnRyb2wtYmFyICoge1xuICBib3gtc2l6aW5nOiBpbmhlcml0O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHN2Zy5hcC1pY29uIHBhdGgge1xuICBmaWxsOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtYnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMCAwIGF1dG87XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbmRpdi5hcC1jb250cm9sLWJhciBzcGFuLmFwLXBsYXliYWNrLWJ1dHRvbiB7XG4gIHdpZHRoOiAxMnB4O1xuICBoZWlnaHQ6IDEycHg7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIG1hcmdpbjogMCAwIDAgMnB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtcGxheWJhY2stYnV0dG9uIHN2ZyB7XG4gIGhlaWdodDogMTJweDtcbiAgd2lkdGg6IDEycHg7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgc3Bhbi5hcC10aW1lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICBtaW4td2lkdGg6IDUwcHg7XG4gIG1hcmdpbjogMCAxMHB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBsaW5lLWhlaWdodDogMTAwJTtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtdGltZXIgc3BhbiB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS10ZXJtLWZvbnQtZmFtaWx5KTtcbiAgZm9udC1zaXplOiBpbmhlcml0O1xuICBmb250LXdlaWdodDogNjAwO1xuICBtYXJnaW46IGF1dG87XG59XG5kaXYuYXAtY29udHJvbC1iYXIgc3Bhbi5hcC10aW1lciAuYXAtdGltZS1yZW1haW5pbmcge1xuICBkaXNwbGF5OiBub25lO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtdGltZXI6aG92ZXIgLmFwLXRpbWUtZWxhcHNlZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgc3Bhbi5hcC10aW1lcjpob3ZlciAuYXAtdGltZS1yZW1haW5pbmcge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1wcm9ncmVzc2JhciB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmbGV4OiAxIDEgYXV0bztcbiAgaGVpZ2h0OiAxMDAlO1xuICBwYWRkaW5nOiAwIDEwcHg7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLXByb2dyZXNzYmFyIC5hcC1iYXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBjdXJzb3I6IGRlZmF1bHQ7XG4gIGhlaWdodDogMTAwJTtcbiAgZm9udC1zaXplOiAwO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1wcm9ncmVzc2JhciAuYXAtYmFyIC5hcC1ndXR0ZXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE1cHg7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBoZWlnaHQ6IDNweDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtcHJvZ3Jlc3NiYXIgLmFwLWJhciAuYXAtZ3V0dGVyLWVtcHR5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogY29sb3ItbWl4KGluIG9rbGFiLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpIDIwJSwgdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKSk7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLXByb2dyZXNzYmFyIC5hcC1iYXIgLmFwLWd1dHRlci1mdWxsIHtcbiAgd2lkdGg6IDEwMCU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGxlZnQgY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG59XG5kaXYuYXAtY29udHJvbC1iYXIuYXAtc2Vla2FibGUgLmFwLXByb2dyZXNzYmFyIC5hcC1iYXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLWZ1bGxzY3JlZW4tYnV0dG9uIHtcbiAgd2lkdGg6IDE0cHg7XG4gIGhlaWdodDogMTRweDtcbiAgcGFkZGluZzogOXB4O1xuICBtYXJnaW46IDAgMnB4IDAgNHB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1mdWxsc2NyZWVuLWJ1dHRvbiBzdmcge1xuICB3aWR0aDogMTRweDtcbiAgaGVpZ2h0OiAxNHB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1mdWxsc2NyZWVuLWJ1dHRvbiBzdmcuYXAtaWNvbi1mdWxsc2NyZWVuLW9uIHtcbiAgZGlzcGxheTogaW5saW5lO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1mdWxsc2NyZWVuLWJ1dHRvbiBzdmcuYXAtaWNvbi1mdWxsc2NyZWVuLW9mZiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLWZ1bGxzY3JlZW4tYnV0dG9uIC5hcC10b29sdGlwIHtcbiAgcmlnaHQ6IDVweDtcbiAgbGVmdDogaW5pdGlhbDtcbiAgdHJhbnNmb3JtOiBub25lO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1rYmQtYnV0dG9uIHtcbiAgaGVpZ2h0OiAxNHB4O1xuICBwYWRkaW5nOiA5cHg7XG4gIG1hcmdpbjogMCAwIDAgNHB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1rYmQtYnV0dG9uIHN2ZyB7XG4gIHdpZHRoOiAyNnB4O1xuICBoZWlnaHQ6IDE0cHg7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLWtiZC1idXR0b24gLmFwLXRvb2x0aXAge1xuICByaWdodDogNXB4O1xuICBsZWZ0OiBpbml0aWFsO1xuICB0cmFuc2Zvcm06IG5vbmU7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLXNwZWFrZXItYnV0dG9uIHtcbiAgd2lkdGg6IDE5cHg7XG4gIHBhZGRpbmc6IDZweCA5cHg7XG4gIG1hcmdpbjogMCAwIDAgNHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLXNwZWFrZXItYnV0dG9uIHN2ZyB7XG4gIHdpZHRoOiAxOXB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1zcGVha2VyLWJ1dHRvbiAuYXAtdG9vbHRpcCB7XG4gIGxlZnQ6IC01MCU7XG4gIHRyYW5zZm9ybTogbm9uZTtcbn1cbmRpdi5hcC13cmFwcGVyLmFwLWh1ZCAuYXAtY29udHJvbC1iYXIge1xuICBvcGFjaXR5OiAxO1xufVxuZGl2LmFwLXdyYXBwZXI6ZnVsbHNjcmVlbiAuYXAtZnVsbHNjcmVlbi1idXR0b24gc3ZnLmFwLWljb24tZnVsbHNjcmVlbi1vbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5kaXYuYXAtd3JhcHBlcjpmdWxsc2NyZWVuIC5hcC1mdWxsc2NyZWVuLWJ1dHRvbiBzdmcuYXAtaWNvbi1mdWxsc2NyZWVuLW9mZiB7XG4gIGRpc3BsYXk6IGlubGluZTtcbn1cbnNwYW4uYXAtcHJvZ3Jlc3NiYXIgc3Bhbi5hcC1tYXJrZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRvcDogMDtcbiAgYm90dG9tOiAwO1xuICB3aWR0aDogMjFweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBtYXJnaW4tbGVmdDogLTEwcHg7XG59XG5zcGFuLmFwLW1hcmtlci1jb250YWluZXIgc3Bhbi5hcC1tYXJrZXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgdG9wOiAxM3B4O1xuICBib3R0b206IDEycHg7XG4gIGxlZnQ6IDdweDtcbiAgcmlnaHQ6IDdweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogY29sb3ItbWl4KGluIG9rbGFiLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpIDMzJSwgdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKSk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdHJhbnNpdGlvbjogdG9wIDAuMXMsIGJvdHRvbSAwLjFzLCBsZWZ0IDAuMXMsIHJpZ2h0IDAuMXMsIGJhY2tncm91bmQtY29sb3IgMC4xcztcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xufVxuc3Bhbi5hcC1tYXJrZXItY29udGFpbmVyIHNwYW4uYXAtbWFya2VyLmFwLW1hcmtlci1wYXN0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbn1cbnNwYW4uYXAtbWFya2VyLWNvbnRhaW5lciBzcGFuLmFwLW1hcmtlcjpob3ZlcixcbnNwYW4uYXAtbWFya2VyLWNvbnRhaW5lcjpob3ZlciBzcGFuLmFwLW1hcmtlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIHRvcDogMTFweDtcbiAgYm90dG9tOiAxMHB4O1xuICBsZWZ0OiA1cHg7XG4gIHJpZ2h0OiA1cHg7XG59XG4uYXAtdG9vbHRpcC1jb250YWluZXIgc3Bhbi5hcC10b29sdGlwIHtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICBjb2xvcjogdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLXRlcm0tZm9udC1mYW1pbHkpO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nOiAwIDAuNWVtO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgLyogUHJldmVudHMgdGhlIHRleHQgZnJvbSB3cmFwcGluZyBhbmQgbWFrZXMgc3VyZSB0aGUgdG9vbHRpcCB3aWR0aCBhZGFwdHMgdG8gdGhlIHRleHQgbGVuZ3RoICovXG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgbGluZS1oZWlnaHQ6IDJlbTtcbiAgYm90dG9tOiAxMDAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbn1cbi5hcC10b29sdGlwLWNvbnRhaW5lcjpob3ZlciBzcGFuLmFwLXRvb2x0aXAge1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheSB7XG4gIHotaW5kZXg6IDEwO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktc3RhcnQge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LXN0YXJ0IC5hcC1wbGF5LWJ1dHRvbiB7XG4gIGZvbnQtc2l6ZTogMHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogd2hpdGU7XG4gIGhlaWdodDogODBweDtcbiAgbWF4LWhlaWdodDogNjYlO1xuICBtYXJnaW46IGF1dG87XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LXN0YXJ0IC5hcC1wbGF5LWJ1dHRvbiBkaXYge1xuICBoZWlnaHQ6IDEwMCU7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LXN0YXJ0IC5hcC1wbGF5LWJ1dHRvbiBkaXYgc3BhbiB7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogYmxvY2s7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LXN0YXJ0IC5hcC1wbGF5LWJ1dHRvbiBkaXYgc3BhbiBzdmcge1xuICBoZWlnaHQ6IDEwMCU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktc3RhcnQgLmFwLXBsYXktYnV0dG9uIHN2ZyB7XG4gIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgwLCAwLCAwLCAwLjQpKTtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktbG9hZGluZyAuYXAtbG9hZGVyIHtcbiAgd2lkdGg6IDQ4cHg7XG4gIGhlaWdodDogNDhweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm9yZGVyOiAxMHB4IHNvbGlkO1xuICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSkgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpICNmZmZmZmY7XG4gIGJvcmRlci1jb2xvcjogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCkgMzAlLCB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpKSBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKSA1MCUsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkpIGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpIDcwJSwgdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKSkgY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCkgMTAwJSwgdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKSk7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGFuaW1hdGlvbjogYXAtbG9hZGVyLXJvdGF0aW9uIDFzIGxpbmVhciBpbmZpbml0ZTtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktaW5mbyB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCk7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWluZm8gc3BhbiB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS10ZXJtLWZvbnQtZmFtaWx5KTtcbiAgZm9udC1zaXplOiAyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgcGFkZGluZzogMC41ZW0gMC43NWVtO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgpO1xuICBjb250YWluZXItdHlwZTogaW5saW5lLXNpemU7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWhlbHAgPiBkaXYge1xuICBmb250LWZhbWlseTogdmFyKC0tdGVybS1mb250LWZhbWlseSk7XG4gIG1heC13aWR0aDogODUlO1xuICBtYXgtaGVpZ2h0OiA4NSU7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbi1ib3R0b206IDMycHg7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWhlbHAgPiBkaXYgZGl2IHtcbiAgcGFkZGluZzogY2FsYyhtaW4oNGNxdywgNDBweCkpO1xuICBmb250LXNpemU6IGNhbGMobWluKDEuOWNxdywgMThweCkpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpO1xuICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkgOTAlLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwID4gZGl2IGRpdiBwIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIG1hcmdpbjogMCAwIDJlbSAwO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwID4gZGl2IGRpdiB1bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWhlbHAgPiBkaXYgZGl2IHVsIGxpIHtcbiAgbWFyZ2luOiAwIDAgMC43NWVtIDA7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWhlbHAgPiBkaXYgZGl2IGtiZCB7XG4gIGNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICBwYWRkaW5nOiAwLjJlbSAwLjVlbTtcbiAgYm9yZGVyLXJhZGl1czogMC4yZW07XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICBmb250LXNpemU6IDAuODVlbTtcbiAgYm9yZGVyOiBub25lO1xuICBtYXJnaW46IDA7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWVycm9yIHNwYW4ge1xuICBmb250LXNpemU6IDhlbTtcbn1cbi5hcC1wbGF5ZXIgLnNsaWRlLWVudGVyLWFjdGl2ZSB7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycztcbn1cbi5hcC1wbGF5ZXIgLnNsaWRlLWVudGVyLWFjdGl2ZS5hcC13YXMtcGxheWluZyB7XG4gIHRyYW5zaXRpb246IHRvcCAwLjJzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnM7XG59XG4uYXAtcGxheWVyIC5zbGlkZS1leGl0LWFjdGl2ZSB7XG4gIHRyYW5zaXRpb246IHRvcCAwLjJzIGVhc2UtaW4sIG9wYWNpdHkgMC4ycztcbn1cbi5hcC1wbGF5ZXIgLnNsaWRlLWVudGVyIHtcbiAgdG9wOiAtNTAlO1xuICBvcGFjaXR5OiAwO1xufVxuLmFwLXBsYXllciAuc2xpZGUtZW50ZXItdG8ge1xuICB0b3A6IDAlO1xufVxuLmFwLXBsYXllciAuc2xpZGUtZW50ZXIsXG4uYXAtcGxheWVyIC5zbGlkZS1lbnRlci10byxcbi5hcC1wbGF5ZXIgLnNsaWRlLWV4aXQsXG4uYXAtcGxheWVyIC5zbGlkZS1leGl0LXRvIHtcbiAgYm90dG9tOiBhdXRvO1xuICBoZWlnaHQ6IDEwMCU7XG59XG4uYXAtcGxheWVyIC5zbGlkZS1leGl0IHtcbiAgdG9wOiAwJTtcbn1cbi5hcC1wbGF5ZXIgLnNsaWRlLWV4aXQtdG8ge1xuICB0b3A6IC01MCU7XG4gIG9wYWNpdHk6IDA7XG59XG5Aa2V5ZnJhbWVzIGFwLWxvYWRlci1yb3RhdGlvbiB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1hc2NpaW5lbWEge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogI2NjY2NjYztcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICMxMjEzMTQ7XG4gIC0tdGVybS1jb2xvci0wOiAjMDAwMDAwO1xuICAtLXRlcm0tY29sb3ItMTogI2RkM2M2OTtcbiAgLS10ZXJtLWNvbG9yLTI6ICM0ZWJmMjI7XG4gIC0tdGVybS1jb2xvci0zOiAjZGRhZjNjO1xuICAtLXRlcm0tY29sb3ItNDogIzI2YjBkNztcbiAgLS10ZXJtLWNvbG9yLTU6ICNiOTU0ZTE7XG4gIC0tdGVybS1jb2xvci02OiAjNTRlMWI5O1xuICAtLXRlcm0tY29sb3ItNzogI2Q5ZDlkOTtcbiAgLS10ZXJtLWNvbG9yLTg6ICM0ZDRkNGQ7XG4gIC0tdGVybS1jb2xvci05OiAjZGQzYzY5O1xuICAtLXRlcm0tY29sb3ItMTA6ICM0ZWJmMjI7XG4gIC0tdGVybS1jb2xvci0xMTogI2RkYWYzYztcbiAgLS10ZXJtLWNvbG9yLTEyOiAjMjZiMGQ3O1xuICAtLXRlcm0tY29sb3ItMTM6ICNiOTU0ZTE7XG4gIC0tdGVybS1jb2xvci0xNDogIzU0ZTFiOTtcbiAgLS10ZXJtLWNvbG9yLTE1OiAjZmZmZmZmO1xufVxuLypcbiAgQmFzZWQgb24gRHJhY3VsYTogaHR0cHM6Ly9kcmFjdWxhdGhlbWUuY29tXG4gKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLWRyYWN1bGEge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogI2Y4ZjhmMjtcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICMyODJhMzY7XG4gIC0tdGVybS1jb2xvci0wOiAjMjEyMjJjO1xuICAtLXRlcm0tY29sb3ItMTogI2ZmNTU1NTtcbiAgLS10ZXJtLWNvbG9yLTI6ICM1MGZhN2I7XG4gIC0tdGVybS1jb2xvci0zOiAjZjFmYThjO1xuICAtLXRlcm0tY29sb3ItNDogI2JkOTNmOTtcbiAgLS10ZXJtLWNvbG9yLTU6ICNmZjc5YzY7XG4gIC0tdGVybS1jb2xvci02OiAjOGJlOWZkO1xuICAtLXRlcm0tY29sb3ItNzogI2Y4ZjhmMjtcbiAgLS10ZXJtLWNvbG9yLTg6ICM2MjcyYTQ7XG4gIC0tdGVybS1jb2xvci05OiAjZmY2ZTZlO1xuICAtLXRlcm0tY29sb3ItMTA6ICM2OWZmOTQ7XG4gIC0tdGVybS1jb2xvci0xMTogI2ZmZmZhNTtcbiAgLS10ZXJtLWNvbG9yLTEyOiAjZDZhY2ZmO1xuICAtLXRlcm0tY29sb3ItMTM6ICNmZjkyZGY7XG4gIC0tdGVybS1jb2xvci0xNDogI2E0ZmZmZjtcbiAgLS10ZXJtLWNvbG9yLTE1OiAjZmZmZmZmO1xufVxuLyogQmFzZWQgb24gTW9ub2thaSBmcm9tIGJhc2UxNiBjb2xsZWN0aW9uIC0gaHR0cHM6Ly9naXRodWIuY29tL2Nocmlza2VtcHNvbi9iYXNlMTYgKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLW1vbm9rYWkge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogI2Y4ZjhmMjtcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICMyNzI4MjI7XG4gIC0tdGVybS1jb2xvci0wOiAjMjcyODIyO1xuICAtLXRlcm0tY29sb3ItMTogI2Y5MjY3MjtcbiAgLS10ZXJtLWNvbG9yLTI6ICNhNmUyMmU7XG4gIC0tdGVybS1jb2xvci0zOiAjZjRiZjc1O1xuICAtLXRlcm0tY29sb3ItNDogIzY2ZDllZjtcbiAgLS10ZXJtLWNvbG9yLTU6ICNhZTgxZmY7XG4gIC0tdGVybS1jb2xvci02OiAjYTFlZmU0O1xuICAtLXRlcm0tY29sb3ItNzogI2Y4ZjhmMjtcbiAgLS10ZXJtLWNvbG9yLTg6ICM3NTcxNWU7XG4gIC0tdGVybS1jb2xvci0xNTogI2Y5ZjhmNTtcbn1cbi8qXG4gIEJhc2VkIG9uIE5vcmQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcmN0aWNpY2VzdHVkaW8vbm9yZFxuICBWaWE6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZWlsb3Rvb2xlL2FzY2lpbmVtYS10aGVtZS1ub3JkXG4gKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLW5vcmQge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogI2VjZWZmNDtcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICMyZTM0NDA7XG4gIC0tdGVybS1jb2xvci0wOiAjM2I0MjUyO1xuICAtLXRlcm0tY29sb3ItMTogI2JmNjE2YTtcbiAgLS10ZXJtLWNvbG9yLTI6ICNhM2JlOGM7XG4gIC0tdGVybS1jb2xvci0zOiAjZWJjYjhiO1xuICAtLXRlcm0tY29sb3ItNDogIzgxYTFjMTtcbiAgLS10ZXJtLWNvbG9yLTU6ICNiNDhlYWQ7XG4gIC0tdGVybS1jb2xvci02OiAjODhjMGQwO1xuICAtLXRlcm0tY29sb3ItNzogI2VjZWZmNDtcbn1cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLXNldGkge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogI2NhY2VjZDtcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICMxMTEyMTM7XG4gIC0tdGVybS1jb2xvci0wOiAjMzIzMjMyO1xuICAtLXRlcm0tY29sb3ItMTogI2MyMjgzMjtcbiAgLS10ZXJtLWNvbG9yLTI6ICM4ZWM0M2Q7XG4gIC0tdGVybS1jb2xvci0zOiAjZTBjNjRmO1xuICAtLXRlcm0tY29sb3ItNDogIzQzYTVkNTtcbiAgLS10ZXJtLWNvbG9yLTU6ICM4YjU3YjU7XG4gIC0tdGVybS1jb2xvci02OiAjOGVjNDNkO1xuICAtLXRlcm0tY29sb3ItNzogI2VlZWVlZTtcbiAgLS10ZXJtLWNvbG9yLTE1OiAjZmZmZmZmO1xufVxuLypcbiAgQmFzZWQgb24gU29sYXJpemVkIERhcms6IGh0dHBzOi8vZXRoYW5zY2hvb25vdmVyLmNvbS9zb2xhcml6ZWQvXG4gKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLXNvbGFyaXplZC1kYXJrIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICM4Mzk0OTY7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMDAyYjM2O1xuICAtLXRlcm0tY29sb3ItMDogIzA3MzY0MjtcbiAgLS10ZXJtLWNvbG9yLTE6ICNkYzMyMmY7XG4gIC0tdGVybS1jb2xvci0yOiAjODU5OTAwO1xuICAtLXRlcm0tY29sb3ItMzogI2I1ODkwMDtcbiAgLS10ZXJtLWNvbG9yLTQ6ICMyNjhiZDI7XG4gIC0tdGVybS1jb2xvci01OiAjZDMzNjgyO1xuICAtLXRlcm0tY29sb3ItNjogIzJhYTE5ODtcbiAgLS10ZXJtLWNvbG9yLTc6ICNlZWU4ZDU7XG4gIC0tdGVybS1jb2xvci04OiAjMDAyYjM2O1xuICAtLXRlcm0tY29sb3ItOTogI2NiNGIxNjtcbiAgLS10ZXJtLWNvbG9yLTEwOiAjNTg2ZTc1O1xuICAtLXRlcm0tY29sb3ItMTE6ICM2NTdiODM7XG4gIC0tdGVybS1jb2xvci0xMjogIzgzOTQ5NjtcbiAgLS10ZXJtLWNvbG9yLTEzOiAjNmM3MWM0O1xuICAtLXRlcm0tY29sb3ItMTQ6ICM5M2ExYTE7XG4gIC0tdGVybS1jb2xvci0xNTogI2ZkZjZlMztcbn1cbi8qXG4gIEJhc2VkIG9uIFNvbGFyaXplZCBMaWdodDogaHR0cHM6Ly9ldGhhbnNjaG9vbm92ZXIuY29tL3NvbGFyaXplZC9cbiAqL1xuLmFzY2lpbmVtYS1wbGF5ZXItdGhlbWUtc29sYXJpemVkLWxpZ2h0IHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICM2NTdiODM7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjZmRmNmUzO1xuICAtLXRlcm0tY29sb3ItMDogIzA3MzY0MjtcbiAgLS10ZXJtLWNvbG9yLTE6ICNkYzMyMmY7XG4gIC0tdGVybS1jb2xvci0yOiAjODU5OTAwO1xuICAtLXRlcm0tY29sb3ItMzogI2I1ODkwMDtcbiAgLS10ZXJtLWNvbG9yLTQ6ICMyNjhiZDI7XG4gIC0tdGVybS1jb2xvci01OiAjZDMzNjgyO1xuICAtLXRlcm0tY29sb3ItNjogIzJhYTE5ODtcbiAgLS10ZXJtLWNvbG9yLTc6ICNlZWU4ZDU7XG4gIC0tdGVybS1jb2xvci04OiAjMDAyYjM2O1xuICAtLXRlcm0tY29sb3ItOTogI2NiNGIxNjtcbiAgLS10ZXJtLWNvbG9yLTEwOiAjNTg2ZTc1O1xuICAtLXRlcm0tY29sb3ItMTE6ICM2NTdjODM7XG4gIC0tdGVybS1jb2xvci0xMjogIzgzOTQ5NjtcbiAgLS10ZXJtLWNvbG9yLTEzOiAjNmM3MWM0O1xuICAtLXRlcm0tY29sb3ItMTQ6ICM5M2ExYTE7XG4gIC0tdGVybS1jb2xvci0xNTogI2ZkZjZlMztcbn1cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLXNvbGFyaXplZC1saWdodCAuYXAtb3ZlcmxheS1zdGFydCAuYXAtcGxheS1idXR0b24gc3ZnIC5hcC1wbGF5LWJ0bi1maWxsIHtcbiAgZmlsbDogdmFyKC0tdGVybS1jb2xvci0xKTtcbn1cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLXNvbGFyaXplZC1saWdodCAuYXAtb3ZlcmxheS1zdGFydCAuYXAtcGxheS1idXR0b24gc3ZnIC5hcC1wbGF5LWJ0bi1zdHJva2Uge1xuICBzdHJva2U6IHZhcigtLXRlcm0tY29sb3ItMSk7XG59XG4vKlxuICBCYXNlZCBvbiBUYW5nbzogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVGFuZ29fRGVza3RvcF9Qcm9qZWN0XG4gKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLXRhbmdvIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNjY2NjY2M7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMTIxMzE0O1xuICAtLXRlcm0tY29sb3ItMDogIzAwMDAwMDtcbiAgLS10ZXJtLWNvbG9yLTE6ICNjYzAwMDA7XG4gIC0tdGVybS1jb2xvci0yOiAjNGU5YTA2O1xuICAtLXRlcm0tY29sb3ItMzogI2M0YTAwMDtcbiAgLS10ZXJtLWNvbG9yLTQ6ICMzNDY1YTQ7XG4gIC0tdGVybS1jb2xvci01OiAjNzU1MDdiO1xuICAtLXRlcm0tY29sb3ItNjogIzA2OTg5YTtcbiAgLS10ZXJtLWNvbG9yLTc6ICNkM2Q3Y2Y7XG4gIC0tdGVybS1jb2xvci04OiAjNTU1NzUzO1xuICAtLXRlcm0tY29sb3ItOTogI2VmMjkyOTtcbiAgLS10ZXJtLWNvbG9yLTEwOiAjOGFlMjM0O1xuICAtLXRlcm0tY29sb3ItMTE6ICNmY2U5NGY7XG4gIC0tdGVybS1jb2xvci0xMjogIzcyOWZjZjtcbiAgLS10ZXJtLWNvbG9yLTEzOiAjYWQ3ZmE4O1xuICAtLXRlcm0tY29sb3ItMTQ6ICMzNGUyZTI7XG4gIC0tdGVybS1jb2xvci0xNTogI2VlZWVlYztcbn1cbi8qXG4gIEJhc2VkIG9uIGdydXZib3g6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb3JoZXR6L2dydXZib3hcbiAqL1xuLmFzY2lpbmVtYS1wbGF5ZXItdGhlbWUtZ3J1dmJveC1kYXJrIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNmYmYxYzc7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMjgyODI4O1xuICAtLXRlcm0tY29sb3ItMDogIzI4MjgyODtcbiAgLS10ZXJtLWNvbG9yLTE6ICNjYzI0MWQ7XG4gIC0tdGVybS1jb2xvci0yOiAjOTg5NzFhO1xuICAtLXRlcm0tY29sb3ItMzogI2Q3OTkyMTtcbiAgLS10ZXJtLWNvbG9yLTQ6ICM0NTg1ODg7XG4gIC0tdGVybS1jb2xvci01OiAjYjE2Mjg2O1xuICAtLXRlcm0tY29sb3ItNjogIzY4OWQ2YTtcbiAgLS10ZXJtLWNvbG9yLTc6ICNhODk5ODQ7XG4gIC0tdGVybS1jb2xvci04OiAjN2M2ZjY1O1xuICAtLXRlcm0tY29sb3ItOTogI2ZiNDkzNDtcbiAgLS10ZXJtLWNvbG9yLTEwOiAjYjhiYjI2O1xuICAtLXRlcm0tY29sb3ItMTE6ICNmYWJkMmY7XG4gIC0tdGVybS1jb2xvci0xMjogIzgzYTU5ODtcbiAgLS10ZXJtLWNvbG9yLTEzOiAjZDM4NjliO1xuICAtLXRlcm0tY29sb3ItMTQ6ICM4ZWMwN2M7XG4gIC0tdGVybS1jb2xvci0xNTogI2ZiZjFjNztcbn1cbiIsICJpbXBvcnQgKiBhcyBBc2NpaW5lbWFQbGF5ZXIgZnJvbSBcImFzY2lpbmVtYS1wbGF5ZXJcIlxuaW1wb3J0IGFzY2luZW1hQ3NzIGZyb20gXCJhc2NpaW5lbWEtcGxheWVyL2Rpc3QvYnVuZGxlL2FzY2lpbmVtYS1wbGF5ZXIuY3NzXCJcblxuY29uc3QgdGhlbWVDc3MgPSBgXG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1ydW5jb20tbGlnaHQge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogIzFGMjMyODtcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICNmZmZmZmY7XG4gIC0tdGVybS1jb2xvci0wOiAjMjQyOTJmO1xuICAtLXRlcm0tY29sb3ItMTogI2NmMjIyZTtcbiAgLS10ZXJtLWNvbG9yLTI6ICMxMTYzMjk7XG4gIC0tdGVybS1jb2xvci0zOiAjNGQyZDAwO1xuICAtLXRlcm0tY29sb3ItNDogIzA5NjlkYTtcbiAgLS10ZXJtLWNvbG9yLTU6ICM4MjUwZGY7XG4gIC0tdGVybS1jb2xvci02OiAjMWI3YzgzO1xuICAtLXRlcm0tY29sb3ItNzogIzZlNzc4MTtcbiAgLS10ZXJtLWNvbG9yLTg6ICM1NzYwNmE7XG4gIC0tdGVybS1jb2xvci05OiAjYTQwZTI2O1xuICAtLXRlcm0tY29sb3ItMTA6ICMxYTdmMzc7XG4gIC0tdGVybS1jb2xvci0xMTogIzYzM2MwMTtcbiAgLS10ZXJtLWNvbG9yLTEyOiAjMjE4YmZmO1xuICAtLXRlcm0tY29sb3ItMTM6ICM4MjUwZGY7XG4gIC0tdGVybS1jb2xvci0xNDogIzFiN2M4MztcbiAgLS10ZXJtLWNvbG9yLTE1OiAjNmU3NzgxO1xufVxuLmFzY2lpbmVtYS1wbGF5ZXItdGhlbWUtcnVuY29tLWRhcmsge1xuICAtLXRlcm0tY29sb3ItZm9yZWdyb3VuZDogI2U2ZWRmMztcbiAgLS10ZXJtLWNvbG9yLWJhY2tncm91bmQ6ICMwZDExMTc7XG4gIC0tdGVybS1jb2xvci0wOiAjNDg0ZjU4O1xuICAtLXRlcm0tY29sb3ItMTogI2ZmN2I3MjtcbiAgLS10ZXJtLWNvbG9yLTI6ICMzZmI5NTA7XG4gIC0tdGVybS1jb2xvci0zOiAjZDI5OTIyO1xuICAtLXRlcm0tY29sb3ItNDogIzU4YTZmZjtcbiAgLS10ZXJtLWNvbG9yLTU6ICNiYzhjZmY7XG4gIC0tdGVybS1jb2xvci02OiAjMzljNWNmO1xuICAtLXRlcm0tY29sb3ItNzogI2IxYmFjNDtcbiAgLS10ZXJtLWNvbG9yLTg6ICM2ZTc2ODE7XG4gIC0tdGVybS1jb2xvci05OiAjZmZhMTk4O1xuICAtLXRlcm0tY29sb3ItMTA6ICM1NmQzNjQ7XG4gIC0tdGVybS1jb2xvci0xMTogI2UzYjM0MTtcbiAgLS10ZXJtLWNvbG9yLTEyOiAjNzljMGZmO1xuICAtLXRlcm0tY29sb3ItMTM6ICNiYzhjZmY7XG4gIC0tdGVybS1jb2xvci0xNDogIzM5YzVjZjtcbiAgLS10ZXJtLWNvbG9yLTE1OiAjYjFiYWM0O1xufVxuYFxuXG5pZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1hc2NpaW5lbWEtY3NzXVwiKSkge1xuICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKVxuICBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFzY2lpbmVtYS1jc3NcIiwgXCJcIilcbiAgc3R5bGUudGV4dENvbnRlbnQgPSBhc2NpbmVtYUNzcyArIHRoZW1lQ3NzXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXG59XG5cbmZ1bmN0aW9uIGRldGVjdFRoZW1lKCkge1xuICBjb25zdCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gIHJldHVybiBodG1sLmdldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIikgPT09IFwiZGFya1wiID8gXCJydW5jb20tZGFya1wiIDogXCJydW5jb20tbGlnaHRcIlxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW91bnQoZWwpIHtcbiAgY29uc3QgZGF0YSA9IGVsLmRhdGFzZXQuY2FzdFxuICBpZiAoIWRhdGEpIHJldHVyblxuXG4gIGxldCBwbGF5ZXIgPSBBc2NpaW5lbWFQbGF5ZXIuY3JlYXRlKFxuICAgIHsgZGF0YSB9LFxuICAgIGVsLFxuICAgIHtcbiAgICAgIGZpdDogXCJ3aWR0aFwiLFxuICAgICAgdGVybWluYWxGb250RmFtaWx5OiBcIidNZW5sbycsICdNb25hY28nLCAnQ29uc29sYXMnLCBtb25vc3BhY2VcIixcbiAgICAgIHRoZW1lOiBkZXRlY3RUaGVtZSgpLFxuICAgICAgc3BlZWQ6IDQsXG4gICAgICBpZGxlVGltZUxpbWl0OiAwLjUsXG4gICAgfVxuICApXG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgY29uc3QgbmV3VGhlbWUgPSBkZXRlY3RUaGVtZSgpXG4gICAgaWYgKHBsYXllciAmJiBwbGF5ZXIuZGlzcG9zZSkgcGxheWVyLmRpc3Bvc2UoKVxuICAgIGVsLmlubmVySFRNTCA9IFwiXCJcbiAgICBwbGF5ZXIgPSBBc2NpaW5lbWFQbGF5ZXIuY3JlYXRlKFxuICAgICAgeyBkYXRhIH0sXG4gICAgICBlbCxcbiAgICAgIHtcbiAgICAgICAgZml0OiBcIndpZHRoXCIsXG4gICAgICAgIHRlcm1pbmFsRm9udEZhbWlseTogXCInTWVubG8nLCAnTW9uYWNvJywgJ0NvbnNvbGFzJywgbW9ub3NwYWNlXCIsXG4gICAgICAgIHRoZW1lOiBuZXdUaGVtZSxcbiAgICAgICAgc3BlZWQ6IDQsXG4gICAgICAgIGlkbGVUaW1lTGltaXQ6IDAuNSxcbiAgICAgIH1cbiAgICApXG4gIH0pXG5cbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiZGF0YS10aGVtZVwiXSxcbiAgfSlcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmRpc3Bvc2UpIHBsYXllci5kaXNwb3NlKClcbiAgfVxufVxuXG53aW5kb3cuX19ydW5jb21fcGxheWVyID0geyBtb3VudCB9XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUFBLFdBQVMsU0FBUyxNQUFNO0FBQ3RCLFFBQUksT0FBTyxTQUFTLFVBQVU7QUFDNUIsYUFBTztBQUFBLElBQ1QsV0FBVyxPQUFPLFNBQVMsVUFBVTtBQUNuQyxhQUFPLEtBQUssTUFBTSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksVUFBVSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxNQUFNLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQUEsSUFDbEcsT0FBTztBQUNMLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNBLFdBQVMsU0FBUyxHQUFHLE9BQU87QUFDMUIsUUFBSTtBQUNKLFdBQU8sV0FBWTtBQUNqQixlQUFTLE9BQU8sVUFBVSxRQUFRLE9BQU8sSUFBSSxNQUFNLElBQUksR0FBRyxPQUFPLEdBQUcsT0FBTyxNQUFNLFFBQVE7QUFDdkYsYUFBSyxJQUFJLElBQUksVUFBVSxJQUFJO0FBQUEsTUFDN0I7QUFDQSxtQkFBYSxPQUFPO0FBQ3BCLGdCQUFVLFdBQVcsTUFBTSxFQUFFLE1BQU0sTUFBTSxJQUFJLEdBQUcsS0FBSztBQUFBLElBQ3ZEO0FBQUEsRUFDRjtBQUNBLFdBQVMsU0FBUyxHQUFHLFVBQVU7QUFDN0IsUUFBSSxhQUFhO0FBQ2pCLFdBQU8sV0FBWTtBQUNqQixVQUFJLENBQUMsV0FBWTtBQUNqQixtQkFBYTtBQUNiLGVBQVMsUUFBUSxVQUFVLFFBQVEsT0FBTyxJQUFJLE1BQU0sS0FBSyxHQUFHLFFBQVEsR0FBRyxRQUFRLE9BQU8sU0FBUztBQUM3RixhQUFLLEtBQUssSUFBSSxVQUFVLEtBQUs7QUFBQSxNQUMvQjtBQUNBLFFBQUUsTUFBTSxNQUFNLElBQUk7QUFDbEIsaUJBQVcs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WTtBQUFBLE1BQ1osaUJBQWlCLENBQUMsWUFBWTtBQUFBLElBQ2hDLENBQUM7QUFFRCxXQUFPLE1BQU07QUFDWCxlQUFTLFdBQVc7QUFDcEIsVUFBSSxVQUFVLE9BQU8sUUFBUyxRQUFPLFFBQVE7QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFFQSxTQUFPLGtCQUFrQixFQUFFLE9BQUFELE9BQU07IiwKICAibmFtZXMiOiBbImNsYXNzTmFtZSIsICJwdHIiLCAiYnVmZmVyIiwgInJlY29yZGluZyIsICJpbml0IiwgInNyYyIsICJsb2dnZXIiLCAiYXVkaW9VcmwiLCAidXJsIiwgImV4ZWN1dGVFdmVudCIsICJjb2xzIiwgInJvd3MiLCAiY2xhbXAiLCAicGFyc2VGcmFtZSIsICJwYXJzZSIsICJjbG9jayIsICJhcnJheSIsICJ2YWx1ZSIsICJjaGlsZHJlbiIsICJpbml0IiwgImRpc3Bvc2UiLCAiY3JlYXRlIiwgImRvY3VtZW50IiwgInVud3JhcCIsICJleGl0VHJhbnNpdGlvbiIsICJlbnRlclRyYW5zaXRpb24iLCAidGhlbWUiLCAicmVuZGVyIiwgImN1cnNvck9uIiwgImVsIiwgInN0eWxlIiwgImUiLCAiY3JlYXRlIiwgImRpc3Bvc2UiLCAic3R5bGUiLCAibW91bnQiLCAiY3JlYXRlIl0KfQo=

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
var vtWasmModule = base64Decode("AGFzbQEAAAABnAEXYAJ/fwBgA39/fwBgAn9/AX9gA39/fwF/YAF/AGABfwF/YAR/f39/AGAFf39/f38AYAR/f39/AX9gBn9/f39/fwBgBX9/f39/AX9gAAF/YAZ/f39/f38Bf2ABfAF/YAF+AX9gB39/f39/f38AYAN/f34Bf2AEf39/fgBgA39+fwBgBX9/fH9/AGAFf39+f38AYAV/f31/fwBgAAACoAMLA3diZxpfX3diZ19uZXdfMTMzMTdlZDE2MTg5MTU4ZQALA3diZxpfX3diZ19zZXRfOGI2YTlhNjFlOThhODg4MQABA3diZy5fX3diZ19fX3diaW5kZ2VuX2RlYnVnX3N0cmluZ19hZGZiNjYyYWUzNDcyNGI2AAADd2JnGl9fd2JpbmRnZW5fb2JqZWN0X2Ryb3BfcmVmAAQDd2JnG19fd2JpbmRnZW5fb2JqZWN0X2Nsb25lX3JlZgAFA3diZxpfX3diZ19zZXRfM2YxZDBiOTg0ZWQyNzJlZAABA3diZxpfX3diZ19uZXdfNGNlYjZhNzY2YmY3OGIwNAALA3diZydfX3diZ19fX3diaW5kZ2VuX3Rocm93X2RkMjQ0MTdlZDM2ZmM0NmUAAAN3YmcgX193YmluZGdlbl9jYXN0XzIyNDFiNmFmNGM0YjI5NDEAAgN3YmcgX193YmluZGdlbl9jYXN0X2Q2Y2QxOWI4MTU2MGZkNmUADQN3YmcgX193YmluZGdlbl9jYXN0XzQ2MjVjNTc3YWIyZWM5ZWUADgO7AbkBAwADAQMABAEKAgEDAwMBCA8KBwMJBwAJAQABCQcBAQYBBAEGBQIGAAMCAgcDAQABCQYGAAEEAQAAEAIGBAAFAQEBAAUMBQIABgAAAAEEBQUBBAEAAAcAAwERBAAHAgABAAkHBAQAAQAAAAAGAggCEgECBAgHAQcIAAAAAAABBAAEAQAAAAgBCAwHEwoUFQUGAgQDBAYEBAAAAgIBAQQEBAECAgAAAAIAAQEBBAUWAAIABAAABAIFAgUEBQFwASsrBQMBABEGCQF/AUGAgMAACwfFAQwGbWVtb3J5AgANX193YmdfdnRfZnJlZQA+BmNyZWF0ZQAaB3Z0X2ZlZWQACwl2dF9yZXNpemUAMwp2dF9nZXRTaXplAGYKdnRfZ2V0TGluZQANDHZ0X2dldEN1cnNvcgAvEV9fd2JpbmRnZW5fZXhwb3J0AHcSX193YmluZGdlbl9leHBvcnQyAIIBH19fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIAtwESX193YmluZGdlbl9leHBvcnQzAKcBCU0BAEEBCyqtAcEBwwFGwAE9wgEJCgilAawBsQEUlgGTATuUAZYBnQGaAZQBlAGYAZUBlwG+AbsBvAEwvQGvAaQBqwG/AXOPAUVdGGi6AQwBIAqD1wK5Ab81ARB/IwBBoAFrIgQkACAEQTBqIAAQXiAEKAIwIQMgBEEoaiIAIAI2AgQgACABNgIAIANB3ABqIQsgA0HQAGohDCADQTBqIQ8gA0EkaiEQIANBDGohESADQbIBaiEHIANBxAFqIQkgBCgCKCINIAQoAiwiDmohEiANIQIDQAJAAkACQAJAAkACQCADAn8CQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAIgEkYNAAJ/IAIsAAAiAEEATgRAIABB/wFxIQAgAkEBagwBCyACLQABQT9xIQUgAEEfcSEBIABBX00EQCABQQZ0IAVyIQAgAkECagwBCyACLQACQT9xIAVBBnRyIQUgAEFwSQRAIAUgAUEMdHIhACACQQNqDAELIAFBEnRBgIDwAHEgAi0AA0E/cSAFQQZ0cnIiAEGAgMQARg0BIAJBBGoLIQJBwQAgACAAQZ8BSxshAQJAAkACQCADLQDMBSIGDgUABAQEAQQLIAFBIGtB4ABJDQEMAwsgAUEwa0EMTw0CDCALIAQgADYCQCAEQSE6ADwMAgsgBEHwAGoiASADQeAAaigCACADQeQAaigCABAjIARBCGogAxAkIAQgBCkDCDcCfCAEIAQoAnQgBCgCeBBbIAQoAgQhACAEKAIAQQFxRQRAIAEQbiAOBEAgDUEBIA4QOAsgBCgCNCAEKAI4ELIBIARBoAFqJAAgAA8LIAQgADYCTCAEQcwAakHcwsAAEEIACwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQf8BcSIFQRtHBEAgBUHbAEYNASAGDg0DBAUGBw4IDg4OAg4JDgsgA0EBOgDMBSAJECwMVAsgBg4NASMDBAUNBg0NDQANBw0LIAFBIGtB3wBJDVIMCwsCQCABQRhJDQAgAUEZRg0AIAFB/AFxQRxHDQsLIARBPGogABBIDDILIAFB8AFxQSBGDQYgAUEwa0EgSQ0IIAFB0QBrQQdJDQgCQCAFQdkAaw4FCQkACR8ACyABQeAAa0EfTw0JDAgLIAFBMGtBzwBPDQggA0EAOgDMBSAEQTxqIAkgABAtDDALIAFBL0sEQCABQTtHIAFBOk9xRQRAIANBBDoAzAUMTwsgAUFAakE/SQ0ECyABQfwBcUE8Rw0HIAMgADYCxAEgA0EEOgDMBQxOCyABQUBqQT9JDQQgAUH8AXFBPEcNBgxLCyABQUBqQT9PDQUMSQsgAUEga0HgAEkNSwJAIAVBGGsOAwcGBwALIAVBmQFrQQJJDQYgBUHQAEYNSyAFQQdGDUgMBQsgA0EAOgDMBSAEQTxqIAkgABAODCsLIAMgADYCxAEgA0ECOgDMBQxJCyADQQA6AMwFIARBPGogCSAAEA4MKQsgA0EAOgDMBSAEQTxqIAkgABAtDCgLAkAgBUEYaw4DAgECAAsgBUGZAWtBAkkNASAFQdAARw0AIAZBAWsOChUDCAkKJAsMDQ5GCyABQfABcSIIQYABRg0AIAFBkQFrQQZLDQELIANBADoAzAUgBEE8aiAAEEgMJQsgCEEgRw0BIAZBBEcNAQw/CyABQfABcSEIDAELIAZBAWsOCgEAAwQFDgYHCAkOCyAIQSBHDQEMOwsgAUEYTw0KDAsLAkAgAUEYSQ0AIAFBGUYNACABQfwBcUEcRw0MCyAEQTxqIAAQSAwfCwJAAkAgAUEYSQ0AIAFBGUYNACABQfwBcUEcRw0BCyAEQTxqIAAQSAwfCyABQfABcUEgRg05DAoLAkAgAUEYSQ0AIAFBGUYNACABQfwBcUEcRw0KCyAEQTxqIAAQSAwdCyABQUBqQT9PBEAgAUHwAXEiCEEgRg03IAhBMEYNOgwJCyADQQA6AMwFIARBPGogCSAAEA4MHAsgAUH8AXFBPEYNAyABQfABcUEgRg0vIAFBQGpBP08NBwwECyABQS9NDQYgAUE6SQ04IAFBO0YNOCABQUBqQT5NDQMMBgsgAUFAakE/SQ0CDAULIAFBGEkNNyABQRlGDTcgAUH8AXFBHEYNNwwECyADIAA2AsQBIANBCDoAzAUMNgsgA0EKOgDMBQw1CyAFQdgAayIIQQdNQQBBASAIdEHBAXEbDQUgBUEZRg0AIAFB/AFxQRxHDQELIARBPGogABBIDBQLIAVBkAFrDhABBQUFBQUFBQMFBQIvAAMDBAsgA0EMOgDMBQwxCyADQQc6AMwFIAkQLAwwCyADQQM6AMwFIAkQLAwvCyADQQ06AMwFDC4LAkAgBUE6aw4CBAIACyAFQRlGDQILIAZBA2sOBwksAwoFCwcsCyAGQQNrDgcIKysJBQoHKwsgBkEDaw4HByoCCCoJBioLIAZBA2sOBwYpKQcJCAUpCyABQRhJDQAgAUH8AXFBHEcNKAsgBEE8aiAAEEgMCAsgAUEwa0EKTw0mCyADQQg6AMwFDCQLIAFB8AFxQSBGDR8LIAFB8AFxQTBHDSMMAwsgAUE6Rw0iDCALAkAgAUEYSQ0AIAFBGUYNACABQfwBcUEcRw0iCyAEQTxqIAAQSAwCCyABQfABcUEgRg0VIAFBOkYNACABQfwBcUE8Rw0gCyADQQs6AMwFDB8LIAQtADwiAEEyRg0fAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAAQQFrDjECAwQFBgcICQoLDA0ODyUQJhESExQVFhcYGRobHB0eHwAhIiMkJSYnKCkqKywtMDEyAQsgBCgCQCEADB8LIANBfkF/IAMoAmggAygCnAFGGxCFAQw9CyAELwE+IQAgBCADKAJoNgJMIARBADoAfCAEIANB1ABqKAIAIgE2AnAgBCABIAMoAlhBAnRqNgJ0QQEgACAAQQFNGyEAIAQgBEHMAGo2AngDQCAAQQFrIgAEQCAEQfAAahBQDQEMNgsLIARB8ABqEFAiAEUNNCAAKAIADDULIANBASAELwE+IgAgAEEBTRtBAWsiACADKAKcASIBQQFrIAAgAUkbNgJoDDsLIANBASAELwE+IgAgAEEBTRsQMgw6CyADQQEgBC8BPiIAIABBAU0bEF8gA0EANgJoDDkLIANBASAELwE+IgAgAEEBTRsQYSADQQA2AmgMOAsgA0EANgJoDDcLAkAgBC0APUEBaw4CJgATCyADQQA2AlgMNgsgA0EBIAQvAT4iACAAQQFNGyIAQX9zQQAgAGsgAygCaCADKAKcAUYbEIUBDDULIANBASAELwE+IgAgAEEBTRsQXww0CyADQQEgBC8BPiIAIABBAU0bEIUBDDMLIANBASAELwFAIgAgAEEBTRtBAWsiACADKAKcASIBQQFrIAAgAUkbNgJoIANBASAELwE+IgAgAEEBTRtBAWsQUgwyCyADQQEgBC8BPiIAIABBAU0bEGEMMQsgAygCaCIAIAMoApwBIgFPBEAgAyABQQFrIgA2AmgLQQEgBC8BPiIBIAFBAU0bIgEgAygCGCAAayIFIAEgBUkbIQEgAyADKAJsQbDNwAAQYiIFKAIEIAUoAgggAEGo2cAAEJABKAIERQRAIAUoAgQgBSgCCCAAQQFrQbjZwAAQkAEiBkKggICAEDcCACAGIAcpAQA3AQggBkEQaiAHQQhqLwEAOwEACyAEQRhqIAUoAgQgBSgCCCAAQcjZwAAQfyAEKAIYIAQoAhwgARCIASAFKAIEIAUoAgggAEHY2cAAEJABIgAoAgRFBEAgAEKggICAEDcCACAAIAcpAQA3AQggAEEQaiAHQQhqLwEAOwEACyAEQRBqIAUoAgQgBSgCCCIAIAAgAWtB6NnAABB/IAQoAhAhACAEKAIUIARB+ABqIAdBCGovAQA7AQAgBCAHKQEANwNwQRRsIQEDQCABBEAgAEKggICAEDcCACAAIAQpA3A3AgggAEEQaiAEQfgAai8BADsBACABQRRrIQEgAEEUaiEADAELCyAFQQA6AAwgA0HgAGooAgAgA0HkAGooAgAgAygCbBCRAQwwCyADKAKcASEFIAMoAqABIQZBACEBA0AgASAGRg0wQQAhAANAIAAgBUYEQCADQeAAaigCACADQeQAaigCACABEJEBIAFBAWohAQwCBSAEQQA7AHggBEECOgB0IARBAjoAcCADIAAgAUHFACAEQfAAahATGiAAQQFqIQAMAQsACwALAAsgBCgCSCEBIAQoAkQhACAEIAQoAkA2AnggBCAANgJwIAQgAUEBdCIBIABqIgU2AnwDQCABBEACQAJAAkACQAJAAkACQAJAAkACQCAALwEAIgZBAWsOBwExMTExAgMACyAGQZcIaw4DBAUGAwsgA0EAOgDBAQwHCyADQgA3AmggA0EAOgC+AQwGCyADQQA6AL8BDAULIANBADoAcAwECyADEG8MAgsgAxCJAQwCCyADEG8gAxCJAQsgAxARCyAAQQJqIQAgAUECayEBDAELCyAEIAU2AnQgBEHwAGoQqgEMLgsgBCgCSCEBIAQoAkQhACAEIAQoAkA2AnggBCAANgJwIAQgAUEBdCIBIABqIgY2AnwDQCABBEACQAJAAkACQAJAAkACQAJAAkAgAC8BACIFQQFrDgcBLy8vLwIDAAsgBUGXCGsOAwYEBQMLIANBAToAwQEMBgsgA0EBOgC+ASADQQA2AmggAyADKAKoATYCbAwFCyADQQE6AL8BDAQLIANBAToAcAwDCyADEGUMAgsgAxBlCyMAQTBrIgUkACADLQC8AUUEQCADQQE6ALwBIANB9ABqIANBiAFqEHQgAyADQSRqEHUgBUEMaiIIIAMoApwBIAMoAqABIgpBAUEAIANBsgFqEB8gA0EMahCgASADIAhBJBAWIggoAmAgCCgCZEEAIAoQUwsgBUEwaiQAIAMQEQsgAEECaiEAIAFBAmshAQwBCwsgBCAGNgJ0IARB8ABqEKoBDC0LAkBBASAELwE+IgAgAEEBTRtBAWsiACAELwFAIgEgAygCoAEiBSABG0EBayIBSSABIAVJcUUEQCADKAKoASEADAELIAMgATYCrAEgAyAANgKoAQsgA0EANgJoIAMgAEEAIAMtAL4BGzYCbAwsCyADQQE6AHAgA0EAOwC9ASADQQA7AboBIANBAjoAtgEgA0ECOgCyASADQQA7AbABIANCADcCpAEgA0GAgIAINgKEASADQQI6AIABIANBAjoAfCADQgA3AnQgAyADKAKgAUEBazYCrAEMKwsgAygCoAEgAygCrAEiAEEBaiAAIAMoAmwiAEkbIQEgAyAAIAFBASAELwE+IgUgBUEBTRsgBxAdIANB4ABqKAIAIANB5ABqKAIAIAAgARBTDCoLIAMgAygCaCADKAJsIgBBAEEBIAQvAT4iASABQQFNGyAHECIgA0HgAGooAgAgA0HkAGooAgAgABCRAQwpCwJAAkACQCAELQA9QQFrDgMBAisACyADIAMoAmggAygCbCIAQQEgBCAHECIgA0HgAGooAgAgA0HkAGooAgAgACADKAKgARBTDCoLIAMgAygCaCADKAJsIgBBAiAEIAcQIiADQeAAaigCACADQeQAaigCAEEAIABBAWoQUwwpCyADQQAgAygCHCAHECogA0HgAGooAgAgA0HkAGooAgBBACADKAKgARBTDCgLIAMgAygCaCADKAJsIgAgBC0APUEEciAEIAcQIiADQeAAaigCACADQeQAaigCACAAEJEBDCcLIAMgBC0APToAsQEMJgsgAyAELQA9OgCwAQwlCyADQQEQMgwkCyMAQRBrIgUkAAJAAkACQCADKAJoIghFDQAgCCADKAKcAU8NACAFQQhqIAMoAlQiACADKAJYIgEgCBA8IAUoAghBAUcNACAFKAIMIgYgAUsNASADQdAAaiIKKAIAIAFGBH8gCkG84sAAEGsgAygCVAUgAAsgBkECdGohACABIAZLBEAgAEEEaiAAIAEgBmtBAnQQEgsgACAINgIAIAMgAUEBajYCWAsgBUEQaiQADAELIAYgAUG84sAAEEwACwwjCyADKAJoIgAgAygCnAEiBUYEQCADIABBAWsiADYCaAsgAyAAIAMoAmwiAUEBIAQvAT4iBiAGQQFNGyIGIAUgAGsiBSAFIAZLGyIFIAcQICAAIAAgBWoiBSAAIAVLGyEFA0AgACAFRwRAIAMgACABQSAgBxATGiAAQQFqIQAMAQsLIANB4ABqKAIAIANB5ABqKAIAIAEQkQEMIgsgAygCoAEgAygCrAEiAEEBaiAAIAMoAmwiAEkbIQEgAyAAIAFBASAELwE+IgUgBUEBTRsgBxA2IANB4ABqKAIAIANB5ABqKAIAIAAgARBTDCELIAMQXCADLQDAAUEBRw0gIANBADYCaAwgCyADEFwgA0EANgJoDB8LIAMgABAhDB4LIAMoAmgiBUUNHSAELwE+IQAgAygCbCEBIARBIGogAxBwIAQoAiQiBiABTQ0SQQEgACAAQQFNGyEAIAQoAiAgAUEEdGoiAUEEaigCACABQQhqKAIAIAVBAWtBuOXAABCQASgCACEBA0AgAEUNHiADIAEQISAAQQFrIQAMAAsACyADKAJsIgAgAygCqAFGDRIgAEUNHCADIABBAWsQUgwcCyAEQcwAaiIAIAMoApwBIgUgAygCoAEiASADKAJIIAMoAkxBABAfIARB8ABqIgYgBSABQQFBAEEAEB8gERCgASADIABBJBAWIQAgDxCgASAQIAZBJBAWGiAAQQA6ALwBIARBlAFqIgYgBRA5IAAoAlAgAEHUAGooAgBBBEEEEJ8BIAxBCGogBkEIaiIFKAIANgIAIAwgBCkClAE3AgAgAEEAOwG6ASAAQQI6ALYBIABBAjoAsgEgAEEBOgBwIABCADcCaCAAQQA7AbABIABBgIAENgC9ASAAIAFBAWs2AqwBIABCADcCpAEgAEGAgIAINgKYASAAQQI6AJQBIABBAjoAkAEgAEEANgKMASAAQoCAgAg3AoQBIABBAjoAgAEgAEECOgB8IABCADcCdCAGIAEQVSAAKAJcIABB4ABqKAIAQQFBARCfASALQQhqIAUoAgA2AgAgCyAEKQKUATcCAAwbCyAEKAJIIQEgBCgCRCEAIAQgBCgCQDYCeCAEIAA2AnAgBCABQQF0IgEgAGoiBTYCfANAIAEEQAJAIAAvAQBBFEcEQCADQQA6AL0BDAELIANBADoAwAELIABBAmohACABQQJrIQEMAQsLIAQgBTYCdCAEQfAAahCqAQwaCyADEIkBDBkLIAMQZQwYCyADQQEgBC8BPiIAIABBAU0bEIYBDBcLIAQoAkhBBWwhASADLQC7ASEFIAQoAkAgBCgCRCIKIQADQAJAIAFFDQAgACgAASEGAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAC0AAEEBaw4SAQIDBAUGBwgJCgsMDQ4PEBETAAtBACEFIANBADsBugEgA0ECOgC2ASADQQI6ALIBDBELIANBAToAugEMEAsgA0ECOgC6AQwPCyADIAVBAXIiBToAuwEMDgsgAyAFQQJyIgU6ALsBDA0LIAMgBUEIciIFOgC7AQwMCyADIAVBEHIiBToAuwEMCwsgAyAFQQRyIgU6ALsBDAoLIANBADoAugEMCQsgAyAFQf4BcSIFOgC7AQwICyADIAVB/QFxIgU6ALsBDAcLIAMgBUH3AXEiBToAuwEMBgsgAyAFQe8BcSIFOgC7AQwFCyADIAVB+wFxIgU6ALsBDAQLIAcgBjYBAAwDCyAHQQI6AAAMAgsgAyAGNgG2AQwBCyADQQI6ALYBCyAAQQVqIQAgAUEFayEBDAELCyAKQQFBBRCfAQwWCyADQQA2AqQBDBULIAQoAkghASAEKAJEIQAgBCAEKAJANgJ4IAQgADYCcCAEIAFBAXQiASAAaiIFNgJ8A0AgAQRAAkAgAC8BAEEURwRAIANBAToAvQEMAQsgA0EBOgDAAQsgAEECaiEAIAFBAmshAQwBCwsgBCAFNgJ0IARB8ABqEKoBDBQLIANBATYCpAEMEwsgA0EBIAQvAT4iACAAQQFNGxCHAQwSCyAELQA9DQELIwBBEGsiACQAIABBCGogAygCVCIGIAMoAlgiASADKAJoEDwCQAJAIAAoAghFBEAgACgCDCIFIAFPDQEgBiAFQQJ0aiIGIAZBBGogASAFQX9zakECdBASIAMgAUEBazYCWAsgAEEQaiQADAELIwBBMGsiACQAIAAgATYCBCAAIAU2AgAgAEEDNgIMIABByMXAADYCCCAAQgI3AhQgACAAQQRqrUKAgICA4AGENwMoIAAgAK1CgICAgOABhDcDICAAIABBIGo2AhAgAEEIakHM4sAAEIoBAAsMEAsgA0EANgJYDA8LIANBASAELwE+IgAgAEEBTRtBAWsQUgwOCyADQQEgBC8BPiIAIABBAU0bEF8MDQsgAy0AwgFBAUcNDCADIAQvAT4iACADKAKcASAAGyAELwFAIgAgAygCoAEgABsQJQwMCyADIAA2AsQBIANBCToAzAUMCgsgASAGQbjlwAAQSwALIANBARCGAQwJCwALQQALIgAgAygCnAEiAUEBayAAIAFJGzYCaAwGCyAJIAA2AgAMBAsgAyAANgLEASADQQU6AMwFDAMLIANBADoAzAUMAgsgA0EGOgDMBQwBCyAJKAKEBCEBAkACQAJAAkACQCAAQTprDgIBAAILIAlBHyABQQFqIgAgAEEgRhs2AoQEDAMLIAFBIEkNASABQSBB5NvAABBLAAsgAUEgTwRAIAFBIEH028AAEEsACyAJIAFBBHRqQQRqIgUoAgAiAUEGSQRAIAUgAUEBdGpBBGoiASABLwEAQQpsIABBMGtB/wFxajsBAAwCCyABQQZBtOHAABBLAAsgCSABQQR0akEEaiIBKAIAQQFqIQAgAUEFIAAgAEEFTxs2AgALCyAEQTI6ADwMAAsAC98UAQZ/IwBBwAJrIgIkACABKAIEIQMDQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAMEQCACQbgCaiABKAIAEGkgAigCuAIhAyACKAK8AkEBaw4GAQUEBQIDBQsgAEESOgAADAsLAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAMvAQAiAw4eAAECAwQFDgYOBw4ODg4ODg4ODg4OCAgJCgsODA4NDgsgAkGoAWpBASABKAIAIAEoAgRB1NzAABCBASABIAIpA6gBNwIAIABBADoAAAwYCyACQbABakEBIAEoAgAgASgCBEHk3MAAEIEBIAEgAikDsAE3AgAgAEEBOgAADBcLIAJBuAFqQQEgASgCACABKAIEQfTcwAAQgQEgASACKQO4ATcCACAAQQI6AAAMFgsgAkHAAWpBASABKAIAIAEoAgRBhN3AABCBASABIAIpA8ABNwIAIABBAzoAAAwVCyACQcgBakEBIAEoAgAgASgCBEGU3cAAEIEBIAEgAikDyAE3AgAgAEEEOgAADBQLIAJB0AFqQQEgASgCACABKAIEQaTdwAAQgQEgASACKQPQATcCACAAQQU6AAAMEwsgAkHYAWpBASABKAIAIAEoAgRBtN3AABCBASABIAIpA9gBNwIAIABBBjoAAAwSCyACQeABakEBIAEoAgAgASgCBEHE3cAAEIEBIAEgAikD4AE3AgAgAEEHOgAADBELIAJB6AFqQQEgASgCACABKAIEQdTdwAAQgQEgASACKQPoATcCACAAQQg6AAAMEAsgAkHwAWpBASABKAIAIAEoAgRB5N3AABCBASABIAIpA/ABNwIAIABBCToAAAwPCyACQfgBakEBIAEoAgAgASgCBEH03cAAEIEBIAEgAikD+AE3AgAgAEEKOgAADA4LIAJBgAJqQQEgASgCACABKAIEQYTewAAQgQEgASACKQOAAjcCACAAQQs6AAAMDQsgAkGIAmpBASABKAIAIAEoAgRBlN7AABCBASABIAIpA4gCNwIAIABBDDoAAAwMCyACQZACakEBIAEoAgAgASgCBEGk3sAAEIEBIAEgAikDkAI3AgAgAEENOgAADAsLAkACQCADQR5rQf//A3FBCE8EQCADQSZrDgIBCAILIAJBCGpBASABKAIAIAEoAgRBxODAABCBASABIAIpAwg3AgAgACADQR5rOgACIABBDjsAAAwMCwJAIAEoAgQiA0ECTwRAIAJBmAFqIAEoAgBBEGoQaSACKAKYASIDDQEgASgCBCEDCyACQegAakEBIAEoAgAgA0G03sAAEIEBIAIoAmwhAyACKAJoIQQMDQsCQAJAAkAgAigCnAFBAUcNACADLwEAQQJrDgQBAAACAAsgAkHwAGpBASABKAIAIAEoAgRBhN/AABCBASACKAJ0IQMgAigCcCEEDA4LIAEoAgAhAyABKAIEIgRBBU8EQCADLQAkIQUgAy8BNCEGIAMvAUQhByACQYABakEFIAMgBEHE3sAAEIEBIAEgAikDgAE3AgAgAEEOOgAAIAAgBSAGQQh0QYD+A3EgB0EQdHJyQQh0QQFyNgABDA0LIAJB+ABqQQIgAyAEQdTewAAQgQEgAigCfCEDIAIoAnghBAwNCyABKAIAIQMgASgCBCIEQQNPBEAgAy0AJCEFIAJBkAFqQQMgAyAEQeTewAAQgQEgASACKQOQATcCACAAIAU6AAIgAEEOOwAADAwLIAJBiAFqQQIgAyAEQfTewAAQgQEgAigCjAEhAyACKAKIASEEDAwLAkACQCADQfj/A3FBKEcEQCADQTBrDgIBCQILIAJBEGpBASABKAIAIAEoAgRBtODAABCBASABIAIpAxA3AgAgACADQShrOgACIABBEDsAAAwMCwJAIAEoAgQiA0ECTwRAIAJB2ABqIAEoAgBBEGoQaSACKAJYIgMNASABKAIEIQMLIAJBKGpBASABKAIAIANBpN/AABCBASACKAIsIQMgAigCKCEEDA0LAkACQAJAIAIoAlxBAUcNACADLwEAQQJrDgQBAAACAAsgAkEwakEBIAEoAgAgASgCBEH038AAEIEBIAIoAjQhAyACKAIwIQQMDgsgASgCACEDIAEoAgQiBEEFTwRAIAMtACQhBSADLwE0IQYgAy8BRCEHIAJBQGtBBSADIARBtN/AABCBASABIAIpA0A3AgAgAEEQOgAAIAAgBSAGQQh0QYD+A3EgB0EQdHJyQQh0QQFyNgABDA0LIAJBOGpBAiADIARBxN/AABCBASACKAI8IQMgAigCOCEEDA0LIAEoAgAhAyABKAIEIgRBA08EQCADLQAkIQUgAkHQAGpBAyADIARB1N/AABCBASABIAIpA1A3AgAgACAFOgACIABBEDsAAAwMCyACQcgAakECIAMgBEHk38AAEIEBIAIoAkwhAyACKAJIIQQMDAsgA0HaAGtB//8DcUEISQ0HIANB5ABrQf//A3FBCE8NAyACQSBqQQEgASgCACABKAIEQZTgwAAQgQEgASACKQMgNwIAIAAgA0HcAGs6AAIgAEEQOwAADAoLIAMvAQAiBEEwRwRAIARBJkcNAyADLwECQQJHDQNBCCEEQQYhBUEEIQYMCQsgAy8BAkECRw0CQQghBEEGIQVBBCEGDAcLIAMvAQAiBEEwRwRAIARBJkcNAiADLwECQQJHDQJBCiEEQQghBUEGIQYMCAsgAy8BAkECRw0BQQohBEEIIQVBBiEGDAYLIAMvAQAiBEEwRwRAIARBJkcNASADLwECQQVHDQEgAy0ABCEDIAJBqAJqQQEgASgCACABKAIEQfTgwAAQgQEgASACKQOoAjcCACAAIAM6AAIgAEEOOwAADAgLIAMvAQJBBUYNAQsgAkEBIAEoAgAgASgCBEGU4cAAEIEBIAIoAgQhAyACKAIAIQQMBwsgAy0ABCEDIAJBsAJqQQEgASgCACABKAIEQYThwAAQgQEgASACKQOwAjcCACAAIAM6AAIgAEEQOwAADAULIAJBoAFqQQEgASgCACABKAIEQZTfwAAQgQEgASACKQOgATcCACAAQQ86AAAMBAsgAkHgAGpBASABKAIAIAEoAgRBhODAABCBASABIAIpA2A3AgAgAEEROgAADAMLIAJBGGpBASABKAIAIAEoAgRBpODAABCBASABIAIpAxg3AgAgACADQdIAazoAAiAAQQ47AAAMAgsgAyAGai0AACEGIAMgBWovAQAhBSADIARqLwEAIQMgAkGgAmpBASABKAIAIAEoAgRB5ODAABCBASABIAIpA6ACNwIAIABBEDoAACAAIAYgBUEIdEGA/gNxIANBEHRyckEIdEEBcjYAAQwBCyACQZgCakEBIAEoAgAgASgCBEHU4MAAEIEBIAEgAikDmAI3AgAgAyAGai0AACEBIAMgBWovAQAhBSADIARqLwEAIQMgAEEOOgAAIAAgASAFQQh0QYD+A3EgA0EQdHJyQQh0QQFyNgABCyACQcACaiQADwsgASAENgIAIAEgAzYCBAwACwAL/xICJH8BfiMAQfAAayIDJAAgA0E0aiAAEF4gAygCNCIFQQA2AogGIAVBADYC/AUgBUEANgLwBSAFQQA2AuQFIAVBADYC2AUgBS0AcEEBcQRAIAUoAmwgAUYgAkEAR3EhISAFKAJoIQYLIANBKGogBRBwIAMoAiwiACABSwRAIAVBgAZqIR0gBUH8BWohFCAFQfQFaiEeIAVB8AVqIRUgBUHoBWohHyAFQdwFaiEWIAVB0AVqIRggAygCKCABQQR0aiIBKAIEIQAgACABKAIIQRRsaiEiIANB1gBqISMgA0HQAGoiAUEEciEkIAZB//8DcSElIAFBCWohJkEFIQFBBSEJA0ACQAJAAkAgACIIICJHBEAgCEEUaiEAIAgoAgQiDkUNBCAIKAIAIQYgCEEIaiEgAkACQCADAn8CQCAhICUgD0H//wNxIhlGcSAIQRFqIhAtAABBEHFBBHZHBEBBASAgKAAAIgRB/wFxQQJGDQIaIARBAXENASAEQYD+A3FBA3IMAgsgA0EFIAgoAAwiAkGAfnFBBEEDIAJBAXEbciACQf8BcUECRhsiBDYCbEEAIQogCCgACCIHQf8BcUECRw0CQQAhAgwHCyAEQYB+cUEEcgsiBDYCbEECIQIgCCgADCIHQf8BcUECRw0BQQAhCgwFCyAHQQh2IQogB0EBcQ0DQQMhAiAHQYDwA3ENBCAFLQCMBkEBRw0EDAILIAdBCHYhCiAHQQFxDQJBAyECIAdBgPADcQ0DIAUtAIwGDQEMAwsgCUH/AXFBBUcEQCAYIBGtIAmtQv8Bg0IghiAarUIohoSEQfzCwAAQegsgAUH/AXFBBUcEQCADIAs7AFcgA0HZAGogC0EQdjoAACADIAw6AFogAyABOgBWIAMgDTsBVCADIBc2AlAgFiADQdAAakGMw8AAEGMLIAUoAogGIQEgBSgChAYhAiAFKAL8BSEEIAUoAvgFIQggBSgC8AUhFCAFKALsBSEVIAUoAuQFIQYgBSgC4AUhByAFKALYBSEJIAUoAtQFIQUgA0EANgJsIANBIGogA0HsAGoQBiIAQd/BwABBAiAFIAkQGwJAAn8gAygCIARAIAMoAiQMAQsgA0EYaiADQewAaiAAQeHBwABBBCAHIAYQGyADKAIYBEAgAygCHAwBCyADQRBqIANB7ABqIABB5cHAAEEKIAIgARAbIAMoAhAEQCADKAIUDAELIANBCGogA0HsAGogAEHvwcAAQQ4gFSAUEBsgAygCCARAIAMoAgwMAQsgAyADQewAaiAAQf3BwABBDiAIIAQQGyADKAIARQ0BIAMoAgQLIQEgABCpASADIAE2AmwgA0HsAGpBnMPAABBCAAsgAygCOCADKAI8ELIBIANB8ABqJAAgAA8LIApBCHIgCiAILQAQQQFGGyEKDAELQQQhAgsgAyAKQQh0QYD+A3EgB0GAgHxxciIKIAJyIgc2AkAgA0EAIANB7ABqIhIgBEH/AXFBBUYiBBs2AlggAyARrSAJrUL/AYNCIIYgGq1CKIaEhCInNwNQAkAgCUH/AXFBBUYEQEEFIQkgBA0BIA5BEHQgGXIhESASEFkiCUEIdiEaDAELIARFBEAgJCADQewAaiIEEFFFBEAgGCAnQbzDwAAQeiAOQRB0IBlyIREgBBBZIglBCHYhGgwCCyAOQRB0IBFqIREMAQsgGCAnQazDwAAQekEFIQkLQYjBwAAgBhB5IQQCQAJAAkACQAJ/AkAgBkGgywBGDQAgBA0AQZTBwAAgBhB5DQBB2MDAACAGEHkhBAJAIAZBj80ARg0AIAQNAEHkwMAAIAYQeQ0AQfDAwAAgBhB5DQBB/MDAACAGEHlFDQMLIANBQGsQWSESIBAtAABBAnRB/ABxQQIgCEEQai0AACIEQQFGIARBAkYbckH/AXEhEyAeKAIAIhsgFCgCACIHRgRAIwBBEGsiBCQAIARBCGogHiAbQQFBBEEQECYgBCgCCCIbQYGAgIB4RwRAIAQoAgwaIBtBzMPAABCuAQALIARBEGokAAsgBSgC+AUgB0EEdGoiBCATOgAMIAQgEjYCCCAEIAY2AgQgBCAPOwEAIBQMAQsgA0FAaxBZIRIgHygCACITIBUoAgAiB0YEQCMAQRBrIgQkACAEQQhqIB8gE0EBQQRBDBAmIAQoAggiE0GBgICAeEcEQCAEKAIMGiATQdzDwAAQrgEACyAEQRBqJAALIAUoAuwFIAdBDGxqIgQgEjYCCCAEIAY2AgQgBCAPOwEAIBULIAdBAWo2AgBBICEGDAELIAZBgAFJDQAgDkH//wNxQQFLDQEgBkH//wNNBEAgBkEDdkHAgMAAai0AACAGQQdxdkEBcUUNAQwCC0HMwMAAIAYQeQ0BCyADIAs7AFcgJiALQRB2IgQ6AAAgAyAgNgJcIAMgDDoAWiADIA07AVQgAyAXNgJQIAMgAToAVgJAIAFB/wFxQQVGDQACQCADQUBrICMQUQRAIBAtAABBAnRB/ABxQQIgCEEQai0AACIHQQFGIAdBAkYbckG/AXEgDHNBvwFxRQ0BCwJAIAZBIEcNACAMQQhxQQN2IBAtAAAiB0ECcUEBdkcNACAMQRBxQQR2IAdBBHFBAnZGDQELIAMgCzsAZyADQeAAaiIHQQlqIAQ6AAAgAyAMOgBqIAMgAToAZiADIA07AWQgAyAXNgJgIBYgB0Hsw8AAEGMMAQsgDUEBaiENIAEhAgwCCyAcQRB0IBlyIRcgEC0AAEECdEH8AHFBAiAIQRBqLQAAIgFBAUYgAUECRhtyQf8BcSEMIApBCHYhC0EBIQ0MAQsgAUH/AXFBBUcEQCADIAs7AEsgA0HEAGoiAkEJaiALQRB2OgAAIAMgDDoATiADIAE6AEogAyANOwFIIAMgFzYCRCAWIAJB/MPAABBjCyAQLQAAIQIgCEEQai0AACEBIAMgBzYBViADQQE7AVQgAyAcOwFSIAMgDzsBUCADIAJBAnRB/ABxQQIgAUEBRiABQQJGG3I6AFogFiADQdAAakGMxMAAEGNBBSECCyAFKAKIBiIEIAUoAoAGRgRAIwBBEGsiASQAIAFBCGogHSAdKAIAQQFBBEEEECYgASgCCCIIQYGAgIB4RwRAIAEoAgwaIAhBnMTAABCuAQALIAFBEGokAAsgHEEBaiEcIAUoAoQGIARBAnRqIAY2AgAgBSAEQQFqNgKIBiAOIA9qIQ8gAiEBDAALAAsgASAAQZjlwAAQSwALuQ4BA38jAEHgAGsiAyQAIAFBBGohBAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgASgCACIFQYCAxABGBEAgAkFAag42AQIDBAUGBwgJCgsMDQ43Nw83NxARNzcSEzcUNzc3NzcVFhc3GBkaGxw3NzcdHjc3NzcfIDIhNwsCQCACQewAaw4FNTc3NzMACyACQegARg0zDDYLIABBHToAACAAIAEvAQg7AQIMNgsgAEEMOgAAIAAgAS8BCDsBAgw1CyAAQQk6AAAgACABLwEIOwECDDQLIABBCjoAACAAIAEvAQg7AQIMMwsgAEEIOgAAIAAgAS8BCDsBAgwyCyAAQQQ6AAAgACABLwEIOwECDDELIABBBToAACAAIAEvAQg7AQIMMAsgAEECOgAAIAAgAS8BCDsBAgwvCyAAQQs6AAAgACABLwEYOwEEIAAgAS8BCDsBAgwuCyAAQQM6AAAgACABLwEIOwECDC0LIAEvAQgOBBcYGRoWCyABLwEIDgMbHB0aCyAAQR46AAAgACABLwEIOwECDCoLIABBFToAACAAIAEvAQg7AQIMKQsgAEENOgAAIAAgAS8BCDsBAgwoCyAAQS06AAAgACABLwEIOwECDCcLIABBKDoAACAAIAEvAQg7AQIMJgsgAS8BCA4GGRgaGBgbGAsgAEEWOgAAIAAgAS8BCDsBAgwkCyAAQQE6AAAgACABLwEIOwECDCMLIABBAjoAACAAIAEvAQg7AQIMIgsgAEEKOgAAIAAgAS8BCDsBAgwhCyAAQSI6AAAgACABLwEIOwECDCALIABBLzoAACAAIAEvAQg7AQIMHwsgAEEwOgAAIAAgAS8BCDsBAgweCyAAQQs6AAAgACABLwEYOwEEIAAgAS8BCDsBAgwdCyABLwEIDgQUExMVEwsgAyAEIAEoAoQEQYTcwAAQdiADQUBrIgEgAygCACICIAIgAygCBEEEdGoQKCADQTtqIAFBCGooAgA2AAAgAyADKQJANwAzIABBKzoAACAAIAMpADA3AAEgAEEIaiADQTdqKQAANwAADBsLIANBCGogBCABKAKEBEGU3MAAEHYgA0FAayIBIAMoAggiAiACIAMoAgxBBHRqECggA0E7aiABQQhqKAIANgAAIAMgAykCQDcAMyAAQSU6AAAgACADKQAwNwABIABBCGogA0E3aikAADcAAAwaCyADQRhqIAQgASgChARBpNzAABB2IAMgAykDGDcCTCADQdYAaiADQcwAahAMAn8gAy0AVkESRgRAQQAhAUEAIQRBAQwBCyADQRBqQQRBAUEFQZTIwAAQYCADQdoAai0AACEBIAMoAhAhAiADKAIUIgQgAygAVjYAACAEQQRqIAE6AAAgA0EBNgI4IAMgBDYCNCADIAI2AjAgAyADKQJMNwJAQQUhAkEBIQEDQCADQdsAaiADQUBrEAwgAy0AW0ESRkUEQCADKAIwIAFGBEAgA0EwaiABQQFBAUEFEG0gAygCNCEECyACIARqIgUgAygAWzYAACAFQQRqIANB3wBqLQAAOgAAIAMgAUEBaiIBNgI4IAJBBWohAgwBCwsgAygCMCEEIAMoAjQLIQIgACABNgIMIAAgAjYCCCAAIAQ2AgQgAEEpOgAADBkLIABBEzoAACAAIAEvARg7AQQgACABLwEIOwECDBgLIABBJzoAAAwXCyAAQSY6AAAMFgsgAEEyOgAADBULIABBFzsBAAwUCyAAQZcCOwEADBMLIABBlwQ7AQAMEgsgAEGXBjsBAAwRCyAAQTI6AAAMEAsgAEEYOwEADA8LIABBmAI7AQAMDgsgAEGYBDsBAAwNCyAAQTI6AAAMDAsgAEEHOwEADAsLIABBhwI7AQAMCgsgAEGHBDsBAAwJCyAAQTI6AAAMCAsgAEEuOwEADAcLIABBrgI7AQAMBgsgAS8BCEEIRg0DIABBMjoAAAwFCyAFQSFHDQMgAEEUOgAADAQLIAVBP0cNAiADQSBqIAQgASgChARBtNzAABB2IANBQGsiASADKAIgIgIgAiADKAIkQQR0ahApIANBO2ogAUEIaigCADYAACADIAMpAkA3ADMgAEESOgAAIAAgAykAMDcAASAAQQhqIANBN2opAAA3AAAMAwsgBUE/Rw0BIANBKGogBCABKAKEBEHE3MAAEHYgA0FAayIBIAMoAigiAiACIAMoAixBBHRqECkgA0E7aiABQQhqKAIANgAAIAMgAykCQDcAMyAAQRA6AAAgACADKQAwNwABIABBCGogA0E3aikAADcAAAwCCyAAQTE6AAAgACABLwEYOwEEIAAgAS8BKDsBAgwBCyAAQTI6AAALIANB4ABqJAALmQoBCn8CQAJAAkAgACgCACIFIAAoAggiA3IEQAJAIANBAXFFDQAgASACaiEGAkAgACgCDCIJRQRAIAEhBAwBCyABIQQDQCAEIAZGDQICfyAEIgMsAAAiBEEATgRAIANBAWoMAQsgA0ECaiAEQWBJDQAaIANBA2ogBEFwSQ0AGiADQQRqCyIEIANrIAdqIQcgCSAIQQFqIghHDQALCyAEIAZGDQACQCAELAAAQQBODQALIAcgAgJ/AkAgB0UNACACIAdNBEAgAiAHRg0BQQAMAgsgASAHaiwAAEFATg0AQQAMAQsgAQsiAxshAiADIAEgAxshAQsgBUUNAyAAKAIEIQsgAkEQTwRAIAEgAUEDakF8cSIHayIIIAJqIgpBA3EhCUEAIQVBACEDIAEgB0cEQCAIQXxNBEBBACEGA0AgAyABIAZqIgQsAABBv39KaiAEQQFqLAAAQb9/SmogBEECaiwAAEG/f0pqIARBA2osAABBv39KaiEDIAZBBGoiBg0ACwsgASEEA0AgAyAELAAAQb9/SmohAyAEQQFqIQQgCEEBaiIIDQALCwJAIAlFDQAgByAKQXxxaiIELAAAQb9/SiEFIAlBAUYNACAFIAQsAAFBv39KaiEFIAlBAkYNACAFIAQsAAJBv39KaiEFCyAKQQJ2IQYgAyAFaiEFA0AgByEIIAZFDQRBwAEgBiAGQcABTxsiCUEDcSEKIAlBAnQhB0EAIQQgBkEETwRAIAggB0HwB3FqIQwgCCEDA0AgBCADKAIAIgRBf3NBB3YgBEEGdnJBgYKECHFqIAMoAgQiBEF/c0EHdiAEQQZ2ckGBgoQIcWogAygCCCIEQX9zQQd2IARBBnZyQYGChAhxaiADKAIMIgRBf3NBB3YgBEEGdnJBgYKECHFqIQQgDCADQRBqIgNHDQALCyAGIAlrIQYgByAIaiEHIARBCHZB/4H8B3EgBEH/gfwHcWpBgYAEbEEQdiAFaiEFIApFDQALIAggCUH8AXFBAnRqIgQoAgAiA0F/c0EHdiADQQZ2ckGBgoQIcSEDIApBAUYNAiADIAQoAgQiA0F/c0EHdiADQQZ2ckGBgoQIcWohAyAKQQJGDQIgAyAEKAIIIgNBf3NBB3YgA0EGdnJBgYKECHFqIQMMAgsgAkUEQEEAIQUMAwsgAkEDcSEEAkAgAkEESQRAQQAhBUEAIQgMAQtBACEFIAEhAyACQQxxIgghBwNAIAUgAywAAEG/f0pqIANBAWosAABBv39KaiADQQJqLAAAQb9/SmogA0EDaiwAAEG/f0pqIQUgA0EEaiEDIAdBBGsiBw0ACwsgBEUNAiABIAhqIQMDQCAFIAMsAABBv39KaiEFIANBAWohAyAEQQFrIgQNAAsMAgsMAgsgA0EIdkH/gRxxIANB/4H8B3FqQYGABGxBEHYgBWohBQsCQCAFIAtJBEAgCyAFayEGAkACQAJAIAAtABgiA0EAIANBA0cbIgNBAWsOAgABAgsgBiEDQQAhBgwBCyAGQQF2IQMgBkEBakEBdiEGCyADQQFqIQMgACgCECEIIAAoAiAhBCAAKAIcIQADQCADQQFrIgNFDQIgACAIIAQoAhARAgBFDQALQQEPCwwBCyAAIAEgAiAEKAIMEQMABEBBAQ8LQQAhAwNAIAMgBkYEQEEADwsgA0EBaiEDIAAgCCAEKAIQEQIARQ0ACyADQQFrIAZJDwsgACgCHCABIAIgACgCICgCDBEDAAvhCwIPfwJ+IwBB0ABrIgIkACABQQRqIQwgAkFAayENIAJBJWohDiACQRxqIQ8gASgCJCEFIAEoAhQhECABKAIQIQMCQAJAAn8CQANAIAEoAgAhBiABQYCAgIB4NgIAIAEoAgQhCwJAAkACQAJAAkAgBkGAgICAeEcEQCABKQIIIREgCyEHDAELAkAgAyAQRgRAQYCAgIB4IQYMAQsgASADQRBqIgg2AhAgAykCCCERIAMoAgQhByADKAIAIQYgCCEDC0GAgICAeCALEKMBIAZBgICAgHhGDQELIAIgBzYCDCACIAY2AgggAiARNwIQIBFCIIghEkF/IAUgEaciBEcgBCAFSxtB/wFxDgICAwELQYCAgIB4IAcQowEgAEGAgICAeDYCACABQYCAgIB4NgIADAcLAkAgEqdBAXENACAFIAQgByAEEDRrIgMgAyAFSRsiAyAESw0AIAIgAzYCECADIQQLAn9BgICAgHggBCAFTQ0AGgJAAkAgByAEIAVBuNrAABCQASgCBEUEQCACQThqIgMgAkEIaiIIIAVBAWsQPyACQTBqIANBCGooAgA2AgAgAiACKQI4NwMoIAItABQhBCADQRBqIAIoAgwgAigCECIHIAdBAWtB2NrAABCQASIHQRBqLwEAOwEAIAJCoICAgBA3AjggAiAHKQIINwJAIAggA0Ho2sAAEFcgAiAEOgA0IAItABRBAXFFDQEMAgsgAkE4aiIDIAJBCGogBRA/IAJBMGogA0EIaigCADYCACACIAIpAjg3AyggAiACLQAUIgM6ADQgAw0BCyACQShqEIsBCyACKAIwBEAgAkFAayACQTRqKAIANgIAIAJBAToAFCACIAIpAiw3AzggAigCKAwBCyACKAIoIAIoAixBBEEUEJ8BQYCAgIB4CyEDQYCAgIB4IAsQowEgASADNgIAIAwgAikDODcCACAMQQhqIAJBQGsoAgA2AgAgAEEIaiACQRBqKQIANwIAIAAgAikCCDcCAAwGCyAAIBE3AgggACAHNgIEIAAgBjYCAAwFCwJAIAMgEEcEQCABIANBEGoiCDYCECADKAIAIgZBgICAgHhHDQELIAJBADsAQCACQQI6ADwgAkECOgA4IAJBCGoiASAFIAJBOGoQQSAAIAIpAgg3AgAgAkEAOgAUIABBCGogAUEIaikCADcCAAwFCyADQQxqKAIAIQkgDyADKQIENwIAIA9BCGogCTYCACACIAY2AhggBSAEayIJRQ0BIBKnQQFxRQRAIAJBADsAQCACQQI6ADwgAkECOgA4IAJBCGogBSACQThqEEEMAgsgAi0AJEUEQCACQRhqEIsBCyACKAIcIQMgAigCICIKIAlNBEAgAkEIaiIEIAMgChCAAQJAIAItACQiBg0AIAJBADoAFCACKAIQIAVPDQAgAkEAOwBAIAJBAjoAPCACQQI6ADggBCAFIAJBOGoQQQsgAigCGCADQQRBFBCfASAGRQ0EQYCAgIB4IAsQowEgAUEIaiACQRBqKQIANwIAIAEgAikCCDcCAEGAgICAeCACEKMBIAghAwwBCwsgAyAKIAlB+NnAABCQASgCBEUEQCANQQhqIAcgBCAEQQFrQYjawAAQkAEiCEEQai8BADsBACANIAgpAgg3AgAgAkKggICAEDcCOCACQQhqIAJBOGpBmNrAABBXIAlBAWshCQsgCSAKTQRAIAJBCGogAyAJEIABIAIoAhghBiADIAogCRCIASAGQYCAgIB4Rg0DIAogCiAJayIIIAggCksbIQQgAi0AJAwCCyAJIApBqNrAABCzAQALIAJBKmogDkECai0AADoAACACIA4vAAA7ASggAigCICEEIAIoAhwhAyACLQAkCyEIQYCAgIB4IAsQowEgASAIOgAMIAEgBDYCCCABIAM2AgQgASAGNgIAIAEgAi8BKDsADSABQQ9qIAJBKmotAAA6AAALIAAgAikCCDcCACAAQQhqIAJBEGopAgA3AgALIAJB0ABqJAAL5QoCEH8BfiMAQZABayICJAAgACgCbCIFIAAoAhwiBmsiAUEAIAEgACgCFCIHIAZrIAVqTRshDSAFIAdqIQMgB0EEdCIBIAAoAhAiCmohDyAAKAIYIQwgACgCaCEOIAAoAqABIQsgACgCnAEhCCAKIQQDQAJAIAMgBkYNACABRQ0AIAkgDGpBACAELQAMIhAbIQkgA0EBayEDIAFBEGshASAEQRBqIQQgDSAQQQFzaiENDAELCyAIIAxHBEBBACEFIABBADYCFCACIAg2AjggAkEANgI0IAIgBzYCMCACIABBDGoiDDYCLCACIA82AiggAiAKNgIkIAJBgICAgHg2AhQgAkHIAGogAkEUaiIBEBACfyACKAJIQYCAgIB4RgRAIAEQoQFBBCEEQQAMAQsgAkEIakEE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QQlJDQEgA0UEQCABIQMDQCADIAVqIgEgAyACEGogASEDIAIgACACayIATQ0ACwwBCwtBACAAQQR0IgNrIQUDQCABIAVqIAEgABBqIAEgA2ohASACIABrIgIgAE8NAAsMAQsLIAEgAEEEdCIFayIDIAJBBHQiBmohByAAIAJLDQEgBEEQaiIAIAMgBRAWGiADIAEgBhASIAcgACAFEBYaDAILIARBCGoiByABIABBBHRrIgZBCGopAgA3AwAgBCAGKQIANwMAIAJBBHQhCCACIgUhAQNAIAYgAUEEdGohAwNAIARBGGoiCSADQQhqIgopAgA3AwAgBCADKQIANwMQIAcpAwAhDSADIAQpAwA3AgAgCiANNwIAIAcgCSkDADcDACAEIAQpAxA3AwAgACABSwRAIAMgCGohAyABIAJqIQEMAQsLIAEgAGsiAQRAIAEgBSABIAVJGyEFDAEFIAQpAwAhDSAGQQhqIARBCGoiBykDADcCACAGIA03AgBBASAFIAVBAU0bIQlBASEBA0AgASAJRg0EIAYgAUEEdGoiBSkCACENIAcgBUEIaiIKKQIANwMAIAQgDTcDACABIAJqIQMDQCAEQRhqIgsgBiADQQR0aiIIQQhqIgwpAgA3AwAgBCAIKQIANwMQIAcpAwAhDSAIIAQpAwA3AgAgDCANNwIAIAcgCykDADcDACAEIAQpAxA3AwAgACADSwRAIAIgA2ohAwwBCyADIABrIgMgAUcNAAsgBCkDACENIAogBykDADcCACAFIA03AgAgAUEBaiEBDAALAAsACwALIARBEGoiACABIAYQFhogByADIAUQEiADIAAgBhAWGgsgBEGQAWokAAuQBQEIfwJAIAJBEEkEQCAAIQMMAQsCQEEAIABrQQNxIgYgAGoiBSAATQ0AIAZBAWsgACEDIAEhBCAGBEAgBiEHA0AgAyAELQAAOgAAIARBAWohBCADQQFqIQMgB0EBayIHDQALC0EHSQ0AA0AgAyAELQAAOgAAIANBAWogBEEBai0AADoAACADQQJqIARBAmotAAA6AAAgA0EDaiAEQQNqLQAAOgAAIANBBGogBEEEai0AADoAACADQQVqIARBBWotAAA6AAAgA0EGaiAEQQZqLQAAOgAAIANBB2ogBEEHai0AADoAACAEQQhqIQQgBSADQQhqIgNHDQALCyACIAZr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AygCHCIAIAEgAhAlIANBKGogAEHgAGooAgAgAEHkAGooAgAQIyADQRBqIAAQJCADIAMpAxA3AjQgA0EIaiADKAIsIAMoAjAQWyADKAIMIQAgAygCCEEBcQRAIAMgADYCPCADQTxqQezCwAAQQgALIANBKGoQbiADKAIgIAMoAiQQsgEgA0FAayQAIAALmQEBA38gAUFsbCECIAFB/////wNxIQMgACABQRRsaiEBQQAhAAJAA0AgAkUNAQJAIAFBFGsiBCgCAEEgRw0AIAFBEGsoAgBBAUcNACABQQxrLQAAQQJHDQAgAUEIay0AAEECRw0AIAFBBGstAAANACABQQNrLQAAQR9xDQAgAkEUaiECIABBAWohACAEIQEMAQsLIAAhAwsgAwuxAQECfyMAQRBrIgIkAAJAIAFFDQAgAUEDakECdiEBAkAgAEEETQRAIAFBAWsiA0GAAkkNAQsgAkGsssEAKAIANgIIIAEgACACQQhqQaiqwQBBBEEFEE8hAEGsssEAIAIoAgg2AgAMAQsgAkGsssEANgIEIAIgA0ECdEGsqsEAaiIDKAIANgIMIAEgACACQQxqIAJBBGpBBkEHEE8hACADIAIoAgw2AgALIAJBEGokACAAC6ABAQN/IwBBEGsiBSQAIAVBCGogACABIAJB4M7AABBnIAUoAgwiBiADIAIgAWsiByADIAdJGyIDTwRAIAYgA2siBiAFKAIIIAZBBHRqIAMQFSAAIAEgASADaiAEECogAQRAIAAgAUEBa0HwzsAAEGJBADoADAsgACACQQFrQYDPwAAQYkEAOgAMIAVBEGokAA8LQczJwABBIUHwycAAEHEAC6gBAQF/IwBBQGoiAyQAIANBCGogACgCABACIAMoAgghACADIAMoAgw2AgQgAyAANgIAIANBATYCMCADQQI2AhggA0GYqsEANgIUIANCATcCICADIAMoAgQiADYCPCADIAMoAgA2AjggAyAANgI0IAMgA0E0ajYCLCADIANBLGo2AhwgASACIANBFGoQFyADKAI0IgEEQCADKAI4QQEgARA4CyADQUBrJAALpAEBAX8jAEEQayIDJAACQCAARQ0AIAJFDQACQCABQQRNBEAgAkEDakECdkEBayIBQYACSQ0BCyADQayywQAoAgA2AgggACADQQhqQaiqwQBBAhAxQayywQAgAygC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BDYCBCAAIAE2AgALOAACQCABaUEBRw0AQYCAgIB4IAFrIABJDQAgAARAQeyywQAtAAAaIAEgABA1IgFFDQELIAEPCwALOAACQCACQYCAxABGDQAgACACIAEoAhARAgBFDQBBAQ8LIANFBEBBAA8LIAAgA0EAIAEoAgwRAwALLQEBfyABIAAoAgBPBH8gACgCBCECIAAtAAhFBEAgASACTQ8LIAEgAkkFQQALC3ABA38gACgCACIEIAAoAggiBUYEQCMAQRBrIgMkACADQQhqIAAgBEEBQQJBCBAmIAMoAggiBEGBgICAeEcEQCADKAIMGiAEIAIQrgEACyADQRBqJAALIAAgBUEBajYCCCAAKAIEIAVBA3RqIAE3AQALNAEBfyAAKAIIIgMgACgCAEYEQCAAIAIQawsgACADQQFqNgIIIAAoAgQgA0ECdGogATYCAAsuAQF/IwBBEGsiAiQAIAJBCGogASAAEIwBIAIoAggiAARAIAJBEGokACAADwsACzcBAX8jAEEgayIBJAAgAUEANgIYIAFBATYCDCABQYzpwAA2AgggAUIENwIQIAFBCGogABCKAQALKgEBfyACIAMQNSIEBEAgBCAAIAEgAyABIANJGxAWGiAAIAIgARA4CyAECysAIAIgA0kEQCADIAIgBBC0AQALIAAgAiADazYCBCAAIAEgA0EUbGo2AgALLwEBfyAAIAIQjgEgACgCBCAAKAIIIgNBFGxqIAEgAkEUbBAWGiAAIAIgA2o2AggLKwAgASADSwRAIAEgAyAEELQBAAsgACADIAFrNgIEIAAgAiABQQR0ajYCAAsvAAJAAkAgA2lBAUcNAEGAgICAeCADayABSQ0AIAAgASADIAIQfiIADQELAAsgAAsuAANAIAEEQCAAKAIAIABBBGooAgBBBEEUEJ8BIAFBAWshASAAQRBqIQAMAQsLCzIBAX8gACgCCCECIAEgACgCAEECai0AABCbASEBIAAoAgQgAiABEAEgACACQQFqNgIICyoAIAAgACgCaCABaiIBIAAoApwBIgBBAWsgACABSxtBACABQQBOGzYCaAszAQJ/IAAgACgCqAEiAiAAKAKsAUEBaiIDIAEgAEGyAWoQNiAAKAJgIAAoAmQgAiADEFMLMwECfyAAIAAoAqgBIgIgACgCrAFBAWoiAyABIABBsgFqEB0gACgCYCAAKAJkIAIgAxBTCyoAIAEgAkkEQEGkyMAAQSNBvMnAABBxAAsgAiAAIAJBFGxqIAEgAmsQGQs1ACAAIAApAnQ3AmggACAAKQF8NwGyASAAIAAvAYYBOwG+ASAAQboBaiAAQYQBai8BADsBAAvsAQICfwF+IwBBEGsiAiQAIAJBATsBDCACIAE2AgggAiAANgIEIwBBEGsiASQAIAJBBGoiACkCACEEIAEgADYCDCABIAQ3AgQjAEEQayIAJAAgAUEEaiIBKAIAIgIoAgwhAwJAAkACQAJAIAIoAgQOAgABAgsgAw0BQQEhAkEAIQMMAgsgAw0AIAIoAgAiAigCBCEDIAIoAgAhAgwBCyAAQYCAgIB4NgIAIAAgATYCDCABKAIIIgEtAAkaIABBGyABLQAIEEoACyAAIAM2AgQgACACNgIAIAEoAggiAS0ACRogAEEcIAEtAAgQSgALKwECfwJAIAAoAgQgACgCCCIBEDQiAkUNACABIAJJDQAgACABIAJrNgIICwsmACACBEBB7LLBAC0AABogASACEDUhAQsgACACNgIEIAAgATYCAAsjAQF/IAEgACgCACAAKAIIIgJrSwRAIAAgAiABQQRBEBBtCwsjAQF/IAEgACgCACAAKAIIIgJrSwRAIAAgAiABQQRBFBBtCwslACAAQQE2AgQgACABKAIEIAEoAgBrQQR2IgE2AgggACABNgIACxsAIAEgAk0EQCACIAEgAxBLAAsgACACQRRsagsgACABIAJNBEAgAiABQeTjwAAQSwALIAAgAmpBAToAAAsbACABIAJNBEAgAiABIAMQSwALIAAgAkEEdGoLAwAACwMAAAsDAAALAwAACwMAAAsDAAALGgBB7LLBAC0AABpBBCAAEDUiAARAIAAPCwALIQAgAEUEQEGc68AAQTIQuQEACyAAIAIgAyABKAIQEQEACxYAIAFBAXFFBEAgALgQCQ8LIACtEAoLRgEBfyAAIAAoAgBBAWsiATYCACABRQRAIABBDGoQRwJAIABBf0YNACAAIAAoAgRBAWsiATYCBCABDQAgAEEEQZwGEDgLCwsfACAARQRAQZzrwABBMhC5AQALIAAgAiABKAIQEQIACyEBAX8gACgCECIBIAAoAhQQgwEgACgCDCABQQRBEBCfAQsSACAABEAgASACIAAgA2wQOAsLIQEBfyAAKAIEIgEgACgCCBCDASAAKAIAIAFBBEEQEJ8BCxYAIABBEGoQWCAAKAIAIAAoAgQQowELFAAgACAAKAIAQQFrNgIAIAEQnAELGQAgAEGAgICAeEcEQCAAIAFBBEEUEJ8BCwsUACABBEBBgICAgHggARCjAQsgAQsZACABKAIcQcjlwABBDiABKAIgKAIMEQMACw8AIAIEQCAAIAEgAhA4CwsPACABBEAgACACIAEQOAsLEwAgAARADwtBpKnBAEEbELkBAAsPACAAQYQBTwRAIAAQAwsLEwAgACgCCCAAKAIAQQJBAhCfAQsVACACIAIQpAEaIABBgICAgHg2AgALFAAgACgCACABIAAoAgQoAgwRAgALEAAgASAAKAIEIAAoAggQDws8ACAARQRAIwBBIGsiACQAIABBADYCGCAAQQE2AgwgAEHQxMAANgIIIABCBDcCECAAQQhqIAEQigEACwALFAAgAEEANgIIIABCgICAgBA3AgALEgAgACABQZDNwAAQYkEBOgAMCxAAIAEgACgCACAAKAIEEA8LDgAgAEEANgIAIAEQnAELawEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBAjYCDCADQejpwAA2AgggA0ICNwIUIAMgA0EEaq1CgICAgOABhDcDKCADIAOtQoCAgIDgAYQ3AyAgAyADQSBqNgIQIANBCGogAhCKAQALawEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBAjYCDCADQcjpwAA2AgggA0ICNwIUIAMgA0EEaq1CgICAgOABhDcDKCADIAOtQoCAgIDgAYQ3AyAgAyADQSBqNgIQIANBCGogAhCKAQALawEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBAjYCDCADQZzqwAA2AgggA0ICNwIUIAMgA0EEaq1CgICAgOABhDcDKCADIAOtQoCAgIDgAYQ3AyAgAyADQSBqNgIQIANBCGogAhCKAQALDgBB8OXAAEErIAAQcQALCwAgACMAaiQAIwALDgBBv6nBAEHPABC5AQALCQAgACABEAcACw0AIABB9ObAACABEBcLDAAgACABKQIANwMACwoAIAAoAgAQqQELDQAgAEGAgICAeDYCAAsJACAAQQA2AgALBgAgABBYCwUAQYAECwQAQQELBAAgAQsEAEEACwvSbSAAQYCAwAALQB0AAAAEAAAABAAAAB4AAABjYWxsZWQgYFJlc3VsdDo6dW53cmFwKClgIG9uIGFuIGBFcnJgIHZhbHVlRXJyb3IAQb+JwAALAXgAQeCJwAALEP////////////////////8AQYaKwAALDwEAAAAAACAAAAAAAAAAAgBBwIrAAAsg//////////////////////////////////////////8AQaSLwAALCBAAAAAAAAABAEHAuMAACwL/BwBB1LjAAAsHDwD////1/wBBgLnAAAsW////////////////////////////AwBBoLnAAAsd/////////////////////////////////////w8AQf+5wAALGPz//////////////////////////////wBBoLrAAAs+//////////////////////////////////////////////////////////////////////////////////8AQYy7wAALOP////////////////////////////////////////////////////////////////////////9/AEHgu8AAC9EB/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wMAQcC9wAALJ///////////////////////////////////////////////////DwBBwMDAAAvBI3NyYy9saWIucnMAAAEADwDwGg8AAAAAAOIlAADlJQAAAAAAALDgAACz4AAAAAAAADz7AQBp+wEAAAAAAGr7AQBs+wEAAAAAAIAlAACfJQAAAAAAAAD7AQA7+wEAAAAAAGF0dGVtcHRlZCB0byB0YWtlIG93bmVyc2hpcCBvZiBSdXN0IHZhbHVlIHdoaWxlIGl0IHdhcyBib3Jyb3dlZGJndGV4dGNvZGVwb2ludHNyYXN0ZXJfc3ltYm9s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FVFVVVVVVVVVAAAAAAAAQFVVVVVVVVVVVdVXVVVVVVVVVVVVVVUFAABUVVVVVVVVVVVVVVVVVRUAAFVVUVVVVVVVBRAAAAEBUFVVVVVVVVVVVVUBVVVVVVX/////f1VVVVBVAABVVVVVVVVVVVVVBQBBwPzAAAuYBEBVVVVVVVVVVVVVVVVVRVQBAFRRAQBVVQVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVRAFUVVFVFVVVBVVVVVVVVUVBVVVVVVVVVVVVVVVVVVVUQRUUUFFVVVVVVVVVUFFVVUFVVVVVVVVVVVVVVVVVVVQBEFRRVVVVVQVVVVVVVQUAUVVVVVVVVVVVVVVVVVVVBAFUVVFVAVVVBVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVFVFVVUVUVVVVVVVVVVVVVVVRUVVVVVVVVVVVVVVVVVQRUBQRQVUFVVQVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVFEQFBFBVQVVVBVVVVVVVVVVQVVVVVVVVVVVVVVVVVRVEAVRVQVUVVVUFVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVUUVBURVFVVVVVVVVVVVVVVVVVVVVVVVVVVVUQBAVVUVAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRAABUVVUAQFVVVVVVVVVVVVVVVVVVVVVVVVBVVVVVVVURUVVVVVVVVVVVVVVVVVUBAABAAARVAQAAAQAAAAAAAAAAVFVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQEEAEFBVVVVVVVVUAVUVVVVAVRVVUVBVVFVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqAEGAgcEAC5ADVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBVVVVVVVVVVVVVVVVBVRVVVVVVVUFVVVVVVVVVQVVVVVVVVVVBVVVVX///ff//ddfd9bV11UQAFBVRQEAAFVXUVVVVVVVVVVVVVUVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBVUVUVVAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVcVFFVVVVVVVVVVVVVVVVVVRQBARAEAVBUAABRVVVVVVVVVVVVVVVUAAAAAAAAAQFVVVVVVVVVVVVVVVQBVVVVVVVVVVVVVVVUAAFAFVVVVVVVVVVVVFQAAVVVVUFVVVVVVVVUFUBBQVVVVVVVVVVVVVVVVVUVQEVBVVVVVVVVVVVVVVVVVVQAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAAAQAVFFVVFBVVVVVVVVVVVVVVVVVVVVVVQBBoITBAAuTCFVVFQBVVVVVVVUFQFVVVVVVVVVVVVVVVQAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAAAAAAAAAAFRVVVVVVVVVVVX1VVVVaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/VfXVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX1VVVVVVV9VVVVVVVVVVVVVVVX///9VVVVVVVVVVVVV1VVVVVXVVVVVXVX1VVVVVX1VX1V1VVdVVVVVdVX1XXVdVV31VVVVVVVVVVdVVVVVVVVVVXfV31VVVVVVVVVVVVVVVVVVVf1VVVVVVVVXVVXVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdVXVVVVVVVVVVVVVVVVV11VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVBVVVVVVVVVVVVVVVVVVVX9////////////////X1XVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAAAAAAAAqqqqqqqqmqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlpVVVVVVVWqqqqqqqqqqqqqqqqqqgoAqqqqaqmqqqqqqqqqqqqqqqqqqqqqqqqqqmqBqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlWpqqqqqqqqqqqqqqmqqqqqqqqqqqqqqqqoqqqqqqqqqqqqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVlaqqqqqqqqqqqqqqaqqqqqqqqqqqqqpVVaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVVVVVVVVVVVVVVVVVVVVqqqqVqqqqqqqqqqqqqqqqqpqVVVVVVVVVVVVVVVVVV9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVQAAAUFVVVVVVVVUFVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVRUUVVVVVVVVVQVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBVVVVVVVUAAAAAUFVFFVVVVVVVVVVVVQUAUFVVVVVVFQAAUFVVVaqqqqqqqqpWQFVVVVVVVVVVVVVVFQVQUFVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVAUBBQVVVFVVVVFVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVQQUVAVRVVVVVVVVVVVVVVBVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFUUVVVVVWqqqqqqqqqqqpVVVUAAAAAAEAVAEG/jMEAC+EMVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAAAA8KqqWlUAAAAAqqqqqqqqqqpqqqqqqmqqVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFamqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlZVVVVVVVVVVVVVVVVVVQVUVVVVVVVVVVVVVVVVVVVVqmpVVQAAVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFQFUBQVUAVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBVVVVVVVV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVFVVVVVVVVVVVVVVVVVVVVVVVVUBVVVVVVVVVVVVVVVVVVVVVVUFAABUVVVVVVVVVVVVVVUFUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVAAAAQFVVVVVVVVVVVVUUVFUVUFVVVVVVVVVVVVVVFUBBVUVVVVVVVVVVVVVVVVVVVVVAVVVVVVVVVVUVAAEAVFVVVVVVVVVVVVVVVVVVFVVVVVBVVVVVVVVVVVVVVVUFAEAFVQEUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVUARVRVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRUVAEBVVVVVVVBVVVVVVVVVVVVVVVVVFURUVVVVVRVVVVUFAFQAVFVVVVVVVVVVVVVVVVVVVVUAAAVEVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVUUAEQRBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFQVQVRBUVVVVVVVVUFVVVVVVVVVVVVVVVVVVVVVVVVVVFQBAEVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVEAEFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBBRAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVAABBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVRUEEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAFVVRVVVVVVVVVAQBAVVVVVVVVVVVVFQAEQFUVVVUBQAFVVVVVVVVVVVVVAAAAAEBQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBAABBVVVVVVVVVVVVVVVVVVVVVVVVVVQUAAAAAAAUABEFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBQEUQAABVVVVVVVVVVVVVVVVVVVVVVVVQEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVUVVVAVVVVVVVVVVVVVVVVBUBVRFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFQAAAFBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBUVVVVVVVVVVVVVVVVVVUAQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVFUBVVVVVVVVVVVVVVVVVVVVVVVVVqlRVVVpVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVaqqqqqqqqqqqqqqqqqqqqqqqqqqqlpVVVVVVVVVVVVVqqpWVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqmqaaqqqqqqqqqqalVVVWVVVVVVVVVVallVVVWqVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVVVVVVVVQQBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBBq5nBAAt1UAAAAAAAQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRFQBQAAAABAAQBVVVVVVVVVBVBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFVFVVVVVVVVVVVVVVVVVVAEGtmsEACwJAFQBBu5rBAAvFBlRVUVVVVVRVVVVVFQABAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVUAQAAAAAAUABAEQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAQFVVVVVVVVVVVVVVVVVVV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXVVVVVVVVVVVVVVVVVVVVVdf3/f1VVVVVVVVVVVVVVVVVVVVVVVfX///////9uVVVVqqq6qqqqqur6v79VqqpWVV9VVVWqWlVVVVVVVf//////////V1VV/f/f///////////////////////3//////9VVVX/////////////f9X/VVVV/////1dX//////////////////////9/9//////////////////////////////////////////////////////////////X////////////////////X1VV1X////////9VVVVVdVVVVVVVVX1VVVVXVVVVVVVVVVVVVVVVVVVVVVVVVVXV////////////////////////////VVVVVVVVVVVVVVVV//////////////////////9fVVd//VX/VVXVV1X//1dVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX///9VV1VVVVVVVf//////////////f///3/////////////////////////////////////////////////////////////9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV////V///V1X//////////////9//X1X1////Vf//V1X//1dVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlpVVVVVVVVVVVmWVWGqpVmqVVVVVVWVVVVVVVVVVZVVVQBBjqHBAAsBAwBBnKHBAAuJCVVVVVVVlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFQCWalpaaqoFQKZZlWVVVVVVVVVVVQAAAABVVlVVqVZVVVVVVVVVVVVWVVVVVVVVVVUAAAAAAAAAAFRVVVWVWVlVVWVVVWlVVVVVVVVVVVVVVZVWlWqqqqpVqqpaVVVVWVWqqqpVVVVVZVVVWlVVVVWlZVZVVVWVVVVVVVVVppaalllZZamWqqpmVapVWllVWlZlVVVVaqqlpVpVVVWlqlpVVVlZVVVZVVVVVVWVVVVVVVVVVVVVVVVVVVVVVVVVVVVlVfVVVVVpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVqqqqqqqqqqqqVVVVqqqqqqVaVVWaqlpVpaVVWlqllqVaVVVVpVpVlVVVVX1VaVmlVV9VZlVVVVVVVVVVZlX///9VVVWammqaVVVV1VVVVVXVVVWlXVX1VVVVVb1Vr6q6qquqqppVuqr6rrquVV31VVVVVVVVVVdVVVVVWVVVVXfV31VVVVVVVVWlqqpVVVVVVVXVV1VVVVVVVVVVVVVVVVetWlVVVVVVVVVVVaqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqAAAAwKqqWlUAAAAAqqqqqqqqqqpqqqqqqmqqVVVVVVVVVVVVVVVVBVRVVVVVVVVVVVVVVVVVVVWqalVVAABUWaqqalWqqqqqqqqqWqqqqqqqqqqqqqqqqqqqWlWqqqqqqqqquv7/v6qqqqpWVVVVVVVVVVVVVVVVVfX///////8vbml4L3N0b3JlLzI4aHl6ZmwzMzhrczRhbWhhN3ZwcG5sYnExczFucWF2LXJ1c3QtZGVmYXVsdC0xLjg1LjAvbGliL3J1c3RsaWIvc3JjL3J1c3QvbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5ycy9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL3dhc20tYmluZGdlbi0wLjIuMTA2L3NyYy9jb252ZXJ0L3NsaWNlcy5ycy9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby0xOTQ5Y2Y4YzZiNWI1NTdmL3dhc20tYmluZGdlbi0wLjIuMTA2L3NyYy9leHRlcm5yZWYucnMdVBAAZwAAAH8AAAARAAAAHVQQAGcAAACMAAAAEQAAAG51bGwgcG9pbnRlciBwYXNzZWQgdG8gcnVzdHJlY3Vyc2l2ZSB1c2Ugb2YgYW4gb2JqZWN0IGRldGVjdGVkIHdoaWNoIHdvdWxkIGxlYWQgdG8gdW5zYWZlIGFsaWFzaW5nIGluIHJ1c3RKc1ZhbHVlKCkADlUQAAgAAAAWVRAAAQBBqKrBAAsBBABICXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AgZ3YWxydXMGMC4yNC40DHdhc20tYmluZGdlbhMwLjIuMTA2ICgxMTgzMWZiODkp");
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

// js/chunks/asciinema_player.js
if (!document.querySelector("[data-asciinema-css]")) {
  const style2 = document.createElement("style");
  style2.setAttribute("data-asciinema-css", "");
  style2.textContent = asciinema_player_default;
  document.head.appendChild(style2);
}
function mount2(el) {
  const data = el.dataset.cast;
  if (!data) return;
  const player = create2(
    { data },
    el,
    {
      fit: "width",
      terminalFontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
      theme: "asciinema",
      speed: 4,
      idleTimeLimit: 0.5
    }
  );
  return () => {
    if (player && player.dispose) player.dispose();
  };
}
export {
  mount2 as mount
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9hc2NpaW5lbWEtcGxheWVyL2Rpc3QvbG9nZ2luZy0tUDBDc0V1Xy5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL2FzY2lpbmVtYS1wbGF5ZXIvZGlzdC9jb3JlLURuTk9NdFpuLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvYXNjaWluZW1hLXBsYXllci9kaXN0L29wdHMtQnRMeHNNXzYuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9hc2NpaW5lbWEtcGxheWVyL2Rpc3QvaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9hc2NpaW5lbWEtcGxheWVyL2Rpc3QvYnVuZGxlL2FzY2lpbmVtYS1wbGF5ZXIuY3NzIiwgIi4uLy4uL2Fzc2V0cy9qcy9jaHVua3MvYXNjaWluZW1hX3BsYXllci5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZnVuY3Rpb24gcGFyc2VOcHQodGltZSkge1xuICBpZiAodHlwZW9mIHRpbWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gdGltZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdGltZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiB0aW1lLnNwbGl0KFwiOlwiKS5yZXZlcnNlKCkubWFwKHBhcnNlRmxvYXQpLnJlZHVjZSgoc3VtLCBuLCBpKSA9PiBzdW0gKyBuICogTWF0aC5wb3coNjAsIGkpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5mdW5jdGlvbiBkZWJvdW5jZShmLCBkZWxheSkge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiBmLmFwcGx5KHRoaXMsIGFyZ3MpLCBkZWxheSk7XG4gIH07XG59XG5mdW5jdGlvbiB0aHJvdHRsZShmLCBpbnRlcnZhbCkge1xuICBsZXQgZW5hYmxlQ2FsbCA9IHRydWU7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFlbmFibGVDYWxsKSByZXR1cm47XG4gICAgZW5hYmxlQ2FsbCA9IGZhbHNlO1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cbiAgICBmLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gZW5hYmxlQ2FsbCA9IHRydWUsIGludGVydmFsKTtcbiAgfTtcbn1cblxuY29uc3QgRlVMTF9IRVhfQ09MT1JfUkVHRVggPSAvXiNbMC05YS1mXXs2fSQvO1xuY29uc3QgU0hPUlRfSEVYX0NPTE9SX1JFR0VYID0gL14jWzAtOWEtZl17M30kLztcbmZ1bmN0aW9uIG5vcm1hbGl6ZUhleENvbG9yKGNvbG9yKSB7XG4gIGxldCBmYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICBpZiAodHlwZW9mIGNvbG9yICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsbGJhY2s7XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBjb2xvci50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKEZVTExfSEVYX0NPTE9SX1JFR0VYLnRlc3Qobm9ybWFsaXplZCkpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgfVxuICBpZiAoU0hPUlRfSEVYX0NPTE9SX1JFR0VYLnRlc3Qobm9ybWFsaXplZCkpIHtcbiAgICByZXR1cm4gYCMke25vcm1hbGl6ZWRbMV19JHtub3JtYWxpemVkWzFdfSR7bm9ybWFsaXplZFsyXX0ke25vcm1hbGl6ZWRbMl19JHtub3JtYWxpemVkWzNdfSR7bm9ybWFsaXplZFszXX1gO1xuICB9XG4gIHJldHVybiBmYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGxlcnBPa2xhYih0LCBjMSwgYzIpIHtcbiAgcmV0dXJuIFtjMVswXSArIHQgKiAoYzJbMF0gLSBjMVswXSksIGMxWzFdICsgdCAqIChjMlsxXSAtIGMxWzFdKSwgYzFbMl0gKyB0ICogKGMyWzJdIC0gYzFbMl0pXTtcbn1cbmZ1bmN0aW9uIGhleFRvT2tsYWIoaGV4KSB7XG4gIGNvbnN0IFtyLCBnLCBiXSA9IGhleFRvU3JnYihoZXgpLm1hcChzcmdiVG9MaW5lYXIpO1xuICBjb25zdCBsID0gMC40MTIyMjE0NzA4ICogciArIDAuNTM2MzMyNTM2MyAqIGcgKyAwLjA1MTQ0NTk5MjkgKiBiO1xuICBjb25zdCBtID0gMC4yMTE5MDM0OTgyICogciArIDAuNjgwNjk5NTQ1MSAqIGcgKyAwLjEwNzM5Njk1NjYgKiBiO1xuICBjb25zdCBzID0gMC4wODgzMDI0NjE5ICogciArIDAuMjgxNzE4ODM3NiAqIGcgKyAwLjYyOTk3ODcwMDUgKiBiO1xuICBjb25zdCBsXyA9IE1hdGguY2JydChsKTtcbiAgY29uc3QgbV8gPSBNYXRoLmNicnQobSk7XG4gIGNvbnN0IHNfID0gTWF0aC5jYnJ0KHMpO1xuICByZXR1cm4gWzAuMjEwNDU0MjU1MyAqIGxfICsgMC43OTM2MTc3ODUgKiBtXyAtIDAuMDA0MDcyMDQ2OCAqIHNfLCAxLjk3Nzk5ODQ5NTEgKiBsXyAtIDIuNDI4NTkyMjA1ICogbV8gKyAwLjQ1MDU5MzcwOTkgKiBzXywgMC4wMjU5MDQwMzcxICogbF8gKyAwLjc4Mjc3MTc2NjIgKiBtXyAtIDAuODA4Njc1NzY2ICogc19dO1xufVxuZnVuY3Rpb24gb2tsYWJUb0hleChsYWIpIHtcbiAgY29uc3QgcmdiID0gb2tsYWJUb1NyZ2IobGFiKTtcbiAgaWYgKGlzU3JnYkluR2FtdXQocmdiKSkgcmV0dXJuIHNyZ2JUb0hleChyZ2IpO1xuICBjb25zdCBbTCwgQywgaF0gPSBva2xhYlRvT2tsY2gobGFiKTtcbiAgbGV0IGxvdyA9IDA7XG4gIGxldCBoaWdoID0gQztcbiAgbGV0IGJlc3QgPSBbTCwgMCwgaF07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkgKz0gMSkge1xuICAgIGNvbnN0IG1pZCA9IChsb3cgKyBoaWdoKSAvIDI7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gW0wsIG1pZCwgaF07XG4gICAgY29uc3QgY2FuZGlkYXRlUmdiID0gb2tsYWJUb1NyZ2Iob2tsY2hUb09rbGFiKGNhbmRpZGF0ZSkpO1xuICAgIGlmIChpc1NyZ2JJbkdhbXV0KGNhbmRpZGF0ZVJnYikpIHtcbiAgICAgIGxvdyA9IG1pZDtcbiAgICAgIGJlc3QgPSBjYW5kaWRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBzcmdiVG9IZXgob2tsYWJUb1NyZ2Iob2tsY2hUb09rbGFiKGJlc3QpKSk7XG59XG5mdW5jdGlvbiBva2xhYlRvU3JnYihsYWIpIHtcbiAgY29uc3QgTCA9IGNsYW1wKGxhYlswXSwgMCwgMSk7XG4gIGNvbnN0IGEgPSBsYWJbMV07XG4gIGNvbnN0IGIgPSBsYWJbMl07XG4gIGNvbnN0IGxfID0gTCArIDAuMzk2MzM3Nzc3NCAqIGEgKyAwLjIxNTgwMzc1NzMgKiBiO1xuICBjb25zdCBtXyA9IEwgLSAwLjEwNTU2MTM0NTggKiBhIC0gMC4wNjM4NTQxNzI4ICogYjtcbiAgY29uc3Qgc18gPSBMIC0gMC4wODk0ODQxNzc1ICogYSAtIDEuMjkxNDg1NTQ4ICogYjtcbiAgY29uc3QgbCA9IGxfICoqIDM7XG4gIGNvbnN0IG0gPSBtXyAqKiAzO1xuICBjb25zdCBzID0gc18gKiogMztcbiAgY29uc3QgciA9IDQuMDc2NzQxNjYyMSAqIGwgLSAzLjMwNzcxMTU5MTMgKiBtICsgMC4yMzA5Njk5MjkyICogcztcbiAgY29uc3QgZyA9IC0xLjI2ODQzODAwNDYgKiBsICsgMi42MDk3NTc0MDExICogbSAtIDAuMzQxMzE5Mzk2NSAqIHM7XG4gIGNvbnN0IGJsdWUgPSAtMC4wMDQxOTYwODYzICogbCAtIDAuNzAzNDE4NjE0NyAqIG0gKyAxLjcwNzYxNDcwMSAqIHM7XG4gIHJldHVybiBbbGluZWFyVG9TcmdiKHIpLCBsaW5lYXJUb1NyZ2IoZyksIGxpbmVhclRvU3JnYihibHVlKV07XG59XG5mdW5jdGlvbiBva2xhYlRvT2tsY2goX3JlZikge1xuICBsZXQgW0wsIGEsIGJdID0gX3JlZjtcbiAgcmV0dXJuIFtMLCBNYXRoLmh5cG90KGEsIGIpLCBNYXRoLmF0YW4yKGIsIGEpXTtcbn1cbmZ1bmN0aW9uIG9rbGNoVG9Pa2xhYihfcmVmMikge1xuICBsZXQgW0wsIEMsIGhdID0gX3JlZjI7XG4gIHJldHVybiBbTCwgQyAqIE1hdGguY29zKGgpLCBDICogTWF0aC5zaW4oaCldO1xufVxuZnVuY3Rpb24gaGV4VG9TcmdiKGhleCkge1xuICByZXR1cm4gW051bWJlci5wYXJzZUludChoZXguc2xpY2UoMSwgMyksIDE2KSAvIDI1NSwgTnVtYmVyLnBhcnNlSW50KGhleC5zbGljZSgzLCA1KSwgMTYpIC8gMjU1LCBOdW1iZXIucGFyc2VJbnQoaGV4LnNsaWNlKDUsIDcpLCAxNikgLyAyNTVdO1xufVxuZnVuY3Rpb24gc3JnYlRvSGV4KHJnYikge1xuICBjb25zdCB0b0hleCA9IHZhbHVlID0+IHtcbiAgICBjb25zdCBieXRlID0gTWF0aC5yb3VuZChjbGFtcCh2YWx1ZSwgMCwgMSkgKiAyNTUpO1xuICAgIHJldHVybiBieXRlLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIik7XG4gIH07XG4gIHJldHVybiBgIyR7dG9IZXgocmdiWzBdKX0ke3RvSGV4KHJnYlsxXSl9JHt0b0hleChyZ2JbMl0pfWA7XG59XG5mdW5jdGlvbiBzcmdiVG9MaW5lYXIoYykge1xuICBpZiAoYyA8PSAwLjA0MDQ1KSByZXR1cm4gYyAvIDEyLjkyO1xuICByZXR1cm4gKChjICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNDtcbn1cbmZ1bmN0aW9uIGxpbmVhclRvU3JnYihjKSB7XG4gIGlmIChjIDw9IDAuMDAzMTMwOCkgcmV0dXJuIGMgKiAxMi45MjtcbiAgcmV0dXJuIDEuMDU1ICogYyAqKiAoMSAvIDIuNCkgLSAwLjA1NTtcbn1cbmZ1bmN0aW9uIGlzU3JnYkluR2FtdXQoX3JlZjMpIHtcbiAgbGV0IFtyLCBnLCBiXSA9IF9yZWYzO1xuICByZXR1cm4gciA+PSAwICYmIHIgPD0gMSAmJiBnID49IDAgJiYgZyA8PSAxICYmIGIgPj0gMCAmJiBiIDw9IDE7XG59XG5mdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2YWx1ZSkpO1xufVxuXG5jbGFzcyBEdW1teUxvZ2dlciB7XG4gIGxvZygpIHt9XG4gIGRlYnVnKCkge31cbiAgaW5mbygpIHt9XG4gIHdhcm4oKSB7fVxuICBlcnJvcigpIHt9XG59XG5jbGFzcyBQcmVmaXhlZExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yKGxvZ2dlciwgcHJlZml4KSB7XG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gIH1cbiAgbG9nKG1lc3NhZ2UpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIubG9nKGAke3RoaXMucHJlZml4fSR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfVxuICBkZWJ1ZyhtZXNzYWdlKSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKGAke3RoaXMucHJlZml4fSR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfVxuICBpbmZvKG1lc3NhZ2UpIHtcbiAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIuaW5mbyhgJHt0aGlzLnByZWZpeH0ke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gIH1cbiAgd2FybihtZXNzYWdlKSB7XG4gICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyLndhcm4oYCR7dGhpcy5wcmVmaXh9JHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9XG4gIGVycm9yKG1lc3NhZ2UpIHtcbiAgICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjUgPiAxID8gX2xlbjUgLSAxIDogMCksIF9rZXk1ID0gMTsgX2tleTUgPCBfbGVuNTsgX2tleTUrKykge1xuICAgICAgYXJnc1tfa2V5NSAtIDFdID0gYXJndW1lbnRzW19rZXk1XTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoYCR7dGhpcy5wcmVmaXh9JHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9XG59XG5cbmV4cG9ydCB7IER1bW15TG9nZ2VyIGFzIEQsIFByZWZpeGVkTG9nZ2VyIGFzIFAsIGRlYm91bmNlIGFzIGQsIGhleFRvT2tsYWIgYXMgaCwgbGVycE9rbGFiIGFzIGwsIG5vcm1hbGl6ZUhleENvbG9yIGFzIG4sIG9rbGFiVG9IZXggYXMgbywgcGFyc2VOcHQgYXMgcCwgdGhyb3R0bGUgYXMgdCB9O1xuIiwgImltcG9ydCB7IG4gYXMgbm9ybWFsaXplSGV4Q29sb3IsIFAgYXMgUHJlZml4ZWRMb2dnZXIsIHAgYXMgcGFyc2VOcHQgfSBmcm9tICcuL2xvZ2dpbmctLVAwQ3NFdV8uanMnO1xuXG5sZXQgd2FzbTtcbmZ1bmN0aW9uIGFkZEhlYXBPYmplY3Qob2JqKSB7XG4gIGlmIChoZWFwX25leHQgPT09IGhlYXAubGVuZ3RoKSBoZWFwLnB1c2goaGVhcC5sZW5ndGggKyAxKTtcbiAgY29uc3QgaWR4ID0gaGVhcF9uZXh0O1xuICBoZWFwX25leHQgPSBoZWFwW2lkeF07XG4gIGhlYXBbaWR4XSA9IG9iajtcbiAgcmV0dXJuIGlkeDtcbn1cbmZ1bmN0aW9uIGRlYnVnU3RyaW5nKHZhbCkge1xuICAvLyBwcmltaXRpdmUgdHlwZXNcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8IHZhbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGAke3ZhbH1gO1xuICB9XG4gIGlmICh0eXBlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGBcIiR7dmFsfVwiYDtcbiAgfVxuICBpZiAodHlwZSA9PSAnc3ltYm9sJykge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdmFsLmRlc2NyaXB0aW9uO1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJ1N5bWJvbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgU3ltYm9sKCR7ZGVzY3JpcHRpb259KWA7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBuYW1lID0gdmFsLm5hbWU7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnICYmIG5hbWUubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGBGdW5jdGlvbigke25hbWV9KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnRnVuY3Rpb24nO1xuICAgIH1cbiAgfVxuICAvLyBvYmplY3RzXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICBjb25zdCBsZW5ndGggPSB2YWwubGVuZ3RoO1xuICAgIGxldCBkZWJ1ZyA9ICdbJztcbiAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgZGVidWcgKz0gZGVidWdTdHJpbmcodmFsWzBdKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgZGVidWcgKz0gJywgJyArIGRlYnVnU3RyaW5nKHZhbFtpXSk7XG4gICAgfVxuICAgIGRlYnVnICs9ICddJztcbiAgICByZXR1cm4gZGVidWc7XG4gIH1cbiAgLy8gVGVzdCBmb3IgYnVpbHQtaW5cbiAgY29uc3QgYnVpbHRJbk1hdGNoZXMgPSAvXFxbb2JqZWN0IChbXlxcXV0rKVxcXS8uZXhlYyh0b1N0cmluZy5jYWxsKHZhbCkpO1xuICBsZXQgY2xhc3NOYW1lO1xuICBpZiAoYnVpbHRJbk1hdGNoZXMgJiYgYnVpbHRJbk1hdGNoZXMubGVuZ3RoID4gMSkge1xuICAgIGNsYXNzTmFtZSA9IGJ1aWx0SW5NYXRjaGVzWzFdO1xuICB9IGVsc2Uge1xuICAgIC8vIEZhaWxlZCB0byBtYXRjaCB0aGUgc3RhbmRhcmQgJ1tvYmplY3QgQ2xhc3NOYW1lXSdcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpO1xuICB9XG4gIGlmIChjbGFzc05hbWUgPT0gJ09iamVjdCcpIHtcbiAgICAvLyB3ZSdyZSBhIHVzZXIgZGVmaW5lZCBjbGFzcyBvciBPYmplY3RcbiAgICAvLyBKU09OLnN0cmluZ2lmeSBhdm9pZHMgcHJvYmxlbXMgd2l0aCBjeWNsZXMsIGFuZCBpcyBnZW5lcmFsbHkgbXVjaFxuICAgIC8vIGVhc2llciB0aGFuIGxvb3BpbmcgdGhyb3VnaCBvd25Qcm9wZXJ0aWVzIG9mIGB2YWxgLlxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gJ09iamVjdCgnICsgSlNPTi5zdHJpbmdpZnkodmFsKSArICcpJztcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICByZXR1cm4gJ09iamVjdCc7XG4gICAgfVxuICB9XG4gIC8vIGVycm9yc1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gYCR7dmFsLm5hbWV9OiAke3ZhbC5tZXNzYWdlfVxcbiR7dmFsLnN0YWNrfWA7XG4gIH1cbiAgLy8gVE9ETyB3ZSBjb3VsZCB0ZXN0IGZvciBtb3JlIHRoaW5ncyBoZXJlLCBsaWtlIGBTZXRgcyBhbmQgYE1hcGBzLlxuICByZXR1cm4gY2xhc3NOYW1lO1xufVxuZnVuY3Rpb24gZHJvcE9iamVjdChpZHgpIHtcbiAgaWYgKGlkeCA8IDEzMikgcmV0dXJuO1xuICBoZWFwW2lkeF0gPSBoZWFwX25leHQ7XG4gIGhlYXBfbmV4dCA9IGlkeDtcbn1cbmZ1bmN0aW9uIGdldEFycmF5VTMyRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gIHB0ciA9IHB0ciA+Pj4gMDtcbiAgcmV0dXJuIGdldFVpbnQzMkFycmF5TWVtb3J5MCgpLnN1YmFycmF5KHB0ciAvIDQsIHB0ciAvIDQgKyBsZW4pO1xufVxubGV0IGNhY2hlZERhdGFWaWV3TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXREYXRhVmlld01lbW9yeTAoKSB7XG4gIGlmIChjYWNoZWREYXRhVmlld01lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVkRGF0YVZpZXdNZW1vcnkwLmJ1ZmZlci5kZXRhY2hlZCA9PT0gdHJ1ZSB8fCBjYWNoZWREYXRhVmlld01lbW9yeTAuYnVmZmVyLmRldGFjaGVkID09PSB1bmRlZmluZWQgJiYgY2FjaGVkRGF0YVZpZXdNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgY2FjaGVkRGF0YVZpZXdNZW1vcnkwID0gbmV3IERhdGFWaWV3KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZERhdGFWaWV3TWVtb3J5MDtcbn1cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICBwdHIgPSBwdHIgPj4+IDA7XG4gIHJldHVybiBkZWNvZGVUZXh0KHB0ciwgbGVuKTtcbn1cbmxldCBjYWNoZWRVaW50MzJBcnJheU1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDMyQXJyYXlNZW1vcnkwKCkge1xuICBpZiAoY2FjaGVkVWludDMyQXJyYXlNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZFVpbnQzMkFycmF5TWVtb3J5MC5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgY2FjaGVkVWludDMyQXJyYXlNZW1vcnkwID0gbmV3IFVpbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZFVpbnQzMkFycmF5TWVtb3J5MDtcbn1cbmxldCBjYWNoZWRVaW50OEFycmF5TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRVaW50OEFycmF5TWVtb3J5MCgpIHtcbiAgaWYgKGNhY2hlZFVpbnQ4QXJyYXlNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZFVpbnQ4QXJyYXlNZW1vcnkwLmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICBjYWNoZWRVaW50OEFycmF5TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZFVpbnQ4QXJyYXlNZW1vcnkwO1xufVxuZnVuY3Rpb24gZ2V0T2JqZWN0KGlkeCkge1xuICByZXR1cm4gaGVhcFtpZHhdO1xufVxubGV0IGhlYXAgPSBuZXcgQXJyYXkoMTI4KS5maWxsKHVuZGVmaW5lZCk7XG5oZWFwLnB1c2godW5kZWZpbmVkLCBudWxsLCB0cnVlLCBmYWxzZSk7XG5sZXQgaGVhcF9uZXh0ID0gaGVhcC5sZW5ndGg7XG5mdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykge1xuICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgY29uc3QgcHRyID0gbWFsbG9jKGJ1Zi5sZW5ndGgsIDEpID4+PiAwO1xuICAgIGdldFVpbnQ4QXJyYXlNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBidWYubGVuZ3RoO1xuICAgIHJldHVybiBwdHI7XG4gIH1cbiAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gIGxldCBwdHIgPSBtYWxsb2MobGVuLCAxKSA+Pj4gMDtcbiAgY29uc3QgbWVtID0gZ2V0VWludDhBcnJheU1lbW9yeTAoKTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGZvciAoOyBvZmZzZXQgPCBsZW47IG9mZnNldCsrKSB7XG4gICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgaWYgKGNvZGUgPiAweDdGKSBicmVhaztcbiAgICBtZW1bcHRyICsgb2Zmc2V0XSA9IGNvZGU7XG4gIH1cbiAgaWYgKG9mZnNldCAhPT0gbGVuKSB7XG4gICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgfVxuICAgIHB0ciA9IHJlYWxsb2MocHRyLCBsZW4sIGxlbiA9IG9mZnNldCArIGFyZy5sZW5ndGggKiAzLCAxKSA+Pj4gMDtcbiAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhBcnJheU1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7XG4gICAgY29uc3QgcmV0ID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xuICAgIG9mZnNldCArPSByZXQud3JpdHRlbjtcbiAgICBwdHIgPSByZWFsbG9jKHB0ciwgbGVuLCBvZmZzZXQsIDEpID4+PiAwO1xuICB9XG4gIFdBU01fVkVDVE9SX0xFTiA9IG9mZnNldDtcbiAgcmV0dXJuIHB0cjtcbn1cbmZ1bmN0aW9uIHRha2VPYmplY3QoaWR4KSB7XG4gIGNvbnN0IHJldCA9IGdldE9iamVjdChpZHgpO1xuICBkcm9wT2JqZWN0KGlkeCk7XG4gIHJldHVybiByZXQ7XG59XG5sZXQgY2FjaGVkVGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04Jywge1xuICBpZ25vcmVCT006IHRydWUsXG4gIGZhdGFsOiB0cnVlXG59KTtcbmNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuY29uc3QgTUFYX1NBRkFSSV9ERUNPREVfQllURVMgPSAyMTQ2NDM1MDcyO1xubGV0IG51bUJ5dGVzRGVjb2RlZCA9IDA7XG5mdW5jdGlvbiBkZWNvZGVUZXh0KHB0ciwgbGVuKSB7XG4gIG51bUJ5dGVzRGVjb2RlZCArPSBsZW47XG4gIGlmIChudW1CeXRlc0RlY29kZWQgPj0gTUFYX1NBRkFSSV9ERUNPREVfQllURVMpIHtcbiAgICBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7XG4gICAgICBpZ25vcmVCT006IHRydWUsXG4gICAgICBmYXRhbDogdHJ1ZVxuICAgIH0pO1xuICAgIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZSgpO1xuICAgIG51bUJ5dGVzRGVjb2RlZCA9IGxlbjtcbiAgfVxuICByZXR1cm4gY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKGdldFVpbnQ4QXJyYXlNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cbmNvbnN0IGNhY2hlZFRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG5pZiAoISgnZW5jb2RlSW50bycgaW4gY2FjaGVkVGV4dEVuY29kZXIpKSB7XG4gIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPSBmdW5jdGlvbiAoYXJnLCB2aWV3KSB7XG4gICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgdmlldy5zZXQoYnVmKTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgIHdyaXR0ZW46IGJ1Zi5sZW5ndGhcbiAgICB9O1xuICB9O1xufVxubGV0IFdBU01fVkVDVE9SX0xFTiA9IDA7XG5jb25zdCBWdEZpbmFsaXphdGlvbiA9IHR5cGVvZiBGaW5hbGl6YXRpb25SZWdpc3RyeSA9PT0gJ3VuZGVmaW5lZCcgPyB7XG4gIHJlZ2lzdGVyOiAoKSA9PiB7fSxcbiAgdW5yZWdpc3RlcjogKCkgPT4ge31cbn0gOiBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkocHRyID0+IHdhc20uX193YmdfdnRfZnJlZShwdHIgPj4+IDAsIDEpKTtcbmNsYXNzIFZ0IHtcbiAgc3RhdGljIF9fd3JhcChwdHIpIHtcbiAgICBwdHIgPSBwdHIgPj4+IDA7XG4gICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShWdC5wcm90b3R5cGUpO1xuICAgIG9iai5fX3diZ19wdHIgPSBwdHI7XG4gICAgVnRGaW5hbGl6YXRpb24ucmVnaXN0ZXIob2JqLCBvYmouX193YmdfcHRyLCBvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgX19kZXN0cm95X2ludG9fcmF3KCkge1xuICAgIGNvbnN0IHB0ciA9IHRoaXMuX193YmdfcHRyO1xuICAgIHRoaXMuX193YmdfcHRyID0gMDtcbiAgICBWdEZpbmFsaXphdGlvbi51bnJlZ2lzdGVyKHRoaXMpO1xuICAgIHJldHVybiBwdHI7XG4gIH1cbiAgZnJlZSgpIHtcbiAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpO1xuICAgIHdhc20uX193YmdfdnRfZnJlZShwdHIsIDApO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc1xuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cbiAgZmVlZChzKSB7XG4gICAgY29uc3QgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHMsIHdhc20uX193YmluZGdlbl9leHBvcnQsIHdhc20uX193YmluZGdlbl9leHBvcnQyKTtcbiAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIGNvbnN0IHJldCA9IHdhc20udnRfZmVlZCh0aGlzLl9fd2JnX3B0ciwgcHRyMCwgbGVuMCk7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJvd3NcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG4gIHJlc2l6ZShjb2xzLCByb3dzKSB7XG4gICAgY29uc3QgcmV0ID0gd2FzbS52dF9yZXNpemUodGhpcy5fX3diZ19wdHIsIGNvbHMsIHJvd3MpO1xuICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7XG4gIH1cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtVaW50MzJBcnJheX1cbiAgICovXG4gIGdldFNpemUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgd2FzbS52dF9nZXRTaXplKHJldHB0ciwgdGhpcy5fX3diZ19wdHIpO1xuICAgICAgdmFyIHIwID0gZ2V0RGF0YVZpZXdNZW1vcnkwKCkuZ2V0SW50MzIocmV0cHRyICsgNCAqIDAsIHRydWUpO1xuICAgICAgdmFyIHIxID0gZ2V0RGF0YVZpZXdNZW1vcnkwKCkuZ2V0SW50MzIocmV0cHRyICsgNCAqIDEsIHRydWUpO1xuICAgICAgdmFyIHYxID0gZ2V0QXJyYXlVMzJGcm9tV2FzbTAocjAsIHIxKS5zbGljZSgpO1xuICAgICAgd2FzbS5fX3diaW5kZ2VuX2V4cG9ydDMocjAsIHIxICogNCwgNCk7XG4gICAgICByZXR1cm4gdjE7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcm93XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY3Vyc29yX29uXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuICBnZXRMaW5lKHJvdywgY3Vyc29yX29uKSB7XG4gICAgY29uc3QgcmV0ID0gd2FzbS52dF9nZXRMaW5lKHRoaXMuX193YmdfcHRyLCByb3csIGN1cnNvcl9vbik7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgfVxuICAvKipcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG4gIGdldEN1cnNvcigpIHtcbiAgICBjb25zdCByZXQgPSB3YXNtLnZ0X2dldEN1cnNvcih0aGlzLl9fd2JnX3B0cik7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgfVxufVxuaWYgKFN5bWJvbC5kaXNwb3NlKSBWdC5wcm90b3R5cGVbU3ltYm9sLmRpc3Bvc2VdID0gVnQucHJvdG90eXBlLmZyZWU7XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvbHNcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dzXG4gKiBAcGFyYW0ge251bWJlcn0gc2Nyb2xsYmFja19saW1pdFxuICogQHBhcmFtIHtib29sZWFufSBib2xkX2lzX2JyaWdodFxuICogQHJldHVybnMge1Z0fVxuICovXG5mdW5jdGlvbiBjcmVhdGUoY29scywgcm93cywgc2Nyb2xsYmFja19saW1pdCwgYm9sZF9pc19icmlnaHQpIHtcbiAgY29uc3QgcmV0ID0gd2FzbS5jcmVhdGUoY29scywgcm93cywgc2Nyb2xsYmFja19saW1pdCwgYm9sZF9pc19icmlnaHQpO1xuICByZXR1cm4gVnQuX193cmFwKHJldCk7XG59XG5jb25zdCBFWFBFQ1RFRF9SRVNQT05TRV9UWVBFUyA9IG5ldyBTZXQoWydiYXNpYycsICdjb3JzJywgJ2RlZmF1bHQnXSk7XG5hc3luYyBmdW5jdGlvbiBfX3diZ19sb2FkKG1vZHVsZSwgaW1wb3J0cykge1xuICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgaWYgKHR5cGVvZiBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZVN0cmVhbWluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnN0IHZhbGlkUmVzcG9uc2UgPSBtb2R1bGUub2sgJiYgRVhQRUNURURfUkVTUE9OU0VfVFlQRVMuaGFzKG1vZHVsZS50eXBlKTtcbiAgICAgICAgaWYgKHZhbGlkUmVzcG9uc2UgJiYgbW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPT0gJ2FwcGxpY2F0aW9uL3dhc20nKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSBXYXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBieXRlcyA9IGF3YWl0IG1vZHVsZS5hcnJheUJ1ZmZlcigpO1xuICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShtb2R1bGUsIGltcG9ydHMpO1xuICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFdlYkFzc2VtYmx5Lkluc3RhbmNlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgbW9kdWxlXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBfX3diZ19nZXRfaW1wb3J0cygpIHtcbiAgY29uc3QgaW1wb3J0cyA9IHt9O1xuICBpbXBvcnRzLndiZyA9IHt9O1xuICBpbXBvcnRzLndiZy5fX3diZ19fX3diaW5kZ2VuX2RlYnVnX3N0cmluZ19hZGZiNjYyYWUzNDcyNGI2ID0gZnVuY3Rpb24gKGFyZzAsIGFyZzEpIHtcbiAgICBjb25zdCByZXQgPSBkZWJ1Z1N0cmluZyhnZXRPYmplY3QoYXJnMSkpO1xuICAgIGNvbnN0IHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9leHBvcnQsIHdhc20uX193YmluZGdlbl9leHBvcnQyKTtcbiAgICBjb25zdCBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgIGdldERhdGFWaWV3TWVtb3J5MCgpLnNldEludDMyKGFyZzAgKyA0ICogMSwgbGVuMSwgdHJ1ZSk7XG4gICAgZ2V0RGF0YVZpZXdNZW1vcnkwKCkuc2V0SW50MzIoYXJnMCArIDQgKiAwLCBwdHIxLCB0cnVlKTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmdfX193YmluZGdlbl90aHJvd19kZDI0NDE3ZWQzNmZjNDZlID0gZnVuY3Rpb24gKGFyZzAsIGFyZzEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmdfbmV3XzEzMzE3ZWQxNjE4OTE1OGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IEFycmF5KCk7XG4gICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmdfbmV3XzRjZWI2YTc2NmJmNzhiMDQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IE9iamVjdCgpO1xuICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gIH07XG4gIGltcG9ydHMud2JnLl9fd2JnX3NldF8zZjFkMGI5ODRlZDI3MmVkID0gZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICBnZXRPYmplY3QoYXJnMClbdGFrZU9iamVjdChhcmcxKV0gPSB0YWtlT2JqZWN0KGFyZzIpO1xuICB9O1xuICBpbXBvcnRzLndiZy5fX3diZ19zZXRfOGI2YTlhNjFlOThhODg4MSA9IGZ1bmN0aW9uIChhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgZ2V0T2JqZWN0KGFyZzApW2FyZzEgPj4+IDBdID0gdGFrZU9iamVjdChhcmcyKTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmluZGdlbl9jYXN0XzIyNDFiNmFmNGM0YjI5NDEgPSBmdW5jdGlvbiAoYXJnMCwgYXJnMSkge1xuICAgIC8vIENhc3QgaW50cmluc2ljIGZvciBgUmVmKFN0cmluZykgLT4gRXh0ZXJucmVmYC5cbiAgICBjb25zdCByZXQgPSBnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSk7XG4gICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmluZGdlbl9jYXN0XzQ2MjVjNTc3YWIyZWM5ZWUgPSBmdW5jdGlvbiAoYXJnMCkge1xuICAgIC8vIENhc3QgaW50cmluc2ljIGZvciBgVTY0IC0+IEV4dGVybnJlZmAuXG4gICAgY29uc3QgcmV0ID0gQmlnSW50LmFzVWludE4oNjQsIGFyZzApO1xuICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gIH07XG4gIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fY2FzdF9kNmNkMTliODE1NjBmZDZlID0gZnVuY3Rpb24gKGFyZzApIHtcbiAgICAvLyBDYXN0IGludHJpbnNpYyBmb3IgYEY2NCAtPiBFeHRlcm5yZWZgLlxuICAgIGNvbnN0IHJldCA9IGFyZzA7XG4gICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfY2xvbmVfcmVmID0gZnVuY3Rpb24gKGFyZzApIHtcbiAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCk7XG4gICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgfTtcbiAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYgPSBmdW5jdGlvbiAoYXJnMCkge1xuICAgIHRha2VPYmplY3QoYXJnMCk7XG4gIH07XG4gIHJldHVybiBpbXBvcnRzO1xufVxuZnVuY3Rpb24gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKSB7XG4gIHdhc20gPSBpbnN0YW5jZS5leHBvcnRzO1xuICBfX3diZ19pbml0Ll9fd2JpbmRnZW5fd2FzbV9tb2R1bGUgPSBtb2R1bGU7XG4gIGNhY2hlZERhdGFWaWV3TWVtb3J5MCA9IG51bGw7XG4gIGNhY2hlZFVpbnQzMkFycmF5TWVtb3J5MCA9IG51bGw7XG4gIGNhY2hlZFVpbnQ4QXJyYXlNZW1vcnkwID0gbnVsbDtcbiAgcmV0dXJuIHdhc207XG59XG5mdW5jdGlvbiBpbml0U3luYyhtb2R1bGUpIHtcbiAgaWYgKHdhc20gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdhc207XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YobW9kdWxlKSA9PT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgKHtcbiAgICAgICAgbW9kdWxlXG4gICAgICB9ID0gbW9kdWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCd1c2luZyBkZXByZWNhdGVkIHBhcmFtZXRlcnMgZm9yIGBpbml0U3luYygpYDsgcGFzcyBhIHNpbmdsZSBvYmplY3QgaW5zdGVhZCcpO1xuICAgIH1cbiAgfVxuICBjb25zdCBpbXBvcnRzID0gX193YmdfZ2V0X2ltcG9ydHMoKTtcbiAgaWYgKCEobW9kdWxlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuTW9kdWxlKSkge1xuICAgIG1vZHVsZSA9IG5ldyBXZWJBc3NlbWJseS5Nb2R1bGUobW9kdWxlKTtcbiAgfVxuICBjb25zdCBpbnN0YW5jZSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZShtb2R1bGUsIGltcG9ydHMpO1xuICByZXR1cm4gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIF9fd2JnX2luaXQobW9kdWxlX29yX3BhdGgpIHtcbiAgaWYgKHdhc20gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdhc207XG4gIGlmICh0eXBlb2YgbW9kdWxlX29yX3BhdGggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZihtb2R1bGVfb3JfcGF0aCkgPT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgICh7XG4gICAgICAgIG1vZHVsZV9vcl9wYXRoXG4gICAgICB9ID0gbW9kdWxlX29yX3BhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3VzaW5nIGRlcHJlY2F0ZWQgcGFyYW1ldGVycyBmb3IgdGhlIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uOyBwYXNzIGEgc2luZ2xlIG9iamVjdCBpbnN0ZWFkJyk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGltcG9ydHMgPSBfX3diZ19nZXRfaW1wb3J0cygpO1xuICBpZiAodHlwZW9mIG1vZHVsZV9vcl9wYXRoID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiBtb2R1bGVfb3JfcGF0aCBpbnN0YW5jZW9mIFJlcXVlc3QgfHwgdHlwZW9mIFVSTCA9PT0gJ2Z1bmN0aW9uJyAmJiBtb2R1bGVfb3JfcGF0aCBpbnN0YW5jZW9mIFVSTCkge1xuICAgIG1vZHVsZV9vcl9wYXRoID0gZmV0Y2gobW9kdWxlX29yX3BhdGgpO1xuICB9XG4gIGNvbnN0IHtcbiAgICBpbnN0YW5jZSxcbiAgICBtb2R1bGVcbiAgfSA9IGF3YWl0IF9fd2JnX2xvYWQoYXdhaXQgbW9kdWxlX29yX3BhdGgsIGltcG9ydHMpO1xuICByZXR1cm4gX193YmdfZmluYWxpemVfaW5pdChpbnN0YW5jZSwgbW9kdWxlKTtcbn1cblxudmFyIGV4cG9ydHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIFZ0OiBWdCxcbiAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICBkZWZhdWx0OiBfX3diZ19pbml0LFxuICAgIGluaXRTeW5jOiBpbml0U3luY1xufSk7XG5cbmNvbnN0IGJhc2U2NGNvZGVzID0gWzYyLDAsMCwwLDYzLDUyLDUzLDU0LDU1LDU2LDU3LDU4LDU5LDYwLDYxLDAsMCwwLDAsMCwwLDAsMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwyNSwwLDAsMCwwLDAsMCwyNiwyNywyOCwyOSwzMCwzMSwzMiwzMywzNCwzNSwzNiwzNywzOCwzOSw0MCw0MSw0Miw0Myw0NCw0NSw0Niw0Nyw0OCw0OSw1MCw1MV07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEJhc2U2NENvZGUoY2hhckNvZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZTY0Y29kZXNbY2hhckNvZGUgLSA0M107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGJhc2U2NERlY29kZShzdHIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbWlzc2luZ09jdGV0cyA9IHN0ci5lbmRzV2l0aChcIj09XCIpID8gMiA6IHN0ci5lbmRzV2l0aChcIj1cIikgPyAxIDogMDtcbiAgICAgICAgICAgICAgICBsZXQgbiA9IHN0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KDMgKiAobiAvIDQpKTtcbiAgICAgICAgICAgICAgICBsZXQgYnVmZmVyO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGogPSAwOyBpIDwgbjsgaSArPSA0LCBqICs9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdldEJhc2U2NENvZGUoc3RyLmNoYXJDb2RlQXQoaSkpIDw8IDE4IHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldEJhc2U2NENvZGUoc3RyLmNoYXJDb2RlQXQoaSArIDEpKSA8PCAxMiB8XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRCYXNlNjRDb2RlKHN0ci5jaGFyQ29kZUF0KGkgKyAyKSkgPDwgNiB8XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRCYXNlNjRDb2RlKHN0ci5jaGFyQ29kZUF0KGkgKyAzKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtqXSA9IGJ1ZmZlciA+PiAxNjtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ogKyAxXSA9IChidWZmZXIgPj4gOCkgJiAweEZGO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaiArIDJdID0gYnVmZmVyICYgMHhGRjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnN1YmFycmF5KDAsIHJlc3VsdC5sZW5ndGggLSBtaXNzaW5nT2N0ZXRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZ0V2FzbU1vZHVsZSA9IGJhc2U2NERlY29kZShcIkFHRnpiUUVBQUFBQm5BRVhZQUovZndCZ0EzOS9md0JnQW45L0FYOWdBMzkvZndGL1lBRi9BR0FCZndGL1lBUi9mMzkvQUdBRmYzOS9mMzhBWUFSL2YzOS9BWDlnQm45L2YzOS9md0JnQlg5L2YzOS9BWDlnQUFGL1lBWi9mMzkvZjM4QmYyQUJmQUYvWUFGK0FYOWdCMzkvZjM5L2YzOEFZQU4vZjM0QmYyQUVmMzkvZmdCZ0EzOStmd0JnQlg5L2ZIOS9BR0FGZjM5K2YzOEFZQVYvZjMxL2Z3QmdBQUFDb0FNTEEzZGlaeHBmWDNkaVoxOXVaWGRmTVRNek1UZGxaREUyTVRnNU1UVTRaUUFMQTNkaVp4cGZYM2RpWjE5elpYUmZPR0kyWVRsaE5qRmxPVGhoT0RnNE1RQUJBM2RpWnk1ZlgzZGlaMTlmWDNkaWFXNWtaMlZ1WDJSbFluVm5YM04wY21sdVoxOWhaR1ppTmpZeVlXVXpORGN5TkdJMkFBQURkMkpuR2w5ZmQySnBibVJuWlc1ZmIySnFaV04wWDJSeWIzQmZjbVZtQUFRRGQySm5HMTlmZDJKcGJtUm5aVzVmYjJKcVpXTjBYMk5zYjI1bFgzSmxaZ0FGQTNkaVp4cGZYM2RpWjE5elpYUmZNMll4WkRCaU9UZzBaV1F5TnpKbFpBQUJBM2RpWnhwZlgzZGlaMTl1WlhkZk5HTmxZalpoTnpZMlltWTNPR0l3TkFBTEEzZGlaeWRmWDNkaVoxOWZYM2RpYVc1a1oyVnVYM1JvY205M1gyUmtNalEwTVRkbFpETTJabU0wTm1VQUFBTjNZbWNnWDE5M1ltbHVaR2RsYmw5allYTjBYekl5TkRGaU5tRm1OR00wWWpJNU5ERUFBZ04zWW1jZ1gxOTNZbWx1WkdkbGJsOWpZWE4wWDJRMlkyUXhPV0k0TVRVMk1HWmtObVVBRFFOM1ltY2dYMTkzWW1sdVpHZGxibDlqWVhOMFh6UTJNalZqTlRjM1lXSXlaV001WldVQURnTzdBYmtCQXdBREFRTUFCQUVLQWdFREF3TUJDQThLQndNSkJ3QUpBUUFCQ1FjQkFRWUJCQUVHQlFJR0FBTUNBZ2NEQVFBQkNRWUdBQUVFQVFBQUVBSUdCQUFGQVFFQkFBVU1CUUlBQmdBQUFBRUVCUVVCQkFFQUFBY0FBd0VSQkFBSEFnQUJBQWtIQkFRQUFRQUFBQUFHQWdnQ0VnRUNCQWdIQVFjSUFBQUFBQUFCQkFBRUFRQUFBQWdCQ0F3SEV3b1VGUVVHQWdRREJBWUVCQUFBQWdJQkFRUUVCQUVDQWdBQUFBSUFBUUVCQkFVV0FBSUFCQUFBQkFJRkFnVUVCUUZ3QVNzckJRTUJBQkVHQ1FGL0FVR0FnTUFBQ3dmRkFRd0diV1Z0YjNKNUFnQU5YMTkzWW1kZmRuUmZabkpsWlFBK0JtTnlaV0YwWlFBYUIzWjBYMlpsWldRQUN3bDJkRjl5WlhOcGVtVUFNd3AyZEY5blpYUlRhWHBsQUdZS2RuUmZaMlYwVEdsdVpRQU5ESFowWDJkbGRFTjFjbk52Y2dBdkVWOWZkMkpwYm1SblpXNWZaWGh3YjNKMEFIY1NYMTkzWW1sdVpHZGxibDlsZUhCdmNuUXlBSUlCSDE5ZmQySnBibVJuWlc1ZllXUmtYM1J2WDNOMFlXTnJYM0J2YVc1MFpYSUF0d0VTWDE5M1ltbHVaR2RsYmw5bGVIQnZjblF6QUtjQkNVMEJBRUVCQ3lxdEFjRUJ3d0ZHd0FFOXdnRUpDZ2lsQWF3QnNRRVVsZ0dUQVR1VUFaWUJuUUdhQVpRQmxBR1lBWlVCbHdHK0Fic0J2QUV3dlFHdkFhUUJxd0cvQVhPUEFVVmRHR2k2QVF3QklBcUQxd0s1QWI4MUFSQi9Jd0JCb0FGcklnUWtBQ0FFUVRCcUlBQVFYaUFFS0FJd0lRTWdCRUVvYWlJQUlBSTJBZ1FnQUNBQk5nSUFJQU5CM0FCcUlRc2dBMEhRQUdvaERDQURRVEJxSVE4Z0EwRWthaUVRSUFOQkRHb2hFU0FEUWJJQmFpRUhJQU5CeEFGcUlRa2dCQ2dDS0NJTklBUW9BaXdpRG1vaEVpQU5JUUlEUUFKQUFrQUNRQUpBQWtBQ1FDQURBbjhDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFJQUlnRWtZTkFBSi9JQUlzQUFBaUFFRUFUZ1JBSUFCQi93RnhJUUFnQWtFQmFnd0JDeUFDTFFBQlFUOXhJUVVnQUVFZmNTRUJJQUJCWDAwRVFDQUJRUVowSUFWeUlRQWdBa0VDYWd3QkN5QUNMUUFDUVQ5eElBVkJCblJ5SVFVZ0FFRndTUVJBSUFVZ0FVRU1kSEloQUNBQ1FRTnFEQUVMSUFGQkVuUkJnSUR3QUhFZ0FpMEFBMEUvY1NBRlFRWjBjbklpQUVHQWdNUUFSZzBCSUFKQkJHb0xJUUpCd1FBZ0FDQUFRWjhCU3hzaEFRSkFBa0FDUUNBRExRRE1CU0lHRGdVQUJBUUVBUVFMSUFGQklHdEI0QUJKRFFFTUF3c2dBVUV3YTBFTVR3MENEQ0FMSUFRZ0FEWUNRQ0FFUVNFNkFEd01BZ3NnQkVId0FHb2lBU0FEUWVBQWFpZ0NBQ0FEUWVRQWFpZ0NBQkFqSUFSQkNHb2dBeEFrSUFRZ0JDa0RDRGNDZkNBRUlBUW9BblFnQkNnQ2VCQmJJQVFvQWdRaEFDQUVLQUlBUVFGeFJRUkFJQUVRYmlBT0JFQWdEVUVCSUE0UU9Bc2dCQ2dDTkNBRUtBSTRFTElCSUFSQm9BRnFKQUFnQUE4TElBUWdBRFlDVENBRVFjd0Fha0hjd3NBQUVFSUFDd0pBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQ0FCUWY4QmNTSUZRUnRIQkVBZ0JVSGJBRVlOQVNBR0RnMERCQVVHQnc0SURnNE9BZzRKRGdzZ0EwRUJPZ0RNQlNBSkVDd01WQXNnQmc0TkFTTURCQVVOQmcwTkRRQU5CdzBMSUFGQklHdEIzd0JKRFZJTUN3c0NRQ0FCUVJoSkRRQWdBVUVaUmcwQUlBRkIvQUZ4UVJ4SERRc0xJQVJCUEdvZ0FCQklERElMSUFGQjhBRnhRU0JHRFFZZ0FVRXdhMEVnU1EwSUlBRkIwUUJyUVFkSkRRZ0NRQ0FGUWRrQWF3NEZDUWtBQ1I4QUN5QUJRZUFBYTBFZlR3MEpEQWdMSUFGQk1HdEJ6d0JQRFFnZ0EwRUFPZ0RNQlNBRVFUeHFJQWtnQUJBdEREQUxJQUZCTDBzRVFDQUJRVHRISUFGQk9rOXhSUVJBSUFOQkJEb0F6QVVNVHdzZ0FVRkFha0UvU1EwRUN5QUJRZndCY1VFOFJ3MEhJQU1nQURZQ3hBRWdBMEVFT2dETUJReE9DeUFCUVVCcVFUOUpEUVFnQVVIOEFYRkJQRWNOQmd4TEN5QUJRVUJxUVQ5UERRVU1TUXNnQVVFZ2EwSGdBRWtOU3dKQUlBVkJHR3NPQXdjR0J3QUxJQVZCbVFGclFRSkpEUVlnQlVIUUFFWU5TeUFGUVFkR0RVZ01CUXNnQTBFQU9nRE1CU0FFUVR4cUlBa2dBQkFPRENzTElBTWdBRFlDeEFFZ0EwRUNPZ0RNQlF4SkN5QURRUUE2QU13RklBUkJQR29nQ1NBQUVBNE1LUXNnQTBFQU9nRE1CU0FFUVR4cUlBa2dBQkF0RENnTEFrQWdCVUVZYXc0REFnRUNBQXNnQlVHWkFXdEJBa2tOQVNBRlFkQUFSdzBBSUFaQkFXc09DaFVEQ0FrS0pBc01EUTVHQ3lBQlFmQUJjU0lJUVlBQlJnMEFJQUZCa1FGclFRWkxEUUVMSUFOQkFEb0F6QVVnQkVFOGFpQUFFRWdNSlFzZ0NFRWdSdzBCSUFaQkJFY05BUXcvQ3lBQlFmQUJjU0VJREFFTElBWkJBV3NPQ2dFQUF3UUZEZ1lIQ0FrT0N5QUlRU0JIRFFFTU93c2dBVUVZVHcwS0RBc0xBa0FnQVVFWVNRMEFJQUZCR1VZTkFDQUJRZndCY1VFY1J3ME1DeUFFUVR4cUlBQVFTQXdmQ3dKQUFrQWdBVUVZU1EwQUlBRkJHVVlOQUNBQlFmd0JjVUVjUncwQkN5QUVRVHhxSUFBUVNBd2ZDeUFCUWZBQmNVRWdSZzA1REFvTEFrQWdBVUVZU1EwQUlBRkJHVVlOQUNBQlFmd0JjVUVjUncwS0N5QUVRVHhxSUFBUVNBd2RDeUFCUVVCcVFUOVBCRUFnQVVId0FYRWlDRUVnUmcwM0lBaEJNRVlOT2d3SkN5QURRUUE2QU13RklBUkJQR29nQ1NBQUVBNE1IQXNnQVVIOEFYRkJQRVlOQXlBQlFmQUJjVUVnUmcwdklBRkJRR3BCUDA4TkJ3d0VDeUFCUVM5TkRRWWdBVUU2U1EwNElBRkJPMFlOT0NBQlFVQnFRVDVORFFNTUJnc2dBVUZBYWtFL1NRMENEQVVMSUFGQkdFa05OeUFCUVJsR0RUY2dBVUg4QVhGQkhFWU5Od3dFQ3lBRElBQTJBc1FCSUFOQkNEb0F6QVVNTmdzZ0EwRUtPZ0RNQlF3MUN5QUZRZGdBYXlJSVFRZE5RUUJCQVNBSWRFSEJBWEViRFFVZ0JVRVpSZzBBSUFGQi9BRnhRUnhIRFFFTElBUkJQR29nQUJCSURCUUxJQVZCa0FGckRoQUJCUVVGQlFVRkJRTUZCUUl2QUFNREJBc2dBMEVNT2dETUJRd3hDeUFEUVFjNkFNd0ZJQWtRTEF3d0N5QURRUU02QU13RklBa1FMQXd2Q3lBRFFRMDZBTXdGREM0TEFrQWdCVUU2YXc0Q0JBSUFDeUFGUVJsR0RRSUxJQVpCQTJzT0J3a3NBd29GQ3djc0N5QUdRUU5yRGdjSUt5c0pCUW9IS3dzZ0JrRURhdzRIQnlvQ0NDb0pCaW9MSUFaQkEyc09Cd1lwS1FjSkNBVXBDeUFCUVJoSkRRQWdBVUg4QVhGQkhFY05LQXNnQkVFOGFpQUFFRWdNQ0FzZ0FVRXdhMEVLVHcwbUN5QURRUWc2QU13RkRDUUxJQUZCOEFGeFFTQkdEUjhMSUFGQjhBRnhRVEJIRFNNTUF3c2dBVUU2UncwaURDQUxBa0FnQVVFWVNRMEFJQUZCR1VZTkFDQUJRZndCY1VFY1J3MGlDeUFFUVR4cUlBQVFTQXdDQ3lBQlFmQUJjVUVnUmcwVklBRkJPa1lOQUNBQlFmd0JjVUU4UncwZ0N5QURRUXM2QU13RkRCOExJQVF0QUR3aUFFRXlSZzBmQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUNBQVFRRnJEakVDQXdRRkJnY0lDUW9MREEwT0R5VVFKaEVTRXhRVkZoY1lHUm9iSEIwZUh3QWhJaU1rSlNZbktDa3FLeXd0TURFeUFRc2dCQ2dDUUNFQURCOExJQU5CZmtGL0lBTW9BbWdnQXlnQ25BRkdHeENGQVF3OUN5QUVMd0UrSVFBZ0JDQURLQUpvTmdKTUlBUkJBRG9BZkNBRUlBTkIxQUJxS0FJQUlnRTJBbkFnQkNBQklBTW9BbGhCQW5ScU5nSjBRUUVnQUNBQVFRRk5HeUVBSUFRZ0JFSE1BR28yQW5nRFFDQUFRUUZySWdBRVFDQUVRZkFBYWhCUURRRU1OZ3NMSUFSQjhBQnFFRkFpQUVVTk5DQUFLQUlBRERVTElBTkJBU0FFTHdFK0lnQWdBRUVCVFJ0QkFXc2lBQ0FES0FLY0FTSUJRUUZySUFBZ0FVa2JOZ0pvRERzTElBTkJBU0FFTHdFK0lnQWdBRUVCVFJzUU1ndzZDeUFEUVFFZ0JDOEJQaUlBSUFCQkFVMGJFRjhnQTBFQU5nSm9ERGtMSUFOQkFTQUVMd0UrSWdBZ0FFRUJUUnNRWVNBRFFRQTJBbWdNT0FzZ0EwRUFOZ0pvRERjTEFrQWdCQzBBUFVFQmF3NENKZ0FUQ3lBRFFRQTJBbGdNTmdzZ0EwRUJJQVF2QVQ0aUFDQUFRUUZOR3lJQVFYOXpRUUFnQUdzZ0F5Z0NhQ0FES0FLY0FVWWJFSVVCRERVTElBTkJBU0FFTHdFK0lnQWdBRUVCVFJzUVh3dzBDeUFEUVFFZ0JDOEJQaUlBSUFCQkFVMGJFSVVCRERNTElBTkJBU0FFTHdGQUlnQWdBRUVCVFJ0QkFXc2lBQ0FES0FLY0FTSUJRUUZySUFBZ0FVa2JOZ0pvSUFOQkFTQUVMd0UrSWdBZ0FFRUJUUnRCQVdzUVVnd3lDeUFEUVFFZ0JDOEJQaUlBSUFCQkFVMGJFR0VNTVFzZ0F5Z0NhQ0lBSUFNb0Fwd0JJZ0ZQQkVBZ0F5QUJRUUZySWdBMkFtZ0xRUUVnQkM4QlBpSUJJQUZCQVUwYklnRWdBeWdDR0NBQWF5SUZJQUVnQlVrYklRRWdBeUFES0FKc1FiRE53QUFRWWlJRktBSUVJQVVvQWdnZ0FFR28yY0FBRUpBQktBSUVSUVJBSUFVb0FnUWdCU2dDQ0NBQVFRRnJRYmpad0FBUWtBRWlCa0tnZ0lDQUVEY0NBQ0FHSUFjcEFRQTNBUWdnQmtFUWFpQUhRUWhxTHdFQU93RUFDeUFFUVJocUlBVW9BZ1FnQlNnQ0NDQUFRY2pad0FBUWZ5QUVLQUlZSUFRb0Fod2dBUkNJQVNBRktBSUVJQVVvQWdnZ0FFSFkyY0FBRUpBQklnQW9BZ1JGQkVBZ0FFS2dnSUNBRURjQ0FDQUFJQWNwQVFBM0FRZ2dBRUVRYWlBSFFRaHFMd0VBT3dFQUN5QUVRUkJxSUFVb0FnUWdCU2dDQ0NJQUlBQWdBV3RCNk5uQUFCQi9JQVFvQWhBaEFDQUVLQUlVSUFSQitBQnFJQWRCQ0dvdkFRQTdBUUFnQkNBSEtRRUFOd053UVJSc0lRRURRQ0FCQkVBZ0FFS2dnSUNBRURjQ0FDQUFJQVFwQTNBM0FnZ2dBRUVRYWlBRVFmZ0FhaThCQURzQkFDQUJRUlJySVFFZ0FFRVVhaUVBREFFTEN5QUZRUUE2QUF3Z0EwSGdBR29vQWdBZ0EwSGtBR29vQWdBZ0F5Z0NiQkNSQVF3d0N5QURLQUtjQVNFRklBTW9BcUFCSVFaQkFDRUJBMEFnQVNBR1JnMHdRUUFoQUFOQUlBQWdCVVlFUUNBRFFlQUFhaWdDQUNBRFFlUUFhaWdDQUNBQkVKRUJJQUZCQVdvaEFRd0NCU0FFUVFBN0FIZ2dCRUVDT2dCMElBUkJBam9BY0NBRElBQWdBVUhGQUNBRVFmQUFhaEFUR2lBQVFRRnFJUUFNQVFzQUN3QUxBQXNnQkNnQ1NDRUJJQVFvQWtRaEFDQUVJQVFvQWtBMkFuZ2dCQ0FBTmdKd0lBUWdBVUVCZENJQklBQnFJZ1UyQW53RFFDQUJCRUFDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUNBQUx3RUFJZ1pCQVdzT0J3RXhNVEV4QWdNQUN5QUdRWmNJYXc0REJBVUdBd3NnQTBFQU9nREJBUXdIQ3lBRFFnQTNBbWdnQTBFQU9nQytBUXdHQ3lBRFFRQTZBTDhCREFVTElBTkJBRG9BY0F3RUN5QURFRzhNQWdzZ0F4Q0pBUXdDQ3lBREVHOGdBeENKQVFzZ0F4QVJDeUFBUVFKcUlRQWdBVUVDYXlFQkRBRUxDeUFFSUFVMkFuUWdCRUh3QUdvUXFnRU1MZ3NnQkNnQ1NDRUJJQVFvQWtRaEFDQUVJQVFvQWtBMkFuZ2dCQ0FBTmdKd0lBUWdBVUVCZENJQklBQnFJZ1kyQW53RFFDQUJCRUFDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FnQUM4QkFDSUZRUUZyRGdjQkx5OHZMd0lEQUFzZ0JVR1hDR3NPQXdZRUJRTUxJQU5CQVRvQXdRRU1CZ3NnQTBFQk9nQytBU0FEUVFBMkFtZ2dBeUFES0FLb0FUWUNiQXdGQ3lBRFFRRTZBTDhCREFRTElBTkJBVG9BY0F3REN5QURFR1VNQWdzZ0F4QmxDeU1BUVRCcklnVWtBQ0FETFFDOEFVVUVRQ0FEUVFFNkFMd0JJQU5COUFCcUlBTkJpQUZxRUhRZ0F5QURRU1JxRUhVZ0JVRU1haUlJSUFNb0Fwd0JJQU1vQXFBQklncEJBVUVBSUFOQnNnRnFFQjhnQTBFTWFoQ2dBU0FESUFoQkpCQVdJZ2dvQW1BZ0NDZ0NaRUVBSUFvUVV3c2dCVUV3YWlRQUlBTVFFUXNnQUVFQ2FpRUFJQUZCQW1zaEFRd0JDd3NnQkNBR05nSjBJQVJCOEFCcUVLb0JEQzBMQWtCQkFTQUVMd0UrSWdBZ0FFRUJUUnRCQVdzaUFDQUVMd0ZBSWdFZ0F5Z0NvQUVpQlNBQkcwRUJheUlCU1NBQklBVkpjVVVFUUNBREtBS29BU0VBREFFTElBTWdBVFlDckFFZ0F5QUFOZ0tvQVFzZ0EwRUFOZ0pvSUFNZ0FFRUFJQU10QUw0Qkd6WUNiQXdzQ3lBRFFRRTZBSEFnQTBFQU93QzlBU0FEUVFBN0Fib0JJQU5CQWpvQXRnRWdBMEVDT2dDeUFTQURRUUE3QWJBQklBTkNBRGNDcEFFZ0EwR0FnSUFJTmdLRUFTQURRUUk2QUlBQklBTkJBam9BZkNBRFFnQTNBblFnQXlBREtBS2dBVUVCYXpZQ3JBRU1Ld3NnQXlnQ29BRWdBeWdDckFFaUFFRUJhaUFBSUFNb0Ftd2lBRWtiSVFFZ0F5QUFJQUZCQVNBRUx3RStJZ1VnQlVFQlRSc2dCeEFkSUFOQjRBQnFLQUlBSUFOQjVBQnFLQUlBSUFBZ0FSQlREQ29MSUFNZ0F5Z0NhQ0FES0FKc0lnQkJBRUVCSUFRdkFUNGlBU0FCUVFGTkd5QUhFQ0lnQTBIZ0FHb29BZ0FnQTBIa0FHb29BZ0FnQUJDUkFRd3BDd0pBQWtBQ1FDQUVMUUE5UVFGckRnTUJBaXNBQ3lBRElBTW9BbWdnQXlnQ2JDSUFRUUVnQkNBSEVDSWdBMEhnQUdvb0FnQWdBMEhrQUdvb0FnQWdBQ0FES0FLZ0FSQlREQ29MSUFNZ0F5Z0NhQ0FES0FKc0lnQkJBaUFFSUFjUUlpQURRZUFBYWlnQ0FDQURRZVFBYWlnQ0FFRUFJQUJCQVdvUVV3d3BDeUFEUVFBZ0F5Z0NIQ0FIRUNvZ0EwSGdBR29vQWdBZ0EwSGtBR29vQWdCQkFDQURLQUtnQVJCVERDZ0xJQU1nQXlnQ2FDQURLQUpzSWdBZ0JDMEFQVUVFY2lBRUlBY1FJaUFEUWVBQWFpZ0NBQ0FEUWVRQWFpZ0NBQ0FBRUpFQkRDY0xJQU1nQkMwQVBUb0FzUUVNSmdzZ0F5QUVMUUE5T2dDd0FRd2xDeUFEUVFFUU1nd2tDeU1BUVJCcklnVWtBQUpBQWtBQ1FDQURLQUpvSWdoRkRRQWdDQ0FES0FLY0FVOE5BQ0FGUVFocUlBTW9BbFFpQUNBREtBSllJZ0VnQ0JBOElBVW9BZ2hCQVVjTkFDQUZLQUlNSWdZZ0FVc05BU0FEUWRBQWFpSUtLQUlBSUFGR0JIOGdDa0c4NHNBQUVHc2dBeWdDVkFVZ0FBc2dCa0VDZEdvaEFDQUJJQVpMQkVBZ0FFRUVhaUFBSUFFZ0JtdEJBblFRRWdzZ0FDQUlOZ0lBSUFNZ0FVRUJhallDV0FzZ0JVRVFhaVFBREFFTElBWWdBVUc4NHNBQUVFd0FDd3dqQ3lBREtBSm9JZ0FnQXlnQ25BRWlCVVlFUUNBRElBQkJBV3NpQURZQ2FBc2dBeUFBSUFNb0Ftd2lBVUVCSUFRdkFUNGlCaUFHUVFGTkd5SUdJQVVnQUdzaUJTQUZJQVpMR3lJRklBY1FJQ0FBSUFBZ0JXb2lCU0FBSUFWTEd5RUZBMEFnQUNBRlJ3UkFJQU1nQUNBQlFTQWdCeEFUR2lBQVFRRnFJUUFNQVFzTElBTkI0QUJxS0FJQUlBTkI1QUJxS0FJQUlBRVFrUUVNSWdzZ0F5Z0NvQUVnQXlnQ3JBRWlBRUVCYWlBQUlBTW9BbXdpQUVrYklRRWdBeUFBSUFGQkFTQUVMd0UrSWdVZ0JVRUJUUnNnQnhBMklBTkI0QUJxS0FJQUlBTkI1QUJxS0FJQUlBQWdBUkJURENFTElBTVFYQ0FETFFEQUFVRUJSdzBnSUFOQkFEWUNhQXdnQ3lBREVGd2dBMEVBTmdKb0RCOExJQU1nQUJBaERCNExJQU1vQW1naUJVVU5IU0FFTHdFK0lRQWdBeWdDYkNFQklBUkJJR29nQXhCd0lBUW9BaVFpQmlBQlRRMFNRUUVnQUNBQVFRRk5HeUVBSUFRb0FpQWdBVUVFZEdvaUFVRUVhaWdDQUNBQlFRaHFLQUlBSUFWQkFXdEJ1T1hBQUJDUUFTZ0NBQ0VCQTBBZ0FFVU5IaUFESUFFUUlTQUFRUUZySVFBTUFBc0FDeUFES0FKc0lnQWdBeWdDcUFGR0RSSWdBRVVOSENBRElBQkJBV3NRVWd3Y0N5QUVRY3dBYWlJQUlBTW9BcHdCSWdVZ0F5Z0NvQUVpQVNBREtBSklJQU1vQWt4QkFCQWZJQVJCOEFCcUlnWWdCU0FCUVFGQkFFRUFFQjhnRVJDZ0FTQURJQUJCSkJBV0lRQWdEeENnQVNBUUlBWkJKQkFXR2lBQVFRQTZBTHdCSUFSQmxBRnFJZ1lnQlJBNUlBQW9BbEFnQUVIVUFHb29BZ0JCQkVFRUVKOEJJQXhCQ0dvZ0JrRUlhaUlGS0FJQU5nSUFJQXdnQkNrQ2xBRTNBZ0FnQUVFQU93RzZBU0FBUVFJNkFMWUJJQUJCQWpvQXNnRWdBRUVCT2dCd0lBQkNBRGNDYUNBQVFRQTdBYkFCSUFCQmdJQUVOZ0M5QVNBQUlBRkJBV3MyQXF3QklBQkNBRGNDcEFFZ0FFR0FnSUFJTmdLWUFTQUFRUUk2QUpRQklBQkJBam9Ba0FFZ0FFRUFOZ0tNQVNBQVFvQ0FnQWczQW9RQklBQkJBam9BZ0FFZ0FFRUNPZ0I4SUFCQ0FEY0NkQ0FHSUFFUVZTQUFLQUpjSUFCQjRBQnFLQUlBUVFGQkFSQ2ZBU0FMUVFocUlBVW9BZ0EyQWdBZ0N5QUVLUUtVQVRjQ0FBd2JDeUFFS0FKSUlRRWdCQ2dDUkNFQUlBUWdCQ2dDUURZQ2VDQUVJQUEyQW5BZ0JDQUJRUUYwSWdFZ0FHb2lCVFlDZkFOQUlBRUVRQUpBSUFBdkFRQkJGRWNFUUNBRFFRQTZBTDBCREFFTElBTkJBRG9Bd0FFTElBQkJBbW9oQUNBQlFRSnJJUUVNQVFzTElBUWdCVFlDZENBRVFmQUFhaENxQVF3YUN5QURFSWtCREJrTElBTVFaUXdZQ3lBRFFRRWdCQzhCUGlJQUlBQkJBVTBiRUlZQkRCY0xJQVFvQWtoQkJXd2hBU0FETFFDN0FTRUZJQVFvQWtBZ0JDZ0NSQ0lLSVFBRFFBSkFJQUZGRFFBZ0FDZ0FBU0VHQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBZ0FDMEFBRUVCYXc0U0FRSURCQVVHQndnSkNnc01EUTRQRUJFVEFBdEJBQ0VGSUFOQkFEc0J1Z0VnQTBFQ09nQzJBU0FEUVFJNkFMSUJEQkVMSUFOQkFUb0F1Z0VNRUFzZ0EwRUNPZ0M2QVF3UEN5QURJQVZCQVhJaUJUb0F1d0VNRGdzZ0F5QUZRUUp5SWdVNkFMc0JEQTBMSUFNZ0JVRUljaUlGT2dDN0FRd01DeUFESUFWQkVISWlCVG9BdXdFTUN3c2dBeUFGUVFSeUlnVTZBTHNCREFvTElBTkJBRG9BdWdFTUNRc2dBeUFGUWY0QmNTSUZPZ0M3QVF3SUN5QURJQVZCL1FGeElnVTZBTHNCREFjTElBTWdCVUgzQVhFaUJUb0F1d0VNQmdzZ0F5QUZRZThCY1NJRk9nQzdBUXdGQ3lBRElBVkIrd0Z4SWdVNkFMc0JEQVFMSUFjZ0JqWUJBQXdEQ3lBSFFRSTZBQUFNQWdzZ0F5QUdOZ0cyQVF3QkN5QURRUUk2QUxZQkN5QUFRUVZxSVFBZ0FVRUZheUVCREFFTEN5QUtRUUZCQlJDZkFRd1dDeUFEUVFBMkFxUUJEQlVMSUFRb0FrZ2hBU0FFS0FKRUlRQWdCQ0FFS0FKQU5nSjRJQVFnQURZQ2NDQUVJQUZCQVhRaUFTQUFhaUlGTmdKOEEwQWdBUVJBQWtBZ0FDOEJBRUVVUndSQUlBTkJBVG9BdlFFTUFRc2dBMEVCT2dEQUFRc2dBRUVDYWlFQUlBRkJBbXNoQVF3QkN3c2dCQ0FGTmdKMElBUkI4QUJxRUtvQkRCUUxJQU5CQVRZQ3BBRU1Fd3NnQTBFQklBUXZBVDRpQUNBQVFRRk5HeENIQVF3U0N5QUVMUUE5RFFFTEl3QkJFR3NpQUNRQUlBQkJDR29nQXlnQ1ZDSUdJQU1vQWxnaUFTQURLQUpvRUR3Q1FBSkFJQUFvQWdoRkJFQWdBQ2dDRENJRklBRlBEUUVnQmlBRlFRSjBhaUlHSUFaQkJHb2dBU0FGUVg5emFrRUNkQkFTSUFNZ0FVRUJhellDV0FzZ0FFRVFhaVFBREFFTEl3QkJNR3NpQUNRQUlBQWdBVFlDQkNBQUlBVTJBZ0FnQUVFRE5nSU1JQUJCeU1YQUFEWUNDQ0FBUWdJM0FoUWdBQ0FBUVFScXJVS0FnSUNBNEFHRU53TW9JQUFnQUsxQ2dJQ0FnT0FCaERjRElDQUFJQUJCSUdvMkFoQWdBRUVJYWtITTRzQUFFSW9CQUFzTUVBc2dBMEVBTmdKWURBOExJQU5CQVNBRUx3RStJZ0FnQUVFQlRSdEJBV3NRVWd3T0N5QURRUUVnQkM4QlBpSUFJQUJCQVUwYkVGOE1EUXNnQXkwQXdnRkJBVWNORENBRElBUXZBVDRpQUNBREtBS2NBU0FBR3lBRUx3RkFJZ0FnQXlnQ29BRWdBQnNRSlF3TUN5QURJQUEyQXNRQklBTkJDVG9BekFVTUNnc2dBU0FHUWJqbHdBQVFTd0FMSUFOQkFSQ0dBUXdKQ3dBTFFRQUxJZ0FnQXlnQ25BRWlBVUVCYXlBQUlBRkpHellDYUF3R0N5QUpJQUEyQWdBTUJBc2dBeUFBTmdMRUFTQURRUVU2QU13RkRBTUxJQU5CQURvQXpBVU1BZ3NnQTBFR09nRE1CUXdCQ3lBSktBS0VCQ0VCQWtBQ1FBSkFBa0FDUUNBQVFUcHJEZ0lCQUFJTElBbEJIeUFCUVFGcUlnQWdBRUVnUmhzMkFvUUVEQU1MSUFGQklFa05BU0FCUVNCQjVOdkFBQkJMQUFzZ0FVRWdUd1JBSUFGQklFSDAyOEFBRUVzQUN5QUpJQUZCQkhScVFRUnFJZ1VvQWdBaUFVRUdTUVJBSUFVZ0FVRUJkR3BCQkdvaUFTQUJMd0VBUVFwc0lBQkJNR3RCL3dGeGFqc0JBQXdDQ3lBQlFRWkJ0T0hBQUJCTEFBc2dDU0FCUVFSMGFrRUVhaUlCS0FJQVFRRnFJUUFnQVVFRklBQWdBRUVGVHhzMkFnQUxDeUFFUVRJNkFEd01BQXNBQzk4VUFRWi9Jd0JCd0FKcklnSWtBQ0FCS0FJRUlRTURRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFJQU1FUUNBQ1FiZ0NhaUFCS0FJQUVHa2dBaWdDdUFJaEF5QUNLQUs4QWtFQmF3NEdBUVVFQlFJREJRc2dBRUVTT2dBQURBc0xBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBSUFNdkFRQWlBdzRlQUFFQ0F3UUZEZ1lPQnc0T0RnNE9EZzRPRGc0T0NBZ0pDZ3NPREE0TkRnc2dBa0dvQVdwQkFTQUJLQUlBSUFFb0FnUkIxTnpBQUJDQkFTQUJJQUlwQTZnQk53SUFJQUJCQURvQUFBd1lDeUFDUWJBQmFrRUJJQUVvQWdBZ0FTZ0NCRUhrM01BQUVJRUJJQUVnQWlrRHNBRTNBZ0FnQUVFQk9nQUFEQmNMSUFKQnVBRnFRUUVnQVNnQ0FDQUJLQUlFUWZUY3dBQVFnUUVnQVNBQ0tRTzRBVGNDQUNBQVFRSTZBQUFNRmdzZ0FrSEFBV3BCQVNBQktBSUFJQUVvQWdSQmhOM0FBQkNCQVNBQklBSXBBOEFCTndJQUlBQkJBem9BQUF3VkN5QUNRY2dCYWtFQklBRW9BZ0FnQVNnQ0JFR1UzY0FBRUlFQklBRWdBaWtEeUFFM0FnQWdBRUVFT2dBQURCUUxJQUpCMEFGcVFRRWdBU2dDQUNBQktBSUVRYVRkd0FBUWdRRWdBU0FDS1FQUUFUY0NBQ0FBUVFVNkFBQU1Fd3NnQWtIWUFXcEJBU0FCS0FJQUlBRW9BZ1JCdE4zQUFCQ0JBU0FCSUFJcEE5Z0JOd0lBSUFCQkJqb0FBQXdTQ3lBQ1FlQUJha0VCSUFFb0FnQWdBU2dDQkVIRTNjQUFFSUVCSUFFZ0Fpa0Q0QUUzQWdBZ0FFRUhPZ0FBREJFTElBSkI2QUZxUVFFZ0FTZ0NBQ0FCS0FJRVFkVGR3QUFRZ1FFZ0FTQUNLUVBvQVRjQ0FDQUFRUWc2QUFBTUVBc2dBa0h3QVdwQkFTQUJLQUlBSUFFb0FnUkI1TjNBQUJDQkFTQUJJQUlwQS9BQk53SUFJQUJCQ1RvQUFBd1BDeUFDUWZnQmFrRUJJQUVvQWdBZ0FTZ0NCRUgwM2NBQUVJRUJJQUVnQWlrRCtBRTNBZ0FnQUVFS09nQUFEQTRMSUFKQmdBSnFRUUVnQVNnQ0FDQUJLQUlFUVlUZXdBQVFnUUVnQVNBQ0tRT0FBamNDQUNBQVFRczZBQUFNRFFzZ0FrR0lBbXBCQVNBQktBSUFJQUVvQWdSQmxON0FBQkNCQVNBQklBSXBBNGdDTndJQUlBQkJERG9BQUF3TUN5QUNRWkFDYWtFQklBRW9BZ0FnQVNnQ0JFR2szc0FBRUlFQklBRWdBaWtEa0FJM0FnQWdBRUVOT2dBQURBc0xBa0FDUUNBRFFSNXJRZi8vQTNGQkNFOEVRQ0FEUVNackRnSUJDQUlMSUFKQkNHcEJBU0FCS0FJQUlBRW9BZ1JCeE9EQUFCQ0JBU0FCSUFJcEF3ZzNBZ0FnQUNBRFFSNXJPZ0FDSUFCQkRqc0FBQXdNQ3dKQUlBRW9BZ1FpQTBFQ1R3UkFJQUpCbUFGcUlBRW9BZ0JCRUdvUWFTQUNLQUtZQVNJRERRRWdBU2dDQkNFREN5QUNRZWdBYWtFQklBRW9BZ0FnQTBHMDNzQUFFSUVCSUFJb0Ftd2hBeUFDS0FKb0lRUU1EUXNDUUFKQUFrQWdBaWdDbkFGQkFVY05BQ0FETHdFQVFRSnJEZ1FCQUFBQ0FBc2dBa0h3QUdwQkFTQUJLQUlBSUFFb0FnUkJoTi9BQUJDQkFTQUNLQUowSVFNZ0FpZ0NjQ0VFREE0TElBRW9BZ0FoQXlBQktBSUVJZ1JCQlU4RVFDQURMUUFrSVFVZ0F5OEJOQ0VHSUFNdkFVUWhCeUFDUVlBQmFrRUZJQU1nQkVIRTNzQUFFSUVCSUFFZ0Fpa0RnQUUzQWdBZ0FFRU9PZ0FBSUFBZ0JTQUdRUWgwUVlEK0EzRWdCMEVRZEhKeVFRaDBRUUZ5TmdBQkRBMExJQUpCK0FCcVFRSWdBeUFFUWRUZXdBQVFnUUVnQWlnQ2ZDRURJQUlvQW5naEJBd05DeUFCS0FJQUlRTWdBU2dDQkNJRVFRTlBCRUFnQXkwQUpDRUZJQUpCa0FGcVFRTWdBeUFFUWVUZXdBQVFnUUVnQVNBQ0tRT1FBVGNDQUNBQUlBVTZBQUlnQUVFT093QUFEQXdMSUFKQmlBRnFRUUlnQXlBRVFmVGV3QUFRZ1FFZ0FpZ0NqQUVoQXlBQ0tBS0lBU0VFREF3TEFrQUNRQ0FEUWZqL0EzRkJLRWNFUUNBRFFUQnJEZ0lCQ1FJTElBSkJFR3BCQVNBQktBSUFJQUVvQWdSQnRPREFBQkNCQVNBQklBSXBBeEEzQWdBZ0FDQURRU2hyT2dBQ0lBQkJFRHNBQUF3TUN3SkFJQUVvQWdRaUEwRUNUd1JBSUFKQjJBQnFJQUVvQWdCQkVHb1FhU0FDS0FKWUlnTU5BU0FCS0FJRUlRTUxJQUpCS0dwQkFTQUJLQUlBSUFOQnBOL0FBQkNCQVNBQ0tBSXNJUU1nQWlnQ0tDRUVEQTBMQWtBQ1FBSkFJQUlvQWx4QkFVY05BQ0FETHdFQVFRSnJEZ1FCQUFBQ0FBc2dBa0V3YWtFQklBRW9BZ0FnQVNnQ0JFSDAzOEFBRUlFQklBSW9BalFoQXlBQ0tBSXdJUVFNRGdzZ0FTZ0NBQ0VESUFFb0FnUWlCRUVGVHdSQUlBTXRBQ1FoQlNBREx3RTBJUVlnQXk4QlJDRUhJQUpCUUd0QkJTQURJQVJCdE4vQUFCQ0JBU0FCSUFJcEEwQTNBZ0FnQUVFUU9nQUFJQUFnQlNBR1FRaDBRWUQrQTNFZ0IwRVFkSEp5UVFoMFFRRnlOZ0FCREEwTElBSkJPR3BCQWlBRElBUkJ4Ti9BQUJDQkFTQUNLQUk4SVFNZ0FpZ0NPQ0VFREEwTElBRW9BZ0FoQXlBQktBSUVJZ1JCQTA4RVFDQURMUUFrSVFVZ0FrSFFBR3BCQXlBRElBUkIxTi9BQUJDQkFTQUJJQUlwQTFBM0FnQWdBQ0FGT2dBQ0lBQkJFRHNBQUF3TUN5QUNRY2dBYWtFQ0lBTWdCRUhrMzhBQUVJRUJJQUlvQWt3aEF5QUNLQUpJSVFRTURBc2dBMEhhQUd0Qi8vOERjVUVJU1EwSElBTkI1QUJyUWYvL0EzRkJDRThOQXlBQ1FTQnFRUUVnQVNnQ0FDQUJLQUlFUVpUZ3dBQVFnUUVnQVNBQ0tRTWdOd0lBSUFBZ0EwSGNBR3M2QUFJZ0FFRVFPd0FBREFvTElBTXZBUUFpQkVFd1J3UkFJQVJCSmtjTkF5QURMd0VDUVFKSERRTkJDQ0VFUVFZaEJVRUVJUVlNQ1FzZ0F5OEJBa0VDUncwQ1FRZ2hCRUVHSVFWQkJDRUdEQWNMSUFNdkFRQWlCRUV3UndSQUlBUkJKa2NOQWlBREx3RUNRUUpIRFFKQkNpRUVRUWdoQlVFR0lRWU1DQXNnQXk4QkFrRUNSdzBCUVFvaEJFRUlJUVZCQmlFR0RBWUxJQU12QVFBaUJFRXdSd1JBSUFSQkprY05BU0FETHdFQ1FRVkhEUUVnQXkwQUJDRURJQUpCcUFKcVFRRWdBU2dDQUNBQktBSUVRZlRnd0FBUWdRRWdBU0FDS1FPb0FqY0NBQ0FBSUFNNkFBSWdBRUVPT3dBQURBZ0xJQU12QVFKQkJVWU5BUXNnQWtFQklBRW9BZ0FnQVNnQ0JFR1U0Y0FBRUlFQklBSW9BZ1FoQXlBQ0tBSUFJUVFNQndzZ0F5MEFCQ0VESUFKQnNBSnFRUUVnQVNnQ0FDQUJLQUlFUVlUaHdBQVFnUUVnQVNBQ0tRT3dBamNDQUNBQUlBTTZBQUlnQUVFUU93QUFEQVVMSUFKQm9BRnFRUUVnQVNnQ0FDQUJLQUlFUVpUZndBQVFnUUVnQVNBQ0tRT2dBVGNDQUNBQVFRODZBQUFNQkFzZ0FrSGdBR3BCQVNBQktBSUFJQUVvQWdSQmhPREFBQkNCQVNBQklBSXBBMkEzQWdBZ0FFRVJPZ0FBREFNTElBSkJHR3BCQVNBQktBSUFJQUVvQWdSQnBPREFBQkNCQVNBQklBSXBBeGczQWdBZ0FDQURRZElBYXpvQUFpQUFRUTQ3QUFBTUFnc2dBeUFHYWkwQUFDRUdJQU1nQldvdkFRQWhCU0FESUFScUx3RUFJUU1nQWtHZ0FtcEJBU0FCS0FJQUlBRW9BZ1JCNU9EQUFCQ0JBU0FCSUFJcEE2QUNOd0lBSUFCQkVEb0FBQ0FBSUFZZ0JVRUlkRUdBL2dOeElBTkJFSFJ5Y2tFSWRFRUJjallBQVF3QkN5QUNRWmdDYWtFQklBRW9BZ0FnQVNnQ0JFSFU0TUFBRUlFQklBRWdBaWtEbUFJM0FnQWdBeUFHYWkwQUFDRUJJQU1nQldvdkFRQWhCU0FESUFScUx3RUFJUU1nQUVFT09nQUFJQUFnQVNBRlFRaDBRWUQrQTNFZ0EwRVFkSEp5UVFoMFFRRnlOZ0FCQ3lBQ1FjQUNhaVFBRHdzZ0FTQUVOZ0lBSUFFZ0F6WUNCQXdBQ3dBTC94SUNKSDhCZmlNQVFmQUFheUlESkFBZ0EwRTBhaUFBRUY0Z0F5Z0NOQ0lGUVFBMkFvZ0dJQVZCQURZQy9BVWdCVUVBTmdMd0JTQUZRUUEyQXVRRklBVkJBRFlDMkFVZ0JTMEFjRUVCY1FSQUlBVW9BbXdnQVVZZ0FrRUFSM0VoSVNBRktBSm9JUVlMSUFOQktHb2dCUkJ3SUFNb0Fpd2lBQ0FCU3dSQUlBVkJnQVpxSVIwZ0JVSDhCV29oRkNBRlFmUUZhaUVlSUFWQjhBVnFJUlVnQlVIb0JXb2hIeUFGUWR3RmFpRVdJQVZCMEFWcUlSZ2dBeWdDS0NBQlFRUjBhaUlCS0FJRUlRQWdBQ0FCS0FJSVFSUnNhaUVpSUFOQjFnQnFJU01nQTBIUUFHb2lBVUVFY2lFa0lBWkIvLzhEY1NFbElBRkJDV29oSmtFRklRRkJCU0VKQTBBQ1FBSkFBa0FnQUNJSUlDSkhCRUFnQ0VFVWFpRUFJQWdvQWdRaURrVU5CQ0FJS0FJQUlRWWdDRUVJYWlFZ0FrQUNRQ0FEQW44Q1FDQWhJQ1VnRDBILy93TnhJaGxHY1NBSVFSRnFJaEF0QUFCQkVIRkJCSFpIQkVCQkFTQWdLQUFBSWdSQi93RnhRUUpHRFFJYUlBUkJBWEVOQVNBRVFZRCtBM0ZCQTNJTUFnc2dBMEVGSUFnb0FBd2lBa0dBZm5GQkJFRURJQUpCQVhFYmNpQUNRZjhCY1VFQ1Joc2lCRFlDYkVFQUlRb2dDQ2dBQ0NJSFFmOEJjVUVDUncwQ1FRQWhBZ3dIQ3lBRVFZQitjVUVFY2dzaUJEWUNiRUVDSVFJZ0NDZ0FEQ0lIUWY4QmNVRUNSdzBCUVFBaENnd0ZDeUFIUVFoMklRb2dCMEVCY1EwRFFRTWhBaUFIUVlEd0EzRU5CQ0FGTFFDTUJrRUJSdzBFREFJTElBZEJDSFloQ2lBSFFRRnhEUUpCQXlFQ0lBZEJnUEFEY1EwRElBVXRBSXdHRFFFTUF3c2dDVUgvQVhGQkJVY0VRQ0FZSUJHdElBbXRRdjhCZzBJZ2hpQWFyVUlvaG9TRVFmekN3QUFRZWdzZ0FVSC9BWEZCQlVjRVFDQURJQXM3QUZjZ0EwSFpBR29nQzBFUWRqb0FBQ0FESUF3NkFGb2dBeUFCT2dCV0lBTWdEVHNCVkNBRElCYzJBbEFnRmlBRFFkQUFha0dNdzhBQUVHTUxJQVVvQW9nR0lRRWdCU2dDaEFZaEFpQUZLQUw4QlNFRUlBVW9BdmdGSVFnZ0JTZ0M4QVVoRkNBRktBTHNCU0VWSUFVb0F1UUZJUVlnQlNnQzRBVWhCeUFGS0FMWUJTRUpJQVVvQXRRRklRVWdBMEVBTmdKc0lBTkJJR29nQTBIc0FHb1FCaUlBUWQvQndBQkJBaUFGSUFrUUd3SkFBbjhnQXlnQ0lBUkFJQU1vQWlRTUFRc2dBMEVZYWlBRFFld0FhaUFBUWVIQndBQkJCQ0FISUFZUUd5QURLQUlZQkVBZ0F5Z0NIQXdCQ3lBRFFSQnFJQU5CN0FCcUlBQkI1Y0hBQUVFS0lBSWdBUkFiSUFNb0FoQUVRQ0FES0FJVURBRUxJQU5CQ0dvZ0EwSHNBR29nQUVIdndjQUFRUTRnRlNBVUVCc2dBeWdDQ0FSQUlBTW9BZ3dNQVFzZ0F5QURRZXdBYWlBQVFmM0J3QUJCRGlBSUlBUVFHeUFES0FJQVJRMEJJQU1vQWdRTElRRWdBQkNwQVNBRElBRTJBbXdnQTBIc0FHcEJuTVBBQUJCQ0FBc2dBeWdDT0NBREtBSThFTElCSUFOQjhBQnFKQUFnQUE4TElBcEJDSElnQ2lBSUxRQVFRUUZHR3lFS0RBRUxRUVFoQWdzZ0F5QUtRUWgwUVlEK0EzRWdCMEdBZ0h4eGNpSUtJQUp5SWdjMkFrQWdBMEVBSUFOQjdBQnFJaElnQkVIL0FYRkJCVVlpQkJzMkFsZ2dBeUFSclNBSnJVTC9BWU5DSUlZZ0dxMUNLSWFFaENJbk53TlFBa0FnQ1VIL0FYRkJCVVlFUUVFRklRa2dCQTBCSUE1QkVIUWdHWEloRVNBU0VGa2lDVUVJZGlFYURBRUxJQVJGQkVBZ0pDQURRZXdBYWlJRUVGRkZCRUFnR0NBblFiekR3QUFRZWlBT1FSQjBJQmx5SVJFZ0JCQlpJZ2xCQ0hZaEdnd0NDeUFPUVJCMElCRnFJUkVNQVFzZ0dDQW5RYXpEd0FBUWVrRUZJUWtMUVlqQndBQWdCaEI1SVFRQ1FBSkFBa0FDUUFKL0FrQWdCa0dneXdCR0RRQWdCQTBBUVpUQndBQWdCaEI1RFFCQjJNREFBQ0FHRUhraEJBSkFJQVpCajgwQVJnMEFJQVFOQUVIa3dNQUFJQVlRZVEwQVFmREF3QUFnQmhCNURRQkIvTURBQUNBR0VIbEZEUU1MSUFOQlFHc1FXU0VTSUJBdEFBQkJBblJCL0FCeFFRSWdDRUVRYWkwQUFDSUVRUUZHSUFSQkFrWWJja0gvQVhFaEV5QWVLQUlBSWhzZ0ZDZ0NBQ0lIUmdSQUl3QkJFR3NpQkNRQUlBUkJDR29nSGlBYlFRRkJCRUVRRUNZZ0JDZ0NDQ0liUVlHQWdJQjRSd1JBSUFRb0Fnd2FJQnRCek1QQUFCQ3VBUUFMSUFSQkVHb2tBQXNnQlNnQytBVWdCMEVFZEdvaUJDQVRPZ0FNSUFRZ0VqWUNDQ0FFSUFZMkFnUWdCQ0FQT3dFQUlCUU1BUXNnQTBGQWF4QlpJUklnSHlnQ0FDSVRJQlVvQWdBaUIwWUVRQ01BUVJCcklnUWtBQ0FFUVFocUlCOGdFMEVCUVFSQkRCQW1JQVFvQWdnaUUwR0JnSUNBZUVjRVFDQUVLQUlNR2lBVFFkekR3QUFRcmdFQUN5QUVRUkJxSkFBTElBVW9BdXdGSUFkQkRHeHFJZ1FnRWpZQ0NDQUVJQVkyQWdRZ0JDQVBPd0VBSUJVTElBZEJBV28yQWdCQklDRUdEQUVMSUFaQmdBRkpEUUFnRGtILy93TnhRUUZMRFFFZ0JrSC8vd05OQkVBZ0JrRURka0hBZ01BQWFpMEFBQ0FHUVFkeGRrRUJjVVVOQVF3Q0MwSE13TUFBSUFZUWVRMEJDeUFESUFzN0FGY2dKaUFMUVJCMklnUTZBQUFnQXlBZ05nSmNJQU1nRERvQVdpQURJQTA3QVZRZ0F5QVhOZ0pRSUFNZ0FUb0FWZ0pBSUFGQi93RnhRUVZHRFFBQ1FDQURRVUJySUNNUVVRUkFJQkF0QUFCQkFuUkIvQUJ4UVFJZ0NFRVFhaTBBQUNJSFFRRkdJQWRCQWtZYmNrRy9BWEVnREhOQnZ3RnhSUTBCQ3dKQUlBWkJJRWNOQUNBTVFRaHhRUU4ySUJBdEFBQWlCMEVDY1VFQmRrY05BQ0FNUVJCeFFRUjJJQWRCQkhGQkFuWkdEUUVMSUFNZ0N6c0FaeUFEUWVBQWFpSUhRUWxxSUFRNkFBQWdBeUFNT2dCcUlBTWdBVG9BWmlBRElBMDdBV1FnQXlBWE5nSmdJQllnQjBIc3c4QUFFR01NQVFzZ0RVRUJhaUVOSUFFaEFnd0NDeUFjUVJCMElCbHlJUmNnRUMwQUFFRUNkRUg4QUhGQkFpQUlRUkJxTFFBQUlnRkJBVVlnQVVFQ1JodHlRZjhCY1NFTUlBcEJDSFloQzBFQklRME1BUXNnQVVIL0FYRkJCVWNFUUNBRElBczdBRXNnQTBIRUFHb2lBa0VKYWlBTFFSQjJPZ0FBSUFNZ0REb0FUaUFESUFFNkFFb2dBeUFOT3dGSUlBTWdGellDUkNBV0lBSkIvTVBBQUJCakN5QVFMUUFBSVFJZ0NFRVFhaTBBQUNFQklBTWdCellCVmlBRFFRRTdBVlFnQXlBY093RlNJQU1nRHpzQlVDQURJQUpCQW5SQi9BQnhRUUlnQVVFQlJpQUJRUUpHRzNJNkFGb2dGaUFEUWRBQWFrR014TUFBRUdOQkJTRUNDeUFGS0FLSUJpSUVJQVVvQW9BR1JnUkFJd0JCRUdzaUFTUUFJQUZCQ0dvZ0hTQWRLQUlBUVFGQkJFRUVFQ1lnQVNnQ0NDSUlRWUdBZ0lCNFJ3UkFJQUVvQWd3YUlBaEJuTVRBQUJDdUFRQUxJQUZCRUdva0FBc2dIRUVCYWlFY0lBVW9Bb1FHSUFSQkFuUnFJQVkyQWdBZ0JTQUVRUUZxTmdLSUJpQU9JQTlxSVE4Z0FpRUJEQUFMQUFzZ0FTQUFRWmpsd0FBUVN3QUx1UTRCQTM4akFFSGdBR3NpQXlRQUlBRkJCR29oQkFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQWdBU2dDQUNJRlFZQ0F4QUJHQkVBZ0FrRkFhZzQyQVFJREJBVUdCd2dKQ2dzTURRNDNOdzgzTnhBUk56Y1NFemNVTnpjM056Y1ZGaGMzR0JrYUd4dzNOemNkSGpjM056Y2ZJREloTndzQ1FDQUNRZXdBYXc0Rk5UYzNOek1BQ3lBQ1FlZ0FSZzB6RERZTElBQkJIVG9BQUNBQUlBRXZBUWc3QVFJTU5nc2dBRUVNT2dBQUlBQWdBUzhCQ0RzQkFndzFDeUFBUVFrNkFBQWdBQ0FCTHdFSU93RUNERFFMSUFCQkNqb0FBQ0FBSUFFdkFRZzdBUUlNTXdzZ0FFRUlPZ0FBSUFBZ0FTOEJDRHNCQWd3eUN5QUFRUVE2QUFBZ0FDQUJMd0VJT3dFQ0RERUxJQUJCQlRvQUFDQUFJQUV2QVFnN0FRSU1NQXNnQUVFQ09nQUFJQUFnQVM4QkNEc0JBZ3d2Q3lBQVFRczZBQUFnQUNBQkx3RVlPd0VFSUFBZ0FTOEJDRHNCQWd3dUN5QUFRUU02QUFBZ0FDQUJMd0VJT3dFQ0RDMExJQUV2QVFnT0JCY1lHUm9XQ3lBQkx3RUlEZ01iSEIwYUN5QUFRUjQ2QUFBZ0FDQUJMd0VJT3dFQ0RDb0xJQUJCRlRvQUFDQUFJQUV2QVFnN0FRSU1LUXNnQUVFTk9nQUFJQUFnQVM4QkNEc0JBZ3dvQ3lBQVFTMDZBQUFnQUNBQkx3RUlPd0VDRENjTElBQkJLRG9BQUNBQUlBRXZBUWc3QVFJTUpnc2dBUzhCQ0E0R0dSZ2FHQmdiR0FzZ0FFRVdPZ0FBSUFBZ0FTOEJDRHNCQWd3a0N5QUFRUUU2QUFBZ0FDQUJMd0VJT3dFQ0RDTUxJQUJCQWpvQUFDQUFJQUV2QVFnN0FRSU1JZ3NnQUVFS09nQUFJQUFnQVM4QkNEc0JBZ3doQ3lBQVFTSTZBQUFnQUNBQkx3RUlPd0VDRENBTElBQkJMem9BQUNBQUlBRXZBUWc3QVFJTUh3c2dBRUV3T2dBQUlBQWdBUzhCQ0RzQkFnd2VDeUFBUVFzNkFBQWdBQ0FCTHdFWU93RUVJQUFnQVM4QkNEc0JBZ3dkQ3lBQkx3RUlEZ1FVRXhNVkV3c2dBeUFFSUFFb0FvUUVRWVRjd0FBUWRpQURRVUJySWdFZ0F5Z0NBQ0lDSUFJZ0F5Z0NCRUVFZEdvUUtDQURRVHRxSUFGQkNHb29BZ0EyQUFBZ0F5QURLUUpBTndBeklBQkJLem9BQUNBQUlBTXBBREEzQUFFZ0FFRUlhaUFEUVRkcUtRQUFOd0FBREJzTElBTkJDR29nQkNBQktBS0VCRUdVM01BQUVIWWdBMEZBYXlJQklBTW9BZ2dpQWlBQ0lBTW9BZ3hCQkhScUVDZ2dBMEU3YWlBQlFRaHFLQUlBTmdBQUlBTWdBeWtDUURjQU15QUFRU1U2QUFBZ0FDQURLUUF3TndBQklBQkJDR29nQTBFM2Fpa0FBRGNBQUF3YUN5QURRUmhxSUFRZ0FTZ0NoQVJCcE56QUFCQjJJQU1nQXlrREdEY0NUQ0FEUWRZQWFpQURRY3dBYWhBTUFuOGdBeTBBVmtFU1JnUkFRUUFoQVVFQUlRUkJBUXdCQ3lBRFFSQnFRUVJCQVVFRlFaVEl3QUFRWUNBRFFkb0FhaTBBQUNFQklBTW9BaEFoQWlBREtBSVVJZ1FnQXlnQVZqWUFBQ0FFUVFScUlBRTZBQUFnQTBFQk5nSTRJQU1nQkRZQ05DQURJQUkyQWpBZ0F5QURLUUpNTndKQVFRVWhBa0VCSVFFRFFDQURRZHNBYWlBRFFVQnJFQXdnQXkwQVcwRVNSa1VFUUNBREtBSXdJQUZHQkVBZ0EwRXdhaUFCUVFGQkFVRUZFRzBnQXlnQ05DRUVDeUFDSUFScUlnVWdBeWdBV3pZQUFDQUZRUVJxSUFOQjN3QnFMUUFBT2dBQUlBTWdBVUVCYWlJQk5nSTRJQUpCQldvaEFnd0JDd3NnQXlnQ01DRUVJQU1vQWpRTElRSWdBQ0FCTmdJTUlBQWdBallDQ0NBQUlBUTJBZ1FnQUVFcE9nQUFEQmtMSUFCQkV6b0FBQ0FBSUFFdkFSZzdBUVFnQUNBQkx3RUlPd0VDREJnTElBQkJKem9BQUF3WEN5QUFRU1k2QUFBTUZnc2dBRUV5T2dBQURCVUxJQUJCRnpzQkFBd1VDeUFBUVpjQ093RUFEQk1MSUFCQmx3UTdBUUFNRWdzZ0FFR1hCanNCQUF3UkN5QUFRVEk2QUFBTUVBc2dBRUVZT3dFQURBOExJQUJCbUFJN0FRQU1EZ3NnQUVHWUJEc0JBQXdOQ3lBQVFUSTZBQUFNREFzZ0FFRUhPd0VBREFzTElBQkJod0k3QVFBTUNnc2dBRUdIQkRzQkFBd0pDeUFBUVRJNkFBQU1DQXNnQUVFdU93RUFEQWNMSUFCQnJnSTdBUUFNQmdzZ0FTOEJDRUVJUmcwRElBQkJNam9BQUF3RkN5QUZRU0ZIRFFNZ0FFRVVPZ0FBREFRTElBVkJQMGNOQWlBRFFTQnFJQVFnQVNnQ2hBUkJ0TnpBQUJCMklBTkJRR3NpQVNBREtBSWdJZ0lnQWlBREtBSWtRUVIwYWhBcElBTkJPMm9nQVVFSWFpZ0NBRFlBQUNBRElBTXBBa0EzQURNZ0FFRVNPZ0FBSUFBZ0F5a0FNRGNBQVNBQVFRaHFJQU5CTjJvcEFBQTNBQUFNQXdzZ0JVRS9SdzBCSUFOQktHb2dCQ0FCS0FLRUJFSEUzTUFBRUhZZ0EwRkFheUlCSUFNb0FpZ2lBaUFDSUFNb0FpeEJCSFJxRUNrZ0EwRTdhaUFCUVFocUtBSUFOZ0FBSUFNZ0F5a0NRRGNBTXlBQVFSQTZBQUFnQUNBREtRQXdOd0FCSUFCQkNHb2dBMEUzYWlrQUFEY0FBQXdDQ3lBQVFURTZBQUFnQUNBQkx3RVlPd0VFSUFBZ0FTOEJLRHNCQWd3QkN5QUFRVEk2QUFBTElBTkI0QUJxSkFBTG1Rb0JDbjhDUUFKQUFrQWdBQ2dDQUNJRklBQW9BZ2dpQTNJRVFBSkFJQU5CQVhGRkRRQWdBU0FDYWlFR0FrQWdBQ2dDRENJSlJRUkFJQUVoQkF3QkN5QUJJUVFEUUNBRUlBWkdEUUlDZnlBRUlnTXNBQUFpQkVFQVRnUkFJQU5CQVdvTUFRc2dBMEVDYWlBRVFXQkpEUUFhSUFOQkEyb2dCRUZ3U1EwQUdpQURRUVJxQ3lJRUlBTnJJQWRxSVFjZ0NTQUlRUUZxSWdoSERRQUxDeUFFSUFaR0RRQUNRQ0FFTEFBQVFRQk9EUUFMSUFjZ0FnSi9Ba0FnQjBVTkFDQUNJQWROQkVBZ0FpQUhSZzBCUVFBTUFnc2dBU0FIYWl3QUFFRkFUZzBBUVFBTUFRc2dBUXNpQXhzaEFpQURJQUVnQXhzaEFRc2dCVVVOQXlBQUtBSUVJUXNnQWtFUVR3UkFJQUVnQVVFRGFrRjhjU0lIYXlJSUlBSnFJZ3BCQTNFaENVRUFJUVZCQUNFRElBRWdCMGNFUUNBSVFYeE5CRUJCQUNFR0EwQWdBeUFCSUFacUlnUXNBQUJCdjM5S2FpQUVRUUZxTEFBQVFiOS9TbW9nQkVFQ2Fpd0FBRUcvZjBwcUlBUkJBMm9zQUFCQnYzOUthaUVESUFaQkJHb2lCZzBBQ3dzZ0FTRUVBMEFnQXlBRUxBQUFRYjkvU21vaEF5QUVRUUZxSVFRZ0NFRUJhaUlJRFFBTEN3SkFJQWxGRFFBZ0J5QUtRWHh4YWlJRUxBQUFRYjkvU2lFRklBbEJBVVlOQUNBRklBUXNBQUZCdjM5S2FpRUZJQWxCQWtZTkFDQUZJQVFzQUFKQnYzOUthaUVGQ3lBS1FRSjJJUVlnQXlBRmFpRUZBMEFnQnlFSUlBWkZEUVJCd0FFZ0JpQUdRY0FCVHhzaUNVRURjU0VLSUFsQkFuUWhCMEVBSVFRZ0JrRUVUd1JBSUFnZ0IwSHdCM0ZxSVF3Z0NDRURBMEFnQkNBREtBSUFJZ1JCZjNOQkIzWWdCRUVHZG5KQmdZS0VDSEZxSUFNb0FnUWlCRUYvYzBFSGRpQUVRUVoyY2tHQmdvUUljV29nQXlnQ0NDSUVRWDl6UVFkMklBUkJCblp5UVlHQ2hBaHhhaUFES0FJTUlnUkJmM05CQjNZZ0JFRUdkbkpCZ1lLRUNIRnFJUVFnRENBRFFSQnFJZ05IRFFBTEN5QUdJQWxySVFZZ0J5QUlhaUVISUFSQkNIWkIvNEg4QjNFZ0JFSC9nZndIY1dwQmdZQUViRUVRZGlBRmFpRUZJQXBGRFFBTElBZ2dDVUg4QVhGQkFuUnFJZ1FvQWdBaUEwRi9jMEVIZGlBRFFRWjJja0dCZ29RSWNTRURJQXBCQVVZTkFpQURJQVFvQWdRaUEwRi9jMEVIZGlBRFFRWjJja0dCZ29RSWNXb2hBeUFLUVFKR0RRSWdBeUFFS0FJSUlnTkJmM05CQjNZZ0EwRUdkbkpCZ1lLRUNIRnFJUU1NQWdzZ0FrVUVRRUVBSVFVTUF3c2dBa0VEY1NFRUFrQWdBa0VFU1FSQVFRQWhCVUVBSVFnTUFRdEJBQ0VGSUFFaEF5QUNRUXh4SWdnaEJ3TkFJQVVnQXl3QUFFRy9mMHBxSUFOQkFXb3NBQUJCdjM5S2FpQURRUUpxTEFBQVFiOS9TbW9nQTBFRGFpd0FBRUcvZjBwcUlRVWdBMEVFYWlFRElBZEJCR3NpQncwQUN3c2dCRVVOQWlBQklBaHFJUU1EUUNBRklBTXNBQUJCdjM5S2FpRUZJQU5CQVdvaEF5QUVRUUZySWdRTkFBc01BZ3NNQWdzZ0EwRUlka0gvZ1J4eElBTkIvNEg4QjNGcVFZR0FCR3hCRUhZZ0JXb2hCUXNDUUNBRklBdEpCRUFnQ3lBRmF5RUdBa0FDUUFKQUlBQXRBQmdpQTBFQUlBTkJBMGNiSWdOQkFXc09BZ0FCQWdzZ0JpRURRUUFoQmd3QkN5QUdRUUYySVFNZ0JrRUJha0VCZGlFR0N5QURRUUZxSVFNZ0FDZ0NFQ0VJSUFBb0FpQWhCQ0FBS0FJY0lRQURRQ0FEUVFGcklnTkZEUUlnQUNBSUlBUW9BaEFSQWdCRkRRQUxRUUVQQ3d3QkN5QUFJQUVnQWlBRUtBSU1FUU1BQkVCQkFROExRUUFoQXdOQUlBTWdCa1lFUUVFQUR3c2dBMEVCYWlFRElBQWdDQ0FFS0FJUUVRSUFSUTBBQ3lBRFFRRnJJQVpKRHdzZ0FDZ0NIQ0FCSUFJZ0FDZ0NJQ2dDREJFREFBdmhDd0lQZndKK0l3QkIwQUJySWdJa0FDQUJRUVJxSVF3Z0FrRkFheUVOSUFKQkpXb2hEaUFDUVJ4cUlROGdBU2dDSkNFRklBRW9BaFFoRUNBQktBSVFJUU1DUUFKQUFuOENRQU5BSUFFb0FnQWhCaUFCUVlDQWdJQjROZ0lBSUFFb0FnUWhDd0pBQWtBQ1FBSkFBa0FnQmtHQWdJQ0FlRWNFUUNBQktRSUlJUkVnQ3lFSERBRUxBa0FnQXlBUVJnUkFRWUNBZ0lCNElRWU1BUXNnQVNBRFFSQnFJZ2cyQWhBZ0F5a0NDQ0VSSUFNb0FnUWhCeUFES0FJQUlRWWdDQ0VEQzBHQWdJQ0FlQ0FMRUtNQklBWkJnSUNBZ0hoR0RRRUxJQUlnQnpZQ0RDQUNJQVkyQWdnZ0FpQVJOd0lRSUJGQ0lJZ2hFa0YvSUFVZ0VhY2lCRWNnQkNBRlN4dEIvd0Z4RGdJQ0F3RUxRWUNBZ0lCNElBY1Fvd0VnQUVHQWdJQ0FlRFlDQUNBQlFZQ0FnSUI0TmdJQURBY0xBa0FnRXFkQkFYRU5BQ0FGSUFRZ0J5QUVFRFJySWdNZ0F5QUZTUnNpQXlBRVN3MEFJQUlnQXpZQ0VDQURJUVFMQW45QmdJQ0FnSGdnQkNBRlRRMEFHZ0pBQWtBZ0J5QUVJQVZCdU5yQUFCQ1FBU2dDQkVVRVFDQUNRVGhxSWdNZ0FrRUlhaUlJSUFWQkFXc1FQeUFDUVRCcUlBTkJDR29vQWdBMkFnQWdBaUFDS1FJNE53TW9JQUl0QUJRaEJDQURRUkJxSUFJb0Fnd2dBaWdDRUNJSElBZEJBV3RCMk5yQUFCQ1FBU0lIUVJCcUx3RUFPd0VBSUFKQ29JQ0FnQkEzQWpnZ0FpQUhLUUlJTndKQUlBZ2dBMEhvMnNBQUVGY2dBaUFFT2dBMElBSXRBQlJCQVhGRkRRRU1BZ3NnQWtFNGFpSURJQUpCQ0dvZ0JSQS9JQUpCTUdvZ0EwRUlhaWdDQURZQ0FDQUNJQUlwQWpnM0F5Z2dBaUFDTFFBVUlnTTZBRFFnQXcwQkN5QUNRU2hxRUlzQkN5QUNLQUl3QkVBZ0FrRkFheUFDUVRScUtBSUFOZ0lBSUFKQkFUb0FGQ0FDSUFJcEFpdzNBemdnQWlnQ0tBd0JDeUFDS0FJb0lBSW9BaXhCQkVFVUVKOEJRWUNBZ0lCNEN5RURRWUNBZ0lCNElBc1Fvd0VnQVNBRE5nSUFJQXdnQWlrRE9EY0NBQ0FNUVFocUlBSkJRR3NvQWdBMkFnQWdBRUVJYWlBQ1FSQnFLUUlBTndJQUlBQWdBaWtDQ0RjQ0FBd0dDeUFBSUJFM0FnZ2dBQ0FITmdJRUlBQWdCallDQUF3RkN3SkFJQU1nRUVjRVFDQUJJQU5CRUdvaUNEWUNFQ0FES0FJQUlnWkJnSUNBZ0hoSERRRUxJQUpCQURzQVFDQUNRUUk2QUR3Z0FrRUNPZ0E0SUFKQkNHb2lBU0FGSUFKQk9Hb1FRU0FBSUFJcEFnZzNBZ0FnQWtFQU9nQVVJQUJCQ0dvZ0FVRUlhaWtDQURjQ0FBd0ZDeUFEUVF4cUtBSUFJUWtnRHlBREtRSUVOd0lBSUE5QkNHb2dDVFlDQUNBQ0lBWTJBaGdnQlNBRWF5SUpSUTBCSUJLblFRRnhSUVJBSUFKQkFEc0FRQ0FDUVFJNkFEd2dBa0VDT2dBNElBSkJDR29nQlNBQ1FUaHFFRUVNQWdzZ0FpMEFKRVVFUUNBQ1FSaHFFSXNCQ3lBQ0tBSWNJUU1nQWlnQ0lDSUtJQWxOQkVBZ0FrRUlhaUlFSUFNZ0NoQ0FBUUpBSUFJdEFDUWlCZzBBSUFKQkFEb0FGQ0FDS0FJUUlBVlBEUUFnQWtFQU93QkFJQUpCQWpvQVBDQUNRUUk2QURnZ0JDQUZJQUpCT0dvUVFRc2dBaWdDR0NBRFFRUkJGQkNmQVNBR1JRMEVRWUNBZ0lCNElBc1Fvd0VnQVVFSWFpQUNRUkJxS1FJQU53SUFJQUVnQWlrQ0NEY0NBRUdBZ0lDQWVDQUNFS01CSUFnaEF3d0JDd3NnQXlBS0lBbEIrTm5BQUJDUUFTZ0NCRVVFUUNBTlFRaHFJQWNnQkNBRVFRRnJRWWphd0FBUWtBRWlDRUVRYWk4QkFEc0JBQ0FOSUFncEFnZzNBZ0FnQWtLZ2dJQ0FFRGNDT0NBQ1FRaHFJQUpCT0dwQm1OckFBQkJYSUFsQkFXc2hDUXNnQ1NBS1RRUkFJQUpCQ0dvZ0F5QUpFSUFCSUFJb0FoZ2hCaUFESUFvZ0NSQ0lBU0FHUVlDQWdJQjRSZzBESUFvZ0NpQUpheUlJSUFnZ0Nrc2JJUVFnQWkwQUpBd0NDeUFKSUFwQnFOckFBQkN6QVFBTElBSkJLbW9nRGtFQ2FpMEFBRG9BQUNBQ0lBNHZBQUE3QVNnZ0FpZ0NJQ0VFSUFJb0Fod2hBeUFDTFFBa0N5RUlRWUNBZ0lCNElBc1Fvd0VnQVNBSU9nQU1JQUVnQkRZQ0NDQUJJQU0yQWdRZ0FTQUdOZ0lBSUFFZ0FpOEJLRHNBRFNBQlFROXFJQUpCS21vdEFBQTZBQUFMSUFBZ0Fpa0NDRGNDQUNBQVFRaHFJQUpCRUdvcEFnQTNBZ0FMSUFKQjBBQnFKQUFMNVFvQ0VIOEJmaU1BUVpBQmF5SUNKQUFnQUNnQ2JDSUZJQUFvQWh3aUJtc2lBVUVBSUFFZ0FDZ0NGQ0lISUFacklBVnFUUnNoRFNBRklBZHFJUU1nQjBFRWRDSUJJQUFvQWhBaUNtb2hEeUFBS0FJWUlRd2dBQ2dDYUNFT0lBQW9BcUFCSVFzZ0FDZ0NuQUVoQ0NBS0lRUURRQUpBSUFNZ0JrWU5BQ0FCUlEwQUlBa2dER3BCQUNBRUxRQU1JaEFiSVFrZ0EwRUJheUVESUFGQkVHc2hBU0FFUVJCcUlRUWdEU0FRUVFGemFpRU5EQUVMQ3lBSUlBeEhCRUJCQUNFRklBQkJBRFlDRkNBQ0lBZzJBamdnQWtFQU5nSTBJQUlnQnpZQ01DQUNJQUJCREdvaUREWUNMQ0FDSUE4MkFpZ2dBaUFLTmdJa0lBSkJnSUNBZ0hnMkFoUWdBa0hJQUdvZ0FrRVVhaUlCRUJBQ2Z5QUNLQUpJUVlDQWdJQjRSZ1JBSUFFUW9RRkJCQ0VFUVFBTUFRc2dBa0VJYWtFRVFRUkJFRUdVeU1BQUVHQWdBa0hRQUdvcEFnQWhFU0FDS0FJSUlRRWdBaWdDRENJRUlBSXBBa2czQWdBZ0JFRUlhaUFSTndJQUlBSkJBVFlDUkNBQ0lBUTJBa0FnQWlBQk5nSThJQUpCMkFCcUlBSkJGR3BCS0JBV0drRVFJUU5CQVNFRkEwQWdBa0dBQVdvZ0FrSFlBR29RRUNBQ0tBS0FBVUdBZ0lDQWVFY0VRQ0FDS0FJOElBVkdCRUFnQWtFOGFrRUJFSTBCSUFJb0FrQWhCQXNnQXlBRWFpSUJJQUlwQW9BQk53SUFJQUZCQ0dvZ0FrR0lBV29wQWdBM0FnQWdBaUFGUVFGcUlnVTJBa1FnQTBFUWFpRUREQUVMQzBHQWdJQ0FlQ0FDS0FLRUFSQ2pBU0FDUWRnQWFoQ2hBU0FDS0FJOEN5RUhJQWtnRG1vaENTQUZRUVIwSVFNZ0JDRUJBa0FEUUNBRFJRMEJJQU5CRUdzaEF5QUJLQUlJSVFvZ0FVRVFhaUVCSUFnZ0NrWU5BQXRCOE0vQUFFRTNRYWpRd0FBUWNRQUxJQXdRb0FFZ0FDQUZOZ0lVSUFBZ0JEWUNFQ0FBSUFjMkFnd2dCU0FHU1FSQUlBSkJBRHNBWUNBQ1FRSTZBRndnQWtFQ09nQllJQUFnQmlBRmF5QUlJQUpCMkFCcUVDNGdBQ2dDRkNFRkN5QUZRUUZySVFSQkFDRUJRUUFoQXdOQUFrQWdBU0FOVHcwQUlBTWdCRThOQUNBQklBQW9BaEFnQUNnQ0ZDQURRYkRQd0FBUWtnRXRBQXhCQVhOcUlRRWdBMEVCYWlFRERBRUxDd0ovQTBBZ0FDZ0NGQ0lCSUFnZ0NVc05BUm9nQUNnQ0VDQUJJQU5Cb00vQUFCQ1NBUzBBREFSQUlBTkJBV29oQXlBSklBaHJJUWtNQVFzTElBQW9BaFFMSVFjZ0NTQUlRUUZySWdFZ0FTQUpTeHNoRGlBRElBWWdCV3RxSWdGQkFFNGhCQ0FCUVFBZ0JCc2hCU0FHUVFBZ0FTQUVHMnNoQmdzQ1FBSkFBa0JCZnlBR0lBdEhJQVlnQzBzYlFmOEJjUTRDQWdBQkN5QUhJQVpySWdGQkFDQUJJQWROR3lJRUlBc2dCbXNpQVNBQklBUkxHeUlEUVFBZ0JTQUdTUnNnQldvaEJTQUJJQVJORFFFZ0FrRUFPd0JnSUFKQkFqb0FYQ0FDUVFJNkFGZ2dBQ0FCSUFOcklBZ2dBa0hZQUdvUUxnd0JDd0pBSUFZZ0Myc2lDaUFHSUFWQmYzTnFJZ0VnQVNBS1N4c2lCRVVOQUNBQUtBSVFJUU1nQkNBSFRRUkFJQUFnQnlBRWF5SUJOZ0lVSUFNZ0FVRUVkR29oQXlBRUlRRURRQ0FCQkVBZ0F5Z0NBQ0FEUVFScUtBSUFRUVJCRkJDZkFTQUJRUUZySVFFZ0EwRVFhaUVEREFFTEN5QUFLQUlVSVFjZ0FDZ0NFQ0VEQ3dKQUlBZEZEUUFnQXlBSFFRUjBhaUlCUVJCR0RRQWdBVUVFYTBFQU9nQUFEQUVMUVpEUHdBQVF0Z0VBQ3lBRklBcHJJQVJxSVFVTElBQWdCVFlDYkNBQUlBNDJBbWdnQUVFQk9nQWdJQUFnQ3pZQ0hDQUFJQWcyQWhnQ2Z5QUFLQUtnQVNJRElBQW9BbVFpQVUwRVFDQUFJQU0yQW1RZ0F3d0JDeUFBUWR3QWFpQURJQUZyUVFBUU9pQUFLQUprSVFNZ0FDZ0NvQUVMSVFFZ0FDZ0NZQ0FEUVFBZ0FSQlRJQUFvQXB3QklnRWdBQ2dDZEUwRVFDQUFJQUZCQVdzMkFuUUxJQUFvQXFBQklnRWdBQ2dDZUUwRVFDQUFJQUZCQVdzMkFuZ0xJQUpCa0FGcUpBQUx1d2tCQjM4Q1FBSkFJQUlnQUNBQmEwc0VRQ0FCSUFKcUlRVWdBQ0FDYWlFQUlBSkJFRWtOQVVFQUlBQkJBM0VpQm1zaEJ3SkFJQUJCZkhFaUF5QUFUdzBBSUFaQkFXc0NRQ0FHUlFSQUlBVWhCQXdCQ3lBR0lRZ2dCU0VFQTBBZ0FFRUJheUlBSUFSQkFXc2lCQzBBQURvQUFDQUlRUUZySWdnTkFBc0xRUU5KRFFBZ0JFRUVheUVFQTBBZ0FFRUJheUFFUVFOcUxRQUFPZ0FBSUFCQkFtc2dCRUVDYWkwQUFEb0FBQ0FBUVFOcklBUkJBV290QUFBNkFBQWdBRUVFYXlJQUlBUXRBQUE2QUFBZ0JFRUVheUVFSUFBZ0Ewc05BQXNMSUFNZ0FpQUdheUlFUVh4eElnSnJJUUJCQUNBQ2F5RUdBa0FnQlNBSGFpSUZRUU54UlFSQUlBQWdBMDhOQVNBQklBUnFRUVJySVFFRFFDQURRUVJySWdNZ0FTZ0NBRFlDQUNBQlFRUnJJUUVnQUNBRFNRMEFDd3dCQ3lBQUlBTlBEUUFnQlVFRGRDSUNRUmh4SVFnZ0JVRjhjU0lIUVFScklRRkJBQ0FDYTBFWWNTRUpJQWNvQWdBaEFnTkFJQUlnQ1hRaEJ5QURRUVJySWdNZ0J5QUJLQUlBSWdJZ0NIWnlOZ0lBSUFGQkJHc2hBU0FBSUFOSkRRQUxDeUFFUVFOeElRSWdCU0FHYWlFRkRBRUxJQUpCRUU4RVFBSkFRUUFnQUd0QkEzRWlCaUFBYWlJRUlBQk5EUUFnQmtFQmF5QUJJUU1nQmdSQUlBWWhCUU5BSUFBZ0F5MEFBRG9BQUNBRFFRRnFJUU1nQUVFQmFpRUFJQVZCQVdzaUJRMEFDd3RCQjBrTkFBTkFJQUFnQXkwQUFEb0FBQ0FBUVFGcUlBTkJBV290QUFBNkFBQWdBRUVDYWlBRFFRSnFMUUFBT2dBQUlBQkJBMm9nQTBFRGFpMEFBRG9BQUNBQVFRUnFJQU5CQkdvdEFBQTZBQUFnQUVFRmFpQURRUVZxTFFBQU9nQUFJQUJCQm1vZ0EwRUdhaTBBQURvQUFDQUFRUWRxSUFOQkIyb3RBQUE2QUFBZ0EwRUlhaUVESUFRZ0FFRUlhaUlBUncwQUN3c2dBaUFHYXlJRFFYeHhJZ2dnQkdvaEFBSkFJQUVnQm1vaUJVRURjVVVFUUNBQUlBUk5EUUVnQlNFQkEwQWdCQ0FCS0FJQU5nSUFJQUZCQkdvaEFTQUVRUVJxSWdRZ0FFa05BQXNNQVFzZ0FDQUVUUTBBSUFWQkEzUWlBa0VZY1NFR0lBVkJmSEVpQjBFRWFpRUJRUUFnQW10QkdIRWhDU0FIS0FJQUlRSURRQ0FDSUFaMklRY2dCQ0FISUFFb0FnQWlBaUFKZEhJMkFnQWdBVUVFYWlFQklBUkJCR29pQkNBQVNRMEFDd3NnQTBFRGNTRUNJQVVnQ0dvaEFRc2dBQ0FDYWlJRklBQk5EUUVnQWtFQmF5QUNRUWR4SWdNRVFBTkFJQUFnQVMwQUFEb0FBQ0FCUVFGcUlRRWdBRUVCYWlFQUlBTkJBV3NpQXcwQUN3dEJCMGtOQVFOQUlBQWdBUzBBQURvQUFDQUFRUUZxSUFGQkFXb3RBQUE2QUFBZ0FFRUNhaUFCUVFKcUxRQUFPZ0FBSUFCQkEyb2dBVUVEYWkwQUFEb0FBQ0FBUVFScUlBRkJCR290QUFBNkFBQWdBRUVGYWlBQlFRVnFMUUFBT2dBQUlBQkJCbW9nQVVFR2FpMEFBRG9BQUNBQVFRZHFJQUZCQjJvdEFBQTZBQUFnQVVFSWFpRUJJQVVnQUVFSWFpSUFSdzBBQ3d3QkN5QUFJQUpySWdRZ0FFOE5BQ0FDUVFGcklBSkJBM0VpQVFSQUEwQWdBRUVCYXlJQUlBVkJBV3NpQlMwQUFEb0FBQ0FCUVFGcklnRU5BQXNMUVFOSkRRQWdCVUVFYXlFQkEwQWdBRUVCYXlBQlFRTnFMUUFBT2dBQUlBQkJBbXNnQVVFQ2FpMEFBRG9BQUNBQVFRTnJJQUZCQVdvdEFBQTZBQUFnQUVFRWF5SUFJQUV0QUFBNkFBQWdBVUVFYXlFQklBQWdCRXNOQUFzTEM3Z0tBUVYvSUFBZ0FrR0F6Y0FBRUdJaUFpZ0NCQ0FDS0FJSUlBRkIwTlhBQUJDUUFTZ0NCQ0VHUVFFaEJ3SkFBa0FDZndKQUFrQUNRQUpBQWtBQ1FBSkFJQU5Cb0FGSkRRQWdBMEVOZGtHQTdjQUFhaTBBQUNJQVFSVlBEUUVnQTBFSGRrRS9jU0FBUVFaMGNrR0E3OEFBYWkwQUFDSUFRYlFCVHcwQ0FrQUNRQ0FEUVFKMlFSOXhJQUJCQlhSeVFjRDV3QUJxTFFBQUlBTkJBWFJCQm5GMlFRTnhRUUpyRGdJQkFBSUxJQU5CanZ3RGEwRUNTUTBCSUFOQjNBdEdEUUVnQTBIWUwwWU5BU0FEUVpBMFJnMEJJQU5CZzVnRVJnMEJJQU5CL3YvL0FIRkIvTWtDUmcwQklBTkJvZ3hyUWVFRVNRMEJJQU5CZ0M5clFUQkpEUUVnQTBHeDJnQnJRVDlKRFFFZ0EwSG00d2RyUVJwSkRRRUxRUUFoQndzZ0FpZ0NDQ0lGSUFGQmYzTnFJUUFDUUFKQUFrQUNRQ0FHRGdNREFRSUFDMEdnMk1BQVFTaEJ5TmpBQUJCeEFBc2dBaWdDQkNFR0lBY05Cd0pBQWtBQ1FDQUFEZ0lBQVFJTElBWWdCU0FCUWZEVndBQVFrQUVpQWtFZ05nSUFRUUFoQUVFQklRWU1Dd3RCQWlFQUlBWWdCU0FCUVlEV3dBQVFrQUVpQlVFQ05nSUVJQVVnQXpZQ0FDQUZJQVFwQUFBM0FBZ2dCVUVRYWlBRVFRaHFMd0FBT3dBQUlBSW9BZ1FnQWlnQ0NDQUJRUUZxUVpEV3dBQVFrQUVpQWtFZ05nSUFEQWNMUVFJaEFDQUdJQVVnQVVHZzFzQUFFSkFCSWdWQkFqWUNCQ0FGSUFNMkFnQWdCU0FFS1FBQU53QUlJQVZCRUdvZ0JFRUlhaUlETHdBQU93QUFJQUlvQWdRZ0FpZ0NDQ0FCUVFGcUlnVkJzTmJBQUJDUUFTZ0NCRUVDUmdSQUlBSW9BZ1FnQWlnQ0NDQUJRUUpxUWNEV3dBQVFrQUVpQVVLZ2dJQ0FFRGNDQUNBQklBUXBBQUEzQUFnZ0FVRVFhaUFETHdBQU93QUFDeUFDS0FJRUlBSW9BZ2dnQlVIUTFzQUFFSkFCSWdKQklEWUNBQXdHQzBFQklRWWdBVUVCYWlFSUlBSW9BZ1FoQ1NBSERRUkJBaUVBSUFrZ0JTQUJRWURYd0FBUWtBRWlBVUVDTmdJRUlBRWdBellDQUNBQklBUXBBQUEzQUFnZ0FVRVFhaUFFUVFocUx3QUFPd0FBSUFJb0FnUWdBaWdDQ0NBSVFaRFh3QUFRa0FFaUFrRWdOZ0lBREFVTElBY05BZ0pBQWtBZ0FBNENDZ0FCQzBFQklRWWdBaWdDQkNBRklBRkJBV3BCd05mQUFCQ1FBU0lDUVNBMkFnQkJBQ0VBREFnTElBSW9BZ1FnQlNBQlFRRnJRZERYd0FBUWtBRWlBRUtnZ0lDQUVEY0NBQ0FBSUFRcEFBQTNBQWdnQUVFUWFpQUVRUWhxSWdjdkFBQTdBQUJCQWlFQUlBSW9BZ1FnQWlnQ0NDQUJRZURYd0FBUWtBRWlCVUVDTmdJRUlBVWdBellDQUNBRklBUXBBQUEzQUFnZ0JVRVFhaUFITHdBQU93QUFJQUlvQWdRZ0FpZ0NDQ0FCUVFGcUlnTkI4TmZBQUJDUUFTZ0NCRUVDUmdSQUlBSW9BZ1FnQWlnQ0NDQUJRUUpxUVlEWXdBQVFrQUVpQVVLZ2dJQ0FFRGNDQUNBQklBUXBBQUEzQUFnZ0FVRVFhaUFITHdBQU93QUFDeUFDS0FJRUlBSW9BZ2dnQTBHUTJNQUFFSkFCSWdKQklEWUNBQXdFQ3lBQVFSVkI5TWJBQUJCTEFBc2dBRUcwQVVHRXg4QUFFRXNBQ3lBQ0tBSUVJQVVnQVVFQmEwR2cxOEFBRUpBQklnQkNvSUNBZ0JBM0FnQWdBQ0FFS1FBQU53QUlJQUJCRUdvZ0JFRUlhaThBQURzQUFDQUNLQUlFSUFJb0FnZ2dBVUd3MThBQUVKQUJEQU1MSUFrZ0JTQUJRZURXd0FBUWtBRWlBRUVCTmdJRUlBQWdBellDQUNBQUlBUXBBQUEzQUFnZ0FFRVFhaUFFUVFocUx3QUFPd0FBSUFJb0FnUWdBaWdDQ0NBSVFmRFd3QUFRa0FFaUFrRWdOZ0lBUVFFaEFBd0RDMEVBSVFZTUFnc2dCaUFGSUFGQjROWEFBQkNRQVFzaUFpQUROZ0lBUVFFaEJrRUJJUUFMSUFJZ0JqWUNCQ0FDSUFRcEFBQTNBQWdnQWtFUWFpQUVRUWhxTHdBQU93QUFDeUFBQzZJR0FReC9Jd0JCRUdzaUJpUUFRUW9oQXdKQUlBQW9BZ0FpQUVHUXpnQkpCRUFnQUNFQ0RBRUxBMEFnQmtFR2FpQURhaUlFUVFScklBQkJrTTRBYmlJQ1FmQ3hBMndnQUdvaUIwSC8vd054UWVRQWJpSUlRUUYwUVpYbndBQnFMd0FBT3dBQUlBUkJBbXNnQ0VHY2Yyd2dCMnBCLy84RGNVRUJkRUdWNThBQWFpOEFBRHNBQUNBRFFRUnJJUU1nQUVIL3dkY3ZTeUFDSVFBTkFBc0xJQUpCNHdCTEJFQWdBMEVDYXlJRElBWkJCbXBxSUFJZ0FrSC8vd054UWVRQWJpSUNRWngvYkdwQi8vOERjVUVCZEVHVjU4QUFhaThBQURzQUFBc0NRQ0FDUVFwUEJFQWdBMEVDYXlJQUlBWkJCbXBxSUFKQkFYUkJsZWZBQUdvdkFBQTdBQUFNQVFzZ0EwRUJheUlBSUFaQkJtcHFJQUpCTUhJNkFBQUxRUW9nQUdzaEJFRUJJUU5CSzBHQWdNUUFJQUVvQWhRaUFrRUJjU0lGR3lFSElBSkJCSEZCQW5ZaENDQUdRUVpxSUFCcUlRb0NRQ0FCS0FJQVJRUkFJQUVvQWh3aUFDQUJLQUlnSWdFZ0J5QUlFSGdOQVNBQUlBb2dCQ0FCS0FJTUVRTUFJUU1NQVFzZ0FTZ0NCQ0lKSUFRZ0JXb2lDMDBFUUNBQktBSWNJZ0FnQVNnQ0lDSUJJQWNnQ0JCNERRRWdBQ0FLSUFRZ0FTZ0NEQkVEQUNFRERBRUxJQUpCQ0hFRVFDQUJLQUlRSVF3Z0FVRXdOZ0lRSUFFdEFCZ2hEU0FCUVFFNkFCZ2dBU2dDSENJQ0lBRW9BaUFpQ3lBSElBZ1FlQTBCSUFBZ0NXb2dCV3RCQ1dzaEFBTkFJQUJCQVdzaUFBUkFJQUpCTUNBTEtBSVFFUUlBUlEwQkRBTUxDeUFDSUFvZ0JDQUxLQUlNRVFNQURRRWdBU0FOT2dBWUlBRWdERFlDRUVFQUlRTU1BUXNnQ1NBTGF5RUNBa0FDUUFKQVFRRWdBUzBBR0NJQUlBQkJBMFliSWdCQkFXc09BZ0FCQWdzZ0FpRUFRUUFoQWd3QkN5QUNRUUYySVFBZ0FrRUJha0VCZGlFQ0N5QUFRUUZxSVFBZ0FTZ0NFQ0VKSUFFb0FpQWhCU0FCS0FJY0lRRUNRQU5BSUFCQkFXc2lBRVVOQVNBQklBa2dCU2dDRUJFQ0FFVU5BQXNNQVFzZ0FTQUZJQWNnQ0JCNERRQWdBU0FLSUFRZ0JTZ0NEQkVEQUEwQVFRQWhBQU5BSUFBZ0FrWUVRRUVBSVFNTUFnc2dBRUVCYWlFQUlBRWdDU0FGS0FJUUVRSUFSUTBBQ3lBQVFRRnJJQUpKSVFNTElBWkJFR29rQUNBREM4a0ZBZ3AvQVg0akFFR1FBV3NpQkNRQUFrQUNRQUpBQTBCQkFDQUNRUVIwYXlFRkFrQURRQ0FDUlEwRklBQkZEUVVnQUNBQ2FrRVlTUTBESUFBZ0FpQUFJQUpKSWdNYlFRbEpEUUVnQTBVRVFDQUJJUU1EUUNBRElBVnFJZ0VnQXlBQ0VHb2dBU0VESUFJZ0FDQUNheUlBVFEwQUN3d0JDd3RCQUNBQVFRUjBJZ05ySVFVRFFDQUJJQVZxSUFFZ0FCQnFJQUVnQTJvaEFTQUNJQUJySWdJZ0FFOE5BQXNNQVFzTElBRWdBRUVFZENJRmF5SURJQUpCQkhRaUJtb2hCeUFBSUFKTERRRWdCRUVRYWlJQUlBTWdCUkFXR2lBRElBRWdCaEFTSUFjZ0FDQUZFQllhREFJTElBUkJDR29pQnlBQklBQkJCSFJySWdaQkNHb3BBZ0EzQXdBZ0JDQUdLUUlBTndNQUlBSkJCSFFoQ0NBQ0lnVWhBUU5BSUFZZ0FVRUVkR29oQXdOQUlBUkJHR29pQ1NBRFFRaHFJZ29wQWdBM0F3QWdCQ0FES1FJQU53TVFJQWNwQXdBaERTQURJQVFwQXdBM0FnQWdDaUFOTndJQUlBY2dDU2tEQURjREFDQUVJQVFwQXhBM0F3QWdBQ0FCU3dSQUlBTWdDR29oQXlBQklBSnFJUUVNQVFzTElBRWdBR3NpQVFSQUlBRWdCU0FCSUFWSkd5RUZEQUVGSUFRcEF3QWhEU0FHUVFocUlBUkJDR29pQnlrREFEY0NBQ0FHSUEwM0FnQkJBU0FGSUFWQkFVMGJJUWxCQVNFQkEwQWdBU0FKUmcwRUlBWWdBVUVFZEdvaUJTa0NBQ0VOSUFjZ0JVRUlhaUlLS1FJQU53TUFJQVFnRFRjREFDQUJJQUpxSVFNRFFDQUVRUmhxSWdzZ0JpQURRUVIwYWlJSVFRaHFJZ3dwQWdBM0F3QWdCQ0FJS1FJQU53TVFJQWNwQXdBaERTQUlJQVFwQXdBM0FnQWdEQ0FOTndJQUlBY2dDeWtEQURjREFDQUVJQVFwQXhBM0F3QWdBQ0FEU3dSQUlBSWdBMm9oQXd3QkN5QURJQUJySWdNZ0FVY05BQXNnQkNrREFDRU5JQW9nQnlrREFEY0NBQ0FGSUEwM0FnQWdBVUVCYWlFQkRBQUxBQXNBQ3dBTElBUkJFR29pQUNBQklBWVFGaG9nQnlBRElBVVFFaUFESUFBZ0JoQVdHZ3NnQkVHUUFXb2tBQXVRQlFFSWZ3SkFJQUpCRUVrRVFDQUFJUU1NQVFzQ1FFRUFJQUJyUVFOeElnWWdBR29pQlNBQVRRMEFJQVpCQVdzZ0FDRURJQUVoQkNBR0JFQWdCaUVIQTBBZ0F5QUVMUUFBT2dBQUlBUkJBV29oQkNBRFFRRnFJUU1nQjBFQmF5SUhEUUFMQzBFSFNRMEFBMEFnQXlBRUxRQUFPZ0FBSUFOQkFXb2dCRUVCYWkwQUFEb0FBQ0FEUVFKcUlBUkJBbW90QUFBNkFBQWdBMEVEYWlBRVFRTnFMUUFBT2dBQUlBTkJCR29nQkVFRWFpMEFBRG9BQUNBRFFRVnFJQVJCQldvdEFBQTZBQUFnQTBFR2FpQUVRUVpxTFFBQU9nQUFJQU5CQjJvZ0JFRUhhaTBBQURvQUFDQUVRUWhxSVFRZ0JTQURRUWhxSWdOSERRQUxDeUFDSUFacklnZEJmSEVpQ0NBRmFpRURBa0FnQVNBR2FpSUVRUU54UlFSQUlBTWdCVTBOQVNBRUlRRURRQ0FGSUFFb0FnQTJBZ0FnQVVFRWFpRUJJQVZCQkdvaUJTQURTUTBBQ3d3QkN5QURJQVZORFFBZ0JFRURkQ0lDUVJoeElRWWdCRUY4Y1NJSlFRUnFJUUZCQUNBQ2EwRVljU0VLSUFrb0FnQWhBZ05BSUFJZ0JuWWhDU0FGSUFrZ0FTZ0NBQ0lDSUFwMGNqWUNBQ0FCUVFScUlRRWdCVUVFYWlJRklBTkpEUUFMQ3lBSFFRTnhJUUlnQkNBSWFpRUJDd0pBSUFJZ0Eyb2lCaUFEVFEwQUlBSkJBV3NnQWtFSGNTSUVCRUFEUUNBRElBRXRBQUE2QUFBZ0FVRUJhaUVCSUFOQkFXb2hBeUFFUVFGcklnUU5BQXNMUVFkSkRRQURRQ0FESUFFdEFBQTZBQUFnQTBFQmFpQUJRUUZxTFFBQU9nQUFJQU5CQW1vZ0FVRUNhaTBBQURvQUFDQURRUU5xSUFGQkEyb3RBQUE2QUFBZ0EwRUVhaUFCUVFScUxRQUFPZ0FBSUFOQkJXb2dBVUVGYWkwQUFEb0FBQ0FEUVFacUlBRkJCbW90QUFBNkFBQWdBMEVIYWlBQlFRZHFMUUFBT2dBQUlBRkJDR29oQVNBR0lBTkJDR29pQTBjTkFBc0xJQUFMNmdRQkNuOGpBRUV3YXlJREpBQWdBeUFCTmdJc0lBTWdBRFlDS0NBRFFRTTZBQ1FnQTBJZ053SWNJQU5CQURZQ0ZDQURRUUEyQWd3Q2Z3SkFBa0FDUUNBQ0tBSVFJZ3BGQkVBZ0FpZ0NEQ0lBUlEwQklBSW9BZ2dpQVNBQVFRTjBhaUVFSUFCQkFXdEIvLy8vL3dGeFFRRnFJUWNnQWlnQ0FDRUFBMEFnQUVFRWFpZ0NBQ0lGQkVBZ0F5Z0NLQ0FBS0FJQUlBVWdBeWdDTENnQ0RCRURBQTBFQ3lBQktBSUFJQU5CREdvZ0FVRUVhaWdDQUJFQ0FBMERJQUJCQ0dvaEFDQUVJQUZCQ0dvaUFVY05BQXNNQVFzZ0FpZ0NGQ0lBUlEwQUlBQkJCWFFoQ3lBQVFRRnJRZi8vL3o5eFFRRnFJUWNnQWlnQ0NDRUZJQUlvQWdBaEFBTkFJQUJCQkdvb0FnQWlBUVJBSUFNb0FpZ2dBQ2dDQUNBQklBTW9BaXdvQWd3UkF3QU5Bd3NnQXlBSUlBcHFJZ0ZCRUdvb0FnQTJBaHdnQXlBQlFSeHFMUUFBT2dBa0lBTWdBVUVZYWlnQ0FEWUNJQ0FCUVF4cUtBSUFJUVJCQUNFSlFRQWhCZ0pBQWtBQ1FDQUJRUWhxS0FJQVFRRnJEZ0lBQWdFTElBVWdCRUVEZEdvaURDZ0NBQTBCSUF3b0FnUWhCQXRCQVNFR0N5QURJQVEyQWhBZ0F5QUdOZ0lNSUFGQkJHb29BZ0FoQkFKQUFrQUNRQ0FCS0FJQVFRRnJEZ0lBQWdFTElBVWdCRUVEZEdvaUJpZ0NBQTBCSUFZb0FnUWhCQXRCQVNFSkN5QURJQVEyQWhnZ0F5QUpOZ0lVSUFVZ0FVRVVhaWdDQUVFRGRHb2lBU2dDQUNBRFFReHFJQUZCQkdvb0FnQVJBZ0FOQWlBQVFRaHFJUUFnQ3lBSVFTQnFJZ2hIRFFBTEN5QUhJQUlvQWdSUERRRWdBeWdDS0NBQ0tBSUFJQWRCQTNScUlnQW9BZ0FnQUNnQ0JDQURLQUlzS0FJTUVRTUFSUTBCQzBFQkRBRUxRUUFMSUFOQk1Hb2tBQXVyQkFFTWZ5QUJRUUZySVE0Z0FDZ0NCQ0VLSUFBb0FnQWhDeUFBS0FJSUlRd0NRQU5BSUFVTkFRSi9Ba0FnQWlBRFNRMEFBMEFnQVNBRGFpRUZBa0FDUUFKQUlBSWdBMnNpQjBFSFRRUkFJQUlnQTBjTkFTQUNJUU1NQlFzQ1FDQUZRUU5xUVh4eElnWWdCV3NpQkFSQVFRQWhBQU5BSUFBZ0JXb3RBQUJCQ2tZTkJTQUVJQUJCQVdvaUFFY05BQXNnQjBFSWF5SUFJQVJQRFFFTUF3c2dCMEVJYXlFQUN3TkFJQVlvQWdBaUNVR0Fnb1FJSUFsQmlwU28wQUJ6YTNJZ0JrRUVhaWdDQUNJSlFZQ0NoQWdnQ1VHS2xLalFBSE5yY25GQmdJR0NoSGh4UVlDQmdvUjRSdzBDSUFaQkNHb2hCaUFBSUFSQkNHb2lCRThOQUFzTUFRdEJBQ0VBQTBBZ0FDQUZhaTBBQUVFS1JnMENJQWNnQUVFQmFpSUFSdzBBQ3lBQ0lRTU1Bd3NnQkNBSFJnUkFJQUloQXd3REN5QUVJQVZxSVFZZ0FpQUVheUFEYXlFSFFRQWhBQUpBQTBBZ0FDQUdhaTBBQUVFS1JnMEJJQWNnQUVFQmFpSUFSdzBBQ3lBQ0lRTU1Bd3NnQUNBRWFpRUFDeUFBSUFOcUlnUkJBV29oQXdKQUlBSWdCRTBOQUNBQUlBVnFMUUFBUVFwSERRQkJBQ0VGSUFNaUJBd0RDeUFDSUFOUERRQUxDeUFDSUFoR0RRSkJBU0VGSUFnaEJDQUNDeUVBQWtBZ0RDMEFBQVJBSUF0QmpPZkFBRUVFSUFvb0Fnd1JBd0FOQVFzZ0FDQUlheUVIUVFBaEJpQUFJQWhIQkVBZ0FDQU9haTBBQUVFS1JpRUdDeUFCSUFocUlRQWdEQ0FHT2dBQUlBUWhDQ0FMSUFBZ0J5QUtLQUlNRVFNQVJRMEJDd3RCQVNFTkN5QU5DNkVFQWd0L0FuNGpBRUhRQUdzaEJBSkFJQUJGRFFBZ0FrVU5BQ0FFUVFocUlnTkJFR29pQmlBQklBQkJiR3hxSWdzaUIwRVFhaWdDQURZQ0FDQURRUWhxSWdnZ0IwRUlhaWtDQURjREFDQUVJQWNwQWdBM0F3Z2dBa0VVYkNFSklBSWlBeUVGQTBBZ0N5QURRUlJzYWlFQkEwQWdBU2tDQUNFT0lBRWdCQ2tEQ0RjQ0FDQUlLUU1BSVE4Z0NDQUJRUWhxSWdvcEFnQTNBd0FnQ2lBUE53SUFJQVlvQWdBaENpQUdJQUZCRUdvaURDZ0NBRFlDQUNBTUlBbzJBZ0FnQkNBT053TUlJQUFnQTAxRkJFQWdBU0FKYWlFQklBSWdBMm9oQXd3QkN3c2dBeUFBYXlJREJFQWdBeUFGSUFNZ0JVa2JJUVVNQVFVZ0J5QUVLUU1JTndJQUlBZEJFR29nQkVFSWFpSUJRUkJxSWdZb0FnQTJBZ0FnQjBFSWFpQUJRUWhxSWdncEF3QTNBZ0JCQVNBRklBVkJBVTBiSVF0QkFTRURBMEFnQXlBTFJnMERJQVlnQnlBRFFSUnNhaUlGUVJCcUlnb29BZ0EyQWdBZ0NDQUZRUWhxSWd3cEFnQTNBd0FnQkNBRktRSUFOd01JSUFJZ0Eyb2hBUU5BSUFjZ0FVRVViR29pQ1NrQ0FDRU9JQWtnQkNrRENEY0NBQ0FJS1FNQUlROGdDQ0FKUVFocUlnMHBBZ0EzQXdBZ0RTQVBOd0lBSUFZb0FnQWhEU0FHSUFsQkVHb2lDU2dDQURZQ0FDQUpJQTAyQWdBZ0JDQU9Od01JSUFBZ0FVc0VRQ0FCSUFKcUlRRU1BUXNnQXlBQklBQnJJZ0ZIRFFBTElBVWdCQ2tEQ0RjQ0FDQUtJQVlvQWdBMkFnQWdEQ0FJS1FNQU53SUFJQU5CQVdvaEF3d0FDd0FMQUFzQUN3dlJCQUlEZndSK0l3QkIwQVpySWdRa0FDQUVRZndCYWtFQVFZVUVFQjRhSUFSQmdJREVBRFlDK0FFZ0JFRTBhaUlGSUFBZ0FVRUJJQUpCQUJBZklBUkIyQUJxSUFBZ0FVRUJRUUJCQUJBZklBUkJ4QVpxSWdZZ0FSQlZJQVJCaEFGcUlBQVFPU0FFUVFBNkFQQUJJQVFnQVRZQzFBRWdCQ0FBTmdMUUFTQUVRUUE3QWU0QklBUkJBam9BNmdFZ0JFRUNPZ0RtQVNBRVFRRTZBS1FCSUFSQ0FEY0NuQUVnQkNBQ05nS0FBU0FFUVFFMkFud2dCRUVBT3dIa0FTQUVRUUE2QVBVQklBUkJnSUFFTmdEeEFTQUVRZ0EzQXRnQklBUWdBVUVCYXpZQzRBRWdCRUVDT2dDd0FTQUVRUUk2QUxRQklBUkJBRFlDd0FFZ0JFRUNPZ0RFQVNBRVFRSTZBTWdCSUFSQmdJQ0FDRFlDekFFZ0JFSUFOd0tvQVNBRVFvQ0FnQWczQXJnQklBUkJtQUZxSUFaQkNHb29BZ0EyQWdBZ0JFRUFPZ0QyQVNBRUlBUXBBc1FHTndLUUFTQUVRU2hxSUFCQkFrRUlRWXpDd0FBUVlDQUVLUU1vSVFjZ0JFRWdhaUFBUVFKQkRFR2N3c0FBRUdBZ0JDa0RJQ0VJSUFSQkdHb2dBRUVFUVF4QnJNTEFBQkJnSUFRcEF4Z2hDU0FFUVJCcUlBQkJCRUVRUWJ6Q3dBQVFZQ0FFS1FNUUlRb2dCRUVJYWlBQVFRUkJCRUhNd3NBQUVHQWdCQ0FEUVFCSE9nREFCaUFFUVFBMkFyd0dJQVJCQURZQ3NBWWdCQ0FLTndLb0JpQUVRUUEyQXFRR0lBUWdDVGNDbkFZZ0JFRUFOZ0tZQmlBRUlBZzNBcEFHSUFSQkFEWUNqQVlnQkNBSE53S0VCaUFFSUFRcEF3ZzNBclFHUVp3R0VKa0JJZ0JCQURZQ0NDQUFRb0dBZ0lBUU53SUFJQUJCREdvZ0JVR1FCaEFXR2lBRVFkQUdhaVFBSUFCQkNHb0x4aEFDRVg4RWZpTUFRU0JySWd3a0FCQUFJUW9nREVFQU5nSWNJQXdnQ2pZQ0dDQU1JQUUyQWhRZ0RFRVVhaUFGRUlRQklBd29BaHdoQVNBR1FmLy9BM0c0RUFraEJTQU1LQUlZSWhVZ0FTQUZFQUVqQUVFZ2F5SUdKQUFDUUVHd3NzRUFLQUlBSWdVTkFFRzBzc0VBUVFBMkFnQkJzTExCQUVFQk5nSUFRYml5d1FBb0FnQWhBVUc4c3NFQUtBSUFJUWhCdUxMQkFFSFk2OEFBS1FJQUloZzNBZ0FnQmtFSWFrSGc2OEFBS1FJQUloazNBd0JCeExMQkFDZ0NBQ0VLUWNDeXdRQWdHVGNDQUNBR0lCZzNBd0FnQlVVTkFDQUlSUTBBQWtBZ0NrVU5BQ0FCUVFocUlRa2dBU2tEQUVKL2hVS0FnWUtFaUpDZ3dJQi9neUVaUVFFaEN5QUJJUVVEUUNBTFJRMEJJQmtoR0FOQUlCaFFCRUFnQlVIZ0FHc2hCU0FKS1FNQVFuK0ZRb0NCZ29TSWtLREFnSCtESVJnZ0NVRUlhaUVKREFFTEN5QVlRZ0Y5SUJpRElSa2dDa0VCYXlJS0lRc2dCU0FZZXFkQkEzWkJkR3hxUVFScktBSUFJZ2RCaEFGSkRRQWdCeEFEREFBTEFBc2dCa0VVYWlBSVFRRnFFRU1nQVNBR0tBSWNheUFHS0FJVUlBWW9BaGdRcGdFTElBWkJJR29rQUVHMHNzRUFLQUlBUlFSQVFiU3l3UUJCZnpZQ0FFRzhzc0VBS0FJQUlnRWdBM0VoQmlBRHJTSWFRaG1JUW9HQ2hJaVFvTUNBQVg0aEcwRzRzc0VBS0FJQUlRb0RRQ0FHSUFwcUtRQUFJaGtnRzRVaUdFS0Jnb1NJa0tEQWdBRjlJQmhDZjRXRFFvQ0Jnb1NJa0tEQWdIK0RJUmdDUUFKQUEwQWdHRUlBVWdSQUlBTWdDaUFZZXFkQkEzWWdCbW9nQVhGQmRHeHFJZ1ZCREdzb0FnQkdCRUFnQlVFSWF5Z0NBQ0FFUmcwREN5QVlRZ0Y5SUJpRElSZ01BUXNMSUJrZ0dVSUJob05DZ0lHQ2hJaVFvTUNBZjROUURRRkJ3TExCQUNnQ0FFVUVRQ01BUVRCcklnZ2tBQUpBQWtBQ1FFSEVzc0VBS0FJQUlncEJmMFlOQUVHOHNzRUFLQUlBSWdsQkFXb2lDMEVEZGlFQklBa2dBVUVIYkNBSlFRaEpHeUlPUVFGMklBcE5CRUFnQ0VFSWFnSi9JQW9nRGlBS0lBNUxHeUlCUVFkUEJFQWdBVUgrLy8vL0FVc05BMEYvSUFGQkEzUkJDR3BCQjI1QkFXdG5ka0VCYWd3QkMwRUVRUWdnQVVFRFNSc0xJZ0VRUXlBSUtBSUlJZ1ZGRFFFZ0NDZ0NFQ0VHSUFnb0Fnd2lDUVJBUWV5eXdRQXRBQUFhSUFVZ0NSQTFJUVVMSUFWRkRRSWdCU0FHYWtIL0FTQUJRUWhxRUI0aEN5QUlRUUEyQWlBZ0NDQUJRUUZySWdjMkFoZ2dDQ0FMTmdJVUlBaEJDRFlDRUNBSUlBY2dBVUVEZGtFSGJDQUJRUWxKR3lJT05nSWNJQXRCREdzaEVVRzRzc0VBS0FJQUlnWXBBd0JDZjRWQ2dJR0NoSWlRb01DQWY0TWhHQ0FHSVFFZ0NpRUpRUUFoQlFOQUlBa0VRQU5BSUJoUUJFQWdCVUVJYWlFRklBRXBBd2hDZjRWQ2dJR0NoSWlRb01DQWY0TWhHQ0FCUVFocUlRRU1BUXNMSUFnZ0N5QUhJQVlnR0hxblFRTjJJQVZxSWcxQmRHeHFJZ1pCREdzb0FnQWlFQ0FHUVFocktBSUFJQkFiclJCa0lCRWdDQ2dDQUVGMGJHb2lFRUc0c3NFQUtBSUFJZ1lnRFVGMGJHcEJER3NpRFNrQUFEY0FBQ0FRUVFocUlBMUJDR29vQUFBMkFBQWdDVUVCYXlFSklCaENBWDBnR0lNaEdBd0JDd3NnQ0NBS05nSWdJQWdnRGlBS2F6WUNIRUVBSVFFRFFDQUJRUkJIQkVBZ0FVRzRzc0VBYWlJRktBSUFJUVlnQlNBQklBaHFRUlJxSWdVb0FnQTJBZ0FnQlNBR05nSUFJQUZCQkdvaEFRd0JDd3NnQ0NnQ0dDSUJSUTBESUFoQkpHb2dBVUVCYWhCRElBZ29BaFFnQ0NnQ0xHc2dDQ2dDSkNBSUtBSW9FS1lCREFNTElBRWdDMEVIY1VFQVIyb2hCVUc0c3NFQUtBSUFJZ1loQVFOQUlBVUVRQ0FCSUFFcEF3QWlHRUovaFVJSGlFS0Jnb1NJa0tEQWdBR0RJQmhDLy83OSsvZnYzNy8vQUlSOE53TUFJQUZCQ0dvaEFTQUZRUUZySVFVTUFRVUNRQ0FMUVFoUEJFQWdCaUFMYWlBR0tRQUFOd0FBREFFTElBWkJDR29nQmlBTEVCSUxJQVpCQ0dvaEVTQUdRUXhySVJBZ0JpRUZRUUFoQVFOQUFrQUNRQ0FCSUF0SEJFQWdBU0FHYWlJVExRQUFRWUFCUncwQ0lBRkJkR3dpQnlBUWFpRVVJQVlnQjJvaUIwRUlheUVXSUFkQkRHc2hGd05BSUFFZ0Z5Z0NBQ0lISUJZb0FnQWdCeHNpQnlBSmNTSVBheUFHSUFrZ0I2MFFSQ0lOSUE5cmN5QUpjVUVJU1EwQ0lBWWdEV29pRHkwQUFDQVBJQWRCR1hZaUJ6b0FBQ0FSSUExQkNHc2dDWEZxSUFjNkFBQWdEVUYwYkNFSFFmOEJSd1JBSUFZZ0Iyb2hEVUYwSVFjRFFDQUhSUTBDSUFVZ0Iyb2lEeTBBQUNFU0lBOGdCeUFOYWlJUExRQUFPZ0FBSUE4Z0Vqb0FBQ0FIUVFGcUlRY01BQXNBQ3dzZ0UwSC9BVG9BQUNBUklBRkJDR3NnQ1hGcVFmOEJPZ0FBSUFjZ0VHb2lCMEVJYWlBVVFRaHFLQUFBTmdBQUlBY2dGQ2tBQURjQUFBd0NDMEhBc3NFQUlBNGdDbXMyQWdBTUJ3c2dFeUFIUVJsMklnYzZBQUFnRVNBQlFRaHJJQWx4YWlBSE9nQUFDeUFCUVFGcUlRRWdCVUVNYXlFRkRBQUxBQXNBQ3dBTEl3QkJJR3NpQUNRQUlBQkJBRFlDR0NBQVFRRTJBZ3dnQUVISTZzQUFOZ0lJSUFCQ0JEY0NFQ0FBUVFocVFmenF3QUFRaWdFQUN3QUxJQWhCTUdva0FBc2dBeUFFRUFnaEFTQU1RUWhxUWJpeXdRQW9BZ0JCdkxMQkFDZ0NBQ0FhRUdRZ0RDZ0NDQ0VGSUF3dEFBd2hCa0hFc3NFQVFjU3l3UUFvQWdCQkFXbzJBZ0JCd0xMQkFFSEFzc0VBS0FJQUlBWkJBWEZyTmdJQVFiaXl3UUFvQWdBZ0JVRjBiR29pQlVFRWF5QUJOZ0lBSUFWQkNHc2dCRFlDQUNBRlFReHJJQU0yQWdBTElBVkJCR3NvQWdBUUJDRUJRYlN5d1FCQnRMTEJBQ2dDQUVFQmFqWUNBQ0FDSUFFZ0ZSQUZJQUJCQURZQ0FDQU1RU0JxSkFBUEN5QU9RUWhxSWc0Z0Jtb2dBWEVoQmd3QUN3QUxJd0JCTUdzaUFDUUFJQUJCQVRZQ0RDQUFRZWpsd0FBMkFnZ2dBRUlCTndJVUlBQWdBRUV2YXExQ2dJQ0FnTEFCaERjRElDQUFJQUJCSUdvMkFoQWdBRUVJYWtIUTdNQUFFSW9CQUF1OUF3RUhmeUFCUVFGcklRbEJBQ0FCYXlFS0lBQkJBblFoQ0NBQ0tBSUFJUVVEUUFKQUlBVkZEUUFnQlNFQkEwQUNRQUpBQWtBQ2Z3SkFJQUVvQWdnaUJVRUJjVVVFUUNBQktBSUFRWHh4SWdzZ0FVRUlhaUlHYXlBSVNRMERJQXNnQ0dzZ0NuRWlCU0FHSUFNZ0FDQUVFUUlBUVFKMGFrRUlha2tFUUNBR0tBSUFJUVVnQmlBSmNRMEVJQUlnQlVGOGNUWUNBQ0FCSWdVb0FnQU1Bd3RCQUNFQ0lBVkJBRFlDQUNBRlFRaHJJZ1ZDQURjQ0FDQUZJQUVvQWdCQmZIRTJBZ0FDUUNBQktBSUFJZ0JCQW5FTkFDQUFRWHh4SWdCRkRRQWdBQ0FBS0FJRVFRTnhJQVZ5TmdJRUlBVW9BZ1JCQTNFaEFnc2dCU0FCSUFKeU5nSUVJQUVnQVNnQ0NFRitjVFlDQ0NBQklBRW9BZ0FpQUVFRGNTQUZjaUlDTmdJQUlBQkJBbkVOQVNBRktBSUFEQUlMSUFFZ0JVRitjVFlDQ0NBQktBSUVRWHh4SWdVRWYwRUFJQVVnQlMwQUFFRUJjUnNGUVFBTElRVWdBUkJBSUFFdEFBQkJBbkVOQXd3RUN5QUJJQUpCZlhFMkFnQWdCU2dDQUVFQ2Nnc2hBaUFGSUFKQkFYSTJBZ0FnQlVFSWFpRUhEQVFMSUFJZ0JUWUNBQXdFQ3lBRklBVW9BZ0JCQW5JMkFnQUxJQUlnQlRZQ0FDQUZJUUVNQUFzQUN3c2dCd3YwQXdFRmZ5TUFRVEJySWdZa0FDQUNJQUZySWdjZ0Ewc2hDU0FDUVFGcklnZ2dBQ2dDSENJRlFRRnJTUVJBSUFBZ0NFR2d6c0FBRUdKQkFEb0FEQXNnQXlBSElBa2JJUU1DUUFKQUlBRkZCRUFDUUNBQ0lBVkhCRUFnQmtFUWFpQUFLQUlZSUFRUUt5QUZRUVIwSUFKQkJIUnJJUWNnQUVFTWFpRUpJQUFvQWhRaUFTQUNJQVZyYWlFRUlBRWhBZ05BSUFORkJFQWdCaWdDRUNBR0tBSVVRUVJCRkJDZkFRd0ZDeUFHUVNCcUlBWkJFR29RVkNBQklBUkpEUUlnQ1NnQ0FDSUlJQUpHQkVBakFFRVFheUlGSkFBZ0JVRUlhaUFKSUFoQkFVRUVRUkFRSmlBRktBSUlJZ2hCZ1lDQWdIaEhCRUFnQlNnQ0RCb2dDRUd3enNBQUVLNEJBQXNnQlVFUWFpUUFDeUFBS0FJUUlBUkJCSFJxSVFVZ0FpQUVTd1JBSUFWQkVHb2dCU0FIRUJJTElBVWdCaWtDSURjQ0FDQUFJQUpCQVdvaUFqWUNGQ0FGUVFocUlBWkJLR29wQWdBM0FnQWdBMEVCYXlFRElBZEJFR29oQnd3QUN3QUxJQUFnQXlBQUtBSVlJQVFRTGd3Q0N5QUVJQUpCc003QUFCQk1BQXNnQUNBQlFRRnJRY0RPd0FBUVlrRUFPZ0FNSUFaQkNHb2dBQ0FCSUFKQjBNN0FBQkJuSUFZb0Fnd2lBU0FEU1EwQklBTWdCaWdDQ0NBRFFRUjBhaUFCSUFOckVCVWdBQ0FDSUFOcklBSWdCQkFxQ3lBQVFRRTZBQ0FnQmtFd2FpUUFEd3RCcE1qQUFFRWpRYnpKd0FBUWNRQUxsQU1CQlg4Q1FDQUNRUkJKQkVBZ0FDRUREQUVMQWtCQkFDQUFhMEVEY1NJRklBQnFJZ1FnQUUwTkFDQUZRUUZySUFBaEF5QUZCRUFnQlNFR0EwQWdBeUFCT2dBQUlBTkJBV29oQXlBR1FRRnJJZ1lOQUFzTFFRZEpEUUFEUUNBRElBRTZBQUFnQTBFSGFpQUJPZ0FBSUFOQkJtb2dBVG9BQUNBRFFRVnFJQUU2QUFBZ0EwRUVhaUFCT2dBQUlBTkJBMm9nQVRvQUFDQURRUUpxSUFFNkFBQWdBMEVCYWlBQk9nQUFJQVFnQTBFSWFpSURSdzBBQ3dzZ0JDQUNJQVZySWdKQmZIRnFJZ01nQkVzRVFDQUJRZjhCY1VHQmdvUUliQ0VGQTBBZ0JDQUZOZ0lBSUFSQkJHb2lCQ0FEU1EwQUN3c2dBa0VEY1NFQ0N3SkFJQUlnQTJvaUJTQURUUTBBSUFKQkFXc2dBa0VIY1NJRUJFQURRQ0FESUFFNkFBQWdBMEVCYWlFRElBUkJBV3NpQkEwQUN3dEJCMGtOQUFOQUlBTWdBVG9BQUNBRFFRZHFJQUU2QUFBZ0EwRUdhaUFCT2dBQUlBTkJCV29nQVRvQUFDQURRUVJxSUFFNkFBQWdBMEVEYWlBQk9nQUFJQU5CQW1vZ0FUb0FBQ0FEUVFGcUlBRTZBQUFnQlNBRFFRaHFJZ05IRFFBTEN5QUFDN0VEQVFWL0l3QkJRR29pQmlRQUlBWkJBRHNBRWlBR1FRSTZBQTRnQmtFQ09nQUtJQVpCTUdvaUIwRUlhaUlJSUFVZ0JrRUthaUFGR3lJRlFRaHFMd0FBT3dFQUlBWWdCU2tBQURjRE1DQUdRUlJxSUFFZ0J4QXJJQVlnQWtFRVFSQkI4TXpBQUJCZ0lBWkJBRFlDTENBR0lBWXBBd0EzQWlRZ0JrRWthaUFDRUkwQlFRRWdBaUFDUVFGTkd5SUpRUUZySVFjZ0JpZ0NLQ0FHS0FJc0lncEJCSFJxSVFVQ2Z3TkFJQWNFUUNBR1FUQnFJQVpCRkdvUVZDQUZJQVlwQWpBM0FnQWdCVUVJYWlBSUtRSUFOd0lBSUFkQkFXc2hCeUFGUVJCcUlRVU1BUVVDUUNBSklBcHFJUWNDUUNBQ1JRUkFJQVlvQWhRZ0JpZ0NHRUVFUVJRUW53RWdCMEVCYXlFSERBRUxJQVVnQmlrQ0ZEY0NBQ0FGUVFocUlBWkJIR29wQWdBM0FnQUxJQVlnQnpZQ0xDQURRUUZ4UlEwQUlBUUVRQ0FHUVNScUlBUVFqUUVMSUFSQkNtNGdCR29oQlVFQkRBTUxDd3NnQmtFa2FrSG9CeENOQVVFQUN5RURJQUFnQmlrQ0pEY0NEQ0FBSUFJMkFod2dBQ0FCTmdJWUlBQkJBRG9BSUNBQUlBVTJBZ2dnQUNBRU5nSUVJQUFnQXpZQ0FDQUFRUlJxSUFaQkxHb29BZ0EyQWdBZ0JrRkFheVFBQzZZREFRTi9Jd0JCRUdzaUJpUUFJQU1nQUNnQ0dDQUJheUlGSUFNZ0JVa2JJUU1nQVNBQUlBSkJvTTNBQUJCaUlnQW9BZ2dpQWtFQmF5SUZJQUVnQlVrYklRRWdBQ2dDQkNBQ0lBRkIyTmpBQUJDUUFTSUZLQUlFUlFSQUlBVkNvSUNBZ0JBM0FnQWdCU0FFS1FBQU53QUlJQVZCRUdvZ0JFRUlhaUlITHdBQU93QUFJQUFvQWdRZ0FDZ0NDQ0FCUVFGclFlall3QUFRa0FFaUJVS2dnSUNBRURjQ0FDQUZJQVFwQUFBM0FBZ2dCVUVRYWlBSEx3QUFPd0FBQ3lBR1FRaHFJQUFvQWdRZ0FDZ0NDQ0FCUWZqWXdBQVFmd0pBSUFNZ0JpZ0NEQ0lGVFFSQUlBVWdBMnNpQlNBR0tBSUlJQVZCRkd4cUlBTVFHU0FBS0FJRUlBQW9BZ2dnQVVHSTJjQUFFSkFCSWdFb0FnUkZCRUFnQVVLZ2dJQ0FFRGNDQUNBQklBUXBBQUEzQUFnZ0FVRVFhaUFFUVFocUx3QUFPd0FBSUFKRkRRSWdBQ2dDQkNBQ1FSUnNhaUlBUVJScklnRkZEUUlnQVVFZ05nSUFJQUJCRUd0QkFUWUNBQ0FBUVF4cklnQWdCQ2tBQURjQUFDQUFRUWhxSUFSQkNHb3ZBQUE3QUFBTElBWkJFR29rQUE4TFFjekp3QUJCSVVId3ljQUFFSEVBQzBHWTJjQUFFTFlCQUF2MkFnRUVmd0pBSUFBQ2Z3SkFBa0FDUUFKQUFrQWdBQ2dDcEFFaUFrRUJUUVJBQWtBZ0FVSC9BRXNOQUNBQUlBSnFRYkFCYWkwQUFFRUJjVVVOQUNBQlFRSjBRYmpRd0FCcUtBSUFJUUVMSUFBb0FtZ2lBeUFBS0FLY0FTSUVUdzBESUFBb0Ftd2hBaUFBTFFDOUFRMEJEQUlMSUFKQkFrR281Y0FBRUVzQUN5QUFJQU1nQWtFQklBQkJzZ0ZxRUNBTElBQWdBeUFDSUFFZ0FFR3lBV29RRXlJRkRRRUxJQUF0QUw4QkRRRWdBQ0FEUVFGcklBQW9BbXdpQWlBQklBQkJzZ0ZxSWdVUUUwVUVRQ0FBSUFOQkFtc2dBaUFCSUFVUUV4b0xJQVJCQVdzTUFnc2dBQ0FESUFWcUlnRTJBbWdnQVNBRVJ3MENJQUF0QUw4QkRRSWdCRUVCYXd3QkN3SkFJQUFvQW13aUFpQUFLQUtzQVVjRVFDQUNJQUFvQXFBQlFRRnJUdzBCSUFBZ0FoQ3dBU0FBSUFKQkFXb2lBallDYkF3QkN5QUFJQUlRc0FFZ0FFRUJFSWNCSUFBb0Ftd2hBZ3NnQUVFQUlBSWdBU0FBUWJJQmFoQVRDellDYUFzZ0FDZ0NZQ0FBS0FKa0lBSVFrUUVMK2dJQUFrQUNRQUpBQWtBQ1FBSkFBa0FnQTBFQmF3NEdBQUVDQXdRRkJnc2dBQ2dDR0NFRUlBQWdBa0hRemNBQUVHSWlBMEVBT2dBTUlBTW9BZ1FnQXlnQ0NDQUJJQVFnQlJBbklBQWdBa0VCYWlBQUtBSWNJQVVRS2c4TElBQW9BaGdoQXlBQUlBSkI0TTNBQUJCaUlnUW9BZ1FnQkNnQ0NFRUFJQUZCQVdvaUFTQURJQUVnQTBrYklBVVFKeUFBUVFBZ0FpQUZFQ29QQ3lBQVFRQWdBQ2dDSENBRkVDb1BDeUFBS0FJWUlRTWdBQ0FDUWZETndBQVFZaUlBS0FJRUlBQW9BZ2dnQVNBRElBVVFKeUFBUVFBNkFBd1BDeUFBS0FJWUlRTWdBQ0FDUVlET3dBQVFZaUlBS0FJRUlBQW9BZ2hCQUNBQlFRRnFJZ0FnQXlBQUlBTkpHeUFGRUNjUEN5QUFLQUlZSVFFZ0FDQUNRWkRPd0FBUVlpSUFLQUlFSUFBb0FnaEJBQ0FCSUFVUUp5QUFRUUE2QUF3UEN5QUFLQUlZSVFNZ0FDQUNRY0ROd0FBUVlpSUFLQUlFSUFBb0FnZ2dBU0FCSUFRZ0F5QUJheUlCSUFFZ0JFc2JhaUlCSUFVUUp5QUJJQU5HQkVBZ0FFRUFPZ0FNQ3d2VUFnRUZmeU1BUVVCcUlnTWtBQ0FEUVFBMkFpQWdBeUFCTmdJWUlBTWdBU0FDYWpZQ0hDQURRUkJxSUFOQkdHb1FUUUpBSUFNb0FoQkZCRUFnQUVFQU5nSUlJQUJDZ0lDQWdNQUFOd0lBREFFTElBTW9BaFFoQkNBRFFRaHFRUVJCQkVFRVFaVEl3QUFRWUNBREtBSUlJUVVnQXlnQ0RDSUdJQVEyQWdBZ0EwRUJOZ0lzSUFNZ0JqWUNLQ0FESUFVMkFpUWdBMEU0YWlBRFFTQnFLQUlBTmdJQUlBTWdBeWtDR0RjRE1FRUVJUVZCQVNFRUEwQWdBeUFEUVRCcUVFMGdBeWdDQUVFQlIwVUVRQ0FES0FJRUlRY2dBeWdDSkNBRVJnUkFJQU5CSkdvZ0JFRUJRUVJCQkJCdElBTW9BaWdoQmdzZ0JTQUdhaUFITmdJQUlBTWdCRUVCYWlJRU5nSXNJQVZCQkdvaEJRd0JDd3NnQUNBREtRSWtOd0lBSUFCQkNHb2dBMEVzYWlnQ0FEWUNBQXNEUUNBQ0JFQWdBVUVBT2dBQUlBSkJBV3NoQWlBQlFRRnFJUUVNQVFzTElBTkJRR3NrQUF2S0FnSUZmd0orSXdCQklHc2lBaVFBSUFBQ2Z3SkFBa0FnQVMwQUlFVUVRQXdCQ3lBQlFRQTZBQ0FDUUNBQktBSUFRUUZHQkVBZ0FTZ0NGQ0lGSUFFb0FoeHJJZ01nQVNnQ0NFc05BUXNNQVFzZ0JTQURJQUVvQWdScklnUlBCRUJCQUNFRElBRkJBRFlDRkNBQ0lBRkJER28yQWhRZ0FpQUJLQUlRSWdZMkFnd2dBaUFFTmdJWUlBSWdCU0FFYXpZQ0hDQUNJQVlnQkVFRWRHbzJBaEFnQVMwQXZBRU5Ba0VVUVFRUWZDRUJJQUpCREdvaUEwRUlhaWtDQUNFSElBSXBBZ3doQ0NBQlFSQnFJQU5CRUdvb0FnQTJBZ0FnQVVFSWFpQUhOd0lBSUFFZ0NEY0NBRUdnNU1BQURBTUxJQVFnQlVIMHk4QUFFTE1CQUFzZ0FrRUFOZ0lNUVFFaEF5QUJMUUM4QVEwQVFRQkJBUkI4SVFGQmhPVEFBQXdCQzBFQVFRRVFmQ0VCSUFORkJFQWdBa0VNYWhCWUMwR0U1TUFBQ3pZQ0JDQUFJQUUyQWdBZ0FrRWdhaVFBQzVJQ0FRVi9Ba0FDUUFKQVFYOGdBQ2dDbkFFaUF5QUJSeUFCSUFOSkcwSC9BWEVPQWdJQkFBc2dBQ0FBS0FKWUlnTUVmeUFBS0FKVUlRVURRQ0FEUVFKSlJRUkFJQU5CQVhZaUJpQUVhaUlISUFRZ0JTQUhRUUowYWlnQ0FDQUJTUnNoQkNBRElBWnJJUU1NQVFzTElBUWdCU0FFUVFKMGFpZ0NBQ0FCU1dvRlFRQUxOZ0pZREFFTFFRQWdBU0FEUVhoeFFRaHFJZ1JySWdOQkFDQUJJQU5QR3lJRFFRTjJJQU5CQjNGQkFFZHFheUVESUFCQjBBQnFJUVVEUUNBRFJRMEJJQVVnQkVIYzRzQUFFSHNnQTBFQmFpRURJQVJCQ0dvaEJBd0FDd0FMSUFJZ0FDZ0NvQUZIQkVBZ0FFRUFOZ0tvQVNBQUlBSkJBV3MyQXF3QkN5QUFJQUkyQXFBQklBQWdBVFlDbkFFZ0FCQVJDL0lCQWdSL0FYNGpBRUVRYXlJR0pBQUNRQ0FDSUFJZ0Eyb2lBMHNFUUVFQUlRSU1BUXRCQUNFQ0lBUWdCV3BCQVd0QkFDQUVhM0d0UVFoQkJDQUZRUUZHR3lJSElBRW9BZ0FpQ0VFQmRDSUpJQU1nQXlBSlNSc2lBeUFESUFkSkd5SUhyWDRpQ2tJZ2lLY05BQ0FLcHlJRFFZQ0FnSUI0SUFSclN3MEFJQVFoQWdKL0lBZ0VRQ0FGUlFSQUlBWkJDR29nQkNBREVJd0JJQVlvQWdnTUFnc2dBU2dDQkNBRklBaHNJQVFnQXhCK0RBRUxJQVlnQkNBREVJd0JJQVlvQWdBTElnVkZEUUFnQVNBSE5nSUFJQUVnQlRZQ0JFR0JnSUNBZUNFQ0N5QUFJQU0yQWdRZ0FDQUNOZ0lBSUFaQkVHb2tBQXVaQWdFRGZ3SkFBa0FDUUNBQklBSkdEUUFnQUNBQklBSkJvTlhBQUJDUUFTZ0NCRVVFUUNBQUlBRWdBa0VCYTBHdzFjQUFFSkFCSWdWQ29JQ0FnQkEzQWdBZ0JTQUVLUUFBTndBSUlBVkJFR29nQkVFSWFpOEFBRHNBQUFzZ0FpQURTdzBCSUFFZ0Ewa05BaUFEUVJSc0lnWWdBa0VVYkNJQ2F5RUZJQUFnQW1vaEFpQUVRUWhxSVFjRFFDQUZCRUFnQWtLZ2dJQ0FFRGNDQUNBQ0lBUXBBQUEzQUFnZ0FrRVFhaUFITHdBQU93QUFJQVZCRkdzaEJTQUNRUlJxSVFJTUFRc0xJQUVnQTAwTkFDQUFJQVpxSWdBb0FnUU5BQ0FBUXFDQWdJQVFOd0lBSUFBZ0JDa0FBRGNBQ0NBQVFSQnFJQVJCQ0dvdkFBQTdBQUFMRHdzZ0FpQURRY0RWd0FBUXRRRUFDeUFESUFGQndOWEFBQkN6QVFBTGl3SUJBMzhqQUVFd2F5SURKQUFnQXlBQ05nSVlJQU1nQVRZQ0ZBSkFJQU5CRkdvUVdpSUJRZi8vQTNGQkEwWUVRQ0FBUVFBMkFnZ2dBRUtBZ0lDQUlEY0NBQXdCQ3lBRFFRaHFRUVJCQWtFQ1FaVEl3QUFRWUNBREtBSUlJUUlnQXlnQ0RDSUVJQUU3QVFBZ0EwRUJOZ0lrSUFNZ0JEWUNJQ0FESUFJMkFod2dBeUFES1FJVU53SW9RUUloQVVFQklRSURRQ0FEUVNocUVGb2lCVUgvL3dOeFFRTkdSUVJBSUFNb0Fod2dBa1lFUUNBRFFSeHFJQUpCQVVFQ1FRSVFiU0FES0FJZ0lRUUxJQUVnQkdvZ0JUc0JBQ0FESUFKQkFXb2lBallDSkNBQlFRSnFJUUVNQVFzTElBQWdBeWtDSERjQ0FDQUFRUWhxSUFOQkpHb29BZ0EyQWdBTElBTkJNR29rQUF1RkFnRURmeU1BUVRCcklnTWtBQ0FESUFJMkFoZ2dBeUFCTmdJVUFrQWdBMEVVYWhCT1FmLy9BM0VpQVVVRVFDQUFRUUEyQWdnZ0FFS0FnSUNBSURjQ0FBd0JDeUFEUVFocVFRUkJBa0VDUVpUSXdBQVFZQ0FES0FJSUlRSWdBeWdDRENJRUlBRTdBUUFnQTBFQk5nSWtJQU1nQkRZQ0lDQURJQUkyQWh3Z0F5QURLUUlVTndJb1FRSWhBVUVCSVFJRFFDQURRU2hxRUU1Qi8vOERjU0lGQkVBZ0F5Z0NIQ0FDUmdSQUlBTkJIR29nQWtFQlFRSkJBaEJ0SUFNb0FpQWhCQXNnQVNBRWFpQUZPd0VBSUFNZ0FrRUJhaUlDTmdJa0lBRkJBbW9oQVF3QkN3c2dBQ0FES1FJY053SUFJQUJCQ0dvZ0EwRWthaWdDQURZQ0FBc2dBMEV3YWlRQUM0TUNBUUovSXdCQk1Hc2lCQ1FBSUFSQkVHb2dBQ2dDR0NBREVDc2dCRUVJYWlBQUVISWdCQ0FCSUFJZ0JDZ0NDQ0FFS0FJTVFlRFB3QUFRYkFKQUlBUW9BZ1FpQUVVRVFDQUVLQUlRSUFRb0FoUkJCRUVVRUo4QkRBRUxJQUJCQkhRaUFVRVFheUVESUFFZ0JDZ0NBQ0lBYWlJQ1FSQnJJUUVEUUNBREJFQWdCRUVnYWlJRklBUkJFR29RVkNBQUtBSUFJQUJCQkdvb0FnQkJCRUVVRUo4QklBQkJDR29nQlVFSWFpa0NBRGNDQUNBQUlBUXBBaUEzQWdBZ0EwRVFheUVESUFCQkVHb2hBQXdCQlNBQktBSUFJQUpCREdzb0FnQkJCRUVVRUo4QklBRkJDR29nQkVFWWFpa0NBRGNDQUNBQklBUXBBaEEzQWdBTEN3c2dCRUV3YWlRQUM0QUNBUVovSXdCQklHc2lBeVFBSUFOQkNHb2dBVUVFUVJSQmtOWEFBQkJnSUFOQkFEWUNIQ0FESUFNcEF3ZzNBaFFnQTBFVWFpQUJFSTRCUVFFZ0FTQUJRUUZOR3lJR1FRRnJJUVVnQXlnQ0dDQURLQUljSWdkQkZHeHFJUVFnQWtFSWFpRUlBa0FEUUNBRkJFQWdCRUtnZ0lDQUVEY0NBQ0FFSUFJcEFBQTNBQWdnQkVFUWFpQUlMd0FBT3dBQUlBVkJBV3NoQlNBRVFSUnFJUVFNQVFVQ1FDQUdJQWRxSVFVZ0FRMEFJQVZCQVdzaEJRd0RDd3NMSUFSQ29JQ0FnQkEzQWdBZ0JDQUNLUUFBTndBSUlBUkJFR29nQWtFSWFpOEFBRHNBQUFzZ0FDQURLUUlVTndJQUlBQkJDR29nQlRZQ0FDQUFRUUE2QUF3Z0EwRWdhaVFBQzlRQkFRVi9Ba0FnQUNnQ2hBUWlBVUYvUndSQUlBRkJBV29oQXlBQlFTQkpEUUVnQTBFZ1FkVGJ3QUFRc3dFQUMwSFUyOEFBRUgwQUN5QUFRUVJxSWdFZ0EwRUVkR29oQlFOQUlBRWdCVVpGQkVBQ1FDQUJLQUlBSWdKQmYwY0VRQ0FDUVFaSkRRRWdBa0VCYWtFR1FhVGh3QUFRc3dFQUMwR2s0Y0FBRUgwQUN5QUJRUVJxSVFRZ0FVRVFhaUFDUVFGMFFRSnFJUUlEUUNBQ0JFQWdCRUVBT3dFQUlBSkJBbXNoQWlBRVFRSnFJUVFNQVFzTElBRkJBRFlDQUNFQkRBRUxDeUFBUVlDQXhBQTJBZ0FnQUVFQU5nS0VCQXZ6QVFFQmZ3SkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQWdBU2dDQUNJRFFZQ0F4QUJHQkVBZ0FrSGcvLzhBY1VIQUFFWU5BU0FDUVRkckRnSURCQUlMSUFKQk1FWU5CaUFDUVRoR0RRVWdBMEVvYXc0Q0NRb05DeUFBSUFKQlFHc1FTQThMSUFKQjR3QkdEUUlNQ3dzZ0FFRVJPZ0FBRHdzZ0FFRVBPZ0FBRHdzZ0FFRWtPZ0FBSUFGQkFEb0FpQVFQQ3lBRFFTTnJEZ2NCQndjSEJ3TUdCd3NnQTBFb2F3NENBUVFHQ3lBQVFRNDZBQUFQQ3lBQVFab0NPd0VBRHdzZ0FFRWFPd0VBRHdzZ0FrRXdSdzBCQ3lBQVFaa0NPd0VBRHdzZ0FFRVpPd0VBRHdzZ0FFRXlPZ0FBQzhVQkFRSi9Jd0JCTUdzaUJDUUFJQVJCREdvZ0FpQURFQ3NnQkNBQk5nSWNJQUJCREdvZ0FSQ05BU0FCQkVBZ0FDZ0NFQ0FBS0FJVUlnSkJCSFJxSVFNQ1FBTkFBa0FnQkVFZ2FpSUZJQVJCREdvUVZDQUVLQUlnUVlDQWdJQjRSZzBBSUFNZ0JDa0NJRGNDQUNBRFFRaHFJQVZCQ0dvcEFnQTNBZ0FnQTBFUWFpRURJQUpCQVdvaEFpQUJRUUZySWdFTkFRd0NDd3RCZ0lDQWdIZ2dCQ2dDSkJDakFRc2dBQ0FDTmdJVUN5QUVLQUlNSUFRb0FoQkJCRUVVRUo4QklBUkJNR29rQUF1SEFRRURmeU1BUVNCcklnRWtBQ0FCUVFScUlBQVFWaUFCS0FJRUlnQXRBSEJCQVhFRWZ5QUFLQUpzSVFNZ0FDZ0NhQ0VBSUFGQkFEWUNFQkFBSVFJZ0FVRUFOZ0ljSUFFZ0FqWUNHQ0FCSUFGQkVHbzJBaFFnQVVFVWFpSUNJQUFRaEFFZ0FpQURFSVFCSUFFb0FoZ0ZRWUFCQ3lBQktBSUlJQUVvQWd3UW9nRWdBVUVnYWlRQUM4RUJBUVYvSXdCQkVHc2lBaVFBUVFFaEJBSkFJQUVvQWh3aUEwRzdnTUFBUVFVZ0FTZ0NJQ0lHS0FJTUlnVVJBd0FOQUFKQUlBRXRBQlJCQkhGRkJFQWdBMEdTNThBQVFRRWdCUkVEQUEwQ0lBQWdBeUFHRURkRkRRRU1BZ3NnQTBHVDU4QUFRUUlnQlJFREFBMEJJQUlnQmpZQ0JDQUNJQU0yQWdBZ0FrRUJPZ0FQSUFJZ0FrRVBhallDQ0NBQUlBSkI5T2JBQUJBM0RRRWdBa0dRNThBQVFRSVFHQTBCQ3lBRFFaYXF3UUJCQVNBRkVRTUFJUVFMSUFKQkVHb2tBQ0FFQzdBQkFRRi9JQUJCQURZQ0FDQUFRUWhySWdRZ0JDZ0NBRUYrY1RZQ0FBSkFJQUlnQXhFRkFFVU5BQUpBQWtBZ0FFRUVheWdDQUVGOGNTSUNSUTBBSUFJdEFBQkJBWEVOQUNBRUVFQWdCQzBBQUVFQ2NVVU5BU0FDSUFJb0FnQkJBbkkyQWdBUEN5QUVLQUlBSWdKQkFuRU5BU0FDUVh4eElnSkZEUUVnQWkwQUFFRUJjUTBCSUFBZ0FpZ0NDRUY4Y1RZQ0FDQUNJQVJCQVhJMkFnZ0xEd3NnQUNBQktBSUFOZ0lBSUFFZ0JEWUNBQXVuQVFFQ2Z5TUFRU0JySWdJa0FDQUNJQUFvQW1nMkFnd2dBa0VBT2dBY0lBSWdBQ2dDVkNJRE5nSVFJQUlnQXlBQUtBSllRUUowYWpZQ0ZDQUNJQUpCREdvMkFoZ2dBQUovQWtBQ1FBTkFJQUZCQVdzaUFRUkFJQUpCRUdvUVNRMEJEQUlMQ3lBQ1FSQnFFRWtpQVEwQkN5QUFLQUtjQVNJRFFRRnJJZ0FNQVFzZ0FDZ0NuQUVpQTBFQmF5RUFJQUVvQWdBTElnRWdBQ0FCSUFOSkd6WUNhQ0FDUVNCcUpBQUxvd0VCQVg4akFFRkFhaUlESkFBZ0EwRWNhaUFBRUY0Z0F5Z0NIQ0lBSUFFZ0FoQWxJQU5CS0dvZ0FFSGdBR29vQWdBZ0FFSGtBR29vQWdBUUl5QURRUkJxSUFBUUpDQURJQU1wQXhBM0FqUWdBMEVJYWlBREtBSXNJQU1vQWpBUVd5QURLQUlNSVFBZ0F5Z0NDRUVCY1FSQUlBTWdBRFlDUENBRFFUeHFRZXpDd0FBUVFnQUxJQU5CS0dvUWJpQURLQUlnSUFNb0FpUVFzZ0VnQTBGQWF5UUFJQUFMbVFFQkEzOGdBVUZzYkNFQ0lBRkIvLy8vL3dOeElRTWdBQ0FCUVJSc2FpRUJRUUFoQUFKQUEwQWdBa1VOQVFKQUlBRkJGR3NpQkNnQ0FFRWdSdzBBSUFGQkVHc29BZ0JCQVVjTkFDQUJRUXhyTFFBQVFRSkhEUUFnQVVFSWF5MEFBRUVDUncwQUlBRkJCR3N0QUFBTkFDQUJRUU5yTFFBQVFSOXhEUUFnQWtFVWFpRUNJQUJCQVdvaEFDQUVJUUVNQVFzTElBQWhBd3NnQXd1eEFRRUNmeU1BUVJCcklnSWtBQUpBSUFGRkRRQWdBVUVEYWtFQ2RpRUJBa0FnQUVFRVRRUkFJQUZCQVdzaUEwR0FBa2tOQVFzZ0FrR3Nzc0VBS0FJQU5nSUlJQUVnQUNBQ1FRaHFRYWlxd1FCQkJFRUZFRThoQUVHc3NzRUFJQUlvQWdnMkFnQU1BUXNnQWtHc3NzRUFOZ0lFSUFJZ0EwRUNkRUdzcXNFQWFpSURLQUlBTmdJTUlBRWdBQ0FDUVF4cUlBSkJCR3BCQmtFSEVFOGhBQ0FESUFJb0FndzJBZ0FMSUFKQkVHb2tBQ0FBQzZBQkFRTi9Jd0JCRUdzaUJTUUFJQVZCQ0dvZ0FDQUJJQUpCNE03QUFCQm5JQVVvQWd3aUJpQURJQUlnQVdzaUJ5QURJQWRKR3lJRFR3UkFJQVlnQTJzaUJpQUZLQUlJSUFaQkJIUnFJQU1RRlNBQUlBRWdBU0FEYWlBRUVDb2dBUVJBSUFBZ0FVRUJhMEh3enNBQUVHSkJBRG9BREFzZ0FDQUNRUUZyUVlEUHdBQVFZa0VBT2dBTUlBVkJFR29rQUE4TFFjekp3QUJCSVVId3ljQUFFSEVBQzZnQkFRRi9Jd0JCUUdvaUF5UUFJQU5CQ0dvZ0FDZ0NBQkFDSUFNb0FnZ2hBQ0FESUFNb0FndzJBZ1FnQXlBQU5nSUFJQU5CQVRZQ01DQURRUUkyQWhnZ0EwR1lxc0VBTmdJVUlBTkNBVGNDSUNBRElBTW9BZ1FpQURZQ1BDQURJQU1vQWdBMkFqZ2dBeUFBTmdJMElBTWdBMEUwYWpZQ0xDQURJQU5CTEdvMkFod2dBU0FDSUFOQkZHb1FGeUFES0FJMElnRUVRQ0FES0FJNFFRRWdBUkE0Q3lBRFFVQnJKQUFMcEFFQkFYOGpBRUVRYXlJREpBQUNRQ0FBUlEwQUlBSkZEUUFDUUNBQlFRUk5CRUFnQWtFRGFrRUNka0VCYXlJQlFZQUNTUTBCQ3lBRFFheXl3UUFvQWdBMkFnZ2dBQ0FEUVFocVFhaXF3UUJCQWhBeFFheXl3UUFnQXlnQ0NEWUNBQXdCQ3lBRFFheXl3UUEyQWdRZ0F5QUJRUUowUWF5cXdRQnFJZ0VvQWdBMkFnd2dBQ0FEUVF4cUlBTkJCR3BCQXhBeElBRWdBeWdDRERZQ0FBc2dBMEVRYWlRQUM0c0JBUUovSXdCQkVHc2lBaVFBSUFKQ2dJQ0FnTUFBTndJRUlBSkJBRFlDRENBQlFRaHJJZ05CQUNBQklBTlBHeUlCUVFOMklBRkJCM0ZCQUVkcUlRRkJDQ0VEQTBBZ0FRUkFJQUpCQkdvZ0EwR3M0c0FBRUhzZ0FVRUJheUVCSUFOQkNHb2hBd3dCQlNBQUlBSXBBZ1EzQWdBZ0FFRUlhaUFDUVF4cUtBSUFOZ0lBSUFKQkVHb2tBQXNMQzQwQkFRUi9JQUVnQUNnQ0FDQUFLQUlJSWdSclN3UkFJQUFnQkNBQlFRRkJBUkJ0SUFBb0FnZ2hCQXNnQUNnQ0JDQUVhaUVGUVFFZ0FTQUJRUUZOR3lJR1FRRnJJUU1DUUFOQUlBTUVRQ0FGSUFJNkFBQWdBMEVCYXlFRElBVkJBV29oQlF3QkJRSkFJQVFnQm1vaEF5QUJEUUFnQTBFQmF5RUREQU1MQ3dzZ0JTQUNPZ0FBQ3lBQUlBTTJBZ2dMQXdBQUMzb0JBbjhDZnlBQ1JRUkFRUUVNQVFzRFFDQUNRUUZOQkVBQ1FDQUJJQVJCQW5ScUtBSUFJZ0VnQTBjTkFFRUFEQU1MQlNBRUlBSkJBWFlpQlNBRWFpSUVJQUVnQkVFQ2RHb29BZ0FnQTBzYklRUWdBaUFGYXlFQ0RBRUxDeUFFSUFFZ0EwbHFJUVJCQVFzaEFpQUFJQVEyQWdRZ0FDQUNOZ0lBQzRnQkFRSi9Jd0JCRUdzaUF5UUFJQU1nQVNnQ0FDSUZLQUlBTmdJTVFRRWhCRUdBRUNBQ1FRSnFJZ0VnQVd3aUFTQUJRWUFRVFJzaUFrRUVJQU5CREdwQkFVRUVRUVVRVHlFQklBVWdBeWdDRERZQ0FDQUJCRUFnQVVJQU53SUVJQUVnQVNBQ1FRSjBha0VDY2pZQ0FFRUFJUVFMSUFBZ0FUWUNCQ0FBSUFRMkFnQWdBMEVRYWlRQUM0MEJBUU4vSXdCQmtBWnJJZ01rQUNBQUVLZ0JJQUJCQ0dzaEFnSkFBa0FnQVVVRVFDQUNLQUlBUVFGSERRSWdBeUFBUVFScVFaQUdFQllnQWtFQU5nSUFBa0FnQWtGL1JnMEFJQUJCQkdzaUJDZ0NBRUVCYXlFQUlBUWdBRFlDQUNBQURRQWdBa0VFUVp3R0VEZ0xFRWNNQVFzZ0FoQ2NBUXNnQTBHUUJtb2tBQThMUWFEQndBQkJQeEM1QVFBTDN3RUJCSDhqQUVFUWF5SUVKQUFnQVNnQ0NDSURJQUpQQkVBZ0JFRUlhaUFESUFKcklnTkJCRUVVUWNqYXdBQVFZQ0FFS0FJSUlRVWdCQ2dDRENBQklBSTJBZ2dnQVNnQ0JDQUNRUlJzYWlBRFFSUnNFQlloQVNBQUlBTTJBZ2dnQUNBQk5nSUVJQUFnQlRZQ0FDQUVRUkJxSkFBUEN5TUFRVEJySWdBa0FDQUFJQU0yQWdRZ0FDQUNOZ0lBSUFCQkF6WUNEQ0FBUWZqRndBQTJBZ2dnQUVJQ053SVVJQUFnQUVFRWFxMUNnSUNBZ09BQmhEY0RLQ0FBSUFDdFFvQ0FnSURnQVlRM0F5QWdBQ0FBUVNCcU5nSVFJQUJCQ0dwQnlOckFBQkNLQVFBTGZnRURmd0pBSUFBb0FnQWlBVUVDY1EwQUlBRkJmSEVpQWtVTkFDQUNJQUlvQWdSQkEzRWdBQ2dDQkVGOGNYSTJBZ1FnQUNnQ0FDRUJDeUFBS0FJRUlnSkJmSEVpQXdSQUlBTWdBeWdDQUVFRGNTQUJRWHh4Y2pZQ0FDQUFLQUlFSVFJZ0FDZ0NBQ0VCQ3lBQUlBSkJBM0UyQWdRZ0FDQUJRUU54TmdJQUMzOEJBbjhnQUNBQklBQW9BZ2dpQTJzaUJCQ09BU0FFQkVBZ0F5QUJheUVFSUFFZ0FDZ0NDQ0lCYWlBRGF5RURJQUFvQWdRZ0FVRVViR29oQVFOQUlBRkNvSUNBZ0JBM0FnQWdBVUVJYWlBQ0tRQUFOd0FBSUFGQkVHb2dBa0VJYWk4QUFEc0FBQ0FCUVJScUlRRWdCRUVCYWlJRURRQUxJQUFnQXpZQ0NBc0xnZ0VCQVg4akFFRkFhaUlDSkFBZ0FrRXJOZ0lNSUFKQmtJREFBRFlDQ0NBQ1FZQ0F3QUEyQWhRZ0FpQUFOZ0lRSUFKQkFqWUNIQ0FDUWVUbXdBQTJBaGdnQWtJQ053SWtJQUlnQWtFUWFxMUNnSUNBZ01BQmhEY0RPQ0FDSUFKQkNHcXRRb0NBZ0lEUUFZUTNBekFnQWlBQ1FUQnFOZ0lnSUFKQkdHb2dBUkNLQVFBTGRnSUJmd0YrQWtBQ1FDQUJyVUlNZmlJRFFpQ0lwdzBBSUFPbklnSkJlRXNOQUNBQ1FRZHFRWGh4SWdJZ0FVRUlhbW9oQVNBQklBSkpEUUVnQVVINC8vLy9CMDBFUUNBQUlBSTJBZ2dnQUNBQk5nSUVJQUJCQ0RZQ0FBOExJQUJCQURZQ0FBOExJQUJCQURZQ0FBOExJQUJCQURZQ0FBdDJBUUovSUFLbklRTkJDQ0VFQTBBZ0FTQURjU0lESUFCcUtRQUFRb0NCZ29TSWtLREFnSCtESWdKQ0FGSkZCRUFnQXlBRWFpRURJQVJCQ0dvaEJBd0JDd3NnQW5xblFRTjJJQU5xSUFGeElnRWdBR29zQUFCQkFFNEVmeUFBS1FNQVFvQ0Jnb1NJa0tEQWdIK0RlcWRCQTNZRklBRUxDM1FCQm44Z0FDZ0NCQ0VHSUFBb0FnQWhBZ0pBQTBBZ0FTQURSZzBCQWtBZ0FpQUdSZzBBSUFBZ0FrRVFhaUlITmdJQUlBSW9BZ1FoQlNBQ0tBSUFJZ0pCZ0lDQWdIaEdEUUFnQWlBRkVLTUJJQU5CQVdvaEF5QUhJUUlNQVFzTFFZQ0FnSUI0SUFVUW93RWdBU0FEYXlFRUN5QUVDMm9BQW44Z0FrRUNkQ0lCSUFOQkEzUkJnSUFCYWlJQ0lBRWdBa3NiUVllQUJHb2lBVUVRZGtBQUlnSkJmMFlFUUVFQUlRSkJBUXdCQ3lBQ1FSQjBJZ0pDQURjQ0JDQUNJQUlnQVVHQWdIeHhha0VDY2pZQ0FFRUFDeUVESUFBZ0FqWUNCQ0FBSUFNMkFnQUxrQUVBSUFBUW5nRWdBRUVrYWhDZUFTQUFLQUpRSUFBb0FsUkJCRUVFRUo4QklBQW9BbHdnQUNnQ1lFRUJRUUVRbndFZ0FDZ0MwQVVnQUNnQzFBVkJBa0VJRUo4QklBQW9BdHdGSUFBb0F1QUZRUUpCREJDZkFTQUFLQUxvQlNBQUtBTHNCVUVFUVF3UW53RWdBQ2dDOUFVZ0FDZ0MrQVZCQkVFUUVKOEJJQUFvQW9BR0lBQW9Bb1FHUVFSQkJCQ2ZBUXVEQVFFQmZ3SkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FnQVVFSWF3NElBUUlHQmdZREJBVUFDMEV5SVFJZ0FVR0VBV3NPQ2dVR0NRa0hDUWtKQ1FnSkN3d0lDMEViSVFJTUJ3dEJCaUVDREFZTFFTd2hBZ3dGQzBFcUlRSU1CQXRCSHlFQ0RBTUxRU0FoQWd3Q0MwRWNJUUlNQVF0Qkl5RUNDeUFBSUFJNkFBQUxhd0VIZnlBQUtBSUlJUU1nQUNnQ0JDRUVJQUF0QUF4QkFYRWhCU0FBS0FJQUlnSWhBUUpBQTBBZ0FTQUVSZ1JBUVFBUEN5QUFJQUZCQkdvaUJqWUNBQ0FGRFFFZ0FTZ0NBQ0VISUFZaEFTQURLQUlBSUFkUERRQUxJQUZCQkdzaEFnc2dBRUVCT2dBTUlBSUxld0VDZnlNQVFSQnJJZ01rQUVITXNzRUFRY3l5d1FBb0FnQWlCRUVCYWpZQ0FBSkFJQVJCQUVnTkFBSkFRZFN5d1FBdEFBQkZCRUJCMExMQkFFSFFzc0VBS0FJQVFRRnFOZ0lBUWNpeXdRQW9BZ0JCQUU0TkFRd0NDeUFEUVFocUlBQWdBUkVBQUFBTFFkU3l3UUJCQURvQUFDQUNSUTBBQUFzQUMyc0JBWDhqQUVFd2F5SURKQUFnQXlBQk5nSUVJQU1nQURZQ0FDQURRUUkyQWd3Z0EwSFE1c0FBTmdJSUlBTkNBamNDRkNBRElBT3RRb0NBZ0lEZ0FZUTNBeWdnQXlBRFFRUnFyVUtBZ0lDQTRBR0VOd01nSUFNZ0EwRWdhallDRUNBRFFRaHFJQUlRaWdFQUMyc0JBWDhqQUVFd2F5SURKQUFnQXlBQk5nSUVJQU1nQURZQ0FDQURRUU0yQWd3Z0EwR2N4Y0FBTmdJSUlBTkNBamNDRkNBRElBTkJCR3F0UW9DQWdJRGdBWVEzQXlnZ0F5QURyVUtBZ0lDQTRBR0VOd01nSUFNZ0EwRWdhallDRUNBRFFRaHFJQUlRaWdFQUMyY0JCMzhnQVNnQ0NDRURJQUVvQWdBaEFpQUJLQUlFSVFZRFFBSkFJQU1oQkNBQ0lBWkdCRUJCQUNFRkRBRUxRUUVoQlNBQklBSkJBV29pQnpZQ0FDQUJJQVJCQVdvaUF6WUNDQ0FDTFFBQUlBY2hBa1VOQVFzTElBQWdCRFlDQkNBQUlBVTJBZ0FMWlFFRWZ5QUFLQUlBSVFFZ0FDZ0NCQ0VEQWtBRFFDQUJJQU5HQkVCQkFBOExJQUFnQVVFUWFpSUVOZ0lBSUFFdkFRUWlBa0VaVFVFQVFRRWdBblJCd29HQUVIRWJEUUVnQWtHWENHdEJBMGtOQVNBRUlRRWdBa0V2UncwQUMwR1hDQThMSUFJTGFBRUNmeU1BUVJCcklnWWtBQUpBSUFBZ0FTQUNJQU1nQlJBY0lnY05BQ0FHUVFocUlBTWdBQ0FCSUFRUkJnQkJBQ0VISUFZb0FnZ05BQ0FHS0FJTUlnUWdBaWdDQURZQ0NDQUNJQVEyQWdBZ0FDQUJJQUlnQXlBRkVCd2hCd3NnQmtFUWFpUUFJQWNMWXdFRmZ5QUFLQUlFUVFScklRSWdBQ2dDQ0NFRElBQW9BZ0FoQkNBQUxRQU1RUUZ4SVFVRFFDQUVJQUlpQVVFRWFrWUVRRUVBRHdzZ0FDQUJOZ0lFSUFWRkJFQWdBVUVFYXlFQ0lBTW9BZ0FnQVNnQ0FFME5BUXNMSUFCQkFUb0FEQ0FCQzJrQkFuOENRQUpBSUFBdEFBQWlBeUFCTFFBQVJ3MEFRUUVoQWdKQUFrQWdBMEVEYXc0Q0FRQURDeUFBTFFBQklBRXRBQUZIRFFGQkFDRUNJQUF0QUFJZ0FTMEFBa2NOQWlBQUxRQURJQUV0QUFOR0R3c2dBQzBBQVNBQkxRQUJSZzhMUVFBaEFnc2dBZ3RpQVFKL0lBQWdBQ2dDYUNJQ0lBQW9BcHdCUVFGcklnTWdBaUFEU1JzMkFtZ2dBQ0FCSUFBb0FxZ0JRUUFnQUMwQXZnRWlBaHNpQVdvaUF5QUJJQUVnQTBrYklnRWdBQ2dDckFFZ0FDZ0NvQUZCQVdzZ0Foc2lBQ0FBSUFGTEd6WUNiQXRjQUFKQUlBSWdBMDBFUUNBQklBTkpEUUVnQXlBQ2F5RURJQUFnQW1vaEFnTkFJQU1FUUNBQ1FRRTZBQUFnQTBFQmF5RURJQUpCQVdvaEFnd0JDd3NQQ3lBQ0lBTkI5T1BBQUJDMUFRQUxJQU1nQVVIMDQ4QUFFTE1CQUF0b0FRUi9Jd0JCRUdzaUFpUUFJQUVvQWdRaEF5QUNRUWhxSUFFb0FnZ2lCRUVFUVJSQjhNckFBQkJnSUFJb0FnZ2hCU0FDS0FJTUlBTWdCRUVVYkJBV0lRTWdBQ0FFTmdJSUlBQWdBellDQkNBQUlBVTJBZ0FnQUNBQkxRQU1PZ0FNSUFKQkVHb2tBQXRnQVFOL0l3QkJJR3NpQWlRQUlBSkJDR29nQVVFQlFRRkIxT1BBQUJCZ0lBSkJGR29pQTBFSWFpSUVRUUEyQWdBZ0FpQUNLUU1JTndJVUlBTWdBVUVCRURvZ0FFRUlhaUFFS0FJQU5nSUFJQUFnQWlrQ0ZEY0NBQ0FDUVNCcUpBQUxXd0VDZnlBQkVLZ0JJQUZCQ0dzaUF5Z0NBRUVCYWlFQ0lBTWdBallDQUFKQUlBSUVRQ0FCS0FJQUlnSkJmMFlOQVNBQUlBTTJBZ2dnQUNBQk5nSUVJQUFnQVVFRWFqWUNBQ0FCSUFKQkFXbzJBZ0FQQ3dBTEVMZ0JBQXVWQVFFRGZ5QUFLQUlBSWdRZ0FDZ0NDQ0lGUmdSQUl3QkJFR3NpQXlRQUlBTkJDR29nQUNBRVFRRkJCRUVVRUNZZ0F5Z0NDQ0lFUVlHQWdJQjRSd1JBSUFNb0Fnd2FJQVFnQWhDdUFRQUxJQU5CRUdva0FBc2dBQ0FGUVFGcU5nSUlJQUFvQWdRZ0JVRVViR29pQUNBQktRSUFOd0lBSUFCQkNHb2dBVUVJYWlrQ0FEY0NBQ0FBUVJCcUlBRkJFR29vQWdBMkFnQUxyUUVCQlg4Z0FDZ0NCQ0VDSUFBb0FnQWhBU0FBUW9TQWdJREFBRGNDQUFKQUlBRWdBa1lOQUNBQ0lBRnJRUVIySVFJRFFDQUNSUTBCSUFFb0FnQWdBVUVFYWlnQ0FFRUVRUlFRbndFZ0FrRUJheUVDSUFGQkVHb2hBUXdBQ3dBTElBQW9BaEFpQVFSQUlBQW9BZ2dpQWlnQ0NDSURJQUFvQWd3aUJFY0VRQ0FDS0FJRUlnVWdBMEVFZEdvZ0JTQUVRUVIwYWlBQlFRUjBFQklnQUNnQ0VDRUJDeUFDSUFFZ0EybzJBZ2dMQzA0QkJIOENRQUpBQWtBZ0FDMEFBQ0lFUVFOckRnSUFBUUlMSUFBdEFBRWhBd3dCQ3lBQUxRQUNRUkIwSVFFZ0FDMEFBMEVZZENFQ0lBQXRBQUVoQXdzZ0FTQUNjaUFEUVFoMGNpQUVjZ3RTQVFSL0lBQW9BZ0FoQVNBQUtBSUVJUVFEUUNBQklBUkdCRUJCQXc4TElBQWdBVUVRYWlJQ05nSUFJQUV2QVFRaEF5QUNJUUZCQkVFVVFRTWdBMEVVUmhzZ0EwRUVSaHNpQWtFRFJnMEFDeUFDQzB3QkFuOGdBa0VDZENFQ0VBQWhCQU5BSUFJRVFDQUVJQU1nQVNnQ0FFRUFFSnNCRUFFZ0FrRUVheUVDSUFOQkFXb2hBeUFCUVFScUlRRU1BUXNMSUFBZ0JEWUNCQ0FBUVFBMkFnQUxVd0VCZnlBQUtBSnNJZ0VnQUNnQ3JBRkhCRUFnQUNnQ29BRkJBV3NnQVVzRVFDQUFJQUZCQVdvMkFtd2dBQ0FBS0FKb0lnRWdBQ2dDbkFGQkFXc2lBQ0FBSUFGTEd6WUNhQXNQQ3lBQVFRRVFod0VMVndBZ0FTQUNFRVVFUUNBQVFZQ0FnSUI0TmdJQUR3c2dBU2dDQUNJQ0lBRW9BZ1JHQkVBZ0FFR0FnSUNBZURZQ0FBOExJQUVnQWtFUWFqWUNBQ0FBSUFJcEFnQTNBZ0FnQUVFSWFpQUNRUWhxS1FJQU53SUFDMU1CQW44Z0FSQ29BU0FCUVFocklnSW9BZ0JCQVdvaEF5QUNJQU0yQWdBQ1FDQURCRUFnQVNnQ0FBMEJJQUFnQWpZQ0NDQUFJQUUyQWdRZ0FVRi9OZ0lBSUFBZ0FVRUVhallDQUE4TEFBc1F1QUVBQzFFQkFuOGdBQ0FBS0FKb0lnSWdBQ2dDbkFGQkFXc2lBeUFDSUFOSkd6WUNhQ0FBSUFBb0FxQUJRUUZySUFBb0Fxd0JJZ0lnQUNnQ2JDSUFJQUpMR3lJQ0lBQWdBV29pQUNBQUlBSkxHellDYkF2dEFRSUVmd0YrSXdCQkVHc2lCaVFBSXdCQkVHc2lCeVFBSUFaQkJHb2lCUUovQWtBZ0FpQURha0VCYTBFQUlBSnJjYTBnQWExK0lnbENJSWluRFFBZ0NhY2lBMEdBZ0lDQWVDQUNhMHNOQUNBRFJRUkFJQVVnQWpZQ0NDQUZRUUEyQWdSQkFBd0NDeUFIUVFocUlBSWdBeENNQVNBSEtBSUlJZ2dFUUNBRklBZzJBZ2dnQlNBQk5nSUVRUUFNQWdzZ0JTQUROZ0lJSUFVZ0FqWUNCRUVCREFFTElBVkJBRFlDQkVFQkN6WUNBQ0FIUVJCcUpBQWdCaWdDQ0NFQklBWW9BZ1JGQkVBZ0FDQUdLQUlNTmdJRUlBQWdBVFlDQUNBR1FSQnFKQUFQQ3lBR0tBSU1HaUFCSUFRUXJnRUFDMG9CQW44Z0FDQUFLQUpvSWdJZ0FDZ0NuQUZCQVdzaUF5QUNJQU5KR3pZQ2FDQUFJQUFvQXFnQklnSkJBQ0FBS0FKc0lnQWdBazhiSWdJZ0FDQUJheUlBSUFBZ0FrZ2JOZ0pzQ3o4QkFYOGpBRUVRYXlJREpBQWdBMEVJYWlBQUVISWdBU0FES0FJTUlnQkpCRUFnQXlnQ0NDQURRUkJxSkFBZ0FVRUVkR29QQ3lBQklBQWdBaEJMQUF1RkFRRURmeUFBS0FJQUlnUWdBQ2dDQ0NJRlJnUkFJd0JCRUdzaUF5UUFJQU5CQ0dvZ0FDQUVRUUZCQWtFTUVDWWdBeWdDQ0NJRVFZR0FnSUI0UndSQUlBTW9BZ3dhSUFRZ0FoQ3VBUUFMSUFOQkVHb2tBQXNnQUNBRlFRRnFOZ0lJSUFBb0FnUWdCVUVNYkdvaUFDQUJLUUVBTndFQUlBQkJDR29nQVVFSWFpZ0JBRFlCQUF0R0FRTi9JQUVnQWlBREVFUWlCU0FCYWlJRUxRQUFJUVlnQkNBRHAwRVpkaUlFT2dBQUlBRWdCVUVJYXlBQ2NXcEJDR29nQkRvQUFDQUFJQVk2QUFRZ0FDQUZOZ0lBQzFRQkFYOGdBQ0FBS0FKc05nSjRJQUFnQUNrQnNnRTNBWHdnQUNBQUx3RytBVHNCaGdFZ0FFR0VBV29nQUVHNkFXb3ZBUUE3QVFBZ0FDQUFLQUpvSWdFZ0FDZ0NuQUZCQVdzaUFDQUFJQUZMR3pZQ2RBdFJBZ0YvQVg0akFFRVFheUlDSkFBZ0FrRUVhaUFCRUZZZ0FpZ0NCQ2tDbkFFaEEwRUlFSmtCSWdFZ0F6Y0NBQ0FDS0FJSUlBSW9BZ3dRb2dFZ0FFRUNOZ0lFSUFBZ0FUWUNBQ0FDUVJCcUpBQUxTUUVCZnlNQVFSQnJJZ1VrQUNBRlFRaHFJQUVRY2lBRklBSWdBeUFGS0FJSUlBVW9BZ3dnQkJCc0lBVW9BZ1FoQVNBQUlBVW9BZ0EyQWdBZ0FDQUJOZ0lFSUFWQkVHb2tBQXRQQVFKL0lBQW9BZ1FoQWlBQUtBSUFJUU1DUUNBQUtBSUlJZ0F0QUFCRkRRQWdBMEdNNThBQVFRUWdBaWdDREJFREFFVU5BRUVCRHdzZ0FDQUJRUXBHT2dBQUlBTWdBU0FDS0FJUUVRSUFDMGdCQW44Q1FDQUJLQUlBSWdKQmYwY0VRQ0FDUVFGcUlRTWdBa0VHU1EwQklBTkJCa0hFNGNBQUVMTUJBQXRCeE9IQUFCQjlBQXNnQUNBRE5nSUVJQUFnQVVFRWFqWUNBQXRDQVFGL0lBSkJBblFoQWdOQUlBSUVRQ0FBS0FJQUlRTWdBQ0FCS0FJQU5nSUFJQUVnQXpZQ0FDQUNRUUZySVFJZ0FVRUVhaUVCSUFCQkJHb2hBQXdCQ3dzTFNBRUNmeU1BUVJCcklnSWtBQ0FDUVFocUlBQWdBQ2dDQUVFQlFRUkJCQkFtSUFJb0FnZ2lBRUdCZ0lDQWVFY0VRQ0FDS0FJTUlRTWdBQ0FCRUs0QkFBc2dBa0VRYWlRQUN6OEFBa0FnQVNBQ1RRUkFJQUlnQkUwTkFTQUNJQVFnQlJDekFRQUxJQUVnQWlBRkVMVUJBQXNnQUNBQ0lBRnJOZ0lFSUFBZ0F5QUJRUVIwYWpZQ0FBdElBUUovSXdCQkVHc2lCU1FBSUFWQkNHb2dBQ0FCSUFJZ0F5QUVFQ1lnQlNnQ0NDSUFRWUdBZ0lCNFJ3UkFJQVVvQWd3aEJpQUFRWVRNd0FBUXJnRUFDeUFGUVJCcUpBQUxSd0VDZnlBQUtBSUFJQUFvQWdSQkJFRUVFSjhCSUFBb0Fnd2hBaUFBS0FJUUlnQW9BZ0FpQVFSQUlBSWdBUkVFQUFzZ0FDZ0NCQ0lCQkVBZ0FpQUFLQUlJSUFFUU9Bc0xRUUFnQUMwQXZBRkJBVVlFUUNBQVFRQTZBTHdCSUFCQjlBQnFJQUJCaUFGcUVIUWdBQ0FBUVNScUVIVWdBQ2dDWUNBQUtBSmtRUUFnQUNnQ29BRVFVd3NMUVFFRGZ5QUJLQUlVSWdJZ0FTZ0NIQ0lEYXlFRUlBSWdBMGtFUUNBRUlBSkJ3TS9BQUJDMEFRQUxJQUFnQXpZQ0JDQUFJQUVvQWhBZ0JFRUVkR28yQWdBTFFnRUJmeU1BUVNCcklnTWtBQ0FEUVFBMkFoQWdBMEVCTmdJRUlBTkNCRGNDQ0NBRElBRTJBaHdnQXlBQU5nSVlJQU1nQTBFWWFqWUNBQ0FESUFJUWlnRUFDMEVCQTM4Z0FTZ0NGQ0lDSUFFb0Fod2lBMnNoQkNBQ0lBTkpCRUFnQkNBQ1FkRFB3QUFRdEFFQUN5QUFJQU0yQWdRZ0FDQUJLQUlRSUFSQkJIUnFOZ0lBQzBRQkFYOGdBU2dDQUNJQ0lBRW9BZ1JHQkVBZ0FFR0FnSUNBZURZQ0FBOExJQUVnQWtFUWFqWUNBQ0FBSUFJcEFnQTNBZ0FnQUVFSWFpQUNRUWhxS1FJQU53SUFDenNCQTM4RFFDQUNRUlJHUlFSQUlBQWdBbW9pQXlnQ0FDRUVJQU1nQVNBQ2FpSURLQUlBTmdJQUlBTWdCRFlDQUNBQ1FRUnFJUUlNQVFzTEN6c0JBMzhEUUNBQ1FTUkdSUVJBSUFBZ0Ftb2lBeWdDQUNFRUlBTWdBU0FDYWlJREtBSUFOZ0lBSUFNZ0JEWUNBQ0FDUVFScUlRSU1BUXNMQ3pvQkFYOENRQ0FDUVg5SEJFQWdBa0VCYWlFRUlBSkJJRWtOQVNBRVFTQWdBeEN6QVFBTElBTVFmUUFMSUFBZ0JEWUNCQ0FBSUFFMkFnQUxPQUFDUUNBQmFVRUJSdzBBUVlDQWdJQjRJQUZySUFCSkRRQWdBQVJBUWV5eXdRQXRBQUFhSUFFZ0FCQTFJZ0ZGRFFFTElBRVBDd0FMT0FBQ1FDQUNRWUNBeEFCR0RRQWdBQ0FDSUFFb0FoQVJBZ0JGRFFCQkFROExJQU5GQkVCQkFBOExJQUFnQTBFQUlBRW9BZ3dSQXdBTExRRUJmeUFCSUFBb0FnQlBCSDhnQUNnQ0JDRUNJQUF0QUFoRkJFQWdBU0FDVFE4TElBRWdBa2tGUVFBTEMzQUJBMzhnQUNnQ0FDSUVJQUFvQWdnaUJVWUVRQ01BUVJCcklnTWtBQ0FEUVFocUlBQWdCRUVCUVFKQkNCQW1JQU1vQWdnaUJFR0JnSUNBZUVjRVFDQURLQUlNR2lBRUlBSVFyZ0VBQ3lBRFFSQnFKQUFMSUFBZ0JVRUJhallDQ0NBQUtBSUVJQVZCQTNScUlBRTNBUUFMTkFFQmZ5QUFLQUlJSWdNZ0FDZ0NBRVlFUUNBQUlBSVFhd3NnQUNBRFFRRnFOZ0lJSUFBb0FnUWdBMEVDZEdvZ0FUWUNBQXN1QVFGL0l3QkJFR3NpQWlRQUlBSkJDR29nQVNBQUVJd0JJQUlvQWdnaUFBUkFJQUpCRUdva0FDQUFEd3NBQ3pjQkFYOGpBRUVnYXlJQkpBQWdBVUVBTmdJWUlBRkJBVFlDRENBQlFZenB3QUEyQWdnZ0FVSUVOd0lRSUFGQkNHb2dBQkNLQVFBTEtnRUJmeUFDSUFNUU5TSUVCRUFnQkNBQUlBRWdBeUFCSUFOSkd4QVdHaUFBSUFJZ0FSQTRDeUFFQ3lzQUlBSWdBMGtFUUNBRElBSWdCQkMwQVFBTElBQWdBaUFEYXpZQ0JDQUFJQUVnQTBFVWJHbzJBZ0FMTHdFQmZ5QUFJQUlRamdFZ0FDZ0NCQ0FBS0FJSUlnTkJGR3hxSUFFZ0FrRVViQkFXR2lBQUlBSWdBMm8yQWdnTEt3QWdBU0FEU3dSQUlBRWdBeUFFRUxRQkFBc2dBQ0FESUFGck5nSUVJQUFnQWlBQlFRUjBhallDQUFzdkFBSkFBa0FnQTJsQkFVY05BRUdBZ0lDQWVDQURheUFCU1EwQUlBQWdBU0FESUFJUWZpSUFEUUVMQUFzZ0FBc3VBQU5BSUFFRVFDQUFLQUlBSUFCQkJHb29BZ0JCQkVFVUVKOEJJQUZCQVdzaEFTQUFRUkJxSVFBTUFRc0xDeklCQVg4Z0FDZ0NDQ0VDSUFFZ0FDZ0NBRUVDYWkwQUFCQ2JBU0VCSUFBb0FnUWdBaUFCRUFFZ0FDQUNRUUZxTmdJSUN5b0FJQUFnQUNnQ2FDQUJhaUlCSUFBb0Fwd0JJZ0JCQVdzZ0FDQUJTeHRCQUNBQlFRQk9HellDYUFzekFRSi9JQUFnQUNnQ3FBRWlBaUFBS0FLc0FVRUJhaUlESUFFZ0FFR3lBV29RTmlBQUtBSmdJQUFvQW1RZ0FpQURFRk1MTXdFQ2Z5QUFJQUFvQXFnQklnSWdBQ2dDckFGQkFXb2lBeUFCSUFCQnNnRnFFQjBnQUNnQ1lDQUFLQUprSUFJZ0F4QlRDeW9BSUFFZ0Fra0VRRUdreU1BQVFTTkJ2TW5BQUJCeEFBc2dBaUFBSUFKQkZHeHFJQUVnQW1zUUdRczFBQ0FBSUFBcEFuUTNBbWdnQUNBQUtRRjhOd0d5QVNBQUlBQXZBWVlCT3dHK0FTQUFRYm9CYWlBQVFZUUJhaThCQURzQkFBdnNBUUlDZndGK0l3QkJFR3NpQWlRQUlBSkJBVHNCRENBQ0lBRTJBZ2dnQWlBQU5nSUVJd0JCRUdzaUFTUUFJQUpCQkdvaUFDa0NBQ0VFSUFFZ0FEWUNEQ0FCSUFRM0FnUWpBRUVRYXlJQUpBQWdBVUVFYWlJQktBSUFJZ0lvQWd3aEF3SkFBa0FDUUFKQUlBSW9BZ1FPQWdBQkFnc2dBdzBCUVFFaEFrRUFJUU1NQWdzZ0F3MEFJQUlvQWdBaUFpZ0NCQ0VESUFJb0FnQWhBZ3dCQ3lBQVFZQ0FnSUI0TmdJQUlBQWdBVFlDRENBQktBSUlJZ0V0QUFrYUlBQkJHeUFCTFFBSUVFb0FDeUFBSUFNMkFnUWdBQ0FDTmdJQUlBRW9BZ2dpQVMwQUNSb2dBRUVjSUFFdEFBZ1FTZ0FMS3dFQ2Z3SkFJQUFvQWdRZ0FDZ0NDQ0lCRURRaUFrVU5BQ0FCSUFKSkRRQWdBQ0FCSUFKck5nSUlDd3NtQUNBQ0JFQkI3TExCQUMwQUFCb2dBU0FDRURVaEFRc2dBQ0FDTmdJRUlBQWdBVFlDQUFzakFRRi9JQUVnQUNnQ0FDQUFLQUlJSWdKclN3UkFJQUFnQWlBQlFRUkJFQkJ0Q3dzakFRRi9JQUVnQUNnQ0FDQUFLQUlJSWdKclN3UkFJQUFnQWlBQlFRUkJGQkJ0Q3dzbEFDQUFRUUUyQWdRZ0FDQUJLQUlFSUFFb0FnQnJRUVIySWdFMkFnZ2dBQ0FCTmdJQUN4c0FJQUVnQWswRVFDQUNJQUVnQXhCTEFBc2dBQ0FDUVJSc2Fnc2dBQ0FCSUFKTkJFQWdBaUFCUWVUandBQVFTd0FMSUFBZ0FtcEJBVG9BQUFzYkFDQUJJQUpOQkVBZ0FpQUJJQU1RU3dBTElBQWdBa0VFZEdvTEF3QUFDd01BQUFzREFBQUxBd0FBQ3dNQUFBc0RBQUFMR2dCQjdMTEJBQzBBQUJwQkJDQUFFRFVpQUFSQUlBQVBDd0FMSVFBZ0FFVUVRRUdjNjhBQVFUSVF1UUVBQ3lBQUlBSWdBeUFCS0FJUUVRRUFDeFlBSUFGQkFYRkZCRUFnQUxnUUNROExJQUN0RUFvTFJnRUJmeUFBSUFBb0FnQkJBV3NpQVRZQ0FDQUJSUVJBSUFCQkRHb1FSd0pBSUFCQmYwWU5BQ0FBSUFBb0FnUkJBV3NpQVRZQ0JDQUJEUUFnQUVFRVFad0dFRGdMQ3dzZkFDQUFSUVJBUVp6cndBQkJNaEM1QVFBTElBQWdBaUFCS0FJUUVRSUFDeUVCQVg4Z0FDZ0NFQ0lCSUFBb0FoUVFnd0VnQUNnQ0RDQUJRUVJCRUJDZkFRc1NBQ0FBQkVBZ0FTQUNJQUFnQTJ3UU9Bc0xJUUVCZnlBQUtBSUVJZ0VnQUNnQ0NCQ0RBU0FBS0FJQUlBRkJCRUVRRUo4QkN4WUFJQUJCRUdvUVdDQUFLQUlBSUFBb0FnUVFvd0VMRkFBZ0FDQUFLQUlBUVFGck5nSUFJQUVRbkFFTEdRQWdBRUdBZ0lDQWVFY0VRQ0FBSUFGQkJFRVVFSjhCQ3dzVUFDQUJCRUJCZ0lDQWdIZ2dBUkNqQVFzZ0FRc1pBQ0FCS0FJY1Fjamx3QUJCRGlBQktBSWdLQUlNRVFNQUN3OEFJQUlFUUNBQUlBRWdBaEE0Q3dzUEFDQUJCRUFnQUNBQ0lBRVFPQXNMRXdBZ0FBUkFEd3RCcEtuQkFFRWJFTGtCQUFzUEFDQUFRWVFCVHdSQUlBQVFBd3NMRXdBZ0FDZ0NDQ0FBS0FJQVFRSkJBaENmQVFzVkFDQUNJQUlRcEFFYUlBQkJnSUNBZ0hnMkFnQUxGQUFnQUNnQ0FDQUJJQUFvQWdRb0Fnd1JBZ0FMRUFBZ0FTQUFLQUlFSUFBb0FnZ1FEd3M4QUNBQVJRUkFJd0JCSUdzaUFDUUFJQUJCQURZQ0dDQUFRUUUyQWd3Z0FFSFF4TUFBTmdJSUlBQkNCRGNDRUNBQVFRaHFJQUVRaWdFQUN3QUxGQUFnQUVFQU5nSUlJQUJDZ0lDQWdCQTNBZ0FMRWdBZ0FDQUJRWkROd0FBUVlrRUJPZ0FNQ3hBQUlBRWdBQ2dDQUNBQUtBSUVFQThMRGdBZ0FFRUFOZ0lBSUFFUW5BRUxhd0VCZnlNQVFUQnJJZ01rQUNBRElBRTJBZ1FnQXlBQU5nSUFJQU5CQWpZQ0RDQURRZWpwd0FBMkFnZ2dBMElDTndJVUlBTWdBMEVFYXExQ2dJQ0FnT0FCaERjREtDQURJQU90UW9DQWdJRGdBWVEzQXlBZ0F5QURRU0JxTmdJUUlBTkJDR29nQWhDS0FRQUxhd0VCZnlNQVFUQnJJZ01rQUNBRElBRTJBZ1FnQXlBQU5nSUFJQU5CQWpZQ0RDQURRY2pwd0FBMkFnZ2dBMElDTndJVUlBTWdBMEVFYXExQ2dJQ0FnT0FCaERjREtDQURJQU90UW9DQWdJRGdBWVEzQXlBZ0F5QURRU0JxTmdJUUlBTkJDR29nQWhDS0FRQUxhd0VCZnlNQVFUQnJJZ01rQUNBRElBRTJBZ1FnQXlBQU5nSUFJQU5CQWpZQ0RDQURRWnpxd0FBMkFnZ2dBMElDTndJVUlBTWdBMEVFYXExQ2dJQ0FnT0FCaERjREtDQURJQU90UW9DQWdJRGdBWVEzQXlBZ0F5QURRU0JxTmdJUUlBTkJDR29nQWhDS0FRQUxEZ0JCOE9YQUFFRXJJQUFRY1FBTEN3QWdBQ01BYWlRQUl3QUxEZ0JCdjZuQkFFSFBBQkM1QVFBTENRQWdBQ0FCRUFjQUN3MEFJQUJCOU9iQUFDQUJFQmNMREFBZ0FDQUJLUUlBTndNQUN3b0FJQUFvQWdBUXFRRUxEUUFnQUVHQWdJQ0FlRFlDQUFzSkFDQUFRUUEyQWdBTEJnQWdBQkJZQ3dVQVFZQUVDd1FBUVFFTEJBQWdBUXNFQUVFQUN3dlNiU0FBUVlDQXdBQUxRQjBBQUFBRUFBQUFCQUFBQUI0QUFBQmpZV3hzWldRZ1lGSmxjM1ZzZERvNmRXNTNjbUZ3S0NsZ0lHOXVJR0Z1SUdCRmNuSmdJSFpoYkhWbFJYSnliM0lBUWIrSndBQUxBWGdBUWVDSndBQUxFUC8vLy8vLy8vLy8vLy8vLy8vLy8vOEFRWWFLd0FBTER3RUFBQUFBQUNBQUFBQUFBQUFBQWdCQndJckFBQXNnLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOEFRYVNMd0FBTENCQUFBQUFBQUFBQkFFSEF1TUFBQ3dML0J3QkIxTGpBQUFzSER3RC8vLy8xL3dCQmdMbkFBQXNXLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL0F3QkJvTG5BQUFzZC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy93OEFRZis1d0FBTEdQei8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL3dCQm9MckFBQXMrLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzhBUVl5N3dBQUxPUC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzkvQUVIZ3U4QUFDOUVCLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL3dNQVFjQzl3QUFMSi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL0R3QkJ3TURBQUF2QkkzTnlZeTlzYVdJdWNuTUFBQUVBRHdEd0dnOEFBQUFBQU9JbEFBRGxKUUFBQUFBQUFMRGdBQUN6NEFBQUFBQUFBRHo3QVFCcCt3RUFBQUFBQUdyN0FRQnMrd0VBQUFBQUFJQWxBQUNmSlFBQUFBQUFBQUQ3QVFBNyt3RUFBQUFBQUdGMGRHVnRjSFJsWkNCMGJ5QjBZV3RsSUc5M2JtVnljMmhwY0NCdlppQlNkWE4wSUhaaGJIVmxJSGRvYVd4bElHbDBJSGRoY3lCaWIzSnliM2RsWkdKbmRHVjRkR052WkdWd2IybHVkSE55WVhOMFpYSmZjM2x0WW05c2MzWmxZM1J2Y2w5emVXMWliMnh6QUVBZ0VBQUtBQUFBWmdBQUFCTUFBQUJBSUJBQUNnQUFBR2NBQUFBVkFBQUFRQ0FRQUFvQUFBQm9BQUFBR1FBQUFFQWdFQUFLQUFBQWFRQUFBQmtBQUFCQUlCQUFDZ0FBQUdvQUFBQVZBQUFBUUNBUUFBb0FBQUJ5QUFBQU5nQUFBRUFnRUFBS0FBQUFkd0FBQURZQUFBQkFJQkFBQ2dBQUFQNEFBQUFiQUFBQVFDQVFBQW9BQUFBQ0FRQUFIUUFBQUVBZ0VBQUtBQUFBR1FFQUFDMEFBQUJBSUJBQUNnQUFBSzhBQUFBakFBQUFRQ0FRQUFvQUFBQzVBQUFBSXdBQUFFQWdFQUFLQUFBQXpnQUFBQ1VBQUFCQUlCQUFDZ0FBQU1ZQUFBQWxBQUFBUUNBUUFBb0FBQUR6QUFBQUtRQUFBRUFnRUFBS0FBQUEyZ0FBQUNVQUFBQkFJQkFBQ2dBQUFONEFBQUFXQUFBQVFDQVFBQW9BQUFENUFBQUFIUUFBQUVBZ0VBQUtBQUFBSUFFQUFDOEFBQUJqWVhCaFkybDBlU0J2ZG1WeVpteHZkd0FBQUR3aUVBQVJBQUFBS1NCemFHOTFiR1FnWW1VZ1BDQnNaVzRnS0dseklHbHVjMlZ5ZEdsdmJpQnBibVJsZUNBb2FYTWdLU0J6YUc5MWJHUWdZbVVnUEQwZ2JHVnVJQ2hwY3lBQUFBQnVJaEFBRkFBQUFJSWlFQUFYQUFBQUZsVVFBQUVBQUFCeVpXMXZkbUZzSUdsdVpHVjRJQ2hwY3lBQUFMUWlFQUFTQUFBQVdDSVFBQllBQUFBV1ZSQUFBUUFBQUdCaGRHQWdjM0JzYVhRZ2FXNWtaWGdnS0dseklBQUFBT0FpRUFBVkFBQUFnaUlRQUJjQUFBQVdWUkFBQVFBQUFDOW9iMjFsTDNKMWJtNWxjaTh1WTJGeVoyOHZjbVZuYVhOMGNua3ZjM0pqTDJsdVpHVjRMbU55WVhSbGN5NXBieTB4T1RRNVkyWTRZelppTldJMU5UZG1MM1Z1YVdOdlpHVXRkMmxrZEdndE1DNHhMakUwTDNOeVl5OTBZV0pzWlhNdWNuTVFJeEFBWkFBQUFKRUFBQUFWQUFBQUVDTVFBR1FBQUFDWEFBQUFHUUFBQUM5dWFYZ3ZjM1J2Y21Vdk1qaG9lWHBtYkRNek9HdHpOR0Z0YUdFM2RuQndibXhpY1RGek1XNXhZWFl0Y25WemRDMWtaV1poZFd4MExURXVPRFV1TUM5c2FXSXZjblZ6ZEd4cFlpOXpjbU12Y25WemRDOXNhV0p5WVhKNUwyTnZjbVV2YzNKakwybDBaWEl2ZEhKaGFYUnpMMmwwWlhKaGRHOXlMbkp6QUFBQWxDTVFBSDBBQUFDekJ3QUFDUUFBQUdGemMyVnlkR2x2YmlCbVlXbHNaV1E2SUcxcFpDQThQU0J6Wld4bUxteGxiaWdwTDI1cGVDOXpkRzl5WlM4eU9HaDVlbVpzTXpNNGEzTTBZVzFvWVRkMmNIQnViR0p4TVhNeGJuRmhkaTF5ZFhOMExXUmxabUYxYkhRdE1TNDROUzR3TDJ4cFlpOXlkWE4wYkdsaUwzTnlZeTl5ZFhOMEwyeHBZbkpoY25rdlkyOXlaUzl6Y21NdmMyeHBZMlV2Ylc5a0xuSnpBQUFBUnlRUUFISUFBQUNnRFFBQUNRQUFBR0Z6YzJWeWRHbHZiaUJtWVdsc1pXUTZJR3NnUEQwZ2MyVnNaaTVzWlc0b0tRQUFBRWNrRUFCeUFBQUF6UTBBQUFrQUFBQXZibWw0TDNOMGIzSmxMekk0YUhsNlptd3pNemhyY3pSaGJXaGhOM1p3Y0c1c1luRXhjekZ1Y1dGMkxYSjFjM1F0WkdWbVlYVnNkQzB4TGpnMUxqQXZiR2xpTDNKMWMzUnNhV0l2YzNKakwzSjFjM1F2YkdsaWNtRnllUzloYkd4dll5OXpjbU12YzJ4cFkyVXVjbk1BQUNVUUFHOEFBQUNoQUFBQUdRQUFBQzl1YVhndmMzUnZjbVV2TWpob2VYcG1iRE16T0d0ek5HRnRhR0UzZG5Cd2JteGljVEZ6TVc1eFlYWXRjblZ6ZEMxa1pXWmhkV3gwTFRFdU9EVXVNQzlzYVdJdmNuVnpkR3hwWWk5emNtTXZjblZ6ZEM5c2FXSnlZWEo1TDJGc2JHOWpMM055WXk5MlpXTXZiVzlrTG5KekFBQUFnQ1VRQUhFQUFBQS9DZ0FBSkFBQUFFQlRFQUJ4QUFBQUtBSUFBQkVBQUFBdmFHOXRaUzl5ZFc1dVpYSXZMbU5oY21kdkwzSmxaMmx6ZEhKNUwzTnlZeTlwYm1SbGVDNWpjbUYwWlhNdWFXOHRNVGswT1dObU9HTTJZalZpTlRVM1ppOWhkblF0TUM0eE5pNHdMM055WXk5aWRXWm1aWEl1Y25NQUFCUW1FQUJhQUFBQUxRQUFBQmtBQUFBVUpoQUFXZ0FBQUZvQUFBQU5BQUFBRkNZUUFGb0FBQUJlQUFBQURRQUFBQlFtRUFCYUFBQUFZd0FBQUEwQUFBQVVKaEFBV2dBQUFHZ0FBQUFkQUFBQUZDWVFBRm9BQUFCMUFBQUFKUUFBQUJRbUVBQmFBQUFBZndBQUFDVUFBQUFVSmhBQVdnQUFBSWNBQUFBVkFBQUFGQ1lRQUZvQUFBQ1JBQUFBSlFBQUFCUW1FQUJhQUFBQW1BQUFBQlVBQUFBVUpoQUFXZ0FBQUowQUFBQWxBQUFBRkNZUUFGb0FBQUNvQUFBQUVRQUFBQlFtRUFCYUFBQUFzd0FBQUNBQUFBQVVKaEFBV2dBQUFMY0FBQUFSQUFBQUZDWVFBRm9BQUFDNUFBQUFFUUFBQUJRbUVBQmFBQUFBd3dBQUFBMEFBQUFVSmhBQVdnQUFBTWNBQUFBUkFBQUFGQ1lRQUZvQUFBREtBQUFBRFFBQUFCUW1FQUJhQUFBQTlBQUFBQ3NBQUFBVUpoQUFXZ0FBQURrQkFBQXNBQUFBRkNZUUFGb0FBQUF5QVFBQUd3QUFBQlFtRUFCYUFBQUFSUUVBQUJRQUFBQVVKaEFBV2dBQUFGY0JBQUFZQUFBQUZDWVFBRm9BQUFCY0FRQUFHQUFBQUdGemMyVnlkR2x2YmlCbVlXbHNaV1E2SUd4cGJtVnpMbWwwWlhJb0tTNWhiR3dvZkd4OElHd3ViR1Z1S0NrZ1BUMGdZMjlzY3lrQUZDWVFBRm9BQUFEM0FRQUFCUUFBQUFBQUFBQUJBQUFBQWdBQUFBTUFBQUFFQUFBQUJRQUFBQVlBQUFBSEFBQUFDQUFBQUFrQUFBQUtBQUFBQ3dBQUFBd0FBQUFOQUFBQURnQUFBQThBQUFBUUFBQUFFUUFBQUJJQUFBQVRBQUFBRkFBQUFCVUFBQUFXQUFBQUZ3QUFBQmdBQUFBWkFBQUFHZ0FBQUJzQUFBQWNBQUFBSFFBQUFCNEFBQUFmQUFBQUlBQUFBQ0VBQUFBaUFBQUFJd0FBQUNRQUFBQWxBQUFBSmdBQUFDY0FBQUFvQUFBQUtRQUFBQ29BQUFBckFBQUFMQUFBQUMwQUFBQXVBQUFBTHdBQUFEQUFBQUF4QUFBQU1nQUFBRE1BQUFBMEFBQUFOUUFBQURZQUFBQTNBQUFBT0FBQUFEa0FBQUE2QUFBQU93QUFBRHdBQUFBOUFBQUFQZ0FBQUQ4QUFBQkFBQUFBUVFBQUFFSUFBQUJEQUFBQVJBQUFBRVVBQUFCR0FBQUFSd0FBQUVnQUFBQkpBQUFBU2dBQUFFc0FBQUJNQUFBQVRRQUFBRTRBQUFCUEFBQUFVQUFBQUZFQUFBQlNBQUFBVXdBQUFGUUFBQUJWQUFBQVZnQUFBRmNBQUFCWUFBQUFXUUFBQUZvQUFBQmJBQUFBWEFBQUFGMEFBQUJlQUFBQVh3QUFBR1ltQUFDU0pRQUFDU1FBQUF3a0FBQU5KQUFBQ2lRQUFMQUFBQUN4QUFBQUpDUUFBQXNrQUFBWUpRQUFFQ1VBQUF3bEFBQVVKUUFBUENVQUFMb2pBQUM3SXdBQUFDVUFBTHdqQUFDOUl3QUFIQ1VBQUNRbEFBQTBKUUFBTENVQUFBSWxBQUJrSWdBQVpTSUFBTUFEQUFCZ0lnQUFvd0FBQU1VaUFBQi9BQUFBTDJodmJXVXZjblZ1Ym1WeUx5NWpZWEpuYnk5eVpXZHBjM1J5ZVM5emNtTXZhVzVrWlhndVkzSmhkR1Z6TG1sdkxURTVORGxqWmpoak5tSTFZalUxTjJZdllYWjBMVEF1TVRZdU1DOXpjbU12YkdsdVpTNXljemdxRUFCWUFBQUFFQUFBQUJRQUFBQTRLaEFBV0FBQUFCMEFBQUFXQUFBQU9Db1FBRmdBQUFBZUFBQUFGd0FBQURncUVBQllBQUFBSVFBQUFCTUFBQUE0S2hBQVdBQUFBQ3NBQUFBa0FBQUFPQ29RQUZnQUFBQXhBQUFBR3dBQUFEZ3FFQUJZQUFBQU5RQUFBQnNBQUFBNEtoQUFXQUFBQUR3QUFBQWJBQUFBT0NvUUFGZ0FBQUE5QUFBQUd3QUFBRGdxRUFCWUFBQUFRUUFBQUJzQUFBQTRLaEFBV0FBQUFFTUFBQUFlQUFBQU9Db1FBRmdBQUFCRUFBQUFId0FBQURncUVBQllBQUFBUndBQUFCc0FBQUE0S2hBQVdBQUFBRTRBQUFBYkFBQUFPQ29RQUZnQUFBQlBBQUFBR3dBQUFEZ3FFQUJZQUFBQVZnQUFBQnNBQUFBNEtoQUFXQUFBQUZjQUFBQWJBQUFBT0NvUUFGZ0FBQUJlQUFBQUd3QUFBRGdxRUFCWUFBQUFYd0FBQUJzQUFBQTRLaEFBV0FBQUFHMEFBQUFiQUFBQU9Db1FBRmdBQUFCMUFBQUFHd0FBQURncUVBQllBQUFBZGdBQUFCc0FBQUE0S2hBQVdBQUFBSGdBQUFBZUFBQUFPQ29RQUZnQUFBQjVBQUFBSHdBQUFEZ3FFQUJZQUFBQWZBQUFBQnNBQUFCcGJuUmxjbTVoYkNCbGNuSnZjam9nWlc1MFpYSmxaQ0IxYm5KbFlXTm9ZV0pzWlNCamIyUmxPQ29RQUZnQUFBQ0FBQUFBRVFBQUFEZ3FFQUJZQUFBQWlRQUFBQ2NBQUFBNEtoQUFXQUFBQUkwQUFBQVhBQUFBT0NvUUFGZ0FBQUNRQUFBQUV3QUFBRGdxRUFCWUFBQUFrZ0FBQUNjQUFBQTRLaEFBV0FBQUFKWUFBQUFqQUFBQU9Db1FBRmdBQUFDYkFBQUFGZ0FBQURncUVBQllBQUFBbkFBQUFCY0FBQUE0S2hBQVdBQUFBSjhBQUFBVEFBQUFPQ29RQUZnQUFBQ2hBQUFBSndBQUFEZ3FFQUJZQUFBQXFBQUFBQk1BQUFBNEtoQUFXQUFBQUwwQUFBQVZBQUFBT0NvUUFGZ0FBQUMvQUFBQUpRQUFBRGdxRUFCWUFBQUF3QUFBQUJ3QUFBQTRLaEFBV0FBQUFNTUFBQUFsQUFBQU9Db1FBRmdBQUFEdEFBQUFNQUFBQURncUVBQllBQUFBOUFBQUFDTUFBQUE0S2hBQVdBQUFBUGtBQUFBbEFBQUFPQ29RQUZnQUFBRDZBQUFBSEFBQUFDOW9iMjFsTDNKMWJtNWxjaTh1WTJGeVoyOHZjbVZuYVhOMGNua3ZjM0pqTDJsdVpHVjRMbU55WVhSbGN5NXBieTB4T1RRNVkyWTRZelppTldJMU5UZG1MMkYyZEMwd0xqRTJMakF2YzNKakwzQmhjbk5sY2k1eWN3QUFlQzBRQUZvQUFBREdBUUFBSWdBQUFIZ3RFQUJhQUFBQTJnRUFBQTBBQUFCNExSQUFXZ0FBQU53QkFBQU5BQUFBZUMwUUFGb0FBQUJOQWdBQUpnQUFBSGd0RUFCYUFBQUFVZ0lBQUNZQUFBQjRMUkFBV2dBQUFGZ0NBQUFZQUFBQWVDMFFBRm9BQUFCd0FnQUFFd0FBQUhndEVBQmFBQUFBZEFJQUFCTUFBQUI0TFJBQVdnQUFBQVVEQUFBbkFBQUFlQzBRQUZvQUFBQUxBd0FBSndBQUFIZ3RFQUJhQUFBQUVRTUFBQ2NBQUFCNExSQUFXZ0FBQUJjREFBQW5BQUFBZUMwUUFGb0FBQUFkQXdBQUp3QUFBSGd0RUFCYUFBQUFJd01BQUNjQUFBQjRMUkFBV2dBQUFDa0RBQUFuQUFBQWVDMFFBRm9BQUFBdkF3QUFKd0FBQUhndEVBQmFBQUFBTlFNQUFDY0FBQUI0TFJBQVdnQUFBRHNEQUFBbkFBQUFlQzBRQUZvQUFBQkJBd0FBSndBQUFIZ3RFQUJhQUFBQVJ3TUFBQ2NBQUFCNExSQUFXZ0FBQUUwREFBQW5BQUFBZUMwUUFGb0FBQUJUQXdBQUp3QUFBSGd0RUFCYUFBQUFiZ01BQUNzQUFBQjRMUkFBV2dBQUFIY0RBQUF2QUFBQWVDMFFBRm9BQUFCN0F3QUFMd0FBQUhndEVBQmFBQUFBZ3dNQUFDOEFBQUI0TFJBQVdnQUFBSWNEQUFBdkFBQUFlQzBRQUZvQUFBQ01Bd0FBS3dBQUFIZ3RFQUJhQUFBQWtRTUFBQ2NBQUFCNExSQUFXZ0FBQUswREFBQXJBQUFBZUMwUUFGb0FBQUMyQXdBQUx3QUFBSGd0RUFCYUFBQUF1Z01BQUM4QUFBQjRMUkFBV2dBQUFNSURBQUF2QUFBQWVDMFFBRm9BQUFER0F3QUFMd0FBQUhndEVBQmFBQUFBeXdNQUFDc0FBQUI0TFJBQVdnQUFBTkFEQUFBbkFBQUFlQzBRQUZvQUFBRGVBd0FBSndBQUFIZ3RFQUJhQUFBQTF3TUFBQ2NBQUFCNExSQUFXZ0FBQUpnREFBQW5BQUFBZUMwUUFGb0FBQUJhQXdBQUp3QUFBSGd0RUFCYUFBQUFZQU1BQUNjQUFBQjRMUkFBV2dBQUFKOERBQUFuQUFBQWVDMFFBRm9BQUFCbkF3QUFKd0FBQUhndEVBQmFBQUFBcGdNQUFDY0FBQUI0TFJBQVdnQUFBT1FEQUFBbkFBQUFlQzBRQUZvQUFBQU9CQUFBRXdBQUFIZ3RFQUJhQUFBQUZ3UUFBQnNBQUFCNExSQUFXZ0FBQUNBRUFBQVVBQUFBTDJodmJXVXZjblZ1Ym1WeUx5NWpZWEpuYnk5eVpXZHBjM1J5ZVM5emNtTXZhVzVrWlhndVkzSmhkR1Z6TG1sdkxURTVORGxqWmpoak5tSTFZalUxTjJZdllYWjBMVEF1TVRZdU1DOXpjbU12ZEdGaWN5NXljOVF3RUFCWUFBQUFDUUFBQUJJQUFBRFVNQkFBV0FBQUFCRUFBQUFVQUFBQTFEQVFBRmdBQUFBWEFBQUFGQUFBQU5Rd0VBQllBQUFBSHdBQUFCUUFBQUF2YUc5dFpTOXlkVzV1WlhJdkxtTmhjbWR2TDNKbFoybHpkSEo1TDNOeVl5OXBibVJsZUM1amNtRjBaWE11YVc4dE1UazBPV05tT0dNMllqVmlOVFUzWmk5aGRuUXRNQzR4Tmk0d0wzTnlZeTkwWlhKdGFXNWhiQzlrYVhKMGVWOXNhVzVsY3k1eWMyd3hFQUJvQUFBQUNBQUFBQlFBQUFCc01SQUFhQUFBQUF3QUFBQVBBQUFBYkRFUUFHZ0FBQUFRQUFBQUR3QkJqT1RBQUF2UEJ3RUFBQUFmQUFBQUlBQUFBQ0VBQUFBaUFBQUFJd0FBQUJRQUFBQUVBQUFBSkFBQUFDVUFBQUFtQUFBQUp3QUFBQzlvYjIxbEwzSjFibTVsY2k4dVkyRnlaMjh2Y21WbmFYTjBjbmt2YzNKakwybHVaR1Y0TG1OeVlYUmxjeTVwYnkweE9UUTVZMlk0WXpaaU5XSTFOVGRtTDJGMmRDMHdMakUyTGpBdmMzSmpMM1JsY20xcGJtRnNMbkp6UERJUUFGd0FBQUIxQWdBQUZRQUFBRHd5RUFCY0FBQUFzUUlBQUE0QUFBQThNaEFBWEFBQUFBVUVBQUFqQUFBQVFtOXljbTkzVFhWMFJYSnliM0poYkhKbFlXUjVJR0p2Y25KdmQyVmtPaURXTWhBQUVnQUFBR05oYkd4bFpDQmdUM0IwYVc5dU9qcDFibmR5WVhBb0tXQWdiMjRnWVNCZ1RtOXVaV0FnZG1Gc2RXVnBibVJsZUNCdmRYUWdiMllnWW05MWJtUnpPaUIwYUdVZ2JHVnVJR2x6SUNCaWRYUWdkR2hsSUdsdVpHVjRJR2x6SUFBQUFCc3pFQUFnQUFBQU96TVFBQklBQUFBNklBQUFBUUFBQUFBQUFBQmdNeEFBQWdBQUFBQUFBQUFNQUFBQUJBQUFBQ2dBQUFBcEFBQUFLZ0FBQUNBZ0lDQXNDaWdvQ2pBd01ERXdNakF6TURRd05UQTJNRGN3T0RBNU1UQXhNVEV5TVRNeE5ERTFNVFl4TnpFNE1Ua3lNREl4TWpJeU16STBNalV5TmpJM01qZ3lPVE13TXpFek1qTXpNelF6TlRNMk16Y3pPRE01TkRBME1UUXlORE0wTkRRMU5EWTBOelE0TkRrMU1EVXhOVEkxTXpVME5UVTFOalUzTlRnMU9UWXdOakUyTWpZek5qUTJOVFkyTmpjMk9EWTVOekEzTVRjeU56TTNORGMxTnpZM056YzROems0TURneE9ESTRNemcwT0RVNE5qZzNPRGc0T1Rrd09URTVNamt6T1RRNU5UazJPVGM1T0RrNVlYUjBaVzF3ZEdWa0lIUnZJR2x1WkdWNElITnNhV05sSUhWd0lIUnZJRzFoZUdsdGRXMGdkWE5wZW1VQUFBQmROQkFBTEFBQUFISmhibWRsSUhOMFlYSjBJR2x1WkdWNElDQnZkWFFnYjJZZ2NtRnVaMlVnWm05eUlITnNhV05sSUc5bUlHeGxibWQwYUNDVU5CQUFFZ0FBQUtZMEVBQWlBQUFBY21GdVoyVWdaVzVrSUdsdVpHVjRJTmcwRUFBUUFBQUFwalFRQUNJQUFBQnpiR2xqWlNCcGJtUmxlQ0J6ZEdGeWRITWdZWFFnSUdKMWRDQmxibVJ6SUdGMElBRDROQkFBRmdBQUFBNDFFQUFOQUFBQVNHRnphQ0IwWVdKc1pTQmpZWEJoWTJsMGVTQnZkbVZ5Wm14dmR5dzFFQUFjQUFBQUwzSjFjM1F2WkdWd2N5OW9ZWE5vWW5KdmQyNHRNQzR4TlM0eUwzTnlZeTl5WVhjdmJXOWtMbkp6QUFCUU5SQUFLZ0FBQUNNQUFBQW9BQUFBc1ZNUUFHd0FBQUFqQVFBQURnQUFBR05zYjNOMWNtVWdhVzUyYjJ0bFpDQnlaV04xY25OcGRtVnNlU0J2Y2lCaFpuUmxjaUJpWldsdVp5QmtjbTl3Y0dWa0FBRC8vLy8vLy8vLy85QTFFQUJCNk92QUFBdDFMMmh2YldVdmNuVnVibVZ5THk1allYSm5ieTl5WldkcGMzUnllUzl6Y21NdmFXNWtaWGd1WTNKaGRHVnpMbWx2TFRFNU5EbGpaamhqTm1JMVlqVTFOMll2YzJWeVpHVXRkMkZ6YlMxaWFXNWtaMlZ1TFRBdU5pNDFMM055WXk5c2FXSXVjbk1BQUFEb05SQUFaUUFBQURVQUFBQU9BRUdCN2NBQUM0Y0JBUUlEQXdRRkJnY0lDUW9MREEwT0F3TURBd01EQXc4REF3TURBd01ERHdrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKRUFrSkNRa0pDUWtKQ1FrSkNRa0pDUWtKQ1FrSkNRa0pBRUdCNzhBQUM1OExBUUlDQWdJREFnSUVBZ1VHQndnSkNnc01EUTRQRUJFU0V4UVZGaGNZR1JvYkhCMENBaDRDQWdJQ0FnSUNIeUFoSWlNQ0pDVW1KeWdwQWlvQ0FnSUNLeXdDQWdJQ0xTNENBZ0l2TURFeU13SUNBZ0lDQWpRQ0FqVTJOd0k0T1RvN1BEMCtQems1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVUE1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1UVFJQ1FrTUNBa1JGUmtkSVNRSktPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNVN3SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBams1T1RsTUFnSUNBZ0pOVGs5UUFnSUNVUUpTVXdJQ0FnSUNBZ0lDQWdJQ0FnSlVWUUlDVmdKWEFnSllXVnBiWEYxZVgyQmhBbUpqQW1SbFptY0NhQUpwYW10c0FnSnRibTl3QW5GeUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0p6QWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDZEhVQ0FnSUNBZ0lDZG5jNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9YZzVPVGs1T1RrNU9UbDVlZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ2V6azVmRGs1ZlFJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKK0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ2Z3SUNBb0NCZ2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBb09FQWdJQ0FnSUNBZ0lDQW9XR2RRSUNod0lDQW9nQ0FnSUNBZ0lDaVlvQ0FnSUNBZ0lDQWdJQ0FnSUNpNHdDalk0Q2o1Q1JrcE9VbFpZQ2x3SUNtSm1hbXdJQ0FnSUNBZ0lDQWdJNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RtY0hSMGRIUjBkSFIwZEhSMGRIUjBkSFIwZEhSMGRIUjBkSFIwZEhSMGRIUjBDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2RBZ0lDQXA2ZkFnUUNCUVlIQ0FrS0N3d05EZzhRRVJJVEZCVVdGeGdaR2hzY0hRSUNIZ0lDQWdJQ0FnSWZJQ0VpSXdJa0pTWW5LQ2tDS2dJQ0FnS2dvYUtqcEtXbUxxZW9xYXFyckswekFnSUNBZ0lDcmdJQ05UWTNBamc1T2pzOFBUNnZPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVPVGs1T1RrNU9UazVUQUlDQWdJQ3NFNVBzWVdHZFFJQ2h3SUNBb2dDQWdJQ0FnSUNpWW9DQWdJQ0FnSUNBZ0lDQWdJQ2k0eXlzNDRDajVDUmtwT1VsWllDbHdJQ21KbWFtd0lDQWdJQ0FnSUNBZ0pWVlhWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUFRYno2d0FBTEtWVlZWVlVWQUZCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVCQUVIditzQUFDOFFCRUVFUVZWVlZWVlZYVlZWVlZWVlZWVlZWVVZWVkFBQkFWUFhkVlZWVlZWVlZWVlVWQUFBQUFBQlZWVlZWL0YxVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUVVBRkFBVUJGQlZWVlZWVlZWVkZWRlZWVlZWVlZWVkFBQUFBQUFBUUZWVlZWVlZWVlZWVmRWWFZWVlZWVlZWVlZWVlZWVUZBQUJVVlZWVlZWVlZWVlZWVlZWVlZSVUFBRlZWVVZWVlZWVlZCUkFBQUFFQlVGVlZWVlZWVlZWVlZWVUJWVlZWVlZYLy8vLy9mMVZWVlZCVkFBQlZWVlZWVlZWVlZWVlZCUUJCd1B6QUFBdVlCRUJWVlZWVlZWVlZWVlZWVlZWVlJWUUJBRlJSQVFCVlZRVlZWVlZWVlZWVlVWVlZWVlZWVlZWVlZWVlZWVlZWUkFGVVZWRlZGVlZWQlZWVlZWVlZWVVZCVlZWVlZWVlZWVlZWVlZWVlZWVlVRUlVVVUZGVlZWVlZWVlZWVUZGVlZVRlZWVlZWVlZWVlZWVlZWVlZWVlZRQkVGUlJWVlZWVlFWVlZWVlZWUVVBVVZWVlZWVlZWVlZWVlZWVlZWVlZCQUZVVlZGVkFWVlZCVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVlZWRlZGVlZVVlVWVlZWVlZWVlZWVlZWVlZSVVZWVlZWVlZWVlZWVlZWVlZWUVJVQlFSUVZVRlZWUVZWVlZWVlZWVlZVVlZWVlZWVlZWVlZWVlZWVlZWVkZFUUZCRkJWUVZWVkJWVlZWVlZWVlZWUVZWVlZWVlZWVlZWVlZWVlZWUlZFQVZSVlFWVVZWVlVGVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVVWQlVSVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVUUJBVlZVVkFFQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUkFBQlVWVlVBUUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZCVlZWVlZWVlVSVVZWVlZWVlZWVlZWVlZWVlZWVUJBQUJBQUFSVkFRQUFBUUFBQUFBQUFBQUFWRlZGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUVFQUVGQlZWVlZWVlZWVUFWVVZWVlZBVlJWVlVWQlZWRlZWVlZSVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcUFFR0FnY0VBQzVBRFZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVCVlZWVlZWVlZWVlZWVlZWVkJWUlZWVlZWVlZVRlZWVlZWVlZWVlFWVlZWVlZWVlZWQlZWVlZYLy8vZmYvL2RkZmQ5YlYxMVVRQUZCVlJRRUFBRlZYVVZWVlZWVlZWVlZWVlZVVkFGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRVlZWVlZWVlZWVlZVVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUJWVVZVVlZBVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZjVkZGVlZWVlZWVlZWVlZWVlZWVlZWUlFCQVJBRUFWQlVBQUJSVlZWVlZWVlZWVlZWVlZWVUFBQUFBQUFBQVFGVlZWVlZWVlZWVlZWVlZWUUJWVlZWVlZWVlZWVlZWVlZVQUFGQUZWVlZWVlZWVlZWVlZGUUFBVlZWVlVGVlZWVlZWVlZVRlVCQlFWVlZWVlZWVlZWVlZWVlZWVlVWUUVWQlZWVlZWVlZWVlZWVlZWVlZWVlFBQUJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRQUFBQUFRQVZGRlZWRkJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUJCb0lUQkFBdVRDRlZWRlFCVlZWVlZWVlVGUUZWVlZWVlZWVlZWVlZWVlZRQUFBQUJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUFBQUFBQUFBQUFGUlZWVlZWVlZWVlZWWDFWVlZWYVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVi9WZlhWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZYMVZWVlZWVlY5VlZWVlZWVlZWVlZWVlZWWC8vLzlWVlZWVlZWVlZWVlZWMVZWVlZWWFZWVlZWWFZYMVZWVlZWWDFWWDFWMVZWZFZWVlZWZFZYMVhYVmRWVjMxVlZWVlZWVlZWVmRWVlZWVlZWVlZWWGZWMzFWVlZWVlZWVlZWVlZWVlZWVlZWZjFWVlZWVlZWVlhWVlhWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZkVlhWVlZWVlZWVlZWVlZWVlZWVjExVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZWQlZWVlZWVlZWVlZWVlZWVlZWVlZYOS8vLy8vLy8vLy8vLy8vLy9YMVhWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFBQUFBQUFBQUFBcXFxcXFxcXFtcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwVlZWV3FxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFscFZWVlZWVlZXcXFxcXFxcXFxcXFxcXFxcXFxZ29BcXFxcWFxbXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxbXFCcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxbFdwcXFxcXFxcXFxcXFxcXFtcXFxcXFxcXFxcXFxcXFxcW9xcXFxcXFxcXFxcXFhcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcWxWVmxhcXFxcXFxcXFxcXFxcXFhcXFxcXFxcXFxcXFxcXBWVmFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwVlZWVlZWVlZWVlZWVlZWVlZWVlZWcXFxcVZxcXFxcXFxcXFxcXFxcXFxcXBxVlZWVlZWVlZWVlZWVlZWVlZWOVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVZRQUFBVUZWVlZWVlZWVlVGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUVZWVlZSVVVWVlZWVlZWVlZRVlZVVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZCVlZWVlZWVlVBQUFBQVVGVkZGVlZWVlZWVlZWVlZWUVVBVUZWVlZWVlZGUUFBVUZWVlZhcXFxcXFxcXFwV1FGVlZWVlZWVlZWVlZWVlZGUVZRVUZWVlZWVlZWVlZWVlZGVlZWVlZWVlZWVlZWVlZWVlZWVlZWQVVCQlFWVlZGVlZWVkZWVlZWVlZWVlZWVlZWVlZGVlZWVlZWVlZWVlZWVlZWUVFVVkFWUlZWVlZWVlZWVlZWVlZWQlZSVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZVVVZWVlZWV3FxcXFxcXFxcXFxcFZWVlVBQUFBQUFFQVZBRUcvak1FQUMrRU1WVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkFBQUE4S3FxV2xVQUFBQUFxcXFxcXFxcXFxcHFxcXFxcW1xcVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZhbXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcWxaVlZWVlZWVlZWVlZWVlZWVlZWUVZVVlZWVlZWVlZWVlZWVlZWVlZWVlZxbXBWVlFBQVZGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVGUUZVQlFWVUFWVlZWVlZWVlZWVlZWVUFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkJWVlZWVlZWVjFWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVBVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVZWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVGQUFCVVZWVlZWVlZWVlZWVlZWVUZVRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZGVlZWVlZWVlZWVlZWVlZWVlZBQUFBUUZWVlZWVlZWVlZWVlZVVVZGVVZVRlZWVlZWVlZWVlZWVlZWRlVCQlZVVlZWVlZWVlZWVlZWVlZWVlZWVlZWQVZWVlZWVlZWVlZVVkFBRUFWRlZWVlZWVlZWVlZWVlZWVlZWVkZWVlZWVkJWVlZWVlZWVlZWVlZWVlZVRkFFQUZWUUVVVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVZVQVJWUlZGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZSVVZBRUJWVlZWVlZWQlZWVlZWVlZWVlZWVlZWVlZWRlVSVVZWVlZWUlZWVlZVRkFGUUFWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVUFBQVZFVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVVQUVRUkJGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZRVlFWUkJVVlZWVlZWVlZVRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlFCQUVWUlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZWRUFFRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUJCUkFBVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVZBQUJCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVVZSVUVFVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUFGVlZSVlZWVlZWVlZWQVFCQVZWVlZWVlZWVlZWVkZRQUVRRlVWVlZVQlFBRlZWVlZWVlZWVlZWVlZBQUFBQUVCUVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZRQkFBQkJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFVQUFBQUFBQVVBQkVGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUJRRVVRQUFCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWUUVWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZSVlVWVlZBVlZWVlZWVlZWVlZWVlZWVkJVQlZSRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVUZRQUFBRkJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFCVVZWVlZWVlZWVlZWVlZWVlZWVlVBUUZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVVlZWVlZWVlZWVlZWVlZWVlZWVlZWRlVCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVnFsUlZWVnBWVlZXcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcFZWYXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcWxwVlZWVlZWVlZWVlZWVnFxcFdWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWcXFtcWFhcXFxcXFxcXFxcWFsVlZWV1ZWVlZWVlZWVlZhbGxWVlZXcVZWV3FxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFsVlZWVlZWVlZWVlFRQlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlFCQnE1bkJBQXQxVUFBQUFBQUFRRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlJGUUJRQUFBQUJBQVFCVlZWVlZWVlZWQlZCVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVRlZGVlZWVlZWVlZWVlZWVlZWVlZWQUVHdG1zRUFDd0pBRlFCQnU1ckJBQXZGQmxSVlVWVlZWVlJWVlZWVkZRQUJBQUFBVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVQVFBQUFBQUFVQUJBRVFGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZWVlZWVlZWVlZWVlZWVlZWVlZWVkFGVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVBVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZBRUJWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlVBUUZWVlZWVlZWVlZWVlZWVlZWVlZWMVZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZYVlZWVlZWVlZWVlZWVlZWVlZWVlZWZGYzL2YxVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZmWC8vLy8vLy85dVZWVlZxcXE2cXFxcXF1cjZ2NzlWcXFwV1ZWOVZWVldxV2xWVlZWVlZWZi8vLy8vLy8vLy9WMVZWL2YvZi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vMy8vLy8vLzlWVlZYLy8vLy8vLy8vLy8vL2Y5WC9WVlZWLy8vLy8xZFgvLy8vLy8vLy8vLy8vLy8vLy8vLy8vOS85Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9YLy8vLy8vLy8vLy8vLy8vLy8vLy9YMVZWMVgvLy8vLy8vLzlWVlZWVmRWVlZWVlZWVlgxVlZWVlhWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlhWLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1ZWVlZWVlZWVlZWVlZWVlYvLy8vLy8vLy8vLy8vLy8vLy8vLy8vOWZWVmQvL1ZYL1ZWWFZWMVgvLzFkVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlgvLy85VlYxVlZWVlZWVmYvLy8vLy8vLy8vLy8vL2YvLy8zLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzlWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWLy8vL1YvLy9WMVgvLy8vLy8vLy8vLy8vLzkvL1gxWDEvLy8vVmYvL1YxWC8vMWRWcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFscFZWVlZWVlZWVlZWbVdWV0dxcFZtcVZWVlZWVldWVlZWVlZWVlZWWlZWVlFCQmpxSEJBQXNCQXdCQm5LSEJBQXVKQ1ZWVlZWVlZsVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVkZRQ1dhbHBhYXFvRlFLWlpsV1ZWVlZWVlZWVlZWUUFBQUFCVlZsVlZxVlpWVlZWVlZWVlZWVlZXVlZWVlZWVlZWVlVBQUFBQUFBQUFBRlJWVlZXVldWbFZWV1ZWVldsVlZWVlZWVlZWVlZWVlZaVldsV3FxcXFwVnFxcGFWVlZWV1ZXcXFxcFZWVlZWWlZWVldsVlZWVldsWlZaVlZWV1ZWVlZWVlZWVnBwYWFsbGxaWmFtV3FxcG1WYXBWV2xsVldsWmxWVlZWYXFxbHBWcFZWVldscWxwVlZWbFpWVlZaVlZWVlZWV1ZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZsVmZWVlZWVnBWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwVnFxcXFxcXFxcXFxcVZWVlZxcXFxcXFWYVZWV2FxbHBWcGFWVldscWxscVZhVlZWVnBWcFZsVlZWVlgxVmFWbWxWVjlWWmxWVlZWVlZWVlZWWmxYLy8vOVZWVldhbW1xYVZWVlYxVlZWVlZYVlZWV2xYVlgxVlZWVlZiMVZyNnE2cXF1cXFwcFZ1cXI2cnJxdVZWMzFWVlZWVlZWVlZWZFZWVlZWV1ZWVlZYZlYzMVZWVlZWVlZWV2xxcXBWVlZWVlZWWFZWMVZWVlZWVlZWVlZWVlZWVlZldFdsVlZWVlZWVlZWVlZhcXFxcXFxcXFwcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxQUFBQXdLcXFXbFVBQUFBQXFxcXFxcXFxcXFwcXFxcXFxbXFxVlZWVlZWVlZWVlZWVlZWVkJWUlZWVlZWVlZWVlZWVlZWVlZWVlZXcWFsVlZBQUJVV2FxcWFsV3FxcXFxcXFxcVdxcXFxcXFxcXFxcXFxcXFxcXFxV2xXcXFxcXFxcXFxdXY3L3Y2cXFxcXBXVlZWVlZWVlZWVlZWVlZWVlZmWC8vLy8vLy84dmJtbDRMM04wYjNKbEx6STRhSGw2Wm13ek16aHJjelJoYldoaE4zWndjRzVzWW5FeGN6RnVjV0YyTFhKMWMzUXRaR1ZtWVhWc2RDMHhMamcxTGpBdmJHbGlMM0oxYzNSc2FXSXZjM0pqTDNKMWMzUXZiR2xpY21GeWVTOWhiR3h2WXk5emNtTXZjbUYzWDNabFl5NXljeTlvYjIxbEwzSjFibTVsY2k4dVkyRnlaMjh2Y21WbmFYTjBjbmt2YzNKakwybHVaR1Y0TG1OeVlYUmxjeTVwYnkweE9UUTVZMlk0WXpaaU5XSTFOVGRtTDNkaGMyMHRZbWx1WkdkbGJpMHdMakl1TVRBMkwzTnlZeTlqYjI1MlpYSjBMM05zYVdObGN5NXljeTlvYjIxbEwzSjFibTVsY2k4dVkyRnlaMjh2Y21WbmFYTjBjbmt2YzNKakwybHVaR1Y0TG1OeVlYUmxjeTVwYnkweE9UUTVZMlk0WXpaaU5XSTFOVGRtTDNkaGMyMHRZbWx1WkdkbGJpMHdMakl1TVRBMkwzTnlZeTlsZUhSbGNtNXlaV1l1Y25NZFZCQUFad0FBQUg4QUFBQVJBQUFBSFZRUUFHY0FBQUNNQUFBQUVRQUFBRzUxYkd3Z2NHOXBiblJsY2lCd1lYTnpaV1FnZEc4Z2NuVnpkSEpsWTNWeWMybDJaU0IxYzJVZ2IyWWdZVzRnYjJKcVpXTjBJR1JsZEdWamRHVmtJSGRvYVdOb0lIZHZkV3hrSUd4bFlXUWdkRzhnZFc1ellXWmxJR0ZzYVdGemFXNW5JR2x1SUhKMWMzUktjMVpoYkhWbEtDa0FEbFVRQUFnQUFBQVdWUkFBQVFCQnFLckJBQXNCQkFCSUNYQnliMlIxWTJWeWN3RU1jSEp2WTJWemMyVmtMV0o1QWdaM1lXeHlkWE1HTUM0eU5DNDBESGRoYzIwdFltbHVaR2RsYmhNd0xqSXVNVEEySUNneE1UZ3pNV1ppT0RrcFwiKTtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdChvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IF9fd2JnX2luaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX29yX3BhdGg6IGF3YWl0IG9wdGlvbnMubW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5OiBvcHRpb25zLm1lbW9yeSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleHBvcnRzO1xuICAgICAgICAgICAgICAgIH1cblxuY2xhc3MgQ2xvY2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgc3BlZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDEuMDtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgfVxuICBnZXRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNwZWVkICogKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5zdGFydFRpbWUpIC8gMTAwMC4wO1xuICB9XG4gIHNldFRpbWUodGltZSkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkgLSB0aW1lIC8gdGhpcy5zcGVlZCAqIDEwMDAuMDtcbiAgfVxufVxuY2xhc3MgTnVsbENsb2NrIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICBnZXRUaW1lKF9zcGVlZCkge31cbiAgc2V0VGltZShfdGltZSkge31cbn1cblxuLy8gRWZmaWNpZW50IGFycmF5IHRyYW5zZm9ybWF0aW9ucyB3aXRob3V0IGludGVybWVkaWF0ZSBhcnJheSBvYmplY3RzLlxuLy8gSW5zcGlyZWQgYnkgRWxpeGlyJ3Mgc3RyZWFtcyBhbmQgUnVzdCdzIGl0ZXJhdG9yIGFkYXB0ZXJzLlxuXG5jbGFzcyBTdHJlYW0ge1xuICBjb25zdHJ1Y3RvcihpbnB1dCwgeGZzKSB7XG4gICAgdGhpcy5pbnB1dCA9IHR5cGVvZiBpbnB1dC5uZXh0ID09PSBcImZ1bmN0aW9uXCIgPyBpbnB1dCA6IGlucHV0W1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgICB0aGlzLnhmcyA9IHhmcyA/PyBbXTtcbiAgfVxuICBtYXAoZikge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybShNYXAkMShmKSk7XG4gIH1cbiAgZmxhdE1hcChmKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKEZsYXRNYXAoZikpO1xuICB9XG4gIGZpbHRlcihmKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKEZpbHRlcihmKSk7XG4gIH1cbiAgdGFrZShuKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKFRha2UobikpO1xuICB9XG4gIGRyb3Aobikge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybShEcm9wKG4pKTtcbiAgfVxuICB0cmFuc2Zvcm0oZikge1xuICAgIHJldHVybiBuZXcgU3RyZWFtKHRoaXMuaW5wdXQsIHRoaXMueGZzLmNvbmNhdChbZl0pKTtcbiAgfVxuICBtdWx0aXBsZXgob3RoZXIsIGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IFN0cmVhbShuZXcgTXVsdGlwbGV4ZXIodGhpc1tTeW1ib2wuaXRlcmF0b3JdKCksIG90aGVyW1N5bWJvbC5pdGVyYXRvcl0oKSwgY29tcGFyYXRvcikpO1xuICB9XG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHYgPSAwO1xuICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICBsZXQgZmx1c2hlZCA9IGZhbHNlO1xuICAgIGNvbnN0IHhmID0gY29tcG9zZSh0aGlzLnhmcywgdmFsID0+IHZhbHVlcy5wdXNoKHZhbCkpO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIGlmICh2ID09PSB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFsdWVzID0gW107XG4gICAgICAgICAgdiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5pbnB1dC5uZXh0KCk7XG4gICAgICAgICAgaWYgKG5leHQuZG9uZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHhmLnN0ZXAobmV4dC52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAwICYmICFmbHVzaGVkKSB7XG4gICAgICAgICAgeGYuZmx1c2goKTtcbiAgICAgICAgICBmbHVzaGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVzW3YrK11cbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb25lOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIE1hcCQxKGYpIHtcbiAgcmV0dXJuIGVtaXQgPT4ge1xuICAgIHJldHVybiBpbnB1dCA9PiB7XG4gICAgICBlbWl0KGYoaW5wdXQpKTtcbiAgICB9O1xuICB9O1xufVxuZnVuY3Rpb24gRmxhdE1hcChmKSB7XG4gIHJldHVybiBlbWl0ID0+IHtcbiAgICByZXR1cm4gaW5wdXQgPT4ge1xuICAgICAgZihpbnB1dCkuZm9yRWFjaChlbWl0KTtcbiAgICB9O1xuICB9O1xufVxuZnVuY3Rpb24gRmlsdGVyKGYpIHtcbiAgcmV0dXJuIGVtaXQgPT4ge1xuICAgIHJldHVybiBpbnB1dCA9PiB7XG4gICAgICBpZiAoZihpbnB1dCkpIHtcbiAgICAgICAgZW1pdChpbnB1dCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIFRha2Uobikge1xuICBsZXQgYyA9IDA7XG4gIHJldHVybiBlbWl0ID0+IHtcbiAgICByZXR1cm4gaW5wdXQgPT4ge1xuICAgICAgaWYgKGMgPCBuKSB7XG4gICAgICAgIGVtaXQoaW5wdXQpO1xuICAgICAgfVxuICAgICAgYyArPSAxO1xuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBEcm9wKG4pIHtcbiAgbGV0IGMgPSAwO1xuICByZXR1cm4gZW1pdCA9PiB7XG4gICAgcmV0dXJuIGlucHV0ID0+IHtcbiAgICAgIGMgKz0gMTtcbiAgICAgIGlmIChjID4gbikge1xuICAgICAgICBlbWl0KGlucHV0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufVxuZnVuY3Rpb24gY29tcG9zZSh4ZnMsIHB1c2gpIHtcbiAgcmV0dXJuIHhmcy5yZXZlcnNlKCkucmVkdWNlKChuZXh0LCBjdXJyKSA9PiB7XG4gICAgY29uc3QgeGYgPSB0b1hmKGN1cnIobmV4dC5zdGVwKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0ZXA6IHhmLnN0ZXAsXG4gICAgICBmbHVzaDogKCkgPT4ge1xuICAgICAgICB4Zi5mbHVzaCgpO1xuICAgICAgICBuZXh0LmZsdXNoKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgdG9YZihwdXNoKSk7XG59XG5mdW5jdGlvbiB0b1hmKHhmKSB7XG4gIGlmICh0eXBlb2YgeGYgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiB7XG4gICAgICBzdGVwOiB4ZixcbiAgICAgIGZsdXNoOiAoKSA9PiB7fVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHhmO1xuICB9XG59XG5jbGFzcyBNdWx0aXBsZXhlciB7XG4gIGNvbnN0cnVjdG9yKGxlZnQsIHJpZ2h0LCBjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgdGhpcy5jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgfVxuICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICBsZXQgbGVmdEl0ZW07XG4gICAgbGV0IHJpZ2h0SXRlbTtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogKCkgPT4ge1xuICAgICAgICBpZiAobGVmdEl0ZW0gPT09IHVuZGVmaW5lZCAmJiB0aGlzLmxlZnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubGVmdC5uZXh0KCk7XG4gICAgICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlZnRJdGVtID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmlnaHRJdGVtID09PSB1bmRlZmluZWQgJiYgdGhpcy5yaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5yaWdodC5uZXh0KCk7XG4gICAgICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByaWdodEl0ZW0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsZWZ0SXRlbSA9PT0gdW5kZWZpbmVkICYmIHJpZ2h0SXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGxlZnRJdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJpZ2h0SXRlbTtcbiAgICAgICAgICByaWdodEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChyaWdodEl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gbGVmdEl0ZW07XG4gICAgICAgICAgbGVmdEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbXBhcmF0b3IobGVmdEl0ZW0sIHJpZ2h0SXRlbSkpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IGxlZnRJdGVtO1xuICAgICAgICAgIGxlZnRJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSByaWdodEl0ZW07XG4gICAgICAgICAgcmlnaHRJdGVtID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRoZW1lKHRoZW1lKSB7XG4gIGNvbnN0IGZvcmVncm91bmQgPSBub3JtYWxpemVIZXhDb2xvcih0aGVtZS5mb3JlZ3JvdW5kKTtcbiAgY29uc3QgYmFja2dyb3VuZCA9IG5vcm1hbGl6ZUhleENvbG9yKHRoZW1lLmJhY2tncm91bmQpO1xuICBjb25zdCBwYWxldHRlSW5wdXQgPSB0aGVtZS5wYWxldHRlO1xuICBpZiAocGFsZXR0ZUlucHV0ID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgaWYgKCFmb3JlZ3JvdW5kIHx8ICFiYWNrZ3JvdW5kIHx8IHBhbGV0dGVJbnB1dC5sZW5ndGggPCA4KSByZXR1cm47XG4gIGNvbnN0IHBhbGV0dGUgPSBbXTtcbiAgY29uc3QgbGltaXQgPSBNYXRoLm1pbihwYWxldHRlSW5wdXQubGVuZ3RoLCAxNik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXQ7IGkgKz0gMSkge1xuICAgIGNvbnN0IGNvbG9yID0gbm9ybWFsaXplSGV4Q29sb3IocGFsZXR0ZUlucHV0W2ldKTtcbiAgICBpZiAoIWNvbG9yKSByZXR1cm47XG4gICAgcGFsZXR0ZS5wdXNoKGNvbG9yKTtcbiAgfVxuICBmb3IgKGxldCBpID0gcGFsZXR0ZS5sZW5ndGg7IGkgPCAxNjsgaSArPSAxKSB7XG4gICAgcGFsZXR0ZS5wdXNoKHBhbGV0dGVbaSAtIDhdKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGZvcmVncm91bmQsXG4gICAgYmFja2dyb3VuZCxcbiAgICBwYWxldHRlXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlJDIoZGF0YSkge1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgY29uc3QgdGV4dCA9IGF3YWl0IGRhdGEudGV4dCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlSnNvbmwodGV4dCk7XG4gICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgZXZlbnRzXG4gICAgICB9ID0gcmVzdWx0O1xuICAgICAgaWYgKGhlYWRlci52ZXJzaW9uID09PSAyKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUFzY2lpY2FzdFYyKGhlYWRlciwgZXZlbnRzKTtcbiAgICAgIH0gZWxzZSBpZiAoaGVhZGVyLnZlcnNpb24gPT09IDMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlQXNjaWljYXN0VjMoaGVhZGVyLCBldmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBhc2NpaWNhc3QgdiR7aGVhZGVyLnZlcnNpb259IGZvcm1hdCBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGhlYWRlciA9IEpTT04ucGFyc2UodGV4dCk7XG4gICAgICBpZiAoaGVhZGVyLnZlcnNpb24gPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlQXNjaWljYXN0VjEoaGVhZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgZGF0YS52ZXJzaW9uID09PSAxKSB7XG4gICAgcmV0dXJuIHBhcnNlQXNjaWljYXN0VjEoZGF0YSk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIGNvbnN0IGhlYWRlciA9IGRhdGFbMF07XG4gICAgaWYgKGhlYWRlci52ZXJzaW9uID09PSAyKSB7XG4gICAgICBjb25zdCBldmVudHMgPSBkYXRhLnNsaWNlKDEsIGRhdGEubGVuZ3RoKTtcbiAgICAgIHJldHVybiBwYXJzZUFzY2lpY2FzdFYyKGhlYWRlciwgZXZlbnRzKTtcbiAgICB9IGVsc2UgaWYgKGhlYWRlci52ZXJzaW9uID09PSAzKSB7XG4gICAgICBjb25zdCBldmVudHMgPSBkYXRhLnNsaWNlKDEsIGRhdGEubGVuZ3RoKTtcbiAgICAgIHJldHVybiBwYXJzZUFzY2lpY2FzdFYzKGhlYWRlciwgZXZlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBhc2NpaWNhc3QgdiR7aGVhZGVyLnZlcnNpb259IGZvcm1hdCBub3Qgc3VwcG9ydGVkYCk7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgZGF0YVwiKTtcbn1cbmZ1bmN0aW9uIHBhcnNlSnNvbmwoanNvbmwpIHtcbiAgY29uc3QgbGluZXMgPSBqc29ubC5zcGxpdChcIlxcblwiKTtcbiAgbGV0IGhlYWRlcjtcbiAgdHJ5IHtcbiAgICBoZWFkZXIgPSBKU09OLnBhcnNlKGxpbmVzWzBdKTtcbiAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBTdHJlYW0obGluZXMpLmRyb3AoMSkuZmlsdGVyKGwgPT4gbFswXSA9PT0gXCJbXCIpLm1hcChKU09OLnBhcnNlKTtcbiAgcmV0dXJuIHtcbiAgICBoZWFkZXIsXG4gICAgZXZlbnRzXG4gIH07XG59XG5mdW5jdGlvbiBwYXJzZUFzY2lpY2FzdFYxKGRhdGEpIHtcbiAgbGV0IHRpbWUgPSAwO1xuICBjb25zdCBldmVudHMgPSBuZXcgU3RyZWFtKGRhdGEuc3Rkb3V0KS5tYXAoZSA9PiB7XG4gICAgdGltZSArPSBlWzBdO1xuICAgIHJldHVybiBbdGltZSwgXCJvXCIsIGVbMV1dO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBjb2xzOiBkYXRhLndpZHRoLFxuICAgIHJvd3M6IGRhdGEuaGVpZ2h0LFxuICAgIGV2ZW50c1xuICB9O1xufVxuZnVuY3Rpb24gcGFyc2VBc2NpaWNhc3RWMihoZWFkZXIsIGV2ZW50cykge1xuICByZXR1cm4ge1xuICAgIGNvbHM6IGhlYWRlci53aWR0aCxcbiAgICByb3dzOiBoZWFkZXIuaGVpZ2h0LFxuICAgIHRoZW1lOiBwYXJzZVRoZW1lJDEoaGVhZGVyLnRoZW1lKSxcbiAgICBldmVudHMsXG4gICAgaWRsZVRpbWVMaW1pdDogaGVhZGVyLmlkbGVfdGltZV9saW1pdFxuICB9O1xufVxuZnVuY3Rpb24gcGFyc2VBc2NpaWNhc3RWMyhoZWFkZXIsIGV2ZW50cykge1xuICBpZiAoIShldmVudHMgaW5zdGFuY2VvZiBTdHJlYW0pKSB7XG4gICAgZXZlbnRzID0gbmV3IFN0cmVhbShldmVudHMpO1xuICB9XG4gIGxldCB0aW1lID0gMDtcbiAgZXZlbnRzID0gZXZlbnRzLm1hcChlID0+IHtcbiAgICB0aW1lICs9IGVbMF07XG4gICAgcmV0dXJuIFt0aW1lLCBlWzFdLCBlWzJdXTtcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgY29sczogaGVhZGVyLnRlcm0uY29scyxcbiAgICByb3dzOiBoZWFkZXIudGVybS5yb3dzLFxuICAgIHRoZW1lOiBwYXJzZVRoZW1lJDEoaGVhZGVyLnRlcm0/LnRoZW1lKSxcbiAgICBldmVudHMsXG4gICAgaWRsZVRpbWVMaW1pdDogaGVhZGVyLmlkbGVfdGltZV9saW1pdFxuICB9O1xufVxuZnVuY3Rpb24gcGFyc2VUaGVtZSQxKHRoZW1lKSB7XG4gIGNvbnN0IHBhbGV0dGUgPSB0eXBlb2YgdGhlbWU/LnBhbGV0dGUgPT09IFwic3RyaW5nXCIgPyB0aGVtZS5wYWxldHRlLnNwbGl0KFwiOlwiKSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIG5vcm1hbGl6ZVRoZW1lKHtcbiAgICBmb3JlZ3JvdW5kOiB0aGVtZT8uZmcsXG4gICAgYmFja2dyb3VuZDogdGhlbWU/LmJnLFxuICAgIHBhbGV0dGVcbiAgfSk7XG59XG5mdW5jdGlvbiB1bnBhcnNlQXNjaWljYXN0VjIocmVjb3JkaW5nKSB7XG4gIGNvbnN0IGhlYWRlciA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIHdpZHRoOiByZWNvcmRpbmcuY29scyxcbiAgICBoZWlnaHQ6IHJlY29yZGluZy5yb3dzXG4gIH0pO1xuICBjb25zdCBldmVudHMgPSByZWNvcmRpbmcuZXZlbnRzLm1hcChKU09OLnN0cmluZ2lmeSkuam9pbihcIlxcblwiKTtcbiAgcmV0dXJuIGAke2hlYWRlcn1cXG4ke2V2ZW50c31cXG5gO1xufVxuXG5mdW5jdGlvbiByZWNvcmRpbmcoc3JjLCBfcmVmLCBfcmVmMikge1xuICBsZXQge1xuICAgIGZlZWQsXG4gICAgcmVzaXplLFxuICAgIG9uSW5wdXQsXG4gICAgb25NYXJrZXIsXG4gICAgc2V0U3RhdGUsXG4gICAgbG9nZ2VyXG4gIH0gPSBfcmVmO1xuICBsZXQge1xuICAgIHNwZWVkLFxuICAgIGlkbGVUaW1lTGltaXQsXG4gICAgc3RhcnRBdCxcbiAgICBsb29wLFxuICAgIHBvc3RlclRpbWUsXG4gICAgbWFya2VyczogbWFya2Vyc18sXG4gICAgcGF1c2VPbk1hcmtlcnMsXG4gICAgY29sczogaW5pdGlhbENvbHMsXG4gICAgcm93czogaW5pdGlhbFJvd3MsXG4gICAgYXVkaW9VcmxcbiAgfSA9IF9yZWYyO1xuICBsZXQgY29scztcbiAgbGV0IHJvd3M7XG4gIGxldCBldmVudHM7XG4gIGxldCBtYXJrZXJzO1xuICBsZXQgZHVyYXRpb247XG4gIGxldCBlZmZlY3RpdmVTdGFydEF0O1xuICBsZXQgZXZlbnRUaW1lb3V0SWQ7XG4gIGxldCBuZXh0RXZlbnRJbmRleCA9IDA7XG4gIGxldCBsYXN0RXZlbnRUaW1lID0gMDtcbiAgbGV0IHN0YXJ0VGltZTtcbiAgbGV0IHBhdXNlRWxhcHNlZFRpbWU7XG4gIGxldCBwbGF5Q291bnQgPSAwO1xuICBsZXQgd2FpdGluZ0ZvckF1ZGlvID0gZmFsc2U7XG4gIGxldCB3YWl0aW5nVGltZW91dDtcbiAgbGV0IHNob3VsZFJlc3VtZU9uQXVkaW9QbGF5aW5nID0gZmFsc2U7XG4gIGxldCBub3cgPSAoKSA9PiBwZXJmb3JtYW5jZS5ub3coKSAqIHNwZWVkO1xuICBsZXQgYXVkaW9DdHg7XG4gIGxldCBhdWRpb0VsZW1lbnQ7XG4gIGxldCBhdWRpb1NlZWthYmxlID0gZmFsc2U7XG4gIGFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoXCJsb2FkaW5nXCIpO1xuICAgIH0sIDMwMDApO1xuICAgIHRyeSB7XG4gICAgICBsZXQgbWV0YWRhdGEgPSBsb2FkUmVjb3JkaW5nKHNyYywgbG9nZ2VyLCB7XG4gICAgICAgIGlkbGVUaW1lTGltaXQsXG4gICAgICAgIHN0YXJ0QXQsXG4gICAgICAgIG1hcmtlcnNfXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhhc0F1ZGlvID0gYXdhaXQgbG9hZEF1ZGlvKGF1ZGlvVXJsKTtcbiAgICAgIG1ldGFkYXRhID0gYXdhaXQgbWV0YWRhdGE7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5tZXRhZGF0YSxcbiAgICAgICAgaGFzQXVkaW9cbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gbG9hZFJlY29yZGluZyhzcmMsIGxvZ2dlciwgb3B0cykge1xuICAgIGNvbnN0IHtcbiAgICAgIHBhcnNlcixcbiAgICAgIG1pbkZyYW1lVGltZSxcbiAgICAgIGlucHV0T2Zmc2V0LFxuICAgICAgZHVtcEZpbGVuYW1lLFxuICAgICAgZW5jb2RpbmcgPSBcInV0Zi04XCJcbiAgICB9ID0gc3JjO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkb0ZldGNoKHNyYyk7XG4gICAgY29uc3QgcmVjb3JkaW5nID0gcHJlcGFyZShhd2FpdCBwYXJzZXIoZGF0YSwge1xuICAgICAgZW5jb2RpbmdcbiAgICB9KSwgbG9nZ2VyLCB7XG4gICAgICAuLi5vcHRzLFxuICAgICAgbWluRnJhbWVUaW1lLFxuICAgICAgaW5wdXRPZmZzZXRcbiAgICB9KTtcbiAgICAoe1xuICAgICAgY29scyxcbiAgICAgIHJvd3MsXG4gICAgICBldmVudHMsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIGVmZmVjdGl2ZVN0YXJ0QXRcbiAgICB9ID0gcmVjb3JkaW5nKTtcbiAgICBpbml0aWFsQ29scyA9IGluaXRpYWxDb2xzID8/IGNvbHM7XG4gICAgaW5pdGlhbFJvd3MgPSBpbml0aWFsUm93cyA/PyByb3dzO1xuICAgIGlmIChldmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZWNvcmRpbmcgaXMgbWlzc2luZyBldmVudHNcIik7XG4gICAgfVxuICAgIGlmIChkdW1wRmlsZW5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZHVtcChyZWNvcmRpbmcsIGR1bXBGaWxlbmFtZSk7XG4gICAgfVxuICAgIGNvbnN0IHBvc3RlciA9IHBvc3RlclRpbWUgIT09IHVuZGVmaW5lZCA/IGdldFBvc3Rlcihwb3N0ZXJUaW1lKSA6IHVuZGVmaW5lZDtcbiAgICBtYXJrZXJzID0gZXZlbnRzLmZpbHRlcihlID0+IGVbMV0gPT09IFwibVwiKS5tYXAoZSA9PiBbZVswXSwgZVsyXS5sYWJlbF0pO1xuICAgIHJldHVybiB7XG4gICAgICBjb2xzLFxuICAgICAgcm93cyxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgdGhlbWU6IHJlY29yZGluZy50aGVtZSxcbiAgICAgIHBvc3RlcixcbiAgICAgIG1hcmtlcnNcbiAgICB9O1xuICB9XG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRBdWRpbyhhdWRpb1VybCkge1xuICAgIGlmICghYXVkaW9VcmwpIHJldHVybiBmYWxzZTtcbiAgICBhdWRpb0VsZW1lbnQgPSBhd2FpdCBjcmVhdGVBdWRpb0VsZW1lbnQoYXVkaW9VcmwpO1xuICAgIGF1ZGlvU2Vla2FibGUgPSAhTnVtYmVyLmlzTmFOKGF1ZGlvRWxlbWVudC5kdXJhdGlvbikgJiYgYXVkaW9FbGVtZW50LmR1cmF0aW9uICE9PSBJbmZpbml0eSAmJiBhdWRpb0VsZW1lbnQuc2Vla2FibGUubGVuZ3RoID4gMCAmJiBhdWRpb0VsZW1lbnQuc2Vla2FibGUuZW5kKGF1ZGlvRWxlbWVudC5zZWVrYWJsZS5sZW5ndGggLSAxKSA9PT0gYXVkaW9FbGVtZW50LmR1cmF0aW9uO1xuICAgIGlmIChhdWRpb1NlZWthYmxlKSB7XG4gICAgICBhdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlpbmdcIiwgb25BdWRpb1BsYXlpbmcpO1xuICAgICAgYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3YWl0aW5nXCIsIG9uQXVkaW9XYWl0aW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLndhcm4oYGF1ZGlvIGlzIG5vdCBzZWVrYWJsZSAtIHlvdSBtdXN0IGVuYWJsZSByYW5nZSByZXF1ZXN0IHN1cHBvcnQgb24gdGhlIHNlcnZlciBwcm92aWRpbmcgJHthdWRpb0VsZW1lbnQuc3JjfSBmb3IgYXVkaW8gc2Vla2luZyB0byB3b3JrYCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGFzeW5jIGZ1bmN0aW9uIGRvRmV0Y2goX3JlZjMpIHtcbiAgICBsZXQge1xuICAgICAgdXJsLFxuICAgICAgZGF0YSxcbiAgICAgIGZldGNoT3B0cyA9IHt9XG4gICAgfSA9IF9yZWYzO1xuICAgIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gYXdhaXQgZG9GZXRjaE9uZSh1cmwsIGZldGNoT3B0cyk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHVybCkpIHtcbiAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbCh1cmwubWFwKHVybCA9PiBkb0ZldGNoT25lKHVybCwgZmV0Y2hPcHRzKSkpO1xuICAgIH0gZWxzZSBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkYXRhID0gZGF0YSgpO1xuICAgICAgfVxuICAgICAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgICAgIGRhdGEgPSBQcm9taXNlLnJlc29sdmUoZGF0YSk7XG4gICAgICB9XG4gICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IGRhdGE7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiIHx8IHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZSh2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImZhaWxlZCBmZXRjaGluZyByZWNvcmRpbmcgZmlsZTogdXJsL2RhdGEgbWlzc2luZyBpbiBzcmNcIik7XG4gICAgfVxuICB9XG4gIGFzeW5jIGZ1bmN0aW9uIGRvRmV0Y2hPbmUodXJsLCBmZXRjaE9wdHMpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgZmV0Y2hPcHRzKTtcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCBmZXRjaGluZyByZWNvcmRpbmcgZnJvbSAke3VybH06ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuICBmdW5jdGlvbiBzY2hlZHVsZU5leHRFdmVudCgpIHtcbiAgICBjb25zdCBuZXh0RXZlbnQgPSBldmVudHNbbmV4dEV2ZW50SW5kZXhdO1xuICAgIGlmIChuZXh0RXZlbnQpIHtcbiAgICAgIGV2ZW50VGltZW91dElkID0gc2NoZWR1bGVBdChydW5OZXh0RXZlbnQsIG5leHRFdmVudFswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uRW5kKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNjaGVkdWxlQXQoZiwgdGFyZ2V0VGltZSkge1xuICAgIGxldCB0aW1lb3V0ID0gKHRhcmdldFRpbWUgKiAxMDAwIC0gKG5vdygpIC0gc3RhcnRUaW1lKSkgLyBzcGVlZDtcbiAgICBpZiAodGltZW91dCA8IDApIHtcbiAgICAgIHRpbWVvdXQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gc2V0VGltZW91dChmLCB0aW1lb3V0KTtcbiAgfVxuICBmdW5jdGlvbiBydW5OZXh0RXZlbnQoKSB7XG4gICAgbGV0IGV2ZW50ID0gZXZlbnRzW25leHRFdmVudEluZGV4XTtcbiAgICBsZXQgZWxhcHNlZFdhbGxUaW1lO1xuICAgIGRvIHtcbiAgICAgIGxhc3RFdmVudFRpbWUgPSBldmVudFswXTtcbiAgICAgIG5leHRFdmVudEluZGV4Kys7XG4gICAgICBjb25zdCBzdG9wID0gZXhlY3V0ZUV2ZW50KGV2ZW50KTtcbiAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGV2ZW50ID0gZXZlbnRzW25leHRFdmVudEluZGV4XTtcbiAgICAgIGVsYXBzZWRXYWxsVGltZSA9IG5vdygpIC0gc3RhcnRUaW1lO1xuICAgIH0gd2hpbGUgKGV2ZW50ICYmIGVsYXBzZWRXYWxsVGltZSA+IGV2ZW50WzBdICogMTAwMCk7XG4gICAgc2NoZWR1bGVOZXh0RXZlbnQoKTtcbiAgfVxuICBmdW5jdGlvbiBjYW5jZWxOZXh0RXZlbnQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KGV2ZW50VGltZW91dElkKTtcbiAgICBldmVudFRpbWVvdXRJZCA9IG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gZXhlY3V0ZUV2ZW50KGV2ZW50KSB7XG4gICAgY29uc3QgW3RpbWUsIHR5cGUsIGRhdGFdID0gZXZlbnQ7XG4gICAgaWYgKHR5cGUgPT09IFwib1wiKSB7XG4gICAgICBmZWVkKGRhdGEpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJpXCIpIHtcbiAgICAgIG9uSW5wdXQoZGF0YSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInJcIikge1xuICAgICAgY29uc3QgW2NvbHMsIHJvd3NdID0gZGF0YS5zcGxpdChcInhcIik7XG4gICAgICByZXNpemUoY29scywgcm93cyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm1cIikge1xuICAgICAgb25NYXJrZXIoZGF0YSk7XG4gICAgICBpZiAocGF1c2VPbk1hcmtlcnMpIHtcbiAgICAgICAgcGF1c2UoKTtcbiAgICAgICAgcGF1c2VFbGFwc2VkVGltZSA9IHRpbWUgKiAxMDAwO1xuICAgICAgICBzZXRTdGF0ZShcImlkbGVcIiwge1xuICAgICAgICAgIHJlYXNvbjogXCJwYXVzZWRcIlxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBvbkVuZCgpIHtcbiAgICBjYW5jZWxOZXh0RXZlbnQoKTtcbiAgICBwbGF5Q291bnQrKztcbiAgICBpZiAobG9vcCA9PT0gdHJ1ZSB8fCB0eXBlb2YgbG9vcCA9PT0gXCJudW1iZXJcIiAmJiBwbGF5Q291bnQgPCBsb29wKSB7XG4gICAgICBuZXh0RXZlbnRJbmRleCA9IDA7XG4gICAgICBzdGFydFRpbWUgPSBub3coKTtcbiAgICAgIGZlZWQoXCJcXHgxYmNcIik7IC8vIHJlc2V0IHRlcm1pbmFsXG4gICAgICByZXNpemVUZXJtaW5hbFRvSW5pdGlhbFNpemUoKTtcbiAgICAgIHNjaGVkdWxlTmV4dEV2ZW50KCk7XG4gICAgICBpZiAoYXVkaW9FbGVtZW50KSB7XG4gICAgICAgIGF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdXNlRWxhcHNlZFRpbWUgPSBkdXJhdGlvbiAqIDEwMDA7XG4gICAgICBzZXRTdGF0ZShcImVuZGVkXCIpO1xuICAgICAgaWYgKGF1ZGlvRWxlbWVudCkge1xuICAgICAgICBhdWRpb0VsZW1lbnQucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gcGxheSgpIHtcbiAgICBpZiAoZXZlbnRUaW1lb3V0SWQpIHRocm93IG5ldyBFcnJvcihcImFscmVhZHkgcGxheWluZ1wiKTtcbiAgICBpZiAoZXZlbnRzW25leHRFdmVudEluZGV4XSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoXCJhbHJlYWR5IGVuZGVkXCIpO1xuICAgIGlmIChlZmZlY3RpdmVTdGFydEF0ICE9PSBudWxsKSB7XG4gICAgICBzZWVrKGVmZmVjdGl2ZVN0YXJ0QXQpO1xuICAgIH1cbiAgICBhd2FpdCByZXN1bWUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBwYXVzZSgpIHtcbiAgICBzaG91bGRSZXN1bWVPbkF1ZGlvUGxheWluZyA9IGZhbHNlO1xuICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5wYXVzZSgpO1xuICAgIH1cbiAgICBpZiAoIWV2ZW50VGltZW91dElkKSByZXR1cm4gdHJ1ZTtcbiAgICBjYW5jZWxOZXh0RXZlbnQoKTtcbiAgICBwYXVzZUVsYXBzZWRUaW1lID0gbm93KCkgLSBzdGFydFRpbWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gcmVzdW1lKCkge1xuICAgIGlmIChhdWRpb0VsZW1lbnQgJiYgIWF1ZGlvQ3R4KSBzZXR1cEF1ZGlvQ3R4KCk7XG4gICAgc3RhcnRUaW1lID0gbm93KCkgLSBwYXVzZUVsYXBzZWRUaW1lO1xuICAgIHBhdXNlRWxhcHNlZFRpbWUgPSBudWxsO1xuICAgIHNjaGVkdWxlTmV4dEV2ZW50KCk7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCkge1xuICAgICAgYXdhaXQgYXVkaW9FbGVtZW50LnBsYXkoKTtcbiAgICB9XG4gIH1cbiAgYXN5bmMgZnVuY3Rpb24gc2Vlayh3aGVyZSkge1xuICAgIGlmICh3YWl0aW5nRm9yQXVkaW8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgaXNQbGF5aW5nID0gISFldmVudFRpbWVvdXRJZDtcbiAgICBwYXVzZSgpO1xuICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5wYXVzZSgpO1xuICAgIH1cbiAgICBjb25zdCBjdXJyZW50VGltZSA9IChwYXVzZUVsYXBzZWRUaW1lID8/IDApIC8gMTAwMDtcbiAgICBpZiAodHlwZW9mIHdoZXJlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAod2hlcmUgPT09IFwiPDxcIikge1xuICAgICAgICB3aGVyZSA9IGN1cnJlbnRUaW1lIC0gNTtcbiAgICAgIH0gZWxzZSBpZiAod2hlcmUgPT09IFwiPj5cIikge1xuICAgICAgICB3aGVyZSA9IGN1cnJlbnRUaW1lICsgNTtcbiAgICAgIH0gZWxzZSBpZiAod2hlcmUgPT09IFwiPDw8XCIpIHtcbiAgICAgICAgd2hlcmUgPSBjdXJyZW50VGltZSAtIDAuMSAqIGR1cmF0aW9uO1xuICAgICAgfSBlbHNlIGlmICh3aGVyZSA9PT0gXCI+Pj5cIikge1xuICAgICAgICB3aGVyZSA9IGN1cnJlbnRUaW1lICsgMC4xICogZHVyYXRpb247XG4gICAgICB9IGVsc2UgaWYgKHdoZXJlW3doZXJlLmxlbmd0aCAtIDFdID09PSBcIiVcIikge1xuICAgICAgICB3aGVyZSA9IHBhcnNlRmxvYXQod2hlcmUuc3Vic3RyaW5nKDAsIHdoZXJlLmxlbmd0aCAtIDEpKSAvIDEwMCAqIGR1cmF0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdoZXJlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBpZiAod2hlcmUubWFya2VyID09PSBcInByZXZcIikge1xuICAgICAgICB3aGVyZSA9IGZpbmRNYXJrZXJUaW1lQmVmb3JlKGN1cnJlbnRUaW1lKSA/PyAwO1xuICAgICAgICBpZiAoaXNQbGF5aW5nICYmIGN1cnJlbnRUaW1lIC0gd2hlcmUgPCAxKSB7XG4gICAgICAgICAgd2hlcmUgPSBmaW5kTWFya2VyVGltZUJlZm9yZSh3aGVyZSkgPz8gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh3aGVyZS5tYXJrZXIgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIHdoZXJlID0gZmluZE1hcmtlclRpbWVBZnRlcihjdXJyZW50VGltZSkgPz8gZHVyYXRpb247XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aGVyZS5tYXJrZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgY29uc3QgbWFya2VyID0gbWFya2Vyc1t3aGVyZS5tYXJrZXJdO1xuICAgICAgICBpZiAobWFya2VyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgbWFya2VyIGluZGV4OiAke3doZXJlLm1hcmtlcn1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aGVyZSA9IG1hcmtlclswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB0YXJnZXRUaW1lID0gTWF0aC5taW4oTWF0aC5tYXgod2hlcmUsIDApLCBkdXJhdGlvbik7XG4gICAgaWYgKHRhcmdldFRpbWUgKiAxMDAwID09PSBwYXVzZUVsYXBzZWRUaW1lKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHRhcmdldFRpbWUgPCBsYXN0RXZlbnRUaW1lKSB7XG4gICAgICBmZWVkKFwiXFx4MWJjXCIpOyAvLyByZXNldCB0ZXJtaW5hbFxuICAgICAgcmVzaXplVGVybWluYWxUb0luaXRpYWxTaXplKCk7XG4gICAgICBuZXh0RXZlbnRJbmRleCA9IDA7XG4gICAgICBsYXN0RXZlbnRUaW1lID0gMDtcbiAgICB9XG4gICAgbGV0IGV2ZW50ID0gZXZlbnRzW25leHRFdmVudEluZGV4XTtcbiAgICB3aGlsZSAoZXZlbnQgJiYgZXZlbnRbMF0gPD0gdGFyZ2V0VGltZSkge1xuICAgICAgaWYgKGV2ZW50WzFdID09PSBcIm9cIiB8fCBldmVudFsxXSA9PT0gXCJyXCIpIHtcbiAgICAgICAgZXhlY3V0ZUV2ZW50KGV2ZW50KTtcbiAgICAgIH1cbiAgICAgIGxhc3RFdmVudFRpbWUgPSBldmVudFswXTtcbiAgICAgIGV2ZW50ID0gZXZlbnRzWysrbmV4dEV2ZW50SW5kZXhdO1xuICAgIH1cbiAgICBwYXVzZUVsYXBzZWRUaW1lID0gdGFyZ2V0VGltZSAqIDEwMDA7XG4gICAgZWZmZWN0aXZlU3RhcnRBdCA9IG51bGw7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCAmJiBhdWRpb1NlZWthYmxlKSB7XG4gICAgICBhdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPSB0YXJnZXRUaW1lIC8gc3BlZWQ7XG4gICAgfVxuICAgIGlmIChpc1BsYXlpbmcpIHtcbiAgICAgIGF3YWl0IHJlc3VtZSgpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRzW25leHRFdmVudEluZGV4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvbkVuZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBmaW5kTWFya2VyVGltZUJlZm9yZSh0aW1lKSB7XG4gICAgaWYgKG1hcmtlcnMubGVuZ3RoID09IDApIHJldHVybjtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IG1hcmtlciA9IG1hcmtlcnNbaV07XG4gICAgbGV0IGxhc3RNYXJrZXJUaW1lQmVmb3JlO1xuICAgIHdoaWxlIChtYXJrZXIgJiYgbWFya2VyWzBdIDwgdGltZSkge1xuICAgICAgbGFzdE1hcmtlclRpbWVCZWZvcmUgPSBtYXJrZXJbMF07XG4gICAgICBtYXJrZXIgPSBtYXJrZXJzWysraV07XG4gICAgfVxuICAgIHJldHVybiBsYXN0TWFya2VyVGltZUJlZm9yZTtcbiAgfVxuICBmdW5jdGlvbiBmaW5kTWFya2VyVGltZUFmdGVyKHRpbWUpIHtcbiAgICBpZiAobWFya2Vycy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgIGxldCBpID0gbWFya2Vycy5sZW5ndGggLSAxO1xuICAgIGxldCBtYXJrZXIgPSBtYXJrZXJzW2ldO1xuICAgIGxldCBmaXJzdE1hcmtlclRpbWVBZnRlcjtcbiAgICB3aGlsZSAobWFya2VyICYmIG1hcmtlclswXSA+IHRpbWUpIHtcbiAgICAgIGZpcnN0TWFya2VyVGltZUFmdGVyID0gbWFya2VyWzBdO1xuICAgICAgbWFya2VyID0gbWFya2Vyc1stLWldO1xuICAgIH1cbiAgICByZXR1cm4gZmlyc3RNYXJrZXJUaW1lQWZ0ZXI7XG4gIH1cbiAgZnVuY3Rpb24gc3RlcChuKSB7XG4gICAgaWYgKG4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbiA9IDE7XG4gICAgfVxuICAgIGxldCBuZXh0RXZlbnQ7XG4gICAgbGV0IHRhcmdldEluZGV4O1xuICAgIGlmIChuID4gMCkge1xuICAgICAgbGV0IGluZGV4ID0gbmV4dEV2ZW50SW5kZXg7XG4gICAgICBuZXh0RXZlbnQgPSBldmVudHNbaW5kZXhdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgd2hpbGUgKG5leHRFdmVudCAhPT0gdW5kZWZpbmVkICYmIG5leHRFdmVudFsxXSAhPT0gXCJvXCIpIHtcbiAgICAgICAgICBuZXh0RXZlbnQgPSBldmVudHNbKytpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHRFdmVudCAhPT0gdW5kZWZpbmVkICYmIG5leHRFdmVudFsxXSA9PT0gXCJvXCIpIHtcbiAgICAgICAgICB0YXJnZXRJbmRleCA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpbmRleCA9IE1hdGgubWF4KG5leHRFdmVudEluZGV4IC0gMiwgMCk7XG4gICAgICBuZXh0RXZlbnQgPSBldmVudHNbaW5kZXhdO1xuICAgICAgZm9yIChsZXQgaSA9IG47IGkgPCAwOyBpKyspIHtcbiAgICAgICAgd2hpbGUgKG5leHRFdmVudCAhPT0gdW5kZWZpbmVkICYmIG5leHRFdmVudFsxXSAhPT0gXCJvXCIpIHtcbiAgICAgICAgICBuZXh0RXZlbnQgPSBldmVudHNbLS1pbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHRFdmVudCAhPT0gdW5kZWZpbmVkICYmIG5leHRFdmVudFsxXSA9PT0gXCJvXCIpIHtcbiAgICAgICAgICB0YXJnZXRJbmRleCA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmZWVkKFwiXFx4MWJjXCIpOyAvLyByZXNldCB0ZXJtaW5hbFxuICAgICAgICByZXNpemVUZXJtaW5hbFRvSW5pdGlhbFNpemUoKTtcbiAgICAgICAgbmV4dEV2ZW50SW5kZXggPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGFyZ2V0SW5kZXggPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIHdoaWxlIChuZXh0RXZlbnRJbmRleCA8PSB0YXJnZXRJbmRleCkge1xuICAgICAgbmV4dEV2ZW50ID0gZXZlbnRzW25leHRFdmVudEluZGV4KytdO1xuICAgICAgaWYgKG5leHRFdmVudFsxXSA9PT0gXCJvXCIgfHwgbmV4dEV2ZW50WzFdID09PSBcInJcIikge1xuICAgICAgICBleGVjdXRlRXZlbnQobmV4dEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdEV2ZW50VGltZSA9IG5leHRFdmVudFswXTtcbiAgICBwYXVzZUVsYXBzZWRUaW1lID0gbGFzdEV2ZW50VGltZSAqIDEwMDA7XG4gICAgZWZmZWN0aXZlU3RhcnRBdCA9IG51bGw7XG4gICAgaWYgKGF1ZGlvRWxlbWVudCAmJiBhdWRpb1NlZWthYmxlKSB7XG4gICAgICBhdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPSBsYXN0RXZlbnRUaW1lIC8gc3BlZWQ7XG4gICAgfVxuICAgIGlmIChldmVudHNbdGFyZ2V0SW5kZXggKyAxXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvbkVuZCgpO1xuICAgIH1cbiAgfVxuICBhc3luYyBmdW5jdGlvbiByZXN0YXJ0KCkge1xuICAgIGlmIChldmVudFRpbWVvdXRJZCkgdGhyb3cgbmV3IEVycm9yKFwic3RpbGwgcGxheWluZ1wiKTtcbiAgICBpZiAoZXZlbnRzW25leHRFdmVudEluZGV4XSAhPT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoXCJub3QgZW5kZWRcIik7XG4gICAgc2VlaygwKTtcbiAgICBhd2FpdCByZXN1bWUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQb3N0ZXIodGltZSkge1xuICAgIHJldHVybiBldmVudHMuZmlsdGVyKGUgPT4gZVswXSA8IHRpbWUgJiYgZVsxXSA9PT0gXCJvXCIpLm1hcChlID0+IGVbMl0pO1xuICB9XG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCkge1xuICAgIGlmIChldmVudFRpbWVvdXRJZCkge1xuICAgICAgcmV0dXJuIChub3coKSAtIHN0YXJ0VGltZSkgLyAxMDAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKHBhdXNlRWxhcHNlZFRpbWUgPz8gMCkgLyAxMDAwO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiByZXNpemVUZXJtaW5hbFRvSW5pdGlhbFNpemUoKSB7XG4gICAgcmVzaXplKGluaXRpYWxDb2xzLCBpbml0aWFsUm93cyk7XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBBdWRpb0N0eCgpIHtcbiAgICBhdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoe1xuICAgICAgbGF0ZW5jeUhpbnQ6IFwiaW50ZXJhY3RpdmVcIlxuICAgIH0pO1xuICAgIGNvbnN0IHNyYyA9IGF1ZGlvQ3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZShhdWRpb0VsZW1lbnQpO1xuICAgIHNyYy5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbiAgICBub3cgPSBhdWRpb05vdztcbiAgfVxuICBmdW5jdGlvbiBhdWRpb05vdygpIHtcbiAgICBpZiAoIWF1ZGlvQ3R4KSB0aHJvdyBuZXcgRXJyb3IoXCJhdWRpbyBjb250ZXh0IG5vdCBzdGFydGVkIC0gY2FuJ3QgdGVsbCB0aW1lIVwiKTtcbiAgICBjb25zdCB7XG4gICAgICBjb250ZXh0VGltZSxcbiAgICAgIHBlcmZvcm1hbmNlVGltZVxuICAgIH0gPSBhdWRpb0N0eC5nZXRPdXRwdXRUaW1lc3RhbXAoKTtcblxuICAgIC8vIFRoZSBjaGVjayBiZWxvdyBpcyBuZWVkZWQgZm9yIENocm9tZSxcbiAgICAvLyB3aGljaCByZXR1cm5zIDAgZm9yIGZpcnN0IHNldmVyYWwgZG96ZW4gbWlsbGlzLFxuICAgIC8vIGNvbXBsZXRlbHkgcnVpbmluZyB0aGUgdGltaW5nICh0aGUgY2xvY2sganVtcHMgYmFja3dhcmRzIG9uY2UpLFxuICAgIC8vIHRoZXJlZm9yZSB3ZSBpbml0aWFsbHkgaWdub3JlIHBlcmZvcm1hbmNlVGltZSBpbiBvdXIgY2FsY3VsYXRpb24uXG5cbiAgICByZXR1cm4gcGVyZm9ybWFuY2VUaW1lID09PSAwID8gY29udGV4dFRpbWUgKiAxMDAwIDogY29udGV4dFRpbWUgKiAxMDAwICsgKHBlcmZvcm1hbmNlLm5vdygpIC0gcGVyZm9ybWFuY2VUaW1lKTtcbiAgfVxuICBmdW5jdGlvbiBvbkF1ZGlvV2FpdGluZygpIHtcbiAgICBsb2dnZXIuZGVidWcoXCJhdWRpbyBidWZmZXJpbmdcIik7XG4gICAgd2FpdGluZ0ZvckF1ZGlvID0gdHJ1ZTtcbiAgICBzaG91bGRSZXN1bWVPbkF1ZGlvUGxheWluZyA9ICEhZXZlbnRUaW1lb3V0SWQ7XG4gICAgd2FpdGluZ1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHNldFN0YXRlKFwibG9hZGluZ1wiKSwgMTAwMCk7XG4gICAgaWYgKCFldmVudFRpbWVvdXRJZCkgcmV0dXJuIHRydWU7XG4gICAgbG9nZ2VyLmRlYnVnKFwicGF1c2luZyBzZXNzaW9uIHBsYXliYWNrXCIpO1xuICAgIGNhbmNlbE5leHRFdmVudCgpO1xuICAgIHBhdXNlRWxhcHNlZFRpbWUgPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgfVxuICBmdW5jdGlvbiBvbkF1ZGlvUGxheWluZygpIHtcbiAgICBsb2dnZXIuZGVidWcoXCJhdWRpbyByZXN1bWVkXCIpO1xuICAgIGNsZWFyVGltZW91dCh3YWl0aW5nVGltZW91dCk7XG4gICAgc2V0U3RhdGUoXCJwbGF5aW5nXCIpO1xuICAgIGlmICghd2FpdGluZ0ZvckF1ZGlvKSByZXR1cm47XG4gICAgd2FpdGluZ0ZvckF1ZGlvID0gZmFsc2U7XG4gICAgaWYgKHNob3VsZFJlc3VtZU9uQXVkaW9QbGF5aW5nKSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJyZXN1bWluZyBzZXNzaW9uIHBsYXliYWNrXCIpO1xuICAgICAgc3RhcnRUaW1lID0gbm93KCkgLSBwYXVzZUVsYXBzZWRUaW1lO1xuICAgICAgcGF1c2VFbGFwc2VkVGltZSA9IG51bGw7XG4gICAgICBzY2hlZHVsZU5leHRFdmVudCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtdXRlKCkge1xuICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5tdXRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdW5tdXRlKCkge1xuICAgIGlmIChhdWRpb0VsZW1lbnQpIHtcbiAgICAgIGF1ZGlvRWxlbWVudC5tdXRlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgaW5pdCxcbiAgICBwbGF5LFxuICAgIHBhdXNlLFxuICAgIHNlZWssXG4gICAgc3RlcCxcbiAgICByZXN0YXJ0LFxuICAgIHN0b3A6IHBhdXNlLFxuICAgIG11dGUsXG4gICAgdW5tdXRlLFxuICAgIGdldEN1cnJlbnRUaW1lXG4gIH07XG59XG5mdW5jdGlvbiBiYXRjaGVyKGxvZ2dlcikge1xuICBsZXQgbWluRnJhbWVUaW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAxLjAgLyA2MDtcbiAgbGV0IHByZXZFdmVudDtcbiAgcmV0dXJuIGVtaXQgPT4ge1xuICAgIGxldCBpYyA9IDA7XG4gICAgbGV0IG9jID0gMDtcbiAgICByZXR1cm4ge1xuICAgICAgc3RlcDogZXZlbnQgPT4ge1xuICAgICAgICBpYysrO1xuICAgICAgICBpZiAocHJldkV2ZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwcmV2RXZlbnQgPSBldmVudDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50WzFdID09PSBcIm9cIiAmJiBwcmV2RXZlbnRbMV0gPT09IFwib1wiICYmIGV2ZW50WzBdIC0gcHJldkV2ZW50WzBdIDwgbWluRnJhbWVUaW1lKSB7XG4gICAgICAgICAgcHJldkV2ZW50WzJdICs9IGV2ZW50WzJdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVtaXQocHJldkV2ZW50KTtcbiAgICAgICAgICBwcmV2RXZlbnQgPSBldmVudDtcbiAgICAgICAgICBvYysrO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmx1c2g6ICgpID0+IHtcbiAgICAgICAgaWYgKHByZXZFdmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZW1pdChwcmV2RXZlbnQpO1xuICAgICAgICAgIG9jKys7XG4gICAgICAgIH1cbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBiYXRjaGVkICR7aWN9IGZyYW1lcyB0byAke29jfSBmcmFtZXNgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufVxuZnVuY3Rpb24gcHJlcGFyZShyZWNvcmRpbmcsIGxvZ2dlciwgX3JlZjQpIHtcbiAgbGV0IHtcbiAgICBzdGFydEF0ID0gMCxcbiAgICBpZGxlVGltZUxpbWl0LFxuICAgIG1pbkZyYW1lVGltZSxcbiAgICBpbnB1dE9mZnNldCxcbiAgICBtYXJrZXJzX1xuICB9ID0gX3JlZjQ7XG4gIGxldCB7XG4gICAgZXZlbnRzXG4gIH0gPSByZWNvcmRpbmc7XG4gIGlmICghKGV2ZW50cyBpbnN0YW5jZW9mIFN0cmVhbSkpIHtcbiAgICBldmVudHMgPSBuZXcgU3RyZWFtKGV2ZW50cyk7XG4gIH1cbiAgaWRsZVRpbWVMaW1pdCA9IGlkbGVUaW1lTGltaXQgPz8gcmVjb3JkaW5nLmlkbGVUaW1lTGltaXQgPz8gSW5maW5pdHk7XG4gIGNvbnN0IGxpbWl0ZXJPdXRwdXQgPSB7XG4gICAgb2Zmc2V0OiAwXG4gIH07XG4gIGV2ZW50cyA9IGV2ZW50cy50cmFuc2Zvcm0oYmF0Y2hlcihsb2dnZXIsIG1pbkZyYW1lVGltZSkpLm1hcCh0aW1lTGltaXRlcihpZGxlVGltZUxpbWl0LCBzdGFydEF0LCBsaW1pdGVyT3V0cHV0KSkubWFwKG1hcmtlcldyYXBwZXIoKSk7XG4gIGlmIChtYXJrZXJzXyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbWFya2Vyc18gPSBuZXcgU3RyZWFtKG1hcmtlcnNfKS5tYXAobm9ybWFsaXplTWFya2VyKTtcbiAgICBldmVudHMgPSBldmVudHMuZmlsdGVyKGUgPT4gZVsxXSAhPT0gXCJtXCIpLm11bHRpcGxleChtYXJrZXJzXywgKGEsIGIpID0+IGFbMF0gPCBiWzBdKS5tYXAobWFya2VyV3JhcHBlcigpKTtcbiAgfVxuICBldmVudHMgPSBldmVudHMudG9BcnJheSgpO1xuICBpZiAoaW5wdXRPZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgIGV2ZW50cyA9IGV2ZW50cy5tYXAoZSA9PiBlWzFdID09PSBcImlcIiA/IFtlWzBdICsgaW5wdXRPZmZzZXQsIGVbMV0sIGVbMl1dIDogZSk7XG4gICAgZXZlbnRzLnNvcnQoKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcbiAgfVxuICBjb25zdCBkdXJhdGlvbiA9IGV2ZW50c1tldmVudHMubGVuZ3RoIC0gMV1bMF07XG4gIGNvbnN0IGVmZmVjdGl2ZVN0YXJ0QXQgPSBzdGFydEF0IC0gbGltaXRlck91dHB1dC5vZmZzZXQ7XG4gIHJldHVybiB7XG4gICAgLi4ucmVjb3JkaW5nLFxuICAgIGV2ZW50cyxcbiAgICBkdXJhdGlvbixcbiAgICBlZmZlY3RpdmVTdGFydEF0XG4gIH07XG59XG5mdW5jdGlvbiBub3JtYWxpemVNYXJrZXIobSkge1xuICByZXR1cm4gdHlwZW9mIG0gPT09IFwibnVtYmVyXCIgPyBbbSwgXCJtXCIsIFwiXCJdIDogW21bMF0sIFwibVwiLCBtWzFdXTtcbn1cbmZ1bmN0aW9uIHRpbWVMaW1pdGVyKGlkbGVUaW1lTGltaXQsIHN0YXJ0QXQsIG91dHB1dCkge1xuICBsZXQgcHJldlQgPSAwO1xuICBsZXQgc2hpZnQgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICBjb25zdCBkZWxheSA9IGVbMF0gLSBwcmV2VDtcbiAgICBjb25zdCBkZWx0YSA9IGRlbGF5IC0gaWRsZVRpbWVMaW1pdDtcbiAgICBwcmV2VCA9IGVbMF07XG4gICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgc2hpZnQgKz0gZGVsdGE7XG4gICAgICBpZiAoZVswXSA8IHN0YXJ0QXQpIHtcbiAgICAgICAgb3V0cHV0Lm9mZnNldCArPSBkZWx0YTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtlWzBdIC0gc2hpZnQsIGVbMV0sIGVbMl1dO1xuICB9O1xufVxuZnVuY3Rpb24gbWFya2VyV3JhcHBlcigpIHtcbiAgbGV0IGkgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZVsxXSA9PT0gXCJtXCIpIHtcbiAgICAgIHJldHVybiBbZVswXSwgZVsxXSwge1xuICAgICAgICBpbmRleDogaSsrLFxuICAgICAgICB0aW1lOiBlWzBdLFxuICAgICAgICBsYWJlbDogZVsyXVxuICAgICAgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGR1bXAocmVjb3JkaW5nLCBmaWxlbmFtZSkge1xuICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIGNvbnN0IGV2ZW50cyA9IHJlY29yZGluZy5ldmVudHMubWFwKGUgPT4gZVsxXSA9PT0gXCJtXCIgPyBbZVswXSwgZVsxXSwgZVsyXS5sYWJlbF0gOiBlKTtcbiAgY29uc3QgYXNjaWljYXN0ID0gdW5wYXJzZUFzY2lpY2FzdFYyKHtcbiAgICAuLi5yZWNvcmRpbmcsXG4gICAgZXZlbnRzXG4gIH0pO1xuICBsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFthc2NpaWNhc3RdLCB7XG4gICAgdHlwZTogXCJ0ZXh0L3BsYWluXCJcbiAgfSkpO1xuICBsaW5rLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gIGxpbmsuY2xpY2soKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUF1ZGlvRWxlbWVudChzcmMpIHtcbiAgY29uc3QgYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgYXVkaW8ucHJlbG9hZCA9IFwibWV0YWRhdGFcIjtcbiAgYXVkaW8ubG9vcCA9IGZhbHNlO1xuICBhdWRpby5jcm9zc09yaWdpbiA9IFwiYW5vbnltb3VzXCI7XG4gIGxldCByZXNvbHZlO1xuICBjb25zdCBjYW5QbGF5ID0gbmV3IFByb21pc2UocmVzb2x2ZV8gPT4ge1xuICAgIHJlc29sdmUgPSByZXNvbHZlXztcbiAgfSk7XG4gIGZ1bmN0aW9uIG9uQ2FuUGxheSgpIHtcbiAgICByZXNvbHZlKCk7XG4gICAgYXVkaW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXlcIiwgb25DYW5QbGF5KTtcbiAgfVxuICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheVwiLCBvbkNhblBsYXkpO1xuICBhdWRpby5zcmMgPSBzcmM7XG4gIGF1ZGlvLmxvYWQoKTtcbiAgYXdhaXQgY2FuUGxheTtcbiAgcmV0dXJuIGF1ZGlvO1xufVxuXG5mdW5jdGlvbiBjbG9jayhfcmVmLCBfcmVmMiwgX3JlZjMpIHtcbiAgbGV0IHtcbiAgICBob3VyQ29sb3IgPSAzLFxuICAgIG1pbnV0ZUNvbG9yID0gNCxcbiAgICBzZXBhcmF0b3JDb2xvciA9IDlcbiAgfSA9IF9yZWY7XG4gIGxldCB7XG4gICAgZmVlZFxuICB9ID0gX3JlZjI7XG4gIGxldCB7XG4gICAgY29scyA9IDUsXG4gICAgcm93cyA9IDFcbiAgfSA9IF9yZWYzO1xuICBjb25zdCBtaWRkbGVSb3cgPSBNYXRoLmZsb29yKHJvd3MgLyAyKTtcbiAgY29uc3QgbGVmdFBhZCA9IE1hdGguZmxvb3IoY29scyAvIDIpIC0gMjtcbiAgY29uc3Qgc2V0dXBDdXJzb3IgPSBgXFx4MWJbPzI1bFxceDFiWzFtXFx4MWJbJHttaWRkbGVSb3d9QmA7XG4gIGxldCBpbnRlcnZhbElkO1xuICBjb25zdCBnZXRDdXJyZW50VGltZSA9ICgpID0+IHtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBoID0gZC5nZXRIb3VycygpO1xuICAgIGNvbnN0IG0gPSBkLmdldE1pbnV0ZXMoKTtcbiAgICBjb25zdCBzZXFzID0gW107XG4gICAgc2Vxcy5wdXNoKFwiXFxyXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVmdFBhZDsgaSsrKSB7XG4gICAgICBzZXFzLnB1c2goXCIgXCIpO1xuICAgIH1cbiAgICBzZXFzLnB1c2goYFxceDFiWzMke2hvdXJDb2xvcn1tYCk7XG4gICAgaWYgKGggPCAxMCkge1xuICAgICAgc2Vxcy5wdXNoKFwiMFwiKTtcbiAgICB9XG4gICAgc2Vxcy5wdXNoKGAke2h9YCk7XG4gICAgc2Vxcy5wdXNoKGBcXHgxYlszJHtzZXBhcmF0b3JDb2xvcn07NW06XFx4MWJbMjVtYCk7XG4gICAgc2Vxcy5wdXNoKGBcXHgxYlszJHttaW51dGVDb2xvcn1tYCk7XG4gICAgaWYgKG0gPCAxMCkge1xuICAgICAgc2Vxcy5wdXNoKFwiMFwiKTtcbiAgICB9XG4gICAgc2Vxcy5wdXNoKGAke219YCk7XG4gICAgcmV0dXJuIHNlcXM7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVRpbWUgPSAoKSA9PiB7XG4gICAgZ2V0Q3VycmVudFRpbWUoKS5mb3JFYWNoKGZlZWQpO1xuICB9O1xuICByZXR1cm4ge1xuICAgIGluaXQ6ICgpID0+IHtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gMjQgKiA2MDtcbiAgICAgIGNvbnN0IHBvc3RlciA9IFtzZXR1cEN1cnNvcl0uY29uY2F0KGdldEN1cnJlbnRUaW1lKCkpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29scyxcbiAgICAgICAgcm93cyxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIHBvc3RlclxuICAgICAgfTtcbiAgICB9LFxuICAgIHBsYXk6ICgpID0+IHtcbiAgICAgIGZlZWQoc2V0dXBDdXJzb3IpO1xuICAgICAgdXBkYXRlVGltZSgpO1xuICAgICAgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKHVwZGF0ZVRpbWUsIDEwMDApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBzdG9wOiAoKSA9PiB7XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgIH0sXG4gICAgZ2V0Q3VycmVudFRpbWU6ICgpID0+IHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgcmV0dXJuIGQuZ2V0SG91cnMoKSAqIDYwICsgZC5nZXRNaW51dGVzKCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiByYW5kb20oc3JjLCBfcmVmLCBfcmVmMikge1xuICBsZXQge1xuICAgIGZlZWRcbiAgfSA9IF9yZWY7XG4gIGxldCB7XG4gICAgc3BlZWRcbiAgfSA9IF9yZWYyO1xuICBjb25zdCBiYXNlID0gXCIgXCIuY2hhckNvZGVBdCgwKTtcbiAgY29uc3QgcmFuZ2UgPSBcIn5cIi5jaGFyQ29kZUF0KDApIC0gYmFzZTtcbiAgbGV0IHRpbWVvdXRJZDtcbiAgY29uc3Qgc2NoZWR1bGUgPSAoKSA9PiB7XG4gICAgY29uc3QgdCA9IE1hdGgucG93KDUsIE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KHByaW50LCB0IC8gc3BlZWQpO1xuICB9O1xuICBjb25zdCBwcmludCA9ICgpID0+IHtcbiAgICBzY2hlZHVsZSgpO1xuICAgIGNvbnN0IGNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJhc2UgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSkpO1xuICAgIGZlZWQoY2hhcik7XG4gIH07XG4gIHJldHVybiAoKSA9PiB7XG4gICAgc2NoZWR1bGUoKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0aW1lb3V0SWQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBiZW5jaG1hcmsoX3JlZiwgX3JlZjIpIHtcbiAgbGV0IHtcbiAgICB1cmwsXG4gICAgaXRlcmF0aW9ucyA9IDEwXG4gIH0gPSBfcmVmO1xuICBsZXQge1xuICAgIGZlZWQsXG4gICAgc2V0U3RhdGVcbiAgfSA9IF9yZWYyO1xuICBsZXQgZGF0YTtcbiAgbGV0IGJ5dGVDb3VudCA9IDA7XG4gIHJldHVybiB7XG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgIGNvbnN0IHJlY29yZGluZyA9IGF3YWl0IHBhcnNlJDIoYXdhaXQgZmV0Y2godXJsKSk7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbHMsXG4gICAgICAgIHJvd3MsXG4gICAgICAgIGV2ZW50c1xuICAgICAgfSA9IHJlY29yZGluZztcbiAgICAgIGRhdGEgPSBBcnJheS5mcm9tKGV2ZW50cykuZmlsdGVyKF9yZWYzID0+IHtcbiAgICAgICAgbGV0IFtfdGltZSwgdHlwZSwgX3RleHRdID0gX3JlZjM7XG4gICAgICAgIHJldHVybiB0eXBlID09PSBcIm9cIjtcbiAgICAgIH0pLm1hcChfcmVmNCA9PiB7XG4gICAgICAgIGxldCBbdGltZSwgX3R5cGUsIHRleHRdID0gX3JlZjQ7XG4gICAgICAgIHJldHVybiBbdGltZSwgdGV4dF07XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdWzBdO1xuICAgICAgZm9yIChjb25zdCBbXywgdGV4dF0gb2YgZGF0YSkge1xuICAgICAgICBieXRlQ291bnQgKz0gbmV3IEJsb2IoW3RleHRdKS5zaXplO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29scyxcbiAgICAgICAgcm93cyxcbiAgICAgICAgZHVyYXRpb25cbiAgICAgIH07XG4gICAgfSxcbiAgICBwbGF5KCkge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhdGlvbnM7IGkrKykge1xuICAgICAgICBmb3IgKGNvbnN0IFtfLCB0ZXh0XSBvZiBkYXRhKSB7XG4gICAgICAgICAgZmVlZCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBmZWVkKFwiXFx4MWJjXCIpOyAvLyByZXNldCB0ZXJtaW5hbFxuICAgICAgfVxuXG4gICAgICBjb25zdCBlbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IChlbmRUaW1lIC0gc3RhcnRUaW1lKSAvIDEwMDA7XG4gICAgICBjb25zdCB0aHJvdWdocHV0ID0gYnl0ZUNvdW50ICogaXRlcmF0aW9ucyAvIGR1cmF0aW9uO1xuICAgICAgY29uc3QgdGhyb3VnaHB1dE1icyA9IGJ5dGVDb3VudCAvICgxMDI0ICogMTAyNCkgKiBpdGVyYXRpb25zIC8gZHVyYXRpb247XG4gICAgICBjb25zb2xlLmluZm8oXCJiZW5jaG1hcms6IHJlc3VsdFwiLCB7XG4gICAgICAgIGJ5dGVDb3VudCxcbiAgICAgICAgaXRlcmF0aW9ucyxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIHRocm91Z2hwdXQsXG4gICAgICAgIHRocm91Z2hwdXRNYnNcbiAgICAgIH0pO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNldFN0YXRlKFwic3RvcHBlZFwiLCB7XG4gICAgICAgICAgcmVhc29uOiBcImVuZGVkXCJcbiAgICAgICAgfSk7XG4gICAgICB9LCAwKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcbn1cblxuY2xhc3MgUXVldWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5vblB1c2ggPSB1bmRlZmluZWQ7XG4gIH1cbiAgcHVzaChpdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgIGlmICh0aGlzLm9uUHVzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9uUHVzaCh0aGlzLnBvcEFsbCgpKTtcbiAgICAgIHRoaXMub25QdXNoID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBwb3BBbGwoKSB7XG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aGl6ID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgdGhpei5vblB1c2ggPSByZXNvbHZlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldEJ1ZmZlcihidWZmZXJUaW1lLCBmZWVkLCByZXNpemUsIG9uSW5wdXQsIG9uTWFya2VyLCBzZXRUaW1lLCBiYXNlU3RyZWFtVGltZSwgbWluRnJhbWVUaW1lLCBsb2dnZXIpIHtcbiAgY29uc3QgZXhlY3V0ZSA9IGV4ZWN1dGVFdmVudChmZWVkLCByZXNpemUsIG9uSW5wdXQsIG9uTWFya2VyKTtcbiAgaWYgKGJ1ZmZlclRpbWUgPT09IDApIHtcbiAgICBsb2dnZXIuZGVidWcoXCJ1c2luZyBubyBidWZmZXJcIik7XG4gICAgcmV0dXJuIG51bGxCdWZmZXIoZXhlY3V0ZSk7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyVGltZSA9IGJ1ZmZlclRpbWUgPz8ge307XG4gICAgbGV0IGdldEJ1ZmZlclRpbWU7XG4gICAgaWYgKHR5cGVvZiBidWZmZXJUaW1lID09PSBcIm51bWJlclwiKSB7XG4gICAgICBsb2dnZXIuZGVidWcoYHVzaW5nIGZpeGVkIHRpbWUgYnVmZmVyICgke2J1ZmZlclRpbWV9IG1zKWApO1xuICAgICAgZ2V0QnVmZmVyVGltZSA9IF9sYXRlbmN5ID0+IGJ1ZmZlclRpbWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYnVmZmVyVGltZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJ1c2luZyBjdXN0b20gZHluYW1pYyBidWZmZXJcIik7XG4gICAgICBnZXRCdWZmZXJUaW1lID0gYnVmZmVyVGltZSh7XG4gICAgICAgIGxvZ2dlclxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcInVzaW5nIGFkYXB0aXZlIGJ1ZmZlclwiLCBidWZmZXJUaW1lKTtcbiAgICAgIGdldEJ1ZmZlclRpbWUgPSBhZGFwdGl2ZUJ1ZmZlclRpbWVQcm92aWRlcih7XG4gICAgICAgIGxvZ2dlclxuICAgICAgfSwgYnVmZmVyVGltZSk7XG4gICAgfVxuICAgIHJldHVybiBidWZmZXIoZ2V0QnVmZmVyVGltZSwgZXhlY3V0ZSwgc2V0VGltZSwgbG9nZ2VyLCBiYXNlU3RyZWFtVGltZSA/PyAwLjAsIG1pbkZyYW1lVGltZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIG51bGxCdWZmZXIoZXhlY3V0ZSkge1xuICByZXR1cm4ge1xuICAgIHB1c2hFdmVudChldmVudCkge1xuICAgICAgZXhlY3V0ZShldmVudFsxXSwgZXZlbnRbMl0pO1xuICAgIH0sXG4gICAgcHVzaFRleHQodGV4dCkge1xuICAgICAgZXhlY3V0ZShcIm9cIiwgdGV4dCk7XG4gICAgfSxcbiAgICBzdG9wKCkge31cbiAgfTtcbn1cbmZ1bmN0aW9uIGV4ZWN1dGVFdmVudChmZWVkLCByZXNpemUsIG9uSW5wdXQsIG9uTWFya2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY29kZSwgZGF0YSkge1xuICAgIGlmIChjb2RlID09PSBcIm9cIikge1xuICAgICAgZmVlZChkYXRhKTtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IFwiaVwiKSB7XG4gICAgICBvbklucHV0KGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gXCJyXCIpIHtcbiAgICAgIHJlc2l6ZShkYXRhLmNvbHMsIGRhdGEucm93cyk7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSBcIm1cIikge1xuICAgICAgb25NYXJrZXIoZGF0YSk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gYnVmZmVyKGdldEJ1ZmZlclRpbWUsIGV4ZWN1dGUsIHNldFRpbWUsIGxvZ2dlciwgYmFzZVN0cmVhbVRpbWUpIHtcbiAgbGV0IG1pbkZyYW1lVGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogMS4wIC8gNjA7XG4gIGxldCBlcG9jaCA9IHBlcmZvcm1hbmNlLm5vdygpIC0gYmFzZVN0cmVhbVRpbWUgKiAxMDAwO1xuICBsZXQgYnVmZmVyVGltZSA9IGdldEJ1ZmZlclRpbWUoMCk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlKCk7XG4gIG1pbkZyYW1lVGltZSAqPSAxMDAwO1xuICBsZXQgcHJldkVsYXBzZWRTdHJlYW1UaW1lID0gLW1pbkZyYW1lVGltZTtcbiAgbGV0IHN0b3AgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZWxhcHNlZFdhbGxUaW1lKCkge1xuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKSAtIGVwb2NoO1xuICB9XG4gIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgIHdoaWxlICghc3RvcCkge1xuICAgICAgY29uc3QgZXZlbnRzID0gYXdhaXQgcXVldWUucG9wQWxsKCk7XG4gICAgICBpZiAoc3RvcCkgcmV0dXJuO1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgICAgY29uc3QgZWxhcHNlZFN0cmVhbVRpbWUgPSBldmVudFswXSAqIDEwMDAgKyBidWZmZXJUaW1lO1xuICAgICAgICBpZiAoZWxhcHNlZFN0cmVhbVRpbWUgLSBwcmV2RWxhcHNlZFN0cmVhbVRpbWUgPCBtaW5GcmFtZVRpbWUpIHtcbiAgICAgICAgICBleGVjdXRlKGV2ZW50WzFdLCBldmVudFsyXSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsYXkgPSBlbGFwc2VkU3RyZWFtVGltZSAtIGVsYXBzZWRXYWxsVGltZSgpO1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgYXdhaXQgc2xlZXAoZGVsYXkpO1xuICAgICAgICAgIGlmIChzdG9wKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZShldmVudFswXSk7XG4gICAgICAgIGV4ZWN1dGUoZXZlbnRbMV0sIGV2ZW50WzJdKTtcbiAgICAgICAgcHJldkVsYXBzZWRTdHJlYW1UaW1lID0gZWxhcHNlZFN0cmVhbVRpbWU7XG4gICAgICB9XG4gICAgfVxuICB9LCAwKTtcbiAgcmV0dXJuIHtcbiAgICBwdXNoRXZlbnQoZXZlbnQpIHtcbiAgICAgIGxldCBsYXRlbmN5ID0gZWxhcHNlZFdhbGxUaW1lKCkgLSBldmVudFswXSAqIDEwMDA7XG4gICAgICBpZiAobGF0ZW5jeSA8IDApIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBjb3JyZWN0aW5nIGVwb2NoIGJ5ICR7bGF0ZW5jeX0gbXNgKTtcbiAgICAgICAgZXBvY2ggKz0gbGF0ZW5jeTtcbiAgICAgICAgbGF0ZW5jeSA9IDA7XG4gICAgICB9XG4gICAgICBidWZmZXJUaW1lID0gZ2V0QnVmZmVyVGltZShsYXRlbmN5KTtcbiAgICAgIHF1ZXVlLnB1c2goZXZlbnQpO1xuICAgIH0sXG4gICAgcHVzaFRleHQodGV4dCkge1xuICAgICAgcXVldWUucHVzaChbZWxhcHNlZFdhbGxUaW1lKCkgLyAxMDAwLCBcIm9cIiwgdGV4dF0pO1xuICAgIH0sXG4gICAgc3RvcCgpIHtcbiAgICAgIHN0b3AgPSB0cnVlO1xuICAgICAgcXVldWUucHVzaCh1bmRlZmluZWQpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHNsZWVwKHQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgdCk7XG4gIH0pO1xufVxuZnVuY3Rpb24gYWRhcHRpdmVCdWZmZXJUaW1lUHJvdmlkZXIoKSB7XG4gIGxldCB7XG4gICAgbG9nZ2VyXG4gIH0gPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICBsZXQge1xuICAgIG1pbkJ1ZmZlclRpbWUgPSA1MCxcbiAgICBidWZmZXJMZXZlbFN0ZXAgPSAxMDAsXG4gICAgbWF4QnVmZmVyTGV2ZWwgPSA1MCxcbiAgICB0cmFuc2l0aW9uRHVyYXRpb24gPSA1MDAsXG4gICAgcGVha0hhbGZMaWZlVXAgPSAxMDAsXG4gICAgcGVha0hhbGZMaWZlRG93biA9IDEwMDAwLFxuICAgIGZsb29ySGFsZkxpZmVVcCA9IDUwMDAsXG4gICAgZmxvb3JIYWxmTGlmZURvd24gPSAxMDAsXG4gICAgaWRlYWxIYWxmTGlmZVVwID0gMTAwMCxcbiAgICBpZGVhbEhhbGZMaWZlRG93biA9IDUwMDAsXG4gICAgc2FmZXR5TXVsdGlwbGllciA9IDEuMixcbiAgICBtaW5JbXByb3ZlbWVudER1cmF0aW9uID0gMzAwMFxuICB9ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgZnVuY3Rpb24gbGV2ZWxUb01zKGxldmVsKSB7XG4gICAgcmV0dXJuIGxldmVsID09PSAwID8gbWluQnVmZmVyVGltZSA6IGJ1ZmZlckxldmVsU3RlcCAqIGxldmVsO1xuICB9XG4gIGxldCBidWZmZXJMZXZlbCA9IDE7XG4gIGxldCBidWZmZXJUaW1lID0gbGV2ZWxUb01zKGJ1ZmZlckxldmVsKTtcbiAgbGV0IGxhc3RVcGRhdGVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gIGxldCBzbW9vdGhlZFBlYWtMYXRlbmN5ID0gbnVsbDtcbiAgbGV0IHNtb290aGVkRmxvb3JMYXRlbmN5ID0gbnVsbDtcbiAgbGV0IHNtb290aGVkSWRlYWxCdWZmZXJUaW1lID0gbnVsbDtcbiAgbGV0IHN0YWJsZVNpbmNlID0gbnVsbDtcbiAgbGV0IHRhcmdldEJ1ZmZlclRpbWUgPSBudWxsO1xuICBsZXQgdHJhbnNpdGlvblJhdGUgPSBudWxsO1xuICByZXR1cm4gZnVuY3Rpb24gKGxhdGVuY3kpIHtcbiAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zdCBkdCA9IE1hdGgubWF4KDAsIG5vdyAtIGxhc3RVcGRhdGVUaW1lKTtcbiAgICBsYXN0VXBkYXRlVGltZSA9IG5vdztcblxuICAgIC8vIGFkanVzdCBFTUEtc21vb3RoZWQgcGVhayBsYXRlbmN5IGZyb20gY3VycmVudCBsYXRlbmN5XG5cbiAgICBpZiAoc21vb3RoZWRQZWFrTGF0ZW5jeSA9PT0gbnVsbCkge1xuICAgICAgc21vb3RoZWRQZWFrTGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfSBlbHNlIGlmIChsYXRlbmN5ID4gc21vb3RoZWRQZWFrTGF0ZW5jeSkge1xuICAgICAgY29uc3QgYWxwaGFVcCA9IDEgLSBNYXRoLnBvdygyLCAtZHQgLyBwZWFrSGFsZkxpZmVVcCk7XG4gICAgICBzbW9vdGhlZFBlYWtMYXRlbmN5ICs9IGFscGhhVXAgKiAobGF0ZW5jeSAtIHNtb290aGVkUGVha0xhdGVuY3kpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhbHBoYURvd24gPSAxIC0gTWF0aC5wb3coMiwgLWR0IC8gcGVha0hhbGZMaWZlRG93bik7XG4gICAgICBzbW9vdGhlZFBlYWtMYXRlbmN5ICs9IGFscGhhRG93biAqIChsYXRlbmN5IC0gc21vb3RoZWRQZWFrTGF0ZW5jeSk7XG4gICAgfVxuICAgIHNtb290aGVkUGVha0xhdGVuY3kgPSBNYXRoLm1heChzbW9vdGhlZFBlYWtMYXRlbmN5LCAwKTtcblxuICAgIC8vIGFkanVzdCBFTUEtc21vb3RoZWQgZmxvb3IgbGF0ZW5jeSBmcm9tIGN1cnJlbnQgbGF0ZW5jeVxuXG4gICAgaWYgKHNtb290aGVkRmxvb3JMYXRlbmN5ID09PSBudWxsKSB7XG4gICAgICBzbW9vdGhlZEZsb29yTGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfSBlbHNlIGlmIChsYXRlbmN5ID4gc21vb3RoZWRGbG9vckxhdGVuY3kpIHtcbiAgICAgIGNvbnN0IGFscGhhVXAgPSAxIC0gTWF0aC5wb3coMiwgLWR0IC8gZmxvb3JIYWxmTGlmZVVwKTtcbiAgICAgIHNtb290aGVkRmxvb3JMYXRlbmN5ICs9IGFscGhhVXAgKiAobGF0ZW5jeSAtIHNtb290aGVkRmxvb3JMYXRlbmN5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYWxwaGFEb3duID0gMSAtIE1hdGgucG93KDIsIC1kdCAvIGZsb29ySGFsZkxpZmVEb3duKTtcbiAgICAgIHNtb290aGVkRmxvb3JMYXRlbmN5ICs9IGFscGhhRG93biAqIChsYXRlbmN5IC0gc21vb3RoZWRGbG9vckxhdGVuY3kpO1xuICAgIH1cbiAgICBzbW9vdGhlZEZsb29yTGF0ZW5jeSA9IE1hdGgubWF4KHNtb290aGVkRmxvb3JMYXRlbmN5LCAwKTtcblxuICAgIC8vIGFkanVzdCBFTUEtc21vb3RoZWQgaWRlYWwgYnVmZmVyIHRpbWVcblxuICAgIGNvbnN0IGppdHRlciA9IHNtb290aGVkUGVha0xhdGVuY3kgLSBzbW9vdGhlZEZsb29yTGF0ZW5jeTtcbiAgICBjb25zdCBpZGVhbEJ1ZmZlclRpbWUgPSBzYWZldHlNdWx0aXBsaWVyICogKHNtb290aGVkUGVha0xhdGVuY3kgKyBqaXR0ZXIpO1xuICAgIGlmIChzbW9vdGhlZElkZWFsQnVmZmVyVGltZSA9PT0gbnVsbCkge1xuICAgICAgc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUgPSBpZGVhbEJ1ZmZlclRpbWU7XG4gICAgfSBlbHNlIGlmIChpZGVhbEJ1ZmZlclRpbWUgPiBzbW9vdGhlZElkZWFsQnVmZmVyVGltZSkge1xuICAgICAgY29uc3QgYWxwaGFVcCA9IDEgLSBNYXRoLnBvdygyLCAtZHQgLyBpZGVhbEhhbGZMaWZlVXApO1xuICAgICAgc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUgKz0gK2FscGhhVXAgKiAoaWRlYWxCdWZmZXJUaW1lIC0gc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhbHBoYURvd24gPSAxIC0gTWF0aC5wb3coMiwgLWR0IC8gaWRlYWxIYWxmTGlmZURvd24pO1xuICAgICAgc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUgKz0gK2FscGhhRG93biAqIChpZGVhbEJ1ZmZlclRpbWUgLSBzbW9vdGhlZElkZWFsQnVmZmVyVGltZSk7XG4gICAgfVxuXG4gICAgLy8gcXVhbnRpemUgc21vb3RoZWQgaWRlYWwgYnVmZmVyIHRpbWUgdG8gZGlzY3JldGUgYnVmZmVyIGxldmVsXG5cbiAgICBsZXQgbmV3QnVmZmVyTGV2ZWw7XG4gICAgaWYgKHNtb290aGVkSWRlYWxCdWZmZXJUaW1lIDw9IG1pbkJ1ZmZlclRpbWUpIHtcbiAgICAgIG5ld0J1ZmZlckxldmVsID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3QnVmZmVyTGV2ZWwgPSBjbGFtcChNYXRoLmNlaWwoc21vb3RoZWRJZGVhbEJ1ZmZlclRpbWUgLyBidWZmZXJMZXZlbFN0ZXApLCAxLCBtYXhCdWZmZXJMZXZlbCk7XG4gICAgfVxuICAgIGlmIChsYXRlbmN5ID4gYnVmZmVyVGltZSkge1xuICAgICAgbG9nZ2VyLmRlYnVnKCdidWZmZXIgdW5kZXJydW4nLCB7XG4gICAgICAgIGxhdGVuY3ksXG4gICAgICAgIGJ1ZmZlclRpbWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGFkanVzdCBidWZmZXIgbGV2ZWwgYW5kIHRhcmdldCBidWZmZXIgdGltZSBmb3IgbmV3IGJ1ZmZlciBsZXZlbFxuXG4gICAgaWYgKG5ld0J1ZmZlckxldmVsID4gYnVmZmVyTGV2ZWwpIHtcbiAgICAgIGlmIChsYXRlbmN5ID4gYnVmZmVyVGltZSkge1xuICAgICAgICAvLyA8LSB1bmRlcnJ1biAtIHJhaXNlIHF1aWNrbHlcbiAgICAgICAgYnVmZmVyTGV2ZWwgPSBNYXRoLm1pbihuZXdCdWZmZXJMZXZlbCwgYnVmZmVyTGV2ZWwgKyAzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlckxldmVsICs9IDE7XG4gICAgICB9XG4gICAgICB0YXJnZXRCdWZmZXJUaW1lID0gbGV2ZWxUb01zKGJ1ZmZlckxldmVsKTtcbiAgICAgIHRyYW5zaXRpb25SYXRlID0gKHRhcmdldEJ1ZmZlclRpbWUgLSBidWZmZXJUaW1lKSAvIHRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgIHN0YWJsZVNpbmNlID0gbnVsbDtcbiAgICAgIGxvZ2dlci5kZWJ1ZygncmFpc2luZyBidWZmZXInLCB7XG4gICAgICAgIGxhdGVuY3ksXG4gICAgICAgIGJ1ZmZlclRpbWUsXG4gICAgICAgIHRhcmdldEJ1ZmZlclRpbWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAobmV3QnVmZmVyTGV2ZWwgPCBidWZmZXJMZXZlbCkge1xuICAgICAgaWYgKHN0YWJsZVNpbmNlID09IG51bGwpIHN0YWJsZVNpbmNlID0gbm93O1xuICAgICAgaWYgKG5vdyAtIHN0YWJsZVNpbmNlID49IG1pbkltcHJvdmVtZW50RHVyYXRpb24pIHtcbiAgICAgICAgYnVmZmVyTGV2ZWwgLT0gMTtcbiAgICAgICAgdGFyZ2V0QnVmZmVyVGltZSA9IGxldmVsVG9NcyhidWZmZXJMZXZlbCk7XG4gICAgICAgIHRyYW5zaXRpb25SYXRlID0gKHRhcmdldEJ1ZmZlclRpbWUgLSBidWZmZXJUaW1lKSAvIHRyYW5zaXRpb25EdXJhdGlvbjtcbiAgICAgICAgc3RhYmxlU2luY2UgPSBub3c7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnbG93ZXJpbmcgYnVmZmVyJywge1xuICAgICAgICAgIGxhdGVuY3ksXG4gICAgICAgICAgYnVmZmVyVGltZSxcbiAgICAgICAgICB0YXJnZXRCdWZmZXJUaW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGFibGVTaW5jZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gbGluZWFyIHRyYW5zaXRpb24gdG8gdGFyZ2V0IGJ1ZmZlciB0aW1lXG5cbiAgICBpZiAodGFyZ2V0QnVmZmVyVGltZSAhPT0gbnVsbCkge1xuICAgICAgYnVmZmVyVGltZSArPSB0cmFuc2l0aW9uUmF0ZSAqIGR0O1xuICAgICAgaWYgKHRyYW5zaXRpb25SYXRlID49IDAgJiYgYnVmZmVyVGltZSA+IHRhcmdldEJ1ZmZlclRpbWUgfHwgdHJhbnNpdGlvblJhdGUgPCAwICYmIGJ1ZmZlclRpbWUgPCB0YXJnZXRCdWZmZXJUaW1lKSB7XG4gICAgICAgIGJ1ZmZlclRpbWUgPSB0YXJnZXRCdWZmZXJUaW1lO1xuICAgICAgICB0YXJnZXRCdWZmZXJUaW1lID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJ1ZmZlclRpbWU7XG4gIH07XG59XG5mdW5jdGlvbiBjbGFtcCh4LCBsbywgaGkpIHtcbiAgcmV0dXJuIE1hdGgubWluKGhpLCBNYXRoLm1heChsbywgeCkpO1xufVxuXG5jb25zdCBPTkVfU0VDX0lOX1VTRUMgPSAxMDAwMDAwO1xuZnVuY3Rpb24gYWxpc0hhbmRsZXIobG9nZ2VyKSB7XG4gIGNvbnN0IG91dHB1dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgY29uc3QgaW5wdXREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG4gIGxldCBoYW5kbGVyID0gcGFyc2VNYWdpY1N0cmluZztcbiAgbGV0IGxhc3RFdmVudFRpbWU7XG4gIGxldCBtYXJrZXJJbmRleCA9IDA7XG4gIGZ1bmN0aW9uIHBhcnNlTWFnaWNTdHJpbmcoYnVmZmVyKSB7XG4gICAgY29uc3QgdGV4dCA9IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShidWZmZXIpO1xuICAgIGlmICh0ZXh0ID09PSBcIkFMaVNcXHgwMVwiKSB7XG4gICAgICBoYW5kbGVyID0gcGFyc2VGaXJzdEZyYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgYW4gQUxpUyB2MSBsaXZlIHN0cmVhbVwiKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VGaXJzdEZyYW1lKGJ1ZmZlcikge1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgQmluYXJ5UmVhZGVyKG5ldyBEYXRhVmlldyhidWZmZXIpKTtcbiAgICBjb25zdCB0eXBlID0gdmlldy5nZXRVaW50OCgpO1xuICAgIGlmICh0eXBlICE9PSAweDAxKSB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkIHJlc2V0ICgweDAxKSBmcmFtZSwgZ290ICR7dHlwZX1gKTtcbiAgICByZXR1cm4gcGFyc2VSZXNldEZyYW1lKHZpZXcsIGJ1ZmZlcik7XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VSZXNldEZyYW1lKHZpZXcsIGJ1ZmZlcikge1xuICAgIHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGxldCB0aW1lID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgbGFzdEV2ZW50VGltZSA9IHRpbWU7XG4gICAgdGltZSA9IHRpbWUgLyBPTkVfU0VDX0lOX1VTRUM7XG4gICAgbWFya2VySW5kZXggPSAwO1xuICAgIGNvbnN0IGNvbHMgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCByb3dzID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3QgdGhlbWVGb3JtYXQgPSB2aWV3LmdldFVpbnQ4KCk7XG4gICAgbGV0IHRoZW1lO1xuICAgIGlmICh0aGVtZUZvcm1hdCA9PT0gOCkge1xuICAgICAgY29uc3QgbGVuID0gKDIgKyA4KSAqIDM7XG4gICAgICB0aGVtZSA9IHBhcnNlVGhlbWUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCB2aWV3Lm9mZnNldCwgbGVuKSk7XG4gICAgICB2aWV3LmZvcndhcmQobGVuKTtcbiAgICB9IGVsc2UgaWYgKHRoZW1lRm9ybWF0ID09PSAxNikge1xuICAgICAgY29uc3QgbGVuID0gKDIgKyAxNikgKiAzO1xuICAgICAgdGhlbWUgPSBwYXJzZVRoZW1lKG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgdmlldy5vZmZzZXQsIGxlbikpO1xuICAgICAgdmlldy5mb3J3YXJkKGxlbik7XG4gICAgfSBlbHNlIGlmICh0aGVtZUZvcm1hdCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBhbGlzOiBpbnZhbGlkIHRoZW1lIGZvcm1hdCAoJHt0aGVtZUZvcm1hdH0pYCk7XG4gICAgfVxuICAgIGNvbnN0IGluaXRMZW4gPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBsZXQgaW5pdDtcbiAgICBpZiAoaW5pdExlbiA+IDApIHtcbiAgICAgIGluaXQgPSBvdXRwdXREZWNvZGVyLmRlY29kZShuZXcgVWludDhBcnJheShidWZmZXIsIHZpZXcub2Zmc2V0LCBpbml0TGVuKSk7XG4gICAgfVxuICAgIGhhbmRsZXIgPSBwYXJzZUZyYW1lO1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lLFxuICAgICAgdGVybToge1xuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgY29scyxcbiAgICAgICAgICByb3dzXG4gICAgICAgIH0sXG4gICAgICAgIHRoZW1lLFxuICAgICAgICBpbml0XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZUZyYW1lKGJ1ZmZlcikge1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgQmluYXJ5UmVhZGVyKG5ldyBEYXRhVmlldyhidWZmZXIpKTtcbiAgICBjb25zdCB0eXBlID0gdmlldy5nZXRVaW50OCgpO1xuICAgIGlmICh0eXBlID09PSAweDAxKSB7XG4gICAgICByZXR1cm4gcGFyc2VSZXNldEZyYW1lKHZpZXcsIGJ1ZmZlcik7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAweDZmKSB7XG4gICAgICAvLyBcIm9cIlxuICAgICAgcmV0dXJuIHBhcnNlT3V0cHV0RnJhbWUodmlldywgYnVmZmVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDB4NjkpIHtcbiAgICAgIC8vIFwiaVwiXG4gICAgICByZXR1cm4gcGFyc2VJbnB1dEZyYW1lKHZpZXcsIGJ1ZmZlcik7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAweDcyKSB7XG4gICAgICAvLyBcInJcIlxuICAgICAgcmV0dXJuIHBhcnNlUmVzaXplRnJhbWUodmlldyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAweDZkKSB7XG4gICAgICAvLyBcIm1cIlxuICAgICAgcmV0dXJuIHBhcnNlTWFya2VyRnJhbWUodmlldywgYnVmZmVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IDB4NzgpIHtcbiAgICAgIC8vIFwieFwiXG4gICAgICByZXR1cm4gcGFyc2VFeGl0RnJhbWUodmlldyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAweDA0KSB7XG4gICAgICAvLyBFT1RcbiAgICAgIGhhbmRsZXIgPSBwYXJzZUZpcnN0RnJhbWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhgYWxpczogdW5rbm93biBmcmFtZSB0eXBlOiAke3R5cGV9YCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBhcnNlT3V0cHV0RnJhbWUodmlldywgYnVmZmVyKSB7XG4gICAgdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3QgcmVsVGltZSA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGxhc3RFdmVudFRpbWUgKz0gcmVsVGltZTtcbiAgICBjb25zdCBsZW4gPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCB0ZXh0ID0gb3V0cHV0RGVjb2Rlci5kZWNvZGUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCB2aWV3Lm9mZnNldCwgbGVuKSk7XG4gICAgcmV0dXJuIFtsYXN0RXZlbnRUaW1lIC8gT05FX1NFQ19JTl9VU0VDLCBcIm9cIiwgdGV4dF07XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VJbnB1dEZyYW1lKHZpZXcsIGJ1ZmZlcikge1xuICAgIHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGNvbnN0IHJlbFRpbWUgPSB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBsYXN0RXZlbnRUaW1lICs9IHJlbFRpbWU7XG4gICAgY29uc3QgbGVuID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3QgdGV4dCA9IGlucHV0RGVjb2Rlci5kZWNvZGUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCB2aWV3Lm9mZnNldCwgbGVuKSk7XG4gICAgcmV0dXJuIFtsYXN0RXZlbnRUaW1lIC8gT05FX1NFQ19JTl9VU0VDLCBcImlcIiwgdGV4dF07XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VSZXNpemVGcmFtZSh2aWV3KSB7XG4gICAgdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3QgcmVsVGltZSA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGxhc3RFdmVudFRpbWUgKz0gcmVsVGltZTtcbiAgICBjb25zdCBjb2xzID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgY29uc3Qgcm93cyA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIHJldHVybiBbbGFzdEV2ZW50VGltZSAvIE9ORV9TRUNfSU5fVVNFQywgXCJyXCIsIHtcbiAgICAgIGNvbHMsXG4gICAgICByb3dzXG4gICAgfV07XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VNYXJrZXJGcmFtZSh2aWV3LCBidWZmZXIpIHtcbiAgICB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCByZWxUaW1lID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgbGFzdEV2ZW50VGltZSArPSByZWxUaW1lO1xuICAgIGNvbnN0IGxlbiA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgICBjb25zdCBpbmRleCA9IG1hcmtlckluZGV4Kys7XG4gICAgY29uc3QgdGltZSA9IGxhc3RFdmVudFRpbWUgLyBPTkVfU0VDX0lOX1VTRUM7XG4gICAgY29uc3QgbGFiZWwgPSBkZWNvZGVyLmRlY29kZShuZXcgVWludDhBcnJheShidWZmZXIsIHZpZXcub2Zmc2V0LCBsZW4pKTtcbiAgICByZXR1cm4gW3RpbWUsIFwibVwiLCB7XG4gICAgICBpbmRleCxcbiAgICAgIHRpbWUsXG4gICAgICBsYWJlbFxuICAgIH1dO1xuICB9XG4gIGZ1bmN0aW9uIHBhcnNlRXhpdEZyYW1lKHZpZXcpIHtcbiAgICB2aWV3LmRlY29kZVZhclVpbnQoKTtcbiAgICBjb25zdCByZWxUaW1lID0gdmlldy5kZWNvZGVWYXJVaW50KCk7XG4gICAgbGFzdEV2ZW50VGltZSArPSByZWxUaW1lO1xuICAgIGNvbnN0IHN0YXR1cyA9IHZpZXcuZGVjb2RlVmFyVWludCgpO1xuICAgIHJldHVybiBbbGFzdEV2ZW50VGltZSAvIE9ORV9TRUNfSU5fVVNFQywgXCJ4XCIsIHtcbiAgICAgIHN0YXR1c1xuICAgIH1dO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gICAgcmV0dXJuIGhhbmRsZXIoYnVmZmVyKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHBhcnNlVGhlbWUoYXJyKSB7XG4gIGNvbnN0IGNvbG9yQ291bnQgPSBhcnIubGVuZ3RoIC8gMztcbiAgY29uc3QgZm9yZWdyb3VuZCA9IGhleENvbG9yKGFyclswXSwgYXJyWzFdLCBhcnJbMl0pO1xuICBjb25zdCBiYWNrZ3JvdW5kID0gaGV4Q29sb3IoYXJyWzNdLCBhcnJbNF0sIGFycls1XSk7XG4gIGNvbnN0IHBhbGV0dGUgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDI7IGkgPCBjb2xvckNvdW50OyBpKyspIHtcbiAgICBwYWxldHRlLnB1c2goaGV4Q29sb3IoYXJyW2kgKiAzXSwgYXJyW2kgKiAzICsgMV0sIGFycltpICogMyArIDJdKSk7XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZVRoZW1lKHtcbiAgICBmb3JlZ3JvdW5kLFxuICAgIGJhY2tncm91bmQsXG4gICAgcGFsZXR0ZVxuICB9KTtcbn1cbmZ1bmN0aW9uIGhleENvbG9yKHIsIGcsIGIpIHtcbiAgcmV0dXJuIGAjJHtieXRlVG9IZXgocil9JHtieXRlVG9IZXgoZyl9JHtieXRlVG9IZXgoYil9YDtcbn1cbmZ1bmN0aW9uIGJ5dGVUb0hleCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbn1cbmNsYXNzIEJpbmFyeVJlYWRlciB7XG4gIGNvbnN0cnVjdG9yKGlubmVyKSB7XG4gICAgbGV0IG9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgICB0aGlzLmlubmVyID0gaW5uZXI7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gIH1cbiAgZm9yd2FyZChkZWx0YSkge1xuICAgIHRoaXMub2Zmc2V0ICs9IGRlbHRhO1xuICB9XG4gIGdldFVpbnQ4KCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5pbm5lci5nZXRVaW50OCh0aGlzLm9mZnNldCk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZGVjb2RlVmFyVWludCgpIHtcbiAgICBsZXQgbnVtYmVyID0gQmlnSW50KDApO1xuICAgIGxldCBzaGlmdCA9IEJpZ0ludCgwKTtcbiAgICBsZXQgYnl0ZSA9IHRoaXMuZ2V0VWludDgoKTtcbiAgICB3aGlsZSAoYnl0ZSA+IDEyNykge1xuICAgICAgYnl0ZSAmPSAxMjc7XG4gICAgICBudW1iZXIgKz0gQmlnSW50KGJ5dGUpIDw8IHNoaWZ0O1xuICAgICAgc2hpZnQgKz0gQmlnSW50KDcpO1xuICAgICAgYnl0ZSA9IHRoaXMuZ2V0VWludDgoKTtcbiAgICB9XG4gICAgbnVtYmVyID0gbnVtYmVyICsgKEJpZ0ludChieXRlKSA8PCBzaGlmdCk7XG4gICAgcmV0dXJuIE51bWJlcihudW1iZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzY2ljYXN0VjJIYW5kbGVyKCkge1xuICBsZXQgcGFyc2UgPSBwYXJzZUhlYWRlcjtcbiAgZnVuY3Rpb24gcGFyc2VIZWFkZXIoYnVmZmVyKSB7XG4gICAgY29uc3QgaGVhZGVyID0gSlNPTi5wYXJzZShidWZmZXIpO1xuICAgIGlmIChoZWFkZXIudmVyc2lvbiAhPT0gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGFuIGFzY2lpY2FzdCB2MiBzdHJlYW1cIik7XG4gICAgfVxuICAgIHBhcnNlID0gcGFyc2VFdmVudDtcbiAgICByZXR1cm4ge1xuICAgICAgdGltZTogMC4wLFxuICAgICAgdGVybToge1xuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgY29sczogaGVhZGVyLndpZHRoLFxuICAgICAgICAgIHJvd3M6IGhlYWRlci5oZWlnaHRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VFdmVudChidWZmZXIpIHtcbiAgICBjb25zdCBldmVudCA9IEpTT04ucGFyc2UoYnVmZmVyKTtcbiAgICBpZiAoZXZlbnRbMV0gPT09IFwiclwiKSB7XG4gICAgICBjb25zdCBbY29scywgcm93c10gPSBldmVudFsyXS5zcGxpdChcInhcIik7XG4gICAgICByZXR1cm4gW2V2ZW50WzBdLCBcInJcIiwge1xuICAgICAgICBjb2xzOiBwYXJzZUludChjb2xzLCAxMCksXG4gICAgICAgIHJvd3M6IHBhcnNlSW50KHJvd3MsIDEwKVxuICAgICAgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBldmVudDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChidWZmZXIpIHtcbiAgICByZXR1cm4gcGFyc2UoYnVmZmVyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXNjaWNhc3RWM0hhbmRsZXIoKSB7XG4gIGxldCBwYXJzZSA9IHBhcnNlSGVhZGVyO1xuICBsZXQgY3VycmVudFRpbWUgPSAwO1xuICBmdW5jdGlvbiBwYXJzZUhlYWRlcihidWZmZXIpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBKU09OLnBhcnNlKGJ1ZmZlcik7XG4gICAgaWYgKGhlYWRlci52ZXJzaW9uICE9PSAzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgYW4gYXNjaWljYXN0IHYzIHN0cmVhbVwiKTtcbiAgICB9XG4gICAgcGFyc2UgPSBwYXJzZUV2ZW50O1xuICAgIGNvbnN0IHRlcm0gPSB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIGNvbHM6IGhlYWRlci50ZXJtLmNvbHMsXG4gICAgICAgIHJvd3M6IGhlYWRlci50ZXJtLnJvd3NcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChoZWFkZXIudGVybS50aGVtZSkge1xuICAgICAgY29uc3QgcGFsZXR0ZSA9IHR5cGVvZiBoZWFkZXIudGVybS50aGVtZS5wYWxldHRlID09PSBcInN0cmluZ1wiID8gaGVhZGVyLnRlcm0udGhlbWUucGFsZXR0ZS5zcGxpdChcIjpcIikgOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCB0aGVtZSA9IG5vcm1hbGl6ZVRoZW1lKHtcbiAgICAgICAgZm9yZWdyb3VuZDogaGVhZGVyLnRlcm0udGhlbWUuZmcsXG4gICAgICAgIGJhY2tncm91bmQ6IGhlYWRlci50ZXJtLnRoZW1lLmJnLFxuICAgICAgICBwYWxldHRlXG4gICAgICB9KTtcbiAgICAgIGlmICh0aGVtZSkge1xuICAgICAgICB0ZXJtLnRoZW1lID0gdGhlbWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiAwLjAsXG4gICAgICB0ZXJtXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBwYXJzZUV2ZW50KGJ1ZmZlcikge1xuICAgIGNvbnN0IGV2ZW50ID0gSlNPTi5wYXJzZShidWZmZXIpO1xuICAgIGNvbnN0IFtpbnRlcnZhbCwgZXZlbnRUeXBlLCBkYXRhXSA9IGV2ZW50O1xuICAgIGN1cnJlbnRUaW1lICs9IGludGVydmFsO1xuICAgIGlmIChldmVudFR5cGUgPT09IFwiclwiKSB7XG4gICAgICBjb25zdCBbY29scywgcm93c10gPSBkYXRhLnNwbGl0KFwieFwiKTtcbiAgICAgIHJldHVybiBbY3VycmVudFRpbWUsIFwiclwiLCB7XG4gICAgICAgIGNvbHM6IHBhcnNlSW50KGNvbHMsIDEwKSxcbiAgICAgICAgcm93czogcGFyc2VJbnQocm93cywgMTApXG4gICAgICB9XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtjdXJyZW50VGltZSwgZXZlbnRUeXBlLCBkYXRhXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChidWZmZXIpIHtcbiAgICByZXR1cm4gcGFyc2UoYnVmZmVyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmF3SGFuZGxlcigpIHtcbiAgY29uc3Qgb3V0cHV0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpO1xuICBsZXQgcGFyc2UgPSBwYXJzZVNpemU7XG4gIGZ1bmN0aW9uIHBhcnNlU2l6ZShidWZmZXIpIHtcbiAgICBjb25zdCB0ZXh0ID0gb3V0cHV0RGVjb2Rlci5kZWNvZGUoYnVmZmVyLCB7XG4gICAgICBzdHJlYW06IHRydWVcbiAgICB9KTtcbiAgICBjb25zdCBbY29scywgcm93c10gPSBzaXplRnJvbVJlc2l6ZVNlcSh0ZXh0KSA/PyBzaXplRnJvbVNjcmlwdFN0YXJ0TWVzc2FnZSh0ZXh0KSA/PyBbODAsIDI0XTtcbiAgICBwYXJzZSA9IHBhcnNlT3V0cHV0O1xuICAgIHJldHVybiB7XG4gICAgICB0aW1lOiAwLjAsXG4gICAgICB0ZXJtOiB7XG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICBjb2xzLFxuICAgICAgICAgIHJvd3NcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdDogdGV4dFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gcGFyc2VPdXRwdXQoYnVmZmVyKSB7XG4gICAgcmV0dXJuIG91dHB1dERlY29kZXIuZGVjb2RlKGJ1ZmZlciwge1xuICAgICAgc3RyZWFtOiB0cnVlXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChidWZmZXIpIHtcbiAgICByZXR1cm4gcGFyc2UoYnVmZmVyKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHNpemVGcm9tUmVzaXplU2VxKHRleHQpIHtcbiAgY29uc3QgbWF0Y2ggPSB0ZXh0Lm1hdGNoKC9cXHgxYlxcWzg7KFxcZCspOyhcXGQrKXQvKTtcbiAgaWYgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtwYXJzZUludChtYXRjaFsyXSwgMTApLCBwYXJzZUludChtYXRjaFsxXSwgMTApXTtcbiAgfVxufVxuZnVuY3Rpb24gc2l6ZUZyb21TY3JpcHRTdGFydE1lc3NhZ2UodGV4dCkge1xuICBjb25zdCBtYXRjaCA9IHRleHQubWF0Y2goL1xcWy4qQ09MVU1OUz1cIihcXGR7MSwzfSlcIiBMSU5FUz1cIihcXGR7MSwzfSlcIi4qXFxdLyk7XG4gIGlmIChtYXRjaCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBbcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSwgcGFyc2VJbnQobWF0Y2hbMl0sIDEwKV07XG4gIH1cbn1cblxuY29uc3QgUkVDT05ORUNUX0RFTEFZX0JBU0UgPSA1MDA7XG5jb25zdCBSRUNPTk5FQ1RfREVMQVlfQ0FQID0gMTAwMDA7XG5mdW5jdGlvbiBleHBvbmVudGlhbERlbGF5KGF0dGVtcHQpIHtcbiAgY29uc3QgYmFzZSA9IE1hdGgubWluKFJFQ09OTkVDVF9ERUxBWV9CQVNFICogTWF0aC5wb3coMiwgYXR0ZW1wdCksIFJFQ09OTkVDVF9ERUxBWV9DQVApO1xuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIGJhc2U7XG59XG5mdW5jdGlvbiB3ZWJzb2NrZXQoX3JlZiwgX3JlZjIsIF9yZWYzKSB7XG4gIGxldCB7XG4gICAgdXJsLFxuICAgIGJ1ZmZlclRpbWUsXG4gICAgcmVjb25uZWN0RGVsYXkgPSBleHBvbmVudGlhbERlbGF5LFxuICAgIG1pbkZyYW1lVGltZVxuICB9ID0gX3JlZjtcbiAgbGV0IHtcbiAgICBmZWVkLFxuICAgIHJlc2V0LFxuICAgIHJlc2l6ZSxcbiAgICBvbklucHV0LFxuICAgIG9uTWFya2VyLFxuICAgIHNldFN0YXRlLFxuICAgIGxvZ2dlclxuICB9ID0gX3JlZjI7XG4gIGxldCB7XG4gICAgYXVkaW9VcmxcbiAgfSA9IF9yZWYzO1xuICBsb2dnZXIgPSBuZXcgUHJlZml4ZWRMb2dnZXIobG9nZ2VyLCBcIndlYnNvY2tldDogXCIpO1xuICBsZXQgc29ja2V0O1xuICBsZXQgYnVmO1xuICBsZXQgY2xvY2sgPSBuZXcgTnVsbENsb2NrKCk7XG4gIGxldCByZWNvbm5lY3RBdHRlbXB0ID0gMDtcbiAgbGV0IHN1Y2Nlc3NmdWxDb25uZWN0aW9uVGltZW91dDtcbiAgbGV0IHN0b3AgPSBmYWxzZTtcbiAgbGV0IHdhc09ubGluZSA9IGZhbHNlO1xuICBsZXQgZ290RXhpdEV2ZW50ID0gZmFsc2U7XG4gIGxldCBnb3RFb3RFdmVudCA9IGZhbHNlO1xuICBsZXQgaW5pdFRpbWVvdXQ7XG4gIGxldCBhdWRpb0VsZW1lbnQ7XG4gIGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG4gICAgc29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmwsIFtcInYxLmFsaXNcIiwgXCJ2Mi5hc2NpaWNhc3RcIiwgXCJ2My5hc2NpaWNhc3RcIiwgXCJyYXdcIl0pO1xuICAgIHNvY2tldC5iaW5hcnlUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgIGxldCBwcm90bztcbiAgICBzb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgcHJvdG8gPSBzb2NrZXQucHJvdG9jb2wgfHwgXCJyYXdcIjtcbiAgICAgIGxvZ2dlci5pbmZvKFwib3BlbmVkXCIpO1xuICAgICAgbG9nZ2VyLmluZm8oYGFjdGl2YXRpbmcgJHtwcm90b30gcHJvdG9jb2wgaGFuZGxlcmApO1xuICAgICAgaWYgKHByb3RvID09PSBcInYxLmFsaXNcIikge1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gb25NZXNzYWdlKGFsaXNIYW5kbGVyKGxvZ2dlcikpO1xuICAgICAgfSBlbHNlIGlmIChwcm90byA9PT0gXCJ2Mi5hc2NpaWNhc3RcIikge1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gb25NZXNzYWdlKGFzY2ljYXN0VjJIYW5kbGVyKCkpO1xuICAgICAgfSBlbHNlIGlmIChwcm90byA9PT0gXCJ2My5hc2NpaWNhc3RcIikge1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gb25NZXNzYWdlKGFzY2ljYXN0VjNIYW5kbGVyKCkpO1xuICAgICAgfSBlbHNlIGlmIChwcm90byA9PT0gXCJyYXdcIikge1xuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gb25NZXNzYWdlKHJhd0hhbmRsZXIoKSk7XG4gICAgICB9XG4gICAgICBzdWNjZXNzZnVsQ29ubmVjdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVjb25uZWN0QXR0ZW1wdCA9IDA7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9O1xuICAgIHNvY2tldC5vbmNsb3NlID0gZXZlbnQgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KGluaXRUaW1lb3V0KTtcbiAgICAgIHN0b3BCdWZmZXIoKTtcbiAgICAgIGlmIChzdG9wKSByZXR1cm47XG4gICAgICBsZXQgZW5kZWQgPSBmYWxzZTtcbiAgICAgIGxldCBlbmRlZE1lc3NhZ2UgPSBcIlN0cmVhbSBlbmRlZFwiO1xuICAgICAgaWYgKHByb3RvID09PSBcInYxLmFsaXNcIikge1xuICAgICAgICBpZiAoZ290RW90RXZlbnQgfHwgZXZlbnQuY29kZSA+PSA0MDAwICYmIGV2ZW50LmNvZGUgPD0gNDEwMCkge1xuICAgICAgICAgIGVuZGVkID0gdHJ1ZTtcbiAgICAgICAgICBlbmRlZE1lc3NhZ2UgPSBldmVudC5yZWFzb24gfHwgZW5kZWRNZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGdvdEV4aXRFdmVudCB8fCBldmVudC5jb2RlID09PSAxMDAwIHx8IGV2ZW50LmNvZGUgPT09IDEwMDUpIHtcbiAgICAgICAgZW5kZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGVuZGVkKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiY2xvc2VkXCIpO1xuICAgICAgICBzZXRTdGF0ZShcImVuZGVkXCIsIHtcbiAgICAgICAgICBtZXNzYWdlOiBlbmRlZE1lc3NhZ2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IDEwMDIpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBjbG9zZSByZWFzb246ICR7ZXZlbnQucmVhc29ufWApO1xuICAgICAgICBzZXRTdGF0ZShcImVuZGVkXCIsIHtcbiAgICAgICAgICBtZXNzYWdlOiBcIkVycjogUGxheWVyIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIHNlcnZlclwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHN1Y2Nlc3NmdWxDb25uZWN0aW9uVGltZW91dCk7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gcmVjb25uZWN0RGVsYXkocmVjb25uZWN0QXR0ZW1wdCsrKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oYHVuZXhwZWN0ZWQgY2xvc2UsIHJlY29ubmVjdGluZyBpbiAke2RlbGF5fS4uLmApO1xuICAgICAgICBzZXRTdGF0ZShcImxvYWRpbmdcIik7XG4gICAgICAgIHNldFRpbWVvdXQoY29ubmVjdCwgZGVsYXkpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2FzT25saW5lID0gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gb25NZXNzYWdlKGhhbmRsZXIpIHtcbiAgICBpbml0VGltZW91dCA9IHNldFRpbWVvdXQob25TdHJlYW1FbmQsIDUwMDApO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGhhbmRsZXIoZXZlbnQuZGF0YSk7XG4gICAgICAgIGlmIChidWYpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgICAgICBidWYucHVzaEV2ZW50KHJlc3VsdCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0WzFdID09PSBcInhcIikge1xuICAgICAgICAgICAgICBnb3RFeGl0RXZlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgYnVmLnB1c2hUZXh0KHJlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0ID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGxhc3QgZXZlbnQgSUQgZnJvbSB0aGUgcGFyc2VyLCBkb24ndCByZXNldCBpZiB3ZSBkaWRuJ3QgbWlzcyBhbnl0aGluZ1xuICAgICAgICAgICAgb25TdHJlYW1SZXNldChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gRU9UXG4gICAgICAgICAgICBvblN0cmVhbUVuZCgpO1xuICAgICAgICAgICAgZ290RW90RXZlbnQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5leHBlY3RlZCB2YWx1ZSBmcm9tIHByb3RvY29sIGhhbmRsZXI6ICR7cmVzdWx0fWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgICAgICBvblN0cmVhbVJlc2V0KHJlc3VsdCk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaW5pdFRpbWVvdXQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChpbml0VGltZW91dCk7XG4gICAgICAgICAgICBpbml0VGltZW91dCA9IHNldFRpbWVvdXQob25TdHJlYW1FbmQsIDEwMDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaW5pdFRpbWVvdXQpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmV4cGVjdGVkIHZhbHVlIGZyb20gcHJvdG9jb2wgaGFuZGxlcjogJHtyZXN1bHR9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gb25TdHJlYW1SZXNldChfcmVmNCkge1xuICAgIGxldCB7XG4gICAgICB0aW1lLFxuICAgICAgdGVybVxuICAgIH0gPSBfcmVmNDtcbiAgICBjb25zdCB7XG4gICAgICBzaXplLFxuICAgICAgaW5pdCxcbiAgICAgIHRoZW1lXG4gICAgfSA9IHRlcm07XG4gICAgY29uc3Qge1xuICAgICAgY29scyxcbiAgICAgIHJvd3NcbiAgICB9ID0gc2l6ZTtcbiAgICBsb2dnZXIuaW5mbyhgc3RyZWFtIHJlc2V0ICgke2NvbHN9eCR7cm93c30gQCR7dGltZX0pYCk7XG4gICAgc2V0U3RhdGUoXCJwbGF5aW5nXCIpO1xuICAgIHN0b3BCdWZmZXIoKTtcbiAgICBidWYgPSBnZXRCdWZmZXIoYnVmZmVyVGltZSwgZmVlZCwgcmVzaXplLCBvbklucHV0LCBvbk1hcmtlciwgdCA9PiBjbG9jay5zZXRUaW1lKHQpLCB0aW1lLCBtaW5GcmFtZVRpbWUsIGxvZ2dlcik7XG4gICAgcmVzZXQoY29scywgcm93cywgaW5pdCwgdGhlbWUpO1xuICAgIGNsb2NrID0gbmV3IENsb2NrKCk7XG4gICAgd2FzT25saW5lID0gdHJ1ZTtcbiAgICBnb3RFeGl0RXZlbnQgPSBmYWxzZTtcbiAgICBnb3RFb3RFdmVudCA9IGZhbHNlO1xuICAgIGlmICh0eXBlb2YgdGltZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgY2xvY2suc2V0VGltZSh0aW1lKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25TdHJlYW1FbmQoKSB7XG4gICAgc3RvcEJ1ZmZlcigpO1xuICAgIGlmICh3YXNPbmxpbmUpIHtcbiAgICAgIGxvZ2dlci5pbmZvKFwic3RyZWFtIGVuZGVkXCIpO1xuICAgICAgc2V0U3RhdGUoXCJvZmZsaW5lXCIsIHtcbiAgICAgICAgbWVzc2FnZTogXCJTdHJlYW0gZW5kZWRcIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5pbmZvKFwic3RyZWFtIG9mZmxpbmVcIik7XG4gICAgICBzZXRTdGF0ZShcIm9mZmxpbmVcIiwge1xuICAgICAgICBtZXNzYWdlOiBcIlN0cmVhbSBvZmZsaW5lXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjbG9jayA9IG5ldyBOdWxsQ2xvY2soKTtcbiAgfVxuICBmdW5jdGlvbiBzdG9wQnVmZmVyKCkge1xuICAgIGlmIChidWYpIGJ1Zi5zdG9wKCk7XG4gICAgYnVmID0gbnVsbDtcbiAgfVxuICBmdW5jdGlvbiBzdGFydEF1ZGlvKCkge1xuICAgIGlmICghYXVkaW9VcmwpIHJldHVybjtcbiAgICBhdWRpb0VsZW1lbnQgPSBuZXcgQXVkaW8oKTtcbiAgICBhdWRpb0VsZW1lbnQucHJlbG9hZCA9IFwiYXV0b1wiO1xuICAgIGF1ZGlvRWxlbWVudC5jcm9zc09yaWdpbiA9IFwiYW5vbnltb3VzXCI7XG4gICAgYXVkaW9FbGVtZW50LnNyYyA9IGF1ZGlvVXJsO1xuICAgIGF1ZGlvRWxlbWVudC5wbGF5KCk7XG4gIH1cbiAgZnVuY3Rpb24gc3RvcEF1ZGlvKCkge1xuICAgIGlmICghYXVkaW9FbGVtZW50KSByZXR1cm47XG4gICAgYXVkaW9FbGVtZW50LnBhdXNlKCk7XG4gIH1cbiAgZnVuY3Rpb24gbXV0ZSgpIHtcbiAgICBpZiAoYXVkaW9FbGVtZW50KSB7XG4gICAgICBhdWRpb0VsZW1lbnQubXV0ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVubXV0ZSgpIHtcbiAgICBpZiAoYXVkaW9FbGVtZW50KSB7XG4gICAgICBhdWRpb0VsZW1lbnQubXV0ZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGluaXQ6ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhhc0F1ZGlvOiAhIWF1ZGlvVXJsXG4gICAgICB9O1xuICAgIH0sXG4gICAgcGxheTogKCkgPT4ge1xuICAgICAgY29ubmVjdCgpO1xuICAgICAgc3RhcnRBdWRpbygpO1xuICAgIH0sXG4gICAgc3RvcDogKCkgPT4ge1xuICAgICAgc3RvcCA9IHRydWU7XG4gICAgICBzdG9wQnVmZmVyKCk7XG4gICAgICBpZiAoc29ja2V0ICE9PSB1bmRlZmluZWQpIHNvY2tldC5jbG9zZSgpO1xuICAgICAgc3RvcEF1ZGlvKCk7XG4gICAgfSxcbiAgICBtdXRlLFxuICAgIHVubXV0ZSxcbiAgICBnZXRDdXJyZW50VGltZTogKCkgPT4gY2xvY2suZ2V0VGltZSgpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGV2ZW50c291cmNlKF9yZWYsIF9yZWYyKSB7XG4gIGxldCB7XG4gICAgdXJsLFxuICAgIGJ1ZmZlclRpbWUsXG4gICAgbWluRnJhbWVUaW1lXG4gIH0gPSBfcmVmO1xuICBsZXQge1xuICAgIGZlZWQsXG4gICAgcmVzZXQsXG4gICAgcmVzaXplLFxuICAgIG9uSW5wdXQsXG4gICAgb25NYXJrZXIsXG4gICAgc2V0U3RhdGUsXG4gICAgbG9nZ2VyXG4gIH0gPSBfcmVmMjtcbiAgbG9nZ2VyID0gbmV3IFByZWZpeGVkTG9nZ2VyKGxvZ2dlciwgXCJldmVudHNvdXJjZTogXCIpO1xuICBsZXQgZXM7XG4gIGxldCBidWY7XG4gIGxldCBjbG9jayA9IG5ldyBOdWxsQ2xvY2soKTtcbiAgZnVuY3Rpb24gaW5pdEJ1ZmZlcihiYXNlU3RyZWFtVGltZSkge1xuICAgIGlmIChidWYgIT09IHVuZGVmaW5lZCkgYnVmLnN0b3AoKTtcbiAgICBidWYgPSBnZXRCdWZmZXIoYnVmZmVyVGltZSwgZmVlZCwgcmVzaXplLCBvbklucHV0LCBvbk1hcmtlciwgdCA9PiBjbG9jay5zZXRUaW1lKHQpLCBiYXNlU3RyZWFtVGltZSwgbWluRnJhbWVUaW1lLCBsb2dnZXIpO1xuICB9XG4gIHJldHVybiB7XG4gICAgcGxheTogKCkgPT4ge1xuICAgICAgZXMgPSBuZXcgRXZlbnRTb3VyY2UodXJsKTtcbiAgICAgIGVzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICgpID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJvcGVuZWRcIik7XG4gICAgICAgIGluaXRCdWZmZXIoKTtcbiAgICAgIH0pO1xuICAgICAgZXMuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGUgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcImVycm9yZWRcIik7XG4gICAgICAgIGxvZ2dlci5kZWJ1Zyh7XG4gICAgICAgICAgZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0U3RhdGUoXCJsb2FkaW5nXCIpO1xuICAgICAgfSk7XG4gICAgICBlcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IGUgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoRXZlbnQoZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5jb2xzICE9PSB1bmRlZmluZWQgfHwgZS53aWR0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgY29scyA9IGUuY29scyA/PyBlLndpZHRoO1xuICAgICAgICAgIGNvbnN0IHJvd3MgPSBlLnJvd3MgPz8gZS5oZWlnaHQ7XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKGB2dCByZXNldCAoJHtjb2xzfXgke3Jvd3N9KWApO1xuICAgICAgICAgIHNldFN0YXRlKFwicGxheWluZ1wiKTtcbiAgICAgICAgICBpbml0QnVmZmVyKGUudGltZSk7XG4gICAgICAgICAgcmVzZXQoY29scywgcm93cywgZS5pbml0ID8/IHVuZGVmaW5lZCk7XG4gICAgICAgICAgY2xvY2sgPSBuZXcgQ2xvY2soKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGUudGltZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY2xvY2suc2V0VGltZShlLnRpbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlLnN0YXRlID09PSBcIm9mZmxpbmVcIikge1xuICAgICAgICAgIGxvZ2dlci5pbmZvKFwic3RyZWFtIG9mZmxpbmVcIik7XG4gICAgICAgICAgc2V0U3RhdGUoXCJvZmZsaW5lXCIsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU3RyZWFtIG9mZmxpbmVcIlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNsb2NrID0gbmV3IE51bGxDbG9jaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGVzLmFkZEV2ZW50TGlzdGVuZXIoXCJkb25lXCIsICgpID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJjbG9zZWRcIik7XG4gICAgICAgIGVzLmNsb3NlKCk7XG4gICAgICAgIHNldFN0YXRlKFwiZW5kZWRcIiwge1xuICAgICAgICAgIG1lc3NhZ2U6IFwiU3RyZWFtIGVuZGVkXCJcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHN0b3A6ICgpID0+IHtcbiAgICAgIGlmIChidWYgIT09IHVuZGVmaW5lZCkgYnVmLnN0b3AoKTtcbiAgICAgIGlmIChlcyAhPT0gdW5kZWZpbmVkKSBlcy5jbG9zZSgpO1xuICAgIH0sXG4gICAgZ2V0Q3VycmVudFRpbWU6ICgpID0+IGNsb2NrLmdldFRpbWUoKVxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZSQxKHJlc3BvbnNlcywgX3JlZikge1xuICBsZXQge1xuICAgIGVuY29kaW5nXG4gIH0gPSBfcmVmO1xuICBjb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihlbmNvZGluZyk7XG4gIGxldCBjb2xzO1xuICBsZXQgcm93cztcbiAgbGV0IHRpbWluZyA9IChhd2FpdCByZXNwb25zZXNbMF0udGV4dCgpKS5zcGxpdChcIlxcblwiKS5maWx0ZXIobGluZSA9PiBsaW5lLmxlbmd0aCA+IDApLm1hcChsaW5lID0+IGxpbmUuc3BsaXQoXCIgXCIpKTtcbiAgaWYgKHRpbWluZ1swXS5sZW5ndGggPCAzKSB7XG4gICAgdGltaW5nID0gdGltaW5nLm1hcChlbnRyeSA9PiBbXCJPXCIsIGVudHJ5WzBdLCBlbnRyeVsxXV0pO1xuICB9XG4gIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlc1sxXS5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBhcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gIGNvbnN0IGRhdGFPZmZzZXQgPSBhcnJheS5maW5kSW5kZXgoYnl0ZSA9PiBieXRlID09IDB4MGEpICsgMTtcbiAgY29uc3QgaGVhZGVyID0gdGV4dERlY29kZXIuZGVjb2RlKGFycmF5LnN1YmFycmF5KDAsIGRhdGFPZmZzZXQpKTtcbiAgY29uc3Qgc2l6ZU1hdGNoID0gaGVhZGVyLm1hdGNoKC9DT0xVTU5TPVwiKFxcZCspXCIgTElORVM9XCIoXFxkKylcIi8pO1xuICBpZiAoc2l6ZU1hdGNoICE9PSBudWxsKSB7XG4gICAgY29scyA9IHBhcnNlSW50KHNpemVNYXRjaFsxXSwgMTApO1xuICAgIHJvd3MgPSBwYXJzZUludChzaXplTWF0Y2hbMl0sIDEwKTtcbiAgfVxuICBjb25zdCBzdGRvdXQgPSB7XG4gICAgYXJyYXksXG4gICAgY3Vyc29yOiBkYXRhT2Zmc2V0XG4gIH07XG4gIGxldCBzdGRpbiA9IHN0ZG91dDtcbiAgaWYgKHJlc3BvbnNlc1syXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgYnVmZmVyID0gYXdhaXQgcmVzcG9uc2VzWzJdLmFycmF5QnVmZmVyKCk7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICAgIHN0ZGluID0ge1xuICAgICAgYXJyYXksXG4gICAgICBjdXJzb3I6IGRhdGFPZmZzZXRcbiAgICB9O1xuICB9XG4gIGNvbnN0IGV2ZW50cyA9IFtdO1xuICBsZXQgdGltZSA9IDA7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgdGltaW5nKSB7XG4gICAgdGltZSArPSBwYXJzZUZsb2F0KGVudHJ5WzFdKTtcbiAgICBpZiAoZW50cnlbMF0gPT09IFwiT1wiKSB7XG4gICAgICBjb25zdCBjb3VudCA9IHBhcnNlSW50KGVudHJ5WzJdLCAxMCk7XG4gICAgICBjb25zdCBieXRlcyA9IHN0ZG91dC5hcnJheS5zdWJhcnJheShzdGRvdXQuY3Vyc29yLCBzdGRvdXQuY3Vyc29yICsgY291bnQpO1xuICAgICAgY29uc3QgdGV4dCA9IHRleHREZWNvZGVyLmRlY29kZShieXRlcyk7XG4gICAgICBldmVudHMucHVzaChbdGltZSwgXCJvXCIsIHRleHRdKTtcbiAgICAgIHN0ZG91dC5jdXJzb3IgKz0gY291bnQ7XG4gICAgfSBlbHNlIGlmIChlbnRyeVswXSA9PT0gXCJJXCIpIHtcbiAgICAgIGNvbnN0IGNvdW50ID0gcGFyc2VJbnQoZW50cnlbMl0sIDEwKTtcbiAgICAgIGNvbnN0IGJ5dGVzID0gc3RkaW4uYXJyYXkuc3ViYXJyYXkoc3RkaW4uY3Vyc29yLCBzdGRpbi5jdXJzb3IgKyBjb3VudCk7XG4gICAgICBjb25zdCB0ZXh0ID0gdGV4dERlY29kZXIuZGVjb2RlKGJ5dGVzKTtcbiAgICAgIGV2ZW50cy5wdXNoKFt0aW1lLCBcImlcIiwgdGV4dF0pO1xuICAgICAgc3RkaW4uY3Vyc29yICs9IGNvdW50O1xuICAgIH0gZWxzZSBpZiAoZW50cnlbMF0gPT09IFwiU1wiICYmIGVudHJ5WzJdID09PSBcIlNJR1dJTkNIXCIpIHtcbiAgICAgIGNvbnN0IGNvbHMgPSBwYXJzZUludChlbnRyeVs0XS5zbGljZSg1KSwgMTApO1xuICAgICAgY29uc3Qgcm93cyA9IHBhcnNlSW50KGVudHJ5WzNdLnNsaWNlKDUpLCAxMCk7XG4gICAgICBldmVudHMucHVzaChbdGltZSwgXCJyXCIsIGAke2NvbHN9eCR7cm93c31gXSk7XG4gICAgfSBlbHNlIGlmIChlbnRyeVswXSA9PT0gXCJIXCIgJiYgZW50cnlbMl0gPT09IFwiQ09MVU1OU1wiKSB7XG4gICAgICBjb2xzID0gcGFyc2VJbnQoZW50cnlbM10sIDEwKTtcbiAgICB9IGVsc2UgaWYgKGVudHJ5WzBdID09PSBcIkhcIiAmJiBlbnRyeVsyXSA9PT0gXCJMSU5FU1wiKSB7XG4gICAgICByb3dzID0gcGFyc2VJbnQoZW50cnlbM10sIDEwKTtcbiAgICB9XG4gIH1cbiAgY29scyA9IGNvbHMgPz8gODA7XG4gIHJvd3MgPSByb3dzID8/IDI0O1xuICByZXR1cm4ge1xuICAgIGNvbHMsXG4gICAgcm93cyxcbiAgICBldmVudHNcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcGFyc2UocmVzcG9uc2UsIF9yZWYpIHtcbiAgbGV0IHtcbiAgICBlbmNvZGluZ1xuICB9ID0gX3JlZjtcbiAgY29uc3QgdGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoZW5jb2RpbmcpO1xuICBjb25zdCBidWZmZXIgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICBjb25zdCBhcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gIGNvbnN0IGZpcnN0RnJhbWUgPSBwYXJzZUZyYW1lKGFycmF5KTtcbiAgY29uc3QgYmFzZVRpbWUgPSBmaXJzdEZyYW1lLnRpbWU7XG4gIGNvbnN0IGZpcnN0RnJhbWVUZXh0ID0gdGV4dERlY29kZXIuZGVjb2RlKGZpcnN0RnJhbWUuZGF0YSk7XG4gIGNvbnN0IHNpemVNYXRjaCA9IGZpcnN0RnJhbWVUZXh0Lm1hdGNoKC9cXHgxYlxcWzg7KFxcZCspOyhcXGQrKXQvKTtcbiAgY29uc3QgZXZlbnRzID0gW107XG4gIGxldCBjb2xzID0gODA7XG4gIGxldCByb3dzID0gMjQ7XG4gIGlmIChzaXplTWF0Y2ggIT09IG51bGwpIHtcbiAgICBjb2xzID0gcGFyc2VJbnQoc2l6ZU1hdGNoWzJdLCAxMCk7XG4gICAgcm93cyA9IHBhcnNlSW50KHNpemVNYXRjaFsxXSwgMTApO1xuICB9XG4gIGxldCBjdXJzb3IgPSAwO1xuICBsZXQgZnJhbWUgPSBwYXJzZUZyYW1lKGFycmF5KTtcbiAgd2hpbGUgKGZyYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCB0aW1lID0gZnJhbWUudGltZSAtIGJhc2VUaW1lO1xuICAgIGNvbnN0IHRleHQgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoZnJhbWUuZGF0YSk7XG4gICAgZXZlbnRzLnB1c2goW3RpbWUsIFwib1wiLCB0ZXh0XSk7XG4gICAgY3Vyc29yICs9IGZyYW1lLmxlbjtcbiAgICBmcmFtZSA9IHBhcnNlRnJhbWUoYXJyYXkuc3ViYXJyYXkoY3Vyc29yKSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBjb2xzLFxuICAgIHJvd3MsXG4gICAgZXZlbnRzXG4gIH07XG59XG5mdW5jdGlvbiBwYXJzZUZyYW1lKGFycmF5KSB7XG4gIGlmIChhcnJheS5sZW5ndGggPCAxMykgcmV0dXJuO1xuICBjb25zdCB0aW1lID0gcGFyc2VUaW1lc3RhbXAoYXJyYXkuc3ViYXJyYXkoMCwgOCkpO1xuICBjb25zdCBsZW4gPSBwYXJzZU51bWJlcihhcnJheS5zdWJhcnJheSg4LCAxMikpO1xuICBjb25zdCBkYXRhID0gYXJyYXkuc3ViYXJyYXkoMTIsIDEyICsgbGVuKTtcbiAgcmV0dXJuIHtcbiAgICB0aW1lLFxuICAgIGRhdGEsXG4gICAgbGVuOiBsZW4gKyAxMlxuICB9O1xufVxuZnVuY3Rpb24gcGFyc2VOdW1iZXIoYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5WzBdICsgYXJyYXlbMV0gKiAyNTYgKyBhcnJheVsyXSAqIDI1NiAqIDI1NiArIGFycmF5WzNdICogMjU2ICogMjU2ICogMjU2O1xufVxuZnVuY3Rpb24gcGFyc2VUaW1lc3RhbXAoYXJyYXkpIHtcbiAgY29uc3Qgc2VjID0gcGFyc2VOdW1iZXIoYXJyYXkuc3ViYXJyYXkoMCwgNCkpO1xuICBjb25zdCB1c2VjID0gcGFyc2VOdW1iZXIoYXJyYXkuc3ViYXJyYXkoNCwgOCkpO1xuICByZXR1cm4gc2VjICsgdXNlYyAvIDEwMDAwMDA7XG59XG5cbmNvbnN0IERFRkFVTFRfQ09MUyA9IDgwO1xuY29uc3QgREVGQVVMVF9ST1dTID0gMjQ7XG5jb25zdCB2dCA9IGluaXQoe1xuICBtb2R1bGU6IHZ0V2FzbU1vZHVsZVxufSk7IC8vIHRyaWdnZXIgYXN5bmMgbG9hZGluZyBvZiB3YXNtXG5cbmNsYXNzIFN0YXRlIHtcbiAgY29uc3RydWN0b3IoY29yZSkge1xuICAgIHRoaXMuY29yZSA9IGNvcmU7XG4gICAgdGhpcy5kcml2ZXIgPSBjb3JlLmRyaXZlcjtcbiAgfVxuICBvbkVudGVyKGRhdGEpIHt9XG4gIGluaXQoKSB7fVxuICBwbGF5KCkge31cbiAgcGF1c2UoKSB7fVxuICB0b2dnbGVQbGF5KCkge31cbiAgbXV0ZSgpIHtcbiAgICBpZiAodGhpcy5kcml2ZXIgJiYgdGhpcy5kcml2ZXIubXV0ZSgpKSB7XG4gICAgICB0aGlzLmNvcmUuX2Rpc3BhdGNoRXZlbnQoXCJtdXRlZFwiLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgdW5tdXRlKCkge1xuICAgIGlmICh0aGlzLmRyaXZlciAmJiB0aGlzLmRyaXZlci51bm11dGUoKSkge1xuICAgICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwibXV0ZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgfVxuICBzZWVrKHdoZXJlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0ZXAobikge31cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmRyaXZlci5zdG9wKCk7XG4gIH1cbn1cbmNsYXNzIFVuaW5pdGlhbGl6ZWRTdGF0ZSBleHRlbmRzIFN0YXRlIHtcbiAgYXN5bmMgaW5pdCgpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5jb3JlLl9pbml0aWFsaXplRHJpdmVyKCk7XG4gICAgICByZXR1cm4gdGhpcy5jb3JlLl9zZXRTdGF0ZShcImlkbGVcIik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5jb3JlLl9zZXRTdGF0ZShcImVycm9yZWRcIik7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuICBhc3luYyBwbGF5KCkge1xuICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcInBsYXlcIik7XG4gICAgY29uc3QgaWRsZVN0YXRlID0gYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgYXdhaXQgaWRsZVN0YXRlLmRvUGxheSgpO1xuICB9XG4gIGFzeW5jIHRvZ2dsZVBsYXkoKSB7XG4gICAgYXdhaXQgdGhpcy5wbGF5KCk7XG4gIH1cbiAgYXN5bmMgc2Vlayh3aGVyZSkge1xuICAgIGNvbnN0IGlkbGVTdGF0ZSA9IGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgIHJldHVybiBhd2FpdCBpZGxlU3RhdGUuc2Vlayh3aGVyZSk7XG4gIH1cbiAgYXN5bmMgc3RlcChuKSB7XG4gICAgY29uc3QgaWRsZVN0YXRlID0gYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgYXdhaXQgaWRsZVN0YXRlLnN0ZXAobik7XG4gIH1cbiAgc3RvcCgpIHt9XG59XG5jbGFzcyBJZGxlIGV4dGVuZHMgU3RhdGUge1xuICBvbkVudGVyKF9yZWYpIHtcbiAgICBsZXQge1xuICAgICAgcmVhc29uLFxuICAgICAgbWVzc2FnZVxuICAgIH0gPSBfcmVmO1xuICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcImlkbGVcIiwge1xuICAgICAgbWVzc2FnZVxuICAgIH0pO1xuICAgIGlmIChyZWFzb24gPT09IFwicGF1c2VkXCIpIHtcbiAgICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcInBhdXNlXCIpO1xuICAgIH1cbiAgfVxuICBhc3luYyBwbGF5KCkge1xuICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcInBsYXlcIik7XG4gICAgYXdhaXQgdGhpcy5kb1BsYXkoKTtcbiAgfVxuICBhc3luYyBkb1BsYXkoKSB7XG4gICAgY29uc3Qgc3RvcCA9IGF3YWl0IHRoaXMuZHJpdmVyLnBsYXkoKTtcbiAgICBpZiAoc3RvcCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jb3JlLl9zZXRTdGF0ZShcInBsYXlpbmdcIik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RvcCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmNvcmUuX3NldFN0YXRlKFwicGxheWluZ1wiKTtcbiAgICAgIHRoaXMuZHJpdmVyLnN0b3AgPSBzdG9wO1xuICAgIH1cbiAgfVxuICBhc3luYyB0b2dnbGVQbGF5KCkge1xuICAgIGF3YWl0IHRoaXMucGxheSgpO1xuICB9XG4gIHNlZWsod2hlcmUpIHtcbiAgICByZXR1cm4gdGhpcy5kcml2ZXIuc2Vlayh3aGVyZSk7XG4gIH1cbiAgc3RlcChuKSB7XG4gICAgdGhpcy5kcml2ZXIuc3RlcChuKTtcbiAgfVxufVxuY2xhc3MgUGxheWluZ1N0YXRlIGV4dGVuZHMgU3RhdGUge1xuICBvbkVudGVyKCkge1xuICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcInBsYXlpbmdcIik7XG4gIH1cbiAgcGF1c2UoKSB7XG4gICAgaWYgKHRoaXMuZHJpdmVyLnBhdXNlKCkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuY29yZS5fc2V0U3RhdGUoXCJpZGxlXCIsIHtcbiAgICAgICAgcmVhc29uOiBcInBhdXNlZFwiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgdG9nZ2xlUGxheSgpIHtcbiAgICB0aGlzLnBhdXNlKCk7XG4gIH1cbiAgc2Vlayh3aGVyZSkge1xuICAgIHJldHVybiB0aGlzLmRyaXZlci5zZWVrKHdoZXJlKTtcbiAgfVxufVxuY2xhc3MgTG9hZGluZ1N0YXRlIGV4dGVuZHMgU3RhdGUge1xuICBvbkVudGVyKCkge1xuICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcImxvYWRpbmdcIik7XG4gIH1cbn1cbmNsYXNzIE9mZmxpbmVTdGF0ZSBleHRlbmRzIFN0YXRlIHtcbiAgb25FbnRlcihfcmVmMikge1xuICAgIGxldCB7XG4gICAgICBtZXNzYWdlXG4gICAgfSA9IF9yZWYyO1xuICAgIHRoaXMuY29yZS5fZGlzcGF0Y2hFdmVudChcIm9mZmxpbmVcIiwge1xuICAgICAgbWVzc2FnZVxuICAgIH0pO1xuICB9XG59XG5jbGFzcyBFbmRlZFN0YXRlIGV4dGVuZHMgU3RhdGUge1xuICBvbkVudGVyKF9yZWYzKSB7XG4gICAgbGV0IHtcbiAgICAgIG1lc3NhZ2VcbiAgICB9ID0gX3JlZjM7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwiZW5kZWRcIiwge1xuICAgICAgbWVzc2FnZVxuICAgIH0pO1xuICB9XG4gIGFzeW5jIHBsYXkoKSB7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwicGxheVwiKTtcbiAgICBpZiAoYXdhaXQgdGhpcy5kcml2ZXIucmVzdGFydCgpKSB7XG4gICAgICB0aGlzLmNvcmUuX3NldFN0YXRlKCdwbGF5aW5nJyk7XG4gICAgfVxuICB9XG4gIGFzeW5jIHRvZ2dsZVBsYXkoKSB7XG4gICAgYXdhaXQgdGhpcy5wbGF5KCk7XG4gIH1cbiAgYXN5bmMgc2Vlayh3aGVyZSkge1xuICAgIGlmICgoYXdhaXQgdGhpcy5kcml2ZXIuc2Vlayh3aGVyZSkpID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmNvcmUuX3NldFN0YXRlKCdpZGxlJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5jbGFzcyBFcnJvcmVkU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gIG9uRW50ZXIoKSB7XG4gICAgdGhpcy5jb3JlLl9kaXNwYXRjaEV2ZW50KFwiZXJyb3JlZFwiKTtcbiAgfVxufVxuY2xhc3MgQ29yZSB7XG4gIGNvbnN0cnVjdG9yKHNyYywgb3B0cykge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXI7XG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBVbmluaXRpYWxpemVkU3RhdGUodGhpcyk7XG4gICAgdGhpcy5zdGF0ZU5hbWUgPSBcInVuaW5pdGlhbGl6ZWRcIjtcbiAgICB0aGlzLmRyaXZlciA9IGdldERyaXZlcihzcmMpO1xuICAgIHRoaXMuY2hhbmdlZExpbmVzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZHVyYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb2xzID0gb3B0cy5jb2xzO1xuICAgIHRoaXMucm93cyA9IG9wdHMucm93cztcbiAgICB0aGlzLnNwZWVkID0gb3B0cy5zcGVlZDtcbiAgICB0aGlzLmxvb3AgPSBvcHRzLmxvb3A7XG4gICAgdGhpcy5hdXRvUGxheSA9IG9wdHMuYXV0b1BsYXk7XG4gICAgdGhpcy5pZGxlVGltZUxpbWl0ID0gb3B0cy5pZGxlVGltZUxpbWl0O1xuICAgIHRoaXMucHJlbG9hZCA9IG9wdHMucHJlbG9hZDtcbiAgICB0aGlzLnN0YXJ0QXQgPSBwYXJzZU5wdChvcHRzLnN0YXJ0QXQpO1xuICAgIHRoaXMucG9zdGVyID0gdGhpcy5fcGFyc2VQb3N0ZXIob3B0cy5wb3N0ZXIpO1xuICAgIHRoaXMubWFya2VycyA9IHRoaXMuX25vcm1hbGl6ZU1hcmtlcnMob3B0cy5tYXJrZXJzKTtcbiAgICB0aGlzLnBhdXNlT25NYXJrZXJzID0gb3B0cy5wYXVzZU9uTWFya2VycztcbiAgICB0aGlzLmF1ZGlvVXJsID0gb3B0cy5hdWRpb1VybDtcbiAgICB0aGlzLmJvbGRJc0JyaWdodCA9IG9wdHMuYm9sZElzQnJpZ2h0ID8/IGZhbHNlO1xuICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgdGhpcy5uZWVkc0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5ldmVudEhhbmRsZXJzID0gbmV3IE1hcChbW1wiZW5kZWRcIiwgW11dLCBbXCJlcnJvcmVkXCIsIFtdXSwgW1wiaWRsZVwiLCBbXV0sIFtcImlucHV0XCIsIFtdXSwgW1wibG9hZGluZ1wiLCBbXV0sIFtcIm1hcmtlclwiLCBbXV0sIFtcIm1ldGFkYXRhXCIsIFtdXSwgW1wibXV0ZWRcIiwgW11dLCBbXCJvZmZsaW5lXCIsIFtdXSwgW1wicGF1c2VcIiwgW11dLCBbXCJwbGF5XCIsIFtdXSwgW1wicGxheWluZ1wiLCBbXV0sIFtcInJlYWR5XCIsIFtdXSwgW1wic2Vla2VkXCIsIFtdXSwgW1widnRVcGRhdGVcIiwgW11dXSk7XG4gIH1cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICB0aGlzLndhc20gPSBhd2FpdCB2dDtcbiAgICBjb25zdCB7XG4gICAgICBtZW1vcnlcbiAgICB9ID0gYXdhaXQgdGhpcy53YXNtLmRlZmF1bHQoKTtcbiAgICB0aGlzLm1lbW9yeSA9IG1lbW9yeTtcbiAgICB0aGlzLl9pbml0aWFsaXplVnQodGhpcy5jb2xzID8/IERFRkFVTFRfQ09MUywgdGhpcy5yb3dzID8/IERFRkFVTFRfUk9XUyk7XG4gICAgY29uc3QgZmVlZCA9IHRoaXMuX2ZlZWQuYmluZCh0aGlzKTtcbiAgICBjb25zdCBvbklucHV0ID0gZGF0YSA9PiB7XG4gICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwiaW5wdXRcIiwge1xuICAgICAgICBkYXRhXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IG9uTWFya2VyID0gX3JlZjQgPT4ge1xuICAgICAgbGV0IHtcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHRpbWUsXG4gICAgICAgIGxhYmVsXG4gICAgICB9ID0gX3JlZjQ7XG4gICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwibWFya2VyXCIsIHtcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHRpbWUsXG4gICAgICAgIGxhYmVsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IHJlc2V0ID0gdGhpcy5fcmVzZXRWdC5iaW5kKHRoaXMpO1xuICAgIGNvbnN0IHJlc2l6ZSA9IHRoaXMuX3Jlc2l6ZVZ0LmJpbmQodGhpcyk7XG4gICAgY29uc3Qgc2V0U3RhdGUgPSB0aGlzLl9zZXRTdGF0ZS5iaW5kKHRoaXMpO1xuICAgIGNvbnN0IHBvc3RlclRpbWUgPSB0aGlzLnBvc3Rlci50eXBlID09PSBcIm5wdFwiICYmICF0aGlzLmF1dG9QbGF5ID8gdGhpcy5wb3N0ZXIudmFsdWUgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5kcml2ZXIgPSB0aGlzLmRyaXZlcih7XG4gICAgICBmZWVkLFxuICAgICAgb25JbnB1dCxcbiAgICAgIG9uTWFya2VyLFxuICAgICAgcmVzZXQsXG4gICAgICByZXNpemUsXG4gICAgICBzZXRTdGF0ZSxcbiAgICAgIGxvZ2dlcjogdGhpcy5sb2dnZXJcbiAgICB9LCB7XG4gICAgICBjb2xzOiB0aGlzLmNvbHMsXG4gICAgICByb3dzOiB0aGlzLnJvd3MsXG4gICAgICBzcGVlZDogdGhpcy5zcGVlZCxcbiAgICAgIGlkbGVUaW1lTGltaXQ6IHRoaXMuaWRsZVRpbWVMaW1pdCxcbiAgICAgIHN0YXJ0QXQ6IHRoaXMuc3RhcnRBdCxcbiAgICAgIGxvb3A6IHRoaXMubG9vcCxcbiAgICAgIHBvc3RlclRpbWU6IHBvc3RlclRpbWUsXG4gICAgICBtYXJrZXJzOiB0aGlzLm1hcmtlcnMsXG4gICAgICBwYXVzZU9uTWFya2VyczogdGhpcy5wYXVzZU9uTWFya2VycyxcbiAgICAgIGF1ZGlvVXJsOiB0aGlzLmF1ZGlvVXJsXG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRyaXZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmRyaXZlciA9IHtcbiAgICAgICAgcGxheTogdGhpcy5kcml2ZXJcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0aGlzLnByZWxvYWQgfHwgcG9zdGVyVGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl93aXRoU3RhdGUoc3RhdGUgPT4gc3RhdGUuaW5pdCgpKTtcbiAgICB9XG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgaXNQYXVzYWJsZTogISF0aGlzLmRyaXZlci5wYXVzZSxcbiAgICAgIGlzU2Vla2FibGU6ICEhdGhpcy5kcml2ZXIuc2Vla1xuICAgIH07XG4gICAgaWYgKHRoaXMuZHJpdmVyLmluaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIuaW5pdCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLnBhdXNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZHJpdmVyLnBhdXNlID0gKCkgPT4ge307XG4gICAgfVxuICAgIGlmICh0aGlzLmRyaXZlci5zZWVrID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZHJpdmVyLnNlZWsgPSB3aGVyZSA9PiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLnN0ZXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIuc3RlcCA9IG4gPT4ge307XG4gICAgfVxuICAgIGlmICh0aGlzLmRyaXZlci5zdG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZHJpdmVyLnN0b3AgPSAoKSA9PiB7fTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZHJpdmVyLnJlc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIucmVzdGFydCA9ICgpID0+IHt9O1xuICAgIH1cbiAgICBpZiAodGhpcy5kcml2ZXIubXV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRyaXZlci5tdXRlID0gKCkgPT4ge307XG4gICAgfVxuICAgIGlmICh0aGlzLmRyaXZlci51bm11dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kcml2ZXIudW5tdXRlID0gKCkgPT4ge307XG4gICAgfVxuICAgIGlmICh0aGlzLmRyaXZlci5nZXRDdXJyZW50VGltZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBwbGF5ID0gdGhpcy5kcml2ZXIucGxheTtcbiAgICAgIGxldCBjbG9jayA9IG5ldyBOdWxsQ2xvY2soKTtcbiAgICAgIHRoaXMuZHJpdmVyLnBsYXkgPSAoKSA9PiB7XG4gICAgICAgIGNsb2NrID0gbmV3IENsb2NrKHRoaXMuc3BlZWQpO1xuICAgICAgICByZXR1cm4gcGxheSgpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuZHJpdmVyLmdldEN1cnJlbnRUaW1lID0gKCkgPT4gY2xvY2suZ2V0VGltZSgpO1xuICAgIH1cbiAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwicmVhZHlcIiwgY29uZmlnKTtcbiAgICBpZiAodGhpcy5hdXRvUGxheSkge1xuICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBvc3Rlci50eXBlID09PSBcInRleHRcIikge1xuICAgICAgdGhpcy5fZmVlZCh0aGlzLnBvc3Rlci52YWx1ZSk7XG4gICAgICB0aGlzLm5lZWRzQ2xlYXIgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBwbGF5KCkge1xuICAgIHRoaXMuX2NsZWFySWZOZWVkZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLnBsYXkoKSk7XG4gIH1cbiAgcGF1c2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpdGhTdGF0ZShzdGF0ZSA9PiBzdGF0ZS5wYXVzZSgpKTtcbiAgfVxuICB0b2dnbGVQbGF5KCkge1xuICAgIHRoaXMuX2NsZWFySWZOZWVkZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLnRvZ2dsZVBsYXkoKSk7XG4gIH1cbiAgc2Vlayh3aGVyZSkge1xuICAgIHRoaXMuX2NsZWFySWZOZWVkZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKGFzeW5jIHN0YXRlID0+IHtcbiAgICAgIGlmIChhd2FpdCBzdGF0ZS5zZWVrKHdoZXJlKSkge1xuICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwic2Vla2VkXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHN0ZXAobikge1xuICAgIHRoaXMuX2NsZWFySWZOZWVkZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLnN0ZXAobikpO1xuICB9XG4gIHN0b3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpdGhTdGF0ZShzdGF0ZSA9PiBzdGF0ZS5zdG9wKCkpO1xuICB9XG4gIG11dGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpdGhTdGF0ZShzdGF0ZSA9PiBzdGF0ZS5tdXRlKCkpO1xuICB9XG4gIHVubXV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2l0aFN0YXRlKHN0YXRlID0+IHN0YXRlLnVubXV0ZSgpKTtcbiAgfVxuICBnZXRMaW5lKG4sIGN1cnNvck9uKSB7XG4gICAgcmV0dXJuIHRoaXMudnQuZ2V0TGluZShuLCBjdXJzb3JPbik7XG4gIH1cbiAgZ2V0RGF0YVZpZXcoX3JlZjUsIHNpemUpIHtcbiAgICBsZXQgW3B0ciwgbGVuXSA9IF9yZWY1O1xuICAgIHJldHVybiBuZXcgRGF0YVZpZXcodGhpcy5tZW1vcnkuYnVmZmVyLCBwdHIsIGxlbiAqIHNpemUpO1xuICB9XG4gIGdldFVpbnQzMkFycmF5KF9yZWY2KSB7XG4gICAgbGV0IFtwdHIsIGxlbl0gPSBfcmVmNjtcbiAgICByZXR1cm4gbmV3IFVpbnQzMkFycmF5KHRoaXMubWVtb3J5LmJ1ZmZlciwgcHRyLCBsZW4pO1xuICB9XG4gIGdldEN1cnNvcigpIHtcbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLnZ0LmdldEN1cnNvcigpO1xuICAgIGlmIChjdXJzb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbDogY3Vyc29yWzBdLFxuICAgICAgICByb3c6IGN1cnNvclsxXSxcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbDogMCxcbiAgICAgIHJvdzogMCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBnZXRDdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kcml2ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgfVxuICBnZXRSZW1haW5pbmdUaW1lKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5kdXJhdGlvbiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24gLSBNYXRoLm1pbih0aGlzLmdldEN1cnJlbnRUaW1lKCksIHRoaXMuZHVyYXRpb24pO1xuICAgIH1cbiAgfVxuICBnZXRQcm9ncmVzcygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZHVyYXRpb24gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldEN1cnJlbnRUaW1lKCksIHRoaXMuZHVyYXRpb24pIC8gdGhpcy5kdXJhdGlvbjtcbiAgICB9XG4gIH1cbiAgZ2V0RHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZHVyYXRpb247XG4gIH1cbiAgYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICB0aGlzLmV2ZW50SGFuZGxlcnMuZ2V0KGV2ZW50TmFtZSkucHVzaChoYW5kbGVyKTtcbiAgfVxuICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5ldmVudEhhbmRsZXJzLmdldChldmVudE5hbWUpO1xuICAgIGlmICghaGFuZGxlcnMpIHJldHVybjtcbiAgICBjb25zdCBpZHggPSBoYW5kbGVycy5pbmRleE9mKGhhbmRsZXIpO1xuICAgIGlmIChpZHggIT09IC0xKSBoYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiAgfVxuICBfZGlzcGF0Y2hFdmVudChldmVudE5hbWUpIHtcbiAgICBsZXQgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgZm9yIChjb25zdCBoIG9mIHRoaXMuZXZlbnRIYW5kbGVycy5nZXQoZXZlbnROYW1lKSkge1xuICAgICAgaChkYXRhKTtcbiAgICB9XG4gIH1cbiAgX3dpdGhTdGF0ZShmKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VucXVldWVDb21tYW5kKCgpID0+IGYodGhpcy5zdGF0ZSkpO1xuICB9XG4gIF9lbnF1ZXVlQ29tbWFuZChmKSB7XG4gICAgdGhpcy5jb21tYW5kUXVldWUgPSB0aGlzLmNvbW1hbmRRdWV1ZS50aGVuKGYpO1xuICAgIHJldHVybiB0aGlzLmNvbW1hbmRRdWV1ZTtcbiAgfVxuICBfc2V0U3RhdGUobmV3U3RhdGUpIHtcbiAgICBsZXQgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgaWYgKHRoaXMuc3RhdGVOYW1lID09PSBuZXdTdGF0ZSkgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgdGhpcy5zdGF0ZU5hbWUgPSBuZXdTdGF0ZTtcbiAgICBpZiAobmV3U3RhdGUgPT09IFwicGxheWluZ1wiKSB7XG4gICAgICB0aGlzLnN0YXRlID0gbmV3IFBsYXlpbmdTdGF0ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09PSBcImlkbGVcIikge1xuICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBJZGxlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gICAgICB0aGlzLnN0YXRlID0gbmV3IExvYWRpbmdTdGF0ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09PSBcImVuZGVkXCIpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBuZXcgRW5kZWRTdGF0ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09PSBcIm9mZmxpbmVcIikge1xuICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBPZmZsaW5lU3RhdGUodGhpcyk7XG4gICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PT0gXCJlcnJvcmVkXCIpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBuZXcgRXJyb3JlZFN0YXRlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgc3RhdGU6ICR7bmV3U3RhdGV9YCk7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUub25FbnRlcihkYXRhKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfVxuICBfZmVlZChkYXRhKSB7XG4gICAgY29uc3QgY2hhbmdlZFJvd3MgPSB0aGlzLnZ0LmZlZWQoZGF0YSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hFdmVudChcInZ0VXBkYXRlXCIsIHtcbiAgICAgIGNoYW5nZWRSb3dzXG4gICAgfSk7XG4gIH1cbiAgYXN5bmMgX2luaXRpYWxpemVEcml2ZXIoKSB7XG4gICAgY29uc3QgbWV0YSA9IGF3YWl0IHRoaXMuZHJpdmVyLmluaXQoKTtcbiAgICB0aGlzLmNvbHMgPSB0aGlzLmNvbHMgPz8gbWV0YS5jb2xzID8/IERFRkFVTFRfQ09MUztcbiAgICB0aGlzLnJvd3MgPSB0aGlzLnJvd3MgPz8gbWV0YS5yb3dzID8/IERFRkFVTFRfUk9XUztcbiAgICB0aGlzLmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbiA/PyBtZXRhLmR1cmF0aW9uO1xuICAgIHRoaXMubWFya2VycyA9IHRoaXMuX25vcm1hbGl6ZU1hcmtlcnMobWV0YS5tYXJrZXJzKSA/PyB0aGlzLm1hcmtlcnMgPz8gW107XG4gICAgaWYgKHRoaXMuY29scyA9PT0gMCkge1xuICAgICAgdGhpcy5jb2xzID0gREVGQVVMVF9DT0xTO1xuICAgIH1cbiAgICBpZiAodGhpcy5yb3dzID09PSAwKSB7XG4gICAgICB0aGlzLnJvd3MgPSBERUZBVUxUX1JPV1M7XG4gICAgfVxuICAgIHRoaXMuX2luaXRpYWxpemVWdCh0aGlzLmNvbHMsIHRoaXMucm93cyk7XG4gICAgaWYgKG1ldGEucG9zdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1ldGEucG9zdGVyLmZvckVhY2godGV4dCA9PiB0aGlzLnZ0LmZlZWQodGV4dCkpO1xuICAgICAgdGhpcy5uZWVkc0NsZWFyID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zdGVyLnR5cGUgPT09IFwidGV4dFwiKSB7XG4gICAgICB0aGlzLnZ0LmZlZWQodGhpcy5wb3N0ZXIudmFsdWUpO1xuICAgICAgdGhpcy5uZWVkc0NsZWFyID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5fZGlzcGF0Y2hFdmVudChcIm1ldGFkYXRhXCIsIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgY29sczogdGhpcy5jb2xzLFxuICAgICAgICByb3dzOiB0aGlzLnJvd3NcbiAgICAgIH0sXG4gICAgICB0aGVtZTogbWV0YS50aGVtZSA/PyBudWxsLFxuICAgICAgZHVyYXRpb246IHRoaXMuZHVyYXRpb24sXG4gICAgICBtYXJrZXJzOiB0aGlzLm1hcmtlcnMsXG4gICAgICBoYXNBdWRpbzogbWV0YS5oYXNBdWRpb1xuICAgIH0pO1xuICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJ2dFVwZGF0ZVwiLCB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIGNvbHM6IHRoaXMuY29scyxcbiAgICAgICAgcm93czogdGhpcy5yb3dzXG4gICAgICB9LFxuICAgICAgdGhlbWU6IG1ldGEudGhlbWUgPz8gbnVsbCxcbiAgICAgIGNoYW5nZWRSb3dzOiBBcnJheS5mcm9tKHtcbiAgICAgICAgbGVuZ3RoOiB0aGlzLnJvd3NcbiAgICAgIH0sIChfLCBpKSA9PiBpKVxuICAgIH0pO1xuICB9XG4gIF9jbGVhcklmTmVlZGVkKCkge1xuICAgIGlmICh0aGlzLm5lZWRzQ2xlYXIpIHtcbiAgICAgIHRoaXMuX2ZlZWQoJ1xceDFiYycpO1xuICAgICAgdGhpcy5uZWVkc0NsZWFyID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIF9yZXNldFZ0KGNvbHMsIHJvd3MpIHtcbiAgICBsZXQgaW5pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICAgIGxldCB0aGVtZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogdW5kZWZpbmVkO1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjb3JlOiB2dCByZXNldCAoJHtjb2xzfXgke3Jvd3N9KWApO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLl9pbml0aWFsaXplVnQoY29scywgcm93cyk7XG4gICAgaWYgKGluaXQgIT09IHVuZGVmaW5lZCAmJiBpbml0ICE9PSBcIlwiKSB7XG4gICAgICB0aGlzLnZ0LmZlZWQoaW5pdCk7XG4gICAgfVxuICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJtZXRhZGF0YVwiLCB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIGNvbHMsXG4gICAgICAgIHJvd3NcbiAgICAgIH0sXG4gICAgICB0aGVtZTogdGhlbWUgPz8gbnVsbFxuICAgIH0pO1xuICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJ2dFVwZGF0ZVwiLCB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIGNvbHMsXG4gICAgICAgIHJvd3NcbiAgICAgIH0sXG4gICAgICB0aGVtZTogdGhlbWUgPz8gbnVsbCxcbiAgICAgIGNoYW5nZWRSb3dzOiBBcnJheS5mcm9tKHtcbiAgICAgICAgbGVuZ3RoOiByb3dzXG4gICAgICB9LCAoXywgaSkgPT4gaSlcbiAgICB9KTtcbiAgfVxuICBfcmVzaXplVnQoY29scywgcm93cykge1xuICAgIGlmIChjb2xzID09PSB0aGlzLnZ0LmNvbHMgJiYgcm93cyA9PT0gdGhpcy52dC5yb3dzKSByZXR1cm47XG4gICAgY29uc3QgY2hhbmdlZFJvd3MgPSB0aGlzLnZ0LnJlc2l6ZShjb2xzLCByb3dzKTtcbiAgICB0aGlzLnZ0LmNvbHMgPSBjb2xzO1xuICAgIHRoaXMudnQucm93cyA9IHJvd3M7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoYGNvcmU6IHZ0IHJlc2l6ZSAoJHtjb2xzfXgke3Jvd3N9KWApO1xuICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoXCJtZXRhZGF0YVwiLCB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIGNvbHMsXG4gICAgICAgIHJvd3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KFwidnRVcGRhdGVcIiwge1xuICAgICAgc2l6ZToge1xuICAgICAgICBjb2xzLFxuICAgICAgICByb3dzXG4gICAgICB9LFxuICAgICAgY2hhbmdlZFJvd3NcbiAgICB9KTtcbiAgfVxuICBfaW5pdGlhbGl6ZVZ0KGNvbHMsIHJvd3MpIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1ZygndnQgaW5pdCcsIHtcbiAgICAgIGNvbHMsXG4gICAgICByb3dzXG4gICAgfSk7XG4gICAgdGhpcy52dCA9IHRoaXMud2FzbS5jcmVhdGUoY29scywgcm93cywgMTAwLCB0aGlzLmJvbGRJc0JyaWdodCk7XG4gICAgdGhpcy52dC5jb2xzID0gY29scztcbiAgICB0aGlzLnZ0LnJvd3MgPSByb3dzO1xuICB9XG4gIF9wYXJzZVBvc3Rlcihwb3N0ZXIpIHtcbiAgICBpZiAodHlwZW9mIHBvc3RlciAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIHt9O1xuICAgIGlmIChwb3N0ZXIuc3Vic3RyaW5nKDAsIDE2KSA9PSBcImRhdGE6dGV4dC9wbGFpbixcIikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIHZhbHVlOiBwb3N0ZXIuc3Vic3RyaW5nKDE2KVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHBvc3Rlci5zdWJzdHJpbmcoMCwgNCkgPT0gXCJucHQ6XCIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwibnB0XCIsXG4gICAgICAgIHZhbHVlOiBwYXJzZU5wdChwb3N0ZXIuc3Vic3RyaW5nKDQpKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIF9ub3JtYWxpemVNYXJrZXJzKG1hcmtlcnMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShtYXJrZXJzKSkge1xuICAgICAgcmV0dXJuIG1hcmtlcnMubWFwKG0gPT4gdHlwZW9mIG0gPT09IFwibnVtYmVyXCIgPyBbbSwgXCJcIl0gOiBtKTtcbiAgICB9XG4gIH1cbn1cbmNvbnN0IERSSVZFUlMgPSBuZXcgTWFwKFtbXCJiZW5jaG1hcmtcIiwgYmVuY2htYXJrXSwgW1wiY2xvY2tcIiwgY2xvY2tdLCBbXCJldmVudHNvdXJjZVwiLCBldmVudHNvdXJjZV0sIFtcInJhbmRvbVwiLCByYW5kb21dLCBbXCJyZWNvcmRpbmdcIiwgcmVjb3JkaW5nXSwgW1wid2Vic29ja2V0XCIsIHdlYnNvY2tldF1dKTtcbmNvbnN0IFBBUlNFUlMgPSBuZXcgTWFwKFtbXCJhc2NpaWNhc3RcIiwgcGFyc2UkMl0sIFtcInR5cGVzY3JpcHRcIiwgcGFyc2UkMV0sIFtcInR0eXJlY1wiLCBwYXJzZV1dKTtcbmZ1bmN0aW9uIGdldERyaXZlcihzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHNyYztcbiAgaWYgKHR5cGVvZiBzcmMgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoc3JjLnN1YnN0cmluZygwLCA1KSA9PSBcIndzOi8vXCIgfHwgc3JjLnN1YnN0cmluZygwLCA2KSA9PSBcIndzczovL1wiKSB7XG4gICAgICBzcmMgPSB7XG4gICAgICAgIGRyaXZlcjogXCJ3ZWJzb2NrZXRcIixcbiAgICAgICAgdXJsOiBzcmNcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChzcmMuc3Vic3RyaW5nKDAsIDYpID09IFwiY2xvY2s6XCIpIHtcbiAgICAgIHNyYyA9IHtcbiAgICAgICAgZHJpdmVyOiBcImNsb2NrXCJcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChzcmMuc3Vic3RyaW5nKDAsIDcpID09IFwicmFuZG9tOlwiKSB7XG4gICAgICBzcmMgPSB7XG4gICAgICAgIGRyaXZlcjogXCJyYW5kb21cIlxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHNyYy5zdWJzdHJpbmcoMCwgMTApID09IFwiYmVuY2htYXJrOlwiKSB7XG4gICAgICBzcmMgPSB7XG4gICAgICAgIGRyaXZlcjogXCJiZW5jaG1hcmtcIixcbiAgICAgICAgdXJsOiBzcmMuc3Vic3RyaW5nKDEwKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3JjID0ge1xuICAgICAgICBkcml2ZXI6IFwicmVjb3JkaW5nXCIsXG4gICAgICAgIHVybDogc3JjXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoc3JjLmRyaXZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3JjLmRyaXZlciA9IFwicmVjb3JkaW5nXCI7XG4gIH1cbiAgaWYgKHNyYy5kcml2ZXIgPT0gXCJyZWNvcmRpbmdcIikge1xuICAgIGlmIChzcmMucGFyc2VyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNyYy5wYXJzZXIgPSBcImFzY2lpY2FzdFwiO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNyYy5wYXJzZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChQQVJTRVJTLmhhcyhzcmMucGFyc2VyKSkge1xuICAgICAgICBzcmMucGFyc2VyID0gUEFSU0VSUy5nZXQoc3JjLnBhcnNlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gcGFyc2VyOiAke3NyYy5wYXJzZXJ9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChEUklWRVJTLmhhcyhzcmMuZHJpdmVyKSkge1xuICAgIGNvbnN0IGRyaXZlciA9IERSSVZFUlMuZ2V0KHNyYy5kcml2ZXIpO1xuICAgIHJldHVybiAoY2FsbGJhY2tzLCBvcHRzKSA9PiBkcml2ZXIoc3JjLCBjYWxsYmFja3MsIG9wdHMpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZHJpdmVyOiAke0pTT04uc3RyaW5naWZ5KHNyYyl9YCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgQ29yZSBhcyBDIH07XG4iLCAiaW1wb3J0IHsgaCBhcyBoZXhUb09rbGFiLCBsIGFzIGxlcnBPa2xhYiwgbyBhcyBva2xhYlRvSGV4LCBuIGFzIG5vcm1hbGl6ZUhleENvbG9yLCB0IGFzIHRocm90dGxlLCBkIGFzIGRlYm91bmNlIH0gZnJvbSAnLi9sb2dnaW5nLS1QMENzRXVfLmpzJztcblxuY29uc3QgSVNfREVWID0gZmFsc2U7XG5jb25zdCBlcXVhbEZuID0gKGEsIGIpID0+IGEgPT09IGI7XG5jb25zdCAkUFJPWFkgPSBTeW1ib2woXCJzb2xpZC1wcm94eVwiKTtcbmNvbnN0ICRUUkFDSyA9IFN5bWJvbChcInNvbGlkLXRyYWNrXCIpO1xuY29uc3Qgc2lnbmFsT3B0aW9ucyA9IHtcbiAgZXF1YWxzOiBlcXVhbEZuXG59O1xubGV0IHJ1bkVmZmVjdHMgPSBydW5RdWV1ZTtcbmNvbnN0IFNUQUxFID0gMTtcbmNvbnN0IFBFTkRJTkcgPSAyO1xuY29uc3QgVU5PV05FRCA9IHtcbiAgb3duZWQ6IG51bGwsXG4gIGNsZWFudXBzOiBudWxsLFxuICBjb250ZXh0OiBudWxsLFxuICBvd25lcjogbnVsbFxufTtcbnZhciBPd25lciA9IG51bGw7XG5sZXQgVHJhbnNpdGlvbiQxID0gbnVsbDtcbmxldCBFeHRlcm5hbFNvdXJjZUNvbmZpZyA9IG51bGw7XG5sZXQgTGlzdGVuZXIgPSBudWxsO1xubGV0IFVwZGF0ZXMgPSBudWxsO1xubGV0IEVmZmVjdHMgPSBudWxsO1xubGV0IEV4ZWNDb3VudCA9IDA7XG5mdW5jdGlvbiBjcmVhdGVSb290KGZuLCBkZXRhY2hlZE93bmVyKSB7XG4gIGNvbnN0IGxpc3RlbmVyID0gTGlzdGVuZXIsXG4gICAgb3duZXIgPSBPd25lcixcbiAgICB1bm93bmVkID0gZm4ubGVuZ3RoID09PSAwLFxuICAgIGN1cnJlbnQgPSBkZXRhY2hlZE93bmVyID09PSB1bmRlZmluZWQgPyBvd25lciA6IGRldGFjaGVkT3duZXIsXG4gICAgcm9vdCA9IHVub3duZWRcbiAgICAgID8gVU5PV05FRFxuICAgICAgOiB7XG4gICAgICAgICAgb3duZWQ6IG51bGwsXG4gICAgICAgICAgY2xlYW51cHM6IG51bGwsXG4gICAgICAgICAgY29udGV4dDogY3VycmVudCA/IGN1cnJlbnQuY29udGV4dCA6IG51bGwsXG4gICAgICAgICAgb3duZXI6IGN1cnJlbnRcbiAgICAgICAgfSxcbiAgICB1cGRhdGVGbiA9IHVub3duZWQgPyBmbiA6ICgpID0+IGZuKCgpID0+IHVudHJhY2soKCkgPT4gY2xlYW5Ob2RlKHJvb3QpKSk7XG4gIE93bmVyID0gcm9vdDtcbiAgTGlzdGVuZXIgPSBudWxsO1xuICB0cnkge1xuICAgIHJldHVybiBydW5VcGRhdGVzKHVwZGF0ZUZuLCB0cnVlKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBMaXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIE93bmVyID0gb3duZXI7XG4gIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZVNpZ25hbCh2YWx1ZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIHNpZ25hbE9wdGlvbnMsIG9wdGlvbnMpIDogc2lnbmFsT3B0aW9ucztcbiAgY29uc3QgcyA9IHtcbiAgICB2YWx1ZSxcbiAgICBvYnNlcnZlcnM6IG51bGwsXG4gICAgb2JzZXJ2ZXJTbG90czogbnVsbCxcbiAgICBjb21wYXJhdG9yOiBvcHRpb25zLmVxdWFscyB8fCB1bmRlZmluZWRcbiAgfTtcbiAgY29uc3Qgc2V0dGVyID0gdmFsdWUgPT4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFsdWUgPSB2YWx1ZShzLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyaXRlU2lnbmFsKHMsIHZhbHVlKTtcbiAgfTtcbiAgcmV0dXJuIFtyZWFkU2lnbmFsLmJpbmQocyksIHNldHRlcl07XG59XG5mdW5jdGlvbiBjcmVhdGVDb21wdXRlZChmbiwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgY29uc3QgYyA9IGNyZWF0ZUNvbXB1dGF0aW9uKGZuLCB2YWx1ZSwgdHJ1ZSwgU1RBTEUpO1xuICB1cGRhdGVDb21wdXRhdGlvbihjKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlbmRlckVmZmVjdChmbiwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgY29uc3QgYyA9IGNyZWF0ZUNvbXB1dGF0aW9uKGZuLCB2YWx1ZSwgZmFsc2UsIFNUQUxFKTtcbiAgdXBkYXRlQ29tcHV0YXRpb24oYyk7XG59XG5mdW5jdGlvbiBjcmVhdGVFZmZlY3QoZm4sIHZhbHVlLCBvcHRpb25zKSB7XG4gIHJ1bkVmZmVjdHMgPSBydW5Vc2VyRWZmZWN0cztcbiAgY29uc3QgYyA9IGNyZWF0ZUNvbXB1dGF0aW9uKGZuLCB2YWx1ZSwgZmFsc2UsIFNUQUxFKTtcbiAgYy51c2VyID0gdHJ1ZTtcbiAgRWZmZWN0cyA/IEVmZmVjdHMucHVzaChjKSA6IHVwZGF0ZUNvbXB1dGF0aW9uKGMpO1xufVxuZnVuY3Rpb24gY3JlYXRlTWVtbyhmbiwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgPyBPYmplY3QuYXNzaWduKHt9LCBzaWduYWxPcHRpb25zLCBvcHRpb25zKSA6IHNpZ25hbE9wdGlvbnM7XG4gIGNvbnN0IGMgPSBjcmVhdGVDb21wdXRhdGlvbihmbiwgdmFsdWUsIHRydWUsIDApO1xuICBjLm9ic2VydmVycyA9IG51bGw7XG4gIGMub2JzZXJ2ZXJTbG90cyA9IG51bGw7XG4gIGMuY29tcGFyYXRvciA9IG9wdGlvbnMuZXF1YWxzIHx8IHVuZGVmaW5lZDtcbiAgdXBkYXRlQ29tcHV0YXRpb24oYyk7XG4gIHJldHVybiByZWFkU2lnbmFsLmJpbmQoYyk7XG59XG5mdW5jdGlvbiBiYXRjaChmbikge1xuICByZXR1cm4gcnVuVXBkYXRlcyhmbiwgZmFsc2UpO1xufVxuZnVuY3Rpb24gdW50cmFjayhmbikge1xuICBpZiAoTGlzdGVuZXIgPT09IG51bGwpIHJldHVybiBmbigpO1xuICBjb25zdCBsaXN0ZW5lciA9IExpc3RlbmVyO1xuICBMaXN0ZW5lciA9IG51bGw7XG4gIHRyeSB7XG4gICAgaWYgKEV4dGVybmFsU291cmNlQ29uZmlnKSA7XG4gICAgcmV0dXJuIGZuKCk7XG4gIH0gZmluYWxseSB7XG4gICAgTGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgfVxufVxuZnVuY3Rpb24gb25Nb3VudChmbikge1xuICBjcmVhdGVFZmZlY3QoKCkgPT4gdW50cmFjayhmbikpO1xufVxuZnVuY3Rpb24gb25DbGVhbnVwKGZuKSB7XG4gIGlmIChPd25lciA9PT0gbnVsbCk7XG4gIGVsc2UgaWYgKE93bmVyLmNsZWFudXBzID09PSBudWxsKSBPd25lci5jbGVhbnVwcyA9IFtmbl07XG4gIGVsc2UgT3duZXIuY2xlYW51cHMucHVzaChmbik7XG4gIHJldHVybiBmbjtcbn1cbmZ1bmN0aW9uIGdldExpc3RlbmVyKCkge1xuICByZXR1cm4gTGlzdGVuZXI7XG59XG5mdW5jdGlvbiBzdGFydFRyYW5zaXRpb24oZm4pIHtcbiAgY29uc3QgbCA9IExpc3RlbmVyO1xuICBjb25zdCBvID0gT3duZXI7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICBMaXN0ZW5lciA9IGw7XG4gICAgT3duZXIgPSBvO1xuICAgIGxldCB0O1xuICAgIHJ1blVwZGF0ZXMoZm4sIGZhbHNlKTtcbiAgICBMaXN0ZW5lciA9IE93bmVyID0gbnVsbDtcbiAgICByZXR1cm4gdCA/IHQuZG9uZSA6IHVuZGVmaW5lZDtcbiAgfSk7XG59XG5jb25zdCBbdHJhbnNQZW5kaW5nLCBzZXRUcmFuc1BlbmRpbmddID0gLypAX19QVVJFX18qLyBjcmVhdGVTaWduYWwoZmFsc2UpO1xuZnVuY3Rpb24gdXNlVHJhbnNpdGlvbigpIHtcbiAgcmV0dXJuIFt0cmFuc1BlbmRpbmcsIHN0YXJ0VHJhbnNpdGlvbl07XG59XG5mdW5jdGlvbiBjaGlsZHJlbihmbikge1xuICBjb25zdCBjaGlsZHJlbiA9IGNyZWF0ZU1lbW8oZm4pO1xuICBjb25zdCBtZW1vID0gY3JlYXRlTWVtbygoKSA9PiByZXNvbHZlQ2hpbGRyZW4oY2hpbGRyZW4oKSkpO1xuICBtZW1vLnRvQXJyYXkgPSAoKSA9PiB7XG4gICAgY29uc3QgYyA9IG1lbW8oKTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjKSA/IGMgOiBjICE9IG51bGwgPyBbY10gOiBbXTtcbiAgfTtcbiAgcmV0dXJuIG1lbW87XG59XG5mdW5jdGlvbiByZWFkU2lnbmFsKCkge1xuICBpZiAodGhpcy5zb3VyY2VzICYmICh0aGlzLnN0YXRlKSkge1xuICAgIGlmICgodGhpcy5zdGF0ZSkgPT09IFNUQUxFKSB1cGRhdGVDb21wdXRhdGlvbih0aGlzKTtcbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHVwZGF0ZXMgPSBVcGRhdGVzO1xuICAgICAgVXBkYXRlcyA9IG51bGw7XG4gICAgICBydW5VcGRhdGVzKCgpID0+IGxvb2tVcHN0cmVhbSh0aGlzKSwgZmFsc2UpO1xuICAgICAgVXBkYXRlcyA9IHVwZGF0ZXM7XG4gICAgfVxuICB9XG4gIGlmIChMaXN0ZW5lcikge1xuICAgIGNvbnN0IHNTbG90ID0gdGhpcy5vYnNlcnZlcnMgPyB0aGlzLm9ic2VydmVycy5sZW5ndGggOiAwO1xuICAgIGlmICghTGlzdGVuZXIuc291cmNlcykge1xuICAgICAgTGlzdGVuZXIuc291cmNlcyA9IFt0aGlzXTtcbiAgICAgIExpc3RlbmVyLnNvdXJjZVNsb3RzID0gW3NTbG90XTtcbiAgICB9IGVsc2Uge1xuICAgICAgTGlzdGVuZXIuc291cmNlcy5wdXNoKHRoaXMpO1xuICAgICAgTGlzdGVuZXIuc291cmNlU2xvdHMucHVzaChzU2xvdCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5vYnNlcnZlcnMpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW0xpc3RlbmVyXTtcbiAgICAgIHRoaXMub2JzZXJ2ZXJTbG90cyA9IFtMaXN0ZW5lci5zb3VyY2VzLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9ic2VydmVycy5wdXNoKExpc3RlbmVyKTtcbiAgICAgIHRoaXMub2JzZXJ2ZXJTbG90cy5wdXNoKExpc3RlbmVyLnNvdXJjZXMubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzLnZhbHVlO1xufVxuZnVuY3Rpb24gd3JpdGVTaWduYWwobm9kZSwgdmFsdWUsIGlzQ29tcCkge1xuICBsZXQgY3VycmVudCA9XG4gICAgbm9kZS52YWx1ZTtcbiAgaWYgKCFub2RlLmNvbXBhcmF0b3IgfHwgIW5vZGUuY29tcGFyYXRvcihjdXJyZW50LCB2YWx1ZSkpIHtcbiAgICBub2RlLnZhbHVlID0gdmFsdWU7XG4gICAgaWYgKG5vZGUub2JzZXJ2ZXJzICYmIG5vZGUub2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgcnVuVXBkYXRlcygoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5vYnNlcnZlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBvID0gbm9kZS5vYnNlcnZlcnNbaV07XG4gICAgICAgICAgY29uc3QgVHJhbnNpdGlvblJ1bm5pbmcgPSBUcmFuc2l0aW9uJDEgJiYgVHJhbnNpdGlvbiQxLnJ1bm5pbmc7XG4gICAgICAgICAgaWYgKFRyYW5zaXRpb25SdW5uaW5nICYmIFRyYW5zaXRpb24kMS5kaXNwb3NlZC5oYXMobykpIDtcbiAgICAgICAgICBpZiAoVHJhbnNpdGlvblJ1bm5pbmcgPyAhby50U3RhdGUgOiAhby5zdGF0ZSkge1xuICAgICAgICAgICAgaWYgKG8ucHVyZSkgVXBkYXRlcy5wdXNoKG8pO1xuICAgICAgICAgICAgZWxzZSBFZmZlY3RzLnB1c2gobyk7XG4gICAgICAgICAgICBpZiAoby5vYnNlcnZlcnMpIG1hcmtEb3duc3RyZWFtKG8pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIVRyYW5zaXRpb25SdW5uaW5nKSBvLnN0YXRlID0gU1RBTEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFVwZGF0ZXMubGVuZ3RoID4gMTBlNSkge1xuICAgICAgICAgIFVwZGF0ZXMgPSBbXTtcbiAgICAgICAgICBpZiAoSVNfREVWKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiB1cGRhdGVDb21wdXRhdGlvbihub2RlKSB7XG4gIGlmICghbm9kZS5mbikgcmV0dXJuO1xuICBjbGVhbk5vZGUobm9kZSk7XG4gIGNvbnN0IHRpbWUgPSBFeGVjQ291bnQ7XG4gIHJ1bkNvbXB1dGF0aW9uKFxuICAgIG5vZGUsXG4gICAgbm9kZS52YWx1ZSxcbiAgICB0aW1lXG4gICk7XG59XG5mdW5jdGlvbiBydW5Db21wdXRhdGlvbihub2RlLCB2YWx1ZSwgdGltZSkge1xuICBsZXQgbmV4dFZhbHVlO1xuICBjb25zdCBvd25lciA9IE93bmVyLFxuICAgIGxpc3RlbmVyID0gTGlzdGVuZXI7XG4gIExpc3RlbmVyID0gT3duZXIgPSBub2RlO1xuICB0cnkge1xuICAgIG5leHRWYWx1ZSA9IG5vZGUuZm4odmFsdWUpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAobm9kZS5wdXJlKSB7XG4gICAgICB7XG4gICAgICAgIG5vZGUuc3RhdGUgPSBTVEFMRTtcbiAgICAgICAgbm9kZS5vd25lZCAmJiBub2RlLm93bmVkLmZvckVhY2goY2xlYW5Ob2RlKTtcbiAgICAgICAgbm9kZS5vd25lZCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG5vZGUudXBkYXRlZEF0ID0gdGltZSArIDE7XG4gICAgcmV0dXJuIGhhbmRsZUVycm9yKGVycik7XG4gIH0gZmluYWxseSB7XG4gICAgTGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICBPd25lciA9IG93bmVyO1xuICB9XG4gIGlmICghbm9kZS51cGRhdGVkQXQgfHwgbm9kZS51cGRhdGVkQXQgPD0gdGltZSkge1xuICAgIGlmIChub2RlLnVwZGF0ZWRBdCAhPSBudWxsICYmIFwib2JzZXJ2ZXJzXCIgaW4gbm9kZSkge1xuICAgICAgd3JpdGVTaWduYWwobm9kZSwgbmV4dFZhbHVlKTtcbiAgICB9IGVsc2Ugbm9kZS52YWx1ZSA9IG5leHRWYWx1ZTtcbiAgICBub2RlLnVwZGF0ZWRBdCA9IHRpbWU7XG4gIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZUNvbXB1dGF0aW9uKGZuLCBpbml0LCBwdXJlLCBzdGF0ZSA9IFNUQUxFLCBvcHRpb25zKSB7XG4gIGNvbnN0IGMgPSB7XG4gICAgZm4sXG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIHVwZGF0ZWRBdDogbnVsbCxcbiAgICBvd25lZDogbnVsbCxcbiAgICBzb3VyY2VzOiBudWxsLFxuICAgIHNvdXJjZVNsb3RzOiBudWxsLFxuICAgIGNsZWFudXBzOiBudWxsLFxuICAgIHZhbHVlOiBpbml0LFxuICAgIG93bmVyOiBPd25lcixcbiAgICBjb250ZXh0OiBPd25lciA/IE93bmVyLmNvbnRleHQgOiBudWxsLFxuICAgIHB1cmVcbiAgfTtcbiAgaWYgKE93bmVyID09PSBudWxsKTtcbiAgZWxzZSBpZiAoT3duZXIgIT09IFVOT1dORUQpIHtcbiAgICB7XG4gICAgICBpZiAoIU93bmVyLm93bmVkKSBPd25lci5vd25lZCA9IFtjXTtcbiAgICAgIGVsc2UgT3duZXIub3duZWQucHVzaChjKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGM7XG59XG5mdW5jdGlvbiBydW5Ub3Aobm9kZSkge1xuICBpZiAoKG5vZGUuc3RhdGUpID09PSAwKSByZXR1cm47XG4gIGlmICgobm9kZS5zdGF0ZSkgPT09IFBFTkRJTkcpIHJldHVybiBsb29rVXBzdHJlYW0obm9kZSk7XG4gIGlmIChub2RlLnN1c3BlbnNlICYmIHVudHJhY2sobm9kZS5zdXNwZW5zZS5pbkZhbGxiYWNrKSkgcmV0dXJuIG5vZGUuc3VzcGVuc2UuZWZmZWN0cy5wdXNoKG5vZGUpO1xuICBjb25zdCBhbmNlc3RvcnMgPSBbbm9kZV07XG4gIHdoaWxlICgobm9kZSA9IG5vZGUub3duZXIpICYmICghbm9kZS51cGRhdGVkQXQgfHwgbm9kZS51cGRhdGVkQXQgPCBFeGVjQ291bnQpKSB7XG4gICAgaWYgKG5vZGUuc3RhdGUpIGFuY2VzdG9ycy5wdXNoKG5vZGUpO1xuICB9XG4gIGZvciAobGV0IGkgPSBhbmNlc3RvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBub2RlID0gYW5jZXN0b3JzW2ldO1xuICAgIGlmICgobm9kZS5zdGF0ZSkgPT09IFNUQUxFKSB7XG4gICAgICB1cGRhdGVDb21wdXRhdGlvbihub2RlKTtcbiAgICB9IGVsc2UgaWYgKChub2RlLnN0YXRlKSA9PT0gUEVORElORykge1xuICAgICAgY29uc3QgdXBkYXRlcyA9IFVwZGF0ZXM7XG4gICAgICBVcGRhdGVzID0gbnVsbDtcbiAgICAgIHJ1blVwZGF0ZXMoKCkgPT4gbG9va1Vwc3RyZWFtKG5vZGUsIGFuY2VzdG9yc1swXSksIGZhbHNlKTtcbiAgICAgIFVwZGF0ZXMgPSB1cGRhdGVzO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gcnVuVXBkYXRlcyhmbiwgaW5pdCkge1xuICBpZiAoVXBkYXRlcykgcmV0dXJuIGZuKCk7XG4gIGxldCB3YWl0ID0gZmFsc2U7XG4gIGlmICghaW5pdCkgVXBkYXRlcyA9IFtdO1xuICBpZiAoRWZmZWN0cykgd2FpdCA9IHRydWU7XG4gIGVsc2UgRWZmZWN0cyA9IFtdO1xuICBFeGVjQ291bnQrKztcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBmbigpO1xuICAgIGNvbXBsZXRlVXBkYXRlcyh3YWl0KTtcbiAgICByZXR1cm4gcmVzO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoIXdhaXQpIEVmZmVjdHMgPSBudWxsO1xuICAgIFVwZGF0ZXMgPSBudWxsO1xuICAgIGhhbmRsZUVycm9yKGVycik7XG4gIH1cbn1cbmZ1bmN0aW9uIGNvbXBsZXRlVXBkYXRlcyh3YWl0KSB7XG4gIGlmIChVcGRhdGVzKSB7XG4gICAgcnVuUXVldWUoVXBkYXRlcyk7XG4gICAgVXBkYXRlcyA9IG51bGw7XG4gIH1cbiAgaWYgKHdhaXQpIHJldHVybjtcbiAgY29uc3QgZSA9IEVmZmVjdHM7XG4gIEVmZmVjdHMgPSBudWxsO1xuICBpZiAoZS5sZW5ndGgpIHJ1blVwZGF0ZXMoKCkgPT4gcnVuRWZmZWN0cyhlKSwgZmFsc2UpO1xufVxuZnVuY3Rpb24gcnVuUXVldWUocXVldWUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykgcnVuVG9wKHF1ZXVlW2ldKTtcbn1cbmZ1bmN0aW9uIHJ1blVzZXJFZmZlY3RzKHF1ZXVlKSB7XG4gIGxldCBpLFxuICAgIHVzZXJMZW5ndGggPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBlID0gcXVldWVbaV07XG4gICAgaWYgKCFlLnVzZXIpIHJ1blRvcChlKTtcbiAgICBlbHNlIHF1ZXVlW3VzZXJMZW5ndGgrK10gPSBlO1xuICB9XG4gIGZvciAoaSA9IDA7IGkgPCB1c2VyTGVuZ3RoOyBpKyspIHJ1blRvcChxdWV1ZVtpXSk7XG59XG5mdW5jdGlvbiBsb29rVXBzdHJlYW0obm9kZSwgaWdub3JlKSB7XG4gIG5vZGUuc3RhdGUgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuc291cmNlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IG5vZGUuc291cmNlc1tpXTtcbiAgICBpZiAoc291cmNlLnNvdXJjZXMpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gc291cmNlLnN0YXRlO1xuICAgICAgaWYgKHN0YXRlID09PSBTVEFMRSkge1xuICAgICAgICBpZiAoc291cmNlICE9PSBpZ25vcmUgJiYgKCFzb3VyY2UudXBkYXRlZEF0IHx8IHNvdXJjZS51cGRhdGVkQXQgPCBFeGVjQ291bnQpKVxuICAgICAgICAgIHJ1blRvcChzb3VyY2UpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gUEVORElORykgbG9va1Vwc3RyZWFtKHNvdXJjZSwgaWdub3JlKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIG1hcmtEb3duc3RyZWFtKG5vZGUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLm9ic2VydmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IG8gPSBub2RlLm9ic2VydmVyc1tpXTtcbiAgICBpZiAoIW8uc3RhdGUpIHtcbiAgICAgIG8uc3RhdGUgPSBQRU5ESU5HO1xuICAgICAgaWYgKG8ucHVyZSkgVXBkYXRlcy5wdXNoKG8pO1xuICAgICAgZWxzZSBFZmZlY3RzLnB1c2gobyk7XG4gICAgICBvLm9ic2VydmVycyAmJiBtYXJrRG93bnN0cmVhbShvKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGNsZWFuTm9kZShub2RlKSB7XG4gIGxldCBpO1xuICBpZiAobm9kZS5zb3VyY2VzKSB7XG4gICAgd2hpbGUgKG5vZGUuc291cmNlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IG5vZGUuc291cmNlcy5wb3AoKSxcbiAgICAgICAgaW5kZXggPSBub2RlLnNvdXJjZVNsb3RzLnBvcCgpLFxuICAgICAgICBvYnMgPSBzb3VyY2Uub2JzZXJ2ZXJzO1xuICAgICAgaWYgKG9icyAmJiBvYnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IG4gPSBvYnMucG9wKCksXG4gICAgICAgICAgcyA9IHNvdXJjZS5vYnNlcnZlclNsb3RzLnBvcCgpO1xuICAgICAgICBpZiAoaW5kZXggPCBvYnMubGVuZ3RoKSB7XG4gICAgICAgICAgbi5zb3VyY2VTbG90c1tzXSA9IGluZGV4O1xuICAgICAgICAgIG9ic1tpbmRleF0gPSBuO1xuICAgICAgICAgIHNvdXJjZS5vYnNlcnZlclNsb3RzW2luZGV4XSA9IHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKG5vZGUudE93bmVkKSB7XG4gICAgZm9yIChpID0gbm9kZS50T3duZWQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGNsZWFuTm9kZShub2RlLnRPd25lZFtpXSk7XG4gICAgZGVsZXRlIG5vZGUudE93bmVkO1xuICB9XG4gIGlmIChub2RlLm93bmVkKSB7XG4gICAgZm9yIChpID0gbm9kZS5vd25lZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgY2xlYW5Ob2RlKG5vZGUub3duZWRbaV0pO1xuICAgIG5vZGUub3duZWQgPSBudWxsO1xuICB9XG4gIGlmIChub2RlLmNsZWFudXBzKSB7XG4gICAgZm9yIChpID0gbm9kZS5jbGVhbnVwcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgbm9kZS5jbGVhbnVwc1tpXSgpO1xuICAgIG5vZGUuY2xlYW51cHMgPSBudWxsO1xuICB9XG4gIG5vZGUuc3RhdGUgPSAwO1xufVxuZnVuY3Rpb24gY2FzdEVycm9yKGVycikge1xuICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiBlcnI7XG4gIHJldHVybiBuZXcgRXJyb3IodHlwZW9mIGVyciA9PT0gXCJzdHJpbmdcIiA/IGVyciA6IFwiVW5rbm93biBlcnJvclwiLCB7XG4gICAgY2F1c2U6IGVyclxuICB9KTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKGVyciwgb3duZXIgPSBPd25lcikge1xuICBjb25zdCBlcnJvciA9IGNhc3RFcnJvcihlcnIpO1xuICB0aHJvdyBlcnJvcjtcbn1cbmZ1bmN0aW9uIHJlc29sdmVDaGlsZHJlbihjaGlsZHJlbikge1xuICBpZiAodHlwZW9mIGNoaWxkcmVuID09PSBcImZ1bmN0aW9uXCIgJiYgIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJlc29sdmVDaGlsZHJlbihjaGlsZHJlbigpKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc29sdmVDaGlsZHJlbihjaGlsZHJlbltpXSk7XG4gICAgICBBcnJheS5pc0FycmF5KHJlc3VsdCkgPyByZXN1bHRzLnB1c2guYXBwbHkocmVzdWx0cywgcmVzdWx0KSA6IHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmNvbnN0IEZBTExCQUNLID0gU3ltYm9sKFwiZmFsbGJhY2tcIik7XG5mdW5jdGlvbiBkaXNwb3NlKGQpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSsrKSBkW2ldKCk7XG59XG5mdW5jdGlvbiBtYXBBcnJheShsaXN0LCBtYXBGbiwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBpdGVtcyA9IFtdLFxuICAgIG1hcHBlZCA9IFtdLFxuICAgIGRpc3Bvc2VycyA9IFtdLFxuICAgIGxlbiA9IDAsXG4gICAgaW5kZXhlcyA9IG1hcEZuLmxlbmd0aCA+IDEgPyBbXSA6IG51bGw7XG4gIG9uQ2xlYW51cCgoKSA9PiBkaXNwb3NlKGRpc3Bvc2VycykpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCBuZXdJdGVtcyA9IGxpc3QoKSB8fCBbXSxcbiAgICAgIG5ld0xlbiA9IG5ld0l0ZW1zLmxlbmd0aCxcbiAgICAgIGksXG4gICAgICBqO1xuICAgIG5ld0l0ZW1zWyRUUkFDS107XG4gICAgcmV0dXJuIHVudHJhY2soKCkgPT4ge1xuICAgICAgbGV0IG5ld0luZGljZXMsIG5ld0luZGljZXNOZXh0LCB0ZW1wLCB0ZW1wZGlzcG9zZXJzLCB0ZW1wSW5kZXhlcywgc3RhcnQsIGVuZCwgbmV3RW5kLCBpdGVtO1xuICAgICAgaWYgKG5ld0xlbiA9PT0gMCkge1xuICAgICAgICBpZiAobGVuICE9PSAwKSB7XG4gICAgICAgICAgZGlzcG9zZShkaXNwb3NlcnMpO1xuICAgICAgICAgIGRpc3Bvc2VycyA9IFtdO1xuICAgICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgICAgbWFwcGVkID0gW107XG4gICAgICAgICAgbGVuID0gMDtcbiAgICAgICAgICBpbmRleGVzICYmIChpbmRleGVzID0gW10pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmZhbGxiYWNrKSB7XG4gICAgICAgICAgaXRlbXMgPSBbRkFMTEJBQ0tdO1xuICAgICAgICAgIG1hcHBlZFswXSA9IGNyZWF0ZVJvb3QoZGlzcG9zZXIgPT4ge1xuICAgICAgICAgICAgZGlzcG9zZXJzWzBdID0gZGlzcG9zZXI7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mYWxsYmFjaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxlbiA9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIG1hcHBlZCA9IG5ldyBBcnJheShuZXdMZW4pO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgbmV3TGVuOyBqKyspIHtcbiAgICAgICAgICBpdGVtc1tqXSA9IG5ld0l0ZW1zW2pdO1xuICAgICAgICAgIG1hcHBlZFtqXSA9IGNyZWF0ZVJvb3QobWFwcGVyKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBuZXdMZW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZW1wID0gbmV3IEFycmF5KG5ld0xlbik7XG4gICAgICAgIHRlbXBkaXNwb3NlcnMgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgICAgICAgaW5kZXhlcyAmJiAodGVtcEluZGV4ZXMgPSBuZXcgQXJyYXkobmV3TGVuKSk7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgc3RhcnQgPSAwLCBlbmQgPSBNYXRoLm1pbihsZW4sIG5ld0xlbik7XG4gICAgICAgICAgc3RhcnQgPCBlbmQgJiYgaXRlbXNbc3RhcnRdID09PSBuZXdJdGVtc1tzdGFydF07XG4gICAgICAgICAgc3RhcnQrK1xuICAgICAgICApO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIGVuZCA9IGxlbiAtIDEsIG5ld0VuZCA9IG5ld0xlbiAtIDE7XG4gICAgICAgICAgZW5kID49IHN0YXJ0ICYmIG5ld0VuZCA+PSBzdGFydCAmJiBpdGVtc1tlbmRdID09PSBuZXdJdGVtc1tuZXdFbmRdO1xuICAgICAgICAgIGVuZC0tLCBuZXdFbmQtLVxuICAgICAgICApIHtcbiAgICAgICAgICB0ZW1wW25ld0VuZF0gPSBtYXBwZWRbZW5kXTtcbiAgICAgICAgICB0ZW1wZGlzcG9zZXJzW25ld0VuZF0gPSBkaXNwb3NlcnNbZW5kXTtcbiAgICAgICAgICBpbmRleGVzICYmICh0ZW1wSW5kZXhlc1tuZXdFbmRdID0gaW5kZXhlc1tlbmRdKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdJbmRpY2VzID0gbmV3IE1hcCgpO1xuICAgICAgICBuZXdJbmRpY2VzTmV4dCA9IG5ldyBBcnJheShuZXdFbmQgKyAxKTtcbiAgICAgICAgZm9yIChqID0gbmV3RW5kOyBqID49IHN0YXJ0OyBqLS0pIHtcbiAgICAgICAgICBpdGVtID0gbmV3SXRlbXNbal07XG4gICAgICAgICAgaSA9IG5ld0luZGljZXMuZ2V0KGl0ZW0pO1xuICAgICAgICAgIG5ld0luZGljZXNOZXh0W2pdID0gaSA9PT0gdW5kZWZpbmVkID8gLTEgOiBpO1xuICAgICAgICAgIG5ld0luZGljZXMuc2V0KGl0ZW0sIGopO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgICAgIGogPSBuZXdJbmRpY2VzLmdldChpdGVtKTtcbiAgICAgICAgICBpZiAoaiAhPT0gdW5kZWZpbmVkICYmIGogIT09IC0xKSB7XG4gICAgICAgICAgICB0ZW1wW2pdID0gbWFwcGVkW2ldO1xuICAgICAgICAgICAgdGVtcGRpc3Bvc2Vyc1tqXSA9IGRpc3Bvc2Vyc1tpXTtcbiAgICAgICAgICAgIGluZGV4ZXMgJiYgKHRlbXBJbmRleGVzW2pdID0gaW5kZXhlc1tpXSk7XG4gICAgICAgICAgICBqID0gbmV3SW5kaWNlc05leHRbal07XG4gICAgICAgICAgICBuZXdJbmRpY2VzLnNldChpdGVtLCBqKTtcbiAgICAgICAgICB9IGVsc2UgZGlzcG9zZXJzW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChqID0gc3RhcnQ7IGogPCBuZXdMZW47IGorKykge1xuICAgICAgICAgIGlmIChqIGluIHRlbXApIHtcbiAgICAgICAgICAgIG1hcHBlZFtqXSA9IHRlbXBbal07XG4gICAgICAgICAgICBkaXNwb3NlcnNbal0gPSB0ZW1wZGlzcG9zZXJzW2pdO1xuICAgICAgICAgICAgaWYgKGluZGV4ZXMpIHtcbiAgICAgICAgICAgICAgaW5kZXhlc1tqXSA9IHRlbXBJbmRleGVzW2pdO1xuICAgICAgICAgICAgICBpbmRleGVzW2pdKGopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBtYXBwZWRbal0gPSBjcmVhdGVSb290KG1hcHBlcik7XG4gICAgICAgIH1cbiAgICAgICAgbWFwcGVkID0gbWFwcGVkLnNsaWNlKDAsIChsZW4gPSBuZXdMZW4pKTtcbiAgICAgICAgaXRlbXMgPSBuZXdJdGVtcy5zbGljZSgwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBwZWQ7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gbWFwcGVyKGRpc3Bvc2VyKSB7XG4gICAgICBkaXNwb3NlcnNbal0gPSBkaXNwb3NlcjtcbiAgICAgIGlmIChpbmRleGVzKSB7XG4gICAgICAgIGNvbnN0IFtzLCBzZXRdID0gY3JlYXRlU2lnbmFsKGopO1xuICAgICAgICBpbmRleGVzW2pdID0gc2V0O1xuICAgICAgICByZXR1cm4gbWFwRm4obmV3SXRlbXNbal0sIHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcEZuKG5ld0l0ZW1zW2pdKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ29tcCwgcHJvcHMpIHtcbiAgcmV0dXJuIHVudHJhY2soKCkgPT4gQ29tcChwcm9wcyB8fCB7fSkpO1xufVxuXG5jb25zdCBuYXJyb3dlZEVycm9yID0gbmFtZSA9PiBgU3RhbGUgcmVhZCBmcm9tIDwke25hbWV9Pi5gO1xuZnVuY3Rpb24gRm9yKHByb3BzKSB7XG4gIGNvbnN0IGZhbGxiYWNrID0gXCJmYWxsYmFja1wiIGluIHByb3BzICYmIHtcbiAgICBmYWxsYmFjazogKCkgPT4gcHJvcHMuZmFsbGJhY2tcbiAgfTtcbiAgcmV0dXJuIGNyZWF0ZU1lbW8obWFwQXJyYXkoKCkgPT4gcHJvcHMuZWFjaCwgcHJvcHMuY2hpbGRyZW4sIGZhbGxiYWNrIHx8IHVuZGVmaW5lZCkpO1xufVxuZnVuY3Rpb24gU2hvdyhwcm9wcykge1xuICBjb25zdCBrZXllZCA9IHByb3BzLmtleWVkO1xuICBjb25zdCBjb25kaXRpb25WYWx1ZSA9IGNyZWF0ZU1lbW8oKCkgPT4gcHJvcHMud2hlbiwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICBjb25zdCBjb25kaXRpb24gPSBrZXllZFxuICAgID8gY29uZGl0aW9uVmFsdWVcbiAgICA6IGNyZWF0ZU1lbW8oY29uZGl0aW9uVmFsdWUsIHVuZGVmaW5lZCwge1xuICAgICAgICBlcXVhbHM6IChhLCBiKSA9PiAhYSA9PT0gIWJcbiAgICAgIH0pO1xuICByZXR1cm4gY3JlYXRlTWVtbyhcbiAgICAoKSA9PiB7XG4gICAgICBjb25zdCBjID0gY29uZGl0aW9uKCk7XG4gICAgICBpZiAoYykge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHByb3BzLmNoaWxkcmVuO1xuICAgICAgICBjb25zdCBmbiA9IHR5cGVvZiBjaGlsZCA9PT0gXCJmdW5jdGlvblwiICYmIGNoaWxkLmxlbmd0aCA+IDA7XG4gICAgICAgIHJldHVybiBmblxuICAgICAgICAgID8gdW50cmFjaygoKSA9PlxuICAgICAgICAgICAgICBjaGlsZChcbiAgICAgICAgICAgICAgICBrZXllZFxuICAgICAgICAgICAgICAgICAgPyBjXG4gICAgICAgICAgICAgICAgICA6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVudHJhY2soY29uZGl0aW9uKSkgdGhyb3cgbmFycm93ZWRFcnJvcihcIlNob3dcIik7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmRpdGlvblZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogY2hpbGQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvcHMuZmFsbGJhY2s7XG4gICAgfSxcbiAgICB1bmRlZmluZWQsXG4gICAgdW5kZWZpbmVkXG4gICk7XG59XG5mdW5jdGlvbiBTd2l0Y2gocHJvcHMpIHtcbiAgY29uc3QgY2hzID0gY2hpbGRyZW4oKCkgPT4gcHJvcHMuY2hpbGRyZW4pO1xuICBjb25zdCBzd2l0Y2hGdW5jID0gY3JlYXRlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY2ggPSBjaHMoKTtcbiAgICBjb25zdCBtcHMgPSBBcnJheS5pc0FycmF5KGNoKSA/IGNoIDogW2NoXTtcbiAgICBsZXQgZnVuYyA9ICgpID0+IHVuZGVmaW5lZDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1wcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5kZXggPSBpO1xuICAgICAgY29uc3QgbXAgPSBtcHNbaV07XG4gICAgICBjb25zdCBwcmV2RnVuYyA9IGZ1bmM7XG4gICAgICBjb25zdCBjb25kaXRpb25WYWx1ZSA9IGNyZWF0ZU1lbW8oXG4gICAgICAgICgpID0+IChwcmV2RnVuYygpID8gdW5kZWZpbmVkIDogbXAud2hlbiksXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkXG4gICAgICApO1xuICAgICAgY29uc3QgY29uZGl0aW9uID0gbXAua2V5ZWRcbiAgICAgICAgPyBjb25kaXRpb25WYWx1ZVxuICAgICAgICA6IGNyZWF0ZU1lbW8oY29uZGl0aW9uVmFsdWUsIHVuZGVmaW5lZCwge1xuICAgICAgICAgICAgZXF1YWxzOiAoYSwgYikgPT4gIWEgPT09ICFiXG4gICAgICAgICAgfSk7XG4gICAgICBmdW5jID0gKCkgPT4gcHJldkZ1bmMoKSB8fCAoY29uZGl0aW9uKCkgPyBbaW5kZXgsIGNvbmRpdGlvblZhbHVlLCBtcF0gOiB1bmRlZmluZWQpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbiAgfSk7XG4gIHJldHVybiBjcmVhdGVNZW1vKFxuICAgICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbCA9IHN3aXRjaEZ1bmMoKSgpO1xuICAgICAgaWYgKCFzZWwpIHJldHVybiBwcm9wcy5mYWxsYmFjaztcbiAgICAgIGNvbnN0IFtpbmRleCwgY29uZGl0aW9uVmFsdWUsIG1wXSA9IHNlbDtcbiAgICAgIGNvbnN0IGNoaWxkID0gbXAuY2hpbGRyZW47XG4gICAgICBjb25zdCBmbiA9IHR5cGVvZiBjaGlsZCA9PT0gXCJmdW5jdGlvblwiICYmIGNoaWxkLmxlbmd0aCA+IDA7XG4gICAgICByZXR1cm4gZm5cbiAgICAgICAgPyB1bnRyYWNrKCgpID0+XG4gICAgICAgICAgICBjaGlsZChcbiAgICAgICAgICAgICAgbXAua2V5ZWRcbiAgICAgICAgICAgICAgICA/IGNvbmRpdGlvblZhbHVlKClcbiAgICAgICAgICAgICAgICA6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVudHJhY2soc3dpdGNoRnVuYykoKT8uWzBdICE9PSBpbmRleCkgdGhyb3cgbmFycm93ZWRFcnJvcihcIk1hdGNoXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZGl0aW9uVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIDogY2hpbGQ7XG4gICAgfSxcbiAgICB1bmRlZmluZWQsXG4gICAgdW5kZWZpbmVkXG4gICk7XG59XG5mdW5jdGlvbiBNYXRjaChwcm9wcykge1xuICByZXR1cm4gcHJvcHM7XG59XG5cbmZ1bmN0aW9uIHJlY29uY2lsZUFycmF5cyhwYXJlbnROb2RlLCBhLCBiKSB7XG4gIGxldCBiTGVuZ3RoID0gYi5sZW5ndGgsXG4gICAgYUVuZCA9IGEubGVuZ3RoLFxuICAgIGJFbmQgPSBiTGVuZ3RoLFxuICAgIGFTdGFydCA9IDAsXG4gICAgYlN0YXJ0ID0gMCxcbiAgICBhZnRlciA9IGFbYUVuZCAtIDFdLm5leHRTaWJsaW5nLFxuICAgIG1hcCA9IG51bGw7XG4gIHdoaWxlIChhU3RhcnQgPCBhRW5kIHx8IGJTdGFydCA8IGJFbmQpIHtcbiAgICBpZiAoYVthU3RhcnRdID09PSBiW2JTdGFydF0pIHtcbiAgICAgIGFTdGFydCsrO1xuICAgICAgYlN0YXJ0Kys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgd2hpbGUgKGFbYUVuZCAtIDFdID09PSBiW2JFbmQgLSAxXSkge1xuICAgICAgYUVuZC0tO1xuICAgICAgYkVuZC0tO1xuICAgIH1cbiAgICBpZiAoYUVuZCA9PT0gYVN0YXJ0KSB7XG4gICAgICBjb25zdCBub2RlID0gYkVuZCA8IGJMZW5ndGggPyAoYlN0YXJ0ID8gYltiU3RhcnQgLSAxXS5uZXh0U2libGluZyA6IGJbYkVuZCAtIGJTdGFydF0pIDogYWZ0ZXI7XG4gICAgICB3aGlsZSAoYlN0YXJ0IDwgYkVuZCkgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYltiU3RhcnQrK10sIG5vZGUpO1xuICAgIH0gZWxzZSBpZiAoYkVuZCA9PT0gYlN0YXJ0KSB7XG4gICAgICB3aGlsZSAoYVN0YXJ0IDwgYUVuZCkge1xuICAgICAgICBpZiAoIW1hcCB8fCAhbWFwLmhhcyhhW2FTdGFydF0pKSBhW2FTdGFydF0ucmVtb3ZlKCk7XG4gICAgICAgIGFTdGFydCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYVthU3RhcnRdID09PSBiW2JFbmQgLSAxXSAmJiBiW2JTdGFydF0gPT09IGFbYUVuZCAtIDFdKSB7XG4gICAgICBjb25zdCBub2RlID0gYVstLWFFbmRdLm5leHRTaWJsaW5nO1xuICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYltiU3RhcnQrK10sIGFbYVN0YXJ0KytdLm5leHRTaWJsaW5nKTtcbiAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGJbLS1iRW5kXSwgbm9kZSk7XG4gICAgICBhW2FFbmRdID0gYltiRW5kXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgbWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBsZXQgaSA9IGJTdGFydDtcbiAgICAgICAgd2hpbGUgKGkgPCBiRW5kKSBtYXAuc2V0KGJbaV0sIGkrKyk7XG4gICAgICB9XG4gICAgICBjb25zdCBpbmRleCA9IG1hcC5nZXQoYVthU3RhcnRdKTtcbiAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChiU3RhcnQgPCBpbmRleCAmJiBpbmRleCA8IGJFbmQpIHtcbiAgICAgICAgICBsZXQgaSA9IGFTdGFydCxcbiAgICAgICAgICAgIHNlcXVlbmNlID0gMSxcbiAgICAgICAgICAgIHQ7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGFFbmQgJiYgaSA8IGJFbmQpIHtcbiAgICAgICAgICAgIGlmICgodCA9IG1hcC5nZXQoYVtpXSkpID09IG51bGwgfHwgdCAhPT0gaW5kZXggKyBzZXF1ZW5jZSkgYnJlYWs7XG4gICAgICAgICAgICBzZXF1ZW5jZSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2VxdWVuY2UgPiBpbmRleCAtIGJTdGFydCkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGFbYVN0YXJ0XTtcbiAgICAgICAgICAgIHdoaWxlIChiU3RhcnQgPCBpbmRleCkgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYltiU3RhcnQrK10sIG5vZGUpO1xuICAgICAgICAgIH0gZWxzZSBwYXJlbnROb2RlLnJlcGxhY2VDaGlsZChiW2JTdGFydCsrXSwgYVthU3RhcnQrK10pO1xuICAgICAgICB9IGVsc2UgYVN0YXJ0Kys7XG4gICAgICB9IGVsc2UgYVthU3RhcnQrK10ucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0ICQkRVZFTlRTID0gXCJfJERYX0RFTEVHQVRFXCI7XG5mdW5jdGlvbiByZW5kZXIoY29kZSwgZWxlbWVudCwgaW5pdCwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBkaXNwb3NlcjtcbiAgY3JlYXRlUm9vdChkaXNwb3NlID0+IHtcbiAgICBkaXNwb3NlciA9IGRpc3Bvc2U7XG4gICAgZWxlbWVudCA9PT0gZG9jdW1lbnRcbiAgICAgID8gY29kZSgpXG4gICAgICA6IGluc2VydChlbGVtZW50LCBjb2RlKCksIGVsZW1lbnQuZmlyc3RDaGlsZCA/IG51bGwgOiB1bmRlZmluZWQsIGluaXQpO1xuICB9LCBvcHRpb25zLm93bmVyKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBkaXNwb3NlcigpO1xuICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xuICB9O1xufVxuZnVuY3Rpb24gdGVtcGxhdGUoaHRtbCwgaXNJbXBvcnROb2RlLCBpc1NWRywgaXNNYXRoTUwpIHtcbiAgbGV0IG5vZGU7XG4gIGNvbnN0IGNyZWF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICAgIHQuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gdC5jb250ZW50LmZpcnN0Q2hpbGQ7XG4gIH07XG4gIGNvbnN0IGZuID0gaXNJbXBvcnROb2RlXG4gICAgPyAoKSA9PiB1bnRyYWNrKCgpID0+IGRvY3VtZW50LmltcG9ydE5vZGUobm9kZSB8fCAobm9kZSA9IGNyZWF0ZSgpKSwgdHJ1ZSkpXG4gICAgOiAoKSA9PiAobm9kZSB8fCAobm9kZSA9IGNyZWF0ZSgpKSkuY2xvbmVOb2RlKHRydWUpO1xuICBmbi5jbG9uZU5vZGUgPSBmbjtcbiAgcmV0dXJuIGZuO1xufVxuZnVuY3Rpb24gZGVsZWdhdGVFdmVudHMoZXZlbnROYW1lcywgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgY29uc3QgZSA9IGRvY3VtZW50WyQkRVZFTlRTXSB8fCAoZG9jdW1lbnRbJCRFVkVOVFNdID0gbmV3IFNldCgpKTtcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBldmVudE5hbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IG5hbWUgPSBldmVudE5hbWVzW2ldO1xuICAgIGlmICghZS5oYXMobmFtZSkpIHtcbiAgICAgIGUuYWRkKG5hbWUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudEhhbmRsZXIpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gc2V0QXR0cmlidXRlKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgZWxzZSBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBjbGFzc05hbWUobm9kZSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIG5vZGUucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIGVsc2Ugbm9kZS5jbGFzc05hbWUgPSB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIobm9kZSwgbmFtZSwgaGFuZGxlciwgZGVsZWdhdGUpIHtcbiAge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgICBub2RlW2AkJCR7bmFtZX1gXSA9IGhhbmRsZXJbMF07XG4gICAgICBub2RlW2AkJCR7bmFtZX1EYXRhYF0gPSBoYW5kbGVyWzFdO1xuICAgIH0gZWxzZSBub2RlW2AkJCR7bmFtZX1gXSA9IGhhbmRsZXI7XG4gIH1cbn1cbmZ1bmN0aW9uIHN0eWxlKG5vZGUsIHZhbHVlLCBwcmV2KSB7XG4gIGlmICghdmFsdWUpIHJldHVybiBwcmV2ID8gc2V0QXR0cmlidXRlKG5vZGUsIFwic3R5bGVcIikgOiB2YWx1ZTtcbiAgY29uc3Qgbm9kZVN0eWxlID0gbm9kZS5zdHlsZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIChub2RlU3R5bGUuY3NzVGV4dCA9IHZhbHVlKTtcbiAgdHlwZW9mIHByZXYgPT09IFwic3RyaW5nXCIgJiYgKG5vZGVTdHlsZS5jc3NUZXh0ID0gcHJldiA9IHVuZGVmaW5lZCk7XG4gIHByZXYgfHwgKHByZXYgPSB7fSk7XG4gIHZhbHVlIHx8ICh2YWx1ZSA9IHt9KTtcbiAgbGV0IHYsIHM7XG4gIGZvciAocyBpbiBwcmV2KSB7XG4gICAgdmFsdWVbc10gPT0gbnVsbCAmJiBub2RlU3R5bGUucmVtb3ZlUHJvcGVydHkocyk7XG4gICAgZGVsZXRlIHByZXZbc107XG4gIH1cbiAgZm9yIChzIGluIHZhbHVlKSB7XG4gICAgdiA9IHZhbHVlW3NdO1xuICAgIGlmICh2ICE9PSBwcmV2W3NdKSB7XG4gICAgICBub2RlU3R5bGUuc2V0UHJvcGVydHkocywgdik7XG4gICAgICBwcmV2W3NdID0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZXY7XG59XG5mdW5jdGlvbiB1c2UoZm4sIGVsZW1lbnQsIGFyZykge1xuICByZXR1cm4gdW50cmFjaygoKSA9PiBmbihlbGVtZW50LCBhcmcpKTtcbn1cbmZ1bmN0aW9uIGluc2VydChwYXJlbnQsIGFjY2Vzc29yLCBtYXJrZXIsIGluaXRpYWwpIHtcbiAgaWYgKG1hcmtlciAhPT0gdW5kZWZpbmVkICYmICFpbml0aWFsKSBpbml0aWFsID0gW107XG4gIGlmICh0eXBlb2YgYWNjZXNzb3IgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGluc2VydEV4cHJlc3Npb24ocGFyZW50LCBhY2Nlc3NvciwgaW5pdGlhbCwgbWFya2VyKTtcbiAgY3JlYXRlUmVuZGVyRWZmZWN0KGN1cnJlbnQgPT4gaW5zZXJ0RXhwcmVzc2lvbihwYXJlbnQsIGFjY2Vzc29yKCksIGN1cnJlbnQsIG1hcmtlciksIGluaXRpYWwpO1xufVxuZnVuY3Rpb24gZXZlbnRIYW5kbGVyKGUpIHtcbiAgbGV0IG5vZGUgPSBlLnRhcmdldDtcbiAgY29uc3Qga2V5ID0gYCQkJHtlLnR5cGV9YDtcbiAgY29uc3Qgb3JpVGFyZ2V0ID0gZS50YXJnZXQ7XG4gIGNvbnN0IG9yaUN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gIGNvbnN0IHJldGFyZ2V0ID0gdmFsdWUgPT5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgXCJ0YXJnZXRcIiwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWVcbiAgICB9KTtcbiAgY29uc3QgaGFuZGxlTm9kZSA9ICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gbm9kZVtrZXldO1xuICAgIGlmIChoYW5kbGVyICYmICFub2RlLmRpc2FibGVkKSB7XG4gICAgICBjb25zdCBkYXRhID0gbm9kZVtgJHtrZXl9RGF0YWBdO1xuICAgICAgZGF0YSAhPT0gdW5kZWZpbmVkID8gaGFuZGxlci5jYWxsKG5vZGUsIGRhdGEsIGUpIDogaGFuZGxlci5jYWxsKG5vZGUsIGUpO1xuICAgICAgaWYgKGUuY2FuY2VsQnViYmxlKSByZXR1cm47XG4gICAgfVxuICAgIG5vZGUuaG9zdCAmJlxuICAgICAgdHlwZW9mIG5vZGUuaG9zdCAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgIW5vZGUuaG9zdC5fJGhvc3QgJiZcbiAgICAgIG5vZGUuY29udGFpbnMoZS50YXJnZXQpICYmXG4gICAgICByZXRhcmdldChub2RlLmhvc3QpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICBjb25zdCB3YWxrVXBUcmVlID0gKCkgPT4ge1xuICAgIHdoaWxlIChoYW5kbGVOb2RlKCkgJiYgKG5vZGUgPSBub2RlLl8kaG9zdCB8fCBub2RlLnBhcmVudE5vZGUgfHwgbm9kZS5ob3N0KSk7XG4gIH07XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCBcImN1cnJlbnRUYXJnZXRcIiwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gbm9kZSB8fCBkb2N1bWVudDtcbiAgICB9XG4gIH0pO1xuICBpZiAoZS5jb21wb3NlZFBhdGgpIHtcbiAgICBjb25zdCBwYXRoID0gZS5jb21wb3NlZFBhdGgoKTtcbiAgICByZXRhcmdldChwYXRoWzBdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICBub2RlID0gcGF0aFtpXTtcbiAgICAgIGlmICghaGFuZGxlTm9kZSgpKSBicmVhaztcbiAgICAgIGlmIChub2RlLl8kaG9zdCkge1xuICAgICAgICBub2RlID0gbm9kZS5fJGhvc3Q7XG4gICAgICAgIHdhbGtVcFRyZWUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5wYXJlbnROb2RlID09PSBvcmlDdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHdhbGtVcFRyZWUoKTtcbiAgcmV0YXJnZXQob3JpVGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIGluc2VydEV4cHJlc3Npb24ocGFyZW50LCB2YWx1ZSwgY3VycmVudCwgbWFya2VyLCB1bndyYXBBcnJheSkge1xuICB3aGlsZSAodHlwZW9mIGN1cnJlbnQgPT09IFwiZnVuY3Rpb25cIikgY3VycmVudCA9IGN1cnJlbnQoKTtcbiAgaWYgKHZhbHVlID09PSBjdXJyZW50KSByZXR1cm4gY3VycmVudDtcbiAgY29uc3QgdCA9IHR5cGVvZiB2YWx1ZSxcbiAgICBtdWx0aSA9IG1hcmtlciAhPT0gdW5kZWZpbmVkO1xuICBwYXJlbnQgPSAobXVsdGkgJiYgY3VycmVudFswXSAmJiBjdXJyZW50WzBdLnBhcmVudE5vZGUpIHx8IHBhcmVudDtcbiAgaWYgKHQgPT09IFwic3RyaW5nXCIgfHwgdCA9PT0gXCJudW1iZXJcIikge1xuICAgIGlmICh0ID09PSBcIm51bWJlclwiKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICBpZiAodmFsdWUgPT09IGN1cnJlbnQpIHJldHVybiBjdXJyZW50O1xuICAgIH1cbiAgICBpZiAobXVsdGkpIHtcbiAgICAgIGxldCBub2RlID0gY3VycmVudFswXTtcbiAgICAgIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgbm9kZS5kYXRhICE9PSB2YWx1ZSAmJiAobm9kZS5kYXRhID0gdmFsdWUpO1xuICAgICAgfSBlbHNlIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2YWx1ZSk7XG4gICAgICBjdXJyZW50ID0gY2xlYW5DaGlsZHJlbihwYXJlbnQsIGN1cnJlbnQsIG1hcmtlciwgbm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjdXJyZW50ICE9PSBcIlwiICYmIHR5cGVvZiBjdXJyZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGN1cnJlbnQgPSBwYXJlbnQuZmlyc3RDaGlsZC5kYXRhID0gdmFsdWU7XG4gICAgICB9IGVsc2UgY3VycmVudCA9IHBhcmVudC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH1cbiAgfSBlbHNlIGlmICh2YWx1ZSA9PSBudWxsIHx8IHQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgY3VycmVudCA9IGNsZWFuQ2hpbGRyZW4ocGFyZW50LCBjdXJyZW50LCBtYXJrZXIpO1xuICB9IGVsc2UgaWYgKHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNyZWF0ZVJlbmRlckVmZmVjdCgoKSA9PiB7XG4gICAgICBsZXQgdiA9IHZhbHVlKCk7XG4gICAgICB3aGlsZSAodHlwZW9mIHYgPT09IFwiZnVuY3Rpb25cIikgdiA9IHYoKTtcbiAgICAgIGN1cnJlbnQgPSBpbnNlcnRFeHByZXNzaW9uKHBhcmVudCwgdiwgY3VycmVudCwgbWFya2VyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKCkgPT4gY3VycmVudDtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgY29uc3QgY3VycmVudEFycmF5ID0gY3VycmVudCAmJiBBcnJheS5pc0FycmF5KGN1cnJlbnQpO1xuICAgIGlmIChub3JtYWxpemVJbmNvbWluZ0FycmF5KGFycmF5LCB2YWx1ZSwgY3VycmVudCwgdW53cmFwQXJyYXkpKSB7XG4gICAgICBjcmVhdGVSZW5kZXJFZmZlY3QoKCkgPT4gKGN1cnJlbnQgPSBpbnNlcnRFeHByZXNzaW9uKHBhcmVudCwgYXJyYXksIGN1cnJlbnQsIG1hcmtlciwgdHJ1ZSkpKTtcbiAgICAgIHJldHVybiAoKSA9PiBjdXJyZW50O1xuICAgIH1cbiAgICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICBjdXJyZW50ID0gY2xlYW5DaGlsZHJlbihwYXJlbnQsIGN1cnJlbnQsIG1hcmtlcik7XG4gICAgICBpZiAobXVsdGkpIHJldHVybiBjdXJyZW50O1xuICAgIH0gZWxzZSBpZiAoY3VycmVudEFycmF5KSB7XG4gICAgICBpZiAoY3VycmVudC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYXBwZW5kTm9kZXMocGFyZW50LCBhcnJheSwgbWFya2VyKTtcbiAgICAgIH0gZWxzZSByZWNvbmNpbGVBcnJheXMocGFyZW50LCBjdXJyZW50LCBhcnJheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQgJiYgY2xlYW5DaGlsZHJlbihwYXJlbnQpO1xuICAgICAgYXBwZW5kTm9kZXMocGFyZW50LCBhcnJheSk7XG4gICAgfVxuICAgIGN1cnJlbnQgPSBhcnJheTtcbiAgfSBlbHNlIGlmICh2YWx1ZS5ub2RlVHlwZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGN1cnJlbnQpKSB7XG4gICAgICBpZiAobXVsdGkpIHJldHVybiAoY3VycmVudCA9IGNsZWFuQ2hpbGRyZW4ocGFyZW50LCBjdXJyZW50LCBtYXJrZXIsIHZhbHVlKSk7XG4gICAgICBjbGVhbkNoaWxkcmVuKHBhcmVudCwgY3VycmVudCwgbnVsbCwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoY3VycmVudCA9PSBudWxsIHx8IGN1cnJlbnQgPT09IFwiXCIgfHwgIXBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodmFsdWUpO1xuICAgIH0gZWxzZSBwYXJlbnQucmVwbGFjZUNoaWxkKHZhbHVlLCBwYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgY3VycmVudCA9IHZhbHVlO1xuICB9IGVsc2U7XG4gIHJldHVybiBjdXJyZW50O1xufVxuZnVuY3Rpb24gbm9ybWFsaXplSW5jb21pbmdBcnJheShub3JtYWxpemVkLCBhcnJheSwgY3VycmVudCwgdW53cmFwKSB7XG4gIGxldCBkeW5hbWljID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGxldCBpdGVtID0gYXJyYXlbaV0sXG4gICAgICBwcmV2ID0gY3VycmVudCAmJiBjdXJyZW50W25vcm1hbGl6ZWQubGVuZ3RoXSxcbiAgICAgIHQ7XG4gICAgaWYgKGl0ZW0gPT0gbnVsbCB8fCBpdGVtID09PSB0cnVlIHx8IGl0ZW0gPT09IGZhbHNlKTtcbiAgICBlbHNlIGlmICgodCA9IHR5cGVvZiBpdGVtKSA9PT0gXCJvYmplY3RcIiAmJiBpdGVtLm5vZGVUeXBlKSB7XG4gICAgICBub3JtYWxpemVkLnB1c2goaXRlbSk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBkeW5hbWljID0gbm9ybWFsaXplSW5jb21pbmdBcnJheShub3JtYWxpemVkLCBpdGVtLCBwcmV2KSB8fCBkeW5hbWljO1xuICAgIH0gZWxzZSBpZiAodCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBpZiAodW53cmFwKSB7XG4gICAgICAgIHdoaWxlICh0eXBlb2YgaXRlbSA9PT0gXCJmdW5jdGlvblwiKSBpdGVtID0gaXRlbSgpO1xuICAgICAgICBkeW5hbWljID1cbiAgICAgICAgICBub3JtYWxpemVJbmNvbWluZ0FycmF5KFxuICAgICAgICAgICAgbm9ybWFsaXplZCxcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoaXRlbSkgPyBpdGVtIDogW2l0ZW1dLFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShwcmV2KSA/IHByZXYgOiBbcHJldl1cbiAgICAgICAgICApIHx8IGR5bmFtaWM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3JtYWxpemVkLnB1c2goaXRlbSk7XG4gICAgICAgIGR5bmFtaWMgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IFN0cmluZyhpdGVtKTtcbiAgICAgIGlmIChwcmV2ICYmIHByZXYubm9kZVR5cGUgPT09IDMgJiYgcHJldi5kYXRhID09PSB2YWx1ZSkgbm9ybWFsaXplZC5wdXNoKHByZXYpO1xuICAgICAgZWxzZSBub3JtYWxpemVkLnB1c2goZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR5bmFtaWM7XG59XG5mdW5jdGlvbiBhcHBlbmROb2RlcyhwYXJlbnQsIGFycmF5LCBtYXJrZXIgPSBudWxsKSB7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykgcGFyZW50Lmluc2VydEJlZm9yZShhcnJheVtpXSwgbWFya2VyKTtcbn1cbmZ1bmN0aW9uIGNsZWFuQ2hpbGRyZW4ocGFyZW50LCBjdXJyZW50LCBtYXJrZXIsIHJlcGxhY2VtZW50KSB7XG4gIGlmIChtYXJrZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIChwYXJlbnQudGV4dENvbnRlbnQgPSBcIlwiKTtcbiAgY29uc3Qgbm9kZSA9IHJlcGxhY2VtZW50IHx8IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICBpZiAoY3VycmVudC5sZW5ndGgpIHtcbiAgICBsZXQgaW5zZXJ0ZWQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gY3VycmVudC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgZWwgPSBjdXJyZW50W2ldO1xuICAgICAgaWYgKG5vZGUgIT09IGVsKSB7XG4gICAgICAgIGNvbnN0IGlzUGFyZW50ID0gZWwucGFyZW50Tm9kZSA9PT0gcGFyZW50O1xuICAgICAgICBpZiAoIWluc2VydGVkICYmICFpKVxuICAgICAgICAgIGlzUGFyZW50ID8gcGFyZW50LnJlcGxhY2VDaGlsZChub2RlLCBlbCkgOiBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIG1hcmtlcik7XG4gICAgICAgIGVsc2UgaXNQYXJlbnQgJiYgZWwucmVtb3ZlKCk7XG4gICAgICB9IGVsc2UgaW5zZXJ0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgbWFya2VyKTtcbiAgcmV0dXJuIFtub2RlXTtcbn1cblxuY29uc3QgJFJBVyA9IFN5bWJvbChcInN0b3JlLXJhd1wiKSxcbiAgJE5PREUgPSBTeW1ib2woXCJzdG9yZS1ub2RlXCIpLFxuICAkSEFTID0gU3ltYm9sKFwic3RvcmUtaGFzXCIpLFxuICAkU0VMRiA9IFN5bWJvbChcInN0b3JlLXNlbGZcIik7XG5mdW5jdGlvbiB3cmFwJDEodmFsdWUpIHtcbiAgbGV0IHAgPSB2YWx1ZVskUFJPWFldO1xuICBpZiAoIXApIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsdWUsICRQUk9YWSwge1xuICAgICAgdmFsdWU6IChwID0gbmV3IFByb3h5KHZhbHVlLCBwcm94eVRyYXBzJDEpKVxuICAgIH0pO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSksXG4gICAgICAgIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh2YWx1ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHByb3AgPSBrZXlzW2ldO1xuICAgICAgICBpZiAoZGVzY1twcm9wXS5nZXQpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsdWUsIHByb3AsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGRlc2NbcHJvcF0uZW51bWVyYWJsZSxcbiAgICAgICAgICAgIGdldDogZGVzY1twcm9wXS5nZXQuYmluZChwKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwO1xufVxuZnVuY3Rpb24gaXNXcmFwcGFibGUob2JqKSB7XG4gIGxldCBwcm90bztcbiAgcmV0dXJuIChcbiAgICBvYmogIT0gbnVsbCAmJlxuICAgIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiZcbiAgICAob2JqWyRQUk9YWV0gfHxcbiAgICAgICEocHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSkgfHxcbiAgICAgIHByb3RvID09PSBPYmplY3QucHJvdG90eXBlIHx8XG4gICAgICBBcnJheS5pc0FycmF5KG9iaikpXG4gICk7XG59XG5mdW5jdGlvbiB1bndyYXAoaXRlbSwgc2V0ID0gbmV3IFNldCgpKSB7XG4gIGxldCByZXN1bHQsIHVud3JhcHBlZCwgdiwgcHJvcDtcbiAgaWYgKChyZXN1bHQgPSBpdGVtICE9IG51bGwgJiYgaXRlbVskUkFXXSkpIHJldHVybiByZXN1bHQ7XG4gIGlmICghaXNXcmFwcGFibGUoaXRlbSkgfHwgc2V0LmhhcyhpdGVtKSkgcmV0dXJuIGl0ZW07XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgaWYgKE9iamVjdC5pc0Zyb3plbihpdGVtKSkgaXRlbSA9IGl0ZW0uc2xpY2UoMCk7XG4gICAgZWxzZSBzZXQuYWRkKGl0ZW0pO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gaXRlbS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHYgPSBpdGVtW2ldO1xuICAgICAgaWYgKCh1bndyYXBwZWQgPSB1bndyYXAodiwgc2V0KSkgIT09IHYpIGl0ZW1baV0gPSB1bndyYXBwZWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChPYmplY3QuaXNGcm96ZW4oaXRlbSkpIGl0ZW0gPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtKTtcbiAgICBlbHNlIHNldC5hZGQoaXRlbSk7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGl0ZW0pLFxuICAgICAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGl0ZW0pO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHByb3AgPSBrZXlzW2ldO1xuICAgICAgaWYgKGRlc2NbcHJvcF0uZ2V0KSBjb250aW51ZTtcbiAgICAgIHYgPSBpdGVtW3Byb3BdO1xuICAgICAgaWYgKCh1bndyYXBwZWQgPSB1bndyYXAodiwgc2V0KSkgIT09IHYpIGl0ZW1bcHJvcF0gPSB1bndyYXBwZWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBpdGVtO1xufVxuZnVuY3Rpb24gZ2V0Tm9kZXModGFyZ2V0LCBzeW1ib2wpIHtcbiAgbGV0IG5vZGVzID0gdGFyZ2V0W3N5bWJvbF07XG4gIGlmICghbm9kZXMpXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgc3ltYm9sLCB7XG4gICAgICB2YWx1ZTogKG5vZGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKSlcbiAgICB9KTtcbiAgcmV0dXJuIG5vZGVzO1xufVxuZnVuY3Rpb24gZ2V0Tm9kZShub2RlcywgcHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChub2Rlc1twcm9wZXJ0eV0pIHJldHVybiBub2Rlc1twcm9wZXJ0eV07XG4gIGNvbnN0IFtzLCBzZXRdID0gY3JlYXRlU2lnbmFsKHZhbHVlLCB7XG4gICAgZXF1YWxzOiBmYWxzZSxcbiAgICBpbnRlcm5hbDogdHJ1ZVxuICB9KTtcbiAgcy4kID0gc2V0O1xuICByZXR1cm4gKG5vZGVzW3Byb3BlcnR5XSA9IHMpO1xufVxuZnVuY3Rpb24gcHJveHlEZXNjcmlwdG9yJDEodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICBjb25zdCBkZXNjID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gIGlmICghZGVzYyB8fCBkZXNjLmdldCB8fCAhZGVzYy5jb25maWd1cmFibGUgfHwgcHJvcGVydHkgPT09ICRQUk9YWSB8fCBwcm9wZXJ0eSA9PT0gJE5PREUpXG4gICAgcmV0dXJuIGRlc2M7XG4gIGRlbGV0ZSBkZXNjLnZhbHVlO1xuICBkZWxldGUgZGVzYy53cml0YWJsZTtcbiAgZGVzYy5nZXQgPSAoKSA9PiB0YXJnZXRbJFBST1hZXVtwcm9wZXJ0eV07XG4gIHJldHVybiBkZXNjO1xufVxuZnVuY3Rpb24gdHJhY2tTZWxmKHRhcmdldCkge1xuICBnZXRMaXN0ZW5lcigpICYmIGdldE5vZGUoZ2V0Tm9kZXModGFyZ2V0LCAkTk9ERSksICRTRUxGKSgpO1xufVxuZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcbiAgdHJhY2tTZWxmKHRhcmdldCk7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbn1cbmNvbnN0IHByb3h5VHJhcHMkMSA9IHtcbiAgZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgaWYgKHByb3BlcnR5ID09PSAkUkFXKSByZXR1cm4gdGFyZ2V0O1xuICAgIGlmIChwcm9wZXJ0eSA9PT0gJFBST1hZKSByZXR1cm4gcmVjZWl2ZXI7XG4gICAgaWYgKHByb3BlcnR5ID09PSAkVFJBQ0spIHtcbiAgICAgIHRyYWNrU2VsZih0YXJnZXQpO1xuICAgICAgcmV0dXJuIHJlY2VpdmVyO1xuICAgIH1cbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKHRhcmdldCwgJE5PREUpO1xuICAgIGNvbnN0IHRyYWNrZWQgPSBub2Rlc1twcm9wZXJ0eV07XG4gICAgbGV0IHZhbHVlID0gdHJhY2tlZCA/IHRyYWNrZWQoKSA6IHRhcmdldFtwcm9wZXJ0eV07XG4gICAgaWYgKHByb3BlcnR5ID09PSAkTk9ERSB8fCBwcm9wZXJ0eSA9PT0gJEhBUyB8fCBwcm9wZXJ0eSA9PT0gXCJfX3Byb3RvX19cIikgcmV0dXJuIHZhbHVlO1xuICAgIGlmICghdHJhY2tlZCkge1xuICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gICAgICBpZiAoXG4gICAgICAgIGdldExpc3RlbmVyKCkgJiZcbiAgICAgICAgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiIHx8IHRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpICYmXG4gICAgICAgICEoZGVzYyAmJiBkZXNjLmdldClcbiAgICAgIClcbiAgICAgICAgdmFsdWUgPSBnZXROb2RlKG5vZGVzLCBwcm9wZXJ0eSwgdmFsdWUpKCk7XG4gICAgfVxuICAgIHJldHVybiBpc1dyYXBwYWJsZSh2YWx1ZSkgPyB3cmFwJDEodmFsdWUpIDogdmFsdWU7XG4gIH0sXG4gIGhhcyh0YXJnZXQsIHByb3BlcnR5KSB7XG4gICAgaWYgKFxuICAgICAgcHJvcGVydHkgPT09ICRSQVcgfHxcbiAgICAgIHByb3BlcnR5ID09PSAkUFJPWFkgfHxcbiAgICAgIHByb3BlcnR5ID09PSAkVFJBQ0sgfHxcbiAgICAgIHByb3BlcnR5ID09PSAkTk9ERSB8fFxuICAgICAgcHJvcGVydHkgPT09ICRIQVMgfHxcbiAgICAgIHByb3BlcnR5ID09PSBcIl9fcHJvdG9fX1wiXG4gICAgKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZ2V0TGlzdGVuZXIoKSAmJiBnZXROb2RlKGdldE5vZGVzKHRhcmdldCwgJEhBUyksIHByb3BlcnR5KSgpO1xuICAgIHJldHVybiBwcm9wZXJ0eSBpbiB0YXJnZXQ7XG4gIH0sXG4gIHNldCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZGVsZXRlUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIG93bktleXM6IG93bktleXMsXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogcHJveHlEZXNjcmlwdG9yJDFcbn07XG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShzdGF0ZSwgcHJvcGVydHksIHZhbHVlLCBkZWxldGluZyA9IGZhbHNlKSB7XG4gIGlmICghZGVsZXRpbmcgJiYgc3RhdGVbcHJvcGVydHldID09PSB2YWx1ZSkgcmV0dXJuO1xuICBjb25zdCBwcmV2ID0gc3RhdGVbcHJvcGVydHldLFxuICAgIGxlbiA9IHN0YXRlLmxlbmd0aDtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICBkZWxldGUgc3RhdGVbcHJvcGVydHldO1xuICAgIGlmIChzdGF0ZVskSEFTXSAmJiBzdGF0ZVskSEFTXVtwcm9wZXJ0eV0gJiYgcHJldiAhPT0gdW5kZWZpbmVkKSBzdGF0ZVskSEFTXVtwcm9wZXJ0eV0uJCgpO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGlmIChzdGF0ZVskSEFTXSAmJiBzdGF0ZVskSEFTXVtwcm9wZXJ0eV0gJiYgcHJldiA9PT0gdW5kZWZpbmVkKSBzdGF0ZVskSEFTXVtwcm9wZXJ0eV0uJCgpO1xuICB9XG4gIGxldCBub2RlcyA9IGdldE5vZGVzKHN0YXRlLCAkTk9ERSksXG4gICAgbm9kZTtcbiAgaWYgKChub2RlID0gZ2V0Tm9kZShub2RlcywgcHJvcGVydHksIHByZXYpKSkgbm9kZS4kKCgpID0+IHZhbHVlKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RhdGUpICYmIHN0YXRlLmxlbmd0aCAhPT0gbGVuKSB7XG4gICAgZm9yIChsZXQgaSA9IHN0YXRlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSAobm9kZSA9IG5vZGVzW2ldKSAmJiBub2RlLiQoKTtcbiAgICAobm9kZSA9IGdldE5vZGUobm9kZXMsIFwibGVuZ3RoXCIsIGxlbikpICYmIG5vZGUuJChzdGF0ZS5sZW5ndGgpO1xuICB9XG4gIChub2RlID0gbm9kZXNbJFNFTEZdKSAmJiBub2RlLiQoKTtcbn1cbmZ1bmN0aW9uIG1lcmdlU3RvcmVOb2RlKHN0YXRlLCB2YWx1ZSkge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgIHNldFByb3BlcnR5KHN0YXRlLCBrZXksIHZhbHVlW2tleV0pO1xuICB9XG59XG5mdW5jdGlvbiB1cGRhdGVBcnJheShjdXJyZW50LCBuZXh0KSB7XG4gIGlmICh0eXBlb2YgbmV4dCA9PT0gXCJmdW5jdGlvblwiKSBuZXh0ID0gbmV4dChjdXJyZW50KTtcbiAgbmV4dCA9IHVud3JhcChuZXh0KTtcbiAgaWYgKEFycmF5LmlzQXJyYXkobmV4dCkpIHtcbiAgICBpZiAoY3VycmVudCA9PT0gbmV4dCkgcmV0dXJuO1xuICAgIGxldCBpID0gMCxcbiAgICAgIGxlbiA9IG5leHQubGVuZ3RoO1xuICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbmV4dFtpXTtcbiAgICAgIGlmIChjdXJyZW50W2ldICE9PSB2YWx1ZSkgc2V0UHJvcGVydHkoY3VycmVudCwgaSwgdmFsdWUpO1xuICAgIH1cbiAgICBzZXRQcm9wZXJ0eShjdXJyZW50LCBcImxlbmd0aFwiLCBsZW4pO1xuICB9IGVsc2UgbWVyZ2VTdG9yZU5vZGUoY3VycmVudCwgbmV4dCk7XG59XG5mdW5jdGlvbiB1cGRhdGVQYXRoKGN1cnJlbnQsIHBhdGgsIHRyYXZlcnNlZCA9IFtdKSB7XG4gIGxldCBwYXJ0LFxuICAgIHByZXYgPSBjdXJyZW50O1xuICBpZiAocGF0aC5sZW5ndGggPiAxKSB7XG4gICAgcGFydCA9IHBhdGguc2hpZnQoKTtcbiAgICBjb25zdCBwYXJ0VHlwZSA9IHR5cGVvZiBwYXJ0LFxuICAgICAgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoY3VycmVudCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFydCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydC5sZW5ndGg7IGkrKykge1xuICAgICAgICB1cGRhdGVQYXRoKGN1cnJlbnQsIFtwYXJ0W2ldXS5jb25jYXQocGF0aCksIHRyYXZlcnNlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChpc0FycmF5ICYmIHBhcnRUeXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocGFydChjdXJyZW50W2ldLCBpKSkgdXBkYXRlUGF0aChjdXJyZW50LCBbaV0uY29uY2F0KHBhdGgpLCB0cmF2ZXJzZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSAmJiBwYXJ0VHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgY29uc3QgeyBmcm9tID0gMCwgdG8gPSBjdXJyZW50Lmxlbmd0aCAtIDEsIGJ5ID0gMSB9ID0gcGFydDtcbiAgICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDw9IHRvOyBpICs9IGJ5KSB7XG4gICAgICAgIHVwZGF0ZVBhdGgoY3VycmVudCwgW2ldLmNvbmNhdChwYXRoKSwgdHJhdmVyc2VkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHBhdGgubGVuZ3RoID4gMSkge1xuICAgICAgdXBkYXRlUGF0aChjdXJyZW50W3BhcnRdLCBwYXRoLCBbcGFydF0uY29uY2F0KHRyYXZlcnNlZCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcmV2ID0gY3VycmVudFtwYXJ0XTtcbiAgICB0cmF2ZXJzZWQgPSBbcGFydF0uY29uY2F0KHRyYXZlcnNlZCk7XG4gIH1cbiAgbGV0IHZhbHVlID0gcGF0aFswXTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFsdWUgPSB2YWx1ZShwcmV2LCB0cmF2ZXJzZWQpO1xuICAgIGlmICh2YWx1ZSA9PT0gcHJldikgcmV0dXJuO1xuICB9XG4gIGlmIChwYXJ0ID09PSB1bmRlZmluZWQgJiYgdmFsdWUgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gIHZhbHVlID0gdW53cmFwKHZhbHVlKTtcbiAgaWYgKHBhcnQgPT09IHVuZGVmaW5lZCB8fCAoaXNXcmFwcGFibGUocHJldikgJiYgaXNXcmFwcGFibGUodmFsdWUpICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkpIHtcbiAgICBtZXJnZVN0b3JlTm9kZShwcmV2LCB2YWx1ZSk7XG4gIH0gZWxzZSBzZXRQcm9wZXJ0eShjdXJyZW50LCBwYXJ0LCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBjcmVhdGVTdG9yZSguLi5bc3RvcmUsIG9wdGlvbnNdKSB7XG4gIGNvbnN0IHVud3JhcHBlZFN0b3JlID0gdW53cmFwKHN0b3JlIHx8IHt9KTtcbiAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkodW53cmFwcGVkU3RvcmUpO1xuICBjb25zdCB3cmFwcGVkU3RvcmUgPSB3cmFwJDEodW53cmFwcGVkU3RvcmUpO1xuICBmdW5jdGlvbiBzZXRTdG9yZSguLi5hcmdzKSB7XG4gICAgYmF0Y2goKCkgPT4ge1xuICAgICAgaXNBcnJheSAmJiBhcmdzLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IHVwZGF0ZUFycmF5KHVud3JhcHBlZFN0b3JlLCBhcmdzWzBdKVxuICAgICAgICA6IHVwZGF0ZVBhdGgodW53cmFwcGVkU3RvcmUsIGFyZ3MpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBbd3JhcHBlZFN0b3JlLCBzZXRTdG9yZV07XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7XG4gICAgLyogbm9vcCAqL1xufTtcbmNvbnN0IG5vb3BUcmFuc2l0aW9uID0gKGVsLCBkb25lKSA9PiBkb25lKCk7XG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50IHRyYW5zaXRpb24gaW50ZXJmYWNlIGZvciBzd2l0Y2hpbmcgYmV0d2VlbiBzaW5nbGUgZWxlbWVudHMuXG4gKiBJdCBjYW4gYmUgdXNlZCB0byBpbXBsZW1lbnQgb3duIHRyYW5zaXRpb24gZWZmZWN0LCBvciBhIGN1c3RvbSBgPFRyYW5zaXRpb24+YC1saWtlIGNvbXBvbmVudC5cbiAqXG4gKiBJdCB3aWxsIG9ic2VydmUge0BsaW5rIHNvdXJjZX0gYW5kIHJldHVybiBhIHNpZ25hbCB3aXRoIGFycmF5IG9mIGVsZW1lbnRzIHRvIGJlIHJlbmRlcmVkIChjdXJyZW50IG9uZSBhbmQgZXhpdGluZyBvbmVzKS5cbiAqXG4gKiBAcGFyYW0gc291cmNlIGEgc2lnbmFsIHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC4gQW55IG51bGxpc2ggdmFsdWUgd2lsbCBtZWFuIHRoZXJlIGlzIG5vIGVsZW1lbnQuXG4gKiBBbnkgb2JqZWN0IGNhbiB1c2VkIGFzIHRoZSBzb3VyY2UsIGJ1dCBtb3N0IGxpa2VseSB5b3Ugd2lsbCB3YW50IHRvIHVzZSBhIGBIVE1MRWxlbWVudGAgb3IgYFNWR0VsZW1lbnRgLlxuICogQHBhcmFtIG9wdGlvbnMgdHJhbnNpdGlvbiBvcHRpb25zIHtAbGluayBTd2l0Y2hUcmFuc2l0aW9uT3B0aW9uc31cbiAqIEByZXR1cm5zIGEgc2lnbmFsIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgZWxlbWVudCBhbmQgZXhpdGluZyBwcmV2aW91cyBlbGVtZW50cy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zb2xpZGpzLWNvbW11bml0eS9zb2xpZC1wcmltaXRpdmVzL3RyZWUvbWFpbi9wYWNrYWdlcy90cmFuc2l0aW9uLWdyb3VwI2NyZWF0ZVN3aXRjaFRyYW5zaXRpb25cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgW2VsLCBzZXRFbF0gPSBjcmVhdGVTaWduYWw8SFRNTERpdkVsZW1lbnQ+KCk7XG4gKlxuICogY29uc3QgcmVuZGVyZWQgPSBjcmVhdGVTd2l0Y2hUcmFuc2l0aW9uKGVsLCB7XG4gKiAgIG9uRW50ZXIoZWwsIGRvbmUpIHtcbiAqICAgICAvLyB0aGUgZW50ZXIgY2FsbGJhY2sgaXMgY2FsbGVkIGJlZm9yZSB0aGUgZWxlbWVudCBpcyBpbnNlcnRlZCBpbnRvIHRoZSBET01cbiAqICAgICAvLyBzbyBydW4gdGhlIGFuaW1hdGlvbiBpbiB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWUgLyBtaWNyb3Rhc2tcbiAqICAgICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7IC4uLiB9KVxuICogICB9LFxuICogICBvbkV4aXQoZWwsIGRvbmUpIHtcbiAqICAgICAvLyB0aGUgZXhpdHRpbmcgZWxlbWVudCBpcyBrZXB0IGluIHRoZSBET00gdW50aWwgdGhlIGRvbmUoKSBjYWxsYmFjayBpcyBjYWxsZWRcbiAqICAgfSxcbiAqIH0pXG4gKlxuICogLy8gY2hhbmdlIHRoZSBzb3VyY2UgdG8gdHJpZ2dlciB0aGUgdHJhbnNpdGlvblxuICogc2V0RWwocmVmVG9IdG1sRWxlbWVudCk7XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN3aXRjaFRyYW5zaXRpb24oc291cmNlLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaW5pdFNvdXJjZSA9IHVudHJhY2soc291cmNlKTtcbiAgICBjb25zdCBpbml0UmV0dXJuZWQgPSBpbml0U291cmNlID8gW2luaXRTb3VyY2VdIDogW107XG4gICAgY29uc3QgeyBvbkVudGVyID0gbm9vcFRyYW5zaXRpb24sIG9uRXhpdCA9IG5vb3BUcmFuc2l0aW9uIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IFtyZXR1cm5lZCwgc2V0UmV0dXJuZWRdID0gY3JlYXRlU2lnbmFsKG9wdGlvbnMuYXBwZWFyID8gW10gOiBpbml0UmV0dXJuZWQpO1xuICAgIGNvbnN0IFtpc1RyYW5zaXRpb25QZW5kaW5nXSA9IHVzZVRyYW5zaXRpb24oKTtcbiAgICBsZXQgbmV4dDtcbiAgICBsZXQgaXNFeGl0aW5nID0gZmFsc2U7XG4gICAgZnVuY3Rpb24gZXhpdFRyYW5zaXRpb24oZWwsIGFmdGVyKSB7XG4gICAgICAgIGlmICghZWwpXG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXIgJiYgYWZ0ZXIoKTtcbiAgICAgICAgaXNFeGl0aW5nID0gdHJ1ZTtcbiAgICAgICAgb25FeGl0KGVsLCAoKSA9PiB7XG4gICAgICAgICAgICBiYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaXNFeGl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2V0UmV0dXJuZWQocCA9PiBwLmZpbHRlcihlID0+IGUgIT09IGVsKSk7XG4gICAgICAgICAgICAgICAgYWZ0ZXIgJiYgYWZ0ZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW50ZXJUcmFuc2l0aW9uKGFmdGVyKSB7XG4gICAgICAgIGNvbnN0IGVsID0gbmV4dDtcbiAgICAgICAgaWYgKCFlbClcbiAgICAgICAgICAgIHJldHVybiBhZnRlciAmJiBhZnRlcigpO1xuICAgICAgICBuZXh0ID0gdW5kZWZpbmVkO1xuICAgICAgICBzZXRSZXR1cm5lZChwID0+IFtlbCwgLi4ucF0pO1xuICAgICAgICBvbkVudGVyKGVsLCBhZnRlciA/PyBub29wKTtcbiAgICB9XG4gICAgY29uc3QgdHJpZ2dlclRyYW5zaXRpb25zID0gb3B0aW9ucy5tb2RlID09PSBcIm91dC1pblwiXG4gICAgICAgID8gLy8gZXhpdCAtPiBlbnRlclxuICAgICAgICAgICAgLy8gZXhpdCAtPiBlbnRlclxuICAgICAgICAgICAgcHJldiA9PiBpc0V4aXRpbmcgfHwgZXhpdFRyYW5zaXRpb24ocHJldiwgZW50ZXJUcmFuc2l0aW9uKVxuICAgICAgICA6IG9wdGlvbnMubW9kZSA9PT0gXCJpbi1vdXRcIlxuICAgICAgICAgICAgPyAvLyBlbnRlciAtPiBleGl0XG4gICAgICAgICAgICAgICAgLy8gZW50ZXIgLT4gZXhpdFxuICAgICAgICAgICAgICAgIHByZXYgPT4gZW50ZXJUcmFuc2l0aW9uKCgpID0+IGV4aXRUcmFuc2l0aW9uKHByZXYpKVxuICAgICAgICAgICAgOiAvLyBleGl0ICYgZW50ZXJcbiAgICAgICAgICAgICAgICAvLyBleGl0ICYgZW50ZXJcbiAgICAgICAgICAgICAgICBwcmV2ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXhpdFRyYW5zaXRpb24ocHJldik7XG4gICAgICAgICAgICAgICAgICAgIGVudGVyVHJhbnNpdGlvbigpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgY3JlYXRlQ29tcHV0ZWQoKHByZXYpID0+IHtcbiAgICAgICAgY29uc3QgZWwgPSBzb3VyY2UoKTtcbiAgICAgICAgaWYgKHVudHJhY2soaXNUcmFuc2l0aW9uUGVuZGluZykpIHtcbiAgICAgICAgICAgIC8vIHdhaXQgZm9yIHBlbmRpbmcgdHJhbnNpdGlvbiB0byBlbmQgYmVmb3JlIGFuaW1hdGluZ1xuICAgICAgICAgICAgaXNUcmFuc2l0aW9uUGVuZGluZygpO1xuICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsICE9PSBwcmV2KSB7XG4gICAgICAgICAgICBuZXh0ID0gZWw7XG4gICAgICAgICAgICBiYXRjaCgoKSA9PiB1bnRyYWNrKCgpID0+IHRyaWdnZXJUcmFuc2l0aW9ucyhwcmV2KSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9LCBvcHRpb25zLmFwcGVhciA/IHVuZGVmaW5lZCA6IGluaXRTb3VyY2UpO1xuICAgIHJldHVybiByZXR1cm5lZDtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHByZWRpY2F0ZSB1c2VkIGluIGByZXNvbHZlRWxlbWVudHMoKWAgYW5kIGByZXNvbHZlRmlyc3QoKWAgdG8gZmlsdGVyIEVsZW1lbnRzLlxuICpcbiAqIE9uIHRoZSBjbGllbnQgaXQgdXNlcyBgaW5zdGFuY2VvZiBFbGVtZW50YCBjaGVjaywgb24gdGhlIHNlcnZlciBpdCBjaGVja3MgZm9yIHRoZSBvYmplY3Qgd2l0aCBgdGAgcHJvcGVydHkuIChnZW5lcmF0ZWQgYnkgY29tcGlsaW5nIEpTWClcbiAqL1xuY29uc3QgZGVmYXVsdEVsZW1lbnRQcmVkaWNhdGUgPSAoaXRlbSkgPT4gaXRlbSBpbnN0YW5jZW9mIEVsZW1lbnQ7XG4vKipcbiAqIFV0aWxpdHkgZm9yIHJlc29sdmluZyByZWN1cnNpdmVseSBuZXN0ZWQgSlNYIGNoaWxkcmVuIGluIHNlYXJjaCBvZiB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgYSBwcmVkaWNhdGUuXG4gKlxuICogSXQgZG9lcyAqKm5vdCoqIGNyZWF0ZSBhIGNvbXB1dGF0aW9uIC0gc2hvdWxkIGJlIHdyYXBwZWQgaW4gb25lIHRvIHJlcGVhdCB0aGUgcmVzb2x1dGlvbiBvbiBjaGFuZ2VzLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBKU1ggY2hpbGRyZW5cbiAqIEBwYXJhbSBwcmVkaWNhdGUgcHJlZGljYXRlIHRvIGZpbHRlciBlbGVtZW50c1xuICogQHJldHVybnMgc2luZ2xlIGZvdW5kIGVsZW1lbnQgb3IgYG51bGxgIGlmIG5vIGVsZW1lbnRzIHdlcmUgZm91bmRcbiAqL1xuZnVuY3Rpb24gZ2V0Rmlyc3RDaGlsZCh2YWx1ZSwgcHJlZGljYXRlKSB7XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgJiYgIXZhbHVlLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIGdldEZpcnN0Q2hpbGQodmFsdWUoKSwgcHJlZGljYXRlKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBnZXRGaXJzdENoaWxkKGl0ZW0sIHByZWRpY2F0ZSk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiByZXNvbHZlRmlyc3QoZm4sIHByZWRpY2F0ZSA9IGRlZmF1bHRFbGVtZW50UHJlZGljYXRlLCBzZXJ2ZXJQcmVkaWNhdGUgPSBkZWZhdWx0RWxlbWVudFByZWRpY2F0ZSkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gY3JlYXRlTWVtbyhmbik7XG4gICAgcmV0dXJuIGNyZWF0ZU1lbW8oKCkgPT4gZ2V0Rmlyc3RDaGlsZChjaGlsZHJlbigpLCBwcmVkaWNhdGUpKTtcbn1cblxuLy8gc3JjL2NvbW1vbi50c1xuZnVuY3Rpb24gY3JlYXRlQ2xhc3NuYW1lcyhwcm9wcykge1xuICByZXR1cm4gY3JlYXRlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IHByb3BzLm5hbWUgfHwgXCJzXCI7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVudGVyQWN0aXZlOiAocHJvcHMuZW50ZXJBY3RpdmVDbGFzcyB8fCBuYW1lICsgXCItZW50ZXItYWN0aXZlXCIpLnNwbGl0KFwiIFwiKSxcbiAgICAgIGVudGVyOiAocHJvcHMuZW50ZXJDbGFzcyB8fCBuYW1lICsgXCItZW50ZXJcIikuc3BsaXQoXCIgXCIpLFxuICAgICAgZW50ZXJUbzogKHByb3BzLmVudGVyVG9DbGFzcyB8fCBuYW1lICsgXCItZW50ZXItdG9cIikuc3BsaXQoXCIgXCIpLFxuICAgICAgZXhpdEFjdGl2ZTogKHByb3BzLmV4aXRBY3RpdmVDbGFzcyB8fCBuYW1lICsgXCItZXhpdC1hY3RpdmVcIikuc3BsaXQoXCIgXCIpLFxuICAgICAgZXhpdDogKHByb3BzLmV4aXRDbGFzcyB8fCBuYW1lICsgXCItZXhpdFwiKS5zcGxpdChcIiBcIiksXG4gICAgICBleGl0VG86IChwcm9wcy5leGl0VG9DbGFzcyB8fCBuYW1lICsgXCItZXhpdC10b1wiKS5zcGxpdChcIiBcIiksXG4gICAgICBtb3ZlOiAocHJvcHMubW92ZUNsYXNzIHx8IG5hbWUgKyBcIi1tb3ZlXCIpLnNwbGl0KFwiIFwiKVxuICAgIH07XG4gIH0pO1xufVxuZnVuY3Rpb24gbmV4dEZyYW1lKGZuKSB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZm4pKTtcbn1cbmZ1bmN0aW9uIGVudGVyVHJhbnNpdGlvbihjbGFzc2VzLCBldmVudHMsIGVsLCBkb25lKSB7XG4gIGNvbnN0IHsgb25CZWZvcmVFbnRlciwgb25FbnRlciwgb25BZnRlckVudGVyIH0gPSBldmVudHM7XG4gIG9uQmVmb3JlRW50ZXI/LihlbCk7XG4gIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcy5lbnRlcik7XG4gIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcy5lbnRlckFjdGl2ZSk7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBpZiAoIWVsLnBhcmVudE5vZGUpXG4gICAgICByZXR1cm4gZG9uZT8uKCk7XG4gICAgb25FbnRlcj8uKGVsLCAoKSA9PiBlbmRUcmFuc2l0aW9uKCkpO1xuICB9KTtcbiAgbmV4dEZyYW1lKCgpID0+IHtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMuZW50ZXIpO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcy5lbnRlclRvKTtcbiAgICBpZiAoIW9uRW50ZXIgfHwgb25FbnRlci5sZW5ndGggPCAyKSB7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBlbmRUcmFuc2l0aW9uKTtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgZW5kVHJhbnNpdGlvbik7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gZW5kVHJhbnNpdGlvbihlKSB7XG4gICAgaWYgKCFlIHx8IGUudGFyZ2V0ID09PSBlbCkge1xuICAgICAgZG9uZT8uKCk7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBlbmRUcmFuc2l0aW9uKTtcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgZW5kVHJhbnNpdGlvbik7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMuZW50ZXJBY3RpdmUpO1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzLmVudGVyVG8pO1xuICAgICAgb25BZnRlckVudGVyPy4oZWwpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZXhpdFRyYW5zaXRpb24oY2xhc3NlcywgZXZlbnRzLCBlbCwgZG9uZSkge1xuICBjb25zdCB7IG9uQmVmb3JlRXhpdCwgb25FeGl0LCBvbkFmdGVyRXhpdCB9ID0gZXZlbnRzO1xuICBpZiAoIWVsLnBhcmVudE5vZGUpXG4gICAgcmV0dXJuIGRvbmU/LigpO1xuICBvbkJlZm9yZUV4aXQ/LihlbCk7XG4gIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcy5leGl0KTtcbiAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzLmV4aXRBY3RpdmUpO1xuICBvbkV4aXQ/LihlbCwgKCkgPT4gZW5kVHJhbnNpdGlvbigpKTtcbiAgbmV4dEZyYW1lKCgpID0+IHtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMuZXhpdCk7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzLmV4aXRUbyk7XG4gICAgaWYgKCFvbkV4aXQgfHwgb25FeGl0Lmxlbmd0aCA8IDIpIHtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGVuZFRyYW5zaXRpb24pO1xuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBlbmRUcmFuc2l0aW9uKTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBlbmRUcmFuc2l0aW9uKGUpIHtcbiAgICBpZiAoIWUgfHwgZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICBkb25lPy4oKTtcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGVuZFRyYW5zaXRpb24pO1xuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBlbmRUcmFuc2l0aW9uKTtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcy5leGl0QWN0aXZlKTtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlcy5leGl0VG8pO1xuICAgICAgb25BZnRlckV4aXQ/LihlbCk7XG4gICAgfVxuICB9XG59XG52YXIgVFJBTlNJVElPTl9NT0RFX01BUCA9IHtcbiAgaW5vdXQ6IFwiaW4tb3V0XCIsXG4gIG91dGluOiBcIm91dC1pblwiXG59O1xudmFyIFRyYW5zaXRpb24gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgY2xhc3NuYW1lcyA9IGNyZWF0ZUNsYXNzbmFtZXMocHJvcHMpO1xuICByZXR1cm4gY3JlYXRlU3dpdGNoVHJhbnNpdGlvbihcbiAgICByZXNvbHZlRmlyc3QoKCkgPT4gcHJvcHMuY2hpbGRyZW4pLFxuICAgIHtcbiAgICAgIG1vZGU6IFRSQU5TSVRJT05fTU9ERV9NQVBbcHJvcHMubW9kZV0sXG4gICAgICBhcHBlYXI6IHByb3BzLmFwcGVhcixcbiAgICAgIG9uRW50ZXIoZWwsIGRvbmUpIHtcbiAgICAgICAgZW50ZXJUcmFuc2l0aW9uKGNsYXNzbmFtZXMoKSwgcHJvcHMsIGVsLCBkb25lKTtcbiAgICAgIH0sXG4gICAgICBvbkV4aXQoZWwsIGRvbmUpIHtcbiAgICAgICAgZXhpdFRyYW5zaXRpb24oY2xhc3NuYW1lcygpLCBwcm9wcywgZWwsIGRvbmUpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbn07XG5cbmNvbnN0IF90bXBsJCRlID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtdGVybVwiPjxjYW52YXM+PC9jYW52YXM+PHN2ZyBjbGFzcz1cImFwLXRlcm0tc3ltYm9sc1wiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48ZGVmcz48L2RlZnM+PGc+PC9nPjwvc3ZnPjxwcmUgY2xhc3M9XCJhcC10ZXJtLXRleHRcIiBhcmlhLWxpdmU9XCJvZmZcIiB0YWJpbmRleD1cIjBcIj48L3ByZT48L2Rpdj5gLCAxMik7XG5jb25zdCBTVkdfTlMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5jb25zdCBCTE9DS19IX1JFUyA9IDg7XG5jb25zdCBCTE9DS19WX1JFUyA9IDI0O1xuY29uc3QgQk9MRF9NQVNLID0gMTtcbmNvbnN0IEZBSU5UX01BU0sgPSAxIDw8IDE7XG5jb25zdCBJVEFMSUNfTUFTSyA9IDEgPDwgMjtcbmNvbnN0IFVOREVSTElORV9NQVNLID0gMSA8PCAzO1xuY29uc3QgU1RSSUtFVEhST1VHSF9NQVNLID0gMSA8PCA0O1xuY29uc3QgQkxJTktfTUFTSyA9IDEgPDwgNTtcbnZhciBUZXJtaW5hbCA9IChwcm9wcyA9PiB7XG4gIGNvbnN0IGNvcmUgPSBwcm9wcy5jb3JlO1xuICBjb25zdCB0ZXh0Um93UG9vbCA9IFtdO1xuICBjb25zdCB2ZWN0b3JTeW1ib2xSb3dQb29sID0gW107XG4gIGNvbnN0IHZlY3RvclN5bWJvbFVzZVBvb2wgPSBbXTtcbiAgY29uc3QgdmVjdG9yU3ltYm9sRGVmQ2FjaGUgPSBuZXcgU2V0KCk7XG4gIGNvbnN0IGNvbG9yc0NhY2hlID0gbmV3IE1hcCgpO1xuICBjb25zdCBhdHRyQ2xhc3NDYWNoZSA9IG5ldyBNYXAoKTtcbiAgY29uc3QgW3NpemUsIHNldFNpemVdID0gY3JlYXRlU2lnbmFsKHtcbiAgICBjb2xzOiBwcm9wcy5jb2xzLFxuICAgIHJvd3M6IHByb3BzLnJvd3NcbiAgfSwge1xuICAgIGVxdWFsczogKG5ld1ZhbCwgb2xkVmFsKSA9PiBuZXdWYWwuY29scyA9PT0gb2xkVmFsLmNvbHMgJiYgbmV3VmFsLnJvd3MgPT09IG9sZFZhbC5yb3dzXG4gIH0pO1xuICBjb25zdCBbdGhlbWUsIHNldFRoZW1lXSA9IGNyZWF0ZVNpZ25hbChidWlsZFRoZW1lKEZBTExCQUNLX1RIRU1FKSk7XG4gIGNvbnN0IGxpbmVIZWlnaHQgPSAoKSA9PiBwcm9wcy5saW5lSGVpZ2h0ID8/IDEuMzMzMzMzMzMzMztcbiAgY29uc3QgW2JsaW5rT24sIHNldEJsaW5rT25dID0gY3JlYXRlU2lnbmFsKHRydWUpO1xuICBjb25zdCBjdXJzb3JPbiA9IGNyZWF0ZU1lbW8oKCkgPT4gYmxpbmtPbigpIHx8IGN1cnNvckhvbGQpO1xuICBjb25zdCBzdHlsZSQxID0gY3JlYXRlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiBgJHtzaXplKCkuY29sc31jaGAsXG4gICAgICBoZWlnaHQ6IGAke2xpbmVIZWlnaHQoKSAqIHNpemUoKS5yb3dzfWVtYCxcbiAgICAgIFwiZm9udC1zaXplXCI6IGAkeyhwcm9wcy5zY2FsZSB8fCAxLjApICogMTAwfSVgLFxuICAgICAgXCItLXRlcm0tbGluZS1oZWlnaHRcIjogYCR7bGluZUhlaWdodCgpfWVtYCxcbiAgICAgIFwiLS10ZXJtLWNvbHNcIjogc2l6ZSgpLmNvbHMsXG4gICAgICBcIi0tdGVybS1yb3dzXCI6IHNpemUoKS5yb3dzXG4gICAgfTtcbiAgfSk7XG4gIGxldCBjdXJzb3IgPSB7XG4gICAgY29sOiAwLFxuICAgIHJvdzogMCxcbiAgICB2aXNpYmxlOiBmYWxzZVxuICB9O1xuICBsZXQgcGVuZGluZ0NoYW5nZXMgPSB7XG4gICAgc2l6ZTogdW5kZWZpbmVkLFxuICAgIHRoZW1lOiB1bmRlZmluZWQsXG4gICAgcm93czogbmV3IFNldCgpXG4gIH07XG4gIGxldCBlbDtcbiAgbGV0IGNhbnZhc0VsO1xuICBsZXQgY2FudmFzQ3R4O1xuICBsZXQgdGV4dEVsO1xuICBsZXQgdmVjdG9yU3ltYm9sc0VsO1xuICBsZXQgdmVjdG9yU3ltYm9sRGVmc0VsO1xuICBsZXQgdmVjdG9yU3ltYm9sUm93c0VsO1xuICBsZXQgZnJhbWVSZXF1ZXN0SWQ7XG4gIGxldCBibGlua0ludGVydmFsSWQ7XG4gIGxldCBjc3NUaGVtZTtcbiAgbGV0IGN1cnNvckhvbGQgPSBmYWxzZTtcbiAgb25Nb3VudCgoKSA9PiB7XG4gICAgc2V0dXBDYW52YXMoKTtcbiAgICBzZXRJbml0aWFsVGhlbWUoKTtcbiAgICBhZGp1c3RUZXh0Um93Tm9kZUNvdW50KHNpemUoKS5yb3dzKTtcbiAgICBhZGp1c3RTeW1ib2xSb3dOb2RlQ291bnQoc2l6ZSgpLnJvd3MpO1xuICAgIGNvcmUuYWRkRXZlbnRMaXN0ZW5lcihcInZ0VXBkYXRlXCIsIG9uVnRVcGRhdGUpO1xuICB9KTtcbiAgb25DbGVhbnVwKCgpID0+IHtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ2dFVwZGF0ZVwiLCBvblZ0VXBkYXRlKTtcbiAgICBjbGVhckludGVydmFsKGJsaW5rSW50ZXJ2YWxJZCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoZnJhbWVSZXF1ZXN0SWQpO1xuICB9KTtcbiAgY3JlYXRlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocHJvcHMuYmxpbmtpbmcgJiYgYmxpbmtJbnRlcnZhbElkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJsaW5rSW50ZXJ2YWxJZCA9IHNldEludGVydmFsKHRvZ2dsZUJsaW5rLCA2MDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhckludGVydmFsKGJsaW5rSW50ZXJ2YWxJZCk7XG4gICAgICBibGlua0ludGVydmFsSWQgPSB1bmRlZmluZWQ7XG4gICAgICBzZXRCbGlua09uKHRydWUpO1xuICAgIH1cbiAgfSk7XG4gIGNyZWF0ZUVmZmVjdCgoKSA9PiB7XG4gICAgY3Vyc29yT24oKTtcbiAgICBpZiAoY3Vyc29yLnZpc2libGUpIHtcbiAgICAgIHBlbmRpbmdDaGFuZ2VzLnJvd3MuYWRkKGN1cnNvci5yb3cpO1xuICAgICAgc2NoZWR1bGVSZW5kZXIoKTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBzZXR1cENhbnZhcygpIHtcbiAgICBjYW52YXNDdHggPSBjYW52YXNFbC5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgaWYgKCFjYW52YXNDdHgpIHRocm93IG5ldyBFcnJvcihcIjJEIGN0eCBub3QgYXZhaWxhYmxlXCIpO1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbHMsXG4gICAgICByb3dzXG4gICAgfSA9IHNpemUoKTtcbiAgICBjYW52YXNFbC53aWR0aCA9IGNvbHMgKiBCTE9DS19IX1JFUztcbiAgICBjYW52YXNFbC5oZWlnaHQgPSByb3dzICogQkxPQ0tfVl9SRVM7XG4gICAgY2FudmFzRWwuc3R5bGUuaW1hZ2VSZW5kZXJpbmcgPSBcInBpeGVsYXRlZFwiO1xuICAgIGNhbnZhc0N0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiByZXNpemVDYW52YXMoX3JlZikge1xuICAgIGxldCB7XG4gICAgICBjb2xzLFxuICAgICAgcm93c1xuICAgIH0gPSBfcmVmO1xuICAgIGNhbnZhc0VsLndpZHRoID0gY29scyAqIEJMT0NLX0hfUkVTO1xuICAgIGNhbnZhc0VsLmhlaWdodCA9IHJvd3MgKiBCTE9DS19WX1JFUztcbiAgICBjYW52YXNDdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gc2V0SW5pdGlhbFRoZW1lKCkge1xuICAgIGNzc1RoZW1lID0gZ2V0Q3NzVGhlbWUoZWwpO1xuICAgIHBlbmRpbmdDaGFuZ2VzLnRoZW1lID0gY3NzVGhlbWU7XG4gIH1cbiAgZnVuY3Rpb24gb25WdFVwZGF0ZShfcmVmMikge1xuICAgIGxldCB7XG4gICAgICBzaXplOiBuZXdTaXplLFxuICAgICAgdGhlbWUsXG4gICAgICBjaGFuZ2VkUm93c1xuICAgIH0gPSBfcmVmMjtcbiAgICBsZXQgYWN0aXZpdHkgPSBmYWxzZTtcbiAgICBpZiAoY2hhbmdlZFJvd3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChjb25zdCByb3cgb2YgY2hhbmdlZFJvd3MpIHtcbiAgICAgICAgcGVuZGluZ0NoYW5nZXMucm93cy5hZGQocm93KTtcbiAgICAgICAgY3Vyc29ySG9sZCA9IHRydWU7XG4gICAgICAgIGFjdGl2aXR5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoZW1lICE9PSB1bmRlZmluZWQgJiYgcHJvcHMucHJlZmVyRW1iZWRkZWRUaGVtZSkge1xuICAgICAgcGVuZGluZ0NoYW5nZXMudGhlbWUgPSB0aGVtZTtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHNpemUoKS5yb3dzOyByb3crKykge1xuICAgICAgICBwZW5kaW5nQ2hhbmdlcy5yb3dzLmFkZChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBuZXdDdXJzb3IgPSBjb3JlLmdldEN1cnNvcigpO1xuICAgIGlmIChuZXdDdXJzb3IudmlzaWJsZSAhPSBjdXJzb3IudmlzaWJsZSB8fCBuZXdDdXJzb3IuY29sICE9IGN1cnNvci5jb2wgfHwgbmV3Q3Vyc29yLnJvdyAhPSBjdXJzb3Iucm93KSB7XG4gICAgICBpZiAoY3Vyc29yLnZpc2libGUpIHtcbiAgICAgICAgcGVuZGluZ0NoYW5nZXMucm93cy5hZGQoY3Vyc29yLnJvdyk7XG4gICAgICB9XG4gICAgICBpZiAobmV3Q3Vyc29yLnZpc2libGUpIHtcbiAgICAgICAgcGVuZGluZ0NoYW5nZXMucm93cy5hZGQobmV3Q3Vyc29yLnJvdyk7XG4gICAgICB9XG4gICAgICBjdXJzb3IgPSBuZXdDdXJzb3I7XG4gICAgICBjdXJzb3JIb2xkID0gdHJ1ZTtcbiAgICAgIGFjdGl2aXR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5ld1NpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcGVuZGluZ0NoYW5nZXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiBwZW5kaW5nQ2hhbmdlcy5yb3dzKSB7XG4gICAgICAgIGlmIChyb3cgPj0gbmV3U2l6ZS5yb3dzKSB7XG4gICAgICAgICAgcGVuZGluZ0NoYW5nZXMucm93cy5kZWxldGUocm93KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYWN0aXZpdHkgJiYgY3Vyc29yLnZpc2libGUpIHtcbiAgICAgIHBlbmRpbmdDaGFuZ2VzLnJvd3MuYWRkKGN1cnNvci5yb3cpO1xuICAgIH1cbiAgICBzY2hlZHVsZVJlbmRlcigpO1xuICB9XG4gIGZ1bmN0aW9uIHRvZ2dsZUJsaW5rKCkge1xuICAgIHNldEJsaW5rT24oYmxpbmsgPT4ge1xuICAgICAgaWYgKCFibGluaykgY3Vyc29ySG9sZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuICFibGluaztcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBzY2hlZHVsZVJlbmRlcigpIHtcbiAgICBpZiAoZnJhbWVSZXF1ZXN0SWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnJhbWVSZXF1ZXN0SWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGZyYW1lUmVxdWVzdElkID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHtcbiAgICAgIHNpemU6IG5ld1NpemUsXG4gICAgICB0aGVtZTogbmV3VGhlbWUsXG4gICAgICByb3dzXG4gICAgfSA9IHBlbmRpbmdDaGFuZ2VzO1xuICAgIGJhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChuZXdTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVzaXplQ2FudmFzKG5ld1NpemUpO1xuICAgICAgICBhZGp1c3RUZXh0Um93Tm9kZUNvdW50KG5ld1NpemUucm93cyk7XG4gICAgICAgIGFkanVzdFN5bWJvbFJvd05vZGVDb3VudChuZXdTaXplLnJvd3MpO1xuICAgICAgICBzZXRTaXplKG5ld1NpemUpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld1RoZW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG5ld1RoZW1lID09PSBudWxsKSB7XG4gICAgICAgICAgc2V0VGhlbWUoYnVpbGRUaGVtZShjc3NUaGVtZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFRoZW1lKGJ1aWxkVGhlbWUobmV3VGhlbWUpKTtcbiAgICAgICAgfVxuICAgICAgICBjb2xvcnNDYWNoZS5jbGVhcigpO1xuICAgICAgfVxuICAgICAgY29uc3QgdGhlbWVfID0gdGhlbWUoKTtcbiAgICAgIGNvbnN0IGN1cnNvck9uXyA9IGJsaW5rT24oKSB8fCBjdXJzb3JIb2xkO1xuICAgICAgZm9yIChjb25zdCByIG9mIHJvd3MpIHtcbiAgICAgICAgcmVuZGVyUm93KHIsIHRoZW1lXywgY3Vyc29yT25fKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwZW5kaW5nQ2hhbmdlcy5zaXplID0gdW5kZWZpbmVkO1xuICAgIHBlbmRpbmdDaGFuZ2VzLnRoZW1lID0gdW5kZWZpbmVkO1xuICAgIHBlbmRpbmdDaGFuZ2VzLnJvd3MuY2xlYXIoKTtcbiAgICBwcm9wcy5zdGF0cy5yZW5kZXJzICs9IDE7XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyUm93KHJvd0luZGV4LCB0aGVtZSwgY3Vyc29yT24pIHtcbiAgICBjb25zdCBsaW5lID0gY29yZS5nZXRMaW5lKHJvd0luZGV4LCBjdXJzb3JPbik7XG4gICAgY2xlYXJDYW52YXNSb3cocm93SW5kZXgpO1xuICAgIHJlbmRlclJvd0JnKHJvd0luZGV4LCBsaW5lLmJnLCB0aGVtZSk7XG4gICAgcmVuZGVyUm93UmFzdGVyU3ltYm9scyhyb3dJbmRleCwgbGluZS5yYXN0ZXJfc3ltYm9scywgdGhlbWUpO1xuICAgIHJlbmRlclJvd1ZlY3RvclN5bWJvbHMocm93SW5kZXgsIGxpbmUudmVjdG9yX3N5bWJvbHMsIHRoZW1lKTtcbiAgICByZW5kZXJSb3dUZXh0KHJvd0luZGV4LCBsaW5lLnRleHQsIGxpbmUuY29kZXBvaW50cywgdGhlbWUpO1xuICB9XG4gIGZ1bmN0aW9uIGNsZWFyQ2FudmFzUm93KHJvd0luZGV4KSB7XG4gICAgY2FudmFzQ3R4LmNsZWFyUmVjdCgwLCByb3dJbmRleCAqIEJMT0NLX1ZfUkVTLCBzaXplKCkuY29scyAqIEJMT0NLX0hfUkVTLCBCTE9DS19WX1JFUyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyUm93Qmcocm93SW5kZXgsIHNwYW5zLCB0aGVtZSkge1xuICAgIC8vIFRoZSBtZW1vcnkgbGF5b3V0IG9mIGEgQmdTcGFuIG11c3QgZm9sbG93IG9uZSBkZWZpbmVkIGluIGxpYi5ycyAoc2VlIHRoZSBhc3NlcnRpb25zIGF0IHRoZSBib3R0b20pXG4gICAgY29uc3QgdmlldyA9IGNvcmUuZ2V0RGF0YVZpZXcoc3BhbnMsIDgpO1xuICAgIGNvbnN0IHkgPSByb3dJbmRleCAqIEJMT0NLX1ZfUkVTO1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHZpZXcuYnl0ZUxlbmd0aCkge1xuICAgICAgY29uc3QgY29sdW1uID0gdmlldy5nZXRVaW50MTYoaSArIDAsIHRydWUpO1xuICAgICAgY29uc3Qgd2lkdGggPSB2aWV3LmdldFVpbnQxNihpICsgMiwgdHJ1ZSk7XG4gICAgICBjb25zdCBjb2xvciA9IGdldENvbG9yKHZpZXcsIGkgKyA0LCB0aGVtZSk7XG4gICAgICBpICs9IDg7XG4gICAgICBjYW52YXNDdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICBjYW52YXNDdHguZmlsbFJlY3QoY29sdW1uICogQkxPQ0tfSF9SRVMsIHksIHdpZHRoICogQkxPQ0tfSF9SRVMsIEJMT0NLX1ZfUkVTKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcmVuZGVyUm93UmFzdGVyU3ltYm9scyhyb3dJbmRleCwgc3ltYm9scywgdGhlbWUpIHtcbiAgICAvLyBUaGUgbWVtb3J5IGxheW91dCBvZiBhIFJhc3RlclN5bWJvbCBtdXN0IGZvbGxvdyBvbmUgZGVmaW5lZCBpbiBsaWIucnMgKHNlZSB0aGUgYXNzZXJ0aW9ucyBhdCB0aGUgYm90dG9tKVxuICAgIGNvbnN0IHZpZXcgPSBjb3JlLmdldERhdGFWaWV3KHN5bWJvbHMsIDEyKTtcbiAgICBjb25zdCB5ID0gcm93SW5kZXggKiBCTE9DS19WX1JFUztcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCB2aWV3LmJ5dGVMZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IHZpZXcuZ2V0VWludDE2KGkgKyAwLCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvZGVwb2ludCA9IHZpZXcuZ2V0VWludDMyKGkgKyA0LCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3IodmlldywgaSArIDgsIHRoZW1lKSB8fCB0aGVtZS5mZztcbiAgICAgIGkgKz0gMTI7XG4gICAgICBjYW52YXNDdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICBkcmF3QmxvY2tHbHlwaChjYW52YXNDdHgsIGNvZGVwb2ludCwgY29sdW1uICogQkxPQ0tfSF9SRVMsIHkpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiByZW5kZXJSb3dWZWN0b3JTeW1ib2xzKHJvd0luZGV4LCBzeW1ib2xzLCB0aGVtZSkge1xuICAgIC8vIFRoZSBtZW1vcnkgbGF5b3V0IG9mIGEgVmVjdG9yU3ltYm9sIG11c3QgZm9sbG93IG9uZSBkZWZpbmVkIGluIGxpYi5ycyAoc2VlIHRoZSBhc3NlcnRpb25zIGF0IHRoZSBib3R0b20pXG4gICAgY29uc3QgdmlldyA9IGNvcmUuZ2V0RGF0YVZpZXcoc3ltYm9scywgMTYpO1xuICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3Qgc3ltYm9sUm93ID0gdmVjdG9yU3ltYm9sUm93c0VsLmNoaWxkcmVuW3Jvd0luZGV4XTtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCB2aWV3LmJ5dGVMZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IHZpZXcuZ2V0VWludDE2KGkgKyAwLCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvZGVwb2ludCA9IHZpZXcuZ2V0VWludDMyKGkgKyA0LCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3IodmlldywgaSArIDgsIHRoZW1lKTtcbiAgICAgIGNvbnN0IGF0dHJzID0gdmlldy5nZXRVaW50OChpICsgMTIpO1xuICAgICAgaSArPSAxNjtcbiAgICAgIGNvbnN0IGJsaW5rID0gKGF0dHJzICYgQkxJTktfTUFTSykgIT09IDA7XG4gICAgICBjb25zdCBlbCA9IGNyZWF0ZVZlY3RvclN5bWJvbE5vZGUoY29kZXBvaW50LCBjb2x1bW4sIGNvbG9yLCBibGluayk7XG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChlbCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlY3ljbGVWZWN0b3JTeW1ib2xVc2VzKHN5bWJvbFJvdyk7XG4gICAgc3ltYm9sUm93LnJlcGxhY2VDaGlsZHJlbihmcmFnKTtcbiAgfVxuICBmdW5jdGlvbiByZW5kZXJSb3dUZXh0KHJvd0luZGV4LCBzcGFucywgY29kZXBvaW50cywgdGhlbWUpIHtcbiAgICAvLyBUaGUgbWVtb3J5IGxheW91dCBvZiBhIFRleHRTcGFuIG11c3QgZm9sbG93IG9uZSBkZWZpbmVkIGluIGxpYi5ycyAoc2VlIHRoZSBhc3NlcnRpb25zIGF0IHRoZSBib3R0b20pXG4gICAgY29uc3Qgc3BhbnNWaWV3ID0gY29yZS5nZXREYXRhVmlldyhzcGFucywgMTIpO1xuICAgIGNvbnN0IGNvZGVwb2ludHNWaWV3ID0gY29yZS5nZXRVaW50MzJBcnJheShjb2RlcG9pbnRzKTtcbiAgICBjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHNwYW5zVmlldy5ieXRlTGVuZ3RoKSB7XG4gICAgICBjb25zdCBjb2x1bW4gPSBzcGFuc1ZpZXcuZ2V0VWludDE2KGkgKyAwLCB0cnVlKTtcbiAgICAgIGNvbnN0IGNvZGVwb2ludHNTdGFydCA9IHNwYW5zVmlldy5nZXRVaW50MTYoaSArIDIsIHRydWUpO1xuICAgICAgY29uc3QgbGVuID0gc3BhbnNWaWV3LmdldFVpbnQxNihpICsgNCwgdHJ1ZSk7XG4gICAgICBjb25zdCBjb2xvciA9IGdldENvbG9yKHNwYW5zVmlldywgaSArIDYsIHRoZW1lKTtcbiAgICAgIGNvbnN0IGF0dHJzID0gc3BhbnNWaWV3LmdldFVpbnQ4KGkgKyAxMCk7XG4gICAgICBjb25zdCB0ZXh0ID0gU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZXBvaW50c1ZpZXcuc3ViYXJyYXkoY29kZXBvaW50c1N0YXJ0LCBjb2RlcG9pbnRzU3RhcnQgKyBsZW4pKTtcbiAgICAgIGkgKz0gMTI7XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgY29uc3Qgc3R5bGUgPSBlbC5zdHlsZTtcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KFwiLS1vZmZzZXRcIiwgY29sdW1uKTtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgIGlmIChjb2xvcikge1xuICAgICAgICBzdHlsZS5jb2xvciA9IGNvbG9yO1xuICAgICAgfVxuICAgICAgY29uc3QgY2xzID0gZ2V0QXR0ckNsYXNzKGF0dHJzKTtcbiAgICAgIGlmIChjbHMgIT09IG51bGwpIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gY2xzO1xuICAgICAgfVxuICAgICAgZnJhZy5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHRleHRFbC5jaGlsZHJlbltyb3dJbmRleF0ucmVwbGFjZUNoaWxkcmVuKGZyYWcpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEF0dHJDbGFzcyhhdHRycykge1xuICAgIGxldCBjID0gYXR0ckNsYXNzQ2FjaGUuZ2V0KGF0dHJzKTtcbiAgICBpZiAoYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjID0gYnVpbGRBdHRyQ2xhc3MoYXR0cnMpO1xuICAgICAgYXR0ckNsYXNzQ2FjaGUuc2V0KGF0dHJzLCBjKTtcbiAgICB9XG4gICAgcmV0dXJuIGM7XG4gIH1cbiAgZnVuY3Rpb24gYnVpbGRBdHRyQ2xhc3MoYXR0cnMpIHtcbiAgICBsZXQgY2xzID0gXCJcIjtcbiAgICBpZiAoKGF0dHJzICYgQk9MRF9NQVNLKSAhPT0gMCkge1xuICAgICAgY2xzICs9IFwiYXAtYm9sZCBcIjtcbiAgICB9IGVsc2UgaWYgKChhdHRycyAmIEZBSU5UX01BU0spICE9PSAwKSB7XG4gICAgICBjbHMgKz0gXCJhcC1mYWludCBcIjtcbiAgICB9XG4gICAgaWYgKChhdHRycyAmIElUQUxJQ19NQVNLKSAhPT0gMCkge1xuICAgICAgY2xzICs9IFwiYXAtaXRhbGljIFwiO1xuICAgIH1cbiAgICBpZiAoKGF0dHJzICYgVU5ERVJMSU5FX01BU0spICE9PSAwKSB7XG4gICAgICBjbHMgKz0gXCJhcC11bmRlcmxpbmUgXCI7XG4gICAgfVxuICAgIGlmICgoYXR0cnMgJiBTVFJJS0VUSFJPVUdIX01BU0spICE9PSAwKSB7XG4gICAgICBjbHMgKz0gXCJhcC1zdHJpa2UgXCI7XG4gICAgfVxuICAgIGlmICgoYXR0cnMgJiBCTElOS19NQVNLKSAhPT0gMCkge1xuICAgICAgY2xzICs9IFwiYXAtYmxpbmsgXCI7XG4gICAgfVxuICAgIHJldHVybiBjbHMgPT09IFwiXCIgPyBudWxsIDogY2xzO1xuICB9XG4gIGZ1bmN0aW9uIGdldENvbG9yKHZpZXcsIG9mZnNldCwgdGhlbWUpIHtcbiAgICBjb25zdCB0YWcgPSB2aWV3LmdldFVpbnQ4KG9mZnNldCk7XG4gICAgaWYgKHRhZyA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICh0YWcgPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGVtZS5mZztcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gMikge1xuICAgICAgcmV0dXJuIHRoZW1lLmJnO1xuICAgIH0gZWxzZSBpZiAodGFnID09PSAzKSB7XG4gICAgICByZXR1cm4gdGhlbWUucGFsZXR0ZVt2aWV3LmdldFVpbnQ4KG9mZnNldCArIDEpXTtcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gNCkge1xuICAgICAgY29uc3Qga2V5ID0gdmlldy5nZXRVaW50MzIob2Zmc2V0LCB0cnVlKTtcbiAgICAgIGxldCBjID0gY29sb3JzQ2FjaGUuZ2V0KGtleSk7XG4gICAgICBpZiAoYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHIgPSB2aWV3LmdldFVpbnQ4KG9mZnNldCArIDEpO1xuICAgICAgICBjb25zdCBnID0gdmlldy5nZXRVaW50OChvZmZzZXQgKyAyKTtcbiAgICAgICAgY29uc3QgYiA9IHZpZXcuZ2V0VWludDgob2Zmc2V0ICsgMyk7XG4gICAgICAgIGMgPSBcInJnYihcIiArIHIgKyBcIixcIiArIGcgKyBcIixcIiArIGIgKyBcIilcIjtcbiAgICAgICAgY29sb3JzQ2FjaGUuc2V0KGtleSwgYyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIGNvbG9yIHRhZzogJHt0YWd9YCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFkanVzdFRleHRSb3dOb2RlQ291bnQocm93cykge1xuICAgIGxldCByID0gdGV4dEVsLmNoaWxkcmVuLmxlbmd0aDtcbiAgICBpZiAociA8IHJvd3MpIHtcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICB3aGlsZSAociA8IHJvd3MpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gZ2V0TmV3Um93KCk7XG4gICAgICAgIHJvdy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tcm93XCIsIHIpO1xuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIHIgKz0gMTtcbiAgICAgIH1cbiAgICAgIHRleHRFbC5hcHBlbmRDaGlsZChmcmFnKTtcbiAgICB9XG4gICAgd2hpbGUgKHRleHRFbC5jaGlsZHJlbi5sZW5ndGggPiByb3dzKSB7XG4gICAgICBjb25zdCByb3cgPSB0ZXh0RWwubGFzdEVsZW1lbnRDaGlsZDtcbiAgICAgIHRleHRFbC5yZW1vdmVDaGlsZChyb3cpO1xuICAgICAgdGV4dFJvd1Bvb2wucHVzaChyb3cpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBhZGp1c3RTeW1ib2xSb3dOb2RlQ291bnQocm93cykge1xuICAgIGxldCByID0gdmVjdG9yU3ltYm9sUm93c0VsLmNoaWxkcmVuLmxlbmd0aDtcbiAgICBpZiAociA8IHJvd3MpIHtcbiAgICAgIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICB3aGlsZSAociA8IHJvd3MpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gZ2V0TmV3U3ltYm9sUm93KCk7XG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwICR7cn0pYCk7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgciArPSAxO1xuICAgICAgfVxuICAgICAgdmVjdG9yU3ltYm9sUm93c0VsLmFwcGVuZENoaWxkKGZyYWcpO1xuICAgIH1cbiAgICB3aGlsZSAodmVjdG9yU3ltYm9sUm93c0VsLmNoaWxkcmVuLmxlbmd0aCA+IHJvd3MpIHtcbiAgICAgIGNvbnN0IHJvdyA9IHZlY3RvclN5bWJvbFJvd3NFbC5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgdmVjdG9yU3ltYm9sUm93c0VsLnJlbW92ZUNoaWxkKHJvdyk7XG4gICAgICB2ZWN0b3JTeW1ib2xSb3dQb29sLnB1c2gocm93KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TmV3Um93KCkge1xuICAgIGxldCByb3cgPSB0ZXh0Um93UG9vbC5wb3AoKTtcbiAgICBpZiAocm93ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgcm93LmNsYXNzTmFtZSA9IFwiYXAtbGluZVwiO1xuICAgIH1cbiAgICByZXR1cm4gcm93O1xuICB9XG4gIGZ1bmN0aW9uIGdldE5ld1N5bWJvbFJvdygpIHtcbiAgICBsZXQgcm93ID0gdmVjdG9yU3ltYm9sUm93UG9vbC5wb3AoKTtcbiAgICBpZiAocm93ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdfTlMsIFwiZ1wiKTtcbiAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFwLXN5bWJvbC1saW5lXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcm93O1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZVZlY3RvclN5bWJvbE5vZGUoY29kZXBvaW50LCBjb2x1bW4sIGZnLCBibGluaykge1xuICAgIGlmICghZW5zdXJlVmVjdG9yU3ltYm9sRGVmKGNvZGVwb2ludCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpc1Bvd2VybGluZSA9IFBPV0VSTElORV9TWU1CT0xTLmhhcyhjb2RlcG9pbnQpO1xuICAgIGNvbnN0IHN5bWJvbFggPSBpc1Bvd2VybGluZSA/IGNvbHVtbiAtIFBPV0VSTElORV9TWU1CT0xfTlVER0UgOiBjb2x1bW47XG4gICAgY29uc3Qgc3ltYm9sV2lkdGggPSBpc1Bvd2VybGluZSA/IDEgKyBQT1dFUkxJTkVfU1lNQk9MX05VREdFICogMiA6IDE7XG4gICAgY29uc3Qgbm9kZSA9IGdldFZlY3RvclN5bWJvbFVzZSgpO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBgI3N5bS0ke2NvZGVwb2ludH1gKTtcbiAgICBub2RlLnNldEF0dHJpYnV0ZShcInhcIiwgc3ltYm9sWCk7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJ5XCIsIDApO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgc3ltYm9sV2lkdGgpO1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMVwiKTtcbiAgICBpZiAoZmcpIHtcbiAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXCJjb2xvclwiLCBmZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJjb2xvclwiKTtcbiAgICB9XG4gICAgaWYgKGJsaW5rKSB7XG4gICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJhcC1ibGlua1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKFwiYXAtYmxpbmtcIik7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG4gIGZ1bmN0aW9uIHJlY3ljbGVWZWN0b3JTeW1ib2xVc2VzKHJvdykge1xuICAgIHdoaWxlIChyb3cuZmlyc3RDaGlsZCkge1xuICAgICAgY29uc3QgY2hpbGQgPSByb3cuZmlyc3RDaGlsZDtcbiAgICAgIHJvdy5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICB2ZWN0b3JTeW1ib2xVc2VQb29sLnB1c2goY2hpbGQpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRWZWN0b3JTeW1ib2xVc2UoKSB7XG4gICAgbGV0IG5vZGUgPSB2ZWN0b3JTeW1ib2xVc2VQb29sLnBvcCgpO1xuICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHX05TLCBcInVzZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgZnVuY3Rpb24gZW5zdXJlVmVjdG9yU3ltYm9sRGVmKGNvZGVwb2ludCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBnZXRWZWN0b3JTeW1ib2xEZWYoY29kZXBvaW50KTtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHZlY3RvclN5bWJvbERlZkNhY2hlLmhhcyhjb2RlcG9pbnQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBgc3ltLSR7Y29kZXBvaW50fWA7XG4gICAgY29uc3Qgc3ltYm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OUywgXCJzeW1ib2xcIik7XG4gICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcIjAgMCAxIDFcIik7XG4gICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJub25lXCIpO1xuICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJvdmVyZmxvd1wiLCBcInZpc2libGVcIik7XG4gICAgc3ltYm9sLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgdmVjdG9yU3ltYm9sRGVmc0VsLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgdmVjdG9yU3ltYm9sRGVmQ2FjaGUuYWRkKGNvZGVwb2ludCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuICgoKSA9PiB7XG4gICAgY29uc3QgX2VsJCA9IF90bXBsJCRlLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgIF9lbCQyID0gX2VsJC5maXJzdENoaWxkLFxuICAgICAgX2VsJDMgPSBfZWwkMi5uZXh0U2libGluZyxcbiAgICAgIF9lbCQ0ID0gX2VsJDMuZmlyc3RDaGlsZCxcbiAgICAgIF9lbCQ1ID0gX2VsJDQubmV4dFNpYmxpbmcsXG4gICAgICBfZWwkNiA9IF9lbCQzLm5leHRTaWJsaW5nO1xuICAgIGNvbnN0IF9yZWYkID0gZWw7XG4gICAgdHlwZW9mIF9yZWYkID09PSBcImZ1bmN0aW9uXCIgPyB1c2UoX3JlZiQsIF9lbCQpIDogZWwgPSBfZWwkO1xuICAgIGNvbnN0IF9yZWYkMiA9IGNhbnZhc0VsO1xuICAgIHR5cGVvZiBfcmVmJDIgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJDIsIF9lbCQyKSA6IGNhbnZhc0VsID0gX2VsJDI7XG4gICAgY29uc3QgX3JlZiQzID0gdmVjdG9yU3ltYm9sc0VsO1xuICAgIHR5cGVvZiBfcmVmJDMgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJDMsIF9lbCQzKSA6IHZlY3RvclN5bWJvbHNFbCA9IF9lbCQzO1xuICAgIGNvbnN0IF9yZWYkNCA9IHZlY3RvclN5bWJvbERlZnNFbDtcbiAgICB0eXBlb2YgX3JlZiQ0ID09PSBcImZ1bmN0aW9uXCIgPyB1c2UoX3JlZiQ0LCBfZWwkNCkgOiB2ZWN0b3JTeW1ib2xEZWZzRWwgPSBfZWwkNDtcbiAgICBjb25zdCBfcmVmJDUgPSB2ZWN0b3JTeW1ib2xSb3dzRWw7XG4gICAgdHlwZW9mIF9yZWYkNSA9PT0gXCJmdW5jdGlvblwiID8gdXNlKF9yZWYkNSwgX2VsJDUpIDogdmVjdG9yU3ltYm9sUm93c0VsID0gX2VsJDU7XG4gICAgY29uc3QgX3JlZiQ2ID0gdGV4dEVsO1xuICAgIHR5cGVvZiBfcmVmJDYgPT09IFwiZnVuY3Rpb25cIiA/IHVzZShfcmVmJDYsIF9lbCQ2KSA6IHRleHRFbCA9IF9lbCQ2O1xuICAgIGNyZWF0ZVJlbmRlckVmZmVjdChfcCQgPT4ge1xuICAgICAgY29uc3QgX3YkID0gc3R5bGUkMSgpLFxuICAgICAgICBfdiQyID0gYDAgMCAke3NpemUoKS5jb2xzfSAke3NpemUoKS5yb3dzfWAsXG4gICAgICAgIF92JDMgPSAhIWJsaW5rT24oKSxcbiAgICAgICAgX3YkNCA9ICEhYmxpbmtPbigpO1xuICAgICAgX3AkLl92JCA9IHN0eWxlKF9lbCQsIF92JCwgX3AkLl92JCk7XG4gICAgICBfdiQyICE9PSBfcCQuX3YkMiAmJiBzZXRBdHRyaWJ1dGUoX2VsJDMsIFwidmlld0JveFwiLCBfcCQuX3YkMiA9IF92JDIpO1xuICAgICAgX3YkMyAhPT0gX3AkLl92JDMgJiYgX2VsJDMuY2xhc3NMaXN0LnRvZ2dsZShcImFwLWJsaW5rXCIsIF9wJC5fdiQzID0gX3YkMyk7XG4gICAgICBfdiQ0ICE9PSBfcCQuX3YkNCAmJiBfZWwkNi5jbGFzc0xpc3QudG9nZ2xlKFwiYXAtYmxpbmtcIiwgX3AkLl92JDQgPSBfdiQ0KTtcbiAgICAgIHJldHVybiBfcCQ7XG4gICAgfSwge1xuICAgICAgX3YkOiB1bmRlZmluZWQsXG4gICAgICBfdiQyOiB1bmRlZmluZWQsXG4gICAgICBfdiQzOiB1bmRlZmluZWQsXG4gICAgICBfdiQ0OiB1bmRlZmluZWRcbiAgICB9KTtcbiAgICByZXR1cm4gX2VsJDtcbiAgfSkoKTtcbn0pO1xuZnVuY3Rpb24gYnVpbGRUaGVtZSh0aGVtZSkge1xuICByZXR1cm4ge1xuICAgIGZnOiB0aGVtZS5mb3JlZ3JvdW5kLFxuICAgIGJnOiB0aGVtZS5iYWNrZ3JvdW5kLFxuICAgIHBhbGV0dGU6IGdlbmVyYXRlMjU2UGFsZXR0ZSh0aGVtZS5wYWxldHRlLCB0aGVtZS5iYWNrZ3JvdW5kLCB0aGVtZS5mb3JlZ3JvdW5kKVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0Q3NzVGhlbWUoZWwpIHtcbiAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3QgZm9yZWdyb3VuZCA9IG5vcm1hbGl6ZUhleENvbG9yKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCItLXRlcm0tY29sb3ItZm9yZWdyb3VuZFwiKSwgRkFMTEJBQ0tfVEhFTUUuZm9yZWdyb3VuZCk7XG4gIGNvbnN0IGJhY2tncm91bmQgPSBub3JtYWxpemVIZXhDb2xvcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiLS10ZXJtLWNvbG9yLWJhY2tncm91bmRcIiksIEZBTExCQUNLX1RIRU1FLmJhY2tncm91bmQpO1xuICBjb25zdCBwYWxldHRlID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgIGNvbnN0IGZhbGxiYWNrID0gaSA+PSA4ID8gcGFsZXR0ZVtpIC0gOF0gOiBGQUxMQkFDS19USEVNRS5wYWxldHRlW2ldO1xuICAgIHBhbGV0dGVbaV0gPSBub3JtYWxpemVIZXhDb2xvcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGAtLXRlcm0tY29sb3ItJHtpfWApLCBmYWxsYmFjayk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBmb3JlZ3JvdW5kLFxuICAgIGJhY2tncm91bmQsXG4gICAgcGFsZXR0ZVxuICB9O1xufVxuZnVuY3Rpb24gZ2VuZXJhdGUyNTZQYWxldHRlKGJhc2UxNiwgYmcsIGZnKSB7XG4gIGNvbnN0IGJnTGFiID0gaGV4VG9Pa2xhYihiZyk7XG4gIGNvbnN0IGZnTGFiID0gaGV4VG9Pa2xhYihmZyk7XG4gIGNvbnN0IGMxMDAgPSBoZXhUb09rbGFiKGJhc2UxNlsxXSk7XG4gIGNvbnN0IGMwMTAgPSBoZXhUb09rbGFiKGJhc2UxNlsyXSk7XG4gIGNvbnN0IGMxMTAgPSBoZXhUb09rbGFiKGJhc2UxNlszXSk7XG4gIGNvbnN0IGMwMDEgPSBoZXhUb09rbGFiKGJhc2UxNls0XSk7XG4gIGNvbnN0IGMxMDEgPSBoZXhUb09rbGFiKGJhc2UxNls1XSk7XG4gIGNvbnN0IGMwMTEgPSBoZXhUb09rbGFiKGJhc2UxNls2XSk7XG4gIGNvbnN0IHBhbGV0dGUgPSBbLi4uYmFzZTE2XTtcblxuICAvLyAyMTYgY29sb3IgY3ViZSByYW5nZVxuXG4gIGZvciAobGV0IHIgPSAwOyByIDwgNjsgciArPSAxKSB7XG4gICAgY29uc3QgdFIgPSByIC8gNTtcbiAgICBjb25zdCBjMCA9IGxlcnBPa2xhYih0UiwgYmdMYWIsIGMxMDApO1xuICAgIGNvbnN0IGMxID0gbGVycE9rbGFiKHRSLCBjMDEwLCBjMTEwKTtcbiAgICBjb25zdCBjMiA9IGxlcnBPa2xhYih0UiwgYzAwMSwgYzEwMSk7XG4gICAgY29uc3QgYzMgPSBsZXJwT2tsYWIodFIsIGMwMTEsIGZnTGFiKTtcbiAgICBmb3IgKGxldCBnID0gMDsgZyA8IDY7IGcgKz0gMSkge1xuICAgICAgY29uc3QgdEcgPSBnIC8gNTtcbiAgICAgIGNvbnN0IGM0ID0gbGVycE9rbGFiKHRHLCBjMCwgYzEpO1xuICAgICAgY29uc3QgYzUgPSBsZXJwT2tsYWIodEcsIGMyLCBjMyk7XG4gICAgICBmb3IgKGxldCBiID0gMDsgYiA8IDY7IGIgKz0gMSkge1xuICAgICAgICBjb25zdCB0QiA9IGIgLyA1O1xuICAgICAgICBjb25zdCBjNiA9IGxlcnBPa2xhYih0QiwgYzQsIGM1KTtcbiAgICAgICAgcGFsZXR0ZS5wdXNoKG9rbGFiVG9IZXgoYzYpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBncmF5c2NhbGUgcmFuZ2VcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpICs9IDEpIHtcbiAgICBjb25zdCB0ID0gKGkgKyAxKSAvIDI1O1xuICAgIHBhbGV0dGUucHVzaChva2xhYlRvSGV4KGxlcnBPa2xhYih0LCBiZ0xhYiwgZmdMYWIpKSk7XG4gIH1cbiAgcmV0dXJuIHBhbGV0dGU7XG59XG5mdW5jdGlvbiBkcmF3QmxvY2tHbHlwaChjdHgsIGNvZGVwb2ludCwgeCwgeSkge1xuICBjb25zdCB1bml0WCA9IEJMT0NLX0hfUkVTIC8gODtcbiAgY29uc3QgdW5pdFkgPSBCTE9DS19WX1JFUyAvIDg7XG4gIGNvbnN0IGhhbGZYID0gQkxPQ0tfSF9SRVMgLyAyO1xuICBjb25zdCBoYWxmWSA9IEJMT0NLX1ZfUkVTIC8gMjtcbiAgY29uc3Qgc2V4dGFudFggPSBCTE9DS19IX1JFUyAvIDI7XG4gIGNvbnN0IHNleHRhbnRZID0gQkxPQ0tfVl9SRVMgLyAzO1xuICBzd2l0Y2ggKGNvZGVwb2ludCkge1xuICAgIGNhc2UgMHgyNTgwOlxuICAgICAgLy8gdXBwZXIgaGFsZiBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTgwLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBCTE9DS19IX1JFUywgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODE6XG4gICAgICAvLyBsb3dlciBvbmUgZWlnaHRoIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODEvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSAqIDcsIEJMT0NLX0hfUkVTLCB1bml0WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4MjpcbiAgICAgIC8vIGxvd2VyIG9uZSBxdWFydGVyIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSAqIDYsIEJMT0NLX0hfUkVTLCB1bml0WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODM6XG4gICAgICAvLyBsb3dlciB0aHJlZSBlaWdodGhzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSAqIDUsIEJMT0NLX0hfUkVTLCB1bml0WSAqIDMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODQ6XG4gICAgICAvLyBsb3dlciBoYWxmIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBoYWxmWSwgQkxPQ0tfSF9SRVMsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTg1OlxuICAgICAgLy8gbG93ZXIgZml2ZSBlaWdodGhzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyB1bml0WSAqIDMsIEJMT0NLX0hfUkVTLCB1bml0WSAqIDUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODY6XG4gICAgICAvLyBsb3dlciB0aHJlZSBxdWFydGVycyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTg2LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgdW5pdFkgKiAyLCBCTE9DS19IX1JFUywgdW5pdFkgKiA2KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTg3OlxuICAgICAgLy8gbG93ZXIgc2V2ZW4gZWlnaHRocyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTg3LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgdW5pdFksIEJMT0NLX0hfUkVTLCB1bml0WSAqIDcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1ODg6XG4gICAgICAvLyBmdWxsIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODgvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIEJMT0NLX0hfUkVTLCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjVhMDpcbiAgICAgIC8vIGJsYWNrIHNxdWFyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNUEwLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgdW5pdFkgKiAyLCBCTE9DS19IX1JFUywgdW5pdFkgKiA0KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTg5OlxuICAgICAgLy8gbGVmdCBzZXZlbiBlaWdodGhzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1ODkvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHVuaXRYICogNywgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OGE6XG4gICAgICAvLyBsZWZ0IHRocmVlIHF1YXJ0ZXJzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OEEvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHVuaXRYICogNiwgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OGI6XG4gICAgICAvLyBsZWZ0IGZpdmUgZWlnaHRocyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNThCLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB1bml0WCAqIDUsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNThjOlxuICAgICAgLy8gbGVmdCBoYWxmIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OEMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIGhhbGZYLCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU4ZDpcbiAgICAgIC8vIGxlZnQgdGhyZWUgZWlnaHRocyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNThELylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB1bml0WCAqIDMsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNThlOlxuICAgICAgLy8gbGVmdCBvbmUgcXVhcnRlciBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNThFLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB1bml0WCAqIDIsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNThmOlxuICAgICAgLy8gbGVmdCBvbmUgZWlnaHRoIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzI1OEYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHVuaXRYLCBCTE9DS19WX1JFUyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5MDpcbiAgICAgIC8vIHJpZ2h0IGhhbGYgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5MC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIGhhbGZYLCB5LCBoYWxmWCwgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTE6XG4gICAgICAvLyBsaWdodCBzaGFkZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTkxLylcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjI1O1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIEJMT0NLX0hfUkVTLCBCTE9DS19WX1JFUyk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTI6XG4gICAgICAvLyBtZWRpdW0gc2hhZGUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5Mi8pXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMC41O1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIEJMT0NLX0hfUkVTLCBCTE9DS19WX1JFUyk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTM6XG4gICAgICAvLyBkYXJrIHNoYWRlIChodHRwczovL3N5bWJsLmNjL2VuLzI1OTMvKVxuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNzU7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgQkxPQ0tfSF9SRVMsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5NDpcbiAgICAgIC8vIHVwcGVyIG9uZSBlaWdodGggYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5NC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgQkxPQ0tfSF9SRVMsIHVuaXRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTk1OlxuICAgICAgLy8gcmlnaHQgb25lIGVpZ2h0aCBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTk1LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgdW5pdFggKiA3LCB5LCB1bml0WCwgQkxPQ0tfVl9SRVMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OTY6XG4gICAgICAvLyBxdWFkcmFudCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzI1OTYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBoYWxmWSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTk3OlxuICAgICAgLy8gcXVhZHJhbnQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5Ny8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIGhhbGZYLCB5ICsgaGFsZlksIGhhbGZYLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5ODpcbiAgICAgIC8vIHF1YWRyYW50IHVwcGVyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5OC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTk5OlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgbGVmdCBhbmQgbG93ZXIgbGVmdCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5OS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgaGFsZlgsIEJMT0NLX1ZfUkVTKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgaGFsZlgsIHkgKyBoYWxmWSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTlhOlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgbGVmdCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5QS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgaGFsZlgsIHkgKyBoYWxmWSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgyNTliOlxuICAgICAgLy8gcXVhZHJhbnQgdXBwZXIgbGVmdCBhbmQgdXBwZXIgcmlnaHQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjU5Qi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgQkxPQ0tfSF9SRVMsIGhhbGZZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgaGFsZlksIGhhbGZYLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5YzpcbiAgICAgIC8vIHF1YWRyYW50IHVwcGVyIGxlZnQgYW5kIHVwcGVyIHJpZ2h0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTlDLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBCTE9DS19IX1JFUywgaGFsZlkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBoYWxmWCwgeSArIGhhbGZZLCBoYWxmWCwgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDI1OWQ6XG4gICAgICAvLyBxdWFkcmFudCB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTlELylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgaGFsZlgsIHksIGhhbGZYLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5ZTpcbiAgICAgIC8vIHF1YWRyYW50IHVwcGVyIHJpZ2h0IGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzI1OUUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBoYWxmWCwgeSwgaGFsZlgsIGhhbGZZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgaGFsZlksIGhhbGZYLCBoYWxmWSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MjU5ZjpcbiAgICAgIC8vIHF1YWRyYW50IHVwcGVyIHJpZ2h0IGFuZCBsb3dlciBsZWZ0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNTlGLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgaGFsZlgsIHksIGhhbGZYLCBCTE9DS19WX1JFUyk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIGhhbGZZLCBoYWxmWCwgaGFsZlkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjAwOlxuICAgICAgLy8gc2V4dGFudC0xOiB1cHBlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjAwLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjAxOlxuICAgICAgLy8gc2V4dGFudC0yOiB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwMS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjAyOlxuICAgICAgLy8gc2V4dGFudC0xMjogdXBwZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjAyLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwMzpcbiAgICAgIC8vIHNleHRhbnQtMzogbWlkZGxlIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwNDpcbiAgICAgIC8vIHNleHRhbnQtMTM6IHRvcC1sZWZ0IGFuZCBtaWRkbGUtbGVmdCBmaWxsZWQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjA1OlxuICAgICAgLy8gc2V4dGFudC0yMzogdXBwZXIgcmlnaHQgYW5kIG1pZGRsZSBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjA1LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjA2OlxuICAgICAgLy8gc2V4dGFudC0xMjM6IHVwcGVyIG9uZSB0aGlyZCBhbmQgbWlkZGxlIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMDYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwNzpcbiAgICAgIC8vIHNleHRhbnQtNDogbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjA3LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwODpcbiAgICAgIC8vIHNleHRhbnQtMTQ6IHVwcGVyIGxlZnQgYW5kIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwOC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwOTpcbiAgICAgIC8vIHNleHRhbnQtMjQ6IHRvcC1yaWdodCBhbmQgbWlkZGxlLXJpZ2h0IGZpbGxlZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwOS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjBhOlxuICAgICAgLy8gc2V4dGFudC0xMjQ6IHVwcGVyIG9uZSB0aGlyZCBhbmQgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjBBLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwYjpcbiAgICAgIC8vIHNleHRhbnQtMzQ6IG1pZGRsZSBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMEIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMGM6XG4gICAgICAvLyBzZXh0YW50LTEzNDogdXBwZXIgbGVmdCwgbWlkZGxlIGxlZnQgYW5kIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIwQy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjBkOlxuICAgICAgLy8gc2V4dGFudC0yMzQ6IHVwcGVyIHJpZ2h0IGFuZCBtaWRkbGUgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjBELylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIwZTpcbiAgICAgIC8vIHNleHRhbnQtMTIzNDogdG9wIGFuZCBtaWRkbGUgcm93cyBmaWxsZWQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMEUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMGY6XG4gICAgICAvLyBzZXh0YW50LTU6IGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMEYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTA6XG4gICAgICAvLyBzZXh0YW50LTE1OiB1cHBlciBsZWZ0IGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjEwLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTE6XG4gICAgICAvLyBzZXh0YW50LTI1OiB1cHBlciByaWdodCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxMS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTI6XG4gICAgICAvLyBzZXh0YW50LTEyNTogdXBwZXIgb25lIHRoaXJkIGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjEyLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjEzOlxuICAgICAgLy8gc2V4dGFudC0zNTogbWlkZGxlIGxlZnQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTQ6XG4gICAgICAvLyBzZXh0YW50LTIzNTogdXBwZXIgcmlnaHQgYW5kIGxlZnQgY29sdW1uIGxvd2VyIHR3byB0aGlyZHMgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjE1OlxuICAgICAgLy8gc2V4dGFudC0xMjM1OiB1cHBlciBvbmUgdGhpcmQgYW5kIGxlZnQgY29sdW1uIGxvd2VyIHR3byB0aGlyZHMgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTY6XG4gICAgICAvLyBzZXh0YW50LTQ1OiBtaWRkbGUgcmlnaHQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTc6XG4gICAgICAvLyBzZXh0YW50LTE0NTogdXBwZXIgbGVmdCwgbWlkZGxlIHJpZ2h0IGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjE3LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMTg6XG4gICAgICAvLyBzZXh0YW50LTI0NTogcmlnaHQgY29sdW1uIHVwcGVyIHR3byB0aGlyZHMgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTgvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZICogMik7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxOTpcbiAgICAgIC8vIHNleHRhbnQtMTI0NTogdXBwZXIgb25lIHRoaXJkLCBtaWRkbGUgcmlnaHQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMTkvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMWE6XG4gICAgICAvLyBzZXh0YW50LTM0NTogbWlkZGxlIG9uZSB0aGlyZCBhbmQgbG93ZXIgbGVmdCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIxQS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjFiOlxuICAgICAgLy8gc2V4dGFudC0xMzQ1OiBsZWZ0IGNvbHVtbiBhbmQgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjFCLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkgKiAzKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxYzpcbiAgICAgIC8vIHNleHRhbnQtMjM0NTogdXBwZXIgcmlnaHQsIG1pZGRsZSBvbmUgdGhpcmQgYW5kIGxvd2VyIGxlZnQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMUMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMWQ6XG4gICAgICAvLyBzZXh0YW50LTEyMzQ1OiB1cHBlciB0d28gdGhpcmRzIGFuZCBsb3dlciBsZWZ0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjFELylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZICogMik7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxZTpcbiAgICAgIC8vIHNleHRhbnQtNjogbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMUUvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIxZjpcbiAgICAgIC8vIHNleHRhbnQtMTY6IHVwcGVyIGxlZnQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjFGLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyMDpcbiAgICAgIC8vIHNleHRhbnQtMjY6IHVwcGVyIHJpZ2h0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyMC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyMTpcbiAgICAgIC8vIHNleHRhbnQtMTI2OiB1cHBlciBvbmUgdGhpcmQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjIxLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjI6XG4gICAgICAvLyBzZXh0YW50LTM2OiBtaWRkbGUgbGVmdCBhbmQgbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMjIvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjM6XG4gICAgICAvLyBzZXh0YW50LTEzNjogdXBwZXIgbGVmdCwgbWlkZGxlIGxlZnQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjIzLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjQ6XG4gICAgICAvLyBzZXh0YW50LTIzNjogdXBwZXIgcmlnaHQsIG1pZGRsZSBsZWZ0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyNC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMjU6XG4gICAgICAvLyBzZXh0YW50LTEyMzY6IHVwcGVyIG9uZSB0aGlyZCwgbWlkZGxlIGxlZnQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjI1LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjI2OlxuICAgICAgLy8gc2V4dGFudC00NjogbWlkZGxlIHJpZ2h0IGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyNi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjI3OlxuICAgICAgLy8gc2V4dGFudC0xNDY6IHVwcGVyIGxlZnQgYW5kIHJpZ2h0IGNvbHVtbiBsb3dlciB0d28gdGhpcmRzIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjI3LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyODpcbiAgICAgIC8vIHNleHRhbnQtMTI0NjogdXBwZXIgb25lIHRoaXJkIGFuZCByaWdodCBjb2x1bW4gbG93ZXIgdHdvIHRoaXJkcyAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyOC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjI5OlxuICAgICAgLy8gc2V4dGFudC0zNDY6IG1pZGRsZSBvbmUgdGhpcmQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjI5LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyYTpcbiAgICAgIC8vIHNleHRhbnQtMTM0NjogbGVmdCBjb2x1bW4gdXBwZXIgdHdvIHRoaXJkcyBhbmQgcmlnaHQgY29sdW1uIGxvd2VyIHR3byB0aGlyZHMgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMkEvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyYjpcbiAgICAgIC8vIHNleHRhbnQtMjM0NjogdXBwZXIgcmlnaHQsIG1pZGRsZSBvbmUgdGhpcmQgYW5kIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjJCLylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMmM6XG4gICAgICAvLyBzZXh0YW50LTEyMzQ2OiB1cHBlciB0d28gdGhpcmRzIGFuZCBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyQy8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSAqIDIpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIyZDpcbiAgICAgIC8vIHNleHRhbnQtNTY6IGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIyRC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMmU6XG4gICAgICAvLyBzZXh0YW50LTE1NjogdXBwZXIgbGVmdCBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjJFLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjJmOlxuICAgICAgLy8gc2V4dGFudC0yNTY6IHVwcGVyIHJpZ2h0IGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMkYvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzMDpcbiAgICAgIC8vIHNleHRhbnQtMTI1NjogdXBwZXIgb25lIHRoaXJkIGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzAvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjMxOlxuICAgICAgLy8gc2V4dGFudC0zNTY6IG1pZGRsZSBsZWZ0IGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzEvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzMjpcbiAgICAgIC8vIHNleHRhbnQtMTM1NjogbGVmdCBjb2x1bW4gdXBwZXIgdHdvIHRoaXJkcyBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjMyLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkgKiAyKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzMzpcbiAgICAgIC8vIHNleHRhbnQtMjM1NjogdXBwZXIgcmlnaHQsIG1pZGRsZSBsZWZ0IGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzMvKVxuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMzQ6XG4gICAgICAvLyBzZXh0YW50LTEyMzU2OiB1cHBlciBvbmUgdGhpcmQsIG1pZGRsZSBsZWZ0IGFuZCBsb3dlciBvbmUgdGhpcmQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCMzQvKVxuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5ICsgc2V4dGFudFkgKiAyLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMHgxZmIzNTpcbiAgICAgIC8vIHNleHRhbnQtNDU2OiBtaWRkbGUgcmlnaHQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzNS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMzY6XG4gICAgICAvLyBzZXh0YW50LTE0NTY6IHVwcGVyIGxlZnQsIG1pZGRsZSByaWdodCBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjM2LylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHggKyBzZXh0YW50WCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjM3OlxuICAgICAgLy8gc2V4dGFudC0yNDU2OiByaWdodCBjb2x1bW4gdXBwZXIgdHdvIHRoaXJkcyBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjM3LylcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHksIHNleHRhbnRYLCBzZXh0YW50WSAqIDIpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYICogMiwgc2V4dGFudFkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAweDFmYjM4OlxuICAgICAgLy8gc2V4dGFudC0xMjQ1NjogdXBwZXIgb25lIHRoaXJkLCBtaWRkbGUgcmlnaHQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzOC8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5ICsgc2V4dGFudFksIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZICogMiwgc2V4dGFudFggKiAyLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiMzk6XG4gICAgICAvLyBzZXh0YW50LTM0NTY6IG1pZGRsZSBvbmUgdGhpcmQgYW5kIGxvd2VyIG9uZSB0aGlyZCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzOS8pXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSArIHNleHRhbnRZLCBzZXh0YW50WCAqIDIsIHNleHRhbnRZICogMik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiM2E6XG4gICAgICAvLyBzZXh0YW50LTEzNDU2OiBsZWZ0IGNvbHVtbiBhbmQgbG93ZXIgb25lIHRoaXJkIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjNBLylcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBzZXh0YW50WCwgc2V4dGFudFkgKiAzKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFgsIHNleHRhbnRZKTtcbiAgICAgIGN0eC5maWxsUmVjdCh4ICsgc2V4dGFudFgsIHkgKyBzZXh0YW50WSAqIDIsIHNleHRhbnRYLCBzZXh0YW50WSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDB4MWZiM2I6XG4gICAgICAvLyBzZXh0YW50LTIzNDU2OiB1cHBlciByaWdodCBhbmQgbG93ZXIgdHdvIHRoaXJkcyAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkIzQi8pXG4gICAgICBjdHguZmlsbFJlY3QoeCArIHNleHRhbnRYLCB5LCBzZXh0YW50WCwgc2V4dGFudFkpO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHkgKyBzZXh0YW50WSwgc2V4dGFudFggKiAyLCBzZXh0YW50WSAqIDIpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cbmNvbnN0IFNZTUJPTF9TVFJPS0UgPSAwLjA1O1xuY29uc3QgQ0VMTF9SQVRJTyA9IDkuMDM3NSAvIDIwO1xuZnVuY3Rpb24gZ2V0VmVjdG9yU3ltYm9sRGVmKGNvZGVwb2ludCkge1xuICBjb25zdCBzdHJva2UgPSBgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiJHtTWU1CT0xfU1RST0tFfVwiIHN0cm9rZS1saW5lam9pbj1cIm1pdGVyXCIgc3Ryb2tlLWxpbmVjYXA9XCJzcXVhcmVcImA7XG4gIGNvbnN0IHN0cm9rZUJ1dHQgPSBgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiJHtTWU1CT0xfU1RST0tFfVwiIHN0cm9rZS1saW5lam9pbj1cIm1pdGVyXCIgc3Ryb2tlLWxpbmVjYXA9XCJidXR0XCJgO1xuICBjb25zdCBzdHJva2VkID0gZCA9PiBgPHBhdGggZD1cIiR7ZH1cIiBmaWxsPVwibm9uZVwiICR7c3Ryb2tlfS8+YDtcbiAgY29uc3QgdGhpcmQgPSAxIC8gMztcbiAgY29uc3QgdHdvVGhpcmRzID0gMiAvIDM7XG4gIHN3aXRjaCAoY29kZXBvaW50KSB7XG4gICAgLy8gXHUyNUUyIC0gYmxhY2sgbG93ZXIgcmlnaHQgdHJpYW5nbGUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMjVFMi8pXG4gICAgY2FzZSAweDI1ZTI6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMSwxIEwxLDAgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0xLDEgTDEsMCBMMCwxIFpcIik7XG5cbiAgICAvLyBcdTI1RTMgLSBibGFjayBsb3dlciBsZWZ0IHRyaWFuZ2xlIChodHRwczovL3N5bWJsLmNjL2VuLzI1RTMvKVxuICAgIGNhc2UgMHgyNWUzOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMSBMMCwwIEwxLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwxIEwwLDAgTDEsMSBaXCIpO1xuXG4gICAgLy8gXHUyNUU0IC0gYmxhY2sgdXBwZXIgbGVmdCB0cmlhbmdsZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8yNUU0LylcbiAgICBjYXNlIDB4MjVlNDpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLDAgTDEsMCBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAsMCBMMSwwIEwwLDEgWlwiKTtcblxuICAgIC8vIFx1MjVFNSAtIGJsYWNrIHVwcGVyIHJpZ2h0IHRyaWFuZ2xlIChodHRwczovL3N5bWJsLmNjL2VuLzI1RTUvKVxuICAgIGNhc2UgMHgyNWU1OlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTEsMCBMMSwxIEwwLDAgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMSwwIEwxLDEgTDAsMCBaXCIpO1xuICAgIGNhc2UgMHgyNjhmOlxuICAgICAge1xuICAgICAgICAvLyBcdTI2OEYgLSBkaWdyYW0gZm9yIGdyZWF0ZXIgeWluIChodHRwczovL3N5bWJsLmNjL2VuLzI2OEYvKVxuICAgICAgICBjb25zdCBob3Jpem9udGFsR2FwID0gMC4xNTtcbiAgICAgICAgY29uc3QgdmVydGljYWxHYXAgPSAwLjI7XG4gICAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSAwLjE3O1xuICAgICAgICBjb25zdCBoYWxmSG9yaXpvbnRhbEdhcCA9IGhvcml6b250YWxHYXAgLyAyO1xuICAgICAgICBjb25zdCBoYWxmVmVydGljYWxHYXAgPSB2ZXJ0aWNhbEdhcCAvIDI7XG4gICAgICAgIGNvbnN0IHRvVmlld0JveFkgPSBvZmZzZXQgPT4gMC41ICsgb2Zmc2V0ICogQ0VMTF9SQVRJTztcbiAgICAgICAgY29uc3QgbGVmdFgxID0gMC41IC0gaGFsZkhvcml6b250YWxHYXA7XG4gICAgICAgIGNvbnN0IHJpZ2h0WDAgPSAwLjUgKyBoYWxmSG9yaXpvbnRhbEdhcDtcbiAgICAgICAgY29uc3QgcmlnaHRYMSA9IDEgKyAwLjAyOyAvLyBzbGlnaHQgb3ZlcmRyYXdcbiAgICAgICAgY29uc3QgdG9wWTAgPSB0b1ZpZXdCb3hZKC1oYWxmVmVydGljYWxHYXAgLSBsaW5lSGVpZ2h0KTtcbiAgICAgICAgY29uc3QgdG9wWTEgPSB0b1ZpZXdCb3hZKC1oYWxmVmVydGljYWxHYXApO1xuICAgICAgICBjb25zdCBib3R0b21ZMCA9IHRvVmlld0JveFkoaGFsZlZlcnRpY2FsR2FwKTtcbiAgICAgICAgY29uc3QgYm90dG9tWTEgPSB0b1ZpZXdCb3hZKGhhbGZWZXJ0aWNhbEdhcCArIGxpbmVIZWlnaHQpO1xuICAgICAgICBjb25zdCByZWN0ID0gKHgwLCB4MSwgeTAsIHkxKSA9PiBgTSR7eDB9LCR7eTB9IEwke3gxfSwke3kwfSBMJHt4MX0sJHt5MX0gTCR7eDB9LCR7eTF9IFpgO1xuICAgICAgICByZXR1cm4gYDxwYXRoIGQ9XCIke3JlY3QoMCwgbGVmdFgxLCB0b3BZMCwgdG9wWTEpfSAke3JlY3QocmlnaHRYMCwgcmlnaHRYMSwgdG9wWTAsIHRvcFkxKX0gJHtyZWN0KDAsIGxlZnRYMSwgYm90dG9tWTAsIGJvdHRvbVkxKX0gJHtyZWN0KHJpZ2h0WDAsIHJpZ2h0WDEsIGJvdHRvbVkwLCBib3R0b21ZMSl9XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gO1xuICAgICAgfVxuXG4gICAgLy8gXHVEODNFXHVERjNDIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byBsb3dlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCM0MvKVxuICAgIGNhc2UgMHgxZmIzYzpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dHdvVGhpcmRzfSBMMCwxIEwwLjUsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0d29UaGlyZHN9IEwwLDEgTDAuNSwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REYzRCAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbWlkZGxlIGxlZnQgdG8gbG93ZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCM0QvKVxuICAgIGNhc2UgMHgxZmIzZDpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dHdvVGhpcmRzfSBMMCwxIEwxLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dHdvVGhpcmRzfSBMMCwxIEwxLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjNFIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byBsb3dlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCM0UvKVxuICAgIGNhc2UgMHgxZmIzZTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLCR7dGhpcmR9IEwwLjUsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3RoaXJkfSBMMC41LDEgTDAsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGM0YgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjNGLylcbiAgICBjYXNlIDB4MWZiM2Y6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwxLDEgTDAsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNDAgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGxlZnQgdG8gbG93ZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQwLylcbiAgICBjYXNlIDB4MWZiNDA6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwwLjUsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAsMCBMMC41LDEgTDAsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjQxIC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbWlkZGxlIGxlZnQgdG8gdXBwZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQxLylcbiAgICBjYXNlIDB4MWZiNDE6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMCwxIEwxLDEgTDEsMCBMMC41LDAgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwwLDEgTDEsMSBMMSwwIEwwLjUsMCBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNDIgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0Mi8pXG4gICAgY2FzZSAweDFmYjQyOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0aGlyZH0gTDAsMSBMMSwxIEwxLDAgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwwLDEgTDEsMSBMMSwwIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0MyAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIG1pZGRsZSBsZWZ0IHRvIHVwcGVyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0My8pXG4gICAgY2FzZSAweDFmYjQzOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0d29UaGlyZHN9IEwwLDEgTDEsMSBMMSwwIEwwLjUsMCBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0d29UaGlyZHN9IEwwLDEgTDEsMSBMMSwwIEwwLjUsMCBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNDQgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0NC8pXG4gICAgY2FzZSAweDFmYjQ0OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0d29UaGlyZHN9IEwwLDEgTDEsMSBMMSwwIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3R3b1RoaXJkc30gTDAsMSBMMSwxIEwxLDAgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjQ1IC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbGVmdCB0byB1cHBlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDUvKVxuICAgIGNhc2UgMHgxZmI0NTpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLjUsMCBMMSwwIEwxLDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0wLjUsMCBMMSwwIEwxLDEgTDAsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjQ2IC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbWlkZGxlIGxlZnQgdG8gdXBwZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQ2LylcbiAgICBjYXNlIDB4MWZiNDY6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3R3b1RoaXJkc30gTDAsMSBMMSwxIEwxLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3R3b1RoaXJkc30gTDAsMSBMMSwxIEwxLCR7dGhpcmR9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0NyAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGNlbnRyZSB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDcvKVxuICAgIGNhc2UgMHgxZmI0NzpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLjUsMSBMMSwxIEwxLCR7dHdvVGhpcmRzfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAuNSwxIEwxLDEgTDEsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0OCAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGxlZnQgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjQ4LylcbiAgICBjYXNlIDB4MWZiNDg6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwxIEwxLDEgTDEsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwxIEwxLDEgTDEsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0OSAtIGxvd2VyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGNlbnRyZSB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNDkvKVxuICAgIGNhc2UgMHgxZmI0OTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLjUsMSBMMSwxIEwxLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMC41LDEgTDEsMSBMMSwke3RoaXJkfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNEEgLSBsb3dlciByaWdodCBibG9jayBkaWFnb25hbCBsb3dlciBsZWZ0IHRvIHVwcGVyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI0QS8pXG4gICAgY2FzZSAweDFmYjRhOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMSBMMSwxIEwxLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwxIEwxLDEgTDEsJHt0aGlyZH0gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjRCIC0gbG93ZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgY2VudHJlIHRvIHVwcGVyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjRCLylcbiAgICBjYXNlIDB4MWZiNGI6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMC41LDEgTDEsMCBMMSwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAuNSwxIEwxLDAgTDEsMSBaXCIpO1xuXG4gICAgLy8gXHVEODNFXHVERjRDIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBjZW50cmUgdG8gdXBwZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjRDLylcbiAgICBjYXNlIDB4MWZiNGM6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwwLjUsMCBMMSwke3RoaXJkfSBMMSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDAuNSwwIEwxLCR7dGhpcmR9IEwxLDEgTDAsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNEQgLSBsb3dlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGxlZnQgdG8gdXBwZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjRELylcbiAgICBjYXNlIDB4MWZiNGQ6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwwLDEgTDEsMSBMMSwke3RoaXJkfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMCwxIEwxLDEgTDEsJHt0aGlyZH0gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjRFIC0gbG93ZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBjZW50cmUgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjRFLylcbiAgICBjYXNlIDB4MWZiNGU6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwwLjUsMCBMMSwke3R3b1RoaXJkc30gTDEsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwwLjUsMCBMMSwke3R3b1RoaXJkc30gTDEsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY0RiAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbGVmdCB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNEYvKVxuICAgIGNhc2UgMHgxZmI0ZjpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsJHt0d29UaGlyZHN9IEwxLDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMSwke3R3b1RoaXJkc30gTDEsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1MCAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgY2VudHJlIHRvIGxvd2VyIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjUwLylcbiAgICBjYXNlIDB4MWZiNTA6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwwLjUsMCBMMSwxIEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwwIEwwLjUsMCBMMSwxIEwwLDEgWlwiKTtcblxuICAgIC8vIFx1RDgzRVx1REY1MSAtIGxvd2VyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbWlkZGxlIGxlZnQgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjUxLylcbiAgICBjYXNlIDB4MWZiNTE6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMSwke3R3b1RoaXJkc30gTDEsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3RoaXJkfSBMMSwke3R3b1RoaXJkc30gTDEsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1MiAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1Mi8pXG4gICAgY2FzZSAweDFmYjUyOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0d29UaGlyZHN9IEwwLDAgTDEsMCBMMSwxIEwwLjUsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0d29UaGlyZHN9IEwwLDAgTDEsMCBMMSwxIEwwLjUsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNTMgLSB1cHBlciByaWdodCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1My8pXG4gICAgY2FzZSAweDFmYjUzOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0d29UaGlyZHN9IEwwLDAgTDEsMCBMMSwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwke3R3b1RoaXJkc30gTDAsMCBMMSwwIEwxLDEgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjU0IC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbWlkZGxlIGxlZnQgdG8gbG93ZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjU0LylcbiAgICBjYXNlIDB4MWZiNTQ6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMCwwIEwxLDAgTDEsMSBMMC41LDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwwLDAgTDEsMCBMMSwxIEwwLjUsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNTUgLSB1cHBlciByaWdodCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1NS8pXG4gICAgY2FzZSAweDFmYjU1OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0aGlyZH0gTDAsMCBMMSwwIEwxLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLCR7dGhpcmR9IEwwLDAgTDEsMCBMMSwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1NiAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGxlZnQgdG8gbG93ZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjU2LylcbiAgICBjYXNlIDB4MWZiNTY6XG4gICAgICByZXR1cm4gJzxwYXRoIGQ9XCJNMCwwIEwxLDAgTDEsMSBMMC41LDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIHN0cm9rZWQoXCJNMCwwIEwxLDAgTDEsMSBMMC41LDEgWlwiKTtcblxuICAgIC8vIFx1RDgzRVx1REY1NyAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbWlkZGxlIGxlZnQgdG8gdXBwZXIgY2VudHJlIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjU3LylcbiAgICBjYXNlIDB4MWZiNTc6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwke3RoaXJkfSBMMC41LDAgTDAsMCBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDAuNSwwIEwwLDAgWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjU4IC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCB1cHBlciBtaWRkbGUgbGVmdCB0byB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1OC8pXG4gICAgY2FzZSAweDFmYjU4OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwwIEwwLCR7dGhpcmR9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDAsJHt0aGlyZH0gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjU5IC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBtaWRkbGUgbGVmdCB0byB1cHBlciBjZW50cmUgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNTkvKVxuICAgIGNhc2UgMHgxZmI1OTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDAuNSwwIEwwLCR7dHdvVGhpcmRzfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMC41LDAgTDAsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1QSAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbWlkZGxlIGxlZnQgdG8gdXBwZXIgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNUEvKVxuICAgIGNhc2UgMHgxZmI1YTpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMCwke3R3b1RoaXJkc30gWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDEsMCBMMCwke3R3b1RoaXJkc30gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjVCIC0gdXBwZXIgbGVmdCBibG9jayBkaWFnb25hbCBsb3dlciBsZWZ0IHRvIHVwcGVyIGNlbnRyZSAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1Qi8pXG4gICAgY2FzZSAweDFmYjViOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMCBMMC41LDAgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0wLDAgTDAuNSwwIEwwLDEgWlwiKTtcblxuICAgIC8vIFx1RDgzRVx1REY1QyAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbWlkZGxlIGxlZnQgdG8gdXBwZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjVDLylcbiAgICBjYXNlIDB4MWZiNWM6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwxLDAgTDEsJHt0aGlyZH0gTDAsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDEsJHt0aGlyZH0gTDAsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY1RCAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgY2VudHJlIHRvIGxvd2VyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI1RC8pXG4gICAgY2FzZSAweDFmYjVkOlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsMCBMMSwwIEwxLCR7dHdvVGhpcmRzfSBMMC41LDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMSwwIEwxLCR7dHdvVGhpcmRzfSBMMC41LDEgTDAsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNUUgLSB1cHBlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGxlZnQgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjVFLylcbiAgICBjYXNlIDB4MWZiNWU6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+YCArIHN0cm9rZWQoYE0wLDAgTDEsMCBMMSwke3R3b1RoaXJkc30gTDAsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNUYgLSB1cHBlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGNlbnRyZSB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNUYvKVxuICAgIGNhc2UgMHgxZmI1ZjpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwke3RoaXJkfSBMMC41LDEgTDAsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMSwwIEwxLCR7dGhpcmR9IEwwLjUsMSBMMCwxIFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY2MCAtIHVwcGVyIGxlZnQgYmxvY2sgZGlhZ29uYWwgbG93ZXIgbGVmdCB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjAvKVxuICAgIGNhc2UgMHgxZmI2MDpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwke3RoaXJkfSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDEsJHt0aGlyZH0gTDAsMSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNjEgLSB1cHBlciBsZWZ0IGJsb2NrIGRpYWdvbmFsIGxvd2VyIGNlbnRyZSB0byB1cHBlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2MS8pXG4gICAgY2FzZSAweDFmYjYxOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMCBMMSwwIEwwLjUsMSBMMCwxIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAsMCBMMSwwIEwwLjUsMSBMMCwxIFpcIik7XG5cbiAgICAvLyBcdUQ4M0VcdURGNjIgLSB1cHBlciByaWdodCBibG9jayBkaWFnb25hbCB1cHBlciBjZW50cmUgdG8gdXBwZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjYyLylcbiAgICBjYXNlIDB4MWZiNjI6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMC41LDAgTDEsMCBMMSwke3RoaXJkfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAuNSwwIEwxLDAgTDEsJHt0aGlyZH0gWmApO1xuXG4gICAgLy8gXHVEODNFXHVERjYzIC0gdXBwZXIgcmlnaHQgYmxvY2sgZGlhZ29uYWwgdXBwZXIgbGVmdCB0byB1cHBlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjMvKVxuICAgIGNhc2UgMHgxZmI2MzpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLDAgTDEsMCBMMSwke3RoaXJkfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsMCBMMSwwIEwxLCR7dGhpcmR9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY2NCAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGNlbnRyZSB0byBsb3dlciBtaWRkbGUgcmlnaHQgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjQvKVxuICAgIGNhc2UgMHgxZmI2NDpcbiAgICAgIHJldHVybiBgPHBhdGggZD1cIk0wLjUsMCBMMSwwIEwxLCR7dHdvVGhpcmRzfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAuNSwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY2NSAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGxlZnQgdG8gbG93ZXIgbWlkZGxlIHJpZ2h0IChodHRwczovL3N5bWJsLmNjL2VuLzFGQjY1LylcbiAgICBjYXNlIDB4MWZiNjU6XG4gICAgICByZXR1cm4gYDxwYXRoIGQ9XCJNMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPmAgKyBzdHJva2VkKGBNMCwwIEwxLDAgTDEsJHt0d29UaGlyZHN9IFpgKTtcblxuICAgIC8vIFx1RDgzRVx1REY2NiAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIGNlbnRyZSB0byBsb3dlciByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2Ni8pXG4gICAgY2FzZSAweDFmYjY2OlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAuNSwwIEwxLDAgTDEsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgc3Ryb2tlZChcIk0wLjUsMCBMMSwwIEwxLDEgWlwiKTtcblxuICAgIC8vIFx1RDgzRVx1REY2NyAtIHVwcGVyIHJpZ2h0IGJsb2NrIGRpYWdvbmFsIHVwcGVyIG1pZGRsZSBsZWZ0IHRvIGxvd2VyIG1pZGRsZSByaWdodCAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2Ny8pXG4gICAgY2FzZSAweDFmYjY3OlxuICAgICAgcmV0dXJuIGA8cGF0aCBkPVwiTTAsJHt0aGlyZH0gTDAsMCBMMSwwIEwxLCR7dHdvVGhpcmRzfSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5gICsgc3Ryb2tlZChgTTAsJHt0aGlyZH0gTDAsMCBMMSwwIEwxLCR7dHdvVGhpcmRzfSBaYCk7XG5cbiAgICAvLyBcdUQ4M0VcdURGNjggLSB1cHBlciBhbmQgcmlnaHQgYW5kIGxvd2VyIHRyaWFuZ3VsYXIgdGhyZWUgcXVhcnRlcnMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNjgvKVxuICAgIGNhc2UgMHgxZmI2ODpcbiAgICAgIHJldHVybiAnPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNMCwwIEwxLDAgTDEsMSBMMCwxIFogTTAsMCBMMCwxIEwwLjUsMC41IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBgPHBhdGggZD1cIk0wLDAgTDEsMCBNMCwxIEwxLDEgTTEsMCBMMSwxXCIgZmlsbD1cIm5vbmVcIiAke3N0cm9rZX0vPmAgKyBgPHBhdGggZD1cIk0wLDAgTDAuNSwwLjUgTTAsMSBMMC41LDAuNVwiIGZpbGw9XCJub25lXCIgJHtzdHJva2VCdXR0fS8+YDtcblxuICAgIC8vIFx1RDgzRVx1REY2OSAtIGxlZnQgYW5kIGxvd2VyIGFuZCByaWdodCB0cmlhbmd1bGFyIHRocmVlIHF1YXJ0ZXJzIGJsb2NrIChodHRwczovL3N5bWJsLmNjL2VuLzFGQjY5LylcbiAgICBjYXNlIDB4MWZiNjk6XG4gICAgICByZXR1cm4gJzxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTAsMCBMMSwwIEwxLDEgTDAsMSBaIE0wLDAgTDEsMCBMMC41LDAuNSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nICsgYDxwYXRoIGQ9XCJNMCwwIEwwLDEgTTEsMCBMMSwxIE0wLDEgTDEsMVwiIGZpbGw9XCJub25lXCIgJHtzdHJva2V9Lz5gICsgYDxwYXRoIGQ9XCJNMCwwIEwwLjUsMC41IE0xLDAgTDAuNSwwLjVcIiBmaWxsPVwibm9uZVwiICR7c3Ryb2tlQnV0dH0vPmA7XG5cbiAgICAvLyBcdUQ4M0VcdURGNkEgLSB1cHBlciBhbmQgbGVmdCBhbmQgbG93ZXIgdHJpYW5ndWxhciB0aHJlZSBxdWFydGVycyBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2QS8pXG4gICAgY2FzZSAweDFmYjZhOlxuICAgICAgcmV0dXJuICc8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0wLDAgTDEsMCBMMSwxIEwwLDEgWiBNMSwwIEwxLDEgTDAuNSwwLjUgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JyArIGA8cGF0aCBkPVwiTTAsMCBMMSwwIE0wLDEgTDEsMSBNMCwwIEwwLDFcIiBmaWxsPVwibm9uZVwiICR7c3Ryb2tlfS8+YCArIGA8cGF0aCBkPVwiTTEsMCBMMC41LDAuNSBNMSwxIEwwLjUsMC41XCIgZmlsbD1cIm5vbmVcIiAke3N0cm9rZUJ1dHR9Lz5gO1xuXG4gICAgLy8gXHVEODNFXHVERjZCIC0gbGVmdCBhbmQgdXBwZXIgYW5kIHJpZ2h0IHRyaWFuZ3VsYXIgdGhyZWUgcXVhcnRlcnMgYmxvY2sgKGh0dHBzOi8vc3ltYmwuY2MvZW4vMUZCNkIvKVxuICAgIGNhc2UgMHgxZmI2YjpcbiAgICAgIHJldHVybiAnPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNMCwwIEwxLDAgTDEsMSBMMCwxIFogTTAsMSBMMSwxIEwwLjUsMC41IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBgPHBhdGggZD1cIk0wLDAgTDEsMCBNMCwwIEwwLDEgTTEsMCBMMSwxXCIgZmlsbD1cIm5vbmVcIiAke3N0cm9rZX0vPmAgKyBgPHBhdGggZD1cIk0wLDEgTDAuNSwwLjUgTTEsMSBMMC41LDAuNVwiIGZpbGw9XCJub25lXCIgJHtzdHJva2VCdXR0fS8+YDtcblxuICAgIC8vIFx1RDgzRVx1REY2QyAtIGxlZnQgdHJpYW5ndWxhciBvbmUgcXVhcnRlciBibG9jayAoaHR0cHM6Ly9zeW1ibC5jYy9lbi8xRkI2Qy8pXG4gICAgY2FzZSAweDFmYjZjOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMCBMMCwxIEwwLjUsMC41IFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPicgKyBzdHJva2VkKFwiTTAsMCBMMCwxIEwwLjUsMC41IFpcIik7XG5cbiAgICAvLyBwb3dlcmxpbmUgcmlnaHQgZnVsbCB0cmlhbmdsZSAoaHR0cHM6Ly93d3cubmVyZGZvbnRzLmNvbS9jaGVhdC1zaGVldClcbiAgICBjYXNlIDB4ZTBiMDpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0wLDAgTDEsMC41IEwwLDEgWlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+JztcblxuICAgIC8vIHBvd2VybGluZSByaWdodCBicmFja2V0IChodHRwczovL3d3dy5uZXJkZm9udHMuY29tL2NoZWF0LXNoZWV0KVxuICAgIGNhc2UgMHhlMGIxOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTAsMCBMMSwwLjUgTDAsMVwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMC4wN1wiIHN0cm9rZS1saW5lam9pbj1cIm1pdGVyXCIvPic7XG5cbiAgICAvLyBwb3dlcmxpbmUgbGVmdCBmdWxsIHRyaWFuZ2xlIChodHRwczovL3d3dy5uZXJkZm9udHMuY29tL2NoZWF0LXNoZWV0KVxuICAgIGNhc2UgMHhlMGIyOlxuICAgICAgcmV0dXJuICc8cGF0aCBkPVwiTTEsMCBMMCwwLjUgTDEsMSBaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz4nO1xuXG4gICAgLy8gcG93ZXJsaW5lIGxlZnQgYnJhY2tldCAoaHR0cHM6Ly93d3cubmVyZGZvbnRzLmNvbS9jaGVhdC1zaGVldClcbiAgICBjYXNlIDB4ZTBiMzpcbiAgICAgIHJldHVybiAnPHBhdGggZD1cIk0xLDAgTDAsMC41IEwxLDFcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjAuMDdcIiBzdHJva2UtbGluZWpvaW49XCJtaXRlclwiLz4nO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuY29uc3QgUE9XRVJMSU5FX1NZTUJPTFMgPSBuZXcgU2V0KFsweGUwYjAsIDB4ZTBiMSwgMHhlMGIyLCAweGUwYjNdKTtcbmNvbnN0IFBPV0VSTElORV9TWU1CT0xfTlVER0UgPSAwLjAyO1xuY29uc3QgRkFMTEJBQ0tfVEhFTUUgPSB7XG4gIGZvcmVncm91bmQ6IFwiIzAwMDAwMFwiLFxuICBiYWNrZ3JvdW5kOiBcIiMwMDAwMDBcIixcbiAgcGFsZXR0ZTogW1wiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiLCBcIiMwMDAwMDBcIiwgXCIjMDAwMDAwXCIsIFwiIzAwMDAwMFwiXVxufTtcblxuY29uc3QgX3RtcGwkJGQgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMTIgMTJcIiBjbGFzcz1cImFwLWljb24gYXAtaWNvbi1mdWxsc2NyZWVuLW9mZlwiPjxwYXRoIGQ9XCJNNyw1IEw3LDAgTDksMiBMMTEsMCBMMTIsMSBMMTAsMyBMMTIsNSBaXCI+PC9wYXRoPjxwYXRoIGQ9XCJNNSw3IEwwLDcgTDIsOSBMMCwxMSBMMSwxMiBMMywxMCBMNSwxMiBaXCI+PC9wYXRoPjwvc3ZnPmAsIDYpO1xudmFyIEV4cGFuZEljb24gPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJGQuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCRjID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3ZnIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiNiA4IDE0IDE2XCIgY2xhc3M9XCJhcC1pY29uXCI+PHBhdGggZD1cIk0wLjkzOCA4LjMxM2gyMi4xMjVjMC41IDAgMC45MzggMC40MzggMC45MzggMC45Mzh2MTMuNWMwIDAuNS0wLjQzOCAwLjkzOC0wLjkzOCAwLjkzOGgtMjIuMTI1Yy0wLjUgMC0wLjkzOC0wLjQzOC0wLjkzOC0wLjkzOHYtMTMuNWMwLTAuNSAwLjQzOC0wLjkzOCAwLjkzOC0wLjkzOHpNMS41OTQgMjIuMDYzaDIwLjgxM3YtMTIuMTU2aC0yMC44MTN2MTIuMTU2ek0zLjg0NCAxMS4xODhoMS45MDZ2MS45MzhoLTEuOTA2di0xLjkzOHpNNy40NjkgMTEuMTg4aDEuOTA2djEuOTM4aC0xLjkwNnYtMS45Mzh6TTExLjAzMSAxMS4xODhoMS45Mzh2MS45MzhoLTEuOTM4di0xLjkzOHpNMTQuNjU2IDExLjE4OGgxLjg3NXYxLjkzOGgtMS44NzV2LTEuOTM4ek0xOC4yNSAxMS4xODhoMS45MDZ2MS45MzhoLTEuOTA2di0xLjkzOHpNNS42NTYgMTUuMDMxaDEuOTM4djEuOTM4aC0xLjkzOHYtMS45Mzh6TTkuMjgxIDE2Ljk2OXYtMS45MzhoMS45MDZ2MS45MzhoLTEuOTA2ek0xMi44NzUgMTYuOTY5di0xLjkzOGgxLjkwNnYxLjkzOGgtMS45MDZ6TTE4LjQwNiAxNi45NjloLTEuOTM4di0xLjkzOGgxLjkzOHYxLjkzOHpNMTYuNTMxIDIwLjc4MWgtOS4wNjN2LTEuOTA2aDkuMDYzdjEuOTA2elwiPjwvcGF0aD48L3N2Zz5gLCA0KTtcbnZhciBLZXlib2FyZEljb24gPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJGMuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCRiID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3ZnIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDEyIDEyXCIgY2xhc3M9XCJhcC1pY29uXCIgYXJpYS1sYWJlbD1cIlBhdXNlXCIgcm9sZT1cImJ1dHRvblwiPjxwYXRoIGQ9XCJNMSwwIEw0LDAgTDQsMTIgTDEsMTIgWlwiPjwvcGF0aD48cGF0aCBkPVwiTTgsMCBMMTEsMCBMMTEsMTIgTDgsMTIgWlwiPjwvcGF0aD48L3N2Zz5gLCA2KTtcbnZhciBQYXVzZUljb24gPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJGIuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCRhID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3ZnIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDEyIDEyXCIgY2xhc3M9XCJhcC1pY29uXCIgYXJpYS1sYWJlbD1cIlBsYXlcIiByb2xlPVwiYnV0dG9uXCI+PHBhdGggZD1cIk0xLDAgTDExLDYgTDEsMTIgWlwiPjwvcGF0aD48L3N2Zz5gLCA0KTtcbnZhciBQbGF5SWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkYS5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJDkgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgMTIgMTJcIiBjbGFzcz1cImFwLWljb24gYXAtaWNvbi1mdWxsc2NyZWVuLW9uXCI+PHBhdGggZD1cIk0xMiwwIEw3LDAgTDksMiBMNyw0IEw4LDUgTDEwLDMgTDEyLDUgWlwiPjwvcGF0aD48cGF0aCBkPVwiTTAsMTIgTDAsNyBMMiw5IEw0LDcgTDUsOCBMMywxMCBMNSwxMiBaXCI+PC9wYXRoPjwvc3ZnPmAsIDYpO1xudmFyIFNocmlua0ljb24gPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJDkuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCQ4ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDIwIDIwXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjxwYXRoIGQ9XCJNMTAuNSAzLjc1YS43NS43NSAwIDAgMC0xLjI2NC0uNTQ2TDUuMjAzIDdIMi42NjdhLjc1Ljc1IDAgMCAwLS43LjQ4QTYuOTg1IDYuOTg1IDAgMCAwIDEuNSAxMGMwIC44ODcuMTY1IDEuNzM3LjQ2OCAyLjUyLjExMS4yOS4zOS40OC43LjQ4aDIuNTM1bDQuMDMzIDMuNzk2YS43NS43NSAwIDAgMCAxLjI2NC0uNTQ2VjMuNzVaTTE2LjQ1IDUuMDVhLjc1Ljc1IDAgMCAwLTEuMDYgMS4wNjEgNS41IDUuNSAwIDAgMSAwIDcuNzc4Ljc1Ljc1IDAgMCAwIDEuMDYgMS4wNiA3IDcgMCAwIDAgMC05Ljg5OVpcIj48L3BhdGg+PHBhdGggZD1cIk0xNC4zMjkgNy4xNzJhLjc1Ljc1IDAgMCAwLTEuMDYxIDEuMDYgMi41IDIuNSAwIDAgMSAwIDMuNTM2Ljc1Ljc1IDAgMCAwIDEuMDYgMS4wNiA0IDQgMCAwIDAgMC01LjY1NlpcIj48L3BhdGg+PC9zdmc+YCwgNik7XG52YXIgU3BlYWtlck9uSWNvbiA9IChwcm9wcyA9PiB7XG4gIHJldHVybiBfdG1wbCQkOC5jbG9uZU5vZGUodHJ1ZSk7XG59KTtcblxuY29uc3QgX3RtcGwkJDcgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjAgMjBcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJzaXplLTVcIj48cGF0aCBkPVwiTTEwLjA0NyAzLjA2MmEuNzUuNzUgMCAwIDEgLjQ1My42ODh2MTIuNWEuNzUuNzUgMCAwIDEtMS4yNjQuNTQ2TDUuMjAzIDEzSDIuNjY3YS43NS43NSAwIDAgMS0uNy0uNDhBNi45ODUgNi45ODUgMCAwIDEgMS41IDEwYzAtLjg4Ny4xNjUtMS43MzcuNDY4LTIuNTJhLjc1Ljc1IDAgMCAxIC43LS40OGgyLjUzNWw0LjAzMy0zLjc5NmEuNzUuNzUgMCAwIDEgLjgxMS0uMTQyWk0xMy43OCA3LjIyYS43NS43NSAwIDEgMC0xLjA2IDEuMDZMMTQuNDQgMTBsLTEuNzIgMS43MmEuNzUuNzUgMCAwIDAgMS4wNiAxLjA2bDEuNzItMS43MiAxLjcyIDEuNzJhLjc1Ljc1IDAgMSAwIDEuMDYtMS4wNkwxNi41NiAxMGwxLjcyLTEuNzJhLjc1Ljc1IDAgMCAwLTEuMDYtMS4wNkwxNS41IDguOTRsLTEuNzItMS43MlpcIj48L3BhdGg+PC9zdmc+YCwgNCk7XG52YXIgU3BlYWtlck9mZkljb24gPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJDcuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCQ2ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8c3BhbiBjbGFzcz1cImFwLWJ1dHRvbiBhcC1wbGF5YmFjay1idXR0b25cIiB0YWJpbmRleD1cIjBcIj48L3NwYW4+YCwgMiksXG4gIF90bXBsJDIkMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHNwYW4gY2xhc3M9XCJhcC1iYXJcIj48c3BhbiBjbGFzcz1cImFwLWd1dHRlciBhcC1ndXR0ZXItZW1wdHlcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJhcC1ndXR0ZXIgYXAtZ3V0dGVyLWZ1bGxcIj48L3NwYW4+PC9zcGFuPmAsIDYpLFxuICBfdG1wbCQzJDEgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzcGFuIGNsYXNzPVwiYXAtdG9vbHRpcFwiPlVubXV0ZSAobSk8L3NwYW4+YCwgMiksXG4gIF90bXBsJDQkMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHNwYW4gY2xhc3M9XCJhcC10b29sdGlwXCI+TXV0ZSAobSk8L3NwYW4+YCwgMiksXG4gIF90bXBsJDUkMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPHNwYW4gY2xhc3M9XCJhcC1idXR0b24gYXAtc3BlYWtlci1idXR0b24gYXAtdG9vbHRpcC1jb250YWluZXJcIiBhcmlhLWxhYmVsPVwiTXV0ZSAvIHVubXV0ZVwiIHJvbGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIj48L3NwYW4+YCwgMiksXG4gIF90bXBsJDYkMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGRpdiBjbGFzcz1cImFwLWNvbnRyb2wtYmFyXCI+PHNwYW4gY2xhc3M9XCJhcC10aW1lclwiIGFyaWEtcmVhZG9ubHk9XCJ0cnVlXCIgcm9sZT1cInRleHRib3hcIiB0YWJpbmRleD1cIjBcIj48c3BhbiBjbGFzcz1cImFwLXRpbWUtZWxhcHNlZFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImFwLXRpbWUtcmVtYWluaW5nXCI+PC9zcGFuPjwvc3Bhbj48c3BhbiBjbGFzcz1cImFwLXByb2dyZXNzYmFyXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwiYXAtYnV0dG9uIGFwLWtiZC1idXR0b24gYXAtdG9vbHRpcC1jb250YWluZXJcIiBhcmlhLWxhYmVsPVwiU2hvdyBrZXlib2FyZCBzaG9ydGN1dHNcIiByb2xlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCIwXCI+PHNwYW4gY2xhc3M9XCJhcC10b29sdGlwXCI+S2V5Ym9hcmQgc2hvcnRjdXRzICg/KTwvc3Bhbj48L3NwYW4+PHNwYW4gY2xhc3M9XCJhcC1idXR0b24gYXAtZnVsbHNjcmVlbi1idXR0b24gYXAtdG9vbHRpcC1jb250YWluZXJcIiBhcmlhLWxhYmVsPVwiVG9nZ2xlIGZ1bGxzY3JlZW4gbW9kZVwiIHJvbGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIj48c3BhbiBjbGFzcz1cImFwLXRvb2x0aXBcIj5GdWxsc2NyZWVuIChmKTwvc3Bhbj48L3NwYW4+PC9kaXY+YCwgMTgpLFxuICBfdG1wbCQ3JDEgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxzcGFuIGNsYXNzPVwiYXAtbWFya2VyLWNvbnRhaW5lciBhcC10b29sdGlwLWNvbnRhaW5lclwiPjxzcGFuIGNsYXNzPVwiYXAtbWFya2VyXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwiYXAtdG9vbHRpcFwiPjwvc3Bhbj48L3NwYW4+YCwgNik7XG5mdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcbiAgbGV0IHMgPSBNYXRoLmZsb29yKHNlY29uZHMpO1xuICBjb25zdCBkID0gTWF0aC5mbG9vcihzIC8gODY0MDApO1xuICBzICU9IDg2NDAwO1xuICBjb25zdCBoID0gTWF0aC5mbG9vcihzIC8gMzYwMCk7XG4gIHMgJT0gMzYwMDtcbiAgY29uc3QgbSA9IE1hdGguZmxvb3IocyAvIDYwKTtcbiAgcyAlPSA2MDtcbiAgaWYgKGQgPiAwKSB7XG4gICAgcmV0dXJuIGAke3plcm9QYWQoZCl9OiR7emVyb1BhZChoKX06JHt6ZXJvUGFkKG0pfToke3plcm9QYWQocyl9YDtcbiAgfSBlbHNlIGlmIChoID4gMCkge1xuICAgIHJldHVybiBgJHt6ZXJvUGFkKGgpfToke3plcm9QYWQobSl9OiR7emVyb1BhZChzKX1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgJHt6ZXJvUGFkKG0pfToke3plcm9QYWQocyl9YDtcbiAgfVxufVxuZnVuY3Rpb24gemVyb1BhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyBgMCR7bn1gIDogbi50b1N0cmluZygpO1xufVxudmFyIENvbnRyb2xCYXIgPSAocHJvcHMgPT4ge1xuICBjb25zdCBlID0gZiA9PiB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZihlKTtcbiAgICB9O1xuICB9O1xuICBjb25zdCBjdXJyZW50VGltZSA9ICgpID0+IHR5cGVvZiBwcm9wcy5jdXJyZW50VGltZSA9PT0gXCJudW1iZXJcIiA/IGZvcm1hdFRpbWUocHJvcHMuY3VycmVudFRpbWUpIDogXCItLTotLVwiO1xuICBjb25zdCByZW1haW5pbmdUaW1lID0gKCkgPT4gdHlwZW9mIHByb3BzLnJlbWFpbmluZ1RpbWUgPT09IFwibnVtYmVyXCIgPyBcIi1cIiArIGZvcm1hdFRpbWUocHJvcHMucmVtYWluaW5nVGltZSkgOiBjdXJyZW50VGltZSgpO1xuICBjb25zdCBtYXJrZXJzID0gY3JlYXRlTWVtbygoKSA9PiB0eXBlb2YgcHJvcHMuZHVyYXRpb24gPT09IFwibnVtYmVyXCIgPyBwcm9wcy5tYXJrZXJzLmZpbHRlcihtID0+IG1bMF0gPCBwcm9wcy5kdXJhdGlvbikgOiBbXSk7XG4gIGNvbnN0IG1hcmtlclBvc2l0aW9uID0gbSA9PiBgJHttWzBdIC8gcHJvcHMuZHVyYXRpb24gKiAxMDB9JWA7XG4gIGNvbnN0IG1hcmtlclRleHQgPSBtID0+IHtcbiAgICBpZiAobVsxXSA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIGZvcm1hdFRpbWUobVswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHtmb3JtYXRUaW1lKG1bMF0pfSAtICR7bVsxXX1gO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaXNQYXN0TWFya2VyID0gbSA9PiB0eXBlb2YgcHJvcHMuY3VycmVudFRpbWUgPT09IFwibnVtYmVyXCIgPyBtWzBdIDw9IHByb3BzLmN1cnJlbnRUaW1lIDogZmFsc2U7XG4gIGNvbnN0IGd1dHRlckJhclN0eWxlID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZVgoJHtwcm9wcy5wcm9ncmVzcyB8fCAwfWBcbiAgICB9O1xuICB9O1xuICBjb25zdCBjYWxjUG9zaXRpb24gPSBlID0+IHtcbiAgICBjb25zdCBiYXJXaWR0aCA9IGUuY3VycmVudFRhcmdldC5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCByZWN0ID0gZS5jdXJyZW50VGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG1vdXNlWCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCBwb3MgPSBNYXRoLm1heCgwLCBtb3VzZVggLyBiYXJXaWR0aCk7XG4gICAgcmV0dXJuIGAke3BvcyAqIDEwMH0lYDtcbiAgfTtcbiAgY29uc3QgW21vdXNlRG93biwgc2V0TW91c2VEb3duXSA9IGNyZWF0ZVNpZ25hbChmYWxzZSk7XG4gIGNvbnN0IHRocm90dGxlZFNlZWsgPSB0aHJvdHRsZShwcm9wcy5vblNlZWtDbGljaywgNTApO1xuICBjb25zdCBvbk1vdXNlRG93biA9IGUgPT4ge1xuICAgIGlmIChlLl9tYXJrZXIpIHJldHVybjtcbiAgICBpZiAoZS5hbHRLZXkgfHwgZS5zaGlmdEtleSB8fCBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuYnV0dG9uICE9PSAwKSByZXR1cm47XG4gICAgc2V0TW91c2VEb3duKHRydWUpO1xuICAgIHByb3BzLm9uU2Vla0NsaWNrKGNhbGNQb3NpdGlvbihlKSk7XG4gIH07XG4gIGNvbnN0IHNlZWtUb01hcmtlciA9IGluZGV4ID0+IHtcbiAgICByZXR1cm4gZSgoKSA9PiB7XG4gICAgICBwcm9wcy5vblNlZWtDbGljayh7XG4gICAgICAgIG1hcmtlcjogaW5kZXhcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBvbk1vdmUgPSBlID0+IHtcbiAgICBpZiAoZS5hbHRLZXkgfHwgZS5zaGlmdEtleSB8fCBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5KSByZXR1cm47XG4gICAgaWYgKG1vdXNlRG93bigpKSB7XG4gICAgICB0aHJvdHRsZWRTZWVrKGNhbGNQb3NpdGlvbihlKSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbkRvY3VtZW50TW91c2VVcCA9ICgpID0+IHtcbiAgICBzZXRNb3VzZURvd24oZmFsc2UpO1xuICB9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbkRvY3VtZW50TW91c2VVcCk7XG4gIG9uQ2xlYW51cCgoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25Eb2N1bWVudE1vdXNlVXApO1xuICB9KTtcbiAgcmV0dXJuICgoKSA9PiB7XG4gICAgY29uc3QgX2VsJCA9IF90bXBsJDYkMS5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICBfZWwkMyA9IF9lbCQuZmlyc3RDaGlsZCxcbiAgICAgIF9lbCQ0ID0gX2VsJDMuZmlyc3RDaGlsZCxcbiAgICAgIF9lbCQ1ID0gX2VsJDQubmV4dFNpYmxpbmcsXG4gICAgICBfZWwkNiA9IF9lbCQzLm5leHRTaWJsaW5nLFxuICAgICAgX2VsJDEzID0gX2VsJDYubmV4dFNpYmxpbmcsXG4gICAgICBfZWwkMTQgPSBfZWwkMTMuZmlyc3RDaGlsZCxcbiAgICAgIF9lbCQxNSA9IF9lbCQxMy5uZXh0U2libGluZyxcbiAgICAgIF9lbCQxNiA9IF9lbCQxNS5maXJzdENoaWxkO1xuICAgIGNvbnN0IF9yZWYkID0gcHJvcHMucmVmO1xuICAgIHR5cGVvZiBfcmVmJCA9PT0gXCJmdW5jdGlvblwiID8gdXNlKF9yZWYkLCBfZWwkKSA6IHByb3BzLnJlZiA9IF9lbCQ7XG4gICAgaW5zZXJ0KF9lbCQsIGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzLmlzUGF1c2FibGU7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICBjb25zdCBfZWwkMiA9IF90bXBsJCQ2LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihfZWwkMiwgXCJjbGlja1wiLCBlKHByb3BzLm9uUGxheUNsaWNrKSk7XG4gICAgICAgIGluc2VydChfZWwkMiwgY3JlYXRlQ29tcG9uZW50KFN3aXRjaCwge1xuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbY3JlYXRlQ29tcG9uZW50KE1hdGNoLCB7XG4gICAgICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wcy5pc1BsYXlpbmc7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50KFBhdXNlSWNvbiwge30pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgY3JlYXRlQ29tcG9uZW50KE1hdGNoLCB7XG4gICAgICAgICAgICAgIHdoZW46IHRydWUsXG4gICAgICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50KFBsYXlJY29uLCB7fSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIF9lbCQyO1xuICAgICAgfVxuICAgIH0pLCBfZWwkMyk7XG4gICAgaW5zZXJ0KF9lbCQ0LCBjdXJyZW50VGltZSk7XG4gICAgaW5zZXJ0KF9lbCQ1LCByZW1haW5pbmdUaW1lKTtcbiAgICBpbnNlcnQoX2VsJDYsIGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBwcm9wcy5wcm9ncmVzcyA9PT0gXCJudW1iZXJcIiB8fCBwcm9wcy5pc1NlZWthYmxlO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgY29uc3QgX2VsJDcgPSBfdG1wbCQyJDEuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgIF9lbCQ4ID0gX2VsJDcuZmlyc3RDaGlsZCxcbiAgICAgICAgICBfZWwkOSA9IF9lbCQ4Lm5leHRTaWJsaW5nO1xuICAgICAgICBfZWwkNy4kJG1vdXNlbW92ZSA9IG9uTW92ZTtcbiAgICAgICAgX2VsJDcuJCRtb3VzZWRvd24gPSBvbk1vdXNlRG93bjtcbiAgICAgICAgaW5zZXJ0KF9lbCQ3LCBjcmVhdGVDb21wb25lbnQoRm9yLCB7XG4gICAgICAgICAgZ2V0IGVhY2goKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFya2VycygpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hpbGRyZW46IChtLCBpKSA9PiAoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgX2VsJDE3ID0gX3RtcGwkNyQxLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgICAgX2VsJDE4ID0gX2VsJDE3LmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgIF9lbCQxOSA9IF9lbCQxOC5uZXh0U2libGluZztcbiAgICAgICAgICAgIF9lbCQxNy4kJG1vdXNlZG93biA9IGUgPT4ge1xuICAgICAgICAgICAgICBlLl9tYXJrZXIgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoX2VsJDE3LCBcImNsaWNrXCIsIHNlZWtUb01hcmtlcihpKCkpKTtcbiAgICAgICAgICAgIGluc2VydChfZWwkMTksICgpID0+IG1hcmtlclRleHQobSkpO1xuICAgICAgICAgICAgY3JlYXRlUmVuZGVyRWZmZWN0KF9wJCA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IF92JCA9IG1hcmtlclBvc2l0aW9uKG0pLFxuICAgICAgICAgICAgICAgIF92JDIgPSAhIWlzUGFzdE1hcmtlcihtKTtcbiAgICAgICAgICAgICAgX3YkICE9PSBfcCQuX3YkICYmIF9lbCQxNy5zdHlsZS5zZXRQcm9wZXJ0eShcImxlZnRcIiwgX3AkLl92JCA9IF92JCk7XG4gICAgICAgICAgICAgIF92JDIgIT09IF9wJC5fdiQyICYmIF9lbCQxOC5jbGFzc0xpc3QudG9nZ2xlKFwiYXAtbWFya2VyLXBhc3RcIiwgX3AkLl92JDIgPSBfdiQyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9wJDtcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgX3YkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIF92JDI6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gX2VsJDE3O1xuICAgICAgICAgIH0pKClcbiAgICAgICAgfSksIG51bGwpO1xuICAgICAgICBjcmVhdGVSZW5kZXJFZmZlY3QoXyRwID0+IHN0eWxlKF9lbCQ5LCBndXR0ZXJCYXJTdHlsZSgpLCBfJHApKTtcbiAgICAgICAgcmV0dXJuIF9lbCQ3O1xuICAgICAgfVxuICAgIH0pKTtcbiAgICBpbnNlcnQoX2VsJCwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gcHJvcHMuaXNNdXRlZCAhPT0gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgY29uc3QgX2VsJDEwID0gX3RtcGwkNSQxLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihfZWwkMTAsIFwiY2xpY2tcIiwgZShwcm9wcy5vbk11dGVDbGljaykpO1xuICAgICAgICBpbnNlcnQoX2VsJDEwLCBjcmVhdGVDb21wb25lbnQoU3dpdGNoLCB7XG4gICAgICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIFtjcmVhdGVDb21wb25lbnQoTWF0Y2gsIHtcbiAgICAgICAgICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzLmlzTXV0ZWQgPT09IHRydWU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2NyZWF0ZUNvbXBvbmVudChTcGVha2VyT2ZmSWNvbiwge30pLCBfdG1wbCQzJDEuY2xvbmVOb2RlKHRydWUpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksIGNyZWF0ZUNvbXBvbmVudChNYXRjaCwge1xuICAgICAgICAgICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcHMuaXNNdXRlZCA9PT0gZmFsc2U7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2NyZWF0ZUNvbXBvbmVudChTcGVha2VyT25JY29uLCB7fSksIF90bXBsJDQkMS5jbG9uZU5vZGUodHJ1ZSldO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV07XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBfZWwkMTA7XG4gICAgICB9XG4gICAgfSksIF9lbCQxMyk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihfZWwkMTMsIFwiY2xpY2tcIiwgZShwcm9wcy5vbkhlbHBDbGljaykpO1xuICAgIGluc2VydChfZWwkMTMsIGNyZWF0ZUNvbXBvbmVudChLZXlib2FyZEljb24sIHt9KSwgX2VsJDE0KTtcbiAgICBhZGRFdmVudExpc3RlbmVyKF9lbCQxNSwgXCJjbGlja1wiLCBlKHByb3BzLm9uRnVsbHNjcmVlbkNsaWNrKSk7XG4gICAgaW5zZXJ0KF9lbCQxNSwgY3JlYXRlQ29tcG9uZW50KFNocmlua0ljb24sIHt9KSwgX2VsJDE2KTtcbiAgICBpbnNlcnQoX2VsJDE1LCBjcmVhdGVDb21wb25lbnQoRXhwYW5kSWNvbiwge30pLCBfZWwkMTYpO1xuICAgIGNyZWF0ZVJlbmRlckVmZmVjdCgoKSA9PiBfZWwkLmNsYXNzTGlzdC50b2dnbGUoXCJhcC1zZWVrYWJsZVwiLCAhIXByb3BzLmlzU2Vla2FibGUpKTtcbiAgICByZXR1cm4gX2VsJDtcbiAgfSkoKTtcbn0pO1xuZGVsZWdhdGVFdmVudHMoW1wiY2xpY2tcIiwgXCJtb3VzZWRvd25cIiwgXCJtb3VzZW1vdmVcIl0pO1xuXG5jb25zdCBfdG1wbCQkNSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGRpdiBjbGFzcz1cImFwLW92ZXJsYXkgYXAtb3ZlcmxheS1lcnJvclwiPjxzcGFuPlx1RDgzRFx1RENBNTwvc3Bhbj48L2Rpdj5gLCA0KTtcbnZhciBFcnJvck92ZXJsYXkgPSAocHJvcHMgPT4ge1xuICByZXR1cm4gX3RtcGwkJDUuY2xvbmVOb2RlKHRydWUpO1xufSk7XG5cbmNvbnN0IF90bXBsJCQ0ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtb3ZlcmxheSBhcC1vdmVybGF5LWxvYWRpbmdcIj48c3BhbiBjbGFzcz1cImFwLWxvYWRlclwiPjwvc3Bhbj48L2Rpdj5gLCA0KTtcbnZhciBMb2FkZXJPdmVybGF5ID0gKHByb3BzID0+IHtcbiAgcmV0dXJuIF90bXBsJCQ0LmNsb25lTm9kZSh0cnVlKTtcbn0pO1xuXG5jb25zdCBfdG1wbCQkMyA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGRpdiBjbGFzcz1cImFwLW92ZXJsYXkgYXAtb3ZlcmxheS1pbmZvXCI+PHNwYW4+PC9zcGFuPjwvZGl2PmAsIDQpO1xudmFyIEluZm9PdmVybGF5ID0gKHByb3BzID0+IHtcbiAgcmV0dXJuICgoKSA9PiB7XG4gICAgY29uc3QgX2VsJCA9IF90bXBsJCQzLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgIF9lbCQyID0gX2VsJC5maXJzdENoaWxkO1xuICAgIGluc2VydChfZWwkMiwgKCkgPT4gcHJvcHMubWVzc2FnZSk7XG4gICAgY3JlYXRlUmVuZGVyRWZmZWN0KCgpID0+IF9lbCQuY2xhc3NMaXN0LnRvZ2dsZShcImFwLXdhcy1wbGF5aW5nXCIsICEhcHJvcHMud2FzUGxheWluZykpO1xuICAgIHJldHVybiBfZWwkO1xuICB9KSgpO1xufSk7XG5cbmNvbnN0IF90bXBsJCQyID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtb3ZlcmxheSBhcC1vdmVybGF5LXN0YXJ0XCI+PGRpdiBjbGFzcz1cImFwLXBsYXktYnV0dG9uXCI+PGRpdj48c3Bhbj48c3ZnIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDEwMDAuMCAxMDAwLjBcIiBjbGFzcz1cImFwLWljb25cIj48ZGVmcz48bWFzayBpZD1cInNtYWxsLXRyaWFuZ2xlLW1hc2tcIj48cmVjdCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsbD1cIndoaXRlXCI+PC9yZWN0Pjxwb2x5Z29uIHBvaW50cz1cIjcwMC4wIDUwMC4wLCA0MDAuMDAwMDAwMDAwMDAwMDYgMzI2Ljc5NDkxOTI0MzExMjIsIDM5OS45OTk5OTk5OTk5OTk5IDY3My4yMDUwODA3NTY4ODc3XCIgZmlsbD1cImJsYWNrXCI+PC9wb2x5Z29uPjwvbWFzaz48L2RlZnM+PHBvbHlnb24gcG9pbnRzPVwiMTAwMC4wIDUwMC4wLCAyNTAuMDAwMDAwMDAwMDAwMSA2Ni45ODcyOTgxMDc3ODA1OSwgMjQ5Ljk5OTk5OTk5OTk5OTc3IDkzMy4wMTI3MDE4OTIyMTkyXCIgbWFzaz1cInVybCgjc21hbGwtdHJpYW5nbGUtbWFzaylcIiBmaWxsPVwid2hpdGVcIiBjbGFzcz1cImFwLXBsYXktYnRuLWZpbGxcIj48L3BvbHlnb24+PHBvbHlsaW5lIHBvaW50cz1cIjY3My4yMDUwODA3NTY4ODc4IDQwMC4wLCAzMjYuNzk0OTE5MjQzMTEyMyA2MDAuMFwiIHN0cm9rZT1cIndoaXRlXCIgc3Ryb2tlLXdpZHRoPVwiOTBcIiBjbGFzcz1cImFwLXBsYXktYnRuLXN0cm9rZVwiPjwvcG9seWxpbmU+PC9zdmc+PC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PmAsIDIyKTtcbnZhciBTdGFydE92ZXJsYXkgPSAocHJvcHMgPT4ge1xuICBjb25zdCBlID0gZiA9PiB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZihlKTtcbiAgICB9O1xuICB9O1xuICByZXR1cm4gKCgpID0+IHtcbiAgICBjb25zdCBfZWwkID0gX3RtcGwkJDIuY2xvbmVOb2RlKHRydWUpO1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoX2VsJCwgXCJjbGlja1wiLCBlKHByb3BzLm9uQ2xpY2spKTtcbiAgICByZXR1cm4gX2VsJDtcbiAgfSkoKTtcbn0pO1xuZGVsZWdhdGVFdmVudHMoW1wiY2xpY2tcIl0pO1xuXG5jb25zdCBfdG1wbCQkMSA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGxpPjxrYmQ+c3BhY2U8L2tiZD4gLSBwYXVzZSAvIHJlc3VtZTwvbGk+YCwgNCksXG4gIF90bXBsJDIgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxsaT48a2JkPlx1MjE5MDwva2JkPiAvIDxrYmQ+XHUyMTkyPC9rYmQ+IC0gcmV3aW5kIC8gZmFzdC1mb3J3YXJkIGJ5IDUgc2Vjb25kczwvbGk+YCwgNiksXG4gIF90bXBsJDMgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxsaT48a2JkPlNoaWZ0PC9rYmQ+ICsgPGtiZD5cdTIxOTA8L2tiZD4gLyA8a2JkPlx1MjE5Mjwva2JkPiAtIHJld2luZCAvIGZhc3QtZm9yd2FyZCBieSAxMCU8L2xpPmAsIDgpLFxuICBfdG1wbCQ0ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8bGk+PGtiZD5bPC9rYmQ+IC8gPGtiZD5dPC9rYmQ+IC0ganVtcCB0byB0aGUgcHJldmlvdXMgLyBuZXh0IG1hcmtlcjwvbGk+YCwgNiksXG4gIF90bXBsJDUgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxsaT48a2JkPjA8L2tiZD4sIDxrYmQ+MTwva2JkPiwgPGtiZD4yPC9rYmQ+IC4uLiA8a2JkPjk8L2tiZD4gLSBqdW1wIHRvIDAlLCAxMCUsIDIwJSAuLi4gOTAlPC9saT5gLCAxMCksXG4gIF90bXBsJDYgPSAvKiNfX1BVUkVfXyovdGVtcGxhdGUoYDxsaT48a2JkPiw8L2tiZD4gLyA8a2JkPi48L2tiZD4gLSBzdGVwIGJhY2sgLyBmb3J3YXJkLCBhIGZyYW1lIGF0IGEgdGltZSAod2hlbiBwYXVzZWQpPC9saT5gLCA2KSxcbiAgX3RtcGwkNyA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGxpPjxrYmQ+bTwva2JkPiAtIG11dGUgLyB1bm11dGUgYXVkaW88L2xpPmAsIDQpLFxuICBfdG1wbCQ4ID0gLyojX19QVVJFX18qL3RlbXBsYXRlKGA8ZGl2IGNsYXNzPVwiYXAtb3ZlcmxheSBhcC1vdmVybGF5LWhlbHBcIj48ZGl2PjxkaXY+PHA+S2V5Ym9hcmQgc2hvcnRjdXRzPC9wPjx1bD48bGk+PGtiZD5mPC9rYmQ+IC0gdG9nZ2xlIGZ1bGxzY3JlZW4gbW9kZTwvbGk+PGxpPjxrYmQ+Pzwva2JkPiAtIHNob3cgdGhpcyBoZWxwIHBvcHVwPC9saT48L3VsPjwvZGl2PjwvZGl2PjwvZGl2PmAsIDE4KTtcbnZhciBIZWxwT3ZlcmxheSA9IChwcm9wcyA9PiB7XG4gIGNvbnN0IGUgPSBmID0+IHtcbiAgICByZXR1cm4gZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBmKGUpO1xuICAgIH07XG4gIH07XG4gIHJldHVybiAoKCkgPT4ge1xuICAgIGNvbnN0IF9lbCQgPSBfdG1wbCQ4LmNsb25lTm9kZSh0cnVlKSxcbiAgICAgIF9lbCQyID0gX2VsJC5maXJzdENoaWxkLFxuICAgICAgX2VsJDMgPSBfZWwkMi5maXJzdENoaWxkLFxuICAgICAgX2VsJDQgPSBfZWwkMy5maXJzdENoaWxkLFxuICAgICAgX2VsJDUgPSBfZWwkNC5uZXh0U2libGluZyxcbiAgICAgIF9lbCQxMiA9IF9lbCQ1LmZpcnN0Q2hpbGQsXG4gICAgICBfZWwkMTQgPSBfZWwkMTIubmV4dFNpYmxpbmc7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihfZWwkLCBcImNsaWNrXCIsIGUocHJvcHMub25DbG9zZSkpO1xuICAgIF9lbCQyLiQkY2xpY2sgPSBlID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfTtcbiAgICBpbnNlcnQoX2VsJDUsIGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzLmlzUGF1c2FibGU7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gX3RtcGwkJDEuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgfVxuICAgIH0pLCBfZWwkMTIpO1xuICAgIGluc2VydChfZWwkNSwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gcHJvcHMuaXNTZWVrYWJsZTtcbiAgICAgIH0sXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiBbX3RtcGwkMi5jbG9uZU5vZGUodHJ1ZSksIF90bXBsJDMuY2xvbmVOb2RlKHRydWUpLCBfdG1wbCQ0LmNsb25lTm9kZSh0cnVlKSwgX3RtcGwkNS5jbG9uZU5vZGUodHJ1ZSksIF90bXBsJDYuY2xvbmVOb2RlKHRydWUpXTtcbiAgICAgIH1cbiAgICB9KSwgX2VsJDEyKTtcbiAgICBpbnNlcnQoX2VsJDUsIGNyZWF0ZUNvbXBvbmVudChTaG93LCB7XG4gICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzLmhhc0F1ZGlvO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIF90bXBsJDcuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgfVxuICAgIH0pLCBfZWwkMTQpO1xuICAgIHJldHVybiBfZWwkO1xuICB9KSgpO1xufSk7XG5kZWxlZ2F0ZUV2ZW50cyhbXCJjbGlja1wiXSk7XG5cbmNvbnN0IF90bXBsJCA9IC8qI19fUFVSRV9fKi90ZW1wbGF0ZShgPGRpdiBjbGFzcz1cImFwLXdyYXBwZXJcIiB0YWJpbmRleD1cIi0xXCI+PGRpdj48L2Rpdj48L2Rpdj5gLCA0KTtcbmNvbnN0IENPTlRST0xfQkFSX0hFSUdIVCA9IDMyOyAvLyBtdXN0IG1hdGNoIGhlaWdodCBvZiBkaXYuYXAtY29udHJvbC1iYXIgaW4gQ1NTXG5cbnZhciBQbGF5ZXIgPSAocHJvcHMgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBwcm9wcy5sb2dnZXI7XG4gIGNvbnN0IGNvcmUgPSBwcm9wcy5jb3JlO1xuICBjb25zdCBhdXRvUGxheSA9IHByb3BzLmF1dG9QbGF5O1xuICBjb25zdCBjaGFyVyA9IHByb3BzLmNoYXJXO1xuICBjb25zdCBjaGFySCA9IHByb3BzLmNoYXJIO1xuICBjb25zdCBib3JkZXJzVyA9IHByb3BzLmJvcmRlcnNXO1xuICBjb25zdCBib3JkZXJzSCA9IHByb3BzLmJvcmRlcnNIO1xuICBjb25zdCB0aGVtZU9wdGlvbiA9IHByb3BzLnRoZW1lID8/IFwiYXV0by9hc2NpaW5lbWFcIjtcbiAgY29uc3QgcHJlZmVyRW1iZWRkZWRUaGVtZSA9IHRoZW1lT3B0aW9uLnNsaWNlKDAsIDUpID09PSBcImF1dG8vXCI7XG4gIGNvbnN0IHRoZW1lTmFtZSA9IHByZWZlckVtYmVkZGVkVGhlbWUgPyB0aGVtZU9wdGlvbi5zbGljZSg1KSA6IHRoZW1lT3B0aW9uO1xuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IGNyZWF0ZVN0b3JlKHtcbiAgICBjb250YWluZXJXOiAwLFxuICAgIGNvbnRhaW5lckg6IDAsXG4gICAgaXNQYXVzYWJsZTogdHJ1ZSxcbiAgICBpc1NlZWthYmxlOiB0cnVlLFxuICAgIGlzRnVsbHNjcmVlbjogZmFsc2UsXG4gICAgY3VycmVudFRpbWU6IG51bGwsXG4gICAgcmVtYWluaW5nVGltZTogbnVsbCxcbiAgICBwcm9ncmVzczogbnVsbFxuICB9KTtcbiAgY29uc3QgW2lzUGxheWluZywgc2V0SXNQbGF5aW5nXSA9IGNyZWF0ZVNpZ25hbChmYWxzZSk7XG4gIGNvbnN0IFtpc011dGVkLCBzZXRJc011dGVkXSA9IGNyZWF0ZVNpZ25hbCh1bmRlZmluZWQpO1xuICBjb25zdCBbd2FzUGxheWluZywgc2V0V2FzUGxheWluZ10gPSBjcmVhdGVTaWduYWwoZmFsc2UpO1xuICBjb25zdCBbb3ZlcmxheSwgc2V0T3ZlcmxheV0gPSBjcmVhdGVTaWduYWwoIWF1dG9QbGF5ID8gXCJzdGFydFwiIDogbnVsbCk7XG4gIGNvbnN0IFtpbmZvTWVzc2FnZSwgc2V0SW5mb01lc3NhZ2VdID0gY3JlYXRlU2lnbmFsKG51bGwpO1xuICBjb25zdCBbYmxpbmtpbmcsIHNldEJsaW5raW5nXSA9IGNyZWF0ZVNpZ25hbChmYWxzZSk7XG4gIGNvbnN0IFt0ZXJtaW5hbFNpemUsIHNldFRlcm1pbmFsU2l6ZV0gPSBjcmVhdGVTaWduYWwoe1xuICAgIGNvbHM6IHByb3BzLmNvbHMsXG4gICAgcm93czogcHJvcHMucm93c1xuICB9LCB7XG4gICAgZXF1YWxzOiAobmV3VmFsLCBvbGRWYWwpID0+IG5ld1ZhbC5jb2xzID09PSBvbGRWYWwuY29scyAmJiBuZXdWYWwucm93cyA9PT0gb2xkVmFsLnJvd3NcbiAgfSk7XG4gIGNvbnN0IFtkdXJhdGlvbiwgc2V0RHVyYXRpb25dID0gY3JlYXRlU2lnbmFsKG51bGwpO1xuICBjb25zdCBbbWFya2Vycywgc2V0TWFya2Vyc10gPSBjcmVhdGVTdG9yZShbXSk7XG4gIGNvbnN0IFt1c2VyQWN0aXZlLCBzZXRVc2VyQWN0aXZlXSA9IGNyZWF0ZVNpZ25hbChmYWxzZSk7XG4gIGNvbnN0IFtpc0hlbHBWaXNpYmxlLCBzZXRJc0hlbHBWaXNpYmxlXSA9IGNyZWF0ZVNpZ25hbChmYWxzZSk7XG4gIGNvbnN0IFtvcmlnaW5hbFRoZW1lLCBzZXRPcmlnaW5hbFRoZW1lXSA9IGNyZWF0ZVNpZ25hbChudWxsKTtcbiAgY29uc3QgdGVybWluYWxDb2xzID0gY3JlYXRlTWVtbygoKSA9PiB0ZXJtaW5hbFNpemUoKS5jb2xzIHx8IDgwKTtcbiAgY29uc3QgdGVybWluYWxSb3dzID0gY3JlYXRlTWVtbygoKSA9PiB0ZXJtaW5hbFNpemUoKS5yb3dzIHx8IDI0KTtcbiAgY29uc3QgY29udHJvbEJhckhlaWdodCA9ICgpID0+IHByb3BzLmNvbnRyb2xzID09PSBmYWxzZSA/IDAgOiBDT05UUk9MX0JBUl9IRUlHSFQ7XG4gIGNvbnN0IGNvbnRyb2xzVmlzaWJsZSA9ICgpID0+IHByb3BzLmNvbnRyb2xzID09PSB0cnVlIHx8IHByb3BzLmNvbnRyb2xzID09PSBcImF1dG9cIiAmJiB1c2VyQWN0aXZlKCk7XG4gIGxldCB1c2VyQWN0aXZpdHlUaW1lb3V0SWQ7XG4gIGxldCB0aW1lVXBkYXRlSW50ZXJ2YWxJZDtcbiAgbGV0IHdyYXBwZXJSZWY7XG4gIGxldCBwbGF5ZXJSZWY7XG4gIGxldCBjb250cm9sQmFyUmVmO1xuICBsZXQgcmVzaXplT2JzZXJ2ZXI7XG4gIGZ1bmN0aW9uIG9uUGxheWluZygpIHtcbiAgICBzZXRCbGlua2luZyh0cnVlKTtcbiAgICBzdGFydFRpbWVVcGRhdGVzKCk7XG4gIH1cbiAgZnVuY3Rpb24gb25TdG9wcGVkKCkge1xuICAgIHNldEJsaW5raW5nKGZhbHNlKTtcbiAgICBzdG9wVGltZVVwZGF0ZXMoKTtcbiAgICB1cGRhdGVUaW1lKCk7XG4gIH1cbiAgbGV0IHJlc29sdmVDb3JlUmVhZHk7XG4gIGNvbnN0IGNvcmVSZWFkeSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIHJlc29sdmVDb3JlUmVhZHkgPSByZXNvbHZlO1xuICB9KTtcbiAgY29uc3Qgb25Db3JlUmVhZHkgPSBfcmVmID0+IHtcbiAgICBsZXQge1xuICAgICAgaXNQYXVzYWJsZSxcbiAgICAgIGlzU2Vla2FibGVcbiAgICB9ID0gX3JlZjtcbiAgICBzZXRTdGF0ZSh7XG4gICAgICBpc1BhdXNhYmxlLFxuICAgICAgaXNTZWVrYWJsZVxuICAgIH0pO1xuICAgIHJlc29sdmVDb3JlUmVhZHkoKTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlTWV0YWRhdGEgPSBtZXRhID0+IHtcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBpZiAobWV0YS5kdXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldER1cmF0aW9uKG1ldGEuZHVyYXRpb24pO1xuICAgICAgfVxuICAgICAgaWYgKG1ldGEubWFya2VycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldE1hcmtlcnMobWV0YS5tYXJrZXJzKTtcbiAgICAgIH1cbiAgICAgIGlmIChtZXRhLmhhc0F1ZGlvICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2V0SXNNdXRlZChtZXRhLmhhc0F1ZGlvID8gZmFsc2UgOiB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgICAgaWYgKG1ldGEuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldFRlcm1pbmFsU2l6ZShtZXRhLnNpemUpO1xuICAgICAgfVxuICAgICAgaWYgKG1ldGEudGhlbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXRPcmlnaW5hbFRoZW1lKG1ldGEudGhlbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBjb25zdCBvbkNvcmVQbGF5ID0gKCkgPT4ge1xuICAgIHNldE92ZXJsYXkobnVsbCk7XG4gIH07XG4gIGNvbnN0IG9uQ29yZVBsYXlpbmcgPSAoKSA9PiB7XG4gICAgYmF0Y2goKCkgPT4ge1xuICAgICAgc2V0SXNQbGF5aW5nKHRydWUpO1xuICAgICAgc2V0V2FzUGxheWluZyh0cnVlKTtcbiAgICAgIHNldE92ZXJsYXkobnVsbCk7XG4gICAgICBvblBsYXlpbmcoKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlSWRsZSA9ICgpID0+IHtcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBzZXRJc1BsYXlpbmcoZmFsc2UpO1xuICAgICAgb25TdG9wcGVkKCk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9uQ29yZUxvYWRpbmcgPSAoKSA9PiB7XG4gICAgYmF0Y2goKCkgPT4ge1xuICAgICAgc2V0SXNQbGF5aW5nKGZhbHNlKTtcbiAgICAgIG9uU3RvcHBlZCgpO1xuICAgICAgc2V0T3ZlcmxheShcImxvYWRlclwiKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlT2ZmbGluZSA9IF9yZWYyID0+IHtcbiAgICBsZXQge1xuICAgICAgbWVzc2FnZVxuICAgIH0gPSBfcmVmMjtcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBzZXRJc1BsYXlpbmcoZmFsc2UpO1xuICAgICAgb25TdG9wcGVkKCk7XG4gICAgICBpZiAobWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldEluZm9NZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICBzZXRPdmVybGF5KFwiaW5mb1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgb25Db3JlTXV0ZWQgPSBtdXRlZCA9PiB7XG4gICAgc2V0SXNNdXRlZChtdXRlZCk7XG4gIH07XG4gIGNvbnN0IHN0YXRzID0ge1xuICAgIHRlcm1pbmFsOiB7XG4gICAgICByZW5kZXJzOiAwXG4gICAgfVxuICB9O1xuICBjb25zdCBvbkNvcmVFbmRlZCA9IF9yZWYzID0+IHtcbiAgICBsZXQge1xuICAgICAgbWVzc2FnZVxuICAgIH0gPSBfcmVmMztcbiAgICBiYXRjaCgoKSA9PiB7XG4gICAgICBzZXRJc1BsYXlpbmcoZmFsc2UpO1xuICAgICAgb25TdG9wcGVkKCk7XG4gICAgICBpZiAobWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldEluZm9NZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICBzZXRPdmVybGF5KFwiaW5mb1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsb2dnZXIuZGVidWcoXCJzdGF0c1wiLCBzdGF0cy50ZXJtaW5hbCk7XG4gIH07XG4gIGNvbnN0IG9uQ29yZUVycm9yZWQgPSAoKSA9PiB7XG4gICAgc2V0T3ZlcmxheShcImVycm9yXCIpO1xuICB9O1xuICBjb25zdCBvbkNvcmVTZWVrZWQgPSAoKSA9PiB7XG4gICAgdXBkYXRlVGltZSgpO1xuICB9O1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeVwiLCBvbkNvcmVSZWFkeSk7XG4gIGNvcmUuYWRkRXZlbnRMaXN0ZW5lcihcIm1ldGFkYXRhXCIsIG9uQ29yZU1ldGFkYXRhKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwicGxheVwiLCBvbkNvcmVQbGF5KTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwicGxheWluZ1wiLCBvbkNvcmVQbGF5aW5nKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwiaWRsZVwiLCBvbkNvcmVJZGxlKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZGluZ1wiLCBvbkNvcmVMb2FkaW5nKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwib2ZmbGluZVwiLCBvbkNvcmVPZmZsaW5lKTtcbiAgY29yZS5hZGRFdmVudExpc3RlbmVyKFwibXV0ZWRcIiwgb25Db3JlTXV0ZWQpO1xuICBjb3JlLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCBvbkNvcmVFbmRlZCk7XG4gIGNvcmUuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yZWRcIiwgb25Db3JlRXJyb3JlZCk7XG4gIGNvcmUuYWRkRXZlbnRMaXN0ZW5lcihcInNlZWtlZFwiLCBvbkNvcmVTZWVrZWQpO1xuICBjb25zdCBzZXR1cFJlc2l6ZU9ic2VydmVyID0gKCkgPT4ge1xuICAgIHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGRlYm91bmNlKF9lbnRyaWVzID0+IHtcbiAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgY29udGFpbmVyVzogd3JhcHBlclJlZi5vZmZzZXRXaWR0aCxcbiAgICAgICAgY29udGFpbmVySDogd3JhcHBlclJlZi5vZmZzZXRIZWlnaHRcbiAgICAgIH0pO1xuICAgICAgd3JhcHBlclJlZi5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInJlc2l6ZVwiLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGVsOiBwbGF5ZXJSZWZcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH0sIDEwKSk7XG4gICAgcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh3cmFwcGVyUmVmKTtcbiAgfTtcbiAgb25Nb3VudChhc3luYyAoKSA9PiB7XG4gICAgbG9nZ2VyLmluZm8oXCJ2aWV3OiBtb3VudGVkXCIpO1xuICAgIGxvZ2dlci5kZWJ1ZyhcInZpZXc6IGZvbnQgbWVhc3VyZW1lbnRzXCIsIHtcbiAgICAgIGNoYXJXLFxuICAgICAgY2hhckhcbiAgICB9KTtcbiAgICBzZXR1cFJlc2l6ZU9ic2VydmVyKCk7XG4gICAgc2V0U3RhdGUoe1xuICAgICAgY29udGFpbmVyVzogd3JhcHBlclJlZi5vZmZzZXRXaWR0aCxcbiAgICAgIGNvbnRhaW5lckg6IHdyYXBwZXJSZWYub2Zmc2V0SGVpZ2h0XG4gICAgfSk7XG4gIH0pO1xuICBvbkNsZWFudXAoKCkgPT4ge1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlYWR5XCIsIG9uQ29yZVJlYWR5KTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXRhZGF0YVwiLCBvbkNvcmVNZXRhZGF0YSk7XG4gICAgY29yZS5yZW1vdmVFdmVudExpc3RlbmVyKFwicGxheVwiLCBvbkNvcmVQbGF5KTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwbGF5aW5nXCIsIG9uQ29yZVBsYXlpbmcpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImlkbGVcIiwgb25Db3JlSWRsZSk7XG4gICAgY29yZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZGluZ1wiLCBvbkNvcmVMb2FkaW5nKTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJvZmZsaW5lXCIsIG9uQ29yZU9mZmxpbmUpO1xuICAgIGNvcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm11dGVkXCIsIG9uQ29yZU11dGVkKTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCBvbkNvcmVFbmRlZCk7XG4gICAgY29yZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JlZFwiLCBvbkNvcmVFcnJvcmVkKTtcbiAgICBjb3JlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzZWVrZWRcIiwgb25Db3JlU2Vla2VkKTtcbiAgICBjb3JlLnN0b3AoKTtcbiAgICBzdG9wVGltZVVwZGF0ZXMoKTtcbiAgICByZXNpemVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIH0pO1xuICBjb25zdCB0ZXJtaW5hbEVsZW1lbnRTaXplID0gY3JlYXRlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgdGVybWluYWxXID0gY2hhclcgKiB0ZXJtaW5hbENvbHMoKSArIGJvcmRlcnNXO1xuICAgIGNvbnN0IHRlcm1pbmFsSCA9IGNoYXJIICogdGVybWluYWxSb3dzKCkgKyBib3JkZXJzSDtcbiAgICBsZXQgZml0ID0gcHJvcHMuZml0ID8/IFwid2lkdGhcIjtcbiAgICBpZiAoZml0ID09PSBcImJvdGhcIiB8fCBzdGF0ZS5pc0Z1bGxzY3JlZW4pIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJhdGlvID0gc3RhdGUuY29udGFpbmVyVyAvIChzdGF0ZS5jb250YWluZXJIIC0gY29udHJvbEJhckhlaWdodCgpKTtcbiAgICAgIGNvbnN0IHRlcm1pbmFsUmF0aW8gPSB0ZXJtaW5hbFcgLyB0ZXJtaW5hbEg7XG4gICAgICBpZiAoY29udGFpbmVyUmF0aW8gPiB0ZXJtaW5hbFJhdGlvKSB7XG4gICAgICAgIGZpdCA9IFwiaGVpZ2h0XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXQgPSBcIndpZHRoXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaXQgPT09IGZhbHNlIHx8IGZpdCA9PT0gXCJub25lXCIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9IGVsc2UgaWYgKGZpdCA9PT0gXCJ3aWR0aFwiKSB7XG4gICAgICBjb25zdCBzY2FsZSA9IHN0YXRlLmNvbnRhaW5lclcgLyB0ZXJtaW5hbFc7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzY2FsZTogc2NhbGUsXG4gICAgICAgIHdpZHRoOiBzdGF0ZS5jb250YWluZXJXLFxuICAgICAgICBoZWlnaHQ6IHRlcm1pbmFsSCAqIHNjYWxlICsgY29udHJvbEJhckhlaWdodCgpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZml0ID09PSBcImhlaWdodFwiKSB7XG4gICAgICBjb25zdCBzY2FsZSA9IChzdGF0ZS5jb250YWluZXJIIC0gY29udHJvbEJhckhlaWdodCgpKSAvIHRlcm1pbmFsSDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNjYWxlOiBzY2FsZSxcbiAgICAgICAgd2lkdGg6IHRlcm1pbmFsVyAqIHNjYWxlLFxuICAgICAgICBoZWlnaHQ6IHN0YXRlLmNvbnRhaW5lckhcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZml0IG1vZGU6ICR7Zml0fWApO1xuICAgIH1cbiAgfSk7XG4gIGNvbnN0IG9uRnVsbHNjcmVlbkNoYW5nZSA9ICgpID0+IHtcbiAgICBzZXRTdGF0ZShcImlzRnVsbHNjcmVlblwiLCBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA/PyBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCk7XG4gIH07XG4gIGNvbnN0IHRvZ2dsZUZ1bGxzY3JlZW4gPSAoKSA9PiB7XG4gICAgaWYgKHN0YXRlLmlzRnVsbHNjcmVlbikge1xuICAgICAgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuID8/IGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuID8/ICgoKSA9PiB7fSkpLmFwcGx5KGRvY3VtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHdyYXBwZXJSZWYucmVxdWVzdEZ1bGxzY3JlZW4gPz8gd3JhcHBlclJlZi53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbiA/PyAoKCkgPT4ge30pKS5hcHBseSh3cmFwcGVyUmVmKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHRvZ2dsZUhlbHAgPSAoKSA9PiB7XG4gICAgaWYgKGlzSGVscFZpc2libGUoKSkge1xuICAgICAgc2V0SXNIZWxwVmlzaWJsZShmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvcmUucGF1c2UoKTtcbiAgICAgIHNldElzSGVscFZpc2libGUodHJ1ZSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbktleURvd24gPSBlID0+IHtcbiAgICBpZiAoZS5hbHRLZXkgfHwgZS5tZXRhS2V5IHx8IGUuY3RybEtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZS5rZXkgPT0gXCIgXCIpIHtcbiAgICAgIGNvcmUudG9nZ2xlUGxheSgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCIsXCIpIHtcbiAgICAgIGNvcmUuc3RlcCgtMSkudGhlbih1cGRhdGVUaW1lKTtcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09IFwiLlwiKSB7XG4gICAgICBjb3JlLnN0ZXAoKS50aGVuKHVwZGF0ZVRpbWUpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCJmXCIpIHtcbiAgICAgIHRvZ2dsZUZ1bGxzY3JlZW4oKTtcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09IFwibVwiKSB7XG4gICAgICB0b2dnbGVNdXRlZCgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCJbXCIpIHtcbiAgICAgIGNvcmUuc2Vlayh7XG4gICAgICAgIG1hcmtlcjogXCJwcmV2XCJcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCJdXCIpIHtcbiAgICAgIGNvcmUuc2Vlayh7XG4gICAgICAgIG1hcmtlcjogXCJuZXh0XCJcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkuY2hhckNvZGVBdCgwKSA+PSA0OCAmJiBlLmtleS5jaGFyQ29kZUF0KDApIDw9IDU3KSB7XG4gICAgICBjb25zdCBwb3MgPSAoZS5rZXkuY2hhckNvZGVBdCgwKSAtIDQ4KSAvIDEwO1xuICAgICAgY29yZS5zZWVrKGAke3BvcyAqIDEwMH0lYCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIj9cIikge1xuICAgICAgdG9nZ2xlSGVscCgpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT0gXCJBcnJvd0xlZnRcIikge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgY29yZS5zZWVrKFwiPDw8XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29yZS5zZWVrKFwiPDxcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIkFycm93UmlnaHRcIikge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgY29yZS5zZWVrKFwiPj4+XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29yZS5zZWVrKFwiPj5cIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PSBcIkVzY2FwZVwiKSB7XG4gICAgICBzZXRJc0hlbHBWaXNpYmxlKGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcbiAgY29uc3Qgd3JhcHBlck9uTW91c2VNb3ZlID0gKCkgPT4ge1xuICAgIGlmIChzdGF0ZS5pc0Z1bGxzY3JlZW4pIHtcbiAgICAgIG9uVXNlckFjdGl2ZSh0cnVlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHBsYXllck9uTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICBpZiAoIXN0YXRlLmlzRnVsbHNjcmVlbikge1xuICAgICAgb25Vc2VyQWN0aXZlKGZhbHNlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHN0YXJ0VGltZVVwZGF0ZXMgPSAoKSA9PiB7XG4gICAgdGltZVVwZGF0ZUludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh1cGRhdGVUaW1lLCAxMDApO1xuICB9O1xuICBjb25zdCBzdG9wVGltZVVwZGF0ZXMgPSAoKSA9PiB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aW1lVXBkYXRlSW50ZXJ2YWxJZCk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVRpbWUgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSBhd2FpdCBjb3JlLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgY29uc3QgcmVtYWluaW5nVGltZSA9IGF3YWl0IGNvcmUuZ2V0UmVtYWluaW5nVGltZSgpO1xuICAgIGNvbnN0IHByb2dyZXNzID0gYXdhaXQgY29yZS5nZXRQcm9ncmVzcygpO1xuICAgIHNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRUaW1lLFxuICAgICAgcmVtYWluaW5nVGltZSxcbiAgICAgIHByb2dyZXNzXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IG9uVXNlckFjdGl2ZSA9IHNob3cgPT4ge1xuICAgIGNsZWFyVGltZW91dCh1c2VyQWN0aXZpdHlUaW1lb3V0SWQpO1xuICAgIGlmIChzaG93KSB7XG4gICAgICB1c2VyQWN0aXZpdHlUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IG9uVXNlckFjdGl2ZShmYWxzZSksIDIwMDApO1xuICAgIH1cbiAgICBzZXRVc2VyQWN0aXZlKHNob3cpO1xuICB9O1xuICBjb25zdCBlbWJlZGRlZFRoZW1lID0gY3JlYXRlTWVtbygoKSA9PiBwcmVmZXJFbWJlZGRlZFRoZW1lID8gb3JpZ2luYWxUaGVtZSgpIDogbnVsbCk7XG4gIGNvbnN0IHBsYXllclN0eWxlID0gKCkgPT4ge1xuICAgIGNvbnN0IHN0eWxlID0ge307XG4gICAgaWYgKChwcm9wcy5maXQgPT09IGZhbHNlIHx8IHByb3BzLmZpdCA9PT0gXCJub25lXCIpICYmIHByb3BzLnRlcm1pbmFsRm9udFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHByb3BzLnRlcm1pbmFsRm9udFNpemUgPT09IFwic21hbGxcIikge1xuICAgICAgICBzdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiMTJweFwiO1xuICAgICAgfSBlbHNlIGlmIChwcm9wcy50ZXJtaW5hbEZvbnRTaXplID09PSBcIm1lZGl1bVwiKSB7XG4gICAgICAgIHN0eWxlW1wiZm9udC1zaXplXCJdID0gXCIxOHB4XCI7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnRlcm1pbmFsRm9udFNpemUgPT09IFwiYmlnXCIpIHtcbiAgICAgICAgc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjI0cHhcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlW1wiZm9udC1zaXplXCJdID0gcHJvcHMudGVybWluYWxGb250U2l6ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc2l6ZSA9IHRlcm1pbmFsRWxlbWVudFNpemUoKTtcbiAgICBpZiAoc2l6ZS53aWR0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZVtcIndpZHRoXCJdID0gYCR7c2l6ZS53aWR0aH1weGA7XG4gICAgICBzdHlsZVtcImhlaWdodFwiXSA9IGAke3NpemUuaGVpZ2h0fXB4YDtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRlcm1pbmFsRm9udEZhbWlseSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZVtcIi0tdGVybS1mb250LWZhbWlseVwiXSA9IHByb3BzLnRlcm1pbmFsRm9udEZhbWlseTtcbiAgICB9XG4gICAgY29uc3QgdGhlbWVDb2xvcnMgPSBlbWJlZGRlZFRoZW1lKCk7XG4gICAgaWYgKHRoZW1lQ29sb3JzKSB7XG4gICAgICBzdHlsZVtcIi0tdGVybS1jb2xvci1mb3JlZ3JvdW5kXCJdID0gdGhlbWVDb2xvcnMuZm9yZWdyb3VuZDtcbiAgICAgIHN0eWxlW1wiLS10ZXJtLWNvbG9yLWJhY2tncm91bmRcIl0gPSB0aGVtZUNvbG9ycy5iYWNrZ3JvdW5kO1xuICAgIH1cbiAgICByZXR1cm4gc3R5bGU7XG4gIH07XG4gIGNvbnN0IHBsYXkgPSAoKSA9PiB7XG4gICAgY29yZVJlYWR5LnRoZW4oKCkgPT4gY29yZS5wbGF5KCkpO1xuICB9O1xuICBjb25zdCB0b2dnbGVQbGF5ID0gKCkgPT4ge1xuICAgIGNvcmVSZWFkeS50aGVuKCgpID0+IGNvcmUudG9nZ2xlUGxheSgpKTtcbiAgfTtcbiAgY29uc3QgdG9nZ2xlTXV0ZWQgPSAoKSA9PiB7XG4gICAgY29yZVJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGlzTXV0ZWQoKSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb3JlLnVubXV0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29yZS5tdXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHNlZWsgPSBwb3MgPT4ge1xuICAgIGNvcmVSZWFkeS50aGVuKCgpID0+IGNvcmUuc2Vlayhwb3MpKTtcbiAgfTtcbiAgY29uc3QgcGxheWVyQ2xhc3MgPSAoKSA9PiBgYXAtcGxheWVyIGFwLWRlZmF1bHQtdGVybS1mZiBhc2NpaW5lbWEtcGxheWVyLXRoZW1lLSR7dGhlbWVOYW1lfWA7XG4gIGNvbnN0IHRlcm1pbmFsU2NhbGUgPSAoKSA9PiB0ZXJtaW5hbEVsZW1lbnRTaXplKCk/LnNjYWxlO1xuICBjb25zdCBlbCA9ICgoKSA9PiB7XG4gICAgY29uc3QgX2VsJCA9IF90bXBsJC5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICBfZWwkMiA9IF9lbCQuZmlyc3RDaGlsZDtcbiAgICBjb25zdCBfcmVmJCA9IHdyYXBwZXJSZWY7XG4gICAgdHlwZW9mIF9yZWYkID09PSBcImZ1bmN0aW9uXCIgPyB1c2UoX3JlZiQsIF9lbCQpIDogd3JhcHBlclJlZiA9IF9lbCQ7XG4gICAgX2VsJC5hZGRFdmVudExpc3RlbmVyKFwid2Via2l0ZnVsbHNjcmVlbmNoYW5nZVwiLCBvbkZ1bGxzY3JlZW5DaGFuZ2UpO1xuICAgIF9lbCQuYWRkRXZlbnRMaXN0ZW5lcihcImZ1bGxzY3JlZW5jaGFuZ2VcIiwgb25GdWxsc2NyZWVuQ2hhbmdlKTtcbiAgICBfZWwkLiQkbW91c2Vtb3ZlID0gd3JhcHBlck9uTW91c2VNb3ZlO1xuICAgIF9lbCQuJCRrZXlkb3duID0gb25LZXlEb3duO1xuICAgIGNvbnN0IF9yZWYkMiA9IHBsYXllclJlZjtcbiAgICB0eXBlb2YgX3JlZiQyID09PSBcImZ1bmN0aW9uXCIgPyB1c2UoX3JlZiQyLCBfZWwkMikgOiBwbGF5ZXJSZWYgPSBfZWwkMjtcbiAgICBfZWwkMi4kJG1vdXNlbW92ZSA9ICgpID0+IG9uVXNlckFjdGl2ZSh0cnVlKTtcbiAgICBfZWwkMi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBwbGF5ZXJPbk1vdXNlTGVhdmUpO1xuICAgIGluc2VydChfZWwkMiwgY3JlYXRlQ29tcG9uZW50KFRlcm1pbmFsLCB7XG4gICAgICBnZXQgY29scygpIHtcbiAgICAgICAgcmV0dXJuIHRlcm1pbmFsQ29scygpO1xuICAgICAgfSxcbiAgICAgIGdldCByb3dzKCkge1xuICAgICAgICByZXR1cm4gdGVybWluYWxSb3dzKCk7XG4gICAgICB9LFxuICAgICAgZ2V0IHNjYWxlKCkge1xuICAgICAgICByZXR1cm4gdGVybWluYWxTY2FsZSgpO1xuICAgICAgfSxcbiAgICAgIGdldCBibGlua2luZygpIHtcbiAgICAgICAgcmV0dXJuIGJsaW5raW5nKCk7XG4gICAgICB9LFxuICAgICAgZ2V0IGxpbmVIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiBwcm9wcy50ZXJtaW5hbExpbmVIZWlnaHQ7XG4gICAgICB9LFxuICAgICAgcHJlZmVyRW1iZWRkZWRUaGVtZTogcHJlZmVyRW1iZWRkZWRUaGVtZSxcbiAgICAgIGNvcmU6IGNvcmUsXG4gICAgICBnZXQgc3RhdHMoKSB7XG4gICAgICAgIHJldHVybiBzdGF0cy50ZXJtaW5hbDtcbiAgICAgIH1cbiAgICB9KSwgbnVsbCk7XG4gICAgaW5zZXJ0KF9lbCQyLCBjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgZ2V0IHdoZW4oKSB7XG4gICAgICAgIHJldHVybiBwcm9wcy5jb250cm9scyAhPT0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50KENvbnRyb2xCYXIsIHtcbiAgICAgICAgICBnZXQgZHVyYXRpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZHVyYXRpb24oKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5jdXJyZW50VGltZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCByZW1haW5pbmdUaW1lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnJlbWFpbmluZ1RpbWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgcHJvZ3Jlc3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUucHJvZ3Jlc3M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBtYXJrZXJzOiBtYXJrZXJzLFxuICAgICAgICAgIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNQbGF5aW5nKCkgfHwgb3ZlcmxheSgpID09IFwibG9hZGVyXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgaXNQYXVzYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5pc1BhdXNhYmxlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGlzU2Vla2FibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuaXNTZWVrYWJsZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBpc011dGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTXV0ZWQoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uUGxheUNsaWNrOiB0b2dnbGVQbGF5LFxuICAgICAgICAgIG9uRnVsbHNjcmVlbkNsaWNrOiB0b2dnbGVGdWxsc2NyZWVuLFxuICAgICAgICAgIG9uSGVscENsaWNrOiB0b2dnbGVIZWxwLFxuICAgICAgICAgIG9uU2Vla0NsaWNrOiBzZWVrLFxuICAgICAgICAgIG9uTXV0ZUNsaWNrOiB0b2dnbGVNdXRlZCxcbiAgICAgICAgICByZWYociQpIHtcbiAgICAgICAgICAgIGNvbnN0IF9yZWYkMyA9IGNvbnRyb2xCYXJSZWY7XG4gICAgICAgICAgICB0eXBlb2YgX3JlZiQzID09PSBcImZ1bmN0aW9uXCIgPyBfcmVmJDMociQpIDogY29udHJvbEJhclJlZiA9IHIkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSksIG51bGwpO1xuICAgIGluc2VydChfZWwkMiwgY3JlYXRlQ29tcG9uZW50KFN3aXRjaCwge1xuICAgICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gW2NyZWF0ZUNvbXBvbmVudChNYXRjaCwge1xuICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIG92ZXJsYXkoKSA9PSBcInN0YXJ0XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50KFN0YXJ0T3ZlcmxheSwge1xuICAgICAgICAgICAgICBvbkNsaWNrOiBwbGF5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLCBjcmVhdGVDb21wb25lbnQoTWF0Y2gsIHtcbiAgICAgICAgICBnZXQgd2hlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBvdmVybGF5KCkgPT0gXCJsb2FkZXJcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoTG9hZGVyT3ZlcmxheSwge30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSksIGNyZWF0ZUNvbXBvbmVudChNYXRjaCwge1xuICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIG92ZXJsYXkoKSA9PSBcImVycm9yXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29tcG9uZW50KEVycm9yT3ZlcmxheSwge30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSldO1xuICAgICAgfVxuICAgIH0pLCBudWxsKTtcbiAgICBpbnNlcnQoX2VsJDIsIGNyZWF0ZUNvbXBvbmVudChUcmFuc2l0aW9uLCB7XG4gICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICBnZXQgY2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoU2hvdywge1xuICAgICAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIG92ZXJsYXkoKSA9PSBcImluZm9cIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb21wb25lbnQoSW5mb092ZXJsYXksIHtcbiAgICAgICAgICAgICAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZm9NZXNzYWdlKCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdldCB3YXNQbGF5aW5nKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3YXNQbGF5aW5nKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSksIG51bGwpO1xuICAgIGluc2VydChfZWwkMiwgY3JlYXRlQ29tcG9uZW50KFNob3csIHtcbiAgICAgIGdldCB3aGVuKCkge1xuICAgICAgICByZXR1cm4gaXNIZWxwVmlzaWJsZSgpO1xuICAgICAgfSxcbiAgICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbXBvbmVudChIZWxwT3ZlcmxheSwge1xuICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHNldElzSGVscFZpc2libGUoZmFsc2UpLFxuICAgICAgICAgIGdldCBpc1BhdXNhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmlzUGF1c2FibGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQgaXNTZWVrYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5pc1NlZWthYmxlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0IGhhc0F1ZGlvKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTXV0ZWQoKSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSksIG51bGwpO1xuICAgIGNyZWF0ZVJlbmRlckVmZmVjdChfcCQgPT4ge1xuICAgICAgY29uc3QgX3YkID0gISFjb250cm9sc1Zpc2libGUoKSxcbiAgICAgICAgX3YkMiA9IHBsYXllckNsYXNzKCksXG4gICAgICAgIF92JDMgPSBwbGF5ZXJTdHlsZSgpO1xuICAgICAgX3YkICE9PSBfcCQuX3YkICYmIF9lbCQuY2xhc3NMaXN0LnRvZ2dsZShcImFwLWh1ZFwiLCBfcCQuX3YkID0gX3YkKTtcbiAgICAgIF92JDIgIT09IF9wJC5fdiQyICYmIGNsYXNzTmFtZShfZWwkMiwgX3AkLl92JDIgPSBfdiQyKTtcbiAgICAgIF9wJC5fdiQzID0gc3R5bGUoX2VsJDIsIF92JDMsIF9wJC5fdiQzKTtcbiAgICAgIHJldHVybiBfcCQ7XG4gICAgfSwge1xuICAgICAgX3YkOiB1bmRlZmluZWQsXG4gICAgICBfdiQyOiB1bmRlZmluZWQsXG4gICAgICBfdiQzOiB1bmRlZmluZWRcbiAgICB9KTtcbiAgICByZXR1cm4gX2VsJDtcbiAgfSkoKTtcbiAgcmV0dXJuIGVsO1xufSk7XG5kZWxlZ2F0ZUV2ZW50cyhbXCJrZXlkb3duXCIsIFwibW91c2Vtb3ZlXCJdKTtcblxuZnVuY3Rpb24gbW91bnQoY29yZSwgZWxlbSkge1xuICBsZXQgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gIGNvbnN0IG1ldHJpY3MgPSBtZWFzdXJlVGVybWluYWwob3B0cy50ZXJtaW5hbEZvbnRGYW1pbHksIG9wdHMudGVybWluYWxMaW5lSGVpZ2h0KTtcbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgY29yZTogY29yZSxcbiAgICBsb2dnZXI6IG9wdHMubG9nZ2VyLFxuICAgIGNvbHM6IG9wdHMuY29scyxcbiAgICByb3dzOiBvcHRzLnJvd3MsXG4gICAgZml0OiBvcHRzLmZpdCxcbiAgICBjb250cm9sczogb3B0cy5jb250cm9scyxcbiAgICBhdXRvUGxheTogb3B0cy5hdXRvUGxheSxcbiAgICB0ZXJtaW5hbEZvbnRTaXplOiBvcHRzLnRlcm1pbmFsRm9udFNpemUsXG4gICAgdGVybWluYWxGb250RmFtaWx5OiBvcHRzLnRlcm1pbmFsRm9udEZhbWlseSxcbiAgICB0ZXJtaW5hbExpbmVIZWlnaHQ6IG9wdHMudGVybWluYWxMaW5lSGVpZ2h0LFxuICAgIHRoZW1lOiBvcHRzLnRoZW1lLFxuICAgIC4uLm1ldHJpY3NcbiAgfTtcbiAgbGV0IGVsO1xuICBjb25zdCBkaXNwb3NlID0gcmVuZGVyKCgpID0+IHtcbiAgICBlbCA9IGNyZWF0ZUNvbXBvbmVudChQbGF5ZXIsIHByb3BzKTtcbiAgICByZXR1cm4gZWw7XG4gIH0sIGVsZW0pO1xuICByZXR1cm4ge1xuICAgIGVsOiBlbCxcbiAgICBkaXNwb3NlOiBkaXNwb3NlXG4gIH07XG59XG5mdW5jdGlvbiBtZWFzdXJlVGVybWluYWwoZm9udEZhbWlseSwgbGluZUhlaWdodCkge1xuICBjb25zdCBjb2xzID0gODA7XG4gIGNvbnN0IHJvd3MgPSAyNDtcbiAgY29uc3QgcGxheWVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgcGxheWVyRGl2LmNsYXNzTmFtZSA9IFwiYXAtZGVmYXVsdC10ZXJtLWZmXCI7XG4gIHBsYXllckRpdi5zdHlsZS5oZWlnaHQgPSBcIjBweFwiO1xuICBwbGF5ZXJEaXYuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICBwbGF5ZXJEaXYuc3R5bGUuZm9udFNpemUgPSBcIjE1cHhcIjsgLy8gbXVzdCBtYXRjaCBmb250LXNpemUgb2YgZGl2LmFzY2lpbmVtYS1wbGF5ZXIgaW4gQ1NTXG5cbiAgaWYgKGZvbnRGYW1pbHkgIT09IHVuZGVmaW5lZCkge1xuICAgIHBsYXllckRpdi5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tdGVybS1mb250LWZhbWlseVwiLCBmb250RmFtaWx5KTtcbiAgfVxuICBjb25zdCB0ZXJtRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGVybURpdi5jbGFzc05hbWUgPSBcImFwLXRlcm1cIjtcbiAgdGVybURpdi5zdHlsZS53aWR0aCA9IGAke2NvbHN9Y2hgO1xuICB0ZXJtRGl2LnN0eWxlLmhlaWdodCA9IGAke3Jvd3MgKiAobGluZUhlaWdodCA/PyAxLjMzMzMzMzMzMzMpfWVtYDtcbiAgdGVybURpdi5zdHlsZS5mb250U2l6ZSA9IFwiMTAwJVwiO1xuICBwbGF5ZXJEaXYuYXBwZW5kQ2hpbGQodGVybURpdik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheWVyRGl2KTtcbiAgY29uc3QgbWV0cmljcyA9IHtcbiAgICBjaGFyVzogdGVybURpdi5jbGllbnRXaWR0aCAvIGNvbHMsXG4gICAgY2hhckg6IHRlcm1EaXYuY2xpZW50SGVpZ2h0IC8gcm93cyxcbiAgICBib3JkZXJzVzogdGVybURpdi5vZmZzZXRXaWR0aCAtIHRlcm1EaXYuY2xpZW50V2lkdGgsXG4gICAgYm9yZGVyc0g6IHRlcm1EaXYub2Zmc2V0SGVpZ2h0IC0gdGVybURpdi5jbGllbnRIZWlnaHRcbiAgfTtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChwbGF5ZXJEaXYpO1xuICByZXR1cm4gbWV0cmljcztcbn1cblxuY29uc3QgQ09SRV9PUFRTID0gWydhdWRpb1VybCcsICdhdXRvUGxheScsICdhdXRvcGxheScsICdib2xkSXNCcmlnaHQnLCAnY29scycsICdpZGxlVGltZUxpbWl0JywgJ2xvb3AnLCAnbWFya2VycycsICdwYXVzZU9uTWFya2VycycsICdwb3N0ZXInLCAncHJlbG9hZCcsICdyb3dzJywgJ3NwZWVkJywgJ3N0YXJ0QXQnXTtcbmNvbnN0IFVJX09QVFMgPSBbJ2F1dG9QbGF5JywgJ2F1dG9wbGF5JywgJ2NvbHMnLCAnY29udHJvbHMnLCAnZml0JywgJ3Jvd3MnLCAndGVybWluYWxGb250RmFtaWx5JywgJ3Rlcm1pbmFsRm9udFNpemUnLCAndGVybWluYWxMaW5lSGVpZ2h0JywgJ3RoZW1lJ107XG5mdW5jdGlvbiBjb3JlT3B0cyhpbnB1dE9wdHMpIHtcbiAgbGV0IG92ZXJyaWRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIGNvbnN0IG9wdHMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoaW5wdXRPcHRzKS5maWx0ZXIoX3JlZiA9PiB7XG4gICAgbGV0IFtrZXldID0gX3JlZjtcbiAgICByZXR1cm4gQ09SRV9PUFRTLmluY2x1ZGVzKGtleSk7XG4gIH0pKTtcbiAgb3B0cy5hdXRvUGxheSA/Pz0gb3B0cy5hdXRvcGxheTtcbiAgb3B0cy5zcGVlZCA/Pz0gMS4wO1xuICByZXR1cm4ge1xuICAgIC4uLm9wdHMsXG4gICAgLi4ub3ZlcnJpZGVzXG4gIH07XG59XG5mdW5jdGlvbiB1aU9wdHMoaW5wdXRPcHRzKSB7XG4gIGxldCBvdmVycmlkZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICBjb25zdCBvcHRzID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGlucHV0T3B0cykuZmlsdGVyKF9yZWYyID0+IHtcbiAgICBsZXQgW2tleV0gPSBfcmVmMjtcbiAgICByZXR1cm4gVUlfT1BUUy5pbmNsdWRlcyhrZXkpO1xuICB9KSk7XG4gIG9wdHMuYXV0b1BsYXkgPz89IG9wdHMuYXV0b3BsYXk7XG4gIG9wdHMuY29udHJvbHMgPz89IFwiYXV0b1wiO1xuICByZXR1cm4ge1xuICAgIC4uLm9wdHMsXG4gICAgLi4ub3ZlcnJpZGVzXG4gIH07XG59XG5cbmV4cG9ydCB7IGNvcmVPcHRzIGFzIGMsIG1vdW50IGFzIG0sIHVpT3B0cyBhcyB1IH07XG4iLCAiaW1wb3J0IHsgQyBhcyBDb3JlIH0gZnJvbSAnLi9jb3JlLURuTk9NdFpuLmpzJztcbmltcG9ydCB7IGMgYXMgY29yZU9wdHMsIG0gYXMgbW91bnQsIHUgYXMgdWlPcHRzIH0gZnJvbSAnLi9vcHRzLUJ0THhzTV82LmpzJztcbmltcG9ydCB7IEQgYXMgRHVtbXlMb2dnZXIgfSBmcm9tICcuL2xvZ2dpbmctLVAwQ3NFdV8uanMnO1xuXG5mdW5jdGlvbiBjcmVhdGUoc3JjLCBlbGVtKSB7XG4gIGxldCBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgY29uc3QgbG9nZ2VyID0gb3B0cy5sb2dnZXIgPz8gbmV3IER1bW15TG9nZ2VyKCk7XG4gIGNvbnN0IGNvcmUgPSBuZXcgQ29yZShzcmMsIGNvcmVPcHRzKG9wdHMsIHtcbiAgICBsb2dnZXJcbiAgfSkpO1xuICBjb25zdCB7XG4gICAgZWwsXG4gICAgZGlzcG9zZVxuICB9ID0gbW91bnQoY29yZSwgZWxlbSwgdWlPcHRzKG9wdHMsIHtcbiAgICBsb2dnZXJcbiAgfSkpO1xuICBjb25zdCByZWFkeSA9IGNvcmUuaW5pdCgpO1xuICBjb25zdCBwbGF5ZXIgPSB7XG4gICAgZWwsXG4gICAgZGlzcG9zZSxcbiAgICBnZXRDdXJyZW50VGltZTogKCkgPT4gcmVhZHkudGhlbihjb3JlLmdldEN1cnJlbnRUaW1lLmJpbmQoY29yZSkpLFxuICAgIGdldER1cmF0aW9uOiAoKSA9PiByZWFkeS50aGVuKGNvcmUuZ2V0RHVyYXRpb24uYmluZChjb3JlKSksXG4gICAgcGxheTogKCkgPT4gcmVhZHkudGhlbihjb3JlLnBsYXkuYmluZChjb3JlKSksXG4gICAgcGF1c2U6ICgpID0+IHJlYWR5LnRoZW4oY29yZS5wYXVzZS5iaW5kKGNvcmUpKSxcbiAgICBzZWVrOiBwb3MgPT4gcmVhZHkudGhlbigoKSA9PiBjb3JlLnNlZWsocG9zKSlcbiAgfTtcbiAgcGxheWVyLmFkZEV2ZW50TGlzdGVuZXIgPSAobmFtZSwgY2FsbGJhY2spID0+IHtcbiAgICByZXR1cm4gY29yZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrLmJpbmQocGxheWVyKSk7XG4gIH07XG4gIHJldHVybiBwbGF5ZXI7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZSB9O1xuIiwgIi5hcC1kZWZhdWx0LXRlcm0tZmYge1xuICAtLXRlcm0tZm9udC1mYW1pbHk6IFwiQ2FzY2FkaWEgQ29kZVwiLCBcIlNvdXJjZSBDb2RlIFByb1wiLCBNZW5sbywgQ29uc29sYXMsIFwiRGVqYVZ1IFNhbnMgTW9ub1wiLCBtb25vc3BhY2UsIFwiU3ltYm9scyBOZXJkIEZvbnRcIjtcbn1cbmRpdi5hcC13cmFwcGVyIHtcbiAgb3V0bGluZTogbm9uZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbmRpdi5hcC13cmFwcGVyIC50aXRsZS1iYXIge1xuICBkaXNwbGF5OiBub25lO1xuICB0b3A6IC03OHB4O1xuICB0cmFuc2l0aW9uOiB0b3AgMC4xNXMgbGluZWFyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsaW5lLWhlaWdodDogMWVtO1xuICBwYWRkaW5nOiAxNXB4O1xuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgY29sb3I6IHdoaXRlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOCk7XG59XG5kaXYuYXAtd3JhcHBlciAudGl0bGUtYmFyIGltZyB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gIGhlaWdodDogNDhweDtcbiAgbWFyZ2luLXJpZ2h0OiAxNnB4O1xufVxuZGl2LmFwLXdyYXBwZXIgLnRpdGxlLWJhciBhIHtcbiAgY29sb3I6IHdoaXRlO1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cbmRpdi5hcC13cmFwcGVyIC50aXRsZS1iYXIgYTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbmRpdi5hcC13cmFwcGVyOmZ1bGxzY3JlZW4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xuICB3aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmRpdi5hcC13cmFwcGVyOmZ1bGxzY3JlZW4gLnRpdGxlLWJhciB7XG4gIGRpc3BsYXk6IGluaXRpYWw7XG59XG5kaXYuYXAtd3JhcHBlcjpmdWxsc2NyZWVuLmh1ZCAudGl0bGUtYmFyIHtcbiAgdG9wOiAwO1xufVxuZGl2LmFwLXdyYXBwZXIgZGl2LmFwLXBsYXllciB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcGFkZGluZzogMHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpO1xufVxuLmFwLXBsYXllciB7XG4gIC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kOiAjZmZmZmZmO1xuICAtLXRlcm0tY29sb3ItYmFja2dyb3VuZDogIzAwMDAwMDtcbiAgLS10ZXJtLWNvbG9yLTA6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIC0tdGVybS1jb2xvci0xOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICAtLXRlcm0tY29sb3ItMjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgLS10ZXJtLWNvbG9yLTM6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIC0tdGVybS1jb2xvci00OiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICAtLXRlcm0tY29sb3ItNTogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgLS10ZXJtLWNvbG9yLTY6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIC0tdGVybS1jb2xvci03OiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICAtLXRlcm0tY29sb3ItODogdmFyKC0tdGVybS1jb2xvci0wKTtcbiAgLS10ZXJtLWNvbG9yLTk6IHZhcigtLXRlcm0tY29sb3ItMSk7XG4gIC0tdGVybS1jb2xvci0xMDogdmFyKC0tdGVybS1jb2xvci0yKTtcbiAgLS10ZXJtLWNvbG9yLTExOiB2YXIoLS10ZXJtLWNvbG9yLTMpO1xuICAtLXRlcm0tY29sb3ItMTI6IHZhcigtLXRlcm0tY29sb3ItNCk7XG4gIC0tdGVybS1jb2xvci0xMzogdmFyKC0tdGVybS1jb2xvci01KTtcbiAgLS10ZXJtLWNvbG9yLTE0OiB2YXIoLS10ZXJtLWNvbG9yLTYpO1xuICAtLXRlcm0tY29sb3ItMTU6IHZhcigtLXRlcm0tY29sb3ItNyk7XG59XG5kaXYuYXAtdGVybSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLXRlcm0tZm9udC1mYW1pbHkpO1xuICBib3JkZXItd2lkdGg6IDAuNzVlbTtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpO1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbn1cbmRpdi5hcC10ZXJtIGNhbnZhcyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgaW5zZXQ6IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuZGl2LmFwLXRlcm0gc3ZnLmFwLXRlcm0tc3ltYm9scyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgaW5zZXQ6IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbmRpdi5hcC10ZXJtIHN2Zy5hcC10ZXJtLXN5bWJvbHMgdXNlIHtcbiAgY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG59XG5kaXYuYXAtdGVybSBzdmcuYXAtdGVybS1zeW1ib2xzOm5vdCguYXAtYmxpbmspIC5hcC1ibGluayB7XG4gIG9wYWNpdHk6IDA7XG59XG5kaXYuYXAtdGVybSBwcmUuYXAtdGVybS10ZXh0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBhZGRpbmc6IDA7XG4gIG1hcmdpbjogMHB4O1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2hpdGUtc3BhY2U6IHByZTtcbiAgd29yZC13cmFwOiBub3JtYWw7XG4gIHdvcmQtYnJlYWs6IG5vcm1hbDtcbiAgY3Vyc29yOiB0ZXh0O1xuICBjb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgb3V0bGluZTogbm9uZTtcbiAgbGluZS1oZWlnaHQ6IHZhcigtLXRlcm0tbGluZS1oZWlnaHQpO1xuICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgZm9udC1zaXplOiBpbmhlcml0O1xuICBmb250LXZhcmlhbnQtbGlnYXR1cmVzOiBub25lO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG59XG5wcmUuYXAtdGVybS10ZXh0IC5hcC1saW5lIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IHZhcigtLXRlcm0tbGluZS1oZWlnaHQpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogY2FsYygxMDAlICogdmFyKC0tcm93KSAvIHZhcigtLXRlcm0tcm93cykpO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxucHJlLmFwLXRlcm0tdGV4dCAuYXAtbGluZSBzcGFuIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiBjYWxjKDEwMCUgKiB2YXIoLS1vZmZzZXQpIC8gdmFyKC0tdGVybS1jb2xzKSk7XG4gIHBhZGRpbmc6IDA7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgaGVpZ2h0OiAxMDAlO1xufVxucHJlLmFwLXRlcm0tdGV4dDpub3QoLmFwLWJsaW5rKSAuYXAtbGluZSAuYXAtYmxpbmsge1xuICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5wcmUuYXAtdGVybS10ZXh0IC5hcC1ib2xkIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5wcmUuYXAtdGVybS10ZXh0IC5hcC1mYWludCB7XG4gIG9wYWNpdHk6IDAuNTtcbn1cbnByZS5hcC10ZXJtLXRleHQgLmFwLXVuZGVybGluZSB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxucHJlLmFwLXRlcm0tdGV4dCAuYXAtaXRhbGljIHtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xufVxucHJlLmFwLXRlcm0tdGV4dCAuYXAtc3RyaWtlIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBsaW5lLXRocm91Z2g7XG59XG4uYXAtbGluZSBzcGFuIHtcbiAgY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG59XG5kaXYuYXAtcGxheWVyIGRpdi5hcC1jb250cm9sLWJhciB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDMycHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIGNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMTVzIGxpbmVhcjtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGJvcmRlci10b3A6IDJweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkgODAlLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpKTtcbiAgei1pbmRleDogMzA7XG59XG5kaXYuYXAtcGxheWVyIGRpdi5hcC1jb250cm9sLWJhciAqIHtcbiAgYm94LXNpemluZzogaW5oZXJpdDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciBzdmcuYXAtaWNvbiBwYXRoIHtcbiAgZmlsbDogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbn1cbmRpdi5hcC1jb250cm9sLWJhciBzcGFuLmFwLWJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgc3Bhbi5hcC1wbGF5YmFjay1idXR0b24ge1xuICB3aWR0aDogMTJweDtcbiAgaGVpZ2h0OiAxMnB4O1xuICBwYWRkaW5nOiAxMHB4O1xuICBtYXJnaW46IDAgMCAwIDJweDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciBzcGFuLmFwLXBsYXliYWNrLWJ1dHRvbiBzdmcge1xuICBoZWlnaHQ6IDEycHg7XG4gIHdpZHRoOiAxMnB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtdGltZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4OiAwIDAgYXV0bztcbiAgbWluLXdpZHRoOiA1MHB4O1xuICBtYXJnaW46IDAgMTBweDtcbiAgaGVpZ2h0OiAxMDAlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgbGluZS1oZWlnaHQ6IDEwMCU7XG4gIGN1cnNvcjogZGVmYXVsdDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciBzcGFuLmFwLXRpbWVyIHNwYW4ge1xuICBmb250LWZhbWlseTogdmFyKC0tdGVybS1mb250LWZhbWlseSk7XG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgbWFyZ2luOiBhdXRvO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtdGltZXIgLmFwLXRpbWUtcmVtYWluaW5nIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbmRpdi5hcC1jb250cm9sLWJhciBzcGFuLmFwLXRpbWVyOmhvdmVyIC5hcC10aW1lLWVsYXBzZWQge1xuICBkaXNwbGF5OiBub25lO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIHNwYW4uYXAtdGltZXI6aG92ZXIgLmFwLXRpbWUtcmVtYWluaW5nIHtcbiAgZGlzcGxheTogZmxleDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtcHJvZ3Jlc3NiYXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgZmxleDogMSAxIGF1dG87XG4gIGhlaWdodDogMTAwJTtcbiAgcGFkZGluZzogMCAxMHB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1wcm9ncmVzc2JhciAuYXAtYmFyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY3Vyc29yOiBkZWZhdWx0O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGZvbnQtc2l6ZTogMDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtcHJvZ3Jlc3NiYXIgLmFwLWJhciAuYXAtZ3V0dGVyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxNXB4O1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgaGVpZ2h0OiAzcHg7XG59XG5kaXYuYXAtY29udHJvbC1iYXIgLmFwLXByb2dyZXNzYmFyIC5hcC1iYXIgLmFwLWd1dHRlci1lbXB0eSB7XG4gIGJhY2tncm91bmQtY29sb3I6IGNvbG9yLW1peChpbiBva2xhYiwgdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKSAyMCUsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkpO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1wcm9ncmVzc2JhciAuYXAtYmFyIC5hcC1ndXR0ZXItZnVsbCB7XG4gIHdpZHRoOiAxMDAlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyLmFwLXNlZWthYmxlIC5hcC1wcm9ncmVzc2JhciAuYXAtYmFyIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1mdWxsc2NyZWVuLWJ1dHRvbiB7XG4gIHdpZHRoOiAxNHB4O1xuICBoZWlnaHQ6IDE0cHg7XG4gIHBhZGRpbmc6IDlweDtcbiAgbWFyZ2luOiAwIDJweCAwIDRweDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtZnVsbHNjcmVlbi1idXR0b24gc3ZnIHtcbiAgd2lkdGg6IDE0cHg7XG4gIGhlaWdodDogMTRweDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtZnVsbHNjcmVlbi1idXR0b24gc3ZnLmFwLWljb24tZnVsbHNjcmVlbi1vbiB7XG4gIGRpc3BsYXk6IGlubGluZTtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtZnVsbHNjcmVlbi1idXR0b24gc3ZnLmFwLWljb24tZnVsbHNjcmVlbi1vZmYge1xuICBkaXNwbGF5OiBub25lO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1mdWxsc2NyZWVuLWJ1dHRvbiAuYXAtdG9vbHRpcCB7XG4gIHJpZ2h0OiA1cHg7XG4gIGxlZnQ6IGluaXRpYWw7XG4gIHRyYW5zZm9ybTogbm9uZTtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAta2JkLWJ1dHRvbiB7XG4gIGhlaWdodDogMTRweDtcbiAgcGFkZGluZzogOXB4O1xuICBtYXJnaW46IDAgMCAwIDRweDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAta2JkLWJ1dHRvbiBzdmcge1xuICB3aWR0aDogMjZweDtcbiAgaGVpZ2h0OiAxNHB4O1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1rYmQtYnV0dG9uIC5hcC10b29sdGlwIHtcbiAgcmlnaHQ6IDVweDtcbiAgbGVmdDogaW5pdGlhbDtcbiAgdHJhbnNmb3JtOiBub25lO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1zcGVha2VyLWJ1dHRvbiB7XG4gIHdpZHRoOiAxOXB4O1xuICBwYWRkaW5nOiA2cHggOXB4O1xuICBtYXJnaW46IDAgMCAwIDRweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuZGl2LmFwLWNvbnRyb2wtYmFyIC5hcC1zcGVha2VyLWJ1dHRvbiBzdmcge1xuICB3aWR0aDogMTlweDtcbn1cbmRpdi5hcC1jb250cm9sLWJhciAuYXAtc3BlYWtlci1idXR0b24gLmFwLXRvb2x0aXAge1xuICBsZWZ0OiAtNTAlO1xuICB0cmFuc2Zvcm06IG5vbmU7XG59XG5kaXYuYXAtd3JhcHBlci5hcC1odWQgLmFwLWNvbnRyb2wtYmFyIHtcbiAgb3BhY2l0eTogMTtcbn1cbmRpdi5hcC13cmFwcGVyOmZ1bGxzY3JlZW4gLmFwLWZ1bGxzY3JlZW4tYnV0dG9uIHN2Zy5hcC1pY29uLWZ1bGxzY3JlZW4tb24ge1xuICBkaXNwbGF5OiBub25lO1xufVxuZGl2LmFwLXdyYXBwZXI6ZnVsbHNjcmVlbiAuYXAtZnVsbHNjcmVlbi1idXR0b24gc3ZnLmFwLWljb24tZnVsbHNjcmVlbi1vZmYge1xuICBkaXNwbGF5OiBpbmxpbmU7XG59XG5zcGFuLmFwLXByb2dyZXNzYmFyIHNwYW4uYXAtbWFya2VyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB0b3A6IDA7XG4gIGJvdHRvbTogMDtcbiAgd2lkdGg6IDIxcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbWFyZ2luLWxlZnQ6IC0xMHB4O1xufVxuc3Bhbi5hcC1tYXJrZXItY29udGFpbmVyIHNwYW4uYXAtbWFya2VyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRvcDogMTNweDtcbiAgYm90dG9tOiAxMnB4O1xuICBsZWZ0OiA3cHg7XG4gIHJpZ2h0OiA3cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IGNvbG9yLW1peChpbiBva2xhYiwgdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKSAzMyUsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRyYW5zaXRpb246IHRvcCAwLjFzLCBib3R0b20gMC4xcywgbGVmdCAwLjFzLCByaWdodCAwLjFzLCBiYWNrZ3JvdW5kLWNvbG9yIDAuMXM7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cbnNwYW4uYXAtbWFya2VyLWNvbnRhaW5lciBzcGFuLmFwLW1hcmtlci5hcC1tYXJrZXItcGFzdCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG59XG5zcGFuLmFwLW1hcmtlci1jb250YWluZXIgc3Bhbi5hcC1tYXJrZXI6aG92ZXIsXG5zcGFuLmFwLW1hcmtlci1jb250YWluZXI6aG92ZXIgc3Bhbi5hcC1tYXJrZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICB0b3A6IDExcHg7XG4gIGJvdHRvbTogMTBweDtcbiAgbGVmdDogNXB4O1xuICByaWdodDogNXB4O1xufVxuLmFwLXRvb2x0aXAtY29udGFpbmVyIHNwYW4uYXAtdG9vbHRpcCB7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgY29sb3I6IHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCk7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS10ZXJtLWZvbnQtZmFtaWx5KTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZzogMCAwLjVlbTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDE7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIC8qIFByZXZlbnRzIHRoZSB0ZXh0IGZyb20gd3JhcHBpbmcgYW5kIG1ha2VzIHN1cmUgdGhlIHRvb2x0aXAgd2lkdGggYWRhcHRzIHRvIHRoZSB0ZXh0IGxlbmd0aCAqL1xuICBmb250LXNpemU6IDEzcHg7XG4gIGxpbmUtaGVpZ2h0OiAyZW07XG4gIGJvdHRvbTogMTAwJTtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XG59XG4uYXAtdG9vbHRpcC1jb250YWluZXI6aG92ZXIgc3Bhbi5hcC10b29sdGlwIHtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXkge1xuICB6LWluZGV4OiAxMDtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LXN0YXJ0IHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1zdGFydCAuYXAtcGxheS1idXR0b24ge1xuICBmb250LXNpemU6IDBweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAwO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6IHdoaXRlO1xuICBoZWlnaHQ6IDgwcHg7XG4gIG1heC1oZWlnaHQ6IDY2JTtcbiAgbWFyZ2luOiBhdXRvO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1zdGFydCAuYXAtcGxheS1idXR0b24gZGl2IHtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1zdGFydCAuYXAtcGxheS1idXR0b24gZGl2IHNwYW4ge1xuICBoZWlnaHQ6IDEwMCU7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1zdGFydCAuYXAtcGxheS1idXR0b24gZGl2IHNwYW4gc3ZnIHtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LXN0YXJ0IC5hcC1wbGF5LWJ1dHRvbiBzdmcge1xuICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggNXB4IHJnYmEoMCwgMCwgMCwgMC40KSk7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWxvYWRpbmcgLmFwLWxvYWRlciB7XG4gIHdpZHRoOiA0OHB4O1xuICBoZWlnaHQ6IDQ4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJvcmRlcjogMTBweCBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KSAjZmZmZmZmO1xuICBib3JkZXItY29sb3I6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpIDMwJSwgdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKSkgY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCkgNTAlLCB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpKSBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKSA3MCUsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkpIGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpIDEwMCUsIHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCkpO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBhbmltYXRpb246IGFwLWxvYWRlci1yb3RhdGlvbiAxcyBsaW5lYXIgaW5maW5pdGU7XG59XG4uYXAtcGxheWVyIC5hcC1vdmVybGF5LWluZm8ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1pbmZvIHNwYW4ge1xuICBmb250LWZhbWlseTogdmFyKC0tdGVybS1mb250LWZhbWlseSk7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHZhcigtLXRlcm0tY29sb3ItYmFja2dyb3VuZCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRlcm0tY29sb3ItZm9yZWdyb3VuZCk7XG4gIHBhZGRpbmc6IDAuNWVtIDAuNzVlbTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktaGVscCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgY29udGFpbmVyLXR5cGU6IGlubGluZS1zaXplO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwID4gZGl2IHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLXRlcm0tZm9udC1mYW1pbHkpO1xuICBtYXgtd2lkdGg6IDg1JTtcbiAgbWF4LWhlaWdodDogODUlO1xuICBmb250LXNpemU6IDE4cHg7XG4gIGNvbG9yOiB2YXIoLS10ZXJtLWNvbG9yLWZvcmVncm91bmQpO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwID4gZGl2IGRpdiB7XG4gIHBhZGRpbmc6IGNhbGMobWluKDRjcXcsIDQwcHgpKTtcbiAgZm9udC1zaXplOiBjYWxjKG1pbigxLjljcXcsIDE4cHgpKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKTtcbiAgYm9yZGVyOiAxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGFiLCB2YXIoLS10ZXJtLWNvbG9yLWJhY2tncm91bmQpIDkwJSwgdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKSk7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktaGVscCA+IGRpdiBkaXYgcCB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBtYXJnaW46IDAgMCAyZW0gMDtcbn1cbi5hcC1wbGF5ZXIgLmFwLW92ZXJsYXktaGVscCA+IGRpdiBkaXYgdWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBwYWRkaW5nOiAwO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwID4gZGl2IGRpdiB1bCBsaSB7XG4gIG1hcmdpbjogMCAwIDAuNzVlbSAwO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1oZWxwID4gZGl2IGRpdiBrYmQge1xuICBjb2xvcjogdmFyKC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kKTtcbiAgcGFkZGluZzogMC4yZW0gMC41ZW07XG4gIGJvcmRlci1yYWRpdXM6IDAuMmVtO1xuICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgZm9udC1zaXplOiAwLjg1ZW07XG4gIGJvcmRlcjogbm9uZTtcbiAgbWFyZ2luOiAwO1xufVxuLmFwLXBsYXllciAuYXAtb3ZlcmxheS1lcnJvciBzcGFuIHtcbiAgZm9udC1zaXplOiA4ZW07XG59XG4uYXAtcGxheWVyIC5zbGlkZS1lbnRlci1hY3RpdmUge1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnM7XG59XG4uYXAtcGxheWVyIC5zbGlkZS1lbnRlci1hY3RpdmUuYXAtd2FzLXBsYXlpbmcge1xuICB0cmFuc2l0aW9uOiB0b3AgMC4ycyBlYXNlLW91dCwgb3BhY2l0eSAwLjJzO1xufVxuLmFwLXBsYXllciAuc2xpZGUtZXhpdC1hY3RpdmUge1xuICB0cmFuc2l0aW9uOiB0b3AgMC4ycyBlYXNlLWluLCBvcGFjaXR5IDAuMnM7XG59XG4uYXAtcGxheWVyIC5zbGlkZS1lbnRlciB7XG4gIHRvcDogLTUwJTtcbiAgb3BhY2l0eTogMDtcbn1cbi5hcC1wbGF5ZXIgLnNsaWRlLWVudGVyLXRvIHtcbiAgdG9wOiAwJTtcbn1cbi5hcC1wbGF5ZXIgLnNsaWRlLWVudGVyLFxuLmFwLXBsYXllciAuc2xpZGUtZW50ZXItdG8sXG4uYXAtcGxheWVyIC5zbGlkZS1leGl0LFxuLmFwLXBsYXllciAuc2xpZGUtZXhpdC10byB7XG4gIGJvdHRvbTogYXV0bztcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLmFwLXBsYXllciAuc2xpZGUtZXhpdCB7XG4gIHRvcDogMCU7XG59XG4uYXAtcGxheWVyIC5zbGlkZS1leGl0LXRvIHtcbiAgdG9wOiAtNTAlO1xuICBvcGFjaXR5OiAwO1xufVxuQGtleWZyYW1lcyBhcC1sb2FkZXItcm90YXRpb24ge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuLmFzY2lpbmVtYS1wbGF5ZXItdGhlbWUtYXNjaWluZW1hIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNjY2NjY2M7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMTIxMzE0O1xuICAtLXRlcm0tY29sb3ItMDogIzAwMDAwMDtcbiAgLS10ZXJtLWNvbG9yLTE6ICNkZDNjNjk7XG4gIC0tdGVybS1jb2xvci0yOiAjNGViZjIyO1xuICAtLXRlcm0tY29sb3ItMzogI2RkYWYzYztcbiAgLS10ZXJtLWNvbG9yLTQ6ICMyNmIwZDc7XG4gIC0tdGVybS1jb2xvci01OiAjYjk1NGUxO1xuICAtLXRlcm0tY29sb3ItNjogIzU0ZTFiOTtcbiAgLS10ZXJtLWNvbG9yLTc6ICNkOWQ5ZDk7XG4gIC0tdGVybS1jb2xvci04OiAjNGQ0ZDRkO1xuICAtLXRlcm0tY29sb3ItOTogI2RkM2M2OTtcbiAgLS10ZXJtLWNvbG9yLTEwOiAjNGViZjIyO1xuICAtLXRlcm0tY29sb3ItMTE6ICNkZGFmM2M7XG4gIC0tdGVybS1jb2xvci0xMjogIzI2YjBkNztcbiAgLS10ZXJtLWNvbG9yLTEzOiAjYjk1NGUxO1xuICAtLXRlcm0tY29sb3ItMTQ6ICM1NGUxYjk7XG4gIC0tdGVybS1jb2xvci0xNTogI2ZmZmZmZjtcbn1cbi8qXG4gIEJhc2VkIG9uIERyYWN1bGE6IGh0dHBzOi8vZHJhY3VsYXRoZW1lLmNvbVxuICovXG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1kcmFjdWxhIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNmOGY4ZjI7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMjgyYTM2O1xuICAtLXRlcm0tY29sb3ItMDogIzIxMjIyYztcbiAgLS10ZXJtLWNvbG9yLTE6ICNmZjU1NTU7XG4gIC0tdGVybS1jb2xvci0yOiAjNTBmYTdiO1xuICAtLXRlcm0tY29sb3ItMzogI2YxZmE4YztcbiAgLS10ZXJtLWNvbG9yLTQ6ICNiZDkzZjk7XG4gIC0tdGVybS1jb2xvci01OiAjZmY3OWM2O1xuICAtLXRlcm0tY29sb3ItNjogIzhiZTlmZDtcbiAgLS10ZXJtLWNvbG9yLTc6ICNmOGY4ZjI7XG4gIC0tdGVybS1jb2xvci04OiAjNjI3MmE0O1xuICAtLXRlcm0tY29sb3ItOTogI2ZmNmU2ZTtcbiAgLS10ZXJtLWNvbG9yLTEwOiAjNjlmZjk0O1xuICAtLXRlcm0tY29sb3ItMTE6ICNmZmZmYTU7XG4gIC0tdGVybS1jb2xvci0xMjogI2Q2YWNmZjtcbiAgLS10ZXJtLWNvbG9yLTEzOiAjZmY5MmRmO1xuICAtLXRlcm0tY29sb3ItMTQ6ICNhNGZmZmY7XG4gIC0tdGVybS1jb2xvci0xNTogI2ZmZmZmZjtcbn1cbi8qIEJhc2VkIG9uIE1vbm9rYWkgZnJvbSBiYXNlMTYgY29sbGVjdGlvbiAtIGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc2tlbXBzb24vYmFzZTE2ICovXG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1tb25va2FpIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNmOGY4ZjI7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMjcyODIyO1xuICAtLXRlcm0tY29sb3ItMDogIzI3MjgyMjtcbiAgLS10ZXJtLWNvbG9yLTE6ICNmOTI2NzI7XG4gIC0tdGVybS1jb2xvci0yOiAjYTZlMjJlO1xuICAtLXRlcm0tY29sb3ItMzogI2Y0YmY3NTtcbiAgLS10ZXJtLWNvbG9yLTQ6ICM2NmQ5ZWY7XG4gIC0tdGVybS1jb2xvci01OiAjYWU4MWZmO1xuICAtLXRlcm0tY29sb3ItNjogI2ExZWZlNDtcbiAgLS10ZXJtLWNvbG9yLTc6ICNmOGY4ZjI7XG4gIC0tdGVybS1jb2xvci04OiAjNzU3MTVlO1xuICAtLXRlcm0tY29sb3ItMTU6ICNmOWY4ZjU7XG59XG4vKlxuICBCYXNlZCBvbiBOb3JkOiBodHRwczovL2dpdGh1Yi5jb20vYXJjdGljaWNlc3R1ZGlvL25vcmRcbiAgVmlhOiBodHRwczovL2dpdGh1Yi5jb20vbmVpbG90b29sZS9hc2NpaW5lbWEtdGhlbWUtbm9yZFxuICovXG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1ub3JkIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNlY2VmZjQ7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMmUzNDQwO1xuICAtLXRlcm0tY29sb3ItMDogIzNiNDI1MjtcbiAgLS10ZXJtLWNvbG9yLTE6ICNiZjYxNmE7XG4gIC0tdGVybS1jb2xvci0yOiAjYTNiZThjO1xuICAtLXRlcm0tY29sb3ItMzogI2ViY2I4YjtcbiAgLS10ZXJtLWNvbG9yLTQ6ICM4MWExYzE7XG4gIC0tdGVybS1jb2xvci01OiAjYjQ4ZWFkO1xuICAtLXRlcm0tY29sb3ItNjogIzg4YzBkMDtcbiAgLS10ZXJtLWNvbG9yLTc6ICNlY2VmZjQ7XG59XG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1zZXRpIHtcbiAgLS10ZXJtLWNvbG9yLWZvcmVncm91bmQ6ICNjYWNlY2Q7XG4gIC0tdGVybS1jb2xvci1iYWNrZ3JvdW5kOiAjMTExMjEzO1xuICAtLXRlcm0tY29sb3ItMDogIzMyMzIzMjtcbiAgLS10ZXJtLWNvbG9yLTE6ICNjMjI4MzI7XG4gIC0tdGVybS1jb2xvci0yOiAjOGVjNDNkO1xuICAtLXRlcm0tY29sb3ItMzogI2UwYzY0ZjtcbiAgLS10ZXJtLWNvbG9yLTQ6ICM0M2E1ZDU7XG4gIC0tdGVybS1jb2xvci01OiAjOGI1N2I1O1xuICAtLXRlcm0tY29sb3ItNjogIzhlYzQzZDtcbiAgLS10ZXJtLWNvbG9yLTc6ICNlZWVlZWU7XG4gIC0tdGVybS1jb2xvci0xNTogI2ZmZmZmZjtcbn1cbi8qXG4gIEJhc2VkIG9uIFNvbGFyaXplZCBEYXJrOiBodHRwczovL2V0aGFuc2Nob29ub3Zlci5jb20vc29sYXJpemVkL1xuICovXG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1zb2xhcml6ZWQtZGFyayB7XG4gIC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kOiAjODM5NDk2O1xuICAtLXRlcm0tY29sb3ItYmFja2dyb3VuZDogIzAwMmIzNjtcbiAgLS10ZXJtLWNvbG9yLTA6ICMwNzM2NDI7XG4gIC0tdGVybS1jb2xvci0xOiAjZGMzMjJmO1xuICAtLXRlcm0tY29sb3ItMjogIzg1OTkwMDtcbiAgLS10ZXJtLWNvbG9yLTM6ICNiNTg5MDA7XG4gIC0tdGVybS1jb2xvci00OiAjMjY4YmQyO1xuICAtLXRlcm0tY29sb3ItNTogI2QzMzY4MjtcbiAgLS10ZXJtLWNvbG9yLTY6ICMyYWExOTg7XG4gIC0tdGVybS1jb2xvci03OiAjZWVlOGQ1O1xuICAtLXRlcm0tY29sb3ItODogIzAwMmIzNjtcbiAgLS10ZXJtLWNvbG9yLTk6ICNjYjRiMTY7XG4gIC0tdGVybS1jb2xvci0xMDogIzU4NmU3NTtcbiAgLS10ZXJtLWNvbG9yLTExOiAjNjU3YjgzO1xuICAtLXRlcm0tY29sb3ItMTI6ICM4Mzk0OTY7XG4gIC0tdGVybS1jb2xvci0xMzogIzZjNzFjNDtcbiAgLS10ZXJtLWNvbG9yLTE0OiAjOTNhMWExO1xuICAtLXRlcm0tY29sb3ItMTU6ICNmZGY2ZTM7XG59XG4vKlxuICBCYXNlZCBvbiBTb2xhcml6ZWQgTGlnaHQ6IGh0dHBzOi8vZXRoYW5zY2hvb25vdmVyLmNvbS9zb2xhcml6ZWQvXG4gKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLXNvbGFyaXplZC1saWdodCB7XG4gIC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kOiAjNjU3YjgzO1xuICAtLXRlcm0tY29sb3ItYmFja2dyb3VuZDogI2ZkZjZlMztcbiAgLS10ZXJtLWNvbG9yLTA6ICMwNzM2NDI7XG4gIC0tdGVybS1jb2xvci0xOiAjZGMzMjJmO1xuICAtLXRlcm0tY29sb3ItMjogIzg1OTkwMDtcbiAgLS10ZXJtLWNvbG9yLTM6ICNiNTg5MDA7XG4gIC0tdGVybS1jb2xvci00OiAjMjY4YmQyO1xuICAtLXRlcm0tY29sb3ItNTogI2QzMzY4MjtcbiAgLS10ZXJtLWNvbG9yLTY6ICMyYWExOTg7XG4gIC0tdGVybS1jb2xvci03OiAjZWVlOGQ1O1xuICAtLXRlcm0tY29sb3ItODogIzAwMmIzNjtcbiAgLS10ZXJtLWNvbG9yLTk6ICNjYjRiMTY7XG4gIC0tdGVybS1jb2xvci0xMDogIzU4NmU3NTtcbiAgLS10ZXJtLWNvbG9yLTExOiAjNjU3YzgzO1xuICAtLXRlcm0tY29sb3ItMTI6ICM4Mzk0OTY7XG4gIC0tdGVybS1jb2xvci0xMzogIzZjNzFjNDtcbiAgLS10ZXJtLWNvbG9yLTE0OiAjOTNhMWExO1xuICAtLXRlcm0tY29sb3ItMTU6ICNmZGY2ZTM7XG59XG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1zb2xhcml6ZWQtbGlnaHQgLmFwLW92ZXJsYXktc3RhcnQgLmFwLXBsYXktYnV0dG9uIHN2ZyAuYXAtcGxheS1idG4tZmlsbCB7XG4gIGZpbGw6IHZhcigtLXRlcm0tY29sb3ItMSk7XG59XG4uYXNjaWluZW1hLXBsYXllci10aGVtZS1zb2xhcml6ZWQtbGlnaHQgLmFwLW92ZXJsYXktc3RhcnQgLmFwLXBsYXktYnV0dG9uIHN2ZyAuYXAtcGxheS1idG4tc3Ryb2tlIHtcbiAgc3Ryb2tlOiB2YXIoLS10ZXJtLWNvbG9yLTEpO1xufVxuLypcbiAgQmFzZWQgb24gVGFuZ286IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RhbmdvX0Rlc2t0b3BfUHJvamVjdFxuICovXG4uYXNjaWluZW1hLXBsYXllci10aGVtZS10YW5nbyB7XG4gIC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kOiAjY2NjY2NjO1xuICAtLXRlcm0tY29sb3ItYmFja2dyb3VuZDogIzEyMTMxNDtcbiAgLS10ZXJtLWNvbG9yLTA6ICMwMDAwMDA7XG4gIC0tdGVybS1jb2xvci0xOiAjY2MwMDAwO1xuICAtLXRlcm0tY29sb3ItMjogIzRlOWEwNjtcbiAgLS10ZXJtLWNvbG9yLTM6ICNjNGEwMDA7XG4gIC0tdGVybS1jb2xvci00OiAjMzQ2NWE0O1xuICAtLXRlcm0tY29sb3ItNTogIzc1NTA3YjtcbiAgLS10ZXJtLWNvbG9yLTY6ICMwNjk4OWE7XG4gIC0tdGVybS1jb2xvci03OiAjZDNkN2NmO1xuICAtLXRlcm0tY29sb3ItODogIzU1NTc1MztcbiAgLS10ZXJtLWNvbG9yLTk6ICNlZjI5Mjk7XG4gIC0tdGVybS1jb2xvci0xMDogIzhhZTIzNDtcbiAgLS10ZXJtLWNvbG9yLTExOiAjZmNlOTRmO1xuICAtLXRlcm0tY29sb3ItMTI6ICM3MjlmY2Y7XG4gIC0tdGVybS1jb2xvci0xMzogI2FkN2ZhODtcbiAgLS10ZXJtLWNvbG9yLTE0OiAjMzRlMmUyO1xuICAtLXRlcm0tY29sb3ItMTU6ICNlZWVlZWM7XG59XG4vKlxuICBCYXNlZCBvbiBncnV2Ym94OiBodHRwczovL2dpdGh1Yi5jb20vbW9yaGV0ei9ncnV2Ym94XG4gKi9cbi5hc2NpaW5lbWEtcGxheWVyLXRoZW1lLWdydXZib3gtZGFyayB7XG4gIC0tdGVybS1jb2xvci1mb3JlZ3JvdW5kOiAjZmJmMWM3O1xuICAtLXRlcm0tY29sb3ItYmFja2dyb3VuZDogIzI4MjgyODtcbiAgLS10ZXJtLWNvbG9yLTA6ICMyODI4Mjg7XG4gIC0tdGVybS1jb2xvci0xOiAjY2MyNDFkO1xuICAtLXRlcm0tY29sb3ItMjogIzk4OTcxYTtcbiAgLS10ZXJtLWNvbG9yLTM6ICNkNzk5MjE7XG4gIC0tdGVybS1jb2xvci00OiAjNDU4NTg4O1xuICAtLXRlcm0tY29sb3ItNTogI2IxNjI4NjtcbiAgLS10ZXJtLWNvbG9yLTY6ICM2ODlkNmE7XG4gIC0tdGVybS1jb2xvci03OiAjYTg5OTg0O1xuICAtLXRlcm0tY29sb3ItODogIzdjNmY2NTtcbiAgLS10ZXJtLWNvbG9yLTk6ICNmYjQ5MzQ7XG4gIC0tdGVybS1jb2xvci0xMDogI2I4YmIyNjtcbiAgLS10ZXJtLWNvbG9yLTExOiAjZmFiZDJmO1xuICAtLXRlcm0tY29sb3ItMTI6ICM4M2E1OTg7XG4gIC0tdGVybS1jb2xvci0xMzogI2QzODY5YjtcbiAgLS10ZXJtLWNvbG9yLTE0OiAjOGVjMDdjO1xuICAtLXRlcm0tY29sb3ItMTU6ICNmYmYxYzc7XG59XG4iLCAiaW1wb3J0ICogYXMgQXNjaWluZW1hUGxheWVyIGZyb20gXCJhc2NpaW5lbWEtcGxheWVyXCJcbmltcG9ydCBhc2NpbmVtYUNzcyBmcm9tIFwiYXNjaWluZW1hLXBsYXllci9kaXN0L2J1bmRsZS9hc2NpaW5lbWEtcGxheWVyLmNzc1wiXG5cbmlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWFzY2lpbmVtYS1jc3NdXCIpKSB7XG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpXG4gIHN0eWxlLnNldEF0dHJpYnV0ZShcImRhdGEtYXNjaWluZW1hLWNzc1wiLCBcIlwiKVxuICBzdHlsZS50ZXh0Q29udGVudCA9IGFzY2luZW1hQ3NzXG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VudChlbCkge1xuICBjb25zdCBkYXRhID0gZWwuZGF0YXNldC5jYXN0XG4gIGlmICghZGF0YSkgcmV0dXJuXG5cbiAgY29uc3QgcGxheWVyID0gQXNjaWluZW1hUGxheWVyLmNyZWF0ZShcbiAgICB7IGRhdGEgfSxcbiAgICBlbCxcbiAgICB7XG4gICAgICBmaXQ6IFwid2lkdGhcIixcbiAgICAgIHRlcm1pbmFsRm9udEZhbWlseTogXCInTWVubG8nLCAnTW9uYWNvJywgJ0NvbnNvbGFzJywgbW9ub3NwYWNlXCIsXG4gICAgICB0aGVtZTogXCJhc2NpaW5lbWFcIixcbiAgICAgIHNwZWVkOiA0LFxuICAgICAgaWRsZVRpbWVMaW1pdDogMC41LFxuICAgIH1cbiAgKVxuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgaWYgKHBsYXllciAmJiBwbGF5ZXIuZGlzcG9zZSkgcGxheWVyLmRpc3Bvc2UoKVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEs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U0FBUyxJQUFJLFVBQVUsR0FBRyxVQUFVLFdBQVcsQ0FBQztBQUNwRCxVQUFJLFNBQVMsR0FBRyxJQUFJLFdBQVcsR0FBRyxVQUFVLFFBQVE7QUFDcEQ7QUFBQSxJQUNGLEtBQUs7QUFFSCxVQUFJLFNBQVMsR0FBRyxHQUFHLFdBQVcsR0FBRyxRQUFRO0FBQ3pDLFVBQUksU0FBUyxJQUFJLFVBQVUsSUFBSSxVQUFVLFVBQVUsUUFBUTtBQUMzRCxVQUFJLFNBQVMsR0FBRyxJQUFJLFdBQVcsR0FBRyxVQUFVLFFBQVE7QUFDcEQ7QUFBQSxJQUNGLEtBQUs7QUFFSCxVQUFJLFNBQVMsR0FBRyxJQUFJLFVBQVUsV0FBVyxHQUFHLFFBQVE7QUFDcEQsVUFBSSxTQUFTLEdBQUcsSUFBSSxXQUFXLEdBQUcsVUFBVSxRQUFRO0FBQ3BEO0FBQUEsSUFDRixLQUFLO0FBRUgsVUFBSSxTQUFTLEdBQUcsR0FBRyxVQUFVLFdBQVcsQ0FBQztBQUN6QyxVQUFJLFNBQVMsSUFBSSxVQUFVLElBQUksVUFBVSxVQUFVLFFBQVE7QUFDM0Q7QUFBQSxJQUNGLEtBQUs7QUFFSCxVQUFJLFNBQVMsSUFBSSxVQUFVLEdBQUcsVUFBVSxRQUFRO0FBQ2hELFVBQUksU0FBUyxHQUFHLElBQUksVUFBVSxXQUFXLEdBQUcsUUFBUTtBQUNwRCxVQUFJLFNBQVMsR0FBRyxJQUFJLFdBQVcsR0FBRyxVQUFVLFFBQVE7QUFDcEQ7QUFBQSxJQUNGLEtBQUs7QUFFSCxVQUFJLFNBQVMsR0FBRyxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDN0MsVUFBSSxTQUFTLEdBQUcsSUFBSSxXQUFXLEdBQUcsVUFBVSxRQUFRO0FBQ3BEO0FBQUEsSUFDRixLQUFLO0FBRUgsVUFBSSxTQUFTLElBQUksVUFBVSxJQUFJLFdBQVcsR0FBRyxVQUFVLFFBQVE7QUFDL0Q7QUFBQSxJQUNGLEtBQUs7QUFFSCxVQUFJLFNBQVMsR0FBRyxHQUFHLFVBQVUsUUFBUTtBQUNyQyxVQUFJLFNBQVMsSUFBSSxVQUFVLElBQUksV0FBVyxHQUFHLFVBQVUsUUFBUTtBQUMv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QyxNQUFNLFNBQU8sTUFBTSxLQUFLLE1BQU0sS0FBSyxLQUFLLEdBQUcsQ0FBQztBQUFBLEVBQzlDO0FBQ0EsU0FBTyxtQkFBbUIsQ0FBQyxNQUFNLGFBQWE7QUFDNUMsV0FBTyxLQUFLLGlCQUFpQixNQUFNLFNBQVMsS0FBSyxNQUFNLENBQUM7QUFBQSxFQUMxRDtBQUNBLFNBQU87QUFDVDs7O0FDOUJBOzs7QUNHQSxJQUFJLENBQUMsU0FBUyxjQUFjLHNCQUFzQixHQUFHO0FBQ25ELFFBQU1DLFNBQVEsU0FBUyxjQUFjLE9BQU87QUFDNUMsRUFBQUEsT0FBTSxhQUFhLHNCQUFzQixFQUFFO0FBQzNDLEVBQUFBLE9BQU0sY0FBYztBQUNwQixXQUFTLEtBQUssWUFBWUEsTUFBSztBQUNqQztBQUVPLFNBQVNDLE9BQU0sSUFBSTtBQUN4QixRQUFNLE9BQU8sR0FBRyxRQUFRO0FBQ3hCLE1BQUksQ0FBQyxLQUFNO0FBRVgsUUFBTSxTQUF5QkM7QUFBQSxJQUM3QixFQUFFLEtBQUs7QUFBQSxJQUNQO0FBQUEsSUFDQTtBQUFBLE1BQ0UsS0FBSztBQUFBLE1BQ0wsb0JBQW9CO0FBQUEsTUFDcEIsT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsZUFBZTtBQUFBLElBQ2pCO0FBQUEsRUFDRjtBQUVBLFNBQU8sTUFBTTtBQUNYLFFBQUksVUFBVSxPQUFPLFFBQVMsUUFBTyxRQUFRO0FBQUEsRUFDL0M7QUFDRjsiLAogICJuYW1lcyI6IFsiY2xhc3NOYW1lIiwgInB0ciIsICJidWZmZXIiLCAicmVjb3JkaW5nIiwgImluaXQiLCAic3JjIiwgImxvZ2dlciIsICJhdWRpb1VybCIsICJ1cmwiLCAiZXhlY3V0ZUV2ZW50IiwgImNvbHMiLCAicm93cyIsICJjbGFtcCIsICJwYXJzZUZyYW1lIiwgInBhcnNlIiwgImNsb2NrIiwgImFycmF5IiwgInZhbHVlIiwgImNoaWxkcmVuIiwgImluaXQiLCAiZGlzcG9zZSIsICJjcmVhdGUiLCAiZG9jdW1lbnQiLCAidW53cmFwIiwgImV4aXRUcmFuc2l0aW9uIiwgImVudGVyVHJhbnNpdGlvbiIsICJ0aGVtZSIsICJyZW5kZXIiLCAiY3Vyc29yT24iLCAiZWwiLCAic3R5bGUiLCAiZSIsICJjcmVhdGUiLCAiZGlzcG9zZSIsICJzdHlsZSIsICJtb3VudCIsICJjcmVhdGUiXQp9Cg==

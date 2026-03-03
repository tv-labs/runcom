// node_modules/esm-env/true.js
var true_default = true;

// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
function is_function(thing) {
  return typeof thing === "function";
}
var noop = () => {
};
function run(fn) {
  return fn();
}
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function fallback(value, fallback2, lazy = false) {
  return value === void 0 ? lazy ? (
    /** @type {() => V} */
    fallback2()
  ) : (
    /** @type {V} */
    fallback2
  ) : value;
}
function to_array(value, n) {
  if (Array.isArray(value)) {
    return value;
  }
  if (n === void 0 || !(Symbol.iterator in value)) {
    return Array.from(value);
  }
  const array2 = [];
  for (const element2 of value) {
    array2.push(element2);
    if (array2.length === n) break;
  }
  return array2;
}
function exclude_from_object(obj, keys) {
  var result = {};
  for (var key3 in obj) {
    if (!keys.includes(key3)) {
      result[key3] = obj[key3];
    }
  }
  for (var symbol of Object.getOwnPropertySymbols(obj)) {
    if (Object.propertyIsEnumerable.call(obj, symbol) && !keys.includes(symbol)) {
      result[symbol] = obj[symbol];
    }
  }
  return result;
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
var IS_XHTML = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_FRAGMENT_NODE = 11;

// node_modules/svelte/src/internal/shared/errors.js
function lifecycle_outside_component(name) {
  if (true_default) {
    const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}
function snippet_without_render_tag() {
  if (true_default) {
    const error = new Error(`snippet_without_render_tag
Attempted to render a snippet without a \`{@render}\` block. This would cause the snippet code to be stringified instead of its content being rendered to the DOM. To fix this, change \`{snippet}\` to \`{@render snippet()}\`.
https://svelte.dev/e/snippet_without_render_tag`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/snippet_without_render_tag`);
  }
}

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (true_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function component_api_changed(method, component2) {
  if (true_default) {
    const error = new Error(`component_api_changed
Calling \`${method}\` on a component instance (of ${component2}) is no longer valid in Svelte 5
https://svelte.dev/e/component_api_changed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/component_api_changed`);
  }
}
function component_api_invalid_new(component2, name) {
  if (true_default) {
    const error = new Error(`component_api_invalid_new
Attempted to instantiate ${component2} with \`new ${name}\`, which is no longer valid in Svelte 5. If this component is not under your control, set the \`compatibility.componentApi\` compiler option to \`4\` to keep it working.
https://svelte.dev/e/component_api_invalid_new`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/component_api_invalid_new`);
  }
}
function derived_references_self() {
  if (true_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function each_key_duplicate(a, b, value) {
  if (true_default) {
    const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_duplicate`);
  }
}
function each_key_volatile(index2, a, b) {
  if (true_default) {
    const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${index2} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_volatile`);
  }
}
function effect_in_teardown(rune) {
  if (true_default) {
    const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  if (true_default) {
    const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  if (true_default) {
    const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  if (true_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (true_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function invalid_snippet() {
  if (true_default) {
    const error = new Error(`invalid_snippet
Could not \`{@render}\` snippet due to the expression being \`null\` or \`undefined\`. Consider using optional chaining \`{@render snippet?.()}\`
https://svelte.dev/e/invalid_snippet`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/invalid_snippet`);
  }
}
function props_invalid_value(key3) {
  if (true_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key3}={undefined}\` when \`${key3}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function props_rest_readonly(property) {
  if (true_default) {
    const error = new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${property}\` are readonly
https://svelte.dev/e/props_rest_readonly`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_rest_readonly`);
  }
}
function rune_outside_svelte(rune) {
  if (true_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function set_context_after_init() {
  if (true_default) {
    const error = new Error(`set_context_after_init
\`setContext\` must be called when a component first initializes, not in a subsequent effect or after an \`await\` expression
https://svelte.dev/e/set_context_after_init`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/set_context_after_init`);
  }
}
function state_descriptors_fixed() {
  if (true_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (true_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (true_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (true_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/constants.js
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol();
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
var ATTACHMENT_KEY = "@attach";

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function await_waterfall(name, location) {
  if (true_default) {
    console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function binding_property_non_reactive(binding, location) {
  if (true_default) {
    console.warn(
      `%c[svelte] binding_property_non_reactive
%c${location ? `\`${binding}\` (${location}) is binding to a non-reactive property` : `\`${binding}\` is binding to a non-reactive property`}
https://svelte.dev/e/binding_property_non_reactive`,
      bold,
      normal
    );
  } else {
    console.warn(`https://svelte.dev/e/binding_property_non_reactive`);
  }
}
function console_log_state(method) {
  if (true_default) {
    console.warn(`%c[svelte] console_log_state
%cYour \`console.${method}\` contained \`$state\` proxies. Consider using \`$inspect(...)\` or \`$state.snapshot(...)\` instead
https://svelte.dev/e/console_log_state`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/console_log_state`);
  }
}
function event_handler_invalid(handler, suggestion) {
  if (true_default) {
    console.warn(`%c[svelte] event_handler_invalid
%c${handler} should be a function. Did you mean to ${suggestion}?
https://svelte.dev/e/event_handler_invalid`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/event_handler_invalid`);
  }
}
function hydration_attribute_changed(attribute, html2, value) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html2}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_mismatch(location) {
  if (true_default) {
    console.warn(
      `%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,
      bold,
      normal
    );
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function ownership_invalid_binding(parent, prop2, child2, owner) {
  if (true_default) {
    console.warn(`%c[svelte] ownership_invalid_binding
%c${parent} passed property \`${prop2}\` to ${child2} with \`bind:\`, but its parent component ${owner} did not declare \`${prop2}\` as a binding. Consider creating a binding between ${owner} and ${parent} (e.g. \`bind:${prop2}={...}\` instead of \`${prop2}={...}\`)
https://svelte.dev/e/ownership_invalid_binding`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/ownership_invalid_binding`);
  }
}
function ownership_invalid_mutation(name, location, prop2, parent) {
  if (true_default) {
    console.warn(`%c[svelte] ownership_invalid_mutation
%cMutating unbound props (\`${name}\`, at ${location}) is strongly discouraged. Consider using \`bind:${prop2}={...}\` in ${parent} (or using a callback) instead
https://svelte.dev/e/ownership_invalid_mutation`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/ownership_invalid_mutation`);
  }
}
function select_multiple_invalid_value() {
  if (true_default) {
    console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (true_default) {
    console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function reset(node) {
  if (!hydrating) return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = /** @type {TemplateNode} */
      get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove2 = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = (
        /** @type {Comment} */
        node.data
      );
      if (data === HYDRATION_END) {
        if (depth === 0) return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || // "[1", "[2", etc. for if blocks
      data[0] === "[" && !isNaN(Number(data.slice(1)))) {
        depth += 1;
      }
    }
    var next2 = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    if (remove2) node.remove();
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node.nodeType !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return (
    /** @type {Comment} */
    node.data
  );
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;
function enable_legacy_mode_flag() {
  legacy_mode_flag = true;
}

// node_modules/svelte/src/internal/shared/warnings.js
var bold2 = "font-weight: bold";
var normal2 = "font-weight: normal";
function state_snapshot_uncloneable(properties) {
  if (true_default) {
    console.warn(
      `%c[svelte] state_snapshot_uncloneable
%c${properties ? `The following properties cannot be cloned with \`$state.snapshot\` \u2014 the return value contains the originals:

${properties}` : "Value cannot be cloned with `$state.snapshot` \u2014 the original value was returned"}
https://svelte.dev/e/state_snapshot_uncloneable`,
      bold2,
      normal2
    );
  } else {
    console.warn(`https://svelte.dev/e/state_snapshot_uncloneable`);
  }
}

// node_modules/svelte/src/internal/shared/clone.js
var empty = [];
function snapshot(value, skip_warning = false, no_tojson = false) {
  if (true_default && !skip_warning) {
    const paths = [];
    const copy = clone(value, /* @__PURE__ */ new Map(), "", paths, null, no_tojson);
    if (paths.length === 1 && paths[0] === "") {
      state_snapshot_uncloneable();
    } else if (paths.length > 0) {
      const slice = paths.length > 10 ? paths.slice(0, 7) : paths.slice(0, 10);
      const excess = paths.length - slice.length;
      let uncloned = slice.map((path) => `- <value>${path}`).join("\n");
      if (excess > 0) uncloned += `
- ...and ${excess} more`;
      state_snapshot_uncloneable(uncloned);
    }
    return copy;
  }
  return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element2 = value[i];
        if (i in value) {
          copy[i] = clone(element2, cloned, true_default ? `${path}[${i}]` : path, paths, null, no_tojson);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key3 of Object.keys(value)) {
        copy[key3] = clone(
          // @ts-expect-error
          value[key3],
          cloned,
          true_default ? `${path}.${key3}` : path,
          paths,
          null,
          no_tojson
        );
      }
      return copy;
    }
    if (value instanceof Date) {
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function" && !no_tojson) {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        true_default ? `${path}.toJSON()` : path,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    if (true_default) {
      paths.push(path);
    }
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source2, label2) {
  source2.label = label2;
  tag_proxy(source2.v, label2);
  return source2;
}
function tag_proxy(value, label2) {
  value?.[PROXY_PATH_SYMBOL]?.(label2);
  return value;
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label2) {
  const error = new Error();
  const stack2 = get_stack();
  if (stack2.length === 0) {
    return null;
  }
  stack2.unshift("\n");
  define_property(error, "stack", {
    value: stack2.join("\n")
  });
  define_property(error, "name", {
    value: label2
  });
  return (
    /** @type {Error & { stack: string }} */
    error
  );
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack2 = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack2) return [];
  const lines = stack2.split("\n");
  const new_lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack2) {
  dev_stack = stack2;
}
function add_svelte_meta(callback, type, component2, line, column, additional) {
  const parent = dev_stack;
  dev_stack = {
    type,
    file: component2[FILENAME],
    line,
    column,
    parent,
    ...additional
  };
  try {
    return callback();
  } finally {
    dev_stack = parent;
  }
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function getContext(key3) {
  const context_map = get_or_init_context_map("getContext");
  const result = (
    /** @type {T} */
    context_map.get(key3)
  );
  return result;
}
function setContext(key3, context) {
  const context_map = get_or_init_context_map("setContext");
  if (async_mode_flag) {
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    var valid = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && // pop() runs synchronously, so this indicates we're setting context after an await
    !/** @type {ComponentContext} */
    component_context.i;
    if (!valid) {
      set_context_after_init();
    }
  }
  context_map.set(key3, context);
  return context;
}
function hasContext(key3) {
  const context_map = get_or_init_context_map("hasContext");
  return context_map.has(key3);
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
  if (true_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component2) {
  var context = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component2 !== void 0) {
    context.x = component2;
  }
  context.i = true;
  component_context = context.p;
  if (true_default) {
    dev_current_component_function = component_context?.function ?? null;
  }
  return component2 ?? /** @type {T} */
  {};
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}
function get_or_init_context_map(name) {
  if (component_context === null) {
    lifecycle_outside_component(name);
  }
  return component_context.c ??= new Map(get_parent_context(component_context) || void 0);
}
function get_parent_context(component_context2) {
  let parent = component_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks) run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = /* @__PURE__ */ new WeakMap();
function handle_error(error) {
  var effect2 = active_effect;
  if (effect2 === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (true_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect2));
  }
  if ((effect2.f & REACTION_RAN) === 0 && (effect2.f & EFFECT) === 0) {
    if (true_default && !effect2.parent && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  invoke_error_boundary(error, effect2);
}
function invoke_error_boundary(error, effect2) {
  while (effect2 !== null) {
    if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
      if ((effect2.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect2.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect2 = effect2.parent;
  }
  if (true_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect2) {
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable) return;
  var indent = is_firefox ? "  " : "	";
  var component_stack = `
${indent}in ${effect2.fn?.name || "<unknown>"}`;
  var context = effect2.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message: error.message + `
${component_stack}
`,
    stack: error.stack?.split("\n").filter((line) => !line.includes("svelte/src/internal")).join("\n")
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function update_derived_status(derived2) {
  if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
    set_signal_status(derived2, CLEAN);
  } else {
    set_signal_status(derived2, MAYBE_DIRTY);
  }
}

// node_modules/svelte/src/internal/client/reactivity/utils.js
function clear_marked(deps) {
  if (deps === null) return;
  for (const dep of deps) {
    if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
      continue;
    }
    dep.f ^= WAS_MARKED;
    clear_marked(
      /** @type {Derived} */
      dep.deps
    );
  }
}
function defer_effect(effect2, dirty_effects, maybe_dirty_effects) {
  if ((effect2.f & DIRTY) !== 0) {
    dirty_effects.add(effect2);
  } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
    maybe_dirty_effects.add(effect2);
  }
  clear_marked(effect2.deps);
  set_signal_status(effect2, CLEAN);
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var batches = /* @__PURE__ */ new Set();
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var queued_root_effects = [];
var last_scheduled_effect = null;
var is_flushing_sync = false;
var collected_effects = null;
var uid = 1;
var Batch = class _Batch {
  // for debugging. TODO remove once async is stable
  id = uid++;
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<(batch: Batch) => void>}
   */
  #commit_callbacks = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #discard_callbacks = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #pending = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #blocking_pending = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #deferred = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #dirty_effects = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #maybe_dirty_effects = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #skipped_branches = /* @__PURE__ */ new Map();
  is_fork = false;
  #decrement_queued = false;
  #is_deferred() {
    return this.is_fork || this.#blocking_pending > 0;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(effect2) {
    if (!this.#skipped_branches.has(effect2)) {
      this.#skipped_branches.set(effect2, { d: [], m: [] });
    }
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   */
  unskip_effect(effect2) {
    var tracked = this.#skipped_branches.get(effect2);
    if (tracked) {
      this.#skipped_branches.delete(effect2);
      for (var e of tracked.d) {
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (e of tracked.m) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
    }
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(root_effects) {
    queued_root_effects = [];
    this.apply();
    var effects = collected_effects = [];
    var render_effects = [];
    for (const root33 of root_effects) {
      this.#traverse_effect_tree(root33, effects, render_effects);
    }
    collected_effects = null;
    if (this.#is_deferred()) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      for (const [e, t] of this.#skipped_branches) {
        reset_branch(e, t);
      }
    } else {
      previous_batch = this;
      current_batch = null;
      for (const fn of this.#commit_callbacks) fn(this);
      this.#commit_callbacks.clear();
      if (this.#pending === 0) {
        this.#commit();
      }
      flush_queued_effects(render_effects);
      flush_queued_effects(effects);
      this.#dirty_effects.clear();
      this.#maybe_dirty_effects.clear();
      previous_batch = null;
      this.#deferred?.resolve();
    }
    batch_values = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #traverse_effect_tree(root33, effects, render_effects) {
    root33.f ^= CLEAN;
    var effect2 = root33.first;
    while (effect2 !== null) {
      var flags2 = effect2.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var inert = (flags2 & INERT) !== 0;
      var skip = is_skippable_branch || this.#skipped_branches.has(effect2);
      if (!skip && effect2.fn !== null) {
        if (is_branch) {
          if (!inert) effect2.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect2);
        } else if ((flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (async_mode_flag || inert)) {
          render_effects.push(effect2);
        } else if (is_dirty(effect2)) {
          update_effect(effect2);
          if ((flags2 & BLOCK_EFFECT) !== 0) {
            this.#maybe_dirty_effects.add(effect2);
            if (inert) set_signal_status(effect2, DIRTY);
          }
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      while (effect2 !== null) {
        var next2 = effect2.next;
        if (next2 !== null) {
          effect2 = next2;
          break;
        }
        effect2 = effect2.parent;
      }
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #defer_effects(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
    }
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(source2, value) {
    if (value !== UNINITIALIZED && !this.previous.has(source2)) {
      this.previous.set(source2, value);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, source2.v);
      batch_values?.set(source2, source2.v);
    }
  }
  activate() {
    current_batch = this;
    this.apply();
  }
  deactivate() {
    if (current_batch !== this) return;
    current_batch = null;
    batch_values = null;
  }
  flush() {
    if (queued_root_effects.length > 0) {
      current_batch = this;
      flush_effects();
    } else if (this.#pending === 0 && !this.is_fork) {
      for (const fn of this.#commit_callbacks) fn(this);
      this.#commit_callbacks.clear();
      this.#commit();
      this.#deferred?.resolve();
    }
    this.deactivate();
  }
  discard() {
    for (const fn of this.#discard_callbacks) fn(this);
    this.#discard_callbacks.clear();
  }
  #commit() {
    if (batches.size > 1) {
      this.previous.clear();
      var previous_batch2 = current_batch;
      var previous_batch_values = batch_values;
      var is_earlier = true;
      for (const batch of batches) {
        if (batch === this) {
          is_earlier = false;
          continue;
        }
        const sources = [];
        for (const [source2, value] of this.current) {
          if (batch.current.has(source2)) {
            if (is_earlier && value !== batch.current.get(source2)) {
              batch.current.set(source2, value);
            } else {
              continue;
            }
          }
          sources.push(source2);
        }
        if (sources.length === 0) {
          continue;
        }
        const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
        if (others.length > 0) {
          var prev_queued_root_effects = queued_root_effects;
          queued_root_effects = [];
          const marked = /* @__PURE__ */ new Set();
          const checked = /* @__PURE__ */ new Map();
          for (const source2 of sources) {
            mark_effects(source2, others, marked, checked);
          }
          if (queued_root_effects.length > 0) {
            current_batch = batch;
            batch.apply();
            for (const root33 of queued_root_effects) {
              batch.#traverse_effect_tree(root33, [], []);
            }
            batch.deactivate();
          }
          queued_root_effects = prev_queued_root_effects;
        }
      }
      current_batch = previous_batch2;
      batch_values = previous_batch_values;
    }
    this.#skipped_branches.clear();
    batches.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(blocking) {
    this.#pending += 1;
    if (blocking) this.#blocking_pending += 1;
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(blocking) {
    this.#pending -= 1;
    if (blocking) this.#blocking_pending -= 1;
    if (this.#decrement_queued) return;
    this.#decrement_queued = true;
    queue_micro_task(() => {
      this.#decrement_queued = false;
      if (!this.#is_deferred()) {
        this.revive();
      } else if (queued_root_effects.length > 0) {
        this.flush();
      }
    });
  }
  revive() {
    for (const e of this.#dirty_effects) {
      this.#maybe_dirty_effects.delete(e);
      set_signal_status(e, DIRTY);
      schedule_effect(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      schedule_effect(e);
    }
    this.flush();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(fn) {
    this.#commit_callbacks.add(fn);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(fn) {
    this.#discard_callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new _Batch();
      batches.add(current_batch);
      if (!is_flushing_sync) {
        queue_micro_task(() => {
          if (current_batch !== batch) {
            return;
          }
          batch.flush();
        });
      }
    }
    return current_batch;
  }
  apply() {
    if (!async_mode_flag || !this.is_fork && batches.size === 1) return;
    batch_values = new Map(this.current);
    for (const batch of batches) {
      if (batch === this) continue;
      for (const [source2, previous] of batch.previous) {
        if (!batch_values.has(source2)) {
          batch_values.set(source2, previous);
        }
      }
    }
  }
};
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null) {
        flush_effects();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        current_batch?.flush();
        if (queued_root_effects.length === 0) {
          last_scheduled_effect = null;
          return (
            /** @type {T} */
            result
          );
        }
      }
      flush_effects();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function flush_effects() {
  var source_stacks = true_default ? /* @__PURE__ */ new Set() : null;
  try {
    var flush_count = 0;
    while (queued_root_effects.length > 0) {
      var batch = Batch.ensure();
      if (flush_count++ > 1e3) {
        if (true_default) {
          var updates = /* @__PURE__ */ new Map();
          for (const source2 of batch.current.keys()) {
            for (const [stack2, update2] of source2.updated ?? []) {
              var entry = updates.get(stack2);
              if (!entry) {
                entry = { error: update2.error, count: 0 };
                updates.set(stack2, entry);
              }
              entry.count += update2.count;
            }
          }
          for (const update2 of updates.values()) {
            if (update2.error) {
              console.error(update2.error);
            }
          }
        }
        infinite_loop_guard();
      }
      batch.process(queued_root_effects);
      old_values.clear();
      if (true_default) {
        for (const source2 of batch.current.keys()) {
          source_stacks.add(source2);
        }
      }
    }
  } finally {
    queued_root_effects = [];
    last_scheduled_effect = null;
    collected_effects = null;
    if (true_default) {
      for (
        const source2 of
        /** @type {Set<Source>} */
        source_stacks
      ) {
        source2.updated = null;
      }
    }
  }
}
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (true_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  var i = 0;
  while (i < length) {
    var effect2 = effects[i++];
    if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
      eager_block_effects = /* @__PURE__ */ new Set();
      update_effect(effect2);
      if (effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null && effect2.ac === null) {
        unlink_effect(effect2);
      }
      if (eager_block_effects?.size > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0) continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j2 = ordered_effects.length - 1; j2 >= 0; j2--) {
            const e2 = ordered_effects[j2];
            if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value)) return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags2 = reaction.f;
      if ((flags2 & DERIVED) !== 0) {
        mark_effects(
          /** @type {Derived} */
          reaction,
          sources,
          marked,
          checked
        );
      } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== void 0) return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (includes.call(sources, dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(
        /** @type {Derived} */
        dep,
        sources,
        checked
      )) {
        checked.set(
          /** @type {Derived} */
          dep,
          true
        );
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(signal) {
  var effect2 = last_scheduled_effect = signal;
  var boundary2 = effect2.b;
  if (boundary2?.is_pending && (signal.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (signal.f & REACTION_RAN) === 0) {
    boundary2.defer_effect(signal);
    return;
  }
  while (effect2.parent !== null) {
    effect2 = effect2.parent;
    var flags2 = effect2.f;
    if (collected_effects !== null && effect2 === active_effect) {
      if (async_mode_flag || (signal.f & RENDER_EFFECT) === 0) {
        return;
      }
    }
    if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags2 & CLEAN) === 0) {
        return;
      }
      effect2.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect2);
}
function reset_branch(effect2, tracked) {
  if ((effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) !== 0) {
    return;
  }
  if ((effect2.f & DIRTY) !== 0) {
    tracked.d.push(effect2);
  } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
    tracked.m.push(effect2);
  }
  set_signal_status(effect2, CLEAN);
  var e = effect2.first;
  while (e !== null) {
    reset_branch(e, tracked);
    e = e.next;
  }
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start2) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (true_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start2(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = void 0;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children2, transform_error) {
  new Boundary(node, props, children2, transform_error);
}
var Boundary = class {
  /** @type {Boundary | null} */
  parent;
  is_pending = false;
  /**
   * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
   * Inherited from parent boundary, or defaults to identity.
   * @type {(error: unknown) => unknown}
   */
  transform_error;
  /** @type {TemplateNode} */
  #anchor;
  /** @type {TemplateNode | null} */
  #hydrate_open = hydrating ? hydrate_node : null;
  /** @type {BoundaryProps} */
  #props;
  /** @type {((anchor: Node) => void)} */
  #children;
  /** @type {Effect} */
  #effect;
  /** @type {Effect | null} */
  #main_effect = null;
  /** @type {Effect | null} */
  #pending_effect = null;
  /** @type {Effect | null} */
  #failed_effect = null;
  /** @type {DocumentFragment | null} */
  #offscreen_fragment = null;
  #local_pending_count = 0;
  #pending_count = 0;
  #pending_count_update_queued = false;
  /** @type {Set<Effect>} */
  #dirty_effects = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #maybe_dirty_effects = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    if (true_default) {
      tag(this.#effect_pending, "$effect.pending()");
    }
    return () => {
      this.#effect_pending = null;
    };
  });
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(node, props, children2, transform_error) {
    this.#anchor = node;
    this.#props = props;
    this.#children = (anchor) => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      effect2.b = this;
      effect2.f |= BOUNDARY_EFFECT;
      children2(anchor);
    };
    this.parent = /** @type {Effect} */
    active_effect.b;
    this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
    this.#effect = block(() => {
      if (hydrating) {
        const comment2 = (
          /** @type {Comment} */
          this.#hydrate_open
        );
        hydrate_next();
        const server_rendered_pending = comment2.data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment2.data.startsWith(HYDRATION_START_FAILED);
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(comment2.data.slice(HYDRATION_START_FAILED.length));
          this.#hydrate_failed_content(serialized_error);
        } else if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        this.#render();
      }
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #hydrate_failed_content(error) {
    const failed = this.#props.failed;
    if (!failed) return;
    this.#failed_effect = branch(() => {
      failed(
        this.#anchor,
        () => error,
        () => () => {
        }
      );
    });
  }
  #hydrate_pending_content() {
    const pending2 = this.#props.pending;
    if (!pending2) return;
    this.is_pending = true;
    this.#pending_effect = branch(() => pending2(this.#anchor));
    queue_micro_task(() => {
      var fragment = this.#offscreen_fragment = document.createDocumentFragment();
      var anchor = create_text();
      fragment.append(anchor);
      this.#main_effect = this.#run(() => {
        Batch.ensure();
        return branch(() => this.#children(anchor));
      });
      if (this.#pending_count === 0) {
        this.#anchor.before(fragment);
        this.#offscreen_fragment = null;
        pause_effect(
          /** @type {Effect} */
          this.#pending_effect,
          () => {
            this.#pending_effect = null;
          }
        );
        this.#resolve();
      }
    });
  }
  #render() {
    try {
      this.is_pending = this.has_pending_snippet();
      this.#pending_count = 0;
      this.#local_pending_count = 0;
      this.#main_effect = branch(() => {
        this.#children(this.#anchor);
      });
      if (this.#pending_count > 0) {
        var fragment = this.#offscreen_fragment = document.createDocumentFragment();
        move_effect(this.#main_effect, fragment);
        const pending2 = (
          /** @type {(anchor: Node) => void} */
          this.#props.pending
        );
        this.#pending_effect = branch(() => pending2(this.#anchor));
      } else {
        this.#resolve();
      }
    } catch (error) {
      this.error(error);
    }
  }
  #resolve() {
    this.is_pending = false;
    for (const e of this.#dirty_effects) {
      set_signal_status(e, DIRTY);
      schedule_effect(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      schedule_effect(e);
    }
    this.#dirty_effects.clear();
    this.#maybe_dirty_effects.clear();
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(effect2) {
    defer_effect(effect2, this.#dirty_effects, this.#maybe_dirty_effects);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #update_pending_count(d) {
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        this.parent.#update_pending_count(d);
      }
      return;
    }
    this.#pending_count += d;
    if (this.#pending_count === 0) {
      this.#resolve();
      if (this.#pending_effect) {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
      }
      if (this.#offscreen_fragment) {
        this.#anchor.before(this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      }
    }
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(d) {
    this.#update_pending_count(d);
    this.#local_pending_count += d;
    if (!this.#effect_pending || this.#pending_count_update_queued) return;
    this.#pending_count_update_queued = true;
    queue_micro_task(() => {
      this.#pending_count_update_queued = false;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    });
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get(
      /** @type {Source<number>} */
      this.#effect_pending
    );
  }
  /** @param {unknown} error */
  error(error) {
    var onerror = this.#props.onerror;
    let failed = this.#props.failed;
    if (!onerror && !failed) {
      throw error;
    }
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(
        /** @type {TemplateNode} */
        this.#hydrate_open
      );
      next();
      set_hydrate_node(skip_nodes());
    }
    var did_reset = false;
    var calling_on_error = false;
    const reset2 = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#run(() => {
        Batch.ensure();
        this.#render();
      });
    };
    const handle_error_result = (transformed_error) => {
      try {
        calling_on_error = true;
        onerror?.(transformed_error, reset2);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, this.#effect && this.#effect.parent);
      }
      if (failed) {
        this.#failed_effect = this.#run(() => {
          Batch.ensure();
          try {
            return branch(() => {
              var effect2 = (
                /** @type {Effect} */
                active_effect
              );
              effect2.b = this;
              effect2.f |= BOUNDARY_EFFECT;
              failed(
                this.#anchor,
                () => transformed_error,
                () => reset2
              );
            });
          } catch (error2) {
            invoke_error_boundary(
              error2,
              /** @type {Effect} */
              this.#effect.parent
            );
            return null;
          }
        });
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, this.#effect && this.#effect.parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof /** @type {any} */
      result.then === "function") {
        result.then(
          handle_error_result,
          /** @param {unknown} e */
          (e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
        );
      } else {
        handle_error_result(result);
      }
    });
  }
};

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async2, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  var pending2 = blockers.filter((b) => !b.settled);
  if (async2.length === 0 && pending2.length === 0) {
    fn(sync.map(d));
    return;
  }
  var batch = current_batch;
  var parent = (
    /** @type {Effect} */
    active_effect
  );
  var restore = capture();
  var blocker_promise = pending2.length === 1 ? pending2[0].promise : pending2.length > 1 ? Promise.all(pending2.map((b) => b.promise)) : null;
  function finish(values) {
    restore();
    try {
      fn(values);
    } catch (error) {
      if ((parent.f & DESTROYED) === 0) {
        invoke_error_boundary(error, parent);
      }
    }
    unset_context();
  }
  if (async2.length === 0) {
    blocker_promise.then(() => finish(sync.map(d)));
    return;
  }
  function run3() {
    restore();
    Promise.all(async2.map((expression) => async_derived(expression))).then((result) => finish([...sync.map(d), ...result])).catch((error) => invoke_error_boundary(error, parent));
  }
  if (blocker_promise) {
    blocker_promise.then(run3);
  } else {
    run3();
  }
}
function run_after_blockers(blockers, fn) {
  flatten(blockers, [], [], fn);
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch2 = current_batch;
  if (true_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch) previous_batch2?.activate();
    if (true_default) {
      set_from_async_derived(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context(deactivate_batch = true) {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (deactivate_batch) current_batch?.deactivate();
  if (true_default) {
    set_from_async_derived(null);
    set_dev_stack(null);
  }
}
function increment_pending() {
  var boundary2 = (
    /** @type {Boundary} */
    /** @type {Effect} */
    active_effect.b
  );
  var batch = (
    /** @type {Batch} */
    current_batch
  );
  var blocking = boundary2.is_rendered();
  boundary2.update_pending_count(1);
  batch.increment(blocking);
  return () => {
    boundary2.update_pending_count(-1);
    batch.decrement(blocking);
  };
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var current_async_effect = null;
function set_from_async_derived(v2) {
  current_async_effect = v2;
}
var recent_async_deriveds = /* @__PURE__ */ new Set();
// @__NO_SIDE_EFFECTS__
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
    /** @type {Derived} */
    active_reaction
  ) : null;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      UNINITIALIZED
    ),
    wv: 0,
    parent: parent_derived ?? active_effect,
    ac: null
  };
  if (true_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
// @__NO_SIDE_EFFECTS__
function async_derived(fn, label2, location) {
  let parent = (
    /** @type {Effect | null} */
    active_effect
  );
  if (parent === null) {
    async_derived_orphan();
  }
  var promise = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  );
  var signal = source(
    /** @type {V} */
    UNINITIALIZED
  );
  if (true_default) signal.label = label2;
  var should_suspend = !active_reaction;
  var deferreds = /* @__PURE__ */ new Map();
  async_effect(() => {
    if (true_default) current_async_effect = active_effect;
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, d.reject).finally(unset_context);
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (true_default) current_async_effect = null;
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    if (should_suspend) {
      var decrement_pending = increment_pending();
      deferreds.get(batch)?.reject(STALE_REACTION);
      deferreds.delete(batch);
      deferreds.set(batch, d);
    }
    const handler = (value, error = void 0) => {
      current_async_effect = null;
      batch.activate();
      if (error) {
        if (error !== STALE_REACTION) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        }
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        internal_set(signal, value);
        for (const [b, d2] of deferreds) {
          deferreds.delete(b);
          if (b === batch) break;
          d2.reject(STALE_REACTION);
        }
        if (true_default && location !== void 0) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal)) {
              await_waterfall(
                /** @type {string} */
                signal.label,
                location
              );
              recent_async_deriveds.delete(signal);
            }
          });
        }
      }
      if (decrement_pending) {
        decrement_pending();
      }
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds.values()) {
      d.reject(STALE_REACTION);
    }
  });
  if (true_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
}
// @__NO_SIDE_EFFECTS__
function user_derived(fn) {
  const d = /* @__PURE__ */ derived(fn);
  if (!async_mode_flag) push_reaction_value(d);
  return d;
}
// @__NO_SIDE_EFFECTS__
function derived_safe_equal(fn) {
  const signal = /* @__PURE__ */ derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
var stack = [];
function get_derived_parent_effect(derived2) {
  var parent = derived2.parent;
  while (parent !== null) {
    if ((parent.f & DERIVED) === 0) {
      return (parent.f & DESTROYED) === 0 ? (
        /** @type {Effect} */
        parent
      ) : null;
    }
    parent = parent.parent;
  }
  return null;
}
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(get_derived_parent_effect(derived2));
  if (true_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(/* @__PURE__ */ new Set());
    try {
      if (includes.call(stack, derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.wv = increment_write_version();
    if (!current_batch?.is_fork || derived2.deps === null) {
      derived2.v = value;
      if (derived2.deps === null) {
        set_signal_status(derived2, CLEAN);
        return;
      }
    }
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || current_batch?.is_fork) {
      batch_values.set(derived2, value);
    }
  } else {
    update_derived_status(derived2);
  }
}
function freeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown || e.ac) {
      e.teardown?.();
      e.ac?.abort(STALE_REACTION);
      e.teardown = noop;
      e.ac = null;
      remove_reactions(e, 0);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown) {
      update_effect(e);
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = /* @__PURE__ */ new Set();
var old_values = /* @__PURE__ */ new Map();
function set_eager_effects(v2) {
  eager_effects = v2;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v2, stack2) {
  var signal = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: v2,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  if (true_default && tracing_mode_flag) {
    signal.created = stack2 ?? get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
// @__NO_SIDE_EFFECTS__
function state(v2, stack2) {
  const s = source(v2, stack2);
  push_reaction_value(s);
  return s;
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    (component_context.l.s ??= []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !includes.call(current_sources, source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (true_default) {
    tag_proxy(
      new_value,
      /** @type {string} */
      source2.label
    );
  }
  return internal_set(source2, new_value);
}
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    var old_value = source2.v;
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else {
      old_values.set(source2, old_value);
    }
    source2.v = value;
    var batch = Batch.ensure();
    batch.capture(source2, old_value);
    if (true_default) {
      if (tracing_mode_flag || active_effect !== null) {
        source2.updated ??= /* @__PURE__ */ new Map();
        const count = (source2.updated.get("")?.count ?? 0) + 1;
        source2.updated.set("", { error: (
          /** @type {any} */
          null
        ), count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      const derived2 = (
        /** @type {Derived} */
        source2
      );
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(derived2);
      }
      update_derived_status(derived2);
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  for (const effect2 of eager_effects) {
    if ((effect2.f & CLEAN) !== 0) {
      set_signal_status(effect2, MAYBE_DIRTY);
    }
    if (is_dirty(effect2)) {
      update_effect(effect2);
    }
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect) continue;
    if (true_default && (flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(reaction);
      continue;
    }
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & DERIVED) !== 0) {
      var derived2 = (
        /** @type {Derived} */
        reaction
      );
      batch_values?.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY);
      }
    } else if (not_dirty) {
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(
          /** @type {Effect} */
          reaction
        );
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 = true_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(
      /** @type {any[]} */
      value.length,
      stack2
    ));
    if (true_default) {
      value = /** @type {any} */
      inspectable_array(
        /** @type {any[]} */
        value
      );
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating) return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop2, source2] of sources) {
      tag(source2, get_label(path, prop2));
    }
    updating = false;
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_2, prop2, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s = sources.get(prop2);
        if (s === void 0) {
          with_parent(() => {
            var s2 = state(descriptor.value, stack2);
            sources.set(prop2, s2);
            if (true_default && typeof prop2 === "string") {
              tag(s2, get_label(path, prop2));
            }
            return s2;
          });
        } else {
          set(s, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target, prop2) {
        var s = sources.get(prop2);
        if (s === void 0) {
          if (prop2 in target) {
            const s2 = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(prop2, s2);
            increment(version);
            if (true_default) {
              tag(s2, get_label(path, prop2));
            }
          }
        } else {
          set(s, UNINITIALIZED);
          increment(version);
        }
        return true;
      },
      get(target, prop2, receiver) {
        if (prop2 === STATE_SYMBOL) {
          return value;
        }
        if (true_default && prop2 === PROXY_PATH_SYMBOL) {
          return update_path;
        }
        var s = sources.get(prop2);
        var exists = prop2 in target;
        if (s === void 0 && (!exists || get_descriptor(target, prop2)?.writable)) {
          s = with_parent(() => {
            var p = proxy(exists ? target[prop2] : UNINITIALIZED);
            var s2 = state(p, stack2);
            if (true_default) {
              tag(s2, get_label(path, prop2));
            }
            return s2;
          });
          sources.set(prop2, s);
        }
        if (s !== void 0) {
          var v2 = get(s);
          return v2 === UNINITIALIZED ? void 0 : v2;
        }
        return Reflect.get(target, prop2, receiver);
      },
      getOwnPropertyDescriptor(target, prop2) {
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor && "value" in descriptor) {
          var s = sources.get(prop2);
          if (s) descriptor.value = get(s);
        } else if (descriptor === void 0) {
          var source2 = sources.get(prop2);
          var value2 = source2?.v;
          if (source2 !== void 0 && value2 !== UNINITIALIZED) {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target, prop2) {
        if (prop2 === STATE_SYMBOL) {
          return true;
        }
        var s = sources.get(prop2);
        var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
        if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop2)?.writable)) {
          if (s === void 0) {
            s = with_parent(() => {
              var p = has ? proxy(target[prop2]) : UNINITIALIZED;
              var s2 = state(p, stack2);
              if (true_default) {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
            sources.set(prop2, s);
          }
          var value2 = get(s);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target, prop2, value2, receiver) {
        var s = sources.get(prop2);
        var has = prop2 in target;
        if (is_proxied_array && prop2 === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target) {
              other_s = with_parent(() => state(UNINITIALIZED, stack2));
              sources.set(i + "", other_s);
              if (true_default) {
                tag(other_s, get_label(path, i));
              }
            }
          }
        }
        if (s === void 0) {
          if (!has || get_descriptor(target, prop2)?.writable) {
            s = with_parent(() => state(void 0, stack2));
            if (true_default) {
              tag(s, get_label(path, prop2));
            }
            set(s, proxy(value2));
            sources.set(prop2, s);
          }
        } else {
          has = s.v !== UNINITIALIZED;
          var p = with_parent(() => proxy(value2));
          set(s, p);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
        if (descriptor?.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop2 === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n = Number(prop2);
            if (Number.isInteger(n) && n >= ls.v) {
              set(ls, n + 1);
            }
          }
          increment(version);
        }
        return true;
      },
      ownKeys(target) {
        get(version);
        var own_keys = Reflect.ownKeys(target).filter((key4) => {
          var source3 = sources.get(key4);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key3, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key3 in target)) {
            own_keys.push(key3);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
function get_label(path, prop2) {
  if (typeof prop2 === "symbol") return `${path}[Symbol(${prop2.description ?? ""})]`;
  if (regex_is_valid_identifier.test(prop2)) return `${path}.${prop2}`;
  return /^\d+$/.test(prop2) ? `${path}[${prop2}]` : `${path}['${prop2}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {
  }
  return value;
}
function is(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
}
var ARRAY_MUTATING_METHODS = /* @__PURE__ */ new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function inspectable_array(array2) {
  return new Proxy(array2, {
    get(target, prop2, receiver) {
      var value = Reflect.get(target, prop2, receiver);
      if (!ARRAY_MUTATING_METHODS.has(
        /** @type {string} */
        prop2
      )) {
        return value;
      }
      return function(...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    }
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
  array_prototype2.indexOf = function(item, from_index) {
    const index2 = indexOf.call(this, item, from_index);
    if (index2 === -1) {
      for (let i = from_index ?? 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index2;
  };
  array_prototype2.lastIndexOf = function(item, from_index) {
    const index2 = lastIndexOf.call(this, item, from_index ?? this.length - 1);
    if (index2 === -1) {
      for (let i = 0; i <= (from_index ?? this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index2;
  };
  array_prototype2.includes = function(item, from_index) {
    const has = includes2.call(this, item, from_index);
    if (!has) {
      for (let i = 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes2;
  };
}
function strict_equals(a, b, equal = true) {
  try {
    if (a === b !== (get_proxied_value(a) === get_proxied_value(b))) {
      state_proxy_equality_mismatch(equal ? "===" : "!==");
    }
  } catch {
  }
  return a === b === equal;
}
function equals2(a, b, equal = true) {
  if (a == b !== (get_proxied_value(a) == get_proxied_value(b))) {
    state_proxy_equality_mismatch(equal ? "==" : "!=");
  }
  return a == b === equal;
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype.__click = void 0;
    element_prototype.__className = void 0;
    element_prototype.__attributes = null;
    element_prototype.__style = void 0;
    element_prototype.__e = void 0;
  }
  if (is_extensible(text_prototype)) {
    text_prototype.__t = void 0;
  }
  if (true_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return (
    /** @type {TemplateNode | null} */
    first_child_getter.call(node)
  );
}
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return (
    /** @type {TemplateNode | null} */
    next_sibling_getter.call(node)
  );
}
function child(node, is_text) {
  if (!hydrating) {
    return /* @__PURE__ */ get_first_child(node);
  }
  var child2 = /* @__PURE__ */ get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text2 = create_text();
    child2?.before(text2);
    set_hydrate_node(text2);
    return text2;
  }
  if (is_text) {
    merge_text_nodes(
      /** @type {Text} */
      child2
    );
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  if (!hydrating) {
    var first = /* @__PURE__ */ get_first_child(node);
    if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
    return first;
  }
  if (is_text) {
    if (hydrate_node?.nodeType !== TEXT_NODE) {
      var text2 = create_text();
      hydrate_node?.before(text2);
      set_hydrate_node(text2);
      return text2;
    }
    merge_text_nodes(
      /** @type {Text} */
      hydrate_node
    );
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = /** @type {TemplateNode} */
    /* @__PURE__ */ get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text) {
    if (next_sibling?.nodeType !== TEXT_NODE) {
      var text2 = create_text();
      if (next_sibling === null) {
        last_sibling?.after(text2);
      } else {
        next_sibling.before(text2);
      }
      set_hydrate_node(text2);
      return text2;
    }
    merge_text_nodes(
      /** @type {Text} */
      next_sibling
    );
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag) return false;
  if (eager_block_effects !== null) return false;
  var flags2 = (
    /** @type {Effect} */
    active_effect.f
  );
  return (flags2 & REACTION_RAN) !== 0;
}
function create_element(tag2, namespace, is2) {
  let options = is2 ? { is: is2 } : void 0;
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(namespace ?? NAMESPACE_HTML, tag2, options)
  );
}
function merge_text_nodes(text2) {
  if (
    /** @type {string} */
    text2.nodeValue.length < 65536
  ) {
    return;
  }
  let next2 = text2.nextSibling;
  while (next2 !== null && next2.nodeType === TEXT_NODE) {
    next2.remove();
    text2.nodeValue += /** @type {string} */
    next2.nodeValue;
    next2 = text2.nextSibling;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/misc.js
function autofocus(dom, value) {
  if (value) {
    const body = document.body;
    dom.autofocus = true;
    queue_micro_task(() => {
      if (document.activeElement === body) {
        dom.focus();
      }
    });
  }
}
var listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener(
      "reset",
      (evt) => {
        Promise.resolve().then(() => {
          if (!evt.defaultPrevented) {
            for (
              const e of
              /**@type {HTMLFormElement} */
              evt.target.elements
            ) {
              e.__on_r?.();
            }
          }
        });
      },
      // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
      { capture: true }
    );
  }
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function validate_effect(rune) {
  if (active_effect === null) {
    if (active_reaction === null) {
      effect_orphan(rune);
    }
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown(rune);
  }
}
function push_effect(effect2, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect2;
  } else {
    parent_last.next = effect2;
    effect2.prev = parent_last;
    parent_effect.last = effect2;
  }
}
function create_effect(type, fn) {
  var parent = active_effect;
  if (true_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect2 = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (true_default) {
    effect2.component_function = dev_current_component_function;
  }
  var e = effect2;
  if ((type & EFFECT) !== 0) {
    if (collected_effects !== null) {
      collected_effects.push(effect2);
    } else {
      schedule_effect(effect2);
    }
  } else if (fn !== null) {
    try {
      update_effect(effect2);
    } catch (e2) {
      destroy_effect(effect2);
      throw e2;
    }
    if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
    (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.effects ??= []).push(e);
    }
  }
  return effect2;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect2 = create_effect(RENDER_EFFECT, null);
  set_signal_status(effect2, CLEAN);
  effect2.teardown = fn;
  return effect2;
}
function user_effect(fn) {
  validate_effect("$effect");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect"
    });
  }
  var flags2 = (
    /** @type {Effect} */
    active_effect.f
  );
  var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & REACTION_RAN) === 0;
  if (defer) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    (context.e ??= []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn);
}
function user_pre_effect(fn) {
  validate_effect("$effect.pre");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect.pre"
    });
  }
  return create_effect(RENDER_EFFECT | USER_EFFECT, fn);
}
function effect_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return () => {
    destroy_effect(effect2);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect2, () => {
          destroy_effect(effect2);
          fulfil(void 0);
        });
      } else {
        destroy_effect(effect2);
        fulfil(void 0);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn);
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn);
}
function template_effect(fn, sync = [], async2 = [], blockers = []) {
  flatten(blockers, sync, async2, (values) => {
    create_effect(RENDER_EFFECT, () => fn(...values.map(get)));
  });
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function managed(fn, flags2 = 0) {
  var effect2 = create_effect(MANAGED_EFFECT | flags2, fn);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
    remove_effect_dom(
      effect2.nodes.start,
      /** @type {TemplateNode} */
      effect2.nodes.end
    );
    removed = true;
  }
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  set_signal_status(effect2, DESTROYED);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition3 of transitions) {
      transition3.stop();
    }
  }
  execute_effect_teardown(effect2);
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (true_default) {
    effect2.component_function = null;
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null) prev.next = next2;
  if (next2 !== null) next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2) parent.first = next2;
    if (parent.last === effect2) parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy) destroy_effect(effect2);
    if (callback) callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition3 of transitions) {
      transition3.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0) return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition3 of t) {
      if (transition3.is_global || local) {
        transitions.push(transition3);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
    // it means the parent block effect was pruned. In that case,
    // transparency information was transferred to the branch effect.
    (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
    pause_children(child2, transitions, transparent ? local : false);
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0) return;
  effect2.f ^= INERT;
  if (async_mode_flag && (effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) === 0) {
    effect2.f ^= CLEAN;
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition3 of t) {
      if (transition3.is_global || local) {
        transition3.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes) return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = (
      /** @type {Value[]} */
      reaction.deps
    );
    var length = dependencies.length;
    for (var i = 0; i < length; i++) {
      var dependency = dependencies[i];
      if (is_dirty(
        /** @type {Derived} */
        dependency
      )) {
        update_derived(
          /** @type {Derived} */
          dependency
        );
      }
      if (dependency.wv > reaction.wv) {
        return true;
      }
    }
    if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root33 = true) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (!async_mode_flag && current_sources !== null && includes.call(current_sources, signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect2,
        false
      );
    } else if (effect2 === reaction) {
      if (root33) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(
        /** @type {Effect} */
        reaction
      );
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = (
      /** @type {Function} */
      reaction.fn
    );
    var result = fn();
    reaction.f |= REACTION_RAN;
    var deps = reaction.deps;
    var is_fork = current_batch?.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index2 = index_of.call(reactions, signal);
    if (index2 !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index2] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !includes.call(new_deps, dependency))) {
    var derived2 = (
      /** @type {Derived} */
      dependency
    );
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
      derived2.f &= ~WAS_MARKED;
    }
    update_derived_status(derived2);
    freeze_derived_effects(derived2);
    remove_reactions(derived2, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  if (true_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = (
      /** @type {any} */
      dev_stack
    );
    set_dev_stack(effect2.dev_stack ?? dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (true_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (true_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
function get(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  captured_signals?.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && (current_sources === null || !includes.call(current_sources, signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        (active_reaction.deps ??= []).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!includes.call(reactions, active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (true_default) {
    recent_async_deriveds.delete(signal);
    if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
      if (signal.trace) {
        signal.trace();
      } else {
        var trace2 = get_error("traced at");
        if (trace2) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === void 0) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace2.stack !== last?.stack) {
            entry.traces.push(trace2);
          }
        }
      }
    }
  }
  if (is_destroying_effect && old_values.has(signal)) {
    return old_values.get(signal);
  }
  if (is_derived) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    if (is_destroying_effect) {
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
    var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (is_dirty(derived2)) {
      if (should_connect) {
        derived2.f |= CONNECTED;
      }
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  }
  if (batch_values?.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  derived2.f |= CONNECTED;
  if (derived2.deps === null) return;
  for (const dep of derived2.deps) {
    (dep.reactions ??= []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(
        /** @type {Derived} */
        dep
      );
      reconnect(
        /** @type {Derived} */
        dep
      );
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED) return true;
  if (derived2.deps === null) return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
      /** @type {Derived} */
      dep
    )) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
function deep_read_state(value) {
  if (typeof value !== "object" || !value || value instanceof EventTarget) {
    return;
  }
  if (STATE_SYMBOL in value) {
    deep_read(value);
  } else if (!Array.isArray(value)) {
    for (let key3 in value) {
      const prop2 = value[key3];
      if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
        deep_read(prop2);
      }
    }
  }
}
function deep_read(value, visited = /* @__PURE__ */ new Set()) {
  if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
  !(value instanceof EventTarget) && !visited.has(value)) {
    visited.add(value);
    if (value instanceof Date) {
      value.getTime();
    }
    for (let key3 in value) {
      try {
        deep_read(value[key3], visited);
      } catch (e) {
      }
    }
    const proto = get_prototype_of(value);
    if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
      const descriptors = get_descriptors(proto);
      for (let key3 in descriptors) {
        const get5 = descriptors[key3].get;
        if (get5) {
          try {
            get5.call(value);
          } catch (e) {
          }
        }
      }
    }
  }
}

// node_modules/svelte/src/utils.js
function is_capture_event(name) {
  return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
}
var DELEGATED_EVENTS = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function can_delegate_event(event_name) {
  return DELEGATED_EVENTS.includes(event_name);
}
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
var ATTRIBUTE_ALIASES = {
  // no `class: 'className'` because we handle that separately
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function normalize_attribute(name) {
  name = name.toLowerCase();
  return ATTRIBUTE_ALIASES[name] ?? name;
}
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = (
  /** @type {const} */
  [
    "$state",
    "$state.raw",
    "$derived",
    "$derived.by"
  ]
);
var RUNES = (
  /** @type {const} */
  [
    ...STATE_CREATION_RUNES,
    "$state.eager",
    "$state.snapshot",
    "$props",
    "$props.id",
    "$bindable",
    "$effect",
    "$effect.pre",
    "$effect.tracking",
    "$effect.root",
    "$effect.pending",
    "$inspect",
    "$inspect().with",
    "$inspect.trace",
    "$host"
  ]
);
function sanitize_location(location) {
  return (
    /** @type {T} */
    location?.replace(/\//g, "/\u200B")
  );
}

// node_modules/svelte/src/internal/client/dev/css.js
var all_styles = /* @__PURE__ */ new Map();
function register_style(hash2, style) {
  var styles = all_styles.get(hash2);
  if (!styles) {
    styles = /* @__PURE__ */ new Set();
    all_styles.set(hash2, styles);
  }
  styles.add(style);
}

// node_modules/svelte/src/internal/client/dev/elements.js
function add_locations(fn, filename, locations) {
  return (...args) => {
    const dom = fn(...args);
    var node = hydrating ? dom : dom.nodeType === DOCUMENT_FRAGMENT_NODE ? dom.firstChild : dom;
    assign_locations(node, filename, locations);
    return dom;
  };
}
function assign_location(element2, filename, location) {
  element2.__svelte_meta = {
    parent: dev_stack,
    loc: { file: filename, line: location[0], column: location[1] }
  };
  if (location[2]) {
    assign_locations(element2.firstChild, filename, location[2]);
  }
}
function assign_locations(node, filename, locations) {
  var i = 0;
  var depth = 0;
  while (node && i < locations.length) {
    if (hydrating && node.nodeType === COMMENT_NODE) {
      var comment2 = (
        /** @type {Comment} */
        node
      );
      if (comment2.data[0] === HYDRATION_START) depth += 1;
      else if (comment2.data[0] === HYDRATION_END) depth -= 1;
    }
    if (depth === 0 && node.nodeType === ELEMENT_NODE) {
      assign_location(
        /** @type {Element} */
        node,
        filename,
        locations[i++]
      );
    }
    node = node.nextSibling;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/events.js
var event_symbol = Symbol("events");
var all_registered_events = /* @__PURE__ */ new Set();
var root_event_handles = /* @__PURE__ */ new Set();
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event2) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event2);
    }
    if (!event2.cancelBubble) {
      return without_reactive_context(() => {
        return handler?.call(this, event2);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function on(element2, type, handler, options = {}) {
  var target_handler = create_event(type, element2, handler, options);
  return () => {
    element2.removeEventListener(type, target_handler, options);
  };
}
function event(event_name, dom, handler, capture2, passive2) {
  var options = { capture: capture2, passive: passive2 };
  var target_handler = create_event(event_name, dom, handler, options);
  if (dom === document.body || // @ts-ignore
  dom === window || // @ts-ignore
  dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  dom instanceof HTMLMediaElement) {
    teardown(() => {
      dom.removeEventListener(event_name, target_handler, options);
    });
  }
}
function delegated(event_name, element2, handler) {
  (element2[event_symbol] ??= {})[event_name] = handler;
}
function delegate(events) {
  for (var i = 0; i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
function handle_event_propagation(event2) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event2.type;
  var path = event2.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event2.target
  );
  last_propagated_event = event2;
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event2[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event2.target;
  if (current_target === handler_element) return;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated2 = current_target[event_symbol]?.[event_name];
        if (delegated2 != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event2.target === current_target)) {
          delegated2.call(current_target, event2);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event2[event_symbol] = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function apply(thunk, element2, args, component2, loc, has_side_effects = false, remove_parens = false) {
  let handler;
  let error;
  try {
    handler = thunk();
  } catch (e) {
    error = e;
  }
  if (typeof handler !== "function" && (has_side_effects || handler != null || error)) {
    const filename = component2?.[FILENAME];
    const location = loc ? ` at ${filename}:${loc[0]}:${loc[1]}` : ` in ${filename}`;
    const phase = args[0]?.eventPhase < Event.BUBBLING_PHASE ? "capture" : "";
    const event_name = args[0]?.type + phase;
    const description = `\`${event_name}\` handler${location}`;
    const suggestion = remove_parens ? "remove the trailing `()`" : "add a leading `() =>`";
    event_handler_invalid(description, suggestion);
    if (error) {
      throw error;
    }
  }
  handler?.apply(element2, args);
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
var policy = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (html2) => {
      return html2;
    }
  })
);
function create_trusted_html(html2) {
  return (
    /** @type {string} */
    policy?.createHTML(html2) ?? html2
  );
}
function create_fragment_from_html(html2) {
  var elem = create_element("template");
  elem.innerHTML = create_trusted_html(html2.replaceAll("<!>", "<!---->"));
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start2, end) {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  if (effect2.nodes === null) {
    effect2.nodes = { start: start2, end, a: null, t: null };
  }
}
// @__NO_SIDE_EFFECTS__
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === void 0) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment) node = /** @type {TemplateNode} */
      get_first_child(node);
    }
    var clone2 = (
      /** @type {TemplateNode} */
      use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
    );
    if (is_fragment) {
      var start2 = (
        /** @type {TemplateNode} */
        get_first_child(clone2)
      );
      var end = (
        /** @type {TemplateNode} */
        clone2.lastChild
      );
      assign_nodes(start2, end);
    } else {
      assign_nodes(clone2, clone2);
    }
    return clone2;
  };
}
// @__NO_SIDE_EFFECTS__
function from_namespace(content, flags2, ns = "svg") {
  var has_start = !content.startsWith("<!>");
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
  var node;
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (!node) {
      var fragment = (
        /** @type {DocumentFragment} */
        create_fragment_from_html(wrapped)
      );
      var root33 = (
        /** @type {Element} */
        get_first_child(fragment)
      );
      if (is_fragment) {
        node = document.createDocumentFragment();
        while (get_first_child(root33)) {
          node.appendChild(
            /** @type {TemplateNode} */
            get_first_child(root33)
          );
        }
      } else {
        node = /** @type {Element} */
        get_first_child(root33);
      }
    }
    var clone2 = (
      /** @type {TemplateNode} */
      node.cloneNode(true)
    );
    if (is_fragment) {
      var start2 = (
        /** @type {TemplateNode} */
        get_first_child(clone2)
      );
      var end = (
        /** @type {TemplateNode} */
        clone2.lastChild
      );
      assign_nodes(start2, end);
    } else {
      assign_nodes(clone2, clone2);
    }
    return clone2;
  };
}
// @__NO_SIDE_EFFECTS__
function from_svg(content, flags2) {
  return /* @__PURE__ */ from_namespace(content, flags2, "svg");
}
function text(value = "") {
  if (!hydrating) {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
  var node = hydrate_node;
  if (node.nodeType !== TEXT_NODE) {
    node.before(node = create_text());
    set_hydrate_node(node);
  } else {
    merge_text_nodes(
      /** @type {Text} */
      node
    );
  }
  assign_nodes(node, node);
  return node;
}
function comment() {
  if (hydrating) {
    assign_nodes(hydrate_node, null);
    return hydrate_node;
  }
  var frag = document.createDocumentFragment();
  var start2 = document.createComment("");
  var anchor = create_text();
  frag.append(start2, anchor);
  assign_nodes(start2, anchor);
  return frag;
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = (
      /** @type {Effect & { nodes: EffectNodes }} */
      active_effect
    );
    if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(
    /** @type {Node} */
    dom
  );
}

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function set_text(text2, value) {
  var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
  if (str !== (text2.__t ??= text2.nodeValue)) {
    text2.__t = str;
    text2.nodeValue = `${str}`;
  }
}
function mount(component2, options) {
  return _mount(component2, options);
}
function hydrate(component2, options) {
  init_operations();
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (anchor && (anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
    anchor.data !== HYDRATION_START)) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    const instance = _mount(component2, { ...options, anchor });
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error) {
    if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component2, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
  init_operations();
  var component2 = void 0;
  var unmount2 = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    boundary(
      /** @type {TemplateNode} */
      anchor_node,
      {
        pending: () => {
        }
      },
      (anchor_node2) => {
        push({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        if (context) ctx.c = context;
        if (events) {
          props.$$events = events;
        }
        if (hydrating) {
          assign_nodes(
            /** @type {TemplateNode} */
            anchor_node2,
            null
          );
        }
        should_intro = intro;
        component2 = Component(anchor_node2, props) || {};
        should_intro = true;
        if (hydrating) {
          active_effect.nodes.end = hydrate_node;
          if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || /** @type {Comment} */
          hydrate_node.data !== HYDRATION_END) {
            hydration_mismatch();
            throw HYDRATION_ERROR;
          }
        }
        pop();
      },
      transformError
    );
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive2 = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === void 0) {
            counts = /* @__PURE__ */ new Map();
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === void 0) {
            node.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    return () => {
      for (var event_name of registered_events) {
        for (const node of [target, document]) {
          var counts = (
            /** @type {Map<string, number>} */
            listeners.get(node)
          );
          var count = (
            /** @type {number} */
            counts.get(event_name)
          );
          if (--count == 0) {
            node.removeEventListener(event_name, handle_event_propagation);
            counts.delete(event_name);
            if (counts.size === 0) {
              listeners.delete(node);
            }
          } else {
            counts.set(event_name, count);
          }
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component2, unmount2);
  return component2;
}
var mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component2, options) {
  const fn = mounted_components.get(component2);
  if (fn) {
    mounted_components.delete(component2);
    return fn(options);
  }
  if (true_default) {
    if (STATE_SYMBOL in component2) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}

// node_modules/svelte/src/internal/client/dev/ownership.js
function create_ownership_validator(props) {
  const component2 = component_context?.function;
  const parent = component_context?.p?.function;
  return {
    /**
     * @param {string} prop
     * @param {any[]} path
     * @param {any} result
     * @param {number} line
     * @param {number} column
     */
    mutation: (prop2, path, result, line, column) => {
      const name = path[0];
      if (is_bound_or_unset(props, name) || !parent) {
        return result;
      }
      let value = props;
      for (let i = 0; i < path.length - 1; i++) {
        value = value[path[i]];
        if (!value?.[STATE_SYMBOL]) {
          return result;
        }
      }
      const location = sanitize_location(`${component2[FILENAME]}:${line}:${column}`);
      ownership_invalid_mutation(name, location, prop2, parent[FILENAME]);
      return result;
    },
    /**
     * @param {any} key
     * @param {any} child_component
     * @param {() => any} value
     */
    binding: (key3, child_component, value) => {
      if (!is_bound_or_unset(props, key3) && parent && value()?.[STATE_SYMBOL]) {
        ownership_invalid_binding(
          component2[FILENAME],
          key3,
          child_component[FILENAME],
          parent[FILENAME]
        );
      }
    }
  };
}
function is_bound_or_unset(props, prop_name) {
  const is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
  return !!get_descriptor(props, prop_name)?.set || is_entry_props && prop_name in props || !(prop_name in props);
}

// node_modules/svelte/src/internal/client/dev/legacy.js
function check_target(target) {
  if (target) {
    component_api_invalid_new(target[FILENAME] ?? "a component", target.name);
  }
}
function legacy_api() {
  const component2 = component_context?.function;
  function error(method) {
    component_api_changed(method, component2[FILENAME]);
  }
  return {
    $destroy: () => error("$destroy()"),
    $on: () => error("$on(...)"),
    $set: () => error("$set(...)")
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/branches.js
var BranchManager = class {
  /** @type {TemplateNode} */
  anchor;
  /** @type {Map<Batch, Key>} */
  #batches = /* @__PURE__ */ new Map();
  /**
   * Map of keys to effects that are currently rendered in the DOM.
   * These effects are visible and actively part of the document tree.
   * Example:
   * ```
   * {#if condition}
   * 	foo
   * {:else}
   * 	bar
   * {/if}
   * ```
   * Can result in the entries `true->Effect` and `false->Effect`
   * @type {Map<Key, Effect>}
   */
  #onscreen = /* @__PURE__ */ new Map();
  /**
   * Similar to #onscreen with respect to the keys, but contains branches that are not yet
   * in the DOM, because their insertion is deferred.
   * @type {Map<Key, Branch>}
   */
  #offscreen = /* @__PURE__ */ new Map();
  /**
   * Keys of effects that are currently outroing
   * @type {Set<Key>}
   */
  #outroing = /* @__PURE__ */ new Set();
  /**
   * Whether to pause (i.e. outro) on change, or destroy immediately.
   * This is necessary for `<svelte:element>`
   */
  #transition = true;
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(anchor, transition3 = true) {
    this.anchor = anchor;
    this.#transition = transition3;
  }
  /**
   * @param {Batch} batch
   */
  #commit = (batch) => {
    if (!this.#batches.has(batch)) return;
    var key3 = (
      /** @type {Key} */
      this.#batches.get(batch)
    );
    var onscreen = this.#onscreen.get(key3);
    if (onscreen) {
      resume_effect(onscreen);
      this.#outroing.delete(key3);
    } else {
      var offscreen = this.#offscreen.get(key3);
      if (offscreen && (offscreen.effect.f & INERT) === 0) {
        this.#onscreen.set(key3, offscreen.effect);
        this.#offscreen.delete(key3);
        offscreen.fragment.lastChild.remove();
        this.anchor.before(offscreen.fragment);
        onscreen = offscreen.effect;
      }
    }
    for (const [b, k] of this.#batches) {
      this.#batches.delete(b);
      if (b === batch) {
        break;
      }
      const offscreen2 = this.#offscreen.get(k);
      if (offscreen2) {
        destroy_effect(offscreen2.effect);
        this.#offscreen.delete(k);
      }
    }
    for (const [k, effect2] of this.#onscreen) {
      if (k === key3 || this.#outroing.has(k)) continue;
      if ((effect2.f & INERT) !== 0) continue;
      const on_destroy = () => {
        const keys = Array.from(this.#batches.values());
        if (keys.includes(k)) {
          var fragment = document.createDocumentFragment();
          move_effect(effect2, fragment);
          fragment.append(create_text());
          this.#offscreen.set(k, { effect: effect2, fragment });
        } else {
          destroy_effect(effect2);
        }
        this.#outroing.delete(k);
        this.#onscreen.delete(k);
      };
      if (this.#transition || !onscreen) {
        this.#outroing.add(k);
        pause_effect(effect2, on_destroy, false);
      } else {
        on_destroy();
      }
    }
  };
  /**
   * @param {Batch} batch
   */
  #discard = (batch) => {
    this.#batches.delete(batch);
    const keys = Array.from(this.#batches.values());
    for (const [k, branch2] of this.#offscreen) {
      if (!keys.includes(k)) {
        destroy_effect(branch2.effect);
        this.#offscreen.delete(k);
      }
    }
  };
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(key3, fn) {
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    if (fn && !this.#onscreen.has(key3) && !this.#offscreen.has(key3)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        this.#offscreen.set(key3, {
          effect: branch(() => fn(target)),
          fragment
        });
      } else {
        this.#onscreen.set(
          key3,
          branch(() => fn(this.anchor))
        );
      }
    }
    this.#batches.set(batch, key3);
    if (defer) {
      for (const [k, effect2] of this.#onscreen) {
        if (k === key3) {
          batch.unskip_effect(effect2);
        } else {
          batch.skip_effect(effect2);
        }
      }
      for (const [k, branch2] of this.#offscreen) {
        if (k === key3) {
          batch.unskip_effect(branch2.effect);
        } else {
          batch.skip_effect(branch2.effect);
        }
      }
      batch.oncommit(this.#commit);
      batch.ondiscard(this.#discard);
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      this.#commit(batch);
    }
  }
};

// node_modules/svelte/src/internal/client/dom/blocks/if.js
function if_block(node, fn, elseif = false) {
  var marker;
  if (hydrating) {
    marker = hydrate_node;
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
  function update_branch(key3, fn2) {
    if (hydrating) {
      var data = read_hydration_instruction(
        /** @type {TemplateNode} */
        marker
      );
      if (key3 !== parseInt(data.substring(1))) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(key3, fn2);
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(key3, fn2);
  }
  block(() => {
    var has_branch = false;
    fn((fn2, key3 = 0) => {
      has_branch = true;
      update_branch(key3, fn2);
    });
    if (!has_branch) {
      update_branch(-1, null);
    }
  }, flags2);
}

// node_modules/svelte/src/internal/client/dom/blocks/key.js
var NAN = Symbol("NaN");

// node_modules/svelte/src/internal/client/dom/blocks/css-props.js
function css_props(element2, get_styles) {
  if (hydrating) {
    set_hydrate_node(get_first_child(element2));
  }
  render_effect(() => {
    var styles = get_styles();
    for (var key3 in styles) {
      var value = styles[key3];
      if (value) {
        element2.style.setProperty(key3, value);
      } else {
        element2.style.removeProperty(key3);
      }
    }
  });
}

// node_modules/svelte/src/internal/client/dom/blocks/each.js
function index(_2, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0; i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(
      effect2,
      () => {
        if (group) {
          group.pending.delete(effect2);
          group.done.add(effect2);
          if (group.pending.size === 0) {
            var groups = (
              /** @type {Set<EachOutroGroup>} */
              state2.outrogroups
            );
            destroy_effects(state2, array_from(group.done));
            groups.delete(group);
            if (groups.size === 0) {
              state2.outrogroups = null;
            }
          }
        } else {
          remaining -= 1;
        }
      },
      false
    );
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null;
    if (fast_path) {
      var anchor = (
        /** @type {Element} */
        controlled_anchor
      );
      var parent_node = (
        /** @type {Element} */
        anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(state2, to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: /* @__PURE__ */ new Set()
    };
    (state2.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
  }
}
function destroy_effects(state2, to_destroy, remove_dom = true) {
  var preserved_effects;
  if (state2.pending.size > 0) {
    preserved_effects = /* @__PURE__ */ new Set();
    for (const keys of state2.pending.values()) {
      for (const key3 of keys) {
        preserved_effects.add(
          /** @type {EachItem} */
          state2.items.get(key3).e
        );
      }
    }
  }
  for (var i = 0; i < to_destroy.length; i++) {
    var e = to_destroy[i];
    if (preserved_effects?.has(e)) {
      e.f |= EFFECT_OFFSCREEN;
      const fragment = document.createDocumentFragment();
      move_effect(e, fragment);
    } else {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
}
var offscreen_anchor;
function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var items = /* @__PURE__ */ new Map();
  var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      node
    );
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback2 = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  var array2;
  var pending2 = /* @__PURE__ */ new Map();
  var first_run = true;
  function commit(batch) {
    if ((state2.effect.f & DESTROYED) !== 0) {
      return;
    }
    state2.pending.delete(batch);
    state2.fallback = fallback2;
    reconcile(state2, array2, anchor, flags2, get_key);
    if (fallback2 !== null) {
      if (array2.length === 0) {
        if ((fallback2.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback2);
        } else {
          fallback2.f ^= EFFECT_OFFSCREEN;
          move(fallback2, null, anchor);
        }
      } else {
        pause_effect(fallback2, () => {
          fallback2 = null;
        });
      }
    }
  }
  function discard(batch) {
    state2.pending.delete(batch);
  }
  var effect2 = block(() => {
    array2 = /** @type {V[]} */
    get(each_array);
    var length = array2.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = /* @__PURE__ */ new Set();
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    for (var index2 = 0; index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && /** @type {Comment} */
      hydrate_node.data === HYDRATION_END) {
        anchor = /** @type {Comment} */
        hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array2[index2];
      var key3 = get_key(value, index2);
      if (true_default) {
        var key_again = get_key(value, index2);
        if (key3 !== key_again) {
          each_key_volatile(String(index2), String(key3), String(key_again));
        }
      }
      var item = first_run ? null : items.get(key3);
      if (item) {
        if (item.v) internal_set(item.v, value);
        if (item.i) internal_set(item.i, index2);
        if (defer) {
          batch.unskip_effect(item.e);
        }
      } else {
        item = create_item(
          items,
          first_run ? anchor : offscreen_anchor ??= create_text(),
          value,
          key3,
          index2,
          render_fn,
          flags2,
          get_collection
        );
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key3, item);
      }
      keys.add(key3);
    }
    if (length === 0 && fallback_fn && !fallback2) {
      if (first_run) {
        fallback2 = branch(() => fallback_fn(anchor));
      } else {
        fallback2 = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
        fallback2.f |= EFFECT_OFFSCREEN;
      }
    }
    if (length > keys.size) {
      if (true_default) {
        validate_each_keys(array2, get_key);
      } else {
        each_key_duplicate("", "", "");
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      pending2.set(batch, keys);
      if (defer) {
        for (const [key4, item2] of items) {
          if (!keys.has(key4)) {
            batch.skip_effect(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(discard);
      } else {
        commit(batch);
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get(each_array);
  });
  var state2 = { effect: effect2, flags: flags2, items, pending: pending2, outrogroups: null, fallback: fallback2 };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function skip_to_branch(effect2) {
  while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
    effect2 = effect2.next;
  }
  return effect2;
}
function reconcile(state2, array2, anchor, flags2, get_key) {
  var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
  var length = array2.length;
  var items = state2.items;
  var current = skip_to_branch(state2.effect.first);
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key3;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0; i < length; i += 1) {
      value = array2[i];
      key3 = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key3).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        effect2.nodes?.a?.measure();
        (to_animate ??= /* @__PURE__ */ new Set()).add(effect2);
      }
    }
  }
  for (i = 0; i < length; i += 1) {
    value = array2[i];
    key3 = get_key(value, i);
    effect2 = /** @type {EachItem} */
    items.get(key3).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current) {
        move(effect2, null, anchor);
      } else {
        var next2 = prev ? prev.next : current;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev) effect2.prev.next = effect2.next;
        if (effect2.next) effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next2);
        move(effect2, next2, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current = skip_to_branch(prev.next);
        continue;
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        effect2.nodes?.a?.unfix();
        (to_animate ??= /* @__PURE__ */ new Set()).delete(effect2);
      }
    }
    if (effect2 !== current) {
      if (seen !== void 0 && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start2 = stashed[0];
          var j2;
          prev = start2.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j2 = 0; j2 < matched.length; j2 += 1) {
            move(matched[j2], start2, anchor);
          }
          for (j2 = 0; j2 < stashed.length; j2 += 1) {
            seen.delete(stashed[j2]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start2);
          current = start2;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current !== effect2) {
        (seen ??= /* @__PURE__ */ new Set()).add(current);
        stashed.push(current);
        current = skip_to_branch(current.next);
      }
      if (current === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current = skip_to_branch(effect2.next);
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(state2, array_from(group.done));
        state2.outrogroups?.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current !== null || seen !== void 0) {
    var to_destroy = [];
    if (seen !== void 0) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current !== null) {
      if ((current.f & INERT) === 0 && current !== state2.fallback) {
        to_destroy.push(current);
      }
      current = skip_to_branch(current.next);
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0; i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.measure();
        }
        for (i = 0; i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      if (to_animate === void 0) return;
      for (effect2 of to_animate) {
        effect2.nodes?.a?.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key3, index2, render_fn, flags2, get_collection) {
  var v2 = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  if (true_default && v2) {
    v2.trace = () => {
      get_collection()[i?.v ?? index2];
    };
  }
  return {
    v: v2,
    i,
    e: branch(() => {
      render_fn(anchor, v2 ?? value, i ?? index2, get_collection);
      return () => {
        items.delete(key3);
      };
    })
  };
}
function move(effect2, next2, anchor) {
  if (!effect2.nodes) return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? (
    /** @type {EffectNodes} */
    next2.nodes.start
  ) : anchor;
  while (node !== null) {
    var next_node = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next2) {
  if (prev === null) {
    state2.effect.first = next2;
  } else {
    prev.next = next2;
  }
  if (next2 === null) {
    state2.effect.last = prev;
  } else {
    next2.prev = prev;
  }
}
function validate_each_keys(array2, key_fn) {
  const keys = /* @__PURE__ */ new Map();
  const length = array2.length;
  for (let i = 0; i < length; i++) {
    const key3 = key_fn(array2[i], i);
    if (keys.has(key3)) {
      const a = String(keys.get(key3));
      const b = String(i);
      let k = String(key3);
      if (k.startsWith("[object ")) k = null;
      each_key_duplicate(a, b, k);
    }
    keys.set(key3, i);
  }
}

// node_modules/svelte/src/internal/shared/validate.js
function prevent_snippet_stringification(fn) {
  fn.toString = () => {
    snippet_without_render_tag();
    return "";
  };
  return fn;
}

// node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function snippet(node, get_snippet, ...args) {
  var branches = new BranchManager(node);
  block(() => {
    const snippet2 = get_snippet() ?? null;
    if (true_default && snippet2 == null) {
      invalid_snippet();
    }
    branches.ensure(snippet2, snippet2 && ((anchor) => snippet2(anchor, ...args)));
  }, EFFECT_TRANSPARENT);
}
function wrap_snippet(component2, fn) {
  const snippet2 = (node, ...args) => {
    var previous_component_function = dev_current_component_function;
    set_dev_current_component_function(component2);
    try {
      return fn(node, ...args);
    } finally {
      set_dev_current_component_function(previous_component_function);
    }
  };
  prevent_snippet_stringification(snippet2);
  return snippet2;
}

// node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function component(node, get_component, render_fn) {
  var hydration_start_node;
  if (hydrating) {
    hydration_start_node = hydrate_node;
    hydrate_next();
  }
  var branches = new BranchManager(node);
  block(() => {
    var component2 = get_component() ?? null;
    if (hydrating) {
      var data = read_hydration_instruction(
        /** @type {TemplateNode} */
        hydration_start_node
      );
      var server_had_component = data === HYDRATION_START;
      var client_has_component = component2 !== null;
      if (server_had_component !== client_has_component) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(component2, component2 && ((target) => render_fn(target, component2)));
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(component2, component2 && ((target) => render_fn(target, component2)));
  }, EFFECT_TRANSPARENT);
}

// node_modules/svelte/src/internal/client/dom/css.js
function append_styles(anchor, css) {
  effect(() => {
    var root33 = anchor.getRootNode();
    var target = (
      /** @type {ShadowRoot} */
      root33.host ? (
        /** @type {ShadowRoot} */
        root33
      ) : (
        /** @type {Document} */
        root33.head ?? /** @type {Document} */
        root33.ownerDocument.head
      )
    );
    if (!target.querySelector("#" + css.hash)) {
      const style = create_element("style");
      style.id = css.hash;
      style.textContent = css.code;
      target.appendChild(style);
      if (true_default) {
        register_style(css.hash, style);
      }
    }
  });
}

// node_modules/svelte/src/internal/client/dom/elements/actions.js
function action(dom, action2, get_value) {
  effect(() => {
    var payload = untrack(() => action2(dom, get_value?.()) || {});
    if (get_value && payload?.update) {
      var inited = false;
      var prev = (
        /** @type {any} */
        {}
      );
      render_effect(() => {
        var value = get_value();
        deep_read_state(value);
        if (inited && safe_not_equal(prev, value)) {
          prev = value;
          payload.update(value);
        }
      });
      inited = true;
    }
    if (payload?.destroy) {
      return () => (
        /** @type {Function} */
        payload.destroy()
      );
    }
  });
}

// node_modules/svelte/src/internal/client/dom/elements/attachments.js
function attach(node, get_fn) {
  var fn = void 0;
  var e;
  managed(() => {
    if (fn !== (fn = get_fn())) {
      if (e) {
        destroy_effect(e);
        e = null;
      }
      if (fn) {
        e = branch(() => {
          effect(() => (
            /** @type {(node: Element) => void} */
            fn(node)
          ));
        });
      }
    }
  });
}

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/svelte/src/internal/shared/attributes.js
function clsx2(value) {
  if (typeof value === "object") {
    return clsx(value);
  } else {
    return value ?? "";
  }
}
var whitespace = [..." 	\n\r\f\xA0\v\uFEFF"];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key3 of Object.keys(directives)) {
      if (directives[key3]) {
        classname = classname ? classname + " " + key3 : key3;
      } else if (classname.length) {
        var len = key3.length;
        var a = 0;
        while ((a = classname.indexOf(key3, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles2(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key3 of Object.keys(styles)) {
    var value = styles[key3];
    if (value != null && value !== "") {
      css += " " + key3 + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles2(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles2(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/svelte/src/internal/client/dom/elements/class.js
function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
  var prev = dom.__className;
  if (hydrating || prev !== value || prev === void 0) {
    var next_class_name = to_class(value, hash2, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom.__className = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key3 in next_classes) {
      var is_present = !!next_classes[key3];
      if (prev_classes == null || is_present !== !!prev_classes[key3]) {
        dom.classList.toggle(key3, is_present);
      }
    }
  }
  return next_classes;
}

// node_modules/svelte/src/internal/client/dom/elements/style.js
function update_styles(dom, prev = {}, next2, priority) {
  for (var key3 in next2) {
    var value = next2[key3];
    if (prev[key3] !== value) {
      if (next2[key3] == null) {
        dom.style.removeProperty(key3);
      } else {
        dom.style.setProperty(key3, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom.__style;
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom.__style = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == void 0) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    // Listen to option element changes
    childList: true,
    subtree: true,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
var LINK_TAG = IS_XHTML ? "link" : "LINK";
var INPUT_TAG = IS_XHTML ? "input" : "INPUT";
var OPTION_TAG = IS_XHTML ? "option" : "OPTION";
var SELECT_TAG = IS_XHTML ? "select" : "SELECT";
function remove_input_defaults(input) {
  if (!hydrating) return;
  var already_removed = false;
  var remove_defaults = () => {
    if (already_removed) return;
    already_removed = true;
    if (input.hasAttribute("value")) {
      var value = input.value;
      set_attribute2(input, "value", null);
      input.value = value;
    }
    if (input.hasAttribute("checked")) {
      var checked = input.checked;
      set_attribute2(input, "checked", null);
      input.checked = checked;
    }
  };
  input.__on_r = remove_defaults;
  queue_micro_task(remove_defaults);
  add_form_reset_listener();
}
function set_selected(element2, selected) {
  if (selected) {
    if (!element2.hasAttribute("selected")) {
      element2.setAttribute("selected", "");
    }
  } else {
    element2.removeAttribute("selected");
  }
}
function set_attribute2(element2, attribute, value, skip_warning) {
  var attributes = get_attributes(element2);
  if (hydrating) {
    attributes[attribute] = element2.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
      if (!skip_warning) {
        check_src_in_dev_hydration(element2, attribute, value ?? "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value)) return;
  if (attribute === "loading") {
    element2[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element2.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element2).includes(attribute)) {
    element2[attribute] = value;
  } else {
    element2.setAttribute(attribute, value);
  }
}
function set_attributes(element2, prev, next2, css_hash, should_remove_defaults = false, skip_warning = false) {
  if (hydrating && should_remove_defaults && element2.nodeName === INPUT_TAG) {
    var input = (
      /** @type {HTMLInputElement} */
      element2
    );
    var attribute = input.type === "checkbox" ? "defaultChecked" : "defaultValue";
    if (!(attribute in next2)) {
      remove_input_defaults(input);
    }
  }
  var attributes = get_attributes(element2);
  var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
  var preserve_attribute_case = !attributes[IS_HTML];
  let is_hydrating_custom_element = hydrating && is_custom_element;
  if (is_hydrating_custom_element) {
    set_hydrating(false);
  }
  var current = prev || {};
  var is_option_element = element2.nodeName === OPTION_TAG;
  for (var key3 in prev) {
    if (!(key3 in next2)) {
      next2[key3] = null;
    }
  }
  if (next2.class) {
    next2.class = clsx2(next2.class);
  } else if (css_hash || next2[CLASS]) {
    next2.class = null;
  }
  if (next2[STYLE]) {
    next2.style ??= null;
  }
  var setters = get_setters(element2);
  for (const key4 in next2) {
    let value = next2[key4];
    if (is_option_element && key4 === "value" && value == null) {
      element2.value = element2.__value = "";
      current[key4] = value;
      continue;
    }
    if (key4 === "class") {
      var is_html = element2.namespaceURI === "http://www.w3.org/1999/xhtml";
      set_class(element2, is_html, value, css_hash, prev?.[CLASS], next2[CLASS]);
      current[key4] = value;
      current[CLASS] = next2[CLASS];
      continue;
    }
    if (key4 === "style") {
      set_style(element2, value, prev?.[STYLE], next2[STYLE]);
      current[key4] = value;
      current[STYLE] = next2[STYLE];
      continue;
    }
    var prev_value = current[key4];
    if (value === prev_value && !(value === void 0 && element2.hasAttribute(key4))) {
      continue;
    }
    current[key4] = value;
    var prefix = key4[0] + key4[1];
    if (prefix === "$$") continue;
    if (prefix === "on") {
      const opts = {};
      const event_handle_key = "$$" + key4;
      let event_name = key4.slice(2);
      var is_delegated = can_delegate_event(event_name);
      if (is_capture_event(event_name)) {
        event_name = event_name.slice(0, -7);
        opts.capture = true;
      }
      if (!is_delegated && prev_value) {
        if (value != null) continue;
        element2.removeEventListener(event_name, current[event_handle_key], opts);
        current[event_handle_key] = null;
      }
      if (is_delegated) {
        delegated(event_name, element2, value);
        delegate([event_name]);
      } else if (value != null) {
        let handle = function(evt) {
          current[key4].call(this, evt);
        };
        current[event_handle_key] = create_event(event_name, element2, handle, opts);
      }
    } else if (key4 === "style") {
      set_attribute2(element2, key4, value);
    } else if (key4 === "autofocus") {
      autofocus(
        /** @type {HTMLElement} */
        element2,
        Boolean(value)
      );
    } else if (!is_custom_element && (key4 === "__value" || key4 === "value" && value != null)) {
      element2.value = element2.__value = value;
    } else if (key4 === "selected" && is_option_element) {
      set_selected(
        /** @type {HTMLOptionElement} */
        element2,
        value
      );
    } else {
      var name = key4;
      if (!preserve_attribute_case) {
        name = normalize_attribute(name);
      }
      var is_default = name === "defaultValue" || name === "defaultChecked";
      if (value == null && !is_custom_element && !is_default) {
        attributes[key4] = null;
        if (name === "value" || name === "checked") {
          let input2 = (
            /** @type {HTMLInputElement} */
            element2
          );
          const use_default = prev === void 0;
          if (name === "value") {
            let previous = input2.defaultValue;
            input2.removeAttribute(name);
            input2.defaultValue = previous;
            input2.value = input2.__value = use_default ? previous : null;
          } else {
            let previous = input2.defaultChecked;
            input2.removeAttribute(name);
            input2.defaultChecked = previous;
            input2.checked = use_default ? previous : false;
          }
        } else {
          element2.removeAttribute(key4);
        }
      } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
        element2[name] = value;
        if (name in attributes) attributes[name] = UNINITIALIZED;
      } else if (typeof value !== "function") {
        set_attribute2(element2, name, value, skip_warning);
      }
    }
  }
  if (is_hydrating_custom_element) {
    set_hydrating(true);
  }
  return current;
}
function attribute_effect(element2, fn, sync = [], async2 = [], blockers = [], css_hash, should_remove_defaults = false, skip_warning = false) {
  flatten(blockers, sync, async2, (values) => {
    var prev = void 0;
    var effects = {};
    var is_select = element2.nodeName === SELECT_TAG;
    var inited = false;
    managed(() => {
      var next2 = fn(...values.map(get));
      var current = set_attributes(
        element2,
        prev,
        next2,
        css_hash,
        should_remove_defaults,
        skip_warning
      );
      if (inited && is_select && "value" in next2) {
        select_option(
          /** @type {HTMLSelectElement} */
          element2,
          next2.value
        );
      }
      for (let symbol of Object.getOwnPropertySymbols(effects)) {
        if (!next2[symbol]) destroy_effect(effects[symbol]);
      }
      for (let symbol of Object.getOwnPropertySymbols(next2)) {
        var n = next2[symbol];
        if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
          if (effects[symbol]) destroy_effect(effects[symbol]);
          effects[symbol] = branch(() => attach(element2, () => n));
        }
        current[symbol] = n;
      }
      prev = current;
    });
    if (is_select) {
      var select = (
        /** @type {HTMLSelectElement} */
        element2
      );
      effect(() => {
        select_option(
          select,
          /** @type {Record<string | symbol, any>} */
          prev.value,
          true
        );
        init_select(select);
      });
    }
    inited = true;
  });
}
function get_attributes(element2) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    element2.__attributes ??= {
      [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
      [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
    }
  );
}
var setters_cache = /* @__PURE__ */ new Map();
function get_setters(element2) {
  var cache_key = element2.getAttribute("is") || element2.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters) return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element2;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key3 in descriptors) {
      if (descriptors[key3].set) {
        setters.push(key3);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element2, attribute, value) {
  if (!true_default) return;
  if (attribute === "srcset" && srcset_url_equal(element2, value)) return;
  if (src_url_equal(element2.getAttribute(attribute) ?? "", value)) return;
  hydration_attribute_changed(
    attribute,
    element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."),
    String(value)
  );
}
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element2, srcset) {
  var element_urls = split_srcset(element2.srcset);
  var urls = split_srcset(srcset);
  return urls.length === element_urls.length && urls.every(
    ([url, width], i) => width === element_urls[i][1] && // We need to test both ways because Vite will create an a full URL with
    // `new URL(asset, import.meta.url).href` for the client when `base: './'`, and the
    // relative URLs inside srcset are not automatically resolved to absolute URLs by
    // browsers (in contrast to img.src). This means both SSR and DOM code could
    // contain relative or absolute URLs.
    (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0]))
  );
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/size.js
var ResizeObserverSingleton = class _ResizeObserverSingleton {
  /** */
  #listeners = /* @__PURE__ */ new WeakMap();
  /** @type {ResizeObserver | undefined} */
  #observer;
  /** @type {ResizeObserverOptions} */
  #options;
  /** @static */
  static entries = /* @__PURE__ */ new WeakMap();
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    this.#options = options;
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(element2, listener) {
    var listeners2 = this.#listeners.get(element2) || /* @__PURE__ */ new Set();
    listeners2.add(listener);
    this.#listeners.set(element2, listeners2);
    this.#getObserver().observe(element2, this.#options);
    return () => {
      var listeners3 = this.#listeners.get(element2);
      listeners3.delete(listener);
      if (listeners3.size === 0) {
        this.#listeners.delete(element2);
        this.#observer.unobserve(element2);
      }
    };
  }
  #getObserver() {
    return this.#observer ?? (this.#observer = new ResizeObserver(
      /** @param {any} entries */
      (entries) => {
        for (var entry of entries) {
          _ResizeObserverSingleton.entries.set(entry.target, entry);
          for (var listener of this.#listeners.get(entry.target) || []) {
            listener(entry);
          }
        }
      }
    ));
  }
};
var resize_observer_border_box = /* @__PURE__ */ new ResizeObserverSingleton({
  box: "border-box"
});
function bind_element_size(element2, type, set4) {
  var unsub = resize_observer_border_box.observe(element2, () => set4(element2[type]));
  effect(() => {
    untrack(() => set4(element2[type]));
    return unsub;
  });
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function is_bound_this(bound_value, element_or_component) {
  return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
}
function bind_this(element_or_component = {}, update2, get_value, get_parts) {
  effect(() => {
    var old_parts;
    var parts;
    render_effect(() => {
      old_parts = parts;
      parts = get_parts?.() || [];
      untrack(() => {
        if (element_or_component !== get_value(...parts)) {
          update2(element_or_component, ...parts);
          if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
            update2(null, ...old_parts);
          }
        }
      });
    });
    return () => {
      queue_micro_task(() => {
        if (parts && is_bound_this(get_value(...parts), element_or_component)) {
          update2(null, ...parts);
        }
      });
    };
  });
  return element_or_component;
}

// node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function init(immutable = false) {
  const context = (
    /** @type {ComponentContextLegacy} */
    component_context
  );
  const callbacks = context.l.u;
  if (!callbacks) return;
  let props = () => deep_read_state(context.s);
  if (immutable) {
    let version = 0;
    let prev = (
      /** @type {Record<string, any>} */
      {}
    );
    const d = derived(() => {
      let changed = false;
      const props2 = context.s;
      for (const key3 in props2) {
        if (props2[key3] !== prev[key3]) {
          prev[key3] = props2[key3];
          changed = true;
        }
      }
      if (changed) version++;
      return version;
    });
    props = () => get(d);
  }
  if (callbacks.b.length) {
    user_pre_effect(() => {
      observe_all(context, props);
      run_all(callbacks.b);
    });
  }
  user_effect(() => {
    const fns = untrack(() => callbacks.m.map(run));
    return () => {
      for (const fn of fns) {
        if (typeof fn === "function") {
          fn();
        }
      }
    };
  });
  if (callbacks.a.length) {
    user_effect(() => {
      observe_all(context, props);
      run_all(callbacks.a);
    });
  }
}
function observe_all(context, props) {
  if (context.l.s) {
    for (const signal of context.l.s) get(signal);
  }
  props();
}

// node_modules/svelte/src/internal/client/reactivity/store.js
var is_store_binding = false;
var IS_UNMOUNTED = Symbol();
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/internal/client/reactivity/props.js
var rest_props_handler = {
  get(target, key3) {
    if (target.exclude.includes(key3)) return;
    return target.props[key3];
  },
  set(target, key3) {
    if (true_default) {
      props_rest_readonly(`${target.name}.${String(key3)}`);
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key3) {
    if (target.exclude.includes(key3)) return;
    if (key3 in target.props) {
      return {
        enumerable: true,
        configurable: true,
        value: target.props[key3]
      };
    }
  },
  has(target, key3) {
    if (target.exclude.includes(key3)) return false;
    return key3 in target.props;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target.props).filter((key3) => !target.exclude.includes(key3));
  }
};
// @__NO_SIDE_EFFECTS__
function rest_props(props, exclude, name) {
  return new Proxy(
    true_default ? { props, exclude, name, other: {}, to_proxy: [] } : { props, exclude },
    rest_props_handler
  );
}
var spread_props_handler = {
  get(target, key3) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p)) p = p();
      if (typeof p === "object" && p !== null && key3 in p) return p[key3];
    }
  },
  set(target, key3, value) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p)) p = p();
      const desc = get_descriptor(p, key3);
      if (desc && desc.set) {
        desc.set(value);
        return true;
      }
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key3) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p)) p = p();
      if (typeof p === "object" && p !== null && key3 in p) {
        const descriptor = get_descriptor(p, key3);
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      }
    }
  },
  has(target, key3) {
    if (key3 === STATE_SYMBOL || key3 === LEGACY_PROPS) return false;
    for (let p of target.props) {
      if (is_function(p)) p = p();
      if (p != null && key3 in p) return true;
    }
    return false;
  },
  ownKeys(target) {
    const keys = [];
    for (let p of target.props) {
      if (is_function(p)) p = p();
      if (!p) continue;
      for (const key3 in p) {
        if (!keys.includes(key3)) keys.push(key3);
      }
      for (const key3 of Object.getOwnPropertySymbols(p)) {
        if (!keys.includes(key3)) keys.push(key3);
      }
    }
    return keys;
  }
};
function spread_props(...props) {
  return new Proxy({ props }, spread_props_handler);
}
function prop(props, key3, flags2, fallback2) {
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = (
    /** @type {V} */
    fallback2
  );
  var fallback_dirty = true;
  var get_fallback = () => {
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(
        /** @type {() => V} */
        fallback2
      ) : (
        /** @type {V} */
        fallback2
      );
    }
    return fallback_value;
  };
  var setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = get_descriptor(props, key3)?.set ?? (is_entry_props && key3 in props ? (v2) => props[key3] = v2 : void 0);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => (
      /** @type {V} */
      props[key3]
    ));
  } else {
    initial_value = /** @type {V} */
    props[key3];
  }
  if (initial_value === void 0 && fallback2 !== void 0) {
    initial_value = get_fallback();
    if (setter) {
      if (runes) props_invalid_value(key3);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key3]
      );
      if (value === void 0) return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = (
        /** @type {V} */
        props[key3]
      );
      if (value !== void 0) {
        fallback_value = /** @type {V} */
        void 0;
      }
      return value === void 0 ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return (
      /** @type {() => V} */
      (function(value, mutation) {
        if (arguments.length > 0) {
          if (!runes || !mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        }
        return getter();
      })
    );
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (true_default) {
    d.label = key3;
  }
  if (bindable) get(d);
  var parent_effect = (
    /** @type {Effect} */
    active_effect
  );
  return (
    /** @type {() => V} */
    (function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
        set(d, new_value);
        overridden = true;
        if (fallback_value !== void 0) {
          fallback_value = new_value;
        }
        return value;
      }
      if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
        return d.v;
      }
      return get(d);
    })
  );
}

// node_modules/svelte/src/internal/client/validate.js
function validate_binding(binding, blockers, get_object, get_property, line, column) {
  run_after_blockers(blockers, () => {
    var warned = false;
    var filename = dev_current_component_function?.[FILENAME];
    render_effect(() => {
      if (warned) return;
      var [object, is_store_sub] = capture_store_binding(get_object);
      if (is_store_sub) return;
      var property = get_property();
      var ran = false;
      var effect2 = render_effect(() => {
        if (ran) return;
        object[property];
      });
      ran = true;
      if (effect2.deps === null) {
        var location = `${filename}:${line}:${column}`;
        binding_property_non_reactive(binding, location);
        warned = true;
      }
    });
  });
}

// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
var Svelte4Component = class {
  /** @type {any} */
  #events;
  /** @type {Record<string, any>} */
  #instance;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options) {
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key3, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key3, s);
      return s;
    };
    const props = new Proxy(
      { ...options.props || {}, $$events: {} },
      {
        get(target, prop2) {
          return get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
        },
        has(target, prop2) {
          if (prop2 === LEGACY_PROPS) return true;
          get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
          return Reflect.has(target, prop2);
        },
        set(target, prop2, value) {
          set(sources.get(prop2) ?? add_source(prop2, value), value);
          return Reflect.set(target, prop2, value);
        }
      }
    );
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError
    });
    if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key3 of Object.keys(this.#instance)) {
      if (key3 === "$set" || key3 === "$destroy" || key3 === "$on") continue;
      define_property(this, key3, {
        get() {
          return this.#instance[key3];
        },
        /** @param {any} value */
        set(value) {
          this.#instance[key3] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = /** @param {Record<string, any>} next */
    (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    this.#instance.$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event2, callback) {
    this.#events[event2] = this.#events[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event2].push(cb);
    return () => {
      this.#events[event2] = this.#events[event2].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
};

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** @type {any} The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** @type {Record<string, any>} Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    $$l = {};
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    /** @type {any} The managed render effect for reflecting attributes */
    $$me;
    /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
    $$shadowRoot = null;
    /**
     * @param {*} $$componentCtor
     * @param {*} $$slots
     * @param {ShadowRootInit | undefined} shadow_root_init
     */
    constructor($$componentCtor, $$slots, shadow_root_init) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (shadow_root_init) {
        this.$$shadowRoot = this.attachShadow(shadow_root_init);
      }
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    /**
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return (anchor) => {
            const slot2 = create_element("slot");
            if (name !== "default") slot2.name = name;
            append(anchor, slot2);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key3 in this.$$p_d) {
          if (!(key3 in this.$$d) && this[key3] !== void 0) {
            this.$$d[key3] = this[key3];
            delete this[key3];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.$$shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this
          }
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            this.$$r = true;
            for (const key3 of object_keys(this.$$c)) {
              if (!this.$$p_d[key3]?.reflect) continue;
              this.$$d[key3] = this.$$c[key3];
              const attribute_value = get_custom_element_value(
                key3,
                this.$$d[key3],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key3].attribute || key3);
              } else {
                this.setAttribute(this.$$p_d[key3].attribute || key3, attribute_value);
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    /**
     * @param {string} attr
     * @param {string} _oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(attr2, _oldValue, newValue) {
      if (this.$$r) return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = void 0;
        }
      });
    }
    /**
     * @param {string} attribute_name
     */
    $$g_p(attribute_name) {
      return object_keys(this.$$p_d).find(
        (key3) => this.$$p_d[key3].attribute === attribute_name || !this.$$p_d[key3].attribute && key3.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform2) {
  const type = props_definition[prop2]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform2 || !props_definition[prop2]) {
    return value;
  } else if (transform2 === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      // conversion already handled above
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach((node) => {
    result[
      /** @type {Element} node */
      node.slot || "default"
    ] = true;
  });
  return result;
}

// node_modules/svelte/src/internal/client/dev/console-log.js
function log_if_contains_state(method, ...objects) {
  untrack(() => {
    try {
      let has_state = false;
      const transformed = [];
      for (const obj of objects) {
        if (obj && typeof obj === "object" && STATE_SYMBOL in obj) {
          transformed.push(snapshot(obj, true));
          has_state = true;
        } else {
          transformed.push(obj);
        }
      }
      if (has_state) {
        console_log_state(method);
        console.log("%c[snapshot]", "color: grey", ...transformed);
      }
    } catch {
    }
  });
  return objects;
}

// node_modules/svelte/src/index-client.js
if (true_default) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        // eslint-disable-next-line getter-return
        get: () => {
          if (value !== void 0) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v2) => {
          value = v2;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}
function onMount(fn) {
  if (component_context === null) {
    lifecycle_outside_component("onMount");
  }
  if (legacy_mode_flag && component_context.l !== null) {
    init_update_callbacks(component_context).m.push(fn);
  } else {
    user_effect(() => {
      const cleanup = untrack(fn);
      if (typeof cleanup === "function") return (
        /** @type {() => void} */
        cleanup
      );
    });
  }
}
function onDestroy(fn) {
  if (component_context === null) {
    lifecycle_outside_component("onDestroy");
  }
  onMount(() => () => untrack(fn));
}
function init_update_callbacks(context) {
  var l = (
    /** @type {ComponentContextLegacy} */
    context.l
  );
  return l.u ??= { a: [], b: [], m: [] };
}

// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
}

// node_modules/d3-dispatch/src/dispatch.js
var noop2 = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _2 = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _2 || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _2[t] = [];
  }
  return new Dispatch(_2);
}
function Dispatch(_2) {
  this._ = _2;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _2 = this._, T = parseTypenames(typename + "", _2), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get3(_2[t], typename.name))) return t;
      return;
    }
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _2[t] = set2(_2[t], typename.name, callback);
      else if (callback == null) for (t in _2) _2[t] = set2(_2[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _2 = this._;
    for (var t in _2) copy[t] = _2[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};
function get3(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}
function set2(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop2, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name, value: callback });
  return type;
}
var dispatch_default = dispatch;

// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function") select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

// node_modules/d3-selection/src/selectorAll.js
function empty2() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty2 : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function") match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update2) {
  return new Array(update2.length);
}

// node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child2) {
    return this._parent.insertBefore(child2, this._next);
  },
  insertBefore: function(child2, next2) {
    return this._parent.insertBefore(child2, next2);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update2, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update2[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update2, exit, data, key3) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key3.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key3.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update2[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key3) {
  if (!arguments.length) return Array.from(this, datum);
  var bind = key3 ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function") value = constant_default(value);
  for (var m = groups.length, update2 = new Array(m), enter = new Array(m), exit = new Array(m), j2 = 0; j2 < m; ++j2) {
    var parent = parents[j2], group = groups[j2], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j2, parents)), dataLength = data.length, enterGroup = enter[j2] = new Array(dataLength), updateGroup = update2[j2] = new Array(dataLength), exitGroup = exit[j2] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key3);
    for (var i0 = 0, i1 = 0, previous, next2; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next2 = updateGroup[i1]) && ++i1 < dataLength) ;
        previous._next = next2 || null;
      }
    }
  }
  update2 = new Selection(update2, parents);
  update2._enter = enter;
  update2._exit = exit;
  return update2;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update2 = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update2 = onupdate(update2);
    if (update2) update2 = update2.selection();
  }
  if (onexit == null) exit.remove();
  else onexit(exit);
  return enter && update2 ? enter.merge(update2).order() : update2;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j2 = 0; j2 < m; ++j2) {
    for (var group0 = groups0[j2], group1 = groups1[j2], n = group0.length, merge = merges[j2] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j2 < m0; ++j2) {
    merges[j2] = groups0[j2];
  }
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j2 = -1, m = groups.length; ++j2 < m; ) {
    for (var group = groups[j2], i = group.length - 1, next2 = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next2 && node.compareDocumentPosition(next2) ^ 4) next2.parentNode.insertBefore(node, next2);
        next2 = node;
      }
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare) compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, sortgroup = sortgroups[j2] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
    for (var group = groups[j2], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this) ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
    for (var group = groups[j2], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.removeAttribute(name);
    else this.setAttribute(name, v2);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v2);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v2, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) delete this[name];
    else this[name] = v2;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v2 = value.apply(this, arguments);
    this.textContent = v2 == null ? "" : v2;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v2 = value.apply(this, arguments);
    this.innerHTML = v2 == null ? "" : v2;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create2 = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone2 = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone2, this.nextSibling) : clone2;
}
function selection_cloneDeep() {
  var clone2 = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone2, this.nextSibling) : clone2;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event2) {
    listener.call(this, event2, this.__data__);
  };
}
function parseTypenames2(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on2 = this.__on;
    if (!on2) return;
    for (var j2 = 0, i = -1, m = on2.length, o; j2 < m; ++j2) {
      if (o = on2[j2], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on2[++i] = o;
      }
    }
    if (++i) on2.length = i;
    else delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on2 = this.__on, o, listener = contextListener(value);
    if (on2) for (var j2 = 0, m = on2.length; j2 < m; ++j2) {
      if ((o = on2[j2]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on2) this.__on = [o];
    else on2.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on2 = this.node().__on;
    if (on2) for (var j2 = 0, m = on2.length, o; j2 < m; ++j2) {
      for (i = 0, o = on2[j2]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }
  on2 = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on2(typenames[i], value, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type, params) {
  var window2 = window_default(node), event2 = window2.CustomEvent;
  if (typeof event2 === "function") {
    event2 = new event2(type, params);
  } else {
    event2 = window2.document.createEvent("Event");
    if (params) event2.initEvent(type, params.bubbles, params.cancelable), event2.detail = params.detail;
    else event2.initEvent(type, false, false);
  }
  node.dispatchEvent(event2);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function dispatch_default2(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
    for (var group = groups[j2], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

// node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default2,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event2) {
  let sourceEvent;
  while (sourceEvent = event2.sourceEvent) event2 = sourceEvent;
  return event2;
}

// node_modules/d3-selection/src/pointer.js
function pointer_default(event2, node) {
  event2 = sourceEvent_default(event2);
  if (node === void 0) node = event2.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event2.clientX, point.y = event2.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event2.clientX - rect.left - node.clientLeft, event2.clientY - rect.top - node.clientTop];
    }
  }
  return [event2.pageX, event2.pageY];
}

// node_modules/d3-drag/src/noevent.js
var nonpassive2 = { passive: false };
var nonpassivecapture = { capture: true, passive: false };
function nopropagation(event2) {
  event2.stopImmediatePropagation();
}
function noevent_default(event2) {
  event2.preventDefault();
  event2.stopImmediatePropagation();
}

// node_modules/d3-drag/src/nodrag.js
function nodrag_default(view) {
  var root33 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
  if ("onselectstart" in root33) {
    selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
  } else {
    root33.__noselect = root33.style.MozUserSelect;
    root33.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root33 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent_default, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root33) {
    selection2.on("selectstart.drag", null);
  } else {
    root33.style.MozUserSelect = root33.__noselect;
    delete root33.__noselect;
  }
}

// node_modules/d3-drag/src/constant.js
var constant_default2 = (x) => () => x;

// node_modules/d3-drag/src/event.js
function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x,
  y: y2,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x, enumerable: true, configurable: true },
    y: { value: y2, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// node_modules/d3-drag/src/drag.js
function defaultFilter(event2) {
  return !event2.ctrlKey && !event2.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event2, d) {
  return d == null ? { x: event2.x, y: event2.y } : d;
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag_default() {
  var filter2 = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners2 = dispatch_default("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag2(selection2) {
    selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive2).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event2, d) {
    if (touchending || !filter2.call(this, event2, d)) return;
    var gesture = beforestart(this, container.call(this, event2, d), event2, d, "mouse");
    if (!gesture) return;
    select_default2(event2.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    nodrag_default(event2.view);
    nopropagation(event2);
    mousemoving = false;
    mousedownx = event2.clientX;
    mousedowny = event2.clientY;
    gesture("start", event2);
  }
  function mousemoved(event2) {
    noevent_default(event2);
    if (!mousemoving) {
      var dx = event2.clientX - mousedownx, dy = event2.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event2);
  }
  function mouseupped(event2) {
    select_default2(event2.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event2.view, mousemoving);
    noevent_default(event2);
    gestures.mouse("end", event2);
  }
  function touchstarted(event2, d) {
    if (!filter2.call(this, event2, d)) return;
    var touches = event2.changedTouches, c = container.call(this, event2, d), n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event2, d, touches[i].identifier, touches[i])) {
        nopropagation(event2);
        gesture("start", event2, touches[i]);
      }
    }
  }
  function touchmoved(event2) {
    var touches = event2.changedTouches, n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent_default(event2);
        gesture("drag", event2, touches[i]);
      }
    }
  }
  function touchended(event2) {
    var touches = event2.changedTouches, n = touches.length, i, gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event2);
        gesture("end", event2, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event2, d, identifier, touch) {
    var dispatch2 = listeners2.copy(), p = pointer_default(touch || event2, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event2,
      target: drag2,
      identifier,
      active,
      x: p[0],
      y: p[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null) return;
    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;
    return function gesture(type, event3, touch2) {
      var p0 = p, n;
      switch (type) {
        case "start":
          gestures[identifier] = gesture, n = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        // falls through
        case "drag":
          p = pointer_default(touch2 || event3, container2), n = active;
          break;
      }
      dispatch2.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event3,
          subject: s,
          target: drag2,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag2.filter = function(_2) {
    return arguments.length ? (filter2 = typeof _2 === "function" ? _2 : constant_default2(!!_2), drag2) : filter2;
  };
  drag2.container = function(_2) {
    return arguments.length ? (container = typeof _2 === "function" ? _2 : constant_default2(_2), drag2) : container;
  };
  drag2.subject = function(_2) {
    return arguments.length ? (subject = typeof _2 === "function" ? _2 : constant_default2(_2), drag2) : subject;
  };
  drag2.touchable = function(_2) {
    return arguments.length ? (touchable = typeof _2 === "function" ? _2 : constant_default2(!!_2), drag2) : touchable;
  };
  drag2.on = function() {
    var value = listeners2.on.apply(listeners2, arguments);
    return value === listeners2 ? drag2 : value;
  };
  drag2.clickDistance = function(_2) {
    return arguments.length ? (clickDistance2 = (_2 = +_2) * _2, drag2) : Math.sqrt(clickDistance2);
  };
  return drag2;
}

// node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key3 in definition) prototype[key3] = definition[key3];
  return prototype;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r2, g, b, a) {
  if (a <= 0) r2 = g = b = NaN;
  return new Rgb(r2, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r2, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r2) : new Rgb(r2, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r2, g, b, opacity) {
  this.r = +r2;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r2 = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r2, g, b), max = Math.max(r2, g, b), h = NaN, s = max - min, l = (max + min) / 2;
  if (s) {
    if (r2 === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r2) / s + 2;
    else h = (r2 - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default3 = (x) => () => x;

// node_modules/d3-interpolate/src/color.js
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y2) {
  return a = Math.pow(a, y2), b = Math.pow(b, y2) - a, y2 = 1 / y2, function(t) {
    return Math.pow(a + t * b, y2);
  };
}
function gamma(y2) {
  return (y2 = +y2) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y2) : constant_default3(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default3(isNaN(a) ? b : a);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = (function rgbGamma(y2) {
  var color2 = gamma(y2);
  function rgb2(start2, end) {
    var r2 = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.r = r2(t);
      start2.g = g(t);
      start2.b = b(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
})(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r2 = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r2[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r2 = spline(r2);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r2(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-interpolate/src/numberArray.js
function numberArray_default(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
  return function(t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}
function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

// node_modules/d3-interpolate/src/array.js
function genericArray(a, b) {
  var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
  for (i = 0; i < na; ++i) x[i] = value_default(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];
  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/date.js
function date_default(a, b) {
  var d = /* @__PURE__ */ new Date();
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

// node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

// node_modules/d3-interpolate/src/object.js
function object_default(a, b) {
  var i = {}, c = {}, k;
  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};
  for (k in b) {
    if (k in a) {
      i[k] = value_default(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }
  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i]) s[i] += bm;
      else s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs;
    else s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/d3-interpolate/src/value.js
function value_default(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant_default3(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object_default : number_default)(a, b);
}

// node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}

// node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}

// node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop2(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;
      else if (b - a > 180) a += 360;
      q.push({ i: s.push(pop2(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop2(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({ i: s.push(pop2(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop2(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop2(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop2(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a, b) {
    var s = [], q = [];
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

// node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;
function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
var zoom_default = (function zoomRho(rho, rho2, rho4) {
  function zoom2(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom2.rho = function(_2) {
    var _1 = Math.max(1e-3, +_2), _22 = _1 * _1, _4 = _22 * _22;
    return zoomRho(_1, _22, _4);
  };
  return zoom2;
})(Math.SQRT2, 2, 4);

// node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame) return;
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

// node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

// node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node, name, id2, index2, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id2 in schedules) return;
  create(node, id2, {
    name,
    index: index2,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init2(node, id2) {
  var schedule = get4(node, id2);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}
function set3(node, id2) {
  var schedule = get4(node, id2);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}
function get4(node, id2) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
  return schedule;
}
function create(node, id2, self2) {
  var schedules = node.__transition, tween;
  schedules[id2] = self2;
  self2.timer = timer(schedule, 0, self2.time);
  function schedule(elapsed) {
    self2.state = SCHEDULED;
    self2.timer.restart(start2, self2.delay, self2.time);
    if (self2.delay <= elapsed) start2(elapsed - self2.delay);
  }
  function start2(elapsed) {
    var i, j2, n, o;
    if (self2.state !== SCHEDULED) return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self2.name) continue;
      if (o.state === STARTED) return timeout_default(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout_default(function() {
      if (self2.state === STARTED) {
        self2.state = RUNNING;
        self2.timer.restart(tick2, self2.delay, self2.time);
        tick2(elapsed);
      }
    });
    self2.state = STARTING;
    self2.on.call("start", node, node.__data__, self2.index, self2.group);
    if (self2.state !== STARTING) return;
    self2.state = STARTED;
    tween = new Array(n = self2.tween.length);
    for (i = 0, j2 = -1; i < n; ++i) {
      if (o = self2.tween[i].value.call(node, node.__data__, self2.index, self2.group)) {
        tween[++j2] = o;
      }
    }
    tween.length = j2 + 1;
  }
  function tick2(elapsed) {
    var t = elapsed < self2.duration ? self2.ease.call(null, elapsed / self2.duration) : (self2.timer.restart(stop), self2.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t);
    }
    if (self2.state === ENDING) {
      self2.on.call("end", node, node.__data__, self2.index, self2.group);
      stop();
    }
  }
  function stop() {
    self2.state = ENDED;
    self2.timer.stop();
    delete schedules[id2];
    for (var i in schedules) return;
    delete node.__transition;
  }
}

// node_modules/d3-transition/src/interrupt.js
function interrupt_default(node, name) {
  var schedules = node.__transition, schedule, active, empty3 = true, i;
  if (!schedules) return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty3 = false;
      continue;
    }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }
  if (empty3) delete node.__transition;
}

// node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule = set3(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function() {
    var schedule = set3(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }
    schedule.tween = tween1;
  };
}
function tween_default(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get4(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition3, name, value) {
  var id2 = transition3._id;
  transition3.each(function() {
    var schedule = set3(this, id2);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get4(node, id2).value[name];
  };
}

// node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
  var c;
  return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}

// node_modules/d3-transition/src/transition/attr.js
function attrRemove2(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attrFunctionNS2(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attr_default2(name, value) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
}

// node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween_default(name, value) {
  var key3 = "attr." + name;
  if (arguments.length < 2) return (key3 = this.tween(key3)) && key3._value;
  if (value == null) return this.tween(key3, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace_default(name);
  return this.tween(key3, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

// node_modules/d3-transition/src/transition/delay.js
function delayFunction(id2, value) {
  return function() {
    init2(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init2(this, id2).delay = value;
  };
}
function delay_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get4(this.node(), id2).delay;
}

// node_modules/d3-transition/src/transition/duration.js
function durationFunction(id2, value) {
  return function() {
    set3(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set3(this, id2).duration = value;
  };
}
function duration_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get4(this.node(), id2).duration;
}

// node_modules/d3-transition/src/transition/ease.js
function easeConstant(id2, value) {
  if (typeof value !== "function") throw new Error();
  return function() {
    set3(this, id2).ease = value;
  };
}
function ease_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get4(this.node(), id2).ease;
}

// node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id2, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (typeof v2 !== "function") throw new Error();
    set3(this, id2).ease = v2;
  };
}
function easeVarying_default(value) {
  if (typeof value !== "function") throw new Error();
  return this.each(easeVarying(this._id, value));
}

// node_modules/d3-transition/src/transition/filter.js
function filter_default2(match) {
  if (typeof match !== "function") match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition3) {
  if (transition3._id !== this._id) throw new Error();
  for (var groups0 = this._groups, groups1 = transition3._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j2 = 0; j2 < m; ++j2) {
    for (var group0 = groups0[j2], group1 = groups1[j2], n = group0.length, merge = merges[j2] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j2 < m0; ++j2) {
    merges[j2] = groups0[j2];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/on.js
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init2 : set3;
  return function() {
    var schedule = sit(this, id2), on2 = schedule.on;
    if (on2 !== on0) (on1 = (on0 = on2).copy()).on(name, listener);
    schedule.on = on1;
  };
}
function on_default2(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get4(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}

// node_modules/d3-transition/src/transition/remove.js
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id2) return;
    if (parent) parent.removeChild(this);
  };
}
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/d3-transition/src/transition/select.js
function select_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function") select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule_default(subgroup[i], name, id2, i, subgroup, get4(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}

// node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default2(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function") select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select.call(node, node.__data__, i, group), child2, inherit2 = get4(node, id2), k = 0, l = children2.length; k < l; ++k) {
          if (child2 = children2[k]) {
            schedule_default(child2, name, id2, k, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}

// node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function styleFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key3 = "style." + name, event2 = "end." + key3, remove2;
  return function() {
    var schedule = set3(this, id2), on2 = schedule.on, listener = schedule.value[key3] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
    if (on2 !== on0 || listener0 !== listener) (on1 = (on0 = on2).copy()).on(event2, listener0 = listener);
    schedule.on = on1;
  };
}
function style_default2(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
}

// node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}
function styleTween_default(name, value, priority) {
  var key3 = "style." + (name += "");
  if (arguments.length < 2) return (key3 = this.tween(key3)) && key3._value;
  if (value == null) return this.tween(key3, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key3, styleTween(name, value, priority == null ? "" : priority));
}

// node_modules/d3-transition/src/transition/text.js
function textConstant2(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction2(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function text_default2(value) {
  return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
}

// node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function textTween_default(value) {
  var key3 = "text";
  if (arguments.length < 1) return (key3 = this.tween(key3)) && key3._value;
  if (value == null) return this.tween(key3, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key3, textTween(value));
}

// node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m = groups.length, j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get4(node, id0);
        schedule_default(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}

// node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0) resolve();
    } };
    that.each(function() {
      var schedule = set3(this, id2), on2 = schedule.on;
      if (on2 !== on0) {
        on1 = (on0 = on2).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule.on = on1;
    });
    if (size === 0) resolve();
  });
}

// node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function transition2(name) {
  return selection_default().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition2.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default2,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default2,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

// node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function transition_default2(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m = groups.length, j2 = 0; j2 < m; ++j2) {
    for (var group = groups[j2], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}

// node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/d3-zoom/src/constant.js
var constant_default4 = (x) => () => x;

// node_modules/d3-zoom/src/event.js
function ZoomEvent(type, {
  sourceEvent,
  target,
  transform: transform2,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform2, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}

// node_modules/d3-zoom/src/transform.js
function Transform(k, x, y2) {
  this.k = k;
  this.x = x;
  this.y = y2;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y2) {
    return x === 0 & y2 === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y2);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y2) {
    return y2 * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y2) {
    return (y2 - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y2) {
    return y2.copy().domain(y2.range().map(this.invertY, this).map(y2.invert, y2));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity2;
  return node.__zoom;
}

// node_modules/d3-zoom/src/noevent.js
function nopropagation2(event2) {
  event2.stopImmediatePropagation();
}
function noevent_default2(event2) {
  event2.preventDefault();
  event2.stopImmediatePropagation();
}

// node_modules/d3-zoom/src/zoom.js
function defaultFilter2(event2) {
  return (!event2.ctrlKey || event2.type === "wheel") && !event2.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity2;
}
function defaultWheelDelta(event2) {
  return -event2.deltaY * (event2.deltaMode === 1 ? 0.05 : event2.deltaMode ? 1 : 2e-3) * (event2.ctrlKey ? 10 : 1);
}
function defaultTouchable2() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform2, extent, translateExtent) {
  var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
  return transform2.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom_default2() {
  var filter2 = defaultFilter2, extent = defaultExtent, constrain = defaultConstrain, wheelDelta2 = defaultWheelDelta, touchable = defaultTouchable2, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners2 = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom2(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom2.transform = function(collection, transform2, point, event2) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule(collection, transform2, point, event2);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event2).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
      });
    }
  };
  zoom2.scaleBy = function(selection2, k, p, event2) {
    zoom2.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event2);
  };
  zoom2.scaleTo = function(selection2, k, p, event2) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event2);
  };
  zoom2.translateBy = function(selection2, x, y2, event2) {
    zoom2.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y2 === "function" ? y2.apply(this, arguments) : y2
      ), extent.apply(this, arguments), translateExtent);
    }, null, event2);
  };
  zoom2.translateTo = function(selection2, x, y2, p, event2) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y2 === "function" ? -y2.apply(this, arguments) : -y2
      ), e, translateExtent);
    }, p, event2);
  };
  function scale(transform2, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x = p0[0] - p1[0] * transform2.k, y2 = p0[1] - p1[1] * transform2.k;
    return x === transform2.x && y2 === transform2.y ? transform2 : new Transform(transform2.k, x, y2);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule(transition3, transform2, point, event2) {
    transition3.on("start.zoom", function() {
      gesture(this, arguments).event(event2).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event2).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event2), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
      return function(t) {
        if (t === 1) t = b;
        else {
          var l = i(t), k = w / l[2];
          t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
        }
        g.zoom(null, t);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event2) {
      if (event2) this.sourceEvent = event2;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key3, transform2) {
      if (this.mouse && key3 !== "mouse") this.mouse[1] = transform2.invert(this.mouse[0]);
      if (this.touch0 && key3 !== "touch") this.touch0[1] = transform2.invert(this.touch0[0]);
      if (this.touch1 && key3 !== "touch") this.touch1[1] = transform2.invert(this.touch1[0]);
      this.that.__zoom = transform2;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select_default2(this.that).datum();
      listeners2.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom2,
          type,
          transform: this.that.__zoom,
          dispatch: listeners2
        }),
        d
      );
    }
  };
  function wheeled(event2, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var g = gesture(this, args).event(event2), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta2.apply(this, arguments)))), p = pointer_default(event2);
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    } else if (t.k === k) return;
    else {
      g.mouse = [p, t.invert(p)];
      interrupt_default(this);
      g.start();
    }
    noevent_default2(event2);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event2, ...args) {
    if (touchending || !filter2.apply(this, arguments)) return;
    var currentTarget = event2.currentTarget, g = gesture(this, args, true).event(event2), v2 = select_default2(event2.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event2, currentTarget), x0 = event2.clientX, y0 = event2.clientY;
    nodrag_default(event2.view);
    nopropagation2(event2);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt_default(this);
    g.start();
    function mousemoved(event3) {
      noevent_default2(event3);
      if (!g.moved) {
        var dx = event3.clientX - x0, dy = event3.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event3).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event3, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event3) {
      v2.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event3.view, g.moved);
      noevent_default2(event3);
      g.event(event3).end();
    }
  }
  function dblclicked(event2, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var t0 = this.__zoom, p0 = pointer_default(event2.changedTouches ? event2.changedTouches[0] : event2, this), p1 = t0.invert(p0), k1 = t0.k * (event2.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent_default2(event2);
    if (duration > 0) select_default2(this).transition().duration(duration).call(schedule, t1, p0, event2);
    else select_default2(this).call(zoom2.transform, t1, p0, event2);
  }
  function touchstarted(event2, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var touches = event2.touches, n = touches.length, g = gesture(this, args, event2.changedTouches.length === n).event(event2), started, i, t, p;
    nopropagation2(event2);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
        touchstarting = null;
      }, touchDelay);
      interrupt_default(this);
      g.start();
    }
  }
  function touchmoved(event2, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event2), touches = event2.changedTouches, n = touches.length, i, t, p, l;
    noevent_default2(event2);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;
    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }
  function touchended(event2, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event2), touches = event2.changedTouches, n = touches.length, i, t;
    nopropagation2(event2);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t = pointer_default(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select_default2(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }
  zoom2.wheelDelta = function(_2) {
    return arguments.length ? (wheelDelta2 = typeof _2 === "function" ? _2 : constant_default4(+_2), zoom2) : wheelDelta2;
  };
  zoom2.filter = function(_2) {
    return arguments.length ? (filter2 = typeof _2 === "function" ? _2 : constant_default4(!!_2), zoom2) : filter2;
  };
  zoom2.touchable = function(_2) {
    return arguments.length ? (touchable = typeof _2 === "function" ? _2 : constant_default4(!!_2), zoom2) : touchable;
  };
  zoom2.extent = function(_2) {
    return arguments.length ? (extent = typeof _2 === "function" ? _2 : constant_default4([[+_2[0][0], +_2[0][1]], [+_2[1][0], +_2[1][1]]]), zoom2) : extent;
  };
  zoom2.scaleExtent = function(_2) {
    return arguments.length ? (scaleExtent[0] = +_2[0], scaleExtent[1] = +_2[1], zoom2) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom2.translateExtent = function(_2) {
    return arguments.length ? (translateExtent[0][0] = +_2[0][0], translateExtent[1][0] = +_2[1][0], translateExtent[0][1] = +_2[0][1], translateExtent[1][1] = +_2[1][1], zoom2) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom2.constrain = function(_2) {
    return arguments.length ? (constrain = _2, zoom2) : constrain;
  };
  zoom2.duration = function(_2) {
    return arguments.length ? (duration = +_2, zoom2) : duration;
  };
  zoom2.interpolate = function(_2) {
    return arguments.length ? (interpolate = _2, zoom2) : interpolate;
  };
  zoom2.on = function() {
    var value = listeners2.on.apply(listeners2, arguments);
    return value === listeners2 ? zoom2 : value;
  };
  zoom2.clickDistance = function(_2) {
    return arguments.length ? (clickDistance2 = (_2 = +_2) * _2, zoom2) : Math.sqrt(clickDistance2);
  };
  zoom2.tapDistance = function(_2) {
    return arguments.length ? (tapDistance = +_2, zoom2) : tapDistance;
  };
  return zoom2;
}

// node_modules/@xyflow/system/dist/esm/index.js
var errorMessages = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (id2) => `The old edge with id=${id2} does not exist.`,
  error009: (type) => `Marker type "${type}" doesn't exist.`,
  error008: (handleType, { id: id2, sourceHandle, targetHandle }) => `Couldn't create edge for ${handleType} handle id: "${handleType === "source" ? sourceHandle : targetHandle}", edge id: ${id2}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: (id2) => `Node with id "${id2}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (lib = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${lib}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
};
var infiniteExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
];
var elementSelectionKeys = ["Enter", " ", "Escape"];
var defaultAriaLabelConfig = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction, x, y: y2 }) => `Moved selected node ${direction}. New position, x: ${x}, y: ${y2}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var ConnectionMode;
(function(ConnectionMode2) {
  ConnectionMode2["Strict"] = "strict";
  ConnectionMode2["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function(PanOnScrollMode2) {
  PanOnScrollMode2["Free"] = "free";
  PanOnScrollMode2["Vertical"] = "vertical";
  PanOnScrollMode2["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var SelectionMode;
(function(SelectionMode2) {
  SelectionMode2["Partial"] = "partial";
  SelectionMode2["Full"] = "full";
})(SelectionMode || (SelectionMode = {}));
var initialConnection = {
  inProgress: false,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var ConnectionLineType;
(function(ConnectionLineType2) {
  ConnectionLineType2["Bezier"] = "default";
  ConnectionLineType2["Straight"] = "straight";
  ConnectionLineType2["Step"] = "step";
  ConnectionLineType2["SmoothStep"] = "smoothstep";
  ConnectionLineType2["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function(MarkerType2) {
  MarkerType2["Arrow"] = "arrow";
  MarkerType2["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));
var Position;
(function(Position2) {
  Position2["Left"] = "left";
  Position2["Top"] = "top";
  Position2["Right"] = "right";
  Position2["Bottom"] = "bottom";
})(Position || (Position = {}));
var oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
};
function areConnectionMapsEqual(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b || a.size !== b.size) {
    return false;
  }
  if (!a.size && !b.size) {
    return true;
  }
  for (const key3 of a.keys()) {
    if (!b.has(key3)) {
      return false;
    }
  }
  return true;
}
function handleConnectionChange(a, b, cb) {
  if (!cb) {
    return;
  }
  const diff = [];
  a.forEach((connection, key3) => {
    if (!b?.has(key3)) {
      diff.push(connection);
    }
  });
  if (diff.length) {
    cb(diff);
  }
}
function getConnectionStatus(isValid) {
  return isValid === null ? null : isValid ? "valid" : "invalid";
}
var isEdgeBase = (element2) => "id" in element2 && "source" in element2 && "target" in element2;
var isNodeBase = (element2) => "id" in element2 && "position" in element2 && !("source" in element2) && !("target" in element2);
var isInternalNodeBase = (element2) => "id" in element2 && "internals" in element2 && !("source" in element2) && !("target" in element2);
var getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
  const { width, height } = getNodeDimensions(node);
  const origin = node.origin ?? nodeOrigin;
  const offsetX = width * origin[0];
  const offsetY = height * origin[1];
  return {
    x: node.position.x - offsetX,
    y: node.position.y - offsetY
  };
};
var getNodesBounds = (nodes, params = { nodeOrigin: [0, 0] }) => {
  if (!params.nodeLookup) {
    console.warn("Please use `getNodesBounds` from `useReactFlow`/`useSvelteFlow` hook to ensure correct values for sub flows. If not possible, you have to provide a nodeLookup to support sub flows.");
  }
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const box = nodes.reduce((currBox, nodeOrId) => {
    const isId = typeof nodeOrId === "string";
    let currentNode = !params.nodeLookup && !isId ? nodeOrId : void 0;
    if (params.nodeLookup) {
      currentNode = isId ? params.nodeLookup.get(nodeOrId) : !isInternalNodeBase(nodeOrId) ? params.nodeLookup.get(nodeOrId.id) : nodeOrId;
    }
    const nodeBox = currentNode ? nodeToBox(currentNode, params.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return getBoundsOfBoxes(currBox, nodeBox);
  }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
  return boxToRect(box);
};
var getInternalNodesBounds = (nodeLookup, params = {}) => {
  let box = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
  let hasVisibleNodes = false;
  nodeLookup.forEach((node) => {
    if (params.filter === void 0 || params.filter(node)) {
      box = getBoundsOfBoxes(box, nodeToBox(node));
      hasVisibleNodes = true;
    }
  });
  return hasVisibleNodes ? boxToRect(box) : { x: 0, y: 0, width: 0, height: 0 };
};
var getNodesInside = (nodes, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, excludeNonSelectableNodes = false) => {
  const paneRect = {
    ...pointToRendererPoint(rect, [tx, ty, tScale]),
    width: rect.width / tScale,
    height: rect.height / tScale
  };
  const visibleNodes = [];
  for (const node of nodes.values()) {
    const { measured, selectable = true, hidden = false } = node;
    if (excludeNonSelectableNodes && !selectable || hidden) {
      continue;
    }
    const width = measured.width ?? node.width ?? node.initialWidth ?? null;
    const height = measured.height ?? node.height ?? node.initialHeight ?? null;
    const overlappingArea = getOverlappingArea(paneRect, nodeToRect(node));
    const area = (width ?? 0) * (height ?? 0);
    const partiallyVisible = partially && overlappingArea > 0;
    const forceInitialRender = !node.internals.handleBounds;
    const isVisible = forceInitialRender || partiallyVisible || overlappingArea >= area;
    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  }
  return visibleNodes;
};
var getConnectedEdges = (nodes, edges) => {
  const nodeIds = /* @__PURE__ */ new Set();
  nodes.forEach((node) => {
    nodeIds.add(node.id);
  });
  return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
};
function getFitViewNodes(nodeLookup, options) {
  const fitViewNodes = /* @__PURE__ */ new Map();
  const optionNodeIds = options?.nodes ? new Set(options.nodes.map((node) => node.id)) : null;
  nodeLookup.forEach((n) => {
    const isVisible = n.measured.width && n.measured.height && (options?.includeHiddenNodes || !n.hidden);
    if (isVisible && (!optionNodeIds || optionNodeIds.has(n.id))) {
      fitViewNodes.set(n.id, n);
    }
  });
  return fitViewNodes;
}
async function fitViewport({ nodes, width, height, panZoom, minZoom, maxZoom }, options) {
  if (nodes.size === 0) {
    return Promise.resolve(true);
  }
  const nodesToFit = getFitViewNodes(nodes, options);
  const bounds = getInternalNodesBounds(nodesToFit);
  const viewport = getViewportForBounds(bounds, width, height, options?.minZoom ?? minZoom, options?.maxZoom ?? maxZoom, options?.padding ?? 0.1);
  await panZoom.setViewport(viewport, {
    duration: options?.duration,
    ease: options?.ease,
    interpolate: options?.interpolate
  });
  return Promise.resolve(true);
}
function calculateNodePosition({ nodeId, nextPosition, nodeLookup, nodeOrigin = [0, 0], nodeExtent, onError }) {
  const node = nodeLookup.get(nodeId);
  const parentNode = node.parentId ? nodeLookup.get(node.parentId) : void 0;
  const { x: parentX, y: parentY } = parentNode ? parentNode.internals.positionAbsolute : { x: 0, y: 0 };
  const origin = node.origin ?? nodeOrigin;
  let extent = node.extent || nodeExtent;
  if (node.extent === "parent" && !node.expandParent) {
    if (!parentNode) {
      onError?.("005", errorMessages["error005"]());
    } else {
      const parentWidth = parentNode.measured.width;
      const parentHeight = parentNode.measured.height;
      if (parentWidth && parentHeight) {
        extent = [
          [parentX, parentY],
          [parentX + parentWidth, parentY + parentHeight]
        ];
      }
    }
  } else if (parentNode && isCoordinateExtent(node.extent)) {
    extent = [
      [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
      [node.extent[1][0] + parentX, node.extent[1][1] + parentY]
    ];
  }
  const positionAbsolute = isCoordinateExtent(extent) ? clampPosition(nextPosition, extent, node.measured) : nextPosition;
  if (node.measured.width === void 0 || node.measured.height === void 0) {
    onError?.("015", errorMessages["error015"]());
  }
  return {
    position: {
      x: positionAbsolute.x - parentX + (node.measured.width ?? 0) * origin[0],
      y: positionAbsolute.y - parentY + (node.measured.height ?? 0) * origin[1]
    },
    positionAbsolute
  };
}
async function getElementsToRemove({ nodesToRemove = [], edgesToRemove = [], nodes, edges, onBeforeDelete }) {
  const nodeIds = new Set(nodesToRemove.map((node) => node.id));
  const matchingNodes = [];
  for (const node of nodes) {
    if (node.deletable === false) {
      continue;
    }
    const isIncluded = nodeIds.has(node.id);
    const parentHit = !isIncluded && node.parentId && matchingNodes.find((n) => n.id === node.parentId);
    if (isIncluded || parentHit) {
      matchingNodes.push(node);
    }
  }
  const edgeIds = new Set(edgesToRemove.map((edge) => edge.id));
  const deletableEdges = edges.filter((edge) => edge.deletable !== false);
  const connectedEdges = getConnectedEdges(matchingNodes, deletableEdges);
  const matchingEdges = connectedEdges;
  for (const edge of deletableEdges) {
    const isIncluded = edgeIds.has(edge.id);
    if (isIncluded && !matchingEdges.find((e) => e.id === edge.id)) {
      matchingEdges.push(edge);
    }
  }
  if (!onBeforeDelete) {
    return {
      edges: matchingEdges,
      nodes: matchingNodes
    };
  }
  const onBeforeDeleteResult = await onBeforeDelete({
    nodes: matchingNodes,
    edges: matchingEdges
  });
  if (typeof onBeforeDeleteResult === "boolean") {
    return onBeforeDeleteResult ? { edges: matchingEdges, nodes: matchingNodes } : { edges: [], nodes: [] };
  }
  return onBeforeDeleteResult;
}
var clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
var clampPosition = (position = { x: 0, y: 0 }, extent, dimensions) => ({
  x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
  y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0))
});
function clampPositionToParent(childPosition, childDimensions, parent) {
  const { width: parentWidth, height: parentHeight } = getNodeDimensions(parent);
  const { x: parentX, y: parentY } = parent.internals.positionAbsolute;
  return clampPosition(childPosition, [
    [parentX, parentY],
    [parentX + parentWidth, parentY + parentHeight]
  ], childDimensions);
}
var calcAutoPanVelocity = (value, min, max) => {
  if (value < min) {
    return clamp(Math.abs(value - min), 1, min) / min;
  } else if (value > max) {
    return -clamp(Math.abs(value - max), 1, min) / min;
  }
  return 0;
};
var calcAutoPan = (pos, bounds, speed = 15, distance2 = 40) => {
  const xMovement = calcAutoPanVelocity(pos.x, distance2, bounds.width - distance2) * speed;
  const yMovement = calcAutoPanVelocity(pos.y, distance2, bounds.height - distance2) * speed;
  return [xMovement, yMovement];
};
var getBoundsOfBoxes = (box1, box2) => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2)
});
var rectToBox = ({ x, y: y2, width, height }) => ({
  x,
  y: y2,
  x2: x + width,
  y2: y2 + height
});
var boxToRect = ({ x, y: y2, x2, y2: y22 }) => ({
  x,
  y: y2,
  width: x2 - x,
  height: y22 - y2
});
var nodeToRect = (node, nodeOrigin = [0, 0]) => {
  const { x, y: y2 } = isInternalNodeBase(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  return {
    x,
    y: y2,
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
  };
};
var nodeToBox = (node, nodeOrigin = [0, 0]) => {
  const { x, y: y2 } = isInternalNodeBase(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  return {
    x,
    y: y2,
    x2: x + (node.measured?.width ?? node.width ?? node.initialWidth ?? 0),
    y2: y2 + (node.measured?.height ?? node.height ?? node.initialHeight ?? 0)
  };
};
var getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
var getOverlappingArea = (rectA, rectB) => {
  const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
  const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
  return Math.ceil(xOverlap * yOverlap);
};
var isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
var isNumeric = (n) => !isNaN(n) && isFinite(n);
var devWarn = (id2, message) => {
  if (true) {
    console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id2}`);
  }
};
var snapPosition = (position, snapGrid = [1, 1]) => {
  return {
    x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
    y: snapGrid[1] * Math.round(position.y / snapGrid[1])
  };
};
var pointToRendererPoint = ({ x, y: y2 }, [tx, ty, tScale], snapToGrid = false, snapGrid = [1, 1]) => {
  const position = {
    x: (x - tx) / tScale,
    y: (y2 - ty) / tScale
  };
  return snapToGrid ? snapPosition(position, snapGrid) : position;
};
var rendererPointToPoint = ({ x, y: y2 }, [tx, ty, tScale]) => {
  return {
    x: x * tScale + tx,
    y: y2 * tScale + ty
  };
};
function parsePadding(padding, viewport) {
  if (typeof padding === "number") {
    return Math.floor((viewport - viewport / (1 + padding)) * 0.5);
  }
  if (typeof padding === "string" && padding.endsWith("px")) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(paddingValue);
    }
  }
  if (typeof padding === "string" && padding.endsWith("%")) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(viewport * paddingValue * 0.01);
    }
  }
  console.error(`[React Flow] The padding value "${padding}" is invalid. Please provide a number or a string with a valid unit (px or %).`);
  return 0;
}
function parsePaddings(padding, width, height) {
  if (typeof padding === "string" || typeof padding === "number") {
    const paddingY = parsePadding(padding, height);
    const paddingX = parsePadding(padding, width);
    return {
      top: paddingY,
      right: paddingX,
      bottom: paddingY,
      left: paddingX,
      x: paddingX * 2,
      y: paddingY * 2
    };
  }
  if (typeof padding === "object") {
    const top = parsePadding(padding.top ?? padding.y ?? 0, height);
    const bottom = parsePadding(padding.bottom ?? padding.y ?? 0, height);
    const left = parsePadding(padding.left ?? padding.x ?? 0, width);
    const right = parsePadding(padding.right ?? padding.x ?? 0, width);
    return { top, right, bottom, left, x: left + right, y: top + bottom };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function calculateAppliedPaddings(bounds, x, y2, zoom2, width, height) {
  const { x: left, y: top } = rendererPointToPoint(bounds, [x, y2, zoom2]);
  const { x: boundRight, y: boundBottom } = rendererPointToPoint({ x: bounds.x + bounds.width, y: bounds.y + bounds.height }, [x, y2, zoom2]);
  const right = width - boundRight;
  const bottom = height - boundBottom;
  return {
    left: Math.floor(left),
    top: Math.floor(top),
    right: Math.floor(right),
    bottom: Math.floor(bottom)
  };
}
var getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding) => {
  const p = parsePaddings(padding, width, height);
  const xZoom = (width - p.x) / bounds.width;
  const yZoom = (height - p.y) / bounds.height;
  const zoom2 = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom2, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y2 = height / 2 - boundsCenterY * clampedZoom;
  const newPadding = calculateAppliedPaddings(bounds, x, y2, clampedZoom, width, height);
  const offset = {
    left: Math.min(newPadding.left - p.left, 0),
    top: Math.min(newPadding.top - p.top, 0),
    right: Math.min(newPadding.right - p.right, 0),
    bottom: Math.min(newPadding.bottom - p.bottom, 0)
  };
  return {
    x: x - offset.left + offset.right,
    y: y2 - offset.top + offset.bottom,
    zoom: clampedZoom
  };
};
var isMacOs = () => typeof navigator !== "undefined" && navigator?.userAgent?.indexOf("Mac") >= 0;
function isCoordinateExtent(extent) {
  return extent !== void 0 && extent !== null && extent !== "parent";
}
function getNodeDimensions(node) {
  return {
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
  };
}
function nodeHasDimensions(node) {
  return (node.measured?.width ?? node.width ?? node.initialWidth) !== void 0 && (node.measured?.height ?? node.height ?? node.initialHeight) !== void 0;
}
function evaluateAbsolutePosition(position, dimensions = { width: 0, height: 0 }, parentId, nodeLookup, nodeOrigin) {
  const positionAbsolute = { ...position };
  const parent = nodeLookup.get(parentId);
  if (parent) {
    const origin = parent.origin || nodeOrigin;
    positionAbsolute.x += parent.internals.positionAbsolute.x - (dimensions.width ?? 0) * origin[0];
    positionAbsolute.y += parent.internals.positionAbsolute.y - (dimensions.height ?? 0) * origin[1];
  }
  return positionAbsolute;
}
function mergeAriaLabelConfig(partial) {
  return { ...defaultAriaLabelConfig, ...partial || {} };
}
function getPointerPosition(event2, { snapGrid = [0, 0], snapToGrid = false, transform: transform2, containerBounds }) {
  const { x, y: y2 } = getEventPosition(event2);
  const pointerPos = pointToRendererPoint({ x: x - (containerBounds?.left ?? 0), y: y2 - (containerBounds?.top ?? 0) }, transform2);
  const { x: xSnapped, y: ySnapped } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;
  return {
    xSnapped,
    ySnapped,
    ...pointerPos
  };
}
var getDimensions = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight
});
var getHostForElement = (element2) => element2?.getRootNode?.() || window?.document;
var inputTags = ["INPUT", "SELECT", "TEXTAREA"];
function isInputDOMNode(event2) {
  const target = event2.composedPath?.()?.[0] || event2.target;
  if (target?.nodeType !== 1)
    return false;
  const isInput = inputTags.includes(target.nodeName) || target.hasAttribute("contenteditable");
  return isInput || !!target.closest(".nokey");
}
var isMouseEvent = (event2) => "clientX" in event2;
var getEventPosition = (event2, bounds) => {
  const isMouse = isMouseEvent(event2);
  const evtX = isMouse ? event2.clientX : event2.touches?.[0].clientX;
  const evtY = isMouse ? event2.clientY : event2.touches?.[0].clientY;
  return {
    x: evtX - (bounds?.left ?? 0),
    y: evtY - (bounds?.top ?? 0)
  };
};
var getHandleBounds = (type, nodeElement, nodeBounds, zoom2, nodeId) => {
  const handles = nodeElement.querySelectorAll(`.${type}`);
  if (!handles || !handles.length) {
    return null;
  }
  return Array.from(handles).map((handle) => {
    const handleBounds = handle.getBoundingClientRect();
    return {
      id: handle.getAttribute("data-handleid"),
      type,
      nodeId,
      position: handle.getAttribute("data-handlepos"),
      x: (handleBounds.left - nodeBounds.left) / zoom2,
      y: (handleBounds.top - nodeBounds.top) / zoom2,
      ...getDimensions(handle)
    };
  });
};
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  const offsetX = Math.abs(centerX - sourceX);
  const offsetY = Math.abs(centerY - sourceY);
  return [centerX, centerY, offsetX, offsetY];
}
function calculateControlOffset(distance2, curvature) {
  if (distance2 >= 0) {
    return 0.5 * distance2;
  }
  return curvature * 25 * Math.sqrt(-distance2);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25 }) {
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
}
function getElevatedEdgeZIndex({ sourceNode, targetNode, selected = false, zIndex = 0, elevateOnSelect = false, zIndexMode = "basic" }) {
  if (zIndexMode === "manual") {
    return zIndex;
  }
  const edgeZ = elevateOnSelect && selected ? zIndex + 1e3 : zIndex;
  const nodeZ = Math.max(sourceNode.parentId || elevateOnSelect && sourceNode.selected ? sourceNode.internals.z : 0, targetNode.parentId || elevateOnSelect && targetNode.selected ? targetNode.internals.z : 0);
  return edgeZ + nodeZ;
}
function isEdgeVisible({ sourceNode, targetNode, width, height, transform: transform2 }) {
  const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));
  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }
  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }
  const viewRect = {
    x: -transform2[0] / transform2[2],
    y: -transform2[1] / transform2[2],
    width: width / transform2[2],
    height: height / transform2[2]
  };
  return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
}
var getEdgeId = ({ source: source2, sourceHandle, target, targetHandle }) => `xy-edge__${source2}${sourceHandle || ""}-${target}${targetHandle || ""}`;
var connectionExists = (edge, edges) => {
  return edges.some((el) => el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
};
var addEdge = (edgeParams, edges, options = {}) => {
  if (!edgeParams.source || !edgeParams.target) {
    devWarn("006", errorMessages["error006"]());
    return edges;
  }
  const edgeIdGenerator = options.getEdgeId || getEdgeId;
  let edge;
  if (isEdgeBase(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: edgeIdGenerator(edgeParams)
    };
  }
  if (connectionExists(edge, edges)) {
    return edges;
  }
  if (edge.sourceHandle === null) {
    delete edge.sourceHandle;
  }
  if (edge.targetHandle === null) {
    delete edge.targetHandle;
  }
  return edges.concat(edge);
};
function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
var handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 }
};
var getDirection = ({ source: source2, sourcePosition = Position.Bottom, target }) => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source2.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source2.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};
var distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
function getPoints({ source: source2, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset, stepPosition }) {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = { x: source2.x + sourceDir.x * offset, y: source2.y + sourceDir.y * offset };
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped
  });
  const dirAccessor = dir.x !== 0 ? "x" : "y";
  const currDir = dir[dirAccessor];
  let points = [];
  let centerX, centerY;
  const sourceGapOffset = { x: 0, y: 0 };
  const targetGapOffset = { x: 0, y: 0 };
  const [, , defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source2.x,
    sourceY: source2.y,
    targetX: target.x,
    targetY: target.y
  });
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    if (dirAccessor === "x") {
      centerX = center.x ?? sourceGapped.x + (targetGapped.x - sourceGapped.x) * stepPosition;
      centerY = center.y ?? (sourceGapped.y + targetGapped.y) / 2;
    } else {
      centerX = center.x ?? (sourceGapped.x + targetGapped.x) / 2;
      centerY = center.y ?? sourceGapped.y + (targetGapped.y - sourceGapped.y) * stepPosition;
    }
    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y }
    ];
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY }
    ];
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source2[dirAccessor] - target[dirAccessor]);
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source2[dirAccessor] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
        }
      }
    }
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget = sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo);
      if (flipSourceTarget) {
        points = dirAccessor === "x" ? sourceTarget : targetSource;
      }
    }
    const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
    const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
      centerY = points[0].y;
    } else {
      centerX = points[0].x;
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }
  const pathPoints = [
    source2,
    { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
    ...points,
    { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
    target
  ];
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}
function getBend(a, b, c, size) {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y: y2 } = b;
  if (a.x === x && x === c.x || a.y === y2 && y2 === c.y) {
    return `L${x} ${y2}`;
  }
  if (a.y === y2) {
    const xDir2 = a.x < c.x ? -1 : 1;
    const yDir2 = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir2},${y2}Q ${x},${y2} ${x},${y2 + bendSize * yDir2}`;
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y2 + bendSize * yDir}Q ${x},${y2} ${x + bendSize * xDir},${y2}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20, stepPosition = 0.5 }) {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset,
    stepPosition
  });
  const path = points.reduce((res, p, i) => {
    let segment = "";
    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
    }
    res += segment;
    return res;
  }, "");
  return [path, labelX, labelY, offsetX, offsetY];
}
function isNodeInitialized(node) {
  return node && !!(node.internals.handleBounds || node.handles?.length) && !!(node.measured.width || node.width || node.initialWidth);
}
function getEdgePosition(params) {
  const { sourceNode, targetNode } = params;
  if (!isNodeInitialized(sourceNode) || !isNodeInitialized(targetNode)) {
    return null;
  }
  const sourceHandleBounds = sourceNode.internals.handleBounds || toHandleBounds(sourceNode.handles);
  const targetHandleBounds = targetNode.internals.handleBounds || toHandleBounds(targetNode.handles);
  const sourceHandle = getHandle$1(sourceHandleBounds?.source ?? [], params.sourceHandle);
  const targetHandle = getHandle$1(
    // when connection type is loose we can define all handles as sources and connect source -> source
    params.connectionMode === ConnectionMode.Strict ? targetHandleBounds?.target ?? [] : (targetHandleBounds?.target ?? []).concat(targetHandleBounds?.source ?? []),
    params.targetHandle
  );
  if (!sourceHandle || !targetHandle) {
    params.onError?.("008", errorMessages["error008"](!sourceHandle ? "source" : "target", {
      id: params.id,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle
    }));
    return null;
  }
  const sourcePosition = sourceHandle?.position || Position.Bottom;
  const targetPosition = targetHandle?.position || Position.Top;
  const source2 = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
  const target = getHandlePosition(targetNode, targetHandle, targetPosition);
  return {
    sourceX: source2.x,
    sourceY: source2.y,
    targetX: target.x,
    targetY: target.y,
    sourcePosition,
    targetPosition
  };
}
function toHandleBounds(handles) {
  if (!handles) {
    return null;
  }
  const source2 = [];
  const target = [];
  for (const handle of handles) {
    handle.width = handle.width ?? 1;
    handle.height = handle.height ?? 1;
    if (handle.type === "source") {
      source2.push(handle);
    } else if (handle.type === "target") {
      target.push(handle);
    }
  }
  return {
    source: source2,
    target
  };
}
function getHandlePosition(node, handle, fallbackPosition = Position.Left, center = false) {
  const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
  const y2 = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
  const { width, height } = handle ?? getNodeDimensions(node);
  if (center) {
    return { x: x + width / 2, y: y2 + height / 2 };
  }
  const position = handle?.position ?? fallbackPosition;
  switch (position) {
    case Position.Top:
      return { x: x + width / 2, y: y2 };
    case Position.Right:
      return { x: x + width, y: y2 + height / 2 };
    case Position.Bottom:
      return { x: x + width / 2, y: y2 + height };
    case Position.Left:
      return { x, y: y2 + height / 2 };
  }
}
function getHandle$1(bounds, handleId) {
  if (!bounds) {
    return null;
  }
  return (!handleId ? bounds[0] : bounds.find((d) => d.id === handleId)) || null;
}
function getMarkerId(marker, id2) {
  if (!marker) {
    return "";
  }
  if (typeof marker === "string") {
    return marker;
  }
  const idPrefix = id2 ? `${id2}__` : "";
  return `${idPrefix}${Object.keys(marker).sort().map((key3) => `${key3}=${marker[key3]}`).join("&")}`;
}
function createMarkerIds(edges, { id: id2, defaultColor, defaultMarkerStart, defaultMarkerEnd }) {
  const ids = /* @__PURE__ */ new Set();
  return edges.reduce((markers, edge) => {
    [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
      if (marker && typeof marker === "object") {
        const markerId = getMarkerId(marker, id2);
        if (!ids.has(markerId)) {
          markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
          ids.add(markerId);
        }
      }
    });
    return markers;
  }, []).sort((a, b) => a.id.localeCompare(b.id));
}
var SELECTED_NODE_Z = 1e3;
var ROOT_PARENT_Z_INCREMENT = 10;
var defaultOptions = {
  nodeOrigin: [0, 0],
  nodeExtent: infiniteExtent,
  elevateNodesOnSelect: true,
  zIndexMode: "basic",
  defaults: {}
};
var adoptUserNodesDefaultOptions = {
  ...defaultOptions,
  checkEquality: true
};
function mergeObjects(base, incoming) {
  const result = { ...base };
  for (const key3 in incoming) {
    if (incoming[key3] !== void 0) {
      result[key3] = incoming[key3];
    }
  }
  return result;
}
function updateAbsolutePositions(nodeLookup, parentLookup, options) {
  const _options = mergeObjects(defaultOptions, options);
  for (const node of nodeLookup.values()) {
    if (node.parentId) {
      updateChildNode(node, nodeLookup, parentLookup, _options);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(node, _options.nodeOrigin);
      const extent = isCoordinateExtent(node.extent) ? node.extent : _options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(node));
      node.internals.positionAbsolute = clampedPosition;
    }
  }
}
function parseHandles(userNode, internalNode) {
  if (!userNode.handles) {
    return !userNode.measured ? void 0 : internalNode?.internals.handleBounds;
  }
  const source2 = [];
  const target = [];
  for (const handle of userNode.handles) {
    const handleBounds = {
      id: handle.id,
      width: handle.width ?? 1,
      height: handle.height ?? 1,
      nodeId: userNode.id,
      x: handle.x,
      y: handle.y,
      position: handle.position,
      type: handle.type
    };
    if (handle.type === "source") {
      source2.push(handleBounds);
    } else if (handle.type === "target") {
      target.push(handleBounds);
    }
  }
  return {
    source: source2,
    target
  };
}
function isManualZIndexMode(zIndexMode) {
  return zIndexMode === "manual";
}
function adoptUserNodes(nodes, nodeLookup, parentLookup, options = {}) {
  const _options = mergeObjects(adoptUserNodesDefaultOptions, options);
  const rootParentIndex = { i: 0 };
  const tmpLookup = new Map(nodeLookup);
  const selectedNodeZ = _options?.elevateNodesOnSelect && !isManualZIndexMode(_options.zIndexMode) ? SELECTED_NODE_Z : 0;
  let nodesInitialized = nodes.length > 0;
  nodeLookup.clear();
  parentLookup.clear();
  for (const userNode of nodes) {
    let internalNode = tmpLookup.get(userNode.id);
    if (_options.checkEquality && userNode === internalNode?.internals.userNode) {
      nodeLookup.set(userNode.id, internalNode);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(userNode, _options.nodeOrigin);
      const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : _options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));
      internalNode = {
        ..._options.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height
        },
        internals: {
          positionAbsolute: clampedPosition,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: parseHandles(userNode, internalNode),
          z: calculateZ(userNode, selectedNodeZ, _options.zIndexMode),
          userNode
        }
      };
      nodeLookup.set(userNode.id, internalNode);
    }
    if ((internalNode.measured === void 0 || internalNode.measured.width === void 0 || internalNode.measured.height === void 0) && !internalNode.hidden) {
      nodesInitialized = false;
    }
    if (userNode.parentId) {
      updateChildNode(internalNode, nodeLookup, parentLookup, options, rootParentIndex);
    }
  }
  return nodesInitialized;
}
function updateParentLookup(node, parentLookup) {
  if (!node.parentId) {
    return;
  }
  const childNodes = parentLookup.get(node.parentId);
  if (childNodes) {
    childNodes.set(node.id, node);
  } else {
    parentLookup.set(node.parentId, /* @__PURE__ */ new Map([[node.id, node]]));
  }
}
function updateChildNode(node, nodeLookup, parentLookup, options, rootParentIndex) {
  const { elevateNodesOnSelect, nodeOrigin, nodeExtent, zIndexMode } = mergeObjects(defaultOptions, options);
  const parentId = node.parentId;
  const parentNode = nodeLookup.get(parentId);
  if (!parentNode) {
    console.warn(`Parent node ${parentId} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  updateParentLookup(node, parentLookup);
  if (rootParentIndex && !parentNode.parentId && parentNode.internals.rootParentIndex === void 0 && zIndexMode === "auto") {
    parentNode.internals.rootParentIndex = ++rootParentIndex.i;
    parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
  }
  if (rootParentIndex && parentNode.internals.rootParentIndex !== void 0) {
    rootParentIndex.i = parentNode.internals.rootParentIndex;
  }
  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const { x, y: y2, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
  const { positionAbsolute } = node.internals;
  const positionChanged = x !== positionAbsolute.x || y2 !== positionAbsolute.y;
  if (positionChanged || z !== node.internals.z) {
    nodeLookup.set(node.id, {
      ...node,
      internals: {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y: y2 } : positionAbsolute,
        z
      }
    });
  }
}
function calculateZ(node, selectedNodeZ, zIndexMode) {
  const zIndex = isNumeric(node.zIndex) ? node.zIndex : 0;
  if (isManualZIndexMode(zIndexMode)) {
    return zIndex;
  }
  return zIndex + (node.selected ? selectedNodeZ : 0);
}
function calculateChildXYZ(childNode, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode) {
  const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
  const childDimensions = getNodeDimensions(childNode);
  const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
  const clampedPosition = isCoordinateExtent(childNode.extent) ? clampPosition(positionWithOrigin, childNode.extent, childDimensions) : positionWithOrigin;
  let absolutePosition = clampPosition({ x: parentX + clampedPosition.x, y: parentY + clampedPosition.y }, nodeExtent, childDimensions);
  if (childNode.extent === "parent") {
    absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
  }
  const childZ = calculateZ(childNode, selectedNodeZ, zIndexMode);
  const parentZ = parentNode.internals.z ?? 0;
  return {
    x: absolutePosition.x,
    y: absolutePosition.y,
    z: parentZ >= childZ ? parentZ + 1 : childZ
  };
}
function handleExpandParent(children2, nodeLookup, parentLookup, nodeOrigin = [0, 0]) {
  const changes = [];
  const parentExpansions = /* @__PURE__ */ new Map();
  for (const child2 of children2) {
    const parent = nodeLookup.get(child2.parentId);
    if (!parent) {
      continue;
    }
    const parentRect = parentExpansions.get(child2.parentId)?.expandedRect ?? nodeToRect(parent);
    const expandedRect = getBoundsOfRects(parentRect, child2.rect);
    parentExpansions.set(child2.parentId, { expandedRect, parent });
  }
  if (parentExpansions.size > 0) {
    parentExpansions.forEach(({ expandedRect, parent }, parentId) => {
      const positionAbsolute = parent.internals.positionAbsolute;
      const dimensions = getNodeDimensions(parent);
      const origin = parent.origin ?? nodeOrigin;
      const xChange = expandedRect.x < positionAbsolute.x ? Math.round(Math.abs(positionAbsolute.x - expandedRect.x)) : 0;
      const yChange = expandedRect.y < positionAbsolute.y ? Math.round(Math.abs(positionAbsolute.y - expandedRect.y)) : 0;
      const newWidth = Math.max(dimensions.width, Math.round(expandedRect.width));
      const newHeight = Math.max(dimensions.height, Math.round(expandedRect.height));
      const widthChange = (newWidth - dimensions.width) * origin[0];
      const heightChange = (newHeight - dimensions.height) * origin[1];
      if (xChange > 0 || yChange > 0 || widthChange || heightChange) {
        changes.push({
          id: parentId,
          type: "position",
          position: {
            x: parent.position.x - xChange + widthChange,
            y: parent.position.y - yChange + heightChange
          }
        });
        parentLookup.get(parentId)?.forEach((childNode) => {
          if (!children2.some((child2) => child2.id === childNode.id)) {
            changes.push({
              id: childNode.id,
              type: "position",
              position: {
                x: childNode.position.x + xChange,
                y: childNode.position.y + yChange
              }
            });
          }
        });
      }
      if (dimensions.width < expandedRect.width || dimensions.height < expandedRect.height || xChange || yChange) {
        changes.push({
          id: parentId,
          type: "dimensions",
          setAttributes: true,
          dimensions: {
            width: newWidth + (xChange ? origin[0] * xChange - widthChange : 0),
            height: newHeight + (yChange ? origin[1] * yChange - heightChange : 0)
          }
        });
      }
    });
  }
  return changes;
}
function updateNodeInternals(updates, nodeLookup, parentLookup, domNode, nodeOrigin, nodeExtent, zIndexMode) {
  const viewportNode = domNode?.querySelector(".xyflow__viewport");
  let updatedInternals = false;
  if (!viewportNode) {
    return { changes: [], updatedInternals };
  }
  const changes = [];
  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom2 } = new window.DOMMatrixReadOnly(style.transform);
  const parentExpandChildren = [];
  for (const update2 of updates.values()) {
    const node = nodeLookup.get(update2.id);
    if (!node) {
      continue;
    }
    if (node.hidden) {
      nodeLookup.set(node.id, {
        ...node,
        internals: {
          ...node.internals,
          handleBounds: void 0
        }
      });
      updatedInternals = true;
      continue;
    }
    const dimensions = getDimensions(update2.nodeElement);
    const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
    const doUpdate = !!(dimensions.width && dimensions.height && (dimensionChanged || !node.internals.handleBounds || update2.force));
    if (doUpdate) {
      const nodeBounds = update2.nodeElement.getBoundingClientRect();
      const extent = isCoordinateExtent(node.extent) ? node.extent : nodeExtent;
      let { positionAbsolute } = node.internals;
      if (node.parentId && node.extent === "parent") {
        positionAbsolute = clampPositionToParent(positionAbsolute, dimensions, nodeLookup.get(node.parentId));
      } else if (extent) {
        positionAbsolute = clampPosition(positionAbsolute, extent, dimensions);
      }
      const newNode = {
        ...node,
        measured: dimensions,
        internals: {
          ...node.internals,
          positionAbsolute,
          handleBounds: {
            source: getHandleBounds("source", update2.nodeElement, nodeBounds, zoom2, node.id),
            target: getHandleBounds("target", update2.nodeElement, nodeBounds, zoom2, node.id)
          }
        }
      };
      nodeLookup.set(node.id, newNode);
      if (node.parentId) {
        updateChildNode(newNode, nodeLookup, parentLookup, { nodeOrigin, zIndexMode });
      }
      updatedInternals = true;
      if (dimensionChanged) {
        changes.push({
          id: node.id,
          type: "dimensions",
          dimensions
        });
        if (node.expandParent && node.parentId) {
          parentExpandChildren.push({
            id: node.id,
            parentId: node.parentId,
            rect: nodeToRect(newNode, nodeOrigin)
          });
        }
      }
    }
  }
  if (parentExpandChildren.length > 0) {
    const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
    changes.push(...parentExpandChanges);
  }
  return { changes, updatedInternals };
}
async function panBy({ delta, panZoom, transform: transform2, translateExtent, width, height }) {
  if (!panZoom || !delta.x && !delta.y) {
    return Promise.resolve(false);
  }
  const nextViewport = await panZoom.setViewportConstrained({
    x: transform2[0] + delta.x,
    y: transform2[1] + delta.y,
    zoom: transform2[2]
  }, [
    [0, 0],
    [width, height]
  ], translateExtent);
  const transformChanged = !!nextViewport && (nextViewport.x !== transform2[0] || nextViewport.y !== transform2[1] || nextViewport.k !== transform2[2]);
  return Promise.resolve(transformChanged);
}
function addConnectionToLookup(type, connection, connectionKey, connectionLookup, nodeId, handleId) {
  let key3 = nodeId;
  const nodeMap = connectionLookup.get(key3) || /* @__PURE__ */ new Map();
  connectionLookup.set(key3, nodeMap.set(connectionKey, connection));
  key3 = `${nodeId}-${type}`;
  const typeMap = connectionLookup.get(key3) || /* @__PURE__ */ new Map();
  connectionLookup.set(key3, typeMap.set(connectionKey, connection));
  if (handleId) {
    key3 = `${nodeId}-${type}-${handleId}`;
    const handleMap = connectionLookup.get(key3) || /* @__PURE__ */ new Map();
    connectionLookup.set(key3, handleMap.set(connectionKey, connection));
  }
}
function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
  connectionLookup.clear();
  edgeLookup.clear();
  for (const edge of edges) {
    const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;
    const connection = { edgeId: edge.id, source: sourceNode, target: targetNode, sourceHandle, targetHandle };
    const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
    const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;
    addConnectionToLookup("source", connection, targetKey, connectionLookup, sourceNode, sourceHandle);
    addConnectionToLookup("target", connection, sourceKey, connectionLookup, targetNode, targetHandle);
    edgeLookup.set(edge.id, edge);
  }
}
function isParentSelected(node, nodeLookup) {
  if (!node.parentId) {
    return false;
  }
  const parentNode = nodeLookup.get(node.parentId);
  if (!parentNode) {
    return false;
  }
  if (parentNode.selected) {
    return true;
  }
  return isParentSelected(parentNode, nodeLookup);
}
function hasSelector(target, selector, domNode) {
  let current = target;
  do {
    if (current?.matches?.(selector))
      return true;
    if (current === domNode)
      return false;
    current = current?.parentElement;
  } while (current);
  return false;
}
function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId) {
  const dragItems = /* @__PURE__ */ new Map();
  for (const [id2, node] of nodeLookup) {
    if ((node.selected || node.id === nodeId) && (!node.parentId || !isParentSelected(node, nodeLookup)) && (node.draggable || nodesDraggable && typeof node.draggable === "undefined")) {
      const internalNode = nodeLookup.get(id2);
      if (internalNode) {
        dragItems.set(id2, {
          id: id2,
          position: internalNode.position || { x: 0, y: 0 },
          distance: {
            x: mousePos.x - internalNode.internals.positionAbsolute.x,
            y: mousePos.y - internalNode.internals.positionAbsolute.y
          },
          extent: internalNode.extent,
          parentId: internalNode.parentId,
          origin: internalNode.origin,
          expandParent: internalNode.expandParent,
          internals: {
            positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 }
          },
          measured: {
            width: internalNode.measured.width ?? 0,
            height: internalNode.measured.height ?? 0
          }
        });
      }
    }
  }
  return dragItems;
}
function getEventHandlerParams({ nodeId, dragItems, nodeLookup, dragging = true }) {
  const nodesFromDragItems = [];
  for (const [id2, dragItem] of dragItems) {
    const node2 = nodeLookup.get(id2)?.internals.userNode;
    if (node2) {
      nodesFromDragItems.push({
        ...node2,
        position: dragItem.position,
        dragging
      });
    }
  }
  if (!nodeId) {
    return [nodesFromDragItems[0], nodesFromDragItems];
  }
  const node = nodeLookup.get(nodeId)?.internals.userNode;
  return [
    !node ? nodesFromDragItems[0] : {
      ...node,
      position: dragItems.get(nodeId)?.position || node.position,
      dragging
    },
    nodesFromDragItems
  ];
}
function calculateSnapOffset({ dragItems, snapGrid, x, y: y2 }) {
  const refDragItem = dragItems.values().next().value;
  if (!refDragItem) {
    return null;
  }
  const refPos = {
    x: x - refDragItem.distance.x,
    y: y2 - refDragItem.distance.y
  };
  const refPosSnapped = snapPosition(refPos, snapGrid);
  return {
    x: refPosSnapped.x - refPos.x,
    y: refPosSnapped.y - refPos.y
  };
}
function XYDrag({ onNodeMouseDown, getStoreItems, onDragStart, onDrag, onDragStop }) {
  let lastPos = { x: null, y: null };
  let autoPanId = 0;
  let dragItems = /* @__PURE__ */ new Map();
  let autoPanStarted = false;
  let mousePosition = { x: 0, y: 0 };
  let containerBounds = null;
  let dragStarted = false;
  let d3Selection = null;
  let abortDrag = false;
  let nodePositionsChanged = false;
  let dragEvent = null;
  function update2({ noDragClassName, handleSelector, domNode, isSelectable, nodeId, nodeClickDistance = 0 }) {
    d3Selection = select_default2(domNode);
    function updateNodes({ x, y: y2 }) {
      const { nodeLookup, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onNodeDrag, onSelectionDrag, onError, updateNodePositions } = getStoreItems();
      lastPos = { x, y: y2 };
      let hasChange = false;
      const isMultiDrag = dragItems.size > 1;
      const nodesBox = isMultiDrag && nodeExtent ? rectToBox(getInternalNodesBounds(dragItems)) : null;
      const multiDragSnapOffset = isMultiDrag && snapToGrid ? calculateSnapOffset({
        dragItems,
        snapGrid,
        x,
        y: y2
      }) : null;
      for (const [id2, dragItem] of dragItems) {
        if (!nodeLookup.has(id2)) {
          continue;
        }
        let nextPosition = { x: x - dragItem.distance.x, y: y2 - dragItem.distance.y };
        if (snapToGrid) {
          nextPosition = multiDragSnapOffset ? {
            x: Math.round(nextPosition.x + multiDragSnapOffset.x),
            y: Math.round(nextPosition.y + multiDragSnapOffset.y)
          } : snapPosition(nextPosition, snapGrid);
        }
        let adjustedNodeExtent = null;
        if (isMultiDrag && nodeExtent && !dragItem.extent && nodesBox) {
          const { positionAbsolute: positionAbsolute2 } = dragItem.internals;
          const x1 = positionAbsolute2.x - nodesBox.x + nodeExtent[0][0];
          const x2 = positionAbsolute2.x + dragItem.measured.width - nodesBox.x2 + nodeExtent[1][0];
          const y1 = positionAbsolute2.y - nodesBox.y + nodeExtent[0][1];
          const y22 = positionAbsolute2.y + dragItem.measured.height - nodesBox.y2 + nodeExtent[1][1];
          adjustedNodeExtent = [
            [x1, y1],
            [x2, y22]
          ];
        }
        const { position, positionAbsolute } = calculateNodePosition({
          nodeId: id2,
          nextPosition,
          nodeLookup,
          nodeExtent: adjustedNodeExtent ? adjustedNodeExtent : nodeExtent,
          nodeOrigin,
          onError
        });
        hasChange = hasChange || dragItem.position.x !== position.x || dragItem.position.y !== position.y;
        dragItem.position = position;
        dragItem.internals.positionAbsolute = positionAbsolute;
      }
      nodePositionsChanged = nodePositionsChanged || hasChange;
      if (!hasChange) {
        return;
      }
      updateNodePositions(dragItems, true);
      if (dragEvent && (onDrag || onNodeDrag || !nodeId && onSelectionDrag)) {
        const [currentNode, currentNodes] = getEventHandlerParams({
          nodeId,
          dragItems,
          nodeLookup
        });
        onDrag?.(dragEvent, dragItems, currentNode, currentNodes);
        onNodeDrag?.(dragEvent, currentNode, currentNodes);
        if (!nodeId) {
          onSelectionDrag?.(dragEvent, currentNodes);
        }
      }
    }
    async function autoPan() {
      if (!containerBounds) {
        return;
      }
      const { transform: transform2, panBy: panBy2, autoPanSpeed, autoPanOnNodeDrag } = getStoreItems();
      if (!autoPanOnNodeDrag) {
        autoPanStarted = false;
        cancelAnimationFrame(autoPanId);
        return;
      }
      const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds, autoPanSpeed);
      if (xMovement !== 0 || yMovement !== 0) {
        lastPos.x = (lastPos.x ?? 0) - xMovement / transform2[2];
        lastPos.y = (lastPos.y ?? 0) - yMovement / transform2[2];
        if (await panBy2({ x: xMovement, y: yMovement })) {
          updateNodes(lastPos);
        }
      }
      autoPanId = requestAnimationFrame(autoPan);
    }
    function startDrag(event2) {
      const { nodeLookup, multiSelectionActive, nodesDraggable, transform: transform2, snapGrid, snapToGrid, selectNodesOnDrag, onNodeDragStart, onSelectionDragStart, unselectNodesAndEdges } = getStoreItems();
      dragStarted = true;
      if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
        if (!nodeLookup.get(nodeId)?.selected) {
          unselectNodesAndEdges();
        }
      }
      if (isSelectable && selectNodesOnDrag && nodeId) {
        onNodeMouseDown?.(nodeId);
      }
      const pointerPos = getPointerPosition(event2.sourceEvent, { transform: transform2, snapGrid, snapToGrid, containerBounds });
      lastPos = pointerPos;
      dragItems = getDragItems(nodeLookup, nodesDraggable, pointerPos, nodeId);
      if (dragItems.size > 0 && (onDragStart || onNodeDragStart || !nodeId && onSelectionDragStart)) {
        const [currentNode, currentNodes] = getEventHandlerParams({
          nodeId,
          dragItems,
          nodeLookup
        });
        onDragStart?.(event2.sourceEvent, dragItems, currentNode, currentNodes);
        onNodeDragStart?.(event2.sourceEvent, currentNode, currentNodes);
        if (!nodeId) {
          onSelectionDragStart?.(event2.sourceEvent, currentNodes);
        }
      }
    }
    const d3DragInstance = drag_default().clickDistance(nodeClickDistance).on("start", (event2) => {
      const { domNode: domNode2, nodeDragThreshold, transform: transform2, snapGrid, snapToGrid } = getStoreItems();
      containerBounds = domNode2?.getBoundingClientRect() || null;
      abortDrag = false;
      nodePositionsChanged = false;
      dragEvent = event2.sourceEvent;
      if (nodeDragThreshold === 0) {
        startDrag(event2);
      }
      const pointerPos = getPointerPosition(event2.sourceEvent, { transform: transform2, snapGrid, snapToGrid, containerBounds });
      lastPos = pointerPos;
      mousePosition = getEventPosition(event2.sourceEvent, containerBounds);
    }).on("drag", (event2) => {
      const { autoPanOnNodeDrag, transform: transform2, snapGrid, snapToGrid, nodeDragThreshold, nodeLookup } = getStoreItems();
      const pointerPos = getPointerPosition(event2.sourceEvent, { transform: transform2, snapGrid, snapToGrid, containerBounds });
      dragEvent = event2.sourceEvent;
      if (event2.sourceEvent.type === "touchmove" && event2.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      nodeId && !nodeLookup.has(nodeId)) {
        abortDrag = true;
      }
      if (abortDrag) {
        return;
      }
      if (!autoPanStarted && autoPanOnNodeDrag && dragStarted) {
        autoPanStarted = true;
        autoPan();
      }
      if (!dragStarted) {
        const currentMousePosition = getEventPosition(event2.sourceEvent, containerBounds);
        const x = currentMousePosition.x - mousePosition.x;
        const y2 = currentMousePosition.y - mousePosition.y;
        const distance2 = Math.sqrt(x * x + y2 * y2);
        if (distance2 > nodeDragThreshold) {
          startDrag(event2);
        }
      }
      if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems && dragStarted) {
        mousePosition = getEventPosition(event2.sourceEvent, containerBounds);
        updateNodes(pointerPos);
      }
    }).on("end", (event2) => {
      if (!dragStarted || abortDrag) {
        return;
      }
      autoPanStarted = false;
      dragStarted = false;
      cancelAnimationFrame(autoPanId);
      if (dragItems.size > 0) {
        const { nodeLookup, updateNodePositions, onNodeDragStop, onSelectionDragStop } = getStoreItems();
        if (nodePositionsChanged) {
          updateNodePositions(dragItems, false);
          nodePositionsChanged = false;
        }
        if (onDragStop || onNodeDragStop || !nodeId && onSelectionDragStop) {
          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodeLookup,
            dragging: false
          });
          onDragStop?.(event2.sourceEvent, dragItems, currentNode, currentNodes);
          onNodeDragStop?.(event2.sourceEvent, currentNode, currentNodes);
          if (!nodeId) {
            onSelectionDragStop?.(event2.sourceEvent, currentNodes);
          }
        }
      }
    }).filter((event2) => {
      const target = event2.target;
      const isDraggable = !event2.button && (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, domNode)) && (!handleSelector || hasSelector(target, handleSelector, domNode));
      return isDraggable;
    });
    d3Selection.call(d3DragInstance);
  }
  function destroy() {
    d3Selection?.on(".drag", null);
  }
  return {
    update: update2,
    destroy
  };
}
function getNodesWithinDistance(position, nodeLookup, distance2) {
  const nodes = [];
  const rect = {
    x: position.x - distance2,
    y: position.y - distance2,
    width: distance2 * 2,
    height: distance2 * 2
  };
  for (const node of nodeLookup.values()) {
    if (getOverlappingArea(rect, nodeToRect(node)) > 0) {
      nodes.push(node);
    }
  }
  return nodes;
}
var ADDITIONAL_DISTANCE = 250;
function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
  let closestHandles = [];
  let minDistance = Infinity;
  const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + ADDITIONAL_DISTANCE);
  for (const node of closeNodes) {
    const allHandles = [...node.internals.handleBounds?.source ?? [], ...node.internals.handleBounds?.target ?? []];
    for (const handle of allHandles) {
      if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
        continue;
      }
      const { x, y: y2 } = getHandlePosition(node, handle, handle.position, true);
      const distance2 = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y2 - position.y, 2));
      if (distance2 > connectionRadius) {
        continue;
      }
      if (distance2 < minDistance) {
        closestHandles = [{ ...handle, x, y: y2 }];
        minDistance = distance2;
      } else if (distance2 === minDistance) {
        closestHandles.push({ ...handle, x, y: y2 });
      }
    }
  }
  if (!closestHandles.length) {
    return null;
  }
  if (closestHandles.length > 1) {
    const oppositeHandleType = fromHandle.type === "source" ? "target" : "source";
    return closestHandles.find((handle) => handle.type === oppositeHandleType) ?? closestHandles[0];
  }
  return closestHandles[0];
}
function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
  const node = nodeLookup.get(nodeId);
  if (!node) {
    return null;
  }
  const handles = connectionMode === "strict" ? node.internals.handleBounds?.[handleType] : [...node.internals.handleBounds?.source ?? [], ...node.internals.handleBounds?.target ?? []];
  const handle = (handleId ? handles?.find((h) => h.id === handleId) : handles?.[0]) ?? null;
  return handle && withAbsolutePosition ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) } : handle;
}
function getHandleType(edgeUpdaterType, handleDomNode) {
  if (edgeUpdaterType) {
    return edgeUpdaterType;
  } else if (handleDomNode?.classList.contains("target")) {
    return "target";
  } else if (handleDomNode?.classList.contains("source")) {
    return "source";
  }
  return null;
}
function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
  let isValid = null;
  if (isHandleValid) {
    isValid = true;
  } else if (isInsideConnectionRadius && !isHandleValid) {
    isValid = false;
  }
  return isValid;
}
var alwaysValid = () => true;
function onPointerDown(event2, { connectionMode, connectionRadius, handleId, nodeId, edgeUpdaterType, isTarget, domNode, nodeLookup, lib, autoPanOnConnect, flowId, panBy: panBy2, cancelConnection, onConnectStart, onConnect, onConnectEnd, isValidConnection = alwaysValid, onReconnectEnd, updateConnection, getTransform, getFromHandle, autoPanSpeed, dragThreshold = 1, handleDomNode }) {
  const doc = getHostForElement(event2.target);
  let autoPanId = 0;
  let closestHandle;
  const { x, y: y2 } = getEventPosition(event2);
  const handleType = getHandleType(edgeUpdaterType, handleDomNode);
  const containerBounds = domNode?.getBoundingClientRect();
  let connectionStarted = false;
  if (!containerBounds || !handleType) {
    return;
  }
  const fromHandleInternal = getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode);
  if (!fromHandleInternal) {
    return;
  }
  let position = getEventPosition(event2, containerBounds);
  let autoPanStarted = false;
  let connection = null;
  let isValid = false;
  let resultHandleDomNode = null;
  function autoPan() {
    if (!autoPanOnConnect || !containerBounds) {
      return;
    }
    const [x2, y3] = calcAutoPan(position, containerBounds, autoPanSpeed);
    panBy2({ x: x2, y: y3 });
    autoPanId = requestAnimationFrame(autoPan);
  }
  const fromHandle = {
    ...fromHandleInternal,
    nodeId,
    type: handleType,
    position: fromHandleInternal.position
  };
  const fromInternalNode = nodeLookup.get(nodeId);
  const from = getHandlePosition(fromInternalNode, fromHandle, Position.Left, true);
  let previousConnection = {
    inProgress: true,
    isValid: null,
    from,
    fromHandle,
    fromPosition: fromHandle.position,
    fromNode: fromInternalNode,
    to: position,
    toHandle: null,
    toPosition: oppositePosition[fromHandle.position],
    toNode: null,
    pointer: position
  };
  function startConnection() {
    connectionStarted = true;
    updateConnection(previousConnection);
    onConnectStart?.(event2, { nodeId, handleId, handleType });
  }
  if (dragThreshold === 0) {
    startConnection();
  }
  function onPointerMove(event3) {
    if (!connectionStarted) {
      const { x: evtX, y: evtY } = getEventPosition(event3);
      const dx = evtX - x;
      const dy = evtY - y2;
      const nextConnectionStarted = dx * dx + dy * dy > dragThreshold * dragThreshold;
      if (!nextConnectionStarted) {
        return;
      }
      startConnection();
    }
    if (!getFromHandle() || !fromHandle) {
      onPointerUp(event3);
      return;
    }
    const transform2 = getTransform();
    position = getEventPosition(event3, containerBounds);
    closestHandle = getClosestHandle(pointToRendererPoint(position, transform2, false, [1, 1]), connectionRadius, nodeLookup, fromHandle);
    if (!autoPanStarted) {
      autoPan();
      autoPanStarted = true;
    }
    const result = isValidHandle(event3, {
      handle: closestHandle,
      connectionMode,
      fromNodeId: nodeId,
      fromHandleId: handleId,
      fromType: isTarget ? "target" : "source",
      isValidConnection,
      doc,
      lib,
      flowId,
      nodeLookup
    });
    resultHandleDomNode = result.handleDomNode;
    connection = result.connection;
    isValid = isConnectionValid(!!closestHandle, result.isValid);
    const fromInternalNode2 = nodeLookup.get(nodeId);
    const from2 = fromInternalNode2 ? getHandlePosition(fromInternalNode2, fromHandle, Position.Left, true) : previousConnection.from;
    const newConnection = {
      ...previousConnection,
      from: from2,
      isValid,
      to: result.toHandle && isValid ? rendererPointToPoint({ x: result.toHandle.x, y: result.toHandle.y }, transform2) : position,
      toHandle: result.toHandle,
      toPosition: isValid && result.toHandle ? result.toHandle.position : oppositePosition[fromHandle.position],
      toNode: result.toHandle ? nodeLookup.get(result.toHandle.nodeId) : null,
      pointer: position
    };
    updateConnection(newConnection);
    previousConnection = newConnection;
  }
  function onPointerUp(event3) {
    if ("touches" in event3 && event3.touches.length > 0) {
      return;
    }
    if (connectionStarted) {
      if ((closestHandle || resultHandleDomNode) && connection && isValid) {
        onConnect?.(connection);
      }
      const { inProgress, ...connectionState } = previousConnection;
      const finalConnectionState = {
        ...connectionState,
        toPosition: previousConnection.toHandle ? previousConnection.toPosition : null
      };
      onConnectEnd?.(event3, finalConnectionState);
      if (edgeUpdaterType) {
        onReconnectEnd?.(event3, finalConnectionState);
      }
    }
    cancelConnection();
    cancelAnimationFrame(autoPanId);
    autoPanStarted = false;
    isValid = false;
    connection = null;
    resultHandleDomNode = null;
    doc.removeEventListener("mousemove", onPointerMove);
    doc.removeEventListener("mouseup", onPointerUp);
    doc.removeEventListener("touchmove", onPointerMove);
    doc.removeEventListener("touchend", onPointerUp);
  }
  doc.addEventListener("mousemove", onPointerMove);
  doc.addEventListener("mouseup", onPointerUp);
  doc.addEventListener("touchmove", onPointerMove);
  doc.addEventListener("touchend", onPointerUp);
}
function isValidHandle(event2, { handle, connectionMode, fromNodeId, fromHandleId, fromType, doc, lib, flowId, isValidConnection = alwaysValid, nodeLookup }) {
  const isTarget = fromType === "target";
  const handleDomNode = handle ? doc.querySelector(`.${lib}-flow__handle[data-id="${flowId}-${handle?.nodeId}-${handle?.id}-${handle?.type}"]`) : null;
  const { x, y: y2 } = getEventPosition(event2);
  const handleBelow = doc.elementFromPoint(x, y2);
  const handleToCheck = handleBelow?.classList.contains(`${lib}-flow__handle`) ? handleBelow : handleDomNode;
  const result = {
    handleDomNode: handleToCheck,
    isValid: false,
    connection: null,
    toHandle: null
  };
  if (handleToCheck) {
    const handleType = getHandleType(void 0, handleToCheck);
    const handleNodeId = handleToCheck.getAttribute("data-nodeid");
    const handleId = handleToCheck.getAttribute("data-handleid");
    const connectable = handleToCheck.classList.contains("connectable");
    const connectableEnd = handleToCheck.classList.contains("connectableend");
    if (!handleNodeId || !handleType) {
      return result;
    }
    const connection = {
      source: isTarget ? handleNodeId : fromNodeId,
      sourceHandle: isTarget ? handleId : fromHandleId,
      target: isTarget ? fromNodeId : handleNodeId,
      targetHandle: isTarget ? fromHandleId : handleId
    };
    result.connection = connection;
    const isConnectable = connectable && connectableEnd;
    const isValid = isConnectable && (connectionMode === ConnectionMode.Strict ? isTarget && handleType === "source" || !isTarget && handleType === "target" : handleNodeId !== fromNodeId || handleId !== fromHandleId);
    result.isValid = isValid && isValidConnection(connection);
    result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);
  }
  return result;
}
var XYHandle = {
  onPointerDown,
  isValid: isValidHandle
};
function XYMinimap({ domNode, panZoom, getTransform, getViewScale }) {
  const selection2 = select_default2(domNode);
  function update2({ translateExtent, width, height, zoomStep = 1, pannable = true, zoomable = true, inversePan = false }) {
    const zoomHandler = (event2) => {
      if (event2.sourceEvent.type !== "wheel" || !panZoom) {
        return;
      }
      const transform2 = getTransform();
      const factor = event2.sourceEvent.ctrlKey && isMacOs() ? 10 : 1;
      const pinchDelta = -event2.sourceEvent.deltaY * (event2.sourceEvent.deltaMode === 1 ? 0.05 : event2.sourceEvent.deltaMode ? 1 : 2e-3) * zoomStep;
      const nextZoom = transform2[2] * Math.pow(2, pinchDelta * factor);
      panZoom.scaleTo(nextZoom);
    };
    let panStart = [0, 0];
    const panStartHandler = (event2) => {
      if (event2.sourceEvent.type === "mousedown" || event2.sourceEvent.type === "touchstart") {
        panStart = [
          event2.sourceEvent.clientX ?? event2.sourceEvent.touches[0].clientX,
          event2.sourceEvent.clientY ?? event2.sourceEvent.touches[0].clientY
        ];
      }
    };
    const panHandler = (event2) => {
      const transform2 = getTransform();
      if (event2.sourceEvent.type !== "mousemove" && event2.sourceEvent.type !== "touchmove" || !panZoom) {
        return;
      }
      const panCurrent = [
        event2.sourceEvent.clientX ?? event2.sourceEvent.touches[0].clientX,
        event2.sourceEvent.clientY ?? event2.sourceEvent.touches[0].clientY
      ];
      const panDelta = [panCurrent[0] - panStart[0], panCurrent[1] - panStart[1]];
      panStart = panCurrent;
      const moveScale = getViewScale() * Math.max(transform2[2], Math.log(transform2[2])) * (inversePan ? -1 : 1);
      const position = {
        x: transform2[0] - panDelta[0] * moveScale,
        y: transform2[1] - panDelta[1] * moveScale
      };
      const extent = [
        [0, 0],
        [width, height]
      ];
      panZoom.setViewportConstrained({
        x: position.x,
        y: position.y,
        zoom: transform2[2]
      }, extent, translateExtent);
    };
    const zoomAndPanHandler = zoom_default2().on("start", panStartHandler).on("zoom", pannable ? panHandler : null).on("zoom.wheel", zoomable ? zoomHandler : null);
    selection2.call(zoomAndPanHandler, {});
  }
  function destroy() {
    selection2.on("zoom", null);
  }
  return {
    update: update2,
    destroy,
    pointer: pointer_default
  };
}
var transformToViewport = (transform2) => ({
  x: transform2.x,
  y: transform2.y,
  zoom: transform2.k
});
var viewportToTransform = ({ x, y: y2, zoom: zoom2 }) => identity2.translate(x, y2).scale(zoom2);
var isWrappedWithClass = (event2, className) => event2.target.closest(`.${className}`);
var isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
var defaultEase = (t) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
var getD3Transition = (selection2, duration = 0, ease = defaultEase, onEnd = () => {
}) => {
  const hasDuration = typeof duration === "number" && duration > 0;
  if (!hasDuration) {
    onEnd();
  }
  return hasDuration ? selection2.transition().duration(duration).ease(ease).on("end", onEnd) : selection2;
};
var wheelDelta = (event2) => {
  const factor = event2.ctrlKey && isMacOs() ? 10 : 1;
  return -event2.deltaY * (event2.deltaMode === 1 ? 0.05 : event2.deltaMode ? 1 : 2e-3) * factor;
};
function createPanOnScrollHandler({ zoomPanValues, noWheelClassName, d3Selection, d3Zoom, panOnScrollMode, panOnScrollSpeed, zoomOnPinch, onPanZoomStart, onPanZoom, onPanZoomEnd }) {
  return (event2) => {
    if (isWrappedWithClass(event2, noWheelClassName)) {
      if (event2.ctrlKey) {
        event2.preventDefault();
      }
      return false;
    }
    event2.preventDefault();
    event2.stopImmediatePropagation();
    const currentZoom = d3Selection.property("__zoom").k || 1;
    if (event2.ctrlKey && zoomOnPinch) {
      const point = pointer_default(event2);
      const pinchDelta = wheelDelta(event2);
      const zoom2 = currentZoom * Math.pow(2, pinchDelta);
      d3Zoom.scaleTo(d3Selection, zoom2, point, event2);
      return;
    }
    const deltaNormalize = event2.deltaMode === 1 ? 20 : 1;
    let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event2.deltaX * deltaNormalize;
    let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event2.deltaY * deltaNormalize;
    if (!isMacOs() && event2.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
      deltaX = event2.deltaY * deltaNormalize;
      deltaY = 0;
    }
    d3Zoom.translateBy(
      d3Selection,
      -(deltaX / currentZoom) * panOnScrollSpeed,
      -(deltaY / currentZoom) * panOnScrollSpeed,
      // @ts-ignore
      { internal: true }
    );
    const nextViewport = transformToViewport(d3Selection.property("__zoom"));
    clearTimeout(zoomPanValues.panScrollTimeout);
    if (!zoomPanValues.isPanScrolling) {
      zoomPanValues.isPanScrolling = true;
      onPanZoomStart?.(event2, nextViewport);
    } else {
      onPanZoom?.(event2, nextViewport);
      zoomPanValues.panScrollTimeout = setTimeout(() => {
        onPanZoomEnd?.(event2, nextViewport);
        zoomPanValues.isPanScrolling = false;
      }, 150);
    }
  };
}
function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }) {
  return function(event2, d) {
    const isWheel = event2.type === "wheel";
    const preventZoom = !preventScrolling && isWheel && !event2.ctrlKey;
    const hasNoWheelClass = isWrappedWithClass(event2, noWheelClassName);
    if (event2.ctrlKey && isWheel && hasNoWheelClass) {
      event2.preventDefault();
    }
    if (preventZoom || hasNoWheelClass) {
      return null;
    }
    event2.preventDefault();
    d3ZoomHandler.call(this, event2, d);
  };
}
function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }) {
  return (event2) => {
    if (event2.sourceEvent?.internal) {
      return;
    }
    const viewport = transformToViewport(event2.transform);
    zoomPanValues.mouseButton = event2.sourceEvent?.button || 0;
    zoomPanValues.isZoomingOrPanning = true;
    zoomPanValues.prevViewport = viewport;
    if (event2.sourceEvent?.type === "mousedown") {
      onDraggingChange(true);
    }
    if (onPanZoomStart) {
      onPanZoomStart?.(event2.sourceEvent, viewport);
    }
  };
}
function createPanZoomHandler({ zoomPanValues, panOnDrag, onPaneContextMenu, onTransformChange, onPanZoom }) {
  return (event2) => {
    zoomPanValues.usedRightMouseButton = !!(onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0));
    if (!event2.sourceEvent?.sync) {
      onTransformChange([event2.transform.x, event2.transform.y, event2.transform.k]);
    }
    if (onPanZoom && !event2.sourceEvent?.internal) {
      onPanZoom?.(event2.sourceEvent, transformToViewport(event2.transform));
    }
  };
}
function createPanZoomEndHandler({ zoomPanValues, panOnDrag, panOnScroll, onDraggingChange, onPanZoomEnd, onPaneContextMenu }) {
  return (event2) => {
    if (event2.sourceEvent?.internal) {
      return;
    }
    zoomPanValues.isZoomingOrPanning = false;
    if (onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) && !zoomPanValues.usedRightMouseButton && event2.sourceEvent) {
      onPaneContextMenu(event2.sourceEvent);
    }
    zoomPanValues.usedRightMouseButton = false;
    onDraggingChange(false);
    if (onPanZoomEnd) {
      const viewport = transformToViewport(event2.transform);
      zoomPanValues.prevViewport = viewport;
      clearTimeout(zoomPanValues.timerId);
      zoomPanValues.timerId = setTimeout(
        () => {
          onPanZoomEnd?.(event2.sourceEvent, viewport);
        },
        // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
        panOnScroll ? 150 : 0
      );
    }
  };
}
function createFilter({ zoomActivationKeyPressed, zoomOnScroll, zoomOnPinch, panOnDrag, panOnScroll, zoomOnDoubleClick, userSelectionActive, noWheelClassName, noPanClassName, lib, connectionInProgress }) {
  return (event2) => {
    const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
    const pinchZoom = zoomOnPinch && event2.ctrlKey;
    const isWheelEvent = event2.type === "wheel";
    if (event2.button === 1 && event2.type === "mousedown" && (isWrappedWithClass(event2, `${lib}-flow__node`) || isWrappedWithClass(event2, `${lib}-flow__edge`))) {
      return true;
    }
    if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
      return false;
    }
    if (userSelectionActive) {
      return false;
    }
    if (connectionInProgress && !isWheelEvent) {
      return false;
    }
    if (isWrappedWithClass(event2, noWheelClassName) && isWheelEvent) {
      return false;
    }
    if (isWrappedWithClass(event2, noPanClassName) && (!isWheelEvent || panOnScroll && isWheelEvent && !zoomActivationKeyPressed)) {
      return false;
    }
    if (!zoomOnPinch && event2.ctrlKey && isWheelEvent) {
      return false;
    }
    if (!zoomOnPinch && event2.type === "touchstart" && event2.touches?.length > 1) {
      event2.preventDefault();
      return false;
    }
    if (!zoomScroll && !panOnScroll && !pinchZoom && isWheelEvent) {
      return false;
    }
    if (!panOnDrag && (event2.type === "mousedown" || event2.type === "touchstart")) {
      return false;
    }
    if (Array.isArray(panOnDrag) && !panOnDrag.includes(event2.button) && event2.type === "mousedown") {
      return false;
    }
    const buttonAllowed = Array.isArray(panOnDrag) && panOnDrag.includes(event2.button) || !event2.button || event2.button <= 1;
    return (!event2.ctrlKey || isWheelEvent) && buttonAllowed;
  };
}
function XYPanZoom({ domNode, minZoom, maxZoom, translateExtent, viewport, onPanZoom, onPanZoomStart, onPanZoomEnd, onDraggingChange }) {
  const zoomPanValues = {
    isZoomingOrPanning: false,
    usedRightMouseButton: false,
    prevViewport: { x: 0, y: 0, zoom: 0 },
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: false
  };
  const bbox = domNode.getBoundingClientRect();
  const d3ZoomInstance = zoom_default2().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
  const d3Selection = select_default2(domNode).call(d3ZoomInstance);
  setViewportConstrained({
    x: viewport.x,
    y: viewport.y,
    zoom: clamp(viewport.zoom, minZoom, maxZoom)
  }, [
    [0, 0],
    [bbox.width, bbox.height]
  ], translateExtent);
  const d3ZoomHandler = d3Selection.on("wheel.zoom");
  const d3DblClickZoomHandler = d3Selection.on("dblclick.zoom");
  d3ZoomInstance.wheelDelta(wheelDelta);
  function setTransform(transform2, options) {
    if (d3Selection) {
      return new Promise((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === "linear" ? value_default : zoom_default).transform(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), transform2);
      });
    }
    return Promise.resolve(false);
  }
  function update2({ noWheelClassName, noPanClassName, onPaneContextMenu, userSelectionActive, panOnScroll, panOnDrag, panOnScrollMode, panOnScrollSpeed, preventScrolling, zoomOnPinch, zoomOnScroll, zoomOnDoubleClick, zoomActivationKeyPressed, lib, onTransformChange, connectionInProgress, paneClickDistance, selectionOnDrag }) {
    if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
      destroy();
    }
    const isPanOnScroll = panOnScroll && !zoomActivationKeyPressed && !userSelectionActive;
    d3ZoomInstance.clickDistance(selectionOnDrag ? Infinity : !isNumeric(paneClickDistance) || paneClickDistance < 0 ? 0 : paneClickDistance);
    const wheelHandler = isPanOnScroll ? createPanOnScrollHandler({
      zoomPanValues,
      noWheelClassName,
      d3Selection,
      d3Zoom: d3ZoomInstance,
      panOnScrollMode,
      panOnScrollSpeed,
      zoomOnPinch,
      onPanZoomStart,
      onPanZoom,
      onPanZoomEnd
    }) : createZoomOnScrollHandler({
      noWheelClassName,
      preventScrolling,
      d3ZoomHandler
    });
    d3Selection.on("wheel.zoom", wheelHandler, { passive: false });
    if (!userSelectionActive) {
      const startHandler = createPanZoomStartHandler({
        zoomPanValues,
        onDraggingChange,
        onPanZoomStart
      });
      d3ZoomInstance.on("start", startHandler);
      const panZoomHandler = createPanZoomHandler({
        zoomPanValues,
        panOnDrag,
        onPaneContextMenu: !!onPaneContextMenu,
        onPanZoom,
        onTransformChange
      });
      d3ZoomInstance.on("zoom", panZoomHandler);
      const panZoomEndHandler = createPanZoomEndHandler({
        zoomPanValues,
        panOnDrag,
        panOnScroll,
        onPaneContextMenu,
        onPanZoomEnd,
        onDraggingChange
      });
      d3ZoomInstance.on("end", panZoomEndHandler);
    }
    const filter2 = createFilter({
      zoomActivationKeyPressed,
      panOnDrag,
      zoomOnScroll,
      panOnScroll,
      zoomOnDoubleClick,
      zoomOnPinch,
      userSelectionActive,
      noPanClassName,
      noWheelClassName,
      lib,
      connectionInProgress
    });
    d3ZoomInstance.filter(filter2);
    if (zoomOnDoubleClick) {
      d3Selection.on("dblclick.zoom", d3DblClickZoomHandler);
    } else {
      d3Selection.on("dblclick.zoom", null);
    }
  }
  function destroy() {
    d3ZoomInstance.on("zoom", null);
  }
  async function setViewportConstrained(viewport2, extent, translateExtent2) {
    const nextTransform = viewportToTransform(viewport2);
    const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent2);
    if (contrainedTransform) {
      await setTransform(contrainedTransform);
    }
    return new Promise((resolve) => resolve(contrainedTransform));
  }
  async function setViewport(viewport2, options) {
    const nextTransform = viewportToTransform(viewport2);
    await setTransform(nextTransform, options);
    return new Promise((resolve) => resolve(nextTransform));
  }
  function syncViewport(viewport2) {
    if (d3Selection) {
      const nextTransform = viewportToTransform(viewport2);
      const currentTransform = d3Selection.property("__zoom");
      if (currentTransform.k !== viewport2.zoom || currentTransform.x !== viewport2.x || currentTransform.y !== viewport2.y) {
        d3ZoomInstance?.transform(d3Selection, nextTransform, null, { sync: true });
      }
    }
  }
  function getViewport() {
    const transform2 = d3Selection ? transform(d3Selection.node()) : { x: 0, y: 0, k: 1 };
    return { x: transform2.x, y: transform2.y, zoom: transform2.k };
  }
  function scaleTo(zoom2, options) {
    if (d3Selection) {
      return new Promise((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === "linear" ? value_default : zoom_default).scaleTo(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), zoom2);
      });
    }
    return Promise.resolve(false);
  }
  function scaleBy(factor, options) {
    if (d3Selection) {
      return new Promise((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === "linear" ? value_default : zoom_default).scaleBy(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), factor);
      });
    }
    return Promise.resolve(false);
  }
  function setScaleExtent(scaleExtent) {
    d3ZoomInstance?.scaleExtent(scaleExtent);
  }
  function setTranslateExtent(translateExtent2) {
    d3ZoomInstance?.translateExtent(translateExtent2);
  }
  function setClickDistance(distance2) {
    const validDistance = !isNumeric(distance2) || distance2 < 0 ? 0 : distance2;
    d3ZoomInstance?.clickDistance(validDistance);
  }
  return {
    update: update2,
    destroy,
    setViewport,
    setViewportConstrained,
    getViewport,
    scaleTo,
    scaleBy,
    setScaleExtent,
    setTranslateExtent,
    syncViewport,
    setClickDistance
  };
}
var ResizeControlVariant;
(function(ResizeControlVariant2) {
  ResizeControlVariant2["Line"] = "line";
  ResizeControlVariant2["Handle"] = "handle";
})(ResizeControlVariant || (ResizeControlVariant = {}));
var XY_RESIZER_HANDLE_POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"];
var XY_RESIZER_LINE_POSITIONS = ["top", "right", "bottom", "left"];
function getResizeDirection({ width, prevWidth, height, prevHeight, affectsX, affectsY }) {
  const deltaWidth = width - prevWidth;
  const deltaHeight = height - prevHeight;
  const direction = [deltaWidth > 0 ? 1 : deltaWidth < 0 ? -1 : 0, deltaHeight > 0 ? 1 : deltaHeight < 0 ? -1 : 0];
  if (deltaWidth && affectsX) {
    direction[0] = direction[0] * -1;
  }
  if (deltaHeight && affectsY) {
    direction[1] = direction[1] * -1;
  }
  return direction;
}
function getControlDirection(controlPosition) {
  const isHorizontal = controlPosition.includes("right") || controlPosition.includes("left");
  const isVertical = controlPosition.includes("bottom") || controlPosition.includes("top");
  const affectsX = controlPosition.includes("left");
  const affectsY = controlPosition.includes("top");
  return {
    isHorizontal,
    isVertical,
    affectsX,
    affectsY
  };
}
function getLowerExtentClamp(lowerExtent, lowerBound) {
  return Math.max(0, lowerBound - lowerExtent);
}
function getUpperExtentClamp(upperExtent, upperBound) {
  return Math.max(0, upperExtent - upperBound);
}
function getSizeClamp(size, minSize, maxSize) {
  return Math.max(0, minSize - size, size - maxSize);
}
function xor(a, b) {
  return a ? !b : b;
}
function getDimensionsAfterResize(startValues, controlDirection, pointerPosition, boundaries, keepAspectRatio, nodeOrigin, extent, childExtent) {
  let { affectsX, affectsY } = controlDirection;
  const { isHorizontal, isVertical } = controlDirection;
  const isDiagonal = isHorizontal && isVertical;
  const { xSnapped, ySnapped } = pointerPosition;
  const { minWidth, maxWidth, minHeight, maxHeight } = boundaries;
  const { x: startX, y: startY, width: startWidth, height: startHeight, aspectRatio } = startValues;
  let distX = Math.floor(isHorizontal ? xSnapped - startValues.pointerX : 0);
  let distY = Math.floor(isVertical ? ySnapped - startValues.pointerY : 0);
  const newWidth = startWidth + (affectsX ? -distX : distX);
  const newHeight = startHeight + (affectsY ? -distY : distY);
  const originOffsetX = -nodeOrigin[0] * startWidth;
  const originOffsetY = -nodeOrigin[1] * startHeight;
  let clampX = getSizeClamp(newWidth, minWidth, maxWidth);
  let clampY = getSizeClamp(newHeight, minHeight, maxHeight);
  if (extent) {
    let xExtentClamp = 0;
    let yExtentClamp = 0;
    if (affectsX && distX < 0) {
      xExtentClamp = getLowerExtentClamp(startX + distX + originOffsetX, extent[0][0]);
    } else if (!affectsX && distX > 0) {
      xExtentClamp = getUpperExtentClamp(startX + newWidth + originOffsetX, extent[1][0]);
    }
    if (affectsY && distY < 0) {
      yExtentClamp = getLowerExtentClamp(startY + distY + originOffsetY, extent[0][1]);
    } else if (!affectsY && distY > 0) {
      yExtentClamp = getUpperExtentClamp(startY + newHeight + originOffsetY, extent[1][1]);
    }
    clampX = Math.max(clampX, xExtentClamp);
    clampY = Math.max(clampY, yExtentClamp);
  }
  if (childExtent) {
    let xExtentClamp = 0;
    let yExtentClamp = 0;
    if (affectsX && distX > 0) {
      xExtentClamp = getUpperExtentClamp(startX + distX, childExtent[0][0]);
    } else if (!affectsX && distX < 0) {
      xExtentClamp = getLowerExtentClamp(startX + newWidth, childExtent[1][0]);
    }
    if (affectsY && distY > 0) {
      yExtentClamp = getUpperExtentClamp(startY + distY, childExtent[0][1]);
    } else if (!affectsY && distY < 0) {
      yExtentClamp = getLowerExtentClamp(startY + newHeight, childExtent[1][1]);
    }
    clampX = Math.max(clampX, xExtentClamp);
    clampY = Math.max(clampY, yExtentClamp);
  }
  if (keepAspectRatio) {
    if (isHorizontal) {
      const aspectHeightClamp = getSizeClamp(newWidth / aspectRatio, minHeight, maxHeight) * aspectRatio;
      clampX = Math.max(clampX, aspectHeightClamp);
      if (extent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsX && !affectsY && isDiagonal) {
          aspectExtentClamp = getUpperExtentClamp(startY + originOffsetY + newWidth / aspectRatio, extent[1][1]) * aspectRatio;
        } else {
          aspectExtentClamp = getLowerExtentClamp(startY + originOffsetY + (affectsX ? distX : -distX) / aspectRatio, extent[0][1]) * aspectRatio;
        }
        clampX = Math.max(clampX, aspectExtentClamp);
      }
      if (childExtent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsX && !affectsY && isDiagonal) {
          aspectExtentClamp = getLowerExtentClamp(startY + newWidth / aspectRatio, childExtent[1][1]) * aspectRatio;
        } else {
          aspectExtentClamp = getUpperExtentClamp(startY + (affectsX ? distX : -distX) / aspectRatio, childExtent[0][1]) * aspectRatio;
        }
        clampX = Math.max(clampX, aspectExtentClamp);
      }
    }
    if (isVertical) {
      const aspectWidthClamp = getSizeClamp(newHeight * aspectRatio, minWidth, maxWidth) / aspectRatio;
      clampY = Math.max(clampY, aspectWidthClamp);
      if (extent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsY && !affectsX && isDiagonal) {
          aspectExtentClamp = getUpperExtentClamp(startX + newHeight * aspectRatio + originOffsetX, extent[1][0]) / aspectRatio;
        } else {
          aspectExtentClamp = getLowerExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio + originOffsetX, extent[0][0]) / aspectRatio;
        }
        clampY = Math.max(clampY, aspectExtentClamp);
      }
      if (childExtent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsY && !affectsX && isDiagonal) {
          aspectExtentClamp = getLowerExtentClamp(startX + newHeight * aspectRatio, childExtent[1][0]) / aspectRatio;
        } else {
          aspectExtentClamp = getUpperExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio, childExtent[0][0]) / aspectRatio;
        }
        clampY = Math.max(clampY, aspectExtentClamp);
      }
    }
  }
  distY = distY + (distY < 0 ? clampY : -clampY);
  distX = distX + (distX < 0 ? clampX : -clampX);
  if (keepAspectRatio) {
    if (isDiagonal) {
      if (newWidth > newHeight * aspectRatio) {
        distY = (xor(affectsX, affectsY) ? -distX : distX) / aspectRatio;
      } else {
        distX = (xor(affectsX, affectsY) ? -distY : distY) * aspectRatio;
      }
    } else {
      if (isHorizontal) {
        distY = distX / aspectRatio;
        affectsY = affectsX;
      } else {
        distX = distY * aspectRatio;
        affectsX = affectsY;
      }
    }
  }
  const x = affectsX ? startX + distX : startX;
  const y2 = affectsY ? startY + distY : startY;
  return {
    width: startWidth + (affectsX ? -distX : distX),
    height: startHeight + (affectsY ? -distY : distY),
    x: nodeOrigin[0] * distX * (!affectsX ? 1 : -1) + x,
    y: nodeOrigin[1] * distY * (!affectsY ? 1 : -1) + y2
  };
}
var initPrevValues = { width: 0, height: 0, x: 0, y: 0 };
var initStartValues = {
  ...initPrevValues,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function nodeToParentExtent(node) {
  return [
    [0, 0],
    [node.measured.width, node.measured.height]
  ];
}
function nodeToChildExtent(child2, parent, nodeOrigin) {
  const x = parent.position.x + child2.position.x;
  const y2 = parent.position.y + child2.position.y;
  const width = child2.measured.width ?? 0;
  const height = child2.measured.height ?? 0;
  const originOffsetX = nodeOrigin[0] * width;
  const originOffsetY = nodeOrigin[1] * height;
  return [
    [x - originOffsetX, y2 - originOffsetY],
    [x + width - originOffsetX, y2 + height - originOffsetY]
  ];
}
function XYResizer({ domNode, nodeId, getStoreItems, onChange, onEnd }) {
  const selection2 = select_default2(domNode);
  let params = {
    controlDirection: getControlDirection("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: false
  };
  function update2({ controlPosition, boundaries, keepAspectRatio, resizeDirection, onResizeStart, onResize, onResizeEnd, shouldResize }) {
    let prevValues = { ...initPrevValues };
    let startValues = { ...initStartValues };
    params = {
      boundaries,
      resizeDirection,
      keepAspectRatio,
      controlDirection: getControlDirection(controlPosition)
    };
    let node = void 0;
    let containerBounds = null;
    let childNodes = [];
    let parentNode = void 0;
    let parentExtent = void 0;
    let childExtent = void 0;
    let resizeDetected = false;
    const dragHandler = drag_default().on("start", (event2) => {
      const { nodeLookup, transform: transform2, snapGrid, snapToGrid, nodeOrigin, paneDomNode } = getStoreItems();
      node = nodeLookup.get(nodeId);
      if (!node) {
        return;
      }
      containerBounds = paneDomNode?.getBoundingClientRect() ?? null;
      const { xSnapped, ySnapped } = getPointerPosition(event2.sourceEvent, {
        transform: transform2,
        snapGrid,
        snapToGrid,
        containerBounds
      });
      prevValues = {
        width: node.measured.width ?? 0,
        height: node.measured.height ?? 0,
        x: node.position.x ?? 0,
        y: node.position.y ?? 0
      };
      startValues = {
        ...prevValues,
        pointerX: xSnapped,
        pointerY: ySnapped,
        aspectRatio: prevValues.width / prevValues.height
      };
      parentNode = void 0;
      if (node.parentId && (node.extent === "parent" || node.expandParent)) {
        parentNode = nodeLookup.get(node.parentId);
        parentExtent = parentNode && node.extent === "parent" ? nodeToParentExtent(parentNode) : void 0;
      }
      childNodes = [];
      childExtent = void 0;
      for (const [childId, child2] of nodeLookup) {
        if (child2.parentId === nodeId) {
          childNodes.push({
            id: childId,
            position: { ...child2.position },
            extent: child2.extent
          });
          if (child2.extent === "parent" || child2.expandParent) {
            const extent = nodeToChildExtent(child2, node, child2.origin ?? nodeOrigin);
            if (childExtent) {
              childExtent = [
                [Math.min(extent[0][0], childExtent[0][0]), Math.min(extent[0][1], childExtent[0][1])],
                [Math.max(extent[1][0], childExtent[1][0]), Math.max(extent[1][1], childExtent[1][1])]
              ];
            } else {
              childExtent = extent;
            }
          }
        }
      }
      onResizeStart?.(event2, { ...prevValues });
    }).on("drag", (event2) => {
      const { transform: transform2, snapGrid, snapToGrid, nodeOrigin: storeNodeOrigin } = getStoreItems();
      const pointerPosition = getPointerPosition(event2.sourceEvent, {
        transform: transform2,
        snapGrid,
        snapToGrid,
        containerBounds
      });
      const childChanges = [];
      if (!node) {
        return;
      }
      const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;
      const change = {};
      const nodeOrigin = node.origin ?? storeNodeOrigin;
      const { width, height, x, y: y2 } = getDimensionsAfterResize(startValues, params.controlDirection, pointerPosition, params.boundaries, params.keepAspectRatio, nodeOrigin, parentExtent, childExtent);
      const isWidthChange = width !== prevWidth;
      const isHeightChange = height !== prevHeight;
      const isXPosChange = x !== prevX && isWidthChange;
      const isYPosChange = y2 !== prevY && isHeightChange;
      if (!isXPosChange && !isYPosChange && !isWidthChange && !isHeightChange) {
        return;
      }
      if (isXPosChange || isYPosChange || nodeOrigin[0] === 1 || nodeOrigin[1] === 1) {
        change.x = isXPosChange ? x : prevValues.x;
        change.y = isYPosChange ? y2 : prevValues.y;
        prevValues.x = change.x;
        prevValues.y = change.y;
        if (childNodes.length > 0) {
          const xChange = x - prevX;
          const yChange = y2 - prevY;
          for (const childNode of childNodes) {
            childNode.position = {
              x: childNode.position.x - xChange + nodeOrigin[0] * (width - prevWidth),
              y: childNode.position.y - yChange + nodeOrigin[1] * (height - prevHeight)
            };
            childChanges.push(childNode);
          }
        }
      }
      if (isWidthChange || isHeightChange) {
        change.width = isWidthChange && (!params.resizeDirection || params.resizeDirection === "horizontal") ? width : prevValues.width;
        change.height = isHeightChange && (!params.resizeDirection || params.resizeDirection === "vertical") ? height : prevValues.height;
        prevValues.width = change.width;
        prevValues.height = change.height;
      }
      if (parentNode && node.expandParent) {
        const xLimit = nodeOrigin[0] * (change.width ?? 0);
        if (change.x && change.x < xLimit) {
          prevValues.x = xLimit;
          startValues.x = startValues.x - (change.x - xLimit);
        }
        const yLimit = nodeOrigin[1] * (change.height ?? 0);
        if (change.y && change.y < yLimit) {
          prevValues.y = yLimit;
          startValues.y = startValues.y - (change.y - yLimit);
        }
      }
      const direction = getResizeDirection({
        width: prevValues.width,
        prevWidth,
        height: prevValues.height,
        prevHeight,
        affectsX: params.controlDirection.affectsX,
        affectsY: params.controlDirection.affectsY
      });
      const nextValues = { ...prevValues, direction };
      const callResize = shouldResize?.(event2, nextValues);
      if (callResize === false) {
        return;
      }
      resizeDetected = true;
      onResize?.(event2, nextValues);
      onChange(change, childChanges);
    }).on("end", (event2) => {
      if (!resizeDetected) {
        return;
      }
      onResizeEnd?.(event2, { ...prevValues });
      onEnd?.({ ...prevValues });
      resizeDetected = false;
    });
    selection2.call(dragHandler);
  }
  function destroy() {
    selection2.on(".drag", null);
  }
  return {
    update: update2,
    destroy
  };
}

// node_modules/@xyflow/svelte/dist/lib/store/context.js
function createContext2() {
  const key3 = {};
  return [
    (errorMessage) => {
      if (errorMessage && !hasContext(key3)) {
        throw new Error(errorMessage);
      }
      return getContext(key3);
    },
    (context) => setContext(key3, context)
  ];
}
var [getNodeIdContext, setNodeIdContext] = createContext2();
var [getNodeConnectableContext, setNodeConnectableContext] = createContext2();
var [getEdgeIdContext, setEdgeIdContext] = createContext2();

// node_modules/@xyflow/svelte/dist/lib/components/Handle/Handle.svelte
Handle[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/Handle/Handle.svelte";
var root2 = add_locations(from_html(`<div><!></div>`), Handle[FILENAME], [[198, 0]]);
function Handle($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Handle);
  let handleId = prop($$props, "id", 3, null), type = prop($$props, "type", 3, "source"), position = prop($$props, "position", 19, () => Position.Top), isConnectableStart = prop($$props, "isConnectableStart", 3, true), isConnectableEnd = prop($$props, "isConnectableEnd", 3, true), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "id",
      "type",
      "position",
      "style",
      "class",
      "isConnectable",
      "isConnectableStart",
      "isConnectableEnd",
      "isValidConnection",
      "onconnect",
      "ondisconnect",
      "children"
    ],
    "rest"
  );
  const nodeId = getNodeIdContext("Handle must be used within a Custom Node component");
  const isConnectableContext = getNodeConnectableContext("Handle must be used within a Custom Node component");
  let isTarget = tag(user_derived(() => strict_equals(type(), "target")), "isTarget");
  let isConnectable = tag(user_derived(() => strict_equals($$props.isConnectable, void 0, false) ? $$props.isConnectable : isConnectableContext.value), "isConnectable");
  let store = useStore();
  let ariaLabelConfig = tag(user_derived(() => store.ariaLabelConfig), "ariaLabelConfig");
  let prevConnections = null;
  user_pre_effect(() => {
    if ($$props.onconnect || $$props.ondisconnect) {
      store.edges;
      let connections = store.connectionLookup.get(`${nodeId}-${type()}${handleId() ? `-${handleId()}` : ""}`);
      if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
        const _connections = connections ?? /* @__PURE__ */ new Map();
        handleConnectionChange(prevConnections, _connections, $$props.ondisconnect);
        handleConnectionChange(_connections, prevConnections, $$props.onconnect);
      }
      prevConnections = new Map(connections);
    }
  });
  let $$d = user_derived(() => {
    if (!store.connection.inProgress) {
      return [false, false, false, false, null];
    }
    const { fromHandle, toHandle, isValid } = store.connection;
    const connectingFrom2 = fromHandle && strict_equals(fromHandle.nodeId, nodeId) && strict_equals(fromHandle.type, type()) && strict_equals(fromHandle.id, handleId());
    const connectingTo2 = toHandle && strict_equals(toHandle.nodeId, nodeId) && strict_equals(toHandle.type, type()) && strict_equals(toHandle.id, handleId());
    const isPossibleTargetHandle2 = strict_equals(store.connectionMode, ConnectionMode.Strict) ? strict_equals(fromHandle?.type, type(), false) : strict_equals(nodeId, fromHandle?.nodeId, false) || strict_equals(handleId(), fromHandle?.id, false);
    const valid2 = connectingTo2 && isValid;
    return [
      true,
      connectingFrom2,
      connectingTo2,
      isPossibleTargetHandle2,
      valid2
    ];
  }), $$array = tag(user_derived(() => to_array(get($$d), 5)), "[$derived iterable]"), connectionInProgress = tag(user_derived(() => get($$array)[0]), "connectionInProgress"), connectingFrom = tag(user_derived(() => get($$array)[1]), "connectingFrom"), connectingTo = tag(user_derived(() => get($$array)[2]), "connectingTo"), isPossibleTargetHandle = tag(user_derived(() => get($$array)[3]), "isPossibleTargetHandle"), valid = tag(user_derived(() => get($$array)[4]), "valid");
  function onConnectExtended(connection) {
    const edge = store.onbeforeconnect ? store.onbeforeconnect(connection) : connection;
    if (!edge) {
      return;
    }
    store.addEdge(edge);
    store.onconnect?.(connection);
  }
  function onpointerdown(event2) {
    const isMouseTriggered = isMouseEvent(event2);
    if (event2.currentTarget && (isMouseTriggered && strict_equals(event2.button, 0) || !isMouseTriggered)) {
      XYHandle.onPointerDown(event2, {
        handleId: handleId(),
        nodeId,
        isTarget: get(isTarget),
        connectionRadius: store.connectionRadius,
        domNode: store.domNode,
        nodeLookup: store.nodeLookup,
        connectionMode: store.connectionMode,
        lib: "svelte",
        autoPanOnConnect: store.autoPanOnConnect,
        autoPanSpeed: store.autoPanSpeed,
        flowId: store.flowId,
        isValidConnection: $$props.isValidConnection || ((...args) => store.isValidConnection?.(...args) ?? true),
        updateConnection: store.updateConnection,
        cancelConnection: store.cancelConnection,
        panBy: store.panBy,
        onConnect: onConnectExtended,
        onConnectStart: store.onconnectstart,
        onConnectEnd: (...args) => store.onconnectend?.(...args),
        getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
        getFromHandle: () => store.connection.fromHandle,
        dragThreshold: store.connectionDragThreshold,
        handleDomNode: event2.currentTarget
      });
    }
  }
  function onclick(event2) {
    if (!nodeId || !store.clickConnectStartHandle && !isConnectableStart()) {
      return;
    }
    if (!store.clickConnectStartHandle) {
      store.onclickconnectstart?.(event2, { nodeId, handleId: handleId(), handleType: type() });
      store.clickConnectStartHandle = { nodeId, type: type(), id: handleId() };
      return;
    }
    const doc = getHostForElement(event2.target);
    const isValidConnectionHandler = $$props.isValidConnection ?? store.isValidConnection;
    const { connectionMode, clickConnectStartHandle, flowId, nodeLookup } = store;
    const { connection, isValid } = XYHandle.isValid(event2, {
      handle: { nodeId, id: handleId(), type: type() },
      connectionMode,
      fromNodeId: clickConnectStartHandle.nodeId,
      fromHandleId: clickConnectStartHandle.id ?? null,
      fromType: clickConnectStartHandle.type,
      isValidConnection: isValidConnectionHandler,
      flowId,
      doc,
      lib: "svelte",
      nodeLookup
    });
    if (isValid && connection) {
      onConnectExtended(connection);
    }
    const connectionClone = structuredClone(snapshot(store.connection));
    delete connectionClone.inProgress;
    connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
    store.onclickconnectend?.(event2, connectionClone);
    store.clickConnectStartHandle = null;
  }
  var $$exports = { ...legacy_api() };
  var div = root2();
  var event_handler = () => {
  };
  attribute_effect(div, () => ({
    "data-handleid": handleId(),
    "data-nodeid": nodeId,
    "data-handlepos": position(),
    "data-id": `${store.flowId ?? ""}-${nodeId ?? ""}-${handleId() ?? "null" ?? ""}-${type() ?? ""}`,
    class: [
      "svelte-flow__handle",
      `svelte-flow__handle-${position()}`,
      store.noDragClass,
      store.noPanClass,
      position(),
      $$props.class
    ],
    onmousedown: onpointerdown,
    ontouchstart: onpointerdown,
    onclick: store.clickConnect ? onclick : void 0,
    onkeypress: event_handler,
    style: $$props.style,
    role: "button",
    "aria-label": get(ariaLabelConfig)[`handle.ariaLabel`],
    tabindex: "-1",
    ...rest,
    [CLASS]: {
      valid: get(valid),
      connectingto: get(connectingTo),
      connectingfrom: get(connectingFrom),
      source: !get(isTarget),
      target: get(isTarget),
      connectablestart: isConnectableStart(),
      connectableend: isConnectableEnd(),
      connectable: get(isConnectable),
      connectionindicator: get(isConnectable) && (!get(connectionInProgress) || get(isPossibleTargetHandle)) && (get(connectionInProgress) || store.clickConnectStartHandle ? isConnectableEnd() : isConnectableStart())
    }
  }));
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children ?? noop), "render", Handle, 232, 2);
  reset(div);
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/nodes/DefaultNode.svelte
DefaultNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/DefaultNode.svelte";
var root3 = add_locations(from_html(`<!> <!>`, 1), DefaultNode[FILENAME], []);
function DefaultNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, DefaultNode);
  let targetPosition = prop($$props, "targetPosition", 19, () => Position.Top), sourcePosition = prop($$props, "sourcePosition", 19, () => Position.Bottom);
  var $$exports = { ...legacy_api() };
  var fragment = root3();
  var node = first_child(fragment);
  add_svelte_meta(
    () => Handle(node, {
      type: "target",
      get position() {
        return targetPosition();
      }
    }),
    "component",
    DefaultNode,
    14,
    0,
    { componentTag: "Handle" }
  );
  var text2 = sibling(node);
  var node_1 = sibling(text2);
  add_svelte_meta(
    () => Handle(node_1, {
      type: "source",
      get position() {
        return sourcePosition();
      }
    }),
    "component",
    DefaultNode,
    16,
    0,
    { componentTag: "Handle" }
  );
  template_effect(() => set_text(text2, ` ${$$props.data?.label ?? ""} `));
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/nodes/InputNode.svelte
InputNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/InputNode.svelte";
var root4 = add_locations(from_html(` <!>`, 1), InputNode[FILENAME], []);
function InputNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, InputNode);
  let data = prop($$props, "data", 19, () => ({ label: "Node" })), sourcePosition = prop($$props, "sourcePosition", 19, () => Position.Bottom);
  var $$exports = { ...legacy_api() };
  next();
  var fragment = root4();
  var text2 = first_child(fragment);
  var node = sibling(text2);
  add_svelte_meta(
    () => Handle(node, {
      type: "source",
      get position() {
        return sourcePosition();
      }
    }),
    "component",
    InputNode,
    11,
    0,
    { componentTag: "Handle" }
  );
  template_effect(() => set_text(text2, `${data()?.label ?? ""} `));
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/nodes/OutputNode.svelte
OutputNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/OutputNode.svelte";
var root5 = add_locations(from_html(` <!>`, 1), OutputNode[FILENAME], []);
function OutputNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, OutputNode);
  let data = prop($$props, "data", 19, () => ({ label: "Node" })), targetPosition = prop($$props, "targetPosition", 19, () => Position.Top);
  var $$exports = { ...legacy_api() };
  next();
  var fragment = root5();
  var text2 = first_child(fragment);
  var node = sibling(text2);
  add_svelte_meta(
    () => Handle(node, {
      type: "target",
      get position() {
        return targetPosition();
      }
    }),
    "component",
    OutputNode,
    11,
    0,
    { componentTag: "Handle" }
  );
  template_effect(() => set_text(text2, `${data()?.label ?? ""} `));
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/nodes/GroupNode.svelte
GroupNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/nodes/GroupNode.svelte";
function GroupNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, GroupNode);
  var $$exports = { ...legacy_api() };
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/actions/portal/portal.svelte.js
function tryToMount(node, domNode, target) {
  if (!target || !domNode) {
    return;
  }
  const targetEl = target === "root" ? domNode : domNode.querySelector(`.svelte-flow__${target}`);
  if (targetEl) {
    targetEl.appendChild(node);
  }
}
function portal(node, target) {
  const $$d = user_derived(useStore), domNode = user_derived(() => get($$d).domNode);
  let destroyEffect;
  if (get(domNode)) {
    tryToMount(node, get(domNode), target);
  } else {
    destroyEffect = effect_root(() => {
      user_effect(() => {
        tryToMount(node, get(domNode), target);
        destroyEffect?.();
      });
    });
  }
  return {
    async update(target2) {
      tryToMount(node, get(domNode), target2);
    },
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      destroyEffect?.();
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/actions/portal/utils.svelte.js
function hideOnSSR() {
  let hide = state(typeof window === "undefined");
  if (get(hide)) {
    const destroyEffect = effect_root(() => {
      user_effect(() => {
        set(hide, false);
        destroyEffect?.();
      });
    });
  }
  return {
    get value() {
      return get(hide);
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/utils/index.js
var isNode = (element2) => isNodeBase(element2);
var isEdge = (element2) => isEdgeBase(element2);
function toPxString(value) {
  return value === void 0 ? void 0 : `${value}px`;
}
var arrowKeyDiffs = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

// node_modules/@xyflow/svelte/dist/lib/components/EdgeLabel/EdgeLabel.svelte
EdgeLabel[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/EdgeLabel/EdgeLabel.svelte";
var root6 = add_locations(from_html(`<div><!></div>`), EdgeLabel[FILENAME], [[30, 0]]);
var $$css = {
  hash: "svelte-1wg91mu",
  code: "\n  .transparent.svelte-1wg91mu {\n    background: transparent;\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRnZUxhYmVsLnN2ZWx0ZSIsInNvdXJjZXMiOlsiRWRnZUxhYmVsLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBnZXRFZGdlSWRDb250ZXh0IH0gZnJvbSAnLi4vLi4vc3RvcmUvY29udGV4dCc7XG4gIGltcG9ydCB7IGhpZGVPblNTUiwgcG9ydGFsIH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9wb3J0YWwnO1xuICBpbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJy4uLy4uL3N0b3JlJztcbiAgaW1wb3J0IHsgdG9QeFN0cmluZyB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuICBpbXBvcnQgdHlwZSB7IEVkZ2VMYWJlbFByb3BzIH0gZnJvbSAnLi90eXBlcyc7XG5cbiAgbGV0IHtcbiAgICB4ID0gMCxcbiAgICB5ID0gMCxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgc2VsZWN0RWRnZU9uQ2xpY2sgPSBmYWxzZSxcbiAgICB0cmFuc3BhcmVudCA9IGZhbHNlLFxuICAgIGNsYXNzOiBjbGFzc05hbWUsXG4gICAgY2hpbGRyZW4sXG4gICAgLi4ucmVzdFxuICB9OiBFZGdlTGFiZWxQcm9wcyA9ICRwcm9wcygpO1xuXG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmUoKTtcblxuICBjb25zdCBlZGdlSWQgPSBnZXRFZGdlSWRDb250ZXh0KCdFZGdlTGFiZWwgbXVzdCBiZSB1c2VkIHdpdGhpbiBhIEN1c3RvbSBFZGdlIGNvbXBvbmVudCcpO1xuXG4gIGxldCB6ID0gJGRlcml2ZWQuYnkoKCkgPT4ge1xuICAgIHJldHVybiBzdG9yZS52aXNpYmxlLmVkZ2VzLmdldChlZGdlSWQpPy56SW5kZXg7XG4gIH0pO1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgdXNlOnBvcnRhbD17J2VkZ2UtbGFiZWxzJ31cbiAgc3R5bGU6ZGlzcGxheT17aGlkZU9uU1NSKCkudmFsdWUgPyAnbm9uZScgOiB1bmRlZmluZWR9XG4gIGNsYXNzPXtbJ3N2ZWx0ZS1mbG93X19lZGdlLWxhYmVsJywgeyB0cmFuc3BhcmVudCB9LCBjbGFzc05hbWVdfVxuICBzdHlsZTpjdXJzb3I9e3NlbGVjdEVkZ2VPbkNsaWNrID8gJ3BvaW50ZXInIDogdW5kZWZpbmVkfVxuICBzdHlsZTp0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSkgdHJhbnNsYXRlKHt4fXB4LHt5fXB4KVwiXG4gIHN0eWxlOnBvaW50ZXItZXZlbnRzPVwiYWxsXCJcbiAgc3R5bGU6d2lkdGg9e3RvUHhTdHJpbmcod2lkdGgpfVxuICBzdHlsZTpoZWlnaHQ9e3RvUHhTdHJpbmcoaGVpZ2h0KX1cbiAgc3R5bGU6ei1pbmRleD17en1cbiAgdGFiaW5kZXg9XCItMVwiXG4gIG9uY2xpY2s9eygpID0+IHtcbiAgICBpZiAoc2VsZWN0RWRnZU9uQ2xpY2sgJiYgZWRnZUlkKSBzdG9yZS5oYW5kbGVFZGdlU2VsZWN0aW9uKGVkZ2VJZCk7XG4gIH19XG4gIHsuLi5yZXN0fVxuPlxuICB7QHJlbmRlciBjaGlsZHJlbj8uKCl9XG48L2Rpdj5cblxuPHN0eWxlPlxuICAudHJhbnNwYXJlbnQge1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICB9XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFpREEsRUFBRSwyQkFBWSxDQUFDO0FBQ2YsSUFBSSx1QkFBdUI7QUFDM0I7In0= */"
};
function EdgeLabel($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, EdgeLabel);
  append_styles($$anchor, $$css);
  let x = prop($$props, "x", 3, 0), y2 = prop($$props, "y", 3, 0), selectEdgeOnClick = prop($$props, "selectEdgeOnClick", 3, false), transparent = prop($$props, "transparent", 3, false), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "x",
      "y",
      "width",
      "height",
      "selectEdgeOnClick",
      "transparent",
      "class",
      "children"
    ],
    "rest"
  );
  const store = useStore();
  const edgeId = getEdgeIdContext("EdgeLabel must be used within a Custom Edge component");
  let z = tag(
    user_derived(() => {
      return store.visible.edges.get(edgeId)?.zIndex;
    }),
    "z"
  );
  var $$exports = { ...legacy_api() };
  var div = root6();
  var event_handler = () => {
    if (selectEdgeOnClick() && edgeId) store.handleEdgeSelection(edgeId);
  };
  attribute_effect(
    div,
    ($0) => ({
      class: [
        "svelte-flow__edge-label",
        { transparent: transparent() },
        $$props.class
      ],
      tabindex: "-1",
      onclick: event_handler,
      ...rest,
      [STYLE]: $0
    }),
    [
      () => ({
        display: hideOnSSR().value ? "none" : void 0,
        cursor: selectEdgeOnClick() ? "pointer" : void 0,
        transform: `translate(-50%, -50%) translate(${x() ?? ""}px,${y2() ?? ""}px)`,
        "pointer-events": "all",
        width: toPxString($$props.width),
        height: toPxString($$props.height),
        "z-index": get(z)
      })
    ],
    void 0,
    void 0,
    "svelte-1wg91mu"
  );
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children ?? noop), "render", EdgeLabel, 46, 2);
  reset(div);
  action(div, ($$node, $$action_arg) => portal?.($$node, $$action_arg), () => "edge-labels");
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/edges/BaseEdge.svelte
BaseEdge[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/BaseEdge.svelte";
var root_1 = add_locations(from_svg(`<path></path>`), BaseEdge[FILENAME], [[32, 2]]);
var root7 = add_locations(from_svg(`<path fill="none"></path><!><!>`, 1), BaseEdge[FILENAME], [[21, 0]]);
function BaseEdge($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, BaseEdge);
  let interactionWidth = prop($$props, "interactionWidth", 3, 20), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "id",
      "path",
      "label",
      "labelX",
      "labelY",
      "labelStyle",
      "markerStart",
      "markerEnd",
      "style",
      "interactionWidth",
      "class"
    ],
    "rest"
  );
  var $$exports = { ...legacy_api() };
  var fragment = root7();
  var path_1 = first_child(fragment);
  var node = sibling(path_1);
  {
    var consequent = ($$anchor2) => {
      var path_2 = root_1();
      attribute_effect(path_2, () => ({
        d: $$props.path,
        "stroke-opacity": 0,
        "stroke-width": interactionWidth(),
        fill: "none",
        class: "svelte-flow__edge-interaction",
        ...rest
      }));
      append($$anchor2, path_2);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (interactionWidth() > 0) $$render(consequent);
      }),
      "if",
      BaseEdge,
      31,
      0
    );
  }
  var node_1 = sibling(node);
  {
    var consequent_1 = ($$anchor2) => {
      add_svelte_meta(
        () => EdgeLabel($$anchor2, {
          get x() {
            return $$props.labelX;
          },
          get y() {
            return $$props.labelY;
          },
          get style() {
            return $$props.labelStyle;
          },
          selectEdgeOnClick: true,
          children: wrap_snippet(BaseEdge, ($$anchor3, $$slotProps) => {
            next();
            var text2 = text();
            template_effect(() => set_text(text2, $$props.label));
            append($$anchor3, text2);
          }),
          $$slots: { default: true }
        }),
        "component",
        BaseEdge,
        43,
        2,
        { componentTag: "EdgeLabel" }
      );
    };
    add_svelte_meta(
      () => if_block(node_1, ($$render) => {
        if ($$props.label) $$render(consequent_1);
      }),
      "if",
      BaseEdge,
      42,
      0
    );
  }
  template_effect(() => {
    set_attribute2(path_1, "id", $$props.id);
    set_attribute2(path_1, "d", $$props.path);
    set_class(path_1, 0, clsx2(["svelte-flow__edge-path", $$props.class]));
    set_attribute2(path_1, "marker-start", $$props.markerStart);
    set_attribute2(path_1, "marker-end", $$props.markerEnd);
    set_style(path_1, $$props.style);
  });
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/edges/BezierEdge.svelte
BezierEdge[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/BezierEdge.svelte";
function BezierEdge($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, BezierEdge);
  let $$d = user_derived(() => getBezierPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition,
    curvature: $$props.pathOptions?.curvature
  })), $$array = tag(user_derived(() => to_array(get($$d), 3)), "[$derived iterable]"), path = tag(user_derived(() => get($$array)[0]), "path"), labelX = tag(user_derived(() => get($$array)[1]), "labelX"), labelY = tag(user_derived(() => get($$array)[2]), "labelY");
  var $$exports = { ...legacy_api() };
  add_svelte_meta(
    () => BaseEdge($$anchor, {
      get id() {
        return $$props.id;
      },
      get path() {
        return get(path);
      },
      get labelX() {
        return get(labelX);
      },
      get labelY() {
        return get(labelY);
      },
      get label() {
        return $$props.label;
      },
      get labelStyle() {
        return $$props.labelStyle;
      },
      get markerStart() {
        return $$props.markerStart;
      },
      get markerEnd() {
        return $$props.markerEnd;
      },
      get interactionWidth() {
        return $$props.interactionWidth;
      },
      get style() {
        return $$props.style;
      }
    }),
    "component",
    BezierEdge,
    37,
    0,
    { componentTag: "BaseEdge" }
  );
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/edges/SmoothStepEdge.svelte
SmoothStepEdge[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/SmoothStepEdge.svelte";
function SmoothStepEdge($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, SmoothStepEdge);
  let $$d = user_derived(() => getSmoothStepPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition,
    borderRadius: $$props.pathOptions?.borderRadius,
    offset: $$props.pathOptions?.offset,
    stepPosition: $$props.pathOptions?.stepPosition
  })), $$array = tag(user_derived(() => to_array(get($$d), 3)), "[$derived iterable]"), path = tag(user_derived(() => get($$array)[0]), "path"), labelX = tag(user_derived(() => get($$array)[1]), "labelX"), labelY = tag(user_derived(() => get($$array)[2]), "labelY");
  var $$exports = { ...legacy_api() };
  add_svelte_meta(
    () => BaseEdge($$anchor, {
      get id() {
        return $$props.id;
      },
      get path() {
        return get(path);
      },
      get labelX() {
        return get(labelX);
      },
      get labelY() {
        return get(labelY);
      },
      get label() {
        return $$props.label;
      },
      get labelStyle() {
        return $$props.labelStyle;
      },
      get markerStart() {
        return $$props.markerStart;
      },
      get markerEnd() {
        return $$props.markerEnd;
      },
      get interactionWidth() {
        return $$props.interactionWidth;
      },
      get style() {
        return $$props.style;
      }
    }),
    "component",
    SmoothStepEdge,
    39,
    0,
    { componentTag: "BaseEdge" }
  );
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/edges/SmoothStepEdgeInternal.svelte
SmoothStepEdgeInternal[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/SmoothStepEdgeInternal.svelte";
function SmoothStepEdgeInternal($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, SmoothStepEdgeInternal);
  let $$d = user_derived(() => getSmoothStepPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition
  })), $$array = tag(user_derived(() => to_array(get($$d), 3)), "[$derived iterable]"), path = tag(user_derived(() => get($$array)[0]), "path"), labelX = tag(user_derived(() => get($$array)[1]), "labelX"), labelY = tag(user_derived(() => get($$array)[2]), "labelY");
  var $$exports = { ...legacy_api() };
  add_svelte_meta(
    () => BaseEdge($$anchor, {
      get path() {
        return get(path);
      },
      get labelX() {
        return get(labelX);
      },
      get labelY() {
        return get(labelY);
      },
      get label() {
        return $$props.label;
      },
      get labelStyle() {
        return $$props.labelStyle;
      },
      get markerStart() {
        return $$props.markerStart;
      },
      get markerEnd() {
        return $$props.markerEnd;
      },
      get interactionWidth() {
        return $$props.interactionWidth;
      },
      get style() {
        return $$props.style;
      }
    }),
    "component",
    SmoothStepEdgeInternal,
    34,
    0,
    { componentTag: "BaseEdge" }
  );
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/edges/StraightEdgeInternal.svelte
StraightEdgeInternal[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/StraightEdgeInternal.svelte";
function StraightEdgeInternal($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, StraightEdgeInternal);
  let $$d = user_derived(() => getStraightPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY
  })), $$array = tag(user_derived(() => to_array(get($$d), 3)), "[$derived iterable]"), path = tag(user_derived(() => get($$array)[0]), "path"), labelX = tag(user_derived(() => get($$array)[1]), "labelX"), labelY = tag(user_derived(() => get($$array)[2]), "labelY");
  var $$exports = { ...legacy_api() };
  add_svelte_meta(
    () => BaseEdge($$anchor, {
      get path() {
        return get(path);
      },
      get labelX() {
        return get(labelX);
      },
      get labelY() {
        return get(labelY);
      },
      get label() {
        return $$props.label;
      },
      get labelStyle() {
        return $$props.labelStyle;
      },
      get markerStart() {
        return $$props.markerStart;
      },
      get markerEnd() {
        return $$props.markerEnd;
      },
      get interactionWidth() {
        return $$props.interactionWidth;
      },
      get style() {
        return $$props.style;
      }
    }),
    "component",
    StraightEdgeInternal,
    30,
    0,
    { componentTag: "BaseEdge" }
  );
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/edges/StepEdgeInternal.svelte
StepEdgeInternal[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/edges/StepEdgeInternal.svelte";
function StepEdgeInternal($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, StepEdgeInternal);
  let $$d = user_derived(() => getSmoothStepPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition,
    borderRadius: 0
  })), $$array = tag(user_derived(() => to_array(get($$d), 3)), "[$derived iterable]"), path = tag(user_derived(() => get($$array)[0]), "path"), labelX = tag(user_derived(() => get($$array)[1]), "labelX"), labelY = tag(user_derived(() => get($$array)[2]), "labelY");
  var $$exports = { ...legacy_api() };
  add_svelte_meta(
    () => BaseEdge($$anchor, {
      get path() {
        return get(path);
      },
      get labelX() {
        return get(labelX);
      },
      get labelY() {
        return get(labelY);
      },
      get label() {
        return $$props.label;
      },
      get labelStyle() {
        return $$props.labelStyle;
      },
      get markerStart() {
        return $$props.markerStart;
      },
      get markerEnd() {
        return $$props.markerEnd;
      },
      get interactionWidth() {
        return $$props.interactionWidth;
      },
      get style() {
        return $$props.style;
      }
    }),
    "component",
    StepEdgeInternal,
    35,
    0,
    { componentTag: "BaseEdge" }
  );
  return pop($$exports);
}

// node_modules/svelte/src/reactivity/url-search-params.js
var REPLACE = Symbol();
var SvelteURLSearchParams = class extends URLSearchParams {
  #version = true_default ? tag(state(0), "SvelteURLSearchParams version") : state(0);
  #url = get_current_url();
  #updating = false;
  #update_url() {
    if (!this.#url || this.#updating) return;
    this.#updating = true;
    const search = this.toString();
    this.#url.search = search && `?${search}`;
    this.#updating = false;
  }
  /**
   * @param {URLSearchParams} params
   * @internal
   */
  [REPLACE](params) {
    if (this.#updating) return;
    this.#updating = true;
    for (const key3 of [...super.keys()]) {
      super.delete(key3);
    }
    for (const [key3, value] of params) {
      super.append(key3, value);
    }
    increment(this.#version);
    this.#updating = false;
  }
  /**
   * @param {string} name
   * @param {string} value
   * @returns {void}
   */
  append(name, value) {
    super.append(name, value);
    this.#update_url();
    increment(this.#version);
  }
  /**
   * @param {string} name
   * @param {string=} value
   * @returns {void}
   */
  delete(name, value) {
    var has_value = super.has(name, value);
    super.delete(name, value);
    if (has_value) {
      this.#update_url();
      increment(this.#version);
    }
  }
  /**
   * @param {string} name
   * @returns {string|null}
   */
  get(name) {
    get(this.#version);
    return super.get(name);
  }
  /**
   * @param {string} name
   * @returns {string[]}
   */
  getAll(name) {
    get(this.#version);
    return super.getAll(name);
  }
  /**
   * @param {string} name
   * @param {string=} value
   * @returns {boolean}
   */
  has(name, value) {
    get(this.#version);
    return super.has(name, value);
  }
  keys() {
    get(this.#version);
    return super.keys();
  }
  /**
   * @param {string} name
   * @param {string} value
   * @returns {void}
   */
  set(name, value) {
    var previous = super.getAll(name).join("");
    super.set(name, value);
    if (previous !== super.getAll(name).join("")) {
      this.#update_url();
      increment(this.#version);
    }
  }
  sort() {
    super.sort();
    this.#update_url();
    increment(this.#version);
  }
  toString() {
    get(this.#version);
    return super.toString();
  }
  values() {
    get(this.#version);
    return super.values();
  }
  entries() {
    get(this.#version);
    return super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    get(this.#version);
    return super.size;
  }
};

// node_modules/svelte/src/reactivity/url.js
var current_url = null;
function get_current_url() {
  return current_url;
}

// node_modules/svelte/src/reactivity/reactive-value.js
var ReactiveValue = class {
  #fn;
  #subscribe;
  /**
   *
   * @param {() => T} fn
   * @param {(update: () => void) => void} onsubscribe
   */
  constructor(fn, onsubscribe) {
    this.#fn = fn;
    this.#subscribe = createSubscriber(onsubscribe);
  }
  get current() {
    this.#subscribe();
    return this.#fn();
  }
};

// node_modules/svelte/src/reactivity/media-query.js
var parenthesis_regex = /\(.+\)/;
var non_parenthesized_keywords = /* @__PURE__ */ new Set(["all", "print", "screen", "and", "or", "not", "only"]);
var MediaQuery = class extends ReactiveValue {
  /**
   * @param {string} query A media query string
   * @param {boolean} [fallback] Fallback value for the server
   */
  constructor(query, fallback2) {
    let final_query = parenthesis_regex.test(query) || // we need to use `some` here because technically this `window.matchMedia('random,screen')` still returns true
    query.split(/[\s,]+/).some((keyword) => non_parenthesized_keywords.has(keyword.trim())) ? query : `(${query})`;
    const q = window.matchMedia(final_query);
    super(
      () => q.matches,
      (update2) => on(q, "change", update2)
    );
  }
};

// node_modules/@xyflow/svelte/dist/lib/store/visibleElements.js
function getVisibleNodes(nodeLookup, transform2, width, height) {
  const visibleNodes = /* @__PURE__ */ new Map();
  getNodesInside(nodeLookup, { x: 0, y: 0, width, height }, transform2, true).forEach((node) => {
    visibleNodes.set(node.id, node);
  });
  return visibleNodes;
}
function getLayoutedEdges(options) {
  const { edges, defaultEdgeOptions, nodeLookup, previousEdges, connectionMode, onerror, onlyRenderVisible, elevateEdgesOnSelect, zIndexMode } = options;
  const layoutedEdges = /* @__PURE__ */ new Map();
  for (const edge of edges) {
    const sourceNode = nodeLookup.get(edge.source);
    const targetNode = nodeLookup.get(edge.target);
    if (!sourceNode || !targetNode) {
      continue;
    }
    if (onlyRenderVisible) {
      const { visibleNodes, transform: transform2, width, height } = options;
      if (isEdgeVisible({
        sourceNode,
        targetNode,
        width,
        height,
        transform: transform2
      })) {
        visibleNodes.set(sourceNode.id, sourceNode);
        visibleNodes.set(targetNode.id, targetNode);
      } else {
        continue;
      }
    }
    const previous = previousEdges.get(edge.id);
    if (previous && edge === previous.edge && sourceNode == previous.sourceNode && targetNode == previous.targetNode) {
      layoutedEdges.set(edge.id, previous);
      continue;
    }
    const edgePosition = getEdgePosition({
      id: edge.id,
      sourceNode,
      targetNode,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      connectionMode,
      onError: onerror
    });
    if (edgePosition) {
      layoutedEdges.set(edge.id, {
        ...defaultEdgeOptions,
        ...edge,
        ...edgePosition,
        zIndex: getElevatedEdgeZIndex({
          selected: edge.selected,
          zIndex: edge.zIndex ?? defaultEdgeOptions.zIndex,
          sourceNode,
          targetNode,
          elevateOnSelect: elevateEdgesOnSelect,
          zIndexMode
        }),
        sourceNode,
        targetNode,
        edge
      });
    }
  }
  return layoutedEdges;
}

// node_modules/@xyflow/svelte/dist/lib/store/initial-store.svelte.js
var initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  group: GroupNode
};
var initialEdgeTypes = {
  straight: StraightEdgeInternal,
  smoothstep: SmoothStepEdgeInternal,
  default: BezierEdge,
  step: StepEdgeInternal
};
function getInitialViewport(_nodesInitialized, fitView, initialViewport, width, height, nodeLookup) {
  if (fitView && !initialViewport && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
    });
    return getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  } else {
    return initialViewport ?? { x: 0, y: 0, zoom: 1 };
  }
}
function getInitialStore(signals) {
  class SvelteFlowStore {
    #flowId = user_derived(() => signals.props.id ?? "1");
    get flowId() {
      return get(this.#flowId);
    }
    set flowId(value) {
      set(this.#flowId, value);
    }
    #domNode = state(null);
    get domNode() {
      return get(this.#domNode);
    }
    set domNode(value) {
      set(this.#domNode, value);
    }
    #panZoom = state(null);
    get panZoom() {
      return get(this.#panZoom);
    }
    set panZoom(value) {
      set(this.#panZoom, value);
    }
    #width = state(signals.width ?? 0);
    get width() {
      return get(this.#width);
    }
    set width(value) {
      set(this.#width, value);
    }
    #height = state(signals.height ?? 0);
    get height() {
      return get(this.#height);
    }
    set height(value) {
      set(this.#height, value);
    }
    #zIndexMode = state(signals.props.zIndexMode ?? "basic");
    get zIndexMode() {
      return get(this.#zIndexMode);
    }
    set zIndexMode(value) {
      set(this.#zIndexMode, value);
    }
    #nodesInitialized = user_derived(() => {
      const nodesInitialized = adoptUserNodes(signals.nodes, this.nodeLookup, this.parentLookup, {
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin,
        elevateNodesOnSelect: signals.props.elevateNodesOnSelect ?? true,
        checkEquality: true,
        zIndexMode: this.zIndexMode
      });
      if (this.fitViewQueued && nodesInitialized) {
        if (this.fitViewOptions?.duration) {
          this.resolveFitView();
        } else {
          queueMicrotask(() => {
            this.resolveFitView();
          });
        }
      }
      return nodesInitialized;
    });
    get nodesInitialized() {
      return get(this.#nodesInitialized);
    }
    set nodesInitialized(value) {
      set(this.#nodesInitialized, value);
    }
    #viewportInitialized = user_derived(() => this.panZoom !== null);
    get viewportInitialized() {
      return get(this.#viewportInitialized);
    }
    set viewportInitialized(value) {
      set(this.#viewportInitialized, value);
    }
    #_edges = user_derived(() => {
      updateConnectionLookup(this.connectionLookup, this.edgeLookup, signals.edges);
      return signals.edges;
    });
    get _edges() {
      return get(this.#_edges);
    }
    set _edges(value) {
      set(this.#_edges, value);
    }
    get nodes() {
      this.nodesInitialized;
      return signals.nodes;
    }
    set nodes(nodes) {
      signals.nodes = nodes;
    }
    get edges() {
      return this._edges;
    }
    set edges(edges) {
      signals.edges = edges;
    }
    _prevSelectedNodes = [];
    _prevSelectedNodeIds = /* @__PURE__ */ new Set();
    #selectedNodes = user_derived(() => {
      const selectedNodesCount = this._prevSelectedNodeIds.size;
      const selectedNodeIds = /* @__PURE__ */ new Set();
      const selectedNodes = this.nodes.filter((node) => {
        if (node.selected) {
          selectedNodeIds.add(node.id);
          this._prevSelectedNodeIds.delete(node.id);
        }
        return node.selected;
      });
      if (selectedNodesCount !== selectedNodeIds.size || this._prevSelectedNodeIds.size > 0) {
        this._prevSelectedNodes = selectedNodes;
      }
      this._prevSelectedNodeIds = selectedNodeIds;
      return this._prevSelectedNodes;
    });
    get selectedNodes() {
      return get(this.#selectedNodes);
    }
    set selectedNodes(value) {
      set(this.#selectedNodes, value);
    }
    _prevSelectedEdges = [];
    _prevSelectedEdgeIds = /* @__PURE__ */ new Set();
    #selectedEdges = user_derived(() => {
      const selectedEdgesCount = this._prevSelectedEdgeIds.size;
      const selectedEdgeIds = /* @__PURE__ */ new Set();
      const selectedEdges = this.edges.filter((edge) => {
        if (edge.selected) {
          selectedEdgeIds.add(edge.id);
          this._prevSelectedEdgeIds.delete(edge.id);
        }
        return edge.selected;
      });
      if (selectedEdgesCount !== selectedEdgeIds.size || this._prevSelectedEdgeIds.size > 0) {
        this._prevSelectedEdges = selectedEdges;
      }
      this._prevSelectedEdgeIds = selectedEdgeIds;
      return this._prevSelectedEdges;
    });
    get selectedEdges() {
      return get(this.#selectedEdges);
    }
    set selectedEdges(value) {
      set(this.#selectedEdges, value);
    }
    selectionChangeHandlers = /* @__PURE__ */ new Map();
    nodeLookup = /* @__PURE__ */ new Map();
    parentLookup = /* @__PURE__ */ new Map();
    connectionLookup = /* @__PURE__ */ new Map();
    edgeLookup = /* @__PURE__ */ new Map();
    _prevVisibleEdges = /* @__PURE__ */ new Map();
    #visible = user_derived(() => {
      const {
        // We need to access this._nodes to trigger on changes
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nodes,
        _edges: edges,
        _prevVisibleEdges: previousEdges,
        nodeLookup,
        connectionMode,
        onerror,
        onlyRenderVisibleElements,
        defaultEdgeOptions,
        zIndexMode
      } = this;
      let visibleNodes;
      let visibleEdges;
      const options = {
        edges,
        defaultEdgeOptions,
        previousEdges,
        nodeLookup,
        connectionMode,
        elevateEdgesOnSelect: signals.props.elevateEdgesOnSelect ?? true,
        zIndexMode,
        onerror
      };
      if (onlyRenderVisibleElements) {
        const { viewport, width, height } = this;
        const transform2 = [viewport.x, viewport.y, viewport.zoom];
        visibleNodes = getVisibleNodes(nodeLookup, transform2, width, height);
        visibleEdges = getLayoutedEdges({
          ...options,
          onlyRenderVisible: true,
          visibleNodes,
          transform: transform2,
          width,
          height
        });
      } else {
        visibleNodes = this.nodeLookup;
        visibleEdges = getLayoutedEdges(options);
      }
      return { nodes: visibleNodes, edges: visibleEdges };
    });
    get visible() {
      return get(this.#visible);
    }
    set visible(value) {
      set(this.#visible, value);
    }
    #nodesDraggable = user_derived(() => signals.props.nodesDraggable ?? true);
    get nodesDraggable() {
      return get(this.#nodesDraggable);
    }
    set nodesDraggable(value) {
      set(this.#nodesDraggable, value);
    }
    #nodesConnectable = user_derived(() => signals.props.nodesConnectable ?? true);
    get nodesConnectable() {
      return get(this.#nodesConnectable);
    }
    set nodesConnectable(value) {
      set(this.#nodesConnectable, value);
    }
    #elementsSelectable = user_derived(() => signals.props.elementsSelectable ?? true);
    get elementsSelectable() {
      return get(this.#elementsSelectable);
    }
    set elementsSelectable(value) {
      set(this.#elementsSelectable, value);
    }
    #nodesFocusable = user_derived(() => signals.props.nodesFocusable ?? true);
    get nodesFocusable() {
      return get(this.#nodesFocusable);
    }
    set nodesFocusable(value) {
      set(this.#nodesFocusable, value);
    }
    #edgesFocusable = user_derived(() => signals.props.edgesFocusable ?? true);
    get edgesFocusable() {
      return get(this.#edgesFocusable);
    }
    set edgesFocusable(value) {
      set(this.#edgesFocusable, value);
    }
    #disableKeyboardA11y = user_derived(() => signals.props.disableKeyboardA11y ?? false);
    get disableKeyboardA11y() {
      return get(this.#disableKeyboardA11y);
    }
    set disableKeyboardA11y(value) {
      set(this.#disableKeyboardA11y, value);
    }
    #minZoom = user_derived(() => signals.props.minZoom ?? 0.5);
    get minZoom() {
      return get(this.#minZoom);
    }
    set minZoom(value) {
      set(this.#minZoom, value);
    }
    #maxZoom = user_derived(() => signals.props.maxZoom ?? 2);
    get maxZoom() {
      return get(this.#maxZoom);
    }
    set maxZoom(value) {
      set(this.#maxZoom, value);
    }
    #nodeOrigin = user_derived(() => signals.props.nodeOrigin ?? [0, 0]);
    get nodeOrigin() {
      return get(this.#nodeOrigin);
    }
    set nodeOrigin(value) {
      set(this.#nodeOrigin, value);
    }
    #nodeExtent = user_derived(() => signals.props.nodeExtent ?? infiniteExtent);
    get nodeExtent() {
      return get(this.#nodeExtent);
    }
    set nodeExtent(value) {
      set(this.#nodeExtent, value);
    }
    #translateExtent = user_derived(() => signals.props.translateExtent ?? infiniteExtent);
    get translateExtent() {
      return get(this.#translateExtent);
    }
    set translateExtent(value) {
      set(this.#translateExtent, value);
    }
    #defaultEdgeOptions = user_derived(() => signals.props.defaultEdgeOptions ?? {});
    get defaultEdgeOptions() {
      return get(this.#defaultEdgeOptions);
    }
    set defaultEdgeOptions(value) {
      set(this.#defaultEdgeOptions, value);
    }
    #nodeDragThreshold = user_derived(() => signals.props.nodeDragThreshold ?? 1);
    get nodeDragThreshold() {
      return get(this.#nodeDragThreshold);
    }
    set nodeDragThreshold(value) {
      set(this.#nodeDragThreshold, value);
    }
    #autoPanOnNodeDrag = user_derived(() => signals.props.autoPanOnNodeDrag ?? true);
    get autoPanOnNodeDrag() {
      return get(this.#autoPanOnNodeDrag);
    }
    set autoPanOnNodeDrag(value) {
      set(this.#autoPanOnNodeDrag, value);
    }
    #autoPanOnConnect = user_derived(() => signals.props.autoPanOnConnect ?? true);
    get autoPanOnConnect() {
      return get(this.#autoPanOnConnect);
    }
    set autoPanOnConnect(value) {
      set(this.#autoPanOnConnect, value);
    }
    #autoPanOnNodeFocus = user_derived(() => signals.props.autoPanOnNodeFocus ?? true);
    get autoPanOnNodeFocus() {
      return get(this.#autoPanOnNodeFocus);
    }
    set autoPanOnNodeFocus(value) {
      set(this.#autoPanOnNodeFocus, value);
    }
    #autoPanSpeed = user_derived(() => signals.props.autoPanSpeed ?? 15);
    get autoPanSpeed() {
      return get(this.#autoPanSpeed);
    }
    set autoPanSpeed(value) {
      set(this.#autoPanSpeed, value);
    }
    #connectionDragThreshold = user_derived(() => signals.props.connectionDragThreshold ?? 1);
    get connectionDragThreshold() {
      return get(this.#connectionDragThreshold);
    }
    set connectionDragThreshold(value) {
      set(this.#connectionDragThreshold, value);
    }
    fitViewQueued = signals.props.fitView ?? false;
    fitViewOptions = signals.props.fitViewOptions;
    fitViewResolver = null;
    #snapGrid = user_derived(() => signals.props.snapGrid ?? null);
    get snapGrid() {
      return get(this.#snapGrid);
    }
    set snapGrid(value) {
      set(this.#snapGrid, value);
    }
    #dragging = state(false);
    get dragging() {
      return get(this.#dragging);
    }
    set dragging(value) {
      set(this.#dragging, value);
    }
    #selectionRect = state(null);
    get selectionRect() {
      return get(this.#selectionRect);
    }
    set selectionRect(value) {
      set(this.#selectionRect, value);
    }
    #selectionKeyPressed = state(false);
    get selectionKeyPressed() {
      return get(this.#selectionKeyPressed);
    }
    set selectionKeyPressed(value) {
      set(this.#selectionKeyPressed, value);
    }
    #multiselectionKeyPressed = state(false);
    get multiselectionKeyPressed() {
      return get(this.#multiselectionKeyPressed);
    }
    set multiselectionKeyPressed(value) {
      set(this.#multiselectionKeyPressed, value);
    }
    #deleteKeyPressed = state(false);
    get deleteKeyPressed() {
      return get(this.#deleteKeyPressed);
    }
    set deleteKeyPressed(value) {
      set(this.#deleteKeyPressed, value);
    }
    #panActivationKeyPressed = state(false);
    get panActivationKeyPressed() {
      return get(this.#panActivationKeyPressed);
    }
    set panActivationKeyPressed(value) {
      set(this.#panActivationKeyPressed, value);
    }
    #zoomActivationKeyPressed = state(false);
    get zoomActivationKeyPressed() {
      return get(this.#zoomActivationKeyPressed);
    }
    set zoomActivationKeyPressed(value) {
      set(this.#zoomActivationKeyPressed, value);
    }
    #selectionRectMode = state(null);
    get selectionRectMode() {
      return get(this.#selectionRectMode);
    }
    set selectionRectMode(value) {
      set(this.#selectionRectMode, value);
    }
    #ariaLiveMessage = state("");
    get ariaLiveMessage() {
      return get(this.#ariaLiveMessage);
    }
    set ariaLiveMessage(value) {
      set(this.#ariaLiveMessage, value);
    }
    #selectionMode = user_derived(() => signals.props.selectionMode ?? SelectionMode.Partial);
    get selectionMode() {
      return get(this.#selectionMode);
    }
    set selectionMode(value) {
      set(this.#selectionMode, value);
    }
    #nodeTypes = user_derived(() => ({ ...initialNodeTypes, ...signals.props.nodeTypes }));
    get nodeTypes() {
      return get(this.#nodeTypes);
    }
    set nodeTypes(value) {
      set(this.#nodeTypes, value);
    }
    #edgeTypes = user_derived(() => ({ ...initialEdgeTypes, ...signals.props.edgeTypes }));
    get edgeTypes() {
      return get(this.#edgeTypes);
    }
    set edgeTypes(value) {
      set(this.#edgeTypes, value);
    }
    #noPanClass = user_derived(() => signals.props.noPanClass ?? "nopan");
    get noPanClass() {
      return get(this.#noPanClass);
    }
    set noPanClass(value) {
      set(this.#noPanClass, value);
    }
    #noDragClass = user_derived(() => signals.props.noDragClass ?? "nodrag");
    get noDragClass() {
      return get(this.#noDragClass);
    }
    set noDragClass(value) {
      set(this.#noDragClass, value);
    }
    #noWheelClass = user_derived(() => signals.props.noWheelClass ?? "nowheel");
    get noWheelClass() {
      return get(this.#noWheelClass);
    }
    set noWheelClass(value) {
      set(this.#noWheelClass, value);
    }
    #ariaLabelConfig = user_derived(() => mergeAriaLabelConfig(signals.props.ariaLabelConfig));
    get ariaLabelConfig() {
      return get(this.#ariaLabelConfig);
    }
    set ariaLabelConfig(value) {
      set(this.#ariaLabelConfig, value);
    }
    #_viewport = state(getInitialViewport(this.nodesInitialized, signals.props.fitView, signals.props.initialViewport, this.width, this.height, this.nodeLookup));
    get _viewport() {
      return get(this.#_viewport);
    }
    set _viewport(value) {
      set(this.#_viewport, value);
    }
    get viewport() {
      return signals.viewport ?? this._viewport;
    }
    set viewport(newViewport) {
      if (signals.viewport) {
        signals.viewport = newViewport;
      }
      this._viewport = newViewport;
    }
    #_connection = (
      // _connection is viewport independent and originating from XYHandle
      state(initialConnection)
    );
    get _connection() {
      return get(this.#_connection);
    }
    set _connection(value) {
      set(this.#_connection, value);
    }
    #connection = user_derived(() => {
      if (!this._connection.inProgress) {
        return this._connection;
      }
      return {
        ...this._connection,
        to: pointToRendererPoint(this._connection.to, [this.viewport.x, this.viewport.y, this.viewport.zoom])
      };
    });
    get connection() {
      return get(this.#connection);
    }
    set connection(value) {
      set(this.#connection, value);
    }
    #connectionMode = user_derived(() => signals.props.connectionMode ?? ConnectionMode.Strict);
    get connectionMode() {
      return get(this.#connectionMode);
    }
    set connectionMode(value) {
      set(this.#connectionMode, value);
    }
    #connectionRadius = user_derived(() => signals.props.connectionRadius ?? 20);
    get connectionRadius() {
      return get(this.#connectionRadius);
    }
    set connectionRadius(value) {
      set(this.#connectionRadius, value);
    }
    #isValidConnection = user_derived(() => signals.props.isValidConnection ?? (() => true));
    get isValidConnection() {
      return get(this.#isValidConnection);
    }
    set isValidConnection(value) {
      set(this.#isValidConnection, value);
    }
    #selectNodesOnDrag = user_derived(() => signals.props.selectNodesOnDrag ?? true);
    get selectNodesOnDrag() {
      return get(this.#selectNodesOnDrag);
    }
    set selectNodesOnDrag(value) {
      set(this.#selectNodesOnDrag, value);
    }
    #defaultMarkerColor = user_derived(() => signals.props.defaultMarkerColor === void 0 ? "#b1b1b7" : signals.props.defaultMarkerColor);
    get defaultMarkerColor() {
      return get(this.#defaultMarkerColor);
    }
    set defaultMarkerColor(value) {
      set(this.#defaultMarkerColor, value);
    }
    #markers = user_derived(() => {
      return createMarkerIds(signals.edges, {
        defaultColor: this.defaultMarkerColor,
        id: this.flowId,
        defaultMarkerStart: this.defaultEdgeOptions.markerStart,
        defaultMarkerEnd: this.defaultEdgeOptions.markerEnd
      });
    });
    get markers() {
      return get(this.#markers);
    }
    set markers(value) {
      set(this.#markers, value);
    }
    #onlyRenderVisibleElements = user_derived(() => signals.props.onlyRenderVisibleElements ?? false);
    get onlyRenderVisibleElements() {
      return get(this.#onlyRenderVisibleElements);
    }
    set onlyRenderVisibleElements(value) {
      set(this.#onlyRenderVisibleElements, value);
    }
    #onerror = user_derived(() => signals.props.onflowerror ?? devWarn);
    get onerror() {
      return get(this.#onerror);
    }
    set onerror(value) {
      set(this.#onerror, value);
    }
    #ondelete = user_derived(() => signals.props.ondelete);
    get ondelete() {
      return get(this.#ondelete);
    }
    set ondelete(value) {
      set(this.#ondelete, value);
    }
    #onbeforedelete = user_derived(() => signals.props.onbeforedelete);
    get onbeforedelete() {
      return get(this.#onbeforedelete);
    }
    set onbeforedelete(value) {
      set(this.#onbeforedelete, value);
    }
    #onbeforeconnect = user_derived(() => signals.props.onbeforeconnect);
    get onbeforeconnect() {
      return get(this.#onbeforeconnect);
    }
    set onbeforeconnect(value) {
      set(this.#onbeforeconnect, value);
    }
    #onconnect = user_derived(() => signals.props.onconnect);
    get onconnect() {
      return get(this.#onconnect);
    }
    set onconnect(value) {
      set(this.#onconnect, value);
    }
    #onconnectstart = user_derived(() => signals.props.onconnectstart);
    get onconnectstart() {
      return get(this.#onconnectstart);
    }
    set onconnectstart(value) {
      set(this.#onconnectstart, value);
    }
    #onconnectend = user_derived(() => signals.props.onconnectend);
    get onconnectend() {
      return get(this.#onconnectend);
    }
    set onconnectend(value) {
      set(this.#onconnectend, value);
    }
    #onbeforereconnect = user_derived(() => signals.props.onbeforereconnect);
    get onbeforereconnect() {
      return get(this.#onbeforereconnect);
    }
    set onbeforereconnect(value) {
      set(this.#onbeforereconnect, value);
    }
    #onreconnect = user_derived(() => signals.props.onreconnect);
    get onreconnect() {
      return get(this.#onreconnect);
    }
    set onreconnect(value) {
      set(this.#onreconnect, value);
    }
    #onreconnectstart = user_derived(() => signals.props.onreconnectstart);
    get onreconnectstart() {
      return get(this.#onreconnectstart);
    }
    set onreconnectstart(value) {
      set(this.#onreconnectstart, value);
    }
    #onreconnectend = user_derived(() => signals.props.onreconnectend);
    get onreconnectend() {
      return get(this.#onreconnectend);
    }
    set onreconnectend(value) {
      set(this.#onreconnectend, value);
    }
    #clickConnect = user_derived(() => signals.props.clickConnect ?? true);
    get clickConnect() {
      return get(this.#clickConnect);
    }
    set clickConnect(value) {
      set(this.#clickConnect, value);
    }
    #onclickconnectstart = user_derived(() => signals.props.onclickconnectstart);
    get onclickconnectstart() {
      return get(this.#onclickconnectstart);
    }
    set onclickconnectstart(value) {
      set(this.#onclickconnectstart, value);
    }
    #onclickconnectend = user_derived(() => signals.props.onclickconnectend);
    get onclickconnectend() {
      return get(this.#onclickconnectend);
    }
    set onclickconnectend(value) {
      set(this.#onclickconnectend, value);
    }
    #clickConnectStartHandle = state(null);
    get clickConnectStartHandle() {
      return get(this.#clickConnectStartHandle);
    }
    set clickConnectStartHandle(value) {
      set(this.#clickConnectStartHandle, value);
    }
    #onselectiondrag = user_derived(() => signals.props.onselectiondrag);
    get onselectiondrag() {
      return get(this.#onselectiondrag);
    }
    set onselectiondrag(value) {
      set(this.#onselectiondrag, value);
    }
    #onselectiondragstart = user_derived(() => signals.props.onselectiondragstart);
    get onselectiondragstart() {
      return get(this.#onselectiondragstart);
    }
    set onselectiondragstart(value) {
      set(this.#onselectiondragstart, value);
    }
    #onselectiondragstop = user_derived(() => signals.props.onselectiondragstop);
    get onselectiondragstop() {
      return get(this.#onselectiondragstop);
    }
    set onselectiondragstop(value) {
      set(this.#onselectiondragstop, value);
    }
    resolveFitView = async () => {
      if (!this.panZoom) {
        return;
      }
      await fitViewport(
        {
          nodes: this.nodeLookup,
          width: this.width,
          height: this.height,
          panZoom: this.panZoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom
        },
        this.fitViewOptions
      );
      this.fitViewResolver?.resolve(true);
      this.fitViewQueued = false;
      this.fitViewOptions = void 0;
      this.fitViewResolver = null;
    };
    _prefersDark = new MediaQuery("(prefers-color-scheme: dark)", signals.props.colorModeSSR === "dark");
    #colorMode = user_derived(() => signals.props.colorMode === "system" ? this._prefersDark.current ? "dark" : "light" : signals.props.colorMode ?? "light");
    get colorMode() {
      return get(this.#colorMode);
    }
    set colorMode(value) {
      set(this.#colorMode, value);
    }
    constructor() {
      if (true) {
        warnIfDeeplyReactive(signals.nodes, "nodes");
        warnIfDeeplyReactive(signals.edges, "edges");
      }
    }
    resetStoreValues() {
      this.dragging = false;
      this.selectionRect = null;
      this.selectionRectMode = null;
      this.selectionKeyPressed = false;
      this.multiselectionKeyPressed = false;
      this.deleteKeyPressed = false;
      this.panActivationKeyPressed = false;
      this.zoomActivationKeyPressed = false;
      this._connection = initialConnection;
      this.clickConnectStartHandle = null;
      this.viewport = signals.props.initialViewport ?? { x: 0, y: 0, zoom: 1 };
      this.ariaLiveMessage = "";
    }
  }
  return new SvelteFlowStore();
}
function warnIfDeeplyReactive(array2, name) {
  try {
    if (array2 && array2.length > 0) {
      structuredClone(array2[0]);
    }
  } catch {
    console.warn(`Use $state.raw for ${name} to prevent performance issues.`);
  }
}

// node_modules/@xyflow/svelte/dist/lib/hooks/useStore.js
function useStore() {
  const storeContext = getContext(key2);
  if (!storeContext) {
    throw new Error("To call useStore outside of <SvelteFlow /> you need to wrap your component in a <SvelteFlowProvider />");
  }
  return storeContext.getStore();
}

// node_modules/@xyflow/svelte/dist/lib/store/index.js
var key2 = Symbol();
function createStore(signals) {
  const store = getInitialStore(signals);
  function setNodeTypes(nodeTypes) {
    store.nodeTypes = {
      ...initialNodeTypes,
      ...nodeTypes
    };
  }
  function setEdgeTypes(edgeTypes) {
    store.edgeTypes = {
      ...initialEdgeTypes,
      ...edgeTypes
    };
  }
  function addEdge2(edgeParams) {
    store.edges = addEdge(edgeParams, store.edges);
  }
  const updateNodePositions = (nodeDragItems, dragging = false) => {
    store.nodes = store.nodes.map((node) => {
      if (store.connection.inProgress && store.connection.fromNode.id === node.id) {
        const internalNode = store.nodeLookup.get(node.id);
        if (internalNode) {
          store.connection = {
            ...store.connection,
            from: getHandlePosition(internalNode, store.connection.fromHandle, Position.Left, true)
          };
        }
      }
      const dragItem = nodeDragItems.get(node.id);
      return dragItem ? { ...node, position: dragItem.position, dragging } : node;
    });
  };
  function updateNodeInternals2(updates) {
    const { changes, updatedInternals } = updateNodeInternals(updates, store.nodeLookup, store.parentLookup, store.domNode, store.nodeOrigin, store.nodeExtent, store.zIndexMode);
    if (!updatedInternals) {
      return;
    }
    updateAbsolutePositions(store.nodeLookup, store.parentLookup, {
      nodeOrigin: store.nodeOrigin,
      nodeExtent: store.nodeExtent,
      zIndexMode: store.zIndexMode
    });
    if (store.fitViewQueued) {
      store.resolveFitView();
    }
    const newNodes = /* @__PURE__ */ new Map();
    for (const change of changes) {
      const userNode = store.nodeLookup.get(change.id)?.internals.userNode;
      if (!userNode) {
        continue;
      }
      const node = { ...userNode };
      switch (change.type) {
        case "dimensions": {
          const measured = { ...node.measured, ...change.dimensions };
          if (change.setAttributes) {
            node.width = change.dimensions?.width ?? node.width;
            node.height = change.dimensions?.height ?? node.height;
          }
          node.measured = measured;
          break;
        }
        case "position":
          node.position = change.position ?? node.position;
          break;
      }
      newNodes.set(change.id, node);
    }
    store.nodes = store.nodes.map((node) => newNodes.get(node.id) ?? node);
  }
  function fitView(options) {
    const fitViewResolver = store.fitViewResolver ?? Promise.withResolvers();
    store.fitViewQueued = true;
    store.fitViewOptions = options;
    store.fitViewResolver = fitViewResolver;
    store.nodes = [...store.nodes];
    return fitViewResolver.promise;
  }
  async function setCenter(x, y2, options) {
    const nextZoom = typeof options?.zoom !== "undefined" ? options.zoom : store.maxZoom;
    const currentPanZoom = store.panZoom;
    if (!currentPanZoom) {
      return Promise.resolve(false);
    }
    await currentPanZoom.setViewport({
      x: store.width / 2 - x * nextZoom,
      y: store.height / 2 - y2 * nextZoom,
      zoom: nextZoom
    }, { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate });
    return Promise.resolve(true);
  }
  function zoomBy(factor, options) {
    const panZoom = store.panZoom;
    if (!panZoom) {
      return Promise.resolve(false);
    }
    return panZoom.scaleBy(factor, options);
  }
  function zoomIn(options) {
    return zoomBy(1.2, options);
  }
  function zoomOut(options) {
    return zoomBy(1 / 1.2, options);
  }
  function setMinZoom(minZoom) {
    const panZoom = store.panZoom;
    if (panZoom) {
      panZoom.setScaleExtent([minZoom, store.maxZoom]);
      store.minZoom = minZoom;
    }
  }
  function setMaxZoom(maxZoom) {
    const panZoom = store.panZoom;
    if (panZoom) {
      panZoom.setScaleExtent([store.minZoom, maxZoom]);
      store.maxZoom = maxZoom;
    }
  }
  function setTranslateExtent(extent) {
    const panZoom = store.panZoom;
    if (panZoom) {
      panZoom.setTranslateExtent(extent);
      store.translateExtent = extent;
    }
  }
  function deselect(elements, elementsToDeselect = null) {
    let deselected = false;
    const newElements = elements.map((element2) => {
      const shouldDeselect = elementsToDeselect ? elementsToDeselect.has(element2.id) : true;
      if (shouldDeselect && element2.selected) {
        deselected = true;
        return { ...element2, selected: false };
      }
      return element2;
    });
    return [deselected, newElements];
  }
  function unselectNodesAndEdges(params) {
    const nodesToDeselect = params?.nodes ? new Set(params.nodes.map((node) => node.id)) : null;
    const [nodesDeselected, newNodes] = deselect(store.nodes, nodesToDeselect);
    if (nodesDeselected) {
      store.nodes = newNodes;
    }
    const edgesToDeselect = params?.edges ? new Set(params.edges.map((node) => node.id)) : null;
    const [edgesDeselected, newEdges] = deselect(store.edges, edgesToDeselect);
    if (edgesDeselected) {
      store.edges = newEdges;
    }
  }
  function addSelectedNodes(ids) {
    const isMultiSelection = store.multiselectionKeyPressed;
    store.nodes = store.nodes.map((node) => {
      const nodeWillBeSelected = ids.includes(node.id);
      const selected = isMultiSelection ? node.selected || nodeWillBeSelected : nodeWillBeSelected;
      if (!!node.selected !== selected) {
        return { ...node, selected };
      }
      return node;
    });
    if (!isMultiSelection) {
      unselectNodesAndEdges({ nodes: [] });
    }
  }
  function addSelectedEdges(ids) {
    const isMultiSelection = store.multiselectionKeyPressed;
    store.edges = store.edges.map((edge) => {
      const edgeWillBeSelected = ids.includes(edge.id);
      const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;
      if (!!edge.selected !== selected) {
        return { ...edge, selected };
      }
      return edge;
    });
    if (!isMultiSelection) {
      unselectNodesAndEdges({ edges: [] });
    }
  }
  function handleNodeSelection(id2, unselect, nodeRef) {
    const node = store.nodeLookup.get(id2);
    if (!node) {
      console.warn("012", errorMessages["error012"](id2));
      return;
    }
    store.selectionRect = null;
    store.selectionRectMode = null;
    if (!node.selected) {
      addSelectedNodes([id2]);
    } else if (unselect || node.selected && store.multiselectionKeyPressed) {
      unselectNodesAndEdges({ nodes: [node], edges: [] });
      requestAnimationFrame(() => nodeRef?.blur());
    }
  }
  function handleEdgeSelection(id2) {
    const edge = store.edgeLookup.get(id2);
    if (!edge) {
      console.warn("012", errorMessages["error012"](id2));
      return;
    }
    const selectable = edge.selectable || store.elementsSelectable && typeof edge.selectable === "undefined";
    if (selectable) {
      store.selectionRect = null;
      store.selectionRectMode = null;
      if (!edge.selected) {
        addSelectedEdges([id2]);
      } else if (edge.selected && store.multiselectionKeyPressed) {
        unselectNodesAndEdges({ nodes: [], edges: [edge] });
      }
    }
  }
  function moveSelectedNodes(direction, factor) {
    const { nodeExtent, snapGrid, nodeOrigin, nodeLookup, nodesDraggable, onerror } = store;
    const nodeUpdates = /* @__PURE__ */ new Map();
    const xVelo = snapGrid?.[0] ?? 5;
    const yVelo = snapGrid?.[1] ?? 5;
    const xDiff = direction.x * xVelo * factor;
    const yDiff = direction.y * yVelo * factor;
    for (const node of nodeLookup.values()) {
      const isSelected = node.selected && (node.draggable || nodesDraggable && typeof node.draggable === "undefined");
      if (!isSelected) {
        continue;
      }
      let nextPosition = {
        x: node.internals.positionAbsolute.x + xDiff,
        y: node.internals.positionAbsolute.y + yDiff
      };
      if (snapGrid) {
        nextPosition = snapPosition(nextPosition, snapGrid);
      }
      const { position, positionAbsolute } = calculateNodePosition({
        nodeId: node.id,
        nextPosition,
        nodeLookup,
        nodeExtent,
        nodeOrigin,
        onError: onerror
      });
      node.position = position;
      node.internals.positionAbsolute = positionAbsolute;
      nodeUpdates.set(node.id, node);
    }
    updateNodePositions(nodeUpdates);
  }
  function panBy2(delta) {
    return panBy({
      delta,
      panZoom: store.panZoom,
      transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
      translateExtent: store.translateExtent,
      width: store.width,
      height: store.height
    });
  }
  const updateConnection = (newConnection) => {
    store._connection = { ...newConnection };
  };
  function cancelConnection() {
    store._connection = initialConnection;
  }
  function reset2() {
    store.resetStoreValues();
    unselectNodesAndEdges();
  }
  const storeWithActions = Object.assign(store, {
    setNodeTypes,
    setEdgeTypes,
    addEdge: addEdge2,
    updateNodePositions,
    updateNodeInternals: updateNodeInternals2,
    zoomIn,
    zoomOut,
    fitView,
    setCenter,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    unselectNodesAndEdges,
    addSelectedNodes,
    addSelectedEdges,
    handleNodeSelection,
    handleEdgeSelection,
    moveSelectedNodes,
    panBy: panBy2,
    updateConnection,
    cancelConnection,
    reset: reset2
  });
  return storeWithActions;
}

// node_modules/@xyflow/svelte/dist/lib/actions/zoom/index.js
function zoom(domNode, params) {
  const { minZoom, maxZoom, initialViewport, onPanZoomStart, onPanZoom, onPanZoomEnd, translateExtent, setPanZoomInstance, onDraggingChange, onTransformChange } = params;
  const panZoomInstance = XYPanZoom({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport: initialViewport,
    onPanZoom,
    onPanZoomStart,
    onPanZoomEnd,
    onDraggingChange
  });
  const viewport = panZoomInstance.getViewport();
  if (initialViewport.x !== viewport.x || initialViewport.y !== viewport.y || initialViewport.zoom !== viewport.zoom) {
    onTransformChange([viewport.x, viewport.y, viewport.zoom]);
  }
  setPanZoomInstance(panZoomInstance);
  panZoomInstance.update(params);
  return {
    update(params2) {
      panZoomInstance.update(params2);
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/container/Zoom/Zoom.svelte
Zoom[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Zoom/Zoom.svelte";
var root8 = add_locations(from_html(`<div class="svelte-flow__zoom svelte-flow__container"><!></div>`), Zoom[FILENAME], [[42, 0]]);
function Zoom($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Zoom);
  var $$ownership_validator = create_ownership_validator($$props);
  let store = prop($$props, "store", 15);
  let panOnDragActive = tag(user_derived(() => store().panActivationKeyPressed || $$props.panOnDrag), "panOnDragActive");
  let panOnScrollActive = tag(user_derived(() => store().panActivationKeyPressed || $$props.panOnScroll), "panOnScrollActive");
  const { viewport: initialViewport } = store();
  let onInitCalled = false;
  user_effect(() => {
    if (!onInitCalled && store().viewportInitialized) {
      $$props.oninit?.();
      onInitCalled = true;
    }
  });
  var $$exports = { ...legacy_api() };
  var div = root8();
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children), "render", Zoom, 80, 2);
  reset(div);
  action(div, ($$node, $$action_arg) => zoom?.($$node, $$action_arg), () => ({
    viewport: store().viewport,
    minZoom: store().minZoom,
    maxZoom: store().maxZoom,
    initialViewport,
    onDraggingChange: (dragging) => {
      $$ownership_validator.mutation("store", ["store", "dragging"], store(store().dragging = dragging, true), 50, 6);
    },
    setPanZoomInstance: (instance) => {
      $$ownership_validator.mutation("store", ["store", "panZoom"], store(store().panZoom = instance, true), 53, 6);
    },
    onPanZoomStart: $$props.onmovestart,
    onPanZoom: $$props.onmove,
    onPanZoomEnd: $$props.onmoveend,
    zoomOnScroll: $$props.zoomOnScroll,
    zoomOnDoubleClick: $$props.zoomOnDoubleClick,
    zoomOnPinch: $$props.zoomOnPinch,
    panOnScroll: get(panOnScrollActive),
    panOnDrag: get(panOnDragActive),
    panOnScrollSpeed: $$props.panOnScrollSpeed,
    panOnScrollMode: $$props.panOnScrollMode,
    zoomActivationKeyPressed: store().zoomActivationKeyPressed,
    preventScrolling: strict_equals(typeof $$props.preventScrolling, "boolean") ? $$props.preventScrolling : true,
    noPanClassName: store().noPanClass,
    noWheelClassName: store().noWheelClass,
    userSelectionActive: !!store().selectionRect,
    translateExtent: store().translateExtent,
    lib: "svelte",
    paneClickDistance: $$props.paneClickDistance,
    selectionOnDrag: $$props.selectionOnDrag,
    onTransformChange: (transform2) => {
      $$ownership_validator.mutation("store", ["store", "viewport"], store(store().viewport = { x: transform2[0], y: transform2[1], zoom: transform2[2] }, true), 75, 6);
    },
    connectionInProgress: store().connection.inProgress
  }));
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/Pane/Pane.svelte
Pane[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Pane/Pane.svelte";
function wrapHandler(handler, container) {
  return (event2) => {
    if (strict_equals(event2.target, container, false)) {
      return;
    }
    handler?.(event2);
  };
}
function toggleSelected(ids) {
  return (item) => {
    const isSelected = ids.has(item.id);
    if (strict_equals(!!item.selected, isSelected, false)) {
      return { ...item, selected: isSelected };
    }
    return item;
  };
}
function isSetEqual(a, b) {
  if (strict_equals(a.size, b.size, false)) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
}
var root9 = add_locations(from_html(`<div><!></div>`), Pane[FILENAME], [[252, 0]]);
function Pane($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Pane);
  var $$ownership_validator = create_ownership_validator($$props);
  let store = prop($$props, "store", 15), panOnDrag = prop($$props, "panOnDrag", 3, true), paneClickDistance = prop($$props, "paneClickDistance", 3, 1);
  let container;
  let containerBounds = null;
  let selectedNodeIds = /* @__PURE__ */ new Set();
  let selectedEdgeIds = /* @__PURE__ */ new Set();
  let panOnDragActive = tag(user_derived(() => store().panActivationKeyPressed || panOnDrag()), "panOnDragActive");
  let isSelecting = tag(user_derived(() => store().selectionKeyPressed || !!store().selectionRect || $$props.selectionOnDrag && strict_equals(get(panOnDragActive), true, false)), "isSelecting");
  let isSelectionEnabled = tag(user_derived(() => store().elementsSelectable && (get(isSelecting) || strict_equals(store().selectionRectMode, "user"))), "isSelectionEnabled");
  let selectionInProgress = false;
  function onPointerDownCapture(event2) {
    containerBounds = container?.getBoundingClientRect();
    if (!containerBounds) return;
    const eventTargetIsContainer = strict_equals(event2.target, container);
    const isNoKeyEvent = !eventTargetIsContainer && !!event2.target.closest(".nokey");
    const isSelectionActive = $$props.selectionOnDrag && eventTargetIsContainer || store().selectionKeyPressed;
    if (isNoKeyEvent || !get(isSelecting) || !isSelectionActive || strict_equals(event2.button, 0, false) || !event2.isPrimary) {
      return;
    }
    event2.target?.setPointerCapture?.(event2.pointerId);
    selectionInProgress = false;
    const { x, y: y2 } = getEventPosition(event2, containerBounds);
    $$ownership_validator.mutation("store", ["store", "selectionRect"], store(store().selectionRect = { width: 0, height: 0, startX: x, startY: y2, x, y: y2 }, true), 110, 4);
    if (!eventTargetIsContainer) {
      event2.stopPropagation();
      event2.preventDefault();
    }
  }
  function onPointerMove(event2) {
    if (!get(isSelecting) || !containerBounds || !store().selectionRect) {
      return;
    }
    const mousePos = getEventPosition(event2, containerBounds);
    const { startX = 0, startY = 0 } = store().selectionRect;
    if (!selectionInProgress) {
      const requiredDistance = store().selectionKeyPressed ? 0 : paneClickDistance();
      const distance2 = Math.hypot(mousePos.x - startX, mousePos.y - startY);
      if (distance2 <= requiredDistance) {
        return;
      }
      store().unselectNodesAndEdges();
      $$props.onselectionstart?.(event2);
    }
    selectionInProgress = true;
    const nextUserSelectRect = {
      ...store().selectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    };
    const prevSelectedNodeIds = selectedNodeIds;
    const prevSelectedEdgeIds = selectedEdgeIds;
    selectedNodeIds = new Set(getNodesInside(
      store().nodeLookup,
      nextUserSelectRect,
      [
        store().viewport.x,
        store().viewport.y,
        store().viewport.zoom
      ],
      strict_equals(store().selectionMode, SelectionMode.Partial),
      true
    ).map((n) => n.id));
    const edgesSelectable = store().defaultEdgeOptions.selectable ?? true;
    selectedEdgeIds = /* @__PURE__ */ new Set();
    for (const nodeId of selectedNodeIds) {
      const connections = store().connectionLookup.get(nodeId);
      if (!connections) continue;
      for (const { edgeId } of connections.values()) {
        const edge = store().edgeLookup.get(edgeId);
        if (edge && (edge.selectable ?? edgesSelectable)) {
          selectedEdgeIds.add(edgeId);
        }
      }
    }
    if (!isSetEqual(prevSelectedNodeIds, selectedNodeIds)) {
      $$ownership_validator.mutation("store", ["store", "nodes"], store(store().nodes = store().nodes.map(toggleSelected(selectedNodeIds)), true), 183, 6);
    }
    if (!isSetEqual(prevSelectedEdgeIds, selectedEdgeIds)) {
      $$ownership_validator.mutation("store", ["store", "edges"], store(store().edges = store().edges.map(toggleSelected(selectedEdgeIds)), true), 187, 6);
    }
    $$ownership_validator.mutation("store", ["store", "selectionRectMode"], store(store().selectionRectMode = "user", true), 190, 4);
    $$ownership_validator.mutation("store", ["store", "selectionRect"], store(store().selectionRect = nextUserSelectRect, true), 191, 4);
  }
  function onPointerUp(event2) {
    if (strict_equals(event2.button, 0, false)) {
      return;
    }
    event2.target?.releasePointerCapture?.(event2.pointerId);
    if (!selectionInProgress && strict_equals(event2.target, container)) {
      onClick?.(event2);
    }
    $$ownership_validator.mutation("store", ["store", "selectionRect"], store(store().selectionRect = null, true), 208, 4);
    if (selectionInProgress) {
      $$ownership_validator.mutation("store", ["store", "selectionRectMode"], store(store().selectionRectMode = selectedNodeIds.size > 0 ? "nodes" : null, true), 211, 6);
    }
    if (selectionInProgress) {
      $$props.onselectionend?.(event2);
    }
  }
  const onContextMenu = (event2) => {
    if (Array.isArray(get(panOnDragActive)) && get(panOnDragActive).includes(2)) {
      event2.preventDefault();
      return;
    }
    $$props.onpanecontextmenu?.({ event: event2 });
  };
  const onClickCapture = (event2) => {
    if (selectionInProgress) {
      event2.stopPropagation();
      selectionInProgress = false;
    }
  };
  function onClick(event2) {
    if (selectionInProgress || store().connection.inProgress) {
      selectionInProgress = false;
      return;
    }
    $$props.onpaneclick?.({ event: event2 });
    store().unselectNodesAndEdges();
    $$ownership_validator.mutation("store", ["store", "selectionRectMode"], store(store().selectionRectMode = null, true), 245, 4);
    $$ownership_validator.mutation("store", ["store", "selectionRect"], store(store().selectionRect = null, true), 246, 4);
  }
  var $$exports = { ...legacy_api() };
  var div = root9();
  let classes;
  var event_handler = user_derived(() => get(isSelectionEnabled) ? void 0 : wrapHandler(onClick, container));
  var event_handler_1 = user_derived(() => wrapHandler(onContextMenu, container));
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children), "render", Pane, 265, 2);
  reset(div);
  bind_this(div, ($$value) => container = $$value, () => container);
  template_effect(($0) => classes = set_class(div, 1, "svelte-flow__pane svelte-flow__container", null, classes, $0), [
    () => ({
      draggable: strict_equals(panOnDrag(), true) || Array.isArray(panOnDrag()) && panOnDrag().includes(0),
      dragging: store().dragging,
      selection: get(isSelecting)
    })
  ]);
  delegated("click", div, function(...$$args) {
    apply(() => get(event_handler), this, $$args, Pane, [258, 11]);
  });
  event(
    "pointerdown",
    div,
    function(...$$args) {
      apply(() => get(isSelectionEnabled) ? onPointerDownCapture : void 0, this, $$args, Pane, [259, 24]);
    },
    true
  );
  delegated("pointermove", div, function(...$$args) {
    apply(() => get(isSelectionEnabled) ? onPointerMove : void 0, this, $$args, Pane, [260, 17]);
  });
  delegated("pointerup", div, function(...$$args) {
    apply(() => get(isSelectionEnabled) ? onPointerUp : void 0, this, $$args, Pane, [261, 15]);
  });
  delegated("contextmenu", div, function(...$$args) {
    apply(() => get(event_handler_1), this, $$args, Pane, [262, 17], true);
  });
  event(
    "click",
    div,
    function(...$$args) {
      apply(() => get(isSelectionEnabled) ? onClickCapture : void 0, this, $$args, Pane, [263, 18]);
    },
    true
  );
  append($$anchor, div);
  return pop($$exports);
}
delegate(["click", "pointermove", "pointerup", "contextmenu"]);

// node_modules/@xyflow/svelte/dist/lib/container/Viewport/Viewport.svelte
Viewport[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Viewport/Viewport.svelte";
var root10 = add_locations(from_html(`<div class="svelte-flow__viewport xyflow__viewport svelte-flow__container"><!></div>`), Viewport[FILENAME], [[12, 0]]);
function Viewport($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Viewport);
  var $$exports = { ...legacy_api() };
  var div = root10();
  let styles;
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children), "render", Viewport, 17, 2);
  reset(div);
  template_effect(() => styles = set_style(div, "", styles, {
    transform: `translate(${$$props.store.viewport.x ?? ""}px, ${$$props.store.viewport.y ?? ""}px) scale(${$$props.store.viewport.zoom ?? ""})`
  }));
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/actions/drag/index.js
function drag(domNode, params) {
  const { store, onDrag, onDragStart, onDragStop, onNodeMouseDown } = params;
  const dragInstance = XYDrag({
    onDrag,
    onDragStart,
    onDragStop,
    onNodeMouseDown,
    getStoreItems: () => {
      const { snapGrid, viewport } = store;
      return {
        nodes: store.nodes,
        nodeLookup: store.nodeLookup,
        edges: store.edges,
        nodeExtent: store.nodeExtent,
        snapGrid: snapGrid ? snapGrid : [0, 0],
        snapToGrid: !!snapGrid,
        nodeOrigin: store.nodeOrigin,
        multiSelectionActive: store.multiselectionKeyPressed,
        domNode: store.domNode,
        transform: [viewport.x, viewport.y, viewport.zoom],
        autoPanOnNodeDrag: store.autoPanOnNodeDrag,
        nodesDraggable: store.nodesDraggable,
        selectNodesOnDrag: store.selectNodesOnDrag,
        nodeDragThreshold: store.nodeDragThreshold,
        unselectNodesAndEdges: store.unselectNodesAndEdges,
        updateNodePositions: store.updateNodePositions,
        onSelectionDrag: store.onselectiondrag,
        onSelectionDragStart: store.onselectiondragstart,
        onSelectionDragStop: store.onselectiondragstop,
        panBy: store.panBy
      };
    }
  });
  function updateDrag(domNode2, params2) {
    if (params2.disabled) {
      dragInstance.destroy();
      return;
    }
    dragInstance.update({
      domNode: domNode2,
      noDragClassName: params2.noDragClass,
      handleSelector: params2.handleSelector,
      nodeId: params2.nodeId,
      isSelectable: params2.isSelectable,
      nodeClickDistance: params2.nodeClickDistance
    });
  }
  updateDrag(domNode, params);
  return {
    update(params2) {
      updateDrag(domNode, params2);
    },
    destroy() {
      dragInstance.destroy();
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/components/A11yDescriptions/A11yDescriptions.svelte
A11yDescriptions[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/A11yDescriptions/A11yDescriptions.svelte";
var root_12 = add_locations(from_html(`<div aria-live="assertive" aria-atomic="true" class="a11y-live-msg svelte-13pq11u"> </div>`), A11yDescriptions[FILENAME], [[19, 2]]);
var root11 = add_locations(from_html(`<div class="a11y-hidden svelte-13pq11u"> </div> <div class="a11y-hidden svelte-13pq11u"> </div> <!>`, 1), A11yDescriptions[FILENAME], [[9, 0], [14, 0]]);
var $$css2 = {
  hash: "svelte-13pq11u",
  code: "\n  .a11y-hidden.svelte-13pq11u {\n    display: none;\n  }\n\n  .a11y-live-msg.svelte-13pq11u {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    margin: -1px;\n    border: 0;\n    padding: 0;\n    overflow: hidden;\n    clip: rect(0px, 0px, 0px, 0px);\n    clip-path: inset(100%);\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQTExeURlc2NyaXB0aW9ucy5zdmVsdGUiLCJzb3VyY2VzIjpbIkExMXlEZXNjcmlwdGlvbnMuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCIgZ2VuZXJpY3M9XCJOb2RlVHlwZSBleHRlbmRzIE5vZGUgPSBOb2RlLCBFZGdlVHlwZSBleHRlbmRzIEVkZ2UgPSBFZGdlXCI+XG4gIGltcG9ydCB0eXBlIHsgU3ZlbHRlRmxvd1N0b3JlIH0gZnJvbSAnLi4vLi4vc3RvcmUvdHlwZXMnO1xuICBpbXBvcnQgdHlwZSB7IE5vZGUsIEVkZ2UgfSBmcm9tICcuLi8uLi90eXBlcyc7XG4gIGltcG9ydCB7IEFSSUFfRURHRV9ERVNDX0tFWSwgQVJJQV9MSVZFX01FU1NBR0UsIEFSSUFfTk9ERV9ERVNDX0tFWSB9IGZyb20gJy4nO1xuXG4gIGxldCB7IHN0b3JlIH06IHsgc3RvcmU6IFN2ZWx0ZUZsb3dTdG9yZTxOb2RlVHlwZSwgRWRnZVR5cGU+IH0gPSAkcHJvcHMoKTtcbjwvc2NyaXB0PlxuXG48ZGl2IGlkPXtgJHtBUklBX05PREVfREVTQ19LRVl9LSR7c3RvcmUuZmxvd0lkfWB9IGNsYXNzPVwiYTExeS1oaWRkZW5cIj5cbiAge3N0b3JlLmRpc2FibGVLZXlib2FyZEExMXlcbiAgICA/IHN0b3JlLmFyaWFMYWJlbENvbmZpZ1snbm9kZS5hMTF5RGVzY3JpcHRpb24uZGVmYXVsdCddXG4gICAgOiBzdG9yZS5hcmlhTGFiZWxDb25maWdbJ25vZGUuYTExeURlc2NyaXB0aW9uLmtleWJvYXJkRGlzYWJsZWQnXX1cbjwvZGl2PlxuPGRpdiBpZD17YCR7QVJJQV9FREdFX0RFU0NfS0VZfS0ke3N0b3JlLmZsb3dJZH1gfSBjbGFzcz1cImExMXktaGlkZGVuXCI+XG4gIHtzdG9yZS5hcmlhTGFiZWxDb25maWdbJ2VkZ2UuYTExeURlc2NyaXB0aW9uLmRlZmF1bHQnXX1cbjwvZGl2PlxuXG57I2lmICFzdG9yZS5kaXNhYmxlS2V5Ym9hcmRBMTF5fVxuICA8ZGl2XG4gICAgaWQ9e2Ake0FSSUFfTElWRV9NRVNTQUdFfS0ke3N0b3JlLmZsb3dJZH1gfVxuICAgIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiXG4gICAgYXJpYS1hdG9taWM9XCJ0cnVlXCJcbiAgICBjbGFzcz1cImExMXktbGl2ZS1tc2dcIlxuICA+XG4gICAge3N0b3JlLmFyaWFMaXZlTWVzc2FnZX1cbiAgPC9kaXY+XG57L2lmfVxuXG48c3R5bGU+XG4gIC5hMTF5LWhpZGRlbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIC5hMTF5LWxpdmUtbXNnIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDFweDtcbiAgICBoZWlnaHQ6IDFweDtcbiAgICBtYXJnaW46IC0xcHg7XG4gICAgYm9yZGVyOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBjbGlwOiByZWN0KDBweCwgMHB4LCAwcHgsIDBweCk7XG4gICAgY2xpcC1wYXRoOiBpbnNldCgxMDAlKTtcbiAgfVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBNkJBLEVBQUUsMkJBQVksQ0FBQztBQUNmLElBQUksYUFBYTtBQUNqQjs7QUFFQSxFQUFFLDZCQUFjLENBQUM7QUFDakIsSUFBSSxrQkFBa0I7QUFDdEIsSUFBSSxVQUFVO0FBQ2QsSUFBSSxXQUFXO0FBQ2YsSUFBSSxZQUFZO0FBQ2hCLElBQUksU0FBUztBQUNiLElBQUksVUFBVTtBQUNkLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksOEJBQThCO0FBQ2xDLElBQUksc0JBQXNCO0FBQzFCOyJ9 */"
};
function A11yDescriptions($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, A11yDescriptions);
  append_styles($$anchor, $$css2);
  var $$exports = { ...legacy_api() };
  var fragment = root11();
  var div = first_child(fragment);
  var text2 = child(div, true);
  reset(div);
  var div_1 = sibling(div, 2);
  var text_1 = child(div_1, true);
  reset(div_1);
  var node = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_2 = root_12();
      var text_2 = child(div_2, true);
      reset(div_2);
      template_effect(() => {
        set_attribute2(div_2, "id", `${ARIA_LIVE_MESSAGE}-${$$props.store.flowId}`);
        set_text(text_2, $$props.store.ariaLiveMessage);
      });
      append($$anchor2, div_2);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (!$$props.store.disableKeyboardA11y) $$render(consequent);
      }),
      "if",
      A11yDescriptions,
      18,
      0
    );
  }
  template_effect(() => {
    set_attribute2(div, "id", `${ARIA_NODE_DESC_KEY}-${$$props.store.flowId}`);
    set_text(text2, $$props.store.disableKeyboardA11y ? $$props.store.ariaLabelConfig["node.a11yDescription.default"] : $$props.store.ariaLabelConfig["node.a11yDescription.keyboardDisabled"]);
    set_attribute2(div_1, "id", `${ARIA_EDGE_DESC_KEY}-${$$props.store.flowId}`);
    set_text(text_1, $$props.store.ariaLabelConfig["edge.a11yDescription.default"]);
  });
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/A11yDescriptions/index.js
var ARIA_NODE_DESC_KEY = "svelte-flow__node-desc";
var ARIA_EDGE_DESC_KEY = "svelte-flow__edge-desc";
var ARIA_LIVE_MESSAGE = "svelte-flow__aria-live";

// node_modules/@xyflow/svelte/dist/lib/components/NodeWrapper/NodeWrapper.svelte
NodeWrapper[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/NodeWrapper/NodeWrapper.svelte";
var root_13 = add_locations(from_html(`<div><!></div>`), NodeWrapper[FILENAME], [[237, 2]]);
function NodeWrapper($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, NodeWrapper);
  var $$ownership_validator = create_ownership_validator($$props);
  let store = prop($$props, "store", 15);
  let data = tag(user_derived(() => fallback($$props.node.data, () => ({}), true)), "data"), selected = tag(user_derived(() => fallback($$props.node.selected, false)), "selected"), _draggable = tag(user_derived(() => $$props.node.draggable), "_draggable"), _selectable = tag(user_derived(() => $$props.node.selectable), "_selectable"), deletable = tag(user_derived(() => fallback($$props.node.deletable, true)), "deletable"), _connectable = tag(user_derived(() => $$props.node.connectable), "_connectable"), _focusable = tag(user_derived(() => $$props.node.focusable), "_focusable"), hidden = tag(user_derived(() => fallback($$props.node.hidden, false)), "hidden"), dragging = tag(user_derived(() => fallback($$props.node.dragging, false)), "dragging"), style = tag(user_derived(() => fallback($$props.node.style, "")), "style"), className = tag(user_derived(() => $$props.node.class), "className"), type = tag(user_derived(() => fallback($$props.node.type, "default")), "type"), parentId = tag(user_derived(() => $$props.node.parentId), "parentId"), sourcePosition = tag(user_derived(() => $$props.node.sourcePosition), "sourcePosition"), targetPosition = tag(user_derived(() => $$props.node.targetPosition), "targetPosition"), measuredWidth = tag(user_derived(() => fallback($$props.node.measured, () => ({ width: 0, height: 0 }), true).width), "measuredWidth"), measuredHeight = tag(user_derived(() => fallback($$props.node.measured, () => ({ width: 0, height: 0 }), true).height), "measuredHeight"), initialWidth = tag(user_derived(() => $$props.node.initialWidth), "initialWidth"), initialHeight = tag(user_derived(() => $$props.node.initialHeight), "initialHeight"), width = tag(user_derived(() => $$props.node.width), "width"), height = tag(user_derived(() => $$props.node.height), "height"), dragHandle = tag(user_derived(() => $$props.node.dragHandle), "dragHandle"), zIndex = tag(user_derived(() => fallback($$props.node.internals.z, 0)), "zIndex"), positionX = tag(user_derived(() => $$props.node.internals.positionAbsolute.x), "positionX"), positionY = tag(user_derived(() => $$props.node.internals.positionAbsolute.y), "positionY"), userNode = tag(user_derived(() => $$props.node.internals.userNode), "userNode");
  let { id: id2 } = $$props.node;
  let draggable = tag(user_derived(() => get(_draggable) ?? store().nodesDraggable), "draggable");
  let selectable = tag(user_derived(() => get(_selectable) ?? store().elementsSelectable), "selectable");
  let connectable = tag(user_derived(() => get(_connectable) ?? store().nodesConnectable), "connectable");
  let hasDimensions = tag(user_derived(() => nodeHasDimensions($$props.node)), "hasDimensions");
  let hasHandleBounds = tag(user_derived(() => !!$$props.node.internals.handleBounds), "hasHandleBounds");
  let isInitialized = tag(user_derived(() => get(hasDimensions) && get(hasHandleBounds)), "isInitialized");
  let focusable = tag(user_derived(() => get(_focusable) ?? store().nodesFocusable), "focusable");
  function isInParentLookup(id3) {
    return store().parentLookup.has(id3);
  }
  let isParent = tag(user_derived(() => isInParentLookup(id2)), "isParent");
  let nodeRef = tag(state(null), "nodeRef");
  let prevNodeRef = null;
  let prevType = get(type);
  let prevSourcePosition = get(sourcePosition);
  let prevTargetPosition = get(targetPosition);
  let NodeComponent = tag(user_derived(() => store().nodeTypes[get(type)] ?? DefaultNode), "NodeComponent");
  let ariaLabelConfig = tag(user_derived(() => store().ariaLabelConfig), "ariaLabelConfig");
  let connectableContext = {
    get value() {
      return get(connectable);
    }
  };
  setNodeIdContext(id2);
  setNodeConnectableContext(connectableContext);
  if (strict_equals("development", "development")) {
    user_effect(() => {
      const valid = !!store().nodeTypes[get(type)];
      if (!valid) {
        console.warn(...log_if_contains_state("warn", "003", errorMessages["error003"](get(type))));
      }
    });
  }
  let nodeStyle = tag(
    user_derived(() => {
      const w = strict_equals(get(measuredWidth), void 0) ? get(width) ?? get(initialWidth) : get(width);
      const h = strict_equals(get(measuredHeight), void 0) ? get(height) ?? get(initialHeight) : get(height);
      if (strict_equals(w, void 0) && strict_equals(h, void 0) && strict_equals(get(style), void 0)) {
        return void 0;
      }
      return `${get(style)};${w ? `width:${toPxString(w)};` : ""}${h ? `height:${toPxString(h)};` : ""}`;
    }),
    "nodeStyle"
  );
  user_effect(() => {
    const doUpdate = strict_equals(get(type), prevType, false) || strict_equals(get(sourcePosition), prevSourcePosition, false) || strict_equals(get(targetPosition), prevTargetPosition, false);
    if (doUpdate && strict_equals(get(nodeRef), null, false)) {
      requestAnimationFrame(() => {
        if (strict_equals(get(nodeRef), null, false)) {
          store().updateNodeInternals(/* @__PURE__ */ new Map([[id2, { id: id2, nodeElement: get(nodeRef), force: true }]]));
        }
      });
    }
    prevType = get(type);
    prevSourcePosition = get(sourcePosition);
    prevTargetPosition = get(targetPosition);
  });
  user_effect(() => {
    if ($$props.resizeObserver && (!get(isInitialized) || strict_equals(get(nodeRef), prevNodeRef, false))) {
      prevNodeRef && $$props.resizeObserver.unobserve(prevNodeRef);
      get(nodeRef) && $$props.resizeObserver.observe(get(nodeRef));
      prevNodeRef = get(nodeRef);
    }
  });
  onDestroy(() => {
    if (prevNodeRef) {
      $$props.resizeObserver?.unobserve(prevNodeRef);
    }
  });
  function onSelectNodeHandler(event2) {
    if (get(selectable) && (!store().selectNodesOnDrag || !get(draggable) || store().nodeDragThreshold > 0)) {
      store().handleNodeSelection(id2);
    }
    $$props.onnodeclick?.({ node: get(userNode), event: event2 });
  }
  function onKeyDown(event2) {
    if (isInputDOMNode(event2) || store().disableKeyboardA11y) {
      return;
    }
    if (elementSelectionKeys.includes(event2.key) && get(selectable)) {
      const unselect = strict_equals(event2.key, "Escape");
      store().handleNodeSelection(id2, unselect, get(nodeRef));
    } else if (get(draggable) && $$props.node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event2.key)) {
      event2.preventDefault();
      $$ownership_validator.mutation(
        "store",
        ["store", "ariaLiveMessage"],
        store(
          store().ariaLiveMessage = get(ariaLabelConfig)["node.a11yDescription.ariaLiveMessage"]({
            direction: event2.key.replace("Arrow", "").toLowerCase(),
            x: ~~$$props.node.internals.positionAbsolute.x,
            y: ~~$$props.node.internals.positionAbsolute.y
          }),
          true
        ),
        198,
        6
      );
      store().moveSelectedNodes(arrowKeyDiffs[event2.key], event2.shiftKey ? 4 : 1);
    }
  }
  const onFocus = () => {
    if (store().disableKeyboardA11y || !store().autoPanOnNodeFocus || !get(nodeRef)?.matches(":focus-visible")) {
      return;
    }
    const { width: width2, height: height2, viewport } = store();
    const withinViewport = getNodesInside(/* @__PURE__ */ new Map([[id2, $$props.node]]), { x: 0, y: 0, width: width2, height: height2 }, [viewport.x, viewport.y, viewport.zoom], true).length > 0;
    if (!withinViewport) {
      store().setCenter($$props.node.position.x + ($$props.node.measured.width ?? 0) / 2, $$props.node.position.y + ($$props.node.measured.height ?? 0) / 2, { zoom: viewport.zoom });
    }
  };
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node_1 = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var div = root_13();
      attribute_effect(div, () => ({
        "data-id": id2,
        class: [
          "svelte-flow__node",
          `svelte-flow__node-${get(type)}`,
          get(className)
        ],
        style: get(nodeStyle),
        onclick: onSelectNodeHandler,
        onpointerenter: $$props.onnodepointerenter ? (event2) => $$props.onnodepointerenter({ node: get(userNode), event: event2 }) : void 0,
        onpointerleave: $$props.onnodepointerleave ? (event2) => $$props.onnodepointerleave({ node: get(userNode), event: event2 }) : void 0,
        onpointermove: $$props.onnodepointermove ? (event2) => $$props.onnodepointermove({ node: get(userNode), event: event2 }) : void 0,
        oncontextmenu: $$props.onnodecontextmenu ? (event2) => $$props.onnodecontextmenu({ node: get(userNode), event: event2 }) : void 0,
        onkeydown: get(focusable) ? onKeyDown : void 0,
        onfocus: get(focusable) ? onFocus : void 0,
        tabIndex: get(focusable) ? 0 : void 0,
        role: $$props.node.ariaRole ?? (get(focusable) ? "group" : void 0),
        "aria-roledescription": "node",
        "aria-describedby": store().disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${store().flowId}`,
        ...$$props.node.domAttributes,
        [CLASS]: {
          dragging: get(dragging),
          selected: get(selected),
          draggable: get(draggable),
          connectable: get(connectable),
          selectable: get(selectable),
          nopan: get(draggable),
          parent: get(isParent)
        },
        [STYLE]: {
          "z-index": get(zIndex),
          transform: `translate(${get(positionX) ?? ""}px, ${get(positionY) ?? ""}px)`,
          visibility: get(hasDimensions) ? "visible" : "hidden"
        }
      }));
      var node_2 = child(div);
      add_svelte_meta(
        () => component(node_2, () => get(NodeComponent), ($$anchor3, NodeComponent_1) => {
          NodeComponent_1($$anchor3, {
            get data() {
              return get(data);
            },
            get id() {
              return id2;
            },
            get selected() {
              return get(selected);
            },
            get selectable() {
              return get(selectable);
            },
            get deletable() {
              return get(deletable);
            },
            get sourcePosition() {
              return get(sourcePosition);
            },
            get targetPosition() {
              return get(targetPosition);
            },
            get zIndex() {
              return get(zIndex);
            },
            get dragging() {
              return get(dragging);
            },
            get draggable() {
              return get(draggable);
            },
            get dragHandle() {
              return get(dragHandle);
            },
            get parentId() {
              return get(parentId);
            },
            get type() {
              return get(type);
            },
            get isConnectable() {
              return get(connectable);
            },
            get positionAbsoluteX() {
              return get(positionX);
            },
            get positionAbsoluteY() {
              return get(positionY);
            },
            get width() {
              return get(width);
            },
            get height() {
              return get(height);
            }
          });
        }),
        "component",
        NodeWrapper,
        298,
        4,
        { componentTag: "NodeComponent" }
      );
      reset(div);
      action(div, ($$node, $$action_arg) => drag?.($$node, $$action_arg), () => ({
        nodeId: id2,
        isSelectable: get(selectable),
        disabled: !get(draggable),
        handleSelector: get(dragHandle),
        noDragClass: store().noDragClass,
        nodeClickDistance: $$props.nodeClickDistance,
        onNodeMouseDown: store().handleNodeSelection,
        onDrag: (event2, _2, targetNode, nodes) => {
          $$props.onnodedrag?.({ event: event2, targetNode, nodes });
        },
        onDragStart: (event2, _2, targetNode, nodes) => {
          $$props.onnodedragstart?.({ event: event2, targetNode, nodes });
        },
        onDragStop: (event2, _2, targetNode, nodes) => {
          $$props.onnodedragstop?.({ event: event2, targetNode, nodes });
        },
        store: store()
      }));
      bind_this(div, ($$value) => set(nodeRef, $$value), () => get(nodeRef));
      append($$anchor2, div);
    };
    add_svelte_meta(
      () => if_block(node_1, ($$render) => {
        if (!get(hidden)) $$render(consequent);
      }),
      "if",
      NodeWrapper,
      236,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/NodeRenderer/NodeRenderer.svelte
NodeRenderer[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/NodeRenderer/NodeRenderer.svelte";
var root12 = add_locations(from_html(`<div class="svelte-flow__nodes"></div>`), NodeRenderer[FILENAME], [[50, 0]]);
function NodeRenderer($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, NodeRenderer);
  var $$ownership_validator = create_ownership_validator($$props);
  let store = prop($$props, "store", 15);
  const resizeObserver = strict_equals(typeof ResizeObserver, "undefined") ? null : new ResizeObserver((entries) => {
    const updates = /* @__PURE__ */ new Map();
    entries.forEach((entry) => {
      const id2 = entry.target.getAttribute("data-id");
      updates.set(id2, { id: id2, nodeElement: entry.target, force: true });
    });
    store().updateNodeInternals(updates);
  });
  onDestroy(() => {
    resizeObserver?.disconnect();
  });
  var $$exports = { ...legacy_api() };
  var div = root12();
  add_svelte_meta(
    () => each(div, 21, () => store().visible.nodes.values(), (node) => node.id, ($$anchor2, node) => {
      {
        $$ownership_validator.binding("store", NodeWrapper, store);
        add_svelte_meta(
          () => NodeWrapper($$anchor2, {
            get node() {
              return get(node);
            },
            get resizeObserver() {
              return resizeObserver;
            },
            get nodeClickDistance() {
              return $$props.nodeClickDistance;
            },
            get onnodeclick() {
              return $$props.onnodeclick;
            },
            get onnodepointerenter() {
              return $$props.onnodepointerenter;
            },
            get onnodepointermove() {
              return $$props.onnodepointermove;
            },
            get onnodepointerleave() {
              return $$props.onnodepointerleave;
            },
            get onnodedrag() {
              return $$props.onnodedrag;
            },
            get onnodedragstart() {
              return $$props.onnodedragstart;
            },
            get onnodedragstop() {
              return $$props.onnodedragstop;
            },
            get onnodecontextmenu() {
              return $$props.onnodecontextmenu;
            },
            get store() {
              return store();
            },
            set store($$value) {
              store($$value);
            }
          }),
          "component",
          NodeRenderer,
          52,
          4,
          { componentTag: "NodeWrapper" }
        );
      }
    }),
    "each",
    NodeRenderer,
    51,
    2
  );
  reset(div);
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/EdgeWrapper/EdgeWrapper.svelte
EdgeWrapper[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/EdgeWrapper/EdgeWrapper.svelte";
var root_14 = add_locations(from_svg(`<svg class="svelte-flow__edge-wrapper"><g><!></g></svg>`), EdgeWrapper[FILENAME], [[110, 2, [[111, 4]]]]);
function EdgeWrapper($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, EdgeWrapper);
  let id2 = tag(user_derived(() => $$props.edge.id), "id"), source2 = tag(user_derived(() => $$props.edge.source), "source"), target = tag(user_derived(() => $$props.edge.target), "target"), sourceX = tag(user_derived(() => $$props.edge.sourceX), "sourceX"), sourceY = tag(user_derived(() => $$props.edge.sourceY), "sourceY"), targetX = tag(user_derived(() => $$props.edge.targetX), "targetX"), targetY = tag(user_derived(() => $$props.edge.targetY), "targetY"), sourcePosition = tag(user_derived(() => $$props.edge.sourcePosition), "sourcePosition"), targetPosition = tag(user_derived(() => $$props.edge.targetPosition), "targetPosition"), animated = tag(user_derived(() => fallback($$props.edge.animated, false)), "animated"), selected = tag(user_derived(() => fallback($$props.edge.selected, false)), "selected"), label2 = tag(user_derived(() => $$props.edge.label), "label"), labelStyle = tag(user_derived(() => $$props.edge.labelStyle), "labelStyle"), data = tag(user_derived(() => fallback($$props.edge.data, () => ({}), true)), "data"), style = tag(user_derived(() => $$props.edge.style), "style"), interactionWidth = tag(user_derived(() => $$props.edge.interactionWidth), "interactionWidth"), type = tag(user_derived(() => fallback($$props.edge.type, "default")), "type"), sourceHandle = tag(user_derived(() => $$props.edge.sourceHandle), "sourceHandle"), targetHandle = tag(user_derived(() => $$props.edge.targetHandle), "targetHandle"), markerStart = tag(user_derived(() => $$props.edge.markerStart), "markerStart"), markerEnd = tag(user_derived(() => $$props.edge.markerEnd), "markerEnd"), _selectable = tag(user_derived(() => $$props.edge.selectable), "_selectable"), _focusable = tag(user_derived(() => $$props.edge.focusable), "_focusable"), deletable = tag(user_derived(() => fallback($$props.edge.deletable, true)), "deletable"), hidden = tag(user_derived(() => $$props.edge.hidden), "hidden"), zIndex = tag(user_derived(() => $$props.edge.zIndex), "zIndex"), className = tag(user_derived(() => $$props.edge.class), "className"), ariaLabel = tag(user_derived(() => $$props.edge.ariaLabel), "ariaLabel");
  setEdgeIdContext(get(id2));
  let edgeRef = null;
  let selectable = tag(user_derived(() => get(_selectable) ?? $$props.store.elementsSelectable), "selectable");
  let focusable = tag(user_derived(() => get(_focusable) ?? $$props.store.edgesFocusable), "focusable");
  let EdgeComponent = tag(user_derived(() => $$props.store.edgeTypes[get(type)] ?? BezierEdge), "EdgeComponent");
  let markerStartUrl = tag(
    user_derived(() => get(markerStart) ? `url('#${getMarkerId(get(markerStart), $$props.store.flowId)}')` : void 0),
    "markerStartUrl"
  );
  let markerEndUrl = tag(
    user_derived(() => get(markerEnd) ? `url('#${getMarkerId(get(markerEnd), $$props.store.flowId)}')` : void 0),
    "markerEndUrl"
  );
  function onclick(event2) {
    const edge = $$props.store.edgeLookup.get(get(id2));
    if (edge) {
      if (get(selectable)) $$props.store.handleEdgeSelection(get(id2));
      $$props.onedgeclick?.({ event: event2, edge });
    }
  }
  function onmouseevent(event2, callback) {
    const edge = $$props.store.edgeLookup.get(get(id2));
    if (edge) {
      callback({ event: event2, edge });
    }
  }
  function onkeydown(event2) {
    if (!$$props.store.disableKeyboardA11y && elementSelectionKeys.includes(event2.key) && get(selectable)) {
      const { unselectNodesAndEdges, addSelectedEdges } = $$props.store;
      const unselect = strict_equals(event2.key, "Escape");
      if (unselect) {
        edgeRef?.blur();
        unselectNodesAndEdges({ edges: [$$props.edge] });
      } else {
        addSelectedEdges([get(id2)]);
      }
    }
  }
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var svg = root_14();
      let styles;
      var g = child(svg);
      attribute_effect(g, () => ({
        class: ["svelte-flow__edge", get(className)],
        "data-id": get(id2),
        onclick,
        oncontextmenu: $$props.onedgecontextmenu ? (e) => {
          onmouseevent(e, $$props.onedgecontextmenu);
        } : void 0,
        onpointerenter: $$props.onedgepointerenter ? (e) => {
          onmouseevent(e, $$props.onedgepointerenter);
        } : void 0,
        onpointerleave: $$props.onedgepointerleave ? (e) => {
          onmouseevent(e, $$props.onedgepointerleave);
        } : void 0,
        "aria-label": strict_equals(get(ariaLabel), null) ? void 0 : get(ariaLabel) ? get(ariaLabel) : `Edge from ${get(source2)} to ${get(target)}`,
        "aria-describedby": get(focusable) ? `${ARIA_EDGE_DESC_KEY}-${$$props.store.flowId}` : void 0,
        role: $$props.edge.ariaRole ?? (get(focusable) ? "group" : "img"),
        "aria-roledescription": "edge",
        onkeydown: get(focusable) ? onkeydown : void 0,
        tabindex: get(focusable) ? 0 : void 0,
        ...$$props.edge.domAttributes,
        [CLASS]: {
          animated: get(animated),
          selected: get(selected),
          selectable: get(selectable)
        }
      }));
      var node_1 = child(g);
      add_svelte_meta(
        () => component(node_1, () => get(EdgeComponent), ($$anchor3, EdgeComponent_1) => {
          EdgeComponent_1($$anchor3, {
            get id() {
              return get(id2);
            },
            get source() {
              return get(source2);
            },
            get target() {
              return get(target);
            },
            get sourceX() {
              return get(sourceX);
            },
            get sourceY() {
              return get(sourceY);
            },
            get targetX() {
              return get(targetX);
            },
            get targetY() {
              return get(targetY);
            },
            get sourcePosition() {
              return get(sourcePosition);
            },
            get targetPosition() {
              return get(targetPosition);
            },
            get animated() {
              return get(animated);
            },
            get selected() {
              return get(selected);
            },
            get label() {
              return get(label2);
            },
            get labelStyle() {
              return get(labelStyle);
            },
            get data() {
              return get(data);
            },
            get style() {
              return get(style);
            },
            get interactionWidth() {
              return get(interactionWidth);
            },
            get selectable() {
              return get(selectable);
            },
            get deletable() {
              return get(deletable);
            },
            get type() {
              return get(type);
            },
            get sourceHandleId() {
              return get(sourceHandle);
            },
            get targetHandleId() {
              return get(targetHandle);
            },
            get markerStart() {
              return get(markerStartUrl);
            },
            get markerEnd() {
              return get(markerEndUrl);
            }
          });
        }),
        "component",
        EdgeWrapper,
        146,
        6,
        { componentTag: "EdgeComponent" }
      );
      reset(g);
      bind_this(g, ($$value) => edgeRef = $$value, () => edgeRef);
      reset(svg);
      template_effect(() => styles = set_style(svg, "", styles, { "z-index": get(zIndex) }));
      append($$anchor2, svg);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (!get(hidden)) $$render(consequent);
      }),
      "if",
      EdgeWrapper,
      109,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/svelte/src/internal/flags/legacy.js
enable_legacy_mode_flag();

// node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/MarkerDefinition/MarkerDefinition.svelte
MarkerDefinition[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/MarkerDefinition/MarkerDefinition.svelte";
var root13 = add_locations(from_svg(`<defs></defs>`), MarkerDefinition[FILENAME], [[8, 0]]);
function MarkerDefinition($$anchor, $$props) {
  check_target(new.target);
  push($$props, false, MarkerDefinition);
  const store = useStore();
  var $$exports = { ...legacy_api() };
  init();
  var defs = root13();
  add_svelte_meta(
    () => each(defs, 5, () => store.markers, (marker) => marker.id, ($$anchor2, marker) => {
      add_svelte_meta(() => Marker($$anchor2, spread_props(() => get(marker))), "component", MarkerDefinition, 10, 4, { componentTag: "Marker" });
    }),
    "each",
    MarkerDefinition,
    9,
    2
  );
  reset(defs);
  append($$anchor, defs);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/MarkerDefinition/Marker.svelte
Marker[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/MarkerDefinition/Marker.svelte";
var root_15 = add_locations(from_svg(`<polyline class="arrow" fill="none" stroke-linecap="round" stroke-linejoin="round" points="-5,-4 0,0 -5,4"></polyline>`), Marker[FILENAME], [[28, 4]]);
var root_2 = add_locations(from_svg(`<polyline class="arrowclosed" stroke-linecap="round" stroke-linejoin="round" points="-5,-4 0,0 -5,4 -5,-4"></polyline>`), Marker[FILENAME], [[38, 4]]);
var root14 = add_locations(from_svg(`<marker class="svelte-flow__arrowhead" viewBox="-10 -10 20 20" refX="0" refY="0"><!></marker>`), Marker[FILENAME], [[16, 0]]);
function Marker($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Marker);
  let width = prop($$props, "width", 3, 12.5), height = prop($$props, "height", 3, 12.5), markerUnits = prop($$props, "markerUnits", 3, "strokeWidth"), orient = prop($$props, "orient", 3, "auto-start-reverse"), color2 = prop($$props, "color", 3, "none");
  var $$exports = { ...legacy_api() };
  var marker = root14();
  var node = child(marker);
  {
    var consequent = ($$anchor2) => {
      var polyline = root_15();
      let styles;
      template_effect(() => {
        set_attribute2(polyline, "stroke-width", $$props.strokeWidth);
        styles = set_style(polyline, "", styles, { stroke: color2() });
      });
      append($$anchor2, polyline);
    };
    var consequent_1 = ($$anchor2) => {
      var polyline_1 = root_2();
      let styles_1;
      template_effect(() => {
        set_attribute2(polyline_1, "stroke-width", $$props.strokeWidth);
        styles_1 = set_style(polyline_1, "", styles_1, { stroke: color2(), fill: color2() });
      });
      append($$anchor2, polyline_1);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (strict_equals($$props.type, MarkerType.Arrow)) $$render(consequent);
        else if (strict_equals($$props.type, MarkerType.ArrowClosed)) $$render(consequent_1, 1);
      }),
      "if",
      Marker,
      27,
      2
    );
  }
  reset(marker);
  template_effect(() => {
    set_attribute2(marker, "id", $$props.id);
    set_attribute2(marker, "markerWidth", `${width()}`);
    set_attribute2(marker, "markerHeight", `${height()}`);
    set_attribute2(marker, "markerUnits", markerUnits());
    set_attribute2(marker, "orient", orient());
  });
  append($$anchor, marker);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/EdgeRenderer.svelte
EdgeRenderer[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/EdgeRenderer/EdgeRenderer.svelte";
var root15 = add_locations(from_html(`<div class="svelte-flow__edges"><svg class="svelte-flow__marker"><!></svg> <!></div>`), EdgeRenderer[FILENAME], [[16, 0, [[17, 2]]]]);
function EdgeRenderer($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, EdgeRenderer);
  var $$ownership_validator = create_ownership_validator($$props);
  let store = prop($$props, "store", 15);
  var $$exports = { ...legacy_api() };
  var div = root15();
  var svg = child(div);
  var node = child(svg);
  add_svelte_meta(() => MarkerDefinition(node, {}), "component", EdgeRenderer, 18, 4, { componentTag: "MarkerDefinition" });
  reset(svg);
  var node_1 = sibling(svg, 2);
  add_svelte_meta(
    () => each(node_1, 17, () => store().visible.edges.values(), (edge) => edge.id, ($$anchor2, edge) => {
      {
        $$ownership_validator.binding("store", EdgeWrapper, store);
        add_svelte_meta(
          () => EdgeWrapper($$anchor2, {
            get edge() {
              return get(edge);
            },
            get onedgeclick() {
              return $$props.onedgeclick;
            },
            get onedgecontextmenu() {
              return $$props.onedgecontextmenu;
            },
            get onedgepointerenter() {
              return $$props.onedgepointerenter;
            },
            get onedgepointerleave() {
              return $$props.onedgepointerleave;
            },
            get store() {
              return store();
            },
            set store($$value) {
              store($$value);
            }
          }),
          "component",
          EdgeRenderer,
          22,
          4,
          { componentTag: "EdgeWrapper" }
        );
      }
    }),
    "each",
    EdgeRenderer,
    21,
    2
  );
  reset(div);
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/Selection/Selection.svelte
Selection3[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/Selection/Selection.svelte";
var root_16 = add_locations(from_html(`<div class="svelte-flow__selection svelte-1vr3gfi"></div>`), Selection3[FILENAME], [[20, 2]]);
var $$css3 = {
  hash: "svelte-1vr3gfi",
  code: "\n  .svelte-flow__selection.svelte-1vr3gfi {\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uLnN2ZWx0ZSIsInNvdXJjZXMiOlsiU2VsZWN0aW9uLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyB0b1B4U3RyaW5nIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG4gIGxldCB7XG4gICAgeCA9IDAsXG4gICAgeSA9IDAsXG4gICAgd2lkdGggPSAwLFxuICAgIGhlaWdodCA9IDAsXG4gICAgaXNWaXNpYmxlID0gdHJ1ZVxuICB9OiB7XG4gICAgeD86IG51bWJlcjtcbiAgICB5PzogbnVtYmVyO1xuICAgIHdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodD86IG51bWJlciB8IHN0cmluZztcbiAgICBpc1Zpc2libGU/OiBib29sZWFuO1xuICB9ID0gJHByb3BzKCk7XG48L3NjcmlwdD5cblxueyNpZiBpc1Zpc2libGV9XG4gIDxkaXZcbiAgICBjbGFzcz1cInN2ZWx0ZS1mbG93X19zZWxlY3Rpb25cIlxuICAgIHN0eWxlOndpZHRoPXt0eXBlb2Ygd2lkdGggPT09ICdzdHJpbmcnID8gd2lkdGggOiB0b1B4U3RyaW5nKHdpZHRoKX1cbiAgICBzdHlsZTpoZWlnaHQ9e3R5cGVvZiBoZWlnaHQgPT09ICdzdHJpbmcnID8gaGVpZ2h0IDogdG9QeFN0cmluZyhoZWlnaHQpfVxuICAgIHN0eWxlOnRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3h9cHgsICR7eX1weClgfVxuICA+PC9kaXY+XG57L2lmfVxuXG48c3R5bGU+XG4gIC5zdmVsdGUtZmxvd19fc2VsZWN0aW9uIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQTRCQSxFQUFFLHNDQUF1QixDQUFDO0FBQzFCLElBQUksa0JBQWtCO0FBQ3RCLElBQUksTUFBTTtBQUNWLElBQUksT0FBTztBQUNYOyJ9 */"
};
function Selection3($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Selection3);
  append_styles($$anchor, $$css3);
  let x = prop($$props, "x", 3, 0), y2 = prop($$props, "y", 3, 0), width = prop($$props, "width", 3, 0), height = prop($$props, "height", 3, 0), isVisible = prop($$props, "isVisible", 3, true);
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var div = root_16();
      let styles;
      template_effect(($0) => styles = set_style(div, "", styles, $0), [
        () => ({
          width: strict_equals(typeof width(), "string") ? width() : toPxString(width()),
          height: strict_equals(typeof height(), "string") ? height() : toPxString(height()),
          transform: `translate(${x()}px, ${y2()}px)`
        })
      ]);
      append($$anchor2, div);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (isVisible()) $$render(consequent);
      }),
      "if",
      Selection3,
      19,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/NodeSelection/NodeSelection.svelte
NodeSelection[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/NodeSelection/NodeSelection.svelte";
var root_17 = add_locations(from_html(`<div><!></div>`), NodeSelection[FILENAME], [[63, 2]]);
var $$css4 = {
  hash: "svelte-sf2y5e",
  code: "\n  .svelte-flow__selection-wrapper.svelte-sf2y5e {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 2000;\n    pointer-events: all;\n  }\n\n  .svelte-flow__selection-wrapper.svelte-sf2y5e:focus,\n  .svelte-flow__selection-wrapper.svelte-sf2y5e:focus-visible {\n    outline: none;\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZVNlbGVjdGlvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIk5vZGVTZWxlY3Rpb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCIgZ2VuZXJpY3M9XCJOb2RlVHlwZSBleHRlbmRzIE5vZGUgPSBOb2RlLCBFZGdlVHlwZSBleHRlbmRzIEVkZ2UgPSBFZGdlXCI+XG4gIGltcG9ydCB7IGdldEludGVybmFsTm9kZXNCb3VuZHMsIGlzTnVtZXJpYywgdHlwZSBSZWN0IH0gZnJvbSAnQHh5Zmxvdy9zeXN0ZW0nO1xuXG4gIGltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4uL1NlbGVjdGlvbic7XG4gIGltcG9ydCBkcmFnIGZyb20gJy4uLy4uL2FjdGlvbnMvZHJhZyc7XG5cbiAgaW1wb3J0IHR5cGUgeyBOb2RlU2VsZWN0aW9uUHJvcHMgfSBmcm9tICcuL3R5cGVzJztcbiAgaW1wb3J0IHsgYXJyb3dLZXlEaWZmcywgdG9QeFN0cmluZyB9IGZyb20gJy4uLy4uL3V0aWxzJztcbiAgaW1wb3J0IHR5cGUgeyBOb2RlLCBFZGdlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG4gIGxldCB7XG4gICAgc3RvcmUgPSAkYmluZGFibGUoKSxcbiAgICBvbm5vZGVkcmFnLFxuICAgIG9ubm9kZWRyYWdzdGFydCxcbiAgICBvbm5vZGVkcmFnc3RvcCxcbiAgICBvbnNlbGVjdGlvbmNsaWNrLFxuICAgIG9uc2VsZWN0aW9uY29udGV4dG1lbnVcbiAgfTogTm9kZVNlbGVjdGlvblByb3BzPE5vZGVUeXBlLCBFZGdlVHlwZT4gPSAkcHJvcHMoKTtcblxuICBsZXQgcmVmID0gJHN0YXRlPEhUTUxEaXZFbGVtZW50PigpO1xuXG4gICRlZmZlY3QoKCkgPT4ge1xuICAgIGlmICghc3RvcmUuZGlzYWJsZUtleWJvYXJkQTExeSkge1xuICAgICAgcmVmPy5mb2N1cyh7XG4gICAgICAgIHByZXZlbnRTY3JvbGw6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgbGV0IGJvdW5kczogUmVjdCB8IG51bGwgPSAkZGVyaXZlZC5ieSgoKSA9PiB7XG4gICAgaWYgKHN0b3JlLnNlbGVjdGlvblJlY3RNb2RlID09PSAnbm9kZXMnKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgc3RvcmUubm9kZXM7XG4gICAgICBjb25zdCBub2RlQm91bmRzID0gZ2V0SW50ZXJuYWxOb2Rlc0JvdW5kcyhzdG9yZS5ub2RlTG9va3VwLCB7XG4gICAgICAgIGZpbHRlcjogKG5vZGUpID0+ICEhbm9kZS5zZWxlY3RlZFxuICAgICAgfSk7XG4gICAgICBpZiAobm9kZUJvdW5kcy53aWR0aCA+IDAgJiYgbm9kZUJvdW5kcy5oZWlnaHQgPiAwKSB7XG4gICAgICAgIHJldHVybiBub2RlQm91bmRzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gb25jb250ZXh0bWVudShldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBzdG9yZS5ub2Rlcy5maWx0ZXIoKG4pID0+IG4uc2VsZWN0ZWQpO1xuICAgIG9uc2VsZWN0aW9uY29udGV4dG1lbnU/Lih7IG5vZGVzOiBzZWxlY3RlZE5vZGVzLCBldmVudCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gc3RvcmUubm9kZXMuZmlsdGVyKChuKSA9PiBuLnNlbGVjdGVkKTtcbiAgICBvbnNlbGVjdGlvbmNsaWNrPy4oeyBub2Rlczogc2VsZWN0ZWROb2RlcywgZXZlbnQgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbmtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFycm93S2V5RGlmZnMsIGV2ZW50LmtleSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzdG9yZS5tb3ZlU2VsZWN0ZWROb2RlcyhhcnJvd0tleURpZmZzW2V2ZW50LmtleV0sIGV2ZW50LnNoaWZ0S2V5ID8gNCA6IDEpO1xuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgc3RvcmUuc2VsZWN0aW9uUmVjdE1vZGUgPT09ICdub2RlcycgJiYgYm91bmRzICYmIGlzTnVtZXJpYyhib3VuZHMueCkgJiYgaXNOdW1lcmljKGJvdW5kcy55KX1cbiAgPGRpdlxuICAgIGNsYXNzPXtbJ3N2ZWx0ZS1mbG93X19zZWxlY3Rpb24td3JhcHBlcicsIHN0b3JlLm5vUGFuQ2xhc3NdfVxuICAgIHN0eWxlOndpZHRoPXt0b1B4U3RyaW5nKGJvdW5kcy53aWR0aCl9XG4gICAgc3R5bGU6aGVpZ2h0PXt0b1B4U3RyaW5nKGJvdW5kcy5oZWlnaHQpfVxuICAgIHN0eWxlOnRyYW5zZm9ybT1cInRyYW5zbGF0ZSh7Ym91bmRzLnh9cHgsIHtib3VuZHMueX1weClcIlxuICAgIHVzZTpkcmFnPXt7XG4gICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICBzdG9yZSxcbiAgICAgIG9uRHJhZzogKGV2ZW50LCBfLCBfXywgbm9kZXMpID0+IHtcbiAgICAgICAgb25ub2RlZHJhZz8uKHsgZXZlbnQsIHRhcmdldE5vZGU6IG51bGwsIG5vZGVzOiBub2RlcyBhcyBOb2RlVHlwZVtdIH0pO1xuICAgICAgfSxcbiAgICAgIG9uRHJhZ1N0YXJ0OiAoZXZlbnQsIF8sIF9fLCBub2RlcykgPT4ge1xuICAgICAgICBvbm5vZGVkcmFnc3RhcnQ/Lih7IGV2ZW50LCB0YXJnZXROb2RlOiBudWxsLCBub2Rlczogbm9kZXMgYXMgTm9kZVR5cGVbXSB9KTtcbiAgICAgIH0sXG4gICAgICBvbkRyYWdTdG9wOiAoZXZlbnQsIF8sIF9fLCBub2RlcykgPT4ge1xuICAgICAgICBvbm5vZGVkcmFnc3RvcD8uKHsgZXZlbnQsIHRhcmdldE5vZGU6IG51bGwsIG5vZGVzOiBub2RlcyBhcyBOb2RlVHlwZVtdIH0pO1xuICAgICAgfVxuICAgIH19XG4gICAge29uY29udGV4dG1lbnV9XG4gICAge29uY2xpY2t9XG4gICAgcm9sZT17c3RvcmUuZGlzYWJsZUtleWJvYXJkQTExeSA/IHVuZGVmaW5lZCA6ICdidXR0b24nfVxuICAgIHRhYkluZGV4PXtzdG9yZS5kaXNhYmxlS2V5Ym9hcmRBMTF5ID8gdW5kZWZpbmVkIDogLTF9XG4gICAgb25rZXlkb3duPXtzdG9yZS5kaXNhYmxlS2V5Ym9hcmRBMTF5ID8gdW5kZWZpbmVkIDogb25rZXlkb3dufVxuICAgIGJpbmQ6dGhpcz17cmVmfVxuICA+XG4gICAgPFNlbGVjdGlvbiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgeD17MH0geT17MH0gLz5cbiAgPC9kaXY+XG57L2lmfVxuXG48c3R5bGU+XG4gIC5zdmVsdGUtZmxvd19fc2VsZWN0aW9uLXdyYXBwZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICB6LWluZGV4OiAyMDAwO1xuICAgIHBvaW50ZXItZXZlbnRzOiBhbGw7XG4gIH1cblxuICAuc3ZlbHRlLWZsb3dfX3NlbGVjdGlvbi13cmFwcGVyOmZvY3VzLFxuICAuc3ZlbHRlLWZsb3dfX3NlbGVjdGlvbi13cmFwcGVyOmZvY3VzLXZpc2libGUge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQTRGQSxFQUFFLDZDQUErQixDQUFDO0FBQ2xDLElBQUksa0JBQWtCO0FBQ3RCLElBQUksTUFBTTtBQUNWLElBQUksT0FBTztBQUNYLElBQUksYUFBYTtBQUNqQixJQUFJLG1CQUFtQjtBQUN2Qjs7QUFFQSxFQUFFLDZDQUErQixNQUFNO0FBQ3ZDLEVBQUUsNkNBQStCLGNBQWMsQ0FBQztBQUNoRCxJQUFJLGFBQWE7QUFDakI7In0= */"
};
function NodeSelection($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, NodeSelection);
  append_styles($$anchor, $$css4);
  let ref = tag(state(void 0), "ref");
  user_effect(() => {
    if (!$$props.store.disableKeyboardA11y) {
      get(ref)?.focus({ preventScroll: true });
    }
  });
  let bounds = tag(
    user_derived(() => {
      if (strict_equals($$props.store.selectionRectMode, "nodes")) {
        $$props.store.nodes;
        const nodeBounds = getInternalNodesBounds($$props.store.nodeLookup, { filter: (node) => !!node.selected });
        if (nodeBounds.width > 0 && nodeBounds.height > 0) {
          return nodeBounds;
        }
      }
      return null;
    }),
    "bounds"
  );
  function oncontextmenu(event2) {
    const selectedNodes = $$props.store.nodes.filter((n) => n.selected);
    $$props.onselectioncontextmenu?.({ nodes: selectedNodes, event: event2 });
  }
  function onclick(event2) {
    const selectedNodes = $$props.store.nodes.filter((n) => n.selected);
    $$props.onselectionclick?.({ nodes: selectedNodes, event: event2 });
  }
  function onkeydown(event2) {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event2.key)) {
      event2.preventDefault();
      $$props.store.moveSelectedNodes(arrowKeyDiffs[event2.key], event2.shiftKey ? 4 : 1);
    }
  }
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node_1 = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var div = root_17();
      let styles;
      var node_2 = child(div);
      add_svelte_meta(() => Selection3(node_2, { width: "100%", height: "100%", x: 0, y: 0 }), "component", NodeSelection, 88, 4, { componentTag: "Selection" });
      reset(div);
      action(div, ($$node, $$action_arg) => drag?.($$node, $$action_arg), () => ({
        disabled: false,
        store: $$props.store,
        onDrag: (event2, _2, __, nodes) => {
          $$props.onnodedrag?.({ event: event2, targetNode: null, nodes });
        },
        onDragStart: (event2, _2, __, nodes) => {
          $$props.onnodedragstart?.({ event: event2, targetNode: null, nodes });
        },
        onDragStop: (event2, _2, __, nodes) => {
          $$props.onnodedragstop?.({ event: event2, targetNode: null, nodes });
        }
      }));
      bind_this(div, ($$value) => set(ref, $$value), () => get(ref));
      template_effect(
        ($0) => {
          set_class(div, 1, clsx2(["svelte-flow__selection-wrapper", $$props.store.noPanClass]), "svelte-sf2y5e");
          set_attribute2(div, "role", $$props.store.disableKeyboardA11y ? void 0 : "button");
          set_attribute2(div, "tabindex", $$props.store.disableKeyboardA11y ? void 0 : -1);
          styles = set_style(div, "", styles, $0);
        },
        [
          () => ({
            width: toPxString(get(bounds).width),
            height: toPxString(get(bounds).height),
            transform: `translate(${get(bounds).x ?? ""}px, ${get(bounds).y ?? ""}px)`
          })
        ]
      );
      delegated("contextmenu", div, oncontextmenu);
      delegated("click", div, onclick);
      delegated("keydown", div, function(...$$args) {
        apply(() => $$props.store.disableKeyboardA11y ? void 0 : onkeydown, this, $$args, NodeSelection, [85, 15]);
      });
      append($$anchor2, div);
    };
    var d = user_derived(() => strict_equals($$props.store.selectionRectMode, "nodes") && get(bounds) && isNumeric(get(bounds).x) && isNumeric(get(bounds).y));
    add_svelte_meta(
      () => if_block(node_1, ($$render) => {
        if (get(d)) $$render(consequent);
      }),
      "if",
      NodeSelection,
      62,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}
delegate(["contextmenu", "click", "keydown"]);

// node_modules/@svelte-put/shortcut/src/shortcut.js
function mapModifierToBitMask(def) {
  switch (def) {
    case "ctrl":
      return 8;
    case "shift":
      return 4;
    case "alt":
      return 2;
    case "meta":
      return 1;
  }
}
function shortcut(node, param) {
  let { enabled = true, trigger, type = "keydown" } = param;
  function handler(event2) {
    const normalizedTriggers = Array.isArray(trigger) ? trigger : [trigger];
    const modifierMask = [event2.metaKey, event2.altKey, event2.shiftKey, event2.ctrlKey].reduce(
      (acc, value, index2) => {
        if (value) {
          return acc | 1 << index2;
        }
        return acc;
      },
      0
    );
    for (const trigger2 of normalizedTriggers) {
      const mergedTrigger = {
        preventDefault: false,
        enabled: true,
        ...trigger2
      };
      const { modifier, key: key3, callback, preventDefault: preventDefault2, enabled: triggerEnabled } = mergedTrigger;
      if (triggerEnabled) {
        if (event2.key !== key3) continue;
        if (modifier === null || modifier === false) {
          if (modifierMask !== 0) continue;
        } else if (modifier !== void 0 && modifier?.[0]?.length > 0) {
          const orDefs = Array.isArray(modifier) ? modifier : [modifier];
          let modified = false;
          for (const orDef of orDefs) {
            const mask = (Array.isArray(orDef) ? orDef : [orDef]).reduce(
              (acc, def) => acc | mapModifierToBitMask(def),
              0
            );
            if (mask === modifierMask) {
              modified = true;
              break;
            }
          }
          if (!modified) continue;
        }
        if (preventDefault2) event2.preventDefault();
        const detail = {
          node,
          trigger: mergedTrigger,
          originalEvent: event2
        };
        node.dispatchEvent(new CustomEvent("shortcut", { detail }));
        callback?.(detail);
      }
    }
  }
  let off;
  if (enabled) {
    off = on(node, type, handler);
  }
  return {
    update: (update2) => {
      const { enabled: newEnabled = true, type: newType = "keydown" } = update2;
      if (enabled && (!newEnabled || type !== newType)) {
        off?.();
      } else if (!enabled && newEnabled) {
        off = on(node, newType, handler);
      }
      enabled = newEnabled;
      type = newType;
      trigger = update2.trigger;
    },
    destroy: () => {
      off?.();
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/hooks/useSvelteFlow.svelte.js
function useSvelteFlow() {
  const store = user_derived(useStore);
  const getNodeRect = (node) => {
    const nodeToUse = isNode(node) ? node : get(store).nodeLookup.get(node.id);
    const position = nodeToUse.parentId ? evaluateAbsolutePosition(nodeToUse.position, nodeToUse.measured, nodeToUse.parentId, get(store).nodeLookup, get(store).nodeOrigin) : nodeToUse.position;
    const nodeWithPosition = {
      ...nodeToUse,
      position,
      width: nodeToUse.measured?.width ?? nodeToUse.width,
      height: nodeToUse.measured?.height ?? nodeToUse.height
    };
    return nodeToRect(nodeWithPosition);
  };
  function updateNode(id2, nodeUpdate, options = { replace: false }) {
    get(store).nodes = untrack(() => get(store).nodes).map((node) => {
      if (node.id === id2) {
        const nextNode = typeof nodeUpdate === "function" ? nodeUpdate(node) : nodeUpdate;
        return options?.replace && isNode(nextNode) ? nextNode : { ...node, ...nextNode };
      }
      return node;
    });
  }
  function updateEdge(id2, edgeUpdate, options = { replace: false }) {
    get(store).edges = untrack(() => get(store).edges).map((edge) => {
      if (edge.id === id2) {
        const nextEdge = typeof edgeUpdate === "function" ? edgeUpdate(edge) : edgeUpdate;
        return options.replace && isEdge(nextEdge) ? nextEdge : { ...edge, ...nextEdge };
      }
      return edge;
    });
  }
  const getInternalNode = (id2) => get(store).nodeLookup.get(id2);
  return {
    zoomIn: get(store).zoomIn,
    zoomOut: get(store).zoomOut,
    getInternalNode,
    getNode: (id2) => getInternalNode(id2)?.internals.userNode,
    getNodes: (ids) => ids === void 0 ? get(store).nodes : getElements(get(store).nodeLookup, ids),
    getEdge: (id2) => get(store).edgeLookup.get(id2),
    getEdges: (ids) => ids === void 0 ? get(store).edges : getElements(get(store).edgeLookup, ids),
    setZoom: (zoomLevel, options) => {
      const panZoom = get(store).panZoom;
      return panZoom ? panZoom.scaleTo(zoomLevel, { duration: options?.duration }) : Promise.resolve(false);
    },
    getZoom: () => get(store).viewport.zoom,
    setViewport: async (nextViewport, options) => {
      const currentViewport = get(store).viewport;
      if (!get(store).panZoom) {
        return Promise.resolve(false);
      }
      await get(store).panZoom.setViewport(
        {
          x: nextViewport.x ?? currentViewport.x,
          y: nextViewport.y ?? currentViewport.y,
          zoom: nextViewport.zoom ?? currentViewport.zoom
        },
        options
      );
      return Promise.resolve(true);
    },
    getViewport: () => snapshot(get(store).viewport),
    setCenter: async (x, y2, options) => get(store).setCenter(x, y2, options),
    fitView: (options) => get(store).fitView(options),
    fitBounds: async (bounds, options) => {
      if (!get(store).panZoom) {
        return Promise.resolve(false);
      }
      const viewport = getViewportForBounds(bounds, get(store).width, get(store).height, get(store).minZoom, get(store).maxZoom, options?.padding ?? 0.1);
      await get(store).panZoom.setViewport(viewport, {
        duration: options?.duration,
        ease: options?.ease,
        interpolate: options?.interpolate
      });
      return Promise.resolve(true);
    },
    /**
     * Partial is defined as "the 2 nodes/areas are intersecting partially".
     * If a is contained in b or b is contained in a, they are both
     * considered fully intersecting.
     */
    getIntersectingNodes: (nodeOrRect, partially = true, nodesToIntersect) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
      if (!nodeRect) {
        return [];
      }
      return (nodesToIntersect || get(store).nodes).filter((n) => {
        const internalNode = get(store).nodeLookup.get(n.id);
        if (!internalNode || !isRect && n.id === nodeOrRect.id) {
          return false;
        }
        const currNodeRect = nodeToRect(internalNode);
        const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
        const partiallyVisible = partially && overlappingArea > 0;
        return partiallyVisible || overlappingArea >= currNodeRect.width * currNodeRect.height || overlappingArea >= nodeRect.width * nodeRect.height;
      });
    },
    isNodeIntersecting: (nodeOrRect, area, partially = true) => {
      const isRect = isRectObject(nodeOrRect);
      const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
      if (!nodeRect) {
        return false;
      }
      const overlappingArea = getOverlappingArea(nodeRect, area);
      const partiallyVisible = partially && overlappingArea > 0;
      return partiallyVisible || overlappingArea >= area.width * area.height || overlappingArea >= nodeRect.width * nodeRect.height;
    },
    deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
      const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
        nodesToRemove,
        edgesToRemove,
        nodes: get(store).nodes,
        edges: get(store).edges,
        onBeforeDelete: get(store).onbeforedelete
      });
      if (matchingNodes) {
        get(store).nodes = untrack(() => get(store).nodes).filter((node) => !matchingNodes.some(({ id: id2 }) => id2 === node.id));
      }
      if (matchingEdges) {
        get(store).edges = untrack(() => get(store).edges).filter((edge) => !matchingEdges.some(({ id: id2 }) => id2 === edge.id));
      }
      if (matchingNodes.length > 0 || matchingEdges.length > 0) {
        get(store).ondelete?.({ nodes: matchingNodes, edges: matchingEdges });
      }
      return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
    },
    screenToFlowPosition: (position, options = { snapToGrid: true }) => {
      if (!get(store).domNode) {
        return position;
      }
      const _snapGrid = options.snapToGrid ? get(store).snapGrid : false;
      const { x, y: y2, zoom: zoom2 } = get(store).viewport;
      const { x: domX, y: domY } = get(store).domNode.getBoundingClientRect();
      const correctedPosition = { x: position.x - domX, y: position.y - domY };
      return pointToRendererPoint(correctedPosition, [x, y2, zoom2], _snapGrid !== null, _snapGrid || [1, 1]);
    },
    /**
     *
     * @param position
     * @returns
     */
    flowToScreenPosition: (position) => {
      if (!get(store).domNode) {
        return position;
      }
      const { x, y: y2, zoom: zoom2 } = get(store).viewport;
      const { x: domX, y: domY } = get(store).domNode.getBoundingClientRect();
      const rendererPosition = rendererPointToPoint(position, [x, y2, zoom2]);
      return { x: rendererPosition.x + domX, y: rendererPosition.y + domY };
    },
    toObject: () => {
      return structuredClone({
        nodes: [...get(store).nodes],
        edges: [...get(store).edges],
        viewport: { ...get(store).viewport }
      });
    },
    updateNode,
    updateNodeData: (id2, dataUpdate, options) => {
      const node = get(store).nodeLookup.get(id2)?.internals.userNode;
      if (!node) {
        return;
      }
      const nextData = typeof dataUpdate === "function" ? dataUpdate(node) : dataUpdate;
      updateNode(id2, (node2) => ({
        ...node2,
        data: options?.replace ? nextData : { ...node2.data, ...nextData }
      }));
    },
    updateEdge,
    getNodesBounds: (nodes) => {
      return getNodesBounds(nodes, {
        nodeLookup: get(store).nodeLookup,
        nodeOrigin: get(store).nodeOrigin
      });
    },
    getHandleConnections: ({ type, id: id2, nodeId }) => Array.from(get(store).connectionLookup.get(`${nodeId}-${type}-${id2 ?? null}`)?.values() ?? [])
  };
}
function getElements(lookup, ids) {
  const result = [];
  for (const id2 of ids) {
    const item = lookup.get(id2);
    if (item) {
      const element2 = "internals" in item ? item.internals?.userNode : item;
      result.push(element2);
    }
  }
  return result;
}

// node_modules/@xyflow/svelte/dist/lib/components/KeyHandler/KeyHandler.svelte
KeyHandler[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/KeyHandler/KeyHandler.svelte";
function KeyHandler($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, KeyHandler);
  var $$ownership_validator = create_ownership_validator($$props);
  let store = prop($$props, "store", 15), selectionKey = prop($$props, "selectionKey", 3, "Shift"), multiSelectionKey = prop($$props, "multiSelectionKey", 19, () => isMacOs() ? "Meta" : "Control"), deleteKey = prop($$props, "deleteKey", 3, "Backspace"), panActivationKey = prop($$props, "panActivationKey", 3, " "), zoomActivationKey = prop($$props, "zoomActivationKey", 19, () => isMacOs() ? "Meta" : "Control");
  let { deleteElements } = useSvelteFlow();
  function isKeyObject(key3) {
    return strict_equals(key3, null, false) && strict_equals(typeof key3, "object");
  }
  function getModifier(key3) {
    return isKeyObject(key3) ? key3.modifier || [] : [];
  }
  function getKeyString(key3) {
    if (strict_equals(key3, null) || strict_equals(key3, void 0)) {
      return "";
    }
    return isKeyObject(key3) ? key3.key : key3;
  }
  function getShortcutTrigger(key3, callback) {
    const keys = Array.isArray(key3) ? key3 : [key3];
    return keys.map((_key) => {
      const keyString = getKeyString(_key);
      return {
        key: keyString,
        modifier: getModifier(_key),
        enabled: strict_equals(keyString, null, false),
        callback
      };
    });
  }
  function resetKeysAndSelection() {
    $$ownership_validator.mutation("store", ["store", "selectionRect"], store(store().selectionRect = null, true), 59, 4);
    $$ownership_validator.mutation("store", ["store", "selectionKeyPressed"], store(store().selectionKeyPressed = false, true), 60, 4);
    $$ownership_validator.mutation("store", ["store", "multiselectionKeyPressed"], store(store().multiselectionKeyPressed = false, true), 61, 4);
    $$ownership_validator.mutation("store", ["store", "deleteKeyPressed"], store(store().deleteKeyPressed = false, true), 62, 4);
    $$ownership_validator.mutation("store", ["store", "panActivationKeyPressed"], store(store().panActivationKeyPressed = false, true), 63, 4);
    $$ownership_validator.mutation("store", ["store", "zoomActivationKeyPressed"], store(store().zoomActivationKeyPressed = false, true), 64, 4);
  }
  function handleDelete() {
    const selectedNodes = store().nodes.filter((node) => node.selected);
    const selectedEdges = store().edges.filter((edge) => edge.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  }
  var $$exports = { ...legacy_api() };
  event("blur", $window, resetKeysAndSelection);
  event("contextmenu", $window, resetKeysAndSelection);
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(selectionKey(), () => $$ownership_validator.mutation("store", ["store", "selectionKeyPressed"], store(store().selectionKeyPressed = true, true), 82, 53)),
    type: "keydown"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(selectionKey(), () => $$ownership_validator.mutation("store", ["store", "selectionKeyPressed"], store(store().selectionKeyPressed = false, true), 86, 53)),
    type: "keyup"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(multiSelectionKey(), () => {
      $$ownership_validator.mutation("store", ["store", "multiselectionKeyPressed"], store(store().multiselectionKeyPressed = true, true), 91, 6);
    }),
    type: "keydown"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(multiSelectionKey(), () => $$ownership_validator.mutation("store", ["store", "multiselectionKeyPressed"], store(store().multiselectionKeyPressed = false, true), 96, 58)),
    type: "keyup"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(deleteKey(), (detail) => {
      const isModifierKey = detail.originalEvent.ctrlKey || detail.originalEvent.metaKey || detail.originalEvent.shiftKey;
      if (!isModifierKey && !isInputDOMNode(detail.originalEvent)) {
        $$ownership_validator.mutation("store", ["store", "deleteKeyPressed"], store(store().deleteKeyPressed = true, true), 106, 8);
        handleDelete();
      }
    }),
    type: "keydown"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(deleteKey(), () => $$ownership_validator.mutation("store", ["store", "deleteKeyPressed"], store(store().deleteKeyPressed = false, true), 113, 50)),
    type: "keyup"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(panActivationKey(), () => $$ownership_validator.mutation("store", ["store", "panActivationKeyPressed"], store(store().panActivationKeyPressed = true, true), 117, 57)),
    type: "keydown"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(panActivationKey(), () => $$ownership_validator.mutation("store", ["store", "panActivationKeyPressed"], store(store().panActivationKeyPressed = false, true), 121, 57)),
    type: "keyup"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(zoomActivationKey(), () => $$ownership_validator.mutation("store", ["store", "zoomActivationKeyPressed"], store(store().zoomActivationKeyPressed = true, true), 125, 58)),
    type: "keydown"
  }));
  action($window, ($$node, $$action_arg) => shortcut?.($$node, $$action_arg), () => ({
    trigger: getShortcutTrigger(zoomActivationKey(), () => $$ownership_validator.mutation("store", ["store", "zoomActivationKeyPressed"], store(store().zoomActivationKeyPressed = false, true), 129, 58)),
    type: "keyup"
  }));
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/ConnectionLine/ConnectionLine.svelte
ConnectionLine[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/ConnectionLine/ConnectionLine.svelte";
var root_3 = add_locations(from_svg(`<path fill="none" class="svelte-flow__connection-path"></path>`), ConnectionLine[FILENAME], [[74, 8]]);
var root_18 = add_locations(from_svg(`<svg class="svelte-flow__connectionline"><g><!></g></svg>`), ConnectionLine[FILENAME], [[64, 2, [[70, 4]]]]);
function ConnectionLine($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, ConnectionLine);
  let path = tag(
    user_derived(() => {
      if (!$$props.store.connection.inProgress) {
        return "";
      }
      const pathParams = {
        sourceX: $$props.store.connection.from.x,
        sourceY: $$props.store.connection.from.y,
        sourcePosition: $$props.store.connection.fromPosition,
        targetX: $$props.store.connection.to.x,
        targetY: $$props.store.connection.to.y,
        targetPosition: $$props.store.connection.toPosition
      };
      switch ($$props.type) {
        case ConnectionLineType.Bezier: {
          const [path2] = getBezierPath(pathParams);
          return path2;
        }
        case ConnectionLineType.Straight: {
          const [path2] = getStraightPath(pathParams);
          return path2;
        }
        case ConnectionLineType.Step:
        case ConnectionLineType.SmoothStep: {
          const [path2] = getSmoothStepPath({
            ...pathParams,
            borderRadius: strict_equals($$props.type, ConnectionLineType.Step) ? 0 : void 0
          });
          return path2;
        }
      }
    }),
    "path"
  );
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_1 = ($$anchor2) => {
      var svg = root_18();
      var g = child(svg);
      var node_1 = child(g);
      {
        var consequent = ($$anchor3) => {
          var fragment_1 = comment();
          var node_2 = first_child(fragment_1);
          add_svelte_meta(
            () => component(node_2, () => $$props.LineComponent, ($$anchor4, LineComponent_1) => {
              LineComponent_1($$anchor4, {});
            }),
            "component",
            ConnectionLine,
            72,
            8,
            { componentTag: "LineComponent" }
          );
          append($$anchor3, fragment_1);
        };
        var alternate = ($$anchor3) => {
          var path_1 = root_3();
          template_effect(() => {
            set_attribute2(path_1, "d", get(path));
            set_style(path_1, $$props.style);
          });
          append($$anchor3, path_1);
        };
        add_svelte_meta(
          () => if_block(node_1, ($$render) => {
            if ($$props.LineComponent) $$render(consequent);
            else $$render(alternate, -1);
          }),
          "if",
          ConnectionLine,
          71,
          6
        );
      }
      reset(g);
      reset(svg);
      template_effect(
        ($0) => {
          set_attribute2(svg, "width", $$props.store.width);
          set_attribute2(svg, "height", $$props.store.height);
          set_style(svg, $$props.containerStyle);
          set_class(g, 0, $0);
        },
        [
          () => clsx2([
            "svelte-flow__connection",
            getConnectionStatus($$props.store.connection.isValid)
          ])
        ]
      );
      append($$anchor2, svg);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if ($$props.store.connection.inProgress) $$render(consequent_1);
      }),
      "if",
      ConnectionLine,
      63,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/Panel/Panel.svelte
Panel[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/Panel/Panel.svelte";
var root16 = add_locations(from_html(`<div><!></div>`), Panel[FILENAME], [[9, 0]]);
function Panel($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Panel);
  let position = prop($$props, "position", 3, "top-right"), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "position",
      "style",
      "class",
      "children"
    ],
    "rest"
  );
  let positionClasses = tag(user_derived(() => `${position()}`.split("-")), "positionClasses");
  var $$exports = { ...legacy_api() };
  var div = root16();
  attribute_effect(div, ($0) => ({ class: $0, style: $$props.style, ...rest }), [
    () => [
      "svelte-flow__panel",
      $$props.class,
      ...get(positionClasses)
    ]
  ]);
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children ?? noop), "render", Panel, 10, 2);
  reset(div);
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/components/Attribution/Attribution.svelte
Attribution[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/components/Attribution/Attribution.svelte";
var root_22 = add_locations(from_html(`<a href="https://svelteflow.dev" target="_blank" rel="noopener noreferrer" aria-label="Svelte Flow attribution">Svelte Flow</a>`), Attribution[FILENAME], [[14, 4]]);
function Attribution($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Attribution);
  let position = prop($$props, "position", 3, "bottom-right");
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      add_svelte_meta(
        () => Panel($$anchor2, {
          get position() {
            return position();
          },
          class: "svelte-flow__attribution",
          "data-message": "Feel free to remove the attribution or check out how you could support us: https://svelteflow.dev/support-us",
          children: wrap_snippet(Attribution, ($$anchor3, $$slotProps) => {
            var a = root_22();
            append($$anchor3, a);
          }),
          $$slots: { default: true }
        }),
        "component",
        Attribution,
        9,
        2,
        { componentTag: "Panel" }
      );
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (!$$props.proOptions?.hideAttribution) $$render(consequent);
      }),
      "if",
      Attribution,
      8,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/SvelteFlow/Wrapper.svelte
Wrapper[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/SvelteFlow/Wrapper.svelte";
var root17 = add_locations(from_html(`<div><!></div>`), Wrapper[FILENAME], [[119, 0]]);
var $$css5 = {
  hash: "svelte-mkap6j",
  code: "\n  .svelte-flow.svelte-mkap6j {\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n    position: relative;\n    z-index: 0;\n\n    background-color: var(--background-color, var(--background-color-default));\n  }\n\n  :root {\n    --background-color-default: #fff;\n    --background-pattern-color-default: #ddd;\n\n    --minimap-mask-color-default: rgb(240, 240, 240, 0.6);\n    --minimap-mask-stroke-color-default: none;\n    --minimap-mask-stroke-width-default: 1;\n\n    --controls-button-background-color-default: #fefefe;\n    --controls-button-background-color-hover-default: #f4f4f4;\n    --controls-button-color-default: inherit;\n    --controls-button-color-hover-default: inherit;\n    --controls-button-border-color-default: #eee;\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JhcHBlci5zdmVsdGUiLCJzb3VyY2VzIjpbIldyYXBwZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCIgZ2VuZXJpY3M9XCJOb2RlVHlwZSBleHRlbmRzIE5vZGUgPSBOb2RlLCBFZGdlVHlwZSBleHRlbmRzIEVkZ2UgPSBFZGdlXCI+XG4gIGltcG9ydCB0eXBlIHsgSFRNTEF0dHJpYnV0ZXMgfSBmcm9tICdzdmVsdGUvZWxlbWVudHMnO1xuICBpbXBvcnQgdHlwZSB7IFNuaXBwZXQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgeyB0eXBlIFN2ZWx0ZUZsb3dSZXN0UHJvcHMgfSBmcm9tICcuLi8uLi9zdG9yZS90eXBlcyc7XG4gIGltcG9ydCB7IHRvUHhTdHJpbmcgfSBmcm9tICcuLi8uLi91dGlscyc7XG4gIGltcG9ydCB0eXBlIHsgTm9kZSwgRWRnZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuICBsZXQge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBjb2xvck1vZGUsXG4gICAgZG9tTm9kZSA9ICRiaW5kYWJsZSgpLFxuICAgIGNsaWVudFdpZHRoID0gJGJpbmRhYmxlKCksXG4gICAgY2xpZW50SGVpZ2h0ID0gJGJpbmRhYmxlKCksXG4gICAgY2hpbGRyZW4sXG4gICAgcmVzdFxuICB9OiB7XG4gICAgd2lkdGg/OiBudW1iZXI7XG4gICAgaGVpZ2h0PzogbnVtYmVyO1xuICAgIGNvbG9yTW9kZT86IHN0cmluZztcbiAgICBkb21Ob2RlOiBIVE1MRGl2RWxlbWVudCB8IG51bGw7XG4gICAgY2xpZW50V2lkdGg/OiBudW1iZXI7XG4gICAgY2xpZW50SGVpZ2h0PzogbnVtYmVyO1xuICAgIGNoaWxkcmVuPzogU25pcHBldDtcbiAgICByZXN0OiBTdmVsdGVGbG93UmVzdFByb3BzPE5vZGVUeXBlLCBFZGdlVHlwZT4gJlxuICAgICAgT21pdDxIVE1MQXR0cmlidXRlczxIVE1MRGl2RWxlbWVudD4sICdvbnNlbGVjdGlvbmNoYW5nZSc+O1xuICB9ID0gJHByb3BzKCk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSB3ZSBoYXZlIHRvIGRlc3RydWN0dXJlIHRoZSBwcm9wcyBoZXJlIHRoaXMgd2F5LFxuICAvLyBzbyB3ZSBkb24ndCBwYXNzIGFsbCB0aGUgcHJvcHMgYXMgYXR0cmlidXRlcyB0byB0aGUgZGl2IGVsZW1lbnRcbiAgLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG4gIGxldCB7XG4gICAgaWQsXG4gICAgY2xhc3M6IGNsYXNzTmFtZSxcbiAgICBub2RlVHlwZXMsXG4gICAgZWRnZVR5cGVzLFxuICAgIGNvbG9yTW9kZTogX2NvbG9yTW9kZSxcbiAgICBpc1ZhbGlkQ29ubmVjdGlvbixcbiAgICBvbm1vdmUsXG4gICAgb25tb3Zlc3RhcnQsXG4gICAgb25tb3ZlZW5kLFxuICAgIG9uZmxvd2Vycm9yLFxuICAgIG9uZGVsZXRlLFxuICAgIG9uYmVmb3JlZGVsZXRlLFxuICAgIG9uYmVmb3JlY29ubmVjdCxcbiAgICBvbmNvbm5lY3QsXG4gICAgb25jb25uZWN0c3RhcnQsXG4gICAgb25jb25uZWN0ZW5kLFxuICAgIG9uYmVmb3JlcmVjb25uZWN0LFxuICAgIG9ucmVjb25uZWN0LFxuICAgIG9ucmVjb25uZWN0c3RhcnQsXG4gICAgb25yZWNvbm5lY3RlbmQsXG4gICAgb25jbGlja2Nvbm5lY3RzdGFydCxcbiAgICBvbmNsaWNrY29ubmVjdGVuZCxcbiAgICBvbmluaXQsXG4gICAgb25zZWxlY3Rpb25jaGFuZ2UsXG4gICAgb25zZWxlY3Rpb25kcmFnc3RhcnQsXG4gICAgb25zZWxlY3Rpb25kcmFnLFxuICAgIG9uc2VsZWN0aW9uZHJhZ3N0b3AsXG4gICAgb25zZWxlY3Rpb25zdGFydCxcbiAgICBvbnNlbGVjdGlvbmVuZCxcbiAgICBjbGlja0Nvbm5lY3QsXG4gICAgZml0VmlldyxcbiAgICBmaXRWaWV3T3B0aW9ucyxcbiAgICBub2RlT3JpZ2luLFxuICAgIG5vZGVEcmFnVGhyZXNob2xkLFxuICAgIGNvbm5lY3Rpb25EcmFnVGhyZXNob2xkLFxuICAgIG1pblpvb20sXG4gICAgbWF4Wm9vbSxcbiAgICBpbml0aWFsVmlld3BvcnQsXG4gICAgY29ubmVjdGlvblJhZGl1cyxcbiAgICBjb25uZWN0aW9uTW9kZSxcbiAgICBzZWxlY3Rpb25Nb2RlLFxuICAgIHNlbGVjdE5vZGVzT25EcmFnLFxuICAgIHNuYXBHcmlkLFxuICAgIGRlZmF1bHRNYXJrZXJDb2xvcixcbiAgICB0cmFuc2xhdGVFeHRlbnQsXG4gICAgbm9kZUV4dGVudCxcbiAgICBvbmx5UmVuZGVyVmlzaWJsZUVsZW1lbnRzLFxuICAgIGF1dG9QYW5PbkNvbm5lY3QsXG4gICAgYXV0b1Bhbk9uTm9kZURyYWcsXG4gICAgY29sb3JNb2RlU1NSLFxuICAgIGRlZmF1bHRFZGdlT3B0aW9ucyxcbiAgICBlbGV2YXRlTm9kZXNPblNlbGVjdCxcbiAgICBlbGV2YXRlRWRnZXNPblNlbGVjdCxcbiAgICBub2Rlc0RyYWdnYWJsZSxcbiAgICBhdXRvUGFuT25Ob2RlRm9jdXMsXG4gICAgbm9kZXNDb25uZWN0YWJsZSxcbiAgICBlbGVtZW50c1NlbGVjdGFibGUsXG4gICAgbm9kZXNGb2N1c2FibGUsXG4gICAgZWRnZXNGb2N1c2FibGUsXG4gICAgZGlzYWJsZUtleWJvYXJkQTExeSxcbiAgICBub0RyYWdDbGFzcyxcbiAgICBub1BhbkNsYXNzLFxuICAgIG5vV2hlZWxDbGFzcyxcbiAgICBhcmlhTGFiZWxDb25maWcsXG4gICAgYXV0b1BhblNwZWVkLFxuICAgIHBhbk9uU2Nyb2xsU3BlZWQsXG4gICAgekluZGV4TW9kZSxcbiAgICAuLi5kaXZBdHRyaWJ1dGVzXG4gIH0gPSAkZGVyaXZlZChyZXN0KTtcbiAgLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cblxuICB0eXBlIE9ubHlEaXZBdHRyaWJ1dGVzPFQ+ID0ge1xuICAgIFtLIGluIGtleW9mIFRdOiBLIGV4dGVuZHMga2V5b2YgSFRNTEF0dHJpYnV0ZXM8SFRNTERpdkVsZW1lbnQ+ID8gVFtLXSA6IG5ldmVyO1xuICB9O1xuXG4gIC8vIFVuZG8gc2Nyb2xsIGV2ZW50cywgcHJldmVudGluZyB2aWV3cG9ydCBmcm9tIHNoaWZ0aW5nIHdoZW4gbm9kZXMgb3V0c2lkZSBvZiBpdCBhcmUgZm9jdXNlZFxuICBmdW5jdGlvbiB3cmFwcGVyT25TY3JvbGwoZTogVUlFdmVudCAmIHsgY3VycmVudFRhcmdldDogRXZlbnRUYXJnZXQgJiBIVE1MRGl2RWxlbWVudCB9KSB7XG4gICAgZS5jdXJyZW50VGFyZ2V0LnNjcm9sbFRvKHsgdG9wOiAwLCBsZWZ0OiAwLCBiZWhhdmlvcjogJ2F1dG8nIH0pO1xuXG4gICAgLy8gRm9yd2FyZCB0aGUgZXZlbnQgdG8gYW55IGV4aXN0aW5nIG9uc2Nyb2xsIGhhbmRsZXIgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3Qub25zY3JvbGwpIHtcbiAgICAgIHJlc3Qub25zY3JvbGwoZSk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxuPGRpdlxuICBiaW5kOnRoaXM9e2RvbU5vZGV9XG4gIGJpbmQ6Y2xpZW50SGVpZ2h0XG4gIGJpbmQ6Y2xpZW50V2lkdGhcbiAgc3R5bGU6d2lkdGg9e3RvUHhTdHJpbmcod2lkdGgpfVxuICBzdHlsZTpoZWlnaHQ9e3RvUHhTdHJpbmcoaGVpZ2h0KX1cbiAgY2xhc3M9e1snc3ZlbHRlLWZsb3cnLCAnc3ZlbHRlLWZsb3dfX2NvbnRhaW5lcicsIGNsYXNzTmFtZSwgY29sb3JNb2RlXX1cbiAgZGF0YS10ZXN0aWQ9XCJzdmVsdGUtZmxvd19fd3JhcHBlclwiXG4gIHJvbGU9XCJhcHBsaWNhdGlvblwiXG4gIG9uc2Nyb2xsPXt3cmFwcGVyT25TY3JvbGx9XG4gIHsuLi5kaXZBdHRyaWJ1dGVzIHNhdGlzZmllcyBPbmx5RGl2QXR0cmlidXRlczx0eXBlb2YgZGl2QXR0cmlidXRlcz59XG4+XG4gIHtAcmVuZGVyIGNoaWxkcmVuPy4oKX1cbjwvZGl2PlxuXG48c3R5bGU+XG4gIC5zdmVsdGUtZmxvdyB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHotaW5kZXg6IDA7XG5cbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yLCB2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yLWRlZmF1bHQpKTtcbiAgfVxuXG4gIDpyb290IHtcbiAgICAtLWJhY2tncm91bmQtY29sb3ItZGVmYXVsdDogI2ZmZjtcbiAgICAtLWJhY2tncm91bmQtcGF0dGVybi1jb2xvci1kZWZhdWx0OiAjZGRkO1xuXG4gICAgLS1taW5pbWFwLW1hc2stY29sb3ItZGVmYXVsdDogcmdiKDI0MCwgMjQwLCAyNDAsIDAuNik7XG4gICAgLS1taW5pbWFwLW1hc2stc3Ryb2tlLWNvbG9yLWRlZmF1bHQ6IG5vbmU7XG4gICAgLS1taW5pbWFwLW1hc2stc3Ryb2tlLXdpZHRoLWRlZmF1bHQ6IDE7XG5cbiAgICAtLWNvbnRyb2xzLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLWRlZmF1bHQ6ICNmZWZlZmU7XG4gICAgLS1jb250cm9scy1idXR0b24tYmFja2dyb3VuZC1jb2xvci1ob3Zlci1kZWZhdWx0OiAjZjRmNGY0O1xuICAgIC0tY29udHJvbHMtYnV0dG9uLWNvbG9yLWRlZmF1bHQ6IGluaGVyaXQ7XG4gICAgLS1jb250cm9scy1idXR0b24tY29sb3ItaG92ZXItZGVmYXVsdDogaW5oZXJpdDtcbiAgICAtLWNvbnRyb2xzLWJ1dHRvbi1ib3JkZXItY29sb3ItZGVmYXVsdDogI2VlZTtcbiAgfVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBc0lBLEVBQUUsMEJBQVksQ0FBQztBQUNmLElBQUksV0FBVztBQUNmLElBQUksWUFBWTtBQUNoQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLFVBQVU7O0FBRWQsSUFBSSwwRUFBMEU7QUFDOUU7O0FBRUEsRUFBRSxLQUFLLENBQUM7QUFDUixJQUFJLGdDQUFnQztBQUNwQyxJQUFJLHdDQUF3Qzs7QUFFNUMsSUFBSSxxREFBcUQ7QUFDekQsSUFBSSx5Q0FBeUM7QUFDN0MsSUFBSSxzQ0FBc0M7O0FBRTFDLElBQUksbURBQW1EO0FBQ3ZELElBQUkseURBQXlEO0FBQzdELElBQUksd0NBQXdDO0FBQzVDLElBQUksOENBQThDO0FBQ2xELElBQUksNENBQTRDO0FBQ2hEOyJ9 */"
};
function Wrapper($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Wrapper);
  append_styles($$anchor, $$css5);
  let domNode = prop($$props, "domNode", 15), clientWidth = prop($$props, "clientWidth", 15), clientHeight = prop($$props, "clientHeight", 15);
  let id2 = tag(user_derived(() => $$props.rest.id), "id"), className = tag(user_derived(() => $$props.rest.class), "className"), nodeTypes = tag(user_derived(() => $$props.rest.nodeTypes), "nodeTypes"), edgeTypes = tag(user_derived(() => $$props.rest.edgeTypes), "edgeTypes"), _colorMode = tag(user_derived(() => $$props.rest.colorMode), "_colorMode"), isValidConnection = tag(user_derived(() => $$props.rest.isValidConnection), "isValidConnection"), onmove = tag(user_derived(() => $$props.rest.onmove), "onmove"), onmovestart = tag(user_derived(() => $$props.rest.onmovestart), "onmovestart"), onmoveend = tag(user_derived(() => $$props.rest.onmoveend), "onmoveend"), onflowerror = tag(user_derived(() => $$props.rest.onflowerror), "onflowerror"), ondelete = tag(user_derived(() => $$props.rest.ondelete), "ondelete"), onbeforedelete = tag(user_derived(() => $$props.rest.onbeforedelete), "onbeforedelete"), onbeforeconnect = tag(user_derived(() => $$props.rest.onbeforeconnect), "onbeforeconnect"), onconnect = tag(user_derived(() => $$props.rest.onconnect), "onconnect"), onconnectstart = tag(user_derived(() => $$props.rest.onconnectstart), "onconnectstart"), onconnectend = tag(user_derived(() => $$props.rest.onconnectend), "onconnectend"), onbeforereconnect = tag(user_derived(() => $$props.rest.onbeforereconnect), "onbeforereconnect"), onreconnect = tag(user_derived(() => $$props.rest.onreconnect), "onreconnect"), onreconnectstart = tag(user_derived(() => $$props.rest.onreconnectstart), "onreconnectstart"), onreconnectend = tag(user_derived(() => $$props.rest.onreconnectend), "onreconnectend"), onclickconnectstart = tag(user_derived(() => $$props.rest.onclickconnectstart), "onclickconnectstart"), onclickconnectend = tag(user_derived(() => $$props.rest.onclickconnectend), "onclickconnectend"), oninit = tag(user_derived(() => $$props.rest.oninit), "oninit"), onselectionchange = tag(user_derived(() => $$props.rest.onselectionchange), "onselectionchange"), onselectiondragstart = tag(user_derived(() => $$props.rest.onselectiondragstart), "onselectiondragstart"), onselectiondrag = tag(user_derived(() => $$props.rest.onselectiondrag), "onselectiondrag"), onselectiondragstop = tag(user_derived(() => $$props.rest.onselectiondragstop), "onselectiondragstop"), onselectionstart = tag(user_derived(() => $$props.rest.onselectionstart), "onselectionstart"), onselectionend = tag(user_derived(() => $$props.rest.onselectionend), "onselectionend"), clickConnect = tag(user_derived(() => $$props.rest.clickConnect), "clickConnect"), fitView = tag(user_derived(() => $$props.rest.fitView), "fitView"), fitViewOptions = tag(user_derived(() => $$props.rest.fitViewOptions), "fitViewOptions"), nodeOrigin = tag(user_derived(() => $$props.rest.nodeOrigin), "nodeOrigin"), nodeDragThreshold = tag(user_derived(() => $$props.rest.nodeDragThreshold), "nodeDragThreshold"), connectionDragThreshold = tag(user_derived(() => $$props.rest.connectionDragThreshold), "connectionDragThreshold"), minZoom = tag(user_derived(() => $$props.rest.minZoom), "minZoom"), maxZoom = tag(user_derived(() => $$props.rest.maxZoom), "maxZoom"), initialViewport = tag(user_derived(() => $$props.rest.initialViewport), "initialViewport"), connectionRadius = tag(user_derived(() => $$props.rest.connectionRadius), "connectionRadius"), connectionMode = tag(user_derived(() => $$props.rest.connectionMode), "connectionMode"), selectionMode = tag(user_derived(() => $$props.rest.selectionMode), "selectionMode"), selectNodesOnDrag = tag(user_derived(() => $$props.rest.selectNodesOnDrag), "selectNodesOnDrag"), snapGrid = tag(user_derived(() => $$props.rest.snapGrid), "snapGrid"), defaultMarkerColor = tag(user_derived(() => $$props.rest.defaultMarkerColor), "defaultMarkerColor"), translateExtent = tag(user_derived(() => $$props.rest.translateExtent), "translateExtent"), nodeExtent = tag(user_derived(() => $$props.rest.nodeExtent), "nodeExtent"), onlyRenderVisibleElements = tag(user_derived(() => $$props.rest.onlyRenderVisibleElements), "onlyRenderVisibleElements"), autoPanOnConnect = tag(user_derived(() => $$props.rest.autoPanOnConnect), "autoPanOnConnect"), autoPanOnNodeDrag = tag(user_derived(() => $$props.rest.autoPanOnNodeDrag), "autoPanOnNodeDrag"), colorModeSSR = tag(user_derived(() => $$props.rest.colorModeSSR), "colorModeSSR"), defaultEdgeOptions = tag(user_derived(() => $$props.rest.defaultEdgeOptions), "defaultEdgeOptions"), elevateNodesOnSelect = tag(user_derived(() => $$props.rest.elevateNodesOnSelect), "elevateNodesOnSelect"), elevateEdgesOnSelect = tag(user_derived(() => $$props.rest.elevateEdgesOnSelect), "elevateEdgesOnSelect"), nodesDraggable = tag(user_derived(() => $$props.rest.nodesDraggable), "nodesDraggable"), autoPanOnNodeFocus = tag(user_derived(() => $$props.rest.autoPanOnNodeFocus), "autoPanOnNodeFocus"), nodesConnectable = tag(user_derived(() => $$props.rest.nodesConnectable), "nodesConnectable"), elementsSelectable = tag(user_derived(() => $$props.rest.elementsSelectable), "elementsSelectable"), nodesFocusable = tag(user_derived(() => $$props.rest.nodesFocusable), "nodesFocusable"), edgesFocusable = tag(user_derived(() => $$props.rest.edgesFocusable), "edgesFocusable"), disableKeyboardA11y = tag(user_derived(() => $$props.rest.disableKeyboardA11y), "disableKeyboardA11y"), noDragClass = tag(user_derived(() => $$props.rest.noDragClass), "noDragClass"), noPanClass = tag(user_derived(() => $$props.rest.noPanClass), "noPanClass"), noWheelClass = tag(user_derived(() => $$props.rest.noWheelClass), "noWheelClass"), ariaLabelConfig = tag(user_derived(() => $$props.rest.ariaLabelConfig), "ariaLabelConfig"), autoPanSpeed = tag(user_derived(() => $$props.rest.autoPanSpeed), "autoPanSpeed"), panOnScrollSpeed = tag(user_derived(() => $$props.rest.panOnScrollSpeed), "panOnScrollSpeed"), zIndexMode = tag(user_derived(() => $$props.rest.zIndexMode), "zIndexMode"), divAttributes = tag(
    user_derived(() => exclude_from_object($$props.rest, [
      "id",
      "class",
      "nodeTypes",
      "edgeTypes",
      "colorMode",
      "isValidConnection",
      "onmove",
      "onmovestart",
      "onmoveend",
      "onflowerror",
      "ondelete",
      "onbeforedelete",
      "onbeforeconnect",
      "onconnect",
      "onconnectstart",
      "onconnectend",
      "onbeforereconnect",
      "onreconnect",
      "onreconnectstart",
      "onreconnectend",
      "onclickconnectstart",
      "onclickconnectend",
      "oninit",
      "onselectionchange",
      "onselectiondragstart",
      "onselectiondrag",
      "onselectiondragstop",
      "onselectionstart",
      "onselectionend",
      "clickConnect",
      "fitView",
      "fitViewOptions",
      "nodeOrigin",
      "nodeDragThreshold",
      "connectionDragThreshold",
      "minZoom",
      "maxZoom",
      "initialViewport",
      "connectionRadius",
      "connectionMode",
      "selectionMode",
      "selectNodesOnDrag",
      "snapGrid",
      "defaultMarkerColor",
      "translateExtent",
      "nodeExtent",
      "onlyRenderVisibleElements",
      "autoPanOnConnect",
      "autoPanOnNodeDrag",
      "colorModeSSR",
      "defaultEdgeOptions",
      "elevateNodesOnSelect",
      "elevateEdgesOnSelect",
      "nodesDraggable",
      "autoPanOnNodeFocus",
      "nodesConnectable",
      "elementsSelectable",
      "nodesFocusable",
      "edgesFocusable",
      "disableKeyboardA11y",
      "noDragClass",
      "noPanClass",
      "noWheelClass",
      "ariaLabelConfig",
      "autoPanSpeed",
      "panOnScrollSpeed",
      "zIndexMode"
    ])),
    "divAttributes"
  );
  function wrapperOnScroll(e) {
    e.currentTarget.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if ($$props.rest.onscroll) {
      $$props.rest.onscroll(e);
    }
  }
  var $$exports = { ...legacy_api() };
  var div = root17();
  attribute_effect(
    div,
    ($0) => ({
      class: [
        "svelte-flow",
        "svelte-flow__container",
        get(className),
        $$props.colorMode
      ],
      "data-testid": "svelte-flow__wrapper",
      role: "application",
      onscroll: wrapperOnScroll,
      ...get(divAttributes),
      [STYLE]: $0
    }),
    [
      () => ({
        width: toPxString($$props.width),
        height: toPxString($$props.height)
      })
    ],
    void 0,
    void 0,
    "svelte-mkap6j"
  );
  var node = child(div);
  add_svelte_meta(() => snippet(node, () => $$props.children ?? noop), "render", Wrapper, 131, 2);
  reset(div);
  bind_this(div, ($$value) => domNode($$value), () => domNode());
  bind_element_size(div, "clientHeight", function set4($$value) {
    clientHeight($$value);
  });
  bind_element_size(div, "clientWidth", function set4($$value) {
    clientWidth($$value);
  });
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/container/SvelteFlow/SvelteFlow.svelte
SvelteFlow[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/container/SvelteFlow/SvelteFlow.svelte";
var root_4 = add_locations(from_html(`<div class="svelte-flow__viewport-back svelte-flow__container"></div> <!> <div class="svelte-flow__edge-labels svelte-flow__container"></div> <!> <!> <!> <div class="svelte-flow__viewport-front svelte-flow__container"></div>`, 1), SvelteFlow[FILENAME], [[176, 8], [184, 8], [212, 8]]);
var root_32 = add_locations(from_html(`<!> <!>`, 1), SvelteFlow[FILENAME], []);
var root_19 = add_locations(from_html(`<!> <!> <!> <!> <!>`, 1), SvelteFlow[FILENAME], []);
function SvelteFlow($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, SvelteFlow);
  let paneClickDistance = prop($$props, "paneClickDistance", 3, 1), nodeClickDistance = prop($$props, "nodeClickDistance", 3, 1), panOnScrollMode = prop($$props, "panOnScrollMode", 19, () => PanOnScrollMode.Free), preventScrolling = prop($$props, "preventScrolling", 3, true), zoomOnScroll = prop($$props, "zoomOnScroll", 3, true), zoomOnDoubleClick = prop($$props, "zoomOnDoubleClick", 3, true), zoomOnPinch = prop($$props, "zoomOnPinch", 3, true), panOnScroll = prop($$props, "panOnScroll", 3, false), panOnScrollSpeed = prop($$props, "panOnScrollSpeed", 3, 0.5), panOnDrag = prop($$props, "panOnDrag", 3, true), selectionOnDrag = prop($$props, "selectionOnDrag", 3, false), connectionLineType = prop($$props, "connectionLineType", 19, () => ConnectionLineType.Bezier), nodes = prop($$props, "nodes", 31, () => tag_proxy(proxy([]), "nodes")), edges = prop($$props, "edges", 31, () => tag_proxy(proxy([]), "edges")), viewport = prop($$props, "viewport", 15, void 0), props = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "width",
      "height",
      "proOptions",
      "selectionKey",
      "deleteKey",
      "panActivationKey",
      "multiSelectionKey",
      "zoomActivationKey",
      "paneClickDistance",
      "nodeClickDistance",
      "onmovestart",
      "onmoveend",
      "onmove",
      "oninit",
      "onnodeclick",
      "onnodecontextmenu",
      "onnodedrag",
      "onnodedragstart",
      "onnodedragstop",
      "onnodepointerenter",
      "onnodepointermove",
      "onnodepointerleave",
      "onselectionclick",
      "onselectioncontextmenu",
      "onselectionstart",
      "onselectionend",
      "onedgeclick",
      "onedgecontextmenu",
      "onedgepointerenter",
      "onedgepointerleave",
      "onpaneclick",
      "onpanecontextmenu",
      "panOnScrollMode",
      "preventScrolling",
      "zoomOnScroll",
      "zoomOnDoubleClick",
      "zoomOnPinch",
      "panOnScroll",
      "panOnScrollSpeed",
      "panOnDrag",
      "selectionOnDrag",
      "connectionLineComponent",
      "connectionLineStyle",
      "connectionLineContainerStyle",
      "connectionLineType",
      "attributionPosition",
      "children",
      "nodes",
      "edges",
      "viewport"
    ],
    "props"
  );
  let store = createStore({
    props,
    width: $$props.width,
    height: $$props.height,
    get nodes() {
      return nodes();
    },
    set nodes(newNodes) {
      nodes(newNodes);
    },
    get edges() {
      return edges();
    },
    set edges(newEdges) {
      edges(newEdges);
    },
    get viewport() {
      return viewport();
    },
    set viewport(newViewport) {
      viewport(newViewport);
    }
  });
  const providerContext = getContext(key2);
  if (providerContext && providerContext.setStore) {
    providerContext.setStore(store);
  }
  setContext(key2, {
    provider: false,
    getStore() {
      return store;
    }
  });
  user_effect(() => {
    const params = { nodes: store.selectedNodes, edges: store.selectedEdges };
    untrack(() => $$props.onselectionchange)?.(params);
    for (const handler of store.selectionChangeHandlers.values()) {
      handler(params);
    }
  });
  onDestroy(() => {
    store.reset();
  });
  var $$exports = { ...legacy_api() };
  validate_binding("bind:domNode={store.domNode}", [], () => store, () => "domNode", 132, 2);
  validate_binding("bind:clientWidth={store.width}", [], () => store, () => "width", 133, 2);
  validate_binding("bind:clientHeight={store.height}", [], () => store, () => "height", 134, 2);
  add_svelte_meta(
    () => Wrapper($$anchor, {
      get colorMode() {
        return store.colorMode;
      },
      get width() {
        return $$props.width;
      },
      get height() {
        return $$props.height;
      },
      get rest() {
        return props;
      },
      get domNode() {
        return store.domNode;
      },
      set domNode($$value) {
        store.domNode = $$value;
      },
      get clientWidth() {
        return store.width;
      },
      set clientWidth($$value) {
        store.width = $$value;
      },
      get clientHeight() {
        return store.height;
      },
      set clientHeight($$value) {
        store.height = $$value;
      },
      children: wrap_snippet(SvelteFlow, ($$anchor2, $$slotProps) => {
        var fragment_1 = root_19();
        var node = first_child(fragment_1);
        add_svelte_meta(
          () => KeyHandler(node, {
            get selectionKey() {
              return $$props.selectionKey;
            },
            get deleteKey() {
              return $$props.deleteKey;
            },
            get panActivationKey() {
              return $$props.panActivationKey;
            },
            get multiSelectionKey() {
              return $$props.multiSelectionKey;
            },
            get zoomActivationKey() {
              return $$props.zoomActivationKey;
            },
            get store() {
              return store;
            },
            set store($$value) {
              store = $$value;
            }
          }),
          "component",
          SvelteFlow,
          140,
          2,
          { componentTag: "KeyHandler" }
        );
        var node_1 = sibling(node, 2);
        add_svelte_meta(
          () => Zoom(node_1, {
            get panOnScrollMode() {
              return panOnScrollMode();
            },
            get preventScrolling() {
              return preventScrolling();
            },
            get zoomOnScroll() {
              return zoomOnScroll();
            },
            get zoomOnDoubleClick() {
              return zoomOnDoubleClick();
            },
            get zoomOnPinch() {
              return zoomOnPinch();
            },
            get panOnScroll() {
              return panOnScroll();
            },
            get panOnScrollSpeed() {
              return panOnScrollSpeed();
            },
            get panOnDrag() {
              return panOnDrag();
            },
            get paneClickDistance() {
              return paneClickDistance();
            },
            get selectionOnDrag() {
              return selectionOnDrag();
            },
            get onmovestart() {
              return $$props.onmovestart;
            },
            get onmove() {
              return $$props.onmove;
            },
            get onmoveend() {
              return $$props.onmoveend;
            },
            get oninit() {
              return $$props.oninit;
            },
            get store() {
              return store;
            },
            set store($$value) {
              store = $$value;
            },
            children: wrap_snippet(SvelteFlow, ($$anchor3, $$slotProps2) => {
              add_svelte_meta(
                () => Pane($$anchor3, {
                  get onpaneclick() {
                    return $$props.onpaneclick;
                  },
                  get onpanecontextmenu() {
                    return $$props.onpanecontextmenu;
                  },
                  get onselectionstart() {
                    return $$props.onselectionstart;
                  },
                  get onselectionend() {
                    return $$props.onselectionend;
                  },
                  get panOnDrag() {
                    return panOnDrag();
                  },
                  get paneClickDistance() {
                    return paneClickDistance();
                  },
                  get selectionOnDrag() {
                    return selectionOnDrag();
                  },
                  get store() {
                    return store;
                  },
                  set store($$value) {
                    store = $$value;
                  },
                  children: wrap_snippet(SvelteFlow, ($$anchor4, $$slotProps3) => {
                    var fragment_3 = root_32();
                    var node_2 = first_child(fragment_3);
                    add_svelte_meta(
                      () => Viewport(node_2, {
                        get store() {
                          return store;
                        },
                        set store($$value) {
                          store = $$value;
                        },
                        children: wrap_snippet(SvelteFlow, ($$anchor5, $$slotProps4) => {
                          var fragment_4 = root_4();
                          var node_3 = sibling(first_child(fragment_4), 2);
                          add_svelte_meta(
                            () => EdgeRenderer(node_3, {
                              get onedgeclick() {
                                return $$props.onedgeclick;
                              },
                              get onedgecontextmenu() {
                                return $$props.onedgecontextmenu;
                              },
                              get onedgepointerenter() {
                                return $$props.onedgepointerenter;
                              },
                              get onedgepointerleave() {
                                return $$props.onedgepointerleave;
                              },
                              get store() {
                                return store;
                              },
                              set store($$value) {
                                store = $$value;
                              }
                            }),
                            "component",
                            SvelteFlow,
                            177,
                            8,
                            { componentTag: "EdgeRenderer" }
                          );
                          var node_4 = sibling(node_3, 4);
                          add_svelte_meta(
                            () => ConnectionLine(node_4, {
                              get type() {
                                return connectionLineType();
                              },
                              get LineComponent() {
                                return $$props.connectionLineComponent;
                              },
                              get containerStyle() {
                                return $$props.connectionLineContainerStyle;
                              },
                              get style() {
                                return $$props.connectionLineStyle;
                              },
                              get store() {
                                return store;
                              },
                              set store($$value) {
                                store = $$value;
                              }
                            }),
                            "component",
                            SvelteFlow,
                            185,
                            8,
                            { componentTag: "ConnectionLine" }
                          );
                          var node_5 = sibling(node_4, 2);
                          add_svelte_meta(
                            () => NodeRenderer(node_5, {
                              get nodeClickDistance() {
                                return nodeClickDistance();
                              },
                              get onnodeclick() {
                                return $$props.onnodeclick;
                              },
                              get onnodecontextmenu() {
                                return $$props.onnodecontextmenu;
                              },
                              get onnodepointerenter() {
                                return $$props.onnodepointerenter;
                              },
                              get onnodepointermove() {
                                return $$props.onnodepointermove;
                              },
                              get onnodepointerleave() {
                                return $$props.onnodepointerleave;
                              },
                              get onnodedrag() {
                                return $$props.onnodedrag;
                              },
                              get onnodedragstart() {
                                return $$props.onnodedragstart;
                              },
                              get onnodedragstop() {
                                return $$props.onnodedragstop;
                              },
                              get store() {
                                return store;
                              },
                              set store($$value) {
                                store = $$value;
                              }
                            }),
                            "component",
                            SvelteFlow,
                            192,
                            8,
                            { componentTag: "NodeRenderer" }
                          );
                          var node_6 = sibling(node_5, 2);
                          add_svelte_meta(
                            () => NodeSelection(node_6, {
                              get onselectionclick() {
                                return $$props.onselectionclick;
                              },
                              get onselectioncontextmenu() {
                                return $$props.onselectioncontextmenu;
                              },
                              get onnodedrag() {
                                return $$props.onnodedrag;
                              },
                              get onnodedragstart() {
                                return $$props.onnodedragstart;
                              },
                              get onnodedragstop() {
                                return $$props.onnodedragstop;
                              },
                              get store() {
                                return store;
                              },
                              set store($$value) {
                                store = $$value;
                              }
                            }),
                            "component",
                            SvelteFlow,
                            204,
                            8,
                            { componentTag: "NodeSelection" }
                          );
                          next(2);
                          append($$anchor5, fragment_4);
                        }),
                        $$slots: { default: true }
                      }),
                      "component",
                      SvelteFlow,
                      175,
                      6,
                      { componentTag: "ViewportComponent" }
                    );
                    var node_7 = sibling(node_2, 2);
                    {
                      let $0 = user_derived(() => !!(store.selectionRect && strict_equals(store.selectionRectMode, "user")));
                      let $1 = user_derived(() => store.selectionRect?.width);
                      let $2 = user_derived(() => store.selectionRect?.height);
                      let $3 = user_derived(() => store.selectionRect?.x);
                      let $4 = user_derived(() => store.selectionRect?.y);
                      add_svelte_meta(
                        () => Selection3(node_7, {
                          get isVisible() {
                            return get($0);
                          },
                          get width() {
                            return get($1);
                          },
                          get height() {
                            return get($2);
                          },
                          get x() {
                            return get($3);
                          },
                          get y() {
                            return get($4);
                          }
                        }),
                        "component",
                        SvelteFlow,
                        214,
                        6,
                        { componentTag: "Selection" }
                      );
                    }
                    append($$anchor4, fragment_3);
                  }),
                  $$slots: { default: true }
                }),
                "component",
                SvelteFlow,
                165,
                4,
                { componentTag: "Pane" }
              );
            }),
            $$slots: { default: true }
          }),
          "component",
          SvelteFlow,
          148,
          2,
          { componentTag: "Zoom" }
        );
        var node_8 = sibling(node_1, 2);
        add_svelte_meta(
          () => Attribution(node_8, {
            get proOptions() {
              return $$props.proOptions;
            },
            get position() {
              return $$props.attributionPosition;
            }
          }),
          "component",
          SvelteFlow,
          223,
          2,
          { componentTag: "Attribution" }
        );
        var node_9 = sibling(node_8, 2);
        add_svelte_meta(
          () => A11yDescriptions(node_9, {
            get store() {
              return store;
            }
          }),
          "component",
          SvelteFlow,
          224,
          2,
          { componentTag: "A11yDescriptions" }
        );
        var node_10 = sibling(node_9, 2);
        add_svelte_meta(() => snippet(node_10, () => $$props.children ?? noop), "render", SvelteFlow, 225, 2);
        append($$anchor2, fragment_1);
      }),
      $$slots: { default: true }
    }),
    "component",
    SvelteFlow,
    131,
    0,
    { componentTag: "Wrapper" }
  );
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/ControlButton.svelte
ControlButton[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/ControlButton.svelte";
var root18 = add_locations(from_html(`<button><!></button>`), ControlButton[FILENAME], [[17, 0]]);
function ControlButton($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, ControlButton);
  let restProps = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "class",
      "bgColor",
      "bgColorHover",
      "color",
      "colorHover",
      "borderColor",
      "onclick",
      "children"
    ],
    "restProps"
  );
  var $$exports = { ...legacy_api() };
  var button = root18();
  attribute_effect(button, () => ({
    type: "button",
    onclick: $$props.onclick,
    class: ["svelte-flow__controls-button", $$props.class],
    ...restProps,
    [STYLE]: {
      "--xy-controls-button-background-color-props": $$props.bgColor,
      "--xy-controls-button-background-color-hover-props": $$props.bgColorHover,
      "--xy-controls-button-color-props": $$props.color,
      "--xy-controls-button-color-hover-props": $$props.colorHover,
      "--xy-controls-button-border-color-props": $$props.borderColor
    }
  }));
  var node = child(button);
  add_svelte_meta(() => snippet(node, () => $$props.children ?? noop), "render", ControlButton, 28, 2);
  reset(button);
  append($$anchor, button);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Plus.svelte
Plus[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Plus.svelte";
var root19 = add_locations(from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"></path></svg>`), Plus[FILENAME], [[1, 0, [[2, 2]]]]);
function Plus($$anchor, $$props) {
  check_target(new.target);
  push($$props, false, Plus);
  var $$exports = { ...legacy_api() };
  var svg = root19();
  append($$anchor, svg);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Minus.svelte
Minus[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Minus.svelte";
var root20 = add_locations(from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 5"><path d="M0 0h32v4.2H0z"></path></svg>`), Minus[FILENAME], [[1, 0, [[2, 2]]]]);
function Minus($$anchor, $$props) {
  check_target(new.target);
  push($$props, false, Minus);
  var $$exports = { ...legacy_api() };
  var svg = root20();
  append($$anchor, svg);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Fit.svelte
Fit[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Fit.svelte";
var root21 = add_locations(from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30"><path d="M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"></path></svg>`), Fit[FILENAME], [[1, 0, [[2, 2]]]]);
function Fit($$anchor, $$props) {
  check_target(new.target);
  push($$props, false, Fit);
  var $$exports = { ...legacy_api() };
  var svg = root21();
  append($$anchor, svg);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Lock.svelte
Lock[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Lock.svelte";
var root22 = add_locations(from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32"><path d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"></path></svg>`), Lock[FILENAME], [[1, 0, [[2, 2]]]]);
function Lock($$anchor, $$props) {
  check_target(new.target);
  push($$props, false, Lock);
  var $$exports = { ...legacy_api() };
  var svg = root22();
  append($$anchor, svg);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Unlock.svelte
Unlock[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Icons/Unlock.svelte";
var root23 = add_locations(from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32"><path d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z"></path></svg>`), Unlock[FILENAME], [[1, 0, [[2, 2]]]]);
function Unlock($$anchor, $$props) {
  check_target(new.target);
  push($$props, false, Unlock);
  var $$exports = { ...legacy_api() };
  var svg = root23();
  append($$anchor, svg);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Controls.svelte
Controls[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Controls/Controls.svelte";
var root_33 = add_locations(from_html(`<!> <!>`, 1), Controls[FILENAME], []);
var root_110 = add_locations(from_html(`<!> <!> <!> <!> <!> <!>`, 1), Controls[FILENAME], []);
function Controls($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Controls);
  let position = prop($$props, "position", 3, "bottom-left"), orientation = prop($$props, "orientation", 3, "vertical"), showZoom = prop($$props, "showZoom", 3, true), showFitView = prop($$props, "showFitView", 3, true), showLock = prop($$props, "showLock", 3, true), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "position",
      "orientation",
      "showZoom",
      "showFitView",
      "showLock",
      "style",
      "class",
      "buttonBgColor",
      "buttonBgColorHover",
      "buttonColor",
      "buttonColorHover",
      "buttonBorderColor",
      "fitViewOptions",
      "children",
      "before",
      "after"
    ],
    "rest"
  );
  let store = tag(user_derived(useStore), "store");
  const buttonProps = {
    bgColor: $$props.buttonBgColor,
    bgColorHover: $$props.buttonBgColorHover,
    color: $$props.buttonColor,
    colorHover: $$props.buttonColorHover,
    borderColor: $$props.buttonBorderColor
  };
  let isInteractive = tag(user_derived(() => get(store).nodesDraggable || get(store).nodesConnectable || get(store).elementsSelectable), "isInteractive");
  let minZoomReached = tag(user_derived(() => get(store).viewport.zoom <= get(store).minZoom), "minZoomReached");
  let maxZoomReached = tag(user_derived(() => get(store).viewport.zoom >= get(store).maxZoom), "maxZoomReached");
  let ariaLabelConfig = tag(user_derived(() => get(store).ariaLabelConfig), "ariaLabelConfig");
  let orientationClass = tag(user_derived(() => strict_equals(orientation(), "horizontal") ? "horizontal" : "vertical"), "orientationClass");
  const onZoomInHandler = () => {
    get(store).zoomIn();
  };
  const onZoomOutHandler = () => {
    get(store).zoomOut();
  };
  const onFitViewHandler = () => {
    get(store).fitView($$props.fitViewOptions);
  };
  const onToggleInteractivity = () => {
    let interactive2 = !get(isInteractive);
    get(store).nodesDraggable = interactive2;
    get(store).nodesConnectable = interactive2;
    get(store).elementsSelectable = interactive2;
  };
  var $$exports = { ...legacy_api() };
  {
    let $0 = user_derived(() => [
      "svelte-flow__controls",
      get(orientationClass),
      $$props.class
    ]);
    add_svelte_meta(
      () => Panel($$anchor, spread_props(
        {
          get class() {
            return get($0);
          },
          get position() {
            return position();
          },
          "data-testid": "svelte-flow__controls",
          get "aria-label"() {
            return get(ariaLabelConfig)["controls.ariaLabel"];
          },
          get style() {
            return $$props.style;
          }
        },
        () => rest,
        {
          children: wrap_snippet(Controls, ($$anchor2, $$slotProps) => {
            var fragment_1 = root_110();
            var node = first_child(fragment_1);
            {
              var consequent = ($$anchor3) => {
                var fragment_2 = comment();
                var node_1 = first_child(fragment_2);
                add_svelte_meta(() => snippet(node_1, () => $$props.before), "render", Controls, 80, 4);
                append($$anchor3, fragment_2);
              };
              add_svelte_meta(
                () => if_block(node, ($$render) => {
                  if ($$props.before) $$render(consequent);
                }),
                "if",
                Controls,
                79,
                2
              );
            }
            var node_2 = sibling(node, 2);
            {
              var consequent_1 = ($$anchor3) => {
                var fragment_3 = root_33();
                var node_3 = first_child(fragment_3);
                add_svelte_meta(
                  () => ControlButton(node_3, spread_props(
                    {
                      onclick: onZoomInHandler,
                      class: "svelte-flow__controls-zoomin",
                      get title() {
                        return get(ariaLabelConfig)["controls.zoomIn.ariaLabel"];
                      },
                      get "aria-label"() {
                        return get(ariaLabelConfig)["controls.zoomIn.ariaLabel"];
                      },
                      get disabled() {
                        return get(maxZoomReached);
                      }
                    },
                    () => buttonProps,
                    {
                      children: wrap_snippet(Controls, ($$anchor4, $$slotProps2) => {
                        add_svelte_meta(() => Plus($$anchor4, {}), "component", Controls, 91, 6, { componentTag: "PlusIcon" });
                      }),
                      $$slots: { default: true }
                    }
                  )),
                  "component",
                  Controls,
                  83,
                  4,
                  { componentTag: "ControlButton" }
                );
                var node_4 = sibling(node_3, 2);
                add_svelte_meta(
                  () => ControlButton(node_4, spread_props(
                    {
                      onclick: onZoomOutHandler,
                      class: "svelte-flow__controls-zoomout",
                      get title() {
                        return get(ariaLabelConfig)["controls.zoomOut.ariaLabel"];
                      },
                      get "aria-label"() {
                        return get(ariaLabelConfig)["controls.zoomOut.ariaLabel"];
                      },
                      get disabled() {
                        return get(minZoomReached);
                      }
                    },
                    () => buttonProps,
                    {
                      children: wrap_snippet(Controls, ($$anchor4, $$slotProps2) => {
                        add_svelte_meta(() => Minus($$anchor4, {}), "component", Controls, 101, 6, { componentTag: "MinusIcon" });
                      }),
                      $$slots: { default: true }
                    }
                  )),
                  "component",
                  Controls,
                  93,
                  4,
                  { componentTag: "ControlButton" }
                );
                append($$anchor3, fragment_3);
              };
              add_svelte_meta(
                () => if_block(node_2, ($$render) => {
                  if (showZoom()) $$render(consequent_1);
                }),
                "if",
                Controls,
                82,
                2
              );
            }
            var node_5 = sibling(node_2, 2);
            {
              var consequent_2 = ($$anchor3) => {
                add_svelte_meta(
                  () => ControlButton($$anchor3, spread_props(
                    {
                      class: "svelte-flow__controls-fitview",
                      onclick: onFitViewHandler,
                      get title() {
                        return get(ariaLabelConfig)["controls.fitView.ariaLabel"];
                      },
                      get "aria-label"() {
                        return get(ariaLabelConfig)["controls.fitView.ariaLabel"];
                      }
                    },
                    () => buttonProps,
                    {
                      children: wrap_snippet(Controls, ($$anchor4, $$slotProps2) => {
                        add_svelte_meta(() => Fit($$anchor4, {}), "component", Controls, 112, 6, { componentTag: "FitViewIcon" });
                      }),
                      $$slots: { default: true }
                    }
                  )),
                  "component",
                  Controls,
                  105,
                  4,
                  { componentTag: "ControlButton" }
                );
              };
              add_svelte_meta(
                () => if_block(node_5, ($$render) => {
                  if (showFitView()) $$render(consequent_2);
                }),
                "if",
                Controls,
                104,
                2
              );
            }
            var node_6 = sibling(node_5, 2);
            {
              var consequent_4 = ($$anchor3) => {
                add_svelte_meta(
                  () => ControlButton($$anchor3, spread_props(
                    {
                      class: "svelte-flow__controls-interactive",
                      onclick: onToggleInteractivity,
                      get title() {
                        return get(ariaLabelConfig)["controls.interactive.ariaLabel"];
                      },
                      get "aria-label"() {
                        return get(ariaLabelConfig)["controls.interactive.ariaLabel"];
                      }
                    },
                    () => buttonProps,
                    {
                      children: wrap_snippet(Controls, ($$anchor4, $$slotProps2) => {
                        var fragment_9 = comment();
                        var node_7 = first_child(fragment_9);
                        {
                          var consequent_3 = ($$anchor5) => {
                            add_svelte_meta(() => Unlock($$anchor5, {}), "component", Controls, 123, 25, { componentTag: "UnlockIcon" });
                          };
                          var alternate = ($$anchor5) => {
                            add_svelte_meta(() => Lock($$anchor5, {}), "component", Controls, 123, 46, { componentTag: "LockIcon" });
                          };
                          add_svelte_meta(
                            () => if_block(node_7, ($$render) => {
                              if (get(isInteractive)) $$render(consequent_3);
                              else $$render(alternate, -1);
                            }),
                            "if",
                            Controls,
                            123,
                            6
                          );
                        }
                        append($$anchor4, fragment_9);
                      }),
                      $$slots: { default: true }
                    }
                  )),
                  "component",
                  Controls,
                  116,
                  4,
                  { componentTag: "ControlButton" }
                );
              };
              add_svelte_meta(
                () => if_block(node_6, ($$render) => {
                  if (showLock()) $$render(consequent_4);
                }),
                "if",
                Controls,
                115,
                2
              );
            }
            var node_8 = sibling(node_6, 2);
            {
              var consequent_5 = ($$anchor3) => {
                var fragment_12 = comment();
                var node_9 = first_child(fragment_12);
                add_svelte_meta(() => snippet(node_9, () => $$props.children), "render", Controls, 127, 4);
                append($$anchor3, fragment_12);
              };
              add_svelte_meta(
                () => if_block(node_8, ($$render) => {
                  if ($$props.children) $$render(consequent_5);
                }),
                "if",
                Controls,
                126,
                2
              );
            }
            var node_10 = sibling(node_8, 2);
            {
              var consequent_6 = ($$anchor3) => {
                var fragment_13 = comment();
                var node_11 = first_child(fragment_13);
                add_svelte_meta(() => snippet(node_11, () => $$props.after), "render", Controls, 130, 4);
                append($$anchor3, fragment_13);
              };
              add_svelte_meta(
                () => if_block(node_10, ($$render) => {
                  if ($$props.after) $$render(consequent_6);
                }),
                "if",
                Controls,
                129,
                2
              );
            }
            append($$anchor2, fragment_1);
          }),
          $$slots: { default: true }
        }
      )),
      "component",
      Controls,
      71,
      0,
      { componentTag: "Panel" }
    );
  }
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Background/types.js
var BackgroundVariant;
(function(BackgroundVariant2) {
  BackgroundVariant2["Lines"] = "lines";
  BackgroundVariant2["Dots"] = "dots";
  BackgroundVariant2["Cross"] = "cross";
})(BackgroundVariant || (BackgroundVariant = {}));

// node_modules/@xyflow/svelte/dist/lib/plugins/Background/DotPattern.svelte
DotPattern[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Background/DotPattern.svelte";
var root24 = add_locations(from_svg(`<circle></circle>`), DotPattern[FILENAME], [[7, 0]]);
function DotPattern($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, DotPattern);
  var $$exports = { ...legacy_api() };
  var circle = root24();
  template_effect(() => {
    set_attribute2(circle, "cx", $$props.radius);
    set_attribute2(circle, "cy", $$props.radius);
    set_attribute2(circle, "r", $$props.radius);
    set_class(circle, 0, clsx2(["svelte-flow__background-pattern", "dots", $$props.class]));
  });
  append($$anchor, circle);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Background/LinePattern.svelte
LinePattern[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Background/LinePattern.svelte";
var root25 = add_locations(from_svg(`<path></path>`), LinePattern[FILENAME], [[18, 0]]);
function LinePattern($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, LinePattern);
  var $$exports = { ...legacy_api() };
  var path = root25();
  template_effect(() => {
    set_attribute2(path, "stroke-width", $$props.lineWidth);
    set_attribute2(path, "d", `M${$$props.dimensions[0] / 2} 0 V${$$props.dimensions[1]} M0 ${$$props.dimensions[1] / 2} H${$$props.dimensions[0]}`);
    set_class(path, 0, clsx2([
      "svelte-flow__background-pattern",
      $$props.variant,
      $$props.class
    ]));
  });
  append($$anchor, path);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Background/Background.svelte
Background[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Background/Background.svelte";
var defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6
};
var root26 = add_locations(from_svg(`<svg data-testid="svelte-flow__background"><pattern patternUnits="userSpaceOnUse"><!></pattern><rect x="0" y="0" width="100%" height="100%"></rect></svg>`), Background[FILENAME], [[49, 0, [[55, 2], [70, 2]]]]);
function Background($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Background);
  let variant = prop($$props, "variant", 19, () => BackgroundVariant.Dots), gap = prop($$props, "gap", 3, 20), lineWidth = prop($$props, "lineWidth", 3, 1);
  let store = tag(user_derived(useStore), "store");
  let isDots = tag(user_derived(() => strict_equals(variant(), BackgroundVariant.Dots)), "isDots");
  let isCross = tag(user_derived(() => strict_equals(variant(), BackgroundVariant.Cross)), "isCross");
  let gapXY = tag(user_derived(() => Array.isArray(gap()) ? gap() : [gap(), gap()]), "gapXY");
  let patternId = tag(user_derived(() => `background-pattern-${get(store).flowId}-${$$props.id ?? ""}`), "patternId");
  let scaledGap = tag(
    user_derived(() => [
      get(gapXY)[0] * get(store).viewport.zoom || 1,
      get(gapXY)[1] * get(store).viewport.zoom || 1
    ]),
    "scaledGap"
  );
  let scaledSize = tag(user_derived(() => ($$props.size ?? defaultSize[variant()]) * get(store).viewport.zoom), "scaledSize");
  let patternDimensions = tag(
    user_derived(() => get(isCross) ? [get(scaledSize), get(scaledSize)] : get(scaledGap)),
    "patternDimensions"
  );
  let patternOffset = tag(
    user_derived(() => get(isDots) ? [get(scaledSize) / 2, get(scaledSize) / 2] : [
      get(patternDimensions)[0] / 2,
      get(patternDimensions)[1] / 2
    ]),
    "patternOffset"
  );
  var $$exports = { ...legacy_api() };
  var svg = root26();
  let styles;
  var pattern = child(svg);
  var node = child(pattern);
  {
    var consequent = ($$anchor2) => {
      {
        let $0 = user_derived(() => get(scaledSize) / 2);
        add_svelte_meta(
          () => DotPattern($$anchor2, {
            get radius() {
              return get($0);
            },
            get class() {
              return $$props.patternClass;
            }
          }),
          "component",
          Background,
          65,
          6,
          { componentTag: "DotPattern" }
        );
      }
    };
    var alternate = ($$anchor2) => {
      add_svelte_meta(
        () => LinePattern($$anchor2, {
          get dimensions() {
            return get(patternDimensions);
          },
          get variant() {
            return variant();
          },
          get lineWidth() {
            return lineWidth();
          },
          get class() {
            return $$props.patternClass;
          }
        }),
        "component",
        Background,
        67,
        6,
        { componentTag: "LinePattern" }
      );
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (get(isDots)) $$render(consequent);
        else $$render(alternate, -1);
      }),
      "if",
      Background,
      64,
      4
    );
  }
  reset(pattern);
  var rect = sibling(pattern);
  reset(svg);
  template_effect(() => {
    set_class(svg, 0, clsx2([
      "svelte-flow__background",
      "svelte-flow__container",
      $$props.class
    ]));
    styles = set_style(svg, "", styles, {
      "--xy-background-color-props": $$props.bgColor,
      "--xy-background-pattern-color-props": $$props.patternColor
    });
    set_attribute2(pattern, "id", get(patternId));
    set_attribute2(pattern, "x", get(store).viewport.x % get(scaledGap)[0]);
    set_attribute2(pattern, "y", get(store).viewport.y % get(scaledGap)[1]);
    set_attribute2(pattern, "width", get(scaledGap)[0]);
    set_attribute2(pattern, "height", get(scaledGap)[1]);
    set_attribute2(pattern, "patternTransform", `translate(-${get(patternOffset)[0]},-${get(patternOffset)[1]})`);
    set_attribute2(rect, "fill", `url(#${get(patternId)})`);
  });
  append($$anchor, svg);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/hooks/useInternalNode.svelte.js
function useInternalNode(id2) {
  const $$d = user_derived(useStore), nodeLookup = user_derived(() => get($$d).nodeLookup), nodes = user_derived(() => get($$d).nodes);
  const node = user_derived(() => {
    get(nodes);
    return get(nodeLookup).get(id2);
  });
  return {
    get current() {
      return get(node);
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/MinimapNode.svelte
MinimapNode[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/MinimapNode.svelte";
var root_23 = add_locations(from_svg(`<rect></rect>`), MinimapNode[FILENAME], [[61, 2]]);
function MinimapNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, MinimapNode);
  let borderRadius = prop($$props, "borderRadius", 3, 5), strokeWidth = prop($$props, "strokeWidth", 3, 2);
  let internalNode = tag(user_derived(() => useInternalNode($$props.id)), "internalNode");
  let $$d = user_derived(() => {
    if (!get(internalNode).current) {
      return { width: 0, height: 0, x: 0, y: 0 };
    }
    const { width: width2, height: height2 } = getNodeDimensions(get(internalNode).current);
    return {
      width: $$props.width ?? width2,
      height: $$props.height ?? height2,
      x: $$props.x ?? get(internalNode).current.internals.positionAbsolute.x,
      y: $$props.y ?? get(internalNode).current.internals.positionAbsolute.y
    };
  }), width = tag(user_derived(() => get($$d).width), "width"), height = tag(user_derived(() => get($$d).height), "height"), x = tag(user_derived(() => get($$d).x), "x"), y2 = tag(user_derived(() => get($$d).y), "y");
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      const CustomComponent = tag(user_derived(() => $$props.nodeComponent), "CustomComponent");
      get(CustomComponent);
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      add_svelte_meta(
        () => component(node_1, () => get(CustomComponent), ($$anchor3, CustomComponent_1) => {
          CustomComponent_1($$anchor3, {
            get id() {
              return $$props.id;
            },
            get x() {
              return get(x);
            },
            get y() {
              return get(y2);
            },
            get width() {
              return get(width);
            },
            get height() {
              return get(height);
            },
            get borderRadius() {
              return borderRadius();
            },
            get class() {
              return $$props.class;
            },
            get color() {
              return $$props.color;
            },
            get shapeRendering() {
              return $$props.shapeRendering;
            },
            get strokeColor() {
              return $$props.strokeColor;
            },
            get strokeWidth() {
              return strokeWidth();
            },
            get selected() {
              return $$props.selected;
            }
          });
        }),
        "component",
        MinimapNode,
        46,
        2,
        { componentTag: "CustomComponent" }
      );
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var rect = root_23();
      let classes;
      let styles;
      template_effect(() => {
        classes = set_class(rect, 0, clsx2(["svelte-flow__minimap-node", $$props.class]), null, classes, { selected: $$props.selected });
        set_attribute2(rect, "x", get(x));
        set_attribute2(rect, "y", get(y2));
        set_attribute2(rect, "rx", borderRadius());
        set_attribute2(rect, "ry", borderRadius());
        set_attribute2(rect, "width", get(width));
        set_attribute2(rect, "height", get(height));
        set_attribute2(rect, "shape-rendering", $$props.shapeRendering);
        styles = set_style(rect, "", styles, {
          fill: $$props.color,
          stroke: $$props.strokeColor,
          "stroke-width": strokeWidth()
        });
      });
      append($$anchor2, rect);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if ($$props.nodeComponent) $$render(consequent);
        else $$render(alternate, -1);
      }),
      "if",
      MinimapNode,
      43,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/interactive.js
function interactive(domNode, params) {
  const minimap = XYMinimap({
    domNode,
    panZoom: params.panZoom,
    getTransform: () => {
      const { viewport } = params.store;
      return [viewport.x, viewport.y, viewport.zoom];
    },
    getViewScale: params.getViewScale
  });
  minimap.update({
    translateExtent: params.translateExtent,
    width: params.width,
    height: params.height,
    inversePan: params.inversePan,
    zoomStep: params.zoomStep,
    pannable: params.pannable,
    zoomable: params.zoomable
  });
  function update2(params2) {
    minimap.update({
      translateExtent: params2.translateExtent,
      width: params2.width,
      height: params2.height,
      inversePan: params2.inversePan,
      zoomStep: params2.zoomStep,
      pannable: params2.pannable,
      zoomable: params2.zoomable
    });
  }
  return {
    update: update2,
    destroy() {
      minimap.destroy();
    }
  };
}

// node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/Minimap.svelte
Minimap[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/Minimap/Minimap.svelte";
var getAttrFunction = (func) => func instanceof Function ? func : () => func;
var root_34 = add_locations(from_svg(`<title> </title>`), Minimap[FILENAME], [[108, 8]]);
var root_24 = add_locations(from_svg(`<svg class="svelte-flow__minimap-svg" role="img"><!><!><path class="svelte-flow__minimap-mask" fill-rule="evenodd" pointer-events="none"></path></svg>`), Minimap[FILENAME], [[82, 4, [[127, 6]]]]);
var root27 = add_locations(from_html(`<svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper>`, 1), Minimap[FILENAME], [[74, 0]]);
function Minimap($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Minimap);
  let position = prop($$props, "position", 3, "bottom-right"), nodeStrokeColor = prop($$props, "nodeStrokeColor", 3, "transparent"), nodeClass = prop($$props, "nodeClass", 3, ""), nodeBorderRadius = prop($$props, "nodeBorderRadius", 3, 5), nodeStrokeWidth = prop($$props, "nodeStrokeWidth", 3, 2), width = prop($$props, "width", 3, 200), height = prop($$props, "height", 3, 150), pannable = prop($$props, "pannable", 3, true), zoomable = prop($$props, "zoomable", 3, true), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "position",
      "ariaLabel",
      "nodeStrokeColor",
      "nodeColor",
      "nodeClass",
      "nodeBorderRadius",
      "nodeStrokeWidth",
      "nodeComponent",
      "bgColor",
      "maskColor",
      "maskStrokeColor",
      "maskStrokeWidth",
      "width",
      "height",
      "pannable",
      "zoomable",
      "inversePan",
      "zoomStep",
      "class"
    ],
    "rest"
  );
  let store = tag(user_derived(useStore), "store");
  let ariaLabelConfig = tag(user_derived(() => get(store).ariaLabelConfig), "ariaLabelConfig");
  const shapeRendering = (
    // @ts-expect-error - TS doesn't know about chrome
    strict_equals(typeof window, "undefined") || !!window.chrome ? "crispEdges" : "geometricPrecision"
  );
  let labelledBy = tag(user_derived(() => `svelte-flow__minimap-desc-${get(store).flowId}`), "labelledBy");
  let viewBB = tag(
    user_derived(() => ({
      x: -get(store).viewport.x / get(store).viewport.zoom,
      y: -get(store).viewport.y / get(store).viewport.zoom,
      width: get(store).width / get(store).viewport.zoom,
      height: get(store).height / get(store).viewport.zoom
    })),
    "viewBB"
  );
  let boundingRect = tag(user_derived(() => getBoundsOfRects(getInternalNodesBounds(get(store).nodeLookup, { filter: (n) => !n.hidden }), get(viewBB))), "boundingRect");
  let scaledWidth = tag(user_derived(() => get(boundingRect).width / width()), "scaledWidth");
  let scaledHeight = tag(user_derived(() => get(boundingRect).height / height()), "scaledHeight");
  let viewScale = tag(user_derived(() => Math.max(get(scaledWidth), get(scaledHeight))), "viewScale");
  let viewWidth = tag(user_derived(() => get(viewScale) * width()), "viewWidth");
  let viewHeight = tag(user_derived(() => get(viewScale) * height()), "viewHeight");
  let offset = tag(user_derived(() => 5 * get(viewScale)), "offset");
  let x = tag(user_derived(() => get(boundingRect).x - (get(viewWidth) - get(boundingRect).width) / 2 - get(offset)), "x");
  let y2 = tag(user_derived(() => get(boundingRect).y - (get(viewHeight) - get(boundingRect).height) / 2 - get(offset)), "y");
  let viewboxWidth = tag(user_derived(() => get(viewWidth) + get(offset) * 2), "viewboxWidth");
  let viewboxHeight = tag(user_derived(() => get(viewHeight) + get(offset) * 2), "viewboxHeight");
  const getViewScale = () => get(viewScale);
  var $$exports = { ...legacy_api() };
  var fragment = root27();
  var node_1 = first_child(fragment);
  {
    let $0 = user_derived(() => ["svelte-flow__minimap", $$props.class]);
    css_props(node_1, () => ({ "--xy-minimap-background-color-props": $$props.bgColor }));
    Panel(node_1.lastChild, spread_props(
      {
        get position() {
          return position();
        },
        get class() {
          return get($0);
        },
        "data-testid": "svelte-flow__minimap"
      },
      () => rest,
      {
        children: wrap_snippet(Minimap, ($$anchor2, $$slotProps) => {
          var fragment_1 = comment();
          var node_2 = first_child(fragment_1);
          {
            var consequent_2 = ($$anchor3) => {
              var svg = root_24();
              let styles;
              var node_3 = child(svg);
              {
                var consequent = ($$anchor4) => {
                  var title = root_34();
                  var text2 = child(title, true);
                  reset(title);
                  template_effect(() => {
                    set_attribute2(title, "id", get(labelledBy));
                    set_text(text2, $$props.ariaLabel ?? get(ariaLabelConfig)["minimap.ariaLabel"]);
                  });
                  append($$anchor4, title);
                };
                add_svelte_meta(
                  () => if_block(node_3, ($$render) => {
                    if ($$props.ariaLabel ?? get(ariaLabelConfig)["minimap.ariaLabel"]) $$render(consequent);
                  }),
                  "if",
                  Minimap,
                  107,
                  6
                );
              }
              var node_4 = sibling(node_3);
              add_svelte_meta(
                () => each(node_4, 17, () => get(store).nodes, (userNode) => userNode.id, ($$anchor4, userNode) => {
                  const node = tag(user_derived(() => get(store).nodeLookup.get(get(userNode).id)), "node");
                  get(node);
                  var fragment_2 = comment();
                  var node_5 = first_child(fragment_2);
                  {
                    var consequent_1 = ($$anchor5) => {
                      {
                        let $02 = user_derived(() => strict_equals($$props.nodeColor, void 0) ? void 0 : getAttrFunction($$props.nodeColor)(get(userNode)));
                        let $1 = user_derived(() => getAttrFunction(nodeStrokeColor())(get(userNode)));
                        let $2 = user_derived(() => getAttrFunction(nodeClass())(get(userNode)));
                        add_svelte_meta(
                          () => MinimapNode($$anchor5, {
                            get id() {
                              return get(node).id;
                            },
                            get selected() {
                              return get(node).selected;
                            },
                            get nodeComponent() {
                              return $$props.nodeComponent;
                            },
                            get color() {
                              return get($02);
                            },
                            get borderRadius() {
                              return nodeBorderRadius();
                            },
                            get strokeColor() {
                              return get($1);
                            },
                            get strokeWidth() {
                              return nodeStrokeWidth();
                            },
                            get shapeRendering() {
                              return shapeRendering;
                            },
                            get class() {
                              return get($2);
                            }
                          }),
                          "component",
                          Minimap,
                          114,
                          10,
                          { componentTag: "MinimapNode" }
                        );
                      }
                    };
                    var d = user_derived(() => get(node) && nodeHasDimensions(get(node)) && !get(node).hidden);
                    add_svelte_meta(
                      () => if_block(node_5, ($$render) => {
                        if (get(d)) $$render(consequent_1);
                      }),
                      "if",
                      Minimap,
                      113,
                      8
                    );
                  }
                  append($$anchor4, fragment_2);
                }),
                "each",
                Minimap,
                111,
                6
              );
              var path = sibling(node_4);
              reset(svg);
              action(svg, ($$node, $$action_arg) => interactive?.($$node, $$action_arg), () => ({
                store: get(store),
                panZoom: get(store).panZoom,
                getViewScale,
                translateExtent: get(store).translateExtent,
                width: get(store).width,
                height: get(store).height,
                inversePan: $$props.inversePan,
                zoomStep: $$props.zoomStep,
                pannable: pannable(),
                zoomable: zoomable()
              }));
              template_effect(() => {
                set_attribute2(svg, "width", width());
                set_attribute2(svg, "height", height());
                set_attribute2(svg, "viewBox", `${get(x) ?? ""} ${get(y2) ?? ""} ${get(viewboxWidth) ?? ""} ${get(viewboxHeight) ?? ""}`);
                set_attribute2(svg, "aria-labelledby", get(labelledBy));
                styles = set_style(svg, "", styles, {
                  "--xy-minimap-mask-background-color-props": $$props.maskColor,
                  "--xy-minimap-mask-stroke-color-props": $$props.maskStrokeColor,
                  "--xy-minimap-mask-stroke-width-props": $$props.maskStrokeWidth ? $$props.maskStrokeWidth * get(viewScale) : void 0
                });
                set_attribute2(path, "d", `M${get(x) - get(offset)},${get(y2) - get(offset)}h${get(viewboxWidth) + get(offset) * 2}v${get(viewboxHeight) + get(offset) * 2}h${-get(viewboxWidth) - get(offset) * 2}z
      M${get(viewBB).x ?? ""},${get(viewBB).y ?? ""}h${get(viewBB).width ?? ""}v${get(viewBB).height ?? ""}h${-get(viewBB).width}z`);
              });
              append($$anchor3, svg);
            };
            add_svelte_meta(
              () => if_block(node_2, ($$render) => {
                if (get(store).panZoom) $$render(consequent_2);
              }),
              "if",
              Minimap,
              81,
              2
            );
          }
          append($$anchor2, fragment_1);
        }),
        $$slots: { default: true }
      }
    ));
    reset(node_1);
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/NodeResizer/ResizeControl.svelte
ResizeControl[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/NodeResizer/ResizeControl.svelte";
var root28 = add_locations(from_html(`<div><!></div>`), ResizeControl[FILENAME], [[129, 0]]);
function ResizeControl($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, ResizeControl);
  let variant = prop($$props, "variant", 19, () => ResizeControlVariant.Handle), minWidth = prop($$props, "minWidth", 3, 10), minHeight = prop($$props, "minHeight", 3, 10), maxWidth = prop($$props, "maxWidth", 19, () => Number.MAX_VALUE), maxHeight = prop($$props, "maxHeight", 19, () => Number.MAX_VALUE), keepAspectRatio = prop($$props, "keepAspectRatio", 3, false), autoScale = prop($$props, "autoScale", 3, true), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "nodeId",
      "position",
      "variant",
      "color",
      "minWidth",
      "minHeight",
      "maxWidth",
      "maxHeight",
      "keepAspectRatio",
      "resizeDirection",
      "autoScale",
      "shouldResize",
      "onResizeStart",
      "onResize",
      "onResizeEnd",
      "class",
      "children"
    ],
    "rest"
  );
  const store = useStore();
  const contextNodeId = getNodeIdContext();
  let id2 = tag(user_derived(() => strict_equals(typeof $$props.nodeId, "string") ? $$props.nodeId : contextNodeId), "id");
  if (!get(id2)) {
    throw new Error("Either pass a nodeId or use within a Custom Node component");
  }
  let resizeControlRef;
  let resizer = tag(state(null), "resizer");
  let isLineVariant = tag(user_derived(() => strict_equals(variant(), ResizeControlVariant.Line)), "isLineVariant");
  let controlPosition = tag(
    user_derived(() => {
      let defaultPosition = get(isLineVariant) ? "right" : "bottom-right";
      return $$props.position ?? defaultPosition;
    }),
    "controlPosition"
  );
  let positionClasses = tag(user_derived(() => get(controlPosition).split("-")), "positionClasses");
  onMount(() => {
    if (resizeControlRef) {
      set(
        resizer,
        XYResizer({
          domNode: resizeControlRef,
          nodeId: get(id2),
          getStoreItems: () => {
            return {
              nodeLookup: store.nodeLookup,
              transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
              snapGrid: store.snapGrid ?? void 0,
              snapToGrid: !!store.snapGrid,
              nodeOrigin: store.nodeOrigin,
              paneDomNode: store.domNode
            };
          },
          onChange: (change, childChanges) => {
            const changes = /* @__PURE__ */ new Map();
            changes.set(get(id2), change);
            for (const childChange of childChanges) {
              changes.set(childChange.id, { x: childChange.position.x, y: childChange.position.y });
            }
            store.nodes = store.nodes.map((node) => {
              const change2 = changes.get(node.id);
              const horizontal = !$$props.resizeDirection || strict_equals($$props.resizeDirection, "horizontal");
              const vertical = !$$props.resizeDirection || strict_equals($$props.resizeDirection, "vertical");
              if (change2) {
                return {
                  ...node,
                  position: {
                    x: horizontal ? change2.x ?? node.position.x : node.position.x,
                    y: vertical ? change2.y ?? node.position.y : node.position.y
                  },
                  width: horizontal ? change2.width ?? node.width : node.width,
                  height: vertical ? change2.height ?? node.height : node.height
                };
              }
              return node;
            });
          }
        }),
        true
      );
    }
    return () => {
      get(resizer)?.destroy();
    };
  });
  user_pre_effect(() => {
    get(resizer)?.update({
      controlPosition: get(controlPosition),
      boundaries: {
        minWidth: minWidth(),
        minHeight: minHeight(),
        maxWidth: maxWidth(),
        maxHeight: maxHeight()
      },
      keepAspectRatio: !!keepAspectRatio(),
      resizeDirection: $$props.resizeDirection,
      onResizeStart: $$props.onResizeStart,
      onResize: $$props.onResize,
      onResizeEnd: $$props.onResizeEnd,
      shouldResize: $$props.shouldResize
    });
  });
  var $$exports = { ...legacy_api() };
  var div = root28();
  attribute_effect(div, ($0, $1) => ({ class: $0, ...rest, [STYLE]: $1 }), [
    () => [
      "svelte-flow__resize-control",
      store.noDragClass,
      ...get(positionClasses),
      variant(),
      $$props.class
    ],
    () => ({
      "border-color": get(isLineVariant) ? $$props.color : void 0,
      "background-color": get(isLineVariant) ? void 0 : $$props.color,
      scale: get(isLineVariant) || !autoScale() ? void 0 : Math.max(1 / store.viewport.zoom, 1)
    })
  ]);
  var node_1 = child(div);
  add_svelte_meta(() => snippet(node_1, () => $$props.children ?? noop), "render", ResizeControl, 137, 2);
  reset(div);
  bind_this(div, ($$value) => resizeControlRef = $$value, () => resizeControlRef);
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/lib/plugins/NodeResizer/NodeResizer.svelte
NodeResizer[FILENAME] = "node_modules/@xyflow/svelte/dist/lib/plugins/NodeResizer/NodeResizer.svelte";
var root_111 = add_locations(from_html(`<!> <!>`, 1), NodeResizer[FILENAME], []);
function NodeResizer($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, NodeResizer);
  let isVisible = prop($$props, "isVisible", 3, true), autoScale = prop($$props, "autoScale", 3, true), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "isVisible",
      "nodeId",
      "handleClass",
      "handleStyle",
      "lineClass",
      "lineStyle",
      "autoScale"
    ],
    "rest"
  );
  var $$exports = { ...legacy_api() };
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root_111();
      var node_1 = first_child(fragment_1);
      add_svelte_meta(
        () => each(node_1, 16, () => XY_RESIZER_LINE_POSITIONS, (position) => position, ($$anchor3, position) => {
          add_svelte_meta(
            () => ResizeControl($$anchor3, spread_props(
              {
                get class() {
                  return $$props.lineClass;
                },
                get style() {
                  return $$props.lineStyle;
                },
                get nodeId() {
                  return $$props.nodeId;
                },
                get position() {
                  return position;
                },
                get autoScale() {
                  return autoScale();
                },
                get variant() {
                  return ResizeControlVariant.Line;
                }
              },
              () => rest
            )),
            "component",
            NodeResizer,
            24,
            4,
            { componentTag: "ResizeControl" }
          );
        }),
        "each",
        NodeResizer,
        23,
        2
      );
      var node_2 = sibling(node_1, 2);
      add_svelte_meta(
        () => each(node_2, 16, () => XY_RESIZER_HANDLE_POSITIONS, (position) => position, ($$anchor3, position) => {
          add_svelte_meta(
            () => ResizeControl($$anchor3, spread_props(
              {
                get class() {
                  return $$props.handleClass;
                },
                get style() {
                  return $$props.handleStyle;
                },
                get nodeId() {
                  return $$props.nodeId;
                },
                get position() {
                  return position;
                },
                get autoScale() {
                  return autoScale();
                }
              },
              () => rest
            )),
            "component",
            NodeResizer,
            35,
            4,
            { componentTag: "ResizeControl" }
          );
        }),
        "each",
        NodeResizer,
        34,
        2
      );
      append($$anchor2, fragment_1);
    };
    add_svelte_meta(
      () => if_block(node, ($$render) => {
        if (isVisible()) $$render(consequent);
      }),
      "if",
      NodeResizer,
      22,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// svelte/StepNode.svelte
StepNode[FILENAME] = "svelte/StepNode.svelte";
var root_112 = add_locations(from_html(`<div class="step-status svelte-8qw7bu"> </div>`), StepNode[FILENAME], [[31, 4]]);
var root_35 = add_locations(from_html(`<div class="step-summary svelte-8qw7bu"> </div>`), StepNode[FILENAME], [[37, 6]]);
var root_42 = add_locations(from_html(`<div class="step-detail svelte-8qw7bu"><span class="step-key svelte-8qw7bu">module</span> </div>`), StepNode[FILENAME], [[41, 4, [[41, 29]]]]);
var root_5 = add_locations(from_html(`<div class="step-detail svelte-8qw7bu"><span class="step-key svelte-8qw7bu">duration</span> </div>`), StepNode[FILENAME], [[44, 4, [[44, 29]]]]);
var root_6 = add_locations(from_html(`<div class="step-detail svelte-8qw7bu"><span class="step-key svelte-8qw7bu">exit</span> </div>`), StepNode[FILENAME], [[47, 4, [[47, 29]]]]);
var root_7 = add_locations(from_html(`<div class="step-error svelte-8qw7bu"> </div>`), StepNode[FILENAME], [[50, 4]]);
var root29 = add_locations(from_html(`<!> <div class="step-node svelte-8qw7bu"><div class="step-label svelte-8qw7bu"> </div> <!> <!> <!> <!> <!> <!></div> <!>`, 1), StepNode[FILENAME], [[28, 0, [[29, 2]]]]);
var $$css6 = {
  hash: "svelte-8qw7bu",
  code: "\n  .step-node.svelte-8qw7bu {\n    background: #ffffff;\n    border: 1px solid rgba(0,0,0,0.08);\n    border-left-width: 4px;\n    border-radius: 10px;\n    padding: 10px 14px;\n    min-width: 160px;\n    font-family: system-ui, -apple-system, sans-serif;\n    color: #1a1a2e;\n    box-shadow:\n      0 1px 3px rgba(0,0,0,0.06),\n      0 4px 12px rgba(0,0,0,0.04);\n    transition: box-shadow 0.15s ease, transform 0.15s ease;\n  }\n  .step-node.svelte-8qw7bu:hover {\n    box-shadow:\n      0 2px 6px rgba(0,0,0,0.08),\n      0 8px 24px rgba(0,0,0,0.06);\n  }\n  .svelte-flow.dark .step-node.svelte-8qw7bu {\n    background: rgba(30, 30, 48, 0.85);\n    backdrop-filter: blur(8px);\n    border-color: rgba(255,255,255,0.08);\n    color: #e4e4ed;\n    box-shadow:\n      0 1px 3px rgba(0,0,0,0.2),\n      0 4px 12px rgba(0,0,0,0.15);\n  }\n  .svelte-flow.dark .step-node.svelte-8qw7bu:hover {\n    box-shadow:\n      0 2px 6px rgba(0,0,0,0.3),\n      0 8px 24px rgba(0,0,0,0.2);\n  }\n  .svelte-flow__node.selected .step-node.svelte-8qw7bu {\n    border-color: #3b82f6;\n    box-shadow:\n      0 0 0 2px rgba(59, 130, 246, 0.25),\n      0 4px 16px rgba(59, 130, 246, 0.1);\n  }\n  .svelte-flow.dark .svelte-flow__node.selected .step-node.svelte-8qw7bu {\n    border-color: #60a5fa;\n    box-shadow:\n      0 0 0 2px rgba(96, 165, 250, 0.25),\n      0 4px 16px rgba(96, 165, 250, 0.15);\n  }\n  .step-label.svelte-8qw7bu {\n    font-weight: 600;\n    font-size: 13px;\n    margin-bottom: 5px;\n    letter-spacing: -0.01em;\n  }\n  .step-status.svelte-8qw7bu {\n    display: inline-block;\n    font-size: 10px;\n    font-weight: 600;\n    text-transform: uppercase;\n    letter-spacing: 0.05em;\n    padding: 2px 8px;\n    border-radius: 4px;\n    margin-bottom: 5px;\n  }\n  .step-summary.svelte-8qw7bu {\n    font-size: 11px;\n    color: #5a5a72;\n    margin-top: 3px;\n    max-width: 200px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    line-height: 1.4;\n  }\n  .svelte-flow.dark .step-summary.svelte-8qw7bu {\n    color: #a8a8be;\n  }\n  .step-detail.svelte-8qw7bu {\n    font-size: 11px;\n    color: #7a7a90;\n    margin-top: 3px;\n    line-height: 1.4;\n  }\n  .svelte-flow.dark .step-detail.svelte-8qw7bu {\n    color: #8a8aa0;\n  }\n  .step-key.svelte-8qw7bu {\n    color: #9898ac;\n    font-size: 10px;\n    font-weight: 500;\n  }\n  .svelte-flow.dark .step-key.svelte-8qw7bu {\n    color: #6a6a80;\n  }\n  .step-error.svelte-8qw7bu {\n    font-size: 11px;\n    color: #dc2626;\n    margin-top: 5px;\n    max-width: 200px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    padding: 3px 6px;\n    background: rgba(220, 38, 38, 0.06);\n    border-radius: 4px;\n  }\n  .svelte-flow.dark .step-error.svelte-8qw7bu {\n    color: #f87171;\n    background: rgba(248, 113, 113, 0.08);\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RlcE5vZGUuc3ZlbHRlIiwic291cmNlcyI6WyJTdGVwTm9kZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IHsgSGFuZGxlLCBQb3NpdGlvbiB9IGZyb20gJ0B4eWZsb3cvc3ZlbHRlJztcbiAgaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5cbiAgbGV0IHsgZGF0YSwgaXNDb25uZWN0YWJsZSB9ID0gJHByb3BzKCk7XG5cbiAgY29uc3QgZGlyZWN0aW9uID0gZ2V0Q29udGV4dCgnZGFnRGlyZWN0aW9uJykgfHwgJ0xSJztcbiAgY29uc3Qgc291cmNlUG9zID0gZGlyZWN0aW9uID09PSAnVEInID8gUG9zaXRpb24uQm90dG9tIDogUG9zaXRpb24uUmlnaHQ7XG4gIGNvbnN0IHRhcmdldFBvcyA9IGRpcmVjdGlvbiA9PT0gJ1RCJyA/IFBvc2l0aW9uLlRvcCA6IFBvc2l0aW9uLkxlZnQ7XG5cbiAgY29uc3Qgc3RhdHVzQ29sb3JzID0ge1xuICAgIG9rOiB7IGJnOiAnIzE2YTM0YScsIHRleHQ6ICcjZmZmJyB9LFxuICAgIGNvbXBsZXRlZDogeyBiZzogJyMxNmEzNGEnLCB0ZXh0OiAnI2ZmZicgfSxcbiAgICBlcnJvcjogeyBiZzogJyNkYzI2MjYnLCB0ZXh0OiAnI2ZmZicgfSxcbiAgICBmYWlsZWQ6IHsgYmc6ICcjZGMyNjI2JywgdGV4dDogJyNmZmYnIH0sXG4gICAgcnVubmluZzogeyBiZzogJyMyNTYzZWInLCB0ZXh0OiAnI2ZmZicgfSxcbiAgICBza2lwcGVkOiB7IGJnOiAnI2NhOGEwNCcsIHRleHQ6ICcjZmZmJyB9LFxuICAgIHBlbmRpbmc6IHsgYmc6ICcjNmI3MjgwJywgdGV4dDogJyNmZmYnIH0sXG4gIH07XG5cbiAgZnVuY3Rpb24gY29sb3JzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXNDb2xvcnNbc3RhdHVzXSB8fCBzdGF0dXNDb2xvcnMucGVuZGluZztcbiAgfVxuPC9zY3JpcHQ+XG5cbjxIYW5kbGUgdHlwZT1cInRhcmdldFwiIHBvc2l0aW9uPXt0YXJnZXRQb3N9IGlzQ29ubmVjdGFibGU9e2lzQ29ubmVjdGFibGV9IC8+XG5cbjxkaXYgY2xhc3M9XCJzdGVwLW5vZGVcIiBzdHlsZTpib3JkZXItbGVmdC1jb2xvcj17ZGF0YS5zdGF0dXMgPyBjb2xvcnMoZGF0YS5zdGF0dXMpLmJnIDogJyM2YjcyODAnfT5cbiAgPGRpdiBjbGFzcz1cInN0ZXAtbGFiZWxcIj57ZGF0YS5sYWJlbH08L2Rpdj5cbiAgeyNpZiBkYXRhLnN0YXR1c31cbiAgICA8ZGl2IGNsYXNzPVwic3RlcC1zdGF0dXNcIiBzdHlsZTpiYWNrZ3JvdW5kLWNvbG9yPXtjb2xvcnMoZGF0YS5zdGF0dXMpLmJnfSBzdHlsZTpjb2xvcj17Y29sb3JzKGRhdGEuc3RhdHVzKS50ZXh0fT5cbiAgICAgIHtkYXRhLnN0YXR1c31cbiAgICA8L2Rpdj5cbiAgey9pZn1cbiAgeyNpZiBkYXRhLnN1bW1hcnk/Lmxlbmd0aH1cbiAgICB7I2VhY2ggZGF0YS5zdW1tYXJ5IGFzIGxpbmV9XG4gICAgICA8ZGl2IGNsYXNzPVwic3RlcC1zdW1tYXJ5XCI+e2xpbmV9PC9kaXY+XG4gICAgey9lYWNofVxuICB7L2lmfVxuICB7I2lmIGRhdGEubW9kdWxlfVxuICAgIDxkaXYgY2xhc3M9XCJzdGVwLWRldGFpbFwiPjxzcGFuIGNsYXNzPVwic3RlcC1rZXlcIj5tb2R1bGU8L3NwYW4+IHtkYXRhLm1vZHVsZX08L2Rpdj5cbiAgey9pZn1cbiAgeyNpZiBkYXRhLmR1cmF0aW9uX21zICE9IG51bGx9XG4gICAgPGRpdiBjbGFzcz1cInN0ZXAtZGV0YWlsXCI+PHNwYW4gY2xhc3M9XCJzdGVwLWtleVwiPmR1cmF0aW9uPC9zcGFuPiB7ZGF0YS5kdXJhdGlvbl9tc31tczwvZGl2PlxuICB7L2lmfVxuICB7I2lmIGRhdGEuZXhpdF9jb2RlICE9IG51bGx9XG4gICAgPGRpdiBjbGFzcz1cInN0ZXAtZGV0YWlsXCI+PHNwYW4gY2xhc3M9XCJzdGVwLWtleVwiPmV4aXQ8L3NwYW4+IHtkYXRhLmV4aXRfY29kZX08L2Rpdj5cbiAgey9pZn1cbiAgeyNpZiBkYXRhLmVycm9yfVxuICAgIDxkaXYgY2xhc3M9XCJzdGVwLWVycm9yXCI+e2RhdGEuZXJyb3J9PC9kaXY+XG4gIHsvaWZ9XG48L2Rpdj5cblxuPEhhbmRsZSB0eXBlPVwic291cmNlXCIgcG9zaXRpb249e3NvdXJjZVBvc30gaXNDb25uZWN0YWJsZT17aXNDb25uZWN0YWJsZX0gLz5cblxuPHN0eWxlPlxuICAuc3RlcC1ub2RlIHtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4wOCk7XG4gICAgYm9yZGVyLWxlZnQtd2lkdGg6IDRweDtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICBtaW4td2lkdGg6IDE2MHB4O1xuICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWY7XG4gICAgY29sb3I6ICMxYTFhMmU7XG4gICAgYm94LXNoYWRvdzpcbiAgICAgIDAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMDYpLFxuICAgICAgMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMDQpO1xuICAgIHRyYW5zaXRpb246IGJveC1zaGFkb3cgMC4xNXMgZWFzZSwgdHJhbnNmb3JtIDAuMTVzIGVhc2U7XG4gIH1cbiAgLnN0ZXAtbm9kZTpob3ZlciB7XG4gICAgYm94LXNoYWRvdzpcbiAgICAgIDAgMnB4IDZweCByZ2JhKDAsMCwwLDAuMDgpLFxuICAgICAgMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuMDYpO1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5zdGVwLW5vZGUge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMzAsIDMwLCA0OCwgMC44NSk7XG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDhweCk7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuMDgpO1xuICAgIGNvbG9yOiAjZTRlNGVkO1xuICAgIGJveC1zaGFkb3c6XG4gICAgICAwIDFweCAzcHggcmdiYSgwLDAsMCwwLjIpLFxuICAgICAgMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMTUpO1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5zdGVwLW5vZGU6aG92ZXIge1xuICAgIGJveC1zaGFkb3c6XG4gICAgICAwIDJweCA2cHggcmdiYSgwLDAsMCwwLjMpLFxuICAgICAgMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuMik7XG4gIH1cbiAgOmdsb2JhbCguc3ZlbHRlLWZsb3dfX25vZGUuc2VsZWN0ZWQpIC5zdGVwLW5vZGUge1xuICAgIGJvcmRlci1jb2xvcjogIzNiODJmNjtcbiAgICBib3gtc2hhZG93OlxuICAgICAgMCAwIDAgMnB4IHJnYmEoNTksIDEzMCwgMjQ2LCAwLjI1KSxcbiAgICAgIDAgNHB4IDE2cHggcmdiYSg1OSwgMTMwLCAyNDYsIDAuMSk7XG4gIH1cbiAgOmdsb2JhbCguc3ZlbHRlLWZsb3cuZGFyayAuc3ZlbHRlLWZsb3dfX25vZGUuc2VsZWN0ZWQpIC5zdGVwLW5vZGUge1xuICAgIGJvcmRlci1jb2xvcjogIzYwYTVmYTtcbiAgICBib3gtc2hhZG93OlxuICAgICAgMCAwIDAgMnB4IHJnYmEoOTYsIDE2NSwgMjUwLCAwLjI1KSxcbiAgICAgIDAgNHB4IDE2cHggcmdiYSg5NiwgMTY1LCAyNTAsIDAuMTUpO1xuICB9XG4gIC5zdGVwLWxhYmVsIHtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAxZW07XG4gIH1cbiAgLnN0ZXAtc3RhdHVzIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xuICAgIHBhZGRpbmc6IDJweCA4cHg7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgfVxuICAuc3RlcC1zdW1tYXJ5IHtcbiAgICBmb250LXNpemU6IDExcHg7XG4gICAgY29sb3I6ICM1YTVhNzI7XG4gICAgbWFyZ2luLXRvcDogM3B4O1xuICAgIG1heC13aWR0aDogMjAwcHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIH1cbiAgOmdsb2JhbCguc3ZlbHRlLWZsb3cuZGFyaykgLnN0ZXAtc3VtbWFyeSB7XG4gICAgY29sb3I6ICNhOGE4YmU7XG4gIH1cbiAgLnN0ZXAtZGV0YWlsIHtcbiAgICBmb250LXNpemU6IDExcHg7XG4gICAgY29sb3I6ICM3YTdhOTA7XG4gICAgbWFyZ2luLXRvcDogM3B4O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIH1cbiAgOmdsb2JhbCguc3ZlbHRlLWZsb3cuZGFyaykgLnN0ZXAtZGV0YWlsIHtcbiAgICBjb2xvcjogIzhhOGFhMDtcbiAgfVxuICAuc3RlcC1rZXkge1xuICAgIGNvbG9yOiAjOTg5OGFjO1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5zdGVwLWtleSB7XG4gICAgY29sb3I6ICM2YTZhODA7XG4gIH1cbiAgLnN0ZXAtZXJyb3Ige1xuICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICBjb2xvcjogI2RjMjYyNjtcbiAgICBtYXJnaW4tdG9wOiA1cHg7XG4gICAgbWF4LXdpZHRoOiAyMDBweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgcGFkZGluZzogM3B4IDZweDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDIyMCwgMzgsIDM4LCAwLjA2KTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIH1cbiAgOmdsb2JhbCguc3ZlbHRlLWZsb3cuZGFyaykgLnN0ZXAtZXJyb3Ige1xuICAgIGNvbG9yOiAjZjg3MTcxO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjQ4LCAxMTMsIDExMywgMC4wOCk7XG4gIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQXdEQSxFQUFFLHdCQUFVLENBQUM7QUFDYixJQUFJLG1CQUFtQjtBQUN2QixJQUFJLGtDQUFrQztBQUN0QyxJQUFJLHNCQUFzQjtBQUMxQixJQUFJLG1CQUFtQjtBQUN2QixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLGlEQUFpRDtBQUNyRCxJQUFJLGNBQWM7QUFDbEIsSUFBSTtBQUNKO0FBQ0EsaUNBQWlDO0FBQ2pDLElBQUksdURBQXVEO0FBQzNEO0FBQ0EsRUFBRSx3QkFBVSxNQUFNLENBQUM7QUFDbkIsSUFBSTtBQUNKO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQyx3QkFBVSxDQUFDO0FBQ3hDLElBQUksa0NBQWtDO0FBQ3RDLElBQUksMEJBQTBCO0FBQzlCLElBQUksb0NBQW9DO0FBQ3hDLElBQUksY0FBYztBQUNsQixJQUFJO0FBQ0o7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSxFQUFVLGlCQUFrQixDQUFDLHdCQUFVLE1BQU0sQ0FBQztBQUM5QyxJQUFJO0FBQ0o7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQSxFQUFVLDJCQUE0QixDQUFDLHdCQUFVLENBQUM7QUFDbEQsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0EsRUFBVSw2Q0FBOEMsQ0FBQyx3QkFBVSxDQUFDO0FBQ3BFLElBQUkscUJBQXFCO0FBQ3pCLElBQUk7QUFDSjtBQUNBLHlDQUF5QztBQUN6QztBQUNBLEVBQUUseUJBQVcsQ0FBQztBQUNkLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksZUFBZTtBQUNuQixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLHVCQUF1QjtBQUMzQjtBQUNBLEVBQUUsMEJBQVksQ0FBQztBQUNmLElBQUkscUJBQXFCO0FBQ3pCLElBQUksZUFBZTtBQUNuQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLHlCQUF5QjtBQUM3QixJQUFJLHNCQUFzQjtBQUMxQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLGtCQUFrQjtBQUN0QjtBQUNBLEVBQUUsMkJBQWEsQ0FBQztBQUNoQixJQUFJLGVBQWU7QUFDbkIsSUFBSSxjQUFjO0FBQ2xCLElBQUksZUFBZTtBQUNuQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLHVCQUF1QjtBQUMzQixJQUFJLG1CQUFtQjtBQUN2QixJQUFJLGdCQUFnQjtBQUNwQjtBQUNBLEVBQVUsaUJBQWtCLENBQUMsMkJBQWEsQ0FBQztBQUMzQyxJQUFJLGNBQWM7QUFDbEI7QUFDQSxFQUFFLDBCQUFZLENBQUM7QUFDZixJQUFJLGVBQWU7QUFDbkIsSUFBSSxjQUFjO0FBQ2xCLElBQUksZUFBZTtBQUNuQixJQUFJLGdCQUFnQjtBQUNwQjtBQUNBLEVBQVUsaUJBQWtCLENBQUMsMEJBQVksQ0FBQztBQUMxQyxJQUFJLGNBQWM7QUFDbEI7QUFDQSxFQUFFLHVCQUFTLENBQUM7QUFDWixJQUFJLGNBQWM7QUFDbEIsSUFBSSxlQUFlO0FBQ25CLElBQUksZ0JBQWdCO0FBQ3BCO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQyx1QkFBUyxDQUFDO0FBQ3ZDLElBQUksY0FBYztBQUNsQjtBQUNBLEVBQUUseUJBQVcsQ0FBQztBQUNkLElBQUksZUFBZTtBQUNuQixJQUFJLGNBQWM7QUFDbEIsSUFBSSxlQUFlO0FBQ25CLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksdUJBQXVCO0FBQzNCLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksbUNBQW1DO0FBQ3ZDLElBQUksa0JBQWtCO0FBQ3RCO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQyx5QkFBVyxDQUFDO0FBQ3pDLElBQUksY0FBYztBQUNsQixJQUFJLHFDQUFxQztBQUN6QzsifQ== */"
};
function StepNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, StepNode);
  append_styles($$anchor, $$css6);
  const direction = getContext("dagDirection") || "LR";
  const sourcePos = strict_equals(direction, "TB") ? Position.Bottom : Position.Right;
  const targetPos = strict_equals(direction, "TB") ? Position.Top : Position.Left;
  const statusColors = {
    ok: { bg: "#16a34a", text: "#fff" },
    completed: { bg: "#16a34a", text: "#fff" },
    error: { bg: "#dc2626", text: "#fff" },
    failed: { bg: "#dc2626", text: "#fff" },
    running: { bg: "#2563eb", text: "#fff" },
    skipped: { bg: "#ca8a04", text: "#fff" },
    pending: { bg: "#6b7280", text: "#fff" }
  };
  function colors(status) {
    return statusColors[status] || statusColors.pending;
  }
  var $$exports = { ...legacy_api() };
  var fragment = root29();
  var node = first_child(fragment);
  add_svelte_meta(
    () => Handle(node, {
      type: "target",
      get position() {
        return targetPos;
      },
      get isConnectable() {
        return $$props.isConnectable;
      }
    }),
    "component",
    StepNode,
    26,
    0,
    { componentTag: "Handle" }
  );
  var div = sibling(node, 2);
  let styles;
  var div_1 = child(div);
  var text2 = child(div_1, true);
  reset(div_1);
  var node_1 = sibling(div_1, 2);
  {
    var consequent = ($$anchor2) => {
      var div_2 = root_112();
      let styles_1;
      var text_1 = child(div_2, true);
      reset(div_2);
      template_effect(
        ($0) => {
          styles_1 = set_style(div_2, "", styles_1, $0);
          set_text(text_1, $$props.data.status);
        },
        [
          () => ({
            "background-color": colors($$props.data.status).bg,
            color: colors($$props.data.status).text
          })
        ]
      );
      append($$anchor2, div_2);
    };
    add_svelte_meta(
      () => if_block(node_1, ($$render) => {
        if ($$props.data.status) $$render(consequent);
      }),
      "if",
      StepNode,
      30,
      2
    );
  }
  var node_2 = sibling(node_1, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_1 = comment();
      var node_3 = first_child(fragment_1);
      add_svelte_meta(
        () => each(node_3, 17, () => $$props.data.summary, index, ($$anchor3, line) => {
          var div_3 = root_35();
          var text_2 = child(div_3, true);
          reset(div_3);
          template_effect(() => set_text(text_2, get(line)));
          append($$anchor3, div_3);
        }),
        "each",
        StepNode,
        36,
        4
      );
      append($$anchor2, fragment_1);
    };
    add_svelte_meta(
      () => if_block(node_2, ($$render) => {
        if ($$props.data.summary?.length) $$render(consequent_1);
      }),
      "if",
      StepNode,
      35,
      2
    );
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_4 = root_42();
      var text_3 = sibling(child(div_4));
      reset(div_4);
      template_effect(() => set_text(text_3, ` ${$$props.data.module ?? ""}`));
      append($$anchor2, div_4);
    };
    add_svelte_meta(
      () => if_block(node_4, ($$render) => {
        if ($$props.data.module) $$render(consequent_2);
      }),
      "if",
      StepNode,
      40,
      2
    );
  }
  var node_5 = sibling(node_4, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_5 = root_5();
      var text_4 = sibling(child(div_5));
      reset(div_5);
      template_effect(() => set_text(text_4, ` ${$$props.data.duration_ms ?? ""}ms`));
      append($$anchor2, div_5);
    };
    add_svelte_meta(
      () => if_block(node_5, ($$render) => {
        if (equals2($$props.data.duration_ms, null, false)) $$render(consequent_3);
      }),
      "if",
      StepNode,
      43,
      2
    );
  }
  var node_6 = sibling(node_5, 2);
  {
    var consequent_4 = ($$anchor2) => {
      var div_6 = root_6();
      var text_5 = sibling(child(div_6));
      reset(div_6);
      template_effect(() => set_text(text_5, ` ${$$props.data.exit_code ?? ""}`));
      append($$anchor2, div_6);
    };
    add_svelte_meta(
      () => if_block(node_6, ($$render) => {
        if (equals2($$props.data.exit_code, null, false)) $$render(consequent_4);
      }),
      "if",
      StepNode,
      46,
      2
    );
  }
  var node_7 = sibling(node_6, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_7 = root_7();
      var text_6 = child(div_7, true);
      reset(div_7);
      template_effect(() => set_text(text_6, $$props.data.error));
      append($$anchor2, div_7);
    };
    add_svelte_meta(
      () => if_block(node_7, ($$render) => {
        if ($$props.data.error) $$render(consequent_5);
      }),
      "if",
      StepNode,
      49,
      2
    );
  }
  reset(div);
  var node_8 = sibling(div, 2);
  add_svelte_meta(
    () => Handle(node_8, {
      type: "source",
      get position() {
        return sourcePos;
      },
      get isConnectable() {
        return $$props.isConnectable;
      }
    }),
    "component",
    StepNode,
    54,
    0,
    { componentTag: "Handle" }
  );
  template_effect(
    ($0) => {
      styles = set_style(div, "", styles, $0);
      set_text(text2, $$props.data.label);
    },
    [
      () => ({
        "border-left-color": $$props.data.status ? colors($$props.data.status).bg : "#6b7280"
      })
    ]
  );
  append($$anchor, fragment);
  return pop($$exports);
}

// svelte/RunbookNode.svelte
RunbookNode[FILENAME] = "svelte/RunbookNode.svelte";
var root_113 = add_locations(from_html(`<span class="step-count svelte-190ptao"> </span>`), RunbookNode[FILENAME], [[68, 6]]);
var root_36 = add_locations(from_html(`<div class="runbook-summary svelte-190ptao"> </div>`), RunbookNode[FILENAME], [[74, 6]]);
var root_62 = add_locations(from_html(`<div class="subgraph-connector svelte-190ptao"><svg width="2" height="12" viewBox="0 0 2 12"><line x1="1" y1="0" x2="1" y2="12" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3"></line></svg></div>`), RunbookNode[FILENAME], [[86, 10, [[87, 12, [[88, 14]]]]]]);
var root_52 = add_locations(from_html(`<div class="subgraph-step svelte-190ptao"><div class="subgraph-step-name svelte-190ptao"> </div> <div class="subgraph-step-module svelte-190ptao"> </div></div> <!>`, 1), RunbookNode[FILENAME], [[81, 8, [[82, 10], [83, 10]]]]);
var root_43 = add_locations(from_html(`<div class="subgraph svelte-190ptao"></div>`), RunbookNode[FILENAME], [[79, 4]]);
var root_72 = add_locations(from_html(`<div class="subgraph-empty svelte-190ptao">No steps found</div>`), RunbookNode[FILENAME], [[95, 4]]);
var root_8 = add_locations(from_html(`<div class="runbook-summary svelte-190ptao"> </div>`), RunbookNode[FILENAME], [[99, 4]]);
var root30 = add_locations(from_html(`<!> <!> <div><div class="runbook-header svelte-190ptao"><button class="toggle-btn svelte-190ptao"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2 L8 6 L4 10"></path></svg></button> <div class="runbook-icon svelte-190ptao"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div> <span class="runbook-label svelte-190ptao"> </span> <!></div> <!> <!> <!></div> <!>`, 1), RunbookNode[FILENAME], [
  [
    42,
    0,
    [
      [
        43,
        2,
        [
          [44, 4, [[45, 6, [[56, 8]]]]],
          [59, 4, [[60, 6, [[61, 8], [62, 8], [63, 8]]]]],
          [66, 4]
        ]
      ]
    ]
  ]
]);
var $$css7 = {
  hash: "svelte-190ptao",
  code: "\n  .runbook-node.svelte-190ptao {\n    background: #ffffff;\n    border: 2px dashed rgba(99, 102, 241, 0.4);\n    border-left-width: 4px;\n    border-left-style: solid;\n    border-left-color: #6366f1;\n    border-radius: 10px;\n    padding: 10px 14px;\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    font-family: system-ui, -apple-system, sans-serif;\n    color: #1a1a2e;\n    box-shadow:\n      0 1px 3px rgba(0,0,0,0.06),\n      0 4px 12px rgba(0,0,0,0.04);\n    transition: box-shadow 0.15s ease, transform 0.15s ease;\n  }\n  .runbook-node.svelte-190ptao:hover {\n    box-shadow:\n      0 2px 6px rgba(0,0,0,0.08),\n      0 8px 24px rgba(0,0,0,0.06);\n  }\n  .svelte-flow.dark .runbook-node.svelte-190ptao {\n    background: rgba(30, 30, 48, 0.85);\n    backdrop-filter: blur(8px);\n    border-color: rgba(99, 102, 241, 0.3);\n    border-left-color: #818cf8;\n    color: #e4e4ed;\n    box-shadow:\n      0 1px 3px rgba(0,0,0,0.2),\n      0 4px 12px rgba(0,0,0,0.15);\n  }\n  .svelte-flow.dark .runbook-node.svelte-190ptao:hover {\n    box-shadow:\n      0 2px 6px rgba(0,0,0,0.3),\n      0 8px 24px rgba(0,0,0,0.2);\n  }\n  .svelte-flow__node.selected .runbook-node.svelte-190ptao {\n    border-color: #3b82f6;\n    box-shadow:\n      0 0 0 2px rgba(59, 130, 246, 0.25),\n      0 4px 16px rgba(59, 130, 246, 0.1);\n  }\n  .svelte-flow.dark .svelte-flow__node.selected .runbook-node.svelte-190ptao {\n    border-color: #60a5fa;\n    box-shadow:\n      0 0 0 2px rgba(96, 165, 250, 0.25),\n      0 4px 16px rgba(96, 165, 250, 0.15);\n  }\n\n  .runbook-header.svelte-190ptao {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n  }\n  .toggle-btn.svelte-190ptao {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 18px;\n    height: 18px;\n    border: none;\n    background: transparent;\n    cursor: pointer;\n    padding: 0;\n    color: #6b7280;\n    border-radius: 3px;\n    flex-shrink: 0;\n  }\n  .toggle-btn.svelte-190ptao:hover {\n    background: rgba(0,0,0,0.06);\n    color: #374151;\n  }\n  .svelte-flow.dark .toggle-btn.svelte-190ptao {\n    color: #9ca3af;\n  }\n  .svelte-flow.dark .toggle-btn.svelte-190ptao:hover {\n    background: rgba(255,255,255,0.08);\n    color: #d1d5db;\n  }\n  .chevron.svelte-190ptao {\n    transition: transform 0.15s ease;\n  }\n  .chevron.rotated.svelte-190ptao {\n    transform: rotate(90deg);\n  }\n  .runbook-icon.svelte-190ptao {\n    display: flex;\n    align-items: center;\n    color: #6366f1;\n    flex-shrink: 0;\n  }\n  .svelte-flow.dark .runbook-icon.svelte-190ptao {\n    color: #818cf8;\n  }\n  .runbook-label.svelte-190ptao {\n    font-weight: 600;\n    font-size: 13px;\n    letter-spacing: -0.01em;\n    flex: 1;\n    min-width: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .step-count.svelte-190ptao {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    min-width: 18px;\n    height: 18px;\n    padding: 0 5px;\n    border-radius: 9px;\n    background: rgba(99, 102, 241, 0.1);\n    color: #6366f1;\n    font-size: 10px;\n    font-weight: 600;\n    flex-shrink: 0;\n  }\n  .svelte-flow.dark .step-count.svelte-190ptao {\n    background: rgba(129, 140, 248, 0.15);\n    color: #a5b4fc;\n  }\n\n  .runbook-summary.svelte-190ptao {\n    font-size: 11px;\n    color: #5a5a72;\n    margin-top: 3px;\n    max-width: 200px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    line-height: 1.4;\n  }\n  .svelte-flow.dark .runbook-summary.svelte-190ptao {\n    color: #a8a8be;\n  }\n\n  .subgraph.svelte-190ptao {\n    margin-top: 8px;\n    padding-top: 8px;\n    border-top: 1px solid rgba(0,0,0,0.06);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    flex: 1;\n    min-height: 0;\n    overflow-y: auto;\n  }\n  .svelte-flow.dark .subgraph.svelte-190ptao {\n    border-top-color: rgba(255,255,255,0.06);\n  }\n  .subgraph-step.svelte-190ptao {\n    width: 100%;\n    padding: 4px 8px;\n    border: 1px solid rgba(0,0,0,0.08);\n    border-radius: 6px;\n    background: rgba(0,0,0,0.02);\n  }\n  .svelte-flow.dark .subgraph-step.svelte-190ptao {\n    border-color: rgba(255,255,255,0.08);\n    background: rgba(255,255,255,0.03);\n  }\n  .subgraph-step-name.svelte-190ptao {\n    font-size: 11px;\n    font-weight: 500;\n    color: #374151;\n    line-height: 1.3;\n  }\n  .svelte-flow.dark .subgraph-step-name.svelte-190ptao {\n    color: #d1d5db;\n  }\n  .subgraph-step-module.svelte-190ptao {\n    font-size: 9px;\n    color: #9ca3af;\n    font-family: ui-monospace, monospace;\n  }\n  .svelte-flow.dark .subgraph-step-module.svelte-190ptao {\n    color: #6b7280;\n  }\n  .subgraph-connector.svelte-190ptao {\n    display: flex;\n    justify-content: center;\n    color: #6b7280;\n    height: 12px;\n  }\n  .svelte-flow.dark .subgraph-connector.svelte-190ptao {\n    color: #4b5563;\n  }\n  .subgraph-empty.svelte-190ptao {\n    margin-top: 8px;\n    font-size: 11px;\n    color: #9ca3af;\n    font-style: italic;\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVuYm9va05vZGUuc3ZlbHRlIiwic291cmNlcyI6WyJSdW5ib29rTm9kZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IHsgSGFuZGxlLCBQb3NpdGlvbiwgTm9kZVJlc2l6ZXIsIHVzZVN2ZWx0ZUZsb3cgfSBmcm9tICdAeHlmbG93L3N2ZWx0ZSc7XG4gIGltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuXG4gIGxldCB7IGlkLCBkYXRhLCBpc0Nvbm5lY3RhYmxlLCBzZWxlY3RlZCB9ID0gJHByb3BzKCk7XG4gIGNvbnN0IHsgdXBkYXRlTm9kZSB9ID0gdXNlU3ZlbHRlRmxvdygpO1xuXG4gIGNvbnN0IGRpcmVjdGlvbiA9IGdldENvbnRleHQoJ2RhZ0RpcmVjdGlvbicpIHx8ICdMUic7XG4gIGNvbnN0IHNvdXJjZVBvcyA9IGRpcmVjdGlvbiA9PT0gJ1RCJyA/IFBvc2l0aW9uLkJvdHRvbSA6IFBvc2l0aW9uLlJpZ2h0O1xuICBjb25zdCB0YXJnZXRQb3MgPSBkaXJlY3Rpb24gPT09ICdUQicgPyBQb3NpdGlvbi5Ub3AgOiBQb3NpdGlvbi5MZWZ0O1xuXG4gIGxldCBleHBhbmRlZCA9ICRzdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgTUFYX0VYUEFOREVEX0hFSUdIVCA9IDQwMDtcblxuICBmdW5jdGlvbiB0b2dnbGUoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXhwYW5kZWQgPSAhZXhwYW5kZWQ7XG4gICAgaWYgKGV4cGFuZGVkKSB7XG4gICAgICB1cGRhdGVOb2RlKGlkLCB7IHdpZHRoOiB1bmRlZmluZWQsIGhlaWdodDogTUFYX0VYUEFOREVEX0hFSUdIVCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlTm9kZShpZCwgeyB3aWR0aDogdW5kZWZpbmVkLCBoZWlnaHQ6IHVuZGVmaW5lZCB9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGVwcyA9ICRkZXJpdmVkKGRhdGEuc3ViZ3JhcGg/LnN0ZXBzIHx8IFtdKTtcbiAgY29uc3Qgc3RlcENvdW50ID0gJGRlcml2ZWQoc3RlcHMubGVuZ3RoKTtcblxuICBmdW5jdGlvbiBzaG9ydE1vZHVsZShtb2QpIHtcbiAgICBpZiAoIW1vZCkgcmV0dXJuICcnO1xuICAgIGNvbnN0IHBhcnRzID0gbW9kLnNwbGl0KCcuJyk7XG4gICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuPC9zY3JpcHQ+XG5cbjxOb2RlUmVzaXplciBtaW5XaWR0aD17MTYwfSBtaW5IZWlnaHQ9ezYwfSBtYXhIZWlnaHQ9e01BWF9FWFBBTkRFRF9IRUlHSFR9IGlzVmlzaWJsZT17c2VsZWN0ZWR9IGxpbmVTdHlsZT1cImJvcmRlci1jb2xvcjogcmdiYSg5OSwgMTAyLCAyNDEsIDAuNCk7XCIgaGFuZGxlU3R5bGU9XCJ3aWR0aDogOHB4OyBoZWlnaHQ6IDhweDsgYmFja2dyb3VuZDogIzYzNjZmMTsgYm9yZGVyOiBub25lOyBib3JkZXItcmFkaXVzOiAycHg7XCIgLz5cblxuPEhhbmRsZSB0eXBlPVwidGFyZ2V0XCIgcG9zaXRpb249e3RhcmdldFBvc30gaXNDb25uZWN0YWJsZT17aXNDb25uZWN0YWJsZX0gLz5cblxuPGRpdiBjbGFzcz1cInJ1bmJvb2stbm9kZVwiIGNsYXNzOmV4cGFuZGVkPlxuICA8ZGl2IGNsYXNzPVwicnVuYm9vay1oZWFkZXJcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwidG9nZ2xlLWJ0blwiIG9uY2xpY2s9e3RvZ2dsZX0gdGl0bGU9e2V4cGFuZGVkID8gJ0NvbGxhcHNlJyA6ICdFeHBhbmQnfT5cbiAgICAgIDxzdmdcbiAgICAgICAgY2xhc3M9XCJjaGV2cm9uXCJcbiAgICAgICAgY2xhc3M6cm90YXRlZD17ZXhwYW5kZWR9XG4gICAgICAgIHdpZHRoPVwiMTJcIiBoZWlnaHQ9XCIxMlwiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMTIgMTJcIlxuICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIlxuICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuICAgICAgPlxuICAgICAgICA8cGF0aCBkPVwiTTQgMiBMOCA2IEw0IDEwXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICAgIDxkaXYgY2xhc3M9XCJydW5ib29rLWljb25cIj5cbiAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPlxuICAgICAgICA8cmVjdCB4PVwiMlwiIHk9XCIzXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjE0XCIgcng9XCIyXCIgcnk9XCIyXCI+PC9yZWN0PlxuICAgICAgICA8bGluZSB4MT1cIjhcIiB5MT1cIjIxXCIgeDI9XCIxNlwiIHkyPVwiMjFcIj48L2xpbmU+XG4gICAgICAgIDxsaW5lIHgxPVwiMTJcIiB5MT1cIjE3XCIgeDI9XCIxMlwiIHkyPVwiMjFcIj48L2xpbmU+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiBjbGFzcz1cInJ1bmJvb2stbGFiZWxcIj57ZGF0YS5sYWJlbH08L3NwYW4+XG4gICAgeyNpZiBzdGVwQ291bnQgPiAwICYmICFleHBhbmRlZH1cbiAgICAgIDxzcGFuIGNsYXNzPVwic3RlcC1jb3VudFwiPntzdGVwQ291bnR9PC9zcGFuPlxuICAgIHsvaWZ9XG4gIDwvZGl2PlxuXG4gIHsjaWYgZGF0YS5zdW1tYXJ5Py5sZW5ndGh9XG4gICAgeyNlYWNoIGRhdGEuc3VtbWFyeSBhcyBsaW5lfVxuICAgICAgPGRpdiBjbGFzcz1cInJ1bmJvb2stc3VtbWFyeVwiPntsaW5lfTwvZGl2PlxuICAgIHsvZWFjaH1cbiAgey9pZn1cblxuICB7I2lmIGV4cGFuZGVkICYmIHN0ZXBDb3VudCA+IDB9XG4gICAgPGRpdiBjbGFzcz1cInN1YmdyYXBoXCI+XG4gICAgICB7I2VhY2ggc3RlcHMgYXMgc3RlcCwgaX1cbiAgICAgICAgPGRpdiBjbGFzcz1cInN1YmdyYXBoLXN0ZXBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3ViZ3JhcGgtc3RlcC1uYW1lXCI+e3N0ZXAubmFtZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3ViZ3JhcGgtc3RlcC1tb2R1bGVcIj57c2hvcnRNb2R1bGUoc3RlcC5tb2R1bGUpfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyNpZiBpIDwgc3RlcHMubGVuZ3RoIC0gMX1cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3ViZ3JhcGgtY29ubmVjdG9yXCI+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMlwiIGhlaWdodD1cIjEyXCIgdmlld0JveD1cIjAgMCAyIDEyXCI+XG4gICAgICAgICAgICAgIDxsaW5lIHgxPVwiMVwiIHkxPVwiMFwiIHgyPVwiMVwiIHkyPVwiMTJcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxLjVcIiBzdHJva2Utb3BhY2l0eT1cIjAuM1wiLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB7L2lmfVxuICAgICAgey9lYWNofVxuICAgIDwvZGl2PlxuICB7OmVsc2UgaWYgZXhwYW5kZWQgJiYgc3RlcENvdW50ID09PSAwfVxuICAgIDxkaXYgY2xhc3M9XCJzdWJncmFwaC1lbXB0eVwiPk5vIHN0ZXBzIGZvdW5kPC9kaXY+XG4gIHsvaWZ9XG5cbiAgeyNpZiAhZXhwYW5kZWQgJiYgc3RlcENvdW50ID09PSAwICYmIGRhdGEub3B0cz8ucnVuYm9va19pZH1cbiAgICA8ZGl2IGNsYXNzPVwicnVuYm9vay1zdW1tYXJ5XCI+cmVmOiB7ZGF0YS5vcHRzLnJ1bmJvb2tfaWR9PC9kaXY+XG4gIHsvaWZ9XG48L2Rpdj5cblxuPEhhbmRsZSB0eXBlPVwic291cmNlXCIgcG9zaXRpb249e3NvdXJjZVBvc30gaXNDb25uZWN0YWJsZT17aXNDb25uZWN0YWJsZX0gLz5cblxuPHN0eWxlPlxuICAucnVuYm9vay1ub2RlIHtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICAgIGJvcmRlcjogMnB4IGRhc2hlZCByZ2JhKDk5LCAxMDIsIDI0MSwgMC40KTtcbiAgICBib3JkZXItbGVmdC13aWR0aDogNHB4O1xuICAgIGJvcmRlci1sZWZ0LXN0eWxlOiBzb2xpZDtcbiAgICBib3JkZXItbGVmdC1jb2xvcjogIzYzNjZmMTtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBzYW5zLXNlcmlmO1xuICAgIGNvbG9yOiAjMWExYTJlO1xuICAgIGJveC1zaGFkb3c6XG4gICAgICAwIDFweCAzcHggcmdiYSgwLDAsMCwwLjA2KSxcbiAgICAgIDAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjA0KTtcbiAgICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IDAuMTVzIGVhc2UsIHRyYW5zZm9ybSAwLjE1cyBlYXNlO1xuICB9XG4gIC5ydW5ib29rLW5vZGU6aG92ZXIge1xuICAgIGJveC1zaGFkb3c6XG4gICAgICAwIDJweCA2cHggcmdiYSgwLDAsMCwwLjA4KSxcbiAgICAgIDAgOHB4IDI0cHggcmdiYSgwLDAsMCwwLjA2KTtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAucnVuYm9vay1ub2RlIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDMwLCAzMCwgNDgsIDAuODUpO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig4cHgpO1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSg5OSwgMTAyLCAyNDEsIDAuMyk7XG4gICAgYm9yZGVyLWxlZnQtY29sb3I6ICM4MThjZjg7XG4gICAgY29sb3I6ICNlNGU0ZWQ7XG4gICAgYm94LXNoYWRvdzpcbiAgICAgIDAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMiksXG4gICAgICAwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4xNSk7XG4gIH1cbiAgOmdsb2JhbCguc3ZlbHRlLWZsb3cuZGFyaykgLnJ1bmJvb2stbm9kZTpob3ZlciB7XG4gICAgYm94LXNoYWRvdzpcbiAgICAgIDAgMnB4IDZweCByZ2JhKDAsMCwwLDAuMyksXG4gICAgICAwIDhweCAyNHB4IHJnYmEoMCwwLDAsMC4yKTtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvd19fbm9kZS5zZWxlY3RlZCkgLnJ1bmJvb2stbm9kZSB7XG4gICAgYm9yZGVyLWNvbG9yOiAjM2I4MmY2O1xuICAgIGJveC1zaGFkb3c6XG4gICAgICAwIDAgMCAycHggcmdiYSg1OSwgMTMwLCAyNDYsIDAuMjUpLFxuICAgICAgMCA0cHggMTZweCByZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKTtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrIC5zdmVsdGUtZmxvd19fbm9kZS5zZWxlY3RlZCkgLnJ1bmJvb2stbm9kZSB7XG4gICAgYm9yZGVyLWNvbG9yOiAjNjBhNWZhO1xuICAgIGJveC1zaGFkb3c6XG4gICAgICAwIDAgMCAycHggcmdiYSg5NiwgMTY1LCAyNTAsIDAuMjUpLFxuICAgICAgMCA0cHggMTZweCByZ2JhKDk2LCAxNjUsIDI1MCwgMC4xNSk7XG4gIH1cblxuICAucnVuYm9vay1oZWFkZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDZweDtcbiAgfVxuICAudG9nZ2xlLWJ0biB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAxOHB4O1xuICAgIGhlaWdodDogMThweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgY29sb3I6ICM2YjcyODA7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICB9XG4gIC50b2dnbGUtYnRuOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuMDYpO1xuICAgIGNvbG9yOiAjMzc0MTUxO1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC50b2dnbGUtYnRuIHtcbiAgICBjb2xvcjogIzljYTNhZjtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAudG9nZ2xlLWJ0bjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjA4KTtcbiAgICBjb2xvcjogI2QxZDVkYjtcbiAgfVxuICAuY2hldnJvbiB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMTVzIGVhc2U7XG4gIH1cbiAgLmNoZXZyb24ucm90YXRlZCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuICB9XG4gIC5ydW5ib29rLWljb24ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBjb2xvcjogIzYzNjZmMTtcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAucnVuYm9vay1pY29uIHtcbiAgICBjb2xvcjogIzgxOGNmODtcbiAgfVxuICAucnVuYm9vay1sYWJlbCB7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAxZW07XG4gICAgZmxleDogMTtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG4gIC5zdGVwLWNvdW50IHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi13aWR0aDogMThweDtcbiAgICBoZWlnaHQ6IDE4cHg7XG4gICAgcGFkZGluZzogMCA1cHg7XG4gICAgYm9yZGVyLXJhZGl1czogOXB4O1xuICAgIGJhY2tncm91bmQ6IHJnYmEoOTksIDEwMiwgMjQxLCAwLjEpO1xuICAgIGNvbG9yOiAjNjM2NmYxO1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5zdGVwLWNvdW50IHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDEyOSwgMTQwLCAyNDgsIDAuMTUpO1xuICAgIGNvbG9yOiAjYTViNGZjO1xuICB9XG5cbiAgLnJ1bmJvb2stc3VtbWFyeSB7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICAgIGNvbG9yOiAjNWE1YTcyO1xuICAgIG1hcmdpbi10b3A6IDNweDtcbiAgICBtYXgtd2lkdGg6IDIwMHB4O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBsaW5lLWhlaWdodDogMS40O1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5ydW5ib29rLXN1bW1hcnkge1xuICAgIGNvbG9yOiAjYThhOGJlO1xuICB9XG5cbiAgLnN1YmdyYXBoIHtcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgcGFkZGluZy10b3A6IDhweDtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiYSgwLDAsMCwwLjA2KTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBmbGV4OiAxO1xuICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAuc3ViZ3JhcGgge1xuICAgIGJvcmRlci10b3AtY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC4wNik7XG4gIH1cbiAgLnN1YmdyYXBoLXN0ZXAge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLDAsMCwwLjA4KTtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjAyKTtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAuc3ViZ3JhcGgtc3RlcCB7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuMDgpO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4wMyk7XG4gIH1cbiAgLnN1YmdyYXBoLXN0ZXAtbmFtZSB7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgY29sb3I6ICMzNzQxNTE7XG4gICAgbGluZS1oZWlnaHQ6IDEuMztcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAuc3ViZ3JhcGgtc3RlcC1uYW1lIHtcbiAgICBjb2xvcjogI2QxZDVkYjtcbiAgfVxuICAuc3ViZ3JhcGgtc3RlcC1tb2R1bGUge1xuICAgIGZvbnQtc2l6ZTogOXB4O1xuICAgIGNvbG9yOiAjOWNhM2FmO1xuICAgIGZvbnQtZmFtaWx5OiB1aS1tb25vc3BhY2UsIG1vbm9zcGFjZTtcbiAgfVxuICA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSAuc3ViZ3JhcGgtc3RlcC1tb2R1bGUge1xuICAgIGNvbG9yOiAjNmI3MjgwO1xuICB9XG4gIC5zdWJncmFwaC1jb25uZWN0b3Ige1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgY29sb3I6ICM2YjcyODA7XG4gICAgaGVpZ2h0OiAxMnB4O1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5zdWJncmFwaC1jb25uZWN0b3Ige1xuICAgIGNvbG9yOiAjNGI1NTYzO1xuICB9XG4gIC5zdWJncmFwaC1lbXB0eSB7XG4gICAgbWFyZ2luLXRvcDogOHB4O1xuICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICBjb2xvcjogIzljYTNhZjtcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQXlHQSxFQUFFLDRCQUFhLENBQUM7QUFDaEIsSUFBSSxtQkFBbUI7QUFDdkIsSUFBSSwwQ0FBMEM7QUFDOUMsSUFBSSxzQkFBc0I7QUFDMUIsSUFBSSx3QkFBd0I7QUFDNUIsSUFBSSwwQkFBMEI7QUFDOUIsSUFBSSxtQkFBbUI7QUFDdkIsSUFBSSxrQkFBa0I7QUFDdEIsSUFBSSxXQUFXO0FBQ2YsSUFBSSxZQUFZO0FBQ2hCLElBQUksc0JBQXNCO0FBQzFCLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksYUFBYTtBQUNqQixJQUFJLHNCQUFzQjtBQUMxQixJQUFJLGlEQUFpRDtBQUNyRCxJQUFJLGNBQWM7QUFDbEIsSUFBSTtBQUNKO0FBQ0EsaUNBQWlDO0FBQ2pDLElBQUksdURBQXVEO0FBQzNEO0FBQ0EsRUFBRSw0QkFBYSxNQUFNLENBQUM7QUFDdEIsSUFBSTtBQUNKO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQyw0QkFBYSxDQUFDO0FBQzNDLElBQUksa0NBQWtDO0FBQ3RDLElBQUksMEJBQTBCO0FBQzlCLElBQUkscUNBQXFDO0FBQ3pDLElBQUksMEJBQTBCO0FBQzlCLElBQUksY0FBYztBQUNsQixJQUFJO0FBQ0o7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSxFQUFVLGlCQUFrQixDQUFDLDRCQUFhLE1BQU0sQ0FBQztBQUNqRCxJQUFJO0FBQ0o7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQSxFQUFVLDJCQUE0QixDQUFDLDRCQUFhLENBQUM7QUFDckQsSUFBSSxxQkFBcUI7QUFDekIsSUFBSTtBQUNKO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0EsRUFBVSw2Q0FBOEMsQ0FBQyw0QkFBYSxDQUFDO0FBQ3ZFLElBQUkscUJBQXFCO0FBQ3pCLElBQUk7QUFDSjtBQUNBLHlDQUF5QztBQUN6Qzs7QUFFQSxFQUFFLDhCQUFlLENBQUM7QUFDbEIsSUFBSSxhQUFhO0FBQ2pCLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksUUFBUTtBQUNaO0FBQ0EsRUFBRSwwQkFBVyxDQUFDO0FBQ2QsSUFBSSxhQUFhO0FBQ2pCLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksdUJBQXVCO0FBQzNCLElBQUksV0FBVztBQUNmLElBQUksWUFBWTtBQUNoQixJQUFJLFlBQVk7QUFDaEIsSUFBSSx1QkFBdUI7QUFDM0IsSUFBSSxlQUFlO0FBQ25CLElBQUksVUFBVTtBQUNkLElBQUksY0FBYztBQUNsQixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLGNBQWM7QUFDbEI7QUFDQSxFQUFFLDBCQUFXLE1BQU0sQ0FBQztBQUNwQixJQUFJLDRCQUE0QjtBQUNoQyxJQUFJLGNBQWM7QUFDbEI7QUFDQSxFQUFVLGlCQUFrQixDQUFDLDBCQUFXLENBQUM7QUFDekMsSUFBSSxjQUFjO0FBQ2xCO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQywwQkFBVyxNQUFNLENBQUM7QUFDL0MsSUFBSSxrQ0FBa0M7QUFDdEMsSUFBSSxjQUFjO0FBQ2xCO0FBQ0EsRUFBRSx1QkFBUSxDQUFDO0FBQ1gsSUFBSSxnQ0FBZ0M7QUFDcEM7QUFDQSxFQUFFLFFBQVEsdUJBQVEsQ0FBQztBQUNuQixJQUFJLHdCQUF3QjtBQUM1QjtBQUNBLEVBQUUsNEJBQWEsQ0FBQztBQUNoQixJQUFJLGFBQWE7QUFDakIsSUFBSSxtQkFBbUI7QUFDdkIsSUFBSSxjQUFjO0FBQ2xCLElBQUksY0FBYztBQUNsQjtBQUNBLEVBQVUsaUJBQWtCLENBQUMsNEJBQWEsQ0FBQztBQUMzQyxJQUFJLGNBQWM7QUFDbEI7QUFDQSxFQUFFLDZCQUFjLENBQUM7QUFDakIsSUFBSSxnQkFBZ0I7QUFDcEIsSUFBSSxlQUFlO0FBQ25CLElBQUksdUJBQXVCO0FBQzNCLElBQUksT0FBTztBQUNYLElBQUksWUFBWTtBQUNoQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLHVCQUF1QjtBQUMzQixJQUFJLG1CQUFtQjtBQUN2QjtBQUNBLEVBQUUsMEJBQVcsQ0FBQztBQUNkLElBQUksb0JBQW9CO0FBQ3hCLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksdUJBQXVCO0FBQzNCLElBQUksZUFBZTtBQUNuQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxjQUFjO0FBQ2xCLElBQUksa0JBQWtCO0FBQ3RCLElBQUksbUNBQW1DO0FBQ3ZDLElBQUksY0FBYztBQUNsQixJQUFJLGVBQWU7QUFDbkIsSUFBSSxnQkFBZ0I7QUFDcEIsSUFBSSxjQUFjO0FBQ2xCO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQywwQkFBVyxDQUFDO0FBQ3pDLElBQUkscUNBQXFDO0FBQ3pDLElBQUksY0FBYztBQUNsQjs7QUFFQSxFQUFFLCtCQUFnQixDQUFDO0FBQ25CLElBQUksZUFBZTtBQUNuQixJQUFJLGNBQWM7QUFDbEIsSUFBSSxlQUFlO0FBQ25CLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksdUJBQXVCO0FBQzNCLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksZ0JBQWdCO0FBQ3BCO0FBQ0EsRUFBVSxpQkFBa0IsQ0FBQywrQkFBZ0IsQ0FBQztBQUM5QyxJQUFJLGNBQWM7QUFDbEI7O0FBRUEsRUFBRSx3QkFBUyxDQUFDO0FBQ1osSUFBSSxlQUFlO0FBQ25CLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksc0NBQXNDO0FBQzFDLElBQUksYUFBYTtBQUNqQixJQUFJLHNCQUFzQjtBQUMxQixJQUFJLG1CQUFtQjtBQUN2QixJQUFJLE9BQU87QUFDWCxJQUFJLGFBQWE7QUFDakIsSUFBSSxnQkFBZ0I7QUFDcEI7QUFDQSxFQUFVLGlCQUFrQixDQUFDLHdCQUFTLENBQUM7QUFDdkMsSUFBSSx3Q0FBd0M7QUFDNUM7QUFDQSxFQUFFLDZCQUFjLENBQUM7QUFDakIsSUFBSSxXQUFXO0FBQ2YsSUFBSSxnQkFBZ0I7QUFDcEIsSUFBSSxrQ0FBa0M7QUFDdEMsSUFBSSxrQkFBa0I7QUFDdEIsSUFBSSw0QkFBNEI7QUFDaEM7QUFDQSxFQUFVLGlCQUFrQixDQUFDLDZCQUFjLENBQUM7QUFDNUMsSUFBSSxvQ0FBb0M7QUFDeEMsSUFBSSxrQ0FBa0M7QUFDdEM7QUFDQSxFQUFFLGtDQUFtQixDQUFDO0FBQ3RCLElBQUksZUFBZTtBQUNuQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLGNBQWM7QUFDbEIsSUFBSSxnQkFBZ0I7QUFDcEI7QUFDQSxFQUFVLGlCQUFrQixDQUFDLGtDQUFtQixDQUFDO0FBQ2pELElBQUksY0FBYztBQUNsQjtBQUNBLEVBQUUsb0NBQXFCLENBQUM7QUFDeEIsSUFBSSxjQUFjO0FBQ2xCLElBQUksY0FBYztBQUNsQixJQUFJLG9DQUFvQztBQUN4QztBQUNBLEVBQVUsaUJBQWtCLENBQUMsb0NBQXFCLENBQUM7QUFDbkQsSUFBSSxjQUFjO0FBQ2xCO0FBQ0EsRUFBRSxrQ0FBbUIsQ0FBQztBQUN0QixJQUFJLGFBQWE7QUFDakIsSUFBSSx1QkFBdUI7QUFDM0IsSUFBSSxjQUFjO0FBQ2xCLElBQUksWUFBWTtBQUNoQjtBQUNBLEVBQVUsaUJBQWtCLENBQUMsa0NBQW1CLENBQUM7QUFDakQsSUFBSSxjQUFjO0FBQ2xCO0FBQ0EsRUFBRSw4QkFBZSxDQUFDO0FBQ2xCLElBQUksZUFBZTtBQUNuQixJQUFJLGVBQWU7QUFDbkIsSUFBSSxjQUFjO0FBQ2xCLElBQUksa0JBQWtCO0FBQ3RCOyJ9 */"
};
function RunbookNode($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, RunbookNode);
  append_styles($$anchor, $$css7);
  const { updateNode } = useSvelteFlow();
  const direction = getContext("dagDirection") || "LR";
  const sourcePos = strict_equals(direction, "TB") ? Position.Bottom : Position.Right;
  const targetPos = strict_equals(direction, "TB") ? Position.Top : Position.Left;
  let expanded = tag(state(false), "expanded");
  const MAX_EXPANDED_HEIGHT = 400;
  function toggle(e) {
    e.stopPropagation();
    set(expanded, !get(expanded));
    if (get(expanded)) {
      updateNode($$props.id, { width: void 0, height: MAX_EXPANDED_HEIGHT });
    } else {
      updateNode($$props.id, { width: void 0, height: void 0 });
    }
  }
  const steps = tag(user_derived(() => $$props.data.subgraph?.steps || []), "steps");
  const stepCount = tag(user_derived(() => get(steps).length), "stepCount");
  function shortModule(mod) {
    if (!mod) return "";
    const parts = mod.split(".");
    return parts[parts.length - 1];
  }
  var $$exports = { ...legacy_api() };
  var fragment = root30();
  var node = first_child(fragment);
  add_svelte_meta(
    () => NodeResizer(node, {
      minWidth: 160,
      minHeight: 60,
      maxHeight: MAX_EXPANDED_HEIGHT,
      get isVisible() {
        return $$props.selected;
      },
      lineStyle: "border-color: rgba(99, 102, 241, 0.4);",
      handleStyle: "width: 8px; height: 8px; background: #6366f1; border: none; border-radius: 2px;"
    }),
    "component",
    RunbookNode,
    38,
    0,
    { componentTag: "NodeResizer" }
  );
  var node_1 = sibling(node, 2);
  add_svelte_meta(
    () => Handle(node_1, {
      type: "target",
      get position() {
        return targetPos;
      },
      get isConnectable() {
        return $$props.isConnectable;
      }
    }),
    "component",
    RunbookNode,
    40,
    0,
    { componentTag: "Handle" }
  );
  var div = sibling(node_1, 2);
  let classes;
  var div_1 = child(div);
  var button = child(div_1);
  var svg = child(button);
  let classes_1;
  reset(button);
  var span = sibling(button, 4);
  var text2 = child(span, true);
  reset(span);
  var node_2 = sibling(span, 2);
  {
    var consequent = ($$anchor2) => {
      var span_1 = root_113();
      var text_1 = child(span_1, true);
      reset(span_1);
      template_effect(() => set_text(text_1, get(stepCount)));
      append($$anchor2, span_1);
    };
    add_svelte_meta(
      () => if_block(node_2, ($$render) => {
        if (get(stepCount) > 0 && !get(expanded)) $$render(consequent);
      }),
      "if",
      RunbookNode,
      67,
      4
    );
  }
  reset(div_1);
  var node_3 = sibling(div_1, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_1 = comment();
      var node_4 = first_child(fragment_1);
      add_svelte_meta(
        () => each(node_4, 17, () => $$props.data.summary, index, ($$anchor3, line) => {
          var div_2 = root_36();
          var text_2 = child(div_2, true);
          reset(div_2);
          template_effect(() => set_text(text_2, get(line)));
          append($$anchor3, div_2);
        }),
        "each",
        RunbookNode,
        73,
        4
      );
      append($$anchor2, fragment_1);
    };
    add_svelte_meta(
      () => if_block(node_3, ($$render) => {
        if ($$props.data.summary?.length) $$render(consequent_1);
      }),
      "if",
      RunbookNode,
      72,
      2
    );
  }
  var node_5 = sibling(node_3, 2);
  {
    var consequent_3 = ($$anchor2) => {
      var div_3 = root_43();
      add_svelte_meta(
        () => each(div_3, 21, () => get(steps), index, ($$anchor3, step, i) => {
          var fragment_2 = root_52();
          var div_4 = first_child(fragment_2);
          var div_5 = child(div_4);
          var text_3 = child(div_5, true);
          reset(div_5);
          var div_6 = sibling(div_5, 2);
          var text_4 = child(div_6, true);
          reset(div_6);
          reset(div_4);
          var node_6 = sibling(div_4, 2);
          {
            var consequent_2 = ($$anchor4) => {
              var div_7 = root_62();
              append($$anchor4, div_7);
            };
            add_svelte_meta(
              () => if_block(node_6, ($$render) => {
                if (i < get(steps).length - 1) $$render(consequent_2);
              }),
              "if",
              RunbookNode,
              85,
              8
            );
          }
          template_effect(
            ($0) => {
              set_text(text_3, get(step).name);
              set_text(text_4, $0);
            },
            [() => shortModule(get(step).module)]
          );
          append($$anchor3, fragment_2);
        }),
        "each",
        RunbookNode,
        80,
        6
      );
      reset(div_3);
      append($$anchor2, div_3);
    };
    var consequent_4 = ($$anchor2) => {
      var div_8 = root_72();
      append($$anchor2, div_8);
    };
    add_svelte_meta(
      () => if_block(node_5, ($$render) => {
        if (get(expanded) && get(stepCount) > 0) $$render(consequent_3);
        else if (get(expanded) && strict_equals(get(stepCount), 0)) $$render(consequent_4, 1);
      }),
      "if",
      RunbookNode,
      78,
      2
    );
  }
  var node_7 = sibling(node_5, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var div_9 = root_8();
      var text_5 = child(div_9);
      reset(div_9);
      template_effect(() => set_text(text_5, `ref: ${$$props.data.opts.runbook_id ?? ""}`));
      append($$anchor2, div_9);
    };
    add_svelte_meta(
      () => if_block(node_7, ($$render) => {
        if (!get(expanded) && strict_equals(get(stepCount), 0) && $$props.data.opts?.runbook_id) $$render(consequent_5);
      }),
      "if",
      RunbookNode,
      98,
      2
    );
  }
  reset(div);
  var node_8 = sibling(div, 2);
  add_svelte_meta(
    () => Handle(node_8, {
      type: "source",
      get position() {
        return sourcePos;
      },
      get isConnectable() {
        return $$props.isConnectable;
      }
    }),
    "component",
    RunbookNode,
    103,
    0,
    { componentTag: "Handle" }
  );
  template_effect(() => {
    classes = set_class(div, 1, "runbook-node svelte-190ptao", null, classes, { expanded: get(expanded) });
    set_attribute2(button, "title", get(expanded) ? "Collapse" : "Expand");
    classes_1 = set_class(svg, 0, "chevron svelte-190ptao", null, classes_1, { rotated: get(expanded) });
    set_text(text2, $$props.data.label);
  });
  delegated("click", button, toggle);
  append($$anchor, fragment);
  return pop($$exports);
}
delegate(["click"]);

// svelte/ConditionalEdge.svelte
ConditionalEdge[FILENAME] = "svelte/ConditionalEdge.svelte";
var root_25 = add_locations(from_html(`<div class="condition-badge svelte-1w634al">?</div>`), ConditionalEdge[FILENAME], [[42, 4]]);
var root31 = add_locations(from_html(`<!> <!>`, 1), ConditionalEdge[FILENAME], []);
var $$css8 = {
  hash: "svelte-1w634al",
  code: "\n  .condition-badge.svelte-1w634al {\n    background: #f59e0b;\n    color: #fff;\n    font-size: 10px;\n    font-weight: 700;\n    width: 16px;\n    height: 16px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    pointer-events: all;\n  }\n  .svelte-flow.dark .condition-badge.svelte-1w634al {\n    background: #d97706;\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZGl0aW9uYWxFZGdlLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQ29uZGl0aW9uYWxFZGdlLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyBTbW9vdGhTdGVwRWRnZSwgRWRnZUxhYmVsLCBnZXRTbW9vdGhTdGVwUGF0aCB9IGZyb20gJ0B4eWZsb3cvc3ZlbHRlJztcblxuICBsZXQge1xuICAgIGlkLFxuICAgIHNvdXJjZVgsXG4gICAgc291cmNlWSxcbiAgICB0YXJnZXRYLFxuICAgIHRhcmdldFksXG4gICAgc291cmNlUG9zaXRpb24sXG4gICAgdGFyZ2V0UG9zaXRpb24sXG4gICAgZGF0YSA9IHt9LFxuICAgIG1hcmtlckVuZCxcbiAgICBzdHlsZSxcbiAgICBzZWxlY3RlZCxcbiAgICAuLi5yZXN0XG4gIH0gPSAkcHJvcHMoKTtcblxuICBsZXQgcGF0aFJlc3VsdCA9ICRkZXJpdmVkKGdldFNtb290aFN0ZXBQYXRoKHtcbiAgICBzb3VyY2VYLCBzb3VyY2VZLCB0YXJnZXRYLCB0YXJnZXRZLCBzb3VyY2VQb3NpdGlvbiwgdGFyZ2V0UG9zaXRpb25cbiAgfSkpO1xuXG4gIGxldCBsYWJlbFggPSAkZGVyaXZlZChwYXRoUmVzdWx0WzFdKTtcbiAgbGV0IGxhYmVsWSA9ICRkZXJpdmVkKHBhdGhSZXN1bHRbMl0pO1xuXG4gIGxldCBoYXNDb25kaXRpb24gPSAkZGVyaXZlZCghIWRhdGE/LmNvbmRpdGlvbik7XG48L3NjcmlwdD5cblxuPFNtb290aFN0ZXBFZGdlXG4gIHtpZH1cbiAge3NvdXJjZVh9IHtzb3VyY2VZfVxuICB7dGFyZ2V0WH0ge3RhcmdldFl9XG4gIHtzb3VyY2VQb3NpdGlvbn0ge3RhcmdldFBvc2l0aW9ufVxuICB7bWFya2VyRW5kfVxuICBzdHlsZT17aGFzQ29uZGl0aW9uID8gJ3N0cm9rZTogI2Y1OWUwYjsgc3Ryb2tlLXdpZHRoOiAyOycgOiBzdHlsZX1cbiAge3NlbGVjdGVkfVxuICB7Li4ucmVzdH1cbi8+XG5cbnsjaWYgaGFzQ29uZGl0aW9ufVxuICA8RWRnZUxhYmVsIHg9e2xhYmVsWH0geT17bGFiZWxZfT5cbiAgICA8ZGl2IGNsYXNzPVwiY29uZGl0aW9uLWJhZGdlXCIgdGl0bGU9e2RhdGEuY29uZGl0aW9ufT4/PC9kaXY+XG4gIDwvRWRnZUxhYmVsPlxuey9pZn1cblxuPHN0eWxlPlxuICAuY29uZGl0aW9uLWJhZGdlIHtcbiAgICBiYWNrZ3JvdW5kOiAjZjU5ZTBiO1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIHdpZHRoOiAxNnB4O1xuICAgIGhlaWdodDogMTZweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBwb2ludGVyLWV2ZW50czogYWxsO1xuICB9XG4gIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmspIC5jb25kaXRpb24tYmFkZ2Uge1xuICAgIGJhY2tncm91bmQ6ICNkOTc3MDY7XG4gIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQThDQSxFQUFFLCtCQUFnQixDQUFDO0FBQ25CLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksV0FBVztBQUNmLElBQUksZUFBZTtBQUNuQixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLFdBQVc7QUFDZixJQUFJLFlBQVk7QUFDaEIsSUFBSSxrQkFBa0I7QUFDdEIsSUFBSSxhQUFhO0FBQ2pCLElBQUksbUJBQW1CO0FBQ3ZCLElBQUksdUJBQXVCO0FBQzNCLElBQUksZUFBZTtBQUNuQixJQUFJLG1CQUFtQjtBQUN2QjtBQUNBLEVBQVUsaUJBQWtCLENBQUMsK0JBQWdCLENBQUM7QUFDOUMsSUFBSSxtQkFBbUI7QUFDdkI7In0= */"
};
function ConditionalEdge($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, ConditionalEdge);
  append_styles($$anchor, $$css8);
  let data = prop($$props, "data", 19, () => ({})), rest = rest_props(
    $$props,
    [
      "$$slots",
      "$$events",
      "$$legacy",
      "id",
      "sourceX",
      "sourceY",
      "targetX",
      "targetY",
      "sourcePosition",
      "targetPosition",
      "data",
      "markerEnd",
      "style",
      "selected"
    ],
    "rest"
  );
  let pathResult = tag(
    user_derived(() => getSmoothStepPath({
      sourceX: $$props.sourceX,
      sourceY: $$props.sourceY,
      targetX: $$props.targetX,
      targetY: $$props.targetY,
      sourcePosition: $$props.sourcePosition,
      targetPosition: $$props.targetPosition
    })),
    "pathResult"
  );
  let labelX = tag(user_derived(() => get(pathResult)[1]), "labelX");
  let labelY = tag(user_derived(() => get(pathResult)[2]), "labelY");
  let hasCondition = tag(user_derived(() => !!data()?.condition), "hasCondition");
  var $$exports = { ...legacy_api() };
  var fragment = root31();
  var node = first_child(fragment);
  {
    let $0 = user_derived(() => get(hasCondition) ? "stroke: #f59e0b; stroke-width: 2;" : $$props.style);
    add_svelte_meta(
      () => SmoothStepEdge(node, spread_props(
        {
          get id() {
            return $$props.id;
          },
          get sourceX() {
            return $$props.sourceX;
          },
          get sourceY() {
            return $$props.sourceY;
          },
          get targetX() {
            return $$props.targetX;
          },
          get targetY() {
            return $$props.targetY;
          },
          get sourcePosition() {
            return $$props.sourcePosition;
          },
          get targetPosition() {
            return $$props.targetPosition;
          },
          get markerEnd() {
            return $$props.markerEnd;
          },
          get style() {
            return get($0);
          },
          get selected() {
            return $$props.selected;
          }
        },
        () => rest
      )),
      "component",
      ConditionalEdge,
      29,
      0,
      { componentTag: "SmoothStepEdge" }
    );
  }
  var node_1 = sibling(node, 2);
  {
    var consequent = ($$anchor2) => {
      add_svelte_meta(
        () => EdgeLabel($$anchor2, {
          get x() {
            return get(labelX);
          },
          get y() {
            return get(labelY);
          },
          children: wrap_snippet(ConditionalEdge, ($$anchor3, $$slotProps) => {
            var div = root_25();
            template_effect(() => set_attribute2(div, "title", data().condition));
            append($$anchor3, div);
          }),
          $$slots: { default: true }
        }),
        "component",
        ConditionalEdge,
        41,
        2,
        { componentTag: "EdgeLabel" }
      );
    };
    add_svelte_meta(
      () => if_block(node_1, ($$render) => {
        if (get(hasCondition)) $$render(consequent);
      }),
      "if",
      ConditionalEdge,
      40,
      0
    );
  }
  append($$anchor, fragment);
  return pop($$exports);
}

// svelte/resolveCollisions.js
function resolveCollisions(nodes, { maxIterations = 50, overlapThreshold = 0.5, margin = 0 } = {}) {
  const boxes = nodes.map((node) => ({
    x: node.position.x - margin,
    y: node.position.y - margin,
    width: (node.width ?? node.measured?.width ?? 0) + margin * 2,
    height: (node.height ?? node.measured?.height ?? 0) + margin * 2,
    node,
    moved: false
  }));
  for (let iter = 0; iter <= maxIterations; iter++) {
    let moved = false;
    for (let i = 0; i < boxes.length; i++) {
      for (let j2 = i + 1; j2 < boxes.length; j2++) {
        const A = boxes[i];
        const B = boxes[j2];
        const centerAX = A.x + A.width * 0.5;
        const centerAY = A.y + A.height * 0.5;
        const centerBX = B.x + B.width * 0.5;
        const centerBY = B.y + B.height * 0.5;
        const dx = centerAX - centerBX;
        const dy = centerAY - centerBY;
        const px = (A.width + B.width) * 0.5 - Math.abs(dx);
        const py = (A.height + B.height) * 0.5 - Math.abs(dy);
        if (px > overlapThreshold && py > overlapThreshold) {
          A.moved = B.moved = moved = true;
          if (px < py) {
            const sx = dx > 0 ? 1 : -1;
            const moveAmount = px / 2 * sx;
            A.x += moveAmount;
            B.x -= moveAmount;
          } else {
            const sy = dy > 0 ? 1 : -1;
            const moveAmount = py / 2 * sy;
            A.y += moveAmount;
            B.y -= moveAmount;
          }
        }
      }
    }
    if (!moved) break;
  }
  return boxes.map((box) => {
    if (box.moved) {
      return {
        ...box.node,
        position: { x: box.x + margin, y: box.y + margin }
      };
    }
    return box.node;
  });
}

// node_modules/@dagrejs/dagre/dist/dagre.esm.js
var v = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var y = v((Fi, ee) => {
  var Vt = Object.defineProperty, At = (e, t, r2) => t in e ? Vt(e, t, { enumerable: true, configurable: true, writable: true, value: r2 }) : e[t] = r2, E = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), k = (e, t, r2) => At(e, typeof t != "symbol" ? t + "" : t, r2), R = E((e, t) => {
    "use strict";
    var r2 = "\0", n = "\0", i = "", o = class {
      constructor(d) {
        k(this, "_isDirected", true), k(this, "_isMultigraph", false), k(this, "_isCompound", false), k(this, "_label"), k(this, "_defaultNodeLabelFn", () => {
        }), k(this, "_defaultEdgeLabelFn", () => {
        }), k(this, "_nodes", {}), k(this, "_in", {}), k(this, "_preds", {}), k(this, "_out", {}), k(this, "_sucs", {}), k(this, "_edgeObjs", {}), k(this, "_edgeLabels", {}), k(this, "_nodeCount", 0), k(this, "_edgeCount", 0), k(this, "_parent"), k(this, "_children"), d && (this._isDirected = Object.hasOwn(d, "directed") ? d.directed : true, this._isMultigraph = Object.hasOwn(d, "multigraph") ? d.multigraph : false, this._isCompound = Object.hasOwn(d, "compound") ? d.compound : false), this._isCompound && (this._parent = {}, this._children = {}, this._children[n] = {});
      }
      isDirected() {
        return this._isDirected;
      }
      isMultigraph() {
        return this._isMultigraph;
      }
      isCompound() {
        return this._isCompound;
      }
      setGraph(d) {
        return this._label = d, this;
      }
      graph() {
        return this._label;
      }
      setDefaultNodeLabel(d) {
        return this._defaultNodeLabelFn = d, typeof d != "function" && (this._defaultNodeLabelFn = () => d), this;
      }
      nodeCount() {
        return this._nodeCount;
      }
      nodes() {
        return Object.keys(this._nodes);
      }
      sources() {
        var d = this;
        return this.nodes().filter((h) => Object.keys(d._in[h]).length === 0);
      }
      sinks() {
        var d = this;
        return this.nodes().filter((h) => Object.keys(d._out[h]).length === 0);
      }
      setNodes(d, h) {
        var f = arguments, m = this;
        return d.forEach(function(p) {
          f.length > 1 ? m.setNode(p, h) : m.setNode(p);
        }), this;
      }
      setNode(d, h) {
        return Object.hasOwn(this._nodes, d) ? (arguments.length > 1 && (this._nodes[d] = h), this) : (this._nodes[d] = arguments.length > 1 ? h : this._defaultNodeLabelFn(d), this._isCompound && (this._parent[d] = n, this._children[d] = {}, this._children[n][d] = true), this._in[d] = {}, this._preds[d] = {}, this._out[d] = {}, this._sucs[d] = {}, ++this._nodeCount, this);
      }
      node(d) {
        return this._nodes[d];
      }
      hasNode(d) {
        return Object.hasOwn(this._nodes, d);
      }
      removeNode(d) {
        var h = this;
        if (Object.hasOwn(this._nodes, d)) {
          var f = (m) => h.removeEdge(h._edgeObjs[m]);
          delete this._nodes[d], this._isCompound && (this._removeFromParentsChildList(d), delete this._parent[d], this.children(d).forEach(function(m) {
            h.setParent(m);
          }), delete this._children[d]), Object.keys(this._in[d]).forEach(f), delete this._in[d], delete this._preds[d], Object.keys(this._out[d]).forEach(f), delete this._out[d], delete this._sucs[d], --this._nodeCount;
        }
        return this;
      }
      setParent(d, h) {
        if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
        if (h === void 0) h = n;
        else {
          h += "";
          for (var f = h; f !== void 0; f = this.parent(f)) if (f === d) throw new Error("Setting " + h + " as parent of " + d + " would create a cycle");
          this.setNode(h);
        }
        return this.setNode(d), this._removeFromParentsChildList(d), this._parent[d] = h, this._children[h][d] = true, this;
      }
      _removeFromParentsChildList(d) {
        delete this._children[this._parent[d]][d];
      }
      parent(d) {
        if (this._isCompound) {
          var h = this._parent[d];
          if (h !== n) return h;
        }
      }
      children(d = n) {
        if (this._isCompound) {
          var h = this._children[d];
          if (h) return Object.keys(h);
        } else {
          if (d === n) return this.nodes();
          if (this.hasNode(d)) return [];
        }
      }
      predecessors(d) {
        var h = this._preds[d];
        if (h) return Object.keys(h);
      }
      successors(d) {
        var h = this._sucs[d];
        if (h) return Object.keys(h);
      }
      neighbors(d) {
        var h = this.predecessors(d);
        if (h) {
          let m = new Set(h);
          for (var f of this.successors(d)) m.add(f);
          return Array.from(m.values());
        }
      }
      isLeaf(d) {
        var h;
        return this.isDirected() ? h = this.successors(d) : h = this.neighbors(d), h.length === 0;
      }
      filterNodes(d) {
        var h = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        h.setGraph(this.graph());
        var f = this;
        Object.entries(this._nodes).forEach(function([w, b]) {
          d(w) && h.setNode(w, b);
        }), Object.values(this._edgeObjs).forEach(function(w) {
          h.hasNode(w.v) && h.hasNode(w.w) && h.setEdge(w, f.edge(w));
        });
        var m = {};
        function p(w) {
          var b = f.parent(w);
          return b === void 0 || h.hasNode(b) ? (m[w] = b, b) : b in m ? m[b] : p(b);
        }
        return this._isCompound && h.nodes().forEach((w) => h.setParent(w, p(w))), h;
      }
      setDefaultEdgeLabel(d) {
        return this._defaultEdgeLabelFn = d, typeof d != "function" && (this._defaultEdgeLabelFn = () => d), this;
      }
      edgeCount() {
        return this._edgeCount;
      }
      edges() {
        return Object.values(this._edgeObjs);
      }
      setPath(d, h) {
        var f = this, m = arguments;
        return d.reduce(function(p, w) {
          return m.length > 1 ? f.setEdge(p, w, h) : f.setEdge(p, w), w;
        }), this;
      }
      setEdge() {
        var d, h, f, m, p = false, w = arguments[0];
        typeof w == "object" && w !== null && "v" in w ? (d = w.v, h = w.w, f = w.name, arguments.length === 2 && (m = arguments[1], p = true)) : (d = w, h = arguments[1], f = arguments[3], arguments.length > 2 && (m = arguments[2], p = true)), d = "" + d, h = "" + h, f !== void 0 && (f = "" + f);
        var b = l(this._isDirected, d, h, f);
        if (Object.hasOwn(this._edgeLabels, b)) return p && (this._edgeLabels[b] = m), this;
        if (f !== void 0 && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(d), this.setNode(h), this._edgeLabels[b] = p ? m : this._defaultEdgeLabelFn(d, h, f);
        var g = u(this._isDirected, d, h, f);
        return d = g.v, h = g.w, Object.freeze(g), this._edgeObjs[b] = g, s(this._preds[h], d), s(this._sucs[d], h), this._in[h][b] = g, this._out[d][b] = g, this._edgeCount++, this;
      }
      edge(d, h, f) {
        var m = arguments.length === 1 ? c(this._isDirected, arguments[0]) : l(this._isDirected, d, h, f);
        return this._edgeLabels[m];
      }
      edgeAsObj() {
        let d = this.edge(...arguments);
        return typeof d != "object" ? { label: d } : d;
      }
      hasEdge(d, h, f) {
        var m = arguments.length === 1 ? c(this._isDirected, arguments[0]) : l(this._isDirected, d, h, f);
        return Object.hasOwn(this._edgeLabels, m);
      }
      removeEdge(d, h, f) {
        var m = arguments.length === 1 ? c(this._isDirected, arguments[0]) : l(this._isDirected, d, h, f), p = this._edgeObjs[m];
        return p && (d = p.v, h = p.w, delete this._edgeLabels[m], delete this._edgeObjs[m], a(this._preds[h], d), a(this._sucs[d], h), delete this._in[h][m], delete this._out[d][m], this._edgeCount--), this;
      }
      inEdges(d, h) {
        return this.isDirected() ? this.filterEdges(this._in[d], d, h) : this.nodeEdges(d, h);
      }
      outEdges(d, h) {
        return this.isDirected() ? this.filterEdges(this._out[d], d, h) : this.nodeEdges(d, h);
      }
      nodeEdges(d, h) {
        if (d in this._nodes) return this.filterEdges({ ...this._in[d], ...this._out[d] }, d, h);
      }
      filterEdges(d, h, f) {
        if (d) {
          var m = Object.values(d);
          return f ? m.filter(function(p) {
            return p.v === h && p.w === f || p.v === f && p.w === h;
          }) : m;
        }
      }
    };
    function s(d, h) {
      d[h] ? d[h]++ : d[h] = 1;
    }
    function a(d, h) {
      --d[h] || delete d[h];
    }
    function l(d, h, f, m) {
      var p = "" + h, w = "" + f;
      if (!d && p > w) {
        var b = p;
        p = w, w = b;
      }
      return p + i + w + i + (m === void 0 ? r2 : m);
    }
    function u(d, h, f, m) {
      var p = "" + h, w = "" + f;
      if (!d && p > w) {
        var b = p;
        p = w, w = b;
      }
      var g = { v: p, w };
      return m && (g.name = m), g;
    }
    function c(d, h) {
      return l(d, h.v, h.w, h.name);
    }
    t.exports = o;
  }), Yt = E((e, t) => {
    t.exports = "3.0.2";
  }), Bt = E((e, t) => {
    t.exports = { Graph: R(), version: Yt() };
  }), Wt = E((e, t) => {
    var r2 = R();
    t.exports = { write: n, read: s };
    function n(a) {
      var l = { options: { directed: a.isDirected(), multigraph: a.isMultigraph(), compound: a.isCompound() }, nodes: i(a), edges: o(a) };
      return a.graph() !== void 0 && (l.value = structuredClone(a.graph())), l;
    }
    function i(a) {
      return a.nodes().map(function(l) {
        var u = a.node(l), c = a.parent(l), d = { v: l };
        return u !== void 0 && (d.value = u), c !== void 0 && (d.parent = c), d;
      });
    }
    function o(a) {
      return a.edges().map(function(l) {
        var u = a.edge(l), c = { v: l.v, w: l.w };
        return l.name !== void 0 && (c.name = l.name), u !== void 0 && (c.value = u), c;
      });
    }
    function s(a) {
      var l = new r2(a.options).setGraph(a.value);
      return a.nodes.forEach(function(u) {
        l.setNode(u.v, u.value), u.parent && l.setParent(u.v, u.parent);
      }), a.edges.forEach(function(u) {
        l.setEdge({ v: u.v, w: u.w, name: u.name }, u.value);
      }), l;
    }
  }), U = E((e, t) => {
    t.exports = n;
    var r2 = () => 1;
    function n(o, s, a, l) {
      return i(o, String(s), a || r2, l || function(u) {
        return o.outEdges(u);
      });
    }
    function i(o, s, a, l) {
      var u = {}, c = true, d = 0, h = o.nodes(), f = function(b) {
        var g = a(b);
        u[b.v].distance + g < u[b.w].distance && (u[b.w] = { distance: u[b.v].distance + g, predecessor: b.v }, c = true);
      }, m = function() {
        h.forEach(function(b) {
          l(b).forEach(function(g) {
            var I = g.v === b ? g.v : g.w, Gt = I === g.v ? g.w : g.v;
            f({ v: I, w: Gt });
          });
        });
      };
      h.forEach(function(b) {
        var g = b === s ? 0 : Number.POSITIVE_INFINITY;
        u[b] = { distance: g };
      });
      for (var p = h.length, w = 1; w < p && (c = false, d++, m(), !!c); w++) ;
      if (d === p - 1 && (c = false, m(), c)) throw new Error("The graph contains a negative weight cycle");
      return u;
    }
  }), zt = E((e, t) => {
    t.exports = r2;
    function r2(n) {
      var i = {}, o = [], s;
      function a(l) {
        Object.hasOwn(i, l) || (i[l] = true, s.push(l), n.successors(l).forEach(a), n.predecessors(l).forEach(a));
      }
      return n.nodes().forEach(function(l) {
        s = [], a(l), s.length && o.push(s);
      }), o;
    }
  }), K = E((e, t) => {
    var r2 = class {
      constructor() {
        k(this, "_arr", []), k(this, "_keyIndices", {});
      }
      size() {
        return this._arr.length;
      }
      keys() {
        return this._arr.map(function(n) {
          return n.key;
        });
      }
      has(n) {
        return Object.hasOwn(this._keyIndices, n);
      }
      priority(n) {
        var i = this._keyIndices[n];
        if (i !== void 0) return this._arr[i].priority;
      }
      min() {
        if (this.size() === 0) throw new Error("Queue underflow");
        return this._arr[0].key;
      }
      add(n, i) {
        var o = this._keyIndices;
        if (n = String(n), !Object.hasOwn(o, n)) {
          var s = this._arr, a = s.length;
          return o[n] = a, s.push({ key: n, priority: i }), this._decrease(a), true;
        }
        return false;
      }
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var n = this._arr.pop();
        return delete this._keyIndices[n.key], this._heapify(0), n.key;
      }
      decrease(n, i) {
        var o = this._keyIndices[n];
        if (i > this._arr[o].priority) throw new Error("New priority is greater than current priority. Key: " + n + " Old: " + this._arr[o].priority + " New: " + i);
        this._arr[o].priority = i, this._decrease(o);
      }
      _heapify(n) {
        var i = this._arr, o = 2 * n, s = o + 1, a = n;
        o < i.length && (a = i[o].priority < i[a].priority ? o : a, s < i.length && (a = i[s].priority < i[a].priority ? s : a), a !== n && (this._swap(n, a), this._heapify(a)));
      }
      _decrease(n) {
        for (var i = this._arr, o = i[n].priority, s; n !== 0 && (s = n >> 1, !(i[s].priority < o)); ) this._swap(n, s), n = s;
      }
      _swap(n, i) {
        var o = this._arr, s = this._keyIndices, a = o[n], l = o[i];
        o[n] = l, o[i] = a, s[l.key] = n, s[a.key] = i;
      }
    };
    t.exports = r2;
  }), T = E((e, t) => {
    var r2 = K();
    t.exports = i;
    var n = () => 1;
    function i(s, a, l, u) {
      var c = function(d) {
        return s.outEdges(d);
      };
      return o(s, String(a), l || n, u || c);
    }
    function o(s, a, l, u) {
      var c = {}, d = new r2(), h, f, m = function(p) {
        var w = p.v !== h ? p.v : p.w, b = c[w], g = l(p), I = f.distance + g;
        if (g < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + p + " Weight: " + g);
        I < b.distance && (b.distance = I, b.predecessor = h, d.decrease(w, I));
      };
      for (s.nodes().forEach(function(p) {
        var w = p === a ? 0 : Number.POSITIVE_INFINITY;
        c[p] = { distance: w }, d.add(p, w);
      }); d.size() > 0 && (h = d.removeMin(), f = c[h], f.distance !== Number.POSITIVE_INFINITY); ) u(h).forEach(m);
      return c;
    }
  }), Xt = E((e, t) => {
    var r2 = T();
    t.exports = n;
    function n(i, o, s) {
      return i.nodes().reduce(function(a, l) {
        return a[l] = r2(i, l, o, s), a;
      }, {});
    }
  }), Ht = E((e, t) => {
    t.exports = r2;
    function r2(i, o, s) {
      if (i[o].predecessor !== void 0) throw new Error("Invalid source vertex");
      if (i[s].predecessor === void 0 && s !== o) throw new Error("Invalid destination vertex");
      return { weight: i[s].distance, path: n(i, o, s) };
    }
    function n(i, o, s) {
      for (var a = [], l = s; l !== o; ) a.push(l), l = i[l].predecessor;
      return a.push(o), a.reverse();
    }
  }), Q = E((e, t) => {
    t.exports = r2;
    function r2(n) {
      var i = 0, o = [], s = {}, a = [];
      function l(u) {
        var c = s[u] = { onStack: true, lowlink: i, index: i++ };
        if (o.push(u), n.successors(u).forEach(function(f) {
          Object.hasOwn(s, f) ? s[f].onStack && (c.lowlink = Math.min(c.lowlink, s[f].index)) : (l(f), c.lowlink = Math.min(c.lowlink, s[f].lowlink));
        }), c.lowlink === c.index) {
          var d = [], h;
          do
            h = o.pop(), s[h].onStack = false, d.push(h);
          while (u !== h);
          a.push(d);
        }
      }
      return n.nodes().forEach(function(u) {
        Object.hasOwn(s, u) || l(u);
      }), a;
    }
  }), Ut = E((e, t) => {
    var r2 = Q();
    t.exports = n;
    function n(i) {
      return r2(i).filter(function(o) {
        return o.length > 1 || o.length === 1 && i.hasEdge(o[0], o[0]);
      });
    }
  }), Kt = E((e, t) => {
    t.exports = n;
    var r2 = () => 1;
    function n(o, s, a) {
      return i(o, s || r2, a || function(l) {
        return o.outEdges(l);
      });
    }
    function i(o, s, a) {
      var l = {}, u = o.nodes();
      return u.forEach(function(c) {
        l[c] = {}, l[c][c] = { distance: 0 }, u.forEach(function(d) {
          c !== d && (l[c][d] = { distance: Number.POSITIVE_INFINITY });
        }), a(c).forEach(function(d) {
          var h = d.v === c ? d.w : d.v, f = s(d);
          l[c][h] = { distance: f, predecessor: c };
        });
      }), u.forEach(function(c) {
        var d = l[c];
        u.forEach(function(h) {
          var f = l[h];
          u.forEach(function(m) {
            var p = f[c], w = d[m], b = f[m], g = p.distance + w.distance;
            g < b.distance && (b.distance = g, b.predecessor = w.predecessor);
          });
        });
      }), l;
    }
  }), J = E((e, t) => {
    function r2(i) {
      var o = {}, s = {}, a = [];
      function l(u) {
        if (Object.hasOwn(s, u)) throw new n();
        Object.hasOwn(o, u) || (s[u] = true, o[u] = true, i.predecessors(u).forEach(l), delete s[u], a.push(u));
      }
      if (i.sinks().forEach(l), Object.keys(o).length !== i.nodeCount()) throw new n();
      return a;
    }
    var n = class extends Error {
      constructor() {
        super(...arguments);
      }
    };
    t.exports = r2, r2.CycleException = n;
  }), Qt = E((e, t) => {
    var r2 = J();
    t.exports = n;
    function n(i) {
      try {
        r2(i);
      } catch (o) {
        if (o instanceof r2.CycleException) return false;
        throw o;
      }
      return true;
    }
  }), Z = E((e, t) => {
    t.exports = r2;
    function r2(i, o, s, a, l) {
      Array.isArray(o) || (o = [o]);
      var u = (i.isDirected() ? i.successors : i.neighbors).bind(i), c = {};
      return o.forEach(function(d) {
        if (!i.hasNode(d)) throw new Error("Graph does not have node: " + d);
        l = n(i, d, s === "post", c, u, a, l);
      }), l;
    }
    function n(i, o, s, a, l, u, c) {
      return Object.hasOwn(a, o) || (a[o] = true, s || (c = u(c, o)), l(o).forEach(function(d) {
        c = n(i, d, s, a, l, u, c);
      }), s && (c = u(c, o))), c;
    }
  }), $ = E((e, t) => {
    var r2 = Z();
    t.exports = n;
    function n(i, o, s) {
      return r2(i, o, s, function(a, l) {
        return a.push(l), a;
      }, []);
    }
  }), Jt = E((e, t) => {
    var r2 = $();
    t.exports = n;
    function n(i, o) {
      return r2(i, o, "post");
    }
  }), Zt = E((e, t) => {
    var r2 = $();
    t.exports = n;
    function n(i, o) {
      return r2(i, o, "pre");
    }
  }), $t = E((e, t) => {
    var r2 = R(), n = K();
    t.exports = i;
    function i(o, s) {
      var a = new r2(), l = {}, u = new n(), c;
      function d(f) {
        var m = f.v === c ? f.w : f.v, p = u.priority(m);
        if (p !== void 0) {
          var w = s(f);
          w < p && (l[m] = c, u.decrease(m, w));
        }
      }
      if (o.nodeCount() === 0) return a;
      o.nodes().forEach(function(f) {
        u.add(f, Number.POSITIVE_INFINITY), a.setNode(f);
      }), u.decrease(o.nodes()[0], 0);
      for (var h = false; u.size() > 0; ) {
        if (c = u.removeMin(), Object.hasOwn(l, c)) a.setEdge(c, l[c]);
        else {
          if (h) throw new Error("Input graph is not connected: " + o);
          h = true;
        }
        o.nodeEdges(c).forEach(d);
      }
      return a;
    }
  }), er = E((e, t) => {
    var r2 = T(), n = U();
    t.exports = i;
    function i(s, a, l, u) {
      return o(s, a, l, u || function(c) {
        return s.outEdges(c);
      });
    }
    function o(s, a, l, u) {
      if (l === void 0) return r2(s, a, l, u);
      for (var c = false, d = s.nodes(), h = 0; h < d.length; h++) {
        for (var f = u(d[h]), m = 0; m < f.length; m++) {
          var p = f[m], w = p.v === d[h] ? p.v : p.w, b = w === p.v ? p.w : p.v;
          l({ v: w, w: b }) < 0 && (c = true);
        }
        if (c) return n(s, a, l, u);
      }
      return r2(s, a, l, u);
    }
  }), tr = E((e, t) => {
    t.exports = { bellmanFord: U(), components: zt(), dijkstra: T(), dijkstraAll: Xt(), extractPath: Ht(), findCycles: Ut(), floydWarshall: Kt(), isAcyclic: Qt(), postorder: Jt(), preorder: Zt(), prim: $t(), shortestPaths: er(), reduce: Z(), tarjan: Q(), topsort: J() };
  }), H = Bt();
  ee.exports = { Graph: H.Graph, json: Wt(), alg: tr(), version: H.version };
});
var ne = v((Ai, re) => {
  var S = class {
    constructor() {
      let t = {};
      t._next = t._prev = t, this._sentinel = t;
    }
    dequeue() {
      let t = this._sentinel, r2 = t._prev;
      if (r2 !== t) return te(r2), r2;
    }
    enqueue(t) {
      let r2 = this._sentinel;
      t._prev && t._next && te(t), t._next = r2._next, r2._next._prev = t, r2._next = t, t._prev = r2;
    }
    toString() {
      let t = [], r2 = this._sentinel, n = r2._prev;
      for (; n !== r2; ) t.push(JSON.stringify(n, rr)), n = n._prev;
      return "[" + t.join(", ") + "]";
    }
  };
  function te(e) {
    e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
  }
  function rr(e, t) {
    if (e !== "_next" && e !== "_prev") return t;
  }
  re.exports = S;
});
var oe = v((Yi, ie) => {
  var nr = y().Graph, ir = ne();
  ie.exports = sr;
  var or = () => 1;
  function sr(e, t) {
    if (e.nodeCount() <= 1) return [];
    let r2 = dr(e, t || or);
    return ar(r2.graph, r2.buckets, r2.zeroIdx).flatMap((i) => e.outEdges(i.v, i.w));
  }
  function ar(e, t, r2) {
    let n = [], i = t[t.length - 1], o = t[0], s;
    for (; e.nodeCount(); ) {
      for (; s = o.dequeue(); ) P(e, t, r2, s);
      for (; s = i.dequeue(); ) P(e, t, r2, s);
      if (e.nodeCount()) {
        for (let a = t.length - 2; a > 0; --a) if (s = t[a].dequeue(), s) {
          n = n.concat(P(e, t, r2, s, true));
          break;
        }
      }
    }
    return n;
  }
  function P(e, t, r2, n, i) {
    let o = i ? [] : void 0;
    return e.inEdges(n.v).forEach((s) => {
      let a = e.edge(s), l = e.node(s.v);
      i && o.push({ v: s.v, w: s.w }), l.out -= a, F(t, r2, l);
    }), e.outEdges(n.v).forEach((s) => {
      let a = e.edge(s), l = s.w, u = e.node(l);
      u.in -= a, F(t, r2, u);
    }), e.removeNode(n.v), o;
  }
  function dr(e, t) {
    let r2 = new nr(), n = 0, i = 0;
    e.nodes().forEach((a) => {
      r2.setNode(a, { v: a, in: 0, out: 0 });
    }), e.edges().forEach((a) => {
      let l = r2.edge(a.v, a.w) || 0, u = t(a), c = l + u;
      r2.setEdge(a.v, a.w, c), i = Math.max(i, r2.node(a.v).out += u), n = Math.max(n, r2.node(a.w).in += u);
    });
    let o = lr(i + n + 3).map(() => new ir()), s = n + 1;
    return r2.nodes().forEach((a) => {
      F(o, s, r2.node(a));
    }), { graph: r2, buckets: o, zeroIdx: s };
  }
  function F(e, t, r2) {
    r2.out ? r2.in ? e[r2.out - r2.in + t].enqueue(r2) : e[e.length - 1].enqueue(r2) : e[0].enqueue(r2);
  }
  function lr(e) {
    let t = [];
    for (let r2 = 0; r2 < e; r2++) t.push(r2);
    return t;
  }
});
var _ = v((Bi, ce) => {
  "use strict";
  var se = y().Graph;
  ce.exports = { addBorderNode: vr, addDummyNode: ae, applyWithChunking: C, asNonCompoundGraph: hr, buildLayerMatrix: mr, intersectRect: pr, mapValues: Or, maxRank: le, normalizeRanks: wr, notime: kr, partition: Er, pick: xr, predecessorWeights: fr, range: he, removeEmptyRanks: br, simplify: ur, successorWeights: cr, time: _r, uniqueId: ue, zipObject: D };
  function ae(e, t, r2, n) {
    for (var i = n; e.hasNode(i); ) i = ue(n);
    return r2.dummy = t, e.setNode(i, r2), i;
  }
  function ur(e) {
    let t = new se().setGraph(e.graph());
    return e.nodes().forEach((r2) => t.setNode(r2, e.node(r2))), e.edges().forEach((r2) => {
      let n = t.edge(r2.v, r2.w) || { weight: 0, minlen: 1 }, i = e.edge(r2);
      t.setEdge(r2.v, r2.w, { weight: n.weight + i.weight, minlen: Math.max(n.minlen, i.minlen) });
    }), t;
  }
  function hr(e) {
    let t = new se({ multigraph: e.isMultigraph() }).setGraph(e.graph());
    return e.nodes().forEach((r2) => {
      e.children(r2).length || t.setNode(r2, e.node(r2));
    }), e.edges().forEach((r2) => {
      t.setEdge(r2, e.edge(r2));
    }), t;
  }
  function cr(e) {
    let t = e.nodes().map((r2) => {
      let n = {};
      return e.outEdges(r2).forEach((i) => {
        n[i.w] = (n[i.w] || 0) + e.edge(i).weight;
      }), n;
    });
    return D(e.nodes(), t);
  }
  function fr(e) {
    let t = e.nodes().map((r2) => {
      let n = {};
      return e.inEdges(r2).forEach((i) => {
        n[i.v] = (n[i.v] || 0) + e.edge(i).weight;
      }), n;
    });
    return D(e.nodes(), t);
  }
  function pr(e, t) {
    let r2 = e.x, n = e.y, i = t.x - r2, o = t.y - n, s = e.width / 2, a = e.height / 2;
    if (!i && !o) throw new Error("Not possible to find intersection inside of the rectangle");
    let l, u;
    return Math.abs(o) * s > Math.abs(i) * a ? (o < 0 && (a = -a), l = a * i / o, u = a) : (i < 0 && (s = -s), l = s, u = s * o / i), { x: r2 + l, y: n + u };
  }
  function mr(e) {
    let t = he(le(e) + 1).map(() => []);
    return e.nodes().forEach((r2) => {
      let n = e.node(r2), i = n.rank;
      i !== void 0 && (t[i][n.order] = r2);
    }), t;
  }
  function wr(e) {
    let t = e.nodes().map((n) => {
      let i = e.node(n).rank;
      return i === void 0 ? Number.MAX_VALUE : i;
    }), r2 = C(Math.min, t);
    e.nodes().forEach((n) => {
      let i = e.node(n);
      Object.hasOwn(i, "rank") && (i.rank -= r2);
    });
  }
  function br(e) {
    let t = e.nodes().map((s) => e.node(s).rank).filter((s) => s !== void 0), r2 = C(Math.min, t), n = [];
    e.nodes().forEach((s) => {
      let a = e.node(s).rank - r2;
      n[a] || (n[a] = []), n[a].push(s);
    });
    let i = 0, o = e.graph().nodeRankFactor;
    Array.from(n).forEach((s, a) => {
      s === void 0 && a % o !== 0 ? --i : s !== void 0 && i && s.forEach((l) => e.node(l).rank += i);
    });
  }
  function vr(e, t, r2, n) {
    let i = { width: 0, height: 0 };
    return arguments.length >= 4 && (i.rank = r2, i.order = n), ae(e, "border", i, t);
  }
  function gr(e, t = de) {
    let r2 = [];
    for (let n = 0; n < e.length; n += t) {
      let i = e.slice(n, n + t);
      r2.push(i);
    }
    return r2;
  }
  var de = 65535;
  function C(e, t) {
    if (t.length > de) {
      let r2 = gr(t);
      return e.apply(null, r2.map((n) => e.apply(null, n)));
    } else return e.apply(null, t);
  }
  function le(e) {
    let r2 = e.nodes().map((n) => {
      let i = e.node(n).rank;
      return i === void 0 ? Number.MIN_VALUE : i;
    });
    return C(Math.max, r2);
  }
  function Er(e, t) {
    let r2 = { lhs: [], rhs: [] };
    return e.forEach((n) => {
      t(n) ? r2.lhs.push(n) : r2.rhs.push(n);
    }), r2;
  }
  function _r(e, t) {
    let r2 = Date.now();
    try {
      return t();
    } finally {
      console.log(e + " time: " + (Date.now() - r2) + "ms");
    }
  }
  function kr(e, t) {
    return t();
  }
  var yr = 0;
  function ue(e) {
    var t = ++yr;
    return e + ("" + t);
  }
  function he(e, t, r2 = 1) {
    t == null && (t = e, e = 0);
    let n = (o) => o < t;
    r2 < 0 && (n = (o) => t < o);
    let i = [];
    for (let o = e; n(o); o += r2) i.push(o);
    return i;
  }
  function xr(e, t) {
    let r2 = {};
    for (let n of t) e[n] !== void 0 && (r2[n] = e[n]);
    return r2;
  }
  function Or(e, t) {
    let r2 = t;
    return typeof t == "string" && (r2 = (n) => n[t]), Object.entries(e).reduce((n, [i, o]) => (n[i] = r2(o, i), n), {});
  }
  function D(e, t) {
    return e.reduce((r2, n, i) => (r2[n] = t[i], r2), {});
  }
});
var pe = v((Wi, fe) => {
  "use strict";
  var Nr = oe(), Ir = _().uniqueId;
  fe.exports = { run: jr, undo: Lr };
  function jr(e) {
    (e.graph().acyclicer === "greedy" ? Nr(e, r2(e)) : Cr(e)).forEach((n) => {
      let i = e.edge(n);
      e.removeEdge(n), i.forwardName = n.name, i.reversed = true, e.setEdge(n.w, n.v, i, Ir("rev"));
    });
    function r2(n) {
      return (i) => n.edge(i).weight;
    }
  }
  function Cr(e) {
    let t = [], r2 = {}, n = {};
    function i(o) {
      Object.hasOwn(n, o) || (n[o] = true, r2[o] = true, e.outEdges(o).forEach((s) => {
        Object.hasOwn(r2, s.w) ? t.push(s) : i(s.w);
      }), delete r2[o]);
    }
    return e.nodes().forEach(i), t;
  }
  function Lr(e) {
    e.edges().forEach((t) => {
      let r2 = e.edge(t);
      if (r2.reversed) {
        e.removeEdge(t);
        let n = r2.forwardName;
        delete r2.reversed, delete r2.forwardName, e.setEdge(t.w, t.v, r2, n);
      }
    });
  }
});
var we = v((zi, me) => {
  "use strict";
  var qr = _();
  me.exports = { run: Mr, undo: Tr };
  function Mr(e) {
    e.graph().dummyChains = [], e.edges().forEach((t) => Rr(e, t));
  }
  function Rr(e, t) {
    let r2 = t.v, n = e.node(r2).rank, i = t.w, o = e.node(i).rank, s = t.name, a = e.edge(t), l = a.labelRank;
    if (o === n + 1) return;
    e.removeEdge(t);
    let u, c, d;
    for (d = 0, ++n; n < o; ++d, ++n) a.points = [], c = { width: 0, height: 0, edgeLabel: a, edgeObj: t, rank: n }, u = qr.addDummyNode(e, "edge", c, "_d"), n === l && (c.width = a.width, c.height = a.height, c.dummy = "edge-label", c.labelpos = a.labelpos), e.setEdge(r2, u, { weight: a.weight }, s), d === 0 && e.graph().dummyChains.push(u), r2 = u;
    e.setEdge(r2, i, { weight: a.weight }, s);
  }
  function Tr(e) {
    e.graph().dummyChains.forEach((t) => {
      let r2 = e.node(t), n = r2.edgeLabel, i;
      for (e.setEdge(r2.edgeObj, n); r2.dummy; ) i = e.successors(t)[0], e.removeNode(t), n.points.push({ x: r2.x, y: r2.y }), r2.dummy === "edge-label" && (n.x = r2.x, n.y = r2.y, n.width = r2.width, n.height = r2.height), t = i, r2 = e.node(t);
    });
  }
});
var j = v((Xi, be) => {
  "use strict";
  var { applyWithChunking: Sr } = _();
  be.exports = { longestPath: Pr, slack: Fr };
  function Pr(e) {
    var t = {};
    function r2(n) {
      var i = e.node(n);
      if (Object.hasOwn(t, n)) return i.rank;
      t[n] = true;
      let o = e.outEdges(n).map((a) => a == null ? Number.POSITIVE_INFINITY : r2(a.w) - e.edge(a).minlen);
      var s = Sr(Math.min, o);
      return s === Number.POSITIVE_INFINITY && (s = 0), i.rank = s;
    }
    e.sources().forEach(r2);
  }
  function Fr(e, t) {
    return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
  }
});
var G = v((Hi, ve) => {
  "use strict";
  var Dr = y().Graph, L = j().slack;
  ve.exports = Gr;
  function Gr(e) {
    var t = new Dr({ directed: false }), r2 = e.nodes()[0], n = e.nodeCount();
    t.setNode(r2, {});
    for (var i, o; Vr(t, e) < n; ) i = Ar(t, e), o = t.hasNode(i.v) ? L(e, i) : -L(e, i), Yr(t, e, o);
    return t;
  }
  function Vr(e, t) {
    function r2(n) {
      t.nodeEdges(n).forEach((i) => {
        var o = i.v, s = n === o ? i.w : o;
        !e.hasNode(s) && !L(t, i) && (e.setNode(s, {}), e.setEdge(n, s, {}), r2(s));
      });
    }
    return e.nodes().forEach(r2), e.nodeCount();
  }
  function Ar(e, t) {
    return t.edges().reduce((n, i) => {
      let o = Number.POSITIVE_INFINITY;
      return e.hasNode(i.v) !== e.hasNode(i.w) && (o = L(t, i)), o < n[0] ? [o, i] : n;
    }, [Number.POSITIVE_INFINITY, null])[1];
  }
  function Yr(e, t, r2) {
    e.nodes().forEach((n) => t.node(n).rank += r2);
  }
});
var Ie = v((Ui, Ne) => {
  "use strict";
  var Br = G(), ge = j().slack, Wr = j().longestPath, zr = y().alg.preorder, Xr = y().alg.postorder, Hr = _().simplify;
  Ne.exports = N;
  N.initLowLimValues = A;
  N.initCutValues = V;
  N.calcCutValue = _e;
  N.leaveEdge = ye;
  N.enterEdge = xe;
  N.exchangeEdges = Oe;
  function N(e) {
    e = Hr(e), Wr(e);
    var t = Br(e);
    A(t), V(t, e);
    for (var r2, n; r2 = ye(t); ) n = xe(t, e, r2), Oe(t, e, r2, n);
  }
  function V(e, t) {
    var r2 = Xr(e, e.nodes());
    r2 = r2.slice(0, r2.length - 1), r2.forEach((n) => Ur(e, t, n));
  }
  function Ur(e, t, r2) {
    var n = e.node(r2), i = n.parent;
    e.edge(r2, i).cutvalue = _e(e, t, r2);
  }
  function _e(e, t, r2) {
    var n = e.node(r2), i = n.parent, o = true, s = t.edge(r2, i), a = 0;
    return s || (o = false, s = t.edge(i, r2)), a = s.weight, t.nodeEdges(r2).forEach((l) => {
      var u = l.v === r2, c = u ? l.w : l.v;
      if (c !== i) {
        var d = u === o, h = t.edge(l).weight;
        if (a += d ? h : -h, Qr(e, r2, c)) {
          var f = e.edge(r2, c).cutvalue;
          a += d ? -f : f;
        }
      }
    }), a;
  }
  function A(e, t) {
    arguments.length < 2 && (t = e.nodes()[0]), ke(e, {}, 1, t);
  }
  function ke(e, t, r2, n, i) {
    var o = r2, s = e.node(n);
    return t[n] = true, e.neighbors(n).forEach((a) => {
      Object.hasOwn(t, a) || (r2 = ke(e, t, r2, a, n));
    }), s.low = o, s.lim = r2++, i ? s.parent = i : delete s.parent, r2;
  }
  function ye(e) {
    return e.edges().find((t) => e.edge(t).cutvalue < 0);
  }
  function xe(e, t, r2) {
    var n = r2.v, i = r2.w;
    t.hasEdge(n, i) || (n = r2.w, i = r2.v);
    var o = e.node(n), s = e.node(i), a = o, l = false;
    o.lim > s.lim && (a = s, l = true);
    var u = t.edges().filter((c) => l === Ee(e, e.node(c.v), a) && l !== Ee(e, e.node(c.w), a));
    return u.reduce((c, d) => ge(t, d) < ge(t, c) ? d : c);
  }
  function Oe(e, t, r2, n) {
    var i = r2.v, o = r2.w;
    e.removeEdge(i, o), e.setEdge(n.v, n.w, {}), A(e), V(e, t), Kr(e, t);
  }
  function Kr(e, t) {
    var r2 = e.nodes().find((i) => !t.node(i).parent), n = zr(e, r2);
    n = n.slice(1), n.forEach((i) => {
      var o = e.node(i).parent, s = t.edge(i, o), a = false;
      s || (s = t.edge(o, i), a = true), t.node(i).rank = t.node(o).rank + (a ? s.minlen : -s.minlen);
    });
  }
  function Qr(e, t, r2) {
    return e.hasEdge(t, r2);
  }
  function Ee(e, t, r2) {
    return r2.low <= t.lim && t.lim <= r2.lim;
  }
});
var qe = v((Ki, Le) => {
  "use strict";
  var Jr = j(), Ce = Jr.longestPath, Zr = G(), $r = Ie();
  Le.exports = en;
  function en(e) {
    var t = e.graph().ranker;
    if (t instanceof Function) return t(e);
    switch (e.graph().ranker) {
      case "network-simplex":
        je(e);
        break;
      case "tight-tree":
        rn(e);
        break;
      case "longest-path":
        tn(e);
        break;
      case "none":
        break;
      default:
        je(e);
    }
  }
  var tn = Ce;
  function rn(e) {
    Ce(e), Zr(e);
  }
  function je(e) {
    $r(e);
  }
});
var Re = v((Qi, Me) => {
  Me.exports = nn;
  function nn(e) {
    let t = sn(e);
    e.graph().dummyChains.forEach((r2) => {
      let n = e.node(r2), i = n.edgeObj, o = on2(e, t, i.v, i.w), s = o.path, a = o.lca, l = 0, u = s[l], c = true;
      for (; r2 !== i.w; ) {
        if (n = e.node(r2), c) {
          for (; (u = s[l]) !== a && e.node(u).maxRank < n.rank; ) l++;
          u === a && (c = false);
        }
        if (!c) {
          for (; l < s.length - 1 && e.node(u = s[l + 1]).minRank <= n.rank; ) l++;
          u = s[l];
        }
        e.setParent(r2, u), r2 = e.successors(r2)[0];
      }
    });
  }
  function on2(e, t, r2, n) {
    let i = [], o = [], s = Math.min(t[r2].low, t[n].low), a = Math.max(t[r2].lim, t[n].lim), l, u;
    l = r2;
    do
      l = e.parent(l), i.push(l);
    while (l && (t[l].low > s || a > t[l].lim));
    for (u = l, l = n; (l = e.parent(l)) !== u; ) o.push(l);
    return { path: i.concat(o.reverse()), lca: u };
  }
  function sn(e) {
    let t = {}, r2 = 0;
    function n(i) {
      let o = r2;
      e.children(i).forEach(n), t[i] = { low: o, lim: r2++ };
    }
    return e.children().forEach(n), t;
  }
});
var Pe = v((Ji, Se) => {
  var q = _();
  Se.exports = { run: an, cleanup: un };
  function an(e) {
    let t = q.addDummyNode(e, "root", {}, "_root"), r2 = dn(e), n = Object.values(r2), i = q.applyWithChunking(Math.max, n) - 1, o = 2 * i + 1;
    e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= o);
    let s = ln(e) + 1;
    e.children().forEach((a) => Te(e, t, o, s, i, r2, a)), e.graph().nodeRankFactor = o;
  }
  function Te(e, t, r2, n, i, o, s) {
    let a = e.children(s);
    if (!a.length) {
      s !== t && e.setEdge(t, s, { weight: 0, minlen: r2 });
      return;
    }
    let l = q.addBorderNode(e, "_bt"), u = q.addBorderNode(e, "_bb"), c = e.node(s);
    e.setParent(l, s), c.borderTop = l, e.setParent(u, s), c.borderBottom = u, a.forEach((d) => {
      Te(e, t, r2, n, i, o, d);
      let h = e.node(d), f = h.borderTop ? h.borderTop : d, m = h.borderBottom ? h.borderBottom : d, p = h.borderTop ? n : 2 * n, w = f !== m ? 1 : i - o[s] + 1;
      e.setEdge(l, f, { weight: p, minlen: w, nestingEdge: true }), e.setEdge(m, u, { weight: p, minlen: w, nestingEdge: true });
    }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: i + o[s] });
  }
  function dn(e) {
    var t = {};
    function r2(n, i) {
      var o = e.children(n);
      o && o.length && o.forEach((s) => r2(s, i + 1)), t[n] = i;
    }
    return e.children().forEach((n) => r2(n, 1)), t;
  }
  function ln(e) {
    return e.edges().reduce((t, r2) => t + e.edge(r2).weight, 0);
  }
  function un(e) {
    var t = e.graph();
    e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((r2) => {
      var n = e.edge(r2);
      n.nestingEdge && e.removeEdge(r2);
    });
  }
});
var Ge = v((Zi, De) => {
  var hn = _();
  De.exports = cn;
  function cn(e) {
    function t(r2) {
      let n = e.children(r2), i = e.node(r2);
      if (n.length && n.forEach(t), Object.hasOwn(i, "minRank")) {
        i.borderLeft = [], i.borderRight = [];
        for (let o = i.minRank, s = i.maxRank + 1; o < s; ++o) Fe(e, "borderLeft", "_bl", r2, i, o), Fe(e, "borderRight", "_br", r2, i, o);
      }
    }
    e.children().forEach(t);
  }
  function Fe(e, t, r2, n, i, o) {
    let s = { width: 0, height: 0, rank: o, borderType: t }, a = i[t][o - 1], l = hn.addDummyNode(e, "border", s, r2);
    i[t][o] = l, e.setParent(l, n), a && e.setEdge(a, l, { weight: 1 });
  }
});
var Be = v(($i, Ye) => {
  "use strict";
  Ye.exports = { adjust: fn, undo: pn };
  function fn(e) {
    let t = e.graph().rankdir.toLowerCase();
    (t === "lr" || t === "rl") && Ae(e);
  }
  function pn(e) {
    let t = e.graph().rankdir.toLowerCase();
    (t === "bt" || t === "rl") && mn(e), (t === "lr" || t === "rl") && (wn(e), Ae(e));
  }
  function Ae(e) {
    e.nodes().forEach((t) => Ve(e.node(t))), e.edges().forEach((t) => Ve(e.edge(t)));
  }
  function Ve(e) {
    let t = e.width;
    e.width = e.height, e.height = t;
  }
  function mn(e) {
    e.nodes().forEach((t) => Y(e.node(t))), e.edges().forEach((t) => {
      let r2 = e.edge(t);
      r2.points.forEach(Y), Object.hasOwn(r2, "y") && Y(r2);
    });
  }
  function Y(e) {
    e.y = -e.y;
  }
  function wn(e) {
    e.nodes().forEach((t) => B(e.node(t))), e.edges().forEach((t) => {
      let r2 = e.edge(t);
      r2.points.forEach(B), Object.hasOwn(r2, "x") && B(r2);
    });
  }
  function B(e) {
    let t = e.x;
    e.x = e.y, e.y = t;
  }
});
var Xe = v((eo, ze) => {
  "use strict";
  var We = _();
  ze.exports = bn;
  function bn(e) {
    let t = {}, r2 = e.nodes().filter((l) => !e.children(l).length), n = r2.map((l) => e.node(l).rank), i = We.applyWithChunking(Math.max, n), o = We.range(i + 1).map(() => []);
    function s(l) {
      if (t[l]) return;
      t[l] = true;
      let u = e.node(l);
      o[u.rank].push(l), e.successors(l).forEach(s);
    }
    return r2.sort((l, u) => e.node(l).rank - e.node(u).rank).forEach(s), o;
  }
});
var Ue = v((to, He) => {
  "use strict";
  var vn = _().zipObject;
  He.exports = gn;
  function gn(e, t) {
    let r2 = 0;
    for (let n = 1; n < t.length; ++n) r2 += En(e, t[n - 1], t[n]);
    return r2;
  }
  function En(e, t, r2) {
    let n = vn(r2, r2.map((u, c) => c)), i = t.flatMap((u) => e.outEdges(u).map((c) => ({ pos: n[c.w], weight: e.edge(c).weight })).sort((c, d) => c.pos - d.pos)), o = 1;
    for (; o < r2.length; ) o <<= 1;
    let s = 2 * o - 1;
    o -= 1;
    let a = new Array(s).fill(0), l = 0;
    return i.forEach((u) => {
      let c = u.pos + o;
      a[c] += u.weight;
      let d = 0;
      for (; c > 0; ) c % 2 && (d += a[c + 1]), c = c - 1 >> 1, a[c] += u.weight;
      l += u.weight * d;
    }), l;
  }
});
var Qe = v((ro, Ke) => {
  Ke.exports = _n;
  function _n(e, t = []) {
    return t.map((r2) => {
      let n = e.inEdges(r2);
      if (n.length) {
        let i = n.reduce((o, s) => {
          let a = e.edge(s), l = e.node(s.v);
          return { sum: o.sum + a.weight * l.order, weight: o.weight + a.weight };
        }, { sum: 0, weight: 0 });
        return { v: r2, barycenter: i.sum / i.weight, weight: i.weight };
      } else return { v: r2 };
    });
  }
});
var Ze = v((no, Je) => {
  "use strict";
  var kn = _();
  Je.exports = yn;
  function yn(e, t) {
    let r2 = {};
    e.forEach((i, o) => {
      let s = r2[i.v] = { indegree: 0, in: [], out: [], vs: [i.v], i: o };
      i.barycenter !== void 0 && (s.barycenter = i.barycenter, s.weight = i.weight);
    }), t.edges().forEach((i) => {
      let o = r2[i.v], s = r2[i.w];
      o !== void 0 && s !== void 0 && (s.indegree++, o.out.push(r2[i.w]));
    });
    let n = Object.values(r2).filter((i) => !i.indegree);
    return xn(n);
  }
  function xn(e) {
    let t = [];
    function r2(i) {
      return (o) => {
        o.merged || (o.barycenter === void 0 || i.barycenter === void 0 || o.barycenter >= i.barycenter) && On(i, o);
      };
    }
    function n(i) {
      return (o) => {
        o.in.push(i), --o.indegree === 0 && e.push(o);
      };
    }
    for (; e.length; ) {
      let i = e.pop();
      t.push(i), i.in.reverse().forEach(r2(i)), i.out.forEach(n(i));
    }
    return t.filter((i) => !i.merged).map((i) => kn.pick(i, ["vs", "i", "barycenter", "weight"]));
  }
  function On(e, t) {
    let r2 = 0, n = 0;
    e.weight && (r2 += e.barycenter * e.weight, n += e.weight), t.weight && (r2 += t.barycenter * t.weight, n += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = r2 / n, e.weight = n, e.i = Math.min(t.i, e.i), t.merged = true;
  }
});
var tt = v((io, et) => {
  var Nn = _();
  et.exports = In;
  function In(e, t) {
    let r2 = Nn.partition(e, (c) => Object.hasOwn(c, "barycenter")), n = r2.lhs, i = r2.rhs.sort((c, d) => d.i - c.i), o = [], s = 0, a = 0, l = 0;
    n.sort(jn(!!t)), l = $e(o, i, l), n.forEach((c) => {
      l += c.vs.length, o.push(c.vs), s += c.barycenter * c.weight, a += c.weight, l = $e(o, i, l);
    });
    let u = { vs: o.flat(true) };
    return a && (u.barycenter = s / a, u.weight = a), u;
  }
  function $e(e, t, r2) {
    let n;
    for (; t.length && (n = t[t.length - 1]).i <= r2; ) t.pop(), e.push(n.vs), r2++;
    return r2;
  }
  function jn(e) {
    return (t, r2) => t.barycenter < r2.barycenter ? -1 : t.barycenter > r2.barycenter ? 1 : e ? r2.i - t.i : t.i - r2.i;
  }
});
var it = v((oo, nt) => {
  var Cn = Qe(), Ln = Ze(), qn = tt();
  nt.exports = rt;
  function rt(e, t, r2, n) {
    let i = e.children(t), o = e.node(t), s = o ? o.borderLeft : void 0, a = o ? o.borderRight : void 0, l = {};
    s && (i = i.filter((h) => h !== s && h !== a));
    let u = Cn(e, i);
    u.forEach((h) => {
      if (e.children(h.v).length) {
        let f = rt(e, h.v, r2, n);
        l[h.v] = f, Object.hasOwn(f, "barycenter") && Rn(h, f);
      }
    });
    let c = Ln(u, r2);
    Mn(c, l);
    let d = qn(c, n);
    if (s && (d.vs = [s, d.vs, a].flat(true), e.predecessors(s).length)) {
      let h = e.node(e.predecessors(s)[0]), f = e.node(e.predecessors(a)[0]);
      Object.hasOwn(d, "barycenter") || (d.barycenter = 0, d.weight = 0), d.barycenter = (d.barycenter * d.weight + h.order + f.order) / (d.weight + 2), d.weight += 2;
    }
    return d;
  }
  function Mn(e, t) {
    e.forEach((r2) => {
      r2.vs = r2.vs.flatMap((n) => t[n] ? t[n].vs : n);
    });
  }
  function Rn(e, t) {
    e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
  }
});
var st = v((so, ot) => {
  var Tn = y().Graph, Sn = _();
  ot.exports = Pn;
  function Pn(e, t, r2, n) {
    n || (n = e.nodes());
    let i = Fn(e), o = new Tn({ compound: true }).setGraph({ root: i }).setDefaultNodeLabel((s) => e.node(s));
    return n.forEach((s) => {
      let a = e.node(s), l = e.parent(s);
      (a.rank === t || a.minRank <= t && t <= a.maxRank) && (o.setNode(s), o.setParent(s, l || i), e[r2](s).forEach((u) => {
        let c = u.v === s ? u.w : u.v, d = o.edge(c, s), h = d !== void 0 ? d.weight : 0;
        o.setEdge(c, s, { weight: e.edge(u).weight + h });
      }), Object.hasOwn(a, "minRank") && o.setNode(s, { borderLeft: a.borderLeft[t], borderRight: a.borderRight[t] }));
    }), o;
  }
  function Fn(e) {
    for (var t; e.hasNode(t = Sn.uniqueId("_root")); ) ;
    return t;
  }
});
var dt = v((ao, at) => {
  at.exports = Dn;
  function Dn(e, t, r2) {
    let n = {}, i;
    r2.forEach((o) => {
      let s = e.parent(o), a, l;
      for (; s; ) {
        if (a = e.parent(s), a ? (l = n[a], n[a] = s) : (l = i, i = s), l && l !== s) {
          t.setEdge(l, s);
          return;
        }
        s = a;
      }
    });
  }
});
var ft = v((lo, ct) => {
  "use strict";
  var Gn = Xe(), Vn = Ue(), An = it(), Yn = st(), Bn = dt(), Wn = y().Graph, M = _();
  ct.exports = ht;
  function ht(e, t = {}) {
    if (typeof t.customOrder == "function") {
      t.customOrder(e, ht);
      return;
    }
    let r2 = M.maxRank(e), n = lt(e, M.range(1, r2 + 1), "inEdges"), i = lt(e, M.range(r2 - 1, -1, -1), "outEdges"), o = Gn(e);
    if (ut(e, o), t.disableOptimalOrderHeuristic) return;
    let s = Number.POSITIVE_INFINITY, a, l = t.constraints || [];
    for (let u = 0, c = 0; c < 4; ++u, ++c) {
      zn(u % 2 ? n : i, u % 4 >= 2, l), o = M.buildLayerMatrix(e);
      let d = Vn(e, o);
      d < s ? (c = 0, a = Object.assign({}, o), s = d) : d === s && (a = structuredClone(o));
    }
    ut(e, a);
  }
  function lt(e, t, r2) {
    let n = /* @__PURE__ */ new Map(), i = (o, s) => {
      n.has(o) || n.set(o, []), n.get(o).push(s);
    };
    for (let o of e.nodes()) {
      let s = e.node(o);
      if (typeof s.rank == "number" && i(s.rank, o), typeof s.minRank == "number" && typeof s.maxRank == "number") for (let a = s.minRank; a <= s.maxRank; a++) a !== s.rank && i(a, o);
    }
    return t.map(function(o) {
      return Yn(e, o, r2, n.get(o) || []);
    });
  }
  function zn(e, t, r2) {
    let n = new Wn();
    e.forEach(function(i) {
      r2.forEach((a) => n.setEdge(a.left, a.right));
      let o = i.graph().root, s = An(i, o, n, t);
      s.vs.forEach((a, l) => i.node(a).order = l), Bn(i, n, s.vs);
    });
  }
  function ut(e, t) {
    Object.values(t).forEach((r2) => r2.forEach((n, i) => e.node(n).order = i));
  }
});
var yt = v((uo, kt) => {
  "use strict";
  var Xn = y().Graph, O = _();
  kt.exports = { positionX: Kn, findType1Conflicts: pt, findType2Conflicts: mt, addConflict: W, hasConflict: wt, verticalAlignment: bt, horizontalCompaction: vt, alignCoordinates: Et, findSmallestWidthAlignment: gt, balance: _t };
  function pt(e, t) {
    let r2 = {};
    function n(i, o) {
      let s = 0, a = 0, l = i.length, u = o[o.length - 1];
      return o.forEach((c, d) => {
        let h = Hn(e, c), f = h ? e.node(h).order : l;
        (h || c === u) && (o.slice(a, d + 1).forEach((m) => {
          e.predecessors(m).forEach((p) => {
            let w = e.node(p), b = w.order;
            (b < s || f < b) && !(w.dummy && e.node(m).dummy) && W(r2, p, m);
          });
        }), a = d + 1, s = f);
      }), o;
    }
    return t.length && t.reduce(n), r2;
  }
  function mt(e, t) {
    let r2 = {};
    function n(o, s, a, l, u) {
      let c;
      O.range(s, a).forEach((d) => {
        c = o[d], e.node(c).dummy && e.predecessors(c).forEach((h) => {
          let f = e.node(h);
          f.dummy && (f.order < l || f.order > u) && W(r2, h, c);
        });
      });
    }
    function i(o, s) {
      let a = -1, l, u = 0;
      return s.forEach((c, d) => {
        if (e.node(c).dummy === "border") {
          let h = e.predecessors(c);
          h.length && (l = e.node(h[0]).order, n(s, u, d, a, l), u = d, a = l);
        }
        n(s, u, s.length, l, o.length);
      }), s;
    }
    return t.length && t.reduce(i), r2;
  }
  function Hn(e, t) {
    if (e.node(t).dummy) return e.predecessors(t).find((r2) => e.node(r2).dummy);
  }
  function W(e, t, r2) {
    if (t > r2) {
      let i = t;
      t = r2, r2 = i;
    }
    let n = e[t];
    n || (e[t] = n = {}), n[r2] = true;
  }
  function wt(e, t, r2) {
    if (t > r2) {
      let n = t;
      t = r2, r2 = n;
    }
    return !!e[t] && Object.hasOwn(e[t], r2);
  }
  function bt(e, t, r2, n) {
    let i = {}, o = {}, s = {};
    return t.forEach((a) => {
      a.forEach((l, u) => {
        i[l] = l, o[l] = l, s[l] = u;
      });
    }), t.forEach((a) => {
      let l = -1;
      a.forEach((u) => {
        let c = n(u);
        if (c.length) {
          c = c.sort((h, f) => s[h] - s[f]);
          let d = (c.length - 1) / 2;
          for (let h = Math.floor(d), f = Math.ceil(d); h <= f; ++h) {
            let m = c[h];
            o[u] === u && l < s[m] && !wt(r2, u, m) && (o[m] = u, o[u] = i[u] = i[m], l = s[m]);
          }
        }
      });
    }), { root: i, align: o };
  }
  function vt(e, t, r2, n, i) {
    let o = {}, s = Un(e, t, r2, i), a = i ? "borderLeft" : "borderRight";
    function l(d, h) {
      let f = s.nodes().slice(), m = {}, p = f.pop();
      for (; p; ) {
        if (m[p]) d(p);
        else {
          m[p] = true, f.push(p);
          for (let w of h(p)) f.push(w);
        }
        p = f.pop();
      }
    }
    function u(d) {
      o[d] = s.inEdges(d).reduce((h, f) => Math.max(h, o[f.v] + s.edge(f)), 0);
    }
    function c(d) {
      let h = s.outEdges(d).reduce((m, p) => Math.min(m, o[p.w] - s.edge(p)), Number.POSITIVE_INFINITY), f = e.node(d);
      h !== Number.POSITIVE_INFINITY && f.borderType !== a && (o[d] = Math.max(o[d], h));
    }
    return l(u, s.predecessors.bind(s)), l(c, s.successors.bind(s)), Object.keys(n).forEach((d) => o[d] = o[r2[d]]), o;
  }
  function Un(e, t, r2, n) {
    let i = new Xn(), o = e.graph(), s = Qn(o.nodesep, o.edgesep, n);
    return t.forEach((a) => {
      let l;
      a.forEach((u) => {
        let c = r2[u];
        if (i.setNode(c), l) {
          var d = r2[l], h = i.edge(d, c);
          i.setEdge(d, c, Math.max(s(e, u, l), h || 0));
        }
        l = u;
      });
    }), i;
  }
  function gt(e, t) {
    return Object.values(t).reduce((r2, n) => {
      let i = Number.NEGATIVE_INFINITY, o = Number.POSITIVE_INFINITY;
      Object.entries(n).forEach(([a, l]) => {
        let u = Jn(e, a) / 2;
        i = Math.max(l + u, i), o = Math.min(l - u, o);
      });
      let s = i - o;
      return s < r2[0] && (r2 = [s, n]), r2;
    }, [Number.POSITIVE_INFINITY, null])[1];
  }
  function Et(e, t) {
    let r2 = Object.values(t), n = O.applyWithChunking(Math.min, r2), i = O.applyWithChunking(Math.max, r2);
    ["u", "d"].forEach((o) => {
      ["l", "r"].forEach((s) => {
        let a = o + s, l = e[a];
        if (l === t) return;
        let u = Object.values(l), c = n - O.applyWithChunking(Math.min, u);
        s !== "l" && (c = i - O.applyWithChunking(Math.max, u)), c && (e[a] = O.mapValues(l, (d) => d + c));
      });
    });
  }
  function _t(e, t) {
    return O.mapValues(e.ul, (r2, n) => {
      if (t) return e[t.toLowerCase()][n];
      {
        let i = Object.values(e).map((o) => o[n]).sort((o, s) => o - s);
        return (i[1] + i[2]) / 2;
      }
    });
  }
  function Kn(e) {
    let t = O.buildLayerMatrix(e), r2 = Object.assign(pt(e, t), mt(e, t)), n = {}, i;
    ["u", "d"].forEach((s) => {
      i = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
        a === "r" && (i = i.map((d) => Object.values(d).reverse()));
        let l = (s === "u" ? e.predecessors : e.successors).bind(e), u = bt(e, i, r2, l), c = vt(e, i, u.root, u.align, a === "r");
        a === "r" && (c = O.mapValues(c, (d) => -d)), n[s + a] = c;
      });
    });
    let o = gt(e, n);
    return Et(n, o), _t(n, e.graph().align);
  }
  function Qn(e, t, r2) {
    return (n, i, o) => {
      let s = n.node(i), a = n.node(o), l = 0, u;
      if (l += s.width / 2, Object.hasOwn(s, "labelpos")) switch (s.labelpos.toLowerCase()) {
        case "l":
          u = -s.width / 2;
          break;
        case "r":
          u = s.width / 2;
          break;
      }
      if (u && (l += r2 ? u : -u), u = 0, l += (s.dummy ? t : e) / 2, l += (a.dummy ? t : e) / 2, l += a.width / 2, Object.hasOwn(a, "labelpos")) switch (a.labelpos.toLowerCase()) {
        case "l":
          u = a.width / 2;
          break;
        case "r":
          u = -a.width / 2;
          break;
      }
      return u && (l += r2 ? u : -u), u = 0, l;
    };
  }
  function Jn(e, t) {
    return e.node(t).width;
  }
});
var Nt = v((ho, Ot) => {
  "use strict";
  var xt = _(), Zn = yt().positionX;
  Ot.exports = $n;
  function $n(e) {
    e = xt.asNonCompoundGraph(e), ei(e), Object.entries(Zn(e)).forEach(([t, r2]) => e.node(t).x = r2);
  }
  function ei(e) {
    let t = xt.buildLayerMatrix(e), r2 = e.graph().ranksep, n = e.graph().rankalign, i = 0;
    t.forEach((o) => {
      let s = o.reduce((a, l) => {
        let u = e.node(l).height;
        return a > u ? a : u;
      }, 0);
      o.forEach((a) => {
        let l = e.node(a);
        n === "top" ? l.y = i + l.height / 2 : n === "bottom" ? l.y = i + s - l.height / 2 : l.y = i + s / 2;
      }), i += s + r2;
    });
  }
});
var Rt = v((co, Mt) => {
  "use strict";
  var It = pe(), jt = we(), ti = qe(), ri = _().normalizeRanks, ni = Re(), ii = _().removeEmptyRanks, Ct = Pe(), oi = Ge(), Lt = Be(), si = ft(), ai = Nt(), x = _(), di = y().Graph;
  Mt.exports = li;
  function li(e, t = {}) {
    let r2 = t.debugTiming ? x.time : x.notime;
    return r2("layout", () => {
      let n = r2("  buildLayoutGraph", () => gi(e));
      return r2("  runLayout", () => ui(n, r2, t)), r2("  updateInputGraph", () => hi(e, n)), n;
    });
  }
  function ui(e, t, r2) {
    t("    makeSpaceForEdgeLabels", () => Ei(e)), t("    removeSelfEdges", () => Ci(e)), t("    acyclic", () => It.run(e)), t("    nestingGraph.run", () => Ct.run(e)), t("    rank", () => ti(x.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => _i(e)), t("    removeEmptyRanks", () => ii(e)), t("    nestingGraph.cleanup", () => Ct.cleanup(e)), t("    normalizeRanks", () => ri(e)), t("    assignRankMinMax", () => ki(e)), t("    removeEdgeLabelProxies", () => yi(e)), t("    normalize.run", () => jt.run(e)), t("    parentDummyChains", () => ni(e)), t("    addBorderSegments", () => oi(e)), t("    order", () => si(e, r2)), t("    insertSelfEdges", () => Li(e)), t("    adjustCoordinateSystem", () => Lt.adjust(e)), t("    position", () => ai(e)), t("    positionSelfEdges", () => qi(e)), t("    removeBorderNodes", () => ji(e)), t("    normalize.undo", () => jt.undo(e)), t("    fixupEdgeLabelCoords", () => Ni(e)), t("    undoCoordinateSystem", () => Lt.undo(e)), t("    translateGraph", () => xi(e)), t("    assignNodeIntersects", () => Oi(e)), t("    reversePoints", () => Ii(e)), t("    acyclic.undo", () => It.undo(e));
  }
  function hi(e, t) {
    e.nodes().forEach((r2) => {
      let n = e.node(r2), i = t.node(r2);
      n && (n.x = i.x, n.y = i.y, n.order = i.order, n.rank = i.rank, t.children(r2).length && (n.width = i.width, n.height = i.height));
    }), e.edges().forEach((r2) => {
      let n = e.edge(r2), i = t.edge(r2);
      n.points = i.points, Object.hasOwn(i, "x") && (n.x = i.x, n.y = i.y);
    }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
  }
  var ci = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], fi = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb", rankalign: "center" }, pi = ["acyclicer", "ranker", "rankdir", "align", "rankalign"], mi = ["width", "height", "rank"], qt = { width: 0, height: 0 }, wi = ["minlen", "weight", "width", "height", "labeloffset"], bi = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, vi = ["labelpos"];
  function gi(e) {
    let t = new di({ multigraph: true, compound: true }), r2 = X(e.graph());
    return t.setGraph(Object.assign({}, fi, z(r2, ci), x.pick(r2, pi))), e.nodes().forEach((n) => {
      let i = X(e.node(n)), o = z(i, mi);
      Object.keys(qt).forEach((s) => {
        o[s] === void 0 && (o[s] = qt[s]);
      }), t.setNode(n, o), t.setParent(n, e.parent(n));
    }), e.edges().forEach((n) => {
      let i = X(e.edge(n));
      t.setEdge(n, Object.assign({}, bi, z(i, wi), x.pick(i, vi)));
    }), t;
  }
  function Ei(e) {
    let t = e.graph();
    t.ranksep /= 2, e.edges().forEach((r2) => {
      let n = e.edge(r2);
      n.minlen *= 2, n.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? n.width += n.labeloffset : n.height += n.labeloffset);
    });
  }
  function _i(e) {
    e.edges().forEach((t) => {
      let r2 = e.edge(t);
      if (r2.width && r2.height) {
        let n = e.node(t.v), o = { rank: (e.node(t.w).rank - n.rank) / 2 + n.rank, e: t };
        x.addDummyNode(e, "edge-proxy", o, "_ep");
      }
    });
  }
  function ki(e) {
    let t = 0;
    e.nodes().forEach((r2) => {
      let n = e.node(r2);
      n.borderTop && (n.minRank = e.node(n.borderTop).rank, n.maxRank = e.node(n.borderBottom).rank, t = Math.max(t, n.maxRank));
    }), e.graph().maxRank = t;
  }
  function yi(e) {
    e.nodes().forEach((t) => {
      let r2 = e.node(t);
      r2.dummy === "edge-proxy" && (e.edge(r2.e).labelRank = r2.rank, e.removeNode(t));
    });
  }
  function xi(e) {
    let t = Number.POSITIVE_INFINITY, r2 = 0, n = Number.POSITIVE_INFINITY, i = 0, o = e.graph(), s = o.marginx || 0, a = o.marginy || 0;
    function l(u) {
      let c = u.x, d = u.y, h = u.width, f = u.height;
      t = Math.min(t, c - h / 2), r2 = Math.max(r2, c + h / 2), n = Math.min(n, d - f / 2), i = Math.max(i, d + f / 2);
    }
    e.nodes().forEach((u) => l(e.node(u))), e.edges().forEach((u) => {
      let c = e.edge(u);
      Object.hasOwn(c, "x") && l(c);
    }), t -= s, n -= a, e.nodes().forEach((u) => {
      let c = e.node(u);
      c.x -= t, c.y -= n;
    }), e.edges().forEach((u) => {
      let c = e.edge(u);
      c.points.forEach((d) => {
        d.x -= t, d.y -= n;
      }), Object.hasOwn(c, "x") && (c.x -= t), Object.hasOwn(c, "y") && (c.y -= n);
    }), o.width = r2 - t + s, o.height = i - n + a;
  }
  function Oi(e) {
    e.edges().forEach((t) => {
      let r2 = e.edge(t), n = e.node(t.v), i = e.node(t.w), o, s;
      r2.points ? (o = r2.points[0], s = r2.points[r2.points.length - 1]) : (r2.points = [], o = i, s = n), r2.points.unshift(x.intersectRect(n, o)), r2.points.push(x.intersectRect(i, s));
    });
  }
  function Ni(e) {
    e.edges().forEach((t) => {
      let r2 = e.edge(t);
      if (Object.hasOwn(r2, "x")) switch ((r2.labelpos === "l" || r2.labelpos === "r") && (r2.width -= r2.labeloffset), r2.labelpos) {
        case "l":
          r2.x -= r2.width / 2 + r2.labeloffset;
          break;
        case "r":
          r2.x += r2.width / 2 + r2.labeloffset;
          break;
      }
    });
  }
  function Ii(e) {
    e.edges().forEach((t) => {
      let r2 = e.edge(t);
      r2.reversed && r2.points.reverse();
    });
  }
  function ji(e) {
    e.nodes().forEach((t) => {
      if (e.children(t).length) {
        let r2 = e.node(t), n = e.node(r2.borderTop), i = e.node(r2.borderBottom), o = e.node(r2.borderLeft[r2.borderLeft.length - 1]), s = e.node(r2.borderRight[r2.borderRight.length - 1]);
        r2.width = Math.abs(s.x - o.x), r2.height = Math.abs(i.y - n.y), r2.x = o.x + r2.width / 2, r2.y = n.y + r2.height / 2;
      }
    }), e.nodes().forEach((t) => {
      e.node(t).dummy === "border" && e.removeNode(t);
    });
  }
  function Ci(e) {
    e.edges().forEach((t) => {
      if (t.v === t.w) {
        var r2 = e.node(t.v);
        r2.selfEdges || (r2.selfEdges = []), r2.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
      }
    });
  }
  function Li(e) {
    var t = x.buildLayerMatrix(e);
    t.forEach((r2) => {
      var n = 0;
      r2.forEach((i, o) => {
        var s = e.node(i);
        s.order = o + n, (s.selfEdges || []).forEach((a) => {
          x.addDummyNode(e, "selfedge", { width: a.label.width, height: a.label.height, rank: s.rank, order: o + ++n, e: a.e, label: a.label }, "_se");
        }), delete s.selfEdges;
      });
    });
  }
  function qi(e) {
    e.nodes().forEach((t) => {
      var r2 = e.node(t);
      if (r2.dummy === "selfedge") {
        var n = e.node(r2.e.v), i = n.x + n.width / 2, o = n.y, s = r2.x - i, a = n.height / 2;
        e.setEdge(r2.e, r2.label), e.removeNode(t), r2.label.points = [{ x: i + 2 * s / 3, y: o - a }, { x: i + 5 * s / 6, y: o - a }, { x: i + s, y: o }, { x: i + 5 * s / 6, y: o + a }, { x: i + 2 * s / 3, y: o + a }], r2.label.x = r2.x, r2.label.y = r2.y;
      }
    });
  }
  function z(e, t) {
    return x.mapValues(x.pick(e, t), Number);
  }
  function X(e) {
    var t = {};
    return e && Object.entries(e).forEach(([r2, n]) => {
      typeof r2 == "string" && (r2 = r2.toLowerCase()), t[r2] = n;
    }), t;
  }
});
var St = v((fo, Tt) => {
  var Mi = _(), Ri = y().Graph;
  Tt.exports = { debugOrdering: Ti };
  function Ti(e) {
    let t = Mi.buildLayerMatrix(e), r2 = new Ri({ compound: true, multigraph: true }).setGraph({});
    return e.nodes().forEach((n) => {
      r2.setNode(n, { label: n }), r2.setParent(n, "layer" + e.node(n).rank);
    }), e.edges().forEach((n) => r2.setEdge(n.v, n.w, {}, n.name)), t.forEach((n, i) => {
      let o = "layer" + i;
      r2.setNode(o, { rank: "same" }), n.reduce((s, a) => (r2.setEdge(s, a, { style: "invis" }), a));
    }), r2;
  }
});
var Ft = v((po, Pt) => {
  Pt.exports = "2.0.4";
});
var Si = v((mo, Dt) => {
  Dt.exports = { graphlib: y(), layout: Rt(), debug: St(), util: { time: _().time, notime: _().notime }, version: Ft() };
});
var dagre_esm_default = Si();

// svelte/autoLayout.js
var NODE_WIDTH = 180;
var NODE_HEIGHT = 80;
function autoLayout(nodes, edges, direction = "LR") {
  const g = new dagre_esm_default.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });
  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }
  dagre_esm_default.layout(g);
  const layoutNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2
      },
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    };
  });
  return { nodes: layoutNodes, edges };
}

// svelte/DagViewer.svelte
DagViewer[FILENAME] = "svelte/DagViewer.svelte";
var root_114 = add_locations(from_html(`<!> <!> <!>`, 1), DagViewer[FILENAME], []);
var root32 = add_locations(from_html(`<div class="dag-viewer-wrapper svelte-1uuh8kq" role="application"><!></div>`), DagViewer[FILENAME], [[245, 0]]);
var $$css9 = {
  hash: "svelte-1uuh8kq",
  code: "\n  .dag-viewer-wrapper.svelte-1uuh8kq {\n    width: 100%;\n    height: 100%;\n    border-radius: 8px;\n    overflow: hidden;\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow {\n    background:\n      radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.06) 0%, transparent 60%),\n      radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.05) 0%, transparent 50%),\n      radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.9) 0%, transparent 80%),\n      linear-gradient(160deg, #f0f1f8 0%, #e8e9f2 40%, #f2f0f5 100%);\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow.dark {\n    background:\n      radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.10) 0%, transparent 60%),\n      radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.08) 0%, transparent 50%),\n      radial-gradient(ellipse at 50% 50%, rgba(20,20,35,0.5) 0%, transparent 80%),\n      linear-gradient(160deg, #151524 0%, #111120 40%, #17152a 100%);\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow__edge-path {\n    stroke-width: 2;\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow__edge.temp .svelte-flow__edge-path {\n    stroke-dasharray: 5;\n    stroke: #888;\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow__controls {\n    border-radius: 8px;\n    overflow: hidden;\n    box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n    border: 1px solid rgba(0,0,0,0.06);\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow.dark .svelte-flow__controls {\n    border-color: rgba(255,255,255,0.08);\n    box-shadow: 0 2px 8px rgba(0,0,0,0.3);\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow__minimap {\n    border-radius: 8px;\n    overflow: hidden;\n    box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n    border: 1px solid rgba(0,0,0,0.06);\n  }\n  .dag-viewer-wrapper.svelte-1uuh8kq .svelte-flow.dark .svelte-flow__minimap {\n    border-color: rgba(255,255,255,0.08);\n    box-shadow: 0 2px 8px rgba(0,0,0,0.3);\n  }\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGFnVmlld2VyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiRGFnVmlld2VyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyBTdmVsdGVGbG93LCBDb250cm9scywgQmFja2dyb3VuZCwgTWluaU1hcCB9IGZyb20gJ0B4eWZsb3cvc3ZlbHRlJztcbiAgaW1wb3J0IHsgc2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCBTdGVwTm9kZSBmcm9tICcuL1N0ZXBOb2RlLnN2ZWx0ZSc7XG4gIGltcG9ydCBSdW5ib29rTm9kZSBmcm9tICcuL1J1bmJvb2tOb2RlLnN2ZWx0ZSc7XG4gIGltcG9ydCBDb25kaXRpb25hbEVkZ2UgZnJvbSAnLi9Db25kaXRpb25hbEVkZ2Uuc3ZlbHRlJztcbiAgaW1wb3J0IHsgcmVzb2x2ZUNvbGxpc2lvbnMgfSBmcm9tICcuL3Jlc29sdmVDb2xsaXNpb25zLmpzJztcbiAgaW1wb3J0IHsgYXV0b0xheW91dCB9IGZyb20gJy4vYXV0b0xheW91dC5qcyc7XG5cbiAgY29uc3Qgbm9kZVR5cGVzID0geyBzdGVwOiBTdGVwTm9kZSwgcnVuYm9vazogUnVuYm9va05vZGUgfTtcbiAgY29uc3QgZWRnZVR5cGVzID0geyBjb25kaXRpb25hbDogQ29uZGl0aW9uYWxFZGdlIH07XG5cbiAgbGV0IHsgbm9kZXM6IHByb3BOb2RlcyA9IFtdLCBlZGdlczogcHJvcEVkZ2VzID0gW10sIHJlYWRvbmx5ID0gdHJ1ZSwgbGl2ZSA9IG51bGwsIGRpcmVjdGlvbiA9ICdMUicsIG1pbmltYXAgPSB0cnVlIH0gPSAkcHJvcHMoKTtcblxuICAkZWZmZWN0KCgpID0+IHsgc2V0Q29udGV4dCgnZGFnRGlyZWN0aW9uJywgZGlyZWN0aW9uKTsgfSk7XG5cbiAgbGV0IGNvbG9yTW9kZSA9ICRzdGF0ZSgnc3lzdGVtJyk7XG5cbiAgJGVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBmdW5jdGlvbiBkZXRlY3RUaGVtZSgpIHtcbiAgICAgIGNvbnN0IHRoZW1lID0gaHRtbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnKTtcbiAgICAgIGNvbG9yTW9kZSA9IHRoZW1lID09PSAnZGFyaycgPyAnZGFyaycgOiB0aGVtZSA9PT0gJ2xpZ2h0JyA/ICdsaWdodCcgOiAnc3lzdGVtJztcbiAgICB9XG4gICAgZGV0ZWN0VGhlbWUoKTtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGRldGVjdFRoZW1lKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKGh0bWwsIHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbJ2RhdGEtdGhlbWUnXSB9KTtcbiAgICByZXR1cm4gKCkgPT4gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9KTtcblxuICBsZXQgbG9jYWxOb2RlcyA9ICRzdGF0ZShbXSk7XG4gIGxldCBsb2NhbEVkZ2VzID0gJHN0YXRlKFtdKTtcbiAgbGV0IGxhc3RTeW5jZWROb2RlSGFzaCA9ICRzdGF0ZSgnJyk7XG4gIGxldCBsYXN0U3luY2VkRWRnZUhhc2ggPSAkc3RhdGUoJycpO1xuXG4gIGZ1bmN0aW9uIGhhc2hOb2Rlcyhucykge1xuICAgIHJldHVybiBucy5tYXAobiA9PiBgJHtuLmlkfToke0pTT04uc3RyaW5naWZ5KG4uZGF0YSl9YCkuc29ydCgpLmpvaW4oJ3wnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc2hFZGdlcyhlcykge1xuICAgIHJldHVybiBlcy5tYXAoZSA9PiBgJHtlLmlkfToke2UudHlwZX06JHtKU09OLnN0cmluZ2lmeShlLmRhdGEpfWApLnNvcnQoKS5qb2luKCd8Jyk7XG4gIH1cblxuICAkZWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzZXJ2ZXJOb2RlSGFzaCA9IGhhc2hOb2Rlcyhwcm9wTm9kZXMpO1xuICAgIGNvbnN0IHNlcnZlckVkZ2VIYXNoID0gaGFzaEVkZ2VzKHByb3BFZGdlcyk7XG5cbiAgICBjb25zdCBub2Rlc0NoYW5nZWQgPSBzZXJ2ZXJOb2RlSGFzaCAhPT0gbGFzdFN5bmNlZE5vZGVIYXNoO1xuICAgIGNvbnN0IGVkZ2VzQ2hhbmdlZCA9IHNlcnZlckVkZ2VIYXNoICE9PSBsYXN0U3luY2VkRWRnZUhhc2g7XG5cbiAgICBpZiAobm9kZXNDaGFuZ2VkIHx8IGVkZ2VzQ2hhbmdlZCkge1xuICAgICAgbGFzdFN5bmNlZE5vZGVIYXNoID0gc2VydmVyTm9kZUhhc2g7XG4gICAgICBsYXN0U3luY2VkRWRnZUhhc2ggPSBzZXJ2ZXJFZGdlSGFzaDtcblxuICAgICAgY29uc3QgbGFpZCA9IGF1dG9MYXlvdXQocHJvcE5vZGVzLCBwcm9wRWRnZXMsIGRpcmVjdGlvbik7XG4gICAgICBsb2NhbE5vZGVzID0gbGFpZC5ub2RlcztcbiAgICAgIGxvY2FsRWRnZXMgPSBsYWlkLmVkZ2VzO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gb25EZWxldGUoeyBub2RlczogZGVsZXRlZE5vZGVzLCBlZGdlczogZGVsZXRlZEVkZ2VzIH0pIHtcbiAgICBpZiAocmVhZG9ubHkgfHwgIWxpdmUpIHJldHVybjtcblxuICAgIGlmIChkZWxldGVkTm9kZXMubGVuZ3RoID4gMCB8fCBkZWxldGVkRWRnZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZGVsZXRlZE5vZGVJZHMgPSBuZXcgU2V0KGRlbGV0ZWROb2Rlcy5tYXAobiA9PiBuLmlkKSk7XG4gICAgICBjb25zdCBkZWxldGVkRWRnZUlkcyA9IG5ldyBTZXQoZGVsZXRlZEVkZ2VzLm1hcChlID0+IGUuaWQpKTtcblxuICAgICAgY29uc3QgcmVtYWluaW5nTm9kZXMgPSBsb2NhbE5vZGVzLmZpbHRlcihuID0+ICFkZWxldGVkTm9kZUlkcy5oYXMobi5pZCkpO1xuICAgICAgY29uc3QgcmVtYWluaW5nRWRnZXMgPSBsb2NhbEVkZ2VzLmZpbHRlcihlID0+XG4gICAgICAgICFkZWxldGVkRWRnZUlkcy5oYXMoZS5pZCkgJiZcbiAgICAgICAgIWRlbGV0ZWROb2RlSWRzLmhhcyhlLnNvdXJjZSkgJiZcbiAgICAgICAgIWRlbGV0ZWROb2RlSWRzLmhhcyhlLnRhcmdldClcbiAgICAgICk7XG5cbiAgICAgIGxhc3RTeW5jZWROb2RlSGFzaCA9IGhhc2hOb2RlcyhyZW1haW5pbmdOb2Rlcyk7XG4gICAgICBsYXN0U3luY2VkRWRnZUhhc2ggPSBoYXNoRWRnZXMocmVtYWluaW5nRWRnZXMpO1xuXG4gICAgICBwdXNoR3JhcGgocmVtYWluaW5nTm9kZXMsIHJlbWFpbmluZ0VkZ2VzKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBNSU5fRElTVEFOQ0UgPSAxNTA7XG5cbiAgZnVuY3Rpb24gZ2V0Q2xvc2VzdEVkZ2Uobm9kZSkge1xuICAgIGNvbnN0IGNsb3Nlc3ROb2RlID0gbG9jYWxOb2Rlcy5yZWR1Y2UoXG4gICAgICAocmVzLCBuKSA9PiB7XG4gICAgICAgIGlmIChuLmlkICE9PSBub2RlLmlkKSB7XG4gICAgICAgICAgY29uc3QgZHggPSBuLnBvc2l0aW9uLnggLSBub2RlLnBvc2l0aW9uLng7XG4gICAgICAgICAgY29uc3QgZHkgPSBuLnBvc2l0aW9uLnkgLSBub2RlLnBvc2l0aW9uLnk7XG4gICAgICAgICAgY29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgICAgICAgaWYgKGQgPCByZXMuZGlzdGFuY2UgJiYgZCA8IE1JTl9ESVNUQU5DRSkge1xuICAgICAgICAgICAgcmVzLmRpc3RhbmNlID0gZDtcbiAgICAgICAgICAgIHJlcy5ub2RlID0gbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0sXG4gICAgICB7IGRpc3RhbmNlOiBOdW1iZXIuTUFYX1ZBTFVFLCBub2RlOiBudWxsIH1cbiAgICApO1xuXG4gICAgaWYgKCFjbG9zZXN0Tm9kZS5ub2RlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGlzU291cmNlID1cbiAgICAgIGRpcmVjdGlvbiA9PT0gJ1RCJ1xuICAgICAgICA/IGNsb3Nlc3ROb2RlLm5vZGUucG9zaXRpb24ueSA8IG5vZGUucG9zaXRpb24ueVxuICAgICAgICA6IGNsb3Nlc3ROb2RlLm5vZGUucG9zaXRpb24ueCA8IG5vZGUucG9zaXRpb24ueDtcblxuICAgIGNvbnN0IHNvdXJjZUlkID0gaXNTb3VyY2UgPyBjbG9zZXN0Tm9kZS5ub2RlLmlkIDogbm9kZS5pZDtcbiAgICBjb25zdCB0YXJnZXRJZCA9IGlzU291cmNlID8gbm9kZS5pZCA6IGNsb3Nlc3ROb2RlLm5vZGUuaWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGAke3NvdXJjZUlkfS0ke3RhcmdldElkfWAsXG4gICAgICBzb3VyY2U6IHNvdXJjZUlkLFxuICAgICAgdGFyZ2V0OiB0YXJnZXRJZCxcbiAgICAgIHR5cGU6ICdzbW9vdGhzdGVwJyxcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgY2xhc3M6ICd0ZW1wJyxcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gb25Ob2RlRHJhZyh7IHRhcmdldE5vZGUgfSkge1xuICAgIGlmIChyZWFkb25seSkgcmV0dXJuO1xuICAgIGNvbnN0IGNsb3Nlc3RFZGdlID0gZ2V0Q2xvc2VzdEVkZ2UodGFyZ2V0Tm9kZSk7XG5cbiAgICBsb2NhbEVkZ2VzID0gbG9jYWxFZGdlcy5maWx0ZXIoKGUpID0+IGUuY2xhc3MgIT09ICd0ZW1wJyk7XG5cbiAgICBpZiAoXG4gICAgICBjbG9zZXN0RWRnZSAmJlxuICAgICAgIWxvY2FsRWRnZXMuc29tZShcbiAgICAgICAgKGUpID0+XG4gICAgICAgICAgZS5zb3VyY2UgPT09IGNsb3Nlc3RFZGdlLnNvdXJjZSAmJiBlLnRhcmdldCA9PT0gY2xvc2VzdEVkZ2UudGFyZ2V0XG4gICAgICApXG4gICAgKSB7XG4gICAgICBsb2NhbEVkZ2VzID0gWy4uLmxvY2FsRWRnZXMsIGNsb3Nlc3RFZGdlXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbk5vZGVEcmFnU3RvcCgpIHtcbiAgICBpZiAocmVhZG9ubHkpIHJldHVybjtcbiAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmVDb2xsaXNpb25zKGxvY2FsTm9kZXMsIHsgbWFyZ2luOiAxMCB9KTtcbiAgICBsb2NhbE5vZGVzID0gcmVzb2x2ZWQ7XG5cbiAgICAvLyBGaW5hbGl6ZSBhbnkgdGVtcCBlZGdlcyBieSByZW1vdmluZyB0aGUgdGVtcCBjbGFzc1xuICAgIGxvY2FsRWRnZXMgPSBsb2NhbEVkZ2VzLm1hcCgoZSkgPT4ge1xuICAgICAgaWYgKGUuY2xhc3MgPT09ICd0ZW1wJykge1xuICAgICAgICByZXR1cm4geyAuLi5lLCBjbGFzczogJycgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlO1xuICAgIH0pO1xuXG4gICAgcHVzaEdyYXBoKGxvY2FsTm9kZXMsIGxvY2FsRWRnZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Db25uZWN0KHBhcmFtcykge1xuICAgIGlmIChyZWFkb25seSkgcmV0dXJuO1xuICAgIGNvbnN0IG5ld0VkZ2UgPSB7XG4gICAgICBpZDogYCR7cGFyYW1zLnNvdXJjZX0tJHtwYXJhbXMudGFyZ2V0fWAsXG4gICAgICBzb3VyY2U6IHBhcmFtcy5zb3VyY2UsXG4gICAgICB0YXJnZXQ6IHBhcmFtcy50YXJnZXQsXG4gICAgICB0eXBlOiAnc21vb3Roc3RlcCcsXG4gICAgICBkYXRhOiB7fSxcbiAgICB9O1xuICAgIGxvY2FsRWRnZXMgPSBbXG4gICAgICAuLi5sb2NhbEVkZ2VzLmZpbHRlcihlID0+ICEoZS5zb3VyY2UgPT09IHBhcmFtcy5zb3VyY2UgJiYgZS50YXJnZXQgPT09IHBhcmFtcy50YXJnZXQpKSxcbiAgICAgIG5ld0VkZ2UsXG4gICAgXTtcbiAgICBsYXN0U3luY2VkRWRnZUhhc2ggPSBoYXNoRWRnZXMobG9jYWxFZGdlcyk7XG4gICAgcHVzaEdyYXBoKGxvY2FsTm9kZXMsIGxvY2FsRWRnZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Ob2RlQ2xpY2soeyBub2RlIH0pIHtcbiAgICBpZiAobGl2ZSkge1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJub2RlX3NlbGVjdGVkXCIsIHsgaWQ6IG5vZGUuaWQgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25FZGdlQ2xpY2soeyBlZGdlIH0pIHtcbiAgICBpZiAobGl2ZSkge1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJlZGdlX3NlbGVjdGVkXCIsIHsgaWQ6IGVkZ2UuaWQgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25QYW5lQ2xpY2soKSB7XG4gICAgaWYgKGxpdmUpIHtcbiAgICAgIGxpdmUucHVzaEV2ZW50KFwiZGVzZWxlY3RcIiwge30pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQpIHtcbiAgICBpZiAocmVhZG9ubHkpIHJldHVybjtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Ecm9wKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAocmVhZG9ubHkgfHwgIWxpdmUpIHJldHVybjtcbiAgICBjb25zdCByYXcgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXBwbGljYXRpb24vcnVuY29tLXN0ZXAnKTtcbiAgICBpZiAoIXJhdykgcmV0dXJuO1xuICAgIGNvbnN0IHN0ZXAgPSBKU09OLnBhcnNlKHJhdyk7XG5cbiAgICBjb25zdCB2aWV3cG9ydEVsID0gZXZlbnQuY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3ZlbHRlLWZsb3dfX3ZpZXdwb3J0Jyk7XG4gICAgY29uc3QgYm91bmRzID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgeCA9IGV2ZW50LmNsaWVudFggLSBib3VuZHMubGVmdDtcbiAgICBsZXQgeSA9IGV2ZW50LmNsaWVudFkgLSBib3VuZHMudG9wO1xuXG4gICAgaWYgKHZpZXdwb3J0RWwpIHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGdldENvbXB1dGVkU3R5bGUodmlld3BvcnRFbCkudHJhbnNmb3JtO1xuICAgICAgaWYgKHRyYW5zZm9ybSAmJiB0cmFuc2Zvcm0gIT09ICdub25lJykge1xuICAgICAgICBjb25zdCBtID0gbmV3IERPTU1hdHJpeCh0cmFuc2Zvcm0pO1xuICAgICAgICB4ID0gKHggLSBtLmUpIC8gbS5hO1xuICAgICAgICB5ID0gKHkgLSBtLmYpIC8gbS5kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxpdmUucHVzaEV2ZW50KFwiZHJvcF9zdGVwXCIsIHtcbiAgICAgIG1vZHVsZTogc3RlcC5tb2R1bGUsXG4gICAgICBuYW1lOiBzdGVwLm5hbWUsXG4gICAgICB4OiB4IC0gNzUsXG4gICAgICB5OiB5IC0gMjBcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hHcmFwaChub2RlTGlzdCwgZWRnZUxpc3QpIHtcbiAgICBpZiAobGl2ZSkge1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJncmFwaF9jaGFuZ2VkXCIsIHtcbiAgICAgICAgbm9kZXM6IG5vZGVMaXN0Lm1hcChuID0+ICh7XG4gICAgICAgICAgaWQ6IG4uaWQsXG4gICAgICAgICAgdHlwZTogbi50eXBlLFxuICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IG4ucG9zaXRpb24/LngsIHk6IG4ucG9zaXRpb24/LnkgfSxcbiAgICAgICAgICBkYXRhOiBuLmRhdGFcbiAgICAgICAgfSkpLFxuICAgICAgICBlZGdlczogZWRnZUxpc3QubWFwKGUgPT4gKHtcbiAgICAgICAgICBpZDogZS5pZCxcbiAgICAgICAgICBzb3VyY2U6IGUuc291cmNlLFxuICAgICAgICAgIHRhcmdldDogZS50YXJnZXQsXG4gICAgICAgICAgdHlwZTogZS50eXBlLFxuICAgICAgICAgIGRhdGE6IGUuZGF0YVxuICAgICAgICB9KSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJkYWctdmlld2VyLXdyYXBwZXJcIlxuICByb2xlPVwiYXBwbGljYXRpb25cIlxuICBvbmRyYWdvdmVyPXtvbkRyYWdPdmVyfVxuICBvbmRyb3A9e29uRHJvcH1cbj5cbiAgPFN2ZWx0ZUZsb3dcbiAgICBiaW5kOm5vZGVzPXtsb2NhbE5vZGVzfVxuICAgIGJpbmQ6ZWRnZXM9e2xvY2FsRWRnZXN9XG4gICAge25vZGVUeXBlc31cbiAgICB7ZWRnZVR5cGVzfVxuICAgIHtjb2xvck1vZGV9XG4gICAgY29ubmVjdGlvblJhZGl1cz17MzB9XG4gICAgcHJvT3B0aW9ucz17eyBoaWRlQXR0cmlidXRpb246IHRydWUgfX1cbiAgICBvbm5vZGVjbGljaz17b25Ob2RlQ2xpY2t9XG4gICAgb25wYW5lY2xpY2s9e29uUGFuZUNsaWNrfVxuICAgIG9uZWRnZWNsaWNrPXtyZWFkb25seSA/IHVuZGVmaW5lZCA6IG9uRWRnZUNsaWNrfVxuICAgIG9uY29ubmVjdD17cmVhZG9ubHkgPyB1bmRlZmluZWQgOiBvbkNvbm5lY3R9XG4gICAgb25kZWxldGU9e3JlYWRvbmx5ID8gdW5kZWZpbmVkIDogb25EZWxldGV9XG4gICAgb25ub2RlZHJhZz17cmVhZG9ubHkgPyB1bmRlZmluZWQgOiBvbk5vZGVEcmFnfVxuICAgIG9ubm9kZWRyYWdzdG9wPXtyZWFkb25seSA/IHVuZGVmaW5lZCA6IG9uTm9kZURyYWdTdG9wfVxuICAgIGRlZmF1bHRFZGdlT3B0aW9ucz17eyB0eXBlOiAnc21vb3Roc3RlcCcsIG1hcmtlckVuZDogeyB0eXBlOiAnYXJyb3djbG9zZWQnIH0gfX1cbiAgICBmaXRWaWV3XG4gICAgZml0Vmlld09wdGlvbnM9e3sgcGFkZGluZzogMC4yIH19XG4gICAgbm9kZXNEcmFnZ2FibGU9eyFyZWFkb25seX1cbiAgICBub2Rlc0Nvbm5lY3RhYmxlPXshcmVhZG9ubHl9XG4gICAgZWxlbWVudHNTZWxlY3RhYmxlPXt0cnVlfVxuICA+XG4gICAgPENvbnRyb2xzIHNob3dMb2NrPXshcmVhZG9ubHl9IC8+XG4gICAgPEJhY2tncm91bmQgdmFyaWFudD1cImNyb3NzXCIgZ2FwPXsyOH0gc2l6ZT17Mn0gY29sb3I9e2NvbG9yTW9kZSA9PT0gJ2RhcmsnID8gJ3JnYmEoMTMwLDE0MCwyNTUsMC4wOCknIDogJ3JnYmEoMTAwLDExMCwxODAsMC4xMCknfSAvPlxuICAgIHsjaWYgbWluaW1hcH1cbiAgICAgIDxNaW5pTWFwIC8+XG4gICAgey9pZn1cbiAgPC9TdmVsdGVGbG93PlxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgLmRhZy12aWV3ZXItd3JhcHBlciB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICB9XG4gIC5kYWctdmlld2VyLXdyYXBwZXIgOmdsb2JhbCguc3ZlbHRlLWZsb3cpIHtcbiAgICBiYWNrZ3JvdW5kOlxuICAgICAgcmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgMzAlIDIwJSwgcmdiYSg5OSwxMDIsMjQxLDAuMDYpIDAlLCB0cmFuc3BhcmVudCA2MCUpLFxuICAgICAgcmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgODAlIDcwJSwgcmdiYSgxMzksOTIsMjQ2LDAuMDUpIDAlLCB0cmFuc3BhcmVudCA1MCUpLFxuICAgICAgcmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgNTAlIDUwJSwgcmdiYSgyNTUsMjU1LDI1NSwwLjkpIDAlLCB0cmFuc3BhcmVudCA4MCUpLFxuICAgICAgbGluZWFyLWdyYWRpZW50KDE2MGRlZywgI2YwZjFmOCAwJSwgI2U4ZTlmMiA0MCUsICNmMmYwZjUgMTAwJSk7XG4gIH1cbiAgLmRhZy12aWV3ZXItd3JhcHBlciA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrKSB7XG4gICAgYmFja2dyb3VuZDpcbiAgICAgIHJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IDMwJSAyMCUsIHJnYmEoOTksMTAyLDI0MSwwLjEwKSAwJSwgdHJhbnNwYXJlbnQgNjAlKSxcbiAgICAgIHJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IDgwJSA3MCUsIHJnYmEoMTM5LDkyLDI0NiwwLjA4KSAwJSwgdHJhbnNwYXJlbnQgNTAlKSxcbiAgICAgIHJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IDUwJSA1MCUsIHJnYmEoMjAsMjAsMzUsMC41KSAwJSwgdHJhbnNwYXJlbnQgODAlKSxcbiAgICAgIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsICMxNTE1MjQgMCUsICMxMTExMjAgNDAlLCAjMTcxNTJhIDEwMCUpO1xuICB9XG4gIC5kYWctdmlld2VyLXdyYXBwZXIgOmdsb2JhbCguc3ZlbHRlLWZsb3dfX2VkZ2UtcGF0aCkge1xuICAgIHN0cm9rZS13aWR0aDogMjtcbiAgfVxuICAuZGFnLXZpZXdlci13cmFwcGVyIDpnbG9iYWwoLnN2ZWx0ZS1mbG93X19lZGdlLnRlbXAgLnN2ZWx0ZS1mbG93X19lZGdlLXBhdGgpIHtcbiAgICBzdHJva2UtZGFzaGFycmF5OiA1O1xuICAgIHN0cm9rZTogIzg4ODtcbiAgfVxuICAuZGFnLXZpZXdlci13cmFwcGVyIDpnbG9iYWwoLnN2ZWx0ZS1mbG93X19jb250cm9scykge1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMDgpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4wNik7XG4gIH1cbiAgLmRhZy12aWV3ZXItd3JhcHBlciA6Z2xvYmFsKC5zdmVsdGUtZmxvdy5kYXJrIC5zdmVsdGUtZmxvd19fY29udHJvbHMpIHtcbiAgICBib3JkZXItY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC4wOCk7XG4gICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwwLDAsMC4zKTtcbiAgfVxuICAuZGFnLXZpZXdlci13cmFwcGVyIDpnbG9iYWwoLnN2ZWx0ZS1mbG93X19taW5pbWFwKSB7XG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwwLDAsMC4wOCk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLDAsMCwwLjA2KTtcbiAgfVxuICAuZGFnLXZpZXdlci13cmFwcGVyIDpnbG9iYWwoLnN2ZWx0ZS1mbG93LmRhcmsgLnN2ZWx0ZS1mbG93X19taW5pbWFwKSB7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuMDgpO1xuICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMyk7XG4gIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQXlSQSxFQUFFLGtDQUFtQixDQUFDO0FBQ3RCLElBQUksV0FBVztBQUNmLElBQUksWUFBWTtBQUNoQixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLGdCQUFnQjtBQUNwQjtBQUNBLEVBQUUsa0NBQW1CLENBQVMsWUFBYSxDQUFDO0FBQzVDLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEU7QUFDQSxFQUFFLGtDQUFtQixDQUFTLGlCQUFrQixDQUFDO0FBQ2pELElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEU7QUFDQSxFQUFFLGtDQUFtQixDQUFTLHVCQUF3QixDQUFDO0FBQ3ZELElBQUksZUFBZTtBQUNuQjtBQUNBLEVBQUUsa0NBQW1CLENBQVMsK0NBQWdELENBQUM7QUFDL0UsSUFBSSxtQkFBbUI7QUFDdkIsSUFBSSxZQUFZO0FBQ2hCO0FBQ0EsRUFBRSxrQ0FBbUIsQ0FBUyxzQkFBdUIsQ0FBQztBQUN0RCxJQUFJLGtCQUFrQjtBQUN0QixJQUFJLGdCQUFnQjtBQUNwQixJQUFJLHNDQUFzQztBQUMxQyxJQUFJLGtDQUFrQztBQUN0QztBQUNBLEVBQUUsa0NBQW1CLENBQVMsd0NBQXlDLENBQUM7QUFDeEUsSUFBSSxvQ0FBb0M7QUFDeEMsSUFBSSxxQ0FBcUM7QUFDekM7QUFDQSxFQUFFLGtDQUFtQixDQUFTLHFCQUFzQixDQUFDO0FBQ3JELElBQUksa0JBQWtCO0FBQ3RCLElBQUksZ0JBQWdCO0FBQ3BCLElBQUksc0NBQXNDO0FBQzFDLElBQUksa0NBQWtDO0FBQ3RDO0FBQ0EsRUFBRSxrQ0FBbUIsQ0FBUyx1Q0FBd0MsQ0FBQztBQUN2RSxJQUFJLG9DQUFvQztBQUN4QyxJQUFJLHFDQUFxQztBQUN6QzsifQ== */"
};
function DagViewer($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, DagViewer);
  append_styles($$anchor, $$css9);
  const nodeTypes = { step: StepNode, runbook: RunbookNode };
  const edgeTypes = { conditional: ConditionalEdge };
  let propNodes = prop($$props, "nodes", 19, () => []), propEdges = prop($$props, "edges", 19, () => []), readonly = prop($$props, "readonly", 3, true), live = prop($$props, "live", 3, null), direction = prop($$props, "direction", 3, "LR"), minimap = prop($$props, "minimap", 3, true);
  user_effect(() => {
    setContext("dagDirection", direction());
  });
  let colorMode = tag(state("system"), "colorMode");
  user_effect(() => {
    const html2 = document.documentElement;
    function detectTheme() {
      const theme = html2.getAttribute("data-theme");
      set(
        colorMode,
        strict_equals(theme, "dark") ? "dark" : strict_equals(theme, "light") ? "light" : "system",
        true
      );
    }
    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(html2, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  });
  let localNodes = tag(state(proxy([])), "localNodes");
  let localEdges = tag(state(proxy([])), "localEdges");
  let lastSyncedNodeHash = tag(state(""), "lastSyncedNodeHash");
  let lastSyncedEdgeHash = tag(state(""), "lastSyncedEdgeHash");
  function hashNodes(ns) {
    return ns.map((n) => `${n.id}:${JSON.stringify(n.data)}`).sort().join("|");
  }
  function hashEdges(es) {
    return es.map((e) => `${e.id}:${e.type}:${JSON.stringify(e.data)}`).sort().join("|");
  }
  user_effect(() => {
    const serverNodeHash = hashNodes(propNodes());
    const serverEdgeHash = hashEdges(propEdges());
    const nodesChanged = strict_equals(serverNodeHash, get(lastSyncedNodeHash), false);
    const edgesChanged = strict_equals(serverEdgeHash, get(lastSyncedEdgeHash), false);
    if (nodesChanged || edgesChanged) {
      set(lastSyncedNodeHash, serverNodeHash, true);
      set(lastSyncedEdgeHash, serverEdgeHash, true);
      const laid = autoLayout(propNodes(), propEdges(), direction());
      set(localNodes, laid.nodes, true);
      set(localEdges, laid.edges, true);
    }
  });
  function onDelete({ nodes: deletedNodes, edges: deletedEdges }) {
    if (readonly() || !live()) return;
    if (deletedNodes.length > 0 || deletedEdges.length > 0) {
      const deletedNodeIds = new Set(deletedNodes.map((n) => n.id));
      const deletedEdgeIds = new Set(deletedEdges.map((e) => e.id));
      const remainingNodes = get(localNodes).filter((n) => !deletedNodeIds.has(n.id));
      const remainingEdges = get(localEdges).filter((e) => !deletedEdgeIds.has(e.id) && !deletedNodeIds.has(e.source) && !deletedNodeIds.has(e.target));
      set(lastSyncedNodeHash, hashNodes(remainingNodes), true);
      set(lastSyncedEdgeHash, hashEdges(remainingEdges), true);
      pushGraph(remainingNodes, remainingEdges);
    }
  }
  const MIN_DISTANCE = 150;
  function getClosestEdge(node) {
    const closestNode = get(localNodes).reduce(
      (res, n) => {
        if (strict_equals(n.id, node.id, false)) {
          const dx = n.position.x - node.position.x;
          const dy = n.position.y - node.position.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }
        return res;
      },
      { distance: Number.MAX_VALUE, node: null }
    );
    if (!closestNode.node) return null;
    const isSource = strict_equals(direction(), "TB") ? closestNode.node.position.y < node.position.y : closestNode.node.position.x < node.position.x;
    const sourceId = isSource ? closestNode.node.id : node.id;
    const targetId = isSource ? node.id : closestNode.node.id;
    return {
      id: `${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: "smoothstep",
      data: {},
      class: "temp"
    };
  }
  function onNodeDrag({ targetNode }) {
    if (readonly()) return;
    const closestEdge = getClosestEdge(targetNode);
    set(localEdges, get(localEdges).filter((e) => strict_equals(e.class, "temp", false)), true);
    if (closestEdge && !get(localEdges).some((e) => strict_equals(e.source, closestEdge.source) && strict_equals(e.target, closestEdge.target))) {
      set(localEdges, [...get(localEdges), closestEdge], true);
    }
  }
  function onNodeDragStop() {
    if (readonly()) return;
    const resolved = resolveCollisions(get(localNodes), { margin: 10 });
    set(localNodes, resolved, true);
    set(
      localEdges,
      get(localEdges).map((e) => {
        if (strict_equals(e.class, "temp")) {
          return { ...e, class: "" };
        }
        return e;
      }),
      true
    );
    pushGraph(get(localNodes), get(localEdges));
  }
  function onConnect(params) {
    if (readonly()) return;
    const newEdge = {
      id: `${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      type: "smoothstep",
      data: {}
    };
    set(
      localEdges,
      [
        ...get(localEdges).filter((e) => !(strict_equals(e.source, params.source) && strict_equals(e.target, params.target))),
        newEdge
      ],
      true
    );
    set(lastSyncedEdgeHash, hashEdges(get(localEdges)), true);
    pushGraph(get(localNodes), get(localEdges));
  }
  function onNodeClick({ node }) {
    if (live()) {
      live().pushEvent("node_selected", { id: node.id });
    }
  }
  function onEdgeClick({ edge }) {
    if (live()) {
      live().pushEvent("edge_selected", { id: edge.id });
    }
  }
  function onPaneClick() {
    if (live()) {
      live().pushEvent("deselect", {});
    }
  }
  function onDragOver(event2) {
    if (readonly()) return;
    event2.preventDefault();
    event2.dataTransfer.dropEffect = "move";
  }
  function onDrop(event2) {
    event2.preventDefault();
    if (readonly() || !live()) return;
    const raw = event2.dataTransfer.getData("application/runcom-step");
    if (!raw) return;
    const step = JSON.parse(raw);
    const viewportEl = event2.currentTarget.querySelector(".svelte-flow__viewport");
    const bounds = event2.currentTarget.getBoundingClientRect();
    let x = event2.clientX - bounds.left;
    let y2 = event2.clientY - bounds.top;
    if (viewportEl) {
      const transform2 = getComputedStyle(viewportEl).transform;
      if (transform2 && strict_equals(transform2, "none", false)) {
        const m = new DOMMatrix(transform2);
        x = (x - m.e) / m.a;
        y2 = (y2 - m.f) / m.d;
      }
    }
    live().pushEvent("drop_step", { module: step.module, name: step.name, x: x - 75, y: y2 - 20 });
  }
  function pushGraph(nodeList, edgeList) {
    if (live()) {
      live().pushEvent("graph_changed", {
        nodes: nodeList.map((n) => ({
          id: n.id,
          type: n.type,
          position: { x: n.position?.x, y: n.position?.y },
          data: n.data
        })),
        edges: edgeList.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.type,
          data: e.data
        }))
      });
    }
  }
  var $$exports = { ...legacy_api() };
  var div = root32();
  var node_1 = child(div);
  {
    let $0 = user_derived(() => readonly() ? void 0 : onEdgeClick);
    let $1 = user_derived(() => readonly() ? void 0 : onConnect);
    let $2 = user_derived(() => readonly() ? void 0 : onDelete);
    let $3 = user_derived(() => readonly() ? void 0 : onNodeDrag);
    let $4 = user_derived(() => readonly() ? void 0 : onNodeDragStop);
    let $5 = user_derived(() => !readonly());
    let $6 = user_derived(() => !readonly());
    add_svelte_meta(
      () => SvelteFlow(node_1, {
        get nodeTypes() {
          return nodeTypes;
        },
        get edgeTypes() {
          return edgeTypes;
        },
        get colorMode() {
          return get(colorMode);
        },
        connectionRadius: 30,
        proOptions: { hideAttribution: true },
        onnodeclick: onNodeClick,
        onpaneclick: onPaneClick,
        get onedgeclick() {
          return get($0);
        },
        get onconnect() {
          return get($1);
        },
        get ondelete() {
          return get($2);
        },
        get onnodedrag() {
          return get($3);
        },
        get onnodedragstop() {
          return get($4);
        },
        defaultEdgeOptions: { type: "smoothstep", markerEnd: { type: "arrowclosed" } },
        fitView: true,
        fitViewOptions: { padding: 0.2 },
        get nodesDraggable() {
          return get($5);
        },
        get nodesConnectable() {
          return get($6);
        },
        elementsSelectable: true,
        get nodes() {
          return get(localNodes);
        },
        set nodes($$value) {
          set(localNodes, $$value, true);
        },
        get edges() {
          return get(localEdges);
        },
        set edges($$value) {
          set(localEdges, $$value, true);
        },
        children: wrap_snippet(DagViewer, ($$anchor2, $$slotProps) => {
          var fragment = root_114();
          var node_2 = first_child(fragment);
          {
            let $02 = user_derived(() => !readonly());
            add_svelte_meta(
              () => Controls(node_2, {
                get showLock() {
                  return get($02);
                }
              }),
              "component",
              DagViewer,
              273,
              4,
              { componentTag: "Controls" }
            );
          }
          var node_3 = sibling(node_2, 2);
          {
            let $02 = user_derived(() => strict_equals(get(colorMode), "dark") ? "rgba(130,140,255,0.08)" : "rgba(100,110,180,0.10)");
            add_svelte_meta(
              () => Background(node_3, {
                variant: "cross",
                gap: 28,
                size: 2,
                get color() {
                  return get($02);
                }
              }),
              "component",
              DagViewer,
              274,
              4,
              { componentTag: "Background" }
            );
          }
          var node_4 = sibling(node_3, 2);
          {
            var consequent = ($$anchor3) => {
              add_svelte_meta(() => Minimap($$anchor3, {}), "component", DagViewer, 276, 6, { componentTag: "MiniMap" });
            };
            add_svelte_meta(
              () => if_block(node_4, ($$render) => {
                if (minimap()) $$render(consequent);
              }),
              "if",
              DagViewer,
              275,
              4
            );
          }
          append($$anchor2, fragment);
        }),
        $$slots: { default: true }
      }),
      "component",
      DagViewer,
      251,
      2,
      { componentTag: "SvelteFlow" }
    );
  }
  reset(div);
  event("dragover", div, onDragOver);
  event("drop", div, onDrop);
  append($$anchor, div);
  return pop($$exports);
}

// node_modules/@xyflow/svelte/dist/style.css
var style_default3 = "/* this gets exported as style.css and can be used for the default theming */\n/* these are the necessary styles for React/Svelte Flow, they get used by base.css and style.css */\n.svelte-flow {\n  direction: ltr;\n\n  --xy-edge-stroke-default: #b1b1b7;\n  --xy-edge-stroke-width-default: 1;\n  --xy-edge-stroke-selected-default: #555;\n\n  --xy-connectionline-stroke-default: #b1b1b7;\n  --xy-connectionline-stroke-width-default: 1;\n\n  --xy-attribution-background-color-default: rgba(255, 255, 255, 0.5);\n\n  --xy-minimap-background-color-default: #fff;\n  --xy-minimap-mask-background-color-default: rgba(240, 240, 240, 0.6);\n  --xy-minimap-mask-stroke-color-default: transparent;\n  --xy-minimap-mask-stroke-width-default: 1;\n  --xy-minimap-node-background-color-default: #e2e2e2;\n  --xy-minimap-node-stroke-color-default: transparent;\n  --xy-minimap-node-stroke-width-default: 2;\n\n  --xy-background-color-default: transparent;\n  --xy-background-pattern-dots-color-default: #91919a;\n  --xy-background-pattern-lines-color-default: #eee;\n  --xy-background-pattern-cross-color-default: #e2e2e2;\n  background-color: var(--xy-background-color, var(--xy-background-color-default));\n  --xy-node-color-default: inherit;\n  --xy-node-border-default: 1px solid #1a192b;\n  --xy-node-background-color-default: #fff;\n  --xy-node-group-background-color-default: rgba(240, 240, 240, 0.25);\n  --xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, 0.08);\n  --xy-node-boxshadow-selected-default: 0 0 0 0.5px #1a192b;\n  --xy-node-border-radius-default: 3px;\n\n  --xy-handle-background-color-default: #1a192b;\n  --xy-handle-border-color-default: #fff;\n\n  --xy-selection-background-color-default: rgba(0, 89, 220, 0.08);\n  --xy-selection-border-default: 1px dotted rgba(0, 89, 220, 0.8);\n\n  --xy-controls-button-background-color-default: #fefefe;\n  --xy-controls-button-background-color-hover-default: #f4f4f4;\n  --xy-controls-button-color-default: inherit;\n  --xy-controls-button-color-hover-default: inherit;\n  --xy-controls-button-border-color-default: #eee;\n  --xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n\n  --xy-edge-label-background-color-default: #ffffff;\n  --xy-edge-label-color-default: inherit;\n  --xy-resize-background-color-default: #3367d9;\n}\n.svelte-flow.dark {\n  --xy-edge-stroke-default: #3e3e3e;\n  --xy-edge-stroke-width-default: 1;\n  --xy-edge-stroke-selected-default: #727272;\n\n  --xy-connectionline-stroke-default: #b1b1b7;\n  --xy-connectionline-stroke-width-default: 1;\n\n  --xy-attribution-background-color-default: rgba(150, 150, 150, 0.25);\n\n  --xy-minimap-background-color-default: #141414;\n  --xy-minimap-mask-background-color-default: rgba(60, 60, 60, 0.6);\n  --xy-minimap-mask-stroke-color-default: transparent;\n  --xy-minimap-mask-stroke-width-default: 1;\n  --xy-minimap-node-background-color-default: #2b2b2b;\n  --xy-minimap-node-stroke-color-default: transparent;\n  --xy-minimap-node-stroke-width-default: 2;\n\n  --xy-background-color-default: #141414;\n  --xy-background-pattern-dots-color-default: #777;\n  --xy-background-pattern-lines-color-default: #777;\n  --xy-background-pattern-cross-color-default: #777;\n  --xy-node-color-default: #f8f8f8;\n  --xy-node-border-default: 1px solid #3c3c3c;\n  --xy-node-background-color-default: #1e1e1e;\n  --xy-node-group-background-color-default: rgba(240, 240, 240, 0.25);\n  --xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, 0.08);\n  --xy-node-boxshadow-selected-default: 0 0 0 0.5px #999;\n\n  --xy-handle-background-color-default: #bebebe;\n  --xy-handle-border-color-default: #1e1e1e;\n\n  --xy-selection-background-color-default: rgba(200, 200, 220, 0.08);\n  --xy-selection-border-default: 1px dotted rgba(200, 200, 220, 0.8);\n\n  --xy-controls-button-background-color-default: #2b2b2b;\n  --xy-controls-button-background-color-hover-default: #3e3e3e;\n  --xy-controls-button-color-default: #f8f8f8;\n  --xy-controls-button-color-hover-default: #fff;\n  --xy-controls-button-border-color-default: #5b5b5b;\n  --xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, 0.08);\n\n  --xy-edge-label-background-color-default: #141414;\n  --xy-edge-label-color-default: #f8f8f8;\n}\n.svelte-flow__background {\n  background-color: var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));\n  pointer-events: none;\n  z-index: -1;\n}\n.svelte-flow__container {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n.svelte-flow__pane {\n  z-index: 1;\n}\n.svelte-flow__pane.draggable {\n    cursor: grab;\n  }\n.svelte-flow__pane.dragging {\n    cursor: grabbing;\n  }\n.svelte-flow__pane.selection {\n    cursor: pointer;\n  }\n.svelte-flow__viewport {\n  transform-origin: 0 0;\n  z-index: 2;\n  pointer-events: none;\n}\n.svelte-flow__renderer {\n  z-index: 4;\n}\n.svelte-flow__selection {\n  z-index: 6;\n}\n.svelte-flow__nodesselection-rect:focus,\n.svelte-flow__nodesselection-rect:focus-visible {\n  outline: none;\n}\n.svelte-flow__edge-path {\n  stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default));\n  stroke-width: var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));\n  fill: none;\n}\n.svelte-flow__connection-path {\n  stroke: var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));\n  stroke-width: var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));\n  fill: none;\n}\n.svelte-flow .svelte-flow__edges {\n  position: absolute;\n}\n.svelte-flow .svelte-flow__edges svg {\n    overflow: visible;\n    position: absolute;\n    pointer-events: none;\n  }\n.svelte-flow__edge {\n  pointer-events: visibleStroke;\n}\n.svelte-flow__edge.selectable {\n    cursor: pointer;\n  }\n.svelte-flow__edge.animated path {\n    stroke-dasharray: 5;\n    animation: dashdraw 0.5s linear infinite;\n  }\n.svelte-flow__edge.animated path.svelte-flow__edge-interaction {\n    stroke-dasharray: none;\n    animation: none;\n  }\n.svelte-flow__edge.inactive {\n    pointer-events: none;\n  }\n.svelte-flow__edge.selected,\n  .svelte-flow__edge:focus,\n  .svelte-flow__edge:focus-visible {\n    outline: none;\n  }\n.svelte-flow__edge.selected .svelte-flow__edge-path,\n  .svelte-flow__edge.selectable:focus .svelte-flow__edge-path,\n  .svelte-flow__edge.selectable:focus-visible .svelte-flow__edge-path {\n    stroke: var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default));\n  }\n.svelte-flow__edge-textwrapper {\n    pointer-events: all;\n  }\n.svelte-flow__edge .svelte-flow__edge-text {\n    pointer-events: none;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n  }\n/* Arrowhead marker styles - use CSS custom properties as default */\n.svelte-flow__arrowhead polyline {\n  stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default));\n}\n.svelte-flow__arrowhead polyline.arrowclosed {\n  fill: var(--xy-edge-stroke, var(--xy-edge-stroke-default));\n}\n.svelte-flow__connection {\n  pointer-events: none;\n}\n.svelte-flow__connection .animated {\n    stroke-dasharray: 5;\n    animation: dashdraw 0.5s linear infinite;\n  }\nsvg.svelte-flow__connectionline {\n  z-index: 1001;\n  overflow: visible;\n  position: absolute;\n}\n.svelte-flow__nodes {\n  pointer-events: none;\n  transform-origin: 0 0;\n}\n.svelte-flow__node {\n  position: absolute;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  pointer-events: all;\n  transform-origin: 0 0;\n  box-sizing: border-box;\n  cursor: default;\n}\n.svelte-flow__node.selectable {\n    cursor: pointer;\n  }\n.svelte-flow__node.draggable {\n    cursor: grab;\n    pointer-events: all;\n  }\n.svelte-flow__node.draggable.dragging {\n      cursor: grabbing;\n    }\n.svelte-flow__nodesselection {\n  z-index: 3;\n  transform-origin: left top;\n  pointer-events: none;\n}\n.svelte-flow__nodesselection-rect {\n    position: absolute;\n    pointer-events: all;\n    cursor: grab;\n  }\n.svelte-flow__handle {\n  position: absolute;\n  pointer-events: none;\n  min-width: 5px;\n  min-height: 5px;\n  width: 6px;\n  height: 6px;\n  background-color: var(--xy-handle-background-color, var(--xy-handle-background-color-default));\n  border: 1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));\n  border-radius: 100%;\n}\n.svelte-flow__handle.connectingfrom {\n    pointer-events: all;\n  }\n.svelte-flow__handle.connectionindicator {\n    pointer-events: all;\n    cursor: crosshair;\n  }\n.svelte-flow__handle-bottom {\n    top: auto;\n    left: 50%;\n    bottom: 0;\n    transform: translate(-50%, 50%);\n  }\n.svelte-flow__handle-top {\n    top: 0;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  }\n.svelte-flow__handle-left {\n    top: 50%;\n    left: 0;\n    transform: translate(-50%, -50%);\n  }\n.svelte-flow__handle-right {\n    top: 50%;\n    right: 0;\n    transform: translate(50%, -50%);\n  }\n.svelte-flow__edgeupdater {\n  cursor: move;\n  pointer-events: all;\n}\n.svelte-flow__pane.selection .svelte-flow__panel {\n  pointer-events: none;\n}\n.svelte-flow__panel {\n  position: absolute;\n  z-index: 5;\n  margin: 15px;\n}\n.svelte-flow__panel.top {\n    top: 0;\n  }\n.svelte-flow__panel.bottom {\n    bottom: 0;\n  }\n.svelte-flow__panel.top.center, .svelte-flow__panel.bottom.center {\n      left: 50%;\n      transform: translateX(-15px) translateX(-50%);\n    }\n.svelte-flow__panel.left {\n    left: 0;\n  }\n.svelte-flow__panel.right {\n    right: 0;\n  }\n.svelte-flow__panel.left.center, .svelte-flow__panel.right.center {\n      top: 50%;\n      transform: translateY(-15px) translateY(-50%);\n    }\n.svelte-flow__attribution {\n  font-size: 10px;\n  background: var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));\n  padding: 2px 3px;\n  margin: 0;\n}\n.svelte-flow__attribution a {\n    text-decoration: none;\n    color: #999;\n  }\n@keyframes dashdraw {\n  from {\n    stroke-dashoffset: 10;\n  }\n}\n.svelte-flow__edgelabel-renderer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  left: 0;\n  top: 0;\n}\n.svelte-flow__viewport-portal {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.svelte-flow__minimap {\n  background: var(\n    --xy-minimap-background-color-props,\n    var(--xy-minimap-background-color, var(--xy-minimap-background-color-default))\n  );\n}\n.svelte-flow__minimap-svg {\n    display: block;\n  }\n.svelte-flow__minimap-mask {\n    fill: var(\n      --xy-minimap-mask-background-color-props,\n      var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default))\n    );\n    stroke: var(\n      --xy-minimap-mask-stroke-color-props,\n      var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default))\n    );\n    stroke-width: var(\n      --xy-minimap-mask-stroke-width-props,\n      var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default))\n    );\n  }\n.svelte-flow__minimap-node {\n    fill: var(\n      --xy-minimap-node-background-color-props,\n      var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default))\n    );\n    stroke: var(\n      --xy-minimap-node-stroke-color-props,\n      var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default))\n    );\n    stroke-width: var(\n      --xy-minimap-node-stroke-width-props,\n      var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default))\n    );\n  }\n.svelte-flow__background-pattern.dots {\n    fill: var(\n      --xy-background-pattern-color-props,\n      var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default))\n    );\n  }\n.svelte-flow__background-pattern.lines {\n    stroke: var(\n      --xy-background-pattern-color-props,\n      var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default))\n    );\n  }\n.svelte-flow__background-pattern.cross {\n    stroke: var(\n      --xy-background-pattern-color-props,\n      var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default))\n    );\n  }\n.svelte-flow__controls {\n  display: flex;\n  flex-direction: column;\n  box-shadow: var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default));\n}\n.svelte-flow__controls.horizontal {\n    flex-direction: row;\n  }\n.svelte-flow__controls-button {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 26px;\n    width: 26px;\n    padding: 4px;\n    border: none;\n    background: var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));\n    border-bottom: 1px solid\n      var(\n        --xy-controls-button-border-color-props,\n        var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default))\n      );\n    color: var(\n      --xy-controls-button-color-props,\n      var(--xy-controls-button-color, var(--xy-controls-button-color-default))\n    );\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n  }\n.svelte-flow__controls-button svg {\n      width: 100%;\n      max-width: 12px;\n      max-height: 12px;\n      fill: currentColor;\n    }\n.svelte-flow__edge.updating .svelte-flow__edge-path {\n      stroke: #777;\n    }\n.svelte-flow__edge-text {\n    font-size: 10px;\n  }\n.svelte-flow__node.selectable:focus,\n  .svelte-flow__node.selectable:focus-visible {\n    outline: none;\n  }\n.svelte-flow__node-input,\n.svelte-flow__node-default,\n.svelte-flow__node-output,\n.svelte-flow__node-group {\n  padding: 10px;\n  border-radius: var(--xy-node-border-radius, var(--xy-node-border-radius-default));\n  width: 150px;\n  font-size: 12px;\n  color: var(--xy-node-color, var(--xy-node-color-default));\n  text-align: center;\n  border: var(--xy-node-border, var(--xy-node-border-default));\n  background-color: var(--xy-node-background-color, var(--xy-node-background-color-default));\n}\n.svelte-flow__node-input.selectable:hover, .svelte-flow__node-default.selectable:hover, .svelte-flow__node-output.selectable:hover, .svelte-flow__node-group.selectable:hover {\n      box-shadow: var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default));\n    }\n.svelte-flow__node-input.selectable.selected,\n    .svelte-flow__node-input.selectable:focus,\n    .svelte-flow__node-input.selectable:focus-visible,\n    .svelte-flow__node-default.selectable.selected,\n    .svelte-flow__node-default.selectable:focus,\n    .svelte-flow__node-default.selectable:focus-visible,\n    .svelte-flow__node-output.selectable.selected,\n    .svelte-flow__node-output.selectable:focus,\n    .svelte-flow__node-output.selectable:focus-visible,\n    .svelte-flow__node-group.selectable.selected,\n    .svelte-flow__node-group.selectable:focus,\n    .svelte-flow__node-group.selectable:focus-visible {\n      box-shadow: var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default));\n    }\n.svelte-flow__node-group {\n  background-color: var(--xy-node-group-background-color, var(--xy-node-group-background-color-default));\n}\n.svelte-flow__nodesselection-rect,\n.svelte-flow__selection {\n  background: var(--xy-selection-background-color, var(--xy-selection-background-color-default));\n  border: var(--xy-selection-border, var(--xy-selection-border-default));\n}\n.svelte-flow__nodesselection-rect:focus,\n  .svelte-flow__nodesselection-rect:focus-visible,\n  .svelte-flow__selection:focus,\n  .svelte-flow__selection:focus-visible {\n    outline: none;\n  }\n.svelte-flow__controls-button:hover {\n      background: var(\n        --xy-controls-button-background-color-hover-props,\n        var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default))\n      );\n      color: var(\n        --xy-controls-button-color-hover-props,\n        var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default))\n      );\n    }\n.svelte-flow__controls-button:disabled {\n      pointer-events: none;\n    }\n.svelte-flow__controls-button:disabled svg {\n        fill-opacity: 0.4;\n      }\n.svelte-flow__controls-button:last-child {\n    border-bottom: none;\n  }\n.svelte-flow__controls.horizontal .svelte-flow__controls-button {\n    border-bottom: none;\n    border-right: 1px solid\n      var(\n        --xy-controls-button-border-color-props,\n        var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default))\n      );\n  }\n.svelte-flow__controls.horizontal .svelte-flow__controls-button:last-child {\n    border-right: none;\n  }\n.svelte-flow__resize-control {\n  position: absolute;\n}\n.svelte-flow__resize-control.left,\n.svelte-flow__resize-control.right {\n  cursor: ew-resize;\n}\n.svelte-flow__resize-control.top,\n.svelte-flow__resize-control.bottom {\n  cursor: ns-resize;\n}\n.svelte-flow__resize-control.top.left,\n.svelte-flow__resize-control.bottom.right {\n  cursor: nwse-resize;\n}\n.svelte-flow__resize-control.bottom.left,\n.svelte-flow__resize-control.top.right {\n  cursor: nesw-resize;\n}\n/* handle styles */\n.svelte-flow__resize-control.handle {\n  width: 5px;\n  height: 5px;\n  border: 1px solid #fff;\n  border-radius: 1px;\n  background-color: var(--xy-resize-background-color, var(--xy-resize-background-color-default));\n  translate: -50% -50%;\n}\n.svelte-flow__resize-control.handle.left {\n  left: 0;\n  top: 50%;\n}\n.svelte-flow__resize-control.handle.right {\n  left: 100%;\n  top: 50%;\n}\n.svelte-flow__resize-control.handle.top {\n  left: 50%;\n  top: 0;\n}\n.svelte-flow__resize-control.handle.bottom {\n  left: 50%;\n  top: 100%;\n}\n.svelte-flow__resize-control.handle.top.left {\n  left: 0;\n}\n.svelte-flow__resize-control.handle.bottom.left {\n  left: 0;\n}\n.svelte-flow__resize-control.handle.top.right {\n  left: 100%;\n}\n.svelte-flow__resize-control.handle.bottom.right {\n  left: 100%;\n}\n/* line styles */\n.svelte-flow__resize-control.line {\n  border-color: var(--xy-resize-background-color, var(--xy-resize-background-color-default));\n  border-width: 0;\n  border-style: solid;\n}\n.svelte-flow__resize-control.line.left,\n.svelte-flow__resize-control.line.right {\n  width: 1px;\n  transform: translate(-50%, 0);\n  top: 0;\n  height: 100%;\n}\n.svelte-flow__resize-control.line.left {\n  left: 0;\n  border-left-width: 1px;\n}\n.svelte-flow__resize-control.line.right {\n  left: 100%;\n  border-right-width: 1px;\n}\n.svelte-flow__resize-control.line.top,\n.svelte-flow__resize-control.line.bottom {\n  height: 1px;\n  transform: translate(0, -50%);\n  left: 0;\n  width: 100%;\n}\n.svelte-flow__resize-control.line.top {\n  top: 0;\n  border-top-width: 1px;\n}\n.svelte-flow__resize-control.line.bottom {\n  border-bottom-width: 1px;\n  top: 100%;\n}\n.svelte-flow__edge-label {\n  text-align: center;\n  position: absolute;\n  padding: 2px;\n  font-size: 10px;\n  color: var(--xy-edge-label-color, var(--xy-edge-label-color-default));\n  background: var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default));\n}\n.svelte-flow__container {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n";

// js/chunks/dag_viewer.js
if (!document.querySelector("[data-xyflow-css]")) {
  const style = document.createElement("style");
  style.setAttribute("data-xyflow-css", "");
  style.textContent = style_default3;
  document.head.appendChild(style);
}
function mount2(el, hook) {
  const props = JSON.parse(el.getAttribute("data-props") || "{}");
  const state2 = $state({ ...props, live: hook });
  const target = el.querySelector("[data-svelte-target]");
  target.innerHTML = "";
  const instance = mount(DagViewer, { target, props: state2 });
  instance.state = state2;
  hook._onUpdate = () => {
    const newProps = JSON.parse(el.getAttribute("data-props") || "{}");
    for (const key3 in newProps) {
      instance.state[key3] = newProps[key3];
    }
    instance.state.live = hook;
  };
  return () => {
    window.addEventListener("phx:page-loading-stop", () => unmount(instance), { once: true });
  };
}
export {
  mount2 as mount
};
/*! Bundled license information:

@dagrejs/dagre/dist/dagre.esm.js:
  (*! For license information please see dagre.esm.js.LEGAL.txt *)
*/

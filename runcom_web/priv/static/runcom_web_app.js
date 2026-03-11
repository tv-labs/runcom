var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/topbar/topbar.min.js
var require_topbar_min = __commonJS({
  "node_modules/topbar/topbar.min.js"(exports, module) {
    (function(a, c) {
      "use strict";
      var n, o, l, f = null, u = null, d = null, p = function(e, t, s) {
        e.addEventListener ? e.addEventListener(t, s, false) : e.attachEvent ? e.attachEvent("on" + t, s) : e["on" + t] = s;
      }, r = { autoRun: true, barThickness: 3, barColors: { 0: "rgba(26,  188, 156, .9)", ".25": "rgba(52,  152, 219, .9)", ".50": "rgba(241, 196, 15,  .9)", ".75": "rgba(230, 126, 34,  .9)", "1.0": "rgba(211, 84,  0,   .9)" }, shadowBlur: 10, shadowColor: "rgba(0,   0,   0,   .6)", className: null }, h = function() {
        n.width = a.innerWidth, n.height = r.barThickness * 5;
        var e = n.getContext("2d");
        e.shadowBlur = r.shadowBlur, e.shadowColor = r.shadowColor;
        var t = e.createLinearGradient(0, 0, n.width, 0);
        for (var s in r.barColors) t.addColorStop(s, r.barColors[s]);
        e.lineWidth = r.barThickness, e.beginPath(), e.moveTo(0, r.barThickness / 2), e.lineTo(Math.ceil(o * n.width), r.barThickness / 2), e.strokeStyle = t, e.stroke();
      }, g = function() {
        n = c.createElement("canvas"), n.role = "presentation";
        var e = n.style;
        e.position = "fixed", e.top = e.left = e.right = e.margin = e.padding = 0, e.zIndex = 100001, n.hidden = true, r.className && n.classList.add(r.className), p(a, "resize", h);
      }, i = { config: function(e) {
        for (var t in e) r.hasOwnProperty(t) && (r[t] = e[t]);
      }, show: function(e) {
        if (!l) if (e) {
          if (d) return;
          d = setTimeout(() => i.show(), e);
        } else l = true, u !== null && a.cancelAnimationFrame(u), n || g(), n.parentElement || c.body.appendChild(n), n.style.opacity = 1, n.hidden = false, i.progress(0), r.autoRun && (function t() {
          f = a.requestAnimationFrame(t), i.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(o), 2));
        })();
      }, progress: function(e) {
        return typeof e > "u" || (typeof e == "string" && (e = (e.indexOf("+") >= 0 || e.indexOf("-") >= 0 ? o : 0) + parseFloat(e)), o = e > 1 ? 1 : e, h()), o;
      }, hide: function() {
        clearTimeout(d), d = null, l && (l = false, f != null && (a.cancelAnimationFrame(f), f = null), (function e() {
          if (i.progress("+.1") >= 1 && (n.style.opacity -= 0.05, n.style.opacity <= 0.05)) {
            n.hidden = true, u = null;
            return;
          }
          u = a.requestAnimationFrame(e);
        })());
      } };
      typeof module == "object" && typeof module.exports == "object" ? module.exports = i : typeof define == "function" && define.amd ? define(function() {
        return i;
      }) : this.topbar = i;
    }).call(exports, window, document);
  }
});

// js/app.js
var import_topbar = __toESM(require_topbar_min());

// js/hooks/copy_to_clipboard.js
var CopyToClipboard = {
  mounted() {
    this.el.addEventListener("click", () => {
      const targetId = this.el.getAttribute("data-copy-target");
      const target = document.getElementById(targetId);
      if (target) {
        navigator.clipboard.writeText(target.textContent).then(() => {
          const original = this.el.textContent;
          this.el.textContent = "Copied!";
          setTimeout(() => {
            this.el.textContent = original;
          }, 1500);
        });
      }
    });
  }
};
var copy_to_clipboard_default = CopyToClipboard;

// js/hooks/autocomplete.js
var AutocompleteHook = {
  mounted() {
    this.input = this.el.querySelector("[data-input]");
    this.dropdown = this.el.querySelector("[data-dropdown]");
    this.emptyItem = this.dropdown.querySelector("[data-empty]");
    this.debounceMs = parseInt(this.el.dataset.debounce) || 300;
    this.onSelect = this.el.dataset.onSelect;
    this.onSearch = this.el.dataset.onSearch;
    this.highlightIndex = -1;
    this.debounceTimer = null;
    this.isOpen = false;
    this.input.addEventListener("input", () => this.onInput());
    this.input.addEventListener("focus", () => this.open());
    this.input.addEventListener("keydown", (e) => this.onKeydown(e));
    this._onDropdownMousedown = (e) => this.onDropdownClick(e);
    this.dropdown.addEventListener("mousedown", this._onDropdownMousedown);
    this._onClickOutside = (e) => {
      if (!this.el.contains(e.target) && !this.dropdown.contains(e.target)) this.close();
    };
    document.addEventListener("mousedown", this._onClickOutside);
    this._onScroll = () => {
      if (this.isOpen) this.positionDropdown();
    };
    window.addEventListener("scroll", this._onScroll, true);
    window.addEventListener("resize", this._onScroll);
  },
  destroyed() {
    document.removeEventListener("mousedown", this._onClickOutside);
    window.removeEventListener("scroll", this._onScroll, true);
    window.removeEventListener("resize", this._onScroll);
    clearTimeout(this.debounceTimer);
  },
  updated() {
    const newDropdown = this.el.querySelector("[data-dropdown]");
    if (newDropdown !== this.dropdown) {
      this.dropdown.removeEventListener("mousedown", this._onDropdownMousedown);
      this.dropdown = newDropdown;
      this.dropdown.addEventListener("mousedown", this._onDropdownMousedown);
    }
    this.emptyItem = this.dropdown.querySelector("[data-empty]");
    this.onSearch = this.el.dataset.onSearch;
    this.onSelect = this.el.dataset.onSelect;
    if (this._justSelected) {
      this._justSelected = false;
      if (!this.el.dataset.value) {
        this.input.value = "";
      }
    }
    this.filterItems();
    if (this.isOpen) this.open();
  },
  onInput() {
    this.highlightIndex = -1;
    this.filterItems();
    this.open();
    clearTimeout(this.debounceTimer);
    if (this.onSearch) {
      this.debounceTimer = setTimeout(() => {
        this.pushEventTo(this.el, this.onSearch, { query: this.input.value });
      }, this.debounceMs);
    }
  },
  filterItems() {
    const query = this.input.value.toLowerCase();
    const items = this.getItems();
    let visibleCount = 0;
    items.forEach((li) => {
      const match = li.dataset.filter.includes(query);
      li.classList.toggle("hidden", !match);
      li.classList.remove("bg-base-300");
      if (match) visibleCount++;
    });
    if (this.emptyItem) {
      this.emptyItem.classList.toggle("hidden", visibleCount > 0);
    }
  },
  onKeydown(e) {
    const items = this.getVisibleItems();
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.highlightIndex = Math.min(this.highlightIndex + 1, items.length - 1);
        this.applyHighlight(items);
        this.open();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.highlightIndex = Math.max(this.highlightIndex - 1, 0);
        this.applyHighlight(items);
        break;
      case "Enter":
        e.preventDefault();
        if (this.highlightIndex >= 0 && items[this.highlightIndex]) {
          this.selectItem(items[this.highlightIndex]);
        }
        break;
      case "Escape":
        this.close();
        this.input.blur();
        break;
    }
  },
  onDropdownClick(e) {
    const li = e.target.closest("li[data-value]");
    if (li) this.selectItem(li);
  },
  selectItem(li) {
    const value = li.dataset.value;
    const label = li.dataset.label;
    this.input.value = label;
    this._justSelected = true;
    this.pushEventTo(this.el, this.onSelect, { value, label });
    this.close();
    this.highlightIndex = -1;
  },
  positionDropdown() {
  },
  open() {
    this.isOpen = true;
    this.positionDropdown();
    this.dropdown.classList.remove("hidden");
  },
  close() {
    this.isOpen = false;
    this.dropdown.classList.add("hidden");
    this.highlightIndex = -1;
  },
  getItems() {
    return Array.from(this.dropdown.querySelectorAll("li[data-value]"));
  },
  getVisibleItems() {
    return this.getItems().filter((li) => !li.classList.contains("hidden"));
  },
  applyHighlight(items) {
    items.forEach((li, i) => {
      li.classList.toggle("bg-base-300", i === this.highlightIndex);
      if (i === this.highlightIndex) {
        li.scrollIntoView({ block: "nearest" });
      }
    });
  }
};
var autocomplete_default = AutocompleteHook;

// js/hooks/builder_persist.js
var STORAGE_KEY = "runcom:builder:draft";
var BuilderPersist = {
  mounted() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.pushEvent("restore_state", state);
      } catch (_e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    this.handleEvent("builder_state_changed", (state) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });
    this.handleEvent("builder_state_cleared", () => {
      localStorage.removeItem(STORAGE_KEY);
    });
  },
  destroyed() {
  }
};
var builder_persist_default = BuilderPersist;

// js/hooks/sidebar_resize.js
var SidebarResize = {
  mounted() {
    this.handle = this.el.querySelector("[data-resize-handle]");
    if (!this.handle) return;
    this.sidebar = this.el;
    this.minWidth = 200;
    this.maxWidth = 500;
    this.dragging = false;
    this.onMouseDown = (e) => {
      e.preventDefault();
      this.dragging = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };
    this.onMouseMove = (e) => {
      if (!this.dragging) return;
      const rect = this.sidebar.parentElement.getBoundingClientRect();
      const width = Math.min(this.maxWidth, Math.max(this.minWidth, e.clientX - rect.left));
      this.sidebar.style.width = width + "px";
    };
    this.onMouseUp = () => {
      if (!this.dragging) return;
      this.dragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    this.handle.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  },
  destroyed() {
    if (this.handle) {
      this.handle.removeEventListener("mousedown", this.onMouseDown);
    }
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }
};
var sidebar_resize_default = SidebarResize;

// js/hooks/panel_resize.js
var PanelResize = {
  mounted() {
    this.handle = this.el.querySelector("[data-resize-handle]");
    if (!this.handle) return;
    this.panel = this.el;
    this.minHeight = parseInt(this.el.dataset.minHeight || "128", 10);
    this.maxHeight = parseInt(this.el.dataset.maxHeight || "600", 10);
    this.dragging = false;
    this.onMouseDown = (e) => {
      e.preventDefault();
      this.dragging = true;
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    };
    this.onMouseMove = (e) => {
      if (!this.dragging) return;
      const rect = this.panel.getBoundingClientRect();
      const height = Math.min(this.maxHeight, Math.max(this.minHeight, e.clientY - rect.top));
      this.panel.style.height = height + "px";
    };
    this.onMouseUp = () => {
      if (!this.dragging) return;
      this.dragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    this.handle.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  },
  destroyed() {
    if (this.handle) {
      this.handle.removeEventListener("mousedown", this.onMouseDown);
    }
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }
};
var panel_resize_default = PanelResize;

// js/hooks.js
var SvelteHook = {
  mounted() {
    const name = this.el.dataset.name;
    if (name === "DagViewer" && window.__runcom_dag) {
      this._destroy = window.__runcom_dag.mount(this.el, this);
    }
  },
  updated() {
    if (this._onUpdate) this._onUpdate();
  },
  destroyed() {
    if (this._destroy) this._destroy();
  }
};
var AsciinemaPlayerHook = {
  mounted() {
    if (window.__runcom_player) {
      this._destroy = window.__runcom_player.mount(this.el);
    }
  },
  destroyed() {
    if (this._destroy) this._destroy();
  }
};
var hooks = {
  RuncomWebSvelteHook: SvelteHook,
  CopyToClipboard: copy_to_clipboard_default,
  AutocompleteHook: autocomplete_default,
  BuilderPersist: builder_persist_default,
  SidebarResize: sidebar_resize_default,
  PanelResize: panel_resize_default,
  AsciinemaPlayerHook
};

// js/app.js
import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", () => import_topbar.default.show(300));
window.addEventListener("phx:page-loading-stop", () => import_topbar.default.hide());
var transitionEls = [];
var transitionTypes = [];
var transitionTarget = null;
var scheduleTransition = null;
function setChildVtNames(el) {
  el.querySelectorAll("[data-vt]").forEach((child) => {
    child.style.viewTransitionName = child.dataset.vt;
  });
}
function clearChildVtNames(el) {
  el.querySelectorAll("[data-vt]").forEach((child) => {
    child.style.viewTransitionName = "";
  });
}
window.addEventListener("phx:start-view-transition", (e) => {
  const opts = e.detail;
  if (opts.temp_name && e.target !== window) {
    e.target.style.viewTransitionName = opts.temp_name;
    setChildVtNames(e.target);
    transitionEls.push(e.target);
  }
  if (opts.target) {
    transitionTarget = { selector: opts.target, name: opts.temp_name };
  }
  if (opts.type) {
    transitionTypes.push(opts.type);
  }
  scheduleTransition = true;
});
var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
var liveTran = document.querySelector("meta[name='live-transport']").getAttribute("content");
var livePath = document.querySelector("meta[name='live-path']").getAttribute("content");
var liveSocket = new LiveView.LiveSocket(livePath, Phoenix.Socket, {
  transport: liveTran === "longpoll" ? Phoenix.LongPoll : WebSocket,
  params: { _csrf_token: csrfToken },
  hooks,
  dom: {
    onDocumentPatch(start) {
      const savedTarget = transitionTarget;
      const update = () => {
        transitionEls.forEach((el) => {
          el.style.viewTransitionName = "";
          clearChildVtNames(el);
        });
        transitionEls = [];
        transitionTypes = [];
        transitionTarget = null;
        scheduleTransition = null;
        start();
        if (savedTarget) {
          const el = document.querySelector(savedTarget.selector);
          if (el) {
            el.style.viewTransitionName = savedTarget.name;
            setChildVtNames(el);
          }
        }
      };
      if (transitionEls.length !== 0 || scheduleTransition) {
        let vt;
        try {
          vt = document.startViewTransition({
            update,
            types: transitionTypes.length ? transitionTypes : ["same-document"]
          });
        } catch (error) {
          vt = document.startViewTransition(update);
        }
        if (vt && savedTarget) {
          vt.finished.then(() => {
            const el = document.querySelector(savedTarget.selector);
            if (el) {
              el.style.viewTransitionName = "";
              clearChildVtNames(el);
            }
          }).catch(() => {
          });
        }
      } else {
        update();
      }
    }
  }
});
liveSocket.connect();
/*! Bundled license information:

topbar/topbar.min.js:
  (**
   * @license MIT
   * topbar 3.0.1
   * http://buunguyen.github.io/topbar
   * Copyright (c) 2026 Buu Nguyen
   *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy90b3BiYXIvdG9wYmFyLm1pbi5qcyIsICIuLi8uLi9hc3NldHMvanMvYXBwLmpzIiwgIi4uLy4uL2Fzc2V0cy9qcy9ob29rcy9jb3B5X3RvX2NsaXBib2FyZC5qcyIsICIuLi8uLi9hc3NldHMvanMvaG9va3MvYXV0b2NvbXBsZXRlLmpzIiwgIi4uLy4uL2Fzc2V0cy9qcy9ob29rcy9idWlsZGVyX3BlcnNpc3QuanMiLCAiLi4vLi4vYXNzZXRzL2pzL2hvb2tzL3NpZGViYXJfcmVzaXplLmpzIiwgIi4uLy4uL2Fzc2V0cy9qcy9ob29rcy9wYW5lbF9yZXNpemUuanMiLCAiLi4vLi4vYXNzZXRzL2pzL2hvb2tzLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogdG9wYmFyIDMuMC4xXG4gKiBodHRwOi8vYnV1bmd1eWVuLmdpdGh1Yi5pby90b3BiYXJcbiAqIENvcHlyaWdodCAoYykgMjAyNiBCdXUgTmd1eWVuXG4gKi8oZnVuY3Rpb24oYSxjKXtcInVzZSBzdHJpY3RcIjt2YXIgbixvLGwsZj1udWxsLHU9bnVsbCxkPW51bGwscD1mdW5jdGlvbihlLHQscyl7ZS5hZGRFdmVudExpc3RlbmVyP2UuYWRkRXZlbnRMaXN0ZW5lcih0LHMsITEpOmUuYXR0YWNoRXZlbnQ/ZS5hdHRhY2hFdmVudChcIm9uXCIrdCxzKTplW1wib25cIit0XT1zfSxyPXthdXRvUnVuOiEwLGJhclRoaWNrbmVzczozLGJhckNvbG9yczp7MDpcInJnYmEoMjYsICAxODgsIDE1NiwgLjkpXCIsXCIuMjVcIjpcInJnYmEoNTIsICAxNTIsIDIxOSwgLjkpXCIsXCIuNTBcIjpcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXCIuNzVcIjpcInJnYmEoMjMwLCAxMjYsIDM0LCAgLjkpXCIsXCIxLjBcIjpcInJnYmEoMjExLCA4NCwgIDAsICAgLjkpXCJ9LHNoYWRvd0JsdXI6MTAsc2hhZG93Q29sb3I6XCJyZ2JhKDAsICAgMCwgICAwLCAgIC42KVwiLGNsYXNzTmFtZTpudWxsfSxoPWZ1bmN0aW9uKCl7bi53aWR0aD1hLmlubmVyV2lkdGgsbi5oZWlnaHQ9ci5iYXJUaGlja25lc3MqNTt2YXIgZT1uLmdldENvbnRleHQoXCIyZFwiKTtlLnNoYWRvd0JsdXI9ci5zaGFkb3dCbHVyLGUuc2hhZG93Q29sb3I9ci5zaGFkb3dDb2xvcjt2YXIgdD1lLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsMCxuLndpZHRoLDApO2Zvcih2YXIgcyBpbiByLmJhckNvbG9ycyl0LmFkZENvbG9yU3RvcChzLHIuYmFyQ29sb3JzW3NdKTtlLmxpbmVXaWR0aD1yLmJhclRoaWNrbmVzcyxlLmJlZ2luUGF0aCgpLGUubW92ZVRvKDAsci5iYXJUaGlja25lc3MvMiksZS5saW5lVG8oTWF0aC5jZWlsKG8qbi53aWR0aCksci5iYXJUaGlja25lc3MvMiksZS5zdHJva2VTdHlsZT10LGUuc3Ryb2tlKCl9LGc9ZnVuY3Rpb24oKXtuPWMuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxuLnJvbGU9XCJwcmVzZW50YXRpb25cIjt2YXIgZT1uLnN0eWxlO2UucG9zaXRpb249XCJmaXhlZFwiLGUudG9wPWUubGVmdD1lLnJpZ2h0PWUubWFyZ2luPWUucGFkZGluZz0wLGUuekluZGV4PTEwMDAwMSxuLmhpZGRlbj0hMCxyLmNsYXNzTmFtZSYmbi5jbGFzc0xpc3QuYWRkKHIuY2xhc3NOYW1lKSxwKGEsXCJyZXNpemVcIixoKX0saT17Y29uZmlnOmZ1bmN0aW9uKGUpe2Zvcih2YXIgdCBpbiBlKXIuaGFzT3duUHJvcGVydHkodCkmJihyW3RdPWVbdF0pfSxzaG93OmZ1bmN0aW9uKGUpe2lmKCFsKWlmKGUpe2lmKGQpcmV0dXJuO2Q9c2V0VGltZW91dCgoKT0+aS5zaG93KCksZSl9ZWxzZSBsPSEwLHUhPT1udWxsJiZhLmNhbmNlbEFuaW1hdGlvbkZyYW1lKHUpLG58fGcoKSxuLnBhcmVudEVsZW1lbnR8fGMuYm9keS5hcHBlbmRDaGlsZChuKSxuLnN0eWxlLm9wYWNpdHk9MSxuLmhpZGRlbj0hMSxpLnByb2dyZXNzKDApLHIuYXV0b1J1biYmZnVuY3Rpb24gdCgpe2Y9YS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodCksaS5wcm9ncmVzcyhcIitcIisuMDUqTWF0aC5wb3coMS1NYXRoLnNxcnQobyksMikpfSgpfSxwcm9ncmVzczpmdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGU+XCJ1XCJ8fCh0eXBlb2YgZT09XCJzdHJpbmdcIiYmKGU9KGUuaW5kZXhPZihcIitcIik+PTB8fGUuaW5kZXhPZihcIi1cIik+PTA/bzowKStwYXJzZUZsb2F0KGUpKSxvPWU+MT8xOmUsaCgpKSxvfSxoaWRlOmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGQpLGQ9bnVsbCxsJiYobD0hMSxmIT1udWxsJiYoYS5jYW5jZWxBbmltYXRpb25GcmFtZShmKSxmPW51bGwpLGZ1bmN0aW9uIGUoKXtpZihpLnByb2dyZXNzKFwiKy4xXCIpPj0xJiYobi5zdHlsZS5vcGFjaXR5LT0uMDUsbi5zdHlsZS5vcGFjaXR5PD0uMDUpKXtuLmhpZGRlbj0hMCx1PW51bGw7cmV0dXJufXU9YS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZSl9KCkpfX07dHlwZW9mIG1vZHVsZT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZS5leHBvcnRzPT1cIm9iamVjdFwiP21vZHVsZS5leHBvcnRzPWk6dHlwZW9mIGRlZmluZT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kP2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpfSk6dGhpcy50b3BiYXI9aX0pLmNhbGwodGhpcyx3aW5kb3csZG9jdW1lbnQpO1xuIiwgImltcG9ydCB0b3BiYXIgZnJvbSBcInRvcGJhclwiXG5pbXBvcnQgeyBob29rcyB9IGZyb20gXCIuL2hvb2tzXCJcblxudG9wYmFyLmNvbmZpZyh7IGJhckNvbG9yczogeyAwOiBcIiMyOWRcIiB9LCBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsIDAsIDAsIC4zKVwiIH0pXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwgKCkgPT4gdG9wYmFyLnNob3coMzAwKSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsICgpID0+IHRvcGJhci5oaWRlKCkpXG5cbi8vIFZpZXcgVHJhbnNpdGlvbiBzdXBwb3J0XG5sZXQgdHJhbnNpdGlvbkVscyA9IFtdXG5sZXQgdHJhbnNpdGlvblR5cGVzID0gW11cbmxldCB0cmFuc2l0aW9uVGFyZ2V0ID0gbnVsbFxubGV0IHNjaGVkdWxlVHJhbnNpdGlvbiA9IG51bGxcblxuZnVuY3Rpb24gc2V0Q2hpbGRWdE5hbWVzKGVsKSB7XG4gIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS12dF1cIikuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICBjaGlsZC5zdHlsZS52aWV3VHJhbnNpdGlvbk5hbWUgPSBjaGlsZC5kYXRhc2V0LnZ0XG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyQ2hpbGRWdE5hbWVzKGVsKSB7XG4gIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS12dF1cIikuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICBjaGlsZC5zdHlsZS52aWV3VHJhbnNpdGlvbk5hbWUgPSBcIlwiXG4gIH0pXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnN0YXJ0LXZpZXctdHJhbnNpdGlvblwiLCAoZSkgPT4ge1xuICBjb25zdCBvcHRzID0gZS5kZXRhaWxcbiAgaWYgKG9wdHMudGVtcF9uYW1lICYmIGUudGFyZ2V0ICE9PSB3aW5kb3cpIHtcbiAgICBlLnRhcmdldC5zdHlsZS52aWV3VHJhbnNpdGlvbk5hbWUgPSBvcHRzLnRlbXBfbmFtZVxuICAgIHNldENoaWxkVnROYW1lcyhlLnRhcmdldClcbiAgICB0cmFuc2l0aW9uRWxzLnB1c2goZS50YXJnZXQpXG4gIH1cbiAgaWYgKG9wdHMudGFyZ2V0KSB7XG4gICAgdHJhbnNpdGlvblRhcmdldCA9IHsgc2VsZWN0b3I6IG9wdHMudGFyZ2V0LCBuYW1lOiBvcHRzLnRlbXBfbmFtZSB9XG4gIH1cbiAgaWYgKG9wdHMudHlwZSkge1xuICAgIHRyYW5zaXRpb25UeXBlcy5wdXNoKG9wdHMudHlwZSlcbiAgfVxuICBzY2hlZHVsZVRyYW5zaXRpb24gPSB0cnVlXG59KVxuXG4vLyBNb3VudGluZyBcdTIwMTQgUGhvZW5peCBnbG9iYWxzIGFyZSBwcm92aWRlZCBieSBjb25jYXRlbmF0ZWQgc2NyaXB0c1xuY29uc3QgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmNvbnN0IGxpdmVUcmFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nbGl2ZS10cmFuc3BvcnQnXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXG5jb25zdCBsaXZlUGF0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9J2xpdmUtcGF0aCddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcblxuY29uc3QgbGl2ZVNvY2tldCA9IG5ldyBMaXZlVmlldy5MaXZlU29ja2V0KGxpdmVQYXRoLCBQaG9lbml4LlNvY2tldCwge1xuICB0cmFuc3BvcnQ6IGxpdmVUcmFuID09PSBcImxvbmdwb2xsXCIgPyBQaG9lbml4LkxvbmdQb2xsIDogV2ViU29ja2V0LFxuICBwYXJhbXM6IHsgX2NzcmZfdG9rZW46IGNzcmZUb2tlbiB9LFxuICBob29rczogaG9va3MsXG4gIGRvbToge1xuICAgIG9uRG9jdW1lbnRQYXRjaChzdGFydCkge1xuICAgICAgY29uc3Qgc2F2ZWRUYXJnZXQgPSB0cmFuc2l0aW9uVGFyZ2V0XG5cbiAgICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdHJhbnNpdGlvbkVscy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGVsLnN0eWxlLnZpZXdUcmFuc2l0aW9uTmFtZSA9IFwiXCJcbiAgICAgICAgICBjbGVhckNoaWxkVnROYW1lcyhlbClcbiAgICAgICAgfSlcbiAgICAgICAgdHJhbnNpdGlvbkVscyA9IFtdXG4gICAgICAgIHRyYW5zaXRpb25UeXBlcyA9IFtdXG4gICAgICAgIHRyYW5zaXRpb25UYXJnZXQgPSBudWxsXG4gICAgICAgIHNjaGVkdWxlVHJhbnNpdGlvbiA9IG51bGxcbiAgICAgICAgc3RhcnQoKVxuXG4gICAgICAgIGlmIChzYXZlZFRhcmdldCkge1xuICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzYXZlZFRhcmdldC5zZWxlY3RvcilcbiAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLnZpZXdUcmFuc2l0aW9uTmFtZSA9IHNhdmVkVGFyZ2V0Lm5hbWVcbiAgICAgICAgICAgIHNldENoaWxkVnROYW1lcyhlbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRyYW5zaXRpb25FbHMubGVuZ3RoICE9PSAwIHx8IHNjaGVkdWxlVHJhbnNpdGlvbikge1xuICAgICAgICBsZXQgdnRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2dCA9IGRvY3VtZW50LnN0YXJ0Vmlld1RyYW5zaXRpb24oe1xuICAgICAgICAgICAgdXBkYXRlLFxuICAgICAgICAgICAgdHlwZXM6IHRyYW5zaXRpb25UeXBlcy5sZW5ndGggPyB0cmFuc2l0aW9uVHlwZXMgOiBbXCJzYW1lLWRvY3VtZW50XCJdLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdnQgPSBkb2N1bWVudC5zdGFydFZpZXdUcmFuc2l0aW9uKHVwZGF0ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2dCAmJiBzYXZlZFRhcmdldCkge1xuICAgICAgICAgIHZ0LmZpbmlzaGVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNhdmVkVGFyZ2V0LnNlbGVjdG9yKVxuICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgIGVsLnN0eWxlLnZpZXdUcmFuc2l0aW9uTmFtZSA9IFwiXCJcbiAgICAgICAgICAgICAgY2xlYXJDaGlsZFZ0TmFtZXMoZWwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge30pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuXG5saXZlU29ja2V0LmNvbm5lY3QoKVxuIiwgImNvbnN0IENvcHlUb0NsaXBib2FyZCA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRJZCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb3B5LXRhcmdldFwiKVxuICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0SWQpXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRhcmdldC50ZXh0Q29udGVudCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSB0aGlzLmVsLnRleHRDb250ZW50XG4gICAgICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IFwiQ29waWVkIVwiXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuZWwudGV4dENvbnRlbnQgPSBvcmlnaW5hbCB9LCAxNTAwKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29weVRvQ2xpcGJvYXJkXG4iLCAiY29uc3QgQXV0b2NvbXBsZXRlSG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLmlucHV0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5wdXRdXCIpXG4gICAgdGhpcy5kcm9wZG93biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIltkYXRhLWRyb3Bkb3duXVwiKVxuICAgIHRoaXMuZW1wdHlJdGVtID0gdGhpcy5kcm9wZG93bi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZW1wdHldXCIpXG4gICAgdGhpcy5kZWJvdW5jZU1zID0gcGFyc2VJbnQodGhpcy5lbC5kYXRhc2V0LmRlYm91bmNlKSB8fCAzMDBcbiAgICB0aGlzLm9uU2VsZWN0ID0gdGhpcy5lbC5kYXRhc2V0Lm9uU2VsZWN0XG4gICAgdGhpcy5vblNlYXJjaCA9IHRoaXMuZWwuZGF0YXNldC5vblNlYXJjaFxuICAgIHRoaXMuaGlnaGxpZ2h0SW5kZXggPSAtMVxuICAgIHRoaXMuZGVib3VuY2VUaW1lciA9IG51bGxcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlXG5cbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB0aGlzLm9uSW5wdXQoKSlcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB0aGlzLm9wZW4oKSlcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB0aGlzLm9uS2V5ZG93bihlKSlcbiAgICB0aGlzLl9vbkRyb3Bkb3duTW91c2Vkb3duID0gKGUpID0+IHRoaXMub25Ecm9wZG93bkNsaWNrKGUpXG4gICAgdGhpcy5kcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuX29uRHJvcGRvd25Nb3VzZWRvd24pXG5cbiAgICB0aGlzLl9vbkNsaWNrT3V0c2lkZSA9IChlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZWwuY29udGFpbnMoZS50YXJnZXQpICYmICF0aGlzLmRyb3Bkb3duLmNvbnRhaW5zKGUudGFyZ2V0KSkgdGhpcy5jbG9zZSgpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5fb25DbGlja091dHNpZGUpXG5cbiAgICB0aGlzLl9vblNjcm9sbCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzT3BlbikgdGhpcy5wb3NpdGlvbkRyb3Bkb3duKClcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5fb25TY3JvbGwsIHRydWUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fb25TY3JvbGwpXG4gIH0sXG5cbiAgZGVzdHJveWVkKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5fb25DbGlja091dHNpZGUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5fb25TY3JvbGwsIHRydWUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fb25TY3JvbGwpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVib3VuY2VUaW1lcilcbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIGNvbnN0IG5ld0Ryb3Bkb3duID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZHJvcGRvd25dXCIpXG4gICAgaWYgKG5ld0Ryb3Bkb3duICE9PSB0aGlzLmRyb3Bkb3duKSB7XG4gICAgICB0aGlzLmRyb3Bkb3duLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5fb25Ecm9wZG93bk1vdXNlZG93bilcbiAgICAgIHRoaXMuZHJvcGRvd24gPSBuZXdEcm9wZG93blxuICAgICAgdGhpcy5kcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuX29uRHJvcGRvd25Nb3VzZWRvd24pXG4gICAgfVxuICAgIHRoaXMuZW1wdHlJdGVtID0gdGhpcy5kcm9wZG93bi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZW1wdHldXCIpXG4gICAgdGhpcy5vblNlYXJjaCA9IHRoaXMuZWwuZGF0YXNldC5vblNlYXJjaFxuICAgIHRoaXMub25TZWxlY3QgPSB0aGlzLmVsLmRhdGFzZXQub25TZWxlY3RcblxuICAgIGlmICh0aGlzLl9qdXN0U2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX2p1c3RTZWxlY3RlZCA9IGZhbHNlXG4gICAgICAvLyBJbiBhZGQgbW9kZSAobm8gZGF0YS12YWx1ZSBmcm9tIHNlcnZlciksIGNsZWFyIGlucHV0IGZvciBuZXh0IHBpY2tcbiAgICAgIGlmICghdGhpcy5lbC5kYXRhc2V0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBcIlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJJdGVtcygpXG4gICAgaWYgKHRoaXMuaXNPcGVuKSB0aGlzLm9wZW4oKVxuICB9LFxuXG4gIG9uSW5wdXQoKSB7XG4gICAgdGhpcy5oaWdobGlnaHRJbmRleCA9IC0xXG4gICAgdGhpcy5maWx0ZXJJdGVtcygpXG4gICAgdGhpcy5vcGVuKClcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmRlYm91bmNlVGltZXIpXG4gICAgaWYgKHRoaXMub25TZWFyY2gpIHtcbiAgICAgIHRoaXMuZGVib3VuY2VUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnB1c2hFdmVudFRvKHRoaXMuZWwsIHRoaXMub25TZWFyY2gsIHsgcXVlcnk6IHRoaXMuaW5wdXQudmFsdWUgfSlcbiAgICAgIH0sIHRoaXMuZGVib3VuY2VNcylcbiAgICB9XG4gIH0sXG5cbiAgZmlsdGVySXRlbXMoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmlucHV0LnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuZ2V0SXRlbXMoKVxuICAgIGxldCB2aXNpYmxlQ291bnQgPSAwXG5cbiAgICBpdGVtcy5mb3JFYWNoKChsaSkgPT4ge1xuICAgICAgY29uc3QgbWF0Y2ggPSBsaS5kYXRhc2V0LmZpbHRlci5pbmNsdWRlcyhxdWVyeSlcbiAgICAgIGxpLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIiwgIW1hdGNoKVxuICAgICAgbGkuY2xhc3NMaXN0LnJlbW92ZShcImJnLWJhc2UtMzAwXCIpXG4gICAgICBpZiAobWF0Y2gpIHZpc2libGVDb3VudCsrXG4gICAgfSlcblxuICAgIGlmICh0aGlzLmVtcHR5SXRlbSkge1xuICAgICAgdGhpcy5lbXB0eUl0ZW0uY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiLCB2aXNpYmxlQ291bnQgPiAwKVxuICAgIH1cbiAgfSxcblxuICBvbktleWRvd24oZSkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5nZXRWaXNpYmxlSXRlbXMoKVxuXG4gICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5oaWdobGlnaHRJbmRleCA9IE1hdGgubWluKHRoaXMuaGlnaGxpZ2h0SW5kZXggKyAxLCBpdGVtcy5sZW5ndGggLSAxKVxuICAgICAgICB0aGlzLmFwcGx5SGlnaGxpZ2h0KGl0ZW1zKVxuICAgICAgICB0aGlzLm9wZW4oKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIkFycm93VXBcIjpcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0SW5kZXggPSBNYXRoLm1heCh0aGlzLmhpZ2hsaWdodEluZGV4IC0gMSwgMClcbiAgICAgICAgdGhpcy5hcHBseUhpZ2hsaWdodChpdGVtcylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJFbnRlclwiOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0SW5kZXggPj0gMCAmJiBpdGVtc1t0aGlzLmhpZ2hsaWdodEluZGV4XSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShpdGVtc1t0aGlzLmhpZ2hsaWdodEluZGV4XSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIkVzY2FwZVwiOlxuICAgICAgICB0aGlzLmNsb3NlKClcbiAgICAgICAgdGhpcy5pbnB1dC5ibHVyKClcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0sXG5cbiAgb25Ecm9wZG93bkNsaWNrKGUpIHtcbiAgICBjb25zdCBsaSA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJsaVtkYXRhLXZhbHVlXVwiKVxuICAgIGlmIChsaSkgdGhpcy5zZWxlY3RJdGVtKGxpKVxuICB9LFxuXG4gIHNlbGVjdEl0ZW0obGkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGxpLmRhdGFzZXQudmFsdWVcbiAgICBjb25zdCBsYWJlbCA9IGxpLmRhdGFzZXQubGFiZWxcblxuICAgIHRoaXMuaW5wdXQudmFsdWUgPSBsYWJlbFxuICAgIHRoaXMuX2p1c3RTZWxlY3RlZCA9IHRydWVcblxuICAgIHRoaXMucHVzaEV2ZW50VG8odGhpcy5lbCwgdGhpcy5vblNlbGVjdCwgeyB2YWx1ZSwgbGFiZWwgfSlcbiAgICB0aGlzLmNsb3NlKClcbiAgICB0aGlzLmhpZ2hsaWdodEluZGV4ID0gLTFcbiAgfSxcblxuICBwb3NpdGlvbkRyb3Bkb3duKCkge30sXG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWVcbiAgICB0aGlzLnBvc2l0aW9uRHJvcGRvd24oKVxuICAgIHRoaXMuZHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxuICB9LFxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICB0aGlzLmRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIilcbiAgICB0aGlzLmhpZ2hsaWdodEluZGV4ID0gLTFcbiAgfSxcblxuICBnZXRJdGVtcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRyb3Bkb3duLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXZhbHVlXVwiKSlcbiAgfSxcblxuICBnZXRWaXNpYmxlSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbXMoKS5maWx0ZXIoKGxpKSA9PiAhbGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZGVuXCIpKVxuICB9LFxuXG4gIGFwcGx5SGlnaGxpZ2h0KGl0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgobGksIGkpID0+IHtcbiAgICAgIGxpLmNsYXNzTGlzdC50b2dnbGUoXCJiZy1iYXNlLTMwMFwiLCBpID09PSB0aGlzLmhpZ2hsaWdodEluZGV4KVxuICAgICAgaWYgKGkgPT09IHRoaXMuaGlnaGxpZ2h0SW5kZXgpIHtcbiAgICAgICAgbGkuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogXCJuZWFyZXN0XCIgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvY29tcGxldGVIb29rXG4iLCAiY29uc3QgU1RPUkFHRV9LRVkgPSBcInJ1bmNvbTpidWlsZGVyOmRyYWZ0XCJcblxuY29uc3QgQnVpbGRlclBlcnNpc3QgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWSlcbiAgICBpZiAoc2F2ZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gSlNPTi5wYXJzZShzYXZlZClcbiAgICAgICAgdGhpcy5wdXNoRXZlbnQoXCJyZXN0b3JlX3N0YXRlXCIsIHN0YXRlKVxuICAgICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oU1RPUkFHRV9LRVkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVFdmVudChcImJ1aWxkZXJfc3RhdGVfY2hhbmdlZFwiLCAoc3RhdGUpID0+IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpXG4gICAgfSlcblxuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJidWlsZGVyX3N0YXRlX2NsZWFyZWRcIiwgKCkgPT4ge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oU1RPUkFHRV9LRVkpXG4gICAgfSlcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdWlsZGVyUGVyc2lzdFxuIiwgImNvbnN0IFNpZGViYXJSZXNpemUgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYW5kbGUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yZXNpemUtaGFuZGxlXVwiKVxuICAgIGlmICghdGhpcy5oYW5kbGUpIHJldHVyblxuXG4gICAgdGhpcy5zaWRlYmFyID0gdGhpcy5lbFxuICAgIHRoaXMubWluV2lkdGggPSAyMDBcbiAgICB0aGlzLm1heFdpZHRoID0gNTAwXG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG5cbiAgICB0aGlzLm9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJjb2wtcmVzaXplXCJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwibm9uZVwiXG4gICAgfVxuXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuc2lkZWJhci5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCB3aWR0aCA9IE1hdGgubWluKHRoaXMubWF4V2lkdGgsIE1hdGgubWF4KHRoaXMubWluV2lkdGgsIGUuY2xpZW50WCAtIHJlY3QubGVmdCkpXG4gICAgICB0aGlzLnNpZGViYXIuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIlxuICAgIH1cblxuICAgIHRoaXMub25Nb3VzZVVwID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcIlwiXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBcIlwiXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcClcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlKSB7XG4gICAgICB0aGlzLmhhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24pXG4gICAgfVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSlcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlYmFyUmVzaXplXG4iLCAiY29uc3QgUGFuZWxSZXNpemUgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYW5kbGUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yZXNpemUtaGFuZGxlXVwiKVxuICAgIGlmICghdGhpcy5oYW5kbGUpIHJldHVyblxuXG4gICAgdGhpcy5wYW5lbCA9IHRoaXMuZWxcbiAgICB0aGlzLm1pbkhlaWdodCA9IHBhcnNlSW50KHRoaXMuZWwuZGF0YXNldC5taW5IZWlnaHQgfHwgXCIxMjhcIiwgMTApXG4gICAgdGhpcy5tYXhIZWlnaHQgPSBwYXJzZUludCh0aGlzLmVsLmRhdGFzZXQubWF4SGVpZ2h0IHx8IFwiNjAwXCIsIDEwKVxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy5vbk1vdXNlRG93biA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwicm93LXJlc2l6ZVwiXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBcIm5vbmVcIlxuICAgIH1cblxuICAgIHRoaXMub25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBhbmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1heEhlaWdodCwgTWF0aC5tYXgodGhpcy5taW5IZWlnaHQsIGUuY2xpZW50WSAtIHJlY3QudG9wKSlcbiAgICAgIHRoaXMucGFuZWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiXG4gICAgfVxuXG4gICAgdGhpcy5vbk1vdXNlVXAgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwiXCJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwiXCJcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24pXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKVxuICB9LFxuXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5oYW5kbGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93bilcbiAgICB9XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsUmVzaXplXG4iLCAiaW1wb3J0IENvcHlUb0NsaXBib2FyZCBmcm9tIFwiLi9ob29rcy9jb3B5X3RvX2NsaXBib2FyZFwiXG5pbXBvcnQgQXV0b2NvbXBsZXRlSG9vayBmcm9tIFwiLi9ob29rcy9hdXRvY29tcGxldGVcIlxuaW1wb3J0IEJ1aWxkZXJQZXJzaXN0IGZyb20gXCIuL2hvb2tzL2J1aWxkZXJfcGVyc2lzdFwiXG5pbXBvcnQgU2lkZWJhclJlc2l6ZSBmcm9tIFwiLi9ob29rcy9zaWRlYmFyX3Jlc2l6ZVwiXG5pbXBvcnQgUGFuZWxSZXNpemUgZnJvbSBcIi4vaG9va3MvcGFuZWxfcmVzaXplXCJcblxuY29uc3QgU3ZlbHRlSG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5lbC5kYXRhc2V0Lm5hbWVcbiAgICBpZiAobmFtZSA9PT0gXCJEYWdWaWV3ZXJcIiAmJiB3aW5kb3cuX19ydW5jb21fZGFnKSB7XG4gICAgICB0aGlzLl9kZXN0cm95ID0gd2luZG93Ll9fcnVuY29tX2RhZy5tb3VudCh0aGlzLmVsLCB0aGlzKVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlZCgpIHtcbiAgICBpZiAodGhpcy5fb25VcGRhdGUpIHRoaXMuX29uVXBkYXRlKClcbiAgfSxcbiAgZGVzdHJveWVkKCkge1xuICAgIGlmICh0aGlzLl9kZXN0cm95KSB0aGlzLl9kZXN0cm95KClcbiAgfSxcbn1cblxuY29uc3QgQXNjaWluZW1hUGxheWVySG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBpZiAod2luZG93Ll9fcnVuY29tX3BsYXllcikge1xuICAgICAgdGhpcy5fZGVzdHJveSA9IHdpbmRvdy5fX3J1bmNvbV9wbGF5ZXIubW91bnQodGhpcy5lbClcbiAgICB9XG4gIH0sXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5fZGVzdHJveSkgdGhpcy5fZGVzdHJveSgpXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBob29rcyA9IHtcbiAgUnVuY29tV2ViU3ZlbHRlSG9vazogU3ZlbHRlSG9vayxcbiAgQ29weVRvQ2xpcGJvYXJkLFxuICBBdXRvY29tcGxldGVIb29rLFxuICBCdWlsZGVyUGVyc2lzdCxcbiAgU2lkZWJhclJlc2l6ZSxcbiAgUGFuZWxSZXNpemUsXG4gIEFzY2lpbmVtYVBsYXllckhvb2ssXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBS0csS0FBQyxTQUFTLEdBQUUsR0FBRTtBQUFDO0FBQWEsVUFBSSxHQUFFLEdBQUUsR0FBRSxJQUFFLE1BQUssSUFBRSxNQUFLLElBQUUsTUFBSyxJQUFFLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxVQUFFLG1CQUFpQixFQUFFLGlCQUFpQixHQUFFLEdBQUUsS0FBRSxJQUFFLEVBQUUsY0FBWSxFQUFFLFlBQVksT0FBSyxHQUFFLENBQUMsSUFBRSxFQUFFLE9BQUssQ0FBQyxJQUFFO0FBQUEsTUFBQyxHQUFFLElBQUUsRUFBQyxTQUFRLE1BQUcsY0FBYSxHQUFFLFdBQVUsRUFBQyxHQUFFLDJCQUEwQixPQUFNLDJCQUEwQixPQUFNLDJCQUEwQixPQUFNLDJC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

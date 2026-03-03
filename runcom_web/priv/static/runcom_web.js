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
var _assetsBase;
function assetsBase() {
  if (_assetsBase) return _assetsBase;
  const link = document.querySelector("link[href*='/__assets__/runcom_web']");
  if (link) {
    const href = link.getAttribute("href");
    _assetsBase = href.substring(0, href.lastIndexOf("/") + 1);
  } else {
    _assetsBase = "/__assets__/";
  }
  return _assetsBase;
}
var SvelteHook = {
  mounted() {
    const name = this.el.dataset.name;
    if (name === "DagViewer") {
      const url = assetsBase() + "runcom_web_dag.js";
      import(
        /* @vite-ignore */
        url
      ).then(({ mount }) => {
        this._destroy = mount(this.el, this);
      });
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
    const url = assetsBase() + "runcom_web_player.js";
    import(
      /* @vite-ignore */
      url
    ).then(({ mount }) => {
      this._destroy = mount(this.el);
    });
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
export {
  hooks
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vYXNzZXRzL2pzL2hvb2tzL2NvcHlfdG9fY2xpcGJvYXJkLmpzIiwgIi4uLy4uL2Fzc2V0cy9qcy9ob29rcy9hdXRvY29tcGxldGUuanMiLCAiLi4vLi4vYXNzZXRzL2pzL2hvb2tzL2J1aWxkZXJfcGVyc2lzdC5qcyIsICIuLi8uLi9hc3NldHMvanMvaG9va3Mvc2lkZWJhcl9yZXNpemUuanMiLCAiLi4vLi4vYXNzZXRzL2pzL2hvb2tzL3BhbmVsX3Jlc2l6ZS5qcyIsICIuLi8uLi9hc3NldHMvanMvaG9va3MuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IENvcHlUb0NsaXBib2FyZCA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRJZCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb3B5LXRhcmdldFwiKVxuICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0SWQpXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRhcmdldC50ZXh0Q29udGVudCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSB0aGlzLmVsLnRleHRDb250ZW50XG4gICAgICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IFwiQ29waWVkIVwiXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuZWwudGV4dENvbnRlbnQgPSBvcmlnaW5hbCB9LCAxNTAwKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29weVRvQ2xpcGJvYXJkXG4iLCAiY29uc3QgQXV0b2NvbXBsZXRlSG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLmlucHV0ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5wdXRdXCIpXG4gICAgdGhpcy5kcm9wZG93biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIltkYXRhLWRyb3Bkb3duXVwiKVxuICAgIHRoaXMuZW1wdHlJdGVtID0gdGhpcy5kcm9wZG93bi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZW1wdHldXCIpXG4gICAgdGhpcy5kZWJvdW5jZU1zID0gcGFyc2VJbnQodGhpcy5lbC5kYXRhc2V0LmRlYm91bmNlKSB8fCAzMDBcbiAgICB0aGlzLm9uU2VsZWN0ID0gdGhpcy5lbC5kYXRhc2V0Lm9uU2VsZWN0XG4gICAgdGhpcy5vblNlYXJjaCA9IHRoaXMuZWwuZGF0YXNldC5vblNlYXJjaFxuICAgIHRoaXMuaGlnaGxpZ2h0SW5kZXggPSAtMVxuICAgIHRoaXMuZGVib3VuY2VUaW1lciA9IG51bGxcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlXG5cbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB0aGlzLm9uSW5wdXQoKSlcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB0aGlzLm9wZW4oKSlcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB0aGlzLm9uS2V5ZG93bihlKSlcbiAgICB0aGlzLl9vbkRyb3Bkb3duTW91c2Vkb3duID0gKGUpID0+IHRoaXMub25Ecm9wZG93bkNsaWNrKGUpXG4gICAgdGhpcy5kcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuX29uRHJvcGRvd25Nb3VzZWRvd24pXG5cbiAgICB0aGlzLl9vbkNsaWNrT3V0c2lkZSA9IChlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZWwuY29udGFpbnMoZS50YXJnZXQpICYmICF0aGlzLmRyb3Bkb3duLmNvbnRhaW5zKGUudGFyZ2V0KSkgdGhpcy5jbG9zZSgpXG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5fb25DbGlja091dHNpZGUpXG5cbiAgICB0aGlzLl9vblNjcm9sbCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzT3BlbikgdGhpcy5wb3NpdGlvbkRyb3Bkb3duKClcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5fb25TY3JvbGwsIHRydWUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fb25TY3JvbGwpXG4gIH0sXG5cbiAgZGVzdHJveWVkKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5fb25DbGlja091dHNpZGUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5fb25TY3JvbGwsIHRydWUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fb25TY3JvbGwpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVib3VuY2VUaW1lcilcbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIGNvbnN0IG5ld0Ryb3Bkb3duID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZHJvcGRvd25dXCIpXG4gICAgaWYgKG5ld0Ryb3Bkb3duICE9PSB0aGlzLmRyb3Bkb3duKSB7XG4gICAgICB0aGlzLmRyb3Bkb3duLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5fb25Ecm9wZG93bk1vdXNlZG93bilcbiAgICAgIHRoaXMuZHJvcGRvd24gPSBuZXdEcm9wZG93blxuICAgICAgdGhpcy5kcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuX29uRHJvcGRvd25Nb3VzZWRvd24pXG4gICAgfVxuICAgIHRoaXMuZW1wdHlJdGVtID0gdGhpcy5kcm9wZG93bi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZW1wdHldXCIpXG4gICAgdGhpcy5vblNlYXJjaCA9IHRoaXMuZWwuZGF0YXNldC5vblNlYXJjaFxuICAgIHRoaXMub25TZWxlY3QgPSB0aGlzLmVsLmRhdGFzZXQub25TZWxlY3RcblxuICAgIGlmICh0aGlzLl9qdXN0U2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX2p1c3RTZWxlY3RlZCA9IGZhbHNlXG4gICAgICAvLyBJbiBhZGQgbW9kZSAobm8gZGF0YS12YWx1ZSBmcm9tIHNlcnZlciksIGNsZWFyIGlucHV0IGZvciBuZXh0IHBpY2tcbiAgICAgIGlmICghdGhpcy5lbC5kYXRhc2V0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBcIlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJJdGVtcygpXG4gICAgaWYgKHRoaXMuaXNPcGVuKSB0aGlzLm9wZW4oKVxuICB9LFxuXG4gIG9uSW5wdXQoKSB7XG4gICAgdGhpcy5oaWdobGlnaHRJbmRleCA9IC0xXG4gICAgdGhpcy5maWx0ZXJJdGVtcygpXG4gICAgdGhpcy5vcGVuKClcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmRlYm91bmNlVGltZXIpXG4gICAgaWYgKHRoaXMub25TZWFyY2gpIHtcbiAgICAgIHRoaXMuZGVib3VuY2VUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnB1c2hFdmVudFRvKHRoaXMuZWwsIHRoaXMub25TZWFyY2gsIHsgcXVlcnk6IHRoaXMuaW5wdXQudmFsdWUgfSlcbiAgICAgIH0sIHRoaXMuZGVib3VuY2VNcylcbiAgICB9XG4gIH0sXG5cbiAgZmlsdGVySXRlbXMoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmlucHV0LnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuZ2V0SXRlbXMoKVxuICAgIGxldCB2aXNpYmxlQ291bnQgPSAwXG5cbiAgICBpdGVtcy5mb3JFYWNoKChsaSkgPT4ge1xuICAgICAgY29uc3QgbWF0Y2ggPSBsaS5kYXRhc2V0LmZpbHRlci5pbmNsdWRlcyhxdWVyeSlcbiAgICAgIGxpLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIiwgIW1hdGNoKVxuICAgICAgbGkuY2xhc3NMaXN0LnJlbW92ZShcImJnLWJhc2UtMzAwXCIpXG4gICAgICBpZiAobWF0Y2gpIHZpc2libGVDb3VudCsrXG4gICAgfSlcblxuICAgIGlmICh0aGlzLmVtcHR5SXRlbSkge1xuICAgICAgdGhpcy5lbXB0eUl0ZW0uY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiLCB2aXNpYmxlQ291bnQgPiAwKVxuICAgIH1cbiAgfSxcblxuICBvbktleWRvd24oZSkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5nZXRWaXNpYmxlSXRlbXMoKVxuXG4gICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5oaWdobGlnaHRJbmRleCA9IE1hdGgubWluKHRoaXMuaGlnaGxpZ2h0SW5kZXggKyAxLCBpdGVtcy5sZW5ndGggLSAxKVxuICAgICAgICB0aGlzLmFwcGx5SGlnaGxpZ2h0KGl0ZW1zKVxuICAgICAgICB0aGlzLm9wZW4oKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIkFycm93VXBcIjpcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0SW5kZXggPSBNYXRoLm1heCh0aGlzLmhpZ2hsaWdodEluZGV4IC0gMSwgMClcbiAgICAgICAgdGhpcy5hcHBseUhpZ2hsaWdodChpdGVtcylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgXCJFbnRlclwiOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0SW5kZXggPj0gMCAmJiBpdGVtc1t0aGlzLmhpZ2hsaWdodEluZGV4XSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShpdGVtc1t0aGlzLmhpZ2hsaWdodEluZGV4XSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBcIkVzY2FwZVwiOlxuICAgICAgICB0aGlzLmNsb3NlKClcbiAgICAgICAgdGhpcy5pbnB1dC5ibHVyKClcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0sXG5cbiAgb25Ecm9wZG93bkNsaWNrKGUpIHtcbiAgICBjb25zdCBsaSA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJsaVtkYXRhLXZhbHVlXVwiKVxuICAgIGlmIChsaSkgdGhpcy5zZWxlY3RJdGVtKGxpKVxuICB9LFxuXG4gIHNlbGVjdEl0ZW0obGkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGxpLmRhdGFzZXQudmFsdWVcbiAgICBjb25zdCBsYWJlbCA9IGxpLmRhdGFzZXQubGFiZWxcblxuICAgIHRoaXMuaW5wdXQudmFsdWUgPSBsYWJlbFxuICAgIHRoaXMuX2p1c3RTZWxlY3RlZCA9IHRydWVcblxuICAgIHRoaXMucHVzaEV2ZW50VG8odGhpcy5lbCwgdGhpcy5vblNlbGVjdCwgeyB2YWx1ZSwgbGFiZWwgfSlcbiAgICB0aGlzLmNsb3NlKClcbiAgICB0aGlzLmhpZ2hsaWdodEluZGV4ID0gLTFcbiAgfSxcblxuICBwb3NpdGlvbkRyb3Bkb3duKCkge30sXG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWVcbiAgICB0aGlzLnBvc2l0aW9uRHJvcGRvd24oKVxuICAgIHRoaXMuZHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxuICB9LFxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICB0aGlzLmRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIilcbiAgICB0aGlzLmhpZ2hsaWdodEluZGV4ID0gLTFcbiAgfSxcblxuICBnZXRJdGVtcygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRyb3Bkb3duLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVtkYXRhLXZhbHVlXVwiKSlcbiAgfSxcblxuICBnZXRWaXNpYmxlSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbXMoKS5maWx0ZXIoKGxpKSA9PiAhbGkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZGVuXCIpKVxuICB9LFxuXG4gIGFwcGx5SGlnaGxpZ2h0KGl0ZW1zKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgobGksIGkpID0+IHtcbiAgICAgIGxpLmNsYXNzTGlzdC50b2dnbGUoXCJiZy1iYXNlLTMwMFwiLCBpID09PSB0aGlzLmhpZ2hsaWdodEluZGV4KVxuICAgICAgaWYgKGkgPT09IHRoaXMuaGlnaGxpZ2h0SW5kZXgpIHtcbiAgICAgICAgbGkuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogXCJuZWFyZXN0XCIgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvY29tcGxldGVIb29rXG4iLCAiY29uc3QgU1RPUkFHRV9LRVkgPSBcInJ1bmNvbTpidWlsZGVyOmRyYWZ0XCJcblxuY29uc3QgQnVpbGRlclBlcnNpc3QgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWSlcbiAgICBpZiAoc2F2ZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gSlNPTi5wYXJzZShzYXZlZClcbiAgICAgICAgdGhpcy5wdXNoRXZlbnQoXCJyZXN0b3JlX3N0YXRlXCIsIHN0YXRlKVxuICAgICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oU1RPUkFHRV9LRVkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVFdmVudChcImJ1aWxkZXJfc3RhdGVfY2hhbmdlZFwiLCAoc3RhdGUpID0+IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpXG4gICAgfSlcblxuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJidWlsZGVyX3N0YXRlX2NsZWFyZWRcIiwgKCkgPT4ge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oU1RPUkFHRV9LRVkpXG4gICAgfSlcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdWlsZGVyUGVyc2lzdFxuIiwgImNvbnN0IFNpZGViYXJSZXNpemUgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYW5kbGUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yZXNpemUtaGFuZGxlXVwiKVxuICAgIGlmICghdGhpcy5oYW5kbGUpIHJldHVyblxuXG4gICAgdGhpcy5zaWRlYmFyID0gdGhpcy5lbFxuICAgIHRoaXMubWluV2lkdGggPSAyMDBcbiAgICB0aGlzLm1heFdpZHRoID0gNTAwXG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG5cbiAgICB0aGlzLm9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJjb2wtcmVzaXplXCJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwibm9uZVwiXG4gICAgfVxuXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuc2lkZWJhci5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCB3aWR0aCA9IE1hdGgubWluKHRoaXMubWF4V2lkdGgsIE1hdGgubWF4KHRoaXMubWluV2lkdGgsIGUuY2xpZW50WCAtIHJlY3QubGVmdCkpXG4gICAgICB0aGlzLnNpZGViYXIuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIlxuICAgIH1cblxuICAgIHRoaXMub25Nb3VzZVVwID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcIlwiXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBcIlwiXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm9uTW91c2VEb3duKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcClcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlKSB7XG4gICAgICB0aGlzLmhhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24pXG4gICAgfVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSlcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlYmFyUmVzaXplXG4iLCAiY29uc3QgUGFuZWxSZXNpemUgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYW5kbGUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1yZXNpemUtaGFuZGxlXVwiKVxuICAgIGlmICghdGhpcy5oYW5kbGUpIHJldHVyblxuXG4gICAgdGhpcy5wYW5lbCA9IHRoaXMuZWxcbiAgICB0aGlzLm1pbkhlaWdodCA9IHBhcnNlSW50KHRoaXMuZWwuZGF0YXNldC5taW5IZWlnaHQgfHwgXCIxMjhcIiwgMTApXG4gICAgdGhpcy5tYXhIZWlnaHQgPSBwYXJzZUludCh0aGlzLmVsLmRhdGFzZXQubWF4SGVpZ2h0IHx8IFwiNjAwXCIsIDEwKVxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgdGhpcy5vbk1vdXNlRG93biA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwicm93LXJlc2l6ZVwiXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBcIm5vbmVcIlxuICAgIH1cblxuICAgIHRoaXMub25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnBhbmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1heEhlaWdodCwgTWF0aC5tYXgodGhpcy5taW5IZWlnaHQsIGUuY2xpZW50WSAtIHJlY3QudG9wKSlcbiAgICAgIHRoaXMucGFuZWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiXG4gICAgfVxuXG4gICAgdGhpcy5vbk1vdXNlVXAgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwiXCJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwiXCJcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25Nb3VzZURvd24pXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKVxuICB9LFxuXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5oYW5kbGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93bilcbiAgICB9XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKVxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsUmVzaXplXG4iLCAiaW1wb3J0IENvcHlUb0NsaXBib2FyZCBmcm9tIFwiLi9ob29rcy9jb3B5X3RvX2NsaXBib2FyZFwiXG5pbXBvcnQgQXV0b2NvbXBsZXRlSG9vayBmcm9tIFwiLi9ob29rcy9hdXRvY29tcGxldGVcIlxuaW1wb3J0IEJ1aWxkZXJQZXJzaXN0IGZyb20gXCIuL2hvb2tzL2J1aWxkZXJfcGVyc2lzdFwiXG5pbXBvcnQgU2lkZWJhclJlc2l6ZSBmcm9tIFwiLi9ob29rcy9zaWRlYmFyX3Jlc2l6ZVwiXG5pbXBvcnQgUGFuZWxSZXNpemUgZnJvbSBcIi4vaG9va3MvcGFuZWxfcmVzaXplXCJcblxuLy8gTGF6eS1sb2FkZWQ6IERhZ1ZpZXdlciAoeHlmbG93IH4zNDBrYikgYW5kIEFzY2lpbmVtYVBsYXllciAofjI4N2tiKVxuLy8gYXJlIHNlcGFyYXRlIGJ1bmRsZXMgZmV0Y2hlZCBvbiBmaXJzdCB1c2UgdmlhIHRoZSAvX19hc3NldHNfXy8gcGF0aC5cblxubGV0IF9hc3NldHNCYXNlXG5mdW5jdGlvbiBhc3NldHNCYXNlKCkge1xuICBpZiAoX2Fzc2V0c0Jhc2UpIHJldHVybiBfYXNzZXRzQmFzZVxuICBjb25zdCBsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxpbmtbaHJlZio9Jy9fX2Fzc2V0c19fL3J1bmNvbV93ZWInXVwiKVxuICBpZiAobGluaykge1xuICAgIGNvbnN0IGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZShcImhyZWZcIilcbiAgICBfYXNzZXRzQmFzZSA9IGhyZWYuc3Vic3RyaW5nKDAsIGhyZWYubGFzdEluZGV4T2YoXCIvXCIpICsgMSlcbiAgfSBlbHNlIHtcbiAgICBfYXNzZXRzQmFzZSA9IFwiL19fYXNzZXRzX18vXCJcbiAgfVxuICByZXR1cm4gX2Fzc2V0c0Jhc2Vcbn1cblxuY29uc3QgU3ZlbHRlSG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5lbC5kYXRhc2V0Lm5hbWVcbiAgICBpZiAobmFtZSA9PT0gXCJEYWdWaWV3ZXJcIikge1xuICAgICAgY29uc3QgdXJsID0gYXNzZXRzQmFzZSgpICsgXCJydW5jb21fd2ViX2RhZy5qc1wiXG4gICAgICBpbXBvcnQoLyogQHZpdGUtaWdub3JlICovIHVybCkudGhlbigoeyBtb3VudCB9KSA9PiB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kgPSBtb3VudCh0aGlzLmVsLCB0aGlzKVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZWQoKSB7XG4gICAgaWYgKHRoaXMuX29uVXBkYXRlKSB0aGlzLl9vblVwZGF0ZSgpXG4gIH0sXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5fZGVzdHJveSkgdGhpcy5fZGVzdHJveSgpXG4gIH0sXG59XG5cbmNvbnN0IEFzY2lpbmVtYVBsYXllckhvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3QgdXJsID0gYXNzZXRzQmFzZSgpICsgXCJydW5jb21fd2ViX3BsYXllci5qc1wiXG4gICAgaW1wb3J0KC8qIEB2aXRlLWlnbm9yZSAqLyB1cmwpLnRoZW4oKHsgbW91bnQgfSkgPT4ge1xuICAgICAgdGhpcy5fZGVzdHJveSA9IG1vdW50KHRoaXMuZWwpXG4gICAgfSlcbiAgfSxcbiAgZGVzdHJveWVkKCkge1xuICAgIGlmICh0aGlzLl9kZXN0cm95KSB0aGlzLl9kZXN0cm95KClcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IGhvb2tzID0ge1xuICBSdW5jb21XZWJTdmVsdGVIb29rOiBTdmVsdGVIb29rLFxuICBDb3B5VG9DbGlwYm9hcmQsXG4gIEF1dG9jb21wbGV0ZUhvb2ssXG4gIEJ1aWxkZXJQZXJzaXN0LFxuICBTaWRlYmFyUmVzaXplLFxuICBQYW5lbFJlc2l6ZSxcbiAgQXNjaWluZW1hUGxheWVySG9vayxcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxJQUFNLGtCQUFrQjtBQUFBLEVBQ3RCLFVBQVU7QUFDUixTQUFLLEdBQUcsaUJBQWlCLFNBQVMsTUFBTTtBQUN0QyxZQUFNLFdBQVcsS0FBSyxHQUFHLGFBQWEsa0JBQWtCO0FBQ3hELFlBQU0sU0FBUyxTQUFTLGVBQWUsUUFBUTtBQUMvQyxVQUFJLFFBQVE7QUFDVixrQkFBVSxVQUFVLFVBQVUsT0FBTyxXQUFXLEVBQUUsS0FBSyxNQUFNO0FBQzNELGdCQUFNLFdBQVcsS0FBSyxHQUFHO0FBQ3pCLGVBQUssR0FBRyxjQUFjO0FBQ3RCLHFCQUFXLE1BQU07QUFBRSxpQkFBSyxHQUFHLGNBQWM7QUFBQSxVQUFTLEdBQUcsSUFBSTtBQUFBLFFBQzNELENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTyw0QkFBUTs7O0FDaEJmLElBQU0sbUJBQW1CO0FBQUEsRUFDdkIsVUFBVTtBQUNSLFNBQUssUUFBUSxLQUFLLEdBQUcsY0FBYyxjQUFjO0FBQ2pELFNBQUssV0FBVyxLQUFLLEdBQUcsY0FBYyxpQkFBaUI7QUFDdkQsU0FBSyxZQUFZLEtBQUssU0FBUyxjQUFjLGNBQWM7QUFDM0QsU0FBSyxhQUFhLFNBQVMsS0FBSyxHQUFHLFFBQVEsUUFBUSxLQUFLO0FBQ3hELFNBQUssV0FBVyxLQUFLLEdBQUcsUUFB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

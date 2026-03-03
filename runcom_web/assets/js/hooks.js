import CopyToClipboard from "./hooks/copy_to_clipboard"
import AutocompleteHook from "./hooks/autocomplete"
import BuilderPersist from "./hooks/builder_persist"
import SidebarResize from "./hooks/sidebar_resize"
import PanelResize from "./hooks/panel_resize"

// Lazy-loaded: DagViewer (xyflow ~340kb) and AsciinemaPlayer (~287kb)
// are separate bundles fetched on first use via the /__assets__/ path.

let _assetsBase
function assetsBase() {
  if (_assetsBase) return _assetsBase
  const link = document.querySelector("link[href*='/__assets__/runcom_web']")
  if (link) {
    const href = link.getAttribute("href")
    _assetsBase = href.substring(0, href.lastIndexOf("/") + 1)
  } else {
    _assetsBase = "/__assets__/"
  }
  return _assetsBase
}

const SvelteHook = {
  mounted() {
    const name = this.el.dataset.name
    if (name === "DagViewer") {
      const url = assetsBase() + "runcom_web_dag.js"
      import(/* @vite-ignore */ url).then(({ mount }) => {
        this._destroy = mount(this.el, this)
      })
    }
  },
  updated() {
    if (this._onUpdate) this._onUpdate()
  },
  destroyed() {
    if (this._destroy) this._destroy()
  },
}

const AsciinemaPlayerHook = {
  mounted() {
    const url = assetsBase() + "runcom_web_player.js"
    import(/* @vite-ignore */ url).then(({ mount }) => {
      this._destroy = mount(this.el)
    })
  },
  destroyed() {
    if (this._destroy) this._destroy()
  },
}

export const hooks = {
  RuncomWebSvelteHook: SvelteHook,
  CopyToClipboard,
  AutocompleteHook,
  BuilderPersist,
  SidebarResize,
  PanelResize,
  AsciinemaPlayerHook,
}

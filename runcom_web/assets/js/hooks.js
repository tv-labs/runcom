import CopyToClipboard from "./hooks/copy_to_clipboard"
import AutocompleteHook from "./hooks/autocomplete"
import BuilderPersist from "./hooks/builder_persist"
import SidebarResize from "./hooks/sidebar_resize"
import PanelResize from "./hooks/panel_resize"

const SvelteHook = {
  mounted() {
    const name = this.el.dataset.name
    if (name === "DagViewer" && window.__runcom_dag) {
      this._destroy = window.__runcom_dag.mount(this.el, this)
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
    if (window.__runcom_player) {
      this._destroy = window.__runcom_player.mount(this.el)
    }
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

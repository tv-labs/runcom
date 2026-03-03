import { mount as svelteMount, unmount } from "svelte"
import DagViewer from "../../svelte/DagViewer.svelte"
import xyflowCss from "@xyflow/svelte/dist/style.css"

if (!document.querySelector("[data-xyflow-css]")) {
  const style = document.createElement("style")
  style.setAttribute("data-xyflow-css", "")
  style.textContent = xyflowCss
  document.head.appendChild(style)
}

export function mount(el, hook) {
  const props = JSON.parse(el.getAttribute("data-props") || "{}")
  const state = $state({ ...props, live: hook })

  const target = el.querySelector("[data-svelte-target]")
  target.innerHTML = ""

  const instance = svelteMount(DagViewer, { target, props: state })
  instance.state = state

  hook._onUpdate = () => {
    const newProps = JSON.parse(el.getAttribute("data-props") || "{}")
    for (const key in newProps) {
      instance.state[key] = newProps[key]
    }
    instance.state.live = hook
  }

  return () => {
    window.addEventListener("phx:page-loading-stop", () => unmount(instance), { once: true })
  }
}

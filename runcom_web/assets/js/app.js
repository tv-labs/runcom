import topbar from "topbar"
import { hooks } from "./hooks"

topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
window.addEventListener("phx:page-loading-start", () => topbar.show(300))
window.addEventListener("phx:page-loading-stop", () => topbar.hide())

// View Transition support
let transitionEls = []
let transitionTypes = []
let transitionTarget = null
let scheduleTransition = null

function setChildVtNames(el) {
  el.querySelectorAll("[data-vt]").forEach((child) => {
    child.style.viewTransitionName = child.dataset.vt
  })
}

function clearChildVtNames(el) {
  el.querySelectorAll("[data-vt]").forEach((child) => {
    child.style.viewTransitionName = ""
  })
}

window.addEventListener("phx:start-view-transition", (e) => {
  const opts = e.detail
  if (opts.temp_name && e.target !== window) {
    e.target.style.viewTransitionName = opts.temp_name
    setChildVtNames(e.target)
    transitionEls.push(e.target)
  }
  if (opts.target) {
    transitionTarget = { selector: opts.target, name: opts.temp_name }
  }
  if (opts.type) {
    transitionTypes.push(opts.type)
  }
  scheduleTransition = true
})

// Mounting — Phoenix globals are provided by concatenated scripts
const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
const liveTran = document.querySelector("meta[name='live-transport']").getAttribute("content")
const livePath = document.querySelector("meta[name='live-path']").getAttribute("content")

const liveSocket = new LiveView.LiveSocket(livePath, Phoenix.Socket, {
  transport: liveTran === "longpoll" ? Phoenix.LongPoll : WebSocket,
  params: { _csrf_token: csrfToken },
  hooks: hooks,
  dom: {
    onDocumentPatch(start) {
      const savedTarget = transitionTarget

      const update = () => {
        transitionEls.forEach((el) => {
          el.style.viewTransitionName = ""
          clearChildVtNames(el)
        })
        transitionEls = []
        transitionTypes = []
        transitionTarget = null
        scheduleTransition = null
        start()

        if (savedTarget) {
          const el = document.querySelector(savedTarget.selector)
          if (el) {
            el.style.viewTransitionName = savedTarget.name
            setChildVtNames(el)
          }
        }
      }

      if (transitionEls.length !== 0 || scheduleTransition) {
        let vt
        try {
          vt = document.startViewTransition({
            update,
            types: transitionTypes.length ? transitionTypes : ["same-document"],
          })
        } catch (error) {
          vt = document.startViewTransition(update)
        }

        if (vt && savedTarget) {
          vt.finished.then(() => {
            const el = document.querySelector(savedTarget.selector)
            if (el) {
              el.style.viewTransitionName = ""
              clearChildVtNames(el)
            }
          }).catch(() => {})
        }
      } else {
        update()
      }
    }
  }
})

liveSocket.connect()

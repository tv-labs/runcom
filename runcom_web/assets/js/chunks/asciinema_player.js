import * as AsciinemaPlayer from "asciinema-player"
import ascinemaCss from "asciinema-player/dist/bundle/asciinema-player.css"

if (!document.querySelector("[data-asciinema-css]")) {
  const style = document.createElement("style")
  style.setAttribute("data-asciinema-css", "")
  style.textContent = ascinemaCss
  document.head.appendChild(style)
}

export function mount(el) {
  const data = el.dataset.cast
  if (!data) return

  const player = AsciinemaPlayer.create(
    { data },
    el,
    {
      fit: "width",
      terminalFontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
      theme: "asciinema",
      speed: 4,
      idleTimeLimit: 0.5,
    }
  )

  return () => {
    if (player && player.dispose) player.dispose()
  }
}

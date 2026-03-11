import * as AsciinemaPlayer from "asciinema-player"
import ascinemaCss from "asciinema-player/dist/bundle/asciinema-player.css"

const themeCss = `
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
`

if (!document.querySelector("[data-asciinema-css]")) {
  const style = document.createElement("style")
  style.setAttribute("data-asciinema-css", "")
  style.textContent = ascinemaCss + themeCss
  document.head.appendChild(style)
}

function detectTheme() {
  const html = document.documentElement
  return html.getAttribute("data-theme") === "dark" ? "runcom-dark" : "runcom-light"
}

export function mount(el) {
  const data = el.dataset.cast
  if (!data) return

  let player = AsciinemaPlayer.create(
    { data },
    el,
    {
      fit: "width",
      terminalFontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
      theme: detectTheme(),
      speed: 4,
      idleTimeLimit: 0.5,
    }
  )

  const observer = new MutationObserver(() => {
    const newTheme = detectTheme()
    if (player && player.dispose) player.dispose()
    el.innerHTML = ""
    player = AsciinemaPlayer.create(
      { data },
      el,
      {
        fit: "width",
        terminalFontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
        theme: newTheme,
        speed: 4,
        idleTimeLimit: 0.5,
      }
    )
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })

  return () => {
    observer.disconnect()
    if (player && player.dispose) player.dispose()
  }
}

window.__runcom_player = { mount }

const PanelResize = {
  mounted() {
    this.handle = this.el.querySelector("[data-resize-handle]")
    if (!this.handle) return

    this.panel = this.el
    this.minHeight = parseInt(this.el.dataset.minHeight || "128", 10)
    this.maxHeight = parseInt(this.el.dataset.maxHeight || "600", 10)
    this.dragging = false

    this.onMouseDown = (e) => {
      e.preventDefault()
      this.dragging = true
      document.body.style.cursor = "row-resize"
      document.body.style.userSelect = "none"
    }

    this.onMouseMove = (e) => {
      if (!this.dragging) return
      const rect = this.panel.getBoundingClientRect()
      const height = Math.min(this.maxHeight, Math.max(this.minHeight, e.clientY - rect.top))
      this.panel.style.height = height + "px"
    }

    this.onMouseUp = () => {
      if (!this.dragging) return
      this.dragging = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    this.handle.addEventListener("mousedown", this.onMouseDown)
    document.addEventListener("mousemove", this.onMouseMove)
    document.addEventListener("mouseup", this.onMouseUp)
  },

  destroyed() {
    if (this.handle) {
      this.handle.removeEventListener("mousedown", this.onMouseDown)
    }
    document.removeEventListener("mousemove", this.onMouseMove)
    document.removeEventListener("mouseup", this.onMouseUp)
  }
}

export default PanelResize

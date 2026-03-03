const SidebarResize = {
  mounted() {
    this.handle = this.el.querySelector("[data-resize-handle]")
    if (!this.handle) return

    this.sidebar = this.el
    this.minWidth = 200
    this.maxWidth = 500
    this.dragging = false

    this.onMouseDown = (e) => {
      e.preventDefault()
      this.dragging = true
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    this.onMouseMove = (e) => {
      if (!this.dragging) return
      const rect = this.sidebar.parentElement.getBoundingClientRect()
      const width = Math.min(this.maxWidth, Math.max(this.minWidth, e.clientX - rect.left))
      this.sidebar.style.width = width + "px"
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

export default SidebarResize

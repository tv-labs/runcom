const CopyToClipboard = {
  mounted() {
    this.el.addEventListener("click", () => {
      const targetId = this.el.getAttribute("data-copy-target")
      const target = document.getElementById(targetId)
      if (target) {
        navigator.clipboard.writeText(target.textContent).then(() => {
          const original = this.el.textContent
          this.el.textContent = "Copied!"
          setTimeout(() => { this.el.textContent = original }, 1500)
        })
      }
    })
  }
}

export default CopyToClipboard

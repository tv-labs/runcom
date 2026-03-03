const STORAGE_KEY = "runcom:builder:draft"

const BuilderPersist = {
  mounted() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state = JSON.parse(saved)
        this.pushEvent("restore_state", state)
      } catch (_e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    this.handleEvent("builder_state_changed", (state) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    })

    this.handleEvent("builder_state_cleared", () => {
      localStorage.removeItem(STORAGE_KEY)
    })
  },

  destroyed() {}
}

export default BuilderPersist

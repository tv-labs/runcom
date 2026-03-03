const AutocompleteHook = {
  mounted() {
    this.input = this.el.querySelector("[data-input]")
    this.dropdown = this.el.querySelector("[data-dropdown]")
    this.emptyItem = this.dropdown.querySelector("[data-empty]")
    this.debounceMs = parseInt(this.el.dataset.debounce) || 300
    this.onSelect = this.el.dataset.onSelect
    this.onSearch = this.el.dataset.onSearch
    this.highlightIndex = -1
    this.debounceTimer = null
    this.isOpen = false

    this.input.addEventListener("input", () => this.onInput())
    this.input.addEventListener("focus", () => this.open())
    this.input.addEventListener("keydown", (e) => this.onKeydown(e))
    this._onDropdownMousedown = (e) => this.onDropdownClick(e)
    this.dropdown.addEventListener("mousedown", this._onDropdownMousedown)

    this._onClickOutside = (e) => {
      if (!this.el.contains(e.target) && !this.dropdown.contains(e.target)) this.close()
    }
    document.addEventListener("mousedown", this._onClickOutside)

    this._onScroll = () => {
      if (this.isOpen) this.positionDropdown()
    }
    window.addEventListener("scroll", this._onScroll, true)
    window.addEventListener("resize", this._onScroll)
  },

  destroyed() {
    document.removeEventListener("mousedown", this._onClickOutside)
    window.removeEventListener("scroll", this._onScroll, true)
    window.removeEventListener("resize", this._onScroll)
    clearTimeout(this.debounceTimer)
  },

  updated() {
    const newDropdown = this.el.querySelector("[data-dropdown]")
    if (newDropdown !== this.dropdown) {
      this.dropdown.removeEventListener("mousedown", this._onDropdownMousedown)
      this.dropdown = newDropdown
      this.dropdown.addEventListener("mousedown", this._onDropdownMousedown)
    }
    this.emptyItem = this.dropdown.querySelector("[data-empty]")
    this.onSearch = this.el.dataset.onSearch
    this.onSelect = this.el.dataset.onSelect

    if (this._justSelected) {
      this._justSelected = false
      // In add mode (no data-value from server), clear input for next pick
      if (!this.el.dataset.value) {
        this.input.value = ""
      }
    }

    this.filterItems()
    if (this.isOpen) this.open()
  },

  onInput() {
    this.highlightIndex = -1
    this.filterItems()
    this.open()

    clearTimeout(this.debounceTimer)
    if (this.onSearch) {
      this.debounceTimer = setTimeout(() => {
        this.pushEventTo(this.el, this.onSearch, { query: this.input.value })
      }, this.debounceMs)
    }
  },

  filterItems() {
    const query = this.input.value.toLowerCase()
    const items = this.getItems()
    let visibleCount = 0

    items.forEach((li) => {
      const match = li.dataset.filter.includes(query)
      li.classList.toggle("hidden", !match)
      li.classList.remove("bg-base-300")
      if (match) visibleCount++
    })

    if (this.emptyItem) {
      this.emptyItem.classList.toggle("hidden", visibleCount > 0)
    }
  },

  onKeydown(e) {
    const items = this.getVisibleItems()

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        this.highlightIndex = Math.min(this.highlightIndex + 1, items.length - 1)
        this.applyHighlight(items)
        this.open()
        break
      case "ArrowUp":
        e.preventDefault()
        this.highlightIndex = Math.max(this.highlightIndex - 1, 0)
        this.applyHighlight(items)
        break
      case "Enter":
        e.preventDefault()
        if (this.highlightIndex >= 0 && items[this.highlightIndex]) {
          this.selectItem(items[this.highlightIndex])
        }
        break
      case "Escape":
        this.close()
        this.input.blur()
        break
    }
  },

  onDropdownClick(e) {
    const li = e.target.closest("li[data-value]")
    if (li) this.selectItem(li)
  },

  selectItem(li) {
    const value = li.dataset.value
    const label = li.dataset.label

    this.input.value = label
    this._justSelected = true

    this.pushEventTo(this.el, this.onSelect, { value, label })
    this.close()
    this.highlightIndex = -1
  },

  positionDropdown() {},

  open() {
    this.isOpen = true
    this.positionDropdown()
    this.dropdown.classList.remove("hidden")
  },

  close() {
    this.isOpen = false
    this.dropdown.classList.add("hidden")
    this.highlightIndex = -1
  },

  getItems() {
    return Array.from(this.dropdown.querySelectorAll("li[data-value]"))
  },

  getVisibleItems() {
    return this.getItems().filter((li) => !li.classList.contains("hidden"))
  },

  applyHighlight(items) {
    items.forEach((li, i) => {
      li.classList.toggle("bg-base-300", i === this.highlightIndex)
      if (i === this.highlightIndex) {
        li.scrollIntoView({ block: "nearest" })
      }
    })
  },
}

export default AutocompleteHook

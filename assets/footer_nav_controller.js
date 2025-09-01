// assets/footer_nav_controller.js
export default class extends window.Stimulus.Controller {
  static targets = ["panel", "content", "button"]

  connect() {
    this.open = false

    // Keep height accurate if content changes
    this._ro = new ResizeObserver(() => {
      if (this.open) this._setHeight(this.contentTarget.scrollHeight)
    })
    this._ro.observe(this.contentTarget)

    // Close on ESC / outside click
    this._onKeydown = (e) => { if (e.key === "Escape" && this.open) this.close() }
    this._onDocClick = (e) => {
      if (!this.open) return
      const inside = this.panelTarget.contains(e.target) || this.buttonTarget.contains(e.target)
      if (!inside) this.close()
    }
    document.addEventListener("keydown", this._onKeydown)
    document.addEventListener("click", this._onDocClick)
  }

  disconnect() {
    this._ro?.disconnect()
    document.removeEventListener("keydown", this._onKeydown)
    document.removeEventListener("click", this._onDocClick)
  }

  toggle() { this.open ? this.close() : this.openPanel() }

  openPanel() {
    this.open = true
    this._updateAria()
    this.panelTarget.classList.remove("opacity-0", "translate-y-1")
    this._setHeight(this.contentTarget.scrollHeight)
  }

  close() {
    const current = this.panelTarget.getBoundingClientRect().height
    this._setHeight(current)
    requestAnimationFrame(() => {
      this._setHeight(0)
      this.panelTarget.classList.add("opacity-0", "translate-y-1")
      this.open = false
      this._updateAria()
    })
  }

  _updateAria() {
    this.buttonTarget.setAttribute("aria-expanded", String(this.open))
    this.panelTarget.setAttribute("aria-hidden", String(!this.open))
  }

  _setHeight(px) {
    this.panelTarget.style.height = `${px}px`
  }
}

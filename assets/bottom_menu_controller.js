// Stimulus controller for the tiny bottom menu
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["panel", "content", "button"];

  connect() {
    this.open = false;
    this.updateAria();
  }

  // --- actions ---
  toggle() {
    this.open ? this.close() : this.openPanel();
  }

  // Window-level listeners
  // (declare in HTML via data-action to survive Turbo navigations)
  clickOutside(event) {
    if (!this.open) return;
    const clickInside = this.panelTarget.contains(event.target) || this.buttonTarget.contains(event.target);
    if (!clickInside) this.close();
  }

  escape(event) {
    if (event.key === "Escape" && this.open) this.close();
  }

  resize() {
    if (this.open) this._setHeight(this.contentTarget.scrollHeight);
  }

  // --- internals ---
  openPanel() {
    this.open = true;
    this.updateAria();

    // show shell (opacity/translate)
    this.element.dataset.state = "open";
    requestAnimationFrame(() => {
      this.panelTarget.classList.remove("opacity-0", "translate-y-2");
    });

    // animate height
    this._setHeight(this.contentTarget.scrollHeight);
  }

  close() {
    // set current height as start point
    this._setHeight(this.panelTarget.getBoundingClientRect().height);

    // next frame collapse to zero
    requestAnimationFrame(() => {
      this._setHeight(0);
      this.panelTarget.classList.add("opacity-0", "translate-y-2");
      this.open = false;
      this.updateAria();

      // mark closed slightly after transition (keeps clicks off)
      setTimeout(() => (this.element.dataset.state = "closed"), 180);
    });
  }

  updateAria() {
    this.buttonTarget.setAttribute("aria-expanded", String(this.open));
    this.element.setAttribute("aria-hidden", String(!this.open));
  }

  _setHeight(px) {
    this.panelTarget.style.height = `${px}px`;
  }
}

// assets/stimulus-init.js
const application = Stimulus.Application.start();

// ---- FLOAT MENU CONTROLLER ---- //
application.register("floatmenu", class extends Stimulus.Controller {
  static targets = ["panel", "cartCount"];

  connect() {
    console.log("✅ FloatMenu connected");
    this.openKey = null;

    // optional: close on scroll
    this._onScroll = this._onScroll.bind(this);
    window.addEventListener("scroll", this._onScroll, { passive: true });
    this.updateCartCount();
  }

  disconnect() {
    window.removeEventListener("scroll", this._onScroll);
  }

  toggle(event) {
    const key = event.currentTarget.dataset.key;
    if (this.openKey === key) {
      this.close();
    } else {
      this.open(key);
    }
  }

  open(key) {
    this.openKey = key;
    this.panelTargets.forEach((panel) => {
      const isTarget = panel.dataset.key === key;
      panel.classList.toggle("hidden", !isTarget);
    });
  }

  close() {
    this.openKey = null;
    this.panelTargets.forEach((panel) => panel.classList.add("hidden"));
  }

  _onScroll() {
    if (this.openKey) this.close();
  }

  async updateCartCount() {
    try {
      const res = await fetch("/cart.js");
      const cart = await res.json();
      this.cartCountTargets.forEach((el) => (el.textContent = cart.item_count));
    } catch (err) {
      console.warn("Cart count fetch failed", err);
    }
  }
});

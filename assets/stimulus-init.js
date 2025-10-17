// assets/stimulus-init.js
const application = Stimulus.Application.start();

// ---- FLOAT MENU CONTROLLER ---- //
application.register("floatmenu", class extends Stimulus.Controller {
  static targets = ["panel", "content"];

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

  toggle(e) {
    const key = e.currentTarget.dataset.key;
    if (this.openKey === key) {
      this.close();
    } else {
      this.open(key);
    }
  }

  open(key) {
    this.openKey = key;

    // Example: dynamic content per button
    let html = "";
    switch (key) {
      case "shop":
        html = `
          <ul class="space-y-2">
            <li><a href="/collections/all" class="block hover:underline">Shop All</a></li>
            <li><a href="/collections/apparel" class="block hover:underline">Apparel</a></li>
            <li><a href="/collections/footwear" class="block hover:underline">Footwear</a></li>
          </ul>`;
        break;
      case "menu":
        html = `
          <ul class="space-y-2">
            <li><a href="/pages/about" class="block hover:underline">About</a></li>
            <li><a href="/pages/contact" class="block hover:underline">Contact</a></li>
          </ul>`;
        break;
      case "account":
        html = `<p><a href="/account" class="underline">Go to Account</a></p>`;
        break;
    }

    this.contentTarget.innerHTML = html;

    // Expand the panel smoothly
    const panel = this.panelTarget;
    panel.classList.remove("opacity-0");
    panel.style.height = panel.scrollHeight + "px";

    // Mark container as open
    this.element.classList.add("open");
  }

  close() {
    this.openKey = null;

    const panel = this.panelTarget;
    panel.style.height = "0px";
    panel.classList.add("opacity-0");

    this.element.classList.remove("open");
  }

  _onScroll() {
    if (this.openKey) this.close();
  }
});
/*
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
*/

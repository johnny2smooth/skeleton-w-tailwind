// assets/stimulus-init.js
const application = Stimulus.Application.start();

// ---- FLOAT MENU CONTROLLER ---- //
application.register("floatmenu", class extends Stimulus.Controller {
  static targets = ["panel", "content"];

  connect() {
    console.log("✅ FloatMenu connected");
    this.openKey = null;

    // close on scroll (kept)
    this._onScroll = this._onScroll.bind(this);
    window.addEventListener("scroll", this._onScroll, { passive: true });
    this.updateCartCount?.();
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

    // Dynamic content
    let html = "";
    switch (key) {
      case "shop":
        html = `
          <ul class="space-y-2">
            <li><a href="/collections/all" class="block hover:underline">Today's Drop</a></li>
            <li><a href="/collections/all" class="block hover:underline">All</a></li>
            <li><a href="/collections/t-shirts" class="block hover:underline">T-Shirts</a></li>
            <li><a href="/collections/button-ups" class="block hover:underline">Button Ups</a></li>
            <li><a href="/collections/jackets" class="block hover:underline">Jackets</a></li>
            <li><a href="/collections/sweaters" class="block hover:underline">Sweaters</a></li>
            <li><a href="/collections/sweatshirts" class="block hover:underline">Sweatshirts</a></li>
            <li><a href="/collections/pants" class="block hover:underline">Pants</a></li>
            <li><a href="/collections/shorts" class="block hover:underline">Shorts</a></li>
            <li><a href="/collections/overalls" class="block hover:underline">Overalls</a></li>
            <li><a href="/collections/coveralls" class="block hover:underline">Coveralls</a></li>
            <li><a href="/collections/headwear" class="block hover:underline">Headwear</a></li>
            <li><a href="/collections/bags" class="block hover:underline">Bags</a></li>
            <li><a href="/collections/accessories" class="block hover:underline">Accessories</a></li>
            <li><a href="/collections/shoes" class="block hover:underline">Shoes</a></li>
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

      case "search":
        html = `
          <form action="/search" method="get" role="search" class="flex gap-2 items-center">
            <input type="hidden" name="options[prefix]" value="last">
            <input
              type="search"
              name="q"
              placeholder="Type here…"
              aria-label="Search products"
              class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
              id="fm-search-input"
            >
            <button
              type="submit"
              class="rounded-md border border-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-900 hover:text-white"
            >
              Search
            </button>
          </form>`;
        break;
    }

    this.contentTarget.innerHTML = html;

    // Expand panel (simple approach you were using)
    const panel = this.panelTarget;
    panel.classList.remove("opacity-0");
    panel.style.height = panel.scrollHeight + "px";
    this.element.classList.add("open");

    // Autofocus the search input after DOM paints (if search view)
    if (key === "search") {
      requestAnimationFrame(() => {
        const input = this.contentTarget.querySelector("#fm-search-input");
        input && input.focus();
      });
    }
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

// assets/stimulus-init.js
const app = window.Stimulus.Application.start()
import("./footer_nav_controller.js").then(mod => {
  app.register("footer-nav", mod.default)
})

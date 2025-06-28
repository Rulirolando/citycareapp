import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationTemplate,
  generateUnauthenticatedNavigationTemplate,
} from "../templates";
import { getAccessToken, getLogout } from "../utils/auth";
import { transitionHelper } from "../utils/index";
import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
} from "../templates";
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from "../utils/notification-helper";

class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  #setupNavigationDrawer() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#navigationDrawer.querySelector("#nav-list-main");
    const navList = this.#navigationDrawer.querySelector("#navlist");

    if (!isLogin) {
      navListMain.innerHTML = "";
      navList.innerHTML = generateUnauthenticatedNavigationTemplate();
      return;
    }

    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById("logout-link");
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (confirm("Are you sure you want to logout?")) {
        getLogout();
        location.hash = "/login";
      }
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById(
      "push-notification-tools"
    );

    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document
        .getElementById("unsubscribe-button")
        .addEventListener("click", () => {
          unsubscribe().finally(() => {
            this.#setupPushNotification();
          });
        });
      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document
      .getElementById("subscribe-button")
      .addEventListener("click", () => {
        console.log("Subscribe button clicked"); // Debug
        subscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
  }

  async renderPage() {
    console.log("Rendering page..."); // Debug
    const url = getActiveRoute();
    console.log("Current URL route:", url); // Debug
    const route = routes[url];

    if (route === null || typeof route !== "function") {
      console.warn(`route ${url} not found`); // Debug
      location.hash = "/login";
      return;
    }

    // Tambahkan: destroy page sebelumnya jika ada
    if (this._currentPage && typeof this._currentPage.destroy === "function") {
      this._currentPage.destroy();
    }

    const page = route();
    this._currentPage = page;
    if (!page) {
      return;
    }

    const supportsViewTransition =
      typeof document.startViewTransition === "function";

    const transition = transitionHelper({
      skipTransition: !supportsViewTransition,
      updateDOM: async () => {
        console.log("Mulai render");
        const content = await page.render();
        this.#content.innerHTML = content;
        console.log("Selesai render, mulai afterRender");
        await page.afterRender();
        console.log("Selesai afterRender");
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "smooth" });
      this.#setupNavigationDrawer();
      this.#setupPushNotification();
      console.log("Page rendered successfully"); // Debug
    });
  }
}

export default App;

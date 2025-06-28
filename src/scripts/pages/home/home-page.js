import HomePresenter from "./home-presenter";
import * as StoryModel from "../../data/api";
import { idbStory } from "../../utils/idb";
import {
  generateStoryItemTemplate,
  generateStoryListEmpty,
  generateStoryListError,
} from "../../templates";
import { isCurrentPushSubscriptionAvailable } from "../../utils/notification-helper";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section >
      <div class="story-container">
        <h2>Daftar Story</h2>
        <div class="story-list"></div>
      </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryModel,
    });

    try {
      await this.#presenter.showStoryListMap();
      const stories = await StoryModel.getAllStories();
      await this.populateStoryList(stories.listStory);
    } catch (error) {
      console.error("Error in afterRender:", error);
      const offlineStories = await idbStory.getAll();
      await this.populateStoryList(offlineStories);
    }
  }

  async populateStoryList(story) {
    if (!story || story.length === 0) {
      this.populateStoryListEmpty();
      return;
    }

    let savedIds = [];
    try {
      const savedStories = await idbStory.getAll();
      savedIds = Array.isArray(savedStories)
        ? savedStories.map((s) => s.id)
        : [];
    } catch (error) {
      // Jika gagal ambil dari IndexedDB, tetap gunakan array kosong
      savedIds = [];
    }

    // Urutkan story terbaru ke atas
    const sortedStory = [...story].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (a.id && b.id) {
        return b.id.localeCompare(a.id); // fallback jika id string
      }
      return 0;
    });

    const storyListContainer = document.querySelector(".story-list");
    storyListContainer.innerHTML = sortedStory
      .map((story) =>
        generateStoryItemTemplate(story, savedIds.includes(story.id))
      )
      .join("");

    // Event untuk toggle peta
    let activeMap = null;
    let activeMapId = null;
    document.querySelectorAll(".toggle-map-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const mapId = button.getAttribute("data-map-id");
        const lat = parseFloat(button.getAttribute("data-lat"));
        const lon = parseFloat(button.getAttribute("data-lon"));
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer) return;

        // Jika peta sedang aktif, tutup dulu
        if (activeMap && activeMapId !== mapId) {
          activeMap = null;
          const prevMap = document.getElementById(activeMapId);
          if (prevMap) {
            prevMap.style.display = "none";
            prevMap.innerHTML = "";
          }
        }

        // Toggle tampil/sembunyi
        if (
          mapContainer.style.display === "none" ||
          mapContainer.style.display === ""
        ) {
          mapContainer.style.display = "block";
          // Render peta hanya jika belum ada
          if (!mapContainer._leaflet_id) {
            const { default: CustomMap } = await import("../../utils/map");
            const mapInstance = await CustomMap.build(`#${mapId}`, {
              zoom: 15,
              center: [lat, lon],
            });
            mapInstance.addMarker([lat, lon], {});
            activeMap = mapInstance;
            activeMapId = mapId;
          }
          showMapNotification();
        } else {
          mapContainer.style.display = "none";
          mapContainer.innerHTML = "";
          activeMap = null;
          activeMapId = null;
        }
      });
    });

    document.querySelectorAll(".save-story-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const id = button.getAttribute("data-id");
        const storyData = sortedStory.find((s) => s.id === id);
        const isSaved = !!(await idbStory.get(id));
        if (isSaved) {
          await idbStory.delete(id);
          button.textContent = "Simpan";
        } else {
          await idbStory.save(storyData);
          button.textContent = "Batalkan Simpan";
        }
      });
    });
  }

  populateStoryListEmpty() {
    document.querySelector(".story-list").innerHTML = generateStoryListEmpty();
  }

  async showErrorMessage() {
    document.querySelector(".story-list").innerHTML = generateStoryListError();
  }
}

async function showMapNotification() {
  if (
    Notification.permission === "granted" &&
    navigator.serviceWorker.controller &&
    (await isCurrentPushSubscriptionAvailable())
  ) {
    console.log("Sending message to service worker");
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_MAP_NOTIFICATION",
      title: "Peta Dibuka",
      body: "Kamu baru saja membuka peta",
      icon: "/images/logo.png",
      badge: "/images/logo.png",
    });
  } else {
    console.log(
      "Notification permission not granted or service worker not available"
    );
  }
}

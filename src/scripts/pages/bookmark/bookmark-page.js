import { idbStory } from "../../utils/idb";
import { generateStoryItemTemplate } from "../../templates";

export default class BookmarkPage {
  async render() {
    return `
            <section>
               
                    <h2>Bookmark</h2>
                    <div class="bookmark-list"></div>
                
            </section>
        `;
  }
  async afterRender() {
    const stories = await idbStory.getAll();
    const container = document.querySelector(".bookmark-list");
    if (!stories.length) {
      container.innerHTML = `<p>Belum ada cerita yang disimpan.</p>`;
      return;
    }
    container.innerHTML = stories
      .map((story) => generateStoryItemTemplate(story, true))
      .join("");

    container.querySelectorAll(".save-story-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const id = button.getAttribute("data-id");
        await idbStory.delete(id);
        button.closest(".story-item").remove();
      });
    });

    container.querySelectorAll(".toggle-map-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const mapId = button.getAttribute("data-map-id");
        const lat = parseFloat(button.getAttribute("data-lat"));
        const lon = parseFloat(button.getAttribute("data-lon"));

        let mapContainer = document.getElementById(mapId);
        if (!mapContainer) return;

        if (
          mapContainer.style.display === "none" ||
          mapContainer.style.display === ""
        ) {
          mapContainer.style.display = "block";
          if (!mapContainer._leaflet_id) {
            const { default: CustomMap } = await import("../../utils/map");
            const mapInstance = await CustomMap.build(`#${mapId}`, {
              zoom: 15,
              center: [lat, lon],
            });
            mapInstance.addMarker([lat, lon], {});
          }
        } else {
          mapContainer.style.display = "none";
          mapContainer.innerHTML = "";
        }
      });
    });
  }
}

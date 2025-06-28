import { idbStory } from "../../utils/idb";

export default class HomePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async showStoryListMap() {
    try {
      const response = await this.#model.getAllStories();
      console.log("API getAllStories response:", response);
      const stories = response.listStory;
      this.#view.populateStoryList(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      const offlineStories = await idbStory.getAll();
      if (offlineStories && offlineStories.length > 0) {
        console.log("Using offline stories:", offlineStories);
        this.#view.populateStoryList(offlineStories);
      } else {
        this.#view.showErrorMessage();
      }
    }
  }
}

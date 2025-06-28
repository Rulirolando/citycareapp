import { openDB } from "idb";

const dbPromise = openDB("notes-app-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("stories")) {
      db.createObjectStore("stories", { keyPath: "id" });
    }
  },
});

export const idbStory = {
  async save(story) {
    return (await dbPromise).put("stories", story);
  },
  async getAll() {
    return (await dbPromise).getAll("stories");
  },
  async get(id) {
    return (await dbPromise).get("stories", id);
  },
  async delete(id) {
    return (await dbPromise).delete("stories", id);
  },
};

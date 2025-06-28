export function generateUnauthenticatedNavigationTemplate() {
  return `
        <li><a id="login-link" href="#/login">Login</a></li>
        <li><a id="register-link" href="#/register">Register</a></li>  
    `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
        <li><a id="bookmark-link" href="#/bookmark">Bookmark</a></li>
        <li><a id='new-story-link' href="#/stories">Daftar Story</a></li>
        <li><a id="logout-link" href="#/logout">Logout</a></li>`;
}

export function generateStoryListEmpty() {
  return `
        <div class="story-list-empty">
            <h3>Belum ada cerita</h3>
        </div>
    `;
}

export function generateStoryListError() {
  return `
        <div class="story-list-error">
            <h3>Gagal memuat cerita</h3>
        </div>
    `;
}

export function generateStoryItemTemplate(story, isSaved = false) {
  const mapId = `map-story-${story.id}`;
  return `<div class="story-item">
        ${story.photoUrl ? `<img src="${story.photoUrl}" alt="${story.name}" class="story-photo" style="width:100%;max-width:400px;display:block;margin:auto;">` : ""}
        <h3 style="margin-top:10px;">${story.name || ""}</h3>
        <p>${story.description || ""}</p>
        <button class="toggle-map-btn" data-map-id="${mapId}" data-lat="${story.lat}" data-lon="${story.lon}">Lihat Peta</button>
        <button class="save-story-btn" data-id="${story.id}">
        ${isSaved ? "Batalkan Simpan" : "Simpan"}
        </button>
        <div class="story-map-container" id="${mapId}" style="width:100%;height:250px;display:none;margin:10px 0;"></div>
        <div class="story-coord" style="font-size:0.95em;color:#555;">Lat: ${story.lat}, Lon: ${story.lon}</div>
    </div>`;
}

export function generateSubscribeButtonTemplate() {
  return `
        <button id="subscribe-button" class="subscribe-button">Berlangganan Notifikasi</button>`;
}
export function generateUnsubscribeButtonTemplate() {
  return `<button id="unsubscribe-button" class="unsubscribe-button">Batalkan Berlangganan Notifikasi</button>`;
}

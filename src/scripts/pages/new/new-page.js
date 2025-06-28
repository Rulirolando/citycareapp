import NewPresenter from "./new-presenter";
import * as StoryAPI from '../../data/api'
import Camera from "../../utils/camera";
import CustomMap from "../../utils/map";
export default class NewPage {
    #presenter;
    #form;
    #camera;
    #isCameraActive = false;
    #takenPhoto = [];
    #map = null;
    #markerPosition = null;
    #marker = null;

    async render() {
        return `
       <div class="new-page-container">
       <h1 class="title">Tambahkan story baru</h1>
       <form id="new-form" class="new-card">
       <input
       type="text"
       id="title"
       placeholder="Masukkan judul"
       required
       class="form-input"
       />
       <textarea
       id="description"
       placeholder="Masukkan deskripsi"
       required
       class="form-textarea"
       ></textarea>
        <div class="form-section">
        <label>Foto:</label>
        <div id="camera-container" class="camera-box"></div>
        <button type="button" id="take-photo" class="btn-secondary">Ambil Foto</button>
        <button type="button" id="close-camera" class="btn-secondary" style="margin-left:8px;">Tutup Kamera</button>
        <button type="button" id="open-camera" class="btn-secondary" style="margin-left:8px;">Buka Kamera</button>
       </div>
       <div class="form-section">
       <label>Lokasi: </label>
       <div id="map" class="map-box"></div>
       </div>
       <button type="submit" class="btn-primary">Tambahkan Story</button>
       </form>
       </div>
        `;
    }

    async afterRender() {
            this.#presenter = new NewPresenter({
            view: this,
            model: StoryAPI,
        });
         this.#takenPhoto = []

        this.#presenter.showNewFormMap(); 
    }

    showErrorMessage(message = 'Something went wrong') {
        alert(message);
    }

    setupForm() {
        this.#form = document.getElementById('new-form');
        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();
         const data = {
            title: this.#form.querySelector('#title').value,
            description: this.#form.querySelector('#description').value,
            photo: this.#takenPhoto,
            location: this.#markerPosition ?? this.#map.getCenter(),
         }

         await this.#presenter.saveStory(data);
        });
    }

    async initialCamera() {
     const cameraContainer = document.getElementById('camera-container');
     const canvas = document.createElement('canvas');
     const video = document.createElement('video');
     const select = document.createElement('select');

     cameraContainer.append(video, select, canvas);

     // Tambahkan elemen img untuk preview foto
     let photoPreview = cameraContainer.querySelector('#photo-preview');
     if (!photoPreview) {
        photoPreview = document.createElement('img');
        photoPreview.id = 'photo-preview';
        photoPreview.style.display = 'none';
        photoPreview.style.maxWidth = '100%';
        photoPreview.style.marginTop = '10px';
        cameraContainer.appendChild(photoPreview);
     }

     this.#camera = new Camera({
        video, 
        cameraSelect: select,
        canvas,
     })

     await this.#camera.launch();

     this.#camera.addCheeseButtonListener('#take-photo', async () => {
        const photo = await this.#camera.takePicture();
        if(photo) {
            this.#takenPhoto = [photo];
            // Tampilkan preview gambar
            const url = URL.createObjectURL(photo);
            photoPreview.src = url;
            photoPreview.style.display = 'block';
        }
     });
     const closeBtn = document.getElementById('close-camera');
     closeBtn.onclick = () => {
        this.#camera.stop();
        video.style.display = 'none';
        select.style.display = 'none';
        canvas.style.display = 'none';
        // Jangan sembunyikan photoPreview, biarkan tetap tampil
     };

     // Tombol buka kamera
     const openBtn = document.getElementById('open-camera');
     openBtn.onclick = async () => {
        video.style.display = '';
        select.style.display = '';
        canvas.style.display = '';
        await this.#camera.launch();
     };

     
    }

    async initialMap() {
        this.#map = await CustomMap.build('#map', {
            zoom: 15,
            locate: true,
        })

        // Ambil posisi awal dari center map
        const center = this.#map.getCenter();
        this.#markerPosition = { ...center };
        // Tambahkan marker draggable
        this.#marker = this.#map.addMarker([center.latitude, center.longitude], { draggable: true });
        // Update posisi marker saat digeser
        this.#marker.on('dragend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            this.#markerPosition = { latitude: lat, longitude: lng };
        });

        setTimeout(() => {
            this.#map.invalidateSize();
        }, 300);

    }

    // Tambahkan method destroy untuk mematikan kamera saat pindah halaman
    destroy() {
        if (this.#camera) {
            this.#camera.stop();
        }
    }
}
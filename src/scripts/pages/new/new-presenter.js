export default class NewPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showNewFormMap() {
        
        try {
            await this.#view.initialMap();
            await this.#view.initialCamera();
            this.#view.setupForm();
        } catch (error) {
            console.error('Error fetching stories:', error);
            this.#view.showErrorMessage();
        }
    }

    async saveStory (data) {
        try {
            const formData = new FormData();
            // formData.append('title', data.title); // Dihapus karena tidak diterima API
            formData.append('description', data.description);
            formData.append('lat', data.location.latitude);
            formData.append('lon', data.location.longitude);

            if(data.photo && data.photo[0] instanceof Blob) {
                let photoBlob = data.photo[0];
                if (!photoBlob.type || photoBlob.type === '') {
                    photoBlob = new Blob([photoBlob], { type: 'image/jpeg' });
                }
                formData.append('photo', photoBlob, 'story-photo.jpg');
            }

            await this.#model.postStory(formData);
            alert('Story berhasil disimpan\nLatitude: ' + data.location.latitude + '\nLongitude: ' + data.location.longitude);
            location.hash = '/';
        } catch (error) {
            console.error('Error fetching stories:', error);
            alert('Story gagal disimpan: ' + (error?.message || error));
        }
    }
}
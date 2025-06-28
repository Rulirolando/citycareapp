import {map, tileLayer, Icon, icon, marker, popup, latLng} from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MAP_SERVICE_API_KEY } from '../config'

export default class CustomMap {
    #zoom = 5;
    #map = null;

    static async getPlaceNameByCoordinate(latitude, longitude) {
        try {
            const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
            url.searchParams.set('key', MAP_SERVICE_API_KEY);
            url.searchParams.set('limit', '1');
            url.searchParams.set('language', 'id');
            const response = await fetch(url);
            const json = await response.json();
            const place = json.features[0].place_name.split(', ');
            return [place.at(-2), place.at(-1)].map((name) => name).join(', ');
        } catch (error) {
            console.error(error);
            return `${latitude}, ${longitude}`
        }
    }

    static isGeolocationAvailable() {
        return 'geolocation' in navigator;
    }

    static getCurrentPosition(options = {}){
        return new Promise((resolve, reject) => {
            if (!CustomMap.isGeolocationAvailable()) {
                reject('Geolocation is not available');
                return
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        })
    }

    static async build(selector, options = {}) {
        if ('center' in options && options.center) {
            return new CustomMap(selector, options);
        }

        const jakartaCoordinate = [-6.2, 106.816666];

        if('locate' in options && options.locate) {
            try {
                const position = await CustomMap.getCurrentPosition();
                const coordinate = [position.coords.latitude, position.coords.longitude];

                return new CustomMap(selector, {
                    ...options,
                    center: coordinate,
                });
            } catch (error) {
                console.error(error);

                return new CustomMap(selector, {
                    ...options,
                    center: jakartaCoordinate,
                });
            }
        }

        return new CustomMap(selector, {
            ...options,
            center: jakartaCoordinate,
        });
    }

    constructor(selector, options = {} ) {
        this.#zoom = options.zoom ?? this.#zoom;

        const tileOsm = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        });

        this.#map = map(document.querySelector(selector), {
            zoom: this.#zoom,
            scrollWheelZoom: false,
            layers: [tileOsm],
            ...options,
        });
    }

    changeCamera(coordinate, zoomLevel = null) {
        if(!zoomLevel) {
            this.#map.setView(latLng(coordinate), this.#zoom);
            return;
        }
        this.#map.setView(latLng(coordinate), zoomLevel);
    }

    getCenter() {
        const {lat,lng} = this.#map.getCenter();
        return {
            latitude: lat,
            longitude: lng
        }
    }
    createIcon(options = {} ) {
        return icon({
            ...Icon.Default.prototype.options,
            iconUrl: markerIcon,
            iconRetinaUrl: markerIcon2x,
            shadowUrl: markerShadow,
            ...options
        })
    }
    addMarker(coordinates, markerOptions = {}, popupOptions = null) {
        if(typeof markerOptions !== 'object') {
            throw new Error('Marker options must be an object');
        }
        const newMarker = marker(coordinates, {
            icon: this.createIcon(markerOptions),
            ...markerOptions,
        })
        if(popupOptions) {
          if(typeof popupOptions !== 'object') {
            throw new Error('Popup options must be an object');
          }
          if(!('content' in popupOptions)) {
            throw new Error('Popup options must have a content property');
          }
          const newPopup = popup(coordinates,popupOptions);
          newMarker.bindPopup(newPopup);
        }
       newMarker.addTo(this.#map);
       return newMarker;
    }
    addMapEventListener(eventName, callback) {
        this.#map.addEventListener(eventName, callback);
    }

    invalidateSize() {
        this.#map.invalidateSize();
    }
    
}
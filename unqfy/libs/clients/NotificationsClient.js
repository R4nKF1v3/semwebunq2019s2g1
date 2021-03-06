"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'http://172.20.0.22:5001/api';
class NotificationsClient {
    static notifyNewAlbum(artist, album) {
        const rp = require('request-promise');
        let options = {
            uri: BASE_URL + '/notify',
            body: {
                artistId: artist.id,
                subject: 'Nuevo album para artista ' + artist.getName(),
                message: 'Se ha agregado el album ' + album.name + ' al artista ' + artist.getName(),
            },
            json: true
        };
        rp.post(options)
            .then((response) => {
            console.log("Notificado servicio de Notificaciones sobre nuevo album agregado " + album.name + " de artista " + artist.getName());
        })
            .catch((error) => {
            console.log("Ha habido un error al intentar notificar al servicio de Notificaciones sobre el nuevo album " + album.name + " de artista " + artist.getName());
        });
    }
    static notifyDeleteArtist(artist) {
        const rp = require('request-promise');
        let options = {
            uri: BASE_URL + '/subscriptions',
            body: {
                artistId: artist.id,
            },
            json: true
        };
        return rp.delete(options)
            .then((response) => {
            console.log("Servicio de notificaciones eliminó correctamente todas las subscripciones al artista " + artist.getName());
        })
            .catch((error) => {
            console.log("Ha habido un error en el servicio de notificaciones para eliminar las subscripciones al artista " + artist.getName());
        });
    }
}
exports.default = NotificationsClient;

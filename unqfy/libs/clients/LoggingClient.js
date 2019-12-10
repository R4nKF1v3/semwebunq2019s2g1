"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'http://localhost:5002/api/';
class LoggingClient {
    static createOptions(tipo, msg, head) {
        var dateFormat = require('date-format');
        var datestr = dateFormat('yyyy-MM-dd', new Date());
        var options = {
            uri: BASE_URL + "/log",
            body: {
                type: tipo,
                message: msg,
                header: head,
                date: datestr
            },
            json: true
        };
        console.log(options);
        return options;
    }
    static notifyAddArtist(type, message) {
        const rp = require('request-promise');
        rp.post(this.createOptions(type, message, "Agregar Artista"))
            .then((response) => {
            console.log('Notificado servicio de logging para agregar artista');
        }).catch(error => {
            console.log('error' + error.message);
        });
    }
    static notifyDeleteArtist(type, message) {
        const rp = require('request-promise');
        rp.delete(this.createOptions(type, message, "Eliminar Artista"))
            .then((response) => {
            console.log('Notificado servicio de logging para eliminar artista');
        }).catch(error => {
            console.log('error' + error.message);
        });
    }
    static notifyAddAlbum(type, message) {
        const rp = require('request-promise');
        rp.post(this.createOptions(type, message, "Agregar Album"))
            .then((response) => {
            console.log('Notificado servicio de logging para agregar album');
        }).catch(error => {
            console.log('error' + error.message);
        });
    }
    static notifyDeleteAlbum(type, message) {
        const rp = require('request-promise');
        rp.delete(this.createOptions(type, message, "Eliminar Album"))
            .then((response) => {
            console.log('Notificado servicio de logging para eliminar album');
        }).catch(error => {
            console.log('error' + error.message);
        });
    }
    static notifyAddTrack(type, message) {
        const rp = require('request-promise');
        rp.post(this.createOptions(type, message, "Agregar track"))
            .then((response) => {
            console.log('Notificado servicio de logging para agregar track');
        }).catch(error => {
            console.log('error' + error.message);
        });
    }
    static notifyDeleteTrack(type, message) {
        const rp = require('request-promise');
        rp.delete(this.createOptions(type, message, "Eliminar Track"))
            .then((response) => {
            console.log('Notificado servicio de logging para eliminar track');
        }).catch(error => {
            console.log('error' + error.message);
        });
    }
}
exports.default = LoggingClient;

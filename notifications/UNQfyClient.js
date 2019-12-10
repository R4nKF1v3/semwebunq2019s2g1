"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'http://172.20.0.21:5000/api';
class UNQfyClient {
    static getArtistID(artistId) {
        const rp = require('request-promise');
        var options = {
            uri: BASE_URL + '/artists/' + artistId,
            json: true
        };
        return rp.get(options);
    }
    static getArtistByName(artistId) {
        const rp = require('request-promise');
        var options = {
            uri: BASE_URL + '/artists?name=' + artistId,
            json: true
        };
        return rp.get(options);
    }
}
exports.default = UNQfyClient;

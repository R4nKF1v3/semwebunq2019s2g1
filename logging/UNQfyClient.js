"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'http://localhost:5000/api';
class UNQfyClient {
    static getLogMessage(artistId) {
        const rp = require('request-promise');
        var options = {
            uri: BASE_URL + '/artists/' + artistId,
            json: true
        };
        return rp.get(options);
    }
}
exports.default = UNQfyClient;

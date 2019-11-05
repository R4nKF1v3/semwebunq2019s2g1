"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoLyricsFoundForTrack_1 = __importDefault(require("../exceptions/NoLyricsFoundForTrack"));
const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
class MusixmatchClient {
    constructor() {
        this.idCache = [];
    }
    queryTrackId(name, artistName) {
        this.idCache.forEach(track => {
            if (track.name === name && track.artistName === artistName) {
                return track.id;
            }
        });
        const rp = require('request-promise');
        var options = {
            uri: BASE_URL + '/track.search',
            qs: {
                apikey: '1590d2f1e38d79145981ae0f60a2b78e',
                q_track: name,
                q_artist: artistName,
                f_has_lyrics: true
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp.get(options)
            .then((response) => {
            var body = response.message.body;
            var track = body.track_list.find(track => track.track.artist_name.toLowerCase() == artistName.toLowerCase());
            if (track) {
                this.idCache.push({ artistName, name, id: track.track.track_id });
                return track.track.track_id;
            }
            else {
                throw new NoLyricsFoundForTrack_1.default(name);
            }
        });
    }
    queryTrackLyrics(track_id) {
        const rp = require('request-promise');
        var options = {
            uri: BASE_URL + '/track.lyrics.get',
            qs: {
                apikey: '1590d2f1e38d79145981ae0f60a2b78e',
                track_id: track_id,
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp.get(options)
            .then((response) => {
            return response.message.body.lyrics;
        });
    }
}
exports.default = MusixmatchClient;

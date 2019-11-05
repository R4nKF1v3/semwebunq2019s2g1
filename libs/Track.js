"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MusixmatchClient_1 = __importDefault(require("./clients/MusixmatchClient"));
class Track {
    constructor(id, name, duration, genres, album) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.genres = genres;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            duration: this.duration,
            genres: this.genres
        };
    }
    containsGenre(genres) {
        return genres.some(genre => this.genres.includes(genre));
    }
    hasSameGenres(genres) {
        const res = this.genres.filter(genre => genres.includes(genre));
        return res.length === this.genres.length && res.length === genres.length;
    }
    getLyrics() {
        const client = new MusixmatchClient_1.default;
        if (this.lyrics) {
            return this.lyrics;
        }
        client.queryTrackName(this.name)
            .then((response) => {
            console.log(response);
            let trackId = response;
            return client.queryTrackLyrics(trackId);
        }).then((lyrics) => {
            this.lyrics = lyrics;
            return this.lyrics;
        });
    }
}
exports.default = Track;

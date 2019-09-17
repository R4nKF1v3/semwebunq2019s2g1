"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Track {
    constructor(id, name, duration, genres, album) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.genres = genres;
    }
    containsGenre(genres) {
        return genres.find(genre => this.genres.includes(genre)) != null;
    }
    hasSameGenres(genres) {
        const res = this.genres.filter(genre => genres.includes(genre));
        return res.length === this.genres.length && res.length === genres.length;
    }
}
exports.default = Track;

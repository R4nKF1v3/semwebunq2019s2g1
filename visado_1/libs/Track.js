"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Track {
    constructor(id, name, duration, genres) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.genres = genres;
    }
    hasGenre(genres) {
        return genres.find(genre => this.genres.includes(genre)) != null;
    }
}
exports.default = Track;

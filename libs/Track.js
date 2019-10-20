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
        return genres.some(genre => this.genres.includes(genre));
    }
    hasSameGenres(genres) {
        const res = this.genres.filter(genre => genres.includes(genre));
        return res.length === this.genres.length && res.length === genres.length;
    }
    getLyrics() {
        if (this.lyrics) {
            return this.lyrics;
        }
        //Buscar id del track en MusixMatch
        //Hacer el request del JSON con el id
        //Operar sobre la respuesta y guardar y devolver el "lyrics_body" del response.body.lyrics en this.lyrics
    }
}
exports.default = Track;

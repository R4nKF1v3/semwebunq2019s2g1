"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Playlist {
    constructor(id, name, genres, unqfy) {
        this.tracks = [];
        this.id = id;
        this.genres = genres;
        this.name = name;
        this.unqfy = unqfy;
    }
    getTracks() {
        // unqfy.allTracks() filtrar por los generos de este playlist
        throw new Error("No implementado");
    }
}
exports.default = Playlist;

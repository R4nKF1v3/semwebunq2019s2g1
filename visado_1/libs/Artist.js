"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Artist {
    constructor(id, name, country) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.albums = [];
    }
    addAlbum(album) {
        this.albums.push(album);
    }
    getAlbums() {
        return this.albums;
    }
    deleteAlbum(albumId) {
        this.albums = this.albums.filter(album => album.id !== albumId);
    }
}
exports.default = Artist;

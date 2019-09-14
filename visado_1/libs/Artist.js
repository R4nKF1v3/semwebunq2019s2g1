"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Album_1 = require("./Album");
class Artist {
    constructor(id, name, country) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.albums = [];
    }
    addAlbum(albumData, unqfy) {
        if (this.albumDoesNotExist(albumData)) {
            const newAlbum = new Album_1.default(unqfy.getNewAlbumId(), albumData.name, albumData.year);
            this.albums.push(newAlbum);
            return newAlbum;
        }
        else {
            throw new Error(`Album ${albumData.name} of ${this.name} in ${albumData.year} already exists!`);
        }
    }
    albumDoesNotExist(albumData) {
        return this.albums.find(album => album.name === albumData.name && album.year === albumData.year) == null;
    }
    getAlbums() {
        return this.albums;
    }
    deleteAlbum(albumId) {
        this.albums = this.albums.filter(album => album.id !== albumId);
    }
}
exports.default = Artist;

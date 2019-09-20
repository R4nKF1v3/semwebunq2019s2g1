"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Album_1 = require("./Album");
const ElementAlreadyExistsError_1 = require("./exceptions/ElementAlreadyExistsError");
class Artist {
    constructor(id, name, country) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.albums = [];
    }
    addAlbum(albumData, unqfy) {
        if (this.albumDoesNotExist(albumData)) {
            const newAlbum = new Album_1.default(unqfy.getNewAlbumId(), albumData.name, albumData.year, this);
            this.albums.push(newAlbum);
            return newAlbum;
        }
        else {
            throw new ElementAlreadyExistsError_1.default(`Album ${albumData.name} of ${this.name} in ${albumData.year}`);
        }
    }
    albumDoesNotExist(albumData) {
        return !this.albums.some(album => album.name === albumData.name && album.year === albumData.year);
    }
    getAlbums() {
        return this.albums;
    }
    deleteAlbum(albumToDelete) {
        this.albums = this.albums.filter(album => album.id !== albumToDelete.id);
    }
    getAllTracks() {
        var allTracks = [];
        console.log("Get all tracks:");
        console.log(JSON.stringify(this.albums));
        console.log(typeof (this.albums[0]));
        this.albums.forEach(album => {
            console.log("Object album:");
            console.log(album);
            const tracks = album.getTracks();
            allTracks = allTracks.concat(tracks);
        });
        return allTracks;
    }
}
exports.default = Artist;

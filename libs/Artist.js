"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpotifyClient_1 = __importDefault(require("./clients/SpotifyClient"));
const Album_1 = __importDefault(require("./Album"));
const ElementAlreadyExistsError_1 = __importDefault(require("./exceptions/ElementAlreadyExistsError"));
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
    getName() {
        return this.name;
    }
    getCountry() {
        return this.country;
    }
    getAlbums() {
        return this.albums;
    }
    getAlbumsNames() {
        let albums = [];
        for (let album of this.albums) {
            albums.push({ name: album.name });
        }
        ;
        return albums;
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
    getMostListened(users) {
        const tracks = this.getAllTracks();
        tracks.sort((a, b) => this.compareListenersForTracks(a, b, users));
        return tracks.slice(0, 2);
    }
    compareListenersForTracks(track1, track2, users) {
        let times1 = this.timesListenedFor(track1, users);
        let times2 = this.timesListenedFor(track2, users);
        if (times1 < times2) {
            return -1;
        }
        else if (times1 > times2) {
            return 1;
        }
        else {
            return 0;
        }
    }
    timesListenedFor(track, users) {
        let times = 0;
        users.forEach(user => times += user.getTimesTrackListened(track));
        return times;
    }
    populateAlbums(unqfy, callback) {
        const client = new SpotifyClient_1.default;
        client.queryArtistName(this.name)
            .then((response) => {
            console.log(response.artists.items[0]);
            let artistId = response.artists.items[0].id;
            return client.queryArtistAlbums(artistId);
        }).then(res => {
            console.log(res);
            let albumList = res.items;
            albumList.forEach(albResponse => {
                let albumData = { name: albResponse.name, year: albResponse.release_date.substring(0, 3) };
                try {
                    this.addAlbum(albumData, unqfy);
                }
                catch (error) {
                    console.log(error.message);
                }
            });
            callback(this.getAlbumsNames(), unqfy);
        }).catch(err => {
            console.log(err.message);
        });
    }
    changeParameters(name, country) {
        this.name = name;
        this.country = country;
    }
    hasTrack(track) {
        return this.albums.some(album => album.hasTrack(track));
    }
    toJSON() {
        let albumList = [];
        this.albums.forEach(album => albumList.push(album.toJSON()));
        return {
            id: this.id,
            name: this.name,
            albums: albumList,
            country: this.country,
        };
    }
}
exports.default = Artist;

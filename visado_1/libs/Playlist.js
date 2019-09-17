"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Playlist {
    constructor(id, name, genres, unqfy, maxDuration) {
        this.tracks = [];
        this.id = id;
        this.genres = genres;
        this.name = name;
        this.unqfy = unqfy;
        this.maxDuration = maxDuration;
        this.fillPlaylist();
    }
    fillPlaylist() {
        this.tracks = [];
        let totalDuration = 0;
        for (let currentTrack of this.unqfy.getTracksMatchingGenres(this.genres)) {
            if (this.maxDuration < (totalDuration + currentTrack.duration))
                break;
            this.tracks.push(currentTrack);
        }
    }
    deleteTrack(id) {
        this.tracks = this.tracks.filter(track => track.id !== id);
    }
    duration() {
        return this.tracks.reduce((acum, track) => acum + track.duration, 0);
    }
    hasTrack(trackToFind) {
        return this.tracks.some(track => track.id === trackToFind.id);
    }
}
exports.default = Playlist;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Playlist {
    constructor(id, name, genres, maxDuration) {
        this.tracks = [];
        this.id = id;
        this.genres = genres;
        this.name = name;
        this.maxDuration = maxDuration;
    }
    fillPlaylist(unqfy) {
        this.tracks = [];
        let totalDuration = 0;
        // TODO: Considerar caso de tracks con duraciones que entran posteriores a tracks con duraciones mayores al máximo
        for (let currentTrack of unqfy.getTracksMatchingGenres(this.genres)) {
            if (this.maxDuration < (totalDuration + currentTrack.duration))
                break;
            this.tracks.push(currentTrack);
        }
    }
    deleteTrack(trackToDelete) {
        this.tracks = this.tracks.filter(track => track.id !== trackToDelete.id);
    }
    duration() {
        return this.tracks.reduce((acum, track) => acum + track.duration, 0);
    }
    hasTrack(trackToFind) {
        return this.tracks.some(track => track.id === trackToFind.id);
    }
    getTracks() {
        return this.tracks;
    }
    toJSON() {
        return {
            "id": this.id,
            "name": this.name,
            "duration": this.duration(),
            "tracks": this.tracks
        };
    }
}
exports.default = Playlist;

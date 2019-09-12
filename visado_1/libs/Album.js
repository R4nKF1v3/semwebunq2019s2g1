"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Album {
    constructor(id, name, year) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = [];
    }
    addTrack(track) {
        this.tracks.push(track);
    }
    deleteTrack(trackId) {
        this.tracks = this.tracks.filter(track => track.id !== trackId);
    }
    getTracks() {
        return this.tracks;
    }
}
exports.default = Album;

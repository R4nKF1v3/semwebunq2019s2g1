"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Track_1 = require("./Track");
class Album {
    constructor(id, name, year) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = [];
    }
    addTrack(trackData, unqfy) {
        if (this.trackDoesNotExist(trackData)) {
            const newTrack = new Track_1.default(unqfy.getNewTrackId(), trackData.name, trackData.duration, trackData.genres);
            this.tracks.push(newTrack);
            console.log(`Added new track to the list for album: ${this.name} with name: ${newTrack.name} with duration: ${newTrack.duration} with genres: ${newTrack.genres} with ID: ${newTrack.id}`);
            return newTrack;
        }
        else {
            throw new Error(`Track ${trackData.name} of ${this.name} with genres ${trackData.genres} and duration ${trackData.duration} already exists!`);
        }
    }
    trackDoesNotExist(trackData) {
        return this.tracks.find(track => track.name === trackData.name && track.duration === trackData.duration && track.hasSameGenres(trackData.genres)) == null;
    }
    deleteTrack(trackId) {
        this.tracks = this.tracks.filter(track => track.id !== trackId);
    }
    getTracks() {
        return this.tracks;
    }
}
exports.default = Album;

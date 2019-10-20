"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Track_1 = require("./Track");
const ElementAlreadyExistsError_1 = require("./exceptions/ElementAlreadyExistsError");
class Album {
    constructor(id, name, year, artist) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = [];
    }
    addTrack(trackData, unqfy) {
        if (this.trackDoesNotExist(trackData)) {
            const newTrack = new Track_1.default(unqfy.getNewTrackId(), trackData.name, trackData.duration, trackData.genres, this);
            this.tracks.push(newTrack);
            return newTrack;
        }
        else {
            throw new ElementAlreadyExistsError_1.default(`Track ${trackData.name} of ${this.name} with genres ${trackData.genres} and duration ${trackData.duration}`);
        }
    }
    trackDoesNotExist(trackData) {
        return !this.tracks.some(track => track.name === trackData.name && track.duration === trackData.duration && track.hasSameGenres(trackData.genres));
    }
    deleteTrack(trackToDelete) {
        this.tracks = this.tracks.filter(track => track.id !== trackToDelete.id);
    }
    getTracks() {
        return this.tracks;
    }
}
exports.default = Album;

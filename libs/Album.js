"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Track_1 = __importDefault(require("./Track"));
const ElementAlreadyExistsError_1 = __importDefault(require("./exceptions/ElementAlreadyExistsError"));
class Album {
    constructor(id, name, year, artist) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = [];
    }
    addTrack(trackData, unqfy) {
        if (this.trackDoesNotExist(trackData)) {
            const newTrack = new Track_1.default(unqfy.getNewTrackId(), trackData.name, Number.parseInt(trackData.duration), trackData.genres, this);
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
    hasTrack(track) {
        return this.tracks.includes(track);
    }
    toJSON() {
        let trackList = [];
        this.tracks.forEach(track => trackList.push(track.toJSON()));
        return {
            id: this.id,
            name: this.name,
            year: this.year,
            tracks: trackList
        };
    }
}
exports.default = Album;

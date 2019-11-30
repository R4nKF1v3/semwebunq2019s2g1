"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoLyricsFoundForTrack extends Error {
    constructor(trackName) {
        super(`No lyrics found for '${trackName}' `);
        this.name = "NoLyricsFoundForTrack";
    }
}
exports.default = NoLyricsFoundForTrack;

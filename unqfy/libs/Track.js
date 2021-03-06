"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MusixmatchClient_1 = __importDefault(require("./clients/MusixmatchClient"));
const NoLyricsFoundForTrack_1 = __importDefault(require("./exceptions/NoLyricsFoundForTrack"));
class Track {
    constructor(id, name, duration, genres, album) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.genres = genres;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            duration: this.duration,
            genres: this.genres
        };
    }
    containsGenre(genres) {
        return genres.some(genre => this.genres.includes(genre));
    }
    hasSameGenres(genres) {
        const res = this.genres.filter(genre => genres.includes(genre));
        return res.length === this.genres.length && res.length === genres.length;
    }
    getLyrics(artist) {
        const client = new MusixmatchClient_1.default;
        if (this.lyrics) {
            const util = require("util");
            const ret = util.promisify(() => { return this.lyrics; });
            return ret();
        }
        client.queryTrackId(this.name, artist.getName())
            .then((response) => {
            let trackId = response;
            return client.queryTrackLyrics(trackId);
        })
            .then((lyrics) => {
            if (lyrics) {
                if (lyrics.lyrics_body.length === 0) {
                    throw new NoLyricsFoundForTrack_1.default(this.name);
                }
                this.lyrics = lyrics.lyrics_body;
                return { name: this.name, lyrics: this.lyrics };
            }
            else {
                throw new NoLyricsFoundForTrack_1.default(this.name);
            }
        });
    }
}
exports.default = Track;

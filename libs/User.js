"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HistoryEvent_1 = __importDefault(require("./HistoryEvent"));
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.history = [];
    }
    listenTo(track) {
        const newEvent = new HistoryEvent_1.default(track);
        this.history.push(newEvent);
        return newEvent;
    }
    getAllTracksListenedTo() {
        var historyReturn = [];
        this.history.forEach(hist => {
            if (!hist.hasSameTrack(historyReturn)) {
                historyReturn.push(hist);
            }
        });
        var returnArray = [];
        historyReturn.forEach(hist => returnArray.push(hist.track));
        return returnArray;
    }
    getTimesTrackListened(track) {
        var times = 0;
        this.history.forEach(event => {
            if (event.track.id === track.id) {
                times += 1;
            }
        });
        return times;
    }
    deleteTrack(track) {
        this.history = this.history.filter(event => event.track.id != track.id);
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            history: this.history
        };
    }
}
exports.default = User;

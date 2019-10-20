"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HistoryEvent_1 = require("./HistoryEvent");
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
}
exports.default = User;
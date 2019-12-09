"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HistoryEvent {
    constructor(track) {
        this.track = track;
        this.date = new Date();
    }
    hasSameTrack(list) {
        return list.find(element => element.track.id === this.track.id) != null;
    }
}
exports.default = HistoryEvent;

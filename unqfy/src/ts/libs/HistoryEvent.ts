import Track from "./Track";

export default class HistoryEvent {
  
  readonly track: Track;
  readonly date: Date;

    constructor(track: Track) {
      this.track = track;
      this.date = new Date();
    }

    hasSameTrack(list: Array<HistoryEvent>): boolean{
      return list.find(element => element.track.id === this.track.id) != null
    }
  }
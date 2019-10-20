import HistoryEvent from './HistoryEvent'
import Track from './Track';

export default class User{
  readonly id: number;
  readonly name: string;
  private history: Array<HistoryEvent>;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.history = [];
  }

  listenTo(track: Track): HistoryEvent{
    const newEvent = new HistoryEvent(track)
    this.history.push(newEvent);
    return newEvent;
  }

  getAllTracksListenedTo(): Array<Track>{
    var historyReturn: Array<HistoryEvent> = [];
    this.history.forEach(hist => {
      if (!hist.hasSameTrack(historyReturn)){
        historyReturn.push(hist);
      }
    })
    var returnArray: Array<Track> = [];
    historyReturn.forEach(hist => returnArray.push(hist.track));
    return returnArray;
  }

  getTimesTrackListened(track: Track): number{
    var times = 0;
    this.history.forEach(event => {
      if (event.track.id === track.id){
        times += 1;
      }
    })
    return times;
  }

  deleteTrack(track: Track){
    this.history = this.history.filter(event => event.track.id != track.id);
  }
}

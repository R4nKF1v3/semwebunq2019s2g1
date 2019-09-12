import Track from "./Track";

export default class Album{
  readonly id: number;
  readonly name: string;
  readonly year: number;
  private tracks: Array<Track>;
  
  constructor(id: number, name: string, year: number) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];
  }

  addTrack(track: Track) {
    this.tracks.push(track);
  }

  deleteTrack(trackId: number) {
    this.tracks = this.tracks.filter( track => track.id !== trackId );
  }

  getTracks() {
    return this.tracks;
  }

}
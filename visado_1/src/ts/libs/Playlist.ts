import Track from "./Track";
import UNQfy from "./unqfy";

export default class Playlist{
  private tracks: Array<Track> = [];
  readonly genres: Array<string>;
  readonly id: number;
  readonly name: string;
  readonly unqfy: UNQfy;
  readonly maxDuration: number;

  constructor (id: number, name: string, genres: Array<string>, unqfy: UNQfy, maxDuration: number) {
    this.id = id;
    this.genres = genres;
    this.name = name;
    this.unqfy = unqfy;
    this.maxDuration = maxDuration;
    this.fillPlaylist();
  }
  
  private fillPlaylist() {
    this.tracks = [];
    let totalDuration: number = 0;

    for (let currentTrack of this.unqfy.getTracksMatchingGenres(this.genres)) {
      if (this.maxDuration < (totalDuration + currentTrack.duration)) 
        break;
      this.tracks.push(currentTrack);
    }
  }

  deleteTrack(id: number){
    this.tracks = this.tracks.filter( track => track.id !== id );
  }

  duration() {
    return this.tracks.reduce( (acum, track) => acum + track.duration, 0);
  }

  hasTrack(trackToFind: Track) {
    return this.tracks.some( track => track.id === trackToFind.id );
  }

}
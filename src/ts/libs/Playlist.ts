import Track from "./Track";
import UNQfy from "./unqfy";

export default class Playlist{
  private tracks: Array<Track> = [];
  readonly genres: Array<string>;
  readonly id: number;
  readonly name: string;
  readonly maxDuration: number;

  constructor (id: number, name: string, genres: Array<string>, maxDuration: number) {
    this.id = id;
    this.genres = genres;
    this.name = name;
    this.maxDuration = maxDuration;
  }
  
  fillPlaylist(unqfy: UNQfy) {
    this.tracks = [];
    let totalDuration: number = 0;

    // TODO: Considerar caso de tracks con duraciones que entran posteriores a tracks con duraciones mayores al máximo
    for (let currentTrack of unqfy.getTracksMatchingGenres(this.genres)) {
      if (this.maxDuration < (totalDuration + currentTrack.duration)) 
        break;
      this.tracks.push(currentTrack);
    }
  }

  deleteTrack(trackToDelete: Track){
    this.tracks = this.tracks.filter( track => track.id !== trackToDelete.id );
  }

  duration(): number {
    return this.tracks.reduce( (acum, track) => acum + track.duration, 0);
  }

  hasTrack(trackToFind: Track): boolean {
    return this.tracks.some( track => track.id === trackToFind.id );
  }

  getTracks(): Array<Track> {
    return this.tracks;
  }

  toJSON() {
    return {
      "id": this.id,
      "name": this.name,
      "duration": this.duration(),
      "tracks": this.tracks
    };
  }

}
import UNQfy from "./unqfy";
import Track from "./Track";

export default class Playlist{
  private tracks: Array<Track> = [];
  readonly genres: Array<string>;
  readonly id: number;
  readonly name: string;
  readonly unqfy: UNQfy;

  constructor (id: number, name: string, genres: Array<string>, unqfy: UNQfy) {
    this.id = id;
    this.genres = genres;
    this.name = name;
    this.unqfy = unqfy;
  }

  getTracks() {
    // unqfy.allTracks() filtrar por los generos de este playlist
    throw new Error("No implementado")
  }

  deleteTrack(id: number){
    this.tracks = this.tracks.filter( track => track.id !== id );
  }

}
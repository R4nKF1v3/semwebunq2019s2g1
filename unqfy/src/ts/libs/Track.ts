import Album from "./Album";
import MusixmatchClient from "./clients/MusixmatchClient";
import Artist from "./Artist";
import NoLyricsFoundForTrack from "./exceptions/NoLyricsFoundForTrack";

export default class Track{
  readonly id: number;
  readonly name: string;
  readonly duration: number;
  readonly genres: Array<string>;
  private lyrics: string;

  constructor(id: number, name: string, duration: number, genres: Array<string>, album: Album) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.genres = genres;
  }

  toJSON(){
    return {
      id: this.id,
      name: this.name,
      duration: this.duration,
      genres: this.genres
    }
  }

  containsGenre(genres: Array<string>): boolean{
    return genres.some(genre => this.genres.includes(genre));
  }

  hasSameGenres(genres: Array<string>): boolean{
    const res = this.genres.filter(genre => genres.includes(genre));
    return res.length === this.genres.length && res.length === genres.length;
  }

  getLyrics(artist: Artist): Promise<any> {
     const client = new MusixmatchClient;
      
     if (this.lyrics){
        const util = require("util");
        const ret = util.promisify(() => {return this.lyrics})
        return ret();
      }
     
    client.queryTrackId(this.name, artist.getName())
      .then((response) => {
        let trackId = response;
        return client.queryTrackLyrics(trackId);
      })
      .then((lyrics) => {
        if (lyrics){
          if (lyrics.lyrics_body.length === 0){
            throw new NoLyricsFoundForTrack(this.name);
          }
          this.lyrics = lyrics.lyrics_body;
          return {name: this.name, lyrics: this.lyrics};
        } else {
          throw new NoLyricsFoundForTrack(this.name);
        }
      })
    
  } 
}
      
import Album from "./Album";
import MusixmatchClient from "./clients/MusixmatchClient";
import { response } from "express";

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

  getLyrics(): string {
     const client = new MusixmatchClient;
      
     if (this.lyrics){
        return this.lyrics;
      }
     
    client.queryTrackName(this.name)
    .then((response) => {
      
      
      console.log(response);
      let trackId = response;
      return client.queryTrackLyrics(trackId);
    }).then((lyrics) => {
        this.lyrics = lyrics;
        return this.lyrics;
      });
    
  } 
}
      
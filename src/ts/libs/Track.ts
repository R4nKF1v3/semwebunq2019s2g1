import Album from "./Album";

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

  getLyrics(): string{
    if (this.lyrics){
      return this.lyrics;
    }
    //Buscar id del track en MusixMatch
      //Hacer el request del JSON con el id
        //Operar sobre la respuesta y guardar y devolver el "lyrics_body" del response.body.lyrics en this.lyrics
  }

}
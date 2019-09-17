import Album from "./Album";

export default class Track{
  readonly id: number;
  readonly name: string;
  readonly duration: number;
  readonly genres: Array<string>;

  constructor(id: number, name: string, duration: number, genres: Array<string>, album: Album) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.genres = genres;
  }

  containsGenre(genres: Array<string>): boolean{
    return genres.find(genre => this.genres.includes(genre)) != null;
  }

  hasSameGenres(genres: Array<string>): boolean{
    const res = this.genres.filter(genre => genres.includes(genre));
    return res.length === this.genres.length && res.length === genres.length;
  }

}
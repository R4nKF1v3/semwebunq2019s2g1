export default class Track{
  readonly id: number;
  readonly name: string;
  readonly duration: number;
  readonly genres: Array<string>;

  constructor(id: number, name: string, duration: number, genres: Array<string>) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.genres = genres;
  }

  hasGenre(genres: Array<string>): boolean{
    return genres.find(genre => this.genres.includes(genre)) != null;
  }
}
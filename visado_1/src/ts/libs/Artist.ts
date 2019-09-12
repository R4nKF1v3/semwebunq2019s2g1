import Album from "./Album";

export default class Artist {
  readonly id: number;
  readonly name : string;
  readonly country : string;
  private albums: Array<Album>;
  
  constructor(id: number, name: string, country: string){
    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];
  }

  addAlbum(album: Album) {
    this.albums.push(album);
  }

  getAlbums() {
    return this.albums;
  }

  deleteAlbum(albumId: number) {
    this.albums = this.albums.filter( album => album.id !== albumId );
  }
}
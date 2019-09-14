import Album from "./Album";
import Track from "./Track";

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

  addAlbum(albumData: any, unqfy): Album {
    if (this.albumDoesNotExist(albumData)){
      const newAlbum = new Album(unqfy.getNewAlbumId(), albumData.name, albumData.year);
      this.albums.push(newAlbum);
      console.log(`Added new album to the list for artist: ${this.name} with name: ${newAlbum.name} in year: ${newAlbum.year} with ID: ${newAlbum.id}`)
      return newAlbum;
    } else {
      throw new Error(`Album ${albumData.name} of ${this.name} in ${albumData.year} already exists!`);
    }
  }

  private albumDoesNotExist(albumData: any): boolean{
    return this.albums.find(album => album.name === albumData.name && album.year === albumData.year) == null
  }

  getAlbums() {
    return this.albums;
  }

  deleteAlbum(albumId: number, unqfy) {
    this.albums.find(album => album.id === albumId).getTracks().forEach(track =>
      unqfy.deleteTrackFromPlaylists(track.id)
    );
    this.albums = this.albums.filter( album => album.id !== albumId );
  }

  getAllTracks(): Array<Track>{
    var allTracks: Array<Track> = [];
    this.albums.forEach(album => allTracks = allTracks.concat(album.getTracks()))
    console.log("Todos los tracks de: " + this.name);
    console.log(JSON.stringify(allTracks));
    return allTracks;
  }
}
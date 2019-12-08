import SpotifyClient from "./clients/SpotifyClient";
import NotificationsClient from './clients/NotificationsClient';
import Album from "./Album";
import Track from "./Track";
import ElementAlreadyExistsError from "./exceptions/ElementAlreadyExistsError";
import User from "./User";
import UNQfy from "./unqfy"
import LoggingClient from './clients/LoggingClient';

export default class Artist {
  readonly id: number;
  private name : string;
  private country : string;
  private albums: Array<Album>;
  
  constructor(id: number, name: string, country: string){
    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];
  }

  addAlbum(albumData: any, unqfy: UNQfy): Album {
    try{
      if (this.albumDoesNotExist(albumData)){
        const newAlbum: Album = new Album(unqfy.getNewAlbumId(), albumData.name, albumData.year, this);
        this.albums.push(newAlbum);
        NotificationsClient.notifyNewAlbum(this, newAlbum);
        LoggingClient.notifyAddAlbum( "info", "agregado nuevo album" );
        return newAlbum;
      } else {
        throw new ElementAlreadyExistsError(`Album ${albumData.name} of ${this.name} in ${albumData.year}`);
      }
    }
    catch (error){
     
      throw error;
    }
  }

  private albumDoesNotExist(albumData: any): boolean{
    return !this.albums.some(album => album.name === albumData.name && album.year === albumData.year)
  }

  getName(): string{
    return this.name;
  }

  getCountry(): string{
    return this.country;
  }

  getAlbums(): Array<Album> {
    return this.albums;
  }

  getAlbumsNames(): Array<any>{
    let albums = [];
    for (let album of this.albums) {
      albums.push({name: album.name});
    };
    return albums;
  }

  deleteAlbum(albumToDelete: Album) {
    let tracksToDelete = albumToDelete.getTracks()
    tracksToDelete.forEach(track => albumToDelete.deleteTrack(track));
    this.albums = this.albums.filter( album => album.id !== albumToDelete.id );
    LoggingClient.notifyDeleteAlbum( "info", "agregado nuevo album" );
  }

  getAllTracks(): Array<Track>{
    var allTracks: Array<Track> = [];
    console.log("Get all tracks:")
    console.log(JSON.stringify(this.albums))
    console.log(typeof(this.albums[0]))
    this.albums.forEach(album => {
      console.log("Object album:")
      console.log(album)
      const tracks = album.getTracks();
      allTracks = allTracks.concat(tracks);
    })
    return allTracks;
  }

  getMostListened(users: Array<User>): Array<Track>{
    const tracks = this.getAllTracks();
    tracks.sort((a: Track, b: Track)=>this.compareListenersForTracks(a, b, users));
    return tracks.slice(0, 2);
  }

  compareListenersForTracks(track1: Track, track2: Track, users: Array<User>){
    let times1 = this.timesListenedFor(track1, users);
    let times2 = this.timesListenedFor(track2, users);
    if ( times1 < times2 ){
      return -1;
    } else if (times1 > times2){
      return 1;
    } else{
      return 0;
    }
  }

  timesListenedFor(track: Track, users: Array<User>): number{
    let times = 0;
    users.forEach(user => times += user.getTimesTrackListened(track))
    return times;
  }

  populateAlbums(unqfy: UNQfy): Promise<any>{
    const client = new SpotifyClient;
    let p : Promise<any> = Promise.resolve()
      .then(()=>{
        return client.queryArtistName(this.name)
      })
      .then((response) => {
        console.log(response.artists.items[0]);
        let artistId = response.artists.items[0].id;
        return client.queryArtistAlbums(artistId);
      }).then(res => {
        console.log(res);
        let albumList = res.items;
        albumList.forEach(albResponse => {
          console.log(albResponse)
          let albumData = {name: albResponse.name, year: albResponse.release_date.substring(0,3)}
          p = p.then((res)=>{
              return this.addAlbum(albumData, unqfy)
            })
            .catch((error)=>{
              console.log(error.message);
            })
        });
      })
      .then(_=>{
        return this.getAlbumsNames();
      })
    
    return p;

  }

  changeParameters(name: string, country: string){
    this.name = name;
    this.country = country;
  }

  hasTrack(track: Track): boolean{
    return this.albums.some(album => album.hasTrack(track))
  }

  toJSON(){
    let albumList = [];
    this.albums.forEach(album => albumList.push(album.toJSON()));
    return {
      id: this.id,
      name: this.name,
      albums: albumList,
      country: this.country,
    }
  }

}
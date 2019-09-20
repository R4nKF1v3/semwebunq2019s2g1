import picklify = require('picklify');
import fs = require('fs');
import Artist from "./Artist";
import Album from "./Album";
import Track from "./Track";
import Playlist from "./Playlist";
import User from "./User";
import InvalidCommandError from "./exceptions/InvalidCommandError";
import InsufficientParametersError from "./exceptions/InsufficientParametersError";
import ElementAreadyExistsError from "./exceptions/ElementAlreadyExistsError";
import ElementNotFoundError from './exceptions/ElementNotFoundError';
import HistoryEvent from './HistoryEvent';

export default class UNQfy {

  private idCounter: any = {
    artistId: 0,
    albumId: 0,
    trackId: 0,
    playlistId: 0,
    userId: 0
  };
  
  private artists: Array<Artist>;
  private playlists: Array<Playlist>;
  private users: Array<User>;

  constructor(){
    this.artists = [];
    this.playlists = [];
    this.users = [];
  }

  private allTracks(): Array<Track> {
    return this.allAlbums().reduce( (acum, album) => 
        acum.concat(album.getTracks()), []
    );
  }

  private allAlbums(): Array<Album> {
    return this.artists.reduce( (acum, artist) => 
        acum.concat(artist.getAlbums()), []
    );
  }

  getNewArtistId(): number {
    this.idCounter.artistId++;
    return this.idCounter.artistId;
  }

  getNewAlbumId(): number {
    this.idCounter.albumId++;
    return this.idCounter.albumId;
  }
  
  getNewTrackId(): number {
    this.idCounter.trackId++;
    return this.idCounter.trackId;
  }

  getNewPlaylistId(): number {
    this.idCounter.playlistId++;
    return this.idCounter.playlistId;
  }

  getNewUserId(): number {
    this.idCounter.userId++;
    return this.idCounter.userId;
  }

  //Switch que ejecuta los comandos dependiendo del término
  executeWith(command: string, args: Array<string>): any{
    switch (command) {
      case "createUser":
        this.checkParametersLength(args, 1, "createUser");
        return this.createUser(args[0])
      case "getUser":
        this.checkParametersLength(args, 1, "getUser");
        return this.getUserById(args[0])
      case "deleteUser":
        this.checkParametersLength(args, 1, "deleteUser");
        return this.deleteUser(args[0])
      case "userListenTo":
        this.checkParametersLength(args, 2, "userListenTo");
        return this.userListenTo(args[0], args[1])
      case "userTrackHistory":
        this.checkParametersLength(args, 1, "userTrackHistory");
        return this.getTracksListenedBy(args[0])
      case "userTimesListenedTo":
        this.checkParametersLength(args, 2, "userTimesListenedTo");
        return this.getTimesTrackListenedBy(args[0], args[1])
      case "getArtistMostListened":
        this.checkParametersLength(args, 1, "getArtistMostListened");
        return this.getArtistMostListenedTracks(args[0])
      case "addArtist":
        this.checkParametersLength(args, 2, "addArtist");
        return this.addArtist({name: args[0], country: args[1]});
      case "addAlbum":
        this.checkParametersLength(args, 3, "addAlbum");
        return this.addAlbum(parseInt(args[0]), {name: args[1], year: args[2]});
      case "addTrack":
        this.checkParametersLength(args, 4, "addTrack");
        return this.addTrack(parseInt(args[0]), {name: args[1], duration: args[2], genres: args.slice(3, args.length)});
      case "getArtist":
        this.checkParametersLength(args, 1, "getArtist");
        return this.getArtistById(args[0]);
      case "getAlbum":
        this.checkParametersLength(args, 1, "getAlbum");
        return this.getAlbumById(args[0]);
      case "getTrack":
        this.checkParametersLength(args, 1, "getTrack");
        return this.getTrackById(args[0]);
      case "getPlaylist":
        this.checkParametersLength(args, 1, "getPlaylist");
        return this.getPlaylistById(args[0]);
      case "deleteArtist":
        this.checkParametersLength(args, 1, "deleteArtist");
        return this.deleteArtist(args[0]);
      case "deleteAlbum":
        this.checkParametersLength(args, 1, "deleteAlbum");
        return this.deleteAlbum(args[0]);
      case "deleteTrack":
        this.checkParametersLength(args, 1, "deleteTrack");
        return this.deleteTrack(args[0]);
      case "deletePlaylist":
        this.checkParametersLength(args, 1, "deletePlaylist");
        return this.deletePlaylist(args[0]);
      case "getTracksFromArtist":
        this.checkParametersLength(args, 1, "getTracksFromArtist");
        return this.getTracksMatchingArtist(args[0]);
      case "getTracksMatchingGenres":
        this.checkParametersLength(args, 1, "getTracksMatchingGenres");
        return this.getTracksMatchingGenres(args.slice(0, args.length));
      case "searchByName":
        this.checkParametersLength(args, 1, "searchByName");
        return this.searchByName(args[0]);
      case "addPlaylist":
        this.checkParametersLength(args, 3, "addPlaylist");
        const params = {name: args[0], duration: parseInt(args[1]), genres: args.slice(2, args.length)};
        return this.createPlaylist(params.name, params.genres, params.duration);
      case "listPlaylist":
        this.checkParametersLength(args, 1, "listPlaylist");
        return this.listPlaylist(parseInt(args[0]))
      case "listArtist":
        this.checkParametersLength(args, 1, "listArtist");
        return this.listArtist(parseInt(args[0]))
      case "listAlbum":
        this.checkParametersLength(args, 1, "listAlbum");
        return this.listAlbum(parseInt(args[0]))
      case "listTrack":
        this.checkParametersLength(args, 1, "listTrack");
        return this.listTrack(parseInt(args[0]))
      default:
        throw new InvalidCommandError(command);
    }
  }

  private checkParametersLength(parameters: Array<string>, length: number, caseType: string){
    if (parameters.length < length){
      throw new InsufficientParametersError(caseType);
    }
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData: any): Artist {
    if (this.artistDoesNotExist(artistData)){
      const artist = new Artist(this.getNewArtistId(), artistData.name, artistData.country);
      this.artists.push(artist);
      return artist;
    } else {
      throw new ElementAreadyExistsError(`Artist ${artistData.name} from ${artistData.country}`)
    }
  }

  private artistDoesNotExist(artistData: any): boolean{
    return !this.artists.some(artist => artist.name === artistData.name && artist.country === artistData.country)
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId : number, albumData: any): Album {
    let artist = this.getArtistById(artistId);
    return artist.addAlbum(albumData, this);
  }

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId : number, trackData : any): Track {
    let album = this.getAlbumById(albumId);
    if (album.getTracks().some( track => trackData.name === track.name) ) 
      throw new ElementAreadyExistsError(`Track with name ${trackData.name} already exists in album ${album.name}`)
    return album.addTrack(trackData, this)
  }

  private genericSearch(elementId: any, elementsArray: Array<any>, description: string) {
    let searchInt = elementId
    parseInt(searchInt)
    let foundElement= elementsArray.find( element => element.id == searchInt);
    if (foundElement != null){
        return foundElement;
    } else {
      foundElement = elementsArray.filter( element => element.name == elementId)
      switch (foundElement.length){
        case 1:
          return foundElement[0]
        case 0:
          throw new ElementNotFoundError('Element with id ' + elementId.toString() + ' could not be found while searching for ' + description);
        default:
          throw new ElementNotFoundError('More than one match while searching a ' + description + ' for the id ' + elementId.toString());
      }
    }
  }

  getArtistById(id : any): Artist {
    return this.genericSearch(id, this.artists, "artist");
  }

  getAlbumById(id : any): Album {
    return this.genericSearch(id, this.allAlbums(), "album");
  }

  getTrackById(id : any): Track{
    return this.genericSearch(id, this.allTracks(), "track");
  }

  getPlaylistById(id : any): Playlist {
    return this.genericSearch(id, this.playlists, "playlist");
  }

  deleteArtist(artistId: any) {
    const artistToDelete = this.getArtistById(artistId);
    const artistAlbums = artistToDelete.getAlbums();
    artistAlbums.forEach( album => this.deleteAlbum(album.id) );
    this.artists = this.artists.filter( artist => artist.id !== artistToDelete.id);
    return {deleted: artistToDelete}
  }
  
  deleteAlbum(albumId: any) {
    const albumToDelete = this.getAlbumById(albumId);
    const albumTracks = albumToDelete.getTracks();
    albumTracks.forEach( track => this.deleteTrack(track.id) )
    this.artists.forEach( artist => artist.deleteAlbum(albumToDelete))
    return {deleted: albumToDelete}
  }

  deleteTrack(trackId: any) {
    const trackToDelete = this.getTrackById(trackId);
    this.allAlbums().forEach( album => album.deleteTrack(trackToDelete));
    this.deleteTrackFromPlaylists(trackToDelete);
    this.deleteTrackFromUsers(trackToDelete)
    return {deleted: trackToDelete}
  }

  deletePlaylist(playlistId: any){
    const playlistToDelete = this.getPlaylistById(playlistId);
    this.playlists = this.playlists.filter( playlist => playlist.id !== playlistToDelete.id);
    return {deleted: playlistToDelete}
  }

  deleteTrackFromPlaylists(track: Track){
    this.playlists.forEach(playlist =>
      playlist.deleteTrack(track)
    );
  }

  deleteTrackFromUsers(track: Track){
    this.users.forEach(user =>
      user.deleteTrack(track)
    );
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres : Array<string>): Array<Track> {
    return this.allTracks().filter(track => track.containsGenre(genres));
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName : string): Array<Track> {
    return this.getArtistById(artistName).getAllTracks();
  }

  searchByName(keyword: string){
    const keyw = keyword.toLowerCase();
    const artists = this.artists.filter(artist => artist.name.toLowerCase().includes(keyw));
    const albums = this.allAlbums().filter(album => album.name.toLowerCase().includes(keyw));
    const tracks = this.allTracks().filter(track => track.name.toLowerCase().includes(keyw));
    const playlists = this.playlists.filter(playlist => playlist.name.toLowerCase().includes(keyw));
    return {artists, albums, tracks, playlists};
  }

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name : string, genresToInclude : Array<string>, maxDuration : number) {
    const newPlaylist = new Playlist(this.getNewPlaylistId(), name, genresToInclude, maxDuration);
    newPlaylist.fillPlaylist(this);
    this.playlists.push(newPlaylist);
    console.log(this.playlists)
    return newPlaylist;
  }

  listPlaylist(searchParam: any) {
    let element: Playlist;
    element = this.getPlaylistById(searchParam);
    let songs = [];
    for (let track of element.getTracks()) {
      songs.push({name: track.name, duration: track.duration, genres: track.genres.reduce( (acum, g) => " " + g, "")});
    }
    return {
      playlistId: element.id,
      name: element.name,
      length: element.duration(),
      genres: element.genres.reduce( (acum: string, g: string) => acum + " " + g, ""),
      songs
    }
  }

  listArtist(searchParam: any) {
    let element: Artist;
    element = this.getArtistById(searchParam);
    let albums = [];
    for (let album of element.getAlbums()) {
      albums.push({name: album.name, year: album.year});
    }
    return {
      artistId: element.id,
      name: element.name,
      country: element.country,
      albums
    }
  }

  listAlbum(searchParam: any) {
    let element: Album;
    element = this.getAlbumById(searchParam);
    let tracks = [];
    for (let track of element.getTracks()) {
      tracks.push({name: track.name, duration: track.duration, genres: track.genres.reduce( (acum, g) => " " + g, "")});
    }
    return {
      albumId: element.id,
      name: element.name,
      year: element.year,
      tracks
    }
  }

  listTrack(searchParam: any) {
    let element: Track;
    element = this.getTrackById(searchParam);
    return {
      trackId: element.id,
      name: element.name,
      duration: element.duration,
      genres: element.genres.reduce( (acum: string, g: string) => acum + " " + g, "")
    }
  }

  createUser(name: string): User{
    if (this.userDoesNotExist(name)){
      const user = new User(this.getNewUserId(), name);
      this.users.push(user);
      return user;
    } else {
      throw new ElementAreadyExistsError(`User ${name}`)
    }
  }

  private userDoesNotExist(name: string): boolean{
    return !this.users.some(user => user.name === name)
  }

  deleteUser(userId: any){
    const userToDelete = this.getUserById(userId);
    this.users = this.users.filter( user => user.id !== userToDelete.id);
    return {deleted: userToDelete}
  }

  getUserById(id : any): User {
    return this.genericSearch(id, this.users, "user");
  }
  
  userListenTo(userId: string, trackId: string): HistoryEvent{
    let track: Track = this.getTrackById(trackId);
    let user = this.getUserById(userId);
    return user.listenTo(track);
  }

  getTracksListenedBy(userId: string): Array<Track>{
    const user = this.getUserById(userId);
    return user.getAllTracksListenedTo();
  }

  getTimesTrackListenedBy(userId: string, trackId: string): number{
    let track: Track = this.getTrackById(trackId);
    let user = this.getUserById(userId);
    return user.getTimesTrackListened(track);
  }

  getArtistMostListenedTracks(artistId: string): Array<Track>{
    const tracks = this.getArtistById(artistId).getAllTracks();
    tracks.sort((a: Track, b: Track)=>this.compareListenersForTracks(a, b));
    return tracks.slice(0, 2);
  }

  compareListenersForTracks(track1: Track, track2: Track){
    let times1 = this.timesListenedFor(track1);
    let times2 = this.timesListenedFor(track2)
    if ( times1 < times2 ){
      return -1;
    } else if (times1 > times2){
      return 1;
    } else{
      return 0;
    }
  }

  timesListenedFor(track: Track): number{
    let times = 0;
    this.users.forEach(user => times += user.getTimesTrackListened(track))
    return times;
  }

  save(filename : string) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename : string) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist, User, HistoryEvent];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = {
  UNQfy,
};

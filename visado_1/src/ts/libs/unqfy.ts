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
        return this.getUser(args[0])
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
        return this.getArtist(args[0]);
      case "getAlbum":
        this.checkParametersLength(args, 1, "getAlbum");
        return this.getAlbumById(parseInt(args[0]));
      case "d":
        this.checkParametersLength(args, 1, "getTrack");
        return this.getTrackById(parseInt(args[0]));
      case "getPlaylist":
        this.checkParametersLength(args, 1, "getPlaylist");
        return this.getPlaylistById(parseInt(args[0]));
      case "deleteArtist":
        this.checkParametersLength(args, 1, "deleteArtist");
        return this.deleteArtist(parseInt(args[0]));
      case "deleteAlbum":
        this.checkParametersLength(args, 1, "deleteAlbum");
        return this.deleteAlbum(parseInt(args[0]));
      case "deleteTrack":
        this.checkParametersLength(args, 1, "deleteTrack");
        return this.deleteTrack(parseInt(args[0]));
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
        this.listPlaylist(parseInt(args[0]))
        break;
      case "listArtist":
        this.checkParametersLength(args, 1, "listArtist");
        this.listArtist(parseInt(args[0]))
        break;
      case "listAlbum":
        this.checkParametersLength(args, 1, "listAlbum");
        this.listAlbum(parseInt(args[0]))
        break;
      case "listTrack":
        this.checkParametersLength(args, 1, "listTrack");
        this.listTrack(parseInt(args[0]))
        break;
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
    return this.artists.find(artist => artist.name === artistData.name && artist.country === artistData.country) == null
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

  private getArtist(arg: string): Artist{
    let foundedArtist = null;
    try {
      foundedArtist = this.getArtistById(parseInt(arg));
    } catch(e){
      if (e.constructor.name === 'ElementNotFoundError'){
        foundedArtist = this.getArtistByName(arg);
      } else {
        throw e;
      }
    }
    return foundedArtist;
  }

  private genericSearch(elementId: any, searchParam: string, elementsArray: Array<any>, description: string) {
    const foundedElements: any = elementsArray.filter( element => element[searchParam] === elementId);
    if (foundedElements.length === 1)
      return foundedElements[0];
    else if (foundedElements.length > 1)
      throw new ElementNotFoundError('More than one match while searching a ' + description + ' for the id ' + elementId);
    else 
      throw new ElementNotFoundError('Element with id ' + elementId + ' could not be found while searching for ' + description);
  }

  getArtistById(id : number): Artist {
    return this.genericSearch(id, "id", this.artists, "artist");
  }

  getArtistByName(name : string): Artist {
    return this.genericSearch(name, "name", this.artists, "artist");
  }

  getAlbumById(id : number): Album {
    return this.genericSearch(id, "id", this.allAlbums(), "album");
  }

  getAlbumByName(name : string): Album {
    return this.genericSearch(name, "name", this.allAlbums(), "album");
  }

  getTrackById(id : number): Track{
    return this.genericSearch(id, "id", this.allTracks(), "track");
  }

  getTrackByName(name : string): Track{
    return this.genericSearch(name, "name", this.allTracks(), "track");
  }

  getPlaylistById(id : number): Playlist {
    return this.genericSearch(id, "id", this.playlists, "playlist");
  }

  getPlaylistByName(name : string): Playlist {
    return this.genericSearch(name, "name", this.playlists, "playlist");
  }

  deleteArtist(artistId: number) {
    const artistToDelete = this.getArtistById(artistId);
    const artistAlbums = artistToDelete.getAlbums();
    artistAlbums.forEach( album => this.deleteAlbum(album.id) );
    this.artists = this.artists.filter( artist => artist.id !== artistId);
  }
  
  deleteAlbum(albumId: number) {
    const albumToDelete = this.getAlbumById(albumId);
    const albumTracks = albumToDelete.getTracks();
    albumTracks.forEach( track => this.deleteTrack(track.id) )

    this.artists.forEach( artist => artist.deleteAlbum(albumToDelete))
  }

  deleteTrack(trackId: number) {
    const trackToDelete = this.getTrackById(trackId);
    this.allAlbums().forEach( album => album.deleteTrack(trackToDelete));
    this.deleteTrackFromPlaylists(trackId);
  }

  deleteTrackFromPlaylists(trackId: number){
    this.playlists.forEach(playlist =>
      playlist.deleteTrack(trackId)
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
    return this.getArtist(artistName).getAllTracks();
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
    let element: Playlist = null;
    element = this.getPlaylistById(searchParam);

    console.log("Playlist (id: " + element.id + "):");
    console.log("---------");
    console.log("nombre: " + element.name);
    console.log("duración: " + element.duration() + " segundos");
    console.log("generos: " + element.genres.reduce( (acum: string, g: string) => acum + " " + g, "") );
    console.log("canciones: ");
    for (let track of element.getTracks()) {
      console.log(`  nombre: ${track.name}, duración: ${track.duration}, generos: ${track.genres.reduce( (acum, g) => " " + g, "")} `);
    }
  }

  listArtist(searchParam: number) {
    let element: Artist = null;
    element = this.getArtistById(searchParam);

    console.log("Artista (id: " + element.id + "):");
    console.log("---------");
    console.log("nombre: " + element.name);
    console.log("país: " + element.country);
    console.log("albums: ");
    for (let album of element.getAlbums()) {
      console.log(`  nombre: ${album.name}, año: ${album.year}`);
    }
  }

  listAlbum(searchParam: number) {
    let element: Album = null;
    element = this.getAlbumById(searchParam);

    console.log("Album (id: " + element.id + "):");
    console.log("---------");
    console.log("nombre: " + element.name);
    console.log("año: " + element.year);
    console.log("canciones: ");
    for (let track of element.getTracks()) {
      console.log(`  nombre: ${track.name}, duración: ${track.duration}, generos: ${track.genres.reduce( (acum, g) => " " + g, "")} `);
    }
  }

  listTrack(searchParam: number) {
    let element: Track = null;
    element = this.getTrackById(searchParam);

    console.log("Canción (id: " + element.id + "):");
    console.log("---------");
    console.log("nombre: " + element.name);
    console.log("duración: " + element.duration);
    console.log("canciones: ");
    console.log("generos: " + element.genres.reduce( (acum: string, g: string) => acum + " " + g, "") );
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
    return this.users.find(user => user.name === name) == null
  }

  getUser(arg: string): User{
    let foundUser = null;
    try {
      foundUser = this.getUserById(parseInt(arg));
    } catch(e){
      if (e.constructor.name === 'ElementNotFoundError'){
        foundUser = this.getUserByName(arg);
      } else {
        throw e;
      }
    }
    return foundUser;
  }

  getUserById(id : number): User {
    return this.genericSearch(id, "id", this.users, "user");
  }

  getUserByName(name : string): User {
    return this.genericSearch(name, "name", this.users, "user");
  }
  
  userListenTo(userId: string, trackId: string): HistoryEvent{
    var track: Track;
    try{
      track = this.getTrackById(parseInt(trackId));
    } catch(e){
      track = this.getTrackByName(trackId);
    }
    var user = this.getUser(userId);
    return user.listenTo(track);
  }

  getTracksListenedBy(userId: string): Array<Track>{
    const user = this.getUser(userId);
    return user.getAllTracksListenedTo();
  }

  getTimesTrackListenedBy(userId: string, trackId: string): number{
    var track: Track;
    try{
      track = this.getTrackById(parseInt(trackId));
    } catch(e){
      track = this.getTrackByName(trackId);
    }
    var user = this.getUser(userId);
    return user.getTimesTrackListened(track);
  }

  getArtistMostListenedTracks(artistId: string): Array<Track>{
    const tracks = this.getArtist(artistId).getAllTracks();
    tracks.sort((a: Track, b: Track)=>this.compareListenersForTracks(a, b));
    return tracks.slice(0, 2);
  }

  compareListenersForTracks(track1: Track, track2: Track){
    var times1 = this.timesListenedFor(track1);
    var times2 = this.timesListenedFor(track2)
    if ( times1 < times2 ){
      return -1;
    } else if (times1 > times2){
      return 1;
    } else{
      return 0;
    }
  }

  timesListenedFor(track: Track): number{
    var times = 0;
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

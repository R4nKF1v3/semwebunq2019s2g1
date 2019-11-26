import picklify = require('picklify');
import fs = require('fs');
import Artist from "./Artist";
import Album from "./Album";
import Track from "./Track";
import Playlist from "./Playlist";
import User from "./User";
import ElementAreadyExistsError from "./exceptions/ElementAlreadyExistsError";
import ElementNotFoundError from './exceptions/ElementNotFoundError';
import HistoryEvent from './HistoryEvent';
import LoggingClient from './clients/LoggingClient';

const loggingClient = new LoggingClient;
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

  public allTracks(): Array<Track> {
    return this.allAlbums().reduce( (acum, album) => 
        acum.concat(album.getTracks()), []
    );
  }

  public allAlbums(): Array<Album> {
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

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData: any): Artist {
    if (this.artistDoesNotExist(artistData)){
      const artist = new Artist(this.getNewArtistId(), artistData.name, artistData.country);
      this.artists.push(artist);
      loggingClient.notifyAddArtist(artist);
      return artist;
    } else {
      throw new ElementAreadyExistsError(`Artist ${artistData.name} from ${artistData.country}`)
    }
  }

  private artistDoesNotExist(artistData: any): boolean{
    return !this.artists.some(artist => artist.getName() === artistData.name && artist.getCountry() === artistData.country)
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

  //getPlaylists(id : any): Playlist {
  //  return this.genericSearch(id, this.playlists, "playlist");
  //}
  getPlaylists(): Array<Playlist> {
    return this.playlists;
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
    const artists = this.artists.filter(artist => artist.getName().toLowerCase().includes(keyw));
    const albums = this.allAlbums().filter(album => album.name.toLowerCase().includes(keyw));
    const tracks = this.allTracks().filter(track => track.name.toLowerCase().includes(keyw));
    const playlists = this.playlists.filter(playlist => playlist.name.toLowerCase().includes(keyw));
    return {artists, albums, tracks, playlists};
  }
  
  searchArtistsByName(keyword: string){
    const keyw = keyword.toLowerCase();
    const artists = this.artists.filter(artist => artist.getName().toLowerCase().includes(keyw));
    let artistList = [];
    artists.forEach(artist => artistList.push(artist.toJSON()))
    return artistList;
  }
  
  searchAlbumsByName(keyword: string){
    const keyw = keyword.toLowerCase();
    const albums = this.allAlbums().filter(album => album.name.toLowerCase().includes(keyw));
    let albumList = [];
    albums.forEach(album => albumList.push(album.toJSON()))
    return albumList;
  }

  searchTracksByName(keyword: string){
    const keyw = keyword.toLowerCase();
    const tracks = this.allTracks().filter(track => track.name.toLowerCase().includes(keyw));
    let trackList = [];
    tracks.forEach(track => trackList.push(track.toJSON()))
    return trackList;
  }

  getAllArtists(){
    let res = [];
    this.artists.forEach(artist => res.push(artist.toJSON()));
    return res;
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

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylistWithGivenTracks(name : string, tracks : Array<Track>) {
    const genres = tracks.reduce((acum, track) => acum.concat(track.genres), []);
    const duration = tracks.reduce( (acum, track) => acum + track.duration, 0);
    const newPlaylist = new Playlist(this.getNewPlaylistId(), name, genres, duration);
    tracks.forEach( t => newPlaylist.getTracks().push(t) );
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
      name: element.getName(),
      country: element.getCountry(),
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
    const artist = this.getArtistById(artistId);
    return artist.getMostListened(this.users);
  }

  //Correspondientes a Visado 2
  getAlbumsForArtist(artistName: string){
    const artist = this.getArtistById(artistName);
    return artist.getAlbumsNames();
  }

  populateAlbumsForArtist(artistName: string): Promise<any>{
    const artist = this.getArtistById(artistName);
    return artist.populateAlbums(this);
  }

  getLyricsFor(trackId: number): Promise<any>{
    const track = this.getTrackById(trackId);
    const artist = this.getArtistForTrack(track);
    return track.getLyrics(artist);
  }

  getArtistForTrack(track: Track): Artist{
    return this.artists.find(artist => artist.hasTrack(track))
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

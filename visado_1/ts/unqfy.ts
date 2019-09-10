
import picklify = require('picklify'); // para cargar/guarfar unqfy
import fs = require('fs'); // para cargar/guarfar unqfy


class UNQfy {

  //TODO: Preguntar kiesesto
  private listeners = [];

  private idCounter: any = {
    artistId: 0,
    albumId: 0,
    trackId: 0,
  };

  // AE: lo comente porque según el diagrama UML los tracks están dentro de los albums y los albums están dentro de los artistas
  //     los voy a reemplazar por metodos.
  //private tracks: Array<Track>;
  //private albums: Array<Album>;

  private allTracks(): Array<Track> {
    return this.allAlbums().reduce( (acum, album) => 
        acum.concat(album.tracks), []
    );
  }

  private allAlbums(): Array<Album> {
    return this.artists.reduce( (acum, artist) => 
        acum.concat(artist.albums), []
    );
  }

  private artists: Array<Artist>;
  private playlists: Array<Playlist>;
  private users: Array<User>;

  constructor(){
    this.listeners = [];
    this.artists = [];
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

  //Switch que ejecuta los comandos dependiendo del término
  executeWith(command: string, args: Array<string>): any{
    console.log("Comando " + command + " con argumentos: " + args)
    switch (command) {
      case "addArtist":
        return this.addArtist({name: args[0], country: args[1]})
      case "getArtist":
        return this.getArtistById(parseInt(args[0]))
      case "addAlbum":
        return this.addAlbum(parseInt(args[0]), {name: args[1], year: args[2]});
      case "addTrack":
        const GENRES_ARRAY = JSON.parse(args[3]);
        return this.addTrack(parseInt(args[0]), {name: args[1], duration: args[2], genres: GENRES_ARRAY});
      case "deleteArtist":
        return this.deleteArtist(parseInt(args[0]));
      case "deleteAlbum":
        return this.deleteAlbum(parseInt(args[0]));
      case "deleteTrack":
        return this.deleteTrack(parseInt(args[0]));
      default:
        throw new Error(`El comando '${command}' no es un comando válido`);
    }
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData: any) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    const artist = new Artist(this.getNewArtistId(), artistData.name, artistData.country);
    this.artists.push(artist);
    console.log("Added new artist to the list: " + artist.name + " from: " + artist.country + " with ID: " + artist.id)
  }

  deleteArtist(artistId: number) {
    this.artists = this.artists.filter( artist => artist.id !== artistId);
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId : number, albumData: any) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    let artist = this.getArtistById(artistId);

    if (artist == null)
      throw new Error(`No se pudo encontrar el artista con id ${artistId}`);

    const newAlbum = new Album(this.getNewAlbumId(), albumData.name, albumData.year);
    artist.addAlbum(newAlbum);
    return newAlbum;
  }

  deleteAlbum(albumId: number) {
    this.artists.forEach( artist => 
      artist.albums = artist.albums.filter( album => album.id !== albumId )
    )
  }

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId : number, trackData : any) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    let album = this.getAlbumById(albumId);

    if (album == null)
      throw new Error(`No se pudo encontrar el album con id ${albumId}`);

    const newTrack = new Track(this.getNewTrackId(), trackData.name, trackData.duration, trackData.genres);
    album.addTrack(newTrack);
    return newTrack;
  }

  deleteTrack(trackId: number) {
    this.allAlbums().forEach( album =>
      album.tracks = album.tracks.filter( track => track.id !== trackId )
    );
  }

  private genericSearch(elementId: number, elementsArray: Array<any>) {
    const foundElement: any = elementsArray.find( element => element.id === elementId);
    if (foundElement != null){
      console.log(JSON.stringify(foundElement));
      return foundElement;
    }else {
      throw new Error('Element not found')
    }
  }

  getArtistById(id : number): Artist {
    const res: Artist = this.genericSearch(id, this.artists);
    console.log("Nombre del artista: " + res.name + " Nacionalidad: " + res.country + " Albums: " + res.albums)
    return res;
  }

  getAlbumById(id : number): Album {
    return this.genericSearch(id, this.allAlbums());
  }

  getTrackById(id : number): Track{
    return this.genericSearch(id, this.allTracks());
  }

  getPlaylistById(id : number): Playlist {
    throw new Error("Not yet implemented");
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres : Array<string>) {
    throw new Error("Not yet implemented");
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName : string) {
    throw new Error("Not yet implemented");
  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name : string, genresToInclude : Array<string>, maxDuration : number) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename : string) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename : string) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist, User];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

class Artist{
  readonly id: number;
  readonly name : string;
  readonly country : string;
  albums: Array<Album>;
  
  constructor(id: number, name: string, country: string){
    this.id = id;
    this.name = name;
    this.country = country;
    this.albums = [];
  }

  addAlbum(album: Album) {
    this.albums.push(album);
  }

}

class Album{
  readonly id: number;
  readonly name: string;
  readonly year: number;
  tracks: Array<Track>;
  
  constructor(id: number, name: string, year: number) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];
  }

  addTrack(track: Track) {
    this.tracks.push(track);
  }

}

class Track{
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

}

class Playlist{

}

class User{

}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
export {
  UNQfy,
};



import picklify = require('picklify'); // para cargar/guarfar unqfy
import fs = require('fs'); // para cargar/guarfar unqfy


class UNQfy {

  //TODO: Preguntar kiesesto
  private listeners = [];

  private idCounter: number;

  private tracks: Array<Track>;
  private albums: Array<Album>;
  private artists: Array<Artist>;
  private playlists: Array<Playlist>;
  private users: Array<User>;

  constructor(){
    this.listeners = [];
    this.artists = [];
  }

  //Switch que ejecuta los comandos dependiendo del término
  executeWith(command: string, args: Array<string>){
    switch (command) {
      case "addArtist":
        this.addArtist({name: args[0], country: args[1]})
      case "getArtist":
        this.getArtistById(parseInt(args[0]))
    }
  }

  getNewId(): number{
    const ret = this.idCounter;
    this.idCounter++;
    return ret;
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    this.artists.push(new Artist(this.getNewId(), artistData.name, artistData.country))
  }


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId : number, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
  }


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId : number, trackData : object) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
  }

  getArtistById(id : number) {
    return this.artists.find((artist, index) => artist.id === id)
  }

  getAlbumById(id : number) {

  }

  getTrackById(id : number) {

  }

  getPlaylistById(id : number) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres : Array<string>) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName : string) {

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
  constructor(id: number, name: string, country: string){
    this.id = id;
    this.name = name;
    this.country = country;
  }
}

class Album{

}

class Track{

}

class Playlist{

}

class User{

}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
export {
  UNQfy,
};


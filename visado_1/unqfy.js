"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picklify = require("picklify"); // para cargar/guarfar unqfy
const fs = require("fs"); // para cargar/guarfar unqfy
class UNQfy {
    constructor() {
        //TODO: Preguntar kiesesto
        this.listeners = [];
        this.idCounter = {
            artistId: 0,
            albumId: 0,
            trackId: 0,
        };
        this.listeners = [];
        this.artists = [];
    }
    // AE: lo comente porque según el diagrama UML los tracks están dentro de los albums y los albums están dentro de los artistas
    //     los voy a reemplazar por metodos.
    //private tracks: Array<Track>;
    //private albums: Array<Album>;
    allTracks() {
        return this.allAlbums().reduce((acum, album) => acum.concat(album.tracks), []);
    }
    allAlbums() {
        return this.artists.reduce((acum, artist) => acum.concat(artist.albums), []);
    }
    getNewArtistId() {
        this.idCounter.artistId++;
        return this.idCounter.artistId;
    }
    getNewAlbumId() {
        this.idCounter.albumId++;
        return this.idCounter.albumId;
    }
    getNewTrackId() {
        this.idCounter.trackId++;
        return this.idCounter.trackId;
    }
    //Switch que ejecuta los comandos dependiendo del término
    executeWith(command, args) {
        switch (command) {
            case "addArtist":
                return this.addArtist({ name: args[0], country: args[1] });
            case "getArtist":
                return this.getArtistById(parseInt(args[0]));
            case "addAlbum":
                return this.addAlbum(parseInt(args[0]), { name: args[1], year: args[2] });
            case "addTrack":
                const GENRES_ARRAY = JSON.parse(args[3]);
                return this.addTrack(parseInt(args[0]), { name: args[1], duration: args[2], genres: GENRES_ARRAY });
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
    addArtist(artistData) {
        /* Crea un artista y lo agrega a unqfy.
        El objeto artista creado debe soportar (al menos):
          - una propiedad name (string)
          - una propiedad country (string)
        */
        this.artists.push(new Artist(this.getNewArtistId(), artistData.name, artistData.country));
    }
    deleteArtist(artistId) {
        this.artists = this.artists.filter(artist => artist.id !== artistId);
    }
    // albumData: objeto JS con los datos necesarios para crear un album
    //   albumData.name (string)
    //   albumData.year (number)
    // retorna: el nuevo album creado
    addAlbum(artistId, albumData) {
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
    deleteAlbum(albumId) {
        this.artists.forEach(artist => artist.albums = artist.albums.filter(album => album.id !== albumId));
    }
    // trackData: objeto JS con los datos necesarios para crear un track
    //   trackData.name (string)
    //   trackData.duration (number)
    //   trackData.genres (lista de strings)
    // retorna: el nuevo track creado
    addTrack(albumId, trackData) {
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
    deleteTrack(trackId) {
        this.allAlbums().forEach(album => album.tracks = album.tracks.filter(track => track.id !== trackId));
    }
    genericSearch(elementId, elementsArray) {
        const foundedElement = elementsArray.find(element => element.id === elementId);
        if (foundedElement != null)
            console.log(JSON.stringify(foundedElement));
        return foundedElement;
    }
    getArtistById(id) {
        return this.genericSearch(id, this.artists);
    }
    getAlbumById(id) {
        return this.genericSearch(id, this.allAlbums());
    }
    getTrackById(id) {
        return this.genericSearch(id, this.allTracks());
    }
    getPlaylistById(id) {
        throw new Error("Not yet implemented");
    }
    // genres: array de generos(strings)
    // retorna: los tracks que contenga alguno de los generos en el parametro genres
    getTracksMatchingGenres(genres) {
        throw new Error("Not yet implemented");
    }
    // artistName: nombre de artista(string)
    // retorna: los tracks interpredatos por el artista con nombre artistName
    getTracksMatchingArtist(artistName) {
        throw new Error("Not yet implemented");
    }
    // name: nombre de la playlist
    // genresToInclude: array de generos
    // maxDuration: duración en segundos
    // retorna: la nueva playlist creada
    createPlaylist(name, genresToInclude, maxDuration) {
        /*** Crea una playlist y la agrega a unqfy. ***
          El objeto playlist creado debe soportar (al menos):
            * una propiedad name (string)
            * un metodo duration() que retorne la duración de la playlist.
            * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
        */
    }
    save(filename) {
        const listenersBkp = this.listeners;
        this.listeners = [];
        const serializedData = picklify.picklify(this);
        this.listeners = listenersBkp;
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
        const classes = [UNQfy, Artist, Album, Track, Playlist, User];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
}
exports.UNQfy = UNQfy;
class Artist {
    constructor(id, name, country) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.albums = [];
    }
    addAlbum(album) {
        this.albums.push(album);
    }
}
class Album {
    constructor(id, name, year) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = [];
    }
    addTrack(track) {
        this.tracks.push(track);
    }
}
class Track {
    constructor(id, name, duration, genres) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.genres = genres;
    }
}
class Playlist {
}
class User {
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picklify = require("picklify");
const fs = require("fs");
const Artist_1 = require("./Artist");
const Album_1 = require("./Album");
const Track_1 = require("./Track");
const Playlist_1 = require("./Playlist");
const User_1 = require("./User");
class UNQfy {
    constructor() {
        this.idCounter = {
            artistId: 0,
            albumId: 0,
            trackId: 0,
        };
        this.artists = [];
    }
    allTracks() {
        return this.allAlbums().reduce((acum, album) => acum.concat(album.getTracks()), []);
    }
    allAlbums() {
        return this.artists.reduce((acum, artist) => acum.concat(artist.getAlbums()), []);
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
        console.log("Comando " + command + " con argumentos: " + args);
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
        const artist = new Artist_1.default(this.getNewArtistId(), artistData.name, artistData.country);
        this.artists.push(artist);
        console.log("Added new artist to the list: " + artist.name + " from: " + artist.country + " with ID: " + artist.id);
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
        const newAlbum = new Album_1.default(this.getNewAlbumId(), albumData.name, albumData.year);
        artist.addAlbum(newAlbum);
        return newAlbum;
    }
    deleteAlbum(albumId) {
        this.artists.forEach(artist => artist.deleteAlbum(albumId));
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
        const newTrack = new Track_1.default(this.getNewTrackId(), trackData.name, trackData.duration, trackData.genres);
        album.addTrack(newTrack);
        return newTrack;
    }
    deleteTrack(trackId) {
        this.allAlbums().forEach(album => album.deleteTrack(trackId));
    }
    genericSearch(elementId, elementsArray) {
        const foundElement = elementsArray.find(element => element.id === elementId);
        if (foundElement != null) {
            console.log(JSON.stringify(foundElement));
            return foundElement;
        }
        else {
            throw new Error('Element not found');
        }
    }
    getArtistById(id) {
        const res = this.genericSearch(id, this.artists);
        console.log("Nombre del artista: " + res.name + " Nacionalidad: " + res.country + " Albums: " + res.getAlbums());
        return res;
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
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
        const classes = [UNQfy, Artist_1.default, Album_1.default, Track_1.default, Playlist_1.default, User_1.default];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
}
exports.default = UNQfy;

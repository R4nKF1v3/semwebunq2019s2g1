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
        this.playlists = [];
        this.users = [];
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
                this.checkParametersLength(args, 2, "addArtist");
                return this.addArtist({ name: args[0], country: args[1] });
            case "getArtist":
                this.checkParametersLength(args, 1, "getArtist");
                return this.getArtist(args[0]);
            case "addAlbum":
                this.checkParametersLength(args, 3, "addAlbum");
                return this.addAlbum(parseInt(args[0]), { name: args[1], year: args[2] });
            case "getAlbum":
                this.checkParametersLength(args, 1, "getAlbum");
                return this.getAlbumById(parseInt(args[0]));
            case "addTrack":
                this.checkParametersLength(args, 4, "addTrack");
                const GENRES_ARRAY = JSON.parse(args[3]);
                return this.addTrack(parseInt(args[0]), { name: args[1], duration: args[2], genres: GENRES_ARRAY });
            case "getTrack":
                this.checkParametersLength(args, 1, "getTrack");
                return this.getTrackById(parseInt(args[0]));
            case "deleteArtist":
                this.checkParametersLength(args, 1, "deleteArtist");
                return this.deleteArtist(parseInt(args[0]));
            case "deleteAlbum":
                this.checkParametersLength(args, 1, "deleteAlbum");
                return this.deleteAlbum(parseInt(args[0]));
            case "deleteTrack":
                this.checkParametersLength(args, 1, "deleteTrack");
                return this.deleteTrack(parseInt(args[0]));
            default:
                throw new Error(`El comando '${command}' no es un comando válido`);
        }
    }
    checkParametersLength(parameters, length, caseType) {
        if (parameters.length != length) {
            throw new Error("Insufficient parameters for command " + caseType);
        }
    }
    // artistData: objeto JS con los datos necesarios para crear un artista
    //   artistData.name (string)
    //   artistData.country (string)
    // retorna: el nuevo artista creado
    addArtist(artistData) {
        if (this.artistDoesNotExist(artistData)) {
            const artist = new Artist_1.default(this.getNewArtistId(), artistData.name, artistData.country);
            this.artists.push(artist);
            console.log("Added new artist to the list: " + artist.name + " from: " + artist.country + " with ID: " + artist.id);
        }
        else {
            throw new Error(`Artist ${artistData.name} from ${artistData.country} already exists!`);
        }
    }
    artistDoesNotExist(artistData) {
        return this.artists.find(artist => artist.name === artistData.name && artist.country === artistData.country) == null;
    }
    // albumData: objeto JS con los datos necesarios para crear un album
    //   albumData.name (string)
    //   albumData.year (number)
    // retorna: el nuevo album creado
    addAlbum(artistId, albumData) {
        let artist = this.getArtistById(artistId);
        if (artist == null)
            throw new Error(`Artist with id ${artistId} doesn't exist`);
        artist.addAlbum(albumData, this);
    }
    // trackData: objeto JS con los datos necesarios para crear un track
    //   trackData.name (string)
    //   trackData.duration (number)
    //   trackData.genres (lista de strings)
    // retorna: el nuevo track creado
    addTrack(albumId, trackData) {
        let album = this.getAlbumById(albumId);
        if (album == null)
            throw new Error(`Album with id ${albumId} doesn't exist`);
        album.addTrack(trackData, this);
    }
    getArtist(arg) {
        try {
            return this.getArtistById(parseInt(arg));
        }
        catch (e) {
            return this.getArtistByName(arg);
        }
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
        return this.genericSearch(id, this.artists);
    }
    getArtistByName(name) {
        const foundElement = this.artists.filter(element => element.name === name);
        if (foundElement.length === 1) {
            console.log(JSON.stringify(foundElement));
            return foundElement[0];
        }
        else if (foundElement.length === 0) {
            throw new Error('Artist not found');
        }
        else {
            throw new Error('More than one match for the Artist');
        }
    }
    getAlbumById(id) {
        return this.genericSearch(id, this.allAlbums());
    }
    getTrackById(id) {
        return this.genericSearch(id, this.allTracks());
    }
    getPlaylistById(id) {
        return this.genericSearch(id, this.playlists);
    }
    deleteArtist(artistId) {
        const artistToDelete = this.artists.find(artist => artist.id !== artistId);
        artistToDelete.getAlbums().forEach(album => artistToDelete.deleteAlbum(album.id, this));
        this.artists = this.artists.filter(artist => artist.id !== artistId);
    }
    deleteAlbum(albumId) {
        this.artists.forEach(artist => artist.deleteAlbum(albumId, this));
    }
    deleteTrack(trackId) {
        this.allAlbums().forEach(album => album.deleteTrack(trackId));
        this.deleteTrackFromPlaylists(trackId);
    }
    deleteTrackFromPlaylists(id) {
        this.playlists.forEach(playlist => playlist.deleteTrack(id));
    }
    // genres: array de generos(strings)
    // retorna: los tracks que contenga alguno de los generos en el parametro genres
    getTracksMatchingGenres(genres) {
        throw new Error("Not yet implemented");
    }
    // artistName: nombre de artista(string)
    // retorna: los tracks interpredatos por el artista con nombre artistName
    getTracksMatchingArtist(artistName) {
        return this.getArtist(artistName).getAllTracks();
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picklify = require("picklify");
const fs = require("fs");
const Artist_1 = require("./Artist");
const Album_1 = require("./Album");
const Track_1 = require("./Track");
const Playlist_1 = require("./Playlist");
const User_1 = require("./User");
const InvalidCommandError_1 = require("./exceptions/InvalidCommandError");
const InsufficientParametersError_1 = require("./exceptions/InsufficientParametersError");
const ElementAlreadyExistsError_1 = require("./exceptions/ElementAlreadyExistsError");
const ElementNotFoundError_1 = require("./exceptions/ElementNotFoundError");
class UNQfy {
    constructor() {
        this.idCounter = {
            artistId: 0,
            albumId: 0,
            trackId: 0,
            playlistId: 0,
            userId: 0
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
    getNewPlaylistId() {
        this.idCounter.playlistId++;
        return this.idCounter.playlistId;
    }
    getNewUserId() {
        this.idCounter.userId++;
        return this.idCounter.userId;
    }
    //Switch que ejecuta los comandos dependiendo del término
    executeWith(command, args) {
        switch (command) {
            case "createUser":
                this.checkParametersLength(args, 1, "createUser");
                return this.createUser(args[0]);
            case "getUser":
                this.checkParametersLength(args, 1, "getUser");
                return this.getUser(args[0]);
            case "userListenTo":
                this.checkParametersLength(args, 2, "userListenTo");
                return this.userListenTo(args[0], args[1]);
            case "userTrackHistory":
                this.checkParametersLength(args, 1, "userTrackHistory");
                return this.getTracksListenedBy(args[0]);
            case "userTimesListenedTo":
                this.checkParametersLength(args, 2, "userTimesListenedTo");
                return this.getTimesTrackListenedBy(args[0], args[1]);
            case "getArtistMostListened":
                this.checkParametersLength(args, 1, "getArtistMostListened");
                return this.getArtistMostListenedTracks(args[0]);
            case "addArtist":
                this.checkParametersLength(args, 2, "addArtist");
                return this.addArtist({ name: args[0], country: args[1] });
            case "addAlbum":
                this.checkParametersLength(args, 3, "addAlbum");
                return this.addAlbum(parseInt(args[0]), { name: args[1], year: args[2] });
            case "addTrack":
                this.checkParametersLength(args, 4, "addTrack");
                return this.addTrack(parseInt(args[0]), { name: args[1], duration: args[2], genres: args.slice(3, args.length) });
            case "getArtist":
                this.checkParametersLength(args, 1, "getArtist");
                return this.getArtist(args[0]);
            case "getAlbum":
                this.checkParametersLength(args, 1, "getAlbum");
                return this.getAlbumById(parseInt(args[0]));
            case "getTrack":
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
                const params = { name: args[0], duration: parseInt(args[1]), genres: args.slice(2, args.length) };
                return this.createPlaylist(params.name, params.genres, params.duration);
            case "listPlaylist":
                this.checkParametersLength(args, 1, "listPlaylist");
                this.listPlaylist(parseInt(args[0]));
            case "listArtist":
                this.checkParametersLength(args, 1, "listArtist");
                this.listArtist(parseInt(args[0]));
            case "listAlbum":
                this.checkParametersLength(args, 1, "listAlbum");
                this.listAlbum(parseInt(args[0]));
            case "listTrack":
                this.checkParametersLength(args, 1, "listTrack");
                this.listTrack(parseInt(args[0]));
            default:
                throw new InvalidCommandError_1.default(command);
        }
    }
    checkParametersLength(parameters, length, caseType) {
        if (parameters.length < length) {
            throw new InsufficientParametersError_1.default(caseType);
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
            return artist;
        }
        else {
            throw new ElementAlreadyExistsError_1.default(`Artist ${artistData.name} from ${artistData.country}`);
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
        return artist.addAlbum(albumData, this);
    }
    // trackData: objeto JS con los datos necesarios para crear un track
    //   trackData.name (string)
    //   trackData.duration (number)
    //   trackData.genres (lista de strings)
    // retorna: el nuevo track creado
    addTrack(albumId, trackData) {
        let album = this.getAlbumById(albumId);
        if (album.getTracks().some(track => trackData.name === track.name))
            throw new ElementAlreadyExistsError_1.default(`Track with name ${trackData.name} already exists in album ${album.name}`);
        return album.addTrack(trackData, this);
    }
    getArtist(arg) {
        let foundedArtist = null;
        try {
            foundedArtist = this.getArtistById(parseInt(arg));
        }
        catch (e) {
            if (e.constructor.name === 'ElementNotFoundError') {
                foundedArtist = this.getArtistByName(arg);
            }
            else {
                throw e;
            }
        }
        //foundedArtist.albums = foundedArtist.albums.map( (album: Artist) => album.name );
        return foundedArtist;
    }
    genericSearch(elementId, searchParam, elementsArray, description) {
        const foundedElements = elementsArray.filter(element => element[searchParam] === elementId);
        if (foundedElements.length === 1)
            return foundedElements[0];
        else if (foundedElements.length > 1)
            throw new ElementNotFoundError_1.default('More than one match while searching a ' + description + ' for the id ' + elementId);
        else
            throw new ElementNotFoundError_1.default('Element with id ' + elementId + ' could not be found while searching for ' + description);
    }
    getArtistById(id) {
        return this.genericSearch(id, "id", this.artists, "artist");
    }
    getArtistByName(name) {
        return this.genericSearch(name, "name", this.artists, "artist");
    }
    getAlbumById(id) {
        return this.genericSearch(id, "id", this.allAlbums(), "album");
    }
    getAlbumByName(name) {
        return this.genericSearch(name, "name", this.allAlbums(), "album");
    }
    getTrackById(id) {
        return this.genericSearch(id, "id", this.allTracks(), "track");
    }
    getTrackByName(name) {
        return this.genericSearch(name, "name", this.allTracks(), "track");
    }
    getPlaylistById(id) {
        return this.genericSearch(id, "id", this.playlists, "playlist");
    }
    getPlaylistByName(name) {
        return this.genericSearch(name, "name", this.playlists, "playlist");
    }
    deleteArtist(artistId) {
        const artistToDelete = this.getArtistById(artistId);
        const artistAlbums = artistToDelete.getAlbums();
        artistAlbums.forEach(album => this.deleteAlbum(album.id));
        this.artists = this.artists.filter(artist => artist.id !== artistId);
    }
    deleteAlbum(albumId) {
        const albumToDelete = this.getAlbumById(albumId);
        const albumTracks = albumToDelete.getTracks();
        albumTracks.forEach(track => this.deleteTrack(track.id));
        this.artists.forEach(artist => artist.deleteAlbum(albumToDelete));
    }
    deleteTrack(trackId) {
        const trackToDelete = this.getTrackById(trackId);
        this.allAlbums().forEach(album => album.deleteTrack(trackToDelete));
        this.deleteTrackFromPlaylists(trackId);
    }
    deleteTrackFromPlaylists(trackId) {
        this.playlists.forEach(playlist => playlist.deleteTrack(trackId));
    }
    // genres: array de generos(strings)
    // retorna: los tracks que contenga alguno de los generos en el parametro genres
    getTracksMatchingGenres(genres) {
        return this.allTracks().filter(track => track.containsGenre(genres));
    }
    // artistName: nombre de artista(string)
    // retorna: los tracks interpredatos por el artista con nombre artistName
    getTracksMatchingArtist(artistName) {
        return this.getArtist(artistName).getAllTracks();
    }
    searchByName(keyword) {
        const keyw = keyword.toLowerCase();
        const artists = this.artists.filter(artist => artist.name.toLowerCase().includes(keyw));
        const albums = this.allAlbums().filter(album => album.name.toLowerCase().includes(keyw));
        const tracks = this.allTracks().filter(track => track.name.toLowerCase().includes(keyw));
        const playlists = this.playlists.filter(playlist => playlist.name.toLowerCase().includes(keyw));
        return { artists, albums, tracks, playlists };
    }
    // name: nombre de la playlist
    // genresToInclude: array de generos
    // maxDuration: duración en segundos
    // retorna: la nueva playlist creada
    createPlaylist(name, genresToInclude, maxDuration) {
        const newPlaylist = new Playlist_1.default(this.getNewPlaylistId(), name, genresToInclude, maxDuration);
        newPlaylist.fillPlaylist(this);
        this.playlists.push(newPlaylist);
        console.log(this.playlists);
        return newPlaylist;
    }
    listPlaylist(searchParam) {
        let element = null;
        element = this.getPlaylistById(searchParam);
        console.log("Playlist (id: " + element.id + "):");
        console.log("---------");
        console.log("nombre: " + element.name);
        console.log("duración: " + element.duration() + " segundos");
        console.log("generos: " + element.genres.reduce((acum, g) => acum + " " + g, ""));
        console.log("canciones: ");
        for (let track of element.getTracks()) {
            console.log(`  nombre: ${track.name}, duración: ${track.duration}, generos: ${track.genres.reduce((acum, g) => " " + g, "")} `);
        }
    }
    listArtist(searchParam) {
        let element = null;
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
    listAlbum(searchParam) {
        let element = null;
        element = this.getAlbumById(searchParam);
        console.log("Album (id: " + element.id + "):");
        console.log("---------");
        console.log("nombre: " + element.name);
        console.log("año: " + element.year);
        console.log("canciones: ");
        for (let track of element.getTracks()) {
            console.log(`  nombre: ${track.name}, duración: ${track.duration}, generos: ${track.genres.reduce((acum, g) => " " + g, "")} `);
        }
    }
    listTrack(searchParam) {
        let element = null;
        element = this.getTrackById(searchParam);
        console.log("Canción (id: " + element.id + "):");
        console.log("---------");
        console.log("nombre: " + element.name);
        console.log("duración: " + element.duration);
        console.log("canciones: ");
        console.log("generos: " + element.genres.reduce((acum, g) => acum + " " + g, ""));
    }
    createUser(name) {
        if (this.userDoesNotExist(name)) {
            const user = new User_1.default(this.getNewUserId(), name);
            this.users.push(user);
            return user;
        }
        else {
            throw new ElementAlreadyExistsError_1.default(`User ${name}`);
        }
    }
    userDoesNotExist(name) {
        return this.users.find(user => user.name === name) == null;
    }
    getUser(arg) {
        let foundUser = null;
        try {
            foundUser = this.getUserById(parseInt(arg));
        }
        catch (e) {
            if (e.constructor.name === 'ElementNotFoundError') {
                foundUser = this.getUserByName(arg);
            }
            else {
                throw e;
            }
        }
        return foundUser;
    }
    getUserById(id) {
        return this.genericSearch(id, "id", this.users, "user");
    }
    getUserByName(name) {
        return this.genericSearch(name, "name", this.users, "user");
    }
    userListenTo(userId, trackId) {
        var track;
        try {
            track = this.getTrackById(parseInt(trackId));
        }
        catch (e) {
            track = this.getTrackByName(trackId);
        }
        var user = this.getUser(userId);
        return user.listenTo(track);
    }
    getTracksListenedBy(userId) {
        const user = this.getUser(userId);
        return user.getAllTracksListenedTo();
    }
    getTimesTrackListenedBy(userId, trackId) {
        var track;
        try {
            track = this.getTrackById(parseInt(trackId));
        }
        catch (e) {
            track = this.getTrackByName(trackId);
        }
        var user = this.getUser(userId);
        return user.getTimesTrackListened(track);
    }
    getArtistMostListenedTracks(artistId) {
        const tracks = this.getArtist(artistId).getAllTracks();
        tracks.sort((a, b) => this.compareListenersForTracks(a, b));
        return tracks.slice(0, 2);
    }
    compareListenersForTracks(track1, track2) {
        var times1 = this.timesListenedFor(track1);
        var times2 = this.timesListenedFor(track2);
        if (times1 < times2) {
            return -1;
        }
        else if (times1 > times2) {
            return 1;
        }
        else {
            return 0;
        }
    }
    timesListenedFor(track) {
        var times = 0;
        this.users.forEach(user => times += user.getTimesTrackListened(track));
        return times;
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
module.exports = {
    UNQfy,
};

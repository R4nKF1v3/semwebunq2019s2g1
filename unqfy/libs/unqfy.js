"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const picklify = require("picklify");
const fs = require("fs");
const Artist_1 = __importDefault(require("./Artist"));
const Album_1 = __importDefault(require("./Album"));
const Track_1 = __importDefault(require("./Track"));
const Playlist_1 = __importDefault(require("./Playlist"));
const User_1 = __importDefault(require("./User"));
const ElementAlreadyExistsError_1 = __importDefault(require("./exceptions/ElementAlreadyExistsError"));
const ElementNotFoundError_1 = __importDefault(require("./exceptions/ElementNotFoundError"));
const HistoryEvent_1 = __importDefault(require("./HistoryEvent"));
const LoggingClient_1 = __importDefault(require("./clients/LoggingClient"));
const NotificationsClient_1 = __importDefault(require("./clients/NotificationsClient"));
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
    // artistData: objeto JS con los datos necesarios para crear un artista
    //   artistData.name (string)
    //   artistData.country (string)
    // retorna: el nuevo artista creado y notifica al loggingClient
    addArtist(artistData) {
        try {
            if (this.artistDoesNotExist(artistData)) {
                const artist = new Artist_1.default(this.getNewArtistId(), artistData.name, artistData.country);
                this.artists.push(artist);
                LoggingClient_1.default.notifyAddArtist("info", "Agregado nuevo artista " + artist.getName() + " con id " + artist.id + " y nacionalidad " + artist.getCountry());
                return artist;
            }
            else {
                throw new ElementAlreadyExistsError_1.default(`Artist ${artistData.name} from ${artistData.country}`);
            }
        }
        catch (error) {
            if (error instanceof ElementAlreadyExistsError_1.default) {
                LoggingClient_1.default.notifyAddArtist("warning", "Artista de nombre " + artistData.name + " y nacionalidad " + artistData.country + " ya existe");
            }
            else {
                LoggingClient_1.default.notifyAddArtist("error", "Artista de nombre " + artistData.name + " y nacionalidad " + artistData.country + " no pudo ser agregado");
            }
            throw error;
        }
    }
    artistDoesNotExist(artistData) {
        return !this.artists.some(artist => artist.getName() === artistData.name && artist.getCountry() === artistData.country);
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
        if (album.getTracks().some(track => trackData.name === track.name)) {
            throw new ElementAlreadyExistsError_1.default(`Track with name ${trackData.name} already exists in album ${album.name}`);
        }
        LoggingClient_1.default.notifyAddTrack("info", "agregado nuevo album" + trackData.name);
        return album.addTrack(trackData, this);
    }
    genericSearch(elementId, elementsArray, description) {
        let searchInt = elementId;
        parseInt(searchInt);
        let foundElement = elementsArray.find(element => element.id == searchInt);
        if (foundElement != null) {
            return foundElement;
        }
        else {
            foundElement = elementsArray.filter(element => element.name == elementId);
            switch (foundElement.length) {
                case 1:
                    return foundElement[0];
                case 0:
                    throw new ElementNotFoundError_1.default('Element with id ' + elementId.toString() + ' could not be found while searching for ' + description);
                default:
                    throw new ElementNotFoundError_1.default('More than one match while searching a ' + description + ' for the id ' + elementId.toString());
            }
        }
    }
    getArtistById(id) {
        return this.genericSearch(id, this.artists, "artist");
    }
    getAlbumById(id) {
        return this.genericSearch(id, this.allAlbums(), "album");
    }
    getTrackById(id) {
        return this.genericSearch(id, this.allTracks(), "track");
    }
    getPlaylistById(id) {
        return this.genericSearch(id, this.playlists, "playlist");
    }
    //getPlaylists(id : any): Playlist {
    //  return this.genericSearch(id, this.playlists, "playlist");
    //}
    getPlaylists() {
        return this.playlists;
    }
    deleteArtist(artistId) {
        let artistToDelete;
        return Promise.resolve()
            .then((r) => {
            artistToDelete = this.getArtistById(artistId);
            const artistAlbums = artistToDelete.getAlbums();
            artistAlbums.forEach(album => artistToDelete.deleteAlbum(album));
            return NotificationsClient_1.default.notifyDeleteArtist(artistToDelete);
        })
            .then((response) => {
            this.artists = this.artists.filter(artist => artist.id !== artistToDelete.id);
            LoggingClient_1.default.notifyDeleteArtist("info", "");
            return { deleted: artistToDelete };
        })
            .catch((error) => {
            throw new ElementNotFoundError_1.default('artist  could not be added');
            //aqui seria mejor que muestre en  el error el nombre del artista que no pudo agregar
            //si hay un error aca debe informar que no se pudo borrar el artista
            //y que no se persistieron los cambios.
            throw error;
        });
    }
    deleteAlbum(albumId) {
        const albumToDelete = this.getAlbumById(albumId);
        const albumTracks = albumToDelete.getTracks();
        albumTracks.forEach(track => this.deleteTrack(track.id));
        this.artists.forEach(artist => artist.deleteAlbum(albumToDelete));
        return { deleted: albumToDelete };
    }
    deleteTrack(trackId) {
        const trackToDelete = this.getTrackById(trackId);
        this.allAlbums().forEach(album => album.deleteTrack(trackToDelete));
        this.deleteTrackFromPlaylists(trackToDelete);
        this.deleteTrackFromUsers(trackToDelete);
        return { deleted: trackToDelete };
    }
    deletePlaylist(playlistId) {
        const playlistToDelete = this.getPlaylistById(playlistId);
        this.playlists = this.playlists.filter(playlist => playlist.id !== playlistToDelete.id);
        return { deleted: playlistToDelete };
    }
    deleteTrackFromPlaylists(track) {
        this.playlists.forEach(playlist => playlist.deleteTrack(track));
    }
    deleteTrackFromUsers(track) {
        this.users.forEach(user => user.deleteTrack(track));
    }
    // genres: array de generos(strings)
    // retorna: los tracks que contenga alguno de los generos en el parametro genres
    getTracksMatchingGenres(genres) {
        return this.allTracks().filter(track => track.containsGenre(genres));
    }
    // artistName: nombre de artista(string)
    // retorna: los tracks interpredatos por el artista con nombre artistName
    getTracksMatchingArtist(artistName) {
        return this.getArtistById(artistName).getAllTracks();
    }
    searchByName(keyword) {
        const keyw = keyword.toLowerCase();
        const artists = this.artists.filter(artist => artist.getName().toLowerCase().includes(keyw));
        const albums = this.allAlbums().filter(album => album.name.toLowerCase().includes(keyw));
        const tracks = this.allTracks().filter(track => track.name.toLowerCase().includes(keyw));
        const playlists = this.playlists.filter(playlist => playlist.name.toLowerCase().includes(keyw));
        return { artists, albums, tracks, playlists };
    }
    searchArtistsByName(keyword) {
        const keyw = keyword.toLowerCase();
        const artists = this.artists.filter(artist => artist.getName().toLowerCase().includes(keyw));
        let artistList = [];
        artists.forEach(artist => artistList.push(artist.toJSON()));
        return artistList;
    }
    searchAlbumsByName(keyword) {
        const keyw = keyword.toLowerCase();
        const albums = this.allAlbums().filter(album => album.name.toLowerCase().includes(keyw));
        let albumList = [];
        albums.forEach(album => albumList.push(album.toJSON()));
        return albumList;
    }
    searchTracksByName(keyword) {
        const keyw = keyword.toLowerCase();
        const tracks = this.allTracks().filter(track => track.name.toLowerCase().includes(keyw));
        let trackList = [];
        tracks.forEach(track => trackList.push(track.toJSON()));
        return trackList;
    }
    getAllArtists() {
        let res = [];
        this.artists.forEach(artist => res.push(artist.toJSON()));
        return res;
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
    // name: nombre de la playlist
    // genresToInclude: array de generos
    // maxDuration: duración en segundos
    // retorna: la nueva playlist creada
    createPlaylistWithGivenTracks(name, tracks) {
        const genres = tracks.reduce((acum, track) => acum.concat(track.genres), []);
        const duration = tracks.reduce((acum, track) => acum + track.duration, 0);
        const newPlaylist = new Playlist_1.default(this.getNewPlaylistId(), name, genres, duration);
        tracks.forEach(t => newPlaylist.getTracks().push(t));
        this.playlists.push(newPlaylist);
        console.log(this.playlists);
        return newPlaylist;
    }
    listPlaylist(searchParam) {
        let element;
        element = this.getPlaylistById(searchParam);
        let songs = [];
        for (let track of element.getTracks()) {
            songs.push({ name: track.name, duration: track.duration, genres: track.genres.reduce((acum, g) => " " + g, "") });
        }
        return {
            playlistId: element.id,
            name: element.name,
            length: element.duration(),
            genres: element.genres.reduce((acum, g) => acum + " " + g, ""),
            songs
        };
    }
    listArtist(searchParam) {
        let element;
        element = this.getArtistById(searchParam);
        let albums = [];
        for (let album of element.getAlbums()) {
            albums.push({ name: album.name, year: album.year });
        }
        return {
            artistId: element.id,
            name: element.getName(),
            country: element.getCountry(),
            albums
        };
    }
    listAlbum(searchParam) {
        let element;
        element = this.getAlbumById(searchParam);
        let tracks = [];
        for (let track of element.getTracks()) {
            tracks.push({ name: track.name, duration: track.duration, genres: track.genres.reduce((acum, g) => " " + g, "") });
        }
        return {
            albumId: element.id,
            name: element.name,
            year: element.year,
            tracks
        };
    }
    listTrack(searchParam) {
        let element;
        element = this.getTrackById(searchParam);
        return {
            trackId: element.id,
            name: element.name,
            duration: element.duration,
            genres: element.genres.reduce((acum, g) => acum + " " + g, "")
        };
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
        return !this.users.some(user => user.name === name);
    }
    deleteUser(userId) {
        const userToDelete = this.getUserById(userId);
        this.users = this.users.filter(user => user.id !== userToDelete.id);
        return { deleted: userToDelete };
    }
    getUserById(id) {
        return this.genericSearch(id, this.users, "user");
    }
    userListenTo(userId, trackId) {
        let track = this.getTrackById(trackId);
        let user = this.getUserById(userId);
        return user.listenTo(track);
    }
    getTracksListenedBy(userId) {
        const user = this.getUserById(userId);
        return user.getAllTracksListenedTo();
    }
    getTimesTrackListenedBy(userId, trackId) {
        let track = this.getTrackById(trackId);
        let user = this.getUserById(userId);
        return user.getTimesTrackListened(track);
    }
    getArtistMostListenedTracks(artistId) {
        const artist = this.getArtistById(artistId);
        return artist.getMostListened(this.users);
    }
    //Correspondientes a Visado 2
    getAlbumsForArtist(artistName) {
        const artist = this.getArtistById(artistName);
        return artist.getAlbumsNames();
    }
    populateAlbumsForArtist(artistName) {
        const artist = this.getArtistById(artistName);
        return artist.populateAlbums(this);
    }
    getLyricsFor(trackId) {
        const track = this.getTrackById(trackId);
        const artist = this.getArtistForTrack(track);
        return track.getLyrics(artist);
    }
    getArtistForTrack(track) {
        return this.artists.find(artist => artist.hasTrack(track));
    }
    save(filename) {
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
        const classes = [UNQfy, Artist_1.default, Album_1.default, Track_1.default, Playlist_1.default, User_1.default, HistoryEvent_1.default];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
}
exports.default = UNQfy;
module.exports = {
    UNQfy,
};

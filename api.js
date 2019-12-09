"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./api_modules/exceptions/APIError"));
const ResourceNotFound_1 = __importDefault(require("./api_modules/exceptions/ResourceNotFound"));
const ArtistController_1 = __importDefault(require("./api_modules/controllers/ArtistController"));
const AlbumController_1 = __importDefault(require("./api_modules/controllers/AlbumController"));
const TrackController_1 = __importDefault(require("./api_modules/controllers/TrackController"));
const PlaylistController_1 = __importDefault(require("./api_modules/controllers/PlaylistController"));
const UserController_1 = __importDefault(require("./api_modules/controllers/UserController"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
let port = process.env.PORT || 8080;
const rootApp = express_1.default();
// Routing module for /artists
const artists = express_1.default();
artists.use(body_parser_1.default.urlencoded({ extended: true }));
artists.use(body_parser_1.default.json());
const artistController = new ArtistController_1.default;
artists.route('/artists')
    .get((req, res) => {
    artistController.handleGetArtists(req, res);
})
    .post((req, res) => {
    artistController.handleNewArtist(req, res);
});
artists.route('/artists/:artistId')
    .get((req, res) => {
    artistController.handleGetArtistId(req, res);
})
    .put((req, res) => {
    artistController.handleUpdateArtist(req, res);
})
    .delete((req, res) => {
    artistController.handleDeleteArtist(req, res);
});
function artistErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError_1.default) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    }
    else if (err.type === 'entity.parse.failed') {
        res.status(err.status);
        res.json({ status: err.status, errorCode: 'BAD_REQUEST' });
    }
    else {
        next(err);
    }
}
artists.use(artistErrorHandler);
// Routing module for /albums
const albums = express_1.default();
albums.use(body_parser_1.default.urlencoded({ extended: true }));
albums.use(body_parser_1.default.json());
const albumController = new AlbumController_1.default();
albums.route('/albums/:id')
    .get((req, res) => {
    res.json(albumController.handleGetAlbumById(req, res));
})
    .patch((req, res) => {
    res.json(albumController.handleUpdateAlbumById(req, res));
})
    .delete((req, res) => {
    res.json(albumController.handleDeleteAlbumById(req, res));
});
albums.route('/albums/')
    .get((req, res) => {
    res.json(albumController.handleGetAlbums(req, res));
})
    .post((req, res) => {
    res.json(albumController.handleNewAlbum(req, res));
});
// Routing module for /tracks
const tracks = express_1.default();
tracks.use(body_parser_1.default.urlencoded({ extended: true }));
tracks.use(body_parser_1.default.json());
const trackController = new TrackController_1.default();
tracks.route('/tracks/:trackId/lyrics')
    .get((req, res) => {
    res.json(trackController.handleGetTrackLyricsByTrackId(req, res));
});
// Routing module for /playlists
const playlists = express_1.default();
playlists.use(body_parser_1.default.urlencoded({ extended: true }));
playlists.use(body_parser_1.default.json());
const playlistController = new PlaylistController_1.default();
playlists.route('/playlists')
    .post((req, res) => {
    res.json(playlistController.handleNewPlaylist(req, res));
})
    .get((req, res) => {
    res.json(playlistController.handleQueryPlaylists(req, res));
});
playlists.route('/playlists/:playlistsId')
    .get((req, res) => {
    res.json(playlistController.handleGetPlaylistById(req, res));
})
    .delete((req, res) => {
    res.json(playlistController.handleDeletePlaylistById(req, res));
});
// Routing module for /users
/* Pendiente de implementación */
const users = express_1.default();
users.use(body_parser_1.default.urlencoded({ extended: true }));
users.use(body_parser_1.default.json());
const userController = new UserController_1.default();
users.route('/users/:userId')
    .get((req, res) => {
    res.json(userController.handleGetUserById(req, res));
})
    .delete((req, res) => {
    res.json(userController.handleDeleteUserById(req, res));
});
users.route('/users/')
    .post((req, res) => {
    res.json(userController.handleNewUser(req, res));
});
users.route('/users/:userId/listening/')
    .post((req, res) => {
    res.json(userController.handleNewUserListening(req, res));
});
// Routing module for root
function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof ResourceNotFound_1.default) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    }
    else {
        next(err);
    }
}
rootApp.use('/api', artists, albums, tracks, playlists, users);
rootApp.all('*', (req, res) => {
    throw new ResourceNotFound_1.default;
});
rootApp.use(rootErrorHandler);
rootApp.listen(port);

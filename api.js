"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./api_modules/exceptions/APIError"));
const ResourceNotFound_1 = __importDefault(require("./api_modules/exceptions/ResourceNotFound"));
const ArtistController_1 = __importDefault(require("./api_modules/controllers/ArtistController"));
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
albums.route('/albums')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/albums" });
})
    .post((req, res) => {
    res.json({ message: "Hiciste un post a /api/albums" });
});
albums.route('/albums/:albumsId')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/albums/id" });
})
    .patch((req, res) => {
    res.json({ message: "Hiciste un patch a /api/albums/id" });
})
    .delete((req, res) => {
    res.json({ message: "Hiciste un delete a /api/albums/id" });
});
// Routing module for /tracks
const tracks = express_1.default();
tracks.use(body_parser_1.default.urlencoded({ extended: true }));
tracks.use(body_parser_1.default.json());
tracks.route('/tracks/:trackId/lyrics')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/tracks/<trackId>/lyrics" });
});
// Routing module for /playlists
const playlists = express_1.default();
playlists.use(body_parser_1.default.urlencoded({ extended: true }));
playlists.use(body_parser_1.default.json());
playlists.route('/playlists')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/playlists" });
})
    .post((req, res) => {
    res.json({ message: "Hiciste un post a /api/playlists" });
});
playlists.route('/playlists/:playlistsId')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/playlists/id" });
})
    .post((req, res) => {
    res.json({ message: "Hiciste un patch a /api/playlists/id" });
})
    .delete((req, res) => {
    res.json({ message: "Hiciste un delete a /api/playlists/id" });
});
// Routing module for /users
/* Pendiente de implementación */
const users = express_1.default();
users.use(body_parser_1.default.urlencoded({ extended: true }));
users.use(body_parser_1.default.json());
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

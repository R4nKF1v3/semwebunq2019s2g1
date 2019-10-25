"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ElementAlreadyExistsError_1 = __importDefault(require("./libs/exceptions/ElementAlreadyExistsError"));
const fs_1 = __importDefault(require("fs")); // necesitado para guardar/cargar unqfy
const unqmod = require('./libs/unqfy');
function getUNQfy(filename = './data.json') {
    let unqfy = new unqmod.UNQfy();
    if (fs_1.default.existsSync(filename)) {
        unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
}
;
function saveUNQfy(unqfy, filename = './data.json') {
    unqfy.save(filename);
}
;
const express_1 = __importDefault(require("express"));
let port = process.env.PORT || 8080;
const rootApp = express_1.default();
// Routing module for /artists
const artists = express_1.default();
artists.route('/artists')
    .get((req, res) => {
    if (req.query.name) {
        const unqfy = getUNQfy();
        const results = unqfy.searchArtistsByName(req.query.name);
        res.json({ results });
        res.status(200);
    }
    else
        throw new ResourceNotFound;
})
    .post((req, res) => {
    if (req.body.name && req.body.country) {
        const unqfy = getUNQfy();
        try {
            const artist = unqfy.addArtist({ name: req.body.name, country: req.body.country });
            saveUNQfy(unqfy);
            res.json(artist);
            res.status(201);
        }
        catch (e) {
            if (e instanceof ElementAlreadyExistsError_1.default) {
                throw new ResourceAlreadyExists;
            }
            else {
                throw new InternalServerError;
            }
        }
    }
    else {
        throw new BadRequest;
    }
});
artists.route('/artists/:artistId')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/artists/id" });
})
    .patch((req, res) => {
    res.json({ message: "Hiciste un patch a /api/artists/id" });
})
    .delete((req, res) => {
    res.json({ message: "Hiciste un delete a /api/artists/id" });
});
function artistErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof ResourceNotFound) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    }
    else if (err.type === 'entity.parse.failed') {
        res.status(err.status);
        res.json({ status: err.status, errorCode: 'INVALID_JSON' });
    }
    else {
        next(err);
    }
}
artists.use(artistErrorHandler);
// Routing module for /albums
const albums = express_1.default();
albums.route('/albums')
    .get((req, res) => {
    if (req.query.name) {
        const unqfy = getUNQfy();
        const results = unqfy.searchAlbumsByName(req.query.name);
        res.json({ results });
        res.status(200);
    }
    else
        throw new ResourceNotFound();
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
tracks.route('/tracks/:trackId/lyrics')
    .get((req, res) => {
    res.json({ message: "Hiciste un get a /api/tracks/<trackId>/lyrics" });
});
// Routing module for /playlists
const playlists = express_1.default();
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
rootApp.use('/api', artists, albums, tracks, playlists, users);
rootApp.listen(port);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ElementAlreadyExistsError_1 = __importDefault(require("./libs/exceptions/ElementAlreadyExistsError"));
const ElementNotFoundError_1 = __importDefault(require("./libs/exceptions/ElementNotFoundError"));
const APIError_1 = __importDefault(require("./api_modules/exceptions/APIError"));
const ResourceNotFound_1 = __importDefault(require("./api_modules/exceptions/ResourceNotFound"));
const BadRequest_1 = __importDefault(require("./api_modules/exceptions/BadRequest"));
const ResourceAlreadyExists_1 = __importDefault(require("./api_modules/exceptions/ResourceAlreadyExists"));
const InternalServerError_1 = __importDefault(require("./api_modules/exceptions/InternalServerError"));
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
const body_parser_1 = __importDefault(require("body-parser"));
let port = process.env.PORT || 8080;
const rootApp = express_1.default();
// Routing module for /artists
const artists = express_1.default();
artists.use(body_parser_1.default.urlencoded({ extended: true }));
artists.use(body_parser_1.default.json());
artists.route('/artists')
    .get((req, res) => {
    try {
        if (req.query.name) {
            const unqfy = getUNQfy();
            const results = unqfy.searchArtistsByName(req.query.name);
            res.json(results);
            res.status(200);
        }
        else {
            const unqfy = getUNQfy();
            const results = unqfy.getAllArtists();
            res.json(results);
            res.status(200);
        }
    }
    catch (e) {
        throw new InternalServerError_1.default;
    }
})
    .post((req, res) => {
    if (req.body.name && req.body.country) {
        try {
            const unqfy = getUNQfy();
            const artist = unqfy.addArtist({ name: req.body.name, country: req.body.country });
            saveUNQfy(unqfy);
            res.json(artist.toJSON());
            res.status(201);
        }
        catch (e) {
            if (e instanceof ElementAlreadyExistsError_1.default) {
                throw new ResourceAlreadyExists_1.default;
            }
            else {
                throw new InternalServerError_1.default;
            }
        }
    }
    else {
        throw new BadRequest_1.default;
    }
});
artists.route('/artists/:artistId')
    .get((req, res) => {
    try {
        const unqfy = getUNQfy();
        const artist = unqfy.getArtistById(req.params.artistId);
        res.json(artist.toJSON());
        res.status(200);
    }
    catch (e) {
        if (e instanceof ElementNotFoundError_1.default) {
            throw new ResourceNotFound_1.default;
        }
        else {
            throw new InternalServerError_1.default;
        }
    }
})
    .patch((req, res) => {
    if (req.body.name && req.body.country) {
        try {
            const unqfy = getUNQfy();
            const artist = unqfy.getArtistById(req.params.artistId);
            artist.changeParameters(req.body.name, req.body.country);
            saveUNQfy(unqfy);
            res.json(artist.toJSON());
            res.status(201);
        }
        catch (e) {
            if (e instanceof ElementAlreadyExistsError_1.default) {
                throw new ResourceAlreadyExists_1.default;
            }
            else if (e instanceof ElementNotFoundError_1.default) {
                throw new ResourceNotFound_1.default;
            }
            else {
                throw new InternalServerError_1.default;
            }
        }
    }
    else {
        throw new BadRequest_1.default;
    }
})
    .delete((req, res) => {
    try {
        const unqfy = getUNQfy();
        unqfy.deleteArtist(req.params.artistId);
        res.status(204);
    }
    catch (e) {
        if (e instanceof ElementNotFoundError_1.default) {
            throw new ResourceNotFound_1.default;
        }
        else {
            throw new InternalServerError_1.default;
        }
    }
});
function artistErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError_1.default) {
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
albums.use(body_parser_1.default.urlencoded({ extended: true }));
albums.use(body_parser_1.default.json());
albums.route('/albums')
    .get((req, res) => {
    if (req.query.name) {
        try {
            const unqfy = getUNQfy();
            const results = unqfy.searchAlbumsByName(req.query.name);
            res.json({ results });
            res.status(200);
        }
        catch (e) {
            throw new InternalServerError_1.default;
        }
    }
    else
        throw new ResourceNotFound_1.default();
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

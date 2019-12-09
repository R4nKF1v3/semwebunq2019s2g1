"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const ElementAlreadyExistsError_1 = __importDefault(require("../../libs/exceptions/ElementAlreadyExistsError"));
const ElementNotFoundError_1 = __importDefault(require("../../libs/exceptions/ElementNotFoundError"));
const ResourceNotFound_1 = __importDefault(require("../exceptions/ResourceNotFound"));
const BadRequest_1 = __importDefault(require("../exceptions/BadRequest"));
const ResourceAlreadyExists_1 = __importDefault(require("../exceptions/ResourceAlreadyExists"));
const InternalServerError_1 = __importDefault(require("../exceptions/InternalServerError"));
class PlaylistController extends Controller_1.default {
    handleNewPlaylist(req, res) {
        function hasProperties(propsNames, object) {
            let result = true;
            propsNames.forEach(p => result = result && object[p] != null);
            return result;
        }
        try {
            const unqfy = this.getUNQfy();
            const playlistReq = req.body;
            let createdPlaylist = null;
            if (hasProperties(["name", "trackIds"], playlistReq)) {
                if (this.isEmptyString(playlistReq.name) ||
                    this.isEmptyArray(playlistReq.trackIds) ||
                    playlistReq.trackIds.some(tId => isNaN(tId)))
                    throw new BadRequest_1.default();
                let tracks = playlistReq.trackIds.map(tId => unqfy.getTrackById(Number.parseInt(tId)));
                createdPlaylist = unqfy.createPlaylistWithGivenTracks(playlistReq.name, tracks);
            }
            else if (hasProperties(["name", "genres", "maxDuration"], playlistReq)) {
                if (this.isEmptyString(playlistReq.name) ||
                    !this.isPositiveNumber(playlistReq.maxDuration) ||
                    this.isEmptyArray(playlistReq.genres))
                    throw new BadRequest_1.default();
                createdPlaylist = unqfy.createPlaylist(playlistReq.name, playlistReq.genres, playlistReq.maxDuration);
            }
            else
                throw new BadRequest_1.default;
            this.saveUNQfy(unqfy);
            res.status(201);
            res.json(createdPlaylist.toJSON());
        }
        catch (e) {
            console.log(e);
            if (e instanceof BadRequest_1.default) {
                throw e;
            }
            else if (e instanceof ElementAlreadyExistsError_1.default) {
                throw new ResourceAlreadyExists_1.default;
            }
            else {
                throw new InternalServerError_1.default;
            }
        }
    }
    handleQueryPlaylists(req, res) {
        try {
            let playlists = this.getUNQfy().getPlaylists();
            if (!this.isEmptyString(req.query.name))
                playlists = playlists.filter(p => p.name == req.query.name);
            if (this.isPositiveNumber(req.query.durationLT))
                playlists = playlists.filter(p => p.duration() < Number.parseInt(req.query.durationLT));
            if (this.isPositiveNumber(req.query.durationGT))
                playlists = playlists.filter(p => p.duration() > Number.parseInt(req.query.durationGT));
            res.json(playlists);
        }
        catch (e) {
            console.log(e);
            if (e instanceof ElementNotFoundError_1.default) {
                throw new ResourceNotFound_1.default;
            }
            else {
                throw new InternalServerError_1.default;
            }
        }
    }
    handleGetPlaylistById(req, res) {
        try {
            const unqfy = this.getUNQfy();
            const playlist = unqfy.getPlaylistById(req.params.playlistsId);
            res.status(200);
            res.json(playlist.toJSON());
        }
        catch (e) {
            console.log(e);
            if (e instanceof ElementNotFoundError_1.default) {
                throw new ResourceNotFound_1.default;
            }
            else {
                throw new InternalServerError_1.default;
            }
        }
    }
    handleDeletePlaylistById(req, res) {
        try {
            const unqfy = this.getUNQfy();
            unqfy.deletePlaylist(req.params.playlistsId);
            this.saveUNQfy(unqfy);
            res.status(204);
            res.end();
        }
        catch (e) {
            console.log(e);
            if (e instanceof ElementNotFoundError_1.default) {
                throw new ResourceNotFound_1.default;
            }
            else {
                throw new InternalServerError_1.default;
            }
        }
    }
}
exports.default = PlaylistController;

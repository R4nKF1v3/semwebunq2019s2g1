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
class AlbumController extends Controller_1.default {
    handleGetAlbums(req, res) {
        try {
            const unqfy = this.getUNQfy();
            let results = null;
            if (req.query.name != null)
                results = unqfy.searchAlbumsByName(req.query.name);
            else
                results = unqfy.allAlbums();
            res.status(200);
            res.json(results);
        }
        catch (e) {
            console.log(e);
            throw new InternalServerError_1.default;
        }
    }
    handleGetAlbumById(req, res) {
        try {
            const unqfy = this.getUNQfy();
            const artist = unqfy.getAlbumById(req.params.id);
            res.status(200);
            res.json(artist.toJSON());
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
    handleNewAlbum(req, res) {
        if (req.body.name != null && req.body.year != null && req.body.artistId != null) {
            try {
                const unqfy = this.getUNQfy();
                const albumReq = req.body;
                const createdAlbum = unqfy.addAlbum(albumReq.artistId, { name: albumReq.name, year: albumReq.year });
                this.saveUNQfy(unqfy);
                res.status(201);
                res.json(createdAlbum.toJSON());
            }
            catch (e) {
                console.log(e);
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
    }
    handleUpdateAlbumById(req, res) {
        if (req.body.year != null && Number.isInteger(req.body.year)) {
            try {
                const unqfy = this.getUNQfy();
                const albumToUpdate = unqfy.getAlbumById(req.params.id);
                albumToUpdate.year = req.body.year;
                this.saveUNQfy(unqfy);
                const updatedAlbum = unqfy.getAlbumById(req.params.id);
                res.status(200);
                res.json(albumToUpdate.toJSON());
            }
            catch (e) {
                console.log(e);
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
    }
    handleDeleteAlbumById(req, res) {
        try {
            const unqfy = this.getUNQfy();
            unqfy.deleteAlbum(req.params.id);
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
exports.default = AlbumController;

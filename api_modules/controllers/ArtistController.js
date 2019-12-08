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
class ArtistController extends Controller_1.default {
    handleGetArtists(req, res) {
        try {
            if (req.query.name) {
                const unqfy = this.getUNQfy();
                const results = unqfy.searchArtistsByName(req.query.name);
                res.status(200);
                res.json(results);
            }
            else {
                const unqfy = this.getUNQfy();
                const results = unqfy.getAllArtists();
                res.status(200);
                res.json(results);
            }
        }
        catch (e) {
            console.log(e);
            throw new InternalServerError_1.default;
        }
    }
    handleNewArtist(req, res) {
        if (req.body.name && req.body.country) {
            try {
                const unqfy = this.getUNQfy();
                const artist = unqfy.addArtist({ name: req.body.name, country: req.body.country });
                this.saveUNQfy(unqfy);
                res.status(201);
                res.json(artist.toJSON());
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
    handleGetArtistId(req, res) {
        try {
            const unqfy = this.getUNQfy();
            const artist = unqfy.getArtistById(req.params.artistId);
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
    handleUpdateArtist(req, res) {
        if (req.body.name && req.body.country) {
            try {
                const unqfy = this.getUNQfy();
                const artist = unqfy.getArtistById(req.params.artistId);
                artist.changeParameters(req.body.name, req.body.country);
                this.saveUNQfy(unqfy);
                res.status(200);
                res.json(artist.toJSON());
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
    handleDeleteArtist(req, res) {
        try {
            const unqfy = this.getUNQfy();
            unqfy.deleteArtist(req.params.artistId);
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
exports.default = ArtistController;

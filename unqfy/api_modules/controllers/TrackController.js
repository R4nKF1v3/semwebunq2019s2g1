"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const ElementNotFoundError_1 = __importDefault(require("../../libs/exceptions/ElementNotFoundError"));
const ResourceNotFound_1 = __importDefault(require("../exceptions/ResourceNotFound"));
const BadRequest_1 = __importDefault(require("../exceptions/BadRequest"));
const InternalServerError_1 = __importDefault(require("../exceptions/InternalServerError"));
class TrackController extends Controller_1.default {
    handleGetTrackLyricsByTrackId(req, res) {
        if (req.params.trackId == null || isNaN(req.params.trackId))
            throw new BadRequest_1.default;
        const trackId = Number.parseInt(req.params.trackId);
        try {
            const unqfy = this.getUNQfy();
            unqfy.getLyricsFor(trackId).then(response => {
                this.saveUNQfy(unqfy);
                res.status(200);
                res.json(response);
            });
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
exports.default = TrackController;

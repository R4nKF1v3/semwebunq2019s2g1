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
class UserController extends Controller_1.default {
    constructor() {
        super(...arguments);
        this.unqfy = this.getUNQfy();
    }
    handleNewUser(req, res) {
        if (this.isEmptyString(req.body.name))
            throw new BadRequest_1.default;
        try {
            const user = this.unqfy.createUser(req.body.name);
            this.saveUNQfy(this.unqfy);
            res.status(201);
            res.json(user.toJSON());
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
    handleGetUserById(req, res) {
        try {
            const user = this.unqfy.getUserById(req.params.userId);
            res.status(200);
            res.json(user.toJSON());
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
    handleDeleteUserById(req, res) {
        try {
            this.unqfy.deleteUser(req.params.userId);
            this.saveUNQfy(this.unqfy);
            res.status(200);
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
    handleNewUserListening(req, res) {
        if (!this.isPositiveNumber(req.params.userId) ||
            !this.isPositiveNumber(req.body.trackId))
            throw new BadRequest_1.default;
        try {
            this.unqfy.userListenTo(req.params.userId, req.body.trackId);
            res.status(201);
            this.saveUNQfy(this.unqfy);
            res.json(this.unqfy.getUserById(req.params.userId).toJSON());
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
exports.default = UserController;

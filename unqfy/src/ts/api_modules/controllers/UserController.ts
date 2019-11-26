
import Controller from "./Controller";
import ElementAreadyExistsError from '../../libs/exceptions/ElementAlreadyExistsError';
import ElementNotFoundError from '../../libs/exceptions/ElementNotFoundError';
import ResourceNotFound from '../exceptions/ResourceNotFound';
import BadRequest from '../exceptions/BadRequest';
import ResourceAlreadyExists from '../exceptions/ResourceAlreadyExists';
import InternalServerError from '../exceptions/InternalServerError';
import UNQfy from '../../libs/unqfy';

export default class UserController extends Controller {

    private unqfy: UNQfy = this.getUNQfy();

    handleNewUser(req, res) {
        if (this.isEmptyString(req.body.name))
            throw new BadRequest;

        try {
            const user = this.unqfy.createUser(req.body.name);
            this.saveUNQfy(this.unqfy);
            res.status(201);
            res.json(user.toJSON());
        } catch(e) {
            console.log(e);
            if (e instanceof ElementAreadyExistsError) {
                throw new ResourceAlreadyExists;
            } else {
                throw new InternalServerError;
            }
        }
    }

    handleGetUserById(req, res) {
        try {
            const user = this.unqfy.getUserById(req.params.userId);
            res.status(200);
            res.json(user.toJSON());
        } catch(e) {
            console.log(e);
            if (e instanceof ElementNotFoundError) {
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    }

    handleDeleteUserById(req, res) {
        try {
            this.unqfy.deleteUser(req.params.userId);
            this.saveUNQfy(this.unqfy);
            res.status(200);
        } catch(e) {
            console.log(e);
            if (e instanceof ElementNotFoundError) {
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    }

    handleNewUserListening(req, res) {
        if (!this.isPositiveNumber(req.params.userId) ||
            !this.isPositiveNumber(req.body.trackId) )
            throw new BadRequest

        try {
            this.unqfy.userListenTo(req.params.userId, req.body.trackId);
            res.status(201);
            this.saveUNQfy(this.unqfy);
            res.json(this.unqfy.getUserById(req.params.userId).toJSON());
        } catch(e) {
            console.log(e);
            if (e instanceof ElementNotFoundError) {
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    }

}
import Controller from "./Controller";
import ElementAreadyExistsError from '../../libs/exceptions/ElementAlreadyExistsError';
import ElementNotFoundError from '../../libs/exceptions/ElementNotFoundError';
import ResourceNotFound from '../exceptions/ResourceNotFound';
import BadRequest from '../exceptions/BadRequest';
import ResourceAlreadyExists from '../exceptions/ResourceAlreadyExists';
import InternalServerError from '../exceptions/InternalServerError';
import UNQfy from '../../libs/unqfy';

export default class ArtistController extends Controller{
    
    handleGetArtists(req, res){
        try {
            if (req.query.name){
                const unqfy = this.getUNQfy();
                const results = unqfy.searchArtistsByName(req.query.name);
                res.status(200);
                res.json(results);
            } else {
                const unqfy = this.getUNQfy();
                const results = unqfy.getAllArtists();
                res.status(200);
                res.json(results);
            }
        } catch(e) {
            console.log(e);
            throw new InternalServerError;
        }
    }

    handleNewArtist(req, res){
        if (req.body.name && req.body.country){
            try {
                const unqfy = this.getUNQfy();
                const artist = unqfy.addArtist({name: req.body.name, country: req.body.country});
                this.saveUNQfy(unqfy);
                res.status(201);
                res.json(artist.toJSON());
            } catch(e){
                console.log(e);
                if (e instanceof ElementAreadyExistsError){
                    throw new ResourceAlreadyExists;
                } else {
                    throw new InternalServerError;
                }
            }
        } else {
            throw new BadRequest;
        }  
    }

    handleGetArtistId(req, res){
        try {
            const unqfy = this.getUNQfy();
            const artist = unqfy.getArtistById(req.params.artistId);
            res.status(200);
            res.json(artist.toJSON());
        } catch(e) {
            console.log(e);
            if (e instanceof ElementNotFoundError){
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    }

    handleUpdateArtist(req, res){
        if (req.body.name && req.body.country){
            try {
                const unqfy : UNQfy = this.getUNQfy();
                const artist = unqfy.getArtistById(req.params.artistId);
                artist.changeParameters(req.body.name, req.body.country);
                this.saveUNQfy(unqfy);
                res.status(200);
                res.json(artist.toJSON());
            } catch(e){
                console.log(e);
                if (e instanceof ElementAreadyExistsError){
                    throw new ResourceAlreadyExists;
                } else if (e instanceof ElementNotFoundError){
                    throw new ResourceNotFound;
                } else {
                    throw new InternalServerError;
                }
            }
        } else {
            throw new BadRequest;
        }  
    }

    handleDeleteArtist(req, res){
        try {
            const unqfy : UNQfy = this.getUNQfy();
            unqfy.deleteArtist(req.params.artistId);
            this.saveUNQfy(unqfy);
            res.status(204);
            res.end();
        } catch(e) {
            console.log(e);
            if (e instanceof ElementNotFoundError){
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    }

}

import Controller from "./Controller";
import ElementAreadyExistsError from '../../libs/exceptions/ElementAlreadyExistsError';
import ElementNotFoundError from '../../libs/exceptions/ElementNotFoundError';
import ResourceNotFound from '../exceptions/ResourceNotFound';
import BadRequest from '../exceptions/BadRequest';
import ResourceAlreadyExists from '../exceptions/ResourceAlreadyExists';
import InternalServerError from '../exceptions/InternalServerError';
import UNQfy from '../../libs/unqfy';
import RelatedResourceNotFound from "../exceptions/RelatedResourceNotFound";

export default class AlbumController extends Controller{
    
    handleGetAlbums(req, res){
        try {
            const unqfy = this.getUNQfy();
            let results = null;
            if (req.query.name != null)
                results = unqfy.searchAlbumsByName(req.query.name);
            else 
                results = unqfy.allAlbums();
            res.status(200);
            res.json(results);
        } catch(e) {
            console.log(e);
            throw new InternalServerError;
        }
    }

    handleGetAlbumById(req, res){
        try {
            const unqfy = this.getUNQfy();
            const artist = unqfy.getAlbumById(req.params.id);
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

    handleNewAlbum(req, res){
        if (req.body.name != null && req.body.year != null && req.body.artistId != null){
            try {
                const unqfy = this.getUNQfy();
                const albumReq = req.body;
                const createdAlbum = unqfy.addAlbum(albumReq.artistId, {name: albumReq.name, year: albumReq.year});
                this.saveUNQfy(unqfy);
                res.status(201);
                res.json(createdAlbum.toJSON());
            } catch(e){
                console.log(e);
                if (e instanceof ElementAreadyExistsError){
                    throw new ResourceAlreadyExists;
                } else if (e instanceof ElementNotFoundError){
                    throw new RelatedResourceNotFound;
                } else {
                    throw new InternalServerError;
                }
            }
        } else {
            throw new BadRequest;
        }  
    }

    handleUpdateAlbumById(req, res){
        if (req.body.year != null && Number.isInteger(req.body.year)){
            try {
                const unqfy : UNQfy = this.getUNQfy();
                const albumToUpdate = unqfy.getAlbumById(req.params.id);
                albumToUpdate.year = req.body.year;
                this.saveUNQfy(unqfy);
                const updatedAlbum = unqfy.getAlbumById(req.params.id);
                res.status(200);
                res.json(albumToUpdate.toJSON());
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

    handleDeleteAlbumById(req, res){
        try {
            const unqfy : UNQfy = this.getUNQfy();
            unqfy.deleteAlbum(req.params.id);
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
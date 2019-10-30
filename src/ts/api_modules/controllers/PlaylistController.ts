
import Controller from "./Controller";
import ElementAreadyExistsError from '../../libs/exceptions/ElementAlreadyExistsError';
import ElementNotFoundError from '../../libs/exceptions/ElementNotFoundError';
import ResourceNotFound from '../exceptions/ResourceNotFound';
import BadRequest from '../exceptions/BadRequest';
import ResourceAlreadyExists from '../exceptions/ResourceAlreadyExists';
import InternalServerError from '../exceptions/InternalServerError';
import UNQfy from '../../libs/unqfy';

export default class PlaylistController extends Controller{

    handleNewPlaylist(req, res){
        function hasProperties(propsNames: Array<string>, object: object) {
            let result = true;
            propsNames.forEach( p => result = result && object[p] != null);
            return result;
        }

        try {
            const unqfy = this.getUNQfy();
            const playlistReq = req.body;
            let createdPlaylist = null;
            if (hasProperties(["name", "trackIds"], playlistReq)) {
                if (
                    this.isEmptyString(playlistReq.name) ||
                    this.isEmptyArray(playlistReq.trackIds) ||
                    playlistReq.trackIds.some( tId => isNaN(tId) )
                )
                    throw new BadRequest();

                let tracks = playlistReq.trackIds.map( tId => unqfy.getTrackById(Number.parseInt(tId)) );
                createdPlaylist = unqfy.createPlaylistWithGivenTracks(playlistReq.name, tracks);
            }
            else if (hasProperties(["name", "genres", "maxDuration"], playlistReq)) {
                if (
                    this.isEmptyString(playlistReq.name) ||
                    !this.isPositiveNumber(playlistReq.maxDuration) ||
                    this.isEmptyArray(playlistReq.genres)
                )
                    throw new BadRequest();

                createdPlaylist = unqfy.createPlaylist(playlistReq.name, playlistReq.genres, playlistReq.maxDuration);
            }
            else
                throw new BadRequest;
                
            this.saveUNQfy(unqfy);
            res.status(201);
            res.json(createdPlaylist.toJSON());
        } catch(e){
            console.log(e);
            if (e instanceof BadRequest){
                throw e;
            } else if (e instanceof ElementAreadyExistsError){
                throw new ResourceAlreadyExists;
            } else {
                throw new InternalServerError;
            }
        }
    }

    handleGetPlaylistById(req, res){
        try {
            const unqfy = this.getUNQfy();
            const playlist = unqfy.getPlaylistById(req.params.playlistsId);
            res.status(200);
            res.json(playlist.toJSON());
        } catch(e) {
            console.log(e);
            if (e instanceof ElementNotFoundError){
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    }

    handleDeletePlaylistById(req, res){
        try {
            const unqfy : UNQfy = this.getUNQfy();
            unqfy.deletePlaylist(req.params.playlistsId);
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

import Controller from "./Controller";
import ElementNotFoundError from '../../libs/exceptions/ElementNotFoundError';
import ResourceNotFound from '../exceptions/ResourceNotFound';
import BadRequest from '../exceptions/BadRequest';
import InternalServerError from '../exceptions/InternalServerError';

export default class TrackController extends Controller{

    handleGetTrackLyricsByTrackId(req, res){
        if (req.params.trackId == null || isNaN(req.params.trackId))
            throw new BadRequest;
        
        const trackId = Number.parseInt(req.params.trackId);
        try {
            const unqfy = this.getUNQfy();
            res.status(200);
            res.json({
                Name: "TODO: HardCoded",
                lyrics: "TODO: HardCoded lyrics"
            });
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
import BadRequest from "./exceptions/BadRequest";
import fs from 'fs';
import NotificationModel from './NotificationModel';
import ElementNotFoundError from "./exceptions/ElementNotFoundError";

export default class NotificationController{

    handleSubscribe(req, res) {
        if (req.body.artistId && req.body.email && this.validEmail(req.body.email)){
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist)=>{
                    notificationModel.addSubscription(parseInt(artist.id), req.body.email);
                    this.saveModel(notificationModel);
                    res.status(200);
                    res.end()
                })
                .catch((error)=>{
                    console.log(error);
                    if (error instanceof ElementNotFoundError){
                        res.status(404);
                        res.json({status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND'})
                    } else {
                        res.status(500);
                        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})
                    }
                })
        } else {
            throw new BadRequest
        }
    }

    
    handleUnsubscribe(req, res) {
        if (req.body.artistId && req.body.email && this.validEmail(req.body.email)){
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist)=>{
                    notificationModel.deleteSubscription(parseInt(artist.id), req.body.email);
                    this.saveModel(notificationModel);
                    res.status(200);
                    res.end()
                })
                .catch((error)=>{
                    console.log(error);
                    if (error instanceof ElementNotFoundError){
                        res.status(404);
                        res.json({status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND'})
                    } else {
                        res.status(500);
                        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})
                    }
                })
        } else {
            throw new BadRequest
        }
    }    
    
    handleNotify(req, res){
        if (req.body.artistId && req.body.subject && req.body.message){
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist)=>{
                    return notificationModel.notifyUsers(parseInt(artist.id), req.body.subject, req.body.message);
                })
                .then((result)=>{
                    res.status(200);
                    res.end()
                })
                .catch((error)=>{
                    console.log(error);
                    if (error instanceof ElementNotFoundError){
                        res.status(404);
                        res.json({status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND'})
                    } else {
                        res.status(500);
                        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})
                    }
                })
        } else {
            throw new BadRequest
        }

    }
    
    handleGetSubscriptions(req, res) {
        if (req.query.artistId){
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.query.artistId)
                .then((artist)=>{
                    let subscriptors = notificationModel.getSubscriptorsFor(parseInt(artist.id));
                    res.status(200);
                    res.json({artistId: artist.id, subscriptors});
                })
                .catch((error)=>{
                    console.log(error);
                    if (error instanceof ElementNotFoundError){
                        res.status(404);
                        res.json({status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND'})
                    } else {
                        res.status(500);
                        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})
                    }
                })
        } else {
            throw new BadRequest;
        }
    }
    
    handleDeleteSubscriptions(req, res) {
        if (req.body.artistId){
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist)=>{
                    notificationModel.deleteSubscriptorsFor(parseInt(artist.id));
                    this.saveModel(notificationModel);
                    res.status(200);
                    res.end();
                })
                .catch((error)=>{
                    console.log(error);
                    if (error instanceof ElementNotFoundError){
                        res.status(404);
                        res.json({status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND'})
                    } else {
                        res.status(500);
                        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'})
                    }
                })
        } else {
            throw new BadRequest;
        }
    }

    private validEmail(email: any) : boolean {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    private getModel(filename = './data.json'): NotificationModel {
        let model = new NotificationModel;
        if (fs.existsSync(filename)) {
            model = NotificationModel.load(filename);
        }
        return model;
    }
    
    private saveModel(model: NotificationModel, filename = './data.json') {
        model.save(filename);
    }
}
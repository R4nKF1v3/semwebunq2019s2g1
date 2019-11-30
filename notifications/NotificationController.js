"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BadRequest_1 = __importDefault(require("./exceptions/BadRequest"));
const fs_1 = __importDefault(require("fs"));
const NotificationModel_1 = __importDefault(require("./NotificationModel"));
const ElementNotFoundError_1 = __importDefault(require("./exceptions/ElementNotFoundError"));
class NotificationController {
    handleSubscribe(req, res) {
        if (req.body.artistId && req.body.email && this.validEmail(req.body.email)) {
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist) => {
                notificationModel.addSubscription(parseInt(artist.id), req.body.email);
                this.saveModel(notificationModel);
                res.status(200);
                res.end();
            })
                .catch((error) => {
                console.log(error);
                if (error instanceof ElementNotFoundError_1.default) {
                    res.status(404);
                    res.json({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
                }
                else {
                    res.status(500);
                    res.json({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
                }
            });
        }
        else {
            throw new BadRequest_1.default;
        }
    }
    handleUnsubscribe(req, res) {
        if (req.body.artistId && req.body.email && this.validEmail(req.body.email)) {
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist) => {
                notificationModel.deleteSubscription(parseInt(artist.id), req.body.email);
                this.saveModel(notificationModel);
                res.status(200);
                res.end();
            })
                .catch((error) => {
                console.log(error);
                if (error instanceof ElementNotFoundError_1.default) {
                    res.status(404);
                    res.json({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
                }
                else {
                    res.status(500);
                    res.json({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
                }
            });
        }
        else {
            throw new BadRequest_1.default;
        }
    }
    handleNotify(req, res) {
        if (req.body.artistId && req.body.subject && req.body.message) {
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist) => {
                return notificationModel.notifyUsers(parseInt(artist.id), req.body.subject, req.body.message);
            })
                .then((result) => {
                res.status(200);
                res.end();
            })
                .catch((error) => {
                console.log(error);
                if (error instanceof ElementNotFoundError_1.default) {
                    res.status(404);
                    res.json({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
                }
                else {
                    res.status(500);
                    res.json({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
                }
            });
        }
        else {
            throw new BadRequest_1.default;
        }
    }
    handleGetSubscriptions(req, res) {
        if (req.query.artistId) {
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.query.artistId)
                .then((artist) => {
                let subscriptors = notificationModel.getSubscriptorsFor(parseInt(artist.id));
                res.status(200);
                res.json({ artistId: artist.id, subscriptors });
            })
                .catch((error) => {
                console.log(error);
                if (error instanceof ElementNotFoundError_1.default) {
                    res.status(404);
                    res.json({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
                }
                else {
                    res.status(500);
                    res.json({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
                }
            });
        }
        else {
            throw new BadRequest_1.default;
        }
    }
    handleDeleteSubscriptions(req, res) {
        if (req.body.artistId) {
            let notificationModel = this.getModel();
            notificationModel.getArtistID(req.body.artistId)
                .then((artist) => {
                notificationModel.deleteSubscriptorsFor(parseInt(artist.id));
                this.saveModel(notificationModel);
                res.status(200);
                res.end();
            })
                .catch((error) => {
                console.log(error);
                if (error instanceof ElementNotFoundError_1.default) {
                    res.status(404);
                    res.json({ status: 404, errorCode: 'RELATED_RESOURCE_NOT_FOUND' });
                }
                else {
                    res.status(500);
                    res.json({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
                }
            });
        }
        else {
            throw new BadRequest_1.default;
        }
    }
    validEmail(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }
    getModel(filename = './data.json') {
        let model = new NotificationModel_1.default;
        if (fs_1.default.existsSync(filename)) {
            model = NotificationModel_1.default.load(filename);
        }
        return model;
    }
    saveModel(model, filename = './data.json') {
        model.save(filename);
    }
}
exports.default = NotificationController;

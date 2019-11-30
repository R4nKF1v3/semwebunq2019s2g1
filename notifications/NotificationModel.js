"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const picklify = require("picklify");
const fs = require("fs");
const UNQfyClient_1 = __importDefault(require("./UNQfyClient"));
const ElementNotFoundError_1 = __importDefault(require("./exceptions/ElementNotFoundError"));
const InternalServerError_1 = __importDefault(require("./exceptions/InternalServerError"));
const Subscription_1 = __importDefault(require("./Subscription"));
const gmailClient_1 = __importDefault(require("./gmailClient"));
const util_1 = require("util");
const getGmailClientPromise = util_1.promisify(gmailClient_1.default);
class NotificationModel {
    constructor() {
        this.subscriptions = [];
    }
    getArtistID(artistId) {
        if (isNaN(artistId)) {
            return UNQfyClient_1.default.getArtistByName(artistId)
                .then((response) => {
                if (response.length > 0) {
                    return response[0];
                }
                else {
                    throw new ElementNotFoundError_1.default;
                }
            })
                .catch((error) => {
                console.log(error);
                if (error instanceof ElementNotFoundError_1.default) {
                    throw error;
                }
                else {
                    throw new InternalServerError_1.default;
                }
            });
        }
        else {
            return UNQfyClient_1.default.getArtistID(artistId)
                .catch((error) => {
                console.log(error);
                if (error.error.status === 404 && error.error.errorCode === 'RESOURCE_NOT_FOUND') {
                    throw new ElementNotFoundError_1.default;
                }
                else {
                    throw new InternalServerError_1.default;
                }
            });
        }
    }
    addSubscription(artistId, email) {
        if (!this.subscriptionAlreadyExists(artistId, email)) {
            this.subscriptions.push(new Subscription_1.default(artistId, email));
        }
    }
    subscriptionAlreadyExists(artistId, email) {
        return this.subscriptions.find((value) => value.email === email && value.artistId === artistId) != undefined;
    }
    deleteSubscription(artistId, email) {
        this.subscriptions = this.subscriptions.filter((value) => !(value.email === email && value.artistId === artistId));
    }
    getSubscriptorsFor(artistId) {
        let emails = [];
        this.subscriptions.forEach((sub) => {
            if (sub.artistId === artistId) {
                emails.push(sub.email);
            }
        });
        return emails;
    }
    deleteSubscriptorsFor(artistId) {
        this.subscriptions = this.subscriptions.filter((value) => value.artistId !== artistId);
    }
    notifyUsers(artistId, subject, message) {
        let gmailClient = gmailClient_1.default();
        let userList = this.subscriptions.filter((value) => value.artistId === artistId);
        let p = Promise.resolve()
            .then(() => {
            for (let i = 0; i < userList.length; i++) {
                p = p.then(() => {
                    let user = userList[i];
                    gmailClient.users.messages.send({
                        userId: 'me',
                        requestBody: {
                            raw: this.createMessage(user.email, subject, message),
                        },
                    });
                });
            }
        });
        return p;
    }
    createMessage(email, subject, mssg) {
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            'From: Grupo 1 <grupo1semwebunq2019s2@gmail.com>',
            `To: ${email}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            mssg,
        ];
        const message = messageParts.join('\n');
        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        return encodedMessage;
    }
    save(filename) {
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        const classes = [NotificationModel, Subscription_1.default];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
}
exports.default = NotificationModel;

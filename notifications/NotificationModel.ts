import picklify = require('picklify');
import fs = require('fs');
import UNQfyClient from './UNQfyClient';
import ElementNotFoundError from './exceptions/ElementNotFoundError';
import InternalServerError from './exceptions/InternalServerError';
import Subscription from './Subscription';
import getGmailClient from './gmailClient';
import { promisify } from 'util';

const getGmailClientPromise = promisify(getGmailClient);

export default class NotificationModel{
    
    private subscriptions : Array<Subscription>;
    
    constructor(){
        this.subscriptions = [];
    }
    
    getArtistID(artistId: any): Promise<any> {
        if (isNaN(artistId)){
            return UNQfyClient.getArtistByName(artistId)
                .then((response : Array<any>)=>{
                    if (response.length > 0){
                        return response[0];
                    } else {
                        throw new ElementNotFoundError;
                    }
                })
                .catch((error)=>{
                    console.log(error);
                    if (error instanceof ElementNotFoundError){
                        throw error;
                    } else {
                        throw new InternalServerError;
                    }
                });
        } else {
            return UNQfyClient.getArtistID(artistId)
                .catch((error)=>{
                    console.log(error);
                    if (error.error.status === 404 && error.error.errorCode === 'RESOURCE_NOT_FOUND'){
                        throw new ElementNotFoundError;
                    } else {
                        throw new InternalServerError;
                    }
                });
        }
    }
    
    addSubscription(artistId: number, email: string) {
        if (!this.subscriptionAlreadyExists(artistId, email)){
            this.subscriptions.push(new Subscription(artistId, email));
        }
    }

    private subscriptionAlreadyExists(artistId : number, email : string) : boolean{
        return this.subscriptions.find((value : Subscription)=>value.email === email && value.artistId === artistId) != undefined;
    }
    
    deleteSubscription(artistId: number, email: string) {
        this.subscriptions = this.subscriptions.filter((value : Subscription)=>!(value.email === email && value.artistId === artistId));
    }

    getSubscriptorsFor(artistId: number) : Array<string> {
        let emails = [];
        this.subscriptions.forEach((sub :Subscription) =>{
            if (sub.artistId === artistId){
                emails.push(sub.email);
            }
        })
        return emails;
    }

    deleteSubscriptorsFor(artistId: number) {
        this.subscriptions = this.subscriptions.filter((value : Subscription)=>value.artistId !== artistId);
    }

    notifyUsers(artistId: number, subject: string, message: string): Promise<any> {
        let gmailClient = getGmailClient();
        let userList = this.subscriptions.filter((value : Subscription)=>value.artistId === artistId);
        let p = Promise.resolve()
            .then(()=>{
                for (let i = 0; i < userList.length; i++) {
                    p = p.then(()=>{
                        let user = userList[i];
                        gmailClient.users.messages.send(
                            {
                              userId: 'me',
                              requestBody: {
                                raw: this.createMessage(user.email, subject, message),
                              },
                            }
                            );
                    })
                }
            })
        return p;
    }

    private createMessage(email: string, subject: string, mssg : string){
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

    save(filename : string) {
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    
    static load(filename : string) {
        const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
        const classes = [NotificationModel, Subscription];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }

}
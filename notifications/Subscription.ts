export default class Subscription{
    readonly artistId : number;
    readonly email : string;
    
    constructor(artistId: number, email: string){
        this.artistId = artistId;
        this.email = email;
    }
}
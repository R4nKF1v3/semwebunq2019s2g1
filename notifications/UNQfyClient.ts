const BASE_URL = 'http://172.20.0.21:5000/api';

export default class UNQfyClient{
    static getArtistID(artistId: any) : Promise<any> {
        const rp = require('request-promise');

        var options = {
            uri: BASE_URL + '/artists/' + artistId,
            json: true
        }; 

        return rp.get(options);
    }

    static getArtistByName(artistId: any) : Promise<any>{
        const rp = require('request-promise');

        var options = {
            uri: BASE_URL + '/artists?name=' + artistId,
            json: true
        }; 

        return rp.get(options);
    }

}
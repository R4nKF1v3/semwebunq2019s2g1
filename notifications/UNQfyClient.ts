const BASE_URL = 'http://localhost:5000/api';

export default class UNQfyClient{
    static getArtistID(artistId: any) : Promise<any> {
        const rp = require('request-promise');

        var options = {
            uri: BASE_URL + '/artists/:artistId',
            json: true
        }; 

        return rp.get(options);
    }

}
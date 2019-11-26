const util = require("util");
const fs = require("fs");
const readFilePromise = util.promisify(fs.readFile);

export default class SpotifyClient {

    queryArtistName(artistName: string): Promise<any>{
        return readFilePromise("spotifyCreds.json")
          .then((res) => {
            const content = JSON.parse(res);
            var token = content.access_token;

            const requestFile = require('request-promise');
            const options = {
              url: encodeURI('https://api.spotify.com/v1/search?q='+artistName+'&type=artist'),
              headers: { Authorization: 'Bearer ' + token },
              json: true,
            };
            return requestFile(options)
        })
    }

    queryArtistAlbums(artistId: string): Promise<any>{
        return readFilePromise("spotifyCreds.json")
        .then((res) => {
            const content = JSON.parse(res);
            var token = content.access_token;

            const rp = require('request-promise');
            const options = {
              url: 'https://api.spotify.com/v1/artists/'+artistId+'/albums',
              headers: { Authorization: 'Bearer ' + token },
              json: true,
            };
          
            return rp.get(options)
        } )
    }
}
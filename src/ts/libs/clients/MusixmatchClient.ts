import NoLyricsFoundForTrack from "../exceptions/NoLyricsFoundForTrack";

const BASE_URL = 'http://api.musixmatch.com/ws/1.1';

export default class MusixmatchClient {
  
    private idCache: Array<any>;

    constructor(){
        this.idCache = [];
    }
  
    queryTrackId(name: string, artistName: string): Promise<any> {
        
        this.idCache.forEach(track => {
            if(track.name === name && track.artistName === artistName){
                return track.id;
            }
        });
        const rp = require('request-promise');

        var options = {
            uri: BASE_URL + '/track.search',
            qs: {
                apikey: '1590d2f1e38d79145981ae0f60a2b78e',
                q_track: name,
                q_artist: artistName,
                f_has_lyrics: true
            },
            json: true // Automatically parses the JSON string in the response
        };
        
          return rp.get(options)
            .then((response) => {
                var body = response.message.body;
                var track = body.track_list.find(track => track.track.artist_name.toLowerCase() == artistName.toLowerCase());
                if (track){
                    this.idCache.push( { artistName ,name, id:track.track.track_id} );
                    return track.track.track_id;
                } else {
                    throw new NoLyricsFoundForTrack(name);
                }
        });
      }
 

    queryTrackLyrics(track_id: string): Promise<any>{
           
        const rp = require('request-promise');
                
        var options = {
        
            uri: BASE_URL + '/track.lyrics.get',
            qs: {
                apikey: '1590d2f1e38d79145981ae0f60a2b78e',
                track_id: track_id,
            },
            json: true // Automatically parses the JSON string in the response
        };
       
        return rp.get(options)
            .then((response) => {
                return response.message.body.lyrics;
        })
        
    }   
}
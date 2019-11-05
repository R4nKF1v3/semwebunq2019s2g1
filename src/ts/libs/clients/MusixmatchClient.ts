import { Dictionary } from "express-serve-static-core";
import Track from "../Track";
import UNQfy from "../unqfy";
import bodyParser = require("body-parser");
import { response } from "express";

const util = require("util");
const fs = require("fs");
const readFilePromise = util.promisify(fs.readFile);

export default class MusixmatchClient {
  
    private cache: Array<any>;
  
    queryTrackName(name: string): Promise<any> {
        
        this.cache.forEach(track => {
            if(track.name == name){
                return track.id;
            }
        });
        const rp = require('request-promise');
        
        const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
        
        var options = {
        
            uri: BASE_URL + '/track.search',
            qs: {
                apikey: '1590d2f1e38d79145981ae0f60a2b78e',
                q_track: name,
            },
            json: true // Automatically parses the JSON string in the response
        };
        
          rp.get(
            options
        ).then((response) => {
            var header = response.message.header;
            var body = response.message.body;
            var trackId = body.track_list[0].track;
            
            this.cache.push( { name: trackId.track_name, id:trackId.track_id} );

            //this.tracks.push(new Track(trackId.track_id, trackId.track_name, 0, trackId.primary_genres, trackId.album_name));
            //console.log(body);
            if (header.status_code !== 200){
                throw new Error('status code != 200');
            }
            return trackId.track_id;
        }).catch((error) => {
            console.log('algo salio mal', error);
        });
        return rp();
      }
 

    queryTrackLyrics(track_id: string): Promise<any>{
        
           
        const rp = require('request-promise');
        
        const BASE_URL = 'http://api.musixmatch.com/ws/1.1';
        
        var options = {
        
            uri: BASE_URL + '/track.lyrics.get',
            qs: {
                apikey: '1590d2f1e38d79145981ae0f60a2b78e',
                track_id: track_id,
            },
            json: true // Automatically parses the JSON string in the response
        };
       
        rp.get(
            options
        ).then((response) => {
            const requestFile = require('request-promise');
            var header = response.message.header;
            var body = response.message.body;
            console.log(body);
            
           /* if (header.status_code !== 200){
                throw new Error('status code != 200');
            }*/
            
            return body.lyrics[0].lyrics_body;
            
        }).catch((error) => {
            console.log('algo salio mal', error);
        });
        return rp();
               
        
    }   
}
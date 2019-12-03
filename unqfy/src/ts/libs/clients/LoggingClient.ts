import Artist from '../Artist'
import Album from '../Album';


const BASE_URL = 'http://localhost:5002/api/';

export default class LoggingClient {

    private static createOptions(type: String, message : String, header : String){
        var options = {
            uri: BASE_URL + "/log",
            body: {
                type,
                message,
                header,
                date: new Date().toString()
            },
            json: true
        }; 
        return options;
    }
  
    static notifyAddArtist(type : String, message : String){
        const rp = require('request-promise');

        rp.post(this.createOptions(type, message, "Agregar Artista"))
            .then((response) => {
                console.log('Notificado servicio de logging para agregar artista')
        }).catch(error => {
            console.log('error'+ error.message)
        });
    }

    static notifyDeleteArtist(type : String, message : String){
        const rp = require('request-promise');

        rp.delete(this.createOptions(type, message, "Eliminar Artista"))
            .then((response) => {
                console.log('Notificado servicio de logging para eliminar artista')
        }).catch(error => {
            console.log('error'+ error.message)
        });
    }

    static notifyAddAlbum(artist: Artist, newAlbum: Album) {
        throw new Error("Method not implemented.");
      }
}
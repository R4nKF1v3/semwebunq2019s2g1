import Artist from '../Artist'
import Album from '../Album';
import { userInfo } from 'os';



const BASE_URL = 'http://localhost:5002/api/';

export default class LoggingClient {
    
    private static createOptions(tipo: String, msg : String, head : String){
        var dateFormat = require('date-format');
        var datestr = dateFormat('yyyy-MM-dd', new Date()); 
        var options = {
            uri: BASE_URL + "/log",
            body: {
                type: tipo,
                message: msg,
                header: head,
                date: datestr
            },
            json: true
        }; 
        console.log(options);
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

    static notifyAddAlbum(type : String, message : String){
        const rp = require('request-promise');

        rp.post(this.createOptions(type, message, "Agregar Album"))
            .then((response) => {
                console.log('Notificado servicio de logging para agregar album')
        }).catch(error => {
            console.log('error'+ error.message)
        });
      }
    
     static notifyDeleteAlbum(type : String, message : String){
        const rp = require('request-promise');

        rp.delete(this.createOptions(type, message, "Eliminar Album"))
            .then((response) => {
                console.log('Notificado servicio de logging para eliminar album')
        }).catch(error => {
            console.log('error'+ error.message)
        });
      }

      static notifyAddTrack(type : String, message : String){
        const rp = require('request-promise');

        rp.post(this.createOptions(type, message, "Agregar track"))
            .then((response) => {
                console.log('Notificado servicio de logging para agregar track')
        }).catch(error => {
            console.log('error'+ error.message)
        });
      }
      
      static notifyDeleteTrack(type : String, message : String){
        const rp = require('request-promise');

        rp.delete(this.createOptions(type, message, "Eliminar Track"))
            .then((response) => {
                console.log('Notificado servicio de logging para eliminar track')
        }).catch(error => {
            console.log('error'+ error.message)
        });
      }
}
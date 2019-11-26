import Artist from '../Artist'


const BASE_URL = 'http://localhost:puertoadefinir/api/notifications';

export default class LoggingClient {
    notifyAddArtist(artist: Artist){
        const rp = require('request-promise');

        var options = {
            uri: BASE_URL + '/addartist',
            qs: {
                q_id: artist.id,
                q_name: artist.getName(),
                q_nationality: artist.getCountry()
            },
            json: true // Automatically parses the JSON string in the response
        }; 

        rp.post(options)
            .then((response) => {
                console.log('notificado servicio de logging para agregar artista')
        }).catch(error => {
            console.log('error'+ error.message)
        });
       
    }
    
}
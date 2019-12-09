import LoggingModel from './LoggingModel';
import fs from 'fs';

export default class LogController{
    private logIsEnabled : boolean;
    
    handleLog(req, res){
        let loggingModel = new LoggingModel;
        
        if (this.checkAllFields(req)){    
            let cuerpo = req.body.type + ':' + req.body.message;
            loggingModel.writeLog(cuerpo);
            // todo - ultimo tarea de enviar el log a LOGGLY.
            res.status(200);
            res.json({message:'recibido'});
        } else {
            res.status(500);
            res.json({message:'campos invalidos'});
        }
        
    }
    
    private checkAllFields(req){
        //  return req.body.
        //adentro del body debo asegurar que tenga un json con type y message
        return (req.body.type && req.body.message) ;
    }
    
    //chequeo si existe el archivo y sino lo crea
    
    
    
    enableLog() {
        this.logIsEnabled = true;    
    }
    
    disableLog() {
        this.logIsEnabled = false;    
    }
    
    status() {
        if (this.logIsEnabled){
        console.log('logging enabled')
        } else {
            console.log('loggin disabled')
        }
    }
    
}
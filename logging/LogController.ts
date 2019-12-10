import LoggingModel from './LoggingModel';
import fs from 'fs';
import BadRequest from './exceptions/BadRequest';

export default class LogController{
    private logIsEnabled : boolean;
    
    handleLog(req, res){
        let loggingModel = new LoggingModel;
        console.log(req.body);   
        if (this.checkAllFields(req)){
            let header = req.body.header;
            let date = req.body.date;
            let type = req.body.type;
            let message =  req.body.message;
            loggingModel.writeLog(date, type, header,message);
            // todo - ultimo tarea de enviar el log a LOGGLY.
            res.status(200);
            res.json({message:'recibido'});
        } else {
            throw new BadRequest;
        }
        
    }
    
    private checkAllFields(req): boolean{

        return (req.body.type && req.body.message && req.body.date && req.body.header);
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
            console.log('logging enabled');
            return 'log habilitado';
        } else {
            console.log('loggin disabled');
            return 'log deshabilitado';
        }
    }
    
}
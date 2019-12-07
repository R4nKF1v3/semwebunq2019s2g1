import LoggingModel from './LoggingModel';
import fs from 'fs';

export default class LogController{
    private logIsEnabled : boolean;

    handleLog(req, res){
        let loggingModel = this.getModel();
        
        
        if (this.checkAllFields(req)){    
            let cuerpo = req.body.date + req.body.header + req.body.type + ':' + req.body.message;
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
   

    private getModel(filename = './data.json'): LoggingModel {
        let model = new LoggingModel;
        if (fs.existsSync(filename)) {
            model = LoggingModel.load(filename);
        }
        return model;
    }

    enableLog() {
        this.logIsEnabled = true;    
    }

    disableLog() {
        this.logIsEnabled = false;    
    }


}
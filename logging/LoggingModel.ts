
import fs = require('fs');
import UNQfyClient from './UNQfyClient';
import ElementNotFoundError from './exceptions/InternalServerError';
import InternalServerError from './exceptions/InternalServerError';

import { promisify } from 'util';



export default class LoggingModel{
    
    writeLog(cuerpo: string) {
        //const serializedData = picklify.picklify(this);
        const fs = require("fs");
        const util = require("util");

        const writeFile = util.promisify(fs.writeFile);
        writeFile("/tmp/logUNQ.txt", cuerpo)
        .then(() => console.log("file created successfully with promisify!"))
        //.then() aca podria encadenar con el servicio de logly

        .catch(error => console.log(error));        
    }
    /*prepareLogFile() {
        if (!this.logFileExists()){
            this.createLogFile(nombreArchivo);
        }       
        //aca habria que cargarlo en una variable para tenerlo listo

    }
    createLogFile(nombreArchivo: any) {
        throw new Error("Method not implemented.");
    }
    
    */
    
    //estas funciones son las que va a llamar el controller
    
    //funcion de escribir el archivo mencionado no implementado writelog
    //crear el archivo no implementado aun create LogFile 
    //verificar si existe el archivo , busca en un directorio si existe 
    //despues de creado el archivo, debo cargarlo en una variable , para poder
    //usar fs y poder escribir los logs
    

    

    save(filename : string) {
        
        fs.writeFileSync(filename, {encoding: 'utf-8'});
    }
    
    static load(filename : string) {
        const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
        const classes = [LoggingModel];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }

    private logFileExists(){
        //let loggingModel = this.getModel();
        var dateFormat = require('dateformat');
        let d = new Date();
        let logfile = dateFormat(d, 'yyyy-mm-dd') + 'archivo log';
          return this.existLogFile(logfile);
    }

    private existLogFile(logfile: string) {
        //existsSync recibe un string que es el path del archivo
        //ver si va el path absoluto
        try {
            if (fs.existsSync(logfile)) {
              //file exists
            }
          } catch(err) {
            console.error(err)
          }
    }

}
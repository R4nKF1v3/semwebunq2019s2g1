"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const picklify = require("picklify");
const fs = require("fs");
class LoggingModel {
    writeLog(cuerpo) {
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
    save(filename) {
        const serializedData = picklify.picklify(this);
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
    }
    static load(filename) {
        const serializedData = fs.readFileSync(filename, { encoding: 'utf-8' });
        const classes = [LoggingModel];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
    }
    logFileExists() {
        //let loggingModel = this.getModel();
        var dateFormat = require('dateformat');
        let d = new Date();
        let logfile = dateFormat(d, 'yyyy-mm-dd') + 'archivo log';
        return this.existLogFile(logfile);
    }
    existLogFile(logfile) {
        //existsSync recibe un string que es el path del archivo
        //ver si va el path absoluto
        try {
            if (fs.existsSync(logfile)) {
                //file exists
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}
exports.default = LoggingModel;

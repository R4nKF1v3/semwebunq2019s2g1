"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

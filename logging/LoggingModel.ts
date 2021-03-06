
import fs = require('fs');
import UNQfyClient from './UNQfyClient';
import ElementNotFoundError from './exceptions/InternalServerError';
import InternalServerError from './exceptions/InternalServerError';
import { promisify } from 'util';


var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token: "1cdaa479-aff8-49c3-a4e5-da9ca3354e17",
    subdomain: "ferblanco",
    tags: ["Winston-NodeJS"],
    json: true
}));

winston.log('info', "Hello World from Node.js!");

 


export default class LoggingModel{
    
    writeLog(date: string, type: string, header: string, message: string) {
        //const serializedData = picklify.picklify(this);
        const fs = require("fs");
        const util = require("util");
        const path = "/tmp/"
        const name = date + ".log"
        const writeFile = util.promisify(fs.writeFile);
        const log = date + "-" + type + "-" + "-" + header + "-" + message + '\n';
        writeFile(path + name, log,{flag: 'as'})
        .then(() => console.log("file created successfully with promisify!"))
        //.then() aca podria encadenar con el servicio de logly
        
        .catch(error => console.log(error));        
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
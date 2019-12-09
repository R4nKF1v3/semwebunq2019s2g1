"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingModel_1 = __importDefault(require("./LoggingModel"));
class LogController {
    handleLog(req, res) {
        let loggingModel = new LoggingModel_1.default;
        if (this.checkAllFields(req)) {
            let cuerpo = req.body.type + ':' + req.body.message;
            loggingModel.writeLog(cuerpo);
            // todo - ultimo tarea de enviar el log a LOGGLY.
            res.status(200);
            res.json({ message: 'recibido' });
        }
        else {
            res.status(500);
            res.json({ message: 'campos invalidos' });
        }
    }
    checkAllFields(req) {
        //  return req.body.
        //adentro del body debo asegurar que tenga un json con type y message
        return (req.body.type && req.body.message);
    }
    //chequeo si existe el archivo y sino lo crea
    enableLog() {
        this.logIsEnabled = true;
    }
    disableLog() {
        this.logIsEnabled = false;
    }
    status() {
        if (this.logIsEnabled) {
            console.log('logging enabled');
        }
        else {
            console.log('loggin disabled');
        }
    }
}
exports.default = LogController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingModel_1 = __importDefault(require("./LoggingModel"));
const fs_1 = __importDefault(require("fs"));
class LogController {
    handleLog(req, res) {
        let loggingModel = this.getModel();
        if (this.checkAllFields(req)) {
            let cuerpo = req.body.date + req.body.header + req.body.type + ':' + req.body.message;
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
    getModel(filename = './data.json') {
        let model = new LoggingModel_1.default;
        if (fs_1.default.existsSync(filename)) {
            model = LoggingModel_1.default.load(filename);
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
exports.default = LogController;

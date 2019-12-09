"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingModel_1 = __importDefault(require("./LoggingModel"));
const BadRequest_1 = __importDefault(require("./exceptions/BadRequest"));
class LogController {
    handleLog(req, res) {
        let loggingModel = new LoggingModel_1.default;
        console.log(req);
        if (this.checkAllFields(req)) {
            let header = req.body.header;
            let date = req.body.date;
            let type = req.body.type;
            let message = req.message;
            loggingModel.writeLog(date, type, header, message);
            // todo - ultimo tarea de enviar el log a LOGGLY.
            res.status(200);
            res.json({ message: 'recibido' });
        }
        else {
            throw new BadRequest_1.default;
        }
    }
    checkAllFields(req) {
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
        if (this.logIsEnabled) {
            console.log('logging enabled');
            return 'log habilitado';
        }
        else {
            console.log('loggin disabled');
            return 'log deshabilitado';
        }
    }
}
exports.default = LogController;

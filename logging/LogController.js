"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LogController {
    handleLog(req, res) {
        if (this.checkAllFields(req)) {
            let nombreArchivo = "[Date][Type]header";
            let cuerpo = "Type" + "Message";
            res.status(200);
            res.json({ message: 'recibido' });
        }
    }
    checkAllFields(req) {
        //  return req.body.
        return req.body.artistId && req.body.email;
    }
}
exports.default = LogController;

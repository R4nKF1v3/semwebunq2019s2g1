export default class LogController{
    handleLog(req, res){
        if (this.checkAllFields(req)){
            let nombreArchivo = "[Date][Type]header";
            let cuerpo = "Type" + "Message";
            res.status(200);
            res.json({message:'recibido'})
        }
    }

    private checkAllFields(req){
      //  return req.body.
      return req.body.artistId && req.body.email
    }
}
import express from 'express';
import bodyParser from 'body-parser';
import LogController from './LogController';
import ResourceNotFound from './exceptions/ResourceNotFound';
import APIError from './exceptions/APIError';

let port = process.env.PORT || 5002;

const logController = new LogController;
const app = express();

const router = express.Router();


router.route('/')
    .get((req,res)=>{
        res.status(200);
        res.json({ message :'hola mundo' });
    });

router.route('/log')
    .post((req,res)=>{
        console.log(req.body);
        logController.handleLog(req, res); 
    });

router.route('/enable')
    .get((req,res)=>{
        logController.enableLog(); 
        res.status(200);
        res.json({ message :'log habilitado' });
    });   

router.route('/disable')
    .get((req,res)=>{
        logController.disableLog(); 
        res.status(200);
        res.json({ message :'log deshabilitado' });
        
    });  

router.route('/status')
    .get((req,res)=>{
        var status = logController.status();
        res.status(200);
        res.json({ message : status});
    });  

router.route('/health-check/status')
    .get((req, res) => res.json({ status: "ok"}));


function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else {
        next(err);
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router);
/*app.all('*', (req, res) => {
    throw new ResourceNotFound;
})*/


//app.use(rootErrorHandler);

app.listen(port);

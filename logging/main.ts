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
        logController.handleLog(req, res); 
    });


function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else {
        next(err);
    }
}

app.use('/api/notifications', router);
app.all('*', (req, res) => {
    throw new ResourceNotFound;
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(rootErrorHandler);

app.listen(port);
import express from 'express';
import bodyParser from 'body-parser';
import NotificationController from './NotificationController';
import ResourceNotFound from './exceptions/ResourceNotFound';
import APIError from './exceptions/APIError';

let port = process.env.PORT || 7000;

const controller = new NotificationController;
const router = express.Router();

router.route('/subscribe')
    .post((req,res)=>{
        controller.handleSubscribe(req, res); 
    })

router.route('/unsubscribe')
    .post((req, res)=>{
        controller.handleUnsubscribe(req, res);
    });

router.route('/notify')
    .post((req, res)=>{
        controller.handleNotify(req, res);
    })

router.route('/subscriptions')
    .get((req, res)=>{
        controller.handleGetSubscriptions(req, res);
    })
    .delete((req, res)=>{
        controller.handleDeleteSubscriptions(req, res);
    });

function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    }else if (err.type === 'entity.parse.failed'){
        res.status(500);
        res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
     } else {
        next(err);
    }
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.all('*', (req, res) => {
    throw new ResourceNotFound;
});
app.use(rootErrorHandler);

app.listen(port);

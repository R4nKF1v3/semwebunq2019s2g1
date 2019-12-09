import express from 'express';
import bodyParser from 'body-parser';

import MonitorController from './MonitorController';
import MonitorService from './MonitorService';
import MonitoredApplication from './MonitoredApplication';
import SlackNotifier from './SlackNotifier';

import ResourceNotFound from './exceptions/ResourceNotFound';
import APIError from './exceptions/APIError';

let port = process.env.PORT || 5011;

const monitoredApplications: Array<MonitoredApplication> = [
    new MonitoredApplication("UNQfy", "http://localhost:5000/api/health-check/status"),
    new MonitoredApplication("notifications", "http://localhost:5001/api/health-check/status"),
    new MonitoredApplication("logging", "http://localhost:5002/api/health-check/status"),
];

const slackNotifier: SlackNotifier = new SlackNotifier();

const service = new MonitorService(monitoredApplications, slackNotifier);
const controller = new MonitorController(service);


const router = express.Router();

router.route('/monitor/status')
    .get( (req,res) => {
        controller.checkApplicationsStatus()
        .then( status => res.json(status) );
    })
;

router.route('/monitor/periodic-check/:state')
    .post( (req,res) => {
        if (req.params.state !== "enable" && req.params.state !== "disable") {
            res.status(400);
            return;
        }
        const state = req.params.state === "enable";
        let response = controller.turnOnOffPeriodicCheck(state);
        res.status(200);
        res.json(response);
    })
;


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
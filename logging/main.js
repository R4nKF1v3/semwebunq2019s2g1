"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const LogController_1 = __importDefault(require("./LogController"));
const APIError_1 = __importDefault(require("./exceptions/APIError"));
var winston = require('winston');
var { Loggly } = require('winston-loggly-bulk');
winston.add(new Loggly({
    token: "1cdaa479-aff8-49c3-a4e5-da9ca3354e17",
    subdomain: "ferblanco",
    tags: ["Winston-NodeJS"],
    json: true
}));
winston.log('info', "Hello World from Node.js!");
let port = process.env.PORT || 5002;
const logController = new LogController_1.default;
const app = express_1.default();
const router = express_1.default.Router();
router.route('/')
    .get((req, res) => {
    res.status(200);
    res.json({ message: 'hola mundo' });
});
router.route('/log')
    .post((req, res) => {
    console.log(req.body);
    winston.log(req.body.type, req.body.message);
    logController.handleLog(req, res);
    res.status(200);
});
router.route('/enable')
    .get((req, res) => {
    logController.enableLog();
    res.status(200);
    res.json({ message: 'log habilitado' });
});
router.route('/disable')
    .get((req, res) => {
    logController.disableLog();
    res.status(200);
    res.json({ message: 'log deshabilitado' });
});
router.route('/status')
    .get((req, res) => {
    var status = logController.status();
    res.status(200);
    res.json({ message: status });
});
router.route('/health-check/status')
    .get((req, res) => res.json({ status: "ok" }));
function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError_1.default) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    }
    else {
        next(err);
    }
}
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/api', router);
/*app.all('*', (req, res) => {
    throw new ResourceNotFound;
})*/
//app.use(rootErrorHandler);
app.listen(port);

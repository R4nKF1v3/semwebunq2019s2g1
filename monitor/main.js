"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const MonitorController_1 = __importDefault(require("./MonitorController"));
const MonitorService_1 = __importDefault(require("./MonitorService"));
const MonitoredApplication_1 = __importDefault(require("./MonitoredApplication"));
const SlackNotifier_1 = __importDefault(require("./SlackNotifier"));
const ResourceNotFound_1 = __importDefault(require("./exceptions/ResourceNotFound"));
const APIError_1 = __importDefault(require("./exceptions/APIError"));
let port = process.env.PORT || 5011;
const monitoredApplications = [
    new MonitoredApplication_1.default("mock-api", "https://mock-api.free.beeceptor.com/mock"),
];
const slackNotifier = new SlackNotifier_1.default();
const service = new MonitorService_1.default(monitoredApplications, slackNotifier);
const controller = new MonitorController_1.default(service);
const router = express_1.default.Router();
router.route('/monitor/status')
    .get((req, res) => {
    controller.checkApplicationsStatus()
        .then(status => res.json(status));
});
router.route('/monitor/periodic-check/:state')
    .post((req, res) => {
    if (req.params.state !== "enable" && req.params.state !== "disable") {
        res.status(400);
        return;
    }
    const state = req.params.state === "enable";
    let response = controller.turnOnOffPeriodicCheck(state);
    res.status(200);
    res.json(response);
});
function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError_1.default) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    }
    else if (err.type === 'entity.parse.failed') {
        res.status(500);
        res.json({ status: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
    }
    else {
        next(err);
    }
}
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/api', router);
app.all('*', (req, res) => {
    throw new ResourceNotFound_1.default;
});
app.use(rootErrorHandler);
app.listen(port);

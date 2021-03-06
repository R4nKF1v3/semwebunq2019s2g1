"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const NotificationController_1 = __importDefault(require("./NotificationController"));
const ResourceNotFound_1 = __importDefault(require("./exceptions/ResourceNotFound"));
const APIError_1 = __importDefault(require("./exceptions/APIError"));
let port = process.env.PORT || 5001;
const controller = new NotificationController_1.default;
const router = express_1.default.Router();
router.route('/subscribe')
    .post((req, res) => {
    controller.handleSubscribe(req, res);
});
router.route('/unsubscribe')
    .post((req, res) => {
    controller.handleUnsubscribe(req, res);
});
router.route('/notify')
    .post((req, res) => {
    controller.handleNotify(req, res);
});
router.route('/subscriptions')
    .get((req, res) => {
    controller.handleGetSubscriptions(req, res);
})
    .delete((req, res) => {
    controller.handleDeleteSubscriptions(req, res);
});
router.route('/health-check/status')
    .get((req, res) => res.json({ status: "ok" }));
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

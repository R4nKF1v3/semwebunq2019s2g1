"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const LogController_1 = __importDefault(require("./LogController"));
const ResourceNotFound_1 = __importDefault(require("./exceptions/ResourceNotFound"));
const APIError_1 = __importDefault(require("./exceptions/APIError"));
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
    logController.handleLog(req, res);
});
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
app.use('/api/notifications', router);
app.all('*', (req, res) => {
    throw new ResourceNotFound_1.default;
});
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(rootErrorHandler);
app.listen(port);

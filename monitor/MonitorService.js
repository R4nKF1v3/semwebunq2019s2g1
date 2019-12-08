"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MonitoredApplication_1 = __importDefault(require("./MonitoredApplication"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dateformat_1 = __importDefault(require("dateformat"));
class MonitorService {
    constructor(monitoredApplications, slackNotifier) {
        this.monitoredApplications = monitoredApplications;
        this.slackNotifier = slackNotifier;
        this.periodicChecker = new PeriodicChecker();
    }
    checkApplicationStatus() {
        let promises = [];
        this.monitoredApplications.forEach(app => {
            let appStatusPromise = node_fetch_1.default(app.statusUrl, {
                method: 'get'
            })
                .then((appResponse) => this.extractResponse(appResponse))
                .then((response) => {
                app.updateStatusWithResponse(response);
                return app;
            });
            promises.push(appStatusPromise);
        });
        return Promise.all(promises)
            .then(monitoredApps => {
            monitoredApps.forEach((monitoredApp) => {
                if (this.shouldSendOkNotificationsForApp(monitoredApp)) {
                    this.slackNotifier.sendNotification(`[${dateformat_1.default(new Date(), "isoDateTime")}] El servicio ${monitoredApp.name} ha vuelto a la normalidad`);
                }
                if (this.shouldSendErrorNotificationsForApp(monitoredApp)) {
                    this.slackNotifier.sendNotification(`[${dateformat_1.default(new Date(), "isoDateTime")}] El servicio ${monitoredApp.name} ha dejado de funcionar`);
                }
            });
            return monitoredApps.map(mApp => {
                return {
                    name: mApp.name,
                    status: mApp.currentStatus
                };
            });
        });
    }
    turnOnOffPeriodicCheck(activate) {
        if (activate)
            this.periodicChecker.activate(this);
        else
            this.periodicChecker.deactivate();
        return { "status": this.periodicChecker.isActive };
    }
    extractResponse(response) {
        return new Promise((resolve, reject) => {
            response.json()
                .then(body => {
                resolve({
                    status: response.status,
                    body: body
                });
            })
                .catch(error => reject(error));
        });
    }
    shouldSendOkNotificationsForApp(monitoredApp) {
        return monitoredApp.previousStatus == MonitoredApplication_1.default.ERROR &&
            monitoredApp.currentStatus == MonitoredApplication_1.default.NORMAL;
    }
    shouldSendErrorNotificationsForApp(monitoredApp) {
        return monitoredApp.previousStatus == MonitoredApplication_1.default.NORMAL &&
            monitoredApp.currentStatus == MonitoredApplication_1.default.ERROR;
    }
}
exports.default = MonitorService;
class PeriodicChecker {
    constructor() {
        this._isActive = false;
        this.interval = null;
    }
    get isActive() { return this._isActive; }
    activate(service) {
        console.log("Activando checkeo periodico");
        if (this._isActive)
            return;
        this._isActive = true;
        this.interval = setInterval(() => {
            service.checkApplicationStatus()
                .catch(error => console.error("checkApplicationStatus error ejecutando pediodo de checkeo" + JSON.stringify(error)));
        }, 5000);
    }
    deactivate() {
        console.log("Desactivando checkeo periodico");
        if (!this._isActive)
            return;
        this._isActive = false;
        clearInterval(this.interval);
    }
}

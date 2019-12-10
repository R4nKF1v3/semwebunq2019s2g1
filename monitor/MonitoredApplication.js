"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonitoredApplication {
    constructor(appName, statusUrl) {
        this.name = appName;
        this.statusUrl = statusUrl;
        this.currentStatus = MonitoredApplication.NORMAL;
        this.previousStatus = MonitoredApplication.NORMAL;
    }
    static get NORMAL() { return "NORMAL"; }
    static get ERROR() { return "ERROR"; }
    updateStatusWithResponse(appResponse) {
        const STATUS_OK = appResponse.status == 200;
        const BODY_OK = appResponse.body != null && ("" + appResponse.body.status).toLowerCase() === 'ok';
        this.previousStatus = this.currentStatus;
        this.currentStatus = STATUS_OK && BODY_OK ? MonitoredApplication.NORMAL : MonitoredApplication.ERROR;
        return this.currentStatus;
    }
    isWorking() {
        return this.currentStatus === MonitoredApplication.NORMAL;
    }
}
exports.default = MonitoredApplication;

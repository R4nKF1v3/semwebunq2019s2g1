class MonitoredApplication {

    readonly name: string;
    readonly statusUrl: string;
    currentStatus: string;
    previousStatus: string;
    static get NORMAL() { return "NORMAL" }
    static get ERROR() { return "ERROR" }

    constructor(appName: string, statusUrl: string) {
        this.name = appName;
        this.statusUrl = statusUrl;

        this.currentStatus = MonitoredApplication.ERROR;
        this.previousStatus = MonitoredApplication.NORMAL;
    }

    updateStatusWithResponse(appResponse): any {
        const STATUS_OK = appResponse.status == 200;
        const BODY_OK = ("" + appResponse.body.status).toLowerCase() === 'ok';

        this.previousStatus = this.currentStatus;
        this.currentStatus = STATUS_OK && BODY_OK ? MonitoredApplication.NORMAL : MonitoredApplication.ERROR;
        return this.currentStatus;
    }

    isWorking() {
        return this.currentStatus === MonitoredApplication.NORMAL;
    }

}

export default MonitoredApplication;
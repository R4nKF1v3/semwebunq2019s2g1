import MonitoredApplication from './MonitoredApplication';
import SlackNotifier from './SlackNotifier';
import fetch from 'node-fetch';
import dateFormat from 'dateformat';

class MonitorService {

    private monitoredApplications: Array<MonitoredApplication>;
    private slackNotifier: SlackNotifier;
    private periodicChecker: any;

    constructor(monitoredApplications: Array<MonitoredApplication>, slackNotifier: SlackNotifier) {
        this.monitoredApplications = monitoredApplications;
        this.slackNotifier = slackNotifier;
        this.periodicChecker = new PeriodicChecker();
    }

    checkApplicationStatus() {
        let promises = [];
        this.monitoredApplications.forEach( app => {
            
            let appStatusPromise = fetch(app.statusUrl, {
                method: 'get'
            })
                .then( (appResponse: Response) => this.extractResponse(appResponse) )
                .then( (response: any) => {
                    app.updateStatusWithResponse(response)
                    return app;
                });

            promises.push(appStatusPromise);
        });

        return Promise.all(promises)
            .then( monitoredApps => {
                monitoredApps.forEach( (monitoredApp: MonitoredApplication) => {
                    if (this.shouldSendOkNotificationsForApp(monitoredApp)) {
                        this.slackNotifier.sendNotification(
                            `[${dateFormat(new Date(), "isoDateTime")}] El servicio ${monitoredApp.name} ha vuelto a la normalidad`
                        );
                    }
                    if (this.shouldSendErrorNotificationsForApp(monitoredApp)) {
                        this.slackNotifier.sendNotification(
                            `[${dateFormat(new Date(), "isoDateTime")}] El servicio ${monitoredApp.name} ha dejado de funcionar`
                        );
                    }
                })
                return monitoredApps.map( mApp => {
                    return {
                        name: mApp.name,
                        status: mApp.currentStatus
                    };
                });
            } );
    }

    turnOnOffPeriodicCheck(activate: boolean) {
        if (activate) 
            this.periodicChecker.activate(this)
        else 
            this.periodicChecker.deactivate()
        return { "status": this.periodicChecker.isActive ? "active" : "disabled" }
    }

    private extractResponse(response: Response) {
        return new Promise( (resolve,reject) => {
            response.json()
                .then ( body => {
                    resolve({ 
                        status: response.status,
                        body: body 
                    });
                })
                .catch( error => reject(error) )
        });
    }

    private shouldSendOkNotificationsForApp(monitoredApp: MonitoredApplication): boolean{
        return monitoredApp.previousStatus == MonitoredApplication.ERROR && 
            monitoredApp.currentStatus == MonitoredApplication.NORMAL;
    }
    
    private shouldSendErrorNotificationsForApp(monitoredApp: MonitoredApplication): boolean {
        return monitoredApp.previousStatus == MonitoredApplication.NORMAL && 
            monitoredApp.currentStatus == MonitoredApplication.ERROR;
    }

}

export default MonitorService;

class PeriodicChecker {
    private _isActive: boolean;
    private interval: any;

    get isActive(): boolean { return this._isActive; }

    constructor() {
        this._isActive = false;
        this.interval = null;
    }

    activate(service: MonitorService) {
        console.log("Activando checkeo periodico");
        if (this._isActive) 
            return;
        this._isActive = true;
        this.interval = setInterval( () => {
            service.checkApplicationStatus()
                .catch( error => console.error("checkApplicationStatus error ejecutando pediodo de checkeo" + JSON.stringify(error)) );
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
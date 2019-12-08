import MonitorService from './MonitorService';

class MonitorController {

    private monitorService: MonitorService;

    constructor(monitorService: MonitorService) {
        this.monitorService = monitorService;
    }

    /** Retorna un objeto que describe cada uno de los servicios monitoreados.
     * @returns objeto que representa el estado de todos los servicios monitoreados
     */
    checkApplicationsStatus() {
        return this.monitorService.checkApplicationStatus();
    }

    /** Dado un nuevo estado activa o desactiva el monitoreo periodico.
     * @param newState: true o false
     * @returns el nuevo estado del monitor
     */
    turnOnOffPeriodicCheck(newState: boolean) {
        return this.monitorService.turnOnOffPeriodicCheck(newState);
    }

}

export default MonitorController;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonitorController {
    constructor(monitorService) {
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
    turnOnOffPeriodicCheck(newState) {
        return this.monitorService.turnOnOffPeriodicCheck(newState);
    }
}
exports.default = MonitorController;

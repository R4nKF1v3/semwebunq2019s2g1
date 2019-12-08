"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InsufficientParametersError extends Error {
    constructor(caseType) {
        super(`Insufficient parameters for command ${caseType}`);
        this.name = "InsufficientParametersError";
    }
}
exports.default = InsufficientParametersError;

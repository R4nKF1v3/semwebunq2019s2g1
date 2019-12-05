"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./APIError"));
class InternalServerError extends APIError_1.default {
    constructor() {
        super('InternalServerError', 500, 'INTERNAL_SERVER_ERROR');
    }
}
exports.default = InternalServerError;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./APIError"));
class BadRequest extends APIError_1.default {
    constructor() {
        super('BadRequest', 400, 'BAD_REQUEST');
    }
}
exports.default = BadRequest;

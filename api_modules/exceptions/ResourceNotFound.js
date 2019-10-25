"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./APIError"));
class ResourceNotFound extends APIError_1.default {
    constructor() {
        super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND');
    }
}
exports.default = ResourceNotFound;

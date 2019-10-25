"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./APIError"));
class ResourceAlreadyExists extends APIError_1.default {
    constructor() {
        super('ResourceAlreadyExists', 409, 'RESOURCE_ALREADY_EXISTS');
    }
}
exports.default = ResourceAlreadyExists;

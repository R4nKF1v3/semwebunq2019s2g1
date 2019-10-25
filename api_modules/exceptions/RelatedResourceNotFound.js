"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("./APIError"));
class RelatedResourceNotFound extends APIError_1.default {
    constructor() {
        super('RelatedResourceNotFound', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}
exports.default = RelatedResourceNotFound;

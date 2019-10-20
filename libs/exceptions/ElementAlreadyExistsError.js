"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementAlreadyExistsError extends Error {
    constructor(element) {
        super(`${element} already exists!`);
        this.name = "ElementAlreadyExistsError";
    }
}
exports.default = ElementAlreadyExistsError;

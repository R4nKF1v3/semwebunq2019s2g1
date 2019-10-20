"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementNotFoundError extends Error {
    constructor(element = "Element not found!") {
        super(element);
        this.name = "ElementNotFoundError";
    }
}
exports.default = ElementNotFoundError;

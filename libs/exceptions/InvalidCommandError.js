"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidCommandError extends Error {
    constructor(command) {
        super(`'${command}' is not a valid command `);
        this.name = "InvalidCommandError";
    }
}
exports.default = InvalidCommandError;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs")); // necesitado para guardar/cargar unqfy
const unqmod = require('../../libs/unqfy');
class Controller {
    getUNQfy(filename = './data.json') {
        let unqfy = new unqmod.UNQfy();
        if (fs_1.default.existsSync(filename)) {
            unqfy = unqmod.UNQfy.load(filename);
        }
        return unqfy;
    }
    saveUNQfy(unqfy, filename = './data.json') {
        unqfy.save(filename);
    }
    isEmptyString(value) {
        const result = false ||
            value == null ||
            typeof value != 'string' ||
            value == '';
        return result;
    }
    isEmptyArray(value) {
        const result = false ||
            value == null ||
            !Array.isArray(value) ||
            value.length == 0;
        return result;
    }
    isPositiveNumber(value) {
        const result = false ||
            !isNaN(value) &&
                value >= 0;
        return result;
    }
}
exports.default = Controller;

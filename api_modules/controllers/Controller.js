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
}
exports.default = Controller;

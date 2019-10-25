import fs from 'fs'; // necesitado para guardar/cargar unqfy

import UNQfy from '../../libs/unqfy';
const unqmod = require('../../libs/unqfy');

export default class Controller{

    getUNQfy(filename = './data.json'): UNQfy {
        let unqfy = new unqmod.UNQfy();
        if (fs.existsSync(filename)) {
            unqfy = unqmod.UNQfy.load(filename);
        }
        return unqfy;
    }
    
    saveUNQfy(unqfy, filename = './data.json') {
        unqfy.save(filename);
    }

}


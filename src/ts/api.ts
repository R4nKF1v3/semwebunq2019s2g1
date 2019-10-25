import ElementAreadyExistsError from './libs/exceptions/ElementAlreadyExistsError';
import ElementNotFoundError from './libs/exceptions/ElementNotFoundError';
import APIError from './api_modules/exceptions/APIError';
import ResourceNotFound from './api_modules/exceptions/ResourceNotFound';
import RelatedResourceNotFound from './api_modules/exceptions/RelatedResourceNotFound';
import BadRequest from './api_modules/exceptions/BadRequest';
import ResourceAlreadyExists from './api_modules/exceptions/ResourceAlreadyExists';
import InternalServerError from './api_modules/exceptions/InternalServerError';

import fs from 'fs'; // necesitado para guardar/cargar unqfy
const unqmod = require('./libs/unqfy');

function getUNQfy(filename = './data.json') : UNQfy {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
        unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
};

function saveUNQfy(unqfy, filename = './data.json') {
    unqfy.save(filename);
};

import express from 'express';
import bodyParser from 'body-parser';
import UNQfy from './libs/unqfy';

let port = process.env.PORT || 8080;

const rootApp = express();

// Routing module for /artists
const artists = express();
artists.use(bodyParser.urlencoded({ extended: true }));
artists.use(bodyParser.json());

artists.route( '/artists')
    .get((req, res) => {
        try {
            if (req.query.name){
                const unqfy: UNQfy = getUNQfy();
                const results = unqfy.searchArtistsByName(req.query.name);
                res.json(results);
                res.status(200);
            } else {
                const unqfy: UNQfy = getUNQfy();
                const results = unqfy.getAllArtists();
                res.json(results);
                res.status(200);
            }
        } catch(e) {
            throw new InternalServerError;
        }
    })
    .post((req, res) => {
        if (req.body.name && req.body.country){
            try {
                const unqfy : UNQfy = getUNQfy();
                const artist = unqfy.addArtist({name: req.body.name, country: req.body.country});
                saveUNQfy(unqfy);
                res.json(artist.toJSON());
                res.status(201);
            } catch(e){
                if (e instanceof ElementAreadyExistsError){
                    throw new ResourceAlreadyExists;
                } else {
                    throw new InternalServerError;
                }
            }
        } else {
            throw new BadRequest;
        }    
    });

artists.route('/artists/:artistId')
    .get((req, res) => {
        try {
            const unqfy : UNQfy = getUNQfy();
            const artist = unqfy.getArtistById(req.params.artistId);
            res.json(artist.toJSON());
            res.status(200);
        } catch(e) {
            if (e instanceof ElementNotFoundError){
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    })
    .patch((req, res) => {
        if (req.body.name && req.body.country){
            try {
                const unqfy : UNQfy = getUNQfy();
                const artist = unqfy.getArtistById(req.params.artistId);
                artist.changeParameters(req.body.name, req.body.country);
                saveUNQfy(unqfy);
                res.json(artist.toJSON());
                res.status(201);
            } catch(e){
                if (e instanceof ElementAreadyExistsError){
                    throw new ResourceAlreadyExists;
                } else if (e instanceof ElementNotFoundError){
                    throw new ResourceNotFound;
                } else {
                    throw new InternalServerError;
                }
            }
        } else {
            throw new BadRequest;
        }  
    })
    .delete((req, res) => {
        try {
            const unqfy : UNQfy = getUNQfy();
            unqfy.deleteArtist(req.params.artistId);
            res.status(204);
        } catch(e) {
            if (e instanceof ElementNotFoundError){
                throw new ResourceNotFound;
            } else {
                throw new InternalServerError;
            }
        }
    });

function artistErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'INVALID_JSON'});
    } else {
        next(err);
    }
}

artists.use(artistErrorHandler);

// Routing module for /albums
const albums = express();

albums.use(bodyParser.urlencoded({ extended: true }));
albums.use(bodyParser.json());

albums.route( '/albums')
    .get((req, res) => {
        if (req.query.name){
            try{
                const unqfy: UNQfy = getUNQfy();
                const results = unqfy.searchAlbumsByName(req.query.name);
                res.json({results});
                res.status(200);
            } catch(e){
                throw new InternalServerError;
            }
        }
        else
            throw new ResourceNotFound();
    })
    .post((req, res) => {
        res.json({ message: "Hiciste un post a /api/albums"})        
    });
    
    albums.route('/albums/:albumsId')
    .get((req, res) => {
        res.json({ message: "Hiciste un get a /api/albums/id"})
    })
    .patch((req, res) => {
        res.json({ message: "Hiciste un patch a /api/albums/id"})
    })
    .delete((req, res) => {
        res.json({ message: "Hiciste un delete a /api/albums/id"})
    });
    
    
    // Routing module for /tracks
const tracks = express();

tracks.use(bodyParser.urlencoded({ extended: true }));
tracks.use(bodyParser.json());
    
tracks.route('/tracks/:trackId/lyrics')
    .get((req, res) => {
        res.json({ message: "Hiciste un get a /api/tracks/<trackId>/lyrics"})
    });
    
    
// Routing module for /playlists
const playlists = express();

playlists.use(bodyParser.urlencoded({ extended: true }));
playlists.use(bodyParser.json());

playlists.route('/playlists')
    .get((req, res) => {
        res.json({ message: "Hiciste un get a /api/playlists"})
    })
    .post((req, res) => {
        res.json({ message: "Hiciste un post a /api/playlists"})        
    });

playlists.route('/playlists/:playlistsId')
    .get((req, res) => {
        res.json({ message: "Hiciste un get a /api/playlists/id"})
    })
    .post((req, res) => {
        res.json({ message: "Hiciste un patch a /api/playlists/id"})
    })
    .delete((req, res) => {
        res.json({ message: "Hiciste un delete a /api/playlists/id"})
    });
    

// Routing module for /users
/* Pendiente de implementación */
const users = express();

users.use(bodyParser.urlencoded({ extended: true }));
users.use(bodyParser.json());

function rootErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof ResourceNotFound){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else {
        next(err);
    }
}
rootApp.use('/api', artists, albums, tracks, playlists, users,);
rootApp.all('*', (req, res) => {
    throw new ResourceNotFound;
})
rootApp.use(rootErrorHandler);

rootApp.listen(port);
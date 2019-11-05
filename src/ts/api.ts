import APIError from './api_modules/exceptions/APIError';
import ResourceNotFound from './api_modules/exceptions/ResourceNotFound';
import ArtistController from './api_modules/controllers/ArtistController';
import AlbumController from './api_modules/controllers/AlbumController';
import TrackController from './api_modules/controllers/TrackController';
import PlaylistController from './api_modules/controllers/PlaylistController';
import UserController from './api_modules/controllers/UserController';

import express from 'express';
import bodyParser from 'body-parser';

let port = process.env.PORT || 7000;

const rootApp = express();


// Routing module for /artists
const artists = express();
artists.use(bodyParser.urlencoded({ extended: true }));
artists.use(bodyParser.json());

const artistController = new ArtistController;

artists.route( '/artists')
    .get((req, res) => {
        artistController.handleGetArtists(req, res);
    })
    .post((req, res) => {
        artistController.handleNewArtist(req, res);  
    });

artists.route('/artists/:artistId')
    .get((req, res) => {
        artistController.handleGetArtistId(req, res);
    })
    .put((req, res) => {
        artistController.handleUpdateArtist(req, res);
    })
    .delete((req, res) => {
        artistController.handleDeleteArtist(req, res);
    });

function artistErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
        next(err);
    }
}

artists.use(artistErrorHandler);

// Routing module for /albums
const albums = express();

albums.use(bodyParser.urlencoded({ extended: true }));
albums.use(bodyParser.json());

const albumController = new AlbumController();

albums.route( '/albums/:id')
    .get((req, res) => {
        albumController.handleGetAlbumById(req,res)
    })
    .patch((req, res) => {
        albumController.handleUpdateAlbumById(req,res)
    })
    .delete((req, res) => {
        albumController.handleDeleteAlbumById(req,res)
    });

albums.route( '/albums/')
    .get((req, res) => {
        albumController.handleGetAlbums(req,res)
    })
    .post((req, res) => {
        albumController.handleNewAlbum(req,res)
    });


function albumsErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
        next(err);
    }
}

albums.use(albumsErrorHandler);
    
// Routing module for /tracks
const tracks = express();

tracks.use(bodyParser.urlencoded({ extended: true }));
tracks.use(bodyParser.json());

const trackController = new TrackController();
    
tracks.route('/tracks/:trackId/lyrics')
    .get((req, res) => {
        trackController.handleGetTrackLyricsByTrackId(req,res)
    });

function tracksErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
        next(err);
    }
}

tracks.use(tracksErrorHandler);
    
// Routing module for /playlists
const playlists = express();

playlists.use(bodyParser.urlencoded({ extended: true }));
playlists.use(bodyParser.json());

const playlistController = new PlaylistController();

playlists.route('/playlists')
    .post((req, res) => {
        playlistController.handleNewPlaylist(req,res);
    })
    .get((req, res) => {
        playlistController.handleQueryPlaylists(req,res)
    })
;

playlists.route('/playlists/:playlistsId')
    .get((req, res) => {
        playlistController.handleGetPlaylistById(req,res)
    })
    .delete((req, res) => {
        playlistController.handleDeletePlaylistById(req,res)
    });


function playlistsErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
        next(err);
    }
}

tracks.use(playlistsErrorHandler);

// Routing module for /users
/* Pendiente de implementación */
const users = express();

users.use(bodyParser.urlencoded({ extended: true }));
users.use(bodyParser.json());

const userController = new UserController();

users.route('/users/:userId')
    .get((req, res) => {
        res.json(userController.handleGetUserById(req,res));
    })
    .delete((req,res) => {
        res.json(userController.handleDeleteUserById(req,res));
    });

users.route('/users/')
    .post((req, res) => {
        res.json(userController.handleNewUser(req,res));
    });

users.route('/users/:userId/listening/')
    .post((req, res) => {
        res.json(userController.handleNewUserListening(req,res));
    });


function usersErrorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
        next(err);
    }
}

users.use(usersErrorHandler);

// Routing module for root
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
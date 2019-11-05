import fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./libs/unqfy'); // importamos el modulo unqfy
import process = require('process');
import UNQfy from './libs/unqfy';
import InvalidCommandError from "./libs/exceptions/InvalidCommandError";
import InsufficientParametersError from "./libs/exceptions/InsufficientParametersError";

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

function main() {
  const args = process.argv;
  const unqfy = getUNQfy();
  try {
    const returnStatement = executeWith(unqfy, args[2], args.slice(3, args.length));
    if (returnStatement){
      Object.entries(returnStatement).forEach(entry => {
        console.log(entry[0] + ": " + JSON.stringify(entry[1]));
      });
    }
    saveUNQfy(unqfy);
  } catch (e){
    console.log(e.message);
  }
}

  //Switch que ejecuta los comandos dependiendo del término
function executeWith(unqfy: UNQfy,command: string, args: Array<string>): any{
  switch (command) {
    case "createUser":
      checkParametersLength(args, 1, "createUser");
      return unqfy.createUser(args[0])
    case "getUser":
      checkParametersLength(args, 1, "getUser");
      return unqfy.getUserById(args[0])
    case "deleteUser":
      checkParametersLength(args, 1, "deleteUser");
      return unqfy.deleteUser(args[0])
    case "userListenTo":
      checkParametersLength(args, 2, "userListenTo");
      return unqfy.userListenTo(args[0], args[1])
    case "userTrackHistory":
      checkParametersLength(args, 1, "userTrackHistory");
      return unqfy.getTracksListenedBy(args[0])
    case "userTimesListenedTo":
      checkParametersLength(args, 2, "userTimesListenedTo");
      return unqfy.getTimesTrackListenedBy(args[0], args[1])
    case "getArtistMostListened":
      checkParametersLength(args, 1, "getArtistMostListened");
      return unqfy.getArtistMostListenedTracks(args[0])
    case "addArtist":
      checkParametersLength(args, 2, "addArtist");
      return unqfy.addArtist({name: args[0], country: args[1]});
    case "addAlbum":
      checkParametersLength(args, 3, "addAlbum");
      return unqfy.addAlbum(parseInt(args[0]), {name: args[1], year: args[2]});
    case "addTrack":
      checkParametersLength(args, 4, "addTrack");
      return unqfy.addTrack(parseInt(args[0]), {name: args[1], duration: args[2], genres: args.slice(3, args.length)});
    case "getArtist":
      checkParametersLength(args, 1, "getArtist");
      return unqfy.getArtistById(args[0]);
    case "getAlbum":
      checkParametersLength(args, 1, "getAlbum");
      return unqfy.getAlbumById(args[0]);
    case "getTrack":
      checkParametersLength(args, 1, "getTrack");
      return unqfy.getTrackById(args[0]);
    case "getPlaylist":
      checkParametersLength(args, 1, "getPlaylist");
      return unqfy.getPlaylistById(args[0]);
    case "deleteArtist":
      checkParametersLength(args, 1, "deleteArtist");
      return unqfy.deleteArtist(args[0]);
    case "deleteAlbum":
      checkParametersLength(args, 1, "deleteAlbum");
      return unqfy.deleteAlbum(args[0]);
    case "deleteTrack":
      checkParametersLength(args, 1, "deleteTrack");
      return unqfy.deleteTrack(args[0]);
    case "deletePlaylist":
      checkParametersLength(args, 1, "deletePlaylist");
      return unqfy.deletePlaylist(args[0]);
    case "getTracksFromArtist":
      checkParametersLength(args, 1, "getTracksFromArtist");
      return unqfy.getTracksMatchingArtist(args[0]);
    case "getTracksMatchingGenres":
      checkParametersLength(args, 1, "getTracksMatchingGenres");
      return unqfy.getTracksMatchingGenres(args.slice(0, args.length));
    case "searchByName":
      checkParametersLength(args, 1, "searchByName");
      return unqfy.searchByName(args[0]);
    case "addPlaylist":
      checkParametersLength(args, 3, "addPlaylist");
      const params = {name: args[0], duration: parseInt(args[1]), genres: args.slice(2, args.length)};
      return unqfy.createPlaylist(params.name, params.genres, params.duration);
    case "listPlaylist":
      checkParametersLength(args, 1, "listPlaylist");
      return unqfy.listPlaylist(parseInt(args[0]))
    case "listArtist":
      checkParametersLength(args, 1, "listArtist");
      return unqfy.listArtist(parseInt(args[0]))
    case "listAlbum":
      checkParametersLength(args, 1, "listAlbum");
      return unqfy.listAlbum(parseInt(args[0]))
    case "listTrack":
      checkParametersLength(args, 1, "listTrack");
      return unqfy.listTrack(parseInt(args[0]))
    case "getAlbumsForArtist":
      checkParametersLength(args, 1, "getAlbumsForArtist");
      return unqfy.getAlbumsForArtist(args[0]);
    case "populateAlbumsForArtist":
      checkParametersLength(args, 1, "populateAlbumsForArtist");
      unqfy.populateAlbumsForArtist(args[0])
        .then(res => {
          console.log(res);
          saveUNQfy(unqfy);
        });
    case "getLyricsForTrack":
      checkParametersLength(args, 1, "getLyricsForTrack");
      unqfy.getLyricsFor(parseInt(args[0]))
        .then(res => {
          console.log(res);
          saveUNQfy(unqfy);
        });
    default:
      throw new InvalidCommandError(command);
  }
}

function asyncCall(returnStatement: any, unqfy: UNQfy){
  console.log(returnStatement);
  saveUNQfy(unqfy);
}

function checkParametersLength(parameters: Array<string>, length: number, caseType: string){
  if (parameters.length < length){
    throw new InsufficientParametersError(caseType);
  }
}

main();

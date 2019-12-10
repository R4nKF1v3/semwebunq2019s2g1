import Track from "./Track";
import Artist from "./Artist";
import ElementAlreadyExistsError from "./exceptions/ElementAlreadyExistsError";
import LoggingClient from './clients/LoggingClient';

export default class Album{
  readonly id: number;
  readonly name: string;
  public year: number;
  private tracks: Array<Track>;
  
  constructor(id: number, name: string, year: number, artist: Artist) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];
  }

  addTrack(trackData: any, unqfy): Track {
    if (this.trackDoesNotExist(trackData)){
      const newTrack = new Track(unqfy.getNewTrackId(), trackData.name, Number.parseInt(trackData.duration), trackData.genres, this);
      this.tracks.push(newTrack);
      LoggingClient.notifyAddTrack( "info", "agregado nuevo track" + newTrack.name );
      return newTrack;
    } else {
      LoggingClient.notifyAddTrack( "error", "no se agrego nuevo track" + '"' + trackData.name +'"');

      throw new ElementAlreadyExistsError(`Track ${trackData.name} of ${this.name} with genres ${trackData.genres} and duration ${trackData.duration}`)
    }
    
  }

  private trackDoesNotExist(trackData: any): boolean{
    return !this.tracks.some(track => track.name === trackData.name && track.duration === trackData.duration && track.hasSameGenres(trackData.genres)) 
  }

  deleteTrack(trackToDelete: Track) {
    this.tracks = this.tracks.filter( track => track.id !== trackToDelete.id );
    LoggingClient.notifyDeleteTrack( "info", "eliminado track" );
  }

  getTracks(): Array<Track> {
    return this.tracks;
  }

  hasTrack(track: Track): boolean{
    return this.tracks.includes(track);
  }

  toJSON(){
    console.log("This are the tracks")
    console.log(this.tracks)
    console.log("For this album")
    console.log(this)
    let trackList = [];
    this.tracks.forEach(track => trackList.push(track.toJSON()));
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      tracks: trackList
    }
  }

  getName(){
    return this.name;
  }

}
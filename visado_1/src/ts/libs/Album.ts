import Track from "./Track";

export default class Album{
  readonly id: number;
  readonly name: string;
  readonly year: number;
  private tracks: Array<Track>;
  
  constructor(id: number, name: string, year: number) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.tracks = [];
  }

  addTrack(trackData: any, unqfy): Track {
    if (this.trackDoesNotExist(trackData)){
      const newTrack = new Track(unqfy.getNewTrackId(), trackData.name, trackData.duration, trackData.genres);
      this.tracks.push(newTrack);
      console.log(`Added new track to the list for album: ${this.name} with name: ${newTrack.name} with duration: ${newTrack.duration} with genres: ${newTrack.genres} with ID: ${newTrack.id}`)
      return newTrack;
    } else {
      throw new Error(`Track ${trackData.name} of ${this.name} with genres ${trackData.genres} and duration ${trackData.duration} already exists!`)
    }
    
  }

  private trackDoesNotExist(trackData: any): boolean{
    return this.tracks.find(track => track.name === trackData.name && track.duration === trackData.duration && track.hasSameGenres(trackData.genres)) == null    
  }

  deleteTrack(trackId: number) {
    this.tracks = this.tracks.filter( track => track.id !== trackId );
  }

  getTracks(): Array<Track> {
    return this.tracks;
  }

}
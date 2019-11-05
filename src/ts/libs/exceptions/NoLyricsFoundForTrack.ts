export default class NoLyricsFoundForTrack extends Error{
    constructor(trackName: string){
      super(`No lyrics found for '${trackName}' `);
      this.name = "NoLyricsFoundForTrack";
    }
  }
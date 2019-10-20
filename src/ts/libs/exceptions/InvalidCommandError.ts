export default class InvalidCommandError extends Error{
    constructor(command: string){
      super(`'${command}' is not a valid command `);
      this.name = "InvalidCommandError";
    }
  }
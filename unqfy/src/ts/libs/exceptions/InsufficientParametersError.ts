export default class InsufficientParametersError extends Error{
    constructor(caseType: string){
      super(`Insufficient parameters for command ${caseType}`);
      this.name = "InsufficientParametersError";
    }
  }
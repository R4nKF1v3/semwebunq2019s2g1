export default class ElementAlreadyExistsError extends Error{
    constructor(element: string){
      super(`${element} already exists!`);
      this.name = "ElementAlreadyExistsError";
    }
  }
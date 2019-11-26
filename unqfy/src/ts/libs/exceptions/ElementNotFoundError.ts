export default class ElementNotFoundError extends Error{
    constructor(element: string = "Element not found!"){
      super(element);
      this.name = "ElementNotFoundError";
    }
  }
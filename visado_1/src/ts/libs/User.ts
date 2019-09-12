export default class User{
  readonly id: number;
  readonly name: string;
  readonly history: Array<HistoryEvent>;

  constructor(id: number, name: string) {
    throw new Error("No implementado")
  }
}

class HistoryEvent {
  
  constructor() {
    throw new Error("No implementado")
  }
}
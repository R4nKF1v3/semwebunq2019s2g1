export default class APIError extends Error {
    readonly status : number;
    readonly errorCode : string;

    constructor(name: string, statusCode: number, errorCode: string, message = null) {
    super(message || name);
    this.name = name;
    this.status = statusCode;
    this.errorCode = errorCode;
    }
}
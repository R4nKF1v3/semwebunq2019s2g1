import APIError from './APIError';

export default class BadRequest extends APIError {
    constructor() {
    super('BadRequest', 400, 'BAD_REQUEST');
    }
}
import APIError from './APIError';

export default class InternalServerError extends APIError {
    constructor() {
    super('InternalServerError', 500, 'INTERNAL_SERVER_ERROR');
    }
}
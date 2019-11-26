import APIError from './APIError';

export default class ResourceAlreadyExists extends APIError {
    constructor() {
    super('ResourceAlreadyExists', 409, 'RESOURCE_ALREADY_EXISTS');
    }
}
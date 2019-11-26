import APIError from './APIError';

export default class ResourceNotFound extends APIError {
    constructor() {
    super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND');
    }
}
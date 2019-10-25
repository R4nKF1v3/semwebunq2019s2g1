class ResourceNotFound extends APIError {
    constructor() {
    super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND');
    }
}
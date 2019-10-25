class ResourceAlreadyExists extends APIError {
    constructor() {
        super('ResourceAlreadyExists', 409, 'RESOURCE_ALREADY_EXISTS');
    }
}

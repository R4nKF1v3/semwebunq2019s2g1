class RelatedResourceNotFound extends APIError {
    constructor() {
    super('RelatedResourceNotFound', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}
export default function commentRepositoriesApp(repository) {

    const storeResource = (payload) => repository.storeResource(payload);

    const updateResourceComment = (_id, payload) => repository.updateResource(_id, payload);

    const updateStatusResource = (_id, payload) => repository.updateStatusResource(_id, payload);

    const removeResourceComment = (_id) => repository.removeResource(_id)

    const findByID = (_id) => repository.findByID(_id)

    const findByQuery = (query) => repository.findByQuery(query)

    const findByIDAndUpdatePayload = (_id, payload) => repository.findByIDAndUpdatePayload(_id, payload)

    const getParentAndChildComment = (id, query) => repository.getParentAndChildComment(id, query)

    const getDataCommentByID = (id, params) => repository.getDataCommentByID(id, params)

    const getAllChildComment = (id) => repository.getAllChildComment(id)

    const checkExistsQuery = (query) => repository.checkExistsQuery(query)

    const countDocumentQuery = (query) => repository.countDocumentQuery(query)
    // const 

    return {
        storeResource,
        updateResourceComment,
        removeResourceComment,
        updateStatusResource,
        findByID,
        findByQuery,
        findByIDAndUpdatePayload,
        checkExistsQuery,
        getParentAndChildComment,
        getAllChildComment,
        getDataCommentByID,
        countDocumentQuery
    };
}

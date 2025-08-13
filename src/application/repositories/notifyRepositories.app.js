export default function notifyRepositoriesApp(repository) {
    const createNotify = (payload) => repository.createNotify(payload);

    const getAllNotify = (params) => repository.getAllNotify(params);

    const updateByPayload = (payload) => repository.updateByPayload(payload);

    const updateOneById = (_id,payload) => repository.updateOneById(_id,payload);

    const countDocumentByQuery = (query) => repository.countDocumentByQuery(query)

   
    return {
        createNotify,getAllNotify,updateByPayload,updateOneById,countDocumentByQuery
    };
}

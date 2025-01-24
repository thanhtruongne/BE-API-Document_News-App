export default function userRepositoriesApp(repository) {
    const findAll = (params) => repository.findAll(params);
    // const countAll = (params) => repository.countAll(params);
    const findByQuery = (query) => repository.findByQuery(query);
    const createData = (post) => repository.createData(post);
    // const updateById = (id,post) => repository.updateById(id, post);
    // const deleteById = (id) => repository.deleteById(id);
    const createKeyTokens = (payloadEntities) => repository.createKeyTokens(payloadEntities);

    const findUserKeyTokenID = (id) => repository.findUserKeyTokenID(id);
    return {
        findAll,
        // countAll,
        findByQuery,
        createData,
        // updateById,
        // deleteById,
        createKeyTokens,
        findUserKeyTokenID
    };
}

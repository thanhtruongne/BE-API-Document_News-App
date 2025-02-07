export default function userRepositoriesApp(repository) {
    const findAll = (params) => repository.findAll(params);
    const updateData = (payload,id) => repository.updateData(payload,id);
    const findByQuery = (query) => repository.findByQuery(query);
    const createData = (post) => repository.createData(post);
    const countData = (params) => repository.countData(params)
    // const updateById = (id,post) => repository.updateById(id, post);
    const deleteResource = (id) => repository.deleteResource(id);
    //for keyTokens model users
    const createKeyTokens = (payloadEntities) => repository.createKeyTokens(payloadEntities);
    const findUserKeyTokenID = (id) => repository.findUserKeyTokenID(id);
    const deleteKeyTokenID = (id) => repository.deleteKeyTokenID(id)
    const updateRefreshTokenUsed = async(refreshToken,tokens,_id) => await repository.updateRefreshTokenUsed(refreshToken,tokens,_id)

    return {
        findAll,
        updateData,
        findByQuery,
        createData,
        countData,
        deleteResource,
        // deleteById,
        createKeyTokens,
        findUserKeyTokenID,
        deleteKeyTokenID,
        updateRefreshTokenUsed
    };
}

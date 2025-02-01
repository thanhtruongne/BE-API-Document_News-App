export default function userRepositoriesApp(repository) {
    const findAll = (params) => repository.findAll(params);
    // const countAll = (params) => repository.countAll(params);
    const findByQuery = (query) => repository.findByQuery(query);
    const createData = (post) => repository.createData(post);
    const countData = (params) => repository.countData(params)
    // const updateById = (id,post) => repository.updateById(id, post);
    // const deleteById = (id) => repository.deleteById(id);
    //for keyTokens model users
    const createKeyTokens = (payloadEntities) => repository.createKeyTokens(payloadEntities);
    const findUserKeyTokenID = (id) => repository.findUserKeyTokenID(id);
    const deleteKeyTokenID = (id) => repository.deleteKeyTokenID(id)
    const updateRefreshTokenUsed = async(refreshToken,tokens,keyStore) => await repository.updateRefreshTokenUsed(refreshToken,tokens,keyStore)

    return {
        findAll,
        // countAll,
        findByQuery,
        createData,
        countData,
        // updateById,
        // deleteById,
        createKeyTokens,
        findUserKeyTokenID,
        deleteKeyTokenID,
        updateRefreshTokenUsed
    };
}

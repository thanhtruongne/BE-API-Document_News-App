export default function userRepositoriesApp(repository) {
    const findAll = (params) => repository.findAll(params);
    const updateData = (payload,id) => repository.updateData(payload,id);
    const findByQuery = (query,select,isLean) => repository.findByQuery(query,select,isLean);
    const createData = (post) => repository.createData(post);
    const countData = (params) => repository.countData(params);
    const deleteResource = (id) => repository.deleteResource(id);
    const findByID = (id,select,islean) => repository.findByID(id,select,islean);
    const updateDataByQuery = (id,query) => repository.updateDataByQuery(id,query);

    //for keyTokens model users
    const createKeyTokens = (payloadEntities) => repository.createKeyTokens(payloadEntities);
    const findUserKeyTokenID = (id) => repository.findUserKeyTokenID(id);
    const deleteKeyTokenID = (id) => repository.deleteKeyTokenID(id)
    const updateRefreshTokenUsed = async(refreshToken,tokens,_id) => await repository.updateRefreshTokenUsed(refreshToken,tokens,_id)



    const checkExistsField = (query) => repository.checkExistsField(query)

    return {
        findAll,
        updateData,
        findByQuery,
        createData,
        countData,
        deleteResource,
        findByID,
        updateDataByQuery,
        // deleteById,
        createKeyTokens,
        findUserKeyTokenID,
        deleteKeyTokenID,
        updateRefreshTokenUsed,
        checkExistsField
    };
}

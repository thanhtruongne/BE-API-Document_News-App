export default function authorRepositoriesApp(repository) {
    const createResourceAuthor = (payload) => repository.createResourceAuthor(payload);
    const countAllDataAuthor = (params) => repository.countAllDataAuthor(params)
    const getAllDataAuthor = (params) => repository.getAllDataAuthor(params)
    const getDetailDataAuthor = (id) => repository.findRoleAuthorByQueryID(id)


    //roleAuthor
    const createResourceRoleAuthor = (payload) =>  repository.createResourceRoleAuthor(payload);
    const findRoleAuthorByQuery = (query) =>  repository.findRoleAuthorByQuery(query);
    const getAllDataRoleAuthor = (params) =>  repository.getAllDataRoleAuthor(params);
    const countAllDataRoleAuthor = (params) =>  repository.countAllDataRoleAuthor(params);


    const changeStatus = (payload) => repository.changeStatus(payload)
    return {
        createResourceAuthor,
        createResourceRoleAuthor,
        getDetailDataAuthor,
        getAllDataAuthor,
        countAllDataAuthor,
        getAllDataRoleAuthor,
        countAllDataRoleAuthor,
        findRoleAuthorByQuery,
        changeStatus
    };
}

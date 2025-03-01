export default function authorRepositoriesApp(repository) {
    const createResourceAuthor = (payload) => repository.createResourceAuthor(payload);
    const countAllDataAuthor = (params) => repository.countAllDataAuthor(params)
    const getAllDataAuthor = (params) => repository.getAllDataAuthor(params)


    //roleAuthor
    const createResourceRoleAuthor = (payload) =>  repository.createResourceRoleAuthor(payload);
    const findRoleAuthorByQuery = (query) =>  repository.findRoleAuthorByQuery(query);
    const getAllDataRoleAuthor = (params) =>  repository.getAllDataRoleAuthor(params);
    const countAllDataRoleAuthor = (params) =>  repository.countAllDataRoleAuthor(params);

    return {
        createResourceAuthor,
        createResourceRoleAuthor,
        getAllDataAuthor,
        countAllDataAuthor,
        getAllDataRoleAuthor,
        countAllDataRoleAuthor,
        findRoleAuthorByQuery
    };
}

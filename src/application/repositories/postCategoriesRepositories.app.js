export default function postCategoriesRepositoriesapp(repository) {
    const createResource = (payload) => repository.createResource(payload);
    
    const findAll = (params) => repository.fetchAllData(params)

    const countAll = (params) => repository.fetchCountAll(params)

    const searchingData = (_id,status) => repository.changeStatus(_id,status)

    // const removeResource = (_id) => repository.removeResource(_id)

    // const findByQuery = (query) => repository.findByQuery(query)

    // const getDetailResource = (_id) => repository.getDetailResource(_id)

    return {
        createResource,
        findAll,
        countAll
        // getTreeData,
        // changeStatus,
        // removeResource,
        // findByQuery,
        // getDetailResource
    };
}

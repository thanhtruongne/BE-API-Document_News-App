export default function postCategoriesRepositoriesapp(repository) {
    const createResource = (payload) => repository.createResource(payload);
    
    const findAll = (params) => repository.fetchAllData(params)

    const countAll = (params) => repository.fetchCountAll(params)

    const findDetail = (payload) => repository.findDetail(payload)

    const findByID = (id) => repository.findById(id)

    const findByIDandUpdate = (_id,payload) => repository.findByIDandUpdate(_id,payload)

    // const removeResource = (_id) => repository.removeResource(_id)

    // const findByQuery = (query) => repository.findByQuery(query)

    // const getDetailResource = (_id) => repository.getDetailResource(_id)

    return {
        createResource,
        findAll,
        countAll,
        findDetail,
        findByID,
        findByIDandUpdate
        // getTreeData,
        // changeStatus,
        // removeResource,
        // findByQuery,
        // getDetailResource
    };
}

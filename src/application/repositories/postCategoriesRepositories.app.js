export default function postCategoriesRepositoriesapp(repository) {
    const createResource = (payload) => repository.createResource(payload);
    
    // const getTreeData = (parentID) => repository.fetchAllDataTree(parentID)

    // const changeStatus = (_id,status) => repository.changeStatus(_id,status)

    // const removeResource = (_id) => repository.removeResource(_id)

    // const findByQuery = (query) => repository.findByQuery(query)

    // const getDetailResource = (_id) => repository.getDetailResource(_id)

    return {
        createResource,
        // getTreeData,
        // changeStatus,
        // removeResource,
        // findByQuery,
        // getDetailResource
    };
}

export default function categoriesRepositoriesApp(repository) {
    const createResource = (payload) => repository.createResource(payload);

    const updateResource = (id,payload) => repository.updateResource(id,payload);
    
    const getTreeData = (parentID,query) => repository.fetchAllDataTree(parentID,query)

    const changeStatus = (_id,status) => repository.changeStatus(_id,status)

    const removeResource = (_id) => repository.removeResource(_id)

    const findByQuery = (query) => repository.findByQuery(query)

    const getDetailResource = (_id) => repository.getDetailResource(_id)

    const findByQueryAndUpdateMany = (query,payload) => repository.findByQueryAndUpdateMany(query,payload)
    
    const getParentTree = (parent_id) => repository.getParentTree(parent_id)
 
    return {
        createResource,
        updateResource,
        findByQueryAndUpdateMany,
        getTreeData,
        changeStatus,
        removeResource,
        findByQuery,
        getDetailResource,
        getParentTree
    };
}

export default function commentRepositoriesApp(repository) {
    
    const storeResource = (payload) => repository.storeResource(payload);
    
    const updateResourceComment = (_id,payload) => repository.updateResource(_id,payload);

    const updateStatusResource = (_id,payload) => repository.updateStatusResource(_id,payload);

    const removeResourceComment = (_id) => repository.removeResource(_id)

    const findByID = (_id) => repository.findByID(_id)

    const findByQuery = (query) => repository.findByQuery(query)

    return {
        storeResource,updateResourceComment,removeResourceComment,updateStatusResource,findByID,findByQuery
    };
}

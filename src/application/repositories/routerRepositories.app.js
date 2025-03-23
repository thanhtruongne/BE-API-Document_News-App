export default function routerRepositoriesApp(repository) {
    const createRouterResource = (payload) => repository.createData(payload);
    
    const updateRouterResource = (id,payload) => repository.updateData(id,payload);

    const findOneByQuery = (query) => repository.findOneByQuery(query);
    
    return {
        createRouterResource,updateRouterResource,findOneByQuery
    };
}

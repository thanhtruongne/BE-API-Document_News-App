export default function routerRepositoriesApp(repository) {
    const createRouterResource = (payload) => repository.createData(payload);
    
    const updateRouterResource = (id,payload) => repository.updateData(id,payload);
    
    return {
        createRouterResource,updateRouterResource
    };
}

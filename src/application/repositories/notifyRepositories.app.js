export default function notifyRepositoriesApp(repository) {
    const createResource = (payload) => repository.createResource(payload);
   
    return {
        createResource,
    };
}

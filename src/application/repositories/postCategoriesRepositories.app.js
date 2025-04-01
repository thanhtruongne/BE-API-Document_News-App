export default function postCategoriesRepositoriesapp(repository) {
    const createResource = (payload) => repository.createResource(payload);
    
    const findAll = (params) => repository.fetchAllData(params)

    const countAll = (params) => repository.fetchCountAll(params)

    const findDetail = (payload) => repository.findDetail(payload)

    const findByID = (id) => repository.findById(id)

    const findByIdNoneLean = (id) => repository.findByIdNoneLean(id)

    const findByIDandUpdate = (_id,payload) => repository.findByIDandUpdate(_id,payload)

    const findByIDandUpdatePayload = (_id,payload) => repository.findByIDandUpdatePayload(_id,payload)

    //FE
    const findByQuery = (query) => repository.findByQuery(query)



    

    return {
        createResource,
        findAll,
        countAll,
        findDetail,
        findByID,
        findByIDandUpdate,
        findByQuery,
        findByIdNoneLean,
        findByIDandUpdatePayload
    };
}

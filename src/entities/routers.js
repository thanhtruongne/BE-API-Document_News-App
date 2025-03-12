const routerEntities = ({
    _id = null, 
    model_id = null,
    model_name =  null,
    model_title = null,
    slug = null ,
    status = "Active",
}) => {

    return  {

        getID: () => _id,
        getModelID: () => model_id,
        getModelTitle: () => model_title,
        getSlug :() => slug,
        getModelName: () => model_name,
        getStatus: () => status,
    }
}

export default routerEntities
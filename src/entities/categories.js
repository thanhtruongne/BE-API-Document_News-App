const categoriesEntities = ({
    _id = null, 
    title = null,
    slug = null,
    description = null ,
    status = "Active",
    parent_id = null,
}) => {

    return  {

        getID: () => _id,
        getTitle: () => title,
        getSlug :() => slug,
        getDescription: () => description,
        getParentID: () => parent_id,
        getStatus: () => status,
    }
}

export default categoriesEntities
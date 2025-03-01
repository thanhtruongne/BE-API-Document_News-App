const authorEntities = ({
    _id = null, 
    full_name = null,
    avatar =  null,
    slug = null,
    description = null ,
    status = "Active",
    role_id = null,
}) => {

    return  {

        getID: () => _id,
        getFullName: () => full_name,
        getSlug :() => slug,
        getDescription: () => description,
        getRoleID: () => role_id,
        getAvatar: () => avatar,
        getStatus: () => status,
    }
}

export default authorEntities
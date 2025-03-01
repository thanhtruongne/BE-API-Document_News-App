const roleAuthorEntities = ({
    _id = null, 
    title =  null,
    status = "Active",
}) => {

    return  {

        getID: () => _id,
        getTitle: () => title,
        getStatus: () => status,
    }
}

export default roleAuthorEntities
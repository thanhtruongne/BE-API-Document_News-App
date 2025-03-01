
const getDetailRoleAuthorByID = async(id,authorRepository) =>{
    if(!id)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const response = await authorRepository.findRoleAuthorByQuery({ _id : id})
    if(!response)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    return response;
}


export default getDetailRoleAuthorByID;




import i18n from "../../../../../config/i18n/i18n.config.js";
import authorEntities from "../../../../../entities/author.js";
import { Api403Error } from "../../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../../utils/index.utils.js";
const createDataRoleAuthor = async(payloadEntities,authorRepository) => {
    const {title, status } = payloadEntities

    if(checkEmptyVal(title) ||checkEmptyVal(status))
        throw new Api403Error(i18n.translate("error.not_found.data"))
    
    const check_exists = await authorRepository.findRoleAuthorByQuery({title})
    console.log(check_exists);
    if(check_exists && check_exists.length > 0)
        throw new Api403Error(i18n.translate("error.invalid.exists"))

    
    const dataEntities = authorEntities({
        status,
        title
    })

    const response = await authorRepository.createResourceRoleAuthor(dataEntities);

    return response;
}



export default createDataRoleAuthor;




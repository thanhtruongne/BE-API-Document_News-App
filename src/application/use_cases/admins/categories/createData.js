import i18n from "../../../../config/i18n/i18n.config.js";
import categoriesEntities from "../../../../entities/categories.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";

const createData = async(payloadEntities,categoriesRepository) => {
    const {title , description, parent_id, status } = payloadEntities
    
    if(checkEmptyVal(title) || checkEmptyVal(status))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const dataEntities = categoriesEntities({
        title,description,parent_id,status
    })
    const response = await categoriesRepository.createResource(dataEntities);

    return response;
}



export default createData;




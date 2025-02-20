import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { convertToObject } from "../../../../utils/index.utils.js";

const removeResource = async(id,categoriesRepository) => {
    if(!id) 
        throw new Api403Error(i18n.translate('error.invalid.id.not_found'))
    let children_exists = await categoriesRepository.findByQuery({parent_id : convertToObject(id)})
    
    console.log(children_exists,'children_exists')
    if(children_exists && children_exists?.length > 0)
        throw new Api403Error(i18n.translate('error.exists.children'))
    
    return await categoriesRepository.removeResource(id)
}
export default removeResource;




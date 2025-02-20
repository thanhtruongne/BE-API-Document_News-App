import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { getSelectData } from "../../../../utils/index.utils.js";

const removeUser = async(id,userRepository) => {
    if(!id)
        throw new Api403Error(i18n.translate("error.not_found.data"))
    const response = await userRepository.deleteResource(id)
    if(!response)
        throw new Api403Error(i18n.translate("error.not_found.data"))
    return getSelectData(['_id'],response);
        
}
    
export default removeUser;



    
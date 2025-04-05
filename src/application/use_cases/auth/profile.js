import i18n from "../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../frameswork/web/plugins/error.response.js";
const profile = async(store,userRepository) => {
    const data = await userRepository.findByQuery({
        _id : store?.userID, 
        status : "Active"
    },'_id avatar role email phone address status full_name',false)
    if(!data) throw new Api403Error(i18n.translate("error.not_found.data"))
        
    return data

}

export default profile;




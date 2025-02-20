import i18n from "../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../frameswork/web/plugins/error.response.js";
import { getSelectData } from "../../../utils/index.utils.js";
const profile = async(store,userRepository) => {
    const data = await userRepository.findByQuery({
        _id : store?.userID, 
        email : store?.email, 
        status : "Active"
    })
    if(!data) throw new Api403Error(i18n.translate("error.not_found.data"))
    return getSelectData(['_id','email','phone','address','full_name','status','role'],data)

}

export default profile;




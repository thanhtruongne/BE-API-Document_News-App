import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";

const getAllNotifyData = async(params,notifyRepository) => {
    const response = await notifyRepository.getAllNotify(params);

    return response;
    
    
    
}
export default getAllNotifyData;




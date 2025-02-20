import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";

const changeStatus = async(_id,status,categoriesRepository) => {
    if(!_id) 
        throw new Api403Error(i18n.translate('error.invalid.id.not_found'))
        let statusData = status ? 'Active' : "Block";

    return await categoriesRepository.changeStatus(_id,statusData)
}
export default changeStatus;




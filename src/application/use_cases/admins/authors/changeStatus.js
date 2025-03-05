import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";

const changeStatusAuthor = async(payload,authorRepository) => {
    if(!payload && payload?.id) 
        throw new Api403Error(i18n.translate('error.invalid.id.not_found'))
    payload.status = payload?.status ? 'Active' : "Block";

    return await authorRepository.changeStatus(payload)
}
export default changeStatusAuthor;




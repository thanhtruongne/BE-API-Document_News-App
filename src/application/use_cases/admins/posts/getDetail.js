import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
const getDetailResourceBlog = async(_id,postRepository) => {
    if(!_id)
        throw new Api403Error(i18n.translate("error.not_found.data"))
    const response = await postRepository.findByIdNoneLean(_id)
    if(!response)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    return response;
}



export default getDetailResourceBlog;




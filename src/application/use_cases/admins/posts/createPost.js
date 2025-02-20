import i18n from "../../../../config/i18n/i18n.config.js";
import postEntities from "../../../../entities/post.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";
const createDataResourcePost = async(payloadEntities,postRepository) => {
    const {title , description, content, status,categories_id, thumb } = payloadEntities
    
    if(checkEmptyVal(title) || checkEmptyVal(status) || checkEmptyVal(categories_id) || checkEmptyVal(thumb) || checkEmptyVal(content))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const dataEntities = postEntities({
        title,description,categories_id,status,content,thumb
    })

    const response = await postRepository.createResource(dataEntities);

    return response;
}



export default createDataResourcePost;




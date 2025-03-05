import { uploadResourceSingle } from "../../../../config/cloudinary/uploadResource.js";
import i18n from "../../../../config/i18n/i18n.config.js";
import authorEntities from "../../../../entities/author.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";
const createDataAuthor = async(payloadEntities,authorRepository) => {
    const {full_name, role_id, description , status, avatar } = payloadEntities

    if(checkEmptyVal(full_name) || checkEmptyVal(role_id) || checkEmptyVal(description) || checkEmptyVal(status))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const public_id_thumb = await uploadResourceSingle(avatar);

    const dataEntities = authorEntities({
        full_name, 
        description,
        role_id,
        status,
        avatar : public_id_thumb,
        
    })

    const response = await authorRepository.createResourceAuthor(dataEntities);

    return response;
}



export default createDataAuthor;




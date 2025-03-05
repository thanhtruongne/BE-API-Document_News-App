import { generateImageURL } from "../../../../config/cloudinary/uploadResource.js";
import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
const getDetailAuthorData = async(_id,authorRepository) => {
    if(!_id)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const response = await authorRepository.getDetailDataAuthor({_id})
    if(!response)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    response.imageURL =  generateImageURL(response.avatar) ?? null;

    return response;
}



export default getDetailAuthorData;




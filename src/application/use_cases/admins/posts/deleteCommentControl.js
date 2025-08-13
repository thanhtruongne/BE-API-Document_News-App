import { generateImageURLByVideoID, uploadMultipleResource, uploadResourceSingle, uploadVideoResource } from "../../../../config/cloudinary/uploadResource.js";
import i18n from "../../../../config/i18n/i18n.config.js";
import postEntities from "../../../../entities/post.js";
import routerEntities from "../../../../entities/routers.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";
const deleteCommentControl = async(id,postId,commentRepository) => {
    if(checkEmptyVal(id) || checkEmptyVal(postId))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    if(!commentRepository.checkExistsQuery({id,postId})) {
        throw new Api403Error(i18n.translate("error.not_found.data"))
    }
    
    const removeComment = await commentRepository.removeResourceComment(id);
    return removeComment;
}
export default deleteCommentControl;




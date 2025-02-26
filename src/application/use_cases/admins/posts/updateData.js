import i18n from "../../../../config/i18n/i18n.config.js";
import postEntities from "../../../../entities/post.js";
import { Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";
const updateDataResource = async(id,payloadEntities,postRepository,postService) => {
    const {title , description, content, status,categories_id, thumb, images, isTrending } = payloadEntities

    if(checkEmptyVal(title) || checkEmptyVal(status) || checkEmptyVal(categories_id) || checkEmptyVal(thumb) || checkEmptyVal(content) || !id)
        throw new Api403Error(i18n.translate("error.not_found.data"))
    
    const already_post = await postRepository.findByID(id)
    if(!already_post)
        throw new BusinessLogicError(i18n.translate("error.not_found.data"))


    let generateThumb = await postService.updateImage(already_post?.thumb) // return ra publicID thumb

    if(images || already_post?.images) {
        images = await postService.updateMultipleImages(already_post?.images,images)
    }
    
    const dataEntities = postEntities({
        title,
        description,
        categories_id,
        status,
        content,
        thumb : generateThumb,
        images,
         isTrending
    })

    const response = await postRepository.createResource(dataEntities);

    return response;
}



export default updateDataResource;




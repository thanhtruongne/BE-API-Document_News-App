import { uploadMultipleResource, uploadResourceSingle, uploadVideoResource } from "../../../../config/cloudinary/uploadResource.js";
import i18n from "../../../../config/i18n/i18n.config.js";
import postEntities from "../../../../entities/post.js";
import routerEntities from "../../../../entities/routers.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";
const createDataResourcePost = async(payloadEntities,files,postRepository,routerRepository) => {
    const {title , description, content, status,categories_id, isTrending, type, author_id, media_type } = payloadEntities
     
    if(checkEmptyVal(title) || checkEmptyVal(status) || checkEmptyVal(categories_id) || checkEmptyVal(content))
        throw new Api403Error(i18n.translate("error.not_found.data"))
 
    if(type && type != 1 && !author_id) {
        throw new Api403Error(i18n.translate("error.not_found.data"))
    }

    let objectHash = {};

    if(files && files.images) {
        const imagesResponse = await uploadMultipleResource(files.images);
        objectHash.images = imagesResponse
    }
    if(files && files.thumb[0]) {
        const public_id = await uploadResourceSingle(files.thumb[0]);
        objectHash.thumb = public_id
    }
    if(files && files.videos && media_type == 3) {
        const public_id_video = await uploadVideoResource(files.videos[0])
        objectHash.videos = public_id_video
    }   



    const dataEntities = postEntities(
        {
        title,
        description,
        categories_id,
        status,
        content,
        thumb : objectHash.thumb ?? null,
        images:  objectHash.images ?? null,
        videos :  objectHash.videos ?? null,
        isTrending, 
        type, 
        author_id : (author_id != 'undefined' || !author_id) ? author_id  : null

    })

    const response = await postRepository.createResource(dataEntities);
    console.log(routerRepository,'routerRepository')
    if(response) {
        const dataRouterEntities = routerEntities({
            model_name :response?.constructor.modelName,
            model_id : response._id,
            model_title : response.title,
            slug : response.slug,
        })
        await routerRepository.createRouterResource(dataRouterEntities)
    }

    return response;
}



export default createDataResourcePost;




import mongoose from "mongoose";
import i18n from "../../../../config/i18n/i18n.config.js";
import postEntities from "../../../../entities/post.js";
import routerEntities from "../../../../entities/routers.js";
import { Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";
const updateDataResource = async (id, payloadEntities, files, postRepository, postService, routerRepository) => {
    const { title, description, content, status, categories_id, images, isTrending, type, media_type, author_id } = payloadEntities
    console.log(payloadEntities, 'payloadEntities')
    if (checkEmptyVal(title) || checkEmptyVal(status) || checkEmptyVal(categories_id) || checkEmptyVal(content) || !id)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const already_post = await postRepository.findByID(id)
    if (!already_post)
        throw new BusinessLogicError(i18n.translate("error.not_found.data"))

    let object = {}

    if (files && files?.thumb && files?.thumb[0]) {
        thumb = await postService.updateImage(already_post?.thumb, thumb) // return ra publicID thumb
        object.thumb = thumb
    }

    if (files && files?.images) {
        images = await postService.updateMultipleImages(already_post?.images, files.images)
        object.images = images
    }

    if (files && files?.videos) {
        images = await postService.updateVideos(already_post?.videos, files.videos)
        object.videos = videos
    }

    console.log(typeof author_id, author_id ? author_id : null, 'author_idasdsadsad')
    const dataEntities = postEntities({
        title,
        description,
        categories_id,
        status,
        content,
        thumb: object.thumb == undefined ? already_post?.thumb : thumb,
        images: object.images == undefined ? already_post?.images : images,
        videos: object.videos == undefined ? already_post?.videos : videos,
        isTrending: isTrending && isTrending == 'true' ? true : false,
        author_id: !author_id == 'null' ? author_id : null,
        type,
        media_type: media_type ?? already_post.media_type
    })



    const response = await postRepository.findByIDandUpdate(id, dataEntities);

    if (response && title === already_post?.title) {
        const id_convert = new mongoose.Types.ObjectId(id);
        const dataRouterEntities = routerEntities({
            model_name: 'Posts',
            model_title: title,
            slug: response?.slug
        })
        await routerRepository.updateRouterResource(id_convert, dataRouterEntities)
    }

    return response;
}



export default updateDataResource;




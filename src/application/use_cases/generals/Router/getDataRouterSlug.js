import mongoose from "mongoose";
import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js";
import constants from "../../../../utils/constants.js";
import { formatDateViWithTimezone } from "../../../../utils/index.utils.js";



const getDataRouterSlug = async (userID, slug, routerRepository, postRepository, categoriesRepository, userRepository, redisClient) => {
    if (!slug)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    console.log(slug, 'slugslugslug')

    const router = await routerRepository.findOneByQuery({ slug })
    if (!router)
        throw new Api403Error(i18n.translate("error.not_found.data"))


    if (router.model_name == constants.POSTS) {
        let checkSave = false;
        const response = await postRepository.findByID(router.model_id)
        if (response.categories_id?.parent_id != null) {
            const breadCrumb = await categoriesRepository.getParentTree(response.categories_id?.parent_id)
            breadCrumb.push(response.categories_id);
            response.breadCrumb = breadCrumb
        }

        response.formatDate = formatDateViWithTimezone(response.createdAt)

        const result = { ...response }

        // get similar blog
        const similarBlog = await postRepository.findByQuery({
            _id: { $ne: response?._id },
            categories_id: response.categories_id?._id,
            limit: 8,
            sort: { viewed: -1 },
            select: '_id categories_id description title slug thumb',
        })

        let idsSimilar = similarBlog.map(blog => blog._id);

        const ids = [...idsSimilar, result?._id];

        let ids_categories = response.breadCrumb?.map(data => new mongoose.Types.ObjectId(data?._id));
        // get dataGenerateBlog
        const dataGenerateBlog = await postRepository.findByQuery({
            $and: [
                { categories_id: { $in: ids_categories } },
                { _id: { $nin: ids } }
            ],
            status: 'Active',
            sort: { viewed: 1 },
            limit: 5,
            select: '_id categories_id description title slug thumb',
        })

        // delete result.categories_id
        delete result.createdAt
        delete result.comments

        const post_id = result?._id;

        if (userID) { // nếu authen checkuser
            if (await userRepository.checkExistsQuery({ _id: userID, post_saves: { $in: result?._id } }))
                checkSave = true;
            await caseCheckingRecordPost(userID, post_id, redisClient, userRepository, postRepository);
        }


        return {
            model: router.model_name?.toLowerCase(),
            result,
            similarBlog,
            dataGenerateBlog,
            checkSave
        }

    }


    else if (router.model_name == constants.CATEGORIES) {
        const slitSlug = slug.split('/').filter(slug => slug);
        let routerMain = null;
        if (slitSlug?.length > 1) {
            routerMain = await routerRepository.findOneByQuery({ slug: slitSlug[0] }, 'model_id ')
        }
        const categorieChild = await categoriesRepository.getAllChildren(slitSlug?.length > 1 ? routerMain?.model_id : router?.model_id, 'parent_id title slug _id status');
        const response = await postRepository.findByID(slitSlug?.length > 1 ? routerMain?.model_id : router?.model_id)


        return {
            categorieChild, routerMain, slitSlug, router
        }
    }

    return null

}



const caseCheckingRecordPost = async (userID, post_id, redisClient, userRepository, postRepository) => {

    try {
        const user = await userRepository.findByID(userID)
        // Khóa Redis để tránh race condition
        const lockKey = `lock:user:${userID}:viewedPosts`;
        console.log(lockKey, 'lockKeylockKey')
        const lock = await redisClient.set(lockKey, 'locked', 'NX', 'EX', 10);
        if (!lock) {
            throw new BusinessLogicError('Không thể khóa Redis, vui lòng thử lại');
        }

        try {
            // Khóa cache cho user
            const cacheKey = `user:${userID}:viewedPosts`;
            let viewedPosts = await redisClient.get(cacheKey);

            if (viewedPosts) {
                viewedPosts = JSON.parse(viewedPosts);
            } else {
                viewedPosts = user.viewedPosts.map((id) => id.toString());
            }
            // Nếu chưa xem bài đăng
            if (!viewedPosts.includes(post_id.toString())) {
                user.viewedPosts.push(post_id);
                await user.save();

                await postRepository.findByIDandUpdatePayload(post_id, { $inc: { viewed: 1 } });

                // Cập nhật cache
                viewedPosts.push(post_id.toString());
                const ttl = await redisClient.ttl(cacheKey); // Lấy TTL hiện tại
                const redisOptions = [];
                if (ttl === -1) {
                    // Giữ không TTL
                } else if (ttl > 0) {
                    redisOptions.push('EX', ttl);
                } else {
                    redisOptions.push('EX', 60 * 15);
                }
                await redisClient.set(
                    cacheKey,
                    JSON.stringify(viewedPosts),
                    ...redisOptions
                );
            }
            return true
        } finally {
            await redisClient.delete(lockKey); // xóa key đang lock
        }
    } catch (error) {
        throw new BusinessLogicError(error.message);
    }

}

export default getDataRouterSlug
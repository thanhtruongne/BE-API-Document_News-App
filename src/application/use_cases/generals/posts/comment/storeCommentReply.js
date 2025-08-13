import i18n from "../../../../../config/i18n/i18n.config.js";
import commentEntities from "../../../../../entities/comment.js";
import notifyEntities from "../../../../../entities/notify.js";
import { Api403Error, BusinessLogicError } from "../../../../../frameswork/web/plugins/error.response.js";
import NOTIFY_CONSTANST from '../../../../../utils/constants.js';
import { getSelectData } from "../../../../../utils/index.utils.js";


const storeComment = async ( id, user, payload, commentRepository, postRepository, notifyRepository) => {
    const { content, full_name, parent_id } = payload;
    if (!postId || !content || !full_name)
        throw new Api403Error(i18n.translate("error.not_found.data"))

    try {
        const userId = user?.userID;
        const dataEntities = commentEntities({
            postId,
            content,
            full_name,
            parent_id,
            userId
        })

        const comment = await commentRepository.storeResource(dataEntities)

        const posts = await postRepository.findByIDandUpdatePayload(postId, {
            $push: { comments: comment?._id }
        })

        // send notify
        const dataEntitiesNotify = notifyEntities({
            url: process.env.REACT_APP_FRONTEND + '/' + posts?.slug || null,
            subject: NOTIFY_CONSTANST.SUBJECT_COMMENT + ' [' + posts?.title + ']',
            content,
            postId,
            userId,
        });

        const notify = await notifyRepository.createNotify(dataEntitiesNotify);


        return {
            notify,
            posts: getSelectData(['_id', 'slug', 'title', 'imageURL'], posts),
            comment: getSelectData(['id', 'status', 'full_name', 'content'], comment)
        }


    } catch (error) {
        throw new BusinessLogicError(error.message);
    }

}
export default storeComment;




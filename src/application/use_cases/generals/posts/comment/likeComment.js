import { Api404Error, BusinessLogicError } from "../../../../../frameswork/web/plugins/error.response.js";
import { getSelectData } from "../../../../../utils/index.utils.js";

const likeComment = async (_id, postId, user, commentRepository) => {
    if (!_id || !postId) {
        throw new Api404Error('Post not found');
    }

    try {
        //check khi user đã like từ trước
        const comment_exists = await commentRepository.findByQuery({
            _id,
            postId,
            user_likes: {
                $in: [user?.userID]
            },
            select: 'userId postId _id user_likes like'
        });

        const response = await commentRepository.findByIDAndUpdatePayload(
            _id,
            {
                [comment_exists.length > 0 ? '$pull' : '$addToSet']: { user_likes: user?.userID },
                $inc: { like: comment_exists.length > 0 ? -1 : 1 }
            },
            { new: true }
        );

        response.isLike = comment_exists?.length > 0 ? false : true;

        return getSelectData(['_id', 'userId', 'postId', 'like', 'isLike'], response);

    } catch (error) {
        throw new BusinessLogicError(error.message);
    }

}
export default likeComment;









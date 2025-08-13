import { BusinessLogicError } from "../../../../../frameswork/web/plugins/error.response.js";

const getMoreReply = async (_id, commentRepository) => {
    try {
        const response = await commentRepository.getDataCommentByID(_id, { limit: 6 })
        return response;
    } catch (error) {
        throw new BusinessLogicError(error.message);
    }
}
export default getMoreReply;




import { Api403Error } from "../../../../../frameswork/web/plugins/error.response.js";
import { buildCommentTree, handleCheckLike } from "../../../../../utils/index.utils.js";

const getCommentQuery = async (postId, params, userID, commentRepository) => {
   try {
      const response = await commentRepository.getParentAndChildComment(postId, params, false)
      const data = buildCommentTree(userID ? handleCheckLike(response, userID) : response);
      return data;
   } catch (error) {
      throw new Api403Error(error.message)
   }

}

export default getCommentQuery;




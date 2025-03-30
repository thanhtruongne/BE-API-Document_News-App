import commentEntities from "../../../../../entities/comment.js";
import { Api403Error } from "../../../../../frameswork/web/plugins/error.response.js";

const storeComment = async(postId,payload,commentRepository,postRepository) =>  {
    const { content, full_name , parent_id } = payload;
    if(!postId || !content || !full_name) 
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const dataEntities = commentEntities({
        postId,
        content, 
        full_name,
        parent_id
    })

    const comment = await commentRepository.storeResource(dataEntities)

    if(comment) {
        await postRepository.findByIDandUpdatePayload(postId,{
            $push : {comments : comment?._id}
        })
    }

    return comment

}
export default storeComment;  



    
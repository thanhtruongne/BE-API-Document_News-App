
const getCommentQuery = async(postId,commentRepository) =>  {
  
   const response = await commentRepository.findByQuery({
        postId,
        sort : {createdAt : -1},
        limit : 4,
        parent_id : null,
        status : "Active"
    })

   return response

}
export default getCommentQuery;  



    
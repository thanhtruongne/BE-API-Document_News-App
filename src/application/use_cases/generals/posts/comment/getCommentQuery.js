
const getCommentQuery = async(postId,params,commentRepository) =>  {
  
   const response = await commentRepository.findByQuery({postId,...params})

   return response

}
export default getCommentQuery;  



    
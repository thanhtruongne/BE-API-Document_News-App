
const getMoreReply = async(_id,commentRepository) =>  {
  
    const response = await commentRepository.findByQuery({
        parent_id : _id,
        status : "Active",
        limit : 4
    })


    return response
    

}
export default getMoreReply;  



    
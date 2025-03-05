
const searchingDataPost = async(payloadEntities,postRepository,postService) => {
   const params = await postService.searchingParamsService(payloadEntities)

   const response = await postRepository.findDetail(params)
      
   return response;
}



export default searchingDataPost;




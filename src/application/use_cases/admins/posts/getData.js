import { convertObjectParams } from "../../../../utils/index.utils.js";

const getData = async(payload,params,postRepository,postService) =>  { 
   const query = await postService.searchingParamsService(payload)

   const params_query = convertObjectParams(params)
//    const response = await postRepository.findDetail(params)
   const response  = await postRepository.findAll({...params_query,...query});

   return response;
}


export default getData;




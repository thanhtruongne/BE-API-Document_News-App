import { convertObjectParams } from "../../../../utils/index.utils.js";

const getData = async(req,params,postRepository,postService) =>  { 
   const payload = req.body
   const query = await postService.searchingParamsService(payload)

   const params_query = convertObjectParams(params)

//    const response = await postRepository.findDetail(params)
   console.log(params_query,query,'params_query')
   const response  = await postRepository.findAll({...params_query,...query});

   return response;
}


export default getData;




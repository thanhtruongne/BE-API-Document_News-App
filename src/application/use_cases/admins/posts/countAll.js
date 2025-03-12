import { convertObjectParams } from "../../../../utils/index.utils.js   ";

const countAll = async(params,req,postRepository,postService) =>  {
    const payload = req.body
    const query = await postService.searchingParamsService(payload)

    const params_query = convertObjectParams(params)

    return await postRepository.countAll({...params_query,...query});
}


export default countAll;




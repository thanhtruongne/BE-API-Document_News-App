import { convertObjectParams } from "../../../../utils/index.utils.js   ";

const countAll = async(params,payload,postRepository,postService) =>  {
    const query = await postService.searchingParamsService(payload)

    const params_query = convertObjectParams(params)

    return await postRepository.countAll({...params_query,...query});
}


export default countAll;




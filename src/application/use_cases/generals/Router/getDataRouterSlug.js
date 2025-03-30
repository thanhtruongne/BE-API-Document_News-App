import i18n from "../../../../config/i18n/i18n.config.js";
import { Api401Error, Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import constantModel from '../../../../utils/constants.js';
import { formatDateViWithTimezone } from "../../../../utils/index.utils.js";



const getDataRouterSlug = async(slug,routerRepository,postRepository,categoriesRepository,commentRepository) => {
    if(!slug)
        throw new Api401Error(i18n.translate("error.not_found.data"))

    const router = await routerRepository.findOneByQuery({slug})
    if(!router) 
        throw new Api403Error(i18n.translate("error.not_found.data"))

    if(router.model_name == constantModel.POSTS) {
        const response = await postRepository.findByID(router.model_id)
        if(response.categories_id?.parent_id != null) {
            const breadCrumb = await categoriesRepository.getParentTree(response.categories_id?.parent_id)
            breadCrumb.push(response.categories_id)
            response.breadCrumb = breadCrumb
        }
        
        response.formatDate = formatDateViWithTimezone(response.createdAt)
           
      
        const result = {...response} 

        const similarBlog = await postRepository.findByQuery({
            categories_id : response.categories_id?._id,
            limit : 8,
            sort : {viewed : -1},
            select : '_id categories_id description title slug thumb',
        })
 
        const dataGenerateBlog = await postRepository.findByQuery({
            $and : [
                {categories_id : {$ne : response.categories_id?._id || null}},
                {categories_id : {$in : result.breadCrumb[0]._id}}
            ],
            status : 'Active',
            limit : 5,
            select : '_id categories_id description title slug thumb',
        })
   
       delete result.categories_id
       delete result.createdAt


       return {
            result,
            similarBlog,
            dataGenerateBlog
        }

    } else if(router.model_name == constantModel.CATEGORIES) {

    }

    return null

}

export default getDataRouterSlug
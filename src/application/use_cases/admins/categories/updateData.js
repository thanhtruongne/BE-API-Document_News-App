import i18n from "../../../../config/i18n/i18n.config.js";
import categoriesEntities from "../../../../entities/categories.js";
import routerEntities from "../../../../entities/routers.js";
import { Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal } from "../../../../utils/index.utils.js";

const updateData = async(id,payloadEntities,categoriesRepository,routerRepository) => {
    const {title , description, parent_id, status } = payloadEntities
    
    if(checkEmptyVal(title) || checkEmptyVal(status))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    if(!id) 
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const data_exists = await categoriesRepository.getDetailResource(id)
    if(!data_exists) {
        throw new BusinessLogicError(i18n.translate("error.not_found.data"))
    }

    const dataEntities = categoriesEntities({
        title,description,parent_id,status
    })
    const response = await categoriesRepository.updateResource(id,dataEntities);

    console.log(response,'addsdasd');
    if(response) {
        const routerDataEntities = routerEntities({
            model_name :response?.constructor.modelName,
            model_id : response._id,
            model_title : response.title,
            slug : response.slug,
        })
        await routerRepository.updateRouterResource(response._id,routerDataEntities)
    }
    
    return response;
}



export default updateData;




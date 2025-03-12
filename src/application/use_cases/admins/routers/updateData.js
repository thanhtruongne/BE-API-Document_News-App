import i18n from "../../../../config/i18n/i18n.config.js";
import routerEntities from "../../../../entities/routers.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal, getSelectData } from "../../../../utils/index.utils.js";
const updateDataRouter = async(payloadEntities,routerRepository) => {
    const {model_name, model_title, model_id , slug } = payloadEntities

    if(checkEmptyVal(model_name) || checkEmptyVal(model_title) || checkEmptyVal(slug))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const dataEntities = new routerEntities(payloadEntities)


    const response = await routerRepository.updateRouterResource(dataEntities);

    return getSelectData(['_id','model_title','model_id'],response);
}



export default updateDataRouter;




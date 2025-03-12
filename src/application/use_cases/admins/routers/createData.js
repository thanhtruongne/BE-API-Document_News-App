import i18n from "../../../../config/i18n/i18n.config.js";
import routerEntities from "../../../../entities/routers.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal, getSelectData } from "../../../../utils/index.utils.js";
const createDataRouter = async(payloadEntities,routerRepository) => {
    const {model_name, model_id, model_title , slug } = payloadEntities

    if(checkEmptyVal(model_name) || checkEmptyVal(model_id) || checkEmptyVal(model_title) || checkEmptyVal(slug))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    const dataEntities = new routerEntities(payloadEntities)


    const response = await routerRepository.createRouterResource(dataEntities);

    return getSelectData(['_id','model_title'],response);
}



export default createDataRouter;




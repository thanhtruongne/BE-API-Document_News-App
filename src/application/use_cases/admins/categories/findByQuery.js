import i18n from "../../../../config/i18n/i18n.config";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response";
import { getSelectData } from "../../../../utils/index.utils";

const findByQuery = async(query,categoriesRepository) => {
    const response  = await categoriesRepository.findByQuery(query)

    if(response)
        throw new Api403Error(i18n.translate('error.exists.children'))
    

    return getSelectData(['id','title','status','parent_id'],response);
}


export default findByQuery;




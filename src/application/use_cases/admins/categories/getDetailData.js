import i18n from "../../../../config/i18n/i18n.config.js";
import { Api403Error } from "../../../../frameswork/web/plugins/error.response.js";
import { getSelectData } from "../../../../utils/index.utils.js";

const getDetailData = async(id,categoriesRepository) => {
    if(!id)
        throw new Api403Error(i18n.translate("error.not_found.data"))
    const response = await categoriesRepository.getDetailResource(id)
    if(!response)
        throw new Api403Error(i18n.translate("error.not_found.data"))
    return getSelectData(['_id','title','desciption','status','parent_id'],response)
        
}
    

export default getDetailData;   




import i18n from "../../../../../config/i18n/i18n.config.js";
import commentEntities from "../../../../../entities/comment.js";
import { Api403Error } from "../../../../../frameswork/web/plugins/error.response.js";

const changeStatusComment = async(_id,payload,commentRepository) =>  {
    const { status } = payload;
    console.log(status,'asdasdadasd')
    if(!_id || !status) {
        throw new Api403Error(i18n.translate("error.not_found.data"))
    }
    const dataEntities = commentEntities({
        status
    })
    const response = await commentRepository.updateStatusResource(_id,dataEntities)

    return response
    

}
export default changeStatusComment;  



    
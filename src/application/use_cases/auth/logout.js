
import { Api403Error } from '../../../frameswork/web/plugins/error.response.js';
const logout = async(store,userRepository) => {
    const response = await userRepository.deleteKeyTokenID(store?._id)
    if(!response)   throw new Api403Error(i18n.translate("error.not_found.data"))
    return {
      deleted : true,
      response
    };
}

export default logout;




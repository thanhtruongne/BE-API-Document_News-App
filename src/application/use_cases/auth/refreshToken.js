import i18n from "../../../config/i18n.config.js";
import keyTokenEntities from "../../../entities/keyToken.js";
import { Api401Error, Api403Error } from "../../../frameswork/web/plugins/error.response.js";
import { getSelectData } from "../../../utils/index.utils.js";
const refreshToken = async({refreshToken,user,store},userRepository) => {
    const { userID, email } = user
    if(store.refreshTokensUsed.includes(refreshToken)) {
        throw new Api403Error(i18n.translate("error.refreshToken.invalid"))
    }

    if(refreshToken != store.refreshToken) throw new Api403Error(i18n.translate("error.refreshToken.invalid"))

    const user_exists = await userRepository.findByQuery({email, _id: userID,status :"Active"})
    if (!user_exists) throw new Api401Error(i18n.translate('error.user_id.not_found'))

    const userPayload = keyTokenEntities({
        _id : user_exists?._id,
        email,
        role : user_exists?.role
    })
    const tokens = await userRepository.createKeyTokens(userPayload) 
    await userRepository.updateRefreshTokenUsed(refreshToken,tokens,store);
    return {
        tokens,
        data : getSelectData({
            fields : ['_id','full_name','email','role','status'],
            obj : user_exists
        })
    }

}

export default refreshToken;




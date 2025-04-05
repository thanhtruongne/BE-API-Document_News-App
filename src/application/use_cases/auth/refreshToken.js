import i18n from "../../../config/i18n/i18n.config.js";
import keyTokenEntities from "../../../entities/keyToken.js";
import { Api401Error, Api403Error } from "../../../frameswork/web/plugins/error.response.js";
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
        role : user_exists?.role
    })
    const tokens = await userRepository.createKeyTokens(userPayload) 
    await userRepository.updateRefreshTokenUsed(refreshToken,tokens,store?._id);
    return tokens;

}

export default refreshToken;




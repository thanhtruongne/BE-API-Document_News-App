import i18n from "../../../../config/i18n/i18n.config.js"
import userEntities from "../../../../entities/user.js"
import { Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js"
import { validateRequestLogin } from "../../../../utils/auth.utils.js"
import { getSelectData } from "../../../../utils/index.utils.js"


const registerForm = async(payload,userRepository,authService) => {
    const {email ,password} = payload

    if(!validateRequestLogin({email,password})) {
        throw new Api403Error(i18n.translate("error.not_found.data"))
    }

    const check_user = await userRepository.findByQuery({email},'email _id status')
    if(check_user){
        throw new BusinessLogicError(i18n.translate('errors.login_fail'))
    }

    const passwordHash = await authService.hashPassword(password)

    const userPayloadEntities = userEntities({
        email,
        password: passwordHash
    })

    const user_create_news = await userRepository.createData(userPayloadEntities)   
    if(!user_create_news)
        throw new Api403Error(i18n.translate("error.user.invalid"))

    const userPayload = keyTokenEntities({
        _id : user_create_news?._id,
        role : user_create_news?.role
    })
    const tokens = await userRepository.createKeyTokens(userPayload) 
    return {
        tokens,
        data : getSelectData([
            '_id'
        ],check_user)
    }


}

export default registerForm


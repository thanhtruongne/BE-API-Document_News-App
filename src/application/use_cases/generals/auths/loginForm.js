import i18n from "../../../../config/i18n/i18n.config.js"
import keyTokenEntities from "../../../../entities/keyToken.js"
import { Api401Error, Api403Error, BusinessLogicError } from "../../../../frameswork/web/plugins/error.response.js"
import { validateRequestLogin } from "../../../../utils/auth.utils.js"
import { getSelectData } from "../../../../utils/index.utils.js"


const loginForm = async(payload,userRepository,authService) => {
    const {email,password} = payload

    if(!validateRequestLogin({email,password})) {
            throw new Api403Error(i18n.translate("error.not_found.data"))
    }
    const check_user = await userRepository.findByQuery({email,status : 'Active'},'role _id status email password')

    if(!check_user) 
        throw new Api401Error(i18n.translate("error.not_found.data"))

    if(!await authService.comparePassword(password,check_user?.password))
            throw new BusinessLogicError(i18n.translate('errors.login_fail'))

    if(check_user &&  check_user?.role === 'Admin') 
        throw new BusinessLogicError(i18n.translate('errors.login_fail'))

    const userPayload = keyTokenEntities({
        _id : check_user?._id,
        role : check_user?.role
    })
    const tokens = await userRepository.createKeyTokens(userPayload) 
    
    return {
        tokens,
        data : getSelectData([
            '_id'
        ],check_user)
    }


}

export default loginForm


import i18n from '../../../config/i18n.config.js';
import keyTokenEntities from '../../../entities/keyToken.js';
import { Api401Error, Api403Error, BusinessLogicError } from '../../../frameswork/web/plugins/error.response.js';
import { validateRequestLogin } from '../../../utils/auth.utils.js';
import { getSelectData } from '../../../utils/index.utils.js';

const login = async(payload,userRepository,authService) => {
    const {email,password,system} = payload
    if(!validateRequestLogin({email,password})) {
        throw new Api403Error(i18n.translate("error.not_found.data"))
    }
    const user_exist = await userRepository.findByQuery({email})

    if(!user_exist)  
        throw new Api401Error(i18n.translate("error.user.invalid"))
    
    if(!await authService.comparePassword(password,user_exist?.password))
            throw new BusinessLogicError(i18n.translate('errors.login_fail'))

    if(system && user_exist?.role != 'Admin') 
        throw new BusinessLogicError(i18n.translate('errors.login_fail'))
    

    if(user_exist?.status == 'Block' || user_exist?.status == 'Deleted') 
        throw new Api401Error(i18n.translate('errors.login_fail'))
    const userPayload = keyTokenEntities({
        _id : user_exist?._id,
        email,
        role : user_exist?.role
    })
    const tokens = await userRepository.createKeyTokens(userPayload) 
    
    return {
        tokens,
        data : getSelectData([
            '_id'
        ],user_exist)
    }
}

export default login;




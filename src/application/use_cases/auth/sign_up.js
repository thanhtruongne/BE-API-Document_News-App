import i18n from '../../../config/i18n.config.js';
import keyTokenEntities from '../../../entities/keyToken.js';
import userEntities from '../../../entities/user.js';
import { Api401Error, Api403Error } from '../../../frameswork/web/plugins/error.response.js';
import { validateRequestSignIn } from '../../../utils/auth.utils.js';

const sign_up = async(payload,userRepository,authService) => {
    const { email, password, phone, full_name} = payload
    if(!validateRequestSignIn(payload)) {
        throw new Api403Error(i18n.translate("error.not_found.data"))
    }
    console.log(payload)
    
    const user_exist = await userRepository.findByQuery({email})
    if(user_exist)  
        throw new Api401Error(i18n.translate("error.user.invalid"))

    const passwordHash = await authService.hashPassword(password)
    
    const userPayloadEntities = userEntities({
        email,
        password :passwordHash,
        phone,
        full_name
    })

    const user_create_news = await userRepository.createData(userPayloadEntities)   
    if(!user_create_news)
        throw new Api403Error(i18n.translate("error.user.invalid"))

    const tokenPayload = keyTokenEntities({
        _id : user_create_news?._id,
        email : user_create_news?.email,
        role : user_create_news?.role
    })
    const tokens = await userRepository.createKeyTokens(tokenPayload) 
    
    return {
        tokens,
        data : getSelectData([
            '_id','email','full_name','phone','role'
        ],user_exist)
    }
}

export default sign_up;




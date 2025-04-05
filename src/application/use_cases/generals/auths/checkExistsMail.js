import i18n from "../../../../config/i18n/i18n.config.js"
import { Api401Error } from "../../../../frameswork/web/plugins/error.response.js"
import { isValidEmail } from "../../../../utils/index.utils.js"


const checkExistsMail = async(email,userRepository) => {
    if(!isValidEmail(email))
        throw new Api401Error(i18n.translate("error.not_found.data"))


    const check_exists_user = await userRepository.checkExistsField({email, status : 'Active'})
    if(!check_exists_user) {
        return null
    }
    return {
        _id : check_exists_user._id,
        email
    }
}

export default checkExistsMail


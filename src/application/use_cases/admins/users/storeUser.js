import i18n from "../../../../config/i18n/i18n.config.js";
import userEntities from "../../../../entities/user.js";
import { Api403Error, Api404Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal, isValidEmail } from "../../../../utils/index.utils.js";

const storeUser = async(payloadEntities,userRepository,authService) => {
    const {email, address, phone, password, full_name, status , avatar } = payloadEntities
    
    if(checkEmptyVal(email) || checkEmptyVal(address) || checkEmptyVal(phone) || checkEmptyVal(full_name) || checkEmptyVal(status))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    if(!isValidEmail(email)) 
        throw new Api403Error(i18n.translate('error.Invalid.email'));

    //check nếu email đổi trùng qua user khác
    const email_unique = await userRepository.findByQuery({email},{email : 1})

    if(email_unique)
        throw new Api404Error(i18n.translate('errors.email_was_exists'));

    const passwordHash = await authService.hashPassword(password)

    const dataEntities = userEntities({
        email,address,phone,password : passwordHash, full_name,status,avatar
    })

    const response = await userRepository.createData(dataEntities);

    return response;
}


export default storeUser;




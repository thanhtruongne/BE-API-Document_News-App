import i18n from "../../../../config/i18n.config.js";
import userEntities from "../../../../entities/user.js";
import { Api403Error, Api404Error } from "../../../../frameswork/web/plugins/error.response.js";
import { checkEmptyVal, isValidEmail } from "../../../../utils/index.utils.js";

const updateData = async(payloadEntities,id,userRepository) => {
    const {email, address, phone, full_name, status } = payloadEntities
    console.log(payloadEntities,'payload')
    if(!id) 
        throw new Api403Error(i18n.translate("error.not_found.data"))
    
    if(checkEmptyVal(email) || checkEmptyVal(address) || checkEmptyVal(phone) || checkEmptyVal(full_name) || checkEmptyVal(status))
        throw new Api403Error(i18n.translate("error.not_found.data"))

    if(!isValidEmail(email)) 
        throw new Api403Error(i18n.translate('error.Invalid.email'));

    //check nếu email đổi trùng qua user khác
    const email_unique = await userRepository.findByQuery({
        email , _id : {$ne : id}
    })
    if(email_unique)
        throw new Api404Error(i18n.translate('errors.email_was_exists'));

    const dataEntities = userEntities({
        email,address,phone,full_name,status
    })

    const response = await userRepository.updateData(dataEntities,id);

    return response;
}


export default updateData;




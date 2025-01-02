import { Api403Error,Api404Error } from "../../core/error.response.js";
import 
{ 
    isValidEmail,
    checkEmptyVal,
    checkValidatePhone,
    checkPasswordValid 
} from "../../utils/index.utils.js";
import i18n from "../../configs/i18n.config.js";


const validateRequestSignIn = (req,res,next) => {
   const body = req.body;
   if(checkEmptyVal(body?.email) || checkEmptyVal(body?.phone) || checkEmptyVal(body?.full_name) || checkEmptyVal(body?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
   }
   if(!isValidEmail(body?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
   }
   if(!checkPasswordValid(body?.password)) {
        throw new Api403Error(i18n.translate('error.Invalid.password'));
   }
   if(!checkValidatePhone(body?.phone)) {
        throw new Api403Error(i18n.translate('error.Invalid.phone'));
   }
   return next();
}

const validateRequestLogin = (req,res,next) => {
    const loginRequest = req.body
    if(checkEmptyVal(loginRequest?.email) || checkEmptyVal(loginRequest?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
    }
    if(!isValidEmail(loginRequest?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
   }

    return next()
}

export {
    validateRequestSignIn,
    validateRequestLogin
}



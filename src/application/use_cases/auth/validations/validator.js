import i18n from "../../../../config/i18.config.js";
import {
    checkEmptyVal,
    checkPasswordValid,
    checkValidatePhone,
    isValidEmail
} from "../../../../index.utils.js";
import { Api403Error } from "../../core/error.response.js";

const validateRequestSignIn = (payload) => {
   if(checkEmptyVal(payload?.email) || checkEmptyVal(payload?.phone) || checkEmptyVal(payload?.full_name) || checkEmptyVal(payload?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
   }
   if(!isValidEmail(payload?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
   }
   if(!checkPasswordValid(payload?.password)) {
        throw new Api403Error(i18n.translate('error.Invalid.password'));
   }
   if(!checkValidatePhone(payload?.phone)) {
        throw new Api403Error(i18n.translate('error.Invalid.phone'));
   }
   return true;
}

const validateRequestLogin = (payload) => {
    if(checkEmptyVal(payload?.email) || checkEmptyVal(payload?.password)) {
        throw new Api403Error(i18n.translate('error.required.field'));
    }
    if(!isValidEmail(payload?.email)) {
        throw new Api403Error(i18n.translate('error.Invalid.email'));
    }
   return true;
}


export {
    validateRequestLogin, validateRequestSignIn
};



import _ from 'lodash';
import { Types } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';




const getSelectData = (fields = [] , obj = {}) => {
   return _.pick(obj,fields);
}

const checkEnable = (value) => {
    return value === 'true'
}

const isValidEmail = (email) => {
    return validator.isEmail(email);
}

const checkEmptyVal = (field) => {
   return validator.isEmpty(field);
}

//pass có viết hoa, thường, số, ký tự đặc biệt ít nhất 8 ký tự
const checkPasswordValid = (password) => {
    const preg_match = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return preg_match?.test(password);
}

const checkValidatePhone = (phone) => {
    const regex = /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])\d{7}$/;
    return validator.isMobilePhone(phone, 'vi-VN') && regex.test(phone);
}


const convertToObject = id => {
    return new Types.ObjectId(id)
}

const convertStringSlug = (string) => {
  return slugify(string,{lower : true,strict: true});
}

const omit = (obj,...props) => {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}


const convertObjectParams = (query) => { 
    const params = {};
    for (const key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          params[key] = query[key];
        }
    }
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    return params;
}

export {
    checkEmptyVal,
    checkEnable,
    checkPasswordValid,
    checkValidatePhone,
    convertObjectParams,
    convertStringSlug,
    convertToObject,
    getSelectData,
    isValidEmail,
    omit
};


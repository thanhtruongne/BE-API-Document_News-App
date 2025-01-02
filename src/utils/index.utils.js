import _ from 'lodash'  
import validator from 'validator'
const getSelectData = ({fields = [] , obj = {}}) => {
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
    const preg_match = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
    return preg_match.test(password);
}

const checkValidatePhone = (phone) => {
    const regex = /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])\d{7}$/;
    return validator.isMobilePhone(phone, 'vi-VN') && regex.test(phone);
}


const convertToObject = id => {
    return new Types.ObjectId(id)
}

export {
    getSelectData,
    checkEnable,
    isValidEmail,
    checkEmptyVal,
    checkValidatePhone,
    checkPasswordValid,
    convertToObject
}
import _ from 'lodash'
const getSelectData = ({fields = [] , obj = {}}) => {
   return _.pick(obj,fields);
}

const checkEnable = (value) => {
    return value === 'true'
}

export {
    getSelectData,
    checkEnable
}
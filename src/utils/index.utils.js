import _ from 'lodash'
const getSelectData = ({fields = [] , obj = {}}) => {
   return _.pick(obj,fields);
}

export {
    getSelectData
}
import querystring from 'querystring'
import { convertObjectParams, omit } from '../../../../../utils/index.utils.js'
import { REQUEST_CUSTOM } from '../../../plugins/successReponse.js'

export default function catchingMiddleware(redisClient,key) {
  return async function(req,res,next){
    const extra_params = querystring.stringify(omit(convertObjectParams(req.query),'select','perPage','role')) || ''
    const data = await redisClient.get(key + '_' + extra_params)  
    console.log(extra_params,data)
    if(data) {
      let parseData = JSON.parse(data)
      return REQUEST_CUSTOM(res,"Cache Load Data Success",parseData?.response,parseData?.options)
    }
    return next()
  }
}
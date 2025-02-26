import { REQUEST_CUSTOM } from '../../../plugins/successReponse.js'


export default function catchingMiddlewareCategories(redisClient,key) {
  return async function(req,res,next){
    const extra_params = req.params.id || ''
    const data = await redisClient.get(key + extra_params)  
    if(data) {
      let parseData = JSON.parse(data)
      return REQUEST_CUSTOM(res,"Cache Load Data Success",parseData)
    }
    return next()
  }
}
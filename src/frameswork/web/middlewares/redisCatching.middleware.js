import querystring from 'querystring';
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import { convertObjectParams } from '../../../utils/index.utils.js';
import { REQUEST_CUSTOM } from "../plugins/successReponse.js";



export default function catchingMiddleware(redisClient,key) {
  return catchingAsyncAwait(async(req,res,next) => {
       const extra_params = querystring.stringify(convertObjectParams(req)) || ' '
       const data = await redisClient.get(key + '_' + extra_params)
       if(data) {
          let parseData = JSON.parse(data)
          return REQUEST_CUSTOM(res,"Cache Load Data Success",parseData?.response,parseData?.options)
       }
       return next()
  })
}
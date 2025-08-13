import { convertObjectParams, convertSortToQueryString, omit } from '../../../../../utils/index.utils.js';
import { REQUEST_CUSTOM } from '../../../plugins/successReponse.js';


export default function catchingMiddlewareQueryComment(redisClient, key) {
  return async function (req, res, next) {
    const params = convertObjectParams(req.query);
    const query = convertSortToQueryString(params.sort, omit(params, 'perPage', 'sort'))
    const data = await redisClient.get(key + "_" + query) 
    if (data) {
      let parseData = JSON.parse(data);
      return REQUEST_CUSTOM(res, "Cache Load Data Success", parseData['data', parseData['options']])
    }
    return next()
  }
}

import querystring from 'querystring';
import countData from "../../../application/use_cases/admins/users/countData.js";
import getAllUser from "../../../application/use_cases/admins/users/getAllUser.js";
import { catchingData } from "../../../frameswork/databases/redis/cachingRepo.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import CacheDynamic from '../../../utils/constants.js';
import { omit } from '../../../utils/index.utils.js';
import BaseController from "./baseController.js";



class userController extends BaseController {
   constructor(userRepository,authService,redisClient){
      super(userRepository,authService,redisClient)
   }
    getDataAllUser = catchingAsyncAwait(async(req,res,next) => {
        const params = {};
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
              params[key] = req.query[key];
            }
        }
        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
        params.select = '-password -updatedAt'
         
        const response = await getAllUser(params,this.userRepository)
        let countAll = await countData(params,this.userRepository)


        const options = {
            totalItems : countAll,
            totalPages : Math.ceil(countAll / params.perPage),
            itemsPerPage :  params.perPage,
        }
        // cache bằng redis
        if(response && response.length != 0) {
            let stringKey = querystring.stringify(omit(params,'select')) || ' '
            catchingData(
                {
                    key : CacheDynamic.USER_ALL_DATA + '_' +  stringKey,
                    value : JSON.stringify({response,options}),
                    expire : 60 * 480 // 8tieng
                }
                ,this.redisClient)
        }
      
        
        REQUEST_CUSTOM(res,'Successfully',response,options) 

    })
     
}


export default userController;

import moment from 'moment';
import querystring from 'querystring';
import countData from "../../../application/use_cases/admins/users/countData.js";
import getAllUser from "../../../application/use_cases/admins/users/getAllUser.js";
import getDetailUserById from '../../../application/use_cases/admins/users/getDetailUserById.js';
import removeUser from '../../../application/use_cases/admins/users/removeUser.js';
import updateData from '../../../application/use_cases/admins/users/updateData.js';
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
        // set tạm  =>  nên dùng seek Paging
        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
        params.select = '-password -updatedAt'
         
        const data = await getAllUser(params,this.userRepository)
        let countAll = await countData(params,this.userRepository)

        //thêm trg key để access theo lib fe
        const response  = data.map((item,key) => {
            item.timeMoment = moment(item.createdAt).locale('vi').fromNow()
            item.key = key;
            return item
        })

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
      
        
        REQUEST_CUSTOM(res,'Successfully',response, options) 

    })

    updateUserPayload = catchingAsyncAwait(async(req,res,next) => {
        const { id } = req.params
        const payload = req.body
        const response = await updateData(payload,id,this.userRepository)
        REQUEST_CUSTOM(res,'Update Success',response) 

    })

    getDetailUser = catchingAsyncAwait(async(req,res,next) => {
        const { id } = req.params
        const response = await getDetailUserById(id,this.userRepository);
        REQUEST_CUSTOM(res,'Get Detail Success',response) 
    })

    removeResource = catchingAsyncAwait(async(req,res,next) => {
        const {id} = req.params
        const response = await removeUser(id,this.userRepository);
        REQUEST_CUSTOM(res,'Delete success',response) 
    })
    
     
}


export default userController;
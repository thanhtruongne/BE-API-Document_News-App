import moment from 'moment/moment.js';
import querystring from 'querystring';
import getDataCategoryNav from '../../application/use_cases/generals/category/getDataCategoryNavnar.js';
import getDataNotify from '../../application/use_cases/generals/posts/getDataNotify.js';
import getDataLayout from '../../application/use_cases/generals/settings/getDataLayout.js';
import { REQUEST_CUSTOM } from "../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../helpers/catchingAsyncAwait.aysnc.js";
import CacheDynamic from '../../utils/constants.js';
import { omit } from '../../utils/index.utils.js';
import BaseController from "./BaseController.js";



class GeneralController extends BaseController {
    constructor(settingRepository,generalService,postRepository,postService,categoriesRepository,redisClient){
        super({settingRepository,generalService,redisClient,postRepository,postService,categoriesRepository})
    }


    getDataLayout = catchingAsyncAwait(async(req,res)=> {
        const params = this.convertParamsObject(req.query);
        const response = await getDataLayout(params,this.settingRepository)
        REQUEST_CUSTOM(res,'Get Data Layout Successfully',response)
    }) 



    getDataPostNew = catchingAsyncAwait(async(req,res)=> {
        const params = this.convertParamsObject(req.query);
        
        const response = await getDataNotify(params,this.postRepository)
        console.log(response,'response');
        const data = response.map(item => {
            item.timeMoment = moment(item.createdAt).locale('vi').format("HH:mm DD-MM-YYYY");
            return item
        })
       

         if(data && data.length != 0) {
            let stringKey = querystring.stringify(omit(params,'select','perPage','page')) || ''
            this.redisClient.setnx(
                CacheDynamic.POST_DATA_NEW_NOTIFY + '_' +  stringKey,
                JSON.stringify({data}), 
                60 * 5,
            )
        }
        
        REQUEST_CUSTOM(res,'Get Data Notify Successfully',data)
    }) 


    getDataCategoryNavbar = catchingAsyncAwait(async(req,res)=> {
        const id = req.params.id;
        const response = await getDataCategoryNav(id,this.categoriesRepository)
         if(response && response.length != 0) {     
            let stringKey = req.params.id || ''
            this.redisClient.setnx(
                CacheDynamic.CATEGORIES_DATA_NAVBAR + '_' +  stringKey,
                JSON.stringify(response), 
                60 * 5,
            )
        }
        
        REQUEST_CUSTOM(res,'Get Data CateTree Successfully', response)
    }) 




      
}


export default GeneralController;
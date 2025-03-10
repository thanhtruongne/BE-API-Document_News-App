import getDataLayout from '../../application/use_cases/generals/settings/getDataLayout.js';
import { REQUEST_CUSTOM } from "../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "./BaseController.js";

class GeneralController extends BaseController {
    constructor(settingRepository,generalService,redisClient){
        super({settingRepository,generalService,redisClient})
    }


    getDataLayout = catchingAsyncAwait(async(req,res)=> {
        const params = this.convertParamsObject(req.query);
        const response = await getDataLayout(params,this.settingRepository)
        REQUEST_CUSTOM(res,'Get Data Layout Successfully',response)
    }) 
    




      
}


export default GeneralController;
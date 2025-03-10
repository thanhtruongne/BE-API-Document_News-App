import getDataSetting from "../../../application/use_cases/admins/setting/getData.js";
import storeDataSetting from "../../../application/use_cases/admins/setting/storeData.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "../BaseController.js";


class settingController extends BaseController {
    constructor(settingRepository,redisClient){
        super({settingRepository,redisClient})
    }

    storeResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const logo = req.file;
        console.log(logo);
        if(logo)
            payload.logo = logo

        const response = await storeDataSetting(payload,this.settingRepository)
        REQUEST_CUSTOM(res,'Store thành công setting',response) 
    })

    getDataResource = catchingAsyncAwait(async(req,res,next) => {
        const params = this.convertParamsObject(req.query);

        const response = await getDataSetting(params,this.settingRepository)
        REQUEST_CUSTOM(res,'Get data thành công',response) 
    })
}



export default settingController    
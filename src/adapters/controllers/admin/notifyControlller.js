
import countDocumentNotify from "../../../application/use_cases/admins/notify/countDocumentNotify.js";
import getAllNotifyData from "../../../application/use_cases/admins/notify/getAllNotifyData.js";
import markAReadNotify from "../../../application/use_cases/admins/notify/markAReadNotify.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "../BaseController.js";



class notifyControlller extends BaseController {
    constructor(notifyRepository, redisClient) {
        super({ notifyRepository, redisClient })
    }



    getAllNotify = catchingAsyncAwait(async (req, res, next) => {
        const params = this.convertParamsObject(req.query);

        params.sort = { createdAt: 1, }

        const response = await getAllNotifyData(params, this.notifyRepository)
        REQUEST_CUSTOM(res, 'Get notify success', response)
    })

    markAReadNotify = catchingAsyncAwait(async (req, res, next) => {
        const { id } = req.params;
        const { type } = req.body
        await markAReadNotify(id, type, this.notifyRepository)

        const countQuery = await countDocumentNotify({ markAread: false }, this.notifyRepository);
        REQUEST_CUSTOM(res, 'MarkARead notify success', countQuery)
    })


}



export default notifyControlller
import changeStatus from "../../../application/use_cases/admins/categories/changeStatus.js";
import createData from "../../../application/use_cases/admins/categories/createData.js";
import getDataTree from "../../../application/use_cases/admins/categories/getDataTree.js";
import getDetailData from "../../../application/use_cases/admins/categories/getDetailData.js";
import removeResource from "../../../application/use_cases/admins/categories/removeResource.js";
import updateData from "../../../application/use_cases/admins/categories/updateData.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "../BaseController.js";


class categoriesController extends BaseController {
    constructor(categoriesRepository,redisClient){
        super({categoriesRepository,redisClient})
    }

    createResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const response = await createData(payload,this.categoriesRepository,this.routerRepository)
        REQUEST_CUSTOM(res,'Tạo danh mục thành công',response) 
    })

    updateResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const id = req.params.id
        const response = await updateData(id,payload,this.categoriesRepository,this.routerRepository)
        REQUEST_CUSTOM(res,'Update danh mục thành công',response) 
    })

    getTreeData = catchingAsyncAwait(async(req,res,next) => {
        const {id} = req.query  
        const response = await getDataTree(id,null,this.categoriesRepository)
        // if(response && response?.length > 0 && id == null) {
        //     this.redisClient.setnx(
        //         CacheDynamic.DATA_TREE_FORM_CATE,
        //         JSON.stringify(response),
        //         60 * 480
        //     )
        // }
        
        REQUEST_CUSTOM(res,'Get dataTree thành công',response) 
    })

    changeStatus = catchingAsyncAwait(async(req,res,next) => {
        const {status , _id} = req.body
        const response = await changeStatus(_id,status,this.categoriesRepository)
        REQUEST_CUSTOM(res,'Change status success',response) 
    })

    getDetailResource = catchingAsyncAwait(async(req,res,next) => {
        const { id } = req.params
        const response = await getDetailData(id,this.categoriesRepository)
        REQUEST_CUSTOM(res,'Get detail success',response) 
    })

    removeResource = catchingAsyncAwait(async(req,res,next) => {
        const { id } = req.params
        const response = await removeResource(id,this.categoriesRepository)
        REQUEST_CUSTOM(res,'Xóa thành công',response) 
    })
}



export default categoriesController
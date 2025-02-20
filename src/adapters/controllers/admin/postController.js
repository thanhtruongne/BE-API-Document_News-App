import createDataResourcePost from "../../../application/use_cases/admins/posts/createPost.js";
import { uploadResourceSingle } from "../../../config/cloudinary/uploadResource.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "./BaseController.js";



class postController extends BaseController {
    constructor(postCategory,redisClient){
        super({postCategory,redisClient})
    }

    createResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const thumb = req.file
        const { secure_url } = await uploadResourceSingle(thumb);payload.thumb = secure_url
        const response = await createDataResourcePost(payload,this.postCategory)
        REQUEST_CUSTOM(res,'Tạo bài viết thành công',response) 
    })

    // getTreeData = catchingAsyncAwait(async(req,res,next) => {
    //     const response = await getDataTree(null,this.categoriesRepository)
        
    //     REQUEST_CUSTOM(res,'Get dataTree thành công',response) 
    // })

    // changeStatus = catchingAsyncAwait(async(req,res,next) => {
    //     const {status , _id} = req.body
    //     const response = await changeStatus(_id,status,this.categoriesRepository)
    //     REQUEST_CUSTOM(res,'Change status success',response) 
    // })

    // getDetailResource = catchingAsyncAwait(async(req,res,next) => {
    //     const { id } = req.params
    //     const response = await getDetailData(id,this.categoriesRepository)
    //     REQUEST_CUSTOM(res,'Get detail success',response) 
    // })

    // removeResource = catchingAsyncAwait(async(req,res,next) => {
    //     const { id } = req.params
    //     const response = await removeResource(id,this.categoriesRepository)
    //     REQUEST_CUSTOM(res,'Xóa thành công',response) 
    // })
}



export default postController
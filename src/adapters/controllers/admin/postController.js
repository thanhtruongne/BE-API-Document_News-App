
import moment from "moment";
import countAll from "../../../application/use_cases/admins/posts/countAll.js";
import createDataResourcePost from '../../../application/use_cases/admins/posts/createPost.js';
import getData from "../../../application/use_cases/admins/posts/getData.js";
import getDetailResourceBlog from "../../../application/use_cases/admins/posts/getDetail.js";
import updateDataResource from "../../../application/use_cases/admins/posts/updateData.js";
import { generateImageURL } from "../../../config/cloudinary/uploadResource.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "../BaseController.js";



class postController extends BaseController {
    constructor(postRepository,redisClient,postService){
        super({postRepository,redisClient,postService})
    }

    createResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const files = req.files
        const response = await createDataResourcePost(payload,files,this.postRepository,this.routerRepository)
        REQUEST_CUSTOM(res,'Tạo bài viết thành công',response) 
    })



    getDataResource = catchingAsyncAwait(async(req,res,next) => {
        let { page } = req.body;
        const params = this.convertParamsObject(req.query);

        params.select = '-content -description -slug -comment'

        const data = await getData(req,params,this.postRepository,this.postService)
        let countAllData = await countAll(params,req,this.postRepository,this.postService)

        //thêm trg key để access theo lib fe
        const response  = data.map((item,key) => {
            item.timeMoment = moment(item.createdAt).format("HH:mm DD-MM-YYYY");
            item.imageURL = generateImageURL(item.thumb)
            item.key = key;
            delete item.thumb
            return item
        })

        const options = {
            page : page ?? params.page,
            totalItems : countAllData,
            totalPages : Math.ceil(countAllData / params.perPage),
            itemsPerPage :  params.perPage,
        }
        console.log(options,'options')

        // Cache
        // if(response && response.length != 0) {
        //     let stringKey = querystring.stringify(omit(params,'select','perPage','select')) || ' '
        //     this.redisClient.setnx(
        //         CacheDynamic.POST_ALL_DATA + '_' +  stringKey,
        //         JSON.stringify({response,options}), 
        //         60 * 5,
        //     )
        // }
        
        REQUEST_CUSTOM(res,'Get data success',response, options) 
    })

    // searchingDataEngineer = catchingAsyncAwait(async(req,res,next) => {
    //     const payload = req.body;
    //     const params = this.convertParamsObject(req.query);
        
    //     const data = await searchingDataPost(payload,this.postRepository,this.postService)

    //     let countAllData = await countAll(this.postService.searchingParamsService(payload),this.postRepository)

    //     const response  = data.map((item,key) => {
    //         item.timeMoment = moment(item.createdAt).format("HH:mm DD-MM-YYYY");
    //         item.imageURL = generateImageURL(item.thumb)
    //         item.key = key;
    //         delete item.thumb
    //         return item
    //     })

    //     const options = {
    //         totalItems : countAllData,
    //         totalPages : Math.ceil(countAllData / params.perPage),
    //         itemsPerPage :  params.perPage,
    //     }



    //     REQUEST_CUSTOM(res,'Searching data success',response,options) 
    // })

    getDetailResource = catchingAsyncAwait(async(req,res,next) => {
        const {id} = req.params;
        console.log(id,'id')
        const response = await getDetailResourceBlog(id,this.postRepository)
        REQUEST_CUSTOM(res,'Get detail success',response) 
    })

    updateDataResource = catchingAsyncAwait(async(req,res,next) => {
        const {id} = req.params;
        const payload = req.body
        const files = req.files
        const response = await updateDataResource(id,payload,files,this.postRepository,this.postService,this.routerRepository)
        REQUEST_CUSTOM(res,'Get detail success',response) 
    })
    
}



export default postController
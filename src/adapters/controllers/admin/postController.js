
import moment from "moment";
import querystring from 'querystring';
import countAll from "../../../application/use_cases/admins/posts/countAll.js";
import createDataResourcePost from '../../../application/use_cases/admins/posts/createPost.js';
import getData from "../../../application/use_cases/admins/posts/getData.js";
import getDetailResourceBlog from "../../../application/use_cases/admins/posts/getDetail.js";
import searchingDataPost from "../../../application/use_cases/admins/posts/searching.js";
import updateDataResource from "../../../application/use_cases/admins/posts/updateData.js";
import { generateImageURL, uploadMultipleResource, uploadResourceSingle } from "../../../config/cloudinary/uploadResource.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import CacheDynamic from '../../../utils/constants.js';
import { omit } from "../../../utils/index.utils.js";
import BaseController from "./BaseController.js";



class postController extends BaseController {
    constructor(postCategory,redisClient,postService){
        super({postCategory,redisClient,postService})
    }

    createResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const {thumb , images} = req.files
        if(images) {
            const imagesResponse = await uploadMultipleResource(images);
            delete payload.images
            payload.images = imagesResponse
        }
        const { public_id } = await uploadResourceSingle(thumb[0]);
        payload.thumb = public_id
        const response = await createDataResourcePost(payload,this.postCategory)
        REQUEST_CUSTOM(res,'Tạo bài viết thành công',response) 
    })



    getDataResource = catchingAsyncAwait(async(req,res,next) => {
        const params = this.convertParamsObject(req.query);
        params.select = '-content -description -slug -comment'
        const data = await getData(params,this.postCategory)
        let countAllData = await countAll(params,this.postCategory)

        //thêm trg key để access theo lib fe
        const response  = data.map((item,key) => {
            item.timeMoment = moment(item.createdAt).format("HH:mm DD-MM-YYYY");
            item.imageURL = generateImageURL(item.thumb)
            item.key = key;
            delete item.thumb
            return item
        })

        const options = {
            totalItems : countAllData,
            totalPages : Math.ceil(countAllData / params.perPage),
            itemsPerPage :  params.perPage,
        }

        // Cache
        if(response && response.length != 0) {
            let stringKey = querystring.stringify(omit(params,'select','perPage','select')) || ' '
            this.redisClient.setnx(
                CacheDynamic.POST_ALL_DATA + '_' +  stringKey,
                JSON.stringify({response,options}), 
                60 * 5,
            )
        }
        
        REQUEST_CUSTOM(res,'Get data success',response, options) 
    })

    searchingDataEngineer = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        console.log(payload);
        const response = await searchingDataPost(payload,this.postCategory)
        REQUEST_CUSTOM(res,'Searching data success',response) 
    })

    getDetailResource = catchingAsyncAwait(async(req,res,next) => {
        const {id} = req.params;
        console.log(id,'id')
        const response = await getDetailResourceBlog(id,this.postCategory)
        REQUEST_CUSTOM(res,'Get detail success',response) 
    })

    updateDataResource = catchingAsyncAwait(async(req,res,next) => {
        const {id} = req.params;
        const payload = req.body

        const response = await updateDataResource(id,payload,this.postCategory,this.postService)
        REQUEST_CUSTOM(res,'Get detail success',response) 
    })
    
}



export default postController
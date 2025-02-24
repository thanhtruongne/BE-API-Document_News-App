
import moment from "moment";
import querystring from 'querystring';
import countAll from "../../../application/use_cases/admins/posts/countAll.js";
import createDataResourcePost from "../../../application/use_cases/admins/posts/createPost.js";
import getData from "../../../application/use_cases/admins/posts/getData.js";
import searchingDataPost from "../../../application/use_cases/admins/posts/searching.js";
import { uploadResourceSingle } from "../../../config/cloudinary/uploadResource.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import CacheDynamic from '../../../utils/constants.js';
import { omit } from "../../../utils/index.utils.js";
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



    getDataResource = catchingAsyncAwait(async(req,res,next) => {
        const params = this.convertParamsObject(req.query);

        const data = await getData(params,this.postCategory)
        let countAllData = await countAll(params,this.postCategory)

        //thêm trg key để access theo lib fe
        const response  = data.map((item,key) => {
            item.timeMoment = moment(item.createdAt).format("HH:mm DD-MM-YYYY");
            item.key = key;
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
                60 * 480,
            )
        }
        
        REQUEST_CUSTOM(res,'Get data success',response, options) 
    })

    searchingDataEngineer = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const response = await searchingDataPost(payload,this.postCategory)
        REQUEST_CUSTOM(res,'Searching data success',response) 
    })
     
}



export default postController
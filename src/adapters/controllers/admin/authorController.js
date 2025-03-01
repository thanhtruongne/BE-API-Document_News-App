import countAllDataAuthor from "../../../application/use_cases/admins/authors/countAll.js";
import createDataAuthor from "../../../application/use_cases/admins/authors/create.js";
import getAllDataAuthor from "../../../application/use_cases/admins/authors/getDataAll.js";
import countAllDataRoleAuthor from "../../../application/use_cases/admins/authors/roles/countAll.js";
import createDataRoleAuthor from "../../../application/use_cases/admins/authors/roles/createData.js";
import getAllDataRoleAuthor from "../../../application/use_cases/admins/authors/roles/getData.js";
import getDetailRoleAuthorByID from "../../../application/use_cases/admins/authors/roles/getDetail.js";
import { REQUEST_CUSTOM } from "../../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../../helpers/catchingAsyncAwait.aysnc.js";
import BaseController from "./BaseController.js";


class authorController extends BaseController {
    constructor(authorRepository,redisClient){
        super({authorRepository,redisClient})
    }

    createResource = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const avatar  = req.file; payload.avatar = avatar
        console.log(payload,'payload');
        const response = await createDataAuthor(payload,this.authorRepository)
        REQUEST_CUSTOM(res,'Create resource successfully',response) 
    })

    getDataResourceAuthor = catchingAsyncAwait(async(req,res,next) => {
        const params = this.convertParamsObject(req.query);

        const response = await getAllDataAuthor(params,this.authorRepository)
        const countData = await countAllDataAuthor(params,this.authorRepository);
     

        const options = {
            totalItems : countData,
            totalPages : Math.ceil(countData / params.perPage),
            itemsPerPage :  params.perPage,
        }

        REQUEST_CUSTOM(res,'Get Data resource successfully',response,options) 
    })


    craeteResourceRoleAuthor = catchingAsyncAwait(async(req,res,next) => {
        const payload = req.body;
        const response = await createDataRoleAuthor(payload,this.authorRepository)
        REQUEST_CUSTOM(res,'Create resource successfully',response) 
    })



    getDataRoleAuthor = catchingAsyncAwait(async(req,res,next) => {
        const params = this.convertParamsObject(req.query);
        
        const data = await getAllDataRoleAuthor(params,this.authorRepository)
        const countData = await countAllDataRoleAuthor(params,this.authorRepository);

        const response  = data.map((item,key) => {
            item.label = item.title
            item.key = key;
            item.value = item?._id
            delete item?._id
            delete item.title
            return item
        })

        
        const options = {
            totalItems : countData,
            totalPages : Math.ceil(countData / params.perPage),
            itemsPerPage :  params.perPage,
        }
   
        REQUEST_CUSTOM(res,'Get data resource successfully',response,options) 
    })





    getDataByQueryID = catchingAsyncAwait(async(req,res,next) => {
       const {id} = req.params
       const response = await getDetailRoleAuthorByID(id,this.authorRepository)
       REQUEST_CUSTOM(res,'Get detail data success',response,options) 
    })






}



export default authorController
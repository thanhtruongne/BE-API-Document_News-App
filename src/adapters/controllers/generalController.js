import moment from 'moment/moment.js';
import querystring from 'querystring';
import checkExistsMail from '../../application/use_cases/generals/auths/checkExistsMail.js';
import loginForm from '../../application/use_cases/generals/auths/loginForm.js';
import registerForm from '../../application/use_cases/generals/auths/registerForm.js';
import getDataCategoryNav from '../../application/use_cases/generals/category/getDataCategoryNavnar.js';
import changeStatusComment from '../../application/use_cases/generals/posts/comment/changeStatus.js';
import deleteComment from '../../application/use_cases/generals/posts/comment/deleteComment.js';
import getCommentQuery from '../../application/use_cases/generals/posts/comment/getCommentQuery.js';
import getMoreReply from '../../application/use_cases/generals/posts/comment/getMoreReply.js';
import storeComment from '../../application/use_cases/generals/posts/comment/storeComment.js';
import getDataContentPage from '../../application/use_cases/generals/posts/getDataContentPage.js';
import getDataNotify from '../../application/use_cases/generals/posts/getDataNotify.js';
import getDataRouterSlug from '../../application/use_cases/generals/Router/getDataRouterSlug.js';
import getDataLayout from '../../application/use_cases/generals/settings/getDataLayout.js';
import changeFieldsData from '../../application/use_cases/generals/users/changeFields.js';
import { REQUEST_CUSTOM } from "../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../helpers/catchingAsyncAwait.aysnc.js";
import CacheDynamic from '../../utils/constants.js';
import { omit } from '../../utils/index.utils.js';
import BaseController from "./BaseController.js";



class GeneralController extends BaseController {
    constructor(
        userRepository,
        authService,
        settingRepository,
        generalService,
        postRepository,
        postService,
        categoriesRepository,
        commentRepository,
        redisClient,
        socketService,
        notifyRepository
    ){
        super({
            userRepository,
            authService,
            settingRepository,
            generalService,
            redisClient,
            postRepository,
            postService,
            categoriesRepository,
            commentRepository,
            socketService,
            notifyRepository
        })
    }


    getDataLayout = catchingAsyncAwait(async(req,res)=> {
        const params = this.convertParamsObject(req.query);
        const response = await getDataLayout(params,this.settingRepository)
        REQUEST_CUSTOM(res,'Get Data Layout Successfully',response)
    }) 



    getDataPostNew = catchingAsyncAwait(async(req,res)=> {
        const params = this.convertParamsObject(req.query);
        
        const response = await getDataNotify(params,this.postRepository)
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

    getContentPageData =  catchingAsyncAwait(async(req,res)=> {
        const response = await getDataContentPage(null,this.categoriesRepository,this.postRepository,this.postService);

        if(response && response.length != 0) {     
            let stringKey = req.params.id || ''
            this.redisClient.setnx(
                CacheDynamic.POST_DATA_CONTENT_PAGE_SIDE + '_' +  stringKey,
                JSON.stringify(response), 
                60 * 200,
            )
        }

        REQUEST_CUSTOM(res,'Get Data Successfully', response)
    }) 

    getDataSlugRouter = catchingAsyncAwait(async(req,res)=> {
        const slug = req.params.slug
        const response = await getDataRouterSlug(
            slug,
            this.routerRepository,
            this.postRepository,
            this.categoriesRepository,
            this.commentRepository
        );
        
        

        REQUEST_CUSTOM(res,'Get Data Successfully', response)
    }) 


    storeCommentBlog = catchingAsyncAwait(async(req,res)=> {
        const id = req.params.id
        const payload = req.body
        const response = await storeComment(id,payload,this.commentRepository,this.postRepository)

        REQUEST_CUSTOM(res,'Successfully', response)
    }) 

    deleteCommentBlog = catchingAsyncAwait(async(req,res)=> {
        const id = req.params.id
        const response = await deleteComment(id,this.commentRepository)

        REQUEST_CUSTOM(res,'Delete Successfully', response)
    }) 

    changeStatusComment = catchingAsyncAwait(async(req,res)=> {
        const id = req.params.id
        const payload = req.body
        const response = await changeStatusComment(id,payload,this.commentRepository)

        REQUEST_CUSTOM(res,'Change payload successfully', response)
    }) 

    getMoreReplyComment = catchingAsyncAwait(async(req,res)=> {
        const {id} = req.params
        const response = await getMoreReply(id,this.commentRepository)

        REQUEST_CUSTOM(res,'Get more reply successfully', response)
    })  

    getCommentQueryBlog = catchingAsyncAwait(async(req,res)=> {
        const id = req.params.id;

        const response = await getCommentQuery(id,this.commentRepository)

        REQUEST_CUSTOM(res,'Get comment newest successfully', response)
    })  


    //Authencated
    checkEmailExists = catchingAsyncAwait(async(req,res)=> {
        const {email} = req.query
        const response = await checkExistsMail(email,this.userRepository)

        REQUEST_CUSTOM(res,'Check success mail', response)
    })

    loginForm = catchingAsyncAwait(async(req,res)=> {
        const payload = req.body
        const response = await loginForm(payload,this.userRepository,this.authService)

        REQUEST_CUSTOM(res,'Login success', response)
    })

    registerForm = catchingAsyncAwait(async(req,res)=> {
        const payload = req.body
        const response = await registerForm(payload,this.userRepository,this.authService)

        REQUEST_CUSTOM(res,'Register success', response)
    })


    changeFieldsDataUser = catchingAsyncAwait(async(req,res)=> {
        const payload = req.body;
        payload.avatar = req.file || null
        console.log(payload,'payloadpayloadpayloadpayload')
        const {id} =  req.params
        const response = await changeFieldsData(id,payload,this.userRepository,this.authService)

        REQUEST_CUSTOM(res,'Update thành công', response)
    })
}


export default GeneralController;
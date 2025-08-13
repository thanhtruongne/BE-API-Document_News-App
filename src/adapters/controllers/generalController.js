import moment from 'moment/moment.js';
import mongoose from 'mongoose';
import querystring from 'querystring';
import checkExistsMail from '../../application/use_cases/generals/auths/checkExistsMail.js';
import loginForm from '../../application/use_cases/generals/auths/loginForm.js';
import logOutForm from '../../application/use_cases/generals/auths/logOutForm.js';
import registerForm from '../../application/use_cases/generals/auths/registerForm.js';
import getDataCategoryNav from '../../application/use_cases/generals/category/getDataCategoryNavnar.js';
import countComment from '../../application/use_cases/generals/posts/comment/countComment.js';
import getCommentQuery from '../../application/use_cases/generals/posts/comment/getCommentQuery.js';
import getMoreReply from '../../application/use_cases/generals/posts/comment/getMoreReply.js';
import likeComment from '../../application/use_cases/generals/posts/comment/likeComment.js';
import storeComment from '../../application/use_cases/generals/posts/comment/storeComment.js';
import getDataContentPage from '../../application/use_cases/generals/posts/getDataContentPage.js';
import getDataNotify from '../../application/use_cases/generals/posts/getDataNotify.js';
import savePost from '../../application/use_cases/generals/posts/post-like/savePost.js';
import getDataRouterSlug from '../../application/use_cases/generals/Router/getDataRouterSlug.js';
import getDataLayout from '../../application/use_cases/generals/settings/getDataLayout.js';
import changeFieldsData from '../../application/use_cases/generals/users/changeFields.js';
import { REQUEST_CUSTOM } from "../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../helpers/catchingAsyncAwait.aysnc.js";
import CacheDynamic from '../../utils/constants.js';
import { convertSortToQueryString, omit } from '../../utils/index.utils.js';
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
        notifyRepository,
    ) {
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
            notifyRepository,
        })
    }


    getDataLayout = catchingAsyncAwait(async (req, res) => {
        const params = this.convertParamsObject(req.query);
        const response = await getDataLayout(params, this.settingRepository)
        REQUEST_CUSTOM(res, 'Get Data Layout Successfully', response)
    })



    getDataPostNew = catchingAsyncAwait(async (req, res) => {
        const params = this.convertParamsObject(req.query);

        const response = await getDataNotify(params, this.postRepository)
        const data = response.map(item => {
            item.timeMoment = moment(item.createdAt).locale('vi').format("HH:mm DD-MM-YYYY");
            return item
        })


        if (data && data.length != 0) {
            let stringKey = querystring.stringify(omit(params, 'select', 'perPage', 'page')) || ''
            this.redisClient.setnx(
                CacheDynamic.POST_DATA_NEW_NOTIFY + '_' + stringKey,
                JSON.stringify({ data }),
                60 * 5,
            )
        }

        REQUEST_CUSTOM(res, 'Get Data Notify Successfully', data)
    })


    getDataCategoryNavbar = catchingAsyncAwait(async (req, res) => {
        const id = req.params.id;
        const response = await getDataCategoryNav(id, this.categoriesRepository)
        if (response && response.length != 0) {
            let stringKey = req.params.id || ''
            this.redisClient.setnx(
                CacheDynamic.CATEGORIES_DATA_NAVBAR + '_' + stringKey,
                JSON.stringify(response),
                60 * 5,
            )
        }

        REQUEST_CUSTOM(res, 'Get Data CateTree Successfully', response)
    })

    getContentPageData = catchingAsyncAwait(async (req, res) => {
        const response = await getDataContentPage(null, this.categoriesRepository, this.postRepository, this.postService);

        if (response && response.length != 0) {
            let stringKey = req.params.id || ''
            this.redisClient.setnx(
                CacheDynamic.POST_DATA_CONTENT_PAGE_SIDE + '_' + stringKey,
                JSON.stringify(response),
                60 * 200,
            )
        }

        REQUEST_CUSTOM(res, 'Get Data Successfully', response)
    })

    getDataSlugRouter = catchingAsyncAwait(async (req, res) => {
        const slugs = req.params.path;
        const userID = req?.user?.userID;

        const response = await getDataRouterSlug(
            userID,
            slugs,
            this.routerRepository,
            this.postRepository,
            this.categoriesRepository,
            this.userRepository,
            this.redisClient
        );


        REQUEST_CUSTOM(res, 'Get Data Successfully', response)
    })


    storeCommentBlog = catchingAsyncAwait(async (req, res) => {
        const id = req.params.id
        const payload = req.body
        const data = await storeComment(id, req.user, payload, this.commentRepository, this.postRepository, this.notifyRepository)

        // send notify
        if (data?.notify) {
            const notify = data?.notify;
            const posts = data?.posts;
            this.socketService.emit('notify_admin', {
                notify_id: notify?._id,
                markAread: notify?.markAread,
                content: notify?.content,
                subject: notify?.subject,
                url: notify?.url,
                post_title: posts.title,
                post_image: posts.imageURL,
                post_id: posts._id,
                post_slug: posts.slug,
                comment_content: data?.comment.content,
                id: data?.comment?._id,
                comment_nickname: data?.comment?.full_name
            })
        }

        REQUEST_CUSTOM(res, 'Bình luận đang chờ phê duyệt.')
    })


    getMoreReplyComment = catchingAsyncAwait(async (req, res) => {
        const { id } = req.params
        const response = await getMoreReply(id, this.commentRepository)

        REQUEST_CUSTOM(res, 'Get more reply successfully', response)
    })

    getCommentQueryBlog = catchingAsyncAwait(async (req, res) => {
        const id = req.params.id;
        const params = this.convertParamsObject(req.query)
        params.sort = { createdAt: req.query.sort == 'newest' ? 1 : -1 };
        const response = await getCommentQuery(id, params, req?.user?.userID, this.commentRepository)

        const skip = (params.page - 1) * params.limit
        const countDocument = await countComment({
            postId: new mongoose.Types.ObjectId(id),
            status: 'Active'
        }, this.commentRepository);

        const options = {
            totalComment: response['countData'],
            page: params.page,
            offset: params.offset,
            totalAll: countDocument,
            limit: params.limit,
            hasMore: skip + response['countData'] < countDocument
        }

        if (response['data'] && response['data'].length != 0) {
            let stringKey = convertSortToQueryString(params.sort, omit(params, 'perPage', 'sort'))
            this.redisClient.setnx(
                CacheDynamic.POST_COMMENT_QUERY + '_' + stringKey,
                JSON.stringify({ data: response['data'], options }),
                60 * 3,
            )
        }
        REQUEST_CUSTOM(res, 'Get comment newest successfully', response['data'], options)
    })


    //Authencated
    checkEmailExists = catchingAsyncAwait(async (req, res) => {
        const { email } = req.query
        const response = await checkExistsMail(email, this.userRepository)

        REQUEST_CUSTOM(res, 'Check success mail', response)
    })

    loginForm = catchingAsyncAwait(async (req, res) => {
        console.log(req, 'asdasdsassssssssssssssssss')
        const payload = req.body
        const response = await loginForm(payload, this.userRepository, this.authService)

        REQUEST_CUSTOM(res, 'Login success', response)
    })

    registerForm = catchingAsyncAwait(async (req, res) => {
        const payload = req.body
        const response = await registerForm(payload, this.userRepository, this.authService)

        REQUEST_CUSTOM(res, 'Register success', response)
    })

    logOutForm = catchingAsyncAwait(async (req, res) => {
        const response = await logOutForm(req.store, this.userRepository)

        REQUEST_CUSTOM(res, 'Logout success', response)
    })


    changeFieldsDataUser = catchingAsyncAwait(async (req, res) => {
        const payload = req.body;
        payload.avatar = req.file || null
        const { id } = req.params
        const response = await changeFieldsData(id, payload, this.userRepository, this.authService)

        REQUEST_CUSTOM(res, 'Update thành công', response)
    })

    handleLikeCommentPost = catchingAsyncAwait(async (req, res) => {
        const { id } = req.params
        const { postId } = req.body
        const response = await likeComment(id, postId, req.user, this.commentRepository)

        REQUEST_CUSTOM(res, 'UnLike comment Post success', response)
    })

    handleSaveOrUnSavePost = catchingAsyncAwait(async (req, res) => {
        const { id } = req.params
        const response = await savePost(id, req.user, this.userRepository)

        REQUEST_CUSTOM(res, response ? 'Lưu bài viết thành công' : "Bỏ lưu thành công", response, {
            code: response ? "success" : "warning"
        })
    })
}

export default GeneralController;
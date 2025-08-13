import express from 'express'
import GeneralController from "../../../adapters/controllers/generalController.js"
import categoriesRepositoriesApp from "../../../application/repositories/categoriesRepositories.app.js"
import commentRepositoriesApp from "../../../application/repositories/commentRepositories.app.js"
import notifyRepositoriesApp from "../../../application/repositories/notifyRepositories.app.js"
import postRepositoriesApp from "../../../application/repositories/postCategoriesRepositories.app.js"
import settingRepositoriesApp from "../../../application/repositories/settingRepositories.app.js"
import userRepositoriesApp from "../../../application/repositories/userRepositories.app.js"
import authServiceApp from "../../../application/services/authService.js"
import generalServiceApp from "../../../application/services/generalService.js"
import postServiceApp from "../../../application/services/postServiceApp.js"
import uploadData from "../../../config/cloudinary/multer.js"
import { authencation, optionalAuth } from "../../../utils/auth.utils.js"
import CacheDynamic from '../../../utils/constants.js'
import categoriesRepositoriesDB from "../../databases/mongoDB/repositories/categoriesRepositoriesDB.js"
import commentRepositoriesDB from "../../databases/mongoDB/repositories/commentRepositoriesDB.js"
import notifyRepositoriesDB from "../../databases/mongoDB/repositories/notifyRepositoriesDB.js"
import postRepositoriesDB from "../../databases/mongoDB/repositories/postRepositoriesDB.js"
import settingReposotoriesDB from "../../databases/mongoDB/repositories/settingReposotoriesDB.js"
import userRepositoriesDB from "../../databases/mongoDB/repositories/userRepositoriesDB.js"
import authServicesFrame from "../../services/authService.js"
import generalService from "../../services/generalService.js"
import postService from "../../services/postService.js"
import { CatchingCategoryData, CatchingRenderData } from "../middlewares/redis/index.js"


export default class GeneralRoutes {


   constructor(redisCli, socket) {
      this.router = express.Router();
      this.redisCli = redisCli;
      this.socket = socket;
   }



   routes() {
      const generalControllerInit = new GeneralController(
         userRepositoriesApp(userRepositoriesDB()),
         authServiceApp(authServicesFrame()),
         settingRepositoriesApp(settingReposotoriesDB()),
         generalServiceApp(generalService()),
         postRepositoriesApp(postRepositoriesDB()),
         postServiceApp(postService()),
         categoriesRepositoriesApp(categoriesRepositoriesDB()),
         commentRepositoriesApp(commentRepositoriesDB()),
         this.redisCli,
         this.socket,
         notifyRepositoriesApp(notifyRepositoriesDB()),
      )

      this.router.get('/author/check-email', generalControllerInit.checkEmailExists)

      this.router.post('/author/login', generalControllerInit.loginForm)

      this.router.post('/author/register', generalControllerInit.registerForm)

      this.router.post('/author/logout', generalControllerInit.logOutForm)

      this.router.get('/setting/get-data-layout', generalControllerInit.getDataLayout)

      this.router.get('/post/getData', [CatchingRenderData(this.redisCli, CacheDynamic.POST_DATA_NEW_NOTIFY)], generalControllerInit.getDataPostNew)

      this.router.get('/categories/getData', [CatchingCategoryData(this.redisCli, CacheDynamic.CATEGORIES_DATA_NAVBAR)], generalControllerInit.getDataCategoryNavbar)

      this.router.get('/post/getContent-data', [CatchingCategoryData(this.redisCli, CacheDynamic.POST_DATA_CONTENT_PAGE_SIDE)], generalControllerInit.getContentPageData);

      this.router.get('/post/comment/getMoreReply/:id', generalControllerInit.getMoreReplyComment)

      this.router.get('/post/comment/getCommentByQuery/:id', [CatchingCategoryData(this.redisCli, CacheDynamic.POST_COMMENT_QUERY)], generalControllerInit.getCommentQueryBlog)

      this.router.get('/:path(*)', optionalAuth, generalControllerInit.getDataSlugRouter)

      this.#routesAuthencate(generalControllerInit);
      return this.router
   }


   #routesAuthencate(generalControllerInit) {
      this.router.use(authencation) // authencated

      //comment
      this.router.post('/post/comment/store/:id', generalControllerInit.storeCommentBlog)
      this.router.post('/post/comment/like/:id', generalControllerInit.handleLikeCommentPost)

      //save post
      this.router.post('/post/save-or-unsave/:id', generalControllerInit.handleSaveOrUnSavePost)
      //user detail
      this.router.put('/user/changeFields/:id', uploadData.single('avatar'), generalControllerInit.changeFieldsDataUser)



      return this.router
   }
}
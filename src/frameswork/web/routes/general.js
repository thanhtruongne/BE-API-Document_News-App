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



const generalRouter = (express,redisCli,socketService) =>  {
   const router = express.Router()  

   //load depend
   const generalControllerInit = new GeneralController(
      userRepositoriesApp(userRepositoriesDB()),
      authServiceApp(authServicesFrame()),
      settingRepositoriesApp(settingReposotoriesDB()),
      generalServiceApp(generalService()),
      postRepositoriesApp(postRepositoriesDB()),
      postServiceApp(postService()),
      categoriesRepositoriesApp(categoriesRepositoriesDB()),
      commentRepositoriesApp(commentRepositoriesDB()),
      redisCli,
      socketService,
      notifyRepositoriesApp(notifyRepositoriesDB())
   )

   // console.log(socketService,'sockerService')


   //authen
   router.get('/author/check-email',generalControllerInit.checkEmailExists)

   router.post('/author/login',generalControllerInit.loginForm)

   router.post('/author/register',generalControllerInit.registerForm)


   router.get('/setting/get-data-layout',generalControllerInit.getDataLayout)
   
   router.get('/post/getData',[CatchingRenderData(redisCli,CacheDynamic.POST_DATA_NEW_NOTIFY)],generalControllerInit.getDataPostNew)

   router.get('/categories/getData',[CatchingCategoryData(redisCli,CacheDynamic.CATEGORIES_DATA_NAVBAR)],generalControllerInit.getDataCategoryNavbar)
   
   router.get('/post/getContent-data',[CatchingCategoryData(redisCli,CacheDynamic.POST_DATA_CONTENT_PAGE_SIDE)],generalControllerInit.getContentPageData);


   router.get('/:slug',generalControllerInit.getDataSlugRouter)

   router.post('/post/comment/store/:id',generalControllerInit.storeCommentBlog)

   router.get('/post/comment/getMoreReply/:id',generalControllerInit.getMoreReplyComment)

   router.delete('/post/comment/delete/:id',generalControllerInit.deleteCommentBlog)

   router.get('/post/comment/getCommentByQuery/:id',generalControllerInit.getCommentQueryBlog)

   router.put('/post/comment/changeStatus/:id',generalControllerInit.changeStatusComment)


  //user detail
   router.put('/user/changeFields/:id',uploadData.single('avatar'),generalControllerInit.changeFieldsDataUser)


   return router
}


export default generalRouter        
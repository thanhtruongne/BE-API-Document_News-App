import GeneralController from "../../../adapters/controllers/generalController.js"
import categoriesRepositoriesApp from "../../../application/repositories/categoriesRepositories.app.js"
import postRepositoriesApp from "../../../application/repositories/postCategoriesRepositories.app.js"
import settingRepositoriesApp from "../../../application/repositories/settingRepositories.app.js"
import generalServiceApp from "../../../application/services/generalService.js"
import postServiceApp from "../../../application/services/postServiceApp.js"
import CacheDynamic from '../../../utils/constants.js'
import categoriesRepositoriesDB from "../../databases/mongoDB/repositories/categoriesRepositoriesDB.js"
import postRepositoriesDB from "../../databases/mongoDB/repositories/postRepositoriesDB.js"
import settingReposotoriesDB from "../../databases/mongoDB/repositories/settingReposotoriesDB.js"
import generalService from "../../services/generalService.js"
import postService from "../../services/postService.js"
import { CatchingCategoryData, CatchingRenderData } from "../middlewares/redis/index.js"

const generalRouter = (express,redisCli) => {
   const router = express.Router()  

   //load depend

   const generalControllerInit = new GeneralController(
      settingRepositoriesApp(settingReposotoriesDB()),
      generalServiceApp(generalService()),
      postRepositoriesApp(postRepositoriesDB()),
      postServiceApp(postService()),
      categoriesRepositoriesApp(categoriesRepositoriesDB()),
      redisCli
   )
   

   router.get('/setting/get-data-layout',generalControllerInit.getDataLayout)
   
   router.get('/post/getData',[CatchingRenderData(redisCli,CacheDynamic.POST_DATA_NEW_NOTIFY)],generalControllerInit.getDataPostNew)

   router.get('/categories/getData',[CatchingCategoryData(redisCli,CacheDynamic.CATEGORIES_DATA_NAVBAR)],generalControllerInit.getDataCategoryNavbar)
   
   router.get('/post/getContent-data',[CatchingCategoryData(redisCli,CacheDynamic.POST_DATA_CONTENT_PAGE_SIDE)],generalControllerInit.getContentPageData);


   router.get('/:slug',generalControllerInit.getDataSlugRouter)


   return router
}


export default generalRouter     
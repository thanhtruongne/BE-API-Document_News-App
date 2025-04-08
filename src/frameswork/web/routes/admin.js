import express from 'express'
import authorController from "../../../adapters/controllers/admin/authorController.js"
import categoriesController from "../../../adapters/controllers/admin/categoriesController.js"
import postController from "../../../adapters/controllers/admin/postController.js"
import settingController from "../../../adapters/controllers/admin/settingController.js"
import userController from '../../../adapters/controllers/admin/userController.js'
import authorRepositoriesApp from "../../../application/repositories/authorRepositories.app.js"
import categoriesRepositoriesApp from "../../../application/repositories/categoriesRepositories.app.js"
import postCategoriesRepositoriesapp from "../../../application/repositories/postCategoriesRepositories.app.js"
import settingRepositoriesApp from "../../../application/repositories/settingRepositories.app.js"
import userRepositoriesApp from '../../../application/repositories/userRepositories.app.js'
import authServiceApp from '../../../application/services/authService.js'
import postServiceApp from "../../../application/services/postServiceApp.js"
import uploadData from "../../../config/cloudinary/multer.js"
import { AuthencatedProvideAdmin, authencation } from "../../../utils/auth.utils.js"
import CacheDynamic from '../../../utils/constants.js'
import auhthorRepositoriesDB from "../../databases/mongoDB/repositories/auhthorRepositoriesDB.js"
import categoriesRepositoriesDB from "../../databases/mongoDB/repositories/categoriesRepositoriesDB.js"
import postRepositoriesDB from "../../databases/mongoDB/repositories/postRepositoriesDB.js"
import settingReposotoriesDB from "../../databases/mongoDB/repositories/settingReposotoriesDB.js"
import userRepositoryDB from '../../databases/mongoDB/repositories/userRepositoriesDB.js'
import authServicesFrame from '../../services/authService.js'
import postService from "../../services/postService.js"
import { CatchingCategoryData, CatchingRenderData } from "../middlewares/redis/index.js"


export default class AdminRouter {

   constructor(redisCli,socket) {
      this.router = express.Router();
      this.redisCli = redisCli;
      this.socket = socket;
      this.upload = uploadData
   }

   routes() {
      this.router.use([authencation,AuthencatedProvideAdmin]) // set middleware
      this.#userRoutesService();
      this.#categoryRouterService();
      this.#postRouterService();
      this.#authorRouterService();
      this.#settingRouterService();

      return this.router
   }



   #userRoutesService() {
      const userControllerInit = new userController(
         userRepositoriesApp(userRepositoryDB()),
         authServiceApp(authServicesFrame()),
         this.redisCli
      )

      //User Routes
      // getlist
      this.router.get('/user/get-userData-all',[CatchingRenderData(this.redisCli,CacheDynamic.USER_ALL_DATA)],userControllerInit.getDataAllUser)
      //create
      this.router.post('/user/store',this.upload.single('avatar'),userControllerInit.createResource)
      //update
      this.router.post('/user/update/:id',userControllerInit.updateUserPayload)
      //get detail
      this.router.get('/user/detail/:id',userControllerInit.getDetailUser)
      //delete
      this.router.delete('/user/delete/:id',userControllerInit.removeResource)
      
      return this.router  
   }

   #categoryRouterService() {
      const categoriesControllerInit = new categoriesController(
         categoriesRepositoriesApp(categoriesRepositoriesDB()),
         this.redisCli
      )
   
      this.router.post('/categories/store',categoriesControllerInit.createResource)
      this.router.put('/categories/update/:id',categoriesControllerInit.updateResource)
      // this.router.get('/categories/getAll',categoriesControllerInit.getTreeData)
      
      this.router.get('/categories/treeData',[CatchingCategoryData(this.redisCli,CacheDynamic.DATA_TREE_FORM_CATE)],categoriesControllerInit.getTreeData)

      this.router.post('/categories/changeStatus',categoriesControllerInit.changeStatus)

      this.router.get('/categories/detail/:id',categoriesControllerInit.getDetailResource)

      this.router.delete('/categories/remove/:id',categoriesControllerInit.removeResource)

      return this.router  
   }


   #postRouterService() {
      const postControllerInit = new postController(
            postCategoriesRepositoriesapp(postRepositoriesDB()),
            this.redisCli,
            postServiceApp(postService())
      )
   
      this.router.post('/post/store',this.upload.fields([{name : "thumb" , maxCount : 1} , {name : "images", maxCount: 10},{name : "videos", maxCount : 1}]),postControllerInit.createResource);
      this.router.get('/post/detail/:id',postControllerInit.getDetailResource)
      this.router.post('/post/getData',[CatchingRenderData(this.redisCli,CacheDynamic.POST_ALL_DATA)],postControllerInit.getDataResource);
      // this.router.post('/post/searchingData',postControllerInit.searchingDataEngineer)
      this.router.put('/post/update/:id',this.upload.fields([{name : "thumb" , maxCount : 1} , {name : "images", maxCount: 10},{name : "videos", maxCount : 1}]),postControllerInit.updateDataResource)
    
      return this.router  
   }

   #authorRouterService() {
      const authorControllerInit = new authorController(
         authorRepositoriesApp(auhthorRepositoriesDB()),
         this.redisCli
      )
  
      this.router.post('/author/store',this.upload.single('avatar'),authorControllerInit.createResource)
      this.router.get('/author/getData',authorControllerInit.getDataResourceAuthor)
      this.router.get('/author/get-detail/:id',authorControllerInit.getDetailAuthorData)
      //roleAuthor
      this.router.post('/author/roles/store',authorControllerInit.craeteResourceRoleAuthor)
      this.router.get('/author/roles/getData',authorControllerInit.getDataRoleAuthor)
      this.router.get('/author/roles/detail/:id',authorControllerInit.getDataByQueryID)
      this.router.put('/author/changeStatus',authorControllerInit.changeStatusAuthorResource)
  
      return this.router  
   }

   #settingRouterService(){
      const settingControllerInit = new settingController(
         settingRepositoriesApp(settingReposotoriesDB()),
         this.redisCli
      )
       //setting
       this.router.get('/setting/getData',settingControllerInit.getDataResource)
       this.router.put('/setting/storeData',this.upload.single('logo'),settingControllerInit.storeResource)

       return this.router  
   }
}
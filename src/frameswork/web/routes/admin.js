import authorController from "../../../adapters/controllers/admin/authorController.js"
import categoriesController from "../../../adapters/controllers/admin/categoriesController.js"
import postController from "../../../adapters/controllers/admin/postController.js"
import settingController from "../../../adapters/controllers/admin/settingController.js"
import userController from "../../../adapters/controllers/admin/userController.js"
import authorRepositoriesApp from "../../../application/repositories/authorRepositories.app.js"
import categoriesRepositoriesApp from "../../../application/repositories/categoriesRepositories.app.js"
import postCategoriesRepositoriesapp from "../../../application/repositories/postCategoriesRepositories.app.js"
import settingRepositoriesApp from "../../../application/repositories/settingRepositories.app.js"
import userRepositoriesApp from "../../../application/repositories/userRepositories.app.js"
import authServiceApp from "../../../application/services/authService.js"
import postServiceApp from "../../../application/services/postServiceApp.js"
import uploadData from "../../../config/cloudinary/multer.js"
import { AuthencatedProvideAdmin, authencation } from "../../../utils/auth.utils.js"
import CacheDynamic from '../../../utils/constants.js'
import auhthorRepositoriesDB from "../../databases/mongoDB/repositories/auhthorRepositoriesDB.js"
import categoriesRepositoriesDB from "../../databases/mongoDB/repositories/categoriesRepositoriesDB.js"
import postRepositoriesDB from "../../databases/mongoDB/repositories/postRepositoriesDB.js"
import settingReposotoriesDB from "../../databases/mongoDB/repositories/settingReposotoriesDB.js"
import userRepositoryDB from "../../databases/mongoDB/repositories/userRepositoriesDB.js"
import authServicesFrame from "../../services/authService.js"
import postService from "../../services/postService.js"
import { CatchingCategoryData, CatchingRenderData } from "../middlewares/redis/index.js"


const adminRouter = (express,redisCli) => {
    const router = express.Router()  

    //Init userControllers khoi tao intt voi baseController
    const userControllerInit = new userController(
        userRepositoriesApp(userRepositoryDB()),
        authServiceApp(authServicesFrame()),
        redisCli
    ) 
    
    
    router.use([authencation,AuthencatedProvideAdmin]);


    //User Routes
    // getlist
    router.get('/user/get-userData-all',[CatchingRenderData(redisCli,CacheDynamic.USER_ALL_DATA)],userControllerInit.getDataAllUser)
    //create
    router.post('/user/store',uploadData.single('avatar'),userControllerInit.createResource)
    //update
    router.post('/user/update/:id',userControllerInit.updateUserPayload)
    //get detail
    router.get('/user/detail/:id',userControllerInit.getDetailUser)
    //delete
    router.delete('/user/delete/:id',userControllerInit.removeResource)


    const categoriesControllerInit = new categoriesController(
      categoriesRepositoriesApp(categoriesRepositoriesDB()),
      redisCli
    )

    // console.log(categoriesControllerInit,categoriesRepositoriesApp(categoriesRepositoriesDB()),'test')

    //Categories Routes
    router.post('/categories/store',categoriesControllerInit.createResource)

    // router.get('/categories/getAll',categoriesControllerInit.getTreeData)
     
    router.get('/categories/treeData',[CatchingCategoryData(redisCli,CacheDynamic.DATA_TREE_FORM_CATE)],categoriesControllerInit.getTreeData)

    router.post('/categories/changeStatus',categoriesControllerInit.changeStatus)

    router.get('/categories/detail/:id',categoriesControllerInit.getDetailResource)

    router.delete('/categories/remove/:id',categoriesControllerInit.removeResource)

    const postControllerInit = new postController(
         postCategoriesRepositoriesapp(postRepositoriesDB()),
         redisCli,
         postServiceApp(postService())
    )
 
    router.post('/post/store',uploadData.fields([{name : "thumb" , maxCount : 1} , {name : "images", maxCount: 10},{name : "videos", maxCount : 1}]),postControllerInit.createResource);
    router.get('/post/detail/:id',postControllerInit.getDetailResource)
    router.post('/post/getData',[CatchingRenderData(redisCli,CacheDynamic.POST_ALL_DATA)],postControllerInit.getDataResource);
    // router.post('/post/searchingData',postControllerInit.searchingDataEngineer)
    router.put('/post/update/:id',uploadData.fields([{name : "thumb" , maxCount : 1} , {name : "images", maxCount: 10},{name : "videos", maxCount : 1}]),postControllerInit.updateDataResource)


    // CRUD authors, roleAuthor
    const authorControllerInit = new authorController(
       authorRepositoriesApp(auhthorRepositoriesDB()),
       redisCli
    )

    router.post('/author/store',uploadData.single('avatar'),authorControllerInit.createResource)
    router.get('/author/getData',authorControllerInit.getDataResourceAuthor)
    router.get('/author/get-detail/:id',authorControllerInit.getDetailAuthorData)
    //roleAuthor
    router.post('/author/roles/store',authorControllerInit.craeteResourceRoleAuthor)
    router.get('/author/roles/getData',authorControllerInit.getDataRoleAuthor)
    router.get('/author/roles/detail/:id',authorControllerInit.getDataByQueryID)
    router.put('/author/changeStatus',authorControllerInit.changeStatusAuthorResource)



    const settingControllerInit = new settingController(
      settingRepositoriesApp(settingReposotoriesDB()),
      redisCli
   )
    //setting
    router.get('/setting/getData',settingControllerInit.getDataResource)
    router.put('/setting/storeData',uploadData.single('logo'),settingControllerInit.storeResource)

    return router;
 }                                                   
 
 
 
 export default adminRouter 
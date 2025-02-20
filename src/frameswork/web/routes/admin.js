import categoriesController from "../../../adapters/controllers/admin/categoriesController.js"
import postController from "../../../adapters/controllers/admin/postController.js"
import userController from "../../../adapters/controllers/admin/userController.js"
import categoriesRepositoriesApp from "../../../application/repositories/categoriesRepositories.app.js"
import postCategoriesRepositoriesapp from "../../../application/repositories/postCategoriesRepositories.app.js"
import userRepositoriesApp from "../../../application/repositories/userRepositories.app.js"
import authServiceApp from "../../../application/services/authService.js"
import uploadData from "../../../config/cloudinary/multer.js"
import { AuthencatedProvideAdmin, authencation } from "../../../utils/auth.utils.js"
import CacheDynamic from '../../../utils/constants.js'
import categoriesRepositoriesDB from "../../databases/mongoDB/repositories/categoriesRepositoriesDB.js"
import postRepositoriesDB from "../../databases/mongoDB/repositories/postRepositoriesDB.js"
import userRepositoryDB from "../../databases/mongoDB/repositories/userRepositoriesDB.js"
import authServicesFrame from "../../services/authService.js"
import catchingMiddleware from '../middlewares/redisCatching.middleware.js'
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
    router.get('/user/get-userData-all',[catchingMiddleware(redisCli,CacheDynamic.USER_ALL_DATA)],userControllerInit.getDataAllUser)
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
     
    router.get('/categories/treeData',categoriesControllerInit.getTreeData)

    router.post('/categories/changeStatus',categoriesControllerInit.changeStatus)

    router.get('/categories/detail/:id',categoriesControllerInit.getDetailResource)

    router.delete('/categories/remove/:id',categoriesControllerInit.removeResource)

    const postControllerInit = new postController(
      postCategoriesRepositoriesapp(postRepositoriesDB()),
      redisCli
    )

    router.post('/post/store',uploadData.single('avatar'),postControllerInit.createResource);


    return router;
 }                                                   
 
 
 
 export default adminRouter 
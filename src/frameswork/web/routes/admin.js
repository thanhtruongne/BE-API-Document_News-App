import userController from "../../../adapters/controllers/admin/userController.js"
import userRepositoriesApp from "../../../application/repositories/userRepositories.app.js"
import authServiceApp from "../../../application/services/authService.js"
import { AuthencatedProvideAdmin, authencation } from "../../../utils/auth.utils.js"
import CacheDynamic from '../../../utils/constants.js'
import userRepositoryDB from "../../databases/mongoDB/repositories/userRepositoriesDB.js"
import authServicesFrame from "../../services/authService.js"
import catchingMiddleware from '../middlewares/redisCatching.middleware.js'
const adminRouter = (express,redisCli) => {
    const router = express.Router()  

    //Init userControllers
    const userControllerInit = new userController(
        userRepositoriesApp(userRepositoryDB()),
        authServiceApp(authServicesFrame()),
        redisCli
    ) //  khoi tao intt voi baseController
    
    router.use([authencation,AuthencatedProvideAdmin]);
    // getlist
    router.get('/user/get-userData-all',[catchingMiddleware(redisCli,CacheDynamic.USER_ALL_DATA)],userControllerInit.getDataAllUser)
    //update
    router.post('/user/update/:id',userControllerInit.updateUserPayload)
    //get detail
    router.get('/user/detail/:id',userControllerInit.getDetailUser)
    //delete
    router.delete('/user/delete/:id',userControllerInit.removeResource)

    
    return router;
 }                                                   
 
 
 
 export default adminRouter
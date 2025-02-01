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
    
    // console.log(await redisCli,'redisCli')
    router.use([authencation,AuthencatedProvideAdmin]);
    router.get('/get-userData-all',[catchingMiddleware(redisCli,CacheDynamic.USER_ALL_DATA)],userControllerInit.getDataAllUser)
    
    return router;
 }                                                   
 
 
 
 export default adminRouter
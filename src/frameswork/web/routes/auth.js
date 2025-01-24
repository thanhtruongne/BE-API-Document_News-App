import AuthController from "../../../adapters/controllers/authController.js"
import userRepositoriesApp from "../../../application/repositories/userRepositories.app.js"
import authServiceApp from "../../../application/services/authService.js"
import userRepositoryDB from "../../databases/mongoDB/repositories/userRepositoriesDB.js"
import authServicesFrame from "../../services/authService.js"


const authRouter = (express,redisCli) => {
    const router = express.Router()
 
    //load depend
    const authControllerDP = new AuthController(
        userRepositoryDB,
        userRepositoriesApp,
        authServicesFrame,
        authServiceApp,
        redisCli
    )

    router.post('/login',authControllerDP.login)
    router.post('/register',authControllerDP.sign_up)
    return router
 }
 
 
 export default authRouter
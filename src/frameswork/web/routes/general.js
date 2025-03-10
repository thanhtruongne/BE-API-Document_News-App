import GeneralController from "../../../adapters/controllers/generalController.js"
import settingRepositoriesApp from "../../../application/repositories/settingRepositories.app.js"
import generalServiceApp from "../../../application/services/generalService.js"
import settingReposotoriesDB from "../../databases/mongoDB/repositories/settingReposotoriesDB.js"
import generalService from "../../services/generalService.js"


const generalRouter = (express,redisCli) => {
   const router = express.Router()

   //load depend

   const generalControllerInit = new GeneralController(
      settingRepositoriesApp(settingReposotoriesDB()),
      generalServiceApp(generalService()),
      redisCli
   )

   router.get('/setting/get-data-layout',generalControllerInit.getDataLayout)
   
   return router
}


export default generalRouter
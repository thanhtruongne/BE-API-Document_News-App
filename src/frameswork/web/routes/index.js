import AdminRouter from "./admin.js"
import AuthRouter from "./auth.js"
import GeneralRoutes from "./general.js"



const initRoutes = (app,redisCli,socketService) => {
   app.use('/api/v1/user', new AuthRouter(redisCli,socketService).routes())

   app.use('/api/v2/private', new AdminRouter(redisCli).routes())
   
   app.use('/api/v3/general', new GeneralRoutes(redisCli,socketService).routes())

}


export default initRoutes
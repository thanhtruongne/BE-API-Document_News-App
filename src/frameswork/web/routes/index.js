import adminRouter from "./admin.js"
import authRouter from "./auth.js"
import generalRouter from "./general.js"
const initRoutes = (app,express,redisCli) => {
   app.use('/api/v1/user', authRouter(express,redisCli))

   app.use('/api/v2/private',adminRouter(express,redisCli))
   
   app.use('/api/v3/general', generalRouter(express,redisCli))

}


export default initRoutes
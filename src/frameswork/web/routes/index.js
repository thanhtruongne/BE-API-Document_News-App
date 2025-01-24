import authRouter from "./auth.js"

const initRoutes = (app,express,redisCli) => {
   app.use('/api/v1/user', authRouter(express,redisCli))
}


export default initRoutes
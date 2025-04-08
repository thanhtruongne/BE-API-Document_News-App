import express from 'express'
import AuthController from '../../../adapters/controllers/authController.js'
import userRepositoriesApp from '../../../application/repositories/userRepositories.app.js'
import authServiceApp from '../../../application/services/authService.js'
import { authencation } from "../../../utils/auth.utils.js"
import userRepositoriesDB from "../../databases/mongoDB/repositories/userRepositoriesDB.js"
import authServicesFrame from '../../services/authService.js'


export default class AuthRouter {
    constructor(redisCli,socket) {
        this.redis = redisCli
        this.socket = socket
        this.router = express.Router()
    }

    routes() {

        const authControllerDP = new AuthController(
            userRepositoriesApp(userRepositoriesDB()),
            authServiceApp(authServicesFrame()),
            this.redis
        )
        this.router.post('/login',authControllerDP.login)
        this.router.post('/register',authControllerDP.sign_up)
    
        this.router.use(authencation)
        this.router.post('/logout',authControllerDP.logout)
        this.router.post('/refreshToken',authControllerDP.refreshToken)
        this.router.get('/profile',authControllerDP.profile)

        return this.router;
    }


}
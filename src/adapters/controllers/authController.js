
import login from "../../application/use_cases/auth/login.js";
import logout from "../../application/use_cases/auth/logout.js";
import profile from "../../application/use_cases/auth/profile.js";
import refreshToken from "../../application/use_cases/auth/refreshToken.js";
import sign_up from "../../application/use_cases/auth/sign_up.js";
import { REQUEST_CUSTOM } from "../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../helpers/catchingAsyncAwait.aysnc.js";

class AuthController {
    constructor(userRepository,authService,redisClient){
        this.redisClient = redisClient;
        this.userRepository =  userRepository;
        this.authService =  authService    
    }


    login = catchingAsyncAwait(async(req,res)=> {
        const response = await login(req.body,this.userRepository,this.authService)
        REQUEST_CUSTOM(res,'Login Successfully',response)
    }) 

    sign_up = catchingAsyncAwait(async(req,res)=> {
        const response = await sign_up(req.body,this.userRepository,this.authService)
        REQUEST_CUSTOM(res,'SignUp Successfully',response)
    }) 
    

    logout = catchingAsyncAwait(async(req,res) => {
        const response = await logout(req.store, this.userRepository)
        REQUEST_CUSTOM(res,'Logout successfully',response)
    })
    
    refreshToken = catchingAsyncAwait(async(req,res) => {
        const response = await refreshToken({
            refreshToken : req.refreshToken,
            user : req.user,
            store : req.store
        }, this.userRepository)
        REQUEST_CUSTOM(res,'RefreshToken successfully',response)
    })

    profile = catchingAsyncAwait(async(req,res) => {
        const response = await profile(req.user,this.userRepository)
        REQUEST_CUSTOM(res,'Profile Successfully',response)
    })
     
}


export default AuthController;
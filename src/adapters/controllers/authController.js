
import login from "../../application/use_cases/auth/login.js";
import sign_up from "../../application/use_cases/auth/sign_up.js";
import { REQUEST_CUSTOM } from "../../frameswork/web/plugins/successReponse.js";
import catchingAsyncAwait from "../../helpers/catchingAsyncAwait.aysnc.js";

class AuthController {
    constructor(userRepository,userRepositoryIP,authService,authServiceIP,redisClient){
        this.redisClient = redisClient;
        this.userRepository =  userRepositoryIP(userRepository());
        this.authService =  authServiceIP(authService())    
    }


    login = catchingAsyncAwait(async(req,res)=> {
        const response = await login(req.body,this.userRepository,this.authService)
        REQUEST_CUSTOM(res,'Login Successfully',response)
    }) 

    sign_up = catchingAsyncAwait(async(req,res)=> {
        const response = await sign_up(req.body,this.userRepository,this.authService)
        REQUEST_CUSTOM(res,'SignUp Successfully',response)
    }) 
    



    // login_temp = catchingAsyncAwait(async(req,res)=> {
    //     REQUEST_CUSTOM(res,'Login Successfully',await authServices.login(req.body))
    // }) 

    // sign_up_temp = catchingAsyncAwait(async(req,res) => {
    //     CREATED_ATTEMP(res,'Created successfully',await authServices.signup(req.body))
    // })

    // logout_temp = catchingAsyncAwait(async(req,res) => {
    //     REQUEST_CUSTOM(res,'Logout successfully',await authServices.logout(req.store),{
    //         deleted : true
    //     })
    // })
    
    // refreshToken = catchingAsyncAwait(async(req,res) => {
    //     REQUEST_CUSTOM(res,'RefreshToken successfully',await authServices.refreshToken({
    //         refreshToken : req.refreshToken,
    //         user : req.user,
    //         store : req.store
    //     }))
    // })

    // profile_temp = catchingAsyncAwait(async(req,res) => {
    //     REQUEST_CUSTOM(res,'Successfully',await authServices.profile(req.user))
    // })
     
}


export default AuthController;
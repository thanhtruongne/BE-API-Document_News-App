import catchingAsyncAwait from "../helpers/catchingAsyncAwait.aysnc.js";
import { CREATED_ATTEMP, REQUEST_CUSTOM } from "../core/successReponse.js";
import authServices from "../services/auth.services.js";


class AuthController {

    login_temp = catchingAsyncAwait(async(req,res)=> {
        REQUEST_CUSTOM(res,'Login Successfully',await authServices.login(req.body))
    }) 

    sign_up_temp = catchingAsyncAwait(async(req,res) => {
        CREATED_ATTEMP(res,'Created successfully',await authServices.signup(req.body))
    })
}


export default new AuthController();
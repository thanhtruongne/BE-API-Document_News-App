import catchingAsyncAwait from "../helpers/catching.aysnc";
import { CREATED_ATTEMP, REQUEST_SUCCESS } from "../core/successReponse";
import authServices from "../services/auth.services";


class AuthController {

    // login_temp = catchingAsyncAwait(async(req,res)=> {
    //     REQUEST_SUCCESS(res,'Login Successfully',await)
    // }) 

    sign_up_temp = catchingAsyncAwait(async(req,res) => {
        CREATED_ATTEMP(res,'Created successfully',await authServices.signup(req.body))
    })
}


export default new AuthController();
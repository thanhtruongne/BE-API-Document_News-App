import catchingAsyncAwait from "../helpers/catching.aysnc";
import { CREATED_ATTEMP, REQUEST_SUCCESS } from "../core/successReponse";


class AuthController {

    login_temp = catchingAsyncAwait(async(req,res)=> {
        REQUEST_SUCCESS(res,'Login Successfully',await)
    }) 
}


export default new AuthController();
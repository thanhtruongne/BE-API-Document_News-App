import catchingAsyncAwait from "../helpers/catchingAsyncAwait.aysnc";
import { REQUEST_CUSTOM,CREATED_ATTEMP } from "../core/successReponse";
import categoriesServices from "../services/categories.services";

class CategoriesController {

    saveCate = catchingAsyncAwait(async(req,res,next) => {
        REQUEST_CUSTOM(res,'Save success data',await categoriesServices.saveData(req.body))
    })
}


export default new CategoriesController();
class BaseController {
    constructor({userRepository,authService,redisClient,categoriesRepository,postCategory,postService}){
        this.userRepository =  userRepository;
        this.authService =  authService    
        this.redisClient = redisClient;
        this.categoriesRepository = categoriesRepository;
        
        this.postCategory = postCategory;
        this.postService = postService
    }

    convertParamsObject(query) {
        const params = {};
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
              params[key] = query[key];
            }
        }
        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
        
        return params
    }
}


export default BaseController
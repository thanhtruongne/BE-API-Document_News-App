import routerRepositoriesApp from "../../application/repositories/routerRepositories.app.js";
import routerRepositoriesDB from "../../frameswork/databases/mongoDB/repositories/routerRepositoriesDB.js";

class BaseController {
    constructor({
        userRepository,
        authService,
        redisClient,
        categoriesRepository,
        postRepository,
        postService,
        authorRepository,
        settingRepository,
    }){
        this.userRepository =  userRepository;
        this.authService =  authService    
        this.redisClient = redisClient;
        this.categoriesRepository = categoriesRepository;
        this.settingRepository = settingRepository
        this.authorRepository = authorRepository
        this.postRepository = postRepository;
        this.postService = postService;
        this.routerRepository = routerRepositoriesApp(routerRepositoriesDB());
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
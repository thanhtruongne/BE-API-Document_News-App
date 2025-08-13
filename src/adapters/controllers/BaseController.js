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
        commentRepository,
        notifyRepository,
        socketService
    }) {
        this.userRepository = userRepository;
        this.authService = authService
        this.redisClient = redisClient;
        this.categoriesRepository = categoriesRepository;
        this.settingRepository = settingRepository
        this.authorRepository = authorRepository
        this.postRepository = postRepository;
        this.postService = postService;
        this.notifyRepository = notifyRepository;
        this.routerRepository = routerRepositoriesApp(routerRepositoriesDB());
        this.commentRepository = commentRepository;
        this.socketService = socketService
    }

    convertParamsObject(query) {
        const params = {};
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                if (key == 'limit') {
                    params[key] = parseInt(query[key]);
                } else {
                    params[key] = query[key];
                }

            }
        }
        // params.limit = params.limit ? parseInt(limit) : 10;
        params.page = params.page ? parseInt(params.page, 10) : 1;
        params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;

        return params
    }
}


export default BaseController
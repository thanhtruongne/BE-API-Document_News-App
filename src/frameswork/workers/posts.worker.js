import userRepositoriesApp from "../../application/repositories/userRepositories.app.js";
import userRepositoryDB from "../databases/mongoDB/repositories/userRepositoriesDB.js";
import RedisUtilsRepo from "../databases/redis/redis.repo.js";
import WebSocketService from "../databases/webSocket/web-socket.js";


class PostServiceWorker {
    constructor() {
        super('posts')
        this.redis = RedisUtilsRepo
        this.socket = new WebSocketService();
        this.userRepository = userRepositoriesApp(userRepositoryDB())
    }


    handlePostLike(data,callback) {
        try {
            const {postId, userId , action} = data
            

        } catch (error) {
        
        }
    }
}


export const postWorker = new PostServiceWorker();
import userRepositoriesApp from "../../application/repositories/userRepositories.app.js";
import { config } from "../../config/config.js";
import userRepositoryDB from "../databases/mongoDB/repositories/userRepositoriesDB.js";
import RedisUtilsRepo from "../databases/redis/redis.repo.js";
import WebSocketService from "../databases/webSocket/web-socket.js";


class PostServiceWorker {
    constructor() {
        super('posts')
        this.socket = new WebSocketService();
        this.userRepository = userRepositoriesApp(userRepositoryDB())
        this.config = config.createLogger('postsWorker');

        this.#installSubcriseribeRedis();
    }

    #installSubcriseribeRedis() {
        RedisUtilsRepo.subscribe('post:likes');
        RedisUtilsRepo.on('message', (channel, message) => {
            if (channel === 'post:likes') {
                const data = JSON.parse(message);
                this.handleNotify(data);
            }
        });
    }


    async handlePostLike(data,callback) {
        try {
            const {postId, userId , action} = data
            const cacheKey = `post:${postId}:likes`;
            const countKey = `post:${postId}:likesCount`;

            if (action === 'LIKE') {
                await RedisUtilsRepo.sadd(cacheKey, userId);
                await RedisUtilsRepo.incr(countKey);

            } else {
                await RedisUtilsRepo.srem(cacheKey, userId);
                await RedisUtilsRepo.decr(countKey);
            }
            const likesCount = await RedisUtilsRepo.get(countKey);

            await RedisUtilsRepo.publish('post:likes', JSON.stringify({ // để sub qua redis catch realtime
                postId,
                userId,
                action,
                likesCount: parseInt(likesCount),
                timestamp: new Date()
            }));

            return {
                success: true,
                message: 'Thao tác thành công',
                postId,
                action
            }
        } catch (error) {
           this.handleError(error,callback);
        }
    }

    handleNotify(data) {
        this.socket.broadcast('post:like:view',{
            
        })
    }


    handleError(error,callback)  {
        this.config.error('Error in post worker', error);
        callback({
            success: false,
            error: error.message || 'Lỗi hệ thống',
            timestamp: new Date()
        }, null);
    }

}


export const postWorker = new PostServiceWorker();
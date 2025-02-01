class BaseController {
    constructor(userRepository,authService,redisClient){
        this.userRepository =  userRepository;
        this.authService =  authService    
        this.redisClient = redisClient;
    }
}


export default BaseController
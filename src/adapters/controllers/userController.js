

class UserController {
    constructor(userRepository,userRepositoryIP,redisClient){
        this.redisClient = redisClient;
        this.userRepository =  userRepositoryIP(userRepository());
    }

     
}


export default UserController;
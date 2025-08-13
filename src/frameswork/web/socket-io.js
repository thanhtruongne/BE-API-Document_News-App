import { Server } from "socket.io";
import { config } from "../../config/config.js";
import socketServiceHandler from "../services/socketService.js";
import { Api403Error } from "./plugins/error.response.js";
import { parseJWT } from "../../utils/auth.utils.js";
import RedisUtilsRepo from "../databases/redis/redis.repo.js";

export const initSocketIO = (server) => {
    const logger = config.createLogger('socket');
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        socketServiceHandler(socket,logger)
    });


    io.use(async(socket,next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Api403Error('Không tìm thấy token'));
        }

        try {
            const payload = parseJWT(token);
            if(RedisUtilsRepo.exists('token:socket:' + payload?.userID)) {
                next()
            }
           
            socket.data.userId = payload.userID;    
            socket.data.role = payload.role;       

            RedisUtilsRepo.setnx('token:socket:' + payload?.userID,payload?.userID,600)
        
            next(); 
          } catch (err) {
            return next(new Api403Error('Token không hợp lệ'));
          }
    })

    return {
        io
    }

}





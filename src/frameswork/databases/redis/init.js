
import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config()


class RedisClient {

     constructor() {
         this.clientConnect = null;
     }

    async connect() {
        if(!this.clientConnect) {
            this.clientConnect =  createClient({
                url: process.env.REDIS_URL
            });
            

            this.clientConnect.on('error', (err) => console.error('Redis Client Error:', err));

            this.clientConnect.connect();

            console.log('Connected to Redis');
        }

        return this.clientConnect
     }

     static async getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient()
            await RedisClient.instance.connect();
        }
        return RedisClient.instance
    }


    getConnect() {
        return this.clientConnect
    }
}


const instanceRedis = await RedisClient.getInstance();
export default instanceRedis.getConnect()
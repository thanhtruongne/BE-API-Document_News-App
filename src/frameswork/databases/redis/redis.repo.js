import instanceRedis from "./init.js";

class RedisUtilsRepo {
   
    static async set(key,value) {
        try {
            const res = await instanceRedis.client.set(key,value)  
            return res
        } catch (error) {
            throw  error
        }
    }


    static async get(key) {
        try {
            const res = await  instanceRedis.client.get(key);
            return res
        } catch (error) {
            throw  error
        }
     }

    static async setnx(key, value, exprie) {
        try {
            const res = await instanceRedis.client.setEx(key,exprie,value);
            return res
        } catch (error) {
            throw  error
        }
    }



    static async incr(key){
        try {
            const res = await instanceRedis.client.incr(key);
            return res
        } catch (error) {
            throw  error
        }   
    }
    
    static async decrby(key, count){
        try {
            const res = await instanceRedis.client.decrby(key,count);
            return res
        } catch (error) {
            throw  error
        }   
    }
    
    // expire key redis
    static async expire(key, ttl) {
        try {
            const res = await  instanceRedis.client.expire(key, ttl)
            return res
        } catch (error) {
            throw  error
        }  
    }

    static async ttl(key) {
        try {
            const res = await  instanceRedis.client.ttl(key)
            return res
        } catch (error) {
            throw  error
        }  
    }

    static async exists(key) {
        try {
            const res = await  instanceRedis.client.exists(key)
            return res
        } catch (error) {
            throw error
        }  
    }

    //Pub
    static async publish(channel, data) {
        await instanceRedis.publisher.publish(channel, JSON.stringify(data));
    }

    //Sub
    static async subscribe(channel) {
        try {
            await instanceRedis.subscriber.subscribe(channel);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async unsubscribe(channel) {
        try {
            await instanceRedis.subscriber.unsubscribe(channel);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static onMessage(callback) {
        instanceRedis.subscriber.on('message', (channel, message) => {
            try {
                const parsedMessage = JSON.parse(message);
                callback(channel, parsedMessage);
            } catch (error) {
               
                callback(channel, message);
            }
        });
    }

}


export default RedisUtilsRepo
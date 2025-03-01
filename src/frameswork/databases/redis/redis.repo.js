import instanceRedis from "./init.js";

class RedisUtilsRepo {
   
    static async set(key,value) {
        try {
            const res = await instanceRedis.set(key,value)  
            return res
        } catch (error) {
            throw  error
        }
    }


    static async get(key) {
        try {
            const res = await  instanceRedis.get(key);
            return res
        } catch (error) {
            throw  error
        }
     }

    static async setnx(key, value, exprie) {
        try {
            const res = await instanceRedis.setEx(key,exprie,value);
            return res
        } catch (error) {
            throw  error
        }
    }



    static async incr(key){
        try {
            const res = await instanceRedis.incr(key);
            return res
        } catch (error) {
            throw  error
        }   
    }
    
    static async decrby(key, count){
        try {
            const res = await instanceRedis.decrby(key,count);
            return res
        } catch (error) {
            throw  error
        }   
    }
    
    // expire key redis
    static async expire(key, ttl) {
        try {
            const res = await  instanceRedis.expire(key, ttl)
            return res
        } catch (error) {
            throw  error
        }  
    }

    static async ttl(key) {
        try {
            const res = await  instanceRedis.ttl(key)
            return res
        } catch (error) {
            throw  error
        }  
    }

    static async exists(key, ttl) {
        try {
            const res = await  instanceRedis.exists(key)
            return res
        } catch (error) {
            throw error
        }  
    }
}


export default RedisUtilsRepo
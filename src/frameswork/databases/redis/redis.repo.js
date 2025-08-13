import { BusinessLogicError } from "../../web/plugins/error.response.js";
import instanceRedis from "./init.js";

class RedisUtilsRepo {

    static async srem(key, value) {
        try {
            const res = await instanceRedis.client.srem(key, value)
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async decr(count) {
        try {
            const res = await instanceRedis.client.decr(count)
            return res
        } catch (error) {
            throw error
        }
    }

    static async sadd(key, value) {
        try {
            const res = await instanceRedis.client.sadd(key, value)
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async set(key, value, ...options) {
        try {
            // Validate đầu vào
            if (!key || typeof key !== 'string') {
                throw new RedisError('Khóa Redis không hợp lệ');
            }
            if (value === undefined || value === null) {
                throw new RedisError('Giá trị Redis không hợp lệ');
            }
            const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
            const redisOptions = [];
            let i = 0;
            while (i < options.length) {
                if (options[i] === 'NX' || options[i] === 'XX') {
                    redisOptions.push(options[i]);
                    i++;
                } else if (options[i] === 'EX' || options[i] === 'PX') {
                    redisOptions.push(options[i], options[i + 1]);
                    i += 2;
                } else if (options[i] === 'KEEPTTL') {
                    redisOptions.push('KEEPTTL');
                    i++;
                } else {
                    throw new BusinessLogicError(`Tùy chọn Redis không hợp lệ: ${options[i]}`);
                }
            }
            const res = await instanceRedis.client.set(key, serializedValue, ...redisOptions);
            return res; // "OK" hoặc null (nếu NX thất bại)
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async delete(key) {
        try {
            const res = await instanceRedis.client.del(key);
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    // static async set(key, value) {
    //     try {
    //         const res = await instanceRedis.client.set(key, value)
    //         return res
    //     } catch (error) {
    //         throw new BusinessLogicError(error.message)
    //     }
    // }


    static async get(key) {
        try {
            const res = await instanceRedis.client.get(key);
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async setnx(key, value, exprie) {
        try {
            const res = await instanceRedis.client.setEx(key, exprie, value);
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }



    static async incr(key) {
        try {
            const res = await instanceRedis.client.incr(key);
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async decrby(key, count) {
        try {
            const res = await instanceRedis.client.decrby(key, count);
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    // expire key redis
    static async expire(key, ttl) {
        try {
            const res = await instanceRedis.client.expire(key, ttl)
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async ttl(key) {
        try {
            const res = await instanceRedis.client.ttl(key)
            return res
        } catch (error) {
            throw new BusinessLogicError(error.message)
        }
    }

    static async exists(key) {
        try {
            const res = await instanceRedis.client.exists(key)
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

    static async clearCache() {
        try {
            const res = await instanceRedis.client.flushDb();
            return res;
        } catch (error) {
            throw new BusinessLogicError(error.message);
        }
    }

}


export default RedisUtilsRepo
const connectionRedis = (redis,url) => {
    const createRedisClient = function createRedisClient() {
        return redis.createClient(url);
    };
    createRedisClient().on('connect', () => {
        console.log('Connected to Redis!');
    });

    createRedisClient().on('error', (err) => {
        console.log(`Error  ${err}`);
    });

    return {
        createRedisClient
    };
}


export default connectionRedis
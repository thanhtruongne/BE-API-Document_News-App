

const connectionRedis = async(createClient,urlString) => {
   const redisClient = await createClient({
        url : urlString
   })
   .on('error', err => console.log('Redis Client Error', err))
   .connect();
   
   return redisClient
}


export default connectionRedis
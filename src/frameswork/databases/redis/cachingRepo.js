const catchingData = async({key,value,expire},redisClient) =>  await redisClient.setEx(key,expire,value)

export {
    catchingData
}


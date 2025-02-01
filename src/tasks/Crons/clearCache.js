import cron from 'node-cron';

const clearCacheCron = (redisClient) => {

    const expression = '0 0 * * *'
    const description= "Clear cache"
    const name = "clear-cache"

    const clearCache =  cron.schedule(expression, async() => {
        console.log(redisClient)
         await redisClient.flushall((err, success) => {
            if (success)   console.log(description + 'thành công');
            else   console.log(description + 'fail' + err);        
        });
    },{
        scheduled : false
    })
    

    const startTask = () => {
        console.log(`Start cron ${name}`)
        clearCache.start()
    }
    
    return {
        startTask,name,expression,description
    }
}





export default clearCacheCron
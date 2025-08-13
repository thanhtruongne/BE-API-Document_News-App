import { BullAdapter, ExpressAdapter, createBullBoard } from '@bull-board/express';
import { Queue } from "bullmq";
import { config } from "../../config/config.js";
import RedisUtilsRepo from '../databases/redis/redis.repo.js';


let bullAdapters = [];

// export let ExpressAdapter;


export class BaseQueue {
     
    constructor(queueName) {
        this.queue = new Queue(queueName,`${config.REDIS_URL}`)
        this.redis = RedisUtilsRepo
        bullAdapters.push(new BullAdapter(this.queue));
        bullAdapters = [...new Set(bullAdapters)];
        serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/queues');

        createBullBoard({
            queues: bullAdapters,
            serverAdapter
        });

        this.log = config.createLogger(`${queueName}Queue`);

        this.queue.on('completed', (job) => {
            job.remove();
        });

        this.queue.on('global:completed', (jobId) => {
            this.log.info(`Job ${jobId} completed`);
        });

        this.queue.on('global:stalled', (jobId) => {
            this.log.info(`Job ${jobId} is stalled`);
        });
    }


    addJob(name, data) {
        this.queue.add(name, data, {attempts: 3, backoff: {type: 'fixed', delay: 5000}});
    }

    processJob(name, concurrency,callback) {
        this.queue.process(name, concurrency, callback);
    }
}
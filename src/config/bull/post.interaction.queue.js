import Queue from 'bull';
import { config } from '../../config/config.js';

const postInteractionQueue = new Queue('post-interaction', {
    redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        removeOnComplete: true
    }
});

export default postInteractionQueue; 
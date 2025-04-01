
import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config()


class RedisClient {
    constructor() {
        this.clientConnect = null;
        this.publisher = null;
        this.subscriber = null;
        this.isConnected = false;
    }

    async connect() {
        if (!this.clientConnect) {
            try {
                const redisOptions = {
                    url: process.env.REDIS_URL,
                    retryStrategy: (times) => {
                        const delay = Math.min(times * 50, 2000);
                        return delay;
                    }
                };

                this.clientConnect = createClient(redisOptions);
                this.publisher = createClient(redisOptions);
                this.subscriber = createClient(redisOptions);

                // Setup error handlers
                const handleError = (type) => (err) => {
                    console.error(`Redis ${type} Error:`, err);
                    this.isConnected = false;
                };

                this.clientConnect.on('error', handleError('Client'));
                this.publisher.on('error', handleError('Publisher'));
                this.subscriber.on('error', handleError('Subscriber'));

                // Setup reconnect handlers
                const handleReconnect = (type) => () => {
                    console.log(`Redis ${type} reconnected`);
                };

                this.clientConnect.on('reconnecting', handleReconnect('Client'));
                this.publisher.on('reconnecting', handleReconnect('Publisher'));
                this.subscriber.on('reconnecting', handleReconnect('Subscriber'));

                await Promise.all([
                    this.clientConnect.connect(),
                    this.publisher.connect(),
                    this.subscriber.connect(),
                ]);

                this.isConnected = true;
                console.log('Connected to Redis, Pub/Sub ready');
            } catch (error) {
                console.error('Redis connection error:', error);
                this.isConnected = false;
                throw error;
            }
        }
    }

    getPublisher() {
        if (!this.isConnected) {
            throw new Error('Redis is not connected');
        }
        return this.publisher;
    }

    getSubscriber() {
        if (!this.isConnected) {
            throw new Error('Redis is not connected');
        }
        return this.subscriber;
    }

    getConnect() {
        if (!this.isConnected) {
            throw new Error('Redis is not connected');
        }
        return this.clientConnect;
    }

    async disconnect() {
        try {
            await Promise.all([
                this.clientConnect?.disconnect(),
                this.publisher?.disconnect(),
                this.subscriber?.disconnect()
            ]);
            this.isConnected = false;
            console.log('Disconnected from Redis');
        } catch (error) {
            console.error('Redis disconnect error:', error);
            throw error;
        }
    }

    static async getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
            await RedisClient.instance.connect();
        }
        return RedisClient.instance;
    }
}

const instanceRedis = await RedisClient.getInstance();
export default {
    client: instanceRedis.getConnect(),
    publisher: instanceRedis.getPublisher(),
    subscriber: instanceRedis.getSubscriber()
};
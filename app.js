import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import redis from 'redis';
import connectionInit from './src/frameswork/databases/mongoDB/init.js';
import connectionRedis from './src/frameswork/databases/redis/init.js';
import ConfigureExpress from './src/frameswork/web/express.js';
import { returnError } from './src/frameswork/web/middlewares/errorHandler.js';
import initRoutes from './src/frameswork/web/routes/index.js';
import serverConfig from './src/frameswork/web/server.js';
dotenv.config();
const urlConnectMongo = process.env.MONGOOSE_URL
const urlConnectRedis = process.env.REDIS_URL
const app = express();
const server = http.createServer(app)

//config express 
ConfigureExpress(app)

//config server
serverConfig(app,server,mongoose).startServer()

//connect Database
connectionInit(mongoose,urlConnectMongo).connectToMongo()

//init redis
const redisClient = connectionRedis(redis,urlConnectRedis).createRedisClient();

//init route
initRoutes(app,express,redisClient)

app.use(returnError)

export default app
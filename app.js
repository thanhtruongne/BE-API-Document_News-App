import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import moment from "moment";
import mongoose from 'mongoose';
import connectionInit from './src/frameswork/databases/mongoDB/init.js';
import RedisUtilsRepo from './src/frameswork/databases/redis/redis.repo.js';
import ConfigureExpress from './src/frameswork/web/express.js';
import { returnError } from './src/frameswork/web/middlewares/errorHandler.js';
import initRoutes from './src/frameswork/web/routes/index.js';
import serverConfig from './src/frameswork/web/server.js';
import CronJobInit from './src/tasks/schedule.js';
dotenv.config();
const urlConnectMongo = process.env.MONGOOSE_URL
const app = express();
const server = http.createServer(app)
moment.locale('vi')



//config express 
ConfigureExpress(app)

//config server
serverConfig(app,server,mongoose).startServer()

//connect Database
connectionInit(mongoose,urlConnectMongo).connectToMongo()

//init redis
// const redisClient = await connectionRedis(createClient,urlConnectRedis)
//init route

initRoutes(app,express,RedisUtilsRepo)

//init cron jobs
CronJobInit(RedisUtilsRepo)

app.use(returnError)

export default app
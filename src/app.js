
import connectDBMongoose from "./databases/init.js";
import { countConnectionMongoDB,CheckOverloadConnect } from "./helpers/check_connection.js";
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression'
import dotenv from 'dotenv';
import initRoutes from "./routes/index.js";
dotenv.config();



const app = express();
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());

// connectDBMongoose
CheckOverloadConnect()//check overload

// count connect


//init routes
initRoutes(app)

// app.use('',router)
export default app;
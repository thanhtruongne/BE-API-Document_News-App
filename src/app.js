
import connectDBMongoose from "./databases/init.js";
import { countConnectionMongoDB,CheckOverloadConnect } from "./helpers/check_connection.js";
import {is404Handler,returnError } from "./middleware/errorHandler.js";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression'
import dotenv from 'dotenv';
import initRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";
import { checkEnable } from "./utils/index.utils.js";
import i18n from "./configs/i18n.config.js";
dotenv.config();

const app = express();
app.use(morgan('dev'));


app.use(cors({
    origin : process.env.REACT_APP_FRONTEND,
    credentials : true
}))


// app.use(helmet.frameguard({
//     action: 'deny'
// }));
// // strict transport security
// const reqDuration = 2629746000;
// app.use(
//     helmet.hsts({
//         maxAge: reqDuration,
//     })
// );

// content security policy
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         scriptSrc: ["'self'"],
//         styleSrc: ["'self'"],
//     },
// }))
// x content type options
// app.use(helmet.noSniff());
// // x xss protection
// app.use(helmet.xssFilter())
// // referrer policy
// app.use(helmet.referrerPolicy({
//     policy: "no-referrer",
// }))

// app.use(compression());


app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());





CheckOverloadConnect()//check overload
//init routes
initRoutes(app)

//errorHandler
// app.use(is404Handler);
app.use(returnError)

//set tạm
app.use(i18n.init)

export default app;
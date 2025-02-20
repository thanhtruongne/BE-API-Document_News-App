import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import i18n from '../../config/i18n/i18n.config.js';


const ConfigureExpress = (app) => {
    app.use(morgan('dev'));


    app.use(cors({
        origin : process.env.REACT_APP_FRONTEND,
        credentials : true
    }))
    

    app.use(helmet.frameguard({
        action: 'deny'
    }));

    app.use(helmet.contentSecurityPolicy({
        directives: {
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
        },
    }))
    app.use(helmet.noSniff());
    
    app.use(helmet.xssFilter())
    
    app.use(helmet.referrerPolicy({
        policy: "no-referrer",
    }))
    
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({extended: true, limit: '50mb'}));
    app.use(cookieParser());


    //set tạm
    app.use(i18n.init)
    // app.use(returnError)
}

export default ConfigureExpress
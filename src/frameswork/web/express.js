import { createTerminus } from '@godaddy/terminus';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { config } from '../../config/config.js';
import i18n from '../../config/i18n/i18n.config.js';
import RedisUtilsRepo from '../databases/redis/redis.repo.js';
import WebSocketService from '../databases/webSocket/web-socket.js';
import { returnError } from './middlewares/errorHandler.js';
import initRoutes from './routes/index.js';
const logger = config.createLogger('server')



export default class SetupExpressServer {
        constructor(app,server,mongoose,express) {
           console.log(express,'contructor')
           this.app = app
           this.express = express
           this.server = server
           this.redis = RedisUtilsRepo
           this.mongoose = mongoose
        }

        start() {
           this.#setupMiddlewareSercure(this.app,this.express)
           this.#setupStartServer()
           this.#startServer(this.app)
           this.#setupHandleError(this.app)
        }

        #setupMiddlewareSercure(app,express) {
            console.log(express,'check')
            app.use(morgan('dev'));
            app.use(hpp()) 

       

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
            
            // app.use(helmet.xssFilter())
            
            app.use(helmet.referrerPolicy({
                policy: "no-referrer",
            }))

           

            app.use(cors({
                origin : config.REACT_APP_FRONTEND,
                credentials : true
            }))

            app.use(express.json());
            app.use(express.urlencoded({extended: true}));
            app.use(cookieParser());
            app.use(i18n.init)
        }



        #setupRouter(app,socket,redis) {
            initRoutes(app,redis ,socket)
        }

        #setupHandleError(app) {
            app.use(returnError)
        }

        #setupStartServer() {
            try {
                const socketService = new WebSocketService(this.server)
                this.#setupRouter(this.app,socketService,this.redis)
            } catch (error) {
                logger.error(error);
            }
        }

        
      
        #startServer() {
            try {
                const onShutdown = () => {
                    logger.info('Express cleanup finished, server is shutting down')
                  
                }
                const beforeShutdown = () => {
                    return new Promise((resolve) => {
                        setTimeout(resolve, 15000);
                    });
                }
                const onSignal = () => {
                    logger.log('server is starting cleanup');
                    return new Promise((resolve, reject) => {
                    this.mongoose
                        .disconnect(false)
                        .then(() => {
                            logger.info('Mongoose has disconnected');
                        resolve();
                        })
                        .catch(reject);
                    });
                }
                const healthCheck = () => {
                    if (
                        this.mongoose.connection.readyState === 0 ||
                        this.mongoose.connection.readyState === 3
                    ) {
                        return Promise.reject(new Error('Mongoose has disconnected'));
                    }
                    if (this.mongoose.connection.readyState === 2) {
                        return Promise.reject(new Error('Mongoose is connecting'));
                    }
                    return Promise.resolve();
                }
        
                createTerminus(this.server, {
                    logger,
                    signal: 'SIGINT',
                    healthChecks: {
                    '/healthcheck': healthCheck
                    },
                    onSignal,
                    onShutdown,
                    beforeShutdown
                }).listen(config.PORT, () => {
                    logger.info('Express server listening on %d',config.PORT)
                    
                });
            } catch (error) {
                logger.error(error)
            }
        
        }
}  
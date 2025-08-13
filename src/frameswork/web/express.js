import { createTerminus } from '@godaddy/terminus';
import { Command } from 'commander';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import cron from 'node-cron';
import { config } from '../../config/config.js';
import i18n from '../../config/i18n/i18n.config.js';
import RedisUtilsRepo from '../databases/redis/redis.repo.js';
import { returnError } from './middlewares/errorHandler.js';
import initRoutes from './routes/index.js';
import { initSocketIO } from './socket-io.js';

const logger = config.createLogger('server')



export default class SetupExpressServer {
    constructor(app, server, mongoose, express) {
        this.app = app
        this.express = express
        this.server = server
        this.redis = RedisUtilsRepo
        this.mongoose = mongoose
        this.cronTasks = {};
        this.program = new Command()
    }

    start() {
        this.#setupMiddlewareSercure(this.app, this.express);
        this.#setupStartServer();
        this.#startServer(this.app);
        // this.#setupCronNodeConfig();
        this.#setupHandleError(this.app);
        // if (process.argv.length > 2) {
        //     this.#handlerCommandNodeCron();
        // }
        // this.#handlerCommandNodeCron();
    }

    #setupMiddlewareSercure(app, express) {
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

        app.use(helmet.xssFilter())

        app.use(helmet.referrerPolicy({
            policy: "no-referrer",
        }))

        app.use(cors({
            origin: config.REACT_APP_FRONTEND,
            credentials: true
        }))

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.use(compression());
        app.use(i18n.init)
    }



    #setupRouter(app, socket, redis) {
        initRoutes(app, redis, socket)
    }

    #setupHandleError(app) {
        app.use(returnError)
    }

    // #setupCronNodeConfig() {
    //     this.cronTasks['Increment-views'] = cron.schedule(
    //         '* * * * *', // run mỗi phút
    //         async () => {
    //             try {

    //             } catch (error) {
    //                 logger.error('Cronjob Increment-views error:', error);
    //             }
    //         },
    //         {
    //             scheduled: true,
    //             timezone: 'Asia/Ho_Chi_Minh',
    //             name: 'Increment-views',
    //         }
    //     )

    //     this.cronTasks['clearCache'] = cron.schedule(
    //         '* * * * *', // run mỗi phút
    //         async () => {
    //             try {
    //                 this.redis.clearCache();
    //                 logger.info('Cronjob clearCache success');
    //             } catch (error) {
    //                 logger.error('Cronjob clearCache error:', error);
    //             }

    //         },
    //         {
    //             scheduled: false,
    //             timezone: 'Asia/Ho_Chi_Minh',
    //             name: 'clearCache',
    //         }
    //     );
    // }

    // async #handlerCommandNodeCron() {
    //     this.program
    //         .command('start-cron <name>')
    //         .description('Bắt đầu một cronjob cụ thể và chạy ngay lập tức')
    //         .action(async (name) => {
    //             if (this.cronTasks[name]) {
    //                 try {
    //                     if (!(await this.redis.ping())) {
    //                         logger.error('Redis not available, aborting cronjob');
    //                         process.exit(1);
    //                     }
    //                     // Chạy cronjob ngay lập tức
    //                     await this.cronTasks[name].now();
    //                     logger.info(`Cronjob ${name} executed immediately at: ${new Date().toLocaleString('vi', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
    //                     // Bắt đầu chạy theo lịch trình
    //                     this.cronTasks[name].start();
    //                     logger.info(`Cronjob ${name} started`);
    //                     process.exit(0);
    //                 } catch (error) {
    //                     logger.error(`Error executing cronjob ${name}:`, error);
    //                     process.exit(1);
    //                 }
    //             } else {
    //                 logger.error(`Cronjob ${name} not found`);
    //                 process.exit(1);
    //             }
    //         });

    //     this.program
    //         .command('stop-cron <name>')
    //         .description('Dừng một cronjob cụ thể')
    //         .action(async (name) => {
    //             if (this.cronTasks[name]) {
    //                 this.cronTasks[name].stop();
    //                 logger.info(`Cronjob ${name} stopped at: ${new Date().toLocaleString('vi', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
    //                 process.exit(0);
    //             } else {
    //                 logger.error(`Cronjob ${name} not found`);
    //                 process.exit(1);
    //             }
    //         });

    //     this.program
    //         .command('list-crons')
    //         .description('Liệt kê tất cả cronjob')
    //         .action(async () => {
    //             logger.info('Danh sách cronjob:', Object.keys(this.cronTasks));
    //             process.exit(0);
    //         });
    //     await this.program.parseAsync(process.argv);
    // }




    #setupStartServer() {
        try {
            const socketService = initSocketIO(this.server).io;
            this.#setupRouter(this.app, socketService, this.redis)
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
                logger.info('Express server listening on %d', config.PORT)

            });
        } catch (error) {
            logger.error(error)
        }

    }
}  
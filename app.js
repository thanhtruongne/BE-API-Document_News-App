    import express from 'express';
    import { createServer } from 'http';
    import moment from "moment";
    import { config } from './src/config/config.js';
    import connectionInit from './src/frameswork/databases/mongoDB/init.js';
    import { default as SetupExpressServer } from './src/frameswork/web/express.js';
    moment.locale('vi')


    class ApplicationServer {
        start() {
            this.loadConfiguartionData()
            const app = express();
            const mongoose = connectionInit().connectToMongo() // connect db
            const server = new SetupExpressServer(app, createServer(app), mongoose, express)
            // cronNodeConfig(server)
            server.start();
        }

        loadConfiguartionData() {
            config.validateConfig();
            config.cloudinaryConfig();
        }
    }
    const application = new ApplicationServer();
    application.start();
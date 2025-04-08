import mongoose from "mongoose";
import { config } from "../../../config/config.js";

const logger = config.createLogger('connectDB')

const connectionInit = () => {
  const connectToMongo = () => {
    if(1 == 1) { // môi trg dev
      mongoose.set('debug',true);
      mongoose.set('debug',{color : true});
    }
    mongoose
      .connect(config.DATABASE_URL)
      .then(_ => {
        logger.info('Successfully connected MongoDB')
    })
    .catch( err => {
      logger.error('DB connection error');
      throw new Error(err);
    });

    mongoose.connection.on('connected', () => {
      logger.info('Connected to MongoDB!');
    });
  
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected!');
    });
  
    mongoose.connection.on('error', (error) => {
      logger.error(`Error in MongoDb connection: ${error}`);
      mongoose.disconnect();
    });
  
    mongoose.connection.on('disconnected', () => {
      logger.error(  
        `MongoDB disconnected! Reconnecting in ${
          options.reconnectInterval / 1000
        }s...`
      );
      setTimeout(() => connectToMongo(), options.reconnectInterval);
    });

    return mongoose
  }

 

  return {
    connectToMongo
  };
}



export default connectionInit;



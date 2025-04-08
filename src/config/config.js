
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config()

class Config {
    constructor() {
      this.DATABASE_URL = process.env.MONGOOSE_URL
      this.PORT = process.env.PORT
      this.REDIS_URL = process.env.REDIS_URL
      this.REACT_APP_FRONTEND = process.env.REACT_APP_FRONTEND
      this.NODE_ENV = process.env.NODE_ENV
      this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
      this.CLOUDINARY_SERECT = process.env.CLOUDINARY_SERECT
      this.CLOUDINARY_KEY = process.env.CLOUDINARY_KEY
      
    }

    createLogger(name) {
         return bunyan.createLogger({name , level : 'debug'})
    }


    validateConfig() {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined.`);
            }
        }
    }

    cloudinaryConfig() {
        cloudinary.v2.config({
            cloud_name : this.CLOUDINARY_NAME,
            api_key : this.CLOUDINARY_KEY,
            api_secret : this.CLOUDINARY_SERECT
        })  
    }
}


export const config = new Config()
'use strict'
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



class DatabaseConnect{
    constructor(){
      this.type == 'mongodb'
      this.connect()
    }


    async connect(type = 'mongodb'){
        if(1 == 1) { // môi trg dev
          mongoose.set('debug',true);
          mongoose.set('debug',{color : true});
        }
        await mongoose.connect(process.env.MONGOOSE_URL)
        .then(_ => {
            console.log('Successfully connected MongoDB')
        })
        .catch( err => {
          console.log('DB connection error');
          throw new Error(err);
        });
        
    }

    static getInstance() {
      if(!DatabaseConnect.instance) {
        DatabaseConnect.instance = new DatabaseConnect();
      }
      return DatabaseConnect.instance;
    }
}



const connectDBMongoose = DatabaseConnect.getInstance();
export default connectDBMongoose;



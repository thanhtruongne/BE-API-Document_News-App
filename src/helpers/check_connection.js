'use strict'
import mongoose from "mongoose";
import os from 'os';
import process from 'process';


const second = 5000;
const core_count = 10;
const countConnectionMongoDB = () => {
    const number_connect = mongoose.connect.length;
    console.log("Count number of connection " + number_connect)
}


const CheckOverloadConnect = () => {
     setInterval( () => {
          const numConnection = mongoose.connect.length;
          const numCore = os.cpus().length;
          const memoryUse = process.memoryUsage().rss;
          if(numConnection > (numCore * core_count)) {
            console.log('Memory out : ', memoryUse / 1024 / 1024)
            console.log('Connection has been overload',numConnection);
          }

     },second)
}

export  {
    countConnectionMongoDB,
    CheckOverloadConnect
}
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';

const PORT = process.env.PORT || 3055;

const server =  app.listen(PORT, () => {
    console.log(`------::----${process.env.SERVICE_NAME} start with port ${PORT}`);
});

process.on('SIGINT', () => {
    server.close('Exit server express');
    // notify send (ping....)
});
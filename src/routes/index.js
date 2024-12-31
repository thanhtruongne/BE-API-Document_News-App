'use strict'

import express from 'express';
import userRoutes from './user.js';


let initRoutes = (app) => {
    app.use('/api/v1/user',userRoutes);
}


export default initRoutes;  
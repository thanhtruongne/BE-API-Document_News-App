'use strict'

import express from 'express';
import userRoutes from './user.route.js';


let initRoutes = (app) => {
    app.use('/api/v1/user',userRoutes);
}


export default initRoutes;  
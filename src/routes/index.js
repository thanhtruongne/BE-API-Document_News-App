'use strict'

import express from 'express';
import userRoutes from './user.route.js';
import layoutRoutes from './layout.route.js'

let initRoutes = (app) => {
    app.use('/api/v1/user',userRoutes);

    app.use('/api/v1/layout',layoutRoutes);

}


export default initRoutes;  
'use strict'

import express from 'express';
import authController from '../controllers/authController.js';
import { authencation } from '../utils/auth.utils.js';
const router = express.Router();

router.use(authencation);

router.get('/get-data-layout',authController.logout_temp)

export default router;  
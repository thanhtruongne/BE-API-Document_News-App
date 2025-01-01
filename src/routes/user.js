'use strict'

import express, { Router } from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register',authController.sign_up_temp);

export default router;
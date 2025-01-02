'use strict'

import express, { Router } from 'express';
import authController from '../controllers/authController.js';
import { validateRequestLogin,validateRequestSignIn } from '../middleware/validators/auth.middleware.js';
import categories from '../models/categories.model.js';
const router = express.Router();

router.post('/register',validateRequestSignIn,authController.sign_up_temp);
router.post('/login',validateRequestLogin,authController.login_temp)



    
export default router;  
'use strict'

import express from 'express';
import authController from '../controllers/authController.js';
import { validateRequestLogin,validateRequestSignIn } from '../middleware/validators/auth.middleware.js';
import { authencation } from '../utils/auth.utils.js';
const router = express.Router();

router.post('/register',validateRequestSignIn,authController.sign_up_temp);
router.post('/login',validateRequestLogin,authController.login_temp)

router.use(authencation);

router.post('/logout',authController.logout_temp)
router.post('/refresh-token', authController.refreshToken)


    
export default router;  
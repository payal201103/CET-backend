import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import { authRateLimiter } from '../../middlewares/rateLimit.middlewares.js';
import * as authValidation from '../../validations/auth.validation.js';
import AuthController from '../../controllers/auth.controller.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login', authRateLimiter, validateSchema(authValidation.login), authController.login);
router.post('/logout', validateToken, authController.logout);

router.post('/send-otp', authController.sendOtp);
router.post('/forgot-password/send-otp', authController.sendOtp);

router.post('/reset-password', authController.resetPasswordWithOtp);
router.post('/forgot-password/reset', authController.resetPasswordWithOtp);

export default router;

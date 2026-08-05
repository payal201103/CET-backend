import { Router } from 'express';
import authRoute from './auth.route.js';
import healthRoute from './health.route.js';
import userRoute from './user.route.js';
import customerRoute from './customer.route.js';
import companyRoute from './company.route.js';
import carBrandRoute from './carBrand.route.js';
import carModelRoute from './carModel.route.js';
import jobCardRoute from './jobCard.route.js';
import videoRoute from './video.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/health', healthRoute);
router.use('/users', userRoute);
router.use('/customers', customerRoute);
router.use('/companies', companyRoute);
router.use('/car-brands', carBrandRoute);
router.use('/car-models', carModelRoute);
router.use('/job-cards', jobCardRoute);
router.use('/video', videoRoute);

export default router;

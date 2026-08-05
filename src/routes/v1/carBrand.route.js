import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as carBrandValidation from '../../validations/carBrand.validation.js';
import CarBrandController from '../../controllers/carBrand.controller.js';

const router = express.Router();
const carBrandController = new CarBrandController();

router.use(validateToken);

router.get('/', carBrandController.getAllCarBrands);
router.post(
	'/',
	validateSchema(carBrandValidation.createCarBrand),
	carBrandController.createCarBrand
);
router.put(
	'/:id',
	validateSchema(carBrandValidation.updateCarBrand),
	carBrandController.updateCarBrand
);
router.delete('/:id', carBrandController.deleteCarBrand);

export default router;

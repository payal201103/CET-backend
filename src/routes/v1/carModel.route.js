import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as carModelValidation from '../../validations/carModel.validation.js';
import CarModelController from '../../controllers/carModel.controller.js';

const router = express.Router();
const carModelController = new CarModelController();

router.use(validateToken);

router.get('/', carModelController.getAllCarModels);
router.post(
	'/',
	validateSchema(carModelValidation.createCarModel),
	carModelController.createCarModel
);
router.put(
	'/:id',
	validateSchema(carModelValidation.updateCarModel),
	carModelController.updateCarModel
);
router.delete('/:id', carModelController.deleteCarModel);

export default router;

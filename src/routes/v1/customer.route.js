import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as customerValidation from '../../validations/customer.validation.js';
import CustomerController from '../../controllers/customer.controller.js';

const router = express.Router();
const customerController = new CustomerController();

router.use(validateToken);

router.get('/', customerController.getAllCustomers);
router.post(
	'/',
	validateSchema(customerValidation.createCustomer),
	customerController.createCustomer
);
router.put(
	'/:id',
	validateSchema(customerValidation.updateCustomer),
	customerController.updateCustomer
);
router.delete('/:id', customerController.deleteCustomer);

export default router;

import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as companyValidation from '../../validations/company.validation.js';
import CompanyController from '../../controllers/company.controller.js';

const router = express.Router();
const companyController = new CompanyController();

router.use(validateToken);

router.get('/', companyController.getAllCompanies);
router.post('/', validateSchema(companyValidation.createCompany), companyController.createCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;

import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as jobCardValidation from '../../validations/jobCard.validation.js';
import JobCardController from '../../controllers/jobCard.controller.js';

const router = express.Router();
const jobCardController = new JobCardController();

router.use(validateToken);

router.get('/', jobCardController.getAllJobCards);
router.get('/:id/pdf', jobCardController.getJobCardPdf);
router.post('/', validateSchema(jobCardValidation.createJobCard), jobCardController.createJobCard);
router.put(
	'/:id',
	validateSchema(jobCardValidation.updateJobCard),
	jobCardController.updateJobCard
);
router.patch('/:id/complete', jobCardController.completeJobCard);

export default router;

import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as videoPostingValidation from '../../validations/videoPosting.validation.js';
import VideoPostingController from '../../controllers/videoPosting.controller.js';

const router = express.Router();
const videoPostingController = new VideoPostingController();

// Require token validation for all video posting routes
router.use(validateToken);

router.get('/pending', videoPostingController.getVideoPostingPending);
router.get('/completed', videoPostingController.getVideoPostingCompleted);
router.patch(
	'/pending/:id',
	validateSchema(videoPostingValidation.updatePendingRequest),
	videoPostingController.updateVideoPostingPending
);

export default router;

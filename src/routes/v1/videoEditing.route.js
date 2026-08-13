import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as videoEditingValidation from '../../validations/videoEditing.validation.js';
import VideoEditingController from '../../controllers/videoEditing.controller.js';

const router = express.Router();
const videoEditingController = new VideoEditingController();

// Require token validation for all video editing routes
router.use(validateToken);

router.get('/pending', videoEditingController.getVideoEditingPending);
router.get('/completed', videoEditingController.getVideoEditingCompleted);
router.patch(
	'/pending/:id',
	validateSchema(videoEditingValidation.updatePendingRequest),
	videoEditingController.updateVideoEditingPending
);

export default router;

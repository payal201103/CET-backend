import express from 'express';
import validateSchema from '../../middlewares/validateSchema.middleware.js';
import validateToken from '../../middlewares/validateToken.middleware.js';
import * as videoValidation from '../../validations/video.validation.js';
import VideoController from '../../controllers/video.controller.js';

const router = express.Router();
const videoController = new VideoController();

// All video routes require validation of token
router.use(validateToken);

// Rejected Video Request Routes
router.get('/rejected', videoController.getRejectedVideoRequests);
router.post(
	'/rejected/:id/resolve',
	validateSchema(videoValidation.resolveRejectedRequest),
	videoController.resolveRejectedVideoRequest
);

// Video Role Statistics Route
router.get('/role-stats', videoController.getVideoRoleStats);

// Pending/Completed Video Request Routes
router.get('/pending', videoController.getVideoRequestsPending);
router.get('/completed', videoController.getVideoRequestsCompleted);
router.patch(
	'/pending/:id',
	validateSchema(videoValidation.updatePendingRequest),
	videoController.updateVideoRequestPending
);

export default router;

import VideoEditingService from '../services/videoEditing.service.js';
import logger from '../utils/logger.js';

const videoEditingService = new VideoEditingService();

class VideoEditingController {
	async getVideoEditingPending(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoEditingService.getVideoEditingPending(userId, userRole, branchId);
			return res.handler.success(requests, 'Pending video editing requests fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoEditingPending controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching pending video editing requests');
		}
	}

	async getVideoEditingCompleted(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoEditingService.getVideoEditingCompleted(userId, userRole, branchId);
			return res.handler.success(requests, 'Completed video editing requests fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoEditingCompleted controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching completed video editing requests');
		}
	}

	async updateVideoEditingPending(req, res) {
		try {
			const { id } = req.params;
			const { isActive } = req.body;

			if (!id) {
				return res.handler.badRequest({}, 'Pending Request ID is required');
			}

			const result = await videoEditingService.updateVideoEditingPending(id, isActive);
			return res.handler.success(result, 'Pending video editing status updated successfully');
		} catch (error) {
			logger.error('Error in updateVideoEditingPending controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating pending video editing request');
		}
	}
}

export default VideoEditingController;

import VideoPostingService from '../services/videoPosting.service.js';
import logger from '../utils/logger.js';

const videoPostingService = new VideoPostingService();

class VideoPostingController {
	async getVideoPostingPending(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoPostingService.getVideoPostingPending(userId, userRole, branchId);
			return res.handler.success(requests, 'Pending video posting requests fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoPostingPending controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching pending video posting requests');
		}
	}

	async getVideoPostingCompleted(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoPostingService.getVideoPostingCompleted(userId, userRole, branchId);
			return res.handler.success(requests, 'Completed video posting requests fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoPostingCompleted controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching completed video posting requests');
		}
	}

	async updateVideoPostingPending(req, res) {
		try {
			const { id } = req.params;
			const { isActive } = req.body;

			if (!id) {
				return res.handler.badRequest({}, 'Pending Request ID is required');
			}

			const result = await videoPostingService.updateVideoPostingPending(id, isActive);
			return res.handler.success(result, 'Pending video posting status updated successfully');
		} catch (error) {
			logger.error('Error in updateVideoPostingPending controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating pending video posting request');
		}
	}
}

export default VideoPostingController;

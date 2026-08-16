import VideoService from '../services/video.service.js';
import logger from '../utils/logger.js';

const videoService = new VideoService();

class VideoController {
	async getRejectedVideoRequests(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoService.getRejectedVideoRequests(userId, userRole, branchId);
			return res.handler.success(requests, 'Rejected video requests fetched successfully');
		} catch (error) {
			logger.error('Error in getRejectedVideoRequests controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching rejected video requests');
		}
	}

	async resolveRejectedVideoRequest(req, res) {
		try {
			const { id } = req.params;
			const { videoType } = req.body;
			
			// Default to current user's name if assignedBy is not provided
			const defaultUser = req.user ? `${req.user.Firstname || ''} ${req.user.Lastname || ''}`.trim() || req.user.userName : 'Admin User';
			const assignedBy = req.body.assignedBy || defaultUser;

			if (!id) {
				return res.handler.badRequest({}, 'Rejected Request ID is required');
			}

			const pendingRequest = await videoService.resolveRejectedVideoRequest(id, videoType, assignedBy);
			return res.handler.success(pendingRequest, 'Rejected request resolved and pending video request created successfully');
		} catch (error) {
			logger.error('Error in resolveRejectedVideoRequest controller', { error });
			return res.handler.serverError({}, error.message || 'Error resolving rejected request');
		}
	}

	async getVideoRequestsPending(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoService.getVideoRequestsPending(userId, userRole, branchId);
			return res.handler.success(requests, 'Pending video requests fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoRequestsPending controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching pending video requests');
		}
	}

	async getVideoRequestsCompleted(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const requests = await videoService.getVideoRequestsCompleted(userId, userRole, branchId);
			return res.handler.success(requests, 'Completed video requests fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoRequestsCompleted controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching completed video requests');
		}
	}

	async updateVideoRequestPending(req, res) {
		try {
			const { id } = req.params;
			const { isActive } = req.body;

			if (!id) {
				return res.handler.badRequest({}, 'Pending Request ID is required');
			}

			const result = await videoService.updateVideoRequestPending(id, isActive);
			return res.handler.success(result, 'Pending video request status updated successfully');
		} catch (error) {
			logger.error('Error in updateVideoRequestPending controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating pending video request');
		}
	}

	async getVideoRoleStats(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const branchId = req.branchId;
			const stats = await videoService.getVideoRoleStats(userId, userRole, branchId);
			return res.handler.success(stats, 'Video role statistics fetched successfully');
		} catch (error) {
			logger.error('Error in getVideoRoleStats controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching video role statistics');
		}
	}
}

export default VideoController;

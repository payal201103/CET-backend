import VideoPostingModel from '../models/videoPosting.model.js';

const videoPostingModel = new VideoPostingModel();

class VideoPostingService {
	async getVideoPostingPending(userId, userRole, branchId) {
		const rows = await videoPostingModel.getVideoPostingPending(userId, userRole, branchId);
		return rows.map((row) => ({
			id: row.id,
			jobCardId: row.jobCardNo,
			customer: row.customerName,
			carDetails: row.carDetails,
			videoType: row.videoType,
			status: row.status,
			videographer: row.videographer,
			dueDate: row.dueDate,
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async getVideoPostingCompleted(userId, userRole, branchId) {
		const rows = await videoPostingModel.getVideoPostingCompleted(userId, userRole, branchId);
		return rows.map((row) => ({
			id: row.id,
			jobCardId: row.jobCardNo,
			customer: row.customerName,
			carDetails: row.carDetails,
			videoType: row.videoType,
			status: row.status,
			videographer: row.videographer,
			dueDate: row.dueDate,
			completedDate: row.completedDate,
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async updateVideoPostingPending(id, isActive) {
		const result = await videoPostingModel.updateVideoPostingPending(id, isActive);
		return {
			id: result.id,
			jobCardId: result.jobCardNo,
			customer: result.customerName,
			carDetails: result.carDetails,
			videoType: result.videoType,
			status: result.status,
			videographer: result.videographer,
			dueDate: result.dueDate,
			completedDate: result.completedDate,
			isActive: result.isActive === 1 || result.isActive === true,
		};
	}
}

export default VideoPostingService;

import VideoEditingModel from '../models/videoEditing.model.js';

const videoEditingModel = new VideoEditingModel();

class VideoEditingService {
	async getVideoEditingPending(userId, userRole, branchId) {
		const rows = await videoEditingModel.getVideoEditingPending(userId, userRole, branchId);
		return rows.map((row) => ({
			id: row.id,
			jobCardId: row.jobCardNo,
			customer: row.customerName,
			carDetails: row.carDetails,
			videoType: row.videoType,
			status: row.status,
			videographer: row.videographer,
			editor: row.editor,
			dueDate: row.dueDate,
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async getVideoEditingCompleted(userId, userRole, branchId) {
		const rows = await videoEditingModel.getVideoEditingCompleted(userId, userRole, branchId);
		return rows.map((row) => ({
			id: row.id,
			jobCardId: row.jobCardNo,
			customer: row.customerName,
			carDetails: row.carDetails,
			videoType: row.videoType,
			status: row.status,
			videographer: row.videographer,
			editor: row.editor,
			dueDate: row.dueDate,
			completedDate: row.completedDate,
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async updateVideoEditingPending(id, isActive) {
		const result = await videoEditingModel.updateVideoEditingPending(id, isActive);
		return {
			id: result.id,
			jobCardId: result.jobCardNo,
			customer: result.customerName,
			carDetails: result.carDetails,
			videoType: result.videoType,
			status: result.status,
			videographer: result.videographer,
			editor: result.editor,
			dueDate: result.dueDate,
			completedDate: result.completedDate,
			isActive: result.isActive === 1 || result.isActive === true,
		};
	}
}

export default VideoEditingService;

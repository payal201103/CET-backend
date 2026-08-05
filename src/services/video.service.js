import VideoModel from '../models/video.model.js';

const videoModel = new VideoModel();

class VideoService {
	async getRejectedVideoRequests() {
		const rows = await videoModel.getRejectedVideoRequests();
		return rows.map((row) => ({
			id: row.id,
			jobCardNo: row.jobCardNo,
			customer: row.customerName,
			carDetails: row.carDetails,
			services: row.services ? row.services.split(',') : [],
			videographer: row.videographerName,
			rejectedDate: row.rejectedDate,
			rejectionReason: row.rejectionReason,
			isResolved: row.isResolved,
		}));
	}

	async resolveRejectedVideoRequest(id, videoType, assignedBy) {
		const result = await videoModel.resolveRejectedVideoRequest(id, videoType, assignedBy);
		return {
			id: result.id,
			jobCardNo: result.jobCardNo,
			customer: result.customerName,
			videoType: result.videoType,
			status: result.status,
			assignedBy: result.assignedBy,
			date: result.date,
			isActive: result.isActive === 1 || result.isActive === true,
		};
	}

	async getVideoRequestsPending() {
		const rows = await videoModel.getVideoRequestsPending();
		return rows.map((row) => ({
			id: row.id,
			jobCardId: row.jobCardNo,
			customer: row.customerName,
			videoType: row.videoType,
			status: row.status,
			assignedBy: row.assignedBy,
			date: row.date,
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async getVideoRequestsCompleted() {
		const rows = await videoModel.getVideoRequestsCompleted();
		return rows.map((row) => ({
			id: row.id,
			jobCardId: row.jobCardNo,
			customer: row.customerName,
			videoType: row.videoType,
			status: row.status,
			assignedBy: row.assignedBy,
			date: row.date,
			completedDate: row.completedDate,
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async updateVideoRequestPending(id, isActive) {
		const result = await videoModel.updateVideoRequestPending(id, isActive);
		return {
			id: result.id,
			jobCardNo: result.jobCardNo,
			customer: result.customerName,
			videoType: result.videoType,
			status: result.status,
			assignedBy: result.assignedBy,
			date: result.date,
			completedDate: result.completedDate,
			isActive: result.isActive === 1 || result.isActive === true,
		};
	}
}

export default VideoService;

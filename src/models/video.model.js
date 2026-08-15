import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const videoModel = {
	async getRejectedVideoRequests() {
		return executeStoredProcedure('sp_GetRejectedVideoRequests', []);
	},

	async resolveRejectedVideoRequest(id, videoType, assignedBy) {
		const params = [
			{ name: 'RejectedRequestId', type: sql.Int, value: Number(id) },
			{ name: 'VideoType', type: sql.VarChar(50), value: videoType },
			{ name: 'AssignedBy', type: sql.VarChar(100), value: assignedBy },
		];
		const result = await executeStoredProcedure('sp_ResolveRejectedVideoRequest', params);
		return result[0];
	},

	async getVideoRequestsPending() {
		return executeStoredProcedure('sp_GetVideoRequestsPending', []);
	},

	async getVideoRequestsCompleted() {
		return executeStoredProcedure('sp_GetVideoRequestsCompleted', []);
	},

	async updateVideoRequestPending(id, isActive) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'IsActive', type: sql.Bit, value: isActive ? 1 : 0 },
		];
		const result = await executeStoredProcedure('sp_UpdateVideoRequestPending', params);
		return result[0];
	},

	async getVideoRoleStats() {
		const result = await executeStoredProcedure('sp_GetVideoRoleStats', [], true, 'recordsets');
		return {
			videographers: result[0] || [],
			editors: result[1] || [],
		};
	},
};

export default class VideoModel {
	getRejectedVideoRequests() { return videoModel.getRejectedVideoRequests(); }
	resolveRejectedVideoRequest(id, videoType, assignedBy) { return videoModel.resolveRejectedVideoRequest(id, videoType, assignedBy); }
	getVideoRequestsPending() { return videoModel.getVideoRequestsPending(); }
	getVideoRequestsCompleted() { return videoModel.getVideoRequestsCompleted(); }
	updateVideoRequestPending(id, isActive) { return videoModel.updateVideoRequestPending(id, isActive); }
	getVideoRoleStats() { return videoModel.getVideoRoleStats(); }
}


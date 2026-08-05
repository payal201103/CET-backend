import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class VideoModel {
	async getRejectedVideoRequests() {
		try {
			return await executeStoredProcedure('sp_GetRejectedVideoRequests', []);
		} catch (error) {
			logger.error('Error in getRejectedVideoRequests model', { error });
			throw error;
		}
	}

	async resolveRejectedVideoRequest(id, videoType, assignedBy) {
		try {
			const params = [
				{ name: 'RejectedRequestId', type: sql.Int, value: Number(id) },
				{ name: 'VideoType', type: sql.VarChar(50), value: videoType },
				{ name: 'AssignedBy', type: sql.VarChar(100), value: assignedBy },
			];
			const result = await executeStoredProcedure('sp_ResolveRejectedVideoRequest', params);
			return result[0];
		} catch (error) {
			logger.error('Error in resolveRejectedVideoRequest model', { error });
			throw error;
		}
	}

	async getVideoRequestsPending() {
		try {
			return await executeStoredProcedure('sp_GetVideoRequestsPending', []);
		} catch (error) {
			logger.error('Error in getVideoRequestsPending model', { error });
			throw error;
		}
	}

	async getVideoRequestsCompleted() {
		try {
			return await executeStoredProcedure('sp_GetVideoRequestsCompleted', []);
		} catch (error) {
			logger.error('Error in getVideoRequestsCompleted model', { error });
			throw error;
		}
	}

	async updateVideoRequestPending(id, isActive) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'IsActive', type: sql.Bit, value: isActive ? 1 : 0 },
			];
			const result = await executeStoredProcedure('sp_UpdateVideoRequestPending', params);
			return result[0];
		} catch (error) {
			logger.error('Error in updateVideoRequestPending model', { error });
			throw error;
		}
	}
}

export default VideoModel;

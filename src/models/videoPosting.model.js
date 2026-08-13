import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class VideoPostingModel {
	async getVideoPostingPending() {
		try {
			return await executeStoredProcedure('sp_GetVideoPostingPending', []);
		} catch (error) {
			logger.error('Error in getVideoPostingPending model', { error });
			throw error;
		}
	}

	async getVideoPostingCompleted() {
		try {
			return await executeStoredProcedure('sp_GetVideoPostingCompleted', []);
		} catch (error) {
			logger.error('Error in getVideoPostingCompleted model', { error });
			throw error;
		}
	}

	async updateVideoPostingPending(id, isActive) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'IsActive', type: sql.Bit, value: isActive ? 1 : 0 },
			];
			const result = await executeStoredProcedure('sp_UpdateVideoPostingPending', params);
			return result[0];
		} catch (error) {
			logger.error('Error in updateVideoPostingPending model', { error });
			throw error;
		}
	}
}

export default VideoPostingModel;

import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class VideoEditingModel {
	async getVideoEditingPending() {
		try {
			return await executeStoredProcedure('sp_GetVideoEditingPending', []);
		} catch (error) {
			logger.error('Error in getVideoEditingPending model', { error });
			throw error;
		}
	}

	async getVideoEditingCompleted() {
		try {
			return await executeStoredProcedure('sp_GetVideoEditingCompleted', []);
		} catch (error) {
			logger.error('Error in getVideoEditingCompleted model', { error });
			throw error;
		}
	}

	async updateVideoEditingPending(id, isActive) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'IsActive', type: sql.Bit, value: isActive ? 1 : 0 },
			];
			const result = await executeStoredProcedure('sp_UpdateVideoEditingPending', params);
			return result[0];
		} catch (error) {
			logger.error('Error in updateVideoEditingPending model', { error });
			throw error;
		}
	}
}

export default VideoEditingModel;

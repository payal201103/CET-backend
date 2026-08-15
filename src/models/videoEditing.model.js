import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const videoEditingModel = {
	async getVideoEditingPending() {
		return executeStoredProcedure('sp_GetVideoEditingPending', []);
	},

	async getVideoEditingCompleted() {
		return executeStoredProcedure('sp_GetVideoEditingCompleted', []);
	},

	async updateVideoEditingPending(id, isActive) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'IsActive', type: sql.Bit, value: isActive ? 1 : 0 },
		];
		const result = await executeStoredProcedure('sp_UpdateVideoEditingPending', params);
		return result[0];
	},
};

export default class VideoEditingModel {
	getVideoEditingPending() { return videoEditingModel.getVideoEditingPending(); }
	getVideoEditingCompleted() { return videoEditingModel.getVideoEditingCompleted(); }
	updateVideoEditingPending(id, isActive) { return videoEditingModel.updateVideoEditingPending(id, isActive); }
}


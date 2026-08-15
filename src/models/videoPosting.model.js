import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const videoPostingModel = {
	async getVideoPostingPending() {
		return executeStoredProcedure('sp_GetVideoPostingPending', []);
	},

	async getVideoPostingCompleted() {
		return executeStoredProcedure('sp_GetVideoPostingCompleted', []);
	},

	async updateVideoPostingPending(id, isActive) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'IsActive', type: sql.Bit, value: isActive ? 1 : 0 },
		];
		const result = await executeStoredProcedure('sp_UpdateVideoPostingPending', params);
		return result[0];
	},
};

export default class VideoPostingModel {
	getVideoPostingPending() { return videoPostingModel.getVideoPostingPending(); }
	getVideoPostingCompleted() { return videoPostingModel.getVideoPostingCompleted(); }
	updateVideoPostingPending(id, isActive) { return videoPostingModel.updateVideoPostingPending(id, isActive); }
}


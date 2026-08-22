import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const videoPostingModel = {
	async getVideoPostingPending(userId, userRole, branchId) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		return executeStoredProcedure('sp_GetVideoPostingPending', params);
	},

	async getVideoPostingCompleted(userId, userRole, branchId) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		return executeStoredProcedure('sp_GetVideoPostingCompleted', params);
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
	getVideoPostingPending(userId, userRole, branchId) { return videoPostingModel.getVideoPostingPending(userId, userRole, branchId); }
	getVideoPostingCompleted(userId, userRole, branchId) { return videoPostingModel.getVideoPostingCompleted(userId, userRole, branchId); }
	updateVideoPostingPending(id, isActive) { return videoPostingModel.updateVideoPostingPending(id, isActive); }
}


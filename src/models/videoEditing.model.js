import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const videoEditingModel = {
	async getVideoEditingPending(userId, userRole, branchId) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		return executeStoredProcedure('sp_GetVideoEditingPending', params);
	},

	async getVideoEditingCompleted(userId, userRole, branchId) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		return executeStoredProcedure('sp_GetVideoEditingCompleted', params);
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
	getVideoEditingPending(userId, userRole, branchId) { return videoEditingModel.getVideoEditingPending(userId, userRole, branchId); }
	getVideoEditingCompleted(userId, userRole, branchId) { return videoEditingModel.getVideoEditingCompleted(userId, userRole, branchId); }
	updateVideoEditingPending(id, isActive) { return videoEditingModel.updateVideoEditingPending(id, isActive); }
}


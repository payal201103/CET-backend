import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

export const videoModel = {
	async getRejectedVideoRequests(userId, userRole, branchId) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
				{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
			];
			return await executeStoredProcedure('sp_GetRejectedVideoRequests', params);
		} catch (error) {
			logger.error('Error in getRejectedVideoRequests model', { error });
			throw error;
		}
	},

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
	},

	async getVideoRequestsPending(userId, userRole, branchId) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
				{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
			];
			return await executeStoredProcedure('sp_GetVideoRequestsPending', params);
		} catch (error) {
			logger.error('Error in getVideoRequestsPending model', { error });
			throw error;
		}
	},

	async getVideoRequestsCompleted(userId, userRole, branchId) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
				{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
			];
			return await executeStoredProcedure('sp_GetVideoRequestsCompleted', params);
		} catch (error) {
			logger.error('Error in getVideoRequestsCompleted model', { error });
			throw error;
		}
	},

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
	},

	async getVideoRoleStats(userId, userRole, branchId) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
				{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
			];
			const result = await executeStoredProcedure('sp_GetVideoRoleStats', params, true, 'recordsets');
			return {
				videographers: result[0] || [],
				editors: result[1] || [],
			};
		} catch (error) {
			logger.error('Error in getVideoRoleStats model', { error });
			throw error;
		}
	},
};

export default class VideoModel {
	getRejectedVideoRequests(userId, userRole, branchId) { return videoModel.getRejectedVideoRequests(userId, userRole, branchId); }
	resolveRejectedVideoRequest(id, videoType, assignedBy) { return videoModel.resolveRejectedVideoRequest(id, videoType, assignedBy); }
	getVideoRequestsPending(userId, userRole, branchId) { return videoModel.getVideoRequestsPending(userId, userRole, branchId); }
	getVideoRequestsCompleted(userId, userRole, branchId) { return videoModel.getVideoRequestsCompleted(userId, userRole, branchId); }
	updateVideoRequestPending(id, isActive) { return videoModel.updateVideoRequestPending(id, isActive); }
	getVideoRoleStats(userId, userRole, branchId) { return videoModel.getVideoRoleStats(userId, userRole, branchId); }
}


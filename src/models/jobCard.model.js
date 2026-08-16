import sql from 'mssql';
import { executeStoredProcedure, getConnection } from '../database/index.js';

export const jobCardModel = {
	async getAllJobCards(userId, userRole, branchId) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		return executeStoredProcedure('sp_GetJobCards', params);
	},

	async createJobCard(jobCardData, createdBy, branchId) {
		const pool = getConnection();
		const countResult = await pool.request().query('SELECT COUNT(*) as count FROM job_cards');
		const count = countResult.recordset[0].count;
		const currentYear = new Date().getFullYear();
		const jobCardNo = `JC-${currentYear}-${String(count + 1).padStart(3, '0')}`;

		const servicesStr = Array.isArray(jobCardData.services)
			? jobCardData.services.join(',')
			: jobCardData.services;

		const params = [
			{ name: 'JobCardNo', type: sql.VarChar(50), value: jobCardNo },
			{ name: 'CustomerId', type: sql.Int, value: Number(jobCardData.customerId) },
			{ name: 'BrandId', type: sql.Int, value: Number(jobCardData.brandId) },
			{ name: 'ModelId', type: sql.Int, value: Number(jobCardData.modelId) },
			{ name: 'CarNumber', type: sql.VarChar(50), value: jobCardData.carNumber || null },
			{ name: 'CarColor', type: sql.VarChar(50), value: jobCardData.carColor || null },
			{ name: 'Services', type: sql.VarChar(1000), value: servicesStr },
			{ name: 'BookingDate', type: sql.DateTime, value: new Date(jobCardData.bookingDate) },
			{ name: 'DeliveryDate', type: sql.DateTime, value: new Date(jobCardData.deliveryDate) },
			{ name: 'SpecialNotes', type: sql.VarChar(sql.MAX), value: jobCardData.specialNotes || null },
			{ name: 'Status', type: sql.VarChar(50), value: jobCardData.status || 'Pending' },
			{ name: 'CreatedBy', type: sql.Int, value: Number(createdBy) },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];

		const result = await executeStoredProcedure('sp_CreateJobCard', params);
		return {
			id: result[0].id,
			jobCardNo,
			branchId: result[0].branchId || branchId,
		};
	},

	async updateJobCard(id, jobCardData, userId, userRole, branchId) {
		const servicesStr = Array.isArray(jobCardData.services)
			? jobCardData.services.join(',')
			: jobCardData.services;

		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'BrandId', type: sql.Int, value: Number(jobCardData.brandId) },
			{ name: 'ModelId', type: sql.Int, value: Number(jobCardData.modelId) },
			{ name: 'CarNumber', type: sql.VarChar(50), value: jobCardData.carNumber || null },
			{ name: 'CarColor', type: sql.VarChar(50), value: jobCardData.carColor || null },
			{ name: 'Services', type: sql.VarChar(1000), value: servicesStr },
			{ name: 'BookingDate', type: sql.DateTime, value: new Date(jobCardData.bookingDate) },
			{ name: 'DeliveryDate', type: sql.DateTime, value: new Date(jobCardData.deliveryDate) },
			{ name: 'SpecialNotes', type: sql.VarChar(sql.MAX), value: jobCardData.specialNotes || null },
			{ name: 'Status', type: sql.VarChar(50), value: jobCardData.status || 'Pending' },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];

		return executeStoredProcedure('sp_UpdateJobCard', params);
	},

	async deleteJobCard(id, userId, userRole, branchId) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		return executeStoredProcedure('sp_DeleteJobCard', params);
	},

	async completeJobCard(id, userId, userRole, branchId) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'BranchId', type: sql.Int, value: branchId ? Number(branchId) : null },
		];
		const result = await executeStoredProcedure('sp_CompleteJobCard', params);
		return result[0];
	},
};

export default class JobCardModel {
	getAllJobCards(userId, userRole, branchId) { return jobCardModel.getAllJobCards(userId, userRole, branchId); }
	createJobCard(jobCardData, createdBy, branchId) { return jobCardModel.createJobCard(jobCardData, createdBy, branchId); }
	updateJobCard(id, jobCardData, userId, userRole, branchId) { return jobCardModel.updateJobCard(id, jobCardData, userId, userRole, branchId); }
	deleteJobCard(id, userId, userRole, branchId) { return jobCardModel.deleteJobCard(id, userId, userRole, branchId); }
	completeJobCard(id, userId, userRole, branchId) { return jobCardModel.completeJobCard(id, userId, userRole, branchId); }
}


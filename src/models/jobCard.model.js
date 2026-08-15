import sql from 'mssql';
import { executeStoredProcedure, getConnection } from '../database/index.js';

export const jobCardModel = {
	async getAllJobCards(userId, userRole) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		return executeStoredProcedure('sp_GetJobCards', params);
	},

	async createJobCard(jobCardData, createdBy) {
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
		];

		const result = await executeStoredProcedure('sp_CreateJobCard', params);
		return {
			id: result[0].id,
			jobCardNo,
		};
	},

	async updateJobCard(id, jobCardData, userId, userRole) {
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
		];

		return executeStoredProcedure('sp_UpdateJobCard', params);
	},

	async deleteJobCard(id, userId, userRole) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		return executeStoredProcedure('sp_DeleteJobCard', params);
	},

	async completeJobCard(id, userId, userRole) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		const result = await executeStoredProcedure('sp_CompleteJobCard', params);
		return result[0];
	},
};

export default class JobCardModel {
	getAllJobCards(userId, userRole) { return jobCardModel.getAllJobCards(userId, userRole); }
	createJobCard(jobCardData, createdBy) { return jobCardModel.createJobCard(jobCardData, createdBy); }
	updateJobCard(id, jobCardData, userId, userRole) { return jobCardModel.updateJobCard(id, jobCardData, userId, userRole); }
	deleteJobCard(id, userId, userRole) { return jobCardModel.deleteJobCard(id, userId, userRole); }
	completeJobCard(id, userId, userRole) { return jobCardModel.completeJobCard(id, userId, userRole); }
}


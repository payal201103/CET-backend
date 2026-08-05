import sql from 'mssql';
import { executeStoredProcedure, getConnection } from '../database/index.js';
import logger from '../utils/logger.js';

class JobCardModel {
	async getAllJobCards(userId, userRole) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			return await executeStoredProcedure('sp_GetJobCards', params);
		} catch (error) {
			logger.error('Error in getAllJobCards model', { error });
			throw error;
		}
	}

	async createJobCard(jobCardData, createdBy) {
		try {
			const pool = getConnection();
			const countResult = await pool.request().query('SELECT COUNT(*) as count FROM job_cards');
			const count = countResult.recordset[0].count;
			const currentYear = new Date().getFullYear();
			const jobCardNo = `JC-${currentYear}-${String(count + 1).padStart(3, '0')}`;

			// Services parameter should be a comma-separated string
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
				{
					name: 'SpecialNotes',
					type: sql.VarChar(sql.MAX),
					value: jobCardData.specialNotes || null,
				},
				{ name: 'Status', type: sql.VarChar(50), value: jobCardData.status || 'Pending' },
				{ name: 'CreatedBy', type: sql.Int, value: Number(createdBy) },
			];

			const result = await executeStoredProcedure('sp_CreateJobCard', params);
			return {
				id: result[0].id,
				jobCardNo,
			};
		} catch (error) {
			logger.error('Error in createJobCard model', { error });
			throw error;
		}
	}

	async updateJobCard(id, jobCardData, userId, userRole) {
		try {
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
				{
					name: 'SpecialNotes',
					type: sql.VarChar(sql.MAX),
					value: jobCardData.specialNotes || null,
				},
				{ name: 'Status', type: sql.VarChar(50), value: jobCardData.status || 'Pending' },
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];

			return await executeStoredProcedure('sp_UpdateJobCard', params);
		} catch (error) {
			logger.error('Error in updateJobCard model', { error });
			throw error;
		}
	}

	async deleteJobCard(id, userId, userRole) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			return await executeStoredProcedure('sp_DeleteJobCard', params);
		} catch (error) {
			logger.error('Error in deleteJobCard model', { error });
			throw error;
		}
	}

	async completeJobCard(id, userId, userRole) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			const result = await executeStoredProcedure('sp_CompleteJobCard', params);
			return result[0];
		} catch (error) {
			logger.error('Error in completeJobCard model', { error });
			throw error;
		}
	}
}

export default JobCardModel;

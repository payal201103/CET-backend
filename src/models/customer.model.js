import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class CustomerModel {
	async getAllCustomers(userId, userRole) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			return await executeStoredProcedure('sp_GetCustomers', params);
		} catch (error) {
			logger.error('Error in getAllCustomers model', { error });
			throw error;
		}
	}

	async createCustomer(customerData) {
		try {
			const params = [
				{ name: 'CustomerName', type: sql.VarChar(150), value: customerData.customerName },
				{ name: 'MobileNumber', type: sql.VarChar(15), value: customerData.mobileNumber },
				{ name: 'EmailId', type: sql.VarChar(100), value: customerData.emailId || null },
				{ name: 'GstNumber', type: sql.VarChar(15), value: customerData.gstNumber || null },
				{ name: 'CreatedBy', type: sql.Int, value: Number(customerData.createdBy) },
			];
			const result = await executeStoredProcedure('sp_CreateCustomer', params);
			return result[0];
		} catch (error) {
			logger.error('Error in createCustomer model', { error });
			throw error;
		}
	}

	async deleteCustomer(id, userId, userRole) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			return await executeStoredProcedure('sp_DeleteCustomer', params);
		} catch (error) {
			logger.error('Error in deleteCustomer model', { error });
			throw error;
		}
	}

	async updateCustomer(id, customerData, userId, userRole) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'CustomerName', type: sql.VarChar(150), value: customerData.customerName },
				{ name: 'MobileNumber', type: sql.VarChar(15), value: customerData.mobileNumber },
				{ name: 'EmailId', type: sql.VarChar(100), value: customerData.emailId || null },
				{ name: 'GstNumber', type: sql.VarChar(15), value: customerData.gstNumber || null },
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			const result = await executeStoredProcedure('sp_UpdateCustomer', params);
			return result[0];
		} catch (error) {
			logger.error('Error in updateCustomer model', { error });
			throw error;
		}
	}
}

export default CustomerModel;

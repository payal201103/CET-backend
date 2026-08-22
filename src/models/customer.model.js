import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const customerModel = {
	async getAllCustomers(userId, userRole) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		return executeStoredProcedure('sp_GetCustomers', params);
	},

	async createCustomer(customerData) {
		const params = [
			{ name: 'CustomerName', type: sql.VarChar(150), value: customerData.customerName },
			{ name: 'MobileNumber', type: sql.VarChar(15), value: customerData.mobileNumber },
			{ name: 'EmailId', type: sql.VarChar(100), value: customerData.emailId || null },
			{ name: 'GstNumber', type: sql.VarChar(15), value: customerData.gstNumber || null },
			{ name: 'CreatedBy', type: sql.Int, value: Number(customerData.createdBy) },
		];
		const result = await executeStoredProcedure('sp_CreateCustomer', params);
		return result[0];
	},

	async deleteCustomer(id, userId, userRole) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		return executeStoredProcedure('sp_DeleteCustomer', params);
	},

	async updateCustomer(id, customerData, userId, userRole) {
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
	},
};

export default class CustomerModel {
	getAllCustomers(userId, userRole) { return customerModel.getAllCustomers(userId, userRole); }
	createCustomer(customerData) { return customerModel.createCustomer(customerData); }
	deleteCustomer(id, userId, userRole) { return customerModel.deleteCustomer(id, userId, userRole); }
	updateCustomer(id, customerData, userId, userRole) { return customerModel.updateCustomer(id, customerData, userId, userRole); }
}


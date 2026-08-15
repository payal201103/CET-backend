import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const companyModel = {
	async getAllCompanies(userId, userRole) {
		const params = [
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		return executeStoredProcedure('sp_GetCompanies', params);
	},

	async createCompany(companyData) {
		const params = [
			{ name: 'CompanyName', type: sql.VarChar(150), value: companyData.companyName },
			{ name: 'MobileNumber', type: sql.VarChar(15), value: companyData.mobileNumber },
			{ name: 'Gstin', type: sql.VarChar(15), value: companyData.gstin || null },
			{ name: 'Address', type: sql.VarChar(500), value: companyData.address || null },
			{ name: 'CreatedBy', type: sql.Int, value: Number(companyData.createdBy) },
		];
		const result = await executeStoredProcedure('sp_CreateCompany', params);
		return result[0];
	},

	async deleteCompany(id, userId, userRole) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'UserId', type: sql.Int, value: Number(userId) },
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
		];
		return executeStoredProcedure('sp_DeleteCompany', params);
	},
};

export default class CompanyModel {
	getAllCompanies(userId, userRole) { return companyModel.getAllCompanies(userId, userRole); }
	createCompany(companyData) { return companyModel.createCompany(companyData); }
	deleteCompany(id, userId, userRole) { return companyModel.deleteCompany(id, userId, userRole); }
}


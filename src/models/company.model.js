import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class CompanyModel {
	async getAllCompanies(userId, userRole) {
		try {
			const params = [
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			return await executeStoredProcedure('sp_GetCompanies', params);
		} catch (error) {
			logger.error('Error in getAllCompanies model', { error });
			throw error;
		}
	}

	async createCompany(companyData) {
		try {
			const params = [
				{ name: 'CompanyName', type: sql.VarChar(150), value: companyData.companyName },
				{ name: 'MobileNumber', type: sql.VarChar(15), value: companyData.mobileNumber },
				{ name: 'Gstin', type: sql.VarChar(15), value: companyData.gstin || null },
				{ name: 'Address', type: sql.VarChar(500), value: companyData.address || null },
				{ name: 'CreatedBy', type: sql.Int, value: Number(companyData.createdBy) },
			];
			const result = await executeStoredProcedure('sp_CreateCompany', params);
			return result[0];
		} catch (error) {
			logger.error('Error in createCompany model', { error });
			throw error;
		}
	}

	async deleteCompany(id, userId, userRole) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'UserId', type: sql.Int, value: Number(userId) },
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			];
			return await executeStoredProcedure('sp_DeleteCompany', params);
		} catch (error) {
			logger.error('Error in deleteCompany model', { error });
			throw error;
		}
	}
}

export default CompanyModel;

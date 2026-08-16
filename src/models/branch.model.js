import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class BranchModel {
	async getAllBranches() {
		try {
			return await executeStoredProcedure('sp_GetBranches', []);
		} catch (error) {
			logger.error('Error in getAllBranches model', { error });
			throw error;
		}
	}

	async createBranch(branchData) {
		try {
			const params = [
				{ name: 'BranchName', type: sql.VarChar(150), value: branchData.branchName },
				{ name: 'City', type: sql.VarChar(100), value: branchData.city || null },
			];
			const result = await executeStoredProcedure('sp_CreateBranch', params);
			return result[0];
		} catch (error) {
			logger.error('Error in createBranch model', { error });
			throw error;
		}
	}
}

export default BranchModel;

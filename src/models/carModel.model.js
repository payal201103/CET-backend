import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class CarModelModel {
	async getAllCarModels() {
		try {
			return await executeStoredProcedure('sp_GetCarModels', []);
		} catch (error) {
			logger.error('Error in getAllCarModels model', { error });
			throw error;
		}
	}

	async createCarModel(brandId, modelName, createdBy) {
		try {
			const params = [
				{ name: 'BrandId', type: sql.Int, value: Number(brandId) },
				{ name: 'ModelName', type: sql.VarChar(100), value: modelName },
				{ name: 'CreatedBy', type: sql.Int, value: Number(createdBy) },
			];
			const result = await executeStoredProcedure('sp_CreateCarModel', params);
			return result[0];
		} catch (error) {
			logger.error('Error in createCarModel model', { error });
			throw error;
		}
	}

	async updateCarModel(id, brandId, modelName) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'BrandId', type: sql.Int, value: Number(brandId) },
				{ name: 'ModelName', type: sql.VarChar(100), value: modelName },
			];
			return await executeStoredProcedure('sp_UpdateCarModel', params);
		} catch (error) {
			logger.error('Error in updateCarModel model', { error });
			throw error;
		}
	}

	async deleteCarModel(id) {
		try {
			const params = [{ name: 'Id', type: sql.Int, value: Number(id) }];
			return await executeStoredProcedure('sp_DeleteCarModel', params);
		} catch (error) {
			logger.error('Error in deleteCarModel model', { error });
			throw error;
		}
	}
}

export default CarModelModel;

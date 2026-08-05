import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class CarBrandModel {
	async getAllCarBrands() {
		try {
			return await executeStoredProcedure('sp_GetCarBrands', []);
		} catch (error) {
			logger.error('Error in getAllCarBrands model', { error });
			throw error;
		}
	}

	async createCarBrand(brandName, createdBy) {
		try {
			const params = [
				{ name: 'BrandName', type: sql.VarChar(100), value: brandName },
				{ name: 'CreatedBy', type: sql.Int, value: Number(createdBy) },
			];
			const result = await executeStoredProcedure('sp_CreateCarBrand', params);
			return result[0];
		} catch (error) {
			logger.error('Error in createCarBrand model', { error });
			throw error;
		}
	}

	async deleteCarBrand(id) {
		try {
			const params = [{ name: 'Id', type: sql.Int, value: Number(id) }];
			return await executeStoredProcedure('sp_DeleteCarBrand', params);
		} catch (error) {
			logger.error('Error in deleteCarBrand model', { error });
			throw error;
		}
	}

	async updateCarBrand(id, brandName) {
		try {
			const params = [
				{ name: 'Id', type: sql.Int, value: Number(id) },
				{ name: 'BrandName', type: sql.VarChar(100), value: brandName },
			];
			return await executeStoredProcedure('sp_UpdateCarBrand', params);
		} catch (error) {
			logger.error('Error in updateCarBrand model', { error });
			throw error;
		}
	}
}

export default CarBrandModel;

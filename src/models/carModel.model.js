import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const carModelModel = {
	async getAllCarModels() {
		return executeStoredProcedure('sp_GetCarModels', []);
	},

	async createCarModel(brandId, modelName, createdBy) {
		const params = [
			{ name: 'BrandId', type: sql.Int, value: Number(brandId) },
			{ name: 'ModelName', type: sql.VarChar(100), value: modelName },
			{ name: 'CreatedBy', type: sql.Int, value: Number(createdBy) },
		];
		const result = await executeStoredProcedure('sp_CreateCarModel', params);
		return result[0];
	},

	async updateCarModel(id, brandId, modelName) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'BrandId', type: sql.Int, value: Number(brandId) },
			{ name: 'ModelName', type: sql.VarChar(100), value: modelName },
		];
		return executeStoredProcedure('sp_UpdateCarModel', params);
	},

	async deleteCarModel(id) {
		const params = [{ name: 'Id', type: sql.Int, value: Number(id) }];
		return executeStoredProcedure('sp_DeleteCarModel', params);
	},
};

export default class CarModelModel {
	getAllCarModels() { return carModelModel.getAllCarModels(); }
	createCarModel(brandId, modelName, createdBy) { return carModelModel.createCarModel(brandId, modelName, createdBy); }
	updateCarModel(id, brandId, modelName) { return carModelModel.updateCarModel(id, brandId, modelName); }
	deleteCarModel(id) { return carModelModel.deleteCarModel(id); }
}


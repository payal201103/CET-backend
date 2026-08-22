import sql from 'mssql';
import { executeStoredProcedure } from '../database/index.js';

export const carBrandModel = {
	async getAllCarBrands() {
		return executeStoredProcedure('sp_GetCarBrands', []);
	},

	async createCarBrand(brandName, createdBy) {
		const params = [
			{ name: 'BrandName', type: sql.VarChar(100), value: brandName },
			{ name: 'CreatedBy', type: sql.Int, value: Number(createdBy) },
		];
		const result = await executeStoredProcedure('sp_CreateCarBrand', params);
		return result[0];
	},

	async deleteCarBrand(id) {
		const params = [{ name: 'Id', type: sql.Int, value: Number(id) }];
		return executeStoredProcedure('sp_DeleteCarBrand', params);
	},

	async updateCarBrand(id, brandName) {
		const params = [
			{ name: 'Id', type: sql.Int, value: Number(id) },
			{ name: 'BrandName', type: sql.VarChar(100), value: brandName },
		];
		return executeStoredProcedure('sp_UpdateCarBrand', params);
	},
};

export default class CarBrandModel {
	getAllCarBrands() { return carBrandModel.getAllCarBrands(); }
	createCarBrand(brandName, createdBy) { return carBrandModel.createCarBrand(brandName, createdBy); }
	deleteCarBrand(id) { return carBrandModel.deleteCarBrand(id); }
	updateCarBrand(id, brandName) { return carBrandModel.updateCarBrand(id, brandName); }
}


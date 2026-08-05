import CarBrandModel from '../models/carBrand.model.js';

const carBrandModel = new CarBrandModel();

class CarBrandService {
	async getAllCarBrands() {
		return await carBrandModel.getAllCarBrands();
	}

	async createCarBrand(brandName, createdBy) {
		const result = await carBrandModel.createCarBrand(brandName, createdBy);
		return {
			id: result.id,
			name: brandName,
			createdBy,
		};
	}

	async deleteCarBrand(id) {
		return await carBrandModel.deleteCarBrand(id);
	}

	async updateCarBrand(id, brandName) {
		await carBrandModel.updateCarBrand(id, brandName);
		return {
			id,
			name: brandName,
		};
	}
}

export default CarBrandService;

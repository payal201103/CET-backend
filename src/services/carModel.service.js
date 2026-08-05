import CarModelModel from '../models/carModel.model.js';
import CarBrandModel from '../models/carBrand.model.js';

const carModelModel = new CarModelModel();
const carBrandModel = new CarBrandModel();

class CarModelService {
	async getAllCarModels() {
		return await carModelModel.getAllCarModels();
	}

	async createCarModel(brandId, modelName, createdBy) {
		const result = await carModelModel.createCarModel(brandId, modelName, createdBy);
		const brands = await carBrandModel.getAllCarBrands();
		const brand = brands.find((b) => Number(b.id) === Number(brandId));
		const brandName = brand ? brand.name : '';

		return {
			id: result.id,
			brandId: Number(brandId),
			brandName,
			modelName,
			createdBy,
		};
	}

	async updateCarModel(id, brandId, modelName) {
		await carModelModel.updateCarModel(id, brandId, modelName);

		const brands = await carBrandModel.getAllCarBrands();
		const brand = brands.find((b) => Number(b.id) === Number(brandId));
		const brandName = brand ? brand.name : '';

		return {
			id: Number(id),
			brandId: Number(brandId),
			brandName,
			modelName,
		};
	}

	async deleteCarModel(id) {
		return await carModelModel.deleteCarModel(id);
	}
}

export default CarModelService;

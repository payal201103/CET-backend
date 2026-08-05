import CarBrandService from '../services/carBrand.service.js';
import logger from '../utils/logger.js';

const carBrandService = new CarBrandService();

class CarBrandController {
	async getAllCarBrands(req, res) {
		try {
			const brands = await carBrandService.getAllCarBrands();
			return res.handler.success(brands, 'Car brands fetched successfully');
		} catch (error) {
			logger.error('Error in getAllCarBrands controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching car brands');
		}
	}

	async createCarBrand(req, res) {
		try {
			const { brandName } = req.body;
			const createdBy = req.user?.userId;

			const newBrand = await carBrandService.createCarBrand(brandName, createdBy);
			return res.handler.success(newBrand, 'Car brand created successfully');
		} catch (error) {
			logger.error('Error in createCarBrand controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating car brand');
		}
	}

	async deleteCarBrand(req, res) {
		try {
			const { id } = req.params;

			if (!id) {
				return res.handler.badRequest({}, 'Car brand ID is required');
			}

			await carBrandService.deleteCarBrand(id);
			return res.handler.success({}, 'Car brand deleted successfully');
		} catch (error) {
			logger.error('Error in deleteCarBrand controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting car brand');
		}
	}

	async updateCarBrand(req, res) {
		try {
			const { id } = req.params;
			const { brandName } = req.body;

			if (!id) {
				return res.handler.badRequest({}, 'Car brand ID is required');
			}

			const updatedBrand = await carBrandService.updateCarBrand(id, brandName);
			return res.handler.success(updatedBrand, 'Car brand updated successfully');
		} catch (error) {
			logger.error('Error in updateCarBrand controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating car brand');
		}
	}
}

export default CarBrandController;

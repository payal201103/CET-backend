import CarModelService from '../services/carModel.service.js';
import logger from '../utils/logger.js';

const carModelService = new CarModelService();

class CarModelController {
	async getAllCarModels(req, res) {
		try {
			const models = await carModelService.getAllCarModels();
			return res.handler.success(models, 'Car models fetched successfully');
		} catch (error) {
			logger.error('Error in getAllCarModels controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching car models');
		}
	}

	async createCarModel(req, res) {
		try {
			const { brandId, modelName } = req.body;
			const createdBy = req.user?.userId;

			const newModel = await carModelService.createCarModel(brandId, modelName, createdBy);
			return res.handler.success(newModel, 'Car model created successfully');
		} catch (error) {
			logger.error('Error in createCarModel controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating car model');
		}
	}

	async updateCarModel(req, res) {
		try {
			const { id } = req.params;
			const { brandId, modelName } = req.body;

			if (!id) {
				return res.handler.badRequest({}, 'Car model ID is required');
			}

			const updatedModel = await carModelService.updateCarModel(id, brandId, modelName);
			return res.handler.success(updatedModel, 'Car model updated successfully');
		} catch (error) {
			logger.error('Error in updateCarModel controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating car model');
		}
	}

	async deleteCarModel(req, res) {
		try {
			const { id } = req.params;

			if (!id) {
				return res.handler.badRequest({}, 'Car model ID is required');
			}

			await carModelService.deleteCarModel(id);
			return res.handler.success({}, 'Car model deleted successfully');
		} catch (error) {
			logger.error('Error in deleteCarModel controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting car model');
		}
	}
}

export default CarModelController;

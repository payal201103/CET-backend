import JobCardService from '../services/jobCard.service.js';
import logger from '../utils/logger.js';

const jobCardService = new JobCardService();

class JobCardController {
	async getAllJobCards(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const jobCards = await jobCardService.getAllJobCards(userId, userRole);
			return res.handler.success(jobCards, 'Job cards fetched successfully');
		} catch (error) {
			logger.error('Error in getAllJobCards controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching job cards');
		}
	}

	async createJobCard(req, res) {
		try {
			const createdBy = req.user?.userId;
			const newJobCard = await jobCardService.createJobCard(req.body, createdBy);
			return res.handler.success(newJobCard, 'Job card created successfully');
		} catch (error) {
			logger.error('Error in createJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating job card');
		}
	}

	async updateJobCard(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Job Card ID is required');
			}

			const updatedJobCard = await jobCardService.updateJobCard(id, req.body, userId, userRole);
			return res.handler.success(updatedJobCard, 'Job card updated successfully');
		} catch (error) {
			logger.error('Error in updateJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating job card');
		}
	}

	async deleteJobCard(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Job Card ID is required');
			}

			await jobCardService.deleteJobCard(id, userId, userRole);
			return res.handler.success({}, 'Job card deleted successfully');
		} catch (error) {
			logger.error('Error in deleteJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting job card');
		}
	}

	async completeJobCard(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Job Card ID is required');
			}

			const result = await jobCardService.completeJobCard(id, userId, userRole);
			return res.handler.success(result, 'Job card marked as completed');
		} catch (error) {
			logger.error('Error in completeJobCard controller', { error });
			return res.handler.serverError({}, error.message || 'Error completing job card');
		}
	}
}

export default JobCardController;

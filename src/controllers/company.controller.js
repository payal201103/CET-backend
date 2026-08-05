import CompanyService from '../services/company.service.js';
import logger from '../utils/logger.js';

const companyService = new CompanyService();

class CompanyController {
	async getAllCompanies(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const companies = await companyService.getAllCompanies(userId, userRole);
			return res.handler.success(companies, 'Companies fetched successfully');
		} catch (error) {
			logger.error('Error in getAllCompanies controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching companies');
		}
	}

	async createCompany(req, res) {
		try {
			const { companyName, mobileNumber, gstin, address } = req.body;
			const createdBy = req.user?.userId;

			const companyData = {
				companyName,
				mobileNumber,
				gstin,
				address,
				createdBy,
			};

			const newCompany = await companyService.createCompany(companyData);
			return res.handler.success(newCompany, 'Company created successfully');
		} catch (error) {
			logger.error('Error in createCompany controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating company');
		}
	}

	async deleteCompany(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Company ID is required');
			}

			await companyService.deleteCompany(id, userId, userRole);
			return res.handler.success({}, 'Company deleted successfully');
		} catch (error) {
			logger.error('Error in deleteCompany controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting company');
		}
	}
}

export default CompanyController;

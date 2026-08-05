import CompanyModel from '../models/company.model.js';

const companyModel = new CompanyModel();

class CompanyService {
	async getAllCompanies(userId, userRole) {
		return await companyModel.getAllCompanies(userId, userRole);
	}

	async createCompany(companyData) {
		const result = await companyModel.createCompany(companyData);
		return {
			id: result.id,
			name: companyData.companyName,
			mobile: companyData.mobileNumber,
			gstin: companyData.gstin,
			address: companyData.address,
			createdBy: companyData.createdBy,
		};
	}

	async deleteCompany(id, userId, userRole) {
		return await companyModel.deleteCompany(id, userId, userRole);
	}
}

export default CompanyService;

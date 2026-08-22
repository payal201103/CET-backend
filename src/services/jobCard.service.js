import JobCardModel from '../models/jobCard.model.js';

const jobCardModel = new JobCardModel();

class JobCardService {
	async getAllJobCards(userId, userRole, branchId) {
		const rows = await jobCardModel.getAllJobCards(userId, userRole, branchId);
		return rows.map((row) => ({
			id: row.id,
			jobCardNo: row.jobCardNo,
			customerId: row.customerId,
			customer: row.customer,
			phone: row.phone,
			brandId: row.brandId,
			carBrand: row.carBrand,
			modelId: row.modelId,
			carModel: row.carModel,
			vehicle: row.vehicle,
			carNumber: row.carNumber || '',
			carColor: row.carColor || '',
			company: row.company || 'Exotic',
			employee: row.employee || 'Unassigned',
			status: row.status,
			service: row.services ? row.services.split(',') : [],
			bookingDate: row.bookingDate ? new Date(row.bookingDate).toISOString().slice(0, 16) : '',
			deliveryDate: row.deliveryDate ? new Date(row.deliveryDate).toISOString().slice(0, 16) : '',
			notes: row.notes || '',
			date: row.createdAt ? new Date(row.createdAt).toISOString().slice(0, 10) : '',
			createdBy: row.createdBy,
			branchId: row.branchId,
		}));
	}

	async createJobCard(jobCardData, createdBy, branchId) {
		const result = await jobCardModel.createJobCard(jobCardData, createdBy, branchId);
		return {
			id: result.id,
			jobCardNo: result.jobCardNo,
			branchId: result.branchId,
			...jobCardData,
		};
	}

	async updateJobCard(id, jobCardData, userId, userRole, branchId) {
		await jobCardModel.updateJobCard(id, jobCardData, userId, userRole, branchId);
		return {
			id,
			...jobCardData,
		};
	}

	async deleteJobCard(id, userId, userRole, branchId) {
		return await jobCardModel.deleteJobCard(id, userId, userRole, branchId);
	}

	async completeJobCard(id, userId, userRole, branchId) {
		return await jobCardModel.completeJobCard(id, userId, userRole, branchId);
	}

	async getJobCardById(id, userId, userRole, branchId) {
		const cards = await this.getAllJobCards(userId, userRole, branchId);
		return cards.find((c) => c.id === Number(id));
	}
}

export default JobCardService;

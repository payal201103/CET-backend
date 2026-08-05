import JobCardModel from '../models/jobCard.model.js';

const jobCardModel = new JobCardModel();

class JobCardService {
	async getAllJobCards(userId, userRole) {
		const rows = await jobCardModel.getAllJobCards(userId, userRole);
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
		}));
	}

	async createJobCard(jobCardData, createdBy) {
		const result = await jobCardModel.createJobCard(jobCardData, createdBy);
		return {
			id: result.id,
			jobCardNo: result.jobCardNo,
			...jobCardData,
		};
	}

	async updateJobCard(id, jobCardData, userId, userRole) {
		await jobCardModel.updateJobCard(id, jobCardData, userId, userRole);
		return {
			id,
			...jobCardData,
		};
	}

	async deleteJobCard(id, userId, userRole) {
		return await jobCardModel.deleteJobCard(id, userId, userRole);
	}

	async completeJobCard(id, userId, userRole) {
		return await jobCardModel.completeJobCard(id, userId, userRole);
	}
}

export default JobCardService;

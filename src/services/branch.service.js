import BranchModel from '../models/branch.model.js';

const branchModel = new BranchModel();

class BranchService {
	async getAllBranches() {
		const rows = await branchModel.getAllBranches();
		return rows.map((row) => ({
			branchId: row.branchId,
			branchName: row.branchName,
			city: row.city || '',
			isActive: row.isActive === 1 || row.isActive === true,
		}));
	}

	async createBranch(branchData) {
		const result = await branchModel.createBranch(branchData);
		return {
			branchId: result.branchId,
			branchName: result.branchName,
			city: result.city || '',
			isActive: result.isActive === 1 || result.isActive === true,
		};
	}
}

export default BranchService;

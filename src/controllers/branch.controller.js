import BranchService from '../services/branch.service.js';
import logger from '../utils/logger.js';

const branchService = new BranchService();

class BranchController {
	async getAllBranches(req, res) {
		try {
			const branches = await branchService.getAllBranches();
			return res.handler.success(branches, 'Branches fetched successfully');
		} catch (error) {
			logger.error('Error in getAllBranches controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching branches');
		}
	}

	async createBranch(req, res) {
		try {
			const userRole = (req.user?.roleName || '').trim().toLowerCase();
			if (userRole !== 'super admin' && userRole !== 'superadmin') {
				return res.handler.forbidden({}, 'Only Super Admin can create a branch');
			}

			const { branchName, city } = req.body;
			if (!branchName) {
				return res.handler.badRequest({}, 'Branch Name is required');
			}

			const newBranch = await branchService.createBranch({ branchName, city });
			return res.handler.success(newBranch, 'Branch created successfully');
		} catch (error) {
			logger.error('Error in createBranch controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating branch');
		}
	}
}

export default BranchController;

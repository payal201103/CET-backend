import UserService from '../services/user.service.js';
import logger from '../utils/logger.js';

const userService = new UserService();

class UserController {
	async getAllUsers(req, res) {
		try {
			const userRole = req.user?.roleName || '';
			const userId = req.user?.userId;
			const branchId = req.branchId;
			const users = await userService.getAllUsers(userRole, userId, branchId);
			return res.handler.success(users, 'Users fetched successfully');
		} catch (error) {
			logger.error('Error in getAllUsers controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching users');
		}
	}

	async createUser(req, res) {
		try {
			const { firstName, lastName, username, password, role } = req.body;
			const createdBy = req.user?.userId;
			const branchId = req.branchId;

			const userData = {
				firstName,
				lastName,
				username,
				password,
				role,
				createdBy,
				branchId,
			};

			const newUser = await userService.createUser(userData);
			return res.handler.success(newUser, 'User created successfully');
		} catch (error) {
			logger.error('Error in createUser controller', { error });
			if (error.message === 'Username already exists') {
				return res.handler.badRequest({}, error.message);
			}
			return res.handler.serverError({}, error.message || 'Error creating user');
		}
	}

	async deleteUser(req, res) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.handler.badRequest({}, 'User ID is required');
			}

			await userService.deleteUser(id);
			return res.handler.success({}, 'User deleted successfully');
		} catch (error) {
			logger.error('Error in deleteUser controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting user');
		}
	}

	async resetPassword(req, res) {
		try {
			const userRole = (req.user?.roleName || '').trim().toLowerCase();
			const { targetUserId, userId, newPassword } = req.body;
			const idToReset = targetUserId || userId || req.params.id;

			if (userRole !== 'super admin' && userRole !== 'superadmin' && Number(idToReset) !== Number(req.user?.userId)) {
				return res.handler.forbidden({}, 'Only Super Admin can reset other user passwords');
			}

			if (!idToReset) {
				return res.handler.badRequest({}, 'Target User ID is required');
			}

			if (!newPassword) {
				return res.handler.badRequest({}, 'New Password is required');
			}

			await userService.resetPassword(idToReset, newPassword);
			return res.handler.success({}, 'User password reset successfully');
		} catch (error) {
			logger.error('Error in resetPassword controller', { error });
			return res.handler.serverError({}, error.message || 'Error resetting password');
		}
	}
}

export default UserController;

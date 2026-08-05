import UserService from '../services/user.service.js';
import logger from '../utils/logger.js';

const userService = new UserService();

class UserController {
	async getAllUsers(req, res) {
		try {
			const userRole = req.user?.roleName || '';
			const userId = req.user?.userId;
			const users = await userService.getAllUsers(userRole, userId);
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

			const userData = {
				firstName,
				lastName,
				username,
				password,
				role,
				createdBy,
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
}

export default UserController;

import UserModel from '../models/user.model.js';

const userModel = new UserModel();

class UserService {
	async getAllUsers(userRole, userId) {
		return await userModel.getAllUsers(userRole, userId);
	}

	async createUser(userData) {
		const existingUser = await userModel.getUserByUsername(userData.username);
		if (existingUser) {
			throw new Error('Username already exists');
		}
		const result = await userModel.createUser(userData);
		return {
			id: result.id,
			username: userData.username,
			role: userData.role,
			firstName: userData.firstName,
			lastName: userData.lastName,
			createdBy: userData.createdBy,
		};
	}

	async deleteUser(userId) {
		return await userModel.deleteUser(userId);
	}
}

export default UserService;

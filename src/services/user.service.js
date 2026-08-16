import bcrypt from 'bcrypt';
import UserModel from '../models/user.model.js';

const userModel = new UserModel();

class UserService {
	async getAllUsers(userRole, userId, branchId) {
		return await userModel.getAllUsers(userRole, userId, branchId);
	}

	async createUser(userData) {
		const existingUser = await userModel.getUserByUsername(userData.username);
		if (existingUser) {
			throw new Error('Username already exists');
		}
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const result = await userModel.createUser({ ...userData, password: hashedPassword });
		return {
			id: result.id,
			username: userData.username,
			role: userData.role,
			firstName: userData.firstName,
			lastName: userData.lastName,
			createdBy: userData.createdBy,
			branchId: userData.branchId,
		};
	}

	async deleteUser(userId) {
		return await userModel.deleteUser(userId);
	}

	async resetPassword(targetUserId, newPassword) {
		if (!newPassword || newPassword.trim().length < 4) {
			throw new Error('New password must be at least 4 characters long');
		}
		const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
		return await userModel.resetPassword(targetUserId, hashedPassword);
	}
}

export default UserService;

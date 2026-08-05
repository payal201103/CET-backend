import AuthModel from '../models/auth.model.js';

const authModel = new AuthModel();

class AuthService {
	async getUserByUserName(userName) {
		return await authModel.getUserByUserName(userName);
	}

	async createSession(userId, token, ipAddress) {
		return await authModel.createSession(userId, token, ipAddress);
	}

	async checkUserSession(userId, token) {
		return authModel.checkUserSession(userId, token);
	}

	async logout(userId, token) {
		return await authModel.updateUserSession(userId, token);
	}
}

export default AuthService;

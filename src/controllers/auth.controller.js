import AuthService from '../services/auth.service.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const authService = new AuthService();

class AuthController {
	async login(req, res) {
		try {
			const { userName, passWord } = req.body;
			const ipAddress = req.ip;

			if (!userName || !passWord) {
				return res.handler.badRequest({}, 'Username and Password are required');
			}

			const userData = await authService.getUserByUserName(userName);

			if (!userData || !userData.password) {
				return res.handler.unauthorized({}, 'Invalid Credentials');
			}

			const isMatch = passWord === userData.password;

			if (!isMatch) {
				return res.handler.unauthorized({}, 'Invalid Credentials');
			}

			const userId = userData.userId;
			const token = jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

			const session = await authService.createSession(userId, token, ipAddress);
			return res.handler.success(session, 'Login successful');
		} catch (error) {
			logger.error('Error in login controller', { error });
			return res.handler.serverError({}, error.message || 'Error in login controller');
		}
	}

	async logout(req, res) {
		try {
			const userId = req.user.userId;
			const token = req.headers.authorization?.split(' ')[1];

			await authService.logout(userId, token);

			return res.handler.success({}, 'Logged out successfully');
		} catch (error) {
			logger.error('Error in logout controller', { error });
			return res.handler.serverError({}, error.message || 'Error in logout controller');
		}
	}
}

export default AuthController;

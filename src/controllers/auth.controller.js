import bcrypt from 'bcrypt';
import AuthService from '../services/auth.service.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const authService = new AuthService();

class AuthController {
	async login(req, res) {
		try {
			const userName = req.body.userName || req.body.username;
			const passWord = req.body.passWord || req.body.password;
			const ipAddress = req.ip;

			if (!userName || !passWord) {
				return res.handler.badRequest({}, 'Username and Password are required');
			}

			const userData = await authService.getUserByUserName(userName);

			if (!userData || !userData.password) {
				return res.handler.unauthorized({}, 'Invalid Credentials');
			}

			const isMatch = userData.password.startsWith('$2b$') || userData.password.startsWith('$2a$')
				? await bcrypt.compare(passWord, userData.password)
				: passWord === userData.password;

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

	async sendOtp(req, res) {
		try {
			const userName = req.body.userName || req.body.username || req.body.identifier;

			if (!userName) {
				return res.handler.badRequest({}, 'Username or Mobile Number is required');
			}

			const otpData = await authService.sendOtp(userName);
			logger.info(`OTP generated for ${userName}: ${otpData.otpCode}`);

			return res.handler.success(
				{ username: otpData.username, otpCode: otpData.otpCode, expiresInMinutes: 10 },
				`OTP sent successfully to registered mobile/email. (Testing Code: ${otpData.otpCode})`
			);
		} catch (error) {
			logger.error('Error in sendOtp controller', { error });
			return res.handler.badRequest({}, error.message || 'Error sending OTP');
		}
	}

	async resetPasswordWithOtp(req, res) {
		try {
			const userName = req.body.userName || req.body.username;
			const { otp, newPassword, confirmPassword } = req.body;

			if (!userName || !otp || !newPassword || !confirmPassword) {
				return res.handler.badRequest({}, 'Username, OTP, New Password, and Confirm Password are required');
			}

			await authService.resetPasswordWithOtp({
				userName,
				otp,
				newPassword,
				confirmPassword,
			});

			return res.handler.success({}, 'Password reset successfully. Please login with your new password.');
		} catch (error) {
			logger.error('Error in resetPasswordWithOtp controller', { error });
			return res.handler.badRequest({}, error.message || 'Error resetting password');
		}
	}
}

export default AuthController;

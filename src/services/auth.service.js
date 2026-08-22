import bcrypt from 'bcrypt';
import AuthModel from '../models/auth.model.js';
import sendRealSms from '../utils/sms.util.js';

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

	async sendOtp(userName) {
		const user = await authModel.getUserByUserName(userName);
		if (!user) {
			throw new Error('User account not found with this username or mobile number');
		}

		const roleNorm = (user.roleName || '').trim().toLowerCase();
		if (roleNorm !== 'super admin' && roleNorm !== 'superadmin') {
			throw new Error('Password reset via OTP is allowed ONLY for Super Admin account');
		}

		const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

		await authModel.saveOtp(user.userName, otpCode, expiresAt);

		const targetMobile = /^\d{10}$/.test(userName) ? userName : (user.mobileNo || userName);
		const smsResult = await sendRealSms(targetMobile, otpCode);

		return {
			username: user.userName,
			mobile: targetMobile,
			otpCode,
			expiresInMinutes: 10,
			smsResult,
		};
	}

	async resetPasswordWithOtp({ userName, otp, newPassword, confirmPassword }) {
		if (!newPassword || newPassword.trim().length < 4) {
			throw new Error('New password must be at least 4 characters long');
		}

		if (newPassword !== confirmPassword) {
			throw new Error('New password and confirm password do not match');
		}

		const user = await authModel.getUserByUserName(userName);
		if (!user) {
			throw new Error('User account not found');
		}

		const roleNorm = (user.roleName || '').trim().toLowerCase();
		if (roleNorm !== 'super admin' && roleNorm !== 'superadmin') {
			throw new Error('Password reset is allowed ONLY for Super Admin account');
		}

		const isValidOtp = await authModel.verifyOtp(user.userName, otp);
		if (!isValidOtp) {
			throw new Error('Invalid or expired OTP');
		}

		const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
		await authModel.updatePasswordByUsername(user.userName, hashedPassword);
		return true;
	}
}

export default AuthService;

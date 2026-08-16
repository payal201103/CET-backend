import sql from 'mssql';
import { executeQuery } from '../database/index.js';

export const authModel = {
	async getUserByUserName(userName) {
		const result = await executeQuery(
			`SELECT userID as userId, username as userName, password, role as roleName, Firstname, Lastname, mobileNo, branchId 
			 FROM users 
			 WHERE LOWER(RTRIM(LTRIM(username))) = LOWER(RTRIM(LTRIM(@userName)))
			    OR RTRIM(LTRIM(mobileNo)) = RTRIM(LTRIM(@userName))`,
			[{ name: 'userName', type: sql.VarChar(100), value: userName }]
		);
		return result[0];
	},

	async createSession(userId, token, ipAddress) {
		await executeQuery(
			'INSERT INTO session_master (userId, token, ipAddress) VALUES (@userId, @token, @ipAddress)',
			[
				{ name: 'userId', type: sql.Int, value: Number(userId) },
				{ name: 'token', type: sql.VarChar(512), value: token },
				{ name: 'ipAddress', type: sql.VarChar(25), value: ipAddress },
			]
		);

		const result = await executeQuery(
			'SELECT userID as userId, role as roleName, username as userName, @token as token, Firstname, Lastname, branchId FROM users WHERE userID = @userId',
			[
				{ name: 'userId', type: sql.Int, value: Number(userId) },
				{ name: 'token', type: sql.VarChar(512), value: token },
			]
		);
		return result[0];
	},

	async checkUserSession(userId, token) {
		const result = await executeQuery(
			`SELECT TOP 1 
				sm.userId, 
				u.username as userName, 
				u.role as roleName, 
				u.Firstname,
				u.Lastname,
				u.branchId,
				sm.token, 
				sm.logoutType, 
				sm.createdAt 
			 FROM session_master sm 
			 INNER JOIN users u ON u.userID = sm.userId 
			 WHERE sm.userId = @userId AND sm.token = @token AND sm.logoutType IS NULL 
			 ORDER BY sm.sessionId DESC`,
			[
				{ name: 'userId', type: sql.Int, value: Number(userId) },
				{ name: 'token', type: sql.VarChar(512), value: token },
			]
		);
		return result[0];
	},

	async updateUserSession(userId, token) {
		return executeQuery(
			"UPDATE session_master SET logoutType = 'logged_out', updatedAt = SYSDATETIME() WHERE userId = @userId AND token = @token",
			[
				{ name: 'userId', type: sql.Int, value: Number(userId) },
				{ name: 'token', type: sql.VarChar(512), value: token },
			]
		);
	},

	async saveOtp(userName, otpCode, expiresAt) {
		return executeQuery(
			'INSERT INTO otp_verifications (username, otpCode, expiresAt) VALUES (@userName, @otpCode, @expiresAt)',
			[
				{ name: 'userName', type: sql.VarChar(100), value: userName },
				{ name: 'otpCode', type: sql.VarChar(10), value: otpCode },
				{ name: 'expiresAt', type: sql.DateTime, value: new Date(expiresAt) },
			]
		);
	},

	async verifyOtp(userName, otpCode) {
		const result = await executeQuery(
			`SELECT TOP 1 id FROM otp_verifications 
			 WHERE LOWER(RTRIM(LTRIM(username))) = LOWER(RTRIM(LTRIM(@userName))) 
			   AND otpCode = @otpCode 
			   AND isUsed = 0 
			   AND expiresAt >= SYSDATETIME() 
			 ORDER BY id DESC`,
			[
				{ name: 'userName', type: sql.VarChar(100), value: userName },
				{ name: 'otpCode', type: sql.VarChar(10), value: otpCode },
			]
		);

		if (result && result[0]) {
			await executeQuery('UPDATE otp_verifications SET isUsed = 1 WHERE id = @id', [
				{ name: 'id', type: sql.Int, value: result[0].id },
			]);
			return true;
		}

		return false;
	},

	async updatePasswordByUsername(userName, hashedPassword) {
		return executeQuery(
			'UPDATE users SET password = @password, updatedAt = SYSDATETIME() WHERE LOWER(RTRIM(LTRIM(username))) = LOWER(RTRIM(LTRIM(@userName)))',
			[
				{ name: 'password', type: sql.VarChar(255), value: hashedPassword },
				{ name: 'userName', type: sql.VarChar(100), value: userName },
			]
		);
	},
};

export default class AuthModel {
	getUserByUserName(userName) { return authModel.getUserByUserName(userName); }
	createSession(userId, token, ipAddress) { return authModel.createSession(userId, token, ipAddress); }
	checkUserSession(userId, token) { return authModel.checkUserSession(userId, token); }
	updateUserSession(userId, token) { return authModel.updateUserSession(userId, token); }
	saveOtp(userName, otpCode, expiresAt) { return authModel.saveOtp(userName, otpCode, expiresAt); }
	verifyOtp(userName, otpCode) { return authModel.verifyOtp(userName, otpCode); }
	updatePasswordByUsername(userName, hashedPassword) { return authModel.updatePasswordByUsername(userName, hashedPassword); }
}


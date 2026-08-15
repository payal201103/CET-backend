import sql from 'mssql';
import { executeQuery } from '../database/index.js';

export const authModel = {
	async getUserByUserName(userName) {
		const result = await executeQuery(
			'SELECT userID as userId, username as userName, password, role as roleName, Firstname, Lastname FROM users WHERE username = @userName',
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
			'SELECT userID as userId, role as roleName, username as userName, @token as token, Firstname, Lastname FROM users WHERE userID = @userId',
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
};

export default class AuthModel {
	getUserByUserName(userName) { return authModel.getUserByUserName(userName); }
	createSession(userId, token, ipAddress) { return authModel.createSession(userId, token, ipAddress); }
	checkUserSession(userId, token) { return authModel.checkUserSession(userId, token); }
	updateUserSession(userId, token) { return authModel.updateUserSession(userId, token); }
}


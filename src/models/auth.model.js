import sql from 'mssql';
import { executeQuery } from '../database/index.js';
import logger from '../utils/logger.js';

class AuthModel {
	async getUserByUserName(userName) {
		try {
			const result = await executeQuery(
				'SELECT userID as userId, username as userName, password, role as roleName, Firstname, Lastname FROM users WHERE username = @userName',
				[{ name: 'userName', type: sql.VarChar(100), value: userName }]
			);
			return result[0];
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async createSession(userId, token, ipAddress) {
		try {
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
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async checkUserSession(userId, token) {
		try {
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
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async updateUserSession(userId, token) {
		try {
			const result = await executeQuery(
				"UPDATE session_master SET logoutType = 'logged_out', updatedAt = SYSDATETIME() WHERE userId = @userId AND token = @token",
				[
					{ name: 'userId', type: sql.Int, value: Number(userId) },
					{ name: 'token', type: sql.VarChar(512), value: token },
				]
			);
			return result;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}

export default AuthModel;

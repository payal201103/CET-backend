import sql from 'mssql';
import { executeQuery, executeStoredProcedure } from '../database/index.js';

export const userModel = {
	async getAllUsers(userRole, userId) {
		const params = [
			{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
			{ name: 'CurrentUserId', type: sql.Int, value: userId },
		];
		return executeStoredProcedure('sp_GetUsersByRole', params);
	},

	async getUserByUsername(username) {
		const query = 'SELECT userID as id, username FROM users WHERE username = @username';
		const result = await executeQuery(query, [
			{ name: 'username', type: sql.VarChar(100), value: username },
		]);
		return result[0];
	},

	async createUser(userData) {
		const query = `
			INSERT INTO users (username, password, role, Firstname, Lastname, createdBy)
			VALUES (@username, @password, @role, @firstName, @lastName, @createdBy);
			SELECT SCOPE_IDENTITY() as id;
		`;
		const params = [
			{ name: 'username', type: sql.VarChar(100), value: userData.username },
			{ name: 'password', type: sql.VarChar(255), value: userData.password },
			{ name: 'role', type: sql.VarChar(50), value: userData.role },
			{ name: 'firstName', type: sql.VarChar(100), value: userData.firstName },
			{ name: 'lastName', type: sql.VarChar(100), value: userData.lastName },
			{ name: 'createdBy', type: sql.Int, value: userData.createdBy || null },
		];
		const result = await executeQuery(query, params);
		return result[0];
	},

	async deleteUser(userId) {
		const query = 'DELETE FROM users WHERE userID = @userId';
		return executeQuery(query, [{ name: 'userId', type: sql.Int, value: Number(userId) }]);
	},
};

export default class UserModel {
	getAllUsers(userRole, userId) { return userModel.getAllUsers(userRole, userId); }
	getUserByUsername(username) { return userModel.getUserByUsername(username); }
	createUser(userData) { return userModel.createUser(userData); }
	deleteUser(userId) { return userModel.deleteUser(userId); }
}

